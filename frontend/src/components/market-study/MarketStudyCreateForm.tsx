import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faSpinner, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { text, palettes, primary, semantic } from '../../config/colors';
import type { Country, AppStoreInfo } from '../../dto';
import { Dropdown } from '../ui/Dropdown';
import { Tooltip } from '../ui/Tooltip';

// Helper function to capitalize app store names properly
const formatAppStoreName = (name: string): string => {
  // Convert to lowercase first, then capitalize each word
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface MarketStudyCreateFormProps {
  country: string;
  appStore: string;
  appId: string;
  appContext: string;
  submitting: boolean;
  countries: Country[];
  appStores: AppStoreInfo[];
  onCountryChange: (country: string) => void;
  onAppStoreChange: (appStore: string) => void;
  onAppIdChange: (appId: string) => void;
  onAppContextChange: (appContext: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function MarketStudyCreateForm({
  country,
  appStore,
  appId,
  appContext,
  submitting,
  countries,
  appStores,
  onCountryChange,
  onAppStoreChange,
  onAppIdChange,
  onAppContextChange,
  onSubmit,
  onCancel,
}: MarketStudyCreateFormProps) {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2
            className="text-2xl mb-2 font-space"
            style={{
              color: text.primary
            }}
          >
            Create New Market Study
          </h2>
          <p
            className="font-satoshi"
            style={{
              color: text.secondary
            }}
          >
            Add a new market to analyze for your project
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="create-country"
                className="block text-sm font-medium mb-2 font-space"
                style={{
                  color: text.primary
                }}
              >
                Country <span style={{ color: semantic.danger }}>*</span>
              </label>
              <Dropdown
                id="create-country"
                value={country}
                options={countries
                  .sort((a, b) => a.display.localeCompare(b.display))
                  .map((c) => ({
                    value: c.name,
                    label: c.display,
                  }))}
                onChange={onCountryChange}
                placeholder="Select a country"
                disabled={submitting}
                searchable
              />
            </div>

            <div>
              <label
                htmlFor="create-app-store"
                className="block text-sm font-medium mb-2 font-space"
                style={{
                  color: text.primary
                }}
              >
                App Store <span style={{ color: semantic.danger }}>*</span>
              </label>
              <Dropdown
                id="create-app-store"
                value={appStore}
                options={appStores.map((store) => ({
                  value: store.code,
                  label: formatAppStoreName(store.name),
                }))}
                onChange={onAppStoreChange}
                placeholder="Select an app store"
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="create-app-id"
              className="block text-sm font-medium mb-2 font-space flex items-center gap-2"
              style={{
                color: text.primary
              }}
            >
              <span>App ID <span style={{ color: semantic.danger }}>*</span></span>
              <Tooltip
                content={
                  <div className="max-w-xs whitespace-normal">
                    The App ID can be found in the URL of the app page in the Play Store or App Store.
                    <br />
                    <span className="font-mono text-xs mt-1 block">
                      Look for: <strong>id=</strong>your.app.id
                    </span>
                  </div>
                }
                position="top"
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="h-4 w-4 cursor-help"
                  style={{
                    color: palettes.warning.warning2
                  }}
                />
              </Tooltip>
            </label>
            <input
              type="text"
              id="create-app-id"
              value={appId}
              onChange={(e) => onAppIdChange(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 font-satoshi"
              style={{
                borderColor: palettes.blue.blue2,
                outline: `2px solid ${palettes.blue.blue1}`
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primary.blue;
                e.currentTarget.style.outline = `2px solid ${primary.blue}40`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = palettes.blue.blue2;
                e.currentTarget.style.outline = 'none';
              }}
              placeholder="com.example.app"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="create-app-context"
              className="block text-sm font-medium mb-2 font-space flex items-center gap-2"
              style={{
                color: text.primary
              }}
            >
              <span>App Context</span>
              <Tooltip
                content={
                  <div className="max-w-sm whitespace-normal">
                    Provide additional context about your app to help improve keyword analysis and content generation.
                  </div>
                }
                position="top"
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="h-4 w-4 cursor-help"
                  style={{
                    color: palettes.warning.warning2
                  }}
                />
              </Tooltip>
            </label>
            <textarea
              id="create-app-context"
              value={appContext}
              onChange={(e) => onAppContextChange(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 font-satoshi resize-none"
              style={{
                borderColor: palettes.blue.blue2,
                outline: `2px solid ${palettes.blue.blue1}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primary.blue;
                e.currentTarget.style.outline = `2px solid ${primary.blue}40`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = palettes.blue.blue2;
                e.currentTarget.style.outline = 'none';
              }}
              placeholder="Describe your app, target audience, key features..."
              rows={4}
              disabled={submitting}
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={submitting || !appId.trim()}
              className="flex-1 px-6 py-3 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: primary.blue,
                color: 'white'
              }}
              onMouseEnter={(e) => {
                if (!submitting && appId.trim()) {
                  e.currentTarget.style.backgroundColor = palettes.blue.blue3;
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting && appId.trim()) {
                  e.currentTarget.style.backgroundColor = primary.blue;
                }
              }}
            >
              <FontAwesomeIcon 
                icon={submitting ? faSpinner : faCheck} 
                className={`h-4 w-4 ${submitting ? 'animate-spin' : ''}`} 
              />
              <span>{submitting ? '' : 'Create Market Study'}</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 px-6 py-3 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed border"
              style={{
                backgroundColor: palettes.grey.grey1,
                color: 'white',
                border: `1px solid ${palettes.grey.grey1}`
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.currentTarget.style.backgroundColor = palettes.grey.grey2;
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.currentTarget.style.backgroundColor = palettes.grey.grey1;
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

