# Card

Container card wrapping children.

```tsx
interface CardProps {
  style?: string;
  theme?: string;
  padding?: "sm" | "md" | "lg" | "none";
  elevated?: boolean;
}
```

### Usage

```tsx
<Card padding="md" elevated>
  <h2>Title</h2>
  <p>Content inside card.</p>
</Card>
<Card padding="none" style="brutalist" theme="storm">
  Full-bleed content
</Card>
```

Applies classes: `s-card`, `s-card-{style}`, `theme-{theme}`, `card-pad-{padding}`, `elevated`.
