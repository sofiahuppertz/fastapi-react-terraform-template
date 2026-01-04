import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faPlus } from '@fortawesome/free-solid-svg-icons';
import { text, palettes, primary } from '../../config/colors';

interface EmptyProjectsStateProps {
  onCreateClick: () => void;
}

export function EmptyProjectsState({ onCreateClick }: EmptyProjectsStateProps) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border" style={{ borderColor: palettes.grey.grey1 }}>
      <div
        className="h-16 w-16 mx-auto mb-4 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: palettes.blue.blue1
        }}
      >
        <FontAwesomeIcon
          icon={faFolder}
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
        No Projects Yet
      </h3>
      <p
        className="mb-4 font-satoshi"
        style={{
          color: text.secondary
        }}
      >
        Create your first project to start organizing your work
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
        <span>Create Project</span>
      </button>
    </div>
  );
}

