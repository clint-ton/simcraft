"use client";

import { useEffect, useState } from "react";

export default function DesktopAppLink() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(
      !!(window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__
    );
  }, []);

  if (isDesktop) return null;

  return (
    <a
      href="https://github.com/sortbek/simcraft/releases/latest"
      target="_blank"
      rel="noopener noreferrer"
      className="px-3 py-1.5 text-[13px] font-medium text-gold hover:text-white rounded-md transition-colors flex items-center gap-1.5"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12V3M5 9l3 3 3-3M3 14h10" />
      </svg>
      Desktop App
    </a>
  );
}
