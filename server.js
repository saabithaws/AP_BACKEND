const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://APLK:ap@appayments.htgks.mongodb.net/?retryWrites=true&w=majority&appName=apPayments', {
  useNewUrlParser: true,
  useUnifiedTopology: true  
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('MongoDB connected successfully');
});

db.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
});

const paymentSchema = new mongoose.Schema({
  name: String,
  email: String,
  nameOnCard: String,
  emailAddress: String,
  cardNumber: String,
  expiryDate: String,
  cvv: String,
  date: {
    type: String,  
    default: () => new Date().toISOString().split('T')[0] 
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

// Endpoint to save payment data
app.post('/api/payments', async (req, res) => {
  const { name, email, nameOnCard, emailAddress, cardNumber, expiryDate, cvv ,date } = req.body;

  const newPayment = new Payment({
    name,
    email,
    nameOnCard,
    emailAddress,
    cardNumber,
    expiryDate,
    cvv,
    date
  });

  try {
    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: 'Error saving payment' });
  }
});

app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payments' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
