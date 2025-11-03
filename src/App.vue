<template>
	<div class="calendar-container">
		<Header
			:currentDate="currentDate"
			@setView="setView"
			@changeDay="handleChangeDay"
			@changeWeek="handleChangeWeek"
		/>

		<div
			v-if="currentView === 'day' || currentView === 'today'"
			class="day-display"
		>
			<div class="day-name-small">{{ currentDayName }}</div>
			<div class="day-date-large">{{ currentDayDate }}</div>
		</div>

		<div class="calendar-grid" :class="`view-${currentView}`">
			<div class="time-axis">
				<div class="time-slot" v-for="time in timeSlots" :key="time">
					{{ time }}
				</div>
			</div>

			<div
				v-if="currentView === 'week' || currentView === 'mf'"
				class="days-header"
			>
				<div
					class="day-header"
					v-for="day in displayDays"
					:key="day.date"
					:class="{ 'current-day': day.isCurrent }"
				>
					<div class="day-name">{{ day.name }}</div>
					<div class="day-date">{{ day.date }}</div>
				</div>
			</div>

			<div class="calendar-body" :class="`body-${currentView}`">
				<template v-if="currentView === 'day' || currentView === 'today'">
					<div class="time-column-day" v-for="time in timeSlots" :key="time">
						<div class="day-column-single">
							<template
								v-for="(event, index) in getEventsForDayAndTime(
									currentDate,
									time
								)"
								:key="event.id"
							>
								<div class="event-block" @click="handleSelectEvent(event)">
									<div class="event-content">
										<header>
											<p>ahudias</p>
										</header>

										<p>name</p>
									</div>
								</div>
							</template>
						</div>
					</div>
				</template>

				<template v-else>
					<div class="time-column" v-for="time in timeSlots" :key="time">
						<div
							class="day-column"
							v-for="day in displayDays"
							:key="`${day.date}-${time}`"
						>
							<template
								v-for="(event, index) in getVisibleEventsForDayAndTime(
									day.date,
									time
								)"
								:key="index"
							>
								<div
									class="event-block"
									:style="
										getEventBlockStyle(event.startTime, event.endTime, index)
									"
									@click="handleSelectEvent(event)"
								>
									<div class="event-content">
										<header>
											<p>ahudias</p>
										</header>

										<p>name</p>
									</div>
								</div>

								<!-- <div
									v-if="getHiddenEventsCount(day.date, time) > 0"
									class="event-overflow"
									:style="getHiddenEventsStyle()"
									@click="handleShowAllEvents(day.date, time)"
								>
									<div class="event-content">
										<div class="event-overflow-text">
											+{{ getHiddenEventsCount(day.date, time) }} more
										</div>
									</div>
								</div> -->
							</template>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
	dayNames,
	monthNames,
	type CalendarEvent,
	type DirectionTypes,
} from "./types";

import Header from "./components/Header.vue";

const currentView = ref("today");
const currentDate = ref(new Date());

// const intelligenceStore = useIntelligenceStore();

const events = ref<CalendarEvent[]>([
	{
		startTime: new Date("2025-10-31T07:00:00"),
		endTime: new Date("2025-10-31T08:00:00"),
		title: "Event 1",
	},
	{
		startTime: new Date("2025-10-30T10:00:00"),
		endTime: new Date("2025-10-31T12:00:00"),
		title: "Event 2",
	},
	{
		startTime: new Date("2025-10-31T10:00:00"),
		endTime: new Date("2025-10-31T14:00:00"),
		title: "Event 3",
	},
]);

const maxEventsToShow = 1;

const timeSlots = computed(() => {
	const timeSlots = [];

	// start from 7 so the list is not super long
	for (let i = 7; i <= 12; i++) {
		timeSlots.push(`${i}:00AM`.padStart(7, "0"));
	}

	for (let i = 1; i <= 12; i++) {
		timeSlots.push(`${i}:00PM`.padStart(7, "0"));
	}

	return timeSlots;
});

const currentDayName = computed(() => {
	return dayNames[currentDate.value.getDay()];
});

const currentDayDate = computed(() => {
	return currentDate.value.getDate().toString();
});

const displayDays = computed(() => {
	if (currentView.value === "day" || currentView.value === "today") {
		return [
			{
				name: currentDayName.value,
				date: currentDayDate.value,
				fullDate: formatDate(currentDate.value),
				isCurrent:
					currentDate.value.toDateString() === new Date().toDateString(),
			},
		];
	}

	if (currentView.value === "mf") {
		const days = [];
		const startOfWeek = new Date(currentDate.value);
		startOfWeek.setDate(
			currentDate.value.getDate() - currentDate.value.getDay()
		);

		// Monday (1) to Friday (5)
		for (let i = 1; i <= 5; i++) {
			const date = new Date(startOfWeek);
			date.setDate(startOfWeek.getDate() + i);

			days.push({
				name: dayNames[i],
				date: date.getDate().toString(),
				fullDate: formatDate(date),
				isCurrent: date.toDateString() === new Date().toDateString(),
			});
		}

		return days;
	}

	const days = [];
	const startOfWeek = new Date(currentDate.value);
	startOfWeek.setDate(currentDate.value.getDate() - currentDate.value.getDay());

	for (let i = 0; i < 7; i++) {
		const date = new Date(startOfWeek);
		date.setDate(startOfWeek.getDate() + i);

		days.push({
			name: dayNames[i],
			date: date.getDate().toString(),
			fullDate: formatDate(date),
			isCurrent: date.toDateString() === new Date().toDateString(),
		});
	}

	return days;
});

const handleSelectEvent = (event: any) => {
	console.log(event);
	// if (event && event.date) {
	// 	const [year, month, day] = event.date.split("-").map(Number);
	// 	currentDate.value = new Date(year, month - 1, day);
	// }

	// currentView.value = "day";
	// eventSelected.value = event;
};

const setView = (view: any) => {
	currentView.value = view;

	if (view === "today") {
		currentDate.value = new Date();
	}

	if (view === "week" || view === "mf") {
		// eventSelected.value = null;
	}
};

const handleChangeWeek = (direction: DirectionTypes) => {
	const newDate = new Date(currentDate.value);

	newDate.setDate(
		currentDate.value.getDate() + (direction === "previous" ? -7 : 7)
	);

	currentDate.value = newDate;
};

const handleChangeDay = (direction: DirectionTypes) => {
	const newDate = new Date(currentDate.value);

	newDate.setDate(
		currentDate.value.getDate() + (direction === "previous" ? -1 : 1)
	);

	currentDate.value = newDate;
};

const getEventsForDayAndTime = (day: any, time: string) => {
	const getHour = (t: string) => {
		const match = t.match(/^(\d{1,2}):/);
		return match ? parseInt(match[1], 10) : null;
	};

	const getAmPm = (t: string) => {
		const match = t.match(/AM|PM$/);
		return match ? match[0] : null;
	};

	const targetHour = getHour(time);
	const targetAmPM = getAmPm(time);

	if (currentView.value === "day" || currentView.value === "today") {
		const fullDate = formatDate(currentDate.value);

		const eventsForDay = events.value.filter((event: any) => {
			return (
				event.date === fullDate &&
				getHour(event.startTime) === targetHour &&
				getAmPm(event.startTime) === targetAmPM
			);
		});

		return eventsForDay;
	}

	const dayObj = displayDays.value.find((d) => d.date === day);

	if (dayObj) {
		const eventsForDay = events.value.filter((event: any) => {
			return (
				event.date === dayObj.fullDate &&
				getHour(event.startTime) === targetHour &&
				getAmPm(event.startTime) === targetAmPM
			);
		});

		return eventsForDay;
	}

	return [];
};

const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const getTimeSlotFromTime = (time: string) => {
	const hour = time.split(":")[0];
	const ampm = time.includes("AM") ? "AM" : "PM";
	return `${hour}:00${ampm}`;
};

const getEventBlockStyle = (
	startTime: Date,
	endTime: Date,
	index: number
): any => {
	const isWeeklyView =
		currentView.value === "week" || currentView.value === "mf";

	const startTime24 = startTime.endsWith("PM")
		? `${parseInt(startTime.split(":")[0] || "0", 10) + 12}`
		: `${parseInt(startTime.split("AM")[0] || "0", 10)}`;

	const hourStartTime = parseInt(startTime24.split(":")[0] || "0", 10);
	const minutesStartTime = parseInt(
		startTime.split(":")[1]?.slice(0, 2) || "0",
		10
	);

	const endTime24 = endTime.endsWith("PM")
		? `${parseInt(endTime.split(":")[0] || "0", 10) + 12}`
		: `${parseInt(endTime.split("AM")[0] || "0", 10)}`;

	const hourEndTime = endTime.includes("PM")
		? parseInt(endTime24.split(":")[0] || "0", 10)
		: parseInt(endTime.split(":")[0] || "0", 10);
	const minutesEndTime = parseInt(
		endTime.split(":")[1]?.slice(0, 2) || "0",
		10
	);

	// 00min = 00px, 59min = 99px
	const minutesStartPx = Math.round((minutesStartTime / 59) * 99);
	const minutesEndPx = Math.round((minutesEndTime / 59) * 99);

	const hourDiffPx = (hourEndTime - hourStartTime) * 100;
	const minutesDiffPx = minutesEndPx - minutesStartPx;

	const heightPx = hourDiffPx + minutesDiffPx;

	if (isWeeklyView) {
		return {
			position: "absolute",
			top: `${Math.max(minutesStartPx, 25)}px`,
			height: `${heightPx}px`,
		};
	}

	const timeSlot = getTimeSlotFromTime(startTime);
	const eventsAtThisTime = getEventsForDayAndTime(currentDate.value, timeSlot);
	const totalEvents = eventsAtThisTime.length;

	const widthPercentage = 100 / totalEvents;
	const leftPercentage = index * widthPercentage;

	return {
		position: "absolute",
		top: `${Math.max(minutesStartPx, 25)}px`,
		height: `${heightPx}px`,
		width: `${widthPercentage}%`,
		left: `${leftPercentage}%`,
	};
};

const getVisibleEventsForDayAndTime = (day: any, time: string) => {
	const allEvents = getEventsForDayAndTime(day, time);

	const visibleCount = Math.min(allEvents.length, maxEventsToShow);
	return allEvents.slice(0, visibleCount);
};

const getHiddenEventsCount = (day: any, time: string) => {
	const allEvents = getEventsForDayAndTime(day, time);
	return allEvents.length - maxEventsToShow;
};

const getHiddenEventsStyle = () => {
	return {
		position: "absolute",
		top: "0px",
		height: "25px",
	};
};

const handleShowAllEvents = (day: any, time: string) => {
	const allEvents = getEventsForDayAndTime(day, time);

	if (allEvents.length > 0) {
		const dayObj = displayDays.value.find((d) => d.date === day);

		if (dayObj) {
			const [year, month, dayNum] = dayObj.fullDate.split("-").map(Number);
			currentDate.value = new Date(year!, month! - 1, dayNum);
		}

		currentView.value = "day";
		// eventSelected.value = null;
	}
};

const convert24HourTo12Hour = (time: string) => {
	const hour = time.split(":")[0] || "0";
	const minutes = time.split(":")[1] || "00";
	const ampm = parseInt(hour) > 12 ? "PM" : "AM";
	const hour12 = parseInt(hour) % 12 || 12;
	return `${hour12}:${minutes}${ampm}`;
};
</script>

<style scoped lang="scss">
.calendar-container {
	font-family: "Inter", sans-serif;
	background: white;
	border-radius: 0.5rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	overflow: hidden;
}

.day-display {
	padding: 20px;
	background: #f9fafb;
	border-bottom: 1px solid #e5e7eb;
}

.day-name-small {
	font-size: 14px;
	color: #6b7280;
	font-weight: 500;
	margin-bottom: 4px;
}

.day-date-large {
	font-size: 32px;
	font-weight: 700;
	color: #374151;
}

.calendar-grid {
	display: grid;
	grid-template-columns: var(--time-slot-height) 1fr;
	grid-template-rows: auto 1fr;
	height: 600px;
	overflow-y: auto;
}

.calendar-grid.view-day,
.calendar-grid.view-today {
	grid-template-columns: var(--time-slot-height) 1fr;
	grid-template-rows: 1fr;
}

.calendar-grid.view-day .time-axis,
.calendar-grid.view-today .time-axis {
	grid-row: 1;
}

.calendar-grid.view-day .calendar-body,
.calendar-grid.view-today .calendar-body {
	grid-row: 1;
	grid-column: 2;
}

.time-axis {
	grid-row: 2;
	grid-column: 1;
	border-right: 1px solid #e5e7eb;
	background: #f9fafb;
}

.time-slot {
	height: auto;
	min-height: var(--time-slot-height);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	color: #6b7280;
	font-weight: 500;
	border-bottom: 1px dashed #e5e7eb;
}

.days-header {
	grid-row: 1;
	grid-column: 2;
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	border-bottom: 1px solid #e5e7eb;
	background: #f9fafb;
}

.calendar-grid.view-mf .days-header {
	grid-template-columns: repeat(5, 1fr);
}

.calendar-body.body-mf {
	grid-template-columns: repeat(5, 1fr);
}

.day-header {
	padding: 12px 8px;
	text-align: center;
	border-right: 1px solid #e5e7eb;
}

.day-header:last-child {
	border-right: none;
}

.day-header.current-day {
	background: #f3e8ff;
}

.day-name {
	font-size: 12px;
	font-weight: 600;
	color: #374151;
	margin-bottom: 4px;
}

.day-date {
	font-size: 18px;
	font-weight: 700;
	color: #374151;
}

.calendar-body {
	grid-row: 2;
	grid-column: 2;
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	grid-template-rows: repeat(8, var(--time-slot-height));
}

.calendar-body.body-day,
.calendar-body.body-today {
	grid-template-columns: 1fr;
	grid-template-rows: repeat(8, var(--time-slot-height));
}

.time-column-day {
	display: contents;
}

.day-column-single {
	position: relative;

	gap: 2px;
	display: flex;
	align-items: center;

	height: 100%;
	min-height: 100%;

	border-right: 1px solid #e5e7eb;
	border-bottom: 1px dashed #e5e7eb;
}

.time-column {
	display: contents;
}

.day-column {
	position: relative;

	gap: 2px;
	display: flex;
	flex-direction: column;
	align-items: center;

	border-right: 1px solid #e5e7eb;
	border-bottom: 1px dashed #e5e7eb;

	&:last-child {
		border-right: none;
	}

	padding: 4px;
}

.event-block {
	width: 100%;
	cursor: pointer;
	background: #dbeafe;
	border: 1px solid #93c5fd;
	border-radius: 6px;
	padding: 4px 8px;
	z-index: 10;
}

.event-multi-hour {
	background: #bfdbfe;
	border-color: #3b82f6;
}

.event-overflow {
	cursor: pointer;

	background: #f3e8ff;
	border: 1px solid #e2c8ff;

	border-radius: 6px;
	padding: 4px 8px;
	z-index: 11;

	width: 100%;

	.event-overflow-text {
		font-size: 11px;
		font-weight: 600;
		color: #374151;
		text-align: center;
	}
}

// .event-content header {
//   gap: 4px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// }
</style>
