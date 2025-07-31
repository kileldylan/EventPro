import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stack
} from '@mui/material';
import axios from 'axios';

const EventForm = ({ open, onClose, event, refreshEvents }) => {
  const getInitialFormData = () => ({
    Event_Name: '',
    Event_Date: '',
    Event_Start_Time: '',
    Event_End_Time: '',
    Organizer: '',
    Tickets_Count: '100', // Default value
    Ticket_Price: '10', // Default value
    Venue_ID: ''
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [venues, setVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [error, setError] = useState(null);

  const backendUrl = 'http://localhost:5000/api';

  useEffect(() => {
    if (open) {
      if (event) {
        setFormData({
          Event_Name: event.Event_Name || '',
          Event_Date: event.Event_Date ? event.Event_Date.split('T')[0] : '',
          Event_Start_Time: event.Event_Start_Time || '',
          Event_End_Time: event.Event_End_Time || '',
          Organizer: event.Organizer || '',
          Tickets_Count: event.Tickets_Count?.toString() || '100',
          Ticket_Price: event.Ticket_Price?.toString() || '10',
          Venue_ID: event.Venue_ID?.toString() || ''
        });
      } else {
        setFormData(getInitialFormData());
      }
    }
  }, [open, event]);

  const fetchVenues = useCallback(async () => {
    try {
      setLoadingVenues(true);
      const response = await axios.get(`${backendUrl}/events/getVenues`);
      setVenues(response.data || []);
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError('Failed to load venues');
    } finally {
      setLoadingVenues(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (open) fetchVenues();
  }, [open, fetchVenues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = () => {
    return (
      formData.Event_Name &&
      formData.Event_Date &&
      formData.Event_Start_Time &&
      formData.Event_End_Time &&
      formData.Organizer &&
      formData.Tickets_Count &&
      formData.Ticket_Price &&
      formData.Venue_ID
    );
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      
      const submissionData = {
        Event_Name: formData.Event_Name,
        Event_Date: formData.Event_Date,
        Event_Start_Time: formData.Event_Start_Time,
        Event_End_Time: formData.Event_End_Time,
        Organizer: formData.Organizer,
        Tickets_Count: parseInt(formData.Tickets_Count),
        Ticket_Price: parseInt(formData.Ticket_Price),
        Available_Tickets: parseInt(formData.Tickets_Count), // Matches DB schema
        Venue_ID: parseInt(formData.Venue_ID)
      };

      const url = event
        ? `${backendUrl}/events/updateEvent/${event.Event_ID}`
        : `${backendUrl}/events/addEvent`;

      const method = event ? 'put' : 'post';
      
      await axios[method](url, submissionData);
      refreshEvents();
      onClose();
    } catch (error) {
      console.error('Error saving event:', error.response?.data || error);
      setError(error.response?.data?.message || 'Failed to save event');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{event ? 'Edit Event' : 'Create Event'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          
          <TextField
            fullWidth
            label="Event Name"
            name="Event_Name"
            value={formData.Event_Name}
            onChange={handleChange}
            required
          />
          
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="Event_Date"
              value={formData.Event_Date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Start Time"
              type="time"
              name="Event_Start_Time"
              value={formData.Event_Start_Time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="End Time"
              type="time"
              name="Event_End_Time"
              value={formData.Event_End_Time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Stack>
          
          <TextField
            fullWidth
            label="Organizer"
            name="Organizer"
            value={formData.Organizer}
            onChange={handleChange}
            required
          />
          
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Total Tickets"
              type="number"
              name="Tickets_Count"
              value={formData.Tickets_Count}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Ticket Price ($)"
              type="number"
              name="Ticket_Price"
              value={formData.Ticket_Price}
              onChange={handleChange}
              required
            />
          </Stack>
          
          <FormControl fullWidth required>
            <InputLabel>Venue</InputLabel>
            <Select
              name="Venue_ID"
              value={formData.Venue_ID}
              onChange={handleChange}
              disabled={loadingVenues}
            >
              {venues.map(venue => (
                <MenuItem key={venue.Venue_ID} value={venue.Venue_ID}>
                  {venue.Venue_Name} ({venue.City})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid()}
        >
          {event ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventForm;