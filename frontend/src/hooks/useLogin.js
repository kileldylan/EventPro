import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(null)
  const [error, setError] = useState(null)
  const { dispatch } = useAuthContext()

const login = async (email, password, portalType) => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch('http://127.0.0.1:5000/api/user/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password, portalType })
    });
    
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error || 'Login failed');
    }

    // Debugging - log the response
    console.log('Login API response:', json);

    // Ensure consistent data structure
    const userData = {
      ...json.user,
      role: json.user.Role_ID || json.user.role,
      roleName: json.user.Role_Name || json.user.roleName
    };

    localStorage.setItem('user', JSON.stringify(userData));
    dispatch({ type: 'LOGIN', payload: userData });

    return userData;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setIsLoading(false);
  }
};

  return { login, isLoading, error }
}