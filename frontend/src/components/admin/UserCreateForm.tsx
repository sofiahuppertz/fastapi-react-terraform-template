import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { text, palettes, primary, semantic } from '../../config/colors';
import { Tooltip } from '../ui/Tooltip';

interface UserCreateFormProps {
  email: string;
  password: string;
  isSuperuser: boolean;
  submitting: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onIsSuperuserChange: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function UserCreateForm({
  email,
  password,
  isSuperuser,
  submitting,
  onEmailChange,
  onPasswordChange,
  onIsSuperuserChange,
  onSubmit,
  onCancel,
}: UserCreateFormProps) {
  const isFormValid = () => {
    if (!email.trim() || !password.trim()) return false;
    if (password.length < 8 || password.length > 72) return false;
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    return true;
  };

  return (
    <div className="p-12">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="create-email"
              className="block text-sm font-medium mb-2 font-space"
              style={{
                color: text.primary,
              }}
            >
              Email Address <span style={{ color: semantic.danger }}>*</span>
            </label>
            <input
              type="email"
              id="create-email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 font-satoshi"
              style={{
                borderColor: palettes.purple.purple2,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = palettes.purple.purple3;
                e.currentTarget.style.outline = `2px solid ${palettes.purple.purple1}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = palettes.purple.purple2;
                e.currentTarget.style.outline = 'none';
              }}
              placeholder="user@example.com"
              required
              disabled={submitting}
              autoComplete="off"
            />
          </div>

          <div>
            <label
              htmlFor="create-password"
              className="block text-sm font-medium mb-2 font-space flex items-center gap-2"
              style={{
                color: text.primary,
              }}
            >
              <span>
                Password <span style={{ color: semantic.danger }}>*</span>
              </span>
              <Tooltip
                content={
                  <div className="max-w-sm whitespace-normal">
                    Password must be between 8 and 72 characters long.
                  </div>
                }
                position="top"
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="h-4 w-4 cursor-help"
                  style={{
                    color: palettes.warning.warning2,
                  }}
                />
              </Tooltip>
            </label>
            <input
              type="password"
              id="create-password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 font-satoshi"
              style={{
                borderColor: palettes.purple.purple2,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = palettes.purple.purple3;
                e.currentTarget.style.outline = `2px solid ${palettes.purple.purple1}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = palettes.purple.purple2;
                e.currentTarget.style.outline = 'none';
              }}
              placeholder="Enter password (8-72 characters)"
              required
              minLength={8}
              maxLength={72}
              disabled={submitting}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isSuperuser}
                onChange={(e) => onIsSuperuserChange(e.target.checked)}
                disabled={submitting}
                className="w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer"
                style={{
                  borderColor: palettes.purple.purple2,
                  accentColor: palettes.purple.purple3,
                }}
              />
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-medium font-space"
                  style={{ color: text.primary }}
                >
                  Superuser
                </span>
                <Tooltip
                  content={
                    <div className="max-w-sm whitespace-normal">
                      Superusers have full access to all features including user management.
                    </div>
                  }
                  position="top"
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="h-4 w-4 cursor-help"
                    style={{
                      color: palettes.warning.warning2,
                    }}
                  />
                </Tooltip>
              </div>
            </label>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={submitting || !isFormValid()}
              className="flex-1 px-6 py-3 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: palettes.purple.purple3,
                color: 'white',
              }}
              onMouseEnter={(e) => {
                if (!submitting && isFormValid()) {
                  e.currentTarget.style.backgroundColor = palettes.purple.purple4;
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting && isFormValid()) {
                  e.currentTarget.style.backgroundColor = palettes.purple.purple3;
                }
              }}
            >
              <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
              <span>{submitting ? 'Creating...' : 'Create User'}</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 px-6 py-3 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed border"
              style={{
                backgroundColor: palettes.grey.grey0,
                color: text.primary,
                border: `1px solid ${palettes.grey.grey2}`,
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.currentTarget.style.backgroundColor = palettes.grey.grey1;
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.currentTarget.style.backgroundColor = palettes.grey.grey0;
                }
              }}
            >
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

