import { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { NavigationBar } from '../ui/NavigationBar';
import { KeywordList } from './KeywordList';
import { KeywordEditModal } from './KeywordEditModal';
import { MetadataView } from './MetadataView';
import type { MarketStudyResponse, KeywordResponse, KeywordUpdateRequest } from '../../dto';
import { marketStudyService } from '../../services';

interface MarketStudyDetailViewProps {
  marketStudy: MarketStudyResponse;
  onBack: () => void;
  onGenerateMetadata?: () => void;
  onViewReasoning?: () => void;
}

type SortField = 'keyword' | 'volume' | 'difficulty' | 'kei';

export function MarketStudyDetailView({ marketStudy, onBack, onGenerateMetadata, onViewReasoning }: MarketStudyDetailViewProps) {
  const [keywords, setKeywords] = useState<KeywordResponse[]>([]);
  const [displayedItems, setDisplayedItems] = useState<KeywordResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('volume');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Edit modal state
  const [editingKeyword, setEditingKeyword] = useState<KeywordResponse | null>(null);
  const [isSavingKeyword, setIsSavingKeyword] = useState(false);
  
  // View toggle state - Default to metadata if it exists, otherwise keywords
  const hasMetadata = marketStudy.title || 
    (marketStudy.app_store === 'android' && (marketStudy.short_description || marketStudy.long_description)) ||
    (marketStudy.app_store === 'iphone' && (marketStudy.subtitle || marketStudy.description || marketStudy.hidden_keywords));
  
  const [currentView, setCurrentView] = useState<'metadata' | 'keywords'>(
    hasMetadata ? 'metadata' : 'keywords'
  );

  const ITEMS_PER_PAGE = 20;

  const sortOptions = [
    { value: 'keyword', label: 'Keyword (A-Z)' },
    { value: 'volume', label: 'Volume (High to Low)' },
    { value: 'difficulty', label: 'Difficulty (Low to High)' },
    { value: 'kei', label: 'KEI (High to Low)' }
  ];

  const filterOptions = [
    { value: 'generic', label: 'Generic Only' },
    { value: 'brand', label: 'Brand Only' },
    { value: 'group_top', label: 'Group: Top' },
    { value: 'group_next', label: 'Group: Next' },
    { value: 'group_too_difficult', label: 'Group: Too Difficult' },
    { value: 'group_none', label: 'No Group' }
  ];

  // Fetch keywords
  const fetchKeywords = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please log in to view keywords');
        return;
      }

      const data = await marketStudyService.getKeywords(marketStudy.id, token);
      setKeywords(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load keywords';
      setError(errorMessage);
      console.error('Error loading keywords:', err);
    } finally {
      setIsLoading(false);
    }
  }, [marketStudy.id]);

  // Process keywords: filter and sort
  const processedKeywords = useMemo(() => {
    let filtered = keywords;

    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(keyword =>
        keyword.keyword.toLowerCase().includes(searchLower) ||
        (keyword.group && keyword.group.toLowerCase().includes(searchLower))
      );
    }

    // Apply multiple filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(k => {
        return activeFilters.some(filter => {
          if (filter === 'generic') return k.generic;
          if (filter === 'brand') return !k.generic;
          if (filter === 'group_top') return k.group === 'top';
          if (filter === 'group_next') return k.group === 'next';
          if (filter === 'group_too_difficult') return k.group === 'too_difficult';
          if (filter === 'group_none') return !k.group;
          return false;
        });
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'keyword':
          comparison = a.keyword.localeCompare(b.keyword);
          break;
        case 'volume': {
          // Handle null values - put them at the end
          if (a.volume == null && b.volume == null) return 0;
          if (a.volume == null) return 1;
          if (b.volume == null) return -1;
          comparison = a.volume - b.volume;
          break;
        }
        case 'difficulty': {
          // Handle null values - put them at the end
          if (a.difficulty == null && b.difficulty == null) return 0;
          if (a.difficulty == null) return 1;
          if (b.difficulty == null) return -1;
          comparison = a.difficulty - b.difficulty;
          break;
        }
        case 'kei': {
          // Handle null values - put them at the end
          if (a.kei == null && b.kei == null) return 0;
          if (a.kei == null) return 1;
          if (b.kei == null) return -1;
          comparison = a.kei - b.kei;
          break;
        }
        default:
          return 0;
      }

      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [keywords, searchTerm, sortBy, sortDirection, activeFilters]);

  // Load more items for infinite scroll
  const fetchMoreData = useCallback(() => {
    if (displayedItems.length >= processedKeywords.length) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      const nextItems = processedKeywords.slice(
        displayedItems.length,
        displayedItems.length + ITEMS_PER_PAGE
      );
      
      setDisplayedItems(prev => [...prev, ...nextItems]);
      
      const newCount = displayedItems.length + nextItems.length;
      if (newCount >= processedKeywords.length) {
        setHasMore(false);
      }
    }, 50);
  }, [displayedItems.length, processedKeywords]);

  // Initialize displayed items when processed keywords changes
  useEffect(() => {
    if (processedKeywords.length > 0) {
      const initialItems = processedKeywords.slice(0, ITEMS_PER_PAGE);
      setDisplayedItems(initialItems);
      setHasMore(processedKeywords.length > ITEMS_PER_PAGE);
    } else {
      setDisplayedItems([]);
      setHasMore(false);
    }
  }, [processedKeywords]);

  // Initial data load
  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  // Download keywords as CSV
  const handleDownloadCSV = async () => {
    setIsDownloading(true);
    try {
      const csvRows = [
        ['Keyword', 'Volume', 'Difficulty', 'KEI', 'Group', 'Generic'],
        ...processedKeywords.map(k => [
          k.keyword,
          k.volume != null ? k.volume.toString() : 'N/A',
          k.difficulty != null ? k.difficulty.toString() : 'N/A',
          k.kei != null ? k.kei.toFixed(2) : 'N/A',
          k.group || 'None',
          k.generic ? 'Yes' : 'No'
        ])
      ];

      const csvContent = csvRows.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${marketStudy.app_name}_keywords_${marketStudy.country}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download CSV:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 500);
    }
  };

  // Download metadata as CSV
  const handleDownloadMetadataCSV = async () => {
    setIsDownloading(true);
    try {
      const csvRows: string[][] = [
        ['Field Name', 'Value']
      ];

      // Add title if exists
      if (marketStudy.title) {
        csvRows.push(['Title', marketStudy.title]);
      }

      // iOS specific fields
      if (marketStudy.app_store === 'iphone') {
        if (marketStudy.subtitle) {
          csvRows.push(['Subtitle', marketStudy.subtitle]);
        }
        if (marketStudy.description) {
          csvRows.push(['Description', marketStudy.description]);
        }
        if (marketStudy.hidden_keywords) {
          csvRows.push(['Hidden Keywords', marketStudy.hidden_keywords]);
        }
      }

      // Android specific fields
      if (marketStudy.app_store === 'android') {
        if (marketStudy.short_description) {
          csvRows.push(['Short Description', marketStudy.short_description]);
        }
        if (marketStudy.long_description) {
          csvRows.push(['Long Description', marketStudy.long_description]);
        }
      }

      const csvContent = csvRows.map(row => 
        row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${marketStudy.app_name}_metadata_${marketStudy.country}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download metadata CSV:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 500);
    }
  };

  // Handle keyword edit
  const handleEditKeyword = (keyword: KeywordResponse) => {
    setEditingKeyword(keyword);
  };

  // Handle keyword save
  const handleSaveKeyword = async (keywordId: string, data: KeywordUpdateRequest) => {
    setIsSavingKeyword(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Please log in to edit keywords');
        return;
      }

      const updatedKeyword = await marketStudyService.updateKeyword(keywordId, data, token);
      
      if (!updatedKeyword) {
        console.error('Failed to update keyword');
        return;
      }

      // Update the keyword in the list
      setKeywords(prev =>
        prev.map(k => (k.id === updatedKeyword.id ? updatedKeyword : k))
      );

      setEditingKeyword(null);
    } catch (error: any) {
      console.error('Failed to update keyword:', error);
    } finally {
      setIsSavingKeyword(false);
    }
  };

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="h-8 w-8 text-red-500 mb-4" />
          <p className="text-gray-600 mb-2">Failed to load keywords</p>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-blue-500 animate-spin" />
          <p className="text-gray-600">Loading keywords...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 h-full overflow-hidden">
      {/* Navigation Bar */}
      <NavigationBar
        showBackButton
        onBack={onBack}
        showViewToggle
        viewToggleValue={currentView}
        onViewToggleChange={setCurrentView}
        showSearch={currentView === 'keywords'}
        searchValue={searchTerm}
        searchPlaceholder="Search keywords..."
        onSearchChange={setSearchTerm}
        showFilterSort={currentView === 'keywords'}
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        sortOptions={sortOptions}
        sortValue={sortBy}
        sortDirection={sortDirection}
        onSortChange={(value, direction) => {
          setSortBy(value as SortField);
          setSortDirection(direction);
        }}
        showDownloadButton={currentView === 'keywords' || currentView === 'metadata'}
        downloadLabel="Download CSV"
        onDownload={currentView === 'metadata' ? handleDownloadMetadataCSV : handleDownloadCSV}
        downloadDisabled={currentView === 'keywords' ? processedKeywords.length === 0 : !hasMetadata}
        downloadLoading={isDownloading}
        showGenerateButton
        generateLabel="Generate App Metadata"
        onGenerate={onGenerateMetadata}
        showReasoningButton={currentView === 'metadata' && !!marketStudy.app_metadata_reasoning}
        reasoningLabel="View AI Reasoning"
        onReasoningClick={onViewReasoning}
      />

      {/* Content - Toggle between Metadata and Keywords */}
      {currentView === 'metadata' ? (
        <MetadataView marketStudy={marketStudy} />
      ) : (
        <KeywordList
          keywords={processedKeywords}
          displayedItems={displayedItems}
          hasMore={hasMore}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onFetchMore={fetchMoreData}
          onEdit={handleEditKeyword}
        />
      )}

      {/* Keyword Edit Modal */}
      <KeywordEditModal
        keyword={editingKeyword}
        isOpen={editingKeyword !== null}
        onClose={() => setEditingKeyword(null)}
        onSave={handleSaveKeyword}
        isSaving={isSavingKeyword}
      />
    </div>
  );
}
