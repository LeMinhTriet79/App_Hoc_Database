# TASKS.md — Kế Hoạch Tái Cấu Trúc & Hoàn Thiện Tuần Tự Cho AI Agent (Antigravity)

> **Dự án:** `BiKipCoSoDuLieu_Modular_v2005` (`BiKipCoSoDuLieu_Java_DotNet_v2005.chm`)  
> **Thư viện giao diện cốt lõi:** **[98.css](https://jdan.github.io/98.css/)** (`https://unpkg.com/98.css`)  
> **Nguyên tắc thực thi:** Thực hiện **tuần tự từng Task từ Task 01 đến Task 12**. Không nhảy cóc, không rút gọn mã nguồn, và tuân thủ nghiêm ngặt mọi quy tắc trong `agents.md` cùng kiến trúc trong `README_KIEN_TRUC_MO_RONG.md`.

## Bảng Tổng Quan Lộ Trình 12 Tasks Tuần Tự

| Thứ Tự | Mã Task | Tên Task & File Đích | Trạng Thái Ban Đầu | Mục Tiêu Đầu Ra |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `TASK-01` | Kiểm toán 28 files hiện có & Khởi tạo thư mục còn thiếu | Đã có 28 files | Xác nhận `registry.js`, `meta-toc.js`, `ch00..ch15`, `db-*.js` nguyên vẹn |
| **02** | `TASK-02` | Tạo `assets/css/retro-98-browser.css` (Tích hợp `98.css` & IE5 Browser Chrome) | Đang thiếu | Hoàn thiện hệ thống giao diện Trình duyệt Web 2000s + 4 Themes Bridge |
| **03** | `TASK-03` | Tạo `src/data/simulators.js` (6 Bộ Mô Phỏng Trực Quan Tương Tác) | Đang thiếu | Đăng ký đủ 6 Simulators (`join`, `exec_order`, `btree`, `isolation`, `normalization`, `injection`) |
| **04** | `TASK-04` | Tạo `src/data/interview-bank.js` (Ngân Hàng 48 Thẻ Phỏng Vấn Leitner) | Đang thiếu | Đăng ký đủ 48 Flashcards (`Fresher`, `Junior`, `Mid`) cho Backend Java/.NET |
| **05** | `TASK-05` | Tạo `src/data/leetcode-challenges.js` (12 Bài Toán LeetCode SQL Kinh Điển) | Đang thiếu | Đăng ký đủ 12 bài (`#175` – `#197`) khớp với `db-leetcode.js` |
| **06** | `TASK-06` | Tạo `src/data/appendices.js` (Phụ Lục A–F & Bảng Đối Chiếu Đa Hệ) | Đang thiếu | Đăng ký đầy đủ HTML Phụ lục A–F và giấy phép CC BY-SA 4.0 |
| **07** | `TASK-07` | Tạo 3 Lộ Trình Mở Rộng trong `src/data/tracks/` (`MySQL`, `PostgreSQL`, `NoSQL`) | Đang thiếu | Tạo `track-mysql.js`, `track-postgresql.js`, `track-nosql.js` |
| **08** | `TASK-08` | Tạo `src/ui/app-engine.js` (Phần 1: Core State, Browser Address Bar, History & 98.css TreeView) | Đang thiếu | Điều hướng Trình duyệt 2000s (`Back`/`Forward`/`Address Bar`), `ul.tree-view`, Index, Search |
| **09** | `TASK-09` | Hoàn thiện `src/ui/app-engine.js` (Phần 2: SQLite WASM Runner, 7 DBs, Sunken Table & Auto-Grader) | Đang thiếu | Thực thi SQL thật với `sql-wasm.js`, hiển thị `table.interactive` và chấm điểm tự động |
| **10** | `TASK-10` | Hoàn thiện `src/ui/app-engine.js` (Phần 3: 6 Simulators, Leitner 3-Box, Sổ Tay 3 Dòng & Export) | Đang thiếu | Render 6 Simulators bằng 98.css Controls, Leitner Room, Sổ tay 3 dòng, Modal Tracks |
| **11** | `TASK-11` | Tạo `index.html` ở thư mục gốc (Entry Point chạy trực tiếp trên `file://`) | Đang thiếu | Nạp `98.css`, 4 file CSS, `sql-wasm.js`, 34 thẻ `<script>` theo đúng thứ tự |
| **12** | `TASK-12` | Kiểm thử nghiệm thu toàn diện (End-to-End Verification & Smoke Test) | Chưa kiểm thử | Đảm bảo 0 lỗi Console, 100% tính năng & giao diện 98.css hoạt động mượt mà |

## TASK 01: Kiểm Toán Hiện Trạng & Chuẩn Bị Cấu Trúc Thư Mục

### 1.1. Việc Cần Làm
1. Kiểm tra sự tồn tại và tính toàn vẹn của 28 files đã có trong thư mục dự án:
   - `assets/css/themes.css`, `assets/css/layout.css`, `assets/css/components.css`
   - `src/core/registry.js`
   - `src/data/meta-toc.js`
   - 16 files trong `src/data/chapters/` (`ch00-nen-tang.js` đến `ch15-tsql-keyword-dictionary-fruitstore.js`)
   - 7 files trong `src/data/databases/` (`db-autoshop.js`, `db-countries.js`, `db-fruitstore.js`, `db-leetcode.js`, `db-library.js`, `db-shoponline.js`, `db-truonghoc.js`)
2. Đảm bảo các thư mục con sau đã được tạo sẵn:
   - `src/data/tracks/`
   - `src/ui/`

### 1.2. Tiêu Chí Nghiệm Thu Task 01
- Không có file nào trong 28 files gốc bị sửa đổi làm mất dữ liệu.
- Xác nhận `src/core/registry.js` xuất ra `window.BiKipRegistry` với đủ 10 phương thức: `setMetaToc`, `setCh0Html`, `registerChapter`, `registerDatabase`, `setSimulators`, `setInterviewBank`, `setLeetCodeChallenges`, `setAppendicesHtml`, `registerExpansionTrack`, và `buildGlobalData`.

## TASK 02: Tạo `assets/css/retro-98-browser.css` — Nâng Cấp Giao Diện Trình Duyệt Web 2000s Với `98.css`

### 2.1. Mục Tiêu
Tạo file `assets/css/retro-98-browser.css` để kết hợp thư viện **[98.css](https://jdan.github.io/98.css/)** (`https://unpkg.com/98.css`) với hệ thống 4 themes có sẵn (`themes.css`), đồng thời dựng giao diện **Trình duyệt Web thập niên 2000 (Internet Explorer 5.5 + MSDN HTML Help Viewer)**.

### 2.2. Các Thành Phần Bắt Buộc Phải Định Kiểu Trong `assets/css/retro-98-browser.css`
1. **Khung Cửa Sổ Chính (`#chm-window.window`):**
   - Ghi đè `.window` của `98.css` cho `#chm-window` để giữ `position: fixed; inset: 0; display: flex; flex-direction: column;` và dùng biến `--bg-window`, `--text-main`.
   - Phần `.window-body#chm-window-body` có `margin: 0; padding: 0; flex: 1; display: flex; flex-direction: column; overflow: hidden;`.
2. **Thanh Địa Chỉ Trình Duyệt 2000s (`#browser-address-bar`):**
   - Nằm ngay dưới `#tool-bar`, có viền khắc chìm 3D kiểu IE 5.5 (`border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-dark); padding: 3px 6px; display: flex; align-items: center; gap: 6px; background: var(--bg-window);`).
   - Ô nhập URL (`#address-input`) co giãn `flex: 1; font-family: var(--font-mono); font-size: 12px; height: 22px;` hiển thị đường dẫn ảo `chm://bikip-csdl-v2005/...`.
   - Cụm nút **Quick Links (`Links >>`)** bên phải thanh địa chỉ gồm các nút nhỏ kiểu 98.css để nhảy nhanh tới `JOIN`, `Window`, `B-Tree`, `ACID`, `T-SQL A-Z`.
   - Biểu tượng **Retro Throbber (`#ie-throbber`)**: Khung vuông 22x22px nền xanh đậm có icon `🌐` hiệu ứng nhấp nháy nhẹ khi chuyển trang.
3. **Nâng Cấp `ul.tree-view` Của `98.css` Cho Cột Trái (`#left-pane`):**
   - Đảm bảo `ul.tree-view` trong `.left-tab-body` chiếm `100%` chiều cao, nền `var(--bg-panel)`, chữ `var(--text-main)`, hỗ trợ `<details>` và `<summary>` đóng/mở mượt mà.
   - Khi một mục `.tree-item-link.active` được chọn, tô nền `#000080` và chữ trắng kèm viền chấm `1px dotted #ffff00` đúng chuẩn Windows 98 TreeView.
4. **Nâng Cấp `menu[role="tablist"]` Của `98.css`:**
   - Áp dụng cho cả 3 tab bên cột trái (`Nội dung`, `Chỉ mục`, `Tìm kiếm`), thanh **Workspace Mode Tabs** phía trên khung đọc bài, và hàng tab chọn **6 Bộ Mô Phỏng (`menu[role="tablist"].multirows`)**.
5. **Nâng Cấp `div.sunken-panel > table.interactive` Của `98.css`:**
   - Dùng cho mọi bảng kết quả truy vấn SQLite WASM và bảng dữ liệu mẫu.
   - Hỗ trợ sticky header (`thead th { position: sticky; top: 0; z-index: 2; }`) và highlight dòng khi click (`tr.highlighted td { background: #000080 !important; color: #ffffff !important; }`).
6. **Cầu Nối Tương Thích 4 Themes (`theme-classic`, `theme-xp`, `theme-borland`, `theme-crt`):**
   - Khi `body.theme-borland` hoặc `body.theme-crt` được bật, ghi đè màu nền và màu chữ của `.window`, `.window-body`, `fieldset`, `legend`, `ul.tree-view`, `.sunken-panel`, `table.interactive`, `button`, `select`, `input` theo biến CSS trong `themes.css`.

### 2.3. Mẫu Code Chuẩn Cho `assets/css/retro-98-browser.css`

```css
/* ==========================================================================
   RETRO 98.CSS & 2000s INTERNET EXPLORER / MSDN CHM INTEGRATION
   Tham chiếu chuẩn: https://jdan.github.io/98.css/
   ========================================================================== */

#chm-window.window {
  position: fixed;
  inset: 0;
  margin: 0;
  padding: 2px;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-window);
  color: var(--text-main);
  box-sizing: border-box;
  z-index: 1;
}

#chm-window-body.window-body {
  margin: 0;
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#title-bar.title-bar {
  height: 26px;
  min-height: 26px;
  padding: 2px 4px;
  background: linear-gradient(90deg, var(--title-grad-start), var(--title-grad-end));
  flex-shrink: 0;
}

#title-bar .title-bar-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: bold;
  color: var(--title-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 2000s IE5.5 Address Bar & Quick Links Row */
#browser-address-bar {
  min-height: 30px;
  background: var(--bg-window);
  border-bottom: 1px solid var(--border-dark);
  padding: 2px 6px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  flex-shrink: 0;
}

.address-field-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 240px;
  margin: 0 !important;
}

.address-label {
  font-size: 11px;
  font-weight: bold;
  color: var(--text-muted);
  user-select: none;
}

.address-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--bg-panel);
  padding-left: 4px;
}

#address-input {
  width: 100%;
  height: 21px;
  font-family: var(--font-mono);
  font-size: 12px;
  background: var(--bg-panel);
  color: var(--text-main);
  border: none;
  outline: none;
  padding: 1px 4px;
}

.quick-links-bar {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  border-left: 2px groove var(--border-light);
  padding-left: 6px;
}

.ie-throbber {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #000080;
  color: #ffffff;
  border: 1px inset var(--border-dark);
  font-size: 12px;
  user-select: none;
}

/* 98.css TreeView in Left Sidebar */
#left-pane menu[role="tablist"] {
  margin: 0 0 -2px 0;
}

#left-pane .left-tab-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 4px;
  margin: 0;
}

ul.tree-view.chm-98-tree {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0;
  padding: 6px;
  background: var(--bg-panel);
  color: var(--text-main);
  font-family: var(--font-ui);
  font-size: 12px;
}

ul.tree-view.chm-98-tree a.tree-item-link {
  color: var(--text-main);
  text-decoration: none;
  padding: 1px 4px;
  display: inline-block;
}

ul.tree-view.chm-98-tree a.tree-item-link:hover {
  background: var(--accent-soft);
}

ul.tree-view.chm-98-tree a.tree-item-link.active {
  background: #000080;
  color: #ffffff;
  font-weight: bold;
  outline: 1px dotted #ffff00;
}

/* 98.css Sunken Panel & Interactive Table */
.sunken-panel.sql-result-sunken {
  max-height: 360px;
  overflow: auto;
  background: var(--bg-panel);
  margin-top: 8px;
}

table.interactive {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-ui);
  font-size: 12px;
}

table.interactive thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--bg-window);
  color: var(--text-main);
}

table.interactive tbody tr.highlighted td {
  background: #000080 !important;
  color: #ffffff !important;
}

/* 98.css GroupBox (fieldset + legend) */
fieldset.retro-groupbox {
  margin: 0 0 12px 0;
  padding: 10px 12px;
  border: 2px groove var(--border-light);
}

fieldset.retro-groupbox legend {
  font-family: var(--font-ui);
  font-weight: bold;
  font-size: 12px;
  color: var(--accent);
  padding: 0 6px;
}

/* 98.css Segmented Progress Bar */
.progress-indicator.segmented {
  height: 16px;
  background: var(--bg-panel);
}

/* 98.css Status Bar */
#status-bar.status-bar {
  display: grid;
  grid-template-columns: 2.2fr 1.6fr 1.6fr 1.2fr;
  gap: 3px;
  padding: 2px 4px;
  background: var(--bg-window);
  flex-shrink: 0;
}

#status-bar .status-bar-field {
  margin: 0;
  padding: 1px 6px;
  font-family: var(--font-ui);
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Theme Bridge for Dark Retro Themes (Borland & CRT) */
body.theme-borland .window,
body.theme-borland menu[role="tablist"] li[role="tab"],
body.theme-borland button,
body.theme-borland table.interactive thead th,
body.theme-crt .window,
body.theme-crt menu[role="tablist"] li[role="tab"],
body.theme-crt button,
body.theme-crt table.interactive thead th {
  background: var(--bg-window);
  color: var(--text-main);
}

body.theme-borland .sunken-panel,
body.theme-borland ul.tree-view,
body.theme-borland input[type="text"],
body.theme-borland input[type="search"],
body.theme-borland select,
body.theme-borland textarea,
body.theme-crt .sunken-panel,
body.theme-crt ul.tree-view,
body.theme-crt input[type="text"],
body.theme-crt input[type="search"],
body.theme-crt select,
body.theme-crt textarea {
  background: var(--bg-panel);
  color: var(--text-main);
}
```

## TASK 03: Tạo `src/data/simulators.js` — 6 Bộ Mô Phỏng Trực Quan Tương Tác

### 3.1. Việc Cần Làm
Tạo file `src/data/simulators.js` gọi `window.BiKipRegistry.setSimulators({...})` chứa đầy đủ dữ liệu cho **6 bộ mô phỏng trực quan**:

1. **`join` (Bộ mô phỏng các phép nối bảng JOIN & Bẫy lọc ON vs WHERE):**
   - `left_table`: Bảng `SinhVien (A)` gồm 4 dòng (`SV01 Nguyễn An - MaKhoa CNTT`, `SV02 Trần Bình - MaKhoa KT`, `SV03 Lê Cường - MaKhoa CNTT`, `SV04 Phạm Dũng - MaKhoa NULL`).
   - `right_table`: Bảng `Khoa (B)` gồm 3 dòng (`CNTT - Công nghệ thông tin`, `KT - Kinh tế`, `NN - Ngoại ngữ`).
   - `modes`: Đầy đủ 6 chế độ (`INNER`, `LEFT`, `RIGHT`, `FULL`, `CROSS`, `ON_VS_WHERE`), mỗi chế độ gồm `{ label, sql, venn_ascii, desc, matched_pairs, result_rows }`.
2. **`exec_order` (Bộ mô phỏng Thứ tự Thực thi Lý thuyết của Câu lệnh SELECT):**
   - `query`: Câu truy vấn mẫu có đủ `SELECT TOP 2 k.TenKhoa, COUNT(sv.MaSV) AS SoSV ... FROM Khoa k LEFT JOIN SinhVien sv ... WHERE ... GROUP BY ... HAVING ... ORDER BY ...`.
   - `steps`: Mảng 9 bước tuần tự:
     - Bước 1: `FROM Khoa k` (Tạo bảng ảo VT1 từ bảng gốc).
     - Bước 2: `LEFT JOIN SinhVien sv ON k.MaKhoa = sv.MaKhoa` (Tạo VT2 gồm các dòng khớp + dòng bảo toàn của `LEFT JOIN`).
     - Bước 3: `WHERE sv.NamNhapHoc >= 2022 OR sv.MaSV IS NULL` (Lọc dòng tạo VT3; giải thích tại sao chưa dùng được bí danh `SoSV` ở đây).
     - Bước 4: `GROUP BY k.MaKhoa, k.TenKhoa` (Gom nhóm tạo VT4).
     - Bước 5: `HAVING COUNT(sv.MaSV) >= 1` (Lọc nhóm tạo VT5).
     - Bước 6: `SELECT k.TenKhoa, COUNT(sv.MaSV) AS SoSV` (Tính biểu thức và gắn Alias `SoSV` tạo VT6).
     - Bước 7: `DISTINCT` (Loại bỏ dòng trùng lặp nếu có tạo VT7).
     - Bước 8: `ORDER BY SoSV DESC` (Sắp xếp kết quả; bước duy nhất dùng được bí danh `SoSV`).
     - Bước 9: `TOP 2 / OFFSET-FETCH` (Cắt số dòng trả về cho Client).
3. **`btree` (Bộ mô phỏng Cây Chỉ Mục B-Tree vs Table Scan & SARGability):**
   - `table_info`: Bảng `DonHang` có `1,000,000` dòng (`8,500` Data Pages, B-Tree 3 tầng: Root Page `#1` -> Intermediate Pages `#20..#25` -> Leaf Pages `#410..#8500`).
   - `scenarios`: 5 kịch bản thực tế:
     - `sarg_eq`: `WHERE MaKH = 1042` -> **Index Seek** (Đọc đúng **3 trang I/O**: Root -> Intermediate -> Leaf; thời gian `~0.4 ms`).
     - `non_sarg_func`: `WHERE YEAR(NgayDat) = 2025` -> **Index Scan / Table Scan** (Mất SARGable do bọc hàm `YEAR()` lên cột index; đọc toàn bộ **8,500 trang I/O**).
     - `sarg_range`: `WHERE NgayDat >= '2025-01-01' AND NgayDat < '2026-01-01'` -> **Index Seek + Range Scan** (Đọc **18 trang I/O**; cách sửa chuẩn cho `YEAR()`).
     - `non_sarg_like`: `WHERE TenSP LIKE N'%Táo%'` -> **Index Scan** (Ký tự đại diện `%` ở đầu làm mất thứ tự từ điển B-Tree; đọc **8,500 trang I/O**).
     - `covering_idx`: `SELECT MaDH, NgayDat, TongTien WHERE MaKH = 1042` với `INCLUDE (NgayDat, TongTien)` -> **Covering Index Seek** (0 Key Lookup, chỉ **3 trang I/O**).
4. **`isolation` (Bộ mô phỏng Mức Cô Lập Giao Dịch & Deadlock Timeline):**
   - `levels`: 6 kịch bản gồm `READ_UNCOMMITTED` (Dirty Read), `READ_COMMITTED` (Chặn Dirty Read bằng Shared Lock ngắn hạn), `READ_COMMITTED_SNAPSHOT` (Đọc bản ghi trong `tempdb` Version Store không khóa), `REPEATABLE_READ` (Giữ Shared Lock đến hết Transaction, chặn Non-Repeatable Read), `SERIALIZABLE` (Key-Range Lock chặn Phantom Read), và `DEADLOCK_DEMO` (T1 giữ khóa bảng A chờ bảng B, T2 giữ khóa bảng B chờ bảng A -> SQL Server giết tiến trình có chi phí hoàn tác thấp hơn với lỗi `Error 1205`).
   - Mỗi kịch bản có mảng `timeline: [ { tick, tx_a, tx_b, lock_state, db_value, anomaly_alert } ]`.
5. **`normalization` (Bộ mô phỏng Chuẩn Hóa Bảng 1NF -> 2NF -> 3NF -> BCNF):**
   - `stages`: 5 bước chuyển đổi từ một bảng phẳng `DonHang_Unnormalized` (chứa danh sách sản phẩm ngăn cách bằng dấu phẩy, phụ thuộc bộ phận vào khóa chính ghép, và phụ thuộc bắc cầu `MaKhoa -> TenKhoa -> DienThoaiKhoa`) sang cấu trúc chuẩn 3NF/BCNF không còn dị thường thêm/sửa/xóa.
6. **`injection` (Phòng Thí Nghiệm Tấn Công & Phòng Thủ SQL Injection):**
   - `scenarios`: 4 kịch bản tấn công kinh điển:
     - Kịch bản 1: Tấn công vượt đăng nhập `' OR '1'='1' --`
     - Kịch bản 2: Tấn công trích xuất dữ liệu bảng khác `' UNION SELECT username, password_hash FROM Admins --`
     - Kịch bản 3: Tấn công Stacked Queries phá hủy dữ liệu `'; DROP TABLE SinhVien; --`
     - Kịch bản 4: Người dùng nhập tên hợp lệ có dấu nháy đơn `O'Reilly` (Nối chuỗi bị lỗi cú pháp `Unclosed quotation mark`, trong khi `PreparedStatement` / `SqlParameter` xử lý an toàn tuyệt đối).

## TASK 04: Tạo `src/data/interview-bank.js` — Ngân Hàng 48 Thẻ Phỏng Vấn Leitner 3-Box

### 4.1. Việc Cần Làm
Tạo file `src/data/interview-bank.js` gọi `window.BiKipRegistry.setInterviewBank([...])` với **đủ 48 thẻ Flashcard phỏng vấn** chia đều theo 3 cấp độ (`16 Fresher`, `16 Junior`, `16 Mid-level`) và gắn với các chương `ch01`..`ch14`.

### 4.2. Cấu Trúc Mỗi Thẻ & Danh Mục Chủ Đề Bắt Buộc
Mỗi phần tử trong mảng phải có đúng cấu trúc:
```javascript
{
  id: "iv-01",
  level: "Fresher", // "Fresher" | "Junior" | "Mid"
  chapter: "ch01",
  topic: "Three-Valued Logic & NULL",
  q: "Tại sao biểu thức WHERE HocBong = NULL hoặc WHERE HocBong <> NULL trong SQL luôn trả về 0 dòng?",
  a: "Vì SQL sử dụng Logic Ba Giá Trị (TRUE, FALSE, UNKNOWN). Mọi phép so sánh bằng toán tử = hoặc <> với NULL đều trả về UNKNOWN, mà mệnh đề WHERE chỉ giữ lại các dòng có kết quả là TRUE. Phải dùng IS NULL hoặc IS NOT NULL (hoặc IS DISTINCT FROM trong chuẩn SQL:2022 / PostgreSQL).",
  followup: "Hỏi xoáy: Trong mệnh đề CHECK constraint của bảng, nếu biểu thức trả về UNKNOWN thì dòng dữ liệu có được INSERT vào bảng không? (Đáp: CÓ! Khác với WHERE chỉ nhận TRUE, CHECK constraint chỉ từ chối khi biểu thức là FALSE)."
}
```
**Danh sách 48 chủ đề bắt buộc phải phủ kín:**
- **Fresher (`iv-01` .. `iv-16`):** (1) `NULL` & 3VL trong `WHERE` vs `CHECK`, (2) Thứ tự thực thi logic 9 bước của `SELECT`, (3) Tại sao không dùng được Alias của `SELECT` trong `WHERE`, (4) `COALESCE` vs `ISNULL` trong T-SQL (kiểu dữ liệu trả về), (5) `VARCHAR` vs `NVARCHAR` và chữ `N'...'`, (6) `INNER JOIN` vs `LEFT JOIN`, (7) Bẫy đặt điều kiện bảng phải ở `WHERE` thay vì `ON` trong `LEFT JOIN`, (8) `UNION` vs `UNION ALL` (chi phí Sort khử trùng), (9) `WHERE` vs `HAVING`, (10) `COUNT(*)` vs `COUNT(TenCot)` vs `COUNT(DISTINCT TenCot)`, (11) `DELETE` vs `TRUNCATE` vs `DROP`, (12) `PRIMARY KEY` vs `UNIQUE Constraint` (số lượng giá trị `NULL` cho phép trong SQL Server vs Chuẩn ANSI), (13) `CHAR` vs `VARCHAR`, (14) `DATETIME` vs `DATETIME2(7)` vs `DATETIMEOFFSET`, (15) Khóa ngoại `ON DELETE CASCADE` vs `ON DELETE SET NULL`, (16) Cách tìm dòng có giá trị lớn thứ 2 (`OFFSET-FETCH` vs `DENSE_RANK`).
- **Junior (`iv-17` .. `iv-32`):** (17) `ROW_NUMBER()` vs `RANK()` vs `DENSE_RANK()`, (18) Khung cửa sổ mặc định `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` khi có `ORDER BY` trong `OVER()`, (19) Tại sao `LAST_VALUE()` hay trả kết quả sai nếu thiếu `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`, (20) `NOT IN` gặp `NULL` trong Subquery trả về 0 dòng vs `NOT EXISTS`, (21) Correlated Subquery vs `CROSS APPLY` / `OUTER APPLY`, (22) CTE (`WITH`) có được materialize (lưu tạm) trong SQL Server không?, (23) CTE đệ quy (`Recursive CTE`) và tùy chọn `OPTION (MAXRECURSION)`, (24) Clustered Index vs Non-Clustered Index (nút lá chứa gì?), (25) `Key Lookup` (RID Lookup) là gì và cách triệt tiêu bằng `Covering Index` (`INCLUDE`), (26) SARGability là gì? Cách viết lại `WHERE YEAR(NgayTao) = 2025`, (27) Bảng tạm `#TempTable` vs Biến bảng `@TableVariable` (Statistics & Parallelism), (28) `VIEW` thường vs `Indexed View` (`WITH SCHEMABINDING`), (29) `AFTER Trigger` vs `INSTEAD OF Trigger` và hai bảng ảo `inserted`/`deleted` (bẫy Trigger chỉ chạy 1 lần cho cả batch nhiều dòng!), (30) Mệnh đề `OUTPUT INSERTED.*` thay thế Trigger khi cần lấy ID vừa cập nhật, (31) `IDENTITY` vs `SEQUENCE`, `SCOPE_IDENTITY()` vs `@@IDENTITY`, (32) Chuẩn hóa 1NF, 2NF, 3NF, BCNF và khi nào cố tình Phi chuẩn hóa (Denormalization).
- **Mid-level (`iv-33` .. `iv-48`):** (33) 4 tính chất `ACID` và vai trò của Write-Ahead Logging (`WAL`), (34) 4 Mức cô lập giao dịch chuẩn ANSI và 3 hiện tượng đọc bẩn (*Dirty*, *Non-Repeatable*, *Phantom*), (35) Cơ chế `READ_COMMITTED_SNAPSHOT` (RCSI) dùng Row Versioning trong `tempdb` giúp đọc không khóa ghi, (36) Phân biệt `UPDLOCK`, `HOLDLOCK`, `ROWLOCK`, `NOLOCK` (và hiểm họa đọc thiếu/nhân đôi dòng do Page Split khi lạm dụng `WITH (NOLOCK)`), (37) Cơ chế phát hiện và xử lý `Deadlock` (Error 1205) cùng 4 quy tắc phòng chống Deadlock trong code Backend, (38) Lỗ hổng `SQL Injection` bậc 1 & bậc 2, tại sao `sp_executesql` an toàn hơn `EXEC(@sql)`, (39) Bài toán `N+1 Query Problem` trong Hibernate/JPA & Entity Framework Core (`JOIN FETCH`, `.Include()`, `AsSplitQuery`), (40) `AsNoTracking()` trong EF Core và `readOnly = true` trong `@Transactional` của Spring Boot, (41) Connection Pooling (`HikariCP` trong Java / `SqlConnection` Pool trong .NET) và lỗi cạn kiệt Pool (`Connection Leak`), (42) Hiện tượng `Parameter Sniffing` trong SQL Server Stored Procedure và cách xử lý (`OPTIMIZE FOR UNKNOWN`, `RECOMPILE`), (43) So sánh 3 toán tử nối vật lý trong Execution Plan: `Nested Loops Join`, `Merge Join`, `Hash Match Join`, (44) Độ chọn lọc của cột (Selectivity) và thứ tự cột trong Composite Index `(A, B)`, (45) Phân trang dữ liệu lớn (10 triệu dòng): tại sao `OFFSET 5000000 ROWS` cực chậm và giải pháp **Keyset Pagination (Seek Method)**, (46) Xử lý đồng thời: `Optimistic Concurrency Control` (`ROWVERSION` / `@Version`) vs `Pessimistic Locking` (`WITH (UPDLOCK)`), (47) Lưu trữ và đánh chỉ mục dữ liệu `JSON` trong SQL Server (`OPENJSON`, Computed Column + Index), (48) `Temporal Tables (System-Versioned)` trong SQL Server để kiểm toán lịch sử thay đổi dữ liệu tự động.

## TASK 05: Tạo `src/data/leetcode-challenges.js` — 12 Bài Toán LeetCode SQL Kinh Điển

### 5.1. Việc Cần Làm
Tạo file `src/data/leetcode-challenges.js` gọi `window.BiKipRegistry.setLeetCodeChallenges([...])` với **đủ 12 bài toán LeetCode SQL kinh điển** kết nối trực tiếp vào cơ sở dữ liệu `db: "LeetCode"` (đã có sẵn trong `src/data/databases/db-leetcode.js`).

### 5.2. Danh Sách 12 Bài Toán Bắt Buộc (Khớp 100% Schema Trong `db-leetcode.js`)
Kiểm tra các bảng trong `src/data/databases/db-leetcode.js` (`Person`, `Address`, `Employee`, `Department`, `Customers`, `Orders`, `Weather`, `Logs`, `Scores`, `Users_Email`) và tạo đủ 12 bài:

| Mã ID | Số Bài | Tiêu Đề Bài Toán | Độ Khó | Bảng Sử Dụng Trong `db-leetcode.js` | Mẫu Kỹ Thuật (Pattern) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lc-175` | **#175** | Combine Two Tables (Ghép Bảng Nhân Khẩu & Địa Chỉ) | Dễ | `Person`, `Address` | `LEFT JOIN` bảo toàn dòng |
| `lc-176` | **#176** | Second Highest Salary (Lương Cao Thứ Hai) | Trung bình | `Employee` | `MAX()` lồng nhau hoặc `DENSE_RANK()` |
| `lc-177` | **#177** | Nth Highest Salary (Lương Cao Thứ N — Xét N=3) | Trung bình | `Employee` | `DENSE_RANK() OVER (ORDER BY salary DESC)` |
| `lc-178` | **#178** | Rank Scores (Xếp Hạng Điểm Số Không Khuyết Hạng) | Trung bình | `Scores` | `DENSE_RANK()` |
| `lc-180` | **#180** | Consecutive Numbers (Số Xuất Hiện Liên Tiếp 3 Lần) | Trung bình | `Logs` | `LEAD()` / `LAG()` hoặc Self-Join 3 bảng |
| `lc-181` | **#181** | Employees Earning More Than Their Managers | Dễ | `Employee` | `SELF JOIN` (`e.managerId = m.id`) |
| `lc-182` | **#182** | Duplicate Emails (Tìm Email Bị Trùng Lặp) | Dễ | `Users_Email` | `GROUP BY email HAVING COUNT(*) > 1` |
| `lc-183` | **#183** | Customers Who Never Order (Khách Chưa Từng Đặt Hàng) | Dễ | `Customers`, `Orders` | `LEFT JOIN ... WHERE o.id IS NULL` hoặc `NOT EXISTS` |
| `lc-184` | **#184** | Department Highest Salary (Lương Cao Nhất Mỗi Phòng Ban) | Trung bình | `Employee`, `Department` | `RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC)` |
| `lc-185` | **#185** | Department Top Three Salaries (Top 3 Mức Lương Mỗi Phòng) | Khó | `Employee`, `Department` | `DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) <= 3` |
| `lc-196` | **#196** | Delete Duplicate Emails (Chỉ Giữ Lại ID Nhỏ Nhất Mỗi Email) | Dễ | `Users_Email` | `GROUP BY email` lấy `MIN(id)` |
| `lc-197` | **#197** | Rising Temperature (Ngày Có Nhiệt Độ Cao Hơn Hôm Trước) | Dễ | `Weather` | `JOIN` với `julianday(w1.recordDate) - julianday(w2.recordDate) = 1` |

*Lưu ý quan trọng:* Mọi `solution_sql` trong `leetcode-challenges.js` phải chạy thành công 100% trên SQLite WASM (`sql.js`) với dữ liệu của `src/data/databases/db-leetcode.js` để Máy Chấm Tự Động (Auto-Grader) chấm `PASS` chính xác!

## TASK 06: Tạo `src/data/appendices.js` — Hệ Thống Phụ Lục A–F & Giấy Phép

### 6.1. Việc Cần Làm
Tạo file `src/data/appendices.js` gọi `window.BiKipRegistry.setAppendicesHtml(htmlStr)` chứa HTML hoàn chỉnh cho **6 Phụ Lục Tra Cứu Nhanh (A – F)**:
- **Phụ lục A:** Bảng Đối Chiếu Cú Pháp Toàn Diện giữa **SQL Server (T-SQL)**, **SQLite (Phòng Lab WASM)**, **PostgreSQL**, và **MySQL** (Giới hạn dòng, Nối chuỗi, Xử lý NULL, Ngày giờ hiện tại, Cộng trừ ngày, Khóa tự tăng, Upsert, Chia nguyên/thực).
- **Phụ lục B:** Bảng Ánh Xạ Kiểu Dữ Liệu từ **SQL Server** sang **Java (JDBC / Hibernate)** và **C# (.NET ADO.NET / EF Core)** (`BIT <-> boolean / bool`, `BIGINT <-> long`, `DECIMAL(18,2) <-> BigDecimal / decimal`, `NVARCHAR <-> String / string`, `DATETIME2 <-> LocalDateTime / DateTime`, `UNIQUEIDENTIFIER <-> UUID / Guid`, `ROWVERSION <-> byte[]`).
- **Phụ lục C:** Bảng Tra Cứu Mã Định Dạng `CONVERT(VARCHAR, GETDATE(), style)` trong T-SQL (`101`, `103`, `108`, `112`, `120`, `126`) và các hàm `DATEPART` / `DATEDIFF`.
- **Phụ lục D:** Sổ Tay Giải Mã Các Toán Tử Trong **Execution Plan** (`Clustered Index Seek`, `Index Scan`, `Table Scan`, `Key Lookup`, `RID Lookup`, `Nested Loops`, `Merge Join`, `Hash Match`, `Sort`, `Stream Aggregate`, `Hash Aggregate`).
- **Phụ lục E:** Danh Mục Phím Tắt Của Trình Đọc `.CHM` & Phòng Lab SQL (`F1`, `F5` / `Ctrl+Enter`, `F6`, `Ctrl+K`, `Alt+Left`, `Alt+Right`, `Space`).
- **Phụ lục F:** Thông Tin Phiên Bản `BiKipCoSoDuLieu_Java_DotNet_v2005.chm` & Giấy Phép Mở **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.

## TASK 07: Tạo 3 Lộ Trình Mở Rộng Trong `src/data/tracks/` (`MySQL`, `PostgreSQL`, `NoSQL`)

### 7.1. Việc Cần Làm
Tạo 3 file plugin mở rộng sử dụng API `window.BiKipRegistry.registerExpansionTrack(trackId, trackMeta)`:
1. **`src/data/tracks/track-mysql.js`** (`trackId: "mysql"`):
   - Chứa cẩm nang chuyển đổi từ T-SQL sang **MySQL 8.0 / InnoDB**: Kiến trúc Clustered Index bắt buộc của InnoDB, `LIMIT ... OFFSET`, `GROUP_CONCAT()`, `ON DUPLICATE KEY UPDATE`, `EXPLAIN ANALYZE`, khác biệt về `utf8mb4_0900_ai_ci` và mức cô lập mặc định `REPEATABLE READ` của MySQL.
2. **`src/data/tracks/track-postgresql.js`** (`trackId: "postgresql"`):
   - Chứa cẩm nang chuyển đổi từ T-SQL sang **PostgreSQL 16**: Cơ chế đa phiên bản `MVCC` dùng `xmin`/`xmax` và `VACUUM`, kiểu `SERIAL` / `GENERATED ALWAYS AS IDENTITY`, `ILIKE`, `DISTINCT ON (...)`, `RETURNING *`, `JSONB` + chỉ mục `GIN`, và `LATERAL JOIN` (tương đương `CROSS APPLY`).
3. **`src/data/tracks/track-nosql.js`** (`trackId: "nosql"`):
   - Chứa cẩm nang thiết kế dữ liệu **NoSQL (MongoDB & Redis)** cho lập trình viên SQL: Ánh xạ khái niệm `Table -> Collection`, `Row -> BSON Document`, quy tắc **Embedding vs Referencing**, `Aggregation Pipeline ($match, $lookup, $group)` so với SQL, và mẫu thiết kế **Cache-Aside / Write-Through với Redis** để giảm tải cho SQL Server.

## TASK 08: Tạo `src/ui/app-engine.js` (Phần 1: Core State, 2000s Browser Bar, History & 98.css TreeView)

### 8.1. Việc Cần Làm
Khởi tạo file `src/ui/app-engine.js`. Ngay đầu hàm IIFE, hợp nhất toàn bộ dữ liệu từ `window.BiKipRegistry`:
```javascript
(function() {
  "use strict";
  const DATA = window.BiKipRegistry.buildGlobalData();
  // ...
```

### 8.2. Các Thành Phần Cốt Lõi Phải Cài Đặt Ở Phần 1
1. **Quản lý State & LocalStorage (`bikip_sql_v2005_store_v1`):**
   - Lưu trữ: `theme` (`classic` | `xp` | `borland` | `crt`), `crtScanlines` (`boolean`), `fontSize` (`13`..`20`), `completedItems` (`{}`), `leitnerBoxes` (`{}`), `notes3Line` (`{}`), `lastView` (`toc` | `chapter` | `lab` | `simulators` | `interview` | `notes` | `tracks` | `appendices`), `lastChapterId` (`ch00`..`ch15`), `activeDbId` (`TruongHoc`..`FruitStore`), `activeSimulatorId` (`join`..`injection`).
2. **Hệ Thống Điều Hướng Trình Duyệt Web 2000s (`Back`, `Forward`, `Home`, `Refresh`, `Address Bar`):**
   - Duy trì mảng `historyStack` và con trỏ `historyIndex`.
   - Mỗi lần chuyển trang (`navigateToView` hoặc `navigateToChapter`), cập nhật thanh địa chỉ `#address-input` với URL ảo hoài niệm:
     - Mục lục: `chm://bikip-csdl-v2005/index.htm`
     - Chương học: `chm://bikip-csdl-v2005/chapters/ch01-select-null-datatypes.htm`
     - Phòng Lab: `chm://bikip-csdl-v2005/sql-lab/FruitStore`
     - Mô phỏng: `chm://bikip-csdl-v2005/simulators/btree`
     - Phỏng vấn: `chm://bikip-csdl-v2005/interview-room/leitner`
     - Sổ tay: `chm://bikip-csdl-v2005/notebook/progress`
     - Mở rộng: `chm://bikip-csdl-v2005/expansion-tracks/postgresql`
     - Phụ lục: `chm://bikip-csdl-v2005/appendices/reference.htm`
   - Khi người dùng gõ vào `#address-input` và nhấn `Enter` hoặc bấm nút `<button class="default" id="btn-address-go">Go</button>`:
     - Nếu bắt đầu bằng `chm://`, điều hướng tới đúng phân khu hoặc chương tương ứng.
     - Nếu gõ từ khóa bất kỳ (ví dụ `ROLLUP`, `FruitStore`, `Deadlock`), tự động chuyển cột trái sang tab **Tìm kiếm (Search)** và thực thi tìm kiếm toàn văn ngay lập tức!
3. **Render Cột Trái Chuẩn 98.css (`ul.tree-view` + `<details>` / `<summary>`):**
   - Trong `renderLeftTocTree()`, sinh thẻ `<ul class="tree-view chm-98-tree">` chia theo 5 cụm phần lớn (Phần I: Ch00–Ch05, Phần II: Ch06–Ch10, Phần III: Ch11–Ch14, Phần IV: Ch15 Từ Điển T-SQL & FruitStore, Phần V: Phòng Lab, 6 Simulators, Phỏng Vấn & Phụ Lục).
   - Mỗi chương có `<details><summary>` để mở ra 11 mục con bên trong; click vào mục con sẽ cuộn mượt `#reading-pane` tới đúng thẻ `<section>` tương ứng.

## TASK 09: Hoàn Thiện `src/ui/app-engine.js` (Phần 2: SQLite WASM Runner, 7 DBs & Auto-Grader)

### 9.1. Việc Cần Làm
Trong `src/ui/app-engine.js`, cài đặt trọn vẹn động cơ thực thi SQL và Phòng Lab Thực Chiến:
1. **Khởi Tạo SQLite WASM (`initSqlEngine`):**
   - Gọi `window.initSqlJs({ locateFile: file => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/" + file })`.
   - Khởi tạo tất cả **7 Cơ Sở Dữ Liệu** từ `DATA.labs.databases` (`TruongHoc`, `ShopOnline`, `Library`, `Countries`, `AutoShop`, `LeetCode`, `FruitStore`) vào bộ nhớ `sqlDatabases[db.id] = new SQL.Database(); dbInstance.run(db.init_sql);`.
   - Có cơ chế Fallback thông minh nếu người dùng ngắt mạng hoàn toàn và CDN `sql-wasm.wasm` chưa kịp cache: hiển thị thông báo hướng dẫn rõ ràng nhưng vẫn cho phép xem lời giải, gợi ý 3 tầng và đối chiếu từ khóa.
2. **Giao Diện Phòng Lab Chuẩn `98.css`:**
   - Sử dụng `<fieldset class="retro-groupbox"><legend>🗄️ Chọn Cơ Sở Dữ Liệu &amp; Bài Tập Thực Hành</legend>...</fieldset>`.
   - Cây cấu trúc bảng & sơ đồ ER hiển thị trong `<div class="sunken-panel">`.
   - Kết quả chạy lệnh SQL (`renderResultTableHtml`) bắt buộc bọc trong `<div class="sunken-panel sql-result-sunken"><table class="interactive">...</table></div>`. Khi người dùng click vào một dòng `<tr>` trong bảng kết quả, thêm/bỏ class `.highlighted` chuẩn `98.css`.
3. **Máy Chấm Bài Tự Động (`gradeSqlResult`):**
   - Chạy câu lệnh của người dùng trên bản sao sạch của DB hiện tại và chạy `problem.solution_sql` để lấy tập kết quả chuẩn.
   - Kiểm tra:
     1. Từ khóa bắt buộc (`required_keywords`) có xuất hiện trong câu lệnh SQL không.
     2. Từ khóa bị cấm (`forbidden_keywords`) có bị vi phạm không.
     3. Số lượng cột và số lượng dòng có khớp nhau không.
     4. Giá trị từng dòng/cột (đã chuẩn hóa số thực `float` và chữ hoa/thường) có khớp nhau không (xét cả `order_matters: true/false`).
   - Nếu `PASS`, tự động đánh dấu hoàn thành bài tập trong `store.completedItems`, cập nhật thanh tiến độ phân đoạn `.progress-indicator.segmented`, và bắn thông báo Toast kiểu Windows 98!

## TASK 10: Hoàn Thiện `src/ui/app-engine.js` (Phần 3: 6 Simulators, Leitner 3-Box, Sổ Tay & Tracks)

### 10.1. Việc Cần Làm
1. **Giao Diện 6 Bộ Mô Phỏng (`buildSimulatorsViewHtml`):**
   - Dùng `<menu role="tablist" class="multirows">` của `98.css` để tạo 6 tab chuyển đổi giữa 6 bộ Simulator.
   - Trong mỗi Simulator:
     - Dùng `<fieldset class="retro-groupbox"><legend>🎛️ Bảng Điều Khiển Mô Phỏng</legend>...</fieldset>`.
     - Dùng Radio button chuẩn `98.css` (`<div class="field-row"><input type="radio" id="..." name="..."><label for="...">...</label></div>`) cho chọn chế độ JOIN hoặc kịch bản B-Tree / SQL Injection.
     - Dùng thanh trượt `<input type="range" class="has-box-indicator">` kết hợp nút `⏮ Bước trước`, `▶ Bước tiếp (Space)` cho Simulator Thứ tự thực thi (`exec_order`), Isolation Timeline (`isolation`), và Chuẩn hóa (`normalization`).
     - Dùng `<div class="sunken-panel"><table class="interactive">` để hiển thị các bảng dữ liệu trung gian (`VT1`..`VT9`).
2. **Phòng Luyện Phỏng Vấn Leitner 3-Box (`buildInterviewRoomHtml`):**
   - Hiển thị 3 hộp Leitner (`Hộp 1: Chưa thuộc / Cần ôn gấp`, `Hộp 2: Đang nhớ`, `Hộp 3: Đã thuộc lòng`) kèm thanh tiến độ phân đoạn `<div class="progress-indicator segmented">`.
   - Bộ lọc cấp độ (`Tất cả`, `Fresher`, `Junior`, `Mid`) dùng `<div class="field-row">` Radio buttons chuẩn `98.css`.
   - Thẻ Flashcard thiết kế như một cửa sổ `div.window` của `98.css` có `div.title-bar` hiển thị mã câu hỏi, cấp độ, chương tham chiếu, nút **Lật xem đáp án & câu hỏi xoáy**, và 3 nút chuyển hộp Leitner.
   - Bên dưới là danh sách **12 Thử Thách LeetCode SQL** hiển thị trong `<div class="sunken-panel"><table class="interactive">` kèm nút **🧪 Mở trong Phòng Lab & Chấm bài** (bấm vào sẽ tự động nạp DB `LeetCode` và bài toán tương ứng vào Phòng Lab).
3. **Sổ Tay 3 Dòng (`buildNotesAndProgressHtml`) & Lộ Trình Mở Rộng (`buildExpansionTracksHtml`):**
   - Sổ tay kiểm tra nghiêm ngặt tối đa 3 dòng (`split('\n').length <= 3`), cho phép lọc ghi chú và bấm nút **📥 Xuất Sổ Tay (.md)** hoặc **💾 Xuất/Nhập Tiến Độ (.json)**.
   - Trang/Modal **Lộ Trình Mở Rộng (`Tracks`)** dùng `<menu role="tablist">` hiển thị 3 tab `MySQL 8.0`, `PostgreSQL 16`, `NoSQL (MongoDB & Redis)` lấy dữ liệu từ `DATA.expansion_tracks`.

## TASK 11: Tạo `index.html` Ở Thư Mục Gốc — Kết Nối Toàn Bộ Hệ Thống

### 11.1. Việc Cần Làm
Tạo file `index.html` tại thư mục gốc `BiKipCoSoDuLieu_Modular_v2005/index.html`. File này phải nạp đúng CSS của `98.css`, 4 file CSS nội bộ, dựng khung HTML chuẩn `98.css` và nạp tất cả các file `<script>` theo đúng thứ tự phụ thuộc.

### 11.2. Cấu Trúc Mẫu Chuẩn Xác Cho `index.html`

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BiKipCoSoDuLieu_Java_DotNet_v2005.chm — Retro 2000s Browser &amp; MSDN SQL Lab</title>
  <!-- 1. Official 98.css Library -->
  <link rel="stylesheet" href="https://unpkg.com/98.css">
  <!-- 2. Modular Project Stylesheets -->
  <link rel="stylesheet" href="assets/css/themes.css">
  <link rel="stylesheet" href="assets/css/layout.css">
  <link rel="stylesheet" href="assets/css/components.css">
  <link rel="stylesheet" href="assets/css/retro-98-browser.css">
  <!-- 3. SQLite WebAssembly Engine -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js"></script>
</head>
<body class="theme-classic">
  <div id="chm-window" class="window">
    <!-- TẦNG 1: WINDOWS 98 / HTML HELP TITLE BAR -->
    <header id="title-bar" class="title-bar">
      <div class="title-bar-text title-left">
        <span class="chm-icon">?</span>
        <span id="window-title-text">BiKipCoSoDuLieu_Java_DotNet_v2005.chm — Microsoft Internet Explorer &amp; HTML Help</span>
      </div>
      <div class="title-bar-controls">
        <button aria-label="Help" id="btn-win-help" title="Phím tắt &amp; Trợ giúp (F1)"></button>
        <button aria-label="Minimize" id="btn-win-min" title="Ẩn/Hiện Cột Mục Lục (F6)"></button>
        <button aria-label="Maximize" id="btn-win-max" title="Toàn màn hình"></button>
        <button aria-label="Close" id="btn-win-close" title="Về Trang Chủ Mục Lục"></button>
      </div>
    </header>

    <div id="chm-window-body" class="window-body">
      <!-- TẦNG 2: CLASSIC MENU BAR + 98.CSS SEGMENTED PROGRESS INDICATOR -->
      <nav id="menu-bar" aria-label="Thanh thực đơn chính">
        <div class="menu-items">
          <button class="menu-btn active" data-nav-view="toc"><u>F</u>ile (Mục lục)</button>
          <button class="menu-btn" data-nav-view="chapter"><u>V</u>iew (Bài học)</button>
          <button class="menu-btn" data-nav-view="lab"><u>L</u>ab SQL (Thực hành)</button>
          <button class="menu-btn" data-nav-view="simulators"><u>S</u>imulators (6 Mô phỏng)</button>
          <button class="menu-btn" data-nav-view="interview"><u>I</u>nterview &amp; LeetCode</button>
          <button class="menu-btn" data-nav-view="notes"><u>N</u>otes (Sổ tay 3 dòng)</button>
          <button class="menu-btn" data-nav-view="tracks"><u>T</u>racks (MySQL/PG/NoSQL)</button>
          <button class="menu-btn" data-nav-view="appendices"><u>A</u>ppendices (Phụ lục)</button>
          <button class="menu-btn" id="btn-open-shortcuts"><u>H</u>elp (F1)</button>
        </div>
        <div class="retro-progress-wrap" title="Tiến độ hoàn thành khóa học &amp; bài tập Lab">
          <span id="top-progress-text">Tiến độ: 0%</span>
          <div class="progress-indicator segmented" style="width: 120px;">
            <span class="progress-indicator-bar" id="top-progress-fill" style="width: 0%;"></span>
          </div>
        </div>
      </nav>

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
          <label for="font-size-slider">Cỡ chữ:</label>
          <input id="font-size-slider" type="range" class="has-box-indicator" min="13" max="20" value="15" style="width: 75px;">
          <span id="font-size-val">15px</span>
        </div>
        <div class="toolbar-sep"></div>
        <div class="toolbar-group field-row" style="margin: 0;">
          <label for="theme-select">Giao diện:</label>
          <select id="theme-select" aria-label="Chọn giao diện">
            <option value="classic">Win98 / Win2000 Classic</option>
            <option value="xp">Windows XP Luna Blue</option>
            <option value="borland">Borland Turbo C++ 3.1</option>
            <option value="crt">Green Phosphor CRT</option>
          </select>
        </div>
        <div class="toolbar-group field-row" style="margin: 0;">
          <input type="checkbox" id="chk-crt-scanlines">
          <label for="chk-crt-scanlines">CRT Scanlines</label>
        </div>
      </div>

      <!-- TẦNG 4: 2000s INTERNET EXPLORER 5.5 ADDRESS BAR & QUICK LINKS -->
      <div id="browser-address-bar">
        <div class="field-row address-field-row">
          <label for="address-input" class="address-label">Address</label>
          <div class="sunken-panel address-input-wrap">
            <span>📄</span>
            <input id="address-input" type="text" value="chm://bikip-csdl-v2005/index.htm" spellcheck="false" aria-label="Thanh địa chỉ nội bộ">
          </div>
          <button class="default" id="btn-address-go">Go</button>
        </div>
        <div class="quick-links-bar">
          <span class="address-label">Links &raquo;</span>
          <button class="quick-link-btn" data-quick-ch="ch03">🔗 JOIN</button>
          <button class="quick-link-btn" data-quick-ch="ch05">🪟 Window</button>
          <button class="quick-link-btn" data-quick-ch="ch08">🌲 B-Tree</button>
          <button class="quick-link-btn" data-quick-ch="ch09">🔒 ACID</button>
          <button class="quick-link-btn" data-quick-ch="ch15">🍍 T-SQL A-Z</button>
        </div>
        <div class="ie-throbber" id="ie-throbber" title="MSDN 2000 Offline Browser Engine">🌐</div>
      </div>

      <!-- TẦNG 5: SPLIT WORKSPACE (LEFT 98.CSS TABLIST + TREEVIEW, RIGHT READING PANE) -->
      <div id="workspace">
        <aside id="left-pane" aria-label="Khung điều hướng CHM">
          <menu role="tablist" class="left-tabs">
            <li role="tab" aria-selected="true" class="left-tab active" data-left-tab="toc"><a href="#tab-toc">Nội dung</a></li>
            <li role="tab" aria-selected="false" class="left-tab" data-left-tab="index"><a href="#tab-index">Chỉ mục</a></li>
            <li role="tab" aria-selected="false" class="left-tab" data-left-tab="search"><a href="#tab-search">Tìm kiếm</a></li>
          </menu>
          <div class="window left-tab-panel" role="tabpanel">
            <div class="window-body left-tab-body" id="left-tab-toc">
              <ul class="tree-view chm-98-tree" id="toc-tree-container"></ul>
            </div>
            <div class="window-body left-tab-body" id="left-tab-index" style="display:none;">
              <div class="field-row-stacked" style="margin-bottom:6px;">
                <label for="index-filter-input">Gõ từ khóa cần tra cứu (A–Z):</label>
                <input id="index-filter-input" type="text" placeholder="VD: COALESCE, ROW_NUMBER, B-Tree...">
              </div>
              <div class="sunken-panel" style="flex:1; overflow-y:auto; padding:4px;" id="index-list-container"></div>
            </div>
            <div class="window-body left-tab-body" id="left-tab-search" style="display:none;">
              <div class="field-row-stacked" style="margin-bottom:6px;">
                <label for="fulltext-search-input">Tìm toàn văn trong 16 Chương &amp; 77 Bài tập (Ctrl+K):</label>
                <div class="field-row">
                  <input id="fulltext-search-input" type="search" placeholder="Nhập từ khóa..." style="flex:1;">
                  <button class="default" id="btn-run-search">Tìm</button>
                </div>
              </div>
              <div class="sunken-panel" style="flex:1; overflow-y:auto; padding:4px;" id="search-results-container"></div>
            </div>
          </div>
        </aside>

        <main id="reading-pane" class="sunken-panel" tabindex="0" aria-label="Nội dung chính">
          <!-- Được render động bởi src/ui/app-engine.js -->
        </main>
      </div>

      <!-- TẦNG 6: 98.CSS STATUS BAR -->
      <footer id="status-bar" class="status-bar">
        <p class="status-bar-field" id="status-cell-1">🌐 Done — chm://bikip-csdl-v2005/index.htm</p>
        <p class="status-bar-field" id="status-cell-2">📘 Mục lục tổng quan (16 Chương)</p>
        <p class="status-bar-field" id="status-cell-3">🗄️ SQLite WASM: Đang khởi tạo...</p>
        <p class="status-bar-field" id="status-cell-4">🖥️ My Computer (Offline Local Zone)</p>
      </footer>
    </div>
  </div>

  <div id="toast-container" aria-live="polite"></div>

  <!-- MODAL TRỢ GIÚP PHÍM TẮT (98.CSS WINDOW DIALOG) -->
  <div class="modal-backdrop" id="shortcut-modal" role="dialog" aria-modal="true" aria-labelledby="shortcut-modal-title">
    <div class="window modal-window">
      <div class="title-bar">
        <div class="title-bar-text" id="shortcut-modal-title">⌨️ Bảng Phím Tắt &amp; Hướng Dẫn Sử Dụng (MSDN HTML Help v2005)</div>
        <div class="title-bar-controls">
          <button aria-label="Close" id="btn-close-modal"></button>
        </div>
      </div>
      <div class="window-body modal-body" id="shortcut-modal-body"></div>
    </div>
  </div>

  <!-- =========================================================================
       DETERMINISTIC SCRIPT LOADING PIPELINE (ZERO-BUNDLER FILE:// ARCHITECTURE)
       ========================================================================= -->
  <!-- 1. Core Registry -->
  <script src="src/core/registry.js"></script>
  <!-- 2. Meta Table of Contents -->
  <script src="src/data/meta-toc.js"></script>
  <!-- 3. All 16 Curriculum Chapters (Ch00 - Ch15) -->
  <script src="src/data/chapters/ch00-nen-tang.js"></script>
  <script src="src/data/chapters/ch01-select-null-datatypes.js"></script>
  <script src="src/data/chapters/ch02-functions-case-coalesce.js"></script>
  <script src="src/data/chapters/ch03-joins-set-operators.js"></script>
  <script src="src/data/chapters/ch04-groupby-having-subquery.js"></script>
  <script src="src/data/chapters/ch05-window-functions-cte-paging.js"></script>
  <script src="src/data/chapters/ch06-dml-ddl-constraints-identity.js"></script>
  <script src="src/data/chapters/ch07-database-design-er-normalization.js"></script>
  <script src="src/data/chapters/ch08-index-btree-sargability-plan.js"></script>
  <script src="src/data/chapters/ch09-transactions-acid-isolation-deadlock.js"></script>
  <script src="src/data/chapters/ch10-views-stored-procs-triggers-temp.js"></script>
  <script src="src/data/chapters/ch11-security-sql-injection-permissions.js"></script>
  <script src="src/data/chapters/ch12-backend-bridge-java-dotnet-orm.js"></script>
  <script src="src/data/chapters/ch13-tsql-advanced-json-pivot-temporal.js"></script>
  <script src="src/data/chapters/ch14-interview-strategy-leetcode-sql.js"></script>
  <script src="src/data/chapters/ch15-tsql-keyword-dictionary-fruitstore.js"></script>
  <!-- 4. All 7 SQLite WASM Databases -->
  <script src="src/data/databases/db-truonghoc.js"></script>
  <script src="src/data/databases/db-shoponline.js"></script>
  <script src="src/data/databases/db-library.js"></script>
  <script src="src/data/databases/db-countries.js"></script>
  <script src="src/data/databases/db-autoshop.js"></script>
  <script src="src/data/databases/db-leetcode.js"></script>
  <script src="src/data/databases/db-fruitstore.js"></script>
  <!-- 5. Simulators, Interview Bank, LeetCode 12 & Appendices -->
  <script src="src/data/simulators.js"></script>
  <script src="src/data/interview-bank.js"></script>
  <script src="src/data/leetcode-challenges.js"></script>
  <script src="src/data/appendices.js"></script>
  <!-- 6. Multi-DBMS Expansion Tracks -->
  <script src="src/data/tracks/track-mysql.js"></script>
  <script src="src/data/tracks/track-postgresql.js"></script>
  <script src="src/data/tracks/track-nosql.js"></script>
  <!-- 7. Main Application Engine -->
  <script src="src/ui/app-engine.js"></script>
</body>
</html>
```

## TASK 12: Kiểm Thử Nghiệm Thu Toàn Diện (End-to-End Verification Checklist)

Sau khi hoàn thành Task 01 đến Task 11, Antigravity phải chạy quy trình kiểm tra cuối cùng theo đúng 10 tiêu chí sau:

1. **Kiểm tra khởi chạy `file://`:** Mở `index.html` trực tiếp, thanh Status Bar hiển thị `🗄️ SQLite WASM: Sẵn sàng (7 DB)` và không có lỗi đỏ nào trong DevTools Console.
2. **Kiểm tra Cây mục lục `ul.tree-view` (`98.css`):** Nhánh `<details><summary>` đóng mở mượt mà; click từ `Chương 0` đến `Chương 15` hiển thị đầy đủ bài giảng, bảng so sánh phương ngữ, cầu nối Java/C# và bài tập cuối chương.
3. **Kiểm tra Thanh địa chỉ Trình duyệt 2000s (`#address-input`):** Chuyển trang tự động đổi URL `chm://bikip-csdl-v2005/...`; nút `◀ Back` và `Forward ▶` hoạt động đúng lịch sử duyệt bài.
4. **Kiểm tra Phòng Lab SQL với cả 7 Databases:** Chuyển qua lại giữa `TruongHoc`, `ShopOnline`, `Library`, `Countries`, `AutoShop`, `LeetCode`, và `FruitStore`; bấm **▶ Chạy thử (F5)** hiển thị bảng kết quả trong `<div class="sunken-panel"><table class="interactive">`, click dòng trong bảng đổi sang nền xanh `#000080` chữ trắng (`.highlighted`).
5. **Kiểm tra Máy chấm tự động (Auto-Grader):** Bấm **✅ Nộp & Chấm điểm** cho ít nhất 3 bài tập thuộc `TruongHoc`, `FruitStore` và `LeetCode`, xác nhận chấm `ĐẠT (PASS)` khi đúng và báo rõ lý do khi sai.
6. **Kiểm tra 6 Bộ Mô Phỏng (`Simulators`):** Chuyển qua cả 6 tab trong `<menu role="tablist" class="multirows">`, thử chọn Radio button, kéo Slider `.has-box-indicator` và bấm phím `Space` để nhảy bước.
7. **Kiểm tra Phòng Phỏng Vấn Leitner & 12 Bài LeetCode:** Lật thẻ Flashcard, chuyển thẻ giữa 3 hộp Leitner, kiểm tra thanh `<div class="progress-indicator segmented">` tăng phần trăm, và bấm nút nhảy từ bảng LeetCode sang Phòng Lab.
8. **Kiểm tra Sổ tay 3 dòng & Xuất dữ liệu:** Viết ghi chú 3 dòng, thử xuống dòng thứ 4 (hệ thống phải chặn và nhắc quy tắc 3 dòng), bấm xuất file `.md` và `.json`.
9. **Kiểm tra 3 Lộ trình Mở rộng (`Tracks`) & Phụ lục A–F:** Mở tab `Tracks` xem đủ `MySQL 8.0`, `PostgreSQL 16`, `NoSQL (MongoDB & Redis)` và mở tab `Appendices` xem đủ Phụ lục A–F.
10. **Kiểm tra 4 Themes & CRT Scanlines:** Đổi qua `Win98/2000 Classic`, `Windows XP Luna`, `Borland Turbo C++`, `Green Phosphor CRT` và tích ô `CRT Scanlines`, đảm bảo mọi thành phần `98.css` hiển thị độ tương phản hoàn hảo.
