// Mock data for Search Index (Sprint 0 — empty shell, populated in Sprint 5)
interface SearchIndexEntry {
  areaId: string;
  areaName: string;
  roomTypeSlug: string;
  roomTypeName: string;
  searchText: string; // concatenated searchable text
}

export const mockSearchIndex: SearchIndexEntry[] = [];
