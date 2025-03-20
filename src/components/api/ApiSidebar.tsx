
import React from 'react';
import SidebarNavItem from './SidebarNavItem';

interface ApiSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ApiSidebar: React.FC<ApiSidebarProps> = ({ activeSection, onSectionChange }) => {
  return (
    <div className="lg:w-1/4">
      <div className="glass-card rounded-xl p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold mb-4">API Documentation</h2>
        <nav className="space-y-1">
          <SidebarNavItem 
            active={activeSection === 'overview'} 
            onClick={() => onSectionChange('overview')}
          >
            Overview
          </SidebarNavItem>
          <SidebarNavItem 
            active={activeSection === 'authentication'} 
            onClick={() => onSectionChange('authentication')}
          >
            Authentication
          </SidebarNavItem>
          <SidebarNavItem 
            active={activeSection === 'rate-limits'} 
            onClick={() => onSectionChange('rate-limits')}
          >
            Rate Limits
          </SidebarNavItem>
          <SidebarNavItem 
            active={activeSection === 'endpoint-optimization'} 
            onClick={() => onSectionChange('endpoint-optimization')}
          >
            Endpoint Optimization
          </SidebarNavItem>
          
          <div className="pt-2 pb-1">
            <p className="text-xs uppercase font-medium text-muted-foreground tracking-wider">Endpoints</p>
          </div>
          
          <SidebarNavItem 
            active={activeSection === 'strains'} 
            onClick={() => onSectionChange('strains')}
          >
            Strains
          </SidebarNavItem>
          <SidebarNavItem 
            active={activeSection === 'medical'} 
            onClick={() => onSectionChange('medical')}
          >
            Medical Research
          </SidebarNavItem>
          <SidebarNavItem 
            active={activeSection === 'lab-data'} 
            onClick={() => onSectionChange('lab-data')}
          >
            Lab Data
          </SidebarNavItem>
          <SidebarNavItem 
            active={activeSection === 'compliance'} 
            onClick={() => onSectionChange('compliance')}
          >
            Compliance
          </SidebarNavItem>
          <SidebarNavItem 
            active={activeSection === 'reviews'} 
            onClick={() => onSectionChange('reviews')}
          >
            User Reviews
          </SidebarNavItem>
          
          <div className="pt-2 pb-1">
            <p className="text-xs uppercase font-medium text-muted-foreground tracking-wider">Resources</p>
          </div>
          
          <SidebarNavItem 
            active={activeSection === 'schema'} 
            onClick={() => onSectionChange('schema')}
          >
            Data Schema
          </SidebarNavItem>
          <SidebarNavItem 
            active={activeSection === 'licensing'} 
            onClick={() => onSectionChange('licensing')}
          >
            Licensing & Terms
          </SidebarNavItem>
          <SidebarNavItem 
            active={activeSection === 'sdks'} 
            onClick={() => onSectionChange('sdks')}
          >
            SDKs & Libraries
          </SidebarNavItem>
          
          <SidebarNavItem 
            active={activeSection === 'ai-recommendations'} 
            onClick={() => onSectionChange('ai-recommendations')}
          >
            AI Recommendations
          </SidebarNavItem>
        </nav>
      </div>
    </div>
  );
};

export default ApiSidebar;
