import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		lib: {
			entry: "package/index.ts",
			name: "VueCalendar",
			fileName: (format) => `vue-calendar.${format}.js`,
			formats: ["es", "cjs"],
		},
		outDir: "dist",
		rollupOptions: {
			external: ["vue"],
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === "style.css") return "vue-calendar.css";
					return assetInfo.name || "asset";
				},
			},
		},
	},
});
