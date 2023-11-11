import { React, useState } from 'react';
import { useLogin } from "../hooks/useLogin";
import styles from '../styles/Authentication.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  const {login, isLoading } = useLogin(setError);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    await login(email, password);
  };

  return (
    <div className={styles['login-container']}>
      <h2>Login To Continue</h2>
      <div>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleLogin} disabled={isLoading}>Login</button>
      
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
