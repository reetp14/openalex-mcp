import { makeOpenAlexRequest } from "../utils.js";

export async function searchSources(args: any) {
    return {
        content: [{
                type: "text",
                text: JSON.stringify(await makeOpenAlexRequest("/sources", args), null, 2)
            }]
    };
}