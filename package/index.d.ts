import type { DefineComponent } from "vue";

export type { ViewTypes, DirectionTypes, CalendarEvent } from "./types";

export type ComponentProps = {};
export type ComponentEmits = {};
export type ComponentSlots = {};

export type CalendarComponent = DefineComponent<
	ComponentProps,
	ComponentEmits,
	ComponentSlots
>;

export default CalendarComponent;
