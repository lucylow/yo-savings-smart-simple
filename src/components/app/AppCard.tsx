import React, { forwardRef } from 'react';

const AppCard = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = '' }, ref) => {
    return (
      <div ref={ref} className={`bg-card border border-border rounded-outer p-1.5 shadow-heavy ${className}`}>
        <div className="bg-card-elevated rounded-[calc(var(--radius-outer)-6px)] p-5 sm:p-6 shadow-inset border border-border">
          {children}
        </div>
      </div>
    );
  }
);

AppCard.displayName = 'AppCard';

export default AppCard;
