import { NotebookPen } from 'lucide-react';
import React from 'react';

interface AppLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ className = '', iconSize = 32, textSize = 'text-3xl' }) => {
  return (
    <div className={`flex items-center gap-3 text-primary ${className}`}>
      <NotebookPen size={iconSize} strokeWidth={2} />
      <h1 className={`font-bold ${textSize} tracking-tight`}>ScriptAssist</h1>
    </div>
  );
};

export default AppLogo;
