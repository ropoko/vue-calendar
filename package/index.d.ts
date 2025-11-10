import type { DefineComponent } from "vue";
export type { ViewTypes, DirectionTypes, CalendarEvent } from "./types";

export type ComponentProps = {};
export type ComponentEmits = {};
export type ComponentSlots = {};

declare const Calendar: DefineComponent<
	ComponentProps,
	ComponentEmits,
	ComponentSlots
>;

export { Calendar };
export default Calendar;
