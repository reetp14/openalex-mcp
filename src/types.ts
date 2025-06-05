/**
 * TypeScript type definitions for OpenAlex API entities and responses
 */

// Base OpenAlex entity interface
export interface OpenAlexEntity {
  id: string;
  display_name: string;
  works_count: number;
  cited_by_count: number;
  created_date: string;
  updated_date: string;
}

// Works (scholarly articles, preprints, datasets, books)
export interface Work extends OpenAlexEntity {
  doi?: string;
  title?: string;
  publication_year?: number;
  publication_date?: string;
  type: string;
  authorships: Authorship[];
  concepts: ConceptScore[];
  primary_location?: Location;
  locations: Location[];
  best_oa_location?: Location;
  open_access: OpenAccess;
  referenced_works: string[];
  related_works: string[];
  abstract_inverted_index?: { [word: string]: number[] };
  cited_by_api_url: string;
  counts_by_year: YearCount[];
  updated_date: string;
  created_date: string;
}

// Authors (researchers and creators)
export interface Author extends OpenAlexEntity {
  orcid?: string;
  last_known_institution?: Institution;
  affiliations: Affiliation[];
  x_concepts: ConceptScore[];
  counts_by_year: YearCount[];
  summary_stats: {
    "2yr_mean_citedness": number;
    h_index: number;
    i10_index: number;
  };
}

// Sources (journals, conferences, repositories)
export interface Source extends OpenAlexEntity {
  issn_l?: string;
  issn?: string[];
  host_organization?: string;
  host_organization_name?: string;
  host_organization_lineage?: string[];
  type: string;
  homepage_url?: string;
  apc_prices?: APCPrice[];
  apc_usd?: number;
  country_code?: string;
  societies?: Society[];
  alternate_titles?: string[];
  abbreviated_title?: string;
  counts_by_year: YearCount[];
  x_concepts: ConceptScore[];
  summary_stats: {
    "2yr_mean_citedness": number;
    h_index: number;
    i10_index: number;
  };
}

// Institutions (universities, hospitals, labs)
export interface Institution extends OpenAlexEntity {
  ror?: string;
  country_code: string;
  type: string;
  homepage_url?: string;
  image_url?: string;
  image_thumbnail_url?: string;
  display_name_acronyms?: string[];
  display_name_alternatives?: string[];
  geo: Geo;
  international: International;
  associated_institutions: AssociatedInstitution[];
  counts_by_year: YearCount[];
  x_concepts: ConceptScore[];
  summary_stats: {
    "2yr_mean_citedness": number;
    h_index: number;
    i10_index: number;
  };
}

// Concepts (hierarchical research topics)
export interface Concept extends OpenAlexEntity {
  wikidata?: string;
  level: number;
  description?: string;
  image_url?: string;
  image_thumbnail_url?: string;
  international: International;
  ancestors: MinimalConcept[];
  related_concepts: MinimalConcept[];
  counts_by_year: YearCount[];
  summary_stats: {
    "2yr_mean_citedness": number;
    h_index: number;
    i10_index: number;
  };
}

// Publishers (publishing organizations)
export interface Publisher extends OpenAlexEntity {
  alternate_titles?: string[];
  country_codes?: string[];
  hierarchy_level: number;
  parent_publisher?: string;
  sources_api_url: string;
  counts_by_year: YearCount[];
  summary_stats: {
    "2yr_mean_citedness": number;
    h_index: number;
    i10_index: number;
  };
}

// Funders (grant-making bodies)
export interface Funder extends OpenAlexEntity {
  alternate_titles?: string[];
  country_code?: string;
  description?: string;
  homepage_url?: string;
  image_url?: string;
  image_thumbnail_url?: string;
  grants_api_url: string;
  counts_by_year: YearCount[];
  summary_stats: {
    "2yr_mean_citedness": number;
    h_index: number;
    i10_index: number;
  };
}

// Supporting interfaces
export interface Authorship {
  author_position: string;
  author: MinimalAuthor;
  institutions: MinimalInstitution[];
  countries: string[];
  is_corresponding: boolean;
  raw_author_name: string;
  raw_affiliation_strings: string[];
}

export interface ConceptScore {
  id: string;
  wikidata?: string;
  display_name: string;
  level: number;
  score: number;
}

export interface Location {
  is_oa: boolean;
  landing_page_url?: string;
  pdf_url?: string;
  source?: MinimalSource;
  license?: string;
  version?: string;
  host_type?: string;
}

export interface OpenAccess {
  is_oa: boolean;
  oa_type?: string;
  oa_url?: string;
  any_repository_has_fulltext: boolean;
}

export interface YearCount {
  year: number;
  works_count: number;
  cited_by_count: number;
}

export interface Affiliation {
  institution: MinimalInstitution;
  years: number[];
}

export interface APCPrice {
  price: number;
  currency: string;
}

export interface Society {
  url: string;
  organization: string;
}

export interface Geo {
  city: string;
  geonames_city_id?: number;
  region?: string;
  country_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface International {
  display_name: { [language: string]: string };
}

export interface AssociatedInstitution {
  id: string;
  display_name: string;
  ror?: string;
  country_code: string;
  type: string;
  relationship: string;
}

// Minimal entity interfaces for references
export interface MinimalAuthor {
  id: string;
  display_name: string;
  orcid?: string;
}

export interface MinimalInstitution {
  id: string;
  display_name: string;
  ror?: string;
  country_code: string;
  type: string;
}

export interface MinimalSource {
  id: string;
  display_name: string;
  issn_l?: string;
  issn?: string[];
  host_organization?: string;
  type: string;
}

export interface MinimalConcept {
  id: string;
  wikidata?: string;
  display_name: string;
  level: number;
}

// API Response interfaces
export interface OpenAlexResponse<T> {
  meta: {
    count: number;
    db_response_time_ms: number;
    page?: number;
    per_page?: number;
    next_cursor?: string;
  };
  results: T[];
}

export interface GroupedResponse {
  meta: {
    count: number;
    db_response_time_ms: number;
  };
  group_by: string;
  groups: Array<{
    key: string;
    key_display_name?: string;
    count: number;
  }>;
}

export interface AutocompleteResult {
  id: string;
  display_name: string;
  hint?: string;
  cited_by_count?: number;
  works_count?: number;
  entity_type: string;
  external_id?: string;
}

export interface TextClassificationResult {
  predicted_concepts: Array<{
    id: string;
    display_name: string;
    score: number;
    level: number;
  }>;
}

// Query parameter types
export interface OpenAlexQueryParams {
  search?: string;
  filter?: string;
  sort?: string;
  page?: number;
  per_page?: number;
  cursor?: string;
  group_by?: string;
  select?: string;
  sample?: number;
  seed?: number;
  mailto?: string;
  api_key?: string;
  bearer_token?: string;
}

export type EntityType = 'works' | 'authors' | 'sources' | 'institutions' | 'concepts' | 'publishers' | 'funders';

// Filter operators for type safety
export type FilterOperator = 
  | 'eq'     // equals (default)
  | 'ne'     // not equals (use ! prefix)
  | 'gt'     // greater than (use > prefix)
  | 'gte'    // greater than or equal (use >= prefix)
  | 'lt'     // less than (use < prefix)
  | 'lte'    // less than or equal (use <= prefix)
  | 'range'; // range (use - separator)

// Sort directions
export type SortDirection = 'asc' | 'desc';

// Common concept IDs for reference
export const CONCEPT_IDS = {
  COMPUTER_SCIENCE: 'C41008148',
  BIOLOGY: 'C86803240',
  MEDICINE: 'C71924100',
  MATHEMATICS: 'C33923547',
  PHYSICS: 'C121332964',
  CHEMISTRY: 'C185592680',
  PSYCHOLOGY: 'C15744967',
  ECONOMICS: 'C162324750',
  ENGINEERING: 'C127413603',
  MATERIALS_SCIENCE: 'C192562407'
} as const;

// Common institution ROR IDs
export const INSTITUTION_RORS = {
  HARVARD: 'I136199984',
  MIT: 'I27837315',
  STANFORD: 'I97018004',
  OXFORD: 'I90456067',
  CAMBRIDGE: 'I28634707'
} as const;