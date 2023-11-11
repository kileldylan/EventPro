import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = (setError) => {
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('http://127.0.0.1:4000/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      setError("Login Successful!")
      localStorage.setItem('user', JSON.stringify(json));
      
      dispatch({type: 'LOGIN', payload: json})

      setIsLoading(false)
    }
  }

  return { login, isLoading }
}

