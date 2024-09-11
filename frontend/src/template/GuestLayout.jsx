import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

function GuestLayout() {
    const { token } = useStateContext();
    if (token) {
        return <Navigate to="/dashboard" />;
    }
    return (
        <div className="guestLayout">
            <Outlet />
        </div>
    );
}

export default GuestLayout;
