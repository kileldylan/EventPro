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
  Box
} from '@mui/material';
import axios from 'axios';

const VenueForm = ({ open, onClose, venue, refreshVenues }) => {
  const [formData, setFormData] = useState({
    venueName: '',
    street: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    capacity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backendUrl = 'http://localhost:5000/api';

  useEffect(() => {
    if (venue) {
      setFormData({
        venueName: venue.Venue_Name || '',
        street: venue.Street || '',
        city: venue.City || '',
        district: venue.District || '',
        state: venue.State || '',
        pincode: venue.Pincode || '',
        capacity: venue.Capacity || ''
      });
    } else {
      setFormData({
        venueName: '',
        street: '',
        city: '',
        district: '',
        state: '',
        pincode: '',
        capacity: ''
      });
    }
  }, [venue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate required fields
      if (!formData.venueName || !formData.city || !formData.capacity) {
        throw new Error('Venue name, city, and capacity are required');
      }

      if (venue) {
        // Update existing venue
        await axios.put(`${backendUrl}/events/updateVenue/${venue.Venue_ID}`, formData);
      } else {
        // Add new venue
        await axios.post(`${backendUrl}/events/addVenue`, formData);
      }

      refreshVenues();
      onClose();
    } catch (err) {
      console.error('Error saving venue:', err);
      setError(err.response?.data?.error || err.message || 'Error saving venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{venue ? 'Edit Venue' : 'Add New Venue'}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Venue Name"
              name="venueName"
              value={formData.venueName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Street Address"
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
            </Stack>
            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              required
              inputProps={{ min: 1 }}
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
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VenueForm;