export type ViewTypes = "today" | "day" | "mf" | "week";
export type DirectionTypes = "previous" | "next";

export const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export type CalendarEvent = {
	startTime: Date;
	endTime: Date;

	title?: string;
};
