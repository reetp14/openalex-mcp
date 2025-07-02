import { EntityType } from "../types.js";

export async function getFilterableFields(args: any) {
    const { entity_type } = args as { entity_type: EntityType | string };
    let fields: any[] = [];
    switch (entity_type) {
        case "works":
            fields = [
                // Attribute Filters from Work object
                { name: "authorships.author.id", type: "string", category: "attribute", description: "OpenAlex ID of an author." },
                { name: "authorships.author.orcid", type: "string", category: "attribute", description: "ORCID of an author." },
                { name: "authorships.countries", type: "string", category: "attribute", description: "Country codes associated with author affiliations." },
                { name: "authorships.institutions.id", type: "string", category: "attribute", description: "OpenAlex ID of an author's institution." },
                { name: "apc_paid.value_usd", type: "number", category: "attribute", description: "APC paid value in USD." },
                { name: "best_oa_location.license", type: "string", category: "attribute", description: "License of the best OA location." },
                { name: "biblio.volume", type: "string", category: "attribute", description: "Volume number." },
                { name: "cited_by_count", type: "integer", category: "attribute", description: "Total number of times this work has been cited." },
                { name: "concepts.id", type: "string", category: "attribute", description: "OpenAlex ID of an associated concept/topic." },
                { name: "doi", type: "string", category: "attribute", description: "Digital Object Identifier of the work." },
                { name: "has_fulltext", type: "boolean", category: "attribute", description: "Indicates if full text is available via OpenAlex." },
                { name: "ids.openalex", type: "string", category: "attribute", description: "OpenAlex ID of the work." },
                { name: "ids.pmid", type: "string", category: "attribute", description: "PubMed ID of the work." },
                { name: "is_paratext", type: "boolean", category: "attribute", description: "Indicates if the work is paratext (e.g., cover, table of contents)." },
                { name: "is_retracted", type: "boolean", category: "attribute", description: "Indicates if the work has been retracted." },
                { name: "language", type: "string", category: "attribute", description: "Language code of the work." },
                { name: "locations.is_oa", type: "boolean", category: "attribute", description: "Indicates if a specific location is Open Access." },
                { name: "open_access.is_oa", type: "boolean", category: "attribute", description: "Overall Open Access status of the work." },
                { name: "open_access.oa_status", type: "string", category: "attribute", description: "OA status (e.g., gold, green, hybrid)." },
                { name: "primary_location.source.id", type: "string", category: "attribute", description: "OpenAlex ID of the primary hosting source." },
                { name: "publication_year", type: "integer", category: "attribute", description: "Year of publication." },
                { name: "publication_date", type: "date", category: "attribute", description: "Full publication date (YYYY-MM-DD)." },
                { name: "type", type: "string", category: "attribute", description: "Type of the work (e.g., article, book)." },
                // Convenience Filters for Works
                { name: "abstract.search", type: "string", category: "convenience", description: "Full-text search within the work's abstract." },
                { name: "authors_count", type: "integer", category: "convenience", description: "Number of authors for the work." },
                { name: "cited_by", type: "string", category: "convenience", description: "OpenAlex ID of a work that this work cites (outgoing citations)." },
                { name: "cites", type: "string", category: "convenience", description: "OpenAlex ID of a work that cites this work (incoming citations)." },
                { name: "display_name.search", type: "string", category: "convenience", description: "Full-text search within the work's title (alias: title.search)." },
                { name: "from_publication_date", type: "date", category: "convenience", description: "Filter for works published on or after this date." },
                { name: "to_publication_date", type: "date", category: "convenience", description: "Filter for works published on or before this date." },
                { name: "has_abstract", type: "boolean", category: "convenience", description: "Indicates if the work has an abstract." },
                { name: "has_doi", type: "boolean", category: "convenience", description: "Indicates if the work has a DOI." },
            ];
            break;
        case "authors":
            fields = [ { name: "orcid", type: "string", category: "attribute", description: "Author's ORCID iD." }, { name: "display_name.search", type: "string", category: "convenience", description: "Search by author's display name."} /* ... more author filters ... */ ];
            break;
        case "sources":
            fields = [ { name: "issn", type: "string", category: "attribute", description: "Source's ISSN." }, { name: "is_oa", type: "boolean", category: "attribute", description: "If the source is fully OA."} /* ... more source filters ... */ ];
            break;
        case "institutions":
            fields = [ { name: "ror", type: "string", category: "attribute", description: "Institution's ROR ID." }, { name: "country_code", type: "string", category: "attribute", description: "Institution's country code."} /* ... more institution filters ... */ ];
            break;
        case "topics":
            fields = [ { name: "domain.id", type: "string", category: "attribute", description: "ID of the topic's domain." }, { name: "display_name.search", type: "string", category: "convenience", description: "Search by topic's display name."} /* ... more topic filters ... */ ];
            break;
        case "publishers":
            fields = [ { name: "country_codes", type: "string", category: "attribute", description: "Publisher's country codes." }, { name: "display_name.search", type: "string", category: "convenience", description: "Search by publisher's display name."} /* ... more publisher filters ... */ ];
            break;
        case "funders":
            fields = [ { name: "country_code", type: "string", category: "attribute", description: "Funder's country code." }, { name: "display_name.search", type: "string", category: "convenience", description: "Search by funder's display name."} /* ... more funder filters ... */ ];
            break;
        default:
            throw new Error(`Unknown entity_type for get_filterable_fields: ${entity_type}`);
    }
    return {
        content: [{
            type: "text",
            text: JSON.stringify(fields, null, 2)
        }]
    };
}