'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navigation } from '@/components/Navigation';
import { DocSection } from '@/components/DocSection';
import { documentation } from '@/data/documentation';

export default function Home() {
  const [activeSection, setActiveSection] = useState(documentation[0].id);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSection = documentation.find((s) => s.id === activeSection);
  const filteredItems = currentSection?.items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar
        sections={documentation}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onItemSelect={setActiveItem}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Navigation */}
        <Navigation onSearch={setSearchQuery} />

        {/* Hero Section */}
        {searchQuery === '' && (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {currentSection?.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                {currentSection?.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="inline-block px-3 py-1 bg-primary text-white rounded-full">
                  {filteredItems.length} Topics
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
          {searchQuery && filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                No results found for &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary hover:text-green-600 transition"
              >
                Clear search
              </button>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="space-y-8">
              {filteredItems.map((item) => (
                <DocSection key={item.id} item={item} isActive={activeItem === item.id} />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {currentSection?.items.map((item) => (
                <DocSection key={item.id} item={item} isActive={activeItem === item.id} />
              ))}
            </div>
          )}

          {/* Navigation between sections */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  const currentIndex = documentation.findIndex((s) => s.id === activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(documentation[currentIndex - 1].id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                disabled={documentation.findIndex((s) => s.id === activeSection) === 0}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                {documentation.findIndex((s) => s.id === activeSection) + 1} /{' '}
                {documentation.length}
              </div>

              <button
                onClick={() => {
                  const currentIndex = documentation.findIndex((s) => s.id === activeSection);
                  if (currentIndex < documentation.length - 1) {
                    setActiveSection(documentation[currentIndex + 1].id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                disabled={
                  documentation.findIndex((s) => s.id === activeSection) ===
                  documentation.length - 1
                }
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
