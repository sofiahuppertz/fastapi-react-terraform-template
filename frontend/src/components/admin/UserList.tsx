import type { UserResponse } from '../../dto';
import { UserCard } from './UserCard';
import { EmptyUsersState } from './EmptyUsersState';

interface UserListProps {
  users: UserResponse[];
  currentUserEmail: string;
  onDelete: (userId: string) => void;
  onCreateClick: () => void;
}

export function UserList({
  users,
  currentUserEmail,
  onDelete,
  onCreateClick,
}: UserListProps) {
  if (users.length === 0) {
    return <EmptyUsersState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="space-y-4 pt-12" >
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onDelete={() => onDelete(user.id)}
          isCurrentUser={user.email === currentUserEmail}
        />
      ))}
    </div>
  );
}

