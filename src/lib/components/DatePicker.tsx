import "./datepicker-styles.css";
import { useDefaults, iconClass } from "../config";
import { cn } from "../utils/cn";
import { Portal } from "../actions/portal";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useId, useRef, useState } from "react";
import type { HTMLAttributes } from "react";

dayjs.extend(customParseFormat);

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  format?: string;
  displayFormat?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  locale?: string;
  className?: string;
}

function toDayjsFmt(f: string) {
  return f.replace(/hh/g, "HH");
}
function fmt(date: Date, f: string) {
  return dayjs(date).format(toDayjsFmt(f));
}
function parseDate(str: string, f: string) {
  const d = dayjs(str, toDayjsFmt(f));
  return d.isValid() ? d.toDate() : null;
}

export function DatePicker({
  style,
  theme,
  value = "",
  onValueChange,
  format = "YYYY-MM-DD",
  displayFormat,
  label = "",
  placeholder = "",
  disabled = false,
  min,
  max,
  locale = "en-US",
  className = "",
  ...rest
}: DatePickerProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const uid = useId();
  const internalId = `dp-${uid}`;
  const dispFormat = displayFormat ?? format;

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"date" | "month" | "year">("date");
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const wrapperEl = useRef<HTMLDivElement>(null);
  const overlayEl = useRef<HTMLDivElement>(null);

  const displayValue = value ? fmt(parseDate(value, format) || new Date(), dispFormat) : "";
  const inputPlaceholder = placeholder || dispFormat.toLowerCase();

  const floatingLabelStyles = ["material", "material3"];
  const useFloatingLabel = floatingLabelStyles.includes(st) && !!label;
  const useAboveLabel = !floatingLabelStyles.includes(st) && (!!label || !!placeholder);
  const displayLabel = label || placeholder;
  const hasValue = !!value;
  const floated = open || hasValue;

  const minDate = min ? parseDate(min, format) : null;
  const maxDate = max ? parseDate(max, format) : null;

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const decadeStart = Math.floor(viewYear / 12) * 12;
  const decadeEnd = decadeStart + 11;

  const months = Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleString(locale, { month: "short" }));
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2000, 0, i + 2).toLocaleString(locale, { weekday: "short" }));

  function calendarDays(year: number, month: number) {
    const fd = new Date(year, month, 1).getDay();
    const dim = new Date(year, month + 1, 0).getDate();
    const pmd = new Date(year, month, 0).getDate();
    const days: { d: number; o: boolean }[] = [];
    for (let i = fd - 1; i >= 0; i--) days.push({ d: pmd - i, o: true });
    for (let i = 1; i <= dim; i++) days.push({ d: i, o: false });
    let n = 1;
    while (days.length < 42) days.push({ d: n++, o: true });
    return days;
  }
  const calDays = calendarDays(viewYear, viewMonth);
  const yearList = Array.from({ length: 12 }, (_, i) => decadeStart + i);

  function isToday(d: number, o: boolean) {
    if (o) return false;
    const t = new Date();
    return d === t.getDate() && viewMonth === t.getMonth() && viewYear === t.getFullYear();
  }
  function isDisabled(d: number, o: boolean) {
    if (o) return true;
    const dt = new Date(viewYear, viewMonth, d);
    const day = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    const minDay = minDate ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) : null;
    const maxDay = maxDate ? new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate() + 1) : null;
    if (minDay && day < minDay) return true;
    if (maxDay && day >= maxDay) return true;
    return false;
  }
  function isSelected(d: number, o: boolean) {
    if (!selectedDate || o) return false;
    return d === selectedDate.getDate() && viewMonth === selectedDate.getMonth() && viewYear === selectedDate.getFullYear();
  }

  function prev() {
    if (view === "date") setViewDate(new Date(viewYear, viewMonth - 1, 1));
    else if (view === "month") setViewDate(new Date(viewYear - 1, viewMonth, 1));
    else setViewDate(new Date(viewYear - 12, viewMonth, 1));
  }
  function next() {
    if (view === "date") setViewDate(new Date(viewYear, viewMonth + 1, 1));
    else if (view === "month") setViewDate(new Date(viewYear + 1, viewMonth, 1));
    else setViewDate(new Date(viewYear + 12, viewMonth, 1));
  }
  function selectDay(d: number, o: boolean) {
    if (o) return;
    const dt = new Date(viewYear, viewMonth, d);
    if (selectedDate) dt.setHours(selectedDate.getHours(), selectedDate.getMinutes(), selectedDate.getSeconds());
    setSelectedDate(dt);
    onValueChange?.(fmt(dt, format));
    setOpen(false);
  }
  function selectMonth(m: number) {
    setViewDate(new Date(viewYear, m, 1));
    setView("date");
  }
  function selectYear(y: number) {
    setViewDate(new Date(y, viewMonth, 1));
    setView("date");
  }

  function positionOverlay() {
    if (!overlayEl.current || !wrapperEl.current || isMobile) return;
    const rect = wrapperEl.current.getBoundingClientRect();
    const ovW = overlayEl.current.offsetWidth || 320;
    const ovH = overlayEl.current.offsetHeight || 360;
    let left = rect.left;
    const maxLeft = window.innerWidth - ovW - 8;
    if (left > maxLeft) left = maxLeft;
    if (left < 8) left = 8;
    let top = rect.bottom + 4;
    if (top + ovH > window.innerHeight - 8 && rect.top - ovH - 4 > 8) top = rect.top - ovH - 4;
    overlayEl.current.style.position = "fixed";
    overlayEl.current.style.left = `${left}px`;
    overlayEl.current.style.top = `${top}px`;
    overlayEl.current.style.zIndex = "10000";
  }
  function docClick(e: MouseEvent) {
    if (open && wrapperEl.current && !wrapperEl.current.contains(e.target as Node) && !(overlayEl.current && overlayEl.current.contains(e.target as Node))) {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    const reposition = () => positionOverlay();
    document.addEventListener("mousedown", docClick);
    document.addEventListener("touchstart", docClick as never);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    queueMicrotask(reposition);
    return () => {
      document.removeEventListener("mousedown", docClick);
      document.removeEventListener("touchstart", docClick as never);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, isMobile]);

  // Init from value
  useEffect(() => {
    if (value) {
      const d = parseDate(value, format);
      if (d) {
        setSelectedDate(d);
        setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const timeEnabled = /hh|mm|ss/.test(format);
  const showHours = timeEnabled && /hh/.test(format);
  const showMinutes = timeEnabled && /mm/.test(format);
  const showSeconds = timeEnabled && /ss/.test(format);
  const currentHour = selectedDate ? selectedDate.getHours() : 0;
  const currentMinute = selectedDate ? selectedDate.getMinutes() : 0;
  const currentSecond = selectedDate ? selectedDate.getSeconds() : 0;

  function setHour(h: number) {
    const sd = new Date(selectedDate || new Date());
    sd.setHours(Math.min(23, Math.max(0, h)));
    setSelectedDate(sd);
    onValueChange?.(fmt(sd, format));
  }
  function setMinute(m: number) {
    const sd = new Date(selectedDate || new Date());
    sd.setMinutes(Math.min(59, Math.max(0, m)));
    setSelectedDate(sd);
    onValueChange?.(fmt(sd, format));
  }
  function setSecond(s: number) {
    const sd = new Date(selectedDate || new Date());
    sd.setSeconds(Math.min(59, Math.max(0, s)));
    setSelectedDate(sd);
    onValueChange?.(fmt(sd, format));
  }

  return (
    <div
      ref={wrapperEl}
      className={cn(
        "s-datepicker-wrapper",
        `s-datepicker-${st}`,
        `theme-${th}`,
        open && "s-datepicker-open",
        open && "focused",
        floated && "floated",
        hasValue && "has-value",
        disabled && "disabled",
        useAboveLabel && "above-label",
        className
      )}
      {...rest}
    >
      {useAboveLabel ? <label className="s-dp-label-above" htmlFor={internalId}>{displayLabel}</label> : null}
      {useFloatingLabel ? <label className="s-dp-floating-label" htmlFor={internalId}>{label}</label> : null}
      <div className="s-dp-field">
        <input
          id={internalId}
          type="text"
          readOnly
          value={displayValue}
          placeholder={useFloatingLabel ? "" : inputPlaceholder}
          disabled={disabled}
          onFocus={() => { if (!disabled) setOpen(true); }}
          onClick={() => { if (!disabled) setOpen(true); }}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="dialog"
        />
        <span className={`s-datepicker-trigger-icon ${iconClass}`} aria-hidden="true">calendar_today</span>
      </div>

      {open ? (
        <Portal>
          <div
            ref={overlayEl}
            className={`s-datepicker-overlay s-datepicker-${st} theme-${th} ${isMobile ? "s-datepicker-mobile" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="Date picker"
          >
            <div className="s-dp-header">
              <button type="button" className="s-dp-nav-btn" onClick={prev} aria-label="Previous">&lsaquo;</button>
              <div className="s-dp-header-labels">
                {view === "date" ? (
                  <>
                    <button type="button" className="s-dp-header-label" onClick={() => setView("month")}>
                      {new Date(2000, viewMonth, 1).toLocaleString(locale, { month: "long" })}
                    </button>
                    <button type="button" className="s-dp-header-label" onClick={() => setView("year")}>{viewYear}</button>
                  </>
                ) : view === "month" ? (
                  <button type="button" className="s-dp-header-label s-dp-header-label-active" onClick={() => setView("year")}>{viewYear}</button>
                ) : (
                  <span className="s-dp-header-label s-dp-header-label-active">{decadeStart} &ndash; {decadeEnd}</span>
                )}
              </div>
              <button type="button" className="s-dp-nav-btn" onClick={next} aria-label="Next">&rsaquo;</button>
            </div>

            {view === "date" ? (
              <>
                <div className="s-dp-weekdays">
                  {weekdays.map((wd, i) => <span key={i} className="s-dp-weekday">{wd}</span>)}
                </div>
                <div className="s-dp-days-grid">
                  {calDays.map((cd, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`s-dp-day ${cd.o ? "s-dp-day-other" : ""} ${isToday(cd.d, cd.o) ? "s-dp-today" : ""} ${isSelected(cd.d, cd.o) ? "s-dp-selected" : ""} ${isDisabled(cd.d, cd.o) ? "s-dp-day-disabled" : ""}`}
                      onClick={() => selectDay(cd.d, cd.o)}
                      disabled={cd.o || isDisabled(cd.d, cd.o)}
                    >
                      {cd.d}
                    </button>
                  ))}
                </div>
              </>
            ) : view === "month" ? (
              <div className="s-dp-months-grid">
                {months.map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`s-dp-month ${selectedDate && i === selectedDate.getMonth() && viewYear === selectedDate.getFullYear() ? "s-dp-selected" : ""}`}
                    onClick={() => selectMonth(i)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            ) : (
              <div className="s-dp-years-grid">
                {yearList.map((y) => (
                  <button
                    key={y}
                    type="button"
                    className={`s-dp-year ${selectedDate && y === selectedDate.getFullYear() ? "s-dp-selected" : ""}`}
                    onClick={() => selectYear(y)}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}

            {timeEnabled ? (
              <div className="s-dp-time">
                <span className="s-dp-time-label">Time</span>
                <div className="s-dp-time-inputs">
                  {showHours ? (
                    <>
                      <input type="number" className="s-dp-time-input" min={0} max={23} value={currentHour} onChange={(e) => setHour(parseInt(e.target.value) || 0)} aria-label="Hour" />
                      <span className="s-dp-time-sep">:</span>
                    </>
                  ) : null}
                  {showMinutes ? (
                    <input type="number" className="s-dp-time-input" min={0} max={59} value={currentMinute} onChange={(e) => setMinute(parseInt(e.target.value) || 0)} aria-label="Minute" />
                  ) : null}
                  {showSeconds ? (
                    <>
                      <span className="s-dp-time-sep">:</span>
                      <input type="number" className="s-dp-time-input" min={0} max={59} value={currentSecond} onChange={(e) => setSecond(parseInt(e.target.value) || 0)} aria-label="Second" />
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}

            {isMobile ? (
              <button type="button" className="s-dp-done-btn" onClick={() => setOpen(false)}>Done</button>
            ) : null}
          </div>
        </Portal>
      ) : null}
    </div>
  );
}