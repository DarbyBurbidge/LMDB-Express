import express from 'express';
import { getDataById } from './routes';

const PORT = 6000;
const app = express();

app.get('/data/:blockId', async (req, res) => {
  getDataById(req, res)
})

app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)})




