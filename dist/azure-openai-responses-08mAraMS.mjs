import { i as AssistantMessageEventStream } from "./diagnostics-CxlfIeKC.mjs";
import { n as clampThinkingLevel } from "./models-QwhDz2qm.mjs";
import { t as getProviderEnvValue } from "./provider-env-BNuEVurz.mjs";
import { t as headersToRecord } from "./headers-CRY1N82W.mjs";
import { t as retryProviderRequest } from "./provider-retry-C0GOdVeO.mjs";
import { o as createGrammarToolInputProperties, r as buildBaseOptions } from "./transform-messages-CZOEGAqc.mjs";
import { t as AzureOpenAI } from "./openai-Cca5FEqG.mjs";
import { n as normalizeProviderError, t as formatProviderError } from "./error-body-DVraEB0I.mjs";
import { t as clampOpenAIPromptCacheKey } from "./openai-prompt-cache-Bc6qNWt0.mjs";
import { n as convertResponsesTools, r as processResponsesStream, t as convertResponsesMessages } from "./openai-responses-shared-xBd6BZau.mjs";
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/api/azure-openai-responses.js
const DEFAULT_AZURE_API_VERSION = "v1";
const AZURE_TOOL_CALL_PROVIDERS = new Set([
	"openai",
	"openai-codex",
	"opencode",
	"azure-openai-responses"
]);
const OPENAI_RESPONSES_MIN_OUTPUT_TOKENS = 16;
function parseDeploymentNameMap(value) {
	const map = /* @__PURE__ */ new Map();
	if (!value) return map;
	for (const entry of value.split(",")) {
		const trimmed = entry.trim();
		if (!trimmed) continue;
		const [modelId, deploymentName] = trimmed.split("=", 2);
		if (!modelId || !deploymentName) continue;
		map.set(modelId.trim(), deploymentName.trim());
	}
	return map;
}
function resolveDeploymentName(model, options) {
	if (options?.azureDeploymentName) return options.azureDeploymentName;
	return parseDeploymentNameMap(getProviderEnvValue("AZURE_OPENAI_DEPLOYMENT_NAME_MAP", options?.env)).get(model.id) || model.id;
}
function formatAzureOpenAIError(error) {
	return formatProviderError(normalizeProviderError(error), "Azure OpenAI API error");
}
/**
* Generate function for Azure OpenAI Responses API
*/
const stream = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	(async () => {
		const deploymentName = resolveDeploymentName(model, options);
		const output = {
			role: "assistant",
			content: [],
			api: "azure-openai-responses",
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
			const apiKey = options?.apiKey;
			if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
			const client = createClient(model, apiKey, options);
			const grammarToolInputProperties = createGrammarToolInputProperties(context.tools, model.compat?.supportsOpenAIGrammarTools ?? false);
			let params = buildParams(model, context, options, deploymentName, grammarToolInputProperties);
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
			await processResponsesStream(openaiStream, output, stream, model, { grammarToolInputProperties });
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
			output.errorMessage = formatAzureOpenAIError(error);
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
	const apiKey = options?.apiKey;
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const base = buildBaseOptions(model, context, options, apiKey);
	const clampedReasoning = options?.reasoning ? clampThinkingLevel(model, options.reasoning) : void 0;
	const reasoningEffort = clampedReasoning === "off" ? void 0 : clampedReasoning;
	return stream(model, context, {
		...base,
		reasoningEffort
	});
};
function normalizeAzureBaseUrl(baseUrl) {
	const trimmed = baseUrl.trim().replace(/\/+$/, "");
	let url;
	try {
		url = new URL(trimmed);
	} catch {
		throw new Error(`Invalid Azure OpenAI base URL: ${baseUrl}`);
	}
	const isAzureHost = url.hostname.endsWith(".openai.azure.com") || url.hostname.endsWith(".cognitiveservices.azure.com") || url.hostname.endsWith(".ai.azure.com");
	const normalizedPath = url.pathname.replace(/\/+$/, "");
	if (isAzureHost && (normalizedPath === "" || normalizedPath === "/" || normalizedPath === "/openai" || normalizedPath === "/openai/v1/responses")) {
		url.pathname = "/openai/v1";
		url.search = "";
	}
	return url.toString().replace(/\/+$/, "");
}
function buildDefaultBaseUrl(resourceName) {
	return `https://${resourceName}.openai.azure.com/openai/v1`;
}
function resolveAzureConfig(model, options) {
	const apiVersion = options?.azureApiVersion || getProviderEnvValue("AZURE_OPENAI_API_VERSION", options?.env) || DEFAULT_AZURE_API_VERSION;
	const baseUrl = options?.azureBaseUrl?.trim() || getProviderEnvValue("AZURE_OPENAI_BASE_URL", options?.env)?.trim() || void 0;
	const resourceName = options?.azureResourceName || getProviderEnvValue("AZURE_OPENAI_RESOURCE_NAME", options?.env);
	let resolvedBaseUrl = baseUrl;
	if (!resolvedBaseUrl && resourceName) resolvedBaseUrl = buildDefaultBaseUrl(resourceName);
	if (!resolvedBaseUrl && model.baseUrl) resolvedBaseUrl = model.baseUrl;
	if (!resolvedBaseUrl) throw new Error("Azure OpenAI base URL is required. Set AZURE_OPENAI_BASE_URL or AZURE_OPENAI_RESOURCE_NAME, or pass azureBaseUrl, azureResourceName, or model.baseUrl.");
	return {
		baseUrl: normalizeAzureBaseUrl(resolvedBaseUrl),
		apiVersion
	};
}
function createClient(model, apiKey, options) {
	const headers = { ...model.headers };
	if (options?.headers) Object.assign(headers, options.headers);
	const { baseUrl, apiVersion } = resolveAzureConfig(model, options);
	return new AzureOpenAI({
		apiKey,
		apiVersion,
		dangerouslyAllowBrowser: true,
		defaultHeaders: headers,
		baseURL: baseUrl
	});
}
function buildParams(model, context, options, deploymentName, grammarToolInputProperties = createGrammarToolInputProperties(context.tools, model.compat?.supportsOpenAIGrammarTools ?? false)) {
	const params = {
		model: deploymentName,
		input: convertResponsesMessages(model, context, AZURE_TOOL_CALL_PROVIDERS, { grammarToolInputProperties }),
		stream: true,
		prompt_cache_key: clampOpenAIPromptCacheKey(options?.sessionId),
		store: false
	};
	if (options?.maxTokens) params.max_output_tokens = Math.max(options.maxTokens, OPENAI_RESPONSES_MIN_OUTPUT_TOKENS);
	if (options?.temperature !== void 0) params.temperature = options?.temperature;
	if (context.tools && context.tools.length > 0) params.tools = convertResponsesTools(context.tools, {
		supportsStrictMode: model.compat?.supportsStrictMode ?? true,
		supportsOpenAIGrammarTools: model.compat?.supportsOpenAIGrammarTools ?? false
	});
	if (model.reasoning) {
		if (options?.reasoningEffort || options?.reasoningSummary) {
			params.reasoning = {
				effort: options?.reasoningEffort ? model.thinkingLevelMap?.[options.reasoningEffort] ?? options.reasoningEffort : "medium",
				summary: options?.reasoningSummary || "auto"
			};
			params.include = ["reasoning.encrypted_content"];
		} else if (model.thinkingLevelMap?.off !== null) params.reasoning = { effort: model.thinkingLevelMap?.off ?? "none" };
	}
	return params;
}
//#endregion
export { stream, streamSimple };
