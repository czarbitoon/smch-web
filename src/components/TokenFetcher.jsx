import { useEffect } from 'react';
import axios from '../axiosInstance'; // Import the custom Axios instance

const TokenFetcher = () => {
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('/sanctum/csrf-cookie');
                console.log('CSRF Token fetched:', response);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        fetchToken();
    }, []);

    return null; // Return null to avoid rendering anything
};

export default TokenFetcher;
