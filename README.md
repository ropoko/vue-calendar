# @ropoko/vue-calendar

A flexible and customizable calendar component for Vue 3 with multiple view modes, event management, and slot-based customization.

## Features

- 📅 **Multiple View Modes**: Today, Day, Week, and Monday-Friday views
- 🎨 **Customizable**: CSS variables and slot-based event rendering
- 📱 **Responsive**: Works on desktop and mobile devices
- 🎯 **TypeScript**: Full TypeScript support with type definitions
- 🎭 **Flexible Events**: Support for events with custom rendering
- ⚡ **Vue 3**: Built with Vue 3 Composition API

## Installation

```bash
npm install @ropoko/vue-calendar
```

## Basic Usage

### Import the Component

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueCalendar, { type CalendarEvent } from "@ropoko/vue-calendar";

const events = ref<CalendarEvent[]>([
	{
		startTime: new Date("2025-11-11T10:00:00"),
		endTime: new Date("2025-11-11T12:00:00"),
		title: "Meeting with Team",
	},
]);
</script>

<template>
	<VueCalendar :events="events" />
</template>
```

### Import Styles

Don't forget to import the CSS file in your main entry file (e.g., `main.ts` or `main.js`):

```typescript
import "@ropoko/vue-calendar/style.css";
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `events` | `CalendarEvent[]` | `[]` | Array of events to display on the calendar |
| `startTime` | `number` | `0` | Starting hour for the time slots (0-23) |
| `endTime` | `number` | `23` | Ending hour for the time slots (0-23) |

## Events

The component emits the following events:

| Event | Payload | Description |
|-------|---------|-------------|
| `selectEvent` | `CalendarEvent` | Emitted when an event is clicked |
| `showAllEvents` | `Date` | Emitted when clicking "+X more" to show all events at a time slot |
| `changeView` | `ViewTypes` | Emitted when the view mode changes |


## Slots

### Event Slot

Customize how events are rendered using the `event` slot:

```vue
<template>
	<VueCalendar :events="events">
		<template #event="{ event }">
			<div class="custom-event">
				<strong>{{ event.title }}</strong>
				<br />
				<small>
					custom slot
				</small>
			</div>
		</template>
	</VueCalendar>
</template>
```

The slot receives the following props:
- `event`: The `CalendarEvent` object being rendered

## Examples
Go at /examples/

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
