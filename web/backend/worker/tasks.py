import json
import logging

from arq.connections import RedisSettings
from sqlalchemy import select

from config import settings
from database import async_session, init_db
from models import Job, JobStatus
from services.result_parser import parse_simc_result, parse_top_gear_result
from services.simc import run_simc, run_simc_staged

logger = logging.getLogger(__name__)


async def run_simulation(ctx: dict, job_id: str):
    """ARQ task: run a SimulationCraft simulation for the given job."""
    await init_db()

    async with async_session() as session:
        result = await session.execute(select(Job).where(Job.id == job_id))
        job = result.scalar_one_or_none()
        if not job:
            logger.error(f"Job {job_id} not found")
            return

        job.status = JobStatus.RUNNING
        await session.commit()

        try:
            sim_options = {
                "iterations": job.iterations,
                "fight_style": job.fight_style,
                "target_error": job.target_error,
                "sim_type": job.sim_type,
            }

            if job.sim_type == "top_gear":
                combo_count = 0
                combo_metadata = {}
                if job.combo_metadata_json:
                    try:
                        pre_data = json.loads(job.combo_metadata_json)
                        combo_count = pre_data.get("_combo_count", 0)
                        combo_metadata = pre_data.get("_combo_metadata", {})
                    except (json.JSONDecodeError, TypeError):
                        pass

                raw_result = await run_simc_staged(
                    job_id=job.id,
                    simc_input=job.simc_input,
                    options=sim_options,
                    combo_count=combo_count,
                )
                parsed = parse_top_gear_result(raw_result, combo_metadata)
            else:
                raw_result = await run_simc(
                    job_id=job.id,
                    simc_input=job.simc_input,
                    options=sim_options,
                )
                parsed = parse_simc_result(raw_result)

            job.result_json = json.dumps(parsed)
            job.status = JobStatus.DONE
            logger.info(f"Job {job_id} completed: {parsed.get('dps', 0)} DPS")

        except Exception as e:
            logger.exception(f"Job {job_id} failed")
            job.error_message = "Simulation failed. Please check your input and try again."
            job.status = JobStatus.FAILED

        await session.commit()


class WorkerSettings:
    functions = [run_simulation]
    redis_settings = RedisSettings.from_dsn(settings.REDIS_URL)
    max_jobs = 4
    job_timeout = 600
