import { useEffect, useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

function ConfirmSpinner() {
  return <span className="confirm-dialog-spinner" aria-hidden="true" />;
}

/**
 * Accessible confirmation modal for intentional UX friction on sensitive actions.
 * Radix provides focus trap, Escape-to-close (blocked while loading), and portal rendering.
 */
export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  destructive = false,
  loading = false,
}) {
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (open) {
      setLocalError('');
    }
  }, [open]);

  function handleOpenChange(nextOpen) {
    // Prevent dismissing while an action is in flight (blocks Escape / outside close)
    if (loading && !nextOpen) {
      return;
    }
    if (!nextOpen) {
      setLocalError('');
    }
    onOpenChange?.(nextOpen);
  }

  async function handleConfirm(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLocalError('');

    try {
      await onConfirm?.();
      onOpenChange?.(false);
    } catch (err) {
      // Keep dialog open so the user can retry or cancel.
      setLocalError(
        err?.message || 'Something went wrong. Please try again.',
      );
    }
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={handleOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="confirm-dialog-overlay" />
        <AlertDialog.Content
          className="confirm-dialog-content"
          onEscapeKeyDown={(event) => {
            if (loading) {
              event.preventDefault();
            }
          }}
        >
          <AlertDialog.Title className="confirm-dialog-title">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="confirm-dialog-description">
            {description}
          </AlertDialog.Description>

          {localError ? (
            <p className="confirm-dialog-error error" role="alert">
              {localError}
            </p>
          ) : null}

          <div className="confirm-dialog-actions">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="btn btn-ghost-dark confirm-dialog-cancel"
                disabled={loading}
              >
                {cancelText}
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                type="button"
                className={
                  destructive
                    ? 'btn confirm-dialog-confirm confirm-dialog-confirm--destructive'
                    : 'btn btn-primary confirm-dialog-confirm'
                }
                onClick={handleConfirm}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <ConfirmSpinner />
                    <span>Please wait…</span>
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
