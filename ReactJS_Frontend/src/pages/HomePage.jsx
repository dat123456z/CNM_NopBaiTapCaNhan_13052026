import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";

const products = [
    {
        id: 1,
        title: "Tai nghe không dây A1",
        desc: "Âm thanh rõ nét, pin 30 giờ.",
        price: 890000,
        originalPrice: 1190000,
        category: "Âm thanh",
        sold: 124,
        image: "https://images.unsplash.com/photo-1518444025391-0b9a7b7b1b2d?w=800&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&s=1",
        tag: "promo",
    },
    {
        id: 2,
        title: "Điện thoại X10 Pro",
        desc: "Màn hình 6.7\", camera 64MP, RAM 8GB.",
        price: 7490000,
        category: "Điện thoại",
        sold: 320,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&s=2",
        tag: "new",
    },
    {
        id: 3,
        title: "Laptop Slim 14",
        desc: "Mỏng nhẹ, xử lý tốt cho văn phòng.",
        price: 15990000,
        category: "Laptop",
        sold: 58,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&s=3",
        tag: "bestseller",
    },
    {
        id: 4,
        title: "Balo du lịch CityPack",
        desc: "Chống nước, nhiều ngăn tiện dụng.",
        price: 450000,
        originalPrice: 650000,
        category: "Phụ kiện",
        sold: 210,
        image: "https://images.unsplash.com/photo-1519741494093-3f3a8b59f3d8?w=800&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&s=4",
        tag: "promo",
    },
    {
        id: 5,
        title: "Đồng hồ thể thao S2",
        desc: "Theo dõi sức khỏe, GPS tích hợp.",
        price: 1290000,
        category: "Đồng hồ",
        sold: 402,
        image: "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=800&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&s=5",
        tag: "bestseller",
    },
    {
        id: 6,
        title: "Máy pha cà phê HomeBar",
        desc: "Cà phê chất lượng quán tại nhà.",
        price: 2490000,
        category: "Gia dụng",
        sold: 33,
        image: "https://images.unsplash.com/photo-1509406116813-3f5f1a4c6df5?w=800&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&s=6",
        tag: "new",
    },
    {
        id: 7,
        title: "Gậy chụp ảnh Selfie XL",
        desc: "Gọn nhẹ, kéo dài 1.2m.",
        price: 199000,
        category: "Phụ kiện",
        sold: 87,
        image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=800&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&s=7",
        tag: "new",
    },
    {
        id: 8,
        title: "Áo khoác mùa đông Cozy",
        desc: "Ấm áp, chất liệu cao cấp.",
        price: 650000,
        originalPrice: 850000,
        category: "Thời trang",
        sold: 146,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&s=8",
        tag: "bestseller",
    },
];

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            const token = localStorage.getItem("token");
            // Allow access when token + user exist. If `role` is present it must be "user".
            if (!user || !token) {
                navigate("/login");
                return;
            }
            if (user.role && user.role !== "user") {
                navigate("/login");
            }
        } catch (err) {
            navigate("/login");
        }
    }, [navigate]);

    const promos = products.filter((p) => p.tag === "promo");
    const newest = products.filter((p) => p.tag === "new");
    const bestsellers = products.filter((p) => p.tag === "bestseller");

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Header title="UTEShop" subtitle="Sàn thương mại điện tử - Ưu đãi và sản phẩm mới mỗi ngày">
                <div className="mt-6 max-w-3xl">
                    <div className="bg-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold">Khuyến mãi tuần này</h2>
                        <p className="mt-1 text-sm opacity-90">Giảm giá tới 30% cho các sản phẩm chọn lọc — số lượng có hạn.</p>
                    </div>
                </div>
            </Header>

            <main className="container mx-auto px-4 mt-8">
                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Khuyến mãi</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {promos.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>

                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Mới nhất</h3>
                        <Link to="/" className="text-primary text-sm">Xem tất cả</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {newest.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Bán chạy</h3>
                        <Link to="/" className="text-primary text-sm">Xem tất cả</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bestsellers.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;
