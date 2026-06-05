import React from 'react';

interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = ['Tất cả', 'Làm sạch da', 'Cân bằng da', 'Dưỡng ẩm', 'Chống nắng', 'Phục hồi'];

  return (
    <div className="category-tabs-container sticky-tabs">
      <div className="category-tabs">
        {tabs.map((tab) => (
          <div 
            key={tab} 
            className={`cat-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
