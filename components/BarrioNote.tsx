"use client";

import { useEffect, useState } from "react";
import { deliveryAnswer, readBarrio, type BarrioChoice } from "@/lib/delivery";
import { useNow } from "@/lib/use-now";

/** Si ya eligió barrio en un producto, el home le responde lo mismo: "Pedí antes de las 14:00 y te llega hoy a Pocitos." */
export default function BarrioNote({ className = "" }: { className?: string }) {
  const [choice, setChoice] = useState<BarrioChoice | null>(null);
  const now = useNow();

  useEffect(() => {
    setChoice(readBarrio());
  }, []);

  if (!choice) return null;
  return <p className={`font-bold text-aqua-dark ${className}`}>{deliveryAnswer(choice, now).sentence}</p>;
}
