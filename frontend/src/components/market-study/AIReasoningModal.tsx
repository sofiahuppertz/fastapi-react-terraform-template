import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { text, palettes } from '../../config/colors';

interface AIReasoningModalProps {
  isOpen: boolean;
  onClose: () => void;
  reasoning: string | null;
}

export function AIReasoningModal({ isOpen, onClose, reasoning }: AIReasoningModalProps) {
  if (!isOpen) return null;

  const scrollbarStyles = `
    .ai-reasoning-content::-webkit-scrollbar {
      width: 8px;
    }
    .ai-reasoning-content::-webkit-scrollbar-track {
      background: transparent;
    }
    .ai-reasoning-content::-webkit-scrollbar-thumb {
      background: ${palettes.purple.purple1};
      border-radius: 4px;
    }
    .ai-reasoning-content::-webkit-scrollbar-thumb:hover {
      background: ${palettes.purple.purple2};
    }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-white/50 backdrop-blur-sm"
        />
      
      {/* Modal */}
      <div
        className="relative rounded-2xl border shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderColor: palettes.purple.purple1,
          maxHeight: '90vh'
        }}
      >
        {/* Fixed Header */}
        <div className="flex items-center space-x-3 p-6 pb-4  flex-shrink-0" style={{ borderColor: palettes.dusty.dusty1 }}>
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: palettes.purple.purple0,
              color: palettes.purple.purple2
            }}
          >
            <span className="text-lg font-bold">AI</span>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-mono font-semibold" style={{ color: text.primary }}>
              Metadata Generation Strategy
            </h3>
            <p className="text-sm" style={{ color: text.subtle }}>
              AI's reasoning for the generated app metadata
            </p>
          </div>
          
          {/* Close button - top right */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 flex-shrink-0"
            style={{
              backgroundColor: palettes.grey.grey0,
              color: text.subtle
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = palettes.grey.grey1;
              e.currentTarget.style.color = text.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = palettes.grey.grey0;
              e.currentTarget.style.color = text.subtle;
            }}
          >
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 pt-4 shadow-sm">
          <div
            className="ai-reasoning-content p-4 rounded-xl overflow-y-auto border"
            style={{
              backgroundColor: palettes.purple.purple0,
              borderColor: palettes.purple.purple1,
              maxHeight: '60vh',
              scrollbarWidth: 'thin',
              scrollbarColor: `${palettes.purple.purple1} transparent`
            }}
          >
            <p className="text-sm leading-loose font-space whitespace-pre-wrap" style={{ color: text.secondary }}>
              {reasoning || 'No reasoning available'}
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

