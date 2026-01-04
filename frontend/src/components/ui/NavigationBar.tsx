import { ReactNode, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faMagnifyingGlass, 
  faTimes, 
  faDownload, 
  faPlus,
  faSliders,
  faFeather,
  faRobot,
  faList,
  faArrowUp,
  faArrowDown,
  faCheck,
  faBrain
} from '@fortawesome/free-solid-svg-icons';
import { palettes, primary, text } from '../../config/colors';

export interface NavigationBarColors {
  background?: string;
  border?: string;
  searchBackground?: string;
  searchBorder?: string;
  searchText?: string;
  buttonPrimary?: string;
  buttonText?: string;
}

export interface NavigationBarProps {
  // Back button
  showBackButton?: boolean;
  onBack?: () => void;
  
  // Search functionality
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  
  // Combined Filter & Sort functionality
  showFilterSort?: boolean;
  filterOptions?: { value: string; label: string; group?: string }[];
  activeFilters?: string[];
  onFiltersChange?: (filters: string[]) => void;
  sortOptions?: { value: string; label: string }[];
  sortValue?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (value: string, direction: 'asc' | 'desc') => void;
  
  // Action buttons
  showDownloadButton?: boolean;
  downloadLabel?: string;
  onDownload?: () => void;
  downloadDisabled?: boolean;
  downloadLoading?: boolean;
  
  showAddButton?: boolean;
  addLabel?: string;
  onAdd?: () => void;
  
  showGenerateButton?: boolean;
  generateLabel?: string;
  onGenerate?: () => void;
  generateDisabled?: boolean;
  generateLoading?: boolean;
  
  showReasoningButton?: boolean;
  reasoningLabel?: string;
  onReasoningClick?: () => void;
  
  // Toggle view functionality
  showViewToggle?: boolean;
  viewToggleValue?: 'metadata' | 'keywords';
  onViewToggleChange?: (value: 'metadata' | 'keywords') => void;
  
  // Styling
  colors?: NavigationBarColors;
  className?: string;
  
  // Custom content
  customContent?: ReactNode;
}

export function NavigationBar({
  showBackButton = false,
  onBack,
  showSearch = false,
  searchValue = '',
  searchPlaceholder = 'Search...',
  onSearchChange,
  showFilterSort = false,
  filterOptions = [],
  activeFilters = [],
  onFiltersChange,
  sortOptions = [],
  sortValue = '',
  sortDirection = 'desc',
  onSortChange,
  showDownloadButton = false,
  downloadLabel = 'Download',
  onDownload,
  downloadDisabled = false,
  downloadLoading = false,
  showAddButton = false,
  addLabel = 'Add',
  onAdd,
  showGenerateButton = false,
  generateLabel = 'Generate',
  onGenerate,
  generateDisabled = false,
  generateLoading = false,
  showReasoningButton = false,
  reasoningLabel = 'AI Reasoning',
  onReasoningClick,
  showViewToggle = false,
  viewToggleValue = 'metadata',
  onViewToggleChange,
  colors = {},
  className = '',
  customContent
}: NavigationBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterSortOpen, setIsFilterSortOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'filters' | 'sort'>('filters');

  // Default color scheme
  const defaultColors: NavigationBarColors = {
    background: palettes.teal.teal0 + '80',
    border: palettes.teal.teal1,
    searchBackground: palettes.teal.teal0,
    searchBorder: palettes.teal.teal2,
    searchText: text.secondary,
    buttonPrimary: primary.sky,
    buttonText: 'white'
  };

  const finalColors = { ...defaultColors, ...colors };

  const toggleSearch = () => {
    if (isSearchOpen && onSearchChange) {
      onSearchChange('');
    }
    setIsSearchOpen(!isSearchOpen);
  };

  const handleFilterToggle = (filterValue: string) => {
    if (!onFiltersChange) return;
    
    if (activeFilters?.includes(filterValue)) {
      onFiltersChange(activeFilters.filter(f => f !== filterValue));
    } else {
      onFiltersChange([...(activeFilters || []), filterValue]);
    }
  };

  const handleSortChange = (value: string) => {
    if (!onSortChange) return;
    
    if (sortValue === value) {
      // Toggle direction if same sort
      onSortChange(value, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New sort, default to desc
      onSortChange(value, 'desc');
    }
  };

  return (
    <div 
      className={`flex items-center justify-between rounded-full shadow-sm border ${className}`}
      style={{
        backgroundColor: finalColors.background,
        borderColor: finalColors.border,
        padding: '8px 16px',
      }}
    >
      {/* Left side - Back button */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-105"
            style={{
              color: finalColors.buttonPrimary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = finalColors.buttonPrimary || '';
              e.currentTarget.style.color = finalColors.buttonText || '';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = finalColors.buttonPrimary || '';
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Right side - Search, sort, actions, and custom content */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* View Toggle */}
        {showViewToggle && onViewToggleChange && (
          <div 
            className="relative rounded-full p-1 flex shadow-sm border"
            style={{
              backgroundColor: finalColors.searchBackground,
              borderColor: finalColors.searchBorder
            }}
          >
            {/* Sliding background indicator */}
            <div 
              className={`absolute top-1 bottom-1 w-8 rounded-full shadow-lg transition-all duration-300 ease-out ${
                viewToggleValue === 'metadata' ? 'translate-x-0' : 'translate-x-8'
              }`}
              style={{
                backgroundColor: finalColors.buttonPrimary
              }}
            />
            
            {/* Toggle buttons */}
            <button
              onClick={() => onViewToggleChange('metadata')}
              className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{
                color: viewToggleValue === 'metadata' ? 'white' : finalColors.buttonPrimary
              }}
            >
              <FontAwesomeIcon icon={faRobot} className="h-3.5 w-3.5" />
            </button>
            
            <button
              onClick={() => onViewToggleChange('keywords')}
              className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{
                color: viewToggleValue === 'keywords' ? 'white' : finalColors.buttonPrimary
              }}
            >
              <FontAwesomeIcon icon={faList} className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Search */}
        {showSearch && (
          <div className="flex items-center rounded-full">
            <div className={`flex items-center transition-all duration-300 ease-in-out ${
              isSearchOpen ? 'w-64' : 'w-10'
            }`}>
              {isSearchOpen ? (
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-8 py-2 text-sm border rounded-full focus:outline-none transition-all"
                    style={{
                      backgroundColor: finalColors.searchBackground,
                      borderColor: finalColors.searchBorder,
                      color: finalColors.searchText
                    }}
                    autoFocus
                  />
                  <FontAwesomeIcon 
                    icon={faMagnifyingGlass} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5"
                    style={{ color: finalColors.buttonPrimary }}
                  />
                  <button
                    onClick={toggleSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-1 transition-colors"
                    style={{ color: finalColors.buttonPrimary }}
                  >
                    <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={toggleSearch}
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
                  style={{
                    color: finalColors.buttonPrimary,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = finalColors.buttonPrimary || '';
                    e.currentTarget.style.color = finalColors.buttonText || '';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = finalColors.buttonPrimary || '';
                  }}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Combined Filter & Sort */}
        {showFilterSort && (filterOptions.length > 0 || sortOptions.length > 0) && (
          <div className="relative">
            <button
              onClick={() => setIsFilterSortOpen(!isFilterSortOpen)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
              style={{
                color: (activeFilters && activeFilters.length > 0) || isFilterSortOpen ? finalColors.buttonText : finalColors.buttonPrimary,
                backgroundColor: (activeFilters && activeFilters.length > 0) || isFilterSortOpen ? (finalColors.buttonPrimary || '') : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isFilterSortOpen && (!activeFilters || activeFilters.length === 0)) {
                  e.currentTarget.style.backgroundColor = finalColors.buttonPrimary || '';
                  e.currentTarget.style.color = finalColors.buttonText || '';
                }
              }}
              onMouseLeave={(e) => {
                if (!isFilterSortOpen && (!activeFilters || activeFilters.length === 0)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = finalColors.buttonPrimary || '';
                }
              }}
            >
              <FontAwesomeIcon icon={faSliders} className="h-4 w-4" />
              {activeFilters && activeFilters.length > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-semibold flex items-center justify-center"
                  style={{
                    backgroundColor: palettes.purple.purple3,
                    color: 'white'
                  }}
                >
                  {activeFilters.length}
                </span>
              )}
            </button>
            
            {isFilterSortOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg border z-50"
                style={{
                  backgroundColor: 'white',
                  borderColor: finalColors.border
                }}
              >
                {/* Tabs */}
                <div className="flex border-b" style={{ borderColor: finalColors.border }}>
                  <button
                    onClick={() => setActiveTab('filters')}
                    className="flex-1 px-4 py-3 text-sm font-medium transition-all"
                    style={{
                      color: activeTab === 'filters' ? primary.sky : text.subtle,
                      borderBottom: activeTab === 'filters' ? `2px solid ${primary.sky}` : 'none'
                    }}
                  >
                    Filters {activeFilters && activeFilters.length > 0 && `(${activeFilters.length})`}
                  </button>
                  <button
                    onClick={() => setActiveTab('sort')}
                    className="flex-1 px-4 py-3 text-sm font-medium transition-all"
                    style={{
                      color: activeTab === 'sort' ? primary.sky : text.subtle,
                      borderBottom: activeTab === 'sort' ? `2px solid ${primary.sky}` : 'none'
                    }}
                  >
                    Sort
                  </button>
                </div>

                {/* Content */}
                <div className="max-h-80 overflow-y-auto">
                  {activeTab === 'filters' && filterOptions.length > 0 && (
                    <div className="p-2">
                      {filterOptions.map((option) => {
                        const isActive = activeFilters?.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleFilterToggle(option.value)}
                            className="w-full px-3 py-2 text-left text-sm rounded-lg transition-all duration-150 flex items-center space-x-2 mb-1"
                            style={{
                              backgroundColor: isActive ? palettes.teal.teal0 : 'transparent',
                              color: isActive ? primary.sky : text.primary
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = palettes.dusty.dusty0 + '50';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            <div 
                              className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                              style={{
                                borderColor: isActive ? primary.sky : palettes.dusty.dusty2,
                                backgroundColor: isActive ? primary.sky : 'white'
                              }}
                            >
                              {isActive && (
                                <FontAwesomeIcon icon={faCheck} className="h-2.5 w-2.5 text-white" />
                              )}
                            </div>
                            <span className="flex-1">{option.label}</span>
                          </button>
                        );
                      })}
                      {activeFilters && activeFilters.length > 0 && (
                        <button
                          onClick={() => onFiltersChange?.([])}
                          className="w-full px-3 py-2 text-sm rounded-lg mt-2 transition-all"
                          style={{
                            backgroundColor: palettes.danger.danger0,
                            color: palettes.danger.danger3
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = palettes.danger.danger1;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = palettes.danger.danger0;
                          }}
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  )}

                  {activeTab === 'sort' && sortOptions.length > 0 && (
                    <div className="p-2">
                      {sortOptions.map((option) => {
                        const isActive = sortValue === option.value;
                        return (
                          <div
                            key={option.value}
                            className="mb-1 rounded-lg overflow-hidden"
                            style={{
                              backgroundColor: isActive ? palettes.teal.teal0 : 'transparent'
                            }}
                          >
                            <div className="flex items-center">
                              <button
                                onClick={() => handleSortChange(option.value)}
                                className="flex-1 px-3 py-2 text-left text-sm transition-all duration-150"
                                style={{
                                  color: isActive ? primary.sky : text.primary
                                }}
                                onMouseEnter={(e) => {
                                  if (!isActive) {
                                    e.currentTarget.parentElement?.parentElement?.setAttribute('style', `background-color: ${palettes.dusty.dusty0}50`);
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isActive) {
                                    e.currentTarget.parentElement?.parentElement?.setAttribute('style', 'background-color: transparent');
                                  }
                                }}
                              >
                                {option.label}
                              </button>
                              {isActive && (
                                <button
                                  onClick={() => onSortChange?.(sortValue, sortDirection === 'asc' ? 'desc' : 'asc')}
                                  className="px-3 py-2 transition-all hover:scale-110"
                                  style={{ color: primary.sky }}
                                >
                                  <FontAwesomeIcon 
                                    icon={sortDirection === 'asc' ? faArrowUp : faArrowDown} 
                                    className="h-3.5 w-3.5" 
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Download Button */}
        {showDownloadButton && onDownload && (
          <button
            onClick={onDownload}
            disabled={downloadDisabled}
            className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
            style={{
              color: downloadDisabled ? (finalColors.buttonPrimary + '60') : finalColors.buttonPrimary,
              backgroundColor: 'transparent',
              opacity: downloadDisabled ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!downloadDisabled) {
                e.currentTarget.style.backgroundColor = finalColors.buttonPrimary || '';
                e.currentTarget.style.color = finalColors.buttonText || '';
              }
            }}
            onMouseLeave={(e) => {
              if (!downloadDisabled) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = finalColors.buttonPrimary || '';
              }
            }}
            title={downloadLabel}
          >
            {downloadLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Add Button */}
        {showAddButton && onAdd && (
          <button
            onClick={onAdd}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
            style={{
              color: finalColors.buttonPrimary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = finalColors.buttonPrimary || '';
              e.currentTarget.style.color = finalColors.buttonText || '';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = finalColors.buttonPrimary || '';
            }}
            title={addLabel}
          >
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
          </button>
        )}

        {/* Generate Button */}
        {showGenerateButton && onGenerate && (
          <button
            onClick={onGenerate}
            disabled={generateDisabled}
            className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
            style={{
              color: generateDisabled ? (finalColors.buttonPrimary + '60') : finalColors.buttonPrimary,
              backgroundColor: 'transparent',
              opacity: generateDisabled ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!generateDisabled) {
                e.currentTarget.style.backgroundColor = finalColors.buttonPrimary || '';
                e.currentTarget.style.color = finalColors.buttonText || '';
              }
            }}
            onMouseLeave={(e) => {
              if (!generateDisabled) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = finalColors.buttonPrimary || '';
              }
            }}
            title={generateLabel}
          >
            {generateLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <FontAwesomeIcon icon={faFeather} className="h-4 w-4" />
            )}
          </button>
        )}

        {/* AI Reasoning Button */}
        {showReasoningButton && onReasoningClick && (
          <button
            onClick={onReasoningClick}
            className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
            style={{
              color: finalColors.buttonPrimary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = finalColors.buttonPrimary || '';
              e.currentTarget.style.color = finalColors.buttonText || '';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = finalColors.buttonPrimary || '';
            }}
            title={reasoningLabel}
          >
            <FontAwesomeIcon icon={faBrain} className="h-4 w-4" />
          </button>
        )}

        {/* Custom content */}
        {customContent}
      </div>
    </div>
  );
}

