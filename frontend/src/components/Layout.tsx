import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faGlobe,
  faRightFromBracket,
  faCopyright,
  faGears,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { palettes, text } from '../config/colors';

export function Layout() {
  const navigate = useNavigate();
  const { signOut, isSuperuser } = useAuth();
  const [hasActiveProject, setHasActiveProject] = useState(false);

  // Custom scrollbar styles
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 12px !important;
      height: 12px !important;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: ${palettes.dusty.dusty0 + '60'} !important;
      border-radius: 6px !important;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: ${palettes.dusty.dusty1 + '80'} !important;
      border-radius: 6px !important;
      border: 2px solid ${palettes.dusty.dusty0+ '60'} !important;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: ${palettes.dusty.dusty1 + '80'} !important;
    }
    .custom-scrollbar::-webkit-scrollbar-corner {
      background: ${palettes.dusty.dusty0+ '60'} !important;
    }
    
    /* Firefox scrollbar styling */
    .custom-scrollbar {
      scrollbar-width: thin !important;
      scrollbar-color: ${palettes.dusty.dusty2} ${palettes.dusty.dusty0} !important;
    }
  `;

  useEffect(() => {
    // Check if there's an active project
    const checkActiveProject = () => {
      const activeProjectId = localStorage.getItem('active_project_id');
      setHasActiveProject(!!activeProjectId);
    };

    checkActiveProject();

    // Listen for storage changes (when active project is set/cleared)
    window.addEventListener('storage', checkActiveProject);
    
    // Listen for custom event when active project changes
    const handleActiveProjectChange = () => {
      checkActiveProject();
    };
    window.addEventListener('activeProjectChanged', handleActiveProjectChange);

    return () => {
      window.removeEventListener('storage', checkActiveProject);
      window.removeEventListener('activeProjectChanged', handleActiveProjectChange);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { path: '/', icon: faFolder, label: 'Projects', isVisible: true },
    { path: '/market-studies', icon: faGlobe, label: 'Market Studies', isVisible: hasActiveProject },
    { path: '/profile', icon: faUser, label: 'Profile', isVisible: true },
    { path: '/admin', icon: faGears, label: 'Admin', isVisible: isSuperuser },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <style>{scrollbarStyles}</style>
      <div className="flex flex-1 overflow-hidden">
        {/* Collapsible Sidebar */}
        <aside 
          className="fixed top-6 left-6 z-30 w-[68px] hover:w-[200px] shadow-2xl rounded-3xl transition-all duration-300 ease-in-out group bg-white"
        >
          <div className="flex flex-col min-h-fit border rounded-3xl" style={{
            borderColor: palettes.blue.blue1,
          }}>
            {/* Sidebar Header */}
            <div className="flex items-center py-6 px-4 border-b" style={{
              borderColor: palettes.blue.blue1,
            }}>
              <div className="flex items-center justify-center group-hover:justify-start transition-all duration-300">
                <div className="h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <img 
                    src="/images/logo.png" 
                    alt="AD4SCREEN Logo" 
                    className="h-8 w-8 object-contain" 
                  />
                </div>
                <span className="ml-3 font-light text-md opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden tracking-wide font-mono font-bold" style={{
                  color: text.primary,
                }}>
                  AD4SCREEN
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="py-8">
              <ul className="space-y-1 flex flex-col mb-4 border-b pb-4" style={{
                borderColor: palettes.blue.blue1,
              }}>
                {navItems.filter(item => item.isVisible).map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) => 
                        `flex items-center justify-center group-hover:justify-start rounded-full m-0.5 px-2 py-4 text-sm font-light transition-all duration-300 font-satoshi ${
                          isActive ? 'shadow-lg' : ''
                        }`
                      }
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? palettes.blue.blue4 : 'transparent',
                        color: isActive ? 'white' : palettes.blue.blue4,
                      })}
                      onMouseEnter={(e) => {
                        const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = palettes.blue.blue4;
                          e.currentTarget.style.color = 'white';
                        }
                      }}
                      onMouseLeave={(e) => {
                        const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = palettes.blue.blue3;
                        }
                      }}
                    >
                      <span className="group-hover:w-6 h-6 transition-all duration-300 flex items-center justify-center">
                        <FontAwesomeIcon icon={item.icon} size="sm" />
                      </span>
                      <span className="hidden group-hover:block transition-all duration-300 overflow-hidden ml-4 whitespace-nowrap text-ellipsis">
                        {item.label}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* User Info & Logout */}
              <div className="px-2">
                <button
                  onClick={handleSignOut}
                  title="Logout"
                  className="w-full flex items-center justify-center group-hover:justify-start px-2 py-4 rounded-full text-sm font-light transition-all duration-300 font-satoshi"
                  style={{
                    color: palettes.teal.teal3 + '90',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = palettes.teal.teal3 + '90';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = palettes.teal.teal3 + '90';
                  }}
                >
                  <span className="group-hover:w-6 h-6 transition-all duration-300 flex items-center justify-center">
                    <FontAwesomeIcon icon={faRightFromBracket} size="sm" />
                  </span>
                  <span className="hidden group-hover:block transition-all duration-300 overflow-hidden ml-4 whitespace-nowrap text-ellipsis">
                    Logout
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 ml-[92px] transition-all duration-300 flex flex-col overflow-hidden">
          <div className="p-12 flex-1 max-w-7xl mx-auto w-full overflow-y-auto custom-scrollbar">
            <Outlet />
          </div>
        </div>
      </div>
      
      {/* Footer - spans full width */}
      <footer className="py-1 border-t z-[9999] backdrop-blur-md bg-opacity-80" style={{
        backgroundColor: palettes.grey.grey0 + 'CC',
        borderColor: palettes.grey.grey1,
      }}>
        <p className="text-xs text-center flex items-center justify-center gap-1.5" style={{
          color: text.subtle,
        }}>
          <FontAwesomeIcon icon={faCopyright} className="h-3 w-3" />
          <span>Ad4screen AI ASO Assistant 2025 - All rights reserved</span>
        </p>
      </footer>
    </div>
  );
}