
# Minimal LMDB + Express setup

To start, clone the repo and in the root folder run:
```
yarn install
```
and then:
```
yarn run start
```

It starts the express server and initiates the database.
It checks if the db has a folder to use, and creates one if it's missing.
It also initiates a connection to the ethereum testnet Sepolia for gathering data.
the server then starts listening on port 5000

You can then use the endpoint:
http://localhost:5000/data/:blockId
The endpoint will check if there's data for blockId in the database and return it.
If there isn't existing data, it will check the blockchain itself, add it to the database,
and then return the new database values.
