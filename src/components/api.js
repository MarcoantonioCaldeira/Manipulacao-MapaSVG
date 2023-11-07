import axios from 'axios'

const api = axios.create({
    baseURL: "http://192.168.0.78:9200"
})

api.interceptors.request.use(
    (config) => {
        const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUaUdlc3RvciIsInN1YiI6IlRpR2VzdG9yIiwiZXhwIjoxNjk5NDQ2NzQzLCJpZF91c3VhcmlvIjoxMjh9.h0CwOcV9VtFwe_ZFCcaTCqZkYIrbvaXcexn5bB7IwP8`;

        config.headers.Authorization = `Bearer ${token}`;
        return config;
    }
);

export default api;