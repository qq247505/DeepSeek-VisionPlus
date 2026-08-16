import { C as prettifyError, S as $ZodError, _ as union, a as array, d as literal, f as nullable, g as string, h as record, i as any, l as int, m as object, o as boolean, v as unknown, w as NEVER } from "./schemas-DXny_Pxn.mjs";
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/types/fp.js
function OK(value) {
	return {
		ok: true,
		value
	};
}
function ERR(error) {
	return {
		ok: false,
		error
	};
}
/**
* unwrapAsync is a convenience function for resolving a value from a Promise
* of a result or rejecting if an error occurred.
*/
async function unwrapAsync(pr) {
	const r = await pr;
	if (!r.ok) throw r.error;
	return r.value;
}
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/models/errors/sdkvalidationerror.js
var SDKValidationError = class extends Error {
	/**
	* The raw value that failed validation.
	*/
	rawValue;
	/**
	* The raw message that failed validation.
	*/
	rawMessage;
	static [Symbol.hasInstance](instance) {
		if (!(instance instanceof Error)) return false;
		if (!("rawValue" in instance)) return false;
		if (!("rawMessage" in instance)) return false;
		if (!("pretty" in instance)) return false;
		if (typeof instance.pretty !== "function") return false;
		return true;
	}
	constructor(message, cause, rawValue) {
		super(`${message}: ${cause}`);
		this.name = "SDKValidationError";
		this.cause = cause;
		this.rawValue = rawValue;
		this.rawMessage = message;
	}
	/**
	* Return a pretty-formatted error message if the underlying validation error
	* is a ZodError or some other recognized error type, otherwise return the
	* default error message.
	*/
	pretty() {
		if (this.cause instanceof $ZodError) return `${this.rawMessage}\n${formatZodError(this.cause)}`;
		else return this.toString();
	}
};
function formatZodError(err) {
	return prettifyError(err);
}
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/lib/primitives.js
/**
* Converts or omits an object's keys according to a mapping.
*
* @param inp An object whose keys will be remapped
* @param mappings A mapping of original keys to new keys. If a key is not present in the mapping, it will be left as is. If a key is mapped to `null`, it will be removed in the resulting object.
* @returns A new object with keys remapped or omitted according to the mappings
*/
function remap(inp, mappings) {
	let out = {};
	if (!Object.keys(mappings).length) {
		out = inp;
		return out;
	}
	for (const [k, v] of Object.entries(inp)) {
		const j = mappings[k];
		if (j === null) continue;
		out[j ?? k] = v;
	}
	return out;
}
function compactMap(values) {
	const out = {};
	for (const [k, v] of Object.entries(values)) if (typeof v !== "undefined") out[k] = v;
	return out;
}
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/lib/schemas.js
/**
* Utility function that executes some code which may result in a ZodError. It
* intercepts this error and converts it to an SDKValidationError so as to not
* leak Zod implementation details to user code.
*/
function safeParse(rawValue, fn, errorMessage) {
	try {
		return OK(fn(rawValue));
	} catch (err) {
		return ERR(new SDKValidationError(errorMessage, err, rawValue));
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/types/unrecognized.js
function unrecognized(value) {
	globalCount++;
	return value;
}
let globalCount = 0;
let refCount = 0;
function startCountingUnrecognized() {
	refCount++;
	const start = globalCount;
	return { 
	/**
	* Ends counting and returns the delta.
	* @param delta - If provided, only this amount is added to the parent counter
	*   (used for nested unions where we only want to record the winning option's count).
	*   If not provided, records all counts since start().
	*/
end: (delta) => {
		const count = globalCount - start;
		globalCount = start + (delta ?? count);
		if (--refCount === 0) globalCount = 0;
		return count;
	} };
}
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/types/enums.js
function inboundSchema(enumObj) {
	return union([...Object.values(enumObj).map((x) => literal(x)), string().transform((x) => unrecognized(x))]);
}
function inboundSchemaInt(enumObj) {
	return union([...Object.values(enumObj).filter((v) => typeof v === "number").map((x) => literal(x)), int().transform((x) => unrecognized(x))]);
}
function outboundSchema(_) {
	return string();
}
function outboundSchemaInt(_) {
	return int();
}
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/types/discriminatedUnion.js
const UNKNOWN = Symbol("UNKNOWN");
function isUnknown(value) {
	return typeof value === "object" && value !== null && UNKNOWN in value;
}
/**
* Forward-compatible discriminated union parser.
*
* If the input does not match one of the predefined options, it will be
* captured and available as `{ raw: <original input>, [discriminator]: "UNKNOWN", isUnknown: true }`.
*
* @param inputPropertyName - The discriminator property name in the input payload
* @param options - Map of discriminator values to their corresponding schemas
* @param opts - Optional configuration object
* @param opts.unknownValue - The value to use for the discriminator when the input is unknown (default: "UNKNOWN")
* @param opts.outputPropertyName - Output property name if the sanitized (camelCase) property name differs from inputPropertyName
*/
function discriminatedUnion(inputPropertyName, options, opts = {}) {
	const { unknownValue = "UNKNOWN", outputPropertyName } = opts;
	return unknown().transform((input) => {
		const fallback = Object.defineProperties({
			raw: input,
			[outputPropertyName ?? inputPropertyName]: unknownValue,
			isUnknown: true
		}, { [UNKNOWN]: {
			value: true,
			enumerable: false,
			configurable: false
		} });
		if (!(typeof input === "object" && input !== null)) return fallback;
		const discriminator = input[inputPropertyName];
		if (typeof discriminator !== "string") return fallback;
		if (!(discriminator in options)) return fallback;
		const schema = options[discriminator];
		if (!schema) return fallback;
		const unrecognizedCtr = startCountingUnrecognized();
		const result = schema.safeParse(input);
		if (!result.success) {
			unrecognizedCtr.end(0);
			return fallback;
		}
		unrecognizedCtr.end();
		if (outputPropertyName) result.data[outputPropertyName] = discriminator;
		return result.data;
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/types/rfcdate.js
const dateRE = /^\d{4}-\d{2}-\d{2}$/;
var RFCDate = class RFCDate {
	serialized;
	/**
	* Creates a new RFCDate instance using today's date.
	*/
	static today() {
		return new RFCDate(/* @__PURE__ */ new Date());
	}
	/**
	* Creates a new RFCDate instance using the provided input.
	* If a string is used then in must be in the format YYYY-MM-DD.
	*
	* @param date A Date object or a date string in YYYY-MM-DD format
	* @example
	* new RFCDate("2022-01-01")
	* @example
	* new RFCDate(new Date())
	*/
	constructor(date) {
		if (typeof date === "string" && !dateRE.test(date)) throw new RangeError("RFCDate: date strings must be in the format YYYY-MM-DD: " + date);
		const value = new Date(date);
		if (isNaN(+value)) throw new RangeError("RFCDate: invalid date provided: " + date);
		this.serialized = value.toISOString().slice(0, 10);
		if (!dateRE.test(this.serialized)) throw new TypeError(`RFCDate: failed to build valid date with given value: ${date} serialized to ${this.serialized}`);
	}
	toJSON() {
		return this.toString();
	}
	toString() {
		return this.serialized;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/types/smartUnion.js
/**
* Smart union parser that tries all schemas and returns the best match
* based on the number of populated fields.
*/
function smartUnion(options) {
	return unknown().transform((input, ctx) => {
		const candidates = [];
		const errors = options.map(() => []);
		const parentUnrecognizedCtr = startCountingUnrecognized();
		for (const [i, option] of options.entries()) {
			const unrecognizedCtr = startCountingUnrecognized();
			const result = option.safeParse(input);
			const inexactCount = unrecognizedCtr.end();
			const zeroDefaultCount = 0;
			if (result.success) {
				candidates.push({
					data: result.data,
					inexactCount,
					zeroDefaultCount,
					fieldCount: -1
				});
				continue;
			}
			errors[i].push(...result.error.issues);
		}
		if (candidates.length === 0) {
			parentUnrecognizedCtr.end(0);
			ctx.addIssue({
				input,
				code: "invalid_union",
				errors
			});
			return NEVER;
		}
		let best = candidates[0];
		for (const candidate of candidates) {
			if (candidates.length > 1) candidate.fieldCount = countFieldsRecursive(candidate.data);
			best = better(candidate, best);
		}
		parentUnrecognizedCtr.end(best.inexactCount);
		return best.data;
	});
}
function better(a, b) {
	const aIsExact = a.inexactCount === 0;
	if (aIsExact !== (b.inexactCount === 0)) return aIsExact ? a : b;
	const actualFieldCountA = a.fieldCount - a.zeroDefaultCount;
	const actualFieldCountB = b.fieldCount - b.zeroDefaultCount;
	if (actualFieldCountA !== actualFieldCountB) return actualFieldCountA > actualFieldCountB ? a : b;
	return a.inexactCount < b.inexactCount ? a : b;
}
/**
* Counts the number of fields in a parsed value recursively.
* @param `parsed` assumed to *not* contain cycles
* fieldCount: total number of fields found
* inexactCount: number of primitive values that are not unrecognized enum values
*/
function countFieldsRecursive(parsed) {
	let fieldCount = 0;
	const queue = [parsed];
	let index = 0;
	while (index < queue.length) {
		const value = queue[index++];
		if (value === void 0 || isUnknown(value)) continue;
		const type = typeof value;
		if (value === null || type === "number" || type === "string" || type === "boolean" || type === "bigint" || value instanceof Date || value instanceof RFCDate) {
			fieldCount++;
			continue;
		}
		if (Array.isArray(value)) {
			queue.push(...value);
			continue;
		}
		if (type === "object") queue.push(...Object.values(value));
	}
	return fieldCount;
}
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/models/components/audiochunk.js
/** @internal */
const AudioChunk$inboundSchema = object({
	type: literal("input_audio"),
	input_audio: string()
}).transform((v) => {
	return remap(v, { "input_audio": "inputAudio" });
});
/** @internal */
const AudioChunk$outboundSchema = object({
	type: literal("input_audio"),
	inputAudio: string()
}).transform((v) => {
	return remap(v, { inputAudio: "input_audio" });
});
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/models/components/documenturlchunk.js
/** @internal */
const DocumentURLChunk$inboundSchema = object({
	type: literal("document_url").default("document_url"),
	document_url: string(),
	document_name: nullable(string()).optional()
}).transform((v) => {
	return remap(v, {
		"document_url": "documentUrl",
		"document_name": "documentName"
	});
});
/** @internal */
const DocumentURLChunk$outboundSchema = object({
	type: literal("document_url").default("document_url"),
	documentUrl: string(),
	documentName: nullable(string()).optional()
}).transform((v) => {
	return remap(v, {
		documentUrl: "document_url",
		documentName: "document_name"
	});
});
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/models/components/filechunk.js
/** @internal */
const FileChunk$inboundSchema = object({
	type: literal("file").default("file"),
	file_id: string()
}).transform((v) => {
	return remap(v, { "file_id": "fileId" });
});
/** @internal */
const FileChunk$outboundSchema = object({
	type: literal("file").default("file"),
	fileId: string()
}).transform((v) => {
	return remap(v, { fileId: "file_id" });
});
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/models/components/imagedetail.js
const ImageDetail = {
	Low: "low",
	Auto: "auto",
	High: "high"
};
/** @internal */
const ImageDetail$inboundSchema = inboundSchema(ImageDetail);
/** @internal */
const ImageDetail$outboundSchema = outboundSchema(ImageDetail);
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/models/components/imageurl.js
/** @internal */
const ImageURL$inboundSchema = object({
	url: string(),
	detail: nullable(ImageDetail$inboundSchema).optional()
});
/** @internal */
const ImageURL$outboundSchema = object({
	url: string(),
	detail: nullable(ImageDetail$outboundSchema).optional()
});
smartUnion([ImageURL$inboundSchema, string()]);
smartUnion([ImageURL$outboundSchema, string()]);
/** @internal */
const ImageURLChunk$inboundSchema = object({
	type: literal("image_url").default("image_url"),
	image_url: smartUnion([ImageURL$inboundSchema, string()])
}).transform((v) => {
	return remap(v, { "image_url": "imageUrl" });
});
/** @internal */
const ImageURLChunk$outboundSchema = object({
	type: literal("image_url").default("image_url"),
	imageUrl: smartUnion([ImageURL$outboundSchema, string()])
}).transform((v) => {
	return remap(v, { imageUrl: "image_url" });
});
smartUnion([int(), string()]);
smartUnion([int(), string()]);
/** @internal */
const ReferenceChunk$inboundSchema = object({
	type: literal("reference").default("reference"),
	reference_ids: array(smartUnion([int(), string()]))
}).transform((v) => {
	return remap(v, { "reference_ids": "referenceIds" });
});
/** @internal */
const ReferenceChunk$outboundSchema = object({
	type: literal("reference").default("reference"),
	referenceIds: array(smartUnion([int(), string()]))
}).transform((v) => {
	return remap(v, { referenceIds: "reference_ids" });
});
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/models/components/textchunk.js
/** @internal */
const TextChunk$inboundSchema = object({
	type: literal("text").default("text"),
	text: string()
});
/** @internal */
const TextChunk$outboundSchema = object({
	type: literal("text").default("text"),
	text: string()
});
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/models/components/builtinconnectors.js
const BuiltInConnectors = {
	WebSearch: "web_search",
	WebSearchPremium: "web_search_premium",
	CodeInterpreter: "code_interpreter",
	ImageGeneration: "image_generation",
	DocumentLibrary: "document_library"
};
/** @internal */
const BuiltInConnectors$inboundSchema = inboundSchema(BuiltInConnectors);
/** @internal */
const BuiltInConnectors$outboundSchema = outboundSchema(BuiltInConnectors);
smartUnion([BuiltInConnectors$inboundSchema, string()]);
smartUnion([BuiltInConnectors$outboundSchema, string()]);
/** @internal */
const ToolReferenceChunk$inboundSchema = object({
	type: literal("tool_reference").default("tool_reference"),
	tool: smartUnion([BuiltInConnectors$inboundSchema, string()]),
	title: string(),
	url: nullable(string()).optional(),
	favicon: nullable(string()).optional(),
	description: nullable(string()).optional()
});
/** @internal */
const ToolReferenceChunk$outboundSchema = object({
	type: literal("tool_reference").default("tool_reference"),
	tool: smartUnion([BuiltInConnectors$outboundSchema, string()]),
	title: string(),
	url: nullable(string()).optional(),
	favicon: nullable(string()).optional(),
	description: nullable(string()).optional()
});
smartUnion([
	ToolReferenceChunk$inboundSchema,
	TextChunk$inboundSchema,
	ReferenceChunk$inboundSchema
]);
smartUnion([
	ToolReferenceChunk$outboundSchema,
	TextChunk$outboundSchema,
	ReferenceChunk$outboundSchema
]);
/** @internal */
const ThinkChunk$inboundSchema = object({
	type: literal("thinking").default("thinking"),
	thinking: array(smartUnion([
		ToolReferenceChunk$inboundSchema,
		TextChunk$inboundSchema,
		ReferenceChunk$inboundSchema
	])),
	signature: nullable(string()).optional(),
	closed: boolean().optional()
});
/** @internal */
const ThinkChunk$outboundSchema = object({
	type: literal("thinking").default("thinking"),
	thinking: array(smartUnion([
		ToolReferenceChunk$outboundSchema,
		TextChunk$outboundSchema,
		ReferenceChunk$outboundSchema
	])),
	signature: nullable(string()).optional(),
	closed: boolean().optional()
});
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/models/components/contentchunk.js
/** @internal */
const ContentChunk$inboundSchema = discriminatedUnion("type", {
	image_url: ImageURLChunk$inboundSchema.and(object({ type: literal("image_url") })),
	document_url: DocumentURLChunk$inboundSchema.and(object({ type: literal("document_url") })),
	text: TextChunk$inboundSchema.and(object({ type: literal("text") })),
	reference: ReferenceChunk$inboundSchema.and(object({ type: literal("reference") })),
	file: FileChunk$inboundSchema.and(object({ type: literal("file") })),
	thinking: ThinkChunk$inboundSchema.and(object({ type: literal("thinking") })),
	input_audio: AudioChunk$inboundSchema
});
/** @internal */
const ContentChunk$outboundSchema = union([
	ImageURLChunk$outboundSchema.and(object({ type: literal("image_url") })),
	DocumentURLChunk$outboundSchema.and(object({ type: literal("document_url") })),
	TextChunk$outboundSchema.and(object({ type: literal("text") })),
	ReferenceChunk$outboundSchema.and(object({ type: literal("reference") })),
	FileChunk$outboundSchema.and(object({ type: literal("file") })),
	ThinkChunk$outboundSchema.and(object({ type: literal("thinking") })),
	AudioChunk$outboundSchema
]);
smartUnion([record(string(), any()), string()]);
smartUnion([record(string(), any()), string()]);
/** @internal */
const FunctionCall$inboundSchema = object({
	name: string(),
	arguments: smartUnion([record(string(), any()), string()])
});
/** @internal */
const FunctionCall$outboundSchema = object({
	name: string(),
	arguments: smartUnion([record(string(), any()), string()])
});
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/models/components/toolcall.js
/** @internal */
const ToolCall$inboundSchema = object({
	id: string().default("null"),
	type: string().optional(),
	function: FunctionCall$inboundSchema,
	index: int().default(0)
});
/** @internal */
const ToolCall$outboundSchema = object({
	id: string().default("null"),
	type: string().optional(),
	function: FunctionCall$outboundSchema,
	index: int().default(0)
});
smartUnion([string(), array(ContentChunk$inboundSchema)]);
/** @internal */
const DeltaMessage$inboundSchema = object({
	role: nullable(string()).optional(),
	content: nullable(smartUnion([string(), array(ContentChunk$inboundSchema)])).optional(),
	tool_calls: nullable(array(ToolCall$inboundSchema)).optional(),
	tool_call_id: nullable(string()).optional(),
	index: nullable(int()).optional(),
	metadata: nullable(record(string(), any())).optional()
}).transform((v) => {
	return remap(v, {
		"tool_calls": "toolCalls",
		"tool_call_id": "toolCallId"
	});
});
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/models/components/usageinfo.js
/** @internal */
const UsageInfo$inboundSchema = object({
	prompt_tokens: int().default(0),
	completion_tokens: int().default(0),
	total_tokens: int().default(0),
	prompt_audio_seconds: nullable(int()).optional()
}).catchall(any()).transform((v) => {
	return remap(v, {
		"prompt_tokens": "promptTokens",
		"completion_tokens": "completionTokens",
		"total_tokens": "totalTokens",
		"prompt_audio_seconds": "promptAudioSeconds"
	});
});
/** @internal */
const UsageInfo$outboundSchema = object({
	promptTokens: int().default(0),
	completionTokens: int().default(0),
	totalTokens: int().default(0),
	promptAudioSeconds: nullable(int()).optional()
}).catchall(any()).transform((v) => {
	return { ...remap(v, {
		promptTokens: "prompt_tokens",
		completionTokens: "completion_tokens",
		totalTokens: "total_tokens",
		promptAudioSeconds: "prompt_audio_seconds"
	}) };
});
/** @internal */
const CompletionResponseStreamChoiceFinishReason$inboundSchema = inboundSchema({
	Stop: "stop",
	Length: "length",
	Error: "error",
	ToolCalls: "tool_calls"
});
/** @internal */
const CompletionResponseStreamChoice$inboundSchema = object({
	index: int(),
	delta: DeltaMessage$inboundSchema,
	finish_reason: nullable(CompletionResponseStreamChoiceFinishReason$inboundSchema)
}).transform((v) => {
	return remap(v, { "finish_reason": "finishReason" });
});
//#endregion
//#region ../../node_modules/.pnpm/@mistralai+mistralai@2.2.6_@opentelemetry+api@1.9.0/node_modules/@mistralai/mistralai/esm/models/components/completionchunk.js
/** @internal */
const CompletionChunk$inboundSchema = object({
	id: string(),
	object: string().optional(),
	created: int().optional(),
	model: string(),
	usage: UsageInfo$inboundSchema.optional(),
	choices: array(CompletionResponseStreamChoice$inboundSchema)
});
function completionChunkFromJSON(jsonString) {
	return safeParse(jsonString, (x) => CompletionChunk$inboundSchema.parse(JSON.parse(x)), `Failed to parse 'CompletionChunk' from JSON`);
}
//#endregion
export { compactMap as A, smartUnion as C, outboundSchema as D, inboundSchemaInt as E, unwrapAsync as F, formatZodError as M, ERR as N, outboundSchemaInt as O, OK as P, DocumentURLChunk$outboundSchema as S, inboundSchema as T, TextChunk$outboundSchema as _, DeltaMessage$inboundSchema as a, FileChunk$outboundSchema as b, ContentChunk$inboundSchema as c, ThinkChunk$outboundSchema as d, ToolReferenceChunk$inboundSchema as f, TextChunk$inboundSchema as g, BuiltInConnectors$outboundSchema as h, UsageInfo$outboundSchema as i, remap as j, safeParse as k, ContentChunk$outboundSchema as l, BuiltInConnectors$inboundSchema as m, completionChunkFromJSON as n, ToolCall$inboundSchema as o, ToolReferenceChunk$outboundSchema as p, UsageInfo$inboundSchema as r, ToolCall$outboundSchema as s, CompletionChunk$inboundSchema as t, ThinkChunk$inboundSchema as u, ImageURLChunk$inboundSchema as v, discriminatedUnion as w, DocumentURLChunk$inboundSchema as x, ImageURLChunk$outboundSchema as y };
