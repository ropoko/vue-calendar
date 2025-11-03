<template>
	<header class="calendar-header">
		<div class="month-display">
			<h2 class="month-title">{{ currentMonthYear }}</h2>
		</div>

		<div class="view-options">
			<button
				class="view-btn"
				:class="{ active: currentView === 'today' }"
				@click="setView('today')"
			>
				Today
			</button>

			<button
				class="view-btn"
				:class="{ active: currentView === 'day' }"
				@click="setView('day')"
			>
				Day
			</button>

			<button
				class="view-btn"
				:class="{ active: currentView === 'mf' }"
				@click="setView('mf')"
			>
				M-F
			</button>

			<button
				class="view-btn"
				:class="{ active: currentView === 'week' }"
				@click="setView('week')"
			>
				Week
			</button>

			<button class="nav-btn" @click="handleChange('previous')">
				<img src="../assets/arrow-left.svg" alt="arrow-left" />
			</button>

			<button class="nav-btn" @click="handleChange('next')">
				<img src="../assets/arrow-right.svg" alt="arrow-left" />
			</button>
		</div>
	</header>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, defineProps, nextTick } from "vue";
import { monthNames, type DirectionTypes, type ViewTypes } from "../types";

const props = defineProps<{
	currentDate: Date;
}>();

const emit = defineEmits(["changeWeek", "changeDay", "setView"]);

const currentView = ref<ViewTypes>("today");

const handleChange = (direction: DirectionTypes) => {
	if (currentView.value === "day" || currentView.value === "today") {
		emit("changeDay", direction);
	} else {
		emit("changeWeek", direction);
	}

	nextTick(() => {
		const today = new Date().getDate();
		const currentDay = new Date(props.currentDate).getDate();

		if (currentDay !== today && currentView.value === "today") {
			setView("day");
		}

		if (currentDay === today && currentView.value === "day") {
			setView("today");
		}
	});
};

const setView = (view: ViewTypes) => {
	emit("setView", view);
	currentView.value = view;
};

const currentMonthYear = computed(() => {
	const month = monthNames[props.currentDate.getMonth()];
	const year = props.currentDate.getFullYear();
	return `${month} ${year}`;
});
</script>

<style scoped lang="scss">
.calendar-header {
	padding: 1rem;

	display: flex;
	align-items: center;
	justify-content: space-between;

	background: #f9fafb;
	border-bottom: 1px solid #e5e7eb;

	.month-display {
		.month-title {
			margin: 0;
			font-size: 1.3rem;
			font-weight: 600;
			color: #374151;
		}
	}

	.view-options {
		gap: 0.3rem;
		display: flex;
		align-items: center;

		.nav-btn,
		.view-btn {
			padding: 0.3rem 0.8rem;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid #d1d5db;
			background: #f9fafb;
			border-radius: 0.4rem;

			&:hover {
				background: #f3f4f6;
				border-color: #9ca3af;
			}

			&.active {
				background: #1f2937;
				color: white;
				border-color: #1f2937;
			}
		}
	}
}
</style>
