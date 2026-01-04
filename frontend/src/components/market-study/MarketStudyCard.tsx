import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faRobot, faTrash, faEdit, faExclamationTriangle, faRedo } from '@fortawesome/free-solid-svg-icons';
import { text, palettes, primary, background } from '../../config/colors';
import type { MarketStudyResponse } from '../../dto';

interface MarketStudyCardProps {
  marketStudy: MarketStudyResponse;
  onSelect: (marketStudy: MarketStudyResponse) => void;
  onAnalyze: (marketStudy: MarketStudyResponse) => void;
  onRetry: (marketStudy: MarketStudyResponse) => void;
  onEdit: (marketStudy: MarketStudyResponse) => void;
  onDelete: (marketStudy: MarketStudyResponse) => void;
  isAnalyzing?: boolean;
}

export function MarketStudyCard({
  marketStudy,
  onSelect,
  onAnalyze,
  onRetry,
  onEdit,
  onDelete,
  isAnalyzing = false,
}: MarketStudyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
        marketStudy.status === 'failed' ? 'cursor-default' : 'cursor-pointer'
      }`}
      style={{
        backgroundColor: 'white',
        borderColor: palettes.dusty.dusty1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = palettes.dusty.dusty0 + '50';
        setIsHovered(true);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'white';
        setIsHovered(false);
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: background.blue,
                color: primary.blue,
              }}
            >
              <span className="text-sm font-bold font-mono uppercase">
                {marketStudy.country.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3
                  className="font-large truncate font-mono"
                  style={{
                    color: text.primary
                  }}
                >
                  {marketStudy.app_name} - {marketStudy.country} - {marketStudy.app_store === 'android' ? 'Google Play' : 'App Store'}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {/* Action Buttons - Only visible on hover */}
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(marketStudy);
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: palettes.warning.warning0 + '80',
                  color: palettes.warning.warning1,
                  opacity: isHovered ? 1 : 0,
                  pointerEvents: isHovered ? 'auto' : 'none',
                  transform: isHovered ? 'scale(1)' : 'scale(0.8)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = palettes.warning.warning0;
                  e.currentTarget.style.color = palettes.warning.warning2;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = palettes.warning.warning0 + '80';
                  e.currentTarget.style.color = palettes.warning.warning1;
                }}
                title="Edit"
              >
                <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(marketStudy);
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: palettes.danger.danger0 + '80',
                  color: palettes.danger.danger1,
                  opacity: isHovered ? 1 : 0,
                  pointerEvents: isHovered ? 'auto' : 'none',
                  transform: isHovered ? 'scale(1)' : 'scale(0.8)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = palettes.danger.danger0;
                  e.currentTarget.style.color = palettes.danger.danger2;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = palettes.danger.danger0 + '80';
                  e.currentTarget.style.color = palettes.danger.danger1;
                }}
                title="Delete"
              >
                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
              </button>
            </div>

            {isAnalyzing || marketStudy.status === 'in_progress' ? (
              // Loading state with shimmer robot
              <div className="px-4 py-2 flex items-center space-x-2">
                <style>
                  {`
                    @keyframes shimmer {
                      0% {
                        opacity: 0.4;
                        transform: scale(1);
                      }
                      50% {
                        opacity: 1;
                        transform: scale(1.1);
                      }
                      100% {
                        opacity: 0.4;
                        transform: scale(1);
                      }
                    }
                    .shimmer-robot {
                      animation: shimmer 1.5s ease-in-out infinite;
                    }
                  `}
                </style>
                <FontAwesomeIcon
                  icon={faRobot}
                  className="h-5 w-5 shimmer-robot"
                  style={{ color: primary.blue }}
                />
                <span className="text-sm font-mono" style={{ color: text.subtle }}>
                  Analyzing... (this can take a few minutes)
                </span>
              </div>
            ) : marketStudy.status === 'pending' ? (
              // Analyze button for pending status
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAnalyze(marketStudy);
                }}
                className="px-4 py-2 rounded-2xl font-mono transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                style={{
                  backgroundColor: palettes.teal.teal0,
                  color: primary.sky
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = palettes.teal.teal1;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = palettes.teal.teal0;
                }}
              >
                <span>Analyze Keywords</span>
                <FontAwesomeIcon icon={faRobot} className="h-4 w-4" />
              </button>
            ) : marketStudy.status === 'failed' ? (
              // Failed status with error message and retry button
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2 rounded-xl p-2" style={{ backgroundColor: palettes.danger.danger0 + '80' }}>
                  <FontAwesomeIcon 
                    icon={faExclamationTriangle} 
                    className="h-4 w-4"
                    style={{ color: palettes.danger.danger2}}
                  />
                  <span className="text-sm font-mono" style={{ color: palettes.danger.danger3 }}>
                    Failed
                  </span>
                </div>
                {marketStudy.error_message && (
                  <div className="text-xs text-right max-w-xs" style={{ color: text.primary }}>
                    {marketStudy.error_message}
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetry(marketStudy);
                  }}
                  className="px-3 py-1.5 rounded-xl font-mono transition-all duration-200 transform hover:scale-105 flex items-center space-x-1.5 text-sm shadow-sm"
                  style={{
                    backgroundColor: palettes.success.success1 + '60',
                    color: palettes.success.success4
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = palettes.success.success1 + '80';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = palettes.success.success1 + '60';
                  }}
                >
                  <span>Retry</span>
                  <FontAwesomeIcon icon={faRedo} className="h-3 w-3" />
                </button>
              </div>
            ) : marketStudy.status === 'completed' ? (
              // View button for completed status
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(marketStudy);
                }}
                className="px-4 py-2 rounded-2xl font-mono transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                style={{
                  backgroundColor: palettes.teal.teal0,
                  color: primary.sky
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = palettes.teal.teal1;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = palettes.teal.teal0;
                }}
              >
                <span>View</span>
                <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

