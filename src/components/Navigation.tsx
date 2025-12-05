import React from 'react';
import { Search } from 'lucide-react';

interface NavigationProps {
  onSearch?: (query: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onSearch }) => {
  return (
    <nav className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              📚 Selenium WebDriver Docs
            </h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documentation..."
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.selenium.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors hidden sm:inline"
            >
              Official Docs
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
