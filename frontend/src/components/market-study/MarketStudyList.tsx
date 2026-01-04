import { MarketStudyCard } from './MarketStudyCard';
import type { MarketStudyResponse } from '../../dto';

interface MarketStudyListProps {
  marketStudies: MarketStudyResponse[];
  onSelect: (marketStudy: MarketStudyResponse) => void;
  onAnalyze: (marketStudy: MarketStudyResponse) => void;
  onRetry: (marketStudy: MarketStudyResponse) => void;
  onEdit: (marketStudy: MarketStudyResponse) => void;
  onDelete: (marketStudy: MarketStudyResponse) => void;
  analyzingIds: Set<string>;
}

export function MarketStudyList({
  marketStudies,
  onSelect,
  onAnalyze,
  onRetry,
  onEdit,
  onDelete,
  analyzingIds,
}: MarketStudyListProps) {
  return (
    <div className="space-y-4">
      {marketStudies.map((marketStudy) => (
        <MarketStudyCard
          key={marketStudy.id}
          marketStudy={marketStudy}
          onSelect={onSelect}
          onAnalyze={onAnalyze}
          onRetry={onRetry}
          onEdit={onEdit}
          onDelete={onDelete}
          isAnalyzing={analyzingIds.has(marketStudy.id)}
        />
      ))}
    </div>
  );
}

