import { useState, useEffect } from 'react';

/**
 * Tab navigation component with URL hash-based state
 * @param {array} tabs - Array of tab objects with id, label, and content
 * @param {string} defaultTab - Default active tab ID
 */
export default function TabNavigation({ tabs, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  // Sync with URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const validTab = tabs.find(t => t.id === hash);
    if (validTab) {
      setActiveTab(hash);
    }
  }, [tabs]);

  // Update URL hash when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  const activeTabData = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-2 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition
                ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTabData?.content}
      </div>
    </div>
  );
}
