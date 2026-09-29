import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBlocker } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

function stableSerialize(value) {
  return JSON.stringify(value);
}

/**
 * Compares live builder state to the last saved MongoDB snapshot.
 */
export function useDirtyProjectState(projectName, websiteData, savedSnapshot) {
  return useMemo(() => {
    if (!websiteData || !savedSnapshot) {
      return false;
    }

    const current = stableSerialize({
      name: projectName.trim(),
      websiteData,
    });

    return current !== savedSnapshot;
  }, [projectName, websiteData, savedSnapshot]);
}

/**
 * Blocks in-app navigation + tab close/refresh when isDirty is true.
 * Shows ConfirmDialog: "You have unsaved changes..."
 */
export function UnsavedChangesGuard({ isDirty }) {
  const [leaveOpen, setLeaveOpen] = useState(false);
  const confirmingLeaveRef = useRef(false);

  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        isDirty && currentLocation.pathname !== nextLocation.pathname,
      [isDirty],
    ),
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setLeaveOpen(true);
    }
  }, [blocker.state]);

  useEffect(() => {
    if (!isDirty) {
      return undefined;
    }

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  function handleOpenChange(open) {
    // Cancel / Escape: stay on the builder. Skip reset when user confirmed leave
    // (ConfirmDialog also calls onOpenChange(false) after onConfirm).
    if (!open && blocker.state === 'blocked' && !confirmingLeaveRef.current) {
      blocker.reset?.();
    }
    if (!open) {
      confirmingLeaveRef.current = false;
    }
    setLeaveOpen(open);
  }

  function handleConfirmLeave() {
    confirmingLeaveRef.current = true;
    setLeaveOpen(false);
    if (blocker.state === 'blocked') {
      blocker.proceed?.();
    }
  }

  return (
    <ConfirmDialog
      open={leaveOpen}
      onOpenChange={handleOpenChange}
      title="Unsaved changes"
      description="You have unsaved changes. Do you want to leave without saving?"
      confirmText="Leave without saving"
      cancelText="Stay and keep editing"
      destructive
      onConfirm={handleConfirmLeave}
    />
  );
}

export function createSavedSnapshot(projectName, websiteData) {
  return stableSerialize({
    name: (projectName || '').trim(),
    websiteData,
  });
}
