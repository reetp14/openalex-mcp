import { makeOpenAlexRequest } from "../utils.js";

export async function searchTopics(args: any) {
    return {
        content: [{
                type: "text",
                text: JSON.stringify(await makeOpenAlexRequest("/topics", args), null, 2)
            }]
    };
}