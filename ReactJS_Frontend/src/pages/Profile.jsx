import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, InputField, Message, Card, PageWrapper } from "../components";

const Profile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ name: "", email: "" });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [msgType, setMsgType] = useState("info");
    const [errors, setErrors] = useState({});

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            navigate("/login");
            return;
        }
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setForm({ name: parsed.name, email: parsed.email });
        if (parsed.avatar) setAvatarPreview(parsed.avatar);
    }, [navigate]);

    const getInitials = (name = "") =>
        name
            .split(" ")
            .map((w) => w[0])
            .slice(-2)
            .join("")
            .toUpperCase();

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setMsg("Ảnh không được vượt quá 2MB.");
            setMsgType("error");
            return;
        }

        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Tên không được để trống.";
        return errs;
    };

    const handleSave = async () => {
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        setErrors({});
        setLoading(true);
        setMsg(null);

        try {
            const token = localStorage.getItem("token");
            const payload = new FormData();
            payload.append("name", form.name);
            if (avatar) payload.append("avatar", avatar);

            const res = await fetch(`${API_URL}/api/user/profile`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: payload,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Cập nhật thất bại");

            const updated = {
                ...user,
                name: data.user?.name || form.name,
                avatar: data.user?.avatar || avatarPreview,
            };

            localStorage.setItem("user", JSON.stringify(updated));
            setUser(updated);
            setEditing(false);
            setAvatar(null);
            setMsg("Cập nhật hồ sơ thành công!");
            setMsgType("success");
        } catch (err) {
            setMsg(err.message || "Cập nhật thất bại");
            setMsgType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setForm({ name: user.name, email: user.email });
        setAvatarPreview(user.avatar || null);
        setAvatar(null);
        setErrors({});
        setMsg(null);
        setEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) return null;

    return (
        <PageWrapper>
            <Card className="max-w-lg">
                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        <div
                            onClick={() => editing && fileInputRef.current?.click()}
                            className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-white shadow-lg ${editing ? "cursor-pointer" : ""
                                }`}
                            style={{
                                background: avatarPreview ? "transparent" : "linear-gradient(135deg, #3b82f6, #6366f1)",
                            }}
                        >
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white">{getInitials(user.name)}</span>
                            )}
                        </div>

                        {editing && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-white hover:opacity-90 transition-opacity"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </button>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    {editing && <p className="text-xs text-gray-400 mt-2">Nhấn vào ảnh để thay đổi (tối đa 2MB)</p>}

                    {!editing && (
                        <>
                            <h2 className="text-2xl font-extrabold text-gray-900 mt-4">{user.name}</h2>
                            <p className="text-gray-500 text-sm">{user.email}</p>
                        </>
                    )}
                </div>

                <div className="space-y-1">
                    {editing ? (
                        <>
                            <InputField
                                label="Họ và tên"
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                error={errors.name}
                                placeholder="Nhập tên của bạn"
                            />
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm select-none">
                                    {user.email}
                                    <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                                        Không thể đổi
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button loading={loading} onClick={handleSave}>
                                    Lưu thay đổi
                                </Button>
                                <Button variant="secondary" onClick={handleCancel}>
                                    Hủy
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <InfoRow icon="user" label="Họ và tên" value={user.name} />
                            <InfoRow icon="mail" label="Email" value={user.email} />
                            <InfoRow
                                icon="calendar"
                                label="Thành viên từ"
                                value={user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "UTEShop"}
                            />

                            <div className="pt-6 flex gap-3">
                                <Button onClick={() => { setEditing(true); setMsg(null); }}>
                                    Chỉnh sửa hồ sơ
                                </Button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                                >
                                    Thoát
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <Message text={msg} type={msgType} />
            </Card>
        </PageWrapper>
    );
};

const InfoRow = ({ label, value, icon }) => {
    const icons = {
        user: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
        ),
        mail: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
        ),
        calendar: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        ),
    };

    return (
        <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icons[icon]}
                </svg>
            </div>
            <div>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export default Profile;