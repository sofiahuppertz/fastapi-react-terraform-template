import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { KeywordItem } from './KeywordItem';
import { palettes } from '../../config/colors';
import type { KeywordResponse } from '../../dto';

interface KeywordListProps {
  keywords: KeywordResponse[];
  displayedItems: KeywordResponse[];
  hasMore: boolean;
  isLoading: boolean;
  searchTerm: string;
  onFetchMore: () => void;
  onEdit?: (keyword: KeywordResponse) => void;
}

export function KeywordList({
  keywords,
  displayedItems,
  hasMore,
  isLoading,
  searchTerm,
  onFetchMore,
  onEdit
}: KeywordListProps) {
  if (keywords.length === 0 && !isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            {searchTerm ? 'No keywords match your search' : 'No keywords found'}
          </p>
          {searchTerm && (
            <p className="text-sm text-gray-500">Try adjusting your search terms</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Custom scrollbar styles */}
      <style>{`
        #keywords-scroll-container::-webkit-scrollbar {
          width: 10px;
        }
        #keywords-scroll-container::-webkit-scrollbar-track {
          background: ${palettes.dusty.dusty0 + '50'};
          border-radius: 10px;
        }
        #keywords-scroll-container::-webkit-scrollbar-thumb {
          background: ${palettes.dusty.dusty1 + '50'};
          border-radius: 10px;
        }
        #keywords-scroll-container::-webkit-scrollbar-thumb:hover {
          background: ${palettes.dusty.dusty2 + '50'};
        }
      `}</style>
      
      {/* Top blur gradient */}
      <div 
        className="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)'
        }}
      />
      
      <div 
        id="keywords-scroll-container"
        className="overflow-auto h-full"
      >
        <InfiniteScroll
          dataLength={displayedItems.length}
          next={onFetchMore}
          hasMore={hasMore}
          loader={
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 text-blue-500 animate-spin" />
                <span className="text-sm text-blue-600">Loading more keywords...</span>
              </div>
            </div>
          }
          endMessage={
            displayedItems.length > 0 && (
              <div className="flex items-center justify-center py-3">
                <p className="text-xs text-gray-400">
                  {displayedItems.length} keywords
                </p>
              </div>
            )
          }
          scrollableTarget="keywords-scroll-container"
          className="px-2 pt-2 pb-2"
        >
          {displayedItems.map((keyword) => (
            <KeywordItem key={keyword.id} keyword={keyword} onEdit={onEdit} />
          ))}
        </InfiniteScroll>
      </div>

      {/* Bottom blur gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)'
        }}
      />
    </div>
  );
}
