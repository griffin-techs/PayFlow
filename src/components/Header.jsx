import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="glass-card sticky top-0 z-50 px-6 py-4 mb-8 animate-fade-in">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <FileText className="h-8 w-8 text-primary animate-float" />
            <Sparkles className="h-4 w-4 text-primary-glow absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              PayFlow
            </h1>
            <p className="text-sm text-muted-foreground font-medium">Professional Invoice & Receipt Generator</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Ready to generate</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;