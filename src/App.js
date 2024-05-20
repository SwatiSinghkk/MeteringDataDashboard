// src/App.js
import React from 'react';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <AppProvider>
      <div>
        <Dashboard />
      </div>
    </AppProvider>
  );
};

export default App;
