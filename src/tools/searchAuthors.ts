import { makeOpenAlexRequest } from "../utils.js";

export async function searchAuthors(args: any) {
    return {
        content: [{
                type: "text",
                text: JSON.stringify(await makeOpenAlexRequest("/authors", args), null, 2)
            }]
    };
}