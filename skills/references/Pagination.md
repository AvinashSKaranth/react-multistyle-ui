# Pagination

Page number navigation.

```tsx
interface PaginationProps {
  style?: string;
  theme?: string;
  total?: number;       // total items
  perPage?: number;     // items per page
  page?: number;        // current page (1-indexed)
  onPageChange?: (p: number) => void;
}
```

### Usage

```tsx
<Pagination total={100} perPage={10} page={currentPage} onPageChange={setPage} />
```
