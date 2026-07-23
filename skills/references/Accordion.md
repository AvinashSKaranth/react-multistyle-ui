# Accordion

Collapsible sections.

```tsx
interface AccordionItem { id: string; title: string; content: string; }

interface AccordionProps {
  style?: string;
  theme?: string;
  items?: AccordionItem[];
}
```

### Usage

```tsx
<Accordion
  items={[
    { id: "faq1", title: "What is this?", content: "A UI library." },
    { id: "faq2", title: "How do I use it?", content: "Import and style it." },
  ]}
/>
```
