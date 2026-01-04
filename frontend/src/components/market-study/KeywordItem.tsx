import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { text, palettes } from '../../config/colors';
import type { KeywordResponse } from '../../dto';

interface KeywordItemProps {
  keyword: KeywordResponse;
  onEdit?: (keyword: KeywordResponse) => void;
}

const groupColors: Record<string, { bg: string; text: string; border: string }> = {
  top: {
    bg: palettes.success.success0,
    text: palettes.success.success5,
    border: palettes.success.success2
  },
  next: {
    bg: palettes.sky.sky0,
    text: palettes.sky.sky5,
    border: palettes.sky.sky2
  },
  too_difficult: {
    bg: palettes.danger.danger0,
    text: palettes.danger.danger2,
    border: palettes.danger.danger1
  },
  none: {
    bg: 'white',
    text: text.subtle,
    border: palettes.dusty.dusty1
  }
};

export function KeywordItem({ keyword, onEdit }: KeywordItemProps) {
  const [isGroupHovered, setIsGroupHovered] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  
  const groupColor = keyword.group && groupColors[keyword.group] 
    ? groupColors[keyword.group] 
    : groupColors.none;
  
  return (
    <div 
      className="rounded-2xl transition-all duration-300 hover:scale-[1.01] mb-2 border relative"
      style={{
        background: groupColor.bg + '50',
        borderColor: groupColor.border,
      }}
      onMouseEnter={(e) => {
        setIsCardHovered(true);
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.backgroundColor = groupColor.bg + '80';
      }}
      onMouseLeave={(e) => {
        setIsCardHovered(false);
        e.currentTarget.style.backgroundColor = groupColor.bg + '50';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="p-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center space-x-2">
                <h3 
                  className="text-base truncate font-satoshi"
                  style={{ color: text.primary }}
                >
                  {keyword.keyword}
                </h3>
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 font-mono"
                  style={{
                    backgroundColor: keyword.generic ? palettes.purple.purple0 : palettes.green.green0 + '80',
                    color: keyword.generic ? palettes.purple.purple4 : palettes.green.green4,
                    border: `1px solid ${keyword.generic ? palettes.purple.purple2 : palettes.green.green2}`
                  }}
                >
                  {keyword.generic ? 'Generic' : 'Brand'}
                </span>
                {keyword.group && (
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 font-mono capitalize inline-flex items-center overflow-hidden transition-all duration-300 ease-in-out cursor-help z-10"
                    style={{
                      backgroundColor: groupColor.bg,
                      color: groupColor.text,
                      border: `1px solid ${groupColor.border}`,
                      maxWidth: isGroupHovered && keyword.reason ? '1000px' : '120px',
                    }}
                    onMouseEnter={() => setIsGroupHovered(true)}
                    onMouseLeave={() => setIsGroupHovered(false)}
                  >
                    <span className="whitespace-nowrap">{keyword.group.replace(/_/g, ' ')}</span>
                    {keyword.reason && (
                      <span 
                        className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap"
                        style={{
                          maxWidth: isGroupHovered ? '1000px' : '0px',
                          marginLeft: isGroupHovered ? '8px' : '0px',
                          opacity: isGroupHovered ? 1 : 0,
                        }}
                      >
                        • {keyword.reason}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-6 flex-shrink-0">
              {/* Volume */}
              <div className="flex flex-col items-center w-20">
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-xs font-mono" style={{ color: text.subtle }}>
                    Volume
                  </span>
                </div>
                <span 
                  className="text-sm font-medium font-mono"
                  style={{ 
                    color: keyword.volume != null ? 
                      `hsl(${Math.min(120 * (keyword.volume / 100), 120)}, 70%, 45%)` : 
                      text.subtle 
                  }}
                >
                  {keyword.volume != null ? keyword.volume.toLocaleString() : 'N/A'}
                </span>
              </div>

              {/* Difficulty */}
              <div className="flex flex-col items-center w-20">
                <span className="text-xs font-mono mb-1" style={{ color: text.subtle }}>
                  Difficulty
                </span>
                <span 
                  className="text-sm font-medium font-mono"
                  style={{ 
                    color: keyword.difficulty != null ? 
                      `hsl(${120 - (120 * keyword.difficulty / 100)}, 70%, 45%)` : 
                      text.subtle 
                  }}
                >
                  {keyword.difficulty != null ? keyword.difficulty : 'N/A'}
                </span>
              </div>

              {/* KEI */}
              <div className="flex flex-col items-center w-20">
                <span className="text-xs font-mono mb-1" style={{ color: text.subtle }}>
                  KEI
                </span>
                <span 
                  className="text-sm font-medium font-mono"
                  style={{ 
                    color: keyword.kei != null ? 
                      `hsl(${Math.min(120 * (keyword.kei / 100), 120)}, 70%, 45%)` : 
                      text.subtle 
                  }}
                >
                  {keyword.kei != null ? keyword.kei.toFixed(2) : 'N/A'}
                </span>
              </div>

              {/* Edit Button */}
              {onEdit && (
                <div className="flex items-center ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(keyword);
                    }}
                    className="w-8 h-8 rounded-full justify-center items-center transition-all duration-200 flex items-center justify-center hover:scale-105 shadow-sm"
                    style={{
                      opacity: isCardHovered ? 1 : 0,
                      transform: isCardHovered ? 'scale(1)' : 'scale(0.9)',
                      backgroundColor: palettes.warning.warning0,
                      color: palettes.warning.warning2,
                    }}
                    title="Edit keyword"
                  >
                    <FontAwesomeIcon icon={faPen} className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

