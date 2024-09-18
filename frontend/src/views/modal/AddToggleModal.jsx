import AddMoney from "../../assets/icons-cat/add-money.svg";
import RemoveMoney from "../../assets/icons-cat/remove-money.svg";

function AddToggleModal({ isOpen, onClose }) {
    return isOpen ? (
        <div className="toggle-modal-overlay">
            <div className="toggle-modal-content">
                <ul className="modal-list">
                    <li
                        className="modal-item"
                        onClick={() => onClose("budget")}
                    >
                        <img
                            src={AddMoney}
                            alt="Add Budget"
                            className="money-icon"
                        />
                        Add Budget
                    </li>
                    <li
                        className="modal-item"
                        onClick={() => onClose("expense")}
                    >
                        <img
                            src={RemoveMoney}
                            alt="Add Expense"
                            className="money-icon"
                        />
                        Add Expense
                    </li>
                </ul>
            </div>
        </div>
    ) : null;
}

export default AddToggleModal;
