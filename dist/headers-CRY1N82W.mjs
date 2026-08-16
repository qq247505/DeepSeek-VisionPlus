//#region ../../node_modules/.pnpm/@earendil-works+pi-ai@0.82._9916508ebaead6849a95c389aba67c68/node_modules/@earendil-works/pi-ai/dist/utils/headers.js
function headersToRecord(headers) {
	const result = {};
	for (const [key, value] of headers.entries()) result[key] = value;
	return result;
}
function providerHeadersToRecord(headers) {
	if (!headers) return void 0;
	const result = {};
	for (const [key, value] of Object.entries(headers)) if (value !== null) result[key] = value;
	return Object.keys(result).length > 0 ? result : void 0;
}
//#endregion
export { providerHeadersToRecord as n, headersToRecord as t };
