import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Message, PageWrapper } from "../../components";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ── Address Form Component ──────────────────────────────────────────────────
const AddressForm = ({ initial, onSave, onCancel, loading }) => {
    const [form, setForm] = useState({
        street: initial?.street || "",
        isDefault: initial?.isDefault || false
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!form.street.trim()) errs.street = "Vui lòng nhập địa chỉ.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) onSave({ ...form, id: initial?.id });
    };

    return (
        <div className="border border-gray-200 bg-white rounded-xl p-4 space-y-3 shadow-sm">
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Địa chỉ *</label>
                    <input value={form.street} onChange={(e) => setForm(p => ({ ...p, street: e.target.value }))}
                        placeholder="VD: 123 Lê Lợi, Phường 1, Quận 1, TP.HCM"
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.street ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-gray-200 focus:border-[#00b14f] focus:ring-green-100"}`} />
                    {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm(p => ({ ...p, isDefault: e.target.checked }))}
                        className="w-4 h-4 accent-[#00b14f] rounded" />
                    <span className="text-sm text-gray-700">Đặt làm địa chỉ mặc định</span>
                </label>
            </div>
            <div className="flex gap-2 pt-1">
                <button onClick={handleSubmit} disabled={loading}
                    className="px-4 py-2 bg-[#00b14f] text-white rounded-lg text-sm font-semibold hover:bg-[#009943] transition-colors disabled:opacity-60">
                    {loading ? "Đang lưu..." : "Lưu địa chỉ"}
                </button>
                <button onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">Hủy</button>
            </div>
        </div>
    );
};

// ── Main Profile Component ─────────────────────────────────────────────────
const Profile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [user, setUser] = useState(null);

    // Split name into first and last name for the form
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
    const [securityForm, setSecurityForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [msgType, setMsgType] = useState("info");
    const [errors, setErrors] = useState({});

    // Address state
    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addrLoading, setAddrLoading] = useState(false);
    const [addrMsg, setAddrMsg] = useState(null);
    const [addrMsgType, setAddrMsgType] = useState("info");

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) { navigate("/login"); return; }
        try {
            const parsed = JSON.parse(stored);
            if (parsed.isActive === false) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }
            setUser(parsed);

            // Split name
            const nameParts = (parsed.name || "").trim().split(" ");
            let fName = "";
            let lName = "";
            if (nameParts.length > 1) {
                lName = nameParts.pop();
                fName = nameParts.join(" ");
            } else {
                fName = nameParts[0] || "";
            }

            setForm({ firstName: fName, lastName: lName, email: parsed.email || "", phone: parsed.phone || "" });
            setAddresses(parsed.addresses || []);
            if (parsed.avatar) {
                setAvatarPreview(parsed.avatar.startsWith("http") ? parsed.avatar : `${API_URL}${parsed.avatar}`);
            }
        } catch {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        return () => { if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview); };
    }, [avatarPreview]);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { setMsg("File phải là ảnh."); setMsgType("error"); return; }
        if (file.size > 2 * 1024 * 1024) { setMsg("Ảnh không được vượt quá 2MB."); setMsgType("error"); return; }
        if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleRemoveAvatar = () => {
        setAvatar(null);
        setAvatarPreview(null);
    };

    const validate = () => {
        const errs = {};
        if (!form.firstName.trim()) errs.firstName = "Bắt buộc";
        if (!form.lastName.trim()) errs.lastName = "Bắt buộc";
        if (form.phone.trim() && !/^[0-9+\-\s]{8,15}$/.test(form.phone.trim())) errs.phone = "Không hợp lệ";
        return errs;
    };

    const handleSave = async () => {
        if (loading) return;
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({}); setLoading(true); setMsg(null);
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) { navigate("/login"); return; }

            const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

            const payload = new FormData();
            payload.append("name", fullName);
            payload.append("phone", form.phone.trim());
            if (avatar) payload.append("avatar", avatar);

            const res = await fetch(`${API_URL}/api/users/profile`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: payload
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Cập nhật thất bại");

            const updated = data.user;
            const merged = { ...user, ...updated };
            localStorage.setItem("user", JSON.stringify(merged));
            setUser(merged);

            const nameParts = (merged.name || "").trim().split(" ");
            let fName = "", lName = "";
            if (nameParts.length > 1) { lName = nameParts.pop(); fName = nameParts.join(" "); } else { fName = nameParts[0] || ""; }
            setForm({ firstName: fName, lastName: lName, email: merged.email || "", phone: merged.phone || "" });

            if (merged.avatar) setAvatarPreview(merged.avatar.startsWith("http") ? merged.avatar : `${API_URL}${merged.avatar}`);
            setAvatar(null);
            setMsg("Cập nhật hồ sơ thành công!"); setMsgType("success");

            setTimeout(() => setMsg(null), 3000);
        } catch (err) {
            setMsg(err.message || "Cập nhật thất bại"); setMsgType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        const nameParts = (user.name || "").trim().split(" ");
        let fName = "", lName = "";
        if (nameParts.length > 1) { lName = nameParts.pop(); fName = nameParts.join(" "); } else { fName = nameParts[0] || ""; }

        setForm({ firstName: fName, lastName: lName, email: user.email || "", phone: user.phone || "" });
        setAvatar(null); setErrors({}); setMsg(null);
        if (user.avatar) setAvatarPreview(user.avatar.startsWith("http") ? user.avatar : `${API_URL}${user.avatar}`);
        else setAvatarPreview(null);
    };

    // ── Address handlers ────────────────────────────────────────────────────
    const refreshAddresses = (newAddresses) => {
        setAddresses(newAddresses);
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                const u = JSON.parse(stored);
                u.addresses = newAddresses;
                localStorage.setItem("user", JSON.stringify(u));
                setUser(u);
            } catch { }
        }
    };

    const handleSaveAddress = async (addrData) => {
        const token = localStorage.getItem("accessToken");
        setAddrLoading(true); setAddrMsg(null);
        try {
            const res = await fetch(`${API_URL}/api/users/addresses`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(addrData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Lỗi lưu địa chỉ.");
            refreshAddresses(data);
            setShowAddressForm(false); setEditingAddress(null);
            setAddrMsg("Địa chỉ đã được lưu."); setAddrMsgType("success");
            setTimeout(() => setAddrMsg(null), 3000);
        } catch (err) {
            setAddrMsg(err.message); setAddrMsgType("error");
        } finally {
            setAddrLoading(false);
        }
    };

    const handleRemoveAddress = async (addrId) => {
        if (!window.confirm("Xóa địa chỉ này?")) return;
        const token = localStorage.getItem("accessToken");
        setAddrLoading(true); setAddrMsg(null);
        try {
            const res = await fetch(`${API_URL}/api/users/addresses/${addrId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Lỗi xóa địa chỉ.");
            refreshAddresses(data);
            setAddrMsg("Đã xóa địa chỉ."); setAddrMsgType("success");
            setTimeout(() => setAddrMsg(null), 3000);
        } catch (err) {
            setAddrMsg(err.message); setAddrMsgType("error");
        } finally {
            setAddrLoading(false);
        }
    };

    const handleSetDefault = async (addrId) => {
        const token = localStorage.getItem("accessToken");
        setAddrLoading(true); setAddrMsg(null);
        try {
            const res = await fetch(`${API_URL}/api/users/addresses/${addrId}/default`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Lỗi cập nhật địa chỉ mặc định.");
            refreshAddresses(data);
            setAddrMsg("Đã đặt địa chỉ mặc định."); setAddrMsgType("success");
            setTimeout(() => setAddrMsg(null), 3000);
        } catch (err) {
            setAddrMsg(err.message); setAddrMsgType("error");
        } finally {
            setAddrLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f4f6fa] flex flex-col font-sans">
            <Header />
            <main className="flex-1 py-10">
                <div className="max-w-5xl w-full mx-auto px-4">

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
                        <p className="text-gray-500">Manage your personal information, security, and addresses.</p>
                    </div>

                    {msg && (
                        <div className={`mb-6 p-4 rounded-lg font-medium text-sm flex items-center justify-between ${msgType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                            {msg}
                            <button onClick={() => setMsg(null)} className="opacity-50 hover:opacity-100">✕</button>
                        </div>
                    )}

                    {/* Avatar Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div
                                    className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center"
                                    style={{ background: avatarPreview ? "transparent" : "#e5e7eb" }}
                                >
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-600 rounded-full border-2 border-white flex items-center justify-center text-white cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-[#008f3f] text-white text-sm font-semibold rounded-lg hover:bg-[#007a36] transition-colors">
                                Upload New Photo
                            </button>
                            <button onClick={handleRemoveAvatar} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                                Remove
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Left Column */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Personal Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-[#f0f4f8] px-6 py-4 flex items-center gap-2 border-b border-gray-100">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    <h3 className="font-semibold text-gray-800">Personal Information</h3>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1.5">First Name</label>
                                            <input type="text" value={form.firstName} onChange={(e) => setForm(p => ({ ...p, firstName: e.target.value }))}
                                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:border-[#008f3f] ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Last Name</label>
                                            <input type="text" value={form.lastName} onChange={(e) => setForm(p => ({ ...p, lastName: e.target.value }))}
                                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:border-[#008f3f] ${errors.lastName ? 'border-red-500' : 'border-gray-200'}`} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
                                        <input type="email" value={form.email} disabled
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone Number</label>
                                        <input type="text" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:border-[#008f3f] ${errors.phone ? 'border-red-500' : 'border-gray-200'}`} />
                                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Addresses Management */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-[#f0f4f8] px-6 py-4 flex items-center justify-between border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <h3 className="font-semibold text-gray-800">Addresses</h3>
                                    </div>
                                    {!showAddressForm && (
                                        <button onClick={() => { setShowAddressForm(true); setEditingAddress(null); }} className="text-xs font-semibold text-[#008f3f] hover:underline">
                                            + Add New
                                        </button>
                                    )}
                                </div>
                                <div className="p-6">
                                    {addrMsg && (
                                        <div className={`mb-4 px-3 py-2 rounded text-xs font-medium ${addrMsgType === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                                            {addrMsg}
                                        </div>
                                    )}

                                    {showAddressForm && editingAddress === null && (
                                        <div className="mb-6">
                                            <AddressForm initial={null} onSave={handleSaveAddress} onCancel={() => setShowAddressForm(false)} loading={addrLoading} />
                                        </div>
                                    )}

                                    {addresses.length === 0 && !showAddressForm ? (
                                        <p className="text-sm text-gray-500 text-center py-4">No addresses saved.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {addresses.map((addr) => (
                                                <div key={addr.id}>
                                                    {editingAddress === addr.id ? (
                                                        <AddressForm initial={addr} onSave={handleSaveAddress} onCancel={() => setEditingAddress(null)} loading={addrLoading} />
                                                    ) : (
                                                        <div className={`p-4 rounded-xl border ${addr.isDefault ? "border-[#008f3f] bg-green-50/20" : "border-gray-200"}`}>
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    {addr.isDefault && <span className="text-[10px] uppercase font-bold text-[#008f3f] mb-1 block tracking-wider">Default</span>}
                                                                    <p className="text-sm text-gray-800 font-medium">{addr.street}</p>
                                                                    {(addr.ward || addr.district || addr.city) && (
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {[addr.ward, addr.district, addr.city].filter(Boolean).join(", ")}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="flex gap-2 ml-4">
                                                                    <button onClick={() => setEditingAddress(addr.id)} className="text-gray-400 hover:text-blue-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                                                    {!addr.isDefault && <button onClick={() => handleRemoveAddress(addr.id)} className="text-gray-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
                                                                </div>
                                                            </div>
                                                            {!addr.isDefault && (
                                                                <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-[#008f3f] mt-3 font-semibold hover:underline">Set as default</button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Security */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-[#f0f4f8] px-6 py-4 flex items-center gap-2 border-b border-gray-100">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    <h3 className="font-semibold text-gray-800">Security</h3>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-wider">CHANGE PASSWORD</p>
                                        <div className="space-y-3">
                                            <input type="password" placeholder="Current Password" value={securityForm.currentPassword} onChange={e => setSecurityForm(p => ({ ...p, currentPassword: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:border-[#008f3f]" />
                                            <input type="password" placeholder="New Password" value={securityForm.newPassword} onChange={e => setSecurityForm(p => ({ ...p, newPassword: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:border-[#008f3f]" />
                                            <input type="password" placeholder="Confirm New Password" value={securityForm.confirmPassword} onChange={e => setSecurityForm(p => ({ ...p, confirmPassword: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:border-[#008f3f]" />
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">Two-Factor Auth</p>
                                            <p className="text-[10px] font-bold text-[#008f3f] uppercase mt-0.5 tracking-wider">Currently Active</p>
                                        </div>
                                        <div className="w-10 h-5 bg-[#008f3f] rounded-full relative cursor-pointer">
                                            <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-8 flex justify-end gap-4 items-center">
                        <button onClick={handleCancel} className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                        <button onClick={handleSave} disabled={loading} className="px-6 py-2.5 bg-[#008f3f] text-white text-sm font-bold rounded-lg shadow-sm hover:bg-[#007a36] transition-colors disabled:opacity-70">
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>




                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;