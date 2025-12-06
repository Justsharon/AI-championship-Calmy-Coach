import React, { useEffect, useRef, useState } from "react";
import type { GenerateResponse } from "../types";
import { ResponseCard } from "./ResponseCard";

interface Props {
  data: GenerateResponse;
  onSave: (id: string, text: string, tone: string) => void;
  saving: boolean;
}

export const ResponseGrid: React.FC<Props> = ({ data, onSave, saving }) => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // keyboard navigation: left/right/up/down and Enter to save
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!gridRef.current) return;
      const count = data.responses.length;
      if (count === 0) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setFocusedIndex((i) => (i === null ? 0 : Math.min(count - 1, i + 1)));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setFocusedIndex((i) => (i === null ? 0 : Math.max(0, i - 1)));
      }
      if (e.key === "Enter" && focusedIndex !== null) {
        const r = data.responses[focusedIndex];
        onSave(r!.id, r!.text, r!.tone);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [data.responses, focusedIndex, onSave]);

  useEffect(() => {
    if (focusedIndex === null) return;
    const cards = gridRef.current?.querySelectorAll('[role="article"]');
    const el = cards?.[focusedIndex] as HTMLElement | undefined;
    if (el) el.focus();
  }, [focusedIndex]);

  return (
    <div ref={gridRef} className="masonry-grid">
      {data.responses.map((r, i) => (
        <div
          key={r.id}
          tabIndex={0}
          className={`masonry-item ${
            focusedIndex === i ? "ring-2 ring-indigo-300" : ""
          }`}
        >
          <ResponseCard
            response={r}
            onSave={onSave}
            saving={saving}
            situationDescription={""}
            detectedContext={"work"}
          />
        </div>
      ))}

      <style>{`
.masonry-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
@media (min-width: 1024px) { .masonry-grid { grid-auto-rows: 10px; } .masonry-item { break-inside: avoid; } }
`}</style>
    </div>
  );
};
