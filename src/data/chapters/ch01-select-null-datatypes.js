/**
 * FILE: src/data/chapters/ch01-select-null-datatypes.js
 * MÔ TẢ: Chương 1 - SELECT, Lọc Dữ Liệu, NULL & Kiểu Dữ Liệu
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch01",
  "code": "Chương 1",
  "title": "SELECT, Lọc Dữ Liệu, NULL & Kiểu Dữ Liệu",
  "sources": [
    "S ch.3, 4, 6, 8, 9, 11, 12, 13",
    "M ch.2, 3, 5, 6, 7"
  ],
  "goals": [
    "Hiểu rõ thứ tự tư duy khi trích xuất dữ liệu bằng SELECT, FROM, WHERE, DISTINCT, ORDER BY và giới hạn dòng.",
    "Nắm vững Logic Ba Giá Trị (Three-Valued Logic: TRUE, FALSE, UNKNOWN) khi làm việc với NULL.",
    "Chọn đúng kiểu dữ liệu (Data Types) cho số, tiền tệ, chuỗi Unicode và ngày giờ để tránh lỗi làm tròn hoặc tốn bộ nhớ.",
    "Ánh xạ chính xác các kiểu dữ liệu từ SQL sang kiểu biến trong Java (JDBC/JPA) và C# (.NET)."
  ],
  "signals": [
    "Xây dựng API danh sách sản phẩm có bộ lọc theo khoảng giá, danh mục, từ khóa tìm kiếm và phân trang.",
    "Kiểm tra vì sao câu truy vấn lọc các bản ghi 'không bằng X' lại làm rơi mất những bản ghi đang để trống (NULL).",
    "Thiết kế bảng giao dịch tài chính cần độ chính xác tuyệt đối, không được lệch 0.00001 đồng do số chấm động."
  ],
  "theory": "<h3>1.1. Câu lệnh SELECT và phép chiếu (Projection) vs phép chọn (Selection)</h3>\n<p>Trong đại số quan hệ, khi bạn lấy dữ liệu từ một bảng, có hai thao tác cơ bản nhất:</p>\n<ul>\n  <li><strong>Phép chiếu (Projection):</strong> Chọn lấy một số cột cần thiết thay vì lấy hết toàn bộ bảng. Trong SQL, phép chiếu được viết ở mệnh đề <code>SELECT ten_cot_1, ten_cot_2</code>.</li>\n  <li><strong>Phép chọn (Selection / Filtering):</strong> Giữ lại các dòng thỏa mãn điều kiện logic. Trong SQL, phép chọn được viết ở mệnh đề <code>WHERE dieu_kien</code>.</li>\n</ul>\n<p>Tại sao lập trình viên Backend được khuyên hạn chế viết <code>SELECT *</code> trong code thực tế? Có ba lý do rất thực tế: thứ nhất, nếu bảng có cột lưu văn bản dài (<code>TEXT</code>, <code>NVARCHAR(MAX)</code>) hoặc ảnh nhị phân (<code>BLOB</code>), <code>SELECT *</code> sẽ kéo toàn bộ dữ liệu nặng nề đó qua mạng về RAM của ứng dụng. Thứ hai, lấy thừa cột làm mất cơ hội dùng <em>Covering Index</em> (chỉ mục bao phủ, sẽ học kỹ ở Chương 8). Thứ ba, khi bảng thêm hoặc đổi thứ tự cột, code đọc theo chỉ số cột sẽ gặp lỗi ngầm.</p>\n\n<h3>1.2. Logic ba giá trị (Three-Valued Logic - 3VL) và bản chất của NULL</h3>\n<p>Trong Java hay C#, biểu thức điều kiện <code>boolean</code> chỉ có hai giá trị: <code>true</code> hoặc <code>false</code>. Nhưng trong SQL, sự xuất hiện của <strong>NULL (đại diện cho giá trị chưa biết, không áp dụng hoặc bị khuyết)</strong> sinh ra trạng thái thứ ba là <strong>UNKNOWN (Không xác định)</strong>.</p>\n<p>Quy tắc cốt lõi cần khắc cốt ghi tâm: <strong>NULL không phải là số 0, không phải là chuỗi rỗng <code>''</code>, và NULL cũng không bằng chính NULL!</strong> Mọi phép so sánh thông thường (<code>=</code>, <code>&lt;&gt;</code>, <code>&gt;</code>, <code>&lt;</code>) khi chạm vào <code>NULL</code> đều trả về <code>UNKNOWN</code>. Mà mệnh đề <code>WHERE</code> chỉ giữ lại những dòng có kết quả đánh giá là <code>TRUE</code> (cả <code>FALSE</code> và <code>UNKNOWN</code> đều bị loại bỏ).</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Biểu thức A</th>\n      <th>Biểu thức B</th>\n      <th>A AND B</th>\n      <th>A OR B</th>\n      <th>NOT A</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>TRUE</td>\n      <td>UNKNOWN</td>\n      <td>UNKNOWN</td>\n      <td><strong>TRUE</strong></td>\n      <td>FALSE</td>\n    </tr>\n    <tr>\n      <td>FALSE</td>\n      <td>UNKNOWN</td>\n      <td><strong>FALSE</strong></td>\n      <td>UNKNOWN</td>\n      <td>TRUE</td>\n    </tr>\n    <tr>\n      <td>UNKNOWN</td>\n      <td>UNKNOWN</td>\n      <td>UNKNOWN</td>\n      <td>UNKNOWN</td>\n      <td>UNKNOWN</td>\n    </tr>\n  </tbody>\n</table>\n<p>Hãy nhìn dòng thứ hai của bảng trên: <code>FALSE AND UNKNOWN</code> ra <code>FALSE</code>, nhưng <code>TRUE OR UNKNOWN</code> lại ra <code>TRUE</code>. Đặc biệt, khi bạn dùng <code>WHERE Id NOT IN (1, 2, NULL)</code>, câu lệnh này tương đương với <code>Id &lt;&gt; 1 AND Id &lt;&gt; 2 AND Id &lt;&gt; NULL</code>. Vì <code>Id &lt;&gt; NULL</code> luôn là <code>UNKNOWN</code>, toàn bộ cụm <code>AND</code> không bao giờ đạt giá trị <code>TRUE</code>, làm câu truy vấn trả về <strong>0 dòng</strong>!</p>\n\n<h3>1.3. Kiểu dữ liệu (Data Types) và những lựa chọn sống còn</h3>\n<p>Khi tạo bảng hoặc đọc lược đồ CSDL, bạn cần phân biệt rõ 4 nhóm kiểu dữ liệu chính:</p>\n<ul>\n  <li><strong>Số nguyên (Exact Integers):</strong> <code>TINYINT</code> (1 byte: 0 đến 255 trong SQL Server), <code>SMALLINT</code> (2 bytes), <code>INT</code> (4 bytes, khoảng -2.1 tỷ đến +2.1 tỷ), <code>BIGINT</code> (8 bytes). Nếu bảng đơn hàng hoặc log hệ thống có nguy cơ vượt 2 tỷ bản ghi, khóa chính bắt buộc phải dùng <code>BIGINT</code>.</li>\n  <li><strong>Số thập phân chính xác (Exact Numerics) vs Số chấm động (Approximate Numerics):</strong> Cột tiền lương, giá bán, số dư ví điện tử <strong>bắt buộc dùng <code>DECIMAL(p, s)</code> hoặc <code>NUMERIC(p, s)</code></strong> (ví dụ <code>DECIMAL(18, 2)</code> lưu tối đa 18 chữ số, trong đó có 2 chữ số sau dấu phẩy). Tuyệt đối không dùng <code>FLOAT</code> hay <code>REAL</code> cho tiền tệ vì biểu diễn nhị phân IEEE 754 sẽ gây sai số kiểu <code>0.1 + 0.2 = 0.30000000000000004</code>.</li>\n  <li><strong>Chuỗi ký tự (Character Strings):</strong>\n    <ul>\n      <li><code>CHAR(n)</code> vs <code>VARCHAR(n)</code>: <code>CHAR(n)</code> có độ dài cố định (nếu chuỗi ngắn hơn n sẽ tự động đệm khoảng trắng cho đủ), phù hợp cho mã quốc gia <code>VN</code>, <code>US</code> hoặc mã bưu chính. <code>VARCHAR(n)</code> có độ dài thay đổi theo nội dung thực tế.</li>\n      <li><code>VARCHAR</code> vs <code>NVARCHAR</code> (trong SQL Server): <code>VARCHAR</code> lưu chuỗi không dấu hoặc mã hóa đơn/UTF-8 (từ SQL Server 2019 có collation UTF8), còn <code>NVARCHAR</code> lưu chuỗi Unicode UTF-16 (2 bytes mỗi ký tự), bắt buộc dùng khi lưu tiếng Việt có dấu trong SQL Server truyền thống kèm tiền tố <code>N'Nguyễn Văn An'</code>.</li>\n    </ul>\n  </li>\n  <li><strong>Ngày giờ (Date &amp; Time):</strong> Dùng <code>DATE</code> (chỉ ngày), <code>TIME</code> (chỉ giờ), <code>DATETIME2</code> (trong SQL Server, chính xác tới 100 nanoseconds và dải năm từ 0001 đến 9999, thay thế cho kiểu <code>DATETIME</code> cũ kỹ vốn chỉ lưu được từ năm 1753 và bị làm tròn mili-giây thành .000, .003, .007), và <code>DATETIMEOFFSET</code> (hoặc <code>TIMESTAMPTZ</code> trong PostgreSQL) khi ứng dụng phục vụ người dùng ở nhiều múi giờ.</li>\n</ul>",
  "mechanism": "<h3>Chạy tay từng bước: Máy chủ CSDL thực thi câu lệnh SELECT đơn giản như thế nào?</h3>\n<p>Nhiều bạn nhìn câu lệnh SQL viết từ trên xuống dưới (<code>SELECT ... FROM ... WHERE ... ORDER BY ...</code>) nên tưởng máy chủ cũng chạy chữ <code>SELECT</code> đầu tiên. Thực tế hoàn toàn ngược lại! Thứ tự thực thi logic (Logical Query Processing Order) của một truy vấn lọc bảng đơn diễn ra như sau:</p>\n<div class=\"trace-steps\">\n  <div class=\"trace-step\"><strong>Bước 1 - FROM:</strong> Xác định bảng nguồn cần đọc (ví dụ bảng <code>SinhVien</code> gồm 6 dòng).</div>\n  <div class=\"trace-step\"><strong>Bước 2 - WHERE:</strong> Quét từng dòng từ Bước 1, đánh giá biểu thức điều kiện. Chỉ những dòng cho kết quả <code>TRUE</code> mới được đi tiếp; các dòng <code>FALSE</code> hoặc <code>UNKNOWN</code> bị loại bỏ ngay.</div>\n  <div class=\"trace-step\"><strong>Bước 3 - SELECT (Projection):</strong> Từ các dòng sống sót sau WHERE, trích xuất các cột được yêu cầu và tính toán biểu thức (như cộng trừ, nối chuỗi) kèm đặt tên cột (Alias <code>AS</code>). <em>Lưu ý: Vì bước SELECT chạy sau bước WHERE, bạn không thể lấy tên Alias đặt ở SELECT để viết trong mệnh đề WHERE!</em></div>\n  <div class=\"trace-step\"><strong>Bước 4 - DISTINCT:</strong> Nếu có từ khóa <code>DISTINCT</code>, loại bỏ các dòng trùng hệt nhau trên tập cột vừa chiếu.</div>\n  <div class=\"trace-step\"><strong>Bước 5 - ORDER BY:</strong> Sắp xếp các dòng kết quả theo tiêu chí chỉ định. Vì bước này chạy sau <code>SELECT</code>, bạn hoàn toàn dùng được tên Alias của <code>SELECT</code> trong <code>ORDER BY</code>.</div>\n  <div class=\"trace-step\"><strong>Bước 6 - LIMIT / OFFSET / TOP:</strong> Cắt lấy đúng số dòng đầu tiên cần trả về cho ứng dụng.</div>\n</div>\n\n<h4>Minh họa chạy tay trên bảng SinhVien (CSDL TruongHoc)</h4>\n<p>Câu truy vấn cần chạy tay:</p>\n<pre class=\"code-block\"><code>SELECT MaSV, HoTen, MaKhoa, HocBong AS HB\nFROM SinhVien\nWHERE MaKhoa = 'CNTT' AND HocBong >= 5000\nORDER BY HB DESC;</code></pre>\n<p><strong>Bảng gốc sau Bước 1 (FROM SinhVien - 6 dòng):</strong></p>\n<table class=\"chm-table\">\n  <thead><tr><th>MaSV</th><th>HoTen</th><th>MaKhoa</th><th>HocBong</th><th>Đánh giá WHERE (MaKhoa='CNTT' AND HocBong>=5000)</th></tr></thead>\n  <tbody>\n    <tr><td>201</td><td>Bui Minh Tuan</td><td>CNTT</td><td>5000</td><td>TRUE AND TRUE &rarr; <strong>TRUE (Giữ)</strong></td></tr>\n    <tr><td>202</td><td>Doan Thu Ha</td><td>CNTT</td><td>8000</td><td>TRUE AND TRUE &rarr; <strong>TRUE (Giữ)</strong></td></tr>\n    <tr><td>203</td><td>Ngo Quang Khai</td><td>CNTT</td><td>NULL</td><td>TRUE AND UNKNOWN &rarr; <strong>UNKNOWN (Loại)</strong></td></tr>\n    <tr><td>204</td><td>Ly Ngoc Mai</td><td>KT</td><td>3000</td><td>FALSE AND FALSE &rarr; <strong>FALSE (Loại)</strong></td></tr>\n    <tr><td>205</td><td>Trinh Gia Bao</td><td>DT</td><td>0</td><td>FALSE AND FALSE &rarr; <strong>FALSE (Loại)</strong></td></tr>\n    <tr><td>206</td><td>Vu Thanh Thao</td><td>KT</td><td>NULL</td><td>FALSE AND UNKNOWN &rarr; <strong>FALSE (Loại)</strong></td></tr>\n  </tbody>\n</table>\n<p><strong>Bảng cuối sau Bước 3 (SELECT) và Bước 5 (ORDER BY HB DESC):</strong> Chỉ còn 2 dòng của Doan Thu Ha (HB = 8000) đứng trên Bui Minh Tuan (HB = 5000).</p>",
  "examples": [
    {
      "title": "Ví dụ 1.1: Lấy danh sách cột cụ thể và đặt bí danh (Alias)",
      "label": "CHUAN",
      "db": "autoshop",
      "sql": "SELECT Id AS MaNV, FName AS Ho, LName AS Ten, Salary AS LuongThang\nFROM Employees;",
      "result": {
        "cols": [
          "MaNV",
          "Ho",
          "Ten",
          "LuongThang"
        ],
        "rows": [
          [
            1,
            "James",
            "Smith",
            1000
          ],
          [
            2,
            "John",
            "Johnson",
            400
          ],
          [
            3,
            "Michael",
            "Williams",
            600
          ],
          [
            4,
            "Johnathon",
            "Smith",
            500
          ],
          [
            5,
            "William",
            "Morris",
            800
          ],
          [
            6,
            "Sarah",
            "Connor",
            750
          ]
        ]
      },
      "note": "Dùng AS để đặt tên cột dễ đọc hơn cho báo cáo hoặc khớp với tên thuộc tính DTO trong Java/C#."
    },
    {
      "title": "Ví dụ 1.2: Khử trùng lặp bằng DISTINCT trên một và nhiều cột",
      "label": "CHUAN",
      "db": "autoshop",
      "sql": "SELECT DISTINCT Status, EmployeeId\nFROM Cars\nORDER BY Status;",
      "result": {
        "cols": [
          "Status",
          "EmployeeId"
        ],
        "rows": [
          [
            "READY",
            2
          ],
          [
            "READY",
            5
          ],
          [
            "WAITING",
            1
          ],
          [
            "WAITING",
            5
          ],
          [
            "WORKING",
            3
          ]
        ]
      },
      "note": "DISTINCT xét tính duy nhất trên toàn bộ tổ hợp các cột đứng sau nó, không phải chỉ cột đầu tiên."
    },
    {
      "title": "Ví dụ 1.3: Lọc dữ liệu với WHERE, BETWEEN, IN và LIKE",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "SELECT MaSP, TenSP, DanhMuc, DonGia\nFROM SanPham\nWHERE DanhMuc IN ('Phu Kien', 'Am Thanh')\n  AND DonGia BETWEEN 1000 AND 7000\n  AND TenSP LIKE '%o%';",
      "result": {
        "cols": [
          "MaSP",
          "TenSP",
          "DanhMuc",
          "DonGia"
        ],
        "rows": [
          [
            101,
            "Ban Phim Co Keychron K2",
            "Phu Kien",
            1800
          ],
          [
            102,
            "Chuot Logitech MX Master 3S",
            "Phu Kien",
            2200
          ],
          [
            104,
            "Tai Nghe Sony WH-1000XM5",
            "Am Thanh",
            6900
          ],
          [
            107,
            "Webcam Elgato Facecam",
            "Phu Kien",
            4200
          ]
        ]
      },
      "note": "BETWEEN bao gồm cả hai đầu mút (>= 1000 và <= 7000). Toán tử LIKE với '%' khớp chuỗi độ dài bất kỳ."
    },
    {
      "title": "Ví dụ 1.4: Bẫy logic ba giá trị (Three-Valued Logic) với NULL",
      "label": "CHUAN",
      "db": "truonghoc",
      "sql": "SELECT MaSV, HoTen, HocBong\nFROM SinhVien\nWHERE HocBong IS NULL OR HocBong = 0;",
      "result": {
        "cols": [
          "MaSV",
          "HoTen",
          "HocBong"
        ],
        "rows": [
          [
            203,
            "Ngo Quang Khai",
            null
          ],
          [
            205,
            "Trinh Gia Bao",
            0
          ],
          [
            206,
            "Vu Thanh Thao",
            null
          ]
        ]
      },
      "note": "Phải dùng IS NULL để kiểm tra giá trị khuyết. Nếu viết HocBong = NULL, biểu thức trả về UNKNOWN và không lấy được dòng nào."
    },
    {
      "title": "Ví dụ 1.5: Sắp xếp nhiều cấp và giới hạn số dòng chuẩn ANSI/SQLite",
      "label": "CHUAN",
      "db": "autoshop",
      "sql": "SELECT Id, FName, LName, DepartmentId, Salary\nFROM Employees\nORDER BY DepartmentId ASC, Salary DESC\nLIMIT 4;",
      "result": {
        "cols": [
          "Id",
          "FName",
          "LName",
          "DepartmentId",
          "Salary"
        ],
        "rows": [
          [
            1,
            "James",
            "Smith",
            1,
            1000
          ],
          [
            4,
            "Johnathon",
            "Smith",
            1,
            500
          ],
          [
            2,
            "John",
            "Johnson",
            1,
            400
          ],
          [
            3,
            "Michael",
            "Williams",
            2,
            600
          ]
        ]
      },
      "note": "Sắp xếp tăng dần theo phòng ban trước; nếu cùng phòng ban thì người lương cao nhất đứng trước."
    },
    {
      "title": "Ví dụ 1.6: Giới hạn số dòng có kèm đồng hạng bằng TOP ... WITH TIES trong SQL Server",
      "label": "TSQL",
      "db": "autoshop",
      "sql": "SELECT TOP (3) WITH TIES Id, FName, LName, Salary\nFROM Employees\nORDER BY Salary DESC;",
      "result": {
        "cols": [
          "Id",
          "FName",
          "LName",
          "Salary"
        ],
        "rows": [
          [
            1,
            "James",
            "Smith",
            1000
          ],
          [
            5,
            "William",
            "Morris",
            800
          ],
          [
            6,
            "Sarah",
            "Connor",
            750
          ]
        ]
      },
      "note": "Trong T-SQL, TOP (n) WITH TIES bắt buộc đi kèm ORDER BY để lấy thêm các dòng bằng điểm với dòng ở vị trí thứ n. Bản [CHUẨN] tương đương dùng DENSE_RANK() hoặc RANK() ở Chương 5. (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    }
  ],
  "dialects": [
    [
      "Lấy 5 dòng đầu tiên",
      "SELECT TOP (5) * FROM Emp;",
      "SELECT * FROM Emp LIMIT 5;",
      "SELECT * FROM Emp LIMIT 5;\n(hoặc FETCH FIRST 5 ROWS ONLY)"
    ],
    [
      "Chuỗi Unicode có dấu",
      "N'Xin chào' (kiểu NVARCHAR)",
      "'Xin chào' (utf8mb4)",
      "'Xin chào' (UTF-8 mặc định)"
    ],
    [
      "Kiểu đúng/sai (Boolean)",
      "BIT (nhận 0, 1, NULL)",
      "BOOLEAN / TINYINT(1)",
      "BOOLEAN (TRUE, FALSE, NULL)"
    ],
    [
      "So sánh an toàn với NULL",
      "IS [NOT] DISTINCT FROM (SQL 2022)",
      "<=> (Null-safe equal)",
      "IS [NOT] DISTINCT FROM"
    ],
    [
      "Kiểu ngày giờ chuẩn xác",
      "DATETIME2(7), DATETIMEOFFSET",
      "DATETIME(6), TIMESTAMP",
      "TIMESTAMP, TIMESTAMPTZ"
    ]
  ],
  "bridge_java": "// [Java - JDBC & Spring Data JPA] Ánh xạ kiểu dữ liệu và truyền tham số lọc an toàn\n// 1. Quy tắc vàng: Dùng BigDecimal cho DECIMAL/NUMERIC (tiền tệ), LocalDate/LocalDateTime cho DATE/DATETIME2.\n// 2. Để đọc giá trị nguyên có thể NULL trong JDBC ResultSet, dùng getObject(\"col\", Integer.class) thay vì getInt(\"col\")\n//    vì getInt() sẽ tự biến NULL thành số 0!\n\nString sql = \"SELECT MaSV, HoTen, HocBong FROM SinhVien WHERE MaKhoa = ? AND (HocBong IS NULL OR HocBong >= ?)\";\ntry (PreparedStatement ps = conn.prepareStatement(sql)) {\n    ps.setString(1, \"CNTT\");\n    ps.setInt(2, 5000);\n    try (ResultSet rs = ps.executeQuery()) {\n        while (rs.next()) {\n            int maSv = rs.getInt(\"MaSV\");\n            String hoTen = rs.getString(\"HoTen\");\n            // Đọc Integer nullable an toàn, không bị biến NULL thành 0:\n            Integer hocBong = rs.getObject(\"HocBong\", Integer.class);\n            System.out.printf(\"SV %d - %s - Học bổng: %s%n\", maSv, hoTen, hocBong);\n        }\n    }\n}",
  "bridge_csharp": "// [C# - ADO.NET & Dapper] Ánh xạ kiểu dữ liệu Nullable và Decimal\n// 1. Trong C#, kiểu decimal khớp hoàn hảo với DECIMAL(18,2) trong SQL Server.\n// 2. Các cột cho phép NULL trong DB phải khai báo kiểu Nullable (int?, decimal?, DateTime?) trong class DTO/Entity.\n\npublic record SinhVienDto(int MaSV, string HoTen, int? HocBong);\n\n// Sử dụng Dapper tự động ánh xạ NULL sang int? (Nullable<int>):\nconst string sql = @\"\n    SELECT MaSV, HoTen, HocBong\n    FROM SinhVien\n    WHERE MaKhoa = @MaKhoa AND (HocBong IS NULL OR HocBong >= @MinHB)\";\n\nIEnumerable<SinhVienDto> danhSach = await connection.QueryAsync<SinhVienDto>(\n    sql,\n    new { MaKhoa = \"CNTT\", MinHB = 5000 }\n);\nforeach (var sv in danhSach) {\n    Console.WriteLine($\"SV {sv.MaSV}: {sv.HoTen} - HB: {sv.HocBong?.ToString() ?? \"Chưa xét\"}\");\n}",
  "performance": "<ul>\n  <li><strong>Chi phí của <code>SELECT *</code>:</strong> Lấy tất cả các cột khiến công cụ thực thi (Query Optimizer) phải đọc toàn bộ trang dữ liệu gốc (Table/Clustered Index) hoặc thực hiện thêm thao tác <em>Key Lookup</em> đắt đỏ thay vì chỉ đọc trên Index gọn nhẹ.</li>\n  <li><strong>Chi phí của <code>DISTINCT</code> và <code>ORDER BY</code>:</strong> Cả hai thao tác này đều đòi hỏi máy chủ phải gom dữ liệu và thực hiện thuật toán sắp xếp (Sort, độ phức tạp trung bình O(N log N) trong bộ nhớ hoặc phải ghi tạm ra đĩa <code>tempdb</code> nếu tràn RAM) hoặc băm (Hash Match) nếu chưa có Index đúng thứ tự cột. Đừng viết <code>DISTINCT</code> theo thói quen khi dữ liệu vốn đã duy nhất nhờ khóa chính.</li>\n  <li><strong>Bẫy <code>LIKE '%tu_khoa%'</code>:</strong> Khi dấu phần trăm <code>%</code> đứng ở đầu chuỗi mẫu (Leading Wildcard), cây chỉ mục B-Tree (sắp xếp theo thứ tự chữ cái từ trái sang phải) hoàn toàn vô tác dụng. Máy chủ buộc phải quét toàn bộ bảng (Full Table Scan). Nếu chỉ cần tìm tiền tố, hãy viết <code>LIKE 'tu_khoa%'</code>.</li>\n</ul>",
  "common_errors": [
    "Viết WHERE Cot = NULL hoặc WHERE Cot <> NULL: Trong SQL chuẩn, phép so sánh bằng/khác với NULL luôn trả về UNKNOWN. Phải viết WHERE Cot IS NULL hoặc WHERE Cot IS NOT NULL.",
    "Quên dấu ngoặc đơn khi kết hợp AND và OR: Viết WHERE TrangThai = 'VIP' OR TrangThai = 'VANG' AND TongTien > 1000 sẽ bị hiểu là TrangThai = 'VIP' OR (TrangThai = 'VANG' AND TongTien > 1000). Phải bọc ngoặc quanh cụm OR.",
    "Dùng tên cột đặt bằng AS (Alias) ngay trong mệnh đề WHERE của cùng cấp truy vấn: Vì WHERE chạy trước SELECT nên máy chủ báo lỗi Invalid column name.",
    "Thiếu tiền tố N trước chuỗi tiếng Việt trong SQL Server: Viết WHERE HoTen = 'Nguyễn' thay vì N'Nguyễn' trên cột NVARCHAR có thể làm chữ có dấu biến thành dấu chấm hỏi '?' tùy bộ mã (Collation).",
    "Dùng kiểu FLOAT hoặc REAL để lưu giá tiền hoặc số dư tài khoản: Dẫn tới sai số làm tròn nhị phân khi cộng trừ nhiều giao dịch.",
    "Đọc cột INT cho phép NULL bằng rs.getInt() trong Java JDBC mà không kiểm tra rs.wasNull() hoặc getObject(..., Integer.class), làm giá trị NULL bị hiểu nhầm thành số 0."
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "Tại sao câu lệnh SELECT * FROM SinhVien WHERE HocBong <> 5000 lại không trả về những sinh viên có HocBong đang là NULL?",
      "a_short": "Vì trong logic 3 giá trị của SQL, biểu thức NULL <> 5000 trả về UNKNOWN chứ không phải TRUE. Mệnh đề WHERE chỉ lấy các dòng đạt TRUE.",
      "a_long": "SQL sử dụng Three-Valued Logic (TRUE, FALSE, UNKNOWN). Khi cột HocBong có giá trị NULL, phép so sánh NULL <> 5000 mang ý nghĩa 'không biết mức học bổng có khác 5000 hay không', kết quả là UNKNOWN. Mệnh đề WHERE lọc bỏ cả FALSE lẫn UNKNOWN. Muốn lấy cả các dòng NULL, bạn phải viết rõ: WHERE HocBong <> 5000 OR HocBong IS NULL (hoặc dùng IS DISTINCT FROM 5000 trên PostgreSQL / SQL Server 2022+)."
    },
    {
      "level": "Junior",
      "q": "Sự khác biệt giữa CHAR(10), VARCHAR(10) và NVARCHAR(10) trong SQL Server là gì? Khi nào nên dùng loại nào?",
      "a_short": "CHAR(10) có độ dài cố định 10 bytes; VARCHAR(10) có độ dài thay đổi tối đa 10 bytes; NVARCHAR(10) lưu chuỗi Unicode UTF-16 có độ dài thay đổi tối đa 10 ký tự (mỗi ký tự tốn 2 bytes).",
      "a_long": "CHAR(n) luôn chiếm cố định n bytes và tự đệm khoảng trắng nếu chuỗi ngắn hơn, rất hợp cho các mã có độ dài cố định như mã quốc gia ISO ('VN', 'US') hoặc mã hash MD5/SHA256 vì tránh phân mảnh trang dữ liệu khi cập nhật. VARCHAR(n) chỉ tốn dung lượng theo số ký tự thực tế cộng 2 bytes lưu độ dài, phù hợp cho email, mã đơn hàng chỉ chứa ký tự ASCII. NVARCHAR(n) dùng bảng mã Unicode UCS-2/UTF-16 (2 bytes/ký tự), bắt buộc dùng khi lưu họ tên, địa chỉ tiếng Việt hoặc đa ngôn ngữ."
    },
    {
      "level": "Mid",
      "q": "Giải thích hiện tượng câu lệnh WHERE Id NOT IN (SELECT ManagerId FROM Employees) trả về 0 dòng dù bảng có dữ liệu.",
      "a_short": "Do tập kết quả của subquery chứa ít nhất một giá trị NULL, làm phép toán NOT IN biến thành chuỗi AND với (Id <> NULL), dẫn tới kết quả toàn cục là UNKNOWN.",
      "a_long": "Giả sử subquery trả về danh sách (1, 2, NULL). Biểu thức Id NOT IN (1, 2, NULL) được trình tối ưu dịch tương đương thành: (Id <> 1) AND (Id <> 2) AND (Id <> NULL). Với mọi nhân viên (kể cả Id = 5), vế (5 <> NULL) luôn trả về UNKNOWN. Trong phép hội logic, TRUE AND TRUE AND UNKNOWN cho kết quả là UNKNOWN, khiến mệnh đề WHERE loại bỏ sạch mọi dòng. Cách khắc phục chuẩn là lọc WHERE ManagerId IS NOT NULL bên trong subquery, hoặc chuyển sang dùng NOT EXISTS."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 1.1: Lọc xe đang sửa có chi phí cao",
      "problem": "Trên CSDL Auto Shop, hãy lấy ra các cột Id, Model, Status, TotalCost của những chiếc xe có trạng thái (Status) khác 'READY' và tổng chi phí (TotalCost) lớn hơn hoặc bằng 300. Sắp xếp kết quả theo TotalCost giảm dần.",
      "intuition": "Dùng mệnh đề WHERE kết hợp toán tử <> (hoặc !=) và >=, sau đó dùng ORDER BY TotalCost DESC.",
      "trace": "Bảng Cars có 6 dòng. Lọc Status <> 'READY' giữ lại các dòng Id 3 (WAITING, 100), Id 4 (WORKING, 1254), Id 6 (WAITING, 320). Lọc tiếp TotalCost >= 300 còn Id 4 và Id 6.",
      "sql": "SELECT Id, Model, Status, TotalCost\nFROM Cars\nWHERE Status <> 'READY' AND TotalCost >= 300\nORDER BY TotalCost DESC;",
      "db": "autoshop",
      "expected": {
        "cols": [
          "Id",
          "Model",
          "Status",
          "TotalCost"
        ],
        "rows": [
          [
            4,
            "Toyota Prius",
            "WORKING",
            1254
          ],
          [
            6,
            "Mazda 3",
            "WAITING",
            320
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Kiểm tra điều kiện khác nhau bằng toán tử <> và kết hợp điều kiện bằng AND.",
        "Khung câu lệnh: SELECT Id, Model, Status, TotalCost FROM Cars WHERE ... ORDER BY ...;",
        "SELECT Id, Model, Status, TotalCost FROM Cars WHERE Status <> 'READY' AND TotalCost >= 300 ORDER BY TotalCost DESC;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 1.2: Tìm khách hàng chưa cập nhật số điện thoại hoặc email",
      "problem": "Trên CSDL ShopOnline, hãy liệt kê MaKH, HoTen, Email, SoDT, ThanhPho của các khách hàng đang bị khuyết Email hoặc khuyết Số điện thoại (giá trị NULL).",
      "intuition": "Giá trị rỗng trong CSDL là NULL. Dùng IS NULL kết hợp với toán tử OR cho hai cột Email và SoDT.",
      "trace": "Quét bảng KhachHang (6 dòng): dòng MaKH=3 có Email là NULL; dòng MaKH=5 có SoDT là NULL. Các dòng còn lại đủ cả hai cột.",
      "sql": "SELECT MaKH, HoTen, Email, SoDT, ThanhPho\nFROM KhachHang\nWHERE Email IS NULL OR SoDT IS NULL;",
      "db": "shoponline",
      "expected": {
        "cols": [
          "MaKH",
          "HoTen",
          "Email",
          "SoDT",
          "ThanhPho"
        ],
        "rows": [
          [
            3,
            "Le Hoang Cuong",
            null,
            "0915556666",
            "Da Nang"
          ],
          [
            5,
            "Vo Thi Em",
            "em.vo@gmail.com",
            null,
            "TP Ho Chi Minh"
          ]
        ]
      },
      "order_matters": false,
      "hints": [
        "Nhớ rằng không thể dùng Email = NULL, hãy dùng IS NULL.",
        "Khung câu lệnh: SELECT MaKH, HoTen, Email, SoDT, ThanhPho FROM KhachHang WHERE Email IS NULL OR ...;",
        "SELECT MaKH, HoTen, Email, SoDT, ThanhPho FROM KhachHang WHERE Email IS NULL OR SoDT IS NULL;"
      ]
    },
    {
      "num": 3,
      "title": "Bài 1.3: Danh sách tỉnh/thành phố duy nhất có khách hàng hạng Vàng hoặc Bạc",
      "problem": "Trên CSDL ShopOnline, hãy lấy danh sách các ThanhPho không trùng lặp của những khách hàng có HangThe là 'VANG' hoặc 'BAC', sắp xếp tên thành phố theo thứ tự bảng chữ cái tăng dần.",
      "intuition": "Dùng IN ('VANG', 'BAC') ở mệnh đề WHERE để lọc hạng thẻ, dùng SELECT DISTINCT ThanhPho để khử trùng lặp.",
      "trace": "Khách hạng VANG hoặc BAC gồm MaKH 1 (Ha Noi), 2 (TP Ho Chi Minh), 4 (Ha Noi), 6 (Can Tho). Sau khi DISTINCT và ORDER BY ASC, còn 3 dòng: Can Tho, Ha Noi, TP Ho Chi Minh.",
      "sql": "SELECT DISTINCT ThanhPho\nFROM KhachHang\nWHERE HangThe IN ('VANG', 'BAC')\nORDER BY ThanhPho ASC;",
      "db": "shoponline",
      "expected": {
        "cols": [
          "ThanhPho"
        ],
        "rows": [
          [
            "Can Tho"
          ],
          [
            "Ha Noi"
          ],
          [
            "TP Ho Chi Minh"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Kết hợp từ khóa DISTINCT ngay sau SELECT và toán tử IN trong WHERE.",
        "SELECT DISTINCT ThanhPho FROM KhachHang WHERE HangThe IN (...) ORDER BY ThanhPho ASC;",
        "SELECT DISTINCT ThanhPho FROM KhachHang WHERE HangThe IN ('VANG', 'BAC') ORDER BY ThanhPho ASC;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch01_p1",
      "title": "Lọc nhân viên không thuộc danh sách quản lý (Bẫy NOT IN chứa NULL)",
      "difficulty": "Trung bình",
      "db": "autoshop",
      "summary": "Tìm tất cả nhân viên có mức lương từ 500 trở lên và có người quản lý trực tiếp (ManagerId không bị NULL). Hiển thị Id, FName, LName, ManagerId, Salary theo thứ tự lương giảm dần, nếu bằng lương thì Id tăng dần.",
      "understand": "Đề yêu cầu hai điều kiện rõ ràng: Salary >= 500 và ManagerId IS NOT NULL. Đây là bước khởi động quan trọng trước khi xử lý các bài toán cây nhân sự.",
      "brute": "Lấy toàn bộ bảng Employees về ứng dụng Java/C# rồi dùng vòng lặp if (emp.getSalary() >= 500 && emp.getManagerId() != null). Cách này tốn băng thông mạng khi bảng có hàng triệu dòng.",
      "optimal": "Đẩy bộ lọc xuống thẳng tầng DB bằng WHERE Salary >= 500 AND ManagerId IS NOT NULL kèm ORDER BY Salary DESC, Id ASC.",
      "trace": "Bảng Employees có 6 dòng. James (1000, ManagerId NULL) bị loại vì không có quản lý. John (400) bị loại vì lương < 500. Còn lại Michael (600), Johnathon (500), William (800), Sarah (750).",
      "sql": "SELECT Id, FName, LName, ManagerId, Salary\nFROM Employees\nWHERE Salary >= 500 AND ManagerId IS NOT NULL\nORDER BY Salary DESC, Id ASC;",
      "expected": {
        "cols": [
          "Id",
          "FName",
          "LName",
          "ManagerId",
          "Salary"
        ],
        "rows": [
          [
            5,
            "William",
            "Morris",
            3,
            800
          ],
          [
            6,
            "Sarah",
            "Connor",
            5,
            750
          ],
          [
            3,
            "Michael",
            "Williams",
            1,
            600
          ],
          [
            4,
            "Johnathon",
            "Smith",
            2,
            500
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Nhiều bạn viết ManagerId <> NULL thay vì ManagerId IS NOT NULL, dẫn tới kết quả trả về 0 dòng.",
      "note3": {
        "idea": "Luôn dùng IS NOT NULL khi lọc bỏ giá trị khuyết và đẩy điều kiện lọc xuống WHERE.",
        "syntax": "WHERE col >= val AND nullable_col IS NOT NULL ORDER BY col1 DESC, col2 ASC",
        "trap": "Viết col != NULL hoặc col <> NULL sẽ trả về UNKNOWN (tương đương sai trong WHERE)."
      }
    },
    {
      "id": "ch01_p2",
      "title": "Truy tìm đơn hàng có phí vận chuyển hoặc không dùng mã giảm giá",
      "difficulty": "Dễ",
      "db": "shoponline",
      "summary": "Trên CSDL ShopOnline, hãy tìm các đơn hàng đã hoàn thành (TrangThai = 'HOAN_THANH') mà khách hàng không dùng mã giảm giá (MaGiamGia là NULL) hoặc phải trả phí vận chuyển lớn hơn 0. Trả về MaDH, MaKH, NgayDat, PhiShip, MaGiamGia sắp xếp theo MaDH tăng dần.",
      "understand": "Chú ý độ ưu tiên toán tử: AND có độ ưu tiên cao hơn OR. Vì vậy điều kiện (MaGiamGia IS NULL OR PhiShip > 0) bắt buộc phải đặt trong cặp ngoặc đơn.",
      "brute": "Viết thiếu ngoặc đơn: WHERE TrangThai = 'HOAN_THANH' AND MaGiamGia IS NULL OR PhiShip > 0. Khi đó đơn DA_HUY có PhiShip = 40 cũng bị lọt vào kết quả!",
      "optimal": "Dùng ngoặc đơn chuẩn xác: WHERE TrangThai = 'HOAN_THANH' AND (MaGiamGia IS NULL OR PhiShip > 0).",
      "trace": "Các đơn HOAN_THANH là 1001, 1002, 1003, 1005, 1007. Đơn 1001 có PhiShip=30 (>0) -> nhận. Đơn 1002 có MaGiamGia NULL -> nhận. Đơn 1003 có cả hai -> nhận. Đơn 1005 và 1007 có PhiShip=0 và có MaGiamGia -> loại.",
      "sql": "SELECT MaDH, MaKH, NgayDat, PhiShip, MaGiamGia\nFROM DonHang\nWHERE TrangThai = 'HOAN_THANH'\n  AND (MaGiamGia IS NULL OR PhiShip > 0)\nORDER BY MaDH ASC;",
      "expected": {
        "cols": [
          "MaDH",
          "MaKH",
          "NgayDat",
          "PhiShip",
          "MaGiamGia"
        ],
        "rows": [
          [
            1001,
            1,
            "2024-01-05",
            30,
            "TET2024"
          ],
          [
            1002,
            2,
            "2024-01-12",
            0,
            null
          ],
          [
            1003,
            1,
            "2024-02-01",
            25,
            null
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Quên đóng mở ngoặc đơn quanh mệnh đề OR khi đi kèm với AND.",
      "note3": {
        "idea": "Toán tử AND luôn được tính trước OR, phải bọc ngoặc đơn quanh cụm điều kiện OR.",
        "syntax": "WHERE A = 1 AND (B IS NULL OR C > 0)",
        "trap": "Bỏ ngoặc đơn làm câu truy vấn lấy nhầm cả các đơn hàng đã hủy nhưng có phí ship > 0."
      }
    }
  ],
  "summary_table": [
    [
      "SELECT col AS alias",
      "Chiếu cột và đặt bí danh hiển thị",
      "Chạy ở bước thứ 3 (sau FROM và WHERE)"
    ],
    [
      "DISTINCT",
      "Khử các dòng trùng lặp hoàn toàn trên mọi cột được chọn",
      "Tốn chi phí Sort hoặc Hash"
    ],
    [
      "WHERE điều_kiện",
      "Lọc các dòng có biểu thức đạt giá trị TRUE",
      "Loại bỏ cả FALSE và UNKNOWN"
    ],
    [
      "IS NULL / IS NOT NULL",
      "Kiểm tra một cột có đang mang giá trị NULL hay không",
      "Không bao giờ dùng = NULL hay <> NULL"
    ],
    [
      "ORDER BY col ASC/DESC",
      "Sắp xếp kết quả đầu ra",
      "Không đảm bảo thứ tự dòng nếu thiếu ORDER BY"
    ],
    [
      "LIMIT n / TOP (n)",
      "Giới hạn số lượng dòng trả về",
      "LIMIT chuẩn SQLite/Postgres/MySQL; TOP trong T-SQL"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Biểu thức logic (TRUE OR NULL) và (FALSE AND NULL) trong SQL lần lượt trả về kết quả gì?",
      "a": "(TRUE OR NULL) trả về TRUE (vì chỉ cần 1 vế TRUE là phép OR đã đúng). (FALSE AND NULL) trả về FALSE (vì chỉ cần 1 vế FALSE là phép AND đã sai)."
    },
    {
      "q": "Câu 2: Tại sao câu lệnh SELECT HoTen, HocBong * 2 AS HB_GapDoi FROM SinhVien WHERE HB_GapDoi > 10000 lại báo lỗi?",
      "a": "Vì theo thứ tự thực thi logic, mệnh đề WHERE được thực thi trước mệnh đề SELECT. Lúc WHERE đang chạy thì bí danh HB_GapDoi chưa tồn tại."
    },
    {
      "q": "Câu 3: Để lưu số tiền giao dịch ngân hàng bằng VNĐ hoặc USD trong CSDL, bạn chọn FLOAT hay DECIMAL(19,4)? Vì sao?",
      "a": "Chọn DECIMAL(19,4) vì đây là kiểu số thập phân chính xác (Exact Numeric). Kiểu FLOAT dùng biểu diễn nhị phân xấp xỉ nên sẽ gây sai số làm tròn khi cộng trừ tiền tệ."
    }
  ]
});
