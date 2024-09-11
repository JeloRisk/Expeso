import axios from "axios";
// import { useStateContext } from "./context/ContextProvider.jsx";

const axiosClient = axios.create({
    baseURL: `http://localhost:8000/api`,
});

// export const getItems = () => axiosClient.get("/items");
// export const createItem = (item) => axiosClient.post("/items", item);
// export const getItem = (id) => axiosClient.get(`/items/${id}`);
// export const editItem = (id, item) => axiosClient.put(`/items/${id}`, item);
// export const deleteItem = (id) => axiosClient.delete(`/items/${id}`);

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        if (response.status === 401) {
            localStorage.removeItem("ACCESS_TOKEN");
            // window.location.reload();
        } else if (response.status === 404) {
            //Show not found
        }

        throw error;
    }
);

export default axiosClient;
// export const getItems = () => axios.get(`${API_URL}/items`);
// // // export const createItem = (item) => axios.post(`${API_URL}/items`, item);
// export const createItem = (item) => axios.post(`${API_URL}/items`, item);
// export const getItem = (id) => axios.get(`${API_URL}/items/${id}`);
// export const updateItem = (id, item) =>
//     axios.put(`${API_URL}/items/${id}`, item);
// export const deleteItem = (id) => axios.delete(`${API_URL}/items/${id}`);

// export const getItems = () => axiosClient.get("/items");
// export const createItem = (item) => axiosClient.post("/items", item);
// export const getItem = (id) => axiosClient.get(`/items/${id}`);
// export const updateItem = (id, item) => axiosClient.put(`/items/${id}`, item);
// export const deleteItem = (id) => axiosClient.delete(`/items/${id}`);
