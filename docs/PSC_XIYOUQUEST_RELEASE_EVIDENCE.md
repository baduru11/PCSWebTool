# XiYouQuest PSC Alignment Release Evidence

**Decision: blocked.**

The reviewed XiYouQuest candidate is committed as `3dce479` (`fix(api): bound mock exam totalXp by a server-derived XP ceiling`, tip of the reviewed chain extending `4bd97bd` and `2a46a9e63d939c8c449cd6cc9d10f601b8e4cbc4`), but it is not eligible for release because no non-production deployment of that exact commit, immutable rollback target and owner, required signed-in candidate-flow evidence, or course-mapping decisions are available. On 2026-08-22, read-only authenticated Chrome inspection reached the XiYouQuest Vercel project. Its environment list showed `BETTER_AUTH_DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` scoped to both **Production and Preview**. The deployment list did not contain the exact candidate commit. Preview is therefore not a data-isolated QA target and could write learner data to production persistence. The newly authorized controlled C4/C5 and two-account tests are **unconsumed**; no deployment, setting, sign-in, microphone attempt, or learner-data write was performed. This is a release-gate decision only: it does not authorize a production deployment, alter production, or withdraw the permitted `school_provided_public_use` source scope.

This record applies only to the XiYouQuest service. It does not authorize a deployment, change a PSC policy, or make an official PSC result.

## Verified baseline

| Item | Evidence |
| --- | --- |
| Local target | `XiYouQuest-RPG-study-web`, branch `codex/xiyouquest-checklist-work` |
| Local baseline inspected | `e6e6906a32eed57d58b5342033fb56f604aa1a77` |
| Reviewed candidate commit | `3dce479` (`fix(api): bound mock exam totalXp by a server-derived XP ceiling`). Chain: `2a46a9e` → five reviewed commits to `4bd97bd` (`feat(psc): align formal mock with C1-C5`; supersedes the blocked interim `ceb6d34`, not an ancestor) → `88ae3fa` (release-record update, docs only) → `74ce9c3` (cross-runtime `COMPONENT_LABELS` parity test) → `3dce479` (server-derived `totalXp` ceiling). On 2026-08-24 the reviewed chain was merged to the fork's `main` as `0519e36` (PR #1) and the work branch deleted; `0519e36` is the deployable pointer for the reviewed content. The `xyq` team repository's `main` remained at `6b0afd5` and was not pushed. |
| Isolated preview data environment (2026-08-24) | Supabase project `xyq-preview` (ref `smeazrwejxtssxjdhldb`, org `EricEremos's Org`, ap-south-1) — fully separate from production `XiyouQuest` (`yfoifmqjhavxidomgids`, org `baduru11's Org`). Schema built by replaying production's own 68-entry `supabase_migrations` history (read via the read-only Management API query endpoint) in version order, then the four repo-only migrations (`003_hkust_sso_better_auth`, `004_repoint_user_fks_to_profiles`, and the two 2026-08-22 candidate migrations); the 70-entry history ledger was recorded on the preview so future MCP migrations align. All 11 edge functions deployed with `--no-verify-jwt`; their secrets carry a fail-closed **placeholder** `BETTER_AUTH_JWKS_URL` (an `.invalid` https origin) so no token can verify until the real preview origin is set. `avatars` and `chat-images` storage buckets recreated (`chat-images` public, 10 MiB, per the replayed config migration). Verified: table set covers every `.from()` reference in app and edge code; RLS enabled on all public tables; `better_auth` has its five tables; zero rows in `profiles`, `better_auth.user`, `mock_exam_results`, `quest_progress`; unauthenticated and bogus-token edge calls return `401`; a local production build sourced from `.env.preview.local` inlines only the preview ref into client chunks, redirects `/` → `/login` `307`, and returns `401` on `/api/quest/progress` and `/api/mock-exam/history`. No learner data was created; production was not touched. |
| Remote `origin/main` observed | `6b0afd5f77c0de0780fc918a3952c1e82b607ee9` |
| GitHub deployment status for the local baseline | `Vercel – xi-you-quest-rpg-study-web`: **success**, target [`EQiSGFzn6M2DV8wKaAcCQWiKS7TS`](https://vercel.com/xyq/xi-you-quest-rpg-study-web/EQiSGFzn6M2DV8wKaAcCQWiKS7TS). The separate `Vercel – pcs-web-tool` status is failed and belongs to a different Vercel project. |
| Public entry reachability | `https://cle-xyq.hkust.edu.hk/login` and `https://xi-you-quest-rpg-study-web.vercel.app/login` both returned HTTP `200` on 2026-08-22. A fresh `https://cle-xyq.hkust.edu.hk/` probe returned HTTP `307` to `/login` at 07:39 HKT, with HSTS, CSP, frame-deny, no-sniff, referrer, and restricted-permissions headers. This is unauthenticated reachability only. |
| Public data-route boundary | On both public domains, unauthenticated `GET` requests to `/api/quest/progress`, `/api/mock-exam/history`, and `/api/learning/plan` returned HTTP `401` with `{"error":"Unauthorized"}` on 2026-08-22. This proves the anonymous boundary only; it does not prove an authenticated learner journey. |
| Connected Vercel API scope | Access to team `xyq` returned HTTP `403`; it cannot be used as deployment, runtime-log, rollback, or production-configuration evidence. |
| Vercel CLI scope | `vercel inspect EQiSGFzn6M2DV8wKaAcCQWiKS7TS --scope xyq` reported that the scope does not exist for the configured CLI account. It is not evidence of the deployment's runtime configuration or a rollback target. |
| Vercel browser project inspection | Read-only authenticated Chrome inspection reached `xyq/xi-you-quest-rpg-study-web`. The environment-variable scope list, without inspecting values, shows `BETTER_AUTH_DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` assigned to both **Production and Preview**. The deployment history contains no artifact for candidate `2a46a9e63d939c8c449cd6cc9d10f601b8e4cbc4`; displayed previews are older commits. | The available Preview configuration is not safe for controlled learner-data QA. No secret value was revealed and no deployment, configuration, sign-in, microphone, or learner-data action was taken. |
| Local rendered entry check | On 2026-08-22, `http://localhost:3002/` redirected to `/login` and rendered XiYouQuest branding, HKUST sign-in, and the `@ust.hk` / `@connect.ust.hk` account boundary. Direct unauthenticated `/component-4` and `/component-5` checks each redirected to `/login`; no sign-in, microphone request, or learner-data creation occurred. |
| Exact candidate code review | Review range `60ce12504b9f28f22f72d1b9ab8b86b7cc625fb1..2a46a9e63d939c8c449cd6cc9d10f601b8e4cbc4`: **CLEAR / APPROVE** on 2026-08-22 (no findings at any severity). The subsequent chain `2a46a9e..4bd97bd` was reviewed commit-by-commit (`.omo/evidence/`), with the `86fa6f3` and superseded-`ceb6d34` REQUEST_CHANGES findings verified resolved at the tip by the 2026-08-24 delta review `86fa6f3..4bd97bd`: **CLEAR / APPROVE**, no critical or high findings; one medium (missing cross-runtime `COMPONENT_LABELS` parity test — not a regression of this range) and two pre-existing low notes are recorded as follow-ups in `.omo/evidence/xiyouquest-4bd97bd-delta-review.md`. |

The reviewed application changes are committed. The unrelated untracked `.omo/` and `docs/superpowers/` paths are intentionally excluded from the candidate. This record does not claim that production contains the candidate changes.

## Source and use boundary

The supplied school materials are recorded as `school_provided_public_use`. The SharePoint outline is a discovery index, not a scoring authority. PSC alignment is traceable to the following cited sources used by the design record:

- [Putonghua Shuiping Ceshi syllabus](https://www.moe.gov.cn/jyb_xxgk/gk_gbgg/moe_0/moe_9/moe_40/tnull_117.html)
- [Revised testing procedure](https://hudong.moe.gov.cn/srcsite/A18/s3133/202302/t20230210_1043378.html)
- [Bayingol Mongol Autonomous Prefecture Government Education Bureau: *普通话水平测试用话题50则*](https://www.xjbz.gov.cn/xjbz/c101441/202309/67e808035ee44f4bbf71e51ba00c0a91.shtml), published 2023-09-12 and effective 2024-01-01. It enumerates the current 50 topics and states that the test system provides two randomly selected topics for the candidate to choose from.

The Ministry syllabus was directly checked on 2026-08-22. For Component 5 it states a three-minute limit, shortfall deductions of 1–3 points when the shortfall is no more than one minute and 4–6 points when it exceeds one minute, and a component score of zero for speech of 30 seconds or less. XiYouQuest applies deterministic practice bands within those published categories; it does not present them as an official PSC result.

No model, teacher workflow, or release process may use these sources to invent official scores, decide certification or eligibility, approve asset rights, publish content, or make learner-policy decisions.

### C4 reading-work source-record completion and text verification (2026-08-27)

The formal-mock C4 gate was blocked because no `question_banks` component-4 row carried the complete school-provided source record required by XQ-03. On the user's instruction the record was completed and the corpus verified:

- **Source record.** All production component-4 rows whose work appears in the school-supplied `doc/ExampleQuestions/component4.md` (verified as exactly the 2021 outline's 50 朗读作品) now carry `source_scope=school_provided_public_use`, `source_title="HKUST-supplied PSC reading works, 2021 PSC implementation outline"`, `source_version=psc-2021`. Production C4 was completed from 30 to all 50 works; `set_number` and `metadata.passage_number` now equal the official 2021 work number (1–50).
- **Text verification.** Every one of the 50 texts (30 pre-existing rows and 20 new inserts) was character-verified by independent agents against the official 2021版新大纲 50-work collection — primary sources: the 语文出版社-derived PDF mirrors hosted by 河南师范大学 (`htu.edu.cn`) and 南阳师范学院 (`jwc.nytdc.edu.cn`), cross-checked against `putonghuaweb.com/passage2021` and `putonghuaceshi.com`. A systemic corruption class (content-filter damage: silently dropped characters such as 最/一次/独/著名/鴳, stray ASCII periods inside words such as 高潮/腐败/炮火/亚热带, and two wholly omitted paragraphs in 聪明在于学习 and 忆读书) was found and repaired: 78 verified corrections across the school file and 24 production rows. Two claimed corrections were adversarially refuted against the official PDF and not applied (作品39号 `画在上面了` and `普通老百姓` are correct as stored). Known cosmetic deviation retained: ASCII `...` for the Chinese ellipsis `……`, corpus-wide. `doc/ExampleQuestions/component4.md` now converges with the verified production texts for all 50 works (0 normalized differences).
- **Preview parity.** `xyq-preview` `question_banks` was replaced with an exact copy of corrected production: 2054 rows, per-component counts equal (C1 1015 / C2 534 / C3 90 / C4 50 / C5 147 / C6 118 / C7 100), per-row md5 over (component, set_number, content, pinyin, metadata) identical for all rows.
- **Verification.** SQL predicate mirroring `getReadingPassageSource` returns 50/50 school-provided on both projects; the mock-exam gate condition is satisfiable on both; `reading-session.test.tsx`, `reading-passage-source.test.ts`, and `reading-scope.test.ts` pass (9 tests). One passage (`最糟糕的发明`) not sourced from the school file at first inspection was confirmed to be 作品50号 of the 2021 outline and its school-file heading typo (`糟糕的发明`) corrected, so it is legitimately school-provided.

This record documents a content-provenance completion only; it does not alter the release-gate decision, authorize a deployment, or make an official PSC claim.

### Official-content collection: C3 source records, 2021 appendix word tables, and exclusions (2026-08-27)

On the user's instruction to collect PSC-syllabus content into XiYouQuest's own banks, the following was executed with per-row source records and agent verification:

- **C3 selection-judgment bank.** All 90 rows were matched against the school-supplied `doc/ExampleQuestions/C3.txt`: 75 rows are school items and now carry `school_provided_public_use` records; 15 rows are AI-generated variants and are recorded as `xiyouquest_practice` (explicitly not school-supplied); 14 school items missing from the bank were inserted (C3 now 104 rows). One answer aligned to the school key (一（　）狗 → 条, with 只 still accepted via the versioned XQ-02 bundle). Two school keys that contradict the standard form the item exists to test (你有洗澡没有？, 他说清楚得很) were **not** applied: the standard answers were kept and each row carries a `school_key_discrepancy` review hold; one school item with the same defect (给我多一些) was not inserted. Answer-position leakage was fixed by a deterministic seeded option permutation (measure-word answers were 28/30 "A"; distributions are now balanced; `acceptedAnswers` binding is text-based and unaffected).
- **2021 appendix word tables → C2.** 普通话水平测试用必读轻声词语表（2021年版） and 儿化词语表（2021年版） were acquired from two independent university mirrors (苏州科技大学 `yuwei.usts.edu.cn/info/1008/1407-1408.htm` with pinyin; 山东水利职业学院 `sdwcvc.edu.cn/jwkyc/info/1090/3045-3046.htm`; corroborated by 东北石油大学 `ztw.nepu.edu.cn`), transcribed by 32 vision agents, cross-reconciled between mirrors, and validated against every documented anchor: the announced totals (594 / 200), the 53 named 轻声 additions, and the full 儿化 change-list (15 new, 6 adjusted, 馅儿饼 replacing 馅儿, 杏儿 deleted). Result: 594 轻声 entries (591 words; 杆子/肚子/把子 are genuine dual-reading rows) and 199 儿化 entries (the shared source images contain 199 of the announced 200 — recorded as a source discrepancy, all anchors present). Ingested into component 2 with `official_public_syllabus` source records and pinyin converted to the bank's numbered convention: 90 existing rows enriched, 703 rows inserted; C2 now 1,237 rows (594 qingsheng / 199 erhua tagged). Six cross-mirror misreads were adjudicated by direct image inspection and dropped (镟子→镊子, 栅子→棚子, 高梁→高粱, 响午→晌午, 帮撑儿→夹缝儿, 大碗儿→大腕儿).
- **Exclusions (fail-closed).** The full 2021 词语表 表一/表二 (18,442 entries; counts corroborated by htu.edu.cn, hrbust.edu.cn, scst.edu.cn, and a 江苏理工学院 executive notice) exists only in the copyrighted 语文出版社 volume; the only complete digital copies found are pirated scans (a 2004-edition book scan and a third-party Scribd upload), which were rejected on rights grounds — full-table ingestion is **held pending a school-supplied copy** under `school_provided_public_use`. Institutional mock-set collections were rejected on edition grounds: 苏州科技大学's 30套 is built on the pre-2021 30-topic C5 pool with undated scanned WeChat images, and 北京普通話學會's sample paper belongs to the 60-work pre-2021 outline. PolyU PSK booklets were rejected (different examination; explicit no-reproduction notice).
- **Parity.** `xyq-preview` `question_banks` re-replaced with corrected production: 2,771 rows, per-row md5 identical (C1 1,015 / C2 1,237 / C3 104 / C4 50 / C5 147 / C6 118 / C7 100), NULL metadata preserved on legacy C1/C2 rows.

This record documents content collection and provenance only; learner-facing results remain XiYouQuest practice estimates, never official PSC results.

### Full 2021 word-table ingestion (2026-08-27, school authorization recorded)

The user recorded the school's blanket authorization for the analyzed PSC-syllabus materials, closing the rights hold on the full word table:

- **Source.** A complete institutionally-hosted copy of the 2021 词语表 was located and edition-verified: `jcb.sdwm.edu.cn/info/1068/2661.htm` attachment "2024年新大纲普通话考试-单音节多音节完整注音版.pdf" (197 pages, numbered entries with tone-marked pinyin; mirrored at `yywzw.hxu.edu.cn/info/1153/1226.htm`), corroborated against the publisher's own flipbook preview (语文出版社, `ywcbs.com/app/pthspcs/`, whose page 39 states 收词语18442条 = 表一8361 + 表二10081 verbatim, and whose page-40 表一 preview matches entries #1–#96 exactly). Pirated book scans remained excluded.
- **Extraction & verification.** All 197 pages were transcribed by independent vision agents (local OCR was rejected: tone-mark accuracy failures). Stitching validated the printed continuous entry numbers: 表一 1–8361 and 表二 1–10081 complete, zero gaps, zero duplicate conflicts, zero pinyin-conversion failures after an apostrophe-gated syllable-segmentation rule repaired 113 n-g boundary mis-conversions (办公室-class) and two page-break pinyin orphans. An adversarial 8-page spot-check (752 entries re-transcribed by fresh agents) found exactly one tone-mark error (让步 rángbù→ràngbù), corrected; a corpus-wide per-character tone-consistency screen flagged 41 rare-reading entries, which are legitimate 多音字 readings retained as printed.
- **Ingestion.** Single-character entries → component 1, multi-character → component 2, each row carrying `table` (biao1/biao2), `entry_number`, and the `official_public_syllabus` source record for 普通话水平测试用普通话词语表（2021年版）; multi-readings joined with "/", erhua as r5, the ·-marked optionally-neutral syllables flagged. 2,095 existing rows were enriched and their pinyin aligned to the official table (149 legacy errors such as 澳 `yu4`→`ao4` and 邓 `shan1`→`deng4` corrected, previous value retained in `legacy_pinyin`); 16,347 rows inserted; 16 legacy rows not present in any official table were flagged `not_in_official_table` (11 are traditional/rare characters in C1).
- **Final state.** Production: C1 3,028 rows (3,017 table-sourced), C2 15,571 (15,566 sourced incl. the appendix tables), C3 104, C4 50 — every content row of C1–C4 now carries a source record. `xyq-preview` re-replaced: 19,118 rows, per-row md5 identical to production.

This record documents content collection and provenance only; learner-facing results remain XiYouQuest practice estimates, never official PSC results.

### Supplementary-bank source records — full coverage (2026-08-28)

The remaining banks were verified against their in-repo sources and stamped: C6 (118 pronunciation-drill rows) all match `doc/ExampleQuestions/C6.txt` and carry `xiyouquest_practice` records, with 70 rows cross-referenced to their 2021 word-table entries; C7 (100 polyphone context items) all match `doc/ExampleQuestions/C7.txt` with every stored answer agreeing with the file key, recorded as `xiyouquest_practice` (the Journey-to-the-West-themed sentences are XiYouQuest-authored — school provenance is deliberately not claimed); C5 (147 topic rows) split into 3 rows matching the official 50-topic collection (recorded under `psc-speaking-topics-2024-01-01`) and 144 supplementary practice topics. Every content row across C1–C7 now carries either a source record or an explicit `not_in_official_table` flag (16 legacy rows). `xyq-preview` re-synced: 19,118 rows, per-row md5 identical.

### C3 full-bank exam-format adjudication and official C5 topic completion (2026-08-28)

All 104 production C3 rows were adjudicated against the exam's own scoring bases,
led by the official 《普通话水平测试用普通话常见量词、名词搭配表》 (reproduction
with provenance recorded in `docs/sources/psc-liangci-mingci-dapeibiao.md`;
section structure 10/10/5 in 3 minutes verified against HKUST CLE's published
rules). Every decision passed a three-lens adversarial verification (dictionary
normativity / exam convention / omission hunting); only ≥2-lens survivors were
applied. Applied to production: 27 rows gained `metadata.acceptedAnswers`
(8 量词 dual-acceptances straight from the table's parenthetical cross-listings,
13 dual-standard sentence items, 2 词语判断 items pairing two Putonghua words,
plus the re-keyed row below and 3 structurally defective rows accepting all
standard options); 1 school key re-keyed with a recorded
`school_key_discrepancy` hold (他跳很好舞 → 他跳舞跳得很好 — ungrammatical school
key, same precedent as the two 2026-08-27 holds); 1 practice-variant distractor
repaired (他住上海 replaced by 他在住上海 to stop contradicting the school
original). Dictionary-plausible pairings absent from the official table
(项链＋串, 树＋株, 花＋枝, 路＋段, 毛巾＋块, 椅子＋张 and similar) were
deliberately **not** accepted — the table is the scoring authority. Every
change carries `accepted_answers_review.status = school_teacher_review_pending`;
the decision sheet for the teacher is `docs/PSC_C3_TEACHER_REVIEW_PACKET.md`.
In the same pass the C5 bank was completed to the full official 50-topic list
(47 missing topics inserted under `psc-speaking-topics-2024-01-01` records,
`official_topic_number` stamped; bank now 50 official + 144 practice topics),
and practice C3 sessions were aligned to the official 10/10/5 composition
(`QUIZ_SIZES`). 词语判断/语序 bank expansion is held pending the official
《普通话与方言词语对照表》/《语法差异对照表》 appendices; a 30-item 量词
expansion derived mechanically from the official table is staged behind its own
adversarial distractor check.

### Verified-source-only bank rebuild (2026-08-28)

The bank was rebuilt so that **every served row derives from a verified source**;
authored content is no longer part of the learner-facing bank. Final production
state: 19,734 rows with zero rows carrying `not_in_official_table` —
C1 3,017 · C2 15,566 · C3 336 · C4 50 · C5 50 · C6 450 · C7 265.

| Component | Was | Now | Basis |
| --- | --- | --- | --- |
| C6 | 118 authored drill words | 450 word-table entries (150 per contrast) | Words of the official 2021 词语表 carrying a 平翘舌 / 前后鼻音 / l–n contrast, each row stamped with its table and printed entry number |
| C7 | 100 authored JTW sentences | 265 items over 130 characters | Only characters whose **every** official reading is illustrated by an official word-table word: the character, its readings, and both example words all come from the 2021 词语表 |
| C3 量词 | 60 | 262 | 202 new items generated from 《量词、名词搭配表》 — key and accepted alternates copied from the table's cross-listings, distractors drawn from the 45 table quantifiers that pair with the noun nowhere in it. 17 generated items were dropped because 3+ of 5 options were officially correct (no discrimination) |
| C5 | 50 official + 144 authored | 50 official | The official 50-topic list is the entire exam pool |
| C1/C2 | 16 legacy rows outside the official tables | removed | — |
| C3 variants | 15 rows labelled `xiyouquest_practice` | relabelled `school_derived_correction` | Answer taken from the school item; only the distractors were rewritten, so provenance is now stated honestly rather than implied |

All 378 removed rows are preserved in
[`docs/sources/archived-unverified-rows-2026-08-28.json`](sources/archived-unverified-rows-2026-08-28.json)
(423 rows, a superset) — the rebuild is reversible.

**Two defects found and fixed in the same pass.** (1) Nine C2 rows carried
pinyin corrupted by apostrophe-boundary segmentation damage (`不安` stored as
`bua4 n5`, likewise 图案/治安/彼岸/激昂/立案/提案/议案/预案); each was
reconstructed from the official 表一/表二 monosyllable entries for its two
characters, with the corrupted string's own preserved initial and tone as
corroboration, and carries a `pinyin_repair` record. (2) The C6 and C7 pages
read their banks through capped `.limit()` calls (200 and 100) that the rebuilt
banks now exceed — the same physical-row-order truncation the 2026-08-27 RPC
work fixed for C1/C2. Both now use a new `fetchQuestionSampleWithMetadata()`
helper over the same `sample_question_bank` RPC, covered by two regression
tests. The in-code fallback content for C6 and C7 was likewise replaced with
word-table-sourced entries, so even the no-database path serves verified
material.

Verification: `tsc --noEmit` clean; `npx vitest run` 278 passed / 2 skipped;
`npm run build` succeeded; each page's real query path was exercised against
production and yields well-formed sessions (C3 10/10/5, C6 10 per contrast,
C7 15 items, no malformed rows); production↔`xyq-preview` full-table md5 parity
PASS at 19,734 rows.

Dev-server check: `npm run dev` compiles and serves this app cleanly (sign-in
page renders, no compile or server errors). An earlier note in this record
claimed a `genericOAuthClient` / better-auth compile failure here; that was a
**misattribution** and is withdrawn. The failure came from a different project
(`Meli/frontend`) whose dev server was occupying port 3000 — its own
`src/lib/auth-client.ts` imported `genericOAuthClient` against better-auth
1.7.2, where that export no longer exists. XiYouQuest's own dependency is
better-auth 1.6.23, which does export it. Note for future browser QA: this app
defaults to port 3000 because only prod, `cle-xyq-dev`, and `localhost:3000`
are registered OIDC redirect URIs, so a signed-in check requires port 3000 to
be free. Practice pages themselves remain behind HKUST SSO, so rendering them
needs an interactive sign-in.

### Signed-in production check, and a live code/data mismatch (2026-08-29)

Verified on the deployed app (`cle-xyq.hkust.edu.hk`) with a signed-in account.
The rebuilt bank **is** live — C6 serves word-table entries (充塞/渣滓/政策/思潮/
身材), C7 serves the new item shape (`花**岗**岩` with options gāng/gǎng,
correctly keyed, the `**…**` marker rendering as a highlighted character), and
C3 serves the school-supplied items.

**But the production build predates this work, so the database was rebuilt
while the code that reads it was not deployed.** Observed consequences:

| Surface | Deployed behaviour | After deploying the current branch |
| --- | --- | --- |
| C6 pinyin hint | `—` for every word (confirmed on all five words of group 1) | the row's official reading |
| C6 pool | first 200 rows of 450 by physical order; the `ln` contrast sits past the cap | all 450, sampled |
| C7 pool | first 100 rows of 265 | all 265, sampled |
| C3 session | 15 questions (5/5/5) | 25 (10/10/5, the official structure) |

The C6 pinyin gap is a **regression introduced by the rebuild**: the previous
118 drill words were all present in the bundled static pinyin map, and the
word-table words that replaced them are not. The code fix landed in 64eca7e and
the read fixes in c7f7377/66afecc, so deploying the current branch closes all
four rows above. Until then the deployed app degrades exactly as tabulated.
Deployment is not performed from here — it needs the `xyq` Vercel access
recorded in the release holds.

### Campaign question repair and C3 expansion from the official grammar table (2026-08-29)

**The campaign carried the same defect the teacher first reported.** `src/lib/quest/stage-questions.ts`
holds its own hardcoded question set, so the C3 adjudication never reached it. An
audit of all 215 quest MCQs against the same bases found three defect classes:

1. **24 items with more than one correct answer** — measure-word items checked
   against the official 量词、名词搭配表 (一（ ）墙 accepts 面 and 道; 一（ ）耳朵
   只 and 对; 一（ ）猪 头 and 口), and sentence items aligned with the C3 bank so
   the campaign and practice can no longer disagree about the same item.
2. **19 items whose distractors are themselves standard Putonghua.** The stem asks
   which option *is* standard Putonghua, so any official-table entry among the
   options is a correct answer. 开心/快乐/高兴/欢喜 and 想念/想/思念/惦记 had **no
   wrong option at all**. Detection rule: a distractor present in the official 2021
   词语表 disqualifies the item. (The converse does not hold — absence from the
   table does not prove non-standard, since the table is a syllabus list, not a
   dictionary; several distractors had to be rejected on 现汉 grounds instead.)
3. **Items with no Cantonese contrast.** For this app's Cantonese-speaking users,
   开心 干净 舒服 客厅 学校 老师 馒头 着急 are the same words in Cantonese, so the
   item taught nothing even once repaired. Five were rebased onto concepts that do
   differ (上学/返学, 生气/嬲, 空调/冷气机, 冰箱/雪柜, 电梯/升降机) and three with no
   clean contrast were deleted. The 12 duplicated items were replaced with fresh
   single-answer measure-word items from the official table rather than dropped.

Final: 211 MCQs, zero items with an unaccepted correct answer, zero duplicates.

**C3 bank expanded from 336 to 488 rows.** A research pass recovered the official
《普通话水平测试用普通话与方言常见语法差异对照表》 (34 类, 208 answer-keyed groups),
cross-verified character-for-character across two independent mirrors and stored
at `docs/sources/official-grammar-contrast-table.md` with full provenance. Its own
notation marks the standard option with `*` and dialect options with `方`, and it
marks several groups with two correct answers (`a*b*`) — the official table itself
sanctions multi-answer items. 143 items were generated from it, 11 of them
officially multi-answer; groups with relational keys (`a≠b*`, `a＝b方`) were skipped
rather than guessed.

A post-insertion quality pass then removed 4 more. Every generated item was
re-checked against the source: all option texts matched the table verbatim and
every accepted-answer set matched the official `*` markings exactly, and no
sentence is treated as correct in one item and wrong in another. But three items
carried the source's *template* notation, where a parenthetical lists
interchangeable verbs (`我说（比、打、跑）得过他。`) — readable in a printed table,
not as an answer option — and one option contained the single doubled character
in the whole 899-line transcription (`他们扫没没干净。`), evidently a web-transcription
typo. Its intended form could not be confirmed against a print copy, so the item
was dropped rather than repaired by guess. Sentence-order rows: 39 → 178.

Word-choice grew only 35 → 44, deliberately. The companion
《普通话与方言词语对照表》 (949 entries) could **not** be retrieved — every mainland
host was unreachable from this network — so items were hand-drafted instead and
sent for external attestation. That check refuted most of them: of 69 proposed
Cantonese distractors, 26 were fabrications, 8 were the same word twice, and 11
had the wrong meaning. Only the 9 items whose distractors are attested in 粵典
words.hk / Wiktionary were inserted. The remaining gap is recorded as a hold: the
词语判断 sub-part has no authoritative source until that table is obtained.

Verification: `tsc --noEmit` clean; 278 tests pass; production build succeeds;
C3 exercised through its real RPC path (484 rows, 10/10/5 satisfiable, zero
malformed rows, zero duplicate option sets, 119 rows carrying acceptedAnswers);
production↔`xyq-preview` full-table md5 parity at 19,882 rows.

**Edition caveat — traced to the issuing body, and stamped on every affected row.**
The recovered grammar table has 34 categories. The official interpretive bulletin
新版《普通话水平测试实施纲要》解读, bylined 国家语委普通话与文字应用培训测试中心 — the
body that compiles and publishes the 纲要 — states the change directly:

> "普通话水平测试用普通话与方言常见语法差异对照表"部分…总类别由34个调整为35个；根据情况对
> 部分例句作了修改、增补和删除。从搭配的规范度、常用性等方面对普通话水平测试用普通话常见量词
> 名词搭配表进行梳理调整。

Recovered from three independently-hosted university language-office mirrors
(东北石油大学, 陕西师范大学 — which carries the byline and 2023-08-30 date, and
上海商学院), all mainland-unreachable directly and fetched through Wayback, and read
against each other word for word. The full provenance sits in
`docs/sources/official-grammar-contrast-table.md` §5.

Three consequences, handled rather than hidden:

- The 139 grammar items carry `source_version: psc-shishigangyao-appendix-pre2024`
  and an `edition_caveat` block. The dialect contrast each teaches is unaffected;
  verbatim agreement with the current printing is not claimed.
- **The same bulletin says the 量词、名词搭配表 was also "梳理调整" for normativity
  and frequency.** An earlier note here inferred that our copy was current because
  its 45-quantifier count matches what HK sources give for the current edition —
  that inference is too weak, since the count can hold while pairings change. All
  232 measure-word items are now stamped with that uncertainty too.
- The name and examples of the added 35th category remain unknown. It was not
  guessed at.

Obtaining the in-force appendices is a known gap. Every mainland host times out
from this network; a Google-Translate proxy was found to reach some of them but
only serves what an anonymous visitor sees, so paywalled document mirrors stay
closed.

**Retrieval closed — do not repeat this search.** A second, direct attempt to obtain
《普通话水平测试用普通话与方言词语对照表》 exhausted the remaining paths:

- `pthxx.cn` — the host that yielded the grammar table — was enumerated completely
  through the Wayback CDX index (524 captures). Its appendix directory
  `/zc/xxzl/2019-08-04/` holds exactly: 1110 必读轻声词语表 · 1113–1116 语法差异对照表
  (四/三/二/一) · 1117 最容易读错的地名 · 1118 最容易读错的姓氏 · 1119 容易写错的字 ·
  1120 测试中容易读错字词汇总 · 1121 汉语拼音方案 · 1536 汉字部首表. **The vocabulary
  comparison table is not among them**, and the site's own navigation offers only
  词语表一/二, 轻声, 儿化 — the different appendices already ingested.
- `1113.html` (语法差异对照表（四）) has **no Wayback capture at all** ("has not archived
  that URL"), so the 34-vs-35 category question cannot be settled from the archive.
- `ywcbs.com` (语文出版社, publisher of the 实施纲要 itself) has zero captures for its
  flipbook path and the host TCP-times-out, as does every other mainland host tried.

The 词语判断 sub-part therefore has no authoritative source available from here.
Closing it needs a copy from the school (print or scan) or a China-routed fetch;
until then word-choice items stay at the 44 externally-attested rows and must not
be expanded by authoring.

### C6 l/n drill rebuilt as a real contrast set (2026-08-30)

The rebuilt C6 bank was checked category by category for whether its words
actually carry the contrast they claim. 平翘舌 and 前后鼻音 were sound — 150 of
150 words in each carry both members of their pair. **边音鼻音 (l/n) was not**:
of its 150 words, 108 were l-only (来临 lái lín, 劳力 láo lì, 力量 lì liàng), only
13 were n-only, and 29 carried both. A Cantonese speaker drilling the n→l merger
was therefore mostly reading the sound they already produce.

Rebuilt from the official word table with an explicit composition: all 30
two-syllable entries carrying both sounds, then an even 60/60 split of
n-initial and l-initial words, drawn spread across the table's entry numbers
rather than clustered at its start. Each row records its `contrast` class, so
the mix is auditable rather than incidental. C6 stays at 450 rows.

Verified: no duplicates, every word Han-only, pinyin syllable count matches
character count on all 450, every row renders a pinyin hint (0 falling back to
an em dash), production↔`xyq-preview` md5 parity at 19,882 rows.

### C7 expanded, and an ambiguity class caught in already-shipped rows (2026-08-30)

The first C7 pass only accepted characters where **every** official reading had
an official example word, which silently excluded the most valuable polyphones —
差 (5 readings), 行, 和, 恶, 种, 称, 参, 薄, 炮, 膀 — because one rare reading had
no word. Relaxing the rule to "at least two readings illustrated" and indexing the
appendix rows as well as the word table yielded 18 more characters.

Building them surfaced a defect class the first pass had not tested for: **an
example word can itself carry two official readings at the target position.**
公差 is both gōngchā and gōngchāi in the official table, so an item asking for
the reading of 差 in 公差 has two correct answers — the very defect first
reported. A mechanical check over all 53 such (word, position) pairs in the
official table found 3 in the new batch and, more importantly, **6 already
live**: 登场 (chǎng/cháng), 杆子 (gān/gǎn) ×2, 供养 (gōng/gòng) ×2, 受累
(léi/lèi). All 7 prompts were removed.

C7 is now 294 rows over 146 characters. One row is a deliberate exception:
`**济济**` marks the whole word because the target character occurs twice with
the same reading, recorded in its `display_note`.

Verified: zero structural defects (option/key/marker/explanation agreement),
zero duplicate prompts, zero remaining ambiguous example words;
production↔`xyq-preview` md5 parity at 19,911 rows.

### Bank maximised against the sources we hold (2026-08-30)

With the official appendices exhausted for C3, the remaining headroom was in the
word table, which C6 and C7 draw from directly.

- **C6: 450 → 896.** Each contrast set taken to ~300 from the official word
  table, keeping the composition rules: 平翘舌 and 前后鼻音 words must carry both
  members of the pair; 边音鼻音 keeps all 30 official words carrying both sounds
  plus an even n-initial / l-initial split. Selection is spread across the
  table's entry numbers rather than clustered at its front. Four words qualified
  for two categories at once and were de-duplicated. Session depth goes from 15
  to roughly 30 distinct sessions.
- **C3 measure word: 262 → 274.** The official quantifier table's last 12
  multi-character nouns, each a multi-quantifier entry, so each item shows two of
  its officially cross-listed quantifiers (both accepted) against three the table
  pairs with it nowhere. The official table's nouns are now fully covered apart
  from single-character entries (书, 布, 牛, 驴) and 香, which is ambiguous
  standing alone.

Verified: C6 896 rows, zero duplicates, all Han-only, pinyin syllable count
matches character count throughout, every row renders a pinyin hint, and each
category still fills a 10-word session; C3 496 rows with zero measure-word items
carrying an unaccepted official answer and zero duplicate prompts;
production↔`xyq-preview` md5 parity at 20,369 rows.

### The vocabulary comparison table: search closed as a confirmed negative (2026-08-30)

《普通话水平测试用普通话与方言词语对照表》 (949 entries, p.253 of the official guide)
is the sole authoritative basis for the 词语判断 sub-part, and it is why C3
word-choice stands at 44 items while measure-word and sentence-order run to 274
and 178. Two search passes have now closed, and the negative is a checked one
rather than an abandoned attempt:

- `pthxx.cn/zc/xxzl/` — the folder that yielded the grammar table — was
  **completely enumerated** via CDX: 11 URLs, every one fetched and read. It holds
  the neutral-tone table, the grammar table's three parts, and assorted reading
  aids. The vocabulary table is not among them.
- The blogger who mirrored the grammar table was identified (`c007525`, uid
  1630402205) and their post catalogue walked across four categories, roughly 200
  posts, including chasing the prev/next chain out from the grammar-table posts
  themselves. No match.
- `mandarin.edu.hk`'s CMS post index was **fully enumerated** (49 posts, ids 1–60).
  HKUST's own PSC page cites all the appendix tables by name and count but
  reproduces none of their bodies.
- `doc.quark.cn` and `ywcbs.com`, the two strongest prior leads, return HTTP 523
  **even to archive.org's own crawler**, so they are down or geofenced at origin
  rather than merely unreachable from here.

Paths not yet tried, and the only ones left: Cloudflare-gated document mirrors
(scribd, wenku.baidu, docin) and the CNKI / 万方 academic databases, all of which
need either a different network route or paid access. A photo or scan of pp.253ff
from a print copy would settle it immediately — the grammar table was parsed
straight out of its printed notation, and the same pipeline is ready for this one.

Until then, word-choice stays at 44 by choice. The alternative was authoring
dialect distractors, and when that was attempted the external attestation pass
refuted 26 of 69 proposed Cantonese words as fabrications. Shipping invented
vocabulary to learners is worse than a small sub-bank.

## Asset-use traceability

This snapshot introduces no new static asset. School-provided materials remain curriculum evidence only; they must not be repurposed as image, audio, passage, exercise, answer-key, or generated-scene input.

| Asset class | XiYouQuest location or implementation | Observed inventory / declared origin | Release boundary |
| --- | --- | --- | --- |
| Static visual | `public/img` | 94 files; the project README declares NovelAI and Google Nano Banana use. | This is a provenance declaration, not an asset-rights or publication approval. Record provenance and approved use before releasing any newly added or changed static visual. |
| Static audio | `public/audio` | 12 files; the project README calls these original Suno AI tracks. | This is a provenance declaration, not an asset-rights or publication approval. Record provenance and approved use before releasing any newly added or changed static audio. |
| Practice and story content | `public/stageQuestion` (7 files), `public/storyline` (1 file), and `public/img/passage` (30 files) | Existing repository content, not an import of school curriculum. | Do not equate the repository corpus with a LANG curriculum or use it to close teacher-review/source-scope holds. |
| Dynamic companion scenes | `src/app/api/chat/generate-image/route.ts`, `supabase/functions/chat-generate-image/index.ts`, and their shared image clients | The client sends only `sessionId`; the server resolves the character and scenario. The model receives no chat message content, ASR audio, or ASR transcript. | Generated output cannot decide asset rights, publication, or course approval. Provider errors are logged generically. |

## Implemented controls

| Workstream | Implemented evidence | Result |
| --- | --- | --- |
| XQ-01 Erhua | `src/lib/iflytek-speech/client.ts` and `erhua.test.ts` normalize valid erhua endings without changing words such as `女儿`, `婴儿`, and `儿童`. | Verified by unit tests |
| XQ-02 Accepted answers | `src/lib/quiz-answers.ts` stores the versioned `xiyouquest-accepted-answers-v1` XiYouQuest-practice bundle and permits only strict punctuation/whitespace normalization. Its two configured variants are explicitly `school_teacher_review_pending`; the shared helper is therefore named `withConfiguredAcceptedAnswers`, not teacher-approved. Component 3 fallback questions receive those variants through that helper rather than storing duplicate acceptance rules. No semantic matching or school-content import is used. | Unit tests and cross-route TypeScript build verified; the school teacher decision for any learner-facing use remains a release hold. |
| XQ-03 Reading aloud | `src/lib/psc/reading-scope.ts` controls reading scope, including bracket removal and first-400-Han-character selection. `src/lib/psc/reading-passage-source.ts` permits the school-provided label only when source scope, title, and version are all recorded; fallback and incomplete records remain XiYouQuest practice. `reading-session.test.tsx` renders both labels on the selectable Component 4 passage card and verifies that the school-provided label remains visible after selection in the active reading task. | Source and rendered interaction tests verified. The authenticated production catalog observed on 2026-08-22 did not display a visible school-provided source label, so it is not provenance evidence; verify the label on the exact candidate release. |
| XQ-04 Open speaking | Node and Edge C5 assessment routes label output as a PSC-aligned practice estimate, validate structured feedback, derive duration only from the XiYouQuest PCM WAV payload, and fail unavailable rather than inventing a result. Multi-chunk ISE succeeds only when **every** chunk succeeds; a partial result is rejected. The standalone C5 page, Learning Path mini-exam, Learning Path shared-recorder drill, and mock exam enforce the 180-second candidate limit before server validation; the Learning Path drill binds `maxDurationSeconds={180}` to the reusable recorder. The current candidate also makes the Supabase Edge iFlytek transport use the same tested protocol-frame generator as the Node path. | The current boundary-contract suite passed 9 files / 47 tests, covering standalone C5, the shared recorder cutoff and cleanup, C4 source handling, C5 request/scoring boundaries, and ASR transport frames. One controlled production microphone/ASR attempt on the old deployment rendered a practice result after manual stop, but recording remained active past 180 seconds; candidate-preview verification is still required. The learner surface cannot establish whether Node or Edge handled the assessment. |
| XQ-05 Topic collection | `src/lib/psc/official-speaking-topics.ts` pins `psc-speaking-topics-2024-01-01` to the public source, supplies the controlled 50-topic two-choice collection, and keeps supplementary topics separate. The Component 5 official-bank selector renders that exact version and effective date; it never shows the official collection metadata for supplementary practice. | Public source and unit tests verified; candidate-render verification remains required |
| XQ-06 Main Quest | The measured `quest_progress` query throws on an error instead of being represented as an empty quest state. Next's error boundary then shows a generic retry action, while diagnostics retain only the framework digest. | Source audit plus telemetry success/failure and retry/error interaction tests verified; signed-in candidate recovery remains required. |
| XQ-07 Characters | Any failure among catalog, learner-character, profile, or quest-progress reads throws instead of rendering incomplete companion data. The page error boundary provides a generic retry, and a broken portrait is replaced by a named visual fallback. | Source audit plus telemetry success/failure, retry/error, and broken-portrait interaction tests verified; signed-in candidate recovery remains required. |

## AI, ASR, and privacy contract

| Control | Enforced behavior |
| --- | --- |
| Application model route | Standard C5 analysis makes one `deepseek/deepseek-v4-flash` request plus at most three exponential-backoff retries, then one `google/gemini-2.5-flash` fallback attempt; the lightweight completion path makes two primary attempts, then one fallback. Node and Edge enforce the same route. A failed chain is unavailable, and a Vercel dashboard promotion does not alter this source contract. |
| Model contribution and final estimate | The C5 model receives only the selected topic and current ASR transcript, then must return the exact five-key schema. Its levels contribute only bounded vocabulary and ISE-unavailable fluency deductions. XiYouQuest derives validated WAV duration, applies the deterministic shortfall band, composes the bounded 0–30/0–100 score, and labels it `psc_aligned_practice_estimate` / `psc-practice-c5-v1`; the model cannot emit or decide a final score, duration, band, pass/fail, or official-looking result. |
| C5 output | Requires an exact five-key, non-array object, levels exactly `1`, `2`, or `3`, and nonempty bounded feedback fields. Missing or unexpected fields, unofficial-score narrative, and surrounding prose/Markdown are rejected. |
| C5 request boundary | Both active C5 runtimes accept only the XiYouQuest recorder's 16 kHz, mono, 16-bit PCM WAV shape; derive the score duration from its exact payload length; cap the scoring duration at 180 seconds; reject recordings longer than the one-second stop-scheduling tolerance; and accept only the pinned official topic bank or separately controlled supplementary database topics. Browser-supplied duration fields are not accepted. |
| Failure behavior | ASR failure, unavailable model, malformed model output, any unavailable ISE chunk, or failed assessment returns an unavailable/retryable result. It does not generate a default score, XP, persisted assessment, or learning plan. |
| Learner boundary | UI and payload label C5 as `psc_aligned_practice_estimate`, not an official PSC result. |
| Logging | C5 transport logs only operational status, duration/chunk metadata, and transcript character count; final numeric learner scores are not emitted to C5 logs. Failure logs avoid raw transcripts, raw provider errors, parsed response bodies, and raw thrown client errors. C5, Main Quest, and Characters recovery diagnostics retain only stable availability/status or framework-digest metadata. |
| Shared AI-client logs | Node and Edge shared AI clients record model/status/length metadata only. They do not put raw provider response bodies, raw model responses, or caught provider errors into logs. |
| C4/C5 client-flow boundary | C4 scopes each database or fallback passage before rendering and uses that same scoped text as its ASR reference. It displays **school-provided practice source** only when metadata contains `source_scope=school_provided_public_use`, `source_title`, and `source_version`; all fallback or incomplete records are visibly XiYouQuest practice, not official PSC reading texts. C5 defaults to the controlled 50-topic official bank, exposes supplementary topics only through the explicit `bank=supplementary` selection, presents exactly two choices, and the candidate automatically ends client recording at 180 seconds. Both C5 server runtimes validate the final PCM WAV and derive the score duration rather than trusting client time, then apply the deterministic shortfall bands `160–179=1`, `140–159=2`, `120–139=3`, `90–119=4`, `60–89=5`, `31–59=6`, and `≤30=component 0`, while the result remains a PSC-aligned practice estimate rather than an official PSC claim. The optional character-feedback request receives a topic, score, and duration but no raw ASR transcript. The deployed production observation on 2026-08-22 did not satisfy two of these assertions: the C4 catalog had no visible school-provenance label and C5 continued past 180 seconds until manually stopped. This record does not treat that old deployment as satisfying the candidate controls. |
| Generated-scene boundary | Companion-scene image generation accepts only the session ID at its public boundary. Node and Edge routes resolve character/scenario metadata server-side, reject extra client keys, send no conversation text/audio/transcript to the image model, and avoid raw provider-error logging. |
| Model authority | Practice feedback only. No PSC authority, official scoring, certification/eligibility, asset-use, publication, or learner-policy decision authority. |
| Practice-band boundary | Mock-exam and learning-path results use the versioned `xiyouquest-practice-band-v1` product scale (`Mastery` through `Starting point`). New mock-exam results store a product band in the existing legacy database column, and learner-visible results explicitly say that they are not official PSC results. Historical rows may retain legacy values, but the learner UI ignores them and re-renders the product band from the numeric practice score. |
| Mock-exam scoring contract | New formal-mock results are accepted only under the current `psc-2021-v2` five-component C1-C5 contract: the save route's Zod boundary requires that exact version at both result and component level, rejects historical `psc-2021-v1` and `legacy-five-component-v1` writes with `400` before any insert, and recomputes points, total, and practice band from the server-owned contract rather than trusting client allocations. Historical versions remain read-only via `inferHistoricalMockExamContract` for display of existing rows. The submitted `totalXp` is bounded by a server-derived ceiling computed from the normalized component scores through the shared XP rules; a value above it is rejected with `400` before insertion, while lower values persist unchanged because failed assessments legitimately award less. |
| Mock-exam AI data minimisation | The mock-exam coach receives component score summaries and C5 metric/notes only. The raw C5 transcript is no longer sent by the client and is rejected by both strict Node and Edge C5-detail schemas. Both coach and insights prompts prohibit official-result, grade, certification, eligibility, and policy claims. |
| C5 result-data lifecycle | Direct C5 and mock-exam learner-result transcripts exist in current React result state only; their database writes send aggregate progress/score metadata, not transcript or audio. `progressUpdateSchema` plus mock-exam insert/patch schemas are strict, so unexpected transcript/audio fields return `400` rather than being silently stripped. Direct C5 retry/topic reset clears its current analysis state. This source-level control does not establish provider-side retention; that requires an external contract plus candidate-deployment evidence. |

## Service-integrity evidence

| Control | Source-level evidence | Runtime boundary evidence | Remaining limit |
| --- | --- | --- | --- |
| Institutional sign-in | `src/lib/auth.ts` disables email/password and social sign-in, verifies the Entra `id_token` with pinned HKUST tenant issuers, an expected audience, and `RS256`, then requires `@ust.hk` or `@connect.ust.hk` on every sign-in. | One controlled HKUST sign-in reached the learner dashboard on 2026-08-22; no credentials were inspected. | This does not establish all role, redirect, or account-isolation behavior. |
| Request gate | `src/proxy.ts` keeps only `/`, `/login`, and `/api/auth/*` public and returns JSON `401` for unauthenticated API requests. `src/proxy.test.ts` verifies that a protected API request is rejected, the HKUST OIDC callback stays reachable, an unauthenticated page redirects to login, and an authenticated login request redirects to the dashboard. | The three public API probes, including a fresh `/api/quest/progress` probe on 2026-08-22, matched that `401` contract and retained HSTS, frame-deny, nosniff, referrer, and permissions-policy headers. The controlled sign-in reached the learner dashboard. | Authenticated role variants and redirect behavior remain untested on production. |
| Learner data scoping | `src/lib/supabase/server.ts` verifies the Better Auth session before selecting the service-role client; the focused `server.test.ts` regression proves a verified session receives the service-role key and no session receives only the anon key. A source audit found all 34 API handlers and 20 authenticated server-page/action files that import this client also reference `getSessionUser`. Learner routes either scope directly by verified `user.id`, or first prove ownership of the parent plan/session and only then access its child nodes, checkpoints, or messages. The six service-role Edge functions verify a signed `ES256` Better Auth token with pinned issuer/audience before use; their learner-owned chat/plan records use the verified user ID or an owned parent session. The one Edge admin client is limited to a user-ID-prefixed chat-image storage key after session ownership verification. | No cross-account or signed-in persistence probe was run. | The focused test proves client-key selection, not row-level isolation. Service-role access makes the reviewed per-route user-id scopes a release-critical regression boundary. Keep an authenticated isolation probe in the release test. |
| Runtime visibility | `@vercel/analytics` is mounted in `src/app/layout.tsx`; `src/lib/server/load-metrics.ts` records query success/failure and duration without query payloads. Its regression test verifies success and error metrics include duration and the error code, but never the error message or query payload. | Public HTTP probes and GitHub deployment status are observable. | Dashboard/runtime-log/alert configuration cannot be verified without the correct Vercel `xyq` scope. |

The Node fallback route and the active Supabase Edge Function use the same fail-closed assessment contract. A source audit confirms that each independently validates exact 16 kHz, mono, 16-bit PCM WAV structure, derives duration from the submitted payload, permits only a one-second scheduling tolerance beyond the three-minute limit, and checks the controlled-topic boundary. Only an authorized candidate-deployment observation can establish which runtime served a learner request.

## Automated and rendered verification

| Gate | Result |
| --- | --- |
| Exact candidate source review (2026-08-22) | Review range `60ce12504b9f28f22f72d1b9ab8b86b7cc625fb1..2a46a9e63d939c8c449cd6cc9d10f601b8e4cbc4`: **CLEAR / APPROVE**, no critical, high, medium, or low findings. `git diff --check`, focused Component 5 regression tests (2 passed), and `npx tsc --noEmit --incremental false` passed. |
| Formal-mock delta review and full gates (2026-08-24) | Delta review `86fa6f3..4bd97bd`: **CLEAR / APPROVE**. All three outstanding REQUEST_CHANGES blockers verified resolved at the tip: the save route now accepts only `psc-2021-v2` via `z.literal` at both result and component level with parametrized negative tests proving `400` and no insert for both historical versions; the learning-path mini-exam labels now match the recorded XiYouQuest component identity end-to-end; "Grading Your Exam" is replaced by formative practice wording; the `as ExamMode` escape hatch and unreachable legacy branches are removed. The current C1-C5 contract (weights 10/20/10/30/30, timings 210/150/180/240/180 s) was verified identical across the Next contract module, both Next Zod boundaries, the Supabase Edge shared contract and function, `docs/PSC_XIYOUQUEST_FORMAL_MAPPING.md`, and README. Gates on the tip: `npm test -- --run` **40 files / 255 tests passed** (2 intentional live-ASR skips), `npx tsc --noEmit` clean, `npm run lint` 0 errors (6 pre-existing warnings), `npm run build` passed, `git diff --check 86fa6f3 4bd97bd` passed. Both follow-ups recorded in `.omo/evidence/xiyouquest-4bd97bd-delta-review.md` (cross-runtime `COMPONENT_LABELS` parity test; `totalXp` bounding on the save route) were subsequently closed by `74ce9c3` and `3dce479` — see the hardening row below. |
| Post-review hardening commits (2026-08-24) | `74ce9c3` adds a mutation-verified parity test for the duplicated curriculum `COMPONENT_LABELS` map (Next `src/lib/gemini/client.ts` vs Deno `supabase/functions/_shared/ai-client.ts`, compared as extracted source because the Deno module is not Vitest-importable): exact C1–C7 coverage, each label's C-number matching its key, C1–C5 Chinese descriptions anchored to the mock-exam contract's `chineseName` (catches a mis-description even when both copies drift together — the class of the pre-`4bd97bd` Edge C3/C4 swap), and deep equality between copies. `3dce479` closes the `totalXp` gap on the current-contract save path: the route rejects any submitted `totalXp` above a ceiling derived from the normalized component scores through the shared `calculateXP` rules (`src/lib/psc/mock-exam-xp.ts`), verified against all four exam-runner XP call sites so no legitimate submission is rejected; at-ceiling and above-ceiling route regressions added. Gates on tip `3dce479`: `npm test -- --run` **262 passed** (2 intentional live-ASR skips), `npx tsc --noEmit` clean, `npm run lint` 0 errors (the six pre-existing warnings, duplicated only by leftover QA worktrees under `.claude/worktrees/`, which are not part of the candidate), `npm run build` passed, `git diff --check 4bd97bd 3dce479` passed. |
| C4/C5 frontend–backend boundary-contract suite (2026-08-22) | `npx vitest run` over ASR streaming protocol, C5 assessment, standalone C5, shared recorder, C4 reading, C4 provenance, audio validation, C5 analysis, and C5 scoring passed: **9 files, 47 tests**. The expected mocked C4 progress-save error exercised retry behavior; it is not a runtime failure. |
| Current candidate full validation | `npm test` passed: **240 tests, 2 intentional live-ASR skips**. `npx tsc --noEmit`, `npm run lint` (0 errors; six pre-existing warnings outside the candidate), `npm run build` (63 pages), and `git diff --check` passed. |
| Current XQ integrity audit (2026-08-22) | `npx vitest run` over XQ-01 erhua, XQ-02 accepted answers, XQ-03 reading provenance, XQ-04 C5 assessment and speaking interaction, XQ-05 topic/assessment contract, XQ-06 Main Quest recovery, XQ-07 Characters/portrait recovery, course-rollout controls, and ASR protocol passed: **10 files, 33 tests**. `git diff --check` passed. | Confirms repository-local control coverage; it does not replace signed-in candidate deployment evidence, Edge-runtime observation, teacher decisions, or a rollback artifact. |
| Current local protected-route check (2026-08-22) | An isolated `npm run dev -- --port 3002` session rendered the login surface from `/`; unauthenticated direct `/component-4` and `/component-5` checks redirected to `/login`. No HKUST sign-in, microphone request, or learner-data creation occurred; the temporary server was stopped. |
| `git diff --check` | Passed |
| `npm run lint` | Passed with no errors. Four pre-existing warnings remain in Companion Chat, Learning Path, and Battle Screen. |
| `npm run test -- --run` | Passed on the current XiYouQuest tree: 32 test files, 212 tests. The AI retry messages in the test output are intentional mocked failure-path coverage; no live provider request is made. |
| C5 client automatic-stop regression | `npx vitest run src/app/(main)/component-5/speaking-session.test.tsx src/components/practice/__tests__/audio-recorder.test.tsx` passed: 2 files, 5 tests. With fake media and timers, it proves the standalone C5 page and the shared recorder each stop at exactly 180 seconds, stop their stream tracks, submit assessment, and render the fail-closed unavailable state for a mocked `503` response. The Learning Path speaking drill binds that tested reusable cutoff to 180 seconds. |
| C5 timing regression test | `npm run test -- --run src/lib/scoring/c5-scoring.test.ts` passed: 15 tests covering each implemented duration boundary and the zero-score outcome at 30 seconds. |
| Targeted regression tests | `npm run test -- --run src/lib/validations.test.ts src/lib/psc/official-speaking-topics.test.ts src/lib/scoring/c5-scoring.test.ts` passed: 3 files, 19 tests. This includes strict rejection of a conversation payload at the generated-scene request boundary. |
| AI privacy and C5 regression tests | `npm run test -- --run src/lib/gemini/c5-analysis.test.ts src/lib/scoring/c5-scoring.test.ts src/lib/validations.test.ts` passed: 3 files, 18 tests. It verifies strict C5 structured-output parsing, fail-closed C5 scoring, and strict scene-image input validation. |
| Practice-band and source-boundary regression tests | `npm run test -- --run src/lib/psc/practice-band.test.ts src/lib/psc/official-speaking-topics.test.ts src/lib/gemini/c5-analysis.test.ts src/lib/scoring/c5-scoring.test.ts src/lib/validations.test.ts` passed: 5 files, 22 tests. It verifies product practice-band thresholds alongside the existing official-topic, C5, and input-validation boundaries. |
| C4 provenance source and rendered-task tests | `npx vitest run src/app/(main)/component-4/reading-session.test.tsx src/lib/psc/reading-passage-source.test.ts` passed: 2 files, 5 tests. It verifies that only a complete school-provided source record gets the school-provided label, that both labels render on the selectable Component 4 passage card, and that the school-provided label remains visible in the active reading task after selection. |
| Focused privacy-regression validation | `npx vitest run src/lib/gemini/c5-analysis.test.ts src/lib/scoring/c5-scoring.test.ts src/lib/validations.test.ts` passed: 3 files, 18 tests. Focused lint passed for the changed C5, recovery-boundary, and Node/Edge AI-client files; `git diff --check` passed. |
| Exact C5 response-schema regression | `npx vitest run src/lib/gemini/c5-analysis.test.ts src/lib/scoring/c5-scoring.test.ts src/lib/validations.test.ts` passed: 3 files, 19 tests. It rejects unexpected model fields, including `officialScore`, plus narrative surrounding otherwise-valid JSON; focused lint, exact Node/Edge parser parity, and `git diff --check` passed. |
| C5 server-duration and topic-bank regression | `npx vitest run src/lib/audio-utils.test.ts src/lib/psc/official-speaking-topics.test.ts src/lib/gemini/c5-analysis.test.ts src/lib/scoring/c5-scoring.test.ts src/lib/validations.test.ts` passed: 5 files, 25 tests. It verifies identical Node/Edge PCM-duration derivation, malformed-audio rejection, Edge/application official-topic-bank parity, and the existing C5 schema/scoring controls. The C5 request callers no longer append a browser duration field. |
| XQ-01/XQ-02 feedback and answer-boundary regression | `npx vitest run src/lib/quiz-answers.test.ts src/lib/iflytek-speech/erhua.test.ts` passed: 2 files, 8 tests. It verifies valid erhua normalization while retaining `女儿`, `婴儿`, and `儿童`; it also verifies that both fallback variants are injected only through `xiyouquest-accepted-answers-v1`, while an unrelated question is not broadened. |
| Course-rollout traceability regression | `npx vitest run src/lib/psc/course-rollout.test.ts` passed: 1 file, 3 tests. It keeps LANG1511–LANG1515 under the supplied `school_provided_public_use` scope while rejecting every learner-content import; it preserves LANG1514's 248 textbook candidates / 389 teacher-list candidates and LANG1515's unavailable lessons 6, 12, 14, 16, 21, and 22. |
| Authentication-gate regression | `npx vitest run src/proxy.test.ts` passed: 1 file, 4 tests. It exercises the real proxy function with an unauthenticated learner API request, the unauthenticated HKUST OIDC callback, an unauthenticated page request, and an authenticated login request. A separate read-only public `GET https://cle-xyq.hkust.edu.hk/api/quest/progress` returned `401 {"error":"Unauthorized"}` on 2026-08-22. |
| Server data-client authorization regression | `npx vitest run src/lib/supabase/server.test.ts` passed: 1 file, 2 tests. It proves that the server database factory supplies a service-role client only after a verified Better Auth session and uses the anon client for an unauthenticated request. |
| Quest and Characters recovery interaction tests | `npx vitest run src/app/(main)/main-quest/error.test.tsx src/app/(main)/characters/error.test.tsx src/app/(main)/characters/character-portrait.test.tsx` passed: 3 files, 3 tests. It verifies user-visible retry actions, avoids rendering private query-error text, records only the framework digest, and replaces a failed portrait with a named fallback. |
| Quest and Characters server-query telemetry regression | `npx vitest run src/lib/server/load-metrics.test.ts src/app/(main)/main-quest/error.test.tsx src/app/(main)/characters/error.test.tsx src/app/(main)/characters/character-portrait.test.tsx` passed: 4 files, 5 tests. It verifies success and failure metrics retain duration and code while excluding the server error message and query payload, alongside the existing retry and portrait fallbacks. |
| `npm run build` | Passed after the Component 4 active-provenance correction: compilation, TypeScript, and 63 static pages. The pre-existing workspace-root inference warning remains recorded below. |
| C5 log-minimisation audit | Both active C5 assessment routes now emit a completion-status event without the final numeric learner score. Targeted Node lint and the production build passed. | Edge runtime execution remains a candidate-deployment hold because Deno is unavailable locally. |
| C5 result-data lifecycle regression | `npm run test -- --run src/lib/validations.test.ts` passed: 1 file, 3 tests. It accepts aggregate C5 progress and rejects transcript/audio fields. Focused lint passed for `progressUpdateSchema`, its test, and the mock-exam save route; `git diff --check` passed. |
| Manual local browser check | Passed on 2026-08-22 using an isolated local server on port 3031: `/login` rendered the HKUST sign-in screen with no runtime or console errors, while unauthenticated `/component-4` and `/component-5` each redirected to `/login` with no runtime or console errors. This did not sign in, request microphone access, or exercise authenticated C4/C5 content. |
| Manual local API check | A production-build `POST /api/chat/generate-image` returned `401` with security headers for both a minimal `{sessionId}` body and a legacy body containing `conversationSummary`. This observes the unauthenticated route gate; the strict body rule is covered by the targeted validation test. |
| Controlled production HKUST C4/C5 E2E (2026-08-22) | One authorized HKUST sign-in reached the XiYouQuest learner dashboard. The C4 catalog was viewed without creating a C4 attempt. One C5 microphone/ASR attempt ran to a rendered practice-result surface after manual stop; its transcript remained collapsed and uninspected. | Fails the client cutoff: recording remained active past 180 seconds and required manual stop. The C4 catalog did not expose a visible source/trust label. Node-versus-Edge runtime, per-user persistence/isolation, and full C4 ASR remain unverified. No deployment or production-setting change was made. |
| Deployment-baseline reconciliation | Read-only GitHub inspection on 2026-08-22 resolved the configured upstream `origin/main` to `6b0afd5f77c0de0780fc918a3952c1e82b607ee9`. Its standalone C5 page reaches 3:00 and tells the learner to stop when ready; it does not arm an automatic stop. Its shared recorder also has no maximum-duration facility. This matches the controlled production observation. | The exact Vercel deployment SHA remains unavailable, so this is not a claim that the current upstream SHA is the deployed artifact. The automatic-stop correction, the Edge ASR transport alignment, the C1-C5 formal-mock scoring contract, and the `totalXp` server-side ceiling are all contained in candidate `3dce479`, but are not releasable until deployed to a non-production candidate target and verified there. |
| Vercel access and preview-data reconciliation | On 2026-08-22, the currently authenticated Chrome Vercel session reached `xyq/xi-you-quest-rpg-study-web` read-only. Its variable-scope list, not their values, showed `BETTER_AUTH_DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` assigned to both **Production and Preview**. Deployment history had no entry for candidate `2a46a9e63d939c8c449cd6cc9d10f601b8e4cbc4`; visible previews were older commits. A new dashboard visit to Supabase is signed out, and `supabase projects list` has no authenticated access token; therefore no separate Supabase project or Better Auth database can be selected or provisioned safely. No settings, deployment, sign-in, microphone attempt, or learner data were changed. | There is no exact candidate artifact, and the currently configured Preview could share learner persistence with production. Do not deploy the candidate or consume controlled learner-data QA authority until a distinct non-production data target and its Preview-only scopes are evidenced. Keep the immutable deployment ID/SHA, runtime evidence, and last-known-good rollback pointer as release holds. |

The build reports a workspace-root inference warning caused by an additional lockfile above this repository. The warning is not changed or removed by this work.

## Course rollout evidence and holds

The following sources were supplied by the school and may be used as `school_provided_public_use`. They are **curriculum evidence**, not an automatic content-import authorization for XiYouQuest. XiYouQuest must retain the existing source, term, review-decision, and scope boundary for every item it uses; it must not copy protected passages, exercises, answer keys, media, or generated substitutes into a practice bank. This does not reopen a licence review for the supplied school materials; it preserves the separate academic and course-mapping controls recorded in the workbooks.

At this audit, the original named school PDFs/workbooks are not present in the XiYouQuest worktree or the expected local Downloads folder. The table therefore records the prior supplied-artifact review by exact filename and preserves its counts/holds; it is **not** a fresh file-by-file verification at this commit. Before importing any course item, attach the exact source revision and its recorded teacher decision to the import record. The existing holds below remain in force.

`src/lib/psc/course-rollout.ts` is the local, typed representation of those recorded review facts. It intentionally contains source identifiers, term/count metadata, and hold dispositions only: it does not contain school-course passages, answers, media, or substitute content. Every current record has `learnerContentStatus=REVIEW_HOLD_NOT_IMPORTABLE`; LANG1515's documented missing lessons are represented as unavailable. Its regression test preserves the all-course hold, LANG1514's 248-candidate boundary, and the LANG1515 unavailable-lesson boundary.

| Course | Recorded supplied-school evidence | What the recorded review permits | Explicit hold / required disposition |
| --- | --- | --- | --- |
| LANG1511 | `Syllabus-LANG1511-Fall2026.pdf`; `LANG1511_Teacher_Content_Review_R7_teacher-clean-current.xlsx` | The supplied-review record states a Fall 2026 term, 13 weekly rows, 105 objectives, 301 vocabulary rows, and 74 grammar rows. It permits only metadata candidates and excludes passages, dialogues, exercises, answers, artwork, screenshots, audio, and video. | `REVIEW_HOLD_NOT_IMPORTABLE`: retain recorded teacher decisions and the four explicit lexical holds. Do not promote textbook-derived candidate rows to learner-facing XiYouQuest content yet. |
| LANG1512 | `Syllabus-LANG1512-Spring2026.pdf`; `LANG1512_Teacher_Content_Review_R13_teacher-semantic-final.xlsx` | A Spring 2026 baseline and source-corrected review exist: 13 weekly rows, 53 objectives, 219 vocabulary rows, and 58 grammar rows. The workbook records seven direct source corrections, 30 vocabulary exclusions, 16 objective exclusions, and 17 Lesson 19 additions. | Spring 2026 is **not** evidence for Fall 2026. Confirm term applicability and the L17/L18 weekly-sequence decision with the instructor; complete the final academic mapping review before any import. |
| LANG1513 | `Syllabus-LANG1513-Spring2026.pdf`; `LANG1513_Teacher_Content_Review_R1.xlsx` | A Spring 2026 baseline exists with 13 weekly rows, 49 objectives, 222 vocabulary rows, and 39 grammar rows. The controlled review boundary permits only topic/objective/isolated-vocabulary/grammar metadata. | `REVIEW_HOLD_NOT_IMPORTABLE`: Fall applicability and teacher review remain unresolved. Do not treat the HSK 3 reference as a course-equivalence claim. |
| LANG1514 | `Syllabus-LANG1514-Spring2026.pdf`; `LANG1514_Teacher_Content_Review_R6_teacher-semantic-office-online.xlsx`; `02_Vocabulary_LANG1514.xlsx` | A Spring 2026 baseline exists with 13 weekly rows, 49 objectives, 217 active vocabulary rows after 420 teacher-directed removals, and 29 grammar rows. The separate vocabulary guide confirms exactly **248 textbook candidates** requiring source checking and 389 teacher-list rows requiring language/mapping checks. | `REVIEW_HOLD_NOT_IMPORTABLE`: every one of the 248 candidates needs a registered-source comparison and recorded review decision; Fall applicability and academic approval are also open. Candidate OCR values are not learner-facing content. |
| LANG1515 | `LANG1515_Teacher_Content_Review_R1.xlsx`; the supplied checklist's documented *Eyes on China* partial-working-copy boundary | The Spring 2026 review workbook contains 13 weekly rows, six objectives, 135 vocabulary rows, and 23 grammar rows, all held as metadata candidates. | `REVIEW_HOLD_NOT_IMPORTABLE`: required *Eyes on China* lessons 6, 12, 14, 16, 21, and 22 are absent from the available partial working copy. Do not auto-substitute or generate missing content; obtain approved source material or render the affected practice area unavailable. Confirm Fall applicability and teacher review. |

## Explicit release holds

1. **Partially closed 2026-08-24.** The separate data environment now exists: Supabase project `xyq-preview` (`smeazrwejxtssxjdhldb`) carries the full schema, a separate `better_auth` database, its own anon/service-role keys, deployed edge functions, and zero learner rows (see the isolated-preview row above; local credentials live in the gitignored `.env.preview.local`). Still open before this hold fully closes: (a) attach the reviewed content (`0519e36`) as a Vercel deployment whose **Preview-scoped** `BETTER_AUTH_DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` resolve only to `xyq-preview` — blocked on `xyq` Vercel team access (the CLI account has none); (b) replace the fail-closed placeholder `BETTER_AUTH_JWKS_URL` edge secret with the real preview origin's JWKS; (c) for signed-in QA, an origin whose OIDC redirect URI is registered (currently prod, `cle-xyq-dev`, and `localhost:3000` only) plus `HKUST_XYQ_CLIENT_SECRET`, which is ITSO-issued and not held locally.
2. Correct and verify the signed-in C4/C5 flow on the exact candidate release. The 2026-08-22 controlled production test reached the learner dashboard and returned a C5 practice result after manual stop, but C4 exposed no visible source/trust label and C5 breached the 180-second client cutoff. The user has authorized one fresh controlled C4/C5 attempt and a two-account isolation test, but neither has been used because no exact candidate preview exists and the current Preview configuration shares production persistence settings. On an isolated candidate preview, test both a school-provenance C4 record and a fallback/incomplete C4 record, confirm automatic C5 stop and its practice-duration band, and establish Edge runtime, persistence, Main Quest, and Characters evidence.
3. Close the remaining course-specific holds listed above. In particular: record the school teacher decision for the XQ-02 configured answer variants; record each LANG1514 candidate decision; obtain or explicitly mark unavailable the missing LANG1515 lesson coverage; and obtain Fall-term/instructor applicability for LANG1512–LANG1515. No generated substitute may close a source-scope or academic-review hold.
4. Resolve or explicitly accept the Next workspace-root warning after identifying the intended lockfile/root configuration. Do not delete a lockfile merely to suppress the warning.
5. Before preview deployment, record the last known-good immutable deployment ID and rollback owner. The candidate is committed, but no accessible rollback artifact is claimed.
6. Record the immutable candidate deployment ID/SHA, runtime evidence, and last-known-good rollback pointer after the isolated Preview is created. Dashboard access alone does not establish safe data separation; GitHub commit status and public login reachability do not replace it.
7. Run the authorized authenticated two-account data-isolation test against the exact preview because verified Better Auth sessions intentionally use server-side service-role database access. The unauthenticated `401` checks are positive evidence, but they cannot establish cross-account isolation or persistence behavior.

## Rollback condition

If a future deployed release violates the practice-estimate, privacy, or structured-output contract, redeploy the recorded last known good immutable deployment. Do not attempt to roll back this uncommitted tree. A release commit, deployment ID, owner, and validation timestamp must exist before the hold can be closed.
