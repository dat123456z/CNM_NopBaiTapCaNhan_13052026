require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connection, sequelize } = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

require('./models/User');
require('./models/Verification');
require('./models/Product');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/products', require('./routes/product'));

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