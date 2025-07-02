import { makeOpenAlexRequest } from "../utils.js";

export async function autocomplete(args: any) {
    return {
        content: [{
                type: "text",
                text: JSON.stringify(await makeOpenAlexRequest("/autocomplete", args), null, 2)
            }]
    };
}