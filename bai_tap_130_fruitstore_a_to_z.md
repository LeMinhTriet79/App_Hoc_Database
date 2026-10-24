# 🍎 GIÁO TRÌNH THỰC HÀNH 130 BÀI TẬP SQL TỪ A ĐẾN Z TRÊN DATABASE `FRUITSTORE_ULTIMATE` (CHƯƠNG 1 – CHƯƠNG 13) & MASTER PROMPT CHO ANTIGRAVITY

> **Mục tiêu tài liệu**: Bộ giáo trình luyện **Phản Xạ Cơ Bắp (Muscle Memory)** gồm **130 bài tập thực hành có chấm điểm tự động** (13 Chương cốt lõi × 10 bài/chương, từ Chương 1 đến Chương 13; giữ nguyên Chương 14 & 15 là phần tổng kết chiến thuật và từ điển tra cứu). Toàn bộ 130 bài đều bám sát 100% trên 9 bảng của Database **`FruitStore_Ultimate` (`Fruits.sql` / `db: "fruitstore"`)** và đã được kiểm chứng kết quả đầu ra (`expected.cols` & `expected.rows`) trên engine SQLite/SQL.js.

## MỤC LỤC TỔNG QUAN

1. **PHẦN 1 — MASTER PROMPT DÀNH CHO ANTIGRAVITY**: Lệnh chỉ đạo để AI Antigravity tự động tạo module `src/data/fruitstore-130-drills.js` và tích hợp vào từng Chương 1–13 cũng như mở thêm Chuyên đề **"🍎 Luyện Tập 130 Bài FruitStore (A–Z)"** và nạp vào Dropdown SQL Lab.
2. **PHẦN 2 — SƠ ĐỒ 9 BẢNG `FRUITSTORE_ULTIMATE` & PHƯƠNG PHÁP LUYỆN PHẢN XẠ LẶP (MUSCLE MEMORY)**: Giải thích cấu trúc 10 bài/chương (Cụm Phản Xạ Mẫu A: Bài 1–3, Cụm Phản Xạ Mẫu B: Bài 4–6, Cụm Tổ Hợp Trung Cấp: Bài 7–8, Cụm Thực Chiến Nâng Cao: Bài 9–10).
3. **PHẦN 3 — CHI TIẾT 130 BÀI TẬP TỪ A ĐẾN Z (CHƯƠNG 1 ĐẾN CHƯƠNG 13)**: Đầy đủ Đề bài, Khuôn mẫu phản xạ, Gợi ý, Code chuẩn T-SQL (SQL Server), Code chuẩn SQLite (SQL Lab) và Bảng kết quả kỳ vọng (`expected`) của từng bài.
4. **PHẦN 4 — MÃ NGUỒN TÍCH HỢP (`src/data/fruitstore-130-drills.js` & `app-engine.js`)**: Code mẫu chuẩn để Antigravity nối trực tiếp vào dự án.

## PHẦN 1: MASTER PROMPT DÀNH CHO ANTIGRAVITY (COPY & PASTE TRỰC TIẾP)

Hãy copy toàn bộ khối lệnh dưới đây (hoặc đính kèm trực tiếp file `.md` này vào khung chat của **Antigravity**) để AI thực thi tự động từ đầu đến cuối:

```markdown
# ROLE & MISSION DÀNH CHO ANTIGRAVITY
Bạn là Principal Frontend & Database Curriculum Engineer. Nhiệm vụ của bạn là tích hợp trọn bộ **130 bài tập thực hành A-to-Z trên Database `FruitStore_Ultimate` (`db: "fruitstore"`)** (10 bài/chương cho 13 chương cốt lõi từ `ch01` đến `ch13`, không đụng chạm cấu trúc lý thuyết của `ch14` và `ch15`) vào ứng dụng **Bí Kíp Cơ Sở Dữ Liệu & T-SQL Toàn Tập**.

## QUY TẮC BẤT DI BẤT DỊCH (MANDATORY RULES)
1. **Không cắt bớt (Zero Truncation)**: Phải nạp đủ 100% cả **130 bài tập** (`FS-CH01-01` đến `FS-CH13-10`) có trong tài liệu này. Tuyệt đối KHÔNG dùng comment `// TODO`, `// ... các bài tương tự` hay rút gọn số bài.
2. **Cơ chế học Phản Xạ Cơ Bắp (Muscle Memory)**: Giữ nguyên thứ tự 10 bài của mỗi chương (Bài 1-2-3 lặp lại Mẫu cú pháp A trên 3 bảng khác nhau; Bài 4-5-6 lặp lại Mẫu cú pháp B trên 3 bảng khác nhau; Bài 7-8 Trung cấp; Bài 9-10 Thực chiến nâng cao).
3. **Đồng bộ Database**: Mọi bài tập trong bộ 130 bài này đều chạy trên `db: "fruitstore"` (`src/data/databases/db-fruitstore.js`). Khi người dùng bấm nút **"🧪 Mở bài này trong SQL Lab"** hoặc chọn bài từ Dropdown trong SQL Lab, ứng dụng phải tự động chuyển Database sang `fruitstore`, nạp sẵn câu lệnh mẫu/khung làm bài và chấm điểm tự động dựa trên đối tượng `expected: { cols, rows }` đã cung cấp sẵn.

## CÁC TASK CẦN THỰC HIỆN TUẦN TỰ

### TASK 1: Kiểm tra và đảm bảo Schema `src/data/databases/db-fruitstore.js` khớp tuyệt đối với `Fruits.sql`
- Kiểm tra file `src/data/databases/db-fruitstore.js` đảm bảo có đủ 9 bảng (`Employees`, `Categories`, `Fruits`, `Customers`, `Vouchers`, `Orders`, `OrderDetails`, `Reviews`, `PaymentTransactions`) và dữ liệu `Orders.TotalAmount` đã được đồng bộ khớp với kết quả sau lệnh `UPDATE` bằng CTE trong `Fruits.sql`:
  - `OrderID = 1`: `850000`, `OrderID = 2`: `180000`, `OrderID = 3`: `150000`, `OrderID = 4`: `850000`, `OrderID = 5`: `2500000`, `OrderID = 6`: `300000`, `OrderID = 7`: `180000`, `OrderID = 8`: `200000`, `OrderID = 9`: `400000`, `OrderID = 10`: `95000`.
  - Cột `OrderDetails.SubTotal` được khai báo là `SubTotal INT GENERATED ALWAYS AS (Quantity * UnitPrice) STORED`.

### TASK 2: Tạo file dữ liệu `src/data/fruitstore-130-drills.js` chứa toàn bộ 130 bài tập
- Tạo file mới `src/data/fruitstore-130-drills.js` đăng ký vào `window.SQLMasterRegistry.fruitstoreDrills` (hoặc tự động nối vào mảng `exercises` của từng chương `ch01`..`ch13` và tạo thêm 1 chương luyện tập tổng hợp `ch-fruitstore-130`).
- Mỗi bài tập trong mảng có cấu trúc chuẩn tương thích 100% với bộ chấm điểm của `app-engine.js`:
  ```js
  {
    id: 'FS-CH01-01',
    chapterId: 'ch01',
    level: 'Cơ bản (Mẫu A1 - SELECT & Alias)',
    pattern: 'SELECT col1 AS Alias1, col2 AS Alias2 FROM Table ORDER BY col1;',
    title: 'Bài 1.1: Xem danh mục trái cây (Bảng Categories)',
    question: '...',
    hint: '...',
    db: 'fruitstore',
    sql: '...',      // Câu lệnh SQLite chạy trực tiếp trong SQL Lab
    tsql: '...',     // Câu lệnh T-SQL chuẩn SQL Server để đối chiếu
    expected: { cols: [...], rows: [...] }
  }
  ```

### TASK 3: Tích hợp hiển thị 2 chiều (Trong từng Chương 1–13 VÀ trong Chuyên đề Luyện tập 130 bài)
1. **Tại mỗi chương từ Chương 1 (`ch01`) đến Chương 13 (`ch13`)**:
   - Tự động gắn thêm 10 bài tập `FruitStore_Ultimate` của chương đó vào khu vực **"🍎 Luyện Tập Phản Xạ FruitStore (10 Bài Từ Cơ Bản Đến Nâng Cao)"** ở cuối mỗi chương.
   - Mỗi bài hiển thị rõ: Nhãn cấp độ & Khuôn mẫu phản xạ (`pattern`), Đề bài, Nút **"💡 Xem Gợi ý"**, Nút **"👁️ Xem Đáp án T-SQL & SQLite"**, và Nút **"🧪 Luyện ngay trong SQL Lab"** (bấm vào sẽ mở ngay bài đó trong SQL Lab với Database `fruitstore`).
2. **Tại Sidebar & SQL Lab**:
   - Thêm mục **"🍎 130 Bài Tập FruitStore (A–Z)"** trên cây thư mục Sidebar (`TreeView`) để người học có thể mở xem toàn bộ 130 bài tập tập trung, lọc theo Chương (`Ch01`..`Ch13`), lọc theo Trạng thái (`Đã hoàn thành` / `Chưa làm`) và theo dõi thanh Tiến độ `ProgressBar` (`0/130 bài - 0%`).
   - Nạp toàn bộ 130 bài vào `<select id="lab-exercise-select">` (nhóm theo `<optgroup label="Chương X...">`) trong tab **SQL Lab** để học viên chuyển bài liên tục bằng 1 cú click.

### TASK 4: Nhúng thẻ `<script>` vào `index.html` và kiểm thử
- Thêm `<script src="./src/data/fruitstore-130-drills.js"></script>` ngay sau các file chương trong `index.html` (trước `src/ui/app-engine.js`).
- Kiểm tra bấm chạy thử từng bài trong SQL Lab đảm bảo nút **"✔️ Chấm Điểm Bài Tập"** báo **PASS (Đạt 100%)** và lưu trạng thái hoàn thành vào `localStorage`.
```

## PHẦN 2: SƠ ĐỒ 9 BẢNG `FRUITSTORE_ULTIMATE` & PHƯƠNG PHÁP LUYỆN "PHẢN XẠ CƠ BẮP" (MUSCLE MEMORY)

### 2.1. Tóm tắt nhanh 9 bảng trong `FruitStore_Ultimate` (`Fruits.sql`)

| STT | Tên bảng | Số dòng | Khóa chính (PK) | Khóa ngoại (FK) & Đặc điểm dữ liệu quan trọng cần nhớ khi làm bài |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `Employees` | 7 dòng | `EmployeeID` (1..7) | `ManagerID` tự tham chiếu về `EmployeeID`. ID 1 (`Lê Minh Triết`) là Giám đốc (`ManagerID IS NULL`), ID 2-3 là Quản lý, ID 4-5 là NV Kho, ID 6-7 là NV Bán hàng. |
| 2 | `Categories` | 5 dòng | `CategoryID` (1..5) | 1: Đặc sản Miền Tây, 2: Trái cây Nhập khẩu, 3: Quả mọng (Berries), 4: Trái cây sấy, 5: Quả hạch (Nuts). |
| 3 | `Fruits` | 14 dòng | `FruitID` (1..14) | FK `CategoryID`. `FruitID = 11` (`Mâm Xôi Đen`) có `StockQuantity = 0`. `FruitID IN (12, 13)` có `AttributesJSON IS NULL`. `FruitID IN (11, 12, 13, 14)` chưa từng được mua. |
| 4 | `Customers` | 8 dòng | `CustomerID` (1..8) | `PhoneNumber` UNIQUE. Khách VIP gồm ID 1 (`Võ Thành Tài`) và ID 4 (`Triệu Mẫn`). `CustomerID = 8` (`Dương Quá`) chưa từng đặt đơn hàng nào. |
| 5 | `Vouchers` | 3 dòng | `VoucherID` (1..3) | 1: `WELCOME50` (giảm 50k, đơn tối thiểu 200k), 2: `VIP100` (giảm 100k, đơn tối thiểu 500k), 3: `HETHAN` (giảm 30k, `UsedCount = UsageLimit = 500`, chưa đơn nào trong `Orders` dùng). |
| 6 | `Orders` | 10 dòng | `OrderID` (1..10) | FK `CustomerID`, `EmployeeID` (chỉ NV 6 và 7 bán), `VoucherID` (có thể `NULL`). `TotalAmount` đã trừ giảm giá Voucher. |
| 7 | `OrderDetails` | 13 dòng | `OrderDetailID` (1..13) | FK `OrderID`, `FruitID`. Cột `SubTotal` tự động tính bằng `Quantity * UnitPrice`. |
| 8 | `Reviews` | 4 dòng | `ReviewID` (1..4) | FK `CustomerID`, `FruitID`. Điểm `Rating` từ 1 đến 5. |
| 9 | `PaymentTransactions` | 6 dòng | `TransactionID` (1..6) | FK `OrderID` (cho các đơn 1..6). Đơn số 2 (`TotalAmount = 180000`) khách trả `'Tiền mặt'` `Amount = 200000` (dư 20,000đ). |

### 2.2. Thiết kế Sư phạm "Lặp Khuôn Mẫu Đa Bảng" (Như học phép cộng Lớp 1: `1+1`, `3+4`, `5+5`)

Để não bộ hình thành **phản xạ gõ code tự nhiên không cần tra cứu**, 10 bài tập của mỗi chương được chia làm 4 chặng:

- **Bài 1, Bài 2, Bài 3 (Cụm Phản Xạ Mẫu A)**: Cùng 1 cơ chế cú pháp trọng tâm số 1 của chương, nhưng Bài 1 truy vấn trên bảng A, Bài 2 truy vấn trên bảng B, Bài 3 truy vấn trên bảng C.
- **Bài 4, Bài 5, Bài 6 (Cụm Phản Xạ Mẫu B)**: Cùng 1 cơ chế cú pháp trọng tâm số 2 của chương, tiếp tục xoay vòng trên 3 bảng/trường khác nhau.
- **Bài 7, Bài 8 (Cụm Tổ Hợp Trung Cấp)**: Kết hợp 2–3 kỹ thuật trong chương trên dữ liệu giao dịch thực tế.
- **Bài 9, Bài 10 (Cụm Thực Chiến & Bẫy Phỏng Vấn)**: Giải quyết bài toán báo cáo doanh nghiệp hoặc gỡ bẫy phỏng vấn kinh điển của chương đó.

## PHẦN 3: CHI TIẾT 130 BÀI TẬP TỪ A ĐẾN Z (CHƯƠNG 1 ĐẾN CHƯƠNG 13)

### Chương 1: SELECT, WHERE, ORDER BY, NULL & Kiểu Dữ Liệu

- **Mục tiêu phản xạ của chương**: Rèn phản xạ trích xuất cột (Projection), lọc dòng (WHERE), loại trùng (DISTINCT), kiểm tra NULL (IS NULL / IS NOT NULL) và sắp xếp (ORDER BY / TOP-LIMIT) xoay vòng trên cả 9 bảng của FruitStore.

#### [FS-CH01-01] Bài 1.1: Xem danh mục trái cây (Bảng Categories)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A1 - SELECT & Alias)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT col1 AS Alias1, col2 AS Alias2 FROM Table ORDER BY col1;`
- **Đề bài**: Hãy lấy ra mã danh mục (`CategoryID`), tên danh mục (`CategoryName`) và mô tả (`Description`) từ bảng `Categories`, sắp xếp theo `CategoryID` tăng dần.
- **Gợi ý tư duy**: Dùng `SELECT CategoryID, CategoryName, Description FROM Categories ORDER BY CategoryID ASC;`

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT CategoryID, CategoryName, Description
FROM Categories
ORDER BY CategoryID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT CategoryID, CategoryName, Description
FROM Categories
ORDER BY CategoryID ASC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 3 cột):**

| CategoryID | CategoryName | Description |
| :--- | :--- | :--- |
| 1 | Đặc sản Miền Tây | Trái cây hái tại vườn ĐBSCL |
| 2 | Trái cây Nhập khẩu | Táo, Nho, Cherry từ Mỹ, Úc, Nhật |
| 3 | Quả mọng (Berries) | Dâu tây, Việt quất, Mâm xôi |
| 4 | Trái cây sấy | Đã qua chế biến khô |
| 5 | Quả hạch (Nuts) | Mắc ca, Hạnh nhân, Óc chó |

#### [FS-CH01-02] Bài 1.2: Xem danh sách nhân sự (Bảng Employees)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A2 - SELECT & Alias trên bảng khác)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT col1, col2, col3 FROM Table ORDER BY col1; (Cùng cơ chế Bài 1.1 nhưng đổi sang bảng Employees)`
- **Đề bài**: Áp dụng y hệt cơ chế Bài 1.1 nhưng trên bảng `Employees`: Hãy lấy ra mã nhân viên (`EmployeeID`), họ tên (`FullName`) và chức vụ (`Role`), sắp xếp theo `EmployeeID` tăng dần.
- **Gợi ý tư duy**: Thay tên bảng thành `Employees` và các cột thành `EmployeeID, FullName, Role`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT EmployeeID, FullName, Role
FROM Employees
ORDER BY EmployeeID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT EmployeeID, FullName, Role
FROM Employees
ORDER BY EmployeeID ASC;
```

**Kết quả kỳ vọng (`expected` — 7 dòng × 3 cột):**

| EmployeeID | FullName | Role |
| :--- | :--- | :--- |
| 1 | Lê Minh Triết | Giám đốc |
| 2 | Nguyễn Tấn Dũng | Quản lý Kho |
| 3 | Trần Thị Mai | Quản lý Bán hàng |
| 4 | Phạm Văn A | Nhân viên Kho |
| 5 | Lý Bạch | Nhân viên Kho |
| 6 | Hoàng Cúc | Nhân viên Bán hàng |
| 7 | Đinh Hợi | Nhân viên Bán hàng |

#### [FS-CH01-03] Bài 1.3: Xem danh sách mã giảm giá (Bảng Vouchers)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A3 - SELECT & Alias trên bảng khác)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT col1, col2, col3 FROM Table ORDER BY col1; (Cùng cơ chế Bài 1.1 & 1.2 nhưng đổi sang bảng Vouchers)`
- **Đề bài**: Tiếp tục phản xạ SELECT cơ bản trên bảng `Vouchers`: Lấy ra mã định danh (`VoucherID`), mã code (`VoucherCode`), số tiền giảm (`DiscountAmount`) và ngày hết hạn (`ExpiryDate`), sắp xếp theo `VoucherID` tăng dần.
- **Gợi ý tư duy**: Truy vấn từ bảng `Vouchers` và sắp xếp `ORDER BY VoucherID ASC`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT VoucherID, VoucherCode, DiscountAmount, ExpiryDate
FROM Vouchers
ORDER BY VoucherID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT VoucherID, VoucherCode, DiscountAmount, ExpiryDate
FROM Vouchers
ORDER BY VoucherID ASC;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 4 cột):**

| VoucherID | VoucherCode | DiscountAmount | ExpiryDate |
| :--- | :--- | :--- | :--- |
| 1 | WELCOME50 | 50000 | 2025-12-31 |
| 2 | VIP100 | 100000 | 2025-12-31 |
| 3 | HETHAN | 30000 | 2023-12-31 |

#### [FS-CH01-04] Bài 1.4: Lọc trái cây theo nguồn gốc Bến Tre (Bảng Fruits)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B1 - Lọc WHERE so sánh bằng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM Table WHERE Col = Value ORDER BY ...;`
- **Đề bài**: Lấy ra `FruitID`, `FruitName`, `Price`, `Unit` của các loại trái cây có xuất xứ (`Origin`) là `'Bến Tre'`, sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Dùng `WHERE Origin = N'Bến Tre'` (T-SQL) hoặc `WHERE Origin = 'Bến Tre'` (SQLite).

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, Price, Unit
FROM Fruits
WHERE Origin = N'Bến Tre'
ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Price, Unit
FROM Fruits
WHERE Origin = 'Bến Tre'
ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 4 cột):**

| FruitID | FruitName | Price | Unit |
| :--- | :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | 150000 | Kg |
| 2 | Bưởi Da Xanh | 70000 | Quả |

#### [FS-CH01-05] Bài 1.5: Lọc khách hàng hạng VIP (Bảng Customers)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B2 - Lọc WHERE so sánh bằng trên bảng khác)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM Table WHERE Col = Value ORDER BY ...; (Cùng cơ chế Bài 1.4 nhưng trên bảng Customers)`
- **Đề bài**: Áp dụng y hệt mẫu lọc `WHERE` của Bài 1.4 nhưng trên bảng `Customers`: Lấy ra `CustomerID`, `FullName`, `PhoneNumber`, `Address` của những khách hàng có phân hạng (`CustomerType`) là `'VIP'`, sắp xếp theo `CustomerID` tăng dần.
- **Gợi ý tư duy**: Dùng `WHERE CustomerType = 'VIP'` trên bảng `Customers`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT CustomerID, FullName, PhoneNumber, Address
FROM Customers
WHERE CustomerType = N'VIP'
ORDER BY CustomerID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT CustomerID, FullName, PhoneNumber, Address
FROM Customers
WHERE CustomerType = 'VIP'
ORDER BY CustomerID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 4 cột):**

| CustomerID | FullName | PhoneNumber | Address |
| :--- | :--- | :--- | :--- |
| 1 | Võ Thành Tài | 0901111222 | Quận 1, TP.HCM |
| 4 | Triệu Mẫn | 0904444555 | Quận 7, TP.HCM |

#### [FS-CH01-06] Bài 1.6: Lọc giao dịch thanh toán qua VNPAY (Bảng PaymentTransactions)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B3 - Lọc WHERE so sánh bằng trên bảng khác)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM Table WHERE Col = Value ORDER BY ...; (Cùng cơ chế Bài 1.4 & 1.5 nhưng trên bảng PaymentTransactions)`
- **Đề bài**: Tiếp tục mẫu lọc `WHERE` trên bảng `PaymentTransactions`: Lấy ra `TransactionID`, `OrderID`, `Amount`, `PaymentDate` của các giao dịch có phương thức (`PaymentMethod`) là `'VNPAY'`, sắp xếp theo `TransactionID` tăng dần.
- **Gợi ý tư duy**: Dùng `WHERE PaymentMethod = 'VNPAY'`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT TransactionID, OrderID, Amount, PaymentDate
FROM PaymentTransactions
WHERE PaymentMethod = N'VNPAY'
ORDER BY TransactionID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT TransactionID, OrderID, Amount, PaymentDate
FROM PaymentTransactions
WHERE PaymentMethod = 'VNPAY'
ORDER BY TransactionID ASC;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 4 cột):**

| TransactionID | OrderID | Amount | PaymentDate |
| :--- | :--- | :--- | :--- |
| 1 | 1 | 850000 | 2023-02-14 10:16:00 |
| 4 | 4 | 850000 | 2023-08-08 16:47:00 |
| 5 | 5 | 2500000 | 2023-12-24 19:05:00 |

#### [FS-CH01-07] Bài 1.7: Tìm trái cây chưa có thông tin JSON (Bẫy IS NULL trên Fruits)

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Bẫy 3-Valued Logic với IS NULL)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM Table WHERE NullableCol IS NULL;`
- **Đề bài**: Lấy ra `FruitID`, `FruitName`, `Origin` của các mặt hàng trong bảng `Fruits` chưa được cập nhật thuộc tính JSON (`AttributesJSON` mang giá trị `NULL`), sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Tuyệt đối không dùng `= NULL`! Hãy dùng `WHERE AttributesJSON IS NULL`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, Origin
FROM Fruits
WHERE AttributesJSON IS NULL
ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Origin
FROM Fruits
WHERE AttributesJSON IS NULL
ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 3 cột):**

| FruitID | FruitName | Origin |
| :--- | :--- | :--- |
| 12 | Nho khô Ninh Thuận | Ninh Thuận |
| 13 | Mít sấy giòn | Đồng Nai |

#### [FS-CH01-08] Bài 1.8: Tìm các đơn hàng không áp dụng mã giảm giá (Bảng Orders)

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Bẫy IS NULL trên bảng Orders & Employees)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM Table WHERE NullableCol IS NULL; (Lặp lại phản xạ IS NULL trên bảng Orders)`
- **Đề bài**: Áp dụng đúng phản xạ `IS NULL` vừa học ở Bài 1.7 sang bảng `Orders`: Lấy ra `OrderID`, `CustomerID`, `TotalAmount`, `Status` của các đơn hàng không dùng Voucher (`VoucherID` là `NULL`), sắp xếp theo `OrderID` tăng dần.
- **Gợi ý tư duy**: Dùng `WHERE VoucherID IS NULL` trên bảng `Orders`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT OrderID, CustomerID, TotalAmount, Status
FROM Orders
WHERE VoucherID IS NULL
ORDER BY OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT OrderID, CustomerID, TotalAmount, Status
FROM Orders
WHERE VoucherID IS NULL
ORDER BY OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 4 cột):**

| OrderID | CustomerID | TotalAmount | Status |
| :--- | :--- | :--- | :--- |
| 1 | 1 | 850000 | Đã giao |
| 3 | 3 | 150000 | Đã giao |
| 7 | 6 | 180000 | Đã hủy |
| 8 | 1 | 200000 | Đang giao |
| 10 | 7 | 95000 | Chờ xử lý |

#### [FS-CH01-09] Bài 1.9: Lọc trái cây nhập khẩu hoặc quả mọng trong tầm giá 150k - 400k

- **Cấp độ & Nhóm phản xạ**: `Nâng cao (Kết hợp BETWEEN, IN, DISTINCT)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM Table WHERE Col1 IN (...) AND Col2 BETWEEN x AND y ORDER BY ...;`
- **Đề bài**: Lấy ra `FruitID`, `FruitName`, `CategoryID`, `Price`, `StockQuantity` của các trái cây thuộc danh mục `2` (Nhập khẩu) hoặc `3` (Quả mọng), có giá (`Price`) từ `150000` đến `400000` và còn hàng (`StockQuantity > 0`). Sắp xếp theo `Price` giảm dần.
- **Gợi ý tư duy**: Kết hợp `CategoryID IN (2, 3) AND Price BETWEEN 150000 AND 400000 AND StockQuantity > 0`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, CategoryID, Price, StockQuantity
FROM Fruits
WHERE CategoryID IN (2, 3)
  AND Price BETWEEN 150000 AND 400000
  AND StockQuantity > 0
ORDER BY Price DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, CategoryID, Price, StockQuantity
FROM Fruits
WHERE CategoryID IN (2, 3)
  AND Price BETWEEN 150000 AND 400000
  AND StockQuantity > 0
ORDER BY Price DESC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 5 cột):**

| FruitID | FruitName | CategoryID | Price | StockQuantity |
| :--- | :--- | :--- | :--- | :--- |
| 10 | Việt Quất (Blueberry) | 3 | 350000 | 20 |
| 6 | Táo Envy | 2 | 250000 | 100 |
| 9 | Dâu Tây Mộc Châu | 3 | 200000 | 45 |
| 8 | Kiwi Vàng | 2 | 180000 | 60 |

#### [FS-CH01-10] Bài 1.10: Top 5 loại trái cây có tổng giá trị tồn kho lớn nhất

- **Cấp độ & Nhóm phản xạ**: `Thực chiến (TOP N / LIMIT & Biểu thức tính toán)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT TOP (N) / LIMIT N với cột tính toán Giá trị tồn kho = Price * StockQuantity`
- **Đề bài**: Tính giá trị tồn kho (`InventoryValue = Price * StockQuantity`) cho từng loại trái cây trong bảng `Fruits`. Lấy ra 5 loại trái cây có `InventoryValue` cao nhất (gồm `FruitID`, `FruitName`, `Price`, `StockQuantity`, `InventoryValue`), sắp xếp theo `InventoryValue` giảm dần, nếu bằng nhau thì xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Trong T-SQL dùng `SELECT TOP 5 ... ORDER BY InventoryValue DESC, FruitID ASC`. Trong SQLite dùng `LIMIT 5` ở cuối.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT TOP 5 FruitID, FruitName, Price, StockQuantity,
       (Price * StockQuantity) AS InventoryValue
FROM Fruits
ORDER BY InventoryValue DESC, FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Price, StockQuantity,
       (Price * StockQuantity) AS InventoryValue
FROM Fruits
ORDER BY InventoryValue DESC, FruitID ASC
LIMIT 5;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 5 cột):**

| FruitID | FruitName | Price | StockQuantity | InventoryValue |
| :--- | :--- | :--- | :--- | :--- |
| 12 | Nho khô Ninh Thuận | 120000 | 300 | 36000000 |
| 14 | Hạt Mắc Ca | 280000 | 90 | 25200000 |
| 6 | Táo Envy | 250000 | 100 | 25000000 |
| 3 | Xoài Cát Hòa Lộc | 80000 | 200 | 16000000 |
| 7 | Cherry Đỏ Thẫm | 450000 | 30 | 13500000 |

### Chương 2: Hàm Xử Lý Chuỗi, Ngày Tháng, Toán Học, CASE WHEN & COALESCE

- **Mục tiêu phản xạ của chương**: Rèn phản xạ xử lý NULL bằng COALESCE/ISNULL, phân loại dữ liệu bằng CASE WHEN, cắt ghép chuỗi và trích xuất năm/tháng trên dữ liệu thực tế của FruitStore.

#### [FS-CH02-01] Bài 2.1: Thay thế NULL bằng thông báo mặc định cho cột JSON (Bảng Fruits)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A1 - COALESCE xử lý NULL)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ..., COALESCE(NullableCol, DefaultVal) AS Alias FROM Table;`
- **Đề bài**: Lấy ra `FruitID`, `FruitName` và cột `AttributesJSON`. Nếu `AttributesJSON` là `NULL` thì hiển thị chuỗi `'Chưa có thông số JSON'`, đặt tên cột là `JsonStatus`. Sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Dùng `COALESCE(AttributesJSON, 'Chưa có thông số JSON') AS JsonStatus`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName,
       COALESCE(AttributesJSON, N'Chưa có thông số JSON') AS JsonStatus
FROM Fruits
ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName,
       COALESCE(AttributesJSON, 'Chưa có thông số JSON') AS JsonStatus
FROM Fruits
ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 14 dòng × 3 cột):**

| FruitID | FruitName | JsonStatus |
| :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | {"Taste":"Sweet", "SugarLevel": "High", "Color":"Yellow"} |
| 2 | Bưởi Da Xanh | {"Taste":"Sour", "Vitamins":["C", "A"], "Color":"Green"} |
| 3 | Xoài Cát Hòa Lộc | {"Taste":"Sweet", "SugarLevel": "High", "Season":"Summer"} |
| 4 | Măng Cụt Lái Thiêu | {"Taste":"Sweet-Sour", "Color":"Purple"} |
| 5 | Nho Mẫu Đơn Shine Muscat | {"Taste":"Very Sweet", "Vitamins":["C", "K"], "Seedless":true} |
| 6 | Táo Envy | {"Taste":"Crisp Sweet", "Size":"Large", "Color":"Red"} |
| 7 | Cherry Đỏ Thẫm | {"Taste":"Sweet", "Color":"Dark Red"} |
| 8 | Kiwi Vàng | {"Taste":"Sweet-Sour", "Vitamins":["C"], "Seedless":true} |
| 9 | Dâu Tây Mộc Châu | {"Taste":"Sour", "Color":"Red"} |
| 10 | Việt Quất (Blueberry) | {"Taste":"Sweet-Sour", "Antioxidants":"High"} |
| 11 | Mâm Xôi Đen | {"Taste":"Sour", "StockStatus":"Out"} |
| 12 | Nho khô Ninh Thuận | Chưa có thông số JSON |
| 13 | Mít sấy giòn | Chưa có thông số JSON |
| 14 | Hạt Mắc Ca | {"Taste":"Rich", "Fat":"High"} |

#### [FS-CH02-02] Bài 2.2: Hiển thị mã quản lý mặc định là 0 cho Giám đốc (Bảng Employees)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A2 - COALESCE trên bảng Employees)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ..., COALESCE(NullableCol, DefaultVal) AS Alias FROM Table; (Cùng cơ chế Bài 2.1 nhưng trên Employees)`
- **Đề bài**: Áp dụng y hệt hàm `COALESCE` của Bài 2.1 trên bảng `Employees`: Lấy ra `EmployeeID`, `FullName`, `Role` và `COALESCE(ManagerID, 0)` đặt tên là `SafeManagerID`. Sắp xếp theo `EmployeeID` tăng dần.
- **Gợi ý tư duy**: Dùng `COALESCE(ManagerID, 0) AS SafeManagerID`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT EmployeeID, FullName, Role,
       COALESCE(ManagerID, 0) AS SafeManagerID
FROM Employees
ORDER BY EmployeeID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT EmployeeID, FullName, Role,
       COALESCE(ManagerID, 0) AS SafeManagerID
FROM Employees
ORDER BY EmployeeID ASC;
```

**Kết quả kỳ vọng (`expected` — 7 dòng × 4 cột):**

| EmployeeID | FullName | Role | SafeManagerID |
| :--- | :--- | :--- | :--- |
| 1 | Lê Minh Triết | Giám đốc | 0 |
| 2 | Nguyễn Tấn Dũng | Quản lý Kho | 1 |
| 3 | Trần Thị Mai | Quản lý Bán hàng | 1 |
| 4 | Phạm Văn A | Nhân viên Kho | 2 |
| 5 | Lý Bạch | Nhân viên Kho | 2 |
| 6 | Hoàng Cúc | Nhân viên Bán hàng | 3 |
| 7 | Đinh Hợi | Nhân viên Bán hàng | 3 |

#### [FS-CH02-03] Bài 2.3: Hiển thị mã Voucher mặc định là 0 cho đơn không dùng mã (Bảng Orders)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A3 - COALESCE trên bảng Orders)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ..., COALESCE(NullableCol, DefaultVal) AS Alias FROM Table; (Cùng cơ chế Bài 2.1 & 2.2 nhưng trên Orders)`
- **Đề bài**: Tiếp tục phản xạ `COALESCE` trên bảng `Orders`: Lấy ra `OrderID`, `CustomerID`, `TotalAmount` và `COALESCE(VoucherID, 0)` đặt tên là `AppliedVoucherID`, sắp xếp theo `OrderID` tăng dần.
- **Gợi ý tư duy**: Dùng `COALESCE(VoucherID, 0) AS AppliedVoucherID`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT OrderID, CustomerID, TotalAmount,
       COALESCE(VoucherID, 0) AS AppliedVoucherID
FROM Orders
ORDER BY OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT OrderID, CustomerID, TotalAmount,
       COALESCE(VoucherID, 0) AS AppliedVoucherID
FROM Orders
ORDER BY OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 10 dòng × 4 cột):**

| OrderID | CustomerID | TotalAmount | AppliedVoucherID |
| :--- | :--- | :--- | :--- |
| 1 | 1 | 850000 | 0 |
| 2 | 2 | 180000 | 1 |
| 3 | 3 | 150000 | 0 |
| 4 | 4 | 850000 | 2 |
| 5 | 1 | 2500000 | 2 |
| 6 | 5 | 300000 | 1 |
| 7 | 6 | 180000 | 0 |
| 8 | 1 | 200000 | 0 |
| 9 | 4 | 400000 | 1 |
| 10 | 7 | 95000 | 0 |

#### [FS-CH02-04] Bài 2.4: Phân tầng mức giá trái cây (CASE WHEN trên bảng Fruits)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B1 - Phân loại bằng CASE WHEN)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CASE WHEN cond1 THEN val1 WHEN cond2 THEN val2 ELSE val3 END`
- **Đề bài**: Lấy ra `FruitID`, `FruitName`, `Price` và cột `PriceTier` từ bảng `Fruits` với quy tắc: Nếu `Price >= 300000` là `'Cao cấp'`, nếu `Price >= 100000` là `'Tầm trung'`, ngược lại là `'Bình dân'`. Sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Dùng biểu thức `CASE WHEN Price >= 300000 THEN 'Cao cấp' WHEN Price >= 100000 THEN 'Tầm trung' ELSE 'Bình dân' END`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, Price,
       CASE
           WHEN Price >= 300000 THEN N'Cao cấp'
           WHEN Price >= 100000 THEN N'Tầm trung'
           ELSE N'Bình dân'
       END AS PriceTier
FROM Fruits
ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Price,
       CASE
           WHEN Price >= 300000 THEN 'Cao cấp'
           WHEN Price >= 100000 THEN 'Tầm trung'
           ELSE 'Bình dân'
       END AS PriceTier
FROM Fruits
ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 14 dòng × 4 cột):**

| FruitID | FruitName | Price | PriceTier |
| :--- | :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | 150000 | Tầm trung |
| 2 | Bưởi Da Xanh | 70000 | Bình dân |
| 3 | Xoài Cát Hòa Lộc | 80000 | Bình dân |
| 4 | Măng Cụt Lái Thiêu | 95000 | Bình dân |
| 5 | Nho Mẫu Đơn Shine Muscat | 850000 | Cao cấp |
| 6 | Táo Envy | 250000 | Tầm trung |
| 7 | Cherry Đỏ Thẫm | 450000 | Cao cấp |
| 8 | Kiwi Vàng | 180000 | Tầm trung |
| 9 | Dâu Tây Mộc Châu | 200000 | Tầm trung |
| 10 | Việt Quất (Blueberry) | 350000 | Cao cấp |
| 11 | Mâm Xôi Đen | 320000 | Cao cấp |
| 12 | Nho khô Ninh Thuận | 120000 | Tầm trung |
| 13 | Mít sấy giòn | 60000 | Bình dân |
| 14 | Hạt Mắc Ca | 280000 | Tầm trung |

#### [FS-CH02-05] Bài 2.5: Cảnh báo trạng thái tồn kho (CASE WHEN trên StockQuantity)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B2 - CASE WHEN trên bảng khác)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CASE WHEN cond1 THEN val1 WHEN cond2 THEN val2 ELSE val3 END (Cùng cơ chế Bài 2.4 nhưng kiểm tra tồn kho Fruits)`
- **Đề bài**: Áp dụng y hệt cấu trúc `CASE WHEN` cho cột `StockQuantity` của bảng `Fruits`: Lấy ra `FruitID`, `FruitName`, `StockQuantity` và cột `StockAlert`: Nếu `StockQuantity = 0` là `'Hết hàng'`, nếu `StockQuantity < 50` là `'Sắp hết'`, ngược lại là `'Dồi dào'`. Sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Kiểm tra `StockQuantity = 0` trước, sau đó đến `StockQuantity < 50`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, StockQuantity,
       CASE
           WHEN StockQuantity = 0 THEN N'Hết hàng'
           WHEN StockQuantity < 50 THEN N'Sắp hết'
           ELSE N'Dồi dào'
       END AS StockAlert
FROM Fruits
ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, StockQuantity,
       CASE
           WHEN StockQuantity = 0 THEN 'Hết hàng'
           WHEN StockQuantity < 50 THEN 'Sắp hết'
           ELSE 'Dồi dào'
       END AS StockAlert
FROM Fruits
ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 14 dòng × 4 cột):**

| FruitID | FruitName | StockQuantity | StockAlert |
| :--- | :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | 50 | Dồi dào |
| 2 | Bưởi Da Xanh | 120 | Dồi dào |
| 3 | Xoài Cát Hòa Lộc | 200 | Dồi dào |
| 4 | Măng Cụt Lái Thiêu | 80 | Dồi dào |
| 5 | Nho Mẫu Đơn Shine Muscat | 15 | Sắp hết |
| 6 | Táo Envy | 100 | Dồi dào |
| 7 | Cherry Đỏ Thẫm | 30 | Sắp hết |
| 8 | Kiwi Vàng | 60 | Dồi dào |
| 9 | Dâu Tây Mộc Châu | 45 | Sắp hết |
| 10 | Việt Quất (Blueberry) | 20 | Sắp hết |
| 11 | Mâm Xôi Đen | 0 | Hết hàng |
| 12 | Nho khô Ninh Thuận | 300 | Dồi dào |
| 13 | Mít sấy giòn | 150 | Dồi dào |
| 14 | Hạt Mắc Ca | 90 | Dồi dào |

#### [FS-CH02-06] Bài 2.6: Phân loại sắc thái đánh giá của khách hàng (Bảng Reviews)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B3 - CASE WHEN trên bảng Reviews)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CASE WHEN cond1 THEN val1 WHEN cond2 THEN val2 ELSE val3 END (Cùng cơ chế Bài 2.4 & 2.5 nhưng trên bảng Reviews)`
- **Đề bài**: Tiếp tục phản xạ `CASE WHEN` trên bảng `Reviews`: Lấy ra `ReviewID`, `FruitID`, `Rating` và cột `Sentiment`: Nếu `Rating = 5` là `'Tuyệt vời'`, nếu `Rating = 4` là `'Hài lòng'`, ngược lại là `'Cần cải thiện'`. Sắp xếp theo `ReviewID` tăng dần.
- **Gợi ý tư duy**: Dùng `CASE WHEN Rating = 5 ... WHEN Rating = 4 ... ELSE ... END`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT ReviewID, FruitID, Rating,
       CASE
           WHEN Rating = 5 THEN N'Tuyệt vời'
           WHEN Rating = 4 THEN N'Hài lòng'
           ELSE N'Cần cải thiện'
       END AS Sentiment
FROM Reviews
ORDER BY ReviewID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT ReviewID, FruitID, Rating,
       CASE
           WHEN Rating = 5 THEN 'Tuyệt vời'
           WHEN Rating = 4 THEN 'Hài lòng'
           ELSE 'Cần cải thiện'
       END AS Sentiment
FROM Reviews
ORDER BY ReviewID ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 4 cột):**

| ReviewID | FruitID | Rating | Sentiment |
| :--- | :--- | :--- | :--- |
| 1 | 5 | 5 | Tuyệt vời |
| 2 | 3 | 4 | Hài lòng |
| 3 | 6 | 5 | Tuyệt vời |
| 4 | 10 | 3 | Cần cải thiện |

#### [FS-CH02-07] Bài 2.7: Chuẩn hóa thẻ tên khách hàng & độ dài tên (Bảng Customers)

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Xử lý chuỗi UPPER, LENGTH/LEN & Ghép chuỗi)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `UPPER(Col), LENGTH(Col), nối chuỗi tạo nhãn hiển thị`
- **Đề bài**: Lấy ra `CustomerID`, tên khách hàng viết hoa toàn bộ (`UpperName`), độ dài ký tự của tên (`NameLength`), và chuỗi ghép `CustomerTag` có dạng `'[' || CustomerType || '] ' || FullName` từ bảng `Customers`. Sắp xếp theo `CustomerID` tăng dần.
- **Gợi ý tư duy**: Trong T-SQL dùng `UPPER(FullName)`, `LEN(FullName)`, `CONCAT('[', CustomerType, '] ', FullName)`. Trong SQLite dùng `UPPER(FullName)`, `LENGTH(FullName)` và toán tử `||`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT CustomerID,
       UPPER(FullName) AS UpperName,
       LEN(FullName) AS NameLength,
       CONCAT(N'[', CustomerType, N'] ', FullName) AS CustomerTag
FROM Customers
ORDER BY CustomerID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT CustomerID,
       UPPER(FullName) AS UpperName,
       LENGTH(FullName) AS NameLength,
       '[' || CustomerType || '] ' || FullName AS CustomerTag
FROM Customers
ORDER BY CustomerID ASC;
```

**Kết quả kỳ vọng (`expected` — 8 dòng × 4 cột):**

| CustomerID | UpperName | NameLength | CustomerTag |
| :--- | :--- | :--- | :--- |
| 1 | Võ THàNH TàI | 12 | [VIP] Võ Thành Tài |
| 2 | NGUYễN THị Lệ | 13 | [Standard] Nguyễn Thị Lệ |
| 3 | TRươNG Vô Kỵ | 12 | [Standard] Trương Vô Kỵ |
| 4 | TRIệU MẫN | 9 | [VIP] Triệu Mẫn |
| 5 | CHU CHỉ NHượC | 13 | [Standard] Chu Chỉ Nhược |
| 6 | ÂN LY | 5 | [Standard] Ân Ly |
| 7 | TIểU CHIêU | 10 | [Standard] Tiểu Chiêu |
| 8 | DươNG QUá | 9 | [Standard] Dương Quá |

#### [FS-CH02-08] Bài 2.8: Tách năm và tháng đặt hàng của các đơn hàng năm 2024 (Bảng Orders)

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Trích xuất Năm và Tháng từ cột ngày tháng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `YEAR(DateCol) / CAST(strftime('%Y', DateCol) AS INT)`
- **Đề bài**: Từ bảng `Orders`, hãy lấy ra `OrderID`, `CustomerID`, năm đặt hàng (`OrderYear`), tháng đặt hàng (`OrderMonth`) và `TotalAmount` của các đơn hàng phát sinh trong năm `2024`. Sắp xếp theo `OrderID` tăng dần.
- **Gợi ý tư duy**: Trong T-SQL dùng `YEAR(OrderDate)` và `MONTH(OrderDate)`. Trong SQLite dùng `CAST(strftime('%Y', OrderDate) AS INT)` và `CAST(strftime('%m', OrderDate) AS INT)`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT OrderID, CustomerID,
       YEAR(OrderDate) AS OrderYear,
       MONTH(OrderDate) AS OrderMonth,
       TotalAmount
FROM Orders
WHERE YEAR(OrderDate) = 2024
ORDER BY OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT OrderID, CustomerID,
       CAST(strftime('%Y', OrderDate) AS INT) AS OrderYear,
       CAST(strftime('%m', OrderDate) AS INT) AS OrderMonth,
       TotalAmount
FROM Orders
WHERE CAST(strftime('%Y', OrderDate) AS INT) = 2024
ORDER BY OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 5 cột):**

| OrderID | CustomerID | OrderYear | OrderMonth | TotalAmount |
| :--- | :--- | :--- | :--- | :--- |
| 6 | 5 | 2024 | 1 | 300000 |
| 7 | 6 | 2024 | 2 | 180000 |
| 8 | 1 | 2024 | 3 | 200000 |
| 9 | 4 | 2024 | 3 | 400000 |
| 10 | 7 | 2024 | 3 | 95000 |

#### [FS-CH02-09] Bài 2.9: Tính phần trăm lượt sử dụng và số lượt còn lại của từng Voucher

- **Cấp độ & Nhóm phản xạ**: `Nâng cao (Tính toán tỷ lệ % & ROUND)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `ROUND(CAST(UsedCount AS FLOAT) * 100.0 / UsageLimit, 2)`
- **Đề bài**: Từ bảng `Vouchers`, lấy ra `VoucherID`, `VoucherCode`, số lượt còn lại (`RemainingUses = UsageLimit - UsedCount`), và tỷ lệ phần trăm đã dùng (`UsedPercentage = ROUND(UsedCount * 100.0 / UsageLimit, 2)`). Sắp xếp theo `UsedPercentage` giảm dần.
- **Gợi ý tư duy**: Nhân với `100.0` để ép kiểu số thực trước khi chia cho `UsageLimit`, sau đó bọc trong `ROUND(..., 2)`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT VoucherID, VoucherCode,
       (UsageLimit - UsedCount) AS RemainingUses,
       ROUND(CAST(UsedCount AS FLOAT) * 100.0 / UsageLimit, 2) AS UsedPercentage
FROM Vouchers
ORDER BY UsedPercentage DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT VoucherID, VoucherCode,
       (UsageLimit - UsedCount) AS RemainingUses,
       ROUND(UsedCount * 100.0 / UsageLimit, 2) AS UsedPercentage
FROM Vouchers
ORDER BY UsedPercentage DESC;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 4 cột):**

| VoucherID | VoucherCode | RemainingUses | UsedPercentage |
| :--- | :--- | :--- | :--- |
| 3 | HETHAN | 0 | 100.0 |
| 1 | WELCOME50 | 750 | 25.0 |
| 2 | VIP100 | 95 | 5.0 |

#### [FS-CH02-10] Bài 2.10: Bảng giá xả kho cuối tuần theo từng danh mục (Bảng Fruits)

- **Cấp độ & Nhóm phản xạ**: `Thực chiến (Kết hợp CASE WHEN + Biểu thức tính giá khuyến mãi)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Tính giá sau giảm theo danh mục bằng CASE WHEN`
- **Đề bài**: Cửa hàng chạy chương trình giảm giá tự động: Danh mục `2` (Trái cây Nhập khẩu) giảm 10% (`Price * 90 / 100`), Danh mục `3` (Quả mọng) giảm 5% (`Price * 95 / 100`), các danh mục khác giữ nguyên giá (`Price`). Hãy lấy ra `FruitID`, `FruitName`, `CategoryID`, `Price` (giá gốc) và `PromoPrice` (giá sau giảm, kiểu số nguyên) cho các trái cây đang còn hàng (`StockQuantity > 0`), sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Dùng `CASE WHEN CategoryID = 2 THEN Price * 90 / 100 WHEN CategoryID = 3 THEN Price * 95 / 100 ELSE Price END AS PromoPrice`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, CategoryID, Price,
       CASE
           WHEN CategoryID = 2 THEN Price * 90 / 100
           WHEN CategoryID = 3 THEN Price * 95 / 100
           ELSE Price
       END AS PromoPrice
FROM Fruits
WHERE StockQuantity > 0
ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, CategoryID, Price,
       CASE
           WHEN CategoryID = 2 THEN Price * 90 / 100
           WHEN CategoryID = 3 THEN Price * 95 / 100
           ELSE Price
       END AS PromoPrice
FROM Fruits
WHERE StockQuantity > 0
ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 13 dòng × 5 cột):**

| FruitID | FruitName | CategoryID | Price | PromoPrice |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | 1 | 150000 | 150000 |
| 2 | Bưởi Da Xanh | 1 | 70000 | 70000 |
| 3 | Xoài Cát Hòa Lộc | 1 | 80000 | 80000 |
| 4 | Măng Cụt Lái Thiêu | 1 | 95000 | 95000 |
| 5 | Nho Mẫu Đơn Shine Muscat | 2 | 850000 | 765000 |
| 6 | Táo Envy | 2 | 250000 | 225000 |
| 7 | Cherry Đỏ Thẫm | 2 | 450000 | 405000 |
| 8 | Kiwi Vàng | 2 | 180000 | 162000 |
| 9 | Dâu Tây Mộc Châu | 3 | 200000 | 190000 |
| 10 | Việt Quất (Blueberry) | 3 | 350000 | 332500 |
| 12 | Nho khô Ninh Thuận | 4 | 120000 | 120000 |
| 13 | Mít sấy giòn | 4 | 60000 | 60000 |
| 14 | Hạt Mắc Ca | 5 | 280000 | 280000 |

### Chương 3: Các Phép Kết Nối Bảng (JOINs) & Toán Tử Tập Hợp (Set Operators)

- **Mục tiêu phản xạ của chương**: Rèn phản xạ nối 2 bảng (INNER JOIN), tìm phần tử mồ côi/chưa phát sinh giao dịch (LEFT JOIN ... WHERE IS NULL), tự nối (Self-Join) và hợp/trừ tập hợp (UNION, INTERSECT, EXCEPT) trên toàn bộ 9 bảng.

#### [FS-CH03-01] Bài 3.1: Ghép tên danh mục cho từng loại trái cây (Fruits JOIN Categories)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A1 - INNER JOIN 2 bảng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM Child c INNER JOIN Parent p ON c.FK = p.PK;`
- **Đề bài**: Hãy lấy ra `FruitID`, `FruitName`, `CategoryName` và `Price` bằng cách kết nối bảng `Fruits` với bảng `Categories`. Sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Dùng `INNER JOIN Categories c ON f.CategoryID = c.CategoryID`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT f.FruitID, f.FruitName, c.CategoryName, f.Price
FROM Fruits f
INNER JOIN Categories c ON f.CategoryID = c.CategoryID
ORDER BY f.FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT f.FruitID, f.FruitName, c.CategoryName, f.Price
FROM Fruits f
INNER JOIN Categories c ON f.CategoryID = c.CategoryID
ORDER BY f.FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 14 dòng × 4 cột):**

| FruitID | FruitName | CategoryName | Price |
| :--- | :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | Đặc sản Miền Tây | 150000 |
| 2 | Bưởi Da Xanh | Đặc sản Miền Tây | 70000 |
| 3 | Xoài Cát Hòa Lộc | Đặc sản Miền Tây | 80000 |
| 4 | Măng Cụt Lái Thiêu | Đặc sản Miền Tây | 95000 |
| 5 | Nho Mẫu Đơn Shine Muscat | Trái cây Nhập khẩu | 850000 |
| 6 | Táo Envy | Trái cây Nhập khẩu | 250000 |
| 7 | Cherry Đỏ Thẫm | Trái cây Nhập khẩu | 450000 |
| 8 | Kiwi Vàng | Trái cây Nhập khẩu | 180000 |
| 9 | Dâu Tây Mộc Châu | Quả mọng (Berries) | 200000 |
| 10 | Việt Quất (Blueberry) | Quả mọng (Berries) | 350000 |
| 11 | Mâm Xôi Đen | Quả mọng (Berries) | 320000 |
| 12 | Nho khô Ninh Thuận | Trái cây sấy | 120000 |
| 13 | Mít sấy giòn | Trái cây sấy | 60000 |
| 14 | Hạt Mắc Ca | Quả hạch (Nuts) | 280000 |

#### [FS-CH03-02] Bài 3.2: Ghép tên khách hàng cho từng đơn hàng (Orders JOIN Customers)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A2 - INNER JOIN 2 bảng khác)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM Child c INNER JOIN Parent p ON c.FK = p.PK; (Cùng cơ chế Bài 3.1 nhưng trên Orders & Customers)`
- **Đề bài**: Áp dụng y hệt cơ chế `INNER JOIN` của Bài 3.1 nhưng giữa bảng `Orders` và `Customers`: Lấy ra `OrderID`, `FullName` (tên khách hàng), `OrderDate`, `TotalAmount` và `Status`. Sắp xếp theo `OrderID` tăng dần.
- **Gợi ý tư duy**: Nối `Orders o INNER JOIN Customers c ON o.CustomerID = c.CustomerID`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT o.OrderID, c.FullName, o.OrderDate, o.TotalAmount, o.Status
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
ORDER BY o.OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT o.OrderID, c.FullName, o.OrderDate, o.TotalAmount, o.Status
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
ORDER BY o.OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 10 dòng × 5 cột):**

| OrderID | FullName | OrderDate | TotalAmount | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Võ Thành Tài | 2023-02-14 10:15:00 | 850000 | Đã giao |
| 2 | Nguyễn Thị Lệ | 2023-04-20 14:30:00 | 180000 | Đã giao |
| 3 | Trương Vô Kỵ | 2023-06-15 09:00:00 | 150000 | Đã giao |
| 4 | Triệu Mẫn | 2023-08-08 16:45:00 | 850000 | Đã giao |
| 5 | Võ Thành Tài | 2023-12-24 19:00:00 | 2500000 | Đã giao |
| 6 | Chu Chỉ Nhược | 2024-01-10 08:30:00 | 300000 | Đã giao |
| 7 | Ân Ly | 2024-02-14 11:20:00 | 180000 | Đã hủy |
| 8 | Võ Thành Tài | 2024-03-01 15:10:00 | 200000 | Đang giao |
| 9 | Triệu Mẫn | 2024-03-05 10:00:00 | 400000 | Chờ xử lý |
| 10 | Tiểu Chiêu | 2024-03-10 14:00:00 | 95000 | Chờ xử lý |

#### [FS-CH03-03] Bài 3.3: Xem giao dịch thanh toán kèm trạng thái đơn hàng (PaymentTransactions JOIN Orders)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A3 - INNER JOIN 2 bảng khác)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM Child c INNER JOIN Parent p ON c.FK = p.PK; (Cùng cơ chế Bài 3.1 & 3.2 nhưng trên PaymentTransactions & Orders)`
- **Đề bài**: Tiếp tục phản xạ `INNER JOIN` giữa `PaymentTransactions` và `Orders`: Lấy ra `TransactionID`, `OrderID`, `PaymentMethod`, `Amount` (tiền thanh toán), `TotalAmount` (tổng tiền đơn) và `Status` (trạng thái đơn). Sắp xếp theo `TransactionID` tăng dần.
- **Gợi ý tư duy**: Nối `PaymentTransactions pt INNER JOIN Orders o ON pt.OrderID = o.OrderID`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT pt.TransactionID, pt.OrderID, pt.PaymentMethod, pt.Amount, o.TotalAmount, o.Status
FROM PaymentTransactions pt
INNER JOIN Orders o ON pt.OrderID = o.OrderID
ORDER BY pt.TransactionID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT pt.TransactionID, pt.OrderID, pt.PaymentMethod, pt.Amount, o.TotalAmount, o.Status
FROM PaymentTransactions pt
INNER JOIN Orders o ON pt.OrderID = o.OrderID
ORDER BY pt.TransactionID ASC;
```

**Kết quả kỳ vọng (`expected` — 6 dòng × 6 cột):**

| TransactionID | OrderID | PaymentMethod | Amount | TotalAmount | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | VNPAY | 850000 | 850000 | Đã giao |
| 2 | 2 | Tiền mặt | 200000 | 180000 | Đã giao |
| 3 | 3 | Momo | 150000 | 150000 | Đã giao |
| 4 | 4 | VNPAY | 850000 | 850000 | Đã giao |
| 5 | 5 | VNPAY | 2500000 | 2500000 | Đã giao |
| 6 | 6 | Momo | 300000 | 300000 | Đã giao |

#### [FS-CH03-04] Bài 3.4: Tìm khách hàng chưa từng đặt đơn hàng nào (Customers LEFT JOIN Orders)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B1 - LEFT Anti-Join tìm bản ghi chưa có giao dịch)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT p.* FROM Parent p LEFT JOIN Child c ON p.PK = c.FK WHERE c.FK IS NULL;`
- **Đề bài**: Sử dụng kỹ thuật `LEFT JOIN ... WHERE IS NULL`, hãy tìm các khách hàng (`CustomerID`, `FullName`, `PhoneNumber`, `RegisterDate`) chưa từng có bất kỳ đơn hàng nào trong bảng `Orders`. Sắp xếp theo `CustomerID` tăng dần.
- **Gợi ý tư duy**: Dùng `Customers c LEFT JOIN Orders o ON c.CustomerID = o.CustomerID WHERE o.OrderID IS NULL`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT c.CustomerID, c.FullName, c.PhoneNumber, c.RegisterDate
FROM Customers c
LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
WHERE o.OrderID IS NULL
ORDER BY c.CustomerID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT c.CustomerID, c.FullName, c.PhoneNumber, c.RegisterDate
FROM Customers c
LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
WHERE o.OrderID IS NULL
ORDER BY c.CustomerID ASC;
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 4 cột):**

| CustomerID | FullName | PhoneNumber | RegisterDate |
| :--- | :--- | :--- | :--- |
| 8 | Dương Quá | 0908888999 | 2024-03-10 |

#### [FS-CH03-05] Bài 3.5: Tìm các loại trái cây chưa từng xuất hiện trong bất kỳ đơn hàng nào

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B2 - LEFT Anti-Join trên bảng Fruits & OrderDetails)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT p.* FROM Parent p LEFT JOIN Child c ON p.PK = c.FK WHERE c.FK IS NULL; (Cùng cơ chế Bài 3.4 nhưng tìm Trái cây chưa ai mua)`
- **Đề bài**: Áp dụng y hệt kỹ thuật `LEFT JOIN ... WHERE IS NULL` của Bài 3.4 nhưng giữa `Fruits` và `OrderDetails`: Lấy ra `FruitID`, `FruitName`, `Price`, `StockQuantity` của những loại trái cây chưa từng được đặt mua lần nào. Sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Dùng `Fruits f LEFT JOIN OrderDetails od ON f.FruitID = od.FruitID WHERE od.OrderDetailID IS NULL`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT f.FruitID, f.FruitName, f.Price, f.StockQuantity
FROM Fruits f
LEFT JOIN OrderDetails od ON f.FruitID = od.FruitID
WHERE od.OrderDetailID IS NULL
ORDER BY f.FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT f.FruitID, f.FruitName, f.Price, f.StockQuantity
FROM Fruits f
LEFT JOIN OrderDetails od ON f.FruitID = od.FruitID
WHERE od.OrderDetailID IS NULL
ORDER BY f.FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 4 cột):**

| FruitID | FruitName | Price | StockQuantity |
| :--- | :--- | :--- | :--- |
| 11 | Mâm Xôi Đen | 320000 | 0 |
| 12 | Nho khô Ninh Thuận | 120000 | 300 |
| 13 | Mít sấy giòn | 60000 | 150 |
| 14 | Hạt Mắc Ca | 280000 | 90 |

#### [FS-CH03-06] Bài 3.6: Tìm mã Voucher chưa từng được áp dụng vào đơn hàng nào trong bảng Orders

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B3 - LEFT Anti-Join trên bảng Vouchers & Orders)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT p.* FROM Parent p LEFT JOIN Child c ON p.PK = c.FK WHERE c.FK IS NULL; (Cùng cơ chế Bài 3.4 & 3.5 nhưng tìm Voucher chưa đơn nào dùng)`
- **Đề bài**: Tiếp tục phản xạ `LEFT JOIN ... WHERE IS NULL` giữa `Vouchers` và `Orders`: Lấy ra `VoucherID`, `VoucherCode`, `DiscountAmount`, `ExpiryDate` của mã giảm giá không xuất hiện trong bất kỳ đơn hàng nào của bảng `Orders`.
- **Gợi ý tư duy**: Dùng `Vouchers v LEFT JOIN Orders o ON v.VoucherID = o.VoucherID WHERE o.OrderID IS NULL`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT v.VoucherID, v.VoucherCode, v.DiscountAmount, v.ExpiryDate
FROM Vouchers v
LEFT JOIN Orders o ON v.VoucherID = o.VoucherID
WHERE o.OrderID IS NULL
ORDER BY v.VoucherID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT v.VoucherID, v.VoucherCode, v.DiscountAmount, v.ExpiryDate
FROM Vouchers v
LEFT JOIN Orders o ON v.VoucherID = o.VoucherID
WHERE o.OrderID IS NULL
ORDER BY v.VoucherID ASC;
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 4 cột):**

| VoucherID | VoucherCode | DiscountAmount | ExpiryDate |
| :--- | :--- | :--- | :--- |
| 3 | HETHAN | 30000 | 2023-12-31 |

#### [FS-CH03-07] Bài 3.7: Hiển thị danh sách nhân viên kèm họ tên người quản lý trực tiếp (Self-Join)

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Self-Join bảng tự tham chiếu Employees)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT e.FullName, m.FullName FROM Employees e LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID;`
- **Đề bài**: Bảng `Employees` có cột `ManagerID` tự tham chiếu về chính `EmployeeID`. Hãy dùng `LEFT JOIN` để lấy ra `EmployeeID`, tên nhân viên (`EmployeeName`), chức vụ (`Role`) và tên người quản lý trực tiếp (`ManagerName`, nếu không có quản lý thì hiển thị `'Cấp cao nhất'`). Sắp xếp theo `EmployeeID` tăng dần.
- **Gợi ý tư duy**: Nối `Employees e LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID` và dùng `COALESCE(m.FullName, 'Cấp cao nhất')`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT e.EmployeeID,
       e.FullName AS EmployeeName,
       e.Role,
       COALESCE(m.FullName, N'Cấp cao nhất') AS ManagerName
FROM Employees e
LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID
ORDER BY e.EmployeeID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT e.EmployeeID,
       e.FullName AS EmployeeName,
       e.Role,
       COALESCE(m.FullName, 'Cấp cao nhất') AS ManagerName
FROM Employees e
LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID
ORDER BY e.EmployeeID ASC;
```

**Kết quả kỳ vọng (`expected` — 7 dòng × 4 cột):**

| EmployeeID | EmployeeName | Role | ManagerName |
| :--- | :--- | :--- | :--- |
| 1 | Lê Minh Triết | Giám đốc | Cấp cao nhất |
| 2 | Nguyễn Tấn Dũng | Quản lý Kho | Lê Minh Triết |
| 3 | Trần Thị Mai | Quản lý Bán hàng | Lê Minh Triết |
| 4 | Phạm Văn A | Nhân viên Kho | Nguyễn Tấn Dũng |
| 5 | Lý Bạch | Nhân viên Kho | Nguyễn Tấn Dũng |
| 6 | Hoàng Cúc | Nhân viên Bán hàng | Trần Thị Mai |
| 7 | Đinh Hợi | Nhân viên Bán hàng | Trần Thị Mai |

#### [FS-CH03-08] Bài 3.8: Chi tiết hóa đơn toàn diện (Kết nối 4 bảng: OrderDetails, Orders, Customers, Fruits)

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Multi-table JOIN 4 bảng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Orders -> Customers -> Employees -> OrderDetails -> Fruits`
- **Đề bài**: Hãy kết nối 4 bảng (`OrderDetails`, `Orders`, `Customers`, `Fruits`) để in ra dòng chi tiết hóa đơn gồm: `OrderDetailID`, `OrderID`, tên khách hàng (`CustomerName`), tên trái cây (`FruitName`), `Quantity`, `UnitPrice`, `SubTotal`. Sắp xếp theo `OrderDetailID` tăng dần.
- **Gợi ý tư duy**: Bắt đầu từ `OrderDetails od`, nối lần lượt sang `Orders o`, `Customers c`, và `Fruits f`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT od.OrderDetailID, o.OrderID,
       c.FullName AS CustomerName,
       f.FruitName,
       od.Quantity, od.UnitPrice, od.SubTotal
FROM OrderDetails od
INNER JOIN Orders o ON od.OrderID = o.OrderID
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
INNER JOIN Fruits f ON od.FruitID = f.FruitID
ORDER BY od.OrderDetailID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT od.OrderDetailID, o.OrderID,
       c.FullName AS CustomerName,
       f.FruitName,
       od.Quantity, od.UnitPrice, od.SubTotal
FROM OrderDetails od
INNER JOIN Orders o ON od.OrderID = o.OrderID
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
INNER JOIN Fruits f ON od.FruitID = f.FruitID
ORDER BY od.OrderDetailID ASC;
```

**Kết quả kỳ vọng (`expected` — 13 dòng × 7 cột):**

| OrderDetailID | OrderID | CustomerName | FruitName | Quantity | UnitPrice | SubTotal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | Võ Thành Tài | Nho Mẫu Đơn Shine Muscat | 1 | 850000 | 850000 |
| 2 | 2 | Nguyễn Thị Lệ | Xoài Cát Hòa Lộc | 2 | 80000 | 160000 |
| 3 | 2 | Nguyễn Thị Lệ | Bưởi Da Xanh | 1 | 70000 | 70000 |
| 4 | 3 | Trương Vô Kỵ | Sầu Riêng Ri6 | 1 | 150000 | 150000 |
| 5 | 4 | Triệu Mẫn | Táo Envy | 2 | 250000 | 500000 |
| 6 | 4 | Triệu Mẫn | Cherry Đỏ Thẫm | 1 | 450000 | 450000 |
| 7 | 5 | Võ Thành Tài | Nho Mẫu Đơn Shine Muscat | 2 | 850000 | 1700000 |
| 8 | 5 | Võ Thành Tài | Cherry Đỏ Thẫm | 2 | 450000 | 900000 |
| 9 | 6 | Chu Chỉ Nhược | Việt Quất (Blueberry) | 1 | 350000 | 350000 |
| 10 | 7 | Ân Ly | Kiwi Vàng | 1 | 180000 | 180000 |
| 11 | 8 | Võ Thành Tài | Dâu Tây Mộc Châu | 1 | 200000 | 200000 |
| 12 | 9 | Triệu Mẫn | Cherry Đỏ Thẫm | 1 | 450000 | 450000 |
| 13 | 10 | Tiểu Chiêu | Măng Cụt Lái Thiêu | 1 | 95000 | 95000 |

#### [FS-CH03-09] Bài 3.9: Tìm các loại trái cây đã từng được mua nhưng chưa có bất kỳ đánh giá (Review) nào

- **Cấp độ & Nhóm phản xạ**: `Nâng cao (Toán tử tập hợp INTERSECT & EXCEPT)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT FruitID FROM OrderDetails EXCEPT SELECT FruitID FROM Reviews`
- **Đề bài**: Sử dụng toán tử tập hợp `EXCEPT` (hoặc kết hợp CTE/Subquery với bảng `Fruits`), hãy lấy ra `FruitID` và `FruitName` của các loại trái cây đã xuất hiện trong `OrderDetails` nhưng chưa từng xuất hiện trong bảng `Reviews`. Sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Dùng `SELECT FruitID FROM OrderDetails EXCEPT SELECT FruitID FROM Reviews` rồi lấy thông tin từ `Fruits`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName
FROM Fruits
WHERE FruitID IN (
    SELECT FruitID FROM OrderDetails
    EXCEPT
    SELECT FruitID FROM Reviews
)
ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName
FROM Fruits
WHERE FruitID IN (
    SELECT FruitID FROM OrderDetails
    EXCEPT
    SELECT FruitID FROM Reviews
)
ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 6 dòng × 2 cột):**

| FruitID | FruitName |
| :--- | :--- |
| 1 | Sầu Riêng Ri6 |
| 2 | Bưởi Da Xanh |
| 4 | Măng Cụt Lái Thiêu |
| 7 | Cherry Đỏ Thẫm |
| 8 | Kiwi Vàng |
| 9 | Dâu Tây Mộc Châu |

#### [FS-CH03-10] Bài 3.10: Liệt kê TẤT CẢ khách hàng kèm mã đơn hàng 'Đã giao' (Bẫy ON vs WHERE trong LEFT JOIN)

- **Cấp độ & Nhóm phản xạ**: `Thực chiến (Bẫy điều kiện lọc ở ON vs WHERE trong LEFT JOIN)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `LEFT JOIN Orders o ON c.CustomerID = o.CustomerID AND o.Status = 'Đã giao'`
- **Đề bài**: Hãy liệt kê tất cả 8 khách hàng (`CustomerID`, `FullName`) từ bảng `Customers` cùng với `OrderID` và `TotalAmount` của những đơn hàng có trạng thái `'Đã giao'`. Nếu khách hàng chưa có đơn `'Đã giao'` nào, vẫn phải hiển thị tên khách hàng đó với `OrderID` và `TotalAmount` là `NULL`. Sắp xếp theo `CustomerID` tăng dần, `OrderID` tăng dần.
- **Gợi ý tư duy**: Đặt điều kiện `AND o.Status = 'Đã giao'` ngay trong mệnh đề `ON` của `LEFT JOIN` (nếu đặt ở `WHERE` sẽ làm mất các khách chưa có đơn Đã giao!).

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT c.CustomerID, c.FullName, o.OrderID, o.TotalAmount
FROM Customers c
LEFT JOIN Orders o ON c.CustomerID = o.CustomerID AND o.Status = N'Đã giao'
ORDER BY c.CustomerID ASC, o.OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT c.CustomerID, c.FullName, o.OrderID, o.TotalAmount
FROM Customers c
LEFT JOIN Orders o ON c.CustomerID = o.CustomerID AND o.Status = 'Đã giao'
ORDER BY c.CustomerID ASC, o.OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 9 dòng × 4 cột):**

| CustomerID | FullName | OrderID | TotalAmount |
| :--- | :--- | :--- | :--- |
| 1 | Võ Thành Tài | 1 | 850000 |
| 1 | Võ Thành Tài | 5 | 2500000 |
| 2 | Nguyễn Thị Lệ | 2 | 180000 |
| 3 | Trương Vô Kỵ | 3 | 150000 |
| 4 | Triệu Mẫn | 4 | 850000 |
| 5 | Chu Chỉ Nhược | 6 | 300000 |
| 6 | Ân Ly | `NULL` | `NULL` |
| 7 | Tiểu Chiêu | `NULL` | `NULL` |
| 8 | Dương Quá | `NULL` | `NULL` |

### Chương 4: Gom Nhóm (GROUP BY), Lọc Nhóm (HAVING) & Truy Vấn Con (Subqueries)

- **Mục tiêu phản xạ của chương**: Rèn phản xạ thống kê COUNT/SUM/AVG/MIN/MAX theo nhóm, phân biệt COUNT(*) vs COUNT(col), lọc sau gom nhóm bằng HAVING, và viết Subquery (Scalar, IN, EXISTS, NOT EXISTS).

#### [FS-CH04-01] Bài 4.1: Thống kê số lượng trái cây và tổng tồn kho theo từng mã danh mục (Bảng Fruits)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A1 - GROUP BY & COUNT/AVG)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT GroupCol, COUNT(*) AS Cnt, SUM(...) FROM Table GROUP BY GroupCol;`
- **Đề bài**: Gom nhóm bảng `Fruits` theo `CategoryID` để tính: số lượng mặt hàng (`FruitCount`), tổng số lượng tồn kho (`TotalStock`), và giá bán trung bình làm tròn nguyên (`AvgPrice = ROUND(AVG(Price), 0)`). Sắp xếp theo `CategoryID` tăng dần.
- **Gợi ý tư duy**: Dùng `GROUP BY CategoryID` với `COUNT(*)`, `SUM(StockQuantity)`, `ROUND(AVG(Price), 0)`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT CategoryID,
       COUNT(*) AS FruitCount,
       SUM(StockQuantity) AS TotalStock,
       ROUND(AVG(CAST(Price AS FLOAT)), 0) AS AvgPrice
FROM Fruits
GROUP BY CategoryID
ORDER BY CategoryID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT CategoryID,
       COUNT(*) AS FruitCount,
       SUM(StockQuantity) AS TotalStock,
       ROUND(AVG(Price), 0) AS AvgPrice
FROM Fruits
GROUP BY CategoryID
ORDER BY CategoryID ASC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 4 cột):**

| CategoryID | FruitCount | TotalStock | AvgPrice |
| :--- | :--- | :--- | :--- |
| 1 | 4 | 450 | 98750.0 |
| 2 | 4 | 205 | 432500.0 |
| 3 | 3 | 65 | 290000.0 |
| 4 | 2 | 450 | 90000.0 |
| 5 | 1 | 90 | 280000.0 |

#### [FS-CH04-02] Bài 4.2: Thống kê số lượng đơn hàng và tổng doanh thu theo từng trạng thái (Bảng Orders)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A2 - GROUP BY trên bảng Orders)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT GroupCol, COUNT(*) AS Cnt, SUM(...) FROM Table GROUP BY GroupCol; (Cùng cơ chế Bài 4.1 nhưng trên Orders)`
- **Đề bài**: Áp dụng y hệt mẫu `GROUP BY` của Bài 4.1 nhưng trên bảng `Orders`: Gom nhóm theo trạng thái đơn (`Status`) để tính tổng số đơn (`OrderCount`) và tổng tiền (`SumTotal = SUM(TotalAmount)`). Sắp xếp theo `OrderCount` giảm dần, `Status` tăng dần.
- **Gợi ý tư duy**: Dùng `GROUP BY Status` trên bảng `Orders`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT Status,
       COUNT(*) AS OrderCount,
       SUM(TotalAmount) AS SumTotal
FROM Orders
GROUP BY Status
ORDER BY OrderCount DESC, Status ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT Status,
       COUNT(*) AS OrderCount,
       SUM(TotalAmount) AS SumTotal
FROM Orders
GROUP BY Status
ORDER BY OrderCount DESC, Status ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 3 cột):**

| Status | OrderCount | SumTotal |
| :--- | :--- | :--- |
| Đã giao | 6 | 4830000 |
| Chờ xử lý | 2 | 495000 |
| Đang giao | 1 | 200000 |
| Đã hủy | 1 | 180000 |

#### [FS-CH04-03] Bài 4.3: Thống kê số giao dịch và tổng tiền thu được theo phương thức thanh toán

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A3 - GROUP BY trên bảng PaymentTransactions)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT GroupCol, COUNT(*) AS Cnt, SUM(...) FROM Table GROUP BY GroupCol; (Cùng cơ chế Bài 4.1 & 4.2 nhưng trên PaymentTransactions)`
- **Đề bài**: Tiếp tục phản xạ `GROUP BY` trên bảng `PaymentTransactions`: Gom nhóm theo `PaymentMethod` để đếm số lượng giao dịch (`TxCount`) và tổng số tiền thanh toán (`TotalPaid = SUM(Amount)`). Sắp xếp theo `TotalPaid` giảm dần.
- **Gợi ý tư duy**: Dùng `GROUP BY PaymentMethod` và sắp xếp `ORDER BY TotalPaid DESC`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT PaymentMethod,
       COUNT(*) AS TxCount,
       SUM(Amount) AS TotalPaid
FROM PaymentTransactions
GROUP BY PaymentMethod
ORDER BY TotalPaid DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT PaymentMethod,
       COUNT(*) AS TxCount,
       SUM(Amount) AS TotalPaid
FROM PaymentTransactions
GROUP BY PaymentMethod
ORDER BY TotalPaid DESC;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 3 cột):**

| PaymentMethod | TxCount | TotalPaid |
| :--- | :--- | :--- |
| VNPAY | 3 | 4200000 |
| Momo | 2 | 450000 |
| Tiền mặt | 1 | 200000 |

#### [FS-CH04-04] Bài 4.4: Tìm các danh mục có từ 3 loại trái cây trở lên (GROUP BY + HAVING)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B1 - Lọc nhóm bằng HAVING)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM ... GROUP BY ... HAVING AggregateFunc(...) >= Value;`
- **Đề bài**: Kết nối `Categories` và `Fruits`, gom nhóm theo `CategoryID`, `CategoryName` và dùng `HAVING` để chỉ giữ lại các danh mục có số lượng trái cây `COUNT(f.FruitID) >= 3`. Sắp xếp theo `CategoryID` tăng dần.
- **Gợi ý tư duy**: Dùng `GROUP BY c.CategoryID, c.CategoryName HAVING COUNT(f.FruitID) >= 3`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT c.CategoryID, c.CategoryName, COUNT(f.FruitID) AS FruitCount
FROM Categories c
INNER JOIN Fruits f ON c.CategoryID = f.CategoryID
GROUP BY c.CategoryID, c.CategoryName
HAVING COUNT(f.FruitID) >= 3
ORDER BY c.CategoryID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT c.CategoryID, c.CategoryName, COUNT(f.FruitID) AS FruitCount
FROM Categories c
INNER JOIN Fruits f ON c.CategoryID = f.CategoryID
GROUP BY c.CategoryID, c.CategoryName
HAVING COUNT(f.FruitID) >= 3
ORDER BY c.CategoryID ASC;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 3 cột):**

| CategoryID | CategoryName | FruitCount |
| :--- | :--- | :--- |
| 1 | Đặc sản Miền Tây | 4 |
| 2 | Trái cây Nhập khẩu | 4 |
| 3 | Quả mọng (Berries) | 3 |

#### [FS-CH04-05] Bài 4.5: Tìm các khách hàng đã đặt từ 2 đơn hàng trở lên

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B2 - GROUP BY + HAVING trên Customers & Orders)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM ... GROUP BY ... HAVING AggregateFunc(...) >= Value; (Cùng cơ chế Bài 4.4 nhưng tìm Khách mua >= 2 đơn)`
- **Đề bài**: Áp dụng y hệt mẫu `GROUP BY ... HAVING` của Bài 4.4 nhưng giữa `Customers` và `Orders`: Lấy ra `CustomerID`, `FullName`, số lượng đơn hàng (`OrderCount`) và tổng chi tiêu (`TotalSpent`) của những khách hàng có từ `2` đơn hàng trở lên. Sắp xếp theo `TotalSpent` giảm dần.
- **Gợi ý tư duy**: Dùng `HAVING COUNT(o.OrderID) >= 2`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT c.CustomerID, c.FullName,
       COUNT(o.OrderID) AS OrderCount,
       SUM(o.TotalAmount) AS TotalSpent
FROM Customers c
INNER JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.FullName
HAVING COUNT(o.OrderID) >= 2
ORDER BY TotalSpent DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT c.CustomerID, c.FullName,
       COUNT(o.OrderID) AS OrderCount,
       SUM(o.TotalAmount) AS TotalSpent
FROM Customers c
INNER JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.FullName
HAVING COUNT(o.OrderID) >= 2
ORDER BY TotalSpent DESC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 4 cột):**

| CustomerID | FullName | OrderCount | TotalSpent |
| :--- | :--- | :--- | :--- |
| 1 | Võ Thành Tài | 3 | 3550000 |
| 4 | Triệu Mẫn | 2 | 1250000 |

#### [FS-CH04-06] Bài 4.6: Tìm các loại trái cây có tổng số lượng bán ra từ 3 trở lên

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B3 - GROUP BY + HAVING trên Fruits & OrderDetails)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM ... GROUP BY ... HAVING AggregateFunc(...) >= Value; (Cùng cơ chế Bài 4.4 & 4.5 nhưng tìm Trái cây bán được >= 3 đơn vị)`
- **Đề bài**: Tiếp tục phản xạ `GROUP BY ... HAVING` giữa `Fruits` và `OrderDetails`: Lấy ra `FruitID`, `FruitName`, tổng số lượng đã bán (`TotalQtySold = SUM(od.Quantity)`) và tổng doanh thu món (`TotalItemRevenue = SUM(od.SubTotal)`) của các loại trái cây có `SUM(od.Quantity) >= 3`. Sắp xếp theo `TotalItemRevenue` giảm dần.
- **Gợi ý tư duy**: Dùng `HAVING SUM(od.Quantity) >= 3`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT f.FruitID, f.FruitName,
       SUM(od.Quantity) AS TotalQtySold,
       SUM(od.SubTotal) AS TotalItemRevenue
FROM Fruits f
INNER JOIN OrderDetails od ON f.FruitID = od.FruitID
GROUP BY f.FruitID, f.FruitName
HAVING SUM(od.Quantity) >= 3
ORDER BY TotalItemRevenue DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT f.FruitID, f.FruitName,
       SUM(od.Quantity) AS TotalQtySold,
       SUM(od.SubTotal) AS TotalItemRevenue
FROM Fruits f
INNER JOIN OrderDetails od ON f.FruitID = od.FruitID
GROUP BY f.FruitID, f.FruitName
HAVING SUM(od.Quantity) >= 3
ORDER BY TotalItemRevenue DESC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 4 cột):**

| FruitID | FruitName | TotalQtySold | TotalItemRevenue |
| :--- | :--- | :--- | :--- |
| 5 | Nho Mẫu Đơn Shine Muscat | 3 | 2550000 |
| 7 | Cherry Đỏ Thẫm | 4 | 1800000 |

#### [FS-CH04-07] Bài 4.7: Tìm các loại trái cây có giá bán cao hơn giá trung bình của toàn cửa hàng

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Scalar Subquery so sánh với giá trị trung bình toàn bảng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM Table WHERE Col > (SELECT AVG(Col) FROM Table);`
- **Đề bài**: Sử dụng truy vấn con vô hướng (Scalar Subquery), hãy lấy ra `FruitID`, `FruitName`, `Price` của các loại trái cây có giá bán lớn hơn mức giá trung bình `AVG(Price)` của tất cả trái cây trong bảng `Fruits`. Sắp xếp theo `Price` giảm dần.
- **Gợi ý tư duy**: Dùng `WHERE Price > (SELECT AVG(Price) FROM Fruits)`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, Price
FROM Fruits
WHERE Price > (SELECT AVG(CAST(Price AS FLOAT)) FROM Fruits)
ORDER BY Price DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Price
FROM Fruits
WHERE Price > (SELECT AVG(Price) FROM Fruits)
ORDER BY Price DESC;
```

**Kết quả kỳ vọng (`expected` — 6 dòng × 3 cột):**

| FruitID | FruitName | Price |
| :--- | :--- | :--- |
| 5 | Nho Mẫu Đơn Shine Muscat | 850000 |
| 7 | Cherry Đỏ Thẫm | 450000 |
| 10 | Việt Quất (Blueberry) | 350000 |
| 11 | Mâm Xôi Đen | 320000 |
| 14 | Hạt Mắc Ca | 280000 |
| 6 | Táo Envy | 250000 |

#### [FS-CH04-08] Bài 4.8: Tìm các loại trái cây có giá bán cao hơn giá trung bình của CHÍNH danh mục chứa nó

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Correlated Subquery - So sánh với trung bình của chính danh mục đó)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `WHERE f1.Price > (SELECT AVG(f2.Price) FROM Fruits f2 WHERE f2.CategoryID = f1.CategoryID)`
- **Đề bài**: Sử dụng Truy vấn con tương quan (Correlated Subquery), hãy lấy ra `FruitID`, `FruitName`, `CategoryID`, `Price` của những loại trái cây có giá bán lớn hơn giá trung bình của các trái cây trong cùng `CategoryID` đó. Sắp xếp theo `CategoryID` tăng dần, `Price` giảm dần.
- **Gợi ý tư duy**: Trong subquery, liên kết điều kiện `WHERE f2.CategoryID = f1.CategoryID`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT f1.FruitID, f1.FruitName, f1.CategoryID, f1.Price
FROM Fruits f1
WHERE f1.Price > (
    SELECT AVG(CAST(f2.Price AS FLOAT))
    FROM Fruits f2
    WHERE f2.CategoryID = f1.CategoryID
)
ORDER BY f1.CategoryID ASC, f1.Price DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT f1.FruitID, f1.FruitName, f1.CategoryID, f1.Price
FROM Fruits f1
WHERE f1.Price > (
    SELECT AVG(f2.Price)
    FROM Fruits f2
    WHERE f2.CategoryID = f1.CategoryID
)
ORDER BY f1.CategoryID ASC, f1.Price DESC;
```

**Kết quả kỳ vọng (`expected` — 6 dòng × 4 cột):**

| FruitID | FruitName | CategoryID | Price |
| :--- | :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | 1 | 150000 |
| 5 | Nho Mẫu Đơn Shine Muscat | 2 | 850000 |
| 7 | Cherry Đỏ Thẫm | 2 | 450000 |
| 10 | Việt Quất (Blueberry) | 3 | 350000 |
| 11 | Mâm Xôi Đen | 3 | 320000 |
| 12 | Nho khô Ninh Thuận | 4 | 120000 |

#### [FS-CH04-09] Bài 4.9: Tìm khách hàng đã từng đặt đơn hàng nhưng CHƯA TỪNG viết đánh giá (Review) nào

- **Cấp độ & Nhóm phản xạ**: `Nâng cao (EXISTS & NOT EXISTS an toàn với NULL)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM Customers c WHERE EXISTS (...) AND NOT EXISTS (...)`
- **Đề bài**: Sử dụng `EXISTS` kết hợp `NOT EXISTS`, hãy lấy ra `CustomerID`, `FullName`, `CustomerType` của những khách hàng có ít nhất 1 đơn hàng trong `Orders` nhưng chưa từng có bản ghi nào trong bảng `Reviews`. Sắp xếp theo `CustomerID` tăng dần.
- **Gợi ý tư duy**: Kết hợp `WHERE EXISTS (SELECT 1 FROM Orders o WHERE o.CustomerID = c.CustomerID) AND NOT EXISTS (SELECT 1 FROM Reviews r WHERE r.CustomerID = c.CustomerID)`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT c.CustomerID, c.FullName, c.CustomerType
FROM Customers c
WHERE EXISTS (
    SELECT 1 FROM Orders o WHERE o.CustomerID = c.CustomerID
)
AND NOT EXISTS (
    SELECT 1 FROM Reviews r WHERE r.CustomerID = c.CustomerID
)
ORDER BY c.CustomerID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT c.CustomerID, c.FullName, c.CustomerType
FROM Customers c
WHERE EXISTS (
    SELECT 1 FROM Orders o WHERE o.CustomerID = c.CustomerID
)
AND NOT EXISTS (
    SELECT 1 FROM Reviews r WHERE r.CustomerID = c.CustomerID
)
ORDER BY c.CustomerID ASC;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 3 cột):**

| CustomerID | FullName | CustomerType |
| :--- | :--- | :--- |
| 3 | Trương Vô Kỵ | Standard |
| 6 | Ân Ly | Standard |
| 7 | Tiểu Chiêu | Standard |

#### [FS-CH04-10] Bài 4.10: Báo cáo hiệu suất nhân viên bán hàng: Phân biệt Tổng số đơn, Số đơn có dùng Voucher và Số khách duy nhất

- **Cấp độ & Nhóm phản xạ**: `Thực chiến (Bẫy COUNT(*) vs COUNT(Column) trên cột có NULL)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `COUNT(*) vs COUNT(VoucherID) vs COUNT(DISTINCT CustomerID)`
- **Đề bài**: Gom nhóm bảng `Orders` kết hợp với `Employees` theo nhân viên bán hàng (`EmployeeID`, `FullName`) để tính 4 chỉ số trong cùng 1 câu truy vấn: Tổng số đơn phụ trách (`TotalOrders = COUNT(*)`), Số đơn có áp mã giảm giá (`VoucherOrders = COUNT(o.VoucherID)`), Số khách hàng duy nhất đã phục vụ (`UniqueCustomers = COUNT(DISTINCT o.CustomerID)`), và Tổng doanh thu (`TotalRevenue = SUM(o.TotalAmount)`). Sắp xếp theo `EmployeeID` tăng dần.
- **Gợi ý tư duy**: Nhờ `COUNT(o.VoucherID)` tự động bỏ qua `NULL`, bạn đếm được chính xác số đơn có dùng mã giảm giá mà không cần `WHERE`!

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT e.EmployeeID, e.FullName,
       COUNT(*) AS TotalOrders,
       COUNT(o.VoucherID) AS VoucherOrders,
       COUNT(DISTINCT o.CustomerID) AS UniqueCustomers,
       SUM(o.TotalAmount) AS TotalRevenue
FROM Employees e
INNER JOIN Orders o ON e.EmployeeID = o.EmployeeID
GROUP BY e.EmployeeID, e.FullName
ORDER BY e.EmployeeID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT e.EmployeeID, e.FullName,
       COUNT(*) AS TotalOrders,
       COUNT(o.VoucherID) AS VoucherOrders,
       COUNT(DISTINCT o.CustomerID) AS UniqueCustomers,
       SUM(o.TotalAmount) AS TotalRevenue
FROM Employees e
INNER JOIN Orders o ON e.EmployeeID = o.EmployeeID
GROUP BY e.EmployeeID, e.FullName
ORDER BY e.EmployeeID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 6 cột):**

| EmployeeID | FullName | TotalOrders | VoucherOrders | UniqueCustomers | TotalRevenue |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 6 | Hoàng Cúc | 6 | 2 | 4 | 4005000 |
| 7 | Đinh Hợi | 4 | 3 | 3 | 1700000 |

### Chương 5: Window Functions, CTE, Đệ Quy (Recursive CTE) & Phân Trang

- **Mục tiêu phản xạ của chương**: Rèn phản xạ xếp hạng (ROW_NUMBER, RANK, DENSE_RANK), tính lũy kế (Running Total), so sánh dòng trước/sau (LAG/LEAD), viết CTE lấy Top N mỗi nhóm và đệ quy cây nhân sự (Recursive CTE).

#### [FS-CH05-01] Bài 5.1: Xếp hạng giá bán toàn bộ trái cây bằng ROW_NUMBER và DENSE_RANK (Bảng Fruits)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A1 - ROW_NUMBER, RANK, DENSE_RANK trên bảng Fruits)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `ROW_NUMBER() OVER (ORDER BY Col DESC), DENSE_RANK() OVER (ORDER BY Col DESC)`
- **Đề bài**: Từ bảng `Fruits`, hãy lấy ra `FruitID`, `FruitName`, `Price`, cùng với số thứ tự dòng (`RowNum = ROW_NUMBER() OVER (ORDER BY Price DESC, FruitID ASC)`) và thứ hạng đồng hạng không nhảy bậc (`DenseRk = DENSE_RANK() OVER (ORDER BY Price DESC)`). Sắp xếp theo `RowNum` tăng dần.
- **Gợi ý tư duy**: Sử dụng cú pháp `OVER (ORDER BY Price DESC)` cho các hàm cửa sổ.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, Price,
       ROW_NUMBER() OVER (ORDER BY Price DESC, FruitID ASC) AS RowNum,
       DENSE_RANK() OVER (ORDER BY Price DESC) AS DenseRk
FROM Fruits
ORDER BY RowNum ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Price,
       ROW_NUMBER() OVER (ORDER BY Price DESC, FruitID ASC) AS RowNum,
       DENSE_RANK() OVER (ORDER BY Price DESC) AS DenseRk
FROM Fruits
ORDER BY RowNum ASC;
```

**Kết quả kỳ vọng (`expected` — 14 dòng × 5 cột):**

| FruitID | FruitName | Price | RowNum | DenseRk |
| :--- | :--- | :--- | :--- | :--- |
| 5 | Nho Mẫu Đơn Shine Muscat | 850000 | 1 | 1 |
| 7 | Cherry Đỏ Thẫm | 450000 | 2 | 2 |
| 10 | Việt Quất (Blueberry) | 350000 | 3 | 3 |
| 11 | Mâm Xôi Đen | 320000 | 4 | 4 |
| 14 | Hạt Mắc Ca | 280000 | 5 | 5 |
| 6 | Táo Envy | 250000 | 6 | 6 |
| 9 | Dâu Tây Mộc Châu | 200000 | 7 | 7 |
| 8 | Kiwi Vàng | 180000 | 8 | 8 |
| 1 | Sầu Riêng Ri6 | 150000 | 9 | 9 |
| 12 | Nho khô Ninh Thuận | 120000 | 10 | 10 |
| 4 | Măng Cụt Lái Thiêu | 95000 | 11 | 11 |
| 3 | Xoài Cát Hòa Lộc | 80000 | 12 | 12 |
| 2 | Bưởi Da Xanh | 70000 | 13 | 13 |
| 13 | Mít sấy giòn | 60000 | 14 | 14 |

#### [FS-CH05-02] Bài 5.2: Xếp hạng các đơn hàng theo giá trị TotalAmount từ cao xuống thấp (Bảng Orders)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A2 - Xếp hạng trên bảng Orders)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `RANK() OVER (ORDER BY Col DESC), DENSE_RANK() OVER (ORDER BY Col DESC) (Cùng cơ chế Bài 5.1 nhưng trên Orders)`
- **Đề bài**: Áp dụng y hệt cơ chế Window Ranking của Bài 5.1 nhưng trên bảng `Orders`: Lấy ra `OrderID`, `CustomerID`, `TotalAmount`, `RANK() OVER (ORDER BY TotalAmount DESC)` đặt tên là `OrderRank`, và `DENSE_RANK() OVER (ORDER BY TotalAmount DESC)` đặt tên là `OrderDenseRank`. Sắp xếp theo `TotalAmount` giảm dần, `OrderID` tăng dần.
- **Gợi ý tư duy**: Quan sát sự khác biệt giữa `RANK` và `DENSE_RANK` tại hai đơn hàng đồng giá trị `850000` và `180000`!

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT OrderID, CustomerID, TotalAmount,
       RANK() OVER (ORDER BY TotalAmount DESC) AS OrderRank,
       DENSE_RANK() OVER (ORDER BY TotalAmount DESC) AS OrderDenseRank
FROM Orders
ORDER BY TotalAmount DESC, OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT OrderID, CustomerID, TotalAmount,
       RANK() OVER (ORDER BY TotalAmount DESC) AS OrderRank,
       DENSE_RANK() OVER (ORDER BY TotalAmount DESC) AS OrderDenseRank
FROM Orders
ORDER BY TotalAmount DESC, OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 10 dòng × 5 cột):**

| OrderID | CustomerID | TotalAmount | OrderRank | OrderDenseRank |
| :--- | :--- | :--- | :--- | :--- |
| 5 | 1 | 2500000 | 1 | 1 |
| 1 | 1 | 850000 | 2 | 2 |
| 4 | 4 | 850000 | 2 | 2 |
| 9 | 4 | 400000 | 4 | 3 |
| 6 | 5 | 300000 | 5 | 4 |
| 8 | 1 | 200000 | 6 | 5 |
| 2 | 2 | 180000 | 7 | 6 |
| 7 | 6 | 180000 | 7 | 6 |
| 3 | 3 | 150000 | 9 | 7 |
| 10 | 7 | 95000 | 10 | 8 |

#### [FS-CH05-03] Bài 5.3: Xếp hạng giá trái cây TRONG TỪNG DANH MỤC bằng PARTITION BY (Bảng Fruits)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A3 - Xếp hạng có PARTITION BY)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `ROW_NUMBER() OVER (PARTITION BY GroupCol ORDER BY MeasureCol DESC)`
- **Đề bài**: Tiếp tục phản xạ Window Ranking nhưng thêm `PARTITION BY CategoryID`: Lấy ra `CategoryID`, `FruitID`, `FruitName`, `Price` và thứ hạng của trái cây trong từng danh mục (`RankInCat = ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Price DESC, FruitID ASC)`). Sắp xếp theo `CategoryID` tăng dần, `RankInCat` tăng dần.
- **Gợi ý tư duy**: Khi có `PARTITION BY CategoryID`, bộ đếm sẽ tự động reset về 1 mỗi khi sang `CategoryID` mới.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT CategoryID, FruitID, FruitName, Price,
       ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Price DESC, FruitID ASC) AS RankInCat
FROM Fruits
ORDER BY CategoryID ASC, RankInCat ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT CategoryID, FruitID, FruitName, Price,
       ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Price DESC, FruitID ASC) AS RankInCat
FROM Fruits
ORDER BY CategoryID ASC, RankInCat ASC;
```

**Kết quả kỳ vọng (`expected` — 14 dòng × 5 cột):**

| CategoryID | FruitID | FruitName | Price | RankInCat |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | Sầu Riêng Ri6 | 150000 | 1 |
| 1 | 4 | Măng Cụt Lái Thiêu | 95000 | 2 |
| 1 | 3 | Xoài Cát Hòa Lộc | 80000 | 3 |
| 1 | 2 | Bưởi Da Xanh | 70000 | 4 |
| 2 | 5 | Nho Mẫu Đơn Shine Muscat | 850000 | 1 |
| 2 | 7 | Cherry Đỏ Thẫm | 450000 | 2 |
| 2 | 6 | Táo Envy | 250000 | 3 |
| 2 | 8 | Kiwi Vàng | 180000 | 4 |
| 3 | 10 | Việt Quất (Blueberry) | 350000 | 1 |
| 3 | 11 | Mâm Xôi Đen | 320000 | 2 |
| 3 | 9 | Dâu Tây Mộc Châu | 200000 | 3 |
| 4 | 12 | Nho khô Ninh Thuận | 120000 | 1 |
| 4 | 13 | Mít sấy giòn | 60000 | 2 |
| 5 | 14 | Hạt Mắc Ca | 280000 | 1 |

#### [FS-CH05-04] Bài 5.4: Lấy ra 2 loại trái cây đắt nhất của mỗi danh mục (CTE + ROW_NUMBER)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B1 - CTE lọc Top N mỗi nhóm)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `WITH Ranked AS (SELECT ..., ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) AS rn FROM ...) SELECT * FROM Ranked WHERE rn <= N;`
- **Đề bài**: Bọc câu truy vấn ở Bài 5.3 vào một CTE tên là `RankedFruits`, sau đó lọc `WHERE RankInCat <= 2` để lấy ra tối đa 2 loại trái cây có giá cao nhất trong mỗi danh mục (`CategoryID`, `FruitID`, `FruitName`, `Price`, `RankInCat`). Sắp xếp theo `CategoryID` tăng dần, `RankInCat` tăng dần.
- **Gợi ý tư duy**: Vì không thể dùng trực tiếp Window Function trong `WHERE`, ta bắt buộc dùng CTE `WITH RankedFruits AS (...) SELECT ... WHERE RankInCat <= 2`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
WITH RankedFruits AS (
    SELECT CategoryID, FruitID, FruitName, Price,
           ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Price DESC, FruitID ASC) AS RankInCat
    FROM Fruits
)
SELECT CategoryID, FruitID, FruitName, Price, RankInCat
FROM RankedFruits
WHERE RankInCat <= 2
ORDER BY CategoryID ASC, RankInCat ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
WITH RankedFruits AS (
    SELECT CategoryID, FruitID, FruitName, Price,
           ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Price DESC, FruitID ASC) AS RankInCat
    FROM Fruits
)
SELECT CategoryID, FruitID, FruitName, Price, RankInCat
FROM RankedFruits
WHERE RankInCat <= 2
ORDER BY CategoryID ASC, RankInCat ASC;
```

**Kết quả kỳ vọng (`expected` — 9 dòng × 5 cột):**

| CategoryID | FruitID | FruitName | Price | RankInCat |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | Sầu Riêng Ri6 | 150000 | 1 |
| 1 | 4 | Măng Cụt Lái Thiêu | 95000 | 2 |
| 2 | 5 | Nho Mẫu Đơn Shine Muscat | 850000 | 1 |
| 2 | 7 | Cherry Đỏ Thẫm | 450000 | 2 |
| 3 | 10 | Việt Quất (Blueberry) | 350000 | 1 |
| 3 | 11 | Mâm Xôi Đen | 320000 | 2 |
| 4 | 12 | Nho khô Ninh Thuận | 120000 | 1 |
| 4 | 13 | Mít sấy giòn | 60000 | 2 |
| 5 | 14 | Hạt Mắc Ca | 280000 | 1 |

#### [FS-CH05-05] Bài 5.5: Tìm đơn hàng có giá trị lớn nhất của từng khách hàng (CTE + PARTITION BY CustomerID)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B2 - CTE lọc Top 1 đơn hàng lớn nhất của mỗi khách hàng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `WITH Ranked AS (SELECT ..., ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) AS rn FROM ...) SELECT * FROM Ranked WHERE rn = 1; (Cùng cơ chế Bài 5.4 nhưng trên Orders)`
- **Đề bài**: Áp dụng y hệt khuôn mẫu CTE + `ROW_NUMBER() OVER (PARTITION BY ...)` của Bài 5.4 trên bảng `Orders`: Với mỗi `CustomerID` có đặt hàng, hãy lấy ra đơn hàng có `TotalAmount` lớn nhất (nếu bằng nhau lấy `OrderID` nhỏ hơn). Hiển thị `CustomerID`, `OrderID`, `OrderDate`, `TotalAmount`. Sắp xếp theo `CustomerID` tăng dần.
- **Gợi ý tư duy**: Phân vùng `PARTITION BY CustomerID ORDER BY TotalAmount DESC, OrderID ASC` và lọc `WHERE rn = 1`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
WITH CustomerTopOrders AS (
    SELECT CustomerID, OrderID, OrderDate, TotalAmount,
           ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY TotalAmount DESC, OrderID ASC) AS rn
    FROM Orders
)
SELECT CustomerID, OrderID, OrderDate, TotalAmount
FROM CustomerTopOrders
WHERE rn = 1
ORDER BY CustomerID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
WITH CustomerTopOrders AS (
    SELECT CustomerID, OrderID, OrderDate, TotalAmount,
           ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY TotalAmount DESC, OrderID ASC) AS rn
    FROM Orders
)
SELECT CustomerID, OrderID, OrderDate, TotalAmount
FROM CustomerTopOrders
WHERE rn = 1
ORDER BY CustomerID ASC;
```

**Kết quả kỳ vọng (`expected` — 7 dòng × 4 cột):**

| CustomerID | OrderID | OrderDate | TotalAmount |
| :--- | :--- | :--- | :--- |
| 1 | 5 | 2023-12-24 19:00:00 | 2500000 |
| 2 | 2 | 2023-04-20 14:30:00 | 180000 |
| 3 | 3 | 2023-06-15 09:00:00 | 150000 |
| 4 | 4 | 2023-08-08 16:45:00 | 850000 |
| 5 | 6 | 2024-01-10 08:30:00 | 300000 |
| 6 | 7 | 2024-02-14 11:20:00 | 180000 |
| 7 | 10 | 2024-03-10 14:00:00 | 95000 |

#### [FS-CH05-06] Bài 5.6: Tìm đơn hàng gần đây nhất do từng nhân viên bán hàng phụ trách

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B3 - CTE lọc đơn hàng mới nhất của mỗi nhân viên bán hàng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `WITH Ranked AS (SELECT ..., ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) AS rn FROM ...) SELECT * FROM Ranked WHERE rn = 1; (Cùng cơ chế Bài 5.4 & 5.5 nhưng theo EmployeeID)`
- **Đề bài**: Tiếp tục phản xạ CTE + `ROW_NUMBER()` trên bảng `Orders`: Với mỗi `EmployeeID`, hãy tìm đơn hàng có `OrderDate` mới nhất (`ORDER BY OrderDate DESC, OrderID DESC`). Lấy ra `EmployeeID`, `OrderID`, `CustomerID`, `OrderDate`, `TotalAmount`. Sắp xếp theo `EmployeeID` tăng dần.
- **Gợi ý tư duy**: Dùng `PARTITION BY EmployeeID ORDER BY OrderDate DESC, OrderID DESC` rồi lọc `WHERE rn = 1`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
WITH LatestEmpOrder AS (
    SELECT EmployeeID, OrderID, CustomerID, OrderDate, TotalAmount,
           ROW_NUMBER() OVER (PARTITION BY EmployeeID ORDER BY OrderDate DESC, OrderID DESC) AS rn
    FROM Orders
)
SELECT EmployeeID, OrderID, CustomerID, OrderDate, TotalAmount
FROM LatestEmpOrder
WHERE rn = 1
ORDER BY EmployeeID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
WITH LatestEmpOrder AS (
    SELECT EmployeeID, OrderID, CustomerID, OrderDate, TotalAmount,
           ROW_NUMBER() OVER (PARTITION BY EmployeeID ORDER BY OrderDate DESC, OrderID DESC) AS rn
    FROM Orders
)
SELECT EmployeeID, OrderID, CustomerID, OrderDate, TotalAmount
FROM LatestEmpOrder
WHERE rn = 1
ORDER BY EmployeeID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 5 cột):**

| EmployeeID | OrderID | CustomerID | OrderDate | TotalAmount |
| :--- | :--- | :--- | :--- | :--- |
| 6 | 10 | 7 | 2024-03-10 14:00:00 | 95000 |
| 7 | 9 | 4 | 2024-03-05 10:00:00 | 400000 |

#### [FS-CH05-07] Bài 5.7: Tính doanh thu lũy kế (Running Total) theo thời gian của các đơn hàng 'Đã giao'

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Tổng lũy kế Running Total với SUM() OVER)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SUM(TotalAmount) OVER (ORDER BY OrderDate, OrderID ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`
- **Đề bài**: Với các đơn hàng có `Status = 'Đã giao'`, hãy lấy ra `OrderID`, `OrderDate`, `TotalAmount` và cột doanh thu cộng dồn từ đơn đầu tiên đến đơn hiện tại (`RunningRevenue = SUM(TotalAmount) OVER (ORDER BY OrderDate ASC, OrderID ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`). Sắp xếp theo `OrderDate` tăng dần, `OrderID` tăng dần.
- **Gợi ý tư duy**: Luôn khai báo tường minh `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` để tránh bẫy mặc định `RANGE`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT OrderID, OrderDate, TotalAmount,
       SUM(TotalAmount) OVER (
           ORDER BY OrderDate ASC, OrderID ASC
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS RunningRevenue
FROM Orders
WHERE Status = N'Đã giao'
ORDER BY OrderDate ASC, OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT OrderID, OrderDate, TotalAmount,
       SUM(TotalAmount) OVER (
           ORDER BY OrderDate ASC, OrderID ASC
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS RunningRevenue
FROM Orders
WHERE Status = 'Đã giao'
ORDER BY OrderDate ASC, OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 6 dòng × 4 cột):**

| OrderID | OrderDate | TotalAmount | RunningRevenue |
| :--- | :--- | :--- | :--- |
| 1 | 2023-02-14 10:15:00 | 850000 | 850000 |
| 2 | 2023-04-20 14:30:00 | 180000 | 1030000 |
| 3 | 2023-06-15 09:00:00 | 150000 | 1180000 |
| 4 | 2023-08-08 16:45:00 | 850000 | 2030000 |
| 5 | 2023-12-24 19:00:00 | 2500000 | 4530000 |
| 6 | 2024-01-10 08:30:00 | 300000 | 4830000 |

#### [FS-CH05-08] Bài 5.8: So sánh chênh lệch giá trị đơn hàng hiện tại với đơn hàng liền trước của cùng khách hàng (Hàm LAG)

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (So sánh với dòng liền trước bằng hàm LAG)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate ASC)`
- **Đề bài**: Từ bảng `Orders`, hãy lấy ra `CustomerID`, `OrderID`, `OrderDate`, `TotalAmount`, giá trị đơn liền trước của chính khách hàng đó (`PrevOrderAmount = LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate ASC, OrderID ASC)`) và mức chênh lệch (`DiffAmount = TotalAmount - PrevOrderAmount`). Sắp xếp theo `CustomerID` tăng dần, `OrderDate` tăng dần.
- **Gợi ý tư duy**: Tham số thứ 3 của `LAG(TotalAmount, 1, 0)` giúp thay thế giá trị `NULL` của đơn đầu tiên bằng `0`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT CustomerID, OrderID, OrderDate, TotalAmount,
       LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate ASC, OrderID ASC) AS PrevOrderAmount,
       TotalAmount - LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate ASC, OrderID ASC) AS DiffAmount
FROM Orders
ORDER BY CustomerID ASC, OrderDate ASC, OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT CustomerID, OrderID, OrderDate, TotalAmount,
       LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate ASC, OrderID ASC) AS PrevOrderAmount,
       TotalAmount - LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate ASC, OrderID ASC) AS DiffAmount
FROM Orders
ORDER BY CustomerID ASC, OrderDate ASC, OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 10 dòng × 6 cột):**

| CustomerID | OrderID | OrderDate | TotalAmount | PrevOrderAmount | DiffAmount |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | 2023-02-14 10:15:00 | 850000 | 0 | 850000 |
| 1 | 5 | 2023-12-24 19:00:00 | 2500000 | 850000 | 1650000 |
| 1 | 8 | 2024-03-01 15:10:00 | 200000 | 2500000 | -2300000 |
| 2 | 2 | 2023-04-20 14:30:00 | 180000 | 0 | 180000 |
| 3 | 3 | 2023-06-15 09:00:00 | 150000 | 0 | 150000 |
| 4 | 4 | 2023-08-08 16:45:00 | 850000 | 0 | 850000 |
| 4 | 9 | 2024-03-05 10:00:00 | 400000 | 850000 | -450000 |
| 5 | 6 | 2024-01-10 08:30:00 | 300000 | 0 | 300000 |
| 6 | 7 | 2024-02-14 11:20:00 | 180000 | 0 | 180000 |
| 7 | 10 | 2024-03-10 14:00:00 | 95000 | 0 | 95000 |

#### [FS-CH05-09] Bài 5.9: Truy vết sơ đồ cây phân cấp nhân sự 3 tầng từ Giám đốc xuống Nhân viên (Recursive CTE)

- **Cấp độ & Nhóm phản xạ**: `Nâng cao (Đệ quy cây phân cấp nhân sự với Recursive CTE)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `WITH OrgChart AS (Anchor UNION ALL Recursive) SELECT * FROM OrgChart;`
- **Đề bài**: Viết một Recursive CTE tên là `OrgChart` trên bảng `Employees`: Phần neo (Anchor) bắt đầu từ Giám đốc (`ManagerID IS NULL`) với `OrgLevel = 1`. Phần đệ quy nối `Employees e INNER JOIN OrgChart o ON e.ManagerID = o.EmployeeID` với `OrgLevel = o.OrgLevel + 1`. Lấy ra `EmployeeID`, `FullName`, `Role`, `ManagerID`, `OrgLevel`, sắp xếp theo `OrgLevel` tăng dần, `EmployeeID` tăng dần.
- **Gợi ý tư duy**: Cấu trúc chuẩn: `WITH OrgChart AS (SELECT ..., 1 AS OrgLevel FROM Employees WHERE ManagerID IS NULL UNION ALL SELECT ..., o.OrgLevel + 1 FROM Employees e INNER JOIN OrgChart o ON e.ManagerID = o.EmployeeID)`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
WITH OrgChart AS (
    SELECT EmployeeID, FullName, Role, ManagerID, 1 AS OrgLevel
    FROM Employees
    WHERE ManagerID IS NULL
    UNION ALL
    SELECT e.EmployeeID, e.FullName, e.Role, e.ManagerID, o.OrgLevel + 1
    FROM Employees e
    INNER JOIN OrgChart o ON e.ManagerID = o.EmployeeID
)
SELECT EmployeeID, FullName, Role, ManagerID, OrgLevel
FROM OrgChart
ORDER BY OrgLevel ASC, EmployeeID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
WITH RECURSIVE OrgChart AS (
    SELECT EmployeeID, FullName, Role, ManagerID, 1 AS OrgLevel
    FROM Employees
    WHERE ManagerID IS NULL
    UNION ALL
    SELECT e.EmployeeID, e.FullName, e.Role, e.ManagerID, o.OrgLevel + 1
    FROM Employees e
    INNER JOIN OrgChart o ON e.ManagerID = o.EmployeeID
)
SELECT EmployeeID, FullName, Role, ManagerID, OrgLevel
FROM OrgChart
ORDER BY OrgLevel ASC, EmployeeID ASC;
```

**Kết quả kỳ vọng (`expected` — 7 dòng × 5 cột):**

| EmployeeID | FullName | Role | ManagerID | OrgLevel |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Lê Minh Triết | Giám đốc | `NULL` | 1 |
| 2 | Nguyễn Tấn Dũng | Quản lý Kho | 1 | 2 |
| 3 | Trần Thị Mai | Quản lý Bán hàng | 1 | 2 |
| 4 | Phạm Văn A | Nhân viên Kho | 2 | 3 |
| 5 | Lý Bạch | Nhân viên Kho | 2 | 3 |
| 6 | Hoàng Cúc | Nhân viên Bán hàng | 3 | 3 |
| 7 | Đinh Hợi | Nhân viên Bán hàng | 3 | 3 |

#### [FS-CH05-10] Bài 5.10: Tính tỷ trọng % giá trị tồn kho của từng loại trái cây so với tổng giá trị tồn kho của danh mục chứa nó

- **Cấp độ & Nhóm phản xạ**: `Thực chiến (Phân trang chuẩn OFFSET-FETCH & Tỷ trọng % doanh thu bằng SUM() OVER())`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `ROUND(Price * 100.0 / SUM(Price) OVER (PARTITION BY CategoryID), 2)`
- **Đề bài**: Với các loại trái cây thuộc danh mục `1` và `2`, hãy tính giá trị tồn kho từng món (`ItemInv = Price * StockQuantity`), tổng giá trị tồn kho của cả danh mục đó (`CatInv = SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID)`), và tỷ trọng phần trăm (`PctOfCat = ROUND((Price * StockQuantity) * 100.0 / SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID), 2)`). Lấy ra `CategoryID`, `FruitID`, `FruitName`, `ItemInv`, `CatInv`, `PctOfCat`. Sắp xếp theo `CategoryID` tăng dần, `PctOfCat` giảm dần.
- **Gợi ý tư duy**: Dùng `SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID)` để lấy mẫu số tổng của từng danh mục ngay trên từng dòng mà không làm mất chi tiết dòng.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT CategoryID, FruitID, FruitName,
       (Price * StockQuantity) AS ItemInv,
       SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID) AS CatInv,
       ROUND(CAST(Price * StockQuantity AS FLOAT) * 100.0 / SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID), 2) AS PctOfCat
FROM Fruits
WHERE CategoryID IN (1, 2)
ORDER BY CategoryID ASC, PctOfCat DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT CategoryID, FruitID, FruitName,
       (Price * StockQuantity) AS ItemInv,
       SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID) AS CatInv,
       ROUND((Price * StockQuantity) * 100.0 / SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID), 2) AS PctOfCat
FROM Fruits
WHERE CategoryID IN (1, 2)
ORDER BY CategoryID ASC, PctOfCat DESC;
```

**Kết quả kỳ vọng (`expected` — 8 dòng × 6 cột):**

| CategoryID | FruitID | FruitName | ItemInv | CatInv | PctOfCat |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 3 | Xoài Cát Hòa Lộc | 16000000 | 39500000 | 40.51 |
| 1 | 2 | Bưởi Da Xanh | 8400000 | 39500000 | 21.27 |
| 1 | 4 | Măng Cụt Lái Thiêu | 7600000 | 39500000 | 19.24 |
| 1 | 1 | Sầu Riêng Ri6 | 7500000 | 39500000 | 18.99 |
| 2 | 6 | Táo Envy | 25000000 | 62050000 | 40.29 |
| 2 | 7 | Cherry Đỏ Thẫm | 13500000 | 62050000 | 21.76 |
| 2 | 5 | Nho Mẫu Đơn Shine Muscat | 12750000 | 62050000 | 20.55 |
| 2 | 8 | Kiwi Vàng | 10800000 | 62050000 | 17.41 |

### Chương 6: Thao Tác Dữ Liệu (DML: INSERT, UPDATE, DELETE) & Ràng Buộc (Constraints)

- **Mục tiêu phản xạ của chương**: Rèn phản xạ thêm mới (INSERT), cập nhật (UPDATE) và xóa (DELETE) an toàn có điều kiện WHERE, cập nhật chéo từ bảng khác / CTE, và kiểm chứng kết quả ngay sau thao tác.

#### [FS-CH06-01] Bài 6.1: Thêm một danh mục trái cây mới vào bảng Categories

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A1 - INSERT thêm dòng mới & kiểm tra)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `INSERT INTO Table (Cols...) VALUES (...); SELECT ... FROM Table WHERE ...;`
- **Đề bài**: Hãy thực hiện lệnh `INSERT` thêm danh mục mới có `CategoryName = 'Trái cây Hữu cơ (Organic)'` và `Description = 'Đạt chuẩn VietGAP & GlobalGAP'` vào bảng `Categories`, sau đó `SELECT CategoryID, CategoryName, Description FROM Categories ORDER BY CategoryID ASC;` để kiểm tra.
- **Gợi ý tư duy**: Gồm 2 câu lệnh cách nhau bởi dấu chấm phẩy `;`: Lệnh `INSERT INTO Categories ...` và lệnh `SELECT ...`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
INSERT INTO Categories (CategoryName, Description)
VALUES (N'Trái cây Hữu cơ (Organic)', N'Đạt chuẩn VietGAP & GlobalGAP');
SELECT CategoryID, CategoryName, Description FROM Categories ORDER BY CategoryID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
INSERT INTO Categories (CategoryName, Description)
VALUES ('Trái cây Hữu cơ (Organic)', 'Đạt chuẩn VietGAP & GlobalGAP');
SELECT CategoryID, CategoryName, Description FROM Categories ORDER BY CategoryID ASC;
```

**Kết quả kỳ vọng (`expected` — 6 dòng × 3 cột):**

| CategoryID | CategoryName | Description |
| :--- | :--- | :--- |
| 1 | Đặc sản Miền Tây | Trái cây hái tại vườn ĐBSCL |
| 2 | Trái cây Nhập khẩu | Táo, Nho, Cherry từ Mỹ, Úc, Nhật |
| 3 | Quả mọng (Berries) | Dâu tây, Việt quất, Mâm xôi |
| 4 | Trái cây sấy | Đã qua chế biến khô |
| 5 | Quả hạch (Nuts) | Mắc ca, Hạnh nhân, Óc chó |
| 6 | Trái cây Hữu cơ (Organic) | Đạt chuẩn VietGAP & GlobalGAP |

#### [FS-CH06-02] Bài 6.2: Phát hành thêm mã giảm giá mới vào bảng Vouchers

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A2 - INSERT trên bảng Vouchers)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `INSERT INTO Table (Cols...) VALUES (...); SELECT ...; (Cùng cơ chế Bài 6.1 nhưng trên Vouchers)`
- **Đề bài**: Áp dụng y hệt cơ chế `INSERT` của Bài 6.1 trên bảng `Vouchers`: Thêm mã `'SUMMER30'` với `DiscountAmount = 30000`, `MinOrderValue = 150000`, `UsageLimit = 200`, `UsedCount = 0`, `ExpiryDate = '2026-08-31'`. Sau đó `SELECT VoucherID, VoucherCode, DiscountAmount, MinOrderValue, UsageLimit FROM Vouchers ORDER BY VoucherID ASC;`.
- **Gợi ý tư duy**: Điền đúng thứ tự các cột vào câu lệnh `INSERT INTO Vouchers`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
INSERT INTO Vouchers (VoucherCode, DiscountAmount, MinOrderValue, UsageLimit, UsedCount, ExpiryDate)
VALUES ('SUMMER30', 30000, 150000, 200, 0, '2026-08-31');
SELECT VoucherID, VoucherCode, DiscountAmount, MinOrderValue, UsageLimit FROM Vouchers ORDER BY VoucherID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
INSERT INTO Vouchers (VoucherCode, DiscountAmount, MinOrderValue, UsageLimit, UsedCount, ExpiryDate)
VALUES ('SUMMER30', 30000, 150000, 200, 0, '2026-08-31');
SELECT VoucherID, VoucherCode, DiscountAmount, MinOrderValue, UsageLimit FROM Vouchers ORDER BY VoucherID ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 5 cột):**

| VoucherID | VoucherCode | DiscountAmount | MinOrderValue | UsageLimit |
| :--- | :--- | :--- | :--- | :--- |
| 1 | WELCOME50 | 50000 | 200000 | 1000 |
| 2 | VIP100 | 100000 | 500000 | 100 |
| 3 | HETHAN | 30000 | 100000 | 500 |
| 4 | SUMMER30 | 30000 | 150000 | 200 |

#### [FS-CH06-03] Bài 6.3: Đăng ký thêm khách hàng VIP mới vào bảng Customers

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A3 - INSERT trên bảng Customers)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `INSERT INTO Table (Cols...) VALUES (...); SELECT ...; (Cùng cơ chế Bài 6.1 & 6.2 nhưng trên Customers)`
- **Đề bài**: Tiếp tục phản xạ `INSERT` trên bảng `Customers`: Thêm khách hàng `'Quách Tĩnh'`, số điện thoại `'0909999000'`, địa chỉ `'Đảo Đào Hoa'`, phân hạng `'VIP'`, ngày đăng ký `'2024-04-01'`. Sau đó `SELECT CustomerID, FullName, PhoneNumber, CustomerType FROM Customers WHERE CustomerType = 'VIP' ORDER BY CustomerID ASC;`.
- **Gợi ý tư duy**: Chú ý cột `PhoneNumber` có ràng buộc `UNIQUE` nên phải nhập đúng số `'0909999000'`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
INSERT INTO Customers (FullName, PhoneNumber, Address, CustomerType, RegisterDate)
VALUES (N'Quách Tĩnh', '0909999000', N'Đảo Đào Hoa', N'VIP', '2024-04-01');
SELECT CustomerID, FullName, PhoneNumber, CustomerType FROM Customers WHERE CustomerType = N'VIP' ORDER BY CustomerID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
INSERT INTO Customers (FullName, PhoneNumber, Address, CustomerType, RegisterDate)
VALUES ('Quách Tĩnh', '0909999000', 'Đảo Đào Hoa', 'VIP', '2024-04-01');
SELECT CustomerID, FullName, PhoneNumber, CustomerType FROM Customers WHERE CustomerType = 'VIP' ORDER BY CustomerID ASC;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 4 cột):**

| CustomerID | FullName | PhoneNumber | CustomerType |
| :--- | :--- | :--- | :--- |
| 1 | Võ Thành Tài | 0901111222 | VIP |
| 4 | Triệu Mẫn | 0904444555 | VIP |
| 9 | Quách Tĩnh | 0909999000 | VIP |

#### [FS-CH06-04] Bài 6.4: Nhập thêm 50 hộp Mâm Xôi Đen đang hết hàng (UPDATE trên bảng Fruits)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B1 - UPDATE có điều kiện WHERE)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `UPDATE Table SET Col = NewVal WHERE Condition; SELECT ...;`
- **Đề bài**: Mặt hàng `'Mâm Xôi Đen'` (`FruitID = 11`) hiện đang có `StockQuantity = 0`. Hãy viết lệnh `UPDATE` cộng thêm `50` hộp vào `StockQuantity` cho `FruitID = 11`, sau đó `SELECT FruitID, FruitName, Price, StockQuantity FROM Fruits WHERE CategoryID = 3 ORDER BY FruitID ASC;`.
- **Gợi ý tư duy**: Dùng `UPDATE Fruits SET StockQuantity = StockQuantity + 50 WHERE FruitID = 11;`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
UPDATE Fruits
SET StockQuantity = StockQuantity + 50
WHERE FruitID = 11;
SELECT FruitID, FruitName, Price, StockQuantity FROM Fruits WHERE CategoryID = 3 ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
UPDATE Fruits
SET StockQuantity = StockQuantity + 50
WHERE FruitID = 11;
SELECT FruitID, FruitName, Price, StockQuantity FROM Fruits WHERE CategoryID = 3 ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 4 cột):**

| FruitID | FruitName | Price | StockQuantity |
| :--- | :--- | :--- | :--- |
| 9 | Dâu Tây Mộc Châu | 200000 | 45 |
| 10 | Việt Quất (Blueberry) | 350000 | 20 |
| 11 | Mâm Xôi Đen | 320000 | 50 |

#### [FS-CH06-05] Bài 6.5: Cập nhật trạng thái đơn hàng số 8 sang 'Đã giao' (UPDATE trên bảng Orders)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B2 - UPDATE trên bảng Orders)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `UPDATE Table SET Col = NewVal WHERE Condition; SELECT ...; (Cùng cơ chế Bài 6.4 nhưng trên Orders)`
- **Đề bài**: Áp dụng y hệt phản xạ `UPDATE ... WHERE` của Bài 6.4 trên bảng `Orders`: Đơn hàng `OrderID = 8` đã giao thành công, hãy cập nhật `Status = 'Đã giao'`, sau đó `SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE CustomerID = 1 ORDER BY OrderID ASC;`.
- **Gợi ý tư duy**: Luôn kiểm tra kỹ `WHERE OrderID = 8` trước khi chạy `UPDATE`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
UPDATE Orders
SET Status = N'Đã giao'
WHERE OrderID = 8;
SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE CustomerID = 1 ORDER BY OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
UPDATE Orders
SET Status = 'Đã giao'
WHERE OrderID = 8;
SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE CustomerID = 1 ORDER BY OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 4 cột):**

| OrderID | CustomerID | TotalAmount | Status |
| :--- | :--- | :--- | :--- |
| 1 | 1 | 850000 | Đã giao |
| 5 | 1 | 2500000 | Đã giao |
| 8 | 1 | 200000 | Đã giao |

#### [FS-CH06-06] Bài 6.6: Nâng hạng VIP cho khách hàng Chu Chỉ Nhược (UPDATE trên bảng Customers)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B3 - UPDATE trên bảng Customers)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `UPDATE Table SET Col = NewVal WHERE Condition; SELECT ...; (Cùng cơ chế Bài 6.4 & 6.5 nhưng trên Customers)`
- **Đề bài**: Tiếp tục phản xạ `UPDATE ... WHERE` trên bảng `Customers`: Nâng hạng `CustomerType = 'VIP'` cho khách hàng có `CustomerID = 5` ('Chu Chỉ Nhược'), sau đó `SELECT CustomerID, FullName, CustomerType FROM Customers WHERE CustomerType = 'VIP' ORDER BY CustomerID ASC;`.
- **Gợi ý tư duy**: Dùng `UPDATE Customers SET CustomerType = 'VIP' WHERE CustomerID = 5;`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
UPDATE Customers
SET CustomerType = N'VIP'
WHERE CustomerID = 5;
SELECT CustomerID, FullName, CustomerType FROM Customers WHERE CustomerType = N'VIP' ORDER BY CustomerID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
UPDATE Customers
SET CustomerType = 'VIP'
WHERE CustomerID = 5;
SELECT CustomerID, FullName, CustomerType FROM Customers WHERE CustomerType = 'VIP' ORDER BY CustomerID ASC;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 3 cột):**

| CustomerID | FullName | CustomerType |
| :--- | :--- | :--- |
| 1 | Võ Thành Tài | VIP |
| 4 | Triệu Mẫn | VIP |
| 5 | Chu Chỉ Nhược | VIP |

#### [FS-CH06-07] Bài 6.7: Dọn dẹp các mã Voucher đã hết hạn và chưa từng được gắn vào đơn hàng nào trong bảng Orders

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (DELETE an toàn với NOT EXISTS)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `DELETE FROM Parent WHERE NOT EXISTS (SELECT 1 FROM Child WHERE ...); SELECT ...;`
- **Đề bài**: Hãy viết lệnh `DELETE` xóa các mã giảm giá trong bảng `Vouchers` đã hết lượt (`UsedCount = UsageLimit`) VÀ không được tham chiếu bởi bất kỳ đơn hàng nào trong bảng `Orders`. Sau đó `SELECT VoucherID, VoucherCode, DiscountAmount, UsedCount, UsageLimit FROM Vouchers ORDER BY VoucherID ASC;`.
- **Gợi ý tư duy**: Dùng `DELETE FROM Vouchers WHERE UsedCount = UsageLimit AND NOT EXISTS (SELECT 1 FROM Orders o WHERE o.VoucherID = Vouchers.VoucherID);`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
DELETE FROM Vouchers
WHERE UsedCount = UsageLimit
  AND NOT EXISTS (SELECT 1 FROM Orders o WHERE o.VoucherID = Vouchers.VoucherID);
SELECT VoucherID, VoucherCode, DiscountAmount, UsedCount, UsageLimit FROM Vouchers ORDER BY VoucherID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
DELETE FROM Vouchers
WHERE UsedCount = UsageLimit
  AND NOT EXISTS (SELECT 1 FROM Orders o WHERE o.VoucherID = Vouchers.VoucherID);
SELECT VoucherID, VoucherCode, DiscountAmount, UsedCount, UsageLimit FROM Vouchers ORDER BY VoucherID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 5 cột):**

| VoucherID | VoucherCode | DiscountAmount | UsedCount | UsageLimit |
| :--- | :--- | :--- | :--- | :--- |
| 1 | WELCOME50 | 50000 | 250 | 1000 |
| 2 | VIP100 | 100000 | 5 | 100 |

#### [FS-CH06-08] Bài 6.8: Tự động nâng hạng VIP cho mọi khách hàng có tổng giá trị đơn hàng từ 300,000đ trở lên

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (UPDATE dùng Subquery nâng hạng VIP tự động)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `UPDATE Customers SET CustomerType = 'VIP' WHERE CustomerID IN (SELECT ... GROUP BY ... HAVING ...)`
- **Đề bài**: Viết câu lệnh `UPDATE` bảng `Customers` để đặt `CustomerType = 'VIP'` cho tất cả khách hàng có tổng `SUM(TotalAmount)` trong bảng `Orders` (chỉ tính các đơn `Status = 'Đã giao'`) lớn hơn hoặc bằng `300000`. Sau đó `SELECT CustomerID, FullName, CustomerType FROM Customers ORDER BY CustomerID ASC;`.
- **Gợi ý tư duy**: Dùng `WHERE CustomerID IN (SELECT CustomerID FROM Orders WHERE Status = 'Đã giao' GROUP BY CustomerID HAVING SUM(TotalAmount) >= 300000)`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
UPDATE Customers
SET CustomerType = N'VIP'
WHERE CustomerID IN (
    SELECT CustomerID
    FROM Orders
    WHERE Status = N'Đã giao'
    GROUP BY CustomerID
    HAVING SUM(TotalAmount) >= 300000
);
SELECT CustomerID, FullName, CustomerType FROM Customers ORDER BY CustomerID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
UPDATE Customers
SET CustomerType = 'VIP'
WHERE CustomerID IN (
    SELECT CustomerID
    FROM Orders
    WHERE Status = 'Đã giao'
    GROUP BY CustomerID
    HAVING SUM(TotalAmount) >= 300000
);
SELECT CustomerID, FullName, CustomerType FROM Customers ORDER BY CustomerID ASC;
```

**Kết quả kỳ vọng (`expected` — 8 dòng × 3 cột):**

| CustomerID | FullName | CustomerType |
| :--- | :--- | :--- |
| 1 | Võ Thành Tài | VIP |
| 2 | Nguyễn Thị Lệ | Standard |
| 3 | Trương Vô Kỵ | Standard |
| 4 | Triệu Mẫn | VIP |
| 5 | Chu Chỉ Nhược | VIP |
| 6 | Ân Ly | Standard |
| 7 | Tiểu Chiêu | Standard |
| 8 | Dương Quá | Standard |

#### [FS-CH06-09] Bài 6.9: Kiểm chứng cột tính toán tự động (Computed Column SubTotal) khi thêm mặt hàng vào đơn số 10

- **Cấp độ & Nhóm phản xạ**: `Nâng cao (Cột tính toán tự động Computed Column SubTotal trong OrderDetails)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) -> SubTotal tự động tính`
- **Đề bài**: Bảng `OrderDetails` có cột `SubTotal` được định nghĩa là Computed Column (`Quantity * UnitPrice`). Hãy `INSERT` thêm một dòng mới vào `OrderDetails` cho `OrderID = 10`, mua `FruitID = 2` (Bưởi Da Xanh), `Quantity = 3`, `UnitPrice = 70000` (không truyền cột `SubTotal`). Sau đó `SELECT OrderDetailID, OrderID, FruitID, Quantity, UnitPrice, SubTotal FROM OrderDetails WHERE OrderID = 10 ORDER BY OrderDetailID ASC;` để xem `SubTotal` tự động tính ra `210000`.
- **Gợi ý tư duy**: Chỉ truyền `(OrderID, FruitID, Quantity, UnitPrice)` vào `INSERT INTO OrderDetails`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice)
VALUES (10, 2, 3, 70000);
SELECT OrderDetailID, OrderID, FruitID, Quantity, UnitPrice, SubTotal
FROM OrderDetails
WHERE OrderID = 10
ORDER BY OrderDetailID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice)
VALUES (10, 2, 3, 70000);
SELECT OrderDetailID, OrderID, FruitID, Quantity, UnitPrice, SubTotal
FROM OrderDetails
WHERE OrderID = 10
ORDER BY OrderDetailID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 6 cột):**

| OrderDetailID | OrderID | FruitID | Quantity | UnitPrice | SubTotal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 13 | 10 | 4 | 1 | 95000 | 95000 |
| 14 | 10 | 2 | 3 | 70000 | 210000 |

#### [FS-CH06-10] Bài 6.10: Đồng bộ lại TotalAmount cho Đơn hàng số 10 sau khi thêm mặt hàng mới

- **Cấp độ & Nhóm phản xạ**: `Thực chiến (Đồng bộ lại TotalAmount của bảng Orders từ OrderDetails và Vouchers)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `UPDATE Orders SET TotalAmount = (SELECT SUM(SubTotal)...) - COALESCE((SELECT DiscountAmount...), 0)`
- **Đề bài**: Tiếp nối Bài 6.9: Sau khi thêm 3 quả Bưởi Da Xanh (`210000`) vào `OrderID = 10` (vốn đã có 1 kg Măng Cụt `95000`), hãy thực hiện: (1) `INSERT` dòng Bưởi Da Xanh đó vào `OrderDetails`, (2) `UPDATE` lại cột `TotalAmount` của `OrderID = 10` bằng tổng `SUM(SubTotal)` trong `OrderDetails` của đơn 10, rồi (3) `SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE OrderID = 10;`.
- **Gợi ý tư duy**: Dùng `UPDATE Orders SET TotalAmount = (SELECT SUM(SubTotal) FROM OrderDetails WHERE OrderID = 10) WHERE OrderID = 10;`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 2, 3, 70000);
UPDATE Orders
SET TotalAmount = (SELECT SUM(SubTotal) FROM OrderDetails WHERE OrderID = 10)
WHERE OrderID = 10;
SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE OrderID = 10;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 2, 3, 70000);
UPDATE Orders
SET TotalAmount = (SELECT SUM(SubTotal) FROM OrderDetails WHERE OrderID = 10)
WHERE OrderID = 10;
SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE OrderID = 10;
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 4 cột):**

| OrderID | CustomerID | TotalAmount | Status |
| :--- | :--- | :--- | :--- |
| 10 | 7 | 305000 | Chờ xử lý |

### Chương 7: Thiết Kế CSDL, Mô Hình ER, Quan Hệ 1-N / N-N & Chuẩn Hóa (1NF - BCNF)

- **Mục tiêu phản xạ của chương**: Rèn phản xạ kiểm tra tính toàn vẹn khóa ngoại (Referential Integrity), truy vấn qua bảng trung gian N-N (OrderDetails, Reviews), phát hiện dư thừa dữ liệu và đối chiếu chuẩn hóa ngay trên 9 bảng của FruitStore.

#### [FS-CH07-01] Bài 7.1: Kiểm toán quan hệ 1-Nhiều giữa Categories (Bảng Cha) và Fruits (Bảng Con)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A1 - Kiểm tra quan hệ 1-N: Categories -> Fruits)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT Parent.*, COUNT(Child.PK) FROM Parent LEFT JOIN Child ... GROUP BY Parent.PK;`
- **Đề bài**: Trong mô hình ER của `FruitStore_Ultimate`, 1 `Category` chứa nhiều `Fruits` (1-N). Hãy viết câu truy vấn liệt kê tất cả `CategoryID`, `CategoryName` cùng số lượng dòng con trong bảng `Fruits` (`ChildCount`) và tổng tồn kho (`TotalStock`). Sắp xếp theo `CategoryID` tăng dần.
- **Gợi ý tư duy**: Dùng `LEFT JOIN` từ bảng cha `Categories` sang bảng con `Fruits` để đảm bảo không bỏ sót danh mục nào.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT c.CategoryID, c.CategoryName,
       COUNT(f.FruitID) AS ChildCount,
       COALESCE(SUM(f.StockQuantity), 0) AS TotalStock
FROM Categories c
LEFT JOIN Fruits f ON c.CategoryID = f.CategoryID
GROUP BY c.CategoryID, c.CategoryName
ORDER BY c.CategoryID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT c.CategoryID, c.CategoryName,
       COUNT(f.FruitID) AS ChildCount,
       COALESCE(SUM(f.StockQuantity), 0) AS TotalStock
FROM Categories c
LEFT JOIN Fruits f ON c.CategoryID = f.CategoryID
GROUP BY c.CategoryID, c.CategoryName
ORDER BY c.CategoryID ASC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 4 cột):**

| CategoryID | CategoryName | ChildCount | TotalStock |
| :--- | :--- | :--- | :--- |
| 1 | Đặc sản Miền Tây | 4 | 450 |
| 2 | Trái cây Nhập khẩu | 4 | 205 |
| 3 | Quả mọng (Berries) | 3 | 65 |
| 4 | Trái cây sấy | 2 | 450 |
| 5 | Quả hạch (Nuts) | 1 | 90 |

#### [FS-CH07-02] Bài 7.2: Kiểm toán quan hệ 1-Nhiều giữa Customers (Bảng Cha) và Orders (Bảng Con)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A2 - Kiểm tra quan hệ 1-N: Customers -> Orders)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT Parent.*, COUNT(Child.PK) FROM Parent LEFT JOIN Child ... GROUP BY Parent.PK; (Cùng cơ chế Bài 7.1 nhưng trên Customers -> Orders)`
- **Đề bài**: Áp dụng y hệt mẫu kiểm toán 1-N của Bài 7.1 nhưng giữa bảng cha `Customers` và bảng con `Orders`: Lấy ra tất cả `CustomerID`, `FullName`, số đơn hàng đã đặt (`OrderCount = COUNT(o.OrderID)`) và tổng tiền (`TotalSpent = COALESCE(SUM(o.TotalAmount), 0)`). Sắp xếp theo `CustomerID` tăng dần.
- **Gợi ý tư duy**: Nhờ dùng `LEFT JOIN` và `COUNT(o.OrderID)`, khách hàng số 8 ('Dương Quá') sẽ hiển thị đúng `OrderCount = 0`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT c.CustomerID, c.FullName,
       COUNT(o.OrderID) AS OrderCount,
       COALESCE(SUM(o.TotalAmount), 0) AS TotalSpent
FROM Customers c
LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.FullName
ORDER BY c.CustomerID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT c.CustomerID, c.FullName,
       COUNT(o.OrderID) AS OrderCount,
       COALESCE(SUM(o.TotalAmount), 0) AS TotalSpent
FROM Customers c
LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.FullName
ORDER BY c.CustomerID ASC;
```

**Kết quả kỳ vọng (`expected` — 8 dòng × 4 cột):**

| CustomerID | FullName | OrderCount | TotalSpent |
| :--- | :--- | :--- | :--- |
| 1 | Võ Thành Tài | 3 | 3550000 |
| 2 | Nguyễn Thị Lệ | 1 | 180000 |
| 3 | Trương Vô Kỵ | 1 | 150000 |
| 4 | Triệu Mẫn | 2 | 1250000 |
| 5 | Chu Chỉ Nhược | 1 | 300000 |
| 6 | Ân Ly | 1 | 180000 |
| 7 | Tiểu Chiêu | 1 | 95000 |
| 8 | Dương Quá | 0 | 0 |

#### [FS-CH07-03] Bài 7.3: Kiểm toán quan hệ 1-Nhiều giữa Vouchers (Bảng Cha) và Orders (Bảng Con)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A3 - Kiểm tra quan hệ 1-N: Vouchers -> Orders)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT Parent.*, COUNT(Child.PK) FROM Parent LEFT JOIN Child ... GROUP BY Parent.PK; (Cùng cơ chế Bài 7.1 & 7.2 nhưng trên Vouchers -> Orders)`
- **Đề bài**: Tiếp tục phản xạ kiểm toán 1-N giữa bảng cha `Vouchers` và bảng con `Orders`: Lấy ra `VoucherID`, `VoucherCode`, `DiscountAmount` và số đơn hàng thực tế trong bảng `Orders` đã gắn mã đó (`OrdersUsingCount = COUNT(o.OrderID)`). Sắp xếp theo `VoucherID` tăng dần.
- **Gợi ý tư duy**: Dùng `Vouchers v LEFT JOIN Orders o ON v.VoucherID = o.VoucherID`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT v.VoucherID, v.VoucherCode, v.DiscountAmount,
       COUNT(o.OrderID) AS OrdersUsingCount
FROM Vouchers v
LEFT JOIN Orders o ON v.VoucherID = o.VoucherID
GROUP BY v.VoucherID, v.VoucherCode, v.DiscountAmount
ORDER BY v.VoucherID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT v.VoucherID, v.VoucherCode, v.DiscountAmount,
       COUNT(o.OrderID) AS OrdersUsingCount
FROM Vouchers v
LEFT JOIN Orders o ON v.VoucherID = o.VoucherID
GROUP BY v.VoucherID, v.VoucherCode, v.DiscountAmount
ORDER BY v.VoucherID ASC;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 4 cột):**

| VoucherID | VoucherCode | DiscountAmount | OrdersUsingCount |
| :--- | :--- | :--- | :--- |
| 1 | WELCOME50 | 50000 | 3 |
| 2 | VIP100 | 100000 | 2 |
| 3 | HETHAN | 30000 | 0 |

#### [FS-CH07-04] Bài 7.4: Thống kê mỗi Đơn hàng chứa bao nhiêu Loại trái cây khác nhau và Tổng số lượng sản phẩm

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B1 - Phân rã quan hệ Nhiều-Nhiều qua bảng trung gian OrderDetails)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Orders (1) ---> (N) OrderDetails (N) <--- (1) Fruits`
- **Đề bài**: Bảng `OrderDetails` là bảng trung gian (Junction Table) phân rã quan hệ Nhiều-Nhiều giữa `Orders` và `Fruits`. Hãy gom nhóm theo `OrderID` để tính: số loại trái cây khác nhau trong đơn (`DistinctFruits = COUNT(DISTINCT FruitID)`), tổng số đơn vị hàng (`TotalItems = SUM(Quantity)`), và tổng tiền hàng trước giảm giá (`GrossAmount = SUM(SubTotal)`). Sắp xếp theo `OrderID` tăng dần.
- **Gợi ý tư duy**: Truy vấn trên bảng trung gian `OrderDetails` và `GROUP BY OrderID`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT OrderID,
       COUNT(DISTINCT FruitID) AS DistinctFruits,
       SUM(Quantity) AS TotalItems,
       SUM(SubTotal) AS GrossAmount
FROM OrderDetails
GROUP BY OrderID
ORDER BY OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT OrderID,
       COUNT(DISTINCT FruitID) AS DistinctFruits,
       SUM(Quantity) AS TotalItems,
       SUM(SubTotal) AS GrossAmount
FROM OrderDetails
GROUP BY OrderID
ORDER BY OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 10 dòng × 4 cột):**

| OrderID | DistinctFruits | TotalItems | GrossAmount |
| :--- | :--- | :--- | :--- |
| 1 | 1 | 1 | 850000 |
| 2 | 2 | 3 | 230000 |
| 3 | 1 | 1 | 150000 |
| 4 | 2 | 3 | 950000 |
| 5 | 2 | 4 | 2600000 |
| 6 | 1 | 1 | 350000 |
| 7 | 1 | 1 | 180000 |
| 8 | 1 | 1 | 200000 |
| 9 | 1 | 1 | 450000 |
| 10 | 1 | 1 | 95000 |

#### [FS-CH07-05] Bài 7.5: Thống kê mỗi Loại trái cây đã xuất hiện trong bao nhiêu Đơn hàng khác nhau

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B2 - Phân rã quan hệ Nhiều-Nhiều chiều ngược lại: Fruits -> Orders)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Fruits (1) ---> (N) OrderDetails (N) <--- (1) Orders (Cùng cơ chế Bài 7.4 nhưng gom theo FruitID)`
- **Đề bài**: Áp dụng chiều ngược lại của quan hệ N-N qua bảng trung gian `OrderDetails`: Với các loại trái cây đã từng được bán, hãy lấy ra `FruitID`, `FruitName`, số đơn hàng khác nhau có chứa trái cây đó (`OrderCount = COUNT(DISTINCT od.OrderID)`), và tổng số lượng bán (`TotalQty = SUM(od.Quantity)`). Sắp xếp theo `OrderCount` giảm dần, `FruitID` tăng dần.
- **Gợi ý tư duy**: Nối `Fruits f INNER JOIN OrderDetails od ON f.FruitID = od.FruitID` và `GROUP BY f.FruitID, f.FruitName`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT f.FruitID, f.FruitName,
       COUNT(DISTINCT od.OrderID) AS OrderCount,
       SUM(od.Quantity) AS TotalQty
FROM Fruits f
INNER JOIN OrderDetails od ON f.FruitID = od.FruitID
GROUP BY f.FruitID, f.FruitName
ORDER BY OrderCount DESC, f.FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT f.FruitID, f.FruitName,
       COUNT(DISTINCT od.OrderID) AS OrderCount,
       SUM(od.Quantity) AS TotalQty
FROM Fruits f
INNER JOIN OrderDetails od ON f.FruitID = od.FruitID
GROUP BY f.FruitID, f.FruitName
ORDER BY OrderCount DESC, f.FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 10 dòng × 4 cột):**

| FruitID | FruitName | OrderCount | TotalQty |
| :--- | :--- | :--- | :--- |
| 7 | Cherry Đỏ Thẫm | 3 | 4 |
| 5 | Nho Mẫu Đơn Shine Muscat | 2 | 3 |
| 1 | Sầu Riêng Ri6 | 1 | 1 |
| 2 | Bưởi Da Xanh | 1 | 1 |
| 3 | Xoài Cát Hòa Lộc | 1 | 2 |
| 4 | Măng Cụt Lái Thiêu | 1 | 1 |
| 6 | Táo Envy | 1 | 2 |
| 8 | Kiwi Vàng | 1 | 1 |
| 9 | Dâu Tây Mộc Châu | 1 | 1 |
| 10 | Việt Quất (Blueberry) | 1 | 1 |

#### [FS-CH07-06] Bài 7.6: Kết nối bảng trung gian Reviews giữa Customers và Fruits

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B3 - Quan hệ Nhiều-Nhiều qua bảng trung gian Reviews)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Customers (1) ---> (N) Reviews (N) <--- (1) Fruits (Cùng cơ chế N-N nhưng qua bảng Reviews)`
- **Đề bài**: Bảng `Reviews` cũng là một thực thể kết hợp (Associative Entity) nối giữa `Customers` và `Fruits`. Hãy lấy ra `ReviewID`, tên khách hàng (`CustomerName`), tên trái cây (`FruitName`), `Rating` và `Comment`. Sắp xếp theo `ReviewID` tăng dần.
- **Gợi ý tư duy**: Nối `Reviews r` với `Customers c` và `Fruits f`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT r.ReviewID,
       c.FullName AS CustomerName,
       f.FruitName,
       r.Rating, r.Comment
FROM Reviews r
INNER JOIN Customers c ON r.CustomerID = c.CustomerID
INNER JOIN Fruits f ON r.FruitID = f.FruitID
ORDER BY r.ReviewID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT r.ReviewID,
       c.FullName AS CustomerName,
       f.FruitName,
       r.Rating, r.Comment
FROM Reviews r
INNER JOIN Customers c ON r.CustomerID = c.CustomerID
INNER JOIN Fruits f ON r.FruitID = f.FruitID
ORDER BY r.ReviewID ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 5 cột):**

| ReviewID | CustomerName | FruitName | Rating | Comment |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Võ Thành Tài | Nho Mẫu Đơn Shine Muscat | 5 | Nho rất giòn và ngọt, đáng tiền! |
| 2 | Nguyễn Thị Lệ | Xoài Cát Hòa Lộc | 4 | Xoài ngọt nhưng da hơi xấu |
| 3 | Triệu Mẫn | Táo Envy | 5 | Táo Envy chuẩn Mỹ, rất thơm. |
| 4 | Chu Chỉ Nhược | Việt Quất (Blueberry) | 3 | Việt quất hơi chua so với mong đợi. |

#### [FS-CH07-07] Bài 7.7: Kiểm tra tính nhất quán giữa Đơn giá lúc mua (OrderDetails.UnitPrice) và Giá niêm yết hiện tại (Fruits.Price)

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Tại sao cần lưu UnitPrice lịch sử trong OrderDetails thay vì lấy thẳng Fruits.Price?)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `So sánh od.UnitPrice (giá lúc mua) với f.Price (giá danh mục hiện tại)`
- **Đề bài**: Trong thiết kế CSDL chuẩn 3NF cho thương mại điện tử, cột `UnitPrice` trong `OrderDetails` KHÔNG phải là dư thừa vi phạm 3NF mà là **giá lịch sử tại thời điểm chốt đơn**. Hãy viết truy vấn đối chiếu `OrderDetailID`, `OrderID`, `FruitName`, `od.UnitPrice` (giá lúc mua), `f.Price` (giá hiện tại) và độ lệch `PriceDiff = od.UnitPrice - f.Price`. Sắp xếp theo `OrderDetailID` tăng dần.
- **Gợi ý tư duy**: Lấy `od.UnitPrice - f.Price AS PriceDiff` từ phép nối `OrderDetails` và `Fruits`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT od.OrderDetailID, od.OrderID, f.FruitName,
       od.UnitPrice, f.Price,
       (od.UnitPrice - f.Price) AS PriceDiff
FROM OrderDetails od
INNER JOIN Fruits f ON od.FruitID = f.FruitID
ORDER BY od.OrderDetailID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT od.OrderDetailID, od.OrderID, f.FruitName,
       od.UnitPrice, f.Price,
       (od.UnitPrice - f.Price) AS PriceDiff
FROM OrderDetails od
INNER JOIN Fruits f ON od.FruitID = f.FruitID
ORDER BY od.OrderDetailID ASC;
```

**Kết quả kỳ vọng (`expected` — 13 dòng × 6 cột):**

| OrderDetailID | OrderID | FruitName | UnitPrice | Price | PriceDiff |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | Nho Mẫu Đơn Shine Muscat | 850000 | 850000 | 0 |
| 2 | 2 | Xoài Cát Hòa Lộc | 80000 | 80000 | 0 |
| 3 | 2 | Bưởi Da Xanh | 70000 | 70000 | 0 |
| 4 | 3 | Sầu Riêng Ri6 | 150000 | 150000 | 0 |
| 5 | 4 | Táo Envy | 250000 | 250000 | 0 |
| 6 | 4 | Cherry Đỏ Thẫm | 450000 | 450000 | 0 |
| 7 | 5 | Nho Mẫu Đơn Shine Muscat | 850000 | 850000 | 0 |
| 8 | 5 | Cherry Đỏ Thẫm | 450000 | 450000 | 0 |
| 9 | 6 | Việt Quất (Blueberry) | 350000 | 350000 | 0 |
| 10 | 7 | Kiwi Vàng | 180000 | 180000 | 0 |
| 11 | 8 | Dâu Tây Mộc Châu | 200000 | 200000 | 0 |
| 12 | 9 | Cherry Đỏ Thẫm | 450000 | 450000 | 0 |
| 13 | 10 | Măng Cụt Lái Thiêu | 95000 | 95000 | 0 |

#### [FS-CH07-08] Bài 7.8: Kiểm toán chuẩn hóa: Đối chiếu cột TotalAmount lưu sẵn trong Orders với công thức tính từ OrderDetails và Vouchers

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Kiểm toán phụ thuộc hàm & Denormalization có kiểm soát trên cột Orders.TotalAmount)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Đối chiếu Orders.TotalAmount với SUM(OrderDetails.SubTotal) - COALESCE(Vouchers.DiscountAmount, 0)`
- **Đề bài**: Cột `TotalAmount` trên bảng `Orders` là một cột phi chuẩn hóa có chủ đích (Controlled Denormalization) để tăng tốc độ đọc hóa đơn. Hãy viết truy vấn kiểm toán cho cả 10 đơn hàng: Lấy ra `OrderID`, `TotalAmount` (đang lưu trong `Orders`), `GrossTotal` (`SUM(od.SubTotal)`), `Discount` (`COALESCE(v.DiscountAmount, 0)`), và `CalculatedNet` (`SUM(od.SubTotal) - COALESCE(v.DiscountAmount, 0)`). Sắp xếp theo `OrderID` tăng dần.
- **Gợi ý tư duy**: Nối `Orders o` với `OrderDetails od` và `LEFT JOIN Vouchers v`, gom nhóm theo `o.OrderID, o.TotalAmount, v.DiscountAmount`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT o.OrderID, o.TotalAmount,
       SUM(od.SubTotal) AS GrossTotal,
       COALESCE(v.DiscountAmount, 0) AS Discount,
       SUM(od.SubTotal) - COALESCE(v.DiscountAmount, 0) AS CalculatedNet
FROM Orders o
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
LEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID
GROUP BY o.OrderID, o.TotalAmount, v.DiscountAmount
ORDER BY o.OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT o.OrderID, o.TotalAmount,
       SUM(od.SubTotal) AS GrossTotal,
       COALESCE(v.DiscountAmount, 0) AS Discount,
       SUM(od.SubTotal) - COALESCE(v.DiscountAmount, 0) AS CalculatedNet
FROM Orders o
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
LEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID
GROUP BY o.OrderID, o.TotalAmount, v.DiscountAmount
ORDER BY o.OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 10 dòng × 5 cột):**

| OrderID | TotalAmount | GrossTotal | Discount | CalculatedNet |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 850000 | 850000 | 0 | 850000 |
| 2 | 180000 | 230000 | 50000 | 180000 |
| 3 | 150000 | 150000 | 0 | 150000 |
| 4 | 850000 | 950000 | 100000 | 850000 |
| 5 | 2500000 | 2600000 | 100000 | 2500000 |
| 6 | 300000 | 350000 | 50000 | 300000 |
| 7 | 180000 | 180000 | 0 | 180000 |
| 8 | 200000 | 200000 | 0 | 200000 |
| 9 | 400000 | 450000 | 50000 | 400000 |
| 10 | 95000 | 95000 | 0 | 95000 |

#### [FS-CH07-09] Bài 7.9: Kiểm toán đối soát thanh toán: Tìm giao dịch khách đưa dư tiền mặt cần thối lại

- **Cấp độ & Nhóm phản xạ**: `Nâng cao (Đối chiếu giao dịch thanh toán PaymentTransactions với Orders)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Đối chiếu Amount khách trả trong PaymentTransactions với TotalAmount trong Orders để tìm tiền thừa (ChangeAmount)`
- **Đề bài**: Kết nối `PaymentTransactions` với `Orders` để lấy ra `TransactionID`, `OrderID`, `PaymentMethod`, số tiền phải trả (`OrderTotal = o.TotalAmount`), số tiền khách thực trả (`PaidAmount = pt.Amount`), và số tiền thừa cần thối lại cho khách (`ChangeDue = pt.Amount - o.TotalAmount`). Sắp xếp theo `TransactionID` tăng dần.
- **Gợi ý tư duy**: Quan sát đơn hàng số 2 (`OrderTotal = 180000`, khách đưa `'Tiền mặt'` `200000` -> `ChangeDue = 20000`).

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT pt.TransactionID, pt.OrderID, pt.PaymentMethod,
       o.TotalAmount AS OrderTotal,
       pt.Amount AS PaidAmount,
       (pt.Amount - o.TotalAmount) AS ChangeDue
FROM PaymentTransactions pt
INNER JOIN Orders o ON pt.OrderID = o.OrderID
ORDER BY pt.TransactionID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT pt.TransactionID, pt.OrderID, pt.PaymentMethod,
       o.TotalAmount AS OrderTotal,
       pt.Amount AS PaidAmount,
       (pt.Amount - o.TotalAmount) AS ChangeDue
FROM PaymentTransactions pt
INNER JOIN Orders o ON pt.OrderID = o.OrderID
ORDER BY pt.TransactionID ASC;
```

**Kết quả kỳ vọng (`expected` — 6 dòng × 6 cột):**

| TransactionID | OrderID | PaymentMethod | OrderTotal | PaidAmount | ChangeDue |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | VNPAY | 850000 | 850000 | 0 |
| 2 | 2 | Tiền mặt | 180000 | 200000 | 20000 |
| 3 | 3 | Momo | 150000 | 150000 | 0 |
| 4 | 4 | VNPAY | 850000 | 850000 | 0 |
| 5 | 5 | VNPAY | 2500000 | 2500000 | 0 |
| 6 | 6 | Momo | 300000 | 300000 | 0 |

#### [FS-CH07-10] Bài 7.10: Kiểm toán 'Verified Purchase': Kiểm tra xem 4 đánh giá trong bảng Reviews có đúng là của khách đã từng mua loại trái cây đó hay không

- **Cấp độ & Nhóm phản xạ**: `Thực chiến (Kiểm tra vi phạm nghiệp vụ: Khách đánh giá sản phẩm mình chưa từng mua)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Reviews r LEFT JOIN (Orders o JOIN OrderDetails od) -> Kiểm tra Verified Purchase`
- **Đề bài**: Trong thiết kế hệ thống Review chuẩn thương mại điện tử, ta cần gắn nhãn `'Đã mua hàng (Verified)'` nếu khách hàng (`r.CustomerID`) thực sự có ít nhất 1 đơn hàng trong `Orders` + `OrderDetails` chứa đúng `r.FruitID` đó. Hãy lấy ra `ReviewID`, `CustomerID`, `FruitID`, `Rating` và cột `PurchaseStatus` (`'Verified'` nếu tìm thấy trong lịch sử mua, `'Unverified'` nếu không). Sắp xếp theo `ReviewID` tăng dần.
- **Gợi ý tư duy**: Dùng `CASE WHEN EXISTS (SELECT 1 FROM Orders o INNER JOIN OrderDetails od ON o.OrderID = od.OrderID WHERE o.CustomerID = r.CustomerID AND od.FruitID = r.FruitID) THEN 'Verified' ELSE 'Unverified' END`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT r.ReviewID, r.CustomerID, r.FruitID, r.Rating,
       CASE
           WHEN EXISTS (
               SELECT 1
               FROM Orders o
               INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
               WHERE o.CustomerID = r.CustomerID AND od.FruitID = r.FruitID
           ) THEN N'Verified'
           ELSE N'Unverified'
       END AS PurchaseStatus
FROM Reviews r
ORDER BY r.ReviewID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT r.ReviewID, r.CustomerID, r.FruitID, r.Rating,
       CASE
           WHEN EXISTS (
               SELECT 1
               FROM Orders o
               INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
               WHERE o.CustomerID = r.CustomerID AND od.FruitID = r.FruitID
           ) THEN 'Verified'
           ELSE 'Unverified'
       END AS PurchaseStatus
FROM Reviews r
ORDER BY r.ReviewID ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 5 cột):**

| ReviewID | CustomerID | FruitID | Rating | PurchaseStatus |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | 5 | 5 | Verified |
| 2 | 2 | 3 | 4 | Verified |
| 3 | 4 | 6 | 5 | Verified |
| 4 | 5 | 10 | 3 | Verified |

### Chương 8: Chỉ Mục (Index), Cấu Trúc B-Tree, SARGability & Tối Ưu Hóa Truy Vấn

- **Mục tiêu phản xạ của chương**: Rèn phản xạ viết câu truy vấn SARGable (Search Argument Able) tận dụng triệt để B-Tree Index: không bọc hàm lên cột ở vế trái WHERE, không làm toán trên cột lọc, dùng tiền tố LIKE 'abc%' và tạo Composite Covering Index.

#### [FS-CH08-01] Bài 8.1: Tối ưu SARGable cho truy vấn lọc đơn hàng năm 2023 (Bảng Orders)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A1 - Khử hàm ngày tháng ở WHERE sang lọc khoảng ngày SARGable)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Thay YEAR(DateCol) = 2023 bằng DateCol >= '2023-01-01' AND DateCol < '2024-01-01'`
- **Đề bài**: Viết câu truy vấn lấy `OrderID`, `CustomerID`, `OrderDate`, `TotalAmount` của các đơn hàng trong năm `2023` theo chuẩn **SARGable** (dùng toán tử khoảng `OrderDate >= '2023-01-01' AND OrderDate < '2024-01-01'` thay vì bọc hàm `YEAR(OrderDate) = 2023` làm hỏng Index Seek). Sắp xếp theo `OrderDate` tăng dần.
- **Gợi ý tư duy**: Dùng `WHERE OrderDate >= '2023-01-01' AND OrderDate < '2024-01-01'`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT OrderID, CustomerID, OrderDate, TotalAmount
FROM Orders
WHERE OrderDate >= '2023-01-01' AND OrderDate < '2024-01-01'
ORDER BY OrderDate ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT OrderID, CustomerID, OrderDate, TotalAmount
FROM Orders
WHERE OrderDate >= '2023-01-01' AND OrderDate < '2024-01-01'
ORDER BY OrderDate ASC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 4 cột):**

| OrderID | CustomerID | OrderDate | TotalAmount |
| :--- | :--- | :--- | :--- |
| 1 | 1 | 2023-02-14 10:15:00 | 850000 |
| 2 | 2 | 2023-04-20 14:30:00 | 180000 |
| 3 | 3 | 2023-06-15 09:00:00 | 150000 |
| 4 | 4 | 2023-08-08 16:45:00 | 850000 |
| 5 | 1 | 2023-12-24 19:00:00 | 2500000 |

#### [FS-CH08-02] Bài 8.2: Tối ưu SARGable cho truy vấn tìm nhân viên vào làm từ năm 2022 trở đi (Bảng Employees)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A2 - Lọc khoảng ngày SARGable trên bảng Employees)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Thay YEAR(HireDate) >= 2022 bằng HireDate >= '2022-01-01' (Cùng cơ chế Bài 8.1 nhưng trên Employees)`
- **Đề bài**: Áp dụng y hệt phản xạ SARGable ngày tháng của Bài 8.1 trên bảng `Employees`: Lấy ra `EmployeeID`, `FullName`, `Role`, `HireDate` của các nhân viên được tuyển dụng từ ngày `'2022-01-01'` trở đi (`HireDate >= '2022-01-01'`). Sắp xếp theo `HireDate` tăng dần.
- **Gợi ý tư duy**: Không dùng `YEAR(HireDate) >= 2022`, hãy dùng `WHERE HireDate >= '2022-01-01'`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT EmployeeID, FullName, Role, HireDate
FROM Employees
WHERE HireDate >= '2022-01-01'
ORDER BY HireDate ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT EmployeeID, FullName, Role, HireDate
FROM Employees
WHERE HireDate >= '2022-01-01'
ORDER BY HireDate ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 4 cột):**

| EmployeeID | FullName | Role | HireDate |
| :--- | :--- | :--- | :--- |
| 4 | Phạm Văn A | Nhân viên Kho | 2022-01-20 |
| 6 | Hoàng Cúc | Nhân viên Bán hàng | 2022-11-05 |
| 5 | Lý Bạch | Nhân viên Kho | 2023-05-12 |
| 7 | Đinh Hợi | Nhân viên Bán hàng | 2023-08-30 |

#### [FS-CH08-03] Bài 8.3: Tối ưu SARGable cho truy vấn tìm khách hàng đăng ký trong năm 2024 (Bảng Customers)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A3 - Lọc khoảng ngày SARGable trên bảng Customers)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `RegisterDate >= '2024-01-01' AND RegisterDate < '2025-01-01' (Cùng cơ chế Bài 8.1 & 8.2 nhưng trên Customers)`
- **Đề bài**: Tiếp tục phản xạ SARGable ngày tháng trên bảng `Customers`: Lấy ra `CustomerID`, `FullName`, `PhoneNumber`, `RegisterDate` của khách hàng đăng ký trong năm `2024` bằng điều kiện khoảng `RegisterDate >= '2024-01-01' AND RegisterDate < '2025-01-01'`. Sắp xếp theo `CustomerID` tăng dần.
- **Gợi ý tư duy**: Dùng `WHERE RegisterDate >= '2024-01-01' AND RegisterDate < '2025-01-01'`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT CustomerID, FullName, PhoneNumber, RegisterDate
FROM Customers
WHERE RegisterDate >= '2024-01-01' AND RegisterDate < '2025-01-01'
ORDER BY CustomerID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT CustomerID, FullName, PhoneNumber, RegisterDate
FROM Customers
WHERE RegisterDate >= '2024-01-01' AND RegisterDate < '2025-01-01'
ORDER BY CustomerID ASC;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 4 cột):**

| CustomerID | FullName | PhoneNumber | RegisterDate |
| :--- | :--- | :--- | :--- |
| 6 | Ân Ly | 0906666777 | 2024-01-05 |
| 7 | Tiểu Chiêu | 0907777888 | 2024-02-14 |
| 8 | Dương Quá | 0908888999 | 2024-03-10 |

#### [FS-CH08-04] Bài 8.4: Tối ưu SARGable bằng cách chuyển vế toán học khi lọc giá trái cây (Bảng Fruits)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B1 - Khử phép toán trên cột ở vế trái WHERE)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Thay Price * 2 > 500000 bằng Price > 250000`
- **Đề bài**: Một lập trình viên viết `WHERE Price + 50000 >= 300000` khiến SQL Server không thể dùng Index Seek trên cột `Price`. Hãy viết lại câu truy vấn chuẩn SARGable (`WHERE Price >= 250000`) để lấy ra `FruitID`, `FruitName`, `Price` từ bảng `Fruits`, sắp xếp theo `Price` tăng dần.
- **Gợi ý tư duy**: Cô lập cột `Price` đứng một mình ở vế trái: `WHERE Price >= 250000`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, Price
FROM Fruits
WHERE Price >= 250000
ORDER BY Price ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Price
FROM Fruits
WHERE Price >= 250000
ORDER BY Price ASC;
```

**Kết quả kỳ vọng (`expected` — 6 dòng × 3 cột):**

| FruitID | FruitName | Price |
| :--- | :--- | :--- |
| 6 | Táo Envy | 250000 |
| 14 | Hạt Mắc Ca | 280000 |
| 11 | Mâm Xôi Đen | 320000 |
| 10 | Việt Quất (Blueberry) | 350000 |
| 7 | Cherry Đỏ Thẫm | 450000 |
| 5 | Nho Mẫu Đơn Shine Muscat | 850000 |

#### [FS-CH08-05] Bài 8.5: Tối ưu SARGable khi lọc số lượng đặt mua trong OrderDetails

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B2 - Khử phép toán trên cột ở bảng OrderDetails)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Thay Quantity * 10 >= 20 bằng Quantity >= 2 (Cùng cơ chế Bài 8.4 nhưng trên OrderDetails)`
- **Đề bài**: Áp dụng y hệt nguyên tắc cô lập cột ở vế trái của Bài 8.4 trên bảng `OrderDetails`: Thay vì viết `WHERE Quantity * 100 >= 200`, hãy viết truy vấn chuẩn SARGable (`WHERE Quantity >= 2`) lấy ra `OrderDetailID`, `OrderID`, `FruitID`, `Quantity`, `UnitPrice`. Sắp xếp theo `OrderDetailID` tăng dần.
- **Gợi ý tư duy**: Dùng `WHERE Quantity >= 2`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT OrderDetailID, OrderID, FruitID, Quantity, UnitPrice
FROM OrderDetails
WHERE Quantity >= 2
ORDER BY OrderDetailID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT OrderDetailID, OrderID, FruitID, Quantity, UnitPrice
FROM OrderDetails
WHERE Quantity >= 2
ORDER BY OrderDetailID ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 5 cột):**

| OrderDetailID | OrderID | FruitID | Quantity | UnitPrice |
| :--- | :--- | :--- | :--- | :--- |
| 2 | 2 | 3 | 2 | 80000 |
| 5 | 4 | 6 | 2 | 250000 |
| 7 | 5 | 5 | 2 | 850000 |
| 8 | 5 | 7 | 2 | 450000 |

#### [FS-CH08-06] Bài 8.6: Tìm kiếm tiền tố (Prefix Search) tên trái cây bắt đầu bằng chữ 'Nho' (Bảng Fruits)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B3 - Tìm kiếm tiền tố Prefix Search SARGable với LIKE 'abc%')`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `WHERE Col LIKE 'Prefix%' (Tận dụng thứ tự từ điển của B-Tree Index)`
- **Đề bài**: Khi đánh Index trên `FruitName`, điều kiện `LIKE 'Nho%'` (không có `%` ở đầu) vẫn thực hiện được **Index Seek** vì B-Tree sắp xếp theo thứ tự từ điển từ trái sang phải. Hãy lấy ra `FruitID`, `FruitName`, `Price`, `Origin` của các loại trái cây bắt đầu bằng `'Nho'`, sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Dùng `WHERE FruitName LIKE 'Nho%'`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, Price, Origin
FROM Fruits
WHERE FruitName LIKE N'Nho%'
ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Price, Origin
FROM Fruits
WHERE FruitName LIKE 'Nho%'
ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 4 cột):**

| FruitID | FruitName | Price | Origin |
| :--- | :--- | :--- | :--- |
| 5 | Nho Mẫu Đơn Shine Muscat | 850000 | Hàn Quốc |
| 12 | Nho khô Ninh Thuận | 120000 | Ninh Thuận |

#### [FS-CH08-07] Bài 8.7: Tạo Composite Index trên bảng Fruits và chạy truy vấn tuân thủ Leftmost Prefix

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Tạo Non-Clustered Index trên Foreign Key & Kiểm chứng truy vấn)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CREATE INDEX IX_Fruits_CategoryID_Price ON Fruits(CategoryID, Price); SELECT ...;`
- **Đề bài**: Hãy thực hiện lệnh `CREATE INDEX IX_Fruits_Cat_Price ON Fruits(CategoryID, Price);` để tối ưu cho các truy vấn lọc theo `CategoryID` và sắp xếp theo `Price`. Ngay sau đó, viết câu lệnh `SELECT FruitID, FruitName, CategoryID, Price FROM Fruits WHERE CategoryID = 2 ORDER BY Price DESC;`.
- **Gợi ý tư duy**: Gồm 2 câu lệnh: `CREATE INDEX ...;` và `SELECT ... WHERE CategoryID = 2 ORDER BY Price DESC;`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE INDEX IX_Fruits_Cat_Price ON Fruits(CategoryID, Price);
SELECT FruitID, FruitName, CategoryID, Price
FROM Fruits
WHERE CategoryID = 2
ORDER BY Price DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE INDEX IX_Fruits_Cat_Price ON Fruits(CategoryID, Price);
SELECT FruitID, FruitName, CategoryID, Price
FROM Fruits
WHERE CategoryID = 2
ORDER BY Price DESC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 4 cột):**

| FruitID | FruitName | CategoryID | Price |
| :--- | :--- | :--- | :--- |
| 5 | Nho Mẫu Đơn Shine Muscat | 2 | 850000 |
| 7 | Cherry Đỏ Thẫm | 2 | 450000 |
| 6 | Táo Envy | 2 | 250000 |
| 8 | Kiwi Vàng | 2 | 180000 |

#### [FS-CH08-08] Bài 8.8: Tạo Composite Index trên bảng Orders và truy vấn lịch sử đơn hàng của khách VIP số 1

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Tạo Index tối ưu cho bảng Orders theo CustomerID và Status)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CREATE INDEX IX_Orders_Cust_Status ON Orders(CustomerID, Status); SELECT ...;`
- **Đề bài**: Tương tự Bài 8.7, hãy tạo chỉ mục `CREATE INDEX IX_Orders_Cust_Status ON Orders(CustomerID, Status, TotalAmount);` trên bảng `Orders`, sau đó chạy câu lệnh `SELECT OrderID, CustomerID, Status, TotalAmount FROM Orders WHERE CustomerID = 1 AND Status = 'Đã giao' ORDER BY OrderID ASC;`.
- **Gợi ý tư duy**: Việc đưa cả `CustomerID`, `Status` và `TotalAmount` vào Index giúp câu truy vấn đạt trạng thái **Covering Index** (không cần Key Lookup)!

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE INDEX IX_Orders_Cust_Status ON Orders(CustomerID, Status) INCLUDE (TotalAmount);
SELECT OrderID, CustomerID, Status, TotalAmount
FROM Orders
WHERE CustomerID = 1 AND Status = N'Đã giao'
ORDER BY OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE INDEX IX_Orders_Cust_Status ON Orders(CustomerID, Status, TotalAmount);
SELECT OrderID, CustomerID, Status, TotalAmount
FROM Orders
WHERE CustomerID = 1 AND Status = 'Đã giao'
ORDER BY OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 4 cột):**

| OrderID | CustomerID | Status | TotalAmount |
| :--- | :--- | :--- | :--- |
| 1 | 1 | Đã giao | 850000 |
| 5 | 1 | Đã giao | 2500000 |

#### [FS-CH08-09] Bài 8.9: Tối ưu điều kiện OR trên 2 cột khác nhau bằng UNION

- **Cấp độ & Nhóm phản xạ**: `Nâng cao (Thay thế OR gây Table Scan bằng UNION ALL tận dụng 2 Index riêng biệt)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... WHERE ColA = x UNION SELECT ... WHERE ColB = y`
- **Đề bài**: Khi lọc `WHERE CustomerID = 1 OR EmployeeID = 7` trên bảng `Orders`, bộ tối ưu hóa thường phải quét diện rộng. Hãy viết lại bằng toán tử `UNION` (tự động khử trùng các đơn vừa của `CustomerID = 1` vừa do `EmployeeID = 7` phụ trách nếu có) để lấy ra `OrderID`, `CustomerID`, `EmployeeID`, `TotalAmount`. Sắp xếp theo `OrderID` tăng dần.
- **Gợi ý tư duy**: Viết `SELECT OrderID, CustomerID, EmployeeID, TotalAmount FROM Orders WHERE CustomerID = 1 UNION SELECT OrderID, CustomerID, EmployeeID, TotalAmount FROM Orders WHERE EmployeeID = 7 ORDER BY OrderID ASC;`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT OrderID, CustomerID, EmployeeID, TotalAmount
FROM Orders
WHERE CustomerID = 1
UNION
SELECT OrderID, CustomerID, EmployeeID, TotalAmount
FROM Orders
WHERE EmployeeID = 7
ORDER BY OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT OrderID, CustomerID, EmployeeID, TotalAmount
FROM Orders
WHERE CustomerID = 1
UNION
SELECT OrderID, CustomerID, EmployeeID, TotalAmount
FROM Orders
WHERE EmployeeID = 7
ORDER BY OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 7 dòng × 4 cột):**

| OrderID | CustomerID | EmployeeID | TotalAmount |
| :--- | :--- | :--- | :--- |
| 1 | 1 | 6 | 850000 |
| 3 | 3 | 7 | 150000 |
| 4 | 4 | 7 | 850000 |
| 5 | 1 | 6 | 2500000 |
| 6 | 5 | 7 | 300000 |
| 8 | 1 | 6 | 200000 |
| 9 | 4 | 7 | 400000 |

#### [FS-CH08-10] Bài 8.10: Thiết kế Covering Index cho báo cáo doanh thu theo Phương thức thanh toán

- **Cấp độ & Nhóm phản xạ**: `Thực chiến (Kiểm tra danh sách Index trong Metadata hệ thống hoặc Covering Query)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Truy vấn chỉ lấy đúng các cột nằm trong Covering Index để đạt Index-Only Scan`
- **Đề bài**: Hãy tạo chỉ mục bao phủ `CREATE INDEX IX_Payment_Covering ON PaymentTransactions(PaymentMethod, Amount);` rồi thực thi truy vấn thống kê `SELECT PaymentMethod, COUNT(*) AS TxCount, SUM(Amount) AS TotalAmount FROM PaymentTransactions WHERE PaymentMethod IN ('VNPAY', 'Momo') GROUP BY PaymentMethod ORDER BY TotalAmount DESC;`.
- **Gợi ý tư duy**: Khi mọi cột trong `SELECT`, `WHERE`, `GROUP BY` đều nằm trong `IX_Payment_Covering`, Engine chỉ cần đọc lá của Index mà không cần chạm vào bảng gốc!

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE INDEX IX_Payment_Covering ON PaymentTransactions(PaymentMethod) INCLUDE (Amount);
SELECT PaymentMethod, COUNT(*) AS TxCount, SUM(Amount) AS TotalAmount
FROM PaymentTransactions
WHERE PaymentMethod IN (N'VNPAY', N'Momo')
GROUP BY PaymentMethod
ORDER BY TotalAmount DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE INDEX IX_Payment_Covering ON PaymentTransactions(PaymentMethod, Amount);
SELECT PaymentMethod, COUNT(*) AS TxCount, SUM(Amount) AS TotalAmount
FROM PaymentTransactions
WHERE PaymentMethod IN ('VNPAY', 'Momo')
GROUP BY PaymentMethod
ORDER BY TotalAmount DESC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 3 cột):**

| PaymentMethod | TxCount | TotalAmount |
| :--- | :--- | :--- |
| VNPAY | 3 | 4200000 |
| Momo | 2 | 450000 |

### Chương 9: Giao Dịch (Transactions), ACID, Isolation Levels & Phòng Chống Deadlock

- **Mục tiêu phản xạ của chương**: Rèn phản xạ đóng gói chuỗi thao tác nghiệp vụ (trừ kho, tăng lượt dùng voucher, ghi nhận thanh toán, hủy đơn hoàn kho) vào trong một Transaction nguyên tử (Atomicity) đảm bảo tính nhất quán (Consistency).

#### [FS-CH09-01] Bài 9.1: Giao dịch xác nhận thanh toán cho Đơn hàng số 9 (Orders + PaymentTransactions)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A1 - Giao dịch nguyên tử cập nhật 2 bảng liên quan)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `BEGIN TRANSACTION; UPDATE TableA ...; INSERT INTO TableB ...; COMMIT; SELECT ...;`
- **Đề bài**: Đơn hàng `OrderID = 9` (`TotalAmount = 400000`, đang `'Chờ xử lý'`) vừa được khách thanh toán qua `'VNPAY'`. Trong một giao dịch: (1) Cập nhật `Status = 'Đã giao'` cho `OrderID = 9` trong bảng `Orders`, (2) Thêm bản ghi thanh toán vào `PaymentTransactions` (`OrderID = 9`, `PaymentMethod = 'VNPAY'`, `Amount = 400000`, `PaymentDate = '2024-03-05 10:05:00'`), sau đó `SELECT o.OrderID, o.Status, pt.PaymentMethod, pt.Amount FROM Orders o INNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID WHERE o.OrderID = 9;`.
- **Gợi ý tư duy**: Thực hiện tuần tự `UPDATE Orders ...; INSERT INTO PaymentTransactions ...; SELECT ...;`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
BEGIN TRANSACTION;
UPDATE Orders SET Status = N'Đã giao' WHERE OrderID = 9;
INSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate)
VALUES (9, N'VNPAY', 400000, '2024-03-05 10:05:00');
COMMIT TRANSACTION;
SELECT o.OrderID, o.Status, pt.PaymentMethod, pt.Amount
FROM Orders o
INNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID
WHERE o.OrderID = 9;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
BEGIN TRANSACTION;
UPDATE Orders SET Status = 'Đã giao' WHERE OrderID = 9;
INSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate)
VALUES (9, 'VNPAY', 400000, '2024-03-05 10:05:00');
COMMIT;
SELECT o.OrderID, o.Status, pt.PaymentMethod, pt.Amount
FROM Orders o
INNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID
WHERE o.OrderID = 9;
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 4 cột):**

| OrderID | Status | PaymentMethod | Amount |
| :--- | :--- | :--- | :--- |
| 9 | Đã giao | VNPAY | 400000 |

#### [FS-CH09-02] Bài 9.2: Giao dịch xác nhận thanh toán Tiền mặt cho Đơn hàng số 10

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A2 - Giao dịch thanh toán cho Đơn hàng số 10)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `BEGIN TRANSACTION; UPDATE Orders ...; INSERT INTO PaymentTransactions ...; COMMIT; (Cùng cơ chế Bài 9.1 nhưng cho Đơn số 10)`
- **Đề bài**: Áp dụng y hệt quy trình Transaction của Bài 9.1 cho `OrderID = 10` (`TotalAmount = 95000`): (1) Cập nhật `Status = 'Đã giao'` cho `OrderID = 10`, (2) Thêm giao dịch vào `PaymentTransactions` với `OrderID = 10`, `PaymentMethod = 'Tiền mặt'`, `Amount = 95000`, `PaymentDate = '2024-03-10 14:05:00'`, (3) `COMMIT` và truy vấn `SELECT o.OrderID, o.Status, pt.PaymentMethod, pt.Amount FROM Orders o INNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID WHERE o.OrderID = 10;`.
- **Gợi ý tư duy**: Thay `OrderID = 10`, `PaymentMethod = 'Tiền mặt'`, `Amount = 95000`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
BEGIN TRANSACTION;
UPDATE Orders SET Status = N'Đã giao' WHERE OrderID = 10;
INSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate)
VALUES (10, N'Tiền mặt', 95000, '2024-03-10 14:05:00');
COMMIT TRANSACTION;
SELECT o.OrderID, o.Status, pt.PaymentMethod, pt.Amount
FROM Orders o
INNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID
WHERE o.OrderID = 10;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
BEGIN TRANSACTION;
UPDATE Orders SET Status = 'Đã giao' WHERE OrderID = 10;
INSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate)
VALUES (10, 'Tiền mặt', 95000, '2024-03-10 14:05:00');
COMMIT;
SELECT o.OrderID, o.Status, pt.PaymentMethod, pt.Amount
FROM Orders o
INNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID
WHERE o.OrderID = 10;
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 4 cột):**

| OrderID | Status | PaymentMethod | Amount |
| :--- | :--- | :--- | :--- |
| 10 | Đã giao | Tiền mặt | 95000 |

#### [FS-CH09-03] Bài 9.3: Giao dịch áp mã giảm giá WELCOME50 cho Đơn hàng số 8

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A3 - Giao dịch áp dụng Voucher vào Đơn hàng số 8)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `BEGIN TRANSACTION; UPDATE Vouchers ...; UPDATE Orders ...; COMMIT; (Cùng cơ chế Transaction 2 bảng trên Vouchers & Orders)`
- **Đề bài**: Đơn hàng `OrderID = 8` (`TotalAmount = 200000`, `VoucherID IS NULL`) đủ điều kiện áp mã `'WELCOME50'` (`VoucherID = 1`, giảm `50000`). Trong 1 Transaction: (1) Tăng `UsedCount = UsedCount + 1` cho `VoucherID = 1` trong bảng `Vouchers`, (2) Cập nhật `VoucherID = 1` và `TotalAmount = TotalAmount - 50000` cho `OrderID = 8` trong bảng `Orders`, (3) `COMMIT` và `SELECT o.OrderID, o.VoucherID, o.TotalAmount, v.UsedCount FROM Orders o INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID WHERE o.OrderID = 8;`.
- **Gợi ý tư duy**: Cả 2 bước tăng `UsedCount` và giảm `TotalAmount` phải nằm trong cùng một Transaction để đảm bảo tính Nhất quán (Consistency).

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
BEGIN TRANSACTION;
UPDATE Vouchers SET UsedCount = UsedCount + 1 WHERE VoucherID = 1 AND UsedCount < UsageLimit;
UPDATE Orders SET VoucherID = 1, TotalAmount = TotalAmount - 50000 WHERE OrderID = 8;
COMMIT TRANSACTION;
SELECT o.OrderID, o.VoucherID, o.TotalAmount, v.UsedCount
FROM Orders o
INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID
WHERE o.OrderID = 8;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
BEGIN TRANSACTION;
UPDATE Vouchers SET UsedCount = UsedCount + 1 WHERE VoucherID = 1 AND UsedCount < UsageLimit;
UPDATE Orders SET VoucherID = 1, TotalAmount = TotalAmount - 50000 WHERE OrderID = 8;
COMMIT;
SELECT o.OrderID, o.VoucherID, o.TotalAmount, v.UsedCount
FROM Orders o
INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID
WHERE o.OrderID = 8;
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 4 cột):**

| OrderID | VoucherID | TotalAmount | UsedCount |
| :--- | :--- | :--- | :--- |
| 8 | 1 | 150000 | 251 |

#### [FS-CH09-04] Bài 9.4: Kiểm chứng tính Nguyên tử (Atomicity): Thử cập nhật nhầm giá toàn bộ bảng Fruits rồi ROLLBACK

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B1 - Kiểm chứng ROLLBACK khôi phục trạng thái ban đầu)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `BEGIN TRANSACTION; UPDATE/DELETE ...; ROLLBACK; SELECT ...;`
- **Đề bài**: Hãy mở `BEGIN TRANSACTION;`, thực hiện lệnh cập nhật nhầm `UPDATE Fruits SET Price = 0;` (quên `WHERE`), sau đó gọi ngay `ROLLBACK;` để hủy bỏ giao dịch. Cuối cùng `SELECT FruitID, FruitName, Price FROM Fruits WHERE CategoryID = 1 ORDER BY FruitID ASC;` để chứng minh dữ liệu vẫn nguyên vẹn 100%.
- **Gợi ý tư duy**: Sau lệnh `ROLLBACK;`, mọi thay đổi bên trong `BEGIN TRANSACTION` đều được hoàn tác sạch sẽ.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
BEGIN TRANSACTION;
UPDATE Fruits SET Price = 0;
ROLLBACK TRANSACTION;
SELECT FruitID, FruitName, Price FROM Fruits WHERE CategoryID = 1 ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
BEGIN TRANSACTION;
UPDATE Fruits SET Price = 0;
ROLLBACK;
SELECT FruitID, FruitName, Price FROM Fruits WHERE CategoryID = 1 ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 3 cột):**

| FruitID | FruitName | Price |
| :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | 150000 |
| 2 | Bưởi Da Xanh | 70000 |
| 3 | Xoài Cát Hòa Lộc | 80000 |
| 4 | Măng Cụt Lái Thiêu | 95000 |

#### [FS-CH09-05] Bài 9.5: Kiểm chứng ROLLBACK khi lỡ tay xóa các đơn hàng Chờ xử lý

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B2 - Kiểm chứng ROLLBACK khi xóa nhầm trên bảng Orders)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `BEGIN TRANSACTION; DELETE ...; ROLLBACK; SELECT ...; (Cùng cơ chế Bài 9.4 nhưng trên Orders)`
- **Đề bài**: Áp dụng y hệt phản xạ `BEGIN TRANSACTION ... ROLLBACK` của Bài 9.4 trên bảng `Orders`: Bắt đầu giao dịch, chạy lệnh `DELETE FROM Orders WHERE Status = 'Chờ xử lý';`, sau đó gọi `ROLLBACK;` và truy vấn `SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE Status = 'Chờ xử lý' ORDER BY OrderID ASC;`.
- **Gợi ý tư duy**: Nhờ `ROLLBACK;`, hai đơn hàng số 9 và số 10 vẫn còn nguyên vẹn.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
BEGIN TRANSACTION;
DELETE FROM Orders WHERE Status = N'Chờ xử lý';
ROLLBACK TRANSACTION;
SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE Status = N'Chờ xử lý' ORDER BY OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
BEGIN TRANSACTION;
DELETE FROM Orders WHERE Status = 'Chờ xử lý';
ROLLBACK;
SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE Status = 'Chờ xử lý' ORDER BY OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 4 cột):**

| OrderID | CustomerID | TotalAmount | Status |
| :--- | :--- | :--- | :--- |
| 9 | 4 | 400000 | Chờ xử lý |
| 10 | 7 | 95000 | Chờ xử lý |

#### [FS-CH09-06] Bài 9.6: Sử dụng SAVEPOINT để giữ lại thao tác đúng và chỉ Rollback thao tác sai

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B3 - Sử dụng SAVEPOINT để Rollback một phần giao dịch)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `BEGIN; UPDATE 1; SAVEPOINT sp1; UPDATE 2 (sai); ROLLBACK TO sp1; COMMIT;`
- **Đề bài**: Trong một Transaction: (1) Nhập thêm `20` quả cho `FruitID = 1` (`StockQuantity = StockQuantity + 20`), (2) Đặt điểm lưu `SAVEPOINT sp_after_durian;`, (3) Trừ nhầm tồn kho của `FruitID = 2` đi `100` quả (`StockQuantity = StockQuantity - 100`), (4) Quay lui về điểm lưu `ROLLBACK TO sp_after_durian;`, (5) `COMMIT;` và `SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID IN (1, 2) ORDER BY FruitID ASC;`.
- **Gợi ý tư duy**: Kết quả sau `COMMIT`: `FruitID = 1` tăng từ 50 lên `70`, còn `FruitID = 2` vẫn giữ nguyên `120`!

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
BEGIN TRANSACTION;
UPDATE Fruits SET StockQuantity = StockQuantity + 20 WHERE FruitID = 1;
SAVE TRANSACTION sp_after_durian;
UPDATE Fruits SET StockQuantity = StockQuantity - 100 WHERE FruitID = 2;
ROLLBACK TRANSACTION sp_after_durian;
COMMIT TRANSACTION;
SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID IN (1, 2) ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
BEGIN TRANSACTION;
UPDATE Fruits SET StockQuantity = StockQuantity + 20 WHERE FruitID = 1;
SAVEPOINT sp_after_durian;
UPDATE Fruits SET StockQuantity = StockQuantity - 100 WHERE FruitID = 2;
ROLLBACK TO sp_after_durian;
COMMIT;
SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID IN (1, 2) ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 3 cột):**

| FruitID | FruitName | StockQuantity |
| :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | 70 |
| 2 | Bưởi Da Xanh | 120 |

#### [FS-CH09-07] Bài 9.7: Giao dịch Hủy đơn hàng số 9: Cập nhật trạng thái, hoàn tồn kho và hoàn lượt Voucher

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Giao dịch Hủy đơn hàng: Hoàn trả tồn kho & Hoàn trả lượt Voucher)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Hủy OrderID = 9 -> Cộng lại StockQuantity cho FruitID = 7 -> Giảm UsedCount của VoucherID = 1`
- **Đề bài**: Khách hàng yêu cầu hủy đơn `OrderID = 9` (đang `'Chờ xử lý'`, có dùng `VoucherID = 1`, đặt mua `1` kg `FruitID = 7` Cherry Đỏ Thẫm). Hãy viết Transaction thực hiện: (1) Đổi `Status = 'Đã hủy'` cho `OrderID = 9`, (2) Hoàn trả `+1` vào `StockQuantity` cho `FruitID = 7`, (3) Giảm `UsedCount = UsedCount - 1` cho `VoucherID = 1`, (4) `COMMIT` và `SELECT o.OrderID, o.Status, f.StockQuantity AS CherryStock, v.UsedCount AS VoucherUsed FROM Orders o INNER JOIN OrderDetails od ON o.OrderID = od.OrderID INNER JOIN Fruits f ON od.FruitID = f.FruitID INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID WHERE o.OrderID = 9;`.
- **Gợi ý tư duy**: Thực hiện đủ 3 lệnh `UPDATE` trên `Orders`, `Fruits`, `Vouchers` trước khi `COMMIT`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
BEGIN TRANSACTION;
UPDATE Orders SET Status = N'Đã hủy' WHERE OrderID = 9;
UPDATE Fruits SET StockQuantity = StockQuantity + 1 WHERE FruitID = 7;
UPDATE Vouchers SET UsedCount = UsedCount - 1 WHERE VoucherID = 1;
COMMIT TRANSACTION;
SELECT o.OrderID, o.Status, f.StockQuantity AS CherryStock, v.UsedCount AS VoucherUsed
FROM Orders o
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
INNER JOIN Fruits f ON od.FruitID = f.FruitID
INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID
WHERE o.OrderID = 9;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
BEGIN TRANSACTION;
UPDATE Orders SET Status = 'Đã hủy' WHERE OrderID = 9;
UPDATE Fruits SET StockQuantity = StockQuantity + 1 WHERE FruitID = 7;
UPDATE Vouchers SET UsedCount = UsedCount - 1 WHERE VoucherID = 1;
COMMIT;
SELECT o.OrderID, o.Status, f.StockQuantity AS CherryStock, v.UsedCount AS VoucherUsed
FROM Orders o
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
INNER JOIN Fruits f ON od.FruitID = f.FruitID
INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID
WHERE o.OrderID = 9;
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 4 cột):**

| OrderID | Status | CherryStock | VoucherUsed |
| :--- | :--- | :--- | :--- |
| 9 | Đã hủy | 31 | 249 |

#### [FS-CH09-08] Bài 9.8: Chống bán âm kho (Anti-Overselling) bằng Atomic Guard Condition trong UPDATE

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Phòng chống Lost Update / Overselling bằng điều kiện gác cổng nguyên tử)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `UPDATE Fruits SET StockQuantity = StockQuantity - @Qty WHERE FruitID = @ID AND StockQuantity >= @Qty`
- **Đề bài**: Để chống lỗi 2 giao dịch cùng đọc `StockQuantity = 15` của Nho Mẫu Đơn (`FruitID = 5`) rồi cùng trừ kho gây âm kho, ta đặt điều kiện gác cổng ngay trong `UPDATE`: Hãy thử trừ `20` chùm cho `FruitID = 5` với điều kiện `AND StockQuantity >= 20` (sẽ không trừ vì tồn kho chỉ có 15), và trừ `5` chùm cho `FruitID = 5` với điều kiện `AND StockQuantity >= 5` (thành công, còn 10). Cuối cùng `SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID = 5;`.
- **Gợi ý tư duy**: Câu lệnh `UPDATE` thứ nhất có `WHERE FruitID = 5 AND StockQuantity >= 20` sẽ tác động 0 dòng một cách an toàn mà không làm hỏng dữ liệu!

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
BEGIN TRANSACTION;
UPDATE Fruits SET StockQuantity = StockQuantity - 20 WHERE FruitID = 5 AND StockQuantity >= 20;
UPDATE Fruits SET StockQuantity = StockQuantity - 5 WHERE FruitID = 5 AND StockQuantity >= 5;
COMMIT TRANSACTION;
SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID = 5;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
BEGIN TRANSACTION;
UPDATE Fruits SET StockQuantity = StockQuantity - 20 WHERE FruitID = 5 AND StockQuantity >= 20;
UPDATE Fruits SET StockQuantity = StockQuantity - 5 WHERE FruitID = 5 AND StockQuantity >= 5;
COMMIT;
SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID = 5;
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 3 cột):**

| FruitID | FruitName | StockQuantity |
| :--- | :--- | :--- |
| 5 | Nho Mẫu Đơn Shine Muscat | 10 |

#### [FS-CH09-09] Bài 9.9: Thực thi cập nhật nhiều mặt hàng theo thứ tự FruitID tăng dần để triệt tiêu nguy cơ Deadlock

- **Cấp độ & Nhóm phản xạ**: `Nâng cao (Quy tắc khóa theo thứ tự Lock Ordering chống Cycle Deadlock)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Luôn cập nhật các dòng trong cùng bảng theo thứ tự khóa chính tăng dần (FruitID = 1 trước, FruitID = 5 sau)`
- **Đề bài**: Khi một đơn hàng mua nhiều mặt hàng (ví dụ `FruitID = 5` và `FruitID = 1`), để hai Transaction không khóa chéo nhau gây Deadlock, quy tắc vàng là luôn khóa theo thứ tự `FruitID` tăng dần. Hãy viết một lệnh `UPDATE` duy nhất (hoặc theo thứ tự ID nhỏ đến lớn) giảm `StockQuantity` đi `2` đơn vị cho cả `FruitID = 1` và `FruitID = 5` khi `StockQuantity >= 2`, sau đó `SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID IN (1, 5) ORDER BY FruitID ASC;`.
- **Gợi ý tư duy**: Dùng `UPDATE Fruits SET StockQuantity = StockQuantity - 2 WHERE FruitID IN (1, 5) AND StockQuantity >= 2;`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
BEGIN TRANSACTION;
UPDATE Fruits
SET StockQuantity = StockQuantity - 2
WHERE FruitID IN (1, 5) AND StockQuantity >= 2;
COMMIT TRANSACTION;
SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID IN (1, 5) ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
BEGIN TRANSACTION;
UPDATE Fruits
SET StockQuantity = StockQuantity - 2
WHERE FruitID IN (1, 5) AND StockQuantity >= 2;
COMMIT;
SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID IN (1, 5) ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 3 cột):**

| FruitID | FruitName | StockQuantity |
| :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | 48 |
| 5 | Nho Mẫu Đơn Shine Muscat | 13 |

#### [FS-CH09-10] Bài 9.10: Quy trình Transaction Đặt hàng End-to-End cho khách hàng Dương Quá (CustomerID = 8)

- **Cấp độ & Nhóm phản xạ**: `Thực chiến (Giao dịch Đặt hàng trọn vẹn End-to-End cho khách hàng Dương Quá)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Tạo Order -> Thêm OrderDetails -> Trừ kho Fruits -> Ghi PaymentTransactions -> COMMIT`
- **Đề bài**: Khách hàng `'Dương Quá'` (`CustomerID = 8`, trước giờ chưa mua đơn nào) đặt mua `2` hũ `'Hạt Mắc Ca'` (`FruitID = 14`, đơn giá `280000`, thành tiền `560000`), áp mã `'VIP100'` (`VoucherID = 2`, giảm `100000` còn `460000`), do nhân viên `EmployeeID = 6` phụ trách. Hãy thực hiện trọn vẹn trong Transaction: (1) `INSERT INTO Orders` (`OrderID = 11`, `CustomerID = 8`, `EmployeeID = 6`, `VoucherID = 2`, `OrderDate = '2024-03-15 09:00:00'`, `TotalAmount = 460000`, `Status = 'Đã giao'`), (2) `INSERT INTO OrderDetails` (`OrderID = 11`, `FruitID = 14`, `Quantity = 2`, `UnitPrice = 280000`), (3) Trừ `StockQuantity` đi `2` cho `FruitID = 14`, (4) Cộng `UsedCount` thêm `1` cho `VoucherID = 2`, rồi `SELECT o.OrderID, c.FullName, o.TotalAmount, f.StockQuantity AS RemainingMacca, v.UsedCount AS VipVoucherUsed FROM Orders o INNER JOIN Customers c ON o.CustomerID = c.CustomerID INNER JOIN OrderDetails od ON o.OrderID = od.OrderID INNER JOIN Fruits f ON od.FruitID = f.FruitID INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID WHERE o.OrderID = 11;`.
- **Gợi ý tư duy**: Thực hiện tuần tự 4 bước trong Transaction rồi `SELECT` kiểm tra kết quả của `OrderID = 11`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
BEGIN TRANSACTION;
INSERT INTO Orders (CustomerID, EmployeeID, VoucherID, OrderDate, TotalAmount, Status)
VALUES (8, 6, 2, '2024-03-15 09:00:00', 460000, N'Đã giao');
INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice)
VALUES (11, 14, 2, 280000);
UPDATE Fruits SET StockQuantity = StockQuantity - 2 WHERE FruitID = 14;
UPDATE Vouchers SET UsedCount = UsedCount + 1 WHERE VoucherID = 2;
COMMIT TRANSACTION;
SELECT o.OrderID, c.FullName, o.TotalAmount, f.StockQuantity AS RemainingMacca, v.UsedCount AS VipVoucherUsed
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
INNER JOIN Fruits f ON od.FruitID = f.FruitID
INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID
WHERE o.OrderID = 11;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
BEGIN TRANSACTION;
INSERT INTO Orders (OrderID, CustomerID, EmployeeID, VoucherID, OrderDate, TotalAmount, Status)
VALUES (11, 8, 6, 2, '2024-03-15 09:00:00', 460000, 'Đã giao');
INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice)
VALUES (11, 14, 2, 280000);
UPDATE Fruits SET StockQuantity = StockQuantity - 2 WHERE FruitID = 14;
UPDATE Vouchers SET UsedCount = UsedCount + 1 WHERE VoucherID = 2;
COMMIT;
SELECT o.OrderID, c.FullName, o.TotalAmount, f.StockQuantity AS RemainingMacca, v.UsedCount AS VipVoucherUsed
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
INNER JOIN Fruits f ON od.FruitID = f.FruitID
INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID
WHERE o.OrderID = 11;
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 5 cột):**

| OrderID | FullName | TotalAmount | RemainingMacca | VipVoucherUsed |
| :--- | :--- | :--- | :--- | :--- |
| 11 | Dương Quá | 460000 | 88 | 6 |

### Chương 10: Views, Stored Procedures, Triggers & Bảng Tạm (Temp Tables)

- **Mục tiêu phản xạ của chương**: Rèn phản xạ đóng gói truy vấn phức tạp thành View (CREATE VIEW), viết Trigger tự động kiểm soát nghiệp vụ (CREATE TRIGGER) và dùng Bảng tạm (Temp Table) để xử lý báo cáo đa bước.

#### [FS-CH10-01] Bài 10.1: Tạo View vw_ActiveFruitCatalog hiển thị bảng giá trái cây kèm tên danh mục

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A1 - Tạo View danh mục sản phẩm & Truy vấn từ View)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CREATE VIEW vw_Name AS SELECT ...; SELECT * FROM vw_Name ...;`
- **Đề bài**: Hãy tạo một View tên là `vw_ActiveFruitCatalog` kết nối `Fruits` và `Categories` để lấy ra `FruitID`, `FruitName`, `CategoryName`, `Price`, `Unit`, `StockQuantity` của các mặt hàng đang còn tồn kho (`StockQuantity > 0`). Sau đó truy vấn `SELECT FruitID, FruitName, CategoryName, Price FROM vw_ActiveFruitCatalog WHERE Price >= 250000 ORDER BY Price DESC;`.
- **Gợi ý tư duy**: Dùng `CREATE VIEW vw_ActiveFruitCatalog AS SELECT ...;` rồi `SELECT` từ chính View vừa tạo.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE VIEW vw_ActiveFruitCatalog AS
SELECT f.FruitID, f.FruitName, c.CategoryName, f.Price, f.Unit, f.StockQuantity
FROM Fruits f
INNER JOIN Categories c ON f.CategoryID = c.CategoryID
WHERE f.StockQuantity > 0;
GO
SELECT FruitID, FruitName, CategoryName, Price
FROM vw_ActiveFruitCatalog
WHERE Price >= 250000
ORDER BY Price DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE VIEW vw_ActiveFruitCatalog AS
SELECT f.FruitID, f.FruitName, c.CategoryName, f.Price, f.Unit, f.StockQuantity
FROM Fruits f
INNER JOIN Categories c ON f.CategoryID = c.CategoryID
WHERE f.StockQuantity > 0;
SELECT FruitID, FruitName, CategoryName, Price
FROM vw_ActiveFruitCatalog
WHERE Price >= 250000
ORDER BY Price DESC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 4 cột):**

| FruitID | FruitName | CategoryName | Price |
| :--- | :--- | :--- | :--- |
| 5 | Nho Mẫu Đơn Shine Muscat | Trái cây Nhập khẩu | 850000 |
| 7 | Cherry Đỏ Thẫm | Trái cây Nhập khẩu | 450000 |
| 10 | Việt Quất (Blueberry) | Quả mọng (Berries) | 350000 |
| 14 | Hạt Mắc Ca | Quả hạch (Nuts) | 280000 |
| 6 | Táo Envy | Trái cây Nhập khẩu | 250000 |

#### [FS-CH10-02] Bài 10.2: Tạo View vw_OrderSummary đóng gói thông tin Đơn hàng, Khách hàng và Nhân viên

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A2 - Tạo View tóm tắt hóa đơn khách hàng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CREATE VIEW vw_Name AS SELECT ...; SELECT * FROM vw_Name ...; (Cùng cơ chế Bài 10.1 nhưng trên Orders & Customers)`
- **Đề bài**: Áp dụng y hệt cơ chế tạo View của Bài 10.1: Tạo View `vw_OrderSummary` nối `Orders o`, `Customers c` và `Employees e` gồm các cột: `OrderID`, `CustomerName` (`c.FullName`), `CustomerType`, `SalesPerson` (`e.FullName`), `OrderDate`, `TotalAmount`, `Status`. Sau đó truy vấn `SELECT OrderID, CustomerName, SalesPerson, TotalAmount FROM vw_OrderSummary WHERE CustomerType = 'VIP' ORDER BY OrderID ASC;`.
- **Gợi ý tư duy**: Nhờ View `vw_OrderSummary`, ứng dụng chỉ cần `SELECT` 1 dòng đơn giản mà không phải viết lại 2 phép `INNER JOIN`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE VIEW vw_OrderSummary AS
SELECT o.OrderID, c.FullName AS CustomerName, c.CustomerType,
       e.FullName AS SalesPerson, o.OrderDate, o.TotalAmount, o.Status
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
INNER JOIN Employees e ON o.EmployeeID = e.EmployeeID;
GO
SELECT OrderID, CustomerName, SalesPerson, TotalAmount
FROM vw_OrderSummary
WHERE CustomerType = N'VIP'
ORDER BY OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE VIEW vw_OrderSummary AS
SELECT o.OrderID, c.FullName AS CustomerName, c.CustomerType,
       e.FullName AS SalesPerson, o.OrderDate, o.TotalAmount, o.Status
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
INNER JOIN Employees e ON o.EmployeeID = e.EmployeeID;
SELECT OrderID, CustomerName, SalesPerson, TotalAmount
FROM vw_OrderSummary
WHERE CustomerType = 'VIP'
ORDER BY OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 4 cột):**

| OrderID | CustomerName | SalesPerson | TotalAmount |
| :--- | :--- | :--- | :--- |
| 1 | Võ Thành Tài | Hoàng Cúc | 850000 |
| 4 | Triệu Mẫn | Đinh Hợi | 850000 |
| 5 | Võ Thành Tài | Hoàng Cúc | 2500000 |
| 8 | Võ Thành Tài | Hoàng Cúc | 200000 |
| 9 | Triệu Mẫn | Đinh Hợi | 400000 |

#### [FS-CH10-03] Bài 10.3: Tạo View vw_FruitRatingStats tổng hợp điểm đánh giá trung bình của từng loại trái cây

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A3 - Tạo View thống kê điểm đánh giá sản phẩm)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CREATE VIEW vw_Name AS SELECT ... GROUP BY ...; SELECT * FROM vw_Name; (Cùng cơ chế View nhưng chứa GROUP BY)`
- **Đề bài**: Tiếp tục phản xạ tạo View: Tạo `vw_FruitRatingStats` nối `Fruits f` với `Reviews r` (`INNER JOIN`), gom nhóm theo `f.FruitID, f.FruitName` để tính `ReviewCount = COUNT(r.ReviewID)` và `AvgRating = ROUND(AVG(r.Rating * 1.0), 2)`. Sau đó truy vấn `SELECT FruitID, FruitName, ReviewCount, AvgRating FROM vw_FruitRatingStats ORDER BY AvgRating DESC, FruitID ASC;`.
- **Gợi ý tư duy**: Gom nhóm `GROUP BY f.FruitID, f.FruitName` bên trong định nghĩa `CREATE VIEW`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE VIEW vw_FruitRatingStats AS
SELECT f.FruitID, f.FruitName,
       COUNT(r.ReviewID) AS ReviewCount,
       ROUND(AVG(CAST(r.Rating AS FLOAT)), 2) AS AvgRating
FROM Fruits f
INNER JOIN Reviews r ON f.FruitID = r.FruitID
GROUP BY f.FruitID, f.FruitName;
GO
SELECT FruitID, FruitName, ReviewCount, AvgRating
FROM vw_FruitRatingStats
ORDER BY AvgRating DESC, FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE VIEW vw_FruitRatingStats AS
SELECT f.FruitID, f.FruitName,
       COUNT(r.ReviewID) AS ReviewCount,
       ROUND(AVG(r.Rating * 1.0), 2) AS AvgRating
FROM Fruits f
INNER JOIN Reviews r ON f.FruitID = r.FruitID
GROUP BY f.FruitID, f.FruitName;
SELECT FruitID, FruitName, ReviewCount, AvgRating
FROM vw_FruitRatingStats
ORDER BY AvgRating DESC, FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 4 cột):**

| FruitID | FruitName | ReviewCount | AvgRating |
| :--- | :--- | :--- | :--- |
| 5 | Nho Mẫu Đơn Shine Muscat | 1 | 5.0 |
| 6 | Táo Envy | 1 | 5.0 |
| 3 | Xoài Cát Hòa Lộc | 1 | 4.0 |
| 10 | Việt Quất (Blueberry) | 1 | 3.0 |

#### [FS-CH10-04] Bài 10.4: Tạo Trigger tự động trừ StockQuantity trong bảng Fruits mỗi khi thêm dòng vào OrderDetails

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B1 - Tạo Trigger tự động trừ kho khi thêm OrderDetails)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CREATE TRIGGER trg_Name AFTER INSERT ON OrderDetails ... UPDATE Fruits SET StockQuantity = ...;`
- **Đề bài**: Hãy tạo một Trigger `trg_DeductStockOnOrder` kích hoạt `AFTER INSERT ON OrderDetails` để tự động trừ `StockQuantity` của `FruitID` tương ứng trong bảng `Fruits` đi `NEW.Quantity` (hoặc bảng `inserted` trong T-SQL). Sau đó kiểm chứng bằng cách `INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 1, 5, 150000);` (mua 5 kg Sầu Riêng Ri6) và `SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID = 1;` (tồn kho tự động giảm từ 50 xuống 45!).
- **Gợi ý tư duy**: Trong SQLite dùng `NEW.Quantity` và `NEW.FruitID` bên trong `BEGIN ... END;`. Trong T-SQL dùng bảng ảo `inserted`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE TRIGGER trg_DeductStockOnOrder
ON OrderDetails
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE f
    SET f.StockQuantity = f.StockQuantity - i.Quantity
    FROM Fruits f
    INNER JOIN inserted i ON f.FruitID = i.FruitID;
END;
GO
INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 1, 5, 150000);
SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID = 1;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE TRIGGER trg_DeductStockOnOrder
AFTER INSERT ON OrderDetails
BEGIN
    UPDATE Fruits
    SET StockQuantity = StockQuantity - NEW.Quantity
    WHERE FruitID = NEW.FruitID;
END;
INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 1, 5, 150000);
SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID = 1;
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 3 cột):**

| FruitID | FruitName | StockQuantity |
| :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | 45 |

#### [FS-CH10-05] Bài 10.5: Tạo Trigger tự động cộng thêm tiền vào Orders.TotalAmount khi thêm mặt hàng vào OrderDetails

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B2 - Tạo Trigger tự động cộng lại TotalAmount vào Orders khi thêm OrderDetails)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CREATE TRIGGER trg_Name AFTER INSERT ON OrderDetails ... UPDATE Orders SET TotalAmount = ...; (Cùng cơ chế Bài 10.4 nhưng cập nhật bảng Orders)`
- **Đề bài**: Áp dụng y hệt cơ chế Trigger `AFTER INSERT ON OrderDetails` của Bài 10.4 nhưng tác động lên bảng `Orders`: Tạo Trigger `trg_UpdateOrderTotal` tự động cộng `NEW.Quantity * NEW.UnitPrice` vào cột `TotalAmount` của đơn hàng `NEW.OrderID`. Kiểm chứng bằng cách `INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 3, 2, 80000);` (thêm 160,000đ vào đơn số 10 vốn đang là 95,000đ) và `SELECT OrderID, CustomerID, TotalAmount FROM Orders WHERE OrderID = 10;`.
- **Gợi ý tư duy**: Tổng tiền mới của `OrderID = 10` sẽ tự động nhảy từ `95000` lên `255000`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE TRIGGER trg_UpdateOrderTotal
ON OrderDetails
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE o
    SET o.TotalAmount = o.TotalAmount + (i.Quantity * i.UnitPrice)
    FROM Orders o
    INNER JOIN inserted i ON o.OrderID = i.OrderID;
END;
GO
INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 3, 2, 80000);
SELECT OrderID, CustomerID, TotalAmount FROM Orders WHERE OrderID = 10;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE TRIGGER trg_UpdateOrderTotal
AFTER INSERT ON OrderDetails
BEGIN
    UPDATE Orders
    SET TotalAmount = TotalAmount + (NEW.Quantity * NEW.UnitPrice)
    WHERE OrderID = NEW.OrderID;
END;
INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 3, 2, 80000);
SELECT OrderID, CustomerID, TotalAmount FROM Orders WHERE OrderID = 10;
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 3 cột):**

| OrderID | CustomerID | TotalAmount |
| :--- | :--- | :--- |
| 10 | 7 | 255000 |

#### [FS-CH10-06] Bài 10.6: Tạo Trigger tự động chuyển trạng thái đơn hàng sang 'Đã giao' khi nhận giao dịch thanh toán

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B3 - Tạo Trigger tự động cập nhật trạng thái đơn hàng khi có thanh toán đủ)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CREATE TRIGGER trg_Name AFTER INSERT ON PaymentTransactions ... UPDATE Orders SET Status = 'Đã giao' ...;`
- **Đề bài**: Tiếp tục phản xạ Trigger: Tạo `trg_AutoCompleteOrderOnPay` kích hoạt `AFTER INSERT ON PaymentTransactions` để tự động cập nhật `Status = 'Đã giao'` cho đơn hàng có `OrderID = NEW.OrderID` (khi `NEW.Amount >= TotalAmount`). Kiểm chứng bằng cách `INSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate) VALUES (9, 'Momo', 400000, '2024-03-05 12:00:00');` và `SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE OrderID = 9;`.
- **Gợi ý tư duy**: Đơn hàng số 9 đang `'Chờ xử lý'` sẽ tự động chuyển thành `'Đã giao'` ngay khi dòng thanh toán được chèn vào.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE TRIGGER trg_AutoCompleteOrderOnPay
ON PaymentTransactions
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE o
    SET o.Status = N'Đã giao'
    FROM Orders o
    INNER JOIN inserted i ON o.OrderID = i.OrderID
    WHERE i.Amount >= o.TotalAmount;
END;
GO
INSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate)
VALUES (9, N'Momo', 400000, '2024-03-05 12:00:00');
SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE OrderID = 9;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE TRIGGER trg_AutoCompleteOrderOnPay
AFTER INSERT ON PaymentTransactions
BEGIN
    UPDATE Orders
    SET Status = 'Đã giao'
    WHERE OrderID = NEW.OrderID AND NEW.Amount >= TotalAmount;
END;
INSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate)
VALUES (9, 'Momo', 400000, '2024-03-05 12:00:00');
SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE OrderID = 9;
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 4 cột):**

| OrderID | CustomerID | TotalAmount | Status |
| :--- | :--- | :--- | :--- |
| 9 | 4 | 400000 | Đã giao |

#### [FS-CH10-07] Bài 10.7: Tạo Bảng tạm (Temp Table) tổng hợp doanh số theo từng khách hàng để phân tích đa bước

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Sử dụng Bảng tạm Temp Table để lưu kết quả trung gian)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CREATE TEMP TABLE tmp_VipStats AS SELECT ...; SELECT * FROM tmp_VipStats ...;`
- **Đề bài**: Hãy tạo một bảng tạm `tmp_CustomerMetrics` lưu trữ kết quả gom nhóm từ `Customers` và `Orders` (chỉ tính đơn `'Đã giao'`): gồm `CustomerID`, `FullName`, `DeliveredOrders = COUNT(o.OrderID)`, `DeliveredRevenue = SUM(o.TotalAmount)`. Sau đó truy vấn từ bảng tạm `SELECT CustomerID, FullName, DeliveredOrders, DeliveredRevenue FROM tmp_CustomerMetrics WHERE DeliveredRevenue >= 500000 ORDER BY DeliveredRevenue DESC;`.
- **Gợi ý tư duy**: Trong SQLite dùng `CREATE TEMP TABLE tmp_CustomerMetrics AS SELECT ...;`. Trong T-SQL dùng `SELECT ... INTO #tmp_CustomerMetrics FROM ...;`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT c.CustomerID, c.FullName,
       COUNT(o.OrderID) AS DeliveredOrders,
       SUM(o.TotalAmount) AS DeliveredRevenue
INTO #tmp_CustomerMetrics
FROM Customers c
INNER JOIN Orders o ON c.CustomerID = o.CustomerID
WHERE o.Status = N'Đã giao'
GROUP BY c.CustomerID, c.FullName;

SELECT CustomerID, FullName, DeliveredOrders, DeliveredRevenue
FROM #tmp_CustomerMetrics
WHERE DeliveredRevenue >= 500000
ORDER BY DeliveredRevenue DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE TEMP TABLE tmp_CustomerMetrics AS
SELECT c.CustomerID, c.FullName,
       COUNT(o.OrderID) AS DeliveredOrders,
       SUM(o.TotalAmount) AS DeliveredRevenue
FROM Customers c
INNER JOIN Orders o ON c.CustomerID = o.CustomerID
WHERE o.Status = 'Đã giao'
GROUP BY c.CustomerID, c.FullName;

SELECT CustomerID, FullName, DeliveredOrders, DeliveredRevenue
FROM tmp_CustomerMetrics
WHERE DeliveredRevenue >= 500000
ORDER BY DeliveredRevenue DESC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 4 cột):**

| CustomerID | FullName | DeliveredOrders | DeliveredRevenue |
| :--- | :--- | :--- | :--- |
| 1 | Võ Thành Tài | 2 | 3350000 |
| 4 | Triệu Mẫn | 1 | 850000 |

#### [FS-CH10-08] Bài 10.8: Thiết kế bảng Audit Log và Trigger tự động ghi vết khi thay đổi giá trái cây

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Trigger ghi nhận lịch sử Audit Log khi thay đổi giá bán Fruits)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CREATE TABLE PriceAuditLog (...); CREATE TRIGGER trg_AuditPrice AFTER UPDATE OF Price ON Fruits ...;`
- **Đề bài**: Hãy thực hiện: (1) Tạo bảng `FruitPriceAudit (AuditID INTEGER PRIMARY KEY AUTOINCREMENT, FruitID INT, OldPrice INT, NewPrice INT)`, (2) Tạo Trigger `trg_AuditFruitPrice` kích hoạt `AFTER UPDATE OF Price ON Fruits` tự động chèn `OLD.FruitID, OLD.Price, NEW.Price` vào `FruitPriceAudit`, (3) Cập nhật giá `'Sầu Riêng Ri6'` (`FruitID = 1`) từ `150000` lên `165000`, và (4) `SELECT AuditID, FruitID, OldPrice, NewPrice FROM FruitPriceAudit;`.
- **Gợi ý tư duy**: Trong Trigger `AFTER UPDATE`, giá cũ lấy từ `OLD.Price` (T-SQL: bảng `deleted`) và giá mới lấy từ `NEW.Price` (T-SQL: bảng `inserted`).

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE TABLE FruitPriceAudit (
    AuditID INT IDENTITY(1,1) PRIMARY KEY,
    FruitID INT,
    OldPrice DECIMAL(18,2),
    NewPrice DECIMAL(18,2)
);
GO
CREATE TRIGGER trg_AuditFruitPrice
ON Fruits
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(Price)
    BEGIN
        INSERT INTO FruitPriceAudit (FruitID, OldPrice, NewPrice)
        SELECT i.FruitID, d.Price, i.Price
        FROM inserted i
        INNER JOIN deleted d ON i.FruitID = d.FruitID
        WHERE i.Price <> d.Price;
    END
END;
GO
UPDATE Fruits SET Price = 165000 WHERE FruitID = 1;
SELECT AuditID, FruitID, OldPrice, NewPrice FROM FruitPriceAudit;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE TABLE FruitPriceAudit (
    AuditID INTEGER PRIMARY KEY AUTOINCREMENT,
    FruitID INT,
    OldPrice INT,
    NewPrice INT
);
CREATE TRIGGER trg_AuditFruitPrice
AFTER UPDATE OF Price ON Fruits
WHEN OLD.Price <> NEW.Price
BEGIN
    INSERT INTO FruitPriceAudit (FruitID, OldPrice, NewPrice)
    VALUES (NEW.FruitID, OLD.Price, NEW.Price);
END;
UPDATE Fruits SET Price = 165000 WHERE FruitID = 1;
SELECT AuditID, FruitID, OldPrice, NewPrice FROM FruitPriceAudit;
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 4 cột):**

| AuditID | FruitID | OldPrice | NewPrice |
| :--- | :--- | :--- | :--- |
| 1 | 1 | 150000 | 165000 |

#### [FS-CH10-09] Bài 10.9: Tạo View doanh số theo Danh mục (vw_CategorySales) và xếp hạng đóng góp doanh thu

- **Cấp độ & Nhóm phản xạ**: `Nâng cao (Kết hợp nhiều View để tạo Báo cáo tổng hợp Executive Dashboard)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Tạo View doanh số danh mục -> Truy vấn kết hợp tính tỷ trọng`
- **Đề bài**: Hãy tạo View `vw_CategorySales` kết nối `Categories c` -> `Fruits f` (`LEFT JOIN`) -> `OrderDetails od` (`LEFT JOIN`) để tính cho cả 5 danh mục: `CategoryID`, `CategoryName`, tổng số lượng đã bán (`TotalSoldQty = COALESCE(SUM(od.Quantity), 0)`), và tổng doanh thu mặt hàng (`CategoryRevenue = COALESCE(SUM(od.SubTotal), 0)`). Sau đó truy vấn từ `vw_CategorySales` kèm cột xếp hạng `DENSE_RANK() OVER (ORDER BY CategoryRevenue DESC) AS RevenueRank`, sắp xếp theo `CategoryRevenue` giảm dần, `CategoryID` tăng dần.
- **Gợi ý tư duy**: Dùng `LEFT JOIN` từ `Categories` để hai danh mục chưa có đơn hàng nào (Trái cây sấy, Quả hạch) vẫn xuất hiện với doanh thu bằng `0`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE VIEW vw_CategorySales AS
SELECT c.CategoryID, c.CategoryName,
       COALESCE(SUM(od.Quantity), 0) AS TotalSoldQty,
       COALESCE(SUM(od.SubTotal), 0) AS CategoryRevenue
FROM Categories c
LEFT JOIN Fruits f ON c.CategoryID = f.CategoryID
LEFT JOIN OrderDetails od ON f.FruitID = od.FruitID
GROUP BY c.CategoryID, c.CategoryName;
GO
SELECT CategoryID, CategoryName, TotalSoldQty, CategoryRevenue,
       DENSE_RANK() OVER (ORDER BY CategoryRevenue DESC) AS RevenueRank
FROM vw_CategorySales
ORDER BY CategoryRevenue DESC, CategoryID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE VIEW vw_CategorySales AS
SELECT c.CategoryID, c.CategoryName,
       COALESCE(SUM(od.Quantity), 0) AS TotalSoldQty,
       COALESCE(SUM(od.SubTotal), 0) AS CategoryRevenue
FROM Categories c
LEFT JOIN Fruits f ON c.CategoryID = f.CategoryID
LEFT JOIN OrderDetails od ON f.FruitID = od.FruitID
GROUP BY c.CategoryID, c.CategoryName;
SELECT CategoryID, CategoryName, TotalSoldQty, CategoryRevenue,
       DENSE_RANK() OVER (ORDER BY CategoryRevenue DESC) AS RevenueRank
FROM vw_CategorySales
ORDER BY CategoryRevenue DESC, CategoryID ASC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 5 cột):**

| CategoryID | CategoryName | TotalSoldQty | CategoryRevenue | RevenueRank |
| :--- | :--- | :--- | :--- | :--- |
| 2 | Trái cây Nhập khẩu | 10 | 5030000 | 1 |
| 3 | Quả mọng (Berries) | 2 | 550000 | 2 |
| 1 | Đặc sản Miền Tây | 5 | 475000 | 3 |
| 4 | Trái cây sấy | 0 | 0 | 4 |
| 5 | Quả hạch (Nuts) | 0 | 0 | 4 |

#### [FS-CH10-10] Bài 10.10: Báo cáo tổng kết KPI & Hoa hồng cho đội ngũ Nhân viên Bán hàng

- **Cấp độ & Nhóm phản xạ**: `Thực chiến (Mô phỏng logic Stored Procedure chốt sổ doanh thu nhân viên kèm thưởng KPI)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Bảng tạm / View tổng hợp KPI bán hàng + Tính thưởng hoa hồng theo bậc`
- **Đề bài**: Hãy tổng hợp kết quả kinh doanh của tất cả nhân viên có chức vụ `'Nhân viên Bán hàng'` (`Role = 'Nhân viên Bán hàng'`) từ bảng `Employees` kết nối `Orders`: Lấy ra `EmployeeID`, `FullName`, tổng số đơn đã giao (`DeliveredCount = SUM(CASE WHEN o.Status = 'Đã giao' THEN 1 ELSE 0 END)`), doanh thu thực thu từ đơn đã giao (`DeliveredRevenue = SUM(CASE WHEN o.Status = 'Đã giao' THEN o.TotalAmount ELSE 0 END)`), và tiền thưởng hoa hồng 5% trên doanh thu đã giao (`Commission = DeliveredRevenue * 5 / 100`). Sắp xếp theo `DeliveredRevenue` giảm dần.
- **Gợi ý tư duy**: Dùng kỹ thuật Conditional Aggregation `SUM(CASE WHEN o.Status = 'Đã giao' THEN ... ELSE 0 END)`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT e.EmployeeID, e.FullName,
       SUM(CASE WHEN o.Status = N'Đã giao' THEN 1 ELSE 0 END) AS DeliveredCount,
       SUM(CASE WHEN o.Status = N'Đã giao' THEN o.TotalAmount ELSE 0 END) AS DeliveredRevenue,
       SUM(CASE WHEN o.Status = N'Đã giao' THEN o.TotalAmount ELSE 0 END) * 5 / 100 AS Commission
FROM Employees e
LEFT JOIN Orders o ON e.EmployeeID = o.EmployeeID
WHERE e.Role = N'Nhân viên Bán hàng'
GROUP BY e.EmployeeID, e.FullName
ORDER BY DeliveredRevenue DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT e.EmployeeID, e.FullName,
       SUM(CASE WHEN o.Status = 'Đã giao' THEN 1 ELSE 0 END) AS DeliveredCount,
       SUM(CASE WHEN o.Status = 'Đã giao' THEN o.TotalAmount ELSE 0 END) AS DeliveredRevenue,
       SUM(CASE WHEN o.Status = 'Đã giao' THEN o.TotalAmount ELSE 0 END) * 5 / 100 AS Commission
FROM Employees e
LEFT JOIN Orders o ON e.EmployeeID = o.EmployeeID
WHERE e.Role = 'Nhân viên Bán hàng'
GROUP BY e.EmployeeID, e.FullName
ORDER BY DeliveredRevenue DESC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 5 cột):**

| EmployeeID | FullName | DeliveredCount | DeliveredRevenue | Commission |
| :--- | :--- | :--- | :--- | :--- |
| 6 | Hoàng Cúc | 3 | 3530000 | 176500 |
| 7 | Đinh Hợi | 3 | 1300000 | 65000 |

### Chương 11: Bảo Mật CSDL, Phòng Chống SQL Injection, Phân Quyền & Che Giấu Dữ Liệu (Masking)

- **Mục tiêu phản xạ của chương**: Rèn phản xạ bảo vệ dữ liệu nhạy cảm của khách hàng và nhân sự: che giấu số điện thoại/địa chỉ (Data Masking), tạo View phân quyền theo vai trò (Least Privilege View), lọc theo ngữ cảnh người dùng (Row-Level Security) và truy vấn tham số hóa chống SQL Injection.

#### [FS-CH11-01] Bài 11.1: Che giấu số điện thoại khách hàng (Data Masking trên bảng Customers)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A1 - Dynamic Data Masking che số điện thoại khách hàng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SUBSTR(PhoneNumber, 1, 3) || '****' || SUBSTR(PhoneNumber, -3)`
- **Đề bài**: Khi hiển thị danh sách khách hàng cho bộ phận Chăm sóc khách hàng cấp 1, cần ẩn 4 chữ số giữa của `PhoneNumber` (ví dụ `'0901111222'` -> `'090****222'`). Hãy lấy ra `CustomerID`, `FullName`, cột `MaskedPhone` (3 số đầu + `'****'` + 3 số cuối) và `CustomerType` từ bảng `Customers`. Sắp xếp theo `CustomerID` tăng dần.
- **Gợi ý tư duy**: Trong SQLite dùng `SUBSTR(PhoneNumber, 1, 3) || '****' || SUBSTR(PhoneNumber, -3, 3)`. Trong T-SQL dùng `LEFT(PhoneNumber, 3) + '****' + RIGHT(PhoneNumber, 3)`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT CustomerID, FullName,
       LEFT(PhoneNumber, 3) + '****' + RIGHT(PhoneNumber, 3) AS MaskedPhone,
       CustomerType
FROM Customers
ORDER BY CustomerID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT CustomerID, FullName,
       SUBSTR(PhoneNumber, 1, 3) || '****' || SUBSTR(PhoneNumber, -3, 3) AS MaskedPhone,
       CustomerType
FROM Customers
ORDER BY CustomerID ASC;
```

**Kết quả kỳ vọng (`expected` — 8 dòng × 4 cột):**

| CustomerID | FullName | MaskedPhone | CustomerType |
| :--- | :--- | :--- | :--- |
| 1 | Võ Thành Tài | 090****222 | VIP |
| 2 | Nguyễn Thị Lệ | 090****333 | Standard |
| 3 | Trương Vô Kỵ | 090****444 | Standard |
| 4 | Triệu Mẫn | 090****555 | VIP |
| 5 | Chu Chỉ Nhược | 090****666 | Standard |
| 6 | Ân Ly | 090****777 | Standard |
| 7 | Tiểu Chiêu | 090****888 | Standard |
| 8 | Dương Quá | 090****999 | Standard |

#### [FS-CH11-02] Bài 11.2: Che giấu một phần mã VoucherCode trên màn hình công khai (Bảng Vouchers)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A2 - Data Masking che mã VoucherCode)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SUBSTR(VoucherCode, 1, 3) || '***' (Cùng cơ chế Masking của Bài 11.1 nhưng trên bảng Vouchers)`
- **Đề bài**: Áp dụng y hệt kỹ thuật Data Masking của Bài 11.1 trên bảng `Vouchers`: Lấy ra `VoucherID`, cột `MaskedCode` chỉ hiện 3 ký tự đầu của `VoucherCode` nối với `'***'` (ví dụ `'WELCOME50'` -> `'WEL***'`), `DiscountAmount` và `MinOrderValue`. Sắp xếp theo `VoucherID` tăng dần.
- **Gợi ý tư duy**: Dùng `SUBSTR(VoucherCode, 1, 3) || '***'` (SQLite) hoặc `LEFT(VoucherCode, 3) + '***'` (T-SQL).

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT VoucherID,
       LEFT(VoucherCode, 3) + '***' AS MaskedCode,
       DiscountAmount, MinOrderValue
FROM Vouchers
ORDER BY VoucherID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT VoucherID,
       SUBSTR(VoucherCode, 1, 3) || '***' AS MaskedCode,
       DiscountAmount, MinOrderValue
FROM Vouchers
ORDER BY VoucherID ASC;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 4 cột):**

| VoucherID | MaskedCode | DiscountAmount | MinOrderValue |
| :--- | :--- | :--- | :--- |
| 1 | WEL*** | 50000 | 200000 |
| 2 | VIP*** | 100000 | 500000 |
| 3 | HET*** | 30000 | 100000 |

#### [FS-CH11-03] Bài 11.3: Ẩn danh tên khách hàng viết đánh giá sản phẩm (Reviews JOIN Customers)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A3 - Data Masking ẩn danh tên người đánh giá trên trang sản phẩm)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SUBSTR(FullName, 1, 1) || '***' (Cùng cơ chế Masking trên Reviews & Customers)`
- **Đề bài**: Tiếp tục phản xạ Data Masking khi hiển thị đánh giá công khai trên web: Kết nối `Reviews r` với `Customers c`, lấy ra `ReviewID`, `FruitID`, cột `ReviewerMasked` gồm ký tự đầu tiên của `FullName` nối với `'***'` (ví dụ `'Võ Thành Tài'` -> `'V***'`), `Rating` và `Comment`. Sắp xếp theo `ReviewID` tăng dần.
- **Gợi ý tư duy**: Dùng `SUBSTR(c.FullName, 1, 1) || '***' AS ReviewerMasked`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT r.ReviewID, r.FruitID,
       LEFT(c.FullName, 1) + N'***' AS ReviewerMasked,
       r.Rating, r.Comment
FROM Reviews r
INNER JOIN Customers c ON r.CustomerID = c.CustomerID
ORDER BY r.ReviewID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT r.ReviewID, r.FruitID,
       SUBSTR(c.FullName, 1, 1) || '***' AS ReviewerMasked,
       r.Rating, r.Comment
FROM Reviews r
INNER JOIN Customers c ON r.CustomerID = c.CustomerID
ORDER BY r.ReviewID ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 5 cột):**

| ReviewID | FruitID | ReviewerMasked | Rating | Comment |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 5 | V*** | 5 | Nho rất giòn và ngọt, đáng tiền! |
| 2 | 3 | N*** | 4 | Xoài ngọt nhưng da hơi xấu |
| 3 | 6 | T*** | 5 | Táo Envy chuẩn Mỹ, rất thơm. |
| 4 | 10 | C*** | 3 | Việt quất hơi chua so với mong đợi. |

#### [FS-CH11-04] Bài 11.4: Tạo View bảo mật cấp cột (Column-Level Security) dành riêng cho Nhân viên Kho

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B1 - Tạo View phân quyền tối thiểu Least Privilege cho Nhân viên Kho)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CREATE VIEW vw_WarehouseFruits AS SELECT (chỉ các cột kho, ẩn cột giá/doanh thu) ...;`
- **Đề bài**: Theo nguyên tắc **Least Privilege**, nhân viên kho chỉ cần biết tên hàng, đơn vị tính, xuất xứ và số lượng tồn kho, không cần xem chiến lược giá hoặc dữ liệu khác. Hãy tạo View `vw_WarehouseStock` chỉ lấy `FruitID`, `FruitName`, `Unit`, `Origin`, `StockQuantity` từ bảng `Fruits`, sau đó truy vấn `SELECT * FROM vw_WarehouseStock WHERE StockQuantity <= 30 ORDER BY StockQuantity ASC, FruitID ASC;`.
- **Gợi ý tư duy**: Cấp quyền `SELECT` trên View `vw_WarehouseStock` và thu hồi quyền trên bảng gốc `Fruits` là cách chuẩn để bảo mật cấp cột.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE VIEW vw_WarehouseStock AS
SELECT FruitID, FruitName, Unit, Origin, StockQuantity
FROM Fruits;
GO
SELECT * FROM vw_WarehouseStock
WHERE StockQuantity <= 30
ORDER BY StockQuantity ASC, FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE VIEW vw_WarehouseStock AS
SELECT FruitID, FruitName, Unit, Origin, StockQuantity
FROM Fruits;
SELECT * FROM vw_WarehouseStock
WHERE StockQuantity <= 30
ORDER BY StockQuantity ASC, FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 5 cột):**

| FruitID | FruitName | Unit | Origin | StockQuantity |
| :--- | :--- | :--- | :--- | :--- |
| 11 | Mâm Xôi Đen | Hộp | Đà Lạt | 0 |
| 5 | Nho Mẫu Đơn Shine Muscat | Chùm | Hàn Quốc | 15 |
| 10 | Việt Quất (Blueberry) | Hộp | Mỹ | 20 |
| 7 | Cherry Đỏ Thẫm | Kg | Úc | 30 |

#### [FS-CH11-05] Bài 11.5: Thiết kế View bảo mật cấp dòng (Row-Level Security) để nhân viên chỉ thấy đơn hàng mình phụ trách

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B2 - Tạo View bảo mật cấp dòng Row-Level Security cho Nhân viên Bán hàng số 6)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CREATE VIEW vw_MyOrders AS SELECT ... FROM Orders WHERE EmployeeID = 6; (Cùng cơ chế View bảo mật nhưng lọc theo dòng)`
- **Đề bài**: Áp dụng cơ chế View bảo mật cho nhân viên bán hàng Hoàng Cúc (`EmployeeID = 6`): Tạo View `vw_SalesEmp6_Orders` chỉ trích xuất các đơn hàng có `EmployeeID = 6` (gồm `OrderID`, `CustomerID`, `OrderDate`, `TotalAmount`, `Status`). Sau đó truy vấn `SELECT * FROM vw_SalesEmp6_Orders ORDER BY OrderID ASC;`.
- **Gợi ý tư duy**: Lọc cứng `WHERE EmployeeID = 6` (hoặc `SESSION_CONTEXT` trong SQL Server thực tế) ngay trong View.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE VIEW vw_SalesEmp6_Orders AS
SELECT OrderID, CustomerID, OrderDate, TotalAmount, Status
FROM Orders
WHERE EmployeeID = 6;
GO
SELECT * FROM vw_SalesEmp6_Orders ORDER BY OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE VIEW vw_SalesEmp6_Orders AS
SELECT OrderID, CustomerID, OrderDate, TotalAmount, Status
FROM Orders
WHERE EmployeeID = 6;
SELECT * FROM vw_SalesEmp6_Orders ORDER BY OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 6 dòng × 5 cột):**

| OrderID | CustomerID | OrderDate | TotalAmount | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | 2023-02-14 10:15:00 | 850000 | Đã giao |
| 2 | 2 | 2023-04-20 14:30:00 | 180000 | Đã giao |
| 5 | 1 | 2023-12-24 19:00:00 | 2500000 | Đã giao |
| 7 | 6 | 2024-02-14 11:20:00 | 180000 | Đã hủy |
| 8 | 1 | 2024-03-01 15:10:00 | 200000 | Đang giao |
| 10 | 7 | 2024-03-10 14:00:00 | 95000 | Chờ xử lý |

#### [FS-CH11-06] Bài 11.6: Thiết kế View bảo mật cấp dòng cho nhân viên bán hàng Đinh Hợi (EmployeeID = 7)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B3 - Tạo View bảo mật cấp dòng cho Nhân viên Bán hàng số 7)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CREATE VIEW vw_SalesEmp7_Orders AS SELECT ... FROM Orders WHERE EmployeeID = 7; (Cùng cơ chế Bài 11.5 nhưng cho EmployeeID = 7)`
- **Đề bài**: Tiếp tục phản xạ Row-Level Security View cho nhân viên Đinh Hợi (`EmployeeID = 7`): Tạo View `vw_SalesEmp7_Orders` chỉ lấy `OrderID`, `CustomerID`, `OrderDate`, `TotalAmount`, `Status` của các đơn có `EmployeeID = 7`. Sau đó truy vấn `SELECT * FROM vw_SalesEmp7_Orders ORDER BY OrderID ASC;`.
- **Gợi ý tư duy**: Dùng `WHERE EmployeeID = 7`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
CREATE VIEW vw_SalesEmp7_Orders AS
SELECT OrderID, CustomerID, OrderDate, TotalAmount, Status
FROM Orders
WHERE EmployeeID = 7;
GO
SELECT * FROM vw_SalesEmp7_Orders ORDER BY OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
CREATE VIEW vw_SalesEmp7_Orders AS
SELECT OrderID, CustomerID, OrderDate, TotalAmount, Status
FROM Orders
WHERE EmployeeID = 7;
SELECT * FROM vw_SalesEmp7_Orders ORDER BY OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 5 cột):**

| OrderID | CustomerID | OrderDate | TotalAmount | Status |
| :--- | :--- | :--- | :--- | :--- |
| 3 | 3 | 2023-06-15 09:00:00 | 150000 | Đã giao |
| 4 | 4 | 2023-08-08 16:45:00 | 850000 | Đã giao |
| 6 | 5 | 2024-01-10 08:30:00 | 300000 | Đã giao |
| 9 | 4 | 2024-03-05 10:00:00 | 400000 | Chờ xử lý |

#### [FS-CH11-07] Bài 11.7: Phân tích lỗ hổng SQL Injection khi kiểm tra mã Voucher và cách khóa chặt điều kiện

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Mô phỏng hậu quả của lỗi nối chuỗi SQL Injection `' OR '1'='1`)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `So sánh kết quả khi bị tấn công WHERE VoucherCode = '' OR '1'='1' (lộ toàn bộ bảng) vs Truy vấn an toàn`
- **Đề bài**: Khi lập trình viên nối chuỗi trực tiếp, kẻ tấn công nhập mã `'WELCOME50'`, nhưng nếu chỉ lấy các Voucher **đang còn hiệu lực** (`UsedCount < UsageLimit AND ExpiryDate >= '2024-01-01'`) và khớp chính xác mã `'WELCOME50'`, hãy viết câu truy vấn chuẩn trả về `VoucherID`, `VoucherCode`, `DiscountAmount`, `MinOrderValue`.
- **Gợi ý tư duy**: Luôn kết hợp lọc chính xác `WHERE VoucherCode = 'WELCOME50' AND UsedCount < UsageLimit AND ExpiryDate >= '2024-01-01'`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT VoucherID, VoucherCode, DiscountAmount, MinOrderValue
FROM Vouchers
WHERE VoucherCode = 'WELCOME50'
  AND UsedCount < UsageLimit
  AND ExpiryDate >= '2024-01-01';
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT VoucherID, VoucherCode, DiscountAmount, MinOrderValue
FROM Vouchers
WHERE VoucherCode = 'WELCOME50'
  AND UsedCount < UsageLimit
  AND ExpiryDate >= '2024-01-01';
```

**Kết quả kỳ vọng (`expected` — 1 dòng × 4 cột):**

| VoucherID | VoucherCode | DiscountAmount | MinOrderValue |
| :--- | :--- | :--- | :--- |
| 1 | WELCOME50 | 50000 | 200000 |

#### [FS-CH11-08] Bài 11.8: Chống SQL Injection ở mệnh đề ORDER BY bằng kỹ thuật CASE WHEN Whitelist

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Whitelist Validation cho cột sắp xếp động bằng CASE WHEN)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `ORDER BY CASE WHEN @SortCol = 'Price' THEN Price ELSE FruitID END`
- **Đề bài**: Vì không thể truyền tên cột trực tiếp làm tham số `@param` sau `ORDER BY`, cách chống SQL Injection chuẩn khi người dùng chọn kiểu sắp xếp (`'PRICE_ASC'`) là dùng biểu thức `CASE WHEN`. Hãy viết truy vấn lấy `FruitID`, `FruitName`, `Price` của danh mục `1`, sắp xếp bằng `ORDER BY CASE WHEN 'PRICE_ASC' = 'PRICE_ASC' THEN Price ELSE FruitID END ASC`.
- **Gợi ý tư duy**: Biểu thức `CASE WHEN` đảm bảo không có bất kỳ đoạn mã độc nào có thể tiêm vào sau `ORDER BY`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, Price
FROM Fruits
WHERE CategoryID = 1
ORDER BY CASE WHEN 'PRICE_ASC' = 'PRICE_ASC' THEN Price ELSE FruitID END ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Price
FROM Fruits
WHERE CategoryID = 1
ORDER BY CASE WHEN 'PRICE_ASC' = 'PRICE_ASC' THEN Price ELSE FruitID END ASC;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 3 cột):**

| FruitID | FruitName | Price |
| :--- | :--- | :--- |
| 2 | Bưởi Da Xanh | 70000 |
| 3 | Xoài Cát Hòa Lộc | 80000 |
| 4 | Măng Cụt Lái Thiêu | 95000 |
| 1 | Sầu Riêng Ri6 | 150000 |

#### [FS-CH11-09] Bài 11.9: Kiểm toán thất thoát tài chính: Kiểm tra các đơn hàng và trạng thái thanh toán tương ứng

- **Cấp độ & Nhóm phản xạ**: `Nâng cao (Kiểm toán bảo mật: Phát hiện đơn hàng đã giao nhưng chưa có giao dịch thanh toán)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Orders o LEFT JOIN PaymentTransactions pt ... WHERE o.Status = 'Đã giao' AND pt.TransactionID IS NULL`
- **Đề bài**: Bộ phận Kiểm toán nội bộ cần rà soát tất cả các đơn hàng (`OrderID`, `CustomerID`, `TotalAmount`, `Status`) kèm theo tổng số tiền đã thu trong `PaymentTransactions` (`PaidAmount = COALESCE(SUM(pt.Amount), 0)`) và trạng thái đối soát `AuditStatus`: Nếu `COALESCE(SUM(pt.Amount), 0) >= o.TotalAmount` là `'Đã thu đủ'`, nếu `o.Status = 'Đã hủy'` là `'Đơn hủy'`, ngược lại là `'Chưa thu tiền'`. Sắp xếp theo `OrderID` tăng dần.
- **Gợi ý tư duy**: Nối `Orders o LEFT JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID` và gom nhóm theo `o.OrderID, o.CustomerID, o.TotalAmount, o.Status`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT o.OrderID, o.CustomerID, o.TotalAmount, o.Status,
       COALESCE(SUM(pt.Amount), 0) AS PaidAmount,
       CASE
           WHEN COALESCE(SUM(pt.Amount), 0) >= o.TotalAmount THEN N'Đã thu đủ'
           WHEN o.Status = N'Đã hủy' THEN N'Đơn hủy'
           ELSE N'Chưa thu tiền'
       END AS AuditStatus
FROM Orders o
LEFT JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID
GROUP BY o.OrderID, o.CustomerID, o.TotalAmount, o.Status
ORDER BY o.OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT o.OrderID, o.CustomerID, o.TotalAmount, o.Status,
       COALESCE(SUM(pt.Amount), 0) AS PaidAmount,
       CASE
           WHEN COALESCE(SUM(pt.Amount), 0) >= o.TotalAmount THEN 'Đã thu đủ'
           WHEN o.Status = 'Đã hủy' THEN 'Đơn hủy'
           ELSE 'Chưa thu tiền'
       END AS AuditStatus
FROM Orders o
LEFT JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID
GROUP BY o.OrderID, o.CustomerID, o.TotalAmount, o.Status
ORDER BY o.OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 10 dòng × 6 cột):**

| OrderID | CustomerID | TotalAmount | Status | PaidAmount | AuditStatus |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | 850000 | Đã giao | 850000 | Đã thu đủ |
| 2 | 2 | 180000 | Đã giao | 200000 | Đã thu đủ |
| 3 | 3 | 150000 | Đã giao | 150000 | Đã thu đủ |
| 4 | 4 | 850000 | Đã giao | 850000 | Đã thu đủ |
| 5 | 1 | 2500000 | Đã giao | 2500000 | Đã thu đủ |
| 6 | 5 | 300000 | Đã giao | 300000 | Đã thu đủ |
| 7 | 6 | 180000 | Đã hủy | 0 | Đơn hủy |
| 8 | 1 | 200000 | Đang giao | 0 | Chưa thu tiền |
| 9 | 4 | 400000 | Chờ xử lý | 0 | Chưa thu tiền |
| 10 | 7 | 95000 | Chờ xử lý | 0 | Chưa thu tiền |

#### [FS-CH11-10] Bài 11.10: Kiểm toán gian lận mã giảm giá: Kiểm tra các đơn có áp Voucher xem tổng tiền hàng gốc có thỏa MinOrderValue không

- **Cấp độ & Nhóm phản xạ**: `Thực chiến (Kiểm toán điều kiện áp dụng Voucher: Đơn hàng có đạt MinOrderValue hay không?)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Kiểm tra GrossAmount >= v.MinOrderValue trên các đơn có dùng Voucher`
- **Đề bài**: Hãy kiểm tra tất cả các đơn hàng có sử dụng Voucher (`o.VoucherID IS NOT NULL`): Lấy ra `OrderID`, `VoucherCode`, tổng tiền hàng gốc trước giảm (`GrossAmount = SUM(od.SubTotal)`), giá trị đơn tối thiểu của mã (`MinOrderValue`), và kết quả kiểm toán `PolicyCheck` (`'Hợp lệ'` nếu `SUM(od.SubTotal) >= v.MinOrderValue`, ngược lại `'Vi phạm điều kiện'`). Sắp xếp theo `OrderID` tăng dần.
- **Gợi ý tư duy**: Nối `Orders o`, `OrderDetails od` và `Vouchers v`, gom nhóm theo `o.OrderID, v.VoucherCode, v.MinOrderValue`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT o.OrderID, v.VoucherCode,
       SUM(od.SubTotal) AS GrossAmount,
       v.MinOrderValue,
       CASE
           WHEN SUM(od.SubTotal) >= v.MinOrderValue THEN N'Hợp lệ'
           ELSE N'Vi phạm điều kiện'
       END AS PolicyCheck
FROM Orders o
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID
GROUP BY o.OrderID, v.VoucherCode, v.MinOrderValue
ORDER BY o.OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT o.OrderID, v.VoucherCode,
       SUM(od.SubTotal) AS GrossAmount,
       v.MinOrderValue,
       CASE
           WHEN SUM(od.SubTotal) >= v.MinOrderValue THEN 'Hợp lệ'
           ELSE 'Vi phạm điều kiện'
       END AS PolicyCheck
FROM Orders o
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID
GROUP BY o.OrderID, v.VoucherCode, v.MinOrderValue
ORDER BY o.OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 5 cột):**

| OrderID | VoucherCode | GrossAmount | MinOrderValue | PolicyCheck |
| :--- | :--- | :--- | :--- | :--- |
| 2 | WELCOME50 | 230000 | 200000 | Hợp lệ |
| 4 | VIP100 | 950000 | 500000 | Hợp lệ |
| 5 | VIP100 | 2600000 | 500000 | Hợp lệ |
| 6 | WELCOME50 | 350000 | 200000 | Hợp lệ |
| 9 | WELCOME50 | 450000 | 200000 | Hợp lệ |

### Chương 12: Kết Nối Backend (Java JDBC/JPA, C# ADO.NET/EF Core, Dapper), N+1 Query & Keyset Pagination

- **Mục tiêu phản xạ của chương**: Rèn phản xạ viết câu SQL tối ưu cho Backend API: khử triệt để lỗi N+1 Query bằng Eager Projection, phẳng hóa DTO (Data Transfer Object), phân trang Keyset/Seek Pagination tốc độ O(1) và chuẩn bị dữ liệu JSON cho REST API.

#### [FS-CH12-01] Bài 12.1: Viết câu truy vấn Eager Projection khử lỗi N+1 cho API GET /api/fruits

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A1 - Khử lỗi N+1 Query cho API Danh sách Trái cây kèm Danh mục)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Gộp 1 câu SELECT ... INNER JOIN thay vì 1 câu lấy Categories + N câu lấy Fruits`
- **Đề bài**: Thay vì để ORM rơi vào bẫy N+1 (chạy 1 câu lấy 14 `Fruits` rồi chạy thêm 14 câu lấy `Categories`), hãy viết 1 câu truy vấn phẳng hóa (DTO Projection) trả về: `FruitID`, `FruitName`, `Price`, `Unit`, `CategoryID`, `CategoryName` cho tất cả trái cây đang hoạt động (`IsActive = 1`). Sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Dùng `INNER JOIN Categories c ON f.CategoryID = c.CategoryID` và chỉ lấy đúng các cột DTO cần thiết.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT f.FruitID, f.FruitName, f.Price, f.Unit,
       c.CategoryID, c.CategoryName
FROM Fruits f
INNER JOIN Categories c ON f.CategoryID = c.CategoryID
WHERE f.IsActive = 1
ORDER BY f.FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT f.FruitID, f.FruitName, f.Price, f.Unit,
       c.CategoryID, c.CategoryName
FROM Fruits f
INNER JOIN Categories c ON f.CategoryID = c.CategoryID
WHERE f.IsActive = 1
ORDER BY f.FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 14 dòng × 6 cột):**

| FruitID | FruitName | Price | Unit | CategoryID | CategoryName |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | 150000 | Kg | 1 | Đặc sản Miền Tây |
| 2 | Bưởi Da Xanh | 70000 | Quả | 1 | Đặc sản Miền Tây |
| 3 | Xoài Cát Hòa Lộc | 80000 | Kg | 1 | Đặc sản Miền Tây |
| 4 | Măng Cụt Lái Thiêu | 95000 | Kg | 1 | Đặc sản Miền Tây |
| 5 | Nho Mẫu Đơn Shine Muscat | 850000 | Chùm | 2 | Trái cây Nhập khẩu |
| 6 | Táo Envy | 250000 | Kg | 2 | Trái cây Nhập khẩu |
| 7 | Cherry Đỏ Thẫm | 450000 | Kg | 2 | Trái cây Nhập khẩu |
| 8 | Kiwi Vàng | 180000 | Hộp | 2 | Trái cây Nhập khẩu |
| 9 | Dâu Tây Mộc Châu | 200000 | Hộp | 3 | Quả mọng (Berries) |
| 10 | Việt Quất (Blueberry) | 350000 | Hộp | 3 | Quả mọng (Berries) |
| 11 | Mâm Xôi Đen | 320000 | Hộp | 3 | Quả mọng (Berries) |
| 12 | Nho khô Ninh Thuận | 120000 | Hũ | 4 | Trái cây sấy |
| 13 | Mít sấy giòn | 60000 | Bịch | 4 | Trái cây sấy |
| 14 | Hạt Mắc Ca | 280000 | Hũ | 5 | Quả hạch (Nuts) |

#### [FS-CH12-02] Bài 12.2: Viết câu truy vấn DTO Projection khử lỗi N+1 cho API GET /api/orders

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A2 - Khử lỗi N+1 Query cho API Lịch sử Đơn hàng kèm Khách hàng & Voucher)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Gộp 1 câu SELECT ... INNER JOIN Customers LEFT JOIN Vouchers (Cùng cơ chế Bài 12.1 nhưng cho API GET /api/orders)`
- **Đề bài**: Áp dụng y hệt phản xạ khử N+1 của Bài 12.1 cho API danh sách đơn hàng: Trong 1 câu SQL duy nhất, hãy lấy ra `OrderID`, `OrderDate`, `TotalAmount`, `Status`, `CustomerName` (`c.FullName`), `CustomerPhone` (`c.PhoneNumber`), và `VoucherCode` (`COALESCE(v.VoucherCode, 'NONE')`). Sắp xếp theo `OrderID` giảm dần.
- **Gợi ý tư duy**: Chú ý dùng `LEFT JOIN Vouchers v` vì nhiều đơn hàng không áp mã giảm giá (`VoucherID IS NULL`).

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT o.OrderID, o.OrderDate, o.TotalAmount, o.Status,
       c.FullName AS CustomerName, c.PhoneNumber AS CustomerPhone,
       COALESCE(v.VoucherCode, 'NONE') AS VoucherCode
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
LEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID
ORDER BY o.OrderID DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT o.OrderID, o.OrderDate, o.TotalAmount, o.Status,
       c.FullName AS CustomerName, c.PhoneNumber AS CustomerPhone,
       COALESCE(v.VoucherCode, 'NONE') AS VoucherCode
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
LEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID
ORDER BY o.OrderID DESC;
```

**Kết quả kỳ vọng (`expected` — 10 dòng × 7 cột):**

| OrderID | OrderDate | TotalAmount | Status | CustomerName | CustomerPhone | VoucherCode |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 10 | 2024-03-10 14:00:00 | 95000 | Chờ xử lý | Tiểu Chiêu | 0907777888 | NONE |
| 9 | 2024-03-05 10:00:00 | 400000 | Chờ xử lý | Triệu Mẫn | 0904444555 | WELCOME50 |
| 8 | 2024-03-01 15:10:00 | 200000 | Đang giao | Võ Thành Tài | 0901111222 | NONE |
| 7 | 2024-02-14 11:20:00 | 180000 | Đã hủy | Ân Ly | 0906666777 | NONE |
| 6 | 2024-01-10 08:30:00 | 300000 | Đã giao | Chu Chỉ Nhược | 0905555666 | WELCOME50 |
| 5 | 2023-12-24 19:00:00 | 2500000 | Đã giao | Võ Thành Tài | 0901111222 | VIP100 |
| 4 | 2023-08-08 16:45:00 | 850000 | Đã giao | Triệu Mẫn | 0904444555 | VIP100 |
| 3 | 2023-06-15 09:00:00 | 150000 | Đã giao | Trương Vô Kỵ | 0903333444 | NONE |
| 2 | 2023-04-20 14:30:00 | 180000 | Đã giao | Nguyễn Thị Lệ | 0902222333 | WELCOME50 |
| 1 | 2023-02-14 10:15:00 | 850000 | Đã giao | Võ Thành Tài | 0901111222 | NONE |

#### [FS-CH12-03] Bài 12.3: Khử lỗi `category.getFruits().size()` gây N+1 trong Hibernate/EF Core

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A3 - Khử lỗi N+1 Query khi lấy Danh sách Danh mục kèm số lượng sản phẩm)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT c.*, COUNT(f.FruitID) ... LEFT JOIN ... GROUP BY ... (Cùng cơ chế khử N+1 cho API GET /api/categories/summary)`
- **Đề bài**: Trong Java JPA hoặc C# EF Core, gọi `category.getFruits().size()` trong vòng lặp sẽ bắn ra 5 câu `SELECT COUNT(*)` riêng lẻ. Hãy viết 1 câu SQL duy nhất cho API `/api/categories/summary` lấy ra `CategoryID`, `CategoryName`, `ProductCount` (`COUNT(f.FruitID)`) và `MinPrice` (`COALESCE(MIN(f.Price), 0)`), `MaxPrice` (`COALESCE(MAX(f.Price), 0)`). Sắp xếp theo `CategoryID` tăng dần.
- **Gợi ý tư duy**: Dùng `Categories c LEFT JOIN Fruits f ON c.CategoryID = f.CategoryID GROUP BY c.CategoryID, c.CategoryName`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT c.CategoryID, c.CategoryName,
       COUNT(f.FruitID) AS ProductCount,
       COALESCE(MIN(f.Price), 0) AS MinPrice,
       COALESCE(MAX(f.Price), 0) AS MaxPrice
FROM Categories c
LEFT JOIN Fruits f ON c.CategoryID = f.CategoryID
GROUP BY c.CategoryID, c.CategoryName
ORDER BY c.CategoryID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT c.CategoryID, c.CategoryName,
       COUNT(f.FruitID) AS ProductCount,
       COALESCE(MIN(f.Price), 0) AS MinPrice,
       COALESCE(MAX(f.Price), 0) AS MaxPrice
FROM Categories c
LEFT JOIN Fruits f ON c.CategoryID = f.CategoryID
GROUP BY c.CategoryID, c.CategoryName
ORDER BY c.CategoryID ASC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 5 cột):**

| CategoryID | CategoryName | ProductCount | MinPrice | MaxPrice |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Đặc sản Miền Tây | 4 | 70000 | 150000 |
| 2 | Trái cây Nhập khẩu | 4 | 180000 | 850000 |
| 3 | Quả mọng (Berries) | 3 | 200000 | 350000 |
| 4 | Trái cây sấy | 2 | 60000 | 120000 |
| 5 | Quả hạch (Nuts) | 1 | 280000 | 280000 |

#### [FS-CH12-04] Bài 12.4: Phân trang Keyset Pagination (Seek Method) trang tiếp theo trên bảng Fruits

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B1 - Phân trang Keyset / Seek Pagination theo khóa chính trên bảng Fruits)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM Table WHERE PK > @LastSeenID ORDER BY PK ASC LIMIT @PageSize;`
- **Đề bài**: Thay vì dùng `OFFSET` gây chậm khi dữ liệu lớn, Backend truyền lên `lastSeenFruitID = 5` và `pageSize = 4`. Hãy viết câu truy vấn Keyset Pagination lấy 4 loại trái cây tiếp theo có `FruitID > 5` (gồm `FruitID`, `FruitName`, `Price`), sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Trong T-SQL dùng `SELECT TOP 4 ... WHERE FruitID > 5 ORDER BY FruitID ASC`. Trong SQLite dùng `LIMIT 4`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT TOP 4 FruitID, FruitName, Price
FROM Fruits
WHERE FruitID > 5
ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Price
FROM Fruits
WHERE FruitID > 5
ORDER BY FruitID ASC
LIMIT 4;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 3 cột):**

| FruitID | FruitName | Price |
| :--- | :--- | :--- |
| 6 | Táo Envy | 250000 |
| 7 | Cherry Đỏ Thẫm | 450000 |
| 8 | Kiwi Vàng | 180000 |
| 9 | Dâu Tây Mộc Châu | 200000 |

#### [FS-CH12-05] Bài 12.5: Phân trang Keyset Pagination cuộn Infinite Scroll lịch sử đơn hàng (Bảng Orders)

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B2 - Phân trang Keyset Pagination theo chiều giảm dần trên bảng Orders)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM Table WHERE PK < @LastSeenID ORDER BY PK DESC LIMIT @PageSize; (Cùng cơ chế Bài 12.4 nhưng cuộn ngược trên Orders)`
- **Đề bài**: Áp dụng y hệt kỹ thuật Keyset Pagination của Bài 12.4 cho màn hình Lịch sử đơn hàng (sắp xếp từ mới nhất xuống cũ nhất theo `OrderID DESC`): Giả sử trang 1 đã hiển thị từ đơn 10 xuống đơn 8 (`lastSeenOrderID = 8`). Hãy lấy `3` đơn hàng tiếp theo (`OrderID < 8`), hiển thị `OrderID`, `CustomerID`, `OrderDate`, `TotalAmount`, sắp xếp theo `OrderID` giảm dần.
- **Gợi ý tư duy**: Dùng `WHERE OrderID < 8 ORDER BY OrderID DESC LIMIT 3` (hoặc `TOP 3` trong T-SQL).

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT TOP 3 OrderID, CustomerID, OrderDate, TotalAmount
FROM Orders
WHERE OrderID < 8
ORDER BY OrderID DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT OrderID, CustomerID, OrderDate, TotalAmount
FROM Orders
WHERE OrderID < 8
ORDER BY OrderID DESC
LIMIT 3;
```

**Kết quả kỳ vọng (`expected` — 3 dòng × 4 cột):**

| OrderID | CustomerID | OrderDate | TotalAmount |
| :--- | :--- | :--- | :--- |
| 7 | 6 | 2024-02-14 11:20:00 | 180000 |
| 6 | 5 | 2024-01-10 08:30:00 | 300000 |
| 5 | 1 | 2023-12-24 19:00:00 | 2500000 |

#### [FS-CH12-06] Bài 12.6: Phân trang Keyset Pagination có xử lý đồng hạng (Tie-breaker) theo Giá giảm dần

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B3 - Phân trang Keyset Pagination trên cặp cột (Price, FruitID))`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `WHERE Price < @LastPrice OR (Price = @LastPrice AND FruitID > @LastID)`
- **Đề bài**: Khi người dùng sắp xếp trái cây theo `Price DESC, FruitID ASC`, nếu dòng cuối cùng của trang trước là `FruitID = 9` ('Dâu Tây Mộc Châu', `Price = 200000`), hãy dùng điều kiện Keyset chuẩn `WHERE Price < 200000 OR (Price = 200000 AND FruitID > 9)` để lấy ra `4` loại trái cây tiếp theo (`FruitID`, `FruitName`, `Price`), sắp xếp theo `Price DESC, FruitID ASC`.
- **Gợi ý tư duy**: Công thức Keyset複合 (Composite Keyset) đảm bảo không bao giờ bị sót hoặc lặp dòng khi có 2 sản phẩm trùng giá!

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT TOP 4 FruitID, FruitName, Price
FROM Fruits
WHERE Price < 200000 OR (Price = 200000 AND FruitID > 9)
ORDER BY Price DESC, FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Price
FROM Fruits
WHERE Price < 200000 OR (Price = 200000 AND FruitID > 9)
ORDER BY Price DESC, FruitID ASC
LIMIT 4;
```

**Kết quả kỳ vọng (`expected` — 4 dòng × 3 cột):**

| FruitID | FruitName | Price |
| :--- | :--- | :--- |
| 8 | Kiwi Vàng | 180000 |
| 1 | Sầu Riêng Ri6 | 150000 |
| 12 | Nho khô Ninh Thuận | 120000 |
| 4 | Măng Cụt Lái Thiêu | 95000 |

#### [FS-CH12-07] Bài 12.7: Tạo chuỗi tóm tắt các món hàng trong mỗi đơn (STRING_AGG / GROUP_CONCAT) cho Mobile App

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Gom danh sách mặt hàng thành chuỗi tóm tắt cho DTO Đơn hàng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `STRING_AGG(f.FruitName, ', ') / GROUP_CONCAT(f.FruitName, ', ')`
- **Đề bài**: Trên màn hình danh sách đơn hàng của Mobile App, mỗi thẻ đơn hàng cần hiển thị 1 dòng tóm tắt các loại trái cây đã mua (ví dụ `'Xoài Cát Hòa Lộc, Bưởi Da Xanh'`). Hãy kết nối `Orders o`, `OrderDetails od`, `Fruits f`, gom nhóm theo `o.OrderID, o.TotalAmount` và dùng `GROUP_CONCAT(f.FruitName, ', ')` (T-SQL: `STRING_AGG(f.FruitName, ', ')`) đặt tên là `ItemsSummary`. Sắp xếp theo `o.OrderID` tăng dần.
- **Gợi ý tư duy**: Hàm `STRING_AGG` (T-SQL) / `GROUP_CONCAT` (SQLite) giúp gom toàn bộ danh sách tên món con lên 1 dòng duy nhất cho Backend DTO!

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT o.OrderID, o.TotalAmount,
       STRING_AGG(f.FruitName, N', ') WITHIN GROUP (ORDER BY od.OrderDetailID ASC) AS ItemsSummary
FROM Orders o
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
INNER JOIN Fruits f ON od.FruitID = f.FruitID
GROUP BY o.OrderID, o.TotalAmount
ORDER BY o.OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT o.OrderID, o.TotalAmount,
       GROUP_CONCAT(f.FruitName, ', ') AS ItemsSummary
FROM Orders o
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
INNER JOIN Fruits f ON od.FruitID = f.FruitID
GROUP BY o.OrderID, o.TotalAmount
ORDER BY o.OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 10 dòng × 3 cột):**

| OrderID | TotalAmount | ItemsSummary |
| :--- | :--- | :--- |
| 1 | 850000 | Nho Mẫu Đơn Shine Muscat |
| 2 | 180000 | Xoài Cát Hòa Lộc, Bưởi Da Xanh |
| 3 | 150000 | Sầu Riêng Ri6 |
| 4 | 850000 | Táo Envy, Cherry Đỏ Thẫm |
| 5 | 2500000 | Nho Mẫu Đơn Shine Muscat, Cherry Đỏ Thẫm |
| 6 | 300000 | Việt Quất (Blueberry) |
| 7 | 180000 | Kiwi Vàng |
| 8 | 200000 | Dâu Tây Mộc Châu |
| 9 | 400000 | Cherry Đỏ Thẫm |
| 10 | 95000 | Măng Cụt Lái Thiêu |

#### [FS-CH12-08] Bài 12.8: Viết truy vấn Batch Loader nạp chi tiết mặt hàng cho một danh sách OrderID cùng lúc

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Truy vấn Batch Fetching `WHERE ID IN (...)` cho DataLoader / GraphQL)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SELECT ... FROM OrderDetails od INNER JOIN Fruits f ... WHERE od.OrderID IN (1, 2, 4, 5)`
- **Đề bài**: Khi dùng mẫu thiết kế **Batch Loader** (trong Spring Boot / EF Core / GraphQL DataLoader), sau khi lấy ra danh sách các đơn hàng có giá trị lớn (`OrderID IN (1, 4, 5)`), Backend chỉ bắn ra đúng **1 câu SQL duy nhất** dùng `WHERE od.OrderID IN (1, 4, 5)` để nạp toàn bộ chi tiết món hàng của cả 3 đơn đó. Hãy lấy ra `od.OrderID`, `od.OrderDetailID`, `f.FruitName`, `od.Quantity`, `od.SubTotal`, sắp xếp theo `od.OrderID ASC, od.OrderDetailID ASC`.
- **Gợi ý tư duy**: Dùng `WHERE od.OrderID IN (1, 4, 5)` thay vì chạy vòng lặp `for` gọi 3 câu SQL riêng lẻ.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT od.OrderID, od.OrderDetailID, f.FruitName, od.Quantity, od.SubTotal
FROM OrderDetails od
INNER JOIN Fruits f ON od.FruitID = f.FruitID
WHERE od.OrderID IN (1, 4, 5)
ORDER BY od.OrderID ASC, od.OrderDetailID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT od.OrderID, od.OrderDetailID, f.FruitName, od.Quantity, od.SubTotal
FROM OrderDetails od
INNER JOIN Fruits f ON od.FruitID = f.FruitID
WHERE od.OrderID IN (1, 4, 5)
ORDER BY od.OrderID ASC, od.OrderDetailID ASC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 5 cột):**

| OrderID | OrderDetailID | FruitName | Quantity | SubTotal |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | Nho Mẫu Đơn Shine Muscat | 1 | 850000 |
| 4 | 5 | Táo Envy | 2 | 500000 |
| 4 | 6 | Cherry Đỏ Thẫm | 1 | 450000 |
| 5 | 7 | Nho Mẫu Đơn Shine Muscat | 2 | 1700000 |
| 5 | 8 | Cherry Đỏ Thẫm | 2 | 900000 |

#### [FS-CH12-09] Bài 12.9: Kỹ thuật lấy TotalCount ngay trong cùng câu truy vấn phân trang bằng COUNT(*) OVER ()

- **Cấp độ & Nhóm phản xạ**: `Nâng cao (Truy vấn trả về cả Dữ liệu trang hiện tại lẫn Tổng số bản ghi TotalCount trong 1 lần gọi DB)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `COUNT(*) OVER () AS TotalMatchingRows kết hợp với phân trang`
- **Đề bài**: Để giao diện Web hiển thị thanh phân trang `'Đang xem 1-5 trên tổng số X sản phẩm'` mà không phải chạy 2 câu SQL (`SELECT COUNT(*)` rồi `SELECT ... LIMIT 5`), hãy dùng hàm cửa sổ `COUNT(*) OVER () AS TotalMatchingRows` lấy ra trang đầu tiên (5 dòng đầu) của các loại trái cây đang còn hàng (`StockQuantity > 0`), gồm `FruitID`, `FruitName`, `Price`, `TotalMatchingRows`. Sắp xếp theo `Price DESC, FruitID ASC`.
- **Gợi ý tư duy**: `COUNT(*) OVER ()` được tính trước khi cắt `TOP 5` / `LIMIT 5`, nên mỗi dòng trả về đều mang theo tổng số bản ghi thỏa điều kiện `WHERE` (là 13 mặt hàng còn tồn kho).

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT TOP 5 FruitID, FruitName, Price,
       COUNT(*) OVER () AS TotalMatchingRows
FROM Fruits
WHERE StockQuantity > 0
ORDER BY Price DESC, FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Price,
       COUNT(*) OVER () AS TotalMatchingRows
FROM Fruits
WHERE StockQuantity > 0
ORDER BY Price DESC, FruitID ASC
LIMIT 5;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 4 cột):**

| FruitID | FruitName | Price | TotalMatchingRows |
| :--- | :--- | :--- | :--- |
| 5 | Nho Mẫu Đơn Shine Muscat | 850000 | 13 |
| 7 | Cherry Đỏ Thẫm | 450000 | 13 |
| 10 | Việt Quất (Blueberry) | 350000 | 13 |
| 14 | Hạt Mắc Ca | 280000 | 13 |
| 6 | Táo Envy | 250000 | 13 |

#### [FS-CH12-10] Bài 12.10: Xây dựng truy vấn tổng hợp Customer 360° Profile DTO cho Backend Microservice

- **Cấp độ & Nhóm phản xạ**: `Thực chiến (Xây dựng truy vấn Dashboard API 360-độ cho Khách hàng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `Tổng hợp thông tin Profile + Tổng đơn + Tổng chi tiêu + Số lượt Review + Hạng đề xuất trong 1 query`
- **Đề bài**: Viết câu truy vấn cung cấp dữ liệu cho API `GET /api/customers/360-profile` cho tất cả 8 khách hàng: Lấy ra `CustomerID`, `FullName`, `CustomerType`, tổng số đơn hàng (`TotalOrders`), tổng tiền đã mua (`LifetimeValue`), và tổng số đánh giá đã viết (`TotalReviews`). Lưu ý: Không được nhân bản số dòng khi nối cả `Orders` lẫn `Reviews` (hãy dùng Subquery hoặc CTE gom nhóm riêng từng bảng trước khi `LEFT JOIN` vào `Customers`). Sắp xếp theo `LifetimeValue` giảm dần, `CustomerID` tăng dần.
- **Gợi ý tư duy**: Nếu `LEFT JOIN Orders` rồi `LEFT JOIN Reviews` trực tiếp trong cùng 1 cấp sẽ bị tích Đề-các (Fan-out Trap)! Hãy gom nhóm `Orders` trong CTE 1 và `Reviews` trong CTE 2 rồi nối vào `Customers`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
WITH OrderAgg AS (
    SELECT CustomerID, COUNT(*) AS TotalOrders, SUM(TotalAmount) AS LifetimeValue
    FROM Orders
    GROUP BY CustomerID
),
ReviewAgg AS (
    SELECT CustomerID, COUNT(*) AS TotalReviews
    FROM Reviews
    GROUP BY CustomerID
)
SELECT c.CustomerID, c.FullName, c.CustomerType,
       COALESCE(oa.TotalOrders, 0) AS TotalOrders,
       COALESCE(oa.LifetimeValue, 0) AS LifetimeValue,
       COALESCE(ra.TotalReviews, 0) AS TotalReviews
FROM Customers c
LEFT JOIN OrderAgg oa ON c.CustomerID = oa.CustomerID
LEFT JOIN ReviewAgg ra ON c.CustomerID = ra.CustomerID
ORDER BY LifetimeValue DESC, c.CustomerID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
WITH OrderAgg AS (
    SELECT CustomerID, COUNT(*) AS TotalOrders, SUM(TotalAmount) AS LifetimeValue
    FROM Orders
    GROUP BY CustomerID
),
ReviewAgg AS (
    SELECT CustomerID, COUNT(*) AS TotalReviews
    FROM Reviews
    GROUP BY CustomerID
)
SELECT c.CustomerID, c.FullName, c.CustomerType,
       COALESCE(oa.TotalOrders, 0) AS TotalOrders,
       COALESCE(oa.LifetimeValue, 0) AS LifetimeValue,
       COALESCE(ra.TotalReviews, 0) AS TotalReviews
FROM Customers c
LEFT JOIN OrderAgg oa ON c.CustomerID = oa.CustomerID
LEFT JOIN ReviewAgg ra ON c.CustomerID = ra.CustomerID
ORDER BY LifetimeValue DESC, c.CustomerID ASC;
```

**Kết quả kỳ vọng (`expected` — 8 dòng × 6 cột):**

| CustomerID | FullName | CustomerType | TotalOrders | LifetimeValue | TotalReviews |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Võ Thành Tài | VIP | 3 | 3550000 | 1 |
| 4 | Triệu Mẫn | VIP | 2 | 1250000 | 1 |
| 5 | Chu Chỉ Nhược | Standard | 1 | 300000 | 1 |
| 2 | Nguyễn Thị Lệ | Standard | 1 | 180000 | 1 |
| 6 | Ân Ly | Standard | 1 | 180000 | 0 |
| 3 | Trương Vô Kỵ | Standard | 1 | 150000 | 0 |
| 7 | Tiểu Chiêu | Standard | 1 | 95000 | 0 |
| 8 | Dương Quá | Standard | 0 | 0 | 0 |

### Chương 13: T-SQL Nâng Cao: Xử Lý JSON, PIVOT Báo Cáo Chéo, CROSS APPLY & Phân Tích Chuỗi Thời Gian

- **Mục tiêu phản xạ của chương**: Rèn phản xạ bóc tách dữ liệu bán cấu trúc từ cột `Fruits.AttributesJSON` (JSON_VALUE / json_extract), xoay bảng báo cáo đa chiều (PIVOT / Conditional CASE WHEN), lấy Top N mỗi nhóm bằng CROSS APPLY / Correlated Subquery và phân tích Cohort/Time-series.

#### [FS-CH13-01] Bài 13.1: Bóc tách hương vị ($.Taste) từ cột AttributesJSON của bảng Fruits

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A1 - Trích xuất thuộc tính JSON $.Taste từ cột AttributesJSON)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `JSON_VALUE(AttributesJSON, '$.Taste') / json_extract(AttributesJSON, '$.Taste')`
- **Đề bài**: Bảng `Fruits` lưu trữ thuộc tính động trong cột `AttributesJSON`. Hãy trích xuất giá trị khóa `'$.Taste'` đặt tên là `Taste` cùng với `FruitID`, `FruitName`, `Price` cho tất cả các loại trái cây có `AttributesJSON IS NOT NULL`. Sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Trong T-SQL dùng `JSON_VALUE(AttributesJSON, '$.Taste')`. Trong SQLite dùng `json_extract(AttributesJSON, '$.Taste')`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, Price,
       JSON_VALUE(AttributesJSON, '$.Taste') AS Taste
FROM Fruits
WHERE AttributesJSON IS NOT NULL
ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Price,
       json_extract(AttributesJSON, '$.Taste') AS Taste
FROM Fruits
WHERE AttributesJSON IS NOT NULL
ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 12 dòng × 4 cột):**

| FruitID | FruitName | Price | Taste |
| :--- | :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | 150000 | Sweet |
| 2 | Bưởi Da Xanh | 70000 | Sour |
| 3 | Xoài Cát Hòa Lộc | 80000 | Sweet |
| 4 | Măng Cụt Lái Thiêu | 95000 | Sweet-Sour |
| 5 | Nho Mẫu Đơn Shine Muscat | 850000 | Very Sweet |
| 6 | Táo Envy | 250000 | Crisp Sweet |
| 7 | Cherry Đỏ Thẫm | 450000 | Sweet |
| 8 | Kiwi Vàng | 180000 | Sweet-Sour |
| 9 | Dâu Tây Mộc Châu | 200000 | Sour |
| 10 | Việt Quất (Blueberry) | 350000 | Sweet-Sour |
| 11 | Mâm Xôi Đen | 320000 | Sour |
| 14 | Hạt Mắc Ca | 280000 | Rich |

#### [FS-CH13-02] Bài 13.2: Bóc tách màu sắc ($.Color) từ cột AttributesJSON và lọc các loại quả có thông tin màu sắc

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A2 - Trích xuất thuộc tính JSON $.Color và lọc theo giá trị JSON)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `JSON_VALUE(AttributesJSON, '$.Color') / json_extract(AttributesJSON, '$.Color') (Cùng cơ chế Bài 13.1 nhưng trích xuất $.Color)`
- **Đề bài**: Áp dụng y hệt cơ chế trích xuất JSON của Bài 13.1 nhưng với khóa `'$.Color'`: Hãy lấy ra `FruitID`, `FruitName`, `Origin` và màu sắc `FruitColor` (`json_extract(AttributesJSON, '$.Color')` / `JSON_VALUE(AttributesJSON, '$.Color')`) của những loại trái cây có khai báo khóa `'$.Color'` (`IS NOT NULL`). Sắp xếp theo `FruitID` tăng dần.
- **Gợi ý tư duy**: Lọc `WHERE json_extract(AttributesJSON, '$.Color') IS NOT NULL` (hoặc `JSON_VALUE(AttributesJSON, '$.Color') IS NOT NULL`).

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, Origin,
       JSON_VALUE(AttributesJSON, '$.Color') AS FruitColor
FROM Fruits
WHERE JSON_VALUE(AttributesJSON, '$.Color') IS NOT NULL
ORDER BY FruitID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Origin,
       json_extract(AttributesJSON, '$.Color') AS FruitColor
FROM Fruits
WHERE json_extract(AttributesJSON, '$.Color') IS NOT NULL
ORDER BY FruitID ASC;
```

**Kết quả kỳ vọng (`expected` — 6 dòng × 4 cột):**

| FruitID | FruitName | Origin | FruitColor |
| :--- | :--- | :--- | :--- |
| 1 | Sầu Riêng Ri6 | Bến Tre | Yellow |
| 2 | Bưởi Da Xanh | Bến Tre | Green |
| 4 | Măng Cụt Lái Thiêu | Bình Dương | Purple |
| 6 | Táo Envy | Mỹ | Red |
| 7 | Cherry Đỏ Thẫm | Úc | Dark Red |
| 9 | Dâu Tây Mộc Châu | Sơn La | Red |

#### [FS-CH13-03] Bài 13.3: Lọc danh sách trái cây có vị Chua hoặc Chua ngọt từ dữ liệu JSON

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu A3 - Lọc các loại trái cây có vị Chua 'Sour' hoặc 'Sweet-Sour' trong JSON)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `WHERE json_extract(AttributesJSON, '$.Taste') IN ('Sour', 'Sweet-Sour') (Cùng cơ chế JSON trên khóa $.Taste)`
- **Đề bài**: Tiếp tục phản xạ truy vấn JSON: Hãy lấy ra `FruitID`, `FruitName`, `Price` và `Taste` của những loại trái cây có thuộc tính `'$.Taste'` trong `AttributesJSON` là `'Sour'` hoặc `'Sweet-Sour'`. Sắp xếp theo `Price` tăng dần.
- **Gợi ý tư duy**: Dùng `WHERE json_extract(AttributesJSON, '$.Taste') IN ('Sour', 'Sweet-Sour')`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT FruitID, FruitName, Price,
       JSON_VALUE(AttributesJSON, '$.Taste') AS Taste
FROM Fruits
WHERE JSON_VALUE(AttributesJSON, '$.Taste') IN ('Sour', 'Sweet-Sour')
ORDER BY Price ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT FruitID, FruitName, Price,
       json_extract(AttributesJSON, '$.Taste') AS Taste
FROM Fruits
WHERE json_extract(AttributesJSON, '$.Taste') IN ('Sour', 'Sweet-Sour')
ORDER BY Price ASC;
```

**Kết quả kỳ vọng (`expected` — 6 dòng × 4 cột):**

| FruitID | FruitName | Price | Taste |
| :--- | :--- | :--- | :--- |
| 2 | Bưởi Da Xanh | 70000 | Sour |
| 4 | Măng Cụt Lái Thiêu | 95000 | Sweet-Sour |
| 8 | Kiwi Vàng | 180000 | Sweet-Sour |
| 9 | Dâu Tây Mộc Châu | 200000 | Sour |
| 11 | Mâm Xôi Đen | 320000 | Sour |
| 10 | Việt Quất (Blueberry) | 350000 | Sweet-Sour |

#### [FS-CH13-04] Bài 13.4: Xoay bảng (PIVOT) doanh thu của từng Nhân viên bán hàng theo 4 cột Trạng thái đơn hàng

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B1 - Xoay bảng PIVOT doanh thu theo Trạng thái đơn hàng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SUM(CASE WHEN Col = 'Val1' THEN Amount ELSE 0 END) AS Val1_Col`
- **Đề bài**: Sử dụng kỹ thuật Conditional Aggregation (hoặc `PIVOT`), hãy tạo báo cáo chéo cho từng nhân viên có đơn hàng (`EmployeeID`, `FullName`): hiển thị doanh thu ở 4 cột trạng thái: `DeliveredRev` (`Status = 'Đã giao'`), `ShippingRev` (`Status = 'Đang giao'`), `PendingRev` (`Status = 'Chờ xử lý'`), và `CancelledRev` (`Status = 'Đã hủy'`). Sắp xếp theo `EmployeeID` tăng dần.
- **Gợi ý tư duy**: Dùng `SUM(CASE WHEN o.Status = 'Đã giao' THEN o.TotalAmount ELSE 0 END) AS DeliveredRev` cho từng cột.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT e.EmployeeID, e.FullName,
       SUM(CASE WHEN o.Status = N'Đã giao' THEN o.TotalAmount ELSE 0 END) AS DeliveredRev,
       SUM(CASE WHEN o.Status = N'Đang giao' THEN o.TotalAmount ELSE 0 END) AS ShippingRev,
       SUM(CASE WHEN o.Status = N'Chờ xử lý' THEN o.TotalAmount ELSE 0 END) AS PendingRev,
       SUM(CASE WHEN o.Status = N'Đã hủy' THEN o.TotalAmount ELSE 0 END) AS CancelledRev
FROM Employees e
INNER JOIN Orders o ON e.EmployeeID = o.EmployeeID
GROUP BY e.EmployeeID, e.FullName
ORDER BY e.EmployeeID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT e.EmployeeID, e.FullName,
       SUM(CASE WHEN o.Status = 'Đã giao' THEN o.TotalAmount ELSE 0 END) AS DeliveredRev,
       SUM(CASE WHEN o.Status = 'Đang giao' THEN o.TotalAmount ELSE 0 END) AS ShippingRev,
       SUM(CASE WHEN o.Status = 'Chờ xử lý' THEN o.TotalAmount ELSE 0 END) AS PendingRev,
       SUM(CASE WHEN o.Status = 'Đã hủy' THEN o.TotalAmount ELSE 0 END) AS CancelledRev
FROM Employees e
INNER JOIN Orders o ON e.EmployeeID = o.EmployeeID
GROUP BY e.EmployeeID, e.FullName
ORDER BY e.EmployeeID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 6 cột):**

| EmployeeID | FullName | DeliveredRev | ShippingRev | PendingRev | CancelledRev |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 6 | Hoàng Cúc | 3530000 | 200000 | 95000 | 180000 |
| 7 | Đinh Hợi | 1300000 | 0 | 400000 | 0 |

#### [FS-CH13-05] Bài 13.5: Xoay bảng (PIVOT) so sánh chi tiêu năm 2023 và năm 2024 của từng khách hàng

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B2 - Xoay bảng PIVOT doanh thu theo Năm 2023 vs 2024 cho từng Khách hàng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SUM(CASE WHEN Year = 2023 THEN ... END) AS Rev2023, SUM(CASE WHEN Year = 2024 THEN ... END) AS Rev2024 (Cùng cơ chế PIVOT Bài 13.4)`
- **Đề bài**: Áp dụng y hệt kỹ thuật xoay cột `PIVOT` của Bài 13.4 nhưng theo trục thời gian (`2023` vs `2024`) cho các khách hàng có đặt đơn: Lấy ra `CustomerID`, `FullName`, tổng tiền đơn năm 2023 (`Rev2023`), tổng tiền đơn năm 2024 (`Rev2024`), và tổng cộng 2 năm (`TotalRev`). Sắp xếp theo `TotalRev` giảm dần.
- **Gợi ý tư duy**: Dùng `SUM(CASE WHEN OrderDate >= '2023-01-01' AND OrderDate < '2024-01-01' THEN o.TotalAmount ELSE 0 END) AS Rev2023` (vừa xoay bảng PIVOT vừa chuẩn SARGable!).

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT c.CustomerID, c.FullName,
       SUM(CASE WHEN o.OrderDate >= '2023-01-01' AND o.OrderDate < '2024-01-01' THEN o.TotalAmount ELSE 0 END) AS Rev2023,
       SUM(CASE WHEN o.OrderDate >= '2024-01-01' AND o.OrderDate < '2025-01-01' THEN o.TotalAmount ELSE 0 END) AS Rev2024,
       SUM(o.TotalAmount) AS TotalRev
FROM Customers c
INNER JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.FullName
ORDER BY TotalRev DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT c.CustomerID, c.FullName,
       SUM(CASE WHEN o.OrderDate >= '2023-01-01' AND o.OrderDate < '2024-01-01' THEN o.TotalAmount ELSE 0 END) AS Rev2023,
       SUM(CASE WHEN o.OrderDate >= '2024-01-01' AND o.OrderDate < '2025-01-01' THEN o.TotalAmount ELSE 0 END) AS Rev2024,
       SUM(o.TotalAmount) AS TotalRev
FROM Customers c
INNER JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.FullName
ORDER BY TotalRev DESC;
```

**Kết quả kỳ vọng (`expected` — 7 dòng × 5 cột):**

| CustomerID | FullName | Rev2023 | Rev2024 | TotalRev |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Võ Thành Tài | 3350000 | 200000 | 3550000 |
| 4 | Triệu Mẫn | 850000 | 400000 | 1250000 |
| 5 | Chu Chỉ Nhược | 0 | 300000 | 300000 |
| 2 | Nguyễn Thị Lệ | 180000 | 0 | 180000 |
| 6 | Ân Ly | 0 | 180000 | 180000 |
| 3 | Trương Vô Kỵ | 150000 | 0 | 150000 |
| 7 | Tiểu Chiêu | 0 | 95000 | 95000 |

#### [FS-CH13-06] Bài 13.6: Xoay bảng (PIVOT) doanh thu thực thu theo 3 kênh thanh toán (VNPAY, Momo, Tiền mặt) cho từng Nhân viên

- **Cấp độ & Nhóm phản xạ**: `Cơ bản (Mẫu B3 - Xoay bảng PIVOT số tiền thu được theo Phương thức thanh toán cho từng Nhân viên)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `SUM(CASE WHEN PaymentMethod = 'VNPAY' THEN ... END) (Cùng cơ chế PIVOT Bài 13.4 & 13.5 nhưng trên PaymentTransactions)`
- **Đề bài**: Tiếp tục phản xạ xoay cột `PIVOT` bằng cách nối `Employees e` -> `Orders o` -> `PaymentTransactions pt`: Gom nhóm theo `e.EmployeeID, e.FullName` và xoay 3 cột tiền thu qua `'VNPAY'` (`VnpayAmount`), `'Momo'` (`MomoAmount`), và `'Tiền mặt'` (`CashAmount`). Sắp xếp theo `e.EmployeeID` tăng dần.
- **Gợi ý tư duy**: Dùng `SUM(CASE WHEN pt.PaymentMethod = 'VNPAY' THEN pt.Amount ELSE 0 END) AS VnpayAmount`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT e.EmployeeID, e.FullName,
       SUM(CASE WHEN pt.PaymentMethod = N'VNPAY' THEN pt.Amount ELSE 0 END) AS VnpayAmount,
       SUM(CASE WHEN pt.PaymentMethod = N'Momo' THEN pt.Amount ELSE 0 END) AS MomoAmount,
       SUM(CASE WHEN pt.PaymentMethod = N'Tiền mặt' THEN pt.Amount ELSE 0 END) AS CashAmount
FROM Employees e
INNER JOIN Orders o ON e.EmployeeID = o.EmployeeID
INNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID
GROUP BY e.EmployeeID, e.FullName
ORDER BY e.EmployeeID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT e.EmployeeID, e.FullName,
       SUM(CASE WHEN pt.PaymentMethod = 'VNPAY' THEN pt.Amount ELSE 0 END) AS VnpayAmount,
       SUM(CASE WHEN pt.PaymentMethod = 'Momo' THEN pt.Amount ELSE 0 END) AS MomoAmount,
       SUM(CASE WHEN pt.PaymentMethod = 'Tiền mặt' THEN pt.Amount ELSE 0 END) AS CashAmount
FROM Employees e
INNER JOIN Orders o ON e.EmployeeID = o.EmployeeID
INNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID
GROUP BY e.EmployeeID, e.FullName
ORDER BY e.EmployeeID ASC;
```

**Kết quả kỳ vọng (`expected` — 2 dòng × 5 cột):**

| EmployeeID | FullName | VnpayAmount | MomoAmount | CashAmount |
| :--- | :--- | :--- | :--- | :--- |
| 6 | Hoàng Cúc | 3350000 | 0 | 200000 |
| 7 | Đinh Hợi | 850000 | 450000 | 0 |

#### [FS-CH13-07] Bài 13.7: Phân tích thị hiếu khách hàng: Hương vị trái cây nào ($.Taste trong JSON) mang lại doanh thu cao nhất?

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Thống kê doanh thu theo hương vị JSON $.Taste kết hợp JOIN OrderDetails)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `GROUP BY JSON_VALUE(f.AttributesJSON, '$.Taste')`
- **Đề bài**: Hãy kết nối `Fruits f` với `OrderDetails od`, trích xuất hương vị `Taste = COALESCE(json_extract(f.AttributesJSON, '$.Taste'), 'Unknown')` (T-SQL: `JSON_VALUE`), gom nhóm theo `Taste` để tính tổng số lượng bán (`TotalQty = SUM(od.Quantity)`) và tổng doanh thu (`TasteRevenue = SUM(od.SubTotal)`). Sắp xếp theo `TasteRevenue` giảm dần.
- **Gợi ý tư duy**: Kết hợp hàm bóc tách JSON trực tiếp trong `SELECT` và `GROUP BY` cùng với bảng giao dịch `OrderDetails`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT COALESCE(JSON_VALUE(f.AttributesJSON, '$.Taste'), 'Unknown') AS Taste,
       SUM(od.Quantity) AS TotalQty,
       SUM(od.SubTotal) AS TasteRevenue
FROM Fruits f
INNER JOIN OrderDetails od ON f.FruitID = od.FruitID
GROUP BY COALESCE(JSON_VALUE(f.AttributesJSON, '$.Taste'), 'Unknown')
ORDER BY TasteRevenue DESC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT COALESCE(json_extract(f.AttributesJSON, '$.Taste'), 'Unknown') AS Taste,
       SUM(od.Quantity) AS TotalQty,
       SUM(od.SubTotal) AS TasteRevenue
FROM Fruits f
INNER JOIN OrderDetails od ON f.FruitID = od.FruitID
GROUP BY COALESCE(json_extract(f.AttributesJSON, '$.Taste'), 'Unknown')
ORDER BY TasteRevenue DESC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 3 cột):**

| Taste | TotalQty | TasteRevenue |
| :--- | :--- | :--- |
| Very Sweet | 3 | 2550000 |
| Sweet | 7 | 2110000 |
| Sweet-Sour | 3 | 625000 |
| Crisp Sweet | 2 | 500000 |
| Sour | 2 | 270000 |

#### [FS-CH13-08] Bài 13.8: Bóc tách mảng JSON $.Vitamins để liệt kê từng loại Vitamin có trong mỗi loại trái cây

- **Cấp độ & Nhóm phản xạ**: `Trung cấp (Bóc tách mảng JSON $.Vitamins bằng OPENJSON / json_each)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CROSS APPLY OPENJSON(f.AttributesJSON, '$.Vitamins') / json_each(f.AttributesJSON, '$.Vitamins')`
- **Đề bài**: Một số loại trái cây trong bảng `Fruits` có thuộc tính mảng `'$.Vitamins'` (ví dụ `["C", "A"]`, `["C", "K"]`). Hãy dùng `OPENJSON(f.AttributesJSON, '$.Vitamins')` (T-SQL) hoặc `json_each(f.AttributesJSON, '$.Vitamins')` (SQLite) để trải phẳng từng phần tử trong mảng thành các dòng riêng biệt: Lấy ra `FruitID`, `FruitName`, và tên `Vitamin` (`value`). Sắp xếp theo `FruitID` tăng dần, `Vitamin` tăng dần.
- **Gợi ý tư duy**: Trong SQLite: `FROM Fruits f, json_each(f.AttributesJSON, '$.Vitamins') v WHERE json_extract(f.AttributesJSON, '$.Vitamins') IS NOT NULL`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT f.FruitID, f.FruitName,
       v.value AS Vitamin
FROM Fruits f
CROSS APPLY OPENJSON(f.AttributesJSON, '$.Vitamins') v
WHERE JSON_QUERY(f.AttributesJSON, '$.Vitamins') IS NOT NULL
ORDER BY f.FruitID ASC, Vitamin ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT f.FruitID, f.FruitName,
       v.value AS Vitamin
FROM Fruits f, json_each(f.AttributesJSON, '$.Vitamins') v
WHERE json_extract(f.AttributesJSON, '$.Vitamins') IS NOT NULL
ORDER BY f.FruitID ASC, Vitamin ASC;
```

**Kết quả kỳ vọng (`expected` — 5 dòng × 3 cột):**

| FruitID | FruitName | Vitamin |
| :--- | :--- | :--- |
| 2 | Bưởi Da Xanh | A |
| 2 | Bưởi Da Xanh | C |
| 5 | Nho Mẫu Đơn Shine Muscat | C |
| 5 | Nho Mẫu Đơn Shine Muscat | K |
| 8 | Kiwi Vàng | C |

#### [FS-CH13-09] Bài 13.9: Tìm mặt hàng chiếm giá trị lớn nhất (Hero Item) trong từng đơn hàng (CROSS APPLY / Window CTE)

- **Cấp độ & Nhóm phản xạ**: `Nâng cao (Mô phỏng CROSS APPLY / OUTER APPLY lấy mặt hàng chủ lực của từng Đơn hàng)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CROSS APPLY (SELECT TOP 1 ... FROM OrderDetails od WHERE od.OrderID = o.OrderID ORDER BY od.SubTotal DESC)`
- **Đề bài**: Với mỗi đơn hàng trong bảng `Orders` (`OrderID`, `CustomerID`, `TotalAmount`), hãy tìm ra mặt hàng (`FruitName`, `SubTotal`) có giá trị `SubTotal` cao nhất bên trong đơn hàng đó (nếu bằng nhau lấy `OrderDetailID` nhỏ hơn). Sắp xếp theo `OrderID` tăng dần.
- **Gợi ý tư duy**: Trong T-SQL có thể dùng `CROSS APPLY (SELECT TOP 1 ...)`, hoặc dùng CTE + `ROW_NUMBER() OVER (PARTITION BY od.OrderID ORDER BY od.SubTotal DESC, od.OrderDetailID ASC)` chạy tương thích 100% trên cả T-SQL lẫn SQLite!

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT o.OrderID, o.CustomerID, o.TotalAmount,
       hero.FruitName AS HeroFruit, hero.SubTotal AS HeroSubTotal
FROM Orders o
CROSS APPLY (
    SELECT TOP 1 f.FruitName, od.SubTotal
    FROM OrderDetails od
    INNER JOIN Fruits f ON od.FruitID = f.FruitID
    WHERE od.OrderID = o.OrderID
    ORDER BY od.SubTotal DESC, od.OrderDetailID ASC
) hero
ORDER BY o.OrderID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
WITH RankedItems AS (
    SELECT od.OrderID, f.FruitName, od.SubTotal,
           ROW_NUMBER() OVER (PARTITION BY od.OrderID ORDER BY od.SubTotal DESC, od.OrderDetailID ASC) AS rn
    FROM OrderDetails od
    INNER JOIN Fruits f ON od.FruitID = f.FruitID
)
SELECT o.OrderID, o.CustomerID, o.TotalAmount,
       ri.FruitName AS HeroFruit, ri.SubTotal AS HeroSubTotal
FROM Orders o
INNER JOIN RankedItems ri ON o.OrderID = ri.OrderID AND ri.rn = 1
ORDER BY o.OrderID ASC;
```

**Kết quả kỳ vọng (`expected` — 10 dòng × 5 cột):**

| OrderID | CustomerID | TotalAmount | HeroFruit | HeroSubTotal |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | 850000 | Nho Mẫu Đơn Shine Muscat | 850000 |
| 2 | 2 | 180000 | Xoài Cát Hòa Lộc | 160000 |
| 3 | 3 | 150000 | Sầu Riêng Ri6 | 150000 |
| 4 | 4 | 850000 | Táo Envy | 500000 |
| 5 | 1 | 2500000 | Nho Mẫu Đơn Shine Muscat | 1700000 |
| 6 | 5 | 300000 | Việt Quất (Blueberry) | 350000 |
| 7 | 6 | 180000 | Kiwi Vàng | 180000 |
| 8 | 1 | 200000 | Dâu Tây Mộc Châu | 200000 |
| 9 | 4 | 400000 | Cherry Đỏ Thẫm | 450000 |
| 10 | 7 | 95000 | Măng Cụt Lái Thiêu | 95000 |

#### [FS-CH13-10] Bài 13.10: Bài toán Capstone RFM Analysis: Phân khúc toàn bộ tập khách hàng của FruitStore_Ultimate

- **Cấp độ & Nhóm phản xạ**: `Thực chiến (Phân tích RFM - Recency, Frequency, Monetary phân hạng khách hàng toàn diện)`
- **Khuôn mẫu cú pháp (Syntax Pattern)**: `CTE tổng hợp Recency (LastOrderDate), Frequency (OrderCount), Monetary (TotalSpend) + Phân nhóm RFM`
- **Đề bài**: Hãy viết một truy vấn phân tích **RFM (Recency - Frequency - Monetary)** cho toàn bộ 8 khách hàng trong bảng `Customers`: Lấy ra `CustomerID`, `FullName`, ngày mua hàng gần nhất (`LastOrderDate = COALESCE(MAX(SUBSTR(o.OrderDate, 1, 10)), 'Chưa mua')`), tần suất mua hàng (`Frequency = COUNT(o.OrderID)`), tổng chi tiêu (`Monetary = COALESCE(SUM(o.TotalAmount), 0)`), và phân khúc `RFMSegment` theo quy tắc: Nếu `COALESCE(SUM(o.TotalAmount), 0) >= 1000000` là `'Champion (Kim Cương)'`, nếu `COUNT(o.OrderID) >= 1` là `'Active (Thân thiết)'`, ngược lại là `'Lead (Tiềm năng mới)'`. Sắp xếp theo `Monetary` giảm dần, `CustomerID` tăng dần.
- **Gợi ý tư duy**: Dùng `LEFT JOIN Orders o ON c.CustomerID = o.CustomerID` và gom nhóm theo `c.CustomerID, c.FullName`.

**Code chuẩn T-SQL (SQL Server / SSMS):**
```sql
SELECT c.CustomerID, c.FullName,
       COALESCE(MAX(CONVERT(VARCHAR(10), o.OrderDate, 120)), N'Chưa mua') AS LastOrderDate,
       COUNT(o.OrderID) AS Frequency,
       COALESCE(SUM(o.TotalAmount), 0) AS Monetary,
       CASE
           WHEN COALESCE(SUM(o.TotalAmount), 0) >= 1000000 THEN N'Champion (Kim Cương)'
           WHEN COUNT(o.OrderID) >= 1 THEN N'Active (Thân thiết)'
           ELSE N'Lead (Tiềm năng mới)'
       END AS RFMSegment
FROM Customers c
LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.FullName
ORDER BY Monetary DESC, c.CustomerID ASC;
```

**Code chuẩn SQLite (Chạy & Chấm điểm trực tiếp trong SQL Lab):**
```sql
SELECT c.CustomerID, c.FullName,
       COALESCE(MAX(SUBSTR(o.OrderDate, 1, 10)), 'Chưa mua') AS LastOrderDate,
       COUNT(o.OrderID) AS Frequency,
       COALESCE(SUM(o.TotalAmount), 0) AS Monetary,
       CASE
           WHEN COALESCE(SUM(o.TotalAmount), 0) >= 1000000 THEN 'Champion (Kim Cương)'
           WHEN COUNT(o.OrderID) >= 1 THEN 'Active (Thân thiết)'
           ELSE 'Lead (Tiềm năng mới)'
       END AS RFMSegment
FROM Customers c
LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.FullName
ORDER BY Monetary DESC, c.CustomerID ASC;
```

**Kết quả kỳ vọng (`expected` — 8 dòng × 6 cột):**

| CustomerID | FullName | LastOrderDate | Frequency | Monetary | RFMSegment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Võ Thành Tài | 2024-03-01 | 3 | 3550000 | Champion (Kim Cương) |
| 4 | Triệu Mẫn | 2024-03-05 | 2 | 1250000 | Champion (Kim Cương) |
| 5 | Chu Chỉ Nhược | 2024-01-10 | 1 | 300000 | Active (Thân thiết) |
| 2 | Nguyễn Thị Lệ | 2023-04-20 | 1 | 180000 | Active (Thân thiết) |
| 6 | Ân Ly | 2024-02-14 | 1 | 180000 | Active (Thân thiết) |
| 3 | Trương Vô Kỵ | 2023-06-15 | 1 | 150000 | Active (Thân thiết) |
| 7 | Tiểu Chiêu | 2024-03-10 | 1 | 95000 | Active (Thân thiết) |
| 8 | Dương Quá | Chưa mua | 0 | 0 | Lead (Tiềm năng mới) |

## PHẦN 4: MÃ NGUỒN ĐẦY ĐỦ FILE `src/data/fruitstore-130-drills.js` & LOGIC TÍCH HỢP CHO ANTIGRAVITY

### 4.1. Toàn bộ mã nguồn file `src/data/fruitstore-130-drills.js` (Chứa trọn vẹn 130 bài tập kèm `expected`)

Antigravity chỉ cần tạo file `src/data/fruitstore-130-drills.js` với nội dung dưới đây (tự động đăng ký toàn bộ 130 bài vào từng chương `ch01`..`ch13` VÀ tạo thêm chuyên đề tổng hợp `ch-fruitstore-130`):

```javascript
/**
 * FILE: src/data/fruitstore-130-drills.js
 * Bộ 130 Bài Tập Luyện Phản Xạ Cơ Bắp (Muscle Memory) từ A đến Z trên Database FruitStore_Ultimate
 * Thiết kế: 13 Chương (Chương 1 -> Chương 13) x 10 Bài/Chương = 130 Bài (Đã kiểm chứng kết quả SQLite)
 */
(function () {
  const FRUITSTORE_130_CHAPTERS = [
  {
    "chapter_id": "ch01",
    "chapter_num": 1,
    "chapter_title": "Chương 1: SELECT, WHERE, ORDER BY, NULL & Kiểu Dữ Liệu",
    "pedagogy_goal": "Rèn phản xạ trích xuất cột (Projection), lọc dòng (WHERE), loại trùng (DISTINCT), kiểm tra NULL (IS NULL / IS NOT NULL) và sắp xếp (ORDER BY / TOP-LIMIT) xoay vòng trên cả 9 bảng của FruitStore.",
    "exercises": [
      {
        "id": "FS-CH01-01",
        "level": "Cơ bản (Mẫu A1 - SELECT & Alias)",
        "pattern": "SELECT col1 AS Alias1, col2 AS Alias2 FROM Table ORDER BY col1;",
        "title": "Bài 1.1: Xem danh mục trái cây (Bảng Categories)",
        "question": "Hãy lấy ra mã danh mục (`CategoryID`), tên danh mục (`CategoryName`) và mô tả (`Description`) từ bảng `Categories`, sắp xếp theo `CategoryID` tăng dần.",
        "hint": "Dùng `SELECT CategoryID, CategoryName, Description FROM Categories ORDER BY CategoryID ASC;`",
        "tsql": "SELECT CategoryID, CategoryName, Description\nFROM Categories\nORDER BY CategoryID ASC;",
        "sqlite": "SELECT CategoryID, CategoryName, Description\nFROM Categories\nORDER BY CategoryID ASC;",
        "expected": {
          "cols": [
            "CategoryID",
            "CategoryName",
            "Description"
          ],
          "rows": [
            [
              1,
              "Đặc sản Miền Tây",
              "Trái cây hái tại vườn ĐBSCL"
            ],
            [
              2,
              "Trái cây Nhập khẩu",
              "Táo, Nho, Cherry từ Mỹ, Úc, Nhật"
            ],
            [
              3,
              "Quả mọng (Berries)",
              "Dâu tây, Việt quất, Mâm xôi"
            ],
            [
              4,
              "Trái cây sấy",
              "Đã qua chế biến khô"
            ],
            [
              5,
              "Quả hạch (Nuts)",
              "Mắc ca, Hạnh nhân, Óc chó"
            ]
          ]
        }
      },
      {
        "id": "FS-CH01-02",
        "level": "Cơ bản (Mẫu A2 - SELECT & Alias trên bảng khác)",
        "pattern": "SELECT col1, col2, col3 FROM Table ORDER BY col1; (Cùng cơ chế Bài 1.1 nhưng đổi sang bảng Employees)",
        "title": "Bài 1.2: Xem danh sách nhân sự (Bảng Employees)",
        "question": "Áp dụng y hệt cơ chế Bài 1.1 nhưng trên bảng `Employees`: Hãy lấy ra mã nhân viên (`EmployeeID`), họ tên (`FullName`) và chức vụ (`Role`), sắp xếp theo `EmployeeID` tăng dần.",
        "hint": "Thay tên bảng thành `Employees` và các cột thành `EmployeeID, FullName, Role`.",
        "tsql": "SELECT EmployeeID, FullName, Role\nFROM Employees\nORDER BY EmployeeID ASC;",
        "sqlite": "SELECT EmployeeID, FullName, Role\nFROM Employees\nORDER BY EmployeeID ASC;",
        "expected": {
          "cols": [
            "EmployeeID",
            "FullName",
            "Role"
          ],
          "rows": [
            [
              1,
              "Lê Minh Triết",
              "Giám đốc"
            ],
            [
              2,
              "Nguyễn Tấn Dũng",
              "Quản lý Kho"
            ],
            [
              3,
              "Trần Thị Mai",
              "Quản lý Bán hàng"
            ],
            [
              4,
              "Phạm Văn A",
              "Nhân viên Kho"
            ],
            [
              5,
              "Lý Bạch",
              "Nhân viên Kho"
            ],
            [
              6,
              "Hoàng Cúc",
              "Nhân viên Bán hàng"
            ],
            [
              7,
              "Đinh Hợi",
              "Nhân viên Bán hàng"
            ]
          ]
        }
      },
      {
        "id": "FS-CH01-03",
        "level": "Cơ bản (Mẫu A3 - SELECT & Alias trên bảng khác)",
        "pattern": "SELECT col1, col2, col3 FROM Table ORDER BY col1; (Cùng cơ chế Bài 1.1 & 1.2 nhưng đổi sang bảng Vouchers)",
        "title": "Bài 1.3: Xem danh sách mã giảm giá (Bảng Vouchers)",
        "question": "Tiếp tục phản xạ SELECT cơ bản trên bảng `Vouchers`: Lấy ra mã định danh (`VoucherID`), mã code (`VoucherCode`), số tiền giảm (`DiscountAmount`) và ngày hết hạn (`ExpiryDate`), sắp xếp theo `VoucherID` tăng dần.",
        "hint": "Truy vấn từ bảng `Vouchers` và sắp xếp `ORDER BY VoucherID ASC`.",
        "tsql": "SELECT VoucherID, VoucherCode, DiscountAmount, ExpiryDate\nFROM Vouchers\nORDER BY VoucherID ASC;",
        "sqlite": "SELECT VoucherID, VoucherCode, DiscountAmount, ExpiryDate\nFROM Vouchers\nORDER BY VoucherID ASC;",
        "expected": {
          "cols": [
            "VoucherID",
            "VoucherCode",
            "DiscountAmount",
            "ExpiryDate"
          ],
          "rows": [
            [
              1,
              "WELCOME50",
              50000,
              "2025-12-31"
            ],
            [
              2,
              "VIP100",
              100000,
              "2025-12-31"
            ],
            [
              3,
              "HETHAN",
              30000,
              "2023-12-31"
            ]
          ]
        }
      },
      {
        "id": "FS-CH01-04",
        "level": "Cơ bản (Mẫu B1 - Lọc WHERE so sánh bằng)",
        "pattern": "SELECT ... FROM Table WHERE Col = Value ORDER BY ...;",
        "title": "Bài 1.4: Lọc trái cây theo nguồn gốc Bến Tre (Bảng Fruits)",
        "question": "Lấy ra `FruitID`, `FruitName`, `Price`, `Unit` của các loại trái cây có xuất xứ (`Origin`) là `'Bến Tre'`, sắp xếp theo `FruitID` tăng dần.",
        "hint": "Dùng `WHERE Origin = N'Bến Tre'` (T-SQL) hoặc `WHERE Origin = 'Bến Tre'` (SQLite).",
        "tsql": "SELECT FruitID, FruitName, Price, Unit\nFROM Fruits\nWHERE Origin = N'Bến Tre'\nORDER BY FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName, Price, Unit\nFROM Fruits\nWHERE Origin = 'Bến Tre'\nORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price",
            "Unit"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              150000,
              "Kg"
            ],
            [
              2,
              "Bưởi Da Xanh",
              70000,
              "Quả"
            ]
          ]
        }
      },
      {
        "id": "FS-CH01-05",
        "level": "Cơ bản (Mẫu B2 - Lọc WHERE so sánh bằng trên bảng khác)",
        "pattern": "SELECT ... FROM Table WHERE Col = Value ORDER BY ...; (Cùng cơ chế Bài 1.4 nhưng trên bảng Customers)",
        "title": "Bài 1.5: Lọc khách hàng hạng VIP (Bảng Customers)",
        "question": "Áp dụng y hệt mẫu lọc `WHERE` của Bài 1.4 nhưng trên bảng `Customers`: Lấy ra `CustomerID`, `FullName`, `PhoneNumber`, `Address` của những khách hàng có phân hạng (`CustomerType`) là `'VIP'`, sắp xếp theo `CustomerID` tăng dần.",
        "hint": "Dùng `WHERE CustomerType = 'VIP'` trên bảng `Customers`.",
        "tsql": "SELECT CustomerID, FullName, PhoneNumber, Address\nFROM Customers\nWHERE CustomerType = N'VIP'\nORDER BY CustomerID ASC;",
        "sqlite": "SELECT CustomerID, FullName, PhoneNumber, Address\nFROM Customers\nWHERE CustomerType = 'VIP'\nORDER BY CustomerID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "PhoneNumber",
            "Address"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              "0901111222",
              "Quận 1, TP.HCM"
            ],
            [
              4,
              "Triệu Mẫn",
              "0904444555",
              "Quận 7, TP.HCM"
            ]
          ]
        }
      },
      {
        "id": "FS-CH01-06",
        "level": "Cơ bản (Mẫu B3 - Lọc WHERE so sánh bằng trên bảng khác)",
        "pattern": "SELECT ... FROM Table WHERE Col = Value ORDER BY ...; (Cùng cơ chế Bài 1.4 & 1.5 nhưng trên bảng PaymentTransactions)",
        "title": "Bài 1.6: Lọc giao dịch thanh toán qua VNPAY (Bảng PaymentTransactions)",
        "question": "Tiếp tục mẫu lọc `WHERE` trên bảng `PaymentTransactions`: Lấy ra `TransactionID`, `OrderID`, `Amount`, `PaymentDate` của các giao dịch có phương thức (`PaymentMethod`) là `'VNPAY'`, sắp xếp theo `TransactionID` tăng dần.",
        "hint": "Dùng `WHERE PaymentMethod = 'VNPAY'`.",
        "tsql": "SELECT TransactionID, OrderID, Amount, PaymentDate\nFROM PaymentTransactions\nWHERE PaymentMethod = N'VNPAY'\nORDER BY TransactionID ASC;",
        "sqlite": "SELECT TransactionID, OrderID, Amount, PaymentDate\nFROM PaymentTransactions\nWHERE PaymentMethod = 'VNPAY'\nORDER BY TransactionID ASC;",
        "expected": {
          "cols": [
            "TransactionID",
            "OrderID",
            "Amount",
            "PaymentDate"
          ],
          "rows": [
            [
              1,
              1,
              850000,
              "2023-02-14 10:16:00"
            ],
            [
              4,
              4,
              850000,
              "2023-08-08 16:47:00"
            ],
            [
              5,
              5,
              2500000,
              "2023-12-24 19:05:00"
            ]
          ]
        }
      },
      {
        "id": "FS-CH01-07",
        "level": "Trung cấp (Bẫy 3-Valued Logic với IS NULL)",
        "pattern": "SELECT ... FROM Table WHERE NullableCol IS NULL;",
        "title": "Bài 1.7: Tìm trái cây chưa có thông tin JSON (Bẫy IS NULL trên Fruits)",
        "question": "Lấy ra `FruitID`, `FruitName`, `Origin` của các mặt hàng trong bảng `Fruits` chưa được cập nhật thuộc tính JSON (`AttributesJSON` mang giá trị `NULL`), sắp xếp theo `FruitID` tăng dần.",
        "hint": "Tuyệt đối không dùng `= NULL`! Hãy dùng `WHERE AttributesJSON IS NULL`.",
        "tsql": "SELECT FruitID, FruitName, Origin\nFROM Fruits\nWHERE AttributesJSON IS NULL\nORDER BY FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName, Origin\nFROM Fruits\nWHERE AttributesJSON IS NULL\nORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Origin"
          ],
          "rows": [
            [
              12,
              "Nho khô Ninh Thuận",
              "Ninh Thuận"
            ],
            [
              13,
              "Mít sấy giòn",
              "Đồng Nai"
            ]
          ]
        }
      },
      {
        "id": "FS-CH01-08",
        "level": "Trung cấp (Bẫy IS NULL trên bảng Orders & Employees)",
        "pattern": "SELECT ... FROM Table WHERE NullableCol IS NULL; (Lặp lại phản xạ IS NULL trên bảng Orders)",
        "title": "Bài 1.8: Tìm các đơn hàng không áp dụng mã giảm giá (Bảng Orders)",
        "question": "Áp dụng đúng phản xạ `IS NULL` vừa học ở Bài 1.7 sang bảng `Orders`: Lấy ra `OrderID`, `CustomerID`, `TotalAmount`, `Status` của các đơn hàng không dùng Voucher (`VoucherID` là `NULL`), sắp xếp theo `OrderID` tăng dần.",
        "hint": "Dùng `WHERE VoucherID IS NULL` trên bảng `Orders`.",
        "tsql": "SELECT OrderID, CustomerID, TotalAmount, Status\nFROM Orders\nWHERE VoucherID IS NULL\nORDER BY OrderID ASC;",
        "sqlite": "SELECT OrderID, CustomerID, TotalAmount, Status\nFROM Orders\nWHERE VoucherID IS NULL\nORDER BY OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "TotalAmount",
            "Status"
          ],
          "rows": [
            [
              1,
              1,
              850000,
              "Đã giao"
            ],
            [
              3,
              3,
              150000,
              "Đã giao"
            ],
            [
              7,
              6,
              180000,
              "Đã hủy"
            ],
            [
              8,
              1,
              200000,
              "Đang giao"
            ],
            [
              10,
              7,
              95000,
              "Chờ xử lý"
            ]
          ]
        }
      },
      {
        "id": "FS-CH01-09",
        "level": "Nâng cao (Kết hợp BETWEEN, IN, DISTINCT)",
        "pattern": "SELECT ... FROM Table WHERE Col1 IN (...) AND Col2 BETWEEN x AND y ORDER BY ...;",
        "title": "Bài 1.9: Lọc trái cây nhập khẩu hoặc quả mọng trong tầm giá 150k - 400k",
        "question": "Lấy ra `FruitID`, `FruitName`, `CategoryID`, `Price`, `StockQuantity` của các trái cây thuộc danh mục `2` (Nhập khẩu) hoặc `3` (Quả mọng), có giá (`Price`) từ `150000` đến `400000` và còn hàng (`StockQuantity > 0`). Sắp xếp theo `Price` giảm dần.",
        "hint": "Kết hợp `CategoryID IN (2, 3) AND Price BETWEEN 150000 AND 400000 AND StockQuantity > 0`.",
        "tsql": "SELECT FruitID, FruitName, CategoryID, Price, StockQuantity\nFROM Fruits\nWHERE CategoryID IN (2, 3)\n  AND Price BETWEEN 150000 AND 400000\n  AND StockQuantity > 0\nORDER BY Price DESC;",
        "sqlite": "SELECT FruitID, FruitName, CategoryID, Price, StockQuantity\nFROM Fruits\nWHERE CategoryID IN (2, 3)\n  AND Price BETWEEN 150000 AND 400000\n  AND StockQuantity > 0\nORDER BY Price DESC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "CategoryID",
            "Price",
            "StockQuantity"
          ],
          "rows": [
            [
              10,
              "Việt Quất (Blueberry)",
              3,
              350000,
              20
            ],
            [
              6,
              "Táo Envy",
              2,
              250000,
              100
            ],
            [
              9,
              "Dâu Tây Mộc Châu",
              3,
              200000,
              45
            ],
            [
              8,
              "Kiwi Vàng",
              2,
              180000,
              60
            ]
          ]
        }
      },
      {
        "id": "FS-CH01-10",
        "level": "Thực chiến (TOP N / LIMIT & Biểu thức tính toán)",
        "pattern": "SELECT TOP (N) / LIMIT N với cột tính toán Giá trị tồn kho = Price * StockQuantity",
        "title": "Bài 1.10: Top 5 loại trái cây có tổng giá trị tồn kho lớn nhất",
        "question": "Tính giá trị tồn kho (`InventoryValue = Price * StockQuantity`) cho từng loại trái cây trong bảng `Fruits`. Lấy ra 5 loại trái cây có `InventoryValue` cao nhất (gồm `FruitID`, `FruitName`, `Price`, `StockQuantity`, `InventoryValue`), sắp xếp theo `InventoryValue` giảm dần, nếu bằng nhau thì xếp theo `FruitID` tăng dần.",
        "hint": "Trong T-SQL dùng `SELECT TOP 5 ... ORDER BY InventoryValue DESC, FruitID ASC`. Trong SQLite dùng `LIMIT 5` ở cuối.",
        "tsql": "SELECT TOP 5 FruitID, FruitName, Price, StockQuantity,\n       (Price * StockQuantity) AS InventoryValue\nFROM Fruits\nORDER BY InventoryValue DESC, FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName, Price, StockQuantity,\n       (Price * StockQuantity) AS InventoryValue\nFROM Fruits\nORDER BY InventoryValue DESC, FruitID ASC\nLIMIT 5;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price",
            "StockQuantity",
            "InventoryValue"
          ],
          "rows": [
            [
              12,
              "Nho khô Ninh Thuận",
              120000,
              300,
              36000000
            ],
            [
              14,
              "Hạt Mắc Ca",
              280000,
              90,
              25200000
            ],
            [
              6,
              "Táo Envy",
              250000,
              100,
              25000000
            ],
            [
              3,
              "Xoài Cát Hòa Lộc",
              80000,
              200,
              16000000
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              450000,
              30,
              13500000
            ]
          ]
        }
      }
    ]
  },
  {
    "chapter_id": "ch02",
    "chapter_num": 2,
    "chapter_title": "Chương 2: Hàm Xử Lý Chuỗi, Ngày Tháng, Toán Học, CASE WHEN & COALESCE",
    "pedagogy_goal": "Rèn phản xạ xử lý NULL bằng COALESCE/ISNULL, phân loại dữ liệu bằng CASE WHEN, cắt ghép chuỗi và trích xuất năm/tháng trên dữ liệu thực tế của FruitStore.",
    "exercises": [
      {
        "id": "FS-CH02-01",
        "level": "Cơ bản (Mẫu A1 - COALESCE xử lý NULL)",
        "pattern": "SELECT ..., COALESCE(NullableCol, DefaultVal) AS Alias FROM Table;",
        "title": "Bài 2.1: Thay thế NULL bằng thông báo mặc định cho cột JSON (Bảng Fruits)",
        "question": "Lấy ra `FruitID`, `FruitName` và cột `AttributesJSON`. Nếu `AttributesJSON` là `NULL` thì hiển thị chuỗi `'Chưa có thông số JSON'`, đặt tên cột là `JsonStatus`. Sắp xếp theo `FruitID` tăng dần.",
        "hint": "Dùng `COALESCE(AttributesJSON, 'Chưa có thông số JSON') AS JsonStatus`.",
        "tsql": "SELECT FruitID, FruitName,\n       COALESCE(AttributesJSON, N'Chưa có thông số JSON') AS JsonStatus\nFROM Fruits\nORDER BY FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName,\n       COALESCE(AttributesJSON, 'Chưa có thông số JSON') AS JsonStatus\nFROM Fruits\nORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "JsonStatus"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              "{\"Taste\":\"Sweet\", \"SugarLevel\": \"High\", \"Color\":\"Yellow\"}"
            ],
            [
              2,
              "Bưởi Da Xanh",
              "{\"Taste\":\"Sour\", \"Vitamins\":[\"C\", \"A\"], \"Color\":\"Green\"}"
            ],
            [
              3,
              "Xoài Cát Hòa Lộc",
              "{\"Taste\":\"Sweet\", \"SugarLevel\": \"High\", \"Season\":\"Summer\"}"
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              "{\"Taste\":\"Sweet-Sour\", \"Color\":\"Purple\"}"
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              "{\"Taste\":\"Very Sweet\", \"Vitamins\":[\"C\", \"K\"], \"Seedless\":true}"
            ],
            [
              6,
              "Táo Envy",
              "{\"Taste\":\"Crisp Sweet\", \"Size\":\"Large\", \"Color\":\"Red\"}"
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              "{\"Taste\":\"Sweet\", \"Color\":\"Dark Red\"}"
            ],
            [
              8,
              "Kiwi Vàng",
              "{\"Taste\":\"Sweet-Sour\", \"Vitamins\":[\"C\"], \"Seedless\":true}"
            ],
            [
              9,
              "Dâu Tây Mộc Châu",
              "{\"Taste\":\"Sour\", \"Color\":\"Red\"}"
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              "{\"Taste\":\"Sweet-Sour\", \"Antioxidants\":\"High\"}"
            ],
            [
              11,
              "Mâm Xôi Đen",
              "{\"Taste\":\"Sour\", \"StockStatus\":\"Out\"}"
            ],
            [
              12,
              "Nho khô Ninh Thuận",
              "Chưa có thông số JSON"
            ],
            [
              13,
              "Mít sấy giòn",
              "Chưa có thông số JSON"
            ],
            [
              14,
              "Hạt Mắc Ca",
              "{\"Taste\":\"Rich\", \"Fat\":\"High\"}"
            ]
          ]
        }
      },
      {
        "id": "FS-CH02-02",
        "level": "Cơ bản (Mẫu A2 - COALESCE trên bảng Employees)",
        "pattern": "SELECT ..., COALESCE(NullableCol, DefaultVal) AS Alias FROM Table; (Cùng cơ chế Bài 2.1 nhưng trên Employees)",
        "title": "Bài 2.2: Hiển thị mã quản lý mặc định là 0 cho Giám đốc (Bảng Employees)",
        "question": "Áp dụng y hệt hàm `COALESCE` của Bài 2.1 trên bảng `Employees`: Lấy ra `EmployeeID`, `FullName`, `Role` và `COALESCE(ManagerID, 0)` đặt tên là `SafeManagerID`. Sắp xếp theo `EmployeeID` tăng dần.",
        "hint": "Dùng `COALESCE(ManagerID, 0) AS SafeManagerID`.",
        "tsql": "SELECT EmployeeID, FullName, Role,\n       COALESCE(ManagerID, 0) AS SafeManagerID\nFROM Employees\nORDER BY EmployeeID ASC;",
        "sqlite": "SELECT EmployeeID, FullName, Role,\n       COALESCE(ManagerID, 0) AS SafeManagerID\nFROM Employees\nORDER BY EmployeeID ASC;",
        "expected": {
          "cols": [
            "EmployeeID",
            "FullName",
            "Role",
            "SafeManagerID"
          ],
          "rows": [
            [
              1,
              "Lê Minh Triết",
              "Giám đốc",
              0
            ],
            [
              2,
              "Nguyễn Tấn Dũng",
              "Quản lý Kho",
              1
            ],
            [
              3,
              "Trần Thị Mai",
              "Quản lý Bán hàng",
              1
            ],
            [
              4,
              "Phạm Văn A",
              "Nhân viên Kho",
              2
            ],
            [
              5,
              "Lý Bạch",
              "Nhân viên Kho",
              2
            ],
            [
              6,
              "Hoàng Cúc",
              "Nhân viên Bán hàng",
              3
            ],
            [
              7,
              "Đinh Hợi",
              "Nhân viên Bán hàng",
              3
            ]
          ]
        }
      },
      {
        "id": "FS-CH02-03",
        "level": "Cơ bản (Mẫu A3 - COALESCE trên bảng Orders)",
        "pattern": "SELECT ..., COALESCE(NullableCol, DefaultVal) AS Alias FROM Table; (Cùng cơ chế Bài 2.1 & 2.2 nhưng trên Orders)",
        "title": "Bài 2.3: Hiển thị mã Voucher mặc định là 0 cho đơn không dùng mã (Bảng Orders)",
        "question": "Tiếp tục phản xạ `COALESCE` trên bảng `Orders`: Lấy ra `OrderID`, `CustomerID`, `TotalAmount` và `COALESCE(VoucherID, 0)` đặt tên là `AppliedVoucherID`, sắp xếp theo `OrderID` tăng dần.",
        "hint": "Dùng `COALESCE(VoucherID, 0) AS AppliedVoucherID`.",
        "tsql": "SELECT OrderID, CustomerID, TotalAmount,\n       COALESCE(VoucherID, 0) AS AppliedVoucherID\nFROM Orders\nORDER BY OrderID ASC;",
        "sqlite": "SELECT OrderID, CustomerID, TotalAmount,\n       COALESCE(VoucherID, 0) AS AppliedVoucherID\nFROM Orders\nORDER BY OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "TotalAmount",
            "AppliedVoucherID"
          ],
          "rows": [
            [
              1,
              1,
              850000,
              0
            ],
            [
              2,
              2,
              180000,
              1
            ],
            [
              3,
              3,
              150000,
              0
            ],
            [
              4,
              4,
              850000,
              2
            ],
            [
              5,
              1,
              2500000,
              2
            ],
            [
              6,
              5,
              300000,
              1
            ],
            [
              7,
              6,
              180000,
              0
            ],
            [
              8,
              1,
              200000,
              0
            ],
            [
              9,
              4,
              400000,
              1
            ],
            [
              10,
              7,
              95000,
              0
            ]
          ]
        }
      },
      {
        "id": "FS-CH02-04",
        "level": "Cơ bản (Mẫu B1 - Phân loại bằng CASE WHEN)",
        "pattern": "CASE WHEN cond1 THEN val1 WHEN cond2 THEN val2 ELSE val3 END",
        "title": "Bài 2.4: Phân tầng mức giá trái cây (CASE WHEN trên bảng Fruits)",
        "question": "Lấy ra `FruitID`, `FruitName`, `Price` và cột `PriceTier` từ bảng `Fruits` với quy tắc: Nếu `Price >= 300000` là `'Cao cấp'`, nếu `Price >= 100000` là `'Tầm trung'`, ngược lại là `'Bình dân'`. Sắp xếp theo `FruitID` tăng dần.",
        "hint": "Dùng biểu thức `CASE WHEN Price >= 300000 THEN 'Cao cấp' WHEN Price >= 100000 THEN 'Tầm trung' ELSE 'Bình dân' END`.",
        "tsql": "SELECT FruitID, FruitName, Price,\n       CASE\n           WHEN Price >= 300000 THEN N'Cao cấp'\n           WHEN Price >= 100000 THEN N'Tầm trung'\n           ELSE N'Bình dân'\n       END AS PriceTier\nFROM Fruits\nORDER BY FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName, Price,\n       CASE\n           WHEN Price >= 300000 THEN 'Cao cấp'\n           WHEN Price >= 100000 THEN 'Tầm trung'\n           ELSE 'Bình dân'\n       END AS PriceTier\nFROM Fruits\nORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price",
            "PriceTier"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              150000,
              "Tầm trung"
            ],
            [
              2,
              "Bưởi Da Xanh",
              70000,
              "Bình dân"
            ],
            [
              3,
              "Xoài Cát Hòa Lộc",
              80000,
              "Bình dân"
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              95000,
              "Bình dân"
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              850000,
              "Cao cấp"
            ],
            [
              6,
              "Táo Envy",
              250000,
              "Tầm trung"
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              450000,
              "Cao cấp"
            ],
            [
              8,
              "Kiwi Vàng",
              180000,
              "Tầm trung"
            ],
            [
              9,
              "Dâu Tây Mộc Châu",
              200000,
              "Tầm trung"
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              350000,
              "Cao cấp"
            ],
            [
              11,
              "Mâm Xôi Đen",
              320000,
              "Cao cấp"
            ],
            [
              12,
              "Nho khô Ninh Thuận",
              120000,
              "Tầm trung"
            ],
            [
              13,
              "Mít sấy giòn",
              60000,
              "Bình dân"
            ],
            [
              14,
              "Hạt Mắc Ca",
              280000,
              "Tầm trung"
            ]
          ]
        }
      },
      {
        "id": "FS-CH02-05",
        "level": "Cơ bản (Mẫu B2 - CASE WHEN trên bảng khác)",
        "pattern": "CASE WHEN cond1 THEN val1 WHEN cond2 THEN val2 ELSE val3 END (Cùng cơ chế Bài 2.4 nhưng kiểm tra tồn kho Fruits)",
        "title": "Bài 2.5: Cảnh báo trạng thái tồn kho (CASE WHEN trên StockQuantity)",
        "question": "Áp dụng y hệt cấu trúc `CASE WHEN` cho cột `StockQuantity` của bảng `Fruits`: Lấy ra `FruitID`, `FruitName`, `StockQuantity` và cột `StockAlert`: Nếu `StockQuantity = 0` là `'Hết hàng'`, nếu `StockQuantity < 50` là `'Sắp hết'`, ngược lại là `'Dồi dào'`. Sắp xếp theo `FruitID` tăng dần.",
        "hint": "Kiểm tra `StockQuantity = 0` trước, sau đó đến `StockQuantity < 50`.",
        "tsql": "SELECT FruitID, FruitName, StockQuantity,\n       CASE\n           WHEN StockQuantity = 0 THEN N'Hết hàng'\n           WHEN StockQuantity < 50 THEN N'Sắp hết'\n           ELSE N'Dồi dào'\n       END AS StockAlert\nFROM Fruits\nORDER BY FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName, StockQuantity,\n       CASE\n           WHEN StockQuantity = 0 THEN 'Hết hàng'\n           WHEN StockQuantity < 50 THEN 'Sắp hết'\n           ELSE 'Dồi dào'\n       END AS StockAlert\nFROM Fruits\nORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "StockQuantity",
            "StockAlert"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              50,
              "Dồi dào"
            ],
            [
              2,
              "Bưởi Da Xanh",
              120,
              "Dồi dào"
            ],
            [
              3,
              "Xoài Cát Hòa Lộc",
              200,
              "Dồi dào"
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              80,
              "Dồi dào"
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              15,
              "Sắp hết"
            ],
            [
              6,
              "Táo Envy",
              100,
              "Dồi dào"
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              30,
              "Sắp hết"
            ],
            [
              8,
              "Kiwi Vàng",
              60,
              "Dồi dào"
            ],
            [
              9,
              "Dâu Tây Mộc Châu",
              45,
              "Sắp hết"
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              20,
              "Sắp hết"
            ],
            [
              11,
              "Mâm Xôi Đen",
              0,
              "Hết hàng"
            ],
            [
              12,
              "Nho khô Ninh Thuận",
              300,
              "Dồi dào"
            ],
            [
              13,
              "Mít sấy giòn",
              150,
              "Dồi dào"
            ],
            [
              14,
              "Hạt Mắc Ca",
              90,
              "Dồi dào"
            ]
          ]
        }
      },
      {
        "id": "FS-CH02-06",
        "level": "Cơ bản (Mẫu B3 - CASE WHEN trên bảng Reviews)",
        "pattern": "CASE WHEN cond1 THEN val1 WHEN cond2 THEN val2 ELSE val3 END (Cùng cơ chế Bài 2.4 & 2.5 nhưng trên bảng Reviews)",
        "title": "Bài 2.6: Phân loại sắc thái đánh giá của khách hàng (Bảng Reviews)",
        "question": "Tiếp tục phản xạ `CASE WHEN` trên bảng `Reviews`: Lấy ra `ReviewID`, `FruitID`, `Rating` và cột `Sentiment`: Nếu `Rating = 5` là `'Tuyệt vời'`, nếu `Rating = 4` là `'Hài lòng'`, ngược lại là `'Cần cải thiện'`. Sắp xếp theo `ReviewID` tăng dần.",
        "hint": "Dùng `CASE WHEN Rating = 5 ... WHEN Rating = 4 ... ELSE ... END`.",
        "tsql": "SELECT ReviewID, FruitID, Rating,\n       CASE\n           WHEN Rating = 5 THEN N'Tuyệt vời'\n           WHEN Rating = 4 THEN N'Hài lòng'\n           ELSE N'Cần cải thiện'\n       END AS Sentiment\nFROM Reviews\nORDER BY ReviewID ASC;",
        "sqlite": "SELECT ReviewID, FruitID, Rating,\n       CASE\n           WHEN Rating = 5 THEN 'Tuyệt vời'\n           WHEN Rating = 4 THEN 'Hài lòng'\n           ELSE 'Cần cải thiện'\n       END AS Sentiment\nFROM Reviews\nORDER BY ReviewID ASC;",
        "expected": {
          "cols": [
            "ReviewID",
            "FruitID",
            "Rating",
            "Sentiment"
          ],
          "rows": [
            [
              1,
              5,
              5,
              "Tuyệt vời"
            ],
            [
              2,
              3,
              4,
              "Hài lòng"
            ],
            [
              3,
              6,
              5,
              "Tuyệt vời"
            ],
            [
              4,
              10,
              3,
              "Cần cải thiện"
            ]
          ]
        }
      },
      {
        "id": "FS-CH02-07",
        "level": "Trung cấp (Xử lý chuỗi UPPER, LENGTH/LEN & Ghép chuỗi)",
        "pattern": "UPPER(Col), LENGTH(Col), nối chuỗi tạo nhãn hiển thị",
        "title": "Bài 2.7: Chuẩn hóa thẻ tên khách hàng & độ dài tên (Bảng Customers)",
        "question": "Lấy ra `CustomerID`, tên khách hàng viết hoa toàn bộ (`UpperName`), độ dài ký tự của tên (`NameLength`), và chuỗi ghép `CustomerTag` có dạng `'[' || CustomerType || '] ' || FullName` từ bảng `Customers`. Sắp xếp theo `CustomerID` tăng dần.",
        "hint": "Trong T-SQL dùng `UPPER(FullName)`, `LEN(FullName)`, `CONCAT('[', CustomerType, '] ', FullName)`. Trong SQLite dùng `UPPER(FullName)`, `LENGTH(FullName)` và toán tử `||`.",
        "tsql": "SELECT CustomerID,\n       UPPER(FullName) AS UpperName,\n       LEN(FullName) AS NameLength,\n       CONCAT(N'[', CustomerType, N'] ', FullName) AS CustomerTag\nFROM Customers\nORDER BY CustomerID ASC;",
        "sqlite": "SELECT CustomerID,\n       UPPER(FullName) AS UpperName,\n       LENGTH(FullName) AS NameLength,\n       '[' || CustomerType || '] ' || FullName AS CustomerTag\nFROM Customers\nORDER BY CustomerID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "UpperName",
            "NameLength",
            "CustomerTag"
          ],
          "rows": [
            [
              1,
              "Võ THàNH TàI",
              12,
              "[VIP] Võ Thành Tài"
            ],
            [
              2,
              "NGUYễN THị Lệ",
              13,
              "[Standard] Nguyễn Thị Lệ"
            ],
            [
              3,
              "TRươNG Vô Kỵ",
              12,
              "[Standard] Trương Vô Kỵ"
            ],
            [
              4,
              "TRIệU MẫN",
              9,
              "[VIP] Triệu Mẫn"
            ],
            [
              5,
              "CHU CHỉ NHượC",
              13,
              "[Standard] Chu Chỉ Nhược"
            ],
            [
              6,
              "ÂN LY",
              5,
              "[Standard] Ân Ly"
            ],
            [
              7,
              "TIểU CHIêU",
              10,
              "[Standard] Tiểu Chiêu"
            ],
            [
              8,
              "DươNG QUá",
              9,
              "[Standard] Dương Quá"
            ]
          ]
        }
      },
      {
        "id": "FS-CH02-08",
        "level": "Trung cấp (Trích xuất Năm và Tháng từ cột ngày tháng)",
        "pattern": "YEAR(DateCol) / CAST(strftime('%Y', DateCol) AS INT)",
        "title": "Bài 2.8: Tách năm và tháng đặt hàng của các đơn hàng năm 2024 (Bảng Orders)",
        "question": "Từ bảng `Orders`, hãy lấy ra `OrderID`, `CustomerID`, năm đặt hàng (`OrderYear`), tháng đặt hàng (`OrderMonth`) và `TotalAmount` của các đơn hàng phát sinh trong năm `2024`. Sắp xếp theo `OrderID` tăng dần.",
        "hint": "Trong T-SQL dùng `YEAR(OrderDate)` và `MONTH(OrderDate)`. Trong SQLite dùng `CAST(strftime('%Y', OrderDate) AS INT)` và `CAST(strftime('%m', OrderDate) AS INT)`.",
        "tsql": "SELECT OrderID, CustomerID,\n       YEAR(OrderDate) AS OrderYear,\n       MONTH(OrderDate) AS OrderMonth,\n       TotalAmount\nFROM Orders\nWHERE YEAR(OrderDate) = 2024\nORDER BY OrderID ASC;",
        "sqlite": "SELECT OrderID, CustomerID,\n       CAST(strftime('%Y', OrderDate) AS INT) AS OrderYear,\n       CAST(strftime('%m', OrderDate) AS INT) AS OrderMonth,\n       TotalAmount\nFROM Orders\nWHERE CAST(strftime('%Y', OrderDate) AS INT) = 2024\nORDER BY OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "OrderYear",
            "OrderMonth",
            "TotalAmount"
          ],
          "rows": [
            [
              6,
              5,
              2024,
              1,
              300000
            ],
            [
              7,
              6,
              2024,
              2,
              180000
            ],
            [
              8,
              1,
              2024,
              3,
              200000
            ],
            [
              9,
              4,
              2024,
              3,
              400000
            ],
            [
              10,
              7,
              2024,
              3,
              95000
            ]
          ]
        }
      },
      {
        "id": "FS-CH02-09",
        "level": "Nâng cao (Tính toán tỷ lệ % & ROUND)",
        "pattern": "ROUND(CAST(UsedCount AS FLOAT) * 100.0 / UsageLimit, 2)",
        "title": "Bài 2.9: Tính phần trăm lượt sử dụng và số lượt còn lại của từng Voucher",
        "question": "Từ bảng `Vouchers`, lấy ra `VoucherID`, `VoucherCode`, số lượt còn lại (`RemainingUses = UsageLimit - UsedCount`), và tỷ lệ phần trăm đã dùng (`UsedPercentage = ROUND(UsedCount * 100.0 / UsageLimit, 2)`). Sắp xếp theo `UsedPercentage` giảm dần.",
        "hint": "Nhân với `100.0` để ép kiểu số thực trước khi chia cho `UsageLimit`, sau đó bọc trong `ROUND(..., 2)`.",
        "tsql": "SELECT VoucherID, VoucherCode,\n       (UsageLimit - UsedCount) AS RemainingUses,\n       ROUND(CAST(UsedCount AS FLOAT) * 100.0 / UsageLimit, 2) AS UsedPercentage\nFROM Vouchers\nORDER BY UsedPercentage DESC;",
        "sqlite": "SELECT VoucherID, VoucherCode,\n       (UsageLimit - UsedCount) AS RemainingUses,\n       ROUND(UsedCount * 100.0 / UsageLimit, 2) AS UsedPercentage\nFROM Vouchers\nORDER BY UsedPercentage DESC;",
        "expected": {
          "cols": [
            "VoucherID",
            "VoucherCode",
            "RemainingUses",
            "UsedPercentage"
          ],
          "rows": [
            [
              3,
              "HETHAN",
              0,
              100.0
            ],
            [
              1,
              "WELCOME50",
              750,
              25.0
            ],
            [
              2,
              "VIP100",
              95,
              5.0
            ]
          ]
        }
      },
      {
        "id": "FS-CH02-10",
        "level": "Thực chiến (Kết hợp CASE WHEN + Biểu thức tính giá khuyến mãi)",
        "pattern": "Tính giá sau giảm theo danh mục bằng CASE WHEN",
        "title": "Bài 2.10: Bảng giá xả kho cuối tuần theo từng danh mục (Bảng Fruits)",
        "question": "Cửa hàng chạy chương trình giảm giá tự động: Danh mục `2` (Trái cây Nhập khẩu) giảm 10% (`Price * 90 / 100`), Danh mục `3` (Quả mọng) giảm 5% (`Price * 95 / 100`), các danh mục khác giữ nguyên giá (`Price`). Hãy lấy ra `FruitID`, `FruitName`, `CategoryID`, `Price` (giá gốc) và `PromoPrice` (giá sau giảm, kiểu số nguyên) cho các trái cây đang còn hàng (`StockQuantity > 0`), sắp xếp theo `FruitID` tăng dần.",
        "hint": "Dùng `CASE WHEN CategoryID = 2 THEN Price * 90 / 100 WHEN CategoryID = 3 THEN Price * 95 / 100 ELSE Price END AS PromoPrice`.",
        "tsql": "SELECT FruitID, FruitName, CategoryID, Price,\n       CASE\n           WHEN CategoryID = 2 THEN Price * 90 / 100\n           WHEN CategoryID = 3 THEN Price * 95 / 100\n           ELSE Price\n       END AS PromoPrice\nFROM Fruits\nWHERE StockQuantity > 0\nORDER BY FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName, CategoryID, Price,\n       CASE\n           WHEN CategoryID = 2 THEN Price * 90 / 100\n           WHEN CategoryID = 3 THEN Price * 95 / 100\n           ELSE Price\n       END AS PromoPrice\nFROM Fruits\nWHERE StockQuantity > 0\nORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "CategoryID",
            "Price",
            "PromoPrice"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              1,
              150000,
              150000
            ],
            [
              2,
              "Bưởi Da Xanh",
              1,
              70000,
              70000
            ],
            [
              3,
              "Xoài Cát Hòa Lộc",
              1,
              80000,
              80000
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              1,
              95000,
              95000
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              2,
              850000,
              765000
            ],
            [
              6,
              "Táo Envy",
              2,
              250000,
              225000
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              2,
              450000,
              405000
            ],
            [
              8,
              "Kiwi Vàng",
              2,
              180000,
              162000
            ],
            [
              9,
              "Dâu Tây Mộc Châu",
              3,
              200000,
              190000
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              3,
              350000,
              332500
            ],
            [
              12,
              "Nho khô Ninh Thuận",
              4,
              120000,
              120000
            ],
            [
              13,
              "Mít sấy giòn",
              4,
              60000,
              60000
            ],
            [
              14,
              "Hạt Mắc Ca",
              5,
              280000,
              280000
            ]
          ]
        }
      }
    ]
  },
  {
    "chapter_id": "ch03",
    "chapter_num": 3,
    "chapter_title": "Chương 3: Các Phép Kết Nối Bảng (JOINs) & Toán Tử Tập Hợp (Set Operators)",
    "pedagogy_goal": "Rèn phản xạ nối 2 bảng (INNER JOIN), tìm phần tử mồ côi/chưa phát sinh giao dịch (LEFT JOIN ... WHERE IS NULL), tự nối (Self-Join) và hợp/trừ tập hợp (UNION, INTERSECT, EXCEPT) trên toàn bộ 9 bảng.",
    "exercises": [
      {
        "id": "FS-CH03-01",
        "level": "Cơ bản (Mẫu A1 - INNER JOIN 2 bảng)",
        "pattern": "SELECT ... FROM Child c INNER JOIN Parent p ON c.FK = p.PK;",
        "title": "Bài 3.1: Ghép tên danh mục cho từng loại trái cây (Fruits JOIN Categories)",
        "question": "Hãy lấy ra `FruitID`, `FruitName`, `CategoryName` và `Price` bằng cách kết nối bảng `Fruits` với bảng `Categories`. Sắp xếp theo `FruitID` tăng dần.",
        "hint": "Dùng `INNER JOIN Categories c ON f.CategoryID = c.CategoryID`.",
        "tsql": "SELECT f.FruitID, f.FruitName, c.CategoryName, f.Price\nFROM Fruits f\nINNER JOIN Categories c ON f.CategoryID = c.CategoryID\nORDER BY f.FruitID ASC;",
        "sqlite": "SELECT f.FruitID, f.FruitName, c.CategoryName, f.Price\nFROM Fruits f\nINNER JOIN Categories c ON f.CategoryID = c.CategoryID\nORDER BY f.FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "CategoryName",
            "Price"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              "Đặc sản Miền Tây",
              150000
            ],
            [
              2,
              "Bưởi Da Xanh",
              "Đặc sản Miền Tây",
              70000
            ],
            [
              3,
              "Xoài Cát Hòa Lộc",
              "Đặc sản Miền Tây",
              80000
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              "Đặc sản Miền Tây",
              95000
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              "Trái cây Nhập khẩu",
              850000
            ],
            [
              6,
              "Táo Envy",
              "Trái cây Nhập khẩu",
              250000
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              "Trái cây Nhập khẩu",
              450000
            ],
            [
              8,
              "Kiwi Vàng",
              "Trái cây Nhập khẩu",
              180000
            ],
            [
              9,
              "Dâu Tây Mộc Châu",
              "Quả mọng (Berries)",
              200000
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              "Quả mọng (Berries)",
              350000
            ],
            [
              11,
              "Mâm Xôi Đen",
              "Quả mọng (Berries)",
              320000
            ],
            [
              12,
              "Nho khô Ninh Thuận",
              "Trái cây sấy",
              120000
            ],
            [
              13,
              "Mít sấy giòn",
              "Trái cây sấy",
              60000
            ],
            [
              14,
              "Hạt Mắc Ca",
              "Quả hạch (Nuts)",
              280000
            ]
          ]
        }
      },
      {
        "id": "FS-CH03-02",
        "level": "Cơ bản (Mẫu A2 - INNER JOIN 2 bảng khác)",
        "pattern": "SELECT ... FROM Child c INNER JOIN Parent p ON c.FK = p.PK; (Cùng cơ chế Bài 3.1 nhưng trên Orders & Customers)",
        "title": "Bài 3.2: Ghép tên khách hàng cho từng đơn hàng (Orders JOIN Customers)",
        "question": "Áp dụng y hệt cơ chế `INNER JOIN` của Bài 3.1 nhưng giữa bảng `Orders` và `Customers`: Lấy ra `OrderID`, `FullName` (tên khách hàng), `OrderDate`, `TotalAmount` và `Status`. Sắp xếp theo `OrderID` tăng dần.",
        "hint": "Nối `Orders o INNER JOIN Customers c ON o.CustomerID = c.CustomerID`.",
        "tsql": "SELECT o.OrderID, c.FullName, o.OrderDate, o.TotalAmount, o.Status\nFROM Orders o\nINNER JOIN Customers c ON o.CustomerID = c.CustomerID\nORDER BY o.OrderID ASC;",
        "sqlite": "SELECT o.OrderID, c.FullName, o.OrderDate, o.TotalAmount, o.Status\nFROM Orders o\nINNER JOIN Customers c ON o.CustomerID = c.CustomerID\nORDER BY o.OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "FullName",
            "OrderDate",
            "TotalAmount",
            "Status"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              "2023-02-14 10:15:00",
              850000,
              "Đã giao"
            ],
            [
              2,
              "Nguyễn Thị Lệ",
              "2023-04-20 14:30:00",
              180000,
              "Đã giao"
            ],
            [
              3,
              "Trương Vô Kỵ",
              "2023-06-15 09:00:00",
              150000,
              "Đã giao"
            ],
            [
              4,
              "Triệu Mẫn",
              "2023-08-08 16:45:00",
              850000,
              "Đã giao"
            ],
            [
              5,
              "Võ Thành Tài",
              "2023-12-24 19:00:00",
              2500000,
              "Đã giao"
            ],
            [
              6,
              "Chu Chỉ Nhược",
              "2024-01-10 08:30:00",
              300000,
              "Đã giao"
            ],
            [
              7,
              "Ân Ly",
              "2024-02-14 11:20:00",
              180000,
              "Đã hủy"
            ],
            [
              8,
              "Võ Thành Tài",
              "2024-03-01 15:10:00",
              200000,
              "Đang giao"
            ],
            [
              9,
              "Triệu Mẫn",
              "2024-03-05 10:00:00",
              400000,
              "Chờ xử lý"
            ],
            [
              10,
              "Tiểu Chiêu",
              "2024-03-10 14:00:00",
              95000,
              "Chờ xử lý"
            ]
          ]
        }
      },
      {
        "id": "FS-CH03-03",
        "level": "Cơ bản (Mẫu A3 - INNER JOIN 2 bảng khác)",
        "pattern": "SELECT ... FROM Child c INNER JOIN Parent p ON c.FK = p.PK; (Cùng cơ chế Bài 3.1 & 3.2 nhưng trên PaymentTransactions & Orders)",
        "title": "Bài 3.3: Xem giao dịch thanh toán kèm trạng thái đơn hàng (PaymentTransactions JOIN Orders)",
        "question": "Tiếp tục phản xạ `INNER JOIN` giữa `PaymentTransactions` và `Orders`: Lấy ra `TransactionID`, `OrderID`, `PaymentMethod`, `Amount` (tiền thanh toán), `TotalAmount` (tổng tiền đơn) và `Status` (trạng thái đơn). Sắp xếp theo `TransactionID` tăng dần.",
        "hint": "Nối `PaymentTransactions pt INNER JOIN Orders o ON pt.OrderID = o.OrderID`.",
        "tsql": "SELECT pt.TransactionID, pt.OrderID, pt.PaymentMethod, pt.Amount, o.TotalAmount, o.Status\nFROM PaymentTransactions pt\nINNER JOIN Orders o ON pt.OrderID = o.OrderID\nORDER BY pt.TransactionID ASC;",
        "sqlite": "SELECT pt.TransactionID, pt.OrderID, pt.PaymentMethod, pt.Amount, o.TotalAmount, o.Status\nFROM PaymentTransactions pt\nINNER JOIN Orders o ON pt.OrderID = o.OrderID\nORDER BY pt.TransactionID ASC;",
        "expected": {
          "cols": [
            "TransactionID",
            "OrderID",
            "PaymentMethod",
            "Amount",
            "TotalAmount",
            "Status"
          ],
          "rows": [
            [
              1,
              1,
              "VNPAY",
              850000,
              850000,
              "Đã giao"
            ],
            [
              2,
              2,
              "Tiền mặt",
              200000,
              180000,
              "Đã giao"
            ],
            [
              3,
              3,
              "Momo",
              150000,
              150000,
              "Đã giao"
            ],
            [
              4,
              4,
              "VNPAY",
              850000,
              850000,
              "Đã giao"
            ],
            [
              5,
              5,
              "VNPAY",
              2500000,
              2500000,
              "Đã giao"
            ],
            [
              6,
              6,
              "Momo",
              300000,
              300000,
              "Đã giao"
            ]
          ]
        }
      },
      {
        "id": "FS-CH03-04",
        "level": "Cơ bản (Mẫu B1 - LEFT Anti-Join tìm bản ghi chưa có giao dịch)",
        "pattern": "SELECT p.* FROM Parent p LEFT JOIN Child c ON p.PK = c.FK WHERE c.FK IS NULL;",
        "title": "Bài 3.4: Tìm khách hàng chưa từng đặt đơn hàng nào (Customers LEFT JOIN Orders)",
        "question": "Sử dụng kỹ thuật `LEFT JOIN ... WHERE IS NULL`, hãy tìm các khách hàng (`CustomerID`, `FullName`, `PhoneNumber`, `RegisterDate`) chưa từng có bất kỳ đơn hàng nào trong bảng `Orders`. Sắp xếp theo `CustomerID` tăng dần.",
        "hint": "Dùng `Customers c LEFT JOIN Orders o ON c.CustomerID = o.CustomerID WHERE o.OrderID IS NULL`.",
        "tsql": "SELECT c.CustomerID, c.FullName, c.PhoneNumber, c.RegisterDate\nFROM Customers c\nLEFT JOIN Orders o ON c.CustomerID = o.CustomerID\nWHERE o.OrderID IS NULL\nORDER BY c.CustomerID ASC;",
        "sqlite": "SELECT c.CustomerID, c.FullName, c.PhoneNumber, c.RegisterDate\nFROM Customers c\nLEFT JOIN Orders o ON c.CustomerID = o.CustomerID\nWHERE o.OrderID IS NULL\nORDER BY c.CustomerID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "PhoneNumber",
            "RegisterDate"
          ],
          "rows": [
            [
              8,
              "Dương Quá",
              "0908888999",
              "2024-03-10"
            ]
          ]
        }
      },
      {
        "id": "FS-CH03-05",
        "level": "Cơ bản (Mẫu B2 - LEFT Anti-Join trên bảng Fruits & OrderDetails)",
        "pattern": "SELECT p.* FROM Parent p LEFT JOIN Child c ON p.PK = c.FK WHERE c.FK IS NULL; (Cùng cơ chế Bài 3.4 nhưng tìm Trái cây chưa ai mua)",
        "title": "Bài 3.5: Tìm các loại trái cây chưa từng xuất hiện trong bất kỳ đơn hàng nào",
        "question": "Áp dụng y hệt kỹ thuật `LEFT JOIN ... WHERE IS NULL` của Bài 3.4 nhưng giữa `Fruits` và `OrderDetails`: Lấy ra `FruitID`, `FruitName`, `Price`, `StockQuantity` của những loại trái cây chưa từng được đặt mua lần nào. Sắp xếp theo `FruitID` tăng dần.",
        "hint": "Dùng `Fruits f LEFT JOIN OrderDetails od ON f.FruitID = od.FruitID WHERE od.OrderDetailID IS NULL`.",
        "tsql": "SELECT f.FruitID, f.FruitName, f.Price, f.StockQuantity\nFROM Fruits f\nLEFT JOIN OrderDetails od ON f.FruitID = od.FruitID\nWHERE od.OrderDetailID IS NULL\nORDER BY f.FruitID ASC;",
        "sqlite": "SELECT f.FruitID, f.FruitName, f.Price, f.StockQuantity\nFROM Fruits f\nLEFT JOIN OrderDetails od ON f.FruitID = od.FruitID\nWHERE od.OrderDetailID IS NULL\nORDER BY f.FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price",
            "StockQuantity"
          ],
          "rows": [
            [
              11,
              "Mâm Xôi Đen",
              320000,
              0
            ],
            [
              12,
              "Nho khô Ninh Thuận",
              120000,
              300
            ],
            [
              13,
              "Mít sấy giòn",
              60000,
              150
            ],
            [
              14,
              "Hạt Mắc Ca",
              280000,
              90
            ]
          ]
        }
      },
      {
        "id": "FS-CH03-06",
        "level": "Cơ bản (Mẫu B3 - LEFT Anti-Join trên bảng Vouchers & Orders)",
        "pattern": "SELECT p.* FROM Parent p LEFT JOIN Child c ON p.PK = c.FK WHERE c.FK IS NULL; (Cùng cơ chế Bài 3.4 & 3.5 nhưng tìm Voucher chưa đơn nào dùng)",
        "title": "Bài 3.6: Tìm mã Voucher chưa từng được áp dụng vào đơn hàng nào trong bảng Orders",
        "question": "Tiếp tục phản xạ `LEFT JOIN ... WHERE IS NULL` giữa `Vouchers` và `Orders`: Lấy ra `VoucherID`, `VoucherCode`, `DiscountAmount`, `ExpiryDate` của mã giảm giá không xuất hiện trong bất kỳ đơn hàng nào của bảng `Orders`.",
        "hint": "Dùng `Vouchers v LEFT JOIN Orders o ON v.VoucherID = o.VoucherID WHERE o.OrderID IS NULL`.",
        "tsql": "SELECT v.VoucherID, v.VoucherCode, v.DiscountAmount, v.ExpiryDate\nFROM Vouchers v\nLEFT JOIN Orders o ON v.VoucherID = o.VoucherID\nWHERE o.OrderID IS NULL\nORDER BY v.VoucherID ASC;",
        "sqlite": "SELECT v.VoucherID, v.VoucherCode, v.DiscountAmount, v.ExpiryDate\nFROM Vouchers v\nLEFT JOIN Orders o ON v.VoucherID = o.VoucherID\nWHERE o.OrderID IS NULL\nORDER BY v.VoucherID ASC;",
        "expected": {
          "cols": [
            "VoucherID",
            "VoucherCode",
            "DiscountAmount",
            "ExpiryDate"
          ],
          "rows": [
            [
              3,
              "HETHAN",
              30000,
              "2023-12-31"
            ]
          ]
        }
      },
      {
        "id": "FS-CH03-07",
        "level": "Trung cấp (Self-Join bảng tự tham chiếu Employees)",
        "pattern": "SELECT e.FullName, m.FullName FROM Employees e LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID;",
        "title": "Bài 3.7: Hiển thị danh sách nhân viên kèm họ tên người quản lý trực tiếp (Self-Join)",
        "question": "Bảng `Employees` có cột `ManagerID` tự tham chiếu về chính `EmployeeID`. Hãy dùng `LEFT JOIN` để lấy ra `EmployeeID`, tên nhân viên (`EmployeeName`), chức vụ (`Role`) và tên người quản lý trực tiếp (`ManagerName`, nếu không có quản lý thì hiển thị `'Cấp cao nhất'`). Sắp xếp theo `EmployeeID` tăng dần.",
        "hint": "Nối `Employees e LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID` và dùng `COALESCE(m.FullName, 'Cấp cao nhất')`.",
        "tsql": "SELECT e.EmployeeID,\n       e.FullName AS EmployeeName,\n       e.Role,\n       COALESCE(m.FullName, N'Cấp cao nhất') AS ManagerName\nFROM Employees e\nLEFT JOIN Employees m ON e.ManagerID = m.EmployeeID\nORDER BY e.EmployeeID ASC;",
        "sqlite": "SELECT e.EmployeeID,\n       e.FullName AS EmployeeName,\n       e.Role,\n       COALESCE(m.FullName, 'Cấp cao nhất') AS ManagerName\nFROM Employees e\nLEFT JOIN Employees m ON e.ManagerID = m.EmployeeID\nORDER BY e.EmployeeID ASC;",
        "expected": {
          "cols": [
            "EmployeeID",
            "EmployeeName",
            "Role",
            "ManagerName"
          ],
          "rows": [
            [
              1,
              "Lê Minh Triết",
              "Giám đốc",
              "Cấp cao nhất"
            ],
            [
              2,
              "Nguyễn Tấn Dũng",
              "Quản lý Kho",
              "Lê Minh Triết"
            ],
            [
              3,
              "Trần Thị Mai",
              "Quản lý Bán hàng",
              "Lê Minh Triết"
            ],
            [
              4,
              "Phạm Văn A",
              "Nhân viên Kho",
              "Nguyễn Tấn Dũng"
            ],
            [
              5,
              "Lý Bạch",
              "Nhân viên Kho",
              "Nguyễn Tấn Dũng"
            ],
            [
              6,
              "Hoàng Cúc",
              "Nhân viên Bán hàng",
              "Trần Thị Mai"
            ],
            [
              7,
              "Đinh Hợi",
              "Nhân viên Bán hàng",
              "Trần Thị Mai"
            ]
          ]
        }
      },
      {
        "id": "FS-CH03-08",
        "level": "Trung cấp (Multi-table JOIN 4 bảng)",
        "pattern": "Orders -> Customers -> Employees -> OrderDetails -> Fruits",
        "title": "Bài 3.8: Chi tiết hóa đơn toàn diện (Kết nối 4 bảng: OrderDetails, Orders, Customers, Fruits)",
        "question": "Hãy kết nối 4 bảng (`OrderDetails`, `Orders`, `Customers`, `Fruits`) để in ra dòng chi tiết hóa đơn gồm: `OrderDetailID`, `OrderID`, tên khách hàng (`CustomerName`), tên trái cây (`FruitName`), `Quantity`, `UnitPrice`, `SubTotal`. Sắp xếp theo `OrderDetailID` tăng dần.",
        "hint": "Bắt đầu từ `OrderDetails od`, nối lần lượt sang `Orders o`, `Customers c`, và `Fruits f`.",
        "tsql": "SELECT od.OrderDetailID, o.OrderID,\n       c.FullName AS CustomerName,\n       f.FruitName,\n       od.Quantity, od.UnitPrice, od.SubTotal\nFROM OrderDetails od\nINNER JOIN Orders o ON od.OrderID = o.OrderID\nINNER JOIN Customers c ON o.CustomerID = c.CustomerID\nINNER JOIN Fruits f ON od.FruitID = f.FruitID\nORDER BY od.OrderDetailID ASC;",
        "sqlite": "SELECT od.OrderDetailID, o.OrderID,\n       c.FullName AS CustomerName,\n       f.FruitName,\n       od.Quantity, od.UnitPrice, od.SubTotal\nFROM OrderDetails od\nINNER JOIN Orders o ON od.OrderID = o.OrderID\nINNER JOIN Customers c ON o.CustomerID = c.CustomerID\nINNER JOIN Fruits f ON od.FruitID = f.FruitID\nORDER BY od.OrderDetailID ASC;",
        "expected": {
          "cols": [
            "OrderDetailID",
            "OrderID",
            "CustomerName",
            "FruitName",
            "Quantity",
            "UnitPrice",
            "SubTotal"
          ],
          "rows": [
            [
              1,
              1,
              "Võ Thành Tài",
              "Nho Mẫu Đơn Shine Muscat",
              1,
              850000,
              850000
            ],
            [
              2,
              2,
              "Nguyễn Thị Lệ",
              "Xoài Cát Hòa Lộc",
              2,
              80000,
              160000
            ],
            [
              3,
              2,
              "Nguyễn Thị Lệ",
              "Bưởi Da Xanh",
              1,
              70000,
              70000
            ],
            [
              4,
              3,
              "Trương Vô Kỵ",
              "Sầu Riêng Ri6",
              1,
              150000,
              150000
            ],
            [
              5,
              4,
              "Triệu Mẫn",
              "Táo Envy",
              2,
              250000,
              500000
            ],
            [
              6,
              4,
              "Triệu Mẫn",
              "Cherry Đỏ Thẫm",
              1,
              450000,
              450000
            ],
            [
              7,
              5,
              "Võ Thành Tài",
              "Nho Mẫu Đơn Shine Muscat",
              2,
              850000,
              1700000
            ],
            [
              8,
              5,
              "Võ Thành Tài",
              "Cherry Đỏ Thẫm",
              2,
              450000,
              900000
            ],
            [
              9,
              6,
              "Chu Chỉ Nhược",
              "Việt Quất (Blueberry)",
              1,
              350000,
              350000
            ],
            [
              10,
              7,
              "Ân Ly",
              "Kiwi Vàng",
              1,
              180000,
              180000
            ],
            [
              11,
              8,
              "Võ Thành Tài",
              "Dâu Tây Mộc Châu",
              1,
              200000,
              200000
            ],
            [
              12,
              9,
              "Triệu Mẫn",
              "Cherry Đỏ Thẫm",
              1,
              450000,
              450000
            ],
            [
              13,
              10,
              "Tiểu Chiêu",
              "Măng Cụt Lái Thiêu",
              1,
              95000,
              95000
            ]
          ]
        }
      },
      {
        "id": "FS-CH03-09",
        "level": "Nâng cao (Toán tử tập hợp INTERSECT & EXCEPT)",
        "pattern": "SELECT FruitID FROM OrderDetails EXCEPT SELECT FruitID FROM Reviews",
        "title": "Bài 3.9: Tìm các loại trái cây đã từng được mua nhưng chưa có bất kỳ đánh giá (Review) nào",
        "question": "Sử dụng toán tử tập hợp `EXCEPT` (hoặc kết hợp CTE/Subquery với bảng `Fruits`), hãy lấy ra `FruitID` và `FruitName` của các loại trái cây đã xuất hiện trong `OrderDetails` nhưng chưa từng xuất hiện trong bảng `Reviews`. Sắp xếp theo `FruitID` tăng dần.",
        "hint": "Dùng `SELECT FruitID FROM OrderDetails EXCEPT SELECT FruitID FROM Reviews` rồi lấy thông tin từ `Fruits`.",
        "tsql": "SELECT FruitID, FruitName\nFROM Fruits\nWHERE FruitID IN (\n    SELECT FruitID FROM OrderDetails\n    EXCEPT\n    SELECT FruitID FROM Reviews\n)\nORDER BY FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName\nFROM Fruits\nWHERE FruitID IN (\n    SELECT FruitID FROM OrderDetails\n    EXCEPT\n    SELECT FruitID FROM Reviews\n)\nORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6"
            ],
            [
              2,
              "Bưởi Da Xanh"
            ],
            [
              4,
              "Măng Cụt Lái Thiêu"
            ],
            [
              7,
              "Cherry Đỏ Thẫm"
            ],
            [
              8,
              "Kiwi Vàng"
            ],
            [
              9,
              "Dâu Tây Mộc Châu"
            ]
          ]
        }
      },
      {
        "id": "FS-CH03-10",
        "level": "Thực chiến (Bẫy điều kiện lọc ở ON vs WHERE trong LEFT JOIN)",
        "pattern": "LEFT JOIN Orders o ON c.CustomerID = o.CustomerID AND o.Status = 'Đã giao'",
        "title": "Bài 3.10: Liệt kê TẤT CẢ khách hàng kèm mã đơn hàng 'Đã giao' (Bẫy ON vs WHERE trong LEFT JOIN)",
        "question": "Hãy liệt kê tất cả 8 khách hàng (`CustomerID`, `FullName`) từ bảng `Customers` cùng với `OrderID` và `TotalAmount` của những đơn hàng có trạng thái `'Đã giao'`. Nếu khách hàng chưa có đơn `'Đã giao'` nào, vẫn phải hiển thị tên khách hàng đó với `OrderID` và `TotalAmount` là `NULL`. Sắp xếp theo `CustomerID` tăng dần, `OrderID` tăng dần.",
        "hint": "Đặt điều kiện `AND o.Status = 'Đã giao'` ngay trong mệnh đề `ON` của `LEFT JOIN` (nếu đặt ở `WHERE` sẽ làm mất các khách chưa có đơn Đã giao!).",
        "tsql": "SELECT c.CustomerID, c.FullName, o.OrderID, o.TotalAmount\nFROM Customers c\nLEFT JOIN Orders o ON c.CustomerID = o.CustomerID AND o.Status = N'Đã giao'\nORDER BY c.CustomerID ASC, o.OrderID ASC;",
        "sqlite": "SELECT c.CustomerID, c.FullName, o.OrderID, o.TotalAmount\nFROM Customers c\nLEFT JOIN Orders o ON c.CustomerID = o.CustomerID AND o.Status = 'Đã giao'\nORDER BY c.CustomerID ASC, o.OrderID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "OrderID",
            "TotalAmount"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              1,
              850000
            ],
            [
              1,
              "Võ Thành Tài",
              5,
              2500000
            ],
            [
              2,
              "Nguyễn Thị Lệ",
              2,
              180000
            ],
            [
              3,
              "Trương Vô Kỵ",
              3,
              150000
            ],
            [
              4,
              "Triệu Mẫn",
              4,
              850000
            ],
            [
              5,
              "Chu Chỉ Nhược",
              6,
              300000
            ],
            [
              6,
              "Ân Ly",
              null,
              null
            ],
            [
              7,
              "Tiểu Chiêu",
              null,
              null
            ],
            [
              8,
              "Dương Quá",
              null,
              null
            ]
          ]
        }
      }
    ]
  },
  {
    "chapter_id": "ch04",
    "chapter_num": 4,
    "chapter_title": "Chương 4: Gom Nhóm (GROUP BY), Lọc Nhóm (HAVING) & Truy Vấn Con (Subqueries)",
    "pedagogy_goal": "Rèn phản xạ thống kê COUNT/SUM/AVG/MIN/MAX theo nhóm, phân biệt COUNT(*) vs COUNT(col), lọc sau gom nhóm bằng HAVING, và viết Subquery (Scalar, IN, EXISTS, NOT EXISTS).",
    "exercises": [
      {
        "id": "FS-CH04-01",
        "level": "Cơ bản (Mẫu A1 - GROUP BY & COUNT/AVG)",
        "pattern": "SELECT GroupCol, COUNT(*) AS Cnt, SUM(...) FROM Table GROUP BY GroupCol;",
        "title": "Bài 4.1: Thống kê số lượng trái cây và tổng tồn kho theo từng mã danh mục (Bảng Fruits)",
        "question": "Gom nhóm bảng `Fruits` theo `CategoryID` để tính: số lượng mặt hàng (`FruitCount`), tổng số lượng tồn kho (`TotalStock`), và giá bán trung bình làm tròn nguyên (`AvgPrice = ROUND(AVG(Price), 0)`). Sắp xếp theo `CategoryID` tăng dần.",
        "hint": "Dùng `GROUP BY CategoryID` với `COUNT(*)`, `SUM(StockQuantity)`, `ROUND(AVG(Price), 0)`.",
        "tsql": "SELECT CategoryID,\n       COUNT(*) AS FruitCount,\n       SUM(StockQuantity) AS TotalStock,\n       ROUND(AVG(CAST(Price AS FLOAT)), 0) AS AvgPrice\nFROM Fruits\nGROUP BY CategoryID\nORDER BY CategoryID ASC;",
        "sqlite": "SELECT CategoryID,\n       COUNT(*) AS FruitCount,\n       SUM(StockQuantity) AS TotalStock,\n       ROUND(AVG(Price), 0) AS AvgPrice\nFROM Fruits\nGROUP BY CategoryID\nORDER BY CategoryID ASC;",
        "expected": {
          "cols": [
            "CategoryID",
            "FruitCount",
            "TotalStock",
            "AvgPrice"
          ],
          "rows": [
            [
              1,
              4,
              450,
              98750.0
            ],
            [
              2,
              4,
              205,
              432500.0
            ],
            [
              3,
              3,
              65,
              290000.0
            ],
            [
              4,
              2,
              450,
              90000.0
            ],
            [
              5,
              1,
              90,
              280000.0
            ]
          ]
        }
      },
      {
        "id": "FS-CH04-02",
        "level": "Cơ bản (Mẫu A2 - GROUP BY trên bảng Orders)",
        "pattern": "SELECT GroupCol, COUNT(*) AS Cnt, SUM(...) FROM Table GROUP BY GroupCol; (Cùng cơ chế Bài 4.1 nhưng trên Orders)",
        "title": "Bài 4.2: Thống kê số lượng đơn hàng và tổng doanh thu theo từng trạng thái (Bảng Orders)",
        "question": "Áp dụng y hệt mẫu `GROUP BY` của Bài 4.1 nhưng trên bảng `Orders`: Gom nhóm theo trạng thái đơn (`Status`) để tính tổng số đơn (`OrderCount`) và tổng tiền (`SumTotal = SUM(TotalAmount)`). Sắp xếp theo `OrderCount` giảm dần, `Status` tăng dần.",
        "hint": "Dùng `GROUP BY Status` trên bảng `Orders`.",
        "tsql": "SELECT Status,\n       COUNT(*) AS OrderCount,\n       SUM(TotalAmount) AS SumTotal\nFROM Orders\nGROUP BY Status\nORDER BY OrderCount DESC, Status ASC;",
        "sqlite": "SELECT Status,\n       COUNT(*) AS OrderCount,\n       SUM(TotalAmount) AS SumTotal\nFROM Orders\nGROUP BY Status\nORDER BY OrderCount DESC, Status ASC;",
        "expected": {
          "cols": [
            "Status",
            "OrderCount",
            "SumTotal"
          ],
          "rows": [
            [
              "Đã giao",
              6,
              4830000
            ],
            [
              "Chờ xử lý",
              2,
              495000
            ],
            [
              "Đang giao",
              1,
              200000
            ],
            [
              "Đã hủy",
              1,
              180000
            ]
          ]
        }
      },
      {
        "id": "FS-CH04-03",
        "level": "Cơ bản (Mẫu A3 - GROUP BY trên bảng PaymentTransactions)",
        "pattern": "SELECT GroupCol, COUNT(*) AS Cnt, SUM(...) FROM Table GROUP BY GroupCol; (Cùng cơ chế Bài 4.1 & 4.2 nhưng trên PaymentTransactions)",
        "title": "Bài 4.3: Thống kê số giao dịch và tổng tiền thu được theo phương thức thanh toán",
        "question": "Tiếp tục phản xạ `GROUP BY` trên bảng `PaymentTransactions`: Gom nhóm theo `PaymentMethod` để đếm số lượng giao dịch (`TxCount`) và tổng số tiền thanh toán (`TotalPaid = SUM(Amount)`). Sắp xếp theo `TotalPaid` giảm dần.",
        "hint": "Dùng `GROUP BY PaymentMethod` và sắp xếp `ORDER BY TotalPaid DESC`.",
        "tsql": "SELECT PaymentMethod,\n       COUNT(*) AS TxCount,\n       SUM(Amount) AS TotalPaid\nFROM PaymentTransactions\nGROUP BY PaymentMethod\nORDER BY TotalPaid DESC;",
        "sqlite": "SELECT PaymentMethod,\n       COUNT(*) AS TxCount,\n       SUM(Amount) AS TotalPaid\nFROM PaymentTransactions\nGROUP BY PaymentMethod\nORDER BY TotalPaid DESC;",
        "expected": {
          "cols": [
            "PaymentMethod",
            "TxCount",
            "TotalPaid"
          ],
          "rows": [
            [
              "VNPAY",
              3,
              4200000
            ],
            [
              "Momo",
              2,
              450000
            ],
            [
              "Tiền mặt",
              1,
              200000
            ]
          ]
        }
      },
      {
        "id": "FS-CH04-04",
        "level": "Cơ bản (Mẫu B1 - Lọc nhóm bằng HAVING)",
        "pattern": "SELECT ... FROM ... GROUP BY ... HAVING AggregateFunc(...) >= Value;",
        "title": "Bài 4.4: Tìm các danh mục có từ 3 loại trái cây trở lên (GROUP BY + HAVING)",
        "question": "Kết nối `Categories` và `Fruits`, gom nhóm theo `CategoryID`, `CategoryName` và dùng `HAVING` để chỉ giữ lại các danh mục có số lượng trái cây `COUNT(f.FruitID) >= 3`. Sắp xếp theo `CategoryID` tăng dần.",
        "hint": "Dùng `GROUP BY c.CategoryID, c.CategoryName HAVING COUNT(f.FruitID) >= 3`.",
        "tsql": "SELECT c.CategoryID, c.CategoryName, COUNT(f.FruitID) AS FruitCount\nFROM Categories c\nINNER JOIN Fruits f ON c.CategoryID = f.CategoryID\nGROUP BY c.CategoryID, c.CategoryName\nHAVING COUNT(f.FruitID) >= 3\nORDER BY c.CategoryID ASC;",
        "sqlite": "SELECT c.CategoryID, c.CategoryName, COUNT(f.FruitID) AS FruitCount\nFROM Categories c\nINNER JOIN Fruits f ON c.CategoryID = f.CategoryID\nGROUP BY c.CategoryID, c.CategoryName\nHAVING COUNT(f.FruitID) >= 3\nORDER BY c.CategoryID ASC;",
        "expected": {
          "cols": [
            "CategoryID",
            "CategoryName",
            "FruitCount"
          ],
          "rows": [
            [
              1,
              "Đặc sản Miền Tây",
              4
            ],
            [
              2,
              "Trái cây Nhập khẩu",
              4
            ],
            [
              3,
              "Quả mọng (Berries)",
              3
            ]
          ]
        }
      },
      {
        "id": "FS-CH04-05",
        "level": "Cơ bản (Mẫu B2 - GROUP BY + HAVING trên Customers & Orders)",
        "pattern": "SELECT ... FROM ... GROUP BY ... HAVING AggregateFunc(...) >= Value; (Cùng cơ chế Bài 4.4 nhưng tìm Khách mua >= 2 đơn)",
        "title": "Bài 4.5: Tìm các khách hàng đã đặt từ 2 đơn hàng trở lên",
        "question": "Áp dụng y hệt mẫu `GROUP BY ... HAVING` của Bài 4.4 nhưng giữa `Customers` và `Orders`: Lấy ra `CustomerID`, `FullName`, số lượng đơn hàng (`OrderCount`) và tổng chi tiêu (`TotalSpent`) của những khách hàng có từ `2` đơn hàng trở lên. Sắp xếp theo `TotalSpent` giảm dần.",
        "hint": "Dùng `HAVING COUNT(o.OrderID) >= 2`.",
        "tsql": "SELECT c.CustomerID, c.FullName,\n       COUNT(o.OrderID) AS OrderCount,\n       SUM(o.TotalAmount) AS TotalSpent\nFROM Customers c\nINNER JOIN Orders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID, c.FullName\nHAVING COUNT(o.OrderID) >= 2\nORDER BY TotalSpent DESC;",
        "sqlite": "SELECT c.CustomerID, c.FullName,\n       COUNT(o.OrderID) AS OrderCount,\n       SUM(o.TotalAmount) AS TotalSpent\nFROM Customers c\nINNER JOIN Orders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID, c.FullName\nHAVING COUNT(o.OrderID) >= 2\nORDER BY TotalSpent DESC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "OrderCount",
            "TotalSpent"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              3,
              3550000
            ],
            [
              4,
              "Triệu Mẫn",
              2,
              1250000
            ]
          ]
        }
      },
      {
        "id": "FS-CH04-06",
        "level": "Cơ bản (Mẫu B3 - GROUP BY + HAVING trên Fruits & OrderDetails)",
        "pattern": "SELECT ... FROM ... GROUP BY ... HAVING AggregateFunc(...) >= Value; (Cùng cơ chế Bài 4.4 & 4.5 nhưng tìm Trái cây bán được >= 3 đơn vị)",
        "title": "Bài 4.6: Tìm các loại trái cây có tổng số lượng bán ra từ 3 trở lên",
        "question": "Tiếp tục phản xạ `GROUP BY ... HAVING` giữa `Fruits` và `OrderDetails`: Lấy ra `FruitID`, `FruitName`, tổng số lượng đã bán (`TotalQtySold = SUM(od.Quantity)`) và tổng doanh thu món (`TotalItemRevenue = SUM(od.SubTotal)`) của các loại trái cây có `SUM(od.Quantity) >= 3`. Sắp xếp theo `TotalItemRevenue` giảm dần.",
        "hint": "Dùng `HAVING SUM(od.Quantity) >= 3`.",
        "tsql": "SELECT f.FruitID, f.FruitName,\n       SUM(od.Quantity) AS TotalQtySold,\n       SUM(od.SubTotal) AS TotalItemRevenue\nFROM Fruits f\nINNER JOIN OrderDetails od ON f.FruitID = od.FruitID\nGROUP BY f.FruitID, f.FruitName\nHAVING SUM(od.Quantity) >= 3\nORDER BY TotalItemRevenue DESC;",
        "sqlite": "SELECT f.FruitID, f.FruitName,\n       SUM(od.Quantity) AS TotalQtySold,\n       SUM(od.SubTotal) AS TotalItemRevenue\nFROM Fruits f\nINNER JOIN OrderDetails od ON f.FruitID = od.FruitID\nGROUP BY f.FruitID, f.FruitName\nHAVING SUM(od.Quantity) >= 3\nORDER BY TotalItemRevenue DESC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "TotalQtySold",
            "TotalItemRevenue"
          ],
          "rows": [
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              3,
              2550000
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              4,
              1800000
            ]
          ]
        }
      },
      {
        "id": "FS-CH04-07",
        "level": "Trung cấp (Scalar Subquery so sánh với giá trị trung bình toàn bảng)",
        "pattern": "SELECT ... FROM Table WHERE Col > (SELECT AVG(Col) FROM Table);",
        "title": "Bài 4.7: Tìm các loại trái cây có giá bán cao hơn giá trung bình của toàn cửa hàng",
        "question": "Sử dụng truy vấn con vô hướng (Scalar Subquery), hãy lấy ra `FruitID`, `FruitName`, `Price` của các loại trái cây có giá bán lớn hơn mức giá trung bình `AVG(Price)` của tất cả trái cây trong bảng `Fruits`. Sắp xếp theo `Price` giảm dần.",
        "hint": "Dùng `WHERE Price > (SELECT AVG(Price) FROM Fruits)`.",
        "tsql": "SELECT FruitID, FruitName, Price\nFROM Fruits\nWHERE Price > (SELECT AVG(CAST(Price AS FLOAT)) FROM Fruits)\nORDER BY Price DESC;",
        "sqlite": "SELECT FruitID, FruitName, Price\nFROM Fruits\nWHERE Price > (SELECT AVG(Price) FROM Fruits)\nORDER BY Price DESC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price"
          ],
          "rows": [
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              850000
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              450000
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              350000
            ],
            [
              11,
              "Mâm Xôi Đen",
              320000
            ],
            [
              14,
              "Hạt Mắc Ca",
              280000
            ],
            [
              6,
              "Táo Envy",
              250000
            ]
          ]
        }
      },
      {
        "id": "FS-CH04-08",
        "level": "Trung cấp (Correlated Subquery - So sánh với trung bình của chính danh mục đó)",
        "pattern": "WHERE f1.Price > (SELECT AVG(f2.Price) FROM Fruits f2 WHERE f2.CategoryID = f1.CategoryID)",
        "title": "Bài 4.8: Tìm các loại trái cây có giá bán cao hơn giá trung bình của CHÍNH danh mục chứa nó",
        "question": "Sử dụng Truy vấn con tương quan (Correlated Subquery), hãy lấy ra `FruitID`, `FruitName`, `CategoryID`, `Price` của những loại trái cây có giá bán lớn hơn giá trung bình của các trái cây trong cùng `CategoryID` đó. Sắp xếp theo `CategoryID` tăng dần, `Price` giảm dần.",
        "hint": "Trong subquery, liên kết điều kiện `WHERE f2.CategoryID = f1.CategoryID`.",
        "tsql": "SELECT f1.FruitID, f1.FruitName, f1.CategoryID, f1.Price\nFROM Fruits f1\nWHERE f1.Price > (\n    SELECT AVG(CAST(f2.Price AS FLOAT))\n    FROM Fruits f2\n    WHERE f2.CategoryID = f1.CategoryID\n)\nORDER BY f1.CategoryID ASC, f1.Price DESC;",
        "sqlite": "SELECT f1.FruitID, f1.FruitName, f1.CategoryID, f1.Price\nFROM Fruits f1\nWHERE f1.Price > (\n    SELECT AVG(f2.Price)\n    FROM Fruits f2\n    WHERE f2.CategoryID = f1.CategoryID\n)\nORDER BY f1.CategoryID ASC, f1.Price DESC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "CategoryID",
            "Price"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              1,
              150000
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              2,
              850000
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              2,
              450000
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              3,
              350000
            ],
            [
              11,
              "Mâm Xôi Đen",
              3,
              320000
            ],
            [
              12,
              "Nho khô Ninh Thuận",
              4,
              120000
            ]
          ]
        }
      },
      {
        "id": "FS-CH04-09",
        "level": "Nâng cao (EXISTS & NOT EXISTS an toàn với NULL)",
        "pattern": "SELECT ... FROM Customers c WHERE EXISTS (...) AND NOT EXISTS (...)",
        "title": "Bài 4.9: Tìm khách hàng đã từng đặt đơn hàng nhưng CHƯA TỪNG viết đánh giá (Review) nào",
        "question": "Sử dụng `EXISTS` kết hợp `NOT EXISTS`, hãy lấy ra `CustomerID`, `FullName`, `CustomerType` của những khách hàng có ít nhất 1 đơn hàng trong `Orders` nhưng chưa từng có bản ghi nào trong bảng `Reviews`. Sắp xếp theo `CustomerID` tăng dần.",
        "hint": "Kết hợp `WHERE EXISTS (SELECT 1 FROM Orders o WHERE o.CustomerID = c.CustomerID) AND NOT EXISTS (SELECT 1 FROM Reviews r WHERE r.CustomerID = c.CustomerID)`.",
        "tsql": "SELECT c.CustomerID, c.FullName, c.CustomerType\nFROM Customers c\nWHERE EXISTS (\n    SELECT 1 FROM Orders o WHERE o.CustomerID = c.CustomerID\n)\nAND NOT EXISTS (\n    SELECT 1 FROM Reviews r WHERE r.CustomerID = c.CustomerID\n)\nORDER BY c.CustomerID ASC;",
        "sqlite": "SELECT c.CustomerID, c.FullName, c.CustomerType\nFROM Customers c\nWHERE EXISTS (\n    SELECT 1 FROM Orders o WHERE o.CustomerID = c.CustomerID\n)\nAND NOT EXISTS (\n    SELECT 1 FROM Reviews r WHERE r.CustomerID = c.CustomerID\n)\nORDER BY c.CustomerID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "CustomerType"
          ],
          "rows": [
            [
              3,
              "Trương Vô Kỵ",
              "Standard"
            ],
            [
              6,
              "Ân Ly",
              "Standard"
            ],
            [
              7,
              "Tiểu Chiêu",
              "Standard"
            ]
          ]
        }
      },
      {
        "id": "FS-CH04-10",
        "level": "Thực chiến (Bẫy COUNT(*) vs COUNT(Column) trên cột có NULL)",
        "pattern": "COUNT(*) vs COUNT(VoucherID) vs COUNT(DISTINCT CustomerID)",
        "title": "Bài 4.10: Báo cáo hiệu suất nhân viên bán hàng: Phân biệt Tổng số đơn, Số đơn có dùng Voucher và Số khách duy nhất",
        "question": "Gom nhóm bảng `Orders` kết hợp với `Employees` theo nhân viên bán hàng (`EmployeeID`, `FullName`) để tính 4 chỉ số trong cùng 1 câu truy vấn: Tổng số đơn phụ trách (`TotalOrders = COUNT(*)`), Số đơn có áp mã giảm giá (`VoucherOrders = COUNT(o.VoucherID)`), Số khách hàng duy nhất đã phục vụ (`UniqueCustomers = COUNT(DISTINCT o.CustomerID)`), và Tổng doanh thu (`TotalRevenue = SUM(o.TotalAmount)`). Sắp xếp theo `EmployeeID` tăng dần.",
        "hint": "Nhờ `COUNT(o.VoucherID)` tự động bỏ qua `NULL`, bạn đếm được chính xác số đơn có dùng mã giảm giá mà không cần `WHERE`!",
        "tsql": "SELECT e.EmployeeID, e.FullName,\n       COUNT(*) AS TotalOrders,\n       COUNT(o.VoucherID) AS VoucherOrders,\n       COUNT(DISTINCT o.CustomerID) AS UniqueCustomers,\n       SUM(o.TotalAmount) AS TotalRevenue\nFROM Employees e\nINNER JOIN Orders o ON e.EmployeeID = o.EmployeeID\nGROUP BY e.EmployeeID, e.FullName\nORDER BY e.EmployeeID ASC;",
        "sqlite": "SELECT e.EmployeeID, e.FullName,\n       COUNT(*) AS TotalOrders,\n       COUNT(o.VoucherID) AS VoucherOrders,\n       COUNT(DISTINCT o.CustomerID) AS UniqueCustomers,\n       SUM(o.TotalAmount) AS TotalRevenue\nFROM Employees e\nINNER JOIN Orders o ON e.EmployeeID = o.EmployeeID\nGROUP BY e.EmployeeID, e.FullName\nORDER BY e.EmployeeID ASC;",
        "expected": {
          "cols": [
            "EmployeeID",
            "FullName",
            "TotalOrders",
            "VoucherOrders",
            "UniqueCustomers",
            "TotalRevenue"
          ],
          "rows": [
            [
              6,
              "Hoàng Cúc",
              6,
              2,
              4,
              4005000
            ],
            [
              7,
              "Đinh Hợi",
              4,
              3,
              3,
              1700000
            ]
          ]
        }
      }
    ]
  },
  {
    "chapter_id": "ch05",
    "chapter_num": 5,
    "chapter_title": "Chương 5: Window Functions, CTE, Đệ Quy (Recursive CTE) & Phân Trang",
    "pedagogy_goal": "Rèn phản xạ xếp hạng (ROW_NUMBER, RANK, DENSE_RANK), tính lũy kế (Running Total), so sánh dòng trước/sau (LAG/LEAD), viết CTE lấy Top N mỗi nhóm và đệ quy cây nhân sự (Recursive CTE).",
    "exercises": [
      {
        "id": "FS-CH05-01",
        "level": "Cơ bản (Mẫu A1 - ROW_NUMBER, RANK, DENSE_RANK trên bảng Fruits)",
        "pattern": "ROW_NUMBER() OVER (ORDER BY Col DESC), DENSE_RANK() OVER (ORDER BY Col DESC)",
        "title": "Bài 5.1: Xếp hạng giá bán toàn bộ trái cây bằng ROW_NUMBER và DENSE_RANK (Bảng Fruits)",
        "question": "Từ bảng `Fruits`, hãy lấy ra `FruitID`, `FruitName`, `Price`, cùng với số thứ tự dòng (`RowNum = ROW_NUMBER() OVER (ORDER BY Price DESC, FruitID ASC)`) và thứ hạng đồng hạng không nhảy bậc (`DenseRk = DENSE_RANK() OVER (ORDER BY Price DESC)`). Sắp xếp theo `RowNum` tăng dần.",
        "hint": "Sử dụng cú pháp `OVER (ORDER BY Price DESC)` cho các hàm cửa sổ.",
        "tsql": "SELECT FruitID, FruitName, Price,\n       ROW_NUMBER() OVER (ORDER BY Price DESC, FruitID ASC) AS RowNum,\n       DENSE_RANK() OVER (ORDER BY Price DESC) AS DenseRk\nFROM Fruits\nORDER BY RowNum ASC;",
        "sqlite": "SELECT FruitID, FruitName, Price,\n       ROW_NUMBER() OVER (ORDER BY Price DESC, FruitID ASC) AS RowNum,\n       DENSE_RANK() OVER (ORDER BY Price DESC) AS DenseRk\nFROM Fruits\nORDER BY RowNum ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price",
            "RowNum",
            "DenseRk"
          ],
          "rows": [
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              850000,
              1,
              1
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              450000,
              2,
              2
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              350000,
              3,
              3
            ],
            [
              11,
              "Mâm Xôi Đen",
              320000,
              4,
              4
            ],
            [
              14,
              "Hạt Mắc Ca",
              280000,
              5,
              5
            ],
            [
              6,
              "Táo Envy",
              250000,
              6,
              6
            ],
            [
              9,
              "Dâu Tây Mộc Châu",
              200000,
              7,
              7
            ],
            [
              8,
              "Kiwi Vàng",
              180000,
              8,
              8
            ],
            [
              1,
              "Sầu Riêng Ri6",
              150000,
              9,
              9
            ],
            [
              12,
              "Nho khô Ninh Thuận",
              120000,
              10,
              10
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              95000,
              11,
              11
            ],
            [
              3,
              "Xoài Cát Hòa Lộc",
              80000,
              12,
              12
            ],
            [
              2,
              "Bưởi Da Xanh",
              70000,
              13,
              13
            ],
            [
              13,
              "Mít sấy giòn",
              60000,
              14,
              14
            ]
          ]
        }
      },
      {
        "id": "FS-CH05-02",
        "level": "Cơ bản (Mẫu A2 - Xếp hạng trên bảng Orders)",
        "pattern": "RANK() OVER (ORDER BY Col DESC), DENSE_RANK() OVER (ORDER BY Col DESC) (Cùng cơ chế Bài 5.1 nhưng trên Orders)",
        "title": "Bài 5.2: Xếp hạng các đơn hàng theo giá trị TotalAmount từ cao xuống thấp (Bảng Orders)",
        "question": "Áp dụng y hệt cơ chế Window Ranking của Bài 5.1 nhưng trên bảng `Orders`: Lấy ra `OrderID`, `CustomerID`, `TotalAmount`, `RANK() OVER (ORDER BY TotalAmount DESC)` đặt tên là `OrderRank`, và `DENSE_RANK() OVER (ORDER BY TotalAmount DESC)` đặt tên là `OrderDenseRank`. Sắp xếp theo `TotalAmount` giảm dần, `OrderID` tăng dần.",
        "hint": "Quan sát sự khác biệt giữa `RANK` và `DENSE_RANK` tại hai đơn hàng đồng giá trị `850000` và `180000`!",
        "tsql": "SELECT OrderID, CustomerID, TotalAmount,\n       RANK() OVER (ORDER BY TotalAmount DESC) AS OrderRank,\n       DENSE_RANK() OVER (ORDER BY TotalAmount DESC) AS OrderDenseRank\nFROM Orders\nORDER BY TotalAmount DESC, OrderID ASC;",
        "sqlite": "SELECT OrderID, CustomerID, TotalAmount,\n       RANK() OVER (ORDER BY TotalAmount DESC) AS OrderRank,\n       DENSE_RANK() OVER (ORDER BY TotalAmount DESC) AS OrderDenseRank\nFROM Orders\nORDER BY TotalAmount DESC, OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "TotalAmount",
            "OrderRank",
            "OrderDenseRank"
          ],
          "rows": [
            [
              5,
              1,
              2500000,
              1,
              1
            ],
            [
              1,
              1,
              850000,
              2,
              2
            ],
            [
              4,
              4,
              850000,
              2,
              2
            ],
            [
              9,
              4,
              400000,
              4,
              3
            ],
            [
              6,
              5,
              300000,
              5,
              4
            ],
            [
              8,
              1,
              200000,
              6,
              5
            ],
            [
              2,
              2,
              180000,
              7,
              6
            ],
            [
              7,
              6,
              180000,
              7,
              6
            ],
            [
              3,
              3,
              150000,
              9,
              7
            ],
            [
              10,
              7,
              95000,
              10,
              8
            ]
          ]
        }
      },
      {
        "id": "FS-CH05-03",
        "level": "Cơ bản (Mẫu A3 - Xếp hạng có PARTITION BY)",
        "pattern": "ROW_NUMBER() OVER (PARTITION BY GroupCol ORDER BY MeasureCol DESC)",
        "title": "Bài 5.3: Xếp hạng giá trái cây TRONG TỪNG DANH MỤC bằng PARTITION BY (Bảng Fruits)",
        "question": "Tiếp tục phản xạ Window Ranking nhưng thêm `PARTITION BY CategoryID`: Lấy ra `CategoryID`, `FruitID`, `FruitName`, `Price` và thứ hạng của trái cây trong từng danh mục (`RankInCat = ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Price DESC, FruitID ASC)`). Sắp xếp theo `CategoryID` tăng dần, `RankInCat` tăng dần.",
        "hint": "Khi có `PARTITION BY CategoryID`, bộ đếm sẽ tự động reset về 1 mỗi khi sang `CategoryID` mới.",
        "tsql": "SELECT CategoryID, FruitID, FruitName, Price,\n       ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Price DESC, FruitID ASC) AS RankInCat\nFROM Fruits\nORDER BY CategoryID ASC, RankInCat ASC;",
        "sqlite": "SELECT CategoryID, FruitID, FruitName, Price,\n       ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Price DESC, FruitID ASC) AS RankInCat\nFROM Fruits\nORDER BY CategoryID ASC, RankInCat ASC;",
        "expected": {
          "cols": [
            "CategoryID",
            "FruitID",
            "FruitName",
            "Price",
            "RankInCat"
          ],
          "rows": [
            [
              1,
              1,
              "Sầu Riêng Ri6",
              150000,
              1
            ],
            [
              1,
              4,
              "Măng Cụt Lái Thiêu",
              95000,
              2
            ],
            [
              1,
              3,
              "Xoài Cát Hòa Lộc",
              80000,
              3
            ],
            [
              1,
              2,
              "Bưởi Da Xanh",
              70000,
              4
            ],
            [
              2,
              5,
              "Nho Mẫu Đơn Shine Muscat",
              850000,
              1
            ],
            [
              2,
              7,
              "Cherry Đỏ Thẫm",
              450000,
              2
            ],
            [
              2,
              6,
              "Táo Envy",
              250000,
              3
            ],
            [
              2,
              8,
              "Kiwi Vàng",
              180000,
              4
            ],
            [
              3,
              10,
              "Việt Quất (Blueberry)",
              350000,
              1
            ],
            [
              3,
              11,
              "Mâm Xôi Đen",
              320000,
              2
            ],
            [
              3,
              9,
              "Dâu Tây Mộc Châu",
              200000,
              3
            ],
            [
              4,
              12,
              "Nho khô Ninh Thuận",
              120000,
              1
            ],
            [
              4,
              13,
              "Mít sấy giòn",
              60000,
              2
            ],
            [
              5,
              14,
              "Hạt Mắc Ca",
              280000,
              1
            ]
          ]
        }
      },
      {
        "id": "FS-CH05-04",
        "level": "Cơ bản (Mẫu B1 - CTE lọc Top N mỗi nhóm)",
        "pattern": "WITH Ranked AS (SELECT ..., ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) AS rn FROM ...) SELECT * FROM Ranked WHERE rn <= N;",
        "title": "Bài 5.4: Lấy ra 2 loại trái cây đắt nhất của mỗi danh mục (CTE + ROW_NUMBER)",
        "question": "Bọc câu truy vấn ở Bài 5.3 vào một CTE tên là `RankedFruits`, sau đó lọc `WHERE RankInCat <= 2` để lấy ra tối đa 2 loại trái cây có giá cao nhất trong mỗi danh mục (`CategoryID`, `FruitID`, `FruitName`, `Price`, `RankInCat`). Sắp xếp theo `CategoryID` tăng dần, `RankInCat` tăng dần.",
        "hint": "Vì không thể dùng trực tiếp Window Function trong `WHERE`, ta bắt buộc dùng CTE `WITH RankedFruits AS (...) SELECT ... WHERE RankInCat <= 2`.",
        "tsql": "WITH RankedFruits AS (\n    SELECT CategoryID, FruitID, FruitName, Price,\n           ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Price DESC, FruitID ASC) AS RankInCat\n    FROM Fruits\n)\nSELECT CategoryID, FruitID, FruitName, Price, RankInCat\nFROM RankedFruits\nWHERE RankInCat <= 2\nORDER BY CategoryID ASC, RankInCat ASC;",
        "sqlite": "WITH RankedFruits AS (\n    SELECT CategoryID, FruitID, FruitName, Price,\n           ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Price DESC, FruitID ASC) AS RankInCat\n    FROM Fruits\n)\nSELECT CategoryID, FruitID, FruitName, Price, RankInCat\nFROM RankedFruits\nWHERE RankInCat <= 2\nORDER BY CategoryID ASC, RankInCat ASC;",
        "expected": {
          "cols": [
            "CategoryID",
            "FruitID",
            "FruitName",
            "Price",
            "RankInCat"
          ],
          "rows": [
            [
              1,
              1,
              "Sầu Riêng Ri6",
              150000,
              1
            ],
            [
              1,
              4,
              "Măng Cụt Lái Thiêu",
              95000,
              2
            ],
            [
              2,
              5,
              "Nho Mẫu Đơn Shine Muscat",
              850000,
              1
            ],
            [
              2,
              7,
              "Cherry Đỏ Thẫm",
              450000,
              2
            ],
            [
              3,
              10,
              "Việt Quất (Blueberry)",
              350000,
              1
            ],
            [
              3,
              11,
              "Mâm Xôi Đen",
              320000,
              2
            ],
            [
              4,
              12,
              "Nho khô Ninh Thuận",
              120000,
              1
            ],
            [
              4,
              13,
              "Mít sấy giòn",
              60000,
              2
            ],
            [
              5,
              14,
              "Hạt Mắc Ca",
              280000,
              1
            ]
          ]
        }
      },
      {
        "id": "FS-CH05-05",
        "level": "Cơ bản (Mẫu B2 - CTE lọc Top 1 đơn hàng lớn nhất của mỗi khách hàng)",
        "pattern": "WITH Ranked AS (SELECT ..., ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) AS rn FROM ...) SELECT * FROM Ranked WHERE rn = 1; (Cùng cơ chế Bài 5.4 nhưng trên Orders)",
        "title": "Bài 5.5: Tìm đơn hàng có giá trị lớn nhất của từng khách hàng (CTE + PARTITION BY CustomerID)",
        "question": "Áp dụng y hệt khuôn mẫu CTE + `ROW_NUMBER() OVER (PARTITION BY ...)` của Bài 5.4 trên bảng `Orders`: Với mỗi `CustomerID` có đặt hàng, hãy lấy ra đơn hàng có `TotalAmount` lớn nhất (nếu bằng nhau lấy `OrderID` nhỏ hơn). Hiển thị `CustomerID`, `OrderID`, `OrderDate`, `TotalAmount`. Sắp xếp theo `CustomerID` tăng dần.",
        "hint": "Phân vùng `PARTITION BY CustomerID ORDER BY TotalAmount DESC, OrderID ASC` và lọc `WHERE rn = 1`.",
        "tsql": "WITH CustomerTopOrders AS (\n    SELECT CustomerID, OrderID, OrderDate, TotalAmount,\n           ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY TotalAmount DESC, OrderID ASC) AS rn\n    FROM Orders\n)\nSELECT CustomerID, OrderID, OrderDate, TotalAmount\nFROM CustomerTopOrders\nWHERE rn = 1\nORDER BY CustomerID ASC;",
        "sqlite": "WITH CustomerTopOrders AS (\n    SELECT CustomerID, OrderID, OrderDate, TotalAmount,\n           ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY TotalAmount DESC, OrderID ASC) AS rn\n    FROM Orders\n)\nSELECT CustomerID, OrderID, OrderDate, TotalAmount\nFROM CustomerTopOrders\nWHERE rn = 1\nORDER BY CustomerID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "OrderID",
            "OrderDate",
            "TotalAmount"
          ],
          "rows": [
            [
              1,
              5,
              "2023-12-24 19:00:00",
              2500000
            ],
            [
              2,
              2,
              "2023-04-20 14:30:00",
              180000
            ],
            [
              3,
              3,
              "2023-06-15 09:00:00",
              150000
            ],
            [
              4,
              4,
              "2023-08-08 16:45:00",
              850000
            ],
            [
              5,
              6,
              "2024-01-10 08:30:00",
              300000
            ],
            [
              6,
              7,
              "2024-02-14 11:20:00",
              180000
            ],
            [
              7,
              10,
              "2024-03-10 14:00:00",
              95000
            ]
          ]
        }
      },
      {
        "id": "FS-CH05-06",
        "level": "Cơ bản (Mẫu B3 - CTE lọc đơn hàng mới nhất của mỗi nhân viên bán hàng)",
        "pattern": "WITH Ranked AS (SELECT ..., ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) AS rn FROM ...) SELECT * FROM Ranked WHERE rn = 1; (Cùng cơ chế Bài 5.4 & 5.5 nhưng theo EmployeeID)",
        "title": "Bài 5.6: Tìm đơn hàng gần đây nhất do từng nhân viên bán hàng phụ trách",
        "question": "Tiếp tục phản xạ CTE + `ROW_NUMBER()` trên bảng `Orders`: Với mỗi `EmployeeID`, hãy tìm đơn hàng có `OrderDate` mới nhất (`ORDER BY OrderDate DESC, OrderID DESC`). Lấy ra `EmployeeID`, `OrderID`, `CustomerID`, `OrderDate`, `TotalAmount`. Sắp xếp theo `EmployeeID` tăng dần.",
        "hint": "Dùng `PARTITION BY EmployeeID ORDER BY OrderDate DESC, OrderID DESC` rồi lọc `WHERE rn = 1`.",
        "tsql": "WITH LatestEmpOrder AS (\n    SELECT EmployeeID, OrderID, CustomerID, OrderDate, TotalAmount,\n           ROW_NUMBER() OVER (PARTITION BY EmployeeID ORDER BY OrderDate DESC, OrderID DESC) AS rn\n    FROM Orders\n)\nSELECT EmployeeID, OrderID, CustomerID, OrderDate, TotalAmount\nFROM LatestEmpOrder\nWHERE rn = 1\nORDER BY EmployeeID ASC;",
        "sqlite": "WITH LatestEmpOrder AS (\n    SELECT EmployeeID, OrderID, CustomerID, OrderDate, TotalAmount,\n           ROW_NUMBER() OVER (PARTITION BY EmployeeID ORDER BY OrderDate DESC, OrderID DESC) AS rn\n    FROM Orders\n)\nSELECT EmployeeID, OrderID, CustomerID, OrderDate, TotalAmount\nFROM LatestEmpOrder\nWHERE rn = 1\nORDER BY EmployeeID ASC;",
        "expected": {
          "cols": [
            "EmployeeID",
            "OrderID",
            "CustomerID",
            "OrderDate",
            "TotalAmount"
          ],
          "rows": [
            [
              6,
              10,
              7,
              "2024-03-10 14:00:00",
              95000
            ],
            [
              7,
              9,
              4,
              "2024-03-05 10:00:00",
              400000
            ]
          ]
        }
      },
      {
        "id": "FS-CH05-07",
        "level": "Trung cấp (Tổng lũy kế Running Total với SUM() OVER)",
        "pattern": "SUM(TotalAmount) OVER (ORDER BY OrderDate, OrderID ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)",
        "title": "Bài 5.7: Tính doanh thu lũy kế (Running Total) theo thời gian của các đơn hàng 'Đã giao'",
        "question": "Với các đơn hàng có `Status = 'Đã giao'`, hãy lấy ra `OrderID`, `OrderDate`, `TotalAmount` và cột doanh thu cộng dồn từ đơn đầu tiên đến đơn hiện tại (`RunningRevenue = SUM(TotalAmount) OVER (ORDER BY OrderDate ASC, OrderID ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`). Sắp xếp theo `OrderDate` tăng dần, `OrderID` tăng dần.",
        "hint": "Luôn khai báo tường minh `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` để tránh bẫy mặc định `RANGE`.",
        "tsql": "SELECT OrderID, OrderDate, TotalAmount,\n       SUM(TotalAmount) OVER (\n           ORDER BY OrderDate ASC, OrderID ASC\n           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n       ) AS RunningRevenue\nFROM Orders\nWHERE Status = N'Đã giao'\nORDER BY OrderDate ASC, OrderID ASC;",
        "sqlite": "SELECT OrderID, OrderDate, TotalAmount,\n       SUM(TotalAmount) OVER (\n           ORDER BY OrderDate ASC, OrderID ASC\n           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n       ) AS RunningRevenue\nFROM Orders\nWHERE Status = 'Đã giao'\nORDER BY OrderDate ASC, OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "OrderDate",
            "TotalAmount",
            "RunningRevenue"
          ],
          "rows": [
            [
              1,
              "2023-02-14 10:15:00",
              850000,
              850000
            ],
            [
              2,
              "2023-04-20 14:30:00",
              180000,
              1030000
            ],
            [
              3,
              "2023-06-15 09:00:00",
              150000,
              1180000
            ],
            [
              4,
              "2023-08-08 16:45:00",
              850000,
              2030000
            ],
            [
              5,
              "2023-12-24 19:00:00",
              2500000,
              4530000
            ],
            [
              6,
              "2024-01-10 08:30:00",
              300000,
              4830000
            ]
          ]
        }
      },
      {
        "id": "FS-CH05-08",
        "level": "Trung cấp (So sánh với dòng liền trước bằng hàm LAG)",
        "pattern": "LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate ASC)",
        "title": "Bài 5.8: So sánh chênh lệch giá trị đơn hàng hiện tại với đơn hàng liền trước của cùng khách hàng (Hàm LAG)",
        "question": "Từ bảng `Orders`, hãy lấy ra `CustomerID`, `OrderID`, `OrderDate`, `TotalAmount`, giá trị đơn liền trước của chính khách hàng đó (`PrevOrderAmount = LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate ASC, OrderID ASC)`) và mức chênh lệch (`DiffAmount = TotalAmount - PrevOrderAmount`). Sắp xếp theo `CustomerID` tăng dần, `OrderDate` tăng dần.",
        "hint": "Tham số thứ 3 của `LAG(TotalAmount, 1, 0)` giúp thay thế giá trị `NULL` của đơn đầu tiên bằng `0`.",
        "tsql": "SELECT CustomerID, OrderID, OrderDate, TotalAmount,\n       LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate ASC, OrderID ASC) AS PrevOrderAmount,\n       TotalAmount - LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate ASC, OrderID ASC) AS DiffAmount\nFROM Orders\nORDER BY CustomerID ASC, OrderDate ASC, OrderID ASC;",
        "sqlite": "SELECT CustomerID, OrderID, OrderDate, TotalAmount,\n       LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate ASC, OrderID ASC) AS PrevOrderAmount,\n       TotalAmount - LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate ASC, OrderID ASC) AS DiffAmount\nFROM Orders\nORDER BY CustomerID ASC, OrderDate ASC, OrderID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "OrderID",
            "OrderDate",
            "TotalAmount",
            "PrevOrderAmount",
            "DiffAmount"
          ],
          "rows": [
            [
              1,
              1,
              "2023-02-14 10:15:00",
              850000,
              0,
              850000
            ],
            [
              1,
              5,
              "2023-12-24 19:00:00",
              2500000,
              850000,
              1650000
            ],
            [
              1,
              8,
              "2024-03-01 15:10:00",
              200000,
              2500000,
              -2300000
            ],
            [
              2,
              2,
              "2023-04-20 14:30:00",
              180000,
              0,
              180000
            ],
            [
              3,
              3,
              "2023-06-15 09:00:00",
              150000,
              0,
              150000
            ],
            [
              4,
              4,
              "2023-08-08 16:45:00",
              850000,
              0,
              850000
            ],
            [
              4,
              9,
              "2024-03-05 10:00:00",
              400000,
              850000,
              -450000
            ],
            [
              5,
              6,
              "2024-01-10 08:30:00",
              300000,
              0,
              300000
            ],
            [
              6,
              7,
              "2024-02-14 11:20:00",
              180000,
              0,
              180000
            ],
            [
              7,
              10,
              "2024-03-10 14:00:00",
              95000,
              0,
              95000
            ]
          ]
        }
      },
      {
        "id": "FS-CH05-09",
        "level": "Nâng cao (Đệ quy cây phân cấp nhân sự với Recursive CTE)",
        "pattern": "WITH OrgChart AS (Anchor UNION ALL Recursive) SELECT * FROM OrgChart;",
        "title": "Bài 5.9: Truy vết sơ đồ cây phân cấp nhân sự 3 tầng từ Giám đốc xuống Nhân viên (Recursive CTE)",
        "question": "Viết một Recursive CTE tên là `OrgChart` trên bảng `Employees`: Phần neo (Anchor) bắt đầu từ Giám đốc (`ManagerID IS NULL`) với `OrgLevel = 1`. Phần đệ quy nối `Employees e INNER JOIN OrgChart o ON e.ManagerID = o.EmployeeID` với `OrgLevel = o.OrgLevel + 1`. Lấy ra `EmployeeID`, `FullName`, `Role`, `ManagerID`, `OrgLevel`, sắp xếp theo `OrgLevel` tăng dần, `EmployeeID` tăng dần.",
        "hint": "Cấu trúc chuẩn: `WITH OrgChart AS (SELECT ..., 1 AS OrgLevel FROM Employees WHERE ManagerID IS NULL UNION ALL SELECT ..., o.OrgLevel + 1 FROM Employees e INNER JOIN OrgChart o ON e.ManagerID = o.EmployeeID)`.",
        "tsql": "WITH OrgChart AS (\n    SELECT EmployeeID, FullName, Role, ManagerID, 1 AS OrgLevel\n    FROM Employees\n    WHERE ManagerID IS NULL\n    UNION ALL\n    SELECT e.EmployeeID, e.FullName, e.Role, e.ManagerID, o.OrgLevel + 1\n    FROM Employees e\n    INNER JOIN OrgChart o ON e.ManagerID = o.EmployeeID\n)\nSELECT EmployeeID, FullName, Role, ManagerID, OrgLevel\nFROM OrgChart\nORDER BY OrgLevel ASC, EmployeeID ASC;",
        "sqlite": "WITH RECURSIVE OrgChart AS (\n    SELECT EmployeeID, FullName, Role, ManagerID, 1 AS OrgLevel\n    FROM Employees\n    WHERE ManagerID IS NULL\n    UNION ALL\n    SELECT e.EmployeeID, e.FullName, e.Role, e.ManagerID, o.OrgLevel + 1\n    FROM Employees e\n    INNER JOIN OrgChart o ON e.ManagerID = o.EmployeeID\n)\nSELECT EmployeeID, FullName, Role, ManagerID, OrgLevel\nFROM OrgChart\nORDER BY OrgLevel ASC, EmployeeID ASC;",
        "expected": {
          "cols": [
            "EmployeeID",
            "FullName",
            "Role",
            "ManagerID",
            "OrgLevel"
          ],
          "rows": [
            [
              1,
              "Lê Minh Triết",
              "Giám đốc",
              null,
              1
            ],
            [
              2,
              "Nguyễn Tấn Dũng",
              "Quản lý Kho",
              1,
              2
            ],
            [
              3,
              "Trần Thị Mai",
              "Quản lý Bán hàng",
              1,
              2
            ],
            [
              4,
              "Phạm Văn A",
              "Nhân viên Kho",
              2,
              3
            ],
            [
              5,
              "Lý Bạch",
              "Nhân viên Kho",
              2,
              3
            ],
            [
              6,
              "Hoàng Cúc",
              "Nhân viên Bán hàng",
              3,
              3
            ],
            [
              7,
              "Đinh Hợi",
              "Nhân viên Bán hàng",
              3,
              3
            ]
          ]
        }
      },
      {
        "id": "FS-CH05-10",
        "level": "Thực chiến (Phân trang chuẩn OFFSET-FETCH & Tỷ trọng % doanh thu bằng SUM() OVER())",
        "pattern": "ROUND(Price * 100.0 / SUM(Price) OVER (PARTITION BY CategoryID), 2)",
        "title": "Bài 5.10: Tính tỷ trọng % giá trị tồn kho của từng loại trái cây so với tổng giá trị tồn kho của danh mục chứa nó",
        "question": "Với các loại trái cây thuộc danh mục `1` và `2`, hãy tính giá trị tồn kho từng món (`ItemInv = Price * StockQuantity`), tổng giá trị tồn kho của cả danh mục đó (`CatInv = SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID)`), và tỷ trọng phần trăm (`PctOfCat = ROUND((Price * StockQuantity) * 100.0 / SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID), 2)`). Lấy ra `CategoryID`, `FruitID`, `FruitName`, `ItemInv`, `CatInv`, `PctOfCat`. Sắp xếp theo `CategoryID` tăng dần, `PctOfCat` giảm dần.",
        "hint": "Dùng `SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID)` để lấy mẫu số tổng của từng danh mục ngay trên từng dòng mà không làm mất chi tiết dòng.",
        "tsql": "SELECT CategoryID, FruitID, FruitName,\n       (Price * StockQuantity) AS ItemInv,\n       SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID) AS CatInv,\n       ROUND(CAST(Price * StockQuantity AS FLOAT) * 100.0 / SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID), 2) AS PctOfCat\nFROM Fruits\nWHERE CategoryID IN (1, 2)\nORDER BY CategoryID ASC, PctOfCat DESC;",
        "sqlite": "SELECT CategoryID, FruitID, FruitName,\n       (Price * StockQuantity) AS ItemInv,\n       SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID) AS CatInv,\n       ROUND((Price * StockQuantity) * 100.0 / SUM(Price * StockQuantity) OVER (PARTITION BY CategoryID), 2) AS PctOfCat\nFROM Fruits\nWHERE CategoryID IN (1, 2)\nORDER BY CategoryID ASC, PctOfCat DESC;",
        "expected": {
          "cols": [
            "CategoryID",
            "FruitID",
            "FruitName",
            "ItemInv",
            "CatInv",
            "PctOfCat"
          ],
          "rows": [
            [
              1,
              3,
              "Xoài Cát Hòa Lộc",
              16000000,
              39500000,
              40.51
            ],
            [
              1,
              2,
              "Bưởi Da Xanh",
              8400000,
              39500000,
              21.27
            ],
            [
              1,
              4,
              "Măng Cụt Lái Thiêu",
              7600000,
              39500000,
              19.24
            ],
            [
              1,
              1,
              "Sầu Riêng Ri6",
              7500000,
              39500000,
              18.99
            ],
            [
              2,
              6,
              "Táo Envy",
              25000000,
              62050000,
              40.29
            ],
            [
              2,
              7,
              "Cherry Đỏ Thẫm",
              13500000,
              62050000,
              21.76
            ],
            [
              2,
              5,
              "Nho Mẫu Đơn Shine Muscat",
              12750000,
              62050000,
              20.55
            ],
            [
              2,
              8,
              "Kiwi Vàng",
              10800000,
              62050000,
              17.41
            ]
          ]
        }
      }
    ]
  },
  {
    "chapter_id": "ch06",
    "chapter_num": 6,
    "chapter_title": "Chương 6: Thao Tác Dữ Liệu (DML: INSERT, UPDATE, DELETE) & Ràng Buộc (Constraints)",
    "pedagogy_goal": "Rèn phản xạ thêm mới (INSERT), cập nhật (UPDATE) và xóa (DELETE) an toàn có điều kiện WHERE, cập nhật chéo từ bảng khác / CTE, và kiểm chứng kết quả ngay sau thao tác.",
    "exercises": [
      {
        "id": "FS-CH06-01",
        "level": "Cơ bản (Mẫu A1 - INSERT thêm dòng mới & kiểm tra)",
        "pattern": "INSERT INTO Table (Cols...) VALUES (...); SELECT ... FROM Table WHERE ...;",
        "title": "Bài 6.1: Thêm một danh mục trái cây mới vào bảng Categories",
        "question": "Hãy thực hiện lệnh `INSERT` thêm danh mục mới có `CategoryName = 'Trái cây Hữu cơ (Organic)'` và `Description = 'Đạt chuẩn VietGAP & GlobalGAP'` vào bảng `Categories`, sau đó `SELECT CategoryID, CategoryName, Description FROM Categories ORDER BY CategoryID ASC;` để kiểm tra.",
        "hint": "Gồm 2 câu lệnh cách nhau bởi dấu chấm phẩy `;`: Lệnh `INSERT INTO Categories ...` và lệnh `SELECT ...`.",
        "tsql": "INSERT INTO Categories (CategoryName, Description)\nVALUES (N'Trái cây Hữu cơ (Organic)', N'Đạt chuẩn VietGAP & GlobalGAP');\nSELECT CategoryID, CategoryName, Description FROM Categories ORDER BY CategoryID ASC;",
        "sqlite": "INSERT INTO Categories (CategoryName, Description)\nVALUES ('Trái cây Hữu cơ (Organic)', 'Đạt chuẩn VietGAP & GlobalGAP');\nSELECT CategoryID, CategoryName, Description FROM Categories ORDER BY CategoryID ASC;",
        "expected": {
          "cols": [
            "CategoryID",
            "CategoryName",
            "Description"
          ],
          "rows": [
            [
              1,
              "Đặc sản Miền Tây",
              "Trái cây hái tại vườn ĐBSCL"
            ],
            [
              2,
              "Trái cây Nhập khẩu",
              "Táo, Nho, Cherry từ Mỹ, Úc, Nhật"
            ],
            [
              3,
              "Quả mọng (Berries)",
              "Dâu tây, Việt quất, Mâm xôi"
            ],
            [
              4,
              "Trái cây sấy",
              "Đã qua chế biến khô"
            ],
            [
              5,
              "Quả hạch (Nuts)",
              "Mắc ca, Hạnh nhân, Óc chó"
            ],
            [
              6,
              "Trái cây Hữu cơ (Organic)",
              "Đạt chuẩn VietGAP & GlobalGAP"
            ]
          ]
        }
      },
      {
        "id": "FS-CH06-02",
        "level": "Cơ bản (Mẫu A2 - INSERT trên bảng Vouchers)",
        "pattern": "INSERT INTO Table (Cols...) VALUES (...); SELECT ...; (Cùng cơ chế Bài 6.1 nhưng trên Vouchers)",
        "title": "Bài 6.2: Phát hành thêm mã giảm giá mới vào bảng Vouchers",
        "question": "Áp dụng y hệt cơ chế `INSERT` của Bài 6.1 trên bảng `Vouchers`: Thêm mã `'SUMMER30'` với `DiscountAmount = 30000`, `MinOrderValue = 150000`, `UsageLimit = 200`, `UsedCount = 0`, `ExpiryDate = '2026-08-31'`. Sau đó `SELECT VoucherID, VoucherCode, DiscountAmount, MinOrderValue, UsageLimit FROM Vouchers ORDER BY VoucherID ASC;`.",
        "hint": "Điền đúng thứ tự các cột vào câu lệnh `INSERT INTO Vouchers`.",
        "tsql": "INSERT INTO Vouchers (VoucherCode, DiscountAmount, MinOrderValue, UsageLimit, UsedCount, ExpiryDate)\nVALUES ('SUMMER30', 30000, 150000, 200, 0, '2026-08-31');\nSELECT VoucherID, VoucherCode, DiscountAmount, MinOrderValue, UsageLimit FROM Vouchers ORDER BY VoucherID ASC;",
        "sqlite": "INSERT INTO Vouchers (VoucherCode, DiscountAmount, MinOrderValue, UsageLimit, UsedCount, ExpiryDate)\nVALUES ('SUMMER30', 30000, 150000, 200, 0, '2026-08-31');\nSELECT VoucherID, VoucherCode, DiscountAmount, MinOrderValue, UsageLimit FROM Vouchers ORDER BY VoucherID ASC;",
        "expected": {
          "cols": [
            "VoucherID",
            "VoucherCode",
            "DiscountAmount",
            "MinOrderValue",
            "UsageLimit"
          ],
          "rows": [
            [
              1,
              "WELCOME50",
              50000,
              200000,
              1000
            ],
            [
              2,
              "VIP100",
              100000,
              500000,
              100
            ],
            [
              3,
              "HETHAN",
              30000,
              100000,
              500
            ],
            [
              4,
              "SUMMER30",
              30000,
              150000,
              200
            ]
          ]
        }
      },
      {
        "id": "FS-CH06-03",
        "level": "Cơ bản (Mẫu A3 - INSERT trên bảng Customers)",
        "pattern": "INSERT INTO Table (Cols...) VALUES (...); SELECT ...; (Cùng cơ chế Bài 6.1 & 6.2 nhưng trên Customers)",
        "title": "Bài 6.3: Đăng ký thêm khách hàng VIP mới vào bảng Customers",
        "question": "Tiếp tục phản xạ `INSERT` trên bảng `Customers`: Thêm khách hàng `'Quách Tĩnh'`, số điện thoại `'0909999000'`, địa chỉ `'Đảo Đào Hoa'`, phân hạng `'VIP'`, ngày đăng ký `'2024-04-01'`. Sau đó `SELECT CustomerID, FullName, PhoneNumber, CustomerType FROM Customers WHERE CustomerType = 'VIP' ORDER BY CustomerID ASC;`.",
        "hint": "Chú ý cột `PhoneNumber` có ràng buộc `UNIQUE` nên phải nhập đúng số `'0909999000'`.",
        "tsql": "INSERT INTO Customers (FullName, PhoneNumber, Address, CustomerType, RegisterDate)\nVALUES (N'Quách Tĩnh', '0909999000', N'Đảo Đào Hoa', N'VIP', '2024-04-01');\nSELECT CustomerID, FullName, PhoneNumber, CustomerType FROM Customers WHERE CustomerType = N'VIP' ORDER BY CustomerID ASC;",
        "sqlite": "INSERT INTO Customers (FullName, PhoneNumber, Address, CustomerType, RegisterDate)\nVALUES ('Quách Tĩnh', '0909999000', 'Đảo Đào Hoa', 'VIP', '2024-04-01');\nSELECT CustomerID, FullName, PhoneNumber, CustomerType FROM Customers WHERE CustomerType = 'VIP' ORDER BY CustomerID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "PhoneNumber",
            "CustomerType"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              "0901111222",
              "VIP"
            ],
            [
              4,
              "Triệu Mẫn",
              "0904444555",
              "VIP"
            ],
            [
              9,
              "Quách Tĩnh",
              "0909999000",
              "VIP"
            ]
          ]
        }
      },
      {
        "id": "FS-CH06-04",
        "level": "Cơ bản (Mẫu B1 - UPDATE có điều kiện WHERE)",
        "pattern": "UPDATE Table SET Col = NewVal WHERE Condition; SELECT ...;",
        "title": "Bài 6.4: Nhập thêm 50 hộp Mâm Xôi Đen đang hết hàng (UPDATE trên bảng Fruits)",
        "question": "Mặt hàng `'Mâm Xôi Đen'` (`FruitID = 11`) hiện đang có `StockQuantity = 0`. Hãy viết lệnh `UPDATE` cộng thêm `50` hộp vào `StockQuantity` cho `FruitID = 11`, sau đó `SELECT FruitID, FruitName, Price, StockQuantity FROM Fruits WHERE CategoryID = 3 ORDER BY FruitID ASC;`.",
        "hint": "Dùng `UPDATE Fruits SET StockQuantity = StockQuantity + 50 WHERE FruitID = 11;`.",
        "tsql": "UPDATE Fruits\nSET StockQuantity = StockQuantity + 50\nWHERE FruitID = 11;\nSELECT FruitID, FruitName, Price, StockQuantity FROM Fruits WHERE CategoryID = 3 ORDER BY FruitID ASC;",
        "sqlite": "UPDATE Fruits\nSET StockQuantity = StockQuantity + 50\nWHERE FruitID = 11;\nSELECT FruitID, FruitName, Price, StockQuantity FROM Fruits WHERE CategoryID = 3 ORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price",
            "StockQuantity"
          ],
          "rows": [
            [
              9,
              "Dâu Tây Mộc Châu",
              200000,
              45
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              350000,
              20
            ],
            [
              11,
              "Mâm Xôi Đen",
              320000,
              50
            ]
          ]
        }
      },
      {
        "id": "FS-CH06-05",
        "level": "Cơ bản (Mẫu B2 - UPDATE trên bảng Orders)",
        "pattern": "UPDATE Table SET Col = NewVal WHERE Condition; SELECT ...; (Cùng cơ chế Bài 6.4 nhưng trên Orders)",
        "title": "Bài 6.5: Cập nhật trạng thái đơn hàng số 8 sang 'Đã giao' (UPDATE trên bảng Orders)",
        "question": "Áp dụng y hệt phản xạ `UPDATE ... WHERE` của Bài 6.4 trên bảng `Orders`: Đơn hàng `OrderID = 8` đã giao thành công, hãy cập nhật `Status = 'Đã giao'`, sau đó `SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE CustomerID = 1 ORDER BY OrderID ASC;`.",
        "hint": "Luôn kiểm tra kỹ `WHERE OrderID = 8` trước khi chạy `UPDATE`.",
        "tsql": "UPDATE Orders\nSET Status = N'Đã giao'\nWHERE OrderID = 8;\nSELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE CustomerID = 1 ORDER BY OrderID ASC;",
        "sqlite": "UPDATE Orders\nSET Status = 'Đã giao'\nWHERE OrderID = 8;\nSELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE CustomerID = 1 ORDER BY OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "TotalAmount",
            "Status"
          ],
          "rows": [
            [
              1,
              1,
              850000,
              "Đã giao"
            ],
            [
              5,
              1,
              2500000,
              "Đã giao"
            ],
            [
              8,
              1,
              200000,
              "Đã giao"
            ]
          ]
        }
      },
      {
        "id": "FS-CH06-06",
        "level": "Cơ bản (Mẫu B3 - UPDATE trên bảng Customers)",
        "pattern": "UPDATE Table SET Col = NewVal WHERE Condition; SELECT ...; (Cùng cơ chế Bài 6.4 & 6.5 nhưng trên Customers)",
        "title": "Bài 6.6: Nâng hạng VIP cho khách hàng Chu Chỉ Nhược (UPDATE trên bảng Customers)",
        "question": "Tiếp tục phản xạ `UPDATE ... WHERE` trên bảng `Customers`: Nâng hạng `CustomerType = 'VIP'` cho khách hàng có `CustomerID = 5` ('Chu Chỉ Nhược'), sau đó `SELECT CustomerID, FullName, CustomerType FROM Customers WHERE CustomerType = 'VIP' ORDER BY CustomerID ASC;`.",
        "hint": "Dùng `UPDATE Customers SET CustomerType = 'VIP' WHERE CustomerID = 5;`.",
        "tsql": "UPDATE Customers\nSET CustomerType = N'VIP'\nWHERE CustomerID = 5;\nSELECT CustomerID, FullName, CustomerType FROM Customers WHERE CustomerType = N'VIP' ORDER BY CustomerID ASC;",
        "sqlite": "UPDATE Customers\nSET CustomerType = 'VIP'\nWHERE CustomerID = 5;\nSELECT CustomerID, FullName, CustomerType FROM Customers WHERE CustomerType = 'VIP' ORDER BY CustomerID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "CustomerType"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              "VIP"
            ],
            [
              4,
              "Triệu Mẫn",
              "VIP"
            ],
            [
              5,
              "Chu Chỉ Nhược",
              "VIP"
            ]
          ]
        }
      },
      {
        "id": "FS-CH06-07",
        "level": "Trung cấp (DELETE an toàn với NOT EXISTS)",
        "pattern": "DELETE FROM Parent WHERE NOT EXISTS (SELECT 1 FROM Child WHERE ...); SELECT ...;",
        "title": "Bài 6.7: Dọn dẹp các mã Voucher đã hết hạn và chưa từng được gắn vào đơn hàng nào trong bảng Orders",
        "question": "Hãy viết lệnh `DELETE` xóa các mã giảm giá trong bảng `Vouchers` đã hết lượt (`UsedCount = UsageLimit`) VÀ không được tham chiếu bởi bất kỳ đơn hàng nào trong bảng `Orders`. Sau đó `SELECT VoucherID, VoucherCode, DiscountAmount, UsedCount, UsageLimit FROM Vouchers ORDER BY VoucherID ASC;`.",
        "hint": "Dùng `DELETE FROM Vouchers WHERE UsedCount = UsageLimit AND NOT EXISTS (SELECT 1 FROM Orders o WHERE o.VoucherID = Vouchers.VoucherID);`.",
        "tsql": "DELETE FROM Vouchers\nWHERE UsedCount = UsageLimit\n  AND NOT EXISTS (SELECT 1 FROM Orders o WHERE o.VoucherID = Vouchers.VoucherID);\nSELECT VoucherID, VoucherCode, DiscountAmount, UsedCount, UsageLimit FROM Vouchers ORDER BY VoucherID ASC;",
        "sqlite": "DELETE FROM Vouchers\nWHERE UsedCount = UsageLimit\n  AND NOT EXISTS (SELECT 1 FROM Orders o WHERE o.VoucherID = Vouchers.VoucherID);\nSELECT VoucherID, VoucherCode, DiscountAmount, UsedCount, UsageLimit FROM Vouchers ORDER BY VoucherID ASC;",
        "expected": {
          "cols": [
            "VoucherID",
            "VoucherCode",
            "DiscountAmount",
            "UsedCount",
            "UsageLimit"
          ],
          "rows": [
            [
              1,
              "WELCOME50",
              50000,
              250,
              1000
            ],
            [
              2,
              "VIP100",
              100000,
              5,
              100
            ]
          ]
        }
      },
      {
        "id": "FS-CH06-08",
        "level": "Trung cấp (UPDATE dùng Subquery nâng hạng VIP tự động)",
        "pattern": "UPDATE Customers SET CustomerType = 'VIP' WHERE CustomerID IN (SELECT ... GROUP BY ... HAVING ...)",
        "title": "Bài 6.8: Tự động nâng hạng VIP cho mọi khách hàng có tổng giá trị đơn hàng từ 300,000đ trở lên",
        "question": "Viết câu lệnh `UPDATE` bảng `Customers` để đặt `CustomerType = 'VIP'` cho tất cả khách hàng có tổng `SUM(TotalAmount)` trong bảng `Orders` (chỉ tính các đơn `Status = 'Đã giao'`) lớn hơn hoặc bằng `300000`. Sau đó `SELECT CustomerID, FullName, CustomerType FROM Customers ORDER BY CustomerID ASC;`.",
        "hint": "Dùng `WHERE CustomerID IN (SELECT CustomerID FROM Orders WHERE Status = 'Đã giao' GROUP BY CustomerID HAVING SUM(TotalAmount) >= 300000)`.",
        "tsql": "UPDATE Customers\nSET CustomerType = N'VIP'\nWHERE CustomerID IN (\n    SELECT CustomerID\n    FROM Orders\n    WHERE Status = N'Đã giao'\n    GROUP BY CustomerID\n    HAVING SUM(TotalAmount) >= 300000\n);\nSELECT CustomerID, FullName, CustomerType FROM Customers ORDER BY CustomerID ASC;",
        "sqlite": "UPDATE Customers\nSET CustomerType = 'VIP'\nWHERE CustomerID IN (\n    SELECT CustomerID\n    FROM Orders\n    WHERE Status = 'Đã giao'\n    GROUP BY CustomerID\n    HAVING SUM(TotalAmount) >= 300000\n);\nSELECT CustomerID, FullName, CustomerType FROM Customers ORDER BY CustomerID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "CustomerType"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              "VIP"
            ],
            [
              2,
              "Nguyễn Thị Lệ",
              "Standard"
            ],
            [
              3,
              "Trương Vô Kỵ",
              "Standard"
            ],
            [
              4,
              "Triệu Mẫn",
              "VIP"
            ],
            [
              5,
              "Chu Chỉ Nhược",
              "VIP"
            ],
            [
              6,
              "Ân Ly",
              "Standard"
            ],
            [
              7,
              "Tiểu Chiêu",
              "Standard"
            ],
            [
              8,
              "Dương Quá",
              "Standard"
            ]
          ]
        }
      },
      {
        "id": "FS-CH06-09",
        "level": "Nâng cao (Cột tính toán tự động Computed Column SubTotal trong OrderDetails)",
        "pattern": "INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) -> SubTotal tự động tính",
        "title": "Bài 6.9: Kiểm chứng cột tính toán tự động (Computed Column SubTotal) khi thêm mặt hàng vào đơn số 10",
        "question": "Bảng `OrderDetails` có cột `SubTotal` được định nghĩa là Computed Column (`Quantity * UnitPrice`). Hãy `INSERT` thêm một dòng mới vào `OrderDetails` cho `OrderID = 10`, mua `FruitID = 2` (Bưởi Da Xanh), `Quantity = 3`, `UnitPrice = 70000` (không truyền cột `SubTotal`). Sau đó `SELECT OrderDetailID, OrderID, FruitID, Quantity, UnitPrice, SubTotal FROM OrderDetails WHERE OrderID = 10 ORDER BY OrderDetailID ASC;` để xem `SubTotal` tự động tính ra `210000`.",
        "hint": "Chỉ truyền `(OrderID, FruitID, Quantity, UnitPrice)` vào `INSERT INTO OrderDetails`.",
        "tsql": "INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice)\nVALUES (10, 2, 3, 70000);\nSELECT OrderDetailID, OrderID, FruitID, Quantity, UnitPrice, SubTotal\nFROM OrderDetails\nWHERE OrderID = 10\nORDER BY OrderDetailID ASC;",
        "sqlite": "INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice)\nVALUES (10, 2, 3, 70000);\nSELECT OrderDetailID, OrderID, FruitID, Quantity, UnitPrice, SubTotal\nFROM OrderDetails\nWHERE OrderID = 10\nORDER BY OrderDetailID ASC;",
        "expected": {
          "cols": [
            "OrderDetailID",
            "OrderID",
            "FruitID",
            "Quantity",
            "UnitPrice",
            "SubTotal"
          ],
          "rows": [
            [
              13,
              10,
              4,
              1,
              95000,
              95000
            ],
            [
              14,
              10,
              2,
              3,
              70000,
              210000
            ]
          ]
        }
      },
      {
        "id": "FS-CH06-10",
        "level": "Thực chiến (Đồng bộ lại TotalAmount của bảng Orders từ OrderDetails và Vouchers)",
        "pattern": "UPDATE Orders SET TotalAmount = (SELECT SUM(SubTotal)...) - COALESCE((SELECT DiscountAmount...), 0)",
        "title": "Bài 6.10: Đồng bộ lại TotalAmount cho Đơn hàng số 10 sau khi thêm mặt hàng mới",
        "question": "Tiếp nối Bài 6.9: Sau khi thêm 3 quả Bưởi Da Xanh (`210000`) vào `OrderID = 10` (vốn đã có 1 kg Măng Cụt `95000`), hãy thực hiện: (1) `INSERT` dòng Bưởi Da Xanh đó vào `OrderDetails`, (2) `UPDATE` lại cột `TotalAmount` của `OrderID = 10` bằng tổng `SUM(SubTotal)` trong `OrderDetails` của đơn 10, rồi (3) `SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE OrderID = 10;`.",
        "hint": "Dùng `UPDATE Orders SET TotalAmount = (SELECT SUM(SubTotal) FROM OrderDetails WHERE OrderID = 10) WHERE OrderID = 10;`.",
        "tsql": "INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 2, 3, 70000);\nUPDATE Orders\nSET TotalAmount = (SELECT SUM(SubTotal) FROM OrderDetails WHERE OrderID = 10)\nWHERE OrderID = 10;\nSELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE OrderID = 10;",
        "sqlite": "INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 2, 3, 70000);\nUPDATE Orders\nSET TotalAmount = (SELECT SUM(SubTotal) FROM OrderDetails WHERE OrderID = 10)\nWHERE OrderID = 10;\nSELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE OrderID = 10;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "TotalAmount",
            "Status"
          ],
          "rows": [
            [
              10,
              7,
              305000,
              "Chờ xử lý"
            ]
          ]
        }
      }
    ]
  },
  {
    "chapter_id": "ch07",
    "chapter_num": 7,
    "chapter_title": "Chương 7: Thiết Kế CSDL, Mô Hình ER, Quan Hệ 1-N / N-N & Chuẩn Hóa (1NF - BCNF)",
    "pedagogy_goal": "Rèn phản xạ kiểm tra tính toàn vẹn khóa ngoại (Referential Integrity), truy vấn qua bảng trung gian N-N (OrderDetails, Reviews), phát hiện dư thừa dữ liệu và đối chiếu chuẩn hóa ngay trên 9 bảng của FruitStore.",
    "exercises": [
      {
        "id": "FS-CH07-01",
        "level": "Cơ bản (Mẫu A1 - Kiểm tra quan hệ 1-N: Categories -> Fruits)",
        "pattern": "SELECT Parent.*, COUNT(Child.PK) FROM Parent LEFT JOIN Child ... GROUP BY Parent.PK;",
        "title": "Bài 7.1: Kiểm toán quan hệ 1-Nhiều giữa Categories (Bảng Cha) và Fruits (Bảng Con)",
        "question": "Trong mô hình ER của `FruitStore_Ultimate`, 1 `Category` chứa nhiều `Fruits` (1-N). Hãy viết câu truy vấn liệt kê tất cả `CategoryID`, `CategoryName` cùng số lượng dòng con trong bảng `Fruits` (`ChildCount`) và tổng tồn kho (`TotalStock`). Sắp xếp theo `CategoryID` tăng dần.",
        "hint": "Dùng `LEFT JOIN` từ bảng cha `Categories` sang bảng con `Fruits` để đảm bảo không bỏ sót danh mục nào.",
        "tsql": "SELECT c.CategoryID, c.CategoryName,\n       COUNT(f.FruitID) AS ChildCount,\n       COALESCE(SUM(f.StockQuantity), 0) AS TotalStock\nFROM Categories c\nLEFT JOIN Fruits f ON c.CategoryID = f.CategoryID\nGROUP BY c.CategoryID, c.CategoryName\nORDER BY c.CategoryID ASC;",
        "sqlite": "SELECT c.CategoryID, c.CategoryName,\n       COUNT(f.FruitID) AS ChildCount,\n       COALESCE(SUM(f.StockQuantity), 0) AS TotalStock\nFROM Categories c\nLEFT JOIN Fruits f ON c.CategoryID = f.CategoryID\nGROUP BY c.CategoryID, c.CategoryName\nORDER BY c.CategoryID ASC;",
        "expected": {
          "cols": [
            "CategoryID",
            "CategoryName",
            "ChildCount",
            "TotalStock"
          ],
          "rows": [
            [
              1,
              "Đặc sản Miền Tây",
              4,
              450
            ],
            [
              2,
              "Trái cây Nhập khẩu",
              4,
              205
            ],
            [
              3,
              "Quả mọng (Berries)",
              3,
              65
            ],
            [
              4,
              "Trái cây sấy",
              2,
              450
            ],
            [
              5,
              "Quả hạch (Nuts)",
              1,
              90
            ]
          ]
        }
      },
      {
        "id": "FS-CH07-02",
        "level": "Cơ bản (Mẫu A2 - Kiểm tra quan hệ 1-N: Customers -> Orders)",
        "pattern": "SELECT Parent.*, COUNT(Child.PK) FROM Parent LEFT JOIN Child ... GROUP BY Parent.PK; (Cùng cơ chế Bài 7.1 nhưng trên Customers -> Orders)",
        "title": "Bài 7.2: Kiểm toán quan hệ 1-Nhiều giữa Customers (Bảng Cha) và Orders (Bảng Con)",
        "question": "Áp dụng y hệt mẫu kiểm toán 1-N của Bài 7.1 nhưng giữa bảng cha `Customers` và bảng con `Orders`: Lấy ra tất cả `CustomerID`, `FullName`, số đơn hàng đã đặt (`OrderCount = COUNT(o.OrderID)`) và tổng tiền (`TotalSpent = COALESCE(SUM(o.TotalAmount), 0)`). Sắp xếp theo `CustomerID` tăng dần.",
        "hint": "Nhờ dùng `LEFT JOIN` và `COUNT(o.OrderID)`, khách hàng số 8 ('Dương Quá') sẽ hiển thị đúng `OrderCount = 0`.",
        "tsql": "SELECT c.CustomerID, c.FullName,\n       COUNT(o.OrderID) AS OrderCount,\n       COALESCE(SUM(o.TotalAmount), 0) AS TotalSpent\nFROM Customers c\nLEFT JOIN Orders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID, c.FullName\nORDER BY c.CustomerID ASC;",
        "sqlite": "SELECT c.CustomerID, c.FullName,\n       COUNT(o.OrderID) AS OrderCount,\n       COALESCE(SUM(o.TotalAmount), 0) AS TotalSpent\nFROM Customers c\nLEFT JOIN Orders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID, c.FullName\nORDER BY c.CustomerID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "OrderCount",
            "TotalSpent"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              3,
              3550000
            ],
            [
              2,
              "Nguyễn Thị Lệ",
              1,
              180000
            ],
            [
              3,
              "Trương Vô Kỵ",
              1,
              150000
            ],
            [
              4,
              "Triệu Mẫn",
              2,
              1250000
            ],
            [
              5,
              "Chu Chỉ Nhược",
              1,
              300000
            ],
            [
              6,
              "Ân Ly",
              1,
              180000
            ],
            [
              7,
              "Tiểu Chiêu",
              1,
              95000
            ],
            [
              8,
              "Dương Quá",
              0,
              0
            ]
          ]
        }
      },
      {
        "id": "FS-CH07-03",
        "level": "Cơ bản (Mẫu A3 - Kiểm tra quan hệ 1-N: Vouchers -> Orders)",
        "pattern": "SELECT Parent.*, COUNT(Child.PK) FROM Parent LEFT JOIN Child ... GROUP BY Parent.PK; (Cùng cơ chế Bài 7.1 & 7.2 nhưng trên Vouchers -> Orders)",
        "title": "Bài 7.3: Kiểm toán quan hệ 1-Nhiều giữa Vouchers (Bảng Cha) và Orders (Bảng Con)",
        "question": "Tiếp tục phản xạ kiểm toán 1-N giữa bảng cha `Vouchers` và bảng con `Orders`: Lấy ra `VoucherID`, `VoucherCode`, `DiscountAmount` và số đơn hàng thực tế trong bảng `Orders` đã gắn mã đó (`OrdersUsingCount = COUNT(o.OrderID)`). Sắp xếp theo `VoucherID` tăng dần.",
        "hint": "Dùng `Vouchers v LEFT JOIN Orders o ON v.VoucherID = o.VoucherID`.",
        "tsql": "SELECT v.VoucherID, v.VoucherCode, v.DiscountAmount,\n       COUNT(o.OrderID) AS OrdersUsingCount\nFROM Vouchers v\nLEFT JOIN Orders o ON v.VoucherID = o.VoucherID\nGROUP BY v.VoucherID, v.VoucherCode, v.DiscountAmount\nORDER BY v.VoucherID ASC;",
        "sqlite": "SELECT v.VoucherID, v.VoucherCode, v.DiscountAmount,\n       COUNT(o.OrderID) AS OrdersUsingCount\nFROM Vouchers v\nLEFT JOIN Orders o ON v.VoucherID = o.VoucherID\nGROUP BY v.VoucherID, v.VoucherCode, v.DiscountAmount\nORDER BY v.VoucherID ASC;",
        "expected": {
          "cols": [
            "VoucherID",
            "VoucherCode",
            "DiscountAmount",
            "OrdersUsingCount"
          ],
          "rows": [
            [
              1,
              "WELCOME50",
              50000,
              3
            ],
            [
              2,
              "VIP100",
              100000,
              2
            ],
            [
              3,
              "HETHAN",
              30000,
              0
            ]
          ]
        }
      },
      {
        "id": "FS-CH07-04",
        "level": "Cơ bản (Mẫu B1 - Phân rã quan hệ Nhiều-Nhiều qua bảng trung gian OrderDetails)",
        "pattern": "Orders (1) ---> (N) OrderDetails (N) <--- (1) Fruits",
        "title": "Bài 7.4: Thống kê mỗi Đơn hàng chứa bao nhiêu Loại trái cây khác nhau và Tổng số lượng sản phẩm",
        "question": "Bảng `OrderDetails` là bảng trung gian (Junction Table) phân rã quan hệ Nhiều-Nhiều giữa `Orders` và `Fruits`. Hãy gom nhóm theo `OrderID` để tính: số loại trái cây khác nhau trong đơn (`DistinctFruits = COUNT(DISTINCT FruitID)`), tổng số đơn vị hàng (`TotalItems = SUM(Quantity)`), và tổng tiền hàng trước giảm giá (`GrossAmount = SUM(SubTotal)`). Sắp xếp theo `OrderID` tăng dần.",
        "hint": "Truy vấn trên bảng trung gian `OrderDetails` và `GROUP BY OrderID`.",
        "tsql": "SELECT OrderID,\n       COUNT(DISTINCT FruitID) AS DistinctFruits,\n       SUM(Quantity) AS TotalItems,\n       SUM(SubTotal) AS GrossAmount\nFROM OrderDetails\nGROUP BY OrderID\nORDER BY OrderID ASC;",
        "sqlite": "SELECT OrderID,\n       COUNT(DISTINCT FruitID) AS DistinctFruits,\n       SUM(Quantity) AS TotalItems,\n       SUM(SubTotal) AS GrossAmount\nFROM OrderDetails\nGROUP BY OrderID\nORDER BY OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "DistinctFruits",
            "TotalItems",
            "GrossAmount"
          ],
          "rows": [
            [
              1,
              1,
              1,
              850000
            ],
            [
              2,
              2,
              3,
              230000
            ],
            [
              3,
              1,
              1,
              150000
            ],
            [
              4,
              2,
              3,
              950000
            ],
            [
              5,
              2,
              4,
              2600000
            ],
            [
              6,
              1,
              1,
              350000
            ],
            [
              7,
              1,
              1,
              180000
            ],
            [
              8,
              1,
              1,
              200000
            ],
            [
              9,
              1,
              1,
              450000
            ],
            [
              10,
              1,
              1,
              95000
            ]
          ]
        }
      },
      {
        "id": "FS-CH07-05",
        "level": "Cơ bản (Mẫu B2 - Phân rã quan hệ Nhiều-Nhiều chiều ngược lại: Fruits -> Orders)",
        "pattern": "Fruits (1) ---> (N) OrderDetails (N) <--- (1) Orders (Cùng cơ chế Bài 7.4 nhưng gom theo FruitID)",
        "title": "Bài 7.5: Thống kê mỗi Loại trái cây đã xuất hiện trong bao nhiêu Đơn hàng khác nhau",
        "question": "Áp dụng chiều ngược lại của quan hệ N-N qua bảng trung gian `OrderDetails`: Với các loại trái cây đã từng được bán, hãy lấy ra `FruitID`, `FruitName`, số đơn hàng khác nhau có chứa trái cây đó (`OrderCount = COUNT(DISTINCT od.OrderID)`), và tổng số lượng bán (`TotalQty = SUM(od.Quantity)`). Sắp xếp theo `OrderCount` giảm dần, `FruitID` tăng dần.",
        "hint": "Nối `Fruits f INNER JOIN OrderDetails od ON f.FruitID = od.FruitID` và `GROUP BY f.FruitID, f.FruitName`.",
        "tsql": "SELECT f.FruitID, f.FruitName,\n       COUNT(DISTINCT od.OrderID) AS OrderCount,\n       SUM(od.Quantity) AS TotalQty\nFROM Fruits f\nINNER JOIN OrderDetails od ON f.FruitID = od.FruitID\nGROUP BY f.FruitID, f.FruitName\nORDER BY OrderCount DESC, f.FruitID ASC;",
        "sqlite": "SELECT f.FruitID, f.FruitName,\n       COUNT(DISTINCT od.OrderID) AS OrderCount,\n       SUM(od.Quantity) AS TotalQty\nFROM Fruits f\nINNER JOIN OrderDetails od ON f.FruitID = od.FruitID\nGROUP BY f.FruitID, f.FruitName\nORDER BY OrderCount DESC, f.FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "OrderCount",
            "TotalQty"
          ],
          "rows": [
            [
              7,
              "Cherry Đỏ Thẫm",
              3,
              4
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              2,
              3
            ],
            [
              1,
              "Sầu Riêng Ri6",
              1,
              1
            ],
            [
              2,
              "Bưởi Da Xanh",
              1,
              1
            ],
            [
              3,
              "Xoài Cát Hòa Lộc",
              1,
              2
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              1,
              1
            ],
            [
              6,
              "Táo Envy",
              1,
              2
            ],
            [
              8,
              "Kiwi Vàng",
              1,
              1
            ],
            [
              9,
              "Dâu Tây Mộc Châu",
              1,
              1
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              1,
              1
            ]
          ]
        }
      },
      {
        "id": "FS-CH07-06",
        "level": "Cơ bản (Mẫu B3 - Quan hệ Nhiều-Nhiều qua bảng trung gian Reviews)",
        "pattern": "Customers (1) ---> (N) Reviews (N) <--- (1) Fruits (Cùng cơ chế N-N nhưng qua bảng Reviews)",
        "title": "Bài 7.6: Kết nối bảng trung gian Reviews giữa Customers và Fruits",
        "question": "Bảng `Reviews` cũng là một thực thể kết hợp (Associative Entity) nối giữa `Customers` và `Fruits`. Hãy lấy ra `ReviewID`, tên khách hàng (`CustomerName`), tên trái cây (`FruitName`), `Rating` và `Comment`. Sắp xếp theo `ReviewID` tăng dần.",
        "hint": "Nối `Reviews r` với `Customers c` và `Fruits f`.",
        "tsql": "SELECT r.ReviewID,\n       c.FullName AS CustomerName,\n       f.FruitName,\n       r.Rating, r.Comment\nFROM Reviews r\nINNER JOIN Customers c ON r.CustomerID = c.CustomerID\nINNER JOIN Fruits f ON r.FruitID = f.FruitID\nORDER BY r.ReviewID ASC;",
        "sqlite": "SELECT r.ReviewID,\n       c.FullName AS CustomerName,\n       f.FruitName,\n       r.Rating, r.Comment\nFROM Reviews r\nINNER JOIN Customers c ON r.CustomerID = c.CustomerID\nINNER JOIN Fruits f ON r.FruitID = f.FruitID\nORDER BY r.ReviewID ASC;",
        "expected": {
          "cols": [
            "ReviewID",
            "CustomerName",
            "FruitName",
            "Rating",
            "Comment"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              "Nho Mẫu Đơn Shine Muscat",
              5,
              "Nho rất giòn và ngọt, đáng tiền!"
            ],
            [
              2,
              "Nguyễn Thị Lệ",
              "Xoài Cát Hòa Lộc",
              4,
              "Xoài ngọt nhưng da hơi xấu"
            ],
            [
              3,
              "Triệu Mẫn",
              "Táo Envy",
              5,
              "Táo Envy chuẩn Mỹ, rất thơm."
            ],
            [
              4,
              "Chu Chỉ Nhược",
              "Việt Quất (Blueberry)",
              3,
              "Việt quất hơi chua so với mong đợi."
            ]
          ]
        }
      },
      {
        "id": "FS-CH07-07",
        "level": "Trung cấp (Tại sao cần lưu UnitPrice lịch sử trong OrderDetails thay vì lấy thẳng Fruits.Price?)",
        "pattern": "So sánh od.UnitPrice (giá lúc mua) với f.Price (giá danh mục hiện tại)",
        "title": "Bài 7.7: Kiểm tra tính nhất quán giữa Đơn giá lúc mua (OrderDetails.UnitPrice) và Giá niêm yết hiện tại (Fruits.Price)",
        "question": "Trong thiết kế CSDL chuẩn 3NF cho thương mại điện tử, cột `UnitPrice` trong `OrderDetails` KHÔNG phải là dư thừa vi phạm 3NF mà là **giá lịch sử tại thời điểm chốt đơn**. Hãy viết truy vấn đối chiếu `OrderDetailID`, `OrderID`, `FruitName`, `od.UnitPrice` (giá lúc mua), `f.Price` (giá hiện tại) và độ lệch `PriceDiff = od.UnitPrice - f.Price`. Sắp xếp theo `OrderDetailID` tăng dần.",
        "hint": "Lấy `od.UnitPrice - f.Price AS PriceDiff` từ phép nối `OrderDetails` và `Fruits`.",
        "tsql": "SELECT od.OrderDetailID, od.OrderID, f.FruitName,\n       od.UnitPrice, f.Price,\n       (od.UnitPrice - f.Price) AS PriceDiff\nFROM OrderDetails od\nINNER JOIN Fruits f ON od.FruitID = f.FruitID\nORDER BY od.OrderDetailID ASC;",
        "sqlite": "SELECT od.OrderDetailID, od.OrderID, f.FruitName,\n       od.UnitPrice, f.Price,\n       (od.UnitPrice - f.Price) AS PriceDiff\nFROM OrderDetails od\nINNER JOIN Fruits f ON od.FruitID = f.FruitID\nORDER BY od.OrderDetailID ASC;",
        "expected": {
          "cols": [
            "OrderDetailID",
            "OrderID",
            "FruitName",
            "UnitPrice",
            "Price",
            "PriceDiff"
          ],
          "rows": [
            [
              1,
              1,
              "Nho Mẫu Đơn Shine Muscat",
              850000,
              850000,
              0
            ],
            [
              2,
              2,
              "Xoài Cát Hòa Lộc",
              80000,
              80000,
              0
            ],
            [
              3,
              2,
              "Bưởi Da Xanh",
              70000,
              70000,
              0
            ],
            [
              4,
              3,
              "Sầu Riêng Ri6",
              150000,
              150000,
              0
            ],
            [
              5,
              4,
              "Táo Envy",
              250000,
              250000,
              0
            ],
            [
              6,
              4,
              "Cherry Đỏ Thẫm",
              450000,
              450000,
              0
            ],
            [
              7,
              5,
              "Nho Mẫu Đơn Shine Muscat",
              850000,
              850000,
              0
            ],
            [
              8,
              5,
              "Cherry Đỏ Thẫm",
              450000,
              450000,
              0
            ],
            [
              9,
              6,
              "Việt Quất (Blueberry)",
              350000,
              350000,
              0
            ],
            [
              10,
              7,
              "Kiwi Vàng",
              180000,
              180000,
              0
            ],
            [
              11,
              8,
              "Dâu Tây Mộc Châu",
              200000,
              200000,
              0
            ],
            [
              12,
              9,
              "Cherry Đỏ Thẫm",
              450000,
              450000,
              0
            ],
            [
              13,
              10,
              "Măng Cụt Lái Thiêu",
              95000,
              95000,
              0
            ]
          ]
        }
      },
      {
        "id": "FS-CH07-08",
        "level": "Trung cấp (Kiểm toán phụ thuộc hàm & Denormalization có kiểm soát trên cột Orders.TotalAmount)",
        "pattern": "Đối chiếu Orders.TotalAmount với SUM(OrderDetails.SubTotal) - COALESCE(Vouchers.DiscountAmount, 0)",
        "title": "Bài 7.8: Kiểm toán chuẩn hóa: Đối chiếu cột TotalAmount lưu sẵn trong Orders với công thức tính từ OrderDetails và Vouchers",
        "question": "Cột `TotalAmount` trên bảng `Orders` là một cột phi chuẩn hóa có chủ đích (Controlled Denormalization) để tăng tốc độ đọc hóa đơn. Hãy viết truy vấn kiểm toán cho cả 10 đơn hàng: Lấy ra `OrderID`, `TotalAmount` (đang lưu trong `Orders`), `GrossTotal` (`SUM(od.SubTotal)`), `Discount` (`COALESCE(v.DiscountAmount, 0)`), và `CalculatedNet` (`SUM(od.SubTotal) - COALESCE(v.DiscountAmount, 0)`). Sắp xếp theo `OrderID` tăng dần.",
        "hint": "Nối `Orders o` với `OrderDetails od` và `LEFT JOIN Vouchers v`, gom nhóm theo `o.OrderID, o.TotalAmount, v.DiscountAmount`.",
        "tsql": "SELECT o.OrderID, o.TotalAmount,\n       SUM(od.SubTotal) AS GrossTotal,\n       COALESCE(v.DiscountAmount, 0) AS Discount,\n       SUM(od.SubTotal) - COALESCE(v.DiscountAmount, 0) AS CalculatedNet\nFROM Orders o\nINNER JOIN OrderDetails od ON o.OrderID = od.OrderID\nLEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID\nGROUP BY o.OrderID, o.TotalAmount, v.DiscountAmount\nORDER BY o.OrderID ASC;",
        "sqlite": "SELECT o.OrderID, o.TotalAmount,\n       SUM(od.SubTotal) AS GrossTotal,\n       COALESCE(v.DiscountAmount, 0) AS Discount,\n       SUM(od.SubTotal) - COALESCE(v.DiscountAmount, 0) AS CalculatedNet\nFROM Orders o\nINNER JOIN OrderDetails od ON o.OrderID = od.OrderID\nLEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID\nGROUP BY o.OrderID, o.TotalAmount, v.DiscountAmount\nORDER BY o.OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "TotalAmount",
            "GrossTotal",
            "Discount",
            "CalculatedNet"
          ],
          "rows": [
            [
              1,
              850000,
              850000,
              0,
              850000
            ],
            [
              2,
              180000,
              230000,
              50000,
              180000
            ],
            [
              3,
              150000,
              150000,
              0,
              150000
            ],
            [
              4,
              850000,
              950000,
              100000,
              850000
            ],
            [
              5,
              2500000,
              2600000,
              100000,
              2500000
            ],
            [
              6,
              300000,
              350000,
              50000,
              300000
            ],
            [
              7,
              180000,
              180000,
              0,
              180000
            ],
            [
              8,
              200000,
              200000,
              0,
              200000
            ],
            [
              9,
              400000,
              450000,
              50000,
              400000
            ],
            [
              10,
              95000,
              95000,
              0,
              95000
            ]
          ]
        }
      },
      {
        "id": "FS-CH07-09",
        "level": "Nâng cao (Đối chiếu giao dịch thanh toán PaymentTransactions với Orders)",
        "pattern": "Đối chiếu Amount khách trả trong PaymentTransactions với TotalAmount trong Orders để tìm tiền thừa (ChangeAmount)",
        "title": "Bài 7.9: Kiểm toán đối soát thanh toán: Tìm giao dịch khách đưa dư tiền mặt cần thối lại",
        "question": "Kết nối `PaymentTransactions` với `Orders` để lấy ra `TransactionID`, `OrderID`, `PaymentMethod`, số tiền phải trả (`OrderTotal = o.TotalAmount`), số tiền khách thực trả (`PaidAmount = pt.Amount`), và số tiền thừa cần thối lại cho khách (`ChangeDue = pt.Amount - o.TotalAmount`). Sắp xếp theo `TransactionID` tăng dần.",
        "hint": "Quan sát đơn hàng số 2 (`OrderTotal = 180000`, khách đưa `'Tiền mặt'` `200000` -> `ChangeDue = 20000`).",
        "tsql": "SELECT pt.TransactionID, pt.OrderID, pt.PaymentMethod,\n       o.TotalAmount AS OrderTotal,\n       pt.Amount AS PaidAmount,\n       (pt.Amount - o.TotalAmount) AS ChangeDue\nFROM PaymentTransactions pt\nINNER JOIN Orders o ON pt.OrderID = o.OrderID\nORDER BY pt.TransactionID ASC;",
        "sqlite": "SELECT pt.TransactionID, pt.OrderID, pt.PaymentMethod,\n       o.TotalAmount AS OrderTotal,\n       pt.Amount AS PaidAmount,\n       (pt.Amount - o.TotalAmount) AS ChangeDue\nFROM PaymentTransactions pt\nINNER JOIN Orders o ON pt.OrderID = o.OrderID\nORDER BY pt.TransactionID ASC;",
        "expected": {
          "cols": [
            "TransactionID",
            "OrderID",
            "PaymentMethod",
            "OrderTotal",
            "PaidAmount",
            "ChangeDue"
          ],
          "rows": [
            [
              1,
              1,
              "VNPAY",
              850000,
              850000,
              0
            ],
            [
              2,
              2,
              "Tiền mặt",
              180000,
              200000,
              20000
            ],
            [
              3,
              3,
              "Momo",
              150000,
              150000,
              0
            ],
            [
              4,
              4,
              "VNPAY",
              850000,
              850000,
              0
            ],
            [
              5,
              5,
              "VNPAY",
              2500000,
              2500000,
              0
            ],
            [
              6,
              6,
              "Momo",
              300000,
              300000,
              0
            ]
          ]
        }
      },
      {
        "id": "FS-CH07-10",
        "level": "Thực chiến (Kiểm tra vi phạm nghiệp vụ: Khách đánh giá sản phẩm mình chưa từng mua)",
        "pattern": "Reviews r LEFT JOIN (Orders o JOIN OrderDetails od) -> Kiểm tra Verified Purchase",
        "title": "Bài 7.10: Kiểm toán 'Verified Purchase': Kiểm tra xem 4 đánh giá trong bảng Reviews có đúng là của khách đã từng mua loại trái cây đó hay không",
        "question": "Trong thiết kế hệ thống Review chuẩn thương mại điện tử, ta cần gắn nhãn `'Đã mua hàng (Verified)'` nếu khách hàng (`r.CustomerID`) thực sự có ít nhất 1 đơn hàng trong `Orders` + `OrderDetails` chứa đúng `r.FruitID` đó. Hãy lấy ra `ReviewID`, `CustomerID`, `FruitID`, `Rating` và cột `PurchaseStatus` (`'Verified'` nếu tìm thấy trong lịch sử mua, `'Unverified'` nếu không). Sắp xếp theo `ReviewID` tăng dần.",
        "hint": "Dùng `CASE WHEN EXISTS (SELECT 1 FROM Orders o INNER JOIN OrderDetails od ON o.OrderID = od.OrderID WHERE o.CustomerID = r.CustomerID AND od.FruitID = r.FruitID) THEN 'Verified' ELSE 'Unverified' END`.",
        "tsql": "SELECT r.ReviewID, r.CustomerID, r.FruitID, r.Rating,\n       CASE\n           WHEN EXISTS (\n               SELECT 1\n               FROM Orders o\n               INNER JOIN OrderDetails od ON o.OrderID = od.OrderID\n               WHERE o.CustomerID = r.CustomerID AND od.FruitID = r.FruitID\n           ) THEN N'Verified'\n           ELSE N'Unverified'\n       END AS PurchaseStatus\nFROM Reviews r\nORDER BY r.ReviewID ASC;",
        "sqlite": "SELECT r.ReviewID, r.CustomerID, r.FruitID, r.Rating,\n       CASE\n           WHEN EXISTS (\n               SELECT 1\n               FROM Orders o\n               INNER JOIN OrderDetails od ON o.OrderID = od.OrderID\n               WHERE o.CustomerID = r.CustomerID AND od.FruitID = r.FruitID\n           ) THEN 'Verified'\n           ELSE 'Unverified'\n       END AS PurchaseStatus\nFROM Reviews r\nORDER BY r.ReviewID ASC;",
        "expected": {
          "cols": [
            "ReviewID",
            "CustomerID",
            "FruitID",
            "Rating",
            "PurchaseStatus"
          ],
          "rows": [
            [
              1,
              1,
              5,
              5,
              "Verified"
            ],
            [
              2,
              2,
              3,
              4,
              "Verified"
            ],
            [
              3,
              4,
              6,
              5,
              "Verified"
            ],
            [
              4,
              5,
              10,
              3,
              "Verified"
            ]
          ]
        }
      }
    ]
  },
  {
    "chapter_id": "ch08",
    "chapter_num": 8,
    "chapter_title": "Chương 8: Chỉ Mục (Index), Cấu Trúc B-Tree, SARGability & Tối Ưu Hóa Truy Vấn",
    "pedagogy_goal": "Rèn phản xạ viết câu truy vấn SARGable (Search Argument Able) tận dụng triệt để B-Tree Index: không bọc hàm lên cột ở vế trái WHERE, không làm toán trên cột lọc, dùng tiền tố LIKE 'abc%' và tạo Composite Covering Index.",
    "exercises": [
      {
        "id": "FS-CH08-01",
        "level": "Cơ bản (Mẫu A1 - Khử hàm ngày tháng ở WHERE sang lọc khoảng ngày SARGable)",
        "pattern": "Thay YEAR(DateCol) = 2023 bằng DateCol >= '2023-01-01' AND DateCol < '2024-01-01'",
        "title": "Bài 8.1: Tối ưu SARGable cho truy vấn lọc đơn hàng năm 2023 (Bảng Orders)",
        "question": "Viết câu truy vấn lấy `OrderID`, `CustomerID`, `OrderDate`, `TotalAmount` của các đơn hàng trong năm `2023` theo chuẩn **SARGable** (dùng toán tử khoảng `OrderDate >= '2023-01-01' AND OrderDate < '2024-01-01'` thay vì bọc hàm `YEAR(OrderDate) = 2023` làm hỏng Index Seek). Sắp xếp theo `OrderDate` tăng dần.",
        "hint": "Dùng `WHERE OrderDate >= '2023-01-01' AND OrderDate < '2024-01-01'`.",
        "tsql": "SELECT OrderID, CustomerID, OrderDate, TotalAmount\nFROM Orders\nWHERE OrderDate >= '2023-01-01' AND OrderDate < '2024-01-01'\nORDER BY OrderDate ASC;",
        "sqlite": "SELECT OrderID, CustomerID, OrderDate, TotalAmount\nFROM Orders\nWHERE OrderDate >= '2023-01-01' AND OrderDate < '2024-01-01'\nORDER BY OrderDate ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "OrderDate",
            "TotalAmount"
          ],
          "rows": [
            [
              1,
              1,
              "2023-02-14 10:15:00",
              850000
            ],
            [
              2,
              2,
              "2023-04-20 14:30:00",
              180000
            ],
            [
              3,
              3,
              "2023-06-15 09:00:00",
              150000
            ],
            [
              4,
              4,
              "2023-08-08 16:45:00",
              850000
            ],
            [
              5,
              1,
              "2023-12-24 19:00:00",
              2500000
            ]
          ]
        }
      },
      {
        "id": "FS-CH08-02",
        "level": "Cơ bản (Mẫu A2 - Lọc khoảng ngày SARGable trên bảng Employees)",
        "pattern": "Thay YEAR(HireDate) >= 2022 bằng HireDate >= '2022-01-01' (Cùng cơ chế Bài 8.1 nhưng trên Employees)",
        "title": "Bài 8.2: Tối ưu SARGable cho truy vấn tìm nhân viên vào làm từ năm 2022 trở đi (Bảng Employees)",
        "question": "Áp dụng y hệt phản xạ SARGable ngày tháng của Bài 8.1 trên bảng `Employees`: Lấy ra `EmployeeID`, `FullName`, `Role`, `HireDate` của các nhân viên được tuyển dụng từ ngày `'2022-01-01'` trở đi (`HireDate >= '2022-01-01'`). Sắp xếp theo `HireDate` tăng dần.",
        "hint": "Không dùng `YEAR(HireDate) >= 2022`, hãy dùng `WHERE HireDate >= '2022-01-01'`.",
        "tsql": "SELECT EmployeeID, FullName, Role, HireDate\nFROM Employees\nWHERE HireDate >= '2022-01-01'\nORDER BY HireDate ASC;",
        "sqlite": "SELECT EmployeeID, FullName, Role, HireDate\nFROM Employees\nWHERE HireDate >= '2022-01-01'\nORDER BY HireDate ASC;",
        "expected": {
          "cols": [
            "EmployeeID",
            "FullName",
            "Role",
            "HireDate"
          ],
          "rows": [
            [
              4,
              "Phạm Văn A",
              "Nhân viên Kho",
              "2022-01-20"
            ],
            [
              6,
              "Hoàng Cúc",
              "Nhân viên Bán hàng",
              "2022-11-05"
            ],
            [
              5,
              "Lý Bạch",
              "Nhân viên Kho",
              "2023-05-12"
            ],
            [
              7,
              "Đinh Hợi",
              "Nhân viên Bán hàng",
              "2023-08-30"
            ]
          ]
        }
      },
      {
        "id": "FS-CH08-03",
        "level": "Cơ bản (Mẫu A3 - Lọc khoảng ngày SARGable trên bảng Customers)",
        "pattern": "RegisterDate >= '2024-01-01' AND RegisterDate < '2025-01-01' (Cùng cơ chế Bài 8.1 & 8.2 nhưng trên Customers)",
        "title": "Bài 8.3: Tối ưu SARGable cho truy vấn tìm khách hàng đăng ký trong năm 2024 (Bảng Customers)",
        "question": "Tiếp tục phản xạ SARGable ngày tháng trên bảng `Customers`: Lấy ra `CustomerID`, `FullName`, `PhoneNumber`, `RegisterDate` của khách hàng đăng ký trong năm `2024` bằng điều kiện khoảng `RegisterDate >= '2024-01-01' AND RegisterDate < '2025-01-01'`. Sắp xếp theo `CustomerID` tăng dần.",
        "hint": "Dùng `WHERE RegisterDate >= '2024-01-01' AND RegisterDate < '2025-01-01'`.",
        "tsql": "SELECT CustomerID, FullName, PhoneNumber, RegisterDate\nFROM Customers\nWHERE RegisterDate >= '2024-01-01' AND RegisterDate < '2025-01-01'\nORDER BY CustomerID ASC;",
        "sqlite": "SELECT CustomerID, FullName, PhoneNumber, RegisterDate\nFROM Customers\nWHERE RegisterDate >= '2024-01-01' AND RegisterDate < '2025-01-01'\nORDER BY CustomerID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "PhoneNumber",
            "RegisterDate"
          ],
          "rows": [
            [
              6,
              "Ân Ly",
              "0906666777",
              "2024-01-05"
            ],
            [
              7,
              "Tiểu Chiêu",
              "0907777888",
              "2024-02-14"
            ],
            [
              8,
              "Dương Quá",
              "0908888999",
              "2024-03-10"
            ]
          ]
        }
      },
      {
        "id": "FS-CH08-04",
        "level": "Cơ bản (Mẫu B1 - Khử phép toán trên cột ở vế trái WHERE)",
        "pattern": "Thay Price * 2 > 500000 bằng Price > 250000",
        "title": "Bài 8.4: Tối ưu SARGable bằng cách chuyển vế toán học khi lọc giá trái cây (Bảng Fruits)",
        "question": "Một lập trình viên viết `WHERE Price + 50000 >= 300000` khiến SQL Server không thể dùng Index Seek trên cột `Price`. Hãy viết lại câu truy vấn chuẩn SARGable (`WHERE Price >= 250000`) để lấy ra `FruitID`, `FruitName`, `Price` từ bảng `Fruits`, sắp xếp theo `Price` tăng dần.",
        "hint": "Cô lập cột `Price` đứng một mình ở vế trái: `WHERE Price >= 250000`.",
        "tsql": "SELECT FruitID, FruitName, Price\nFROM Fruits\nWHERE Price >= 250000\nORDER BY Price ASC;",
        "sqlite": "SELECT FruitID, FruitName, Price\nFROM Fruits\nWHERE Price >= 250000\nORDER BY Price ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price"
          ],
          "rows": [
            [
              6,
              "Táo Envy",
              250000
            ],
            [
              14,
              "Hạt Mắc Ca",
              280000
            ],
            [
              11,
              "Mâm Xôi Đen",
              320000
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              350000
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              450000
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              850000
            ]
          ]
        }
      },
      {
        "id": "FS-CH08-05",
        "level": "Cơ bản (Mẫu B2 - Khử phép toán trên cột ở bảng OrderDetails)",
        "pattern": "Thay Quantity * 10 >= 20 bằng Quantity >= 2 (Cùng cơ chế Bài 8.4 nhưng trên OrderDetails)",
        "title": "Bài 8.5: Tối ưu SARGable khi lọc số lượng đặt mua trong OrderDetails",
        "question": "Áp dụng y hệt nguyên tắc cô lập cột ở vế trái của Bài 8.4 trên bảng `OrderDetails`: Thay vì viết `WHERE Quantity * 100 >= 200`, hãy viết truy vấn chuẩn SARGable (`WHERE Quantity >= 2`) lấy ra `OrderDetailID`, `OrderID`, `FruitID`, `Quantity`, `UnitPrice`. Sắp xếp theo `OrderDetailID` tăng dần.",
        "hint": "Dùng `WHERE Quantity >= 2`.",
        "tsql": "SELECT OrderDetailID, OrderID, FruitID, Quantity, UnitPrice\nFROM OrderDetails\nWHERE Quantity >= 2\nORDER BY OrderDetailID ASC;",
        "sqlite": "SELECT OrderDetailID, OrderID, FruitID, Quantity, UnitPrice\nFROM OrderDetails\nWHERE Quantity >= 2\nORDER BY OrderDetailID ASC;",
        "expected": {
          "cols": [
            "OrderDetailID",
            "OrderID",
            "FruitID",
            "Quantity",
            "UnitPrice"
          ],
          "rows": [
            [
              2,
              2,
              3,
              2,
              80000
            ],
            [
              5,
              4,
              6,
              2,
              250000
            ],
            [
              7,
              5,
              5,
              2,
              850000
            ],
            [
              8,
              5,
              7,
              2,
              450000
            ]
          ]
        }
      },
      {
        "id": "FS-CH08-06",
        "level": "Cơ bản (Mẫu B3 - Tìm kiếm tiền tố Prefix Search SARGable với LIKE 'abc%')",
        "pattern": "WHERE Col LIKE 'Prefix%' (Tận dụng thứ tự từ điển của B-Tree Index)",
        "title": "Bài 8.6: Tìm kiếm tiền tố (Prefix Search) tên trái cây bắt đầu bằng chữ 'Nho' (Bảng Fruits)",
        "question": "Khi đánh Index trên `FruitName`, điều kiện `LIKE 'Nho%'` (không có `%` ở đầu) vẫn thực hiện được **Index Seek** vì B-Tree sắp xếp theo thứ tự từ điển từ trái sang phải. Hãy lấy ra `FruitID`, `FruitName`, `Price`, `Origin` của các loại trái cây bắt đầu bằng `'Nho'`, sắp xếp theo `FruitID` tăng dần.",
        "hint": "Dùng `WHERE FruitName LIKE 'Nho%'`.",
        "tsql": "SELECT FruitID, FruitName, Price, Origin\nFROM Fruits\nWHERE FruitName LIKE N'Nho%'\nORDER BY FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName, Price, Origin\nFROM Fruits\nWHERE FruitName LIKE 'Nho%'\nORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price",
            "Origin"
          ],
          "rows": [
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              850000,
              "Hàn Quốc"
            ],
            [
              12,
              "Nho khô Ninh Thuận",
              120000,
              "Ninh Thuận"
            ]
          ]
        }
      },
      {
        "id": "FS-CH08-07",
        "level": "Trung cấp (Tạo Non-Clustered Index trên Foreign Key & Kiểm chứng truy vấn)",
        "pattern": "CREATE INDEX IX_Fruits_CategoryID_Price ON Fruits(CategoryID, Price); SELECT ...;",
        "title": "Bài 8.7: Tạo Composite Index trên bảng Fruits và chạy truy vấn tuân thủ Leftmost Prefix",
        "question": "Hãy thực hiện lệnh `CREATE INDEX IX_Fruits_Cat_Price ON Fruits(CategoryID, Price);` để tối ưu cho các truy vấn lọc theo `CategoryID` và sắp xếp theo `Price`. Ngay sau đó, viết câu lệnh `SELECT FruitID, FruitName, CategoryID, Price FROM Fruits WHERE CategoryID = 2 ORDER BY Price DESC;`.",
        "hint": "Gồm 2 câu lệnh: `CREATE INDEX ...;` và `SELECT ... WHERE CategoryID = 2 ORDER BY Price DESC;`.",
        "tsql": "CREATE INDEX IX_Fruits_Cat_Price ON Fruits(CategoryID, Price);\nSELECT FruitID, FruitName, CategoryID, Price\nFROM Fruits\nWHERE CategoryID = 2\nORDER BY Price DESC;",
        "sqlite": "CREATE INDEX IX_Fruits_Cat_Price ON Fruits(CategoryID, Price);\nSELECT FruitID, FruitName, CategoryID, Price\nFROM Fruits\nWHERE CategoryID = 2\nORDER BY Price DESC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "CategoryID",
            "Price"
          ],
          "rows": [
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              2,
              850000
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              2,
              450000
            ],
            [
              6,
              "Táo Envy",
              2,
              250000
            ],
            [
              8,
              "Kiwi Vàng",
              2,
              180000
            ]
          ]
        }
      },
      {
        "id": "FS-CH08-08",
        "level": "Trung cấp (Tạo Index tối ưu cho bảng Orders theo CustomerID và Status)",
        "pattern": "CREATE INDEX IX_Orders_Cust_Status ON Orders(CustomerID, Status); SELECT ...;",
        "title": "Bài 8.8: Tạo Composite Index trên bảng Orders và truy vấn lịch sử đơn hàng của khách VIP số 1",
        "question": "Tương tự Bài 8.7, hãy tạo chỉ mục `CREATE INDEX IX_Orders_Cust_Status ON Orders(CustomerID, Status, TotalAmount);` trên bảng `Orders`, sau đó chạy câu lệnh `SELECT OrderID, CustomerID, Status, TotalAmount FROM Orders WHERE CustomerID = 1 AND Status = 'Đã giao' ORDER BY OrderID ASC;`.",
        "hint": "Việc đưa cả `CustomerID`, `Status` và `TotalAmount` vào Index giúp câu truy vấn đạt trạng thái **Covering Index** (không cần Key Lookup)!",
        "tsql": "CREATE INDEX IX_Orders_Cust_Status ON Orders(CustomerID, Status) INCLUDE (TotalAmount);\nSELECT OrderID, CustomerID, Status, TotalAmount\nFROM Orders\nWHERE CustomerID = 1 AND Status = N'Đã giao'\nORDER BY OrderID ASC;",
        "sqlite": "CREATE INDEX IX_Orders_Cust_Status ON Orders(CustomerID, Status, TotalAmount);\nSELECT OrderID, CustomerID, Status, TotalAmount\nFROM Orders\nWHERE CustomerID = 1 AND Status = 'Đã giao'\nORDER BY OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "Status",
            "TotalAmount"
          ],
          "rows": [
            [
              1,
              1,
              "Đã giao",
              850000
            ],
            [
              5,
              1,
              "Đã giao",
              2500000
            ]
          ]
        }
      },
      {
        "id": "FS-CH08-09",
        "level": "Nâng cao (Thay thế OR gây Table Scan bằng UNION ALL tận dụng 2 Index riêng biệt)",
        "pattern": "SELECT ... WHERE ColA = x UNION SELECT ... WHERE ColB = y",
        "title": "Bài 8.9: Tối ưu điều kiện OR trên 2 cột khác nhau bằng UNION",
        "question": "Khi lọc `WHERE CustomerID = 1 OR EmployeeID = 7` trên bảng `Orders`, bộ tối ưu hóa thường phải quét diện rộng. Hãy viết lại bằng toán tử `UNION` (tự động khử trùng các đơn vừa của `CustomerID = 1` vừa do `EmployeeID = 7` phụ trách nếu có) để lấy ra `OrderID`, `CustomerID`, `EmployeeID`, `TotalAmount`. Sắp xếp theo `OrderID` tăng dần.",
        "hint": "Viết `SELECT OrderID, CustomerID, EmployeeID, TotalAmount FROM Orders WHERE CustomerID = 1 UNION SELECT OrderID, CustomerID, EmployeeID, TotalAmount FROM Orders WHERE EmployeeID = 7 ORDER BY OrderID ASC;`.",
        "tsql": "SELECT OrderID, CustomerID, EmployeeID, TotalAmount\nFROM Orders\nWHERE CustomerID = 1\nUNION\nSELECT OrderID, CustomerID, EmployeeID, TotalAmount\nFROM Orders\nWHERE EmployeeID = 7\nORDER BY OrderID ASC;",
        "sqlite": "SELECT OrderID, CustomerID, EmployeeID, TotalAmount\nFROM Orders\nWHERE CustomerID = 1\nUNION\nSELECT OrderID, CustomerID, EmployeeID, TotalAmount\nFROM Orders\nWHERE EmployeeID = 7\nORDER BY OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "EmployeeID",
            "TotalAmount"
          ],
          "rows": [
            [
              1,
              1,
              6,
              850000
            ],
            [
              3,
              3,
              7,
              150000
            ],
            [
              4,
              4,
              7,
              850000
            ],
            [
              5,
              1,
              6,
              2500000
            ],
            [
              6,
              5,
              7,
              300000
            ],
            [
              8,
              1,
              6,
              200000
            ],
            [
              9,
              4,
              7,
              400000
            ]
          ]
        }
      },
      {
        "id": "FS-CH08-10",
        "level": "Thực chiến (Kiểm tra danh sách Index trong Metadata hệ thống hoặc Covering Query)",
        "pattern": "Truy vấn chỉ lấy đúng các cột nằm trong Covering Index để đạt Index-Only Scan",
        "title": "Bài 8.10: Thiết kế Covering Index cho báo cáo doanh thu theo Phương thức thanh toán",
        "question": "Hãy tạo chỉ mục bao phủ `CREATE INDEX IX_Payment_Covering ON PaymentTransactions(PaymentMethod, Amount);` rồi thực thi truy vấn thống kê `SELECT PaymentMethod, COUNT(*) AS TxCount, SUM(Amount) AS TotalAmount FROM PaymentTransactions WHERE PaymentMethod IN ('VNPAY', 'Momo') GROUP BY PaymentMethod ORDER BY TotalAmount DESC;`.",
        "hint": "Khi mọi cột trong `SELECT`, `WHERE`, `GROUP BY` đều nằm trong `IX_Payment_Covering`, Engine chỉ cần đọc lá của Index mà không cần chạm vào bảng gốc!",
        "tsql": "CREATE INDEX IX_Payment_Covering ON PaymentTransactions(PaymentMethod) INCLUDE (Amount);\nSELECT PaymentMethod, COUNT(*) AS TxCount, SUM(Amount) AS TotalAmount\nFROM PaymentTransactions\nWHERE PaymentMethod IN (N'VNPAY', N'Momo')\nGROUP BY PaymentMethod\nORDER BY TotalAmount DESC;",
        "sqlite": "CREATE INDEX IX_Payment_Covering ON PaymentTransactions(PaymentMethod, Amount);\nSELECT PaymentMethod, COUNT(*) AS TxCount, SUM(Amount) AS TotalAmount\nFROM PaymentTransactions\nWHERE PaymentMethod IN ('VNPAY', 'Momo')\nGROUP BY PaymentMethod\nORDER BY TotalAmount DESC;",
        "expected": {
          "cols": [
            "PaymentMethod",
            "TxCount",
            "TotalAmount"
          ],
          "rows": [
            [
              "VNPAY",
              3,
              4200000
            ],
            [
              "Momo",
              2,
              450000
            ]
          ]
        }
      }
    ]
  },
  {
    "chapter_id": "ch09",
    "chapter_num": 9,
    "chapter_title": "Chương 9: Giao Dịch (Transactions), ACID, Isolation Levels & Phòng Chống Deadlock",
    "pedagogy_goal": "Rèn phản xạ đóng gói chuỗi thao tác nghiệp vụ (trừ kho, tăng lượt dùng voucher, ghi nhận thanh toán, hủy đơn hoàn kho) vào trong một Transaction nguyên tử (Atomicity) đảm bảo tính nhất quán (Consistency).",
    "exercises": [
      {
        "id": "FS-CH09-01",
        "level": "Cơ bản (Mẫu A1 - Giao dịch nguyên tử cập nhật 2 bảng liên quan)",
        "pattern": "BEGIN TRANSACTION; UPDATE TableA ...; INSERT INTO TableB ...; COMMIT; SELECT ...;",
        "title": "Bài 9.1: Giao dịch xác nhận thanh toán cho Đơn hàng số 9 (Orders + PaymentTransactions)",
        "question": "Đơn hàng `OrderID = 9` (`TotalAmount = 400000`, đang `'Chờ xử lý'`) vừa được khách thanh toán qua `'VNPAY'`. Trong một giao dịch: (1) Cập nhật `Status = 'Đã giao'` cho `OrderID = 9` trong bảng `Orders`, (2) Thêm bản ghi thanh toán vào `PaymentTransactions` (`OrderID = 9`, `PaymentMethod = 'VNPAY'`, `Amount = 400000`, `PaymentDate = '2024-03-05 10:05:00'`), sau đó `SELECT o.OrderID, o.Status, pt.PaymentMethod, pt.Amount FROM Orders o INNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID WHERE o.OrderID = 9;`.",
        "hint": "Thực hiện tuần tự `UPDATE Orders ...; INSERT INTO PaymentTransactions ...; SELECT ...;`.",
        "tsql": "BEGIN TRANSACTION;\nUPDATE Orders SET Status = N'Đã giao' WHERE OrderID = 9;\nINSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate)\nVALUES (9, N'VNPAY', 400000, '2024-03-05 10:05:00');\nCOMMIT TRANSACTION;\nSELECT o.OrderID, o.Status, pt.PaymentMethod, pt.Amount\nFROM Orders o\nINNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID\nWHERE o.OrderID = 9;",
        "sqlite": "BEGIN TRANSACTION;\nUPDATE Orders SET Status = 'Đã giao' WHERE OrderID = 9;\nINSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate)\nVALUES (9, 'VNPAY', 400000, '2024-03-05 10:05:00');\nCOMMIT;\nSELECT o.OrderID, o.Status, pt.PaymentMethod, pt.Amount\nFROM Orders o\nINNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID\nWHERE o.OrderID = 9;",
        "expected": {
          "cols": [
            "OrderID",
            "Status",
            "PaymentMethod",
            "Amount"
          ],
          "rows": [
            [
              9,
              "Đã giao",
              "VNPAY",
              400000
            ]
          ]
        }
      },
      {
        "id": "FS-CH09-02",
        "level": "Cơ bản (Mẫu A2 - Giao dịch thanh toán cho Đơn hàng số 10)",
        "pattern": "BEGIN TRANSACTION; UPDATE Orders ...; INSERT INTO PaymentTransactions ...; COMMIT; (Cùng cơ chế Bài 9.1 nhưng cho Đơn số 10)",
        "title": "Bài 9.2: Giao dịch xác nhận thanh toán Tiền mặt cho Đơn hàng số 10",
        "question": "Áp dụng y hệt quy trình Transaction của Bài 9.1 cho `OrderID = 10` (`TotalAmount = 95000`): (1) Cập nhật `Status = 'Đã giao'` cho `OrderID = 10`, (2) Thêm giao dịch vào `PaymentTransactions` với `OrderID = 10`, `PaymentMethod = 'Tiền mặt'`, `Amount = 95000`, `PaymentDate = '2024-03-10 14:05:00'`, (3) `COMMIT` và truy vấn `SELECT o.OrderID, o.Status, pt.PaymentMethod, pt.Amount FROM Orders o INNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID WHERE o.OrderID = 10;`.",
        "hint": "Thay `OrderID = 10`, `PaymentMethod = 'Tiền mặt'`, `Amount = 95000`.",
        "tsql": "BEGIN TRANSACTION;\nUPDATE Orders SET Status = N'Đã giao' WHERE OrderID = 10;\nINSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate)\nVALUES (10, N'Tiền mặt', 95000, '2024-03-10 14:05:00');\nCOMMIT TRANSACTION;\nSELECT o.OrderID, o.Status, pt.PaymentMethod, pt.Amount\nFROM Orders o\nINNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID\nWHERE o.OrderID = 10;",
        "sqlite": "BEGIN TRANSACTION;\nUPDATE Orders SET Status = 'Đã giao' WHERE OrderID = 10;\nINSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate)\nVALUES (10, 'Tiền mặt', 95000, '2024-03-10 14:05:00');\nCOMMIT;\nSELECT o.OrderID, o.Status, pt.PaymentMethod, pt.Amount\nFROM Orders o\nINNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID\nWHERE o.OrderID = 10;",
        "expected": {
          "cols": [
            "OrderID",
            "Status",
            "PaymentMethod",
            "Amount"
          ],
          "rows": [
            [
              10,
              "Đã giao",
              "Tiền mặt",
              95000
            ]
          ]
        }
      },
      {
        "id": "FS-CH09-03",
        "level": "Cơ bản (Mẫu A3 - Giao dịch áp dụng Voucher vào Đơn hàng số 8)",
        "pattern": "BEGIN TRANSACTION; UPDATE Vouchers ...; UPDATE Orders ...; COMMIT; (Cùng cơ chế Transaction 2 bảng trên Vouchers & Orders)",
        "title": "Bài 9.3: Giao dịch áp mã giảm giá WELCOME50 cho Đơn hàng số 8",
        "question": "Đơn hàng `OrderID = 8` (`TotalAmount = 200000`, `VoucherID IS NULL`) đủ điều kiện áp mã `'WELCOME50'` (`VoucherID = 1`, giảm `50000`). Trong 1 Transaction: (1) Tăng `UsedCount = UsedCount + 1` cho `VoucherID = 1` trong bảng `Vouchers`, (2) Cập nhật `VoucherID = 1` và `TotalAmount = TotalAmount - 50000` cho `OrderID = 8` trong bảng `Orders`, (3) `COMMIT` và `SELECT o.OrderID, o.VoucherID, o.TotalAmount, v.UsedCount FROM Orders o INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID WHERE o.OrderID = 8;`.",
        "hint": "Cả 2 bước tăng `UsedCount` và giảm `TotalAmount` phải nằm trong cùng một Transaction để đảm bảo tính Nhất quán (Consistency).",
        "tsql": "BEGIN TRANSACTION;\nUPDATE Vouchers SET UsedCount = UsedCount + 1 WHERE VoucherID = 1 AND UsedCount < UsageLimit;\nUPDATE Orders SET VoucherID = 1, TotalAmount = TotalAmount - 50000 WHERE OrderID = 8;\nCOMMIT TRANSACTION;\nSELECT o.OrderID, o.VoucherID, o.TotalAmount, v.UsedCount\nFROM Orders o\nINNER JOIN Vouchers v ON o.VoucherID = v.VoucherID\nWHERE o.OrderID = 8;",
        "sqlite": "BEGIN TRANSACTION;\nUPDATE Vouchers SET UsedCount = UsedCount + 1 WHERE VoucherID = 1 AND UsedCount < UsageLimit;\nUPDATE Orders SET VoucherID = 1, TotalAmount = TotalAmount - 50000 WHERE OrderID = 8;\nCOMMIT;\nSELECT o.OrderID, o.VoucherID, o.TotalAmount, v.UsedCount\nFROM Orders o\nINNER JOIN Vouchers v ON o.VoucherID = v.VoucherID\nWHERE o.OrderID = 8;",
        "expected": {
          "cols": [
            "OrderID",
            "VoucherID",
            "TotalAmount",
            "UsedCount"
          ],
          "rows": [
            [
              8,
              1,
              150000,
              251
            ]
          ]
        }
      },
      {
        "id": "FS-CH09-04",
        "level": "Cơ bản (Mẫu B1 - Kiểm chứng ROLLBACK khôi phục trạng thái ban đầu)",
        "pattern": "BEGIN TRANSACTION; UPDATE/DELETE ...; ROLLBACK; SELECT ...;",
        "title": "Bài 9.4: Kiểm chứng tính Nguyên tử (Atomicity): Thử cập nhật nhầm giá toàn bộ bảng Fruits rồi ROLLBACK",
        "question": "Hãy mở `BEGIN TRANSACTION;`, thực hiện lệnh cập nhật nhầm `UPDATE Fruits SET Price = 0;` (quên `WHERE`), sau đó gọi ngay `ROLLBACK;` để hủy bỏ giao dịch. Cuối cùng `SELECT FruitID, FruitName, Price FROM Fruits WHERE CategoryID = 1 ORDER BY FruitID ASC;` để chứng minh dữ liệu vẫn nguyên vẹn 100%.",
        "hint": "Sau lệnh `ROLLBACK;`, mọi thay đổi bên trong `BEGIN TRANSACTION` đều được hoàn tác sạch sẽ.",
        "tsql": "BEGIN TRANSACTION;\nUPDATE Fruits SET Price = 0;\nROLLBACK TRANSACTION;\nSELECT FruitID, FruitName, Price FROM Fruits WHERE CategoryID = 1 ORDER BY FruitID ASC;",
        "sqlite": "BEGIN TRANSACTION;\nUPDATE Fruits SET Price = 0;\nROLLBACK;\nSELECT FruitID, FruitName, Price FROM Fruits WHERE CategoryID = 1 ORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              150000
            ],
            [
              2,
              "Bưởi Da Xanh",
              70000
            ],
            [
              3,
              "Xoài Cát Hòa Lộc",
              80000
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              95000
            ]
          ]
        }
      },
      {
        "id": "FS-CH09-05",
        "level": "Cơ bản (Mẫu B2 - Kiểm chứng ROLLBACK khi xóa nhầm trên bảng Orders)",
        "pattern": "BEGIN TRANSACTION; DELETE ...; ROLLBACK; SELECT ...; (Cùng cơ chế Bài 9.4 nhưng trên Orders)",
        "title": "Bài 9.5: Kiểm chứng ROLLBACK khi lỡ tay xóa các đơn hàng Chờ xử lý",
        "question": "Áp dụng y hệt phản xạ `BEGIN TRANSACTION ... ROLLBACK` của Bài 9.4 trên bảng `Orders`: Bắt đầu giao dịch, chạy lệnh `DELETE FROM Orders WHERE Status = 'Chờ xử lý';`, sau đó gọi `ROLLBACK;` và truy vấn `SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE Status = 'Chờ xử lý' ORDER BY OrderID ASC;`.",
        "hint": "Nhờ `ROLLBACK;`, hai đơn hàng số 9 và số 10 vẫn còn nguyên vẹn.",
        "tsql": "BEGIN TRANSACTION;\nDELETE FROM Orders WHERE Status = N'Chờ xử lý';\nROLLBACK TRANSACTION;\nSELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE Status = N'Chờ xử lý' ORDER BY OrderID ASC;",
        "sqlite": "BEGIN TRANSACTION;\nDELETE FROM Orders WHERE Status = 'Chờ xử lý';\nROLLBACK;\nSELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE Status = 'Chờ xử lý' ORDER BY OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "TotalAmount",
            "Status"
          ],
          "rows": [
            [
              9,
              4,
              400000,
              "Chờ xử lý"
            ],
            [
              10,
              7,
              95000,
              "Chờ xử lý"
            ]
          ]
        }
      },
      {
        "id": "FS-CH09-06",
        "level": "Cơ bản (Mẫu B3 - Sử dụng SAVEPOINT để Rollback một phần giao dịch)",
        "pattern": "BEGIN; UPDATE 1; SAVEPOINT sp1; UPDATE 2 (sai); ROLLBACK TO sp1; COMMIT;",
        "title": "Bài 9.6: Sử dụng SAVEPOINT để giữ lại thao tác đúng và chỉ Rollback thao tác sai",
        "question": "Trong một Transaction: (1) Nhập thêm `20` quả cho `FruitID = 1` (`StockQuantity = StockQuantity + 20`), (2) Đặt điểm lưu `SAVEPOINT sp_after_durian;`, (3) Trừ nhầm tồn kho của `FruitID = 2` đi `100` quả (`StockQuantity = StockQuantity - 100`), (4) Quay lui về điểm lưu `ROLLBACK TO sp_after_durian;`, (5) `COMMIT;` và `SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID IN (1, 2) ORDER BY FruitID ASC;`.",
        "hint": "Kết quả sau `COMMIT`: `FruitID = 1` tăng từ 50 lên `70`, còn `FruitID = 2` vẫn giữ nguyên `120`!",
        "tsql": "BEGIN TRANSACTION;\nUPDATE Fruits SET StockQuantity = StockQuantity + 20 WHERE FruitID = 1;\nSAVE TRANSACTION sp_after_durian;\nUPDATE Fruits SET StockQuantity = StockQuantity - 100 WHERE FruitID = 2;\nROLLBACK TRANSACTION sp_after_durian;\nCOMMIT TRANSACTION;\nSELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID IN (1, 2) ORDER BY FruitID ASC;",
        "sqlite": "BEGIN TRANSACTION;\nUPDATE Fruits SET StockQuantity = StockQuantity + 20 WHERE FruitID = 1;\nSAVEPOINT sp_after_durian;\nUPDATE Fruits SET StockQuantity = StockQuantity - 100 WHERE FruitID = 2;\nROLLBACK TO sp_after_durian;\nCOMMIT;\nSELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID IN (1, 2) ORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "StockQuantity"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              70
            ],
            [
              2,
              "Bưởi Da Xanh",
              120
            ]
          ]
        }
      },
      {
        "id": "FS-CH09-07",
        "level": "Trung cấp (Giao dịch Hủy đơn hàng: Hoàn trả tồn kho & Hoàn trả lượt Voucher)",
        "pattern": "Hủy OrderID = 9 -> Cộng lại StockQuantity cho FruitID = 7 -> Giảm UsedCount của VoucherID = 1",
        "title": "Bài 9.7: Giao dịch Hủy đơn hàng số 9: Cập nhật trạng thái, hoàn tồn kho và hoàn lượt Voucher",
        "question": "Khách hàng yêu cầu hủy đơn `OrderID = 9` (đang `'Chờ xử lý'`, có dùng `VoucherID = 1`, đặt mua `1` kg `FruitID = 7` Cherry Đỏ Thẫm). Hãy viết Transaction thực hiện: (1) Đổi `Status = 'Đã hủy'` cho `OrderID = 9`, (2) Hoàn trả `+1` vào `StockQuantity` cho `FruitID = 7`, (3) Giảm `UsedCount = UsedCount - 1` cho `VoucherID = 1`, (4) `COMMIT` và `SELECT o.OrderID, o.Status, f.StockQuantity AS CherryStock, v.UsedCount AS VoucherUsed FROM Orders o INNER JOIN OrderDetails od ON o.OrderID = od.OrderID INNER JOIN Fruits f ON od.FruitID = f.FruitID INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID WHERE o.OrderID = 9;`.",
        "hint": "Thực hiện đủ 3 lệnh `UPDATE` trên `Orders`, `Fruits`, `Vouchers` trước khi `COMMIT`.",
        "tsql": "BEGIN TRANSACTION;\nUPDATE Orders SET Status = N'Đã hủy' WHERE OrderID = 9;\nUPDATE Fruits SET StockQuantity = StockQuantity + 1 WHERE FruitID = 7;\nUPDATE Vouchers SET UsedCount = UsedCount - 1 WHERE VoucherID = 1;\nCOMMIT TRANSACTION;\nSELECT o.OrderID, o.Status, f.StockQuantity AS CherryStock, v.UsedCount AS VoucherUsed\nFROM Orders o\nINNER JOIN OrderDetails od ON o.OrderID = od.OrderID\nINNER JOIN Fruits f ON od.FruitID = f.FruitID\nINNER JOIN Vouchers v ON o.VoucherID = v.VoucherID\nWHERE o.OrderID = 9;",
        "sqlite": "BEGIN TRANSACTION;\nUPDATE Orders SET Status = 'Đã hủy' WHERE OrderID = 9;\nUPDATE Fruits SET StockQuantity = StockQuantity + 1 WHERE FruitID = 7;\nUPDATE Vouchers SET UsedCount = UsedCount - 1 WHERE VoucherID = 1;\nCOMMIT;\nSELECT o.OrderID, o.Status, f.StockQuantity AS CherryStock, v.UsedCount AS VoucherUsed\nFROM Orders o\nINNER JOIN OrderDetails od ON o.OrderID = od.OrderID\nINNER JOIN Fruits f ON od.FruitID = f.FruitID\nINNER JOIN Vouchers v ON o.VoucherID = v.VoucherID\nWHERE o.OrderID = 9;",
        "expected": {
          "cols": [
            "OrderID",
            "Status",
            "CherryStock",
            "VoucherUsed"
          ],
          "rows": [
            [
              9,
              "Đã hủy",
              31,
              249
            ]
          ]
        }
      },
      {
        "id": "FS-CH09-08",
        "level": "Trung cấp (Phòng chống Lost Update / Overselling bằng điều kiện gác cổng nguyên tử)",
        "pattern": "UPDATE Fruits SET StockQuantity = StockQuantity - @Qty WHERE FruitID = @ID AND StockQuantity >= @Qty",
        "title": "Bài 9.8: Chống bán âm kho (Anti-Overselling) bằng Atomic Guard Condition trong UPDATE",
        "question": "Để chống lỗi 2 giao dịch cùng đọc `StockQuantity = 15` của Nho Mẫu Đơn (`FruitID = 5`) rồi cùng trừ kho gây âm kho, ta đặt điều kiện gác cổng ngay trong `UPDATE`: Hãy thử trừ `20` chùm cho `FruitID = 5` với điều kiện `AND StockQuantity >= 20` (sẽ không trừ vì tồn kho chỉ có 15), và trừ `5` chùm cho `FruitID = 5` với điều kiện `AND StockQuantity >= 5` (thành công, còn 10). Cuối cùng `SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID = 5;`.",
        "hint": "Câu lệnh `UPDATE` thứ nhất có `WHERE FruitID = 5 AND StockQuantity >= 20` sẽ tác động 0 dòng một cách an toàn mà không làm hỏng dữ liệu!",
        "tsql": "BEGIN TRANSACTION;\nUPDATE Fruits SET StockQuantity = StockQuantity - 20 WHERE FruitID = 5 AND StockQuantity >= 20;\nUPDATE Fruits SET StockQuantity = StockQuantity - 5 WHERE FruitID = 5 AND StockQuantity >= 5;\nCOMMIT TRANSACTION;\nSELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID = 5;",
        "sqlite": "BEGIN TRANSACTION;\nUPDATE Fruits SET StockQuantity = StockQuantity - 20 WHERE FruitID = 5 AND StockQuantity >= 20;\nUPDATE Fruits SET StockQuantity = StockQuantity - 5 WHERE FruitID = 5 AND StockQuantity >= 5;\nCOMMIT;\nSELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID = 5;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "StockQuantity"
          ],
          "rows": [
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              10
            ]
          ]
        }
      },
      {
        "id": "FS-CH09-09",
        "level": "Nâng cao (Quy tắc khóa theo thứ tự Lock Ordering chống Cycle Deadlock)",
        "pattern": "Luôn cập nhật các dòng trong cùng bảng theo thứ tự khóa chính tăng dần (FruitID = 1 trước, FruitID = 5 sau)",
        "title": "Bài 9.9: Thực thi cập nhật nhiều mặt hàng theo thứ tự FruitID tăng dần để triệt tiêu nguy cơ Deadlock",
        "question": "Khi một đơn hàng mua nhiều mặt hàng (ví dụ `FruitID = 5` và `FruitID = 1`), để hai Transaction không khóa chéo nhau gây Deadlock, quy tắc vàng là luôn khóa theo thứ tự `FruitID` tăng dần. Hãy viết một lệnh `UPDATE` duy nhất (hoặc theo thứ tự ID nhỏ đến lớn) giảm `StockQuantity` đi `2` đơn vị cho cả `FruitID = 1` và `FruitID = 5` khi `StockQuantity >= 2`, sau đó `SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID IN (1, 5) ORDER BY FruitID ASC;`.",
        "hint": "Dùng `UPDATE Fruits SET StockQuantity = StockQuantity - 2 WHERE FruitID IN (1, 5) AND StockQuantity >= 2;`.",
        "tsql": "BEGIN TRANSACTION;\nUPDATE Fruits\nSET StockQuantity = StockQuantity - 2\nWHERE FruitID IN (1, 5) AND StockQuantity >= 2;\nCOMMIT TRANSACTION;\nSELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID IN (1, 5) ORDER BY FruitID ASC;",
        "sqlite": "BEGIN TRANSACTION;\nUPDATE Fruits\nSET StockQuantity = StockQuantity - 2\nWHERE FruitID IN (1, 5) AND StockQuantity >= 2;\nCOMMIT;\nSELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID IN (1, 5) ORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "StockQuantity"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              48
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              13
            ]
          ]
        }
      },
      {
        "id": "FS-CH09-10",
        "level": "Thực chiến (Giao dịch Đặt hàng trọn vẹn End-to-End cho khách hàng Dương Quá)",
        "pattern": "Tạo Order -> Thêm OrderDetails -> Trừ kho Fruits -> Ghi PaymentTransactions -> COMMIT",
        "title": "Bài 9.10: Quy trình Transaction Đặt hàng End-to-End cho khách hàng Dương Quá (CustomerID = 8)",
        "question": "Khách hàng `'Dương Quá'` (`CustomerID = 8`, trước giờ chưa mua đơn nào) đặt mua `2` hũ `'Hạt Mắc Ca'` (`FruitID = 14`, đơn giá `280000`, thành tiền `560000`), áp mã `'VIP100'` (`VoucherID = 2`, giảm `100000` còn `460000`), do nhân viên `EmployeeID = 6` phụ trách. Hãy thực hiện trọn vẹn trong Transaction: (1) `INSERT INTO Orders` (`OrderID = 11`, `CustomerID = 8`, `EmployeeID = 6`, `VoucherID = 2`, `OrderDate = '2024-03-15 09:00:00'`, `TotalAmount = 460000`, `Status = 'Đã giao'`), (2) `INSERT INTO OrderDetails` (`OrderID = 11`, `FruitID = 14`, `Quantity = 2`, `UnitPrice = 280000`), (3) Trừ `StockQuantity` đi `2` cho `FruitID = 14`, (4) Cộng `UsedCount` thêm `1` cho `VoucherID = 2`, rồi `SELECT o.OrderID, c.FullName, o.TotalAmount, f.StockQuantity AS RemainingMacca, v.UsedCount AS VipVoucherUsed FROM Orders o INNER JOIN Customers c ON o.CustomerID = c.CustomerID INNER JOIN OrderDetails od ON o.OrderID = od.OrderID INNER JOIN Fruits f ON od.FruitID = f.FruitID INNER JOIN Vouchers v ON o.VoucherID = v.VoucherID WHERE o.OrderID = 11;`.",
        "hint": "Thực hiện tuần tự 4 bước trong Transaction rồi `SELECT` kiểm tra kết quả của `OrderID = 11`.",
        "tsql": "BEGIN TRANSACTION;\nINSERT INTO Orders (CustomerID, EmployeeID, VoucherID, OrderDate, TotalAmount, Status)\nVALUES (8, 6, 2, '2024-03-15 09:00:00', 460000, N'Đã giao');\nINSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice)\nVALUES (11, 14, 2, 280000);\nUPDATE Fruits SET StockQuantity = StockQuantity - 2 WHERE FruitID = 14;\nUPDATE Vouchers SET UsedCount = UsedCount + 1 WHERE VoucherID = 2;\nCOMMIT TRANSACTION;\nSELECT o.OrderID, c.FullName, o.TotalAmount, f.StockQuantity AS RemainingMacca, v.UsedCount AS VipVoucherUsed\nFROM Orders o\nINNER JOIN Customers c ON o.CustomerID = c.CustomerID\nINNER JOIN OrderDetails od ON o.OrderID = od.OrderID\nINNER JOIN Fruits f ON od.FruitID = f.FruitID\nINNER JOIN Vouchers v ON o.VoucherID = v.VoucherID\nWHERE o.OrderID = 11;",
        "sqlite": "BEGIN TRANSACTION;\nINSERT INTO Orders (OrderID, CustomerID, EmployeeID, VoucherID, OrderDate, TotalAmount, Status)\nVALUES (11, 8, 6, 2, '2024-03-15 09:00:00', 460000, 'Đã giao');\nINSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice)\nVALUES (11, 14, 2, 280000);\nUPDATE Fruits SET StockQuantity = StockQuantity - 2 WHERE FruitID = 14;\nUPDATE Vouchers SET UsedCount = UsedCount + 1 WHERE VoucherID = 2;\nCOMMIT;\nSELECT o.OrderID, c.FullName, o.TotalAmount, f.StockQuantity AS RemainingMacca, v.UsedCount AS VipVoucherUsed\nFROM Orders o\nINNER JOIN Customers c ON o.CustomerID = c.CustomerID\nINNER JOIN OrderDetails od ON o.OrderID = od.OrderID\nINNER JOIN Fruits f ON od.FruitID = f.FruitID\nINNER JOIN Vouchers v ON o.VoucherID = v.VoucherID\nWHERE o.OrderID = 11;",
        "expected": {
          "cols": [
            "OrderID",
            "FullName",
            "TotalAmount",
            "RemainingMacca",
            "VipVoucherUsed"
          ],
          "rows": [
            [
              11,
              "Dương Quá",
              460000,
              88,
              6
            ]
          ]
        }
      }
    ]
  },
  {
    "chapter_id": "ch10",
    "chapter_num": 10,
    "chapter_title": "Chương 10: Views, Stored Procedures, Triggers & Bảng Tạm (Temp Tables)",
    "pedagogy_goal": "Rèn phản xạ đóng gói truy vấn phức tạp thành View (CREATE VIEW), viết Trigger tự động kiểm soát nghiệp vụ (CREATE TRIGGER) và dùng Bảng tạm (Temp Table) để xử lý báo cáo đa bước.",
    "exercises": [
      {
        "id": "FS-CH10-01",
        "level": "Cơ bản (Mẫu A1 - Tạo View danh mục sản phẩm & Truy vấn từ View)",
        "pattern": "CREATE VIEW vw_Name AS SELECT ...; SELECT * FROM vw_Name ...;",
        "title": "Bài 10.1: Tạo View vw_ActiveFruitCatalog hiển thị bảng giá trái cây kèm tên danh mục",
        "question": "Hãy tạo một View tên là `vw_ActiveFruitCatalog` kết nối `Fruits` và `Categories` để lấy ra `FruitID`, `FruitName`, `CategoryName`, `Price`, `Unit`, `StockQuantity` của các mặt hàng đang còn tồn kho (`StockQuantity > 0`). Sau đó truy vấn `SELECT FruitID, FruitName, CategoryName, Price FROM vw_ActiveFruitCatalog WHERE Price >= 250000 ORDER BY Price DESC;`.",
        "hint": "Dùng `CREATE VIEW vw_ActiveFruitCatalog AS SELECT ...;` rồi `SELECT` từ chính View vừa tạo.",
        "tsql": "CREATE VIEW vw_ActiveFruitCatalog AS\nSELECT f.FruitID, f.FruitName, c.CategoryName, f.Price, f.Unit, f.StockQuantity\nFROM Fruits f\nINNER JOIN Categories c ON f.CategoryID = c.CategoryID\nWHERE f.StockQuantity > 0;\nGO\nSELECT FruitID, FruitName, CategoryName, Price\nFROM vw_ActiveFruitCatalog\nWHERE Price >= 250000\nORDER BY Price DESC;",
        "sqlite": "CREATE VIEW vw_ActiveFruitCatalog AS\nSELECT f.FruitID, f.FruitName, c.CategoryName, f.Price, f.Unit, f.StockQuantity\nFROM Fruits f\nINNER JOIN Categories c ON f.CategoryID = c.CategoryID\nWHERE f.StockQuantity > 0;\nSELECT FruitID, FruitName, CategoryName, Price\nFROM vw_ActiveFruitCatalog\nWHERE Price >= 250000\nORDER BY Price DESC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "CategoryName",
            "Price"
          ],
          "rows": [
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              "Trái cây Nhập khẩu",
              850000
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              "Trái cây Nhập khẩu",
              450000
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              "Quả mọng (Berries)",
              350000
            ],
            [
              14,
              "Hạt Mắc Ca",
              "Quả hạch (Nuts)",
              280000
            ],
            [
              6,
              "Táo Envy",
              "Trái cây Nhập khẩu",
              250000
            ]
          ]
        }
      },
      {
        "id": "FS-CH10-02",
        "level": "Cơ bản (Mẫu A2 - Tạo View tóm tắt hóa đơn khách hàng)",
        "pattern": "CREATE VIEW vw_Name AS SELECT ...; SELECT * FROM vw_Name ...; (Cùng cơ chế Bài 10.1 nhưng trên Orders & Customers)",
        "title": "Bài 10.2: Tạo View vw_OrderSummary đóng gói thông tin Đơn hàng, Khách hàng và Nhân viên",
        "question": "Áp dụng y hệt cơ chế tạo View của Bài 10.1: Tạo View `vw_OrderSummary` nối `Orders o`, `Customers c` và `Employees e` gồm các cột: `OrderID`, `CustomerName` (`c.FullName`), `CustomerType`, `SalesPerson` (`e.FullName`), `OrderDate`, `TotalAmount`, `Status`. Sau đó truy vấn `SELECT OrderID, CustomerName, SalesPerson, TotalAmount FROM vw_OrderSummary WHERE CustomerType = 'VIP' ORDER BY OrderID ASC;`.",
        "hint": "Nhờ View `vw_OrderSummary`, ứng dụng chỉ cần `SELECT` 1 dòng đơn giản mà không phải viết lại 2 phép `INNER JOIN`.",
        "tsql": "CREATE VIEW vw_OrderSummary AS\nSELECT o.OrderID, c.FullName AS CustomerName, c.CustomerType,\n       e.FullName AS SalesPerson, o.OrderDate, o.TotalAmount, o.Status\nFROM Orders o\nINNER JOIN Customers c ON o.CustomerID = c.CustomerID\nINNER JOIN Employees e ON o.EmployeeID = e.EmployeeID;\nGO\nSELECT OrderID, CustomerName, SalesPerson, TotalAmount\nFROM vw_OrderSummary\nWHERE CustomerType = N'VIP'\nORDER BY OrderID ASC;",
        "sqlite": "CREATE VIEW vw_OrderSummary AS\nSELECT o.OrderID, c.FullName AS CustomerName, c.CustomerType,\n       e.FullName AS SalesPerson, o.OrderDate, o.TotalAmount, o.Status\nFROM Orders o\nINNER JOIN Customers c ON o.CustomerID = c.CustomerID\nINNER JOIN Employees e ON o.EmployeeID = e.EmployeeID;\nSELECT OrderID, CustomerName, SalesPerson, TotalAmount\nFROM vw_OrderSummary\nWHERE CustomerType = 'VIP'\nORDER BY OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerName",
            "SalesPerson",
            "TotalAmount"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              "Hoàng Cúc",
              850000
            ],
            [
              4,
              "Triệu Mẫn",
              "Đinh Hợi",
              850000
            ],
            [
              5,
              "Võ Thành Tài",
              "Hoàng Cúc",
              2500000
            ],
            [
              8,
              "Võ Thành Tài",
              "Hoàng Cúc",
              200000
            ],
            [
              9,
              "Triệu Mẫn",
              "Đinh Hợi",
              400000
            ]
          ]
        }
      },
      {
        "id": "FS-CH10-03",
        "level": "Cơ bản (Mẫu A3 - Tạo View thống kê điểm đánh giá sản phẩm)",
        "pattern": "CREATE VIEW vw_Name AS SELECT ... GROUP BY ...; SELECT * FROM vw_Name; (Cùng cơ chế View nhưng chứa GROUP BY)",
        "title": "Bài 10.3: Tạo View vw_FruitRatingStats tổng hợp điểm đánh giá trung bình của từng loại trái cây",
        "question": "Tiếp tục phản xạ tạo View: Tạo `vw_FruitRatingStats` nối `Fruits f` với `Reviews r` (`INNER JOIN`), gom nhóm theo `f.FruitID, f.FruitName` để tính `ReviewCount = COUNT(r.ReviewID)` và `AvgRating = ROUND(AVG(r.Rating * 1.0), 2)`. Sau đó truy vấn `SELECT FruitID, FruitName, ReviewCount, AvgRating FROM vw_FruitRatingStats ORDER BY AvgRating DESC, FruitID ASC;`.",
        "hint": "Gom nhóm `GROUP BY f.FruitID, f.FruitName` bên trong định nghĩa `CREATE VIEW`.",
        "tsql": "CREATE VIEW vw_FruitRatingStats AS\nSELECT f.FruitID, f.FruitName,\n       COUNT(r.ReviewID) AS ReviewCount,\n       ROUND(AVG(CAST(r.Rating AS FLOAT)), 2) AS AvgRating\nFROM Fruits f\nINNER JOIN Reviews r ON f.FruitID = r.FruitID\nGROUP BY f.FruitID, f.FruitName;\nGO\nSELECT FruitID, FruitName, ReviewCount, AvgRating\nFROM vw_FruitRatingStats\nORDER BY AvgRating DESC, FruitID ASC;",
        "sqlite": "CREATE VIEW vw_FruitRatingStats AS\nSELECT f.FruitID, f.FruitName,\n       COUNT(r.ReviewID) AS ReviewCount,\n       ROUND(AVG(r.Rating * 1.0), 2) AS AvgRating\nFROM Fruits f\nINNER JOIN Reviews r ON f.FruitID = r.FruitID\nGROUP BY f.FruitID, f.FruitName;\nSELECT FruitID, FruitName, ReviewCount, AvgRating\nFROM vw_FruitRatingStats\nORDER BY AvgRating DESC, FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "ReviewCount",
            "AvgRating"
          ],
          "rows": [
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              1,
              5.0
            ],
            [
              6,
              "Táo Envy",
              1,
              5.0
            ],
            [
              3,
              "Xoài Cát Hòa Lộc",
              1,
              4.0
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              1,
              3.0
            ]
          ]
        }
      },
      {
        "id": "FS-CH10-04",
        "level": "Cơ bản (Mẫu B1 - Tạo Trigger tự động trừ kho khi thêm OrderDetails)",
        "pattern": "CREATE TRIGGER trg_Name AFTER INSERT ON OrderDetails ... UPDATE Fruits SET StockQuantity = ...;",
        "title": "Bài 10.4: Tạo Trigger tự động trừ StockQuantity trong bảng Fruits mỗi khi thêm dòng vào OrderDetails",
        "question": "Hãy tạo một Trigger `trg_DeductStockOnOrder` kích hoạt `AFTER INSERT ON OrderDetails` để tự động trừ `StockQuantity` của `FruitID` tương ứng trong bảng `Fruits` đi `NEW.Quantity` (hoặc bảng `inserted` trong T-SQL). Sau đó kiểm chứng bằng cách `INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 1, 5, 150000);` (mua 5 kg Sầu Riêng Ri6) và `SELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID = 1;` (tồn kho tự động giảm từ 50 xuống 45!).",
        "hint": "Trong SQLite dùng `NEW.Quantity` và `NEW.FruitID` bên trong `BEGIN ... END;`. Trong T-SQL dùng bảng ảo `inserted`.",
        "tsql": "CREATE TRIGGER trg_DeductStockOnOrder\nON OrderDetails\nAFTER INSERT\nAS\nBEGIN\n    SET NOCOUNT ON;\n    UPDATE f\n    SET f.StockQuantity = f.StockQuantity - i.Quantity\n    FROM Fruits f\n    INNER JOIN inserted i ON f.FruitID = i.FruitID;\nEND;\nGO\nINSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 1, 5, 150000);\nSELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID = 1;",
        "sqlite": "CREATE TRIGGER trg_DeductStockOnOrder\nAFTER INSERT ON OrderDetails\nBEGIN\n    UPDATE Fruits\n    SET StockQuantity = StockQuantity - NEW.Quantity\n    WHERE FruitID = NEW.FruitID;\nEND;\nINSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 1, 5, 150000);\nSELECT FruitID, FruitName, StockQuantity FROM Fruits WHERE FruitID = 1;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "StockQuantity"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              45
            ]
          ]
        }
      },
      {
        "id": "FS-CH10-05",
        "level": "Cơ bản (Mẫu B2 - Tạo Trigger tự động cộng lại TotalAmount vào Orders khi thêm OrderDetails)",
        "pattern": "CREATE TRIGGER trg_Name AFTER INSERT ON OrderDetails ... UPDATE Orders SET TotalAmount = ...; (Cùng cơ chế Bài 10.4 nhưng cập nhật bảng Orders)",
        "title": "Bài 10.5: Tạo Trigger tự động cộng thêm tiền vào Orders.TotalAmount khi thêm mặt hàng vào OrderDetails",
        "question": "Áp dụng y hệt cơ chế Trigger `AFTER INSERT ON OrderDetails` của Bài 10.4 nhưng tác động lên bảng `Orders`: Tạo Trigger `trg_UpdateOrderTotal` tự động cộng `NEW.Quantity * NEW.UnitPrice` vào cột `TotalAmount` của đơn hàng `NEW.OrderID`. Kiểm chứng bằng cách `INSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 3, 2, 80000);` (thêm 160,000đ vào đơn số 10 vốn đang là 95,000đ) và `SELECT OrderID, CustomerID, TotalAmount FROM Orders WHERE OrderID = 10;`.",
        "hint": "Tổng tiền mới của `OrderID = 10` sẽ tự động nhảy từ `95000` lên `255000`.",
        "tsql": "CREATE TRIGGER trg_UpdateOrderTotal\nON OrderDetails\nAFTER INSERT\nAS\nBEGIN\n    SET NOCOUNT ON;\n    UPDATE o\n    SET o.TotalAmount = o.TotalAmount + (i.Quantity * i.UnitPrice)\n    FROM Orders o\n    INNER JOIN inserted i ON o.OrderID = i.OrderID;\nEND;\nGO\nINSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 3, 2, 80000);\nSELECT OrderID, CustomerID, TotalAmount FROM Orders WHERE OrderID = 10;",
        "sqlite": "CREATE TRIGGER trg_UpdateOrderTotal\nAFTER INSERT ON OrderDetails\nBEGIN\n    UPDATE Orders\n    SET TotalAmount = TotalAmount + (NEW.Quantity * NEW.UnitPrice)\n    WHERE OrderID = NEW.OrderID;\nEND;\nINSERT INTO OrderDetails (OrderID, FruitID, Quantity, UnitPrice) VALUES (10, 3, 2, 80000);\nSELECT OrderID, CustomerID, TotalAmount FROM Orders WHERE OrderID = 10;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "TotalAmount"
          ],
          "rows": [
            [
              10,
              7,
              255000
            ]
          ]
        }
      },
      {
        "id": "FS-CH10-06",
        "level": "Cơ bản (Mẫu B3 - Tạo Trigger tự động cập nhật trạng thái đơn hàng khi có thanh toán đủ)",
        "pattern": "CREATE TRIGGER trg_Name AFTER INSERT ON PaymentTransactions ... UPDATE Orders SET Status = 'Đã giao' ...;",
        "title": "Bài 10.6: Tạo Trigger tự động chuyển trạng thái đơn hàng sang 'Đã giao' khi nhận giao dịch thanh toán",
        "question": "Tiếp tục phản xạ Trigger: Tạo `trg_AutoCompleteOrderOnPay` kích hoạt `AFTER INSERT ON PaymentTransactions` để tự động cập nhật `Status = 'Đã giao'` cho đơn hàng có `OrderID = NEW.OrderID` (khi `NEW.Amount >= TotalAmount`). Kiểm chứng bằng cách `INSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate) VALUES (9, 'Momo', 400000, '2024-03-05 12:00:00');` và `SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE OrderID = 9;`.",
        "hint": "Đơn hàng số 9 đang `'Chờ xử lý'` sẽ tự động chuyển thành `'Đã giao'` ngay khi dòng thanh toán được chèn vào.",
        "tsql": "CREATE TRIGGER trg_AutoCompleteOrderOnPay\nON PaymentTransactions\nAFTER INSERT\nAS\nBEGIN\n    SET NOCOUNT ON;\n    UPDATE o\n    SET o.Status = N'Đã giao'\n    FROM Orders o\n    INNER JOIN inserted i ON o.OrderID = i.OrderID\n    WHERE i.Amount >= o.TotalAmount;\nEND;\nGO\nINSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate)\nVALUES (9, N'Momo', 400000, '2024-03-05 12:00:00');\nSELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE OrderID = 9;",
        "sqlite": "CREATE TRIGGER trg_AutoCompleteOrderOnPay\nAFTER INSERT ON PaymentTransactions\nBEGIN\n    UPDATE Orders\n    SET Status = 'Đã giao'\n    WHERE OrderID = NEW.OrderID AND NEW.Amount >= TotalAmount;\nEND;\nINSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate)\nVALUES (9, 'Momo', 400000, '2024-03-05 12:00:00');\nSELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE OrderID = 9;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "TotalAmount",
            "Status"
          ],
          "rows": [
            [
              9,
              4,
              400000,
              "Đã giao"
            ]
          ]
        }
      },
      {
        "id": "FS-CH10-07",
        "level": "Trung cấp (Sử dụng Bảng tạm Temp Table để lưu kết quả trung gian)",
        "pattern": "CREATE TEMP TABLE tmp_VipStats AS SELECT ...; SELECT * FROM tmp_VipStats ...;",
        "title": "Bài 10.7: Tạo Bảng tạm (Temp Table) tổng hợp doanh số theo từng khách hàng để phân tích đa bước",
        "question": "Hãy tạo một bảng tạm `tmp_CustomerMetrics` lưu trữ kết quả gom nhóm từ `Customers` và `Orders` (chỉ tính đơn `'Đã giao'`): gồm `CustomerID`, `FullName`, `DeliveredOrders = COUNT(o.OrderID)`, `DeliveredRevenue = SUM(o.TotalAmount)`. Sau đó truy vấn từ bảng tạm `SELECT CustomerID, FullName, DeliveredOrders, DeliveredRevenue FROM tmp_CustomerMetrics WHERE DeliveredRevenue >= 500000 ORDER BY DeliveredRevenue DESC;`.",
        "hint": "Trong SQLite dùng `CREATE TEMP TABLE tmp_CustomerMetrics AS SELECT ...;`. Trong T-SQL dùng `SELECT ... INTO #tmp_CustomerMetrics FROM ...;`.",
        "tsql": "SELECT c.CustomerID, c.FullName,\n       COUNT(o.OrderID) AS DeliveredOrders,\n       SUM(o.TotalAmount) AS DeliveredRevenue\nINTO #tmp_CustomerMetrics\nFROM Customers c\nINNER JOIN Orders o ON c.CustomerID = o.CustomerID\nWHERE o.Status = N'Đã giao'\nGROUP BY c.CustomerID, c.FullName;\n\nSELECT CustomerID, FullName, DeliveredOrders, DeliveredRevenue\nFROM #tmp_CustomerMetrics\nWHERE DeliveredRevenue >= 500000\nORDER BY DeliveredRevenue DESC;",
        "sqlite": "CREATE TEMP TABLE tmp_CustomerMetrics AS\nSELECT c.CustomerID, c.FullName,\n       COUNT(o.OrderID) AS DeliveredOrders,\n       SUM(o.TotalAmount) AS DeliveredRevenue\nFROM Customers c\nINNER JOIN Orders o ON c.CustomerID = o.CustomerID\nWHERE o.Status = 'Đã giao'\nGROUP BY c.CustomerID, c.FullName;\n\nSELECT CustomerID, FullName, DeliveredOrders, DeliveredRevenue\nFROM tmp_CustomerMetrics\nWHERE DeliveredRevenue >= 500000\nORDER BY DeliveredRevenue DESC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "DeliveredOrders",
            "DeliveredRevenue"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              2,
              3350000
            ],
            [
              4,
              "Triệu Mẫn",
              1,
              850000
            ]
          ]
        }
      },
      {
        "id": "FS-CH10-08",
        "level": "Trung cấp (Trigger ghi nhận lịch sử Audit Log khi thay đổi giá bán Fruits)",
        "pattern": "CREATE TABLE PriceAuditLog (...); CREATE TRIGGER trg_AuditPrice AFTER UPDATE OF Price ON Fruits ...;",
        "title": "Bài 10.8: Thiết kế bảng Audit Log và Trigger tự động ghi vết khi thay đổi giá trái cây",
        "question": "Hãy thực hiện: (1) Tạo bảng `FruitPriceAudit (AuditID INTEGER PRIMARY KEY AUTOINCREMENT, FruitID INT, OldPrice INT, NewPrice INT)`, (2) Tạo Trigger `trg_AuditFruitPrice` kích hoạt `AFTER UPDATE OF Price ON Fruits` tự động chèn `OLD.FruitID, OLD.Price, NEW.Price` vào `FruitPriceAudit`, (3) Cập nhật giá `'Sầu Riêng Ri6'` (`FruitID = 1`) từ `150000` lên `165000`, và (4) `SELECT AuditID, FruitID, OldPrice, NewPrice FROM FruitPriceAudit;`.",
        "hint": "Trong Trigger `AFTER UPDATE`, giá cũ lấy từ `OLD.Price` (T-SQL: bảng `deleted`) và giá mới lấy từ `NEW.Price` (T-SQL: bảng `inserted`).",
        "tsql": "CREATE TABLE FruitPriceAudit (\n    AuditID INT IDENTITY(1,1) PRIMARY KEY,\n    FruitID INT,\n    OldPrice DECIMAL(18,2),\n    NewPrice DECIMAL(18,2)\n);\nGO\nCREATE TRIGGER trg_AuditFruitPrice\nON Fruits\nAFTER UPDATE\nAS\nBEGIN\n    SET NOCOUNT ON;\n    IF UPDATE(Price)\n    BEGIN\n        INSERT INTO FruitPriceAudit (FruitID, OldPrice, NewPrice)\n        SELECT i.FruitID, d.Price, i.Price\n        FROM inserted i\n        INNER JOIN deleted d ON i.FruitID = d.FruitID\n        WHERE i.Price <> d.Price;\n    END\nEND;\nGO\nUPDATE Fruits SET Price = 165000 WHERE FruitID = 1;\nSELECT AuditID, FruitID, OldPrice, NewPrice FROM FruitPriceAudit;",
        "sqlite": "CREATE TABLE FruitPriceAudit (\n    AuditID INTEGER PRIMARY KEY AUTOINCREMENT,\n    FruitID INT,\n    OldPrice INT,\n    NewPrice INT\n);\nCREATE TRIGGER trg_AuditFruitPrice\nAFTER UPDATE OF Price ON Fruits\nWHEN OLD.Price <> NEW.Price\nBEGIN\n    INSERT INTO FruitPriceAudit (FruitID, OldPrice, NewPrice)\n    VALUES (NEW.FruitID, OLD.Price, NEW.Price);\nEND;\nUPDATE Fruits SET Price = 165000 WHERE FruitID = 1;\nSELECT AuditID, FruitID, OldPrice, NewPrice FROM FruitPriceAudit;",
        "expected": {
          "cols": [
            "AuditID",
            "FruitID",
            "OldPrice",
            "NewPrice"
          ],
          "rows": [
            [
              1,
              1,
              150000,
              165000
            ]
          ]
        }
      },
      {
        "id": "FS-CH10-09",
        "level": "Nâng cao (Kết hợp nhiều View để tạo Báo cáo tổng hợp Executive Dashboard)",
        "pattern": "Tạo View doanh số danh mục -> Truy vấn kết hợp tính tỷ trọng",
        "title": "Bài 10.9: Tạo View doanh số theo Danh mục (vw_CategorySales) và xếp hạng đóng góp doanh thu",
        "question": "Hãy tạo View `vw_CategorySales` kết nối `Categories c` -> `Fruits f` (`LEFT JOIN`) -> `OrderDetails od` (`LEFT JOIN`) để tính cho cả 5 danh mục: `CategoryID`, `CategoryName`, tổng số lượng đã bán (`TotalSoldQty = COALESCE(SUM(od.Quantity), 0)`), và tổng doanh thu mặt hàng (`CategoryRevenue = COALESCE(SUM(od.SubTotal), 0)`). Sau đó truy vấn từ `vw_CategorySales` kèm cột xếp hạng `DENSE_RANK() OVER (ORDER BY CategoryRevenue DESC) AS RevenueRank`, sắp xếp theo `CategoryRevenue` giảm dần, `CategoryID` tăng dần.",
        "hint": "Dùng `LEFT JOIN` từ `Categories` để hai danh mục chưa có đơn hàng nào (Trái cây sấy, Quả hạch) vẫn xuất hiện với doanh thu bằng `0`.",
        "tsql": "CREATE VIEW vw_CategorySales AS\nSELECT c.CategoryID, c.CategoryName,\n       COALESCE(SUM(od.Quantity), 0) AS TotalSoldQty,\n       COALESCE(SUM(od.SubTotal), 0) AS CategoryRevenue\nFROM Categories c\nLEFT JOIN Fruits f ON c.CategoryID = f.CategoryID\nLEFT JOIN OrderDetails od ON f.FruitID = od.FruitID\nGROUP BY c.CategoryID, c.CategoryName;\nGO\nSELECT CategoryID, CategoryName, TotalSoldQty, CategoryRevenue,\n       DENSE_RANK() OVER (ORDER BY CategoryRevenue DESC) AS RevenueRank\nFROM vw_CategorySales\nORDER BY CategoryRevenue DESC, CategoryID ASC;",
        "sqlite": "CREATE VIEW vw_CategorySales AS\nSELECT c.CategoryID, c.CategoryName,\n       COALESCE(SUM(od.Quantity), 0) AS TotalSoldQty,\n       COALESCE(SUM(od.SubTotal), 0) AS CategoryRevenue\nFROM Categories c\nLEFT JOIN Fruits f ON c.CategoryID = f.CategoryID\nLEFT JOIN OrderDetails od ON f.FruitID = od.FruitID\nGROUP BY c.CategoryID, c.CategoryName;\nSELECT CategoryID, CategoryName, TotalSoldQty, CategoryRevenue,\n       DENSE_RANK() OVER (ORDER BY CategoryRevenue DESC) AS RevenueRank\nFROM vw_CategorySales\nORDER BY CategoryRevenue DESC, CategoryID ASC;",
        "expected": {
          "cols": [
            "CategoryID",
            "CategoryName",
            "TotalSoldQty",
            "CategoryRevenue",
            "RevenueRank"
          ],
          "rows": [
            [
              2,
              "Trái cây Nhập khẩu",
              10,
              5030000,
              1
            ],
            [
              3,
              "Quả mọng (Berries)",
              2,
              550000,
              2
            ],
            [
              1,
              "Đặc sản Miền Tây",
              5,
              475000,
              3
            ],
            [
              4,
              "Trái cây sấy",
              0,
              0,
              4
            ],
            [
              5,
              "Quả hạch (Nuts)",
              0,
              0,
              4
            ]
          ]
        }
      },
      {
        "id": "FS-CH10-10",
        "level": "Thực chiến (Mô phỏng logic Stored Procedure chốt sổ doanh thu nhân viên kèm thưởng KPI)",
        "pattern": "Bảng tạm / View tổng hợp KPI bán hàng + Tính thưởng hoa hồng theo bậc",
        "title": "Bài 10.10: Báo cáo tổng kết KPI & Hoa hồng cho đội ngũ Nhân viên Bán hàng",
        "question": "Hãy tổng hợp kết quả kinh doanh của tất cả nhân viên có chức vụ `'Nhân viên Bán hàng'` (`Role = 'Nhân viên Bán hàng'`) từ bảng `Employees` kết nối `Orders`: Lấy ra `EmployeeID`, `FullName`, tổng số đơn đã giao (`DeliveredCount = SUM(CASE WHEN o.Status = 'Đã giao' THEN 1 ELSE 0 END)`), doanh thu thực thu từ đơn đã giao (`DeliveredRevenue = SUM(CASE WHEN o.Status = 'Đã giao' THEN o.TotalAmount ELSE 0 END)`), và tiền thưởng hoa hồng 5% trên doanh thu đã giao (`Commission = DeliveredRevenue * 5 / 100`). Sắp xếp theo `DeliveredRevenue` giảm dần.",
        "hint": "Dùng kỹ thuật Conditional Aggregation `SUM(CASE WHEN o.Status = 'Đã giao' THEN ... ELSE 0 END)`.",
        "tsql": "SELECT e.EmployeeID, e.FullName,\n       SUM(CASE WHEN o.Status = N'Đã giao' THEN 1 ELSE 0 END) AS DeliveredCount,\n       SUM(CASE WHEN o.Status = N'Đã giao' THEN o.TotalAmount ELSE 0 END) AS DeliveredRevenue,\n       SUM(CASE WHEN o.Status = N'Đã giao' THEN o.TotalAmount ELSE 0 END) * 5 / 100 AS Commission\nFROM Employees e\nLEFT JOIN Orders o ON e.EmployeeID = o.EmployeeID\nWHERE e.Role = N'Nhân viên Bán hàng'\nGROUP BY e.EmployeeID, e.FullName\nORDER BY DeliveredRevenue DESC;",
        "sqlite": "SELECT e.EmployeeID, e.FullName,\n       SUM(CASE WHEN o.Status = 'Đã giao' THEN 1 ELSE 0 END) AS DeliveredCount,\n       SUM(CASE WHEN o.Status = 'Đã giao' THEN o.TotalAmount ELSE 0 END) AS DeliveredRevenue,\n       SUM(CASE WHEN o.Status = 'Đã giao' THEN o.TotalAmount ELSE 0 END) * 5 / 100 AS Commission\nFROM Employees e\nLEFT JOIN Orders o ON e.EmployeeID = o.EmployeeID\nWHERE e.Role = 'Nhân viên Bán hàng'\nGROUP BY e.EmployeeID, e.FullName\nORDER BY DeliveredRevenue DESC;",
        "expected": {
          "cols": [
            "EmployeeID",
            "FullName",
            "DeliveredCount",
            "DeliveredRevenue",
            "Commission"
          ],
          "rows": [
            [
              6,
              "Hoàng Cúc",
              3,
              3530000,
              176500
            ],
            [
              7,
              "Đinh Hợi",
              3,
              1300000,
              65000
            ]
          ]
        }
      }
    ]
  },
  {
    "chapter_id": "ch11",
    "chapter_num": 11,
    "chapter_title": "Chương 11: Bảo Mật CSDL, Phòng Chống SQL Injection, Phân Quyền & Che Giấu Dữ Liệu (Masking)",
    "pedagogy_goal": "Rèn phản xạ bảo vệ dữ liệu nhạy cảm của khách hàng và nhân sự: che giấu số điện thoại/địa chỉ (Data Masking), tạo View phân quyền theo vai trò (Least Privilege View), lọc theo ngữ cảnh người dùng (Row-Level Security) và truy vấn tham số hóa chống SQL Injection.",
    "exercises": [
      {
        "id": "FS-CH11-01",
        "level": "Cơ bản (Mẫu A1 - Dynamic Data Masking che số điện thoại khách hàng)",
        "pattern": "SUBSTR(PhoneNumber, 1, 3) || '****' || SUBSTR(PhoneNumber, -3)",
        "title": "Bài 11.1: Che giấu số điện thoại khách hàng (Data Masking trên bảng Customers)",
        "question": "Khi hiển thị danh sách khách hàng cho bộ phận Chăm sóc khách hàng cấp 1, cần ẩn 4 chữ số giữa của `PhoneNumber` (ví dụ `'0901111222'` -> `'090****222'`). Hãy lấy ra `CustomerID`, `FullName`, cột `MaskedPhone` (3 số đầu + `'****'` + 3 số cuối) và `CustomerType` từ bảng `Customers`. Sắp xếp theo `CustomerID` tăng dần.",
        "hint": "Trong SQLite dùng `SUBSTR(PhoneNumber, 1, 3) || '****' || SUBSTR(PhoneNumber, -3, 3)`. Trong T-SQL dùng `LEFT(PhoneNumber, 3) + '****' + RIGHT(PhoneNumber, 3)`.",
        "tsql": "SELECT CustomerID, FullName,\n       LEFT(PhoneNumber, 3) + '****' + RIGHT(PhoneNumber, 3) AS MaskedPhone,\n       CustomerType\nFROM Customers\nORDER BY CustomerID ASC;",
        "sqlite": "SELECT CustomerID, FullName,\n       SUBSTR(PhoneNumber, 1, 3) || '****' || SUBSTR(PhoneNumber, -3, 3) AS MaskedPhone,\n       CustomerType\nFROM Customers\nORDER BY CustomerID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "MaskedPhone",
            "CustomerType"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              "090****222",
              "VIP"
            ],
            [
              2,
              "Nguyễn Thị Lệ",
              "090****333",
              "Standard"
            ],
            [
              3,
              "Trương Vô Kỵ",
              "090****444",
              "Standard"
            ],
            [
              4,
              "Triệu Mẫn",
              "090****555",
              "VIP"
            ],
            [
              5,
              "Chu Chỉ Nhược",
              "090****666",
              "Standard"
            ],
            [
              6,
              "Ân Ly",
              "090****777",
              "Standard"
            ],
            [
              7,
              "Tiểu Chiêu",
              "090****888",
              "Standard"
            ],
            [
              8,
              "Dương Quá",
              "090****999",
              "Standard"
            ]
          ]
        }
      },
      {
        "id": "FS-CH11-02",
        "level": "Cơ bản (Mẫu A2 - Data Masking che mã VoucherCode)",
        "pattern": "SUBSTR(VoucherCode, 1, 3) || '***' (Cùng cơ chế Masking của Bài 11.1 nhưng trên bảng Vouchers)",
        "title": "Bài 11.2: Che giấu một phần mã VoucherCode trên màn hình công khai (Bảng Vouchers)",
        "question": "Áp dụng y hệt kỹ thuật Data Masking của Bài 11.1 trên bảng `Vouchers`: Lấy ra `VoucherID`, cột `MaskedCode` chỉ hiện 3 ký tự đầu của `VoucherCode` nối với `'***'` (ví dụ `'WELCOME50'` -> `'WEL***'`), `DiscountAmount` và `MinOrderValue`. Sắp xếp theo `VoucherID` tăng dần.",
        "hint": "Dùng `SUBSTR(VoucherCode, 1, 3) || '***'` (SQLite) hoặc `LEFT(VoucherCode, 3) + '***'` (T-SQL).",
        "tsql": "SELECT VoucherID,\n       LEFT(VoucherCode, 3) + '***' AS MaskedCode,\n       DiscountAmount, MinOrderValue\nFROM Vouchers\nORDER BY VoucherID ASC;",
        "sqlite": "SELECT VoucherID,\n       SUBSTR(VoucherCode, 1, 3) || '***' AS MaskedCode,\n       DiscountAmount, MinOrderValue\nFROM Vouchers\nORDER BY VoucherID ASC;",
        "expected": {
          "cols": [
            "VoucherID",
            "MaskedCode",
            "DiscountAmount",
            "MinOrderValue"
          ],
          "rows": [
            [
              1,
              "WEL***",
              50000,
              200000
            ],
            [
              2,
              "VIP***",
              100000,
              500000
            ],
            [
              3,
              "HET***",
              30000,
              100000
            ]
          ]
        }
      },
      {
        "id": "FS-CH11-03",
        "level": "Cơ bản (Mẫu A3 - Data Masking ẩn danh tên người đánh giá trên trang sản phẩm)",
        "pattern": "SUBSTR(FullName, 1, 1) || '***' (Cùng cơ chế Masking trên Reviews & Customers)",
        "title": "Bài 11.3: Ẩn danh tên khách hàng viết đánh giá sản phẩm (Reviews JOIN Customers)",
        "question": "Tiếp tục phản xạ Data Masking khi hiển thị đánh giá công khai trên web: Kết nối `Reviews r` với `Customers c`, lấy ra `ReviewID`, `FruitID`, cột `ReviewerMasked` gồm ký tự đầu tiên của `FullName` nối với `'***'` (ví dụ `'Võ Thành Tài'` -> `'V***'`), `Rating` và `Comment`. Sắp xếp theo `ReviewID` tăng dần.",
        "hint": "Dùng `SUBSTR(c.FullName, 1, 1) || '***' AS ReviewerMasked`.",
        "tsql": "SELECT r.ReviewID, r.FruitID,\n       LEFT(c.FullName, 1) + N'***' AS ReviewerMasked,\n       r.Rating, r.Comment\nFROM Reviews r\nINNER JOIN Customers c ON r.CustomerID = c.CustomerID\nORDER BY r.ReviewID ASC;",
        "sqlite": "SELECT r.ReviewID, r.FruitID,\n       SUBSTR(c.FullName, 1, 1) || '***' AS ReviewerMasked,\n       r.Rating, r.Comment\nFROM Reviews r\nINNER JOIN Customers c ON r.CustomerID = c.CustomerID\nORDER BY r.ReviewID ASC;",
        "expected": {
          "cols": [
            "ReviewID",
            "FruitID",
            "ReviewerMasked",
            "Rating",
            "Comment"
          ],
          "rows": [
            [
              1,
              5,
              "V***",
              5,
              "Nho rất giòn và ngọt, đáng tiền!"
            ],
            [
              2,
              3,
              "N***",
              4,
              "Xoài ngọt nhưng da hơi xấu"
            ],
            [
              3,
              6,
              "T***",
              5,
              "Táo Envy chuẩn Mỹ, rất thơm."
            ],
            [
              4,
              10,
              "C***",
              3,
              "Việt quất hơi chua so với mong đợi."
            ]
          ]
        }
      },
      {
        "id": "FS-CH11-04",
        "level": "Cơ bản (Mẫu B1 - Tạo View phân quyền tối thiểu Least Privilege cho Nhân viên Kho)",
        "pattern": "CREATE VIEW vw_WarehouseFruits AS SELECT (chỉ các cột kho, ẩn cột giá/doanh thu) ...;",
        "title": "Bài 11.4: Tạo View bảo mật cấp cột (Column-Level Security) dành riêng cho Nhân viên Kho",
        "question": "Theo nguyên tắc **Least Privilege**, nhân viên kho chỉ cần biết tên hàng, đơn vị tính, xuất xứ và số lượng tồn kho, không cần xem chiến lược giá hoặc dữ liệu khác. Hãy tạo View `vw_WarehouseStock` chỉ lấy `FruitID`, `FruitName`, `Unit`, `Origin`, `StockQuantity` từ bảng `Fruits`, sau đó truy vấn `SELECT * FROM vw_WarehouseStock WHERE StockQuantity <= 30 ORDER BY StockQuantity ASC, FruitID ASC;`.",
        "hint": "Cấp quyền `SELECT` trên View `vw_WarehouseStock` và thu hồi quyền trên bảng gốc `Fruits` là cách chuẩn để bảo mật cấp cột.",
        "tsql": "CREATE VIEW vw_WarehouseStock AS\nSELECT FruitID, FruitName, Unit, Origin, StockQuantity\nFROM Fruits;\nGO\nSELECT * FROM vw_WarehouseStock\nWHERE StockQuantity <= 30\nORDER BY StockQuantity ASC, FruitID ASC;",
        "sqlite": "CREATE VIEW vw_WarehouseStock AS\nSELECT FruitID, FruitName, Unit, Origin, StockQuantity\nFROM Fruits;\nSELECT * FROM vw_WarehouseStock\nWHERE StockQuantity <= 30\nORDER BY StockQuantity ASC, FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Unit",
            "Origin",
            "StockQuantity"
          ],
          "rows": [
            [
              11,
              "Mâm Xôi Đen",
              "Hộp",
              "Đà Lạt",
              0
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              "Chùm",
              "Hàn Quốc",
              15
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              "Hộp",
              "Mỹ",
              20
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              "Kg",
              "Úc",
              30
            ]
          ]
        }
      },
      {
        "id": "FS-CH11-05",
        "level": "Cơ bản (Mẫu B2 - Tạo View bảo mật cấp dòng Row-Level Security cho Nhân viên Bán hàng số 6)",
        "pattern": "CREATE VIEW vw_MyOrders AS SELECT ... FROM Orders WHERE EmployeeID = 6; (Cùng cơ chế View bảo mật nhưng lọc theo dòng)",
        "title": "Bài 11.5: Thiết kế View bảo mật cấp dòng (Row-Level Security) để nhân viên chỉ thấy đơn hàng mình phụ trách",
        "question": "Áp dụng cơ chế View bảo mật cho nhân viên bán hàng Hoàng Cúc (`EmployeeID = 6`): Tạo View `vw_SalesEmp6_Orders` chỉ trích xuất các đơn hàng có `EmployeeID = 6` (gồm `OrderID`, `CustomerID`, `OrderDate`, `TotalAmount`, `Status`). Sau đó truy vấn `SELECT * FROM vw_SalesEmp6_Orders ORDER BY OrderID ASC;`.",
        "hint": "Lọc cứng `WHERE EmployeeID = 6` (hoặc `SESSION_CONTEXT` trong SQL Server thực tế) ngay trong View.",
        "tsql": "CREATE VIEW vw_SalesEmp6_Orders AS\nSELECT OrderID, CustomerID, OrderDate, TotalAmount, Status\nFROM Orders\nWHERE EmployeeID = 6;\nGO\nSELECT * FROM vw_SalesEmp6_Orders ORDER BY OrderID ASC;",
        "sqlite": "CREATE VIEW vw_SalesEmp6_Orders AS\nSELECT OrderID, CustomerID, OrderDate, TotalAmount, Status\nFROM Orders\nWHERE EmployeeID = 6;\nSELECT * FROM vw_SalesEmp6_Orders ORDER BY OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "OrderDate",
            "TotalAmount",
            "Status"
          ],
          "rows": [
            [
              1,
              1,
              "2023-02-14 10:15:00",
              850000,
              "Đã giao"
            ],
            [
              2,
              2,
              "2023-04-20 14:30:00",
              180000,
              "Đã giao"
            ],
            [
              5,
              1,
              "2023-12-24 19:00:00",
              2500000,
              "Đã giao"
            ],
            [
              7,
              6,
              "2024-02-14 11:20:00",
              180000,
              "Đã hủy"
            ],
            [
              8,
              1,
              "2024-03-01 15:10:00",
              200000,
              "Đang giao"
            ],
            [
              10,
              7,
              "2024-03-10 14:00:00",
              95000,
              "Chờ xử lý"
            ]
          ]
        }
      },
      {
        "id": "FS-CH11-06",
        "level": "Cơ bản (Mẫu B3 - Tạo View bảo mật cấp dòng cho Nhân viên Bán hàng số 7)",
        "pattern": "CREATE VIEW vw_SalesEmp7_Orders AS SELECT ... FROM Orders WHERE EmployeeID = 7; (Cùng cơ chế Bài 11.5 nhưng cho EmployeeID = 7)",
        "title": "Bài 11.6: Thiết kế View bảo mật cấp dòng cho nhân viên bán hàng Đinh Hợi (EmployeeID = 7)",
        "question": "Tiếp tục phản xạ Row-Level Security View cho nhân viên Đinh Hợi (`EmployeeID = 7`): Tạo View `vw_SalesEmp7_Orders` chỉ lấy `OrderID`, `CustomerID`, `OrderDate`, `TotalAmount`, `Status` của các đơn có `EmployeeID = 7`. Sau đó truy vấn `SELECT * FROM vw_SalesEmp7_Orders ORDER BY OrderID ASC;`.",
        "hint": "Dùng `WHERE EmployeeID = 7`.",
        "tsql": "CREATE VIEW vw_SalesEmp7_Orders AS\nSELECT OrderID, CustomerID, OrderDate, TotalAmount, Status\nFROM Orders\nWHERE EmployeeID = 7;\nGO\nSELECT * FROM vw_SalesEmp7_Orders ORDER BY OrderID ASC;",
        "sqlite": "CREATE VIEW vw_SalesEmp7_Orders AS\nSELECT OrderID, CustomerID, OrderDate, TotalAmount, Status\nFROM Orders\nWHERE EmployeeID = 7;\nSELECT * FROM vw_SalesEmp7_Orders ORDER BY OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "OrderDate",
            "TotalAmount",
            "Status"
          ],
          "rows": [
            [
              3,
              3,
              "2023-06-15 09:00:00",
              150000,
              "Đã giao"
            ],
            [
              4,
              4,
              "2023-08-08 16:45:00",
              850000,
              "Đã giao"
            ],
            [
              6,
              5,
              "2024-01-10 08:30:00",
              300000,
              "Đã giao"
            ],
            [
              9,
              4,
              "2024-03-05 10:00:00",
              400000,
              "Chờ xử lý"
            ]
          ]
        }
      },
      {
        "id": "FS-CH11-07",
        "level": "Trung cấp (Mô phỏng hậu quả của lỗi nối chuỗi SQL Injection `' OR '1'='1`)",
        "pattern": "So sánh kết quả khi bị tấn công WHERE VoucherCode = '' OR '1'='1' (lộ toàn bộ bảng) vs Truy vấn an toàn",
        "title": "Bài 11.7: Phân tích lỗ hổng SQL Injection khi kiểm tra mã Voucher và cách khóa chặt điều kiện",
        "question": "Khi lập trình viên nối chuỗi trực tiếp, kẻ tấn công nhập mã `'WELCOME50'`, nhưng nếu chỉ lấy các Voucher **đang còn hiệu lực** (`UsedCount < UsageLimit AND ExpiryDate >= '2024-01-01'`) và khớp chính xác mã `'WELCOME50'`, hãy viết câu truy vấn chuẩn trả về `VoucherID`, `VoucherCode`, `DiscountAmount`, `MinOrderValue`.",
        "hint": "Luôn kết hợp lọc chính xác `WHERE VoucherCode = 'WELCOME50' AND UsedCount < UsageLimit AND ExpiryDate >= '2024-01-01'`.",
        "tsql": "SELECT VoucherID, VoucherCode, DiscountAmount, MinOrderValue\nFROM Vouchers\nWHERE VoucherCode = 'WELCOME50'\n  AND UsedCount < UsageLimit\n  AND ExpiryDate >= '2024-01-01';",
        "sqlite": "SELECT VoucherID, VoucherCode, DiscountAmount, MinOrderValue\nFROM Vouchers\nWHERE VoucherCode = 'WELCOME50'\n  AND UsedCount < UsageLimit\n  AND ExpiryDate >= '2024-01-01';",
        "expected": {
          "cols": [
            "VoucherID",
            "VoucherCode",
            "DiscountAmount",
            "MinOrderValue"
          ],
          "rows": [
            [
              1,
              "WELCOME50",
              50000,
              200000
            ]
          ]
        }
      },
      {
        "id": "FS-CH11-08",
        "level": "Trung cấp (Whitelist Validation cho cột sắp xếp động bằng CASE WHEN)",
        "pattern": "ORDER BY CASE WHEN @SortCol = 'Price' THEN Price ELSE FruitID END",
        "title": "Bài 11.8: Chống SQL Injection ở mệnh đề ORDER BY bằng kỹ thuật CASE WHEN Whitelist",
        "question": "Vì không thể truyền tên cột trực tiếp làm tham số `@param` sau `ORDER BY`, cách chống SQL Injection chuẩn khi người dùng chọn kiểu sắp xếp (`'PRICE_ASC'`) là dùng biểu thức `CASE WHEN`. Hãy viết truy vấn lấy `FruitID`, `FruitName`, `Price` của danh mục `1`, sắp xếp bằng `ORDER BY CASE WHEN 'PRICE_ASC' = 'PRICE_ASC' THEN Price ELSE FruitID END ASC`.",
        "hint": "Biểu thức `CASE WHEN` đảm bảo không có bất kỳ đoạn mã độc nào có thể tiêm vào sau `ORDER BY`.",
        "tsql": "SELECT FruitID, FruitName, Price\nFROM Fruits\nWHERE CategoryID = 1\nORDER BY CASE WHEN 'PRICE_ASC' = 'PRICE_ASC' THEN Price ELSE FruitID END ASC;",
        "sqlite": "SELECT FruitID, FruitName, Price\nFROM Fruits\nWHERE CategoryID = 1\nORDER BY CASE WHEN 'PRICE_ASC' = 'PRICE_ASC' THEN Price ELSE FruitID END ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price"
          ],
          "rows": [
            [
              2,
              "Bưởi Da Xanh",
              70000
            ],
            [
              3,
              "Xoài Cát Hòa Lộc",
              80000
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              95000
            ],
            [
              1,
              "Sầu Riêng Ri6",
              150000
            ]
          ]
        }
      },
      {
        "id": "FS-CH11-09",
        "level": "Nâng cao (Kiểm toán bảo mật: Phát hiện đơn hàng đã giao nhưng chưa có giao dịch thanh toán)",
        "pattern": "Orders o LEFT JOIN PaymentTransactions pt ... WHERE o.Status = 'Đã giao' AND pt.TransactionID IS NULL",
        "title": "Bài 11.9: Kiểm toán thất thoát tài chính: Kiểm tra các đơn hàng và trạng thái thanh toán tương ứng",
        "question": "Bộ phận Kiểm toán nội bộ cần rà soát tất cả các đơn hàng (`OrderID`, `CustomerID`, `TotalAmount`, `Status`) kèm theo tổng số tiền đã thu trong `PaymentTransactions` (`PaidAmount = COALESCE(SUM(pt.Amount), 0)`) và trạng thái đối soát `AuditStatus`: Nếu `COALESCE(SUM(pt.Amount), 0) >= o.TotalAmount` là `'Đã thu đủ'`, nếu `o.Status = 'Đã hủy'` là `'Đơn hủy'`, ngược lại là `'Chưa thu tiền'`. Sắp xếp theo `OrderID` tăng dần.",
        "hint": "Nối `Orders o LEFT JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID` và gom nhóm theo `o.OrderID, o.CustomerID, o.TotalAmount, o.Status`.",
        "tsql": "SELECT o.OrderID, o.CustomerID, o.TotalAmount, o.Status,\n       COALESCE(SUM(pt.Amount), 0) AS PaidAmount,\n       CASE\n           WHEN COALESCE(SUM(pt.Amount), 0) >= o.TotalAmount THEN N'Đã thu đủ'\n           WHEN o.Status = N'Đã hủy' THEN N'Đơn hủy'\n           ELSE N'Chưa thu tiền'\n       END AS AuditStatus\nFROM Orders o\nLEFT JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID\nGROUP BY o.OrderID, o.CustomerID, o.TotalAmount, o.Status\nORDER BY o.OrderID ASC;",
        "sqlite": "SELECT o.OrderID, o.CustomerID, o.TotalAmount, o.Status,\n       COALESCE(SUM(pt.Amount), 0) AS PaidAmount,\n       CASE\n           WHEN COALESCE(SUM(pt.Amount), 0) >= o.TotalAmount THEN 'Đã thu đủ'\n           WHEN o.Status = 'Đã hủy' THEN 'Đơn hủy'\n           ELSE 'Chưa thu tiền'\n       END AS AuditStatus\nFROM Orders o\nLEFT JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID\nGROUP BY o.OrderID, o.CustomerID, o.TotalAmount, o.Status\nORDER BY o.OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "TotalAmount",
            "Status",
            "PaidAmount",
            "AuditStatus"
          ],
          "rows": [
            [
              1,
              1,
              850000,
              "Đã giao",
              850000,
              "Đã thu đủ"
            ],
            [
              2,
              2,
              180000,
              "Đã giao",
              200000,
              "Đã thu đủ"
            ],
            [
              3,
              3,
              150000,
              "Đã giao",
              150000,
              "Đã thu đủ"
            ],
            [
              4,
              4,
              850000,
              "Đã giao",
              850000,
              "Đã thu đủ"
            ],
            [
              5,
              1,
              2500000,
              "Đã giao",
              2500000,
              "Đã thu đủ"
            ],
            [
              6,
              5,
              300000,
              "Đã giao",
              300000,
              "Đã thu đủ"
            ],
            [
              7,
              6,
              180000,
              "Đã hủy",
              0,
              "Đơn hủy"
            ],
            [
              8,
              1,
              200000,
              "Đang giao",
              0,
              "Chưa thu tiền"
            ],
            [
              9,
              4,
              400000,
              "Chờ xử lý",
              0,
              "Chưa thu tiền"
            ],
            [
              10,
              7,
              95000,
              "Chờ xử lý",
              0,
              "Chưa thu tiền"
            ]
          ]
        }
      },
      {
        "id": "FS-CH11-10",
        "level": "Thực chiến (Kiểm toán điều kiện áp dụng Voucher: Đơn hàng có đạt MinOrderValue hay không?)",
        "pattern": "Kiểm tra GrossAmount >= v.MinOrderValue trên các đơn có dùng Voucher",
        "title": "Bài 11.10: Kiểm toán gian lận mã giảm giá: Kiểm tra các đơn có áp Voucher xem tổng tiền hàng gốc có thỏa MinOrderValue không",
        "question": "Hãy kiểm tra tất cả các đơn hàng có sử dụng Voucher (`o.VoucherID IS NOT NULL`): Lấy ra `OrderID`, `VoucherCode`, tổng tiền hàng gốc trước giảm (`GrossAmount = SUM(od.SubTotal)`), giá trị đơn tối thiểu của mã (`MinOrderValue`), và kết quả kiểm toán `PolicyCheck` (`'Hợp lệ'` nếu `SUM(od.SubTotal) >= v.MinOrderValue`, ngược lại `'Vi phạm điều kiện'`). Sắp xếp theo `OrderID` tăng dần.",
        "hint": "Nối `Orders o`, `OrderDetails od` và `Vouchers v`, gom nhóm theo `o.OrderID, v.VoucherCode, v.MinOrderValue`.",
        "tsql": "SELECT o.OrderID, v.VoucherCode,\n       SUM(od.SubTotal) AS GrossAmount,\n       v.MinOrderValue,\n       CASE\n           WHEN SUM(od.SubTotal) >= v.MinOrderValue THEN N'Hợp lệ'\n           ELSE N'Vi phạm điều kiện'\n       END AS PolicyCheck\nFROM Orders o\nINNER JOIN OrderDetails od ON o.OrderID = od.OrderID\nINNER JOIN Vouchers v ON o.VoucherID = v.VoucherID\nGROUP BY o.OrderID, v.VoucherCode, v.MinOrderValue\nORDER BY o.OrderID ASC;",
        "sqlite": "SELECT o.OrderID, v.VoucherCode,\n       SUM(od.SubTotal) AS GrossAmount,\n       v.MinOrderValue,\n       CASE\n           WHEN SUM(od.SubTotal) >= v.MinOrderValue THEN 'Hợp lệ'\n           ELSE 'Vi phạm điều kiện'\n       END AS PolicyCheck\nFROM Orders o\nINNER JOIN OrderDetails od ON o.OrderID = od.OrderID\nINNER JOIN Vouchers v ON o.VoucherID = v.VoucherID\nGROUP BY o.OrderID, v.VoucherCode, v.MinOrderValue\nORDER BY o.OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "VoucherCode",
            "GrossAmount",
            "MinOrderValue",
            "PolicyCheck"
          ],
          "rows": [
            [
              2,
              "WELCOME50",
              230000,
              200000,
              "Hợp lệ"
            ],
            [
              4,
              "VIP100",
              950000,
              500000,
              "Hợp lệ"
            ],
            [
              5,
              "VIP100",
              2600000,
              500000,
              "Hợp lệ"
            ],
            [
              6,
              "WELCOME50",
              350000,
              200000,
              "Hợp lệ"
            ],
            [
              9,
              "WELCOME50",
              450000,
              200000,
              "Hợp lệ"
            ]
          ]
        }
      }
    ]
  },
  {
    "chapter_id": "ch12",
    "chapter_num": 12,
    "chapter_title": "Chương 12: Kết Nối Backend (Java JDBC/JPA, C# ADO.NET/EF Core, Dapper), N+1 Query & Keyset Pagination",
    "pedagogy_goal": "Rèn phản xạ viết câu SQL tối ưu cho Backend API: khử triệt để lỗi N+1 Query bằng Eager Projection, phẳng hóa DTO (Data Transfer Object), phân trang Keyset/Seek Pagination tốc độ O(1) và chuẩn bị dữ liệu JSON cho REST API.",
    "exercises": [
      {
        "id": "FS-CH12-01",
        "level": "Cơ bản (Mẫu A1 - Khử lỗi N+1 Query cho API Danh sách Trái cây kèm Danh mục)",
        "pattern": "Gộp 1 câu SELECT ... INNER JOIN thay vì 1 câu lấy Categories + N câu lấy Fruits",
        "title": "Bài 12.1: Viết câu truy vấn Eager Projection khử lỗi N+1 cho API GET /api/fruits",
        "question": "Thay vì để ORM rơi vào bẫy N+1 (chạy 1 câu lấy 14 `Fruits` rồi chạy thêm 14 câu lấy `Categories`), hãy viết 1 câu truy vấn phẳng hóa (DTO Projection) trả về: `FruitID`, `FruitName`, `Price`, `Unit`, `CategoryID`, `CategoryName` cho tất cả trái cây đang hoạt động (`IsActive = 1`). Sắp xếp theo `FruitID` tăng dần.",
        "hint": "Dùng `INNER JOIN Categories c ON f.CategoryID = c.CategoryID` và chỉ lấy đúng các cột DTO cần thiết.",
        "tsql": "SELECT f.FruitID, f.FruitName, f.Price, f.Unit,\n       c.CategoryID, c.CategoryName\nFROM Fruits f\nINNER JOIN Categories c ON f.CategoryID = c.CategoryID\nWHERE f.IsActive = 1\nORDER BY f.FruitID ASC;",
        "sqlite": "SELECT f.FruitID, f.FruitName, f.Price, f.Unit,\n       c.CategoryID, c.CategoryName\nFROM Fruits f\nINNER JOIN Categories c ON f.CategoryID = c.CategoryID\nWHERE f.IsActive = 1\nORDER BY f.FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price",
            "Unit",
            "CategoryID",
            "CategoryName"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              150000,
              "Kg",
              1,
              "Đặc sản Miền Tây"
            ],
            [
              2,
              "Bưởi Da Xanh",
              70000,
              "Quả",
              1,
              "Đặc sản Miền Tây"
            ],
            [
              3,
              "Xoài Cát Hòa Lộc",
              80000,
              "Kg",
              1,
              "Đặc sản Miền Tây"
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              95000,
              "Kg",
              1,
              "Đặc sản Miền Tây"
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              850000,
              "Chùm",
              2,
              "Trái cây Nhập khẩu"
            ],
            [
              6,
              "Táo Envy",
              250000,
              "Kg",
              2,
              "Trái cây Nhập khẩu"
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              450000,
              "Kg",
              2,
              "Trái cây Nhập khẩu"
            ],
            [
              8,
              "Kiwi Vàng",
              180000,
              "Hộp",
              2,
              "Trái cây Nhập khẩu"
            ],
            [
              9,
              "Dâu Tây Mộc Châu",
              200000,
              "Hộp",
              3,
              "Quả mọng (Berries)"
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              350000,
              "Hộp",
              3,
              "Quả mọng (Berries)"
            ],
            [
              11,
              "Mâm Xôi Đen",
              320000,
              "Hộp",
              3,
              "Quả mọng (Berries)"
            ],
            [
              12,
              "Nho khô Ninh Thuận",
              120000,
              "Hũ",
              4,
              "Trái cây sấy"
            ],
            [
              13,
              "Mít sấy giòn",
              60000,
              "Bịch",
              4,
              "Trái cây sấy"
            ],
            [
              14,
              "Hạt Mắc Ca",
              280000,
              "Hũ",
              5,
              "Quả hạch (Nuts)"
            ]
          ]
        }
      },
      {
        "id": "FS-CH12-02",
        "level": "Cơ bản (Mẫu A2 - Khử lỗi N+1 Query cho API Lịch sử Đơn hàng kèm Khách hàng & Voucher)",
        "pattern": "Gộp 1 câu SELECT ... INNER JOIN Customers LEFT JOIN Vouchers (Cùng cơ chế Bài 12.1 nhưng cho API GET /api/orders)",
        "title": "Bài 12.2: Viết câu truy vấn DTO Projection khử lỗi N+1 cho API GET /api/orders",
        "question": "Áp dụng y hệt phản xạ khử N+1 của Bài 12.1 cho API danh sách đơn hàng: Trong 1 câu SQL duy nhất, hãy lấy ra `OrderID`, `OrderDate`, `TotalAmount`, `Status`, `CustomerName` (`c.FullName`), `CustomerPhone` (`c.PhoneNumber`), và `VoucherCode` (`COALESCE(v.VoucherCode, 'NONE')`). Sắp xếp theo `OrderID` giảm dần.",
        "hint": "Chú ý dùng `LEFT JOIN Vouchers v` vì nhiều đơn hàng không áp mã giảm giá (`VoucherID IS NULL`).",
        "tsql": "SELECT o.OrderID, o.OrderDate, o.TotalAmount, o.Status,\n       c.FullName AS CustomerName, c.PhoneNumber AS CustomerPhone,\n       COALESCE(v.VoucherCode, 'NONE') AS VoucherCode\nFROM Orders o\nINNER JOIN Customers c ON o.CustomerID = c.CustomerID\nLEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID\nORDER BY o.OrderID DESC;",
        "sqlite": "SELECT o.OrderID, o.OrderDate, o.TotalAmount, o.Status,\n       c.FullName AS CustomerName, c.PhoneNumber AS CustomerPhone,\n       COALESCE(v.VoucherCode, 'NONE') AS VoucherCode\nFROM Orders o\nINNER JOIN Customers c ON o.CustomerID = c.CustomerID\nLEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID\nORDER BY o.OrderID DESC;",
        "expected": {
          "cols": [
            "OrderID",
            "OrderDate",
            "TotalAmount",
            "Status",
            "CustomerName",
            "CustomerPhone",
            "VoucherCode"
          ],
          "rows": [
            [
              10,
              "2024-03-10 14:00:00",
              95000,
              "Chờ xử lý",
              "Tiểu Chiêu",
              "0907777888",
              "NONE"
            ],
            [
              9,
              "2024-03-05 10:00:00",
              400000,
              "Chờ xử lý",
              "Triệu Mẫn",
              "0904444555",
              "WELCOME50"
            ],
            [
              8,
              "2024-03-01 15:10:00",
              200000,
              "Đang giao",
              "Võ Thành Tài",
              "0901111222",
              "NONE"
            ],
            [
              7,
              "2024-02-14 11:20:00",
              180000,
              "Đã hủy",
              "Ân Ly",
              "0906666777",
              "NONE"
            ],
            [
              6,
              "2024-01-10 08:30:00",
              300000,
              "Đã giao",
              "Chu Chỉ Nhược",
              "0905555666",
              "WELCOME50"
            ],
            [
              5,
              "2023-12-24 19:00:00",
              2500000,
              "Đã giao",
              "Võ Thành Tài",
              "0901111222",
              "VIP100"
            ],
            [
              4,
              "2023-08-08 16:45:00",
              850000,
              "Đã giao",
              "Triệu Mẫn",
              "0904444555",
              "VIP100"
            ],
            [
              3,
              "2023-06-15 09:00:00",
              150000,
              "Đã giao",
              "Trương Vô Kỵ",
              "0903333444",
              "NONE"
            ],
            [
              2,
              "2023-04-20 14:30:00",
              180000,
              "Đã giao",
              "Nguyễn Thị Lệ",
              "0902222333",
              "WELCOME50"
            ],
            [
              1,
              "2023-02-14 10:15:00",
              850000,
              "Đã giao",
              "Võ Thành Tài",
              "0901111222",
              "NONE"
            ]
          ]
        }
      },
      {
        "id": "FS-CH12-03",
        "level": "Cơ bản (Mẫu A3 - Khử lỗi N+1 Query khi lấy Danh sách Danh mục kèm số lượng sản phẩm)",
        "pattern": "SELECT c.*, COUNT(f.FruitID) ... LEFT JOIN ... GROUP BY ... (Cùng cơ chế khử N+1 cho API GET /api/categories/summary)",
        "title": "Bài 12.3: Khử lỗi `category.getFruits().size()` gây N+1 trong Hibernate/EF Core",
        "question": "Trong Java JPA hoặc C# EF Core, gọi `category.getFruits().size()` trong vòng lặp sẽ bắn ra 5 câu `SELECT COUNT(*)` riêng lẻ. Hãy viết 1 câu SQL duy nhất cho API `/api/categories/summary` lấy ra `CategoryID`, `CategoryName`, `ProductCount` (`COUNT(f.FruitID)`) và `MinPrice` (`COALESCE(MIN(f.Price), 0)`), `MaxPrice` (`COALESCE(MAX(f.Price), 0)`). Sắp xếp theo `CategoryID` tăng dần.",
        "hint": "Dùng `Categories c LEFT JOIN Fruits f ON c.CategoryID = f.CategoryID GROUP BY c.CategoryID, c.CategoryName`.",
        "tsql": "SELECT c.CategoryID, c.CategoryName,\n       COUNT(f.FruitID) AS ProductCount,\n       COALESCE(MIN(f.Price), 0) AS MinPrice,\n       COALESCE(MAX(f.Price), 0) AS MaxPrice\nFROM Categories c\nLEFT JOIN Fruits f ON c.CategoryID = f.CategoryID\nGROUP BY c.CategoryID, c.CategoryName\nORDER BY c.CategoryID ASC;",
        "sqlite": "SELECT c.CategoryID, c.CategoryName,\n       COUNT(f.FruitID) AS ProductCount,\n       COALESCE(MIN(f.Price), 0) AS MinPrice,\n       COALESCE(MAX(f.Price), 0) AS MaxPrice\nFROM Categories c\nLEFT JOIN Fruits f ON c.CategoryID = f.CategoryID\nGROUP BY c.CategoryID, c.CategoryName\nORDER BY c.CategoryID ASC;",
        "expected": {
          "cols": [
            "CategoryID",
            "CategoryName",
            "ProductCount",
            "MinPrice",
            "MaxPrice"
          ],
          "rows": [
            [
              1,
              "Đặc sản Miền Tây",
              4,
              70000,
              150000
            ],
            [
              2,
              "Trái cây Nhập khẩu",
              4,
              180000,
              850000
            ],
            [
              3,
              "Quả mọng (Berries)",
              3,
              200000,
              350000
            ],
            [
              4,
              "Trái cây sấy",
              2,
              60000,
              120000
            ],
            [
              5,
              "Quả hạch (Nuts)",
              1,
              280000,
              280000
            ]
          ]
        }
      },
      {
        "id": "FS-CH12-04",
        "level": "Cơ bản (Mẫu B1 - Phân trang Keyset / Seek Pagination theo khóa chính trên bảng Fruits)",
        "pattern": "SELECT ... FROM Table WHERE PK > @LastSeenID ORDER BY PK ASC LIMIT @PageSize;",
        "title": "Bài 12.4: Phân trang Keyset Pagination (Seek Method) trang tiếp theo trên bảng Fruits",
        "question": "Thay vì dùng `OFFSET` gây chậm khi dữ liệu lớn, Backend truyền lên `lastSeenFruitID = 5` và `pageSize = 4`. Hãy viết câu truy vấn Keyset Pagination lấy 4 loại trái cây tiếp theo có `FruitID > 5` (gồm `FruitID`, `FruitName`, `Price`), sắp xếp theo `FruitID` tăng dần.",
        "hint": "Trong T-SQL dùng `SELECT TOP 4 ... WHERE FruitID > 5 ORDER BY FruitID ASC`. Trong SQLite dùng `LIMIT 4`.",
        "tsql": "SELECT TOP 4 FruitID, FruitName, Price\nFROM Fruits\nWHERE FruitID > 5\nORDER BY FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName, Price\nFROM Fruits\nWHERE FruitID > 5\nORDER BY FruitID ASC\nLIMIT 4;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price"
          ],
          "rows": [
            [
              6,
              "Táo Envy",
              250000
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              450000
            ],
            [
              8,
              "Kiwi Vàng",
              180000
            ],
            [
              9,
              "Dâu Tây Mộc Châu",
              200000
            ]
          ]
        }
      },
      {
        "id": "FS-CH12-05",
        "level": "Cơ bản (Mẫu B2 - Phân trang Keyset Pagination theo chiều giảm dần trên bảng Orders)",
        "pattern": "SELECT ... FROM Table WHERE PK < @LastSeenID ORDER BY PK DESC LIMIT @PageSize; (Cùng cơ chế Bài 12.4 nhưng cuộn ngược trên Orders)",
        "title": "Bài 12.5: Phân trang Keyset Pagination cuộn Infinite Scroll lịch sử đơn hàng (Bảng Orders)",
        "question": "Áp dụng y hệt kỹ thuật Keyset Pagination của Bài 12.4 cho màn hình Lịch sử đơn hàng (sắp xếp từ mới nhất xuống cũ nhất theo `OrderID DESC`): Giả sử trang 1 đã hiển thị từ đơn 10 xuống đơn 8 (`lastSeenOrderID = 8`). Hãy lấy `3` đơn hàng tiếp theo (`OrderID < 8`), hiển thị `OrderID`, `CustomerID`, `OrderDate`, `TotalAmount`, sắp xếp theo `OrderID` giảm dần.",
        "hint": "Dùng `WHERE OrderID < 8 ORDER BY OrderID DESC LIMIT 3` (hoặc `TOP 3` trong T-SQL).",
        "tsql": "SELECT TOP 3 OrderID, CustomerID, OrderDate, TotalAmount\nFROM Orders\nWHERE OrderID < 8\nORDER BY OrderID DESC;",
        "sqlite": "SELECT OrderID, CustomerID, OrderDate, TotalAmount\nFROM Orders\nWHERE OrderID < 8\nORDER BY OrderID DESC\nLIMIT 3;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "OrderDate",
            "TotalAmount"
          ],
          "rows": [
            [
              7,
              6,
              "2024-02-14 11:20:00",
              180000
            ],
            [
              6,
              5,
              "2024-01-10 08:30:00",
              300000
            ],
            [
              5,
              1,
              "2023-12-24 19:00:00",
              2500000
            ]
          ]
        }
      },
      {
        "id": "FS-CH12-06",
        "level": "Cơ bản (Mẫu B3 - Phân trang Keyset Pagination trên cặp cột (Price, FruitID))",
        "pattern": "WHERE Price < @LastPrice OR (Price = @LastPrice AND FruitID > @LastID)",
        "title": "Bài 12.6: Phân trang Keyset Pagination có xử lý đồng hạng (Tie-breaker) theo Giá giảm dần",
        "question": "Khi người dùng sắp xếp trái cây theo `Price DESC, FruitID ASC`, nếu dòng cuối cùng của trang trước là `FruitID = 9` ('Dâu Tây Mộc Châu', `Price = 200000`), hãy dùng điều kiện Keyset chuẩn `WHERE Price < 200000 OR (Price = 200000 AND FruitID > 9)` để lấy ra `4` loại trái cây tiếp theo (`FruitID`, `FruitName`, `Price`), sắp xếp theo `Price DESC, FruitID ASC`.",
        "hint": "Công thức Keyset複合 (Composite Keyset) đảm bảo không bao giờ bị sót hoặc lặp dòng khi có 2 sản phẩm trùng giá!",
        "tsql": "SELECT TOP 4 FruitID, FruitName, Price\nFROM Fruits\nWHERE Price < 200000 OR (Price = 200000 AND FruitID > 9)\nORDER BY Price DESC, FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName, Price\nFROM Fruits\nWHERE Price < 200000 OR (Price = 200000 AND FruitID > 9)\nORDER BY Price DESC, FruitID ASC\nLIMIT 4;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price"
          ],
          "rows": [
            [
              8,
              "Kiwi Vàng",
              180000
            ],
            [
              1,
              "Sầu Riêng Ri6",
              150000
            ],
            [
              12,
              "Nho khô Ninh Thuận",
              120000
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              95000
            ]
          ]
        }
      },
      {
        "id": "FS-CH12-07",
        "level": "Trung cấp (Gom danh sách mặt hàng thành chuỗi tóm tắt cho DTO Đơn hàng)",
        "pattern": "STRING_AGG(f.FruitName, ', ') / GROUP_CONCAT(f.FruitName, ', ')",
        "title": "Bài 12.7: Tạo chuỗi tóm tắt các món hàng trong mỗi đơn (STRING_AGG / GROUP_CONCAT) cho Mobile App",
        "question": "Trên màn hình danh sách đơn hàng của Mobile App, mỗi thẻ đơn hàng cần hiển thị 1 dòng tóm tắt các loại trái cây đã mua (ví dụ `'Xoài Cát Hòa Lộc, Bưởi Da Xanh'`). Hãy kết nối `Orders o`, `OrderDetails od`, `Fruits f`, gom nhóm theo `o.OrderID, o.TotalAmount` và dùng `GROUP_CONCAT(f.FruitName, ', ')` (T-SQL: `STRING_AGG(f.FruitName, ', ')`) đặt tên là `ItemsSummary`. Sắp xếp theo `o.OrderID` tăng dần.",
        "hint": "Hàm `STRING_AGG` (T-SQL) / `GROUP_CONCAT` (SQLite) giúp gom toàn bộ danh sách tên món con lên 1 dòng duy nhất cho Backend DTO!",
        "tsql": "SELECT o.OrderID, o.TotalAmount,\n       STRING_AGG(f.FruitName, N', ') WITHIN GROUP (ORDER BY od.OrderDetailID ASC) AS ItemsSummary\nFROM Orders o\nINNER JOIN OrderDetails od ON o.OrderID = od.OrderID\nINNER JOIN Fruits f ON od.FruitID = f.FruitID\nGROUP BY o.OrderID, o.TotalAmount\nORDER BY o.OrderID ASC;",
        "sqlite": "SELECT o.OrderID, o.TotalAmount,\n       GROUP_CONCAT(f.FruitName, ', ') AS ItemsSummary\nFROM Orders o\nINNER JOIN OrderDetails od ON o.OrderID = od.OrderID\nINNER JOIN Fruits f ON od.FruitID = f.FruitID\nGROUP BY o.OrderID, o.TotalAmount\nORDER BY o.OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "TotalAmount",
            "ItemsSummary"
          ],
          "rows": [
            [
              1,
              850000,
              "Nho Mẫu Đơn Shine Muscat"
            ],
            [
              2,
              180000,
              "Xoài Cát Hòa Lộc, Bưởi Da Xanh"
            ],
            [
              3,
              150000,
              "Sầu Riêng Ri6"
            ],
            [
              4,
              850000,
              "Táo Envy, Cherry Đỏ Thẫm"
            ],
            [
              5,
              2500000,
              "Nho Mẫu Đơn Shine Muscat, Cherry Đỏ Thẫm"
            ],
            [
              6,
              300000,
              "Việt Quất (Blueberry)"
            ],
            [
              7,
              180000,
              "Kiwi Vàng"
            ],
            [
              8,
              200000,
              "Dâu Tây Mộc Châu"
            ],
            [
              9,
              400000,
              "Cherry Đỏ Thẫm"
            ],
            [
              10,
              95000,
              "Măng Cụt Lái Thiêu"
            ]
          ]
        }
      },
      {
        "id": "FS-CH12-08",
        "level": "Trung cấp (Truy vấn Batch Fetching `WHERE ID IN (...)` cho DataLoader / GraphQL)",
        "pattern": "SELECT ... FROM OrderDetails od INNER JOIN Fruits f ... WHERE od.OrderID IN (1, 2, 4, 5)",
        "title": "Bài 12.8: Viết truy vấn Batch Loader nạp chi tiết mặt hàng cho một danh sách OrderID cùng lúc",
        "question": "Khi dùng mẫu thiết kế **Batch Loader** (trong Spring Boot / EF Core / GraphQL DataLoader), sau khi lấy ra danh sách các đơn hàng có giá trị lớn (`OrderID IN (1, 4, 5)`), Backend chỉ bắn ra đúng **1 câu SQL duy nhất** dùng `WHERE od.OrderID IN (1, 4, 5)` để nạp toàn bộ chi tiết món hàng của cả 3 đơn đó. Hãy lấy ra `od.OrderID`, `od.OrderDetailID`, `f.FruitName`, `od.Quantity`, `od.SubTotal`, sắp xếp theo `od.OrderID ASC, od.OrderDetailID ASC`.",
        "hint": "Dùng `WHERE od.OrderID IN (1, 4, 5)` thay vì chạy vòng lặp `for` gọi 3 câu SQL riêng lẻ.",
        "tsql": "SELECT od.OrderID, od.OrderDetailID, f.FruitName, od.Quantity, od.SubTotal\nFROM OrderDetails od\nINNER JOIN Fruits f ON od.FruitID = f.FruitID\nWHERE od.OrderID IN (1, 4, 5)\nORDER BY od.OrderID ASC, od.OrderDetailID ASC;",
        "sqlite": "SELECT od.OrderID, od.OrderDetailID, f.FruitName, od.Quantity, od.SubTotal\nFROM OrderDetails od\nINNER JOIN Fruits f ON od.FruitID = f.FruitID\nWHERE od.OrderID IN (1, 4, 5)\nORDER BY od.OrderID ASC, od.OrderDetailID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "OrderDetailID",
            "FruitName",
            "Quantity",
            "SubTotal"
          ],
          "rows": [
            [
              1,
              1,
              "Nho Mẫu Đơn Shine Muscat",
              1,
              850000
            ],
            [
              4,
              5,
              "Táo Envy",
              2,
              500000
            ],
            [
              4,
              6,
              "Cherry Đỏ Thẫm",
              1,
              450000
            ],
            [
              5,
              7,
              "Nho Mẫu Đơn Shine Muscat",
              2,
              1700000
            ],
            [
              5,
              8,
              "Cherry Đỏ Thẫm",
              2,
              900000
            ]
          ]
        }
      },
      {
        "id": "FS-CH12-09",
        "level": "Nâng cao (Truy vấn trả về cả Dữ liệu trang hiện tại lẫn Tổng số bản ghi TotalCount trong 1 lần gọi DB)",
        "pattern": "COUNT(*) OVER () AS TotalMatchingRows kết hợp với phân trang",
        "title": "Bài 12.9: Kỹ thuật lấy TotalCount ngay trong cùng câu truy vấn phân trang bằng COUNT(*) OVER ()",
        "question": "Để giao diện Web hiển thị thanh phân trang `'Đang xem 1-5 trên tổng số X sản phẩm'` mà không phải chạy 2 câu SQL (`SELECT COUNT(*)` rồi `SELECT ... LIMIT 5`), hãy dùng hàm cửa sổ `COUNT(*) OVER () AS TotalMatchingRows` lấy ra trang đầu tiên (5 dòng đầu) của các loại trái cây đang còn hàng (`StockQuantity > 0`), gồm `FruitID`, `FruitName`, `Price`, `TotalMatchingRows`. Sắp xếp theo `Price DESC, FruitID ASC`.",
        "hint": "`COUNT(*) OVER ()` được tính trước khi cắt `TOP 5` / `LIMIT 5`, nên mỗi dòng trả về đều mang theo tổng số bản ghi thỏa điều kiện `WHERE` (là 13 mặt hàng còn tồn kho).",
        "tsql": "SELECT TOP 5 FruitID, FruitName, Price,\n       COUNT(*) OVER () AS TotalMatchingRows\nFROM Fruits\nWHERE StockQuantity > 0\nORDER BY Price DESC, FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName, Price,\n       COUNT(*) OVER () AS TotalMatchingRows\nFROM Fruits\nWHERE StockQuantity > 0\nORDER BY Price DESC, FruitID ASC\nLIMIT 5;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price",
            "TotalMatchingRows"
          ],
          "rows": [
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              850000,
              13
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              450000,
              13
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              350000,
              13
            ],
            [
              14,
              "Hạt Mắc Ca",
              280000,
              13
            ],
            [
              6,
              "Táo Envy",
              250000,
              13
            ]
          ]
        }
      },
      {
        "id": "FS-CH12-10",
        "level": "Thực chiến (Xây dựng truy vấn Dashboard API 360-độ cho Khách hàng)",
        "pattern": "Tổng hợp thông tin Profile + Tổng đơn + Tổng chi tiêu + Số lượt Review + Hạng đề xuất trong 1 query",
        "title": "Bài 12.10: Xây dựng truy vấn tổng hợp Customer 360° Profile DTO cho Backend Microservice",
        "question": "Viết câu truy vấn cung cấp dữ liệu cho API `GET /api/customers/360-profile` cho tất cả 8 khách hàng: Lấy ra `CustomerID`, `FullName`, `CustomerType`, tổng số đơn hàng (`TotalOrders`), tổng tiền đã mua (`LifetimeValue`), và tổng số đánh giá đã viết (`TotalReviews`). Lưu ý: Không được nhân bản số dòng khi nối cả `Orders` lẫn `Reviews` (hãy dùng Subquery hoặc CTE gom nhóm riêng từng bảng trước khi `LEFT JOIN` vào `Customers`). Sắp xếp theo `LifetimeValue` giảm dần, `CustomerID` tăng dần.",
        "hint": "Nếu `LEFT JOIN Orders` rồi `LEFT JOIN Reviews` trực tiếp trong cùng 1 cấp sẽ bị tích Đề-các (Fan-out Trap)! Hãy gom nhóm `Orders` trong CTE 1 và `Reviews` trong CTE 2 rồi nối vào `Customers`.",
        "tsql": "WITH OrderAgg AS (\n    SELECT CustomerID, COUNT(*) AS TotalOrders, SUM(TotalAmount) AS LifetimeValue\n    FROM Orders\n    GROUP BY CustomerID\n),\nReviewAgg AS (\n    SELECT CustomerID, COUNT(*) AS TotalReviews\n    FROM Reviews\n    GROUP BY CustomerID\n)\nSELECT c.CustomerID, c.FullName, c.CustomerType,\n       COALESCE(oa.TotalOrders, 0) AS TotalOrders,\n       COALESCE(oa.LifetimeValue, 0) AS LifetimeValue,\n       COALESCE(ra.TotalReviews, 0) AS TotalReviews\nFROM Customers c\nLEFT JOIN OrderAgg oa ON c.CustomerID = oa.CustomerID\nLEFT JOIN ReviewAgg ra ON c.CustomerID = ra.CustomerID\nORDER BY LifetimeValue DESC, c.CustomerID ASC;",
        "sqlite": "WITH OrderAgg AS (\n    SELECT CustomerID, COUNT(*) AS TotalOrders, SUM(TotalAmount) AS LifetimeValue\n    FROM Orders\n    GROUP BY CustomerID\n),\nReviewAgg AS (\n    SELECT CustomerID, COUNT(*) AS TotalReviews\n    FROM Reviews\n    GROUP BY CustomerID\n)\nSELECT c.CustomerID, c.FullName, c.CustomerType,\n       COALESCE(oa.TotalOrders, 0) AS TotalOrders,\n       COALESCE(oa.LifetimeValue, 0) AS LifetimeValue,\n       COALESCE(ra.TotalReviews, 0) AS TotalReviews\nFROM Customers c\nLEFT JOIN OrderAgg oa ON c.CustomerID = oa.CustomerID\nLEFT JOIN ReviewAgg ra ON c.CustomerID = ra.CustomerID\nORDER BY LifetimeValue DESC, c.CustomerID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "CustomerType",
            "TotalOrders",
            "LifetimeValue",
            "TotalReviews"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              "VIP",
              3,
              3550000,
              1
            ],
            [
              4,
              "Triệu Mẫn",
              "VIP",
              2,
              1250000,
              1
            ],
            [
              5,
              "Chu Chỉ Nhược",
              "Standard",
              1,
              300000,
              1
            ],
            [
              2,
              "Nguyễn Thị Lệ",
              "Standard",
              1,
              180000,
              1
            ],
            [
              6,
              "Ân Ly",
              "Standard",
              1,
              180000,
              0
            ],
            [
              3,
              "Trương Vô Kỵ",
              "Standard",
              1,
              150000,
              0
            ],
            [
              7,
              "Tiểu Chiêu",
              "Standard",
              1,
              95000,
              0
            ],
            [
              8,
              "Dương Quá",
              "Standard",
              0,
              0,
              0
            ]
          ]
        }
      }
    ]
  },
  {
    "chapter_id": "ch13",
    "chapter_num": 13,
    "chapter_title": "Chương 13: T-SQL Nâng Cao: Xử Lý JSON, PIVOT Báo Cáo Chéo, CROSS APPLY & Phân Tích Chuỗi Thời Gian",
    "pedagogy_goal": "Rèn phản xạ bóc tách dữ liệu bán cấu trúc từ cột `Fruits.AttributesJSON` (JSON_VALUE / json_extract), xoay bảng báo cáo đa chiều (PIVOT / Conditional CASE WHEN), lấy Top N mỗi nhóm bằng CROSS APPLY / Correlated Subquery và phân tích Cohort/Time-series.",
    "exercises": [
      {
        "id": "FS-CH13-01",
        "level": "Cơ bản (Mẫu A1 - Trích xuất thuộc tính JSON $.Taste từ cột AttributesJSON)",
        "pattern": "JSON_VALUE(AttributesJSON, '$.Taste') / json_extract(AttributesJSON, '$.Taste')",
        "title": "Bài 13.1: Bóc tách hương vị ($.Taste) từ cột AttributesJSON của bảng Fruits",
        "question": "Bảng `Fruits` lưu trữ thuộc tính động trong cột `AttributesJSON`. Hãy trích xuất giá trị khóa `'$.Taste'` đặt tên là `Taste` cùng với `FruitID`, `FruitName`, `Price` cho tất cả các loại trái cây có `AttributesJSON IS NOT NULL`. Sắp xếp theo `FruitID` tăng dần.",
        "hint": "Trong T-SQL dùng `JSON_VALUE(AttributesJSON, '$.Taste')`. Trong SQLite dùng `json_extract(AttributesJSON, '$.Taste')`.",
        "tsql": "SELECT FruitID, FruitName, Price,\n       JSON_VALUE(AttributesJSON, '$.Taste') AS Taste\nFROM Fruits\nWHERE AttributesJSON IS NOT NULL\nORDER BY FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName, Price,\n       json_extract(AttributesJSON, '$.Taste') AS Taste\nFROM Fruits\nWHERE AttributesJSON IS NOT NULL\nORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price",
            "Taste"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              150000,
              "Sweet"
            ],
            [
              2,
              "Bưởi Da Xanh",
              70000,
              "Sour"
            ],
            [
              3,
              "Xoài Cát Hòa Lộc",
              80000,
              "Sweet"
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              95000,
              "Sweet-Sour"
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              850000,
              "Very Sweet"
            ],
            [
              6,
              "Táo Envy",
              250000,
              "Crisp Sweet"
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              450000,
              "Sweet"
            ],
            [
              8,
              "Kiwi Vàng",
              180000,
              "Sweet-Sour"
            ],
            [
              9,
              "Dâu Tây Mộc Châu",
              200000,
              "Sour"
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              350000,
              "Sweet-Sour"
            ],
            [
              11,
              "Mâm Xôi Đen",
              320000,
              "Sour"
            ],
            [
              14,
              "Hạt Mắc Ca",
              280000,
              "Rich"
            ]
          ]
        }
      },
      {
        "id": "FS-CH13-02",
        "level": "Cơ bản (Mẫu A2 - Trích xuất thuộc tính JSON $.Color và lọc theo giá trị JSON)",
        "pattern": "JSON_VALUE(AttributesJSON, '$.Color') / json_extract(AttributesJSON, '$.Color') (Cùng cơ chế Bài 13.1 nhưng trích xuất $.Color)",
        "title": "Bài 13.2: Bóc tách màu sắc ($.Color) từ cột AttributesJSON và lọc các loại quả có thông tin màu sắc",
        "question": "Áp dụng y hệt cơ chế trích xuất JSON của Bài 13.1 nhưng với khóa `'$.Color'`: Hãy lấy ra `FruitID`, `FruitName`, `Origin` và màu sắc `FruitColor` (`json_extract(AttributesJSON, '$.Color')` / `JSON_VALUE(AttributesJSON, '$.Color')`) của những loại trái cây có khai báo khóa `'$.Color'` (`IS NOT NULL`). Sắp xếp theo `FruitID` tăng dần.",
        "hint": "Lọc `WHERE json_extract(AttributesJSON, '$.Color') IS NOT NULL` (hoặc `JSON_VALUE(AttributesJSON, '$.Color') IS NOT NULL`).",
        "tsql": "SELECT FruitID, FruitName, Origin,\n       JSON_VALUE(AttributesJSON, '$.Color') AS FruitColor\nFROM Fruits\nWHERE JSON_VALUE(AttributesJSON, '$.Color') IS NOT NULL\nORDER BY FruitID ASC;",
        "sqlite": "SELECT FruitID, FruitName, Origin,\n       json_extract(AttributesJSON, '$.Color') AS FruitColor\nFROM Fruits\nWHERE json_extract(AttributesJSON, '$.Color') IS NOT NULL\nORDER BY FruitID ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Origin",
            "FruitColor"
          ],
          "rows": [
            [
              1,
              "Sầu Riêng Ri6",
              "Bến Tre",
              "Yellow"
            ],
            [
              2,
              "Bưởi Da Xanh",
              "Bến Tre",
              "Green"
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              "Bình Dương",
              "Purple"
            ],
            [
              6,
              "Táo Envy",
              "Mỹ",
              "Red"
            ],
            [
              7,
              "Cherry Đỏ Thẫm",
              "Úc",
              "Dark Red"
            ],
            [
              9,
              "Dâu Tây Mộc Châu",
              "Sơn La",
              "Red"
            ]
          ]
        }
      },
      {
        "id": "FS-CH13-03",
        "level": "Cơ bản (Mẫu A3 - Lọc các loại trái cây có vị Chua 'Sour' hoặc 'Sweet-Sour' trong JSON)",
        "pattern": "WHERE json_extract(AttributesJSON, '$.Taste') IN ('Sour', 'Sweet-Sour') (Cùng cơ chế JSON trên khóa $.Taste)",
        "title": "Bài 13.3: Lọc danh sách trái cây có vị Chua hoặc Chua ngọt từ dữ liệu JSON",
        "question": "Tiếp tục phản xạ truy vấn JSON: Hãy lấy ra `FruitID`, `FruitName`, `Price` và `Taste` của những loại trái cây có thuộc tính `'$.Taste'` trong `AttributesJSON` là `'Sour'` hoặc `'Sweet-Sour'`. Sắp xếp theo `Price` tăng dần.",
        "hint": "Dùng `WHERE json_extract(AttributesJSON, '$.Taste') IN ('Sour', 'Sweet-Sour')`.",
        "tsql": "SELECT FruitID, FruitName, Price,\n       JSON_VALUE(AttributesJSON, '$.Taste') AS Taste\nFROM Fruits\nWHERE JSON_VALUE(AttributesJSON, '$.Taste') IN ('Sour', 'Sweet-Sour')\nORDER BY Price ASC;",
        "sqlite": "SELECT FruitID, FruitName, Price,\n       json_extract(AttributesJSON, '$.Taste') AS Taste\nFROM Fruits\nWHERE json_extract(AttributesJSON, '$.Taste') IN ('Sour', 'Sweet-Sour')\nORDER BY Price ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Price",
            "Taste"
          ],
          "rows": [
            [
              2,
              "Bưởi Da Xanh",
              70000,
              "Sour"
            ],
            [
              4,
              "Măng Cụt Lái Thiêu",
              95000,
              "Sweet-Sour"
            ],
            [
              8,
              "Kiwi Vàng",
              180000,
              "Sweet-Sour"
            ],
            [
              9,
              "Dâu Tây Mộc Châu",
              200000,
              "Sour"
            ],
            [
              11,
              "Mâm Xôi Đen",
              320000,
              "Sour"
            ],
            [
              10,
              "Việt Quất (Blueberry)",
              350000,
              "Sweet-Sour"
            ]
          ]
        }
      },
      {
        "id": "FS-CH13-04",
        "level": "Cơ bản (Mẫu B1 - Xoay bảng PIVOT doanh thu theo Trạng thái đơn hàng)",
        "pattern": "SUM(CASE WHEN Col = 'Val1' THEN Amount ELSE 0 END) AS Val1_Col",
        "title": "Bài 13.4: Xoay bảng (PIVOT) doanh thu của từng Nhân viên bán hàng theo 4 cột Trạng thái đơn hàng",
        "question": "Sử dụng kỹ thuật Conditional Aggregation (hoặc `PIVOT`), hãy tạo báo cáo chéo cho từng nhân viên có đơn hàng (`EmployeeID`, `FullName`): hiển thị doanh thu ở 4 cột trạng thái: `DeliveredRev` (`Status = 'Đã giao'`), `ShippingRev` (`Status = 'Đang giao'`), `PendingRev` (`Status = 'Chờ xử lý'`), và `CancelledRev` (`Status = 'Đã hủy'`). Sắp xếp theo `EmployeeID` tăng dần.",
        "hint": "Dùng `SUM(CASE WHEN o.Status = 'Đã giao' THEN o.TotalAmount ELSE 0 END) AS DeliveredRev` cho từng cột.",
        "tsql": "SELECT e.EmployeeID, e.FullName,\n       SUM(CASE WHEN o.Status = N'Đã giao' THEN o.TotalAmount ELSE 0 END) AS DeliveredRev,\n       SUM(CASE WHEN o.Status = N'Đang giao' THEN o.TotalAmount ELSE 0 END) AS ShippingRev,\n       SUM(CASE WHEN o.Status = N'Chờ xử lý' THEN o.TotalAmount ELSE 0 END) AS PendingRev,\n       SUM(CASE WHEN o.Status = N'Đã hủy' THEN o.TotalAmount ELSE 0 END) AS CancelledRev\nFROM Employees e\nINNER JOIN Orders o ON e.EmployeeID = o.EmployeeID\nGROUP BY e.EmployeeID, e.FullName\nORDER BY e.EmployeeID ASC;",
        "sqlite": "SELECT e.EmployeeID, e.FullName,\n       SUM(CASE WHEN o.Status = 'Đã giao' THEN o.TotalAmount ELSE 0 END) AS DeliveredRev,\n       SUM(CASE WHEN o.Status = 'Đang giao' THEN o.TotalAmount ELSE 0 END) AS ShippingRev,\n       SUM(CASE WHEN o.Status = 'Chờ xử lý' THEN o.TotalAmount ELSE 0 END) AS PendingRev,\n       SUM(CASE WHEN o.Status = 'Đã hủy' THEN o.TotalAmount ELSE 0 END) AS CancelledRev\nFROM Employees e\nINNER JOIN Orders o ON e.EmployeeID = o.EmployeeID\nGROUP BY e.EmployeeID, e.FullName\nORDER BY e.EmployeeID ASC;",
        "expected": {
          "cols": [
            "EmployeeID",
            "FullName",
            "DeliveredRev",
            "ShippingRev",
            "PendingRev",
            "CancelledRev"
          ],
          "rows": [
            [
              6,
              "Hoàng Cúc",
              3530000,
              200000,
              95000,
              180000
            ],
            [
              7,
              "Đinh Hợi",
              1300000,
              0,
              400000,
              0
            ]
          ]
        }
      },
      {
        "id": "FS-CH13-05",
        "level": "Cơ bản (Mẫu B2 - Xoay bảng PIVOT doanh thu theo Năm 2023 vs 2024 cho từng Khách hàng)",
        "pattern": "SUM(CASE WHEN Year = 2023 THEN ... END) AS Rev2023, SUM(CASE WHEN Year = 2024 THEN ... END) AS Rev2024 (Cùng cơ chế PIVOT Bài 13.4)",
        "title": "Bài 13.5: Xoay bảng (PIVOT) so sánh chi tiêu năm 2023 và năm 2024 của từng khách hàng",
        "question": "Áp dụng y hệt kỹ thuật xoay cột `PIVOT` của Bài 13.4 nhưng theo trục thời gian (`2023` vs `2024`) cho các khách hàng có đặt đơn: Lấy ra `CustomerID`, `FullName`, tổng tiền đơn năm 2023 (`Rev2023`), tổng tiền đơn năm 2024 (`Rev2024`), và tổng cộng 2 năm (`TotalRev`). Sắp xếp theo `TotalRev` giảm dần.",
        "hint": "Dùng `SUM(CASE WHEN OrderDate >= '2023-01-01' AND OrderDate < '2024-01-01' THEN o.TotalAmount ELSE 0 END) AS Rev2023` (vừa xoay bảng PIVOT vừa chuẩn SARGable!).",
        "tsql": "SELECT c.CustomerID, c.FullName,\n       SUM(CASE WHEN o.OrderDate >= '2023-01-01' AND o.OrderDate < '2024-01-01' THEN o.TotalAmount ELSE 0 END) AS Rev2023,\n       SUM(CASE WHEN o.OrderDate >= '2024-01-01' AND o.OrderDate < '2025-01-01' THEN o.TotalAmount ELSE 0 END) AS Rev2024,\n       SUM(o.TotalAmount) AS TotalRev\nFROM Customers c\nINNER JOIN Orders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID, c.FullName\nORDER BY TotalRev DESC;",
        "sqlite": "SELECT c.CustomerID, c.FullName,\n       SUM(CASE WHEN o.OrderDate >= '2023-01-01' AND o.OrderDate < '2024-01-01' THEN o.TotalAmount ELSE 0 END) AS Rev2023,\n       SUM(CASE WHEN o.OrderDate >= '2024-01-01' AND o.OrderDate < '2025-01-01' THEN o.TotalAmount ELSE 0 END) AS Rev2024,\n       SUM(o.TotalAmount) AS TotalRev\nFROM Customers c\nINNER JOIN Orders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID, c.FullName\nORDER BY TotalRev DESC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "Rev2023",
            "Rev2024",
            "TotalRev"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              3350000,
              200000,
              3550000
            ],
            [
              4,
              "Triệu Mẫn",
              850000,
              400000,
              1250000
            ],
            [
              5,
              "Chu Chỉ Nhược",
              0,
              300000,
              300000
            ],
            [
              2,
              "Nguyễn Thị Lệ",
              180000,
              0,
              180000
            ],
            [
              6,
              "Ân Ly",
              0,
              180000,
              180000
            ],
            [
              3,
              "Trương Vô Kỵ",
              150000,
              0,
              150000
            ],
            [
              7,
              "Tiểu Chiêu",
              0,
              95000,
              95000
            ]
          ]
        }
      },
      {
        "id": "FS-CH13-06",
        "level": "Cơ bản (Mẫu B3 - Xoay bảng PIVOT số tiền thu được theo Phương thức thanh toán cho từng Nhân viên)",
        "pattern": "SUM(CASE WHEN PaymentMethod = 'VNPAY' THEN ... END) (Cùng cơ chế PIVOT Bài 13.4 & 13.5 nhưng trên PaymentTransactions)",
        "title": "Bài 13.6: Xoay bảng (PIVOT) doanh thu thực thu theo 3 kênh thanh toán (VNPAY, Momo, Tiền mặt) cho từng Nhân viên",
        "question": "Tiếp tục phản xạ xoay cột `PIVOT` bằng cách nối `Employees e` -> `Orders o` -> `PaymentTransactions pt`: Gom nhóm theo `e.EmployeeID, e.FullName` và xoay 3 cột tiền thu qua `'VNPAY'` (`VnpayAmount`), `'Momo'` (`MomoAmount`), và `'Tiền mặt'` (`CashAmount`). Sắp xếp theo `e.EmployeeID` tăng dần.",
        "hint": "Dùng `SUM(CASE WHEN pt.PaymentMethod = 'VNPAY' THEN pt.Amount ELSE 0 END) AS VnpayAmount`.",
        "tsql": "SELECT e.EmployeeID, e.FullName,\n       SUM(CASE WHEN pt.PaymentMethod = N'VNPAY' THEN pt.Amount ELSE 0 END) AS VnpayAmount,\n       SUM(CASE WHEN pt.PaymentMethod = N'Momo' THEN pt.Amount ELSE 0 END) AS MomoAmount,\n       SUM(CASE WHEN pt.PaymentMethod = N'Tiền mặt' THEN pt.Amount ELSE 0 END) AS CashAmount\nFROM Employees e\nINNER JOIN Orders o ON e.EmployeeID = o.EmployeeID\nINNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID\nGROUP BY e.EmployeeID, e.FullName\nORDER BY e.EmployeeID ASC;",
        "sqlite": "SELECT e.EmployeeID, e.FullName,\n       SUM(CASE WHEN pt.PaymentMethod = 'VNPAY' THEN pt.Amount ELSE 0 END) AS VnpayAmount,\n       SUM(CASE WHEN pt.PaymentMethod = 'Momo' THEN pt.Amount ELSE 0 END) AS MomoAmount,\n       SUM(CASE WHEN pt.PaymentMethod = 'Tiền mặt' THEN pt.Amount ELSE 0 END) AS CashAmount\nFROM Employees e\nINNER JOIN Orders o ON e.EmployeeID = o.EmployeeID\nINNER JOIN PaymentTransactions pt ON o.OrderID = pt.OrderID\nGROUP BY e.EmployeeID, e.FullName\nORDER BY e.EmployeeID ASC;",
        "expected": {
          "cols": [
            "EmployeeID",
            "FullName",
            "VnpayAmount",
            "MomoAmount",
            "CashAmount"
          ],
          "rows": [
            [
              6,
              "Hoàng Cúc",
              3350000,
              0,
              200000
            ],
            [
              7,
              "Đinh Hợi",
              850000,
              450000,
              0
            ]
          ]
        }
      },
      {
        "id": "FS-CH13-07",
        "level": "Trung cấp (Thống kê doanh thu theo hương vị JSON $.Taste kết hợp JOIN OrderDetails)",
        "pattern": "GROUP BY JSON_VALUE(f.AttributesJSON, '$.Taste')",
        "title": "Bài 13.7: Phân tích thị hiếu khách hàng: Hương vị trái cây nào ($.Taste trong JSON) mang lại doanh thu cao nhất?",
        "question": "Hãy kết nối `Fruits f` với `OrderDetails od`, trích xuất hương vị `Taste = COALESCE(json_extract(f.AttributesJSON, '$.Taste'), 'Unknown')` (T-SQL: `JSON_VALUE`), gom nhóm theo `Taste` để tính tổng số lượng bán (`TotalQty = SUM(od.Quantity)`) và tổng doanh thu (`TasteRevenue = SUM(od.SubTotal)`). Sắp xếp theo `TasteRevenue` giảm dần.",
        "hint": "Kết hợp hàm bóc tách JSON trực tiếp trong `SELECT` và `GROUP BY` cùng với bảng giao dịch `OrderDetails`.",
        "tsql": "SELECT COALESCE(JSON_VALUE(f.AttributesJSON, '$.Taste'), 'Unknown') AS Taste,\n       SUM(od.Quantity) AS TotalQty,\n       SUM(od.SubTotal) AS TasteRevenue\nFROM Fruits f\nINNER JOIN OrderDetails od ON f.FruitID = od.FruitID\nGROUP BY COALESCE(JSON_VALUE(f.AttributesJSON, '$.Taste'), 'Unknown')\nORDER BY TasteRevenue DESC;",
        "sqlite": "SELECT COALESCE(json_extract(f.AttributesJSON, '$.Taste'), 'Unknown') AS Taste,\n       SUM(od.Quantity) AS TotalQty,\n       SUM(od.SubTotal) AS TasteRevenue\nFROM Fruits f\nINNER JOIN OrderDetails od ON f.FruitID = od.FruitID\nGROUP BY COALESCE(json_extract(f.AttributesJSON, '$.Taste'), 'Unknown')\nORDER BY TasteRevenue DESC;",
        "expected": {
          "cols": [
            "Taste",
            "TotalQty",
            "TasteRevenue"
          ],
          "rows": [
            [
              "Very Sweet",
              3,
              2550000
            ],
            [
              "Sweet",
              7,
              2110000
            ],
            [
              "Sweet-Sour",
              3,
              625000
            ],
            [
              "Crisp Sweet",
              2,
              500000
            ],
            [
              "Sour",
              2,
              270000
            ]
          ]
        }
      },
      {
        "id": "FS-CH13-08",
        "level": "Trung cấp (Bóc tách mảng JSON $.Vitamins bằng OPENJSON / json_each)",
        "pattern": "CROSS APPLY OPENJSON(f.AttributesJSON, '$.Vitamins') / json_each(f.AttributesJSON, '$.Vitamins')",
        "title": "Bài 13.8: Bóc tách mảng JSON $.Vitamins để liệt kê từng loại Vitamin có trong mỗi loại trái cây",
        "question": "Một số loại trái cây trong bảng `Fruits` có thuộc tính mảng `'$.Vitamins'` (ví dụ `[\"C\", \"A\"]`, `[\"C\", \"K\"]`). Hãy dùng `OPENJSON(f.AttributesJSON, '$.Vitamins')` (T-SQL) hoặc `json_each(f.AttributesJSON, '$.Vitamins')` (SQLite) để trải phẳng từng phần tử trong mảng thành các dòng riêng biệt: Lấy ra `FruitID`, `FruitName`, và tên `Vitamin` (`value`). Sắp xếp theo `FruitID` tăng dần, `Vitamin` tăng dần.",
        "hint": "Trong SQLite: `FROM Fruits f, json_each(f.AttributesJSON, '$.Vitamins') v WHERE json_extract(f.AttributesJSON, '$.Vitamins') IS NOT NULL`.",
        "tsql": "SELECT f.FruitID, f.FruitName,\n       v.value AS Vitamin\nFROM Fruits f\nCROSS APPLY OPENJSON(f.AttributesJSON, '$.Vitamins') v\nWHERE JSON_QUERY(f.AttributesJSON, '$.Vitamins') IS NOT NULL\nORDER BY f.FruitID ASC, Vitamin ASC;",
        "sqlite": "SELECT f.FruitID, f.FruitName,\n       v.value AS Vitamin\nFROM Fruits f, json_each(f.AttributesJSON, '$.Vitamins') v\nWHERE json_extract(f.AttributesJSON, '$.Vitamins') IS NOT NULL\nORDER BY f.FruitID ASC, Vitamin ASC;",
        "expected": {
          "cols": [
            "FruitID",
            "FruitName",
            "Vitamin"
          ],
          "rows": [
            [
              2,
              "Bưởi Da Xanh",
              "A"
            ],
            [
              2,
              "Bưởi Da Xanh",
              "C"
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              "C"
            ],
            [
              5,
              "Nho Mẫu Đơn Shine Muscat",
              "K"
            ],
            [
              8,
              "Kiwi Vàng",
              "C"
            ]
          ]
        }
      },
      {
        "id": "FS-CH13-09",
        "level": "Nâng cao (Mô phỏng CROSS APPLY / OUTER APPLY lấy mặt hàng chủ lực của từng Đơn hàng)",
        "pattern": "CROSS APPLY (SELECT TOP 1 ... FROM OrderDetails od WHERE od.OrderID = o.OrderID ORDER BY od.SubTotal DESC)",
        "title": "Bài 13.9: Tìm mặt hàng chiếm giá trị lớn nhất (Hero Item) trong từng đơn hàng (CROSS APPLY / Window CTE)",
        "question": "Với mỗi đơn hàng trong bảng `Orders` (`OrderID`, `CustomerID`, `TotalAmount`), hãy tìm ra mặt hàng (`FruitName`, `SubTotal`) có giá trị `SubTotal` cao nhất bên trong đơn hàng đó (nếu bằng nhau lấy `OrderDetailID` nhỏ hơn). Sắp xếp theo `OrderID` tăng dần.",
        "hint": "Trong T-SQL có thể dùng `CROSS APPLY (SELECT TOP 1 ...)`, hoặc dùng CTE + `ROW_NUMBER() OVER (PARTITION BY od.OrderID ORDER BY od.SubTotal DESC, od.OrderDetailID ASC)` chạy tương thích 100% trên cả T-SQL lẫn SQLite!",
        "tsql": "SELECT o.OrderID, o.CustomerID, o.TotalAmount,\n       hero.FruitName AS HeroFruit, hero.SubTotal AS HeroSubTotal\nFROM Orders o\nCROSS APPLY (\n    SELECT TOP 1 f.FruitName, od.SubTotal\n    FROM OrderDetails od\n    INNER JOIN Fruits f ON od.FruitID = f.FruitID\n    WHERE od.OrderID = o.OrderID\n    ORDER BY od.SubTotal DESC, od.OrderDetailID ASC\n) hero\nORDER BY o.OrderID ASC;",
        "sqlite": "WITH RankedItems AS (\n    SELECT od.OrderID, f.FruitName, od.SubTotal,\n           ROW_NUMBER() OVER (PARTITION BY od.OrderID ORDER BY od.SubTotal DESC, od.OrderDetailID ASC) AS rn\n    FROM OrderDetails od\n    INNER JOIN Fruits f ON od.FruitID = f.FruitID\n)\nSELECT o.OrderID, o.CustomerID, o.TotalAmount,\n       ri.FruitName AS HeroFruit, ri.SubTotal AS HeroSubTotal\nFROM Orders o\nINNER JOIN RankedItems ri ON o.OrderID = ri.OrderID AND ri.rn = 1\nORDER BY o.OrderID ASC;",
        "expected": {
          "cols": [
            "OrderID",
            "CustomerID",
            "TotalAmount",
            "HeroFruit",
            "HeroSubTotal"
          ],
          "rows": [
            [
              1,
              1,
              850000,
              "Nho Mẫu Đơn Shine Muscat",
              850000
            ],
            [
              2,
              2,
              180000,
              "Xoài Cát Hòa Lộc",
              160000
            ],
            [
              3,
              3,
              150000,
              "Sầu Riêng Ri6",
              150000
            ],
            [
              4,
              4,
              850000,
              "Táo Envy",
              500000
            ],
            [
              5,
              1,
              2500000,
              "Nho Mẫu Đơn Shine Muscat",
              1700000
            ],
            [
              6,
              5,
              300000,
              "Việt Quất (Blueberry)",
              350000
            ],
            [
              7,
              6,
              180000,
              "Kiwi Vàng",
              180000
            ],
            [
              8,
              1,
              200000,
              "Dâu Tây Mộc Châu",
              200000
            ],
            [
              9,
              4,
              400000,
              "Cherry Đỏ Thẫm",
              450000
            ],
            [
              10,
              7,
              95000,
              "Măng Cụt Lái Thiêu",
              95000
            ]
          ]
        }
      },
      {
        "id": "FS-CH13-10",
        "level": "Thực chiến (Phân tích RFM - Recency, Frequency, Monetary phân hạng khách hàng toàn diện)",
        "pattern": "CTE tổng hợp Recency (LastOrderDate), Frequency (OrderCount), Monetary (TotalSpend) + Phân nhóm RFM",
        "title": "Bài 13.10: Bài toán Capstone RFM Analysis: Phân khúc toàn bộ tập khách hàng của FruitStore_Ultimate",
        "question": "Hãy viết một truy vấn phân tích **RFM (Recency - Frequency - Monetary)** cho toàn bộ 8 khách hàng trong bảng `Customers`: Lấy ra `CustomerID`, `FullName`, ngày mua hàng gần nhất (`LastOrderDate = COALESCE(MAX(SUBSTR(o.OrderDate, 1, 10)), 'Chưa mua')`), tần suất mua hàng (`Frequency = COUNT(o.OrderID)`), tổng chi tiêu (`Monetary = COALESCE(SUM(o.TotalAmount), 0)`), và phân khúc `RFMSegment` theo quy tắc: Nếu `COALESCE(SUM(o.TotalAmount), 0) >= 1000000` là `'Champion (Kim Cương)'`, nếu `COUNT(o.OrderID) >= 1` là `'Active (Thân thiết)'`, ngược lại là `'Lead (Tiềm năng mới)'`. Sắp xếp theo `Monetary` giảm dần, `CustomerID` tăng dần.",
        "hint": "Dùng `LEFT JOIN Orders o ON c.CustomerID = o.CustomerID` và gom nhóm theo `c.CustomerID, c.FullName`.",
        "tsql": "SELECT c.CustomerID, c.FullName,\n       COALESCE(MAX(CONVERT(VARCHAR(10), o.OrderDate, 120)), N'Chưa mua') AS LastOrderDate,\n       COUNT(o.OrderID) AS Frequency,\n       COALESCE(SUM(o.TotalAmount), 0) AS Monetary,\n       CASE\n           WHEN COALESCE(SUM(o.TotalAmount), 0) >= 1000000 THEN N'Champion (Kim Cương)'\n           WHEN COUNT(o.OrderID) >= 1 THEN N'Active (Thân thiết)'\n           ELSE N'Lead (Tiềm năng mới)'\n       END AS RFMSegment\nFROM Customers c\nLEFT JOIN Orders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID, c.FullName\nORDER BY Monetary DESC, c.CustomerID ASC;",
        "sqlite": "SELECT c.CustomerID, c.FullName,\n       COALESCE(MAX(SUBSTR(o.OrderDate, 1, 10)), 'Chưa mua') AS LastOrderDate,\n       COUNT(o.OrderID) AS Frequency,\n       COALESCE(SUM(o.TotalAmount), 0) AS Monetary,\n       CASE\n           WHEN COALESCE(SUM(o.TotalAmount), 0) >= 1000000 THEN 'Champion (Kim Cương)'\n           WHEN COUNT(o.OrderID) >= 1 THEN 'Active (Thân thiết)'\n           ELSE 'Lead (Tiềm năng mới)'\n       END AS RFMSegment\nFROM Customers c\nLEFT JOIN Orders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID, c.FullName\nORDER BY Monetary DESC, c.CustomerID ASC;",
        "expected": {
          "cols": [
            "CustomerID",
            "FullName",
            "LastOrderDate",
            "Frequency",
            "Monetary",
            "RFMSegment"
          ],
          "rows": [
            [
              1,
              "Võ Thành Tài",
              "2024-03-01",
              3,
              3550000,
              "Champion (Kim Cương)"
            ],
            [
              4,
              "Triệu Mẫn",
              "2024-03-05",
              2,
              1250000,
              "Champion (Kim Cương)"
            ],
            [
              5,
              "Chu Chỉ Nhược",
              "2024-01-10",
              1,
              300000,
              "Active (Thân thiết)"
            ],
            [
              2,
              "Nguyễn Thị Lệ",
              "2023-04-20",
              1,
              180000,
              "Active (Thân thiết)"
            ],
            [
              6,
              "Ân Ly",
              "2024-02-14",
              1,
              180000,
              "Active (Thân thiết)"
            ],
            [
              3,
              "Trương Vô Kỵ",
              "2023-06-15",
              1,
              150000,
              "Active (Thân thiết)"
            ],
            [
              7,
              "Tiểu Chiêu",
              "2024-03-10",
              1,
              95000,
              "Active (Thân thiết)"
            ],
            [
              8,
              "Dương Quá",
              "Chưa mua",
              0,
              0,
              "Lead (Tiềm năng mới)"
            ]
          ]
        }
      }
    ]
  }
];

  // Đăng ký vào Registry toàn cục và tự động gắn vào từng chương ch01..ch13
  window.SQLMasterRegistry = window.SQLMasterRegistry || {};
  window.SQLMasterRegistry.fruitstore130 = FRUITSTORE_130_CHAPTERS;

  // Hàm tự động tích hợp vào danh sách chương khi App khởi tạo
  window.integrateFruitStore130Drills = function (chaptersMapOrList) {
    if (!chaptersMapOrList) return;
    FRUITSTORE_130_CHAPTERS.forEach(function (group) {
      const normalizedExercises = group.exercises.map(function (ex) {
        return {
          id: ex.id,
          chapterId: group.chapter_id,
          level: ex.level,
          pattern: ex.pattern,
          title: ex.title,
          question: ex.question,
          hint: ex.hint,
          db: 'fruitstore',
          sql: ex.sqlite,
          tsql: ex.tsql,
          expected: ex.expected
        };
      });
      // Tìm chương tương ứng theo id (ch01..ch13)
      let targetChap = null;
      if (Array.isArray(chaptersMapOrList)) {
        targetChap = chaptersMapOrList.find(function (c) { return c.id === group.chapter_id; });
      } else if (typeof chaptersMapOrList === 'object') {
        targetChap = chaptersMapOrList[group.chapter_id];
      }
      if (targetChap) {
        targetChap.fruitstoreDrills = normalizedExercises;
        targetChap.exercises = (targetChap.exercises || []).concat(
          normalizedExercises.filter(function (ne) {
            return !(targetChap.exercises || []).some(function (oldEx) { return oldEx.id === ne.id; });
          })
        );
      }
    });
  };
})();
```

### 4.2. Đoạn code render khu vực "🍎 130 Bài Tập Phản Xạ FruitStore (A–Z)" trong `src/ui/app-engine.js`

Hãy thêm hàm render dưới đây vào `src/ui/app-engine.js` để hiển thị bộ 10 bài tập ở cuối mỗi chương (`ch01`..`ch13`) cũng như trang tổng hợp 130 bài:

```javascript
function renderFruitStoreDrillsSection(chapter) {
  const drills = chapter.fruitstoreDrills || [];
  if (!drills.length) return '';
  const solvedMap = JSON.parse(localStorage.getItem('sql_master_solved_v2005') || '{}');
  const solvedCount = drills.filter(d => solvedMap[d.id]).length;

  return `
    <fieldset class="win98-groupbox fruitstore-drills-box" style="margin-top: 18px;">
      <legend>🍎 Luyện Phản Xạ Cơ Bắp FruitStore_Ultimate (${solvedCount}/${drills.length} Bài Đã Hoàn Thành)</legend>
      <div class="drill-pedagogy-banner">
        <strong>🎯 Phương pháp học Phản Xạ Lặp (Muscle Memory):</strong>
        Bài 1–3 lặp lại Khuôn mẫu A trên 3 bảng khác nhau; Bài 4–6 lặp lại Khuôn mẫu B trên 3 bảng khác nhau; Bài 7–8 Tổ hợp Trung cấp; Bài 9–10 Thực chiến Nâng cao.
      </div>
      <div class="drill-list">
        ${drills.map((ex, idx) => {
          const isSolved = !!solvedMap[ex.id];
          return `
            <div class="window drill-card ${isSolved ? 'drill-solved' : ''}" style="margin-bottom: 12px;">
              <div class="title-bar">
                <div class="title-bar-text">
                  ${isSolved ? '✅' : '📝'} [${ex.id}] ${ex.title} — <span style="color:#ffff88;">${ex.level}</span>
                </div>
              </div>
              <div class="window-body">
                <div style="margin-bottom:6px; font-family: monospace; background:#fffbe6; border:1px solid #d4b106; padding:4px 8px;">
                  <strong>Khuôn mẫu phản xạ:</strong> <code>${escapeHtml(ex.pattern)}</code>
                </div>
                <p style="margin: 6px 0;"><strong>Đề bài:</strong> ${ex.question}</p>
                <div class="drill-actions" style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
                  <button type="button" onclick="window.openExerciseInLab('${ex.id}')">
                    🧪 Làm & Chấm Điểm Trong SQL Lab (DB: FruitStore)
                  </button>
                  <button type="button" onclick="this.nextElementSibling.hidden = !this.nextElementSibling.hidden">
                    💡 Bật/Tắt Gợi Ý & Đáp Án Mẫu
                  </button>
                  <div hidden style="width:100%; margin-top:8px; background:#f4f4f4; border:1px inset #808080; padding:8px;">
                    <p style="margin:0 0 6px 0;"><strong>💡 Gợi ý:</strong> ${ex.hint}</p>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                      <div>
                        <strong> chuẩn T-SQL (SQL Server):</strong>
                        <pre style="background:#001b33; color:#7fffd4; padding:8px; overflow:auto;"><code>${escapeHtml(ex.tsql)}</code></pre>
                      </div>
                      <div>
                        <strong>Chuẩn SQLite (SQL Lab):</strong>
                        <pre style="background:#001b33; color:#98fb98; padding:8px; overflow:auto;"><code>${escapeHtml(ex.sql)}</code></pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </fieldset>
  `;
}
```