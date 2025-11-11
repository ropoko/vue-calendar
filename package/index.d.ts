import type { DefineComponent } from "vue";
import type {
	ComponentEmits,
	ComponentProps,
	ComponentSlots,
	CalendarEvent,
	ViewTypes,
} from "./types";

declare const Calendar: DefineComponent<
	ComponentProps,
	ComponentEmits,
	ComponentSlots
>;

export {
	Calendar,
	type ComponentEmits,
	type ComponentProps,
	type ComponentSlots,
	type CalendarEvent,
	type ViewTypes,
};
export default Calendar;
