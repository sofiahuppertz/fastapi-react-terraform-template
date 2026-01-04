import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faList,
  faPlus,
  faUsers,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import SlideTabNavigation from '../components/ui/SlideTabNavigation';
import { Modal } from '../components/ui/Modal';
import Breadcrumb from '../components/ui/Breadcrumb';
import { adminService } from '../services';
import type { UserResponse } from '../dto';
import { text, palettes, primary } from '../config/colors';
import { UserList, UserCreateForm } from '../components/admin';
import { toast } from '../utils/toast';

export function Admin() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Current user email for comparison
  const currentUserEmail = localStorage.getItem('user_email') || '';

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to view users');
        return;
      }

      const response = await adminService.getUsers(token);
      setUsers(response);
    } catch (error: any) {
      console.error('Failed to load users:', error);
      toast.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to delete users');
        return;
      }

      await adminService.deleteUser(id, token);
      setUsers(users.filter((u) => u.id !== id));
      
      toast.success('User deleted successfully');
      setDeleteModal(null);
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to create users');
        return;
      }

      const newUser = await adminService.createUser(
        {
          email,
          password,
          is_superuser: isSuperuser,
        },
        token
      );

      if (newUser) {
        setUsers([...users, newUser]);
        toast.success('User created successfully');
        
        // Reset form
        setEmail('');
        setPassword('');
        setIsSuperuser(false);
        setActiveTab('list');
      }
    } catch (error: any) {
      console.error('Failed to create user:', error);
      toast.error(error.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelCreate = () => {
    setEmail('');
    setPassword('');
    setIsSuperuser(false);
    setActiveTab('list');
  };

  const tabs = [
    { key: 'list' as const, label: 'View', icon: faList },
    { key: 'create' as const, label: 'New', icon: faPlus },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <Breadcrumb
          items={[
            { label: 'Admin', isActive: true },
          ]}
        />
        {/* Tab Navigation */}
        <SlideTabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={(key) => setActiveTab(key as 'list' | 'create')}
        colorScheme={{
          background: palettes.purple.purple0 + '40',
          border: palettes.purple.purple1,
          activeBackground: palettes.purple.purple3,
          activeText: 'white',
          inactiveText: palettes.purple.purple4,
        }}
        />
      </div>

      

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <FontAwesomeIcon
            icon={faSpinner}
            className="animate-spin h-6 w-6"
            style={{
              color: palettes.purple.purple3,
            }}
          />
        </div>
      ) : (
        <>
          {activeTab === 'list' && (
            <UserList
              users={users}
              currentUserEmail={currentUserEmail}
              onDelete={(userId) => setDeleteModal(userId)}
              onCreateClick={() => setActiveTab('create')}
            />
          )}

          {activeTab === 'create' && (  
              <UserCreateForm
                email={email}
                password={password}
                isSuperuser={isSuperuser}
                submitting={submitting}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onIsSuperuserChange={setIsSuperuser}
                onSubmit={handleCreateUser}
                onCancel={handleCancelCreate}
              />
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal !== null}
        onClose={() => setDeleteModal(null)}
        title="Delete User"
        maxWidth="sm"
      >
        <div className="p-6">
          <p
            className="mb-6 font-satoshi"
            style={{
              color: text.primary,
            }}
          >
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => deleteModal && deleteUser(deleteModal)}
              className="flex-1 px-6 py-3 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105"
              style={{
                backgroundColor: palettes.danger.danger3,
                color: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = palettes.danger.danger4;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = palettes.danger.danger3;
              }}
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteModal(null)}
              className="flex-1 px-6 py-3 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105 border"
              style={{
                backgroundColor: palettes.grey.grey0,
                color: text.primary,
                border: `1px solid ${palettes.grey.grey2}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = palettes.grey.grey1;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = palettes.grey.grey0;
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

