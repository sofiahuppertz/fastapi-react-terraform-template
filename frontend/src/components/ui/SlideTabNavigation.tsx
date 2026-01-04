import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { palettes, border, primary } from '../../config/colors';

/**
 * SlideTabNavigation - A reusable tab navigation component with smooth slide effect
 * 
 * Features:
 * - Smooth sliding background indicator
 * - Support for icons and text
 * - Conditional tabs (show/hide based on state)
 * - Customizable color scheme
 * - Responsive width calculation
 * - Hardware-accelerated animations
 * 
 * @example
 * ```tsx
 * import { faPlay, faList, faEye } from '@fortawesome/free-solid-svg-icons';
 * 
 * const tabs = [
 *   { key: 'start', label: 'Start', icon: faPlay },
 *   { key: 'jobs', label: 'Jobs', icon: faList },
 *   { key: 'results', label: 'Results', icon: faEye, isConditional: true, isVisible: showResults }
 * ];
 * 
 * <SlideTabNavigation
 *   tabs={tabs}
 *   activeTab={currentTab}
 *   onTabClick={(tabKey) => setCurrentTab(tabKey)}
 * />
 * ```
 */

export interface TabItem {
  key: string;
  label: string;
  icon?: IconDefinition;
  isConditional?: boolean; // For tabs that only show under certain conditions
  isVisible?: boolean; // Whether the conditional tab should be visible
}

export interface SlideTabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabClick: (tabKey: string) => void;
  className?: string;
  colorScheme?: {
    background?: string;
    border?: string;
    activeBackground?: string;
    activeText?: string;
    inactiveText?: string;
  };
}

const SlideTabNavigation: React.FC<SlideTabNavigationProps> = ({
  tabs,
  activeTab,
  onTabClick,
  className = '',
  colorScheme = {
    background: palettes.blue.blue0 + '90',
    border: border.blue,
    activeBackground: primary.blue,
    activeText: palettes.blue.blue0,
    inactiveText: palettes.blue.blue4,
  }
}) => {
  // Filter tabs to only include visible ones
  const visibleTabs = tabs.filter(tab => !tab.isConditional || tab.isVisible);
  const tabCount = visibleTabs.length;
  
  // Calculate active tab index
  const activeTabIndex = visibleTabs.findIndex(tab => tab.key === activeTab);
  
  // Calculate width percentage based on number of visible tabs
  const tabWidth = `calc(${100 / tabCount}%)`;
  const tabWidthForSlider = `calc(${100 / tabCount}% - 8px)`;
  
  // Calculate slider position
  const getSliderPosition = () => {
    if (activeTabIndex === -1) return '4px';
    const percentage = (100 / tabCount) * activeTabIndex;
    return `calc(${percentage}% + 4px)`;
  };

  return (
    <div 
      className={`relative flex rounded-full shadow-sm border p-1 ${className}`}
      style={{ 
        backgroundColor: colorScheme.background,
        borderColor: colorScheme.border
      }}
    >
      {/* Sliding background indicator */}
      <div
        className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-in-out shadow-sm"
        style={{
          backgroundColor: colorScheme.activeBackground,
          width: tabWidthForSlider,
          left: getSliderPosition(),
          transform: 'translateZ(0)' // Hardware acceleration
        }}
      />
      
      {/* Tab buttons */}
      {visibleTabs.map((tab) => {
        const isActive = tab.key === activeTab;
        
        return (
          <button
            key={tab.key}
            onClick={() => onTabClick(tab.key)}
            className={`relative z-10 flex items-center justify-center px-6 py-2 rounded-full text-xs font-satoshi font-medium transition-all duration-300 ${
              isActive
                ? 'text-white'
                : 'hover:bg-opacity-10'
            }`}
            style={{
              color: isActive ? colorScheme.activeText : colorScheme.inactiveText,
              width: tabWidth
            }}
          >
            {tab.icon && (
              <FontAwesomeIcon icon={tab.icon} className="h-3 w-3 mr-2" />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default SlideTabNavigation;
