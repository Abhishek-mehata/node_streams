// Bulding a file download API using streams
// reports/
//     monthly-sales.csv

// GET /api/reports/download
// to download the data by users

const fs = require("node:fs")
const { stat } = require("node:fs/promises")
const { pipeline } = require("node:stream/promises")

const express = require('express')
const app = express()
const port = 3000



app.get('/api/reports/download', async (req, res) => {
    const filePath = './reports/monthly-sales.csv';

    // Check that the file exists before starting the response.
    try {

        // stat() - Checks information about a file before downloading it
        // stat() - returns the file surfacial information , metadata
        await stat(filePath)
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).send('File not found');
        }
        throw err;
    }


    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=monthly-sales.csv")

    try {

        await pipeline(
            fs.createReadStream(filePath, { encoding: "utf-8" }),
            res
        );

        // pipeline() transfers file data from a readable stream to the HTTP response safely

    } catch (error) {
        console.error("Error Downloading FIle")
        res.destroy(error)
    }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

