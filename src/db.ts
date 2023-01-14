import lmdb from 'node-lmdb';
import fs from 'fs';

/*
    Everything was pulled straight from:
    https://github.com/Venemo/node-lmdb
    I just moved it to a seperate file away from the express server
*/

export const db = new lmdb.Env();
const db_path = `${__dirname}/../db`

    // Note: /db is a folder that is already on the filesystem,
    // if it wasn't, you'd need to set it up prior to calling db.open()
if (!fs.existsSync(db_path)) {
    fs.mkdir(db_path, (err) => {
        console.error(err)
    });
    console.log('db folder created')
} else {
    console.log('db folder exists')
}

db.open({
  path: db_path,
  mapSize: 2*1024*1024*1024,
  maxDbs: 2
});

export const block_db = db.openDbi({
  name: "blockchain baby!!!",
  create: true,
  dupSort: true
})

export const txn_db = db.openDbi({
    name: "txn_db",
    create: true
})

