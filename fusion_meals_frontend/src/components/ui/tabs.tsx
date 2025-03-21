import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a TabsProvider');
  }
  return context;
};

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className = '', children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '' }) => {
  const { activeTab, setActiveTab } = useTabs();
  
  return (
    <button
      type="button"
      role="tab"
      className={`flex-1 rounded-md py-2 text-center text-sm font-medium transition-all 
        ${activeTab === value 
          ? 'bg-white text-blue-600 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900'
        } ${className}`}
      onClick={() => setActiveTab(value)}
      aria-selected={activeTab === value}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {
  const { activeTab } = useTabs();
  
  if (activeTab !== value) {
    return null;
  }
  
  return (
    <div
      role="tabpanel"
      className={`mt-2 rounded-md ${className}`}
    >
      {children}
    </div>
  );
}; 