import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Card, Chip, Container,
  Paper, Stack, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, CircularProgress
} from '@mui/material';
import { CheckCircle, Cancel, Refresh } from '@mui/icons-material';
import axios from 'axios';

const PaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = 'http://localhost:5000/api';

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return null;
    }
    return token;
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) return;

      const response = await axios.get(`${backendUrl}/payments/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setPayments(response.data.payments || []);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (paymentId, status) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) return;

      await axios.put(
        `${backendUrl}/payments/verify/${paymentId}`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      fetchPayments();
    } catch (error) {
      console.error('Error verifying payment:', error);
      if (error.response?.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Payment Verification</Typography>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={fetchPayments}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payment ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.Payment_ID}>
                      <TableCell>#{payment.Payment_ID}</TableCell>
                      <TableCell>{payment.User_Name}</TableCell>
                      <TableCell>{payment.Event_Name}</TableCell>
                      <TableCell>${payment.Amount}</TableCell>
                      <TableCell>
                        <Chip label={payment.Payment_Method} variant="outlined" />
                      </TableCell>
                      <TableCell>
                        {new Date(payment.Payment_Date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => handleVerify(payment.Payment_ID, 'Verified')}
                          >
                            Verify
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Cancel />}
                            onClick={() => handleVerify(payment.Payment_ID, 'Rejected')}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1" py={2}>
                        No pending payments to verify
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Container>
  );
};

export default PaymentVerification;
