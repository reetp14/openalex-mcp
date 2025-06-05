#!/usr/bin/env node
/**
 * OpenAlex MCP Server
 *
 * This MCP server provides access to the OpenAlex API, which is a fully open catalog
 * of the global research system. It exposes tools for searching and retrieving:
 * - Works (scholarly articles, preprints, datasets, books)
 * - Authors (researchers and creators)
 * - Sources (journals, conferences, repositories)
 * - Institutions (universities, hospitals, labs)
 * - Concepts (hierarchical research topics)
 * - Publishers (publishing organizations)
 * - Funders (grant-making bodies)
 * - Autocomplete and text classification utilities
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";
import { OpenAlexQueryParams, EntityType } from "./types.js";
// Load environment variables
dotenv.config();
const OPENALEX_BASE_URL = "https://api.openalex.org";
/**
 * Helper function to build query string from parameters
 */
function buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });
    return searchParams.toString();
}
/**
 * Helper function to make OpenAlex API requests
 */
async function makeOpenAlexRequest(endpoint: string, params: OpenAlexQueryParams = {}): Promise<any> {
    const queryString = buildQueryString(params);
    const url = `${OPENALEX_BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
    try {
        // Build User-Agent with mailto for polite pool access
        let userAgent = 'OpenAlex-MCP-Server/1.0.0 (https://github.com/openalex-mcp-server)';
        if (params.mailto) {
            userAgent += ` mailto:${params.mailto}`;
        }
        else {
            // Use environment variable for default email
            const defaultEmail = process.env.OPENALEX_DEFAULT_EMAIL || 'mcp-server@example.com';
            userAgent += ` mailto:${defaultEmail}`;
        }
        // Build headers
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'User-Agent': userAgent
        };
        // Add Bearer token - check parameter first, then environment variable
        const bearerToken = params.bearer_token || process.env.OPENALEX_BEARER_TOKEN;
        if (bearerToken) {
            headers['Authorization'] = `Bearer ${bearerToken}`;
        }
        const response = await axios.get(url, {
            headers,
            timeout: 30000
        });
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`OpenAlex API error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
        }
        throw error;
    }
}
/**
 * Create an MCP server for OpenAlex API access
 */
const server = new Server({
    name: "openalex-mcp",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
/**
 * Handler that lists available tools for OpenAlex API access
 */
(server as any).setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "search_works_detailed",
                description: "Search scholarly works in OpenAlex (used to find nested entities or detailed searches)",
                inputSchema: {
                    type: "object",
                    properties: {
                        search: { type: "string", description: "Full-text search query" },
                        filter: { type: "string", description: "Key:value OpenAlex filters. Supports entity attributes (e.g., 'publication_year', 'is_oa'), IDs, and convenience filters (e.g., 'title.search'). Example: 'is_oa:true,type:journal'" },
                        sort: { type: "string", description: "Sort field with optional :desc (e.g., 'cited_by_count:desc')" },
                        page: { type: "number", description: "Page number (max 10,000 results total)" },
                        per_page: { type: "number", description: "Results per page (max 200)" },
                        cursor: { type: "string", description: "Cursor for deep pagination (use '*' for first call)" },
                        group_by: { type: "string", description: "Group results by field for faceting" },
                        select: { type: "string", description: "Comma-separated list of fields to return" },
                        sample: { type: "number", description: "Random sample size" },
                        seed: { type: "number", description: "Random seed for reproducible sampling" },
                        mailto: { type: "string", description: "Email for rate limits" },
                        api_key: { type: "string", description: "Premium API key" },
                        bearer_token: { type: "string", description: "Bearer token for authentication" }
                    }
                }
            },
            {
                name: "search_authors",
                description: "Search authors and researchers",
                inputSchema: {
                    type: "object",
                    properties: {
                        search: { type: "string", description: "Full-text search query" },
                        filter: { type: "string", description: "Key:value OpenAlex filters. Supports entity attributes (e.g., 'orcid', 'last_known_institution.id'), IDs, and convenience filters (e.g., 'display_name.search'). Example: 'has_orcid:true,last_known_institution.country_code:US'" },
                        sort: { type: "string", description: "Sort field with optional :desc" },
                        page: { type: "number", description: "Page number" },
                        per_page: { type: "number", description: "Results per page (max 200)" },
                        cursor: { type: "string", description: "Cursor for deep pagination" },
                        group_by: { type: "string", description: "Group results by field" },
                        select: { type: "string", description: "Fields to return" },
                        sample: { type: "number", description: "Random sample size" },
                        seed: { type: "number", description: "Random seed" },
                        mailto: { type: "string", description: "Email for rate limits" },
                        api_key: { type: "string", description: "Premium API key" }
                    }
                }
            },
            {
                name: "search_sources",
                description: "Search journals and sources",
                inputSchema: {
                    type: "object",
                    properties: {
                        search: { type: "string", description: "Full-text search query" },
                        filter: { type: "string", description: "Key:value OpenAlex filters. Supports entity attributes (e.g., 'issn', 'country_code', 'is_oa'), IDs, and convenience filters (e.g., 'display_name.search'). Example: 'is_oa:true,type:journal'" },
                        sort: { type: "string", description: "Sort field with optional :desc" },
                        page: { type: "number", description: "Page number" },
                        per_page: { type: "number", description: "Results per page (max 200)" },
                        cursor: { type: "string", description: "Cursor for deep pagination" },
                        group_by: { type: "string", description: "Group results by field" },
                        select: { type: "string", description: "Fields to return" },
                        sample: { type: "number", description: "Random sample size" },
                        seed: { type: "number", description: "Random seed" },
                        mailto: { type: "string", description: "Email for rate limits" },
                        api_key: { type: "string", description: "Premium API key" }
                    }
                }
            },
            {
                name: "search_institutions",
                description: "Search institutions",
                inputSchema: {
                    type: "object",
                    properties: {
                        search: { type: "string", description: "Full-text search query" },
                        filter: { type: "string", description: "Key:value OpenAlex filters. Supports entity attributes (e.g., 'ror', 'country_code', 'type'), IDs, and convenience filters (e.g., 'display_name.search'). Example: 'country_code:US,type:education'" },
                        sort: { type: "string", description: "Sort field with optional :desc" },
                        page: { type: "number", description: "Page number" },
                        per_page: { type: "number", description: "Results per page (max 200)" },
                        cursor: { type: "string", description: "Cursor for deep pagination" },
                        group_by: { type: "string", description: "Group results by field" },
                        select: { type: "string", description: "Fields to return" },
                        sample: { type: "number", description: "Random sample size" },
                        seed: { type: "number", description: "Random seed" },
                        mailto: { type: "string", description: "Email for rate limits" },
                        api_key: { type: "string", description: "Premium API key" }
                    }
                }
            },
            {
                name: "search_topics",
                description: "Search research topics (formerly concepts)",
                inputSchema: {
                    type: "object",
                    properties: {
                        search: { type: "string", description: "Full-text search query" },
                        filter: { type: "string", description: "Key:value OpenAlex filters. Supports entity attributes (e.g., 'domain.id', 'level'), IDs, and convenience filters (e.g., 'display_name.search'). Example: 'domain.id:D1,level:0'" },
                        sort: { type: "string", description: "Sort field with optional :desc" },
                        page: { type: "number", description: "Page number" },
                        per_page: { type: "number", description: "Results per page (max 200)" },
                        cursor: { type: "string", description: "Cursor for deep pagination" },
                        group_by: { type: "string", description: "Group results by field" },
                        select: { type: "string", description: "Fields to return" },
                        sample: { type: "number", description: "Random sample size" },
                        seed: { type: "number", description: "Random seed" },
                        mailto: { type: "string", description: "Email for rate limits" },
                        api_key: { type: "string", description: "Premium API key" }
                    }
                }
            },
            {
                name: "search_publishers",
                description: "Search publishers",
                inputSchema: {
                    type: "object",
                    properties: {
                        search: { type: "string", description: "Full-text search query" },
                        filter: { type: "string", description: "Key:value OpenAlex filters. Supports entity attributes (e.g., 'country_codes', 'hierarchy_level'), IDs, and convenience filters (e.g., 'display_name.search'). Example: 'country_codes:US,hierarchy_level:0'" },
                        sort: { type: "string", description: "Sort field with optional :desc" },
                        page: { type: "number", description: "Page number" },
                        per_page: { type: "number", description: "Results per page (max 200)" },
                        cursor: { type: "string", description: "Cursor for deep pagination" },
                        group_by: { type: "string", description: "Group results by field" },
                        select: { type: "string", description: "Fields to return" },
                        sample: { type: "number", description: "Random sample size" },
                        seed: { type: "number", description: "Random seed" },
                        mailto: { type: "string", description: "Email for rate limits" },
                        api_key: { type: "string", description: "Premium API key" }
                    }
                }
            },
            {
                name: "search_funders",
                description: "Search funders",
                inputSchema: {
                    type: "object",
                    properties: {
                        search: { type: "string", description: "Full-text search query" },
                        filter: { type: "string", description: "Key:value OpenAlex filters. Supports entity attributes (e.g., 'country_code', 'grants_count'), IDs, and convenience filters (e.g., 'display_name.search'). Example: 'country_code:DE,grants_count:>10'" },
                        sort: { type: "string", description: "Sort field with optional :desc" },
                        page: { type: "number", description: "Page number" },
                        per_page: { type: "number", description: "Results per page (max 200)" },
                        cursor: { type: "string", description: "Cursor for deep pagination" },
                        group_by: { type: "string", description: "Group results by field" },
                        select: { type: "string", description: "Fields to return" },
                        sample: { type: "number", description: "Random sample size" },
                        seed: { type: "number", description: "Random seed" },
                        mailto: { type: "string", description: "Email for rate limits" },
                        api_key: { type: "string", description: "Premium API key" }
                    }
                }
            },
            {
                name: "get_entity",
                description: "Get a single entity by its OpenAlex ID",
                inputSchema: {
                    type: "object",
                    properties: {
                        entity_type: {
                            type: "string",
                            enum: ["works", "authors", "sources", "institutions", "topics", "publishers", "funders"],
                            description: "Type of entity to retrieve"
                        },
                        openalex_id: { type: "string", description: "OpenAlex ID (e.g., W2741809807, A1969205038)" },
                        select: { type: "string", description: "Comma-separated list of fields to return" },
                        mailto: { type: "string", description: "Email for rate limits" },
                        api_key: { type: "string", description: "Premium API key" }
                    },
                    required: ["entity_type", "openalex_id"]
                }
            },
            {
                name: "search_basic",
                description: "search across any OpenAlex entity type, (default search unless asket for deatiled search by user)",
                inputSchema: {
                    type: "object",
                    properties: {
                        search: { type: "string", description: "Search query for autocomplete", required: true },
                        type: {
                            type: "string",
                            enum: ["works", "authors", "sources", "institutions", "concepts", "publishers", "funders"],
                            description: "Entity type to search within"
                        },
                        per_page: { type: "number", description: "Number of suggestions (max 50)" },
                        mailto: { type: "string", description: "Email for rate limits" },
                        api_key: { type: "string", description: "Premium API key" }
                    },
                    required: ["search"]
                }
            },
            {
                name: "classify_text",
                description: "Classify arbitrary text to predict research concepts and confidence scores",
                inputSchema: {
                    type: "object",
                    properties: {
                        title: { type: "string", description: "Title text to classify" },
                        abstract: { type: "string", description: "Abstract text to classify" },
                        mailto: { type: "string", description: "Email for rate limits" },
                        api_key: { type: "string", description: "Premium API key" }
                    }
                }
            },
            {
                name: "get_filterable_fields",
                description: "Get a list of filterable field names and their types for a specified OpenAlex entity.",
                inputSchema: {
                    type: "object",
                    properties: {
                        entity_type: {
                            type: "string",
                            enum: ["works", "authors", "sources", "institutions", "topics", "publishers", "funders"],
                            description: "The type of OpenAlex entity for which to retrieve filterable fields."
                        }
                    },
                    required: ["entity_type"]
                }
            }
        ]
    };
});
/**
 * Handler for tool execution
 */
(server as any).setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "search_works_detailed":
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(await makeOpenAlexRequest("/works", args), null, 2)
                        }]
                };
            case "search_authors":
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(await makeOpenAlexRequest("/authors", args), null, 2)
                        }]
                };
            case "search_sources":
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(await makeOpenAlexRequest("/sources", args), null, 2)
                        }]
                };
            case "search_institutions":
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(await makeOpenAlexRequest("/institutions", args), null, 2)
                        }]
                };
            case "search_topics": // Renamed from search_concepts
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(await makeOpenAlexRequest("/topics", args), null, 2) // Endpoint changed to /topics
                        }]
                };
            case "search_publishers":
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(await makeOpenAlexRequest("/publishers", args), null, 2)
                        }]
                };
            case "search_funders":
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(await makeOpenAlexRequest("/funders", args), null, 2)
                        }]
                };
            case "get_entity": {
                const { entity_type, openalex_id, select, mailto } = args as any;
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
            case "search_basic": {
                const params = args;
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(await makeOpenAlexRequest("/autocomplete", params), null, 2)
                        }]
                };
            }
            case "classify_text": {
                const { title, abstract, mailto } = args as any;
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
            case "get_filterable_fields": {
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
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
/**
 * Start the server using stdio transport
 */
async function main() {
    const transport = new StdioServerTransport();
    await (server as any).connect(transport);
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
