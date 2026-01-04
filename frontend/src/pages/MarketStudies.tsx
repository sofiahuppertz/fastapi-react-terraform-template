import { useEffect, useState, useCallback } from 'react';
import { faList, faPlus, faEye, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SlideTabNavigation from '../components/ui/SlideTabNavigation';
import { Modal } from '../components/ui/Modal';
import Breadcrumb, { BreadcrumbItem } from '../components/ui/Breadcrumb';
import { marketStudyService, commonService, authService } from '../services';
import type { MarketStudyResponse, Country, AppStoreInfo } from '../dto';
import { text, palettes, primary } from '../config/colors';
import { toast } from '../utils/toast';
import {
  EmptyMarketStudiesState,
  NoActiveProjectState,
  MarketStudyList,
  MarketStudyCreateForm,
  MarketStudyEditForm,
  MarketStudyDetailView,
  MarketStudyDeleteModal,
  AIReasoningModal,
} from '../components/market-study';

export function MarketStudies() {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'view'>('list');
  const [marketStudies, setMarketStudies] = useState<MarketStudyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedMarketStudy, setSelectedMarketStudy] = useState<MarketStudyResponse | null>(null);
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
  const [pollingIds, setPollingIds] = useState<Set<string>>(new Set());
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReasoningModal, setShowReasoningModal] = useState(false);
  
  // Active project ID and name from localStorage
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProjectName, setActiveProjectName] = useState<string>('');
  
  // Form state for creation
  const [country, setCountry] = useState('');
  const [appStore, setAppStore] = useState('');
  const [appId, setAppId] = useState('');
  const [appContext, setAppContext] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Edit state
  const [editingMarketStudy, setEditingMarketStudy] = useState<MarketStudyResponse | null>(null);
  const [editCountry, setEditCountry] = useState('');
  const [editAppStore, setEditAppStore] = useState('');
  const [editAppId, setEditAppId] = useState('');
  const [editAppName, setEditAppName] = useState('');
  const [editAppContext, setEditAppContext] = useState('');
  
  // Reference data
  const [countries, setCountries] = useState<Country[]>([]);
  const [appStores, setAppStores] = useState<AppStoreInfo[]>([]);

  const loadActiveProject = useCallback(async () => {
    // Check for active project
    const storedActiveProject = localStorage.getItem('active_project_id');
    const storedActiveProjectName = localStorage.getItem('active_project_name');
    
    if (storedActiveProject) {
      setActiveProjectId(storedActiveProject);
      
      // Load project name from localStorage
      if (storedActiveProjectName) {
        setActiveProjectName(storedActiveProjectName);
      }
      
      loadMarketStudies(storedActiveProject);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReferenceData();
    loadActiveProject();

    // Listen for active project changes from Projects page
    const handleProjectChange = () => {
      loadActiveProject();
    };
    
    window.addEventListener('activeProjectChanged', handleProjectChange);
    
    return () => {
      window.removeEventListener('activeProjectChanged', handleProjectChange);
    };
  }, [loadActiveProject]);

  const loadReferenceData = async () => {
    try {
      const [countriesData, appStoresData] = await Promise.all([
        commonService.getCountries(),
        commonService.getAppStores(),
      ]);
      setCountries(countriesData);
      setAppStores(appStoresData);
      
      // Set default values
      if (countriesData.length > 0) setCountry(countriesData[0].name);
      if (appStoresData.length > 0) setAppStore(appStoresData[0].code);
    } catch (error) {
      console.error('Failed to load reference data:', error);
    }
  };

  const loadMarketStudies = async (projectId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Please log in to view market studies');
        return;
      }

      const response = await marketStudyService.getProjectMarketStudies(projectId, token, { page: 1, page_size: 100 });
      setMarketStudies(response.items);
      
      // Start polling for in-progress market studies
      const inProgressStudies = response.items.filter(ms => ms.status === 'in_progress');
      for (const study of inProgressStudies) {
        // Only start polling if not already polling
        if (!pollingIds.has(study.id)) {
          pollMarketStudy(study.id, 'analyze');
        }
      }
    } catch (error: any) {
      console.error('Failed to load market studies:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMarketStudy = async () => {
    if (!deleteModal) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Please log in to delete market studies');
        return;
      }

      await marketStudyService.deleteMarketStudy(deleteModal, token);
      setMarketStudies(marketStudies.filter((ms) => ms.id !== deleteModal));
      setDeleteModal(null);
      toast.success('Market study deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete market study:', error);
      toast.error(error.message || 'Failed to delete market study');
    } finally {
      setIsDeleting(false);
    }
  };

  // Token getter that ensures a valid token on each call
  const getValidToken = () => authService.ensureValidToken();

  const pollMarketStudy = async (marketStudyId: string, operation: 'analyze' | 'retry' | 'metadata' = 'analyze') => {
    console.log(`[Polling] Starting poll for market study ${marketStudyId} (${operation})`);

    // Add to polling set to prevent duplicates
    setPollingIds(prev => new Set(prev).add(marketStudyId));

    try {
      // Poll until completed or failed, using token getter for fresh tokens
      const marketStudy = await marketStudyService.pollUntilCompleted(
        marketStudyId,
        getValidToken,
        {
          intervalMs: 5000, // Poll every 5 seconds
          maxRetries: 10, // Allow up to 10 consecutive failures before giving up
          onProgress: (_status, updatedStudy) => {
            // Update the market study in real-time as status changes
            setMarketStudies(prev => {
              const updated = prev.map(ms => ms.id === marketStudyId ? updatedStudy : ms);
              console.log(`[Polling] Updated market studies list`, updated.find(m => m.id === marketStudyId));
              return updated;
            });
          }
        }
      );

      // Final update with the completed/failed market study
      setMarketStudies(prev =>
        prev.map(ms => ms.id === marketStudy.id ? marketStudy : ms)
      );

      const operationMessage = operation === 'analyze' ? 'Keyword analysis' :
                              operation === 'retry' ? 'Retry analysis' :
                              'Metadata generation';

      if (marketStudy.status === 'failed') {
        console.error(`[Polling] ${operationMessage} failed: ${marketStudy.error_message || 'Unknown error'}`);
      } else {
        console.log(`[Polling] ${operationMessage} completed successfully!`);
      }
    } catch (error: any) {
      console.error('[Polling] Polling exception:', error);

      // Don't immediately mark as failed - verify actual status from backend first
      // This handles cases where polling failed due to transient network issues
      // but the backend task actually completed successfully
      try {
        const token = await getValidToken();
        if (token) {
          const actualStudy = await marketStudyService.getMarketStudy(marketStudyId, token);
          if (actualStudy) {
            console.log(`[Polling] Verified actual status: ${actualStudy.status}`);
            setMarketStudies(prev =>
              prev.map(ms => ms.id === marketStudyId ? actualStudy : ms)
            );
            return; // Don't mark as failed if we got a valid response
          }
        }
      } catch (verifyError) {
        console.error('[Polling] Failed to verify actual status:', verifyError);
      }

      // Only mark as failed if we couldn't verify and polling truly failed
      // Keep the study as "in_progress" so user can reload to check actual status
      console.warn('[Polling] Could not verify status - keeping as in_progress. Reload page to check actual status.');
    } finally {
      // Remove from polling set
      setPollingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(marketStudyId);
        return newSet;
      });

      console.log(`[Polling] Finished polling for market study ${marketStudyId}`);
    }
  };

  const handleCreateMarketStudy = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeProjectId) {
      console.error('No active project selected');
      return;
    }

    if (!country || !appStore || !appId.trim()) {
      console.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to create market studies');
        return;
      }

      await marketStudyService.createMarketStudy(
        {
          country,
          app_store: appStore as any,
          app_id: appId,
          project_id: activeProjectId,
          app_context: appContext || undefined,
        },
        token
      );

      toast.success('Market study created successfully!');
      
      // Reset form
      setAppId('');
      setAppContext('');
      
      // Reload market studies and switch to list view
      await loadMarketStudies(activeProjectId);
      setActiveTab('list');
    } catch (error: any) {
      console.error('Failed to create market study:', error);
      // Show user-friendly error message from API
      toast.error(error.message || 'Failed to create market study');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelect = (marketStudy: MarketStudyResponse) => {
    // Store the selected market study
    setSelectedMarketStudy(marketStudy);
    localStorage.setItem('active_market_study_id', marketStudy.id);
    setActiveTab('view');
  };

  const handleBackToList = () => {
    setSelectedMarketStudy(null);
    setActiveTab('list');
  };

  const handleAnalyze = async (marketStudy: MarketStudyResponse) => {
    console.log('[Analyze] Starting analysis for market study:', marketStudy.id);
    
    // Immediately update status to in_progress for instant UI feedback
    setMarketStudies(prev =>
      prev.map(ms => 
        ms.id === marketStudy.id 
          ? { ...ms, status: 'in_progress' as const }
          : ms
      )
    );

    // Add to analyzing set
    setAnalyzingIds(prev => new Set(prev).add(marketStudy.id));

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to analyze keywords');
        // Revert status if no token
        setMarketStudies(prev =>
          prev.map(ms => 
            ms.id === marketStudy.id 
              ? { ...ms, status: 'pending' as const }
              : ms
          )
        );
        return;
      }

      // Start keyword fetching
      await marketStudyService.fetchAndClassifyKeywords(marketStudy.id, token);
      toast.info('Analyzing keywords...');

      // Use common polling function
      await pollMarketStudy(marketStudy.id, 'analyze');
    } catch (error: any) {
      console.error('Analysis failed:', error);
      
      // Mark as failed if initial request fails
      setMarketStudies(prev =>
        prev.map(ms => 
          ms.id === marketStudy.id 
            ? { ...ms, status: 'failed' as const, error_message: error.message || 'Analysis failed' }
            : ms
        )
      );
    } finally {
      // Remove from analyzing set
      setAnalyzingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(marketStudy.id);
        return newSet;
      });
    }
  };

  const handleRetry = async (marketStudy: MarketStudyResponse) => {
    console.log('[Retry] Starting retry for market study:', marketStudy.id);
    
    // Check if failed_step exists
    if (!marketStudy.failed_step) {
      console.error('[Retry] No failed step found for market study:', marketStudy.id);
      return;
    }

    console.log('[Retry] Retrying from failed step:', marketStudy.failed_step);
    
    // Immediately update status to in_progress and clear error for instant UI feedback
    setMarketStudies(prev =>
      prev.map(ms => 
        ms.id === marketStudy.id 
          ? { ...ms, status: 'in_progress' as const, error_message: null, failed_step: null }
          : ms
      )
    );

    // Add to analyzing set
    setAnalyzingIds(prev => new Set(prev).add(marketStudy.id));

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Please log in to retry analysis');
        // Revert status if no token
        setMarketStudies(prev =>
          prev.map(ms => 
            ms.id === marketStudy.id 
              ? { ...ms, status: 'failed' as const, error_message: 'Authentication required', failed_step: marketStudy.failed_step }
              : ms
          )
        );
        return;
      }

      // Retry from the specific failed step
      await marketStudyService.runBackgroundTask(marketStudy.id, marketStudy.failed_step, token);

      // wait for 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Use common polling function
      await pollMarketStudy(marketStudy.id, 'retry');
    } catch (error: any) {
      console.error('Retry analysis failed:', error);
      
      // Mark as failed if initial request fails
      setMarketStudies(prev =>
        prev.map(ms => 
          ms.id === marketStudy.id 
            ? { ...ms, status: 'failed' as const, error_message: error.message || 'Retry failed', failed_step: marketStudy.failed_step }
            : ms
        )
      );
    } finally {
      // Remove from analyzing set
      setAnalyzingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(marketStudy.id);
        return newSet;
      });
    }
  };

  const handleGenerateMetadataClick = () => {
    // Show confirmation modal
    setShowGenerateModal(true);
  };

  const handleViewReasoning = () => {
    setShowReasoningModal(true);
  };

  const handleConfirmGenerate = async () => {
    if (!selectedMarketStudy || !activeProjectId) return;

    setIsGenerating(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Please log in to generate metadata');
        setShowGenerateModal(false);
        setIsGenerating(false);
        return;
      }

      // Start metadata generation
      await marketStudyService.generateAppMetadata(selectedMarketStudy.id, token);

      toast.info('Generating app metadata...');

      // Close modal and navigate back to list view
      setShowGenerateModal(false);
      setActiveTab('list');
      const studyId = selectedMarketStudy.id;
      setSelectedMarketStudy(null);

      // Reload the market studies list to show updated status
      await loadMarketStudies(activeProjectId);

      // Start polling for this market study if not already polling
      if (!pollingIds.has(studyId)) {
        pollMarketStudy(studyId, 'metadata');
      }
    } catch (error: any) {
      console.error('Generate metadata failed:', error);
      toast.error(error.message || 'Failed to generate metadata');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = (marketStudy: MarketStudyResponse) => {
    setEditingMarketStudy(marketStudy);
    setEditCountry(marketStudy.country);
    setEditAppStore(marketStudy.app_store);
    setEditAppId(marketStudy.app_id);
    setEditAppName(marketStudy.app_name);
    setEditAppContext(marketStudy.app_context || '');
  };

  const handleDelete = (marketStudy: MarketStudyResponse) => {
    setDeleteModal(marketStudy.id);
  };

  const handleUpdateMarketStudy = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingMarketStudy) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Please log in to edit market studies');
        return;
      }

      const updatedMarketStudy = await marketStudyService.updateMarketStudy(
        editingMarketStudy.id,
        {
          country: editCountry,
          app_store: editAppStore as any,
          app_id: editAppId,
          app_name: editAppName,
          app_context: editAppContext || undefined,
        },
        token
      );

      if (!updatedMarketStudy) {
        toast.error('Failed to update market study');
        return;
      }

      // Update the market study in the list
      setMarketStudies(prev =>
        prev.map(ms => (ms.id === updatedMarketStudy.id ? updatedMarketStudy : ms))
      );

      toast.success('Market study updated successfully');
      setEditingMarketStudy(null);
    } catch (error: any) {
      console.error('Failed to update market study:', error);
      toast.error(error.message || 'Failed to update market study');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { key: 'list', label: 'All', icon: faList },
    { key: 'create', label: 'New', icon: faPlus },
    ...(activeTab === 'view' && selectedMarketStudy ? [{ 
      key: 'view', 
      label:'View', 
      icon: faEye
    }] : []),
  ];

  if (loading && activeTab === 'list') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-white rounded-xl w-48"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!activeProjectId) {
    return <NoActiveProjectState />;
  }

  // Build breadcrumb items based on current view
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      {
        label: 'Projects',
        color: palettes.teal.teal1,
        onClick: () => { window.location.href = '/#/projects'; }
      }
    ];

    // Only add project name if it's loaded
    if (activeProjectName) {
      items.push({
        label: activeProjectName,
        color: palettes.teal.teal2,
        capitalize: true
      });
    }

    if (activeTab === 'view' && selectedMarketStudy) {
      items.push({
        label: 'Market Studies',
        color: palettes.teal.teal3,
        onClick: () => { setActiveTab('list'); }
      });
      
      items.push({
        label: `${selectedMarketStudy.app_name} - ${selectedMarketStudy.country} - ${selectedMarketStudy.app_store}`,
        color: palettes.teal.teal4,
        fontWeight: 'medium'
      });
    } else {
      items.push({
        label: 'Market Studies',
        color: palettes.teal.teal4,
        fontWeight: 'medium'
      });
    }

    return items;
  };

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <Breadcrumb items={getBreadcrumbItems()} className="mb-0" />

        {/* Tab Navigation */}
        <SlideTabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={(key) => {
            // Prevent clicking on the view tab
            if (key !== 'view') {
              setActiveTab(key as 'list' | 'create' | 'view');
            }
          }}
          colorScheme={{
            background: palettes.teal.teal0 + '40',
            border: palettes.teal.teal1,
            activeBackground: palettes.teal.teal3,
            activeText: 'white',
            inactiveText: palettes.teal.teal4
          }}
        />
      </div>

      {/* Content */}
      {activeTab === 'view' && selectedMarketStudy ? (
        // Market Study Detail View - Uses its own overflow handling
        <MarketStudyDetailView
          marketStudy={selectedMarketStudy}
          onBack={handleBackToList}
          onGenerateMetadata={handleGenerateMetadataClick}
          onViewReasoning={handleViewReasoning}
        />
      ) : (
        <div className="flex-1 overflow-auto">
          {activeTab === 'list' ? (
            // Market Studies List View
            marketStudies.length === 0 ? (
              <EmptyMarketStudiesState onCreateClick={() => setActiveTab('create')} />
            ) : (
              <MarketStudyList
                marketStudies={marketStudies}
                onSelect={handleSelect}
                onAnalyze={handleAnalyze}
                onRetry={handleRetry}
                onEdit={handleEdit}
                onDelete={handleDelete}
                analyzingIds={new Set([...analyzingIds, ...pollingIds])}
              />
            )
          ) : activeTab === 'create' ? (
            // Create Market Study Form
            <MarketStudyCreateForm
              country={country}
              appStore={appStore}
              appId={appId}
              appContext={appContext}
              submitting={submitting}
              countries={countries}
              appStores={appStores}
              onCountryChange={setCountry}
              onAppStoreChange={setAppStore}
              onAppIdChange={setAppId}
              onAppContextChange={setAppContext}
              onSubmit={handleCreateMarketStudy}
              onCancel={() => setActiveTab('list')}
            />
          ) : null}
        </div>
      )}

      {/* Delete Modal */}
      <MarketStudyDeleteModal
        isOpen={deleteModal !== null}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModal(null);
          }
        }}
        onConfirm={deleteMarketStudy}
        isDeleting={isDeleting}
      />

      {/* Edit Modal */}
      <Modal
        isOpen={editingMarketStudy !== null}
        onClose={() => setEditingMarketStudy(null)}
        title=""
        maxWidth="3xl"
      >
        <MarketStudyEditForm
          country={editCountry}
          appStore={editAppStore}
          appId={editAppId}
          appName={editAppName}
          appContext={editAppContext}
          submitting={submitting}
          countries={countries}
          appStores={appStores}
          onCountryChange={setEditCountry}
          onAppStoreChange={setEditAppStore}
          onAppIdChange={setEditAppId}
          onAppNameChange={setEditAppName}
          onAppContextChange={setEditAppContext}
          onSubmit={handleUpdateMarketStudy}
          onCancel={() => setEditingMarketStudy(null)}
        />
      </Modal>

      {/* Generate Metadata Confirmation Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => {
          if (!isGenerating) {
            setShowGenerateModal(false);
          }
        }}
        title="Generate App Metadata"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-base" style={{ color: text.secondary }}>
            Are you sure you want to generate AI-powered app metadata for{' '}
            <span className="font-semibold" style={{ color: text.primary }}>
              {selectedMarketStudy?.app_name}
            </span>
            ?
          </p>
          <p className="text-sm" style={{ color: text.subtle }}>
            This will create optimized titles, descriptions, and keywords based on your market research data.
          </p>
          
          {/* Warning about overwriting */}
          <div 
            className="flex items-start space-x-3 p-4 rounded-xl border"
            style={{
              backgroundColor: palettes.warning.warning0 + '40',
              borderColor: palettes.warning.warning1
            }}
          >
            <FontAwesomeIcon 
              icon={faExclamationTriangle} 
              className="h-5 w-5 mt-0.5 flex-shrink-0"
              style={{ color: palettes.warning.warning2 }}
            />
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: palettes.warning.warning3 }}>
                Warning
              </p>
              <p className="text-sm" style={{ color: text.secondary }}>
                If you have already generated metadata for this market study, this action will overwrite the existing content.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={() => setShowGenerateModal(false)}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl font-mono transition-all duration-200"
            style={{
              backgroundColor: palettes.grey.grey0,
              color: text.secondary,
              opacity: isGenerating ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!isGenerating) {
                e.currentTarget.style.backgroundColor = palettes.grey.grey1;
              }
            }}
            onMouseLeave={(e) => {
              if (!isGenerating) {
                e.currentTarget.style.backgroundColor = palettes.grey.grey0;
              }
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmGenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl font-mono transition-all duration-200 flex items-center space-x-2"
            style={{
              backgroundColor: isGenerating ? palettes.sky.sky1 : palettes.sky.sky0,
              color: primary.sky,
              opacity: isGenerating ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isGenerating) {
                e.currentTarget.style.backgroundColor = palettes.sky.sky1;
              }
            }}
            onMouseLeave={(e) => {
              if (!isGenerating) {
                e.currentTarget.style.backgroundColor = palettes.sky.sky0;
              }
            }}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate</span>
            )}
          </button>
        </div>
      </Modal>

      {/* AI Reasoning Modal */}
      <AIReasoningModal
        isOpen={showReasoningModal}
        onClose={() => setShowReasoningModal(false)}
        reasoning={selectedMarketStudy?.app_metadata_reasoning || null}
      />
    </div>
  );
}

