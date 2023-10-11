# 《利用 husky 实现前端项目自定义规范校验》示例

### 说明

展示了利用 husky 添加 git hooks 执行校验相关逻辑，利用 gitDiffParser.js 解析 git diff 数据配合实现自定义校验（[peg-git-diff-parser](https://github.com/Lnncoco/peg-git-diff-parser) 文件实现逻辑查阅《PEG 实现 git diff 数据解析器》一文）。

check.js 文件实现内容，其他细节查阅源码与注释：

1. 通过钩子传回的消息文件路径读取出消息内容
2. 判断 git commit message 确认是否需要对本次提交校验
3. 利用 simple-git 执行 git 命令获取暂存区数据
4. 调用 gitDiffParser 将文本内容解析成 JSON 格式以实现变动内容校验
5. 校验 package.json#version 版本号一行是否变更
6. 通过提交与阻止提交

### 测试方式

- 检测通过条件

  > 说明：当前项目未添加其他校测，所以如果没有`feat:`这类前缀会跳过检测导致提交成功，实际项目中 git type 校验通过 commitlint 实现约束（相关资料参考官网文档或者另一篇记录《husky7 + commitlint + lint-staged 记录》）。

  - 提交暂存区的文件中存在 package.json 文件且 version 行有变更

  - 提交消息形式为 feat: xxx

- 检测不通过示例

  前提：提交消息形式为 feat: xxx 触发校验检测。

  - package.json version 行无变更，但其他行有变更

  - package.json version 行有变更，但没有添加暂存区中
