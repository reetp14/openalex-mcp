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
                name: "search_works",
                description: "Search scholarly works in OpenAlex",
                inputSchema: {
                    type: "object",
                    properties: {
                        search: { type: "string", description: "Full-text search query" },
                        filter: { type: "string", description: "Boolean filters (e.g., 'concept.id:C12345,from_publication_date:2022-01-01')" },
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
                        filter: { type: "string", description: "Boolean filters" },
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
                        filter: { type: "string", description: "Boolean filters" },
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
                        filter: { type: "string", description: "Boolean filters" },
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
                name: "search_concepts",
                description: "Search research concepts",
                inputSchema: {
                    type: "object",
                    properties: {
                        search: { type: "string", description: "Full-text search query" },
                        filter: { type: "string", description: "Boolean filters" },
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
                        filter: { type: "string", description: "Boolean filters" },
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
                        filter: { type: "string", description: "Boolean filters" },
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
                            enum: ["works", "authors", "sources", "institutions", "concepts", "publishers", "funders"],
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
                description: "Type-ahead search across any OpenAlex entity type",
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
            case "search_concepts":
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(await makeOpenAlexRequest("/concepts", args), null, 2)
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
            case "autocomplete": {
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
