//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/utils/error-body.js
const MAX_PROVIDER_ERROR_BODY_CHARS = 4e3;
function normalizeProviderError(error) {
	if (!(error instanceof Error)) return {
		message: safeJsonStringify(error),
		messageCarriesBody: false
	};
	const sdkError = error;
	const status = extractStatus(sdkError);
	const body = extractBody(sdkError);
	const messageCarriesBody = body === void 0 || error.message.includes(body);
	return {
		status,
		body,
		message: error.message,
		messageCarriesBody
	};
}
/**
* Probe the HTTP status, first numeric hit wins, in SDK-field order:
* `statusCode` (Mistral) → `status` (`openai`, `@google/genai`) →
* `$metadata.httpStatusCode` (Bedrock) → `$response.statusCode` (Bedrock).
*/
function extractStatus(error) {
	if (typeof error.statusCode === "number") return error.statusCode;
	if (typeof error.status === "number") return error.status;
	if (typeof error.$metadata?.httpStatusCode === "number") return error.$metadata.httpStatusCode;
	if (typeof error.$response?.statusCode === "number") return error.$response.statusCode;
}
/**
* Probe the raw body reason, first usable hit wins, in SDK-field order:
* `body` string (Mistral) → `error` parsed JSON body object (`openai` SDK's
* `this.error`) → `$response.body` (Bedrock). Empty objects and unread response
* streams are treated as no body so they do not surface as `"{}"` or serialized
* stream internals. The chosen body is truncated to the cap.
*/
function extractBody(error) {
	const bodyText = pickBodyText(error);
	if (bodyText === void 0) return void 0;
	const trimmed = bodyText.trim();
	if (trimmed.length === 0) return void 0;
	return truncateErrorText(trimmed, MAX_PROVIDER_ERROR_BODY_CHARS);
}
function pickBodyText(error) {
	if (typeof error.body === "string") return error.body;
	if (isNonEmptyObject(error.error)) return safeJsonStringify(error.error);
	const responseBody = error.$response?.body;
	if (typeof responseBody === "string") return responseBody;
	if (isReadableStreamLike(responseBody)) return void 0;
	if (isNonEmptyObject(responseBody)) return safeJsonStringify(responseBody);
}
function isReadableStreamLike(value) {
	return typeof value === "object" && value !== null && "pipe" in value && typeof value.pipe === "function";
}
function isNonEmptyObject(value) {
	return typeof value === "object" && value !== null && Object.keys(value).length > 0;
}
/**
* Compose a display string from a normalized error. When the message already
* carries the body (Anthropic / `@google/genai` happy path) or no body/status
* was extracted, the message is returned unchanged. Otherwise the status and
* body are surfaced, with an optional provider prefix.
*
* - no prefix: `"<status>: <body>"`
* - prefix:    `"<prefix> (<status>): <body>"`
*/
function formatProviderError(norm, prefix) {
	if (norm.messageCarriesBody || norm.status === void 0 || norm.body === void 0) return prefix !== void 0 && norm.status !== void 0 ? `${prefix} (${norm.status}): ${norm.message}` : norm.message;
	return prefix !== void 0 ? `${prefix} (${norm.status}): ${norm.body}` : `${norm.status}: ${norm.body}`;
}
function truncateErrorText(text, maxChars) {
	if (text.length <= maxChars) return text;
	return `${text.slice(0, maxChars)}... [truncated ${text.length - maxChars} chars]`;
}
function safeJsonStringify(value) {
	try {
		const serialized = JSON.stringify(value);
		return serialized === void 0 ? String(value) : serialized;
	} catch {
		return String(value);
	}
}
//#endregion
export { normalizeProviderError as n, formatProviderError as t };
