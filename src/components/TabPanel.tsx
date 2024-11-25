import React from 'react';

interface TabPanelProps {
  children: React.ReactNode;
  active: boolean;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, active }) => {
  if (!active) return null;
  
  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
};

export default TabPanel;