// Suppose you have to compress a 10 GB log file.


// logs/application.log -> Readable. -> Gzip. -> Writeable.  -> logs/application.log.gz

const fs = require("node:fs");
const zlib = require("node:zlib")
const { pipeline } = require("node:stream/promises")


const express = require('express')
const app = express()
const port = 3000


async function compressLogs() {
    try {
        await pipeline(
            fs.createReadStream("./logs/application.log"),
            zlib.createGzip(),
            fs.createWriteStream("./logs/application.log.gz")
        )
        console.log('Logs compressed successfully');
    } catch (error) {
        console.log("Error occured: ", error)
    }
}

compressLogs()

// app.get('/', (req, res) => res.send('Hello World!'))
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))