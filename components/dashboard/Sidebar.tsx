"use client";

import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";

function Block({ type }: { type: "hero" | "card" }) {
  const [isDragging, setIsDragging] = useState(false);

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `sidebar-${type}`,
    data: { type },
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    if (listeners?.onPointerDown) {
      listeners.onPointerDown(e as any);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className={`border p-3 rounded bg-white shadow-sm hover:bg-gray-50 transition ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      ⋮⋮ {type.toUpperCase()}
    </div>
  );
}

export default function Sidebar({
  cardsPerRow,
  setCardsPerRow,
}: {
  cardsPerRow: number;
  setCardsPerRow: (n: number) => void;
}) {
  return (
    <aside className="w-64 border-r p-4 space-y-3 bg-gray-100 rounded-l-xl">
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Sections</h2>
        <Block type="hero" />
        <Block type="card" />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Card Layout
        </h2>

        <div className=" bg-white p-4 rounded-lg shadow-lg border">
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setCardsPerRow(n)}
                className={`px-3 py-2 text-sm rounded transition cursor-pointer ${
                  cardsPerRow === n
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {n} Col
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
