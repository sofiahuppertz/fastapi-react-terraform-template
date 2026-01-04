import { useState, ReactNode } from 'react';
import { palettes } from '../../config/colors';

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-8 border-x-8 border-x-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-8 border-x-8 border-x-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-8 border-y-8 border-y-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-8 border-y-8 border-y-transparent',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
        >
          <div
            className="px-3 py-2 rounded-lg shadow-lg font-satoshi text-sm whitespace-nowrap max-w-xs"
            style={{
              backgroundColor: palettes.grey.grey6,
              color: 'white',
            }}
          >
            {content}
          </div>
          <div
            className={`absolute w-0 h-0 ${arrowClasses[position]}`}
            style={{
              borderTopColor: position === 'top' ? palettes.grey.grey6 : 'transparent',
              borderBottomColor: position === 'bottom' ? palettes.grey.grey6 : 'transparent',
              borderLeftColor: position === 'left' ? palettes.grey.grey6 : 'transparent',
              borderRightColor: position === 'right' ? palettes.grey.grey6 : 'transparent',
            }}
          />
        </div>
      )}
    </div>
  );
}

