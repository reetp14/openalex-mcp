import { makeOpenAlexRequest } from "../utils.js";
import { Work } from "../types.js";

export async function searchWorks(args: any) {
    const { view, ...searchArgs } = args;
    if (view === 'summary') {
        // Define the fields for the summary view
        searchArgs.select = 'id,doi,title,publication_year,type,cited_by_count,authorships,concepts,primary_location,open_access,best_oa_location';
        
        const data = await makeOpenAlexRequest("/works", searchArgs);

        // Process the results to create the summary
        const summarizedResults = data.results.map((work: Work) => {
            // Limit authorships
            if (work.authorships && work.authorships.length > 5) {
                work.authorships = work.authorships.slice(0, 5);
            }
            // Limit concepts
            if (work.concepts && work.concepts.length > 3) {
                // Assuming concepts are sorted by score, which is typical.
                // If not, we might need to sort them first.
                work.concepts = work.concepts.slice(0, 3);
            }
            return work;
        });

        return {
            content: [{
                type: "text",
                text: JSON.stringify({ ...data, results: summarizedResults }, null, 2)
            }]
        };
    } else {
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(await makeOpenAlexRequest("/works", args), null, 2)
                }]
        };
    }
}