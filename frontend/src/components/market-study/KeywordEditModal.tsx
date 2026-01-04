import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { text, palettes } from '../../config/colors';
import type { KeywordResponse } from '../../dto';
import type { KeywordGroup } from '../../services/types';

interface KeywordEditModalProps {
  keyword: KeywordResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (keywordId: string, data: { generic?: boolean; group?: KeywordGroup | null; reason?: string }) => Promise<void>;
  isSaving: boolean;
}

const groupOptions: { value: KeywordGroup | 'none'; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'next', label: 'Next' },
  { value: 'too_difficult', label: 'Too Difficult' },
  { value: 'none', label: 'None' },
];

export function KeywordEditModal({ keyword, isOpen, onClose, onSave, isSaving }: KeywordEditModalProps) {
  const [generic, setGeneric] = useState<boolean>(keyword?.generic ?? false);
  const [group, setGroup] = useState<KeywordGroup | null>(keyword?.group ?? null);
  const [reason, setReason] = useState<string>(keyword?.reason ?? '');

  // Update internal state when keyword changes
  useEffect(() => {
    if (keyword) {
      setGeneric(keyword.generic);
      setGroup(keyword.group);
      setReason(keyword.reason ?? '');
    }
  }, [keyword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;

    await onSave(keyword.id, {
      generic,
      group,
      reason: reason.trim() || undefined,
    });
  };

  const handleGroupChange = (value: string) => {
    if (value === 'none') {
      setGroup(null);
    } else {
      setGroup(value as KeywordGroup);
    }
  };

  if (!keyword) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Keyword" maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Keyword Display */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: text.primary }}>
            Keyword
          </label>
          <div 
            className="px-4 py-3 rounded-lg font-medium"
            style={{ 
              backgroundColor: palettes.dusty.dusty0,
              color: text.primary 
            }}
          >
            {keyword.keyword}
          </div>
        </div>

        {/* Generic Toggle */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: text.primary }}>
            Keyword Type
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setGeneric(false)}
              className="flex-1 px-4 py-3 rounded-2xl border-2 transition-all duration-200 font-medium"
              style={{
                borderColor: !generic ? palettes.green.green3 : palettes.dusty.dusty1,
                backgroundColor: !generic ? palettes.green.green0 : 'transparent',
                color: !generic ? palettes.green.green4 : text.subtle,
              }}
            >
              Brand
            </button>
            <button
              type="button"
              onClick={() => setGeneric(true)}
              className="flex-1 px-4 py-3 rounded-2xl border-2 transition-all duration-200 font-medium"
              style={{
                borderColor: generic ? palettes.purple.purple3 : palettes.dusty.dusty1,
                backgroundColor: generic ? palettes.purple.purple0 : 'transparent',
                color: generic ? palettes.purple.purple4 : text.subtle,
              }}
            >
              Generic
            </button>
          </div>
        </div>

        {/* Group Selection */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: text.primary }}>
            Group
          </label>
          <Dropdown
            value={group ?? 'none'}
            options={groupOptions}
            onChange={handleGroupChange}
            placeholder="Select a group"
          />
        </div>

        {/* Reason Text */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: text.primary }}>
            Reason
            <span className="text-xs ml-2" style={{ color: text.subtle }}>
              (optional)
            </span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason for the classification..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
            style={{
              borderColor: palettes.dusty.dusty1,
              backgroundColor: 'white',
              color: text.primary,
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 ">
          <Button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            style={{
              backgroundColor: 'transparent',
              color: text.subtle,
              border: `1px solid ${palettes.dusty.dusty1}`,
            }}
            className="hover:scale-105 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            style={{
              backgroundColor: palettes.teal.teal3,
              color: 'white',
            }}
            className="hover:scale-105 transition-all duration-200"
          >
            {isSaving ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

