const Product = require('../models/Product');

const SHOP_ID = 1;

const PRODUCT_DATA = [
    {
        shopId: SHOP_ID,
        title: 'Áo thun basic unisex',
        description: 'Áo thun cotton 100% mềm mại, form regular vừa vặn. Thoáng khí, thấm hút mồ hôi tốt, phù hợp mặc hàng ngày hoặc đi chơi.',
        price: 150000,
        originalPrice: 200000,
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
            'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'
        ],
        category: 'Thời trang',
        stock: 25,
        sold: 120,
        similarIds: [2, 4],
        colors: [
            { label: 'Trắng', value: '#ffffff' },
            { label: 'Đen', value: '#1a1a1a' },
            { label: 'Xám', value: '#9ca3af' },
            { label: 'Be', value: '#d4b896' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Quần jean slim fit',
        description: 'Quần jean co giãn nhẹ, dáng slim phong cách. Chất liệu denim cao cấp bền bỉ, phù hợp cho mọi độ tuổi và dịp mặc.',
        price: 350000,
        originalPrice: null,
        images: [
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
            'https://images.unsplash.com/photo-1604176424472-9d7b4f0e30a5?w=800&q=80'
        ],
        category: 'Thời trang',
        stock: 8,
        sold: 89,
        similarIds: [1, 4],
        colors: [
            { label: 'Xanh đậm', value: '#1e3a5f' },
            { label: 'Xanh nhạt', value: '#5b8fb9' },
            { label: 'Đen', value: '#1a1a1a' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Giày sneaker trắng classic',
        description: 'Giày thể thao thời trang đế cao su êm ái, trọng lượng nhẹ. Thiết kế hiện đại dễ phối với mọi trang phục.',
        price: 650000,
        originalPrice: 850000,
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
            'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80'
        ],
        category: 'Giày dép',
        stock: 0,
        sold: 234,
        similarIds: [7, 8],
        colors: [
            { label: 'Trắng', value: '#ffffff' },
            { label: 'Đen', value: '#1a1a1a' },
            { label: 'Đỏ', value: '#ef4444' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Áo khoác bomber thu đông',
        description: 'Áo khoác bomber ấm áp với lớp lót bông mỏng, chống gió nhẹ.',
        price: 750000,
        originalPrice: null,
        images: [
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
            'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=80'
        ],
        category: 'Thời trang',
        stock: 12,
        sold: 67,
        similarIds: [1, 2],
        colors: [
            { label: 'Đen', value: '#1a1a1a' },
            { label: 'Xanh rêu', value: '#4a5240' },
            { label: 'Nâu', value: '#7c5c3e' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Túi xách da tổng hợp cao cấp',
        description: 'Túi xách da tổng hợp chất lượng cao, thiết kế thanh lịch.',
        price: 1200000,
        originalPrice: 1500000,
        images: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'
        ],
        category: 'Phụ kiện',
        stock: 5,
        sold: 43,
        similarIds: [6, 9],
        colors: [
            { label: 'Đen', value: '#1a1a1a' },
            { label: 'Nâu', value: '#7c5c3e' },
            { label: 'Kem', value: '#f5f0e8' }
        ]
    }
];

const seedIfEmpty = async () => {
    try {
        const count = await Product.count();

        if (count > 0) {
            console.log(`>>> Products đã tồn tại (${count}), skip seed`);
            return;
        }

        await Product.bulkCreate(PRODUCT_DATA);

        console.log(`>>> Seed thành công ${PRODUCT_DATA.length} products`);
    } catch (err) {
        console.error('>>> Seed error:', err.message);
    }
};

module.exports = { seedIfEmpty };