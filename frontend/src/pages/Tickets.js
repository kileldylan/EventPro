import { useState, useEffect } from 'react';
import { 
  Button, Card, Chip, Container, 
  Paper, Stack, Typography, CircularProgress
} from '@mui/material';
import { Refresh, Search } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const backendUrl = 'http://localhost:5000/api';

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/getTickets`);
      
      const formattedTickets = response.data.map(ticket => ({
        Ticket_ID: ticket.Ticket_ID,
        Event_Name: ticket.Event?.Event_Name || 'Event Deleted',
        User_Name: ticket.User?.name || 'User Deleted',
        Purchase_Date: ticket.Purchase_Date,
        Quantity: ticket.Quantity,
        Total_Price: ticket.Total_Price,
        Status: ticket.Status
      }));

      setTickets(formattedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const search = searchTerm.toLowerCase();
    return (
      ticket.Event_Name.toLowerCase().includes(search) ||
      ticket.User_Name.toLowerCase().includes(search) ||
      ticket.Status.toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      field: 'Ticket_ID',
      headerName: 'Ticket ID',
      width: 100,
    },
    {
      field: 'Event_Name',
      headerName: 'Event',
      width: 200,
    },
    {
      field: 'User_Name',
      headerName: 'User',
      width: 150,
    },
    {
      field: 'Purchase_Date',
      headerName: 'Purchase Date',
      width: 150,
      valueFormatter: (params) => {
        try {
          return new Date(params.value).toLocaleDateString();
        } catch {
          return 'Invalid date';
        }
      },
    },
    {
      field: 'Quantity',
      headerName: 'Qty',
      width: 80,
      type: 'number',
    },
    {
      field: 'Total_Price',
      headerName: 'Total',
      width: 100,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      field: 'Status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Confirmed' ? 'success' : 
            params.value === 'Pending' ? 'warning' : 'error'
          }
          variant="outlined"
          size="small"
        />
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" component="h2">
            Ticket Purchases
          </Typography>
          <Stack direction="row" spacing={2}>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
              elevation={1}
            >
              <Search sx={{ color: 'action.active', mr: 1 }} />
              <input
                placeholder="Search tickets..."
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
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchTickets}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Refresh'}
            </Button>
          </Stack>
        </Stack>

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredTickets}
            columns={columns}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            getRowId={(row) => row.Ticket_ID}
            disableSelectionOnClick
          />
        </div>
      </Card>
    </Container>
  );
};

export default Tickets;