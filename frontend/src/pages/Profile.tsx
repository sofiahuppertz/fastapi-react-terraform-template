import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { text, palettes, primary, semantic } from '../config/colors';
import { authService } from '../services';
import { toast } from '../utils/toast';
import Breadcrumb from '../components/ui/Breadcrumb';

export function Profile() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userEmail = localStorage.getItem('user_email') || '';
  const isSuperuser = localStorage.getItem('is_superuser') === 'true';

  const isFormValid = () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      return false;
    }
    if (newPassword.length < 8 || newPassword.length > 72) {
      return false;
    }
    if (newPassword !== confirmPassword) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Please fill all fields correctly');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to update password');
        return;
      }

      await authService.updatePassword(
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        token
      );

      toast.success('Password updated successfully');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Failed to update password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0 mb-8">
        <Breadcrumb
          items={[
            { label: 'Profile', isActive: true },
          ]}
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* User Info Card */}
        <div
          className="rounded-2xl border shadow-sm p-8"
          style={{
            borderColor: palettes.sky.sky1,
            backgroundColor: 'white',
          }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <div
              className="h-16 w-16 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: palettes.sky.sky0,
                color: primary.sky,
              }}
            >
              <FontAwesomeIcon icon={faUser} className="h-8 w-8" />
            </div>
            <div>
              <h2
                className="text-2xl font-semibold font-space"
                style={{ color: text.primary }}
              >
                User Information
              </h2>
              <p
                className="text-sm font-satoshi mt-1"
                style={{ color: text.subtle }}
              >
                View your account details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2 font-space"
                style={{ color: text.secondary }}
              >
                Email Address
              </label>
              <div
                className="px-4 py-3 rounded-xl border font-mono"
                style={{
                  borderColor: palettes.sky.sky1,
                  backgroundColor: palettes.sky.sky0 + '30',
                  color: text.primary,
                }}
              >
                {userEmail}
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2 font-space"
                style={{ color: text.secondary }}
              >
                Account Type
              </label>
              <div className="flex items-center space-x-2">
                <span
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border font-space"
                  style={{
                    backgroundColor: isSuperuser ? palettes.purple.purple0 : palettes.sky.sky0,
                    color: isSuperuser ? palettes.purple.purple4 : palettes.sky.sky4,
                    borderColor: isSuperuser ? palettes.purple.purple2 : palettes.sky.sky2,
                  }}
                >
                  {isSuperuser ? 'Administrator' : 'Standard User'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div
          className="rounded-2xl border shadow-sm p-8"
          style={{
            borderColor: palettes.teal.teal1,
            backgroundColor: 'white',
          }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <div
              className="h-16 w-16 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: palettes.teal.teal0,
                color: primary.teal,
              }}
            >
              <FontAwesomeIcon icon={faLock} className="h-8 w-8" />
            </div>
            <div>
              <h2
                className="text-2xl font-semibold font-space"
                style={{ color: text.primary }}
              >
                Change Password
              </h2>
              <p
                className="text-sm font-satoshi mt-1"
                style={{ color: text.subtle }}
              >
                Update your password to keep your account secure
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium mb-2 font-space"
                style={{ color: text.primary }}
              >
                Current Password <span style={{ color: semantic.danger }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 font-satoshi"
                  style={{
                    borderColor: palettes.teal.teal1,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = palettes.teal.teal2;
                    e.currentTarget.style.outline = `2px solid ${palettes.teal.teal0}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = palettes.teal.teal1;
                    e.currentTarget.style.outline = 'none';
                  }}
                  placeholder="Enter your current password"
                  required
                  disabled={submitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors duration-200"
                  style={{ color: text.subtle }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = text.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = text.subtle;
                  }}
                >
                  <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium mb-2 font-space"
                style={{ color: text.primary }}
              >
                New Password <span style={{ color: semantic.danger }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 font-satoshi"
                  style={{
                    borderColor: palettes.teal.teal1,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = palettes.teal.teal2;
                    e.currentTarget.style.outline = `2px solid ${palettes.teal.teal0}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = palettes.teal.teal1;
                    e.currentTarget.style.outline = 'none';
                  }}
                  placeholder="Enter new password (8-72 characters)"
                  required
                  minLength={8}
                  maxLength={72}
                  disabled={submitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors duration-200"
                  style={{ color: text.subtle }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = text.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = text.subtle;
                  }}
                >
                  <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs mt-1 font-satoshi" style={{ color: text.subtle }}>
                Password must be between 8 and 72 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium mb-2 font-space"
                style={{ color: text.primary }}
              >
                Confirm New Password <span style={{ color: semantic.danger }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 font-satoshi"
                  style={{
                    borderColor: palettes.teal.teal1,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = palettes.teal.teal2;
                    e.currentTarget.style.outline = `2px solid ${palettes.teal.teal0}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = palettes.teal.teal1;
                    e.currentTarget.style.outline = 'none';
                  }}
                  placeholder="Confirm your new password"
                  required
                  disabled={submitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors duration-200"
                  style={{ color: text.subtle }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = text.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = text.subtle;
                  }}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                </button>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs mt-1 font-satoshi" style={{ color: semantic.danger }}>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting || !isFormValid()}
                className="w-full px-6 py-3 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: primary.teal,
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  if (!submitting && isFormValid()) {
                    e.currentTarget.style.backgroundColor = palettes.teal.teal3;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting && isFormValid()) {
                    e.currentTarget.style.backgroundColor = primary.teal;
                  }
                }}
              >
                <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                <span>{submitting ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

