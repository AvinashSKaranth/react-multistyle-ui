# Row

Flex row layout container.

```tsx
interface RowProps {
  style?: string;
  theme?: string;
  gap?: string;        // CSS gap value (e.g. "8px", "1rem")
  align?: string;      // align-items
  justify?: string;    // justify-content
  wrap?: boolean;
}
```

### Usage

```tsx
<Row gap="16px" align="center" justify="space-between">
  <div>Left</div>
  <div>Right</div>
</Row>
<Row gap="8px" wrap>
  {items.map(i => <Chip key={i}>{i}</Chip>)}
</Row>
```
