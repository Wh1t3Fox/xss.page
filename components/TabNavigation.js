import { useState, useEffect } from 'react';

/**
 * Tab navigation component - supports both controlled and uncontrolled modes
 *
 * Controlled mode (recommended):
 * @param {array} tabs - Array of tab objects with id and label
 * @param {string} activeTab - Current active tab ID (controlled)
 * @param {function} onTabChange - Callback when tab changes (controlled)
 *
 * Uncontrolled mode (legacy):
 * @param {array} tabs - Array of tab objects with id, label, and content
 * @param {string} defaultTab - Default active tab ID
 */
export default function TabNavigation({ tabs, activeTab: controlledActiveTab, onTabChange, defaultTab }) {
  // Internal state for uncontrolled mode
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id);

  // Determine if we're in controlled mode
  const isControlled = controlledActiveTab !== undefined && onTabChange !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  // Sync with URL hash on mount (uncontrolled mode only)
  useEffect(() => {
    if (!isControlled) {
      const hash = window.location.hash.slice(1);
      const validTab = tabs.find(t => t.id === hash);
      if (validTab) {
        setInternalActiveTab(hash);
      }
    }
  }, [tabs, isControlled]);

  // Handle tab changes
  const handleTabChange = (tabId) => {
    if (isControlled) {
      // Controlled mode: call the parent's callback
      onTabChange(tabId);
    } else {
      // Uncontrolled mode: manage internal state and URL hash
      setInternalActiveTab(tabId);
      window.location.hash = tabId;
    }
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

      {/* Tab Content - only render in uncontrolled mode with content */}
      {!isControlled && activeTabData?.content && (
        <div className="py-6">
          {activeTabData.content}
        </div>
      )}
    </div>
  );
}
