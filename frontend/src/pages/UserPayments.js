import React, { useState, useEffect } from 'react';
import { 
  Box, Card, CardContent, Chip, Container, 
  List, ListItem, ListItemText, Typography, CircularProgress 
} from '@mui/material';
import { Payment, CheckCircle, Pending, Cancel } from '@mui/icons-material';
import axios from 'axios';

const UserPayments = ({ userId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchUserPayments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/userPayments/${userId}`);
        setPayments(response.data.payments);
      } catch (error) {
        console.error('Error fetching user payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPayments();
  }, [userId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle color="success" />;
      case 'Pending':
        return <Pending color="warning" />;
      case 'Rejected':
        return <Cancel color="error" />;
      default:
        return <Payment />;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            My Payment History
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : payments.length === 0 ? (
            <Typography variant="body1" textAlign="center" py={4}>
              No payment history found
            </Typography>
          ) : (
            <List>
              {payments.map((payment) => (
                <ListItem key={payment.Payment_ID} divider>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={2}>
                        {getStatusIcon(payment.Verification_Status)}
                        <Typography variant="subtitle1">
                          {payment.Event_Name}
                        </Typography>
                        <Chip
                          label={payment.Verification_Status}
                          size="small"
                          color={
                            payment.Verification_Status === 'Verified' ? 'success' :
                            payment.Verification_Status === 'Rejected' ? 'error' : 'warning'
                          }
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">
                          Amount: ${payment.Amount}
                        </Typography>
                        <Typography variant="body2">
                          Date: {new Date(payment.Payment_Date).toLocaleDateString()}
                        </Typography>
                        {payment.Verification_Notes && (
                          <Typography variant="body2" color="text.secondary">
                            Notes: {payment.Verification_Notes}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserPayments;