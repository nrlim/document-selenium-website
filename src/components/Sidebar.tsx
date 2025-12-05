import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DocItem {
  id: string;
  title: string;
}

interface SidebarProps {
  sections: Array<{ id: string; title: string; items?: DocItem[] }>;
  activeSection: string;
  onSectionChange: (id: string) => void;
  onItemSelect?: (itemId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeSection,
  onSectionChange,
  onItemSelect,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set([activeSection]));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary text-white p-3 rounded-lg shadow-lg hover:bg-green-600 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 w-64 h-screen bg-gray-900 text-white p-6 overflow-y-auto z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Selenium</h1>
          <p className="text-gray-400 text-sm">WebDriver Documentation</p>
        </div>

        <nav className="space-y-1">
          {sections.map((section) => (
            <div key={section.id}>
              {/* Main Section Button */}
              <button
                onClick={() => {
                  onSectionChange(section.id);
                  toggleSection(section.id);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between gap-2 ${
                  activeSection === section.id
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="text-sm font-medium">{section.title}</span>
                {section.items && section.items.length > 0 && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedSections.has(section.id) ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Expanded Items */}
              {expandedSections.has(section.id) && section.items && section.items.length > 0 && (
                <nav className="mt-2 ml-2 space-y-0 border-l-2 border-primary/30">
                  {section.items.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => {
                        onItemSelect?.(item.id);
                        setIsOpen(false);
                      }}
                      className="flex items-center pl-4 pr-3 py-2 text-xs text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-200 border-l-2 border-transparent hover:border-primary"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-500 hover:bg-primary transition-colors mr-2.5 flex-shrink-0"></span>
                      <span className="flex-1 truncate">{item.title}</span>
                    </a>
                  ))}
                </nav>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-5 pt-5 border-t border-gray-700 space-y-3">
          <div className="text-center">
            <p className="text-xs text-gray-500">Version 1.0.0</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Created by</p>
            <a
              href="https://nuralim.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:text-green-400 transition-colors font-semibold"
            >
              Nuralim
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
