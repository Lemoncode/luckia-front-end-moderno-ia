import { useState, type ReactNode } from "react";
import { ViewContext } from "./compact-context";

interface ViewProviderProps {
  children: ReactNode;
}

export function ViewProvider({ children }: ViewProviderProps) {
  const [compact, setCompact] = useState(false);

  function toggleCompact() {
    setCompact((previous) => !previous);
  }

  return (
    <ViewContext.Provider value={{ compact, toggleCompact }}>
      {children}
    </ViewContext.Provider>
  );
}
