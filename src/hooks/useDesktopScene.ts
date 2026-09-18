import { useEffect, useState } from "react";

export function useDesktopScene(): boolean {
  const [desktop, setDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 821px)").matches : true
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 821px)");
    const update = () => setDesktop(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return desktop;
}
