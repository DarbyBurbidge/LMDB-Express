import express from 'express';
import { getTxnsByBlock } from './routes/TxnByBlock';
import { getTxnDetails } from './routes/TxnDetails';

const PORT = 5000;
const app = express();

app.get('/block/:blockId', async (req, res) => {
  getTxnsByBlock(req, res)
})

app.get('/txn/:txnId', async (req, res) => {
  getTxnDetails(req, res)
})

app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)})



