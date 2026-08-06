# 批次报告：MIT 2020 CS 博士论文（试点批次）

**状态：阻塞（Blocked） — 尚未产出任何论文/人物记录**
**报告生成时间：2026-08-06**

## 阻塞原因

本次会话运行在一个远程执行环境（Claude Code on the web session container）中，
其网络出站策略仅放行一个白名单（`registry.npmjs.org`、`pypi.org`、
`api.github.com`/`github.com`、`anthropic.com` 等包管理与代码托管相关域名），
**其余所有外部网站均被网关拒绝**，包括：

- `dspace.mit.edu`（MIT 官方论文库，本批次首选数据源）— 403 policy denial
- `en.wikipedia.org` — 403
- `www.google.com`、`arxiv.org` — 连接被拒绝

`WebFetch` 工具与直接 `curl` 均受此限制。`WebSearch` 工具因运行在 Anthropic
托管后端、不经过本容器出站网关，仍可返回搜索结果摘要，但**无法抓取完整页面
或下载 PDF 原文**——仅凭摘要无法满足任务要求的"仅使用官方来源逐条核验、
不得猜测"标准，因此本批次未产出任何 `theses_increment.csv` /
`acknowledged_people_increment.csv` 记录。

## 已完成的准备工作

1. 确认试点范围：MIT，2020 届，Computer Science 方向博士论文（EECS 院系下
   明确 CS 方向，排除纯电气工程方向）。
2. 初步定位官方数据源候选：
   - DSpace@MIT EECS PhD/ScD 论文集合：`https://dspace.mit.edu/handle/1721.1/7660`
   - DSpace@MIT Doctoral Theses 分类页：`https://dspace.mit.edu/handle/1721.1/131022`
   （以上链接尚未能实际访问验证其结构，仅来自 WebSearch 摘要，需在网络恢复后
   逐一核实。）
3. 搭建数据库目录结构、四个输出文件的字段规范（见
   `cs_phd_acknowledgments_db/README.md`）与受控词表（relationship_category /
   issue_type）。
4. 在 `exceptions.csv` 中记录本次阻塞的完整详情，作为可追溯的中断记录。

## 统计（本批次至今）

| 指标 | 数值 |
|---|---|
| 官方名单总数 | 0（未能建立） |
| 找到公开 PDF 数 | 0 |
| embargo/受限数 | 0 |
| 成功定位致谢数 | 0 |
| 未检测到致谢数 | 0 |
| 被致谢人物记录数 | 0 |
| 待人工复核条目 | 1（网络访问阻塞，见 exceptions.csv） |

## 与官方总名单核对

未执行（尚未建立名单，无法核对）。

## 下一步

等待当前会话所在环境的网络访问策略调整为允许访问学校官方论文库域名后，
按 README.md 中的处理流程重新执行：

1. 建立 MIT 2020 EECS-CS 方向 PhD/ScD 完整名单（不因是否有PDF而预先筛选）。
2. 逐篇核验元数据并写入 `theses_increment.csv`。
3. 下载可公开访问的 PDF，定位致谢章节，写入 `acknowledged_people_increment.csv`。
4. 将本批次论文总数与 MIT 官方 2020 届毕业统计或 EECS 系年度报告核对，
   保留任何数量差异并说明原因。
5. 试点批次验证流程无误后，评估是否可以并行 / 分批扩展到其余 10 所学校及
   2021–2025 年份。
