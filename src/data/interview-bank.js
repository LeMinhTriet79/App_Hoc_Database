/**
 * ==========================================================================
 * FILE: src/data/interview-bank.js
 * MÔ TẢ: Ngân hàng 48 Thẻ Phỏng Vấn Kỹ Thuật (Flashcards) Cho Backend Java / .NET
 * CẤU TRÚC:
 *   - 16 Thẻ Cấp Độ Fresher (iv-01 -> iv-16): Nền tảng SQL, NULL 3VL, JOIN, GROUP BY, DML
 *   - 16 Thẻ Cấp Độ Junior (iv-17 -> iv-32): Window Functions, CTE, Subquery, Index, Triggers
 *   - 16 Thẻ Cấp Độ Mid-Level (iv-33 -> iv-48): ACID, Isolation, RCSI, Deadlock, ORM N+1, Tuning
 * HỖ TRỢ THUẬT TOÁN: Leitner 3-Box Spaced Repetition (Hộp 1, 2, 3)
 * ==========================================================================
 */
(function(global) {
  "use strict";

  var BANK = [
    /* ======================================================================
       PHẦN 1: 16 CÂU HỎI FRESHER (iv-01 -> iv-16)
       ====================================================================== */
    {
      id: "iv-01",
      level: "Fresher",
      chapter: "ch01",
      topic: "Three-Valued Logic & NULL",
      q: "Tại sao biểu thức WHERE HocBong = NULL hoặc WHERE HocBong <> NULL trong SQL luôn trả về 0 dòng?",
      a: "Vì SQL sử dụng Logic Ba Giá Trị (Three-Valued Logic: TRUE, FALSE, UNKNOWN). Mọi phép so sánh bằng toán tử = hoặc <> với NULL đều trả về UNKNOWN (chưa biết), mà mệnh đề WHERE chỉ chấp nhận các dòng có kết quả là TRUE. Phải dùng IS NULL hoặc IS NOT NULL (hoặc IS DISTINCT FROM trong chuẩn ANSI/PostgreSQL).",
      followup: "Hỏi xoáy: Trong mệnh đề CHECK constraint của bảng, nếu biểu thức trả về UNKNOWN thì dòng dữ liệu có được INSERT vào không? (Đáp: CÓ! Khác với WHERE chỉ nhận TRUE, CHECK constraint chỉ từ chối khi biểu thức là FALSE; UNKNOWN vẫn được thông qua)."
    },
    {
      id: "iv-02",
      level: "Fresher",
      chapter: "ch01",
      topic: "Thứ tự thực thi Logic của SELECT",
      q: "Nêu thứ tự thực thi logic 9 bước chuẩn của một câu lệnh SELECT?",
      a: "Thứ tự thực thi logic: (1) FROM -> (2) ON -> (3) JOIN -> (4) WHERE -> (5) GROUP BY -> (6) HAVING -> (7) SELECT -> (8) DISTINCT -> (9) ORDER BY -> (10) TOP / OFFSET-FETCH.",
      followup: "Hỏi xoáy: Tại sao lập trình viên hay nhầm lẫn thứ tự viết (Lexical) với thứ tự chạy? (Đáp: Vì khi code, SELECT đứng đầu tiên, nhưng động cơ SQL phải xác định nguồn bảng ở FROM trước rồi mới biết có những cột nào để trích xuất)."
    },
    {
      id: "iv-03",
      level: "Fresher",
      chapter: "ch01",
      topic: "Bí danh Alias trong WHERE",
      q: "Tại sao bạn không thể sử dụng bí danh (Alias) vừa đặt ở mệnh đề SELECT bên trong mệnh đề WHERE?",
      a: "Vì theo thứ tự thực thi logic của SQL, mệnh đề WHERE chạy ở bước 4, trong khi mệnh đề SELECT (nơi bí danh được định nghĩa) mãi đến bước 7 mới chạy. Khi WHERE hoạt động, bí danh đó hoàn toàn chưa tồn tại trong bộ nhớ.",
      followup: "Hỏi xoáy: Mệnh đề nào DUY NHẤT trong SQL được phép dùng bí danh của SELECT? (Đáp: Mệnh đề ORDER BY, vì ORDER BY chạy ở bước 9, sau khi SELECT đã hoàn tất)."
    },
    {
      id: "iv-04",
      level: "Fresher",
      chapter: "ch02",
      topic: "COALESCE vs ISNULL trong T-SQL",
      q: "Phân biệt COALESCE và ISNULL trong SQL Server? Kiểu dữ liệu trả về được quyết định thế nào?",
      a: "1. Chuẩn hóa: COALESCE là hàm chuẩn ANSI SQL nhận nhiều tham số; ISNULL là hàm đặc thù của riêng T-SQL chỉ nhận đúng 2 tham số.\n2. Ép kiểu: ISNULL trả về kiểu dữ liệu của tham số THỨ NHẤT (nếu tham số 1 là VARCHAR(5) thì chuỗi dài hơn ở tham số 2 sẽ bị cắt ngắn!). Ngược lại, COALESCE tuân thủ quy tắc Precedence (ưu tiên kiểu dữ liệu cao nhất giữa các tham số).",
      followup: "Hỏi xoáy: Trường hợp nào ISNULL cho hiệu năng tốt hơn COALESCE trong SQL Server? (Đáp: Trong các câu truy vấn phức tạp, Query Optimizer đôi khi coi COALESCE như biểu thức CASE WHEN lặp lại subquery, trong khi ISNULL là toán tử nội tại đơn giản)."
    },
    {
      id: "iv-05",
      level: "Fresher",
      chapter: "ch01",
      topic: "VARCHAR vs NVARCHAR & Tiền tố N'..'",
      q: "Phân biệt VARCHAR và NVARCHAR? Tại sao khi gán chuỗi tiếng Việt có dấu trong T-SQL bắt buộc phải có chữ N đứng trước?",
      a: "VARCHAR lưu chuỗi ASCII hoặc mã trang (1 byte/ký tự). NVARCHAR lưu chuỗi Unicode UTF-16 (2 byte/ký tự). Tiền tố N'...' (viết tắt của National Character) báo cho SQL Server biết chuỗi theo sau là định dạng Unicode; nếu thiếu N, chuỗi tiếng Việt có dấu sẽ bị ép kiểu sang ASCII và biến thành dấu hỏi chấm (????).",
      followup: "Hỏi xoáy: Trong SQL Server 2019+, làm cách nào để VARCHAR vẫn lưu được tiếng Việt Unicode mà chỉ tốn 1 byte cho các ký tự không dấu? (Đáp: Sử dụng Collation hỗ trợ UTF-8, ví dụ: Latin1_General_100_CI_AS_SC_UTF8)."
    },
    {
      id: "iv-06",
      level: "Fresher",
      chapter: "ch03",
      topic: "INNER JOIN vs LEFT JOIN",
      q: "Phân biệt INNER JOIN và LEFT JOIN? Khi nào bắt buộc phải dùng LEFT JOIN?",
      a: "INNER JOIN chỉ trả về các dòng thỏa mãn điều kiện nối ở cả hai bảng. LEFT JOIN trả về toàn bộ dòng của bảng bên trái; dòng nào bảng phải không khớp thì các cột bảng phải mang giá trị NULL. Bắt buộc dùng LEFT JOIN khi cần bảo toàn danh sách gốc (ví dụ: hiển thị danh sách tất cả khách hàng kể cả người chưa mua đơn nào).",
      followup: "Hỏi xoáy: Sau khi LEFT JOIN, làm thế nào để tìm ra các dòng ở bảng trái CHƯA TỪNG có bản ghi tương ứng ở bảng phải? (Đáp: Thêm mệnh đề `WHERE BangPhai.KhoaChinh IS NULL`)."
    },
    {
      id: "iv-07",
      level: "Fresher",
      chapter: "ch03",
      topic: "Bẫy Lọc ON vs WHERE trong LEFT JOIN",
      q: "Trong LEFT JOIN, điều kiện lọc đặt ở mệnh đề ON khác gì khi đặt ở mệnh đề WHERE?",
      a: "Trong LEFT JOIN:\n- Điều kiện đặt tại ON: Quyết định dòng bảng phải có được ghép vào hay không; các dòng bảng trái vẫn được bảo toàn 100%.\n- Điều kiện đặt tại WHERE: Chạy sau khi phép nối hoàn tất; nếu đặt điều kiện lọc trên cột của bảng phải (ví dụ: WHERE k.TrangThai = 1), các dòng có NULL sẽ bị loại, vô tình biến LEFT JOIN thành INNER JOIN!",
      followup: "Hỏi xoáy: Xem câu lệnh `FROM A LEFT JOIN B ON A.id = B.id WHERE B.Status = 'Active'`. Câu này trả về kết quả gì? (Đáp: Trả về kết quả giống hệt INNER JOIN vì các dòng A không có B tương ứng bị WHERE loại mất do B.Status là NULL)."
    },
    {
      id: "iv-08",
      level: "Fresher",
      chapter: "ch03",
      topic: "UNION vs UNION ALL",
      q: "Phân biệt UNION và UNION ALL? Tại sao Senior Backend luôn ưu tiên UNION ALL?",
      a: "UNION gộp hai tập kết quả và tự động LOẠI BỎ CÁC DÒNG TRÙNG LẶP (yêu cầu chi phí SORT / HASH khử trùng rất tốn CPU và TempDB). UNION ALL gộp nguyên văn tất cả các dòng mà không kiểm tra trùng lặp. Senior ưu tiên UNION ALL vì hiệu năng vượt trội khi biết chắc dữ liệu không trùng hoặc nghiệp vụ cho phép trùng.",
      followup: "Hỏi xoáy: Khi nào bắt buộc phải dùng UNION thay vì UNION ALL? (Đáp: Khi nghiệp vụ bắt buộc tập kết quả trả về phải là một tập hợp thuần túy (Set) không có bất kỳ dòng trùng lặp nào và không thể lọc trùng bằng WHERE)."
    },
    {
      id: "iv-09",
      level: "Fresher",
      chapter: "ch04",
      topic: "WHERE vs HAVING",
      q: "Phân biệt mệnh đề WHERE và mệnh đề HAVING? Có thể dùng cả hai trong một câu lệnh không?",
      a: "WHERE lọc từng dòng đơn lẻ TRƯỚC KHI gom nhóm (chạy ở bước 4); không thể dùng hàm tổng hợp trong WHERE. HAVING lọc trên các nhóm dữ liệu SAU KHI đã gom nhóm bằng GROUP BY (chạy ở bước 6); thường dùng với COUNT, SUM, AVG. Hoàn toàn có thể dùng song song cả hai để tối ưu hiệu năng: WHERE giảm bớt số dòng cần nhóm, HAVING lọc nhóm đạt chuẩn.",
      followup: "Hỏi xoáy: Có thể dùng HAVING mà không có GROUP BY không? (Đáp: CÓ! Khi đó toàn bộ bảng được coi là một nhóm duy nhất, ví dụ: `SELECT 1 FROM SinhVien HAVING COUNT(*) > 100`)."
    },
    {
      id: "iv-10",
      level: "Fresher",
      chapter: "ch04",
      topic: "Hàm COUNT(*) vs COUNT(Cot) vs COUNT(DISTINCT)",
      q: "Phân biệt COUNT(*), COUNT(TenCot) và COUNT(DISTINCT TenCot)?",
      a: "- COUNT(*): Đếm tổng số dòng vật lý trong bảng hoặc nhóm, kể cả dòng toàn giá trị NULL.\n- COUNT(TenCot): Chỉ đếm các dòng mà cột `TenCot` KHÁC NULL (bỏ qua mọi giá trị NULL).\n- COUNT(DISTINCT TenCot): Đếm số lượng giá trị không trùng lặp và khác NULL của cột đó.",
      followup: "Hỏi xoáy: Nếu bảng có 5 dòng với giá trị cột Điểm là: 8, 9, NULL, 9, NULL. Kết quả của COUNT(*) và COUNT(Diem) là bao nhiêu? (Đáp: COUNT(*) = 5; COUNT(Diem) = 3; COUNT(DISTINCT Diem) = 2)."
    },
    {
      id: "iv-11",
      level: "Fresher",
      chapter: "ch06",
      topic: "DELETE vs TRUNCATE vs DROP",
      q: "So sánh chi tiết 3 lệnh xóa: DELETE, TRUNCATE TABLE và DROP TABLE?",
      a: "1. DELETE: Lệnh DML, xóa từng dòng, ghi log đầy đủ từng dòng vào Transaction Log, kích hoạt DELETE Trigger, cho phép dùng WHERE, không reset IDENTITY.\n2. TRUNCATE: Lệnh DDL, giải phóng toàn bộ trang dữ liệu (Data Pages), ghi log tối thiểu (Deallocation), KHÔNG kích hoạt Trigger, reset IDENTITY về ban đầu, cực nhanh, không có WHERE.\n3. DROP TABLE: Lệnh DDL, xóa cả dữ liệu lẫn định nghĩa cấu trúc bảng khỏi Schema.",
      followup: "Hỏi xoáy: TRUNCATE có thể ROLLBACK được trong Transaction không? (Đáp: CÓ! Đây là ngộ nhận rất phổ biến. TRUNCATE nằm trong `BEGIN TRAN ... ROLLBACK` vẫn hoàn tác 100% bình thường trong SQL Server)."
    },
    {
      id: "iv-12",
      level: "Fresher",
      chapter: "ch06",
      topic: "PRIMARY KEY vs UNIQUE Constraint",
      q: "Phân biệt PRIMARY KEY và UNIQUE constraint? Trong SQL Server, UNIQUE constraint cho phép bao nhiêu giá trị NULL?",
      a: "- PRIMARY KEY: Định danh duy nhất dòng, cấm tuyệt đối NULL (NOT NULL), mỗi bảng chỉ có duy nhất 1 PK, mặc định tạo Clustered Index.\n- UNIQUE: Đảm bảo tính duy nhất, mỗi bảng có thể có nhiều UNIQUE constraint, mặc định tạo Non-Clustered Index.\n- Về giá trị NULL: Chuẩn ANSI cho phép nhiều giá trị NULL trong cột UNIQUE, NHƯNG SQL Server mặc định CHỈ CHO PHÉP ĐÚNG 1 GIÁ TRỊ NULL (coi NULL như một giá trị để kiểm tra trùng).",
      followup: "Hỏi xoáy: Làm thế nào để tạo UNIQUE constraint trong SQL Server cho phép nhiều giá trị NULL giống chuẩn ANSI? (Đáp: Tạo một Filtered Unique Index: `CREATE UNIQUE NONCLUSTERED INDEX IX_UniqueEmail ON Users(Email) WHERE Email IS NOT NULL;`)."
    },
    {
      id: "iv-13",
      level: "Fresher",
      chapter: "ch01",
      topic: "Kiểu dữ liệu CHAR vs VARCHAR",
      q: "Khi nào nên dùng CHAR và khi nào nên dùng VARCHAR?",
      a: "CHAR(n) là chuỗi có độ dài cố định; nếu chuỗi ngắn hơn n ký tự, SQL sẽ tự động điền thêm dấu cách (space padding) cho đủ n bytes. VARCHAR(n) là chuỗi có độ dài biến đổi, chỉ tốn dung lượng đúng bằng độ dài chuỗi + 2 bytes quản lý offset. Dùng CHAR khi độ dài dữ liệu luôn bất biến (Mã CCCD, Mã Tiền Tệ 'USD', 'VND', Mã Quốc Gia 'VN', MD5 Hash).",
      followup: "Hỏi xoáy: Tại sao cột có độ dài cố định lại giúp tăng tốc độ cập nhật? (Đáp: Vì kích thước dòng không đổi, tránh được hiện tượng Page Split và Row Migration khi UPDATE dữ liệu)."
    },
    {
      id: "iv-14",
      level: "Fresher",
      chapter: "ch01",
      topic: "DATETIME vs DATETIME2 vs DATETIMEOFFSET",
      q: "Tại sao Microsoft khuyến nghị dùng DATETIME2 thay thế cho DATETIME cổ điển?",
      a: "1. DATETIME: Dải ngày từ năm 1753 đến 9999, độ chính xác làm tròn 3.33 mili-giây, tốn 8 bytes.\n2. DATETIME2: Dải ngày rộng hơn từ năm 0001 đến 9999, độ chính xác tới 100 nano-giây (7 chữ số thập phân), tốn từ 6 đến 8 bytes (tiết kiệm bộ nhớ hơn).\n3. DATETIMEOFFSET: Lưu kèm múi giờ (Time Zone Offset UTC), bắt buộc cho các hệ thống thương mại điện tử đa quốc gia.",
      followup: "Hỏi xoáy: Năm 1753 của DATETIME có ý nghĩa lịch sử gì? (Đáp: Đó là năm nước Anh chuyển từ lịch Julian sang lịch Gregorian, làm mất 11 ngày trong tháng 9/1752, nên SQL Server chọn mốc 1753 để tránh sai sót lịch sử)."
    },
    {
      id: "iv-15",
      level: "Fresher",
      chapter: "ch06",
      topic: "Khóa ngoại CASCADE vs SET NULL",
      q: "Phân biệt hành vi của ON DELETE CASCADE và ON DELETE SET NULL trong khóa ngoại?",
      a: "- ON DELETE CASCADE: Khi một dòng ở bảng cha bị xóa, toàn bộ các dòng tham chiếu tới nó ở bảng con sẽ TỰ ĐỘNG BỊ XÓA THEO (nguy hiểm nếu áp dụng cho Đơn Hàng / Tài Khoản).\n- ON DELETE SET NULL: Khi dòng ở bảng cha bị xóa, giá trị khóa ngoại ở bảng con sẽ được gán về NULL (yêu cầu cột khóa ngoại ở bảng con phải cho phép NULL).",
      followup: "Hỏi xoáy: Khi nào dùng ON DELETE NO ACTION (RESTRICT)? (Đáp: Mặc định, ngăn cấm xóa dòng cha nếu đang có ít nhất 1 dòng con tham chiếu tới; đây là phương án an toàn nhất cho tài chính ngân hàng)."
    },
    {
      id: "iv-16",
      level: "Fresher",
      chapter: "ch01",
      topic: "Tìm Dòng Lớn Thứ N trong SQL",
      q: "Nêu 2 cách phổ biến để tìm nhân viên có mức lương cao thứ nhì trong bảng?",
      a: "Cách 1 (Dùng OFFSET-FETCH hoặc Subquery):\n`SELECT DISTINCT Salary FROM Employee ORDER BY Salary DESC OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY;`\nCách 2 (Dùng DENSE_RANK chuẩn xác khi có trùng lương):\n`WITH Ranked AS (SELECT Salary, DENSE_RANK() OVER (ORDER BY Salary DESC) as rk FROM Employee) SELECT Salary FROM Ranked WHERE rk = 2;`",
      followup: "Hỏi xoáy: Nếu dùng LIMIT/OFFSET mà có 2 nhân viên cùng đứng đầu với lương 50 triệu, cách nào sẽ cho kết quả sai? (Đáp: OFFSET 1 sẽ trả về tiếp mức 50 triệu của người thứ 2 thay vì mức lương cao thứ nhì thật sự! Phải có DISTINCT hoặc DENSE_RANK)."
    },

    /* ======================================================================
       PHẦN 2: 16 CÂU HỎI JUNIOR (iv-17 -> iv-32)
       ====================================================================== */
    {
      id: "iv-17",
      level: "Junior",
      chapter: "ch05",
      topic: "ROW_NUMBER vs RANK vs DENSE_RANK",
      q: "So sánh sự khác biệt về số thứ tự sinh ra giữa ROW_NUMBER(), RANK() và DENSE_RANK() khi có các dòng cùng giá trị?",
      a: "Giả sử điểm số là: 10, 9, 9, 8:\n- ROW_NUMBER(): Đánh số tuần tự tăng dần không trùng lặp -> 1, 2, 3, 4.\n- RANK(): Cùng giá trị thì cùng hạng, nhưng NHẢY CÁCH số thứ tự phía sau -> 1, 2, 2, 4 (bị khuyết hạng 3).\n- DENSE_RANK(): Cùng giá trị thì cùng hạng và KHÔNG NHẢY CÁCH số thứ tự -> 1, 2, 2, 3.",
      followup: "Hỏi xoáy: Khi giải bài toán 'Top 3 nhân viên lương cao nhất mỗi phòng ban', bạn dùng hàm nào? (Đáp: Dùng DENSE_RANK() để nếu có 2 người đồng hạng nhất thì vẫn lấy được đủ người ở hạng 2 và hạng 3)."
    },
    {
      id: "iv-18",
      level: "Junior",
      chapter: "ch05",
      topic: "Khung Cửa Sổ Mặc Định trong OVER()",
      q: "Khi dùng hàm SUM() hoặc AVG() đi kèm `OVER (ORDER BY NgayDat)`, khung cửa sổ (Window Frame) mặc định là gì và nó ảnh hưởng thế nào tới kết quả?",
      a: "Khung cửa sổ mặc định khi có ORDER BY mà không chỉ định rõ frame là: `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. Điều này biến phép tính thành TÍNH TỔNG TÍCH LŨY (Running Total). Chú ý: RANGE xử lý theo giá trị nên các dòng có cùng ngày đặt sẽ bị cộng dồn gộp lại cùng lúc thay vì tính từng dòng như ROWS.",
      followup: "Hỏi xoáy: Tại sao dùng ROWS BETWEEN luôn chạy nhanh hơn RANGE BETWEEN trong SQL Server? (Đáp: Vì ROWS làm việc trực tiếp trên chỉ số dòng vật lý trong bộ nhớ, còn RANGE phải ghi và đọc spool trong TempDB để xử lý các giá trị trùng lặp)."
    },
    {
      id: "iv-19",
      level: "Junior",
      chapter: "ch05",
      topic: "Bẫy Hàm LAST_VALUE()",
      q: "Tại sao hàm `LAST_VALUE(Luong) OVER (ORDER BY NgayVaoLam)` thường trả về chính mức lương của dòng hiện tại thay vì dòng cuối cùng của bảng?",
      a: "Vì khung cửa sổ mặc định là `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`! Khung cửa sổ chỉ mở rộng từ dòng đầu tiên đến DÒNG HIỆN TẠI (Current Row), nên 'giá trị cuối cùng' của khung cửa sổ đó chính là dòng hiện tại. Muốn lấy giá trị cuối cùng thực sự, phải mở rộng khung cửa sổ hết bảng: `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`.",
      followup: "Hỏi xoáy: Có cách nào lấy giá trị cuối cùng mà không cần mở rộng frame dài dòng? (Đáp: Dùng hàm `FIRST_VALUE()` với thứ tự sắp xếp đảo ngược: `ORDER BY NgayVaoLam DESC`)."
    },
    {
      id: "iv-20",
      level: "Junior",
      chapter: "ch04",
      topic: "Bẫy NOT IN gặp NULL trong Subquery",
      q: "Tại sao câu lệnh `WHERE MaKH NOT IN (SELECT MaKH FROM DonHang)` trả về rỗng (0 dòng) ngay khi trong bảng DonHang có chứa đúng 1 giá trị MaKH IS NULL?",
      a: "Vì toán tử `NOT IN (1, 2, NULL)` tương đương logic với: `MaKH <> 1 AND MaKH <> 2 AND MaKH <> NULL`. Biểu thức `MaKH <> NULL` trả về UNKNOWN. Theo bảng chân trị AND: `TRUE AND UNKNOWN` cho ra UNKNOWN. Mệnh đề WHERE không nhận UNKNOWN nên triệt tiêu toàn bộ kết quả! Phải thay bằng `NOT EXISTS` hoặc thêm `WHERE MaKH IS NOT NULL` vào subquery.",
      followup: "Hỏi xoáy: Tại sao `NOT EXISTS` không bị ảnh hưởng bởi NULL? (Đáp: Vì EXISTS chỉ kiểm tra sự tồn tại của dòng (số lượng dòng > 0), không thực hiện phép so sánh đẳng thức ba giá trị với giá trị của cột)."
    },
    {
      id: "iv-21",
      level: "Junior",
      chapter: "ch13",
      topic: "Correlated Subquery vs CROSS APPLY",
      q: "Phân biệt Correlated Subquery và toán tử CROSS APPLY trong T-SQL?",
      a: "Correlated Subquery là truy vấn con tham chiếu tới cột của truy vấn ngoài, thường chỉ trả về 1 giá trị vô hướng (Scalar). CROSS APPLY giống như một vòng lặp `for-each` bên phải: với mỗi dòng bảng trái, nó thực thi hàm bảng (Table-Valued Function) hoặc subquery bên phải và cho phép trả về NHIỀU CỘT, NHIỀU DÒNG (ví dụ: lấy top 3 đơn hàng mới nhất của từng khách hàng).",
      followup: "Hỏi xoáy: Trong PostgreSQL toán tử nào tương đương với CROSS APPLY? (Đáp: `LATERAL JOIN`)."
    },
    {
      id: "iv-22",
      level: "Junior",
      chapter: "ch05",
      topic: "Bản chất thực thi của CTE (Common Table Expression)",
      q: "Trong SQL Server, CTE (`WITH BangTam AS (...)`) có được materialize (lưu kết quả tạm vào ổ cứng/TempDB) giống như bảng tạm #TempTable không?",
      a: "KHÔNG! Trong SQL Server, CTE chỉ là một 'Inline View cú pháp' (Syntactic Sugar). Khi chạy, Query Optimizer sẽ chèn định nghĩa của CTE trực tiếp vào câu lệnh chính. Nếu bạn tham chiếu tới CTE đó 3 lần trong cùng 1 câu lệnh, SQL Server sẽ THỰC THI CTE ĐÓ 3 LẦN ĐỘC LẬP (trừ khi có Spool operator) chứ không tái sử dụng kết quả trong TempDB.",
      followup: "Hỏi xoáy: Muốn một CTE tái sử dụng kết quả tính toán đắt đỏ nhiều lần thì nên làm gì? (Đáp: Đổ kết quả vào bảng tạm `#TempTable` có đánh chỉ mục phù hợp)."
    },
    {
      id: "iv-23",
      level: "Junior",
      chapter: "ch05",
      topic: "Recursive CTE & MAXRECURSION",
      q: "Cấu trúc của một CTE Đệ Quy (Recursive CTE) gồm những phần nào? Làm thế nào để chống tràn vòng lặp vô tận?",
      a: "Gồm 2 phần nối nhau bằng `UNION ALL`:\n1. Anchor Member (Mệnh đề neo): Lấy dòng gốc (ví dụ: Giám đốc có ManagerID IS NULL).\n2. Recursive Member (Mệnh đề đệ quy): Ghép dòng tiếp theo dựa trên kết quả bước trước.\nChống lặp vô tận: SQL Server mặc định giới hạn 100 vòng đệ quy. Có thể tinh chỉnh bằng gợi ý: `OPTION (MAXRECURSION 32767)` hoặc chặn chu trình lặp bằng cách lưu mảng đường dẫn duyệt cây.",
      followup: "Hỏi xoáy: Nếu để đệ quy quá 100 lần mà không chỉnh MAXRECURSION thì SQL Server báo lỗi gì? (Đáp: Lỗi `Msg 530: The statement terminated. The maximum recursion 100 has been exhausted`)."
    },
    {
      id: "iv-24",
      level: "Junior",
      chapter: "ch08",
      topic: "Clustered Index vs Non-Clustered Index",
      q: "So sánh Clustered Index và Non-Clustered Index? Mức lá (Leaf Level) của mỗi loại chỉ mục chứa cái gì?",
      a: "- Clustered Index: Quyết định thứ tự lưu trữ vật lý của bảng trên đĩa; mỗi bảng chỉ có DUY NHẤT 1 Clustered Index; MỨC LÁ CHÍNH LÀ DỮ LIỆU THỰC TẾ (Data Pages) của bảng.\n- Non-Clustered Index: Cấu trúc B-Tree độc lập trỏ tới dữ liệu gốc; mỗi bảng có thể có tối đa 999 NCI; MỨC LÁ CHỨA CỘT INDEX + CON TRỎ DÒNG (Row Locator). Nếu bảng có Clustered Index thì con trỏ là Khóa Clustered; nếu bảng là Heap (không có CI) thì con trỏ là RID (File:Page:Slot).",
      followup: "Hỏi xoáy: Tại sao chọn cột có giá trị tăng tự động (IDENTITY) làm Clustered Index lại tốt hơn chọn GUID ngẫu nhiên? (Đáp: Tránh hiện tượng Page Split và phân mảnh chỉ mục khi ghi dữ liệu mới vào cuối bảng)."
    },
    {
      id: "iv-25",
      level: "Junior",
      chapter: "ch08",
      topic: "Key Lookup & Triệt tiêu bằng INCLUDE",
      q: "Toán tử Key Lookup (hoặc RID Lookup) trong Execution Plan là gì? Cách tối ưu bằng Covering Index?",
      a: "Key Lookup xảy ra khi Non-Clustered Index tìm được dòng thỏa mãn WHERE nhưng câu lệnh SELECT lại yêu cầu thêm các cột khác KHÔNG NẰM TRONG INDEX đó, buộc SQL Server phải nhảy sang trang dữ liệu Clustered Index để lấy thêm cột.\nTriệt tiêu bằng cách: Thêm các cột cần lấy vào mệnh đề `INCLUDE` của chỉ mục: `CREATE NONCLUSTERED INDEX IX ON Table (WhereCol) INCLUDE (SelectCols);`.",
      followup: "Hỏi xoáy: Tại sao đưa cột vào INCLUDE lại tốt hơn đưa vào Key Columns của Index? (Đáp: Cột INCLUDE chỉ nằm ở mức lá, không làm phình to các tầng gốc và tầng trung gian của B-Tree, không bị giới hạn 16 cột / 1700 bytes)."
    },
    {
      id: "iv-26",
      level: "Junior",
      chapter: "ch08",
      topic: "Định nghĩa SARGability",
      q: "SARGability (Search Argument Able) là gì? Nêu 3 ví dụ câu truy vấn vi phạm SARGability và cách khắc phục?",
      a: "SARGable là khả năng của một biểu thức trong WHERE/ON cho phép SQL Server tận dụng tìm kiếm nhị phân (Index Seek) trên B-Tree thay vì quét toàn bảng (Scan).\n3 Ví dụ vi phạm:\n1. Bọc hàm: `WHERE YEAR(NgayDat) = 2025` -> Sửa: `WHERE NgayDat >= '2025-01-01' AND NgayDat < '2026-01-01'`.\n2. Ép kiểu ngầm định: So sánh cột VARCHAR với tham số NVARCHAR (N'...') làm SQL phải bọc hàm CONVERT lên cột.\n3. Phép toán số học: `WHERE Luong * 1.1 > 5000` -> Sửa: `WHERE Luong > 5000 / 1.1`.",
      followup: "Hỏi xoáy: Biểu thức `WHERE HoTen LIKE 'Nguyễn%'` có SARGable không? (Đáp: CÓ! Vì ký tự đại diện nằm ở cuối, B-Tree tìm kiếm nhị phân được tới vị trí bắt đầu bằng 'Nguyễn')."
    },
    {
      id: "iv-27",
      level: "Junior",
      chapter: "ch10",
      topic: "Bảng tạm #TempTable vs Biến bảng @TableVariable",
      q: "So sánh Bảng tạm (#Table) và Biến bảng (@Table) trong SQL Server?",
      a: "1. Vị trí lưu: Cả hai ĐỀU ĐƯỢC LƯU TRONG TempDB (Biến bảng KHÔNG PHẢI chỉ nằm trong RAM như nhiều người lầm tưởng).\n2. Statistics: #TempTable có bộ thống kê dữ liệu (Statistics) đầy đủ, Query Optimizer ước lượng chính xác số dòng. @TableVariable KHÔNG CÓ Statistics (SQL Server luôn mặc định ước lượng là 1 dòng, dẫn tới chọn Plan tồi trên dữ liệu lớn).\n3. Index & DDL: #TempTable cho phép tạo NCI sau khi tạo bảng, hỗ trợ transaction rollback. @TableVariable không hỗ trợ rollback và chỉ tạo được index inline.",
      followup: "Hỏi xoáy: Khi nào thì NÊN dùng Biến bảng (@Table)? (Đáp: Khi tập dữ liệu cực nhỏ, chỉ dưới 100 dòng, hoặc trong User-Defined Functions (UDF) nơi không cho phép tạo bảng tạm)."
    },
    {
      id: "iv-28",
      level: "Junior",
      chapter: "ch10",
      topic: "Indexed View trong SQL Server",
      q: "Khác biệt giữa View thường và View được đánh chỉ mục (Indexed View / Materialized View)? Điều kiện bắt buộc để tạo Indexed View?",
      a: "- View thường: Chỉ là câu truy vấn lưu trữ sẵn, không lưu dữ liệu vật lý; mỗi lần gọi sẽ chạy lại truy vấn bên dưới.\n- Indexed View: Kết quả của View được tính toán trước và LƯU TRỰC TIẾP TRÊN ĐĨA dưới dạng một Clustered Index; khi bảng gốc thay đổi, SQL Server tự động cập nhật Indexed View.\n- Điều kiện bắt buộc: Phải tạo View với tùy chọn `WITH SCHEMABINDING`, tham chiếu bảng bằng `dbo.TenBang`, không dùng hàm non-deterministic (GETDATE), không dùng COUNT(*) (phải dùng COUNT_BIG(*)).",
      followup: "Hỏi xoáy: Trong bản SQL Server Standard, muốn câu truy vấn tự động sử dụng Indexed View mà không gọi thẳng tên View thì cần gì? (Đáp: Phải dùng gợi ý `WITH (NOEXPAND)` trên tên View)."
    },
    {
      id: "iv-29",
      level: "Junior",
      chapter: "ch10",
      topic: "AFTER Trigger vs INSTEAD OF Trigger & Bẫy Multi-row",
      q: "Phân biệt AFTER Trigger và INSTEAD OF Trigger? Bẫy chết người khi viết Trigger xử lý nhiều dòng dữ liệu cùng lúc?",
      a: "- AFTER Trigger: Chạy sau khi các ràng buộc (Constraints) đã kiểm tra hợp lệ và lệnh DML đã ghi vào bảng (nhưng chưa commit).\n- INSTEAD OF Trigger: Chạy thay thế hoàn toàn lệnh DML ban đầu (thường dùng để cập nhật trên View phức tạp).\n- BẪY MULTI-ROW: Lập trình viên viết `SELECT @id = id FROM inserted`! Khi lệnh INSERT/UPDATE chèn 1.000 dòng cùng lúc, bảng ảo `inserted` chứa 1.000 dòng nhưng biến vô hướng `@id` chỉ nhận giá trị của dòng cuối cùng! Bắt buộc phải viết Trigger theo tư duy tập hợp (Set-based) với JOIN hoặc MERGE.",
      followup: "Hỏi xoáy: Hai bảng ảo `inserted` và `deleted` lưu ở đâu? (Đáp: Lưu trong bộ nhớ tạm của Transaction Log trong TempDB)."
    },
    {
      id: "iv-30",
      level: "Junior",
      chapter: "ch06",
      topic: "Mệnh đề OUTPUT trong T-SQL",
      q: "Mệnh đề OUTPUT trong INSERT/UPDATE/DELETE dùng để làm gì và tại sao nó thay thế hiệu quả cho Trigger?",
      a: "Mệnh đề OUTPUT cho phép trả về trực tiếp các dòng dữ liệu vừa được thao tác từ bảng ảo `INSERTED.*` hoặc `DELETED.*` cho ứng dụng Backend ngay trong cùng 1 câu lệnh mà không cần thêm Trigger. Ví dụ: `INSERT INTO DonHang (...) OUTPUT INSERTED.MaDH, INSERTED.NgayDat VALUES (...);`. Giúp tăng tốc độ, giảm chi phí I/O và tránh overhead của Trigger.",
      followup: "Hỏi xoáy: Có thể đẩy dữ liệu từ OUTPUT vào một bảng khác ngay lập tức không? (Đáp: CÓ! Dùng cú pháp `OUTPUT INSERTED.* INTO BangLuuVetAudit`)."
    },
    {
      id: "iv-31",
      level: "Junior",
      chapter: "ch06",
      topic: "IDENTITY vs SEQUENCE & SCOPE_IDENTITY()",
      q: "Phân biệt `SCOPE_IDENTITY()`, `@@IDENTITY` và `IDENT_CURRENT()`? Tại sao bắt buộc dùng SCOPE_IDENTITY()?",
      a: "- `@@IDENTITY`: Trả về giá trị IDENTITY vừa sinh ra cuối cùng trên cùng kết nối, BẤT KỂ Ở PHẠM VI NÀO (Nếu câu lệnh kích hoạt Trigger chèn thêm vào bảng audit khác, `@@IDENTITY` sẽ trả về ID của bảng audit!).\n- `SCOPE_IDENTITY()`: Trả về IDENTITY sinh ra cuối cùng TRONG CÙNG PHẠM VI (Scope) thực thi hiện tại (Bỏ qua Trigger). Đây là lựa chọn an toàn duy nhất để lấy ID vừa chèn.\n- `IDENT_CURRENT('TenBang')`: Trả về ID của một bảng cụ thể bất kể kết nối nào.",
      followup: "Hỏi xoáy: SEQUENCE khác IDENTITY ở điểm mấu chốt nào? (Đáp: SEQUENCE là đối tượng độc lập ngoài bảng, có thể dùng chung cho nhiều bảng và lấy trước giá trị tiếp theo bằng `NEXT VALUE FOR` mà chưa cần INSERT)."
    },
    {
      id: "iv-32",
      level: "Junior",
      chapter: "ch07",
      topic: "Chuẩn Hóa vs Phi Chuẩn Hóa (Denormalization)",
      q: "Tại sao hệ thống OLTP luôn hướng tới 3NF trong khi hệ thống Data Warehouse / OLAP lại cố tình Phi chuẩn hóa (Denormalization)?",
      a: "- OLTP (Online Transaction Processing): Cần ghi (INSERT/UPDATE/DELETE) cực nhanh, tránh khóa tranh chấp và triệt tiêu dị thường dữ liệu nên bắt buộc chuẩn hóa 3NF/BCNF.\n- OLAP / Data Warehouse: Chủ yếu là đọc và tổng hợp báo cáo lớn (Analytical queries). Phi chuẩn hóa (Mô hình Star Schema / Snowflake) gộp các bảng lại để giảm số lượng phép nối `JOIN`, tăng tốc độ đọc dữ liệu hàng triệu dòng.",
      followup: "Hỏi xoáy: Trong hệ thống OLTP, khi nào được phép phi chuẩn hóa một cột có chủ đích? (Đáp: Khi một phép tính tổng hợp như `TongTienDonHang` hoặc `SoLuongTonKho` bị truy vấn với tần suất khổng lồ mà chi phí JOIN/SUM thời gian thực gây nghẽn toàn hệ thống)."
    },

    /* ======================================================================
       PHẦN 3: 16 CÂU HỎI MID-LEVEL (iv-33 -> iv-48)
       ====================================================================== */
    {
      id: "iv-33",
      level: "Mid",
      chapter: "ch09",
      topic: "ACID & Write-Ahead Logging (WAL)",
      q: "Giải thích 4 tính chất ACID và cơ chế Write-Ahead Logging (WAL) bảo đảm tính Bền vững (Durability) thế nào?",
      a: "1. Atomicity: Tất cả hoặc không có gì (All or Nothing).\n2. Consistency: Chuyển DB từ trạng thái hợp lệ này sang trạng thái hợp lệ khác.\n3. Isolation: Các giao dịch độc lập không can thiệp lẫn nhau.\n4. Durability: Giao dịch commit thì dữ liệu không bao giờ mất kể cả khi mất điện đột ngột.\nCơ chế WAL: Mọi thay đổi dữ liệu BẮT BUỘC PHẢI ĐƯỢC GHI XUỐNG TRANSACTION LOG TRÊN Ổ CỨNG TRƯỚC khi trang dữ liệu (Data Page) trong RAM được ghi xuống đĩa. Khi khởi động lại sau crash, SQL Server dùng Log để REDO các giao dịch đã commit và UNDO các giao dịch chưa xong.",
      followup: "Hỏi xoáy: Checkpoint process trong SQL Server làm nhiệm vụ gì? (Đáp: Định kỳ ghi toàn bộ Dirty Pages từ RAM xuống đĩa dữ liệu .mdf để rút ngắn thời gian Recovery khi khởi động lại)."
    },
    {
      id: "iv-34",
      level: "Mid",
      chapter: "ch09",
      topic: "4 Mức Cô Lập Giao Dịch & 3 Hiện Tượng Dị Thường",
      q: "Trình bày 4 mức cô lập chuẩn ANSI và 3 hiện tượng đọc dị thường tương ứng?",
      a: "1. READ UNCOMMITTED: Cho phép Dirty Read (Đọc bẩn), Non-Repeatable Read, Phantom Read.\n2. READ COMMITTED: Chặn Dirty Read; vẫn dính Non-Repeatable Read và Phantom Read.\n3. REPEATABLE READ: Chặn Dirty Read và Non-Repeatable Read; vẫn dính Phantom Read (Dòng bóng ma).\n4. SERIALIZABLE: Chặn toàn bộ 3 hiện tượng trên bằng Key-Range Lock.",
      followup: "Hỏi xoáy: Thế nào là Non-Repeatable Read và khác gì Phantom Read? (Đáp: Non-Repeatable Read là một dòng HIỆN CÓ bị sửa hoặc xóa mất giữa 2 lần đọc; Phantom Read là một dòng MỚI TINH được chèn vào giữa khoảng điều kiện tìm kiếm của 2 lần đọc)."
    },
    {
      id: "iv-35",
      level: "Mid",
      chapter: "ch09",
      topic: "Read Committed Snapshot Isolation (RCSI)",
      q: "Cơ chế RCSI (Read Committed Snapshot Isolation) trong SQL Server hoạt động ra sao và giải quyết bài toán Reader-Writer Blocking thế nào?",
      a: "Khi bật RCSI (`ALTER DATABASE db SET READ_COMMITTED_SNAPSHOT ON`):\n- Người đọc không xin Shared Lock (S-Lock).\n- Khi một dòng đang được sửa bởi Transaction A, SQL Server sao chép phiên bản cũ đã commit của dòng đó vào Version Store trong TempDB.\n- Người đọc Transaction B sẽ đọc dữ liệu từ Version Store này.\n-> KẾT QUẢ: 'Readers do not block Writers, and Writers do not block Readers' (Đọc không chặn Ghi, Ghi không chặn Đọc), tăng đột biến thông lượng cho các hệ thống tải cao.",
      followup: "Hỏi xoáy: Nhược điểm của việc bật RCSI là gì? (Đáp: Gây áp lực I/O và dung lượng lên TempDB do phải duy trì Version Store, và thêm 14 bytes overhead vào mỗi dòng dữ liệu để lưu con trỏ phiên bản)."
    },
    {
      id: "iv-36",
      level: "Mid",
      chapter: "ch09",
      topic: "Hiểm họa khi lạm dụng WITH (NOLOCK)",
      q: "Tại sao nhiều lập trình viên có thói quen thêm WITH (NOLOCK) vào mọi câu SELECT và hiểm họa khôn lường của nó là gì?",
      a: "Thói quen: Dùng NOLOCK để câu truy vấn không bị chặn khi bảng đang có tiến trình UPDATE/INSERT.\nHIỂM HỌA KHÔN LƯỜNG:\n1. Đọc phải dữ liệu dở dang bị rollback (Dirty Read).\n2. ĐỌC NHÂN ĐÔI DÒNG HOẶC ĐỌC THIẾU DÒNG: Khi bảng bị phân trang (Page Split), dòng dữ liệu bị di chuyển sang trang khác, câu lệnh quét NOLOCK có thể đọc một dòng 2 lần hoặc bỏ sót hoàn toàn một dải dòng mà không hề có lỗi báo ra!",
      followup: "Hỏi xoáy: Giải pháp thay thế chuẩn mực cho WITH (NOLOCK) là gì? (Đáp: Bật RCSI ở mức Database để đọc dữ liệu nhất quán không khóa mà không làm sai lệch dữ liệu)."
    },
    {
      id: "iv-37",
      level: "Mid",
      chapter: "ch09",
      topic: "Xử lý Deadlock (Error 1205) & 4 Quy Tắc Phòng Ngừa",
      q: "Nguyên nhân gây ra Deadlock trong SQL Server và 4 quy tắc vàng trong mã nguồn Backend để triệt tiêu Deadlock?",
      a: "Nguyên nhân: Hai hay nhiều tiến trình giữ khóa tài nguyên này và chờ khóa tài nguyên kia tạo thành một chu trình bế tắc vòng tròn.\n4 Quy tắc vàng phòng chống Deadlock:\n1. LUÔN TRUY CẬP CÁC BẢNG THEO CÙNG MỘT THỨ TỰ NHẤT QUÁN trên mọi API (ví dụ: luôn KhachHang trước -> DonHang sau).\n2. Giữ Transaction ngắn nhất có thể: Không gọi API bên thứ ba hoặc gửi email bên trong Transaction CSDL.\n3. Sử dụng mức cô lập phù hợp (bật RCSI) và đánh chỉ mục chuẩn xác để câu lệnh không bị Lock Escalation từ Row Lock lên Table Lock.\n4. Sử dụng gợi ý khóa `WITH (UPDLOCK, HOLDLOCK)` khi thực hiện pattern 'Đọc rồi Sửa' để ngăn 2 tiến trình cùng nâng cấp khóa Shared thành Exclusive cùng lúc.",
      followup: "Hỏi xoáy: Ở tầng Backend Java/C#, bạn xử lý thế nào khi bắt được SqlException 1205? (Đáp: Cài đặt cơ chế Retry Pattern với Exponential Backoff để tự động chạy lại giao dịch sau một khoảng thời gian ngẫu nhiên)."
    },
    {
      id: "iv-38",
      level: "Mid",
      chapter: "ch11",
      topic: "SQL Injection Bậc 2 & sp_executesql",
      q: "SQL Injection Bậc 2 (Second-Order SQLi) là gì? Tại sao trong T-SQL động, dùng `sp_executesql` an toàn hơn `EXEC(@sql)`?",
      a: "Second-Order SQLi: Dữ liệu độc hại được chèn an toàn vào DB ở bước 1 (nhờ Parameter), nhưng sau đó một tiến trình ngầm (batch job, trigger, báo cáo) lấy dữ liệu đó ra và NỐI CHUỖI ĐỘNG ở bước 2 để thực thi mà không tham số hóa.\n`sp_executesql` an toàn hơn vì hỗ trợ truyền tham số đầu vào (`@params`), ngăn chặn chèn mã độc, đồng thời giúp SQL Server TÁI SỬ DỤNG EXECUTION PLAN (Plan Caching) giúp tăng tốc độ đáng kể so với `EXEC()`.",
      followup: "Hỏi xoáy: Có thể truyền tên Bảng hoặc tên Cột qua tham số của sp_executesql được không? (Đáp: KHÔNG! Tên bảng và cột bắt buộc phải nối chuỗi, do đó phải kiểm tra chặt chẽ bằng hàm `QUOTENAME()` hoặc Whitelist)."
    },
    {
      id: "iv-39",
      level: "Mid",
      chapter: "ch12",
      topic: "N+1 Query Problem trong ORM (Hibernate / EF Core)",
      q: "Giải thích bài toán N+1 Query Problem trong Hibernate (JPA) và Entity Framework Core? Cách xử lý triệt để?",
      a: "Xảy ra khi ORM tải 1 danh sách gồm N bản ghi cha (1 câu SELECT), sau đó khi duyệt từng phần tử, ORM lại gửi tiếp N câu SELECT riêng lẻ để tải thực thể con (Tổng cộng 1 + N câu queries, làm tê liệt Database Network Roundtrip).\nCách xử lý:\n- JPA/Hibernate: Sử dụng `JOIN FETCH` trong JPQL/HQL, hoặc dùng `@EntityGraph`.\n- EF Core: Dùng `.Include()` để JOIN trước, hoặc dùng `.AsSplitQuery()` khi có quá nhiều bảng con để tránh Cartesian Explosion.",
      followup: "Hỏi xoáy: Lazy Loading có phải là nguyên nhân chính gây ra N+1 không? (Đáp: Đúng, Lazy Loading tự động kích hoạt truy vấn ngầm khi truy cập getter của quan hệ mà không được nạp Eager trước đó)."
    },
    {
      id: "iv-40",
      level: "Mid",
      chapter: "ch12",
      topic: "AsNoTracking() trong EF Core & readOnly trong Spring Boot",
      q: "Tại sao nên dùng `AsNoTracking()` trong EF Core và `@Transactional(readOnly = true)` trong Spring Boot cho các API chỉ đọc?",
      a: "- EF Core `AsNoTracking()`: Tắt bộ theo dõi thay đổi (Change Tracker), không lưu Snapshot đối tượng trong bộ nhớ, giảm 50% RAM và tăng tốc xử lý truy vấn đọc dữ liệu.\n- Spring Boot `@Transactional(readOnly = true)`: Báo cho Hibernate không cần thực hiện Dirty Checking khi kết thúc transaction, đồng thời cho phép JDBC Driver định tuyến truy vấn sang Read-Only Replica của cơ sở dữ liệu.",
      followup: "Hỏi xoáy: Nếu gọi `SaveChanges()` trên một thực thể được truy vấn bằng `AsNoTracking()`, điều gì sẽ xảy ra? (Đáp: EF Core sẽ không phát hiện thay đổi nào và không có lệnh UPDATE nào được gửi xuống DB)."
    },
    {
      id: "iv-41",
      level: "Mid",
      chapter: "ch12",
      topic: "Connection Pool & Lỗi Connection Leak",
      q: "Connection Pooling (HikariCP / .NET SqlClient) hoạt động thế nào? Dấu hiệu nhận biết lỗi Connection Leak?",
      a: "Tạo mới một TCP Connection tới SQL Server rất đắt đỏ (bắt tay TCP, xác thực, cấp phát phiên). Connection Pool duy trì sẵn một nhóm các kết nối đang mở; khi ứng dụng cần, nó mượn kết nối từ Pool và trả lại sau khi dùng xong mà không đóng kết nối vật lý.\nDấu hiệu Connection Leak: Số lượng Active Connections tăng dần đều cho tới khi chạm giới hạn `maxPoolSize`; các request sau bị treo và ném ngoại lệ: `Timeout waiting for connection from pool` (do quên đóng Connection / không bọc trong `try-with-resources` hoặc `using`).",
      followup: "Hỏi xoáy: Công cụ nào của HikariCP giúp phát hiện chính xác dòng code gây rò rỉ kết nối? (Đáp: Cấu hình thuộc tính `leakDetectionThreshold = 2000` (ms))."
    },
    {
      id: "iv-42",
      level: "Mid",
      chapter: "ch10",
      topic: "Hiện tượng Parameter Sniffing",
      q: "Parameter Sniffing trong SQL Server Stored Procedure là gì và 3 cách khắc phục chuyên nghiệp?",
      a: "Khi Stored Procedure được biên dịch lần đầu tiên, SQL Server 'ngửi' (sniff) giá trị tham số truyền vào lúc đó để sinh ra Execution Plan tối ưu cho giá trị đó và lưu vào Cache. Nếu giá trị đầu tiên là trường hợp dị biệt (outlier) có dữ liệu cực ít (Seek), Plan đó sẽ bị áp dụng cho các lần chạy sau có dữ liệu khổng lồ (gây nghẽn CPU và I/O).\n3 Cách khắc phục:\n1. Thêm gợi ý `OPTIMIZE FOR (@Param = UNKNOWN)` để SQL Server dùng mật độ thống kê trung bình.\n2. Gán tham số vào biến cục bộ bên trong SP: `DECLARE @localParam = @Param;` (SQL Server sẽ không thể sniff biến cục bộ lúc compile).\n3. Dùng `OPTION (RECOMPILE)` cho các SP chạy định kỳ không quá thường xuyên.",
      followup: "Hỏi xoáy: Query Store trong SQL Server 2016+ hỗ trợ gì cho Parameter Sniffing? (Đáp: Query Store cho phép cố định (Force) một Plan tốt nhất cho truy vấn bất kể tham số truyền vào)."
    },
    {
      id: "iv-43",
      level: "Mid",
      chapter: "ch08",
      topic: "3 Toán Tử Nối Vật Lý: Nested Loops vs Merge vs Hash Join",
      q: "So sánh 3 toán tử JOIN vật lý trong Execution Plan: Nested Loops, Merge Join và Hash Match Join?",
      a: "1. Nested Loops: Vòng lặp lồng nhau; cực nhanh khi một bảng rất nhỏ và bảng kia có Index Seek theo khóa nối.\n2. Merge Join: Cực kỳ hiệu quả khi CẢ HAI BẢNG ĐỀU ĐÃ ĐƯỢC SẮP XẾP theo cột nối (ví dụ đều có Clustered Index); chỉ cần duyệt song song 1 lượt qua 2 bảng.\n3. Hash Match Join: Dùng cho bảng lớn chưa được sắp xếp; SQL Server dựng bảng băm (Hash Table) trong bộ nhớ cho bảng nhỏ hơn rồi quét bảng lớn để đối chiếu. Rất tốn RAM và TempDB nếu bị tràn bộ nhớ (Hash Spill).",
      followup: "Hỏi xoáy: Khi thấy toán tử Hash Match bị cảnh báo cờ vàng Warning trong Execution Plan, nguyên nhân thường là gì? (Đáp: Bị Hash Spill to TempDB do thiếu bộ nhớ RAM được cấp phát (Memory Grant) vì bộ thống kê Statistics ước lượng sai số dòng)."
    },
    {
      id: "iv-44",
      level: "Mid",
      chapter: "ch08",
      topic: "Thứ tự cột trong Composite Index (A, B)",
      q: "Khi tạo Composite Index trên 2 cột `(TrangThai, NgayTao)`, thứ tự đặt cột nào đứng trước quyết định hiệu năng thế nào?",
      a: "Quy tắc vàng: ĐẶT CỘT CÓ ĐỘ CHỌN LỌC (SELECTIVITY) CAO NHẤT HOẶC CỘT DÙNG PHÉP SO SÁNH ĐẲNG THỨC (=) ĐỨNG ĐẦU TIÊN.\nNếu câu truy vấn là: `WHERE TrangThai = 1 AND NgayTao >= '2025-01-01'`:\n- Index `(TrangThai, NgayTao)` sẽ Seek được cả 2 cột.\n- Nếu tạo Index `(NgayTao, TrangThai)`: SQL Server chỉ Seek được cột NgayTao, sau đó phải Scan toàn bộ dải ngày đó để kiểm tra TrangThai vì sau một phép so sánh khoảng (<, >), các cột tiếp theo trong Index không thể Seek được nữa!",
      followup: "Hỏi xoáy: Index `(A, B)` có hỗ trợ câu truy vấn `WHERE B = 10` không? (Đáp: Không thể Index Seek được! Giống như tra từ điển sắp xếp theo Họ và Tên, bạn không thể tìm nhanh người có Tên là 'An' nếu không biết Họ)."
    },
    {
      id: "iv-45",
      level: "Mid",
      chapter: "ch05",
      topic: "Keyset Pagination (Seek Method) vs OFFSET-FETCH",
      q: "Tại sao phân trang bảng 10 triệu dòng bằng `OFFSET 5000000 ROWS FETCH NEXT 20` cực kỳ chậm và giải pháp Keyset Pagination giải quyết triệt để ra sao?",
      a: "Tại sao chậm: Động cơ SQL bắt buộc phải quét qua và đọc đủ 5.000.000 dòng trước đó rồi mới vứt bỏ chúng để lấy 20 dòng tiếp theo (5 triệu dòng I/O vô ích!).\nKeyset Pagination (Seek Method): Không dùng OFFSET, mà ghi nhớ khóa chính của dòng cuối cùng ở trang trước: `WHERE ID > @LastSeenID ORDER BY ID ASC FETCH NEXT 20 ROWS ONLY`. Câu lệnh này tận dụng Index Seek nhảy thẳng tới vị trí cần lấy chỉ trong 0.1ms bất kể trang thứ 1 hay trang thứ 500.000!",
      followup: "Hỏi xoáy: Hạn chế của Keyset Pagination là gì? (Đáp: Khó nhảy cóc tới một trang bất kỳ (ví dụ bấm nhảy ngay sang trang 50), chỉ phù hợp cho Infinite Scrolling hoặc Next/Previous)."
    },
    {
      id: "iv-46",
      level: "Mid",
      chapter: "ch09",
      topic: "Optimistic Concurrency Control vs Pessimistic Locking",
      q: "So sánh Khóa Lạc Quan (Optimistic Concurrency Control) và Khóa Bi Quan (Pessimistic Locking) trong thiết kế Backend?",
      a: "- Pessimistic Locking (Khóa bi quan): Giả định xung đột luôn xảy ra; dùng khóa độc quyền `SELECT ... WITH (UPDLOCK)` ngay khi đọc dòng để cấm mọi người khác can thiệp cho tới khi xử lý xong. Dùng khi tỷ lệ xung đột cao (đặt vé máy bay ghế VIP), nhược điểm là giảm hiệu năng đồng thời.\n- Optimistic Concurrency Control (Khóa lạc quan): Giả định xung đột hiếm khi xảy ra; không khóa khi đọc; thêm cột phiên bản (`ROWVERSION` trong SQL Server hoặc `@Version` trong JPA). Khi ghi, kiểm tra `WHERE Version = @OldVersion`. Nếu có người sửa trước thì báo lỗi `OptimisticLockException` để ứng dụng thử lại.",
      followup: "Hỏi xoáy: Cột ROWVERSION trong SQL Server hoạt động thế nào? (Đáp: Là kiểu số nhị phân 8 bytes tự động tăng toàn cục mỗi khi có lệnh INSERT/UPDATE trên dòng, không liên quan tới đồng hồ thời gian)."
    },
    {
      id: "iv-47",
      level: "Mid",
      chapter: "ch13",
      topic: "Đánh chỉ mục cho dữ liệu JSON trong SQL Server",
      q: "Làm thế nào để đánh chỉ mục (Index) tăng tốc độ tìm kiếm cho một trường nằm sâu trong cột JSON của SQL Server?",
      a: "SQL Server không có chỉ mục JSON riêng biệt như JSONB của PostgreSQL. Cách giải quyết chuẩn mực:\n1. Tạo một Cột Tính Toán (Computed Column) trích xuất giá trị từ JSON: `ALTER TABLE DonHang ADD MaVoucher AS JSON_VALUE(AttributesJSON, '$.VoucherCode');`\n2. Tạo Non-Clustered Index trên chính cột tính toán đó: `CREATE INDEX IX_DonHang_Voucher ON DonHang(MaVoucher);`.\n-> Khi câu lệnh `WHERE JSON_VALUE(AttributesJSON, '$.VoucherCode') = 'VIP'` chạy, SQL Server sẽ tự động map sang Index Seek trên cột tính toán!",
      followup: "Hỏi xoáy: Phân biệt `JSON_VALUE` và `JSON_QUERY`? (Đáp: `JSON_VALUE` trích xuất giá trị vô hướng (chuỗi, số); `JSON_QUERY` trích xuất một đoạn JSON con (Object hoặc Array))."
    },
    {
      id: "iv-48",
      level: "Mid",
      chapter: "ch13",
      topic: "Temporal Tables (System-Versioned Tables)",
      q: "Temporal Tables (System-Versioned) trong SQL Server là gì và ứng dụng thế nào để kiểm toán lịch sử (Audit Log) tự động?",
      a: "Temporal Tables (SQL Server 2016+) là bảng tự động lưu vết lịch sử mọi thay đổi dữ liệu mà không cần viết Trigger hay code Backend. Bảng gồm 2 cột thời gian `SysStartTime` và `SysEndTime` kèm theo một bảng lịch sử liên kết `HistoryTable`.\n- Khi UPDATE: Dòng cũ tự động chuyển sang HistoryTable với thời gian hiệu lực.\n- Khi DELETE: Dòng bị xóa tự động chuyển sang HistoryTable.\n- Truy vấn dữ liệu ở bất kỳ thời điểm nào trong quá khứ: `SELECT * FROM SanPham FOR SYSTEM_TIME AS OF '2024-01-01 10:00:00';`.",
      followup: "Hỏi xoáy: Có thể tự ý INSERT hay UPDATE dữ liệu trực tiếp vào HistoryTable của Temporal Table không? (Đáp: CẤM TUYỆT ĐỐI! SQL Server khóa cứng bảng History để đảm bảo tính toàn vẹn pháp lý của dữ liệu kiểm toán; chỉ được sửa khi tắt tạm System Versioning)."
    }
  ];

  // Đăng ký ngân hàng câu hỏi vào Registry trung tâm
  if (global.BiKipRegistry && typeof global.BiKipRegistry.setInterviewBank === "function") {
    global.BiKipRegistry.setInterviewBank(BANK);
  } else if (global.BIKIP_REGISTRY) {
    global.BIKIP_REGISTRY.interview_bank = BANK;
  }
})(typeof window !== "undefined" ? window : global);
