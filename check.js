const fs = require("fs");
const path = require("path");
const simpleGit = require("simple-git");
const GitDiffParser = require("./lib/gitDiffParser");
const argv = process.argv.slice(2);

const GIT_TYPE = ["feat", "fix", "doc", "style", "refactor", "perf", "test"];

/**
 * 检测版本号是否变动
 * @param msg {string} 消息内容
 */
const checkVersion = async (msg) => {
  let flag = false;

  const git = simpleGit({
    baseDir: process.cwd(),
    binary: "git",
  });

  // 跳过检测
  if (isSkipCheck(msg)) return true;

  // 判断版本号记录文件是否有变化
  const diff = await git.diff(["--cached", "package.json"]);
  if (diff) {
    const result = GitDiffParser.parse(diff, { REMOVE_INDENT: true });

    result.change.forEach((item) => {
      item.content.forEach((content) => {
        // 可细化校验逻辑
        if (content.type === "+" && content.text.includes(`"version"`))
          flag = true;
      });
    });
    return flag;
  }
  return flag;
};

/**
 * 跳过检测
 * @param filePath {string[]} 读取消息文件路径
 */
const isSkipCheck = (msg) => {
  const curGitType = msg[0].replace(":", "");
  // 可以通过遍历msg消息增加自定义跳过标识
  // git type 类型规范使用commmit插件校验
  return !GIT_TYPE.includes(curGitType);
};

/**
 * 读取git message消息文件
 * @param filePath {string} 读取消息文件路径
 */
const readGitMessage = (filePath) => {
  try {
    const msg = fs.readFileSync(path.join(process.cwd(), filePath), "utf-8");
    return msg.split(/\s/).filter((item) => item);
  } catch (e) {
    return undefined;
  }
};

/**
 * 主流程
 */
const start = async () => {
  const msg = readGitMessage(argv[0]);
  const success = await checkVersion(msg);
  if (!success) {
    console.log("提交校验未通过，请确认项目版本号是否变更");
    process.exit(1);
  } else process.exit(0);
};

start();
