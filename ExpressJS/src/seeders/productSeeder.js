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
        description: 'Giày thể thao thời trang đế cao su êm ái, trọng lượng nhẹ.',
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
    },
    {
        shopId: SHOP_ID,
        title: 'Kính râm unisex',
        description: 'Kính râm gọng kim loại siêu nhẹ, chống tia UV cực tốt, phù hợp đi biển.',
        price: 250000,
        originalPrice: 350000,
        images: [
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
            'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80'
        ],
        category: 'Phụ kiện',
        stock: 50,
        sold: 210,
        similarIds: [5],
        colors: [
            { label: 'Đen', value: '#1a1a1a' },
            { label: 'Vàng kim', value: '#ffd700' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Đồng hồ nam dây da',
        description: 'Đồng hồ thanh lịch cho phái mạnh, mặt kính chống xước cao cấp.',
        price: 2100000,
        originalPrice: 2500000,
        images: [
            'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80'
        ],
        category: 'Phụ kiện',
        stock: 15,
        sold: 30,
        similarIds: [5],
        colors: [
            { label: 'Nâu', value: '#7c5c3e' },
            { label: 'Đen', value: '#1a1a1a' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Áo sơ mi nam công sở',
        description: 'Áo sơ mi tay dài form chuẩn, vải chống nhăn và cực mát.',
        price: 320000,
        originalPrice: null,
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=800&q=80',
            'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
            'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80'
        ],
        category: 'Thời trang',
        stock: 40,
        sold: 150,
        similarIds: [1, 2],
        colors: [
            { label: 'Trắng', value: '#ffffff' },
            { label: 'Xanh dương', value: '#3b82f6' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Quần kaki nam',
        description: 'Quần kaki ống đứng form dáng thanh lịch, phù hợp đi làm lẫn đi chơi.',
        price: 400000,
        originalPrice: 500000,
        images: [
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
            'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80'
        ],
        category: 'Thời trang',
        stock: 22,
        sold: 95,
        similarIds: [2, 8],
        colors: [
            { label: 'Be', value: '#d4b896' },
            { label: 'Đen', value: '#1a1a1a' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Váy hoa nhí nữ tính',
        description: 'Váy xòe họa tiết hoa nhí phong cách vintage, chất liệu voan mềm.',
        price: 280000,
        originalPrice: null,
        images: [
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80'
        ],
        category: 'Thời trang',
        stock: 18,
        sold: 140,
        similarIds: [],
        colors: [
            { label: 'Vàng', value: '#facc15' },
            { label: 'Xanh nhạt', value: '#93c5fd' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Giày lười slip-on',
        description: 'Giày lười bọc vải dệt êm chân, cực thoáng và nhẹ nhàng.',
        price: 450000,
        originalPrice: null,
        images: [
            'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&q=80',
            'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80'
        ],
        category: 'Giày dép',
        stock: 35,
        sold: 72,
        similarIds: [3],
        colors: [
            { label: 'Đen', value: '#1a1a1a' },
            { label: 'Trắng', value: '#ffffff' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Balo laptop chống nước',
        description: 'Balo nhiều ngăn tiện ích, có chống sốc cho laptop 15.6 inch.',
        price: 550000,
        originalPrice: 700000,
        images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
            'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80'
        ],
        category: 'Phụ kiện',
        stock: 10,
        sold: 58,
        similarIds: [5],
        colors: [
            { label: 'Xám đậm', value: '#374151' },
            { label: 'Đen', value: '#1a1a1a' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Áo hoodie nỉ basic',
        description: 'Áo hoodie vải nỉ lót bông dày dặn, thích hợp cho mùa đông.',
        price: 380000,
        originalPrice: 450000,
        images: [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
            'https://images.unsplash.com/photo-1578587018452-892bace94f12?w=800&q=80'
        ],
        category: 'Thời trang',
        stock: 55,
        sold: 300,
        similarIds: [1, 4],
        colors: [
            { label: 'Xám', value: '#9ca3af' },
            { label: 'Hồng', value: '#f472b6' },
            { label: 'Đen', value: '#1a1a1a' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Thắt lưng nam da bò thật',
        description: 'Thắt lưng nam làm từ 100% da bò nguyên miếng, mặt khóa tinh tế.',
        price: 300000,
        originalPrice: null,
        images: [
            'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
        ],
        category: 'Phụ kiện',
        stock: 20,
        sold: 80,
        similarIds: [7],
        colors: [
            { label: 'Đen', value: '#1a1a1a' },
            { label: 'Nâu đỏ', value: '#b91c1c' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Quần short thể thao',
        description: 'Quần short vải dù siêu nhẹ, mau khô dùng cho chạy bộ, gym.',
        price: 180000,
        originalPrice: 250000,
        images: [
            'https://images.unsplash.com/photo-1533659828870-95ee305cee3e?w=800&q=80',
            'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80'
        ],
        category: 'Thời trang',
        stock: 60,
        sold: 450,
        similarIds: [1, 13],
        colors: [
            { label: 'Đen', value: '#1a1a1a' },
            { label: 'Xanh dương', value: '#3b82f6' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Dép quai ngang',
        description: 'Dép đúc nguyên khối chống trơn trượt, cực bền.',
        price: 120000,
        originalPrice: 150000,
        images: [
            'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80',
            'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800&q=80'
        ],
        category: 'Giày dép',
        stock: 100,
        sold: 520,
        similarIds: [3, 11],
        colors: [
            { label: 'Đen', value: '#1a1a1a' },
            { label: 'Trắng', value: '#ffffff' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Áo len cardigan nữ',
        description: 'Áo khoác len mềm mại phong cách Hàn Quốc.',
        price: 320000,
        originalPrice: null,
        images: [
            'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&q=80',
            'https://images.unsplash.com/photo-1574291814206-363acdf2aa79?w=800&q=80'
        ],
        category: 'Thời trang',
        stock: 25,
        sold: 110,
        similarIds: [10],
        colors: [
            { label: 'Be', value: '#d4b896' },
            { label: 'Hồng pastel', value: '#fbcfe8' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Mũ lưỡi trai thêu chữ',
        description: 'Mũ phom cứng cáp, thêu chữ nổi bật. Phù hợp cả nam và nữ.',
        price: 99000,
        originalPrice: 150000,
        images: [
            'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
            'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=800&q=80'
        ],
        category: 'Phụ kiện',
        stock: 45,
        sold: 215,
        similarIds: [6],
        colors: [
            { label: 'Đen', value: '#1a1a1a' },
            { label: 'Trắng', value: '#ffffff' },
            { label: 'Đỏ', value: '#ef4444' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Quần jogger thun',
        description: 'Quần jogger thun thoáng khí, thoải mái tối đa cho các hoạt động ngoài trời.',
        price: 220000,
        originalPrice: 280000,
        images: [
            'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'
        ],
        category: 'Thời trang',
        stock: 30,
        sold: 175,
        similarIds: [15, 2],
        colors: [
            { label: 'Xám', value: '#9ca3af' },
            { label: 'Đen', value: '#1a1a1a' }
        ]
    },
    {
        shopId: SHOP_ID,
        title: 'Túi chéo mini thời trang',
        description: 'Túi đeo chéo nhỏ gọn đựng vừa điện thoại, ví tiền. Phù hợp đi dạo.',
        price: 150000,
        originalPrice: 200000,
        images: [
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'
        ],
        category: 'Phụ kiện',
        stock: 20,
        sold: 88,
        similarIds: [5],
        colors: [
            { label: 'Đen', value: '#1a1a1a' },
            { label: 'Vàng', value: '#facc15' }
        ]
    }
];

const seedIfEmpty = async () => {
    try {
        const count = await Product.count();

        if (count > 0) {
            console.log(`>>> Products đã tồn tại (${count}), bỏ qua seeding.`);
            return;
        }

        // Kiểm tra shop ID=1 có tồn tại không trước khi seed
        const Shop = require('../models/Shop');
        const User = require('../models/User');
        const bcrypt = require('bcrypt');

        let shop = await Shop.findByPk(SHOP_ID);
        if (!shop) {
            console.log(`>>> Shop ID=${SHOP_ID} chưa tồn tại. Đang tạo shop mặc định...`);
            // Tạo user cho shop
            const passwordHash = await bcrypt.hash('Admin@123', 10);
            const user = await User.create({
                name: 'Admin UTEShop',
                email: 'admin@uteshop.com',
                password: passwordHash,
                role: 'admin',
                isActive: true
            });

            // Tạo shop
            shop = await Shop.create({
                id: SHOP_ID,
                userId: user.id,
                name: 'UTEShop Official',
                slug: 'uteshop-official',
                description: 'Cửa hàng chính thức của UTEShop',
                status: 'active',
                isVerified: true
            });
            console.log(`>>> Tạo shop mặc định thành công!`);
        }

        await Product.bulkCreate(PRODUCT_DATA);
        console.log(`>>> Seed thành công ${PRODUCT_DATA.length} products`);
    } catch (err) {
        console.error('>>> Seed error:', err.message);
    }
};

module.exports = { seedIfEmpty };
