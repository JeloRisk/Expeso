import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axiosClient from '../axios-client';

// Chart.js registration
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ExpenseChart = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExpenseData();
    }, []);

    const fetchExpenseData = async () => {
        try {
            const response = await axiosClient.get('/expenses-by-day');
            const data = response.data;

            const dates = data.map(item => item.date);
            const totals = data.map(item => item.total);

            setChartData({
                labels: dates,
                datasets: [
                    {
                        label: 'Total Spending Per Day',
                        data: totals,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 2,
                        fill: true,
                    },
                ],
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading chart...</div>;

    return (
        <div>
            <h2>Total Spending Per Day</h2>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Spending Over Time',
                        },
                    },
                }}
            />
        </div>
    );
};

export default ExpenseChart;
