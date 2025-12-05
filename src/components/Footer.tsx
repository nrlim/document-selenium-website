import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Selenium Docs</h3>
            <p className="text-gray-400 text-sm">
              Dokumentasi lengkap untuk Selenium WebDriver properties dan automation best practices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="https://www.selenium.dev" className="hover:text-primary transition">
                  Official Website
                </a>
              </li>
              <li>
                <a href="https://github.com/SeleniumHQ/selenium" className="hover:text-primary transition">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="https://www.selenium.dev/documentation" className="hover:text-primary transition">
                  Official Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Topics</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>WebDriver Properties</li>
              <li>Element Locators</li>
              <li>Wait Strategies</li>
              <li>Advanced Automation</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Selenium WebDriver Documentation. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary transition">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
