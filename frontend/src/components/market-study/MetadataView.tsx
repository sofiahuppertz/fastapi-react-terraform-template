import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faExclamationTriangle, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { text, palettes, primary } from '../../config/colors';
import type { MarketStudyResponse } from '../../dto';

interface MetadataViewProps {
  marketStudy: MarketStudyResponse;
}

export function MetadataView({ marketStudy }: MetadataViewProps) {
  const isAndroid = marketStudy.app_store === 'android';
  const isIOS = marketStudy.app_store === 'iphone';
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const scrollbarStyles = `
    .metadata-scroll::-webkit-scrollbar {
      width: 8px;
    }
    .metadata-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .metadata-scroll::-webkit-scrollbar-thumb {
      background: ${palettes.dusty.dusty1 + '50'};
      border-radius: 4px;
    }
    .metadata-scroll::-webkit-scrollbar-thumb:hover {
      background: ${palettes.dusty.dusty2 + '50'};
    }
  `;

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Check if metadata exists
  const hasMetadata = marketStudy.title || 
    (isAndroid && (marketStudy.short_description || marketStudy.long_description)) ||
    (isIOS && (marketStudy.subtitle || marketStudy.description || marketStudy.hidden_keywords));

  if (!hasMetadata) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center max-w-md">
          <FontAwesomeIcon icon={faExclamationTriangle} className="h-12 w-12 mb-4" style={{ color: palettes.warning.warning2 }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: text.primary }}>
            No Metadata Generated Yet
          </h3>
          <p className="text-sm mb-4" style={{ color: text.subtle }}>
            Click the generate button (feather icon) to create AI-powered app metadata based on your keywords.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="relative pb-6">
        {/* Metadata Cards - Scrollable Container */}
        <div 
          className="metadata-scroll space-y-4 overflow-y-auto" 
          style={{ 
            maxHeight: 'calc(100vh - 300px)',
            scrollbarWidth: 'thin',
            scrollbarColor: `${palettes.dusty.dusty1 + '50'} transparent`
          }}
        >
          {/* Title */}
          {marketStudy.title && (
            <div
              className="rounded-2xl p-6 relative border shadow-sm"
              style={{
                  borderColor: palettes.dusty.dusty1,
                  backgroundColor: 'white'
                }}
            >
              <button
                onClick={() => handleCopy(marketStudy.title!, 'title')}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: copiedField === 'title' ? palettes.success.success0 : palettes.dusty.dusty0,
                  color: copiedField === 'title' ? palettes.success.success3 : palettes.dusty.dusty2
                }}
                title="Copy to clipboard"
              >
                <FontAwesomeIcon icon={copiedField === 'title' ? faCheck : faCopy} className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center space-x-2 mb-3">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: palettes.sky.sky0,
                    color: primary.sky
                  }}
                >
                  <span className="text-sm font-bold">T</span>
                </div>
                <h3 className="text-sm font-mono font-semibold" style={{ color: text.secondary }}>
                  Title
                </h3>
              </div>
              <p className="text-lg leading-relaxed font-space" style={{ color: text.primary }}>
                {marketStudy.title}
              </p>
              <div className="mt-2 text-xs font-mono" style={{ color: text.subtle }}>
                {marketStudy.title.length} characters
              </div>
            </div>
          )}

        {/* iOS Specific Fields */}
        {isIOS && (
          <>
            {/* Subtitle */}
            {marketStudy.subtitle && (
              <div
                className="rounded-2xl border p-6 shadow-sm relative"
                style={{
                  backgroundColor: 'white',
                  borderColor: palettes.dusty.dusty1
                }}
              >
                <button
                  onClick={() => handleCopy(marketStudy.subtitle!, 'subtitle')}
                  className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: copiedField === 'subtitle' ? palettes.success.success0 : palettes.dusty.dusty0,
                    color: copiedField === 'subtitle' ? palettes.success.success3 : palettes.dusty.dusty2
                  }}
                  title="Copy to clipboard"
                >
                  <FontAwesomeIcon icon={copiedField === 'subtitle' ? faCheck : faCopy} className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-center space-x-2 mb-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: palettes.purple.purple0,
                      color: primary.purple
                    }}
                  >
                    <span className="text-sm font-bold">S</span>
                  </div>
                  <h3 className="text-sm font-mono font-semibold" style={{ color: text.secondary }}>
                    Subtitle
                  </h3>
                </div>
                <p className="text-base leading-relaxed font-space" style={{ color: text.primary }}>
                  {marketStudy.subtitle}
                </p>
                <div className="mt-2 text-xs font-mono" style={{ color: text.subtle }}>
                  {marketStudy.subtitle.length} characters
                </div>
              </div>
            )}

            {/* Description */}
            {marketStudy.description && (
              <div
                className="rounded-2xl border shadow-sm relative overflow-hidden"
                style={{
                  backgroundColor: 'white',
                  borderColor: palettes.dusty.dusty1,
                  height: '400px'
                }}
              >
                <button
                  onClick={() => handleCopy(marketStudy.description!, 'description')}
                  className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 z-10"
                  style={{
                    backgroundColor: copiedField === 'description' ? palettes.success.success0 : palettes.dusty.dusty0,
                    color: copiedField === 'description' ? palettes.success.success3 : palettes.dusty.dusty2
                  }}
                  title="Copy to clipboard"
                >
                  <FontAwesomeIcon icon={copiedField === 'description' ? faCheck : faCopy} className="h-3.5 w-3.5" />
                </button>
                <div 
                  className="metadata-scroll p-6 h-full overflow-y-auto"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${palettes.dusty.dusty1 + '50'} transparent`
                  }}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: palettes.teal.teal0,
                        color: primary.sky
                      }}
                    >
                      <span className="text-sm font-bold">D</span>
                    </div>
                    <h3 className="text-sm font-mono font-semibold" style={{ color: text.secondary }}>
                      Description
                    </h3>
                  </div>
                  <p className="text-base leading-loose font-space whitespace-pre-wrap" style={{ color: text.primary }}>
                    {marketStudy.description}
                  </p>
                  <div className="mt-2 text-xs font-mono" style={{ color: text.subtle }}>
                    {marketStudy.description.length} characters
                  </div>
                </div>
              </div>
            )}

            {/* Hidden Keywords */}
            {marketStudy.hidden_keywords && (
              <div
                className="rounded-2xl border p-6 shadow-sm relative"
                style={{
                  backgroundColor: 'white',
                  borderColor: palettes.dusty.dusty1
                }}
              >
                <button
                  onClick={() => handleCopy(marketStudy.hidden_keywords!, 'hidden_keywords')}
                  className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: copiedField === 'hidden_keywords' ? palettes.success.success0 : palettes.dusty.dusty0,
                    color: copiedField === 'hidden_keywords' ? palettes.success.success3 : palettes.dusty.dusty2
                  }}
                  title="Copy to clipboard"
                >
                  <FontAwesomeIcon icon={copiedField === 'hidden_keywords' ? faCheck : faCopy} className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-center space-x-2 mb-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: palettes.green.green0,
                      color: primary.green
                    }}
                  >
                    <FontAwesomeIcon icon={faHashtag} className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-mono font-semibold" style={{ color: text.secondary }}>
                    Hidden Keywords
                  </h3>
                </div>
                <p className="text-base leading-relaxed font-mono" style={{ color: text.primary }}>
                  {marketStudy.hidden_keywords}
                </p>
                <div className="mt-2 text-xs font-mono" style={{ color: text.subtle }}>
                  {marketStudy.hidden_keywords.length} characters
                </div>
              </div>
            )}
          </>
        )}

        {/* Android Specific Fields */}
        {isAndroid && (
          <>
            {/* Short Description */}
            {marketStudy.short_description && (
              <div
                className="rounded-2xl border p-6 shadow-sm relative"
                style={{
                  backgroundColor: 'white',
                  borderColor: palettes.dusty.dusty1
                }}
              >
                <button
                  onClick={() => handleCopy(marketStudy.short_description!, 'short_description')}
                  className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: copiedField === 'short_description' ? palettes.success.success0 : palettes.dusty.dusty0,
                    color: copiedField === 'short_description' ? palettes.success.success3 : palettes.dusty.dusty2
                  }}
                  title="Copy to clipboard"
                >
                  <FontAwesomeIcon icon={copiedField === 'short_description' ? faCheck : faCopy} className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-center space-x-2 mb-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: palettes.purple.purple0,
                      color: primary.purple
                    }}
                  >
                    <span className="text-sm font-bold">S</span>
                  </div>
                  <h3 className="text-sm font-mono font-semibold" style={{ color: text.secondary }}>
                    Short Description
                  </h3>
                </div>
                <p className="text-base leading-relaxed font-space" style={{ color: text.primary }}>
                  {marketStudy.short_description}
                </p>
                <div className="mt-2 text-xs font-mono" style={{ color: text.subtle }}>
                  {marketStudy.short_description.length} characters
                </div>
              </div>
            )}

            {/* Long Description */}
            {marketStudy.long_description && (
              <div
                className="rounded-2xl border shadow-sm relative overflow-hidden"
                style={{
                  backgroundColor: 'white',
                  borderColor: palettes.dusty.dusty1,
                  height: '350px'
                }}
              >
                <button
                  onClick={() => handleCopy(marketStudy.long_description!, 'long_description')}
                  className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 z-10"
                  style={{
                    backgroundColor: copiedField === 'long_description' ? palettes.success.success0 : palettes.dusty.dusty0,
                    color: copiedField === 'long_description' ? palettes.success.success3 : palettes.dusty.dusty2
                  }}
                  title="Copy to clipboard"
                >
                  <FontAwesomeIcon icon={copiedField === 'long_description' ? faCheck : faCopy} className="h-3.5 w-3.5" />
                </button>
                <div 
                  className="metadata-scroll p-6 h-full overflow-y-auto"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${palettes.dusty.dusty1 + '50'} transparent`
                  }}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: palettes.teal.teal0,
                        color: primary.sky
                      }}
                    >
                      <span className="text-sm font-bold">L</span>
                    </div>
                    <h3 className="text-sm font-mono font-semibold" style={{ color: text.secondary }}>
                      Long Description
                    </h3>
                  </div>
                  <p className="text-base leading-loose font-space whitespace-pre-wrap" style={{ color: text.primary }}>
                    {marketStudy.long_description}
                  </p>
                  <div className="mt-2 text-xs font-mono" style={{ color: text.subtle }}>
                    {marketStudy.long_description.length} characters
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
}

