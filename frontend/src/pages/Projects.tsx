import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faList,
  faPlus,
  faTrash,
  faFolder,
  faStar,
  faCalendar,
  faEdit,
  faChevronUp,
  faChevronDown,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import SlideTabNavigation from '../components/ui/SlideTabNavigation';
import { Modal } from '../components/ui/Modal';
import Breadcrumb from '../components/ui/Breadcrumb';
import { projectService, marketStudyService, commonService } from '../services';
import type { ProjectResponse, Country, AppStoreInfo } from '../dto';
import { text, palettes, semantic, primary, background } from '../config/colors';
import { ProjectCreateForm, type MarketStudyFormData } from '../components/projects';
import { toast } from '../utils/toast';

export function Projects() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  // Form state
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [globalContext, setGlobalContext] = useState('');
  const [marketStudies, setMarketStudies] = useState<MarketStudyFormData[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Reference data
  const [countries, setCountries] = useState<Country[]>([]);
  const [appStores, setAppStores] = useState<AppStoreInfo[]>([]);
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({ name: '', description: '', global_context: '' });

  useEffect(() => {
    loadProjects();
    loadReferenceData();
    
    // Load active project from localStorage
    const storedActiveProject = localStorage.getItem('active_project_id');
    if (storedActiveProject) {
      setActiveProjectId(storedActiveProject);
    }
  }, []);

  const loadReferenceData = async () => {
    try {
      const [countriesData, appStoresData] = await Promise.all([
        commonService.getCountries(),
        commonService.getAppStores(),
      ]);
      setCountries(countriesData);
      setAppStores(appStoresData);
    } catch (error) {
      console.error('Failed to load reference data:', error);
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Please log in to view projects');
        return;
      }

      const response = await projectService.getAllProjects(token, { page: 1, page_size: 100 });
      setProjects(response.items);
    } catch (error: any) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to delete projects');
        return;
      }

      await projectService.deleteProject(id, token);
      setProjects(projects.filter((p) => p.id !== id));
      
      // If the deleted project was the active one, clear it
      if (activeProjectId === id) {
        setActiveProjectId(null);
        localStorage.removeItem('active_project_id');
        localStorage.removeItem('active_project_name');
        window.dispatchEvent(new Event('activeProjectChanged'));
      }
      
      toast.success('Project deleted successfully');
      setDeleteModal(null);
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      toast.error(error.message || 'Failed to delete project');
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      toast.warning('Please enter a project name');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to create projects');
        return;
      }

      // Create the project
      const project = await projectService.createProject(
        {
          name: projectName,
          description: projectDescription || undefined,
          global_context: globalContext || undefined,
        },
        token
      );

      if (!project) {
        toast.error('Failed to create project');
        return;
      }

      // Create market studies for the project
      let successCount = 0;
      let failCount = 0;

      if (marketStudies.length > 0) {
        toast.info(`Creating ${marketStudies.length} market ${marketStudies.length === 1 ? 'study' : 'studies'}...`);
        
        for (const study of marketStudies) {
          try {
            await marketStudyService.createMarketStudy(
              {
                project_id: project.id,
                app_store: study.app_store,
                app_id: study.app_id,
                country: study.country,
                app_context: study.app_context || undefined,
              },
              token
            );
            successCount++;
          } catch (error: any) {
            console.error(`Failed to create market study for ${study.app_id}:`, error);
            failCount++;
          }
        }
      }

      // Show appropriate success message
      if (marketStudies.length > 0) {
        if (failCount === 0) {
          toast.success(`Project created with ${successCount} market ${successCount === 1 ? 'study' : 'studies'}!`);
        } else if (successCount > 0) {
          toast.warning(`Project created with ${successCount} market ${successCount === 1 ? 'study' : 'studies'}. ${failCount} failed.`);
        } else {
          toast.warning('Project created but all market studies failed to create');
        }
      } else {
        toast.success('Project created successfully!');
      }
      
      // Reset form
      setProjectName('');
      setProjectDescription('');
      setGlobalContext('');
      setMarketStudies([]);
      
      // Reload projects and switch to list view
      await loadProjects();
      setActiveTab('list');
    } catch (error: any) {
      console.error('Failed to create project:', error);
      toast.error(error.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetActive = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setActiveProjectId(projectId);
      localStorage.setItem('active_project_id', projectId);
      localStorage.setItem('active_project_name', project.name);
      toast.success(`Active project set to: ${project.name}`);
      
      // Notify other components that the active project has changed
      window.dispatchEvent(new Event('activeProjectChanged'));
    }
  };

  const handleToggleExpand = (projectId: string) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  const handleEditStart = (project: ProjectResponse) => {
    setEditingProjectId(project.id);
    setEditFormData({
      name: project.name,
      description: project.description || '',
      global_context: project.global_context || ''
    });
    setExpandedProjectId(project.id);
  };

  const handleEditCancel = () => {
    setEditingProjectId(null);
    setEditFormData({ name: '', description: '', global_context: '' });
  };

  const handleEditSave = async () => {
    if (!editingProjectId || !editFormData.name.trim()) {
      toast.warning('Please enter a project name');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to update projects');
        return;
      }

      const project = projects.find(p => p.id === editingProjectId);
      if (!project) return;

      await projectService.updateProject(
        editingProjectId,
        {
          name: editFormData.name.trim(),
          description: editFormData.description.trim() || undefined,
          global_context: editFormData.global_context.trim() || undefined,
        },
        token
      );

      // If the edited project was the active one, update the stored name
      if (activeProjectId === editingProjectId) {
        localStorage.setItem('active_project_name', editFormData.name.trim());
        window.dispatchEvent(new Event('activeProjectChanged'));
      }

      await loadProjects();
      setEditingProjectId(null);
      setEditFormData({ name: '', description: '', global_context: '' });
      toast.success('Project updated successfully');
    } catch (error: any) {
      console.error('Failed to update project:', error);
      toast.error(error.message || 'Failed to update project');
    }
  };

  const tabs = [
    { key: 'list', label: 'All', icon: faList },
    { key: 'create', label: 'New', icon: faPlus },
  ];

  if (loading && activeTab === 'list') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-white rounded-xl w-48"></div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <Breadcrumb
          items={[
            {
              label: 'Projects',
              color: palettes.teal.teal4,
              fontWeight: 'medium'
            }
          ]}
          className="mb-0"
        />

        {/* Tab Navigation */}
        <SlideTabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={(key) => setActiveTab(key as 'list' | 'create')}
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
      <div className="flex-1 overflow-auto">
        {activeTab === 'list' ? (
          // Projects List View
          projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border" style={{ borderColor: palettes.grey.grey1 }}>
            <div
              className="h-16 w-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: palettes.blue.blue1
              }}
            >
              <FontAwesomeIcon
                icon={faFolder}
                className="h8 w-8"
                style={{
                  color: palettes.blue.blue3
                }}
              />
            </div>
            <h3
              className="text-lg font-medium mb-2 font-space"
              style={{
                color: text.primary
              }}
            >
              No Projects Yet
              </h3>
            <p
              className="mb-4 font-satoshi"
              style={{
                color: text.secondary
              }}
            >
              Create your first project to start organizing your work
            </p>
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 rounded-xl font-medium font-satoshi transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2"
              style={{
                backgroundColor: primary.blue,
                color: 'white'
              }}
            >
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              <span>Create Project</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const isActive = activeProjectId === project.id;
              const isExpanded = expandedProjectId === project.id;
              const isEditing = editingProjectId === project.id;

              return (
                <div
                  key={project.id}
                  className="rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{
                    backgroundColor: isActive ? palettes.success.success0 + '40' : 'white',
                    borderColor: isActive ? palettes.success.success1 : palettes.grey.grey1,
                    borderWidth: '1px'
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: isActive ? background.teal : background.grey,
                            color: isActive ? primary.teal : primary.blue,
                          }}
                        >
                          <span className="text-lg font-bold font-space">
                            {project.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3
                              className="font-large truncate capitalize font-mono"
                              style={{
                                color: text.primary
                              }}
                            >
                              {project.name}
                            </h3>
                            {isActive && (
                              <span
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border font-space"
                                style={{
                                  backgroundColor: palettes.success.success0,
                                  color: semantic.success,
                                  borderColor: semantic.success
                                }}
                              >
                                <FontAwesomeIcon icon={faStar} className="h-3 w-3 mr-1" />
                                Active
                              </span>
                            )}
                          </div>
                          <div
                            className="flex items-center space-x-4 mt-1 text-sm font-satoshi"
                            style={{
                              color: text.subtle
                            }}
                          >
                            <span className="flex items-center space-x-1">
                              <FontAwesomeIcon icon={faCalendar} className="h-3 w-3" />
                              <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!isActive && (
                          <button
                            onClick={() => handleSetActive(project.id)}
                            className="px-3 py-1.5 text-sm rounded-xl border shadow-sm font-medium font-space transition-all duration-200 transform hover:scale-105"
                            style={{
                              backgroundColor: palettes.success.success0 + '80',
                              color: semantic.success,
                              borderColor: semantic.success + '80'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = semantic.success;
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = palettes.success.success0 + '80';
                              e.currentTarget.style.color = semantic.success;
                            }}
                          >
                            Set Active
                          </button>
                        )}
                        <button
                          onClick={() => handleEditStart(project)}
                          className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 transform hover:scale-105"
                          style={{
                            backgroundColor: 'transparent',
                            color: primary.blue,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = primary.blue + '95';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = primary.blue;
                          }}
                          title="Edit project"
                        >
                          <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(project.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 transform hover:scale-105"
                          style={{
                            backgroundColor: 'transparent',
                            color: semantic.danger + '95',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = semantic.danger + '95';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = semantic.danger + '95';
                          }}
                          title="Delete project"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleExpand(project.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 transform hover:scale-105"
                        style={{
                            backgroundColor: 'transparent',
                            color: primary.blue,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = primary.blue + '80';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = primary.blue;
                          }}
                        >
                          <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && !isEditing && (
                      <div className="mt-4 pt-4">
                        {project.description ? (
                          <p
                            className="text-sm mb-2 font-satoshi"
                            style={{
                              color: text.secondary
                            }}
                          >
                            {project.description}
                          </p>
                        ) : (
                          <p
                            className="text-sm italic font-satoshi"
                            style={{
                              color: text.subtle
                            }}
                          >
                            Edit to add notes
                          </p>
                        )}
                      </div>
                    )}

                    {isEditing && (
                      <div className="mt-4 pt-4">
                        <div className="space-y-4">
                          <div>
                            <label
                              className="block text-sm font-medium mb-1 font-space"
                              style={{
                                color: text.primary
                              }}
                            >
                              Project Name
                            </label>
                            <input
                              type="text"
                              value={editFormData.name}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent font-satoshi"
                              style={{
                                borderColor: palettes.grey.grey2,
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = primary.blue;
                                e.currentTarget.style.outline = `2px solid ${primary.blue}40`;
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = palettes.grey.grey2;
                                e.currentTarget.style.outline = 'none';
                              }}
                              placeholder="Enter project name"
                            />
                          </div>
                          <div>
                            <label
                              className="block text-sm font-medium mb-1 font-space"
                              style={{
                                color: text.primary
                              }}
                            >
                              Description
                            </label>
                            <textarea
                              value={editFormData.description}
                              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent font-satoshi"
                              style={{
                                borderColor: palettes.grey.grey2,
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = primary.blue;
                                e.currentTarget.style.outline = `2px solid ${primary.blue}40`;
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = palettes.grey.grey2;
                                e.currentTarget.style.outline = 'none';
                              }}
                              placeholder="Enter project description (optional)"
                              rows={3}
                            />
                          </div>
                          <div>
                            <label
                              className="block text-sm font-medium mb-1 font-space"
                              style={{
                                color: text.primary
                              }}
                            >
                              Global Context
                            </label>
                            <textarea
                              value={editFormData.global_context}
                              onChange={(e) => setEditFormData({ ...editFormData, global_context: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent font-satoshi"
                              style={{
                                borderColor: palettes.grey.grey2,
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = primary.blue;
                                e.currentTarget.style.outline = `2px solid ${primary.blue}40`;
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = palettes.grey.grey2;
                                e.currentTarget.style.outline = 'none';
                              }}
                              placeholder="Enter global context (optional)"
                              rows={2}
                            />
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={handleEditSave}
                              className="px-4 py-2 rounded-2xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                              style={{
                                backgroundColor: primary.teal,
                                color: 'white'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = palettes.teal.teal3;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = primary.teal;
                              }}
                            >
                              <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                              <span>Save Changes</span>
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="px-4 py-2 rounded-2xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                              style={{
                                backgroundColor: palettes.grey.grey1,
                                color: 'white'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = palettes.grey.grey2;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = palettes.grey.grey1;
                              }}
                            >
                              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                              <span>Cancel</span>
                            </button>
                    </div>
                  </div>
                    </div>
                    )}
                  </div>
                  </div>
              );
            })}
          </div>
        )
      ) : (
        <ProjectCreateForm
          projectName={projectName}
          projectDescription={projectDescription}
          globalContext={globalContext}
          marketStudies={marketStudies}
          countries={countries}
          appStores={appStores}
          submitting={submitting}
          onProjectNameChange={setProjectName}
          onProjectDescriptionChange={setProjectDescription}
          onGlobalContextChange={setGlobalContext}
          onMarketStudiesChange={setMarketStudies}
          onSubmit={handleCreateProject}
          onCancel={() => setActiveTab('list')}
        />
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal !== null}
        onClose={() => setDeleteModal(null)}
        title="Delete Project"
        footer={
          <div className="flex space-x-3">
            <button
              onClick={() => setDeleteModal(null)}
              className="px-4 py-2 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 border"
              style={{
                backgroundColor: palettes.grey.grey1,
                color: 'white',
                border: `1px solid ${palettes.grey.grey1}`
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => deleteModal && deleteProject(deleteModal)}
              className="px-4 py-2 rounded-xl font-medium font-space transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
              style={{
                backgroundColor: semantic.danger,
                color: 'white'
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>Delete</span>
            </button>
          </div>
        }
      >
        <p className="font-satoshi" style={{ color: text.subtle }}>
          Are you sure you want to delete this project? This action cannot be undone and
          will delete all associated market studies and keywords.
        </p>
      </Modal>
    </div>
  );
}