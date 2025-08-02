import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);
  const { dispatch } = useContext(AuthContext); // Use useContext here

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

      const userData = {
        ...json.user,
        role: json.user.Role_ID || json.user.role,
        roleName: json.user.Role_Name || json.user.roleName
      };

      // Store both user and token
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', json.token);

      // Dispatch with both user and token
      dispatch({ 
        type: 'LOGIN', 
        payload: {
          user: userData,
          token: json.token
        }
      });

      return { user: userData, token: json.token };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};