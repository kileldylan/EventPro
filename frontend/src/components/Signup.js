import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl
} from '@mui/material';
import { useSignup } from '../hooks/useSignup';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    contactInfo: '',
    role: '2' // Default to 'User' role
  });
  const [error, setError] = useState('');
  const { signup, isLoading } = useSignup();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.username || 
        !formData.password || !formData.contactInfo) {
      setError("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await signup(
        formData.name,
        formData.email,
        formData.username,
        formData.password,
        formData.role,
        formData.contactInfo
      );
      navigate(formData.role === '1' ? '/admin_dashboard' : '/user_dashboard');
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
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
          Create Your Account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ minLength: 4 }}
          />
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ minLength: 6 }}
          />
          
          <TextField
            fullWidth
            label="Contact Info (Phone)"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            margin="normal"
            required
          />

          <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
            <FormLabel component="legend">Account Type</FormLabel>
            <RadioGroup
              row
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <FormControlLabel 
                value="2" 
                control={<Radio />} 
                label="Regular User" 
              />
              <FormControlLabel 
                value="1" 
                control={<Radio />} 
                label="Admin (Requires approval)" 
              />
            </RadioGroup>
          </FormControl>
          
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 3, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Already have an account? <Button onClick={() => navigate('/login')}>Login</Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;