// Aggregated stylesheet (theme tokens + every component style). Importing the
// package entry pulls this in so consumers can `import 'react-multistyle-ui'`
// and optionally `import 'react-multistyle-ui/style.css'` for the full bundle.
import "./styles.css";

// Global configuration
export { initMultistyleUI, useDefaults, defaults, notifyDefaults, iconClass } from "./config";
export type { Defaults, InitOptions } from "./config";

// Theme system — structured config + CSS generator (runtime API for custom themes)
export {
  themes,
  DEFAULT,
  ocean,
  forest,
  rose,
  midnight,
  gold,
  slate,
  candy,
  storm,
  royal,
  generateThemeCss,
  resolveLight,
  resolveDark,
  applyThemeToElement,
  hexToHsl,
  hslToCss,
  invert,
  invertHex,
  styleFonts,
  fontOptions,
  SYSTEM_FONT,
} from "./themes/index.js";

// Actions
export { Portal } from "./actions/portal";

// Class merge helper (tailwind-merge backed) for overriding component classes
export { cn } from "./utils/cn";

// Form Components
export { SortableList } from "./components/SortableList";
export type { SortableListProps } from "./components/SortableList";
export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";
export { Textarea } from "./components/Textarea";
export type { TextareaProps } from "./components/Textarea";
export { TextEditor } from "./components/TextEditor";
export type { TextEditorProps } from "./components/TextEditor";
export { CodeEditor } from "./components/CodeEditor";
export type { CodeEditorProps } from "./components/CodeEditor";
export { Select } from "./components/Select";
export type { SelectProps } from "./components/Select";
export { MultiSelect } from "./components/MultiSelect";
export type { MultiSelectProps } from "./components/MultiSelect";
export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";
export { Radio } from "./components/Radio";
export type { RadioProps } from "./components/Radio";
export { Toggle } from "./components/Toggle";
export type { ToggleProps } from "./components/Toggle";
export { Slider } from "./components/Slider";
export type { SliderProps } from "./components/Slider";
export { FileUpload } from "./components/FileUpload";
export type { FileUploadProps } from "./components/FileUpload";
export { DatePicker } from "./components/DatePicker";
export type { DatePickerProps } from "./components/DatePicker";
export { DropdownMenu } from "./components/DropdownMenu";
export type { DropdownMenuProps } from "./components/DropdownMenu";

// Layout Components
export { Card } from "./components/Card";
export type { CardProps } from "./components/Card";
export { Divider } from "./components/Divider";
export type { DividerProps } from "./components/Divider";
export { Tabs } from "./components/Tabs";
export type { TabsProps } from "./components/Tabs";
export { Accordion } from "./components/Accordion";
export type { AccordionProps } from "./components/Accordion";
export { Modal } from "./components/Modal";
export type { ModalProps } from "./components/Modal";
export { Drawer } from "./components/Drawer";
export type { DrawerProps } from "./components/Drawer";
export { CommandPalette } from "./components/CommandPalette";
export type { CommandPaletteProps } from "./components/CommandPalette";
export { Row } from "./components/Row";
export type { RowProps } from "./components/Row";
export { Column } from "./components/Column";
export type { ColumnProps } from "./components/Column";
export { Grid } from "./components/Grid";
export type { GridProps } from "./components/Grid";
export { Carousel } from "./components/Carousel";
export type { CarouselProps } from "./components/Carousel";

// Navigation Components
export { Breadcrumb } from "./components/Breadcrumb";
export type { BreadcrumbProps } from "./components/Breadcrumb";
export { Pagination } from "./components/Pagination";
export type { PaginationProps } from "./components/Pagination";
export { Stepper } from "./components/Stepper";
export type { StepperProps } from "./components/Stepper";

// Data Display Components
export { Avatar } from "./components/Avatar";
export type { AvatarProps } from "./components/Avatar";
export { Chip } from "./components/Chip";
export type { ChipProps } from "./components/Chip";
export { Tooltip } from "./components/Tooltip";
export type { TooltipProps } from "./components/Tooltip";
export { ProgressBar } from "./components/ProgressBar";
export type { ProgressBarProps } from "./components/ProgressBar";
export { Table } from "./components/Table";
export type { TableProps } from "./components/Table";
export { Spinner } from "./components/Spinner";
export type { SpinnerProps } from "./components/Spinner";
export { Skeleton } from "./components/Skeleton";
export type { SkeletonProps } from "./components/Skeleton";
export { ButtonGroup } from "./components/ButtonGroup";
export type { ButtonGroupProps } from "./components/ButtonGroup";

// Feedback Components
export { Alert } from "./components/Alert";
export type { AlertProps } from "./components/Alert";
export { Rating } from "./components/Rating";
export type { RatingProps } from "./components/Rating";
export { Popover } from "./components/Popover";
export type { PopoverProps } from "./components/Popover";
export { Toast } from "./components/Toast";
export type { ToastProps } from "./components/Toast";

// Chart Components
export { Chart } from "./components/charts/Chart";
export type { ChartProps } from "./components/charts/Chart";
export { BarChart } from "./components/charts/BarChart";
export { LineChart } from "./components/charts/LineChart";
export { PieChart } from "./components/charts/PieChart";
export { DoughnutChart } from "./components/charts/DoughnutChart";
export { RadarChart } from "./components/charts/RadarChart";
export { PolarAreaChart } from "./components/charts/PolarAreaChart";
export { ScatterChart } from "./components/charts/ScatterChart";
export { BubbleChart } from "./components/charts/BubbleChart";
export { StackedBarChart } from "./components/charts/StackedBarChart";
export { StackedLineChart } from "./components/charts/StackedLineChart";
export { ComboChart } from "./components/charts/ComboChart";

// Advanced Components
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";
export { IconButton } from "./components/IconButton";
export type { IconButtonProps } from "./components/IconButton";
export { FAB } from "./components/FAB";
export type { FABProps } from "./components/FAB";