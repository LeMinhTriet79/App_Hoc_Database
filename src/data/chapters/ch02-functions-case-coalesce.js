/**
 * FILE: src/data/chapters/ch02-functions-case-coalesce.js
 * MÔ TẢ: Chương 2 - Hàm Xử Lý Chuỗi, Ngày Giờ, CASE, COALESCE & Ép Kiểu
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch02",
  "code": "Chương 2",
  "title": "Hàm Xử Lý Chuỗi, Ngày Giờ, CASE, COALESCE & Ép Kiểu",
  "sources": [
    "S ch.10, 41, 43",
    "M ch.9, 12, 14, 25, 41, 42, 44"
  ],
  "goals": [
    "Thành thạo bộ hàm xử lý chuỗi, ngày giờ và toán học để làm sạch dữ liệu ngay trong câu truy vấn.",
    "Phân biệt rành mạch COALESCE (chuẩn ANSI) và ISNULL (đặc thù T-SQL) về kiểu dữ liệu trả về và hiệu năng.",
    "Sử dụng linh hoạt biểu thức điều kiện CASE ... WHEN và hàm NULLIF để phòng chống lỗi chia cho 0.",
    "Nắm vững CAST, CONVERT và TRY_CAST / TRY_CONVERT để chuyển đổi kiểu dữ liệu an toàn."
  ],
  "signals": [
    "Cần hiển thị giá trị mặc định ('Chưa cập nhật', 0) khi dữ liệu trên bảng bị NULL để báo cáo không bị trống.",
    "Cần gom nhóm hoặc gắn nhãn phân khúc khách hàng (VIP, Thân thiết, Mới) dựa trên nhiều ngưỡng điều kiện.",
    "Tính toán doanh thu ròng, tỷ lệ phần trăm hoàn thành mà mẫu số có khả năng bằng 0."
  ],
  "theory": "<h3>2.1. Biểu thức điều kiện CASE: Câu lệnh IF-ELSE của thế giới SQL</h3>\n<p>SQL là ngôn ngữ khai báo nên bạn không thể nhét câu lệnh điều khiển <code>if (...) { ... }</code> của Java/C# vào giữa danh sách cột của <code>SELECT</code>. Thay vào đó, chuẩn ANSI SQL cung cấp <strong>biểu thức <code>CASE</code></strong> dưới hai hình thức:</p>\n<ul>\n  <li><strong>Simple CASE (So sánh bằng trực tiếp):</strong> <code>CASE TrangThai WHEN 'HOAN_THANH' THEN 'Xong' WHEN 'DA_HUY' THEN 'Hủy' ELSE 'Đang xử lý' END</code>. Lưu ý: Simple CASE dùng phép so sánh <code>=</code> ngầm định, nên bạn <strong>không thể</strong> viết <code>WHEN NULL THEN ...</code> ở dạng này!</li>\n  <li><strong>Searched CASE (Đánh giá biểu thức điều kiện bất kỳ):</strong> <code>CASE WHEN Diem &gt;= 8.5 THEN 'Giỏi' WHEN Diem IS NULL THEN 'Chưa thi' ELSE 'Khá/TB' END</code>. Đây là dạng linh hoạt và an toàn nhất.</li>\n</ul>\n<p><strong>Quy tắc quan trọng:</strong> Nếu bạn bỏ qua nhánh <code>ELSE</code> và không có nhánh <code>WHEN</code> nào đúng, biểu thức <code>CASE</code> sẽ tự động trả về <code>NULL</code>.</p>\n\n<h3>2.2. Cuộc đối đầu kinh điển: COALESCE vs ISNULL (trong SQL Server)</h3>\n<p>Cả hai đều dùng để thay thế giá trị <code>NULL</code> bằng một giá trị dự phòng, nhưng chúng có 4 điểm khác biệt rất hay bị hỏi xoáy khi phỏng vấn .NET và Java:</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Tiêu chí</th>\n      <th>COALESCE(val1, val2, ..., valN)</th>\n      <th>ISNULL(check_expr, replacement_val)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>Tính chuẩn hóa</strong></td>\n      <td>Chuẩn ANSI SQL (chạy được trên SQL Server, PostgreSQL, MySQL, Oracle, SQLite).</td>\n      <td>Đặc thù của T-SQL (trong MySQL, <code>ISNULL(x)</code> chỉ trả về 1 hoặc 0 chứ không thay thế giá trị!).</td>\n    </tr>\n    <tr>\n      <td><strong>Số lượng đối số</strong></td>\n      <td>Nhận từ 2 đến nhiều đối số, trả về giá trị khác NULL đầu tiên từ trái sang phải.</td>\n      <td>Chỉ nhận đúng 2 đối số.</td>\n    </tr>\n    <tr>\n      <td><strong>Quyết định kiểu dữ liệu</strong></td>\n      <td>Lấy theo kiểu dữ liệu có <strong>độ ưu tiên cao nhất (Data Type Precedence)</strong> trong các đối số.</td>\n      <td>Lấy cứng theo kiểu dữ liệu và độ dài của <strong>đối số thứ nhất</strong>!</td>\n    </tr>\n    <tr>\n      <td><strong>Bẫy cắt cụt chuỗi (Truncation)</strong></td>\n      <td>An toàn: nếu cột là <code>VARCHAR(3)</code> đang NULL và dự phòng là <code>'KHONG_CO'</code>, kết quả mở rộng thành <code>VARCHAR(8)</code>.</td>\n      <td><strong>Nguy hiểm:</strong> nếu cột <code>MaKhoa VARCHAR(3)</code> đang NULL, viết <code>ISNULL(MaKhoa, 'CHUA_PHAN')</code> sẽ bị cắt cụt thành <code>'CHU'</code> (đúng 3 ký tự)!</td>\n    </tr>\n  </tbody>\n</table>\n\n<h3>2.3. Ép kiểu dữ liệu: CAST, CONVERT và TRY_CAST</h3>\n<ul>\n  <li><code>CAST(bieu_thuc AS kieu_du_lieu)</code>: Cú pháp chuẩn ANSI SQL, đọc rất tự nhiên và chạy được trên hầu hết các hệ quản trị CSDL.</li>\n  <li><code>CONVERT(kieu_du_lieu, bieu_thuc [, style])</code>: Cú pháp riêng của SQL Server, mạnh ở tham số <code>style</code> thứ ba giúp định dạng ngày tháng thành chuỗi theo chuẩn quốc gia (ví dụ style <code>103</code> là <code>dd/MM/yyyy</code> của Việt Nam/Anh, style <code>120</code> là chuẩn <code>yyyy-MM-dd HH:mm:ss</code>).</li>\n  <li><code>TRY_CAST</code> và <code>TRY_CONVERT</code> (T-SQL): Khi dữ liệu đầu vào bị bẩn (ví dụ cột lưu số điện thoại hoặc số tiền dạng chữ bị lẫn chữ cái <code>'120k'</code>), <code>CAST</code> thường sẽ ném lỗi làm dừng toàn bộ câu lệnh, còn <code>TRY_CAST</code> trả về <code>NULL</code> tại dòng lỗi đó và tiếp tục chạy các dòng còn lại.</li>\n</ul>",
  "mechanism": "<h3>Chạy tay từng bước: Cách COALESCE, NULLIF và CASE biến đổi từng dòng dữ liệu</h3>\n<p>Xét bảng trung gian lấy từ <code>ChiTietDon</code> của đơn <code>1001</code> và <code>1002</code>, ta cần tính <strong>Tỷ lệ chiết khấu (%) = ChietKhau * 100.0 / (SoLuong * DonGiaBan)</strong> và phân loại mức ưu đãi:</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>MaDH</th>\n      <th>MaSP</th>\n      <th>TienHang (SL*Gia)</th>\n      <th>ChietKhau gốc</th>\n      <th>Bước 1: COALESCE(ChietKhau, 0)</th>\n      <th>Bước 2: Chia cho NULLIF(TienHang, 0)</th>\n      <th>Bước 3: CASE phân loại</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>1001</td>\n      <td>101</td>\n      <td>1800</td>\n      <td>100</td>\n      <td>100 (vì 100 khác NULL)</td>\n      <td>100 * 100.0 / 1800 = <strong>5.56%</strong></td>\n      <td>WHEN &gt;= 5% &rarr; <strong>'Giam Sau'</strong></td>\n    </tr>\n    <tr>\n      <td>1001</td>\n      <td>106</td>\n      <td>700</td>\n      <td>NULL</td>\n      <td><strong>0</strong> (thay NULL bằng 0)</td>\n      <td>0 * 100.0 / 700 = <strong>0.00%</strong></td>\n      <td>ELSE &rarr; <strong>'Nguyen Gia'</strong></td>\n    </tr>\n    <tr>\n      <td>1002</td>\n      <td>102</td>\n      <td>2200</td>\n      <td>0</td>\n      <td>0</td>\n      <td>0 * 100.0 / 2200 = <strong>0.00%</strong></td>\n      <td>ELSE &rarr; <strong>'Nguyen Gia'</strong></td>\n    </tr>\n    <tr>\n      <td>1002</td>\n      <td>104</td>\n      <td>6900</td>\n      <td>400</td>\n      <td>400</td>\n      <td>400 * 100.0 / 6900 = <strong>5.80%</strong></td>\n      <td>WHEN &gt;= 5% &rarr; <strong>'Giam Sau'</strong></td>\n    </tr>\n  </tbody>\n</table>\n<p><strong>Lưu ý cơ chế Short-Circuit của COALESCE:</strong> Trong chuẩn SQL, <code>COALESCE(a, b)</code> được viết lại thành <code>CASE WHEN a IS NOT NULL THEN a ELSE b END</code>. Vì vậy nếu đối số <code>a</code> là một biểu thức con phức tạp hoặc một subquery, trong một số phiên bản SQL Server cũ nó có thể bị đánh giá hai lần (một lần ở điều kiện <code>WHEN</code>, một lần ở kết quả <code>THEN</code>).</p>",
  "examples": [
    {
      "title": "Ví dụ 2.1: Xử lý chuỗi với UPPER, LOWER, TRIM, SUBSTR và nối chuỗi",
      "label": "CHUAN",
      "db": "autoshop",
      "sql": "SELECT Id,\n       UPPER(FName) || ' ' || LName AS HoTenInHoa,\n       SUBSTR(PhoneNumber, 1, 3) AS DauSo,\n       LENGTH(LName) AS DoDaiTen\nFROM Employees;",
      "result": {
        "cols": [
          "Id",
          "HoTenInHoa",
          "DauSo",
          "DoDaiTen"
        ],
        "rows": [
          [
            1,
            "JAMES Smith",
            "123",
            5
          ],
          [
            2,
            "JOHN Johnson",
            "246",
            7
          ],
          [
            3,
            "MICHAEL Williams",
            "135",
            8
          ],
          [
            4,
            "JOHNATHON Smith",
            "121",
            5
          ],
          [
            5,
            "WILLIAM Morris",
            "555",
            6
          ],
          [
            6,
            "SARAH Connor",
            null,
            6
          ]
        ]
      },
      "note": "Trong SQLite/PostgreSQL/Oracle, toán tử || dùng để nối chuỗi. Lưu ý: nếu nối chuỗi bằng || hoặc + với một cột NULL, kết quả có thể biến thành NULL."
    },
    {
      "title": "Ví dụ 2.2: Thay thế giá trị NULL bằng COALESCE trong tính toán tiền hàng",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "SELECT MaDH, MaSP, SoLuong, DonGiaBan, ChietKhau,\n       (SoLuong * DonGiaBan) - COALESCE(ChietKhau, 0) AS ThanhTienChuan,\n       (SoLuong * DonGiaBan) - ChietKhau AS ThanhTienBiLoiNull\nFROM ChiTietDon\nWHERE MaDH IN (1001, 1002);",
      "result": {
        "cols": [
          "MaDH",
          "MaSP",
          "SoLuong",
          "DonGiaBan",
          "ChietKhau",
          "ThanhTienChuan",
          "ThanhTienBiLoiNull"
        ],
        "rows": [
          [
            1001,
            101,
            1,
            1800,
            100,
            1700,
            1700
          ],
          [
            1001,
            106,
            2,
            350,
            null,
            700,
            null
          ],
          [
            1002,
            102,
            1,
            2200,
            0,
            2200,
            2200
          ],
          [
            1002,
            104,
            1,
            6900,
            400,
            6500,
            6500
          ]
        ]
      },
      "note": "Quan sát cột ThanhTienBiLoiNull: khi ChietKhau là NULL, toàn bộ phép trừ biến thành NULL! Hàm COALESCE(ChietKhau, 0) chuyển NULL thành 0 giúp phép tính chính xác."
    },
    {
      "title": "Ví dụ 2.3: Phân loại dữ liệu động bằng biểu thức CASE ... WHEN ... END",
      "label": "CHUAN",
      "db": "autoshop",
      "sql": "SELECT Id, FName, Salary,\n       CASE\n           WHEN Salary >= 800 THEN 'Bac Cao (Senior)'\n           WHEN Salary >= 500 THEN 'Bac Trung (Mid)'\n           ELSE 'Bac Khoi Dau (Junior)'\n       END AS CapBacLuong\nFROM Employees\nORDER BY Salary DESC;",
      "result": {
        "cols": [
          "Id",
          "FName",
          "Salary",
          "CapBacLuong"
        ],
        "rows": [
          [
            1,
            "James",
            1000,
            "Bac Cao (Senior)"
          ],
          [
            5,
            "William",
            800,
            "Bac Cao (Senior)"
          ],
          [
            6,
            "Sarah",
            750,
            "Bac Trung (Mid)"
          ],
          [
            3,
            "Michael",
            600,
            "Bac Trung (Mid)"
          ],
          [
            4,
            "Johnathon",
            500,
            "Bac Trung (Mid)"
          ],
          [
            2,
            "John",
            400,
            "Bac Khoi Dau (Junior)"
          ]
        ]
      },
      "note": "CASE đánh giá tuần tự từ trên xuống dưới và dừng lại ngay ở nhánh WHEN đầu tiên thỏa mãn điều kiện."
    },
    {
      "title": "Ví dụ 2.4: Tránh lỗi chia cho 0 (Divide by Zero) bằng hàm NULLIF",
      "label": "CHUAN",
      "db": "truonghoc",
      "sql": "SELECT MaSV, HoTen, HocBong,\n       ROUND(10000.0 / NULLIF(HocBong, 0), 2) AS TyLeThuong\nFROM SinhVien;",
      "result": {
        "cols": [
          "MaSV",
          "HoTen",
          "HocBong",
          "TyLeThuong"
        ],
        "rows": [
          [
            201,
            "Bui Minh Tuan",
            5000,
            2.0
          ],
          [
            202,
            "Doan Thu Ha",
            8000,
            1.25
          ],
          [
            203,
            "Ngo Quang Khai",
            null,
            null
          ],
          [
            204,
            "Ly Ngoc Mai",
            3000,
            3.33
          ],
          [
            205,
            "Trinh Gia Bao",
            0,
            null
          ],
          [
            206,
            "Vu Thanh Thao",
            null,
            null
          ]
        ]
      },
      "note": "Sinh viên Trinh Gia Bao có HocBong = 0. Hàm NULLIF(HocBong, 0) trả về NULL khi HocBong bằng 0, nhờ đó phép chia 10000.0 / NULL trả về NULL êm đẹp thay vì làm sập truy vấn bởi lỗi Divide by zero."
    },
    {
      "title": "Ví dụ 2.5: Các hàm xử lý ngày tháng và kiểu dữ liệu đặc trưng trong T-SQL",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "SELECT MaDH, NgayDat,\n       DATEADD(day, 7, NgayDat) AS HanDoiTra,\n       DATEDIFF(day, NgayDat, '2024-04-01') AS SoNgayDaQua,\n       ISNULL(MaGiamGia, 'KHONG_DUNG') AS Voucher,\n       TRY_CAST('123a' AS INT) AS EpKieuAnToan\nFROM DonHang\nWHERE MaDH <= 1003;",
      "result": {
        "cols": [
          "MaDH",
          "NgayDat",
          "HanDoiTra",
          "SoNgayDaQua",
          "Voucher",
          "EpKieuAnToan"
        ],
        "rows": [
          [
            1001,
            "2024-01-05",
            "2024-01-12",
            87,
            "TET2024",
            null
          ],
          [
            1002,
            "2024-01-12",
            "2024-01-19",
            80,
            "KHONG_DUNG",
            null
          ],
          [
            1003,
            "2024-02-01",
            "2024-02-08",
            60,
            "KHONG_DUNG",
            null
          ]
        ]
      },
      "note": "Trong SQL Server, TRY_CAST và TRY_CONVERT trả về NULL nếu chuỗi không ép kiểu được sang số/ngày, tránh văng Exception. (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    },
    {
      "title": "Ví dụ 2.6: Bản [CHUẨN] tương đương xử lý ngày tháng và CAST trên SQLite",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "SELECT MaDH, NgayDat,\n       DATE(NgayDat, '+7 days') AS HanDoiTra,\n       CAST(JULIANDAY('2024-04-01') - JULIANDAY(NgayDat) AS INT) AS SoNgayDaQua,\n       COALESCE(MaGiamGia, 'KHONG_DUNG') AS Voucher\nFROM DonHang\nWHERE MaDH <= 1003;",
      "result": {
        "cols": [
          "MaDH",
          "NgayDat",
          "HanDoiTra",
          "SoNgayDaQua",
          "Voucher"
        ],
        "rows": [
          [
            1001,
            "2024-01-05",
            "2024-01-12",
            87,
            "TET2024"
          ],
          [
            1002,
            "2024-01-12",
            "2024-01-19",
            80,
            "KHONG_DUNG"
          ],
          [
            1003,
            "2024-02-01",
            "2024-02-08",
            60,
            "KHONG_DUNG"
          ]
        ]
      },
      "note": "Trên SQLite, hàm DATE(col, '+7 days') cộng thêm 7 ngày, và hiệu hai JULIANDAY() cho biết số ngày chênh lệch."
    }
  ],
  "dialects": [
    [
      "Nối chuỗi an toàn (bỏ qua NULL)",
      "CONCAT(a, ' ', b)",
      "CONCAT(a, ' ', b) / CONCAT_WS",
      "CONCAT(a, ' ', b)"
    ],
    [
      "Thay thế giá trị NULL",
      "COALESCE(x, y) hoặc ISNULL(x, y)",
      "COALESCE(x, y) hoặc IFNULL(x, y)",
      "COALESCE(x, y)"
    ],
    [
      "Lấy ngày giờ hiện tại",
      "GETDATE(), SYSDATETIME()",
      "NOW(), CURRENT_TIMESTAMP",
      "NOW(), CURRENT_TIMESTAMP"
    ],
    [
      "Cộng thêm 7 ngày",
      "DATEADD(day, 7, col)",
      "DATE_ADD(col, INTERVAL 7 DAY)",
      "col + INTERVAL '7 days'"
    ],
    [
      "Độ dài chuỗi (số ký tự)",
      "LEN(s) (bỏ khoảng trắng cuối!)",
      "CHAR_LENGTH(s)",
      "CHAR_LENGTH(s) / LENGTH(s)"
    ]
  ],
  "bridge_java": "// [Java - Spring Data JPA / JDBC] Tránh lỗi phép chia số nguyên và xử lý ngày giờ chuẩn UTC\n// Trong SQL cũng như Java, phép chia hai số nguyên (100 / 1800) sẽ ra 0!\n// Phải nhân với 1.0 hoặc 100.0 trước khi chia, hoặc ép kiểu CAST(x AS DECIMAL(10,2)).\n\nString sql = \"\"\"\n    SELECT MaDH, MaSP,\n           (SoLuong * DonGiaBan) - COALESCE(ChietKhau, 0) AS ThanhTien,\n           ROUND(COALESCE(ChietKhau, 0) * 100.0 / NULLIF(SoLuong * DonGiaBan, 0), 2) AS PhanTramGiam\n    FROM ChiTietDon\n    WHERE MaDH = ?\n    \"\"\";\nList<Map<String, Object>> items = jdbcTemplate.queryForList(sql, 1001);",
  "bridge_csharp": "// [C# - EF Core LINQ sang SQL] Cách EF Core dịch toán tử ?? sang COALESCE\n// Khi bạn viết toán tử null-coalescing (??) trong biểu thức LINQ to Entities,\n// EF Core sẽ tự động biên dịch nó thành hàm COALESCE(...) trong câu lệnh SQL gửi xuống DB!\n\nvar query = dbContext.ChiTietDons\n    .Where(ct => ct.MaDH == 1001)\n    .Select(ct => new {\n        ct.MaDH,\n        ct.MaSP,\n        // EF Core dịch (ct.ChietKhau ?? 0) thành COALESCE([c].[ChietKhau], 0)\n        ThanhTien = (ct.SoLuong * ct.DonGiaBan) - (ct.ChietKhau ?? 0),\n        MucGia = ct.DonGiaBan >= 5000 ? \"Cao Cap\" : \"Pho Thong\" // Dịch thành CASE WHEN ...\n    });\nvar result = await query.ToListAsync();",
  "performance": "<ul>\n  <li><strong>Tuyệt đối hạn chế bọc hàm quanh cột đang được lọc ở vế trái mệnh đề WHERE:</strong> Nếu bạn viết <code>WHERE YEAR(NgayDat) = 2024</code> hoặc <code>WHERE UPPER(Email) = 'AN@GMAIL.COM'</code>, máy chủ CSDL phải chạy hàm <code>YEAR()</code> hay <code>UPPER()</code> trên từng dòng của toàn bộ bảng trước khi so sánh, làm vô hiệu hóa hoàn toàn Index trên cột <code>NgayDat</code> hoặc <code>Email</code> (vi phạm tính <em>Sargable</em>, sẽ mổ xẻ ở Chương 8). Hãy viết lại thành <code>WHERE NgayDat &gt;= '2024-01-01' AND NgayDat &lt; '2025-01-01'</code>.</li>\n  <li><strong>Ép kiểu ngầm định (Implicit Conversion):</strong> Nếu cột <code>SoDT</code> trong bảng có kiểu <code>VARCHAR(15)</code> nhưng bạn truyền tham số kiểu số nguyên <code>WHERE SoDT = 901112222</code> (hoặc truyền chuỗi <code>NVARCHAR</code> từ ORM vào cột <code>VARCHAR</code>), SQL Server sẽ tự động bọc hàm <code>CONVERT_IMPLICIT</code> lên cột <code>SoDT</code> của mọi dòng trong bảng, gây <em>Index Scan</em> cực kỳ tốn CPU.</li>\n</ul>",
  "common_errors": [
    "Viết CASE col WHEN NULL THEN ...: Ở dạng Simple CASE, phép so sánh ngầm định là col = NULL (luôn ra UNKNOWN), nên nhánh WHEN NULL không bao giờ chạy. Phải dùng Searched CASE: CASE WHEN col IS NULL THEN ...",
    "Bẫy cắt cụt chuỗi của ISNULL(col, replacement) trong SQL Server: Nếu col là VARCHAR(5) đang NULL, ISNULL(col, 'KHONG_XAC_DINH') chỉ trả về 'KHONG'. Nên ưu tiên dùng COALESCE.",
    "Hàm LEN() trong SQL Server tự động cắt bỏ khoảng trắng ở cuối chuỗi (Trailing spaces): LEN('ABC   ') trả về 3 chứ không phải 6! Muốn đếm cả khoảng trắng cuối phải dùng DATALENGTH() (nhưng lưu ý DATALENGTH đếm số bytes).",
    "Chia hai số nguyên trong SQL (ví dụ 1 / 2) trả về 0 thay vì 0.5 trong cả SQL Server, PostgreSQL và SQLite. Phải viết 1.0 / 2 hoặc CAST(1 AS REAL) / 2.",
    "Nối chuỗi bằng toán tử '+' (trong SQL Server) hoặc '||' (trong SQLite/Postgres) với một cột mang giá trị NULL sẽ làm toàn bộ chuỗi kết quả biến thành NULL. Hãy dùng hàm CONCAT() hoặc bọc COALESCE(col, '')."
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "Sự khác nhau giữa hàm COALESCE và hàm ISNULL trong SQL Server là gì?",
      "a_short": "COALESCE là chuẩn ANSI SQL, nhận nhiều tham số và lấy kiểu dữ liệu theo độ ưu tiên cao nhất; ISNULL là hàm riêng của T-SQL, chỉ nhận 2 tham số và ép kiểu theo tham số đầu tiên.",
      "a_long": "Có 3 điểm khác biệt cốt lõi: (1) Tính tương thích: COALESCE chạy được trên mọi hệ CSDL quan hệ, còn ISNULL chỉ có trên T-SQL. (2) Số đối số: COALESCE(a, b, c) duyệt từ trái qua phải trả về giá trị khác NULL đầu tiên, ISNULL(a, b) chỉ có 2 đối số. (3) Kiểu dữ liệu và độ dài: ISNULL lấy kiểu và độ dài của tham số đầu tiên nên rất dễ gây lỗi cắt cụt chuỗi ngầm định (silent truncation), trong khi COALESCE tuân theo quy tắc Data Type Precedence."
    },
    {
      "level": "Junior",
      "q": "Làm thế nào để viết một phép chia tính tỷ lệ phần trăm trong SQL mà không bao giờ bị lỗi Divide by Zero khi mẫu số bằng 0?",
      "a_short": "Bọc mẫu số trong hàm NULLIF(mau_so, 0) để biến mẫu số bằng 0 thành NULL, sau đó có thể bọc toàn bộ phép chia trong COALESCE(..., 0).",
      "a_long": "Thay vì viết CASE WHEN mau_so = 0 THEN 0 ELSE tu_so * 100.0 / mau_so END khá dài dòng, chuẩn SQL cung cấp hàm NULLIF(expr1, expr2) trả về NULL nếu expr1 = expr2. Khi viết COALESCE(tu_so * 100.0 / NULLIF(mau_so, 0), 0), nếu mau_so bằng 0 thì NULLIF trả về NULL, phép chia cho NULL trả về NULL một cách an toàn mà không ném lỗi, rồi COALESCE ngoài cùng đổi NULL thành 0."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 2.1: Tính điểm tổng kết môn học có xử lý trường hợp chưa thi cuối kỳ",
      "problem": "Trên CSDL TruongHoc, bảng DangKy lưu DiemQT (trọng số 40%) và DiemCK (trọng số 60%, có thể NULL nếu chưa thi). Hãy viết truy vấn lấy MaSV, MaMH, HocKy, DiemQT, DiemCK và cột DiemTongKet = ROUND(DiemQT * 0.4 + COALESCE(DiemCK, 0) * 0.6, 2). Sắp xếp theo MaSV tăng dần, MaMH tăng dần.",
      "intuition": "Dùng COALESCE(DiemCK, 0) để thay điểm cuối kỳ đang NULL thành 0 trước khi nhân 0.6, sau đó bọc toàn bộ trong hàm ROUND(..., 2).",
      "trace": "Với SV 201 môn CS101: 8.5*0.4 + 9.0*0.6 = 3.4 + 5.4 = 8.8. Với SV 201 môn CS201 (DiemCK là NULL): 9.0*0.4 + 0*0.6 = 3.6.",
      "sql": "SELECT MaSV, MaMH, HocKy, DiemQT, DiemCK,\n       ROUND(DiemQT * 0.4 + COALESCE(DiemCK, 0) * 0.6, 2) AS DiemTongKet\nFROM DangKy\nORDER BY MaSV ASC, MaMH ASC;",
      "db": "truonghoc",
      "expected": {
        "cols": [
          "MaSV",
          "MaMH",
          "HocKy",
          "DiemQT",
          "DiemCK",
          "DiemTongKet"
        ],
        "rows": [
          [
            201,
            "CS101",
            "2024A",
            8.5,
            9.0,
            8.8
          ],
          [
            201,
            "CS102",
            "2024A",
            7.0,
            8.0,
            7.6
          ],
          [
            201,
            "CS201",
            "2024B",
            9.0,
            null,
            3.6
          ],
          [
            202,
            "CS101",
            "2024A",
            9.0,
            9.5,
            9.3
          ],
          [
            202,
            "CS102",
            "2024A",
            8.5,
            9.0,
            8.8
          ],
          [
            203,
            "CS101",
            "2024A",
            5.0,
            4.0,
            4.4
          ],
          [
            204,
            "CS101",
            "2024B",
            7.5,
            8.0,
            7.8
          ],
          [
            204,
            "EC101",
            "2024A",
            8.0,
            7.5,
            7.7
          ],
          [
            205,
            "EE101",
            "2024A",
            6.5,
            null,
            2.6
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Nếu cộng trực tiếp DiemCK khi nó là NULL, kết quả sẽ bị NULL. Hãy dùng COALESCE(DiemCK, 0).",
        "SELECT MaSV, MaMH, HocKy, DiemQT, DiemCK, ROUND(DiemQT * 0.4 + COALESCE(DiemCK, 0) * 0.6, 2) AS DiemTongKet FROM DangKy ...",
        "SELECT MaSV, MaMH, HocKy, DiemQT, DiemCK, ROUND(DiemQT * 0.4 + COALESCE(DiemCK, 0) * 0.6, 2) AS DiemTongKet FROM DangKy ORDER BY MaSV ASC, MaMH ASC;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 2.2: Chuẩn hóa thông tin liên hệ của khách hàng xưởng xe",
      "problem": "Trên CSDL Auto Shop, bảng Customers có cột PreferredContact ('PHONE' hoặc 'EMAIL') và PhoneNumber (có thể NULL). Hãy lấy Id, FName || ' ' || LName AS FullName, và cột LienHeChinh: nếu PreferredContact = 'PHONE' thì lấy PhoneNumber (nhưng nếu PhoneNumber bị NULL thì lấy Email), ngược lại lấy Email.",
      "intuition": "Dùng biểu thức CASE kết hợp COALESCE(PhoneNumber, Email), hoặc dùng COALESCE trực tiếp trong nhánh WHEN.",
      "trace": "Khách Id 1 (PHONE, có SĐT) -> lấy SĐT. Khách Id 2 (EMAIL) -> lấy Email. Khách Id 3 (EMAIL, SĐT NULL) -> lấy Email. Khách Id 4 (PHONE, có SĐT) -> lấy SĐT.",
      "sql": "SELECT Id,\n       FName || ' ' || LName AS FullName,\n       CASE\n           WHEN PreferredContact = 'PHONE' THEN COALESCE(PhoneNumber, Email)\n           ELSE Email\n       END AS LienHeChinh\nFROM Customers\nORDER BY Id ASC;",
      "db": "autoshop",
      "expected": {
        "cols": [
          "Id",
          "FullName",
          "LienHeChinh"
        ],
        "rows": [
          [
            1,
            "William Jones",
            "3347927472"
          ],
          [
            2,
            "David Miller",
            "dmiller@example.net"
          ],
          [
            3,
            "Richard Davis",
            "richard0123@example.com"
          ],
          [
            4,
            "Thomas Wilson",
            "4455667788"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Ghép FName và LName bằng toán tử || ' ' ||, và dùng CASE WHEN PreferredContact = 'PHONE' ...",
        "Trong nhánh THEN của PHONE, dùng COALESCE(PhoneNumber, Email) để phòng hờ số điện thoại bị trống.",
        "SELECT Id, FName || ' ' || LName AS FullName, CASE WHEN PreferredContact = 'PHONE' THEN COALESCE(PhoneNumber, Email) ELSE Email END AS LienHeChinh FROM Customers ORDER BY Id ASC;"
      ]
    },
    {
      "num": 3,
      "title": "Bài 2.3: Phân loại tình trạng tồn kho sản phẩm",
      "problem": "Trên CSDL ShopOnline, hãy lấy MaSP, TenSP, TonKho và cột TinhTrangKho theo quy tắc: nếu TonKho = 0 là 'Het Hang', nếu TonKho < 10 là 'Sap Het', còn lại là 'Con Hang'. Sắp xếp theo TonKho tăng dần.",
      "intuition": "Dùng CASE WHEN kiểm tra từ ngưỡng nhỏ nhất (TonKho = 0) tới (TonKho < 10) rồi tới ELSE.",
      "trace": "SP 107 (TonKho=0) -> Het Hang; SP 105 (4) và SP 103 (8) -> Sap Het; các SP còn lại (>=12) -> Con Hang.",
      "sql": "SELECT MaSP, TenSP, TonKho,\n       CASE\n           WHEN TonKho = 0 THEN 'Het Hang'\n           WHEN TonKho < 10 THEN 'Sap Het'\n           ELSE 'Con Hang'\n       END AS TinhTrangKho\nFROM SanPham\nORDER BY TonKho ASC;",
      "db": "shoponline",
      "expected": {
        "cols": [
          "MaSP",
          "TenSP",
          "TonKho",
          "TinhTrangKho"
        ],
        "rows": [
          [
            107,
            "Webcam Elgato Facecam",
            0,
            "Het Hang"
          ],
          [
            105,
            "Laptop ThinkPad X1 Carbon",
            4,
            "Sap Het"
          ],
          [
            103,
            "Man Hinh Dell UltraSharp 27",
            8,
            "Sap Het"
          ],
          [
            104,
            "Tai Nghe Sony WH-1000XM5",
            12,
            "Con Hang"
          ],
          [
            102,
            "Chuot Logitech MX Master 3S",
            15,
            "Con Hang"
          ],
          [
            101,
            "Ban Phim Co Keychron K2",
            25,
            "Con Hang"
          ],
          [
            106,
            "Gia Do Laptop Nhom",
            50,
            "Con Hang"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Thứ tự các nhánh WHEN rất quan trọng: kiểm tra TonKho = 0 trước rồi mới kiểm tra TonKho < 10.",
        "SELECT MaSP, TenSP, TonKho, CASE WHEN TonKho = 0 THEN 'Het Hang' WHEN TonKho < 10 THEN 'Sap Het' ELSE 'Con Hang' END AS TinhTrangKho FROM SanPham ORDER BY TonKho ASC;",
        "SELECT MaSP, TenSP, TonKho, CASE WHEN TonKho = 0 THEN 'Het Hang' WHEN TonKho < 10 THEN 'Sap Het' ELSE 'Con Hang' END AS TinhTrangKho FROM SanPham ORDER BY TonKho ASC;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch02_p1",
      "title": "Trích xuất tên miền Email và phân loại nhà cung cấp dịch vụ thư",
      "difficulty": "Trung bình",
      "db": "shoponline",
      "summary": "Trên bảng KhachHang của CSDL ShopOnline, hãy lấy MaKH, HoTen, COALESCE(Email, 'chua_co@none.local') AS EmailHienThi, và trích xuất phần tên miền đứng sau dấu '@' đặt tên cột là TenMien (nếu Email là NULL thì TenMien trả về 'KHONG_CO'). Sắp xếp theo MaKH tăng dần.",
      "understand": "Để cắt chuỗi từ sau ký tự '@', ta dùng hàm INSTR(Email, '@') (tương đương CHARINDEX('@', Email) trong T-SQL) để tìm vị trí dấu '@', rồi dùng SUBSTR(Email, INSTR(Email, '@') + 1).",
      "brute": "Lấy toàn bộ chuỗi Email về Backend rồi gọi string.Split('@'). Tuy nhiên khi cần thống kê nhóm khách hàng theo tên miền ngay trên DB, bạn bắt buộc phải biết dùng SUBSTR và INSTR/CHARINDEX.",
      "optimal": "Kết hợp CASE WHEN Email IS NULL THEN 'KHONG_CO' ELSE SUBSTR(Email, INSTR(Email, '@') + 1) END.",
      "trace": "MaKH 1 (an.nguyen@gmail.com) -> vị trí '@' là 10, cắt từ 11 được 'gmail.com'. MaKH 3 (Email NULL) -> 'KHONG_CO'.",
      "sql": "SELECT MaKH, HoTen,\n       COALESCE(Email, 'chua_co@none.local') AS EmailHienThi,\n       CASE\n           WHEN Email IS NULL THEN 'KHONG_CO'\n           ELSE SUBSTR(Email, INSTR(Email, '@') + 1)\n       END AS TenMien\nFROM KhachHang\nORDER BY MaKH ASC;",
      "expected": {
        "cols": [
          "MaKH",
          "HoTen",
          "EmailHienThi",
          "TenMien"
        ],
        "rows": [
          [
            1,
            "Nguyen Van An",
            "an.nguyen@gmail.com",
            "gmail.com"
          ],
          [
            2,
            "Tran Thi Binh",
            "binh.tran@yahoo.com",
            "yahoo.com"
          ],
          [
            3,
            "Le Hoang Cuong",
            "chua_co@none.local",
            "KHONG_CO"
          ],
          [
            4,
            "Pham Minh Dung",
            "dung.pham@outlook.com",
            "outlook.com"
          ],
          [
            5,
            "Vo Thi Em",
            "em.vo@gmail.com",
            "gmail.com"
          ],
          [
            6,
            "Hoang Gia Huy",
            "huy.hoang@gmail.com",
            "gmail.com"
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Quên cộng 1 vào vị trí của dấu '@' khiến kết quả bị dính luôn ký tự '@' ở đầu (ví dụ '@gmail.com').",
      "note3": {
        "idea": "Kết hợp hàm tìm vị trí ký tự (INSTR / CHARINDEX) với hàm cắt chuỗi (SUBSTR / SUBSTRING).",
        "syntax": "SUBSTR(col, INSTR(col, '@') + 1) -- T-SQL: SUBSTRING(col, CHARINDEX('@', col) + 1, LEN(col))",
        "trap": "Quên +1 sau vị trí dấu '@' hoặc không xử lý dòng có Email là NULL."
      }
    }
  ],
  "summary_table": [
    [
      "COALESCE(a, b, c)",
      "Trả về giá trị khác NULL đầu tiên",
      "Chuẩn ANSI SQL, an toàn kiểu dữ liệu"
    ],
    [
      "NULLIF(a, b)",
      "Trả về NULL nếu a = b, ngược lại trả về a",
      "Chuyên trị lỗi chia cho 0 ở mẫu số"
    ],
    [
      "CASE WHEN ... THEN ... ELSE ... END",
      "Biểu thức rẽ nhánh có điều kiện",
      "Đánh giá tuần tự từ trên xuống"
    ],
    [
      "CAST(x AS type)",
      "Chuyển đổi kiểu dữ liệu chuẩn ANSI",
      "Dùng TRY_CAST trong T-SQL nếu sợ dữ liệu bẩn"
    ],
    [
      "UPPER / LOWER / TRIM / SUBSTR",
      "Bộ hàm chuẩn hóa và cắt chuỗi",
      "Không bọc lên cột ở vế trái mệnh đề WHERE"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Kết quả của biểu thức COALESCE(NULL, NULL, 0, 5) và NULLIF(10, 10) lần lượt là gì?",
      "a": "COALESCE(NULL, NULL, 0, 5) trả về 0 (giá trị khác NULL đầu tiên). NULLIF(10, 10) trả về NULL (vì hai đối số bằng nhau)."
    },
    {
      "q": "Câu 2: Trong SQL Server, nếu biến @Code có kiểu VARCHAR(3) đang mang giá trị NULL, thì ISNULL(@Code, 'DEFAULT') trả về chuỗi gì?",
      "a": "Trả về chuỗi 'DEF' (bị cắt còn 3 ký tự theo độ dài của biến @Code đứng đầu)."
    },
    {
      "q": "Câu 3: Tại sao biểu thức CASE DiemCK WHEN NULL THEN 'Vắng thi' ELSE 'Đã thi' END luôn rơi vào nhánh ELSE ngay cả khi DiemCK là NULL?",
      "a": "Vì Simple CASE so sánh DiemCK = NULL, mà phép bằng với NULL luôn trả về UNKNOWN. Phải viết CASE WHEN DiemCK IS NULL THEN 'Vắng thi' ELSE 'Đã thi' END."
    }
  ]
});
