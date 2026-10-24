/**
 * FILE: src/data/chapters/ch13-tsql-advanced-json-pivot-temporal.js
 * MÔ TẢ: Chương 13 - SQL Server Nâng Cao: JSON, PIVOT/UNPIVOT, Computed Column, Temporal Table, Partitioning & Columnstore
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch13",
  "code": "Chương 13",
  "title": "SQL Server Nâng Cao: JSON, PIVOT/UNPIVOT, Computed Column, Temporal Table, Partitioning & Columnstore",
  "sources": [
    "M ch.26-31, 35, 47, 48, 49, 69, 81"
  ],
  "goals": [
    "Sử dụng thành thạo bộ công cụ JSON trong SQL Server (ISJSON, JSON_VALUE, JSON_QUERY, JSON_MODIFY, OPENJSON, FOR JSON) và biết cách đánh Index cho thuộc tính JSON.",
    "Xoay bảng linh hoạt từ dòng sang cột (PIVOT) và từ cột sang dòng (UNPIVOT) bằng cả cú pháp T-SQL lẫn cú pháp CASE chuẩn ANSI.",
    "Ứng dụng Computed Column (PERSISTED) và System-Versioned Temporal Table vào các bài toán tối ưu hiệu năng và kiểm toán dữ liệu lịch sử.",
    "Hiểu rõ khái niệm kiến trúc của Table Partitioning (Phân vùng bảng lớn) và Columnstore Index (Chỉ mục dạng cột cho phân tích OLAP/Data Warehouse)."
  ],
  "signals": [
    "Cần truyền một danh sách 1.000 chi tiết đơn hàng dưới dạng chuỗi JSON từ C#/Java xuống Stored Procedure để xử lý trong 1 lượt gọi.",
    "Cần xuất báo cáo ma trận doanh thu 12 tháng thành 12 cột ngang (Thang1, Thang2, ..., Thang12) cho từng chi nhánh.",
    "Bảng giao dịch lịch sử đạt 500 triệu dòng, việc xóa dữ liệu cũ quá 3 năm bằng DELETE làm treo hệ thống hàng giờ đồng hồ."
  ],
  "theory": "<h3>13.1. Làm việc với JSON trong SQL Server (và xu hướng Hybrid Relational + JSON)</h3>\n<p>Từ SQL Server 2016+ (và mới nhất trong SQL Server 2025 đã bổ sung kiểu dữ liệu <code>JSON</code> nhị phân chuyên biệt bên cạnh <code>NVARCHAR(MAX)</code> truyền thống), bạn không cần phải cài thêm một hệ NoSQL (như MongoDB) chỉ để lưu vài thuộc tính cấu hình động của sản phẩm. Hãy nắm vững 5 công cụ JSON cốt lõi của T-SQL:</p>\n<ul>\n  <li><code>ISJSON(chuoi)</code>: Kiểm tra chuỗi có đúng chuẩn JSON không (dùng trong ràng buộc <code>CHECK (ISJSON(ThuocTinhMoRong) = 1)</code>).</li>\n  <li><code>JSON_VALUE(chuoi, '$.duong_dan')</code>: Trích xuất một <strong>giá trị vô hướng</strong> (chuỗi, số, boolean) từ JSON. Nếu muốn đánh Index cho một trường bên trong JSON, bạn tạo một <strong>Computed Column</strong> gọi <code>JSON_VALUE(...)</code> rồi đánh Index B-Tree lên cột đó!</li>\n  <li><code>JSON_QUERY(chuoi, '$.mang_hoac_object')</code>: Trích xuất một <strong>đối tượng con hoặc mảng JSON</strong>.</li>\n  <li><code>OPENJSON(chuoi) WITH (...)</code>: Biến chuỗi JSON thành một <strong>bảng quan hệ có cột và kiểu dữ liệu đàng hoàng</strong>. Đây là một trong những cách nhanh nhất để truyền một mảng dữ liệu lớn từ ứng dụng Java/C# vào Stored Procedure mà không cần tạo User-Defined Table Type!</li>\n  <li><code>FOR JSON PATH / AUTO</code>: Đặt ở cuối câu lệnh <code>SELECT</code> để biến bảng kết quả thành chuỗi JSON trả thẳng về API.</li>\n</ul>\n\n<h3>13.2. PIVOT &amp; UNPIVOT, Computed Column và Temporal Table</h3>\n<ul>\n  <li><strong>PIVOT (Xoay dòng thành cột) vs UNPIVOT (Xoay cột thành dòng):</strong> Toán tử <code>PIVOT</code> của T-SQL (hoặc kỹ thuật <code>SUM(CASE WHEN ...)</code> chuẩn ANSI) giúp biến các giá trị rời rạc trong một cột (như Quý 1, Quý 2, Quý 3, Quý 4) thành các cột tiêu đề ngang. Ngược lại, <code>UNPIVOT</code> (hoặc dùng <code>CROSS APPLY (VALUES ...)</code>) giúp làm phẳng một bảng có nhiều cột lặp (như <code>DoanhThuT1, DoanhThuT2...</code>) về dạng chuẩn 1NF để dễ thống kê.</li>\n  <li><strong>Computed Column (Cột tính toán):</strong> Được định nghĩa bằng công thức <code>TenCot AS (BieuThuc)</code>. Nếu không có từ khóa <code>PERSISTED</code>, nó là cột ảo được tính lại mỗi khi <code>SELECT</code>. Nếu thêm <strong><code>PERSISTED</code></strong>, giá trị được tính và lưu vật lý trên đĩa mỗi khi <code>INSERT/UPDATE</code>, cho phép đánh Index và giải cứu các biểu thức <em>Non-Sargable</em>!</li>\n  <li><strong>System-Versioned Temporal Table (Bảng lịch sử thời gian tự động):</strong> Khi bật <code>SYSTEM_VERSIONING = ON</code>, SQL Server tự động quản lý một cặp bảng: bảng hiện tại và bảng History. Mọi thao tác <code>UPDATE</code> hay <code>DELETE</code> trên bảng chính đều tự động đẩy bản ghi cũ kèm dấu thời gian <code>ValidFrom - ValidTo</code> sang bảng History. Bạn có thể truy vấn dữ liệu tại bất kỳ thời điểm nào trong quá khứ bằng mệnh đề <code>FOR SYSTEM_TIME AS OF '...'</code>.</li>\n</ul>\n\n<h3>13.3. Kiến trúc dữ liệu lớn (Mức khái niệm): Table Partitioning &amp; Columnstore Index</h3>\n<p>Khi bảng dữ liệu của bạn vượt ngưỡng <strong>hàng trăm triệu dòng (vài trăm GB đến nhiều TB)</strong>, hai công nghệ kiến trúc sau đây sẽ được hỏi tới ở vòng phỏng vấn Mid/Senior:</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Công nghệ</th>\n      <th>Table Partitioning (Phân vùng bảng theo chiều ngang)</th>\n      <th>Columnstore Index (Lưu trữ và nén theo Cột)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>Bản chất hoạt động</strong></td>\n      <td>Chia một bảng lớn thành nhiều phân vùng vật lý nhỏ (ví dụ mỗi tháng 1 Partition) dựa trên <code>Partition Function</code> và <code>Partition Scheme</code>, nhưng code ứng dụng vẫn nhìn thấy như 1 bảng duy nhất.</td>\n      <td>Thay vì lưu từng dòng liền nhau (Rowstore - trang 8KB chứa đủ mọi cột của dòng 1, dòng 2...), Columnstore cắt bảng thành các <em>Rowgroup</em> (1 triệu dòng) và <strong>lưu dữ liệu của từng cột riêng biệt</strong> thành các <em>Column Segment</em> nén cực mạnh.</td>\n    </tr>\n    <tr>\n      <td><strong>Đột phá hiệu năng</strong></td>\n      <td><strong>1. Partition Elimination:</strong> Truy vấn lọc <code>WHERE NgayDat = '2025-03-10'</code> chỉ đọc đúng phân vùng tháng 3, bỏ qua toàn bộ các tháng khác.<br><strong>2. Partition Switching (<code>SWITCH PARTITION</code>):</strong> Xóa hoặc chuyển 50 triệu dòng của tháng cũ sang bảng lưu trữ chỉ mất <strong>1 mili-giây</strong> (chỉ đổi con trỏ metadata thay vì chạy DELETE)!</td>\n      <td><strong>1. Nén dữ liệu gấp 10 lần</strong> (nhờ các giá trị trong cùng 1 cột có kiểu giống nhau và lặp lại nhiều).<br><strong>2. Chỉ đọc đúng cột cần tính:</strong> Câu lệnh <code>SELECT Region, SUM(Amount) FROM Sales</code> trên bảng 50 cột chỉ đọc đúng 2 cột <code>Region</code> và <code>Amount</code> từ đĩa!<br><strong>3. Batch Mode Execution:</strong> Xử lý từng bó 900 giá trị trên thanh ghi SIMD của CPU, tăng tốc truy vấn phân tích (OLAP) gấp 10 đến 100 lần!</td>\n    </tr>\n  </tbody>\n</table>",
  "mechanism": "<h3>Chạy tay từng bước: Tại sao Columnstore Index lại nhanh gấp chục lần Rowstore khi chạy báo cáo tổng hợp?</h3>\n<p>Giả sử bảng <code>LichSuGiaoDich</code> có <strong>20 cột</strong> (mỗi dòng rộng 500 bytes) và có <strong>100 triệu dòng</strong> (tổng dung lượng Rowstore khoảng <strong>50 GB</strong>). Sếp yêu cầu tính tổng doanh thu theo từng tỉnh thành: <code>SELECT MaTinh, SUM(SoTien) FROM LichSuGiaoDich GROUP BY MaTinh;</code></p>\n<div class=\"trace-steps\">\n  <div class=\"trace-step\"><strong>Trên bảng Rowstore truyền thống (Clustered B-Tree Index):</strong> Vì mỗi trang 8KB lưu trọn vẹn cả 20 cột của từng dòng nối tiếp nhau, để lấy được 2 cột <code>MaTinh</code> (4 bytes) và <code>SoTien</code> (8 bytes), máy chủ vẫn buộc phải đọc toàn bộ <strong>50 GB dữ liệu</strong> từ ổ cứng lên RAM rồi vứt bỏ 18 cột không dùng tới!</div>\n  <div class=\"trace-step\"><strong>Trên bảng có Clustered Columnstore Index (CCI):</strong>\n    <ul>\n      <li>Dữ liệu của 20 cột đã được tách thành 20 ống (Column Segments) độc lập. Máy chủ <strong>chỉ đọc đúng 2 ống <code>MaTinh</code> và <code>SoTien</code></strong>, bỏ qua hoàn toàn 18 ống còn lại trên ổ đĩa (tiết kiệm ngay 90% I/O!).</li>\n      <li>Hơn nữa, vì cột <code>MaTinh</code> chỉ có 63 giá trị lặp đi lặp lại trong 100 triệu dòng, thuật toán nén <em>Run-Length Encoding (RLE) &amp; Dictionary Encoding</em> nén 2 cột này xuống chỉ còn khoảng <strong>300 MB</strong>!</li>\n      <li>Thời gian chạy giảm từ <strong>45 giây (đọc 50 GB)</strong> xuống chỉ còn <strong>0.4 giây (đọc 300 MB trong RAM với Batch Mode)</strong>!</li>\n    </ul>\n  </div>\n</div>",
  "examples": [
    {
      "title": "Ví dụ 13.1: Xoay bảng từ Dòng sang Cột (PIVOT) chuẩn ANSI SQL bằng CASE + Hàm tổng hợp",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "SELECT kh.ThanhPho,\n       SUM(CASE WHEN dh.TrangThai = 'HOAN_THANH' THEN 1 ELSE 0 END) AS HoanThanh,\n       SUM(CASE WHEN dh.TrangThai = 'DANG_GIAO'  THEN 1 ELSE 0 END) AS DangGiao,\n       SUM(CASE WHEN dh.TrangThai = 'DA_HUY'     THEN 1 ELSE 0 END) AS DaHuy,\n       COUNT(dh.MaDH) AS TongCong\nFROM KhachHang AS kh\nLEFT JOIN DonHang AS dh ON kh.MaKH = dh.MaKH\nGROUP BY kh.ThanhPho\nORDER BY TongCong DESC, kh.ThanhPho ASC;",
      "result": {
        "cols": [
          "ThanhPho",
          "HoanThanh",
          "DangGiao",
          "DaHuy",
          "TongCong"
        ],
        "rows": [
          [
            "Ha Noi",
            4,
            0,
            0,
            4
          ],
          [
            "TP Ho Chi Minh",
            1,
            1,
            0,
            2
          ],
          [
            "Da Nang",
            0,
            0,
            1,
            1
          ],
          [
            "Can Tho",
            0,
            0,
            0,
            0
          ]
        ]
      },
      "note": "Cách xoay bảng dùng SUM(CASE WHEN ... END) là chuẩn ANSI SQL: chạy được trên cả SQL Server, PostgreSQL, MySQL, Oracle và SQLite, đồng thời cho phép tính thêm cột TongCong ngay trong cùng 1 lần quét!"
    },
    {
      "title": "Ví dụ 13.2: Toán tử PIVOT đặc trưng trong T-SQL xoay trạng thái đơn hàng thành các cột",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "SELECT ThanhPho,\n       ISNULL([HOAN_THANH], 0) AS HoanThanh,\n       ISNULL([DANG_GIAO], 0)  AS DangGiao,\n       ISNULL([DA_HUY], 0)     AS DaHuy\nFROM (\n    SELECT kh.ThanhPho, dh.TrangThai, dh.MaDH\n    FROM dbo.KhachHang AS kh\n    LEFT JOIN dbo.DonHang AS dh ON kh.MaKH = dh.MaKH\n) AS BangNguon\nPIVOT (\n    COUNT(MaDH)\n    FOR TrangThai IN ([HOAN_THANH], [DANG_GIAO], [DA_HUY])\n) AS BangXoay\nORDER BY ThanhPho ASC;",
      "result": {
        "cols": [
          "ThanhPho",
          "HoanThanh",
          "DangGiao",
          "DaHuy"
        ],
        "rows": [
          [
            "Can Tho",
            0,
            0,
            0
          ],
          [
            "Da Nang",
            0,
            0,
            1
          ],
          [
            "Ha Noi",
            4,
            0,
            0
          ],
          [
            "TP Ho Chi Minh",
            1,
            1,
            0
          ]
        ]
      },
      "note": "Khi dùng toán tử PIVOT trong T-SQL, hãy luôn tạo một truy vấn con (Derived Table/CTE) chỉ lấy đúng 3 loại cột: Cột nhóm (ThanhPho), Cột xoay (TrangThai) và Cột giá trị (MaDH). Nếu để lọt thêm cột thừa vào BangNguon, PIVOT sẽ tự động GROUP BY theo cả cột thừa đó làm vỡ bảng xoay! (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    },
    {
      "title": "Ví dụ 13.3: Xử lý JSON trong SQL Server: Đọc bằng OPENJSON, JSON_VALUE và xuất bằng FOR JSON PATH",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "-- 1. Phân tách mảng JSON gửi từ API thành bảng quan hệ bằng OPENJSON ... WITH (rất nhanh để Bulk Insert):\nDECLARE @json NVARCHAR(MAX) = N'[\n  {\"MaSP\": 101, \"SoLuong\": 2},\n  {\"MaSP\": 104, \"SoLuong\": 1}\n]';\n\nSELECT j.MaSP, sp.TenSP, j.SoLuong, sp.DonGia * j.SoLuong AS ThanhTien\nFROM OPENJSON(@json) WITH (\n    MaSP INT '$.MaSP',\n    SoLuong INT '$.SoLuong'\n) AS j\nINNER JOIN dbo.SanPham AS sp ON j.MaSP = sp.MaSP;\n\n-- 2. Xuất kết quả truy vấn thành chuỗi JSON lồng nhau bằng FOR JSON PATH:\n-- SELECT kh.MaKH, kh.HoTen, dh.MaDH, dh.NgayDat FROM KhachHang kh JOIN DonHang dh ON kh.MaKH = dh.MaKH FOR JSON PATH;",
      "result": {
        "cols": [
          "MaSP",
          "TenSP",
          "SoLuong",
          "ThanhTien"
        ],
        "rows": [
          [
            101,
            "Ban Phim Co Keychron K2",
            2,
            3600
          ],
          [
            104,
            "Tai Nghe Sony WH-1000XM5",
            1,
            6900
          ]
        ]
      },
      "note": "Hàm OPENJSON kèm mệnh đề WITH (...) chuyển chuỗi JSON thành bảng có kiểu dữ liệu rõ ràng ngay trong bộ nhớ SQL Server. Trên SQLite/PostgreSQL cũng có json_each() / jsonb_to_recordset() tương đương. (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    },
    {
      "title": "Ví dụ 13.4: Bản [CHUẨN] tương đương dùng Cột tính toán tự động (Generated / Computed Column) và đánh Index trên biểu thức",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "CREATE TABLE ChiTietHoaDon_Moi (\n    MaDH INT NOT NULL,\n    MaSP INT NOT NULL,\n    SoLuong INT NOT NULL,\n    DonGiaBan INT NOT NULL,\n    ChietKhau INT NOT NULL DEFAULT 0,\n    -- Cột tính toán tự động (T-SQL viết: ThanhTien AS (SoLuong * DonGiaBan - ChietKhau) PERSISTED):\n    ThanhTien INT GENERATED ALWAYS AS (SoLuong * DonGiaBan - ChietKhau) STORED,\n    PRIMARY KEY (MaDH, MaSP)\n);\nINSERT INTO ChiTietHoaDon_Moi (MaDH, MaSP, SoLuong, DonGiaBan, ChietKhau)\nVALUES (2001, 101, 2, 1800, 150),\n       (2001, 102, 1, 2200, 0);\nSELECT * FROM ChiTietHoaDon_Moi;",
      "result": {
        "cols": [
          "MaDH",
          "MaSP",
          "SoLuong",
          "DonGiaBan",
          "ChietKhau",
          "ThanhTien"
        ],
        "rows": [
          [
            2001,
            101,
            2,
            1800,
            150,
            3450
          ],
          [
            2001,
            102,
            1,
            2200,
            0,
            2200
          ]
        ]
      },
      "note": "Cột tính toán lưu cứng (PERSISTED trong T-SQL / STORED trong SQLite & PostgreSQL) tự động tính giá trị khi INSERT/UPDATE và cho phép đánh Index trực tiếp lên cột đó để tìm kiếm cực nhanh!"
    },
    {
      "title": "Ví dụ 13.5: Bảng lịch sử thời gian tự động (System-Versioned Temporal Table) trong SQL Server 2016+",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "-- Tạo bảng có khả năng 'du hành thời gian' tự động lưu mọi bản ghi cũ khi UPDATE/DELETE:\nCREATE TABLE dbo.SanPham_Temporal (\n    MaSP INT NOT NULL PRIMARY KEY CLUSTERED,\n    TenSP NVARCHAR(80) NOT NULL,\n    DonGia INT NOT NULL,\n    ValidFrom DATETIME2 GENERATED ALWAYS AS ROW START NOT NULL,\n    ValidTo   DATETIME2 GENERATED ALWAYS AS ROW END   NOT NULL,\n    PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)\n)\nWITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.SanPham_History));\n\n-- Truy vấn lại bảng giá sản phẩm tại đúng thời điểm 09:00 sáng ngày 15/01/2024:\nSELECT MaSP, TenSP, DonGia\nFROM dbo.SanPham_Temporal\nFOR SYSTEM_TIME AS OF '2024-01-15 09:00:00';",
      "result": {
        "cols": [
          "MaSP",
          "TenSP",
          "DonGia (Tại thời điểm 15/01/2024)",
          "ValidFrom",
          "ValidTo"
        ],
        "rows": [
          [
            101,
            "Ban Phim Co Keychron K2",
            1800,
            "2024-01-01 00:00:00",
            "2024-02-10 14:22:00"
          ],
          [
            102,
            "Chuot Logitech MX Master 3S",
            2200,
            "2024-01-01 00:00:00",
            "9999-12-31 23:59:59"
          ]
        ]
      },
      "note": "Với Temporal Table, bạn không cần tự viết Audit Trigger nữa! Mỗi khi dòng bị UPDATE hoặc DELETE, SQL Server tự động đẩy bản ghi cũ kèm khoảng thời gian hiệu lực sang bảng History. (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    }
  ],
  "dialects": [
    [
      "Đọc trường vô hướng từ JSON",
      "JSON_VALUE(col, '$.path')",
      "JSON_UNQUOTE(JSON_EXTRACT(col, '$.path')) (hoặc col->>'$.path')",
      "col->>'key' hoặc jsonb_path_query (SQLite: json_extract(col, '$.path'))"
    ],
    [
      "Bung mảng JSON thành các dòng bảng",
      "OPENJSON(col) WITH (...)",
      "JSON_TABLE(col, '$[*]' COLUMNS (...)) (MySQL 8+)",
      "jsonb_to_recordset(col) / jsonb_array_elements (SQLite: json_each)"
    ],
    [
      "Xoay dòng thành cột (Pivot)",
      "Toán tử PIVOT (...) hoặc SUM(CASE WHEN ...)",
      "SUM(CASE WHEN ... END)",
      "COUNT(*) FILTER (WHERE ...) hoặc hàm crosstab()"
    ]
  ],
  "bridge_java": "// [Java - Spring Data JPA / Hibernate 6+] Ánh xạ trực tiếp cột JSON thành Object/Map trong Java\n// Từ Hibernate 6.2+ (Spring Boot 3.1+), bạn không cần cài thêm thư viện ngoài (như vladmihalcea hypersistence-utils)\n// để map cột JSON nữa, chỉ cần gắn @JdbcTypeCode(SqlTypes.JSON):\n\n@Entity\n@Table(name = \"SanPham\")\npublic class SanPham {\n    @Id\n    private Integer maSp;\n\n    @JdbcTypeCode(SqlTypes.JSON)\n    @Column(name = \"ThongSoKyThuat\", columnDefinition = \"NVARCHAR(MAX)\")\n    private Map<String, Object> thongSoKyThuat; // Hoặc dùng một class POJO/Record cụ thể!\n}",
  "bridge_csharp": "// [C# - EF Core 7/8+] Ánh xạ cột JSON bằng .ToJson() và truy vấn LINQ xuyên thẳng vào bên trong JSON!\n// EF Core cho phép bạn định nghĩa một class con (Owned Entity) lưu dưới dạng JSON và viết LINQ .Where()\n// trên thuộc tính của class đó, EF Core sẽ tự động dịch thành JSON_VALUE() trong SQL Server!\n\npublic class SanPham {\n    public int MaSP { get; set; }\n    public ThongSoJson? ThongSo { get; set; }\n}\npublic class ThongSoJson {\n    public int RamGb { get; set; }\n    public string Cpu { get; set; } = \"\";\n}\n\n// Trong OnModelCreating:\nmodelBuilder.Entity<SanPham>().OwnsOne(sp => sp.ThongSo, b => b.ToJson());\n\n// Khi truy vấn LINQ, EF Core tự dịch sang: WHERE CAST(JSON_VALUE([s].[ThongSo], '$.RamGb') AS int) >= 16\nvar laptopsManh = await dbContext.SanPhams\n    .Where(sp => sp.ThongSo != null && sp.ThongSo.RamGb >= 16)\n    .ToListAsync();",
  "performance": "<ul>\n  <li><strong>Khi nào KHÔNG nên dùng JSON trong CSDL quan hệ?</strong> Đừng nhét các thực thể cốt lõi cần tham gia <code>JOIN</code>, ràng buộc <code>FOREIGN KEY</code> hoặc cập nhật từng trường liên tục vào trong một cục JSON khổng lồ! Mỗi lần bạn dùng <code>JSON_MODIFY</code> sửa 1 con số nhỏ bên trong chuỗi JSON trên cột <code>NVARCHAR(MAX)</code>, SQL Server phải ghi lại toàn bộ chuỗi JSON đó. Chỉ dùng JSON cho thuộc tính mở rộng (Metadata/Attributes), dữ liệu log sự kiện, hoặc truyền gói dữ liệu qua <code>OPENJSON</code>.</li>\n  <li><strong>Khi nào dùng Rowstore (B-Tree) và khi nào dùng Columnstore?</strong>\n    <ul>\n      <li><strong>Rowstore (B-Tree Index):</strong> Tối ưu cho giao dịch <strong>OLTP</strong> (tìm kiếm 1 dòng cụ thể theo ID, thêm/sửa/xóa từng đơn hàng liên tục).</li>\n      <li><strong>Columnstore Index:</strong> Tối ưu cho phân tích <strong>OLAP / Data Warehouse</strong> (quét hàng chục triệu dòng để tính tổng, trung bình trên vài cột) hoặc dùng <em>Non-Clustered Columnstore Index (NCCI)</em> trên bảng OLTP để chạy báo cáo thời gian thực (HTAP - Real-time Operational Analytics).</li>\n    </ul>\n  </li>\n</ul>",
  "common_errors": [
    "Khi dùng toán tử PIVOT trong T-SQL, viết SELECT * FROM DonHang ở bảng nguồn bên trong thay vì chỉ chiếu đúng 3 cột cần thiết: PIVOT sẽ gom nhóm theo tất cả các cột còn lại (như MaDH, NgayDat), làm mỗi dòng bị tách riêng lẻ thay vì gộp lại trên 1 dòng!",
    "Lọc trực tiếp WHERE JSON_VALUE(Data, '$.Status') = 'ACTIVE' trên bảng hàng triệu dòng mà không tạo Computed Column kèm Index cho biểu thức JSON_VALUE đó, dẫn tới Full Table Scan.",
    "Cố gắng chạy lệnh DROP TABLE hoặc TRUNCATE TABLE trực tiếp trên một bảng Temporal Table đang bật SYSTEM_VERSIONING = ON (SQL Server sẽ chặn lại để bảo vệ lịch sử; bạn phải chạy ALTER TABLE ... SET (SYSTEM_VERSIONING = OFF) trước).",
    "Chia Table Partitioning theo một cột không bao giờ xuất hiện trong mệnh đề WHERE của các câu truy vấn phổ biến, làm máy chủ phải quét qua toàn bộ mọi Partition (chậm hơn cả khi chưa chia Partition!).",
    "Tạo Clustered Columnstore Index trên một bảng nhỏ chỉ có vài nghìn dòng và bị UPDATE/DELETE từng dòng liên tục: Làm sinh ra quá nhiều Delta Store và Deleted Bitmap gây lãng phí tài nguyên."
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "Làm thế nào để xoay dữ liệu từ các dòng thành các cột (ví dụ xoay 4 dòng Quý 1, Quý 2, Quý 3, Quý 4 thành 4 cột ngang) trong SQL?",
      "a_short": "Có 2 cách: (1) Dùng kỹ thuật chuẩn ANSI SQL là kết hợp GROUP BY với SUM(CASE WHEN Quy = 1 THEN DoanhThu ELSE 0 END) AS Quy1; hoặc (2) Dùng toán tử PIVOT (...) FOR Quy IN ([1], [2], [3], [4]) trong T-SQL.",
      "a_long": "Cách dùng SUM(CASE WHEN ... END) được ưa chuộng trong thực tế vì chạy được trên mọi hệ quản trị CSDL, dễ đọc và cho phép tính nhiều hàm tổng hợp khác nhau (vừa SUM doanh thu vừa COUNT số đơn) trong cùng 1 câu lệnh. Toán tử PIVOT của T-SQL có cú pháp ngắn gọn khi xoay 1 hàm tổng hợp duy nhất, nhưng đòi hỏi phải bọc bảng nguồn trong một CTE/Derived Table chỉ chứa đúng các cột cần thiết để tránh bị GROUP BY nhầm theo các cột thừa."
    },
    {
      "level": "Junior",
      "q": "Giả sử bảng Sản phẩm có cột ThongSo lưu chuỗi JSON. Nếu câu truy vấn WHERE JSON_VALUE(ThongSo, '$.HangSanXuat') = 'Sony' bị chậm khi bảng lớn, bạn làm thế nào để tối ưu mà không cần tách bảng mới?",
      "a_short": "Tạo một cột tính toán (Computed Column) trích xuất sẵn giá trị JSON_VALUE(ThongSo, '$.HangSanXuat'), sau đó tạo một Non-Clustered Index trên cột tính toán đó.",
      "a_long": "Nếu gọi trực tiếp JSON_VALUE() trong WHERE, SQL Server phải đọc và phân tích cú pháp chuỗi JSON của từng dòng trên toàn bảng (Table Scan). Giải pháp chuẩn là chạy: ALTER TABLE SanPham ADD HangSanXuat AS CAST(JSON_VALUE(ThongSo, '$.HangSanXuat') AS NVARCHAR(50)); tiếp theo chạy CREATE INDEX IX_SanPham_HangSX ON SanPham(HangSanXuat). Từ thời điểm đó, cả câu truy vấn theo cột HangSanXuat lẫn câu truy vấn viết trực tiếp JSON_VALUE(ThongSo, '$.HangSanXuat') đều được trình tối ưu tự động chuyển sang dùng Index Seek cực nhanh!"
    },
    {
      "level": "Mid",
      "q": "Hãy giải thích sự khác biệt cơ bản giữa Rowstore Index (B-Tree) và Columnstore Index. Tại sao xóa dữ liệu cũ bằng Partition Switching lại nhanh hơn lệnh DELETE gấp hàng nghìn lần?",
      "a_short": "Rowstore lưu tất cả các cột của cùng 1 dòng liền nhau trên trang 8KB (tối ưu cho OLTP đọc/sửa từng bản ghi); Columnstore lưu và nén dữ liệu của từng cột riêng biệt (tối ưu cho OLAP tính tổng trên hàng triệu dòng). Partition Switching nhanh tức thì vì nó chỉ đổi con trỏ metadata của phân vùng sang bảng đích mà không chạm tới từng dòng dữ liệu hay ghi log từng dòng.",
      "a_long": "Về lưu trữ: Rowstore đọc cả dòng nên rất nhanh khi truy vấn 'Lấy đơn hàng số 1005', nhưng rất tốn I/O khi chạy 'Tính tổng cột ThànhTiền của 100 triệu đơn'. Columnstore tách từng cột thành các đoạn nén độc lập (nén 10x) và xử lý theo lô (Batch Mode) trên CPU nên quét 100 triệu dòng chỉ mất chưa tới 1 giây. Về xóa dữ liệu lịch sử: Lệnh DELETE 50 triệu dòng phải tìm từng dòng, khóa bảng, cập nhật mọi Index và ghi 50 triệu dòng vào Transaction Log. Ngược lại, nếu bảng được chia Partition theo tháng, lệnh ALTER TABLE Orders SWITCH PARTITION 1 TO Orders_Staging chỉ là một thao tác cập nhật con trỏ trong каталог hệ thống (Metadata operation), hoàn tất trong vài mili-giây sau đó bạn chỉ việc TRUNCATE bảng Staging."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 13.1: Xoay bảng (PIVOT chuẩn ANSI) thống kê số lượng sinh viên Nam và Nữ theo từng Khoa",
      "problem": "Trên CSDL TruongHoc, hãy viết câu truy vấn xoay cột GioiTinh ('Nam', 'Nu') thành 2 cột riêng biệt cho tất cả các khoa trong bảng Khoa. Hiển thị: MaKhoa, TenKhoa, SoSVNam, SoSVNu và TongSV. Sắp xếp theo MaKhoa tăng dần.",
      "intuition": "Dùng LEFT JOIN từ Khoa sang SinhVien, kết hợp SUM(CASE WHEN sv.GioiTinh = 'Nam' THEN 1 ELSE 0 END) AS SoSVNam và tương tự cho 'Nu'.",
      "trace": "CNTT: 2 Nam, 1 Nữ, Tổng 3. DL: 0 Nam, 0 Nữ, Tổng 0. DT: 1 Nam, 0 Nữ, Tổng 1. KT: 0 Nam, 2 Nữ, Tổng 2.",
      "sql": "SELECT k.MaKhoa, k.TenKhoa,\n       SUM(CASE WHEN sv.GioiTinh = 'Nam' THEN 1 ELSE 0 END) AS SoSVNam,\n       SUM(CASE WHEN sv.GioiTinh = 'Nu'  THEN 1 ELSE 0 END) AS SoSVNu,\n       COUNT(sv.MaSV) AS TongSV\nFROM Khoa AS k\nLEFT JOIN SinhVien AS sv ON k.MaKhoa = sv.MaKhoa\nGROUP BY k.MaKhoa, k.TenKhoa\nORDER BY k.MaKhoa ASC;",
      "db": "truonghoc",
      "expected": {
        "cols": [
          "MaKhoa",
          "TenKhoa",
          "SoSVNam",
          "SoSVNu",
          "TongSV"
        ],
        "rows": [
          [
            "CNTT",
            "Cong Nghe Thong Tin",
            2,
            1,
            3
          ],
          [
            "DL",
            "Khoa Du Lich",
            0,
            0,
            0
          ],
          [
            "DT",
            "Dien Tu Vien Thong",
            1,
            0,
            1
          ],
          [
            "KT",
            "Kinh Te Doi Ngoai",
            0,
            2,
            2
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Sử dụng kỹ thuật Conditional Aggregation: SUM(CASE WHEN sv.GioiTinh = 'Nam' THEN 1 ELSE 0 END).",
        "LEFT JOIN Khoa k với SinhVien sv để khoa Du Lịch (DL) vẫn xuất hiện với các giá trị 0.",
        "SELECT k.MaKhoa, k.TenKhoa, SUM(CASE WHEN sv.GioiTinh = 'Nam' THEN 1 ELSE 0 END) AS SoSVNam, SUM(CASE WHEN sv.GioiTinh = 'Nu' THEN 1 ELSE 0 END) AS SoSVNu, COUNT(sv.MaSV) AS TongSV FROM Khoa AS k LEFT JOIN SinhVien AS sv ON k.MaKhoa = sv.MaKhoa GROUP BY k.MaKhoa, k.TenKhoa ORDER BY k.MaKhoa ASC;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 13.2: Chuyển đổi Cột thành Dòng (UNPIVOT chuẩn ANSI bằng UNION ALL)",
      "problem": "Trên CSDL TruongHoc, bảng DangKy có 2 cột điểm trên cùng 1 dòng là DiemQT và DiemCK. Hãy dùng kỹ thuật UNPIVOT chuẩn ANSI (ghép 2 câu SELECT bằng UNION ALL) cho sinh viên MaSV = 201 trong học kỳ '2024A' để biến mỗi cột điểm thành 1 dòng riêng gồm 3 cột: MaMH, LoaiDiem ('DIEM_QT' hoặc 'DIEM_CK') và SoDiem. Sắp xếp theo MaMH tăng dần, LoaiDiem giảm dần.",
      "intuition": "Viết câu SELECT thứ nhất lấy DiemQT gắn nhãn 'DIEM_QT', UNION ALL với câu SELECT thứ hai lấy DiemCK gắn nhãn 'DIEM_CK' cho MaSV = 201 AND HocKy = '2024A'.",
      "trace": "SV 201 học 2 môn ở kỳ 2024A (CS101 và CS102). Sau khi UNPIVOT, 2 dòng gốc được tách thành 4 dòng (mỗi môn 2 dòng DIEM_QT và DIEM_CK).",
      "sql": "SELECT MaMH, 'DIEM_QT' AS LoaiDiem, DiemQT AS SoDiem\nFROM DangKy\nWHERE MaSV = 201 AND HocKy = '2024A'\nUNION ALL\nSELECT MaMH, 'DIEM_CK' AS LoaiDiem, DiemCK AS SoDiem\nFROM DangKy\nWHERE MaSV = 201 AND HocKy = '2024A'\nORDER BY MaMH ASC, LoaiDiem DESC;",
      "db": "truonghoc",
      "expected": {
        "cols": [
          "MaMH",
          "LoaiDiem",
          "SoDiem"
        ],
        "rows": [
          [
            "CS101",
            "DIEM_QT",
            8.5
          ],
          [
            "CS101",
            "DIEM_CK",
            9.0
          ],
          [
            "CS102",
            "DIEM_QT",
            7.0
          ],
          [
            "CS102",
            "DIEM_CK",
            8.0
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Mỗi cột cần xoay dọc xuống thành dòng tương ứng với 1 nhánh SELECT trong khối UNION ALL.",
        "SELECT MaMH, 'DIEM_QT' AS LoaiDiem, DiemQT AS SoDiem FROM DangKy WHERE ... UNION ALL SELECT MaMH, 'DIEM_CK' AS LoaiDiem, DiemCK AS SoDiem FROM DangKy WHERE ...;",
        "SELECT MaMH, 'DIEM_QT' AS LoaiDiem, DiemQT AS SoDiem FROM DangKy WHERE MaSV = 201 AND HocKy = '2024A' UNION ALL SELECT MaMH, 'DIEM_CK' AS LoaiDiem, DiemCK AS SoDiem FROM DangKy WHERE MaSV = 201 AND HocKy = '2024A' ORDER BY MaMH ASC, LoaiDiem DESC;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch13_p1",
      "title": "Tận dụng Computed Column để đánh Index tìm kiếm không phân biệt hoa thường và khoảng trắng",
      "difficulty": "Khá",
      "db": "autoshop",
      "summary": "Trên CSDL Auto Shop, hãy thêm một cột tính toán tự động (Generated Column) có tên EmailChuanHoa vào bảng Customers với công thức LOWER(TRIM(Email)), sau đó tạo Index IX_Customers_EmailChuanHoa trên cột mới này và truy vấn lấy Id, FName, LName, Email, EmailChuanHoa của khách hàng có EmailChuanHoa = 'dmiller@example.net'.",
      "understand": "Dùng ALTER TABLE Customers ADD COLUMN EmailChuanHoa TEXT GENERATED ALWAYS AS (LOWER(TRIM(Email))) VIRTUAL; tạo Index trên cột đó rồi SELECT.",
      "brute": "Viết WHERE LOWER(TRIM(Email)) = 'dmiller@example.net' trực tiếp trên cột gốc chưa chuẩn hóa làm mất khả năng dùng Index.",
      "optimal": "Định nghĩa Computed Column (trong SQL Server là AS LOWER(TRIM(Email)) PERSISTED) và đánh Index trực tiếp lên cột tính toán đó.",
      "trace": "Khách hàng Id = 2 (David Miller) có email khớp hoàn toàn và được tìm thấy ngay qua Index.",
      "sql": "ALTER TABLE Customers ADD COLUMN EmailChuanHoa TEXT GENERATED ALWAYS AS (LOWER(TRIM(Email))) VIRTUAL;\nCREATE INDEX IX_Customers_EmailChuanHoa ON Customers (EmailChuanHoa);\nSELECT Id, FName, LName, Email, EmailChuanHoa\nFROM Customers\nWHERE EmailChuanHoa = 'dmiller@example.net';",
      "expected": {
        "cols": [
          "Id",
          "FName",
          "LName",
          "Email",
          "EmailChuanHoa"
        ],
        "rows": [
          [
            2,
            "David",
            "Miller",
            "dmiller@example.net",
            "dmiller@example.net"
          ]
        ]
      },
      "order_matters": false,
      "pitfalls": "Quên từ khóa GENERATED ALWAYS AS (...) khi khai báo cột tính toán.",
      "note3": {
        "idea": "Khi bắt buộc phải lọc theo một biểu thức hàm (như LOWER(Email), YEAR(NgayDat), JSON_VALUE(Data, '$.Code')), hãy tạo một Computed Column cho biểu thức đó rồi đánh Index lên Computed Column để biến truy vấn thành Sargable!",
        "syntax": "-- T-SQL: ALTER TABLE T ADD NormalizedCol AS LOWER(Col) PERSISTED; CREATE INDEX IX ON T(NormalizedCol);",
        "trap": "Biểu thức trong Computed Column dùng để đánh Index bắt buộc phải là hàm tất định (Deterministic - cùng đầu vào luôn cho cùng đầu ra, không được chứa GETDATE() hay RAND())."
      }
    }
  ],
  "summary_table": [
    [
      "PIVOT / SUM(CASE WHEN)",
      "Xoay giá trị từ dòng thành các cột ngang",
      "Chỉ đưa đúng các cột cần thiết vào subquery nguồn của PIVOT"
    ],
    [
      "OPENJSON / FOR JSON",
      "Chuyển đổi hai chiều giữa chuỗi JSON và bảng quan hệ",
      "Giải pháp hàng đầu để truyền mảng dữ liệu lớn vào SP"
    ],
    [
      "Computed Column (PERSISTED)",
      "Cột tự động tính toán theo công thức và lưu vật lý",
      "Đánh Index lên Computed Column để tối ưu tìm kiếm biểu thức/JSON"
    ],
    [
      "Temporal Table",
      "Bảng tự động lưu lịch sử thay đổi theo mốc thời gian",
      "Truy vấn quá khứ bằng FOR SYSTEM_TIME AS OF"
    ],
    [
      "Partitioning & Columnstore",
      "Phân vùng bảng lớn & Lưu trữ nén theo cột cho OLAP",
      "Dùng SWITCH PARTITION để dọn dữ liệu cũ tức thì"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Trong SQL Server, khi dùng toán tử PIVOT, tại sao bạn không nên viết SELECT * FROM BangGoc làm nguồn dữ liệu đầu vào cho PIVOT?",
      "a": "Vì PIVOT tự động gom nhóm (GROUP BY) theo tất cả các cột không nằm trong hàm tổng hợp và không nằm trong mệnh đề FOR. Nếu dùng SELECT *, khóa chính của bảng gốc sẽ bị đưa vào GROUP BY làm mỗi dòng đứng riêng lẻ, không gộp lại được."
    },
    {
      "q": "Câu 2: Để truyền một danh sách gồm 2.000 đối tượng đơn hàng từ ứng dụng C# / Java xuống một Stored Procedure trong SQL Server một cách gọn nhẹ, bạn có thể dùng hai kỹ thuật nào?",
      "a": "Cách 1: Truyền dưới dạng chuỗi JSON vào tham số NVARCHAR(MAX) rồi dùng hàm OPENJSON(@json) WITH (...) trong SP. Cách 2: Dùng Table-Valued Parameter (TVP - truyền DataTable khớp với User-Defined Table Type)."
    },
    {
      "q": "Câu 3: Giữa bảng giao dịch giỏ hàng (thêm/sửa từng dòng liên tục theo ID) và bảng kho dữ liệu phân tích doanh thu 5 năm (100 triệu dòng, chỉ thêm mới theo lô và chạy báo cáo SUM/AVG), bảng nào nên dùng Clustered Columnstore Index?",
      "a": "Bảng kho dữ liệu phân tích doanh thu 5 năm (OLAP/Data Warehouse) nên dùng Clustered Columnstore Index để nén dữ liệu gấp 10 lần và tăng tốc quét cột. Bảng giỏ hàng (OLTP) phải giữ nguyên Rowstore B-Tree Index."
    }
  ]
});
