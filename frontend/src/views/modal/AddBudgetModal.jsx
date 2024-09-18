import { useState } from "react";
import "../modal.css";
import axiosClient from "../../axios-client";

function AddBudgetModal({ isOpen, onClose }) {
    const [amount, setAmount] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate inputs
        if (!amount || !month || !year) {
            alert("Please fill in all required fields.");
            return;
        }

        axiosClient
            .post("/budget", {
                amount: parseFloat(amount),
                month: parseInt(month),
                year: parseInt(year),
            })
            .then((response) => {
                setShowSuccessModal(true);

                // Clear form inputs
                setAmount("");
                setMonth("");
                setYear("");

                setTimeout(() => {
                    closeSuccessModal();
                }, 5000);
            })
            .catch((error) => {
                console.error("Error adding budget:", error);
            });
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Add Budget</h2>
                <form onSubmit={handleSubmit}>
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
                    <div className="form-group">
                        <label htmlFor="month">Month</label>
                        <select
                            id="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            required
                        >
                            <option value="">Select Month</option>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="year">Year</label>
                        <input
                            type="number"
                            id="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Add Budget</button>
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
                            <p>Budget added successfully!</p>
                            <button onClick={closeSuccessModal}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddBudgetModal;
