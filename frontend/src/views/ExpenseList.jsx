import "./list.css";

function ExpenseList({ data, viewItem }) {
    return (
        <div className="expense-list">
            {data.map((item, index) => (
                <div
                    key={index}
                    className="expense-item"
                    onClick={() => viewItem(item)}
                >
                    <div className="expense-header">
                        <div className="expense-name">
                            {item.expenseName || item.category}
                        </div>
                        <div className="expense-amount">₱{item.amount}</div>
                    </div>
                    <div className="expense-date">{item.date}</div>
                </div>
            ))}
        </div>
    );
}

export default ExpenseList;
