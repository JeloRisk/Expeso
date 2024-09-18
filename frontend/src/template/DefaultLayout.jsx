import { useState, useEffect, useRef } from "react";
import { Outlet, Link, Navigate, useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client";
import dashboard from "../assets/icons/dashboard.svg";
import wallet from "../assets/icons/wallet.svg";
import add from "../assets/icons/add.svg";
import AddToggleModal from "../views/modal/AddToggleModal";
import AddExpenseModal from "../views/modal/AddExpenseModal";
import AddBudgetModal from "../views/modal/AddBudgetModal"; // Import the AddBudgetModal

function DefaultLayout() {
    const location = useLocation();
    const modalRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [sidebarVisible, setSidebarVisible] = useState(!isMobile);
    const { user, token, setUser, setToken } = useStateContext();
    const [isModalOpenSmall, setIsModalOpenSmall] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [modalOption, setModalOption] = useState(null); // To handle which modal to show

    const [addModal, setAddModal] = useState(false);

    const toggleModal = (option) => {
        setModalOption(option);
        setIsModalOpenSmall(!isModalOpenSmall);
    };

    const toggleModalAdd = (option) => {
        setModalOption(option);
        setAddModal(!addModal);
    };

    const toggleSidebar = () => {
        if (isMobile) {
            setSidebarVisible(!sidebarVisible);
        }
    };

    const onLogout = (ev) => {
        ev.preventDefault();
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
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setAddModal(false);
            }
        };

        if (addModal) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [addModal]);

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
                    <div onClick={() => toggleModalAdd()} className="addButon2">
                        <img src={add} alt="Add Icon" className="icon" />
                        Add
                    </div>
                    {addModal && (
                        <AddToggleModal
                            isOpen={addModal}
                            onClose={(option) => {
                                setAddModal(false);
                                if (option === "expense") {
                                    console.log("hello");
                                    setIsExpenseModalOpen(true);
                                } else if (option === "budget") {
                                    setIsBudgetModalOpen(true);
                                }
                            }}
                        />
                    )}
                    {isExpenseModalOpen && (
                        <AddExpenseModal
                            isOpen={isExpenseModalOpen}
                            onClose={() => setIsExpenseModalOpen(false)}
                        />
                    )}
                    {isBudgetModalOpen && (
                        <AddBudgetModal
                            isOpen={isBudgetModalOpen}
                            onClose={() => setIsBudgetModalOpen(false)}
                        />
                    )}
                    {/* {modalOption === "budget" && (
                        <AddBudgetModal
                            isOpen={modalOption === "budget"}
                            onClose={() => setIsExpenseModalOpen(false)}
                        />
                    )} */}
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
                            to="/budgetExpense"
                            className={`nav-link ${
                                location.pathname === "/budgetExpense"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={toggleSidebar}
                        >
                            Budget and Expense
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
