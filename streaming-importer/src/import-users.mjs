
import fs from 'node:fs';
import {
    mkdir,
    rename,
    rm
} from 'node:fs/promises';

import { dirname, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';



// STAGE 1: PARSE NDJSON

async function* parseNdjson(source, { signal }) {

    let pending = '';
    let lineNumber = 0;

    for await (const chunk of source) {

        signal.throwIfAborted();

        // Add the incoming chunk to our pending data.
        pending += chunk;
        let newlineIndex;

        // Process every complete line.
        while ((newlineIndex = pending.indexOf('\n')) !== -1) {

            const line = pending.slice(0, newlineIndex);
            pending = pending.slice(newlineIndex + 1);
            lineNumber++;

            if (!line.trim()) {
                continue;
            }

            try {
                const user = JSON.parse(line);
                // Yield one JavaScript object at a time.
                yield user;
            } catch (error) {
                throw new Error(
                    `Invalid JSON at line ${lineNumber}`,
                    { cause: error }
                );
            }
        }
    }

    // Process the final line if the file
    // does not end with a newline.
    if (pending.trim()) {

        lineNumber++;

        try {
            yield JSON.parse(pending);
        } catch (error) {
            throw new Error(
                `Invalid JSON at line ${lineNumber}`,
                { cause: error }
            );
        }
    }
}



// STAGE 2: VALIDATE AND NORMALIZE USERS

async function* normalizeUsers(source, { signal }) {

    let recordNumber = 0;

    for await (const user of source) {

        signal.throwIfAborted();
        recordNumber++;

        // Validate the structure.
        if (
            !user ||
            typeof user !== 'object' ||
            Array.isArray(user) ||
            typeof user.id !== 'string' ||
            typeof user.email !== 'string'
        ) {
            throw new Error(
                `Invalid user record: ${recordNumber}`
            );
        }

        // Normalize email.
        const normalizedUser = {
            id: user.id,
            email: user.email.trim().toLowerCase()
        };

        // Send the next stage a JSON line.
        yield JSON.stringify(normalizedUser) + '\n';

    }
}



// STAGE 3: RUN THE IMPORT PIPELINE
async function main() {

    const inputPath = resolve(
        process.argv[2] ?? './input/users.ndjson'
    );

    const outputPath = resolve(
        process.argv[3] ?? './output/users-clean.ndjson'
    );

    // Write into a temporary file first.
    const temporaryPath = `${outputPath}.tmp`;
    await mkdir(dirname(outputPath), {
        recursive: true
    });

    const controller = new AbortController();
    const onAbort = () => controller.abort();

    process.once('SIGINT', onAbort);
    try {

        await pipeline(

            // Read the input file.
            fs.createReadStream(inputPath, {
                encoding: 'utf8'
            }),

            // Convert JSON lines into objects.
            parseNdjson,

            // Validate and normalize each object.
            normalizeUsers,

            // Write the output incrementally.
            fs.createWriteStream(temporaryPath, {
                encoding: 'utf8'
            }),

            {
                signal: controller.signal
            }
        );

        // Publish the file only after successful completion.
        await rename(temporaryPath, outputPath);
        console.log('Import completed successfully!');
        console.log(`Output: ${outputPath}`);

    } catch (error) {

        await rm(temporaryPath, { force: true });
        if (error.name === 'AbortError') {
            console.error('Import was cancelled.');
        } else {
            console.error('Import failed:', error);
        }

        process.exitCode = 1;
    } finally {
        process.off('SIGINT', onAbort);
    }
}



// START APPLICATION


main().catch(console.error);
