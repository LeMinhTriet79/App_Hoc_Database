# README_KIEN_TRUC_MO_RONG.md — Tổng Quan Toàn Bộ Context & Kiến Trúc Hệ Thống

> **Tên ứng dụng:** `BiKipCoSoDuLieu_Java_DotNet_v2005.chm` (Bản Modular Mở Rộng `v2005` + Giao diện Trình duyệt Web 2000s **98.css**)  
> **Bản quyền nội dung:** CC BY-SA 4.0 — Giáo trình & Phòng Lab SQL Thực Chiến dành cho Sinh viên Kỹ thuật Phần mềm / Backend Java & .NET.  
> **Vai trò của file này:** Cung cấp **100% Context Hệ Thống (System Context & Domain Model)** để AI Agent (**Antigravity**) hiểu thấu đáo ứng dụng này là gì, những file nào đã có sẵn, những file nào bị thiếu trong đợt nén zip trước, các module giao tiếp với nhau ra sao, và cách nâng cấp giao diện lên chuẩn **Trình Duyệt Web 2000s + MSDN HTML Help (.CHM)** bằng thư viện **[98.css](https://jdan.github.io/98.css/)**.

## 1. Ứng Dụng Này Là Gì? (Tầm Nhìn & Triết Lý Sản Phẩm)

`BiKipCoSoDuLieu_Java_DotNet_v2005.chm` là một **Hệ Sinh Thái Học Tập, Thực Hành & Luyện Phỏng Vấn Cơ Sở Dữ Liệu (SQL Server / T-SQL & Chuẩn ANSI SQL)** hoạt động hoàn toàn Offline ngay trên trình duyệt mà không cần cài đặt Database Server hay Web Server.

### 1.1. 6 Trụ Cột Chức Năng Của Ứng Dụng
1. **Giáo Trình 16 Chương Chuyên Sâu (Ch00 – Ch15):**
   - Từ nền tảng Mô hình Quan hệ (Ch00), `SELECT`/`NULL` 3VL (Ch01), Hàm xử lý chuỗi/ngày giờ/`CASE`/`COALESCE` (Ch02), `JOIN` & Tập hợp (Ch03), `GROUP BY`/`HAVING`/Subquery (Ch04), Window Functions & CTE (Ch05), DML/DDL/Constraints (Ch06), Thiết kế ER & Chuẩn hóa 1NF–BCNF (Ch07), B-Tree Index & Execution Plan (Ch08), Transaction ACID/Isolation/Deadlock (Ch09), Views/Stored Procs/Triggers (Ch10), Bảo mật SQL Injection (Ch11), Cầu nối Backend Java JDBC/JPA & C# ADO.NET/Dapper/EF Core (Ch12), T-SQL Nâng cao JSON/PIVOT/Temporal (Ch13), Chiến thuật Phỏng vấn & LeetCode SQL (Ch14), đến **Từ Điển 60+ Từ Khóa T-SQL & Phòng Lab Cửa Hàng Trái Cây `FruitStore`** (Ch15).
   - Mỗi chương từ Ch01–Ch14 đều tuân thủ cấu trúc **11 Phần Chuẩn Sư Phạm** (Mục tiêu, Lý thuyết, Chạy tay từng bước, 6 Ví dụ thực tế, Khác biệt phương ngữ T-SQL vs SQLite/PostgreSQL, Cầu nối Java & C#, Hiệu năng, Lỗi hay gặp, Câu hỏi phỏng vấn, Bài tập có 3 tầng gợi ý, Tổng kết).
2. **Phòng Lab SQLite WASM Thực Chiến + Máy Chấm Tự Động (Auto-Grader):**
   - Tích hợp `sql.js` (SQLite biên dịch sang WebAssembly) cho phép viết và chạy câu lệnh SQL thật 100% ngay trong trình duyệt.
   - Gồm **7 Cơ Sở Dữ Liệu mẫu**: `TruongHoc`, `ShopOnline`, `Library`, `Countries`, `AutoShop`, `LeetCode`, và `FruitStore`.
   - Có **Máy Chấm Bài Tự Động (Deterministic SQL Auto-Grader)**: So sánh tập kết quả của sinh viên với đáp án chuẩn (`solution_sql`), kiểm tra số cột, số dòng, giá trị từng ô, thứ tự sắp xếp, từ khóa bắt buộc (`required_keywords`) và từ khóa bị cấm (`forbidden_keywords`).
3. **6 Bộ Mô Phỏng Trực Quan Tương Tác (Interactive Visual Simulators):**
   - (1) **Bộ mô phỏng các phép JOIN** (`INNER`, `LEFT`, `RIGHT`, `FULL`, `CROSS`, và bẫy lọc `ON` vs `WHERE`).
   - (2) **Bộ mô phỏng Thứ tự Thực thi Lý thuyết (Logical Query Processing Order)** 9 bước từ `FROM` -> `JOIN` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT` -> `DISTINCT` -> `ORDER BY` -> `TOP/FETCH`.
   - (3) **Bộ mô phỏng Cây Chỉ Mục B-Tree vs Table Scan** (so sánh số trang I/O đọc được khi có SARGable Index và khi mất Index do bọc hàm).
   - (4) **Bộ mô phỏng Mức Cô Lập Giao Dịch (Transaction Isolation Levels)** tái hiện Timeline giữa Transaction A và Transaction B cho *Dirty Read*, *Non-Repeatable Read*, *Phantom Read*, *RCSI*, và *Deadlock*.
   - (5) **Bộ mô phỏng Chuẩn Hóa Cơ Sở Dữ Liệu (Normalization Stepper)** tách bảng phẳng dư thừa qua từng bước `UNF -> 1NF -> 2NF -> 3NF -> BCNF`.
   - (6) **Phòng Thí Nghiệm Tấn Công & Phòng Thủ SQL Injection** (so sánh trực tiếp nối chuỗi mất an toàn làm lộ toàn bộ bảng với `PreparedStatement` Java / `SqlParameter` C#).
4. **Phòng Luyện Phỏng Vấn Leitner 3-Box & 12 Thử Thách LeetCode SQL:**
   - **48 Thẻ Flashcard Phỏng Vấn Backend (`Fresher`, `Junior`, `Mid`)** tích hợp thuật toán lặp lại ngắt quãng **Leitner 3 Hộp** (*Hộp 1: Chưa thuộc*, *Hộp 2: Đang nhớ*, *Hộp 3: Đã thuộc lòng*).
   - **12 Bài Toán LeetCode SQL Kinh Điển (`#175` – `#197`)** kết nối trực tiếp vào database `LeetCode` trong Phòng Lab để bấm một nút là nhảy sang viết code và chấm bài ngay.
5. **Sổ Tay Ghi Chú 3 Dòng (3-Line Note Rule) & Quản Lý Tiến Độ Cá Nhân:**
   - Cho phép sinh viên ghi chú tối đa 3 dòng cô đọng cho từng chương/bài tập, lưu tự động vào `localStorage`, hỗ trợ xuất/nhập tiến độ ra file `.json` và xuất toàn bộ sổ tay ra file `.md`.
6. **Kiến Trúc Mở Rộng Đa Hệ Quản Trị (Expansion Tracks):**
   - Hỗ trợ cắm thêm các lộ trình mở rộng (`MySQL 8.0 Track`, `PostgreSQL 16 Track`, `NoSQL MongoDB & Redis Track`) thông qua `window.BiKipRegistry.registerExpansionTrack(...)`.

### 1.2. Linh Hồn Giao Diện: Trình Duyệt Web Năm 2000 + MSDN HTML Help (.CHM) Với `98.css`
- Giao diện của ứng dụng tái hiện chân thực cảm giác ngồi trước màn hình máy tính năm 2000–2005: sự kết hợp giữa **Internet Explorer 5.5 / Netscape Communicator** (có thanh tiêu đề xanh đậm, thanh Menu cổ điển, hàng nút công cụ *Back / Forward / Stop / Refresh / Home / Search / Favorites / Print*, thanh **Address Bar** hiển thị địa chỉ nội bộ `chm://bikip-csdl-v2005/...`, thanh **Links Bar**, biểu tượng quả địa cầu góc phải) và **Trình đọc tài liệu kỹ thuật Microsoft HTML Help (`hh.exe` `.CHM`)** (chia 2 khung: bên trái là Cây mục lục `ul.tree-view` 98.css có đường chấm nối và nút `+/-`, bên phải là khung đọc tài liệu chìm `sunken-panel`).

## 2. Chẩn Đoán Hiện Trạng Thư Mục Của Người Dùng (Audit Thực Tế)

Dựa trên ảnh chụp màn hình thư mục `BiKipCoSoDuLieu_Modular_v2005` của người dùng, quá trình xuất file nén trước đó đã dừng lại ở `src/data/meta-toc.js` (theo thứ tự bảng chữ cái). Dưới đây là bảng kiểm kê chính xác **28 file đã có** và **11 file đang thiếu**:

| Nhóm Module | Đường Dẫn File | Trạng Thái Hiện Tại | Hành Động Của Antigravity |
| :--- | :--- | :--- | :--- |
| **CSS Nền tảng** | `assets/css/themes.css` | ✅ **Đã có (3.6 KB)** | Giữ nguyên 4 biến theme (`classic`, `xp`, `borland`, `crt`) |
| **CSS Bố cục** | `assets/css/layout.css` | ✅ **Đã có (10.0 KB)** | Giữ nguyên bố cục khung `#chm-window` |
| **CSS Thành phần** | `assets/css/components.css` | ✅ **Đã có (8.0 KB)** | Giữ nguyên style bài đọc, bảng, code block |
| **CSS 98.css & Browser** | `assets/css/retro-98-browser.css` | ❌ **Đang thiếu** | **Tạo mới (Task 02)** để tích hợp sâu `98.css` & IE5 Browser Chrome |
| **Core Registry** | `src/core/registry.js` | ✅ **Đã có (2.0 KB)** | Giữ nguyên 100% API `window.BiKipRegistry` |
| **Mục lục TOC** | `src/data/meta-toc.js` | ✅ **Đã có (16.0 KB)** | Giữ nguyên 100% |
| **16 Chương Học** | `src/data/chapters/ch00..ch15.js` | ✅ **Đã có đủ 16 files (~780 KB)** | Giữ nguyên tuyệt đối, không chỉnh sửa làm mất chữ |
| **7 Databases** | `src/data/databases/db-*.js` | ✅ **Đã có đủ 7 files (~33 KB)** | Giữ nguyên tuyệt đối (`autoshop`, `countries`, `fruitstore`, `leetcode`, `library`, `shoponline`, `truonghoc`) |
| **6 Simulators** | `src/data/simulators.js` | ❌ **Đang thiếu** | **Tạo mới (Task 03)** qua `BiKipRegistry.setSimulators(...)` |
| **48 Thẻ Phỏng Vấn** | `src/data/interview-bank.js` | ❌ **Đang thiếu** | **Tạo mới (Task 04)** qua `BiKipRegistry.setInterviewBank(...)` |
| **12 Bài LeetCode** | `src/data/leetcode-challenges.js` | ❌ **Đang thiếu** | **Tạo mới (Task 05)** qua `BiKipRegistry.setLeetCodeChallenges(...)` |
| **Phụ lục A–F** | `src/data/appendices.js` | ❌ **Đang thiếu** | **Tạo mới (Task 06)** qua `BiKipRegistry.setAppendicesHtml(...)` |
| **3 Tracks Mở Rộng** | `src/data/tracks/track-mysql.js`, `track-postgresql.js`, `track-nosql.js` | ❌ **Đang thiếu** | **Tạo mới (Task 07)** qua `BiKipRegistry.registerExpansionTrack(...)` |
| **Engine Điều Khiển** | `src/ui/app-engine.js` | ❌ **Đang thiếu** | **Tạo mới (Tasks 08–10)** chứa toàn bộ logic UI, SQLite WASM, Grader, Simulators, Leitner |
| **Root Entry HTML** | `index.html` | ❌ **Đang thiếu** | **Tạo mới (Task 11)** kết nối `98.css`, `sql-wasm.js` và toàn bộ `<script>` |

## 3. Sơ Đồ Cây Thư Mục Hoàn Chỉnh Sau Khi Tái Cấu Trúc

```text
BiKipCoSoDuLieu_Modular_v2005/
├── index.html                                         # [CẦN TẠO - TASK 11] Điểm vào chính (Double-click chạy ngay)
├── agents.md                                          # [ĐÃ CÓ] Bộ luật tối cao cho AI Agent (Antigravity)
├── README_KIEN_TRUC_MO_RONG.md                        # [ĐÃ CÓ] Tài liệu kiến trúc & toàn bộ context hệ thống
├── TASKS.md                                           # [ĐÃ CÓ] Danh sách 12 Task thực thi tuần tự
├── assets/
│   └── css/
│       ├── themes.css                                 # [ĐÃ CÓ] 4 bảng màu: Win2000 Classic, XP Luna, Borland, CRT
│       ├── layout.css                                 # [ĐÃ CÓ] Khung cửa sổ cố định #chm-window
│       ├── components.css                             # [ĐÃ CÓ] Định dạng nội dung chương, bảng, code, callout
│       └── retro-98-browser.css                       # [CẦN TẠO - TASK 02] 98.css Bridge + 2000s IE5 Browser Chrome
└── src/
    ├── core/
    │   └── registry.js                                # [ĐÃ CÓ] Bộ đăng ký trung tâm window.BiKipRegistry
    ├── data/
    │   ├── meta-toc.js                                # [ĐÃ CÓ] Metadata & Mục lục 16 chương
    │   ├── chapters/                                  # [ĐÃ CÓ ĐỦ 16 FILES]
    │   │   ├── ch00-nen-tang.js                       # Chương 0: Nền tảng CSDL & Đại số quan hệ (setCh0Html)
    │   │   ├── ch01-select-null-datatypes.js          # Chương 1: SELECT, WHERE, NULL 3VL, Kiểu dữ liệu
    │   │   ├── ch02-functions-case-coalesce.js        # Chương 2: Chuỗi, Ngày giờ, CASE, COALESCE vs ISNULL
    │   │   ├── ch03-joins-set-operators.js            # Chương 3: JOIN (INNER/OUTER/CROSS/SELF) & UNION/EXCEPT
    │   │   ├── ch04-groupby-having-subquery.js        # Chương 4: GROUP BY, HAVING, Subquery, EXISTS vs IN
    │   │   ├── ch05-window-functions-cte-paging.js    # Chương 5: OVER(PARTITION BY), ROW_NUMBER, CTE đệ quy
    │   │   ├── ch06-dml-ddl-constraints-identity.js   # Chương 6: INSERT/UPDATE/DELETE, OUTPUT, MERGE, Constraints
    │   │   ├── ch07-database-design-er-normalization.js # Chương 7: Thiết kế ER, 1NF, 2NF, 3NF, BCNF
    │   │   ├── ch08-index-btree-sargability-plan.js   # Chương 8: Clustered/Non-Clustered B-Tree, SARGable, Plan
    │   │   ├── ch09-transactions-acid-isolation-deadlock.js # Chương 9: ACID, 4 Isolation Levels, RCSI, Deadlock
    │   │   ├── ch10-views-stored-procs-triggers-temp.js # Chương 10: View, Stored Procedure, Trigger, #Temp vs @Var
    │   │   ├── ch11-security-sql-injection-permissions.js # Chương 11: SQL Injection, Parameterized Queries, RBAC
    │   │   ├── ch12-backend-bridge-java-dotnet-orm.js # Chương 12: JDBC/JPA/Hibernate & ADO.NET/Dapper/EF Core, N+1
    │   │   ├── ch13-tsql-advanced-json-pivot-temporal.js # Chương 13: CROSS/OUTER APPLY, PIVOT, JSON, Temporal
    │   │   ├── ch14-interview-strategy-leetcode-sql.js # Chương 14: Chiến thuật giải đề SQL & 12 Mẫu bài phỏng vấn
    │   │   └── ch15-tsql-keyword-dictionary-fruitstore.js # Chương 15: Từ điển T-SQL A-Z & Phòng Lab FruitStore
    │   ├── databases/                                 # [ĐÃ CÓ ĐỦ 7 FILES]
    │   │   ├── db-truonghoc.js                        # DB 1: Quản lý Trường Học (Khoa, SinhVien, MonHoc, KetQua)
    │   │   ├── db-shoponline.js                       # DB 2: Thương mại điện tử (KhachHang, SanPham, DonHang...)
    │   │   ├── db-library.js                          # DB 3: Thư viện (DocGia, Sach, PhieuMuon)
    │   │   ├── db-countries.js                        # DB 4: Địa lý & Quốc gia (Countries, Cities)
    │   │   ├── db-autoshop.js                         # DB 5: Xưởng Ô tô (Departments, Employees, Customers, Cars)
    │   │   ├── db-leetcode.js                         # DB 6: Bộ bảng chấm 12 bài LeetCode SQL (#175 - #197)
    │   │   └── db-fruitstore.js                       # DB 7: Cửa hàng Trái cây (Fruits, Categories, Suppliers, Sales)
    │   ├── simulators.js                              # [CẦN TẠO - TASK 03] 6 Bộ mô phỏng trực quan
    │   ├── interview-bank.js                          # [CẦN TẠO - TASK 04] 48 Thẻ phỏng vấn (Fresher/Junior/Mid)
    │   ├── leetcode-challenges.js                     # [CẦN TẠO - TASK 05] 12 Thử thách LeetCode SQL kinh điển
    │   ├── appendices.js                              # [CẦN TẠO - TASK 06] Phụ lục A-F & Giấy phép CC BY-SA 4.0
    │   └── tracks/                                    # [CẦN TẠO - TASK 07] Các lộ trình mở rộng đa hệ quản trị
    │       ├── track-mysql.js                         # Lộ trình MySQL 8.0 / MariaDB
    │       ├── track-postgresql.js                    # Lộ trình PostgreSQL 16
    │       └── track-nosql.js                         # Lộ trình MongoDB & Redis cho Dev SQL
    └── ui/
        └── app-engine.js                              # [CẦN TẠO - TASKS 08, 09, 10] Trái tim điều khiển toàn bộ App
```

## 4. Đặc Tả Chi Tiết Kiến Trúc `window.BiKipRegistry` & Data Schemas

File `src/core/registry.js` đã tồn tại trong thư mục của người dùng với giao diện chuẩn sau:

```javascript
window.BiKipRegistry = {
  setMetaToc: function(tocObj) { ... },
  setCh0Html: function(htmlStr) { ... },
  registerChapter: function(chapterObj) { ... },
  registerDatabase: function(dbObj) { ... },
  setSimulators: function(simObj) { ... },
  setInterviewBank: function(bankArr) { ... },
  setLeetCodeChallenges: function(lcArr) { ... },
  setAppendicesHtml: function(htmlStr) { ... },
  registerExpansionTrack: function(trackId, trackMeta) { ... },
  buildGlobalData: function() {
    // Trả về đối tượng DATA tổng hợp:
    // {
    //   toc, ch0_html, chapters,
    //   labs: { databases },
    //   simulators, interview_bank, leetcode_challenges,
    //   appendices_html, expansion_tracks
    // }
  }
};
```

### 4.1. Schema Của Một Chương (`chapterObj` trong `src/data/chapters/ch01..ch15.js`)
Mỗi file `ch01..ch15.js` gọi `window.BiKipRegistry.registerChapter({...})` với cấu trúc đã có sẵn:
- `id`: `"ch01"` .. `"ch15"`
- `code`: `"CHƯƠNG 1"` .. `"CHƯƠNG 15"`
- `title`: Tiêu đề chương
- `source_ref`: Nguồn tham chiếu học thuật
- `objectives`: Mảng các mục tiêu học tập (`string[]`)
- `signals`: Mảng dấu hiệu nhận biết khi nào cần dùng kiến thức chương này (`string[]`)
- `theory_html`: HTML lý thuyết nền tảng
- `trace_html`: HTML minh họa cơ chế chạy tay từng bước
- `examples`: Mảng các ví dụ thực tế (`{ id, title, db, sql_standard, sql_tsql, explanation, expected_preview }`)
- `dialect_diffs`: Mảng đối chiếu khác biệt giữa `SQL Server (T-SQL)`, `SQLite (Lab)`, và `PostgreSQL / MySQL` (`{ feature, tsql, sqlite, postgres_mysql, note }`)
- `backend_bridge_html`: HTML cầu nối mã nguồn Java (JDBC / Spring Data JPA) và C# (.NET ADO.NET / Dapper / EF Core)
- `perf_html`: HTML phân tích hiệu năng, chi phí I/O và Execution Plan
- `pitfalls`: Mảng các lỗi hay gặp (`{ wrong, right, why }`)
- `interview_qs`: Mảng câu hỏi phỏng vấn gắn với chương (`{ level, q, a, followup }`)
- `exercises`: Mảng bài tập thực hành có chấm tự động (`{ id, title, difficulty, db, prompt, hints: [h1, h2, h3], starter_sql, solution_sql, required_keywords, forbidden_keywords, order_matters }`)
- `checklist`: Mảng các mục tự kiểm tra cuối chương (`string[]`)

### 4.2. Schema Của Một Cơ Sở Dữ Liệu (`dbObj` trong `src/data/databases/db-*.js`)
Mỗi file `db-*.js` gọi `window.BiKipRegistry.registerDatabase({...})` với cấu trúc:
- `id`: `"TruongHoc"` | `"ShopOnline"` | `"Library"` | `"Countries"` | `"AutoShop"` | `"LeetCode"` | `"FruitStore"`
- `name`: Tên hiển thị tiếng Việt kèm mã DB
- `desc`: Mô tả nghiệp vụ của cơ sở dữ liệu
- `er_ascii`: Sơ đồ thực thể kết hợp (ER Diagram) vẽ bằng ký tự ASCII
- `tables`: Mảng tên các bảng kèm danh sách cột (ví dụ: `"SinhVien(MaSV, HoTen, Phai, NgaySinh, MaKhoa, HocBong)"`)
- `init_sql`: Chuỗi lệnh SQL (`DROP TABLE IF EXISTS...; CREATE TABLE...; INSERT INTO...;`) được truyền vào `db.run(init_sql)` của SQLite WASM (`sql.js`).

### 4.3. Schema Của 6 Bộ Mô Phỏng (`simulators.js` — Cần Tạo Ở Task 03)
`window.BiKipRegistry.setSimulators(simObj)` nhận vào một Object có 6 khóa chính xác:
1. `join`: `{ title, left_table, right_table, modes: { INNER, LEFT, RIGHT, FULL, CROSS, ON_VS_WHERE } }`
2. `exec_order`: `{ title, query, steps: [ { step, clause, active_rows, columns, desc, note } ] }`
3. `btree`: `{ title, table_info, scenarios: [ { id, name, sql, sargable, plan_op, io_pages, tree_path, scan_desc, fix_tip } ] }`
4. `isolation`: `{ title, levels: { READ_UNCOMMITTED, READ_COMMITTED, READ_COMMITTED_SNAPSHOT, REPEATABLE_READ, SERIALIZABLE, DEADLOCK_DEMO } }`
5. `normalization`: `{ title, stages: [ { form, title, problems, tables: [ { name, pk, fk, cols, rows } ], action_taken } ] }`
6. `injection`: `{ title, scenarios: [ { id, label, username_input, password_input, raw_concat_sql, prepared_sql, param_bindings, concat_outcome, prepared_outcome, explanation } ] }`

### 4.4. Schema Của Ngân Hàng Phỏng Vấn (`interview-bank.js` — Cần Tạo Ở Task 04)
`window.BiKipRegistry.setInterviewBank(bankArr)` nhận vào mảng **48 đối tượng flashcard**:
- `{ id: "iv-01".."iv-48", level: "Fresher" | "Junior" | "Mid", chapter: "ch01".."ch14", topic: string, q: string, a: string, followup: string }`

### 4.5. Schema Của 12 Bài Toán LeetCode SQL (`leetcode-challenges.js` — Cần Tạo Ở Task 05)
`window.BiKipRegistry.setLeetCodeChallenges(lcArr)` nhận vào mảng **12 bài toán kinh điển**:
- `{ id: "lc-175".."lc-197", lc_num: 175, title: string, difficulty: "Dễ" | "Trung bình" | "Khó", db: "LeetCode", pattern: string, prompt: string, hints: [string, string, string], starter_sql: string, solution_sql: string, required_keywords: string[], forbidden_keywords: string[], order_matters: boolean }`

## 5. Thiết Kế Hệ Thống Giao Diện Trình Duyệt Web 2000s + MSDN CHM Với `98.css`

Để biến ứng dụng thành một **Trình duyệt Web thập niên 2000 cực kỳ hoài niệm** (Internet Explorer 5.5 + MSDN Library Viewer), khung `#chm-window.window` được chia thành **6 tầng cố định theo chiều dọc**:

| Tầng | ID Phần Tử | Thành Phần `98.css` Sử Dụng | Chức Năng Chi Tiết |
| :--- | :--- | :--- | :--- |
| **Tầng 1** | `#title-bar` | `div.title-bar` + `div.title-bar-text` + `div.title-bar-controls` (`button[aria-label="Help"]`, `Minimize`, `Maximize`, `Close`) | Thanh tiêu đề cửa sổ Windows 98/2000 với dải màu gradient xanh Navy và bộ nút điều khiển pixel chuẩn. |
| **Tầng 2** | `#menu-bar` | Thanh thực đơn cổ điển (`File`, `Edit`, `View`, `Favorites`, `Tools`, `Tracks`, `Help`) + `div.progress-indicator.segmented` | Chuyển nhanh giữa các phân khu chính, mở Modal Lộ trình Mở rộng (`Tracks`), và hiển thị thanh tiến độ phân đoạn (`segmented`) kiểu cài đặt phần mềm năm 2000. |
| **Tầng 3** | `#tool-bar` | Hàng nút `button` 98.css + `<input type="range" class="has-box-indicator">` + `<select>` + `<div class="field-row"><input type="checkbox"><label>` | Các nút trình duyệt cổ điển: **Ẩn/Hiện Cột Trái**, **◀ Back**, **▶ Forward**, **🔄 Refresh**, **🏠 Home**, **🖨️ In (Print)**, thanh trượt cỡ chữ `has-box-indicator`, chọn 4 Theme, và tích bật màn hình `CRT`. |
| **Tầng 4** | `#browser-address-bar` | `div.field-row` + `<label>Address</label>` + `<input type="text">` + `<button class="default">Go</button>` + Quick Links Bar | **Thanh địa chỉ trình duyệt IE 5.5:** Tự động cập nhật URL ảo dạng `chm://bikip-csdl-v2005/chapters/ch01`, cho phép gõ từ khóa hoặc địa chỉ `chm://` và bấm `Go`, kèm các nút Bookmark nhanh (`JOIN`, `Window`, `B-Tree`, `ACID`, `T-SQL A-Z`). |
| **Tầng 5** | `#workspace` | **Khung Trái (`#left-pane`):** `menu[role="tablist"]` (3 tab: *Nội dung*, *Chỉ mục*, *Tìm kiếm*) + `ul.tree-view` có `<details><summary>`.<br>**Khung Phải (`#reading-pane`):** `div.sunken-panel` chứa nội dung bài đọc, bảng dữ liệu `table.interactive` và GroupBox `fieldset`. | Không gian làm việc chia đôi chuẩn MSDN `.CHM`. Cột trái điều hướng cây thư mục, tra cứu từ khóa A–Z và tìm kiếm toàn văn. Cột phải hiển thị bài giảng, Phòng Lab SQL, Simulator hoặc Phòng Phỏng Vấn. |
| **Tầng 6** | `#status-bar` | `div.status-bar` + 4 thẻ `p.status-bar-field` | Hiển thị trạng thái duyệt web (`🌐 Done`), vị trí chương/mục hiện tại, trạng thái động cơ `SQLite WASM` + `% Tiến độ`, và vùng bảo mật `🖥️ My Computer (Offline Local Zone)`. |

## 6. Hướng Dẫn Mở Rộng Kiến Trúc Trong Tương Lai (Plugin Extension Guide)

Nhờ cơ chế `window.BiKipRegistry`, bất kỳ lập trình viên hay AI Agent nào muốn mở rộng thêm nội dung trong tương lai chỉ cần:
1. **Thêm Chương Mới (ví dụ `ch16-query-store-tuning.js`):**
   - Tạo file mới trong `src/data/chapters/ch16-query-store-tuning.js` gọi `window.BiKipRegistry.registerChapter({ id: "ch16", ... })`.
   - Thêm `<script src="src/data/chapters/ch16-query-store-tuning.js"></script>` vào `index.html`.
2. **Thêm Database Thực Hành Mới (ví dụ `db-banking.js`):**
   - Tạo file `src/data/databases/db-banking.js` gọi `window.BiKipRegistry.registerDatabase({ id: "Banking", ... })`.
   - Thêm thẻ `<script>` vào `index.html`; Phòng Lab SQL sẽ tự động nhận diện database mới trong `<select>` và tự khởi tạo bảng trong SQLite WASM.
3. **Thêm Lộ Trình Hệ Quản Trị Mới (ví dụ `track-oracle.js`):**
   - Tạo file `src/data/tracks/track-oracle.js` gọi `window.BiKipRegistry.registerExpansionTrack("oracle", { ... })`.
