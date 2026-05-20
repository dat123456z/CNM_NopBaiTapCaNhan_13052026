import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const syncAuth = () => {
            const t = localStorage.getItem("accessToken");
            const u = localStorage.getItem("user");

            setToken(t);
            try {
                setUser(u ? JSON.parse(u) : null);
            } catch {
                setUser(null);
            }
        };

        syncAuth();

        window.addEventListener("storage", syncAuth);

        return () => window.removeEventListener("storage", syncAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);

        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">

                <div className="flex items-center gap-4">
                    <Link to="/" className="text-xl font-extrabold text-primary">
                        UTEShop
                    </Link>

                    <Link to="/" className="text-sm text-gray-600 hover:text-primary">
                        Trang chủ
                    </Link>

                    <Link to="/products" className="text-sm text-gray-600 hover:text-primary">
                        Sản phẩm
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {token && user ? (
                        <>
                            <Link
                                to="/profile"
                                className="text-sm text-gray-700 hover:text-primary"
                            >
                                {user.name || "Tài khoản"}
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="text-sm px-3 py-1 bg-primary text-white rounded-md"
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm text-gray-700 hover:text-primary"
                            >
                                Đăng nhập
                            </Link>

                            <Link
                                to="/register"
                                className="text-sm px-3 py-1 bg-primary text-white rounded-md"
                            >
                                Đăng ký
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;