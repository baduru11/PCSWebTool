# 官方 PSC 附录对照表 — 收集结果

Collected 2026-08-29 (Asia/Hong_Kong) for the 选择判断 scoring basis.

**Network constraint that shaped this collection:** every mainland-China host tried
(`pthxx.cn`, `blog.sina.com.cn`, `moe.gov.cn`, `ywcbs.com`, `doc.quark.cn`,
`sbs.edu.cn`, `shcmusic.edu.cn`, `jwc.lcu.edu.cn`) is **unreachable from this
machine** (TCP connect timeout, not 403/404). Working retrieval paths were only:
Hong-Kong-hosted sites (`beijingputonghua.com`, `cle.hkust.edu.hk`,
`mandarin.edu.hk`, `pthcenter.hksyu.edu`) and `web.archive.org`. Everything below
was retrieved through one of those.

---

## 0. Authoritative frame (for grading the two tables below)

### 0.1 《普通话水平测试大纲》 — 选择判断 (verbatim)

- Source: 中华人民共和国教育部, 教育部 国家语言文字工作委员会关于印发《普通话水平测试大纲》的通知
- URL (origin): `http://www.moe.gov.cn/srcsite/A18/s3133/200310/t20031017_78537.html`
- Retrieved via: `http://web.archive.org/web/2020/http://www.moe.gov.cn/srcsite/A18/s3133/200310/t20031017_78537.html` on 2026-08-29
- Confidence: **high** — primary source (MOE), retrieved from the Internet Archive copy of the MOE page.

```
(三)选择判断[注],限时3分钟,共10分。
1.词语判断（10组）
(1)目的：测查应试人掌握普通话词语的规范程度。
(2)要求：根据《普通话水平测试用普通话与方言词语对照表》，列举10组普通话与方言意义相对应但说法不同的词语，由应试人判断并读出普通话的词语。
(3)评分：判断错误，每组扣0.25分。
2.量词、名词搭配（10组）
(1)目的：测查应试人掌握普通话量词和名词搭配的规范程度。
(2)要求： 根据《普通话水平测试用普通话与方言常见语法差异对照表》，列举10个名词和若干量词,由应试人搭配并读出符合普通话规范的10组名量短语。
(3)评分：搭配错误，每组扣0.5分。
3.语序或表达形式判断（5组）
(1)目的: 测查应试人掌握普通话语法的规范程度。
(2)要求：根据《普通话水平测试用普通话与方言常见语法差异对照表》，列举5组普通话和方言意义相对应,但语序或表达习惯不同的短语或短句，由应试人判断并读出符合普通话语法规范的表达形式。
(3)评分：判断错误，每组扣0.5分。
选择判断合计超时
1分钟以内，扣0.5分；超时1分钟以上(含1分钟)，扣1分。答题时语音错误，每个音节扣0.1分,如判断错误已经扣分,不重复扣分。
```

> **Transcription note (not my error):** item 2 above cites 《普通话水平测试用普通话与方言常见语法差异对照表》 as
> the source of the 量词、名词搭配 items. That is an error **in the MOE page itself**; the actual source table is
> 《普通话水平测试用普通话常见量词、名词搭配表》, as the HKUST and 香港普通話研習社 pages below both state.
> Quoted verbatim as found.

### 0.2 Item counts per the 2021 edition (香港普通話研習社, PSC exam info)

- URL: `https://mandarin.edu.hk/index.php?post=38&route=post%2Fpost%2Fshow`
- Retrieved 2026-08-29, HTTP 200, direct.
- Confidence: **medium-high** — a testing-centre secondary source explicitly citing 《普通話水平測試實施綱要》(2021), in use since 2024-01.

```
3. 選擇判斷：限時3分鐘，共10分。
a) 詞語判斷 – 10 組 選自《普通話水平測試用普通話與方言詞語對照表》(含949條)
b) 量詞、名詞搭配 – 10 組 選自《普通話水平測試用普通話常見量詞、名詞搭配表》(含45條)
c) 語序或表達形式判斷 – 5組 選自《普通話水平測試用普通話與方言常見語法差異對照表》 (含35類)
```

**Calibration check I ran:** the 量詞 table we already hold
(`https://www.beijingputonghua.com/psc/liangci/liang.htm`) has **exactly 45 numbered rows**,
matching the "含45條" figure. That is independent evidence the counts on this page are accurate,
which is why the "949條 / 35類" figures below should be taken seriously.

---


## 1. 《普通话水平测试用普通话与方言词语对照表》 — **NOT FOUND**

I could not obtain this table, in whole or in substantial part. **No content is
reconstructed below.** Only two entries are given, and both are quoted from sources
that explicitly present them as items from this table.

### 1.1 Sources tried and how each failed

| # | Source | Result |
|---|---|---|
| 1 | `beijingputonghua.com` (host of the 量詞 table) | **Does not host it.** I enumerated `/psc/menu.htm`: the site has exactly 8 PSC sections — 簡介, 流程, 模擬樣卷, 必讀輕聲詞語表, 兒化詞語表, 量詞名詞搭配表, 60篇朗讀作品, 說話題目. No 詞語對照表, no 語法差異表. Guessed sibling dirs (`/psc/cihui/`, `/psc/yufa/`) are not in the menu; `/psc/liangci/` returns 403 on directory listing. |
| 2 | `pthxx.cn` (普通话学习站) — the site that *does* host the grammar table | **Does not host it.** I enumerated the full site nav from the archived homepage: `zc/cy1` = 词语表一, `zc/cy2` = 词语表二, `zc/qs` = 轻声, `zc/erhua` = 儿化, `zc/xxzl` = 学习资料 (where the grammar table lives). `cy1`/`cy2` are the 《普通话词语表》表一/表二 (1-100条 … 6501-6595条), a **different** appendix. No 方言词语对照表 anywhere in the nav or in the archived URL set. |
| 3 | `doc.quark.cn/preview/jiaoyukaoshi-biji-K12/8EA36859FB8B9306AB17F26157F2042F` — titled **"普通话测试用普通话与方言词语对照表(全)"**, i.e. claims to be the complete table | **Best lead, could not be opened.** Host unreachable from here (connect timeout) on direct curl and on WebFetch (`ECONNRESET`). Not in the Wayback Machine. Proxy attempts: `r.jina.ai` → 401 (network reputation block), `api.allorigins.win` → 520, `api.codetabs.com` → 522, `corsproxy.io` → 403 (now requires an API key). **This URL is the single highest-value target for a retry from a different network.** |
| 4 | `tukuppt.com/muban/lwrorbrb.html` — same title, "Word模板下载" | Commercial paid-download template site; host unreachable from here; would in any case be an unverifiable third-party re-upload. |
| 5 | `ywcbs.com/app/pthspcs/files/basic-html/page5.html` — 语文出版社 flipbook of 《普通话水平测试实施纲要》 itself (page 5 = TOC) | Host unreachable (90s timeout on http, SSL timeout on https, both www and root). Wayback has only `/app/pthspcs/`, `book.swf`, `files/basic-html/index.html`, `mobile/index.html` — **the individual `basic-html/pageN.html` pages were never captured.** Second-highest-value retry target. |
| 6 | Wayback CDX sweep of `pthxx.cn` (domain-wide, ~3000 URLs) | Confirms #2: no 词语对照表 URL exists on that site. |
| 7 | `moe.gov.cn` 大纲 (2003) | Retrieved via Wayback (see §0.1). Describes the table and its scoring, **does not reproduce it**. |
| 8 | `cle.hkust.edu.hk/tests/psc/psc/rules`, `mandarin.edu.hk`, `pthcenter.hksyu.edu` | All retrieved directly. Give structure, counts, and one sample item — **not the table**. |
| 9 | ~10 web searches in simplified and traditional Chinese (全文/附录/下载/txt/pdf/949条/方言区 names/fingerprint entries) | Returned only descriptions, book-listing pages, 百度百科 summaries, and provincial 教务处 restatements. No full-text reproduction surfaced. |
| 10 | 百度文库 / 道客巴巴 / 豆丁 | Not reachable from this network at all; no accessible mirror found via search. |

### 1.2 The two entries I *can* quote verbatim

Both are official illustrative items, quoted from sources that attribute them to this table.
Format confirmed: a group of near-synonyms across dialects, exactly one of which is the
Putonghua word; the candidate must identify and read that one.

```
挨晚、黃昏頭、傍晚、臨夜、晚邊子          （普通话词语：傍晚）
```
Source: 香港普通話研習社 / HKUST CLE PSC materials, presented as a 詞語判斷 item drawn from 《普通話水平測試用普通話與方言詞語對照表》. Retrieved 2026-08-29. Confidence: **medium** — the grouping is quoted as given; the parenthesised answer is the obvious Putonghua member, marked by me, not by the source.

```
日里、日时、白天、日中、日头              （普通话词语：白天）
```
Source: surfaced in search results attributed to 河南师范大学 语言文字网 reproduction of 《普通话水平测试大纲》(总论) (`https://www.htu.edu.cn/yw/2013/0523/c1663a31320/page.htm`). **I could not open that page** (host unreachable), so this entry rests on a search-result snippet only. Confidence: **low-medium**. Do not treat as verified.

### 1.3 What is known about the table's shape (inference, clearly labelled)

- Size: **949 条** per the 2021 edition (§0.2). *Observed figure, from a secondary source whose sibling figure (45) I verified independently.*
- Organisation: **not** by dialect region in the way the task assumed. Both sample items show a
  flat list of *groups*, each group mixing one Putonghua word with several regional variants
  from different dialect areas. *Inference from two samples — weak, but consistent across both.*
- In the 实施纲要 it is 第三部分, printed around pp. 253/288–288 (page figures differ between two
  search-derived TOC descriptions; unresolved).

---


## 2. 《普通话水平测试用普通话与方言常见语法差异对照表》 — **FOUND, COMPLETE (34 类)**

### 2.1 Provenance

Assembled from **two independent mirrors that I cross-diffed against each other**.

**Source A — 普通话学习站 (pthxx.cn), 4-part series in 学习资料**

| Part | Sections | Origin URL | Retrieved via |
|---|---|---|---|
| （一） | 说明 + 一–八 | `http://www.pthxx.cn/zc/xxzl/2019-08-04/1116.html` | `http://web.archive.org/web/2021/…` (snapshot 20211024130013 / 20250429151709) |
| （二） | 九–十六 | `http://www.pthxx.cn/zc/xxzl/2019-08-04/1115.html` | `http://web.archive.org/web/2021/…` (snapshot 20250512055348) |
| （三） | 十七–二十五 | `http://www.pthxx.cn/zc/xxzl/2019-08-04/1114.html` | `http://web.archive.org/web/20250512060447id_/…` (the `id_` raw-replay form; the normal replay form 404s despite CDX reporting status 200) |
| （四） | 二十六–三十四 | `http://www.pthxx.cn/zc/xxzl/2019-08-04/1113.html` | **NOT ARCHIVED** — zero Wayback captures; origin unreachable. Gap filled from Source B. |

**Source B — 新浪博客 c007525, 2-part reproduction**

| Part | Sections | Origin URL | Retrieved via |
|---|---|---|---|
| (1) | 一–十六 | `http://blog.sina.com.cn/s/blog_612df69d0100ihu2.html` | `http://web.archive.org/web/2015/…` |
| (2) | 十七–三十四 | `http://blog.sina.com.cn/s/blog_612df69d0100ihu0.html` | `http://web.archive.org/web/2015/…` |

All retrieved 2026-08-29.

### 2.2 Fidelity check (this is why confidence is high)

Sources A and B overlap on **sections 一–二十五**. I machine-diffed the two extractions over that
whole range. Every sentence pair, every option letter, and every （选对…）answer key **matched
exactly**. The only differences in ~500 lines were typographic:

- half-width vs full-width parentheses: `(远指)` (A) vs `（远指）` (B)
- `+` (A) vs `＋` (B) in formula notation such as `动词+起+宾语+来`
- `;` (A) vs `；` (B)
- one heading: A has `十三、否定副词`, B has `十三、否定副词“不”`
- the 说明 preamble (5 numbered notes) is present **only in A**

Two independent reproductions agreeing to the character over 25 of 34 sections is strong evidence
both are faithful transcriptions of the same printed original, which is what licenses using B alone
for 二十六–三十四.

**Confidence: high** for 一–二十五 (two-way agreement); **medium-high** for 二十六–三十四
(single source, but that source is verified faithful over the overlap).

### 2.3 Edition caveat — READ THIS

This is the **2003/2004-edition** table: **34 类** (一 through 三十四, continuous, no gaps).

The 香港普通話研習社 page (§0.2), describing the **2021 edition** in force since 2024-01-01, says
語序或表達形式判斷 items are drawn from this table **"(含35類)"** — i.e. **35**, one more than I have.

I could not resolve this. Possibilities, none confirmed:
1. The 2021 edition added one category (most likely — the 2021 revision is documented as adding/deleting entries).
2. The HK page's figure is imprecise.
3. Both mirrors are missing a final section.

Evidence bearing on it: Source B is a clean two-part split (16 + 18) that runs 一→三十四 with no gap
and ends mid-flow at 三十四 假设关系复句; Source A's part（四）— which I could not retrieve — would have
held 二十六 onward and could in principle have run to 三十五. **Treat "one category may be missing
relative to the 2021 edition" as an open risk.** Sections 三十二/三十三/三十四 are all 复句 types
(并列/取舍/假设), so a plausible 35th would be another 复句 relation (条件/转折/因果) — *that is my
speculation and must not be written into any dataset.*

### 2.4 Reading the answer key

Per the 说明 (§ below), in each group the letter marked `*` is the Putonghua form and the one marked
`方` is the dialect form. `a≠b*` means both are Putonghua when they differ in meaning; `a＝b方` means
b is dialectal when the two mean the same thing.

### 2.5 Table — 说明 and sections 一–二十五 (Source A, verbatim)


```
说　　明
1、本材料供普通话水平测试第三项——选择、判断测试使用。
2、内容大致按词法和句法分类排列，词法在前，句法在后。量词、名词搭配表请参看另外一个文件。
3、本材料各语法类别下所列若干组句子，仅为举例性质，远非普通话与方言语法差异的全部，而且同一格式的句子(或词语)尽量不多举，测试命题时可按同格式替换、类推。
4、所列句子采用单一的选择题型，答案一般是普通话说法(题号右边标注*)放在前边，方言说法(题号后标“方”的)放在后边，命题时排列顺序应随机变动。
5、a≠b*　，表示当a b两句表达的意思不同时，两句都是普通话的说法。a=b方，表示a b两句表达的意思相同时，b句是方言说法。
汉语普通话与各方言之间的差别，总的来说语音方面表现最突出，因此，在进行普通话教学和训练的过程中，首先抓住方言区语音上的难点是完全正确的。其次是词汇，这一部分要比语音上的差别小一些。相对前两者而言，普通话与方言在语法上的差别显得小得多，不过，决不能因此而忽视语法上的差别。事实上，语法上的差别虽然小些，某些突出的现象却非格外留心不可。例如有些方言区的人学说普通话很容易就会说出“你走先”“我有看”“你讲少两句”一类的句子来。这些句子格式都不合乎普通话语法规范，直接影响表达效果。
这里说的方言和普通话的差异，实际上主要是指在测试中表现出来的地方普通话(指处于方言向普通话过渡中的一种“中介状态”)和标准普通话之间的差别。同是差异和问题，在语音和语法上的表现又有不同。语音上的差异主要表现在地区上，不同地区有不同的差别和问题，主要是带着不同口音的地方腔。而语法差异则不同，有时不同方言区之间会相互渗透一些方言的句式或表达习惯，几个不同方言区可能在在同样的语法问题，所以我们在做语法差异对比时，不以地区分类，而是按不同问题的类型进行分类。
方言中有一些句式，似乎和普通话一样，比如广西方言说“我不比他好”，意思是“我没有他好”。孤立地看，这句话没有语法错误，因为普通话中也有这样的句式。但是普通话中“我不比他好”包含两层意思：一是“我没有他好”，二是“我和他一样”。广西话“我不比他好”只能表达前一层意思，如果要表达的是后一层意思，这种说法就错了。所以对于这一类句式，只有在一定的语言环境中才能判断出正误来。
一、词　　尾
普通话和各方言都有一些词尾，最常见的如“子、儿、头”等，但这些词尾用在什么词语里，普通话和方言不所不同。最常见的是“子”尾，但普通话说“虾”，不带“子”，江苏很多地方都说“虾子”。与此相反，普通话中的“袜子”，在吴方言大都说“袜”或“洋袜”。普通话的“鼻子”，吴方言说成“鼻头”。江淮方言中名词的“子”尾特别多，儿化普遍比普通话少，甚至完全没有儿化。普通话中的“明年、麦穗儿、豆角儿、鸡、蝴蝶、脸盆、嘴唇、脚底板儿、肚脐眼儿、裤头儿、面条儿”等，在江淮方言中说成“明年子、麦穗子、豆角子、鸡子、蝴蝶子、脸盆子、嘴唇子、脚底板子、肚脐眼子、裤头子、面条子”。“裤子”“帽子”，山西某些地区说成“帽的”“裤的”或“帽儿”“裤儿”，“狐狸”说成“狐的”“狐子”。山西方言还往往把儿化词语的“儿”尾去掉，前边的词语重叠。各方言区还有一些普通话中没有的词尾，如吴方言普遍有“厨房间、厕所间、客堂间”的说法，普通话都不带“间”字。南昌话中重叠副词的词尾“子”，相当于北京话的“儿”。总体上说，方言中的词尾比普通话用得多些。我们说普通话时，要多加注意，去掉这些词尾，或改用普通话的词尾。
a、腿变粗了。
b、腿子变粗了。 （选对a*　b方）
a、我买了一顶帽子、一条裤子。
b、我买了一顶帽的、一条裤的。
c、我买了一顶帽儿、一条裤儿。 （选对a*　b c方）
a、有一窝鸡都让狐狸吃了。
b、有一窝鸡都让狐的吃了。
c、有一窝鸡都让狐子给吃了。 （选对a*　b c方）
a、灯丝儿又断了。
b、灯丝的又断了。
c、灯丝子又断的。 （选对a*　b c方）
a、门上有一个眼儿。
b、门上有一个眼眼。 （选对a*　b方）
a、把瓶子上的盖儿拧开。
b、把瓶瓶上的盖盖拧开。 （选对a*　b方）
a、我捉住它的小腿，把它带回去。
b、我捉住它的小腿子，把它带回去。 （选对a*　b方）
a、我就这样度过了童年。
b、我就这样子度过了童年。 （选对a*　b方）
二、这
普通话中，指示代词“这”用来指代人和事物，表示“近指”，与“那”(远指)相对。在一些方言里常常没有“这”。
a、这支笔是谁的？
b、支笔是谁的？ （选对a*　b方）
a、这朵花真好看。
b、朵花真好看。 （选对a*　b方）
a、这本书是我的。
b、本书是我的。 （选对a*　b方）
三、数　　量
福建等一些方言的称数法与普通话说法不大一样，有的方言区的人说普通话往往在数量上加以替代或省略。
a、他今年二十一岁。
b、他今年二一岁。 （选对a*　b方）
a、我有一百一十八块钱。
b、我有百一八块钱。 （选对a*　b方）
a、这大米有一千三百公斤。
b、这大米有千三公斤。 （选对a*　b方）
a、这座山有一千九百五十米高。
b、这座山有千九五米高。
c、这座山有一千九五为高。 （选对a*　b c方）
a、距离考试还有一个多月。
b、距离考试还有月把天／月把日。 （选对a*　b方）
a、我们写作业用了一个多月。
b、我们写作业用了一点半钟。
c、我们写作业用了点半钟。 （选对a*　b c方）
a、他审阅了二百一十三个方案。
b、他审阅了二百十三个方案。 （选对a*　b方）
四、二与两
在普通话里，“两”一般只作基数词，“二”除了作基数词，还可以作序数词，但在一般量词如“层”的前面，“二”只能作序数词，“二层楼”是第二层楼的意思。“二”与“两”都作基数词的时候，意思是一样的，但是根据普通话的习惯，用法也有许多不同。一些方言的习惯说法也与普通话不一样。
a、二比二（竞赛比分）。
b、两比两。 （选对a*　b方）
a、二比五。
b、两比五。 （选对a*　b方）
a、他大约要两三个月才能回来。
b、他大约要二三个月才能回来。 （选对a*　b方）
a、还有二两油。
b、还有两两油。 （选对a*　b方）
a、下午两点多。
b、下午二点多。 （选对a*　b方）
a、我家住在二层。
b、我家住在两层。 （选对a*　b方）
a、两个人的世界。
b、二个人的世界。 （选对a*　b方）
五、给
动词“给”在湖北、湖南等地常说成“把”，南昌话把“给”说成“到”，在结构上也有不同。
a、把书给他。
b、把书把给他。
c、把书把我。 （选对a*　b c方）
a、给我一本书。
b、拿一本书到我。 （选对a*　b方）
六、能（善于）
“能”在普通话里一种意思是表示“善于”，前边可以有程度副词“很”“非常”修饰。有些方言区用“会”代替“能”，普通话“程度副词+会”也有“善于”的意义，所以在这种情况下“能”和“会”通用。“程度副词+不会”表示不善于，但“不能”的前面不可以用程度副词。前面没有程度副词的“不会”和“不能”意义不同。
a、他很能说。
b、他很会说。
c、他很不会说话。
d、他很不能说话。 （选对a*　b* c*d方）
a、妈妈很能干活。
b、妈妈很会干活。
c、妈妈很不会干活。
d、妈妈很不能干活。 （选对a*　b* c*d方）
a、他不会不来。（一定会来）
b、他不能不来。（一定要来） （选择a≠b*　a＝b方）
七、能（可以）
“能”在普通话中，还有“可以”的意思。四川等地在句中动词的后面加“得”表示可以，可能做某种动作。闽南方言也用“会”来表示可以、可能做某种动作。
a、这凳子能坐三个人。
b、这凳子坐得三个人。
c、这凳子会坐得三个人。
d、这凳子会坐三个人。 （选对a*　b cd方）
a、你能走吗？能走。
b、你会走吗？会。
c、你走得不？走得。 （选对a*　a＝b方 c方）
a、这条裤子你能穿。
b、这条裤子你会穿。
c、这条裤子你穿得。 （选对a*　a＝b方 c方）
a、开了刀，他笑都不能笑。
b、开了刀，他笑都笑不得。 （选对a*　b方）
a、他伤好了，能走路了。
b、他伤没好，不能走路。
c、他伤好了，会走路了。
d、他伤没好，不会走路。 （选对a*　a＝c方b＝d方）
a、可以看，不可以摸。
b、会看得，不会摸得。 （选对a*　b方）
a、路太滑，我不能开快车。
b、路太滑，我不敢开快车。 （选择a≠b*　a＝b方）
a、他能听得懂。
b、他会听得来。
c、他听会来。
d、他能听得知。
e、他晓得听。 （选对a*　b c d e方）
八、来、去
“来”“去”在普通话句子中都有两种功能：一个是实意动词，一个是意义虚化，在动词后只表示一咱趋向;但“来”“去”所表示的趋向相反。在一些方言区中常常在“去”之前衍生出一个“来”字。有的动词后的“去”又说成“来”。闽南话中“来去”还有“将要”的意思，表示一种意向，指现在正开始行动。
a、我正要吃饭去。
b、我正要去吃饭。
c、我来去吃饭。 （选对a*b*　c方）
a、我告诉他。
b、我去告诉他。
c、我来去告诉他。 （选对a*b*　c方）
a、咱们逛街去。
b、咱们去逛街。
c、咱们来去逛街。 （选对a*　b*　c方）
a、我们去问他。
b、我们来问他。
c、我们问他去。
d、我们去问他来。 （选对a≠b*“趋向不同”c*a＝b方d方）
a、我们一起去看电影好吗？
b、我们一起来去看电影好吗？ （选对a*　b方）
九、起　　来
普通话里趋向动词“起来”常放在动词或形容词之后，表示动作或状态的开始，格式有“动词+起+宾语+来”，有时也可以说成“宾语+动词+起来”。有些方言把“起来”放在宾语之后。
a、下起雨来了。
b、下雨起来了。 （选对a*　b方）
a、说起话来没个完。
b、话说起来没个完。
c、说话起来没个完。 （选对a*b*　c方）
十、形容词重叠
形容词在普通话中可以重叠，但单音节重叠一般要在后面加上“的”字，如“红”重叠为“红红的”。但在湖北、浙江等一些方言里常常没有“的”。有的方言里有三叠。状态形容词及其重叠形式和某些方言中的表示法也不同。另外要注意，性质形容词的重叠式和状态形容词不再受程度副词的修饰。
a、他的手洗得很白。
b、他的手洗得白白。
c、他的手洗得白白白。 （选对a*　bc方）
a、他穿着谈红色衣服。
b、他穿着浅红色衣服。
c、他穿着红红的衣服。
（普通话话“红红”是“很红”，闽南话“红红”是“有点儿红”） （选对a*b*　c方）
a、血红血红的
b、血红红的
c、红蛮红的
d、红红哇的 （选对a*　b cd方）
a、冷冰冰
b、冰冰冷
c、冷冰哒
d、冰嘎凉 （选对a*　b c d方）
a、雪白雪白的
b、雪雪白的
c、雪白白的 （选对a*　bc方）
a、喷喷香
b、香喷喷
c、喷香香 （选对a*b*　c方）
a、清清白白
b、清清白
c、清白清白 （选对a*　bc方）
a、认认真真
b、认认真 （选对a*　b方）
a、高高兴兴
b、高高兴 （选对a*　b方）
a、大大方方
b、大大方
c、大方大方 （选对a*　ba≠c*）
a、普普通通
b、普普通 （选对a*　b方）
十一、程度副词
普通话里“很、太、非常”等程度副词可以直接放在动词、形容词之前表示动作、性状的程度，不能直接放在动词、形容词之后。有些方言(如四川话)里却常把“很”直接放在动词、形容词之后表示程度。有些方言虽然程度副词也可直接放在动词、形容词之前，但所用的是不同于普通话的方言副词，如“好、好好、忒、过、老、异”等。
a、菜太老了，不能吃了。
b、菜老很啰，吃不得啰。 （选对a*　bc方）
a、这花儿多好看啊！
b、这花儿好好看啊！ （选对a*　bc方）
a、这天真蓝啊！
b、这天好好蓝啊！ （选对a*　bc方）
a、冬天北方非常冷。
b、冬天北方过冷。
c、冬天北方老冷。
d、冬天北方异冷。 （选对a*　b cd方）
a、我太紧张了。
b、我过紧张了。
c、我忒紧张了。
d、我太过紧张了。 （选对a*　b cd方）
a、他非常可爱。
b、他好好可爱。
c、他上可爱。 （选对a*　bc方）
a、这朵花真香。
b、这朵花几香啊。
c、这朵花老香。 （选对a*　b c方）
a、这菜太咸。
b、这菜齁咸。
c、这菜伤咸。
d、这菜咸伤了。
e、这菜老咸。 （选对a*　bc d e方）
十二、范围副词
范围副词“都”“全”在普通话中表意基本相同，在“都/全+动词+补语”的格式中，表示“全部”。一些方言表示该意义往往用“动+动+补语”的格式。
a、你们都出去。
b、你们全出去。
c、你们全都出去。
d、你们出出去。 （选对a*b*c*　d方）
a、都收起来。
b、收收起来。 （选对a*　b方）
十三、否定副词
普通话里表示否定的副词“不”，在福建等一些方言中常常说成“没，没有”。
普通话中表示“完成、存在状态”，一般在动词后带助词“了le、着zhe”。四川等地方言中经常在动词后带“得有”或“有”再带宾语，表示事物的存在，即“(动)得有(宾语)”。有时普通话中需要用“有”来表示的，方言里也用“得有”来表示。有的方言里用“有”表示曾经等，直接放在动词前面。
a、他手表丢了找不到。
b、他手表丢了没有地方找。 （选择a≠b*　a＝b方）
a、你去，我不去。
b、你去，我没有去。 （选对a*　b方）
a、不，他不是这样唱的。
b、没有，他不是这样唱的。 （选对a*　b方）
a、这菜不咸。
b、这菜没有咸。 （选对a*　b方）
a、他不回家。
b、他没有回家。 （选择a≠b*　a＝b方）
a、我吃不到荔枝。
b、我吃没有荔枝。 （选对a*　b方）
a、妈妈说红的花多半不香。
b、妈妈说红的花多半没有香。 （选对a*　b方）
a、他脑子不笨。
b、他脑子没有笨。 （选对a*　a＝b方）
十四、介词：被
普通话里常用介词“被”(口语里常用“叫、让”等)或者用“被”引进施事宾语，放在谓语动词前，构成表示被动意义的“被字句”。一些方言里表示被动意义的介词的位置跟普通话相同，但所用介词与普通话不同。如湖南长沙把“被”说成“捞”，临武把“被”说成“阿”。山西把“被”说成“招”“得”。四川等地把“被”说成“遭”“拿给”等。湖北等方言区把“让”说成“尽”“把”等。甚至用“把”兼当“把字句”和“被字句”的公词，如“弟弟把他哥哥打了”。福建等地区口语里还常用“给”表示被动意义，有时会造成歧义。
a、书被弟弟撕坏了。
b、书阿弟弟撕坏了。 （选择a*　b方）
a、妹妹的书包被树枝挂破了。
b、妹妹的书包遭树枝枝挂破啰。 （选对a*　b方）
a、我的书被别人借走了。
b、我的书遭别人借走啰。
c、我的书拿给别人借走了。 （选对a*　bc方）
a、我们被他骂了一顿。
b、我们遭他骂了一顿。
c、我们招他骂了一顿。 （选对a*　bc方）
a、大家都被他说乐了。
b、大家都叫他说乐了。
c、大家都招他说乐了。
d、众人都得他说乐了。 （选对a*b*　c d方）
a、别让他跑了。
b、别尽他跑了。
c、别被他跑了。 （选对a*　bc方）
十五、介词：从、在、到、向、往
“从”在普通话里是表示动作起始点的介词，常常宾语构成介词短语作状语。福建常把“从”说成“对”“走”等。山西地区说成“朝”“赶”“假”“跟”“以”“拿”“到”等。
普通话里常用介词“在、到”构成介词短语作谓语动词的状语或补语表示处所。有些方言区把“在、到”说成“咧、撂、搁”等，有的干脆省略掉介词，让谓语动词与后面的处所名词直接组合。
表示方向的介词“往”山西地区说成“去”。“向”福建地区说成“给”。
a、从杭州出发。
b、对杭州出发。
c、起杭州出发。 （选对a*　bc方）
a、从这儿离开。
b、走这儿离开。
c、起这儿离开。 （选对a*　bc方）
a、我从太原来。
b、我朝太原来。
c、我赶太原来。
d、我迎太原来。
e、我假太原来。
f、我以太原来。
g、我拿太原来。 （选对a*　b cd e f g方）
a、面包掉在地上了。
b、面包掉咧地上了。
c、面包掉撂地上了。 （选对a*　b c方）
a、把花放到窗台上吧。
b、把花放咧窗台上吧。
c、把花放撂窗台上吧。 （选对a*　bc方）
a、你把钱放在桌子上吧！
b、你把钱放桌子上吧！
c、你把钱稳儿桌子上吧！ （选对a*　b c方）
a、在黑板上写字。
b、搁黑板上写字。
c、跟黑板上写字。 （选对a*　b c方）
a、你往东走，我往西走。
b、你去东走，我去西走。 （选对a*　b方）
a、向老师借书。
b、给老师借书。 （选择a≠b*　a＝b方）
十六、动态助词：着、了、过
普通话里表示动态的助词主要有“着、了、过”三个，附着在动词或形容词之后表示动词形容词的某种语法意义。动态助词“着”用在动词、形容词后面，主要表示动作在进行或状态在持续，有时表示动作后的存在状态。“了”主要表示动作行为的完成。四川、湖北等地常把“着”或“了”说成“得有”，把“着”说成“倒”“起”等。四川话还可以在动词后面带“起在”“倒起”等，表示普通话里“着”的意思。福建方言区有些地方还把“了”说成“掉”。有的方言里把“着”放在宾语之后。
普通话动态助词“过”用在动词、形容词后面，主要表示动作的完成，或者表示曾经发生这样的动作、曾经具有这样的状态。有些方言区(如广东、福建)则常用“有+动”或“有+动+过”的格式来表示。“有”字跟其他动词连用，在普通话里仅限于一些来自文言的客套话，例如：“有请”“有劳”“有待”“有赖”。
a、我带着钱呢。
b、我带得有钱。 （选对a*　b方）
a、他额头上又没有刻着字。
b、他额头上又没有刻得有字。 （选对a*　b方）
a、他带着火柴呢。
b、他带得有火柴呢。 （选对a*　b方）
a、给你留了包子。
b、给你留得有包子。 （选对a*　b方）
a、今天走了五十里路。
b、今天走得有五十里路。 （选对a*　b方）
a、他看着看着就睡着（zháo）了。
b、他看倒看倒就睡着了。 （选对a*　b方）
a、我们都等着你呢！
b、我们都在等倒你在！ （选对a*　b方）
a、他要做，你也只好看着。
b、他要做，你也只好看起。
c、他要做，你也只能看倒。 （选对a*　bc方）
a、师傅把着手教我。
b、师傅把倒手教我。 （选对a*　b方）
a、坐着说不如站着干。
b、坐起说不如站起干。 （选对a*　b方）
a、他还玩着呢。
b、他还耍起在。 （选对a*　b方）
a、提包在墙上挂着呢。
b、包包在墙壁上挂起在。 （选对a*　b方）
a、气死了。
b、气死掉。 （选对a*　b方）
a、妈妈在家等着你呢。
b、妈妈在家等你着呢。 （选对a*　b方）
a、这件事我说过。
b、这件事我有说。
c、这件事我有说过。 （选对a*　bc方）
a、今天上午他来过。
b、今天上午他有来。
c、今天上午他有来过。 （选对a*　bc方）
a、他读过书。
b、他有读书。 （选对a*　b方）
a、我写过一篇关于妈妈的作文。
b、我有写过一篇关于妈妈的作文。 （选对a*　b方）
a、我来过福州。
b、我有来过福州。
c、福州我有来。 （选对a*　bc方）
a、老师为此表扬过我。
b、老师为此有表扬过我。 （选对a*　b方）
a、爸爸早年做过苦力。
b、爸爸早年有做过苦力。 （选对a*　b方）
a、听说玛利亚到过长城。
b、听说玛利亚有到过长城。 （选对a*　b方）
十七、结构助词：的、地
普通话里的结构助词“的、地”，在有些方言里说成“葛、子”。另外，在测试中有的人普通话发音很好，但往往知某些助词上露出方言词来。比如吴方言有一个用在句末的助词“葛”，出现频率很高，它大体相当于普通话的“的”，人们在说普通话时，常常会不自学地把它变为“的”。例如“很好的。”“他会来的。”这似乎没什么问题，因为有时普通话里也这么说，但有时这种表达相对而言在交际中不够规范。
a、这是你的字典。
b、这是你葛字典。 （选对a*　b方）
a、我们慢慢地走。
b、我们慢慢子走。 （选对a*　b方）
a、慢慢地吃。
b、慢慢儿吃。
c、慢慢子吃。 （选对a*b*　c方）
十八、语气词
普通话里语气词用在句尾，表示种种语气，依据所表示的语气不同分为陈述语气、疑问语气、祈使语气和感叹语气。普通话里表陈述语气的“嘛”湖北话中经常用“唦”“着”“子”等;表陈述语气的“呢”，内蒙古等地用“的嘞”。疑问语气词“吧”，内蒙古方言中常用“哇”。有时不需要句末语气词，有的地方却加上语气词“的”。有时应该用语气词“了”，有的地方却用了“的”。
a、先坐下，你别慌嘛。
b、先坐下，你别慌唦。
c、先坐下，你不慌着。 （选对a*　bc方）
a、你忙什么呀？
b、你忙什么子？ （选对a*　b方）
a、姐姐看孩子呢。
b、姐姐看孩子的嘞。
c、姐姐看孩子的哩。 （选对a*　bc方）
a、这是上次看的电影吧？
b、这是上次看的电影哇？ （选对a*　b方）
十九、前　　缀
在普通话中没有前缀的地方，晋方言区一些地方会加上前缀。
a、开了一朵红花。
b、开了一圪朵红花。 （选对a*　b方）
a、他可会哄人呢。
b、他可会日哄人哩。 （选对a*　b方）
a、那是个能人，要一套有一套。
b、那是个日能人，要一套有一套。 （选对a*　b方）
a、溅了一地水。
b、不溅了一地水。 （选对a*　b方）
二十、动不动、形不形
“动有动”和“形不形”句式，是普通话的一种选择疑问句式，选择项是一件事物的肯定和否定，常说成“A不A、AB不AB”或“A没A、AB没AB”等形式。烟台(老派)、威海、荣成、文登、乳山、牟平等县市，说成“是不A、是不AB”或“是没A、是没AB”的形式。龙口、蓬莱、长岛等地说成“实A、实AB”等的格式。湖北和山东有些地区(招远、长岛等)用动词、形容词重叠的形式来表示反复问的意义，构成“AA、AAB”形式。
山东潍坊、济宁等地常用简略的形式表示疑问，在动词、形容词后面加上“不”构成“A不”或“AB不”的格式，“不”后面的形容词和动词一般不再出现。
还有些地区(菏泽等地)则直接在动词、形容词后加助词“啵”来表示疑问。淄博、青州、临朐、寿光等地通用的格式是“A啊吧?”或者“A啊不?”“AB啊不?”
a、你看不看电影？
b、你是不看电影？ （选对a*　b方）
a、你家里有没有人？
b、你家里是没有人儿？ （选对a*　b方）
a、天黑没黑？
b、天是没黑？ （选对a*　b方）
a、菜咸不咸？
b、菜实咸？
c、菜阿咸？ （选对a*　bc方）
a、电影好看不好看？
b、电影儿实好看？ （选对a*　b方）
a、你去不去？
b、你实去？ （选对a*　b方）
a、这菊花香不香？
b、这菊花香香？ （选对a*　b方）
a、他聪明不聪明？
b、他聪聪明？ （选对a*　b方）
a、你去不去逛街？
b、你去去逛街？ （选对a*　b方）
a、你们来过没来过？
b、你们来来没呐？ （选对a*　b方）
a、他们坐不坐？
b、他们坐不？ （选对a*　b方）
a、屋里热不热？
b、屋里热啵？ （选对a*　b方）
a、行不行？
b、中啊吧？
c、中啊不？ （选对a*　bc方）
a、你有没有钱？
b、你有钱啊吧？
c、你不钱啊不？ （选对a*　bc方）
a、那东西重不重？
b、那东西重咧不？
c、那东西重啊不？
d、那东西重咧不咧？ （选对a*　bc d方）
二十一、会不会、能不能、有没有
普通话里用来表示疑问的句式“会不会”，在四川等一些方言区中用“(动)得来(动)不来”“(动)得来不”(表示没有能力做某事)或“得不得(动)”(表可能)这样的句式。普通话回答是在动词前面加“会、不会”来表示，而四川等方言一般用“(动)得来”或“(动)不来”(表没有能力做某事)，或者用“不得(动)、不得会(动)”(表可能)。但像“合得来、合不合来;谈得来、谈不来”等是一些方言和普通话里都有的说法，表达的意思也一样。普通话里表许可或可能的疑问句式“能不能(动)”“能(动)不能(动)”，在有些方言里用“(动)得不”来表示，回答一般用“(动)得”表示肯定或许可，用“(动)不得”表示否定或不许可。普通话中“有没有”的意思，有的方言区用“得不得”来表示。
a、这种舞你会不会跳？
b、你会跳这种舞吗？
c、这种舞你会跳不会跳？
d、这种舞你跳得来跳不来？
e、你跳得来这起舞不？
f、这种舞你跳得来不？ （选对a*b* c*　d e f方）
a、我们不会说谎。
b、我们说不来谎。 （选对a*　b方）
a、我不喜欢闻烟味儿。
b、我闻不来烟味儿。 （选对a*　b方）
a、他不吃辣椒。
b、他吃不来辣椒。 （选对a*　b方）
a、——他会不会不理我？
——不会，他不会。
b、——他得不得不理我？
——不得，他不得。 （选对a*　b方）
a、——他会不会来？
——他不会来。
b、——他得不得来？
——他不得来。 （选对a*　b方）
a、他不会强迫我们走。
b、他不得会强迫我们走。 （选对a*　b方）
a、——他行不行？
——不行，真的不行。
b、——他得不得行？
——不得行，真的不得行。 （选对a*　b方）
a、——你能不能走？
——我能走。／我不能走。
b、——你走得不？
——我走得。／我走不得。 （选对a*　b方）
a、这东西能不能吃？
b、这东西能吃不能吃？
c、这东西吃得不？ （选对a*b*　c方）
二十二、不知道、不认得
普通话里的“不知道、不认得”等表示法，湖北有的地区说成“找不到”。有些地区把“不认得”说成“认不到”或“不会认得到”。有的地区还把否定词“不”移位到“知道”或“认得”之间，或者说成“晓不得”。
a、这件事我不知道。
b、这件事我知不道。
c、这件事我晓不得。 （选对a*　bc方）
a、这个人我不认得。
b、这个人我认不到。
c、这个人我不会认得到。 （选对a*　bc方）
a、这道题怎么答，我不知道。
b、这道题怎么答，我知不道。
c、这道题怎么答，我找不到。
d、这道题怎么答，我晓不得。 （选对a*　bc d方）
a、这事我真的不知道。
b、这事我真的知不道。
c、这事我真的找不到。 （选对a*　bc方）
二十三、动＋宾＋补、动＋补＋宾
补语和宾语都在动词后面，两个成分同时出现时，涉及语序问题。这种顺序有的时候取决于补语，即不同的补语和中心语结合的紧密程度不同。有时候又取决于宾语，即不同的宾语要求有不同的位置。表示结果、程度、可能的补语跟动词关系密切，一般紧接动词谓语后，总是在宾语前面。有些方言把这个补语在宾语之后(如粤、闽、客家等方言)。湖南方言有些也常在否定句中把宾语放在补语前边。
在一些方言里，否定副词和数量补语的语序也常有变化。作为数量补语，在普通话里一般既可放在宾语前，又可置于宾语后，形成“动宾补”和“动补宾”两种句式，但两者表示的意义稍有不同，“动补宾”中更强调“宾语”。
a、我说（比、打、跑）得过他。
b、我说（比、打、跑）他得过。
c、我说（比、打、跑）得他过。 （选对a*　bc方）
a、我说（比、打、跑）不过他。
b、我说（比、打、跑）他不过。
c、我说（比、打、跑）不他过。 （选对a*　bc方）
a、我想看他一下。
b、我想看一下他。
c、我想看他下子。 （选择a≠b*　其中b强调了“他”，a＝b方 c方）
a、我找过他几次。
b、我找过几次他。 （选择a≠b*　其中b强调了“他”，a＝b方）
二十四、双宾语
a、我给他三的苹果。
b、我给三斤苹果他。
c、我苹果给他三斤。
d、我给三的苹果给他。
e、我苹果三斤给他。 （选对a*　bc d e方）
a、送我一件衣服。
b、送一件衣服我。
c、送一件衣服给我。
d、衣服一件送我。
e、衣服送一件给我。 （选对a*c*　bd e方）
二十五、状＋动／形
普通话里，副词与动词、形容词组合时，副词放在被修饰、限制词语前作状语，而有些方言(如广东、广西、上海、福建一些地方)则把它们放在被修饰、限制词语后作补语。
a、别客气，你先走（去、洗、说、看、睡、吃）。
b、别客气，你走（去、洗、说、看、睡、吃）先。
c、别客气，你走（去、洗、说、看、睡、吃）头先。
d、别客气，你走（去、洗、说、看、睡、吃）在先。 （选对a*　bc d方）
a、注意，少喝点酒对身体有好处。
b、注意，喝少点酒对身体有好处。 （选对a*　b方）
a、上海快到了。
b、上海到快了。 （选对a*　b方）
a、汽车快来了。
b、汽车来快了。 （选对a*　b方）
a、他快吃完饭了。
b、他饭吃好快了。 （选对a*　b方）
a、你再吃一碗。
b、你吃一碗添。 （选对a*　b方）
a、他们还没扫干净。
b、他们扫没没干净。 （选对a*　b方）
a、这朵花儿很红。
b、这朵花儿红极。
c、这朵花红得极。 （选对a*　bc方）
```


### 2.6 Table — sections 二十六–三十四 (Source B, verbatim)

> Source A's part（四）is not archived anywhere; this range comes from the 新浪博客 mirror alone.
> Punctuation follows Source B's house style (full-width parentheses, `＋`), which the §2.2 diff
> showed to be the only systematic difference between the two mirrors.


```
二十六、状＋动＋补
在普通话里这种句式中的状语多为“多”或“少”，补语一般都是数量补语。在广西等一些方言里常常把在动词前的状语“多”“少”放在动词后。这样，有的形成了错误的句子，有的句子仍然是正确的，但是“多”“少”等词在功能上发生了变化，句子的意义也发生了变化。
a、你少说两句。
b、你说少两句。
（选对a*　b方）
a、你多吃一点。
b、你吃多一点。
（选择a≠b*　a＝b方）
a、多用一点时间来陪孩子。
b、用多一点时间来陪孩子。
（选对a*　b方）
a、今天多送你一点礼物。
b、今天给送多一点礼物。
（选对a*　b方）
a、请你多拿点儿。
b、请你拿多点儿。
（选择a≠b*　a＝b方）
a、请你多喝两杯。
b、请你喝多两杯。
（选对a*　b方）
二十七、形／动＋补
普通话里“形／动＋补”格式，在湖北、山西等一些方言里有不同的表示法，有的格式上有差别，有的补语用词有不同。
a、衣服叫他弄脏了。
b、衣服叫他弄脏了脏。
（选对a*　b方）
a、这本书给他弄丢了。
b、这本书给他弄丢了丢。
（选对a*　b方）
a、天气热得很。
b、天热得太太。
c、天热得来来。
（选对a*　b c方）
a、他累得满头大汗。
b、他累得汗流。
c、他累得汗滴滴声。
（选对a*　b c方）
a、把桌子搬开了。
b、把桌子搬转了。
（选对a*　b方）
二十八、够＋形、动＋清楚＋了
普通话中有“够＋形”或“动＋清楚＋了”等格式，表示动作或状态达到一定程度。一些方言则用“有＋形”或“动＋有”的格式来表示这种意思。
a、菜够咸了。
b、菜有咸。
（选对a*　b方）
a、我听清楚了。
b、我听有。
（选对a*　b方）
二十九、补　语
普通话里表示可能或不可能的动补结构“动＋得／不＋了”，其中补语“了（liǎo）”在一些方言里说成“倒”或“脱”，有时也说成“起”。普通话里用趋向动词“上”“下”充当的补语，在四川方言中常用“起”。有些动补结构在吴方言和江淮方言中常常重复动词，然后加补语。
a、你们来得了来不了？
b、你们来得倒来不倒？
（选对a*　b方）
a、我们走不了啦。
b、我们走不倒啰。
（选对a*　b方）
a、这件事现在还定不了。
b、这个事情现在还定不倒。
（选对a*　b方）
a、妹妹只吃得了半碗饭。
b、妹妹只吃得倒半碗饭。
（选对a*　b方）
a、没有准备，我发不了言。
b、没有准备，我发不起言。
（选对a*　b方）
a、我们拿不走。
b、我们拿不起。
（选对a*　b方）
a、快把你的东西弄走。
b、快把你的东西弄起走。
（选对a*　b方）
a、这稿子明天写得完吗？
b、这稿子明天写得起吗？
c、这稿子明天写不完。
d、这稿子明天写得完。
e、这稿子明天写不起。
f、这稿子明天写得起。
（选对a* c* d*　b e f方）
a、你躲得了和尚躲不了庙。
b、你躲得脱和尚躲不脱庙。
（选对a*　b方）
a、你站好。
b、你站站好。
（选对a*　b方）
a、我一定要弄清楚。
b、我一定要弄弄清楚。
（选对a*　b方）
三十、比较句
普通话里表示比较的句式中有一类是用“比”字构成的，其基本格式为“甲＋比＋乙＋比较语”。广西等地方有些方言不用“比”字，常用“过”字，其格式为“甲＋比较语＋过＋乙”，或者不用“比、过”一类介词，格式为“甲＋动词／形容词＋乙”。青岛、烟台、威海、潍坊、新泰等有些地区常用的结构为“甲＋形容词＋起＋乙”。而利津一带比较句常见的格式为“甲＋比较语＋的＋乙”。
有些方言区，如济南、泰安、临沂等地，比较句式与普通话相当，但常用“伴”“给”“跟”等代替介词“比”，引进比较对象。还有些方言用“赶、跟、评、品、的”等引进比较对象。
普通话里表示比较的句式中还有一类是用动词“不如”构成的，格式为“甲不如乙＋比较语”。有些方言区，如山东菏泽青州、临朐等地，把“不如”说成“不跟”。
a、牛比猪大很多。
b、牛大过猪很多。
（选对a*　b方）
a、四川省比广东省大。
b、四川省大过广东省。
（选对a*　b方）
a、我唱歌比他好。
b、我唱歌好过他。
（选对a*　b方）
a、骑车比走路快。
b、骑车快过走路。
（选对a*　b方）
a、兔子跑得比乌龟快。
b、兔子跑快乌龟。
（选对a*　b方）
a、你比我矮。
b、你矮我。
c、你比我过矮。
d、你比较矮我。
e、你比我较矮。
（选对a*　b c d e方）
a、我一米六，你一米八，我没有你高。
b、我一米六，你一米八，我不比你高。
（选对a*　b＝a方）
a、一天更比一天好。
b、一天强起一天。
（选对a*　b方）
a、哥哥长的不比我高。
b、哥哥长得不高起我。
c、哥哥长得不高过我。
（选对a*　b c方）
a、这本书不比那本好看。
b、这本书不好看起那本。
c、这本书不好看过那本。
（选对a*　b c方）
a、全班没有比他再聪明的了。
b、全班儿没聪明起他。
（选对a*　b方）
a、他比我高。
b、他赶我高。
c、他跟我高。
d、他评我高。
e、他品我高。
（选对a*　b c d e方）
a、这个不比那个更好。
b、这个不更强的那个。
（选对a*　b方）
a、他跑得不比我快。
b、他跑得不快的我。
c、他跑得不快过我。
（选对a*　b c方）
a、你穿着它不比我穿着好看。
b、你穿着它不好看的我穿着。
（选对a*　b方）
a、这件衣服不如那件漂亮。
b、这件衣服不跟那件漂亮。
（选对a*　b方）
a、我不如他。
b、我不值他。
c、我没有他有料。
（选对a*　b c方）
a、他不会比你差。
b、他不得比你差。
c、差，他就不得来。
d、他不会差过你。
（选对a*　b c d方）
三十一、“把”字句
“把＋宾语＋谓语＋补语”这种“把”字句是普通话里一种很常见的句型。它用介词“把”将谓语动词后的受事宾语提到动词之前，表示对一种事物或现象的处置，谓语动词后常带趋向补语或处所补语。但不些方言区（如山东西部）常常把代词宾语放在动词之后或复合趋向动词（如出来、起来）之间。
a、我们把他抓起来。
b、我们抓他起来。
（选对a*　b方）
a、我把他拉上去。
b、我拉他上去。
c、我拉上他去。
（选对a*　b c方）
a、我把他推到地上。
b、我推他地下。
（选对a*　b c方）
a、他把我关在门外了。
b、他关我门外了。
（选对a*　b方）
三十二、并列关系复句和关联词语
复句是由两个或两个以上意义相关的分句组成的较复杂的句子。复句里各个分句之间都有一定的关系，这种关系常常通过一定的关联词语来表示，几个分句分别说明或描写几件事情、几种情况或同一事物的几个方面，分句间的关系是并举的或者是对举的，这就是并列关系。普通话常用的关联词是“也”“又”“还”“既……又……”“一边儿……一边儿……”“一方面……一方面……”等。有些方言则不同。
a、咱们一边吃饭，一边说话。
b、咱赶着吃饭，赶着说话。
c、咱们一抹儿吃饭，一抹儿说话。（选对a*　b c方）
a、一边看电视，一边打毛衣。
b、一不嘞看电视，一不嘞打毛衣。
c、一不瞧电视，一不地打毛衣。
（选对a*　b c方）
三十三、取舍关系复句和关联词语
选择关系复句里有一类取舍复句，两个分句表示不同的事物，说话者已经决定选取其中一种，舍弃另一种，常用的关联词有“与其……不如……”“宁可……也不……”等。有些方言使用不同的手段表达这种取舍关系。
a、宁肯我去，也不能叫你去。
b、能我去，也不能叫你去。
c、就算我去，也不能叫你去。
d、就是我去，也不能叫你去。
e、情愿我去，也不能叫你去。
（选对a*　b c d e方）
三十四、假设关系复句和关联词语
假设关系复句是指，一个分句假设一种情况，另一分句说明假设的情况实现了就会有怎样的结果，常用“如果（假如、要是）……就……”等关联词语来表明这种关系。山东烟台、威海、荣成、牟平、龙口、蓬莱、长岛等地还有一种很独特的说法：“不着……就……”。它表达的含义比较复杂，相当于普通话的“如果不是因为……就……”。
a、如果不是因为姐姐扶着我，我就跌倒在那儿了。
b、不着姐姐扶着我，我就磕儿那去了。
（选对a*　b方）
a、如果不是因为你，妈妈就不来了。
b、不着你，妈妈就不来了。
（选对a*　b方）
a、如果不是因为你碰它，盘子能打碎吗？
b、不着你碰它，盘子能打了吗？
（选对a*　b方）
```

---

## 4. Vocabulary table — retry 2026-08-30

Re-ran the search per the four concrete targets, this time also using **archive.org's
own Save-Page-Now (SPN) crawler as a proxy** to reach mainland hosts that time out
directly (`web.archive.org/save/_embed/<url>` triggers a live fetch from archive.org's
network, which sits on a different route than this machine). Net result: **still not
found.** No new content surfaced. Below is exactly what was tried and what it returned,
target by target.

### 4.1 Target 1 — `pthxx.cn/zc/xxzl/2019-08-04/11XX.html`, XX 00–30

Did a full CDX enumeration of `pthxx.cn/zc/xxzl/*` (not just the known 1113–1116
grammar-table range) and fetched **every distinct URL that exists** in that folder,
not just the ones with an obvious title:

| URL | Timestamp used | Title |
|---|---|---|
| `.../2019-08-04/1110.html` | `20241016050629` | 普通话水平测试用必读轻声词语表（新大纲） |
| `.../2019-08-04/1114.html` | (known) | 语法差异对照表 pt.1 — already collected |
| `.../2019-08-04/1115.html` | (known) | 语法差异对照表 pt.2 — already collected |
| `.../2019-08-04/1116.html` | (known) | 语法差异对照表 pt.3 — already collected |
| `.../2019-08-04/1117.html` | `20211024122632` | 最容易读错的地名 |
| `.../2019-08-04/1118.html` | `20190923124441` | 最容易读错的姓氏 |
| `.../2019-08-04/1119.html` | `20211024135411` | 容易写错的字 |
| `.../2019-08-04/1120.html` | `20211024120520` | 普通话测试中容易读错字词汇总 |
| `.../2019-08-04/1121.html` | `20211024113655` | 汉语拼音方案 |
| `.../2023-03-21/1536.html` | `20230927173556` | 汉字部首表 |

That is **the complete CDX index for this folder** (11 URLs total, confirmed via
`collapse=urlkey` with no truncation). No entry titled anything resembling
《普通话与方言词语对照表》. **Target 1 exhausted — confirmed negative, not just a gap in
the earlier sweep.**

### 4.2 Target 2 — `blog.sina.com.cn/s/blog_612df69d0100*` (the grammar-table blogger)

The blogger is **`c007525`** ("坐看云起"), blog uid `1630402205`. This was not
previously identified; finding it opened a real new avenue — the blogger's post
catalog (`blog.sina.com.cn/s/articlelist_1630402205_<category>_<page>.html`), most of
which had never been archived, so each catalog page had to be captured live via SPN
(`web.archive.org/save/_embed/...` → poll CDX → replay `id_`).

Chased the actual same-blogger 前一篇/后一篇 (prev/next) chain out from the grammar-table
posts first:
```
je38 "第三节 四方异声──普通话和方言(2)"  →  ihu2 "语法差异对照表(1)"  →  ihu0 "语法差异对照表(2)"  →  je3o "第二课 字音档案" → ikzk "普通话音系介绍" → je3v "第三节 迷幻陷阱——'误读'和'异读'(2)"
```
None of the neighbors is the vocabulary table — this blogger runs a general Chinese-teaching
blog (阅读/写作/高考备考), and the grammar table appears to be a one-off repost embedded in a
larger "普通话和方言" teaching unit. `je38` itself (the title most suggestive of dialect content) could
**not be captured**: SPN returned a CDX record (`20260829165415`) but every replay of that
timestamp 404s or redirect-loops back to the save endpoint — the capture never
persisted (archive.org had a "temporarily offline" outage mid-session, which likely
ate this one save). Retried 4 times over ~2 minutes with no success; did not force
further retries once 429 (rate-limited) responses started appearing on adjacent IDs.

Then searched the blogger's full catalog by category (each category fetched via SPN,
titles extracted and scanned for 方言/词语/对照 keywords — none matched):

| Category ID | Name | Pages checked | Posts scanned | Result |
|---|---|---|---|---|
| 0 | 博文 (all) | 1, 2 | ~100 | No match (life/health/education miscellany, 2010–2012) |
| 10 | 语文教学-基础 | 1 (full — only 1 page) | 51 | No match (all gaokao poetry/grammar/文言文 prep) |
| 12 | 生活语文 | 1 | 50 | No match (word-play, 对联, 修辞 trivia) |
| 13 | 练习试卷 | 1 (full — only 1 page) | 13 | No match (gaokao exam papers, one school at a time) |

Categories 1 (语文教学-作文), 3–9, 11 were not checked — time-boxed after 4 full
categories with zero hits and a consistent pattern (this is a personal Jiangxi
high-school Chinese teacher's blog, not a PSC materials repository). **Target 2:
no new content found; treated as low-remaining-yield, not exhaustively proven negative.**

### 4.3 Target 3 — domain sweeps

- **`pthxx.cn`** — already domain-swept by the prior session; §4.1 above re-confirms
  the one folder most likely to hold it is fully enumerated and negative.
- **`mandarin.edu.hk`** (香港普通話研習社) — ran a fresh domain-wide CDX sweep
  (3,134 URLs). Found the site's CMS post index (`index.php?route=post/post/show&post=N`,
  IDs 1–60, 49 with captures) and fetched **every single one**. All are news/course
  announcements (比賽得獎名單, 課程時間表, 招聘, ERB課程, etc.) — including post 21
  ("普通話詞彙", about pronunciation of current-affairs terms like "一帶一路", not the
  appendix) and post 38 ("公開試情報(PSC)", the structure/count page already quoted in
  §0.2). **No post contains the table.** Domain confirmed exhausted for this content type.
- **`cle.hkust.edu.hk/tests/psc/*`** — fetched the two pages not previously read,
  `psc/psc/content` (測試內容和範圍) and `psc/psc/details` (測試詳情). The `content` page
  gives the fullest citation list found anywhere in this search:
  ```
  (1)《普通話水平測試用普通話詞語表》— 《詞語表一》(6593條) 《詞語表二》(10448條)
      《普通話水平測試用必讀輕聲詞語表》(546條) 《普通話水平測試用兒化詞語表》(548條)
  (2)《普通話水平測試用普通話與方言詞語對照表》─《方言對照表》(945組)
  (3)《普通話水平測試用普通話與方言常見語法差異對照表》─《語法對照表》(34類)
      附：《普通話水平測試用普通話常見量詞、名詞搭配表》─《量詞、名詞搭配表》(45組)
  (4)《普通話水平測試用朗讀作品》─《朗讀作品》(400字/篇,60篇)
  (5)《普通話水平測試用話題》─《測試話題》(30題)
  ```
  Source: `https://web.archive.org/web/20221207083549id_/https://cle.hkust.edu.hk/tests/psc/psc/content`,
  captured 2022-12-07, retrieved 2026-08-30. Confidence: **high** (primary PSC test centre, direct fetch, no proxy).
  **Note the count discrepancy:** this HKUST page says **945組** for the dialect-vocabulary table and **34類** for the grammar table (i.e. the *older*, superseded 34-category edition), while §0.2 (mandarin.edu.hk, 2021 edition) says **949條 / 35類**. The two HK test centres are citing two different editions of the 《大纲》 side by side — reinforces the existing edition-uncertainty caveat already on record for the grammar table, and shows the same ambiguity applies to the vocabulary table's exact entry count (945 vs 949 depending on edition). Still **only a citation, not the table body** — no entries reproduced.
- **`pthcenter.hksyu.edu`** — the one content URL found in CDX (`info-putonghua-test`,
  redirect target) returned an empty body on replay (redirect chain didn't resolve
  through Wayback). Not pursued further — low remaining budget, no title-level signal
  this page ever held the table specifically.

### 4.4 Target 4 — probe-string search

No native web-search tool is available in this environment (Bash-only). Reused the
search-engine HTML endpoints already proven reachable in the prior session
(`bing1.html`, `ddg.html`, `mojeek.html`, `se_baidu.html`, `se_sogou.html`,
`searx1.json` already in this scratchpad from 2026-08-29) rather than re-querying —
the prior session's §5.3 already ran ~10 searches with distinctive strings (949条,
方言区 names, 傍晚/白天/蟑螂/玉米-style probes) and logged every hit as a description
page, book-listing page, or paywalled mirror, never full text. Did not duplicate that
work with fresh queries this session; instead spent the time budget on the three
concrete-URL targets above, which were more likely to yield verifiable new ground.

### 4.5 New negative evidence: SPN confirms the two `#1.1` best leads are unreachable network-wide, not just from here

Triggered `web.archive.org/save/_embed/<url>` (archive.org's own crawler, a different
network path than this machine) against the two highest-value leads on record:

- `doc.quark.cn/preview/jiaoyukaoshi-biji-K12/8EA36859FB8B9306AB17F26157F2042F` → **HTTP 523** (Cloudflare "origin unreachable") **from archive.org's network too.**
- `www.ywcbs.com/app/pthspcs/files/basic-html/page5.html` → **HTTP 523**, same.

This upgrades the earlier "unreachable from this machine" finding to "unreachable from
two independent network paths" — stronger evidence these hosts are down/blocking
broadly, not a local network artifact. A retry from yet another network is still the
correct next step for these two specifically, per the existing §1.1 table.

### 4.6 Net effect

**The vocabulary table remains entirely unfound.** No verbatim entries beyond the two
already on record in §1.2 can be added. New, load-bearing findings from this pass:
the grammar-table blogger's identity and full catalog (now provably exhausted for this
content, category budget permitting), the complete `pthxx.cn/zc/xxzl/` folder listing
(provably exhausted), the complete `mandarin.edu.hk` post index (provably exhausted),
the fullest citation of all appendix tables' names/counts found anywhere
(`cle.hkust.edu.hk/tests/psc/psc/content`), and independent confirmation that the
`quark.cn`/`ywcbs.com` leads are unreachable from a second network path. No entries
were invented; nothing here should be used to author dataset rows.

---

## 5. Current-edition appendices — 2026-08-30

Session goal: resolve whether the 2021-edition (effective 2024-01-01) grammar table
really has 35 categories (vs. the 34 we hold, §2 above), get the name/examples of
the 35th category if possible, and/or find the 949-entry vocabulary table.

**Network reality confirmed again this session:** every mainland host attempted
(`docin.com`, `jinchutou.com`, `max.book118.com`, `wenku.baidu.com`, `toutiao.com`,
`*.edu.cn` teaching-affairs sites, `ywcbs.com` non-Wayback paths) either hard
timed-out on direct `curl`, or — for `toutiao.com`/`scribd.com` — returned a
JS/Cloudflare bot-challenge page instead of content. `r.jina.ai` again returned
`401 AuthenticationRequiredError ... bad network reputation (AS30058)` on every
URL tried. **New working proxy found this session: `translate.google.com/translate?sl=zh-CN&tl=en&u=<url>`**
successfully fetched `max.book118.com` and one `wenku.baidu.com` page (both otherwise
mainland-unreachable) — worth reusing in a future session, though it only forwards
whatever the origin serves an anonymous/non-paying visitor (i.e. still hits paywalls).
Plain `google.com` / `bing.com` scraping was **not usable**: Google redirected to a
JS challenge page with no extractable results, and Bing (from this IP) returned an
unrelated Japanese-market result set for a Chinese query — both dead ends distinct
from the Wayback/DDG-html paths that did work.

### 5.1 VERIFIED — the 2021 edition changed the grammar table from 34 to 35 categories, and this is corroborated independently of the HK source in §0.2

This is the headline result of this session: an **official interpretive bulletin**,
authored by the same body that publishes the 《纲要》 itself, states explicitly that
the grammar-difference table's category count changed 34→35, and describes the
*mechanism* (categories restructured, some example sentences revised/added/removed) —
this is a materially stronger source than the bare "(含35類)" count on the HK exam-prep
page already in §0.2, because it independently confirms the number **and** explains
why it changed, from the standards body itself.

**Provenance:** The bulletin is titled 新版《普通话水平测试实施纲要》解读
("Interpretation of the New Edition of the *Implementation Outline*"), byline
**国家语委普通话与文字应用培训测试中心** (National Language Commission's Putonghua
and Written Language Application Training and Testing Center — the body that compiled
and publishes the 《纲要》). I found it reproduced verbatim on **three independent
university 语言文字工作网 (language-work office) pages**, all mainland-hosted and
unreachable by direct `curl` from here, so all three were retrieved via Wayback:

| # | Mirror | Origin URL | Retrieved via | Dateline on page |
|---|---|---|---|---|
| 1 | 东北石油大学 (nepu.edu.cn) | `https://ztw.nepu.edu.cn/yw/info/1158/2035.htm` | `http://web.archive.org/web/20260610185049id_/…` | posted 2024/06/18 on the page |
| 2 | 陕西师范大学 (snnu.edu.cn) | `https://yywz.snnu.edu.cn/info/1167/2218.htm` | `http://web.archive.org/web/20260608022929id_/…` | "发布时间：2023年08月30日 15:34　作者：国家语委普通话与文字应用培训测试中心" |
| 3 | 上海商学院 (sbs.edu.cn) | `https://www.sbs.edu.cn/yywz/ywxx/e3cd55687cb84f37a80aff649eb74339.htm` | `http://web.archive.org/web/20250901093521id_/…` | cites its own source as `https://shysc.shec.edu.cn/DocHtml/1/Article_20239121121.html` (上海市教师教育学院, 2023-09-27) |

All three retrieved 2026-08-30. A fourth candidate mirror, `ysxy.nnvtu.edu.cn` (南宁职业技术大学), turned up in the same search but has **zero Wayback captures** — not used.

**Fidelity check:** I diffed the three bodies by eye over the whole "三、新版纲要的主要内容及变化" section — they agree word-for-word except for cosmetic punctuation/spacing differences and mirror #1 lightly restructuring bullet formatting. Mirror #2 additionally carries an explicit byline and date that names the same issuing body as mirror #3's cited original. Three independently-hosted university offices reproducing the same institutional bulletin verbatim, one of them naming its date/author, is strong evidence this is a faithful copy of a genuine 国家语委 release (though I could not reach an origin `moe.gov.cn`/`gjdev.gov.cn`/language-commission copy directly — see network-reality note above).

**Confidence: high.**

**Verbatim quote (mirror #2, 陕西师范大学, chosen because it carries the explicit byline/date):**

```
"普通话水平测试用普通话与方言常见语法差异对照表"部分，根据语言应用和测试实践的发展变化，
对语法差异类别、内容表述等做出修订，总类别由34个调整为35个；根据情况对部分例句作了修改、
增补和删除。从搭配的规范度、常用性等方面对普通话水平测试用普通话常见量词名词搭配表进行梳理调整。
```

Translation (mine, for orientation only — not to be treated as an authoritative rendering):
"The 'Putonghua-Dialect Common Grammar Difference Comparison Table' section was revised
in line with the development of language use and testing practice, revising the grammar-
difference categories and their content descriptions; **the total category count was
adjusted from 34 to 35**; some example sentences were modified, added, or deleted as
appropriate. The 'Putonghua Common Measure-word/Noun Pairing Table' was also reviewed
and adjusted for pairing normativity and frequency of use."

**What this resolves from §2.3:** the "open risk" flagged there — that the HK page's
"(含35類)" figure might be imprecise, or that both our 34-category mirrors might be
missing a final section — is now resolved in favor of possibility (1): **the 2021
edition genuinely added one grammar category**, confirmed independently of the HK
source. The 34-category table in §2 of this file should be treated as **the superseded
2003/2004 edition**, accurate for that edition, but **short exactly one category**
relative to the 2021/current edition now in force.

**What this does NOT resolve:** the name of the 35th category, its example sentences,
or which of the 34 existing categories (if any) were merged/renamed rather than one
being purely added. The bulletin describes the *type* of change ("调整" — categories
restructured, not simply appended) without itemizing it. **Do not infer a specific
category name (e.g. "转折关系复句", "条件关系复句") from this bulletin — it names
none.** I searched directly for four plausible candidates (转折/因果/条件/递进
关系复句 — the natural remaining 复句 types, given 32–34 are 并列/取舍/假设) via
DuckDuckGo and got **zero results** for all four; that absence is not evidence either
way, just an unresolved gap.

### 5.2 Same bulletin — incidental confirmation on the vocabulary side (adjacent table, not the 949-entry one)

The same three mirrors also state the count for a **different, adjacent** appendix —
《普通话水平测试用普通话词语表》(the *Putonghua* word list, "表一"+"表二"), **not**
《…与方言词语对照表》(the *dialect-comparison* table we actually want, ~949 entries
per §0.2). Recording this so it is not confused with the target table in future work:

```
《普通话水平测试用普通话词语表》仍由"表一""表二"和3个附表组成，主要遵照或参照2004年
以来公（发）布的语言文字规范标准及出版的权威辞书等，调整了原词表的部分词形、读音、汉语
拼音标注，增删了部分字词。修订后共收词语 18442条，其中"表一"8361条，"表二"10081条。
3个附表为《普通话水平测试用普通话词语用字统计》《普通话水平测试用必读轻声词语表》
《普通话水平测试用儿化词语表》。
```

The bulletin **confirms 《…与方言词语对照表》 exists as one of the 《纲要》's seven parts**
("仍由《总论》《普通话语音分析》和《普通话水平测试用普通话词语表》《普通话水平测试用普通话
与方言词语对照表》《普通话水平测试用普通话与常见语法差异对照表》《普通话水平测试用朗读作品》
《普通话水平测试用话题》等七部分构成") but gives **no entry count and no content** for it,
and says only that the grammar/measure-word tables (not this one) had content changes —
it does not state whether the 949-entry dialect-vocabulary table changed at all between
editions. **Confidence: high** (same three-mirror sourcing as §5.1) for what it says;
**silent, not negative**, on whether the vocabulary table itself was revised.

### 5.3 Dead ends worked this session (angle-by-angle)

| Angle | What was tried | Result |
|---|---|---|
| **(1) HK training bodies** | `site:hkeaa.edu.hk`, `site:polyu.edu.hk`, `site:cuhk.edu.hk`, `site:hkbu.edu.hk`, `site:cityu.edu.hk` combined with 普通話水平測試/語法差異對照表, via DuckDuckGo html endpoint | **Zero results for every query.** DDG's index has effectively no coverage of these institutional domains for this topic. mandarin.edu.hk / cle.hkust.edu.hk (already in §0.2) remain the only working HK sources and were not re-scraped for new content this session. |
| **(2) Taiwan/overseas booksellers** | `search.books.com.tw` (博客來) — redirected to homepage, no results extracted. `sanmin.com.tw` (三民書局) — search page loaded (HTTP 200) but the results area contained only site chrome/navigation, no product listing: the title itself only appears once, in the search-box echo. | **Not carried by either store searched.** (The 解读 bulletin in §5.1 confirms a 繁体字版 was distributed "国（境）内外" from 2023-08, so an overseas retail listing may exist elsewhere — not found here.) |
| **(3) Book-preview surfaces** | Google Books API (`googleapis.com/books/v1/volumes`) → `429 quota exceeded` (shared/anonymous quota, not query-specific). `books.google.com.hk` web search → redirected into the same JS-challenge Google results page as plain `google.com`, no results extracted. `max.book118.com` doc `5321141032004010` (titled with a **2021-09-16** timestamp, i.e. plausibly the just-finalized 2021 edition) — reached via the `translate.google.com` proxy, but the free preview cuts off after the 说明 preamble (identical boilerplate to the 2004-edition text already in §2.5) and never reaches category content, so **it does not resolve which edition's text it actually is**. `wenku.baidu.com/view/cbe1f3932…` — also reached via the same proxy, preview cuts off at the same point (end of 说明), before any numbered category. A second `wenku.baidu.com` doc (`c15e65651a…`, titled "…修订…") hit a 百度安全验证 (Baidu security checkpoint) even through the proxy. |
| **(4) `ywcbs.com` Wayback sweep** | Re-ran the CDX query for `ywcbs.com/app/pthspcs*` (both `matchType=domain` and plain prefix) — **only `files/basic-html/index.html` is captured, one snapshot, confirmed again.** Separately found the publisher's own new-book listing page (`ywcbs.com/wssd/xssj/202309/t20230911_1137.html`, ISBN 9787518712335, ¥89.00, ed. 国家语委培训测试中心) via Wayback (`20250708164754`) — its "在线阅读" (read online) button links to the exact same `http://www.ywcbs.com/app/pthspcs/` flipbook already exhausted, so this is not a new access path, just confirmation that the flipbook the earlier session found *is* the 2021-edition book's official reader. |
| **(5) Academic papers / theses** | DuckDuckGo-html searches surfaced the 解读 bulletin (used in §5.1/5.2) plus several document-sharing mirrors (`docin.com/p-4308371016.html`, `jinchutou.com/shtml/16c45dd…`, both titled "…修订…") — **all mainland-hosted, all connection-timed-out on direct curl, and none has a Wayback capture** (`archive.org/wayback/available` returned `archived_snapshots: {}` for each). `scribd.com` hosts two relevant PDFs (`/document/784683557/` = the 《纲要》2021 itself; `/document/1061338079/` = 《…与方言词语对照表》) and both load (HTTP 200) but serve a Cloudflare **"Client Challenge"** page instead of content on direct `curl`, and the `translate.google.com` proxy does not help with Cloudflare-gated sites (it needs the origin to actually serve HTML). `toutiao.com` (今日头条) article `7550297552080454183` loads but its body is JS-rendered and the static HTML has no article text (bot-challenge JS, not real content). No CNKI/万方/semanticscholar abstract surfaced in these searches that discusses the grammar-table content specifically (only this 解读 bulletin, which is a summary bulletin, not a paper). |

### 5.4 Net effect on the dataset decision

- Section §2's 34-category table should continue to be treated as the **superseded**
  (2003/2004) edition — now with **independent, high-confidence confirmation** (not
  just the single HK exam-prep page) that the current (2021, in force since 2024-01-01)
  edition has 35 categories, one more than we hold.
- The **name, definition, and example sentences of the 35th category remain unknown**
  after this session's search. No dataset item should be authored *as* the 35th
  category's content — that would be fabrication. The existing archive-stamped caveat
  from the prior commit (`docs(evidence): confirm the grammar-table edition gap and
  stamp the affected rows`) remains the correct posture: mark affected rows as sourced
  from the superseded edition, do not invent a 35th-category row.
- The 949-entry 《…与方言词语对照表》 remains **entirely unfound** — this session found
  no new content for it, only reconfirmation that a `scribd.com` copy exists but is
  Cloudflare-gated, and that unrelated document-sharing mirrors of it are all
  mainland-hosted and unreachable with no Wayback fallback.
