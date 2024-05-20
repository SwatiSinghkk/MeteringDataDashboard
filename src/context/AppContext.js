// src/context/AppContext.js
import React, { createContext, useRef, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const selectedMetersRef = useRef([]);
  const [showGraph, setShowGraph] = useState(false);
  const [isLineChart, setIsLineChart] = useState(true);
  const [showWidget, setShowWidget] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AppContext.Provider value={{
      startTimeRef,
      endTimeRef,
      selectedMetersRef,
      showGraph,
      setShowGraph,
      isLineChart,
      setIsLineChart,
      setIsModalOpen,
      isModalOpen,
      showWidget,
      setShowWidget,
      showAlert,
      setShowAlert
    }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
