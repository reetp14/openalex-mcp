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
import dotenv from "dotenv";

// Import tool handlers
import { searchWorks } from "./tools/searchWorks.js";
import { searchAuthors } from "./tools/searchAuthors.js";
import { searchSources } from "./tools/searchSources.js";
import { searchInstitutions } from "./tools/searchInstitutions.js";
import { searchTopics } from "./tools/searchTopics.js";
import { searchPublishers } from "./tools/searchPublishers.js";
import { searchFunders } from "./tools/searchFunders.js";
import { getEntity } from "./tools/getEntity.js";
import { autocomplete } from "./tools/autocomplete.js";
import { classifyText } from "./tools/classifyText.js";
import { getFilterableFields } from "./tools/getFilterableFields.js";

// Load environment variables
dotenv.config();

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
                name: "search_works",
                description: "Search scholarly works in OpenAlex",
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
                        bearer_token: { type: "string", description: "Bearer token for authentication" },
                        view: { type: "string", "enum": ["summary", "full"], description: "The view of the data to return. 'summary' returns a concise version, 'full' returns the complete object." }
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
                name: "autocomplete",
                description: "Type ahead search across any OpenAlex entity type",
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
            case "search_works":
                return await searchWorks(args);
            case "search_authors":
                return await searchAuthors(args);
            case "search_sources":
                return await searchSources(args);
            case "search_institutions":
                return await searchInstitutions(args);
            case "search_topics":
                return await searchTopics(args);
            case "search_publishers":
                return await searchPublishers(args);
            case "search_funders":
                return await searchFunders(args);
            case "get_entity":
                return await getEntity(args);
            case "autocomplete":
                return await autocomplete(args);
            case "classify_text":
                return await classifyText(args);
            case "get_filterable_fields":
                return await getFilterableFields(args);
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
