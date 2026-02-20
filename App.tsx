import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import LineSelection from './components/LineSelection';
import OperatorDashboard from './components/OperatorDashboard';
import InjectorPanel from './components/InjectorPanel';
import { SimulationProvider } from './context/SimulationContext';

const App: React.FC = () => {
  // Auth State Machine
  const [role, setRole] = useState<'operator' | 'injector' | null>(null);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  // Handlers
  const handleLogin = (selectedRole: 'operator' | 'injector') => {
    setRole(selectedRole);
  };

  const handleSelectLine = (lineId: string) => {
    setSelectedLine(lineId);
  };

  const handleLogout = () => {
    setRole(null);
    setSelectedLine(null);
  };

  const handleBackToLogin = () => {
    setRole(null);
    setSelectedLine(null);
  };

  // Render Logic
  let content;

  if (!role) {
    content = <LoginScreen onLogin={handleLogin} />;
  } else if (!selectedLine) {
    content = (
      <LineSelection 
        onSelectLine={handleSelectLine} 
        onBack={handleBackToLogin}
        role={role} 
      />
    );
  } else {
    // Authenticated View
    if (role === 'operator') {
      content = <OperatorDashboard lineId={selectedLine} onLogout={handleLogout} />;
    } else {
      content = <InjectorPanel lineId={selectedLine} onLogout={handleLogout} />;
    }
  }

  return (
    <SimulationProvider>
        {content}
    </SimulationProvider>
  );
};

export default App;
