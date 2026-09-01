# PSC 2021 source records

Verified source artifacts for the `question_banks` content. Provenance, verification
method, and per-row source-record semantics are documented in
[PSC_XIYOUQUEST_RELEASE_EVIDENCE.md](../PSC_XIYOUQUEST_RELEASE_EVIDENCE.md)
("Official-content collection" and "Full 2021 word-table ingestion" sections).

| File | Contents |
| --- | --- |
| `psc2021-wordtable-verified.json` | The verified 普通话水平测试用普通话词语表（2021年版）: 表一 8,361 + 表二 10,081 entries with printed entry numbers, words, raw printed pinyin, and converted numbered pinyin. This is the dataset ingested into `question_banks` C1/C2. |
| `psc2021-appendix-tables-verified.json` | The verified 2021 appendix tables: 必读轻声词语表 (594 entries) and 儿化词语表 (199 of announced 200). Ingested into C2. |
| `psc2021-wordtable-source-sdwm.pdf` | The institutional source PDF (jcb.sdwm.edu.cn attachment "2024年新大纲普通话考试-单音节多音节完整注音版.pdf", 197 pages; mirror: yywzw.hxu.edu.cn). 47 MB, kept **untracked** (gitignored) to avoid bloating history — a local copy sits beside this README; re-download via `curl -e 'https://jcb.sdwm.edu.cn/info/1068/2661.htm' 'https://jcb.sdwm.edu.cn/system/_content/download.jsp?urltype=news.DownloadAttachUrl&owner=1427152635&wbfileid=12125688'` (Referer header required), or from the hxu.edu.cn mirror. |

School authorization for use of these syllabus materials is recorded in the release
evidence. Learner-facing output remains XiYouQuest practice, never an official PSC result.
