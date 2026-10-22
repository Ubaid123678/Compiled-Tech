"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GripVertical, ArrowUp, ArrowDown } from "lucide-react";

export type ReorderItem = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  status?: { label: string; published: boolean };
};

/**
 * Drag-to-reorder list for the admin. Native HTML5 drag events — no library.
 * The up/down buttons are not decoration: HTML5 drag doesn't fire on touch
 * and can't be driven by keyboard, so they're the accessible path.
 *
 * ponytail: desktop drag + coarse button moves, sized for admin lists of tens
 * of rows. Swap for @dnd-kit if touch dragging or virtualised hundreds matter.
 */
export function ReorderList({
  table,
  items: initialItems,
  editPath,
  deletePath,
  emptyLabel,
}: {
  table: "blogs" | "projects";
  items: ReorderItem[];
  /** Base path; the id is appended client-side. Plain strings only — functions
   *  can't cross the server→client boundary. */
  editPath: string;
  deletePath: string;
  emptyLabel: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();

  async function persist(next: ReorderItem[]) {
    setItems(next);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, ids: next.map((item) => item.id) }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Reorder failed");
      startTransition(() => router.refresh());
    } catch (error) {
      console.error(error);
      setItems(initialItems); // put it back rather than lie about the order
      alert(error instanceof Error ? error.message : "Reorder failed");
    } finally {
      setSaving(false);
    }
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    void persist(next);
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-night/50 rounded-[20px] border border-line">
        <p className="text-mist/60 text-lg">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-mist/60">
        Drag the handle to reorder — the site shows this order.
        {saving && <span className="ml-2 text-steel">Saving…</span>}
      </p>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={item.id}
            draggable
            onDragStart={(event) => {
              setDragIndex(index);
              event.dataTransfer.effectAllowed = "move";
              // Firefox refuses to start a drag without payload.
              event.dataTransfer.setData("text/plain", item.id);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setOverIndex(index);
            }}
            onDragLeave={() => setOverIndex((current) => (current === index ? null : current))}
            onDrop={(event) => {
              event.preventDefault();
              if (dragIndex !== null) move(dragIndex, index);
              setDragIndex(null);
              setOverIndex(null);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            className={`flex items-center gap-3 rounded-[12px] border bg-night px-3 py-3 transition-colors ${
              overIndex === index && dragIndex !== index ? "border-steel/70" : "border-line"
            } ${dragIndex === index ? "opacity-50" : ""}`}
          >
            <span
              className="cursor-grab text-mist/50 hover:text-steel active:cursor-grabbing"
              aria-hidden="true"
              title="Drag to reorder"
            >
              <GripVertical className="size-5" />
            </span>

            <span className="w-7 shrink-0 font-mono text-xs text-steel">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0 flex-1">
              <div className="truncate font-display font-semibold text-frost">{item.title}</div>
              {item.subtitle && (
                <div className="truncate text-sm text-mist/60">{item.subtitle}</div>
              )}
            </div>

            {item.meta && <span className="hidden shrink-0 text-sm text-mist/60 sm:block">{item.meta}</span>}

            {item.status && (
              <span
                className={`hidden shrink-0 font-display text-[0.72rem] uppercase tracking-[0.1em] sm:block ${
                  item.status.published ? "text-green-400" : "text-yellow-400"
                }`}
              >
                {item.status.label}
              </span>
            )}

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, index - 1)}
                disabled={index === 0}
                aria-label={`Move ${item.title} up`}
                className="rounded p-1.5 text-mist/60 hover:text-frost disabled:opacity-25 disabled:hover:text-mist/60"
              >
                <ArrowUp className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, index + 1)}
                disabled={index === items.length - 1}
                aria-label={`Move ${item.title} down`}
                className="rounded p-1.5 text-mist/60 hover:text-frost disabled:opacity-25 disabled:hover:text-mist/60"
              >
                <ArrowDown className="size-4" />
              </button>
              <Link href={`${editPath}/${item.id}/edit`} className="ml-2 text-sm font-display uppercase tracking-[0.1em] text-steel hover:text-frost">
                Edit
              </Link>
              <form action={`${deletePath}/${item.id}`} method="post">
                <button type="submit" className="ml-1 text-sm font-display uppercase tracking-[0.1em] text-red-400 hover:text-red-300">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
