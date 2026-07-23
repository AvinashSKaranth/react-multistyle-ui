import "./commandpalette-styles.css";
import { useDefaults, iconClass } from "../config";
import { cn } from "../utils/cn";
import { Portal } from "../actions/portal";
import { Presence } from "../transitions";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HTMLAttributes } from "react";

export interface CommandItem {
  label: string;
  icon?: string;
  shortcut?: string;
  searchTerms?: string[];
  onclick?: () => void;
}
export interface CommandGroup {
  label?: string;
  items: CommandItem[];
}

export interface CommandPaletteProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  groups?: CommandGroup[];
  placeholder?: string;
}

export function CommandPalette({
  style,
  theme,
  open = false,
  onOpenChange,
  groups = [],
  placeholder = "Type a command...",
  className = "",
  ...rest
}: CommandPaletteProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputEl = useRef<HTMLInputElement>(null);
  const bodyEl = useRef<HTMLDivElement>(null);

  const flatItems = useMemo(() => {
    const items: (CommandItem & { _group?: string })[] = [];
    for (const group of groups) for (const item of group.items || []) items.push({ ...item, _group: group.label });
    return items;
  }, [groups]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return flatItems;
    const q = search.toLowerCase();
    return flatItems.filter(
      (item) => item.label?.toLowerCase().includes(q) || item.searchTerms?.some((t) => t.toLowerCase().includes(q))
    );
  }, [flatItems, search]);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    const result: CommandGroup[] = [];
    for (const group of groups) {
      const filtered = group.items.filter(
        (item) => item.label?.toLowerCase().includes(search.toLowerCase()) || item.searchTerms?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      );
      if (filtered.length > 0) result.push({ ...group, items: filtered });
    }
    return result;
  }, [groups, search]);

  const activeLookup = useMemo(() => {
    const map = new Map<string, number>();
    filteredItems.forEach((item, idx) => map.set((item._group || "") + "||" + item.label, idx));
    return map;
  }, [filteredItems]);

  function getActiveIndex(group: CommandGroup, item: CommandItem) {
    return activeLookup.get((group.label || "") + "||" + item.label) ?? -1;
  }
  function handleClose() {
    onOpenChange?.(false);
    setSearch("");
    setActiveIndex(-1);
  }
  function handleItemClick(item: CommandItem) {
    item.onclick?.();
    handleClose();
  }
  function scrollIntoView() {
    if (!bodyEl.current) return;
    const items = bodyEl.current.querySelectorAll<HTMLElement>(".s-cmdk-item");
    if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: "nearest" });
  }
  function handleKeydown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      if (search) { setSearch(""); setActiveIndex(-1); }
      else handleClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filteredItems.length - 1));
      requestAnimationFrame(scrollIntoView);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      requestAnimationFrame(scrollIntoView);
    }
    if (e.key === "Enter" && activeIndex >= 0 && activeIndex < filteredItems.length) {
      e.preventDefault();
      handleItemClick(filteredItems[activeIndex]);
    }
  }

  // Reset index on search change
  useEffect(() => { setActiveIndex(-1); }, [search]);
  // Focus input when opened
  useEffect(() => {
    if (open && inputEl.current) requestAnimationFrame(() => inputEl.current?.focus());
  }, [open]);
  // Global Cmd/Ctrl+K toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange?.(!open);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  return (
    <Portal>
      <Presence show={open} enter="t-fade-enter" exit="t-fade-exit" duration={150} as="div"
        className={cn("s-cmdk-overlay", className)}
        onClick={(e: React.MouseEvent) => { if (e.target === e.currentTarget) handleClose(); }}
        role="dialog" aria-modal="true" aria-label="Command palette" {...rest}>
        <div className={`s-cmdk s-cmdk-${st} theme-${th}`} onKeyDown={handleKeydown}>
          <div className="s-cmdk-input-wrapper">
            <span className="s-cmdk-search-icon">⌘</span>
            <input ref={inputEl} className="s-cmdk-input" type="text" value={search}
              onChange={(e) => setSearch(e.target.value)} placeholder={placeholder} aria-label="Search commands" />
          </div>
          <div ref={bodyEl} className="s-cmdk-body" role="listbox">
            {filteredGroups.length === 0 ? (
              <div className="s-cmdk-empty">No results found</div>
            ) : (
              filteredGroups.map((group, gi) => (
                <div key={gi} className="s-cmdk-group">
                  {group.label ? <div className="s-cmdk-group-label">{group.label}</div> : null}
                  {group.items.map((item, ii) => (
                    <button key={ii}
                      className={`s-cmdk-item ${getActiveIndex(group, item) === activeIndex ? "active" : ""}`}
                      onClick={() => handleItemClick(item)}>
                      {item.icon ? <span className={`s-cmdk-item-icon ${iconClass}`}>{item.icon}</span> : null}
                      <span className="s-cmdk-item-label">{item.label}</span>
                      {item.shortcut ? <span className="s-cmdk-item-shortcut">{item.shortcut}</span> : null}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </Presence>
    </Portal>
  );
}