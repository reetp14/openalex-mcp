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
  type_crossref?: string;
  authorships: Authorship[];
  concepts: TopicScore[];
  
  // Location and access information
  primary_location?: Location;
  locations: Location[];
  locations_count?: number;
  best_oa_location?: Location;
  open_access: OpenAccess;
  
  // Citation and relationship data
  referenced_works: string[];
  related_works: string[];
  cited_by_api_url: string;
  counts_by_year: YearCount[];
  
  // Content and indexing
  abstract_inverted_index?: { [word: string]: number[] };
  language?: string;
  has_fulltext?: boolean;
  fulltext_origin?: string;
  
  // Bibliographic information
  biblio?: Biblio;
  
  // Article Processing Charges
  apc_list?: APCInfo;
  apc_paid?: APCInfo;
  
  // Quality and status indicators
  is_paratext?: boolean;
  is_retracted?: boolean;
  fwci?: number; // Field-Weighted Citation Impact
  
  // Identifiers
  ids?: WorkIdentifiers;
  
  // Indexing information
  indexed_in?: string[];
  
  // Keywords
  keywords?: Keyword[];
  
  // Grants and funding
  grants?: Grant[];
  
  // Author and institution counts
  countries_distinct_count?: number;
  institutions_distinct_count?: number;
  
  // Corresponding authors
  corresponding_author_ids?: string[];
  corresponding_institution_ids?: string[];
  
  // Topics and research areas
  primary_topic?: EmbeddedTopicInfo;
  topics?: EmbeddedTopicInfo[];
  
  // Sustainable Development Goals
  sustainable_development_goals?: SustainableDevelopmentGoal[];
  
  // Timestamps
  updated_date: string;
  created_date: string;
}

// Authors (researchers and creators)
export interface Author extends OpenAlexEntity {
  orcid?: string;
  last_known_institution?: InstitutionSummary; // Assuming InstitutionSummary is more appropriate here
  affiliations: Affiliation[];
  x_concepts: TopicScore[]; // Note: to be deprecated
  concepts?: TopicScore[]; // Added for future compatibility
  counts_by_year: YearCount[];
  summary_stats: {
    "2yr_mean_citedness": number | null;
    h_index: number | null;
    i10_index: number | null;
  };
  ids?: AuthorIdentifiers;
  scopus_id?: number; // Renamed from 'scopus' for clarity and consistency
}

export interface AuthorIdentifiers {
  openalex?: string;
  orcid?: string;
  scopus?: string; // Scopus ID as string, often includes prefix
  mag?: string;
}

// Summary for last_known_institution to avoid circular dependencies if full Institution is used
export interface InstitutionSummary {
  id: string;
  display_name: string;
  ror?: string;
  country_code?: string;
  type?: string;
  lineage?: string[];
}

// Sources (journals, conferences, repositories)
export interface Source extends OpenAlexEntity {
  ids?: SourceIdentifiers;
  issn_l?: string;
  issn?: string[] | null; // Can be null
  host_organization?: string; // This is an ID (Publisher or Institution)
  host_organization_name?: string;
  host_organization_lineage?: string[];
  publisher?: string; // Publisher ID, for exact match
  type: string;
  homepage_url?: string;
  apc_prices?: APCPrice[];
  apc_usd?: number | null;
  country_code?: string | null;
  societies?: Society[];
  alternate_titles?: string[];
  abbreviated_title?: string;
  is_oa?: boolean;
  is_in_doaj?: boolean;
  is_core?: boolean;
  counts_by_year: YearCount[];
  x_concepts: TopicScore[]; // Note: to be deprecated
  concepts?: TopicScore[]; // Added for future compatibility
  summary_stats: {
    "2yr_mean_citedness": number | null;
    h_index: number | null;
    i10_index: number | null;
  };
}

export interface SourceIdentifiers {
  openalex?: string;
  issn_l?: string;
  issn?: string[];
  mag?: string;
  fatcat?: string; // Another ID system for sources
}

// Institutions (universities, hospitals, labs)
export interface Institution extends OpenAlexEntity {
  ids?: InstitutionIdentifiers;
  ror?: string;
  country_code: string; // Already present, ensure it's filterable
  type: string; // Already present, ensure it's filterable
  lineage?: string[]; // Array of OpenAlex Institution IDs
  homepage_url?: string;
  image_url?: string;
  image_thumbnail_url?: string;
  display_name_acronyms?: string[];
  display_name_alternatives?: string[];
  geo: Geo;
  international: International;
  associated_institutions: AssociatedInstitution[]; // Relationship to other institutions
  repositories?: RepositoryInfo[]; // Repositories hosted by this institution
  is_super_system?: boolean; // New field from documentation
  counts_by_year: YearCount[];
  x_concepts: TopicScore[]; // Note: to be deprecated
  concepts?: TopicScore[]; // Added for future compatibility
  summary_stats: {
    "2yr_mean_citedness": number | null;
    h_index: number | null;
    i10_index: number | null;
  };
}

export interface InstitutionIdentifiers {
  openalex?: string;
  ror?: string;
  grid?: string; // Another common ID for institutions
  mag?: string;
}

export interface RepositoryInfo {
  id: string; // OpenAlex ID of the repository (a Source)
  display_name?: string;
  host_organization?: string; // OpenAlex ID of the institution hosting the repository
  host_organization_lineage?: string[]; // Lineage of the host_organization
}

// Topics (formerly Concepts)
export interface Topic extends OpenAlexEntity {
  ids?: TopicIdentifiers;
  wikidata?: string;
  level: number;
  description?: string;
  image_url?: string;
  image_thumbnail_url?: string;
  international: International;
  ancestors: MinimalTopic[]; // Renamed from MinimalConcept
  related_topics: MinimalTopic[]; // Renamed from related_concepts and MinimalConcept
  domain?: TopicDomainFieldStructure; // Renamed for clarity
  field?: TopicDomainFieldStructure;  // Renamed for clarity
  subfield?: TopicDomainFieldStructure; // Renamed for clarity
  counts_by_year: YearCount[];
  summary_stats: {
    "2yr_mean_citedness": number;
    h_index: number;
    i10_index: number;
  };
}

export interface TopicIdentifiers { // Renamed from ConceptIdentifiers
  openalex?: string;
  wikidata?: string;
  mag?: string;
}

export interface TopicDomainFieldStructure { // Renamed from TopicDomainField
  id: string;
  display_name?: string;
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
  affiliations?: {
    institution_ids?: string[];
  };
}

export interface TopicScore { // Renamed from ConceptScore
  id: string;
  wikidata?: string;
  display_name: string;
  level: number;
  score: number;
}

export interface Location {
  is_oa: boolean;
  is_accepted?: boolean;
  is_published?: boolean;
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
  institution: InstitutionSummary; // Changed from MinimalInstitution
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
  host_organization_lineage?: string[];
  is_core?: boolean;
  is_in_doaj?: boolean;
  type: string;
}

export interface MinimalTopic { // Renamed from MinimalConcept
  id: string;
  wikidata?: string;
  display_name: string;
  level: number;
}
// Additional Work-related interfaces

export interface Biblio {
  first_page?: string;
  last_page?: string;
  issue?: string;
  volume?: string;
}

export interface APCInfo {
  value?: number;
  currency?: string;
  provenance?: string;
  value_usd?: number;
}

export interface WorkIdentifiers {
  openalex?: string;
  doi?: string;
  mag?: string;
  pmid?: string;
  pmcid?: string;
}

export interface Keyword {
  keyword: string;
}

export interface Grant {
  funder?: string;
  funder_display_name?: string;
  award_id?: string;
}

export interface EmbeddedTopicInfo { // Renamed from the conflicting Topic interface
  id: string;
  display_name?: string;
  score?: number;
  subfield?: {
    id: string;
    display_name?: string;
  };
  field?: {
    id: string;
    display_name?: string;
  };
  domain?: {
    id: string;
    display_name?: string;
  };
}

export interface SustainableDevelopmentGoal {
  id: string;
  display_name?: string;
  score?: number;
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