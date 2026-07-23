# Grid

CSS grid layout container.

```tsx
interface GridProps {
  style?: string;
  theme?: string;
  columns?: number;
  gap?: string;
}
```

### Usage

```tsx
<Grid columns={3} gap="16px">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```
