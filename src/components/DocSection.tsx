import React from 'react';
import { CodeBlock } from './CodeBlock';
import { DocItem } from '@/data/documentation';
import { Code, BookOpen } from 'lucide-react';

interface DocSectionProps {
  item: DocItem;
  isActive?: boolean;
}

export const DocSection: React.FC<DocSectionProps> = ({ item, isActive }) => {
  return (
    <div className={`mb-12 scroll-mt-20 transition-all duration-300 ${isActive ? 'bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-2 border-yellow-300 dark:border-yellow-600' : ''}`} id={item.id}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Code className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{item.title}</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">{item.description}</p>
      </div>

      {/* Syntax */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded mb-6">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">Syntax</h3>
        <CodeBlock code={item.syntax} language={item.language || 'java'} />
      </div>

      {/* Examples */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Contoh Penggunaan
        </h3>
        <div className="space-y-6">
          {item.examples.map((example, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="mb-3">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {index + 1}. {example.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{example.description}</p>
              </div>
              <CodeBlock code={example.code} language={example.language} />
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {item.notes && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded">
          <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">💡 Catatan Penting</h3>
          <p className="text-amber-800 dark:text-amber-100 text-sm">{item.notes}</p>
        </div>
      )}
    </div>
  );
};
