import "./list.css";
import categoryStyles from "../assets/styles/categoryStyles";

function ExpenseList({ data, viewItem }) {
    return (
        <div className="expense-list">
            {data.map((item, index) => {
                const category =
                    item.type === "expense"
                        ? categoryStyles[item.category_id] || {}
                        : item.type === "budget"
                        ? categoryStyles["budget"]
                        : {};
                return (
                    <div
                        key={index}
                        className="expense-item"
                        style={{ borderLeftColor: category.color || "#ccc" }}
                        onClick={() => viewItem(item)}
                    >
                        <div className="expense-details">
                            <div
                                className="expense-icon-wrapper"
                                style={{
                                    backgroundColor: category.color || "#ccc",
                                }}
                            >
                                {category.icon && (
                                    <img
                                        src={category.icon}
                                        alt={`${item.category} Icon`}
                                        className="expense-icon"
                                    />
                                )}
                            </div>
                            <div className="expense-info">
                                <div className="leftmost">
                                    <div className="expense-name">
                                        {item.expenseName ||
                                            item.category ||
                                            item.type}
                                    </div>
                                    <div className="expense-date">
                                        {item.date}
                                    </div>
                                </div>
                                <div className="expense-amount">
                                    ₱{item.amount}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ExpenseList;
