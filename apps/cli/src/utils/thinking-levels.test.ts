import { REASONING_LEVELS } from "@cline/shared";
import { describe, expect, it } from "vitest";
import {
	getThinkingLevelOptions,
	isReasoningEffort,
	THINKING_LEVELS,
} from "./thinking-levels";

describe("thinking levels", () => {
	it("defines each supported level exactly once", () => {
		const values = THINKING_LEVELS.map((level) => level.value);

		expect(values).toEqual(REASONING_LEVELS);
		expect(new Set(values).size).toBe(values.length);
	});

	it("recognizes active reasoning efforts", () => {
		expect(isReasoningEffort("minimal")).toBe(true);
		expect(isReasoningEffort("max")).toBe(true);
		expect(isReasoningEffort("none")).toBe(false);
		expect(isReasoningEffort("unsupported")).toBe(false);
	});

	it("shows only effort values advertised by models.dev", () => {
		expect(
			getThinkingLevelOptions(
				[{ type: "effort", values: ["low", "high"] }],
				true,
			).map((option) => option.value),
		).toEqual(["low", "high"]);
	});

	it("distinguishes toggle, budget-only, empty, and unlisted controls", () => {
		expect(
			getThinkingLevelOptions([{ type: "toggle" }], true).map(
				(option) => option.value,
			),
		).toEqual(["none", "auto"]);
		expect(
			getThinkingLevelOptions(
				[{ type: "budget_tokens", min: 128, max: 32_768 }],
				true,
			).map((option) => option.value),
		).toEqual(["auto"]);
		expect(
			getThinkingLevelOptions(
				[{ type: "effort", values: ["none", "default"] }],
				true,
			).map((option) => option.value),
		).toEqual(["none", "auto"]);
		expect(getThinkingLevelOptions([], true)).toEqual([]);
		expect(
			getThinkingLevelOptions(undefined, true).map((option) => option.value),
		).toEqual(["none", "low", "medium", "high"]);
	});
});
