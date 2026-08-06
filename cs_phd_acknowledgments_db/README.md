# 美国 Top 11 CS 学校 2020–2025 博士论文致谢数据库

结构化、可断点续传、可核验的数据集，记录美国计算机科学博士学位论文中"致谢/Acknowledgments"章节里被点名的人物及其关系类型。**不收录论文正文内容，只保留简短关系证据、页码和官方链接。**

## 覆盖范围

- **学校（Top 11，暂定）**：MIT, Stanford, CMU, UC Berkeley, Cornell, University of Washington,
  Princeton, Georgia Tech, UIUC, UT Austin, University of Michigan
- **年份**：2020–2025（按学位授予/答辩年份）
- **院系范围**：仅计算机科学方向博士学位（EECS 类学校中明确标注 CS/Computer Science 方向；
  纯电气工程方向不收录）
- **来源限制**：仅使用学校官方学位授予页面、官方论文库（如 DSpace、ProQuest 机构版、
  eScholarship 等）、学校图书馆目录、作者本人公开论文主页。不使用非官方镜像、
  盗版站点或未经确认来源的转载。

## 批次状态

批次进度与已知阻塞项记录在每次批次的 `batch_summary.md` 中（按批次追加或建立
`batch_summary_<school>_<year>.md`）。当前状态：**执行被环境网络策略阻塞**
（见仓库根目录会话记录），尚未产出任何论文记录。

## 目录结构

```
cs_phd_acknowledgments_db/
├── README.md                              本文件：字段规范与流程说明
├── data/
│   ├── theses_increment.csv               论文级记录（名单 + 元数据 + PDF状态）
│   ├── acknowledged_people_increment.csv  致谢人物级记录
│   └── exceptions.csv                     无法核验/需人工复核的条目
└── batch_summary.md                       最近一次批次的统计报告
```

CSV 采用**增量追加**模式：每完成一篇论文的处理，立即向三个 CSV 追加对应行并保存，
不等整批完成再写入，避免任务中断丢失进度。`thesis_id` 是跨三个文件的主键，
重复运行时先检查该 ID 是否已存在，存在则跳过或按需更新，不重复抓取。

## 字段规范

### theses_increment.csv（论文级）

| 字段 | 说明 |
|---|---|
| `thesis_id` | 主键，格式 `<校代码>-<年份>-<序号>`，如 `MIT-2020-0001` |
| `school` | 学校全称 |
| `department` | 院系全称（如 "Electrical Engineering and Computer Science"） |
| `degree` | 学位类型（PhD / ScD 等，按学校实际授予名称） |
| `year_conferred` | 学位授予年份（非答辩年份，如两者不同以官方授予记录为准） |
| `author_name_standardized` | 标准化姓名（"姓, 名"格式，去除头衔/后缀干扰） |
| `author_name_raw` | 官方来源页面上的原始姓名拼写 |
| `title` | 论文标题（官方原文） |
| `advisor` | 导师姓名（标准化），多导师以 `;` 分隔 |
| `official_record_url` | 官方学位记录/图书馆目录页面 URL |
| `official_pdf_url` | 官方 PDF 直链（若存在），否则留空 |
| `pdf_public_status` | `public` / `embargoed` / `restricted` / `not_found` / `broken_link` |
| `source` | 数据来源系统（如 "DSpace@MIT" "ProQuest" "Library Catalog" "Author homepage"） |
| `retrieved_date` | 记录/核验日期（ISO 8601） |
| `notes` | 简要备注（如与官方总名单核对差异） |

### acknowledged_people_increment.csv（致谢人物级）

| 字段 | 说明 |
|---|---|
| `thesis_id` | 外键，关联 theses_increment.csv |
| `person_name_raw` | 致谢文本中出现的原始姓名 |
| `person_name_standardized` | 标准化姓名 |
| `relationship_category` | 见下方受控词表 |
| `evidence_snippet` | ≤150 字符的简短引文片段，仅作关系证据，不得整段摘抄 |
| `pdf_page_number` | 致谢文本所在 PDF 物理页码（从1开始计数） |
| `printed_page_number` | 论文印刷页码（如 "iv" "112"，与PDF页码可能不同） |
| `source_pdf_url` | 对应官方 PDF 链接 |
| `extraction_date` | 提取日期（ISO 8601） |

**relationship_category 受控词表**：
`advisor`（导师）/ `committee`（委员会成员）/ `collaborator`（合作者）/
`labmate`（同门/同实验室）/ `classmate`（同学）/ `friend`（朋友）/
`partner`（伴侣）/ `parent`（父母）/ `sibling`（兄弟姐妹）/
`other_family`（其他家人）/ `other`（其他，需在 evidence_snippet 说明）/
`unclear`（关系不明确，同时应在 exceptions.csv 记录）

### exceptions.csv（异常/待复核）

| 字段 | 说明 |
|---|---|
| `thesis_id` | 若已建档则填写，否则留空并用 school+year+author 定位 |
| `school` / `year` / `author_name` / `title` | 定位信息 |
| `issue_type` | `link_broken` / `inaccessible` / `embargoed` / `no_ack_detected` / `ocr_failed` / `relationship_unclear` / `list_incomplete` / `other` |
| `detail` | 具体说明 |
| `date_logged` | 记录日期 |
| `next_action` | 建议的后续处理（如"待人工核对官方名单""待重试下载"） |

## 姓名标准化规则

1. 统一为 `姓, 名 [中间名首字母.]` 格式（如原文本为 "John A. Smith" → "Smith, John A."）。
2. 保留原始拼写变体于 `*_raw` 字段，不做音译或猜测性纠正。
3. 昵称/简称在 evidence_snippet 中保留原文，`standardized` 字段尽量匹配论文其他部分
   （如题名页、committee 列表）出现的正式全名；无法确认全名时，`standardized` 与
   `raw` 保持一致并在 notes 中说明。

## 处理流程（每所学校/年份一个子批次）

1. **建立完整名单**：从官方学位授予记录（毕业典礼名单、图书馆目录按年浏览等）
   拉取该校该年度全部 CS 方向博士毕业生，先写入 `theses_increment.csv`（PDF 相关
   字段可先留空/`unknown`），确保名单不因"能否找到PDF"而被筛选。
2. **逐篇核验元数据**：题目、导师、院系、官方页面链接。
3. **定位 PDF**：官方论文库/图书馆直链优先；找不到或受限则标记 `embargoed` /
   `restricted` / `not_found` 并跳过下载。
4. **下载并解析 PDF**：定位 Acknowledgments/Acknowledgements/Dedication 章节，
   记录 PDF 页码与印刷页码。
5. **提取致谢人物**：按受控词表分类，写入人物级 CSV，附简短证据与页码。
6. **写入异常**：任何无法完成 2-5 步的情况写入 `exceptions.csv`，不得猜测填补。
7. **保存**：每完成一篇立即保存三个 CSV，避免批量丢失。

## 与官方总名单核对

每个子批次完成后，在该批次的 `batch_summary.md` 中报告：论文总数是否与学校官方
授予名单/统计一致；若不一致，保留差异（不删除已收录条目），并说明差异原因
（如官方名单口径为"全院系"而本数据库只收 CS 方向）。
