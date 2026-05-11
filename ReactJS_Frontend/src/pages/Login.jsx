import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Lỗi đăng nhập');

            // Save token to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            setMessage('Đăng nhập thành công! Chuyển hướng...');
            setTimeout(() => navigate('/'), 1200);
        } catch (err) {
            setMessage(err.message || 'Lỗi đăng nhập');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Chào mừng trở lại!</h2>
                <p className="text-center text-gray-500 mb-8 font-medium">Đăng nhập vào UTEShop</p>

                <form onSubmit={handleSubmit}>
                    <InputField label="Email" name="email" type="email" placeholder="example@hcmute.edu.vn" value={formData.email} onChange={handleChange} />
                    <InputField label="Mật khẩu" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />

                    <div className="flex justify-end mb-4">
                        <Link to="/forgot-password" className="text-sm text-primary opacity-80 hover:underline">Quên mật khẩu?</Link>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-200 hover:opacity-90 transition-all">
                        {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                    </button>

                    {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-600">
                        Chưa có tài khoản? <Link to="/register" className="text-primary font-semibold hover:underline">Đăng ký tại đây</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;