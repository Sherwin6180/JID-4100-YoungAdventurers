import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [courseID, setCourseID] = useState('');
  const [semester, setSemester] = useState('');
  const [sectionID, setSectionID] = useState('');

  return (
    <UserContext.Provider value={{ username, setUsername, courseID, setCourseID, semester, setSemester, sectionID, setSectionID }}>
      {children}
    </UserContext.Provider>
  );
};
