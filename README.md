
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
the server then starts listening on port 6000

You can then use the endpoint:
http://localhost:6000/data/:id
The endpoint will console log on the servers terminal either 'Hello World!' or null
(as well as log whatever was typed in for :id)

Chrome blocks the 6000 port for some reason,
so I'm using Insomnia to check the endpoint
