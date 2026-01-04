import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '../ui/Modal';
import { text, palettes, semantic } from '../../config/colors';

interface MarketStudyDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function MarketStudyDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: MarketStudyDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Market Study"
      footer={
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 border disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: palettes.grey.grey1,
              color: 'white',
              border: `1px solid ${palettes.grey.grey1}`
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: palettes.danger.danger2,
              color: 'white'
            }}
          >
            <FontAwesomeIcon 
              icon={isDeleting ? faSpinner : faTrash} 
              className={isDeleting ? 'animate-spin' : ''}
            />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      }
    >
      <p className="font-satoshi" style={{ color: text.subtle }}>
        Are you sure you want to delete this market study? This action cannot be undone and
        will delete all associated keywords and content.
      </p>
    </Modal>
  );
}

