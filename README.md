
# Minimal LMDB + Express setup

To start, clone the repo and in the root folder run:
```typescript
yarn install
```
and then:
```typescript
yarn run start
```

It starts the express server and initiates the database.
It checks if the db has a folder to use, and creates one if it's missing.
It also initiates a connection to the ethereum testnet Sepolia for gathering data.
the server then starts listening on port 5000

To get information on a block:
#### http://localhost:5000/block/:blockNum
The endpoint will check if there's data for blockNum in the database and return it.
If there isn't existing data, it will check the blockchain itself, add it to the database,
and then return the new database values.

Block data includes:  
    **hash**: hash of the block,  
    **createdAt**: timestamp of the block,  
    **miner**: account that mined the block,  
    **gasUsed**: total gas used by transactions in the block,  
    **gasLimit**: maximum gas allowed in the block,  
    **data**: any extra data the block contains,  
    **txns**: list of all transactions in the block

To retrieve data for a transaction:
#### http://localhost:5000/txn/:txnId
The endpoint will check if there's data for the txnId, it works just like blockId except the data is for a particular transaction:

Txn data includes:  
    **sender**: sender's account,  
    **receiver**: receiver's account,  
    **amt**: the amount (in Wei) transferred,  
    **gas**: the amount of gas the sender sent for this transaction,  
    **block**: the block containing the transaction,  
    **note**: additional data sent with the transaction

To get the balance of an account:
#### https://localhost:5000/balance/:accountId
The endpoint sends a direct request to the blockchain to get the most current balance data.

If you add a blockNum query:
#### https://localhost:5000/balance/:accountId?blockNum=
You can request the balance at a given block in the chain

To get a list of Transactions (just the hash/ID for now) for an account
### https://localhost:/5000/account-history/:accountId?startBlock=&endBlock=
Got time under 2s for 1000 blocks, although adding to DB added new time.
If the range of blocks has already been saved to the account, then it retreives them and returns them. Otherwise it scans the blockchain. It scans blocks at a given number at a time and returns transactions where the account is inside the 'to' or 'from' id.

### TODO
Account History - Txns aren't saved in a sorted order, meaning if you fetch earlier blocks after older ones, they show up in reverse order:
56781234


**Possible Fix** 
Right now only the hashes are saved in the account DB, either I can fetch all the transactions from the db and then sort them, or I can save additional information on the account side:
```json
{
    "txn": "0x230947029738502750"
}
```
```json 
{
    "txn": "0x230947029738502750",
    "blockNum": "678231"
}
```
I'm inclined to save memory in the DB and instead just fetch them all (the whole Txn) and then sort them (by blockNum) and return the hashes in a sorted list. Although I imagine it is slower.
