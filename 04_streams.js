// pipe() vs pipeline()



// 1.
// Understanding pipe()
// Without streams, you might load the 
// file into memory

const fs = require("node:fs");


const readable = fs.createReadStream("./source.txt")
const writeable = fs.createWriteStream("./destination.txt")
readable.pipe(writeable);
// The .pipe() method connects a
// Readable stream to a Writable stream



// B.
// Now Lets understand
// pipeline()
// const fs = require("node:fs")
const zlib = require("node:zlib")
const { pipeline } = require("node:stream/promises")

async function compressFile() {
    try {
        await pipeline(
            fs.createReadStream("./source.txt"),
            zlib.createGzip(),
            fs.createWriteStream("./source.txt.gz")
        );


        console.log("Compression Completed");
    } catch (error) {
        console.log("An error occured: ", error);
    }
}

compressFile();


// PIPE vs PIPELINE
