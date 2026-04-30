/**
 * Barrel exports dos componentes UI primitivos.
 * design-dna.json → componentRules
 */

export { Button, buttonVariants, type ButtonProps } from './button';
export { Badge, badgeVariants, type BadgeProps } from './badge';
export { Skeleton, type SkeletonProps } from './skeleton';
export { Logo } from './logo';

export { Label } from './label';
export { Input, type InputProps } from './input';
export { Textarea, type TextareaProps } from './textarea';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from './select';

export { Checkbox } from './checkbox';
export { RadioGroup, RadioItem } from './radio';
export { Stepper, type StepperProps } from './stepper';
export { DatePicker, type DatePickerProps } from './date-picker';
export { StarRating, type StarRatingProps } from './star-rating';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
  type CardProps,
} from './card';

export {
  BicolorHeading,
  BicolorHighlight,
  type BicolorHeadingProps,
} from './bicolor-heading';
export { JourneyTag, type JourneyTagProps } from './journey-tag';

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './sheet';

export {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  SimpleTooltip,
} from './tooltip';

export { Toaster, toast } from './toaster';
