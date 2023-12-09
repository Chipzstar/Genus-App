import {appRouter, createContext} from "@genus/api";
import {createNextApiHandler} from "@trpc/server/adapters/next";
import {NextApiRequest, NextApiResponse} from "next";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
function setCorsHeaders(res: NextApiResponse) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "*");
}

/*export function OPTIONS() {
    const response = new Response(null, {
        status: 204,
    });
    setCorsHeaders(response);
    return response;
}*/

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    setCorsHeaders(res);
    // Let the tRPC handler do its magic
    return createNextApiHandler({
        router: appRouter,
        createContext,
    })(req, res);
};

export default handler;
