import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; //  these
import axiosClient from "../axios-client";
import ExpenseList from "./ExpenseList";
import AddExpenseModal from "./modal/AddExpenseModal";
import ViewModal from "./modal/ViewModal";

export default function Expense() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [viewInfo, setViewInfo] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState([]); //  category dropdown
    const [selectedCategory, setSelectedCategory] = useState("all"); // all filter
    const [selectedType, setSelectedType] = useState("all"); // Type filter

    const location = useLocation();
    const navigate = useNavigate();

    const fetchExpenses = async (
        page = 1,
        type = "expense",
        categoryId = "all"
    ) => {
        setLoading(true);
        try {
            const categoryQuery =
                categoryId !== "all" ? `&category_id=${categoryId}` : "";
            const { data } = await axiosClient.get(
                `/transactions?page=${page}&per_page=5&type=${type}${categoryQuery}`
            );
            setExpenses(data.transactions.data);
            setTotalPages(data.transactions.last_page);
            setCurrentPage(data.transactions.current_page);
            setTotal(data.balance);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axiosClient.get("/categories");
            setCategories(data);
        } catch (err) {
            console.error("Error fetching categories", err);
        }
    };

    const updateUrl = (type, category) => {
        const searchParams = new URLSearchParams();
        if (type) searchParams.set("type", type);
        if (category && category !== "all")
            searchParams.set("category", category);
        // navigate(`?${searchParams.toString()}`);
    };

    const parseQueryParams = () => {
        const queryParams = new URLSearchParams(location.search);
        const type = queryParams.get("type") || "expense";
        const category = queryParams.get("category") || "all";
        setSelectedType(type);
        setSelectedCategory(category);
    };

    useEffect(() => {
        fetchCategories();
        parseQueryParams();
    }, []);

    useEffect(() => {
        fetchExpenses(currentPage, selectedType, selectedCategory);
        updateUrl(selectedType, selectedCategory);
    }, [currentPage, selectedType, selectedCategory]);

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setCurrentPage(1);
    };

    const handleAddExpense = (newExpense) => {
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
        setTotal((prevTotal) => prevTotal + parseFloat(newExpense.amount));
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleView = (item) => {
        setViewModal(true);
        setViewInfo(item);
    };

    // Pagination
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="expense-container">
            <>
                <div className="type-category-selector">
                    <select
                        id="type-select"
                        value={selectedType}
                        onChange={handleTypeChange}
                        className="styled-select"
                    >
                        <option value="expense">Expenses</option>
                        <option value="budget">Budgets</option>
                        <option value="all">All</option>
                    </select>

                    {selectedType === "expense" ? (
                        <select
                            id="category-select"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="styled-select"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="no-categories">
                            No categories to show for this type
                        </p>
                    )}
                </div>

                {isModalOpen && (
                    <AddExpenseModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            closeModal();
                            fetchExpenses(
                                currentPage,
                                selectedType,
                                selectedCategory
                            );
                        }}
                        onAdd={handleAddExpense}
                    />
                )}
                {loading ? (
                    <div>Loading all data...</div>
                ) : expenses.length ? (
                    <ExpenseList data={expenses} viewItem={handleView} />
                ) : (
                    <div>No Data Available</div>
                )}

                {viewModal && (
                    <ViewModal
                        isOpen={viewModal}
                        onClose={() => setViewModal(false)}
                        expense={viewInfo}
                    />
                )}

                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={goToPreviousPage}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={goToNextPage}
                    >
                        Next
                    </button>
                </div>
            </>
        </div>
    );
}
