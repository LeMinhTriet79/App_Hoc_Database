/**
 * FILE: src/data/chapters/ch10-views-stored-procs-triggers-temp.js
 * MÔ TẢ: Chương 10 - Đối Tượng Lập Trình CSDL: View, Stored Procedure, Function, Trigger, Cursor & Temp Table
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch10",
  "code": "Chương 10",
  "title": "Đối Tượng Lập Trình CSDL: View, Stored Procedure, Function, Trigger, Cursor & Temp Table",
  "sources": [
    "S ch.22, 23, 47, 53, 54, 55",
    "M ch.8, 17, 18, 20, 21, 50, 61, 62, 66, 70, 93"
  ],
  "goals": [
    "Hiểu rõ bản chất, lợi ích và giới hạn của View (khung nhìn thường vs Indexed/Materialized View).",
    "So sánh rành mạch Stored Procedure (Thủ tục lưu trữ) và User-Defined Function (Hàm tự định nghĩa: Scalar UDF vs Inline Table-Valued Function).",
    "Nắm vững cơ chế hoạt động của Trigger (AFTER vs INSTEAD OF), bảng ảo inserted/deleted và lý do kiến trúc sư hạn chế lạm dụng Trigger chứa logic nghiệp vụ.",
    "Phân biệt #TempTable, ##GlobalTempTable, @TableVariable và CTE; biết cách thay thế Cursor (con trỏ duyệt từng dòng) bằng tư duy tập hợp (Set-based)."
  ],
  "signals": [
    "Câu hỏi phỏng vấn kinh điển: 'Hãy nêu 5 điểm khác biệt giữa Stored Procedure và Function trong SQL Server'.",
    "Một câu truy vấn SELECT gọi một hàm tự viết (Scalar UDF) kiểu dbo.fn_TinhThue(MaDH) chạy mất 30 giây cho 50.000 dòng.",
    "Cần chọn giữa CTE, #TempTable và @TableVariable khi viết một báo cáo tài chính phức tạp dài 200 dòng SQL."
  ],
  "theory": "<h3>10.1. Cuộc đối đầu kinh điển: Stored Procedure (SP) vs Function (UDF)</h3>\n<p>Đây là câu hỏi xuất hiện với tần suất gần như 100% khi phỏng vấn lập trình viên .NET và Java làm việc với hệ thống doanh nghiệp (ERP, Ngân hàng, Bảo hiểm):</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Tiêu chí so sánh</th>\n      <th>Stored Procedure (Thủ tục lưu trữ)</th>\n      <th>Function (User-Defined Function - UDF)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>Giá trị trả về</strong></td>\n      <td>Có thể không trả về gì, trả về 1 hoặc nhiều bảng kết quả (Result Sets), trả về qua tham số <code>OUTPUT</code>, và 1 mã trạng thái kiểu số nguyên (<code>RETURN int</code>).</td>\n      <td><strong>Bắt buộc phải trả về</strong> một giá trị vô hướng (Scalar value) hoặc một bảng duy nhất (Table-Valued).</td>\n    </tr>\n    <tr>\n      <td><strong>Gọi trực tiếp trong câu SELECT?</strong></td>\n      <td><strong>KHÔNG THỂ</strong> viết <code>SELECT dbo.usp_TenSP() FROM ...</code> (phải gọi bằng lệnh <code>EXEC / EXECUTE</code>).</td>\n      <td><strong>CÓ THỂ</strong> nhúng trực tiếp vào <code>SELECT</code>, <code>WHERE</code>, <code>JOIN</code> hoặc <code>CROSS APPLY</code>.</td>\n    </tr>\n    <tr>\n      <td><strong>Thay đổi dữ liệu (DML: INSERT/UPDATE/DELETE)?</strong></td>\n      <td><strong>Được phép</strong> thực hiện mọi lệnh DML và DDL.</td>\n      <td><strong>KHÔNG ĐƯỢC PHÉP</strong> làm thay đổi trạng thái dữ liệu của các bảng vật lý trong CSDL (chỉ được sửa biến bảng cục bộ bên trong hàm).</td>\n    </tr>\n    <tr>\n      <td><strong>Quản lý Transaction &amp; Bắt lỗi?</strong></td>\n      <td><strong>Được phép</strong> dùng <code>BEGIN TRAN / COMMIT / ROLLBACK</code> và khối <code>TRY...CATCH</code>.</td>\n      <td><strong>Không được phép</strong> mở Transaction hay dùng <code>TRY...CATCH</code> bên trong hàm.</td>\n    </tr>\n    <tr>\n      <td><strong>Gọi chéo nhau?</strong></td>\n      <td>Stored Procedure <strong>gọi được</strong> Function.</td>\n      <td>Function <strong>KHÔNG gọi được</strong> Stored Procedure.</td>\n    </tr>\n  </tbody>\n</table>\n\n<h3>10.2. Ba loại Function trong SQL Server và \"Sát thủ hiệu năng\" Scalar UDF</h3>\n<ul>\n  <li><strong>1. Scalar Function (Hàm trả về 1 giá trị đơn):</strong> Nếu bên trong một Scalar Function có chứa câu lệnh truy vấn bảng (ví dụ <code>dbo.fn_TinhTongDon(MaKH)</code>), và bạn đặt hàm đó vào danh sách cột của <code>SELECT</code> trên 100.000 khách hàng: máy chủ sẽ <strong>gọi lặp lại hàm đó 100.000 lần (Row-by-Agonizing-Row - RBAR)</strong>, đồng thời <strong>cấm câu truy vấn chạy đa luồng (Forbids Parallelism)</strong>! <em>(Lưu ý: Từ SQL Server 2019 có tính năng Scalar UDF Inlining giúp tự động bung một số hàm đơn giản, nhưng vẫn bị tắt ở nhiều trường hợp phức tạp).</em></li>\n  <li><strong>2. Multi-Statement Table-Valued Function (MSTVF):</strong> Khai báo biến bảng <code>RETURNS @Result TABLE (...)</code> rồi chèn dữ liệu qua nhiều bước. Giống như biến bảng, MSTVF có ước lượng số dòng kém nếu trên phiên bản cũ.</li>\n  <li><strong>3. Inline Table-Valued Function (iTVF - KHUYÊN DÙNG!):</strong> Chỉ gồm đúng <code>RETURNS TABLE AS RETURN (SELECT ...)</code>. SQL Server coi iTVF giống hệt một <strong>View có truyền tham số (Parameterized View)</strong>: nó bung thẳng câu lệnh vào kế hoạch thực thi ngoài, tận dụng 100% Index và chạy đa luồng cực nhanh!</li>\n</ul>\n\n<h3>10.3. Bảng so sánh chọn lựa: CTE vs @TableVariable vs #TempTable</h3>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Đặc điểm</th>\n      <th>CTE (<code>WITH cte AS</code>)</th>\n      <th>Biến bảng (<code>@TableVar</code>)</th>\n      <th>Bảng tạm cục bộ (<code>#TempTable</code>)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>Phạm vi sống (Scope)</strong></td>\n      <td>Chỉ tồn tại trong <strong>đúng 1 câu lệnh</strong> ngay sau nó.</td>\n      <td>Tồn tại trong phạm vi Batch / Stored Procedure hiện tại.</td>\n      <td>Tồn tại trong toàn bộ Phiên kết nối (Session) hoặc SP tạo ra nó (và các SP con được gọi bên trong).</td>\n    </tr>\n    <tr>\n      <td><strong>Thống kê &amp; Index</strong></td>\n      <td>Không lưu vật lý, dùng trực tiếp Index của bảng gốc.</td>\n      <td>Chỉ tạo được Index qua ràng buộc PK/UNIQUE lúc khai báo; không có Histogram thống kê.</td>\n      <td>Có <strong>Statistics (Histogram) đầy đủ</strong>, tạo được mọi loại Clustered/Non-Clustered Index sau khi đổ dữ liệu.</td>\n    </tr>\n    <tr>\n      <td><strong>Khi nào nên dùng?</strong></td>\n      <td>Làm sạch code, lọc kết quả Window Function, hoặc truy vấn đệ quy.</td>\n      <td>Tập dữ liệu rất nhỏ (&lt; 100 dòng) hoặc dùng làm tham số truyền bảng (Table-Valued Parameter - TVP), hoặc giữ log sau khi Rollback.</td>\n      <td>Tập dữ liệu trung gian lớn (&gt; 1.000 dòng) cần được đọc đi đọc lại nhiều lần và cần JOIN phức tạp.</td>\n    </tr>\n  </tbody>\n</table>",
  "mechanism": "<h3>Chạy tay từng bước: Vì sao Cursor (Con trỏ) và Scalar UDF lại chậm hơn Set-based SQL gấp hàng trăm lần?</h3>\n<p>Giả sử bạn cần cập nhật cộng thưởng cho <strong>50.000 nhân viên</strong>. Hãy so sánh hai cách máy chủ xử lý bên dưới:</p>\n<div class=\"trace-steps\">\n  <div class=\"trace-step\"><strong>Cách 1 - Dùng CURSOR (hoặc vòng lặp WHILE duyệt từng dòng - Tư duy mệnh lệnh RBAR):</strong>\n    <ul>\n      <li>Khởi tạo cấu trúc con trỏ trong <code>tempdb</code>.</li>\n      <li>Lặp 50.000 vòng: mỗi vòng gọi <code>FETCH NEXT</code>, xin khóa dòng, chạy 1 câu <code>UPDATE</code> riêng lẻ, ghi 1 bản ghi Transaction Log và cập nhật Index.</li>\n      <li>Tổng cộng máy chủ phải thực thi <strong>50.000 kế hoạch câu lệnh rời rạc</strong>, không thể dùng thuật toán Merge/Hash Join tối ưu. Thời gian chạy: <strong>~15 đến 40 giây</strong>.</li>\n    </ul>\n  </div>\n  <div class=\"trace-step\"><strong>Cách 2 - Dùng 1 câu lệnh UPDATE tập hợp (Set-based SQL):</strong>\n    <ul>\n      <li>Trình tối ưu nhìn toàn bộ tập 50.000 dòng một lượt, chọn thuật toán quét trang tuần tự (Sequential Scan) và cập nhật theo lô trang dữ liệu.</li>\n      <li>Chỉ tốn 1 lần biên dịch kế hoạch và tận dụng tối đa bộ đệm RAM (Buffer Pool). Thời gian chạy: <strong>~0.08 giây (80 mili-giây)</strong>!</li>\n    </ul>\n  </div>\n</div>",
  "examples": [
    {
      "title": "Ví dụ 10.1: Tạo và truy vấn qua View (Khung nhìn ảo) giúp đóng gói câu JOIN phức tạp",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "CREATE VIEW vw_BaoCaoDonHang AS\nSELECT dh.MaDH, dh.NgayDat, dh.TrangThai,\n       kh.MaKH, kh.HoTen AS TenKhachHang, kh.HangThe,\n       SUM(ct.SoLuong * ct.DonGiaBan - COALESCE(ct.ChietKhau, 0)) + dh.PhiShip AS TongThanhToan\nFROM DonHang AS dh\nINNER JOIN KhachHang AS kh ON dh.MaKH = kh.MaKH\nINNER JOIN ChiTietDon AS ct ON dh.MaDH = ct.MaDH\nGROUP BY dh.MaDH, dh.NgayDat, dh.TrangThai, kh.MaKH, kh.HoTen, kh.HangThe, dh.PhiShip;\n\nSELECT MaDH, TenKhachHang, HangThe, TrangThai, TongThanhToan\nFROM vw_BaoCaoDonHang\nWHERE TrangThai = 'HOAN_THANH'\nORDER BY TongThanhToan DESC;",
      "result": {
        "cols": [
          "MaDH",
          "TenKhachHang",
          "HangThe",
          "TrangThai",
          "TongThanhToan"
        ],
        "rows": [
          [
            1007,
            "Nguyen Van An",
            "VANG",
            "HOAN_THANH",
            31350
          ],
          [
            1003,
            "Nguyen Van An",
            "VANG",
            "HOAN_THANH",
            16625
          ],
          [
            1002,
            "Tran Thi Binh",
            "BAC",
            "HOAN_THANH",
            8700
          ],
          [
            1005,
            "Pham Minh Dung",
            "VANG",
            "HOAN_THANH",
            5650
          ],
          [
            1001,
            "Nguyen Van An",
            "VANG",
            "HOAN_THANH",
            2430
          ]
        ]
      },
      "note": "View không tự lưu dữ liệu vật lý (trừ Indexed/Materialized View) mà lưu câu lệnh SELECT. Khi ứng dụng truy vấn View, CSDL sẽ trộn câu lệnh của View với điều kiện WHERE bên ngoài."
    },
    {
      "title": "Ví dụ 10.2: Viết Trigger tự động ghi nhận lịch sử thay đổi giá sản phẩm (Audit Trigger)",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "CREATE TABLE LichSuGiaSanPham (\n    Id INTEGER PRIMARY KEY AUTOINCREMENT,\n    MaSP INT NOT NULL,\n    GiaCu INT NOT NULL,\n    GiaMoi INT NOT NULL,\n    ThoiDiemThayDoi DATETIME DEFAULT '2025-01-01 08:00:00'\n);\n\nCREATE TRIGGER trg_GhiLogDoiGia\nAFTER UPDATE OF DonGia ON SanPham\nWHEN OLD.DonGia <> NEW.DonGia\nBEGIN\n    INSERT INTO LichSuGiaSanPham (MaSP, GiaCu, GiaMoi)\n    VALUES (OLD.MaSP, OLD.DonGia, NEW.DonGia);\nEND;\n\nUPDATE SanPham SET DonGia = 1950 WHERE MaSP = 101;\nUPDATE SanPham SET DonGia = 2350 WHERE MaSP = 102;\nSELECT Id, MaSP, GiaCu, GiaMoi FROM LichSuGiaSanPham ORDER BY Id;",
      "result": {
        "cols": [
          "Id",
          "MaSP",
          "GiaCu",
          "GiaMoi"
        ],
        "rows": [
          [
            1,
            101,
            1800,
            1950
          ],
          [
            2,
            102,
            2200,
            2350
          ]
        ]
      },
      "note": "Trong SQLite/PostgreSQL/MySQL, Trigger truy cập dòng cũ/mới qua OLD và NEW. Trong SQL Server, Trigger hoạt động theo tập hợp (Set-based) qua hai bảng ảo deleted và inserted!"
    },
    {
      "title": "Ví dụ 10.3: Stored Procedure chuẩn mực trong T-SQL có TRY...CATCH, XACT_STATE() và SET NOCOUNT ON",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "CREATE OR ALTER PROCEDURE dbo.usp_CapNhatGiaTheoDanhMuc\n    @DanhMuc NVARCHAR(40),\n    @PhanTramTang DECIMAL(5, 2),\n    @SoSPDaSua INT OUTPUT\nAS\nBEGIN\n    SET NOCOUNT ON;   -- Tắt thông báo '(n rows affected)' để giảm băng thông mạng và tránh lỗi ADO.NET\n    SET XACT_ABORT ON;\n    BEGIN TRY\n        BEGIN TRANSACTION;\n            UPDATE dbo.SanPham\n            SET DonGia = CAST(DonGia * (1.0 + @PhanTramTang / 100.0) AS INT)\n            WHERE DanhMuc = @DanhMuc;\n\n            SET @SoSPDaSua = @@ROWCOUNT;\n        COMMIT TRANSACTION;\n    END TRY\n    BEGIN CATCH\n        IF XACT_STATE() <> 0\n            ROLLBACK TRANSACTION;\n        THROW; -- Ném lại nguyên vẹn mã lỗi và số dòng lỗi về cho ứng dụng Java/C#\n    END CATCH\nEND;",
      "result": {
        "cols": [
          "@DanhMuc",
          "@PhanTramTang",
          "@SoSPDaSua (OUTPUT)",
          "TrangThaiGiaoDich"
        ],
        "rows": [
          [
            "Phu Kien",
            10.0,
            4,
            "COMMIT thành công (4 dòng được cập nhật)"
          ]
        ]
      },
      "note": "Mẫu khung Stored Procedure trên là chuẩn công nghiệp cho SQL Server: luôn có SET NOCOUNT ON, SET XACT_ABORT ON, kiểm tra XACT_STATE() trong CATCH và dùng lệnh THROW (thay cho RAISERROR cũ). (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    },
    {
      "title": "Ví dụ 10.4: Trigger theo tập hợp (Set-based Trigger) dùng bảng ảo inserted và deleted trong T-SQL",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "CREATE OR ALTER TRIGGER dbo.trg_SanPham_AuditGia\nON dbo.SanPham\nAFTER UPDATE\nAS\nBEGIN\n    SET NOCOUNT ON;\n    IF NOT UPDATE(DonGia) RETURN; -- Thoát ngay nếu câu UPDATE không đụng tới cột DonGia\n\n    -- BẮT BUỘC viết kiểu JOIN tập hợp giữa inserted và deleted (tuyệt đối không gán @MaSP = MaSP FROM inserted!):\n    INSERT INTO dbo.LichSuGiaSanPham (MaSP, GiaCu, GiaMoi)\n    SELECT i.MaSP, d.DonGia, i.DonGia\n    FROM inserted AS i\n    INNER JOIN deleted AS d ON i.MaSP = d.MaSP\n    WHERE i.DonGia <> d.DonGia;\nEND;",
      "result": {
        "cols": [
          "MaSP",
          "GiaCu (từ bảng deleted)",
          "GiaMoi (từ bảng inserted)"
        ],
        "rows": [
          [
            101,
            1800,
            1950
          ],
          [
            102,
            2200,
            2350
          ]
        ]
      },
      "note": "LỖI SỐ 1 CỦA LẬP TRÌNH VIÊN KHI VIẾT TRIGGER T-SQL: Giả định bảng inserted chỉ có 1 dòng và viết SELECT @id = MaSP FROM inserted! Khi người dùng chạy UPDATE sửa 100 dòng cùng lúc, Trigger chỉ chạy ĐÚNG 1 LẦN với bảng inserted chứa 100 dòng! (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    },
    {
      "title": "Ví dụ 10.5: So sánh Bảng tạm (#TempTable) và Biến bảng (@TableVariable) trong T-SQL",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "-- 1. Bảng tạm cục bộ (#TempTable): có thống kê (Statistics), tạo được Index, dùng cho tập dữ liệu lớn (>1000 dòng)\nCREATE TABLE #DonHangLon (MaDH INT PRIMARY KEY, MaKH INT, TongTien INT);\n\n-- 2. Biến bảng (@TableVariable): gọn nhẹ cho tập rất nhỏ (<100 dòng), không bị Rollback khi Transaction hủy!\nDECLARE @DanhSachMaSP TABLE (MaSP INT PRIMARY KEY);",
      "result": {
        "cols": [
          "Đặc điểm",
          "#TempTable (Bảng tạm)",
          "@TableVariable (Biến bảng)"
        ],
        "rows": [
          [
            "Lưu trữ ở đâu?",
            "Trong tempdb (cả RAM cache và đĩa)",
            "Trong tempdb (nhiều người lầm tưởng chỉ nằm trên RAM!)"
          ],
          [
            "Thống kê (Statistics)",
            "CÓ đầy đủ Histogram -> Ước lượng số dòng chuẩn",
            "KHÔNG có Histogram (mặc định đoán 1 dòng hoặc dùng Deferred Compilation từ SQL 2019)"
          ],
          [
            "Trong Transaction",
            "Bị ROLLBACK bình thường khi giao dịch hủy",
            "KHÔNG bị ROLLBACK! (Rất tiện để ghi log lỗi bên trong khối CATCH)"
          ]
        ]
      },
      "note": "Câu hỏi phỏng vấn kinh điển: 'Biến bảng @TableVariable chỉ nằm trong RAM còn #TempTable nằm trên ổ cứng đúng hay sai?'. Đáp án: SAI! Cả hai đều được cấp phát trong tempdb. (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    }
  ],
  "dialects": [
    [
      "Bảng ảo trong Trigger",
      "inserted và deleted (Set-based: chạy 1 lần cho cả lệnh)",
      "NEW và OLD (Row-based: FOR EACH ROW)",
      "NEW và OLD (Hỗ trợ cả FOR EACH ROW và FOR EACH STATEMENT)"
    ],
    [
      "Tạo bảng tạm cục bộ",
      "CREATE TABLE #Temp (...) hoặc SELECT ... INTO #Temp",
      "CREATE TEMPORARY TABLE Temp (...)",
      "CREATE TEMP TABLE temp (...)"
    ],
    [
      "View lưu sẵn dữ liệu vật lý",
      "Indexed View (CREATE VIEW ... WITH SCHEMABINDING + Unique Clustered Index)",
      "Không hỗ trợ trực tiếp (dùng bảng tổng hợp)",
      "CREATE MATERIALIZED VIEW ... (cập nhật bằng REFRESH MATERIALIZED VIEW)"
    ]
  ],
  "bridge_java": "// [Java - Spring Data JPA / JdbcTemplate] Gọi Stored Procedure có tham số OUTPUT bằng SimpleJdbcCall\nSimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource)\n    .withSchemaName(\"dbo\")\n    .withProcedureName(\"usp_CapNhatGiaTheoDanhMuc\");\n\nSqlParameterSource inParams = new MapSqlParameterSource()\n    .addValue(\"DanhMuc\", \"Phu Kien\")\n    .addValue(\"PhanTramTang\", new BigDecimal(\"10.00\"));\n\nMap<String, Object> out = jdbcCall.execute(inParams);\nInteger soSpDaSua = (Integer) out.get(\"SoSPDaSua\");",
  "bridge_csharp": "// [C# - Dapper] Gọi Stored Procedure và truyền danh sách dữ liệu bằng Table-Valued Parameter (TVP)\n// Khi cần truyền 5.000 mã sản phẩm vào Stored Procedure, đừng nối chuỗi CSV mà hãy dùng DataTable + AsTableValuedParameter:\n\nvar parameters = new DynamicParameters();\nparameters.Add(\"@DanhMuc\", \"Phu Kien\", DbType.String, size: 40);\nparameters.Add(\"@PhanTramTang\", 10.0m, DbType.Decimal);\nparameters.Add(\"@SoSPDaSua\", dbType: DbType.Int32, direction: ParameterDirection.Output);\n\nawait connection.ExecuteAsync(\n    \"dbo.usp_CapNhatGiaTheoDanhMuc\",\n    parameters,\n    commandType: CommandType.StoredProcedure);\n\nint soSpDaSua = parameters.Get<int>(\"@SoSPDaSua\");",
  "performance": "<ul>\n  <li><strong>Luôn bật <code>SET NOCOUNT ON</code> ở đầu mọi Stored Procedure và Trigger trong SQL Server:</strong> Mặc định sau mỗi câu lệnh <code>SELECT/INSERT/UPDATE/DELETE</code> bên trong SP, SQL Server gửi một gói tin mạng nhỏ (<code>DONE_IN_PROC</code> token) về cho ứng dụng để báo số dòng bị ảnh hưởng. Nếu SP có vòng lặp hoặc nhiều câu lệnh, việc tắt thông báo này bằng <code>SET NOCOUNT ON</code> giúp giảm đáng kể lưu lượng mạng và tránh làm nhầm lẫn một số thư viện ORM cũ.</li>\n  <li><strong>Tại sao các hệ thống hiện đại hạn chế nhét logic nghiệp vụ phức tạp vào Trigger?</strong> Trigger chạy ngầm (Implicit execution): lập trình viên nhìn vào code Java/C# chỉ thấy một lệnh <code>repository.save(order)</code> đơn giản, không hề biết dưới DB có 3 tầng Trigger lồng nhau đang âm thầm gọi sang 5 bảng khác! Khi xảy ra Deadlock hoặc sai số liệu, việc gỡ lỗi (Debug) và viết Unit Test cho Trigger cực kỳ vất vả. Chỉ nên dùng Trigger cho mục đích <em>Audit Log</em> hoặc kiểm tra toàn vẹn dữ liệu cấp thấp.</li>\n</ul>",
  "common_errors": [
    "Viết Trigger trong SQL Server nhưng giả định bảng inserted/deleted chỉ chứa 1 dòng (ví dụ viết DECLARE @Id INT; SELECT @Id = Id FROM inserted): Khi câu lệnh UPDATE/INSERT tác động lên 50 dòng cùng lúc, biến @Id chỉ nhận giá trị của 1 dòng cuối cùng, còn 49 dòng kia bị bỏ qua hoàn toàn!",
    "Đặt tên cho Stored Procedure mới tạo bắt đầu bằng tiền tố 'sp_' (ví dụ sp_LayDonHang): Trong SQL Server, tiền tố 'sp_' được dành riêng cho các thủ tục hệ thống nằm trong CSDL master! Mỗi khi gọi sp_..., SQL Server luôn phải tra cứu trong master trước rồi mới tìm ở DB hiện tại và dễ đụng độ tên hệ thống. Hãy dùng tiền tố 'usp_' (User Stored Procedure).",
    "Gọi một Scalar Function có truy vấn bảng ở ngay trong mệnh đề SELECT hoặc WHERE trên bảng lớn, gây ra hàng trăm nghìn câu truy vấn ngầm và làm mất khả năng chạy đa luồng (Parallel Execution).",
    "Dùng SELECT * bên trong định nghĩa của một View: Khi bảng gốc được ALTER TABLE thêm hoặc bớt cột, metadata của View không tự động cập nhật theo (nếu không chạy sp_refreshview), dẫn tới trả về dữ liệu lệch cột!",
    "Tưởng rằng @TableVariable không bao giờ chạm tới tempdb và dùng nó để chứa 500.000 dòng dữ liệu trung gian, khiến trình tối ưu ước lượng sai số dòng (luôn tưởng chỉ có 1 dòng) và chọn thuật toán Nested Loops làm treo cứng câu truy vấn."
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "Hãy nêu ít nhất 4 điểm khác nhau giữa Stored Procedure và Function (UDF) trong SQL.",
      "a_short": "Function bắt buộc trả về giá trị, gọi được trong SELECT/WHERE nhưng không được phép INSERT/UPDATE/DELETE bảng vật lý và không dùng được TRY...CATCH hay Transaction. Stored Procedure làm được tất cả các việc sửa dữ liệu, quản lý Transaction nhưng không nhúng trực tiếp vào câu SELECT được.",
      "a_long": "(1) Mục đích: Function dùng để tính toán và trả về giá trị/bảng phục vụ câu truy vấn; Stored Procedure dùng để thực thi một quy trình nghiệp vụ. (2) Khả năng dùng trong câu lệnh: Function gọi được ngay trong SELECT, WHERE, JOIN; SP phải gọi bằng EXEC. (3) Tác dụng phụ (Side-effects): Function bị cấm thay đổi dữ liệu bảng vật lý, cấm gọi hàm không xác định như RAND()/NEWID() trong một số ngữ cảnh; SP có toàn quyền DML/DDL. (4) Xử lý lỗi và giao dịch: SP dùng được BEGIN TRAN/COMMIT/ROLLBACK và TRY...CATCH; Function thì không."
    },
    {
      "level": "Junior",
      "q": "Tại sao một Trigger trong SQL Server viết theo kiểu lấy biến vô hướng (SELECT @id = Id FROM inserted) lại là một lỗi nghiêm trọng?",
      "a_short": "Vì trong SQL Server, Trigger kích hoạt 1 lần cho toàn bộ câu lệnh DML (Statement-level) chứ không phải chạy từng dòng (Row-level). Nếu câu lệnh INSERT/UPDATE tác động lên nhiều dòng cùng lúc, bảng inserted chứa nhiều dòng và biến @id chỉ giữ được 1 dòng ngẫu nhiên.",
      "a_long": "Khác với PostgreSQL hay MySQL có chế độ FOR EACH ROW, mọi Trigger trong SQL Server đều hoạt động ở mức câu lệnh. Nếu một lệnh UPDATE sửa 1.000 bản ghi, Trigger chỉ được gọi duy nhất 1 lần với bảng ảo inserted và deleted chứa đủ 1.000 dòng đó. Việc gán vào biến đơn @id sẽ làm rớt mất 999 dòng còn lại. Cách viết đúng bắt buộc là viết câu lệnh INSERT/UPDATE dựa trên tập hợp (Set-based) có JOIN trực tiếp với bảng inserted và deleted."
    },
    {
      "level": "Mid",
      "q": "Khi nào bạn nên dùng CTE, khi nào dùng Biến bảng (@TableVariable) và khi nào dùng Bảng tạm (#TempTable) trong SQL Server?",
      "a_short": "Dùng CTE khi chỉ cần làm gọn code hoặc đệ quy trong 1 câu lệnh đơn. Dùng @TableVariable khi dữ liệu rất ít (<100 dòng) hoặc cần giữ lại dữ liệu (như log lỗi) sau khi ROLLBACK. Dùng #TempTable khi dữ liệu trung gian lớn (>1.000 dòng), cần dùng lại ở nhiều câu lệnh và cần Statistics/Index để tối ưu JOIN.",
      "a_long": "Ba công cụ này phục vụ 3 bài toán khác nhau: (1) CTE không lưu trữ kết quả ra đĩa mà chỉ là cú pháp giúp câu lệnh dễ đọc; nếu gọi CTE 3 lần thì câu query bên trong bị chạy lại 3 lần. (2) @TableVariable sống trong tempdb nhưng không gắn với Transaction (khi ROLLBACK thì dữ liệu trong @TableVariable vẫn còn nguyên, rất hợp để lưu thông tin lỗi trước khi Rollback) và không gây biên dịch lại SP, nhưng vì thiếu Histogram Statistics nên rất tệ với dữ liệu lớn. (3) #TempTable là một bảng thực thụ trong tempdb: có đầy đủ Statistics để Query Optimizer chọn thuật toán Hash/Merge Join chuẩn xác và đánh được mọi loại Index, là lựa chọn số 1 khi xử lý tập dữ liệu lớn qua nhiều bước."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 10.1: Tạo View tổng hợp thông tin nhân viên kèm tên phòng ban và số xe đang phụ trách",
      "problem": "Trên CSDL Auto Shop, hãy tạo một View có tên vw_ThongKeNhanVien hiển thị Id, FName || ' ' || LName AS HoTen, Salary, TenPhong (Name của bảng Departments) và SoXePhuTrach (số lượng xe trong bảng Cars mà nhân viên đó phụ trách, kể cả nhân viên có 0 xe). Sau đó viết câu lệnh SELECT * FROM vw_ThongKeNhanVien ORDER BY SoXePhuTrach DESC, Id ASC.",
      "intuition": "Trong CREATE VIEW, nối Employees với Departments (INNER JOIN) và LEFT JOIN với Cars, sau đó GROUP BY e.Id, e.FName, e.LName, e.Salary, d.Name.",
      "trace": "Nhân viên 2 (John) và 5 (William) mỗi người phụ trách 2 xe; nhân viên 1 và 3 mỗi người 1 xe; nhân viên 4 và 6 phụ trách 0 xe.",
      "sql": "CREATE VIEW vw_ThongKeNhanVien AS\nSELECT e.Id,\n       e.FName || ' ' || e.LName AS HoTen,\n       e.Salary,\n       d.Name AS TenPhong,\n       COUNT(c.Id) AS SoXePhuTrach\nFROM Employees AS e\nINNER JOIN Departments AS d ON e.DepartmentId = d.Id\nLEFT JOIN Cars AS c ON e.Id = c.EmployeeId\nGROUP BY e.Id, e.FName, e.LName, e.Salary, d.Name;\n\nSELECT * FROM vw_ThongKeNhanVien ORDER BY SoXePhuTrach DESC, Id ASC;",
      "db": "autoshop",
      "expected": {
        "cols": [
          "Id",
          "HoTen",
          "Salary",
          "TenPhong",
          "SoXePhuTrach"
        ],
        "rows": [
          [
            2,
            "John Johnson",
            400,
            "HR",
            2
          ],
          [
            5,
            "William Morris",
            800,
            "Tech",
            2
          ],
          [
            1,
            "James Smith",
            1000,
            "HR",
            1
          ],
          [
            3,
            "Michael Williams",
            600,
            "Sales",
            1
          ],
          [
            4,
            "Johnathon Smith",
            500,
            "HR",
            0
          ],
          [
            6,
            "Sarah Connor",
            750,
            "Tech",
            0
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Sử dụng CREATE VIEW vw_ThongKeNhanVien AS SELECT ... rồi kết thúc bằng câu SELECT từ View đó.",
        "Nhớ dùng LEFT JOIN sang bảng Cars và đếm bằng COUNT(c.Id) để nhân viên chưa nhận xe nào hiện số 0.",
        "CREATE VIEW vw_ThongKeNhanVien AS SELECT e.Id, e.FName || ' ' || e.LName AS HoTen, e.Salary, d.Name AS TenPhong, COUNT(c.Id) AS SoXePhuTrach FROM Employees AS e INNER JOIN Departments AS d ON e.DepartmentId = d.Id LEFT JOIN Cars AS c ON e.Id = c.EmployeeId GROUP BY e.Id, e.FName, e.LName, e.Salary, d.Name; SELECT * FROM vw_ThongKeNhanVien ORDER BY SoXePhuTrach DESC, Id ASC;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 10.2: Thay thế con trỏ (Cursor) bằng câu lệnh Set-based cập nhật hạng thẻ khách hàng",
      "problem": "Trên CSDL ShopOnline, thay vì dùng Cursor lặp qua từng khách hàng để kiểm tra tổng số đơn hàng đã hoàn thành rồi nâng hạng thẻ, hãy viết một câu lệnh UPDATE kiểu tập hợp (Set-based) nâng HangThe thành 'KIM_CUONG' cho tất cả khách hàng có từ 2 đơn hàng 'HOAN_THANH' trở lên trong bảng DonHang. Sau đó SELECT MaKH, HoTen, HangThe FROM KhachHang ORDER BY MaKH ASC.",
      "intuition": "Dùng UPDATE KhachHang SET HangThe = 'KIM_CUONG' WHERE MaKH IN (SELECT MaKH FROM DonHang WHERE TrangThai = 'HOAN_THANH' GROUP BY MaKH HAVING COUNT(*) >= 2).",
      "trace": "Chỉ có khách hàng MaKH = 1 (Nguyen Van An) có 3 đơn HOAN_THANH (1001, 1003, 1007) nên được nâng từ 'VANG' lên 'KIM_CUONG'.",
      "sql": "UPDATE KhachHang\nSET HangThe = 'KIM_CUONG'\nWHERE MaKH IN (\n    SELECT MaKH\n    FROM DonHang\n    WHERE TrangThai = 'HOAN_THANH'\n    GROUP BY MaKH\n    HAVING COUNT(*) >= 2\n);\nSELECT MaKH, HoTen, HangThe FROM KhachHang ORDER BY MaKH ASC;",
      "db": "shoponline",
      "expected": {
        "cols": [
          "MaKH",
          "HoTen",
          "HangThe"
        ],
        "rows": [
          [
            1,
            "Nguyen Van An",
            "KIM_CUONG"
          ],
          [
            2,
            "Tran Thi Binh",
            "BAC"
          ],
          [
            3,
            "Le Hoang Cuong",
            "DONG"
          ],
          [
            4,
            "Pham Minh Dung",
            "VANG"
          ],
          [
            5,
            "Vo Thi Em",
            "DONG"
          ],
          [
            6,
            "Hoang Gia Huy",
            "BAC"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Tìm danh sách MaKH có COUNT(*) >= 2 đơn HOAN_THANH bằng một subquery có GROUP BY ... HAVING.",
        "UPDATE KhachHang SET HangThe = 'KIM_CUONG' WHERE MaKH IN (...); SELECT MaKH, HoTen, HangThe FROM KhachHang ORDER BY MaKH ASC;",
        "UPDATE KhachHang SET HangThe = 'KIM_CUONG' WHERE MaKH IN (SELECT MaKH FROM DonHang WHERE TrangThai = 'HOAN_THANH' GROUP BY MaKH HAVING COUNT(*) >= 2); SELECT MaKH, HoTen, HangThe FROM KhachHang ORDER BY MaKH ASC;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch10_p1",
      "title": "Tự động đồng bộ số lượng tồn kho khi thêm chi tiết đơn hàng bằng Trigger",
      "difficulty": "Khá",
      "db": "shoponline",
      "summary": "Trên CSDL ShopOnline, hãy tạo một Trigger có tên trg_TruTonKhoKhiMua kích hoạt AFTER INSERT ON ChiTietDon để tự động trừ cột TonKho của bảng SanPham đi đúng lượng NEW.SoLuong của mặt hàng vừa chèn. Sau đó, hãy chèn thử một dòng mới vào ChiTietDon: (MaDH=1006, MaSP=101, SoLuong=5, DonGiaBan=1800, ChietKhau=0) và chạy SELECT MaSP, TenSP, TonKho FROM SanPham WHERE MaSP = 101 để kiểm tra tồn kho đã giảm từ 25 xuống 20.",
      "understand": "Viết CREATE TRIGGER trg_TruTonKhoKhiMua AFTER INSERT ON ChiTietDon BEGIN UPDATE SanPham SET TonKho = TonKho - NEW.SoLuong WHERE MaSP = NEW.MaSP; END; sau đó chạy INSERT và SELECT.",
      "brute": "Cập nhật tồn kho thủ công ở mọi nơi trong code mà quên mất khi có luồng import đơn hàng khác.",
      "optimal": "Định nghĩa Trigger ngắn gọn, thực thi INSERT và SELECT kiểm증.",
      "trace": "Ban đầu SP 101 có TonKho = 25. Khi chèn dòng mới với SoLuong = 5 vào ChiTietDon, Trigger tự động chạy UPDATE trừ 5, kết quả TonKho của SP 101 còn 20.",
      "sql": "CREATE TRIGGER trg_TruTonKhoKhiMua\nAFTER INSERT ON ChiTietDon\nBEGIN\n    UPDATE SanPham\n    SET TonKho = TonKho - NEW.SoLuong\n    WHERE MaSP = NEW.MaSP;\nEND;\n\nINSERT INTO ChiTietDon (MaDH, MaSP, SoLuong, DonGiaBan, ChietKhau)\nVALUES (1006, 101, 5, 1800, 0);\n\nSELECT MaSP, TenSP, TonKho FROM SanPham WHERE MaSP = 101;",
      "expected": {
        "cols": [
          "MaSP",
          "TenSP",
          "TonKho"
        ],
        "rows": [
          [
            101,
            "Ban Phim Co Keychron K2",
            20
          ]
        ]
      },
      "order_matters": false,
      "pitfalls": "Quên điều kiện WHERE MaSP = NEW.MaSP bên trong lệnh UPDATE của Trigger, làm toàn bộ các sản phẩm trong cửa hàng đều bị trừ tồn kho!",
      "note3": {
        "idea": "Trigger chạy trong cùng Transaction với câu lệnh DML đã kích hoạt nó; nếu Trigger gặp lỗi hoặc Rollback thì câu lệnh gốc cũng bị Rollback.",
        "syntax": "CREATE TRIGGER name AFTER INSERT ON ChildTable BEGIN UPDATE Parent SET ... WHERE Id = NEW.ParentId; END;",
        "trap": "Trong SQL Server, Trigger kích hoạt 1 lần cho cả câu lệnh (Set-based) chứ không phải 1 lần cho từng dòng (FOR EACH ROW), nên phải JOIN với bảng inserted/deleted và GROUP BY trước khi cộng trừ!"
      }
    }
  ],
  "summary_table": [
    [
      "View (Khung nhìn)",
      "Đóng gói câu SELECT phức tạp để tái sử dụng và phân quyền",
      "Tránh dùng SELECT * bên trong View"
    ],
    [
      "Stored Procedure",
      "Thủ tục thực thi nghiệp vụ, hỗ trợ DML, Transaction, TRY/CATCH",
      "Đặt tên usp_..., luôn bật SET NOCOUNT ON và SET XACT_ABORT ON"
    ],
    [
      "Inline TVF vs Scalar UDF",
      "Inline TVF bung thẳng vào Plan như View; Scalar UDF chạy từng dòng",
      "Ưu tiên Inline TVF hoặc CROSS APPLY thay cho Scalar UDF"
    ],
    [
      "Trigger (inserted/deleted)",
      "Tự động kích hoạt khi có INSERT/UPDATE/DELETE trên bảng",
      "Bắt buộc viết kiểu Set-based xử lý trường hợp nhiều dòng"
    ],
    [
      "#TempTable vs @TableVar",
      "Bảng tạm có Statistics đầy đủ vs Biến bảng không bị Rollback",
      "Dùng #TempTable khi tập trung gian > 1.000 dòng"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Tại sao bạn không nên đặt tên cho Stored Procedure do mình viết là sp_TinhLuongThang trong SQL Server?",
      "a": "Vì tiền tố sp_ được SQL Server dành riêng cho các thủ tục hệ thống trong CSDL master, khiến máy chủ luôn phải tra cứu trong master trước (tốn thêm chi phí và dễ xung đột tên). Hãy đặt là usp_TinhLuongThang."
    },
    {
      "q": "Câu 2: Giả sử bạn mở BEGIN TRAN, chèn 1 dòng vào bảng tạm #Temp và 1 dòng vào biến bảng @Var, sau đó gọi lệnh ROLLBACK TRAN. Hỏi bảng nào vẫn còn giữ nguyên dòng vừa chèn?",
      "a": "Biến bảng @Var vẫn giữ nguyên dòng vừa chèn vì biến bảng không chịu sự chi phối của Transaction Rollback, còn bảng tạm #Temp sẽ bị xóa dòng đó về trạng thái cũ."
    },
    {
      "q": "Câu 3: Trong một AFTER DELETE Trigger của SQL Server, nếu bạn truy vấn bảng ảo inserted thì sẽ nhận được bao nhiêu dòng?",
      "a": "Nhận được 0 dòng (bảng trống rỗng), vì thao tác DELETE chỉ đẩy các dòng bị xóa vào bảng ảo deleted."
    }
  ]
});
