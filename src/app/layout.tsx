import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Selenium WebDriver Documentation',
  description: 'Complete guide to Selenium WebDriver properties, elements, and automation best practices',
  keywords: 'Selenium, WebDriver, Automation, Testing, Java',
  authors: [{ name: 'Selenium Documentation' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
