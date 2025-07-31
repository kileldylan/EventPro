import { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Paper, 
  CircularProgress, Alert, Link, FormControlLabel, Switch
} from '@mui/material';
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { login, isLoading, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const user = await login(email, password, isAdminLogin ? 'Admin' : 'User');
    
    // Debugging - check what's actually being returned
    console.log('User data from login:', user);

    // Proper role checking
    if (user.role === 1 || user.Role_ID === 1 || user.roleName === 'Admin' || user.Role_Name === 'Admin') {
      navigate('/admin_dashboard');
    } else {
      navigate('/user_dashboard');
    }
  } catch (err) {
    console.error('Login error:', err);
  }
};

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      p: 2
    }}>
      <Paper elevation={4} sx={{ 
        p: 4, 
        width: '100%', 
        maxWidth: 500,
        borderRadius: 2
      }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
          {isAdminLogin ? 'Admin Login' : 'User Login'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <FormControlLabel
            control={
              <Switch 
                checked={isAdminLogin}
                onChange={() => setIsAdminLogin(!isAdminLogin)}
                color="primary"
              />
            }
            label="Admin Login"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            variant="outlined"
          />
          
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 3, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </Box>

        {!isAdminLogin && (
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Don't have an account?{' '}
            <Link component="button" onClick={() => navigate('/signup')}>
              Sign up here
            </Link>
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Login;