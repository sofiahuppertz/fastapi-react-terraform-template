import { ReactNode, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { palettes } from '../../config/colors';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export function Modal({ isOpen, onClose, title, children, footer, maxWidth = 'md' }: ModalProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-white/10 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-2xl shadow-md ${maxWidthClasses[maxWidth]} w-full border transform transition-all`} style={{ borderColor: palettes.teal.teal3 }}>
          <div className="flex items-center justify-between p-6 pb-0">
            <h3 className="text-xl font-semibold font-space" style={{ color: '#3A3C3D' }}>{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-grey-50 transition-all" style={{ color: '#A2A6A9' }} onMouseEnter={(e) => e.currentTarget.style.color = '#5B5D5F'} onMouseLeave={(e) => e.currentTarget.style.color = '#A2A6A9'}
            >
              <FontAwesomeIcon icon={faXmark} className="text-lg" />
            </button>
          </div>
          <div className="p-6">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-3 p-6 border-t" style={{ borderColor: palettes.teal.teal3 }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}