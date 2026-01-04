import React from 'react';
import { text, palettes } from '../../config/colors';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  color?: string;
  isActive?: boolean;
  capitalize?: boolean;
  fontWeight?: 'normal' | 'medium';
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm font-light" style={{ color: text.secondary }}>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.href || item.onClick ? (
                <button 
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else if (item.href) {
                      window.location.href = item.href;
                    }
                  }}
                  className={`transition-colors underline decoration-dotted underline-offset-2 hover:opacity-80 ${
                    item.capitalize ? 'capitalize' : ''
                  } ${
                    item.fontWeight === 'medium' ? 'font-medium' : ''
                  }`}
                  style={{ color: item.color || palettes.teal.teal2 }}
                >
                  {item.label}
                </button>
              ) : (
                <span 
                  className={`${
                    item.capitalize ? 'capitalize' : ''
                  } ${
                    item.fontWeight === 'medium' ? 'font-medium' : ''
                  }`}
                  style={{ color: item.color || text.secondary }}
                >
                  {item.label}
                </span>
              )}
              
              {/* Separator - don't show after last item */}
              {index < items.length - 1 && (
                <span style={{ color: text.subtle }}>/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;

