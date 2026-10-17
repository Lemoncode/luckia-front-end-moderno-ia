import { useContext } from "react";
import { ViewContext } from "../compact-context";

export function ViewToggle() {
  const view = useContext(ViewContext);
  if (view === null) throw new Error("ViewToggle necesita un ViewContext.Provider.");
  const { compact, toggleCompact } = view;

  return (
    <button onClick={toggleCompact} aria-pressed={compact}>
      Vista compacta
    </button>
  );
}
