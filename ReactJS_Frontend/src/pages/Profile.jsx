import {
    useState,
    useRef,
    useEffect
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    Button,
    InputField,
    Message,
    Card,
    PageWrapper
} from "../components";

import Header from "../components/Header";

const Profile = () => {
    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:3000";

    const [user, setUser] =
        useState(null);

    const [form, setForm] =
        useState({
            name: "",
            email: "",
            phone: ""
        });

    const [avatar, setAvatar] =
        useState(null);

    const [avatarPreview,
        setAvatarPreview] =
        useState(null);

    const [editing,
        setEditing] =
        useState(false);

    const [loading,
        setLoading] =
        useState(false);

    const [msg, setMsg] =
        useState(null);

    const [msgType,
        setMsgType] =
        useState("info");

    const [errors,
        setErrors] =
        useState({});

    useEffect(() => {
        const stored =
            localStorage.getItem(
                "user"
            );

        if (!stored) {
            navigate("/login");
            return;
        }

        try {
            const parsed =
                JSON.parse(stored);

            if (
                parsed.isActive === false
            ) {
                localStorage.removeItem(
                    "accessToken"
                );

                localStorage.removeItem(
                    "user"
                );

                navigate("/login");

                return;
            }

            setUser(parsed);

            setForm({
                name:
                    parsed.name || "",
                email:
                    parsed.email || "",
                phone:
                    parsed.phone || ""
            });

            if (parsed.avatar) {
                const avatarUrl =
                    parsed.avatar.startsWith(
                        "http"
                    )
                        ? parsed.avatar
                        : `${API_URL}${parsed.avatar}`;

                setAvatarPreview(
                    avatarUrl
                );
            }
        } catch {
            localStorage.removeItem(
                "accessToken"
            );

            localStorage.removeItem(
                "user"
            );

            navigate("/login");
        }
    }, [navigate, API_URL]);

    useEffect(() => {
        return () => {
            if (
                avatarPreview?.startsWith(
                    "blob:"
                )
            ) {
                URL.revokeObjectURL(
                    avatarPreview
                );
            }
        };
    }, [avatarPreview]);

    const getInitials = (
        name = ""
    ) =>
        name
            .split(" ")
            .map((w) => w[0])
            .slice(-2)
            .join("")
            .toUpperCase();

    const handleAvatarChange = (
        e
    ) => {
        const file =
            e.target.files?.[0];

        if (!file) return;

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {
            setMsg(
                "File phải là ảnh."
            );

            setMsgType("error");

            return;
        }

        if (
            file.size >
            2 * 1024 * 1024
        ) {
            setMsg(
                "Ảnh không được vượt quá 2MB."
            );

            setMsgType("error");

            return;
        }

        if (
            avatarPreview?.startsWith(
                "blob:"
            )
        ) {
            URL.revokeObjectURL(
                avatarPreview
            );
        }

        setAvatar(file);

        setAvatarPreview(
            URL.createObjectURL(file)
        );
    };

    const validate = () => {
        const errs = {};

        const name =
            form.name.trim();

        const phone =
            form.phone.trim();

        if (!name) {
            errs.name =
                "Tên không được để trống.";
        } else if (
            name.length < 2
        ) {
            errs.name =
                "Tên tối thiểu 2 ký tự.";
        }

        if (
            phone &&
            !/^[0-9+\-\s]{8,15}$/.test(
                phone
            )
        ) {
            errs.phone =
                "Số điện thoại không hợp lệ.";
        }

        return errs;
    };

    const handleSave =
        async () => {
            if (loading) return;

            const errs =
                validate();

            if (
                Object.keys(errs)
                    .length
            ) {
                setErrors(errs);
                return;
            }

            setErrors({});
            setLoading(true);
            setMsg(null);

            try {
                const token =
                    localStorage.getItem(
                        "accessToken"
                    );

                if (!token) {
                    navigate(
                        "/login"
                    );

                    return;
                }

                const payload =
                    new FormData();

                payload.append(
                    "name",
                    form.name.trim()
                );

                payload.append(
                    "phone",
                    form.phone.trim()
                );

                if (avatar) {
                    payload.append(
                        "avatar",
                        avatar
                    );
                }

                const res =
                    await fetch(
                        `${API_URL}/api/user/profile`,
                        {
                            method:
                                "PUT",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: payload
                        }
                    );

                const data =
                    await res
                        .json()
                        .catch(
                            () => ({})
                        );

                if (!res.ok) {
                    throw new Error(
                        data.message ||
                            "Cập nhật thất bại"
                    );
                }

                const updated =
                    data.user;

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        updated
                    )
                );

                setUser(updated);

                setForm({
                    name:
                        updated.name ||
                        "",
                    email:
                        updated.email ||
                        "",
                    phone:
                        updated.phone ||
                        ""
                });

                if (
                    updated.avatar
                ) {
                    setAvatarPreview(
                        updated.avatar.startsWith(
                            "http"
                        )
                            ? updated.avatar
                            : `${API_URL}${updated.avatar}`
                    );
                }

                setAvatar(null);

                setEditing(false);

                setMsg(
                    "Cập nhật hồ sơ thành công!"
                );

                setMsgType(
                    "success"
                );
            } catch (err) {
                setMsg(
                    err.message ||
                        "Cập nhật thất bại"
                );

                setMsgType(
                    "error"
                );
            } finally {
                setLoading(false);
            }
        };

    const handleCancel = () => {
        setForm({
            name:
                user.name || "",
            email:
                user.email || "",
            phone:
                user.phone || ""
        });

        setAvatar(null);

        setErrors({});

        setMsg(null);

        setEditing(false);

        if (user.avatar) {
            setAvatarPreview(
                user.avatar.startsWith(
                    "http"
                )
                    ? user.avatar
                    : `${API_URL}${user.avatar}`
            );
        } else {
            setAvatarPreview(
                null
            );
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/login");
    };

    if (!user) return null;

    return (
        <div>
            <Header
                title="Trang cá nhân"
                subtitle={`Chào ${user.name || "người dùng"}`}
                small
            />

            <PageWrapper>
                <Card className="max-w-lg">
                    <div className="text-center mb-8">
                        <div className="relative inline-block">
                            <div
                                onClick={() =>
                                    editing &&
                                    fileInputRef.current?.click()
                                }
                                className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-white shadow-lg ${
                                    editing
                                        ? "cursor-pointer"
                                        : ""
                                }`}
                                style={{
                                    background:
                                        avatarPreview
                                            ? "transparent"
                                            : "linear-gradient(135deg, #3b82f6, #6366f1)"
                                }}
                            >
                                {avatarPreview ? (
                                    <img
                                        src={
                                            avatarPreview
                                        }
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white">
                                        {getInitials(
                                            user.name
                                        )}
                                    </span>
                                )}
                            </div>

                            <input
                                ref={
                                    fileInputRef
                                }
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={
                                    handleAvatarChange
                                }
                            />
                        </div>

                        {!editing && (
                            <>
                                <h2 className="text-2xl font-extrabold text-gray-900 mt-4">
                                    {
                                        user.name
                                    }
                                </h2>

                                <p className="text-gray-500 text-sm">
                                    {
                                        user.email
                                    }
                                </p>
                            </>
                        )}
                    </div>

                    {editing ? (
                        <>
                            <InputField
                                label="Họ và tên"
                                type="text"
                                value={
                                    form.name
                                }
                                onChange={(
                                    e
                                ) =>
                                    setForm(
                                        (
                                            prev
                                        ) => ({
                                            ...prev,
                                            name:
                                                e
                                                    .target
                                                    .value
                                        })
                                    )
                                }
                                error={
                                    errors.name
                                }
                            />

                            <InputField
                                label="Số điện thoại"
                                type="text"
                                value={
                                    form.phone
                                }
                                onChange={(
                                    e
                                ) =>
                                    setForm(
                                        (
                                            prev
                                        ) => ({
                                            ...prev,
                                            phone:
                                                e
                                                    .target
                                                    .value
                                        })
                                    )
                                }
                                error={
                                    errors.phone
                                }
                            />

                            <div className="flex gap-3 mt-6">
                                <Button
                                    loading={
                                        loading
                                    }
                                    disabled={
                                        loading
                                    }
                                    onClick={
                                        handleSave
                                    }
                                >
                                    Lưu thay đổi
                                </Button>

                                <Button
                                    variant="secondary"
                                    onClick={
                                        handleCancel
                                    }
                                >
                                    Hủy
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <InfoRow
                                label="Họ và tên"
                                value={
                                    user.name
                                }
                            />

                            <InfoRow
                                label="Email"
                                value={
                                    user.email
                                }
                            />

                            <InfoRow
                                label="Số điện thoại"
                                value={
                                    user.phone ||
                                    "Chưa cập nhật"
                                }
                            />

                            <div className="pt-6 flex gap-3">
                                <Button
                                    onClick={() => {
                                        setEditing(
                                            true
                                        );

                                        setMsg(
                                            null
                                        );
                                    }}
                                >
                                    Chỉnh sửa hồ sơ
                                </Button>

                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                                >
                                    Thoát
                                </button>
                            </div>
                        </>
                    )}

                    <Message
                        text={msg}
                        type={msgType}
                    />
                </Card>
            </PageWrapper>
        </div>
    );
};

const InfoRow = ({
    label,
    value
}) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <span className="text-sm text-gray-500">
            {label}
        </span>

        <span className="text-sm font-semibold text-gray-800">
            {value}
        </span>
    </div>
);

export default Profile;