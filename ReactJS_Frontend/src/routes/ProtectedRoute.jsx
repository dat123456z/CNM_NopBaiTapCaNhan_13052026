import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("accessToken");

    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;