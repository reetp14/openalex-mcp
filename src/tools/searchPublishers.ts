import { makeOpenAlexRequest } from "../utils.js";

export async function searchPublishers(args: any) {
    return {
        content: [{
                type: "text",
                text: JSON.stringify(await makeOpenAlexRequest("/publishers", args), null, 2)
            }]
    };
}