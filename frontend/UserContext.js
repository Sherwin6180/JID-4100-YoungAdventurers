import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [courseID, setCourseID] = useState('');
  const [semester, setSemester] = useState('');
  const [sectionID, setSectionID] = useState('');
  const [assignmentID, setAssignmentID] = useState('');
  const [groupID, setGroupID] = useState('');
  const [submissionID, setSubmissionID] = useState('');

  return (
    <UserContext.Provider value={{ username, setUsername, courseID, setCourseID, semester, setSemester, sectionID, setSectionID, assignmentID, setAssignmentID, groupID, setGroupID, submissionID, setSubmissionID }}>
      {children}
    </UserContext.Provider>
  );
};
