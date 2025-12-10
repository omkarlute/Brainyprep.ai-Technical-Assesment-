'use client';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

type Ctx = { open: boolean; onOpenChange?: (o: boolean) => void };
const DialogCtx = React.createContext<Ctx | null>(null);

export function Dialog({
  open,
  onOpenChange,
  children,
}: React.PropsWithChildren<{ open: boolean; onOpenChange?: (o: boolean) => void }>) {
  return <DialogCtx.Provider value={{ open, onOpenChange }}>{children}</DialogCtx.Provider>;
}

export function DialogContent({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  const ctx = React.useContext(DialogCtx);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!ctx?.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') ctx?.onOpenChange?.(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ctx]);

  if (!ctx?.open || !mounted) return null;

  return ReactDOM.createPortal(
    <div
      aria-modal
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-black/40"
        onClick={() => ctx.onOpenChange?.(false)}
      />
      <div
        className={
          'relative z-10 w-full max-w-2xl rounded-xl border bg-white p-6 shadow-xl ' +
          (className ?? '')
        }
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={'mb-3 ' + (className ?? '')}>{children}</div>;
}

export function DialogTitle({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <h3 className={'text-lg font-semibold leading-none ' + (className ?? '')}>{children}</h3>;
}

export function DialogDescription({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <p className={'text-sm text-gray-600 ' + (className ?? '')}>{children}</p>;
}

export function DialogFooter({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={'mt-4 flex items-center justify-end gap-2 ' + (className ?? '')}>{children}</div>;
}
