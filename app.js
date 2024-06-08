const express = require("express");
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoute');
const searchRoutes = require('./routes/searchRoute');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

app.use('/api/auth', authRoutes);
app.use('/api/user', searchRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});