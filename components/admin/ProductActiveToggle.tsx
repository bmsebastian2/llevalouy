"use client";

import { useState, useTransition } from "react";
import { toggleProductActive } from "@/app/admin/actions";

export default function ProductActiveToggle({ id, active }: { id: string; active: boolean }) {
  const [on, setOn] = useState(active);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !on;
    setOn(next);
    startTransition(async () => {
      const res = await toggleProductActive(id, next);
      if (res.error) {
        setOn(!next);
        alert(res.error);
      }
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      disabled={pending}
      className="flex shrink-0 flex-col items-center gap-1 disabled:opacity-60"
    >
      <span className={`relative h-7 w-12 rounded-full transition ${on ? "bg-aqua-dark" : "bg-ink/20"}`}>
        <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
      </span>
      <span className="text-[11px] font-bold text-ink/60">{on ? "Activo" : "Pausado"}</span>
    </button>
  );
}
