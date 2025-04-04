import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getLoans = async () => {
  try {
    const response = await api.get('/loans');
    return response.data;
  } catch (error) {
    console.error('Error fetching loans:', error);
    throw error;
  }
};

export const createLoan = async (loanData) => {
  try {
    const response = await api.post('/loans', loanData);
    return response.data;
  } catch (error) {
    console.error('Error creating loan:', error);
    throw error;
  }
};

export const updateLoanStatus = async (loanId, status) => {
  try {
    const response = await api.put(`/loans/${loanId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating loan status:', error);
    throw error;
  }
};

export default api; 