// HOW DO WE ACTUALLY WORK WITH STREAMS

// Readable Stream
// Produces data

// Chunks flow through the system

// Transform Stream
// Processes data (optional)

// Writable Stream
// Consumes data
// this architecture is called stream pipeline





// 1.
const fs = require("node:fs")


const readable = fs.createReadStream("./input/users.txt", { encoding: 'utf-8' });

readable.on('data', (chunk) => {
    console.log("Chunk received: ");
    console.log(chunk)
})


// ---
// 2.
// how do we write data to a file using streams

// const fs = require("node:fs")

const writeable = fs.createWriteStream("./output/result.txt")
writeable.write("Test ... \n");
writeable.write("Test2 ......\n");
writeable.end("Last chunk of data");

writeable.on('finish', () => {
    console.log("All writes are now complete.")
})



// ---
// 3.
// Different ways to consume Readable Streams

// i. Using the 'data' event
// ii. Using the 'readable' event
// iii. Using the .pipe() method

// A. Flowing Mode - (i. Using the 'data' event)
// The stream automatically delivers data as it becomes available
const readableStream = fs.createReadStream("./input/users.txt", { encoding: 'utf-8' });
readableStream.on('data', (chunk) => {
    console.log("Chunbk received: ");
    console.log(chunk.toString())
});


// B. Paused Mode - (ii. Using the 'readable' event)
const readableStream2 = fs.createReadStream("./input/users.txt", { encoding: 'utf-8' });

readableStream2.on('readable', () => {
    let chunk;

    while ((chunk = readableStream2.read()) !== null) {
        console.log(chunk.toString());
    }
});



// using the .pipe() method
const readableStream3 = fs.createReadStream("./input/users.txt", { encoding: 'utf-8' });
const writeableStream3 = fs.createWriteStream("./output/result.txt");

readableStream3
    .pipe(writeableStream3)
    .pipe(console.log("Data Has been piped to the destination file."));


// -------

// For modern applications,
// it is recommended to use
// .pipe()
// .pipeline()
// aync/await with streams 


// A Modern way: for await...of

// const fs = requrire("node:fs")
const readableStream4 = fs.createReadStream("./input/users.txt", { encoding: 'utf-8' });

async function processStream() {

    for await (const chunk of readableStream4) {
        console.log("Chunk received: ");
        console.log(chunk.toString());
    }
}

processStream().catch((err) => {
    console.error("Error processing stream: ", err);
});



