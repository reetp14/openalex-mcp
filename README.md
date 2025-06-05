# OpenAlex MCP Server

A Model Context Protocol (MCP) server that provides access to the OpenAlex API - a fully open catalog of the global research system covering over 240 million scholarly works.

## Features

This MCP server provides tools to search and retrieve:

- **Works** - Scholarly articles, preprints, datasets, books (240M+ items)
- **Authors** - Researchers and creators with ORCID integration
- **Sources** - Journals, conferences, repositories (~250K venues)
- **Institutions** - Universities, hospitals, labs with ROR matching
- **Concepts** - Hierarchical research topics (levels 0-5)
- **Publishers** - Publishing organizations
- **Funders** - Grant-making bodies
- **Autocomplete** - Type-ahead search across all entity types
- **Text Classification** - Concept prediction for arbitrary text

## Installation

### From npm (Recommended)

```bash
npm install -g openalex-mcp
```

### From Source

```bash
git clone https://github.com/reetp14/openalex-mcp.git
cd openalex-mcp
npm install
npm run build
```

## Usage

### As an MCP Server

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "openalex": {
      "command": "npx",
      "args": ["openalex-mcp"]
    }
  }
}

json



```

Or if installed locally:

```json
{
  "mcpServers": {
    "openalex": {
      "command": "node",
      "args": ["./node_modules/openalex-mcp/build/index.js"]
    }
  }
}
```

### Available Tools

#### Entity Search Tools

All search tools support the full OpenAlex query grammar:

- `search_works` - Search scholarly works
- `search_authors` - Search researchers and creators
- `search_sources` - Search journals, conferences, repositories
- `search_institutions` - Search universities, hospitals, labs
- `search_concepts` - Search research topics
- `search_publishers` - Search publishing organizations
- `search_funders` - Search grant-making bodies

**Common Parameters:**

- `search` - Full-text search query
- `filter` - Boolean filters (e.g., `concept.id:C12345,from_publication_date:2022-01-01`)
- `sort` - Sort field with optional `:desc` (e.g., `cited_by_count:desc`)
- `page`/`per_page` - Standard pagination (max 10,000 results total)
- `cursor` - Deep pagination (use `*` for first call)
- `group_by` - Faceting/aggregation by field
- `select` - Comma-separated fields to return
- `sample` - Random sample size with optional `seed`
- `mailto` - Your email for higher rate limits

#### Single Entity Retrieval

- `get_entity` - Get a single entity by OpenAlex ID
  - `entity_type` - One of: works, authors, sources, institutions, concepts, publishers, funders
  - `openalex_id` - OpenAlex ID (e.g., W2741809807, A1969205038)

#### Utility Tools

- `autocomplete` - Type-ahead search across entity types

  - `search` - Search query (required)
  - `type` - Entity type to search within (optional)
  - `per_page` - Number of suggestions (max 50)

- `classify_text` - Predict research concepts from text
  - `title` - Title text to classify
  - `abstract` - Abstract text to classify

## Examples

### Search for AI papers from 2023

```json
{
  "tool": "search_works",
  "arguments": {
    "search": "artificial intelligence",
    "filter": "from_publication_date:2023-01-01,to_publication_date:2023-12-31",
    "sort": "cited_by_count:desc",
    "per_page": 10,
    "mailto": "researcher@university.edu"
  }
}
```

### Find authors by institution

```json
{
  "tool": "search_authors",
  "arguments": {
    "filter": "last_known_institution.id:I27837315",
    "sort": "works_count:desc",
    "select": "id,display_name,works_count,cited_by_count"
  }
}
```

### Get publication trends by year

```json
{
  "tool": "search_works",
  "arguments": {
    "filter": "concepts.id:C154945302",
    "group_by": "publication_year"
  }
}
```

### Autocomplete journal names

```json
{
  "tool": "autocomplete",
  "arguments": {
    "search": "nature",
    "type": "sources",
    "per_page": 5
  }
}
```

### Classify research text

```json
{
  "tool": "classify_text",
  "arguments": {
    "title": "Deep Learning for Medical Image Analysis",
    "abstract": "We present a novel approach using convolutional neural networks..."
  }
}
```

## Query Grammar Quick Reference

### Filters

- Chain with `,` for AND: `concept.id:C12345,publication_year:2023`
- Chain with `|` for OR: `type:journal|type:repository`
- Negate with `!`: `authors.id!A12345` (exclude author)
- Date ranges: `from_publication_date:2020-01-01,to_publication_date:2023-12-31`

### Sorting

- Ascending: `sort=publication_year`
- Descending: `sort=cited_by_count:desc`
- Multiple: `sort=publication_year:desc,cited_by_count:desc`

### Pagination

- Standard: `page=2&per_page=100` (max 10,000 results)
- Deep: `cursor=*` (first call), then use returned `next_cursor`

### Rate Limits

- Anonymous: 10 requests/second, 100,000/day
- With `mailto`: 100 requests/second, 1,000,000/day

## API Response Format

All tools return the standard OpenAlex JSON envelope:

```json
{
  "meta": {
    "count": 249256387,
    "db_response_time_ms": 12,
    "page": 1,
    "per_page": 25,
    "next_cursor": "ZjEwMD..."
  },
  "results": [
    {
      /* entity object */
    }
  ]
}
```

## Development

```bash
# Watch mode during development
npm run watch

# Test with MCP inspector
npm run inspector

# Run basic functionality test
node test-simple.js
```

## Environment Configuration

The server supports environment variables for configuration. Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
# Edit .env with your settings
```

### Environment Variables

- `OPENALEX_BEARER_TOKEN`: Bearer token for authenticated API access (optional)
- `OPENALEX_DEFAULT_EMAIL`: Default email for rate limiting when no `mailto` parameter provided

## API Access Notes

- **Free Access**: OpenAlex API is free and open
- **Rate Limits**: 10 req/sec (anonymous) or 100 req/sec (with Bearer token or `mailto`)
- **Authentication**: Bearer token automatically loaded from environment
- **Response Size**: Use `select` parameter to limit response size for large datasets

Example with optimized response:

```json
{
  "tool": "search_works",
  "arguments": {
    "search": "machine learning",
    "select": "id,display_name,publication_year,cited_by_count",
    "per_page": 10
  }
}
```

## About OpenAlex

OpenAlex is a fully open catalog of the global research system, named after the ancient Library of Alexandria and created by the nonprofit [OurResearch](https://ourresearch.org/). It provides free, comprehensive metadata about scholarly works, authors, institutions, and more.

- Website: https://openalex.org/
- API Documentation: https://docs.openalex.org/
- Data sources: Crossref, ORCID, ROR, Microsoft Academic Graph, and more
