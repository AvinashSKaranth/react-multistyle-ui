# Table

Data table with columns and rows.

```tsx
interface TableProps {
  style?: string;
  theme?: string;
  columns?: string[];
  rows?: Record<string, any>[];
  sortable?: boolean;
}
```

### Usage

```tsx
<Table
  columns={["Name", "Age", "Role"]}
  rows={[
    { Name: "Alice", Age: 30, Role: "Admin" },
    { Name: "Bob", Age: 25, Role: "User" },
  ]}
  sortable
/>
```
