import { useState, useEffect } from 'react';
import { 
  Button, Card, Container, 
  IconButton, Paper, Stack, Typography, CircularProgress
} from '@mui/material';
import { Add, Refresh, Search, Edit, Delete } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import VenueForm from './VenueForm';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const backendUrl = 'http://localhost:5000/api';

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/events/getVenues`);
      
      // Debug: Check the raw API response structure
      console.log("API Response:", response.data);
      
      // Ensure proper field mapping
      const formattedVenues = response.data.map(venue => ({
        Venue_ID: venue.Venue_ID,
        Venue_Name: venue.Venue_Name,
        Street: venue.Street,
        City: venue.City,
        District: venue.District,
        State: venue.State,
        Pincode: venue.Pincode,
        Capacity: venue.Capacity
      }));

      // Debug: Check the formatted data
      console.log("Formatted Venues:", formattedVenues);
      
      setVenues(formattedVenues);
    } catch (error) {
      console.error('Error fetching venues:', error);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${backendUrl}/events/deleteVenue/${id}`);
      await fetchVenues();
    } catch (error) {
      console.error('Error deleting venue:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter(venue => {
    const venueName = venue?.Venue_Name?.toString()?.toLowerCase() || '';
    const city = venue?.City?.toString()?.toLowerCase() || '';
    const search = searchTerm?.toString()?.toLowerCase() || '';

    return venueName.includes(search) || city.includes(search);
  });

  const columns = [
  {
    field: 'Venue_ID',
    headerName: 'ID',
    width: 70,
  },
  {
    field: 'Venue_Name',
    headerName: 'Venue Name',
    width: 200,
  },
  {
    field: 'Location',
    headerName: 'Location',
    width: 250,
    valueGetter: (params) => {
      const street = params?.row?.Street || '';
      const city = params?.row?.City || '';
      return `${street}, ${city}`;
    },
  },
  {
    field: 'Capacity',
    headerName: 'Capacity',
    width: 120,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <IconButton
          size="small"
          onClick={() => {
            setSelectedVenue(params.row);
            setOpenForm(true);
          }}
        >
          <Edit fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDelete(params.row?.Venue_ID)}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Stack>
    ),
  },
];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" component="h2">
            All Venues
          </Typography>
          <Stack direction="row" spacing={2}>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
              elevation={1}
            >
              <Search sx={{ color: 'action.active', mr: 1 }} />
              <input
                placeholder="Search venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  padding: '8px 0',
                }}
              />
            </Paper>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setSelectedVenue(null);
                setOpenForm(true);
              }}
            >
              Add Venue
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchVenues}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Refresh'}
            </Button>
          </Stack>
        </Stack>

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredVenues}
            columns={columns}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            getRowId={(row) => row.Venue_ID}
            disableSelectionOnClick
          />
        </div>
      </Card>

      <VenueForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        venue={selectedVenue}
        refreshVenues={fetchVenues}
      />
    </Container>
  );
};

export default Venues;