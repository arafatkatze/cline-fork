import {
	getModelReasoningControls,
	type ModelReasoningOption,
	type ReasoningEffort,
	ReasoningEffortSchema,
	type ReasoningLevel,
} from "@cline/shared";

export type ThinkingLevel = ReasoningLevel | "auto";
export type { ReasoningEffort };

export const THINKING_LEVELS = [
	{ value: "none", label: "Off", desc: "No extended thinking" },
	{ value: "minimal", label: "Minimal", desc: "Minimal reasoning" },
	{ value: "low", label: "Low", desc: "Light reasoning" },
	{ value: "medium", label: "Medium", desc: "Balanced reasoning" },
	{ value: "high", label: "High", desc: "Deep reasoning" },
	{ value: "xhigh", label: "Extra High", desc: "Very deep reasoning" },
	{ value: "max", label: "Maximum", desc: "Maximum reasoning" },
] as const satisfies readonly {
	value: ReasoningLevel;
	label: string;
	desc: string;
}[];

export type ThinkingLevelOption =
	| (typeof THINKING_LEVELS)[number]
	| {
			value: "auto";
			label: "On";
			desc: "Use the model's reasoning control";
	  };

const AUTO_THINKING_LEVEL = {
	value: "auto",
	label: "On",
	desc: "Use the model's reasoning control",
} as const;

const CONSERVATIVE_FALLBACK_LEVELS = THINKING_LEVELS.filter(
	(option) =>
		option.value === "none" ||
		option.value === "low" ||
		option.value === "medium" ||
		option.value === "high",
);

export function getThinkingLevelOptions(
	reasoningOptions: readonly ModelReasoningOption[] | undefined,
	supportsReasoning: boolean,
): readonly ThinkingLevelOption[] {
	if (reasoningOptions === undefined) {
		return supportsReasoning ? CONSERVATIVE_FALLBACK_LEVELS : [];
	}

	const profile = getModelReasoningControls(reasoningOptions);
	if (!profile) {
		return [];
	}
	const controls = THINKING_LEVELS.filter(
		(option) =>
			(option.value === "none" && profile.supportsOff) ||
			(option.value !== "none" && profile.efforts.includes(option.value)),
	);

	if (
		profile.efforts.length === 0 &&
		(profile.budget || profile.toggle || profile.supportsDefault)
	) {
		return [
			...(profile.supportsOff ? [THINKING_LEVELS[0]] : []),
			AUTO_THINKING_LEVEL,
		];
	}
	return profile.supportsDefault
		? [...controls, AUTO_THINKING_LEVEL]
		: controls;
}

export function isReasoningEffort(value: unknown): value is ReasoningEffort {
	return ReasoningEffortSchema.safeParse(value).success;
}
