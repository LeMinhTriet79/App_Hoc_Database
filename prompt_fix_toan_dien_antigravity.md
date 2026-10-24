# SIÊU PROMPT & BỘ ĐẶC TẢ SỬA LỖI TOÀN DIỆN DỰ ÁN `App_CSDL` (DÀNH CHO AI AGENT ANTIGRAVITY)

> **Hướng dẫn sử dụng cho sinh viên:** Em hãy copy toàn bộ nội dung file Markdown này (hoặc đính kèm trực tiếp file `PROMPT_FIX_TOAN_DIEN_ANTIGRAVITY.md` này vào khung chat của **Antigravity**) và ra lệnh:
> *"Hãy đọc kỹ toàn bộ Báo cáo Kiểm toán Code và thực thi tuần tự từ TASK FIX 01 đến TASK FIX 08 trong file `PROMPT_FIX_TOAN_DIEN_ANTIGRAVITY.md`. Tuyệt đối không bỏ sót bất kỳ mục nào, khôi phục đầy đủ 100% hình minh họa SVG/Sơ đồ trực quan, sửa toàn bộ lỗi lệch Schema của 16 chương và 77 bài tập, và tối ưu hóa hoàn chỉnh bố cục trình duyệt [98.css](https://jdan.github.io/98.css/)."*

## PHẦN 1: BÁO CÁO KIỂM TOÁN CODE CHI TIẾT (LINE-BY-LINE CODE AUDIT REPORT)

Sau khi kiểm tra trực tiếp toàn bộ mã nguồn trong thư mục dự án `App_CSDL` (bao gồm `index.html`, `src/ui/app-engine.js`, `src/data/simulators.js`, `src/data/leetcode-challenges.js`, `src/data/interview-bank.js`, `src/data/appendices.js`, `assets/css/retro-98-browser.css` và đối chiếu với 16 file chương `src/data/chapters/ch00..ch15.js` cùng 7 file CSDL `src/data/databases/db-*.js`), dưới đây là **10 lỗi nghiêm trọng (Critical Bugs & Layout Flaws)** khiến ứng dụng bị mất hình minh họa, hiển thị rỗng nhiều mục, hỏng máy chấm bài tự động và bố cục chưa hoàn thiện:

| Mã lỗi | File & Vị trí dòng lỗi | Hiện tượng lỗi trên giao diện | Nguyên nhân gốc rễ (Root Cause) |
| :--- | :--- | :--- | :--- |
| **BUG-01** | `src/ui/app-engine.js` (Dòng 977–1210) & `src/data/simulators.js` | **Mất sạch toàn bộ hình minh họa trực quan (SVG Venn, Cây B+Tree 3 tầng, Sơ đồ Timeline, Sơ đồ AST)** trong 6 Bộ Mô Phỏng và mất 7 sơ đồ ERD tại Trang chủ. | `renderJoinSimulator` chỉ in mấy dòng chữ `venn_ascii` thay vì vẽ đồ họa vector `<svg>` 2 vòng tròn giao nhau có `<clipPath>` đổi màu động và chạy từng bước ghép cặp dòng. `renderBTreeSimulator` xóa mất sơ đồ cây 3 tầng (1 Root Page -> 3 Intermediate Pages -> 6 Leaf Pages) có highlight đường đi Index Seek. `renderTocView` bỏ quên phần hiển thị 7 sơ đồ ERD của 7 CSDL mẫu. |
| **BUG-02** | `src/ui/app-engine.js` (Dòng 597–768) | **Chương 15 mất trắng toàn bộ 64 Thẻ Từ Khóa T-SQL 4 Phần** (phần giá trị nhất của file `ch15-tsql-keyword-dictionary-fruitstore.js` nặng 245 KB). | Hàm `renderChapterView(chapterId)` không hề đọc mảng `ch.keyword_cards`! Khi mở Chương 15 (hoặc bấm nút `🍎 FruitStore`), toàn bộ 44 thẻ Phần A (Cốt lõi) và 20 thẻ Phần B (Nâng cao) kèm thanh lọc nhóm và ô tìm kiếm biến mất hoàn toàn. |
| **BUG-03** | `src/ui/app-engine.js` (Dòng 682–690) | **Bảng "5. Khác Biệt Phương Ngữ" ở tất cả 15 chương (Ch01–Ch15) đều trống trơn 4 cột**. | Trong `ch01..ch15.js`, `ch.dialects` là mảng 2 chiều `[[tác_vụ, tsql, mysql, pg_sqlite], ...]`. Nhưng dòng 687 lại viết `d.feature`, `d.tsql`, `d.sqlite`, `d.postgres_mysql` (truy cập kiểu Object trên một Array), trả về `undefined` toàn bộ! |
| **BUG-04** | `src/ui/app-engine.js` (Dòng 707–718) | **Mục "8. Các Bẫy & Lỗi Hay Gặp" ở tất cả 15 chương chỉ hiện khung trống** `Lỗi #1: Cảnh báo`, không có nội dung. | Trong `ch01..ch15.js`, `ch.common_errors` là mảng các chuỗi văn bản `["Lỗi 1...", "Lỗi 2..."]`. Nhưng dòng 711–714 lại viết `err.title`, `err.wrong`, `err.right`, `err.why` khiến nội dung lỗi bị bỏ qua 100%. |
| **BUG-05** | `src/ui/app-engine.js` (Dòng 720–732) | **Mục "9. Câu Hỏi Phỏng Vấn" trong từng chương bị mất đáp án** khi bấm mở `<details>`. | Trong `ch01..ch14.js`, câu trả lời nằm ở 2 trường `iv.a_short` (đáp án ngắn) và `iv.a_long` (phân tích sâu); ở `ch15.js` nằm ở `iv.full`. Nhưng dòng 727 lại gọi `iv.a` và `iv.followup`, làm mất sạch câu trả lời của 45 câu hỏi phỏng vấn cấp chương! |
| **BUG-06** | `src/ui/app-engine.js` (Dòng 668–680 & 692–700) | **Mục 4 mất bảng kết quả mẫu `ex.result` và nhãn `[CHUẨN]`/`[T-SQL]`; Mục 6 code Java & C# bị dính chữ thành 1 dòng**. | Mục 4 không gọi `renderResultTableHtml(ex.result)`. Mục 6 nhét thẳng chuỗi code thuần `ch.bridge_java` và `ch.bridge_csharp` vào thẻ `<div>` thay vì `<pre class="code-block"><code>`, làm mất hết xuống dòng `\n` và thụt lề code! |
| **BUG-07** | `src/ui/app-engine.js` (Dòng 754–763) | **Mục 11 cuối mỗi chương bị mất "Bảng Tóm Tắt Kiến Thức (`ch.summary_table`)" và "3 Câu Hỏi Tự Kiểm Tra (`ch.quiz`)"**. | Hàm `renderChapterView` bỏ qua không render `ch.summary_table` (mảng 2 chiều 3 cột) và `ch.quiz` (`[{ q, a }]`), đồng thời thiếu thanh nút chuyển **Chương trước / Chương tiếp theo** ở chân trang. |
| **BUG-08** | `src/ui/app-engine.js` (Dòng 189–296 & 734–752 & 842–882) | **Máy chấm bài tự động (`gradeSqlProblem`) bị hỏng cho toàn bộ 65 bài tập của Chương 1–15!** | Trong `ch01..ch15.js`, 65 bài tập (`basics` và `practice`) lưu câu SQL đáp án ở `problem.sql` và tập kết quả chuẩn ở `problem.expected` (`{ cols, rows }`), KHÔNG có trường `problem.solution_sql`! Dòng 246 gọi `sqlDatabases[dbId].exec(problem.solution_sql)` gây lỗi ngay lập tức khi chấm bất kỳ bài tập nào thuộc Ch01–Ch15. Ngoài ra, bài tập `basics` không có sẵn `ex.id` mà dùng `ch.id + "_b" + ex.num`. |
| **BUG-09** | `src/ui/app-engine.js` (Dòng 770–840) | **Bố cục Phòng Lab SQL (`renderLabView`) xếp dọc 1 cột bất tiện, thiếu Dropdown chọn 77 bài tập, thiếu cột Sơ đồ ER cạnh chỗ gõ code và mất nút `EXPLAIN QUERY PLAN`**. | Người học không thể chọn bài tập trực tiếp trong Phòng Lab, vừa gõ SQL vừa phải bấm mở popup mới xem được tên bảng/cột trong ERD, và không chạy được `EXPLAIN QUERY PLAN` để học Chương 8 (Index & Execution Plan). |
| **BUG-10** | `src/ui/app-engine.js` (Dòng 370–417, 1215–1351) & `assets/css/retro-98-browser.css` | **Cây mục lục trái chỉ có nhánh con cho Ch01–Ch05 (Ch06–Ch15 bị cụt); Phòng phỏng vấn thiếu đồng hồ bấm giờ 15 phút & chế độ lật thẻ; Sổ tay 3 dòng trống trơn; xung đột CSS ở Dark/CRT Theme**. | Vòng lặp `renderLeftTocTree` quên vẽ nhánh con `1..11` cho Ch06–Ch15. `renderNotesView` không nạp sẵn 77 thẻ ghi chú 3 dòng (`idea`, `syntax`, `trap`) từ `p.note3`. CSS dùng màu nền cứng `#fff0f0` / `#f0fff0` làm chói mắt khi bật giao diện Borland hoặc CRT. |

## PHẦN 2: BẢNG ĐỐI CHIẾU SCHEMA DỮ LIỆU THẬT TRONG `ch01..ch15.js` & `db-*.js`

Khi sửa `src/ui/app-engine.js`, AI Agent **BẮT BUỘC** phải đọc đúng tên trường (key) thực tế đang nằm trong các file `src/data/chapters/ch01..ch15.js` và `src/data/databases/db-*.js` theo bảng đối chiếu chuẩn xác 100% dưới đây:

| Thành phần dữ liệu | Code cũ của Antigravity đang gọi (SAI) | Cấu trúc thật trong `ch01..ch15.js` & `db-*.js` (ĐÚNG — BẮT BUỘC DÙNG) |
| :--- | :--- | :--- |
| **Ví dụ thực tế (`ch.examples`)** | Chỉ đọc `ex.title`, `ex.sql`, `ex.note` | Đọc đủ: `ex.title`, `ex.label` hoặc `ex.tag` (`"CHUAN"` / `"CHUẨN"` hoặc `"TSQL"`), `ex.db`, `ex.sql`, `ex.note` (hoặc `ex.desc`), và bảng kết quả mẫu `ex.result` (`{ cols: [...], rows: [[...]] }`). |
| **Từ điển 64 thẻ T-SQL (`ch15.keyword_cards`)** | *Bỏ trống không đọc* | Mảng `ch.keyword_cards`: mỗi thẻ có `id`, `part` (`"A"` hoặc `"B"`), `category`, `keyword`, `part1_what` (hoặc `what_it_does`), `part2_backend` (hoặc `backend_scenario`), `part3_tsql` (hoặc `tsql_code`), `lab_sql`, và `part4_output` (hoặc `output`: `{ cols: [...], rows: [[...]] }`). |
| **Khác biệt phương ngữ (`ch.dialects`)** | `d.feature`, `d.tsql`, `d.sqlite`, `d.postgres_mysql` | Hỗ trợ cả hai: Nếu `Array.isArray(d)` thì đọc `d[0]` (Tác vụ), `d[1]` (SQL Server T-SQL), `d[2]` (MySQL), `d[3]` (PostgreSQL / SQLite). Nếu là Object thì đọc `d.feature`, `d.tsql`, `d.sqlite`, `d.postgres_mysql`. |
| **Cầu nối Backend (`ch.bridge_java`, `ch.bridge_csharp`)** | `'<div>' + ch.bridge_java + '</div>'` | Chuỗi mã nguồn Java và C# có ký tự xuống dòng `\n`. Phải escape HTML và bọc trong `<pre class="code-block"><code>...</code></pre>`, có nút Sao chép và lọc theo `state.langMode` (`"both"` / `"java"` / `"csharp"`). |
| **Lỗi hay gặp (`ch.common_errors`)** | `err.title`, `err.wrong`, `err.right`, `err.why` | Trong `ch01..ch15.js`, mỗi phần tử `err` là một `string`! Phải kiểm tra `if (typeof err === "string")` để hiển thị nguyên văn chuỗi lỗi trong danh sách `<ol class="error-list">`, nếu là object mới đọc `err.title`. |
| **Câu hỏi phỏng vấn chương (`ch.interview`)** | `iv.q`, `iv.a`, `iv.followup` | Đọc `iv.level`, `iv.q`, câu trả lời ngắn `iv.a_short || iv.a || iv.full`, và câu trả lời chi tiết `iv.a_long || iv.followup || ""`. |
| **Bài tập cơ bản (`ch.basics`)** | `ex.id`, `ex.problem` | Tạo ID chuẩn: `var pId = b.id || (ch.id + "_b" + b.num);`. Đọc đề bài `b.problem || b.prompt`, gợi ý `b.hints` (mảng) + `b.intuition` + `b.trace`, lời giải `b.sql`, và bảng kết quả chuẩn `b.expected` (`{ cols, rows }`). |
| **Bài tập thực hành (`ch.practice`)** | Gộp chung với `basics`, mất phân tích | Đọc `p.id`, `p.title`, `p.difficulty`, `p.db`, đề bài `p.summary || p.prompt`, bộ 4 phân tích (`p.understand`, `p.brute`, `p.optimal`, `p.pitfalls`), `p.trace`, lời giải `p.sql`, bảng kết quả `p.expected` (`{ cols, rows }`), và ghi chú 3 dòng `p.note3` (`{ idea, syntax, trap }`). |
| **Tổng kết & Quiz (`ch.summary_table`, `ch.quiz`)** | *Bỏ trống không đọc* | `ch.summary_table` là mảng 2 chiều `[[khái_niệm, ý_nghĩa, ghi_chú], ...]`. `ch.quiz` là mảng `[{ q, a }]` hiển thị dạng thẻ `<details>` lật đáp án. |

## PHẦN 3: DANH SÁCH 8 TASK THỰC THI TUẦN TỰ CHO ANTIGRAVITY

Hãy thực hiện lần lượt từ **TASK FIX 01** đến **TASK FIX 08** dưới đây. Không tự ý rút gọn bất kỳ đoạn mã hay sơ đồ trực quan nào.

### TASK FIX 01: CẬP NHẬT `index.html` — BỔ SUNG BỘ LỌC NGÔN NGỮ BACKEND (JAVA / C#) TRÊN TOOLBAR & CHUẨN HÓA CẤU TRÚC KHUNG

**Mục tiêu:** Trong `index.html`, bổ sung bộ chọn chế độ hiển thị ngôn ngữ Backend (`#lang-mode-select`: `Cả Java & C#`, `Chỉ Java (JDBC/JPA)`, `Chỉ C# (ADO.NET/EF)`) lên `#tool-bar` để sinh viên theo nhánh Java hoặc .NET có thể lọc nhanh toàn bộ Mục 6 của 16 chương.

**Hành động:** Mở file `index.html`, tìm thẻ `<div id="tool-bar" ...>` và cập nhật khu vực chọn cỡ chữ / ngôn ngữ / giao diện như sau:

```html
      <!-- TẦNG 3: 2000s BROWSER & CHM STANDARD BUTTONS TOOLBAR -->
      <div id="tool-bar" role="toolbar" aria-label="Thanh công cụ trình duyệt">
        <button id="btn-toggle-pane" title="Ẩn/Hiện khung điều hướng trái (F6)">🗀 Ẩn/Hiện Cột</button>
        <div class="toolbar-sep"></div>
        <button id="btn-nav-back" title="Quay lại trang trước (Alt+Left)">◀ Back</button>
        <button id="btn-nav-forward" title="Tiến tới trang sau (Alt+Right)">Forward ▶</button>
        <button id="btn-nav-refresh" title="Làm mới trang hiện tại">🔄 Refresh</button>
        <button id="btn-nav-home" title="Về Bảng Mục Lục Tổng Quan">🏠 Home</button>
        <div class="toolbar-sep"></div>
        <button id="btn-go-lab" title="Mở Phòng Lab SQLite WASM">🧪 SQL Lab</button>
        <button id="btn-go-fruit" title="Mở Chương 15: Từ điển T-SQL &amp; Cửa hàng Trái cây">🍎 FruitStore</button>
        <button id="btn-print" title="In chương hiện tại ra giấy hoặc PDF">🖨️ Print</button>
        <div class="toolbar-sep"></div>
        <div class="toolbar-group field-row" style="margin: 0;">
          <label for="lang-mode-select">Backend:</label>
          <select id="lang-mode-select" aria-label="Chế độ ngôn ngữ Cầu nối Backend">
            <option value="both">☕+🟣 Java &amp; C#</option>
            <option value="java">☕ Chỉ Java</option>
            <option value="csharp">🟣 Chỉ C# (.NET)</option>
          </select>
        </div>
        <div class="toolbar-sep"></div>
        <div class="toolbar-group field-row" style="margin: 0;">
          <label for="font-size-slider">Cỡ:</label>
          <input id="font-size-slider" type="range" class="has-box-indicator" min="13" max="20" value="15" style="width: 65px;">
          <span id="font-size-val">15px</span>
        </div>
        <div class="toolbar-sep"></div>
        <div class="toolbar-group field-row" style="margin: 0;">
          <label for="theme-select">Theme:</label>
          <select id="theme-select" aria-label="Chọn giao diện">
            <option value="classic">Win98 / 2000 Classic</option>
            <option value="xp">Windows XP Luna</option>
            <option value="borland">Borland Turbo C++</option>
            <option value="crt">Green Phosphor CRT</option>
          </select>
        </div>
        <div class="toolbar-group field-row" style="margin: 0;">
          <input type="checkbox" id="chk-crt-scanlines">
          <label for="chk-crt-scanlines">Scanlines</label>
        </div>
      </div>
```

### TASK FIX 02: TỐI ƯU HÓA `assets/css/retro-98-browser.css` — SỬA XUNG ĐỘT LAYOUT, BỐ CỤC 2 CỘT SQL LAB & THÊM CSS ĐỒ HỌA TRỰC QUAN

**Mục tiêu:**
1. Khắc phục triệt để xung đột giữa `layout.css` cũ và `98.css` ở khung `#left-pane`, `menu[role="tablist"]`, `.sunken-panel`, và `#reading-pane`.
2. Định nghĩa class `.lab-grid` (bố cục 2 cột trái-phải cho Phòng Lab SQL: cột trái xem đề bài + ERD, cột phải gõ code + xem kết quả), `.sim-visual-canvas` (khung vẽ đồ họa SVG Venn, Cây B+Tree 3 tầng, Sơ đồ luồng 9 bước, Đồ thị Deadlock), và `.kw-card-grid` cho 64 thẻ từ khóa Chương 15.
3. Thay thế toàn bộ màu nền cứng (`#fff0f0`, `#f0fff0`) bằng biến CSS theo Theme để không bị chói hoặc mất chữ khi chuyển sang giao diện **Borland Turbo C++** hoặc **Green Phosphor CRT**.

**Hành động:** Mở file `assets/css/retro-98-browser.css` và bổ sung khối quy tắc hoàn thiện dưới đây vào cuối file:

```css
/* ==========================================================================
   13. KHẮC PHỤC XUNG ĐỘT LAYOUT, BỐ CỤC 2 CỘT LAB & ĐỒ HỌA TRỰC QUAN SIMULATORS
   ========================================================================== */

/* Đảm bảo khung đọc chính luôn cuộn mượt và dùng đúng biến cỡ chữ */
#reading-pane.sunken-panel {
  flex: 1;
  height: 100%;
  overflow-y: auto !important;
  overflow-x: hidden;
  padding: 16px 20px !important;
  background: var(--bg-panel) !important;
  color: var(--text-main) !important;
  font-family: var(--font-read);
  font-size: var(--reading-font-size, 15px);
  line-height: 1.62;
}

/* Sửa xung đột tablist cột trái giữa layout.css cũ và 98.css */
#left-pane menu[role="tablist"].left-tabs {
  display: flex !important;
  margin: 0 0 -2px 0 !important;
  padding: 0 0 0 2px !important;
  border-bottom: none !important;
  background: transparent !important;
}

#left-pane .left-tab-panel.window {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  padding: 6px;
}

#left-pane .left-tab-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

#toc-tree-container.tree-view {
  flex: 1;
  overflow-y: auto !important;
  overflow-x: auto;
  padding: 6px !important;
  margin: 0 !important;
  background: var(--bg-panel) !important;
  color: var(--text-main) !important;
}

/* Bố cục 2 cột chuyên nghiệp cho Phòng Thực Hành SQL */
.lab-grid {
  display: grid;
  grid-template-columns: minmax(300px, 43%) minmax(340px, 57%);
  gap: 14px;
  align-items: start;
}

@media (max-width: 1024px) {
  .lab-grid {
    grid-template-columns: 1fr;
  }
}

/* Khung vẽ Sơ đồ ER ASCII rõ nét */
.er-box {
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.35;
  background: var(--bg-code);
  color: var(--text-code);
  border: 1px solid var(--border-dark);
  padding: 10px 12px;
  overflow-x: auto;
  white-space: pre;
  margin: 6px 0;
}

/* Hộp Ví dụ, Bài tập và Gợi ý 3 tầng */
.example-box, .exercise-box {
  background: var(--bg-card);
  border: 1px solid var(--border-dark);
  padding: 10px 12px;
  margin-bottom: 12px;
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding-bottom: 6px;
  margin-bottom: 8px;
  border-bottom: 1px dashed var(--border-dark);
  font-weight: bold;
}

.hint-tier {
  background: var(--bg-table-alt);
  border: 1px solid var(--border-dark);
  padding: 6px 10px;
  margin: 5px 0;
}

/* Đồ họa trực quan cho 6 Bộ Mô Phỏng (SVG Venn, B+Tree 3 tầng, Pipeline, Deadlock) */
.sim-visual-canvas {
  background: var(--bg-table-alt);
  border: 2px inset var(--border-dark);
  padding: 12px;
  margin: 10px 0 14px 0;
}

.btree-tier-root {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.btree-node-box {
  padding: 8px 12px;
  border: 2px solid var(--border-dark);
  background: var(--bg-card);
  color: var(--text-main);
  text-align: center;
  font-family: var(--font-mono);
  font-size: 12px;
  transition: all 0.15s ease;
}

.btree-node-box.active-seek {
  border: 2px solid var(--ok-color);
  background: var(--accent-soft);
  box-shadow: 0 0 0 2px var(--ok-color);
  font-weight: bold;
}

.btree-node-box.scanned-page {
  border-color: var(--err-color);
}

.btree-tier-int {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.btree-tier-leaf {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
  gap: 8px;
}

.pipeline-steps-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  margin: 10px 0;
  padding: 8px;
  background: var(--bg-window);
  border: 1px solid var(--border-dark);
}

.pipeline-step-pill {
  padding: 4px 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: bold;
  border: 1px solid var(--border-dark);
  background: var(--bg-card);
  color: var(--text-main);
  cursor: pointer;
}

.pipeline-step-pill.active {
  background: var(--accent);
  color: var(--title-text);
  border-color: var(--border-dkdk);
}

.pipeline-step-pill.done {
  border-color: var(--ok-color);
  color: var(--ok-color);
}

/* Kết quả chấm bài tự động */
.grade-pass {
  background: var(--accent-soft);
  border: 2px solid var(--ok-color);
  color: var(--ok-color);
  padding: 10px 12px;
  font-weight: bold;
  margin-bottom: 10px;
}

.grade-fail {
  background: var(--warn-bg);
  border: 2px solid var(--err-color);
  color: var(--err-color);
  padding: 10px 12px;
  font-weight: bold;
  margin-bottom: 10px;
}
```

### TASK FIX 03: BỔ SUNG DỮ LIỆU ĐỒ HỌA CÂY B+TREE 3 TẦNG & CẶP GHÉP DÒNG TRONG `src/data/simulators.js`

**Mục tiêu:** Giữ nguyên toàn bộ dữ liệu kịch bản hiện có trong `src/data/simulators.js`, đồng thời **bổ sung cấu trúc nút cây 3 tầng (`root_page`, `intermediate_pages`, `leaf_pages`) vào `SIMULATORS.btree`** và **cấu hình tô màu biểu đồ Venn (`venn_type`) vào `SIMULATORS.join.modes`** để bộ vẽ đồ họa trực quan ở `app-engine.js` có đủ tọa độ vẽ sơ đồ cây B+Tree 3 tầng và biểu đồ SVG Venn.

**Hành động:** Trong file `src/data/simulators.js`:
1. Trong `SIMULATORS.join.modes`, thêm thuộc tính `venn_type` cho từng mode:
   - `INNER`: `venn_type: "inner"`
   - `LEFT`: `venn_type: "left_all"`
   - `RIGHT`: `venn_type: "right_all"`
   - `FULL`: `venn_type: "both_all"`
   - `CROSS`: `venn_type: "cartesian"`
   - `ON_VS_WHERE`: `venn_type: "left_vs_inner"`
   - Và bổ sung thêm mode `LEFT_ANTI` (`LEFT ANTI JOIN: WHERE k.MaKhoa IS NULL` với `venn_type: "left_only"`) để sinh viên thấy rõ phần hình lưỡi liềm bên trái (chỉ lấy `SV04` chưa có khoa).
2. Trong `SIMULATORS.btree`, bổ sung 3 thuộc tính cấu trúc cây vật lý `root_page`, `intermediate_pages`, và `leaf_pages` ngay bên cạnh mảng `scenarios`:

```javascript
      root_page: {
        page_id: "Page #1 (Root Node)",
        keys: ["100..399 -> Page #20", "400..699 -> Page #21", "700..999 -> Page #22"]
      },
      intermediate_pages: [
        { page_id: "Page #20 (Int L1)", range: [100, 399], children: ["Page #410", "Page #411"] },
        { page_id: "Page #21 (Int L2)", range: [400, 699], children: ["Page #412", "Page #413"] },
        { page_id: "Page #22 (Int L3)", range: [700, 999], children: ["Page #414", "Page #415"] }
      ],
      leaf_pages: [
        { page_id: "Page #410 (Leaf)", range: [100, 249], keys: [105, 140, 195, 240] },
        { page_id: "Page #411 (Leaf)", range: [250, 399], keys: [260, 310, 355, 390] },
        { page_id: "Page #412 (Leaf)", range: [400, 549], keys: [410, 480, 520, 545] },
        { page_id: "Page #413 (Leaf)", range: [550, 699], keys: [560, 610, 650, 690] },
        { page_id: "Page #414 (Leaf)", range: [700, 849], keys: [715, 750, 790, 830] },
        { page_id: "Page #415 (Leaf)", range: [850, 999], keys: [860, 880, 920, 975] }
      ],
```

### TASK FIX 04: SỬA TOÀN DIỆN HÀM `renderTocView`, `renderLeftTocTree` VÀ `renderChapterView` TRONG `src/ui/app-engine.js`

**Mục tiêu:**
1. Tại `renderTocView()`: Khôi phục phần **"Sơ Đồ Thực Thể Liên Kết (ERD ASCII) Của 7 Cơ Sở Dữ Liệu Mẫu"** ở cuối trang Mục lục tổng quan để sinh viên nhìn thấy toàn bộ 7 sơ đồ bảng ngay từ trang chủ, kèm nút mở từng CSDL trong Phòng Lab.
2. Tại `renderLeftTocTree()`: Vẽ đầy đủ nhánh con (`<details><summary>...<ul>...</ul></details>`) cho **cả 15 chương từ Chương 1 đến Chương 15** (hiện tại Chương 6 đến Chương 15 đang bị thiếu nhánh con mục `1..11`, và Chương 15 cần có mục `3B. Từ điển 64 thẻ T-SQL`).
3. Tại `renderChapterView(chapterId)`:
   - Thêm checkbox **"Đánh dấu đã nắm vững chương này"** ngay trên `.ch-banner`.
   - Tại **Mục 3 (`sec-mechanism`)**: Tự động hiển thị nút **`🔬 Mở Bộ Mô Phỏng Trực Quan Của Chương Này ►`** đối với các chương có mô phỏng đi kèm (`ch03 -> join`, `ch04 -> exec_order`, `ch07 -> normalization`, `ch08 -> btree`, `ch09 -> isolation`, `ch11 -> injection`).
   - **Khôi phục Mục 3B (`sec-keyword-cards`) cho Chương 15**: Render trọn vẹn **64 Thẻ Từ Khóa 4 Phần (`ch.keyword_cards`)** với thanh lọc **Tất cả (64) / Phần A: Cốt Lõi Bắt Buộc (44) / Phần B: Nâng Cao (20)**, dropdown lọc theo **Danh mục (`category`)**, ô tìm kiếm từ khóa tức thời, nút **Sao chép T-SQL**, nút **⚡ Chạy trên Lab FruitStore**, và bảng kết quả mẫu `part4_output`!
   - Tại **Mục 4 (`sec-examples`)**: Hiển thị huy hiệu `[CHUẨN - Chạy được trong Lab]` hoặc `[T-SQL - Minh họa SQL Server]`, nút Sao chép, nút Đẩy vào Lab, và **bắt buộc gọi `renderStaticTableHtml(ex.result)` để vẽ bảng kết quả mẫu ngay dưới mỗi ví dụ**!
   - Tại **Mục 5 (`sec-dialects`)**: Kiểm tra `Array.isArray(d)` để đọc đúng `d[0]`, `d[1]`, `d[2]`, `d[3]` (khắc phục lỗi bảng trống 4 cột).
   - Tại **Mục 6 (`sec-bridge`)**: Bọc `ch.bridge_java` và `ch.bridge_csharp` trong `<pre class="code-block"><code>` (có `escapeHtml`), lọc theo `state.langMode` (`both` / `java` / `csharp`), và thêm nút Sao chép code.
   - Tại **Mục 8 (`sec-errors`)**: Kiểm tra `typeof err === "string"` để hiển thị đầy đủ danh sách các lỗi thực tế của từng chương.
   - Tại **Mục 9 (`sec-interview`)**: Đọc đúng `iv.a_short || iv.a || iv.full` và `iv.a_long || iv.followup`.
   - Tại **Mục 10 (`sec-exercises`)**: Tách rõ **10.1. Bài tập cơ bản (`ch.basics`)** (với ID `ch.id + "_b" + b.num`, gợi ý 3 cấp, lời giải + bảng `b.expected`) và **10.2. Bài luyện tập nâng cao (`ch.practice`)** (với phân tích `understand`, `brute`, `optimal`, `pitfalls`, lời giải + bảng `p.expected`).
   - Tại **Mục 11 (`sec-summary`)**: Render đầy đủ **Bảng Tóm Tắt Kiến Thức (`ch.summary_table`)**, **3 Câu Hỏi Tự Kiểm Tra (`ch.quiz`)**, và khung ghi chú 3 dòng, kèm thanh điều hướng **Chương trước / Phòng Lab / Chương tiếp theo** ở cuối trang.

**Mã nguồn chuẩn cần cập nhật vào `src/ui/app-engine.js` cho `escapeHtml`, `renderStaticTableHtml`, `renderTocView` và `renderChapterView`:**

```javascript
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stripHtml(html) {
    if (!html) return "";
    return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  /**
   * Render bảng kết quả tĩnh từ cấu trúc { cols: [...], rows: [[...]] } của ch01..ch15.js
   */
  function renderStaticTableHtml(resultObj) {
    if (!resultObj || !Array.isArray(resultObj.cols) || resultObj.cols.length === 0) {
      return "";
    }
    var rows = Array.isArray(resultObj.rows) ? resultObj.rows : [];
    var html = '<div class="sunken-panel" style="overflow-x:auto; margin-top:6px;">' +
      '<table class="interactive chm-table" style="margin:0;"><thead><tr>';
    resultObj.cols.forEach(function(col) {
      html += '<th>' + escapeHtml(col) + '</th>';
    });
    html += '</tr></thead><tbody>';
    rows.forEach(function(row) {
      html += '<tr>';
      row.forEach(function(cell) {
        if (cell === null || cell === undefined) {
          html += '<td><i style="color:var(--text-muted);">&lt;NULL&gt;</i></td>';
        } else {
          html += '<td>' + escapeHtml(cell) + '</td>';
        }
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }
```

Và trong hàm `renderChapterView(chapterId)` của `src/ui/app-engine.js`, thay thế toàn bộ phần xây dựng HTML bằng logic chuẩn sau:

```javascript
  function renderChapterView(chapterId, scrollSecId) {
    state.lastView = "chapter";
    state.lastChapterId = chapterId;
    updateAddressBar("chm://bikip-csdl-v2005/chapters/" + chapterId + ".htm");

    var pane = document.getElementById("reading-pane");
    if (!pane) return;

    if (chapterId === "ch00") {
      updateStatusCell(2, "📘 Chương 0: Nền Tảng CSDL");
      var ch0Html = '<div class="chapter-content-wrap">' +
        (DATA.ch0_html || "<p>Chưa có nội dung Chương 0.</p>") +
        '<div class="section-card" style="display:flex; justify-content:space-between; align-items:center;">' +
        '<button data-nav-view="toc">◄ Về Bảng Mục Lục</button>' +
        '<button class="default" data-nav-ch="ch01">Chương 1: SELECT, NULL &amp; Kiểu Dữ Liệu ►</button>' +
        '</div></div>';
      pane.innerHTML = ch0Html;
      pane.scrollTop = 0;
      return;
    }

    var chIdx = (DATA.chapters || []).findIndex(function(c) { return c.id === chapterId; });
    var ch = chIdx !== -1 ? DATA.chapters[chIdx] : null;
    if (!ch) {
      pane.innerHTML = '<div class="callout-warn">Không tìm thấy nội dung chương: ' + escapeHtml(chapterId) + '</div>';
      return;
    }

    var chCode = ch.code || ("Chương " + (ch.num || (chIdx + 1)));
    updateStatusCell(2, "📘 " + chCode + ": " + ch.title);

    var topicKey = "topic_" + ch.id;
    var isTopicDone = !!state.completedItems[topicKey];
    var langMode = state.langMode || "both";

    var html = '<div class="chapter-content-wrap">';

    // Banner chương + Checkbox hoàn thành lý thuyết chương
    html += '<div class="ch-banner">' +
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">' +
        '<div class="ch-code">' + escapeHtml(chCode.toUpperCase()) + ' // GIÁO TRÌNH &amp; PHÒNG LAB CSDL THỰC CHIẾN</div>' +
        '<div class="field-row" style="background:var(--bg-window); padding:2px 8px; border:1px solid var(--border-dark);">' +
          '<input type="checkbox" id="chk-topic-' + escapeHtml(ch.id) + '" data-toggle-done="' + escapeHtml(topicKey) + '" ' + (isTopicDone ? 'checked' : '') + '>' +
          '<label for="chk-topic-' + escapeHtml(ch.id) + '"><b>Đánh dấu đã nắm vững chương này</b></label>' +
        '</div>' +
      '</div>' +
      '<h1>' + escapeHtml(chCode + ': ' + ch.title) + '</h1>' +
      '<div class="ch-source">Tài liệu tham khảo: ' + escapeHtml(Array.isArray(ch.sources) ? ch.sources.join("; ") : (ch.sources || "Giáo trình tiêu chuẩn")) + '</div>' +
      '</div>';

    // Mục 1: Mục tiêu & Dấu hiệu nhận biết
    html += '<section class="section-card" id="sec-goals"><h2>1. Mục Tiêu Chương &amp; Dấu Hiệu Nhận Biết Thực Tế</h2>';
    if (ch.goals && ch.goals.length) {
      html += '<h3>🎯 Mục tiêu cốt lõi cần đạt:</h3><ul>';
      ch.goals.forEach(function(g) { html += '<li>' + escapeHtml(g) + '</li>'; });
      html += '</ul>';
    }
    if (ch.signals && ch.signals.length) {
      html += '<h3>🔍 Dấu hiệu nhận biết khi làm dự án Backend hoặc đi phỏng vấn:</h3><ul>';
      ch.signals.forEach(function(s) { html += '<li>' + escapeHtml(s) + '</li>'; });
      html += '</ul>';
    }
    html += '</section>';

    // Mục 2: Lý thuyết nền tảng
    if (ch.theory) {
      html += '<section class="section-card" id="sec-theory"><h2>2. Lý Thuyết Cốt Lõi &amp; Định Nghĩa Chính Xác</h2>';
      html += (typeof ch.theory === "string") ? ch.theory : JSON.stringify(ch.theory);
      html += '</section>';
    }

    // Mục 3: Cơ chế & Chạy tay từng bước (+ Nút nhảy sang Simulator tương ứng)
    var simMap = { ch03: "join", ch04: "exec_order", ch07: "normalization", ch08: "btree", ch09: "isolation", ch11: "injection" };
    var linkedSim = simMap[ch.id];
    if (ch.mechanism) {
      html += '<section class="section-card" id="sec-mechanism">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; border-bottom:2px solid var(--accent); padding-bottom:6px; margin-bottom:10px;">' +
          '<h2 style="border:none; margin:0; padding:0;">3. Cơ Chế Hoạt Động &amp; Chạy Tay Từng Bước</h2>' +
          (linkedSim ? '<button class="default" data-nav-sim="' + linkedSim + '">🔬 Mở Bộ Mô Phỏng Trực Quan Của Chương Này ►</button>' : '') +
        '</div>' +
        '<div>' + (typeof ch.mechanism === "string" ? ch.mechanism : JSON.stringify(ch.mechanism)) + '</div>' +
      '</section>';
    }

    // Mục 3B: BÁCH KHOA TOÀN THƯ 64 THẺ TỪ KHÓA T-SQL 4 PHẦN (Dành cho Chương 15)
    if (Array.isArray(ch.keyword_cards) && ch.keyword_cards.length > 0) {
      html += renderChapter15KeywordDictionary(ch);
    }

    // Mục 4: Cú pháp & Ví dụ thực tế (kèm bảng kết quả mẫu ex.result!)
    if (ch.examples && ch.examples.length) {
      html += '<section class="section-card" id="sec-examples"><h2>4. Cú Pháp &amp; Các Ví Dụ Thực Chiến Trên CSDL Mẫu (' + ch.examples.length + ' ví dụ)</h2>';
      ch.examples.forEach(function(ex, idx) {
        var lbl = (ex.label || ex.tag || "CHUAN").toUpperCase();
        var isChuan = lbl.indexOf("CHU") !== -1;
        var badgeHtml = isChuan
          ? '<span class="badge-chuan">[CHUẨN - Chạy trực tiếp trong Lab]</span>'
          : '<span class="badge-tsql">[T-SQL - Minh họa SQL Server]</span>';
        var noteText = ex.note || ex.desc || "";

        html += '<div class="example-box">' +
          '<div class="example-header">' +
            '<span>' + escapeHtml(ex.title || ("Ví dụ " + (idx + 1))) + ' ' + badgeHtml + ' <small style="color:var(--text-muted);">(CSDL: ' + escapeHtml(ex.db || "truonghoc") + ')</small></span>' +
            '<div style="display:flex; gap:4px;">' +
              '<button data-copy-text="' + encodeURIComponent(ex.sql || "") + '">📋 Sao chép SQL</button>' +
              (ex.sql ? '<button class="default" data-push-lab-sql="' + encodeURIComponent(ex.sql) + '" data-lab-db="' + escapeHtml(ex.db || state.activeDbId) + '">🧪 Đẩy vào SQL Lab</button>' : '') +
            '</div>' +
          '</div>' +
          '<pre class="code-block"><code>' + escapeHtml(ex.sql || "") + '</code></pre>' +
          (noteText ? '<div style="margin:6px 0; font-size:0.92em;"><b>Giải thích:</b> ' + escapeHtml(noteText) + '</div>' : '') +
          (ex.result && ex.result.cols ? '<div style="font-size:0.88em; font-weight:bold; margin-top:6px;">📊 Bảng kết quả minh họa (' + (ex.result.rows ? ex.result.rows.length : 0) + ' dòng):</div>' + renderStaticTableHtml(ex.result) : '') +
        '</div>';
      });
      html += '</section>';
    }

    // Mục 5: Khác biệt phương ngữ (Hỗ trợ chuẩn mảng 2 chiều [[feature, tsql, mysql, pg]] của ch01..ch15.js)
    if (ch.dialects && ch.dialects.length) {
      html += '<section class="section-card" id="sec-dialects"><h2>5. Khác Biệt Phương Ngữ (SQL Server vs MySQL vs PostgreSQL / SQLite)</h2>';
      html += '<div class="sunken-panel" style="overflow-x:auto;"><table class="interactive chm-table" style="margin:0;"><thead><tr><th>Tác vụ / Khía cạnh</th><th>SQL Server (T-SQL)</th><th>MySQL (InnoDB)</th><th>PostgreSQL / SQLite</th></tr></thead><tbody>';
      ch.dialects.forEach(function(d) {
        if (Array.isArray(d)) {
          html += '<tr><td><b>' + escapeHtml(d[0] || "") + '</b></td><td><code>' + escapeHtml(d[1] || "") + '</code></td><td><code>' + escapeHtml(d[2] || "") + '</code></td><td><code>' + escapeHtml(d[3] || "") + '</code></td></tr>';
        } else if (d && typeof d === "object") {
          html += '<tr><td><b>' + escapeHtml(d.feature || "") + '</b></td><td><code>' + escapeHtml(d.tsql || "") + '</code></td><td><code>' + escapeHtml(d.mysql || d.sqlite || "") + '</code></td><td><code>' + escapeHtml(d.postgres_mysql || d.pg || d.other || "") + '</code></td></tr>';
        }
      });
      html += '</tbody></table></div></section>';
    }

    // Mục 6: Cầu nối Backend Java & C# (Bọc trong <pre class="code-block"><code> & lọc theo langMode)
    html += '<section class="section-card" id="sec-bridge">' +
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; border-bottom:2px solid var(--accent); padding-bottom:6px; margin-bottom:10px;">' +
        '<h2 style="border:none; margin:0; padding:0;">6. Cầu Nối Ứng Dụng Backend (Java JDBC/JPA &amp; C# ADO.NET/EF Core)</h2>' +
        '<span style="font-size:11px; color:var(--text-muted);">Đang hiển thị: <b>' + (langMode === "java" ? "Chỉ Java" : (langMode === "csharp" ? "Chỉ C# (.NET)" : "Song ngữ Java & C#")) + '</b></span>' +
      '</div>';
    if ((langMode === "both" || langMode === "java") && ch.bridge_java) {
      html += '<fieldset class="retro-groupbox" style="margin-bottom:10px;"><legend>☕ Java Backend (JDBC / Spring Data JPA / Hibernate)</legend>' +
        '<div style="text-align:right; margin-bottom:4px;"><button data-copy-text="' + encodeURIComponent(ch.bridge_java) + '">📋 Sao chép mã Java</button></div>' +
        '<pre class="code-block"><code>' + escapeHtml(ch.bridge_java) + '</code></pre></fieldset>';
    }
    if ((langMode === "both" || langMode === "csharp") && ch.bridge_csharp) {
      html += '<fieldset class="retro-groupbox"><legend>🟣 C# .NET Backend (ADO.NET / Dapper / Entity Framework Core)</legend>' +
        '<div style="text-align:right; margin-bottom:4px;"><button data-copy-text="' + encodeURIComponent(ch.bridge_csharp) + '">📋 Sao chép mã C#</button></div>' +
        '<pre class="code-block"><code>' + escapeHtml(ch.bridge_csharp) + '</code></pre></fieldset>';
    }
    html += '</section>';

    // Mục 7: Hiệu năng & Chi phí
    if (ch.performance) {
      html += '<section class="section-card" id="sec-perf"><h2>7. Phân Tích Hiệu Năng, Chi Phí I/O &amp; Execution Plan</h2><div>' + ch.performance + '</div></section>';
    }

    // Mục 8: Lỗi hay gặp (Hỗ trợ chuẩn mảng chuỗi của ch01..ch15.js)
    if (ch.common_errors && ch.common_errors.length) {
      html += '<section class="section-card" id="sec-errors"><h2>8. Các Bẫy &amp; Lỗi Hay Gặp Trong Thực Tế (' + ch.common_errors.length + ' lỗi điển hình)</h2><ol style="padding-left:20px; margin:0;">';
      ch.common_errors.forEach(function(err) {
        if (typeof err === "string") {
          html += '<li style="margin-bottom:8px;"><b>⚠️ Cạm bẫy:</b> ' + escapeHtml(err) + '</li>';
        } else if (err && typeof err === "object") {
          html += '<li style="margin-bottom:8px;"><b>' + escapeHtml(err.title || err.name || "Cảnh báo") + ':</b> ' +
            (err.wrong ? '<br><span style="color:var(--err-color);">❌ Sai: <code>' + escapeHtml(err.wrong) + '</code></span>' : '') +
            (err.right ? '<br><span style="color:var(--ok-color);">✅ Đúng: <code>' + escapeHtml(err.right) + '</code></span>' : '') +
            (err.why ? '<br><i>Giải thích:</i> ' + escapeHtml(err.why) : '') + '</li>';
        }
      });
      html += '</ol></section>';
    }

    // Mục 9: Câu hỏi phỏng vấn trọng tâm của chương (Đọc chuẩn a_short, a_long, full)
    if (ch.interview && ch.interview.length) {
      html += '<section class="section-card" id="sec-interview"><h2>9. Câu Hỏi Phỏng Vấn Doanh Nghiệp Trọng Tâm Của Chương</h2>';
      ch.interview.forEach(function(iv, idx) {
        var shortAns = iv.a_short || iv.a || iv.full || "";
        var longAns = iv.a_long || iv.followup || "";
        html += '<fieldset class="retro-groupbox"><legend>🎯 Câu hỏi ' + (idx + 1) + ' — Cấp độ: [' + escapeHtml(iv.level || "Junior") + ']</legend>' +
          '<p style="margin:4px 0 8px 0;"><b>❓ Hỏi:</b> ' + escapeHtml(iv.q || "") + '</p>' +
          '<div style="background:var(--bg-table-alt); padding:8px; border-left:3px solid var(--ok-color); margin-bottom:6px;"><b>✅ Trả lời cốt lõi (15 giây đầu):</b> ' + escapeHtml(shortAns) + '</div>' +
          (longAns ? '<details><summary style="cursor:pointer; font-weight:bold; color:var(--accent);">📚 Xem phân tích chuyên sâu &amp; câu hỏi xoáy ăn điểm tối đa...</summary>' +
            '<div style="padding:8px; margin-top:4px; background:var(--bg-card); border:1px solid var(--border-dark);">' + escapeHtml(longAns) + '</div></details>' : '') +
          '</fieldset>';
      });
      html += '</section>';
    }

    // Mục 10: Bài tập cơ bản (basics) & Bài luyện tập nâng cao (practice)
    var basicsList = ch.basics || [];
    var practiceList = ch.practice || [];
    if (basicsList.length || practiceList.length) {
      html += '<section class="section-card" id="sec-exercises"><h2>10. Bài Tập Thực Hành Có Máy Chấm Tự Động (' + (basicsList.length + practiceList.length) + ' bài)</h2>';

      if (basicsList.length) {
        html += '<h3>10.1. Bài tập cơ bản (Làm quen cú pháp &amp; Gợi ý 3 tầng)</h3>';
        basicsList.forEach(function(b, idx) {
          var pId = b.id || (ch.id + "_b" + (b.num || (idx + 1)));
          var isDone = !!state.completedItems[pId];
          var promptText = b.problem || b.prompt || b.summary || "";
          var h1 = (b.hints && b.hints[0]) || b.intuition || "Xác định bảng nguồn và điều kiện lọc.";
          var h2 = (b.hints && b.hints[1]) || b.trace || "Kiểm tra các cột cần SELECT và thứ tự ORDER BY.";
          var solSql = b.sql || b.solution_sql || "";
          var expObj = b.expected || b.expected_output || null;

          html += '<div class="exercise-box">' +
            '<div class="example-header">' +
              '<span>' + (isDone ? '✅ ' : '📝 ') + escapeHtml(b.title || ("Bài cơ bản " + (idx + 1))) + ' <span class="badge-chuan">[DB: ' + escapeHtml(b.db || "truonghoc") + ']</span></span>' +
              '<button class="default" data-open-lab-problem="' + escapeHtml(pId) + '" data-db="' + escapeHtml(b.db || state.activeDbId) + '">🧪 Giải &amp; Chấm Điểm Trong Phòng Lab ►</button>' +
            '</div>' +
            '<p style="margin:6px 0;"><b>Đề bài:</b> ' + escapeHtml(promptText) + '</p>' +
            '<div class="hint-tier"><details><summary style="cursor:pointer; font-weight:bold;">💡 Gợi ý tầng 1 (Hướng tư duy)</summary><p style="margin:4px 0;">' + escapeHtml(h1) + '</p></details></div>' +
            '<div class="hint-tier"><details><summary style="cursor:pointer; font-weight:bold;">🧩 Gợi ý tầng 2 (Chạy tay &amp; Khung câu lệnh)</summary><p style="margin:4px 0;">' + (b.trace ? '<b>Chạy tay:</b> ' + escapeHtml(b.trace) + '<br>' : '') + '<b>Gợi ý:</b> <code>' + escapeHtml(h2) + '</code></p></details></div>' +
            '<div class="hint-tier"><details><summary style="cursor:pointer; font-weight:bold;">🔑 Gợi ý tầng 3 (Lời giải SQL chuẩn &amp; Bảng kết quả mẫu)</summary>' +
              '<pre class="code-block"><code>' + escapeHtml(solSql) + '</code></pre>' +
              (expObj ? renderStaticTableHtml(expObj) : '') +
            '</details></div>' +
          '</div>';
        });
      }

      if (practiceList.length) {
        html += '<h3>10.2. Bài luyện tập thực chiến (Phân tích Ngây thơ vs Tối ưu &amp; Bẫy thường gặp)</h3>';
        practiceList.forEach(function(p, idx) {
          var pId = p.id || (ch.id + "_p" + (idx + 1));
          var isDone = !!state.completedItems[pId];
          var promptText = p.summary || p.prompt || p.problem || "";
          var solSql = p.sql || p.solution_sql || "";
          var expObj = p.expected || p.expected_output || null;

          html += '<div class="exercise-box">' +
            '<div class="example-header">' +
              '<span>' + (isDone ? '✅ ' : '🔥 ') + escapeHtml(p.title || ("Bài thực hành " + (idx + 1))) + ' ' + (p.difficulty ? '(' + escapeHtml(p.difficulty) + ') ' : '') + '<span class="badge-chuan">[DB: ' + escapeHtml(p.db || "shoponline") + ']</span></span>' +
              '<button class="default" data-open-lab-problem="' + escapeHtml(pId) + '" data-db="' + escapeHtml(p.db || state.activeDbId) + '">⚡ Thực Hành &amp; Tự Chấm Trong Lab ►</button>' +
            '</div>' +
            '<p style="margin:6px 0;"><b>Đề bài:</b> ' + escapeHtml(promptText) + '</p>';

          if (p.understand || p.brute || p.optimal || p.pitfalls) {
            html += '<ul style="margin:6px 0 10px 0; padding-left:20px;">' +
              (p.understand ? '<li><b>Phân tích yêu cầu:</b> ' + escapeHtml(p.understand) + '</li>' : '') +
              (p.brute ? '<li><b>Cách tiếp cận ngây thơ (Brute-force):</b> ' + escapeHtml(p.brute) + '</li>' : '') +
              (p.optimal ? '<li><b>Giải pháp SQL tối ưu (Optimal):</b> ' + escapeHtml(p.optimal) + '</li>' : '') +
              (p.pitfalls ? '<li style="color:var(--err-color);"><b>Bẫy dễ vấp:</b> ' + escapeHtml(p.pitfalls) + '</li>' : '') +
            '</ul>';
          } else if (Array.isArray(p.hints) && p.hints.length) {
            html += '<div class="hint-tier"><details><summary style="cursor:pointer; font-weight:bold;">💡 Xem gợi ý từng bước</summary><ul>' +
              p.hints.map(function(h) { return '<li>' + escapeHtml(h) + '</li>'; }).join('') + '</ul></details></div>';
          }

          html += '<details><summary style="cursor:pointer; font-weight:bold; color:var(--accent);">🔑 Xem lời giải SQL chuẩn &amp; Bảng kết quả đối chiếu...</summary>' +
            '<pre class="code-block"><code>' + escapeHtml(solSql) + '</code></pre>' +
            (expObj ? renderStaticTableHtml(expObj) : '') +
            '</details></div>';
        });
      }
      html += '</section>';
    }

    // Mục 11: Bảng tóm tắt (summary_table) + 3 Câu hỏi tự kiểm tra (quiz) + Ghi chú 3 dòng
    html += '<section class="section-card" id="sec-summary"><h2>11. Bảng Tóm Tắt Kiến Thức, Tự Kiểm Tra &amp; Ghi Chú 3 Dòng</h2>';
    if (ch.summary_table && ch.summary_table.length) {
      html += '<h3>📋 Bảng Tóm Tắt Cú Pháp &amp; Khái Niệm Cốt Lõi:</h3>' +
        '<div class="sunken-panel" style="overflow-x:auto; margin-bottom:14px;"><table class="interactive chm-table" style="margin:0;"><thead><tr><th>Khái niệm / Cú pháp</th><th>Ý nghĩa cốt lõi</th><th>Ghi chú thực chiến</th></tr></thead><tbody>';
      ch.summary_table.forEach(function(r) {
        html += '<tr><td><code>' + escapeHtml(r[0] || "") + '</code></td><td>' + escapeHtml(r[1] || "") + '</td><td>' + escapeHtml(r[2] || "") + '</td></tr>';
      });
      html += '</tbody></table></div>';
    }

    if (ch.quiz && ch.quiz.length) {
      html += '<h3>❓ Tự Kiểm Tra Nhanh Cuối Chương (Bấm vào câu hỏi để đối chiếu đáp án):</h3>';
      ch.quiz.forEach(function(qz) {
        html += '<details class="example-box" style="margin-bottom:8px;"><summary style="cursor:pointer; font-weight:bold;">' + escapeHtml(qz.q || "") + '</summary>' +
          '<div style="margin-top:6px; padding-top:6px; border-top:1px dashed var(--border-dark); color:var(--ok-color);"><b>✅ Đáp án chuẩn:</b> ' + escapeHtml(qz.a || "") + '</div></details>';
      });
    }

    var defaultNote = state.notes3Line[ch.id] || (
      (ch.goals && ch.goals[0] ? "1. Ý tưởng: " + ch.goals[0] : "1. Ý tưởng chính: ") + "\n" +
      (ch.summary_table && ch.summary_table[0] ? "2. Cú pháp: " + ch.summary_table[0][0] + " -> " + ch.summary_table[0][1] : "2. Cú pháp cốt lõi: ") + "\n" +
      (ch.common_errors && ch.common_errors[0] ? "3. Bẫy cần tránh: " + ch.common_errors[0] : "3. Bẫy cần tránh: ")
    );
    html += '<h3>📝 Sổ Tay Ghi Chú 3 Dòng Của Chương Này:</h3>' +
      '<div class="field-row-stacked">' +
      '<textarea id="ch-note-input" rows="3" style="width:100%; font-family:var(--font-mono); font-size:12px; padding:6px;">' + escapeHtml(defaultNote) + '</textarea>' +
      '<div style="margin-top:6px;"><button class="default" id="btn-save-note" data-ch="' + escapeHtml(ch.id) + '">💾 Lưu ghi chú 3 dòng của ' + escapeHtml(chCode) + '</button></div>' +
      '</div></section>';

    // Thanh điều hướng chân trang (Chương trước / Phòng Lab / Chương sau)
    var prevChId = chIdx === 0 ? "ch00" : DATA.chapters[chIdx - 1].id;
    var prevLabel = chIdx === 0 ? "◄ Chương 0: Nền Tảng CSDL" : ("◄ " + (DATA.chapters[chIdx - 1].code || DATA.chapters[chIdx - 1].id));
    var nextCh = (chIdx + 1 < DATA.chapters.length) ? DATA.chapters[chIdx + 1] : null;

    html += '<div class="section-card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">' +
      '<button data-nav-ch="' + escapeHtml(prevChId) + '">' + escapeHtml(prevLabel) + '</button>' +
      '<button data-nav-view="lab">🧪 Mở Phòng Thực Hành SQL</button>' +
      (nextCh
        ? '<button class="default" data-nav-ch="' + escapeHtml(nextCh.id) + '">' + escapeHtml((nextCh.code || nextCh.id) + ": " + nextCh.title) + ' ►</button>'
        : '<button class="default" data-nav-view="appendices">📑 Xem Phụ Lục Tra Cứu A - F ►</button>') +
      '</div>';

    html += '</div>';

    pane.innerHTML = html;
    if (scrollSecId) {
      var targetEl = document.getElementById(scrollSecId);
      if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
    } else {
      pane.scrollTop = 0;
    }
  }
```

Và bổ sung hàm `renderChapter15KeywordDictionary(ch)` ngay bên dưới `renderChapterView` để khôi phục trọn vẹn **64 Thẻ Từ Khóa 4 Phần của Chương 15**:

```javascript
  var ch15FilterState = { part: "ALL", cat: "ALL", q: "" };

  function renderChapter15KeywordDictionary(ch) {
    var cards = ch.keyword_cards || [];
    var allCats = [];
    cards.forEach(function(kc) {
      if (kc.category && allCats.indexOf(kc.category) === -1) allCats.push(kc.category);
    });
    var countA = cards.filter(function(kc) { return kc.part === "A"; }).length;
    var countB = cards.filter(function(kc) { return kc.part === "B"; }).length;

    var filtered = cards.filter(function(kc) {
      if (ch15FilterState.part !== "ALL" && kc.part !== ch15FilterState.part) return false;
      if (ch15FilterState.cat !== "ALL" && kc.category !== ch15FilterState.cat) return false;
      if (ch15FilterState.q && ch15FilterState.q.trim() !== "") {
        var qLower = ch15FilterState.q.trim().toLowerCase();
        var hay = (
          (kc.keyword || "") + " " +
          (kc.category || "") + " " +
          stripHtml(kc.part1_what || kc.what_it_does || "") + " " +
          stripHtml(kc.part2_backend || kc.backend_scenario || "") + " " +
          (kc.part3_tsql || kc.tsql_code || "")
        ).toLowerCase();
        if (hay.indexOf(qLower) === -1) return false;
      }
      return true;
    });

    var html = '<section class="section-card" id="sec-keyword-cards">' +
      '<h2>3B. Bách Khoa Toàn Thư Từ Khóa T-SQL (' + cards.length + ' Thẻ 4 Phần — DB FruitStore_Ultimate)</h2>' +
      '<div class="callout-info"><b>Cấu trúc Thẻ 4 Phần chuẩn hóa:</b> (1) Giải thích ngắn gọn nó làm gì &bull; (2) Tình huống thực tế Backend Java/.NET cần dùng &bull; (3) Code mẫu T-SQL trên DB FruitStore &bull; (4) Bảng Output minh họa &amp; Nút chạy thử trong Lab.</div>' +
      '<fieldset class="retro-groupbox" style="margin:10px 0;"><legend>🔎 Bộ Lọc Từ Điển Từ Khóa T-SQL</legend>' +
        '<div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">' +
          '<button class="' + (ch15FilterState.part === "ALL" ? "default" : "") + '" data-ch15-part="ALL">Tất cả (' + cards.length + ')</button>' +
          '<button class="' + (ch15FilterState.part === "A" ? "default" : "") + '" data-ch15-part="A">⭐ Phần A: Cốt Lõi Bắt Buộc (' + countA + ')</button>' +
          '<button class="' + (ch15FilterState.part === "B" ? "default" : "") + '" data-ch15-part="B">🚀 Phần B: Nâng Cao / Biết Thêm (' + countB + ')</button>' +
          '<select id="ch15-cat-select" aria-label="Lọc theo nhóm từ khóa">' +
            '<option value="ALL"' + (ch15FilterState.cat === "ALL" ? ' selected' : '') + '>-- Tất cả nhóm (' + allCats.length + ') --</option>';
    allCats.forEach(function(cat) {
      html += '<option value="' + escapeHtml(cat) + '"' + (ch15FilterState.cat === cat ? ' selected' : '') + '>' + escapeHtml(cat) + '</option>';
    });
    html += '</select>' +
          '<input type="text" id="ch15-kw-search" placeholder="Tìm nhanh (VD: ROW_NUMBER, APPLY, MERGE, JSON...)" value="' + escapeHtml(ch15FilterState.q) + '" style="flex:1; min-width:180px;">' +
          '<button class="default" data-nav-view="lab" data-param="fruitstore">🍉 Mở Lab FruitStore (9 Bảng)</button>' +
        '</div>' +
      '</fieldset>' +
      '<div style="font-size:12px; margin-bottom:8px; color:var(--text-muted);">Đang hiển thị <b>' + filtered.length + ' / ' + cards.length + '</b> thẻ từ khóa:</div>';

    filtered.forEach(function(card, idx) {
      var isPartA = (card.part === "A");
      var badgeHtml = isPartA
        ? '<span class="badge-chuan">[PHẦN A - CỐT LÕI BẮT BUỘC]</span>'
        : '<span class="badge-tsql">[PHẦN B - NÂNG CAO / BIẾT THÊM]</span>';
      var whatText = card.part1_what || card.what_it_does || "";
      var backendText = card.part2_backend || card.backend_scenario || "";
      var tsqlCode = card.part3_tsql || card.tsql_code || "";
      var outTable = card.part4_output || card.output || null;

      html += '<div class="example-box" id="kw-card-' + escapeHtml(card.id || idx) + '">' +
        '<div class="example-header">' +
          '<span><b>#' + (idx + 1) + '. ' + escapeHtml(card.keyword) + '</b> ' + badgeHtml + ' <small style="color:var(--text-muted);">[' + escapeHtml(card.category || "") + ']</small></span>' +
          '<div style="display:flex; gap:4px;">' +
            '<button data-copy-text="' + encodeURIComponent(tsqlCode) + '">📋 Sao chép T-SQL</button>' +
            (card.lab_sql ? '<button class="default" data-push-lab-sql="' + encodeURIComponent(card.lab_sql) + '" data-lab-db="fruitstore">⚡ Chạy thử trong Lab FruitStore</button>' : '') +
          '</div>' +
        '</div>' +
        '<div style="margin-bottom:6px;"><b>(1) Giải thích ngắn gọn nó làm gì:</b> ' + whatText + '</div>' +
        '<div style="margin-bottom:8px;"><b>(2) Tình huống thực tế Backend Java/.NET cần dùng:</b> ' + backendText + '</div>' +
        '<div style="margin-bottom:4px;"><b>(3) Code mẫu T-SQL áp dụng trên DB FruitStore:</b></div>' +
        '<pre class="code-block"><code>' + escapeHtml(tsqlCode) + '</code></pre>' +
        (outTable ? '<div style="margin-top:8px;"><b>(4) Output minh họa dạng bảng:</b>' + renderStaticTableHtml(outTable) + '</div>' : '') +
      '</div>';
    });

    html += '</section>';
    return html;
  }
```

### TASK FIX 05: TÁI CẤU TRÚC PHÒNG LAB SQL 2 CỘT (`.lab-grid`), THÊM DROPDOWN 77 BÀI TẬP, NÚT `EXPLAIN QUERY PLAN` & SỬA MÁY CHẤM BÀI TỰ ĐỘNG (`gradeSqlProblem`)

**Mục tiêu:**
1. Xây dựng hàm `getAll77LabProblems()` gom đầy đủ **65 bài tập trong 15 chương (`basics` + `practice`) + 12 bài LeetCode SQL = 77 bài tập** với cấu trúc thống nhất: `{ id, chId, chCode, title, difficulty, db, prompt, h1, h2, solSql, expected, required_keywords, forbidden_keywords, order_matters, note3 }`.
2. Sửa hàm `gradeSqlProblem(problem, userSql)`:
   - Khi chạy chấm điểm, khởi tạo một instance DB sạch (chạy lại `schema_sql` + `seed_sql`) để ngay cả các bài tập `INSERT / UPDATE / DELETE` ở Chương 6 cũng chấm điểm chính xác 100% và lặp lại nhất quán!
   - Nếu `problem.expected` (`{ cols, rows }`) có sẵn (như trong 65 bài của Ch01–Ch15), đối chiếu kết quả của người dùng trực tiếp với `problem.expected` (hoặc chạy `problem.sql || problem.solution_sql` nếu không có `expected`).
   - Hiển thị song song **Bảng kết quả của bạn** và **Bảng kết quả đáp án mẫu** ngay khi chấm xong.
3. Bổ sung nút **`🔍 Xem EXPLAIN QUERY PLAN`** trong Phòng Lab: thực thi `"EXPLAIN QUERY PLAN " + userSql` và giải thích ý nghĩa `SCAN` vs `SEARCH ... USING INDEX` vs `USING COVERING INDEX`.
4. Chuyển giao diện `renderLabView` sang bố cục 2 cột `.lab-grid`:
   - **Thanh chọn phía trên**: Dropdown chọn bài tập trong tổng số 77 bài + Dropdown chọn CSDL trong 7 CSDL + Nút Reset CSDL.
   - **Cột Trái**: Đề bài đang chọn + Gợi ý 3 cấp + Nút `"Chép lời giải mẫu vào ô gõ"` + **Sơ đồ ER ASCII (`db.er_ascii`) & Schema SQL hiển thị trực tiếp**.
   - **Cột Phải**: Ô gõ SQL + 4 nút (`▶ Chạy SQL (F5)`, `✅ Chạy & Tự Chấm Điểm (Ctrl+S)`, `🔍 EXPLAIN QUERY PLAN`, `Xóa`) + Khu vực hiển thị bảng kết quả và nhận xét chấm điểm.

**Mã nguồn chuẩn cho `getAll77LabProblems()` và `gradeSqlProblem(problem, userSql)` trong `src/ui/app-engine.js`:**

```javascript
  function getAll77LabProblems() {
    var list = [];
    (DATA.chapters || []).forEach(function(ch, cIdx) {
      var chCode = ch.code || ("Chương " + (ch.num || (cIdx + 1)));
      (ch.basics || []).forEach(function(b, bIdx) {
        var pid = b.id || (ch.id + "_b" + (b.num || (bIdx + 1)));
        list.push({
          id: pid,
          chId: ch.id,
          chCode: chCode,
          title: b.title || ("Bài cơ bản " + (bIdx + 1)),
          difficulty: "Cơ bản",
          db: b.db || "truonghoc",
          prompt: b.problem || b.prompt || b.summary || "",
          h1: (b.hints && b.hints[0]) || b.intuition || "Xác định bảng nguồn và điều kiện lọc.",
          h2: (b.hints && b.hints[1]) || b.trace || "Kiểm tra các cột cần SELECT và thứ tự ORDER BY.",
          solSql: b.sql || b.solution_sql || "",
          expected: b.expected || b.expected_output || null,
          required_keywords: b.required_keywords || [],
          forbidden_keywords: b.forbidden_keywords || [],
          order_matters: !!b.order_matters,
          note3: {
            idea: b.intuition || (ch.goals && ch.goals[0]) || "",
            syntax: (b.hints && b.hints[1]) || "",
            trap: (ch.common_errors && ch.common_errors[0]) || ""
          }
        });
      });
      (ch.practice || []).forEach(function(p, pIdx) {
        var pid = p.id || (ch.id + "_p" + (pIdx + 1));
        list.push({
          id: pid,
          chId: ch.id,
          chCode: chCode,
          title: p.title || ("Bài thực hành " + (pIdx + 1)),
          difficulty: p.difficulty || "Thực hành",
          db: p.db || "shoponline",
          prompt: p.summary || p.prompt || p.problem || "",
          h1: p.understand || (p.hints && p.hints[0]) || "Phân tích mối quan hệ giữa các bảng.",
          h2: p.optimal || (p.hints && p.hints[1]) || "Viết truy vấn tối ưu và kiểm tra NULL.",
          solSql: p.sql || p.solution_sql || "",
          expected: p.expected || p.expected_output || null,
          required_keywords: p.required_keywords || [],
          forbidden_keywords: p.forbidden_keywords || [],
          order_matters: !!p.order_matters,
          note3: p.note3 || {
            idea: p.understand || "",
            syntax: p.optimal || "",
            trap: p.pitfalls || ""
          }
        });
      });
    });

    (DATA.leetcode_challenges || []).forEach(function(lc) {
      list.push({
        id: lc.id,
        chId: "ch14",
        chCode: "LeetCode #" + lc.lc_num,
        title: lc.title,
        difficulty: lc.difficulty || "Trung bình",
        db: lc.db || "leetcode",
        prompt: lc.prompt || "",
        h1: (lc.hints && lc.hints[0]) || lc.pattern || lc.hint || "",
        h2: (lc.hints && lc.hints[1]) || "",
        solSql: lc.solution_sql || lc.sql || "",
        expected: lc.expected || null,
         starter_sql: lc.starter_sql || "",
        required_keywords: lc.required_keywords || [],
        forbidden_keywords: lc.forbidden_keywords || [],
        order_matters: !!lc.order_matters,
        note3: {
          idea: "Mẫu bài toán: " + (lc.pattern || lc.title),
          syntax: lc.solution_sql || "",
          trap: (lc.hints && lc.hints[0]) || ""
        }
      });
    });

    return list;
  }

  function gradeSqlProblem(problem, userSql) {
    if (!sqlEngineReady || !SQL) {
      return { pass: false, msg: "SQLite WASM chưa nạp xong. Vui lòng thử lại sau vài giây." };
    }
    var dbId = problem.db || state.activeDbId;
    var dbs = (DATA.labs && DATA.labs.databases) ? DATA.labs.databases : [];
    var dbMeta = dbs.find(function(d) { return d.id === dbId; });
    if (!dbMeta) {
      return { pass: false, msg: "Không tìm thấy cấu hình CSDL: " + dbId };
    }

    var cleanSql = (userSql || "").trim();
    if (!cleanSql) {
      return { pass: false, msg: "Bạn chưa nhập câu lệnh SQL nào!" };
    }

    // 1. Kiểm tra từ khóa bắt buộc / bị cấm (nếu có)
    if (Array.isArray(problem.required_keywords)) {
      for (var i = 0; i < problem.required_keywords.length; i++) {
        var kw = problem.required_keywords[i];
        var reg = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        if (!reg.test(cleanSql)) {
          return { pass: false, msg: "Câu lệnh của bạn cần sử dụng từ khóa: " + kw };
        }
      }
    }
    if (Array.isArray(problem.forbidden_keywords)) {
      for (var j = 0; j < problem.forbidden_keywords.length; j++) {
        var fkw = problem.forbidden_keywords[j];
        var fReg = new RegExp(fkw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        if (fReg.test(cleanSql)) {
          return { pass: false, msg: "Câu lệnh vi phạm quy tắc: Không được dùng " + fkw };
        }
      }
    }

    // 2. Tạo bản sao CSDL sạch trong RAM để chấm điểm nhất quán (hỗ trợ cả DML INSERT/UPDATE/DELETE)
    var tempUserDb = new SQL.Database();
    var userRes = { columns: [], values: [] };
    try {
      if (dbMeta.schema_sql) tempUserDb.run(dbMeta.schema_sql);
      if (dbMeta.seed_sql) tempUserDb.run(dbMeta.seed_sql);
      var uExec = tempUserDb.exec(cleanSql);
      if (uExec && uExec.length > 0) {
        userRes = uExec[uExec.length - 1];
      }
    } catch (err) {
      tempUserDb.close();
      return { pass: false, msg: "Lỗi cú pháp SQL: " + err.message };
    }
    tempUserDb.close();

    // 3. Lấy tập kết quả chuẩn từ problem.expected HOẶC chạy problem.solSql / problem.solution_sql
    var solCols = [];
    var solVals = [];
    if (problem.expected && Array.isArray(problem.expected.cols)) {
      solCols = problem.expected.cols;
      solVals = problem.expected.rows || [];
    } else {
      var refSql = problem.solSql || problem.solution_sql || problem.sql || "";
      if (!refSql) {
        return { pass: false, msg: "Bài tập này chưa có câu lệnh đáp án tham chiếu." };
      }
      var tempSolDb = new SQL.Database();
      try {
        if (dbMeta.schema_sql) tempSolDb.run(dbMeta.schema_sql);
        if (dbMeta.seed_sql) tempSolDb.run(dbMeta.seed_sql);
        var sExec = tempSolDb.exec(refSql);
        if (sExec && sExec.length > 0) {
          solCols = sExec[sExec.length - 1].columns;
          solVals = sExec[sExec.length - 1].values;
        }
      } catch (sErr) {
        tempSolDb.close();
        return { pass: false, msg: "Lỗi khi chạy đáp án chuẩn: " + sErr.message };
      }
      tempSolDb.close();
    }

    var userFormatted = { cols: userRes.columns || [], rows: userRes.values || [] };
    var solFormatted = { cols: solCols, rows: solVals };

    // 4. Đối chiếu số cột và số dòng
    if (userFormatted.cols.length !== solFormatted.cols.length) {
      return {
        pass: false,
        msg: "Sai số lượng cột: Câu lệnh của bạn trả về " + userFormatted.cols.length + " cột (" + userFormatted.cols.join(", ") + "), nhưng đáp án yêu cầu " + solFormatted.cols.length + " cột (" + solFormatted.cols.join(", ") + ").",
        userTable: userFormatted,
        expectedTable: solFormatted
      };
    }

    if (userFormatted.rows.length !== solFormatted.rows.length) {
      return {
        pass: false,
        msg: "Sai số lượng dòng: Câu lệnh của bạn trả về " + userFormatted.rows.length + " dòng, nhưng đáp án chuẩn có " + solFormatted.rows.length + " dòng.",
        userTable: userFormatted,
        expectedTable: solFormatted
      };
    }

    // 5. Chuẩn hóa và đối chiếu từng ô dữ liệu
    var uRows = userFormatted.rows.map(function(r) { return r.map(normalizeVal); });
    var eRows = solFormatted.rows.map(function(r) { return r.map(normalizeVal); });

    if (!problem.order_matters) {
      var sortFn = function(a, b) { return JSON.stringify(a).localeCompare(JSON.stringify(b)); };
      uRows.sort(sortFn);
      eRows.sort(sortFn);
    }

    for (var r = 0; r < eRows.length; r++) {
      for (var c = 0; c < eRows[r].length; c++) {
        if (uRows[r][c] !== eRows[r][c]) {
          return {
            pass: false,
            msg: "Sai lệch dữ liệu tại dòng #" + (r + 1) + " (cột '" + solFormatted.cols[c] + "'): Giá trị của bạn là '" + userFormatted.rows[r][c] + "', trong khi đáp án chuẩn là '" + solFormatted.rows[r][c] + "'." + (problem.order_matters ? " (Lưu ý: Bài này có kiểm tra thứ tự sắp xếp ORDER BY)." : ""),
            userTable: userFormatted,
            expectedTable: solFormatted
          };
        }
      }
    }

    return {
      pass: true,
      msg: "CHÍNH XÁC 100%! Tập kết quả (" + solFormatted.rows.length + " dòng, " + solFormatted.cols.length + " cột) hoàn toàn khớp với đáp án chuẩn!",
      rowCount: solFormatted.rows.length,
      colCount: solFormatted.cols.length,
      userTable: userFormatted,
      expectedTable: solFormatted
    };
  }
```

### TASK FIX 06: KHÔI PHỤC 100% HÌNH MINH HỌA SVG & ĐỒ HỌA TƯƠNG TÁC TRONG 6 BỘ MÔ PHỎNG (`renderJoinSimulator` .. `renderInjectionSimulator`)

**Mục tiêu:** Thay thế các hàm render đơn giản trong `src/ui/app-engine.js` (dòng 977–1210) bằng bộ render có **đồ họa vector `<svg>` và sơ đồ trực quan động** cho cả 6 Simulator:

1. **`renderJoinSimulator(sim)` — Biểu đồ tập hợp Venn `<svg>` + Bộ chạy từng bước ghép dòng (`joinStep`)**:
   - Vẽ biểu đồ `<svg viewBox="0 0 280 140">` gồm 2 vòng tròn giao nhau (`Bảng A: SinhVien` và `Bảng B: Khoa`) sử dụng `<clipPath id="joinClipA">` để tô màu riêng phần Trái, phần Giao ở giữa (`A ∩ B`), và phần Phải tùy theo chế độ JOIN đang chọn (`INNER`, `LEFT`, `RIGHT`, `FULL`, `CROSS`, `ON_VS_WHERE`).
   - Thêm nút **`⏭ Bước ghép tiếp theo (Space)`** và **`🔄 Xem toàn bộ`** để sinh viên bấm `Space` xem động cơ SQL duyệt qua từng cặp dòng (`Bước 1/5`, `Bước 2/5`...), hiển thị hộp trạng thái `✅ GIỮ LẠI` hoặc `❌ LOẠI BỎ` kèm lý do chi tiết!

```javascript
  function renderJoinSimulator(sim) {
    var modeKeys = Object.keys(sim.modes);
    var activeMode = window._JOIN_MODE || "INNER";
    var mData = sim.modes[activeMode] || sim.modes.INNER;
    var pairs = mData.matched_pairs || [];
    var stepIdx = (window._JOIN_STEP || 0) % (pairs.length + 1); // 0 = xem tất cả, 1..N = từng bước

    // Xác định màu tô SVG Venn theo từng phép JOIN
    var leftFill = (activeMode === "LEFT" || activeMode === "FULL" || activeMode === "CROSS" || activeMode === "ON_VS_WHERE")
      ? "rgba(10, 100, 220, 0.55)" : "rgba(150, 150, 150, 0.15)";
    var rightFill = (activeMode === "RIGHT" || activeMode === "FULL" || activeMode === "CROSS")
      ? "rgba(220, 110, 10, 0.55)" : "rgba(150, 150, 150, 0.15)";
    var centerFill = "rgba(16, 150, 72, 0.80)";

    var html = '<fieldset class="retro-groupbox"><legend>🎛️ Chọn Phép Nối Bảng (JOIN Mode) &amp; Chạy Từng Bước</legend>' +
      '<div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:space-between;">' +
        '<div style="display:flex; flex-wrap:wrap; gap:10px;">';
    modeKeys.forEach(function(k) {
      html += '<div class="field-row">' +
        '<input type="radio" id="radio-join-' + k + '" name="join-mode" value="' + k + '" ' + (k === activeMode ? 'checked' : '') + '>' +
        '<label for="radio-join-' + k + '"><b>' + k + '</b></label>' +
      '</div>';
    });
    html += '</div>' +
        '<div style="display:flex; gap:6px;">' +
          '<button class="default" id="btn-join-step">⏭ Bước kế tiếp (Space) [' + (stepIdx === 0 ? "Tổng quan " + pairs.length + " cặp" : "Cặp " + stepIdx + "/" + pairs.length) + ']</button>' +
          '<button id="btn-join-reset">Xem tất cả</button>' +
        '</div>' +
      '</div></fieldset>';

    // Ba cột trực quan: Bảng Trái A | Biểu đồ SVG Venn ở giữa | Bảng Phải B
    html += '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap:12px; align-items:stretch; margin:10px 0;">';

    // Cột 1: Bảng Trái
    html += '<div class="sunken-panel" style="padding:6px;">' +
      '<div style="font-weight:bold; padding:4px; background:var(--bg-window); margin-bottom:4px;">📘 ' + escapeHtml(sim.left_table.name) + '</div>' +
      '<table class="interactive chm-table" style="margin:0;"><thead><tr><th>MaSV</th><th>HoTen</th><th>MaKhoa</th></tr></thead><tbody>';
    sim.left_table.rows.forEach(function(r) {
      html += '<tr><td><b>' + r.MaSV + '</b></td><td>' + r.HoTen + '</td><td>' + (r.MaKhoa ? '<code>' + r.MaKhoa + '</code>' : '<b style="color:var(--err-color);">NULL</b>') + '</td></tr>';
    });
    html += '</tbody></table></div>';

    // Cột 2: Biểu đồ SVG Venn Tập Hợp
    html += '<div class="sim-visual-canvas" style="margin:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">' +
      '<div style="font-weight:bold; color:var(--accent); margin-bottom:4px;">🎨 Biểu Đồ Tập Hợp Venn (' + escapeHtml(activeMode) + ')</div>' +
      '<svg viewBox="0 0 280 135" style="width:240px; height:118px; display:block; margin:2px auto;">' +
        '<defs><clipPath id="joinClipA"><circle cx="102" cy="68" r="50"/></clipPath></defs>' +
        '<circle cx="102" cy="68" r="50" fill="' + leftFill + '" stroke="var(--text-main)" stroke-width="2"/>' +
        '<circle cx="178" cy="68" r="50" fill="' + rightFill + '" stroke="var(--text-main)" stroke-width="2"/>' +
        '<circle cx="178" cy="68" r="50" clip-path="url(#joinClipA)" fill="' + centerFill + '" stroke="var(--text-main)" stroke-width="1.5"/>' +
        '<text x="58" y="64" fill="var(--text-main)" font-size="11" font-weight="bold">Bảng A</text>' +
        '<text x="55" y="78" fill="var(--text-main)" font-size="10">(SV04 NULL)</text>' +
        '<text x="123" y="71" fill="#ffffff" font-size="11" font-weight="bold">A ∩ B</text>' +
        '<text x="188" y="64" fill="var(--text-main)" font-size="11" font-weight="bold">Bảng B</text>' +
        '<text x="188" y="78" fill="var(--text-main)" font-size="10">(Khoa NN)</text>' +
      '</svg>' +
      '<div style="font-size:11px; color:var(--text-muted); margin-top:4px;">' + escapeHtml(mData.label) + '</div>' +
    '</div>';

    // Cột 3: Bảng Phải
    html += '<div class="sunken-panel" style="padding:6px;">' +
      '<div style="font-weight:bold; padding:4px; background:var(--bg-window); margin-bottom:4px;">📙 ' + escapeHtml(sim.right_table.name) + '</div>' +
      '<table class="interactive chm-table" style="margin:0;"><thead><tr><th>MaKhoa</th><th>TenKhoa</th></tr></thead><tbody>';
    sim.right_table.rows.forEach(function(r) {
      html += '<tr><td><code><b>' + r.MaKhoa + '</b></code></td><td>' + r.TenKhoa + '</td></tr>';
    });
    html += '</tbody></table></div></div>';

    // Hộp giải thích bước ghép hiện tại + SQL
    html += '<fieldset class="retro-groupbox"><legend>🔍 Cơ Chế Ghép Dòng: ' + escapeHtml(mData.label) + '</legend>' +
      '<pre class="code-block"><code>' + escapeHtml(mData.sql) + '</code></pre>' +
      '<p style="margin:6px 0;"><b>Bản chất:</b> ' + escapeHtml(mData.desc) + '</p>';

    // Hiển thị các bước kiểm tra cặp khóa nối
    var visiblePairs = stepIdx === 0 ? pairs : pairs.slice(0, stepIdx);
    html += '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">';
    visiblePairs.forEach(function(p, idx) {
      var isDiscard = p.status && p.status.indexOf("DISCARD") !== -1;
      html += '<div style="padding:4px 8px; border:1px solid ' + (isDiscard ? 'var(--err-color)' : 'var(--ok-color)') + '; background:var(--bg-card); font-size:12px;">' +
        '<b>Cặp #' + (idx + 1) + ':</b> ' + escapeHtml(p.left) + ' ⟷ ' + escapeHtml(p.right) + ' &rarr; ' +
        '<b style="color:' + (isDiscard ? 'var(--err-color)' : 'var(--ok-color)') + ';">' + (isDiscard ? '❌ LOẠI BỎ' : '✅ GIỮ LẠI (' + p.status + ')') + '</b>' +
      '</div>';
    });
    html += '</div></fieldset>';

    // Bảng kết quả đầu ra
    html += '<fieldset class="retro-groupbox"><legend>📊 Tập Kết Quả Đầu Ra (' + mData.result_rows.length + ' dòng)</legend>' +
      '<div class="sunken-panel"><table class="interactive chm-table" style="margin:0;"><thead><tr><th>MaSV</th><th>HoTen</th><th>MaKhoa</th><th>TenKhoa</th><th>Giải thích</th></tr></thead><tbody>';
    mData.result_rows.forEach(function(row) {
      html += '<tr>' +
        '<td>' + (row.MaSV ? escapeHtml(row.MaSV) : '<i style="color:var(--err-color);">&lt;NULL&gt;</i>') + '</td>' +
        '<td>' + (row.HoTen ? escapeHtml(row.HoTen) : '<i style="color:var(--err-color);">&lt;NULL&gt;</i>') + '</td>' +
        '<td>' + (row.MaKhoa ? '<code>' + escapeHtml(row.MaKhoa) + '</code>' : '<i style="color:var(--err-color);">&lt;NULL&gt;</i>') + '</td>' +
        '<td>' + (row.TenKhoa ? escapeHtml(row.TenKhoa) : '<i style="color:var(--err-color);">&lt;NULL&gt;</i>') + '</td>' +
        '<td><small>' + escapeHtml(row.ghi_chu || "") + '</small></td>' +
      '</tr>';
    });
    html += '</tbody></table></div></fieldset>';
    return html;
  }
```

2. **`renderBTreeSimulator(sim)` — Sơ đồ Cây Chỉ Mục B+Tree 3 Tầng Trực Quan + Tìm Kiếm Khóa Động**:
   - Bổ sung thanh nhập khóa `MaDH (100 - 999)` (mặc định `480`) + nút **`🔍 Dò Cây B+Tree (Index Seek)`** kết hợp với 5 kịch bản SARGability.
   - Vẽ trực tiếp **Sơ đồ Cây B+Tree 3 Tầng**:
     - **Tầng 1 (Root Page #1)**: Hộp nút gốc ở chính giữa.
     - **Tầng 2 (3 Intermediate Pages #20, #21, #22)**: 3 hộp nhánh, tự động tô sáng màu xanh lá (`active-seek`) nhánh chứa khóa đang tìm!
     - **Tầng 3 (6 Leaf Pages #410..#415)**: 6 hộp trang lá nối nhau dạng Doubly-Linked List (`◄──►`), tô sáng đúng trang lá chứa khóa `targetKey` (chỉ đọc đúng **3 trang đĩa 8KB**) so với việc phải quét đỏ toàn bộ các trang khi bị `Table Scan / Clustered Index Scan`!

```javascript
  function renderBTreeSimulator(sim) {
    var scId = window._BTREE_SCENARIO || "sarg_eq";
    var sc = sim.scenarios.find(function(s) { return s.id === scId; }) || sim.scenarios[0];
    var targetKey = Number(window._BTREE_KEY) || 480;

    var rootPage = sim.root_page || { page_id: "Page #1 (Root Node)", keys: ["100..399 -> #20", "400..699 -> #21", "700..999 -> #22"] };
    var intPages = sim.intermediate_pages || [
      { page_id: "Page #20 (Int L1)", range: [100, 399] },
      { page_id: "Page #21 (Int L2)", range: [400, 699] },
      { page_id: "Page #22 (Int L3)", range: [700, 999] }
    ];
    var leafPages = sim.leaf_pages || [
      { page_id: "Page #410 (Leaf)", range: [100, 249], keys: [105, 140, 195, 240] },
      { page_id: "Page #411 (Leaf)", range: [250, 399], keys: [260, 310, 355, 390] },
      { page_id: "Page #412 (Leaf)", range: [400, 549], keys: [410, 480, 520, 545] },
      { page_id: "Page #413 (Leaf)", range: [550, 699], keys: [560, 610, 650, 690] },
      { page_id: "Page #414 (Leaf)", range: [700, 849], keys: [715, 750, 790, 830] },
      { page_id: "Page #415 (Leaf)", range: [850, 999], keys: [860, 880, 920, 975] }
    ];

    var matchedInt = intPages[0];
    intPages.forEach(function(ip) {
      if (targetKey >= ip.range[0] && targetKey <= ip.range[1]) matchedInt = ip;
    });
    var matchedLeaf = leafPages[0];
    leafPages.forEach(function(lp) {
      if (targetKey >= lp.range[0] && targetKey <= lp.range[1]) matchedLeaf = lp;
    });
    var exactFound = matchedLeaf.keys.indexOf(targetKey) !== -1;

    var html = '<fieldset class="retro-groupbox"><legend>🌳 Điều Khiển Dò Cây Chỉ Mục B+Tree &amp; Kiểm Tra SARGability</legend>' +
      '<div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-bottom:10px; padding-bottom:8px; border-bottom:1px dashed var(--border-dark);">' +
        '<label for="inp-btree-key"><b>Nhập khóa MaDH cần dò trên cây B+Tree (100 – 999):</b></label>' +
        '<input type="number" id="inp-btree-key" value="' + targetKey + '" min="100" max="999" style="width:90px; font-family:var(--font-mono); font-weight:bold;">' +
        '<button class="default" id="btn-btree-seek">🔍 Dò Đường Đi Index Seek</button>' +
        '<small style="color:var(--text-muted);">Gợi ý khóa có sẵn: <code>105, 240, 310, 480, 520, 690, 750, 880</code></small>' +
      '</div>' +
      '<div style="display:flex; flex-wrap:wrap; gap:10px;">';
    sim.scenarios.forEach(function(s) {
      html += '<div class="field-row">' +
        '<input type="radio" id="radio-btree-' + s.id + '" name="btree-sc" value="' + s.id + '" ' + (s.id === scId ? 'checked' : '') + '>' +
        '<label for="radio-btree-' + s.id + '">' + escapeHtml(s.name) + '</label>' +
      '</div>';
    });
    html += '</div></fieldset>';

    // SƠ ĐỒ CÂY B+TREE 3 TẦNG TRỰC QUAN
    html += '<div class="sim-visual-canvas">' +
      '<div style="text-align:center; font-weight:bold; color:var(--accent); margin-bottom:8px;">' +
        '🌲 SƠ ĐỒ ĐƯỜNG ĐI TRÊN CÂY CHỈ MỤC B+TREE 3 TẦNG (Khóa đang dò: MaDH = ' + targetKey + ' &rarr; ' +
        (sc.sargable ? '<span style="color:var(--ok-color);">INDEX SEEK: Chỉ đọc đúng 3 trang đĩa!</span>' : '<span style="color:var(--err-color);">NON-SARGABLE SCAN: Bị mù chỉ mục, phải quét toàn bộ các trang lá!</span>') + ')' +
      '</div>' +
      '<!-- Tầng 1: Root -->' +
      '<div class="btree-tier-root">' +
        '<div class="btree-node-box active-seek" style="min-width:320px;">' +
          '<div><b>TẦNG 1 (ROOT NODE): ' + escapeHtml(rootPage.page_id) + '</b></div>' +
          '<small>' + escapeHtml(rootPage.keys.join("  |  ")) + '</small>' +
        '</div>' +
      '</div>' +
      '<div style="text-align:center; font-size:14px; line-height:1; margin-bottom:6px; color:var(--accent);">↙ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↘</div>' +
      '<!-- Tầng 2: Intermediate -->' +
      '<div class="btree-tier-int">';
    intPages.forEach(function(ip) {
      var isHit = (ip.page_id === matchedInt.page_id);
      html += '<div class="btree-node-box ' + (isHit ? 'active-seek' : '') + '">' +
        '<div><b>' + (isHit ? '🎯 ' : '') + 'TẦNG 2: ' + escapeHtml(ip.page_id) + '</b></div>' +
        '<small>Phạm vi khóa: [' + ip.range[0] + ' .. ' + ip.range[1] + ']</small>' +
      '</div>';
    });
    html += '</div>' +
      '<div style="text-align:center; font-size:13px; line-height:1; margin-bottom:6px; color:var(--accent);">⬇ Dẫn hướng xuống các trang lá (Leaf Pages — Doubly Linked List ◄──►) ⬇</div>' +
      '<!-- Tầng 3: Leaf Pages -->' +
      '<div class="btree-tier-leaf">';
    leafPages.forEach(function(lp) {
      var isHit = (lp.page_id === matchedLeaf.page_id);
      var cls = sc.sargable ? (isHit ? "active-seek" : "") : "scanned-page";
      html += '<div class="btree-node-box ' + cls + '">' +
        '<div><b>' + (isHit ? '✅ ' : (sc.sargable ? '' : '🔥 ')) + escapeHtml(lp.page_id) + '</b></div>' +
        '<small>[' + lp.range[0] + '..' + lp.range[1] + ']</small><br>' +
        '<code>' + escapeHtml(lp.keys.join(", ")) + '</code>' +
      '</div>';
    });
    html += '</div>' +
      '<div style="margin-top:8px; text-align:center; font-size:12px;">' +
        'Kết quả dò khóa <b>' + targetKey + '</b>: Đi thẳng <code>' + escapeHtml(rootPage.page_id) + '</code> &rarr; <code>' + escapeHtml(matchedInt.page_id) + '</code> &rarr; <code>' + escapeHtml(matchedLeaf.page_id) + '</code> (' +
        (exactFound ? '<b style="color:var(--ok-color);">Tìm thấy khóa ' + targetKey + ' ngay tại trang lá!</b>' : '<b style="color:var(--err-color);">Xác định ngay khóa ' + targetKey + ' không tồn tại sau đúng 3 lần đọc trang!</b>') + ')' +
      '</div>' +
    '</div>';

    // Kịch bản SARGability chi tiết + Biểu đồ thanh so sánh I/O Pages
    var ioPct = Math.min(100, Math.max(2, Math.round((sc.io_pages / 8500) * 100)));
    html += '<fieldset class="retro-groupbox" style="border-color:' + (sc.sargable ? 'var(--ok-color)' : 'var(--err-color)') + ';">' +
      '<legend>' + (sc.sargable ? '✅ PHÂN TÍCH KỊCH BẢN TỐI ƯU (SARGable)' : '🚨 PHÂN TÍCH KỊCH BẢN PHẠM BẪY (Non-SARGable)') + '</legend>' +
      '<pre class="code-block"><code>' + escapeHtml(sc.sql) + '</code></pre>' +
      '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:8px; margin: 8px 0;">' +
        '<div class="sunken-panel" style="padding:6px;"><b>Toán tử Execution Plan:</b><br><span style="color:var(--accent); font-weight:bold;">' + escapeHtml(sc.plan_op) + '</span></div>' +
        '<div class="sunken-panel" style="padding:6px;"><b>Số trang đĩa 8KB phải đọc:</b><br><b style="font-size:14px; color:' + (sc.io_pages <= 20 ? 'var(--ok-color)' : 'var(--err-color)') + ';">' + sc.io_pages + ' / 8.500 trang</b></div>' +
        '<div class="sunken-panel" style="padding:6px;"><b>Thời gian thực thi:</b><br><b>' + escapeHtml(sc.execution_time) + '</b></div>' +
      '</div>' +
      '<div style="margin:8px 0;"><b>Biểu đồ chi phí đọc đĩa (Logical Reads I/O):</b>' +
        '<div class="sunken-panel" style="height:20px; padding:2px; background:var(--bg-panel);">' +
          '<div style="height:100%; width:' + ioPct + '%; background:' + (sc.sargable ? 'var(--ok-color)' : 'var(--err-color)') + '; transition:width 0.25s;"></div>' +
        '</div>' +
      '</div>' +
      '<p style="margin:6px 0;"><b>Đường đi thực tế:</b> <code>' + escapeHtml(sc.tree_path) + '</code></p>' +
      '<p style="margin:6px 0;"><b>Giải thích cơ chế:</b> ' + escapeHtml(sc.io_compare) + '</p>' +
      '<div class="callout-info"><b>💡 Cách tối ưu chuẩn Backend Engineer:</b> ' + escapeHtml(sc.fix_tip) + '</div>' +
    '</fieldset>';

    return html;
  }
```

3. **Tại `renderExecOrderSimulator(sim)`, `renderIsolationSimulator(sim)`, `renderNormalizationSimulator(sim)`, `renderInjectionSimulator(sim)`**:
   - Trong `renderExecOrderSimulator`: Thêm thanh **Pipeline 9 bước (`.pipeline-steps-bar`)** nơi mỗi mệnh đề (`1. FROM` $\rightarrow$ `2. ON` $\rightarrow$ `3. JOIN` $\rightarrow$ `4. WHERE` $\rightarrow$ `5. GROUP BY` $\rightarrow$ `6. HAVING` $\rightarrow$ `7. SELECT` $\rightarrow$ `8. ORDER BY` $\rightarrow$ `9. TOP/LIMIT`) là một nút bấm trực quan có mũi tên `→` nối nhau; bấm vào bất kỳ bước nào sẽ nhảy ngay tới bảng ảo `VT` của bước đó!
   - Trong `renderIsolationSimulator`: Thêm bộ chạy từng mốc thời gian (`window._ISO_STEP`, tiến bước bằng phím `Space`) tô sáng dòng thời gian hiện tại và vẽ **Sơ đồ khóa chéo `<svg>` Deadlock Cycle Graph** khi chọn mức `DEADLOCK_DEMO`.
   - Trong `renderInjectionSimulator`: Thay thế hoàn toàn màu cứng `#fff0f0` / `#f0fff0` bằng `var(--bg-code)` với viền trái `4px solid var(--err-color)` / `var(--ok-color)`, đồng thời vẽ **Sơ đồ so sánh Cây Cú Pháp AST (Abstract Syntax Tree)** cho thấy câu lệnh nối chuỗi bị bẻ nhánh điều kiện `OR TRUE` như thế nào so với `PreparedStatement`.

### TASK FIX 07: NÂNG CẤP PHÒNG PHỎNG VẤN (`renderInterviewView`) & SỔ TAY 3 DÒNG 77 MỤC (`renderNotesView`)

**Mục tiêu:**
1. Tại `renderInterviewView()`:
   - Bổ sung thanh **Sub-tabs + Đồng hồ đếm ngược 15:00 (`⏱️ Thi thử phỏng vấn 15 phút`)** có nút `▶ Bắt đầu / ⏸ Tạm dừng` và `🔄 Đặt lại 15:00`.
   - Hỗ trợ **Chế độ Lật Thẻ Từng Câu (Interactive Flashcard Flipper)** kết hợp với danh sách toàn bộ 48 thẻ, lọc theo cả **Cấp độ (`ALL / Fresher / Junior / Mid`)** VÀ **Ngăn Leitner (`Tất cả 3 ngăn / Ngăn 1 / Ngăn 2 / Ngăn 3`)**, kèm bảng **Thống Kê Chủ Đề Còn Yếu** (đếm số thẻ đang ở Ngăn 1 theo từng chương).
2. Tại `renderNotesView()`:
   - Tự động tổng hợp toàn bộ **77 mục ghi chú 3 dòng** (15 chương + 65 bài tập chương + 12 bài LeetCode) sử dụng dữ liệu `note3: { idea, syntax, trap }` có sẵn trong các chương, kèm bộ lọc theo **Chương**, **Độ khó**, và **Trạng thái (Tất cả / Đã hoàn thành / Chưa hoàn thành)** để sinh viên vừa ôn tập vừa chỉnh sửa và xuất ra file `.md` hoặc `.json`.

### TASK FIX 08: DANH SÁCH KIỂM THỬ NGHIỆM THU 10 ĐIỂM (VERIFICATION CHECKLIST)

Sau khi cập nhật xong các file trên, AI Agent Antigravity hãy tự rà soát qua 10 điểm kiểm tra bắt buộc sau đây:

| STT | Hạng mục nghiệm thu | Tiêu chí đạt chuẩn 100% |
| :--- | :--- | :--- |
| 1 | **Mở trực tiếp `index.html` (`file://`)** | Không có bất kỳ lỗi đỏ nào trong Console; cả 16 chương, 7 CSDL, 6 Simulators, 48 Flashcards, 12 LeetCode, 6 Phụ lục và 3 Tracks đều nạp đầy đủ. |
| 2 | **Kiểm tra Chương 15 (`ch15`)** | Hiển thị đầy đủ **Mục 3B với 64 Thẻ Từ Khóa T-SQL 4 Phần**; lọc được theo Phần A (44 thẻ) / Phần B (20 thẻ), lọc theo Nhóm, gõ tìm kiếm từ khóa mượt mà, và bấm chạy thử được trên DB `fruitstore`. |
| 3 | **Kiểm tra Mục 4, 5, 6, 8, 9, 10, 11 của Chương 1–14** | Mục 4 có bảng kết quả mẫu dưới mỗi ví dụ; Mục 5 hiển thị đủ 4 cột so sánh phương ngữ; Mục 6 code Java & C# xuống dòng rõ đẹp và lọc được theo dropdown `Backend` trên Toolbar; Mục 8 hiện đủ danh sách lỗi; Mục 9 hiện đủ đáp án ngắn & dài; Mục 11 hiện đủ bảng tóm tắt & 3 câu quiz. |
| 4 | **Kiểm tra Cây Mục Lục Trái (`#toc-tree-container`)** | Tất cả các chương từ Chương 1 đến Chương 15 đều có nhánh `<details>` xổ xuống 11 mục con để nhảy nhanh tới từng phần. |
| 5 | **Kiểm tra Phòng Lab SQL 2 Cột (`renderLabView`)** | Bố cục 2 cột `.lab-grid` rõ đẹp; chọn được bất kỳ bài nào trong **77 bài tập** từ dropdown; cột trái hiện Đề bài + Gợi ý 3 tầng + Sơ đồ ER ASCII; cột phải có nút `▶ Chạy SQL`, `✅ Chấm Điểm`, và `🔍 EXPLAIN QUERY PLAN`. |
| 6 | **Kiểm tra Máy Chấm Bài Tự Động (`gradeSqlProblem`)** | Chấm đúng 100% cho cả 65 bài tập trong Chương 1–15 (dùng `expected` / `sql`) lẫn 12 bài LeetCode (dùng `solution_sql`), hiển thị song song bảng kết quả của người học và bảng đáp án mẫu. |
| 7 | **Kiểm tra Đồ Họa Trực Quan 6 Bộ Mô Phỏng** | Bộ JOIN có biểu đồ `<svg>` Venn 2 vòng tròn đổi màu động + chạy từng bước bằng phím `Space`; Bộ B-Tree có sơ đồ cây 3 tầng (Root -> 3 Int -> 6 Leaf) tô sáng đường đi theo khóa nhập vào; Bộ SELECT có thanh Pipeline 9 bước; Bộ Isolation & Injection có sơ đồ trực quan. |
| 8 | **Kiểm tra Trang Chủ Mục Lục (`renderTocView`)** | Hiển thị đầy đủ bảng 16 chương VÀ 7 thẻ Sơ đồ Thực thể Liên kết (ERD ASCII) của 7 CSDL mẫu. |
| 9 | **Kiểm tra Phòng Phỏng Vấn & Sổ Tay 3 Dòng** | Phòng phỏng vấn có đồng hồ đếm ngược 15:00 thi thử, lọc được theo Ngăn Leitner 1/2/3 và Cấp độ; Sổ tay 3 dòng hiển thị đầy đủ ghi chú 3 dòng của các chương và bài tập. |
| 10 | **Kiểm tra 4 Giao Diện (`Classic`, `XP`, `Borland`, `CRT`)** | Chuyển đổi mượt mà giữa 4 theme và `CRT Scanlines`, không có hộp nào bị chói nền trắng chữ trắng khi ở chế độ tối Borland hoặc CRT. |
