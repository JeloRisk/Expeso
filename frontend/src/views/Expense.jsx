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

    const fetchExpense = () => {
        setLoading(true);
        axiosClient
            .get(`/expenses`)
            .then(({ data }) => {
                setLoading(false);
                setExpenses(data);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };
    useEffect(() => {
        fetchExpense();
    }, []);
    const [viewModal, setViewModal] = useState(false);
    const [viewInfo, setViewInfo] = useState([]);

    const handleView = (item) => {
        setViewModal(true);

        setViewInfo(item);
        console.log(item);
    };
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleClose = () => setViewModal(false);

    return (
        <div className="expense-container">
            {" "}
            <button onClick={openModal} className="addButon">
                Add Expense
            </button>{" "}
            {isModalOpen && (
                <AddExpenseModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        closeModal();
                        fetchExpense();
                    }}
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
                />
            )}
        </div>
    );
}
