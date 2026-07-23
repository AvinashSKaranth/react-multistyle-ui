# Breadcrumb

Breadcrumb trail with clickable links and current page.

```tsx
interface BreadcrumbItem { label: string; href?: string; }

interface BreadcrumbProps {
  style?: string;
  theme?: string;
  items?: BreadcrumbItem[];
}
```

### Usage

```tsx
<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Details" },              // no href = current page
  ]}
/>
```
