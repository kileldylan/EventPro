import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  CircularProgress, 
  Alert,
  Paper, 
  Grid,
  Divider,
  Snackbar
} from '@mui/material';
import { CalendarToday, LocationOn } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const navigate = useNavigate();

  // User data
  const user = JSON.parse(localStorage.getItem('user'))?.user || JSON.parse(localStorage.getItem('user'));
  const userID = user?.id || user?.User_ID;
  const backendUrl = 'http://localhost:5000/api';

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/events/getEvent/${eventId}`);
        setEvent(response.data);
      } catch (err) {
        showSnackbar('Failed to fetch event details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
    // eslint-disable-next-line
  }, [eventId]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      await axios.post(`${backendUrl}/events/purchaseTicket`, {
        userID,
        eventID: event?.Event_ID || eventId,
        numberOfTickets,
        paymentMethod,
        amount: (event?.Ticket_Price || event?.price || 0) * numberOfTickets
      });

      showSnackbar('Payment submitted! Awaiting admin approval.', 'success');
      setTimeout(() => navigate('/user_dashboard'), 3000);
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Payment failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !event) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6">Event not found</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" p={3}>
      <Typography variant="h4" gutterBottom>
        Complete Your Purchase
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5">
                {event.Event_Name || event.title || 'Untitled Event'}
              </Typography>
              
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarToday fontSize="small" color="action" sx={{ mr: 1 }} />
                <Typography>{formatDate(event.Event_Date || event.date)}</Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
                <Typography>
                  {event.Venue_ID || event.venue?.name || 'Venue not specified'}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Price per ticket:</Typography>
                <Typography>Ksh {event.Ticket_Price || event.price || '0'}</Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Quantity:</Typography>
                <Typography>{numberOfTickets}</Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1">Total:</Typography>
                <Typography variant="subtitle1">
                  Ksh {((event.Ticket_Price || event.price || 0) * numberOfTickets).toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={numberOfTickets}
              onChange={(e) => setNumberOfTickets(Math.max(1, Number(e.target.value)))}
              margin="normal"
              inputProps={{ min: 1 }}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label="Payment Method"
                required
              >
                <MenuItem value="mpesa">M-Pesa</MenuItem>
                <MenuItem value="credit_card">Credit Card</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              onClick={handlePayment}
              disabled={!paymentMethod || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Payment'}
            </Button>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Note: Your payment will be pending until approved by an administrator.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentPage;