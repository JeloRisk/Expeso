import { useState, useEffect } from "react";
import "../modal.css";
import axiosClient from "../../axios-client";

function AddExpenseModal({ isOpen, onClose }) {
    const [expenseName, setExpenseName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [budgetId, setBudgetId] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [category_id, setSelectedCategory] = useState("");

    const fetchCategory = () => {
        axiosClient
            .get("/categories")
            .then((response) => {
                setExpenseCategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    };
    useEffect(() => {
        fetchCategory();
    }, []);
    const handleSubmit = (event) => {
        event.preventDefault();

        // Get the selected category name
        const selectedCategory = expenseCategories.find(
            (cat) => cat.category_id === parseInt(category_id)
        );

        // If expenseName is empty, set it to the selected category name
        const finalExpenseName =
            expenseName || selectedCategory?.name || "Uncategorized";

        axiosClient
            .post("/expenses", {
                expenseName: finalExpenseName, // Use the modified name
                amount: parseFloat(amount),
                category_id,
                date,
                description,
                budgetId: budgetId || null,
            })
            .then((response) => {
                setShowSuccessModal(true);

                // Clear form inputs
                setExpenseName("");
                setAmount("");
                setCategory("");
                setDate("");
                setDescription("");
                setBudgetId(null);
                setSelectedCategory("");

                setTimeout(() => {
                    closeSuccessModal();
                }, 5000);
            })
            .catch((error) => {
                console.error("Error adding expense:", error);
            });
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        onClose();
    };

    if (!isOpen) return null;
    const handleChange = (event) => {
        setSelectedCategory(event.target.value);
    };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Add Expense</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="expenseName">
                            Expense Name (optional)
                        </label>
                        <input
                            type="text"
                            id="expenseName"
                            value={expenseName}
                            onChange={(e) => setExpenseName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category-select">
                            Select Category:
                        </label>{" "}
                        <select
                            id="category-select"
                            value={category_id}
                            onChange={handleChange}
                        >
                            <option value="">Select a category</option>
                            {expenseCategories.map((category, index) => (
                                <option
                                    key={category.category_id || index}
                                    value={category.category_id}
                                >
                                    {category.category_id} - {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    {/* <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <input
                            type="text"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    </div> */}
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">
                            Description (optional)
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="budgetId">Budget (optional)</label>
                        <input
                            type="number"
                            id="budgetId"
                            value={budgetId || ""}
                            onChange={(e) => setBudgetId(e.target.value)}
                        />
                    </div>
                    <button type="submit">Add Expense</button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                </form>

                {showSuccessModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <p>Expense added successfully!</p>
                            <button onClick={closeSuccessModal}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddExpenseModal;
