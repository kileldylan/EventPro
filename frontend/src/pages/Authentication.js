import { useState } from "react";
import { Box, Button, Paper } from "@mui/material";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        p: 2,
        bgcolor: "background.default"
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 500,
          overflow: "hidden"
        }}
      >
        <Box sx={{ display: "flex", width: "100%" }}>
          <Button
            fullWidth
            variant={isLogin ? "contained" : "text"}
            onClick={() => setIsLogin(true)}
            sx={{
              py: 2,
              borderRadius: 0,
              borderBottom: isLogin ? "2px solid" : "none",
              borderColor: "primary.main"
            }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant={!isLogin ? "contained" : "text"}
            onClick={() => setIsLogin(false)}
            sx={{
              py: 2,
              borderRadius: 0,
              borderBottom: !isLogin ? "2px solid" : "none",
              borderColor: "primary.main"
            }}
          >
            Signup
          </Button>
        </Box>

        <Box sx={{ p: 4 }}>
          {isLogin ? <Login /> : <Signup />}
        </Box>
      </Paper>
    </Box>
  );
};

export default Authentication;