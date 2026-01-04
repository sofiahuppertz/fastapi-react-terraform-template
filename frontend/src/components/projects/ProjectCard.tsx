import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faStar,
  faChevronDown,
  faChevronUp,
  faCalendar,
  faCheck,
  faTimes,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import type { ProjectResponse } from '../../dto';
import { text, palettes, primary, semantic, background } from '../../config/colors';

interface ProjectCardProps {
  project: ProjectResponse;
  isActive: boolean;
  isExpanded: boolean;
  isEditing: boolean;
  editFormData: { name: string; description: string };
  onToggleExpand: () => void;
  onSetActive: () => void;
  onEditStart: () => void;
  onEditCancel: () => void;
  onEditSave: () => void;
  onDelete: () => void;
  onFormDataChange: (data: { name: string; description: string }) => void;
}

export function ProjectCard({
  project,
  isActive,
  isExpanded,
  isEditing,
  editFormData,
  onToggleExpand,
  onSetActive,
  onEditStart,
  onEditCancel,
  onEditSave,
  onDelete,
  onFormDataChange,
}: ProjectCardProps) {
  return (
    <div
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
                onClick={onSetActive}
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
              onClick={onEditStart}
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
              onClick={onDelete}
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
              onClick={onToggleExpand}
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
                  onChange={(e) => onFormDataChange({ ...editFormData, name: e.target.value })}
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
                  onChange={(e) => onFormDataChange({ ...editFormData, description: e.target.value })}
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
              <div className="flex space-x-3">
                <button
                  onClick={onEditSave}
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
                  onClick={onEditCancel}
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
}

