import "../modal.css";

function ViewModal({ isOpen, onClose, expense }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content-view"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>Expense Details</h2>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    <div className="detail-item">
                        <span className="detail-label">Expense Name:</span>
                        <span className="detail-value">
                            {expense?.expenseName || "N/A"}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Amount:</span>
                        <span className="detail-value">
                            {expense?.amount ? `$${expense.amount}` : "N/A"}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Category:</span>
                        <span className="detail-value">
                            {expense.category
                                ? expense.category.name
                                : "Uncategorized"}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">
                            {expense?.date
                                ? new Date(expense.date).toLocaleDateString()
                                : "N/A"}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Description:</span>
                        <span className="detail-value">
                            {expense?.description || "No description"}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Budget:</span>
                        <span className="detail-value">
                            {expense?.budgetId
                                ? `Budget ${expense.budgetId}`
                                : "No budget assigned"}
                        </span>
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        className="edit-button"
                        onClick={() => alert("Edit functionality here")}
                    >
                        Edit
                    </button>
                    <button
                        className="delete-button"
                        onClick={() => alert("Delete functionality here")}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewModal;
