import axios from "axios";
import { OpenAlexQueryParams } from "./types.js";

const OPENALEX_BASE_URL = "https://api.openalex.org";

/**
 * Helper function to build query string from parameters
 */
export function buildQueryString(params: Record<string, any>): string {
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
export async function makeOpenAlexRequest(endpoint: string, params: OpenAlexQueryParams = {}): Promise<any> {
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