
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

You can then use the endpoint:
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

You can also use the endpoint:
#### http://localhost:5000/txn/:txnId
The endpoint will check if there's data for the txnId, it works just like blockId except the data is for a particular transaction:

Txn data includes:
    **sender**: sender's account,  
    **receiver**: receiver's account,  
    **amt**: the amount (in Wei) transferred,  
    **gas**: the amount of gas the sender sent for this transaction,  
    **block**: the block containing the transaction,  
    **note**: additional data sent with the transaction

You can also use:
#### https://localhost:5000/balance/:accountId
The endpoint sends a direct request to the blockchain to get the most current balance data.

If you add a blockNum query:
#### https://localhost:5000/balance/:accountId?blockNum=
You can request the balance at a given block in the chain


### Known Issues
Block endpoint gives error if there's missing data because it refreshes all the data (even existing data). This is caused because dupKeys are allowed so we can store many transactions under the same 'txns' key. 'dupKeys: true' stops overwrites, but 'noOverwrites: false' doesn't fix it.

####Possible fix: change 'txns' key to 'txn-i' and remove dupKeys since the default database config allows overwrites. Also, deleting and then adding keys is another possible solution (but seems less efficient).





