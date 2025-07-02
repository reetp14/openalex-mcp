import { makeOpenAlexRequest } from "../utils.js";

export async function classifyText(args: any) {
    const { title, abstract, mailto } = args;
    const params: Record<string, any> = {};
    if (title)
        params.title = title;
    if (abstract)
        params.abstract = abstract;
    if (mailto)
        params.mailto = mailto;
    return {
        content: [{
                type: "text",
                text: JSON.stringify(await makeOpenAlexRequest("/text", params), null, 2)
            }]
    };
}