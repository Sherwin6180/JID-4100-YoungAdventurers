// app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');
const classRoutes = require('./routes/class');
const assignmentRoutes = require('./routes/assignment');

const app = express();

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/class', classRoutes);
app.use('/api/assignment', assignmentRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
