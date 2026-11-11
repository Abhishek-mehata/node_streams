// streams in Node Js
// Instead of communicating with the entire data(say of 1 gb), we use
// concept of streams to communicate with data in chunks(in mbs) 
// this is very useful when we are dealing with large data files,
// and reduce the memory usage of application


const fs = require("node:fs")

// 1.
// readable stream
const readable = fs.createReadStream("./source.txt", { encoding: 'utf-8' });
readable.on('data', (chunk) => {
    console.log(chunk)
})


// 2.
// writeable stream - a destination to which data is written
const writeable = fs.createWriteStream("./report.txt")
writeable.write("Test ...");
writeable.end();


// 3.
// Duplex Stream's
// Two users communicate through a network connection
// Both users can send and receive data
// this is the power of Duplex streams

// const net = require("net")

// const socket = net.createConnection({
//     host: 'example.com',
//     port: 8000
// })

// socket.write('GET / HTTP/1.1\r\nHost: example.com\r\n\r\n');
// socket.on('data', (chunk) => {
//     console.log(chunk.toString())
// })



// 4. Transform Streams
// Original FIle -> Compress -> Compressed File
// const fs = require("fs")
const zlib = require("zlib")

const readableStream = fs.createReadStream("./sample.txt", { encoding: 'utf-8' });
const gzip = zlib.createGzip();
const writeableStream = fs.createWriteStream("./compressed.txt.gz")

readableStream
    .pipe(gzip)
    .pipe(writeableStream)


// the entire file doesn't have to be loaded into memory first
// Readable - Data is consumed from a source
// Writeable - Data is written to a destination

