import axios from "axios";

const api = axios.create({
    baseURL: "https://front-br-challenges.web.app/api/v2/green-thumb"
});

export const getPlants = async (sun, water, pets) => await api.get(
    "",
    {
        params: {
            sun,
            water,
            pets
        }
    }
);

export default api;