import { makeOpenAlexRequest } from "../utils.js";

export async function searchInstitutions(args: any) {
    return {
        content: [{
                type: "text",
                text: JSON.stringify(await makeOpenAlexRequest("/institutions", args), null, 2)
            }]
    };
}