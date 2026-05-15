import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const rawUser = localStorage.getItem("user");
    let user = null;
    try {
        user = JSON.parse(rawUser || "null");
    } catch (e) {
        user = null;
    }
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-xl font-extrabold text-primary">UTEShop</Link>
                    <Link to="/" className="text-sm text-gray-600 hover:text-primary">Trang chủ</Link>
                    <Link to="/products" className="text-sm text-gray-600 hover:text-primary">Sản phẩm</Link>
                </div>

                <div className="flex items-center gap-3">
                    {token && user ? (
                        <>
                            <Link to="/profile" className="text-sm text-gray-700 hover:text-primary">{user.name || 'Tài khoản'}</Link>
                            <button onClick={handleLogout} className="text-sm px-3 py-1 bg-primary text-white rounded-md">Đăng xuất</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm text-gray-700 hover:text-primary">Đăng nhập</Link>
                            <Link to="/register" className="text-sm px-3 py-1 bg-primary text-white rounded-md">Đăng ký</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;