import { i as AssistantMessageEventStream } from "./diagnostics-CxlfIeKC.mjs";
import { n as clampThinkingLevel } from "./models-QwhDz2qm.mjs";
import { t as getProviderEnvValue } from "./provider-env-BNuEVurz.mjs";
import { t as splitDeferredTools } from "./deferred-tools-w2TWXxzg.mjs";
import { t as headersToRecord } from "./headers-CRY1N82W.mjs";
import { t as retryProviderRequest } from "./provider-retry-C0GOdVeO.mjs";
import { o as createGrammarToolInputProperties, r as buildBaseOptions } from "./transform-messages-CZOEGAqc.mjs";
import { n as hasCopilotVisionInput, t as buildCopilotDynamicHeaders } from "./github-copilot-headers-D7_GC6kQ.mjs";
import { n as OpenAI } from "./openai-Cca5FEqG.mjs";
import { n as normalizeProviderError, t as formatProviderError } from "./error-body-DVraEB0I.mjs";
import { t as clampOpenAIPromptCacheKey } from "./openai-prompt-cache-Bc6qNWt0.mjs";
import { n as convertResponsesTools, r as processResponsesStream, t as convertResponsesMessages } from "./openai-responses-shared-xBd6BZau.mjs";
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/api/openai-responses.js
const OPENAI_TOOL_CALL_PROVIDERS = new Set([
	"openai",
	"openai-codex",
	"opencode"
]);
const OPENAI_RESPONSES_MIN_OUTPUT_TOKENS = 16;
function hasHeader(headers, name) {
	if (!headers) return false;
	const expected = name.toLowerCase();
	for (const [key, value] of Object.entries(headers)) if (key.toLowerCase() === expected && value !== null && value.trim().length > 0) return true;
	return false;
}
function getClientApiKey(provider, apiKey, headers) {
	if (apiKey) return apiKey;
	if (hasHeader(headers, "authorization") || hasHeader(headers, "cf-aig-authorization")) return "unused";
	throw new Error(`No API key for provider: ${provider}`);
}
function detectSessionAffinityFormat(model) {
	return model.provider === "openrouter" || model.baseUrl.includes("openrouter.ai") ? "openrouter" : "openai";
}
/**
* Resolve cache retention preference.
* Defaults to "short" and uses PI_CACHE_RETENTION for backward compatibility.
*/
function resolveCacheRetention(cacheRetention, env) {
	if (cacheRetention) return cacheRetention;
	if (getProviderEnvValue("PI_CACHE_RETENTION", env) === "long") return "long";
	return "short";
}
function getCompat(model) {
	return {
		supportsDeveloperRole: model.compat?.supportsDeveloperRole ?? true,
		sessionAffinityFormat: model.compat?.sessionAffinityFormat ?? detectSessionAffinityFormat(model),
		supportsLongCacheRetention: model.compat?.supportsLongCacheRetention ?? true,
		supportsStrictMode: model.compat?.supportsStrictMode ?? false,
		supportsOpenAIGrammarTools: model.compat?.supportsOpenAIGrammarTools ?? false,
		supportsToolSearch: model.compat?.supportsToolSearch ?? false,
		supportsExplicitPromptCacheMode: model.compat?.supportsExplicitPromptCacheMode ?? false
	};
}
function getPromptCacheRetention(compat, cacheRetention) {
	return cacheRetention === "long" && compat.supportsLongCacheRetention ? "24h" : void 0;
}
function formatOpenAIResponsesError(error) {
	return formatProviderError(normalizeProviderError(error), "OpenAI API error");
}
/**
* Generate function for OpenAI Responses API
*/
const stream = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	(async () => {
		const output = {
			role: "assistant",
			content: [],
			api: model.api,
			provider: model.provider,
			model: model.id,
			usage: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				totalTokens: 0,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					total: 0
				}
			},
			stopReason: "stop",
			timestamp: Date.now()
		};
		try {
			const apiKey = getClientApiKey(model.provider, options?.apiKey, options?.headers);
			const cacheSessionId = resolveCacheRetention(options?.cacheRetention, options?.env) === "none" ? void 0 : options?.sessionId;
			const compat = getCompat(model);
			const grammarToolInputProperties = createGrammarToolInputProperties(context.tools, compat.supportsOpenAIGrammarTools);
			const client = createClient(model, context, apiKey, options?.headers, cacheSessionId);
			let params = buildParams(model, context, options, compat, grammarToolInputProperties);
			const nextParams = await options?.onPayload?.(params, model);
			if (nextParams !== void 0) params = nextParams;
			const requestOptions = {
				...options?.signal ? { signal: options.signal } : {},
				...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
				maxRetries: 0
			};
			const { data: openaiStream, response } = await retryProviderRequest(() => client.responses.create(params, requestOptions).withResponse(), {
				maxRetries: options?.maxRetries,
				maxRetryDelayMs: options?.maxRetryDelayMs,
				signal: options?.signal
			});
			await options?.onResponse?.({
				status: response.status,
				headers: headersToRecord(response.headers)
			}, model);
			stream.push({
				type: "start",
				partial: output
			});
			await processResponsesStream(openaiStream, output, stream, model, {
				serviceTier: options?.serviceTier,
				grammarToolInputProperties,
				applyServiceTierPricing: (usage, serviceTier) => applyServiceTierPricing(usage, serviceTier, model)
			});
			if (options?.signal?.aborted) throw new Error("Request was aborted");
			if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error("An unknown error occurred");
			stream.push({
				type: "done",
				reason: output.stopReason,
				message: output
			});
			stream.end();
		} catch (error) {
			for (const block of output.content) {
				delete block.index;
				delete block.partialJson;
				delete block.customInput;
			}
			output.stopReason = options?.signal?.aborted ? "aborted" : "error";
			output.errorMessage = formatOpenAIResponsesError(error);
			stream.push({
				type: "error",
				reason: output.stopReason,
				error: output
			});
			stream.end();
		}
	})();
	return stream;
};
const streamSimple = (model, context, options) => {
	getClientApiKey(model.provider, options?.apiKey, options?.headers);
	const base = buildBaseOptions(model, context, options, options?.apiKey);
	const clampedReasoning = options?.reasoning ? clampThinkingLevel(model, options.reasoning) : void 0;
	const reasoningEffort = clampedReasoning === "off" ? void 0 : clampedReasoning;
	return stream(model, context, {
		...base,
		reasoningEffort
	});
};
function createClient(model, context, apiKey, optionsHeaders, sessionId) {
	const compat = getCompat(model);
	const headers = { ...model.headers };
	if (model.provider === "github-copilot") {
		const hasImages = hasCopilotVisionInput(context.messages);
		const copilotHeaders = buildCopilotDynamicHeaders({
			messages: context.messages,
			hasImages
		});
		Object.assign(headers, copilotHeaders);
	}
	if (sessionId) if (compat.sessionAffinityFormat === "openrouter") headers["x-session-id"] = sessionId;
	else {
		if (compat.sessionAffinityFormat === "openai") headers.session_id = sessionId;
		headers["x-client-request-id"] = sessionId;
	}
	if (optionsHeaders) Object.assign(headers, optionsHeaders);
	return new OpenAI({
		apiKey,
		baseURL: model.baseUrl,
		dangerouslyAllowBrowser: true,
		defaultHeaders: headers
	});
}
function buildParams(model, context, options, compat = getCompat(model), grammarToolInputProperties = createGrammarToolInputProperties(context.tools, compat.supportsOpenAIGrammarTools)) {
	const toolPlacement = splitDeferredTools(context, compat.supportsToolSearch);
	const messages = convertResponsesMessages(model, context, OPENAI_TOOL_CALL_PROVIDERS, {
		grammarToolInputProperties,
		deferredTools: toolPlacement.deferred,
		toolOptions: {
			supportsStrictMode: compat.supportsStrictMode,
			supportsOpenAIGrammarTools: compat.supportsOpenAIGrammarTools
		}
	});
	const cacheRetention = resolveCacheRetention(options?.cacheRetention, options?.env);
	const disableImplicitPromptCache = cacheRetention === "none" && compat.supportsExplicitPromptCacheMode;
	const params = {
		model: model.id,
		input: messages,
		stream: true,
		prompt_cache_key: cacheRetention === "none" ? void 0 : clampOpenAIPromptCacheKey(options?.sessionId),
		prompt_cache_retention: getPromptCacheRetention(compat, cacheRetention),
		prompt_cache_options: disableImplicitPromptCache ? { mode: "explicit" } : void 0,
		store: false
	};
	if (options?.maxTokens) params.max_output_tokens = Math.max(options.maxTokens, OPENAI_RESPONSES_MIN_OUTPUT_TOKENS);
	if (options?.temperature !== void 0) params.temperature = options?.temperature;
	if (options?.serviceTier !== void 0) params.service_tier = options.serviceTier;
	if (toolPlacement.immediate.length > 0) params.tools = convertResponsesTools(toolPlacement.immediate, {
		supportsStrictMode: compat.supportsStrictMode,
		supportsOpenAIGrammarTools: compat.supportsOpenAIGrammarTools
	});
	if (options?.toolChoice !== void 0) params.tool_choice = options.toolChoice;
	if (model.reasoning) {
		if (options?.reasoningEffort || options?.reasoningSummary) {
			params.reasoning = {
				effort: options?.reasoningEffort ? model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort : "medium",
				summary: options?.reasoningSummary || "auto"
			};
			params.include = ["reasoning.encrypted_content"];
		} else if (model.provider !== "github-copilot" && model.thinkingLevelMap?.off !== null) params.reasoning = { effort: model.thinkingLevelMap?.off ?? "none" };
		if (model.provider === "xai") params.include = ["reasoning.encrypted_content"];
	}
	return params;
}
function getServiceTierCostMultiplier(model, serviceTier) {
	switch (serviceTier) {
		case "flex": return .5;
		case "priority": return model.id === "gpt-5.5" ? 2.5 : 2;
		default: return 1;
	}
}
function applyServiceTierPricing(usage, serviceTier, model) {
	const multiplier = getServiceTierCostMultiplier(model, serviceTier);
	if (multiplier === 1) return;
	usage.cost.input *= multiplier;
	usage.cost.output *= multiplier;
	usage.cost.cacheRead *= multiplier;
	usage.cost.cacheWrite *= multiplier;
	usage.cost.total = usage.cost.input + usage.cost.output + usage.cost.cacheRead + usage.cost.cacheWrite;
}
//#endregion
export { stream, streamSimple };
