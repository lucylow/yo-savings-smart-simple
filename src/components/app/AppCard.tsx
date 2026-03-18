import React from 'react';

const AppCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-card border border-border rounded-outer p-2 shadow-heavy ${className}`}>
      <div className="bg-card-elevated rounded-lg p-6 shadow-inset border border-border">
        {children}
      </div>
    </div>
  );
};

export default AppCard;
