import type { ProjectResponse } from '../../dto';
import { ProjectCard } from './ProjectCard';
import { EmptyProjectsState } from './EmptyProjectsState';

interface ProjectListProps {
  projects: ProjectResponse[];
  activeProjectId: string | null;
  expandedProjectId: string | null;
  editingProjectId: string | null;
  editFormData: { name: string; description: string };
  onToggleExpand: (projectId: string) => void;
  onSetActive: (projectId: string) => void;
  onEditStart: (project: ProjectResponse) => void;
  onEditCancel: () => void;
  onEditSave: () => void;
  onDelete: (projectId: string) => void;
  onFormDataChange: (data: { name: string; description: string }) => void;
  onCreateClick: () => void;
}

export function ProjectList({
  projects,
  activeProjectId,
  expandedProjectId,
  editingProjectId,
  editFormData,
  onToggleExpand,
  onSetActive,
  onEditStart,
  onEditCancel,
  onEditSave,
  onDelete,
  onFormDataChange,
  onCreateClick,
}: ProjectListProps) {
  if (projects.length === 0) {
    return <EmptyProjectsState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isActive={activeProjectId === project.id}
          isExpanded={expandedProjectId === project.id}
          isEditing={editingProjectId === project.id}
          editFormData={editFormData}
          onToggleExpand={() => onToggleExpand(project.id)}
          onSetActive={() => onSetActive(project.id)}
          onEditStart={() => onEditStart(project)}
          onEditCancel={onEditCancel}
          onEditSave={onEditSave}
          onDelete={() => onDelete(project.id)}
          onFormDataChange={onFormDataChange}
        />
      ))}
    </div>
  );
}

