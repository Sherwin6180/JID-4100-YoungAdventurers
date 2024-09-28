// app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const classRoutes = require('./routes/class');

const app = express();

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/student', classRoutes)
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
