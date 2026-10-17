import { createContext } from "react";

interface ViewContextValue {
  compact: boolean;
  toggleCompact: () => void;
}

export const ViewContext = createContext<ViewContextValue | null>(null);
