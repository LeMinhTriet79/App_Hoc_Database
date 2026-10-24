/**
 * FILE: src/data/chapters/ch11-security-sql-injection-permissions.js
 * MÔ TẢ: Chương 11 - Bảo Mật CSDL: Phòng Chống SQL Injection, Phân Quyền (GRANT/REVOKE/DENY), Schema & Data Masking
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch11",
  "code": "Chương 11",
  "title": "Bảo Mật CSDL: Phòng Chống SQL Injection, Phân Quyền (GRANT/REVOKE/DENY), Schema & Data Masking",
  "sources": [
    "S ch.34, 62",
    "M ch.74, 88, 94"
  ],
  "goals": [
    "Hiểu tận gốc cơ chế của SQL Injection (tách biệt Mã lệnh - Code và Dữ liệu - Data) và tại sao PreparedStatement / Parameterized Query chặn đứng được nó.",
    "Xử lý an toàn các tình huống không thể dùng tham số `?` như truyền động tên cột sắp xếp (ORDER BY) hoặc danh sách bảng.",
    "Sử dụng thành thạo bộ ba lệnh phân quyền DCL: GRANT, REVOKE, DENY cùng kiến trúc phân tách Schema và Role.",
    "Nắm bắt các tính năng bảo mật hiện đại trên SQL Server: Dynamic Data Masking (DDM), Row-Level Security (RLS) và Transparent Data Encryption (TDE)."
  ],
  "signals": [
    "Rà soát bảo mật (Security Review) phát hiện code Java/C# đang cộng chuỗi SQL trực tiếp từ tham số tìm kiếm của người dùng.",
    "Cần xây dựng chức năng sắp xếp động theo cột người dùng bấm trên bảng giao diện (ORDER BY ten_cot) mà không mở lỗ hổng SQL Injection.",
    "Yêu cầu tuân thủ bảo mật ngân hàng/y tế: nhân viên tổng đài chỉ được nhìn thấy 4 số cuối của thẻ tín dụng hoặc số điện thoại."
  ],
  "theory": "<h3>11.1. Bản chất của SQL Injection và cơ chế phòng vệ của Parameterized Query</h3>\n<p><strong>SQL Injection (SQLi)</strong> xảy ra khi ứng dụng ghép trực tiếp chuỗi đầu vào của người dùng vào câu lệnh SQL, khiến trình biên dịch CSDL không phân biệt được đâu là <strong>Cấu trúc lệnh của lập trình viên (Code)</strong> và đâu là <strong>Giá trị tham số của người dùng (Data)</strong>. Hãy mở <strong>Bộ Mô Phỏng Trực Quan &rarr; SQL Injection vs PreparedStatement</strong> để quan sát trực quan cách cây cú pháp bị bẻ gãy!</p>\n<p>Khi bạn sử dụng <strong>PreparedStatement (trong Java)</strong> hoặc <strong>SqlCommand với Parameters (trong C# / Dapper / EF Core)</strong>, quá trình giao tiếp với CSDL được tách làm 2 pha rõ rệt:</p>\n<ol>\n  <li><strong>Pha 1 - Chuẩn bị khung lệnh (Prepare / Compile):</strong> Ứng dụng gửi khung câu lệnh có dấu giữ chỗ <code>SELECT * FROM Users WHERE Username = ? AND PasswordHash = ?</code> xuống máy chủ. Máy chủ phân tích cú pháp (Parse) và chốt cứng cây cú pháp (Execution Plan) ngay tại lúc này!</li>\n  <li><strong>Pha 2 - Truyền giá trị thuần túy (Execute with Parameters):</strong> Ứng dụng gửi gói tin chứa giá trị chuỗi (ví dụ <code>' OR '1'='1</code>) vào ô tham số số 1. Lúc này cây cú pháp đã đóng băng, nên máy chủ chỉ coi toàn bộ chuỗi <code>' OR '1'='1</code> là một <strong>chuỗi văn bản thuần túy</strong> (đi tìm người dùng nào có tên tài khoản chứa đúng các ký tự dấu nháy và chữ OR đó!), tuyệt đối không bao giờ biên dịch nó thành toán tử logic nữa!</li>\n</ol>\n\n<h3>11.2. Khi nào PreparedStatement KHÔNG dùng được và cách xử lý an toàn?</h3>\n<p>Câu hỏi phỏng vấn cấp độ Mid rất hay hỏi: <em>\"Có phải mọi chỗ trong câu SQL đều đặt dấu hỏi chấm <code>?</code> hoặc <code>@param</code> được không?\"</em></p>\n<p><strong>Trả lời: KHÔNG!</strong> Tham số hóa chỉ thay thế được cho <strong>Giá trị dữ liệu (Literals)</strong>, bạn <strong>không thể</strong> truyền tham số <code>?</code> cho: (1) Tên bảng (<code>FROM ?</code>), (2) Tên cột trong <code>SELECT</code> hoặc <code>ORDER BY</code> (<code>ORDER BY ?</code>), và (3) Từ khóa hướng sắp xếp (<code>ASC</code> hay <code>DESC</code>). Để xử lý an toàn tuyệt đối cho các vị trí này, bạn phải áp dụng <strong>Danh sách trắng (Allowlist / Whitelist Mapping)</strong> ở tầng code ứng dụng:</p>\n<pre class=\"code-block\"><code>// Bắt buộc kiểm tra qua Map/Switch-case (Allowlist) trước khi ghép tên cột ORDER BY:\nString safeCol = switch (userSortParam) {\n    case \"price\" -> \"DonGia\";\n    case \"name\"  -> \"TenSP\";\n    default      -> \"MaSP\";\n};\nString safeDir = \"desc\".equalsIgnoreCase(userDirParam) ? \"DESC\" : \"ASC\";\nString sql = \"SELECT MaSP, TenSP, DonGia FROM SanPham ORDER BY \" + safeCol + \" \" + safeDir;</code></pre>\n\n<h3>11.3. Phân quyền theo Role, Schema và Nguyên tắc Đặc quyền tối thiểu (Least Privilege)</h3>\n<ul>\n  <li><strong>Không bao giờ dùng tài khoản <code>sa</code> (System Administrator) hay <code>postgres</code> trong chuỗi kết nối (Connection String) của ứng dụng web!</strong> Nếu web bị lộ lỗ hổng hoặc lộ file cấu hình, kẻ tấn công dùng quyền <code>sa</code> có thể xóa sạch mọi Database hoặc bật <code>xp_cmdshell</code> chiếm quyền điều khiển hệ điều hành Windows!</li>\n  <li><strong>Kiến trúc chuẩn:</strong> Tạo một tài khoản riêng cho ứng dụng (ví dụ <code>app_backend_user</code>), chỉ cấp đúng quyền <code>SELECT, INSERT, UPDATE, DELETE</code> trên các Schema/Bảng nghiệp vụ và quyền <code>EXECUTE</code> trên các Stored Procedure cần thiết. Không cấp quyền <code>DDL</code> (trừ luồng chạy Migration riêng biệt lúc triển khai).</li>\n  <li><strong>Quy tắc 3 lệnh DCL trong SQL Server:</strong> <code>GRANT</code> (cấp quyền), <code>REVOKE</code> (thu hồi lại lệnh GRANT hoặc DENY đã khai báo trước đó), và <code>DENY</code> (cấm tường minh, luôn có quyền ưu tiên cao nhất đè bẹp mọi lệnh GRANT từ các nhóm Role khác).</li>\n</ul>",
  "mechanism": "<h3>Chạy tay từng bước: So sánh Nối chuỗi thủ công và Parameterized Query trước chuỗi độc hại</h3>\n<p>Giả sử chức năng tra cứu đơn hàng nhận đầu vào từ ô tìm kiếm mã giảm giá <code>voucherInput</code>. Kẻ xấu nhập vào chuỗi: <code>TET2024' UNION SELECT MaKH, HoTen, SoDT FROM KhachHang --</code></p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Cơ chế xử lý</th>\n      <th>Câu lệnh thực tế máy chủ CSDL nhìn thấy</th>\n      <th>Hệ quả thực thi</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>1. Nối chuỗi trực tiếp (Vulnerable)</strong></td>\n      <td><code>SELECT MaDH, TrangThai, MaGiamGia FROM DonHang WHERE MaGiamGia = 'TET2024' UNION SELECT MaKH, HoTen, SoDT FROM KhachHang --'</code></td>\n      <td>Dấu nháy đơn kết thúc sớm chuỗi <code>TET2024</code>, kích hoạt toán tử <code>UNION SELECT</code> nối toàn bộ bảng <code>KhachHang</code> (kèm SĐT) trả thẳng ra màn hình tra cứu đơn hàng! Phần đuôi bị vô hiệu hóa bởi dấu comment <code>--</code>.</td>\n    </tr>\n    <tr>\n      <td><strong>2. PreparedStatement / SqlParameter (Safe)</strong></td>\n      <td>Khung cố định: <code>SELECT MaDH, TrangThai, MaGiamGia FROM DonHang WHERE MaGiamGia = @p0</code><br>Giá trị <code>@p0</code> = <code>\"TET2024' UNION SELECT ...\"</code></td>\n      <td>Máy chủ tìm xem có đơn hàng nào mà cột <code>MaGiamGia</code> dài đúng 61 ký tự có nội dung bằng nguyên chuỗi kia hay không &rarr; Không có dòng nào khớp &rarr; Trả về <strong>0 dòng an toàn tuyệt đối!</strong></td>\n    </tr>\n  </tbody>\n</table>",
  "examples": [
    {
      "title": "Ví dụ 11.1: Sự khác biệt giữa câu truy vấn bị tấn công SQL Injection (nối chuỗi) và truy vấn bình thường",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "-- Khi lập trình viên nối chuỗi trực tiếp: \"SELECT * FROM KhachHang WHERE Email = '\" + input + \"'\"\n-- Nếu kẻ tấn công nhập input là: ' OR '1'='1\n-- Câu lệnh biến thành lấy toàn bộ bảng KhachHang bất chấp email:\nSELECT MaKH, HoTen, Email, SoDT, HangThe\nFROM KhachHang\nWHERE Email = '' OR '1'='1';",
      "result": {
        "cols": [
          "MaKH",
          "HoTen",
          "Email",
          "SoDT",
          "HangThe"
        ],
        "rows": [
          [
            1,
            "Nguyen Van An",
            "an.nguyen@gmail.com",
            "0901112222",
            "VANG"
          ],
          [
            2,
            "Tran Thi Binh",
            "binh.tran@yahoo.com",
            "0903334444",
            "BAC"
          ],
          [
            3,
            "Le Hoang Cuong",
            null,
            "0915556666",
            "DONG"
          ],
          [
            4,
            "Pham Minh Dung",
            "dung.pham@outlook.com",
            "0901112222",
            "VANG"
          ],
          [
            5,
            "Vo Thi Em",
            "em.vo@gmail.com",
            null,
            "DONG"
          ],
          [
            6,
            "Hoang Gia Huy",
            "huy.hoang@gmail.com",
            "0987778888",
            "BAC"
          ]
        ]
      },
      "note": "Bởi vì biểu thức '1'='1' luôn đúng (TRUE) trên mọi dòng, mệnh đề WHERE bị vô hiệu hóa hoàn toàn, làm lộ toàn bộ dữ liệu khách hàng trong bảng!"
    },
    {
      "title": "Ví dụ 11.2: Tầng bảo vệ bằng View ẩn các cột nhạy cảm (Lương, SĐT cá nhân) cho nhân viên thường",
      "label": "CHUAN",
      "db": "autoshop",
      "sql": "CREATE VIEW vw_DanhBaNoiBo_CongKhai AS\nSELECT e.Id, e.FName, e.LName, d.Name AS PhongBan\nFROM Employees AS e\nINNER JOIN Departments AS d ON e.DepartmentId = d.Id;\n\nSELECT * FROM vw_DanhBaNoiBo_CongKhai ORDER BY Id;",
      "result": {
        "cols": [
          "Id",
          "FName",
          "LName",
          "PhongBan"
        ],
        "rows": [
          [
            1,
            "James",
            "Smith",
            "HR"
          ],
          [
            2,
            "John",
            "Johnson",
            "HR"
          ],
          [
            3,
            "Michael",
            "Williams",
            "Sales"
          ],
          [
            4,
            "Johnathon",
            "Smith",
            "HR"
          ],
          [
            5,
            "William",
            "Morris",
            "Tech"
          ],
          [
            6,
            "Sarah",
            "Connor",
            "Tech"
          ]
        ]
      },
      "note": "Thay vì cấp quyền SELECT trên bảng gốc Employees (có chứa cột Salary và PhoneNumber), quản trị viên chỉ cấp quyền SELECT trên View vw_DanhBaNoiBo_CongKhai."
    },
    {
      "title": "Ví dụ 11.3: Phân quyền theo nguyên tắc Đặc quyền tối thiểu (GRANT, DENY, REVOKE) và Schema trong T-SQL",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "-- 1. Tạo Schema riêng cho phân hệ Bán hàng và Role cho nhân viên Chăm sóc khách hàng:\nCREATE SCHEMA Sales AUTHORIZATION dbo;\nCREATE ROLE role_CSKH;\n\n-- 2. Cấp quyền đọc bảng KhachHang nhưng CẤM (DENY) đọc cột doanh số nhạy cảm:\nGRANT SELECT ON dbo.KhachHang TO role_CSKH;\nDENY DELETE, UPDATE ON dbo.KhachHang TO role_CSKH;\n\n-- 3. Thu hồi lại một quyền đã cấp bằng REVOKE:\nREVOKE SELECT ON dbo.KhachHang FROM role_CSKH;",
      "result": {
        "cols": [
          "Lệnh DCL",
          "Tác dụng",
          "Độ ưu tiên trong SQL Server"
        ],
        "rows": [
          [
            "GRANT",
            "Cấp quyền cho phép thực hiện hành động (SELECT, INSERT, EXECUTE...)",
            "Thấp hơn DENY"
          ],
          [
            "REVOKE",
            "Xóa bỏ quyền đã GRANT hoặc xóa bỏ lệnh DENY trước đó (trả về trạng thái trung lập)",
            "Trung lập"
          ],
          [
            "DENY",
            "Cấm tuyệt đối! Dù User thuộc một Role khác được GRANT thì lệnh DENY vẫn thắng!",
            "Cao nhất (Luôn ghi đè GRANT)"
          ]
        ]
      },
      "note": "Trong SQL Server, DENY có quyền lực cao hơn GRANT: nếu một nhân viên vừa thuộc nhóm Sales (được GRANT SELECT) vừa thuộc nhóm Thực tập sinh (bị DENY SELECT), nhân viên đó vẫn bị chặn không đọc được bảng! (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    },
    {
      "title": "Ví dụ 11.4: Che dấu dữ liệu động (Dynamic Data Masking - DDM) và Bảo mật cấp dòng (Row-Level Security) trong T-SQL",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "-- Cấu hình Dynamic Data Masking ngay trên cột (có từ SQL Server 2016+):\nALTER TABLE dbo.KhachHang\nALTER COLUMN Email ADD MASKED WITH (FUNCTION = 'email()');\n\nALTER TABLE dbo.KhachHang\nALTER COLUMN SoDT ADD MASKED WITH (FUNCTION = 'partial(2, \"xxxx\", 2)');\n\n-- Khi nhân viên CSKH (chưa được cấp quyền UNMASK) chạy câu SELECT * FROM KhachHang:",
      "result": {
        "cols": [
          "MaKH",
          "HoTen",
          "Email (Đã che bằng email())",
          "SoDT (Đã che bằng partial)"
        ],
        "rows": [
          [
            1,
            "Nguyen Van An",
            "aXXX@XXXX.com",
            "09xxxx22"
          ],
          [
            2,
            "Tran Thi Binh",
            "bXXX@XXXX.com",
            "09xxxx44"
          ]
        ]
      },
      "note": "Dynamic Data Masking che dữ liệu ngay lúc trả kết quả về cho các tài khoản không có quyền UNMASK mà không làm thay đổi dữ liệu gốc trên đĩa và không cần sửa code ứng dụng. (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    },
    {
      "title": "Ví dụ 11.5: Thực thi SQL động (Dynamic SQL) an toàn tuyệt đối bằng sp_executesql trong T-SQL",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "-- SAI LẦM CHẾT NGƯỜI (Stored Procedure vẫn bị SQL Injection nếu nối chuỗi EXEC(@sql)):\n-- EXEC('SELECT * FROM KhachHang WHERE ThanhPho = N''' + @ThanhPho + '''');\n\n-- CHUẨN AN TOÀN: Dùng sp_executesql có khai báo kiểu tham số tách biệt:\nDECLARE @sql NVARCHAR(MAX) = N'SELECT MaKH, HoTen, ThanhPho FROM dbo.KhachHang WHERE ThanhPho = @tp';\nEXEC sys.sp_executesql\n    @stmt = @sql,\n    @params = N'@tp NVARCHAR(40)',\n    @tp = @ThanhPhoInput;\n\n-- Nếu bắt buộc phải truyền động Tên Cột / Tên Bảng, phải bọc trong hàm QUOTENAME():\n-- SET @sql = N'SELECT * FROM dbo.KhachHang ORDER BY ' + QUOTENAME(@SortColumn);",
      "result": {
        "cols": [
          "Phương pháp chạy Dynamic SQL",
          "An toàn chống SQL Injection?",
          "Tái sử dụng Execution Plan Cache?"
        ],
        "rows": [
          [
            "EXEC('... ' + @input)",
            "KHÔNG (Bị tấn công ngay trong SP)",
            "Không (Sinh hàng nghìn kế hoạch rác làm tràn Plan Cache)"
          ],
          [
            "sp_executesql @stmt, @params, ...",
            "CÓ (Tham số hóa hoàn toàn)",
            "CÓ (Tái sử dụng cùng 1 Execution Plan đã biên dịch)"
          ]
        ]
      },
      "note": "Nhiều bạn lầm tưởng cứ nhét code vào Stored Procedure là miễn nhiễm với SQL Injection! Nếu bên trong SP bạn nối chuỗi rồi gọi EXEC(@sql), nó vẫn bị tấn công như thường. (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    }
  ],
  "dialects": [
    [
      "Bọc an toàn định danh trong Dynamic SQL",
      "QUOTENAME(@colName) (bọc trong [ ])",
      "Kiểm tra Allowlist (bọc trong ` `)",
      "format('%I', col_name) hoặc quote_ident(col_name)"
    ],
    [
      "Thực thi Dynamic SQL có tham số",
      "EXEC sys.sp_executesql @stmt, @params, ...",
      "PREPARE stmt FROM @sql; EXECUTE stmt USING @p;",
      "EXECUTE sql_string USING param1, param2;"
    ],
    [
      "Bảo mật cấp dòng (Row-Level Security)",
      "CREATE SECURITY POLICY ... ADD FILTER PREDICATE",
      "Dùng View có WHERE user = CURRENT_USER()",
      "ALTER TABLE ... ENABLE ROW LEVEL SECURITY; CREATE POLICY ..."
    ]
  ],
  "bridge_java": "// [Java - Spring Data JPA & JDBC] Cẩn trọng với nối chuỗi trong @Query hoặc EntityManager.createQuery()\n// Dùng \":paramName\" hoặc \"?1\" để JPA tự động ràng buộc qua PreparedStatement:\n\n// SAI (Bị SQL Injection ngay cả khi dùng Hibernate/JPA!):\n// entityManager.createQuery(\"FROM KhachHang kh WHERE kh.email = '\" + emailInput + \"'\").getResultList();\n\n// ĐÚNG (An toàn tuyệt đối):\nList<KhachHang> list = entityManager\n    .createQuery(\"SELECT kh FROM KhachHang kh WHERE kh.email = :email\", KhachHang.class)\n    .setParameter(\"email\", emailInput)\n    .getResultList();",
  "bridge_csharp": "// [C# - EF Core & Dapper] Phân biệt FromSqlRaw vs FromSql (Interpolated) trong EF Core!\n// Trong EF Core 7/8+, phương thức .FromSql($\"...\") sử dụng FormattableString để TỰ ĐỘNG biến các biến nội suy\n// thành DbParameter (@p0, @p1) an toàn! Ngược lại, nếu bạn nối chuỗi rồi truyền vào .FromSqlRaw(...) thì sẽ bị SQL Injection!\n\nstring emailInput = \"an.nguyen@gmail.com\";\n\n// ĐÚNG 1 (EF Core tự động biến {emailInput} thành tham số @p0):\nvar khach1 = await dbContext.KhachHangs\n    .FromSql($\"SELECT * FROM KhachHang WHERE Email = {emailInput}\")\n    .ToListAsync();\n\n// ĐÚNG 2 (Dapper tự động tham số hóa qua Anonymous Object):\nvar khach2 = await connection.QueryAsync<KhachHang>(\n    \"SELECT * FROM KhachHang WHERE Email = @Email\",\n    new { Email = emailInput });",
  "performance": "<ul>\n  <li><strong>Lợi ích kép của Parameterized Query đối với hiệu năng (Plan Cache Reuse):</strong> Việc dùng tham số <code>@param</code> hoặc <code>?</code> không chỉ chống SQL Injection mà còn giúp máy chủ CSDL <strong>tái sử dụng kế hoạch thực thi (Execution Plan Caching)</strong>! Nếu bạn nối chuỗi trực tiếp <code>WHERE MaKH = 1</code>, <code>WHERE MaKH = 2</code>... đến <code>WHERE MaKH = 100000</code>, SQL Server coi đó là 100.000 câu lệnh khác nhau, phải tốn CPU biên dịch (Compile) 100.000 lần và làm tràn bộ nhớ <em>Plan Cache</em> (hiện tượng <em>Plan Cache Bloat</em>). Khi dùng <code>WHERE MaKH = @MaKH</code>, máy chủ chỉ biên dịch đúng 1 lần duy nhất!</li>\n</ul>",
  "common_errors": [
    "Tưởng rằng dùng hàm replace(\"'\", \"''\") (thay dấu nháy đơn bằng 2 dấu nháy đơn) ở tầng code là đủ để chống SQL Injection: Kẻ tấn công vẫn có thể khai thác qua các tham số kiểu số (không cần dấu nháy đơn, ví dụ WHERE Id = 1 OR 1=1), hoặc tấn công qua bảng mã ký tự đa byte và Second-Order SQL Injection.",
    "Tưởng rằng dùng ORM (Hibernate, EF Core) hoặc Stored Procedure là không bao giờ bị SQL Injection: Nếu nối chuỗi bằng dấu '+' bên trong createQuery(), FromSqlRaw() hoặc EXEC(@sql) trong SP thì vẫn bị tấn công 100%.",
    "Cấu hình ứng dụng kết nối vào Database bằng tài khoản quản trị tối cao 'sa' (SQL Server) hoặc 'root' (MySQL) trên môi trường Production.",
    "Hiểu nhầm Dynamic Data Masking (DDM) là mã hóa dữ liệu: DDM chỉ che chuỗi ở bước hiển thị kết quả cuối cùng; người dùng nếu có quyền viết điều kiện WHERE Lương > 50000 vẫn có thể dò tìm (Brute-force inference) ra giá trị thật của cột đã bị che!",
    "Nhầm lẫn giữa REVOKE và DENY trong SQL Server: Dùng REVOKE để cố chặn một người dùng đang nằm trong nhóm Role có quyền, nhưng REVOKE chỉ xóa quyền cấp riêng chứ không chặn quyền thừa kế từ Role (phải dùng DENY)."
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "SQL Injection là gì? Tại sao dùng PreparedStatement (hoặc SqlParameter) lại chống được SQL Injection?",
      "a_short": "SQL Injection là lỗ hổng khi dữ liệu đầu vào của người dùng bị ghép trực tiếp vào chuỗi lệnh SQL và bị thực thi như mã lệnh. PreparedStatement chống được vì nó biên dịch cố định cấu trúc câu lệnh SQL trước, sau đó mới truyền dữ liệu vào dưới dạng tham số thuần túy, không cho phép dữ liệu làm thay đổi cây cú pháp.",
      "a_long": "Khi nối chuỗi trực tiếp, các ký tự điều khiển như dấu nháy đơn ('), dấu chấm phẩy (;) hoặc chú thích (--) trong đầu vào của người dùng sẽ phá vỡ cấu trúc câu lệnh gốc. Với PreparedStatement, câu lệnh chứa dấu '?' được gửi tới DB để biên dịch thành cây thực thi (Execution Plan) trước. Khi giá trị tham số được gửi theo sau, Database Engine chỉ đặt giá trị đó vào đúng ô bộ nhớ của tham số mà không phân tích cú pháp lại, đồng thời giúp DB tái sử dụng Execution Plan."
    },
    {
      "level": "Junior",
      "q": "Nếu người dùng chọn cột muốn sắp xếp trên giao diện (ví dụ sắp xếp theo Giá hoặc theo Ngày tạo), bạn có thể truyền tên cột đó qua tham số PreparedStatement (ORDER BY ?) được không? Nếu không thì xử lý thế nào cho an toàn?",
      "a_short": "Không thể truyền tên cột hay tên bảng qua tham số '?' của PreparedStatement (hoặc nếu truyền thì DB sẽ hiểu là sắp xếp theo một hằng chuỗi cố định nên không có tác dụng sắp xếp). Cách xử lý an toàn là kiểm tra đầu vào qua một danh sách trắng (Allowlist / Switch-case) ánh xạ sang tên cột hợp lệ.",
      "a_long": "Nếu bạn viết ORDER BY ? và truyền chuỗi 'DonGia', máy chủ sẽ hiểu là ORDER BY 'DonGia' (sắp xếp theo một hằng số chuỗi giống nhau ở mọi dòng, tức là không sắp xếp gì cả!). Vì tên cột là một Định danh (Identifier) thuộc về cấu trúc câu lệnh, bạn phải dùng một bảng ánh xạ (Allowlist/Whitelist) trong code Java/C# chỉ chấp nhận các từ khóa cố định ('price' -> 'DonGia', 'date' -> 'NgayDat'), nếu nằm ngoài danh sách thì gán về cột mặc định hoặc báo lỗi, tuyệt đối không ghép thẳng chuỗi của người dùng."
    },
    {
      "level": "Mid",
      "q": "Phân biệt ba lệnh GRANT, REVOKE và DENY trong SQL Server. Nếu User A thuộc Role 'NhanVien' (được GRANT SELECT trên bảng Lương) nhưng riêng User A bị chạy lệnh DENY SELECT trên bảng Lương, hỏi User A có đọc được bảng Lương không?",
      "a_short": "GRANT là cấp quyền; REVOKE là hủy bỏ lệnh GRANT hoặc DENY đã cấp trước đó; DENY là cấm tường minh. Trong SQL Server, DENY luôn có độ ưu tiên cao nhất, nên User A sẽ KHÔNG đọc được bảng Lương.",
      "a_long": "Mô hình phân quyền của SQL Server đánh giá theo nguyên tắc 'DENY wins': bất kỳ một lệnh DENY nào áp dụng trực tiếp trên User hoặc trên bất kỳ Role nào mà User đó tham gia sẽ phủ quyết toàn bộ các lệnh GRANT ở cùng cấp độ đối tượng (ngoại trừ thành viên của sysadmin cố định). Nếu muốn gỡ bỏ lệnh DENY đó để User A hưởng lại quyền từ Role 'NhanVien', quản trị viên sẽ chạy lệnh REVOKE SELECT ON Luong FROM UserA (lệnh REVOKE sẽ xóa bỏ trạng thái DENY)."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 11.1: Tạo View che giấu thông tin nhạy cảm của sinh viên",
      "problem": "Trên CSDL TruongHoc, cột NgaySinh và HocBong được coi là thông tin tài chính cá nhân không công khai cho lớp trưởng. Hãy tạo một View có tên vw_DanhSachSinhVienCongKhai chỉ gồm 3 cột: MaSV, HoTen, GioiTinh, MaKhoa. Sau đó viết câu lệnh SELECT * FROM vw_DanhSachSinhVienCongKhai WHERE MaKhoa = 'CNTT' ORDER BY MaSV ASC.",
      "intuition": "Dùng CREATE VIEW vw_DanhSachSinhVienCongKhai AS SELECT MaSV, HoTen, GioiTinh, MaKhoa FROM SinhVien; rồi SELECT từ View.",
      "trace": "View chỉ phơi bày đúng 4 cột công khai, ẩn hoàn toàn NgaySinh và HocBong.",
      "sql": "CREATE VIEW vw_DanhSachSinhVienCongKhai AS\nSELECT MaSV, HoTen, GioiTinh, MaKhoa\nFROM SinhVien;\n\nSELECT * FROM vw_DanhSachSinhVienCongKhai\nWHERE MaKhoa = 'CNTT'\nORDER BY MaSV ASC;",
      "db": "truonghoc",
      "expected": {
        "cols": [
          "MaSV",
          "HoTen",
          "GioiTinh",
          "MaKhoa"
        ],
        "rows": [
          [
            201,
            "Bui Minh Tuan",
            "Nam",
            "CNTT"
          ],
          [
            202,
            "Doan Thu Ha",
            "Nu",
            "CNTT"
          ],
          [
            203,
            "Ngo Quang Khai",
            "Nam",
            "CNTT"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Tạo View chỉ chọn 4 cột MaSV, HoTen, GioiTinh, MaKhoa từ bảng SinhVien.",
        "CREATE VIEW vw_DanhSachSinhVienCongKhai AS SELECT MaSV, HoTen, GioiTinh, MaKhoa FROM SinhVien; SELECT ...;",
        "CREATE VIEW vw_DanhSachSinhVienCongKhai AS SELECT MaSV, HoTen, GioiTinh, MaKhoa FROM SinhVien; SELECT * FROM vw_DanhSachSinhVienCongKhai WHERE MaKhoa = 'CNTT' ORDER BY MaSV ASC;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 11.2: Che giấu (Masking) số điện thoại khách hàng ngay trong câu truy vấn chuẩn SQL",
      "problem": "Trên CSDL ShopOnline, hãy viết câu truy vấn lấy MaKH, HoTen và cột SoDT_DaChe từ bảng KhachHang theo quy tắc: nếu SoDT là NULL thì hiển thị 'CHUA_CO', ngược lại chỉ giữ 3 chữ số đầu và 2 chữ số cuối, ở giữa thay bằng '*****' (dùng SUBSTR(SoDT, 1, 3) || '*****' || SUBSTR(SoDT, -2)). Sắp xếp theo MaKH tăng dần.",
      "intuition": "Dùng CASE WHEN SoDT IS NULL THEN 'CHUA_CO' ELSE SUBSTR(SoDT, 1, 3) || '*****' || SUBSTR(SoDT, -2) END.",
      "trace": "Số '0901112222' sẽ được hiển thị an toàn thành '090*****22'. Dòng MaKH = 5 (SoDT NULL) hiển thị 'CHUA_CO'.",
      "sql": "SELECT MaKH, HoTen,\n       CASE\n           WHEN SoDT IS NULL THEN 'CHUA_CO'\n           ELSE SUBSTR(SoDT, 1, 3) || '*****' || SUBSTR(SoDT, -2)\n       END AS SoDT_DaChe\nFROM KhachHang\nORDER BY MaKH ASC;",
      "db": "shoponline",
      "expected": {
        "cols": [
          "MaKH",
          "HoTen",
          "SoDT_DaChe"
        ],
        "rows": [
          [
            1,
            "Nguyen Van An",
            "090*****22"
          ],
          [
            2,
            "Tran Thi Binh",
            "090*****44"
          ],
          [
            3,
            "Le Hoang Cuong",
            "091*****66"
          ],
          [
            4,
            "Pham Minh Dung",
            "090*****22"
          ],
          [
            5,
            "Vo Thi Em",
            "CHUA_CO"
          ],
          [
            6,
            "Hoang Gia Huy",
            "098*****88"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Hàm SUBSTR(SoDT, 1, 3) lấy 3 ký tự đầu, và SUBSTR(SoDT, -2) (hoặc SUBSTR(SoDT, LENGTH(SoDT)-1, 2)) lấy 2 ký tự cuối.",
        "SELECT MaKH, HoTen, CASE WHEN SoDT IS NULL THEN 'CHUA_CO' ELSE SUBSTR(SoDT, 1, 3) || '*****' || SUBSTR(SoDT, -2) END AS SoDT_DaChe FROM KhachHang ORDER BY MaKH ASC;",
        "SELECT MaKH, HoTen, CASE WHEN SoDT IS NULL THEN 'CHUA_CO' ELSE SUBSTR(SoDT, 1, 3) || '*****' || SUBSTR(SoDT, -2) END AS SoDT_DaChe FROM KhachHang ORDER BY MaKH ASC;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch11_p1",
      "title": "Mô phỏng Row-Level Security (Bảo mật cấp dòng): Nhân viên chỉ xem được xe do chính mình hoặc cấp dưới trực tiếp phụ trách",
      "difficulty": "Khá",
      "db": "autoshop",
      "summary": "Trên CSDL Auto Shop, giả sử nhân viên đang đăng nhập có Id = 3 (Michael Williams). Hãy viết câu truy vấn lấy ra các chiếc xe trong bảng Cars (gồm Id, Model, Status, EmployeeId, TotalCost) mà người phụ trách chiếc xe đó (EmployeeId) chính là nhân viên số 3 HOẶC là cấp dưới trực tiếp do nhân viên số 3 quản lý (có ManagerId = 3 trong bảng Employees). Sắp xếp theo Cars.Id tăng dần.",
      "understand": "Nối bảng Cars với bảng Employees theo c.EmployeeId = e.Id, rồi lọc WHERE e.Id = 3 OR e.ManagerId = 3.",
      "brute": "Lấy toàn bộ bảng Cars về giao diện rồi mới ẩn hiện bằng JavaScript.",
      "optimal": "Áp dụng bộ lọc bảo mật ngay tại tầng truy vấn SQL: WHERE e.Id = 3 OR e.ManagerId = 3.",
      "trace": "Nhân viên số 3 phụ trách xe Id = 4. Cấp dưới trực tiếp của 3 là nhân viên số 5 (William Morris, có ManagerId = 3), người này phụ trách xe Id = 5 và Id = 6. Tổng cộng trả về 3 chiếc xe: Id 4, 5, 6.",
      "sql": "SELECT c.Id, c.Model, c.Status, c.EmployeeId, c.TotalCost\nFROM Cars AS c\nINNER JOIN Employees AS e ON c.EmployeeId = e.Id\nWHERE e.Id = 3 OR e.ManagerId = 3\nORDER BY c.Id ASC;",
      "expected": {
        "cols": [
          "Id",
          "Model",
          "Status",
          "EmployeeId",
          "TotalCost"
        ],
        "rows": [
          [
            4,
            "Toyota Prius",
            "WORKING",
            3,
            1254
          ],
          [
            5,
            "Honda Civic",
            "READY",
            5,
            450
          ],
          [
            6,
            "Mazda 3",
            "WAITING",
            5,
            320
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Chỉ lọc WHERE c.EmployeeId = 3 mà quên mất các nhân viên cấp dưới có e.ManagerId = 3.",
      "note3": {
        "idea": "Bảo mật cấp dòng (Row-Level Security - RLS) luôn gắn điều kiện lọc theo định danh người đang đăng nhập vào mọi truy vấn đọc/ghi.",
        "syntax": "INNER JOIN Employees e ON c.EmployeeId = e.Id WHERE e.Id = @CurrentUserId OR e.ManagerId = @CurrentUserId",
        "trap": "Không bao giờ lọc phân quyền dữ liệu ở tầng Frontend (JS); điều kiện lọc quyền sở hữu bắt buộc phải nằm trong câu SQL ở Backend/Database."
      }
    }
  ],
  "summary_table": [
    [
      "PreparedStatement / Parameter",
      "Tách biệt cấu trúc lệnh SQL và dữ liệu tham số",
      "Chống 100% SQL Injection và giúp tái sử dụng Plan Cache"
    ],
    [
      "Allowlist + QUOTENAME()",
      "Bảo vệ tên bảng/tên cột khi bắt buộc dùng Dynamic SQL",
      "Không bao giờ truyền trực tiếp chuỗi người dùng vào ORDER BY"
    ],
    [
      "GRANT / REVOKE / DENY",
      "Bộ 3 lệnh quản lý quyền truy cập (DCL)",
      "DENY luôn ưu tiên cao hơn GRANT"
    ],
    [
      "Dynamic Data Masking (DDM)",
      "Che một phần Email, SĐT, Thẻ tín dụng khi hiển thị",
      "Không thay đổi dữ liệu gốc, cấu hình ngay trên cột"
    ],
    [
      "Row-Level Security (RLS)",
      "Tự động lọc dòng theo người dùng hoặc chi nhánh (Tenant)",
      "Rất hữu ích cho kiến trúc SaaS Multi-tenant"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Một Stored Procedure trong SQL Server nhận tham số @TenSP NVARCHAR(100) và bên trong viết: EXEC('SELECT * FROM SanPham WHERE TenSP = N''' + @TenSP + ''''). Hỏi Stored Procedure này có an toàn trước SQL Injection không?",
      "a": "KHÔNG AN TOÀN! Dù nằm trong Stored Procedure nhưng việc dùng toán tử '+' để nối chuỗi rồi gọi EXEC() vẫn mở toang lỗ hổng SQL Injection. Phải dùng câu SELECT tĩnh hoặc dùng sp_executesql có tham số."
    },
    {
      "q": "Câu 2: Việc sử dụng Parameterized Query (WHERE MaKH = @MaKH) ngoài tác dụng chống SQL Injection còn mang lại lợi ích lớn nào cho bộ nhớ và CPU của máy chủ CSDL?",
      "a": "Giúp máy chủ biên dịch câu lệnh một lần và tái sử dụng lại Execution Plan trong Plan Cache cho mọi giá trị @MaKH khác nhau, tiết kiệm CPU biên dịch và chống tràn bộ nhớ Plan Cache."
    },
    {
      "q": "Câu 3: Trong C# EF Core 8, giữa hai lệnh dbContext.Users.FromSql($\"SELECT * FROM Users WHERE Name = {name}\") và dbContext.Users.FromSqlRaw($\"SELECT * FROM Users WHERE Name = '{name}'\"), lệnh nào an toàn và lệnh nào bị lỗi SQL Injection?",
      "a": "Lệnh FromSql($\"...\") AN TOÀN vì EF Core nhận FormattableString và tự động chuyển biến {name} thành DbParameter. Lệnh FromSqlRaw($\"...\") BỊ LỖI SQL INJECTION vì chuỗi đã bị nội suy thành String thường trước khi truyền vào hàm."
    }
  ]
});
