# SortableList

Drag-and-drop sortable list via dnd-kit.

```tsx
interface SortableListProps {
  style?: string;
  theme?: string;
  items?: string[];
  onItemsChange?: (items: string[]) => void;
}
```

### Usage

```tsx
<SortableList
  items={["Item A", "Item B", "Item C"]}
  onItemsChange={setItems}
/>
```

Requires `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` peer deps.
