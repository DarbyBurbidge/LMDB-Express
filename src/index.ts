import express from 'express';
import { getDataById } from './routes';

const PORT = 6000;
const app = express();

app.get('/data/:id', async (req, res) => {
  getDataById(req, res)
})

// I had originally written the API to take JSON,
// but the above allows you to use the url to input a value into the database
// app.get('/data', async (req, res) => {
//   resolver.getData(req, res)
// })


app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)})




