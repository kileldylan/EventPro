import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, CardMedia, Button, 
  Chip, Avatar, Tabs, Tab, Paper, Divider, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { CalendarToday, LocationOn, ConfirmationNumber, Person, Logout } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const Sidebar = styled(Paper)(({ theme }) => ({
  width: 280,
  padding: theme.spacing(3),
  borderRadius: 0,
  height: '100vh',
  position: 'sticky',
  top: 0,
}));

const MainContent = styled(Box)({
  flex: 1,
  padding: '24px 32px',
});

const EventCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Fetch user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user'));
  const user = userData?.user || userData; // Handle both possible structures
  const userId = user?.id || user?.User_ID;
  const userRole = user?.role || user?.Role_ID;
  const backendUrl = 'http://localhost:5000/api';

  // Format date consistently
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 0) {
          const response = await axios.get(`${backendUrl}/events/getEvents`);
          setEvents(response.data);
        } else if (activeTab === 1 && userId) {
          const response = await axios.get(`${backendUrl}/events/getTickets/${userId}`);
          setTickets(response.data);
        } else if (activeTab === 2) {
          const response = await axios.get(`${backendUrl}/events/getVenues`);
          setVenues(response.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, userId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <DashboardContainer>
      <Sidebar elevation={3}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar sx={{ width: 80, height: 80, mb: 2 }} src="/user-avatar.jpg" />
          <Typography variant="h6">{user?.name || user?.Name || 'User'}</Typography>
          <Typography variant="body2" color="text.secondary">
            {userRole === 1 ? 'Admin' : 'Member'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Button
            fullWidth
            startIcon={<Person />}
            sx={{ justifyContent: 'flex-start', mb: 1 }}
            onClick={() => navigate('/user_profile')}
          >
            My Profile
          </Button>
          <Button
            fullWidth
            startIcon={<ConfirmationNumber />}
            sx={{ justifyContent: 'flex-start', mb: 1 }}
            onClick={() => setActiveTab(1)}
          >
            My Tickets
          </Button>
          <Button
            fullWidth
            startIcon={<Logout />}
            sx={{ justifyContent: 'flex-start', color: 'error.main' }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Sidebar>

      <MainContent>
        <Typography variant="h4" gutterBottom>
          Event Dashboard
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Upcoming Events" icon={<CalendarToday />} />
          <Tab label="My Tickets" icon={<ConfirmationNumber />} />
          <Tab label="Venues" icon={<LocationOn />} />
        </Tabs>

        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}

        {success && (
          <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
              {success}
            </Alert>
          </Snackbar>
        )}

        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Discover Exciting Events
            </Typography>
            <Grid container spacing={3}>
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event._id || event.Event_ID}>
              <EventCard onClick={() => navigate(`/payment/${event._id || event.Event_ID}`)}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Chip 
                      label={event.category || event.Event_Category || 'General'} 
                      size="small" 
                    />
                    <Typography variant="subtitle1">
                      Ksh {event.Ticket_Price || '0'}
                    </Typography>
                  </Box>
                  <Typography gutterBottom variant="h6">
                    {event.Event_Name || 'Untitled Event'}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarToday fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(event.Event_Date)}
                      {event.Event_Start_Time && ` • ${event.Event_Start_Time}`}
                      {event.Event_End_Time && ` - ${event.Event_End_Time}`}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <ConfirmationNumber fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.Available_Tickets !== undefined 
                        ? `${event.Available_Tickets} tickets available` 
                        : 'Ticket availability not specified'}
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={event.Available_Tickets === 0 || loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/payment/${event._id || event.Event_ID}`);
                    }}
                    sx={{ mt: 1 }}
                  >
                    {event.Available_Tickets > 0 ? 'Get Tickets' : 'Sold Out'}
                  </Button>
                </CardContent>
              </EventCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Tickets
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Paper sx={{ p: 2 }}>
                {Array.isArray(tickets) && tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <Box 
                      key={ticket._id || ticket.Ticket_ID} 
                      mb={2} 
                      p={2} 
                      sx={{ 
                        border: '1px solid', 
                        borderColor: 'divider', 
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight="medium">
                          {ticket.event?.title || ticket.Event_Name || 'Unknown Event'}
                        </Typography>
                        <Chip 
                          label={ticket.status || ticket.Status || 'Pending'} 
                          color={
                            (ticket.status || ticket.Status) === 'Confirmed' ? 'success' : 
                            (ticket.status || ticket.Status) === 'Cancelled' ? 'error' : 'warning'
                          } 
                          size="small"
                        />
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" mt={1.5}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Date:</strong> {new Date(ticket.Purchase_Date || ticket.purchaseDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Qty:</strong> {ticket.Quantity || ticket.quantity}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Total:</strong> Ksh{ticket.Total_Price || ticket.totalPrice}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" justifyContent="flex-end" mt={1.5}>
                        <Button 
                          size="small" 
                          sx={{ mr: 1 }}
                          onClick={() => navigate(`/ticket/${ticket._id || ticket.Ticket_ID}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          color="error"
                          disabled={(ticket.status || ticket.Status) === 'Cancelled'}
                        >
                          Cancel Ticket
                        </Button>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body1" color="text.secondary" mb={2}>
                      You haven't purchased any tickets yet.
                    </Typography>
                    <Button 
                      variant="contained"
                      onClick={() => setActiveTab(0)}
                      startIcon={<CalendarToday />}
                    >
                      Browse Events
                    </Button>
                  </Box>
                )}
              </Paper>
            )}
          </Box>
        )}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Popular Venues
            </Typography>
            <Grid container spacing={3}>
              {venues.map((venue) => (
                <Grid item xs={12} sm={6} md={4} key={venue._id || venue.Venue_ID}>
                  <EventCard onClick={() => navigate(`/venue/${venue._id || venue.Venue_ID}`)}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={venue.image || '/images/venue-placeholder.jpg'}
                      alt={venue.name || venue.Venue_Name || 'Venue'}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6">
                        {venue.name || venue.Venue_Name || 'Unnamed Venue'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {venue.location || venue.Venue_Location || 'Location not specified'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Capacity: {venue.capacity || venue.Venue_Capacity || 'N/A'}
                      </Typography>
                    </CardContent>
                  </EventCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default UserDashboard;