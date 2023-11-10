import { React, useState } from "react";
import styles from "../styles/Authentication.module.css";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles["authentication-container"]}>
      <div className={styles["buttons-container"]}>
        <p onClick={() => setIsLogin(true)}>Login</p>
        <p onClick={() => setIsLogin(false)}>Signup</p>
      </div>

      <div>
        {isLogin ? <Login /> : <Signup />}
      </div>
    </div>
  );
};

export default Authentication;
