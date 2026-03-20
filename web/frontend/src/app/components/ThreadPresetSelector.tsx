"use client";

import { useEffect, useState } from "react";
import { API_URL } from "../lib/api";

const PRESETS = [
  { label: "Balanced", pct: 0.3, desc: "30% — keeps system responsive" },
  { label: "Performance", pct: 0.6, desc: "60% — good balance" },
  { label: "Maximum", pct: 0.9, desc: "90% — near full power" },
] as const;

interface ThreadPresetSelectorProps {
  value: number;
  onChange: (threads: number) => void;
}

export default function ThreadPresetSelector({
  value,
  onChange,
}: ThreadPresetSelectorProps) {
  const [maxThreads, setMaxThreads] = useState<number>(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const desktop = !!(window as unknown as { __TAURI_INTERNALS__?: unknown })
      .__TAURI_INTERNALS__;
    setIsDesktop(desktop);
    if (!desktop) return;

    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.threads) {
          setMaxThreads(data.threads);
          // Set default to Performance (60%) if no value set yet
          if (value === 0) {
            onChange(Math.max(1, Math.round(data.threads * 0.6)));
          }
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isDesktop || !maxThreads) return null;

  const selectedIdx = PRESETS.findIndex(
    (p) => Math.max(1, Math.round(maxThreads * p.pct)) === value
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-[13px] font-medium text-gray-400">
          CPU Threads
        </label>
        <span className="text-xs font-mono bg-surface-2 border border-border px-2 py-0.5 rounded text-white tabular-nums">
          {value}/{maxThreads}
        </span>
      </div>
      <div className="flex gap-1.5">
        {PRESETS.map((preset, idx) => {
          const threads = Math.max(1, Math.round(maxThreads * preset.pct));
          const active = selectedIdx === idx;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(threads)}
              className={`flex-1 py-2 px-2 rounded-lg text-center transition-all border ${
                active
                  ? "bg-white text-black border-white"
                  : "bg-surface-2 text-gray-400 border-border hover:border-gray-500 hover:text-white"
              }`}
            >
              <span className="text-[12px] font-medium block">{preset.label}</span>
              <span className={`text-[10px] block mt-0.5 ${active ? "text-gray-600" : "text-gray-600"}`}>
                {threads} threads
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
