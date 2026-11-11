// The problem of backpressure occurs when a fast 
// producer (Readable Stream) is producing data faster 
// than a slow consumer (Writeable Stream) can process
// it 

// Readable Stream          Writable Stream
// (Fast producer)          (Slow consumer)

// Produces 100 MB/sec      Processes 5 MB/sec

// this is the fundamental problem of backpressure




// highWaterMark
// before learning backpressure, learn about highWaterMark
const fs = require("node:fs")
const readable = fs.createReadStream("./sample.txt", {
    encoding: 'utf-8',
    highWaterMark: 1024 * 16
    // 1024*16 = 16KB
    // The highWaterMark option specifies the maximum number of bytes to store in the internal 
    // buffer( also called memory) before ceasing to read from the underlying resource.
});

// highWaterMark is not a strict memory limit


// 1.
const writeable = fs.createWriteStream("./output/result.txt", {
    highWaterMark: 1024 * 16
});


const result = writeable.write("Test ... \n");
console.log(result) // true

// True - you can continue writing data to the stream
// False - stop writing additional chunks until the 'drain' event is emmited
// 'drain' event is emitted when internal buffer is empty and it is safe to write again


// ----
// 2. Practical code
// const fs = require("node:fs");
const { once } = require("node:events")
const { finished } = require("node:stream/promises")

async function writeData() {
    const writeable = fs.createWriteStream("./output.txt", {
        highWaterMark: 16
    });

    const completed = finished(writeable)

    for(let i=1;i<=100000;i++){
        const canContinue = writeable.write(`User ${i}\n`);


        // if buffer has reached it's threshold limit,
        // we pause the stream pipeline
        // and continue once everything is done
        if(!canContinue){
            console.log("Buffer has been full. Waiting for drain");
            await once(writeable, 'drain')
            console.log("Buffer Drained. Continuing...")
        }
    }

    writeable.end();

    await completed;

    console.log("All data written successfully");
};

writeData()