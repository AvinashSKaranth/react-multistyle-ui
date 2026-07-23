import "./sortablelist-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { HTMLAttributes, ReactNode } from "react";

export interface SortableItem {
  id: string | number;
  [key: string]: unknown;
}

export interface SortableListProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "children"> {
  style?: string;
  theme?: string;
  items?: SortableItem[];
  onItemsChange?: (v: SortableItem[]) => void;
  onUpdate?: (v: SortableItem[]) => void;
  type?: string;
  direction?: "vertical" | "horizontal";
  children?: (item: SortableItem, index: number) => ReactNode;
}

function SortableRow({
  item,
  index,
  direction,
  type,
  render,
}: {
  item: SortableItem;
  index: number;
  direction: "vertical" | "horizontal";
  type: string;
  render: (item: SortableItem, index: number) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: String(item.id),
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  } as React.CSSProperties;
  return (
    <div ref={setNodeRef} style={style}>
      <div className="s-sortablelist-item" data-item-id={item.id} data-container-type={type}>
        <button
          type="button"
          className="dnd-handle s-sortablelist-handle"
          aria-label="Drag to reorder"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </button>
        <div className="s-sortablelist-content">{render(item, index)}</div>
      </div>
    </div>
  );
}

export function SortableList({
  style,
  theme,
  items = [],
  onItemsChange,
  onUpdate,
  type = "item",
  direction = "vertical",
  className = "",
  children,
  ...rest
}: SortableListProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => String(i.id) === String(active.id));
    const newIndex = items.findIndex((i) => String(i.id) === String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    const next = arrayMove(items, oldIndex, newIndex);
    onItemsChange?.(next);
    onUpdate?.(next);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map((i) => String(i.id))}
        strategy={direction === "horizontal" ? horizontalListSortingStrategy : verticalListSortingStrategy}
      >
        <div
          className={cn(
            "s-sortablelist",
            direction === "horizontal" ? "s-sortablelist-horizontal" : "s-sortablelist-vertical",
            `s-sortablelist-${st}`,
            `theme-${th}`,
            className
          )}
          {...rest}
        >
          {items.map((item, index) => (
            <SortableRow key={item.id} item={item} index={index} direction={direction} type={type} render={children || (() => null)} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}