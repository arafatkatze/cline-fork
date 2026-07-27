import type { ProviderSettings } from "@cline/core";
import { isReasoningEffort, type ReasoningEffort } from "./thinking-levels";
import type { CliReasoningEffort } from "./types";

type ActiveCliReasoningEffort = ReasoningEffort;

export interface ResolveCliReasoningInput {
	thinking: boolean;
	thinkingExplicitlySet?: boolean;
	reasoningEffort?: CliReasoningEffort;
	persistedReasoning?: ProviderSettings["reasoning"];
}

export interface ResolvedCliReasoning {
	thinking?: boolean;
	reasoningEffort?: ActiveCliReasoningEffort;
}

export function resolveCliReasoning({
	thinking,
	thinkingExplicitlySet,
	reasoningEffort,
	persistedReasoning,
}: ResolveCliReasoningInput): ResolvedCliReasoning {
	if (thinkingExplicitlySet) {
		return {
			thinking,
			reasoningEffort: isReasoningEffort(reasoningEffort)
				? reasoningEffort
				: undefined,
		};
	}

	if (
		persistedReasoning?.enabled === false ||
		persistedReasoning?.effort === "none"
	) {
		return { thinking: false, reasoningEffort: undefined };
	}

	if (isReasoningEffort(persistedReasoning?.effort)) {
		return { thinking: true, reasoningEffort: persistedReasoning.effort };
	}

	if (persistedReasoning?.enabled === true) {
		return { thinking: true, reasoningEffort: undefined };
	}

	return { thinking: undefined, reasoningEffort: undefined };
}
