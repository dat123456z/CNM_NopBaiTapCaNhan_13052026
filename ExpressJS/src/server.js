require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connection, sequelize } = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());

require('./models/User');
require('./models/Verification');

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await connection();

        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Server start error:', err);
        process.exit(1);
    }
};

start();
