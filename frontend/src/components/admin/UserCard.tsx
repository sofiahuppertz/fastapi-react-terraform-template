import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShieldAlt, faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import { text, palettes, semantic } from '../../config/colors';
import type { UserResponse } from '../../dto';

interface UserCardProps {
  user: UserResponse;
  onDelete: () => void;
  isCurrentUser: boolean;
}

export function UserCard({ user, onDelete, isCurrentUser }: UserCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className="group rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md"
      style={{
        borderColor: user.is_superuser ? palettes.purple.purple2 : palettes.success.success1,
        borderWidth: '1px',
        backgroundColor: 'white',
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: user.is_superuser
                  ? palettes.purple.purple0
                  : palettes.success.success0,
              }}
            >
              <FontAwesomeIcon
                icon={user.is_superuser ? faShieldAlt : faUser}
                className="text-lg"
                style={{
                  color: user.is_superuser
                    ? palettes.purple.purple3
                    : palettes.success.success3,
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3
                  className="font-large truncate font-mono"
                  style={{
                    color: text.primary,
                  }}
                >
                  {user.email}
                </h3>
                {user.is_superuser && (
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border font-space"
                    style={{
                      backgroundColor: palettes.purple.purple0,
                      color: palettes.purple.purple4,
                      borderColor: palettes.purple.purple3,
                    }}
                  >
                    <FontAwesomeIcon icon={faShieldAlt} className="h-3 w-3 mr-1" />
                    Admin
                  </span>
                )}
                {isCurrentUser && (
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border font-space"
                    style={{
                      backgroundColor: palettes.success.success0,
                      color: semantic.success,
                      borderColor: semantic.success,
                    }}
                  >
                    You
                  </span>
                )}
              </div>
              <div
                className="flex items-center space-x-4 mt-1 text-sm font-satoshi"
                style={{
                  color: text.subtle,
                }}
              >
                <span className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                  <span>Created {formatDate(user.created_at)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {!isCurrentUser && (
              <button
                onClick={onDelete}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                style={{
                  backgroundColor: 'transparent',
                  color: semantic.danger + '95',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = semantic.danger + '95';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = semantic.danger + '95';
                }}
                title="Delete user"
              >
                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

