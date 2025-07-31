import { useState, useEffect } from 'react';
import { 
  Button, Card, Chip, Container, 
  IconButton, Paper, Stack, Typography, CircularProgress
} from '@mui/material';
import { Add, Refresh, Search, Edit, Delete } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import EventForm from './EventForm';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [venues, setVenues] = useState([]);

  const backendUrl = 'http://localhost:5000/api';

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/events/getEvents`);
      
      // Map the response data to ensure consistent field names
      const formattedEvents = response.data.map(event => ({
        Event_ID: event.Event_ID,
        Event_Name: event.Event_Name,
        Organizer: event.Organizer,
        Event_Date: event.Event_Date,
        Event_Start_Time: event.Event_Start_Time,
        Event_End_Time: event.Event_End_Time,
        Tickets_Count: event.Tickets_Count,
        Available_Tickets: event.Available_Tickets,
        Ticket_Price: event.Ticket_Price,
        Venue_ID: event.Venue_ID
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await axios.get(`${backendUrl}/events/getVenues`);
      setVenues(response.data);
    } catch (error) {
      console.error('Error fetching venues:', error);
      setVenues([]);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchVenues();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${backendUrl}/events/deleteEvent/${id}`);
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const search = searchTerm.toLowerCase();
    return (
      (event.Event_Name?.toLowerCase() || '').includes(search) ||
      (event.Organizer?.toLowerCase() || '').includes(search)
    );
  });

  const columns = [
    {
      field: 'Event_ID',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'Event_Name',
      headerName: 'Event Name',
      width: 200,
    },
    {
      field: 'Organizer',
      headerName: 'Organizer',
      width: 150,
    },
    {
      field: 'Event_Date',
      headerName: 'Date',
      width: 120,
      valueFormatter: (params) => {
        const raw = params.value;
        if (!raw) return 'No date';

        const parsedDate = new Date(raw);
        if (isNaN(parsedDate)) {
          return 'Invalid date';
        }

        return parsedDate.toLocaleDateString();
      }
    },
    {
      field: 'Time',
      headerName: 'Time',
      width: 150,
      valueGetter: (params) => {
        if (!params || !params.row) return ''; // prevent crash
        return params.row.Event_Name ?? '';
      },
    },
    {
      field: 'Available_Tickets',
      headerName: 'Availability',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={`${params.value}/${params.row.Tickets_Count}`}
          color={params.value > 0 ? 'success' : 'error'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'Ticket_Price',
      headerName: 'Price',
      width: 100,
      valueFormatter: (params) => {
        const value = Number(params?.value);
        return isNaN(value) ? '$0.00' : `$${value.toFixed(2)}`;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedEvent(params.row);
              setOpenForm(true);
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.Event_ID)}
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
            All Events
          </Typography>
          <Stack direction="row" spacing={2}>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
              elevation={1}
            >
              <Search sx={{ color: 'action.active', mr: 1 }} />
              <input
                placeholder="Search events..."
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
                setSelectedEvent(null);
                setOpenForm(true);
              }}
            >
              Create Event
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchEvents}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Refresh'}
            </Button>
          </Stack>
        </Stack>

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredEvents}
            columns={columns}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            getRowId={(row) => row?.Event_ID ?? Math.random()}
            disableSelectionOnClick
          />
        </div>
      </Card>

      <EventForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        event={selectedEvent}
        refreshEvents={fetchEvents}
        venues={venues}
      />
    </Container>
  );
};

export default Events;