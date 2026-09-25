"use client";

import { useEffect, useState } from "react";

/** La hora actual, renovada cada `intervalMs`: así una respuesta como "Hoy." pasa a "Mañana." al llegar el corte. */
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
