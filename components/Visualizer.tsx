import React from 'react';

interface VisualizerProps {
  level: number; // 0 to 1
  isActive: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ level, isActive }) => {
  // Normalize level slightly for better visual effect
  const activeHeight = Math.min(100, Math.max(10, level * 500)); 
  
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-2 rounded-full transition-all duration-100 ease-in-out ${isActive ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-600'}`}
          style={{
            height: isActive ? `${Math.max(10, activeHeight * (1 - Math.abs(2 - i) * 0.2))}%` : '10%',
          }}
        />
      ))}
    </div>
  );
};

export default Visualizer;