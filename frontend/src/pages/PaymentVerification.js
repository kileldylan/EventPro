import { useState, useEffect } from 'react';
import { 
  Button, Card, Chip, Container, 
  Paper, Stack, Typography, CircularProgress
} from '@mui/material';
import { Refresh, Search } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const PaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const backendUrl = 'http://localhost:5000/api';

const fetchPayments = async () => {
  try {
    setLoading(true);
    console.log('Fetching payments from:', `${backendUrl}/payments/getPayments`);
    
    const response = await axios.get(`${backendUrl}/payments/getPayments`);
    console.log('API Response:', response);
    
    // Check if response.data exists and has payments array
    const paymentsData = response.data?.payments || response.data || [];
    console.log('Parsed payments data:', paymentsData);
    
    setPayments(paymentsData);
  } catch (error) {
    console.error('Full error:', error);
    console.error('Error response:', error.response);
    setPayments([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const search = searchTerm.toLowerCase();
    return (
      (payment.User_Name?.toLowerCase() || '').includes(search) ||
      (payment.Event_Name?.toLowerCase() || '').includes(search) ||
      (payment.Payment_ID?.toString() || '').includes(search)
    );
  });

  const handleRefund = async (paymentId) => {
    try {
      setLoading(true);
      await axios.post(`${backendUrl}/payments/refundPayment/${paymentId}`);
      await fetchPayments();
    } catch (error) {
      console.error('Error refunding payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'Payment_ID', headerName: 'ID', width: 70 },
    { field: 'User_Name', headerName: 'User', width: 150 },
    { field: 'Event_Name', headerName: 'Event', width: 200 },
    { field: 'Payment_Method', headerName: 'Method', width: 120 },
    {
      field: 'Amount',
      headerName: 'Amount',
      width: 120,
      valueFormatter: (params) => `Ksh ${(params.value || 0).toFixed(2)}`
    },
    { 
      field: 'Payment_Date', 
      headerName: 'Date', 
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'Payment_Status',
      headerName: 'Payment Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Success' ? 'success' : 'error'}
        />
      )
    },
    {
      field: 'Verification_Status',
      headerName: 'Verification',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Verified' ? 'success' : 'warning'}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        params.row.Payment_Status !== 'Refunded' && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleRefund(params.row.Payment_ID)}
            disabled={params.row.Verification_Status !== 'Verified'}
          >
            Refund
          </Button>
        )
      )
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" component="h2">
            Payment Verification
          </Typography>
          <Stack direction="row" spacing={2}>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
              elevation={1}
            >
              <Search sx={{ color: 'action.active', mr: 1 }} />
              <input
                placeholder="Search payments..."
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
              onClick={fetchPayments}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Refresh'}
            </Button>
          </Stack>
        </Stack>

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredPayments}
            columns={columns}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            getRowId={(row) => row.Payment_ID}
            disableSelectionOnClick
          />
        </div>
      </Card>
    </Container>
  );
};

export default PaymentVerification;