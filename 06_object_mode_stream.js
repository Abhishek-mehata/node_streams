// Part 6.
// OBJECT MODE


// OBJECT MODE
// so far we have learned about 
// how streams process:
// strings
// buffers
// binary data

// For the JS objects
// in this case we use OBJECT MODE instead 
// of converting each record in String or Buffer

const { Readable } = require("node:stream")

const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
];

const readableStream = Readable.from(users, {
    objectMode: true,
})

async function processStream() {
    console.log("Users")
    for await (const user of readableStream) {
        console.log(user)
    }
}
processStream()

// Output:
// { id: 1, name: 'Alice' }
// { id: 2, name: 'Bob' }
// { id: 3, name: 'Charlie' }



// Difference between normal mode and object mode

// NORMAL MODE
// Strings, Buffers and byte-oriented data
// Buffering measured in bytes for binary data
// Suitable for files and binary data
// null indicates end of readable data

// OBJECT MODE
// JavaScript values
// Buffering measured in objects
// Suitable for records and objects
// null is also reserved and cannot be an ordinary chunk




// A PRACTICAL EXAMPLE
// Create a custom Transform

// Our task is to lowerCase and unnecessary whitespaces form the emails

// ./NormalizeEmail.js
const { Transform } = require("node:stream")


class NormalizeEmail extends Transform {
    constructor() {
        super({
            writableObjectMode: true,
            readableObjectMode: true
        });
    }

    _transform(user, encoding, callback) {
        if (!user || typeof user.email !== 'string') {
            callback(new Error('Invalid user email'));
            return;
        }

        const updatedUser = {
            ...user,
            email: user.email.trim().toLowerCase()
        };
        callback(null, updatedUser);
    }

}

// export default NormalizeEmail;


// ./app.js
// const { Readable } = require("node:stream")
// const NormalizeEmail = require("./NormalizeEmail.js")

const users1 = [
    {
        id: 1,
        name: 'Alice',
        email: ' ALICE@EXAMPLE.COM '
    },
    {
        id: 2,
        name: 'Bob',
        email: 'BOB@EXAMPLE.COM'
    }
];

const readable = Readable.from(users1);
const normalizeEmail = new NormalizeEmail();
readable
    .pipe(normalizeEmail)
    .on('data', (user) => {
        console.log(user);
    });
