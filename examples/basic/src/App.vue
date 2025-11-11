<script setup lang="ts">
import { ref } from "vue";

import VueCalendar, {
	type CalendarEvent,
	type ViewTypes,
} from "@ropoko/vue-calendar";

const events = ref<CalendarEvent[]>([
	{
		startTime: new Date("2025-11-11T07:30:00"),
		endTime: new Date("2025-11-11T08:20:00"),
		title: "Event 1",
	},
	{
		startTime: new Date("2025-11-11T10:00:00"),
		endTime: new Date("2025-11-11T12:00:00"),
		title: "Event 2",
	},
	{
		startTime: new Date("2025-11-11T10:00:00"),
		endTime: new Date("2025-11-11T14:00:00"),
		title: "Event 3",
	},
	{
		startTime: new Date("2025-11-11T23:00:00"),
		endTime: new Date("2025-11-11T23:59:00"),
		title: "Event 4",
	},
]);

const handleSelectEvent = (event: CalendarEvent) => {
	console.log("selectEvent", event);
};

const handleShowAllEvents = (time: Date) => {
	console.log("showAllEvents", time);
};

const handleChangeView = (view: ViewTypes) => {
	console.log("changeView", view);
};
</script>

<template>
	<div class="app">
		<VueCalendar
			:events="events"
			@selectEvent="handleSelectEvent"
			@showAllEvents="handleShowAllEvents"
			@changeView="handleChangeView"
		>
			<!-- <template #event="{ event }">
				<div>
					<strong>{{ event.title }}</strong>
					<br />
					<small>using custom slot</small>
				</div>
			</template> -->
		</VueCalendar>
	</div>
</template>

<style scoped lang="scss">
.app {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	width: 90vw;
}
</style>
