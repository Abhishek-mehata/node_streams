// In production, understanding how a stream starts, 
// processes data, finishes and fails is just as 
// important as knowing how to read or write data.


// Some Important Stream events


// [
//     ['Event', 'Stream Association', 'Meaning'],

//     ['data', 'Readable', ]
// ]


// A complete lifecycle

const fs = require("node:fs");

const readable = fs.createReadStream("./source.txt");
const writeable = fs.createWriteStream('./destination.txt');

readable.on('end', () => {
    console.log("Reading Completed");
});

writeable.on('finish', () => {
    console.log("Writing Completed")
})

readable.on('error', () => {
    console.error("Something Went wrong:", error.message);
});




readable.pipe(writeable)

// ---------------------------------------------------------------------------
