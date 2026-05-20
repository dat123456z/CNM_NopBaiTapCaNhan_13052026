require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { connection, sequelize } = require('./config/database');
const { seedIfEmpty } = require('./seeders/productSeeder');

const app = express();

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));

require('./models/User');
require('./models/Verification');
require('./models/Product');
require('./models/Shop');
require('./models/CartItem');
require('./models/Order');
require('./models/Review');
require('./models/Wishlist');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/products', require('./routes/product'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/carts', require('./routes/cart'));
app.use('/api/reviews', require('./routes/review'));
app.use('/api/shops', require('./routes/shop'));
app.use('/api/wishlists', require('./routes/wishlist'));
app.use('/api/revenues', require('./routes/revenue'));

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await connection();

        await sequelize.sync();

        await seedIfEmpty();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Server start error:', err);
        process.exit(1);
    }
};

start();