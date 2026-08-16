// 双面构建：
// 1) node 面：自包含 ESM（全部内联，零运行时依赖）；
// 2) client 面：harness 官方客户端 bundle 格式（CJS + __ModuleLoader__ 工厂包装，
//    平台模块走 loader require 表，其余内联）。

const CLIENT_EXTERNALS = [
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-web-react',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-attachment',
  '@deepseek-ai/dsh-client-schema-form',
  '@deepseek-ai/dsh-client-runtime/client',
]

export default [
  {
    name: 'dsh-visionplus',
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: ['esm'],
    platform: 'node',
    dts: false,
    noExternal: [/.*/],
    clean: false,
  },
  {
    name: 'dsh-visionplus/client',
    entry: { client: 'src/client/index.ts' },
    outDir: 'dist',
    format: ['cjs'],
    platform: 'browser',
    target: 'es2024',
    fixedExtension: false,
    dts: false,
    sourcemap: true,
    clean: false,
    external: CLIENT_EXTERNALS,
    noExternal: (id) => (CLIENT_EXTERNALS.includes(id) ? undefined : true),
    outputOptions: {
      entryFileNames: 'client.js',
      banner: 'window.__ModuleLoader__.load({ id: "dsh-visionplus", factory: (require) => {',
      footer: 'return module.exports; } });',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
    },
  },
]