import { makeOpenAlexRequest } from "../utils.js";

export async function searchFunders(args: any) {
    return {
        content: [{
                type: "text",
                text: JSON.stringify(await makeOpenAlexRequest("/funders", args), null, 2)
            }]
    };
}