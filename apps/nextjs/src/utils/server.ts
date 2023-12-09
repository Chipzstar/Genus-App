"use server"

import fs from "fs/promises";

export async function readUniversities() {
    // Read the file
    let data = await fs.readFile('universities.txt', 'utf-8');
    let lines = data.split('\n').map(line => line.trim()); // Remove the newline character from each line

    // Now 'lines' is an array containing each line in the file
    console.log(lines)
    return lines;
}
