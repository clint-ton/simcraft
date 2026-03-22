use std::path::PathBuf;
use std::sync::Arc;

use simhammer_core::game_data;
use simhammer_core::server;
use simhammer_core::storage::JobStorage;

fn env_or(key: &str, default: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| default.to_string())
}

#[tokio::main]
async fn main() {
    let data_dir = PathBuf::from(env_or("DATA_DIR", "./data"));
    let simc_path = PathBuf::from(env_or("SIMC_PATH", "/usr/local/bin/simc"));
    let db_path = env_or("DATABASE_URL", "simhammer.db");
    let bind_host = env_or("BIND_HOST", "0.0.0.0");
    let port: u16 = env_or("PORT", "8000").parse().expect("PORT must be a number");
    let frontend_dir = std::env::var("FRONTEND_DIR").ok().map(PathBuf::from);

    println!("Loading game data from {:?}", data_dir);
    game_data::load(&data_dir);

    let storage: Arc<dyn JobStorage> = Arc::new(
        simhammer_core::storage::sqlite::SqliteStorage::new(&db_path)
    );

    println!("Starting SimHammer server on {}:{}", bind_host, port);
    server::start_with_storage_bind(storage, simc_path, &bind_host, port, frontend_dir).await;

    // Keep the server running
    tokio::signal::ctrl_c().await.ok();
}
