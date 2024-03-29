import express from 'express';
import { getBlock } from './routes/Block';
import { getTxn } from './routes/Txn';
import { getBalance } from './routes/Balance';
import { getAccountHistory } from './routes/AccountHistory';

const PORT = 5000;
const app = express();

app.get('/block/:blockNum', async (req, res) => {
  getBlock(req, res)
})

app.get('/txn/:txnId', async (req, res) => {
  getTxn(req, res)
})

app.get('/account-history/', async (req, res) => {
  getAccountHistory(req, res)
})

app.get('/balance/:accountId', async (req, res) => {
  getBalance(req, res)
})

app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)})



