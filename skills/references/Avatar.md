# Avatar

User avatar with image or initials fallback.

```tsx
interface AvatarProps {
  style?: string;
  theme?: string;
  src?: string;
  alt?: string;
  fallback?: string;   // initials when no src / broken image
  size?: "sm" | "md" | "lg";
}
```

### Usage

```tsx
<Avatar src="https://example.com/avatar.jpg" alt="User" />
<Avatar fallback="AK" size="lg" />
<Avatar fallback="JD" size="sm" style="brutalist" />
```
