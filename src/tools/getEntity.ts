import { makeOpenAlexRequest } from "../utils.js";

export async function getEntity(args: any) {
    const { entity_type, openalex_id, select, mailto } = args;
    const params: Record<string, any> = {};
    if (select)
        params.select = select;
    if (mailto)
        params.mailto = mailto;
    return {
        content: [{
                type: "text",
                text: JSON.stringify(await makeOpenAlexRequest(`/${entity_type}/${openalex_id}`, params), null, 2)
            }]
    };
}