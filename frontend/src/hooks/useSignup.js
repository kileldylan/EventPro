import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = (setError) => {
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (name, username, email, password, contactInfo) => {
    setIsLoading(true)
    setError(null)

    const emailCheckResponse = await fetch(
      `http://localhost:4000/api/user/checkEmail?email=${email}`
    );
    const emailCheckData = await emailCheckResponse.json();

    if (!emailCheckData.unique) {
      setError("Email address is already in use.");
      return;
    }

    // Check if username is unique
    const usernameCheckResponse = await fetch(
      `http://localhost:4000/api/user/checkUsername?username=${username}`
    );
    const usernameCheckData = await usernameCheckResponse.json();

    if (!usernameCheckData.unique) {
      setError("Username is not available.");
      return;
    }

    const response = await fetch('http://127.0.0.1:4000/api/user/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, username, email, password, contactInfo })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(json))

      dispatch({type: 'LOGIN', payload: json})

      setIsLoading(false)
    }
  }

  return { signup, isLoading }
}

