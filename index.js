const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Import the user routes
const app = express();

// Middleware to parse incoming JSON requests
app.use(cors)
app.use(express.json());


// Define the API routes
app.use('/api/users', userRoutes); // Use the user routes for "/api/users"

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
