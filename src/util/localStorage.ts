const FILTERS_KEY = "market_viewer_filter";
const ACTIVE_FILTER_KEY = "market_viewer_filter_active";

type FilterType = {
  id: string;
  name: string;
  assets: string[];
};

/**
 * Get all the filters stored in local storage.
 */
export function getFilters() {
  const filterString = localStorage.getItem(FILTERS_KEY);
  const filters: FilterType[] =
    filterString !== null ? JSON.parse(filterString) : [];

  // Sort the filters before returning.
  return filters.sort((a, b) => {
    if (a.name === b.name) {
      return 0;
    }
    return a.name > b.name ? 1 : -1;
  });
}

/**
 * Get all the filter with the passed filter name from local storage.
 */
export function getFilter(name: string): FilterType | null {
  const filters = getFilters();
  return filters.find((item: FilterType) => item.name === name) ?? null;
}

/**
 * Add a new filter or edit an existing filter in local storage.
 */
export function addFilter(filter: FilterType) {
  const filters = getFilters();
  const filterIndex = filters.findIndex(
    (item: FilterType) => item.id === filter.id
  );

  if (filterIndex > -1) {
    filters.splice(filterIndex, 1, filter);
  } else {
    filters.push(filter);
  }

  localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
}

/**
 * Delete an existing filter from local storage.
 */
export function deleteFilter(filterName: string) {
  const filters = getFilters();
  const filterIndex = filters.findIndex(
    (item: FilterType) => item.name === filterName
  );

  if (filterIndex > -1) {
    filters.splice(filterIndex, 1);
  }

  localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
}

/**
 * Get the current active/selected filter in local storage
 */
export function getActiveFilter(): string | null {
  return localStorage.getItem(ACTIVE_FILTER_KEY);
}

/**
 * Set the current active/selected filter in local storage
 */
export function setActiveFilter(name: string) {
  localStorage.setItem(ACTIVE_FILTER_KEY, name);
}
