import { createBrowserRouter, Navigate } from "react-router-dom";
// import App from "./App";
import Login from "./views/Login";
import _404 from "./views/_404";
import DefaultLayout from "./template/DefaultLayout";
import Signup from "./views/Signup";
import Budget from "./views/Budget";
import Expense from "./views/Expense";
import Dashboard from "./views/Dashboard";
import Report from "./views/Report";
import GuestLayout from "./template/GuestLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,

        // use Outlet inside of defaultlayout to get specific route.
        children: [
            {
                path: "/",
                element: <Navigate to="/dashboard" />,
            },
            { path: "/expense", element: <Expense /> },
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/budget", element: <Budget /> },
            { path: "/report", element: <Report /> },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            { path: "/login", element: <Login></Login> },
            { path: "/signup", element: <Signup></Signup> },
        ],
    },
    {
        path: "*",
        element: <_404 />,
    },
]);

export default router;
