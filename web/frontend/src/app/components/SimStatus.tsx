"use client";

import { useEffect, useState } from "react";

interface SimStatusProps {
  status: string;
  iterations: number;
}

const STATUS_MESSAGES: Record<string, string[]> = {
  pending: ["Queued…", "Waiting for a slot…"],
  running: [
    "Simulating…",
    "Crunching numbers…",
    "Almost there…",
  ],
};

export default function SimStatus({ status, iterations }: SimStatusProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fakeProgress, setFakeProgress] = useState(0);

  useEffect(() => {
    if (status === "done" || status === "failed") return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        const messages = STATUS_MESSAGES[status] || STATUS_MESSAGES.pending;
        return (prev + 1) % messages.length;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status !== "running") {
      if (status === "pending") setFakeProgress(5);
      return;
    }
    setFakeProgress(10);
    const estimatedMs = Math.min(iterations * 2, 30000);
    const interval = setInterval(() => {
      setFakeProgress((prev) => (prev >= 90 ? 90 : prev + (90 - prev) * 0.05));
    }, estimatedMs / 50);
    return () => clearInterval(interval);
  }, [status, iterations]);

  const messages = STATUS_MESSAGES[status] || STATUS_MESSAGES.pending;
  const currentMessage = messages[messageIndex % messages.length];

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="w-10 h-10 border-2 border-border border-t-gold rounded-full animate-spin" />
      <p className="text-sm text-muted">{currentMessage}</p>
      <div className="w-64">
        <div className="w-full bg-surface rounded-full h-1 overflow-hidden">
          <div
            className="bg-gold h-full rounded-full transition-all duration-500"
            style={{ width: `${fakeProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
