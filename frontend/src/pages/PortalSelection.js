import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PortalSelection = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Welcome to EventHub
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/admin/login')}
            sx={{ py: 2, fontSize: '1.1rem' }}
          >
            Admin Portal
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/user/login')}
            sx={{ py: 2, fontSize: '1.1rem' }}
          >
            User Portal
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PortalSelection;