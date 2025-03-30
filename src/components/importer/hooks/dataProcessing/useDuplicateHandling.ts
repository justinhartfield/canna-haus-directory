
import { useCallback } from 'react';

export function useDuplicateHandling(
  setShowDuplicatesModal: (show: boolean) => void
) {
  const handleCloseDuplicatesModal = useCallback(() => {
    setShowDuplicatesModal(false);
  }, [setShowDuplicatesModal]);

  const handleViewDuplicatesDetails = useCallback(() => {
    setShowDuplicatesModal(true);
  }, [setShowDuplicatesModal]);

  return {
    handleCloseDuplicatesModal,
    handleViewDuplicatesDetails
  };
}
