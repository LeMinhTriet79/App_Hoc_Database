/**
 * FILE: src/data/meta-toc.js
 * MÔ TẢ: Thông tin chung của sách CHM và danh mục tóm tắt các chương
 */
window.BIKIP_REGISTRY.registerToc({
  "title": "BiKipCoSoDuLieu_Java_DotNet_v2005.chm",
  "subtitle": "Giáo Trình & Phòng Lab SQL Thực Chiến Cho Sinh Viên Backend Java / .NET",
  "edition": "MSDN HTML Help Edition v2005 (CC BY-SA 4.0)",
  "total_chapters": 16,
  "total_problems": 77,
  "chapters_summary": [
    {
      "id": "ch01",
      "code": "Chương 1",
      "title": "SELECT, Lọc Dữ Liệu, NULL & Kiểu Dữ Liệu",
      "pages_note": "6 ví dụ, 5 bài tập",
      "desc": "Hiểu rõ thứ tự tư duy khi trích xuất dữ liệu bằng SELECT, FROM, WHERE, DISTINCT, ORDER BY và giới hạn dòng.; Nắm vững Logic Ba Giá Trị (Three-Valued Logic: TRUE, FALSE, UNKNOWN) khi làm việc với NULL.",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (6)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (6)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (5)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch02",
      "code": "Chương 2",
      "title": "Hàm Xử Lý Chuỗi, Ngày Giờ, CASE, COALESCE & Ép Kiểu",
      "pages_note": "6 ví dụ, 4 bài tập",
      "desc": "Thành thạo bộ hàm xử lý chuỗi, ngày giờ và toán học để làm sạch dữ liệu ngay trong câu truy vấn.; Phân biệt rành mạch COALESCE (chuẩn ANSI) và ISNULL (đặc thù T-SQL) về kiểu dữ liệu trả về và hiệu năng.",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (6)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (5)",
        "9. Câu hỏi phỏng vấn (2)",
        "10. Bài tập cơ bản & Luyện Lab (4)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch03",
      "code": "Chương 3",
      "title": "Các Phép Nối Bảng (JOIN) & Toán Tử Tập Hợp (UNION, EXCEPT, INTERSECT)",
      "pages_note": "6 ví dụ, 5 bài tập",
      "desc": "Hiểu sâu bản chất từng loại JOIN: INNER JOIN, LEFT/RIGHT/FULL OUTER JOIN, CROSS JOIN và SELF JOIN.; Phân biệt tuyệt đối vai trò của điều kiện đặt trong ON và điều kiện đặt trong WHERE đối với OUTER JOIN.",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (6)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (5)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (5)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch04",
      "code": "Chương 4",
      "title": "Gom Nhóm (GROUP BY, HAVING), Hàm Tổng Hợp, Subquery & EXISTS",
      "pages_note": "6 ví dụ, 5 bài tập",
      "desc": "Nắm vững cơ chế hoạt động của 5 hàm tổng hợp chuẩn (COUNT, SUM, AVG, MIN, MAX) và cách chúng đối xử với NULL.; Hiểu rõ quy tắc gom nhóm GROUP BY và phân biệt rành mạch điều kiện lọc ở WHERE với điều kiện lọc ở HAVING.",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (6)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (5)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (5)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch05",
      "code": "Chương 5",
      "title": "Window Functions, CTE, Đệ Quy, Phân Trang & Khử Trùng Lặp",
      "pages_note": "6 ví dụ, 5 bài tập",
      "desc": "Làm chủ các hàm cửa sổ (Window Functions): xếp hạng (ROW_NUMBER, RANK, DENSE_RANK, NTILE), dịch dòng (LAG, LEAD) và tổng hợp trên khung cửa sổ.; Hiểu rõ CTE (Common Table Expression) thường và CTE Đệ quy (Recursive CTE) để xử lý cấu trúc cây danh mục/nhân sự.",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (6)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (5)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (5)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch06",
      "code": "Chương 6",
      "title": "Thao Tác & Định Nghĩa Dữ Liệu (DML & DDL), Ràng Buộc, Sequence & Identity",
      "pages_note": "5 ví dụ, 4 bài tập",
      "desc": "So sánh sâu sắc ba lệnh xóa DELETE, TRUNCATE và DROP dưới góc độ Transaction Log, Khóa (Lock), Trigger và Identity.; Viết đúng và an toàn các câu lệnh INSERT, UPDATE có JOIN/Subquery, và Upsert (MERGE / ON CONFLICT).",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (5)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (5)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (4)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch07",
      "code": "Chương 7",
      "title": "Thiết Kế Cơ Sở Dữ Liệu, Sơ Đồ ER & Lý Thuyết Chuẩn Hóa (1NF đến BCNF)",
      "pages_note": "4 ví dụ, 3 bài tập",
      "desc": "Đọc và thiết kế thành thạo sơ đồ thực thể liên kết (ERD): phân biệt quan hệ 1-1, 1-N, N-N và thực thể yếu.; Hiểu bản chất Phụ thuộc hàm (Functional Dependency) và áp dụng thuần thục quy trình chuẩn hóa từ 1NF, 2NF, 3NF đến BCNF.",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (4)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (5)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (3)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch08",
      "code": "Chương 8",
      "title": "Index (B-Tree, Clustered, Covering), Sargability & Đọc Execution Plan",
      "pages_note": "5 ví dụ, 3 bài tập",
      "desc": "Hiểu rõ cấu trúc cây cân bằng B+Tree (Root, Intermediate, Leaf pages) và tại sao tìm kiếm trên Index chỉ tốn O(log N) lần đọc trang đĩa.; Phân biệt rành mạch Clustered Index và Non-Clustered Index, giải thích được bản chất của thao tác Key Lookup (Bookmark Lookup) và cách khử nó bằng Covering Index (INCLUDE).",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (5)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (5)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (3)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch09",
      "code": "Chương 9",
      "title": "Transaction, ACID, Isolation Levels, Locking & Giải Quyết Deadlock",
      "pages_note": "5 ví dụ, 3 bài tập",
      "desc": "Giải thích sâu sắc 4 tính chất ACID và cơ chế vật lý đứng sau từng chữ cái (Write-Ahead Logging, Lock/MVCC).; Phân biệt 4 hiện tượng đọc đồng thời (Dirty Read, Non-Repeatable Read, Phantom Read, Lost Update) và bảng ma trận 4 mức cô lập chuẩn ANSI cộng thêm SNAPSHOT.",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (5)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (5)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (3)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch10",
      "code": "Chương 10",
      "title": "Đối Tượng Lập Trình CSDL: View, Stored Procedure, Function, Trigger, Cursor & Temp Table",
      "pages_note": "5 ví dụ, 3 bài tập",
      "desc": "Hiểu rõ bản chất, lợi ích và giới hạn của View (khung nhìn thường vs Indexed/Materialized View).; So sánh rành mạch Stored Procedure (Thủ tục lưu trữ) và User-Defined Function (Hàm tự định nghĩa: Scalar UDF vs Inline Table-Valued Function).",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (5)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (5)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (3)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch11",
      "code": "Chương 11",
      "title": "Bảo Mật CSDL: Phòng Chống SQL Injection, Phân Quyền (GRANT/REVOKE/DENY), Schema & Data Masking",
      "pages_note": "5 ví dụ, 3 bài tập",
      "desc": "Hiểu tận gốc cơ chế của SQL Injection (tách biệt Mã lệnh - Code và Dữ liệu - Data) và tại sao PreparedStatement / Parameterized Query chặn đứng được nó.; Xử lý an toàn các tình huống không thể dùng tham số `?` như truyền động tên cột sắp xếp (ORDER BY) hoặc danh sách bảng.",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (5)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (5)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (3)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch12",
      "code": "Chương 12",
      "title": "Cầu Nối Ứng Dụng Backend (Java & .NET): ORM, N+1 Query, Connection Pool & Migration",
      "pages_note": "4 ví dụ, 3 bài tập",
      "desc": "So sánh kiến trúc truy cập dữ liệu giữa Low-level Driver (JDBC / ADO.NET), Micro-ORM (JdbcTemplate, Jdbi / Dapper) và Full ORM (Hibernate/JPA / EF Core).; Nhận diện tận gốc căn bệnh kinh niên 'N+1 Query Problem' trong ORM và nắm vững 3 cách chữa trị (JOIN FETCH / Include, EntityGraph, Batch Fetching / Split Query).",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (4)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (5)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (3)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch13",
      "code": "Chương 13",
      "title": "SQL Server Nâng Cao: JSON, PIVOT/UNPIVOT, Computed Column, Temporal Table, Partitioning & Columnstore",
      "pages_note": "5 ví dụ, 3 bài tập",
      "desc": "Sử dụng thành thạo bộ công cụ JSON trong SQL Server (ISJSON, JSON_VALUE, JSON_QUERY, JSON_MODIFY, OPENJSON, FOR JSON) và biết cách đánh Index cho thuộc tính JSON.; Xoay bảng linh hoạt từ dòng sang cột (PIVOT) và từ cột sang dòng (UNPIVOT) bằng cả cú pháp T-SQL lẫn cú pháp CASE chuẩn ANSI.",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (5)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (5)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (3)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch14",
      "code": "Chương 14",
      "title": "Chiến Thuật Ôn Phỏng Vấn Tổng Hợp & Giải Phẫu 12 Bài SQL Kinh Điển (LeetCode #175 - #197)",
      "pages_note": "5 ví dụ, 6 bài tập",
      "desc": "Nắm vững khung tư duy 4 bước khi giải bài tập SQL trực tiếp trên bảng trắng hoặc màn hình chia sẻ lúc phỏng vấn.; Nhận diện ngay lập tức 'Mẫu bài toán' (Query Pattern) chỉ sau 10 giây đọc đề bài.",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (5)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (5)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (6)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    },
    {
      "id": "ch15",
      "code": "Chương 15",
      "title": "Từ Điển Từ Khóa T-SQL Tổng Hợp (Từ Cốt Lõi Đến Nâng Cao)",
      "pages_note": "64 thẻ từ khóa, 2 ví dụ, 10 bài tập",
      "desc": "Tra cứu nhanh hơn 60 từ khóa và hàm T-SQL thông dụng thông qua cấu trúc Thẻ 4 Phần (4-Part Card) chuẩn hóa trên cùng một CSDL thực chiến FruitStore_Ultimate.; Nắm vững Phần A (Từ khóa & Hàm Cốt Lõi - Ưu tiên số 1 bắt buộc phải thuộc lòng cho lập trình viên Backend Java / .NET khi đi làm và phỏng vấn Fresher/Junior).",
      "sections": [
        "1. Mục tiêu & Dấu hiệu nhận biết",
        "2. Lý thuyết & Định nghĩa",
        "3. Cơ chế & Chạy tay từng bước",
        "4. Cú pháp & Ví dụ (2)",
        "5. Khác biệt phương ngữ",
        "6. Cầu nối Java & C#",
        "7. Hiệu năng & Chi phí",
        "8. Lỗi hay gặp (3)",
        "9. Câu hỏi phỏng vấn (3)",
        "10. Bài tập cơ bản & Luyện Lab (10)",
        "11. Tổng kết & Tự kiểm tra"
      ]
    }
  ]
});
