import { useState, useEffect, useRef } from "react";
import { Outlet, Link } from "react-router-dom";
// import "./DefaultLayout.css";
import { Navigate, useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client";
import dashboard from "../assets/icons/dashboard.svg";
import wallet from "../assets/icons/wallet.svg";
import add from "../assets/icons/add.svg";

import AddExpenseModal from "../views/modal/AddExpenseModal";
function DefaultLayout() {
    const location = useLocation();
    const modalRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [sidebarVisible, setSidebarVisible] = useState(!isMobile);
    const { user, token, setUser, setToken } = useStateContext();
    const [isModalOpenSmall, setIsModalOpenSmall] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const toggleModal = () => {
        setIsModalOpenSmall(!isModalOpenSmall);
    };

    const toggleSidebar = () => {
        if (isMobile) {
            setSidebarVisible(!sidebarVisible);
        }
    };
    const onLogout = (ev) => {
        ev.preventDefault();

        console.log("oaky");

        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
        });
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsModalOpenSmall(false);
            }
        };

        if (isModalOpenSmall) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpenSmall]);
    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => {
            setUser(data);
        });
    }, [setUser]);

    useEffect(() => {
        const handleResize = () => {
            const mobileView = window.innerWidth <= 768;
            setIsMobile(mobileView);
            setSidebarVisible(!mobileView); // Sidebar hidden on mobile, visible on desktop
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!token) {
        return <Navigate to="/login"></Navigate>;
    }

    return (
        <div className="layout-container">
            <header className="topbar">
                {isMobile && (
                    <button
                        className="hamburger-toggle"
                        onClick={toggleSidebar}
                    >
                        {sidebarVisible ? "✕" : "☰"}
                    </button>
                )}
                <div className="right-tb">
                    <div className="logo">Expeso</div>
                </div>

                <div className="user-info">
                    <div onClick={openModal} className="addButon2">
                        <img src={add} alt="Add Icon" className="icon" />
                        Add Expense
                    </div>{" "}
                    {isModalOpen && (
                        <AddExpenseModal
                            isOpen={isModalOpen}
                            onClose={() => {
                                closeModal();
                            }}
                        />
                    )}
                    <div className="profile-container" onClick={toggleModal}>
                        <div className="profile-picture"></div>
                    </div>
                    {isModalOpenSmall && (
                        <div className="logout-modal" ref={modalRef}>
                            <span className="user-name">{user?.name}</span>
                            <a
                                onClick={onLogout}
                                className="btn-logout"
                                href="#"
                            >
                                Logout
                            </a>
                        </div>
                    )}
                </div>
            </header>

            {sidebarVisible && (
                <aside className="sidebar visible">
                    <Link to="/" className="logo-link" onClick={toggleSidebar}>
                        <b>Expeso</b>
                    </Link>
                    <nav className="nav-links">
                        <Link
                            to="/dashboard"
                            className={`nav-link ${
                                location.pathname === "/dashboard"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={toggleSidebar}
                        >
                            <img src={dashboard} alt="Dashboard Icon" />
                            Dashboard
                        </Link>

                        <Link
                            to="/expense"
                            className={`nav-link ${
                                location.pathname === "/expense" ? "active" : ""
                            }`}
                            onClick={toggleSidebar}
                        >
                            {" "}
                            <img src={wallet} alt="Wallet Icon" />
                            Expense & Budget
                        </Link>

                        <Link
                            to="/budget"
                            className={`nav-link ${
                                location.pathname === "/budget" ? "active" : ""
                            }`}
                            onClick={toggleSidebar}
                        >
                            Budget
                        </Link>

                        <Link
                            to="/report"
                            className={`nav-link ${
                                location.pathname === "/report" ? "active" : ""
                            }`}
                            onClick={toggleSidebar}
                        >
                            Report
                        </Link>
                    </nav>
                </aside>
            )}

            <main className="layout-content">
                <Outlet />
            </main>
        </div>
    );
}

export default DefaultLayout;
