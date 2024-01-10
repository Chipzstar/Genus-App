import {protectedProcedure, publicProcedure, createTRPCRouter} from "../trpc";
import fs from "fs/promises";
import path from 'path';
import * as process from "process";

export const authRouter = createTRPCRouter({
    getSession: publicProcedure.query(({ctx}) => {
        return ctx.auth.session;
    }),
    getSecretMessage: protectedProcedure.query(() => {
        return "you can see this secret message!";
    }),
    getUniversities: publicProcedure.query(async () => {
        try {
            let file = await path.join(process.cwd(), 'assets', 'universities.txt')
            console.log("File path:", file)
            let data = await fs.readFile(file, 'utf-8');
            let lines = data.split('\n').map(line => line.trim()); // Remove the newline character from each line
            // Now 'lines' is an array containing each line in the file
            // console.log(lines)
            // return ['University of Sussex', 'University College London', 'University of Bath'];
            return lines;
        } catch (err) {
            console.error(err)
            // @ts-ignore
            return []
        }
    }),
});
