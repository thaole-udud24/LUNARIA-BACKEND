import React from 'react';
import './CategoryTabs.less';

interface CategoryTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="category-tabs-wrapper">
      <div className="category-tabs-container">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={`cat-tab-lunaria ${
              activeTab === tab ? 'is-active' : ''
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;