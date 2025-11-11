<template>
	<div class="calendar-container">
		<Header
			:currentDate="currentDate"
			:currentView="currentView"
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
				<div class="time-slot" v-for="(time, index) in timeSlots" :key="index">
					{{
						time.toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
						})
					}}
				</div>
			</div>

			<div
				v-if="currentView === 'week' || currentView === 'mf'"
				class="days-header"
			>
				<div
					class="day-header"
					v-for="day in displayDays"
					:key="day.monthDay"
					:class="{ 'current-day': day.isCurrent }"
				>
					<div class="day-name">{{ day.name }}</div>
					<div class="day-date">{{ day.fullDate.getDate() }}</div>
				</div>
			</div>

			<div class="calendar-body" :class="`body-${currentView}`">
				<template v-if="currentView === 'day' || currentView === 'today'">
					<div
						class="time-column-day"
						v-for="(time, index) in timeSlots"
						:key="index"
					>
						<div class="day-column-single">
							<template
								v-for="(event, eventIndex) in getEventsForDayAndTime(
									currentDate,
									time
								)"
								:key="eventIndex"
							>
								<div
									class="event-block"
									:style="
										getEventBlockStyle(
											event.startTime,
											event.endTime,
											eventIndex
										)
									"
									@click="handleSelectEvent(event)"
								>
									<slot name="event" :event="event">
										<div class="event-content">
											<strong>{{ event.title }}</strong>
										</div>
									</slot>
								</div>
							</template>
						</div>
					</div>
				</template>

				<template v-else>
					<div
						class="time-column"
						v-for="time in timeSlots"
						:key="time.getTime().toString()"
					>
						<div
							class="day-column"
							v-for="day in displayDays"
							:key="day.fullDate.getTime().toString()"
						>
							<template
								v-for="(event, index) in getVisibleEventsForDayAndTime(
									day.fullDate,
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
									<slot name="event" :event="event">
										<div class="event-content">
											<strong>{{ event.title }}</strong>
										</div>
									</slot>
								</div>

								<div
									v-if="getHiddenEventsCount(day.fullDate, time) > 0"
									class="event-overflow"
									:style="getHiddenEventsStyle()"
									@click="handleShowAllEvents(time)"
								>
									<div class="event-content">
										<div class="event-overflow-text">
											+{{ getHiddenEventsCount(day.fullDate, time) }} more
										</div>
									</div>
								</div>
							</template>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	ref,
	computed,
	defineEmits,
	defineProps,
	type CSSProperties,
} from "vue";
import {
	dayNames,
	type CalendarEvent,
	type ComponentEmits,
	type ComponentProps,
	type DirectionTypes,
	type ViewTypes,
} from "./types";

import Header from "./components/Header.vue";

const props = withDefaults(defineProps<ComponentProps>(), {
	events: () => [],
	startTime: 0,
	endTime: 23,
});

const emit = defineEmits<ComponentEmits>();

const currentView = ref<ViewTypes>("today");
const currentDate = ref(new Date());

const maxEventsToShow = 1;

const timeSlots = computed(() => {
	const timeSlots: Date[] = [];

	const baseDate = new Date(currentDate.value);
	baseDate.setHours(0, 0, 0, 0);

	for (let i = props.startTime; i <= props.endTime; i++) {
		const slot = new Date(baseDate);
		slot.setHours(i, 0, 0, 0);
		timeSlots.push(slot);
	}

	return timeSlots;
});

const currentDayName = computed(() => dayNames[currentDate.value.getDay()]);

const currentDayDate = computed(() => currentDate.value.getDate());

const displayDays = computed(() => {
	if (currentView.value === "day" || currentView.value === "today") {
		return [
			{
				name: currentDayName.value,
				fullDate: currentDate.value,
				monthDay: currentDayDate.value,
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
				fullDate: date,
				name: dayNames[i],
				monthDay: date.getDate(),
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
			fullDate: date,
			name: dayNames[i],
			monthDay: date.getDate(),
			isCurrent: date.toDateString() === new Date().toDateString(),
		});
	}

	return days;
});

const handleSelectEvent = (event: any) => {
	emit("selectEvent", event);
};

const setView = (view: ViewTypes) => {
	currentView.value = view;

	if (view === "today") {
		currentDate.value = new Date();
	}

	emit("changeView", view);
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

const getEventsForDayAndTime = (date: Date, timeSlot: Date) =>
	(props.events || []).filter((event: CalendarEvent) => {
		return (
			event.startTime.toDateString() === date.toDateString() &&
			event.startTime.getHours() === timeSlot.getHours()
		);
	});

const getTimeSlotFromTime = (time: Date) => {
	const hour = time.getHours();
	return new Date(
		time.getFullYear(),
		time.getMonth(),
		time.getDate(),
		hour,
		0,
		0
	);
};

const getEventBlockStyle = (
	startTime: Date,
	endTime: Date,
	index: number
): any => {
	const isWeeklyView =
		currentView.value === "week" || currentView.value === "mf";

	// 00min = 00px, 59min = 99px
	const minutesStartPx = Math.round((startTime.getMinutes() / 59) * 99);
	const minutesEndPx = Math.round((endTime.getMinutes() / 59) * 99);

	const hourDiffPx = (endTime.getHours() - startTime.getHours()) * 100;
	const minutesDiffPx = minutesEndPx - minutesStartPx;

	const heightPx = hourDiffPx + minutesDiffPx;

	const paddingTop =
		getHiddenEventsCount(currentDate.value, startTime) > 0 ? 25 : 0;

	if (isWeeklyView) {
		return {
			position: "absolute",
			top: `${Math.max(minutesStartPx, paddingTop)}px`,
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
		top: `${Math.max(minutesStartPx, 0)}px`,
		height: `${heightPx}px`,
		width: `${widthPercentage}%`,
		left: `${leftPercentage}%`,
	};
};

const getVisibleEventsForDayAndTime = (day: Date, time: Date) => {
	return getEventsForDayAndTime(day, time).slice(0, maxEventsToShow);
};

const getHiddenEventsStyle = (): CSSProperties => ({
	position: "absolute",
	top: "0px",
	height: "15px",
});

const getHiddenEventsCount = (day: Date, time: Date) => {
	return getEventsForDayAndTime(day, time).length - maxEventsToShow;
};

const handleShowAllEvents = (time: Date) => {
	setView("day");
	currentDate.value = getTimeSlotFromTime(time);

	emit("showAllEvents", time);
};
</script>

<style lang="scss">
:root {
	--time-slot-height: 100px;
}
</style>

<style scoped lang="scss">
.calendar-container {
	width: 100%;
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
</style>
