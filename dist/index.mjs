import { a as getSupportedThinkingLevels, i as createProvider, o as lazyApi, r as createModels } from "./models-QwhDz2qm.mjs";
import { a as array, g as string, m as object, p as number } from "./schemas-DXny_Pxn.mjs";
import { createRequire } from "node:module";
//#region ../../vendor/cosmokit/lib/index.js
/** Return true when a value is `null` or `undefined`. */
function isNullable(value) {
	return value === null || value === void 0;
}
/** Return true for non-array object values. */
function isPlainObject$1(data) {
	return data && typeof data === "object" && !Array.isArray(data);
}
/** Filter object entries and return a new object. */
function filterKeys(object, filter) {
	return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
}
/** Map object values while preserving the original key set. */
function mapValues(object, transform) {
	return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
}
/** Pick selected keys from an object, optionally including `undefined` values. */
function pick(source, keys, forced) {
	if (!keys) return { ...source };
	const result = {};
	for (const key of keys) if (forced || source[key] !== void 0) result[key] = source[key];
	return result;
}
/** Define a non-enumerable writable property and return the object. */
function defineProperty(object, key, value) {
	return Object.defineProperty(object, key, {
		writable: true,
		value,
		enumerable: false
	});
}
/** Test values using `instanceof` with a `toStringTag` fallback. */
function is(type, value) {
	if (arguments.length === 1) return (value) => is(type, value);
	return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
}
function isArrayBufferLike(value) {
	return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
}
function isArrayBufferSource(value) {
	return isArrayBufferLike(value) || ArrayBuffer.isView(value);
}
/** Binary source detection and base64/hex conversion helpers. */
var Binary;
(function(Binary) {
	Binary.is = isArrayBufferLike;
	Binary.isSource = isArrayBufferSource;
	function fromSource(source) {
		if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
		else return source;
	}
	Binary.fromSource = fromSource;
	function toBase64(source) {
		source = fromSource(source);
		if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
		let binary = "";
		const bytes = new Uint8Array(source);
		for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
		return btoa(binary);
	}
	Binary.toBase64 = toBase64;
	function fromBase64(source) {
		if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
		return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
	}
	Binary.fromBase64 = fromBase64;
	function toHex(source) {
		source = fromSource(source);
		if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
		return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
	}
	Binary.toHex = toHex;
	function fromHex(source) {
		if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
		const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
		const buffer = [];
		for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
		return Uint8Array.from(buffer).buffer;
	}
	Binary.fromHex = fromHex;
})(Binary || (Binary = {}));
Binary.fromBase64;
Binary.toBase64;
Binary.fromHex;
Binary.toHex;
/** Deep-clone common JavaScript values while preserving prototypes and cycles. */
function clone(source, refs = /* @__PURE__ */ new Map()) {
	if (!source || typeof source !== "object") return source;
	if (is("Date", source)) return new Date(source.valueOf());
	if (is("RegExp", source)) return new RegExp(source.source, source.flags);
	if (isArrayBufferLike(source)) return source.slice(0);
	if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
	const cached = refs.get(source);
	if (cached) return cached;
	if (Array.isArray(source)) {
		const result = [];
		refs.set(source, result);
		source.forEach((value, index) => {
			result[index] = Reflect.apply(clone, null, [value, refs]);
		});
		return result;
	}
	const result = Object.create(Object.getPrototypeOf(source));
	refs.set(source, result);
	for (const key of Reflect.ownKeys(source)) {
		const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
		if ("value" in descriptor) descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
		Reflect.defineProperty(result, key, descriptor);
	}
	return result;
}
/** Deeply compare arrays, dates, regexps, buffers, and plain object fields. */
function deepEqual(a, b, strict) {
	if (a === b) return true;
	if (!strict && isNullable(a) && isNullable(b)) return true;
	if (typeof a !== typeof b) return false;
	if (typeof a !== "object") return false;
	if (!a || !b) return false;
	function check(test, then) {
		return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
	}
	return check(Array.isArray, (a, b) => a.length === b.length && a.every((item, index) => deepEqual(item, b[index]))) ?? check(is("Date"), (a, b) => a.valueOf() === b.valueOf()) ?? check(is("RegExp"), (a, b) => a.source === b.source && a.flags === b.flags) ?? check(isArrayBufferLike, (a, b) => {
		if (a.byteLength !== b.byteLength) return false;
		const viewA = new Uint8Array(a);
		const viewB = new Uint8Array(b);
		for (let i = 0; i < viewA.length; i++) if (viewA[i] !== viewB[i]) return false;
		return true;
	}) ?? Object.keys({
		...a,
		...b
	}).every((key) => deepEqual(a[key], b[key], strict));
}
function tokenize(source, delimiters, delimiter) {
	const output = [];
	let state = 0;
	for (let i = 0; i < source.length; i++) {
		const code = source.charCodeAt(i);
		if (code >= 65 && code <= 90) {
			if (state === 1) {
				const next = source.charCodeAt(i + 1);
				if (next >= 97 && next <= 122) output.push(delimiter);
				output.push(code + 32);
			} else {
				if (state !== 0) output.push(delimiter);
				output.push(code + 32);
			}
			state = 1;
		} else if (code >= 97 && code <= 122) {
			output.push(code);
			state = 2;
		} else if (delimiters.includes(code)) {
			if (state !== 0) output.push(delimiter);
			state = 0;
		} else output.push(code);
	}
	return String.fromCharCode(...output);
}
/** Convert text to dash-delimited parameter case. */
function paramCase(source) {
	return tokenize(source, [45, 95], 45);
}
/** Runtime alias for `paramCase`. */
const hyphenate = paramCase;
/** Time constants plus parsing and formatting helpers. */
var Time;
(function(Time) {
	Time.millisecond = 1;
	Time.second = 1e3;
	Time.minute = Time.second * 60;
	Time.hour = Time.minute * 60;
	Time.day = Time.hour * 24;
	Time.week = Time.day * 7;
	let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
	function setTimezoneOffset(offset) {
		timezoneOffset = offset;
	}
	Time.setTimezoneOffset = setTimezoneOffset;
	function getTimezoneOffset() {
		return timezoneOffset;
	}
	Time.getTimezoneOffset = getTimezoneOffset;
	function getDateNumber(date = /* @__PURE__ */ new Date(), offset) {
		if (typeof date === "number") date = new Date(date);
		if (offset === void 0) offset = timezoneOffset;
		return Math.floor((date.valueOf() / Time.minute - offset) / 1440);
	}
	Time.getDateNumber = getDateNumber;
	function fromDateNumber(value, offset) {
		const date = new Date(value * Time.day);
		if (offset === void 0) offset = timezoneOffset;
		return new Date(+date + offset * Time.minute);
	}
	Time.fromDateNumber = fromDateNumber;
	const numeric = /\d+(?:\.\d+)?/.source;
	const timeRegExp = new RegExp(`^${[
		"w(?:eek(?:s)?)?",
		"d(?:ay(?:s)?)?",
		"h(?:our(?:s)?)?",
		"m(?:in(?:ute)?(?:s)?)?",
		"s(?:ec(?:ond)?(?:s)?)?"
	].map((unit) => `(${numeric}${unit})?`).join("")}$`);
	function parseTime(source) {
		const capture = timeRegExp.exec(source);
		if (!capture) return 0;
		return (parseFloat(capture[1]) * Time.week || 0) + (parseFloat(capture[2]) * Time.day || 0) + (parseFloat(capture[3]) * Time.hour || 0) + (parseFloat(capture[4]) * Time.minute || 0) + (parseFloat(capture[5]) * Time.second || 0);
	}
	Time.parseTime = parseTime;
	function parseDate(date) {
		const parsed = parseTime(date);
		if (parsed) date = Date.now() + parsed;
		else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date}`;
		else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date}`;
		return date ? new Date(date) : /* @__PURE__ */ new Date();
	}
	Time.parseDate = parseDate;
	function format(ms) {
		const abs = Math.abs(ms);
		if (abs >= Time.day - Time.hour / 2) return Math.round(ms / Time.day) + "d";
		else if (abs >= Time.hour - Time.minute / 2) return Math.round(ms / Time.hour) + "h";
		else if (abs >= Time.minute - Time.second / 2) return Math.round(ms / Time.minute) + "m";
		else if (abs >= Time.second) return Math.round(ms / Time.second) + "s";
		return ms + "ms";
	}
	Time.format = format;
	function toDigits(source, length = 2) {
		return source.toString().padStart(length, "0");
	}
	Time.toDigits = toDigits;
	function template(template, time = /* @__PURE__ */ new Date()) {
		return template.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
	}
	Time.template = template;
})(Time || (Time = {}));
//#endregion
//#region ../../vendor/cordis/lib/index.js
/** Ordered collection of disposable values with O(1) deletion by value. */
var DisposableList = class {
	sn = 0;
	map = /* @__PURE__ */ new Map();
	weak = /* @__PURE__ */ new WeakMap();
	get length() {
		return this.map.size;
	}
	push(value) {
		const sn = ++this.sn;
		this.map.set(sn, value);
		this.weak.set(value, sn);
		return () => this.map.delete(sn);
	}
	delete(value) {
		const sn = this.weak.get(value);
		if (!sn) return false;
		return this.map.delete(sn);
	}
	clear() {
		const values = [...this.map.values()];
		this.map.clear();
		return values.reverse();
	}
	[Symbol.iterator]() {
		return this.map.values();
	}
	[Symbol.for("nodejs.util.inspect.custom")]() {
		return [...this];
	}
};
/** Shared symbols used to avoid public property-name collisions. */
const symbols = {
	shadow: Symbol.for("cordis.shadow"),
	receiver: Symbol.for("cordis.receiver"),
	original: Symbol.for("cordis.original"),
	metadata: Symbol.for("cordis.metadata"),
	initHooks: Symbol.for("cordis.initHooks"),
	checkProto: Symbol.for("cordis.checkProto"),
	effect: Symbol.for("cordis.effect"),
	filter: Symbol.for("cordis.filter"),
	isolate: Symbol.for("cordis.isolate"),
	intercept: Symbol.for("cordis.intercept"),
	init: Symbol.for("cordis.init"),
	check: Symbol.for("cordis.check"),
	config: Symbol.for("cordis.config"),
	invoke: Symbol.for("cordis.invoke"),
	extend: Symbol.for("cordis.extend"),
	tracker: Symbol.for("cordis.tracker"),
	resolveConfig: Symbol.for("cordis.resolveConfig")
};
const GeneratorFunction = function* () {}.constructor;
const AsyncGeneratorFunction = async function* () {}.constructor;
/** Return true when a plugin callback should be constructed with `new`. */
function isConstructor(func) {
	if (!func.prototype) return false;
	if (func instanceof GeneratorFunction) return false;
	if (AsyncGeneratorFunction !== Function && func instanceof AsyncGeneratorFunction) return false;
	return true;
}
/** Merge two prototype chains while preserving descriptors from `proto1`. */
function joinPrototype(proto1, proto2) {
	if (proto1 === Object.prototype) return proto2;
	const result = Object.create(joinPrototype(Object.getPrototypeOf(proto1), proto2));
	for (const key of Reflect.ownKeys(proto1)) Object.defineProperty(result, key, Object.getOwnPropertyDescriptor(proto1, key));
	return result;
}
/** Return true for non-null objects and functions. */
function isObject(value) {
	return value && (typeof value === "object" || typeof value === "function");
}
/** Find a property descriptor by walking an object's prototype chain. */
function getPropertyDescriptor(target, prop) {
	let proto = target;
	while (proto) {
		const desc = Reflect.getOwnPropertyDescriptor(proto, prop);
		if (desc) return desc;
		proto = Object.getPrototypeOf(proto);
	}
}
/** Wrap services/functions so method calls see the caller's active context. */
function getTraceable(ctx, value) {
	if (!isObject(value)) return value;
	if (Object.hasOwn(value, symbols.shadow)) return Object.getPrototypeOf(value);
	const tracker = value[symbols.tracker];
	if (!tracker) return value;
	return createTraceable(ctx, value, tracker);
}
/** Return a proxy that overlays readonly or writable properties onto a target. */
function withProps(target, props) {
	if (!props) return target;
	return new Proxy(target, {
		get: (target, prop, receiver) => {
			if (prop in props && prop !== "constructor") return Reflect.get(props, prop, receiver);
			return Reflect.get(target, prop, receiver);
		},
		set: (target, prop, value, receiver) => {
			if (prop in props && prop !== "constructor") return Reflect.set(props, prop, value, receiver);
			return Reflect.set(target, prop, value, receiver);
		}
	});
}
function withProp(target, prop, value) {
	return withProps(target, Object.defineProperty(Object.create(null), prop, {
		value,
		writable: false
	}));
}
function createShadow(ctx, target, property, receiver) {
	if (!property) return receiver;
	const origin = Reflect.getOwnPropertyDescriptor(target, property)?.value;
	if (!origin) return receiver;
	return withProp(receiver, property, ctx.extend({ [symbols.shadow]: origin }));
}
function createShadowMethod(ctx, value, outer, shadow) {
	return new Proxy(value, { apply: (target, thisArg, args) => {
		if (thisArg === outer) thisArg = shadow;
		return getTraceable(ctx, Reflect.apply(target, thisArg, args));
	} });
}
function createTraceable(ctx, value, tracker) {
	if (ctx[symbols.shadow] && !tracker.noShadow) ctx = Object.getPrototypeOf(ctx);
	const proxy = new Proxy(value, {
		get: (target, prop, receiver) => {
			if (prop === symbols.original) return target;
			if (prop === tracker.property) return ctx;
			if (typeof prop === "symbol") return Reflect.get(target, prop, receiver);
			if (tracker.associate && ctx.reflect.props[`${tracker.associate}.${prop}`]) return Reflect.get(ctx, `${tracker.associate}.${prop}`, withProp(ctx, symbols.receiver, receiver));
			let shadow, innerValue;
			const desc = getPropertyDescriptor(target, prop);
			if (desc && "value" in desc) innerValue = desc.value;
			else {
				shadow = createShadow(ctx, target, tracker.property, receiver);
				innerValue = Reflect.get(target, prop, shadow);
			}
			const innerTracker = innerValue?.[symbols.tracker];
			if (innerTracker) return createTraceable(ctx, innerValue, innerTracker);
			else if (!tracker.noShadow && typeof innerValue === "function") {
				shadow ??= createShadow(ctx, target, tracker.property, receiver);
				return createShadowMethod(ctx, innerValue, receiver, shadow);
			} else return innerValue;
		},
		set: (target, prop, value, receiver) => {
			if (prop === symbols.original) return false;
			if (prop === tracker.property) return false;
			if (typeof prop === "symbol") return Reflect.set(target, prop, value, receiver);
			if (tracker.associate && ctx.reflect.props[`${tracker.associate}.${prop}`]) return Reflect.set(ctx, `${tracker.associate}.${prop}`, value, withProp(ctx, symbols.receiver, receiver));
			const shadow = createShadow(ctx, target, tracker.property, receiver);
			return Reflect.set(target, prop, value, shadow);
		},
		apply: (target, thisArg, args) => {
			return applyTraceable(proxy, target, thisArg, args);
		}
	});
	return proxy;
}
function applyTraceable(proxy, value, thisArg, args) {
	if (!value[symbols.invoke]) return Reflect.apply(value, thisArg, args);
	return value[symbols.invoke].apply(proxy, args);
}
/** Create a callable service object that dispatches through `symbols.invoke`. */
function createCallable(name, proto, tracker) {
	const self = function(...args) {
		return applyTraceable(createTraceable(self["ctx"], self, tracker), self, this, args);
	};
	defineProperty(self, "name", name);
	return Object.setPrototypeOf(self, proto);
}
function handleError(info, reason, getOuterStack) {
	const innerLines = info.error.stack.split("\n");
	if (typeof reason?.stack !== "string") {
		const outerError = new Error(reason);
		const lines = outerError.stack.split("\n");
		lines.splice(1, Infinity, ...getOuterStack());
		outerError.stack = lines.join("\n");
		throw outerError;
	}
	const lines = reason.stack.split("\n");
	let index = lines.indexOf(innerLines[2]);
	if (index === -1) throw reason;
	index -= info.offset;
	while (index > 0) {
		if (!lines[index - 1].endsWith(" (<anonymous>)")) break;
		index -= 1;
	}
	lines.splice(index, Infinity, ...getOuterStack());
	reason.stack = lines.join("\n");
	throw reason;
}
/** Run a callback and splice outer call-site frames into thrown async errors. */
function composeError(callback, getOuterStack = buildOuterStack()) {
	const info = {
		offset: 1,
		error: /* @__PURE__ */ new Error()
	};
	try {
		const result = callback(info);
		if (isObject(result) && "then" in result) return result.then(void 0, (reason) => handleError(info, reason, getOuterStack));
		else return result;
	} catch (reason) {
		handleError(info, reason, getOuterStack);
	}
}
/** Capture a lazy stack-frame supplier for later error composition. */
function buildOuterStack(offset = 0) {
	const outerError = /* @__PURE__ */ new Error();
	return () => outerError.stack.split("\n").slice(3 + offset);
}
/**
* Return whether an event result should stop a bail-style dispatch.
*
* @param value — a listener's return value.
* @returns `true` unless `value` is `null`, `false`, or `undefined`.
*/
function isBailed(value) {
	return value !== null && value !== false && value !== void 0;
}
/**
* Event bus installed as `ctx.events` and mixed into every context.
*
* The service supports concurrent, synchronous, serial, bail, and waterfall
* dispatch and automatically disposes listeners with their owning fiber.
*/
var EventsService = class {
	ctx;
	_hooks = {};
	constructor(ctx) {
		this.ctx = ctx;
		defineProperty(this, symbols.tracker, {
			property: "ctx",
			noShadow: true
		});
		this.on("internal/listener", function(name, listener, options) {
			if (name === "internal/update" && !options.global) return (this.fiber._hooks["internal/update"] ??= new DisposableList())[options.prepend ? "unshift" : "push"](listener);
		});
		this.on("internal/update", function(config, noSave, next) {
			const cbs = [...this._hooks["internal/update"] || []];
			const _next = () => {
				return (cbs.shift() ?? next).call(this, config, noSave, _next);
			};
			return _next();
		}, {
			global: true,
			prepend: true
		});
	}
	/**
	* Resolve listeners for one dispatch and apply context filtering.
	*
	* @param type — the dispatch mode, reported on `internal/dispatch`.
	* @param args — the raw dispatch arguments; consumed up to the event name.
	* @returns the matching listener callbacks, bound to the dispatch `this`.
	*/
	dispatch(type, args) {
		const thisArg = typeof args[0] === "object" || typeof args[0] === "function" ? args.shift() : null;
		const name = args.shift();
		if (!name.startsWith("internal/")) this.emit("internal/dispatch", type, name, args, thisArg);
		const filter = thisArg?.[Context.filter];
		return (this._hooks[name] || []).filter((hook) => hook.global || !filter || filter.call(thisArg, hook.ctx)).map((hook) => hook.callback.bind(thisArg));
	}
	/**
	* Run listeners concurrently and wait for all of them.
	*
	* @param args — optional `this`, the event name, then listener arguments.
	* @returns a promise resolving once every listener has settled.
	*/
	async parallel(...args) {
		const errors = (await Promise.allSettled(this.dispatch("emit", args).map(async (cb) => cb(...args)))).filter((result) => result.status === "rejected");
		if (errors.length) throw new AggregateError(errors.map((error) => error.reason));
	}
	/**
	* Run listeners synchronously without waiting for returned promises.
	*
	* @param args — optional `this`, the event name, then listener arguments.
	*/
	emit(...args) {
		this.dispatch("emit", args).map((cb) => cb(...args));
	}
	/**
	* Run listeners in order, awaiting each, until one returns a bail value.
	*
	* @param args — optional `this`, the event name, then listener arguments.
	* @returns the first bail value (see {@link isBailed}), if any.
	*/
	async serial(...args) {
		for (const cb of this.dispatch("serial", args)) {
			const result = await cb(...args);
			if (isBailed(result)) return result;
		}
	}
	/**
	* Run listeners synchronously until one returns a bail value.
	*
	* @param args — optional `this`, the event name, then listener arguments.
	* @returns the first bail value (see {@link isBailed}), if any.
	*/
	bail(...args) {
		for (const cb of this.dispatch("bail", args)) {
			const result = cb(...args);
			if (isBailed(result)) return result;
		}
	}
	/**
	* Compose listeners around the final `next` callback.
	*
	* The last dispatch argument is treated as the innermost `next`. Listeners
	* run outermost-first; a listener that does not call `next()` vetoes the
	* rest of the chain, including the built-in behavior.
	*
	* @param args — optional `this`, the event name, listener arguments, then `next`.
	* @returns the outermost listener's return value.
	*/
	waterfall(...args) {
		const cbs = this.dispatch("waterfall", args);
		const inner = args.pop();
		const next = () => {
			return (cbs.shift() ?? inner)(...args);
		};
		args.push(next);
		return next();
	}
	/**
	* Store a listener record as an effect on the current fiber.
	*
	* @param label — effect label shown in fiber diagnostics.
	* @param hooks — the listener list for one event.
	* @param callback — the listener to store.
	* @param options — placement and filtering options.
	* @returns a disposer that unregisters the listener.
	*/
	register(label, hooks, callback, options) {
		const method = options.prepend ? "unshift" : "push";
		return this.ctx.fiber.effect(() => {
			hooks[method]({
				ctx: this.ctx,
				callback,
				...options
			});
			return () => this.unregister(hooks, callback);
		}, label);
	}
	/**
	* Remove a stored listener record.
	*
	* @param hooks — the listener list for one event.
	* @param callback — the listener to remove.
	* @returns `true` if the listener was found and removed.
	*/
	unregister(hooks, callback) {
		const index = hooks.findIndex((hook) => hook.callback === callback);
		if (index >= 0) {
			hooks.splice(index, 1);
			return true;
		}
	}
	/**
	* Register an event listener owned by the current fiber.
	*
	* The listener is removed automatically when the fiber unloads. Throws
	* `CordisError('INACTIVE_EFFECT')` if the fiber is already disposed.
	*
	* @param name — the event name to listen for.
	* @param listener — called with the dispatch arguments.
	* @param options — listener options; a boolean is shorthand for `prepend`.
	* @returns a disposer removing the listener; `true` if it was still registered.
	*/
	on(name, listener, options) {
		if (typeof options !== "object") options = { prepend: options };
		this.ctx.fiber.assertActive();
		listener = this.ctx.reflect.bind(listener);
		const result = this.bail(this.ctx, "internal/listener", name, listener, options);
		if (result) return result;
		const hooks = this._hooks[name] ||= [];
		const label = `ctx.on(${typeof name === "string" ? JSON.stringify(name) : name.toString()})`;
		return this.register(label, hooks, listener, options);
	}
	/**
	* Register an event listener that disposes itself after the first call.
	*
	* @param name — the event name to listen for.
	* @param listener — called at most once with the dispatch arguments.
	* @param options — listener options; a boolean is shorthand for `prepend`.
	* @returns a disposer removing the listener; `true` if it was still registered.
	*/
	once(name, listener, options) {
		const dispose = this.on(name, function(...args) {
			dispose();
			return listener.apply(this, args);
		}, options);
		return dispose;
	}
};
/** Built-in placeholder formatters used by `Logger.format()`. */
const defaultFormatters = {
	s: (value) => String(value),
	d: (value) => Math.trunc(Number(value)),
	i: (value) => Math.trunc(Number(value)),
	f: (value) => Number(value),
	o: (value) => JSON.stringify(value),
	O: (value) => JSON.stringify(value),
	c: () => "",
	C: (value, exporter, message) => {
		return Logger.color(exporter, Logger.code(message.name, exporter.colors), value);
	}
};
function isAggregateError(error) {
	return error instanceof Error && Array.isArray(error["errors"]);
}
/** Logger facade for one named subsystem. */
var Logger = class {
	service;
	static color(exporter, code, value, decoration = "") {
		if (!exporter.colors) return "" + value;
		return `\u001b[3${code < 8 ? code : "8;5;" + code}${exporter.colors >= 2 ? decoration : ""}m${value}\u001b[0m`;
	}
	static code(name, level) {
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = (hash << 3) - hash + name.charCodeAt(i) + 13;
			hash |= 0;
		}
		const colors = !level ? [] : level >= 2 ? c256 : c16;
		return colors[Math.abs(hash) % colors.length];
	}
	static format(exporter, message) {
		const args = message.args.slice();
		if (args[0] instanceof Error) {
			args[0] = args[0].stack || args[0].message;
			args.unshift("%s");
		} else if (typeof args[0] !== "string") args.unshift("%o");
		let format = args.shift();
		format = format.replace(/%([a-zA-Z%])/g, (match, char) => {
			if (match === "%%") return "%";
			const formatter = exporter.formatters?.[char] ?? defaultFormatters[char];
			if (typeof formatter === "function") return formatter(args.shift(), exporter, message);
			return match;
		});
		const oFormatter = exporter.formatters?.o ?? defaultFormatters.o;
		for (let arg of args) {
			if (typeof arg === "object" && arg) arg = oFormatter(arg, exporter, message);
			format += " " + arg;
		}
		const { maxLength = 10240 } = exporter;
		return format.split(/\r?\n/g).map((line) => {
			return line.slice(0, maxLength) + (line.length > maxLength ? "..." : "");
		}).join("\n");
	}
	constructor(options, service) {
		this.service = service;
		Object.assign(this, options);
		this.error = this._method("error", 0);
		this.info = this._method("info", 1);
		this.warn = this._method("warn", 2);
		this.debug = this._method("debug", 3);
	}
	_method(type, level) {
		return (...args) => {
			if (args.length === 1 && args[0] instanceof Error) {
				if (args[0].cause) this[type](args[0].cause);
				else if (isAggregateError(args[0])) {
					args[0].errors.forEach((error) => this[type](error));
					return;
				}
			}
			const sn = ++this.service._snMessage;
			const ts = Date.now();
			for (const exporter of this.service.exporters.values()) {
				if ((exporter.levels?.[this.name] ?? exporter.levels?.default ?? this.level ?? 1) < level) continue;
				const message = {
					sn,
					ts,
					type,
					level,
					name: this.name,
					...this.meta,
					args
				};
				exporter.export(message);
			}
		};
	}
};
/** ANSI 16-color palette indexes used for logger name coloring. */
const c16 = [
	6,
	2,
	3,
	4,
	5,
	1
];
/** ANSI 256-color palette indexes used for logger name coloring. */
const c256 = [
	20,
	21,
	26,
	27,
	32,
	33,
	38,
	39,
	40,
	41,
	42,
	43,
	44,
	45,
	56,
	57,
	62,
	63,
	68,
	69,
	74,
	75,
	76,
	77,
	78,
	79,
	80,
	81,
	92,
	93,
	98,
	99,
	112,
	113,
	129,
	134,
	135,
	148,
	149,
	160,
	161,
	162,
	163,
	164,
	165,
	166,
	167,
	168,
	169,
	170,
	171,
	172,
	173,
	178,
	179,
	184,
	185,
	196,
	197,
	198,
	199,
	200,
	201,
	202,
	203,
	204,
	205,
	206,
	207,
	208,
	209,
	214,
	215,
	220,
	221
];
/**
* Built-in logging service.
*
* Call `ctx.logger()` to create a named logger, or call `ctx.logger.info()`
* directly to log with the current fiber-derived name.
*/
var LoggerService = class LoggerService {
	bufferSize = 1e3;
	buffer = [];
	ctx;
	_snMessage = 0;
	_snExporter = 0;
	exporters = /* @__PURE__ */ new Map();
	constructor(ctx) {
		const tracker = {
			property: "ctx",
			noShadow: true
		};
		const self = createCallable("logger", joinPrototype(Object.getPrototypeOf(this), Function.prototype), tracker);
		Object.assign(self, this);
		self.ctx = ctx;
		defineProperty(self, symbols.tracker, tracker);
		self.exporter({
			colors: 3,
			export: (message) => {
				self.buffer.push(message);
				if (self.buffer.length > self.bufferSize) self.buffer = self.buffer.slice(-self.bufferSize);
			}
		});
		return self;
	}
	/**
	* Register an exporter and dispose it with the current fiber.
	*
	* @param exporter — the sink that receives structured log messages.
	* @returns a disposer that removes the exporter.
	*/
	exporter(exporter) {
		return this.ctx.effect(() => {
			this.exporters.set(++this._snExporter, exporter);
			return () => this.exporters.delete(this._snExporter);
		}, "ctx.logger.exporter()");
	}
	_resolveConfig() {
		let intercept = this.ctx[symbols.intercept];
		const configs = [];
		while ("logger" in intercept) {
			if (Object.hasOwn(intercept, "logger")) configs.unshift(intercept["logger"]);
			intercept = Object.getPrototypeOf(intercept);
		}
		return Object.assign({}, ...configs);
	}
	[symbols.invoke](name) {
		const config = this._resolveConfig();
		const fiber = (this.ctx[symbols.shadow] ?? this.ctx).fiber;
		name ??= config.name;
		name ??= hyphenate(fiber.name);
		return new Logger({
			name,
			level: config.level,
			meta: { fiber: new WeakRef(fiber) }
		}, this);
	}
	static {
		for (const type of [
			"error",
			"info",
			"warn",
			"debug"
		]) LoggerService.prototype[type] = function(...args) {
			return this()[type](...args);
		};
	}
};
function enhanceError(error) {
	const lines = error.stack.split("\n");
	lines.splice(0, 2, `Error: ${error.message}`);
	error.stack = lines.join("\n");
	return error;
}
const RESERVED_WORDS = ["prototype", "then"];
function isSpecialProperty(prop) {
	return typeof prop === "symbol" || RESERVED_WORDS.includes(prop) || parseInt(prop).toString() === prop || prop.startsWith("_");
}
/**
* Reflection and service-resolution layer installed as `ctx.reflect`.
*
* This service powers the context proxy, service registration, accessors, and
* the mixins that expose core service methods directly on `ctx`.
*/
var ReflectService = class {
	ctx;
	/** Proxy traps implementing service resolution for every context object. */
	static handler = {
		get: (target, prop, ctx) => {
			if (isSpecialProperty(prop)) return Reflect.get(target, prop, ctx);
			if (Reflect.has(target, prop)) return getTraceable(ctx, Reflect.get(target, prop, ctx));
			const error = /* @__PURE__ */ new Error(`cannot get property "${prop}" without inject`);
			try {
				const def = target.reflect.props[prop];
				if (def?.type === "accessor") return def.get.call(ctx, ctx[symbols.receiver], error);
				if (!ctx.fiber.runtime) return ctx.reflect.get(prop, false);
				return ctx.events.waterfall("internal/get", ctx, prop, error, () => {
					const key = target[symbols.isolate][prop];
					let fiber = (ctx[symbols.shadow] ?? ctx).fiber;
					while (true) {
						const impl = fiber.store?.[prop];
						if (impl) return getTraceable(ctx, impl.value);
						if (prop in fiber.inject) {
							error.message = `cannot get required service "${prop}" in inactive context`;
							throw error;
						}
						if (!fiber.runtime) throw error;
						if (fiber.parent[symbols.isolate][prop] !== key) throw error;
						fiber = fiber.parent.fiber;
					}
				});
			} catch (e) {
				throw e === error ? enhanceError(e) : e;
			}
		},
		set: (target, prop, value, ctx) => {
			if (isSpecialProperty(prop)) return Reflect.set(target, prop, value, ctx);
			const error = /* @__PURE__ */ new Error(`cannot set property "${prop}" without provide`);
			const def = target.reflect.props[prop];
			if (!def) {
				if (!ctx.fiber.runtime) return Reflect.set(target, prop, value, ctx);
				throw enhanceError(error);
			}
			try {
				if (def.type === "accessor") {
					if (!def.set) return false;
					return def.set.call(ctx, value, ctx[symbols.receiver], error);
				}
				return ctx.events.waterfall("internal/set", ctx, prop, value, error, () => {
					return ctx.reflect.set(prop, value, error);
				});
			} catch (e) {
				throw e === error ? enhanceError(e) : e;
			}
		},
		has: (target, prop) => {
			if (isSpecialProperty(prop)) return Reflect.has(target, prop);
			if (Reflect.has(target, prop)) return true;
			return !!target.reflect.props[prop];
		}
	};
	/** Service implementations, keyed by isolation label. */
	store = Object.create(null);
	/** Declared context properties (services and accessors), by name. */
	props = Object.create(null);
	constructor(ctx) {
		this.ctx = ctx;
		defineProperty(this, symbols.tracker, {
			property: "ctx",
			noShadow: true
		});
		this.mixin("reflect", [
			"get",
			"set",
			"provide",
			"accessor",
			"mixin"
		]);
		this.mixin("fiber", ["runtime", "effect"]);
		this.mixin("registry", ["inject", "plugin"]);
		this.mixin("events", [
			"on",
			"once",
			"parallel",
			"emit",
			"serial",
			"bail",
			"waterfall"
		]);
	}
	/**
	* Read a service from the store without the inject requirement.
	*
	* @param name — the service name.
	* @param strict — when `true`, only return implementations whose providing
	* fiber is currently active.
	* @returns the service value, or `undefined` when not (yet) provided.
	*/
	get(name, strict = true) {
		return getTraceable(this.ctx, this._getImpl(name, strict)?.value);
	}
	_getImpl(name, strict = true) {
		const key = this.ctx[symbols.isolate][name];
		const impl = key && this.store[key];
		if (!impl) return;
		if (strict && impl.fiber.state !== 2) return;
		return impl;
	}
	/**
	* Overwrite a provided service's value.
	*
	* @param name — the service name.
	* @param value — the new service value.
	* @param error — carrier for the caller stack in diagnostics.
	* @returns `true` on success.
	* @throws when `name` was never provided, or was provided by another fiber.
	*/
	set(name, value, error) {
		const key = this.ctx[symbols.isolate][name];
		const impl = this.store[key];
		if (!impl) throw new Error(`cannot set property "${name}" without provide`);
		if (impl.fiber !== this.ctx.fiber) throw new Error(`cannot set property "${name}" in multiple fibers`);
		impl.value = value;
		return true;
	}
	/**
	* Register a service implementation owned by the current fiber.
	*
	* See the `ctx.provide()` overload above for the full contract.
	*
	* @param name — the service name.
	* @param value — the service value.
	* @param check — optional availability predicate for dependents.
	* @returns a disposer that unregisters the service.
	*/
	provide(name, value, check) {
		return this.ctx.fiber.effect(() => {
			if (!this.props[name]) this.props[name] ??= { type: "service" };
			else if (this.props[name].type !== "service") throw new Error(`property "${name}" is already declared as ${this.props[name].type}`);
			this.props[name] = { type: "service" };
			this.ctx.root[symbols.isolate][name] ??= Symbol(name);
			const key = this.ctx[symbols.isolate][name];
			const impl = {
				name,
				value,
				fiber: this.ctx.fiber,
				check
			};
			if (this.store[key]) throw new Error(`service "${name}" has been registered at <${this.store[key].fiber.name}>`);
			this.store[key] = impl;
			this.ctx.fiber.store[name] = impl;
			if (this.ctx.fiber.state === 2) this.notify([name]);
			return async () => {
				delete this.store[key];
				const fibers = this.notify([name]);
				await Promise.allSettled(fibers.map((fiber) => fiber.await()));
				delete this.ctx.fiber.store[name];
			};
		}, `ctx.provide(${JSON.stringify(name)})`);
	}
	/**
	* Re-evaluate every fiber that requires one of the given services.
	*
	* @param names — the service names that changed.
	* @param filter — restricts notification to matching isolation scopes.
	* @returns the fibers whose dependency state was refreshed.
	*/
	notify(names, filter = (ctx, name) => ctx[symbols.isolate][name] === this.ctx[symbols.isolate][name]) {
		const fibers = [];
		for (const runtime of this.ctx.registry.values()) for (const fiber of runtime.fibers) {
			let hasUpdate = false;
			for (const name of names) {
				if (!(name in fiber.inject)) continue;
				if (!filter(fiber.ctx, name)) continue;
				hasUpdate = true;
				fiber._checkImpl(name);
			}
			if (!hasUpdate) continue;
			fiber._refresh();
			fibers.push(fiber);
		}
		for (const name of names) {
			const self = Object.create(this.ctx);
			self[symbols.filter] = (target) => filter(target, name);
			this.ctx.events.emit(self, "internal/service", name, this._getImpl(name, false)?.value);
		}
		return fibers;
	}
	/**
	* Define a computed context property backed by get/set hooks.
	*
	* @param name — the context property name.
	* @param options — the `get` hook and optional `set` hook.
	* @returns a disposer that removes the accessor.
	*/
	accessor(name, options) {
		return this.ctx.fiber.effect(() => {
			if (name in this.props) throw new Error(`property "${name}" is already declared as ${this.props[name].type}`);
			this.props[name] = {
				type: "accessor",
				...options
			};
			return () => delete this.props[name];
		}, `ctx.accessor(${JSON.stringify(name)})`);
	}
	/**
	* Expose selected members of a service directly on `ctx`.
	*
	* See the `ctx.mixin()` overload above for the full contract.
	*
	* @param source — a context property name or a source object.
	* @param mixins — keys to forward, or a source-key → ctx-key map.
	* @returns a disposer that removes all created accessors.
	*/
	mixin(source, mixins) {
		const self = this;
		return this.ctx.fiber.effect(function* () {
			const entries = Array.isArray(mixins) ? mixins.map((key) => [key, key]) : Object.entries(mixins);
			const getTarget = (ctx, error) => {
				return ctx[source];
			};
			for (const [key, value] of entries) yield self.accessor(value, {
				get(receiver, error) {
					const service = getTarget(this, error);
					if (isNullable(service)) return service;
					const mixin = receiver ? withProps(receiver, service) : service;
					const value = Reflect.get(service, key, mixin);
					if (typeof value !== "function") return value;
					return value.bind(mixin ?? service);
				},
				set(value, receiver, error) {
					const service = getTarget(this, error);
					const mixin = receiver ? withProps(receiver, service) : service;
					return Reflect.set(service, key, value, mixin);
				}
			});
		}, `ctx.mixin(${JSON.stringify(source)})`);
	}
	/**
	* Attach this context's tracing wrapper to a value.
	*
	* @param value — the value to wrap.
	* @returns the traceable wrapper (or the value itself when not applicable).
	*/
	trace(value) {
		return getTraceable(this.ctx, value);
	}
	/**
	* Wrap a callback so calls trace `this` and arguments to this context.
	*
	* @param callback — the function to wrap.
	* @returns a proxy delegating to `callback` with traced values.
	*/
	bind(callback) {
		return new Proxy(callback, {
			apply: (target, thisArg, args) => {
				return Reflect.apply(target, this.trace(thisArg), args.map((arg) => this.trace(arg)));
			},
			construct: (target, args, newTarget) => {
				return Reflect.construct(target, args.map((arg) => this.trace(arg)), newTarget);
			}
		});
	}
};
const kValidationError$1 = Symbol.for("ValidationError");
/** Error raised when plugin configuration fails standard-schema validation. */
var ValidationError$1 = class extends TypeError {
	name = "ValidationError";
	/**
	* Build the aggregated message from schema issues.
	*
	* @param issues — the standard-schema issues, one message line each.
	*/
	constructor(issues) {
		super(`invalid config:\n` + issues.map((issue) => {
			if (issue.path) return `  - ${issue.message} (at ${issue.path.join(".")})`;
			else return `  - ${issue.message}`;
		}).join("\n"));
	}
};
Object.defineProperty(ValidationError$1.prototype, kValidationError$1, { value: true });
/**
* Validate and normalize config for a plugin runtime before it starts.
*
* @param runtime — the plugin runtime whose `Config` schema to apply.
* @param config — the raw user config.
* @returns the validated config, or `config` unchanged if the runtime has no schema.
* @throws {ValidationError} when validation reports issues.
*/
function resolveConfig(runtime, config) {
	if (!runtime.Config) return config;
	const result = runtime.Config["~standard"].validate(config);
	if ("then" in result) throw new TypeError("Async config validation is not supported");
	if (result.issues) throw new ValidationError$1(result.issues);
	else return result.value;
}
const effectInertia = /* @__PURE__ */ new WeakMap();
function runDisposable(dispose) {
	const result = dispose();
	return effectInertia.get(dispose)?.() ?? result;
}
/** Notify plugin teardown without allowing one observer to break ownership cleanup. */
function emitPluginDisposed(context, fiber) {
	const args = ["internal/plugin", fiber];
	let callbacks;
	try {
		callbacks = context.events.dispatch("emit", args);
	} catch (error) {
		context.logger.error(error);
		return;
	}
	for (const callback of callbacks) try {
		const returned = callback(...args);
		Promise.resolve(returned).catch((error) => context.logger.error(error));
	} catch (error) {
		context.logger.error(error);
	}
}
/** Framework error with a stable machine-readable code. */
var CordisError = class CordisError extends Error {
	code;
	/**
	* @param code — the stable error code; also the default message.
	* @param message — optional human-readable override.
	*/
	constructor(code, message) {
		super(message ?? CordisError.Code[code]);
		this.code = code;
	}
};
/** Cordis error code definitions. */
(function(CordisError) {
	CordisError.Code = { INACTIVE_EFFECT: "cannot create effect on inactive context" };
})(CordisError || (CordisError = {}));
const INACTIVE = "__INACTIVE__";
/**
* Runtime instance of one plugin application.
*
* A fiber tracks dependency state, validated config, lifecycle effects, and
* cleanup for the plugin context returned by `ctx.plugin()`.
*/
var Fiber = class {
	parent;
	inject;
	runtime;
	/** Unique id within the registry; 0 for the root fiber, `null` once disposed. */
	uid;
	/** The context this fiber's plugin runs in (extends the parent context). */
	ctx;
	/** The validated plugin config (updated by `update()`). */
	config;
	/** The raw plugin config, re-resolved before each activation. */
	_config;
	/** Current lifecycle state; transitions emit `internal/status`. */
	state = 0;
	/** Dispose this fiber: unload the plugin, then settle once cleanup finished. */
	dispose;
	/** Snapshot of required service implementations while loaded; `undefined` otherwise. */
	store;
	/** The in-flight load/unload transition, if one is currently running. */
	inertia;
	_hooks = Object.create(null);
	_disposables = new DisposableList();
	context;
	_error;
	_runner;
	_store = Object.create(null);
	/**
	* Create a fiber. Plugin authors normally obtain fibers from `ctx.plugin()`
	* rather than constructing them directly.
	*
	* @param parent — the context the plugin was loaded from.
	* @param config — raw config, validated against the runtime's schema.
	* @param inject — resolved dependency map (service name → intercept config).
	* @param runtime — the shared plugin runtime, or `null` for the root fiber.
	* @param getOuterStack — captures the caller stack for effect diagnostics.
	*/
	constructor(parent, config, inject, runtime, getOuterStack) {
		this.parent = parent;
		this.inject = inject;
		this.runtime = runtime;
		this._config = config;
		const collect = (dispose) => {
			this._disposables.push(dispose);
		};
		if (runtime) {
			this.uid = parent.registry.counter;
			this.ctx = this.context = parent.extend({ fiber: this });
			const injectEntries = Object.entries(this.inject);
			if (injectEntries.length) {
				this.ctx[Context.intercept] = Object.create(parent[Context.intercept]);
				for (const [name, config] of injectEntries) {
					if (isNullable(config)) continue;
					this.ctx[Context.intercept][name] = config;
				}
			}
			this._runner = {
				epoch: INACTIVE,
				getOuterStack,
				execute: function() {
					if (isConstructor(runtime.callback)) {
						const instance = new runtime.callback(this.ctx, this.config);
						for (const hook of instance?.[symbols.initHooks] ?? []) hook();
						return instance?.[symbols.init]?.();
					} else return runtime.callback(this.ctx, this.config);
				},
				collect
			};
			this.dispose = parent.fiber.effect(() => {
				const remove = runtime.fibers.push(this);
				return async () => {
					this.uid = null;
					emitPluginDisposed(this.context, this);
					if (this.ctx.registry.has(runtime.callback)) {
						remove();
						if (!runtime.fibers.length) this.ctx.registry.delete(runtime.callback);
					}
					this._setEpoch(INACTIVE);
					if (!this.inertia) this._updateState(() => {
						this.inertia = this._unload();
						return 5;
					});
					while (this.inertia) await this.inertia;
				};
			}, "ctx.plugin()");
			try {
				this.context.emit("internal/plugin", this);
			} catch (error) {
				Promise.resolve(this.dispose()).catch((reason) => this.ctx.logger.error(reason));
				throw error;
			}
			if (this.uid !== null && parent.fiber.state !== 5) {
				for (const name of Object.keys(this.inject)) this._checkImpl(name);
				this._refresh();
			}
		} else {
			this.uid = 0;
			this.ctx = this.context = parent;
			this.state = 2;
			this.store = Object.create(null);
			this._runner = {
				epoch: "",
				getOuterStack,
				execute: () => {},
				collect
			};
			this.dispose = () => this.restart();
		}
	}
	/** The plugin's display name, inherited from the nearest named ancestor, else `'root'`. */
	get name() {
		let fiber = this;
		do {
			if (fiber.runtime?.name) return fiber.runtime.name;
			fiber = fiber.parent.fiber;
		} while (fiber !== fiber.parent.fiber);
		return "root";
	}
	/**
	* Throw if the fiber has already been disposed.
	*
	* @returns nothing when the fiber is still active.
	* @throws {CordisError} `INACTIVE_EFFECT` when the fiber's uid has been cleared.
	*/
	assertActive() {
		if (this.uid !== null) return;
		throw new CordisError("INACTIVE_EFFECT");
	}
	_execute(runner) {
		const oldEpoch = runner.epoch;
		return composeError((info) => {
			const safeCollect = (dispose) => {
				if (typeof dispose === "function") runner.collect(dispose);
				else if (!isNullable(dispose)) throw new TypeError("Invalid effect");
			};
			const effect = runner.execute.call(this);
			if (typeof effect === "function") return runner.collect(effect);
			else if (isNullable(effect)) {} else if (!isObject(effect)) throw new TypeError("Invalid effect");
			else if ("then" in effect) return effect.then(safeCollect);
			else if (Symbol.iterator in effect) {
				info.error = /* @__PURE__ */ new Error();
				const iter = effect[Symbol.iterator]();
				while (true) {
					const result = iter.next();
					safeCollect(result.value);
					if (result.done) return;
				}
			} else if (Symbol.asyncIterator in effect) {
				const iter = effect[Symbol.asyncIterator]();
				return (async () => {
					await Promise.resolve();
					info.error = /* @__PURE__ */ new Error();
					while (true) {
						if (runner.epoch !== oldEpoch) return;
						const result = await iter.next();
						safeCollect(result.value);
						if (result.done) return;
					}
				})();
			} else throw new TypeError("Invalid effect");
		}, runner.getOuterStack);
	}
	effect(execute, label = "anonymous") {
		this.assertActive();
		if (this.state === 5) throw new CordisError("INACTIVE_EFFECT");
		const disposables = [];
		let disposing = false;
		let disposalTask;
		const dispose = () => {
			if (disposing) return disposalTask;
			disposing = true;
			let task;
			for (const disposable of disposables.splice(0).reverse()) if (task) task = task.then(() => runDisposable(disposable));
			else {
				const result = runDisposable(disposable);
				if (isObject(result) && "then" in result) task = result;
			}
			return disposalTask = task;
		};
		const meta = {
			label,
			children: []
		};
		const runner = {
			execute,
			epoch: true,
			collect: (dispose) => {
				disposables.push(dispose);
				this._disposables.delete(dispose);
				if (dispose[symbols.effect]) meta.children.push(dispose[symbols.effect]);
			},
			getOuterStack: buildOuterStack()
		};
		let task;
		let executing = true;
		let resolveSetup;
		let rejectSetup;
		let setupBarrier;
		let setupFailed = false;
		let inFlight;
		let removeWrapper = () => false;
		const waitForSetup = () => {
			setupBarrier ??= new Promise((resolve, reject) => {
				resolveSetup = resolve;
				rejectSetup = reject;
			});
			return setupBarrier;
		};
		const disposeAfter = (setup) => {
			return Promise.resolve(setup).then(() => dispose(), async (reason) => {
				await dispose();
				throw reason;
			});
		};
		const finalizeDisposal = (callback) => {
			let result;
			try {
				result = callback();
			} catch (error) {
				removeWrapper();
				throw error;
			}
			if (isObject(result) && "then" in result) {
				const pending = Promise.resolve(result).finally(() => {
					removeWrapper();
					if (inFlight === pending) inFlight = void 0;
				});
				return inFlight = pending;
			}
			removeWrapper();
			return result;
		};
		const wrapper = defineProperty(() => {
			if (!runner.epoch) return setupFailed ? inFlight : void 0;
			runner.epoch = false;
			return finalizeDisposal(() => {
				if (executing) return disposeAfter(waitForSetup());
				return task ? disposeAfter(task) : dispose();
			});
		}, symbols.effect, meta);
		effectInertia.set(wrapper, () => inFlight);
		removeWrapper = this._disposables.push(wrapper);
		try {
			task = this._execute(runner);
		} catch (reason) {
			executing = false;
			setupFailed = true;
			runner.epoch = false;
			let cleanup;
			try {
				cleanup = finalizeDisposal(dispose);
			} finally {
				rejectSetup?.(reason);
			}
			if (isObject(cleanup) && "then" in cleanup) cleanup.catch((error) => this.ctx.logger.error(error));
			throw reason;
		}
		executing = false;
		if (setupBarrier) Promise.resolve(task).then(resolveSetup, rejectSetup);
		task?.catch(() => {
			if (!runner.epoch) return dispose();
			return finalizeDisposal(dispose);
		}).catch((error) => this.ctx.logger.error(error));
		const disposeAsync = () => {
			if (!runner.epoch) return;
			runner.epoch = false;
			return finalizeDisposal(dispose);
		};
		wrapper.then = async (onFulfilled, onRejected) => {
			return Promise.resolve(task).then(() => disposeAsync).then(onFulfilled, onRejected);
		};
		return wrapper;
	}
	/**
	* Return metadata for currently registered effects.
	*
	* @returns one {@link EffectMeta} tree per labeled live effect.
	*/
	getEffects() {
		return [...this._disposables].map((dispose) => dispose[symbols.effect]).filter(Boolean);
	}
	_getState() {
		if (this.uid === null) return 4;
		if (this._error) return 3;
		if (this._runner.epoch !== INACTIVE) return 2;
		return 0;
	}
	_updateState(callback) {
		const oldState = this.state;
		this.state = callback() ?? this._getState();
		if (oldState === this.state) return;
		this.context.emit("internal/status", this, oldState);
		if (oldState !== 2 && this.state !== 2) return;
		for (const key of Reflect.ownKeys(this.ctx.reflect.store)) {
			const impl = this.ctx.reflect.store[key];
			if (impl.fiber !== this) continue;
			this.ctx.reflect.notify([impl.name]);
		}
	}
	_checkImpl(name) {
		const impl = this.ctx.reflect._getImpl(name, true);
		if (!impl) return delete this._store[name];
		try {
			if (impl.check && !impl.check.call(getTraceable(this.ctx, impl.value))) return delete this._store[name];
		} catch (error) {
			impl.fiber.ctx.logger.error(error);
			return delete this._store[name];
		}
		this._store[name] = impl;
	}
	_refresh() {
		let epoch = false;
		epoch = "";
		for (const name of Object.keys(this.inject)) {
			const impl = this._store[name];
			if (!impl) {
				epoch = INACTIVE;
				break;
			}
			epoch += ":" + impl.fiber.uid;
		}
		this._setEpoch(epoch);
	}
	_setEpoch(epoch) {
		const oldEpoch = this._runner.epoch;
		if (epoch === oldEpoch) return;
		this._runner.epoch = epoch;
		if (this.inertia) return;
		this._updateState(() => {
			if (epoch !== INACTIVE && oldEpoch === INACTIVE) {
				this.inertia = this._reload();
				return 1;
			} else {
				this.inertia = this._unload();
				return 5;
			}
		});
	}
	_resolveConfig(config) {
		config = this.context.waterfall(this, "internal/config", config, () => config);
		return this.runtime ? resolveConfig(this.runtime, config) : config;
	}
	async _reload() {
		this.store = { ...this._store };
		const oldEpoch = this._runner.epoch;
		try {
			await Promise.resolve();
			if (this._runner.epoch === oldEpoch) {
				this.config = this._resolveConfig(this._config);
				await this._execute(this._runner);
				this._error = void 0;
			}
		} catch (reason) {
			this.ctx.logger.error(reason);
			this._error = reason;
			this._runner.epoch = INACTIVE;
		}
		this._updateState(() => {
			if (this._runner.epoch === oldEpoch) this.inertia = void 0;
			else {
				this.inertia = this._unload();
				return 5;
			}
		});
	}
	async _unload() {
		await Promise.all(this._disposables.clear().map(async (dispose) => {
			try {
				await composeError(async (info) => {
					await Promise.resolve();
					info.error = /* @__PURE__ */ new Error();
					await runDisposable(dispose);
				}, this._runner.getOuterStack);
			} catch (reason) {
				this.ctx.logger.error(reason);
			}
		}));
		this.store = void 0;
		this._updateState(() => {
			if (this._runner.epoch === INACTIVE) this.inertia = void 0;
			else {
				this.inertia = this._reload();
				return 1;
			}
		});
	}
	/**
	* Wait for current lifecycle work and rethrow startup errors.
	*
	* @returns this fiber, once it has settled into a stable state.
	* @throws the config-validation or plugin-startup error, if any.
	*/
	async await() {
		while (this.inertia) await this.inertia;
		if (this._error) throw this._error;
		return this;
	}
	/**
	* Dispose and immediately reload this plugin with its current config.
	*
	* @returns a promise resolving once the reload settled.
	* @throws {CordisError} `INACTIVE_EFFECT` when the fiber is already disposed.
	*/
	async restart() {
		this.assertActive();
		this._setEpoch(INACTIVE);
		this._refresh();
		await this.await();
	}
	/**
	* Validate and apply new config, then restart the plugin.
	*
	* Runs the `internal/update` waterfall first, so update hooks (and HMR)
	* can veto or replace the restart.
	*
	* @param config — the new raw config; validated before anything restarts.
	* @param noSave — hint for persistence hooks not to write the change back.
	* @returns the update waterfall result; the default restart returns a promise.
	* @throws when validation, an update listener, or the restarted plugin fails.
	*/
	update(config, noSave = false) {
		this.assertActive();
		this._config = config;
		if (this.state !== 2) {
			this._error = void 0;
			this._setEpoch(INACTIVE);
			this._refresh();
			return;
		}
		config = this._resolveConfig(config);
		return this.context.waterfall(this, "internal/update", config, noSave, () => {
			this.config = config;
			this._error = void 0;
			return this.restart();
		});
	}
};
function isApplicable(object) {
	return object && typeof object === "object" && typeof object.apply === "function";
}
/**
* Decorator for declaring service dependencies on classes or class methods.
*
* On classes it contributes to the plugin's static `inject` map. On methods it
* delays the method call until the declared services are available.
*/
/**
* @param name — the required service name.
* @param config — optional intercept config applied for that service.
* @returns the class or method decorator.
*/
function Inject(name, config) {
	return function(value, decorator) {
		if (decorator.kind === "class") {
			if (!Object.hasOwn(value, "inject")) {
				defineProperty(value, "inject", Object.create(Object.getPrototypeOf(value).inject ?? null));
				defineProperty(value.inject, symbols.checkProto, true);
			}
			value.inject[name] = config;
		} else if (decorator.kind === "method") {
			const inject = (value[symbols.metadata] ??= {}).inject ??= Object.create(null);
			inject[name] = config;
			decorator.addInitializer(function() {
				const property = this[symbols.tracker]?.property;
				(this[symbols.initHooks] ??= []).push(() => {
					this.ctx.inject(inject, (ctx) => {
						return value.call(property ? withProps(this, { [property]: ctx }) : this);
					});
				});
			});
		} else throw new Error("@Inject() can only be used on class or class methods");
	};
}
/** Utilities for normalizing plugin dependency declarations. */
(function(Inject) {
	/**
	* Convert array/object/class-inherited inject metadata into a plain map.
	*
	* @param inject — the declaration to normalize; `null`/`undefined` add nothing.
	* @param result — the map to fill (service name → intercept config or `null`).
	* @returns `result`.
	*/
	function resolve(inject, result = Object.create(null)) {
		if (!inject) return result;
		if (Array.isArray(inject)) for (const name of inject) result[name] = null;
		else if (Reflect.has(inject, symbols.checkProto)) {
			Object.assign(result, resolve(Object.getPrototypeOf(inject)));
			for (const name of Object.keys(inject)) result[name] = inject[name] ?? null;
		} else for (const name of Object.keys(inject)) result[name] = inject[name] ?? null;
		return result;
	}
	Inject.resolve = resolve;
})(Inject || (Inject = {}));
/**
* Plugin registry installed as `ctx.registry` and mixed into every context.
*
* It normalizes plugin shapes, tracks plugin runtimes, starts fibers, and
* exposes map-like inspection over active plugin callbacks.
*/
var RegistryService = class {
	ctx;
	_counter = 0;
	_internal = /* @__PURE__ */ new Map();
	constructor(ctx) {
		this.ctx = ctx;
		defineProperty(this, symbols.tracker, {
			property: "ctx",
			noShadow: true
		});
	}
	/** Allocate the next fiber uid (increments on every read). */
	get counter() {
		return ++this._counter;
	}
	/** Number of registered plugin runtimes. */
	get size() {
		return this._internal.size;
	}
	/**
	* Resolve a supported plugin shape to its executable callback.
	*
	* @param plugin — a function, class, or `{ apply }` object plugin.
	* @returns the callback identifying the plugin, or `undefined` if invalid.
	*/
	resolve(plugin) {
		try {
			if (typeof plugin === "function") return plugin;
			if (isApplicable(plugin)) return plugin.apply;
		} catch {}
	}
	/**
	* Look up the runtime record for a plugin.
	*
	* @param plugin — any supported plugin shape.
	* @returns the runtime, or `undefined` when the plugin is not registered.
	*/
	get(plugin) {
		const key = this.resolve(plugin);
		return key && this._internal.get(key);
	}
	/**
	* Check whether a plugin has a registered runtime.
	*
	* @param plugin — any supported plugin shape.
	* @returns `true` when at least one fiber of the plugin exists.
	*/
	has(plugin) {
		const key = this.resolve(plugin);
		return !!key && this._internal.has(key);
	}
	/**
	* Dispose every running fiber for a plugin and remove its runtime record.
	*
	* @param plugin — any supported plugin shape.
	* @returns the removed runtime, or `undefined` when none was registered.
	*/
	delete(plugin) {
		const key = this.resolve(plugin);
		const runtime = key && this._internal.get(key);
		if (!runtime) return;
		this._internal.delete(key);
		for (const fiber of runtime.fibers) fiber.dispose();
		return runtime;
	}
	/** Iterate the registered plugin callbacks. */
	keys() {
		return this._internal.keys();
	}
	/** Iterate the registered plugin runtimes. */
	values() {
		return this._internal.values();
	}
	/** Iterate `[callback, runtime]` pairs. */
	entries() {
		return this._internal.entries();
	}
	/**
	* Visit every registered runtime.
	*
	* @param callback — receives each runtime and its identifying callback.
	*/
	forEach(callback) {
		return this._internal.forEach(callback);
	}
	/**
	* Start a callback once the requested dependencies are available.
	*
	* @param inject — required services, as an array or a name → config map.
	* @param callback — plugin body called with `(ctx, config)`.
	* @returns the fiber; awaiting it settles once loading finished.
	*/
	inject(inject, callback) {
		return this.plugin({
			inject,
			apply: callback,
			name: callback.name
		});
	}
	/**
	* Start a plugin in the current context and return its fiber.
	*
	* Creates (or reuses) the plugin's runtime record, then starts a new fiber
	* under the current context. Throws if `plugin` is not a supported shape or
	* if the current fiber is already disposed.
	*
	* @param plugin — a function, class, or `{ apply }` object plugin.
	* @param config — the plugin config, validated against its `Config` schema.
	* @param getOuterStack — captures the caller stack for effect diagnostics.
	* @returns the fiber; awaiting it settles once loading finished.
	*/
	plugin(plugin, config, getOuterStack = buildOuterStack()) {
		const callback = this.resolve(plugin);
		if (!callback) throw new Error("invalid plugin, expect function or object with an \"apply\" method, received " + typeof plugin);
		this.ctx.fiber.assertActive();
		let runtime = this._internal.get(callback);
		if (!runtime) {
			let name = plugin.name;
			if (name === "apply") name = void 0;
			runtime = {
				name,
				callback,
				fibers: new DisposableList(),
				Config: plugin.Config
			};
			this._internal.set(callback, runtime);
		}
		const fiber = new Fiber(this.ctx, config, Inject.resolve(plugin.inject), runtime, getOuterStack);
		const wrapped = Object.create(fiber);
		wrapped.then = (onFulfilled, onRejected) => {
			return fiber.await().then(onFulfilled, onRejected);
		};
		return wrapped;
	}
};
/**
* Root and child dependency containers for Cordis plugins.
*
* A context is a proxy: normal property reads go through the service resolver,
* while `extend()`, `isolate()`, and `intercept()` create scoped child
* contexts without mutating their parent.
*/
var Context = class Context {
	/** Symbol key under which a disposer exposes its {@link EffectMeta} diagnostics tree. */
	static effect = symbols.effect;
	/** Symbol key for a context's listener filter, consulted on every event dispatch. */
	static filter = symbols.filter;
	/** Symbol key of the isolation map (see the `Context[symbols.isolate]` property). */
	static isolate = symbols.isolate;
	/** Symbol key of the intercept map (see the `Context[symbols.intercept]` property). */
	static intercept = symbols.intercept;
	/**
	* Returns true for Cordis context proxies and context prototypes.
	*
	* Works across realms and across multiple copies of cordis, because the
	* brand is keyed by a global symbol rather than by `instanceof`.
	*
	* @param value — the value to test.
	* @returns `true` if `value` is a Cordis context, narrowing its type.
	*/
	static is(value) {
		return !!value?.[Context.is];
	}
	static {
		Context.is[Symbol.toPrimitive] = () => Symbol.for("cordis.is");
		Context.prototype[Context.is] = true;
	}
	/** Create the root context and install the built-in services. */
	constructor() {
		this[symbols.isolate] = Object.create(null);
		this[symbols.intercept] = Object.create(null);
		const self = new Proxy(this, ReflectService.handler);
		this.root = self;
		this.baseUrl = void 0;
		this.fiber = new Fiber(self, {}, Object.create(null), null, () => []);
		this.reflect = new ReflectService(self);
		this.registry = new RegistryService(self);
		this.events = new EventsService(self);
		this.logger = new LoggerService(self);
		this.fiber._disposables.clear();
		return self;
	}
	[Symbol.for("nodejs.util.inspect.custom")]() {
		return `Context <${this.fiber.name}>`;
	}
	/**
	* Create a child context with extra metadata on top of the current scope.
	*
	* The child prototypally inherits every property of this context; own
	* properties of `meta` shadow the inherited ones. The parent is not mutated.
	*
	* @param meta — own properties (including symbol keys) to define on the child.
	* @returns a child context inheriting from this one.
	*/
	extend(meta = {}) {
		const shadow = Reflect.getOwnPropertyDescriptor(this, symbols.shadow)?.value;
		const self = Object.create(getTraceable(this, this));
		for (const prop of Reflect.ownKeys(meta)) Object.defineProperty(self, prop, Reflect.getOwnPropertyDescriptor(meta, prop));
		if (!shadow) return self;
		return Object.assign(Object.create(self), { [symbols.shadow]: shadow });
	}
	/**
	* Create a child context with an independent service scope for `name`.
	*
	* Below the returned context, reads and writes of the service `name`
	* resolve against the new label instead of the parent's, so a different
	* implementation can be provided without affecting the parent scope.
	* Passing the same `label` to two `isolate()` calls joins their scopes.
	*
	* @param name — the service name to isolate.
	* @param label — scope label to join; defaults to a fresh unique symbol.
	* @returns a child context whose `name` service resolves in the new scope.
	*/
	isolate(name, label) {
		const shadow = Object.create(this[symbols.isolate]);
		shadow[name] = label ?? Symbol(name);
		return this.extend({ [symbols.isolate]: shadow });
	}
	intercept(name, config) {
		const intercept = Object.create(this[symbols.intercept]);
		intercept[name] = config;
		return this.extend({ [symbols.intercept]: intercept });
	}
};
/**
* Base class for services that expose a named API on `ctx`.
*
* Subclasses call `super(ctx, name)` from their constructor. The service is
* registered immediately and is automatically removed with the owning fiber.
*/
var Service = class Service {
	ctx;
	/** Symbol key of an instance method run after construction (class plugins). */
	static init = symbols.init;
	/** Symbol key of the availability predicate passed to `ctx.provide()`. */
	static check = symbols.check;
	/** Symbol key of the phantom intercept-config type parameter. */
	static config = symbols.config;
	/** Symbol key of the call body making a service callable (e.g. `ctx.logger()`). */
	static invoke = symbols.invoke;
	/** Symbol key of the helper deriving an extended service instance. */
	static extend = symbols.extend;
	/** Symbol key of the tracker metadata used for context tracing. */
	static tracker = symbols.tracker;
	/** Symbol key of the intercept-config resolution helper below. */
	static resolveConfig = symbols.resolveConfig;
	/** The service name this instance is registered under. */
	name;
	/**
	* Register this instance as `name` in the current context.
	*
	* Calls `ctx.reflect.provide(name, this, this[Service.check])`, so the
	* service is unregistered automatically when the owning fiber unloads.
	* Services with a `[Service.invoke]` body return a callable instance.
	*
	* @param ctx — the context to register in (stored as `this.ctx`).
	* @param name — the service name; defaults to the static `provide` field.
	*/
	constructor(ctx, name) {
		this.ctx = ctx;
		name ??= this.constructor["provide"];
		let self = this;
		const tracker = {
			associate: name,
			property: "ctx"
		};
		if (self[symbols.invoke]) self = createCallable(name, joinPrototype(Object.getPrototypeOf(this), Function.prototype), tracker);
		self.ctx = ctx;
		self.name = name;
		defineProperty(self, symbols.tracker, tracker);
		self.ctx.reflect.provide(name, self, this[symbols.check]);
		return self;
	}
	[symbols.filter](ctx) {
		return ctx[symbols.isolate][this.name] === this.ctx[symbols.isolate][this.name];
	}
	[symbols.extend](props) {
		let self;
		if (this[Service.invoke]) self = createCallable(this.name, this, this[symbols.tracker]);
		else self = Object.create(this);
		return Object.assign(self, props);
	}
	/**
	* Merge intercept config from ancestors with optional base and head values.
	*
	* Entries added closer to the root apply first; `base` is prepended and
	* `head` appended. Uses `Config.merge` when the service declares one,
	* otherwise a shallow `Object.assign`.
	*
	* @param base — lowest-precedence config merged before all intercepts.
	* @param head — highest-precedence config merged after all intercepts.
	* @returns the merged config.
	*/
	[symbols.resolveConfig](base, head) {
		let intercept = this.ctx[Context.intercept];
		const configs = [];
		while (this.name in intercept) {
			if (Object.hasOwn(intercept, this.name)) configs.unshift(intercept[this.name]);
			intercept = Object.getPrototypeOf(intercept);
		}
		if (base) configs.unshift(base);
		if (head) configs.push(head);
		if (this["Config"]?.merge) return this["Config"].merge(...configs);
		else return Object.assign({}, ...configs);
	}
	static [Symbol.hasInstance](instance) {
		if (!instance) return false;
		let constructor = instance.constructor;
		while (constructor) {
			constructor = constructor.prototype?.constructor;
			if (constructor === this) return true;
			constructor &&= Object.getPrototypeOf(constructor);
		}
		return false;
	}
};
//#endregion
//#region ../../vendor/schemastery/lib/index.mjs
const kSchema = Symbol.for("schemastery");
const kValidationError = Symbol.for("ValidationError");
globalThis.__schemastery_index__ ??= 0;
globalThis.__schemastery_refs__ = void 0;
var ValidationError = class extends TypeError {
	options;
	name = "ValidationError";
	constructor(message, options) {
		let prefix = "$";
		for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
		else if (typeof segment === "number") prefix += "[" + segment + "]";
		else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
		if (prefix.startsWith(".")) prefix = prefix.slice(1);
		super((prefix === "$" ? "" : `${prefix} `) + message);
		this.options = options;
	}
	static is(error) {
		return !!error?.[kValidationError];
	}
};
Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
const Schema = function(options) {
	const schema = function(data, options = {}) {
		return Schema.resolve(data, schema, options)[0];
	};
	if (options.refs) {
		const refs = mapValues(options.refs, (options) => new Schema(options));
		const getRef = (uid) => refs[uid];
		for (const key in refs) {
			const options = refs[key];
			options.sKey = getRef(options.sKey);
			options.inner = getRef(options.inner);
			options.list = options.list && options.list.map(getRef);
			options.dict = options.dict && mapValues(options.dict, getRef);
		}
		return refs[options.uid];
	}
	Object.assign(schema, options);
	if (typeof schema.callback === "string") try {
		schema.callback = new Function("return " + schema.callback)();
	} catch {}
	Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
	Object.setPrototypeOf(schema, Schema.prototype);
	schema.meta ||= {};
	schema.toString = schema.toString.bind(schema);
	return schema;
};
Schema.prototype = Object.create(Function.prototype);
Schema.prototype[kSchema] = true;
Object.defineProperty(Schema.prototype, "~standard", { get() {
	return {
		version: 1,
		vendor: "schemastery",
		validate: (value) => {
			try {
				return { value: Schema.resolve(value, this, {})[0] };
			} catch (error) {
				if (ValidationError.is(error)) return { issues: [{
					message: error.message,
					path: error.options.path
				}] };
				throw error;
			}
		}
	};
} });
Schema.ValidationError = ValidationError;
Schema.prototype.toJSON = function toJSON() {
	if (globalThis.__schemastery_refs__) {
		globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
		return this.uid;
	}
	globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
	globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
	const result = {
		uid: this.uid,
		refs: globalThis.__schemastery_refs__
	};
	globalThis.__schemastery_refs__ = void 0;
	return result;
};
Schema.prototype.set = function set(key, value) {
	this.dict[key] = value;
	return this;
};
Schema.prototype.push = function push(value) {
	this.list.push(value);
	return this;
};
function mergeDesc(original, messages) {
	const result = typeof original === "string" ? { "": original } : { ...original };
	for (const locale in messages) {
		const value = messages[locale];
		if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
		else if (typeof value === "string") result[locale] = value;
	}
	return result;
}
function getInner(value) {
	return value?.$value ?? value?.$inner;
}
function extractKeys(data) {
	return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
}
Schema.prototype.i18n = function i18n(messages) {
	const schema = Schema(this);
	const desc = mergeDesc(schema.meta.description, messages);
	if (Object.keys(desc).length) schema.meta.description = desc;
	if (schema.dict) schema.dict = mapValues(schema.dict, (inner, key) => {
		return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
	});
	if (schema.list) schema.list = schema.list.map((inner, index) => {
		return inner.i18n(mapValues(messages, (data = {}) => {
			if (Array.isArray(getInner(data))) return getInner(data)[index];
			if (Array.isArray(data)) return data[index];
			return extractKeys(data);
		}));
	});
	if (schema.inner) schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
		if (getInner(data)) return getInner(data);
		return extractKeys(data);
	}));
	if (schema.sKey) schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
	return schema;
};
Schema.prototype.extra = function extra(key, value) {
	const schema = Schema(this);
	schema.meta = {
		...schema.meta,
		[key]: value
	};
	return schema;
};
for (const key of [
	"required",
	"disabled",
	"collapse",
	"hidden",
	"loose"
]) Object.assign(Schema.prototype, { [key](value = true) {
	const schema = Schema(this);
	schema.meta = {
		...schema.meta,
		[key]: value
	};
	return schema;
} });
Schema.prototype.deprecated = function deprecated() {
	const schema = Schema(this);
	schema.meta.badges ||= [];
	schema.meta.badges.push({
		text: "deprecated",
		type: "danger"
	});
	return schema;
};
Schema.prototype.experimental = function experimental() {
	const schema = Schema(this);
	schema.meta.badges ||= [];
	schema.meta.badges.push({
		text: "experimental",
		type: "warning"
	});
	return schema;
};
Schema.prototype.pattern = function pattern(regexp) {
	const schema = Schema(this);
	const pattern = pick(regexp, ["source", "flags"]);
	schema.meta = {
		...schema.meta,
		pattern
	};
	return schema;
};
Schema.prototype.simplify = function simplify(value) {
	if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
	if (isNullable(value)) return value;
	if (this.type === "object" || this.type === "dict") {
		const result = {};
		for (const key in value) {
			const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
			if (this.type === "dict" || !isNullable(item)) result[key] = item;
		}
		if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
		return result;
	} else if (this.type === "array" || this.type === "tuple") {
		const result = [];
		value.forEach((value, index) => {
			const schema = this.type === "array" ? this.inner : this.list[index];
			const item = schema ? schema.simplify(value) : value;
			result.push(item);
		});
		return result;
	} else if (this.type === "intersect") {
		const result = {};
		for (const item of this.list) Object.assign(result, item.simplify(value));
		return result;
	} else if (this.type === "union") for (const schema of this.list) try {
		Schema.resolve(value, schema, {});
		return schema.simplify(value);
	} catch {}
	return value;
};
Schema.prototype.toString = function toString(inline) {
	return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
};
Schema.prototype.role = function role(role, extra) {
	const schema = Schema(this);
	schema.meta = {
		...schema.meta,
		role,
		extra
	};
	return schema;
};
for (const key of [
	"default",
	"link",
	"comment",
	"description",
	"max",
	"min",
	"step"
]) Object.assign(Schema.prototype, { [key](value) {
	const schema = Schema(this);
	schema.meta = {
		...schema.meta,
		[key]: value
	};
	return schema;
} });
const resolvers = {};
Schema.extend = function extend(type, resolve) {
	resolvers[type] = resolve;
};
Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
	if (!schema) return [data];
	if (options.ignore?.(data, schema)) return [data];
	if (isNullable(data) && schema.type !== "lazy") {
		if (schema.meta.required) throw new ValidationError(`missing required value`, options);
		let current = schema;
		let fallback = schema.meta.default;
		while (current?.type === "intersect" && isNullable(fallback)) {
			current = current.list[0];
			fallback = current?.meta.default;
		}
		if (isNullable(fallback)) return [data];
		data = clone(fallback);
	}
	const callback = resolvers[schema.type];
	if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
	try {
		return callback(data, schema, options, strict);
	} catch (error) {
		if (!schema.meta.loose) throw error;
		return [schema.meta.default];
	}
};
Schema.from = function from(source) {
	if (isNullable(source)) return Schema.any();
	else if ([
		"string",
		"number",
		"boolean"
	].includes(typeof source)) return Schema.const(source).required();
	else if (source[kSchema]) return source;
	else if (typeof source === "function") switch (source) {
		case String: return Schema.string().required();
		case Number: return Schema.number().required();
		case Boolean: return Schema.boolean().required();
		case Function: return Schema.function().required();
		default: return Schema.is(source).required();
	}
	else throw new TypeError(`cannot infer schema from ${source}`);
};
Schema.lazy = function lazy(builder) {
	const toJSON = () => {
		if (!schema.inner[kSchema]) {
			schema.inner = schema.builder();
			schema.inner.meta = {
				...schema.meta,
				...schema.inner.meta
			};
		}
		return schema.inner.toJSON();
	};
	const schema = new Schema({
		type: "lazy",
		builder,
		inner: { toJSON }
	});
	return schema;
};
Schema.natural = function natural() {
	return Schema.number().step(1).min(0);
};
Schema.percent = function percent() {
	return Schema.number().step(.01).min(0).max(1).role("slider");
};
Schema.date = function date() {
	return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
		const date = new Date(value);
		if (isNaN(+date)) throw new ValidationError(`invalid date "${value}"`, options);
		return date;
	}, true)]);
};
Schema.regExp = function regExp(flag = "") {
	return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
		try {
			return new RegExp(value, flag);
		} catch (e) {
			throw new ValidationError(e.message, options);
		}
	}, true)]);
};
Schema.arrayBuffer = function arrayBuffer(encoding) {
	return Schema.union([
		Schema.is(ArrayBuffer),
		Schema.is(SharedArrayBuffer),
		Schema.transform(Schema.any(), (value, options) => {
			if (Binary.isSource(value)) return Binary.fromSource(value);
			throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
		}, true),
		...encoding ? [Schema.transform(Schema.string(), (value, options) => {
			try {
				return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
			} catch (e) {
				throw new ValidationError(e.message, options);
			}
		}, true)] : []
	]);
};
Schema.extend("lazy", (data, schema, options, strict) => {
	if (!schema.inner[kSchema]) {
		schema.inner = schema.builder();
		schema.inner.meta = {
			...schema.meta,
			...schema.inner.meta
		};
	}
	return Schema.resolve(data, schema.inner, options, strict);
});
Schema.extend("any", (data) => {
	return [data];
});
Schema.extend("never", (data, _, options) => {
	throw new ValidationError(`expected nullable but got ${data}`, options);
});
Schema.extend("const", (data, { value }, options) => {
	if (deepEqual(data, value)) return [value];
	throw new ValidationError(`expected ${value} but got ${data}`, options);
});
function checkWithinRange(data, meta, description, options, skipMin = false) {
	const { max = Infinity, min = -Infinity } = meta;
	if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
	if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
}
Schema.extend("string", (data, { meta }, options) => {
	if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
	if (meta.pattern) {
		const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
		if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
	}
	checkWithinRange(data.length, meta, "string length", options);
	return [data];
});
function decimalShift(data, digits) {
	const str = data.toString();
	if (str.includes("e")) return data * Math.pow(10, digits);
	const index = str.indexOf(".");
	if (index === -1) return data * Math.pow(10, digits);
	const frac = str.slice(index + 1);
	const integer = str.slice(0, index);
	if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
	return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
}
function isMultipleOf(data, min, step) {
	step = Math.abs(step);
	if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
	const index = step.toString().indexOf(".");
	const digits = step.toString().slice(index + 1).length;
	return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
}
Schema.extend("number", (data, { meta }, options) => {
	if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
	checkWithinRange(data, meta, "number", options);
	const { step } = meta;
	if (step && !isMultipleOf(data, meta.min ?? 0, step)) throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
	return [data];
});
Schema.extend("boolean", (data, _, options) => {
	if (typeof data === "boolean") return [data];
	throw new ValidationError(`expected boolean but got ${data}`, options);
});
Schema.extend("bitset", (data, { bits, meta }, options) => {
	let value = 0, keys = [];
	if (typeof data === "number") {
		value = data;
		for (const key in bits) if (data & bits[key]) keys.push(key);
	} else if (Array.isArray(data)) {
		keys = data;
		for (const key of keys) {
			if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
			if (key in bits) value |= bits[key];
		}
	} else throw new ValidationError(`expected number or array but got ${data}`, options);
	if (value === meta.default) return [value];
	return [value, keys];
});
Schema.extend("function", (data, _, options) => {
	if (typeof data === "function") return [data];
	throw new ValidationError(`expected function but got ${data}`, options);
});
Schema.extend("is", (data, { constructor }, options) => {
	if (typeof constructor === "function") {
		if (data instanceof constructor) return [data];
		throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
	} else {
		if (isNullable(data)) throw new ValidationError(`expected ${constructor} but got ${data}`, options);
		let prototype = Object.getPrototypeOf(data);
		while (prototype) {
			if (prototype.constructor?.name === constructor) return [data];
			prototype = Object.getPrototypeOf(prototype);
		}
		throw new ValidationError(`expected ${constructor} but got ${data}`, options);
	}
});
function property(data, key, schema, options) {
	try {
		const [value, adapted] = Schema.resolve(data[key], schema, {
			...options,
			path: [...options.path || [], key]
		});
		if (adapted !== void 0) data[key] = adapted;
		return value;
	} catch (e) {
		if (!options?.autofix) throw e;
		delete data[key];
		return schema.meta.default;
	}
}
Schema.extend("array", (data, { inner, meta }, options) => {
	if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
	checkWithinRange(data.length, meta, "array length", options, !isNullable(inner.meta.default));
	return [data.map((_, index) => property(data, index, inner, options))];
});
Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
	if (!isPlainObject$1(data)) throw new ValidationError(`expected object but got ${data}`, options);
	const result = {};
	for (const key in data) {
		let rKey;
		try {
			rKey = Schema.resolve(key, sKey, options)[0];
		} catch (error) {
			if (strict) continue;
			throw error;
		}
		result[rKey] = property(data, key, inner, options);
		data[rKey] = data[key];
		if (key !== rKey) delete data[key];
	}
	return [result];
});
Schema.extend("tuple", (data, { list }, options, strict) => {
	if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
	const result = list.map((inner, index) => property(data, index, inner, options));
	if (strict) return [result];
	result.push(...data.slice(list.length));
	return [result];
});
function merge(result, data) {
	for (const key in data) {
		if (key in result) continue;
		result[key] = data[key];
	}
}
Schema.extend("object", (data, { dict }, options, strict) => {
	if (!isPlainObject$1(data)) throw new ValidationError(`expected object but got ${data}`, options);
	const result = {};
	for (const key in dict) {
		const value = property(data, key, dict[key], options);
		if (!isNullable(value) || key in data) result[key] = value;
	}
	if (!strict) merge(result, data);
	return [result];
});
Schema.extend("union", (data, { list, toString }, options, strict) => {
	const messages = [];
	for (const inner of list) try {
		return Schema.resolve(data, inner, options, strict);
	} catch (error) {
		messages.push(error);
	}
	throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
});
Schema.extend("intersect", (data, { list, toString }, options, strict) => {
	if (!list.length) return [data];
	let result;
	for (const inner of list) {
		const value = Schema.resolve(data, inner, options, true)[0];
		if (isNullable(value)) continue;
		if (isNullable(result)) result = value;
		else if (typeof result !== typeof value) throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
		else if (typeof value === "object") merge(result ??= {}, value);
		else if (result !== value) throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
	}
	if (!strict && isPlainObject$1(data)) merge(result, data);
	return [result];
});
Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
	const [result, adapted = data] = Schema.resolve(data, inner, options, true);
	if (preserve) return [callback(result)];
	else return [callback(result), callback(adapted)];
});
const formatters = {};
function defineMethod(name, keys, format) {
	formatters[name] = format;
	Object.assign(Schema, { [name](...args) {
		const schema = new Schema({ type: name });
		keys.forEach((key, index) => {
			switch (key) {
				case "sKey":
					schema.sKey = args[index] ?? Schema.string();
					break;
				case "inner":
					schema.inner = Schema.from(args[index]);
					break;
				case "list":
					schema.list = args[index].map(Schema.from);
					break;
				case "dict":
					schema.dict = mapValues(args[index], Schema.from);
					break;
				case "bits":
					schema.bits = {};
					for (const key in args[index]) {
						if (typeof args[index][key] !== "number") continue;
						schema.bits[key] = args[index][key];
					}
					break;
				case "callback": {
					const callback = schema.callback = args[index];
					callback["toJSON"] ||= () => callback.toString();
					break;
				}
				case "constructor": {
					const constructor = schema.constructor = args[index];
					if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
					break;
				}
				default: schema[key] = args[index];
			}
		});
		if (name === "object" || name === "dict") schema.meta.default = {};
		else if (name === "array" || name === "tuple") schema.meta.default = [];
		else if (name === "bitset") schema.meta.default = 0;
		return schema;
	} });
}
defineMethod("is", ["constructor"], ({ constructor }) => {
	if (typeof constructor === "function") return constructor.name;
	else return constructor;
});
defineMethod("any", [], () => "any");
defineMethod("never", [], () => "never");
defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
defineMethod("string", [], () => "string");
defineMethod("number", [], () => "number");
defineMethod("boolean", [], () => "boolean");
defineMethod("bitset", ["bits"], () => "bitset");
defineMethod("function", [], () => "function");
defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
defineMethod("object", ["dict"], ({ dict }) => {
	if (Object.keys(dict).length === 0) return "{}";
	return `{ ${Object.entries(dict).map(([key, inner]) => {
		return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
	}).join(", ")} }`;
});
defineMethod("union", ["list"], ({ list }, inline) => {
	const result = list.map(({ toString: format }) => format()).join(" | ");
	return inline ? `(${result})` : result;
});
defineMethod("intersect", ["list"], ({ list }) => {
	return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
});
defineMethod("transform", [
	"inner",
	"callback",
	"preserve"
], ({ inner }, isInner) => inner.toString(isInner));
//#endregion
//#region ../../packages/util/timeout/lib/index.js
/**
* Shared timeout arithmetic, signal fusion, and classification. The library
* only notifies through abort signals; each capability still owns the mechanism
* that stops its work and translates timeout reasons into public outcomes.
* @module @deepseek-ai/dsh-timeout
*/
/**
* Internal abort reason carrying a capability-owned code and elapsed deadline.
* Providers translate it through {@link timeoutOf} before returning to callers.
*/
var TimeoutReason = class extends Error {
	code;
	timeoutMs;
	name = "TimeoutReason";
	/**
	* @param code Capability-owned timeout code (e.g. `BASH_TIMEOUT`).
	* @param timeoutMs The deadline that elapsed, in milliseconds.
	*/
	constructor(code, timeoutMs) {
		super(`${code} after ${timeoutMs}ms`);
		this.code = code;
		this.timeoutMs = timeoutMs;
	}
};
/** Largest delay Node schedules without clamping it to one millisecond. */
const MAX_TIMER_DELAY_MS = 2147483647;
function assertTimerDelay(timeoutMs, name) {
	if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > 2147483647) throw new Error(`${name} must be a positive finite number no greater than ${MAX_TIMER_DELAY_MS}`);
}
/**
* Create a rearmable idle watchdog for an async iterator. The timer exists only
* while {@link IdleWatchdog.next} is outstanding, so consumer think time does
* not count as provider idle time. The returned signal is stable for the whole
* call and only notifies; the iterator must observe it to terminate its work.
*
* @param upstream - caller cancellation fused into the stable signal.
* @param timeoutMs - positive finite idle interval in milliseconds.
* @param code - capability-owned code carried by the timeout reason.
* @returns a stable signal, guarded next operation, and timer disposer.
*/
function idleWatchdog(upstream, timeoutMs, code) {
	assertTimerDelay(timeoutMs, "idleWatchdog timeoutMs");
	const timeout = new AbortController();
	const signal = upstream === void 0 ? timeout.signal : AbortSignal.any([upstream, timeout.signal]);
	let timer;
	let outstanding = false;
	let disposed = false;
	const arm = () => {
		if (timer !== void 0) clearTimeout(timer);
		timer = setTimeout(() => {
			timeout.abort(new TimeoutReason(code, timeoutMs));
		}, timeoutMs);
	};
	return {
		signal,
		async next(iterator) {
			if (disposed) throw new Error("idleWatchdog is disposed");
			if (outstanding) throw new Error("idleWatchdog next is already outstanding");
			outstanding = true;
			arm();
			try {
				return await iterator.next();
			} finally {
				clearTimeout(timer);
				timer = void 0;
				outstanding = false;
			}
		},
		pulse() {
			if (disposed || !outstanding) return;
			arm();
		},
		[Symbol.dispose]() {
			if (disposed) return;
			disposed = true;
			if (timer !== void 0) clearTimeout(timer);
			timer = void 0;
		}
	};
}
/**
* Recover a timeout reason from a reason-bearing object. Supplying `code`
* distinguishes this deadline from a nested upstream deadline; a foreign code
* follows the ordinary cancellation path.
*
* @param x An {@link AbortSignal} or any `{ reason }` carrier (e.g. a caught abort error).
* @param code When provided, only a {@link TimeoutReason} with this exact `code` matches.
* @returns The matching {@link TimeoutReason}, else `undefined`.
*/
function timeoutOf(x, code) {
	const reason = x.reason;
	if (!(reason instanceof TimeoutReason)) return void 0;
	return code === void 0 || reason.code === code ? reason : void 0;
}
//#endregion
//#region ../../packages/llm/llm/lib/index.js
/**
* dsh-llm's owned branded ids: tool-call correlation and provider request
* diagnostics.
*
* The `Branded<B>` primitive itself lives in `@deepseek-ai/dsh-brand` (a
* zero-dependency type-only package) so every owner of a cross-boundary id can
* brand it without depending on dsh-llm; see that package's README for the
* nominal-typing policy.
*
* @module @deepseek-ai/dsh-llm/brand
*/
/**
* Brand a message identifier.
* @param id - the opaque message identifier.
* @returns the same string, branded; no validation is performed.
*/
function MessageId(id) {
	return id;
}
/**
* Brand a string as a {@link CallId}.
* @param id - the provider-issued (or synthesized) call id.
* @returns the same string, branded; no validation is performed.
*/
function CallId(id) {
	return id;
}
/**
* Brand an adapter-owned reasoning-effort identifier.
* @param id - the opaque identifier exposed by one model capability.
* @returns the same string, branded; no validation is performed.
*/
function ReasoningEffortId(id) {
	return id;
}
/**
* Deep-freeze a value in place with an iterative traversal, guarding cycles,
* so later mutation throws without imposing a JavaScript call-stack depth cap.
* {@link AbortSignal} objects are deliberately skipped because they are the
* request's live cancellation channel and freezing them breaks abort.
* @param value - the value to freeze in place.
* @returns the same value, frozen.
*/
function deepFreeze$1(value) {
	const seen = /* @__PURE__ */ new WeakSet();
	const pending = [{
		kind: "visit",
		node: value
	}];
	while (pending.length > 0) {
		const task = pending.pop();
		/* v8 ignore next -- the loop condition guarantees one pending task. */
		if (task === void 0) continue;
		if (task.kind === "property") {
			pending.push({
				kind: "visit",
				node: task.source[task.key]
			});
			continue;
		}
		const node = task.node;
		if (node === null || typeof node !== "object") continue;
		if (node instanceof AbortSignal) continue;
		if (seen.has(node)) continue;
		seen.add(node);
		Object.freeze(node);
		const keys = Object.keys(node);
		for (let index = keys.length - 1; index >= 0; index--) {
			const key = keys[index];
			/* v8 ignore next -- the loop is bounded by the captured key count. */
			if (key === void 0) continue;
			pending.push({
				kind: "property",
				source: node,
				key
			});
		}
	}
	return value;
}
/**
* Detach and deep-freeze a message whose identity already exists.
* @param message - complete message, including its stable identity.
* @returns an immutable snapshot that preserves the identity.
*/
function freezeMessage(message) {
	return deepFreeze$1(structuredClone(message));
}
/**
* Create one identified message and freeze it before publication.
* @param input - complete role, content, and source for a new message.
* @returns an immutable message with a fresh stable identity.
*/
function createMessage(input) {
	return freezeMessage({
		...input,
		id: MessageId(crypto.randomUUID())
	});
}
/**
* Create one identified user-role message and freeze it before publication.
* @param input - complete content and source for a new user message.
* @returns an immutable user message with a fresh stable identity.
*/
function createUserMessage(input) {
	return createMessage({
		...input,
		role: "user"
	});
}
/**
* Harness error base with a stable machine-routable code and chained cause.
* Package errors extend it so tool results and replay can retain failure class.
* @module @deepseek-ai/dsh-llm/error
*/
/**
* Base class for all harness errors. Carries a `code` (stable, programmatic —
* e.g. `NO_ADAPTER`, `INVALID_ARGS`, `INVARIANT`) distinct from the
* human-readable `message`, and supports `cause` chaining via the standard
* `ErrorOptions`. `name` defaults to the subclass constructor name.
*/
var HarnessError = class extends Error {
	/** Stable machine-routable failure class (e.g. `RATE_LIMIT`); route on this, never by parsing `message`. */
	code;
	constructor(message, code, options) {
		super(message, options);
		this.code = code;
		this.name = new.target.name;
	}
};
/** Canonical provider-neutral code for a model request rejected because its context window was exceeded. */
const CONTEXT_WINDOW_EXCEEDED_CODE = "CONTEXT_WINDOW_EXCEEDED";
/** Canonical provider-neutral code for an exhausted account quota or balance. */
const QUOTA_EXCEEDED_CODE = "QUOTA";
/**
* Canonical provider-neutral code for a response that completed normally but
* carried no content blocks at all. Providers occasionally emit a degenerate
* completion (a terminal stop with zero output); adapters classify it as this
* failure instead of yielding an empty assistant message, because an empty
* message silently ends the turn with nothing for the user or the loop to act
* on. The attempt produced nothing durable, so retry policy treats it as safe
* to repeat.
*/
const EMPTY_RESPONSE_CODE = "EMPTY_RESPONSE";
/** Structured codes and plain phrases that explicitly name a context bound being exceeded. */
const STRUCTURED_CONTEXT_OVERFLOW = new RegExp(String.raw`(?:^|[^a-z0-9])context[\s_-](?:length|window)[\s_-]` + String.raw`(?:exceed(?:ed|s)?|overflow(?:ed)?|limit[\s_-]exceeded)(?:$|[^a-z0-9])`, "i");
/** Request-size wording that ties "too large" directly to model context capacity. */
const TOO_LARGE_FOR_CONTEXT = new RegExp(String.raw`\b(?:request|prompt|input|messages?)\s+(?:is\s+|are\s+)?` + String.raw`too\s+(?:large|long)\s+for\s+(?:(?:this|the)\s+)?` + String.raw`(?:model(?:'s)?\s+)?context(?:\s+window)?\b`, "i");
/** "Exceeds" wording is safe only when its object is explicitly the model context. */
const EXCEEDS_MODEL_CONTEXT = new RegExp(String.raw`\b(?:input|prompt|request|messages?)\b.{0,40}` + String.raw`\b(?:exceed(?:s|ed)?|overflows?|is\s+larger\s+than)\b.{0,40}` + String.raw`\b(?:the\s+)?(?:model(?:'s)?\s+)?context(?:\s+(?:length|window))?\b`, "i");
/**
* Recognize the context-overflow wording used by OpenAI-compatible providers
* and library adapters. Adapters pass all available provider code, type, and
* message text so both thrown and in-band delivery styles share one classifier.
* @param detail - provider error code/type/message text joined into one string.
* @returns true when the detail identifies a request exceeding the model context window.
*/
function isContextWindowExceededError(detail) {
	return STRUCTURED_CONTEXT_OVERFLOW.test(detail) || /\b(?:maximum|max)(?:\s+(?:allowed|supported))?\s+context\s+(?:length|window)\b/i.test(detail) || TOO_LARGE_FOR_CONTEXT.test(detail) || /\b(?:input|prompt|request)\s+(?:is\s+)?too\s+(?:long|large)\s+for\s+(?:this|the)\s+model\b/i.test(detail) || EXCEEDS_MODEL_CONTEXT.test(detail);
}
/**
* Recognize provider wording that identifies an exhausted account quota rather
* than a transient request-rate limit.
* @param detail - provider error code/type/message text joined into one string.
* @returns true only for terminal quota, balance, credit, budget, or usage-limit wording.
*/
function isQuotaExceededError(detail) {
	return /\binsufficient[\s_-]+(?:quota|balance|credits?)\b/i.test(detail) || /\b(?:quota|usage[\s_-]+limit)[\s_-]+(?:exceeded|exhausted|reached)\b/i.test(detail) || /\bexceed(?:ed|s)?[\s_-]+(?:(?:your|the)[\s_-]+)?(?:current[\s_-]+)?quota\b/i.test(detail) || /\b(?:balance|credits?)[\s_-]+(?:exhausted|depleted)\b/i.test(detail) || /\bout[\s_-]+of[\s_-]+(?:credits?|budget)\b/i.test(detail);
}
/**
* Provider-owned request-retry policy configuration and resolution.
*
* Adapters expose one resolved policy per registered provider route; the
* optional dsh-llm-retry plugin executes it on the agent's failed-step extension point.
*
* @module @deepseek-ai/dsh-llm/retry-policy
*/
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_INITIAL_DELAY_MS = 500;
const DEFAULT_MAX_DELAY_MS = 1e4;
const DEFAULT_JITTER_RATIO = .1;
const DEFAULT_RETRYABLE_CODES = Object.freeze([
	EMPTY_RESPONSE_CODE,
	"RATE_LIMIT",
	"SERVER",
	"TIMEOUT",
	"TRANSPORT"
]);
const backoffSchema = Schema.object({
	initialDelayMs: Schema.number().max(MAX_TIMER_DELAY_MS).default(DEFAULT_INITIAL_DELAY_MS),
	maxDelayMs: Schema.number().max(MAX_TIMER_DELAY_MS).default(DEFAULT_MAX_DELAY_MS),
	jitterRatio: Schema.number().min(0).max(1).default(DEFAULT_JITTER_RATIO)
});
const normalPolicySchema = Schema.object({
	mode: Schema.const("normal").required(),
	maxRetries: Schema.number().step(1).min(0).max(Number.MAX_SAFE_INTEGER).default(DEFAULT_MAX_RETRIES),
	retryableCodes: Schema.array(Schema.string()).default([...DEFAULT_RETRYABLE_CODES]),
	backoff: backoffSchema
});
const alwaysPolicySchema = Schema.object({
	mode: Schema.const("always").required(),
	backoff: backoffSchema
});
/** Cordis schema embedded by each concrete provider configuration. */
const RetryPolicySchema = Schema.union([normalPolicySchema, alwaysPolicySchema]);
const NORMAL_POLICY_KEYS = new Set([
	"mode",
	"maxRetries",
	"retryableCodes",
	"backoff"
]);
const ALWAYS_POLICY_KEYS = new Set(["mode", "backoff"]);
const BACKOFF_KEYS = new Set([
	"initialDelayMs",
	"maxDelayMs",
	"jitterRatio"
]);
function validateKeys(value, allowed, path) {
	for (const key of Object.keys(value)) if (!allowed.has(key)) throw new Error(`${path}: unknown key "${key}"`);
}
function resolveBackoff(config, path) {
	if (config !== void 0) validateKeys(config, BACKOFF_KEYS, path);
	const initialDelayMs = config?.initialDelayMs ?? DEFAULT_INITIAL_DELAY_MS;
	const maxDelayMs = config?.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;
	const jitterRatio = config?.jitterRatio ?? DEFAULT_JITTER_RATIO;
	if (!Number.isFinite(initialDelayMs) || initialDelayMs <= 0 || initialDelayMs > 2147483647) throw new Error(`${path}.initialDelayMs must be a positive finite number no greater than ${MAX_TIMER_DELAY_MS}`);
	if (!Number.isFinite(maxDelayMs) || maxDelayMs <= 0 || maxDelayMs > 2147483647) throw new Error(`${path}.maxDelayMs must be a positive finite number no greater than ${MAX_TIMER_DELAY_MS}`);
	if (initialDelayMs > maxDelayMs) throw new Error(`${path}.initialDelayMs must be less than or equal to maxDelayMs`);
	if (!Number.isFinite(jitterRatio) || jitterRatio < 0 || jitterRatio > 1) throw new Error(`${path}.jitterRatio must be between 0 and 1`);
	return Object.freeze({
		initialDelayMs,
		maxDelayMs,
		jitterRatio
	});
}
/**
* Validate, default, and detach one provider-owned retry policy.
* @param config - optional provider configuration; omission selects normal defaults.
* @param path - diagnostic path naming the provider config that owns the value.
* @returns an immutable policy safe to capture in provider registration state.
*/
function resolveRetryPolicy(config, path) {
	if (config === void 0) return Object.freeze({
		mode: "normal",
		maxRetries: DEFAULT_MAX_RETRIES,
		retryableCodes: DEFAULT_RETRYABLE_CODES,
		...resolveBackoff(void 0, `${path}.backoff`)
	});
	switch (config.mode) {
		case "normal": {
			validateKeys(config, NORMAL_POLICY_KEYS, path);
			const maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
			const retryableCodes = config.retryableCodes ?? [...DEFAULT_RETRYABLE_CODES];
			if (!Number.isSafeInteger(maxRetries) || maxRetries < 0) throw new Error(`${path}.maxRetries must be a non-negative safe integer`);
			if (retryableCodes.length === 0) throw new Error(`${path}.retryableCodes must not be empty`);
			if (retryableCodes.some((code) => typeof code !== "string" || code.length === 0)) throw new Error(`${path}.retryableCodes must contain only non-empty strings`);
			if (new Set(retryableCodes).size !== retryableCodes.length) throw new Error(`${path}.retryableCodes must not contain duplicates`);
			return Object.freeze({
				mode: "normal",
				maxRetries,
				retryableCodes: Object.freeze([...retryableCodes]),
				...resolveBackoff(config.backoff, `${path}.backoff`)
			});
		}
		case "always":
			validateKeys(config, ALWAYS_POLICY_KEYS, path);
			return Object.freeze({
				mode: "always",
				...resolveBackoff(config.backoff, `${path}.backoff`)
			});
		default: throw new Error(`${path}.mode must be "normal" or "always"`);
	}
}
/**
* Centralize the non-secret product identity every provider request sends as `User-Agent`, keeping
* adapters from drifting. See
* `.agents/notes/implemented/architecture/2026-06-21-mandatory-app-attribution-headers.md`.
*
* App-attribution vocabulary for provider requests.
* @module @deepseek-ai/dsh-llm/attribution
*/
const { version } = createRequire(import.meta.url)("../package.json");
/**
* The harness's own identity: the default every adapter sends. Deployments
* that need a white-label identity pass their own {@link AppIdentity} to
* {@link attributionHeaders} — omission falls back to this default; nothing
* can suppress attribution entirely.
*/
const APP_IDENTITY = {
	product: "deepseek-harness",
	version,
	url: "https://github.com/deepseek-ai/deepseek-harness"
};
/**
* The standard `User-Agent` value: `product/version (+url)`. The
* parenthesized `+url` comment is the conventional self-identification form
* (RFC 9110 §10.1.5 product + comment syntax).
* @param identity - the identity to render; defaults to {@link APP_IDENTITY}.
* @returns the ready-to-send header value.
*/
function userAgent(identity = APP_IDENTITY) {
	return `${identity.product}/${identity.version} (+${identity.url})`;
}
/**
* Build the attribution headers an adapter must send on every provider
* request. Header names are lowercase (HTTP field names are case-insensitive
* on the wire).
* @param identity - the identity to send; defaults to {@link APP_IDENTITY} — omission cannot suppress attribution.
* @returns headers to merge into the provider request (currently just `user-agent`).
*/
function attributionHeaders(identity = APP_IDENTITY) {
	return { "user-agent": userAgent(identity) };
}
/** Content-block structure helpers. @module @deepseek-ai/dsh-llm/content */
/**
* True when typed model content contains an image block, walking nested
* tool-result content. This is the one recursive image walk shared by every
* image policy (capability gating, text-only serialization, compaction
* survey), so a consumer cannot silently diverge on nesting depth.
* @param content - typed model content blocks.
* @returns whether any nested block is an image.
*/
function contentHasImage$1(content) {
	return content.some((block) => block.type === "image" || block.type === "tool-result" && contentHasImage$1(block.content));
}
/**
* LLM service: adapter registry with a waterfall-interceptable streaming call
* API. Exports the `LlmRuntime` default, the abstract `LlmAdapter` for
* provider backends, and `BlockAssembler` for chunk assembly.
*
* @module @deepseek-ai/dsh-llm
*/
/**
* Typed error for LLM-related failures. Extends {@link HarnessError}, so the
* `code` string (e.g. `AUTH`, `RATE_LIMIT`, `NO_ADAPTER`) is shared taxonomy.
*/
var LlmError = class extends HarnessError {
	/** Serializable facts retained beside this live Error. */
	failure;
	/**
	* @param message - non-empty human-readable failure summary.
	* @param code - non-empty stable provider-neutral machine code.
	* @param options - optional cause and validated serializable provider facts.
	*/
	constructor(message, code, options) {
		if (typeof message !== "string" || message.length === 0) throw new Error("LlmError message must be a non-empty string");
		if (typeof code !== "string" || code.length === 0) throw new Error("LlmError code must be a non-empty string");
		if (options?.status !== void 0 && (!Number.isInteger(options.status) || options.status < 100 || options.status > 599)) throw new Error("LlmError status must be an integer from 100 through 599");
		if (options?.providerRetryAfterMs !== void 0 && (!Number.isFinite(options.providerRetryAfterMs) || options.providerRetryAfterMs <= 0)) throw new Error("LlmError providerRetryAfterMs must be a positive finite number");
		if (options?.requestId !== void 0 && (typeof options.requestId !== "string" || options.requestId.length === 0)) throw new Error("LlmError requestId must be a non-empty string");
		super(message, code, options);
		this.name = "LlmError";
		this.failure = Object.freeze({
			message,
			code,
			...options?.status === void 0 ? {} : { status: options.status },
			...options?.providerRetryAfterMs === void 0 ? {} : { providerRetryAfterMs: options.providerRetryAfterMs },
			...options?.requestId === void 0 ? {} : { requestId: options.requestId }
		});
	}
};
/**
* Provider-wire adapter for the harness message and stream vocabulary. Register implementations
* with `ctx.llm.registerAdapter(providers, adapter)`. Every provider HTTP request must include
* `attributionHeaders()`; prove the headers are added in the wire request or library header hook. The direct-fetch
* DeepSeek and library-backed pi-ai adapters meet this contract through different internals.
*/
var LlmAdapter = class {
	/**
	* Describe one provider route owned by this adapter.
	* @param provider - a route passed to `registerAdapter()` for this instance.
	* @returns detached display metadata whose id must equal `provider`.
	*/
	providerInfo(provider) {
		return {
			id: provider,
			name: provider
		};
	}
	/**
	* Return the provider-owned retry policy captured with this route.
	* @param _provider - a route passed to `registerAdapter()` for this instance.
	* @returns a resolved policy, or `undefined` to use the normal defaults.
	*/
	providerRetryPolicy(_provider) {}
	/**
	* List models this adapter can currently advertise for one owned provider.
	* The result is advisory: an adapter may accept unlisted model ids, and
	* consumers must not turn absence into request rejection.
	* @param _provider - one provider route owned by this adapter.
	* @returns discoverable models in adapter-preferred order.
	*/
	listModels(_provider) {
		return Promise.resolve([]);
	}
	/**
	* Resolve all metadata available for one exact model. This query is
	* independent of the advisory catalog and does not validate request routing.
	* @param provider - one provider route owned by this adapter.
	* @param model - exact model id passed to {@link GenerateOptions.model}.
	* @param _signal - cancellation for this exact-model lookup; asynchronous
	*   implementations must settle promptly after it aborts.
	* @returns provider/model identity plus any context, call-default, and reasoning metadata.
	*/
	resolveModel(provider, model, _signal) {
		return Promise.resolve({
			provider,
			id: model,
			name: model
		});
	}
};
//#endregion
//#region ../../packages/settings/settings/lib/index.js
/**
* Structural secret redaction for settings values. `role('secret')` fields are
* removed from a value before it crosses a wire boundary; a sidecar records
* each schema-declared secret position and whether it currently holds a value,
* so a configuration surface can render a write-only input without ever
* receiving the secret itself.
* @module @deepseek-ai/dsh-settings/redact
*/
/** Whether a value is a plain data object the walker may recurse into. */
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function walk(node, value, path, secrets) {
	if (node === void 0) return value;
	if (node.meta?.role === "secret") {
		secrets.push({
			path,
			set: value !== void 0
		});
		return;
	}
	switch (node.type) {
		case "object": {
			const properties = node.dict ?? {};
			const source = isRecord(value) ? value : void 0;
			const rebuilt = {};
			if (source !== void 0) for (const [key, entry] of Object.entries(source)) {
				if (key in properties) continue;
				rebuilt[key] = entry;
			}
			for (const [key, child] of Object.entries(properties)) {
				const stripped = walk(child, source?.[key], [...path, key], secrets);
				if (stripped !== void 0) rebuilt[key] = stripped;
			}
			return source === void 0 && Object.keys(rebuilt).length === 0 ? value : rebuilt;
		}
		case "dict": {
			if (!isRecord(value)) return value;
			const rebuilt = {};
			for (const [key, entry] of Object.entries(value)) {
				const stripped = walk(node.inner, entry, [...path, key], secrets);
				if (stripped !== void 0) rebuilt[key] = stripped;
			}
			return rebuilt;
		}
		case "array":
			if (!Array.isArray(value)) return value;
			return value.map((entry, index) => walk(node.inner, entry, [...path, String(index)], secrets));
		default: return value;
	}
}
/**
* Service Definition for the user-settings capability seam (`ctx.settings`). Providers store one raw document of
* per-namespace sections; plugins register a namespace schema and read the
* resolved value, which layers schema defaults, the registrant's composition
* `base`, and the user document section, in that order.
* @module @deepseek-ai/dsh-settings
*/
const NAMESPACE_PATTERN = /^[a-z][a-z0-9-]*$/;
/**
* Brand a raw string as a {@link SettingsNamespace}.
* @param value - candidate namespace; lowercase kebab-case, as in plugin short names.
* @returns the branded namespace.
*/
function settingsNamespace(value) {
	if (!NAMESPACE_PATTERN.test(value)) throw new TypeError(`settings namespace "${value}" must match ${String(NAMESPACE_PATTERN)}`);
	return value;
}
/**
* Deep equality over JSON-compatible data (objects, arrays, primitives) — the
* Service Definition's single change-detection predicate, exported so the invariant
* companion checks exactly the implementation's relation.
* @param a - one JSON-compatible value.
* @param b - the other JSON-compatible value.
* @returns whether the two values are structurally equal.
*/
function deepEqualJson(a, b) {
	if (a === b) return true;
	if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
		return a.every((entry, index) => deepEqualJson(entry, b[index]));
	}
	const left = a;
	const right = b;
	const keys = Object.keys(left);
	if (keys.length !== Object.keys(right).length) return false;
	return keys.every((key) => key in right && deepEqualJson(left[key], right[key]));
}
/** Whether a value is a plain data object (not an array, null, or class instance). */
function isPlainObject(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}
/** Apply one path op to a detached section, returning the next section. */
function applyPathOp(section, op) {
	const [head, ...rest] = op.path;
	if (head === void 0) {
		if (op.op === "unset") return {};
		if (!isPlainObject(op.value)) throw new TypeError("settings mutate: setting the section root requires a plain object");
		return { ...op.value };
	}
	if (rest.length === 0) {
		if (op.op === "set") return {
			...section,
			[head]: op.value
		};
		const { [head]: _removed, ...kept } = section;
		return kept;
	}
	const child = section[head];
	if (!isPlainObject(child)) {
		if (op.op === "unset") return section;
		return {
			...section,
			[head]: applyPathOp({}, {
				...op,
				path: rest
			})
		};
	}
	return {
		...section,
		[head]: applyPathOp(child, {
			...op,
			path: rest
		})
	};
}
/**
* Layer `over` onto `under`: plain objects merge recursively, every other
* value (arrays included) replaces the lower layer wholesale. `over` never
* carries `undefined` entries — sections come from parsed documents and write
* snapshots pass {@link cloneJsonShaped}, which strips them so a sparse patch
* cannot erase lower keys.
*/
function mergeLayers(under, over) {
	if (over === void 0) return under;
	if (!isPlainObject(under) || !isPlainObject(over)) return over;
	const merged = { ...under };
	for (const [key, value] of Object.entries(over)) merged[key] = key in merged ? mergeLayers(merged[key], value) : value;
	return merged;
}
/** Recursively freeze one resolved value so handed-out snapshots stay immutable. */
function deepFreeze(value) {
	if (typeof value !== "object" || value === null || Object.isFrozen(value)) return value;
	for (const entry of Object.values(value)) deepFreeze(entry);
	return Object.freeze(value);
}
Service.init;
/**
* Value mirror of the `FiberState` members {@link isUnloading} compares
* against: a const enum has no runtime object to import, and the value is
* needed at runtime (same rationale as the CLI boot driver's mirror).
*/
const FIBER_DISPOSED = 4;
const FIBER_UNLOADING = 5;
/** Whether the consumer's own fiber is tearing down (not just losing the settings service). */
function isUnloading(ctx) {
	const state = ctx.fiber.state;
	return state === FIBER_UNLOADING || state === FIBER_DISPOSED;
}
/**
* Install the canonical optional-settings consumer wiring: while a settings
* service exists, register `ns` with the consumer's composition entry as the
* `base` layer and point the source thunk at the resolved scope; when the
* service goes away (disposal, provider reload), fall back to the entry so
* the consumer keeps working exactly as composed. The registration rides the
* scoped fiber, so no settings service ever mounted means none of this runs.
* @param ctx - consumer plugin context owning the wiring.
* @param ns - the consumer-owned settings namespace.
* @param schema - schema resolving the namespace (typically the plugin Config).
* @param entry - the consumer's composition entry config, used as `base`.
* @param hooks - source sink and change notification.
*/
function installSettingsSection(ctx, ns, schema, entry, hooks) {
	ctx.inject(["settings"], (sctx) => {
		const scope = sctx.settings.register(ns, schema, {
			base: entry,
			...hooks.validate === void 0 ? {} : { validate: hooks.validate }
		});
		hooks.setSource(() => scope.get());
		sctx.effect(() => () => {
			if (isUnloading(ctx)) return;
			hooks.setSource(() => entry);
			hooks.onChange();
		});
		hooks.onChange();
		scope.watch(() => {
			if (isUnloading(ctx)) return;
			hooks.onChange();
		});
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/auth/helpers.js
/**
* Standard api-key auth: a stored credential key wins, otherwise the first
* set env var resolves. Includes a `login` that prompts for the key.
* Providers with non-standard resolution (provider env, ambient files, IAM)
* write their own `ApiKeyAuth`.
*/
function envApiKeyAuth(name, envVars) {
	return {
		name,
		login: async (interaction) => {
			return {
				type: "api_key",
				key: await interaction.prompt({
					type: "secret",
					message: `Enter ${name}`
				})
			};
		},
		resolve: async ({ ctx, credential }) => {
			if (credential?.key) return {
				auth: { apiKey: credential.key },
				env: credential.env,
				source: "stored credential"
			};
			for (const envVar of envVars) {
				const value = await ctx.env(envVar);
				if (value) return {
					auth: { apiKey: value },
					source: envVar
				};
			}
		}
	};
}
/**
* Wraps a dynamically imported `OAuthAuth` so provider definitions can
* advertise OAuth without importing the implementation. The flow loads on
* first `login`/`refresh`/`toAuth` call; callers keep Node-only flow code out
* of bundles by loading through a bundler-opaque dynamic import (variable
* specifier, see the bedrock lazy wrapper).
*/
function lazyOAuth(input) {
	let promise;
	const loaded = () => {
		promise ??= input.load();
		return promise;
	};
	return {
		name: input.name,
		loginLabel: input.loginLabel,
		login: async (interaction) => (await loaded()).login(interaction),
		refresh: async (credential) => (await loaded()).refresh(credential),
		toAuth: async (credential) => (await loaded()).toAuth(credential)
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/utils/overflow.js
/**
* Regex patterns to detect context overflow errors from different providers.
*
* These patterns match error messages returned when the input exceeds
* the model's context window.
*
* Provider-specific patterns (with example error messages):
*
* - Anthropic: "prompt is too long: 213462 tokens > 200000 maximum"
* - Anthropic: "413 {\"error\":{\"type\":\"request_too_large\",\"message\":\"Request exceeds the maximum size\"}}"
* - OpenAI: "Your input exceeds the context window of this model"
* - OpenAI/LiteLLM: "Requested token count exceeds the model's maximum context length of 131072 tokens"
* - OpenAI-compatible: "Input length (265330) exceeds model's maximum context length (262144)."
* - Google: "The input token count (1196265) exceeds the maximum number of tokens allowed (1048575)"
* - xAI: "This model's maximum prompt length is 131072 but the request contains 537812 tokens"
* - Groq: "Please reduce the length of the messages or completion"
* - OpenRouter: "This endpoint's maximum context length is X tokens. However, you requested about Y tokens"
* - OpenRouter/Poolside: "Input length X exceeds the maximum allowed input length of Y tokens."
* - Together AI: "The input (X tokens) is longer than the model's context length (Y tokens)."
* - llama.cpp: "the request exceeds the available context size, try increasing it"
* - LM Studio: "tokens to keep from the initial prompt is greater than the context length"
* - GitHub Copilot: "prompt token count of X exceeds the limit of Y"
* - MiniMax: "invalid params, context window exceeds limit"
* - Kimi For Coding: "Your request exceeded model token limit: X (requested: Y)"
* - DS4: "Prompt has X tokens, but the configured context size is Y tokens"
* - Cerebras: "400/413 status code (no body)"
* - Mistral: "Prompt contains X tokens ... too large for model with Y maximum context length"
* - z.ai: Does NOT error, accepts overflow silently - handled via usage.input > contextWindow
* - Xiaomi MiMo: Truncates input to fill contextWindow exactly, then returns finish_reason "length"
*   with output=0 (no room left to generate). Detected via stopReason "length" + zero output +
*   input filling the context window.
* - DashScope/Qwen: "Range of input length should be [1, X]" (HTTP 400 invalid_parameter_error)
* - Ollama: Some deployments truncate silently, others return errors like "prompt too long; exceeded max context length by X tokens"
*/
const OVERFLOW_PATTERNS = [
	/prompt is too long/i,
	/request_too_large/i,
	/input is too long for requested model/i,
	/exceeds the context window/i,
	/exceeds (?:the )?(?:model'?s )?maximum context length(?: of [\d,]+ tokens?|\s*\([\d,]+\))/i,
	/input token count.*exceeds the maximum/i,
	/maximum prompt length is \d+/i,
	/reduce the length of the messages/i,
	/maximum context length is \d+ tokens/i,
	/exceeds (?:the )?maximum allowed input length of [\d,]+ tokens?/i,
	/input \(\d+ tokens\) is longer than the model'?s context length \(\d+ tokens\)/i,
	/exceeds the limit of \d+/i,
	/exceeds the available context size/i,
	/greater than the context length/i,
	/context window exceeds limit/i,
	/exceeded model token limit/i,
	/too large for model with \d+ maximum context length/i,
	/prompt has [\d,]+ tokens?, but the configured context size is [\d,]+ tokens?/i,
	/model_context_window_exceeded/i,
	/prompt too long; exceeded (?:max )?context length/i,
	/range of input length should be/i,
	/context[_ ]length[_ ]exceeded/i,
	/too many tokens/i,
	/token limit exceeded/i,
	/^4(?:00|13)\s*(?:status code)?\s*\(no body\)/i
];
/**
* Patterns that indicate non-overflow errors (e.g. rate limiting, server errors).
* Error messages matching any of these are excluded from overflow detection
* even if they also match an OVERFLOW_PATTERN.
*
* Example: Bedrock formats throttling errors as "ThrottlingException: Too many tokens,
* please wait before trying again." which would match the /too many tokens/i overflow
* pattern without this exclusion.
*/
const NON_OVERFLOW_PATTERNS = [
	/^(Throttling error|Service unavailable):/i,
	/rate limit/i,
	/too many requests/i
];
/**
* Check if an assistant message represents a context overflow error.
*
* This handles two cases:
* 1. Error-based overflow: Most providers return stopReason "error" with a
*    specific error message pattern.
* 2. Silent overflow: Some providers accept overflow requests and return
*    successfully. For these, we check if usage.input exceeds the context window.
*
* ## Reliability by Provider
*
* **Reliable detection (returns error with detectable message):**
* - Anthropic: "prompt is too long: X tokens > Y maximum" or "request_too_large"
* - OpenAI (Completions & Responses): "exceeds the context window", "exceeds the model's maximum context length of X tokens", or "exceeds model's maximum context length (X)"
* - Google Gemini: "input token count exceeds the maximum"
* - xAI (Grok): "maximum prompt length is X but request contains Y"
* - Groq: "reduce the length of the messages"
* - Cerebras: 400/413 status code (no body)
* - Mistral: "Prompt contains X tokens ... too large for model with Y maximum context length"
* - OpenRouter (most backends): "maximum context length is X tokens"
* - OpenRouter/Poolside: "Input length X exceeds the maximum allowed input length of Y tokens."
* - Together AI: "The input (X tokens) is longer than the model's context length (Y tokens)."
* - llama.cpp: "exceeds the available context size"
* - LM Studio: "greater than the context length"
* - Kimi For Coding: "exceeded model token limit: X (requested: Y)"
* - DS4: "Prompt has X tokens, but the configured context size is Y tokens"
* - DashScope/Qwen: "Range of input length should be [1, X]"
*
* **Unreliable detection:**
* - z.ai: Sometimes accepts overflow silently (detectable via usage.input > contextWindow),
*   sometimes returns rate limit errors. Pass contextWindow param to detect silent overflow.
* - Xiaomi MiMo: Truncates input to fit contextWindow then returns stopReason "length" with
*   output=0. Pass contextWindow param to detect via the "filled context + zero output" signal.
* - Ollama: May truncate input silently for some setups, but may also return explicit
*   overflow errors that match the patterns above. Silent truncation still cannot be
*   detected here because we do not know the expected token count.
*
* ## Custom Providers
*
* If you've added custom models via settings.json, this function may not detect
* overflow errors from those providers. To add support:
*
* 1. Send a request that exceeds the model's context window
* 2. Check the errorMessage in the response
* 3. Create a regex pattern that matches the error
* 4. The pattern should be added to OVERFLOW_PATTERNS in this file, or
*    check the errorMessage yourself before calling this function
*
* @param message - The assistant message to check
* @param contextWindow - Optional context window size for detecting silent overflow (z.ai)
* @returns true if the message indicates a context overflow
*/
function isContextOverflow(message, contextWindow) {
	if (message.stopReason === "error" && message.errorMessage) {
		if (!NON_OVERFLOW_PATTERNS.some((p) => p.test(message.errorMessage)) && OVERFLOW_PATTERNS.some((p) => p.test(message.errorMessage))) return true;
	}
	if (contextWindow && message.stopReason === "stop") {
		if (message.usage.input + message.usage.cacheRead > contextWindow) return true;
	}
	if (contextWindow && message.stopReason === "length" && message.usage.output === 0) {
		if (message.usage.input + message.usage.cacheRead >= contextWindow * .99) return true;
	}
	return false;
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/data/amazon-bedrock.json
var amazon_bedrock_default = { "bedrock-converse-stream": {
	"amazon.nova-2-lite-v1:0": {
		"id": "amazon.nova-2-lite-v1:0",
		"name": "Nova 2 Lite",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .33,
			"output": 2.75,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096
	},
	"amazon.nova-lite-v1:0": {
		"id": "amazon.nova-lite-v1:0",
		"name": "Nova Lite",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .06,
			"output": .24,
			"cacheRead": .015,
			"cacheWrite": 0
		},
		"contextWindow": 3e5,
		"maxTokens": 8192
	},
	"amazon.nova-micro-v1:0": {
		"id": "amazon.nova-micro-v1:0",
		"name": "Nova Micro",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .035,
			"output": .14,
			"cacheRead": .00875,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 8192
	},
	"amazon.nova-pro-v1:0": {
		"id": "amazon.nova-pro-v1:0",
		"name": "Nova Pro",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .8,
			"output": 3.2,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 3e5,
		"maxTokens": 8192
	},
	"anthropic.claude-fable-5": {
		"id": "anthropic.claude-fable-5",
		"name": "Claude Fable 5",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 50,
			"cacheRead": 1,
			"cacheWrite": 12.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"anthropic.claude-haiku-4-5-20251001-v1:0": {
		"id": "anthropic.claude-haiku-4-5-20251001-v1:0",
		"name": "Claude Haiku 4.5",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 5,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"anthropic.claude-opus-4-1-20250805-v1:0": {
		"id": "anthropic.claude-opus-4-1-20250805-v1:0",
		"name": "Claude Opus 4.1",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 75,
			"cacheRead": 1.5,
			"cacheWrite": 18.75
		},
		"contextWindow": 2e5,
		"maxTokens": 32e3
	},
	"anthropic.claude-opus-4-5-20251101-v1:0": {
		"id": "anthropic.claude-opus-4-5-20251101-v1:0",
		"name": "Claude Opus 4.5",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"anthropic.claude-opus-4-6-v1": {
		"id": "anthropic.claude-opus-4-6-v1",
		"name": "Claude Opus 4.6",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "max": "max" }
	},
	"anthropic.claude-opus-4-7": {
		"id": "anthropic.claude-opus-4-7",
		"name": "Claude Opus 4.7",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"anthropic.claude-opus-4-8": {
		"id": "anthropic.claude-opus-4-8",
		"name": "Claude Opus 4.8",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"anthropic.claude-sonnet-4-5-20250929-v1:0": {
		"id": "anthropic.claude-sonnet-4-5-20250929-v1:0",
		"name": "Claude Sonnet 4.5",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"anthropic.claude-sonnet-4-6": {
		"id": "anthropic.claude-sonnet-4-6",
		"name": "Claude Sonnet 4.6",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "max": "max" }
	},
	"anthropic.claude-sonnet-5": {
		"id": "anthropic.claude-sonnet-5",
		"name": "Claude Sonnet 5",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 10,
			"cacheRead": .2,
			"cacheWrite": 2.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"au.anthropic.claude-haiku-4-5-20251001-v1:0": {
		"id": "au.anthropic.claude-haiku-4-5-20251001-v1:0",
		"name": "Claude Haiku 4.5 (AU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 5,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"au.anthropic.claude-opus-4-6-v1": {
		"id": "au.anthropic.claude-opus-4-6-v1",
		"name": "AU Anthropic Claude Opus 4.6",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 16.5,
			"output": 82.5,
			"cacheRead": 1.65,
			"cacheWrite": 20.625
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "max": "max" }
	},
	"au.anthropic.claude-opus-4-8": {
		"id": "au.anthropic.claude-opus-4-8",
		"name": "Claude Opus 4.8 (AU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"au.anthropic.claude-opus-5": {
		"id": "au.anthropic.claude-opus-5",
		"name": "Claude Opus 5 (AU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"au.anthropic.claude-sonnet-4-5-20250929-v1:0": {
		"id": "au.anthropic.claude-sonnet-4-5-20250929-v1:0",
		"name": "Claude Sonnet 4.5 (AU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"au.anthropic.claude-sonnet-4-6": {
		"id": "au.anthropic.claude-sonnet-4-6",
		"name": "AU Anthropic Claude Sonnet 4.6",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3.3,
			"output": 16.5,
			"cacheRead": .33,
			"cacheWrite": 4.125
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "max": "max" }
	},
	"au.anthropic.claude-sonnet-5": {
		"id": "au.anthropic.claude-sonnet-5",
		"name": "Claude Sonnet 5 (AU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 10,
			"cacheRead": .2,
			"cacheWrite": 2.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"deepseek.r1-v1:0": {
		"id": "deepseek.r1-v1:0",
		"name": "DeepSeek-R1",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.35,
			"output": 5.4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 32768
	},
	"deepseek.v3-v1:0": {
		"id": "deepseek.v3-v1:0",
		"name": "DeepSeek-V3.1",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .58,
			"output": 1.68,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 163840,
		"maxTokens": 81920,
		"compat": { "supportsStrictMode": true }
	},
	"deepseek.v3.2": {
		"id": "deepseek.v3.2",
		"name": "DeepSeek-V3.2",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .62,
			"output": 1.85,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 163840,
		"maxTokens": 81920,
		"compat": { "supportsStrictMode": true }
	},
	"eu.anthropic.claude-fable-5": {
		"id": "eu.anthropic.claude-fable-5",
		"name": "Claude Fable 5 (EU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.eu-central-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 11,
			"output": 55,
			"cacheRead": 1.1,
			"cacheWrite": 13.75
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"eu.anthropic.claude-haiku-4-5-20251001-v1:0": {
		"id": "eu.anthropic.claude-haiku-4-5-20251001-v1:0",
		"name": "Claude Haiku 4.5 (EU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.eu-central-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.1,
			"output": 5.5,
			"cacheRead": .11,
			"cacheWrite": 1.375
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"eu.anthropic.claude-opus-4-5-20251101-v1:0": {
		"id": "eu.anthropic.claude-opus-4-5-20251101-v1:0",
		"name": "Claude Opus 4.5 (EU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.eu-central-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5.5,
			"output": 27.5,
			"cacheRead": .55,
			"cacheWrite": 6.875
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"eu.anthropic.claude-opus-4-6-v1": {
		"id": "eu.anthropic.claude-opus-4-6-v1",
		"name": "Claude Opus 4.6 (EU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.eu-central-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5.5,
			"output": 27.5,
			"cacheRead": .55,
			"cacheWrite": 6.875
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "max": "max" }
	},
	"eu.anthropic.claude-opus-4-7": {
		"id": "eu.anthropic.claude-opus-4-7",
		"name": "Claude Opus 4.7 (EU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.eu-central-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5.5,
			"output": 27.5,
			"cacheRead": .55,
			"cacheWrite": 6.875
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"eu.anthropic.claude-opus-4-8": {
		"id": "eu.anthropic.claude-opus-4-8",
		"name": "Claude Opus 4.8 (EU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.eu-central-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5.5,
			"output": 27.5,
			"cacheRead": .55,
			"cacheWrite": 6.875
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"eu.anthropic.claude-opus-5": {
		"id": "eu.anthropic.claude-opus-5",
		"name": "Claude Opus 5 (EU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.eu-central-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5.5,
			"output": 27.5,
			"cacheRead": .55,
			"cacheWrite": 6.875
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"eu.anthropic.claude-sonnet-4-5-20250929-v1:0": {
		"id": "eu.anthropic.claude-sonnet-4-5-20250929-v1:0",
		"name": "Claude Sonnet 4.5 (EU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.eu-central-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3.3,
			"output": 16.5,
			"cacheRead": .33,
			"cacheWrite": 4.125
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"eu.anthropic.claude-sonnet-4-6": {
		"id": "eu.anthropic.claude-sonnet-4-6",
		"name": "Claude Sonnet 4.6 (EU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.eu-central-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3.3,
			"output": 16.5,
			"cacheRead": .33,
			"cacheWrite": 4.125
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "max": "max" }
	},
	"eu.anthropic.claude-sonnet-5": {
		"id": "eu.anthropic.claude-sonnet-5",
		"name": "Claude Sonnet 5 (EU)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.eu-central-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.2,
			"output": 11,
			"cacheRead": .22,
			"cacheWrite": 2.75
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"global.anthropic.claude-fable-5": {
		"id": "global.anthropic.claude-fable-5",
		"name": "Claude Fable 5 (Global)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 50,
			"cacheRead": 1,
			"cacheWrite": 12.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"global.anthropic.claude-haiku-4-5-20251001-v1:0": {
		"id": "global.anthropic.claude-haiku-4-5-20251001-v1:0",
		"name": "Claude Haiku 4.5 (Global)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 5,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"global.anthropic.claude-opus-4-5-20251101-v1:0": {
		"id": "global.anthropic.claude-opus-4-5-20251101-v1:0",
		"name": "Claude Opus 4.5 (Global)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"global.anthropic.claude-opus-4-6-v1": {
		"id": "global.anthropic.claude-opus-4-6-v1",
		"name": "Claude Opus 4.6 (Global)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "max": "max" }
	},
	"global.anthropic.claude-opus-4-7": {
		"id": "global.anthropic.claude-opus-4-7",
		"name": "Claude Opus 4.7 (Global)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"global.anthropic.claude-opus-4-8": {
		"id": "global.anthropic.claude-opus-4-8",
		"name": "Claude Opus 4.8 (Global)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"global.anthropic.claude-opus-5": {
		"id": "global.anthropic.claude-opus-5",
		"name": "Claude Opus 5 (Global)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"global.anthropic.claude-sonnet-4-5-20250929-v1:0": {
		"id": "global.anthropic.claude-sonnet-4-5-20250929-v1:0",
		"name": "Claude Sonnet 4.5 (Global)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"global.anthropic.claude-sonnet-4-6": {
		"id": "global.anthropic.claude-sonnet-4-6",
		"name": "Claude Sonnet 4.6 (Global)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "max": "max" }
	},
	"global.anthropic.claude-sonnet-5": {
		"id": "global.anthropic.claude-sonnet-5",
		"name": "Claude Sonnet 5 (Global)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 10,
			"cacheRead": .2,
			"cacheWrite": 2.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"google.gemma-3-27b-it": {
		"id": "google.gemma-3-27b-it",
		"name": "Google Gemma 3 27B Instruct",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .12,
			"output": .2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 202752,
		"maxTokens": 8192,
		"compat": { "supportsStrictMode": true }
	},
	"google.gemma-3-4b-it": {
		"id": "google.gemma-3-4b-it",
		"name": "Gemma 3 4B IT",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .04,
			"output": .08,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096
	},
	"jp.anthropic.claude-haiku-4-5-20251001-v1:0": {
		"id": "jp.anthropic.claude-haiku-4-5-20251001-v1:0",
		"name": "Claude Haiku 4.5 (JP)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 5,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"jp.anthropic.claude-opus-4-7": {
		"id": "jp.anthropic.claude-opus-4-7",
		"name": "Claude Opus 4.7 (JP)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"jp.anthropic.claude-opus-4-8": {
		"id": "jp.anthropic.claude-opus-4-8",
		"name": "Claude Opus 4.8 (JP)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"jp.anthropic.claude-opus-5": {
		"id": "jp.anthropic.claude-opus-5",
		"name": "Claude Opus 5 (JP)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"jp.anthropic.claude-sonnet-4-5-20250929-v1:0": {
		"id": "jp.anthropic.claude-sonnet-4-5-20250929-v1:0",
		"name": "Claude Sonnet 4.5 (JP)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"jp.anthropic.claude-sonnet-4-6": {
		"id": "jp.anthropic.claude-sonnet-4-6",
		"name": "Claude Sonnet 4.6 (JP)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "max": "max" }
	},
	"jp.anthropic.claude-sonnet-5": {
		"id": "jp.anthropic.claude-sonnet-5",
		"name": "Claude Sonnet 5 (JP)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 10,
			"cacheRead": .2,
			"cacheWrite": 2.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"meta.llama3-1-70b-instruct-v1:0": {
		"id": "meta.llama3-1-70b-instruct-v1:0",
		"name": "Llama 3.1 70B Instruct",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .72,
			"output": .72,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096
	},
	"meta.llama3-1-8b-instruct-v1:0": {
		"id": "meta.llama3-1-8b-instruct-v1:0",
		"name": "Llama 3.1 8B Instruct",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .22,
			"output": .22,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096
	},
	"meta.llama3-3-70b-instruct-v1:0": {
		"id": "meta.llama3-3-70b-instruct-v1:0",
		"name": "Llama 3.3 70B Instruct",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .72,
			"output": .72,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096
	},
	"meta.llama4-maverick-17b-instruct-v1:0": {
		"id": "meta.llama4-maverick-17b-instruct-v1:0",
		"name": "Llama 4 Maverick 17B Instruct",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .24,
			"output": .97,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 16384
	},
	"meta.llama4-scout-17b-instruct-v1:0": {
		"id": "meta.llama4-scout-17b-instruct-v1:0",
		"name": "Llama 4 Scout 17B Instruct",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .17,
			"output": .66,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 35e5,
		"maxTokens": 16384
	},
	"minimax.minimax-m2": {
		"id": "minimax.minimax-m2",
		"name": "MiniMax M2",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 204608,
		"maxTokens": 128e3
	},
	"minimax.minimax-m2.1": {
		"id": "minimax.minimax-m2.1",
		"name": "MiniMax M2.1",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"minimax.minimax-m2.5": {
		"id": "minimax.minimax-m2.5",
		"name": "MiniMax M2.5",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 196608,
		"maxTokens": 98304
	},
	"mistral.devstral-2-123b": {
		"id": "mistral.devstral-2-123b",
		"name": "Devstral 2 123B",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .4,
			"output": 2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 8192,
		"compat": { "supportsStrictMode": true }
	},
	"mistral.magistral-small-2509": {
		"id": "mistral.magistral-small-2509",
		"name": "Magistral Small 1.2",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .5,
			"output": 1.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4e4,
		"compat": { "supportsStrictMode": true }
	},
	"mistral.ministral-3-14b-instruct": {
		"id": "mistral.ministral-3-14b-instruct",
		"name": "Ministral 14B 3.0",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .2,
			"output": .2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": { "supportsStrictMode": true }
	},
	"mistral.ministral-3-3b-instruct": {
		"id": "mistral.ministral-3-3b-instruct",
		"name": "Ministral 3 3B",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .1,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 8192,
		"compat": { "supportsStrictMode": true }
	},
	"mistral.ministral-3-8b-instruct": {
		"id": "mistral.ministral-3-8b-instruct",
		"name": "Ministral 3 8B",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .15,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": { "supportsStrictMode": true }
	},
	"mistral.mistral-large-3-675b-instruct": {
		"id": "mistral.mistral-large-3-675b-instruct",
		"name": "Mistral Large 3",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .5,
			"output": 1.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 8192,
		"compat": { "supportsStrictMode": true }
	},
	"mistral.pixtral-large-2502-v1:0": {
		"id": "mistral.pixtral-large-2502-v1:0",
		"name": "Pixtral Large (25.02)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 8192
	},
	"mistral.voxtral-mini-3b-2507": {
		"id": "mistral.voxtral-mini-3b-2507",
		"name": "Voxtral Mini 3B 2507",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .04,
			"output": .04,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": { "supportsStrictMode": true }
	},
	"mistral.voxtral-small-24b-2507": {
		"id": "mistral.voxtral-small-24b-2507",
		"name": "Voxtral Small 24B 2507",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .35,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 32e3,
		"maxTokens": 8192,
		"compat": { "supportsStrictMode": true }
	},
	"moonshot.kimi-k2-thinking": {
		"id": "moonshot.kimi-k2-thinking",
		"name": "Kimi K2 Thinking",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262143,
		"maxTokens": 16e3,
		"compat": { "supportsStrictMode": true }
	},
	"moonshotai.kimi-k2.5": {
		"id": "moonshotai.kimi-k2.5",
		"name": "Kimi K2.5",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .6,
			"output": 3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262143,
		"maxTokens": 16e3,
		"compat": { "supportsStrictMode": true }
	},
	"nvidia.nemotron-nano-12b-v2": {
		"id": "nvidia.nemotron-nano-12b-v2",
		"name": "NVIDIA Nemotron Nano 12B v2 VL BF16",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": .6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": { "supportsStrictMode": true }
	},
	"nvidia.nemotron-nano-3-30b": {
		"id": "nvidia.nemotron-nano-3-30b",
		"name": "NVIDIA Nemotron Nano 3 30B",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .06,
			"output": .24,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": { "supportsStrictMode": true }
	},
	"nvidia.nemotron-nano-9b-v2": {
		"id": "nvidia.nemotron-nano-9b-v2",
		"name": "NVIDIA Nemotron Nano 9B v2",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .06,
			"output": .23,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": { "supportsStrictMode": true }
	},
	"nvidia.nemotron-super-3-120b": {
		"id": "nvidia.nemotron-super-3-120b",
		"name": "NVIDIA Nemotron 3 Super 120B A12B",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .65,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 131072,
		"compat": { "supportsStrictMode": true }
	},
	"openai.gpt-5.4": {
		"id": "openai.gpt-5.4",
		"name": "GPT-5.4",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.75,
			"output": 16.5,
			"cacheRead": .275,
			"cacheWrite": 0
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai.gpt-5.5": {
		"id": "openai.gpt-5.5",
		"name": "GPT-5.5",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5.5,
			"output": 33,
			"cacheRead": .55,
			"cacheWrite": 0
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai.gpt-5.6-luna": {
		"id": "openai.gpt-5.6-luna",
		"name": "GPT-5.6 Luna",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 6,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai.gpt-5.6-sol": {
		"id": "openai.gpt-5.6-sol",
		"name": "GPT-5.6 Sol",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai.gpt-5.6-terra": {
		"id": "openai.gpt-5.6-terra",
		"name": "GPT-5.6 Terra",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 15,
			"cacheRead": .25,
			"cacheWrite": 3.125
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai.gpt-oss-120b": {
		"id": "openai.gpt-oss-120b",
		"name": "gpt-oss-120b",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "supportsStrictMode": true }
	},
	"openai.gpt-oss-120b-1:0": {
		"id": "openai.gpt-oss-120b-1:0",
		"name": "gpt-oss-120b",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "supportsStrictMode": true }
	},
	"openai.gpt-oss-20b": {
		"id": "openai.gpt-oss-20b",
		"name": "gpt-oss-20b",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .07,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "supportsStrictMode": true }
	},
	"openai.gpt-oss-20b-1:0": {
		"id": "openai.gpt-oss-20b-1:0",
		"name": "gpt-oss-20b",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .07,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "supportsStrictMode": true }
	},
	"openai.gpt-oss-safeguard-120b": {
		"id": "openai.gpt-oss-safeguard-120b",
		"name": "GPT OSS Safeguard 120B",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "supportsStrictMode": true }
	},
	"openai.gpt-oss-safeguard-20b": {
		"id": "openai.gpt-oss-safeguard-20b",
		"name": "GPT OSS Safeguard 20B",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .07,
			"output": .2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "supportsStrictMode": true }
	},
	"qwen.qwen3-235b-a22b-2507-v1:0": {
		"id": "qwen.qwen3-235b-a22b-2507-v1:0",
		"name": "Qwen3 235B A22B 2507",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .22,
			"output": .88,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 131072,
		"compat": { "supportsStrictMode": true }
	},
	"qwen.qwen3-32b-v1:0": {
		"id": "qwen.qwen3-32b-v1:0",
		"name": "Qwen3 32B (dense)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 16384,
		"maxTokens": 16384,
		"compat": { "supportsStrictMode": true }
	},
	"qwen.qwen3-coder-30b-a3b-v1:0": {
		"id": "qwen.qwen3-coder-30b-a3b-v1:0",
		"name": "Qwen3 Coder 30B A3B Instruct",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 131072,
		"compat": { "supportsStrictMode": true }
	},
	"qwen.qwen3-coder-480b-a35b-v1:0": {
		"id": "qwen.qwen3-coder-480b-a35b-v1:0",
		"name": "Qwen3 Coder 480B A35B Instruct",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .22,
			"output": 1.8,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536,
		"compat": { "supportsStrictMode": true }
	},
	"qwen.qwen3-coder-next": {
		"id": "qwen.qwen3-coder-next",
		"name": "Qwen3 Coder Next",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .22,
			"output": 1.8,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536,
		"compat": { "supportsStrictMode": true }
	},
	"qwen.qwen3-next-80b-a3b": {
		"id": "qwen.qwen3-next-80b-a3b",
		"name": "Qwen/Qwen3-Next-80B-A3B-Instruct",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .14,
			"output": 1.4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262e3,
		"maxTokens": 262e3,
		"compat": { "supportsStrictMode": true }
	},
	"qwen.qwen3-vl-235b-a22b": {
		"id": "qwen.qwen3-vl-235b-a22b",
		"name": "Qwen/Qwen3-VL-235B-A22B-Instruct",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 1.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262e3,
		"maxTokens": 262e3,
		"compat": { "supportsStrictMode": true }
	},
	"us.anthropic.claude-fable-5": {
		"id": "us.anthropic.claude-fable-5",
		"name": "Claude Fable 5 (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 50,
			"cacheRead": 1,
			"cacheWrite": 12.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"us.anthropic.claude-haiku-4-5-20251001-v1:0": {
		"id": "us.anthropic.claude-haiku-4-5-20251001-v1:0",
		"name": "Claude Haiku 4.5 (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 5,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"us.anthropic.claude-opus-4-1-20250805-v1:0": {
		"id": "us.anthropic.claude-opus-4-1-20250805-v1:0",
		"name": "Claude Opus 4.1 (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 75,
			"cacheRead": 1.5,
			"cacheWrite": 18.75
		},
		"contextWindow": 2e5,
		"maxTokens": 32e3
	},
	"us.anthropic.claude-opus-4-5-20251101-v1:0": {
		"id": "us.anthropic.claude-opus-4-5-20251101-v1:0",
		"name": "Claude Opus 4.5 (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"us.anthropic.claude-opus-4-6-v1": {
		"id": "us.anthropic.claude-opus-4-6-v1",
		"name": "Claude Opus 4.6 (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "max": "max" }
	},
	"us.anthropic.claude-opus-4-7": {
		"id": "us.anthropic.claude-opus-4-7",
		"name": "Claude Opus 4.7 (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"us.anthropic.claude-opus-4-8": {
		"id": "us.anthropic.claude-opus-4-8",
		"name": "Claude Opus 4.8 (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"us.anthropic.claude-opus-5": {
		"id": "us.anthropic.claude-opus-5",
		"name": "Claude Opus 5 (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"us.anthropic.claude-sonnet-4-5-20250929-v1:0": {
		"id": "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
		"name": "Claude Sonnet 4.5 (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true }
	},
	"us.anthropic.claude-sonnet-4-6": {
		"id": "us.anthropic.claude-sonnet-4-6",
		"name": "Claude Sonnet 4.6 (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": { "max": "max" }
	},
	"us.anthropic.claude-sonnet-5": {
		"id": "us.anthropic.claude-sonnet-5",
		"name": "Claude Sonnet 5 (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 10,
			"cacheRead": .2,
			"cacheWrite": 2.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": { "supportsStrictMode": true },
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"us.deepseek.r1-v1:0": {
		"id": "us.deepseek.r1-v1:0",
		"name": "DeepSeek-R1 (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.35,
			"output": 5.4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 32768
	},
	"us.meta.llama4-maverick-17b-instruct-v1:0": {
		"id": "us.meta.llama4-maverick-17b-instruct-v1:0",
		"name": "Llama 4 Maverick 17B Instruct (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .24,
			"output": .97,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 16384
	},
	"us.meta.llama4-scout-17b-instruct-v1:0": {
		"id": "us.meta.llama4-scout-17b-instruct-v1:0",
		"name": "Llama 4 Scout 17B Instruct (US)",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .17,
			"output": .66,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 35e5,
		"maxTokens": 16384
	},
	"writer.palmyra-x4-v1:0": {
		"id": "writer.palmyra-x4-v1:0",
		"name": "Palmyra X4",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 122880,
		"maxTokens": 8192
	},
	"writer.palmyra-x5-v1:0": {
		"id": "writer.palmyra-x5-v1:0",
		"name": "Palmyra X5",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 104e4,
		"maxTokens": 8192
	},
	"xai.grok-4.3": {
		"id": "xai.grok-4.3",
		"name": "Grok 4.3",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 2.5,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 131072,
		"compat": { "supportsStrictMode": true }
	},
	"zai.glm-4.7": {
		"id": "zai.glm-4.7",
		"name": "GLM-4.7",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 204800,
		"maxTokens": 131072,
		"compat": { "supportsStrictMode": true }
	},
	"zai.glm-4.7-flash": {
		"id": "zai.glm-4.7-flash",
		"name": "GLM-4.7-Flash",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .07,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 131072,
		"compat": { "supportsStrictMode": true }
	},
	"zai.glm-5": {
		"id": "zai.glm-5",
		"name": "GLM-5",
		"api": "bedrock-converse-stream",
		"provider": "amazon-bedrock",
		"baseUrl": "https://bedrock-runtime.us-east-1.amazonaws.com",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1,
			"output": 3.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 202752,
		"maxTokens": 101376,
		"compat": { "supportsStrictMode": true }
	}
} };
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/model-catalog.js
function flattenModelCatalog(_provider, groups) {
	return Object.assign({}, ...Object.values(groups));
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/amazon-bedrock.models.js
const AMAZON_BEDROCK_MODELS = flattenModelCatalog("amazon-bedrock", amazon_bedrock_default);
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/ant-ling.models.js
const ANT_LING_MODELS = flattenModelCatalog("ant-ling", { "openai-completions": {
	"Ling-2.6-1T": {
		"id": "Ling-2.6-1T",
		"name": "Ling 2.6 1T",
		"api": "openai-completions",
		"baseUrl": "https://api.ant-ling.com/v1",
		"provider": "ant-ling",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .06,
			"output": .25,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 65536,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "ant-ling",
			"supportsLongCacheRetention": false
		}
	},
	"Ling-2.6-flash": {
		"id": "Ling-2.6-flash",
		"name": "Ling 2.6 Flash",
		"api": "openai-completions",
		"baseUrl": "https://api.ant-ling.com/v1",
		"provider": "ant-ling",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .01,
			"output": .02,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 65536,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "ant-ling",
			"supportsLongCacheRetention": false
		}
	},
	"Ring-2.6-1T": {
		"id": "Ring-2.6-1T",
		"name": "Ring 2.6 1T",
		"api": "openai-completions",
		"baseUrl": "https://api.ant-ling.com/v1",
		"provider": "ant-ling",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .06,
			"output": .25,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 65536,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "ant-ling",
			"supportsLongCacheRetention": false
		},
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": null,
			"medium": null,
			"high": "high",
			"xhigh": "xhigh"
		}
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/anthropic.models.js
const ANTHROPIC_MODELS = flattenModelCatalog("anthropic", { "anthropic-messages": {
	"claude-fable-5": {
		"id": "claude-fable-5",
		"name": "Claude Fable 5",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 50,
			"cacheRead": 1,
			"cacheWrite": 12.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": {
			"forceAdaptiveThinking": true,
			"supportsStrictTools": true
		}
	},
	"claude-haiku-4-5": {
		"id": "claude-haiku-4-5",
		"name": "Claude Haiku 4.5 (latest)",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 5,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictTools": true }
	},
	"claude-haiku-4-5-20251001": {
		"id": "claude-haiku-4-5-20251001",
		"name": "Claude Haiku 4.5",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 5,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictTools": true }
	},
	"claude-opus-4-1": {
		"id": "claude-opus-4-1",
		"name": "Claude Opus 4.1 (latest)",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 75,
			"cacheRead": 1.5,
			"cacheWrite": 18.75
		},
		"contextWindow": 2e5,
		"maxTokens": 32e3,
		"compat": { "supportsStrictTools": true }
	},
	"claude-opus-4-1-20250805": {
		"id": "claude-opus-4-1-20250805",
		"name": "Claude Opus 4.1",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 75,
			"cacheRead": 1.5,
			"cacheWrite": 18.75
		},
		"contextWindow": 2e5,
		"maxTokens": 32e3,
		"compat": { "supportsStrictTools": true }
	},
	"claude-opus-4-5": {
		"id": "claude-opus-4-5",
		"name": "Claude Opus 4.5 (latest)",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictTools": true }
	},
	"claude-opus-4-5-20251101": {
		"id": "claude-opus-4-5-20251101",
		"name": "Claude Opus 4.5",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": { "supportsStrictTools": true }
	},
	"claude-opus-4-6": {
		"id": "claude-opus-4-6",
		"name": "Claude Opus 4.6",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "max": "max" },
		"compat": {
			"forceAdaptiveThinking": true,
			"supportsStrictTools": true
		}
	},
	"claude-opus-4-7": {
		"id": "claude-opus-4-7",
		"name": "Claude Opus 4.7",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": {
			"forceAdaptiveThinking": true,
			"supportsTemperature": false,
			"supportsStrictTools": true
		}
	},
	"claude-opus-4-8": {
		"id": "claude-opus-4-8",
		"name": "Claude Opus 4.8",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": {
			"forceAdaptiveThinking": true,
			"supportsTemperature": false,
			"supportsStrictTools": true
		}
	},
	"claude-opus-5": {
		"id": "claude-opus-5",
		"name": "Claude Opus 5",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": {
			"forceAdaptiveThinking": true,
			"supportsTemperature": false,
			"supportsStrictTools": true
		}
	},
	"claude-sonnet-4-5": {
		"id": "claude-sonnet-4-5",
		"name": "Claude Sonnet 4.5 (latest)",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3,
		"compat": { "supportsStrictTools": true }
	},
	"claude-sonnet-4-5-20250929": {
		"id": "claude-sonnet-4-5-20250929",
		"name": "Claude Sonnet 4.5",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3,
		"compat": { "supportsStrictTools": true }
	},
	"claude-sonnet-4-6": {
		"id": "claude-sonnet-4-6",
		"name": "Claude Sonnet 4.6",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "max": "max" },
		"compat": {
			"forceAdaptiveThinking": true,
			"supportsStrictTools": true
		}
	},
	"claude-sonnet-5": {
		"id": "claude-sonnet-5",
		"name": "Claude Sonnet 5",
		"api": "anthropic-messages",
		"provider": "anthropic",
		"baseUrl": "https://api.anthropic.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 10,
			"cacheRead": .2,
			"cacheWrite": 2.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": {
			"forceAdaptiveThinking": true,
			"supportsStrictTools": true
		}
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/azure-openai-responses.models.js
const AZURE_OPENAI_RESPONSES_MODELS = flattenModelCatalog("azure-openai-responses", { "azure-openai-responses": {
	"gpt-4": {
		"id": "gpt-4",
		"name": "GPT-4",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 30,
			"output": 60,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 8192,
		"maxTokens": 8192
	},
	"gpt-4-turbo": {
		"id": "gpt-4-turbo",
		"name": "GPT-4 Turbo",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 30,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096
	},
	"gpt-4.1": {
		"id": "gpt-4.1",
		"name": "GPT-4.1",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 8,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 1047576,
		"maxTokens": 32768
	},
	"gpt-4.1-mini": {
		"id": "gpt-4.1-mini",
		"name": "GPT-4.1 mini",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 1.6,
			"cacheRead": .1,
			"cacheWrite": 0
		},
		"contextWindow": 1047576,
		"maxTokens": 32768
	},
	"gpt-4.1-nano": {
		"id": "gpt-4.1-nano",
		"name": "GPT-4.1 nano",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .4,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 1047576,
		"maxTokens": 32768
	},
	"gpt-4o": {
		"id": "gpt-4o",
		"name": "GPT-4o",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 1.25,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384
	},
	"gpt-4o-2024-05-13": {
		"id": "gpt-4o-2024-05-13",
		"name": "GPT-4o (2024-05-13)",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 15,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096
	},
	"gpt-4o-2024-08-06": {
		"id": "gpt-4o-2024-08-06",
		"name": "GPT-4o (2024-08-06)",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 1.25,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384
	},
	"gpt-4o-2024-11-20": {
		"id": "gpt-4o-2024-11-20",
		"name": "GPT-4o (2024-11-20)",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 1.25,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384
	},
	"gpt-4o-mini": {
		"id": "gpt-4o-mini",
		"name": "GPT-4o mini",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": .075,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384
	},
	"gpt-5": {
		"id": "gpt-5",
		"name": "GPT-5",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "off": null },
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5-chat-latest": {
		"id": "gpt-5-chat-latest",
		"name": "GPT-5 Chat Latest",
		"api": "azure-openai-responses",
		"baseUrl": "",
		"provider": "azure-openai-responses",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"thinkingLevelMap": { "off": null },
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5-mini": {
		"id": "gpt-5-mini",
		"name": "GPT-5 Mini",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 2,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "off": null },
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5-nano": {
		"id": "gpt-5-nano",
		"name": "GPT-5 Nano",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .05,
			"output": .4,
			"cacheRead": .005,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "off": null },
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5-pro": {
		"id": "gpt-5-pro",
		"name": "GPT-5 Pro",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 120,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "off": null },
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.1": {
		"id": "gpt-5.1",
		"name": "GPT-5.1",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "off": null },
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.2": {
		"id": "gpt-5.2",
		"name": "GPT-5.2",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.2-chat-latest": {
		"id": "gpt-5.2-chat-latest",
		"name": "GPT-5.2 Chat",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.2-pro": {
		"id": "gpt-5.2-pro",
		"name": "GPT-5.2 Pro",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 21,
			"output": 168,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.3-chat-latest": {
		"id": "gpt-5.3-chat-latest",
		"name": "GPT-5.3 Chat (latest)",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.3-codex": {
		"id": "gpt-5.3-codex",
		"name": "GPT-5.3 Codex",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.3-codex-spark": {
		"id": "gpt-5.3-codex-spark",
		"name": "GPT-5.3 Codex Spark",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 32e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.4": {
		"id": "gpt-5.4",
		"name": "GPT-5.4",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 15,
			"cacheRead": .25,
			"cacheWrite": 0
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.4-mini": {
		"id": "gpt-5.4-mini",
		"name": "GPT-5.4 mini",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .75,
			"output": 4.5,
			"cacheRead": .075,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.4-nano": {
		"id": "gpt-5.4-nano",
		"name": "GPT-5.4 nano",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": 1.25,
			"cacheRead": .02,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.4-pro": {
		"id": "gpt-5.4-pro",
		"name": "GPT-5.4 Pro",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 30,
			"output": 180,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.5": {
		"id": "gpt-5.5",
		"name": "GPT-5.5",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.5-pro": {
		"id": "gpt-5.5-pro",
		"name": "GPT-5.5 Pro",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 30,
			"output": 180,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh",
			"minimal": null,
			"low": null
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.6-luna": {
		"id": "gpt-5.6-luna",
		"name": "GPT-5.6 Luna",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 6,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.6-sol": {
		"id": "gpt-5.6-sol",
		"name": "GPT-5.6 Sol",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.6-terra": {
		"id": "gpt-5.6-terra",
		"name": "GPT-5.6 Terra",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 15,
			"cacheRead": .25,
			"cacheWrite": 3.125
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-realtime-2.1": {
		"id": "gpt-realtime-2.1",
		"name": "GPT-Realtime-2.1",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 4,
			"output": 24,
			"cacheRead": .4,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 32e3
	},
	"o1": {
		"id": "o1",
		"name": "o1",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 60,
			"cacheRead": 7.5,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5
	},
	"o1-pro": {
		"id": "o1-pro",
		"name": "o1-pro",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 150,
			"output": 600,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5
	},
	"o3": {
		"id": "o3",
		"name": "o3",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 8,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5
	},
	"o3-mini": {
		"id": "o3-mini",
		"name": "o3-mini",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.1,
			"output": 4.4,
			"cacheRead": .55,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5
	},
	"o3-pro": {
		"id": "o3-pro",
		"name": "o3-pro",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 20,
			"output": 80,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5
	},
	"o4-mini": {
		"id": "o4-mini",
		"name": "o4-mini",
		"api": "azure-openai-responses",
		"provider": "azure-openai-responses",
		"baseUrl": "",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.1,
			"output": 4.4,
			"cacheRead": .275,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/cerebras.models.js
const CEREBRAS_MODELS = flattenModelCatalog("cerebras", { "openai-completions": {
	"gemma-4-31b": {
		"id": "gemma-4-31b",
		"name": "Gemma 4 31B IT",
		"api": "openai-completions",
		"provider": "cerebras",
		"baseUrl": "https://api.cerebras.ai/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .99,
			"output": 1.49,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 40960,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false
		},
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"gpt-oss-120b": {
		"id": "gpt-oss-120b",
		"name": "GPT OSS 120B",
		"api": "openai-completions",
		"provider": "cerebras",
		"baseUrl": "https://api.cerebras.ai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .35,
			"output": .75,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 40960,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false
		},
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"zai-glm-4.7": {
		"id": "zai-glm-4.7",
		"name": "Z.AI GLM-4.7",
		"api": "openai-completions",
		"provider": "cerebras",
		"baseUrl": "https://api.cerebras.ai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 2.25,
			"output": 2.75,
			"cacheRead": 2.25,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 40960,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false
		},
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": null,
			"medium": null,
			"high": null,
			"xhigh": null,
			"max": null
		}
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/cloudflare-ai-gateway.models.js
const CLOUDFLARE_AI_GATEWAY_MODELS = flattenModelCatalog("cloudflare-ai-gateway", {
	"anthropic-messages": {
		"claude-3-5-haiku": {
			"id": "claude-3-5-haiku",
			"name": "Claude Haiku 3.5 (latest)",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": false,
			"input": ["text", "image"],
			"cost": {
				"input": .8,
				"output": 4,
				"cacheRead": .08,
				"cacheWrite": 1
			},
			"contextWindow": 2e5,
			"maxTokens": 8192,
			"compat": { "sendSessionAffinityHeaders": true }
		},
		"claude-3-haiku": {
			"id": "claude-3-haiku",
			"name": "Claude Haiku 3",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": false,
			"input": ["text", "image"],
			"cost": {
				"input": .25,
				"output": 1.25,
				"cacheRead": .03,
				"cacheWrite": .3
			},
			"contextWindow": 2e5,
			"maxTokens": 4096,
			"compat": { "sendSessionAffinityHeaders": true }
		},
		"claude-3-opus": {
			"id": "claude-3-opus",
			"name": "Claude Opus 3",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": false,
			"input": ["text", "image"],
			"cost": {
				"input": 15,
				"output": 75,
				"cacheRead": 1.5,
				"cacheWrite": 18.75
			},
			"contextWindow": 2e5,
			"maxTokens": 4096,
			"compat": { "sendSessionAffinityHeaders": true }
		},
		"claude-3-sonnet": {
			"id": "claude-3-sonnet",
			"name": "Claude Sonnet 3",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": false,
			"input": ["text", "image"],
			"cost": {
				"input": 3,
				"output": 15,
				"cacheRead": .3,
				"cacheWrite": .3
			},
			"contextWindow": 2e5,
			"maxTokens": 4096,
			"compat": { "sendSessionAffinityHeaders": true }
		},
		"claude-3.5-haiku": {
			"id": "claude-3.5-haiku",
			"name": "Claude Haiku 3.5 (latest)",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": false,
			"input": ["text", "image"],
			"cost": {
				"input": .8,
				"output": 4,
				"cacheRead": .08,
				"cacheWrite": 1
			},
			"contextWindow": 2e5,
			"maxTokens": 8192,
			"compat": { "sendSessionAffinityHeaders": true }
		},
		"claude-3.5-sonnet": {
			"id": "claude-3.5-sonnet",
			"name": "Claude Sonnet 3.5 v2",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": false,
			"input": ["text", "image"],
			"cost": {
				"input": 3,
				"output": 15,
				"cacheRead": .3,
				"cacheWrite": 3.75
			},
			"contextWindow": 2e5,
			"maxTokens": 8192,
			"compat": { "sendSessionAffinityHeaders": true }
		},
		"claude-fable-5": {
			"id": "claude-fable-5",
			"name": "Claude Fable 5",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 10,
				"output": 50,
				"cacheRead": 1,
				"cacheWrite": 12.5
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"forceAdaptiveThinking": true
			},
			"thinkingLevelMap": {
				"off": null,
				"xhigh": "xhigh",
				"max": "max"
			}
		},
		"claude-haiku-4-5": {
			"id": "claude-haiku-4-5",
			"name": "Claude Haiku 4.5 (latest)",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1,
				"output": 5,
				"cacheRead": .1,
				"cacheWrite": 1.25
			},
			"contextWindow": 2e5,
			"maxTokens": 64e3,
			"compat": { "sendSessionAffinityHeaders": true }
		},
		"claude-opus-4": {
			"id": "claude-opus-4",
			"name": "Claude Opus 4 (latest)",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 15,
				"output": 75,
				"cacheRead": 1.5,
				"cacheWrite": 18.75
			},
			"contextWindow": 2e5,
			"maxTokens": 32e3,
			"compat": { "sendSessionAffinityHeaders": true }
		},
		"claude-opus-4-1": {
			"id": "claude-opus-4-1",
			"name": "Claude Opus 4.1 (latest)",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 15,
				"output": 75,
				"cacheRead": 1.5,
				"cacheWrite": 18.75
			},
			"contextWindow": 2e5,
			"maxTokens": 32e3,
			"compat": { "sendSessionAffinityHeaders": true }
		},
		"claude-opus-4-5": {
			"id": "claude-opus-4-5",
			"name": "Claude Opus 4.5 (latest)",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 2e5,
			"maxTokens": 64e3,
			"compat": { "sendSessionAffinityHeaders": true }
		},
		"claude-opus-4-6": {
			"id": "claude-opus-4-6",
			"name": "Claude Opus 4.6 (latest)",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"forceAdaptiveThinking": true
			},
			"thinkingLevelMap": { "max": "max" }
		},
		"claude-opus-4-7": {
			"id": "claude-opus-4-7",
			"name": "Claude Opus 4.7",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"forceAdaptiveThinking": true,
				"supportsTemperature": false
			},
			"thinkingLevelMap": {
				"xhigh": "xhigh",
				"max": "max"
			}
		},
		"claude-opus-4-8": {
			"id": "claude-opus-4-8",
			"name": "Claude Opus 4.8",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"forceAdaptiveThinking": true,
				"supportsTemperature": false
			},
			"thinkingLevelMap": {
				"xhigh": "xhigh",
				"max": "max"
			}
		},
		"claude-sonnet-4": {
			"id": "claude-sonnet-4",
			"name": "Claude Sonnet 4 (latest)",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 3,
				"output": 15,
				"cacheRead": .3,
				"cacheWrite": 3.75
			},
			"contextWindow": 2e5,
			"maxTokens": 64e3,
			"compat": { "sendSessionAffinityHeaders": true }
		},
		"claude-sonnet-4-5": {
			"id": "claude-sonnet-4-5",
			"name": "Claude Sonnet 4.5 (latest)",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 3,
				"output": 15,
				"cacheRead": .3,
				"cacheWrite": 3.75
			},
			"contextWindow": 2e5,
			"maxTokens": 64e3,
			"compat": { "sendSessionAffinityHeaders": true }
		},
		"claude-sonnet-4-6": {
			"id": "claude-sonnet-4-6",
			"name": "Claude Sonnet 4.6",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 3,
				"output": 15,
				"cacheRead": .3,
				"cacheWrite": 3.75
			},
			"contextWindow": 1e6,
			"maxTokens": 64e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"forceAdaptiveThinking": true
			},
			"thinkingLevelMap": { "max": "max" }
		},
		"claude-sonnet-5": {
			"id": "claude-sonnet-5",
			"name": "Claude Sonnet 5",
			"api": "anthropic-messages",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/anthropic",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2,
				"output": 10,
				"cacheRead": .2,
				"cacheWrite": 2.5
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"forceAdaptiveThinking": true
			},
			"thinkingLevelMap": {
				"xhigh": "xhigh",
				"max": "max"
			}
		}
	},
	"openai-completions": {
		"workers-ai/@cf/moonshotai/kimi-k2.5": {
			"id": "workers-ai/@cf/moonshotai/kimi-k2.5",
			"name": "Kimi K2.5",
			"api": "openai-completions",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/compat",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .6,
				"output": 3,
				"cacheRead": .1,
				"cacheWrite": 0
			},
			"contextWindow": 256e3,
			"maxTokens": 256e3,
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false,
				"maxTokensField": "max_tokens",
				"supportsStrictMode": false,
				"supportsLongCacheRetention": false,
				"sendSessionAffinityHeaders": true
			}
		},
		"workers-ai/@cf/moonshotai/kimi-k2.6": {
			"id": "workers-ai/@cf/moonshotai/kimi-k2.6",
			"name": "Kimi K2.6",
			"api": "openai-completions",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/compat",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .95,
				"output": 4,
				"cacheRead": .16,
				"cacheWrite": 0
			},
			"contextWindow": 256e3,
			"maxTokens": 256e3,
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false,
				"maxTokensField": "max_tokens",
				"supportsStrictMode": false,
				"supportsLongCacheRetention": false,
				"sendSessionAffinityHeaders": true
			}
		},
		"workers-ai/@cf/nvidia/nemotron-3-120b-a12b": {
			"id": "workers-ai/@cf/nvidia/nemotron-3-120b-a12b",
			"name": "Nemotron 3 Super 120B",
			"api": "openai-completions",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/compat",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .5,
				"output": 1.5,
				"cacheRead": 0,
				"cacheWrite": 0
			},
			"contextWindow": 256e3,
			"maxTokens": 256e3,
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false,
				"maxTokensField": "max_tokens",
				"supportsStrictMode": false,
				"supportsLongCacheRetention": false,
				"sendSessionAffinityHeaders": true
			}
		},
		"workers-ai/@cf/zai-org/glm-4.7-flash": {
			"id": "workers-ai/@cf/zai-org/glm-4.7-flash",
			"name": "GLM-4.7-Flash",
			"api": "openai-completions",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/compat",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .06,
				"output": .4,
				"cacheRead": 0,
				"cacheWrite": 0
			},
			"contextWindow": 131072,
			"maxTokens": 131072,
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false,
				"maxTokensField": "max_tokens",
				"supportsStrictMode": false,
				"supportsLongCacheRetention": false,
				"sendSessionAffinityHeaders": true
			}
		},
		"workers-ai/@cf/zai-org/glm-5.2": {
			"id": "workers-ai/@cf/zai-org/glm-5.2",
			"name": "Glm 5.2",
			"api": "openai-completions",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/compat",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 1.4,
				"output": 4.4,
				"cacheRead": .26,
				"cacheWrite": 0
			},
			"contextWindow": 262144,
			"maxTokens": 262144,
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false,
				"maxTokensField": "max_tokens",
				"supportsStrictMode": false,
				"supportsLongCacheRetention": false,
				"sendSessionAffinityHeaders": true
			}
		}
	},
	"openai-responses": {
		"gpt-4": {
			"id": "gpt-4",
			"name": "GPT-4",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": false,
			"input": ["text"],
			"cost": {
				"input": 30,
				"output": 60,
				"cacheRead": 0,
				"cacheWrite": 0
			},
			"contextWindow": 8192,
			"maxTokens": 8192
		},
		"gpt-4-turbo": {
			"id": "gpt-4-turbo",
			"name": "GPT-4 Turbo",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": false,
			"input": ["text", "image"],
			"cost": {
				"input": 10,
				"output": 30,
				"cacheRead": 0,
				"cacheWrite": 0
			},
			"contextWindow": 128e3,
			"maxTokens": 4096
		},
		"gpt-4o": {
			"id": "gpt-4o",
			"name": "GPT-4o",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": false,
			"input": ["text", "image"],
			"cost": {
				"input": 2.5,
				"output": 10,
				"cacheRead": 1.25,
				"cacheWrite": 0
			},
			"contextWindow": 128e3,
			"maxTokens": 16384
		},
		"gpt-4o-mini": {
			"id": "gpt-4o-mini",
			"name": "GPT-4o mini",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": false,
			"input": ["text", "image"],
			"cost": {
				"input": .15,
				"output": .6,
				"cacheRead": .08,
				"cacheWrite": 0
			},
			"contextWindow": 128e3,
			"maxTokens": 16384
		},
		"gpt-5.1": {
			"id": "gpt-5.1",
			"name": "GPT-5.1",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.25,
				"output": 10,
				"cacheRead": .13,
				"cacheWrite": 0
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.1-codex": {
			"id": "gpt-5.1-codex",
			"name": "GPT-5.1 Codex",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.25,
				"output": 10,
				"cacheRead": .125,
				"cacheWrite": 0
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.2": {
			"id": "gpt-5.2",
			"name": "GPT-5.2",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.75,
				"output": 14,
				"cacheRead": .175,
				"cacheWrite": 0
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.2-codex": {
			"id": "gpt-5.2-codex",
			"name": "GPT-5.2 Codex",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.75,
				"output": 14,
				"cacheRead": .175,
				"cacheWrite": 0
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.3-codex": {
			"id": "gpt-5.3-codex",
			"name": "GPT-5.3 Codex",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.75,
				"output": 14,
				"cacheRead": .175,
				"cacheWrite": 0
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.4": {
			"id": "gpt-5.4",
			"name": "GPT-5.4",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2.5,
				"output": 15,
				"cacheRead": .25,
				"cacheWrite": 0
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.5": {
			"id": "gpt-5.5",
			"name": "GPT-5.5",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 30,
				"cacheRead": .5,
				"cacheWrite": 0
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.6-luna": {
			"id": "gpt-5.6-luna",
			"name": "GPT-5.6 Luna",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1,
				"output": 6,
				"cacheRead": .1,
				"cacheWrite": 0
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": "max"
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.6-sol": {
			"id": "gpt-5.6-sol",
			"name": "GPT-5.6 Sol",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 30,
				"cacheRead": .5,
				"cacheWrite": 0
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": "max"
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.6-terra": {
			"id": "gpt-5.6-terra",
			"name": "GPT-5.6 Terra",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2.5,
				"output": 15,
				"cacheRead": .25,
				"cacheWrite": 0
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": "max"
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"o1": {
			"id": "o1",
			"name": "o1",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 15,
				"output": 60,
				"cacheRead": 7.5,
				"cacheWrite": 0
			},
			"contextWindow": 2e5,
			"maxTokens": 1e5,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		},
		"o3": {
			"id": "o3",
			"name": "o3",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2,
				"output": 8,
				"cacheRead": .5,
				"cacheWrite": 0
			},
			"contextWindow": 2e5,
			"maxTokens": 1e5,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		},
		"o3-mini": {
			"id": "o3-mini",
			"name": "o3-mini",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 1.1,
				"output": 4.4,
				"cacheRead": .55,
				"cacheWrite": 0
			},
			"contextWindow": 2e5,
			"maxTokens": 1e5,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		},
		"o3-pro": {
			"id": "o3-pro",
			"name": "o3-pro",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 20,
				"output": 80,
				"cacheRead": 0,
				"cacheWrite": 0
			},
			"contextWindow": 2e5,
			"maxTokens": 1e5,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		},
		"o4-mini": {
			"id": "o4-mini",
			"name": "o4-mini",
			"api": "openai-responses",
			"provider": "cloudflare-ai-gateway",
			"baseUrl": "https://gateway.ai.cloudflare.com/v1/{CLOUDFLARE_ACCOUNT_ID}/{CLOUDFLARE_GATEWAY_ID}/openai",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.1,
				"output": 4.4,
				"cacheRead": .28,
				"cacheWrite": 0
			},
			"contextWindow": 2e5,
			"maxTokens": 1e5,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		}
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/cloudflare-workers-ai.models.js
const CLOUDFLARE_WORKERS_AI_MODELS = flattenModelCatalog("cloudflare-workers-ai", { "openai-completions": {
	"@cf/google/gemma-4-26b-a4b-it": {
		"id": "@cf/google/gemma-4-26b-a4b-it",
		"name": "Gemma 4 26B A4B IT",
		"api": "openai-completions",
		"provider": "cloudflare-workers-ai",
		"baseUrl": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 16384,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsLongCacheRetention": false,
			"sendSessionAffinityHeaders": true
		},
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"@cf/ibm-granite/granite-4.0-h-micro": {
		"id": "@cf/ibm-granite/granite-4.0-h-micro",
		"name": "Granite 4.0 H Micro",
		"api": "openai-completions",
		"provider": "cloudflare-workers-ai",
		"baseUrl": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .017,
			"output": .112,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131e3,
		"maxTokens": 131e3,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsLongCacheRetention": false,
			"sendSessionAffinityHeaders": true
		}
	},
	"@cf/meta/llama-3.3-70b-instruct-fp8-fast": {
		"id": "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
		"name": "Llama 3.3 70B Instruct fp8 Fast",
		"api": "openai-completions",
		"provider": "cloudflare-workers-ai",
		"baseUrl": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .293,
			"output": 2.253,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 24e3,
		"maxTokens": 24e3,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsLongCacheRetention": false,
			"sendSessionAffinityHeaders": true
		}
	},
	"@cf/meta/llama-4-scout-17b-16e-instruct": {
		"id": "@cf/meta/llama-4-scout-17b-16e-instruct",
		"name": "Llama 4 Scout 17B 16E Instruct",
		"api": "openai-completions",
		"provider": "cloudflare-workers-ai",
		"baseUrl": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .27,
			"output": .85,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131e3,
		"maxTokens": 16384,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsLongCacheRetention": false,
			"sendSessionAffinityHeaders": true
		}
	},
	"@cf/mistralai/mistral-small-3.1-24b-instruct": {
		"id": "@cf/mistralai/mistral-small-3.1-24b-instruct",
		"name": "Mistral Small 3.1 24B Instruct",
		"api": "openai-completions",
		"provider": "cloudflare-workers-ai",
		"baseUrl": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .351,
			"output": .555,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsLongCacheRetention": false,
			"sendSessionAffinityHeaders": true
		}
	},
	"@cf/moonshotai/kimi-k2.6": {
		"id": "@cf/moonshotai/kimi-k2.6",
		"name": "Kimi K2.6",
		"api": "openai-completions",
		"provider": "cloudflare-workers-ai",
		"baseUrl": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .95,
			"output": 4,
			"cacheRead": .16,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 256e3,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsLongCacheRetention": false,
			"sendSessionAffinityHeaders": true
		},
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"@cf/moonshotai/kimi-k2.7-code": {
		"id": "@cf/moonshotai/kimi-k2.7-code",
		"name": "Kimi K2.7 Code",
		"api": "openai-completions",
		"provider": "cloudflare-workers-ai",
		"baseUrl": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .95,
			"output": 4,
			"cacheRead": .19,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsLongCacheRetention": false,
			"sendSessionAffinityHeaders": true
		},
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"@cf/nvidia/nemotron-3-120b-a12b": {
		"id": "@cf/nvidia/nemotron-3-120b-a12b",
		"name": "Nemotron 3 Super 120B",
		"api": "openai-completions",
		"provider": "cloudflare-workers-ai",
		"baseUrl": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .5,
			"output": 1.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsLongCacheRetention": false,
			"sendSessionAffinityHeaders": true
		},
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"@cf/openai/gpt-oss-120b": {
		"id": "@cf/openai/gpt-oss-120b",
		"name": "GPT OSS 120B",
		"api": "openai-completions",
		"provider": "cloudflare-workers-ai",
		"baseUrl": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .35,
			"output": .75,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsLongCacheRetention": false,
			"sendSessionAffinityHeaders": true
		},
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"@cf/openai/gpt-oss-20b": {
		"id": "@cf/openai/gpt-oss-20b",
		"name": "GPT OSS 20B",
		"api": "openai-completions",
		"provider": "cloudflare-workers-ai",
		"baseUrl": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .2,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsLongCacheRetention": false,
			"sendSessionAffinityHeaders": true
		}
	},
	"@cf/qwen/qwen3-30b-a3b-fp8": {
		"id": "@cf/qwen/qwen3-30b-a3b-fp8",
		"name": "Qwen3 30B A3b fp8",
		"api": "openai-completions",
		"provider": "cloudflare-workers-ai",
		"baseUrl": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .0509,
			"output": .335,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 32768,
		"maxTokens": 32768,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsLongCacheRetention": false,
			"sendSessionAffinityHeaders": true
		}
	},
	"@cf/zai-org/glm-4.7-flash": {
		"id": "@cf/zai-org/glm-4.7-flash",
		"name": "GLM-4.7-Flash",
		"api": "openai-completions",
		"provider": "cloudflare-workers-ai",
		"baseUrl": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .0605,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsLongCacheRetention": false,
			"sendSessionAffinityHeaders": true
		},
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"@cf/zai-org/glm-5.2": {
		"id": "@cf/zai-org/glm-5.2",
		"name": "Glm 5.2",
		"api": "openai-completions",
		"provider": "cloudflare-workers-ai",
		"baseUrl": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.4,
			"output": 4.4,
			"cacheRead": .26,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsLongCacheRetention": false,
			"sendSessionAffinityHeaders": true
		},
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/deepseek.models.js
const DEEPSEEK_MODELS = flattenModelCatalog("deepseek", { "openai-completions": {
	"deepseek-v4-flash": {
		"id": "deepseek-v4-flash",
		"name": "DeepSeek V4 Flash",
		"api": "openai-completions",
		"baseUrl": "https://api.deepseek.com",
		"provider": "deepseek",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .14,
			"output": .28,
			"cacheRead": .0028,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 384e3,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null,
			"high": "high",
			"max": "max"
		}
	},
	"deepseek-v4-pro": {
		"id": "deepseek-v4-pro",
		"name": "DeepSeek V4 Pro",
		"api": "openai-completions",
		"baseUrl": "https://api.deepseek.com",
		"provider": "deepseek",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .435,
			"output": .87,
			"cacheRead": .003625,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 384e3,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null,
			"high": "high",
			"max": "max"
		}
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/fireworks.models.js
const FIREWORKS_MODELS = flattenModelCatalog("fireworks", {
	"anthropic-messages": {
		"accounts/fireworks/models/deepseek-v4-flash": {
			"id": "accounts/fireworks/models/deepseek-v4-flash",
			"name": "DeepSeek V4 Flash",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .14,
				"output": .28,
				"cacheRead": .028,
				"cacheWrite": 0
			},
			"contextWindow": 1e6,
			"maxTokens": 384e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		},
		"accounts/fireworks/models/deepseek-v4-pro": {
			"id": "accounts/fireworks/models/deepseek-v4-pro",
			"name": "DeepSeek V4 Pro",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 1.74,
				"output": 3.48,
				"cacheRead": .145,
				"cacheWrite": 0
			},
			"contextWindow": 1e6,
			"maxTokens": 384e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		},
		"accounts/fireworks/models/glm-5p1": {
			"id": "accounts/fireworks/models/glm-5p1",
			"name": "GLM 5.1",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 1.4,
				"output": 4.4,
				"cacheRead": .26,
				"cacheWrite": 0
			},
			"contextWindow": 202800,
			"maxTokens": 131072,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		},
		"accounts/fireworks/models/gpt-oss-120b": {
			"id": "accounts/fireworks/models/gpt-oss-120b",
			"name": "GPT OSS 120B",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .15,
				"output": .6,
				"cacheRead": .015,
				"cacheWrite": 0
			},
			"contextWindow": 131072,
			"maxTokens": 32768,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		},
		"accounts/fireworks/models/gpt-oss-20b": {
			"id": "accounts/fireworks/models/gpt-oss-20b",
			"name": "GPT OSS 20B",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .07,
				"output": .3,
				"cacheRead": .035,
				"cacheWrite": 0
			},
			"contextWindow": 131072,
			"maxTokens": 32768,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		},
		"accounts/fireworks/models/kimi-k2p6": {
			"id": "accounts/fireworks/models/kimi-k2p6",
			"name": "Kimi K2.6",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .95,
				"output": 4,
				"cacheRead": .16,
				"cacheWrite": 0
			},
			"contextWindow": 262e3,
			"maxTokens": 262e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		},
		"accounts/fireworks/models/kimi-k2p7-code": {
			"id": "accounts/fireworks/models/kimi-k2p7-code",
			"name": "Kimi K2.7 Code",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .95,
				"output": 4,
				"cacheRead": .19,
				"cacheWrite": 0
			},
			"contextWindow": 262e3,
			"maxTokens": 262e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		},
		"accounts/fireworks/models/minimax-m2p7": {
			"id": "accounts/fireworks/models/minimax-m2p7",
			"name": "MiniMax-M2.7",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .3,
				"output": 1.2,
				"cacheRead": .06,
				"cacheWrite": 0
			},
			"contextWindow": 196608,
			"maxTokens": 196608,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		},
		"accounts/fireworks/models/minimax-m3": {
			"id": "accounts/fireworks/models/minimax-m3",
			"name": "MiniMax-M3",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .3,
				"output": 1.2,
				"cacheRead": .06,
				"cacheWrite": 0
			},
			"contextWindow": 512e3,
			"maxTokens": 512e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		},
		"accounts/fireworks/models/qwen3p7-plus": {
			"id": "accounts/fireworks/models/qwen3p7-plus",
			"name": "Qwen 3.7 Plus",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .4,
				"output": 1.6,
				"cacheRead": .08,
				"cacheWrite": 0
			},
			"contextWindow": 262144,
			"maxTokens": 65536,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		},
		"accounts/fireworks/routers/glm-5p1-fast": {
			"id": "accounts/fireworks/routers/glm-5p1-fast",
			"name": "GLM 5.1 Fast",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 2.8,
				"output": 8.8,
				"cacheRead": .52,
				"cacheWrite": 0
			},
			"contextWindow": 202800,
			"maxTokens": 131072,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		},
		"accounts/fireworks/routers/kimi-k2p6-fast": {
			"id": "accounts/fireworks/routers/kimi-k2p6-fast",
			"name": "Kimi K2.6 Fast",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2,
				"output": 8,
				"cacheRead": .3,
				"cacheWrite": 0
			},
			"contextWindow": 262e3,
			"maxTokens": 262e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		},
		"accounts/fireworks/routers/kimi-k2p6-turbo": {
			"id": "accounts/fireworks/routers/kimi-k2p6-turbo",
			"name": "Kimi K2.6 Turbo",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2,
				"output": 8,
				"cacheRead": .3,
				"cacheWrite": 0
			},
			"contextWindow": 262e3,
			"maxTokens": 262e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		},
		"accounts/fireworks/routers/kimi-k2p7-code-fast": {
			"id": "accounts/fireworks/routers/kimi-k2p7-code-fast",
			"name": "Kimi K2.7 Code Fast",
			"api": "anthropic-messages",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.9,
				"output": 8,
				"cacheRead": .38,
				"cacheWrite": 0
			},
			"contextWindow": 262e3,
			"maxTokens": 262e3,
			"compat": {
				"sendSessionAffinityHeaders": true,
				"supportsEagerToolInputStreaming": false,
				"supportsCacheControlOnTools": false,
				"supportsLongCacheRetention": false
			}
		}
	},
	"openai-completions": {
		"accounts/fireworks/models/glm-5p2": {
			"id": "accounts/fireworks/models/glm-5p2",
			"name": "GLM 5.2",
			"api": "openai-completions",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 1.4,
				"output": 4.4,
				"cacheRead": .14,
				"cacheWrite": 0
			},
			"contextWindow": 1048575,
			"maxTokens": 131072,
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false
			},
			"thinkingLevelMap": {
				"off": "none",
				"minimal": null,
				"low": "high",
				"medium": "high",
				"high": "high",
				"xhigh": null,
				"max": "max"
			}
		},
		"accounts/fireworks/routers/glm-5p2-fast": {
			"id": "accounts/fireworks/routers/glm-5p2-fast",
			"name": "GLM 5.2 Fast",
			"api": "openai-completions",
			"provider": "fireworks",
			"baseUrl": "https://api.fireworks.ai/inference/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 2.1,
				"output": 6.6,
				"cacheRead": .21,
				"cacheWrite": 0
			},
			"contextWindow": 1048575,
			"maxTokens": 131072,
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false
			},
			"thinkingLevelMap": {
				"off": "none",
				"minimal": null,
				"low": "high",
				"medium": "high",
				"high": "high",
				"xhigh": null,
				"max": "max"
			}
		}
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/github-copilot.models.js
const GITHUB_COPILOT_MODELS = flattenModelCatalog("github-copilot", {
	"anthropic-messages": {
		"claude-haiku-4.5": {
			"id": "claude-haiku-4.5",
			"name": "Claude Haiku 4.5 (latest)",
			"api": "anthropic-messages",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1,
				"output": 5,
				"cacheRead": .1,
				"cacheWrite": 1.25
			},
			"contextWindow": 2e5,
			"maxTokens": 64e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"compat": { "supportsEagerToolInputStreaming": false }
		},
		"claude-opus-4.5": {
			"id": "claude-opus-4.5",
			"name": "Claude Opus 4.5 (latest)",
			"api": "anthropic-messages",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 2e5,
			"maxTokens": 32e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			}
		},
		"claude-opus-4.6": {
			"id": "claude-opus-4.6",
			"name": "Claude Opus 4.6",
			"api": "anthropic-messages",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 1e6,
			"maxTokens": 32e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": { "max": "max" },
			"compat": { "forceAdaptiveThinking": true }
		},
		"claude-opus-4.7": {
			"id": "claude-opus-4.7",
			"name": "Claude Opus 4.7",
			"api": "anthropic-messages",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 1e6,
			"maxTokens": 32e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"xhigh": "xhigh",
				"max": "max",
				"minimal": "low"
			},
			"compat": {
				"forceAdaptiveThinking": true,
				"supportsTemperature": false
			}
		},
		"claude-opus-4.8": {
			"id": "claude-opus-4.8",
			"name": "Claude Opus 4.8",
			"api": "anthropic-messages",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 1e6,
			"maxTokens": 64e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"xhigh": "xhigh",
				"max": "max",
				"minimal": "low"
			},
			"compat": {
				"forceAdaptiveThinking": true,
				"supportsTemperature": false
			}
		},
		"claude-opus-5": {
			"id": "claude-opus-5",
			"name": "Claude Opus 5",
			"api": "anthropic-messages",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 1e6,
			"maxTokens": 64e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"xhigh": "xhigh",
				"max": "max"
			},
			"compat": {
				"forceAdaptiveThinking": true,
				"supportsTemperature": false
			}
		},
		"claude-sonnet-4": {
			"id": "claude-sonnet-4",
			"name": "Claude Sonnet 4 (latest)",
			"api": "anthropic-messages",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 3,
				"output": 15,
				"cacheRead": .3,
				"cacheWrite": 3.75
			},
			"contextWindow": 216e3,
			"maxTokens": 16e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"compat": { "supportsEagerToolInputStreaming": false }
		},
		"claude-sonnet-4.5": {
			"id": "claude-sonnet-4.5",
			"name": "Claude Sonnet 4.5 (latest)",
			"api": "anthropic-messages",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 3,
				"output": 15,
				"cacheRead": .3,
				"cacheWrite": 3.75
			},
			"contextWindow": 2e5,
			"maxTokens": 32e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"compat": { "supportsEagerToolInputStreaming": false }
		},
		"claude-sonnet-4.6": {
			"id": "claude-sonnet-4.6",
			"name": "Claude Sonnet 4.6",
			"api": "anthropic-messages",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 3,
				"output": 15,
				"cacheRead": .3,
				"cacheWrite": 3.75
			},
			"contextWindow": 1e6,
			"maxTokens": 32e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"max": "max",
				"minimal": "low"
			},
			"compat": { "forceAdaptiveThinking": true }
		},
		"claude-sonnet-5": {
			"id": "claude-sonnet-5",
			"name": "Claude Sonnet 5",
			"api": "anthropic-messages",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2,
				"output": 10,
				"cacheRead": .2,
				"cacheWrite": 2.5
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"xhigh": "xhigh",
				"max": "max"
			},
			"compat": { "forceAdaptiveThinking": true }
		}
	},
	"openai-completions": {
		"claude-fable-5": {
			"id": "claude-fable-5",
			"name": "Claude Fable 5",
			"api": "openai-completions",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 10,
				"output": 50,
				"cacheRead": 1,
				"cacheWrite": 12.5
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false
			},
			"thinkingLevelMap": {
				"off": null,
				"xhigh": "xhigh",
				"max": "max"
			}
		},
		"gemini-2.5-pro": {
			"id": "gemini-2.5-pro",
			"name": "Gemini 2.5 Pro",
			"api": "openai-completions",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.25,
				"output": 10,
				"cacheRead": .125,
				"cacheWrite": 0
			},
			"contextWindow": 128e3,
			"maxTokens": 64e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false
			}
		},
		"gemini-3-flash-preview": {
			"id": "gemini-3-flash-preview",
			"name": "Gemini 3 Flash Preview",
			"api": "openai-completions",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .5,
				"output": 3,
				"cacheRead": .05,
				"cacheWrite": 0
			},
			"contextWindow": 128e3,
			"maxTokens": 64e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false
			}
		},
		"gemini-3.1-pro-preview": {
			"id": "gemini-3.1-pro-preview",
			"name": "Gemini 3.1 Pro Preview",
			"api": "openai-completions",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2,
				"output": 12,
				"cacheRead": .2,
				"cacheWrite": 0,
				"tiers": [{
					"inputTokensAbove": 2e5,
					"input": 4,
					"output": 18,
					"cacheRead": .4,
					"cacheWrite": 0
				}]
			},
			"contextWindow": 1e6,
			"maxTokens": 64e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false
			}
		},
		"gemini-3.5-flash": {
			"id": "gemini-3.5-flash",
			"name": "Gemini 3.5 Flash",
			"api": "openai-completions",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.5,
				"output": 9,
				"cacheRead": .15,
				"cacheWrite": 0
			},
			"contextWindow": 2e5,
			"maxTokens": 64e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false
			}
		},
		"gpt-4.1": {
			"id": "gpt-4.1",
			"name": "GPT-4.1",
			"api": "openai-completions",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": false,
			"input": ["text", "image"],
			"cost": {
				"input": 2,
				"output": 8,
				"cacheRead": .5,
				"cacheWrite": 0
			},
			"contextWindow": 128e3,
			"maxTokens": 16384,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false
			}
		},
		"kimi-k2.7-code": {
			"id": "kimi-k2.7-code",
			"name": "Kimi K2.7 Code",
			"api": "openai-completions",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .95,
				"output": 4,
				"cacheRead": .19,
				"cacheWrite": 0
			},
			"contextWindow": 256e3,
			"maxTokens": 32e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false
			}
		}
	},
	"openai-responses": {
		"gpt-5-mini": {
			"id": "gpt-5-mini",
			"name": "GPT-5 Mini",
			"api": "openai-responses",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .25,
				"output": 2,
				"cacheRead": .025,
				"cacheWrite": 0
			},
			"contextWindow": 264e3,
			"maxTokens": 64e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"off": null,
				"minimal": "low",
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.2": {
			"id": "gpt-5.2",
			"name": "GPT-5.2",
			"api": "openai-responses",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.75,
				"output": 14,
				"cacheRead": .175,
				"cacheWrite": 0
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"off": null,
				"minimal": "low",
				"xhigh": "xhigh"
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.2-codex": {
			"id": "gpt-5.2-codex",
			"name": "GPT-5.2 Codex",
			"api": "openai-responses",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.75,
				"output": 14,
				"cacheRead": .175,
				"cacheWrite": 0
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"off": null,
				"minimal": "low",
				"xhigh": "xhigh"
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.3-codex": {
			"id": "gpt-5.3-codex",
			"name": "GPT-5.3 Codex",
			"api": "openai-responses",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.75,
				"output": 14,
				"cacheRead": .175,
				"cacheWrite": 0
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"off": null,
				"minimal": "low",
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.4": {
			"id": "gpt-5.4",
			"name": "GPT-5.4",
			"api": "openai-responses",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2.5,
				"output": 15,
				"cacheRead": .25,
				"cacheWrite": 0,
				"tiers": [{
					"inputTokensAbove": 272e3,
					"input": 5,
					"output": 22.5,
					"cacheRead": .5,
					"cacheWrite": 0
				}]
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"off": null,
				"minimal": "low",
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.4-mini": {
			"id": "gpt-5.4-mini",
			"name": "GPT-5.4 mini",
			"api": "openai-responses",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .75,
				"output": 4.5,
				"cacheRead": .075,
				"cacheWrite": 0
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"off": null,
				"minimal": "low",
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.4-nano": {
			"id": "gpt-5.4-nano",
			"name": "GPT-5.4 nano",
			"api": "openai-responses",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .2,
				"output": 1.25,
				"cacheRead": .02,
				"cacheWrite": 0
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"off": null,
				"minimal": "low",
				"xhigh": "xhigh"
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.5": {
			"id": "gpt-5.5",
			"name": "GPT-5.5",
			"api": "openai-responses",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 30,
				"cacheRead": .5,
				"cacheWrite": 0,
				"tiers": [{
					"inputTokensAbove": 272e3,
					"input": 10,
					"output": 45,
					"cacheRead": 1,
					"cacheWrite": 0
				}]
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"off": null,
				"minimal": "low",
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.6-luna": {
			"id": "gpt-5.6-luna",
			"name": "GPT-5.6 Luna",
			"api": "openai-responses",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1,
				"output": 6,
				"cacheRead": .1,
				"cacheWrite": 1.25,
				"tiers": [{
					"inputTokensAbove": 2e5,
					"input": 2,
					"output": 9,
					"cacheRead": .2,
					"cacheWrite": 2.5
				}]
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"off": null,
				"minimal": "low",
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": "max"
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.6-sol": {
			"id": "gpt-5.6-sol",
			"name": "GPT-5.6 Sol",
			"api": "openai-responses",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 30,
				"cacheRead": .5,
				"cacheWrite": 6.25,
				"tiers": [{
					"inputTokensAbove": 272e3,
					"input": 10,
					"output": 45,
					"cacheRead": 1,
					"cacheWrite": 12.5
				}]
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"off": null,
				"minimal": "low",
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": "max"
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"gpt-5.6-terra": {
			"id": "gpt-5.6-terra",
			"name": "GPT-5.6 Terra",
			"api": "openai-responses",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2.5,
				"output": 15,
				"cacheRead": .25,
				"cacheWrite": 3.125,
				"tiers": [{
					"inputTokensAbove": 272e3,
					"input": 5,
					"output": 22.5,
					"cacheRead": .5,
					"cacheWrite": 6.25
				}]
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"off": null,
				"minimal": "low",
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": "max"
			},
			"compat": { "supportsOpenAIGrammarTools": true }
		},
		"mai-code-1-flash-picker": {
			"id": "mai-code-1-flash-picker",
			"name": "MAI-Code-1-Flash",
			"api": "openai-responses",
			"provider": "github-copilot",
			"baseUrl": "https://api.individual.githubcopilot.com",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .75,
				"output": 4.5,
				"cacheRead": .075,
				"cacheWrite": 0
			},
			"contextWindow": 256e3,
			"maxTokens": 128e3,
			"headers": {
				"User-Agent": "GitHubCopilotChat/0.35.0",
				"Editor-Version": "vscode/1.107.0",
				"Editor-Plugin-Version": "copilot-chat/0.35.0",
				"Copilot-Integration-Id": "vscode-chat"
			},
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		}
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/google.models.js
const GOOGLE_MODELS = flattenModelCatalog("google", { "google-generative-ai": {
	"deep-research-max-preview-04-2026": {
		"id": "deep-research-max-preview-04-2026",
		"name": "Deep Research Max Preview (Apr-21-2026)",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 12,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536
	},
	"deep-research-preview-04-2026": {
		"id": "deep-research-preview-04-2026",
		"name": "Deep Research Preview (Apr-21-2026)",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 12,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536
	},
	"gemini-2.0-flash": {
		"id": "gemini-2.0-flash",
		"name": "Gemini 2.0 Flash",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .4,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 8192
	},
	"gemini-2.0-flash-lite": {
		"id": "gemini-2.0-flash-lite",
		"name": "Gemini 2.0 Flash-Lite",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .075,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 8192
	},
	"gemini-2.5-computer-use-preview-10-2025": {
		"id": "gemini-2.5-computer-use-preview-10-2025",
		"name": "Gemini 2.5 Computer Use Preview 10-2025",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536
	},
	"gemini-2.5-flash": {
		"id": "gemini-2.5-flash",
		"name": "Gemini 2.5 Flash",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 2.5,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536
	},
	"gemini-2.5-flash-lite": {
		"id": "gemini-2.5-flash-lite",
		"name": "Gemini 2.5 Flash-Lite",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .4,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536
	},
	"gemini-2.5-pro": {
		"id": "gemini-2.5-pro",
		"name": "Gemini 2.5 Pro",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536
	},
	"gemini-3-flash-preview": {
		"id": "gemini-3-flash-preview",
		"name": "Gemini 3 Flash Preview",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .5,
			"output": 3,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-3-pro-preview": {
		"id": "gemini-3-pro-preview",
		"name": "Gemini 3 Pro Preview",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 12,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "LOW",
			"medium": null,
			"high": "HIGH"
		}
	},
	"gemini-3.1-flash-lite": {
		"id": "gemini-3.1-flash-lite",
		"name": "Gemini 3.1 Flash Lite",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 1.5,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-3.1-flash-lite-image": {
		"id": "gemini-3.1-flash-lite-image",
		"name": "Nano Banana 2 Lite",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 30,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 65536,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-3.1-flash-lite-preview": {
		"id": "gemini-3.1-flash-lite-preview",
		"name": "Gemini 3.1 Flash Lite Preview",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 1.5,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-3.1-flash-live-preview": {
		"id": "gemini-3.1-flash-live-preview",
		"name": "Gemini 3.1 Flash Live Preview",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .75,
			"output": 4.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-3.1-pro-preview": {
		"id": "gemini-3.1-pro-preview",
		"name": "Gemini 3.1 Pro Preview",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 12,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "LOW",
			"medium": null,
			"high": "HIGH"
		}
	},
	"gemini-3.1-pro-preview-customtools": {
		"id": "gemini-3.1-pro-preview-customtools",
		"name": "Gemini 3.1 Pro Preview Custom Tools",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 12,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "LOW",
			"medium": null,
			"high": "HIGH"
		}
	},
	"gemini-3.5-flash": {
		"id": "gemini-3.5-flash",
		"name": "Gemini 3.5 Flash",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 9,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-3.5-flash-lite": {
		"id": "gemini-3.5-flash-lite",
		"name": "Gemini 3.5 Flash Lite",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 2.5,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-3.6-flash": {
		"id": "gemini-3.6-flash",
		"name": "Gemini 3.6 Flash",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 7.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-flash-latest": {
		"id": "gemini-flash-latest",
		"name": "Gemini Flash Latest",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 9,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-flash-lite-latest": {
		"id": "gemini-flash-lite-latest",
		"name": "Gemini Flash-Lite Latest",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 1.5,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-robotics-er-1.6-preview": {
		"id": "gemini-robotics-er-1.6-preview",
		"name": "Gemini Robotics-ER 1.6 Preview",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536
	},
	"gemma-4-26b-a4b-it": {
		"id": "gemma-4-26b-a4b-it",
		"name": "Gemma 4 26B A4B IT",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"thinkingLevelMap": {
			"off": null,
			"minimal": "MINIMAL",
			"low": null,
			"medium": null,
			"high": "HIGH"
		}
	},
	"gemma-4-31b-it": {
		"id": "gemma-4-31b-it",
		"name": "Gemma 4 31B IT",
		"api": "google-generative-ai",
		"provider": "google",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"thinkingLevelMap": {
			"off": null,
			"minimal": "MINIMAL",
			"low": null,
			"medium": null,
			"high": "HIGH"
		}
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/google-vertex.models.js
const GOOGLE_VERTEX_MODELS = flattenModelCatalog("google-vertex", { "google-vertex": {
	"gemini-2.5-flash": {
		"id": "gemini-2.5-flash",
		"name": "Gemini 2.5 Flash",
		"api": "google-vertex",
		"provider": "google-vertex",
		"baseUrl": "https://{location}-aiplatform.googleapis.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 2.5,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536
	},
	"gemini-2.5-flash-lite": {
		"id": "gemini-2.5-flash-lite",
		"name": "Gemini 2.5 Flash-Lite",
		"api": "google-vertex",
		"provider": "google-vertex",
		"baseUrl": "https://{location}-aiplatform.googleapis.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .4,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536
	},
	"gemini-2.5-pro": {
		"id": "gemini-2.5-pro",
		"name": "Gemini 2.5 Pro",
		"api": "google-vertex",
		"provider": "google-vertex",
		"baseUrl": "https://{location}-aiplatform.googleapis.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536
	},
	"gemini-3-flash-preview": {
		"id": "gemini-3-flash-preview",
		"name": "Gemini 3 Flash Preview",
		"api": "google-vertex",
		"provider": "google-vertex",
		"baseUrl": "https://{location}-aiplatform.googleapis.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .5,
			"output": 3,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-3.1-flash-lite": {
		"id": "gemini-3.1-flash-lite",
		"name": "Gemini 3.1 Flash Lite",
		"api": "google-vertex",
		"provider": "google-vertex",
		"baseUrl": "https://{location}-aiplatform.googleapis.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 1.5,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-3.1-pro-preview": {
		"id": "gemini-3.1-pro-preview",
		"name": "Gemini 3.1 Pro Preview",
		"api": "google-vertex",
		"provider": "google-vertex",
		"baseUrl": "https://{location}-aiplatform.googleapis.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 12,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "LOW",
			"medium": null,
			"high": "HIGH"
		}
	},
	"gemini-3.1-pro-preview-customtools": {
		"id": "gemini-3.1-pro-preview-customtools",
		"name": "Gemini 3.1 Pro Preview Custom Tools",
		"api": "google-vertex",
		"provider": "google-vertex",
		"baseUrl": "https://{location}-aiplatform.googleapis.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 12,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "LOW",
			"medium": null,
			"high": "HIGH"
		}
	},
	"gemini-3.5-flash": {
		"id": "gemini-3.5-flash",
		"name": "Gemini 3.5 Flash",
		"api": "google-vertex",
		"provider": "google-vertex",
		"baseUrl": "https://{location}-aiplatform.googleapis.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 9,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-3.5-flash-lite": {
		"id": "gemini-3.5-flash-lite",
		"name": "Gemini 3.5 Flash Lite",
		"api": "google-vertex",
		"provider": "google-vertex",
		"baseUrl": "https://{location}-aiplatform.googleapis.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 2.5,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-3.6-flash": {
		"id": "gemini-3.6-flash",
		"name": "Gemini 3.6 Flash",
		"api": "google-vertex",
		"provider": "google-vertex",
		"baseUrl": "https://{location}-aiplatform.googleapis.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 7.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-flash-latest": {
		"id": "gemini-flash-latest",
		"name": "Gemini Flash Latest",
		"api": "google-vertex",
		"provider": "google-vertex",
		"baseUrl": "https://{location}-aiplatform.googleapis.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 9,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	},
	"gemini-flash-lite-latest": {
		"id": "gemini-flash-lite-latest",
		"name": "Gemini Flash-Lite Latest",
		"api": "google-vertex",
		"provider": "google-vertex",
		"baseUrl": "https://{location}-aiplatform.googleapis.com",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 1.5,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"thinkingLevelMap": { "off": null }
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/groq.models.js
const GROQ_MODELS = flattenModelCatalog("groq", { "openai-completions": {
	"llama-3.1-8b-instant": {
		"id": "llama-3.1-8b-instant",
		"name": "Llama 3.1 8B",
		"api": "openai-completions",
		"provider": "groq",
		"baseUrl": "https://api.groq.com/openai/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .05,
			"output": .08,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072
	},
	"llama-3.3-70b-versatile": {
		"id": "llama-3.3-70b-versatile",
		"name": "Llama 3.3 70B",
		"api": "openai-completions",
		"provider": "groq",
		"baseUrl": "https://api.groq.com/openai/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .59,
			"output": .79,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768
	},
	"meta-llama/llama-4-scout-17b-16e-instruct": {
		"id": "meta-llama/llama-4-scout-17b-16e-instruct",
		"name": "Llama 4 Scout 17B 16E",
		"api": "openai-completions",
		"provider": "groq",
		"baseUrl": "https://api.groq.com/openai/v1",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .11,
			"output": .34,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 8192
	},
	"openai/gpt-oss-120b": {
		"id": "openai/gpt-oss-120b",
		"name": "GPT OSS 120B",
		"api": "openai-completions",
		"provider": "groq",
		"baseUrl": "https://api.groq.com/openai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": .075,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"openai/gpt-oss-20b": {
		"id": "openai/gpt-oss-20b",
		"name": "GPT OSS 20B",
		"api": "openai-completions",
		"provider": "groq",
		"baseUrl": "https://api.groq.com/openai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .075,
			"output": .3,
			"cacheRead": .0375,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"openai/gpt-oss-safeguard-20b": {
		"id": "openai/gpt-oss-safeguard-20b",
		"name": "Safety GPT OSS 20B",
		"api": "openai-completions",
		"provider": "groq",
		"baseUrl": "https://api.groq.com/openai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .075,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"qwen/qwen3-32b": {
		"id": "qwen/qwen3-32b",
		"name": "Qwen3-32B",
		"api": "openai-completions",
		"provider": "groq",
		"baseUrl": "https://api.groq.com/openai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .29,
			"output": .59,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 40960,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": null,
			"medium": null,
			"high": "default",
			"xhigh": null,
			"max": null
		}
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/huggingface.models.js
const HUGGINGFACE_MODELS = flattenModelCatalog("huggingface", { "openai-completions": {
	"MiniMaxAI/MiniMax-M2": {
		"id": "MiniMaxAI/MiniMax-M2",
		"name": "MiniMax-M2",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 204800,
		"maxTokens": 128e3
	},
	"MiniMaxAI/MiniMax-M2.1": {
		"id": "MiniMaxAI/MiniMax-M2.1",
		"name": "MiniMax-M2.1",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"MiniMaxAI/MiniMax-M2.5": {
		"id": "MiniMaxAI/MiniMax-M2.5",
		"name": "MiniMax-M2.5",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"MiniMaxAI/MiniMax-M2.7": {
		"id": "MiniMaxAI/MiniMax-M2.7",
		"name": "MiniMax-M2.7",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .06,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"MiniMaxAI/MiniMax-M3": {
		"id": "MiniMaxAI/MiniMax-M3",
		"name": "MiniMax-M3",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 524288,
		"maxTokens": 128e3
	},
	"Qwen/Qwen3-235B-A22B": {
		"id": "Qwen/Qwen3-235B-A22B",
		"name": "Qwen3 235B-A22B",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .2,
			"output": .8,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 40960,
		"maxTokens": 16384
	},
	"Qwen/Qwen3-235B-A22B-Thinking-2507": {
		"id": "Qwen/Qwen3-235B-A22B-Thinking-2507",
		"name": "Qwen3-235B-A22B-Thinking-2507",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 131072
	},
	"Qwen/Qwen3-32B": {
		"id": "Qwen/Qwen3-32B",
		"name": "Qwen3 32B",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .29,
			"output": .59,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 131072,
		"maxTokens": 16384
	},
	"Qwen/Qwen3-Coder-30B-A3B-Instruct": {
		"id": "Qwen/Qwen3-Coder-30B-A3B-Instruct",
		"name": "Qwen3-Coder 30B-A3B Instruct",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .07,
			"output": .26,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 65536
	},
	"Qwen/Qwen3-Coder-480B-A35B-Instruct": {
		"id": "Qwen/Qwen3-Coder-480B-A35B-Instruct",
		"name": "Qwen3-Coder-480B-A35B-Instruct",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 2,
			"output": 2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 66536
	},
	"Qwen/Qwen3-Coder-Next": {
		"id": "Qwen/Qwen3-Coder-Next",
		"name": "Qwen3-Coder-Next",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .2,
			"output": 1.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 65536
	},
	"Qwen/Qwen3-Next-80B-A3B-Instruct": {
		"id": "Qwen/Qwen3-Next-80B-A3B-Instruct",
		"name": "Qwen3-Next-80B-A3B-Instruct",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .25,
			"output": 1,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 66536
	},
	"Qwen/Qwen3-Next-80B-A3B-Thinking": {
		"id": "Qwen/Qwen3-Next-80B-A3B-Thinking",
		"name": "Qwen3-Next-80B-A3B-Thinking",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 131072
	},
	"Qwen/Qwen3.5-122B-A10B": {
		"id": "Qwen/Qwen3.5-122B-A10B",
		"name": "Qwen3.5 122B-A10B",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 3.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 65536
	},
	"Qwen/Qwen3.5-27B": {
		"id": "Qwen/Qwen3.5-27B",
		"name": "Qwen3.5 27B",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 2.4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 65536
	},
	"Qwen/Qwen3.5-35B-A3B": {
		"id": "Qwen/Qwen3.5-35B-A3B",
		"name": "Qwen3.5 35B-A3B",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 65536
	},
	"Qwen/Qwen3.5-397B-A17B": {
		"id": "Qwen/Qwen3.5-397B-A17B",
		"name": "Qwen3.5-397B-A17B",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .6,
			"output": 3.6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 32768,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"Qwen/Qwen3.5-9B": {
		"id": "Qwen/Qwen3.5-9B",
		"name": "Qwen3.5 9B",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .17,
			"output": .25,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 65536
	},
	"Qwen/Qwen3.6-27B": {
		"id": "Qwen/Qwen3.6-27B",
		"name": "Qwen3.6 27B",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .47,
			"output": 3.19,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 65536
	},
	"Qwen/Qwen3.6-35B-A3B": {
		"id": "Qwen/Qwen3.6-35B-A3B",
		"name": "Qwen3.6 35B-A3B",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .95,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 65536
	},
	"XiaomiMiMo/MiMo-V2-Flash": {
		"id": "XiaomiMiMo/MiMo-V2-Flash",
		"name": "MiMo-V2-Flash",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 4096
	},
	"XiaomiMiMo/MiMo-V2.5": {
		"id": "XiaomiMiMo/MiMo-V2.5",
		"name": "MiMo-V2.5",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .4,
			"output": 2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 131072,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": null
		}
	},
	"XiaomiMiMo/MiMo-V2.5-Pro": {
		"id": "XiaomiMiMo/MiMo-V2.5-Pro",
		"name": "MiMo-V2.5-Pro",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1,
			"output": 3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 1048576,
		"maxTokens": 131072,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": null
		}
	},
	"deepseek-ai/DeepSeek-R1": {
		"id": "deepseek-ai/DeepSeek-R1",
		"name": "DeepSeek-R1",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .7,
			"output": 2.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 64e3,
		"maxTokens": 32768
	},
	"deepseek-ai/DeepSeek-R1-0528": {
		"id": "deepseek-ai/DeepSeek-R1-0528",
		"name": "DeepSeek-R1-0528",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 3,
			"output": 5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 163840,
		"maxTokens": 163840
	},
	"deepseek-ai/DeepSeek-V3.2": {
		"id": "deepseek-ai/DeepSeek-V3.2",
		"name": "DeepSeek-V3.2",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .28,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 163840,
		"maxTokens": 65536
	},
	"deepseek-ai/DeepSeek-V4-Flash": {
		"id": "deepseek-ai/DeepSeek-V4-Flash",
		"name": "DeepSeek V4 Flash",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .14,
			"output": .28,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 1048576,
		"maxTokens": 384e3
	},
	"deepseek-ai/DeepSeek-V4-Pro": {
		"id": "deepseek-ai/DeepSeek-V4-Pro",
		"name": "DeepSeek V4 Pro",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .435,
			"output": .87,
			"cacheRead": .003625,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 1048576,
		"maxTokens": 393216,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": null,
			"medium": null,
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"google/gemma-4-26B-A4B-it": {
		"id": "google/gemma-4-26B-A4B-it",
		"name": "Gemma 4 26B A4B IT",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .13,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 32768
	},
	"google/gemma-4-31B-it": {
		"id": "google/gemma-4-31B-it",
		"name": "Gemma 4 31B IT",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .14,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 32768
	},
	"meta-llama/Llama-3.3-70B-Instruct": {
		"id": "meta-llama/Llama-3.3-70B-Instruct",
		"name": "Llama-3.3-70B-Instruct",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .59,
			"output": .79,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 131072,
		"maxTokens": 4096
	},
	"moonshotai/Kimi-K2-Instruct": {
		"id": "moonshotai/Kimi-K2-Instruct",
		"name": "Kimi-K2-Instruct",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 1,
			"output": 3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 131072,
		"maxTokens": 16384
	},
	"moonshotai/Kimi-K2-Instruct-0905": {
		"id": "moonshotai/Kimi-K2-Instruct-0905",
		"name": "Kimi-K2-Instruct-0905",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 1,
			"output": 3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 16384
	},
	"moonshotai/Kimi-K2-Thinking": {
		"id": "moonshotai/Kimi-K2-Thinking",
		"name": "Kimi-K2-Thinking",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"moonshotai/Kimi-K2.5": {
		"id": "moonshotai/Kimi-K2.5",
		"name": "Kimi-K2.5",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .6,
			"output": 3,
			"cacheRead": .1,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"moonshotai/Kimi-K2.6": {
		"id": "moonshotai/Kimi-K2.6",
		"name": "Kimi-K2.6",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .95,
			"output": 4,
			"cacheRead": .16,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"moonshotai/Kimi-K2.7-Code": {
		"id": "moonshotai/Kimi-K2.7-Code",
		"name": "Kimi K2.7 Code",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .95,
			"output": 4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"openai/gpt-oss-120b": {
		"id": "openai/gpt-oss-120b",
		"name": "GPT OSS 120B",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .25,
			"output": .69,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 131072,
		"maxTokens": 32768,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"openai/gpt-oss-20b": {
		"id": "openai/gpt-oss-20b",
		"name": "GPT OSS 20B",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": .5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 131072,
		"maxTokens": 32768,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"stepfun-ai/Step-3.5-Flash": {
		"id": "stepfun-ai/Step-3.5-Flash",
		"name": "Step 3.5 Flash",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 256e3
	},
	"stepfun-ai/Step-3.7-Flash": {
		"id": "stepfun-ai/Step-3.7-Flash",
		"name": "Step 3.7 Flash",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": 1.15,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 256e3,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	},
	"zai-org/GLM-4.5": {
		"id": "zai-org/GLM-4.5",
		"name": "GLM-4.5",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 131072,
		"maxTokens": 98304
	},
	"zai-org/GLM-4.5-Air": {
		"id": "zai-org/GLM-4.5-Air",
		"name": "GLM-4.5-Air",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .13,
			"output": .85,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 131072,
		"maxTokens": 98304
	},
	"zai-org/GLM-4.5V": {
		"id": "zai-org/GLM-4.5V",
		"name": "GLM-4.5V",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .6,
			"output": 1.8,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 65536,
		"maxTokens": 16384
	},
	"zai-org/GLM-4.6": {
		"id": "zai-org/GLM-4.6",
		"name": "GLM-4.6",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .55,
			"output": 2.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"zai-org/GLM-4.7": {
		"id": "zai-org/GLM-4.7",
		"name": "GLM-4.7",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.2,
			"cacheRead": .11,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"zai-org/GLM-4.7-Flash": {
		"id": "zai-org/GLM-4.7-Flash",
		"name": "GLM-4.7-Flash",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 2e5,
		"maxTokens": 128e3
	},
	"zai-org/GLM-5": {
		"id": "zai-org/GLM-5",
		"name": "GLM-5",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1,
			"output": 3.2,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 202752,
		"maxTokens": 131072
	},
	"zai-org/GLM-5.1": {
		"id": "zai-org/GLM-5.1",
		"name": "GLM-5.1",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1,
			"output": 3.2,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 202752,
		"maxTokens": 131072
	},
	"zai-org/GLM-5.2": {
		"id": "zai-org/GLM-5.2",
		"name": "GLM-5.2",
		"api": "openai-completions",
		"provider": "huggingface",
		"baseUrl": "https://router.huggingface.co/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.4,
			"output": 4.4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": { "supportsDeveloperRole": false },
		"contextWindow": 262144,
		"maxTokens": 131072
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/kimi-coding.models.js
const KIMI_CODING_MODELS = flattenModelCatalog("kimi-coding", { "anthropic-messages": {
	"k3": {
		"id": "k3",
		"name": "Kimi K3",
		"api": "anthropic-messages",
		"provider": "kimi-coding",
		"baseUrl": "https://api.kimi.com/coding",
		"headers": { "User-Agent": "KimiCLI/1.5" },
		"compat": {
			"allowEmptySignature": true,
			"forceAdaptiveThinking": true
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": null,
			"high": "high",
			"xhigh": null,
			"max": "max"
		}
	},
	"k3-256k": {
		"id": "k3-256k",
		"name": "Kimi K3-256K",
		"api": "anthropic-messages",
		"provider": "kimi-coding",
		"baseUrl": "https://api.kimi.com/coding",
		"headers": { "User-Agent": "KimiCLI/1.5" },
		"compat": { "forceAdaptiveThinking": true },
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 131072,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": null,
			"high": "high",
			"xhigh": null,
			"max": "max"
		}
	},
	"kimi-for-coding": {
		"id": "kimi-for-coding",
		"name": "Kimi K2.7 Code",
		"api": "anthropic-messages",
		"provider": "kimi-coding",
		"baseUrl": "https://api.kimi.com/coding",
		"headers": { "User-Agent": "KimiCLI/1.5" },
		"compat": {
			"allowEmptySignature": true,
			"forceAdaptiveThinking": true
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .95,
			"output": 4,
			"cacheRead": .19,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768
	},
	"kimi-for-coding-highspeed": {
		"id": "kimi-for-coding-highspeed",
		"name": "Kimi For Coding HighSpeed",
		"api": "anthropic-messages",
		"provider": "kimi-coding",
		"baseUrl": "https://api.kimi.com/coding",
		"headers": { "User-Agent": "KimiCLI/1.5" },
		"compat": { "forceAdaptiveThinking": true },
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.9,
			"output": 8,
			"cacheRead": .38,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/minimax.models.js
const MINIMAX_MODELS = flattenModelCatalog("minimax", { "anthropic-messages": {
	"MiniMax-M2.7": {
		"id": "MiniMax-M2.7",
		"name": "MiniMax-M2.7",
		"api": "anthropic-messages",
		"provider": "minimax",
		"baseUrl": "https://api.minimax.io/anthropic",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .06,
			"cacheWrite": .375
		},
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"MiniMax-M2.7-highspeed": {
		"id": "MiniMax-M2.7-highspeed",
		"name": "MiniMax-M2.7-highspeed",
		"api": "anthropic-messages",
		"provider": "minimax",
		"baseUrl": "https://api.minimax.io/anthropic",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.4,
			"cacheRead": .06,
			"cacheWrite": .375
		},
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"MiniMax-M3": {
		"id": "MiniMax-M3",
		"name": "MiniMax-M3",
		"api": "anthropic-messages",
		"provider": "minimax",
		"baseUrl": "https://api.minimax.io/anthropic",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .06,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/minimax-cn.models.js
const MINIMAX_CN_MODELS = flattenModelCatalog("minimax-cn", { "anthropic-messages": {
	"MiniMax-M2.7": {
		"id": "MiniMax-M2.7",
		"name": "MiniMax-M2.7",
		"api": "anthropic-messages",
		"provider": "minimax-cn",
		"baseUrl": "https://api.minimaxi.com/anthropic",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .06,
			"cacheWrite": .375
		},
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"MiniMax-M2.7-highspeed": {
		"id": "MiniMax-M2.7-highspeed",
		"name": "MiniMax-M2.7-highspeed",
		"api": "anthropic-messages",
		"provider": "minimax-cn",
		"baseUrl": "https://api.minimaxi.com/anthropic",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.4,
			"cacheRead": .06,
			"cacheWrite": .375
		},
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"MiniMax-M3": {
		"id": "MiniMax-M3",
		"name": "MiniMax-M3",
		"api": "anthropic-messages",
		"provider": "minimax-cn",
		"baseUrl": "https://api.minimaxi.com/anthropic",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .06,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/mistral.models.js
const MISTRAL_MODELS = flattenModelCatalog("mistral", { "mistral-conversations": {
	"codestral-latest": {
		"id": "codestral-latest",
		"name": "Codestral (latest)",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": .9,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 4096
	},
	"devstral-2512": {
		"id": "devstral-2512",
		"name": "Devstral 2",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .4,
			"output": 2,
			"cacheRead": .04,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"devstral-latest": {
		"id": "devstral-latest",
		"name": "Devstral 2",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .4,
			"output": 2,
			"cacheRead": .04,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"devstral-medium-2507": {
		"id": "devstral-medium-2507",
		"name": "Devstral Medium",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .4,
			"output": 2,
			"cacheRead": .04,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3
	},
	"devstral-medium-latest": {
		"id": "devstral-medium-latest",
		"name": "Devstral 2 (latest)",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .4,
			"output": 2,
			"cacheRead": .04,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"devstral-small-2505": {
		"id": "devstral-small-2505",
		"name": "Devstral Small 2505",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": .3,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3
	},
	"devstral-small-2507": {
		"id": "devstral-small-2507",
		"name": "Devstral Small",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": .3,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3
	},
	"labs-devstral-small-2512": {
		"id": "labs-devstral-small-2512",
		"name": "Devstral Small 2",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"magistral-medium-latest": {
		"id": "magistral-medium-latest",
		"name": "Magistral Medium (latest)",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 2,
			"output": 5,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384
	},
	"magistral-small": {
		"id": "magistral-small",
		"name": "Magistral Small",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .5,
			"output": 1.5,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3
	},
	"ministral-3b-latest": {
		"id": "ministral-3b-latest",
		"name": "Ministral 3B (latest)",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .04,
			"output": .04,
			"cacheRead": .004,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3
	},
	"ministral-8b-latest": {
		"id": "ministral-8b-latest",
		"name": "Ministral 8B (latest)",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": .1,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3
	},
	"mistral-large-2411": {
		"id": "mistral-large-2411",
		"name": "Mistral Large 2.1",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 2,
			"output": 6,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 16384
	},
	"mistral-large-2512": {
		"id": "mistral-large-2512",
		"name": "Mistral Large 3",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .5,
			"output": 1.5,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"mistral-large-latest": {
		"id": "mistral-large-latest",
		"name": "Mistral Large (latest)",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .5,
			"output": 1.5,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"mistral-medium-2505": {
		"id": "mistral-medium-2505",
		"name": "Mistral Medium 3",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 2,
			"cacheRead": .04,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072
	},
	"mistral-medium-2508": {
		"id": "mistral-medium-2508",
		"name": "Mistral Medium 3.1",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 2,
			"cacheRead": .04,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"mistral-medium-2604": {
		"id": "mistral-medium-2604",
		"name": "Mistral Medium 3.5",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 7.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"mistral-medium-3.5": {
		"id": "mistral-medium-3.5",
		"name": "Mistral Medium 3.5",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 7.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"mistral-medium-latest": {
		"id": "mistral-medium-latest",
		"name": "Mistral Medium (latest)",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 7.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"mistral-nemo": {
		"id": "mistral-nemo",
		"name": "Mistral Nemo",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .15,
			"cacheRead": .015,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3
	},
	"mistral-small-2506": {
		"id": "mistral-small-2506",
		"name": "Mistral Small 3.2",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .3,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384
	},
	"mistral-small-2603": {
		"id": "mistral-small-2603",
		"name": "Mistral Small 4",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": .015,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"mistral-small-latest": {
		"id": "mistral-small-latest",
		"name": "Mistral Small (latest)",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": .015,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"open-mistral-7b": {
		"id": "open-mistral-7b",
		"name": "Mistral 7B",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .25,
			"output": .25,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 8e3,
		"maxTokens": 8e3
	},
	"open-mistral-nemo": {
		"id": "open-mistral-nemo",
		"name": "Open Mistral Nemo",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .15,
			"cacheRead": .015,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3
	},
	"open-mixtral-8x22b": {
		"id": "open-mixtral-8x22b",
		"name": "Mixtral 8x22B",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 2,
			"output": 6,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 64e3,
		"maxTokens": 64e3
	},
	"open-mixtral-8x7b": {
		"id": "open-mixtral-8x7b",
		"name": "Mixtral 8x7B",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .7,
			"output": .7,
			"cacheRead": .07,
			"cacheWrite": 0
		},
		"contextWindow": 32e3,
		"maxTokens": 32e3
	},
	"pixtral-12b": {
		"id": "pixtral-12b",
		"name": "Pixtral 12B",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .15,
			"cacheRead": .015,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3
	},
	"pixtral-large-latest": {
		"id": "pixtral-large-latest",
		"name": "Pixtral Large (latest)",
		"api": "mistral-conversations",
		"provider": "mistral",
		"baseUrl": "https://api.mistral.ai",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 6,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/moonshotai.models.js
const MOONSHOTAI_MODELS = flattenModelCatalog("moonshotai", { "openai-completions": {
	"kimi-k2-0711-preview": {
		"id": "kimi-k2-0711-preview",
		"name": "Kimi K2 0711",
		"api": "openai-completions",
		"provider": "moonshotai",
		"baseUrl": "https://api.moonshot.ai/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 16384,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2-0905-preview": {
		"id": "kimi-k2-0905-preview",
		"name": "Kimi K2 0905",
		"api": "openai-completions",
		"provider": "moonshotai",
		"baseUrl": "https://api.moonshot.ai/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2-thinking": {
		"id": "kimi-k2-thinking",
		"name": "Kimi K2 Thinking",
		"api": "openai-completions",
		"provider": "moonshotai",
		"baseUrl": "https://api.moonshot.ai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2-thinking-turbo": {
		"id": "kimi-k2-thinking-turbo",
		"name": "Kimi K2 Thinking Turbo",
		"api": "openai-completions",
		"provider": "moonshotai",
		"baseUrl": "https://api.moonshot.ai/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.15,
			"output": 8,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2-turbo-preview": {
		"id": "kimi-k2-turbo-preview",
		"name": "Kimi K2 Turbo",
		"api": "openai-completions",
		"provider": "moonshotai",
		"baseUrl": "https://api.moonshot.ai/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 2.4,
			"output": 10,
			"cacheRead": .6,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2.5": {
		"id": "kimi-k2.5",
		"name": "Kimi K2.5",
		"api": "openai-completions",
		"provider": "moonshotai",
		"baseUrl": "https://api.moonshot.ai/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .6,
			"output": 3,
			"cacheRead": .1,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2.6": {
		"id": "kimi-k2.6",
		"name": "Kimi K2.6",
		"api": "openai-completions",
		"provider": "moonshotai",
		"baseUrl": "https://api.moonshot.ai/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .95,
			"output": 4,
			"cacheRead": .16,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2.7-code": {
		"id": "kimi-k2.7-code",
		"name": "Kimi K2.7 Code",
		"api": "openai-completions",
		"provider": "moonshotai",
		"baseUrl": "https://api.moonshot.ai/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .95,
			"output": 4,
			"cacheRead": .19,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		},
		"thinkingLevelMap": { "off": null }
	},
	"kimi-k2.7-code-highspeed": {
		"id": "kimi-k2.7-code-highspeed",
		"name": "Kimi K2.7 Code HighSpeed",
		"api": "openai-completions",
		"provider": "moonshotai",
		"baseUrl": "https://api.moonshot.ai/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.9,
			"output": 8,
			"cacheRead": .38,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		},
		"thinkingLevelMap": { "off": null }
	},
	"kimi-k3": {
		"id": "kimi-k3",
		"name": "Kimi K3",
		"api": "openai-completions",
		"provider": "moonshotai",
		"baseUrl": "https://api.moonshot.ai/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": true,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "openai",
			"requiresReasoningContentOnAssistantMessages": true,
			"deferredToolsMode": "kimi"
		},
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": null,
			"high": "high",
			"xhigh": null,
			"max": "max"
		}
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/moonshotai-cn.models.js
const MOONSHOTAI_CN_MODELS = flattenModelCatalog("moonshotai-cn", { "openai-completions": {
	"kimi-k2-0711-preview": {
		"id": "kimi-k2-0711-preview",
		"name": "Kimi K2 0711",
		"api": "openai-completions",
		"provider": "moonshotai-cn",
		"baseUrl": "https://api.moonshot.cn/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 16384,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2-0905-preview": {
		"id": "kimi-k2-0905-preview",
		"name": "Kimi K2 0905",
		"api": "openai-completions",
		"provider": "moonshotai-cn",
		"baseUrl": "https://api.moonshot.cn/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2-thinking": {
		"id": "kimi-k2-thinking",
		"name": "Kimi K2 Thinking",
		"api": "openai-completions",
		"provider": "moonshotai-cn",
		"baseUrl": "https://api.moonshot.cn/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2-thinking-turbo": {
		"id": "kimi-k2-thinking-turbo",
		"name": "Kimi K2 Thinking Turbo",
		"api": "openai-completions",
		"provider": "moonshotai-cn",
		"baseUrl": "https://api.moonshot.cn/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.15,
			"output": 8,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2-turbo-preview": {
		"id": "kimi-k2-turbo-preview",
		"name": "Kimi K2 Turbo",
		"api": "openai-completions",
		"provider": "moonshotai-cn",
		"baseUrl": "https://api.moonshot.cn/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 2.4,
			"output": 10,
			"cacheRead": .6,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2.5": {
		"id": "kimi-k2.5",
		"name": "Kimi K2.5",
		"api": "openai-completions",
		"provider": "moonshotai-cn",
		"baseUrl": "https://api.moonshot.cn/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .6,
			"output": 3,
			"cacheRead": .1,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2.6": {
		"id": "kimi-k2.6",
		"name": "Kimi K2.6",
		"api": "openai-completions",
		"provider": "moonshotai-cn",
		"baseUrl": "https://api.moonshot.cn/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .95,
			"output": 4,
			"cacheRead": .16,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		}
	},
	"kimi-k2.7-code": {
		"id": "kimi-k2.7-code",
		"name": "Kimi K2.7 Code",
		"api": "openai-completions",
		"provider": "moonshotai-cn",
		"baseUrl": "https://api.moonshot.cn/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .95,
			"output": 4,
			"cacheRead": .19,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		},
		"thinkingLevelMap": { "off": null }
	},
	"kimi-k2.7-code-highspeed": {
		"id": "kimi-k2.7-code-highspeed",
		"name": "Kimi K2.7 Code HighSpeed",
		"api": "openai-completions",
		"provider": "moonshotai-cn",
		"baseUrl": "https://api.moonshot.cn/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.9,
			"output": 8,
			"cacheRead": .38,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "deepseek"
		},
		"thinkingLevelMap": { "off": null }
	},
	"kimi-k3": {
		"id": "kimi-k3",
		"name": "Kimi K3",
		"api": "openai-completions",
		"provider": "moonshotai-cn",
		"baseUrl": "https://api.moonshot.cn/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072,
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": true,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"thinkingFormat": "openai",
			"requiresReasoningContentOnAssistantMessages": true,
			"deferredToolsMode": "kimi"
		},
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": null,
			"high": "high",
			"xhigh": null,
			"max": "max"
		}
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/nvidia.models.js
const NVIDIA_MODELS = flattenModelCatalog("nvidia", { "openai-completions": {
	"meta/llama-3.1-70b-instruct": {
		"id": "meta/llama-3.1-70b-instruct",
		"name": "Llama 3.1 70b Instruct",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 128e3,
		"maxTokens": 4096
	},
	"meta/llama-3.1-8b-instruct": {
		"id": "meta/llama-3.1-8b-instruct",
		"name": "Llama 3.1 8B Instruct",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 16e3,
		"maxTokens": 4096
	},
	"meta/llama-3.2-11b-vision-instruct": {
		"id": "meta/llama-3.2-11b-vision-instruct",
		"name": "Llama 3.2 11b Vision Instruct",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 128e3,
		"maxTokens": 4096
	},
	"meta/llama-3.2-90b-vision-instruct": {
		"id": "meta/llama-3.2-90b-vision-instruct",
		"name": "Llama-3.2-90B-Vision-Instruct",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 128e3,
		"maxTokens": 8192
	},
	"meta/llama-3.3-70b-instruct": {
		"id": "meta/llama-3.3-70b-instruct",
		"name": "Llama 3.3 70b Instruct",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 128e3,
		"maxTokens": 4096
	},
	"minimaxai/minimax-m3": {
		"id": "minimaxai/minimax-m3",
		"name": "MiniMax-M3",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 1e6,
		"maxTokens": 16384
	},
	"mistralai/mistral-small-4-119b-2603": {
		"id": "mistralai/mistral-small-4-119b-2603",
		"name": "mistral-small-4-119b-2603",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 128e3,
		"maxTokens": 8192
	},
	"moonshotai/kimi-k2.6": {
		"id": "moonshotai/kimi-k2.6",
		"name": "Kimi K2.6",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"nvidia/nemotron-3-nano-30b-a3b": {
		"id": "nvidia/nemotron-3-nano-30b-a3b",
		"name": "nemotron-3-nano-30b-a3b",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 131072,
		"maxTokens": 131072
	},
	"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning": {
		"id": "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
		"name": "Nemotron 3 Nano Omni",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 256e3,
		"maxTokens": 65536
	},
	"nvidia/nemotron-3-super-120b-a12b": {
		"id": "nvidia/nemotron-3-super-120b-a12b",
		"name": "Nemotron 3 Super",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .2,
			"output": .8,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"nvidia/nemotron-3-ultra-550b-a55b": {
		"id": "nvidia/nemotron-3-ultra-550b-a55b",
		"name": "Nemotron 3 Ultra 550B A55B",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .5,
			"output": 2.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 1e6,
		"maxTokens": 65536
	},
	"nvidia/nvidia-nemotron-nano-9b-v2": {
		"id": "nvidia/nvidia-nemotron-nano-9b-v2",
		"name": "nvidia-nemotron-nano-9b-v2",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 131072,
		"maxTokens": 131072
	},
	"openai/gpt-oss-120b": {
		"id": "openai/gpt-oss-120b",
		"name": "GPT-OSS-120B",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 128e3,
		"maxTokens": 8192
	},
	"openai/gpt-oss-20b": {
		"id": "openai/gpt-oss-20b",
		"name": "GPT OSS 20B",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 131072,
		"maxTokens": 32768
	},
	"stepfun-ai/step-3.5-flash": {
		"id": "stepfun-ai/step-3.5-flash",
		"name": "Step 3.5 Flash",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 256e3,
		"maxTokens": 16384
	},
	"stepfun-ai/step-3.7-flash": {
		"id": "stepfun-ai/step-3.7-flash",
		"name": "Step 3.7 Flash",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 256e3,
		"maxTokens": 16384
	},
	"z-ai/glm-5.2": {
		"id": "z-ai/glm-5.2",
		"name": "GLM-5.2",
		"api": "openai-completions",
		"provider": "nvidia",
		"baseUrl": "https://integrate.api.nvidia.com/v1",
		"headers": { "NVCF-POLL-SECONDS": "3600" },
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 1e6,
		"maxTokens": 131072
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/openai.models.js
const OPENAI_MODELS = flattenModelCatalog("openai", { "openai-responses": {
	"gpt-4": {
		"id": "gpt-4",
		"name": "GPT-4",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 30,
			"output": 60,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 8192,
		"maxTokens": 8192,
		"compat": { "supportsStrictMode": true }
	},
	"gpt-4-turbo": {
		"id": "gpt-4-turbo",
		"name": "GPT-4 Turbo",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 30,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": { "supportsStrictMode": true }
	},
	"gpt-4.1": {
		"id": "gpt-4.1",
		"name": "GPT-4.1",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 8,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 1047576,
		"maxTokens": 32768,
		"compat": { "supportsStrictMode": true }
	},
	"gpt-4.1-mini": {
		"id": "gpt-4.1-mini",
		"name": "GPT-4.1 mini",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 1.6,
			"cacheRead": .1,
			"cacheWrite": 0
		},
		"contextWindow": 1047576,
		"maxTokens": 32768,
		"compat": { "supportsStrictMode": true }
	},
	"gpt-4.1-nano": {
		"id": "gpt-4.1-nano",
		"name": "GPT-4.1 nano",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .4,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 1047576,
		"maxTokens": 32768,
		"compat": { "supportsStrictMode": true }
	},
	"gpt-4o": {
		"id": "gpt-4o",
		"name": "GPT-4o",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 1.25,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "supportsStrictMode": true }
	},
	"gpt-4o-2024-05-13": {
		"id": "gpt-4o-2024-05-13",
		"name": "GPT-4o (2024-05-13)",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 15,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": { "supportsStrictMode": true }
	},
	"gpt-4o-2024-08-06": {
		"id": "gpt-4o-2024-08-06",
		"name": "GPT-4o (2024-08-06)",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 1.25,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "supportsStrictMode": true }
	},
	"gpt-4o-2024-11-20": {
		"id": "gpt-4o-2024-11-20",
		"name": "GPT-4o (2024-11-20)",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 1.25,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "supportsStrictMode": true }
	},
	"gpt-4o-mini": {
		"id": "gpt-4o-mini",
		"name": "GPT-4o mini",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": .075,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "supportsStrictMode": true }
	},
	"gpt-5": {
		"id": "gpt-5",
		"name": "GPT-5",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"minimal": "minimal",
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5-chat-latest": {
		"id": "gpt-5-chat-latest",
		"name": "GPT-5 Chat Latest",
		"api": "openai-responses",
		"baseUrl": "https://api.openai.com/v1",
		"provider": "openai",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"thinkingLevelMap": { "off": null },
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5-mini": {
		"id": "gpt-5-mini",
		"name": "GPT-5 Mini",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 2,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"minimal": "minimal",
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5-nano": {
		"id": "gpt-5-nano",
		"name": "GPT-5 Nano",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .05,
			"output": .4,
			"cacheRead": .005,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"minimal": "minimal",
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5-pro": {
		"id": "gpt-5-pro",
		"name": "GPT-5 Pro",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 120,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": null,
			"medium": null,
			"high": "high",
			"xhigh": null,
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5.1": {
		"id": "gpt-5.1",
		"name": "GPT-5.1",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5.2": {
		"id": "gpt-5.2",
		"name": "GPT-5.2",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5.2-chat-latest": {
		"id": "gpt-5.2-chat-latest",
		"name": "GPT-5.2 Chat",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": null,
			"medium": "medium",
			"high": null,
			"xhigh": "xhigh",
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5.2-pro": {
		"id": "gpt-5.2-pro",
		"name": "GPT-5.2 Pro",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 21,
			"output": 168,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": null,
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5.3-chat-latest": {
		"id": "gpt-5.3-chat-latest",
		"name": "GPT-5.3 Chat (latest)",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh"
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5.3-codex": {
		"id": "gpt-5.3-codex",
		"name": "GPT-5.3 Codex",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5.3-codex-spark": {
		"id": "gpt-5.3-codex-spark",
		"name": "GPT-5.3 Codex Spark",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 32e3,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5.4": {
		"id": "gpt-5.4",
		"name": "GPT-5.4",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 15,
			"cacheRead": .25,
			"cacheWrite": 0,
			"tiers": [{
				"inputTokensAbove": 272e3,
				"input": 5,
				"output": 22.5,
				"cacheRead": .5,
				"cacheWrite": 0
			}]
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true,
			"supportsToolSearch": true
		}
	},
	"gpt-5.4-mini": {
		"id": "gpt-5.4-mini",
		"name": "GPT-5.4 mini",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .75,
			"output": 4.5,
			"cacheRead": .075,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true,
			"supportsToolSearch": true
		}
	},
	"gpt-5.4-nano": {
		"id": "gpt-5.4-nano",
		"name": "GPT-5.4 nano",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": 1.25,
			"cacheRead": .02,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5.4-pro": {
		"id": "gpt-5.4-pro",
		"name": "GPT-5.4 Pro",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 30,
			"output": 180,
			"cacheRead": 0,
			"cacheWrite": 0,
			"tiers": [{
				"inputTokensAbove": 272e3,
				"input": 60,
				"output": 270,
				"cacheRead": 0,
				"cacheWrite": 0
			}]
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": null,
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true,
			"supportsToolSearch": true
		}
	},
	"gpt-5.5": {
		"id": "gpt-5.5",
		"name": "GPT-5.5",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 0,
			"tiers": [{
				"inputTokensAbove": 272e3,
				"input": 10,
				"output": 45,
				"cacheRead": 1,
				"cacheWrite": 0
			}]
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true,
			"supportsToolSearch": true
		}
	},
	"gpt-5.5-pro": {
		"id": "gpt-5.5-pro",
		"name": "GPT-5.5 Pro",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 30,
			"output": 180,
			"cacheRead": 0,
			"cacheWrite": 0,
			"tiers": [{
				"inputTokensAbove": 272e3,
				"input": 60,
				"output": 270,
				"cacheRead": 0,
				"cacheWrite": 0
			}]
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": null,
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": null
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true
		}
	},
	"gpt-5.6-luna": {
		"id": "gpt-5.6-luna",
		"name": "GPT-5.6 Luna",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 6,
			"cacheRead": .1,
			"cacheWrite": 1.25,
			"tiers": [{
				"inputTokensAbove": 272e3,
				"input": 2,
				"output": 9,
				"cacheRead": .2,
				"cacheWrite": 2.5
			}]
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true,
			"supportsToolSearch": true,
			"supportsExplicitPromptCacheMode": true
		}
	},
	"gpt-5.6-sol": {
		"id": "gpt-5.6-sol",
		"name": "GPT-5.6 Sol",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 6.25,
			"tiers": [{
				"inputTokensAbove": 272e3,
				"input": 10,
				"output": 45,
				"cacheRead": 1,
				"cacheWrite": 12.5
			}]
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true,
			"supportsToolSearch": true,
			"supportsExplicitPromptCacheMode": true
		}
	},
	"gpt-5.6-terra": {
		"id": "gpt-5.6-terra",
		"name": "GPT-5.6 Terra",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 15,
			"cacheRead": .25,
			"cacheWrite": 3.125,
			"tiers": [{
				"inputTokensAbove": 272e3,
				"input": 5,
				"output": 22.5,
				"cacheRead": .5,
				"cacheWrite": 6.25
			}]
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": "none",
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": {
			"supportsStrictMode": true,
			"supportsOpenAIGrammarTools": true,
			"supportsToolSearch": true,
			"supportsExplicitPromptCacheMode": true
		}
	},
	"gpt-realtime-2.1": {
		"id": "gpt-realtime-2.1",
		"name": "GPT-Realtime-2.1",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 4,
			"output": 24,
			"cacheRead": .4,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 32e3,
		"thinkingLevelMap": {
			"off": null,
			"minimal": "minimal",
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": "xhigh",
			"max": null
		},
		"compat": { "supportsStrictMode": true }
	},
	"o1": {
		"id": "o1",
		"name": "o1",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 60,
			"cacheRead": 7.5,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		},
		"compat": { "supportsStrictMode": true }
	},
	"o1-pro": {
		"id": "o1-pro",
		"name": "o1-pro",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 150,
			"output": 600,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		},
		"compat": { "supportsStrictMode": true }
	},
	"o3": {
		"id": "o3",
		"name": "o3",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 8,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		},
		"compat": { "supportsStrictMode": true }
	},
	"o3-mini": {
		"id": "o3-mini",
		"name": "o3-mini",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.1,
			"output": 4.4,
			"cacheRead": .55,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		},
		"compat": { "supportsStrictMode": true }
	},
	"o3-pro": {
		"id": "o3-pro",
		"name": "o3-pro",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 20,
			"output": 80,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		},
		"compat": { "supportsStrictMode": true }
	},
	"o4-mini": {
		"id": "o4-mini",
		"name": "o4-mini",
		"api": "openai-responses",
		"provider": "openai",
		"baseUrl": "https://api.openai.com/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.1,
			"output": 4.4,
			"cacheRead": .275,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		},
		"compat": { "supportsStrictMode": true }
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/openai-codex.models.js
const OPENAI_CODEX_MODELS = flattenModelCatalog("openai-codex", { "openai-codex-responses": {
	"gpt-5.3-codex-spark": {
		"id": "gpt-5.3-codex-spark",
		"name": "GPT-5.3 Codex Spark",
		"api": "openai-codex-responses",
		"provider": "openai-codex",
		"baseUrl": "https://chatgpt.com/backend-api",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"minimal": "low"
		},
		"compat": { "supportsOpenAIGrammarTools": true }
	},
	"gpt-5.4": {
		"id": "gpt-5.4",
		"name": "GPT-5.4",
		"api": "openai-codex-responses",
		"provider": "openai-codex",
		"baseUrl": "https://chatgpt.com/backend-api",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 15,
			"cacheRead": .25,
			"cacheWrite": 0,
			"tiers": [{
				"inputTokensAbove": 272e3,
				"input": 5,
				"output": 22.5,
				"cacheRead": .5,
				"cacheWrite": 0
			}]
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"minimal": "low"
		},
		"compat": {
			"supportsOpenAIGrammarTools": true,
			"supportsToolSearch": true
		}
	},
	"gpt-5.4-mini": {
		"id": "gpt-5.4-mini",
		"name": "GPT-5.4 mini",
		"api": "openai-codex-responses",
		"provider": "openai-codex",
		"baseUrl": "https://chatgpt.com/backend-api",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .75,
			"output": 4.5,
			"cacheRead": .075,
			"cacheWrite": 0
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"minimal": "low"
		},
		"compat": {
			"supportsOpenAIGrammarTools": true,
			"supportsToolSearch": true
		}
	},
	"gpt-5.5": {
		"id": "gpt-5.5",
		"name": "GPT-5.5",
		"api": "openai-codex-responses",
		"provider": "openai-codex",
		"baseUrl": "https://chatgpt.com/backend-api",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 0,
			"tiers": [{
				"inputTokensAbove": 272e3,
				"input": 10,
				"output": 45,
				"cacheRead": 1,
				"cacheWrite": 0
			}]
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"minimal": "low"
		},
		"compat": {
			"supportsOpenAIGrammarTools": true,
			"supportsToolSearch": true
		}
	},
	"gpt-5.6-luna": {
		"id": "gpt-5.6-luna",
		"name": "GPT-5.6 Luna",
		"api": "openai-codex-responses",
		"provider": "openai-codex",
		"baseUrl": "https://chatgpt.com/backend-api",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 6,
			"cacheRead": .1,
			"cacheWrite": 1.25,
			"tiers": [{
				"inputTokensAbove": 272e3,
				"input": 2,
				"output": 9,
				"cacheRead": .2,
				"cacheWrite": 2.5
			}]
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max",
			"minimal": "low"
		},
		"compat": {
			"supportsOpenAIGrammarTools": true,
			"supportsToolSearch": true
		}
	},
	"gpt-5.6-sol": {
		"id": "gpt-5.6-sol",
		"name": "GPT-5.6 Sol",
		"api": "openai-codex-responses",
		"provider": "openai-codex",
		"baseUrl": "https://chatgpt.com/backend-api",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 6.25,
			"tiers": [{
				"inputTokensAbove": 272e3,
				"input": 10,
				"output": 45,
				"cacheRead": 1,
				"cacheWrite": 12.5
			}]
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max",
			"minimal": "low"
		},
		"compat": {
			"supportsOpenAIGrammarTools": true,
			"supportsToolSearch": true
		}
	},
	"gpt-5.6-terra": {
		"id": "gpt-5.6-terra",
		"name": "GPT-5.6 Terra",
		"api": "openai-codex-responses",
		"provider": "openai-codex",
		"baseUrl": "https://chatgpt.com/backend-api",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 15,
			"cacheRead": .25,
			"cacheWrite": 3.125,
			"tiers": [{
				"inputTokensAbove": 272e3,
				"input": 5,
				"output": 22.5,
				"cacheRead": .5,
				"cacheWrite": 6.25
			}]
		},
		"contextWindow": 272e3,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max",
			"minimal": "low"
		},
		"compat": {
			"supportsOpenAIGrammarTools": true,
			"supportsToolSearch": true
		}
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/opencode.models.js
const OPENCODE_MODELS = flattenModelCatalog("opencode", {
	"anthropic-messages": {
		"claude-fable-5": {
			"id": "claude-fable-5",
			"name": "Claude Fable 5",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 10,
				"output": 50,
				"cacheRead": 1,
				"cacheWrite": 12.5
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"xhigh": "xhigh",
				"max": "max"
			},
			"compat": { "forceAdaptiveThinking": true }
		},
		"claude-haiku-4-5": {
			"id": "claude-haiku-4-5",
			"name": "Claude Haiku 4.5",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1,
				"output": 5,
				"cacheRead": .1,
				"cacheWrite": 1.25
			},
			"contextWindow": 2e5,
			"maxTokens": 64e3
		},
		"claude-opus-4-1": {
			"id": "claude-opus-4-1",
			"name": "Claude Opus 4.1",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 15,
				"output": 75,
				"cacheRead": 1.5,
				"cacheWrite": 18.75
			},
			"contextWindow": 2e5,
			"maxTokens": 32e3
		},
		"claude-opus-4-5": {
			"id": "claude-opus-4-5",
			"name": "Claude Opus 4.5",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 2e5,
			"maxTokens": 64e3
		},
		"claude-opus-4-6": {
			"id": "claude-opus-4-6",
			"name": "Claude Opus 4.6",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"thinkingLevelMap": { "max": "max" },
			"compat": { "forceAdaptiveThinking": true }
		},
		"claude-opus-4-7": {
			"id": "claude-opus-4-7",
			"name": "Claude Opus 4.7",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"xhigh": "xhigh",
				"max": "max"
			},
			"compat": {
				"forceAdaptiveThinking": true,
				"supportsTemperature": false
			}
		},
		"claude-opus-4-8": {
			"id": "claude-opus-4-8",
			"name": "Claude Opus 4.8",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"xhigh": "xhigh",
				"max": "max"
			},
			"compat": {
				"forceAdaptiveThinking": true,
				"supportsTemperature": false
			}
		},
		"claude-opus-5": {
			"id": "claude-opus-5",
			"name": "Claude Opus 5",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 25,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"xhigh": "xhigh",
				"max": "max"
			},
			"compat": {
				"forceAdaptiveThinking": true,
				"supportsTemperature": false
			}
		},
		"claude-sonnet-4": {
			"id": "claude-sonnet-4",
			"name": "Claude Sonnet 4",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 3,
				"output": 15,
				"cacheRead": .3,
				"cacheWrite": 3.75
			},
			"contextWindow": 2e5,
			"maxTokens": 64e3
		},
		"claude-sonnet-4-5": {
			"id": "claude-sonnet-4-5",
			"name": "Claude Sonnet 4.5",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 3,
				"output": 15,
				"cacheRead": .3,
				"cacheWrite": 3.75
			},
			"contextWindow": 2e5,
			"maxTokens": 64e3
		},
		"claude-sonnet-4-6": {
			"id": "claude-sonnet-4-6",
			"name": "Claude Sonnet 4.6",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 3,
				"output": 15,
				"cacheRead": .3,
				"cacheWrite": 3.75
			},
			"contextWindow": 1e6,
			"maxTokens": 64e3,
			"thinkingLevelMap": { "max": "max" },
			"compat": { "forceAdaptiveThinking": true }
		},
		"claude-sonnet-5": {
			"id": "claude-sonnet-5",
			"name": "Claude Sonnet 5",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2,
				"output": 10,
				"cacheRead": .2,
				"cacheWrite": 2.5
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"xhigh": "xhigh",
				"max": "max"
			},
			"compat": { "forceAdaptiveThinking": true }
		},
		"qwen3.5-plus": {
			"id": "qwen3.5-plus",
			"name": "Qwen3.5 Plus",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .2,
				"output": 1.2,
				"cacheRead": .02,
				"cacheWrite": .25
			},
			"contextWindow": 262144,
			"maxTokens": 65536
		},
		"qwen3.6-plus": {
			"id": "qwen3.6-plus",
			"name": "Qwen3.6 Plus",
			"api": "anthropic-messages",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .5,
				"output": 3,
				"cacheRead": .05,
				"cacheWrite": .625
			},
			"contextWindow": 262144,
			"maxTokens": 65536
		}
	},
	"google-generative-ai": {
		"gemini-3-flash": {
			"id": "gemini-3-flash",
			"name": "Gemini 3 Flash",
			"api": "google-generative-ai",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .5,
				"output": 3,
				"cacheRead": .05,
				"cacheWrite": 0
			},
			"contextWindow": 1048576,
			"maxTokens": 65536,
			"thinkingLevelMap": { "off": null }
		},
		"gemini-3.1-pro": {
			"id": "gemini-3.1-pro",
			"name": "Gemini 3.1 Pro Preview",
			"api": "google-generative-ai",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2,
				"output": 12,
				"cacheRead": .2,
				"cacheWrite": 0
			},
			"contextWindow": 1048576,
			"maxTokens": 65536,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "LOW",
				"medium": null,
				"high": "HIGH"
			}
		},
		"gemini-3.5-flash": {
			"id": "gemini-3.5-flash",
			"name": "Gemini 3.5 Flash",
			"api": "google-generative-ai",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.5,
				"output": 9,
				"cacheRead": .15,
				"cacheWrite": 0
			},
			"contextWindow": 1048576,
			"maxTokens": 65536,
			"thinkingLevelMap": { "off": null }
		},
		"gemini-3.5-flash-lite": {
			"id": "gemini-3.5-flash-lite",
			"name": "Gemini 3.5 Flash Lite",
			"api": "google-generative-ai",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .3,
				"output": 2.5,
				"cacheRead": .03,
				"cacheWrite": 0
			},
			"contextWindow": 1048576,
			"maxTokens": 65536,
			"thinkingLevelMap": { "off": null }
		},
		"gemini-3.6-flash": {
			"id": "gemini-3.6-flash",
			"name": "Gemini 3.6 Flash",
			"api": "google-generative-ai",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.5,
				"output": 7.5,
				"cacheRead": .15,
				"cacheWrite": 0
			},
			"contextWindow": 1048576,
			"maxTokens": 65536,
			"thinkingLevelMap": { "off": null }
		}
	},
	"openai-completions": {
		"big-pickle": {
			"id": "big-pickle",
			"name": "Big Pickle",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 0,
				"output": 0,
				"cacheRead": 0,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 2e5,
			"maxTokens": 32e3
		},
		"deepseek-v4-flash": {
			"id": "deepseek-v4-flash",
			"name": "DeepSeek V4 Flash",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .14,
				"output": .28,
				"cacheRead": .028,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens",
				"supportsLongCacheRetention": false,
				"requiresReasoningContentOnAssistantMessages": true
			},
			"contextWindow": 1e6,
			"maxTokens": 384e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": null,
				"medium": null,
				"high": "high",
				"xhigh": null,
				"max": "max"
			}
		},
		"deepseek-v4-flash-free": {
			"id": "deepseek-v4-flash-free",
			"name": "DeepSeek V4 Flash Free",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 0,
				"output": 0,
				"cacheRead": 0,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens",
				"requiresReasoningContentOnAssistantMessages": true
			},
			"contextWindow": 2e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": null,
				"medium": null,
				"high": "high",
				"xhigh": null,
				"max": "max"
			}
		},
		"deepseek-v4-pro": {
			"id": "deepseek-v4-pro",
			"name": "DeepSeek V4 Pro",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 1.74,
				"output": 3.84,
				"cacheRead": .145,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens",
				"supportsLongCacheRetention": false,
				"requiresReasoningContentOnAssistantMessages": true
			},
			"contextWindow": 1e6,
			"maxTokens": 384e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": null,
				"medium": null,
				"high": "high",
				"xhigh": null,
				"max": "max"
			}
		},
		"glm-5": {
			"id": "glm-5",
			"name": "GLM-5",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 1,
				"output": 3.2,
				"cacheRead": .2,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 204800,
			"maxTokens": 131072
		},
		"glm-5.1": {
			"id": "glm-5.1",
			"name": "GLM-5.1",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 1.4,
				"output": 4.4,
				"cacheRead": .26,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 204800,
			"maxTokens": 131072
		},
		"glm-5.2": {
			"id": "glm-5.2",
			"name": "GLM-5.2",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 1.4,
				"output": 4.4,
				"cacheRead": .26,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 1e6,
			"maxTokens": 131072,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": null,
				"medium": null,
				"high": "high",
				"xhigh": null,
				"max": "max"
			}
		},
		"grok-build-0.1": {
			"id": "grok-build-0.1",
			"name": "Grok Build 0.1",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1,
				"output": 2,
				"cacheRead": .2,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 256e3,
			"maxTokens": 256e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": null,
				"medium": null
			}
		},
		"kimi-k2.5": {
			"id": "kimi-k2.5",
			"name": "Kimi K2.5",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .6,
				"output": 3,
				"cacheRead": .08,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens",
				"supportsLongCacheRetention": false
			},
			"contextWindow": 262144,
			"maxTokens": 65536
		},
		"kimi-k2.6": {
			"id": "kimi-k2.6",
			"name": "Kimi K2.6",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .95,
				"output": 4,
				"cacheRead": .16,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"thinkingFormat": "deepseek",
				"supportsReasoningEffort": false,
				"maxTokensField": "max_tokens",
				"supportsLongCacheRetention": false
			},
			"contextWindow": 262144,
			"maxTokens": 65536
		},
		"kimi-k2.7-code": {
			"id": "kimi-k2.7-code",
			"name": "Kimi K2.7 Code",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .95,
				"output": 4,
				"cacheRead": .19,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 262144,
			"maxTokens": 262144
		},
		"laguna-s-2.1-free": {
			"id": "laguna-s-2.1-free",
			"name": "Laguna S 2.1 Free",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 0,
				"output": 0,
				"cacheRead": 0,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 256e3,
			"maxTokens": 32e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		},
		"ling-3.0-flash-free": {
			"id": "ling-3.0-flash-free",
			"name": "Ling-3.0-flash Free",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 0,
				"output": 0,
				"cacheRead": 0,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 262144,
			"maxTokens": 32768,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		},
		"mimo-v2.5-free": {
			"id": "mimo-v2.5-free",
			"name": "MiMo V2.5 Free",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 0,
				"output": 0,
				"cacheRead": 0,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 2e5,
			"maxTokens": 32e3
		},
		"minimax-m2.5": {
			"id": "minimax-m2.5",
			"name": "MiniMax-M2.5",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .3,
				"output": 1.2,
				"cacheRead": .06,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 204800,
			"maxTokens": 131072
		},
		"minimax-m2.7": {
			"id": "minimax-m2.7",
			"name": "MiniMax-M2.7",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .3,
				"output": 1.2,
				"cacheRead": .06,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens",
				"supportsLongCacheRetention": false
			},
			"contextWindow": 204800,
			"maxTokens": 131072
		},
		"minimax-m3": {
			"id": "minimax-m3",
			"name": "MiniMax-M3",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .3,
				"output": 1.2,
				"cacheRead": .06,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 512e3,
			"maxTokens": 128e3
		},
		"nemotron-3-ultra-free": {
			"id": "nemotron-3-ultra-free",
			"name": "Nemotron 3 Ultra Free",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 0,
				"output": 0,
				"cacheRead": 0,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3
		},
		"north-mini-code-free": {
			"id": "north-mini-code-free",
			"name": "North Mini Code Free",
			"api": "openai-completions",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 0,
				"output": 0,
				"cacheRead": 0,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 256e3,
			"maxTokens": 64e3,
			"thinkingLevelMap": {
				"off": "none",
				"minimal": null,
				"low": null,
				"medium": null,
				"high": "high",
				"xhigh": null,
				"max": null
			}
		}
	},
	"openai-responses": {
		"gpt-5": {
			"id": "gpt-5",
			"name": "GPT-5",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.07,
				"output": 8.5,
				"cacheRead": .107,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": "minimal",
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		},
		"gpt-5-codex": {
			"id": "gpt-5-codex",
			"name": "GPT-5 Codex",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.07,
				"output": 8.5,
				"cacheRead": .107,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		},
		"gpt-5-nano": {
			"id": "gpt-5-nano",
			"name": "GPT-5 Nano",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .05,
				"output": .4,
				"cacheRead": .005,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": "minimal",
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		},
		"gpt-5.1": {
			"id": "gpt-5.1",
			"name": "GPT-5.1",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.07,
				"output": 8.5,
				"cacheRead": .107,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		},
		"gpt-5.1-codex": {
			"id": "gpt-5.1-codex",
			"name": "GPT-5.1 Codex",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.07,
				"output": 8.5,
				"cacheRead": .107,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		},
		"gpt-5.1-codex-max": {
			"id": "gpt-5.1-codex-max",
			"name": "GPT-5.1 Codex Max",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.25,
				"output": 10,
				"cacheRead": .125,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			}
		},
		"gpt-5.1-codex-mini": {
			"id": "gpt-5.1-codex-mini",
			"name": "GPT-5.1 Codex Mini",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .25,
				"output": 2,
				"cacheRead": .025,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		},
		"gpt-5.2": {
			"id": "gpt-5.2",
			"name": "GPT-5.2",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.75,
				"output": 14,
				"cacheRead": .175,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			}
		},
		"gpt-5.2-codex": {
			"id": "gpt-5.2-codex",
			"name": "GPT-5.2 Codex",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.75,
				"output": 14,
				"cacheRead": .175,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			}
		},
		"gpt-5.3-codex": {
			"id": "gpt-5.3-codex",
			"name": "GPT-5.3 Codex",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.75,
				"output": 14,
				"cacheRead": .175,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			}
		},
		"gpt-5.4": {
			"id": "gpt-5.4",
			"name": "GPT-5.4",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2.5,
				"output": 15,
				"cacheRead": .25,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 272e3,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			}
		},
		"gpt-5.4-mini": {
			"id": "gpt-5.4-mini",
			"name": "GPT-5.4 Mini",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .75,
				"output": 4.5,
				"cacheRead": .075,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			}
		},
		"gpt-5.4-nano": {
			"id": "gpt-5.4-nano",
			"name": "GPT-5.4 Nano",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .2,
				"output": 1.25,
				"cacheRead": .02,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 4e5,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			}
		},
		"gpt-5.4-pro": {
			"id": "gpt-5.4-pro",
			"name": "GPT-5.4 Pro",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 30,
				"output": 180,
				"cacheRead": 30,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": null,
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			}
		},
		"gpt-5.5": {
			"id": "gpt-5.5",
			"name": "GPT-5.5",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 30,
				"cacheRead": .5,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			}
		},
		"gpt-5.5-pro": {
			"id": "gpt-5.5-pro",
			"name": "GPT-5.5 Pro",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 30,
				"output": 180,
				"cacheRead": 30,
				"cacheWrite": 0
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": null,
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": null
			}
		},
		"gpt-5.6-luna": {
			"id": "gpt-5.6-luna",
			"name": "GPT-5.6 Luna",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1,
				"output": 6,
				"cacheRead": .1,
				"cacheWrite": 1.25
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": "max"
			}
		},
		"gpt-5.6-sol": {
			"id": "gpt-5.6-sol",
			"name": "GPT-5.6 Sol",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 5,
				"output": 30,
				"cacheRead": .5,
				"cacheWrite": 6.25
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": "max"
			}
		},
		"gpt-5.6-terra": {
			"id": "gpt-5.6-terra",
			"name": "GPT-5.6 Terra",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2.5,
				"output": 15,
				"cacheRead": .25,
				"cacheWrite": 3.125
			},
			"compat": {
				"sessionAffinityFormat": "openai-nosession",
				"supportsOpenAIGrammarTools": true
			},
			"contextWindow": 105e4,
			"maxTokens": 128e3,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": "xhigh",
				"max": "max"
			}
		},
		"grok-4.5": {
			"id": "grok-4.5",
			"name": "Grok 4.5",
			"api": "openai-responses",
			"provider": "opencode",
			"baseUrl": "https://opencode.ai/zen/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 2,
				"output": 6,
				"cacheRead": .5,
				"cacheWrite": 0
			},
			"compat": { "sessionAffinityFormat": "openai-nosession" },
			"contextWindow": 5e5,
			"maxTokens": 5e5,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": "low",
				"medium": "medium",
				"high": "high",
				"xhigh": null,
				"max": null
			}
		}
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/opencode-go.models.js
const OPENCODE_GO_MODELS = flattenModelCatalog("opencode-go", {
	"anthropic-messages": {
		"minimax-m3": {
			"id": "minimax-m3",
			"name": "MiniMax-M3",
			"api": "anthropic-messages",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .3,
				"output": 1.2,
				"cacheRead": .06,
				"cacheWrite": 0
			},
			"contextWindow": 1e6,
			"maxTokens": 131072
		},
		"qwen3.7-max": {
			"id": "qwen3.7-max",
			"name": "Qwen3.7 Max",
			"api": "anthropic-messages",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 2.5,
				"output": 7.5,
				"cacheRead": .5,
				"cacheWrite": 3.125
			},
			"contextWindow": 1e6,
			"maxTokens": 65536
		},
		"qwen3.7-plus": {
			"id": "qwen3.7-plus",
			"name": "Qwen3.7 Plus",
			"api": "anthropic-messages",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .4,
				"output": 1.6,
				"cacheRead": .04,
				"cacheWrite": .5
			},
			"contextWindow": 1e6,
			"maxTokens": 65536
		}
	},
	"openai-completions": {
		"deepseek-v4-flash": {
			"id": "deepseek-v4-flash",
			"name": "DeepSeek V4 Flash",
			"api": "openai-completions",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .14,
				"output": .28,
				"cacheRead": .0028,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens",
				"requiresReasoningContentOnAssistantMessages": true,
				"thinkingFormat": "deepseek"
			},
			"contextWindow": 1e6,
			"maxTokens": 384e3,
			"thinkingLevelMap": {
				"minimal": null,
				"low": null,
				"medium": null,
				"high": "high",
				"max": "max"
			}
		},
		"deepseek-v4-pro": {
			"id": "deepseek-v4-pro",
			"name": "DeepSeek V4 Pro",
			"api": "openai-completions",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .435,
				"output": .87,
				"cacheRead": .003625,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens",
				"requiresReasoningContentOnAssistantMessages": true,
				"thinkingFormat": "deepseek"
			},
			"contextWindow": 1e6,
			"maxTokens": 384e3,
			"thinkingLevelMap": {
				"minimal": null,
				"low": null,
				"medium": null,
				"high": "high",
				"max": "max"
			}
		},
		"glm-5.1": {
			"id": "glm-5.1",
			"name": "GLM-5.1",
			"api": "openai-completions",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 1.4,
				"output": 4.4,
				"cacheRead": .26,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 202752,
			"maxTokens": 32768
		},
		"glm-5.2": {
			"id": "glm-5.2",
			"name": "GLM-5.2",
			"api": "openai-completions",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": 1.4,
				"output": 4.4,
				"cacheRead": .26,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 1e6,
			"maxTokens": 131072,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": null,
				"medium": null,
				"high": "high",
				"xhigh": null,
				"max": "max"
			}
		},
		"hy3": {
			"id": "hy3",
			"name": "Hy3",
			"api": "openai-completions",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .14,
				"output": .58,
				"cacheRead": .035,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 256e3,
			"maxTokens": 64e3,
			"thinkingLevelMap": {
				"off": "none",
				"minimal": null,
				"low": "low",
				"medium": null,
				"high": "high",
				"xhigh": null,
				"max": null
			}
		},
		"kimi-k2.6": {
			"id": "kimi-k2.6",
			"name": "Kimi K2.6",
			"api": "openai-completions",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .95,
				"output": 4,
				"cacheRead": .16,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"thinkingFormat": "deepseek",
				"supportsReasoningEffort": false,
				"maxTokensField": "max_tokens",
				"supportsLongCacheRetention": false
			},
			"contextWindow": 262144,
			"maxTokens": 65536,
			"thinkingLevelMap": {
				"minimal": null,
				"low": null,
				"medium": null
			}
		},
		"kimi-k2.7-code": {
			"id": "kimi-k2.7-code",
			"name": "Kimi K2.7 Code",
			"api": "openai-completions",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .95,
				"output": 4,
				"cacheRead": .19,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 262144,
			"maxTokens": 262144
		},
		"kimi-k3": {
			"id": "kimi-k3",
			"name": "Kimi K3 (2x usage)",
			"api": "openai-completions",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 3,
				"output": 15,
				"cacheRead": .3,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 1048576,
			"maxTokens": 131072,
			"thinkingLevelMap": {
				"off": null,
				"minimal": null,
				"low": null,
				"medium": null,
				"high": null,
				"xhigh": null,
				"max": "max"
			}
		},
		"mimo-v2.5": {
			"id": "mimo-v2.5",
			"name": "MiMo V2.5",
			"api": "openai-completions",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .14,
				"output": .28,
				"cacheRead": .0028,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 1e6,
			"maxTokens": 128e3
		},
		"mimo-v2.5-pro": {
			"id": "mimo-v2.5-pro",
			"name": "MiMo V2.5 Pro",
			"api": "openai-completions",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .435,
				"output": .87,
				"cacheRead": .003625,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 1048576,
			"maxTokens": 128e3
		},
		"minimax-m2.7": {
			"id": "minimax-m2.7",
			"name": "MiniMax-M2.7",
			"api": "openai-completions",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go/v1",
			"reasoning": true,
			"input": ["text"],
			"cost": {
				"input": .3,
				"output": 1.2,
				"cacheRead": .06,
				"cacheWrite": 0
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 204800,
			"maxTokens": 131072
		},
		"qwen3.6-plus": {
			"id": "qwen3.6-plus",
			"name": "Qwen3.6 Plus",
			"api": "openai-completions",
			"provider": "opencode-go",
			"baseUrl": "https://opencode.ai/zen/go/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": .5,
				"output": 3,
				"cacheRead": .05,
				"cacheWrite": .625
			},
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"thinkingFormat": "qwen",
				"maxTokensField": "max_tokens"
			},
			"contextWindow": 1e6,
			"maxTokens": 65536
		}
	},
	"openai-responses": { "grok-4.5": {
		"id": "grok-4.5",
		"name": "Grok 4.5",
		"api": "openai-responses",
		"provider": "opencode-go",
		"baseUrl": "https://opencode.ai/zen/go/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 6,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"compat": { "sessionAffinityFormat": "openai-nosession" },
		"contextWindow": 5e5,
		"maxTokens": 5e5,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	} }
});
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/openrouter.models.js
const OPENROUTER_MODELS = flattenModelCatalog("openrouter", { "openai-completions": {
	"ai21/jamba-large-1.7": {
		"id": "ai21/jamba-large-1.7",
		"name": "AI21: Jamba Large 1.7",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 2,
			"output": 8,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"aion-labs/aion-2.0": {
		"id": "aion-labs/aion-2.0",
		"name": "AionLabs: Aion-2.0",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .8,
			"output": 1.6,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"aion-labs/aion-3.0": {
		"id": "aion-labs/aion-3.0",
		"name": "AionLabs: Aion-3.0",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 3,
			"output": 6,
			"cacheRead": .75,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"aion-labs/aion-3.0-mini": {
		"id": "aion-labs/aion-3.0-mini",
		"name": "AionLabs: Aion-3.0-Mini",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .7,
			"output": 1.4,
			"cacheRead": .18,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"amazon/nova-2-lite-v1": {
		"id": "amazon/nova-2-lite-v1",
		"name": "Amazon: Nova 2 Lite",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 2.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65535,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"amazon/nova-lite-v1": {
		"id": "amazon/nova-lite-v1",
		"name": "Amazon: Nova Lite 1.0",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .06,
			"output": .24,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 3e5,
		"maxTokens": 5120,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"amazon/nova-micro-v1": {
		"id": "amazon/nova-micro-v1",
		"name": "Amazon: Nova Micro 1.0",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .035,
			"output": .14,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 5120,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"amazon/nova-premier-v1": {
		"id": "amazon/nova-premier-v1",
		"name": "Amazon: Nova Premier 1.0",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 12.5,
			"cacheRead": .625,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 32e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"amazon/nova-pro-v1": {
		"id": "amazon/nova-pro-v1",
		"name": "Amazon: Nova Pro 1.0",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .8,
			"output": 3.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 3e5,
		"maxTokens": 5120,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"anthropic/claude-3-haiku": {
		"id": "anthropic/claude-3-haiku",
		"name": "Anthropic: Claude 3 Haiku",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 1.25,
			"cacheRead": .03,
			"cacheWrite": .3
		},
		"contextWindow": 2e5,
		"maxTokens": 4096,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		}
	},
	"anthropic/claude-fable-5": {
		"id": "anthropic/claude-fable-5",
		"name": "Anthropic: Claude Fable 5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 50,
			"cacheRead": 1,
			"cacheWrite": 12.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		},
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"anthropic/claude-haiku-4.5": {
		"id": "anthropic/claude-haiku-4.5",
		"name": "Anthropic: Claude Haiku 4.5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 5,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		}
	},
	"anthropic/claude-opus-4": {
		"id": "anthropic/claude-opus-4",
		"name": "Anthropic: Claude Opus 4",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 75,
			"cacheRead": 1.5,
			"cacheWrite": 18.75
		},
		"contextWindow": 2e5,
		"maxTokens": 32e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		}
	},
	"anthropic/claude-opus-4.1": {
		"id": "anthropic/claude-opus-4.1",
		"name": "Anthropic: Claude Opus 4.1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 75,
			"cacheRead": 1.5,
			"cacheWrite": 18.75
		},
		"contextWindow": 2e5,
		"maxTokens": 32e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		}
	},
	"anthropic/claude-opus-4.5": {
		"id": "anthropic/claude-opus-4.5",
		"name": "Anthropic: Claude Opus 4.5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		}
	},
	"anthropic/claude-opus-4.6": {
		"id": "anthropic/claude-opus-4.6",
		"name": "Anthropic: Claude Opus 4.6",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		},
		"thinkingLevelMap": { "max": "max" }
	},
	"anthropic/claude-opus-4.7": {
		"id": "anthropic/claude-opus-4.7",
		"name": "Anthropic: Claude Opus 4.7",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		},
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"anthropic/claude-opus-4.7-fast": {
		"id": "anthropic/claude-opus-4.7-fast",
		"name": "Anthropic: Claude Opus 4.7 (Fast)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 30,
			"output": 150,
			"cacheRead": 3,
			"cacheWrite": 37.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		},
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"anthropic/claude-opus-4.8": {
		"id": "anthropic/claude-opus-4.8",
		"name": "Anthropic: Claude Opus 4.8",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		},
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"anthropic/claude-opus-4.8-fast": {
		"id": "anthropic/claude-opus-4.8-fast",
		"name": "Anthropic: Claude Opus 4.8 (Fast)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 50,
			"cacheRead": 1,
			"cacheWrite": 12.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		},
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"anthropic/claude-opus-5": {
		"id": "anthropic/claude-opus-5",
		"name": "Claude Opus 5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		},
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"anthropic/claude-opus-5-fast": {
		"id": "anthropic/claude-opus-5-fast",
		"name": "Claude Opus 5 (Fast)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 50,
			"cacheRead": 1,
			"cacheWrite": 12.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		},
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"anthropic/claude-sonnet-4": {
		"id": "anthropic/claude-sonnet-4",
		"name": "Anthropic: Claude Sonnet 4",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		}
	},
	"anthropic/claude-sonnet-4.5": {
		"id": "anthropic/claude-sonnet-4.5",
		"name": "Anthropic: Claude Sonnet 4.5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		}
	},
	"anthropic/claude-sonnet-4.6": {
		"id": "anthropic/claude-sonnet-4.6",
		"name": "Anthropic: Claude Sonnet 4.6",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		},
		"thinkingLevelMap": { "max": "max" }
	},
	"anthropic/claude-sonnet-5": {
		"id": "anthropic/claude-sonnet-5",
		"name": "Anthropic: Claude Sonnet 5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 10,
			"cacheRead": .2,
			"cacheWrite": 2.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		},
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"arcee-ai/trinity-large-thinking": {
		"id": "arcee-ai/trinity-large-thinking",
		"name": "Arcee AI: Trinity Large Thinking",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .22,
			"output": .85,
			"cacheRead": .06,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"arcee-ai/virtuoso-large": {
		"id": "arcee-ai/virtuoso-large",
		"name": "Arcee AI: Virtuoso Large",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .75,
			"output": 1.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 64e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"auto": {
		"id": "auto",
		"name": "Auto",
		"api": "openai-completions",
		"provider": "openrouter",
		"baseUrl": "https://openrouter.ai/api/v1",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 2e6,
		"maxTokens": 3e4,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"bytedance-seed/seed-1.6": {
		"id": "bytedance-seed/seed-1.6",
		"name": "ByteDance Seed: Seed 1.6",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"bytedance-seed/seed-1.6-flash": {
		"id": "bytedance-seed/seed-1.6-flash",
		"name": "ByteDance Seed: Seed 1.6 Flash",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .075,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"bytedance-seed/seed-2.0-lite": {
		"id": "bytedance-seed/seed-2.0-lite",
		"name": "ByteDance Seed: Seed-2.0-Lite",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"bytedance-seed/seed-2.0-mini": {
		"id": "bytedance-seed/seed-2.0-mini",
		"name": "ByteDance Seed: Seed-2.0-Mini",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"cohere/command-r-08-2024": {
		"id": "cohere/command-r-08-2024",
		"name": "Cohere: Command R (08-2024)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"cohere/command-r-plus-08-2024": {
		"id": "cohere/command-r-plus-08-2024",
		"name": "Cohere: Command R+ (08-2024)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"cohere/north-mini-code:free": {
		"id": "cohere/north-mini-code:free",
		"name": "Cohere: North Mini Code (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 64e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"deepseek/deepseek-chat": {
		"id": "deepseek/deepseek-chat",
		"name": "DeepSeek: DeepSeek V3",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .2002,
			"output": .8001,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"deepseek/deepseek-chat-v3-0324": {
		"id": "deepseek/deepseek-chat-v3-0324",
		"name": "DeepSeek: DeepSeek V3 0324",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .27,
			"output": 1.12,
			"cacheRead": .135,
			"cacheWrite": 0
		},
		"contextWindow": 163840,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"deepseek/deepseek-chat-v3.1": {
		"id": "deepseek/deepseek-chat-v3.1",
		"name": "DeepSeek: DeepSeek V3.1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .25,
			"output": .95,
			"cacheRead": .13,
			"cacheWrite": 0
		},
		"contextWindow": 163840,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"deepseek/deepseek-r1": {
		"id": "deepseek/deepseek-r1",
		"name": "DeepSeek: R1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .7,
			"output": 2.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 64e3,
		"maxTokens": 16e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"deepseek/deepseek-r1-0528": {
		"id": "deepseek/deepseek-r1-0528",
		"name": "DeepSeek: R1 0528",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .5,
			"output": 2.15,
			"cacheRead": .35,
			"cacheWrite": 0
		},
		"contextWindow": 163840,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"deepseek/deepseek-v3.1-terminus": {
		"id": "deepseek/deepseek-v3.1-terminus",
		"name": "DeepSeek: DeepSeek V3.1 Terminus",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .27,
			"output": 1,
			"cacheRead": .135,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"deepseek/deepseek-v3.2": {
		"id": "deepseek/deepseek-v3.2",
		"name": "DeepSeek: DeepSeek V3.2",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .269,
			"output": .4,
			"cacheRead": .1345,
			"cacheWrite": 0
		},
		"contextWindow": 163840,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"deepseek/deepseek-v3.2-exp": {
		"id": "deepseek/deepseek-v3.2-exp",
		"name": "DeepSeek: DeepSeek V3.2 Exp",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .27,
			"output": .41,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 163840,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"deepseek/deepseek-v4-flash": {
		"id": "deepseek/deepseek-v4-flash",
		"name": "DeepSeek: DeepSeek V4 Flash",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .0938,
			"output": .1876,
			"cacheRead": .01876,
			"cacheWrite": 0
		},
		"contextWindow": 1048575,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter",
			"requiresReasoningContentOnAssistantMessages": true
		},
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null,
			"high": "high",
			"max": null,
			"xhigh": "xhigh"
		}
	},
	"deepseek/deepseek-v4-pro": {
		"id": "deepseek/deepseek-v4-pro",
		"name": "DeepSeek: DeepSeek V4 Pro",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .435,
			"output": .87,
			"cacheRead": .003625,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 384e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter",
			"requiresReasoningContentOnAssistantMessages": true
		},
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null,
			"high": "high",
			"max": null,
			"xhigh": "xhigh"
		}
	},
	"google/gemini-2.5-flash": {
		"id": "google/gemini-2.5-flash",
		"name": "Google: Gemini 2.5 Flash",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 2.5,
			"cacheRead": .03,
			"cacheWrite": .083333
		},
		"contextWindow": 1048576,
		"maxTokens": 65535,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemini-2.5-flash-lite": {
		"id": "google/gemini-2.5-flash-lite",
		"name": "Google: Gemini 2.5 Flash Lite",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .4,
			"cacheRead": .01,
			"cacheWrite": .083333
		},
		"contextWindow": 1048576,
		"maxTokens": 65535,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemini-2.5-pro": {
		"id": "google/gemini-2.5-pro",
		"name": "Google: Gemini 2.5 Pro",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": .375
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemini-2.5-pro-preview": {
		"id": "google/gemini-2.5-pro-preview",
		"name": "Google: Gemini 2.5 Pro Preview 06-05",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": .375
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemini-2.5-pro-preview-05-06": {
		"id": "google/gemini-2.5-pro-preview-05-06",
		"name": "Google: Gemini 2.5 Pro Preview 05-06",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": .375
		},
		"contextWindow": 1048576,
		"maxTokens": 65535,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemini-3-flash-preview": {
		"id": "google/gemini-3-flash-preview",
		"name": "Google: Gemini 3 Flash Preview",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .5,
			"output": 3,
			"cacheRead": .05,
			"cacheWrite": .083333
		},
		"contextWindow": 1048576,
		"maxTokens": 65535,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemini-3-pro-image": {
		"id": "google/gemini-3-pro-image",
		"name": "Google: Nano Banana Pro (Gemini 3 Pro Image)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 12,
			"cacheRead": .2,
			"cacheWrite": .375
		},
		"contextWindow": 65536,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemini-3.1-flash-lite": {
		"id": "google/gemini-3.1-flash-lite",
		"name": "Google: Gemini 3.1 Flash Lite",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 1.5,
			"cacheRead": .025,
			"cacheWrite": .083333
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemini-3.1-flash-lite-preview": {
		"id": "google/gemini-3.1-flash-lite-preview",
		"name": "Google: Gemini 3.1 Flash Lite Preview",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 1.5,
			"cacheRead": .025,
			"cacheWrite": .083333
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemini-3.1-pro-preview": {
		"id": "google/gemini-3.1-pro-preview",
		"name": "Google: Gemini 3.1 Pro Preview",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 12,
			"cacheRead": .2,
			"cacheWrite": .375
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemini-3.1-pro-preview-customtools": {
		"id": "google/gemini-3.1-pro-preview-customtools",
		"name": "Google: Gemini 3.1 Pro Preview Custom Tools",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 12,
			"cacheRead": .2,
			"cacheWrite": .375
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemini-3.5-flash": {
		"id": "google/gemini-3.5-flash",
		"name": "Google: Gemini 3.5 Flash",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 9,
			"cacheRead": .15,
			"cacheWrite": .083333
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemini-3.5-flash-lite": {
		"id": "google/gemini-3.5-flash-lite",
		"name": "Google: Gemini 3.5 Flash Lite",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 2.5,
			"cacheRead": .03,
			"cacheWrite": .083333
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemini-3.6-flash": {
		"id": "google/gemini-3.6-flash",
		"name": "Google: Gemini 3.6 Flash",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 7.5,
			"cacheRead": .15,
			"cacheWrite": .083333
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemma-3-12b-it": {
		"id": "google/gemma-3-12b-it",
		"name": "Google: Gemma 3 12B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .05,
			"output": .15,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemma-3-27b-it": {
		"id": "google/gemma-3-27b-it",
		"name": "Google: Gemma 3 27B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .08,
			"output": .45,
			"cacheRead": .04,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemma-4-26b-a4b-it": {
		"id": "google/gemma-4-26b-a4b-it",
		"name": "Google: Gemma 4 26B A4B ",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .12,
			"output": .35,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemma-4-26b-a4b-it:free": {
		"id": "google/gemma-4-26b-a4b-it:free",
		"name": "Google: Gemma 4 26B A4B  (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemma-4-31b-it": {
		"id": "google/gemma-4-31b-it",
		"name": "Google: Gemma 4 31B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .14,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"google/gemma-4-31b-it:free": {
		"id": "google/gemma-4-31b-it:free",
		"name": "Google: Gemma 4 31B (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"ibm-granite/granite-4.1-8b": {
		"id": "ibm-granite/granite-4.1-8b",
		"name": "IBM: Granite 4.1 8B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .05,
			"output": .1,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"inception/mercury-2": {
		"id": "inception/mercury-2",
		"name": "Inception: Mercury 2",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .25,
			"output": .75,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 5e4,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		},
		"thinkingLevelMap": { "off": null }
	},
	"inclusionai/ling-2.6-1t": {
		"id": "inclusionai/ling-2.6-1t",
		"name": "inclusionAI: Ling-2.6-1T",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .075,
			"output": .625,
			"cacheRead": .015,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"inclusionai/ling-2.6-flash": {
		"id": "inclusionai/ling-2.6-flash",
		"name": "inclusionAI: Ling-2.6-flash",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .01,
			"output": .03,
			"cacheRead": .002,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"inclusionai/ling-3.0-flash:free": {
		"id": "inclusionai/ling-3.0-flash:free",
		"name": "Ling-3.0-flash (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"inclusionai/ring-2.6-1t": {
		"id": "inclusionai/ring-2.6-1t",
		"name": "inclusionAI: Ring-2.6-1T",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .075,
			"output": .625,
			"cacheRead": .015,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"kwaipilot/kat-coder-air-v2.5": {
		"id": "kwaipilot/kat-coder-air-v2.5",
		"name": "Kwaipilot: KAT-Coder-Air V2.5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 8e4,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"kwaipilot/kat-coder-pro-v2": {
		"id": "kwaipilot/kat-coder-pro-v2",
		"name": "Kwaipilot: KAT-Coder-Pro V2",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .06,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 8e4,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"kwaipilot/kat-coder-pro-v2.5": {
		"id": "kwaipilot/kat-coder-pro-v2.5",
		"name": "Kwaipilot: KAT-Coder-Pro V2.5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .74,
			"output": 2.96,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 8e4,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"meituan/longcat-2.0": {
		"id": "meituan/longcat-2.0",
		"name": "Meituan: LongCat 2.0",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .006,
			"cacheWrite": 0
		},
		"contextWindow": 1048756,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"meta-llama/llama-3.1-70b-instruct": {
		"id": "meta-llama/llama-3.1-70b-instruct",
		"name": "Meta: Llama 3.1 70B Instruct",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .4,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"meta-llama/llama-3.1-8b-instruct": {
		"id": "meta-llama/llama-3.1-8b-instruct",
		"name": "Meta: Llama 3.1 8B Instruct",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .05,
			"output": .08,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"meta-llama/llama-3.3-70b-instruct": {
		"id": "meta-llama/llama-3.3-70b-instruct",
		"name": "Meta: Llama 3.3 70B Instruct",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .13,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 128e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"meta-llama/llama-4-maverick": {
		"id": "meta-llama/llama-4-maverick",
		"name": "Meta: Llama 4 Maverick",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": .8,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"meta-llama/llama-4-scout": {
		"id": "meta-llama/llama-4-scout",
		"name": "Meta: Llama 4 Scout",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 327680,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"meta/muse-spark-1.1": {
		"id": "meta/muse-spark-1.1",
		"name": "Meta: Muse Spark 1.1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 4.25,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"minimax/minimax-m1": {
		"id": "minimax/minimax-m1",
		"name": "MiniMax: MiniMax M1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .55,
			"output": 2.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 4e4,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"minimax/minimax-m2": {
		"id": "minimax/minimax-m2",
		"name": "MiniMax: MiniMax M2",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .255,
			"output": 1.02,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 204800,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"minimax/minimax-m2.1": {
		"id": "minimax/minimax-m2.1",
		"name": "MiniMax: MiniMax M2.1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 204800,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"minimax/minimax-m2.5": {
		"id": "minimax/minimax-m2.5",
		"name": "MiniMax: MiniMax M2.5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .9,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 196608,
		"maxTokens": 196608,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"minimax/minimax-m2.7": {
		"id": "minimax/minimax-m2.7",
		"name": "MiniMax: MiniMax M2.7",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .25,
			"output": 1,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 196608,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"minimax/minimax-m3": {
		"id": "minimax/minimax-m3",
		"name": "MiniMax: MiniMax M3",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .06,
			"cacheWrite": 0
		},
		"contextWindow": 524288,
		"maxTokens": 512e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/codestral-2508": {
		"id": "mistralai/codestral-2508",
		"name": "Mistral: Codestral 2508",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": .9,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/devstral-2512": {
		"id": "mistralai/devstral-2512",
		"name": "Mistral: Devstral 2 2512",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .4,
			"output": 2,
			"cacheRead": .04,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/ministral-14b-2512": {
		"id": "mistralai/ministral-14b-2512",
		"name": "Mistral: Ministral 3 14B 2512",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": .2,
			"cacheRead": .02,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/ministral-3b-2512": {
		"id": "mistralai/ministral-3b-2512",
		"name": "Mistral: Ministral 3 3B 2512",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .1,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/ministral-8b-2512": {
		"id": "mistralai/ministral-8b-2512",
		"name": "Mistral: Ministral 3 8B 2512",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .15,
			"cacheRead": .015,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/mistral-large": {
		"id": "mistralai/mistral-large",
		"name": "Mistral Large",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 2,
			"output": 6,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/mistral-large-2407": {
		"id": "mistralai/mistral-large-2407",
		"name": "Mistral Large 2407",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 2,
			"output": 6,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/mistral-large-2512": {
		"id": "mistralai/mistral-large-2512",
		"name": "Mistral: Mistral Large 3 2512",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .5,
			"output": 1.5,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/mistral-medium-3": {
		"id": "mistralai/mistral-medium-3",
		"name": "Mistral: Mistral Medium 3",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 2,
			"cacheRead": .04,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/mistral-medium-3-5": {
		"id": "mistralai/mistral-medium-3-5",
		"name": "Mistral: Mistral Medium 3.5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 7.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/mistral-medium-3.1": {
		"id": "mistralai/mistral-medium-3.1",
		"name": "Mistral: Mistral Medium 3.1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 2,
			"cacheRead": .04,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/mistral-nemo": {
		"id": "mistralai/mistral-nemo",
		"name": "Mistral: Mistral Nemo",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .019,
			"output": .03,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/mistral-saba": {
		"id": "mistralai/mistral-saba",
		"name": "Mistral: Saba",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .2,
			"output": .6,
			"cacheRead": .02,
			"cacheWrite": 0
		},
		"contextWindow": 32768,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/mistral-small-2603": {
		"id": "mistralai/mistral-small-2603",
		"name": "Mistral: Mistral Small 4",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": .015,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/mistral-small-3.2-24b-instruct": {
		"id": "mistralai/mistral-small-3.2-24b-instruct",
		"name": "Mistral: Mistral Small 3.2 24B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .3,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/mixtral-8x22b-instruct": {
		"id": "mistralai/mixtral-8x22b-instruct",
		"name": "Mistral: Mixtral 8x22B Instruct",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 2,
			"output": 6,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 65536,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"mistralai/voxtral-small-24b-2507": {
		"id": "mistralai/voxtral-small-24b-2507",
		"name": "Mistral: Voxtral Small 24B 2507",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": .3,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 32e3,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"moonshotai/kimi-k2": {
		"id": "moonshotai/kimi-k2",
		"name": "MoonshotAI: Kimi K2 0711",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .57,
			"output": 2.3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 100352,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"moonshotai/kimi-k2-0905": {
		"id": "moonshotai/kimi-k2-0905",
		"name": "MoonshotAI: Kimi K2 0905",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 100352,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"moonshotai/kimi-k2-thinking": {
		"id": "moonshotai/kimi-k2-thinking",
		"name": "MoonshotAI: Kimi K2 Thinking",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 100352,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"moonshotai/kimi-k2.5": {
		"id": "moonshotai/kimi-k2.5",
		"name": "MoonshotAI: Kimi K2.5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .41,
			"output": 2.06,
			"cacheRead": .07,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"moonshotai/kimi-k2.6": {
		"id": "moonshotai/kimi-k2.6",
		"name": "MoonshotAI: Kimi K2.6",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .646,
			"output": 2.72,
			"cacheRead": .1088,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter",
			"requiresReasoningContentOnAssistantMessages": true
		}
	},
	"moonshotai/kimi-k2.7-code": {
		"id": "moonshotai/kimi-k2.7-code",
		"name": "MoonshotAI: Kimi K2.7 Code",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .78,
			"output": 3.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"moonshotai/kimi-k3": {
		"id": "moonshotai/kimi-k3",
		"name": "MoonshotAI: Kimi K3",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"nex-agi/nex-n2-mini": {
		"id": "nex-agi/nex-n2-mini",
		"name": "Nex AGI: Nex-N2-Mini",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .025,
			"output": .1,
			"cacheRead": .0025,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"nex-agi/nex-n2-pro": {
		"id": "nex-agi/nex-n2-pro",
		"name": "Nex AGI: Nex-N2-Pro",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 1,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"nvidia/nemotron-3-nano-30b-a3b": {
		"id": "nvidia/nemotron-3-nano-30b-a3b",
		"name": "NVIDIA: Nemotron 3 Nano 30B A3B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .05,
			"output": .2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 228e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"nvidia/nemotron-3-nano-30b-a3b:free": {
		"id": "nvidia/nemotron-3-nano-30b-a3b:free",
		"name": "NVIDIA: Nemotron 3 Nano 30B A3B (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free": {
		"id": "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
		"name": "NVIDIA: Nemotron 3 Nano Omni (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"nvidia/nemotron-3-super-120b-a12b": {
		"id": "nvidia/nemotron-3-super-120b-a12b",
		"name": "NVIDIA: Nemotron 3 Super",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .085,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"nvidia/nemotron-3-super-120b-a12b:free": {
		"id": "nvidia/nemotron-3-super-120b-a12b:free",
		"name": "NVIDIA: Nemotron 3 Super (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"nvidia/nemotron-3-ultra-550b-a55b": {
		"id": "nvidia/nemotron-3-ultra-550b-a55b",
		"name": "NVIDIA: Nemotron 3 Ultra",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 3.6,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 512288,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"nvidia/nemotron-3-ultra-550b-a55b:free": {
		"id": "nvidia/nemotron-3-ultra-550b-a55b:free",
		"name": "NVIDIA: Nemotron 3 Ultra (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"nvidia/nemotron-nano-12b-v2-vl:free": {
		"id": "nvidia/nemotron-nano-12b-v2-vl:free",
		"name": "NVIDIA: Nemotron Nano 12B 2 VL (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"nvidia/nemotron-nano-9b-v2:free": {
		"id": "nvidia/nemotron-nano-9b-v2:free",
		"name": "NVIDIA: Nemotron Nano 9B V2 (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"openai/gpt-3.5-turbo": {
		"id": "openai/gpt-3.5-turbo",
		"name": "OpenAI: GPT-3.5 Turbo",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .5,
			"output": 1.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 16385,
		"maxTokens": 4096,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-3.5-turbo-0613": {
		"id": "openai/gpt-3.5-turbo-0613",
		"name": "OpenAI: GPT-3.5 Turbo (older v0613)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 1,
			"output": 2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 4095,
		"maxTokens": 4096,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-3.5-turbo-16k": {
		"id": "openai/gpt-3.5-turbo-16k",
		"name": "OpenAI: GPT-3.5 Turbo 16k",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 3,
			"output": 4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 16385,
		"maxTokens": 4096,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-4": {
		"id": "openai/gpt-4",
		"name": "OpenAI: GPT-4",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 30,
			"output": 60,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 8191,
		"maxTokens": 4096,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-4-turbo": {
		"id": "openai/gpt-4-turbo",
		"name": "OpenAI: GPT-4 Turbo",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 30,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-4-turbo-preview": {
		"id": "openai/gpt-4-turbo-preview",
		"name": "OpenAI: GPT-4 Turbo Preview",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 10,
			"output": 30,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-4.1": {
		"id": "openai/gpt-4.1",
		"name": "OpenAI: GPT-4.1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 8,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 1047576,
		"maxTokens": 32768,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-4.1-mini": {
		"id": "openai/gpt-4.1-mini",
		"name": "OpenAI: GPT-4.1 Mini",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 1.6,
			"cacheRead": .1,
			"cacheWrite": 0
		},
		"contextWindow": 1047576,
		"maxTokens": 32768,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-4.1-nano": {
		"id": "openai/gpt-4.1-nano",
		"name": "OpenAI: GPT-4.1 Nano",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .4,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 1047576,
		"maxTokens": 32768,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-4o": {
		"id": "openai/gpt-4o",
		"name": "OpenAI: GPT-4o",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 1.25,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-4o-2024-05-13": {
		"id": "openai/gpt-4o-2024-05-13",
		"name": "OpenAI: GPT-4o (2024-05-13)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 15,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-4o-2024-08-06": {
		"id": "openai/gpt-4o-2024-08-06",
		"name": "OpenAI: GPT-4o (2024-08-06)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 1.25,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-4o-2024-11-20": {
		"id": "openai/gpt-4o-2024-11-20",
		"name": "OpenAI: GPT-4o (2024-11-20)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 1.25,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-4o-mini": {
		"id": "openai/gpt-4o-mini",
		"name": "OpenAI: GPT-4o-mini",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": .075,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-4o-mini-2024-07-18": {
		"id": "openai/gpt-4o-mini-2024-07-18",
		"name": "OpenAI: GPT-4o-mini (2024-07-18)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": .075,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-5": {
		"id": "openai/gpt-5",
		"name": "OpenAI: GPT-5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-5-codex": {
		"id": "openai/gpt-5-codex",
		"name": "OpenAI: GPT-5 Codex",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-5-mini": {
		"id": "openai/gpt-5-mini",
		"name": "OpenAI: GPT-5 Mini",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 2,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-5-nano": {
		"id": "openai/gpt-5-nano",
		"name": "OpenAI: GPT-5 Nano",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .05,
			"output": .4,
			"cacheRead": .005,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-5-pro": {
		"id": "openai/gpt-5-pro",
		"name": "OpenAI: GPT-5 Pro",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 120,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-5.1": {
		"id": "openai/gpt-5.1",
		"name": "OpenAI: GPT-5.1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-5.1-chat": {
		"id": "openai/gpt-5.1-chat",
		"name": "OpenAI: GPT-5.1 Chat",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-5.1-codex": {
		"id": "openai/gpt-5.1-codex",
		"name": "OpenAI: GPT-5.1-Codex",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-5.1-codex-max": {
		"id": "openai/gpt-5.1-codex-max",
		"name": "OpenAI: GPT-5.1-Codex-Max",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-5.1-codex-mini": {
		"id": "openai/gpt-5.1-codex-mini",
		"name": "OpenAI: GPT-5.1-Codex-Mini",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 2,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 1e5,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-5.2": {
		"id": "openai/gpt-5.2",
		"name": "OpenAI: GPT-5.2",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.2-chat": {
		"id": "openai/gpt-5.2-chat",
		"name": "OpenAI: GPT-5.2 Chat",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.2-codex": {
		"id": "openai/gpt-5.2-codex",
		"name": "OpenAI: GPT-5.2-Codex",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.2-pro": {
		"id": "openai/gpt-5.2-pro",
		"name": "OpenAI: GPT-5.2 Pro",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 21,
			"output": 168,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.3-chat": {
		"id": "openai/gpt-5.3-chat",
		"name": "OpenAI: GPT-5.3 Chat",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.3-codex": {
		"id": "openai/gpt-5.3-codex",
		"name": "OpenAI: GPT-5.3-Codex",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.4": {
		"id": "openai/gpt-5.4",
		"name": "OpenAI: GPT-5.4",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 15,
			"cacheRead": .25,
			"cacheWrite": 0
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.4-mini": {
		"id": "openai/gpt-5.4-mini",
		"name": "OpenAI: GPT-5.4 Mini",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .75,
			"output": 4.5,
			"cacheRead": .075,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.4-nano": {
		"id": "openai/gpt-5.4-nano",
		"name": "OpenAI: GPT-5.4 Nano",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": 1.25,
			"cacheRead": .02,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.4-pro": {
		"id": "openai/gpt-5.4-pro",
		"name": "OpenAI: GPT-5.4 Pro",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 30,
			"output": 180,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.5": {
		"id": "openai/gpt-5.5",
		"name": "OpenAI: GPT-5.5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.5-pro": {
		"id": "openai/gpt-5.5-pro",
		"name": "OpenAI: GPT-5.5 Pro",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 30,
			"output": 180,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"off": null,
			"minimal": null,
			"low": null
		}
	},
	"openai/gpt-5.6-luna": {
		"id": "openai/gpt-5.6-luna",
		"name": "OpenAI: GPT-5.6 Luna",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 6,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"openai/gpt-5.6-luna-pro": {
		"id": "openai/gpt-5.6-luna-pro",
		"name": "OpenAI: GPT-5.6 Luna Pro",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 6,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"openai/gpt-5.6-sol": {
		"id": "openai/gpt-5.6-sol",
		"name": "OpenAI: GPT-5.6 Sol",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"openai/gpt-5.6-sol-pro": {
		"id": "openai/gpt-5.6-sol-pro",
		"name": "OpenAI: GPT-5.6 Sol Pro",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"openai/gpt-5.6-terra": {
		"id": "openai/gpt-5.6-terra",
		"name": "OpenAI: GPT-5.6 Terra",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 15,
			"cacheRead": .25,
			"cacheWrite": 3.125
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"openai/gpt-5.6-terra-pro": {
		"id": "openai/gpt-5.6-terra-pro",
		"name": "OpenAI: GPT-5.6 Terra Pro",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 15,
			"cacheRead": .25,
			"cacheWrite": 3.125
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" },
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		}
	},
	"openai/gpt-audio": {
		"id": "openai/gpt-audio",
		"name": "OpenAI: GPT Audio",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-audio-mini": {
		"id": "openai/gpt-audio-mini",
		"name": "OpenAI: GPT Audio Mini",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-chat-latest": {
		"id": "openai/gpt-chat-latest",
		"name": "OpenAI: GPT Chat Latest",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-oss-120b": {
		"id": "openai/gpt-oss-120b",
		"name": "OpenAI: gpt-oss-120b",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .037,
			"output": .17,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-oss-20b": {
		"id": "openai/gpt-oss-20b",
		"name": "OpenAI: gpt-oss-20b",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .03,
			"output": .13,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-oss-20b:free": {
		"id": "openai/gpt-oss-20b:free",
		"name": "OpenAI: gpt-oss-20b (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/gpt-oss-safeguard-20b": {
		"id": "openai/gpt-oss-safeguard-20b",
		"name": "OpenAI: gpt-oss-safeguard-20b",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .075,
			"output": .3,
			"cacheRead": .0375,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/o1": {
		"id": "openai/o1",
		"name": "OpenAI: o1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 60,
			"cacheRead": 7.5,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/o3": {
		"id": "openai/o3",
		"name": "OpenAI: o3",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 8,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/o3-deep-research": {
		"id": "openai/o3-deep-research",
		"name": "OpenAI: o3 Deep Research",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 40,
			"cacheRead": 2.5,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/o3-mini": {
		"id": "openai/o3-mini",
		"name": "OpenAI: o3 Mini",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.1,
			"output": 4.4,
			"cacheRead": .55,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/o3-mini-high": {
		"id": "openai/o3-mini-high",
		"name": "OpenAI: o3 Mini High",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.1,
			"output": 4.4,
			"cacheRead": .55,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/o3-pro": {
		"id": "openai/o3-pro",
		"name": "OpenAI: o3 Pro",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 20,
			"output": 80,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/o4-mini": {
		"id": "openai/o4-mini",
		"name": "OpenAI: o4 Mini",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.1,
			"output": 4.4,
			"cacheRead": .275,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/o4-mini-deep-research": {
		"id": "openai/o4-mini-deep-research",
		"name": "OpenAI: o4 Mini Deep Research",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 8,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openai/o4-mini-high": {
		"id": "openai/o4-mini-high",
		"name": "OpenAI: o4 Mini High",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.1,
			"output": 4.4,
			"cacheRead": .275,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5,
		"compat": { "thinkingFormat": "openrouter" }
	},
	"openrouter/auto": {
		"id": "openrouter/auto",
		"name": "Auto Router",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": -1e6,
			"output": -1e6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 2e6,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"openrouter/auto-beta": {
		"id": "openrouter/auto-beta",
		"name": "Auto Router (Beta)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": -1e6,
			"output": -1e6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 2e6,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"openrouter/free": {
		"id": "openrouter/free",
		"name": "Free Models Router",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"openrouter/fusion": {
		"id": "openrouter/fusion",
		"name": "OpenRouter: Fusion",
		"api": "openai-completions",
		"provider": "openrouter",
		"baseUrl": "https://openrouter.ai/api/v1",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 3e4,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"poolside/laguna-m.1": {
		"id": "poolside/laguna-m.1",
		"name": "Poolside: Laguna M.1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .2,
			"output": .4,
			"cacheRead": .1,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"poolside/laguna-m.1:free": {
		"id": "poolside/laguna-m.1:free",
		"name": "Poolside: Laguna M.1 (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"poolside/laguna-s-2.1": {
		"id": "poolside/laguna-s-2.1",
		"name": "Poolside: Laguna S 2.1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": .2,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"poolside/laguna-s-2.1:free": {
		"id": "poolside/laguna-s-2.1:free",
		"name": "Poolside: Laguna S 2.1 (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"poolside/laguna-xs-2.1": {
		"id": "poolside/laguna-xs-2.1",
		"name": "Poolside: Laguna XS 2.1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .06,
			"output": .12,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"poolside/laguna-xs-2.1:free": {
		"id": "poolside/laguna-xs-2.1:free",
		"name": "Poolside: Laguna XS 2.1 (free)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen-2.5-72b-instruct": {
		"id": "qwen/qwen-2.5-72b-instruct",
		"name": "Qwen2.5 72B Instruct",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .36,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 32768,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen-2.5-7b-instruct": {
		"id": "qwen/qwen-2.5-7b-instruct",
		"name": "Qwen: Qwen2.5 7B Instruct",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .04,
			"output": .1,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 32768,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen-plus": {
		"id": "qwen/qwen-plus",
		"name": "Qwen: Qwen-Plus",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .26,
			"output": .78,
			"cacheRead": .052,
			"cacheWrite": .325
		},
		"contextWindow": 1e6,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen-plus-2025-07-28": {
		"id": "qwen/qwen-plus-2025-07-28",
		"name": "Qwen: Qwen Plus 0728",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .26,
			"output": .78,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen-plus-2025-07-28:thinking": {
		"id": "qwen/qwen-plus-2025-07-28:thinking",
		"name": "Qwen: Qwen Plus 0728 (thinking)",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .26,
			"output": .78,
			"cacheRead": 0,
			"cacheWrite": .325
		},
		"contextWindow": 1e6,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-14b": {
		"id": "qwen/qwen3-14b",
		"name": "Qwen: Qwen3 14B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .2275,
			"output": .91,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 8192,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-235b-a22b": {
		"id": "qwen/qwen3-235b-a22b",
		"name": "Qwen: Qwen3 235B A22B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .455,
			"output": 1.82,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 8192,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-235b-a22b-2507": {
		"id": "qwen/qwen3-235b-a22b-2507",
		"name": "Qwen: Qwen3 235B A22B Instruct 2507",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .09,
			"output": .55,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-235b-a22b-thinking-2507": {
		"id": "qwen/qwen3-235b-a22b-thinking-2507",
		"name": "Qwen: Qwen3 235B A22B Thinking 2507",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-30b-a3b": {
		"id": "qwen/qwen3-30b-a3b",
		"name": "Qwen: Qwen3 30B A3B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .13,
			"output": .52,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 8192,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-30b-a3b-instruct-2507": {
		"id": "qwen/qwen3-30b-a3b-instruct-2507",
		"name": "Qwen: Qwen3 30B A3B Instruct 2507",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-30b-a3b-thinking-2507": {
		"id": "qwen/qwen3-30b-a3b-thinking-2507",
		"name": "Qwen: Qwen3 30B A3B Thinking 2507",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .13,
			"output": 1.56,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 81920,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-32b": {
		"id": "qwen/qwen3-32b",
		"name": "Qwen: Qwen3 32B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .08,
			"output": .28,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 40960,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-8b": {
		"id": "qwen/qwen3-8b",
		"name": "Qwen: Qwen3 8B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .117,
			"output": .455,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 8192,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-coder": {
		"id": "qwen/qwen3-coder",
		"name": "Qwen: Qwen3 Coder 480B A35B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1,
			"cacheRead": .1,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-coder-30b-a3b-instruct": {
		"id": "qwen/qwen3-coder-30b-a3b-instruct",
		"name": "Qwen: Qwen3 Coder 30B A3B Instruct",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .07,
			"output": .27,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 16e4,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-coder-flash": {
		"id": "qwen/qwen3-coder-flash",
		"name": "Qwen: Qwen3 Coder Flash",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .195,
			"output": .975,
			"cacheRead": .039,
			"cacheWrite": .24375
		},
		"contextWindow": 1e6,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-coder-next": {
		"id": "qwen/qwen3-coder-next",
		"name": "Qwen: Qwen3 Coder Next",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .11,
			"output": .8,
			"cacheRead": .07,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-coder-plus": {
		"id": "qwen/qwen3-coder-plus",
		"name": "Qwen: Qwen3 Coder Plus",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .65,
			"output": 3.25,
			"cacheRead": .13,
			"cacheWrite": .8125
		},
		"contextWindow": 1e6,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-max": {
		"id": "qwen/qwen3-max",
		"name": "Qwen: Qwen3 Max",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .78,
			"output": 3.9,
			"cacheRead": .156,
			"cacheWrite": .975
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-max-thinking": {
		"id": "qwen/qwen3-max-thinking",
		"name": "Qwen: Qwen3 Max Thinking",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .78,
			"output": 3.9,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-next-80b-a3b-instruct": {
		"id": "qwen/qwen3-next-80b-a3b-instruct",
		"name": "Qwen: Qwen3 Next 80B A3B Instruct",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": 1.1,
			"cacheRead": .07,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-next-80b-a3b-thinking": {
		"id": "qwen/qwen3-next-80b-a3b-thinking",
		"name": "Qwen: Qwen3 Next 80B A3B Thinking",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .0975,
			"output": .78,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-vl-235b-a22b-instruct": {
		"id": "qwen/qwen3-vl-235b-a22b-instruct",
		"name": "Qwen: Qwen3 VL 235B A22B Instruct",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .21,
			"output": 1.9,
			"cacheRead": .1,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-vl-235b-a22b-thinking": {
		"id": "qwen/qwen3-vl-235b-a22b-thinking",
		"name": "Qwen: Qwen3 VL 235B A22B Thinking",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .26,
			"output": 2.6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-vl-30b-a3b-instruct": {
		"id": "qwen/qwen3-vl-30b-a3b-instruct",
		"name": "Qwen: Qwen3 VL 30B A3B Instruct",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-vl-30b-a3b-thinking": {
		"id": "qwen/qwen3-vl-30b-a3b-thinking",
		"name": "Qwen: Qwen3 VL 30B A3B Thinking",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .13,
			"output": 1.56,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-vl-32b-instruct": {
		"id": "qwen/qwen3-vl-32b-instruct",
		"name": "Qwen: Qwen3 VL 32B Instruct",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .104,
			"output": .416,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-vl-8b-instruct": {
		"id": "qwen/qwen3-vl-8b-instruct",
		"name": "Qwen: Qwen3 VL 8B Instruct",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .117,
			"output": .455,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3-vl-8b-thinking": {
		"id": "qwen/qwen3-vl-8b-thinking",
		"name": "Qwen: Qwen3 VL 8B Thinking",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .117,
			"output": 1.365,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.5-122b-a10b": {
		"id": "qwen/qwen3.5-122b-a10b",
		"name": "Qwen: Qwen3.5-122B-A10B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .26,
			"output": 2.08,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.5-27b": {
		"id": "qwen/qwen3.5-27b",
		"name": "Qwen: Qwen3.5-27B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .195,
			"output": 1.56,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.5-35b-a3b": {
		"id": "qwen/qwen3.5-35b-a3b",
		"name": "Qwen: Qwen3.5-35B-A3B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .14,
			"output": 1,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.5-397b-a17b": {
		"id": "qwen/qwen3.5-397b-a17b",
		"name": "Qwen: Qwen3.5 397B A17B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .39,
			"output": 2.34,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.5-9b": {
		"id": "qwen/qwen3.5-9b",
		"name": "Qwen: Qwen3.5-9B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .15,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.5-flash-02-23": {
		"id": "qwen/qwen3.5-flash-02-23",
		"name": "Qwen: Qwen3.5-Flash",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .065,
			"output": .26,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.5-plus-02-15": {
		"id": "qwen/qwen3.5-plus-02-15",
		"name": "Qwen: Qwen3.5 Plus 2026-02-15",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .26,
			"output": 1.56,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.5-plus-20260420": {
		"id": "qwen/qwen3.5-plus-20260420",
		"name": "Qwen: Qwen3.5 Plus 2026-04-20",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 1.8,
			"cacheRead": 0,
			"cacheWrite": .375
		},
		"contextWindow": 1e6,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.6-27b": {
		"id": "qwen/qwen3.6-27b",
		"name": "Qwen: Qwen3.6 27B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .289,
			"output": 2.4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.6-35b-a3b": {
		"id": "qwen/qwen3.6-35b-a3b",
		"name": "Qwen: Qwen3.6 35B A3B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .14,
			"output": 1,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.6-flash": {
		"id": "qwen/qwen3.6-flash",
		"name": "Qwen: Qwen3.6 Flash",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .1875,
			"output": 1.125,
			"cacheRead": 0,
			"cacheWrite": .234375
		},
		"contextWindow": 1e6,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.6-max-preview": {
		"id": "qwen/qwen3.6-max-preview",
		"name": "Qwen: Qwen3.6 Max Preview",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.04,
			"output": 6.24,
			"cacheRead": 0,
			"cacheWrite": 1.3
		},
		"contextWindow": 262144,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.6-plus": {
		"id": "qwen/qwen3.6-plus",
		"name": "Qwen: Qwen3.6 Plus",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .325,
			"output": 1.95,
			"cacheRead": 0,
			"cacheWrite": .40625
		},
		"contextWindow": 1e6,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.7-max": {
		"id": "qwen/qwen3.7-max",
		"name": "Qwen: Qwen3.7 Max",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.475,
			"output": 4.425,
			"cacheRead": .295,
			"cacheWrite": 1.84375
		},
		"contextWindow": 1e6,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"qwen/qwen3.7-plus": {
		"id": "qwen/qwen3.7-plus",
		"name": "Qwen: Qwen3.7 Plus",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .32,
			"output": 1.28,
			"cacheRead": .064,
			"cacheWrite": .4
		},
		"contextWindow": 1e6,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"rekaai/reka-edge": {
		"id": "rekaai/reka-edge",
		"name": "Reka Edge",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .1,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 16384,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"relace/relace-search": {
		"id": "relace/relace-search",
		"name": "Relace: Relace Search",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 1,
			"output": 3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 128e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"sakana/fugu-ultra": {
		"id": "sakana/fugu-ultra",
		"name": "Sakana: Fugu Ultra",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"sao10k/l3.1-euryale-70b": {
		"id": "sao10k/l3.1-euryale-70b",
		"name": "Sao10K: Llama 3.1 Euryale 70B v2.2",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .85,
			"output": .85,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"stepfun/step-3.5-flash": {
		"id": "stepfun/step-3.5-flash",
		"name": "StepFun: Step 3.5 Flash",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"stepfun/step-3.7-flash": {
		"id": "stepfun/step-3.7-flash",
		"name": "StepFun: Step 3.7 Flash",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": 1.15,
			"cacheRead": .04,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"tencent/hy3": {
		"id": "tencent/hy3",
		"name": "Tencent: Hy3",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .132,
			"output": .528,
			"cacheRead": .033,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 128e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"tencent/hy3-preview": {
		"id": "tencent/hy3-preview",
		"name": "Tencent: Hy3 preview",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .063,
			"output": .21,
			"cacheRead": .021,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"thedrummer/unslopnemo-12b": {
		"id": "thedrummer/unslopnemo-12b",
		"name": "TheDrummer: UnslopNemo 12B",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .4,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 32768,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"thinkingmachines/inkling": {
		"id": "thinkingmachines/inkling",
		"name": "Thinking Machines: Inkling",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 4.05,
			"cacheRead": .17,
			"cacheWrite": 0
		},
		"contextWindow": 524288,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"upstage/solar-pro-3": {
		"id": "upstage/solar-pro-3",
		"name": "Upstage: Solar Pro 3",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": .015,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"x-ai/grok-4.20": {
		"id": "x-ai/grok-4.20",
		"name": "xAI: Grok 4.20",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 2.5,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 2e6,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"x-ai/grok-4.3": {
		"id": "x-ai/grok-4.3",
		"name": "xAI: Grok 4.3",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 2.5,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"x-ai/grok-4.5": {
		"id": "x-ai/grok-4.5",
		"name": "xAI: Grok 4.5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 6,
			"cacheRead": .3,
			"cacheWrite": 0
		},
		"contextWindow": 5e5,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"x-ai/grok-build-0.1": {
		"id": "x-ai/grok-build-0.1",
		"name": "xAI: Grok Build 0.1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 2,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"xiaomi/mimo-v2.5": {
		"id": "xiaomi/mimo-v2.5",
		"name": "Xiaomi: MiMo-V2.5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .14,
			"output": .28,
			"cacheRead": .0028,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"xiaomi/mimo-v2.5-pro": {
		"id": "xiaomi/mimo-v2.5-pro",
		"name": "Xiaomi: MiMo-V2.5-Pro",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .435,
			"output": .87,
			"cacheRead": .0036,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"z-ai/glm-4.5": {
		"id": "z-ai/glm-4.5",
		"name": "Z.ai: GLM 4.5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.2,
			"cacheRead": .11,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 98304,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"z-ai/glm-4.5-air": {
		"id": "z-ai/glm-4.5-air",
		"name": "Z.ai: GLM 4.5 Air",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .13,
			"output": .85,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 98304,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"z-ai/glm-4.5v": {
		"id": "z-ai/glm-4.5v",
		"name": "Z.ai: GLM 4.5V",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .6,
			"output": 1.8,
			"cacheRead": .11,
			"cacheWrite": 0
		},
		"contextWindow": 65536,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"z-ai/glm-4.6": {
		"id": "z-ai/glm-4.6",
		"name": "Z.ai: GLM 4.6",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .5,
			"output": 2,
			"cacheRead": .1,
			"cacheWrite": 0
		},
		"contextWindow": 202752,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"z-ai/glm-4.6v": {
		"id": "z-ai/glm-4.6v",
		"name": "Z.ai: GLM 4.6V",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": .9,
			"cacheRead": .055,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"z-ai/glm-4.7": {
		"id": "z-ai/glm-4.7",
		"name": "Z.ai: GLM 4.7",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .4,
			"output": 1.75,
			"cacheRead": .08,
			"cacheWrite": 0
		},
		"contextWindow": 202752,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"z-ai/glm-4.7-flash": {
		"id": "z-ai/glm-4.7-flash",
		"name": "Z.ai: GLM 4.7 Flash",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .06,
			"output": .4,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 202752,
		"maxTokens": 16384,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"z-ai/glm-5": {
		"id": "z-ai/glm-5",
		"name": "Z.ai: GLM 5",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 1.9,
			"cacheRead": .119,
			"cacheWrite": 0
		},
		"contextWindow": 204800,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"z-ai/glm-5-turbo": {
		"id": "z-ai/glm-5-turbo",
		"name": "Z.ai: GLM 5 Turbo",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.2,
			"output": 4,
			"cacheRead": .24,
			"cacheWrite": 0
		},
		"contextWindow": 202752,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"z-ai/glm-5.1": {
		"id": "z-ai/glm-5.1",
		"name": "Z.ai: GLM 5.1",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .966,
			"output": 3.036,
			"cacheRead": .1794,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 128e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"z-ai/glm-5.2": {
		"id": "z-ai/glm-5.2",
		"name": "Z.ai: GLM 5.2",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .721,
			"output": 2.266,
			"cacheRead": .1339,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		},
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"z-ai/glm-5v-turbo": {
		"id": "z-ai/glm-5v-turbo",
		"name": "Z.ai: GLM 5V Turbo",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.2,
			"output": 4,
			"cacheRead": .24,
			"cacheWrite": 0
		},
		"contextWindow": 202752,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"~anthropic/claude-fable-latest": {
		"id": "~anthropic/claude-fable-latest",
		"name": "Anthropic: Claude Fable Latest",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 50,
			"cacheRead": 1,
			"cacheWrite": 12.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		}
	},
	"~anthropic/claude-haiku-latest": {
		"id": "~anthropic/claude-haiku-latest",
		"name": "Anthropic Claude Haiku Latest",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 5,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		}
	},
	"~anthropic/claude-opus-latest": {
		"id": "~anthropic/claude-opus-latest",
		"name": "Anthropic: Claude Opus Latest",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		}
	},
	"~anthropic/claude-sonnet-latest": {
		"id": "~anthropic/claude-sonnet-latest",
		"name": "Anthropic Claude Sonnet Latest",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 10,
			"cacheRead": .2,
			"cacheWrite": 2.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter",
			"cacheControlFormat": "anthropic"
		}
	},
	"~google/gemini-flash-latest": {
		"id": "~google/gemini-flash-latest",
		"name": "Google Gemini Flash Latest",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 7.5,
			"cacheRead": .15,
			"cacheWrite": .083333
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"~google/gemini-pro-latest": {
		"id": "~google/gemini-pro-latest",
		"name": "Google Gemini Pro Latest",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 12,
			"cacheRead": .2,
			"cacheWrite": .375
		},
		"contextWindow": 1048576,
		"maxTokens": 65536,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"~moonshotai/kimi-latest": {
		"id": "~moonshotai/kimi-latest",
		"name": "MoonshotAI Kimi Latest",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"~openai/gpt-latest": {
		"id": "~openai/gpt-latest",
		"name": "OpenAI GPT Latest",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"~openai/gpt-mini-latest": {
		"id": "~openai/gpt-mini-latest",
		"name": "OpenAI GPT Mini Latest",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .75,
			"output": 4.5,
			"cacheRead": .075,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	},
	"~x-ai/grok-latest": {
		"id": "~x-ai/grok-latest",
		"name": "xAI: Grok Latest",
		"api": "openai-completions",
		"baseUrl": "https://openrouter.ai/api/v1",
		"provider": "openrouter",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 6,
			"cacheRead": .3,
			"cacheWrite": 0
		},
		"contextWindow": 5e5,
		"maxTokens": 4096,
		"compat": {
			"supportsDeveloperRole": false,
			"thinkingFormat": "openrouter"
		}
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/qwen-token-plan.models.js
const QWEN_TOKEN_PLAN_MODELS = flattenModelCatalog("qwen-token-plan", { "openai-completions": {
	"MiniMax-M2.5": {
		"id": "MiniMax-M2.5",
		"name": "MiniMax-M2.5",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 196608,
		"maxTokens": 32768
	},
	"deepseek-v3.2": {
		"id": "deepseek-v3.2",
		"name": "DeepSeek V3.2",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536
	},
	"deepseek-v4-flash": {
		"id": "deepseek-v4-flash",
		"name": "DeepSeek V4 Flash",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "deepseek",
			"supportsDeveloperRole": false,
			"supportsStore": false,
			"requiresReasoningContentOnAssistantMessages": true
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 384e3,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null,
			"high": "high",
			"max": "max"
		}
	},
	"deepseek-v4-pro": {
		"id": "deepseek-v4-pro",
		"name": "DeepSeek V4 Pro",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "deepseek",
			"supportsDeveloperRole": false,
			"supportsStore": false,
			"requiresReasoningContentOnAssistantMessages": true
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 384e3,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null,
			"high": "high",
			"max": "max"
		}
	},
	"glm-5": {
		"id": "glm-5",
		"name": "GLM-5",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 202752,
		"maxTokens": 16384
	},
	"glm-5.1": {
		"id": "glm-5.1",
		"name": "GLM-5.1",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 202752,
		"maxTokens": 128e3
	},
	"glm-5.2": {
		"id": "glm-5.2",
		"name": "GLM-5.2",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 131072
	},
	"kimi-k2.5": {
		"id": "kimi-k2.5",
		"name": "Kimi K2.5",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 98304
	},
	"kimi-k2.6": {
		"id": "kimi-k2.6",
		"name": "Kimi K2.6",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"kimi-k2.7-code": {
		"id": "kimi-k2.7-code",
		"name": "Kimi K2.7 Code",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"qwen3.6-flash": {
		"id": "qwen3.6-flash",
		"name": "Qwen3.6 Flash",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65536
	},
	"qwen3.6-plus": {
		"id": "qwen3.6-plus",
		"name": "Qwen3.6 Plus",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65536
	},
	"qwen3.7-max": {
		"id": "qwen3.7-max",
		"name": "Qwen3.7 Max",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 131072
	},
	"qwen3.7-plus": {
		"id": "qwen3.7-plus",
		"name": "Qwen3.7 Plus",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65536
	},
	"qwen3.8-max-preview": {
		"id": "qwen3.8-max-preview",
		"name": "Qwen3.8 Max Preview",
		"api": "openai-completions",
		"provider": "qwen-token-plan",
		"baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 131072
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/qwen-token-plan-cn.models.js
const QWEN_TOKEN_PLAN_CN_MODELS = flattenModelCatalog("qwen-token-plan-cn", { "openai-completions": {
	"MiniMax-M2.5": {
		"id": "MiniMax-M2.5",
		"name": "MiniMax-M2.5",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 196608,
		"maxTokens": 32768
	},
	"deepseek-v3.2": {
		"id": "deepseek-v3.2",
		"name": "DeepSeek V3.2",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536
	},
	"deepseek-v4-flash": {
		"id": "deepseek-v4-flash",
		"name": "DeepSeek V4 Flash",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "deepseek",
			"supportsDeveloperRole": false,
			"supportsStore": false,
			"requiresReasoningContentOnAssistantMessages": true
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 384e3,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null,
			"high": "high",
			"max": "max"
		}
	},
	"deepseek-v4-pro": {
		"id": "deepseek-v4-pro",
		"name": "DeepSeek V4 Pro",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "deepseek",
			"supportsDeveloperRole": false,
			"supportsStore": false,
			"requiresReasoningContentOnAssistantMessages": true
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 384e3,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null,
			"high": "high",
			"max": "max"
		}
	},
	"glm-5": {
		"id": "glm-5",
		"name": "GLM-5",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 202752,
		"maxTokens": 16384
	},
	"glm-5.1": {
		"id": "glm-5.1",
		"name": "GLM-5.1",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 202752,
		"maxTokens": 128e3
	},
	"glm-5.2": {
		"id": "glm-5.2",
		"name": "GLM-5.2",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 131072
	},
	"kimi-k2.5": {
		"id": "kimi-k2.5",
		"name": "Kimi K2.5",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 98304
	},
	"kimi-k2.6": {
		"id": "kimi-k2.6",
		"name": "Kimi K2.6",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"kimi-k2.7-code": {
		"id": "kimi-k2.7-code",
		"name": "Kimi K2.7 Code",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"qwen3.6-flash": {
		"id": "qwen3.6-flash",
		"name": "Qwen3.6 Flash",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65536
	},
	"qwen3.6-plus": {
		"id": "qwen3.6-plus",
		"name": "Qwen3.6 Plus",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65536
	},
	"qwen3.7-max": {
		"id": "qwen3.7-max",
		"name": "Qwen3.7 Max",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 131072
	},
	"qwen3.7-plus": {
		"id": "qwen3.7-plus",
		"name": "Qwen3.7 Plus",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65536
	},
	"qwen3.8-max-preview": {
		"id": "qwen3.8-max-preview",
		"name": "Qwen3.8 Max Preview",
		"api": "openai-completions",
		"provider": "qwen-token-plan-cn",
		"baseUrl": "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		"compat": {
			"thinkingFormat": "qwen",
			"supportsDeveloperRole": false,
			"supportsStore": false
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 131072
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/together.models.js
const TOGETHER_MODELS = flattenModelCatalog("together", { "openai-completions": {
	"MiniMaxAI/MiniMax-M2.7": {
		"id": "MiniMaxAI/MiniMax-M2.7",
		"name": "MiniMax-M2.7",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": true,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": null,
			"medium": null
		},
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .06,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 202752,
		"maxTokens": 131072
	},
	"MiniMaxAI/MiniMax-M3": {
		"id": "MiniMaxAI/MiniMax-M3",
		"name": "MiniMax-M3",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": true,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null
		},
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .06,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "together",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 524288,
		"maxTokens": 25e4
	},
	"Qwen/Qwen2.5-7B-Instruct-Turbo": {
		"id": "Qwen/Qwen2.5-7B-Instruct-Turbo",
		"name": "Qwen 2.5 7B Instruct Turbo",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "together",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 32768,
		"maxTokens": 32768
	},
	"Qwen/Qwen3.5-9B": {
		"id": "Qwen/Qwen3.5-9B",
		"name": "Qwen3.5 9B",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": true,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null
		},
		"input": ["text", "image"],
		"cost": {
			"input": .17,
			"output": .25,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "together",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 262144,
		"maxTokens": 65536
	},
	"Qwen/Qwen3.6-Plus": {
		"id": "Qwen/Qwen3.6-Plus",
		"name": "Qwen3.6 Plus",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": true,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null
		},
		"input": ["text"],
		"cost": {
			"input": .5,
			"output": 3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "together",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 1e6,
		"maxTokens": 5e5
	},
	"Qwen/Qwen3.7-Max": {
		"id": "Qwen/Qwen3.7-Max",
		"name": "Qwen3.7 Max",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 1.25,
			"output": 3.75,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "together",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 1e6,
		"maxTokens": 5e5
	},
	"deepseek-ai/DeepSeek-V4-Pro": {
		"id": "deepseek-ai/DeepSeek-V4-Pro",
		"name": "DeepSeek V4 Pro",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": true,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null,
			"high": "high",
			"xhigh": null
		},
		"input": ["text"],
		"cost": {
			"input": 1.74,
			"output": 3.48,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": true,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "together",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 512e3,
		"maxTokens": 384e3
	},
	"google/gemma-4-31B-it": {
		"id": "google/gemma-4-31B-it",
		"name": "Gemma 4 31B Instruct",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": true,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null
		},
		"input": ["text", "image"],
		"cost": {
			"input": .39,
			"output": .97,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "together",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 262144,
		"maxTokens": 131072
	},
	"meta-llama/Llama-3.3-70B-Instruct-Turbo": {
		"id": "meta-llama/Llama-3.3-70B-Instruct-Turbo",
		"name": "Llama 3.3 70B",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 1.04,
			"output": 1.04,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "together",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 131072,
		"maxTokens": 131072
	},
	"moonshotai/Kimi-K2.6": {
		"id": "moonshotai/Kimi-K2.6",
		"name": "Kimi K2.6",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": true,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null
		},
		"input": ["text", "image"],
		"cost": {
			"input": 1.2,
			"output": 4.5,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "together",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 262144,
		"maxTokens": 131e3
	},
	"moonshotai/Kimi-K2.7-Code": {
		"id": "moonshotai/Kimi-K2.7-Code",
		"name": "Kimi K2.7 Code",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": true,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null
		},
		"input": ["text"],
		"cost": {
			"input": .95,
			"output": 4,
			"cacheRead": .19,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "together",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 262144,
		"maxTokens": 131072
	},
	"nvidia/nemotron-3-ultra-550b-a55b": {
		"id": "nvidia/nemotron-3-ultra-550b-a55b",
		"name": "Nemotron 3 Ultra 550B A55B",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": true,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null
		},
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 3.6,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "together",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 512300,
		"maxTokens": 512300
	},
	"openai/gpt-oss-120b": {
		"id": "openai/gpt-oss-120b",
		"name": "GPT OSS 120B",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": true,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		},
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": true,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "openai",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 131072,
		"maxTokens": 131072
	},
	"openai/gpt-oss-20b": {
		"id": "openai/gpt-oss-20b",
		"name": "GPT OSS 20B",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": true,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		},
		"input": ["text"],
		"cost": {
			"input": .05,
			"output": .2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": true,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "openai",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 131072,
		"maxTokens": 131072
	},
	"thinkingmachines/Inkling": {
		"id": "thinkingmachines/Inkling",
		"name": "Inkling",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": true,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null
		},
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 4.05,
			"cacheRead": .17,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "together",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 524288,
		"maxTokens": 131072
	},
	"zai-org/GLM-5.2": {
		"id": "zai-org/GLM-5.2",
		"name": "GLM-5.2",
		"api": "openai-completions",
		"provider": "together",
		"baseUrl": "https://api.together.ai/v1",
		"reasoning": true,
		"thinkingLevelMap": {
			"minimal": null,
			"low": null,
			"medium": null
		},
		"input": ["text"],
		"cost": {
			"input": 1.4,
			"output": 4.4,
			"cacheRead": .26,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"maxTokensField": "max_tokens",
			"thinkingFormat": "together",
			"supportsStrictMode": false,
			"supportsLongCacheRetention": false
		},
		"contextWindow": 262144,
		"maxTokens": 164e3
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/vercel-ai-gateway.models.js
const VERCEL_AI_GATEWAY_MODELS = flattenModelCatalog("vercel-ai-gateway", { "anthropic-messages": {
	"alibaba/qwen-3-14b": {
		"id": "alibaba/qwen-3-14b",
		"name": "Qwen3-14B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .12,
			"output": .24,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 40960,
		"maxTokens": 16384
	},
	"alibaba/qwen-3-235b": {
		"id": "alibaba/qwen-3-235b",
		"name": "Qwen3 235B A22B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .22,
			"output": .88,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 16384
	},
	"alibaba/qwen-3-30b": {
		"id": "alibaba/qwen-3-30b",
		"name": "Qwen3-30B-A3B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .12,
			"output": .5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 40960,
		"maxTokens": 16384
	},
	"alibaba/qwen-3-32b": {
		"id": "alibaba/qwen-3-32b",
		"name": "Qwen 3 32B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .16,
			"output": .64,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 8192
	},
	"alibaba/qwen-3.6-max-preview": {
		"id": "alibaba/qwen-3.6-max-preview",
		"name": "Qwen 3.6 Max Preview",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.3,
			"output": 7.8,
			"cacheRead": .26,
			"cacheWrite": 1.625
		},
		"contextWindow": 24e4,
		"maxTokens": 64e3
	},
	"alibaba/qwen3-235b-a22b-thinking": {
		"id": "alibaba/qwen3-235b-a22b-thinking",
		"name": "Qwen3 VL 235B A22B Thinking",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768
	},
	"alibaba/qwen3-coder": {
		"id": "alibaba/qwen3-coder",
		"name": "Qwen3 Coder 480B A35B Instruct",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 1.5,
			"output": 7.5,
			"cacheRead": .3,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 65536
	},
	"alibaba/qwen3-coder-30b-a3b": {
		"id": "alibaba/qwen3-coder-30b-a3b",
		"name": "Qwen 3 Coder 30B A3B Instruct",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 8192
	},
	"alibaba/qwen3-coder-next": {
		"id": "alibaba/qwen3-coder-next",
		"name": "Qwen3 Coder Next",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .5,
			"output": 1.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"alibaba/qwen3-coder-plus": {
		"id": "alibaba/qwen3-coder-plus",
		"name": "Qwen3 Coder Plus",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 1,
			"output": 5,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65536
	},
	"alibaba/qwen3-max": {
		"id": "alibaba/qwen3-max",
		"name": "Qwen3 Max",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 1.2,
			"output": 6,
			"cacheRead": .24,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768
	},
	"alibaba/qwen3-max-preview": {
		"id": "alibaba/qwen3-max-preview",
		"name": "Qwen3 Max Preview",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 1.2,
			"output": 6,
			"cacheRead": .24,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768
	},
	"alibaba/qwen3-max-thinking": {
		"id": "alibaba/qwen3-max-thinking",
		"name": "Qwen 3 Max Thinking",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.2,
			"output": 6,
			"cacheRead": .24,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 65536
	},
	"alibaba/qwen3-next-80b-a3b-instruct": {
		"id": "alibaba/qwen3-next-80b-a3b-instruct",
		"name": "Qwen3 Next 80B A3B Instruct",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": 1.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768
	},
	"alibaba/qwen3-next-80b-a3b-thinking": {
		"id": "alibaba/qwen3-next-80b-a3b-thinking",
		"name": "Qwen3 Next 80B A3B Thinking",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": 1.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768
	},
	"alibaba/qwen3-vl-235b-a22b-instruct": {
		"id": "alibaba/qwen3-vl-235b-a22b-instruct",
		"name": "Qwen3 VL 235B A22B Instruct",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 1.6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 129024
	},
	"alibaba/qwen3-vl-instruct": {
		"id": "alibaba/qwen3-vl-instruct",
		"name": "Qwen3 VL 235B A22B Instruct",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 1.6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 129024
	},
	"alibaba/qwen3-vl-thinking": {
		"id": "alibaba/qwen3-vl-thinking",
		"name": "Qwen3 VL 235B A22B Thinking",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 32768
	},
	"alibaba/qwen3.5-flash": {
		"id": "alibaba/qwen3.5-flash",
		"name": "Qwen 3.5 Flash",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .4,
			"cacheRead": .001,
			"cacheWrite": .125
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3
	},
	"alibaba/qwen3.5-plus": {
		"id": "alibaba/qwen3.5-plus",
		"name": "Qwen 3.5 Plus",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 2.4,
			"cacheRead": .04,
			"cacheWrite": .5
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3
	},
	"alibaba/qwen3.6-27b": {
		"id": "alibaba/qwen3.6-27b",
		"name": "Qwen 3.6 27B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .6,
			"output": 3.6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"alibaba/qwen3.6-plus": {
		"id": "alibaba/qwen3.6-plus",
		"name": "Qwen 3.6 Plus",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .5,
			"output": 3,
			"cacheRead": .1,
			"cacheWrite": .625
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3
	},
	"alibaba/qwen3.7-max": {
		"id": "alibaba/qwen3.7-max",
		"name": "Qwen 3.7 Max",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 2.5,
			"output": 7.5,
			"cacheRead": .5,
			"cacheWrite": 3.125
		},
		"contextWindow": 991e3,
		"maxTokens": 64e3
	},
	"alibaba/qwen3.7-plus": {
		"id": "alibaba/qwen3.7-plus",
		"name": "Qwen 3.7 Plus",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 1.6,
			"cacheRead": .08,
			"cacheWrite": .5
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3
	},
	"amazon/nova-2-lite": {
		"id": "amazon/nova-2-lite",
		"name": "Nova 2 Lite",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 2.5,
			"cacheRead": .075,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 1e6
	},
	"amazon/nova-lite": {
		"id": "amazon/nova-lite",
		"name": "Nova Lite",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .06,
			"output": .24,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 3e5,
		"maxTokens": 8192
	},
	"amazon/nova-micro": {
		"id": "amazon/nova-micro",
		"name": "Nova Micro",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .035,
			"output": .14,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 8192
	},
	"amazon/nova-pro": {
		"id": "amazon/nova-pro",
		"name": "Nova Pro",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .8,
			"output": 3.2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 3e5,
		"maxTokens": 8192
	},
	"anthropic/claude-3-haiku": {
		"id": "anthropic/claude-3-haiku",
		"name": "Claude 3 Haiku",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 1.25,
			"cacheRead": .03,
			"cacheWrite": .3
		},
		"contextWindow": 2e5,
		"maxTokens": 4096
	},
	"anthropic/claude-fable-5": {
		"id": "anthropic/claude-fable-5",
		"name": "Claude Fable 5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 50,
			"cacheRead": 1,
			"cacheWrite": 12.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"off": null,
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": { "forceAdaptiveThinking": true }
	},
	"anthropic/claude-haiku-4.5": {
		"id": "anthropic/claude-haiku-4.5",
		"name": "Claude Haiku 4.5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 5,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3
	},
	"anthropic/claude-opus-4": {
		"id": "anthropic/claude-opus-4",
		"name": "Claude Opus 4",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 75,
			"cacheRead": 1.5,
			"cacheWrite": 18.75
		},
		"contextWindow": 2e5,
		"maxTokens": 8192
	},
	"anthropic/claude-opus-4.1": {
		"id": "anthropic/claude-opus-4.1",
		"name": "Claude Opus 4.1",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 75,
			"cacheRead": 1.5,
			"cacheWrite": 18.75
		},
		"contextWindow": 2e5,
		"maxTokens": 32e3
	},
	"anthropic/claude-opus-4.5": {
		"id": "anthropic/claude-opus-4.5",
		"name": "Claude Opus 4.5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 2e5,
		"maxTokens": 64e3
	},
	"anthropic/claude-opus-4.6": {
		"id": "anthropic/claude-opus-4.6",
		"name": "Claude Opus 4.6",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "max": "max" },
		"compat": { "forceAdaptiveThinking": true }
	},
	"anthropic/claude-opus-4.7": {
		"id": "anthropic/claude-opus-4.7",
		"name": "Claude Opus 4.7",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": {
			"forceAdaptiveThinking": true,
			"supportsTemperature": false
		}
	},
	"anthropic/claude-opus-4.8": {
		"id": "anthropic/claude-opus-4.8",
		"name": "Claude Opus 4.8",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": {
			"forceAdaptiveThinking": true,
			"supportsTemperature": false
		}
	},
	"anthropic/claude-opus-4.8-fast": {
		"id": "anthropic/claude-opus-4.8-fast",
		"name": "Claude Opus 4.8 (Fast)",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 50,
			"cacheRead": 1,
			"cacheWrite": 12.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": {
			"forceAdaptiveThinking": true,
			"supportsTemperature": false
		}
	},
	"anthropic/claude-opus-5": {
		"id": "anthropic/claude-opus-5",
		"name": "Claude Opus 5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 25,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": {
			"forceAdaptiveThinking": true,
			"supportsTemperature": false
		}
	},
	"anthropic/claude-opus-5-fast": {
		"id": "anthropic/claude-opus-5-fast",
		"name": "Claude Opus 5 (Fast)",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 50,
			"cacheRead": 1,
			"cacheWrite": 12.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": {
			"forceAdaptiveThinking": true,
			"supportsTemperature": false
		}
	},
	"anthropic/claude-sonnet-4": {
		"id": "anthropic/claude-sonnet-4",
		"name": "Claude Sonnet 4",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 1e6,
		"maxTokens": 8192
	},
	"anthropic/claude-sonnet-4.5": {
		"id": "anthropic/claude-sonnet-4.5",
		"name": "Claude Sonnet 4.5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3
	},
	"anthropic/claude-sonnet-4.6": {
		"id": "anthropic/claude-sonnet-4.6",
		"name": "Claude Sonnet 4.6",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 3.75
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "max": "max" },
		"compat": { "forceAdaptiveThinking": true }
	},
	"anthropic/claude-sonnet-5": {
		"id": "anthropic/claude-sonnet-5",
		"name": "Claude Sonnet 5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 10,
			"cacheRead": .2,
			"cacheWrite": 2.5
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"max": "max"
		},
		"compat": { "forceAdaptiveThinking": true }
	},
	"arcee-ai/trinity-large-thinking": {
		"id": "arcee-ai/trinity-large-thinking",
		"name": "Trinity Large Thinking",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .25,
			"output": .9,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262100,
		"maxTokens": 8e4
	},
	"arcee-ai/trinity-mini": {
		"id": "arcee-ai/trinity-mini",
		"name": "Trinity Mini",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .045,
			"output": .15,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072
	},
	"bytedance/seed-1.6": {
		"id": "bytedance/seed-1.6",
		"name": "Seed 1.6",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 2,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 32e3
	},
	"bytedance/seed-1.8": {
		"id": "bytedance/seed-1.8",
		"name": "Bytedance Seed 1.8",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 2,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 64e3
	},
	"cohere/command-a": {
		"id": "cohere/command-a",
		"name": "Command A",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 8e3
	},
	"deepseek/deepseek-r1": {
		"id": "deepseek/deepseek-r1",
		"name": "DeepSeek-R1",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.35,
			"output": 5.4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 8192
	},
	"deepseek/deepseek-v3": {
		"id": "deepseek/deepseek-v3",
		"name": "DeepSeek V3 0324",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .27,
			"output": 1.12,
			"cacheRead": .135,
			"cacheWrite": 0
		},
		"contextWindow": 163840,
		"maxTokens": 163840
	},
	"deepseek/deepseek-v3.1": {
		"id": "deepseek/deepseek-v3.1",
		"name": "DeepSeek V3.1",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .25,
			"output": .95,
			"cacheRead": .13,
			"cacheWrite": 0
		},
		"contextWindow": 163840,
		"maxTokens": 128e3
	},
	"deepseek/deepseek-v3.1-terminus": {
		"id": "deepseek/deepseek-v3.1-terminus",
		"name": "DeepSeek V3.1 Terminus",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .27,
			"output": 1,
			"cacheRead": .135,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536
	},
	"deepseek/deepseek-v3.2": {
		"id": "deepseek/deepseek-v3.2",
		"name": "DeepSeek V3.2",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .28,
			"output": .42,
			"cacheRead": .028,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 8e3
	},
	"deepseek/deepseek-v3.2-thinking": {
		"id": "deepseek/deepseek-v3.2-thinking",
		"name": "DeepSeek V3.2 Thinking",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .62,
			"output": 1.85,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 8e3
	},
	"deepseek/deepseek-v4-flash": {
		"id": "deepseek/deepseek-v4-flash",
		"name": "DeepSeek V4 Flash",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .14,
			"output": .28,
			"cacheRead": .028,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 384e3
	},
	"deepseek/deepseek-v4-pro": {
		"id": "deepseek/deepseek-v4-pro",
		"name": "DeepSeek V4 Pro",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .435,
			"output": .87,
			"cacheRead": .0036,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 384e3
	},
	"google/gemini-2.5-flash": {
		"id": "google/gemini-2.5-flash",
		"name": "Gemini 2.5 Flash",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 2.5,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65536
	},
	"google/gemini-2.5-flash-lite": {
		"id": "google/gemini-2.5-flash-lite",
		"name": "Gemini 2.5 Flash Lite",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .4,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536
	},
	"google/gemini-2.5-pro": {
		"id": "google/gemini-2.5-pro",
		"name": "Gemini 2.5 Pro",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 65536
	},
	"google/gemini-3-flash": {
		"id": "google/gemini-3-flash",
		"name": "Gemini 3 Flash",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .5,
			"output": 3,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65e3
	},
	"google/gemini-3-pro-preview": {
		"id": "google/gemini-3-pro-preview",
		"name": "Gemini 3 Pro Preview",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 12,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3
	},
	"google/gemini-3.1-flash-lite": {
		"id": "google/gemini-3.1-flash-lite",
		"name": "Gemini 3.1 Flash Lite",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 1.5,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65e3
	},
	"google/gemini-3.1-pro-preview": {
		"id": "google/gemini-3.1-pro-preview",
		"name": "Gemini 3.1 Pro Preview",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 12,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3
	},
	"google/gemini-3.5-flash": {
		"id": "google/gemini-3.5-flash",
		"name": "Gemini 3.5 Flash",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 9,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3
	},
	"google/gemini-3.5-flash-lite": {
		"id": "google/gemini-3.5-flash-lite",
		"name": "Gemini 3.5 Flash Lite",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 2.5,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65e3
	},
	"google/gemini-3.6-flash": {
		"id": "google/gemini-3.6-flash",
		"name": "Gemini 3.6 Flash",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 7.5,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 64e3
	},
	"google/gemma-4-26b-a4b-it": {
		"id": "google/gemma-4-26b-a4b-it",
		"name": "Gemma 4 26B A4B IT",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": .015,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 131072
	},
	"google/gemma-4-31b-it": {
		"id": "google/gemma-4-31b-it",
		"name": "Gemma 4 31B IT",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .14,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 131072
	},
	"inception/mercury-2": {
		"id": "inception/mercury-2",
		"name": "Mercury 2",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .25,
			"output": .75,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3
	},
	"inception/mercury-coder-small": {
		"id": "inception/mercury-coder-small",
		"name": "Mercury Coder Small Beta",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .25,
			"output": 1,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 32e3,
		"maxTokens": 16384
	},
	"inclusionai/ling-3.0-flash-free": {
		"id": "inclusionai/ling-3.0-flash-free",
		"name": "Ling 3.0 Flash",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"interfaze/interfaze-beta": {
		"id": "interfaze/interfaze-beta",
		"name": "Interfaze Beta",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 3.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 32e3
	},
	"kwaipilot/kat-coder-air-v2.5": {
		"id": "kwaipilot/kat-coder-air-v2.5",
		"name": "Kat Coder Air V2.5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 8e4
	},
	"kwaipilot/kat-coder-pro-v1": {
		"id": "kwaipilot/kat-coder-pro-v1",
		"name": "KAT-Coder-Pro V1",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .06,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 32e3
	},
	"kwaipilot/kat-coder-pro-v2": {
		"id": "kwaipilot/kat-coder-pro-v2",
		"name": "Kat Coder Pro V2",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .06,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"kwaipilot/kat-coder-pro-v2.5": {
		"id": "kwaipilot/kat-coder-pro-v2.5",
		"name": "Kat Coder Pro V2.5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .74,
			"output": 2.96,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 8e4
	},
	"meta/llama-3.1-70b": {
		"id": "meta/llama-3.1-70b",
		"name": "Llama 3.1 70B Instruct",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .72,
			"output": .72,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 8192
	},
	"meta/llama-3.1-8b": {
		"id": "meta/llama-3.1-8b",
		"name": "Llama 3.1 8B Instruct",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .22,
			"output": .22,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 8192
	},
	"meta/llama-3.3-70b": {
		"id": "meta/llama-3.3-70b",
		"name": "Llama 3.3 70B Instruct",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .72,
			"output": .72,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 8192
	},
	"meta/llama-4-maverick": {
		"id": "meta/llama-4-maverick",
		"name": "Llama 4 Maverick 17B Instruct",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .24,
			"output": .97,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 8192
	},
	"meta/llama-4-scout": {
		"id": "meta/llama-4-scout",
		"name": "Llama 4 Scout 17B Instruct",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .17,
			"output": .66,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 8192
	},
	"meta/muse-spark-1.1": {
		"id": "meta/muse-spark-1.1",
		"name": "Muse Spark 1.1",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 4.25,
			"cacheRead": .15,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 1048576
	},
	"minimax/minimax-m2": {
		"id": "minimax/minimax-m2",
		"name": "MiniMax M2",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .03,
			"cacheWrite": .375
		},
		"contextWindow": 205e3,
		"maxTokens": 205e3
	},
	"minimax/minimax-m2.1": {
		"id": "minimax/minimax-m2.1",
		"name": "MiniMax M2.1",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .03,
			"cacheWrite": .375
		},
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"minimax/minimax-m2.1-lightning": {
		"id": "minimax/minimax-m2.1-lightning",
		"name": "MiniMax M2.1 Lightning",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 2.4,
			"cacheRead": .03,
			"cacheWrite": .375
		},
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"minimax/minimax-m2.5": {
		"id": "minimax/minimax-m2.5",
		"name": "MiniMax M2.5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .03,
			"cacheWrite": .375
		},
		"contextWindow": 204800,
		"maxTokens": 131e3
	},
	"minimax/minimax-m2.5-highspeed": {
		"id": "minimax/minimax-m2.5-highspeed",
		"name": "MiniMax M2.5 High Speed",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.4,
			"cacheRead": .03,
			"cacheWrite": .375
		},
		"contextWindow": 204800,
		"maxTokens": 131e3
	},
	"minimax/minimax-m2.7": {
		"id": "minimax/minimax-m2.7",
		"name": "MiniMax M2.7",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .06,
			"cacheWrite": .375
		},
		"contextWindow": 204800,
		"maxTokens": 131e3
	},
	"minimax/minimax-m2.7-highspeed": {
		"id": "minimax/minimax-m2.7-highspeed",
		"name": "MiniMax M2.7 High Speed",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.4,
			"cacheRead": .06,
			"cacheWrite": .375
		},
		"contextWindow": 204800,
		"maxTokens": 131100
	},
	"minimax/minimax-m3": {
		"id": "minimax/minimax-m3",
		"name": "MiniMax M3",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": 1.2,
			"cacheRead": .06,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 1e6
	},
	"mistral/codestral": {
		"id": "mistral/codestral",
		"name": "Mistral Codestral",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .3,
			"output": .9,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4e3
	},
	"mistral/devstral-2": {
		"id": "mistral/devstral-2",
		"name": "Devstral 2",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .4,
			"output": 2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"mistral/devstral-small-2": {
		"id": "mistral/devstral-small-2",
		"name": "Devstral Small 2",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"mistral/magistral-medium": {
		"id": "mistral/magistral-medium",
		"name": "Magistral Medium 2509",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 64e3
	},
	"mistral/magistral-small": {
		"id": "mistral/magistral-small",
		"name": "Magistral Small 2509",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .5,
			"output": 1.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 64e3
	},
	"mistral/ministral-14b": {
		"id": "mistral/ministral-14b",
		"name": "Ministral 14B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": .2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"mistral/ministral-3b": {
		"id": "mistral/ministral-3b",
		"name": "Ministral 3B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": .1,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4e3
	},
	"mistral/ministral-8b": {
		"id": "mistral/ministral-8b",
		"name": "Ministral 8B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .15,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4e3
	},
	"mistral/mistral-large-3": {
		"id": "mistral/mistral-large-3",
		"name": "Mistral Large 3",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .5,
			"output": 1.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"mistral/mistral-medium": {
		"id": "mistral/mistral-medium",
		"name": "Mistral Medium 3.1",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 64e3
	},
	"mistral/mistral-medium-3.5": {
		"id": "mistral/mistral-medium-3.5",
		"name": "Mistral Medium Latest",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.5,
			"output": 7.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"mistral/mistral-nemo": {
		"id": "mistral/mistral-nemo",
		"name": "Mistral Nemo 12B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .15,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 128e3
	},
	"mistral/mistral-small": {
		"id": "mistral/mistral-small",
		"name": "Mistral Small",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 32e3,
		"maxTokens": 4e3
	},
	"mistral/pixtral-12b": {
		"id": "mistral/pixtral-12b",
		"name": "Pixtral 12B 2409",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .15,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4e3
	},
	"moonshotai/kimi-k2": {
		"id": "moonshotai/kimi-k2",
		"name": "Kimi K2 Instruct",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .57,
			"output": 2.3,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072
	},
	"moonshotai/kimi-k2-thinking": {
		"id": "moonshotai/kimi-k2-thinking",
		"name": "Kimi K2 Thinking",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .47,
			"output": 2,
			"cacheRead": .141,
			"cacheWrite": 0
		},
		"contextWindow": 216144,
		"maxTokens": 216144
	},
	"moonshotai/kimi-k2.5": {
		"id": "moonshotai/kimi-k2.5",
		"name": "Kimi K2.5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .6,
			"output": 3,
			"cacheRead": .1,
			"cacheWrite": 0
		},
		"contextWindow": 262114,
		"maxTokens": 262114
	},
	"moonshotai/kimi-k2.6": {
		"id": "moonshotai/kimi-k2.6",
		"name": "Kimi K2.6",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .95,
			"output": 4,
			"cacheRead": .16,
			"cacheWrite": 0
		},
		"contextWindow": 262e3,
		"maxTokens": 262e3
	},
	"moonshotai/kimi-k2.7-code": {
		"id": "moonshotai/kimi-k2.7-code",
		"name": "Kimi K2.7 Code",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .95,
			"output": 4,
			"cacheRead": .19,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 32768
	},
	"moonshotai/kimi-k2.7-code-highspeed": {
		"id": "moonshotai/kimi-k2.7-code-highspeed",
		"name": "Kimi K2.7 Code High Speed",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.9,
			"output": 8,
			"cacheRead": .38,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 32768
	},
	"moonshotai/kimi-k3": {
		"id": "moonshotai/kimi-k3",
		"name": "Kimi K3",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 3,
			"output": 15,
			"cacheRead": .3,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 131072
	},
	"nvidia/nemotron-3-nano-30b-a3b": {
		"id": "nvidia/nemotron-3-nano-30b-a3b",
		"name": "Nemotron 3 Nano 30B A3B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .05,
			"output": .24,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"nvidia/nemotron-3-super-120b-a12b": {
		"id": "nvidia/nemotron-3-super-120b-a12b",
		"name": "NVIDIA Nemotron 3 Super 120B A12B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .15,
			"output": .65,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 32e3
	},
	"nvidia/nemotron-3-ultra-550b-a55b": {
		"id": "nvidia/nemotron-3-ultra-550b-a55b",
		"name": "Nemotron 3 Ultra",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.4,
			"cacheRead": .12,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 65e3
	},
	"nvidia/nemotron-nano-12b-v2-vl": {
		"id": "nvidia/nemotron-nano-12b-v2-vl",
		"name": "Nvidia Nemotron Nano 12B V2 VL",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": .6,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072
	},
	"nvidia/nemotron-nano-9b-v2": {
		"id": "nvidia/nemotron-nano-9b-v2",
		"name": "Nvidia Nemotron Nano 9B V2",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .06,
			"output": .23,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072
	},
	"openai/gpt-3.5-turbo": {
		"id": "openai/gpt-3.5-turbo",
		"name": "GPT-3.5 Turbo",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text"],
		"cost": {
			"input": .5,
			"output": 1.5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 16385,
		"maxTokens": 4096
	},
	"openai/gpt-4-turbo": {
		"id": "openai/gpt-4-turbo",
		"name": "GPT-4 Turbo",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 30,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 4096
	},
	"openai/gpt-4.1": {
		"id": "openai/gpt-4.1",
		"name": "GPT-4.1",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 8,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 1047576,
		"maxTokens": 32768
	},
	"openai/gpt-4.1-mini": {
		"id": "openai/gpt-4.1-mini",
		"name": "GPT-4.1 mini",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .4,
			"output": 1.6,
			"cacheRead": .1,
			"cacheWrite": 0
		},
		"contextWindow": 1047576,
		"maxTokens": 32768
	},
	"openai/gpt-4.1-nano": {
		"id": "openai/gpt-4.1-nano",
		"name": "GPT-4.1 nano",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .1,
			"output": .4,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 1047576,
		"maxTokens": 32768
	},
	"openai/gpt-4o": {
		"id": "openai/gpt-4o",
		"name": "GPT-4o",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 10,
			"cacheRead": 1.25,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384
	},
	"openai/gpt-4o-mini": {
		"id": "openai/gpt-4o-mini",
		"name": "GPT-4o mini",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .15,
			"output": .6,
			"cacheRead": .075,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384
	},
	"openai/gpt-5": {
		"id": "openai/gpt-5",
		"name": "GPT-5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3
	},
	"openai/gpt-5-codex": {
		"id": "openai/gpt-5-codex",
		"name": "GPT-5-Codex",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3
	},
	"openai/gpt-5-mini": {
		"id": "openai/gpt-5-mini",
		"name": "GPT-5 mini",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 2,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3
	},
	"openai/gpt-5-nano": {
		"id": "openai/gpt-5-nano",
		"name": "GPT-5 nano",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .05,
			"output": .4,
			"cacheRead": .005,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3
	},
	"openai/gpt-5-pro": {
		"id": "openai/gpt-5-pro",
		"name": "GPT-5 pro",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 120,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 272e3
	},
	"openai/gpt-5.1-codex": {
		"id": "openai/gpt-5.1-codex",
		"name": "GPT-5.1-Codex",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3
	},
	"openai/gpt-5.1-codex-max": {
		"id": "openai/gpt-5.1-codex-max",
		"name": "GPT 5.1 Codex Max",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3
	},
	"openai/gpt-5.1-codex-mini": {
		"id": "openai/gpt-5.1-codex-mini",
		"name": "GPT 5.1 Codex Mini",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .25,
			"output": 2,
			"cacheRead": .025,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3
	},
	"openai/gpt-5.1-instant": {
		"id": "openai/gpt-5.1-instant",
		"name": "GPT-5.1 Instant",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384
	},
	"openai/gpt-5.1-thinking": {
		"id": "openai/gpt-5.1-thinking",
		"name": "GPT 5.1 Thinking",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 10,
			"cacheRead": .125,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3
	},
	"openai/gpt-5.2": {
		"id": "openai/gpt-5.2",
		"name": "GPT 5.2",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.2-codex": {
		"id": "openai/gpt-5.2-codex",
		"name": "GPT 5.2 Codex",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.2-pro": {
		"id": "openai/gpt-5.2-pro",
		"name": "GPT 5.2 ",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 21,
			"output": 168,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.3-chat": {
		"id": "openai/gpt-5.3-chat",
		"name": "GPT-5.3 Chat",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 16384,
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.3-codex": {
		"id": "openai/gpt-5.3-codex",
		"name": "GPT 5.3 Codex",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.75,
			"output": 14,
			"cacheRead": .175,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.4": {
		"id": "openai/gpt-5.4",
		"name": "GPT 5.4",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 15,
			"cacheRead": .25,
			"cacheWrite": 0
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.4-mini": {
		"id": "openai/gpt-5.4-mini",
		"name": "GPT 5.4 Mini",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .75,
			"output": 4.5,
			"cacheRead": .075,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.4-nano": {
		"id": "openai/gpt-5.4-nano",
		"name": "GPT 5.4 Nano",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": 1.25,
			"cacheRead": .02,
			"cacheWrite": 0
		},
		"contextWindow": 4e5,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.4-pro": {
		"id": "openai/gpt-5.4-pro",
		"name": "GPT 5.4 Pro",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 30,
			"output": 180,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.5": {
		"id": "openai/gpt-5.5",
		"name": "GPT 5.5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.5-pro": {
		"id": "openai/gpt-5.5-pro",
		"name": "GPT 5.5 Pro",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 30,
			"output": 180,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3,
		"thinkingLevelMap": {
			"xhigh": "xhigh",
			"off": null,
			"minimal": null,
			"low": null
		}
	},
	"openai/gpt-5.6-luna": {
		"id": "openai/gpt-5.6-luna",
		"name": "GPT 5.6 Luna",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 6,
			"cacheRead": .1,
			"cacheWrite": 1.25
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.6-sol": {
		"id": "openai/gpt-5.6-sol",
		"name": "GPT 5.6 Sol",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 6.25
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-5.6-terra": {
		"id": "openai/gpt-5.6-terra",
		"name": "GPT 5.6 Terra",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2.5,
			"output": 15,
			"cacheRead": .25,
			"cacheWrite": 3.125
		},
		"contextWindow": 105e4,
		"maxTokens": 128e3,
		"thinkingLevelMap": { "xhigh": "xhigh" }
	},
	"openai/gpt-oss-120b": {
		"id": "openai/gpt-oss-120b",
		"name": "GPT OSS 120B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": .5,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 131072
	},
	"openai/gpt-oss-20b": {
		"id": "openai/gpt-oss-20b",
		"name": "GPT OSS 20B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .05,
			"output": .2,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 8192
	},
	"openai/gpt-oss-safeguard-20b": {
		"id": "openai/gpt-oss-safeguard-20b",
		"name": "GPT OSS Safeguard 20B",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .075,
			"output": .3,
			"cacheRead": .037,
			"cacheWrite": 0
		},
		"contextWindow": 131072,
		"maxTokens": 65536
	},
	"openai/o1": {
		"id": "openai/o1",
		"name": "o1",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 15,
			"output": 60,
			"cacheRead": 7.5,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5
	},
	"openai/o3": {
		"id": "openai/o3",
		"name": "o3",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 8,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5
	},
	"openai/o3-deep-research": {
		"id": "openai/o3-deep-research",
		"name": "o3-deep-research",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 10,
			"output": 40,
			"cacheRead": 2.5,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5
	},
	"openai/o3-mini": {
		"id": "openai/o3-mini",
		"name": "o3-mini",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.1,
			"output": 4.4,
			"cacheRead": .55,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5
	},
	"openai/o3-pro": {
		"id": "openai/o3-pro",
		"name": "o3 Pro",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 20,
			"output": 80,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5
	},
	"openai/o4-mini": {
		"id": "openai/o4-mini",
		"name": "o4-mini",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.1,
			"output": 4.4,
			"cacheRead": .275,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 1e5
	},
	"poolside/laguna-s-2.1": {
		"id": "poolside/laguna-s-2.1",
		"name": "Laguna S 2.1",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .1,
			"output": .2,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 131072
	},
	"poolside/laguna-s-2.1-free": {
		"id": "poolside/laguna-s-2.1-free",
		"name": "Laguna S 2.1 Free",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 32768
	},
	"sakana/fugu-ultra": {
		"id": "sakana/fugu-ultra",
		"name": "Fugu Ultra",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 5,
			"output": 30,
			"cacheRead": .5,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 1e6
	},
	"stepfun/step-3.5-flash": {
		"id": "stepfun/step-3.5-flash",
		"name": "StepFun 3.5 Flash",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .09,
			"output": .3,
			"cacheRead": .02,
			"cacheWrite": 0
		},
		"contextWindow": 262114,
		"maxTokens": 262114
	},
	"stepfun/step-3.7-flash": {
		"id": "stepfun/step-3.7-flash",
		"name": "Step 3.7 Flash",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": 1.15,
			"cacheRead": .04,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"tencent/hy3": {
		"id": "tencent/hy3",
		"name": "Hy3",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .14,
			"output": .58,
			"cacheRead": .035,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 262144
	},
	"thinkingmachines/inkling": {
		"id": "thinkingmachines/inkling",
		"name": "Inkling",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 4.05,
			"cacheRead": .17,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"xai/grok-4.1-fast-non-reasoning": {
		"id": "xai/grok-4.1-fast-non-reasoning",
		"name": "Grok 4.1 Fast Non-Reasoning",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": .5,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 1e6
	},
	"xai/grok-4.1-fast-reasoning": {
		"id": "xai/grok-4.1-fast-reasoning",
		"name": "Grok 4.1 Fast Reasoning",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .2,
			"output": .5,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 1e6
	},
	"xai/grok-4.20-multi-agent": {
		"id": "xai/grok-4.20-multi-agent",
		"name": "Grok 4.20 Multi-Agent",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 2.5,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 2e6,
		"maxTokens": 2e6
	},
	"xai/grok-4.20-multi-agent-beta": {
		"id": "xai/grok-4.20-multi-agent-beta",
		"name": "Grok 4.20 Multi Agent Beta",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 2.5,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 2e6,
		"maxTokens": 2e6
	},
	"xai/grok-4.20-non-reasoning": {
		"id": "xai/grok-4.20-non-reasoning",
		"name": "Grok 4.20 Non-Reasoning",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 2.5,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 2e6,
		"maxTokens": 2e6
	},
	"xai/grok-4.20-non-reasoning-beta": {
		"id": "xai/grok-4.20-non-reasoning-beta",
		"name": "Grok 4.20 Beta Non-Reasoning",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": false,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 2.5,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 2e6,
		"maxTokens": 2e6
	},
	"xai/grok-4.20-reasoning": {
		"id": "xai/grok-4.20-reasoning",
		"name": "Grok 4.20 Reasoning",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 2.5,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 2e6,
		"maxTokens": 2e6
	},
	"xai/grok-4.20-reasoning-beta": {
		"id": "xai/grok-4.20-reasoning-beta",
		"name": "Grok 4.20 Beta Reasoning",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 2.5,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 2e6,
		"maxTokens": 2e6
	},
	"xai/grok-4.3": {
		"id": "xai/grok-4.3",
		"name": "Grok 4.3",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.25,
			"output": 2.5,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 1e6
	},
	"xai/grok-4.5": {
		"id": "xai/grok-4.5",
		"name": "Grok 4.5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 6,
			"cacheRead": .3,
			"cacheWrite": 0
		},
		"contextWindow": 5e5,
		"maxTokens": 5e5
	},
	"xai/grok-build-0.1": {
		"id": "xai/grok-build-0.1",
		"name": "Grok Build 0.1",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1,
			"output": 2,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 256e3,
		"maxTokens": 256e3
	},
	"xiaomi/mimo-v2.5": {
		"id": "xiaomi/mimo-v2.5",
		"name": "MiMo M2.5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .14,
			"output": .28,
			"cacheRead": .0028,
			"cacheWrite": 0
		},
		"contextWindow": 105e4,
		"maxTokens": 131100
	},
	"xiaomi/mimo-v2.5-pro": {
		"id": "xiaomi/mimo-v2.5-pro",
		"name": "MiMo V2.5 Pro",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .435,
			"output": .87,
			"cacheRead": .0036,
			"cacheWrite": 0
		},
		"contextWindow": 105e4,
		"maxTokens": 131e3
	},
	"zai/glm-4.5": {
		"id": "zai/glm-4.5",
		"name": "GLM 4.5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.2,
			"cacheRead": .11,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 96e3
	},
	"zai/glm-4.5-air": {
		"id": "zai/glm-4.5-air",
		"name": "GLM 4.5 Air",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .2,
			"output": 1.1,
			"cacheRead": .03,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 96e3
	},
	"zai/glm-4.5v": {
		"id": "zai/glm-4.5v",
		"name": "GLM 4.5V",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .6,
			"output": 1.8,
			"cacheRead": .11,
			"cacheWrite": 0
		},
		"contextWindow": 66e3,
		"maxTokens": 16e3
	},
	"zai/glm-4.6": {
		"id": "zai/glm-4.6",
		"name": "GLM 4.6",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.2,
			"cacheRead": .11,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 96e3
	},
	"zai/glm-4.6v": {
		"id": "zai/glm-4.6v",
		"name": "GLM-4.6V",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .3,
			"output": .9,
			"cacheRead": .05,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 24e3
	},
	"zai/glm-4.6v-flash": {
		"id": "zai/glm-4.6v-flash",
		"name": "GLM-4.6V-Flash",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 128e3,
		"maxTokens": 24e3
	},
	"zai/glm-4.7": {
		"id": "zai/glm-4.7",
		"name": "GLM 4.7",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .6,
			"output": 2.2,
			"cacheRead": .12,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 12e4
	},
	"zai/glm-4.7-flash": {
		"id": "zai/glm-4.7-flash",
		"name": "GLM 4.7 Flash",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .07,
			"output": .4,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 131e3
	},
	"zai/glm-4.7-flashx": {
		"id": "zai/glm-4.7-flashx",
		"name": "GLM 4.7 FlashX",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .06,
			"output": .4,
			"cacheRead": .01,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 128e3
	},
	"zai/glm-5": {
		"id": "zai/glm-5",
		"name": "GLM 5",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .95,
			"output": 3.15,
			"cacheRead": .2,
			"cacheWrite": 0
		},
		"contextWindow": 202800,
		"maxTokens": 131100
	},
	"zai/glm-5-turbo": {
		"id": "zai/glm-5-turbo",
		"name": "GLM 5 Turbo",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.2,
			"output": 4,
			"cacheRead": .24,
			"cacheWrite": 0
		},
		"contextWindow": 202800,
		"maxTokens": 131100
	},
	"zai/glm-5.1": {
		"id": "zai/glm-5.1",
		"name": "GLM 5.1",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.3,
			"output": 4.3,
			"cacheRead": .26,
			"cacheWrite": 0
		},
		"contextWindow": 202e3,
		"maxTokens": 202e3
	},
	"zai/glm-5.2": {
		"id": "zai/glm-5.2",
		"name": "GLM 5.2",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.4,
			"output": 4.4,
			"cacheRead": .26,
			"cacheWrite": 0
		},
		"contextWindow": 104e4,
		"maxTokens": 128e3
	},
	"zai/glm-5.2-fast": {
		"id": "zai/glm-5.2-fast",
		"name": "GLM 5.2 Fast",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 2.1,
			"output": 6.6,
			"cacheRead": .21,
			"cacheWrite": 0
		},
		"contextWindow": 1e6,
		"maxTokens": 128e3
	},
	"zai/glm-5v-turbo": {
		"id": "zai/glm-5v-turbo",
		"name": "GLM 5V Turbo",
		"api": "anthropic-messages",
		"baseUrl": "https://ai-gateway.vercel.sh",
		"provider": "vercel-ai-gateway",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 1.2,
			"output": 4,
			"cacheRead": .24,
			"cacheWrite": 0
		},
		"contextWindow": 2e5,
		"maxTokens": 128e3
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/xai.models.js
const XAI_MODELS = flattenModelCatalog("xai", {
	"openai-completions": {
		"grok-4.3": {
			"id": "grok-4.3",
			"name": "Grok 4.3",
			"api": "openai-completions",
			"provider": "xai",
			"baseUrl": "https://api.x.ai/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1.25,
				"output": 2.5,
				"cacheRead": .2,
				"cacheWrite": 0
			},
			"contextWindow": 1e6,
			"maxTokens": 3e4,
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false
			}
		},
		"grok-build-0.1": {
			"id": "grok-build-0.1",
			"name": "Grok Build 0.1",
			"api": "openai-completions",
			"provider": "xai",
			"baseUrl": "https://api.x.ai/v1",
			"reasoning": true,
			"input": ["text", "image"],
			"cost": {
				"input": 1,
				"output": 2,
				"cacheRead": .2,
				"cacheWrite": 0
			},
			"contextWindow": 256e3,
			"maxTokens": 256e3,
			"compat": {
				"supportsStore": false,
				"supportsDeveloperRole": false,
				"supportsReasoningEffort": false
			}
		}
	},
	"openai-responses": { "grok-4.5": {
		"id": "grok-4.5",
		"name": "Grok 4.5",
		"api": "openai-responses",
		"provider": "xai",
		"baseUrl": "https://api.x.ai/v1",
		"compat": { "supportsLongCacheRetention": false },
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 2,
			"output": 6,
			"cacheRead": .3,
			"cacheWrite": 0
		},
		"contextWindow": 5e5,
		"maxTokens": 5e5,
		"thinkingLevelMap": {
			"off": null,
			"minimal": null,
			"low": "low",
			"medium": "medium",
			"high": "high",
			"xhigh": null,
			"max": null
		}
	} }
});
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/xiaomi.models.js
const XIAOMI_MODELS = flattenModelCatalog("xiaomi", { "openai-completions": {
	"mimo-v2-flash": {
		"id": "mimo-v2-flash",
		"name": "MiMo-V2-Flash",
		"api": "openai-completions",
		"provider": "xiaomi",
		"baseUrl": "https://api.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .14,
			"output": .28,
			"cacheRead": .0028,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 65536
	},
	"mimo-v2-omni": {
		"id": "mimo-v2-omni",
		"name": "MiMo-V2-Omni",
		"api": "openai-completions",
		"provider": "xiaomi",
		"baseUrl": "https://api.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .14,
			"output": .28,
			"cacheRead": .0028,
			"cacheWrite": 0
		},
		"contextWindow": 262144,
		"maxTokens": 131072
	},
	"mimo-v2-pro": {
		"id": "mimo-v2-pro",
		"name": "MiMo-V2-Pro",
		"api": "openai-completions",
		"provider": "xiaomi",
		"baseUrl": "https://api.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .435,
			"output": .87,
			"cacheRead": .0036,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072
	},
	"mimo-v2.5": {
		"id": "mimo-v2.5",
		"name": "MiMo-V2.5",
		"api": "openai-completions",
		"provider": "xiaomi",
		"baseUrl": "https://api.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": .14,
			"output": .28,
			"cacheRead": .0028,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072
	},
	"mimo-v2.5-pro": {
		"id": "mimo-v2.5-pro",
		"name": "MiMo-V2.5-Pro",
		"api": "openai-completions",
		"provider": "xiaomi",
		"baseUrl": "https://api.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": .435,
			"output": .87,
			"cacheRead": .0036,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072
	},
	"mimo-v2.5-pro-ultraspeed": {
		"id": "mimo-v2.5-pro-ultraspeed",
		"name": "MiMo-V2.5-Pro-UltraSpeed",
		"api": "openai-completions",
		"provider": "xiaomi",
		"baseUrl": "https://api.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 1.305,
			"output": 2.61,
			"cacheRead": .0108,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/xiaomi-token-plan-ams.models.js
const XIAOMI_TOKEN_PLAN_AMS_MODELS = flattenModelCatalog("xiaomi-token-plan-ams", { "openai-completions": {
	"mimo-v2-pro": {
		"id": "mimo-v2-pro",
		"name": "MiMo-V2-Pro",
		"api": "openai-completions",
		"provider": "xiaomi-token-plan-ams",
		"baseUrl": "https://token-plan-ams.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072
	},
	"mimo-v2.5": {
		"id": "mimo-v2.5",
		"name": "MiMo-V2.5",
		"api": "openai-completions",
		"provider": "xiaomi-token-plan-ams",
		"baseUrl": "https://token-plan-ams.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072
	},
	"mimo-v2.5-pro": {
		"id": "mimo-v2.5-pro",
		"name": "MiMo-V2.5-Pro",
		"api": "openai-completions",
		"provider": "xiaomi-token-plan-ams",
		"baseUrl": "https://token-plan-ams.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/xiaomi-token-plan-cn.models.js
const XIAOMI_TOKEN_PLAN_CN_MODELS = flattenModelCatalog("xiaomi-token-plan-cn", { "openai-completions": {
	"mimo-v2-pro": {
		"id": "mimo-v2-pro",
		"name": "MiMo-V2-Pro",
		"api": "openai-completions",
		"provider": "xiaomi-token-plan-cn",
		"baseUrl": "https://token-plan-cn.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072
	},
	"mimo-v2.5": {
		"id": "mimo-v2.5",
		"name": "MiMo-V2.5",
		"api": "openai-completions",
		"provider": "xiaomi-token-plan-cn",
		"baseUrl": "https://token-plan-cn.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072
	},
	"mimo-v2.5-pro": {
		"id": "mimo-v2.5-pro",
		"name": "MiMo-V2.5-Pro",
		"api": "openai-completions",
		"provider": "xiaomi-token-plan-cn",
		"baseUrl": "https://token-plan-cn.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/xiaomi-token-plan-sgp.models.js
const XIAOMI_TOKEN_PLAN_SGP_MODELS = flattenModelCatalog("xiaomi-token-plan-sgp", { "openai-completions": {
	"mimo-v2-pro": {
		"id": "mimo-v2-pro",
		"name": "MiMo-V2-Pro",
		"api": "openai-completions",
		"provider": "xiaomi-token-plan-sgp",
		"baseUrl": "https://token-plan-sgp.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072
	},
	"mimo-v2.5": {
		"id": "mimo-v2.5",
		"name": "MiMo-V2.5",
		"api": "openai-completions",
		"provider": "xiaomi-token-plan-sgp",
		"baseUrl": "https://token-plan-sgp.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072
	},
	"mimo-v2.5-pro": {
		"id": "mimo-v2.5-pro",
		"name": "MiMo-V2.5-Pro",
		"api": "openai-completions",
		"provider": "xiaomi-token-plan-sgp",
		"baseUrl": "https://token-plan-sgp.xiaomimimo.com/v1",
		"compat": {
			"requiresReasoningContentOnAssistantMessages": true,
			"thinkingFormat": "deepseek"
		},
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"contextWindow": 1048576,
		"maxTokens": 131072
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/zai.models.js
const ZAI_MODELS = flattenModelCatalog("zai", { "openai-completions": {
	"glm-4.5-air": {
		"id": "glm-4.5-air",
		"name": "GLM-4.5-Air",
		"api": "openai-completions",
		"provider": "zai",
		"baseUrl": "https://api.z.ai/api/coding/paas/v4",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"thinkingFormat": "zai"
		},
		"contextWindow": 131072,
		"maxTokens": 98304
	},
	"glm-4.7": {
		"id": "glm-4.7",
		"name": "GLM-4.7",
		"api": "openai-completions",
		"provider": "zai",
		"baseUrl": "https://api.z.ai/api/coding/paas/v4",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"thinkingFormat": "zai",
			"zaiToolStream": true
		},
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"glm-5-turbo": {
		"id": "glm-5-turbo",
		"name": "GLM-5-Turbo",
		"api": "openai-completions",
		"provider": "zai",
		"baseUrl": "https://api.z.ai/api/coding/paas/v4",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"thinkingFormat": "zai",
			"zaiToolStream": true
		},
		"contextWindow": 2e5,
		"maxTokens": 131072
	},
	"glm-5.1": {
		"id": "glm-5.1",
		"name": "GLM-5.1",
		"api": "openai-completions",
		"provider": "zai",
		"baseUrl": "https://api.z.ai/api/coding/paas/v4",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"thinkingFormat": "zai",
			"zaiToolStream": true
		},
		"contextWindow": 2e5,
		"maxTokens": 131072
	},
	"glm-5.2": {
		"id": "glm-5.2",
		"name": "GLM-5.2",
		"api": "openai-completions",
		"provider": "zai",
		"baseUrl": "https://api.z.ai/api/coding/paas/v4",
		"reasoning": true,
		"thinkingLevelMap": {
			"minimal": null,
			"low": "high",
			"medium": "high",
			"high": "high",
			"max": "max"
		},
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": true,
			"thinkingFormat": "zai",
			"zaiToolStream": true
		},
		"contextWindow": 1e6,
		"maxTokens": 131072
	},
	"glm-5v-turbo": {
		"id": "glm-5v-turbo",
		"name": "GLM-5V-Turbo",
		"api": "openai-completions",
		"provider": "zai",
		"baseUrl": "https://api.z.ai/api/coding/paas/v4",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"thinkingFormat": "zai",
			"zaiToolStream": true
		},
		"contextWindow": 2e5,
		"maxTokens": 131072
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/zai-coding-cn.models.js
const ZAI_CODING_CN_MODELS = flattenModelCatalog("zai-coding-cn", { "openai-completions": {
	"glm-4.5-air": {
		"id": "glm-4.5-air",
		"name": "GLM-4.5-Air",
		"api": "openai-completions",
		"provider": "zai-coding-cn",
		"baseUrl": "https://open.bigmodel.cn/api/coding/paas/v4",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"thinkingFormat": "zai"
		},
		"contextWindow": 131072,
		"maxTokens": 98304
	},
	"glm-4.7": {
		"id": "glm-4.7",
		"name": "GLM-4.7",
		"api": "openai-completions",
		"provider": "zai-coding-cn",
		"baseUrl": "https://open.bigmodel.cn/api/coding/paas/v4",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"thinkingFormat": "zai",
			"zaiToolStream": true
		},
		"contextWindow": 204800,
		"maxTokens": 131072
	},
	"glm-5-turbo": {
		"id": "glm-5-turbo",
		"name": "GLM-5-Turbo",
		"api": "openai-completions",
		"provider": "zai-coding-cn",
		"baseUrl": "https://open.bigmodel.cn/api/coding/paas/v4",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"thinkingFormat": "zai",
			"zaiToolStream": true
		},
		"contextWindow": 2e5,
		"maxTokens": 131072
	},
	"glm-5.1": {
		"id": "glm-5.1",
		"name": "GLM-5.1",
		"api": "openai-completions",
		"provider": "zai-coding-cn",
		"baseUrl": "https://open.bigmodel.cn/api/coding/paas/v4",
		"reasoning": true,
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"thinkingFormat": "zai",
			"zaiToolStream": true
		},
		"contextWindow": 2e5,
		"maxTokens": 131072
	},
	"glm-5.2": {
		"id": "glm-5.2",
		"name": "GLM-5.2",
		"api": "openai-completions",
		"provider": "zai-coding-cn",
		"baseUrl": "https://open.bigmodel.cn/api/coding/paas/v4",
		"reasoning": true,
		"thinkingLevelMap": {
			"minimal": null,
			"low": "high",
			"medium": "high",
			"high": "high",
			"max": "max"
		},
		"input": ["text"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": true,
			"thinkingFormat": "zai",
			"zaiToolStream": true
		},
		"contextWindow": 1e6,
		"maxTokens": 131072
	},
	"glm-5v-turbo": {
		"id": "glm-5v-turbo",
		"name": "GLM-5V-Turbo",
		"api": "openai-completions",
		"provider": "zai-coding-cn",
		"baseUrl": "https://open.bigmodel.cn/api/coding/paas/v4",
		"reasoning": true,
		"input": ["text", "image"],
		"cost": {
			"input": 0,
			"output": 0,
			"cacheRead": 0,
			"cacheWrite": 0
		},
		"compat": {
			"supportsStore": false,
			"supportsDeveloperRole": false,
			"supportsReasoningEffort": false,
			"thinkingFormat": "zai",
			"zaiToolStream": true
		},
		"contextWindow": 2e5,
		"maxTokens": 131072
	}
} });
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/models.generated.js
const MODELS = {
	"amazon-bedrock": AMAZON_BEDROCK_MODELS,
	"ant-ling": ANT_LING_MODELS,
	"anthropic": ANTHROPIC_MODELS,
	"azure-openai-responses": AZURE_OPENAI_RESPONSES_MODELS,
	"cerebras": CEREBRAS_MODELS,
	"cloudflare-ai-gateway": CLOUDFLARE_AI_GATEWAY_MODELS,
	"cloudflare-workers-ai": CLOUDFLARE_WORKERS_AI_MODELS,
	"deepseek": DEEPSEEK_MODELS,
	"fireworks": FIREWORKS_MODELS,
	"github-copilot": GITHUB_COPILOT_MODELS,
	"google": GOOGLE_MODELS,
	"google-vertex": GOOGLE_VERTEX_MODELS,
	"groq": GROQ_MODELS,
	"huggingface": HUGGINGFACE_MODELS,
	"kimi-coding": KIMI_CODING_MODELS,
	"minimax": MINIMAX_MODELS,
	"minimax-cn": MINIMAX_CN_MODELS,
	"mistral": MISTRAL_MODELS,
	"moonshotai": MOONSHOTAI_MODELS,
	"moonshotai-cn": MOONSHOTAI_CN_MODELS,
	"nvidia": NVIDIA_MODELS,
	"openai": OPENAI_MODELS,
	"openai-codex": OPENAI_CODEX_MODELS,
	"opencode": OPENCODE_MODELS,
	"opencode-go": OPENCODE_GO_MODELS,
	"openrouter": OPENROUTER_MODELS,
	"qwen-token-plan": QWEN_TOKEN_PLAN_MODELS,
	"qwen-token-plan-cn": QWEN_TOKEN_PLAN_CN_MODELS,
	"together": TOGETHER_MODELS,
	"vercel-ai-gateway": VERCEL_AI_GATEWAY_MODELS,
	"xai": XAI_MODELS,
	"xiaomi": XIAOMI_MODELS,
	"xiaomi-token-plan-ams": XIAOMI_TOKEN_PLAN_AMS_MODELS,
	"xiaomi-token-plan-cn": XIAOMI_TOKEN_PLAN_CN_MODELS,
	"xiaomi-token-plan-sgp": XIAOMI_TOKEN_PLAN_SGP_MODELS,
	"zai": ZAI_MODELS,
	"zai-coding-cn": ZAI_CODING_CN_MODELS
};
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/api/bedrock-converse-stream.lazy.js
var __rewriteRelativeImportExtension$2 = function(path, preserveJsx) {
	if (typeof path === "string" && /^\.\.?\//.test(path)) return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
		return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
	});
	return path;
};
/**
* Loads the bedrock implementation through a variable specifier so bundlers
* (browser smoke, Bun compile) cannot follow the import into the Node-only
* AWS SDK. The `.ts`/`.js` rewrite keeps the trick working from both source
* and built output.
*/
const importNodeOnlyApi = (specifier) => {
	return import(__rewriteRelativeImportExtension$2(import.meta.url.endsWith(".js") ? specifier.replace(/\.ts$/, ".js") : specifier));
};
const bedrockConverseStreamApi = () => lazyApi(async () => await importNodeOnlyApi("./bedrock-converse-stream.ts"));
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/amazon-bedrock.js
/**
* Bedrock accepts a bearer token or the AWS SDK's default credential chain.
* The login flow can store a token/profile choice; resolve also detects ambient
* AWS credentials without copying them into pi's credential store.
*/
const bedrockAuth = {
	name: "AWS credentials or bearer token",
	login: async (interaction) => {
		const method = await interaction.prompt({
			type: "select",
			message: "Select Amazon Bedrock authentication method:",
			options: [
				{
					id: "bearer-token",
					label: "Bearer token"
				},
				{
					id: "aws-profile",
					label: "AWS profile"
				},
				{
					id: "credential-chain",
					label: "Existing AWS credential chain"
				}
			]
		});
		if (method === "bearer-token") return {
			type: "api_key",
			key: await interaction.prompt({
				type: "secret",
				message: "Enter Amazon Bedrock bearer token"
			})
		};
		interaction.notify({
			type: "info",
			message: "Amazon Bedrock supports AWS profiles, IAM credentials, and role-based credentials.",
			links: [{
				label: "AWS credential provider chain",
				url: "https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html"
			}]
		});
		if (method === "aws-profile") return {
			type: "api_key",
			env: { AWS_PROFILE: await interaction.prompt({
				type: "text",
				message: "Enter AWS profile name"
			}) }
		};
		if (method !== "credential-chain") throw new Error(`Unknown Amazon Bedrock auth method: ${method}`);
		await interaction.prompt({
			type: "text",
			message: "Configure AWS credentials, then press Enter to continue"
		});
		return { type: "api_key" };
	},
	resolve: async ({ ctx, credential }) => {
		if (credential?.key) return {
			auth: { apiKey: credential.key },
			env: credential.env,
			source: "stored credential"
		};
		if (await ctx.env("AWS_BEARER_TOKEN_BEDROCK")) return {
			auth: {},
			source: "AWS_BEARER_TOKEN_BEDROCK"
		};
		if (credential?.env?.AWS_PROFILE ?? await ctx.env("AWS_PROFILE")) return {
			auth: {},
			env: credential?.env,
			source: credential?.env?.AWS_PROFILE ? "stored credential" : "AWS_PROFILE"
		};
		if (await ctx.env("AWS_ACCESS_KEY_ID") && await ctx.env("AWS_SECRET_ACCESS_KEY")) return {
			auth: {},
			source: "AWS access keys"
		};
		if (await ctx.env("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI")) return {
			auth: {},
			source: "ECS task role"
		};
		if (await ctx.env("AWS_CONTAINER_CREDENTIALS_FULL_URI")) return {
			auth: {},
			source: "ECS task role"
		};
		if (await ctx.env("AWS_WEB_IDENTITY_TOKEN_FILE")) return {
			auth: {},
			source: "web identity token"
		};
	}
};
function amazonBedrockProvider() {
	return createProvider({
		id: "amazon-bedrock",
		name: "Amazon Bedrock",
		auth: { apiKey: bedrockAuth },
		models: Object.values(AMAZON_BEDROCK_MODELS),
		api: bedrockConverseStreamApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/api/openai-completions.lazy.js
const openAICompletionsApi = () => lazyApi(() => import("./openai-completions-DDlsvp9l.mjs"));
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/ant-ling.js
function antLingProvider() {
	return createProvider({
		id: "ant-ling",
		name: "Ant Ling",
		baseUrl: "https://api.ant-ling.com/v1",
		auth: { apiKey: envApiKeyAuth("Ant Ling API key", ["ANT_LING_API_KEY"]) },
		models: Object.values(ANT_LING_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/api/anthropic-messages.lazy.js
const anthropicMessagesApi = () => lazyApi(() => import("./anthropic-messages-BLx7gmlM.mjs"));
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/auth/oauth/load.js
var __rewriteRelativeImportExtension$1 = function(path, preserveJsx) {
	if (typeof path === "string" && /^\.\.?\//.test(path)) return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
		return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
	});
	return path;
};
/**
* Loads an OAuth flow module through a variable specifier so bundlers cannot
* follow the import into Node-only flow code (`node:http` callback servers,
* `node:crypto` PKCE). The `.ts`/`.js` rewrite keeps the trick working from
* both source and built output.
*/
const importOAuthModule = (specifier) => {
	return import(__rewriteRelativeImportExtension$1(import.meta.url.endsWith(".js") ? specifier.replace(/\.ts$/, ".js") : specifier));
};
const loadAnthropicOAuth = async () => {
	return (await importOAuthModule("./anthropic.ts")).anthropicOAuth;
};
const loadOpenAICodexOAuth = async () => {
	return (await importOAuthModule("./openai-codex.ts")).openaiCodexOAuth;
};
const loadGitHubCopilotOAuth = async () => {
	return (await importOAuthModule("./github-copilot.ts")).githubCopilotOAuth;
};
const loadOpenRouterOAuth = async () => {
	return (await importOAuthModule("./openrouter.ts")).openRouterOAuth;
};
const loadKimiCodingOAuth = async () => {
	return (await importOAuthModule("./kimi-coding.ts")).kimiCodingOAuth;
};
const loadXaiOAuth = async () => {
	return (await importOAuthModule("./xai.ts")).xaiOAuth;
};
const loadRadiusOAuth = async (options) => {
	return (await importOAuthModule("./radius.ts")).createRadiusOAuth(options);
};
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/env-api-keys.js
var __rewriteRelativeImportExtension = function(path, preserveJsx) {
	if (typeof path === "string" && /^\.\.?\//.test(path)) return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
		return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
	});
	return path;
};
const dynamicImport = (specifier) => import(__rewriteRelativeImportExtension(specifier));
const NODE_FS_SPECIFIER = "node:fs";
const NODE_OS_SPECIFIER = "node:os";
const NODE_PATH_SPECIFIER = "node:path";
if (typeof process !== "undefined" && (process.versions?.node || process.versions?.bun)) {
	dynamicImport(NODE_FS_SPECIFIER).then((m) => {
		m.existsSync;
	});
	dynamicImport(NODE_OS_SPECIFIER).then((m) => {
		m.homedir;
	});
	dynamicImport(NODE_PATH_SPECIFIER).then((m) => {
		m.join;
	});
}
const ANTHROPIC_AUTH_TOKEN_ENV = "ANTHROPIC_AUTH_TOKEN";
const ANTHROPIC_OAUTH_TOKEN_ENV = "ANTHROPIC_OAUTH_TOKEN";
const ANTHROPIC_API_KEY_ENV = "ANTHROPIC_API_KEY";
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/anthropic.js
function anthropicApiKeyAuth() {
	return {
		name: "Anthropic API key",
		login: async (interaction) => ({
			type: "api_key",
			key: await interaction.prompt({
				type: "secret",
				message: "Enter Anthropic API key"
			})
		}),
		resolve: async ({ ctx, credential }) => {
			if (credential?.key) return {
				auth: { apiKey: credential.key },
				env: credential.env,
				source: "stored credential"
			};
			const authToken = await ctx.env(ANTHROPIC_AUTH_TOKEN_ENV);
			if (authToken) return {
				auth: { headers: { Authorization: `Bearer ${authToken}` } },
				source: ANTHROPIC_AUTH_TOKEN_ENV
			};
			for (const envVar of [ANTHROPIC_OAUTH_TOKEN_ENV, ANTHROPIC_API_KEY_ENV]) {
				const apiKey = await ctx.env(envVar);
				if (apiKey) return {
					auth: { apiKey },
					source: envVar
				};
			}
		}
	};
}
function anthropicProvider() {
	return createProvider({
		id: "anthropic",
		name: "Anthropic",
		baseUrl: "https://api.anthropic.com",
		auth: {
			apiKey: anthropicApiKeyAuth(),
			oauth: lazyOAuth({
				name: "Anthropic (Claude Pro/Max)",
				load: loadAnthropicOAuth
			})
		},
		models: Object.values(ANTHROPIC_MODELS),
		api: anthropicMessagesApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/api/azure-openai-responses.lazy.js
const azureOpenAIResponsesApi = () => lazyApi(() => import("./azure-openai-responses-08mAraMS.mjs"));
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/azure-openai-responses.js
function azureOpenAIResponsesProvider() {
	return createProvider({
		id: "azure-openai-responses",
		name: "Azure OpenAI",
		auth: { apiKey: envApiKeyAuth("Azure OpenAI API key", ["AZURE_OPENAI_API_KEY"]) },
		models: Object.values(AZURE_OPENAI_RESPONSES_MODELS),
		api: azureOpenAIResponsesApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/cerebras.js
function cerebrasProvider() {
	return createProvider({
		id: "cerebras",
		name: "Cerebras",
		baseUrl: "https://api.cerebras.ai/v1",
		auth: { apiKey: envApiKeyAuth("Cerebras API key", ["CEREBRAS_API_KEY"]) },
		models: Object.values(CEREBRAS_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/api/openai-responses.lazy.js
const openAIResponsesApi = () => lazyApi(() => import("./openai-responses-BIztSSoY.mjs"));
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/cloudflare-auth.js
const CLOUDFLARE_API_KEY = "CLOUDFLARE_API_KEY";
const CLOUDFLARE_ACCOUNT_ID$1 = "CLOUDFLARE_ACCOUNT_ID";
const CLOUDFLARE_GATEWAY_ID$1 = "CLOUDFLARE_GATEWAY_ID";
async function resolveValue(name, ctx, credential) {
	return (credential ? name === CLOUDFLARE_API_KEY ? credential.key : credential.env?.[name] : void 0) ?? await ctx.env(name);
}
async function resolveCloudflareEnv(kind, ctx, credential) {
	const apiKey = await resolveValue(CLOUDFLARE_API_KEY, ctx, credential);
	const accountId = await resolveValue(CLOUDFLARE_ACCOUNT_ID$1, ctx, credential);
	const gatewayId = kind === "ai-gateway" ? await resolveValue(CLOUDFLARE_GATEWAY_ID$1, ctx, credential) : void 0;
	if (!apiKey || !accountId || kind === "ai-gateway" && !gatewayId) return void 0;
	return {
		apiKey,
		env: {
			CLOUDFLARE_ACCOUNT_ID: accountId,
			...gatewayId ? { CLOUDFLARE_GATEWAY_ID: gatewayId } : {}
		},
		source: credential ? "stored credential" : CLOUDFLARE_API_KEY
	};
}
function cloudflareWorkersAIAuth() {
	return {
		name: "Cloudflare API key",
		login: async (interaction) => {
			return {
				type: "api_key",
				key: await interaction.prompt({
					type: "secret",
					message: "Enter Cloudflare API key"
				}),
				env: { CLOUDFLARE_ACCOUNT_ID: await interaction.prompt({
					type: "text",
					message: "Enter Cloudflare account ID"
				}) }
			};
		},
		resolve: async ({ ctx, credential }) => {
			const resolved = await resolveCloudflareEnv("workers-ai", ctx, credential);
			if (!resolved) return void 0;
			return {
				auth: { apiKey: resolved.apiKey },
				env: resolved.env,
				source: resolved.source
			};
		}
	};
}
function cloudflareAIGatewayAuth() {
	return {
		name: "Cloudflare API key",
		login: async (interaction) => {
			return {
				type: "api_key",
				key: await interaction.prompt({
					type: "secret",
					message: "Enter Cloudflare API key"
				}),
				env: {
					CLOUDFLARE_ACCOUNT_ID: await interaction.prompt({
						type: "text",
						message: "Enter Cloudflare account ID"
					}),
					CLOUDFLARE_GATEWAY_ID: await interaction.prompt({
						type: "text",
						message: "Enter Cloudflare AI Gateway ID"
					})
				}
			};
		},
		resolve: async ({ ctx, credential }) => {
			const resolved = await resolveCloudflareEnv("ai-gateway", ctx, credential);
			if (!resolved) return void 0;
			return {
				auth: { headers: {
					"cf-aig-authorization": `Bearer ${resolved.apiKey}`,
					Authorization: null,
					"x-api-key": null
				} },
				env: resolved.env,
				source: resolved.source
			};
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/cloudflare-stream.js
const CLOUDFLARE_ACCOUNT_ID = "CLOUDFLARE_ACCOUNT_ID";
const CLOUDFLARE_GATEWAY_ID = "CLOUDFLARE_GATEWAY_ID";
function resolveCloudflareModel(model, env) {
	if (!env) return model;
	const baseUrl = model.baseUrl.replaceAll(`{${CLOUDFLARE_ACCOUNT_ID}}`, env[CLOUDFLARE_ACCOUNT_ID] ?? `{${CLOUDFLARE_ACCOUNT_ID}}`).replaceAll(`{${CLOUDFLARE_GATEWAY_ID}}`, env[CLOUDFLARE_GATEWAY_ID] ?? `{${CLOUDFLARE_GATEWAY_ID}}`);
	return baseUrl === model.baseUrl ? model : {
		...model,
		baseUrl
	};
}
/**
* Wrap an API implementation so Cloudflare account/gateway endpoint
* placeholders materialize from the resolved provider env before dispatch.
*/
function cloudflareStreams(streams) {
	return {
		stream: (model, context, options) => streams.stream(resolveCloudflareModel(model, options?.env), context, options),
		streamSimple: (model, context, options) => streams.streamSimple(resolveCloudflareModel(model, options?.env), context, options)
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/cloudflare-ai-gateway.js
function cloudflareAIGatewayProvider() {
	return createProvider({
		id: "cloudflare-ai-gateway",
		name: "Cloudflare AI Gateway",
		auth: { apiKey: cloudflareAIGatewayAuth() },
		models: Object.values(CLOUDFLARE_AI_GATEWAY_MODELS),
		api: {
			"anthropic-messages": cloudflareStreams(anthropicMessagesApi()),
			"openai-completions": cloudflareStreams(openAICompletionsApi()),
			"openai-responses": cloudflareStreams(openAIResponsesApi())
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/cloudflare-workers-ai.js
function cloudflareWorkersAIProvider() {
	return createProvider({
		id: "cloudflare-workers-ai",
		name: "Cloudflare Workers AI",
		auth: { apiKey: cloudflareWorkersAIAuth() },
		models: Object.values(CLOUDFLARE_WORKERS_AI_MODELS),
		api: cloudflareStreams(openAICompletionsApi())
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/deepseek.js
function deepseekProvider() {
	return createProvider({
		id: "deepseek",
		name: "DeepSeek",
		baseUrl: "https://api.deepseek.com",
		auth: { apiKey: envApiKeyAuth("DeepSeek API key", ["DEEPSEEK_API_KEY"]) },
		models: Object.values(DEEPSEEK_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/fireworks.js
function fireworksProvider() {
	return createProvider({
		id: "fireworks",
		name: "Fireworks",
		baseUrl: "https://api.fireworks.ai/inference",
		auth: { apiKey: envApiKeyAuth("Fireworks API key", ["FIREWORKS_API_KEY"]) },
		models: Object.values(FIREWORKS_MODELS),
		api: {
			"anthropic-messages": anthropicMessagesApi(),
			"openai-completions": openAICompletionsApi()
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/github-copilot.js
function githubCopilotProvider() {
	return createProvider({
		id: "github-copilot",
		name: "GitHub Copilot",
		baseUrl: "https://api.individual.githubcopilot.com",
		auth: {
			apiKey: envApiKeyAuth("GitHub Copilot token", ["COPILOT_GITHUB_TOKEN"]),
			oauth: lazyOAuth({
				name: "GitHub Copilot",
				load: loadGitHubCopilotOAuth
			})
		},
		models: Object.values(GITHUB_COPILOT_MODELS),
		filterModels: (models, credential) => {
			if (credential?.type !== "oauth") return models;
			const availableModelIds = credential.availableModelIds;
			if (!Array.isArray(availableModelIds) || !availableModelIds.every((id) => typeof id === "string")) return models;
			const available = new Set(availableModelIds);
			return models.filter((model) => available.has(model.id));
		},
		api: {
			"anthropic-messages": anthropicMessagesApi(),
			"openai-completions": openAICompletionsApi(),
			"openai-responses": openAIResponsesApi()
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/api/google-generative-ai.lazy.js
const googleGenerativeAIApi = () => lazyApi(() => import("./google-generative-ai-Rk-F0ytY.mjs"));
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/google.js
function googleProvider() {
	return createProvider({
		id: "google",
		name: "Google",
		baseUrl: "https://generativelanguage.googleapis.com/v1beta",
		auth: { apiKey: envApiKeyAuth("Gemini API key", ["GEMINI_API_KEY"]) },
		models: Object.values(GOOGLE_MODELS),
		api: googleGenerativeAIApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/api/google-vertex.lazy.js
const googleVertexApi = () => lazyApi(() => import("./google-vertex-DsukD0JS.mjs"));
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/google-vertex.js
const VERTEX_ADC_PATH = "~/.config/gcloud/application_default_credentials.json";
/**
* Vertex accepts an explicit API key or Application Default Credentials
* (`gcloud auth application-default login`). ADC additionally requires
* project and location env vars, which the implementation reads itself.
*/
const vertexAuth = {
	name: "Google Cloud credentials",
	login: async (interaction) => {
		const method = await interaction.prompt({
			type: "select",
			message: "Select Google Vertex AI authentication method:",
			options: [
				{
					id: "api-key",
					label: "Google Cloud API key"
				},
				{
					id: "adc",
					label: "Application Default Credentials"
				},
				{
					id: "service-account",
					label: "Service account credentials file"
				}
			]
		});
		if (method === "api-key") return {
			type: "api_key",
			key: await interaction.prompt({
				type: "secret",
				message: "Enter Google Cloud API key"
			})
		};
		if (method !== "adc" && method !== "service-account") throw new Error(`Unknown Google Vertex AI auth method: ${method}`);
		interaction.notify({
			type: "info",
			message: method === "adc" ? "Run `gcloud auth application-default login`, then provide the project and location." : "Provide a service account credentials file, project, and location.",
			links: [{
				label: "Application Default Credentials",
				url: "https://cloud.google.com/docs/authentication/provide-credentials-adc"
			}]
		});
		const project = await interaction.prompt({
			type: "text",
			message: "Enter Google Cloud project ID"
		});
		const location = await interaction.prompt({
			type: "text",
			message: "Enter Google Cloud location"
		});
		const credentialsPath = method === "service-account" ? await interaction.prompt({
			type: "text",
			message: "Enter service account credentials file path"
		}) : void 0;
		return {
			type: "api_key",
			env: {
				GOOGLE_CLOUD_PROJECT: project,
				GOOGLE_CLOUD_LOCATION: location,
				...credentialsPath ? { GOOGLE_APPLICATION_CREDENTIALS: credentialsPath } : {}
			}
		};
	},
	resolve: async ({ ctx, credential }) => {
		const key = credential?.key ?? await ctx.env("GOOGLE_CLOUD_API_KEY");
		if (key) return {
			auth: { apiKey: key },
			source: credential?.key ? "stored credential" : "GOOGLE_CLOUD_API_KEY"
		};
		const adcPath = credential?.env?.GOOGLE_APPLICATION_CREDENTIALS ?? await ctx.env("GOOGLE_APPLICATION_CREDENTIALS");
		const hasCredentials = await ctx.fileExists(adcPath ?? VERTEX_ADC_PATH);
		const project = credential?.env?.GOOGLE_CLOUD_PROJECT ?? await ctx.env("GOOGLE_CLOUD_PROJECT") ?? await ctx.env("GCLOUD_PROJECT");
		const location = credential?.env?.GOOGLE_CLOUD_LOCATION ?? await ctx.env("GOOGLE_CLOUD_LOCATION");
		if (hasCredentials && project && location) return {
			auth: {},
			env: credential?.env,
			source: credential ? "stored credential" : "gcloud application default credentials"
		};
	}
};
function googleVertexProvider() {
	return createProvider({
		id: "google-vertex",
		name: "Google Vertex AI",
		auth: { apiKey: vertexAuth },
		models: Object.values(GOOGLE_VERTEX_MODELS),
		api: googleVertexApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/groq.js
function groqProvider() {
	return createProvider({
		id: "groq",
		name: "Groq",
		baseUrl: "https://api.groq.com/openai/v1",
		auth: { apiKey: envApiKeyAuth("Groq API key", ["GROQ_API_KEY"]) },
		models: Object.values(GROQ_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/huggingface.js
function huggingfaceProvider() {
	return createProvider({
		id: "huggingface",
		name: "Hugging Face",
		baseUrl: "https://router.huggingface.co/v1",
		auth: { apiKey: envApiKeyAuth("Hugging Face token", ["HF_TOKEN"]) },
		models: Object.values(HUGGINGFACE_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/kimi-coding.js
function kimiCodingProvider() {
	return createProvider({
		id: "kimi-coding",
		name: "Kimi For Coding",
		baseUrl: "https://api.kimi.com/coding",
		auth: {
			apiKey: envApiKeyAuth("Kimi API key", ["KIMI_API_KEY"]),
			oauth: lazyOAuth({
				name: "Kimi Code (subscription)",
				loginLabel: "Sign in with Kimi Code",
				load: loadKimiCodingOAuth
			})
		},
		models: Object.values(KIMI_CODING_MODELS),
		api: anthropicMessagesApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/minimax.js
function minimaxProvider() {
	return createProvider({
		id: "minimax",
		name: "MiniMax",
		baseUrl: "https://api.minimax.io/anthropic",
		auth: { apiKey: envApiKeyAuth("MiniMax API key", ["MINIMAX_API_KEY"]) },
		models: Object.values(MINIMAX_MODELS),
		api: anthropicMessagesApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/minimax-cn.js
function minimaxCnProvider() {
	return createProvider({
		id: "minimax-cn",
		name: "MiniMax CN",
		baseUrl: "https://api.minimaxi.com/anthropic",
		auth: { apiKey: envApiKeyAuth("MiniMax CN API key", ["MINIMAX_CN_API_KEY"]) },
		models: Object.values(MINIMAX_CN_MODELS),
		api: anthropicMessagesApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/api/mistral-conversations.lazy.js
const mistralConversationsApi = () => lazyApi(() => import("./mistral-conversations-MZmLjT1q.mjs"));
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/mistral.js
function mistralProvider() {
	return createProvider({
		id: "mistral",
		name: "Mistral",
		baseUrl: "https://api.mistral.ai",
		auth: { apiKey: envApiKeyAuth("Mistral API key", ["MISTRAL_API_KEY"]) },
		models: Object.values(MISTRAL_MODELS),
		api: mistralConversationsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/moonshotai.js
function moonshotaiProvider() {
	return createProvider({
		id: "moonshotai",
		name: "Moonshot AI",
		baseUrl: "https://api.moonshot.ai/v1",
		auth: { apiKey: envApiKeyAuth("Moonshot AI API key", ["MOONSHOT_API_KEY"]) },
		models: Object.values(MOONSHOTAI_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/moonshotai-cn.js
function moonshotaiCnProvider() {
	return createProvider({
		id: "moonshotai-cn",
		name: "Moonshot AI CN",
		baseUrl: "https://api.moonshot.cn/v1",
		auth: { apiKey: envApiKeyAuth("Moonshot AI API key", ["MOONSHOT_API_KEY"]) },
		models: Object.values(MOONSHOTAI_CN_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/nvidia.js
function nvidiaProvider() {
	return createProvider({
		id: "nvidia",
		name: "NVIDIA",
		baseUrl: "https://integrate.api.nvidia.com/v1",
		auth: { apiKey: envApiKeyAuth("NVIDIA API key", ["NVIDIA_API_KEY"]) },
		models: Object.values(NVIDIA_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/openai.js
function openaiProvider() {
	return createProvider({
		id: "openai",
		name: "OpenAI",
		baseUrl: "https://api.openai.com/v1",
		auth: { apiKey: envApiKeyAuth("OpenAI API key", ["OPENAI_API_KEY"]) },
		models: Object.values(OPENAI_MODELS),
		api: openAIResponsesApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/api/openai-codex-responses.lazy.js
const openAICodexResponsesApi = () => lazyApi(() => import("./openai-codex-responses-Dk6hSn5w.mjs"));
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/openai-codex.js
function openaiCodexProvider() {
	return createProvider({
		id: "openai-codex",
		name: "OpenAI Codex",
		baseUrl: "https://chatgpt.com/backend-api",
		auth: { oauth: lazyOAuth({
			name: "OpenAI (ChatGPT Plus/Pro)",
			load: loadOpenAICodexOAuth
		}) },
		models: Object.values(OPENAI_CODEX_MODELS),
		api: openAICodexResponsesApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/opencode.js
function opencodeProvider() {
	return createProvider({
		id: "opencode",
		name: "OpenCode Zen",
		auth: { apiKey: envApiKeyAuth("OpenCode API key", ["OPENCODE_API_KEY"]) },
		models: Object.values(OPENCODE_MODELS),
		api: {
			"anthropic-messages": anthropicMessagesApi(),
			"google-generative-ai": googleGenerativeAIApi(),
			"openai-completions": openAICompletionsApi(),
			"openai-responses": openAIResponsesApi()
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/opencode-go.js
function opencodeGoProvider() {
	return createProvider({
		id: "opencode-go",
		name: "OpenCode Zen Go",
		auth: { apiKey: envApiKeyAuth("OpenCode API key", ["OPENCODE_API_KEY"]) },
		models: Object.values(OPENCODE_GO_MODELS),
		api: {
			"anthropic-messages": anthropicMessagesApi(),
			"openai-completions": openAICompletionsApi(),
			"openai-responses": openAIResponsesApi()
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/openrouter.js
function openrouterProvider() {
	return createProvider({
		id: "openrouter",
		name: "OpenRouter",
		baseUrl: "https://openrouter.ai/api/v1",
		auth: {
			apiKey: envApiKeyAuth("OpenRouter API key", ["OPENROUTER_API_KEY"]),
			oauth: lazyOAuth({
				name: "OpenRouter OAuth",
				loginLabel: "Sign in with OpenRouter",
				load: loadOpenRouterOAuth
			})
		},
		models: Object.values(OPENROUTER_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/qwen-token-plan.js
function qwenTokenPlanProvider() {
	return createProvider({
		id: "qwen-token-plan",
		name: "Qwen Token Plan",
		baseUrl: "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		auth: { apiKey: envApiKeyAuth("Qwen Token Plan API key", ["QWEN_TOKEN_PLAN_API_KEY"]) },
		models: Object.values(QWEN_TOKEN_PLAN_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/qwen-token-plan-cn.js
function qwenTokenPlanCnProvider() {
	return createProvider({
		id: "qwen-token-plan-cn",
		name: "Qwen Token Plan CN",
		baseUrl: "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1",
		auth: { apiKey: envApiKeyAuth("Qwen Token Plan CN API key", ["QWEN_TOKEN_PLAN_CN_API_KEY"]) },
		models: Object.values(QWEN_TOKEN_PLAN_CN_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/api/pi-messages.lazy.js
const piMessagesApi = () => lazyApi(() => import("./pi-messages-CWRxL1re.mjs"));
function isRadiusGatewayModel(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	const model = value;
	return typeof model.id === "string" && typeof model.name === "string" && typeof model.reasoning === "boolean" && Array.isArray(model.input) && typeof model.cost === "object" && model.cost !== null && !Array.isArray(model.cost) && typeof model.contextWindow === "number" && typeof model.maxTokens === "number";
}
function sanitizeRadiusGatewayConfig(config) {
	if (typeof config !== "object" || config === null || Array.isArray(config)) return void 0;
	const { baseUrl, models } = config;
	if (typeof baseUrl !== "string" || !Array.isArray(models)) return void 0;
	return {
		baseUrl,
		models: models.filter(isRadiusGatewayModel).map((model) => ({ ...model }))
	};
}
function normalizeRadiusGatewayUrl(value) {
	return (/^https?:\/\//iu.test(value) ? value : `https://${value}`).replace(/\/+$/u, "");
}
function getRadiusCredentialConfig(credential) {
	return sanitizeRadiusGatewayConfig(credential?.gatewayConfig);
}
function getRadiusModelsFromConfig(providerId, config) {
	return config.models.map((model) => ({
		...model,
		api: "pi-messages",
		provider: providerId,
		baseUrl: config.baseUrl
	}));
}
function getRadiusModels(providerId, credential) {
	const config = getRadiusCredentialConfig(credential);
	return config ? getRadiusModelsFromConfig(providerId, config) : [];
}
function truncateHttpBody(body) {
	const trimmed = body.trim();
	return trimmed.length > 512 ? `${trimmed.slice(0, 512)}…` : trimmed;
}
async function loadRadiusGatewayConfig(gateway, apiKey, signal) {
	const headers = { accept: "application/json" };
	if (apiKey) headers.authorization = `Bearer ${apiKey}`;
	const response = await fetch(new URL("/v1/config", gateway), {
		headers,
		signal
	});
	if (!response.ok) throw new Error(`Could not load Radius config from ${gateway}: ${response.status}: ${truncateHttpBody(await response.text())}`);
	const config = sanitizeRadiusGatewayConfig(await response.json());
	if (!config) throw new Error(`Invalid Radius config from ${gateway}`);
	return config;
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/radius.js
/** Radius gateway provider with a persisted, dynamically refreshed catalog. */
function radiusProvider(options = {}) {
	const id = options.id ?? "radius";
	const name = options.name ?? "Radius";
	const gateway = normalizeRadiusGatewayUrl(options.gateway ?? "https://radius.pi.dev");
	let models = getRadiusModels(id, void 0);
	let inflightRefresh;
	const streams = piMessagesApi();
	return {
		id,
		name,
		auth: {
			apiKey: envApiKeyAuth("Radius API key", ["RADIUS_API_KEY"]),
			oauth: lazyOAuth({
				name,
				load: () => loadRadiusOAuth({
					name,
					gateway
				})
			})
		},
		getModels: () => models,
		refreshModels: (context) => {
			inflightRefresh ??= (async () => {
				try {
					const stored = await context.store.read();
					if (stored) models = stored.models.filter((model) => model.provider === id);
					if (!stored && context.credential?.type === "oauth") {
						const legacy = getRadiusModels(id, context.credential);
						if (legacy.length > 0) {
							models = legacy;
							await context.store.write({
								models: legacy,
								checkedAt: Date.now()
							});
						}
					}
					if (!context.allowNetwork || context.signal?.aborted) return;
					const config = await loadRadiusGatewayConfig(gateway, context.credential?.type === "oauth" ? context.credential.access : context.credential?.key, context.signal);
					if (context.signal?.aborted) return;
					models = getRadiusModelsFromConfig(id, config);
					await context.store.write({
						models,
						checkedAt: Date.now()
					});
				} finally {
					inflightRefresh = void 0;
				}
			})();
			return inflightRefresh;
		},
		stream: (model, context, streamOptions) => streams.stream(model, context, streamOptions),
		streamSimple: (model, context, streamOptions) => streams.streamSimple(model, context, streamOptions)
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/together.js
function togetherProvider() {
	return createProvider({
		id: "together",
		name: "Together",
		baseUrl: "https://api.together.ai/v1",
		auth: { apiKey: envApiKeyAuth("Together API key", ["TOGETHER_API_KEY"]) },
		models: Object.values(TOGETHER_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/vercel-ai-gateway.js
function vercelAIGatewayProvider() {
	return createProvider({
		id: "vercel-ai-gateway",
		name: "Vercel AI Gateway",
		baseUrl: "https://ai-gateway.vercel.sh",
		auth: { apiKey: envApiKeyAuth("Vercel AI Gateway API key", ["AI_GATEWAY_API_KEY"]) },
		models: Object.values(VERCEL_AI_GATEWAY_MODELS),
		api: anthropicMessagesApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/xai.js
function xaiProvider() {
	return createProvider({
		id: "xai",
		name: "xAI",
		baseUrl: "https://api.x.ai/v1",
		auth: {
			apiKey: envApiKeyAuth("xAI API key", ["XAI_API_KEY"]),
			oauth: lazyOAuth({
				name: "xAI (Grok/X subscription)",
				loginLabel: "Sign in with SuperGrok or X Premium",
				load: loadXaiOAuth
			})
		},
		models: Object.values(XAI_MODELS),
		api: {
			"openai-completions": openAICompletionsApi(),
			"openai-responses": openAIResponsesApi()
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/xiaomi.js
function xiaomiProvider() {
	return createProvider({
		id: "xiaomi",
		name: "Xiaomi",
		baseUrl: "https://api.xiaomimimo.com/v1",
		auth: { apiKey: envApiKeyAuth("Xiaomi API key", ["XIAOMI_API_KEY"]) },
		models: Object.values(XIAOMI_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/xiaomi-token-plan-ams.js
function xiaomiTokenPlanAmsProvider() {
	return createProvider({
		id: "xiaomi-token-plan-ams",
		name: "Xiaomi Token Plan AMS",
		baseUrl: "https://token-plan-ams.xiaomimimo.com/v1",
		auth: { apiKey: envApiKeyAuth("Xiaomi Token Plan AMS API key", ["XIAOMI_TOKEN_PLAN_AMS_API_KEY"]) },
		models: Object.values(XIAOMI_TOKEN_PLAN_AMS_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/xiaomi-token-plan-cn.js
function xiaomiTokenPlanCnProvider() {
	return createProvider({
		id: "xiaomi-token-plan-cn",
		name: "Xiaomi Token Plan CN",
		baseUrl: "https://token-plan-cn.xiaomimimo.com/v1",
		auth: { apiKey: envApiKeyAuth("Xiaomi Token Plan CN API key", ["XIAOMI_TOKEN_PLAN_CN_API_KEY"]) },
		models: Object.values(XIAOMI_TOKEN_PLAN_CN_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/xiaomi-token-plan-sgp.js
function xiaomiTokenPlanSgpProvider() {
	return createProvider({
		id: "xiaomi-token-plan-sgp",
		name: "Xiaomi Token Plan SGP",
		baseUrl: "https://token-plan-sgp.xiaomimimo.com/v1",
		auth: { apiKey: envApiKeyAuth("Xiaomi Token Plan SGP API key", ["XIAOMI_TOKEN_PLAN_SGP_API_KEY"]) },
		models: Object.values(XIAOMI_TOKEN_PLAN_SGP_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/zai.js
function zaiProvider() {
	return createProvider({
		id: "zai",
		name: "Z.AI",
		baseUrl: "https://api.z.ai/api/coding/paas/v4",
		auth: { apiKey: envApiKeyAuth("Z.AI API key", ["ZAI_API_KEY"]) },
		models: Object.values(ZAI_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/zai-coding-cn.js
function zaiCodingCnProvider() {
	return createProvider({
		id: "zai-coding-cn",
		name: "Z.AI Coding CN",
		baseUrl: "https://open.bigmodel.cn/api/coding/paas/v4",
		auth: { apiKey: envApiKeyAuth("Z.AI Coding CN API key", ["ZAI_CODING_CN_API_KEY"]) },
		models: Object.values(ZAI_CODING_CN_MODELS),
		api: openAICompletionsApi()
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/providers/all.js
function getBuiltinModels(provider) {
	const models = MODELS[provider];
	return models ? Object.values(models) : [];
}
/** All built-in providers, freshly constructed. */
function builtinProviders() {
	return [
		amazonBedrockProvider(),
		antLingProvider(),
		anthropicProvider(),
		azureOpenAIResponsesProvider(),
		cerebrasProvider(),
		cloudflareAIGatewayProvider(),
		cloudflareWorkersAIProvider(),
		deepseekProvider(),
		fireworksProvider(),
		githubCopilotProvider(),
		googleProvider(),
		googleVertexProvider(),
		groqProvider(),
		huggingfaceProvider(),
		kimiCodingProvider(),
		minimaxProvider(),
		minimaxCnProvider(),
		mistralProvider(),
		moonshotaiProvider(),
		moonshotaiCnProvider(),
		nvidiaProvider(),
		openaiProvider(),
		openaiCodexProvider(),
		opencodeProvider(),
		opencodeGoProvider(),
		openrouterProvider(),
		qwenTokenPlanProvider(),
		qwenTokenPlanCnProvider(),
		radiusProvider(),
		togetherProvider(),
		vercelAIGatewayProvider(),
		xaiProvider(),
		xiaomiProvider(),
		xiaomiTokenPlanAmsProvider(),
		xiaomiTokenPlanCnProvider(),
		xiaomiTokenPlanSgpProvider(),
		zaiProvider(),
		zaiCodingCnProvider()
	];
}
//#endregion
//#region ../../packages/credentials/credentials/lib/index.js
/**
* Service Definition for the credential-reference capability seam (`ctx.credentials`). Settings and composition files carry
* *references* to secrets — environment-variable names — while providers own
* the actual values and their storage. Consumers resolve a reference once per
* operation, so a changed credential reaches the next operation without any
* plugin restart, and configuration surfaces describe a reference without
* ever seeing its value.
* @module @deepseek-ai/dsh-credentials
*/
const REF_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
/**
* Brand a raw string as a {@link CredentialRef}.
* @param value - candidate reference; a POSIX shell identifier such as `DEEPSEEK_API_KEY`.
* @returns the branded reference.
*/
function credentialRef(value) {
	if (!REF_PATTERN.test(value)) throw new TypeError(`credential ref "${value}" must match ${String(REF_PATTERN)}`);
	return value;
}
//#endregion
//#region ../../packages/llm/llm-pi-ai/lib/index.js
/**
* Durable pi-ai replay metadata and assistant-history reconstruction.
*
* Harness content remains the durable source for text and tool calls. This
* module stores only the provider-native metadata needed to reconstruct a
* pi-ai assistant message on a later request.
*
* @module dsh-llm-pi-ai/replay
*/
/** Parse tool-call argument JSON; tolerate model malformations with {}. */
function parseArguments(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) return parsed;
	} catch {}
	return {};
}
/** Construct the zero usage value required by historical pi-ai messages. */
function emptyPiUsage() {
	return {
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
	};
}
/**
* Project a successful pi-ai response into the minimal durable replay state.
* @param message - completed native pi-ai assistant response.
* @returns the versioned lossless-JSON replay projection.
*/
function toPiReplayState(message) {
	return {
		kind: "pi-ai",
		version: 1,
		api: message.api,
		provider: message.provider,
		model: message.model,
		...message.responseModel === void 0 ? {} : { responseModel: message.responseModel },
		...message.responseId === void 0 ? {} : { responseId: message.responseId },
		stopReason: message.stopReason,
		blocks: message.content.map((block) => {
			switch (block.type) {
				case "text": return {
					type: "text",
					...block.textSignature === void 0 ? {} : { textSignature: block.textSignature }
				};
				case "thinking": return {
					type: "reasoning",
					...block.thinkingSignature === void 0 ? {} : { thinkingSignature: block.thinkingSignature },
					...block.redacted === void 0 ? {} : { redacted: block.redacted }
				};
				case "toolCall": return {
					type: "tool-call",
					...block.thoughtSignature === void 0 ? {} : { thoughtSignature: block.thoughtSignature }
				};
			}
		})
	};
}
function invalidReplay(message) {
	throw new LlmError(`invalid pi-ai replay state: ${message}`, "INVALID_REPLAY_STATE");
}
/** Validate the adapter-private state before it reaches pi-ai. */
function readReplayState(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return invalidReplay("expected an object");
	const state = value;
	if (state["kind"] !== "pi-ai") return invalidReplay("unknown state kind");
	if (state["version"] !== 1) return invalidReplay(`unsupported version ${String(state["version"])}`);
	for (const key of [
		"api",
		"provider",
		"model"
	]) if (typeof state[key] !== "string" || state[key].length === 0) return invalidReplay(`${key} must be a non-empty string`);
	if (![
		"stop",
		"length",
		"toolUse",
		"error",
		"aborted"
	].includes(String(state["stopReason"]))) return invalidReplay("unknown stopReason");
	if (state["responseModel"] !== void 0 && typeof state["responseModel"] !== "string") return invalidReplay("responseModel must be a string");
	if (state["responseId"] !== void 0 && typeof state["responseId"] !== "string") return invalidReplay("responseId must be a string");
	if (!Array.isArray(state["blocks"])) return invalidReplay("blocks must be an array");
	for (const [index, value] of state["blocks"].entries()) {
		if (typeof value !== "object" || value === null || Array.isArray(value)) return invalidReplay(`block ${index} must be an object`);
		const block = value;
		if (![
			"text",
			"reasoning",
			"tool-call"
		].includes(String(block["type"]))) return invalidReplay(`block ${index} has an unknown type`);
		for (const signature of [
			"textSignature",
			"thinkingSignature",
			"thoughtSignature"
		]) if (block[signature] !== void 0 && typeof block[signature] !== "string") return invalidReplay(`block ${index} ${signature} must be a string`);
		if (block["redacted"] !== void 0 && typeof block["redacted"] !== "boolean") return invalidReplay(`block ${index} redacted must be boolean`);
	}
	return state;
}
/** Convert provider-neutral blocks without trusting them as same-model replay. */
function foreignAssistant(message) {
	const source = message.source.kind === "model" ? message.source : void 0;
	const content = [];
	for (const block of message.content) switch (block.type) {
		case "text":
			content.push({
				type: "text",
				text: block.text
			});
			break;
		case "reasoning":
			content.push({
				type: "thinking",
				thinking: block.text
			});
			break;
		case "tool-call":
			content.push({
				type: "toolCall",
				id: block.id,
				name: block.name,
				arguments: parseArguments(block.arguments)
			});
			break;
		case "image": throw new LlmError("pi-ai chat history cannot represent structured assistant image output", "UNSUPPORTED_CONTENT");
		default: break;
	}
	return {
		role: "assistant",
		content,
		api: "dsh-foreign",
		provider: source?.provider ?? "dsh-foreign",
		model: source?.model ?? "dsh-foreign",
		usage: emptyPiUsage(),
		stopReason: content.some((piece) => piece.type === "toolCall") ? "toolUse" : "stop",
		timestamp: 0
	};
}
/** Recombine durable Harness content with validated pi-ai replay metadata. */
function replayedAssistant(message, source, rawState) {
	const state = readReplayState(rawState);
	if (state.provider !== source.provider) return invalidReplay("provider does not match assistant source");
	if (state.model !== source.model) return invalidReplay("model does not match assistant source");
	if (state.blocks.length !== message.content.length) return invalidReplay("block count does not match assistant content");
	return {
		role: "assistant",
		content: message.content.map((block, index) => {
			const replay = state.blocks[index];
			if (replay === void 0 || replay.type !== block.type) return invalidReplay(`block ${index} does not match assistant content`);
			switch (block.type) {
				case "text": return {
					type: "text",
					text: block.text,
					...replay.type === "text" && replay.textSignature !== void 0 ? { textSignature: replay.textSignature } : {}
				};
				case "reasoning": return {
					type: "thinking",
					thinking: block.text,
					...replay.type === "reasoning" && replay.thinkingSignature !== void 0 ? { thinkingSignature: replay.thinkingSignature } : {},
					...replay.type === "reasoning" && replay.redacted !== void 0 ? { redacted: replay.redacted } : {}
				};
				case "tool-call": return {
					type: "toolCall",
					id: block.id,
					name: block.name,
					arguments: parseArguments(block.arguments),
					...replay.type === "tool-call" && replay.thoughtSignature !== void 0 ? { thoughtSignature: replay.thoughtSignature } : {}
				};
				/* v8 ignore next -- readReplayState rejects unknown replay tags, so an equal plugin-added Harness tag cannot reach this switch */
				default: return invalidReplay(`block ${index} has an unsupported Harness type`);
			}
		}),
		api: state.api,
		provider: state.provider,
		model: state.model,
		...state.responseModel === void 0 ? {} : { responseModel: state.responseModel },
		...state.responseId === void 0 ? {} : { responseId: state.responseId },
		usage: emptyPiUsage(),
		stopReason: state.stopReason,
		timestamp: 0
	};
}
/**
* Convert one durable Harness assistant message into pi-ai history.
* @param message - assistant content with required source and optional adapter-owned replay metadata.
* @returns a native pi-ai assistant message reconstructed from durable content.
*/
function toPiAssistant(message) {
	const source = message.source;
	return source.kind !== "model" || source.replayState === void 0 ? foreignAssistant(message) : replayedAssistant(message, source, source.replayState);
}
/**
* Harness request-history conversion into pi-ai's Context vocabulary.
*
* @module dsh-llm-pi-ai/context
*/
/** Join the text blocks of a harness message. */
function flattenText(message) {
	return message.content.filter((block) => block.type === "text").map((block) => block.text).join("");
}
/** Flatten text recursively inside one tool result. */
function toolResultText(blocks) {
	return blocks.map((block) => block.type === "text" ? block.text : block.type === "tool-result" ? toolResultText(block.content) : "").join("");
}
async function userContent(blocks, attachments) {
	const content = [];
	for (const block of blocks) switch (block.type) {
		case "text":
			if (block.text.length > 0) content.push({
				type: "text",
				text: block.text
			});
			break;
		case "image": {
			const stored = await attachments.readImage(block.attachment);
			content.push({
				type: "image",
				data: Buffer.from(stored.data).toString("base64"),
				mimeType: stored.ref.mediaType
			});
			break;
		}
		case "tool-result":
			{
				const nested = await userContent(block.content, attachments);
				if (typeof nested === "string") {
					if (nested.length > 0) content.push({
						type: "text",
						text: nested
					});
				} else content.push(...nested);
			}
			break;
		default: break;
	}
	if (content.every((block) => block.type === "text")) return content.map((block) => block.text).join("");
	return content;
}
function toolsOf(options) {
	return options.tools?.map((tool) => ({
		name: tool.name,
		description: tool.description,
		parameters: tool.parameters
	}));
}
/** Assemble the request-level pi-ai context envelope shared by both conversion paths. */
function piContext(options, messages) {
	const tools = toolsOf(options);
	return {
		...options.system !== void 0 ? { systemPrompt: options.system } : {},
		messages,
		...tools !== void 0 && tools.length > 0 ? { tools } : {}
	};
}
function textOnlyContext(options) {
	const toolNames = /* @__PURE__ */ new Map();
	const messages = [];
	for (const message of options.messages) {
		if (contentHasImage$1(message.content)) throw new LlmError("pi-ai image conversion requires the durable attachment service", "UNSUPPORTED_CONTENT");
		if (message.role === "system") {
			messages.push({
				role: "user",
				content: flattenText(message),
				timestamp: 0
			});
			continue;
		}
		if (message.role === "assistant") {
			const assistant = toPiAssistant(message);
			for (const block of assistant.content) if (block.type === "toolCall") toolNames.set(CallId(block.id), block.name);
			messages.push(assistant);
			continue;
		}
		const text = flattenText(message);
		const results = message.content.filter((block) => block.type === "tool-result");
		if (text.length > 0 || results.length === 0) messages.push({
			role: "user",
			content: text,
			timestamp: 0
		});
		for (const result of results) messages.push({
			role: "toolResult",
			toolCallId: result.toolCallId,
			toolName: toolNames.get(result.toolCallId) ?? "unknown",
			content: [{
				type: "text",
				text: toolResultText(result.content) || "(no output)"
			}],
			isError: result.isError ?? false,
			timestamp: 0
		});
	}
	return piContext(options, messages);
}
function toPiContext(options, attachments) {
	return attachments === void 0 ? textOnlyContext(options) : toPiContextWithImages(options, attachments);
}
async function toPiContextWithImages(options, attachments) {
	const toolNames = /* @__PURE__ */ new Map();
	const messages = [];
	for (const message of options.messages) {
		if (message.role === "system") {
			if (contentHasImage$1(message.content)) throw new LlmError("pi-ai cannot represent an image in an in-history system message", "UNSUPPORTED_CONTENT");
			messages.push({
				role: "user",
				content: flattenText(message),
				timestamp: 0
			});
			continue;
		}
		if (message.role === "assistant") {
			const assistant = toPiAssistant(message);
			for (const block of assistant.content) if (block.type === "toolCall") toolNames.set(CallId(block.id), block.name);
			messages.push(assistant);
			continue;
		}
		const content = await userContent(message.content.filter((block) => block.type !== "tool-result"), attachments);
		const results = message.content.filter((block) => block.type === "tool-result");
		if (content.length > 0 || results.length === 0) messages.push({
			role: "user",
			content,
			timestamp: 0
		});
		for (const result of results) {
			const resultContent = await userContent(result.content, attachments);
			messages.push({
				role: "toolResult",
				toolCallId: result.toolCallId,
				toolName: toolNames.get(result.toolCallId) ?? "unknown",
				content: typeof resultContent === "string" ? [{
					type: "text",
					text: resultContent || "(no output)"
				}] : resultContent,
				isError: result.isError ?? false,
				timestamp: 0
			});
		}
	}
	return piContext(options, messages);
}
/**
* pi-ai assistant event translation into the Harness streaming protocol.
*
* pi-ai tool-call arguments are parsed objects while the Harness keeps their
* raw JSON representation. pi-ai also reports failures as terminal stream
* events, which this module maps into Harness finish chunks.
*
* @module dsh-llm-pi-ai/stream
*/
/**
* Map pi-ai usage (reasoning folded into output by pi-ai).
* @param usage - cumulative usage from the terminal pi-ai event.
* @returns harness counts; cache fields appear only when non-zero (pi-ai reports zeros, not absence).
*/
function mapUsage(usage) {
	return {
		inputTokens: usage.input,
		outputTokens: usage.output,
		...usage.cacheRead > 0 ? { cacheReadTokens: usage.cacheRead } : {},
		...usage.cacheWrite > 0 ? { cacheWriteTokens: usage.cacheWrite } : {}
	};
}
function classifyPiAiError(message) {
	if (/\b(?:401|403)\b/.test(message)) return "AUTH";
	if (isQuotaExceededError(message)) return QUOTA_EXCEEDED_CODE;
	if (/\b429\b|rate.?limit/i.test(message)) return "RATE_LIMIT";
	if (/\b400\b|invalid.?request/i.test(message)) return "INVALID_REQUEST";
	if (/\b5\d\d\b/.test(message)) return "SERVER";
	if (/\btime(?:d)?\s*out\b|timeout/i.test(message)) return "TIMEOUT";
	if (/stream ended (?:before|without)\b/i.test(message)) return "TRANSPORT";
	if (/\b(?:network|connection|socket|fetch)\b|\bECONN[A-Z]+\b/i.test(message) || /\b(?:other side closed|HTTP2 request did not get a response|WebSocket closed unexpectedly)\b/i.test(message) || /\bterminated\b|premature close/i.test(message)) return "TRANSPORT";
	return "PI_AI_ERROR";
}
/**
* Map a terminal pi-ai event to the harness finish reason.
* @param message - the assistant message carried by the `done` or `error` event.
* @param contextWindow - resolved catalog capacity for usage-based overflow detection.
* @returns the mapped harness reason. Recognized error text, `stop` usage above
*   `contextWindow`, and zero-output `length` usage that fills the window map
*   to `CONTEXT_WINDOW_EXCEEDED`; a `stop` with no content blocks maps to an
*   `EMPTY_RESPONSE` error.
*/
function mapStopReason(message, contextWindow) {
	const piAiOverflow = isContextOverflow(message, contextWindow);
	const harnessOverflow = message.stopReason === "error" && message.errorMessage !== void 0 && isContextWindowExceededError(message.errorMessage);
	if (piAiOverflow || harnessOverflow) return {
		kind: "error",
		failure: {
			message: message.errorMessage ?? `pi-ai detected context overflow for model "${message.model}"`,
			code: CONTEXT_WINDOW_EXCEEDED_CODE
		}
	};
	switch (message.stopReason) {
		case "stop":
			if (message.content.length === 0) return {
				kind: "error",
				failure: {
					message: `model "${message.model}" returned a completed response with no content`,
					code: EMPTY_RESPONSE_CODE
				}
			};
			return { kind: "stop" };
		case "length": return { kind: "max-tokens" };
		case "toolUse": return { kind: "tool-calls" };
		case "aborted": return {
			kind: "aborted",
			failure: {
				message: message.errorMessage ?? "pi-ai stream aborted",
				code: "ABORTED"
			}
		};
		case "error": {
			const text = message.errorMessage ?? "pi-ai stream error";
			return {
				kind: "error",
				failure: {
					message: text,
					code: classifyPiAiError(text)
				}
			};
		}
	}
}
/**
* Translate the pi-ai event stream into StreamChunks. pi-ai never throws
* mid-stream — failures arrive as `error` events, which become error/aborted
* `finish` chunks (the harness protocol's other error-delivery style).
* @param events - one assistant turn's pi-ai event stream.
* @param contextWindow - resolved catalog capacity for usage-based overflow detection.
* @returns the harness chunks, ending with `usage` then `finish`; throws
*   `LlmError` (`STREAM_CLOSED`) if the source ends without a terminal event.
*/
async function* toStreamChunks(events, contextWindow) {
	const toolIds = /* @__PURE__ */ new Map();
	for await (const event of events) switch (event.type) {
		case "start": break;
		case "text_start":
			yield {
				type: "block-start",
				index: event.contentIndex,
				blockType: "text"
			};
			break;
		case "text_delta":
			yield {
				type: "text-delta",
				index: event.contentIndex,
				text: event.delta
			};
			break;
		case "text_end":
			yield {
				type: "block-end",
				index: event.contentIndex,
				block: {
					type: "text",
					text: event.content
				}
			};
			break;
		case "thinking_start":
			yield {
				type: "block-start",
				index: event.contentIndex,
				blockType: "reasoning"
			};
			break;
		case "thinking_delta":
			yield {
				type: "reasoning-delta",
				index: event.contentIndex,
				text: event.delta
			};
			break;
		case "thinking_end":
			yield {
				type: "block-end",
				index: event.contentIndex,
				block: {
					type: "reasoning",
					text: event.content
				}
			};
			break;
		case "toolcall_start": {
			const partial = event.partial.content[event.contentIndex];
			const id = partial?.type === "toolCall" ? partial.id : "";
			const name = partial?.type === "toolCall" ? partial.name : "";
			toolIds.set(event.contentIndex, {
				id,
				name
			});
			yield {
				type: "block-start",
				index: event.contentIndex,
				blockType: "tool-call"
			};
			break;
		}
		case "toolcall_delta": {
			const known = toolIds.get(event.contentIndex);
			yield {
				type: "tool-call-delta",
				index: event.contentIndex,
				id: CallId(known?.id ?? ""),
				...known?.name !== void 0 && known.name.length > 0 ? { name: known.name } : {},
				argumentsDelta: event.delta
			};
			break;
		}
		case "toolcall_end":
			yield {
				type: "block-end",
				index: event.contentIndex,
				block: {
					type: "tool-call",
					id: CallId(event.toolCall.id),
					name: event.toolCall.name,
					arguments: JSON.stringify(event.toolCall.arguments)
				}
			};
			break;
		case "done":
			yield {
				type: "usage",
				usage: mapUsage(event.message.usage)
			};
			yield {
				type: "finish",
				reason: mapStopReason(event.message, contextWindow),
				replayState: toPiReplayState(event.message)
			};
			return;
		case "error":
			yield {
				type: "usage",
				usage: mapUsage(event.error.usage)
			};
			yield {
				type: "finish",
				reason: mapStopReason(event.error, contextWindow)
			};
			return;
	}
	throw new LlmError("pi-ai event stream ended without done/error", "STREAM_CLOSED");
}
/**
* Generic pi-ai-backed implementation of the Harness LLM seam.
*
* Each resolution produces one **immutable** snapshot — the profiles plus a
* `Models` collection holding the `Provider` each route built — and an
* operation captures a whole snapshot before its first `await`. A
* configuration change builds a *new* collection rather than mutating the one
* in use, because `Models.streamSimple()` is lazy: it resolves the provider
* when the stream is first consumed, which is after the credential await, so a
* mutated collection would let a request that started under one configuration
* finish under another — or fail with a provider that no longer exists. This is
* what makes the seam's per-step call freeze (`llm.prepareCall()`) hold all the
* way down: switching models mid-reply takes effect on the next step, never
* inside the one in flight.
*
* Credentials stay outside that collection. The harness resolves a route's key
* through its own seam and passes it as the request's `apiKey` option, which
* pi-ai treats as the highest-priority auth override — so `Models` never holds
* a credential store and the harness keeps its fail-loud reference semantics.
*
* @module dsh-llm-pi-ai/adapter
*/
var __addDisposableResource = function(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
};
var __disposeResources = (function(SuppressedError) {
	return function(env) {
		function fail(e) {
			env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
			env.hasError = true;
		}
		var r, s = 0;
		function next() {
			while (r = env.stack.pop()) try {
				if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
				if (r.dispose) {
					var result = r.dispose.call(r.value);
					if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
						fail(e);
						return next();
					});
				} else s |= 1;
			} catch (e) {
				fail(e);
			}
			if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
			if (env.hasError) throw env.error;
		}
		return next();
	};
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
/** Copy profile stream knobs into pi-ai's common option vocabulary. */
function profileOptions(profile, reasoning, apiKey) {
	const enabledReasoning = reasoning === "off" ? void 0 : reasoning;
	return {
		...apiKey === void 0 ? {} : { apiKey },
		...enabledReasoning === void 0 ? {} : { reasoning: enabledReasoning },
		...profile.thinkingBudgets === void 0 ? {} : { thinkingBudgets: profile.thinkingBudgets },
		...profile.cacheRetention === void 0 ? {} : { cacheRetention: profile.cacheRetention },
		...profile.transport === void 0 ? {} : { transport: profile.transport },
		...profile.timeoutMs === void 0 ? {} : { timeoutMs: profile.timeoutMs },
		...profile.websocketConnectTimeoutMs === void 0 ? {} : { websocketConnectTimeoutMs: profile.websocketConnectTimeoutMs },
		maxRetries: 0
	};
}
/**
* The profile default this exact model can actually take, for DESCRIBING it.
* A configured level the model does not support yields none rather than
* throwing: `resolveModel` builds the model catalog, and a catalog that fails
* takes its whole provider out of every picker — so one mis-set profile field
* would hide every model on the route, including the ones that support the
* level. The request path still refuses, which is where a bad configuration
* belongs: describing what a model can do must not fail because a deployment
* asked it for something it cannot.
* @param model - the resolved model descriptor.
* @param effort - the profile's configured level, if any.
* @returns the level when this model supports it, otherwise undefined.
*/
function describableReasoningLevel(model, effort) {
	if (effort === void 0) return void 0;
	return getSupportedThinkingLevels(model).some((level) => level === effort) ? effort : void 0;
}
/** Validate an explicit Harness/profile effort without invoking pi-ai's clamp. */
function resolveReasoningLevel(model, effort) {
	if (effort === void 0) return void 0;
	if (getSupportedThinkingLevels(model).some((level) => level === effort)) return effort;
	throw new LlmError(`pi-ai provider "${model.provider}" model "${model.id}" does not support reasoning effort "${effort}"`, "UNSUPPORTED_REASONING_EFFORT");
}
/**
* Selectable reasoning efforts for one model, or nothing at all.
*
* A model that carries no reasoning metadata — every hand-declared one, and
* every catalog model pi-ai marks as non-reasoning — is reported by pi-ai as
* supporting the single level `off`. Passing that through would offer a control
* that cannot do what it says: `off` is translated to *omitting* the reasoning
* option, which for such a model is byte-for-byte the same request as naming no
* effort — so a provider whose own default is to think would keep thinking with
* `off` selected. Omitting `reasoning` entirely is the seam's way of saying the
* capability is unavailable, which leaves the surface offering only the
* provider's default.
* @param model - the resolved model descriptor.
* @param defaultLevel - the profile's configured effort, already validated.
* @returns the `reasoning` field, or an empty object when none can be offered.
*/
function reasoningInfo(model, defaultLevel) {
	if (!model.reasoning) return {};
	return { reasoning: {
		efforts: getSupportedThinkingLevels(model).map((level) => ({
			id: ReasoningEffortId(level),
			name: `${level.charAt(0).toUpperCase()}${level.slice(1)}`
		})),
		...defaultLevel === void 0 ? {} : { defaultEffort: ReasoningEffortId(defaultLevel) }
	} };
}
/** Merge deployment headers while removing case-insensitive attribution collisions. */
function requestHeaders(headers) {
	const attribution = attributionHeaders();
	const reserved = new Set(Object.keys(attribution).map((name) => name.toLowerCase()));
	return {
		...Object.fromEntries(Object.entries(headers ?? {}).filter(([name]) => !reserved.has(name.toLowerCase()))),
		...attribution
	};
}
/**
* pi-ai-backed multi-provider adapter. Each operation reads the current
* profiles, so a configuration change reaches the next request without a
* restart; model descriptors come from the collection those profiles built.
*/
var PiAiAdapter = class extends LlmAdapter {
	config;
	snapshot;
	constructor(config) {
		super();
		this.config = config;
	}
	/**
	* The snapshot for the current profiles. Resolution memoizes its result, so
	* an unchanged configuration is recognized by identity; a changed one gets a
	* brand-new collection, leaving any snapshot an operation already captured
	* untouched for as long as that operation holds it.
	*/
	current() {
		const profiles = this.config.profiles();
		if (this.snapshot?.profiles === profiles) return this.snapshot;
		const models = createModels();
		for (const profile of profiles.values()) models.setProvider(profile.piProvider);
		this.snapshot = {
			profiles,
			models
		};
		return this.snapshot;
	}
	/** The profile for one route within one snapshot, or the not-owned failure. */
	profileOf(snapshot, provider) {
		const profile = snapshot.profiles.get(provider);
		if (profile === void 0) throw new LlmError(`pi-ai adapter does not own provider "${provider}"`, "NO_ADAPTER");
		return profile;
	}
	/** The configured descriptor for one exact route/model pair within one snapshot. */
	modelOf(snapshot, provider, model) {
		this.profileOf(snapshot, provider);
		const resolved = snapshot.models.getModel(provider, model);
		if (resolved === void 0) throw new LlmError(`pi-ai provider "${provider}" has no configured model "${model}"`, "UNKNOWN_MODEL");
		return resolved;
	}
	providerInfo(provider) {
		return {
			id: provider,
			name: this.current().profiles.get(provider)?.displayName ?? provider
		};
	}
	providerRetryPolicy(provider) {
		return this.current().profiles.get(provider)?.retryPolicy;
	}
	listModels(provider) {
		return Promise.resolve().then(() => {
			const snapshot = this.current();
			this.profileOf(snapshot, provider);
			return snapshot.models.getModels(provider).map((model) => ({
				provider,
				id: model.id,
				name: model.name,
				inputModalities: [...model.input]
			}));
		});
	}
	resolveModel(provider, model, _signal) {
		return Promise.resolve().then(() => {
			const snapshot = this.current();
			const profile = this.profileOf(snapshot, provider);
			const resolvedModel = this.modelOf(snapshot, provider, model);
			const defaultLevel = describableReasoningLevel(resolvedModel, profile.reasoning);
			const configuredMaxTokens = profile.configuredMaxTokens.get(model);
			return {
				provider,
				id: model,
				name: resolvedModel.name,
				inputModalities: [...resolvedModel.input],
				context: { contextWindow: resolvedModel.contextWindow },
				...configuredMaxTokens === void 0 ? {} : { defaultMaxTokens: configuredMaxTokens },
				...reasoningInfo(resolvedModel, defaultLevel)
			};
		});
	}
	async *stream(options) {
		const env_1 = {
			stack: [],
			error: void 0,
			hasError: false
		};
		try {
			if (options.stop !== void 0) throw new LlmError("llm-pi-ai does not support GenerateOptions.stop", "UNSUPPORTED_OPTION");
			const snapshot = this.current();
			const profile = this.profileOf(snapshot, options.provider);
			const model = this.modelOf(snapshot, options.provider, options.model);
			const reasoning = resolveReasoningLevel(model, options.reasoningEffort ?? profile.reasoning);
			const apiKey = await this.config.resolveApiKey(options.provider, profile);
			const consumer = new AbortController();
			const upstream = options.signal === void 0 ? consumer.signal : AbortSignal.any([options.signal, consumer.signal]);
			const streamIdleTimeoutMs = profile.streamIdleTimeoutMs;
			const watchdog = __addDisposableResource(env_1, idleWatchdog(upstream, streamIdleTimeoutMs, "LLM_STREAM_IDLE_TIMEOUT"), false);
			try {
				const containsImage = options.messages.some((message) => contentHasImage$1(message.content));
				if (containsImage && !model.input.includes("image")) throw new LlmError(`pi-ai model "${model.id}" does not support image input`, "UNSUPPORTED_CONTENT");
				const attachments = containsImage ? this.config.resolveAttachments?.() : void 0;
				if (containsImage && attachments === void 0) throw new LlmError("pi-ai image input requires the durable attachment service", "UNSUPPORTED_CONTENT");
				const context = attachments === void 0 ? toPiContext(options) : await toPiContext(options, attachments);
				const iterator = toStreamChunks(snapshot.models.streamSimple(model, context, {
					...profileOptions(profile, reasoning, apiKey),
					...options.temperature === void 0 ? {} : { temperature: options.temperature },
					...options.maxTokens === void 0 ? {} : { maxTokens: options.maxTokens },
					...options.sessionId === void 0 ? {} : { sessionId: String(options.sessionId) },
					signal: watchdog.signal,
					headers: requestHeaders(profile.headers)
				}), model.contextWindow)[Symbol.asyncIterator]();
				let exhausted = false;
				try {
					while (true) {
						const result = await watchdog.next(iterator);
						const timeout = timeoutOf(watchdog.signal, "LLM_STREAM_IDLE_TIMEOUT");
						if (timeout !== void 0) throw timeout;
						if (result.done) {
							exhausted = true;
							return;
						}
						yield result.value;
					}
				} finally {
					if (!exhausted) {
						consumer.abort("pi-ai stream consumer stopped");
						try {
							await iterator.return(void 0);
						} catch (_abortedSdkTeardown) {}
					}
				}
			} catch (error) {
				if (timeoutOf(watchdog.signal, "LLM_STREAM_IDLE_TIMEOUT") !== void 0) throw new LlmError(`pi-ai stream idle timeout after ${streamIdleTimeoutMs}ms`, "TIMEOUT", { cause: error });
				if (options.signal?.aborted) throw new LlmError("pi-ai request aborted by caller", "ABORTED", { cause: error });
				throw error;
			} finally {
				consumer.abort("pi-ai stream consumer stopped");
			}
		} catch (e_1) {
			env_1.error = e_1;
			env_1.hasError = true;
		} finally {
			__disposeResources(env_1);
		}
	}
};
/** Every request modality a profile may declare. */
const MODALITIES$1 = Object.keys({
	text: true,
	image: true
});
/** Every pi-ai thinking level a profile may declare, in escalation order. */
const THINKING_LEVELS$1 = Object.keys({
	off: true,
	minimal: true,
	low: true,
	medium: true,
	high: true,
	xhigh: true,
	max: true
});
/** Reasoning-dispatch wire formats a profile may name, most-reached first. */
const SUPPORTED_THINKING_FORMATS$1 = Object.keys({
	"openai": true,
	"deepseek": true,
	"openrouter": true,
	"together": true,
	"zai": true,
	"qwen": true,
	"string-thinking": true,
	"ant-ling": true
});
/**
* Construction of the pi-ai `Provider` that one configured route registers into
* the adapter's `Models` collection.
*
* Two constructions, one decision: a route the installed catalog ships, whose
* profile does not override the wire protocol, **reuses that catalog provider**
* with its models replaced — the catalog provider owns API implementations this
* package cannot reconstruct (Bedrock loads its Smithy module through a
* separate entry point), so rebuilding it from parts would silently narrow
* which providers work. Every other route — one pi-ai has never heard of, or a
* catalog route pointed at a different protocol — is built by `createProvider`
* over the protocol table below.
*
* Credentials never reach this module's storage: the harness resolves a route's
* key through `ctx.credentials` before the request enters pi-ai and hands it
* over as a stream option, which `Models` presents to `resolve()` as the
* credential key.
*
* @module dsh-llm-pi-ai/provider
*/
/**
* Wire protocols a configured route may name, mapped to pi-ai's lazily loaded
* implementations. Each entry is the factory that pi-ai's matching provider
* factory uses, so a hand-declared route reaches exactly the implementation a
* catalog route would.
*
* The table is deliberately narrow: the protocols a hand-declared route
* actually reaches for today, each completely describable with a key, an
* endpoint, and headers. Bedrock signs with SigV4 over AWS credentials and a
* region, Vertex needs a project, a location, and application-default
* credentials, Azure needs provider environment plus an api-version, and Codex
* authenticates through OAuth — none of which this configuration shape can
* express, so offering them would hand back a provider that cannot
* authenticate. The remainder are absent for want of a consumer rather than a
* blocker: each is one line here once a deployment needs it. Catalog routes
* still reach every protocol through their own provider; only an explicit
* override is refused.
*/
const PROTOCOLS$1 = {
	"openai-completions": openAICompletionsApi,
	"openai-responses": openAIResponsesApi,
	"anthropic-messages": anthropicMessagesApi
};
/**
* Every wire protocol a configured route may name, most-reached first. The
* order is the table's and therefore stable; a configuration surface offering
* a choice presents the first as its default, which is why the protocol a
* hand-declared gateway most often speaks — and the one endpoint interrogation
* can read — leads.
* @returns the supported protocol identifiers.
*/
function supportedProtocols$1() {
	return Object.keys(PROTOCOLS$1);
}
/**
* Configuration schema and provider-profile validation for the pi-ai adapter.
* Profiles are a dict keyed by provider route, so the composition base and a
* user-settings layer merge per provider and the route set is structural.
*
* A route key is not required to name an installed pi-ai provider. When it does,
* that provider's endpoint, protocol, display name, and model catalog are the
* profile's defaults and the profile overrides them field by field; when it does
* not, the profile is the whole provider declaration. Resolution therefore ends
* in a built pi-ai `Provider` per route: everything a request needs is decided
* once, while the configuration key that made a route unserviceable can still be
* named in the failure.
*
* @module dsh-llm-pi-ai/config
*/
/** Default maximum idle interval while an adapter stream read is outstanding. */
const DEFAULT_STREAM_IDLE_TIMEOUT_MS$1 = 3e5;
/** Context capacity assumed for a model neither configuration nor the catalog sizes. */
const DEFAULT_CONTEXT_WINDOW$1 = 262144;
/** Output capability assumed for a model neither configuration nor the catalog sizes. */
const DEFAULT_MAX_TOKENS$1 = 32768;
/**
* Modalities assumed for a model neither configuration nor the catalog
* declares. Text is the floor every supported protocol certainly carries, so
* this is the absence of a declaration rather than a guess at the endpoint:
* nothing can interrogate a gateway for its modalities, and the two wrong
* answers do not cost the same. Under-claiming refuses the image before it is
* attached, naming the model. Over-claiming admits one the provider then
* rejects mid-turn, after the message is durable, leaving the session
* repeating a request that cannot succeed.
*/
const DEFAULT_INPUT$1 = ["text"];
const thinkingBudgets$1 = Schema.object({
	minimal: Schema.number(),
	low: Schema.number(),
	medium: Schema.number(),
	high: Schema.number()
});
const compatProfile$1 = Schema.object({
	thinkingFormat: Schema.union(SUPPORTED_THINKING_FORMATS$1),
	supportsReasoningEffort: Schema.boolean()
});
/**
* Keys are the offered levels, values their wire spellings. A valueless key
* (`off:`) survives validation because schemastery passes nullable data
* through before any member schema runs — `z.const(null)` only controls the
* error for non-null wrong values and what a configuration UI renders.
* Only resolution decides which levels may leave the value empty, so the
* diagnostic can name the route and model. The assertion narrows
* schemastery's `Dict`, which types every literal key as required; dict
* validation checks only present keys, so the runtime value is a partial record.
*/
const reasoningEfforts$1 = Schema.dict(Schema.union([Schema.string(), Schema.const(null)]), Schema.union(THINKING_LEVELS$1));
/** The fields a `models` entry and a `modelOverrides` value share; only the id's home differs. */
const modelFields$1 = {
	name: Schema.string(),
	contextWindow: Schema.number().step(1).min(1),
	maxTokens: Schema.number().step(1).min(1),
	input: Schema.array(Schema.union(MODALITIES$1)),
	reasoningEfforts: Schema.union([Schema.const(false), reasoningEfforts$1]),
	compat: compatProfile$1
};
const modelProfile$1 = Schema.object({
	id: Schema.string().required(),
	...modelFields$1
});
/** A {@link modelProfile} whose id lives in the `modelOverrides` dict key. */
const modelOverride$1 = Schema.object(modelFields$1);
const profile$1 = Schema.object({
	apiKeyEnv: Schema.string().role("credential-ref"),
	displayName: Schema.string(),
	api: Schema.union(supportedProtocols$1()),
	baseURL: Schema.string(),
	models: Schema.array(modelProfile$1),
	modelOverrides: Schema.dict(modelOverride$1),
	compat: compatProfile$1,
	defaultContextWindow: Schema.number().step(1).min(1).default(DEFAULT_CONTEXT_WINDOW$1),
	defaultMaxTokens: Schema.number().step(1).min(1).default(DEFAULT_MAX_TOKENS$1),
	defaultInput: Schema.array(Schema.union(MODALITIES$1)).default([...DEFAULT_INPUT$1]),
	headers: Schema.dict(Schema.string()),
	reasoning: Schema.union(THINKING_LEVELS$1),
	thinkingBudgets: thinkingBudgets$1,
	cacheRetention: Schema.union([
		"none",
		"short",
		"long"
	]),
	transport: Schema.union([
		"sse",
		"websocket",
		"websocket-cached",
		"auto"
	]),
	timeoutMs: Schema.natural(),
	websocketConnectTimeoutMs: Schema.natural(),
	streamIdleTimeoutMs: Schema.number().min(Number.MIN_VALUE).max(MAX_TIMER_DELAY_MS).default(DEFAULT_STREAM_IDLE_TIMEOUT_MS$1),
	retryPolicy: RetryPolicySchema
});
Schema.object({ providers: Schema.dict(profile$1).default({}) });
settingsNamespace("llm-pi-ai");
//#endregion
//#region ../../packages/llm/llm-pi-ai/src/catalog.ts
/**
* Materialization of one provider route's model catalog. The installed pi-ai
* catalog supplies defaults keyed by model id, and a profile's own model
* entries override them field by field, so a route naming a catalog provider
* stays configuration-free while a route pi-ai has never heard of is fully
* describable from `settings.yaml`.
*
* Every pi-ai `Model` field the harness cannot default is required here rather
* than at request time: an unserviceable route fails while its configuration is
* being resolved, which is the earliest point that can name the offending key.
*
* @module dsh-llm-pi-ai/catalog
*/
/**
* Pricing for a model the installed catalog does not describe. The harness
* never reads pi-ai's cost metadata — `replay.ts` zeroes it and no consumer
* reports spend — so this is the absence of a fact, not a configurable rate.
*/
const NO_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
/** Every request modality a profile may declare. */
const MODALITIES = Object.keys({
	text: true,
	image: true
});
/**
* One entry's modality list, or `undefined` when it states no answer. Absent
* and empty mean the same thing — `[]` describes a model that accepts nothing
* and could serve no request — which is what makes an entry naming a catalog
* model without declaring modalities keep the catalog's, since the config
* schema materializes `[]` for an absent array.
* @param configured - the list a `models` or `modelOverrides` entry supplied.
* @returns the declared modalities, or `undefined` to ask the next level.
*/
function declaredInput(configured) {
	return configured === void 0 || configured.length === 0 ? void 0 : [...configured];
}
/** Every pi-ai thinking level a profile may declare, in escalation order. */
const THINKING_LEVELS = Object.keys({
	off: true,
	minimal: true,
	low: true,
	medium: true,
	high: true,
	xhigh: true,
	max: true
});
/** Reasoning-dispatch wire formats a profile may name, most-reached first. */
const SUPPORTED_THINKING_FORMATS = Object.keys({
	"openai": true,
	"deepseek": true,
	"openrouter": true,
	"together": true,
	"zai": true,
	"qwen": true,
	"string-thinking": true,
	"ant-ling": true
});
let providerIndex;
/**
* Installed catalog providers by id, constructed once. Each entry owns the API
* implementations for its own models, which is why a catalog route reuses this
* provider instead of being rebuilt from parts.
* @returns the catalog provider index.
*/
function catalogProviders() {
	providerIndex ??= new Map(builtinProviders().map((provider) => [provider.id, provider]));
	return providerIndex;
}
/**
* The installed catalog provider for one route, when pi-ai ships one.
* @param provider - provider route key.
* @returns the catalog provider, or `undefined` for a route pi-ai does not ship.
*/
function catalogProvider(provider) {
	return catalogProviders().get(provider);
}
/**
* The installed catalog models for one route, indexed by model id.
* @param provider - provider route key.
* @returns catalog models by id; empty for a route pi-ai does not ship.
*/
function catalogModels(provider) {
	if (!catalogProviders().has(provider)) return /* @__PURE__ */ new Map();
	const models = getBuiltinModels(provider);
	return new Map(models.map((model) => [model.id, model]));
}
/** Report a route the deployment cannot serve, naming the settings key at fault. */
function invalid(provider, detail) {
	throw new Error(`llm-pi-ai: provider "${provider}" ${detail}`);
}
/**
* The one wire protocol a catalog route's shipped models agree on. This is what
* lets a deployment add a model the installed catalog has not caught up with —
* a provider's newest release — without restating the protocol its siblings
* already use. A route whose shipped models disagree (an OpenAI-style catalog
* spanning Responses and Chat Completions) has no such answer, so a model it
* does not describe must name its protocol at the route.
*/
function sharedCatalogApi(defaults) {
	const apis = /* @__PURE__ */ new Set();
	for (const model of defaults.values()) apis.add(model.api);
	return apis.size === 1 ? [...apis][0] : void 0;
}
/**
* Resolve one model's reasoning capability from its declared efforts.
*
* A declared dict translates to pi-ai's `thinkingLevelMap` with every level
* decided explicitly: declared levels carry their wire spelling, undeclared
* levels are pinned to `null` (unsupported). Pinning matters because pi-ai's
* own defaulting is asymmetric — an absent key means "supported" for the five
* base levels but "unsupported" for `xhigh`/`max` — and a profile author
* should not need to know that. A declared `off` with no value is the one
* exception: it stays absent from the map, which pi-ai reads as "supported,
* send nothing" — the correct dispatch where not thinking is the parameter's
* absence — while `off` with a value sends that value.
* @param provider - provider route key, for diagnostics.
* @param entry - the configured model entry.
* @param base - the installed catalog entry of the same id, when one exists.
* @returns the reasoning fields the materialized model carries.
*/
function resolveModelReasoning(provider, entry, base) {
	const efforts = entry.reasoningEfforts;
	if (efforts === void 0) return { reasoning: base?.reasoning ?? false };
	if (efforts === false) return { reasoning: false };
	if (efforts === null || Object.keys(efforts).length === 0) invalid(provider, `model "${entry.id}" has an empty reasoningEfforts; declare the offered levels, set false for a non-reasoning model, or omit the field to keep the installed catalog's capability`);
	const declared = THINKING_LEVELS.flatMap((level) => {
		const wire = efforts[level];
		return wire === void 0 ? [] : [[level, wire]];
	});
	for (const [level, wire] of declared) if (wire === null) {
		if (level !== "off") invalid(provider, `model "${entry.id}" reasoningEfforts.${level} needs the wire value dispatch should send; only "off" may leave it empty`);
	} else if (wire.length === 0) invalid(provider, `model "${entry.id}" reasoningEfforts.${level} must not be an empty string`);
	if (!declared.some(([level]) => level !== "off")) invalid(provider, `model "${entry.id}" reasoningEfforts offers no level beyond "off"; declare a thinking level, or set reasoningEfforts to false for a non-reasoning model`);
	const map = {};
	for (const level of THINKING_LEVELS) {
		const wire = efforts[level];
		if (wire === void 0) map[level] = null;
		else if (wire !== null) map[level] = wire;
	}
	return {
		reasoning: true,
		thinkingLevelMap: map
	};
}
/**
* Resolve one model's compat block from the profile's reasoning switches.
*
* A model switch wins over the route switch; whatever neither sets keeps the
* installed entry's value, and a field no layer decides falls through to
* pi-ai's baseURL-derived detection. Only an `openai-completions` model takes
* the switches at all: a model-level switch on any other protocol fails
* resolution, while a route-level default skips past such models — the same
* posture as the route-level `reasoning` default, which also must not fail
* models it does not fit.
* @param provider - provider route key, for diagnostics.
* @param entry - the configured model entry.
* @param route - the route-level switches, when any.
* @param base - the installed catalog entry of the same id, when one exists.
* @param api - the model's resolved wire protocol.
* @returns a `compat` field to spread into the model, or nothing.
*/
function resolveModelCompat(provider, entry, route, base, api) {
	const thinkingFormat = entry.compat?.thinkingFormat ?? route?.thinkingFormat;
	const supportsReasoningEffort = entry.compat?.supportsReasoningEffort ?? route?.supportsReasoningEffort;
	if (thinkingFormat === void 0 && supportsReasoningEffort === void 0) return {};
	if (api !== "openai-completions") {
		if (entry.compat?.thinkingFormat !== void 0 || entry.compat?.supportsReasoningEffort !== void 0) invalid(provider, `model "${entry.id}" sets compat reasoning switches, but its api is "${api}"; thinkingFormat and supportsReasoningEffort exist only on openai-completions`);
		return {};
	}
	return { compat: {
		...base?.api === api ? base.compat : void 0,
		...thinkingFormat === void 0 ? {} : { thinkingFormat },
		...supportsReasoningEffort === void 0 ? {} : { supportsReasoningEffort }
	} };
}
/**
* Materialize one route's catalog by merging the installed catalog defaults
* under the configured entries. A route with no configured `models` serves the
* installed catalog unchanged, which is what keeps an existing
* `providers: { deepseek: { apiKeyEnv: … } }` profile working untouched.
* @param request - the route-level catalog facts.
* @returns the materialized models and the explicitly configured request caps.
*/
function resolveRouteModels(request) {
	const { provider } = request;
	const defaults = catalogModels(provider);
	const providerBaseUrl = catalogProvider(provider)?.baseUrl;
	const configured = request.models ?? [];
	const overrides = request.modelOverrides ?? {};
	for (const [id, override] of Object.entries(overrides)) {
		if (id.length === 0) invalid(provider, "has a modelOverrides entry with an empty model id");
		if (defaults.size === 0) invalid(provider, `sets modelOverrides for "${id}", but the installed catalog does not describe this route; a declared route spells every model out in its models list`);
		if (configured.length > 0) invalid(provider, `sets modelOverrides for "${id}" beside a models list; models already replaces the served catalog, so declare the fields on its entries`);
		if (!defaults.has(id)) invalid(provider, `modelOverrides names "${id}", which the installed catalog does not describe`);
		if ("id" in override) invalid(provider, `modelOverrides entry "${id}" sets "id", which is the dict key`);
	}
	const entries = configured.length > 0 ? configured : [...defaults.values()].map((model) => ({
		id: model.id,
		...overrides[model.id]
	}));
	if (entries.length === 0) invalid(provider, "resolves no models; the installed catalog does not describe this route, so its models must be listed in configuration");
	const routeApi = sharedCatalogApi(defaults);
	const routeCompatDefined = request.compat?.thinkingFormat !== void 0 || request.compat?.supportsReasoningEffort !== void 0;
	const seen = /* @__PURE__ */ new Set();
	const configuredMaxTokens = /* @__PURE__ */ new Map();
	const models = entries.map((entry) => {
		if (entry.id.length === 0) invalid(provider, "has a model with an empty id");
		if (seen.has(entry.id)) invalid(provider, `lists model "${entry.id}" more than once`);
		seen.add(entry.id);
		const base = defaults.get(entry.id);
		const api = request.api ?? base?.api ?? routeApi;
		if (api === void 0) invalid(provider, `model "${entry.id}" needs an api; the installed catalog does not describe it, so set the route's api to the wire protocol its endpoint speaks`);
		const baseUrl = request.baseURL ?? base?.baseUrl ?? providerBaseUrl;
		if (baseUrl === void 0) invalid(provider, `model "${entry.id}" needs a baseURL; the installed catalog does not describe this route`);
		const contextWindow = entry.contextWindow ?? base?.contextWindow ?? request.defaultContextWindow;
		if (!Number.isInteger(contextWindow) || contextWindow <= 0) invalid(provider, `model "${entry.id}" contextWindow must be a positive integer`);
		const maxTokens = entry.maxTokens ?? base?.maxTokens ?? request.defaultMaxTokens;
		if (!Number.isInteger(maxTokens) || maxTokens <= 0) invalid(provider, `model "${entry.id}" maxTokens must be a positive integer`);
		if (entry.maxTokens !== void 0) configuredMaxTokens.set(entry.id, entry.maxTokens);
		return {
			...base,
			id: entry.id,
			name: entry.name ?? base?.name ?? entry.id,
			api,
			provider,
			baseUrl,
			input: declaredInput(entry.input) ?? base?.input ?? [...request.defaultInput],
			cost: base?.cost ?? NO_COST,
			contextWindow,
			maxTokens,
			...resolveModelReasoning(provider, entry, base),
			...resolveModelCompat(provider, entry, request.compat, base, api)
		};
	});
	if (routeCompatDefined && !models.some((model) => model.api === "openai-completions")) invalid(provider, "sets compat reasoning switches, but no model on the route speaks openai-completions; thinkingFormat and supportsReasoningEffort exist only on that protocol");
	return {
		models,
		configuredMaxTokens
	};
}
//#endregion
//#region ../../packages/llm/llm-pi-ai/src/provider.ts
/**
* Construction of the pi-ai `Provider` that one configured route registers into
* the adapter's `Models` collection.
*
* Two constructions, one decision: a route the installed catalog ships, whose
* profile does not override the wire protocol, **reuses that catalog provider**
* with its models replaced — the catalog provider owns API implementations this
* package cannot reconstruct (Bedrock loads its Smithy module through a
* separate entry point), so rebuilding it from parts would silently narrow
* which providers work. Every other route — one pi-ai has never heard of, or a
* catalog route pointed at a different protocol — is built by `createProvider`
* over the protocol table below.
*
* Credentials never reach this module's storage: the harness resolves a route's
* key through `ctx.credentials` before the request enters pi-ai and hands it
* over as a stream option, which `Models` presents to `resolve()` as the
* credential key.
*
* @module dsh-llm-pi-ai/provider
*/
/**
* Wire protocols a configured route may name, mapped to pi-ai's lazily loaded
* implementations. Each entry is the factory that pi-ai's matching provider
* factory uses, so a hand-declared route reaches exactly the implementation a
* catalog route would.
*
* The table is deliberately narrow: the protocols a hand-declared route
* actually reaches for today, each completely describable with a key, an
* endpoint, and headers. Bedrock signs with SigV4 over AWS credentials and a
* region, Vertex needs a project, a location, and application-default
* credentials, Azure needs provider environment plus an api-version, and Codex
* authenticates through OAuth — none of which this configuration shape can
* express, so offering them would hand back a provider that cannot
* authenticate. The remainder are absent for want of a consumer rather than a
* blocker: each is one line here once a deployment needs it. Catalog routes
* still reach every protocol through their own provider; only an explicit
* override is refused.
*/
const PROTOCOLS = {
	"openai-completions": openAICompletionsApi,
	"openai-responses": openAIResponsesApi,
	"anthropic-messages": anthropicMessagesApi
};
/**
* Every wire protocol a configured route may name, most-reached first. The
* order is the table's and therefore stable; a configuration surface offering
* a choice presents the first as its default, which is why the protocol a
* hand-declared gateway most often speaks — and the one endpoint interrogation
* can read — leads.
* @returns the supported protocol identifiers.
*/
function supportedProtocols() {
	return Object.keys(PROTOCOLS);
}
/**
* Api-key auth for a route the harness authenticates itself. `Models` calls
* this after the adapter has already resolved the route's credential, so a
* missing key here is not this layer's failure: a named-but-unresolvable
* reference has already failed the request with `MISSING_CREDENTIAL`, and a
* route naming no credential at all is deliberately unauthenticated. Reporting
* it as configured hands the decision to the protocol, which is where the
* requirement actually lives — pi-ai's OpenAI-compatible implementation, for
* one, still insists on a key or an `Authorization` header of its own.
* @param name - display name used as the resolution's status label.
* @returns the api-key auth for a harness-authenticated route.
*/
function harnessApiKeyAuth(name) {
	return {
		name,
		resolve: ({ credential }) => Promise.resolve({
			auth: credential?.key === void 0 ? {} : { apiKey: credential.key },
			source: name
		})
	};
}
/**
* The auth one route resolves its credential through.
*
* A catalog route keeps the installed provider's own auth, which is what
* preserves provider-native ambient discovery for a profile naming no
* credential. That holds even when the profile repoints the protocol: which
* environment a provider reads is a property of the provider, not of the wire
* format its models speak.
*
* The single addition covers a catalog provider that offers no api-key method
* at all. pi-ai resolves a request's `apiKey` override only when the provider
* declares one (`resolveProviderAuth` checks `provider.auth.apiKey` before
* honouring the override), so an OAuth-only provider — `openai-codex` is the
* one the installed catalog ships — would refuse a profile's explicit key with
* `Provider is not configured` before any request went out. Adding the harness
* method beside the provider's own restores that route. A keyless profile adds
* nothing and still reports the honest refusal, because this adapter resolves
* credentials through its own seam and holds no OAuth store to fall back on.
* @param spec - the resolved route facts.
* @param catalog - the installed catalog provider, when pi-ai ships one.
* @returns the auth to construct this route's provider with.
*/
function routeAuth(spec, catalog) {
	if (catalog === void 0) return { apiKey: harnessApiKeyAuth(spec.displayName) };
	if (catalog.auth.apiKey !== void 0 || !spec.namesCredential) return catalog.auth;
	return {
		...catalog.auth,
		apiKey: harnessApiKeyAuth(spec.displayName)
	};
}
/**
* Reuse an installed catalog provider with this route's models and identity.
* Model dispatch stays with the catalog provider, so its API implementations,
* compatibility quirks, and ambient credential discovery are preserved exactly.
* Catalog-owned dynamic refresh is dropped: this route's catalog is the
* settings document, and a background refresh would contradict it.
*/
function reuseCatalogProvider(base, spec) {
	const baseUrl = spec.baseURL ?? base.baseUrl;
	return {
		id: spec.provider,
		name: spec.displayName,
		...baseUrl === void 0 ? {} : { baseUrl },
		auth: routeAuth(spec, base),
		getModels: () => spec.models,
		stream: (model, context, options) => base.stream(model, context, options),
		streamSimple: (model, context, options) => base.streamSimple(model, context, options)
	};
}
/**
* Build the pi-ai provider for one resolved route.
* @param spec - the resolved route facts.
* @returns the provider to register in the adapter's `Models` collection.
* @throws Error when the route names a wire protocol this build cannot serve.
*/
function buildProvider(spec) {
	const catalog = catalogProvider(spec.provider);
	if (catalog !== void 0 && spec.api === void 0) return reuseCatalogProvider(catalog, spec);
	const factory = spec.api === void 0 ? void 0 : PROTOCOLS[spec.api];
	if (factory === void 0) throw new Error(`llm-pi-ai: provider "${spec.provider}" names api "${spec.api}", which this build cannot serve; supported protocols are ${supportedProtocols().join(", ")}`);
	return createProvider({
		id: spec.provider,
		name: spec.displayName,
		...spec.baseURL === void 0 ? {} : { baseUrl: spec.baseURL },
		auth: routeAuth(spec, catalog),
		models: spec.models,
		api: factory()
	});
}
//#endregion
//#region ../../packages/llm/llm-pi-ai/src/config.ts
/** Default maximum idle interval while an adapter stream read is outstanding. */
const DEFAULT_STREAM_IDLE_TIMEOUT_MS = 3e5;
/** Context capacity assumed for a model neither configuration nor the catalog sizes. */
const DEFAULT_CONTEXT_WINDOW = 262144;
/** Output capability assumed for a model neither configuration nor the catalog sizes. */
const DEFAULT_MAX_TOKENS = 32768;
/**
* Modalities assumed for a model neither configuration nor the catalog
* declares. Text is the floor every supported protocol certainly carries, so
* this is the absence of a declaration rather than a guess at the endpoint:
* nothing can interrogate a gateway for its modalities, and the two wrong
* answers do not cost the same. Under-claiming refuses the image before it is
* attached, naming the model. Over-claiming admits one the provider then
* rejects mid-turn, after the message is durable, leaving the session
* repeating a request that cannot succeed.
*/
const DEFAULT_INPUT = ["text"];
const thinkingBudgets = Schema.object({
	minimal: Schema.number(),
	low: Schema.number(),
	medium: Schema.number(),
	high: Schema.number()
});
const compatProfile = Schema.object({
	thinkingFormat: Schema.union(SUPPORTED_THINKING_FORMATS),
	supportsReasoningEffort: Schema.boolean()
});
/**
* Keys are the offered levels, values their wire spellings. A valueless key
* (`off:`) survives validation because schemastery passes nullable data
* through before any member schema runs — `z.const(null)` only controls the
* error for non-null wrong values and what a configuration UI renders.
* Only resolution decides which levels may leave the value empty, so the
* diagnostic can name the route and model. The assertion narrows
* schemastery's `Dict`, which types every literal key as required; dict
* validation checks only present keys, so the runtime value is a partial record.
*/
const reasoningEfforts = Schema.dict(Schema.union([Schema.string(), Schema.const(null)]), Schema.union(THINKING_LEVELS));
/** The fields a `models` entry and a `modelOverrides` value share; only the id's home differs. */
const modelFields = {
	name: Schema.string(),
	contextWindow: Schema.number().step(1).min(1),
	maxTokens: Schema.number().step(1).min(1),
	input: Schema.array(Schema.union(MODALITIES)),
	reasoningEfforts: Schema.union([Schema.const(false), reasoningEfforts]),
	compat: compatProfile
};
const modelProfile = Schema.object({
	id: Schema.string().required(),
	...modelFields
});
/** A {@link modelProfile} whose id lives in the `modelOverrides` dict key. */
const modelOverride = Schema.object(modelFields);
const profile = Schema.object({
	apiKeyEnv: Schema.string().role("credential-ref"),
	displayName: Schema.string(),
	api: Schema.union(supportedProtocols()),
	baseURL: Schema.string(),
	models: Schema.array(modelProfile),
	modelOverrides: Schema.dict(modelOverride),
	compat: compatProfile,
	defaultContextWindow: Schema.number().step(1).min(1).default(DEFAULT_CONTEXT_WINDOW),
	defaultMaxTokens: Schema.number().step(1).min(1).default(DEFAULT_MAX_TOKENS),
	defaultInput: Schema.array(Schema.union(MODALITIES)).default([...DEFAULT_INPUT]),
	headers: Schema.dict(Schema.string()),
	reasoning: Schema.union(THINKING_LEVELS),
	thinkingBudgets,
	cacheRetention: Schema.union([
		"none",
		"short",
		"long"
	]),
	transport: Schema.union([
		"sse",
		"websocket",
		"websocket-cached",
		"auto"
	]),
	timeoutMs: Schema.natural(),
	websocketConnectTimeoutMs: Schema.natural(),
	streamIdleTimeoutMs: Schema.number().min(Number.MIN_VALUE).max(MAX_TIMER_DELAY_MS).default(DEFAULT_STREAM_IDLE_TIMEOUT_MS),
	retryPolicy: RetryPolicySchema
});
Schema.object({ providers: Schema.dict(profile).default({}) });
/** Reject removed pre-release profile fields and name their replacements. */
function rejectRemovedFields(provider, source) {
	const legacy = source;
	if ("provider" in legacy) throw new Error(`llm-pi-ai: provider "${provider}" sets "provider", which moved to the providers dict key`);
	if ("maxRetries" in legacy || "maxRetryDelayMs" in legacy) throw new Error(`llm-pi-ai: provider "${provider}" sets maxRetries or maxRetryDelayMs, which were removed; compose agent recovery with dsh-llm-retry`);
}
/**
* Validate profiles and return a detached route-keyed map suitable for
* per-request reads. This is the one explicit resolve step, so an omitted dict
* resolves to the empty (dormant) route set here rather than through a hidden
* fallback, and each route's models and pi-ai provider are materialized once.
* @param providers - configured provider profiles keyed by route.
* @returns validated profiles in configuration order.
*/
function resolveProfiles(providers) {
	if (Array.isArray(providers)) throw new Error("llm-pi-ai: providers is now a dict keyed by provider route, not an array of profiles");
	const entries = Object.entries(providers ?? {});
	const resolved = /* @__PURE__ */ new Map();
	for (const [provider, source] of entries) {
		rejectRemovedFields(provider, source);
		if (provider.length === 0) throw new Error("llm-pi-ai: provider names must be non-empty");
		if (source.baseURL !== void 0 && source.baseURL.length === 0) throw new Error(`llm-pi-ai: provider "${provider}" has an empty baseURL`);
		if (source.displayName !== void 0 && source.displayName.length === 0) throw new Error(`llm-pi-ai: provider "${provider}" has an empty displayName`);
		const streamIdleTimeoutMs = source.streamIdleTimeoutMs ?? 3e5;
		if (!Number.isFinite(streamIdleTimeoutMs) || streamIdleTimeoutMs <= 0 || streamIdleTimeoutMs > 2147483647) throw new Error(`llm-pi-ai: provider "${provider}" streamIdleTimeoutMs must be a positive finite number no greater than ${MAX_TIMER_DELAY_MS}`);
		const defaultInput = [...source.defaultInput ?? DEFAULT_INPUT];
		if (defaultInput.length === 0) throw new Error(`llm-pi-ai: provider "${provider}" defaultInput must name at least one modality`);
		const displayName = source.displayName ?? provider;
		const catalog = resolveRouteModels({
			provider,
			...source.api === void 0 ? {} : { api: source.api },
			...source.baseURL === void 0 ? {} : { baseURL: source.baseURL },
			...source.models === void 0 ? {} : { models: source.models },
			...source.modelOverrides === void 0 ? {} : { modelOverrides: source.modelOverrides },
			...source.compat === void 0 ? {} : { compat: source.compat },
			defaultInput,
			defaultContextWindow: source.defaultContextWindow ?? 262144,
			defaultMaxTokens: source.defaultMaxTokens ?? 32768
		});
		const { apiKeyEnv, retryPolicy, models: _models, displayName: _displayName, ...rest } = source;
		resolved.set(provider, {
			...rest,
			provider,
			displayName,
			...apiKeyEnv === void 0 ? {} : { apiKeyEnv: credentialRef(apiKeyEnv) },
			streamIdleTimeoutMs,
			retryPolicy: resolveRetryPolicy(retryPolicy, `llm-pi-ai: provider "${provider}" retryPolicy`),
			...rest.headers === void 0 ? {} : { headers: { ...rest.headers } },
			...rest.thinkingBudgets === void 0 ? {} : { thinkingBudgets: { ...rest.thinkingBudgets } },
			configuredMaxTokens: catalog.configuredMaxTokens,
			piProvider: buildProvider({
				provider,
				displayName,
				...source.api === void 0 ? {} : { api: source.api },
				...source.baseURL === void 0 ? {} : { baseURL: source.baseURL },
				models: catalog.models,
				namesCredential: apiKeyEnv !== void 0
			})
		});
	}
	return resolved;
}
//#endregion
//#region src/config.ts
/**
* vision-plus bundle 配置（静态元数据；线路/池全部来自 vision-plus 设置命名空间）。
*/
const variantSchema = object({
	id: string().min(1),
	name: string().min(1),
	textProvider: string().min(1),
	textModel: string().min(1)
});
const Config = object({
	providerId: string().min(1).default("vision-plus"),
	providerName: string().min(1).default("DeepSeek VisionPlus"),
	contextWindow: number().int().positive().default(128e3),
	variants: array(variantSchema).min(1).default([{
		id: "deepseek-v4-pro-visionplus",
		name: "DeepSeek-V4-Pro 视觉",
		textProvider: "vp-deepseek",
		textModel: "deepseek-v4-pro"
	}, {
		id: "deepseek-v4-flash-visionplus",
		name: "DeepSeek-V4-Flash 视觉",
		textProvider: "vp-deepseek",
		textModel: "deepseek-v4-flash"
	}]),
	rateLimit: object({
		minIntervalMs: number().int().positive().default(1500),
		maxPerMinute: number().int().positive().default(8),
		cooldownMs: number().int().positive().default(8e3)
	}).default({
		minIntervalMs: 1500,
		maxPerMinute: 8,
		cooldownMs: 8e3
	}),
	contextMaxMessages: number().int().min(1).max(200).default(20)
});
//#endregion
//#region src/adapter.ts
/**
* 视觉路由适配器。
*
* 对外（模型选择器）：一个 provider 路由，两个包装模型变体，
* 都声明支持 [text, image] —— 这样 harness 的"发图关卡"和 read_image
* 关卡自然放行，无需任何源码补丁。
*
* 对内（stream）：按消息里有没有图片分流。
* - 无图 → 交给文本后端（DeepSeek），原样透传；
* - 有图 → 顺序轮换视觉池，逐个尝试；全失败抛结构化错误，
*   由上层（DeepSeek + harness 重试）自行决策后续。
*
* 重放兼容：剥离内层 pi-ai 的 replayState（其 provider 是内层线路，
* 与对外路由不一致会让 harness 重放校验报错）。剥掉后 harness 走普通
* 请求路径，行为等价。
*/
var VisionRouterAdapter = class extends LlmAdapter {
	config;
	inner;
	pool;
	status;
	constructor(config, inner, pool, status) {
		super();
		this.config = config;
		this.inner = inner;
		this.pool = pool;
		this.status = status;
	}
	providerInfo(provider) {
		return {
			id: provider,
			name: this.config.providerName
		};
	}
	listModels() {
		return Promise.resolve(this.config.variants.map((variant) => ({
			provider: this.config.providerId,
			id: variant.id,
			name: variant.name,
			inputModalities: ["text", "image"]
		})));
	}
	resolveModel(provider, model) {
		const variant = this.variantOf(model);
		return Promise.resolve({
			provider,
			id: model,
			name: variant.name,
			inputModalities: ["text", "image"],
			context: { contextWindow: this.config.contextWindow },
			reasoning: {
				efforts: [
					{
						id: ReasoningEffortId("off"),
						name: "Off"
					},
					{
						id: ReasoningEffortId("high"),
						name: "High"
					},
					{
						id: ReasoningEffortId("max"),
						name: "Max"
					}
				],
				defaultEffort: ReasoningEffortId("high")
			}
		});
	}
	async *stream(options) {
		const variant = this.variantOf(options.model);
		const lastAssistant = (() => {
			for (let i = options.messages.length - 1; i >= 0; i -= 1) if (options.messages[i]?.role === "assistant") return i;
			return -1;
		})();
		if (!options.messages.filter((_message, index) => index > lastAssistant).some((message) => contentHasImage$1(message.content))) {
			yield* this.sanitize(this.inner.stream({
				...options,
				provider: variant.textProvider,
				model: variant.textModel
			}));
			return;
		}
		const visionOptions = {
			...options,
			reasoningEffort: void 0,
			messages: options.messages.slice(-this.config.contextMaxMessages)
		};
		const tried = [];
		const failures = [];
		let last;
		for (const entry of this.pool.ordered()) {
			const startedAt = Date.now();
			try {
				await this.pool.acquire(entry);
				this.status.set({
					phase: "calling",
					label: entry.label,
					tried
				});
				yield* this.sanitize(this.inner.stream({
					...visionOptions,
					provider: entry.provider,
					model: entry.model
				}));
				this.pool.recordSuccess(entry);
				const elapsedMs = Date.now() - startedAt;
				this.status.set({
					phase: "success",
					label: entry.label,
					elapsedMs,
					tried
				});
				const elapsed = (elapsedMs / 1e3).toFixed(1);
				this.status.report(tried.length > 0 ? `vision-plus：⚠️ ${tried.join("、")} 失败后，图片已由 ${entry.label} 处理完成（${elapsed}s）` : `vision-plus：✅ 图片已由 ${entry.label} 处理完成（${elapsed}s）`);
				return;
			} catch (error) {
				last = error;
				tried.push(entry.label);
				const classified = this.pool.recordFailure(entry, error);
				failures.push({
					label: entry.label,
					message: classified.message
				});
				this.status.set({
					phase: "failed",
					label: entry.label,
					error: classified,
					tried
				});
			}
		}
		this.status.set({
			phase: "exhausted",
			label: void 0,
			tried
		});
		const detail = failures.map((failure) => `${failure.label}(${failure.message})`).join("、");
		this.status.report(`vision-plus：❌ 视觉池 ${failures.length} 个模型全部失败（${detail}），已交由模型自行决策后续`);
		throw new LlmError(`vision-plus: 视觉池 ${failures.length} 个模型全部失败，请由 DeepSeek 自行决策后续：\n` + failures.map((failure) => `- ${failure.label}: ${failure.message}`).join("\n"), "VISION_POOL_EXHAUSTED", { cause: last });
	}
	/** 剥离 finish 块的内层 replayState，避免对外路由与重放状态不一致。
	*  注意：必须删除字段而不是置 undefined —— 会话持久化拒绝 undefined。 */
	async *sanitize(iterable) {
		for await (const chunk of iterable) if (chunk.type === "finish" && chunk.replayState !== void 0) {
			const { replayState: _ignored, ...rest } = chunk;
			yield rest;
		} else yield chunk;
	}
	variantOf(model) {
		const variant = this.config.variants.find((item) => item.id === model);
		if (variant === void 0) throw new LlmError(`vision-plus 没有模型 "${model}"`, "UNKNOWN_MODEL");
		return variant;
	}
};
//#endregion
//#region src/pool.ts
/** 把上游错误归类成结构化信息，供轮换与最终报错使用。 */
function classifyError(error) {
	const code = error?.code;
	const codeText = typeof code === "string" ? code : "";
	const message = error instanceof Error ? error.message : String(error);
	const text = `${codeText} ${message}`;
	if (codeText === "TIMEOUT" || codeText === "ABORTED" || /timeout|timed out/i.test(text)) return {
		kind: "timeout",
		retriable: true,
		message: "请求超时"
	};
	if (/429|rate.?limit|quota|too many|限流/i.test(text) || codeText === "QUOTA_EXCEEDED") return {
		kind: "rate_limit",
		retriable: true,
		message: "触发限流(429)"
	};
	if (codeText === "MISSING_CREDENTIAL" || /401|403|invalid.*key|unauthorized|api key/i.test(text)) return {
		kind: "auth",
		retriable: false,
		message: "密钥无效或未配置"
	};
	if (codeText === "CONTEXT_WINDOW_EXCEEDED" || /context.*(window|length)|too_small|65536|tokens.*<=/i.test(text)) return {
		kind: "content",
		retriable: false,
		message: "内容超出上下文窗口"
	};
	if (/ECONNREFUSED|ENOTFOUND|ECONNRESET|fetch failed|network|socket/i.test(text)) return {
		kind: "network",
		retriable: true,
		message: "网络错误"
	};
	return {
		kind: "unknown",
		retriable: false,
		message: message.slice(0, 120)
	};
}
var VisionPool = class {
	entries;
	rateLimit;
	states = /* @__PURE__ */ new Map();
	constructor(entries, rateLimit) {
		this.entries = entries;
		this.rateLimit = rateLimit;
	}
	/** 当前可用的条目顺序（冷却中的排到后面，全冷却则全部返回）。 */
	ordered() {
		const now = Date.now();
		const current = this.entries();
		const usable = current.filter((entry) => this.state(entry).cooldownUntil <= now);
		const cooling = current.filter((entry) => this.state(entry).cooldownUntil > now);
		return [...usable, ...cooling];
	}
	/** 请求前获取许可：节流 + 每分钟上限。超限时抛错，由调用方轮换。 */
	async acquire(entry) {
		const state = this.state(entry);
		const now = Date.now();
		if (now < state.cooldownUntil) throw new Error(`[vision-plus] ${entry.label} 冷却中，剩余 ${Math.ceil((state.cooldownUntil - now) / 1e3)}s`);
		if (now - state.minuteWindowStart >= 6e4) {
			state.minuteWindowStart = now;
			state.minuteCount = 0;
		}
		if (state.minuteCount >= this.rateLimit.maxPerMinute) throw new Error(`[vision-plus] ${entry.label} 超过每分钟 ${this.rateLimit.maxPerMinute} 次上限`);
		const wait = state.lastRequestAt + this.rateLimit.minIntervalMs - now;
		if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
		state.minuteCount += 1;
		state.lastRequestAt = Date.now();
	}
	recordSuccess(entry) {
		this.state(entry).cooldownUntil = 0;
	}
	recordFailure(entry, error) {
		const classified = classifyError(error);
		const state = this.state(entry);
		if (classified.kind === "rate_limit" || classified.kind === "network" || classified.kind === "timeout") state.cooldownUntil = Date.now() + this.rateLimit.cooldownMs;
		return classified;
	}
	state(entry) {
		let state = this.states.get(entry.id);
		if (state === void 0) {
			state = {
				cooldownUntil: 0,
				lastRequestAt: 0,
				minuteCount: 0,
				minuteWindowStart: 0
			};
			this.states.set(entry.id, state);
		}
		return state;
	}
};
//#endregion
//#region src/status.ts
var StatusTracker = class {
	listeners = /* @__PURE__ */ new Set();
	current = { phase: "idle" };
	pending = [];
	subscribe(listener) {
		this.listeners.add(listener);
		try {
			listener(this.current);
		} catch {}
		return () => {
			this.listeners.delete(listener);
		};
	}
	set(next) {
		this.current = next;
		for (const listener of this.listeners) try {
			listener(next);
		} catch {}
	}
	/** 追加一条待显示行。 */
	report(line) {
		this.pending.push(line);
	}
	/** 取出并清空全部待显示行（无则空数组）。 */
	drainAll() {
		const lines = this.pending;
		this.pending = [];
		return lines;
	}
	get() {
		return this.current;
	}
};
//#endregion
//#region src/detect.ts
/** 检测 agent 当前是否有"待处理"的图片（最后一次 assistant 回复之后新出现的图片）。 */
function contentHasImage(content) {
	if (!Array.isArray(content)) return false;
	return content.some((block) => {
		if (block === null || typeof block !== "object") return false;
		const b = block;
		if (b.type === "image") return true;
		if (b.type === "tool-result") return contentHasImage(b.content);
		return false;
	});
}
function hasPendingImage(agent) {
	try {
		const messages = agent?.session && typeof agent.session.deriveMessages === "function" ? agent.session.deriveMessages() : null;
		if (!Array.isArray(messages)) return false;
		let lastAssistant = -1;
		for (let i = messages.length - 1; i >= 0; i--) {
			const m = messages[i];
			if (m && m.role === "assistant") {
				lastAssistant = i;
				break;
			}
		}
		for (let i = lastAssistant + 1; i < messages.length; i++) {
			const m = messages[i];
			if (contentHasImage(m?.content)) return true;
		}
		return false;
	} catch {
		return false;
	}
}
//#endregion
//#region src/settings-schema.ts
/**
* vision-plus 插件自己的设置命名空间（vision-plus）。
* 零补丁设计：不再借用 llm-pi-ai 的 providers（那样会被内置 pi-ai 注册进
* 模型选择器，需要宿主补丁隐藏）。读写走插件自挂的 HTTP 接口。
*/
const optionalString = Schema.union([Schema.string(), Schema.const(void 0)]);
const optionalNatural = Schema.union([Schema.natural(), Schema.const(void 0)]);
const modelSchema = Schema.object({
	id: Schema.string(),
	name: optionalString,
	contextWindow: optionalNatural,
	maxTokens: optionalNatural
});
const visionProviderSchema = Schema.object({
	id: Schema.string(),
	displayName: Schema.string(),
	baseURL: Schema.string(),
	apiKeyEnv: Schema.string(),
	models: Schema.array(modelSchema)
});
const settingsSchema = Schema.object({
	text: Schema.object({
		baseURL: Schema.string().default("https://api.deepseek.com"),
		apiKeyEnv: Schema.string().default("DEEPSEEK_API_KEY"),
		models: Schema.array(modelSchema)
	}),
	visionModels: Schema.array(visionProviderSchema)
});
/** DeepSeek 文本后端默认模型（官方规格 1M 上下文） */
const DEEPSEEK_MODELS_DEFAULT = [{
	id: "deepseek-v4-pro",
	name: "DeepSeek-V4-Pro",
	contextWindow: 1048576
}, {
	id: "deepseek-v4-flash",
	name: "DeepSeek-V4-Flash",
	contextWindow: 1048576
}];
//#endregion
//#region src/index.ts
const name = "vision-plus";
const inject = [
	"llm",
	"credentials",
	"attachments",
	"settings",
	"agentDefaultModel",
	"webServer"
];
/** 设置存放在插件自有命名空间 vision-plus（零补丁：不借用 llm-pi-ai，内部线路不进模型选择器）。 */
const NS = "vision-plus";
/** 文本后端（DeepSeek）与视觉池线路转成 pi-ai 内部 profile（只供本插件调用，不注册进宿主目录）。 */
function buildProfiles(settings) {
	const providers = {};
	const textModels = settings.text.models.length > 0 ? settings.text.models : DEEPSEEK_MODELS_DEFAULT;
	providers["vp-deepseek"] = {
		displayName: "DeepSeek",
		api: "openai-completions",
		baseURL: settings.text.baseURL || "https://api.deepseek.com",
		apiKeyEnv: settings.text.apiKeyEnv || "DEEPSEEK_API_KEY",
		models: textModels.map((m) => ({
			id: m.id,
			name: m.name ?? m.id,
			input: ["text"],
			...m.contextWindow === void 0 ? {} : { contextWindow: m.contextWindow },
			...m.maxTokens === void 0 ? {} : { maxTokens: m.maxTokens }
		}))
	};
	settings.visionModels.forEach((vm, index) => {
		providers[`vp-vision-${index}`] = {
			displayName: vm.displayName,
			api: "openai-completions",
			baseURL: vm.baseURL,
			apiKeyEnv: vm.apiKeyEnv,
			models: vm.models.map((m) => ({
				id: m.id,
				name: m.name ?? m.id,
				input: ["text", "image"],
				...m.contextWindow === void 0 ? {} : { contextWindow: m.contextWindow },
				...m.maxTokens === void 0 ? {} : { maxTokens: m.maxTokens }
			}))
		};
	});
	return providers;
}
/**
* vision-plus：DeepSeek Harness 视觉插件（公共、零补丁）。
*
* - 设置页（自定义卡片"DeepSeek 免费视觉"）读写 llm-pi-ai 的视觉线路；
* - 模型选择器两个包装变体；发图自动走视觉池；无图走 DeepSeek；
* - 对话内友好状态行。
*/
function apply(ctx, config) {
	const cfg = Config.parse(config ?? {});
	const webServer = ctx.webServer;
	if (webServer === void 0) ctx.logger.warn("vision-plus: webServer 服务不可用，测试通道不可用");
	else webServer.register({
		kind: "exact",
		path: "/api/visionPlus.test",
		handler: async (req, res) => {
			let responseSent = false;
			const respond = (status, body) => {
				if (responseSent) return;
				responseSent = true;
				res.writeHead(status, { "content-type": "application/json" });
				res.end(JSON.stringify(body));
			};
			try {
				let raw = "";
				for await (const chunk of req) raw += chunk;
				const parsed = JSON.parse(raw);
				const route = parsed.payload?.route;
				if (route === void 0 || route.length === 0) {
					respond(200, {
						type: "server-response",
						rpcId: parsed.rpcId ?? "",
						result: {
							ok: true,
							value: {
								ok: false,
								reason: "缺少 route 参数"
							}
						}
					});
					return;
				}
				const value = await runVisionTest(ctx, route);
				respond(200, {
					type: "server-response",
					rpcId: parsed.rpcId ?? "",
					result: {
						ok: true,
						value
					}
				});
			} catch (error) {
				respond(200, {
					type: "server-response",
					rpcId: "",
					result: {
						ok: false,
						error: {
							code: "internal",
							message: error instanceof Error ? error.message : String(error)
						}
					}
				});
			}
		}
	});
	const defaults = () => ({
		text: {
			baseURL: "https://api.deepseek.com",
			apiKeyEnv: "DEEPSEEK_API_KEY",
			models: DEEPSEEK_MODELS_DEFAULT.map((m) => ({ ...m }))
		},
		visionModels: []
	});
	let sourceThunk = () => defaults();
	installSettingsSection(ctx, NS, settingsSchema, defaults(), {
		setSource: (thunk) => {
			sourceThunk = thunk;
		},
		onChange: () => {}
	});
	const readSettings = () => {
		try {
			return sourceThunk();
		} catch {
			return defaults();
		}
	};
	let migrateAttempts = 0;
	const migrateLegacy = () => {
		if (migrateAttempts >= 15) return;
		migrateAttempts += 1;
		try {
			const providers = ctx.settings.get("llm-pi-ai")?.providers ?? {};
			const vpRoutes = Object.keys(providers).filter((route) => route.startsWith("vp-") && route !== "vp-deepseek");
			const current = readSettings();
			if (vpRoutes.length === 0 || current.visionModels.length > 0) {
				migrateAttempts = 15;
				return;
			}
			const visionModels = vpRoutes.map((route, index) => {
				const raw = providers[route];
				return {
					id: `vp-${index}`,
					displayName: raw.displayName ?? route,
					baseURL: raw.baseURL ?? "",
					apiKeyEnv: raw.apiKeyEnv ?? "",
					models: (raw.models ?? []).filter((m) => typeof m?.id === "string" && m.id.length > 0).map((m) => ({
						id: m.id,
						name: m.name ?? m.id,
						...m.contextWindow === void 0 ? {} : { contextWindow: m.contextWindow },
						...m.maxTokens === void 0 ? {} : { maxTokens: m.maxTokens }
					}))
				};
			});
			const migrated = {
				text: {
					baseURL: "https://api.deepseek.com",
					apiKeyEnv: "DEEPSEEK_API_KEY",
					models: (providers["vp-deepseek"]?.models ?? DEEPSEEK_MODELS_DEFAULT).filter((m) => typeof m?.id === "string").map((m) => ({
						id: m.id,
						name: m.name ?? m.id,
						...m.contextWindow === void 0 ? {} : { contextWindow: m.contextWindow }
					}))
				},
				visionModels
			};
			ctx.settings.replace(NS, migrated).then(() => {
				const remaining = {};
				for (const [route, value] of Object.entries(providers)) if (!route.startsWith("vp-")) remaining[route] = value;
				ctx.settings.replace("llm-pi-ai", { providers: remaining }).catch(() => {});
				migrateAttempts = 15;
			}).catch(() => {
				setTimeout(migrateLegacy, 2e3);
			});
		} catch {
			setTimeout(migrateLegacy, 2e3);
		}
	};
	migrateLegacy();
	/** 解析设置引用的全部密钥（供界面自动填入；未配置的返回空） */
	const resolveKeys = async (settings) => {
		const refs = /* @__PURE__ */ new Set();
		if (settings.text.apiKeyEnv !== void 0 && settings.text.apiKeyEnv !== "") refs.add(settings.text.apiKeyEnv);
		for (const vm of settings.visionModels) if (vm.apiKeyEnv !== void 0 && vm.apiKeyEnv !== "") refs.add(vm.apiKeyEnv);
		const out = {};
		for (const ref of refs) try {
			const resolved = await ctx.credentials.resolve(ref);
			if (resolved?.value !== void 0) out[ref] = resolved.value;
		} catch {}
		return out;
	};
	if (webServer !== void 0) webServer.register({
		kind: "exact",
		path: "/api/visionPlus.settings",
		handler: async (req, res) => {
			let sent = false;
			const respond = (body) => {
				if (sent) return;
				sent = true;
				res.writeHead(200, { "content-type": "application/json" });
				res.end(JSON.stringify(body));
			};
			try {
				if ((req.method ?? "GET").toUpperCase() === "GET") {
					const settings = readSettings();
					respond({
						type: "server-response",
						rpcId: "",
						result: {
							ok: true,
							value: {
								settings,
								keys: await resolveKeys(settings)
							}
						}
					});
					return;
				}
				let raw = "";
				for await (const chunk of req) raw += chunk;
				const next = JSON.parse(raw).settings;
				if (next === void 0) {
					respond({
						type: "server-response",
						rpcId: "",
						result: {
							ok: false,
							error: {
								code: "bad-request",
								message: "缺少 settings 参数"
							}
						}
					});
					return;
				}
				await ctx.settings.replace(NS, next);
				respond({
					type: "server-response",
					rpcId: "",
					result: {
						ok: true,
						value: {
							settings: readSettings(),
							keys: await resolveKeys(next)
						}
					}
				});
			} catch (error) {
				respond({
					type: "server-response",
					rpcId: "",
					result: {
						ok: false,
						error: {
							code: "internal",
							message: error instanceof Error ? error.message : String(error)
						}
					}
				});
			}
		}
	});
	try {
		const defaultModelService = ctx.get("agentDefaultModel");
		if (defaultModelService !== void 0 && typeof defaultModelService.saveSelection === "function") defaultModelService.saveSelection = async () => {};
	} catch {
		ctx.logger.warn("vision-plus: agentDefaultModel 服务不可用，会话级切换回退为官方行为");
	}
	const inner = new PiAiAdapter({
		profiles: () => resolveProfiles(buildProfiles(readSettings())),
		resolveApiKey: async (_provider, profile) => {
			const ref = profile.apiKeyEnv;
			if (typeof ref !== "string" || ref.length === 0) return void 0;
			try {
				return (await ctx.credentials.resolve(ref))?.value ?? void 0;
			} catch {
				return;
			}
		},
		resolveAttachments: () => ctx.attachments ?? void 0
	});
	const poolOf = () => {
		const settings = readSettings();
		const entries = [];
		settings.visionModels.forEach((vm, index) => {
			const provider = `vp-vision-${index}`;
			for (const m of vm.models) {
				if (typeof m?.id !== "string" || m.id.length === 0) continue;
				entries.push({
					id: `${provider}/${m.id}`,
					label: m.name ?? m.id,
					provider,
					model: m.id
				});
			}
		});
		return entries;
	};
	const pool = new VisionPool(poolOf, cfg.rateLimit);
	const status = new StatusTracker();
	const adapter = new VisionRouterAdapter(cfg, inner, pool, status);
	ctx.llm.registerAdapter([cfg.providerId], adapter);
	ctx.on("agent/request", async (payload, next) => {
		const base = await next();
		const agent = payload.agent;
		const push = (text, summary) => {
			agent.inject(createUserMessage({
				content: [{
					type: "text",
					text
				}],
				source: {
					kind: "plugin",
					plugin: "vision-plus",
					form: "notice",
					summary
				}
			}));
		};
		try {
			const lines = status.drainAll();
			if (lines.length > 0) push(lines.join("\n"), lines[0] ?? "vision-plus");
		} catch {}
		try {
			if (hasPendingImage(agent)) {
				const first = pool.ordered()[0];
				if (first !== void 0) {
					status.set({
						phase: "calling",
						label: first.label,
						tried: []
					});
					push(`vision-plus：🔍 正在调用 ${first.label} 处理图片…`, `vision-plus：🔍 正在调用 ${first.label} 处理图片…`);
				}
			}
		} catch {}
		return base;
	});
	ctx.logger.info(`vision-plus: provider "${cfg.providerId}" 就绪`);
}
/** 内置测试图（64x64 红底白圆），视觉模型可明确识别 */
const TEST_IMAGE_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFUSURBVHhe7ZJLqsQwDATfcXL/87y7zODFgDCVxB85sVA31KYXTqvI3/9xfDIjAVRmQgKozIQEUJkJCaAyE48JGAm9481SAZ6h9z1YImBl6HszuAp4MvT9EdwEvBHa0YuLgDdDe3qYFrBDaFcrUwJ2Cu1rYVjAjqGddwwJ2Dm094puARFCu8+QACrPiBTaT0gAlUTE0B01EkAlETF0R02TgMiheywSQGVN5NA9FgmgsiZy6B6LBFBpiR66yaI/gMqayKF7LBJAZU3k0D0WCaCyJnLoHkuTgELE0B01EkAlETF0R02zgEKk0H5CAqi8IkJo9xkSQOUdO4f2XjEkoLBjaOcdwwIKO4X2tTAloLBDaFcr0wIKb4b29OAioPBGaEcvbgIKT4a+P4KrgB8rQ9+bYYmAH56h9z1YKsAyEnrHm8cE7IoEUJkJCaAyExJAZSaSCzg+X6k2ZiCQeXWMAAAAAElFTkSuQmCC";
/** 从平台错误响应里提取可读信息 */
function extractApiMessage(text) {
	try {
		const parsed = JSON.parse(text);
		return (parsed.error?.message ?? parsed.message ?? "").slice(0, 160);
	} catch {
		return text.slice(0, 160);
	}
}
/**
* 按官方对接文档真实测试一条线路：
* - 视觉线路：POST {baseURL}/chat/completions，Bearer 密钥，content 带 image_url(base64 测试图) + 文本；
* - DeepSeek 文本线路：同样接口，纯文本。
* 返回 { ok, reply | reason }，由 apiproxy 的 visionPlus.test RPC 回传给设置页。
*/
async function runVisionTest(ctx, route) {
	try {
		const settings = (() => {
			try {
				return ctx.settings.get(NS);
			} catch {
				return;
			}
		})() ?? {
			text: {
				baseURL: "https://api.deepseek.com",
				apiKeyEnv: "DEEPSEEK_API_KEY",
				models: DEEPSEEK_MODELS_DEFAULT.map((m) => ({ ...m }))
			},
			visionModels: []
		};
		let raw;
		if (route === "vp-deepseek") raw = {
			baseURL: settings.text.baseURL,
			apiKeyEnv: settings.text.apiKeyEnv,
			models: settings.text.models.map((m) => ({ id: m.id }))
		};
		else {
			const m = /^vp-vision-(\d+)$/.exec(route);
			const vm = m === null ? void 0 : settings.visionModels[Number(m[1])];
			if (vm === void 0) return {
				ok: false,
				reason: `未找到视觉模型 ${route}（请先保存）`
			};
			raw = {
				baseURL: vm.baseURL,
				apiKeyEnv: vm.apiKeyEnv,
				models: vm.models.map((item) => ({ id: item.id }))
			};
		}
		const baseURL = (raw.baseURL ?? "").trim();
		if (!/^https?:\/\//i.test(baseURL)) return {
			ok: false,
			reason: "API 地址不合法（需以 http(s):// 开头）"
		};
		const model = raw.models?.[0]?.id;
		if (typeof model !== "string" || model.length === 0) return {
			ok: false,
			reason: "模型目录里没有有效的模型 ID"
		};
		const keyRef = raw.apiKeyEnv;
		let key;
		try {
			key = (await ctx.credentials.resolve(keyRef))?.value;
		} catch {
			key = void 0;
		}
		if (typeof key !== "string" || key.length === 0) return {
			ok: false,
			reason: `未配置 API 密钥（${keyRef ?? "未知"}）`
		};
		const isVision = route !== "vp-deepseek";
		const imageUrl = /bigmodel\.cn/i.test(baseURL) ? TEST_IMAGE_DATA_URL.replace(/^data:image\/png;base64,/, "") : TEST_IMAGE_DATA_URL;
		const body = {
			model,
			messages: [{
				role: "user",
				content: isVision ? [{
					type: "image_url",
					image_url: { url: imageUrl }
				}, {
					type: "text",
					text: "请只回复两个字：OK"
				}] : "请只回复两个字：OK"
			}],
			max_tokens: 1024,
			stream: false
		};
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 3e4);
		let response;
		try {
			response = await fetch(`${baseURL.replace(/\/+$/, "")}/chat/completions`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					authorization: `Bearer ${key}`
				},
				body: JSON.stringify(body),
				signal: controller.signal
			});
		} catch (error) {
			clearTimeout(timer);
			return {
				ok: false,
				reason: error instanceof Error && error.name === "AbortError" ? "请求超时（30 秒）" : `网络请求失败：${String(error).slice(0, 120)}`
			};
		}
		clearTimeout(timer);
		if (!response.ok) {
			const detail = extractApiMessage(await response.text().catch(() => ""));
			let reason = `HTTP ${response.status}${detail !== "" ? `：${detail}` : ""}`;
			if (response.status === 401 || response.status === 403) reason = `密钥无效或被拒绝（${response.status}）`;
			else if (response.status === 404) reason = `接口或模型不存在（${response.status}）`;
			else if (response.status === 429) reason = "触发限流（429），请稍后再试";
			return {
				ok: false,
				reason
			};
		}
		const cleaned = ((await response.json().catch(() => null))?.choices?.[0]?.message?.content ?? "").replace(/<think>[\s\S]*?<\/think>/g, "").trim();
		if (cleaned.length === 0) return {
			ok: false,
			reason: "接口返回为空"
		};
		return {
			ok: true,
			reply: cleaned.slice(0, 200)
		};
	} catch (error) {
		return {
			ok: false,
			reason: `测试异常：${String(error).slice(0, 120)}`
		};
	}
}
//#endregion
export { apply, inject, name };
