"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./use-auth";

interface EditModeState {
  /** True once auth has resolved and we know whether this visitor is staff. */
  ready: boolean;
  /** Signed in as admin or editor — can see the edit toggle at all. */
  canEdit: boolean;
  /** Admin only — can publish draft content. Editors can still edit, just not flip status to published. */
  canPublish: boolean;
  /** Whether edit mode is currently switched on (persists across page navigation this session). */
  editMode: boolean;
  setEditMode: (on: boolean) => void;
}

const EditModeContext = createContext<EditModeState>({
  ready: false,
  canEdit: false,
  canPublish: false,
  editMode: false,
  setEditMode: () => {},
});

const STORAGE_KEY = "spicy-mama-edit-mode";

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const { loading, isStaff, role } = useAuth();
  const [editMode, setEditModeState] = useState(false);

  useEffect(() => {
    // One-time sync from a browser API on mount (not derivable from props/state
    // during render) — the documented exception to "don't setState in effects".
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditModeState(sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // Storage unavailable — default to off.
    }
  }, []);

  function setEditMode(on: boolean) {
    setEditModeState(on);
    try {
      sessionStorage.setItem(STORAGE_KEY, on ? "1" : "0");
    } catch {
      // Ignore — the toggle still works for this page view.
    }
  }

  const value: EditModeState = {
    ready: !loading,
    canEdit: isStaff,
    canPublish: role === "admin",
    editMode: isStaff && editMode,
    setEditMode,
  };

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}

export function useEditMode() {
  return useContext(EditModeContext);
}
