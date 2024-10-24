import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { Pie, Line } from "react-chartjs-2";
import categoryStyles from "../assets/styles/categoryStyles";
import up from "../assets/icons-cat/increase.svg";
import down from "../assets/icons-cat/decrease.svg";
import { useNavigate } from "react-router-dom";
import arrowRight from "../assets/icons-cat/arrow.svg";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Filler,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from "chart.js";
import "./dashboard.css";
// Register the necessary chart elements
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler
);

function Dashboard() {
    const navigate = useNavigate();
    const [budgetData, setBudgetData] = useState(null);
    const [expenseByCategory, setExpenseByCategory] = useState([]);
    const [timeRange, setTimeRange] = useState("monthly"); //  to manage selected time range
    const [lineData, setLineData] = useState([]);
    const [error, setError] = useState("");
    const [recentTransactions, setRecentTransactions] = useState([]); //  recent transactions only
    const [timeRangeTransactions, setTimeRangeTransactions] = useState([]); //  time-range based transactions
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const fetchData = async (url, setState, errorMsg) => {
        try {
            const { data } = await axiosClient.get(url);
            setState(data);
        } catch {
            setError(errorMsg);
        }
    };

    // fetch the
    useEffect(() => {
        axiosClient
            .get(`/getSummary`)
            .then(({ data }) => {
                console.log(data);

                setBudgetData(data);
                setExpenseByCategory(data.expenseByCategory);
            })
            .catch(() => {
                setError("Error fetching budget data");
            });
    }, []);

    useEffect(() => {
        let url = `/getYearlyExpenses`;

        if (timeRange === "monthly") url = `/getMonthlyExpenses`;
        else if (timeRange === "weekly") url = `/getWeeklyExpenses`;

        axiosClient
            .get(url)
            .then(({ data }) => {
                console.log(data);
                setLineData(data); //  time-range data for the line chart
                setTimeRangeTransactions(data); //  time-range transactions
            })
            .catch(() => {
                setError("Error fetching time range data");
            });
    }, [timeRange]);

    // Fetch recent transactions
    // useEffect(() => {
    //     axiosClient
    //         .get(`/recentTransactions`)
    //         .then(({ data }) => {
    //             setRecentTransactions(data); // Set recent transactions
    //         })
    //         .catch(() => {
    //             setError("Error fetching transactions");
    //         });
    // }, []);

    useEffect(() => {
        fetchData(
            "/recentTransactions",
            setRecentTransactions,
            "Error fetching transactions"
        );
    }, []);

    const currentMonth = new Date().getMonth() + 1;

    const calculateYAxisSteps = (data) => {
        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);

        const roundedMin = Math.floor(minValue / 1000) * 1000;
        const roundedMax = Math.ceil(maxValue / 10000) * 10000;

        const midpoint =
            Math.round((roundedMin + roundedMax) / 2 / 10000) * 10000;

        const step1 = Math.max(1000, roundedMin);
        const step2 = midpoint;
        const step3 = roundedMax;

        return [step1, step2, step3];
    };
    const lineDataValues = lineData
        .filter((item) =>
            timeRange === "monthly" ? item.month <= currentMonth : true
        )
        .map((item) => item.total_spent);

    const [step1, step2, step3] = calculateYAxisSteps(lineDataValues);
    const lineChartData = {
        labels: lineData
            .filter((item) =>
                timeRange === "monthly" ? item.month <= currentMonth : true
            )
            .map((item) =>
                timeRange === "weekly"
                    ? `Week ${item.week}`
                    : timeRange === "monthly"
                    ? monthNames[item.month - 1]
                    : `Year ${item.year}`
            ),
        datasets: [
            {
                label: `Expenses (${
                    timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
                })`,
                data: lineDataValues,
                borderColor: "#4A90E2",
                backgroundColor: "rgba(74, 144, 226, 0.2)",
                fill: true,
                tension: 0.1,
            },
        ],
    };
    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    stepSize: (step2 - step1) / 2,
                    callback: function (value) {
                        return `₱${value}`;
                    },
                },
            },
        },
    };

    return (
        <div className="dashboard-wrapper">
            {budgetData ? (
                <>
                    {/* {error && <p className="error-message">{error}</p>} */}
                    <h3>👋 Welcome</h3>
                    <div className="summary-section">
                        <div className="summary-card">
                            <p className="summary-title">Total Budget</p>
                            <p className="summary-value">
                                ₱{budgetData.totalBudget}
                            </p>
                        </div>
                        <div className="summary-card">
                            <p className="summary-title">Total Expenses</p>
                            <p className="summary-value">
                                ₱{budgetData.totalExpenseCurrentMonth}
                            </p>
                        </div>
                        <div className="summary-card">
                            <p className="summary-title">Balance</p>
                            <p className="summary-value">
                                ₱{budgetData.balance}
                            </p>
                        </div>
                    </div>
                    <div className="dashboard-wrapper2">
                        <div className="recent-transactions-section">
                            <div className="dashboard-wrapper-p1">
                                <h3> Statistic</h3>

                                <div className="graph-placeholder">
                                    <Line
                                        data={lineChartData}
                                        options={lineChartOptions}
                                        className="canvasGraph"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="log">
                            <div className="widgetComponent">
                                <h3>Recent Activity</h3>
                                <button
                                    className="view-all-button"
                                    onClick={() => navigate("/budgetExpense")}
                                >
                                    View All
                                    <img
                                        src={arrowRight}
                                        alt="arrow"
                                        className="arrow-icon"
                                    />
                                </button>
                            </div>

                            <div className="small-db-box">
                                {recentTransactions.length > 0 ? (
                                    recentTransactions.map(
                                        (transaction, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="db-expense-item"
                                                >
                                                    <div className="expense-details">
                                                        <div className="expense-info">
                                                            <div className="leftmost">
                                                                <div className="expense-name">
                                                                    {transaction.expenseName ||
                                                                        transaction.category ||
                                                                        "Expense"}
                                                                </div>
                                                                <div className="expense-date">
                                                                    {
                                                                        transaction.date
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="expense-amount">
                                                                ₱
                                                                {
                                                                    transaction.amount
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )
                                ) : (
                                    <p>No recent transactions</p>
                                )}
                            </div>
                        </div>
                    </div>{" "}
                    <div className="dashboard-wrapper-p1">
                        <h3>{`${new Date().toLocaleString("default", {
                            month: "long",
                        })} Top Categories`}</h3>
                        {expenseByCategory.length > 0 ? (
                            <div className="small-gap-list">
                                {expenseByCategory.map((item, index) => {
                                    const category =
                                        item.type === "expense"
                                            ? categoryStyles[
                                                  item.category_id
                                              ] || {}
                                            : item.type === "budget"
                                            ? categoryStyles["budget"]
                                            : {};
                                    return (
                                        <div
                                            key={index}
                                            className="top5Cat"
                                            onClick={() => {
                                                navigate(
                                                    `/budgetExpense?type=expense&category=${item.category_name}`
                                                );
                                            }}
                                        >
                                            <div className="top5CatDetails">
                                                <div
                                                    className="recentIconWrapper"
                                                    style={{
                                                        backgroundColor:
                                                            category.color ||
                                                            "#ccc",
                                                    }}
                                                >
                                                    {category.icon && (
                                                        <img
                                                            src={category.icon}
                                                            alt={`${item.category} Icon`}
                                                            className="caticon"
                                                        />
                                                    )}
                                                </div>
                                                <div className="db-expense-info">
                                                    <div className="leftmost">
                                                        <div className="catname">
                                                            {item.category_name}
                                                        </div>
                                                        <div className="expense-amount">
                                                            ₱{item.total_spent}
                                                        </div>
                                                    </div>
                                                    <div className="percentChange">
                                                        {item.percent_change ===
                                                        0 ? (
                                                            <p>No changes</p>
                                                        ) : (
                                                            <>
                                                                <p>
                                                                    {
                                                                        item.percent_change
                                                                    }
                                                                    %
                                                                </p>
                                                                {item.changeType ===
                                                                "increase" ? (
                                                                    <img
                                                                        src={up}
                                                                        alt="Increase"
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={
                                                                            down
                                                                        }
                                                                        alt="Decrease"
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>No expenses to display</p>
                        )}
                    </div>
                </>
            ) : (
                <p className="loading-text">Loading...</p>
            )}
        </div>
    );
}

export default Dashboard;
