import { React, useState } from "react";
import { useSignup } from "../hooks/useSignup";
import styles from "../styles/Authentication.module.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const [error, setError] = useState("");

  const {signup, isLoading } = useSignup(setError);

  const handleSignup =  async (e) => {
    e.preventDefault()

    if (!name || !email || !username || !password || !contactInfo) {
      setError("All fields are required.");
      return;
    }

    await signup(name, username, email, password, contactInfo)
  };

  return (
    <div className={styles["signup-container"]}>
      <h2>Signup To Continue</h2>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="off"
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
          />
        </label>

        <label>
          Contact Info (Mobile Number):
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            required
            autoComplete="off"
          />
        </label>
      </div>
      <button onClick={handleSignup}isabled={isLoading}>Signup</button>

      {error && <p>{error}</p>}
    </div>
  );
};

export default Signup;