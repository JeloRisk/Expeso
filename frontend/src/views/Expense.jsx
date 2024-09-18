import { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import ExpenseList from "./ExpenseList";
import AddExpenseModal from "./modal/AddExpenseModal";
import ViewModal from "./modal/ViewModal";
// AddExpenseModal
// ExpenseList
// impor axiosClient

export default function Expense() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [viewInfo, setViewInfo] = useState([]);

    const handleDelete = (e) => {
        console.log(e);
        axiosClient
            .delete(`/expenses/${e.expenseId}`)
            .then(() => {
                handleClose();
                alert("Delete");
                fetchExpense();
            })
            .catch((e) => {
                console.error("Error deleting item:", e);
            });
    };
    const fetchExpense = () => {
        setLoading(true);
        axiosClient
            .get(`/expenses`)
            .then(({ data }) => {
                setLoading(false);
                setExpenses(data);
                calculateTotal(data);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };
    const [total, setTotal] = useState(0);
    const calculateTotal = (expensesData) => {
        const newTotal = expensesData.reduce(
            (sum, expense) => sum + parseFloat(expense.amount),
            0
        );
        setTotal(newTotal);
    };
    useEffect(() => {
        fetchExpense();
        // calculateTotal();
    }, []);
    const handleAddExpense = (newExpense) => {
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
        setTotal((prevTotal) => prevTotal + parseFloat(newExpense.amount));
    };

    const handleView = (item) => {
        setViewModal(true);

        setViewInfo(item);
        console.log(item);
    };
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleClose = () => {
        setViewModal(false);
        setViewInfo([]);
    };

    return (
        <div className="expense-container">
            <h2>Total Expense: ₱{total}</h2>{" "}
            {/* <button onClick={openModal} className="addButon">
                Add Expense
            </button>{" "} */}
            {isModalOpen && (
                <AddExpenseModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        closeModal();
                        fetchExpense();
                    }}
                    onAdd={handleAddExpense}
                />
            )}
            {expenses.length != 0 ? (
                // create newe component
                <ExpenseList
                    data={expenses}
                    viewItem={handleView}
                ></ExpenseList>
            ) : (
                <div>No Data Available</div>
            )}
            {viewModal && console.log("ehll")}
            {viewModal && (
                <ViewModal
                    isOpen={viewModal}
                    onClose={handleClose}
                    expense={viewInfo}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
