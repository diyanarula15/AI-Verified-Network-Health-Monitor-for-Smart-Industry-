import React from 'react';
import { Network, Server, FileText, Settings, Activity, Cpu, Search } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-20 bg-cyber-slate border-r border-slate-700 flex flex-col items-center py-6 h-full z-20">
      <div className="mb-10 p-2 bg-neon-green/10 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">
        <Cpu className="w-8 h-8 text-neon-green" />
      </div>
      
      <nav className="flex-1 flex flex-col gap-6 w-full">
        <NavItem icon={<Network />} label="Topology" active />
        <NavItem icon={<Server />} label="Asset Inventory" />
        <NavItem icon={<Search />} label="Find Device" /> 
        <NavItem icon={<Activity />} label="Monitoring" />
        <NavItem icon={<FileText />} label="Reports" />
      </nav>

      <div className="mt-auto">
        <NavItem icon={<Settings />} label="Settings" />
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`group relative flex items-center justify-center w-full h-12 transition-all duration-200 
    ${active ? 'text-neon-green' : 'text-slate-400 hover:text-slate-100'}`}>
    <div className={`absolute left-0 w-1 h-8 bg-neon-green rounded-r-full transition-all duration-300 
      ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
    <span className="w-6 h-6">{icon}</span>
    <span className="absolute left-16 bg-cyber-black text-xs px-2 py-1.5 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl text-slate-200">
      {label}
    </span>
  </button>
);

export default Sidebar;