# Skeleton

Skeleton loading placeholder.

```tsx
interface SkeletonProps {
  style?: string;
  theme?: string;
  width?: string;
  height?: string;
  variant?: "text" | "circular" | "rectangular";
}
```

### Usage

```tsx
<Skeleton variant="text" width="200px" />
<Skeleton variant="circular" width="40px" height="40px" />
<Skeleton variant="rectangular" width="100%" height="120px" />
```
