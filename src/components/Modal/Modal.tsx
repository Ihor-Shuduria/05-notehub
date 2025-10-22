import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const modalRootId = "modal-root";

function ensureModalRoot() {
  let el = document.getElementById(modalRootId);
  if (!el) {
    el = document.createElement("div");
    el.id = modalRootId;
    document.body.appendChild(el);
  }
  return el;
}

export default function Modal({ children, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const root = ensureModalRoot();

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div className={css.modal} onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    root
  );
}
