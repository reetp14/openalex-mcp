# OpenAlex MCP Server Examples

This file contains practical examples of using the OpenAlex MCP server tools.

## Basic Search Examples

### 1. Search for Recent AI Papers

```json
{
  "tool": "search_works",
  "arguments": {
    "search": "artificial intelligence machine learning",
    "filter": "from_publication_date:2023-01-01",
    "sort": "cited_by_count:desc",
    "per_page": 10,
    "select": "id,display_name,publication_year,cited_by_count,authorships",
    "mailto": "your-email@example.com"
  }
}
```

### 2. Find Top Authors in Computer Science

```json
{
  "tool": "search_authors",
  "arguments": {
    "filter": "x_concepts.id:C41008148",
    "sort": "cited_by_count:desc",
    "per_page": 20,
    "select": "id,display_name,cited_by_count,works_count,last_known_institution"
  }
}
```

### 3. Search Nature Journals

```json
{
  "tool": "search_sources",
  "arguments": {
    "search": "nature",
    "filter": "type:journal",
    "sort": "works_count:desc",
    "select": "id,display_name,issn_l,works_count,cited_by_count"
  }
}
```

## Advanced Filtering Examples

### 4. Find COVID-19 Research from Harvard

```json
{
  "tool": "search_works",
  "arguments": {
    "search": "COVID-19 coronavirus SARS-CoV-2",
    "filter": "institutions.id:I136199984,from_publication_date:2020-01-01",
    "sort": "publication_year:desc",
    "group_by": "publication_year"
  }
}
```

### 5. Exclude Self-Citations from Author Search

```json
{
  "tool": "search_authors",
  "arguments": {
    "search": "deep learning neural networks",
    "filter": "works_count:>50,cited_by_count:>1000",
    "sort": "cited_by_count:desc"
  }
}
```

## Aggregation and Analytics Examples

### 6. Publication Trends by Year

```json
{
  "tool": "search_works",
  "arguments": {
    "filter": "concepts.id:C154945302",
    "group_by": "publication_year",
    "mailto": "researcher@university.edu"
  }
}
```

### 7. Top Funding Organizations for Climate Research

```json
{
  "tool": "search_funders",
  "arguments": {
    "search": "climate change environmental",
    "sort": "works_count:desc",
    "per_page": 15,
    "select": "id,display_name,country_code,works_count"
  }
}
```

## Single Entity Retrieval Examples

### 8. Get Specific Work Details

```json
{
  "tool": "get_entity",
  "arguments": {
    "entity_type": "works",
    "openalex_id": "W2741809807",
    "select": "id,title,authorships,concepts,cited_by_count,publication_year"
  }
}
```

### 9. Get Author Profile

```json
{
  "tool": "get_entity",
  "arguments": {
    "entity_type": "authors",
    "openalex_id": "A1969205038"
  }
}
```

## Utility Tool Examples

### 10. Autocomplete for Journal Names

```json
{
  "tool": "autocomplete",
  "arguments": {
    "search": "nature",
    "type": "sources",
    "per_page": 10
  }
}
```

### 11. Classify Research Text

```json
{
  "tool": "classify_text",
  "arguments": {
    "title": "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    "abstract": "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers."
  }
}
```

## Complex Query Examples

### 12. Multi-Institutional Collaboration Analysis

```json
{
  "tool": "search_works",
  "arguments": {
    "filter": "institutions.id:I27837315|I136199984,authorships_count:>5",
    "sort": "cited_by_count:desc",
    "group_by": "institutions.id",
    "per_page": 50
  }
}
```

### 13. Open Access Publications in Specific Field

```json
{
  "tool": "search_works",
  "arguments": {
    "filter": "concepts.id:C41008148,is_oa:true,from_publication_date:2020-01-01",
    "sort": "publication_year:desc",
    "group_by": "open_access.oa_type",
    "select": "id,display_name,open_access,publication_year"
  }
}
```

### 14. Citation Network Analysis

```json
{
  "tool": "search_works",
  "arguments": {
    "filter": "cites:W2741809807",
    "sort": "cited_by_count:desc",
    "per_page": 100,
    "select": "id,display_name,authorships,cited_by_count,publication_year"
  }
}
```

## Pagination Examples

### 15. Deep Pagination for Large Datasets

First call:
```json
{
  "tool": "search_works",
  "arguments": {
    "filter": "concepts.id:C41008148",
    "cursor": "*",
    "per_page": 200,
    "mailto": "bulk-download@university.edu"
  }
}
```

Subsequent calls (use `next_cursor` from previous response):
```json
{
  "tool": "search_works",
  "arguments": {
    "filter": "concepts.id:C41008148",
    "cursor": "IjIwMjMtMDMtMzFUMjM6NTk6NTkuOTk5WiI",
    "per_page": 200
  }
}
```

## Sampling and Reproducibility

### 16. Random Sample with Seed

```json
{
  "tool": "search_works",
  "arguments": {
    "filter": "concepts.id:C154945302,publication_year:2023",
    "sample": 1000,
    "seed": 42,
    "select": "id,display_name,authorships"
  }
}
```

## Performance Tips

1. **Always include `mailto`** for higher rate limits (100 req/sec vs 10 req/sec)
2. **Use `select`** to limit returned fields and reduce response size
3. **Use `cursor` pagination** for datasets > 10,000 results
4. **Use `group_by`** for quick aggregations instead of processing all results
5. **Cache results** when possible - OpenAlex data updates weekly

## Common Filter Patterns

- **By date range**: `from_publication_date:2020-01-01,to_publication_date:2023-12-31`
- **By citation count**: `cited_by_count:>100` or `cited_by_count:10-50`
- **By institution**: `institutions.id:I27837315` or `institutions.country_code:US`
- **By author**: `authorships.author.id:A1969205038`
- **By concept**: `concepts.id:C41008148` (Computer Science)
- **By open access**: `is_oa:true` or `open_access.oa_type:gold`
- **By publication type**: `type:journal-article` or `type:book`
- **Exclude items**: Use `!` prefix, e.g., `authorships.author.id!A1969205038`

## Error Handling

The server will return error messages for common issues:
- Invalid OpenAlex IDs
- Malformed filter syntax  
- Rate limit exceeded
- Network timeouts
- Invalid parameter combinations

Example error response:
```json
{
  "content": [{
    "type": "text", 
    "text": "Error: OpenAlex API error: 400 - Bad Request"
  }],
  "isError": true
}