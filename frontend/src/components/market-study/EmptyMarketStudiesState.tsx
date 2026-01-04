import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faPlus } from '@fortawesome/free-solid-svg-icons';
import { text, palettes, primary } from '../../config/colors';

interface EmptyMarketStudiesStateProps {
  onCreateClick: () => void;
}

export function EmptyMarketStudiesState({ onCreateClick }: EmptyMarketStudiesStateProps) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border" style={{ borderColor: palettes.grey.grey1 }}>
      <div
        className="h-16 w-16 mx-auto mb-4 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: palettes.blue.blue1
        }}
      >
        <FontAwesomeIcon
          icon={faStore}
          className="h-8 w-8"
          style={{
            color: palettes.blue.blue3
          }}
        />
      </div>
      <h3
        className="text-lg font-medium mb-2 font-space"
        style={{
          color: text.primary
        }}
      >
        No Market Studies Yet
      </h3>
      <p
        className="mb-4 font-satoshi"
        style={{
          color: text.secondary
        }}
      >
        Create your first market study to start analyzing
      </p>
      <button
        onClick={onCreateClick}
        className="px-4 py-2 rounded-xl font-medium font-satoshi transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2"
        style={{
          backgroundColor: primary.blue,
          color: 'white'
        }}
      >
        <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
        <span>Create Market Study</span>
      </button>
    </div>
  );
}

