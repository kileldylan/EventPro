import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { Event, ConfirmationNumber } from '@mui/icons-material';
import axios from 'axios';

const TicketBooking = ({ userId, onTicketPurchased }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingEvents, setFetchingEvents] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const backendUrl = 'http://localhost:5000/api';

  // Fetch available events
  useEffect(() => {
    const fetchAvailableEvents = async () => {
      try {
        setFetchingEvents(true);
        const response = await axios.get(`${backendUrl}/events/getEvents`);
        setEvents(response.data || []);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        setEvents([]);
      } finally {
        setFetchingEvents(false);
      }
    };

    fetchAvailableEvents();
  }, []);

  const handlePurchase = async () => {
    if (!selectedEvent) {
      setError('Please select an event');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data: newTicket } = await axios.post(`${backendUrl}/events/purchaseTicket`, {
        userId,
        eventId: selectedEvent,
        quantity
      });

      setSuccess(`Successfully booked ${quantity} ticket(s) for ${events.find(e => e._id === selectedEvent)?.title}`);
      setSelectedEvent('');
      setQuantity(1);
      
      if (onTicketPurchased) {
        onTicketPurchased(newTicket);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to purchase ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ConfirmationNumber /> Book Tickets
          </Typography>
          
          {error && (
            <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'error.light' }}>
              <Typography color="error">{error}</Typography>
            </Paper>
          )}
          
          {success && (
            <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'success.light' }}>
              <Typography color="success.main">{success}</Typography>
            </Paper>
          )}

          <FormControl fullWidth sx={{ mb: 3 }} disabled={fetchingEvents || events.length === 0}>
            <InputLabel>
              {fetchingEvents ? 'Loading events...' : events.length === 0 ? 'No available events' : 'Select Event'}
            </InputLabel>
            <Select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              label={fetchingEvents ? 'Loading events...' : events.length === 0 ? 'No available events' : 'Select Event'}
              startAdornment={<Event sx={{ mr: 1 }} />}
            >
              {events.map((event) => (
                <MenuItem key={event._id} value={event._id}>
                  {event.title} - ${event.price} (Available: {event.availableTickets || event.capacity})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => {
              const value = Math.max(1, parseInt(e.target.value || 1));
              const selected = events.find(e => e._id === selectedEvent);
              const max = selected?.availableTickets || selected?.capacity || 1;
              setQuantity(Math.min(value, max));
            }}
            sx={{ mb: 3 }}
            inputProps={{ 
              min: 1,
              max: events.find(e => e._id === selectedEvent)?.availableTickets || undefined
            }}
            disabled={!selectedEvent || events.length === 0}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePurchase}
            disabled={loading || !selectedEvent || events.length === 0 || fetchingEvents}
            startIcon={loading ? <CircularProgress size={20} /> : <ConfirmationNumber />}
          >
            {loading ? 'Processing...' : 'Purchase Tickets'}
          </Button>

          {events.length === 0 && !fetchingEvents && (
            <Box mt={2} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                There are currently no available events to book. Please check back later.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default TicketBooking;