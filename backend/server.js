const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      return;
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/edusigma', {
      serverSelectionTimeoutMS: 5000,
      family: 4,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      directConnection: true
    });
    
    console.log('Connected to MongoDB successfully');
    console.log('Database URL:', mongoose.connection.host);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Retry connection after 5 seconds
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Handle MongoDB disconnection
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Attempting to reconnect...');
  setTimeout(connectDB, 5000);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

// Connect to MongoDB
connectDB();

// Comment Schema
const commentSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

// Routes
app.get('/api/comments/:courseCode', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database connection not available' });
    }
    const comments = await Comment.find({ courseCode: req.params.courseCode })
      .sort({ timestamp: -1 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database connection not available' });
    }
    const comment = new Comment({
      courseCode: req.body.courseCode,
      text: req.body.text,
    });
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database connection not available' });
    }
    await Comment.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    message: err.message 
  });
});

// Function to find an available port
const findAvailablePort = async (startPort, maxAttempts = 3) => {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    try {
      await new Promise((resolve, reject) => {
        const server = require('net').createServer()
          .once('error', () => {
            server.close();
            resolve(false);
          })
          .once('listening', () => {
            server.close();
            resolve(true);
          })
          .listen(port);
      });
      return port;
    } catch (err) {
      console.log(`Port ${port} is not available`);
    }
  }
  throw new Error('Could not find an available port');
};

// Function to start server
const startServer = async () => {
  try {
    const PORT = await findAvailablePort(process.env.PORT || 5000);
    const HOST = '0.0.0.0';

    const server = app.listen(PORT, HOST, () => {
      const interfaces = require('os').networkInterfaces();
      const addresses = [];
      
      for (const k in interfaces) {
        for (const k2 in interfaces[k]) {
          const address = interfaces[k][k2];
          if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
          }
        }
      }

      console.log('\nServer is running on:');
      console.log(`Local: http://localhost:${PORT}`);
      addresses.forEach(addr => {
        console.log(`Network: http://${addr}:${PORT}`);
      });
      console.log('\nTest the API:');
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 