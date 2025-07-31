import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const PurchaseTicketForm = ({ open, onClose, refreshTickets }) => {
  const [formData, setFormData] = useState({
    Event_ID: '',
    User_ID: '',
    Quantity: 1,
    Total_Price: 0
  });
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backendUrl = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, usersRes] = await Promise.all([
          axios.get(`${backendUrl}/getEvents`),
          axios.get(`${backendUrl}/getUsers`)
        ]);
        setEvents(eventsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = (quantity, eventId) => {
    const event = events.find(e => e.Event_ID == eventId);
    if (event) {
      return quantity * event.Ticket_Price;
    }
    return 0;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.Event_ID || !formData.User_ID || !formData.Quantity) {
        throw new Error('All fields are required');
      }

      const payload = {
        ...formData,
        Quantity: parseInt(formData.Quantity),
        Total_Price: calculateTotal(formData.Quantity, formData.Event_ID)
      };

      await axios.post(`${backendUrl}/purchaseTicket`, payload);
      refreshTickets();
      onClose();
    } catch (err) {
      console.error('Error purchasing ticket:', err);
      setError(err.response?.data?.error || err.message || 'Error purchasing ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Purchase New Ticket</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Event</InputLabel>
              <Select
                name="Event_ID"
                value={formData.Event_ID}
                onChange={handleChange}
                label="Event"
                required
              >
                {events.map(event => (
                  <MenuItem key={event.Event_ID} value={event.Event_ID}>
                    {event.Event_Name} (${event.Ticket_Price})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <Select
                name="User_ID"
                value={formData.User_ID}
                onChange={handleChange}
                label="User"
                required
              >
                {users.map(user => (
                  <MenuItem key={user.User_ID} value={user.User_ID}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Quantity"
              name="Quantity"
              type="number"
              value={formData.Quantity}
              onChange={(e) => {
                handleChange(e);
                setFormData(prev => ({
                  ...prev,
                  Total_Price: calculateTotal(e.target.value, formData.Event_ID)
                }));
              }}
              required
              inputProps={{ min: 1 }}
            />

            <TextField
              fullWidth
              label="Total Price"
              name="Total_Price"
              value={`$${formData.Total_Price.toFixed(2)}`}
              InputProps={{
                readOnly: true,
              }}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Purchase'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseTicketForm;