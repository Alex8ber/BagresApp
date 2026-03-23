import React, { createContext, useState } from 'react';

// Create the Context
export const TeacherContext = createContext();

// Create the Provider
export const TeacherProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);

  // Function to add a newly created class to the global state
  const addClass = (newClass) => {
    setClasses((prevClasses) => [...prevClasses, newClass]);
  };

  return (
    <TeacherContext.Provider value={{ classes, addClass }}>
      {children}
    </TeacherContext.Provider>
  );
};
