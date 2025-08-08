import { useState, useEffect } from "react";

export function useNavigatorState(initialOpen = false) {
  const [navigatorOpen, setNavigatorOpen] = useState(() => {
    const stored = localStorage.getItem("navigatorOpen");
    return stored !== null ? JSON.parse(stored) : !initialOpen;
  });

  useEffect(() => {
    localStorage.setItem("navigatorOpen", JSON.stringify(navigatorOpen));
  }, [navigatorOpen]);

  return [navigatorOpen, setNavigatorOpen];
}
