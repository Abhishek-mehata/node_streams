// Imagine an enterprise application receives a file containing 10 million user records.

// users.ndjson
// {"id":"U001","email":"ALICE@EXAMPLE.COM","name":"Alice"}
// {"id":"U002","email":"BOB@EXAMPLE.COM","name":"Bob"}
// {"id":"U003","email":"CHARLIE@EXAMPLE.COM","name":"Charlie"}
// {"id":"U004","email":"DAVID@EXAMPLE.COM","name":"David"}

// The backend team wants:
// 1. Reads the input file incrementally.
// 2. Converts each JSON line into a JavaScript object.
// 3. Validates the user record.
// 4. Normalizes email addresses.
// 5. Writes cleaned JSON lines into another file.
// 6. Handles errors.
// 7. Supports cancellation.
// 8. Does not load the entire dataset into memory.



// streaming-importer/
// │
// ├── input/
// │   └── users.ndjson
// │
// ├── output/
// │
// ├── src/
// │   ├── import-users.mjs
// │   │
// │   ├── package.json
// │
// └── README.md