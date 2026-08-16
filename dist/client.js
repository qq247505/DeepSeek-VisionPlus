window.__ModuleLoader__.load({
	id: "dsh-visionplus",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/image-button.tsx
		/** 内联 SVG 图片图标（Codex 客户端同款"相片"图标风格）。 */
		const ICON = "data:image/svg+xml;utf8," + encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><circle cx=\"8.5\" cy=\"10\" r=\"1.5\"/><path d=\"M21 15.5l-5-5-9 9\"/></svg>");
		/** 本插件的两个视觉变体模型 ID（只有选中它们时才显示图片按钮） */
		const VISION_MODEL_IDS = ["deepseek-v4-pro-visionplus", "deepseek-v4-flash-visionplus"];
		/**
		* 输入框图片图标（占官方预留的 conversation.input.left 座）。
		* 点击弹出系统文件选择器，选中后经 inputActions.addImages 进入草稿，
		* 缩略图由 harness 自带 AttachmentRail 展示；粘贴/拖拽原生支持不变。
		*/
		function ImageButton({ inputActions, sessionId, modelDirectories }) {
			const fileRef = (0, react.useRef)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const directory = sessionId !== void 0 && modelDirectories !== void 0 ? modelDirectories.directoryFor(sessionId) : void 0;
			const currentModel = (0, react.useSyncExternalStore)((listener) => directory?.store.subscribe(listener) ?? (() => {}), () => directory?.store.getSnapshot().current ?? null);
			if (!(currentModel !== null && VISION_MODEL_IDS.includes(currentModel.model))) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react_jsx_runtime.Fragment, {});
			const pick = () => {
				fileRef.current?.click();
			};
			const onChange = (event) => {
				const files = Array.from(event.target.files ?? []);
				event.target.value = "";
				if (files.length === 0 || inputActions === void 0) return;
				setBusy(true);
				try {
					inputActions.addImages(files);
				} finally {
					setBusy(false);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "image/png,image/jpeg,image/webp,image/gif",
				multiple: true,
				hidden: true,
				onChange
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: pick,
				disabled: busy || inputActions === void 0,
				"aria-label": "添加图片",
				title: "添加图片（也可直接粘贴或拖拽）",
				style: {
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					width: "28px",
					height: "28px",
					padding: 0,
					border: "none",
					borderRadius: "6px",
					background: "transparent",
					color: "var(--icon, currentColor)",
					opacity: inputActions === void 0 ? .4 : .75,
					cursor: inputActions === void 0 ? "default" : "pointer"
				},
				onMouseEnter: (e) => {
					e.currentTarget.style.opacity = "1";
				},
				onMouseLeave: (e) => {
					e.currentTarget.style.opacity = inputActions === void 0 ? "0.4" : "0.75";
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
					src: ICON,
					alt: "",
					width: 17,
					height: 17,
					style: { display: "block" }
				})
			})] });
		}
		//#endregion
		//#region src/client/settings-page.tsx
		const TEMPLATES = [
			{
				label: "智谱（GLM）",
				platformId: "glm",
				draft: {
					displayName: "智谱（GLM）",
					baseURL: "https://open.bigmodel.cn/api/paas/v4",
					apiKeyEnv: "GLM_API_KEY",
					models: [{
						id: "glm-4.1v-thinking-flash",
						name: "GLM-4.1V-Thinking-Flash",
						contextWindow: 65536,
						maxTokens: 16384
					}, {
						id: "glm-4.6v-flash",
						name: "GLM-4.6V-Flash",
						contextWindow: 131072,
						maxTokens: 32768
					}]
				}
			},
			{
				label: "Qwen（千问）",
				platformId: "siliconflow",
				draft: {
					displayName: "Qwen（千问）",
					baseURL: "https://api.siliconflow.cn/v1",
					apiKeyEnv: "SILICONFLOW_API_KEY",
					models: [{
						id: "Qwen/Qwen3-VL-8B-Instruct",
						name: "Qwen3-VL-8B-Instruct",
						contextWindow: 65536,
						maxTokens: 16384
					}]
				}
			},
			{
				label: "自定义平台",
				draft: {
					displayName: "自定义平台",
					baseURL: "",
					apiKeyEnv: "",
					models: [{
						id: "",
						name: "",
						contextWindow: void 0,
						maxTokens: void 0
					}]
				}
			}
		];
		/** 各预置平台路由 → 默认模型（用于"恢复默认模型"） */
		const PLATFORM_DEFAULTS = Object.fromEntries(TEMPLATES.filter((t) => t.platformId !== void 0).map((t) => [`vp-${t.platformId}`, t.draft.models.map((m) => ({ ...m }))]));
		const DEEPSEEK_DEFAULT = {
			displayName: "DeepSeek",
			baseURL: "https://api.deepseek.com",
			apiKeyEnv: "DEEPSEEK_API_KEY",
			models: [{
				id: "deepseek-v4-flash",
				name: "DeepSeek-V4-Flash",
				contextWindow: 1048576
			}, {
				id: "deepseek-v4-pro",
				name: "DeepSeek-V4-Pro",
				contextWindow: 1048576
			}]
		};
		const L = {
			edit: "编辑",
			cancel: "取消",
			apply: "保存",
			applying: "保存中…",
			keyInput: "API 密钥",
			keyStored: "已配置——输入新值可替换",
			keyPlaceholder: "输入 API 密钥",
			customized: "自定义设置",
			baseUrl: "API 地址",
			models: "模型目录",
			modelsCustomized: "已自定义模型目录",
			modelsInherited: "正在使用适配器默认模型",
			resetModels: "恢复默认模型",
			modelId: "模型 ID",
			modelName: "显示名称",
			contextWindow: "上下文窗口",
			addModel: "添加模型",
			removeModel: "删除模型",
			capacity: "容量",
			visionModels: "视觉模型",
			delete: "删除",
			displayName: "显示名称",
			keyRef: "密钥引用（环境变量名）",
			modelsEmpty: "模型目录为空",
			modelContextWindow: "上下文窗口",
			modelMaxTokens: "最大 Token"
		};
		const S = {
			card: {
				borderRadius: "12px",
				background: "var(--dsw-alias-bg-module-platform)",
				padding: "14px 16px",
				display: "flex",
				flexDirection: "column",
				gap: "14px"
			},
			title: {
				fontSize: "14px",
				lineHeight: "22px",
				fontWeight: 500,
				color: "var(--dsw-alias-label-primary)"
			},
			route: {
				fontSize: "12px",
				lineHeight: "18px",
				color: "var(--dsw-alias-label-tertiary)"
			},
			hint: {
				margin: 0,
				fontSize: "12px",
				lineHeight: "18px",
				color: "var(--dsw-alias-label-tertiary)"
			},
			field: {
				display: "flex",
				flexDirection: "column",
				gap: "6px"
			},
			fieldLabel: {
				display: "inline-flex",
				alignItems: "center",
				gap: "10px",
				fontSize: "12px",
				lineHeight: "18px",
				fontWeight: 500,
				color: "var(--dsw-alias-label-secondary)"
			},
			input: {
				boxSizing: "border-box",
				width: "100%",
				height: "32px",
				padding: "0 10px",
				border: "1px solid var(--dsw-alias-border-l2)",
				borderRadius: "8px",
				font: "inherit",
				fontSize: "14px",
				lineHeight: "22px",
				background: "var(--dsw-alias-bg-layer-1)",
				color: "var(--dsw-alias-label-primary)"
			},
			linkButton: {
				boxSizing: "border-box",
				display: "inline-flex",
				alignItems: "center",
				height: "28px",
				padding: "0 10px",
				border: "none",
				borderRadius: "14px",
				background: "transparent",
				color: "var(--dsw-alias-label-tertiary)",
				fontSize: "12px",
				lineHeight: "18px",
				cursor: "pointer"
			},
			primaryButton: {
				boxSizing: "border-box",
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				gap: "4px",
				height: "36px",
				padding: "0 14px",
				border: "none",
				borderRadius: "18px",
				background: "var(--dsw-alias-button-primary-fill)",
				color: "var(--dsw-alias-label-primary-foreground)",
				fontSize: "14px",
				lineHeight: "22px",
				cursor: "pointer"
			},
			rowEditButton: {
				boxSizing: "border-box",
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				gap: "4px",
				height: "28px",
				padding: "0 10px",
				border: "1px solid var(--dsw-alias-border-l2)",
				borderRadius: "14px",
				background: "transparent",
				color: "var(--dsw-alias-label-primary)",
				fontSize: "12px",
				lineHeight: "18px",
				cursor: "pointer"
			},
			secondaryButton: {
				boxSizing: "border-box",
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				gap: "4px",
				height: "36px",
				padding: "0 14px",
				border: "1px solid var(--dsw-alias-border-l2)",
				borderRadius: "18px",
				background: "transparent",
				color: "var(--dsw-alias-label-primary)",
				fontSize: "14px",
				lineHeight: "22px",
				cursor: "pointer"
			},
			iconButton: {
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				width: "28px",
				height: "28px",
				padding: 0,
				border: "none",
				borderRadius: "6px",
				background: "transparent",
				color: "var(--dsw-alias-label-tertiary)",
				cursor: "pointer"
			},
			modelIdText: {
				fontSize: "14px",
				lineHeight: "22px",
				fontWeight: 500,
				color: "var(--dsw-alias-label-primary)"
			},
			rowCard: {
				border: "1px solid var(--dsw-alias-border-l2)",
				borderRadius: "12px",
				padding: "12px 14px",
				display: "flex",
				flexDirection: "column",
				gap: "12px"
			},
			rowHead: {
				display: "flex",
				alignItems: "center",
				gap: "10px"
			},
			rowIdentity: {
				display: "inline-flex",
				alignItems: "center",
				gap: "6px",
				minWidth: 0
			},
			rowName: {
				fontSize: "14px",
				lineHeight: "22px",
				fontWeight: 500,
				color: "var(--dsw-alias-label-primary)"
			},
			rowTag: {
				flex: "none",
				padding: "1px 6px",
				border: "1px solid var(--dsw-alias-border-l3)",
				borderRadius: "4px",
				fontSize: "11px",
				lineHeight: "16px",
				color: "var(--dsw-alias-label-secondary)"
			},
			dot: {
				boxSizing: "border-box",
				display: "inline-block",
				flex: "none",
				width: "8px",
				height: "8px",
				borderRadius: "50%"
			},
			modelNameText: {
				fontSize: "12px",
				lineHeight: "18px",
				color: "var(--dsw-alias-label-tertiary)"
			},
			modelCatalog: {
				display: "flex",
				flexDirection: "column",
				gap: "10px",
				paddingTop: "12px",
				borderTop: "1px solid var(--dsw-alias-border-l2)"
			},
			modelListHead: {
				display: "flex",
				alignItems: "flex-start",
				justifyContent: "space-between",
				gap: "12px"
			},
			modelCatalogHeading: {
				display: "flex",
				flexDirection: "column",
				gap: "2px"
			},
			modelCatalogTitle: {
				fontSize: "12px",
				lineHeight: "18px",
				fontWeight: 500,
				color: "var(--dsw-alias-label-secondary)"
			},
			modelCatalogMeta: {
				margin: 0,
				color: "var(--dsw-alias-label-tertiary)",
				fontSize: "12px",
				lineHeight: "18px"
			},
			modelEntry: {
				border: "1px solid var(--dsw-alias-border-l2)",
				borderRadius: "8px",
				padding: "6px"
			},
			modelRow: {
				display: "grid",
				gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr) auto auto",
				alignItems: "center",
				gap: "6px"
			},
			modelAdvanced: {
				display: "grid",
				gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
				gap: "8px",
				padding: "8px 4px 2px"
			},
			modelField: {
				display: "flex",
				flexDirection: "column",
				gap: "4px"
			},
			modelFieldLabel: {
				color: "var(--dsw-alias-label-tertiary)",
				fontSize: "12px",
				lineHeight: "18px"
			},
			addModelButton: {
				boxSizing: "border-box",
				alignSelf: "flex-start",
				display: "inline-flex",
				alignItems: "center",
				gap: "4px",
				height: "28px",
				padding: "0 10px",
				border: "1px solid var(--dsw-alias-border-l2)",
				borderRadius: "14px",
				background: "transparent",
				color: "var(--dsw-alias-label-primary)",
				fontSize: "12px",
				lineHeight: "18px",
				cursor: "pointer"
			},
			modelEmpty: {
				margin: 0,
				color: "var(--dsw-alias-label-tertiary)",
				fontSize: "12px",
				lineHeight: "18px"
			},
			sectionFrame: {
				border: "1px solid var(--dsw-alias-border-l2)",
				borderRadius: "12px",
				padding: "12px"
			},
			disclosureButton: {
				display: "inline-flex",
				alignItems: "center",
				gap: "6px",
				width: "fit-content",
				padding: "2px 4px",
				marginLeft: "-4px",
				borderRadius: "6px",
				cursor: "pointer",
				fontSize: "12px",
				lineHeight: "18px",
				fontWeight: 500,
				color: "var(--dsw-alias-label-secondary)",
				background: "transparent",
				border: "none"
			}
		};
		/** 模型目录（官方样式：纯标题 + 提示 + 上下排列的模型行 + 图标 + 添加模型）。 */
		/** 展开箭头（官方 IconChevronDownOutline14 / IconChevronRightOutline14 原样，两个独立图标） */
		function Chevron(props) {
			const { open } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 14 14",
				fill: "none",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: open ? "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z" : "M5.5 2.15137L5.92383 2.57617L8.65137 5.30273C8.90706 5.55843 9.13382 5.78438 9.29785 5.98828C9.46883 6.20088 9.61756 6.44405 9.66602 6.75C9.69222 6.91565 9.69222 7.08435 9.66602 7.25C9.61756 7.55595 9.46883 7.79912 9.29785 8.01172C9.13382 8.21561 8.90706 8.44157 8.65137 8.69727L5.92383 11.4238L5.5 11.8486L4.65137 11L5.07617 10.5762L7.80273 7.84863C8.07732 7.57405 8.24849 7.40124 8.3623 7.25977C8.46904 7.12709 8.47813 7.07728 8.48047 7.0625C8.48703 7.02105 8.48703 6.97895 8.48047 6.9375C8.47813 6.92272 8.46904 6.87291 8.3623 6.74023C8.24848 6.59876 8.07732 6.42595 7.80273 6.15137L5.07617 3.42383L4.65137 3L5.5 2.15137Z",
					fill: "currentColor"
				})
			});
		}
		/** 删除图标（官方 IconTrashOutline16 原样） */
		function TrashIcon() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M14.4782 4.84067L14.2138 10.1152C14.1102 12.1872 14.067 13.0115 13.3866 13.9607C13.1044 14.3546 12.7498 14.6912 12.3424 14.9535C11.8239 15.2872 11.2415 15.4316 10.5585 15.4998C9.88727 15.5668 9.04946 15.5656 7.99998 15.5656C6.95051 15.5656 6.1127 15.5668 5.44142 15.4998C4.75851 15.4316 4.17602 15.2872 3.65753 14.9535C3.25012 14.6912 2.89559 14.3546 2.61332 13.9607C1.93296 13.0115 1.88979 12.1872 1.78619 10.1152L1.52179 4.84067L2.89006 4.77277L3.15343 10.0463C3.26221 12.2218 3.32452 12.6015 3.72646 13.1624C3.90825 13.4161 4.13686 13.6334 4.39927 13.8023C4.66204 13.9714 5.00263 14.0792 5.57825 14.1367C6.16562 14.1953 6.92298 14.1963 7.99998 14.1963C9.07699 14.1963 9.83434 14.1953 10.4217 14.1367C10.9973 14.0792 11.3379 13.9714 11.6007 13.8023C11.8631 13.6334 12.0917 13.4161 12.2735 13.1624C12.6755 12.6015 12.7378 12.2218 12.8465 10.0463L13.1099 4.77277L14.4782 4.84067ZM5.43011 6.22849H6.7994V11.3909H5.43011V6.22849ZM9.20056 6.22849H10.5699V11.3909H9.20056V6.22849ZM8.53597 0.434431C9.17976 0.434431 9.6522 0.426926 10.0966 0.571258C10.2357 0.616451 10.3717 0.672554 10.502 0.738948C10.9182 0.951107 11.2464 1.29099 11.7015 1.74612L12.4978 2.54136H15.3742V3.91169H0.625732V2.54136H3.50218L4.29845 1.74612C4.75358 1.29099 5.08174 0.951107 5.49801 0.738948C5.62831 0.672554 5.76425 0.616451 5.90334 0.571258C6.34776 0.426926 6.82021 0.434431 7.46399 0.434431H8.53597ZM7.46399 1.80476C6.73208 1.80476 6.51641 1.81187 6.32617 1.87369C6.25545 1.89667 6.18668 1.92533 6.12041 1.95907C5.96398 2.03878 5.82348 2.16253 5.44142 2.54136H10.5585C10.1765 2.16253 10.036 2.03878 9.87955 1.95907C9.81329 1.92533 9.74452 1.89667 9.6738 1.87369C9.48356 1.81187 9.26789 1.80476 8.53597 1.80476H7.46399Z",
					fill: "currentColor"
				})
			});
		}
		/** 加号（官方 IconPlusOutline16 原样） */
		function PlusIcon() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M8.64453 1.5V7.34961H14.5V8.65039H8.64453V14.5H7.34473V8.65039H1.5V7.34961H7.34473V1.5H8.64453Z",
					fill: "currentColor"
				})
			});
		}
		/** 容量格式化（二进制 K/M），模块级供校验使用 */
		function formatCapacityText(value) {
			if (value === void 0) return "";
			if (Number.isInteger(value) && value > 0) {
				if (value % 1048576 === 0) return `${String(value / 1048576)}M`;
				if (value % 1024 === 0) return `${String(value / 1024)}K`;
			}
			return String(value);
		}
		function ModelDirectory(props) {
			const { models, defaults, onUpdate, onAdd, onRemove, onReset } = props;
			const [expanded, setExpanded] = (0, react.useState)(/* @__PURE__ */ new Set());
			const [capacityText, setCapacityText] = (0, react.useState)(/* @__PURE__ */ new Map());
			const customized = JSON.stringify(models) !== JSON.stringify(defaults);
			const bufferKey = (index, field) => `${String(index)}:${field}`;
			const toggleExpanded = (index) => {
				setExpanded((current) => {
					const next = new Set(current);
					if (!next.delete(index)) next.add(index);
					return next;
				});
			};
			const formatCapacity = (value) => {
				if (value === void 0) return "";
				if (Number.isInteger(value) && value > 0) {
					if (value % 1048576 === 0) return `${String(value / 1048576)}M`;
					if (value % 1024 === 0) return `${String(value / 1024)}K`;
				}
				return String(value);
			};
			const parseCapacity = (text) => {
				const match = /^(\d+(?:\.\d+)?)\s*([kKmM]?)$/.exec(text.trim());
				if (match === null) return void 0;
				const value = Number(match[1]);
				const suffix = match[2].toLowerCase();
				return suffix === "k" ? Math.round(value * 1024) : suffix === "m" ? Math.round(value * 1048576) : Math.round(value);
			};
			const editCapacity = (index, field, text) => {
				setCapacityText((current) => new Map(current).set(bufferKey(index, field), text));
				onUpdate(index, { [field]: parseCapacity(text) });
			};
			const capacityValue = (model, index, field) => capacityText.get(bufferKey(index, field)) ?? formatCapacity(model[field]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				style: S.modelCatalog,
				"aria-label": L.models,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: S.modelListHead,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: S.modelCatalogHeading,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: S.modelCatalogTitle,
								children: L.models
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: S.modelCatalogMeta,
								children: customized ? L.modelsCustomized : L.modelsInherited
							})]
						}), customized ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							style: S.linkButton,
							onClick: onReset,
							children: L.resetModels
						}) : null]
					}),
					models.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						style: S.modelEmpty,
						children: L.modelsEmpty
					}) : null,
					models.map((model, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: S.modelEntry,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: S.modelRow,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									style: S.input,
									type: "text",
									value: model.id,
									placeholder: L.modelId,
									"aria-label": `${L.modelId} ${index + 1}`,
									onChange: (event) => onUpdate(index, { id: event.target.value })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									style: S.input,
									type: "text",
									value: model.name,
									placeholder: L.modelName,
									"aria-label": `${L.modelName} ${index + 1}`,
									onChange: (event) => onUpdate(index, { name: event.target.value })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									style: S.iconButton,
									"aria-label": `${L.capacity} ${index + 1}`,
									"aria-expanded": expanded.has(index),
									title: L.capacity,
									onClick: () => toggleExpanded(index),
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Chevron, { open: expanded.has(index) })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									style: S.iconButton,
									"aria-label": `${L.removeModel} ${index + 1}`,
									title: L.removeModel,
									onClick: () => onRemove(index),
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TrashIcon, {})
								})
							]
						}), expanded.has(index) ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: S.modelAdvanced,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								style: S.modelField,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: S.modelFieldLabel,
									children: L.modelContextWindow
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									style: S.input,
									type: "text",
									inputMode: "numeric",
									value: capacityValue(model, index, "contextWindow"),
									placeholder: "1M",
									"aria-label": `${L.modelContextWindow} ${index + 1}`,
									onChange: (event) => editCapacity(index, "contextWindow", event.target.value)
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								style: S.modelField,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: S.modelFieldLabel,
									children: L.modelMaxTokens
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									style: S.input,
									type: "text",
									inputMode: "numeric",
									value: capacityValue(model, index, "maxTokens"),
									placeholder: "256K",
									"aria-label": `${L.modelMaxTokens} ${index + 1}`,
									onChange: (event) => editCapacity(index, "maxTokens", event.target.value)
								})]
							})]
						}) : null]
					}, `${model.id}-${index}`)),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						style: S.addModelButton,
						onClick: onAdd,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlusIcon, {}), L.addModel]
					})
				]
			});
		}
		/** 提供方编辑块（仿官方编辑器）：API 密钥 + 自定义设置（API 地址/显示名称/密钥引用 + 模型目录）。 */
		function ProviderBlock(props) {
			const { name, routeText, hideTitle, keyRef, keyValue, onKeyChange, configured, custom, onCustomChange, models, defaults, onModelUpdate, onModelAdd, onModelRemove, onModelReset, onTest, testing } = props;
			const [customized, setCustomized] = (0, react.useState)(false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "14px"
				},
				children: [
					hideTitle === true ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "baseline",
							gap: "8px"
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: S.title,
							children: name
						}), routeText !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: S.route,
							children: routeText
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: S.field,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							style: S.fieldLabel,
							children: L.keyInput
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							style: S.input,
							type: "password",
							placeholder: configured ? L.keyStored : L.keyPlaceholder,
							value: keyValue,
							onChange: (event) => onKeyChange(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px"
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							style: S.disclosureButton,
							onClick: () => setCustomized((v) => !v),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Chevron, { open: customized }),
								" ",
								L.customized
							]
						}), onTest !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: { marginLeft: "auto" },
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								style: S.rowEditButton,
								disabled: testing === true,
								onClick: onTest,
								children: testing === true ? "测试中…" : "测试"
							})
						})]
					}),
					customized && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "14px"
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: S.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								style: S.fieldLabel,
								children: L.baseUrl
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								style: S.input,
								value: custom.baseURL,
								onChange: (event) => onCustomChange({ baseURL: event.target.value }),
								placeholder: DEEPSEEK_DEFAULT.baseURL
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ModelDirectory, {
							models,
							defaults,
							onUpdate: onModelUpdate,
							onAdd: onModelAdd,
							onRemove: onModelRemove,
							onReset: onModelReset
						})]
					})
				]
			});
		}
		/** 防御式拆信封：兼容 {result:{...}} 与直接返回两种形状 */
		function unwrap(response) {
			const anyResponse = response;
			if (anyResponse !== null && typeof anyResponse === "object" && "result" in anyResponse) return anyResponse.result;
			return response;
		}
		function VisionSettingsPage(props) {
			const api = props.api;
			const [editing, setEditing] = (0, react.useState)(false);
			const [deepseek, setDeepseek] = (0, react.useState)(DEEPSEEK_DEFAULT);
			const [models, setModels] = (0, react.useState)([]);
			const [loaded, setLoaded] = (0, react.useState)(false);
			const [textKey, setTextKey] = (0, react.useState)("");
			const [modelKeys, setModelKeys] = (0, react.useState)({});
			const [configured, setConfigured] = (0, react.useState)({});
			const [openId, setOpenId] = (0, react.useState)(null);
			const [deletedRoutes, setDeletedRoutes] = (0, react.useState)(/* @__PURE__ */ new Set());
			const [busy, setBusy] = (0, react.useState)(false);
			const [message, setMessage] = (0, react.useState)("");
			const [testing, setTesting] = (0, react.useState)(null);
			const [testingDeepseek, setTestingDeepseek] = (0, react.useState)(false);
			const [toast, setToast] = (0, react.useState)(null);
			const toastTimer = (0, react.useRef)(null);
			const loadFromSettings = async () => {
				try {
					const envelope = await (await fetch("/api/visionPlus.settings")).json();
					const settings = envelope.result?.ok === false ? void 0 : envelope.result?.value?.settings;
					const wireKeys = envelope.result?.value?.keys ?? {};
					if (settings === void 0) {
						setMessage("载入失败：" + (envelope.result?.error?.message ?? "设置接口不可用"));
						setLoaded(true);
						return;
					}
					setDeepseek({
						displayName: "DeepSeek",
						baseURL: settings.text.baseURL || "https://api.deepseek.com",
						apiKeyEnv: settings.text.apiKeyEnv || "DEEPSEEK_API_KEY",
						models: (settings.text.models ?? []).map((m) => ({
							id: m.id,
							name: m.name ?? m.id,
							contextWindow: m.contextWindow,
							maxTokens: m.maxTokens
						}))
					});
					setDeletedRoutes(/* @__PURE__ */ new Set());
					const drafts = (settings.visionModels ?? []).map((vm) => ({
						id: vm.id,
						displayName: vm.displayName,
						baseURL: vm.baseURL,
						apiKeyEnv: vm.apiKeyEnv,
						models: (vm.models ?? []).map((m) => ({
							id: m.id,
							name: m.name ?? m.id,
							contextWindow: m.contextWindow,
							maxTokens: m.maxTokens
						}))
					}));
					setModels(drafts);
					setTextKey(wireKeys["DEEPSEEK_API_KEY"] ?? "");
					const initialModelKeys = {};
					for (const item of drafts) {
						const key = wireKeys[item.apiKeyEnv];
						if (key !== void 0) initialModelKeys[item.id] = key;
					}
					setModelKeys(initialModelKeys);
					const refs = ["DEEPSEEK_API_KEY", ...drafts.map((item) => item.apiKeyEnv)].filter(Boolean);
					if (refs.length > 0) {
						const creds = await api.credentials.describe({ refs });
						setConfigured(Object.fromEntries(Object.entries(creds.result.value?.credentials ?? {}).map(([ref, info]) => [ref, info.configured])));
					}
					setLoaded(true);
				} catch (error) {
					setMessage("载入失败：" + String(error));
					setLoaded(true);
				}
			};
			(0, react.useEffect)(() => {
				loadFromSettings();
			}, [api]);
			const updateModel = (index, patch) => setModels((prev) => prev.map((item, i) => i === index ? {
				...item,
				...patch
			} : item));
			const showToast = (kind, text) => {
				if (toastTimer.current !== null) clearTimeout(toastTimer.current);
				setToast({
					kind,
					text
				});
				toastTimer.current = setTimeout(() => {
					setToast(null);
				}, 3e3);
			};
			/**
			* 测试调用器（双通道）：
			* 1) 宿主打了第 8 个增强补丁 → POST /api/visionPlus.test，节点端按官方对接方式
			*    真实发起视觉/文本请求（发测试图，拿到模型真实响应）；
			* 2) 纯官方版（无补丁）→ 回退官方 llm.discoverModels 列表探测（验证接口连通 + 密钥有效）。
			*/
			const callVisionTest = async (route) => {
				try {
					const response = await fetch("/api/visionPlus.test", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							type: "client-request",
							rpcId: `vp-test-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
							method: "visionPlus.test",
							payload: { route }
						})
					});
					const result = (await response.json()).result;
					if (result === void 0) throw new Error(`测试通道不可用（HTTP ${response.status}）`);
					if (result.ok !== true) throw new Error(result.error?.message ?? "测试通道返回错误");
					return result.value ?? {
						ok: false,
						reason: "空结果"
					};
				} catch (error) {
					throw error;
				}
			};
			/** 测试 DeepSeek 主模型：参数校验 → 官方对接方式真实请求 */
			const testDeepseek = async () => {
				setTestingDeepseek(true);
				try {
					if (configured["DEEPSEEK_API_KEY"] !== true) {
						showToast("err", "❌ 测试失败：API 密钥未配置（DEEPSEEK_API_KEY）");
						return;
					}
					if (!/^https?:\/\//i.test(deepseek.baseURL.trim())) {
						showToast("err", "❌ 测试失败：API 地址不合法（需以 http(s):// 开头）");
						return;
					}
					if (deepseek.models.map((m) => m.id.trim()).filter((id) => id !== "").length === 0) {
						showToast("err", "❌ 测试失败：模型目录里没有有效的模型 ID");
						return;
					}
					for (const m of deepseek.models) {
						const off = DEEPSEEK_DEFAULT.models.find((o) => o.id === m.id);
						if (off !== void 0 && m.contextWindow !== void 0 && off.contextWindow !== void 0 && m.contextWindow > off.contextWindow) {
							showToast("err", `❌ 测试失败：${m.id} 上下文窗口 ${formatCapacityText(m.contextWindow)} 超过官方上限 ${formatCapacityText(off.contextWindow)}`);
							return;
						}
					}
					const result = await callVisionTest("vp-deepseek");
					if (!result.ok) {
						showToast("err", `❌ 测试失败：${result.reason ?? "未知原因"}`);
						return;
					}
					showToast("ok", result.degraded === true ? `✅ DeepSeek 测试成功：${result.reply ?? "OK"}` : "✅ DeepSeek 测试成功：OK");
				} catch (error) {
					const reason = String(error).replace(/\s+/g, " ").trim();
					showToast("err", `❌ 测试失败：${reason.length > 140 ? `${reason.slice(0, 140)}…` : reason}`);
				} finally {
					setTestingDeepseek(false);
				}
			};
			/** 测试平台：先校验参数（密钥/地址/模型 ID/官方上限），通过后走官方 llm.discoverModels 真实探测接口 */
			const testPlatform = async (index) => {
				const item = models[index];
				if (item === void 0) return;
				setTesting(item.id);
				try {
					if (configured[item.apiKeyEnv] !== true) {
						showToast("err", `❌ 测试失败：API 密钥未配置（${item.apiKeyEnv}）`);
						return;
					}
					if (!/^https?:\/\//i.test(item.baseURL.trim())) {
						showToast("err", "❌ 测试失败：API 地址不合法（需以 http(s):// 开头）");
						return;
					}
					if (item.models.map((m) => m.id.trim()).filter((id) => id !== "").length === 0) {
						showToast("err", "❌ 测试失败：模型目录里没有有效的模型 ID");
						return;
					}
					const official = PLATFORM_DEFAULTS[item.id];
					if (official !== void 0) for (const m of item.models) {
						const off = official.find((o) => o.id === m.id);
						if (off === void 0) continue;
						if (m.contextWindow !== void 0 && off.contextWindow !== void 0 && m.contextWindow > off.contextWindow) {
							showToast("err", `❌ 测试失败：${m.id} 上下文窗口 ${formatCapacityText(m.contextWindow)} 超过官方上限 ${formatCapacityText(off.contextWindow)}`);
							return;
						}
						if (m.maxTokens !== void 0 && off.maxTokens !== void 0 && m.maxTokens > off.maxTokens) {
							showToast("err", `❌ 测试失败：${m.id} 最大输出 ${formatCapacityText(m.maxTokens)} 超过官方上限 ${formatCapacityText(off.maxTokens)}`);
							return;
						}
					}
					const result = await callVisionTest(`vp-vision-${index}`);
					if (!result.ok) {
						showToast("err", `❌ 测试失败：${result.reason ?? "未知原因"}`);
						return;
					}
					showToast("ok", `✅ ${item.displayName || "该平台"} 测试成功：OK`);
				} catch (error) {
					const reason = String(error).replace(/\s+/g, " ").trim();
					showToast("err", `❌ 测试失败：${reason.length > 140 ? `${reason.slice(0, 140)}…` : reason}`);
				} finally {
					setTesting(null);
				}
			};
			/** 删除平台：立即持久化（不等"保存"），删完即生效 */
			const deletePlatform = async (index) => {
				const target = models[index];
				if (target === void 0) return;
				setBusy(true);
				setMessage("");
				try {
					const settings = {
						text: {
							baseURL: deepseek.baseURL,
							apiKeyEnv: deepseek.apiKeyEnv || "DEEPSEEK_API_KEY",
							models: deepseek.models.map((m) => ({
								id: m.id,
								name: m.name,
								contextWindow: m.contextWindow,
								maxTokens: m.maxTokens
							}))
						},
						visionModels: models.filter((item) => item.id !== target.id).map((item) => ({
							id: item.id,
							displayName: item.displayName,
							baseURL: item.baseURL,
							apiKeyEnv: item.apiKeyEnv,
							models: item.models.map((m) => ({
								id: m.id,
								name: m.name,
								contextWindow: m.contextWindow,
								maxTokens: m.maxTokens
							}))
						}))
					};
					const envelope = await (await fetch("/api/visionPlus.settings", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ settings })
					})).json();
					if (envelope.result?.ok === false) throw new Error(envelope.result.error?.message ?? "删除失败");
					setModels((prev) => prev.filter((_, i) => i !== index));
					setDeletedRoutes((current) => new Set(current).add(target.id));
					if (openId === target.id) setOpenId(null);
					setMessage("✅ 已删除并保存");
				} catch (error) {
					const reason = String(error).replace(/\s+/g, " ").trim();
					setMessage(`❌ 删除失败：${reason.length > 160 ? `${reason.slice(0, 160)}…` : reason}`);
				} finally {
					setBusy(false);
				}
			};
			const addTemplate = (template) => {
				const draft = template.draft;
				if (template.platformId !== void 0) {
					const id = template.platformId;
					if (models.some((m) => m.id === id)) return;
					setModels((prev) => [...prev, {
						...draft,
						id,
						models: draft.models.map((m) => ({ ...m }))
					}]);
					setOpenId(id);
					return;
				}
				const suffix = Date.now().toString(36);
				const apiKeyEnv = draft.apiKeyEnv.trim() !== "" ? draft.apiKeyEnv : `VP_${suffix.toUpperCase()}_API_KEY`;
				const fresh = {
					...draft,
					id: `vp-${suffix}`,
					apiKeyEnv
				};
				setModels((prev) => [...prev, fresh]);
				setOpenId(fresh.id);
			};
			const save = async () => {
				setBusy(true);
				setMessage("");
				try {
					const textKeyValue = textKey.trim();
					if (textKeyValue.length > 0) {
						const r = unwrap(await api.credentials.set({
							ref: deepseek.apiKeyEnv || "DEEPSEEK_API_KEY",
							value: textKeyValue
						}));
						if (r.ok === false) throw new Error(r.error?.message ?? "写入 DeepSeek 密钥失败");
					}
					for (const item of models) {
						const key = (modelKeys[item.id] ?? "").trim();
						if (key.length > 0 && item.apiKeyEnv) {
							const r = unwrap(await api.credentials.set({
								ref: item.apiKeyEnv,
								value: key
							}));
							if (r.ok === false) throw new Error(r.error?.message ?? `写入 ${item.displayName} 密钥失败`);
						}
					}
					const settings = {
						text: {
							baseURL: deepseek.baseURL,
							apiKeyEnv: deepseek.apiKeyEnv || "DEEPSEEK_API_KEY",
							models: deepseek.models.map((m) => ({
								id: m.id,
								name: m.name,
								contextWindow: m.contextWindow,
								maxTokens: m.maxTokens
							}))
						},
						visionModels: models.map((item) => {
							const modelName = (item.models[0]?.name ?? "").trim();
							const synced = item.displayName === "自定义平台" && modelName !== "" ? {
								...item,
								displayName: modelName
							} : item;
							return {
								id: synced.id,
								displayName: synced.displayName,
								baseURL: synced.baseURL,
								apiKeyEnv: synced.apiKeyEnv,
								models: synced.models.map((m) => ({
									id: m.id,
									name: m.name,
									contextWindow: m.contextWindow,
									maxTokens: m.maxTokens
								}))
							};
						})
					};
					const envelope = await (await fetch("/api/visionPlus.settings", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ settings })
					})).json();
					if (envelope.result?.ok === false) throw new Error(envelope.result.error?.message ?? "保存设置失败");
					const savedKeys = envelope.result?.value?.keys ?? {};
					setTextKey(savedKeys["DEEPSEEK_API_KEY"] ?? "");
					const savedModelKeys = {};
					for (const item of models) {
						const key = savedKeys[item.apiKeyEnv];
						if (key !== void 0) savedModelKeys[item.id] = key;
					}
					setModelKeys(savedModelKeys);
					setModels((prev) => prev.map((m) => {
						const modelName = (m.models[0]?.name ?? "").trim();
						return m.displayName === "自定义平台" && modelName !== "" ? {
							...m,
							displayName: modelName
						} : m;
					}));
					setMessage("✅ 保存成功，实时载入（下一次请求生效）");
					setTextKey("");
					setModelKeys({});
				} catch (error) {
					const reason = String(error).replace(/\s+/g, " ").trim();
					setMessage(`❌ 保存失败：${reason.length > 160 ? `${reason.slice(0, 160)}…` : reason}`);
				} finally {
					setBusy(false);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: S.rowCard,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: S.rowHead,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							style: S.rowIdentity,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: S.rowName,
									children: "DeepSeek VisionPlus"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: S.rowTag,
									children: "自定义"
								}),
								configured["DEEPSEEK_API_KEY"] === true ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: {
										...S.dot,
										background: "var(--dsw-alias-state-success-primary)"
									},
									title: L.keyStored
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: {
										...S.dot,
										background: "var(--dsw-alias-state-error-primary)"
									},
									title: L.keyPlaceholder
								})
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: {
								display: "inline-flex",
								alignItems: "center",
								gap: "4px",
								marginLeft: "auto"
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								style: S.rowEditButton,
								onClick: () => setEditing((v) => !v),
								children: L.edit
							})
						})]
					}),
					editing && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: S.card,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: S.sectionFrame,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProviderBlock, {
									name: deepseek.displayName || "DeepSeek",
									routeText: "deepseek-official",
									keyRef: "DEEPSEEK_API_KEY",
									keyValue: textKey,
									onKeyChange: setTextKey,
									configured: configured["DEEPSEEK_API_KEY"] === true,
									custom: {
										baseURL: deepseek.baseURL,
										displayName: deepseek.displayName,
										apiKeyEnv: deepseek.apiKeyEnv
									},
									onCustomChange: (patch) => setDeepseek((prev) => ({
										...prev,
										...patch
									})),
									models: deepseek.models,
									defaults: DEEPSEEK_DEFAULT.models,
									onModelUpdate: (i, patch) => setDeepseek((prev) => ({
										...prev,
										models: prev.models.map((m, j) => j === i ? {
											...m,
											...patch
										} : m)
									})),
									onModelAdd: () => setDeepseek((prev) => ({
										...prev,
										models: [...prev.models, {
											id: "",
											name: "",
											contextWindow: void 0
										}]
									})),
									onModelRemove: (i) => setDeepseek((prev) => ({
										...prev,
										models: prev.models.filter((_, j) => j !== i)
									})),
									onModelReset: () => setDeepseek((prev) => ({
										...prev,
										models: DEEPSEEK_DEFAULT.models.map((m) => ({ ...m }))
									})),
									onTest: () => void testDeepseek(),
									testing: testingDeepseek
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: {
									...S.sectionFrame,
									display: "flex",
									flexDirection: "column",
									gap: "12px"
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "baseline",
										gap: "8px"
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											style: S.title,
											children: L.visionModels
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											style: S.title,
											children: models.length === 0 ? "（未添加）" : `（${models.length}）`
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											style: S.route,
											children: "visionplus"
										})
									]
								}), loaded && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "12px"
									},
									children: [models.map((item, index) => {
										const open = openId === item.id;
										return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											style: S.rowCard,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												style: S.rowHead,
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
													style: S.rowIdentity,
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
														type: "button",
														style: {
															display: "inline-flex",
															alignItems: "center",
															gap: "6px",
															padding: 0,
															background: "transparent",
															border: "none",
															cursor: "pointer",
															minWidth: 0
														},
														onClick: () => setOpenId(open ? null : item.id),
														children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Chevron, { open }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
															style: S.rowName,
															children: item.displayName || `模型 ${index + 1}`
														})]
													}), configured[item.apiKeyEnv] === true ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														style: {
															...S.dot,
															background: "var(--dsw-alias-state-success-primary)"
														},
														title: L.keyStored
													}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														style: {
															...S.dot,
															background: "var(--dsw-alias-state-error-primary)"
														},
														title: L.keyPlaceholder
													})]
												}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
													style: {
														display: "inline-flex",
														alignItems: "center",
														gap: "4px",
														marginLeft: "auto"
													},
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														style: S.rowEditButton,
														disabled: testing !== null,
														onClick: () => void testPlatform(index),
														children: testing === item.id ? "测试中…" : "测试"
													}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														style: S.iconButton,
														disabled: busy,
														onClick: () => void deletePlatform(index),
														title: L.delete,
														children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TrashIcon, {})
													})]
												})]
											}), open && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
												style: S.card,
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProviderBlock, {
													name: item.displayName,
													hideTitle: true,
													keyRef: item.apiKeyEnv,
													keyValue: modelKeys[item.id] ?? "",
													onKeyChange: (value) => setModelKeys((prev) => ({
														...prev,
														[item.id]: value
													})),
													configured: configured[item.apiKeyEnv] === true,
													custom: {
														baseURL: item.baseURL,
														displayName: item.displayName,
														apiKeyEnv: item.apiKeyEnv
													},
													onCustomChange: (patch) => updateModel(index, patch),
													models: item.models,
													defaults: PLATFORM_DEFAULTS[item.id] ?? [],
													onModelUpdate: (mi, patch) => setModels((prev) => prev.map((p, i) => i === index ? {
														...p,
														models: p.models.map((m, j) => j === mi ? {
															...m,
															...patch
														} : m)
													} : p)),
													onModelAdd: () => setModels((prev) => prev.map((p, i) => i === index ? {
														...p,
														models: [...p.models, {
															id: "",
															name: "",
															contextWindow: void 0
														}]
													} : p)),
													onModelRemove: (mi) => setModels((prev) => prev.map((p, i) => i === index ? {
														...p,
														models: p.models.filter((_, j) => j !== mi)
													} : p)),
													onModelReset: () => setModels((prev) => prev.map((p, i) => i === index ? {
														...p,
														models: (PLATFORM_DEFAULTS[item.id] ?? []).map((m) => ({ ...m }))
													} : p))
												})
											})]
										}, item.id);
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										style: {
											display: "flex",
											flexWrap: "wrap",
											gap: "10px"
										},
										children: TEMPLATES.map((template) => {
											const added = template.platformId !== void 0 && models.some((m) => m.id === `vp-${template.platformId}`);
											return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
												type: "button",
												style: added ? {
													...S.addModelButton,
													opacity: .4,
													cursor: "default"
												} : S.addModelButton,
												disabled: added,
												onClick: () => addTemplate(template),
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlusIcon, {}),
													template.label,
													added ? "（已添加）" : ""
												]
											}, template.label);
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									justifyContent: "flex-end",
									alignItems: "center",
									gap: "8px"
								},
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: {
											...S.hint,
											flex: 1
										},
										children: message
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										style: S.secondaryButton,
										onClick: () => {
											setOpenId(null);
											setEditing(false);
											setMessage("");
											loadFromSettings();
										},
										children: L.cancel
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										style: S.primaryButton,
										disabled: busy,
										onClick: () => void save(),
										children: busy ? L.applying : L.apply
									})
								]
							})
						]
					}),
					toast !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							position: "fixed",
							right: "24px",
							bottom: "24px",
							zIndex: 9999,
							maxWidth: "380px",
							padding: "10px 14px",
							borderRadius: "12px",
							fontSize: "13px",
							lineHeight: "20px",
							color: "#fff",
							boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
							background: toast.kind === "ok" ? "var(--dsw-alias-state-success-primary, #2ecc71)" : "var(--dsw-alias-state-error-primary, #e74c3c)"
						},
						children: toast.text
					})
				]
			});
		}
		//#endregion
		//#region src/client/index.ts
		const name = "vision-plus";
		const inject = [
			"slots",
			"connection",
			"modelDirectories"
		];
		/** 浏览器端：设置页（DeepSeek VisionPlus）+ 输入框图片图标。 */
		function apply(ctx) {
			try {
				const slots = ctx.slots;
				const api = ctx.connection.api;
				try {
					slots.inject("settings.section", () => slots.register({
						name: "settings.section",
						id: "vision-plus",
						order: 20,
						label: () => "VisionPlus",
						inject: () => ({ api })
					}, VisionSettingsPage));
				} catch (error) {
					console.error("[vision-plus] 设置卡片注册失败:", error);
				}
				slots.inject("conversation.input.left", () => slots.register({
					name: "conversation.input.left",
					id: "vision-plus-image",
					order: 10,
					inject: () => ({
						api,
						modelDirectories: ctx.modelDirectories
					})
				}, ImageButton));
				console.log("[vision-plus] client apply ok, slots registered");
			} catch (error) {
				console.error("[vision-plus] client apply failed:", error);
			}
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map