const Product = require('../models/Product');

const PRODUCT_DATA = [
    {
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
        similarIds: [2, 4]
    },
    {
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
        similarIds: [1, 4]
    },
    {
        title: 'Giày sneaker trắng classic',
        description: 'Giày thể thao thời trang đế cao su êm ái, trọng lượng nhẹ. Thiết kế hiện đại dễ phối với mọi trang phục từ casual đến năng động.',
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
        similarIds: [7, 8]
    },
    {
        title: 'Áo khoác bomber thu đông',
        description: 'Áo khoác bomber ấm áp với lớp lót bông mỏng, chất liệu ngoài chống gió nhẹ. Phù hợp thời tiết se lạnh, kiểu dáng thể thao trẻ trung.',
        price: 750000,
        originalPrice: null,
        images: [
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
            'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=80'
        ],
        category: 'Thời trang',
        stock: 12,
        sold: 67,
        similarIds: [1, 2]
    },
    {
        title: 'Túi xách da tổng hợp cao cấp',
        description: 'Túi xách da tổng hợp chất lượng cao, bền theo thời gian. Thiết kế thanh lịch với nhiều ngăn tiện dụng, phù hợp nữ công sở hoặc đi chơi.',
        price: 1200000,
        originalPrice: 1500000,
        images: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'
        ],
        category: 'Phụ kiện',
        stock: 5,
        sold: 43,
        similarIds: [6, 9]
    },
    {
        title: 'Mũ snapback thêu logo',
        description: 'Mũ snapback phong cách streetwear với logo thêu nổi bật. Chất liệu vải bền, khóa snap sau dễ điều chỉnh, vừa nhiều size đầu.',
        price: 250000,
        originalPrice: null,
        images: [
            'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
            'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80'
        ],
        category: 'Phụ kiện',
        stock: 18,
        sold: 156,
        similarIds: [1, 5]
    },
    {
        title: 'Sandal dây da nữ',
        description: 'Sandal quai dây mảnh thanh lịch, đế cao 3cm êm chân. Chất da tổng hợp mềm mại, phù hợp đi làm, đi chơi, và các buổi tiệc nhẹ.',
        price: 280000,
        originalPrice: 380000,
        images: [
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
            'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80'
        ],
        category: 'Giày dép',
        stock: 20,
        sold: 98,
        similarIds: [3, 8]
    },
    {
        title: 'Giày boot cổ thấp da lộn',
        description: 'Giày boot da lộn nam phong cách vintage, đế cao su chống trơn trượt. Thiết kế cổ thấp năng động dễ phối cùng quần jean hoặc chino.',
        price: 890000,
        originalPrice: 1100000,
        images: [
            'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80',
            'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80'
        ],
        category: 'Giày dép',
        stock: 7,
        sold: 55,
        similarIds: [3, 7]
    },
    {
        title: 'Ví da nam gấp đôi',
        description: 'Ví da thật dạng gấp đôi với nhiều khe đựng thẻ và ngăn tiền. Thiết kế mỏng gọn, dễ bỏ túi, bền bỉ qua thời gian sử dụng.',
        price: 450000,
        originalPrice: null,
        images: [
            'https://images.unsplash.com/photo-1627123424574-724758594913?w=800&q=80',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
        ],
        category: 'Phụ kiện',
        stock: 30,
        sold: 210,
        similarIds: [5, 10]
    },
    {
        title: 'Đồng hồ dây da classic',
        description: 'Đồng hồ mặt tròn dây da nâu sang trọng, máy quartz Nhật chạy chính xác. Kính sapphire chống xước, chống nước 3ATM, phù hợp đi làm và dự tiệc.',
        price: 1800000,
        originalPrice: 2200000,
        images: [
            'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
            'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
            'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&q=80'
        ],
        category: 'Phụ kiện',
        stock: 10,
        sold: 78,
        similarIds: [5, 9]
    },
    {
        title: 'Áo sơ mi Oxford dài tay',
        description: 'Áo sơ mi vải Oxford 100% cotton, form regular thoải mái. Màu trắng tinh tế dễ phối, phù hợp đi làm công sở hoặc các sự kiện lịch sự.',
        price: 420000,
        originalPrice: 520000,
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
            'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=800&q=80'
        ],
        category: 'Thời trang',
        stock: 15,
        sold: 142,
        similarIds: [1, 4]
    },
    {
        title: 'Quần short kaki nam',
        description: 'Quần short kaki nam chất liệu cotton pha polyester thoáng mát. Có túi hộp hai bên tiện dụng, phù hợp mặc hè hay đi biển dạo phố.',
        price: 220000,
        originalPrice: null,
        images: [
            'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800&q=80',
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80'
        ],
        category: 'Thời trang',
        stock: 35,
        sold: 187,
        similarIds: [2, 1]
    }
];

const seedIfEmpty = async () => {
    const count = await Product.count();
    if (count > 0) {
        console.log(`>>> Products đã tồn tại (${count} sản phẩm), bỏ qua seed.`);
        return;
    }

    await Product.bulkCreate(PRODUCT_DATA);
    console.log(`>>> Đã seed ${PRODUCT_DATA.length} sản phẩm vào database.`);
};

module.exports = { seedIfEmpty };