import express from 'express';
import { transformRoute } from './routes/transformRoute'

const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Define routes
app.use('/transform', transformRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});