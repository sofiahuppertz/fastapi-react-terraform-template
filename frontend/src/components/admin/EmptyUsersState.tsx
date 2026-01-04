import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { text, palettes } from '../../config/colors';

interface EmptyUsersStateProps {
  onCreateClick: () => void;
}

export function EmptyUsersState({ onCreateClick }: EmptyUsersStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: palettes.purple.purple0 }}
      >
        <FontAwesomeIcon
          icon={faUsers}
          className="h-12 w-12"
          style={{ color: palettes.purple.purple3 }}
        />
      </div>
      <h3
        className="text-xl font-medium mb-2 font-space"
        style={{ color: text.primary }}
      >
        No Users Yet
      </h3>
      <p
        className="text-center mb-6 max-w-md font-satoshi"
        style={{ color: text.subtle }}
      >
        Start by creating your first user to manage access to the platform.
      </p>
      <button
        onClick={onCreateClick}
        className="px-6 py-3 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105"
        style={{
          backgroundColor: palettes.purple.purple3,
          color: 'white',
        }}
      >
        Create First User
      </button>
    </div>
  );
}

