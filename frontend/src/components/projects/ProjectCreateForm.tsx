import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { text, palettes, primary, semantic } from '../../config/colors';
import type { AppStore } from '../../services/types';
import type { Country, AppStoreInfo } from '../../dto';
import { Dropdown } from '../ui/Dropdown';
import { Tooltip } from '../ui/Tooltip';

// Helper function to capitalize app store names properly
const formatAppStoreName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export interface MarketStudyFormData {
  id: string;
  country: string;
  app_store: AppStore;
  app_id: string;
  app_context?: string;
}

interface ProjectCreateFormProps {
  projectName: string;
  projectDescription: string;
  globalContext: string;
  marketStudies: MarketStudyFormData[];
  countries: Country[];
  appStores: AppStoreInfo[];
  submitting: boolean;
  onProjectNameChange: (value: string) => void;
  onProjectDescriptionChange: (value: string) => void;
  onGlobalContextChange: (value: string) => void;
  onMarketStudiesChange: (studies: MarketStudyFormData[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ProjectCreateForm({
  projectName,
  projectDescription,
  globalContext,
  marketStudies,
  countries,
  appStores,
  submitting,
  onProjectNameChange,
  onProjectDescriptionChange,
  onGlobalContextChange,
  onMarketStudiesChange,
  onSubmit,
  onCancel,
}: ProjectCreateFormProps) {
  const [duplicateError, setDuplicateError] = useState<string>('');

  const handleAddMarketStudy = () => {
    const defaultCountry = countries.length > 0 ? countries[0].name : 'us';
    const defaultAppStore = appStores.length > 0 ? appStores[0].code : 'android';
    
    const newStudy: MarketStudyFormData = {
      id: `ms-${Date.now()}`,
      country: defaultCountry,
      app_store: defaultAppStore as AppStore,
      app_id: '',
      app_context: '',
    };
    onMarketStudiesChange([...marketStudies, newStudy]);
  };

  const handleRemoveMarketStudy = (id: string) => {
    onMarketStudiesChange(marketStudies.filter(ms => ms.id !== id));
    setDuplicateError('');
  };

  const handleMarketStudyChange = (id: string, field: keyof MarketStudyFormData, value: string) => {
    const updated = marketStudies.map(ms => 
      ms.id === id ? { ...ms, [field]: value } : ms
    );
    onMarketStudiesChange(updated);
    
    // Check for duplicates
    const hasDuplicates = checkForDuplicates(updated);
    if (hasDuplicates) {
      setDuplicateError('Duplicate market study detected (same app store, app ID, and country)');
    } else {
      setDuplicateError('');
    }
  };

  const checkForDuplicates = (studies: MarketStudyFormData[]): boolean => {
    const seen = new Set<string>();
    for (const study of studies) {
      if (!study.app_id) continue;
      const key = `${study.app_store}-${study.app_id}-${study.country}`;
      if (seen.has(key)) {
        return true;
      }
      seen.add(key);
    }
    return false;
  };

  const isFormValid = () => {
    if (!projectName.trim()) return false;
    if (duplicateError) return false;
    // Check that all market studies have required fields
    for (const study of marketStudies) {
      if (!study.app_id.trim() || !study.country || !study.app_store) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={onSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="create-name"
              className="block text-sm font-medium mb-2 font-space"
              style={{
                color: text.primary
              }}
            >
              Project Name *
            </label>
            <input
              type="text"
              id="create-name"
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 font-satoshi"
              style={{
                borderColor: palettes.blue.blue2,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primary.blue;
                e.currentTarget.style.outline = `2px solid ${palettes.blue.blue1}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = palettes.blue.blue2;
                e.currentTarget.style.outline = 'none';
              }}
              placeholder="Enter project name"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="create-description"
              className="block text-sm font-medium mb-2 font-space"
              style={{
                color: text.primary
              }}
            >
              Description
            </label>
            <textarea
              id="create-description"
              value={projectDescription}
              onChange={(e) => onProjectDescriptionChange(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 font-satoshi custom-scrollbar"
              style={{
                borderColor: palettes.blue.blue2,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primary.blue;
                e.currentTarget.style.outline = `2px solid ${palettes.blue.blue1}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = palettes.blue.blue2;
                e.currentTarget.style.outline = 'none';
              }}
              placeholder="Enter project description (optional)"
              rows={4}
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="create-global-context"
              className="block text-sm font-medium mb-2 font-space flex items-center gap-2"
              style={{
                color: text.primary
              }}
            >
              <span>Global Context</span>
              <Tooltip
                content={
                  <div className="max-w-sm whitespace-normal">
                    Provide context that applies to all market studies in this project. This helps improve analysis across all studies.
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
              id="create-global-context"
              value={globalContext}
              onChange={(e) => onGlobalContextChange(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 font-satoshi resize-none custom-scrollbar"
              style={{
                borderColor: palettes.blue.blue2,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primary.blue;
                e.currentTarget.style.outline = `2px solid ${palettes.blue.blue1}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = palettes.blue.blue2;
                e.currentTarget.style.outline = 'none';
              }}
              placeholder="Enter global context for all market studies (optional)"
              rows={3}
              disabled={submitting}
            />
          </div>

          {/* Market Studies Section */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium font-space" style={{ color: text.primary }}>
                  Market Studies
                </h3>
                <p className="text-sm font-space" style={{ color: text.subtle }}>
                  Add market studies to analyze different apps or markets
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMarketStudy}
                disabled={submitting}
                className="px-4 py-2 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 shadow-sm"
                style={{
                  backgroundColor: primary.teal,
                  color: 'white'
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                <span>Add Market Study</span>
              </button>
            </div>

            {duplicateError && (
              <div 
                className="mb-4 p-3 rounded-xl border font-satoshi text-sm"
                style={{
                  backgroundColor: palettes.danger.danger0,
                  borderColor: semantic.danger,
                  color: semantic.danger
                }}
              >
                {duplicateError}
              </div>
            )}

            <div className="space-y-4">
              {marketStudies.map((study, index) => (
                <div
                  key={study.id}
                  className="p-4 border rounded-xl hover:shadow-md shadow-sm"
                  style={{
                    borderColor: palettes.teal.teal1,
                    backgroundColor: palettes.sky.sky0 + '20',
                    transition: 'background-color 0.5s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = palettes.dusty.dusty0 + '80';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = palettes.sky.sky0 + '20';
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium font-space" style={{ color: text.primary }}>
                      Market Study #{index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveMarketStudy(study.id)}
                      disabled={submitting}
                      className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 transform hover:scale-105"
                      style={{
                        backgroundColor: 'transparent',
                        color: palettes.dusty.dusty2
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = palettes.dusty.dusty2 + '20';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 font-space" style={{ color: text.primary }}>
                        Country <span style={{ color: semantic.danger }}>*</span>
                      </label>
                      <Dropdown
                        value={study.country}
                        options={countries
                          .sort((a, b) => a.display.localeCompare(b.display))
                          .map((c) => ({
                            value: c.name,
                            label: c.display,
                          }))}
                        onChange={(value) => handleMarketStudyChange(study.id, 'country', value)}
                        placeholder="Select a country"
                        disabled={submitting}
                        searchable
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 font-space" style={{ color: text.primary }}>
                        App Store <span style={{ color: semantic.danger }}>*</span>
                      </label>
                      <Dropdown
                        value={study.app_store}
                        options={appStores.map((store) => ({
                          value: store.code,
                          label: formatAppStoreName(store.name),
                        }))}
                        onChange={(value) => handleMarketStudyChange(study.id, 'app_store', value)}
                        placeholder="Select an app store"
                        disabled={submitting}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1 font-space flex items-center gap-2" style={{ color: text.primary }}>
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
                        value={study.app_id}
                        onChange={(e) => handleMarketStudyChange(study.id, 'app_id', e.target.value)}
                        disabled={submitting}
                        placeholder="com.example.app"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent font-satoshi"
                        style={{ borderColor: palettes.blue.blue2 }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = primary.blue;
                          e.currentTarget.style.outline = `2px solid ${palettes.blue.blue1}`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = palettes.blue.blue2;
                          e.currentTarget.style.outline = 'none';
                        }}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1 font-space flex items-center gap-2" style={{ color: text.primary }}>
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
                        value={study.app_context || ''}
                        onChange={(e) => handleMarketStudyChange(study.id, 'app_context', e.target.value)}
                        disabled={submitting}
                        placeholder="Describe your app, target audience, key features..."
                        rows={2}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent font-satoshi resize-none custom-scrollbar"
                        style={{ borderColor: palettes.blue.blue2 }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = primary.blue;
                          e.currentTarget.style.outline = `2px solid ${palettes.blue.blue1}`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = palettes.blue.blue2;
                          e.currentTarget.style.outline = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={submitting || !isFormValid()}
              className="flex-1 px-6 py-3 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: primary.blue,
                color: 'white'
              }}
              onMouseEnter={(e) => {
                if (!submitting && isFormValid()) {
                  e.currentTarget.style.backgroundColor = palettes.blue.blue3;
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting && isFormValid()) {
                  e.currentTarget.style.backgroundColor = primary.blue;
                }
              }}
            >
              <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
              <span>{submitting ? 'Creating...' : 'Create Project'}</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 px-6 py-3 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed border"
              style={{
                backgroundColor: palettes.teal.teal1,
                color: 'white',
                border: `1px solid ${palettes.teal.teal1}`
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.currentTarget.style.backgroundColor = palettes.teal.teal4;
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.currentTarget.style.backgroundColor = palettes.teal.teal1;
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

