# vision-plus 插件

## 安装

```bash
dsh plugin --profile web add dsh-vision-plus
# 或本地目录：
dsh plugin --profile web add <本目录>
```

## 可选增强补丁（需要改 Harness 源码时）

1. 把 `patches\增强补丁.bat` 复制到 Harness 仓库**根目录**；
2. 双击执行（应用补丁 + 完整重建）；
3. 重启 Harness。

详见 README.md。