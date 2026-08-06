# 批次报告：MIT 2020 EECS 博士论文（试点批次）

**状态：第一轮已完成，存在已知待补全项（见"已知限制"）**
**报告生成时间：2026-08-06**

## 批次范围与方法论说明

- **学校**：Massachusetts Institute of Technology
- **年份**：2020（学位授予年份，`dc.date.issued` = 2020）
- **院系范围**：MIT 的博士学位由 EECS（Electrical Engineering and Computer Science）
  系统一授予，官方学位记录不区分"CS 方向"与"EE 方向"子学位。因此本批次范围 =
  DSpace@MIT "Doctoral Theses" 集合中 `dcRelationOrgunit` 字段等于
  "Massachusetts Institute of Technology. Department of Electrical Engineering
  and Computer Science" 且 `dateIssued` = 2020 的全部条目，**不逐篇猜测个体论文
  是研究方向偏 CS 还是偏 EE**（这是一个学校级别的、有据可查的方法论决定）。

## 数据来源

- **官方系统**：DSpace@MIT（`https://dspace.mit.edu`），通过其公开 REST API
  （`/server/api/discover/search/objects`、`/server/api/core/items/{uuid}/bundles` 等）
  程序化拉取，未使用任何非官方镜像。
- **名单确认路径**：MIT Libraries community → Doctoral Theses collection
  (`handle 1721.1/131022`) → 按 `dcRelationOrgunit` + `dateIssued` 过滤。
- 每条记录的 `official_record_url`（`hdl.handle.net` 持久链接）与
  `official_pdf_url`（DSpace bitstream 直链）均写入 `theses_increment.csv`，可逐条复核。

## 统计

| 指标 | 数值 |
|---|---|
| 官方名单总数 | **102** |
| 找到公开 PDF 数 | **101** |
| embargo/受限数 | **1**（MIT-2020-096，Yang, Tien-Ju，*Hardware-aware efficient deep neural network design*；DSpace 条目存在但无 ORIGINAL/PDF bundle，仅 THUMBNAIL/TEXT/COVERPAGE） |
| 成功定位致谢/Dedication 章节数 | **101 / 101**（全部公开 PDF 均定位到标题页；MIT-2020-096 因无公开PDF无法定位） |
| 未检测到致谢数 | **0**（无一篇公开 PDF 缺失可识别的 Acknowledgments/Dedication 标题） |
| 被致谢人物记录数 | **1,861** |
| 有 ≥1 条人物记录的论文数 | **99 / 101**（另 2 篇见下方说明） |
| 待人工复核条目（exceptions.csv） | **62** |

两篇公开PDF但零人物记录的论文：
- **MIT-2020-039**（Lazar, David，*Strong and scalable metadata security for voice calls*）：
  致谢页是一段加密学"玩笑"构造（用 Merkle 树哈希隐藏真实姓名，正文仅出现占位符
  "Alice"），未包含可验证的真实姓名，如实标记为 `ocr_failed` 并跳过，不得猜测。
- **MIT-2020-081**（McKay, Dylan，*Intermediate lower bounds and their relationship
  with complexity theory*）：可见的致谢文本片段中未出现导师/委员会/家人等可分类的
  具名人物，标记为 `relationship_unclear`。

## 关系类型分布（1,861 条记录）

| 类别 | 数量 |
|---|---|
| collaborator（合作者） | 589 |
| labmate（同门/同实验室） | 496 |
| other（其他，见 evidence_snippet 说明） | 294 |
| committee（委员会成员） | 168 |
| friend（朋友） | 144 |
| advisor（导师） | 116 |
| parent（父母） | 22 |
| partner（伴侣） | 13 |
| unclear（关系不明确） | 8 |
| other_family（其他家人） | 7 |
| sibling（兄弟姐妹） | 4 |

## 已知限制（需要后续批次处理，已在 exceptions.csv 逐条记录）

**核心限制：单页文本截断。** 本批次的自动化抽取脚本每篇论文只截取了致谢/Dedication
标题页 PDF 文本的前 ~4000 字符用于人物提取。对致谢内容较长、超过一页、或临近
4000 字符边界被截断的论文（约 59 / 101 篇，记录在 `exceptions.csv` 的
`relationship_unclear` 行中），提取结果**很可能不完整**——尤其是论文末尾常见的
家人/伴侣致谢段落，经常出现在截断点之后而未被捕获。这不是猜测性错误（没有编造
任何内容），而是覆盖不全：已提取的 1,861 条记录都有可验证的原文证据，但已知还有
未提取到的人物。

**后续动作**：
1. 对 `exceptions.csv` 中 59 条 `relationship_unclear`（截断类）逐一重新抓取完整
   页面文本（必要时含下一页），补全遗漏的致谢人物，而非仅依赖当前的4000字符窗口。
2. `printed_page_number` 字段对约三分之一记录为空——原因是该论文的致谢页在 PDF
   中该页码本身以罗马数字/阿拉伯数字印刷于页面其他位置，脚本未能可靠提取；需要
   人工或更精细的版面分析二次核对。
3. 姓名标准化目前对"仅提及名字（no surname）"的家人/朋友（如"my mom Linda"）
   保留为原样，未强行猜测姓氏，符合"不得猜测"要求，但意味着这部分人物无法与
   跨论文的同名人物合并去重。

## 与官方总名单核对

本批次的"官方名单总数 102"直接来自 MIT Libraries 官方仓库 DSpace@MIT 的
Doctoral Theses 集合过滤结果，即数据来源本身就是官方权威名单，暂未找到独立的
第二来源（如 MIT EECS 年度系报告 "Report to the President" 中的毕业生人数统计）
进行交叉核验。**待办**：后续应查找 MIT EECS 2020 年度 "Report to the President"
（DSpace 中已知存在该系列报告，如 handle 1721.1/159638）中的博士学位授予人数，
与本批次的 102 篇进行交叉核对；如有差异，保留差异并记录原因，不自行删除条目。

## 下一步

1. 处理上述"已知限制"中的截断补全（59 篇）。
2. 完成与 MIT EECS 年度报告的交叉核验。
3. 试点批次验证流程无误后，扩展到 MIT 其余年份（2021–2025）及其余 10 所学校。
