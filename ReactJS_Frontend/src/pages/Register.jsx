import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState("init"); // init -> otp
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendOtp = async () => {
        setLoading(true);
        setMessage(null);
        // simple client-side validation: password match
        if (!formData.password || !formData.confirmPassword) {
            setMessage('Vui lòng nhập mật khẩu và xác nhận mật khẩu.');
            setLoading(false);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setMessage('Mật khẩu và xác nhận mật khẩu không khớp.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Lỗi');
            setStep("otp");
            setMessage(data.message || 'OTP đã gửi.');
        } catch (err) {
            setMessage(err.message || 'Lỗi gửi OTP');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch(`${API_URL}/api/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Lỗi xác thực');
            // registration complete — redirect to login or home
            setMessage('Đăng ký thành công! Chuyển hướng...');
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            setMessage(err.message || 'Lỗi xác thực OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
                    Tạo tài khoản <span className="text-primary">UTEShop</span>
                </h2>

                <div>
                    <InputField label="Họ và tên" name="name" type="text" placeholder="Nguyễn Văn A" value={formData.name} onChange={handleChange} />
                    <InputField label="Email" name="email" type="email" placeholder="example@hcmute.edu.vn" value={formData.email} onChange={handleChange} />
                    <InputField label="Mật khẩu" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                    <InputField label="Xác nhận mật khẩu" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />

                    {step === 'init' ? (
                        <button type="button" onClick={sendOtp} disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity mt-4">
                            {loading ? 'Đang gửi...' : 'Gửi OTP'}
                        </button>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã OTP</label>
                                <input
                                    type="text"
                                    name="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Nhập mã OTP"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button type="button" onClick={verifyOtp} disabled={loading} className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity mt-0">
                                    {loading ? 'Đang xác thực...' : 'Xác nhận OTP'}
                                </button>
                                <button type="button" onClick={sendOtp} disabled={loading} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity mt-0">
                                    Gửi lại
                                </button>
                            </div>
                        </>
                    )}

                    {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
                </div>

                <p className="mt-6 text-center text-gray-600">
                    Đã có tài khoản? <Link to="/login" className="text-primary font-semibold hover:underline">Đăng nhập ngay</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;