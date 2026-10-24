/**
 * FILE: src/data/chapters/ch08-index-btree-sargability-plan.js
 * MÔ TẢ: Chương 8 - Index (B-Tree, Clustered, Covering), Sargability & Đọc Execution Plan
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch08",
  "code": "Chương 8",
  "title": "Index (B-Tree, Clustered, Covering), Sargability & Đọc Execution Plan",
  "sources": [
    "S ch.16, 37",
    "M ch.59, 84, 85, 86 (và kiến thức chuyên sâu tối ưu hiệu năng)"
  ],
  "goals": [
    "Hiểu rõ cấu trúc cây cân bằng B+Tree (Root, Intermediate, Leaf pages) và tại sao tìm kiếm trên Index chỉ tốn O(log N) lần đọc trang đĩa.",
    "Phân biệt rành mạch Clustered Index và Non-Clustered Index, giải thích được bản chất của thao tác Key Lookup (Bookmark Lookup) và cách khử nó bằng Covering Index (INCLUDE).",
    "Nắm vững quy tắc thiết kế Composite Index (Leftmost Prefix, Equality trước Range/Order) và viết câu truy vấn đạt chuẩn Sargable.",
    "Đọc hiểu các toán tử quan trọng nhất trên Execution Plan (Table Scan, Index Scan, Index Seek, Key Lookup, Sort, Hash Match)."
  ],
  "signals": [
    "API tìm kiếm hoặc báo cáo chạy mất 5-10 giây khi bảng dữ liệu vượt mốc vài triệu dòng, CPU của máy chủ DB luôn ở mức 90-100%.",
    "Câu hỏi phỏng vấn kinh điển: 'Bảng đã đánh Index trên cột CreatedAt nhưng câu lệnh WHERE YEAR(CreatedAt) = 2025 vẫn chạy Table Scan, tại sao?'.",
    "Cần quyết định thứ tự các cột khi tạo một Index ghép trên 3 cột (Status, CustomerId, OrderDate)."
  ],
  "theory": "<h3>8.1. Tại sao B-Tree (chính xác là B+Tree) lại thống trị thế giới CSDL?</h3>\n<p>Cơ sở dữ liệu lưu dữ liệu trên ổ cứng theo từng đơn vị khối cố định gọi là <strong>Trang dữ liệu (Page)</strong>: trong SQL Server và PostgreSQL, mỗi Page có kích thước <strong>8 KB</strong> (trong MySQL InnoDB là 16 KB). Nếu bảng chưa có bất kỳ Index nào, nó được gọi là một <strong>Heap (Đống dữ liệu lộn xộn)</strong>. Muốn tìm khách hàng có <code>MaKH = 5000</code> trên một Heap 1 triệu dòng, máy chủ buộc phải đọc tuần tự từng Page từ đầu đến cuối (<strong>Table Scan</strong>, độ phức tạp O(N)).</p>\n<p>Khi bạn đánh <strong>B-Tree Index</strong> (hãy bấm sang <strong>Bộ Mô Phỏng Trực Quan &rarr; Index &amp; B-Tree</strong> để trải nghiệm), máy chủ dựng một cây nhiều tầng luôn tự cân bằng:</p>\n<ul>\n  <li><strong>Root Page (Trang gốc) &amp; Intermediate Pages (Trang nhánh):</strong> Chỉ lưu các giá trị khóa phân ranh giới và con trỏ trỏ xuống trang tầng dưới. Nhờ mỗi trang 8KB chứa được hàng trăm con trỏ (hệ số phân nhánh - <em>Fan-out</em> rất lớn), một cây B-Tree cao chỉ <strong>3 đến 4 tầng</strong> đã quản lý được hàng trăm triệu dòng!</li>\n  <li><strong>Leaf Pages (Trang lá):</strong> Nằm ở tầng đáy cùng, được nối với nhau bằng <strong>danh sách liên kết kép (Doubly Linked List)</strong> theo đúng thứ tự sắp xếp của khóa. Nhờ vậy, sau khi nhảy từ Root xuống đúng điểm bắt đầu ở tầng lá (chỉ mất 3-4 lần đọc trang), máy chủ có thể lướt ngang trên tầng lá để lấy một khoảng dữ liệu (Range Scan) cực nhanh mà không cần quay lên gốc!</li>\n</ul>\n\n<h3>8.2. Clustered Index vs Non-Clustered Index và bài toán Key Lookup</h3>\n<p>Đây là câu hỏi phân loại trình độ ứng viên rõ nhất trong các buổi phỏng vấn .NET / Java:</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Tiêu chí</th>\n      <th>Clustered Index (Chỉ mục cụm)</th>\n      <th>Non-Clustered Index (Chỉ mục phi cụm)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>Ví dụ đời thường</strong></td>\n      <td>Giống như <strong>Từ điển tiếng Anh</strong>: bản thân các trang từ điển đã được sắp xếp vật lý từ A đến Z.</td>\n      <td>Giống như <strong>Mục lục ở cuối sách giáo khoa</strong>: liệt kê từ khóa kèm số trang để bạn lật lại trang sách chính.</td>\n    </tr>\n    <tr>\n      <td><strong>Tầng lá (Leaf Level) chứa gì?</strong></td>\n      <td>Tầng lá của Clustered Index <strong>chính là toàn bộ dòng dữ liệu gốc của bảng</strong>! Không tốn thêm bảng phụ.</td>\n      <td>Tầng lá chỉ chứa <strong>các cột khóa của Index + con trỏ (Row Locator)</strong> (chính là khóa Clustered Index của dòng đó, hoặc RID nếu bảng là Heap).</td>\n    </tr>\n    <tr>\n      <td><strong>Số lượng tối đa trên 1 bảng</strong></td>\n      <td>Chỉ duy nhất <strong>1 Clustered Index</strong> (vì dữ liệu vật lý chỉ có thể sắp xếp theo 1 thứ tự duy nhất). Mặc định khi tạo <code>PRIMARY KEY</code> trong SQL Server, nó sẽ tạo Clustered Index.</td>\n      <td>Có thể tạo <strong>nhiều Non-Clustered Index</strong> (SQL Server hỗ trợ tối đa 999, nhưng thực tế chỉ nên giữ 3 đến 7 Index quan trọng cho mỗi bảng để không làm chậm lệnh <code>INSERT/UPDATE/DELETE</code>).</td>\n    </tr>\n  </tbody>\n</table>\n<p><strong>Hiện tượng Key Lookup (Bookmark Lookup) và giải pháp Covering Index:</strong> Giả sử bảng <code>DonHang</code> có Clustered Index trên <code>MaDH</code>, và một Non-Clustered Index chỉ đánh trên cột <code>MaKH</code>. Khi bạn chạy: <code>SELECT MaDH, MaKH, NgayDat, TongTien FROM DonHang WHERE MaKH = 10</code>, máy chủ sẽ dùng Non-Clustered Index để <em>Index Seek</em> ra các dòng của <code>MaKH = 10</code>. Tại tầng lá của Non-Clustered Index này mới chỉ có <code>MaKH</code> và <code>MaDH</code>, nhưng câu lệnh đòi lấy thêm <code>NgayDat</code> và <code>TongTien</code>! Máy chủ buộc phải cầm từng mã <code>MaDH</code> nhảy ngược sang cây Clustered Index để đọc nốt 2 cột còn thiếu. Thao tác nhảy ngược đó gọi là <strong>Key Lookup</strong>! Nếu khách hàng có 10.000 đơn, 10.000 lần Key Lookup ngẫu nhiên sẽ còn chậm hơn cả quét toàn bảng! Để khử sạch Key Lookup, ta biến Index thành <strong>Covering Index (Chỉ mục bao phủ)</strong> bằng cách thêm <code>INCLUDE (NgayDat, TongTien)</code>.</p>\n\n<h3>8.3. Sargability (Search ARGument ABLE): Viết SQL đừng tự tay \"chọc mù\" Index!</h3>\n<p>Một điều kiện lọc trong <code>WHERE</code> được gọi là <strong>Sargable</strong> nếu trình tối ưu có thể dùng nó để thực hiện phép <strong>Index Seek</strong> trên cây B-Tree. Ниже là bảng tổng hợp các mẫu câu <em>Non-Sargable</em> (làm hỏng Index) và cách viết lại chuẩn <em>Sargable</em>:</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Nguyên nhân làm hỏng Index</th>\n      <th>Cách viết SAI (Non-Sargable &rarr; Scan)</th>\n      <th>Cách viết ĐÚNG (Sargable &rarr; Seek)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>Bọc hàm lên cột ngày tháng</strong></td>\n      <td><code>WHERE YEAR(NgayDat) = 2024</code></td>\n      <td><code>WHERE NgayDat &gt;= '2024-01-01' AND NgayDat &lt; '2025-01-01'</code></td>\n    </tr>\n    <tr>\n      <td><strong>Thực hiện phép toán trên cột</strong></td>\n      <td><code>WHERE Salary * 1.1 &gt; 1100</code></td>\n      <td><code>WHERE Salary &gt; 1100 / 1.1</code></td>\n    </tr>\n    <tr>\n      <td><strong>Cắt chuỗi lấy tiền tố</strong></td>\n      <td><code>WHERE LEFT(HoTen, 6) = N'Nguyễn'</code></td>\n      <td><code>WHERE HoTen LIKE N'Nguyễn%'</code> (dấu % ở cuối vẫn Seek được!)</td>\n    </tr>\n    <tr>\n      <td><strong>Bọc COALESCE/ISNULL lên cột</strong></td>\n      <td><code>WHERE ISNULL(TrangThai, 'MOI') = 'MOI'</code></td>\n      <td><code>WHERE TrangThai = 'MOI' OR TrangThai IS NULL</code></td>\n    </tr>\n    <tr>\n      <td><strong>Lệch kiểu dữ liệu (Implicit Conversion)</strong></td>\n      <td>Cột <code>SoDT VARCHAR(15)</code> nhưng truyền tham số <code>NVARCHAR</code> hoặc <code>INT</code></td>\n      <td>Truyền đúng kiểu <code>VARCHAR</code> từ code (<code>SqlDbType.VarChar</code>)</td>\n    </tr>\n  </tbody>\n</table>",
  "mechanism": "<h3>Chạy tay từng bước: So sánh số trang đĩa phải đọc (Logical Reads) giữa Table Scan và B-Tree Seek</h3>\n<p>Giả sử bảng <code>DonHang</code> có <strong>1.000.000 dòng</strong>, chiếm <strong>10.000 trang đĩa (Pages)</strong>. Một cây B-Tree Index trên cột <code>MaKH</code> có chiều cao <strong>3 tầng</strong> (1 trang Root &rarr; 50 trang Nhánh &rarr; 1.200 trang Lá). Ta cần tìm 2 đơn hàng của khách <code>MaKH = 500</code>:</p>\n<div class=\"trace-steps\">\n  <div class=\"trace-step\"><strong>Kịch bản A - Không có Index (Table Scan / Clustered Index Scan):</strong> Máy chủ phải đọc toàn bộ <strong>10.000 trang đĩa (80 MB)</strong> để kiểm tra từng dòng xem <code>MaKH</code> có bằng 500 không.</div>\n  <div class=\"trace-step\"><strong>Kịch bản B - Có Non-Clustered Index trên (MaKH), chưa Covering:</strong>\n    <ul>\n      <li>Đọc trang Root (1 read) &rarr; nhảy xuống trang Nhánh chứa dải 400..600 (1 read) &rarr; nhảy xuống trang Lá chứa <code>MaKH = 500</code> (1 read). Tổng bước Seek = <strong>3 trang</strong>.</li>\n      <li>Vì câu lệnh đòi lấy thêm cột <code>NgayDat</code> không nằm trong Index, với mỗi đơn trong 2 đơn tìm được, máy chủ thực hiện 1 lần <em>Key Lookup</em> sang Clustered Index (tốn 3 trang/đơn * 2 đơn = <strong>6 trang</strong>).</li>\n      <li>Tổng cộng Kịch bản B chỉ đọc <strong>3 + 6 = 9 trang đĩa</strong> (nhanh hơn 1.100 lần so với Kịch bản A!).</li>\n    </ul>\n  </div>\n  <div class=\"trace-step\"><strong>Kịch bản C - Có Covering Index trên (MaKH) INCLUDE (NgayDat):</strong> Ngay khi chạm tới trang Lá ở bước Seek thứ 3, cột <code>NgayDat</code> đã nằm sẵn ở đó! Không cần Key Lookup, tổng số trang đọc chỉ còn đúng <strong>3 trang đĩa</strong>!</div>\n</div>",
  "examples": [
    {
      "title": "Ví dụ 8.1: Tạo Composite Index và kiểm tra kế hoạch thực thi bằng EXPLAIN QUERY PLAN",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "CREATE INDEX IX_DonHang_MaKH_NgayDat ON DonHang (MaKH, NgayDat DESC);\nEXPLAIN QUERY PLAN\nSELECT MaDH, MaKH, NgayDat\nFROM DonHang\nWHERE MaKH = 1\nORDER BY NgayDat DESC;",
      "result": {
        "cols": [
          "id",
          "parent",
          "notused",
          "detail"
        ],
        "rows": [
          [
            4,
            0,
            0,
            "SEARCH DonHang USING INDEX IX_DonHang_MaKH_NgayDat (MaKH=?)"
          ]
        ]
      },
      "note": "Nhờ chỉ mục ghép (MaKH, NgayDat DESC) đồng thời bao phủ đủ các cột trong SELECT (MaDH là khóa chính luôn có sẵn trong lá của B-Tree), trình tối ưu dùng SEARCH ... USING COVERING INDEX mà không cần đọc bảng gốc hay Sort lại!"
    },
    {
      "title": "Ví dụ 8.2: So sánh truy vấn Vi phạm Sargability (bọc hàm quanh cột) và Truy vấn Chuẩn Sargable",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "-- Truy vấn CHUẨN SARGABLE (giữ cột NgayDat đứng độc lập ở vế trái):\nSELECT MaDH, MaKH, NgayDat, TrangThai\nFROM DonHang\nWHERE NgayDat >= '2024-02-01' AND NgayDat < '2024-03-01'\nORDER BY NgayDat ASC;",
      "result": {
        "cols": [
          "MaDH",
          "MaKH",
          "NgayDat",
          "TrangThai"
        ],
        "rows": [
          [
            1003,
            1,
            "2024-02-01",
            "HOAN_THANH"
          ],
          [
            1004,
            3,
            "2024-02-15",
            "DA_HUY"
          ]
        ]
      },
      "note": "Thay vì viết WHERE SUBSTR(NgayDat, 1, 7) = '2024-02' hoặc WHERE YEAR(NgayDat)=2024 AND MONTH(NgayDat)=2 (làm mù Index), việc viết khoảng >= đầu tháng và < đầu tháng kế tiếp giúp tận dụng 100% Index Range Seek."
    },
    {
      "title": "Ví dụ 8.3: Quy tắc cột dẫn đầu (Leftmost Prefix Rule) trên Composite Index",
      "label": "CHUAN",
      "db": "truonghoc",
      "sql": "CREATE INDEX IX_SinhVien_Khoa_HB ON SinhVien (MaKhoa, HocBong DESC);\nSELECT MaSV, HoTen, MaKhoa, HocBong\nFROM SinhVien\nWHERE MaKhoa = 'CNTT' AND HocBong >= 5000;",
      "result": {
        "cols": [
          "MaSV",
          "HoTen",
          "MaKhoa",
          "HocBong"
        ],
        "rows": [
          [
            202,
            "Doan Thu Ha",
            "CNTT",
            8000
          ],
          [
            201,
            "Bui Minh Tuan",
            "CNTT",
            5000
          ]
        ]
      },
      "note": "Index được tạo theo thứ tự (MaKhoa, HocBong). Khi lọc theo MaKhoa (hoặc cả MaKhoa và HocBong), máy chủ dò cây B-Tree cực nhanh. Nhưng nếu câu truy vấn chỉ lọc WHERE HocBong >= 5000 mà bỏ qua MaKhoa, Index này không thể Seek từ gốc được!"
    },
    {
      "title": "Ví dụ 8.4: Tạo Covering Index với mệnh đề INCLUDE và đọc thống kê I/O trong SQL Server",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "-- Bật đo lường số trang 8KB phải đọc (Logical Reads) và thời gian CPU trong SSMS:\nSET STATISTICS IO, TIME ON;\n\n-- Tạo Non-Clustered Covering Index: cột lọc/sắp xếp ở khóa, cột chỉ hiển thị đặt ở INCLUDE:\nCREATE NONCLUSTERED INDEX IX_DonHang_TrangThai_NgayDat\nON DonHang (TrangThai, NgayDat DESC)\nINCLUDE (MaKH, PhiShip, MaGiamGia);\n\nSELECT MaDH, MaKH, NgayDat, PhiShip, MaGiamGia\nFROM DonHang\nWHERE TrangThai = 'HOAN_THANH'\nORDER BY NgayDat DESC;",
      "result": {
        "cols": [
          "Table",
          "ScanCount",
          "LogicalReads",
          "Operation",
          "KeyLookup"
        ],
        "rows": [
          [
            "DonHang (Trước khi có INCLUDE)",
            1,
            420,
            "Index Seek + Key Lookup (Nested Loops)",
            "Có (tốn 415 reads)"
          ],
          [
            "DonHang (Sau khi có INCLUDE)",
            1,
            3,
            "Index Seek (NonClustered Covering)",
            "Không (0 Key Lookup)"
          ]
        ]
      },
      "note": "Mệnh đề INCLUDE (...) gắn thêm các cột phụ vào tầng lá (Leaf Level) của Non-Clustered Index mà không làm phình kích thước các nút nhánh của cây B-Tree, triệt tiêu hoàn toàn thao tác Key Lookup! (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    },
    {
      "title": "Ví dụ 8.5: Sử dụng Query Hints (OPTION RECOMPILE, FORCESEEK) xử lý lỗi Parameter Sniffing trong T-SQL",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "SELECT MaDH, MaKH, NgayDat, TrangThai\nFROM DonHang WITH (INDEX(IX_DonHang_TrangThai_NgayDat))\nWHERE TrangThai = @TrangThaiParam\nOPTION (RECOMPILE);",
      "result": {
        "cols": [
          "MaDH",
          "MaKH",
          "NgayDat",
          "TrangThai"
        ],
        "rows": [
          [
            1007,
            1,
            "2024-03-25",
            "HOAN_THANH"
          ],
          [
            1005,
            4,
            "2024-03-02",
            "HOAN_THANH"
          ],
          [
            1003,
            1,
            "2024-02-01",
            "HOAN_THANH"
          ]
        ]
      },
      "note": "Khi dữ liệu phân bố lệch (ví dụ 'HOAN_THANH' chiếm 95% bảng còn 'DANG_GIAO' chỉ chiếm 0.1%), kế hoạch thực thi được cache từ lần chạy đầu có thể không tối ưu cho lần chạy sau (Parameter Sniffing). OPTION (RECOMPILE) bảo SQL Server lập kế hoạch riêng cho giá trị tham số hiện tại. (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    }
  ],
  "dialects": [
    [
      "Xem kế hoạch thực thi (Execution Plan)",
      "Bật Actual Execution Plan (Ctrl+M trong SSMS) hoặc SET STATISTICS IO, TIME ON",
      "EXPLAIN / EXPLAIN ANALYZE SELECT ...",
      "EXPLAIN (ANALYZE, BUFFERS) SELECT ... (SQLite: EXPLAIN QUERY PLAN)"
    ],
    [
      "Chỉ mục bao phủ (Covering Index)",
      "CREATE INDEX ... ON T(a) INCLUDE (b, c)",
      "Đưa cột vào cuối Index (MySQL chưa có từ khóa INCLUDE)",
      "CREATE INDEX ... ON T(a) INCLUDE (b, c) (PostgreSQL 11+)"
    ],
    [
      "Chỉ mục có điều kiện lọc (Filtered/Partial)",
      "CREATE INDEX ... ON T(a) WHERE IsDeleted = 0",
      "Không hỗ trợ trực tiếp WHERE trên Index",
      "CREATE INDEX ... ON T(a) WHERE is_deleted = false (SQLite cũng hỗ trợ!)"
    ]
  ],
  "bridge_java": "// [Java - Spring Data JPA / Hibernate] Khai báo Composite & Covering Index trên Entity\n// Hãy đánh Index cho các cột thường xuyên xuất hiện trong WHERE, JOIN (Foreign Key) và ORDER BY:\n\n@Entity\n@Table(name = \"DonHang\", indexes = {\n    @Index(name = \"IX_DonHang_MaKH_NgayDat\", columnList = \"MaKH, NgayDat DESC\"),\n    @Index(name = \"IX_DonHang_TrangThai\", columnList = \"TrangThai\")\n})\npublic class DonHang {\n    // Lưu ý khi truyền chuỗi vào cột VARCHAR trong SQL Server qua JDBC:\n    // Mặc định JDBC Driver của Microsoft gửi mọi String dưới dạng NVARCHAR (Unicode)!\n    // Nếu cột dưới DB là VARCHAR (ASCII), điều này gây CONVERT_IMPLICIT làm hỏng Index!\n    // Khắc phục: Thêm \"sendStringParametersAsUnicode=false\" vào JDBC Connection URL,\n    // hoặc dùng @Column(columnDefinition = \"NVARCHAR(50)\") đồng nhất.\n}",
  "bridge_csharp": "// [C# - EF Core] Tạo Covering Index (IncludeProperties) và phòng tránh Implicit Conversion\n// 1. Trong EF Core, dùng .IncludeProperties() để tạo Covering Index cho SQL Server / PostgreSQL.\n// 2. Với các cột mã ASCII (VARCHAR), hãy cấu hình .IsUnicode(false) để EF Core truyền tham số kiểu varchar\n//    thay vì nvarchar, tránh lỗi CONVERT_IMPLICIT làm mất Index Seek!\n\nmodelBuilder.Entity<DonHang>(entity =>\n{\n    entity.Property(d => d.TrangThai)\n          .HasMaxLength(20)\n          .IsUnicode(false); // Rất quan trọng: báo cho EF Core biết đây là VARCHAR chứ không phải NVARCHAR!\n\n    entity.HasIndex(d => new { d.TrangThai, d.NgayDat })\n          .IsDescending(false, true)\n          .IncludeProperties(d => new { d.MaKH, d.PhiShip });\n});",
  "performance": "<ul>\n  <li><strong>Mặt trái của việc đánh quá nhiều Index:</strong> Index tăng tốc lệnh <code>SELECT</code>, nhưng mỗi khi bạn chạy <code>INSERT</code>, <code>UPDATE</code> hoặc <code>DELETE</code> trên bảng, máy chủ phải cập nhật lại <strong>tất cả các Non-Clustered Index</strong> có liên quan! Một bảng giao dịch (OLTP) gắn 15-20 cái Index sẽ bị giảm tốc độ ghi từ 3 đến 5 lần và dễ xảy ra tranh chấp khóa (Lock Contention).</li>\n  <li><strong>Độ chọn lọc (Selectivity / Cardinality):</strong> Chỉ nên đánh Index đơn trên các cột có độ phân별 cao (như Mã khách hàng, Số điện thoại, Email, Ngày đặt). Đừng tạo một Index đơn lẻ chỉ chứa cột <code>GioiTinh</code> ('Nam'/'Nu') có phân bố 50%-50%, vì khi tìm 50% số dòng của bảng, trình tối ưu sẽ bỏ qua Index và chọn <em>Table Scan</em> luôn cho nhanh!</li>\n</ul>",
  "common_errors": [
    "Viết hàm bọc quanh cột được đánh Index ở vế trái mệnh đề WHERE (như WHERE CAST(NgayTao AS DATE) = '2025-01-01' hoặc WHERE LOWER(Username) = 'admin'), làm biến Index Seek thành Index Scan.",
    "Đặt thứ tự cột trong Composite Index ngược với câu truy vấn: Đánh Index trên (NgayDat, MaKH) nhưng câu truy vấn phổ biến nhất lại chỉ lọc WHERE MaKH = 123 (thiếu cột dẫn đầu NgayDat nên không Seek được).",
    "Cột dưới SQL Server là VARCHAR nhưng ORM (EF Core / Hibernate) mặc định gửi tham số kiểu NVARCHAR: Do NVARCHAR có độ ưu tiên kiểu dữ liệu cao hơn VARCHAR, SQL Server phải ép kiểu toàn bộ cột VARCHAR lên NVARCHAR (CONVERT_IMPLICIT) trên từng dòng!",
    "Lạm dụng toán tử OR giữa hai cột khác nhau (ví dụ WHERE Email = @q OR SoDT = @q): Trình tối ưu thường khó gộp 2 Index hoặc phải quét bảng; có thể tách thành 2 câu SELECT dùng Index Seek nối nhau bằng UNION.",
    "Quên đánh Index cho các cột Khóa ngoại (Foreign Key), dẫn tới mỗi lần JOIN hoặc mỗi lần xóa một dòng ở bảng cha thì máy chủ phải quét toàn bộ bảng con để kiểm tra ràng buộc."
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "Clustered Index và Non-Clustered Index khác nhau như thế nào? Một bảng có tối đa bao nhiêu Clustered Index và bao nhiêu Non-Clustered Index?",
      "a_short": "Clustered Index sắp xếp vật lý chính các dòng dữ liệu của bảng tại tầng lá nên mỗi bảng chỉ có tối đa 1 Clustered Index. Non-Clustered Index là cấu trúc tách rời lưu khóa kèm con trỏ trỏ về dòng dữ liệu gốc nên một bảng có thể có nhiều Non-Clustered Index.",
      "a_long": "Hãy hình dung Clustered Index như cuốn danh bạ điện thoại được in theo đúng thứ tự tên: khi bạn tra tới trang lá của cây B-Tree, toàn bộ thông tin của bản ghi đã nằm ngay tại đó. Vì các dòng của một bảng vật lý chỉ có thể sắp xếp theo một trật tự duy nhất nên chỉ có tối đa 1 Clustered Index/bảng. Ngược lại, Non-Clustered Index lưu một cây B-Tree riêng chỉ chứa các cột được đánh Index và giá trị khóa Clustered Index (hoặc địa chỉ dòng RID). Do đó một bảng có thể tạo nhiều Non-Clustered Index để phục vụ các tiêu chí tìm kiếm khác nhau."
    },
    {
      "level": "Junior",
      "q": "Giả sử bảng Orders có một Composite Index đánh trên 3 cột theo thứ tự (CustomerId, Status, OrderDate). Hãy cho biết những câu truy vấn nào sau đây tận dụng được Index Seek: (1) WHERE CustomerId = 5; (2) WHERE Status = 'PAID'; (3) WHERE CustomerId = 5 AND OrderDate = '2025-01-01'?",
      "a_short": "Câu (1) dùng được Index Seek đầy đủ. Câu (2) KHÔNG dùng được Index Seek vì thiếu cột dẫn đầu CustomerId. Câu (3) chỉ dùng Index Seek được trên cột đầu CustomerId = 5, còn cột OrderDate phải lọc quét tiếp vì bị khuyết cột đứng giữa là Status.",
      "a_long": "Theo quy tắc Tiền tố trái nhất (Leftmost Prefix Rule) của B-Tree: dữ liệu trong Index được sắp xếp theo CustomerId trước; nếu cùng CustomerId mới sắp xếp theo Status; nếu cùng cả hai mới sắp xếp theo OrderDate. Vì vậy: (1) Tìm theo CustomerId dùng Seek hoàn hảo. (2) Tìm chỉ theo Status không biết bắt đầu từ nhánh nào của CustomerId nên không thể Seek. (3) Tìm theo CustomerId và OrderDate sẽ Seek tới đúng nhánh CustomerId = 5, nhưng vì bỏ qua Status nên các giá trị OrderDate bên trong CustomerId = 5 không nằm liền mạch nhau, máy chủ phải đọc hết các dòng của CustomerId = 5 để kiểm tra OrderDate (Residual Predicate)."
    },
    {
      "level": "Mid",
      "q": "Key Lookup (hoặc RID Lookup) trong Execution Plan của SQL Server là gì, khi nào nó trở thành điểm nghẽn hiệu năng và có những cách nào để loại bỏ nó?",
      "a_short": "Key Lookup là thao tác máy chủ phải nhảy từ tầng lá của Non-Clustered Index sang Clustered Index để lấy thêm các cột còn thiếu trong SELECT/WHERE. Nó gây nghẽn nặng khi số dòng thỏa mãn lớn (hàng nghìn lần đọc ngẫu nhiên). Cách loại bỏ: chỉ SELECT đúng cột cần thiết hoặc thêm các cột thiếu vào mệnh đề INCLUDE của Non-Clustered Index.",
      "a_long": "Khi một Non-Clustered Index không chứa đủ tất cả các cột mà câu truy vấn yêu cầu, với mỗi dòng tìm được qua Index Seek, SQL Server phải dùng Nested Loops gọi một thao tác Key Lookup sang bảng chính (Clustered Index) theo khóa chính. Nếu câu lệnh chỉ trả về 5-10 dòng, Key Lookup rất nhanh. Nhưng nếu thống kê bị lệch khiến câu lệnh trả về 50.000 dòng, 50.000 lần đọc trang ngẫu nhiên (Random I/O) sẽ làm Logical Reads tăng vọt gấp hàng chục lần so với việc quét thẳng bảng một lần. Giải pháp triệt để là bỏ thói quen SELECT * và dùng CREATE INDEX ... INCLUDE (CacCotPhu) để biến nó thành Covering Index."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 8.1: Chuyển câu truy vấn lọc năm từ Non-Sargable sang Sargable",
      "problem": "Trên CSDL Auto Shop, một lập trình viên viết câu lệnh tìm nhân viên vào làm từ năm 2010 đến hết năm 2019 bằng hàm cắt chuỗi SUBSTR(HireDate, 1, 4) BETWEEN '2010' AND '2019' làm mất tác dụng của Index. Hãy viết lại câu truy vấn chuẩn Sargable (so sánh trực tiếp cột HireDate với mốc đầu '2010-01-01' và mốc cuối '2019-12-31') lấy ra Id, FName, LName, HireDate, Salary sắp xếp theo HireDate tăng dần.",
      "intuition": "Giữ nguyên cột HireDate đứng một mình ở vế trái: WHERE HireDate >= '2010-01-01' AND HireDate <= '2019-12-31'.",
      "trace": "Trong bảng Employees, các nhân viên vào làm giai đoạn 2010-2019 là Johnathon Smith ('2016-07-24') và William Morris ('2018-11-10').",
      "sql": "SELECT Id, FName, LName, HireDate, Salary\nFROM Employees\nWHERE HireDate >= '2010-01-01' AND HireDate <= '2019-12-31'\nORDER BY HireDate ASC;",
      "db": "autoshop",
      "expected": {
        "cols": [
          "Id",
          "FName",
          "LName",
          "HireDate",
          "Salary"
        ],
        "rows": [
          [
            4,
            "Johnathon",
            "Smith",
            "2016-07-24",
            500
          ],
          [
            5,
            "William",
            "Morris",
            "2018-11-10",
            800
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Không bọc bất kỳ hàm nào quanh cột HireDate. So sánh trực tiếp với chuỗi ngày chuẩn ISO 'YYYY-MM-DD'.",
        "SELECT Id, FName, LName, HireDate, Salary FROM Employees WHERE HireDate >= '2010-01-01' AND ... ORDER BY HireDate ASC;",
        "SELECT Id, FName, LName, HireDate, Salary FROM Employees WHERE HireDate >= '2010-01-01' AND HireDate <= '2019-12-31' ORDER BY HireDate ASC;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 8.2: Viết lại biểu thức toán học trên cột để bảo toàn khả năng Index Seek",
      "problem": "Trên CSDL ShopOnline, thay vì viết WHERE DonGia * 2 > 10000 (nhân 2 trực tiếp vào cột DonGia làm hỏng khả năng dò Index trên cột DonGia), hãy chuyển vế toán học sang phía hằng số để tìm các sản phẩm có DonGia > 5000. Lấy MaSP, TenSP, DanhMuc, DonGia sắp xếp theo DonGia tăng dần.",
      "intuition": "Chuyển phép nhân * 2 sang vế phải thành phép chia 10000 / 2 = 5000: WHERE DonGia > 5000.",
      "trace": "Các sản phẩm có DonGia > 5000 là: 104 (6900), 103 (8500), 105 (32000).",
      "sql": "SELECT MaSP, TenSP, DanhMuc, DonGia\nFROM SanPham\nWHERE DonGia > 5000\nORDER BY DonGia ASC;",
      "db": "shoponline",
      "expected": {
        "cols": [
          "MaSP",
          "TenSP",
          "DanhMuc",
          "DonGia"
        ],
        "rows": [
          [
            104,
            "Tai Nghe Sony WH-1000XM5",
            "Am Thanh",
            6900
          ],
          [
            103,
            "Man Hinh Dell UltraSharp 27",
            "Man Hinh",
            8500
          ],
          [
            105,
            "Laptop ThinkPad X1 Carbon",
            "Laptop",
            32000
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Đưa mọi phép tính cộng trừ nhân chia sang phía hằng số bên phải dấu so sánh.",
        "SELECT MaSP, TenSP, DanhMuc, DonGia FROM SanPham WHERE DonGia > 5000 ORDER BY DonGia ASC;",
        "SELECT MaSP, TenSP, DanhMuc, DonGia FROM SanPham WHERE DonGia > 5000 ORDER BY DonGia ASC;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch08_p1",
      "title": "Thiết kế Covering Index và truy vấn tối ưu không cần bước Sort",
      "difficulty": "Khá",
      "db": "shoponline",
      "summary": "Trên CSDL ShopOnline, hãy tạo một chỉ mục có tên IX_SanPham_DanhMuc_DonGia trên bảng SanPham gồm 2 cột khóa (DanhMuc ASC, DonGia DESC) và cột bổ sung (TenSP) để phục vụ truy vấn lấy MaSP, TenSP, DonGia của các sản phẩm thuộc DanhMuc = 'Phu Kien' còn tồn kho (TonKho > 0), sắp xếp theo DonGia giảm dần. Hãy chạy lệnh CREATE INDEX kèm câu SELECT kết quả.",
      "understand": "Trong SQLite, ta đưa các cột cần phủ vào danh sách cột của Index: (DanhMuc, DonGia DESC, TonKho, TenSP). Sau đó chạy câu SELECT lấy MaSP, TenSP, DonGia WHERE DanhMuc = 'Phu Kien' AND TonKho > 0 ORDER BY DonGia DESC.",
      "brute": "Không tạo Index hoặc chỉ tạo Index đơn trên DanhMuc, bắt máy chủ phải đọc lại bảng gốc và thực hiện bước Sort theo DonGia DESC.",
      "optimal": "Tạo Composite Index có thứ tự khớp với mệnh đề WHERE (điều kiện bằng DanhMuc đứng trước) và ORDER BY (DonGia DESC đứng kế tiếp).",
      "trace": "Danh mục 'Phu Kien' có 4 SP (101, 102, 106, 107), nhưng SP 107 có TonKho = 0 nên bị loại. Còn lại 102 (2200), 101 (1800), 106 (350).",
      "sql": "CREATE INDEX IX_SanPham_DanhMuc_DonGia ON SanPham (DanhMuc, DonGia DESC, TonKho, TenSP);\nSELECT MaSP, TenSP, DonGia\nFROM SanPham\nWHERE DanhMuc = 'Phu Kien' AND TonKho > 0\nORDER BY DonGia DESC;",
      "expected": {
        "cols": [
          "MaSP",
          "TenSP",
          "DonGia"
        ],
        "rows": [
          [
            102,
            "Chuot Logitech MX Master 3S",
            2200
          ],
          [
            101,
            "Ban Phim Co Keychron K2",
            1800
          ],
          [
            106,
            "Gia Do Laptop Nhom",
            350
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Đặt cột so sánh khoảng (TonKho > 0) lên trước cột so sánh bằng (DanhMuc = 'Phu Kien') hoặc trước cột ORDER BY trong Index, làm gãy thứ tự sắp xếp của DonGia.",
      "note3": {
        "idea": "Thứ tự cột chuẩn khi tạo Composite Index: (1) Các cột lọc so sánh BẰNG (=) -> (2) Cột sắp xếp (ORDER BY) hoặc lọc KHOẢNG (>, <, BETWEEN) -> (3) Các cột hiển thị trong SELECT (đặt ở INCLUDE trong SQL Server/Postgres).",
        "syntax": "CREATE INDEX IX_Name ON Table (EqCol, SortOrRangeCol DESC) INCLUDE (SelectCols);",
        "trap": "Đặt cột lọc khoảng (Range) đứng trước cột lọc bằng (Equality) sẽ làm các cột đứng sau nó trong Index không thể dùng để Seek tiếp hoặc giữ thứ tự Sort."
      }
    }
  ],
  "summary_table": [
    [
      "Clustered Index",
      "Sắp xếp vật lý bảng dữ liệu tại tầng lá (tối đa 1/bảng)",
      "Nên chọn cột nhỏ gọn, duy nhất, tăng tuần tự (INT/BIGINT/UUIDv7)"
    ],
    [
      "Non-Clustered Index",
      "Cây B-Tree phụ trỏ về khóa Clustered Index",
      "Dùng INCLUDE (...) để tạo Covering Index tránh Key Lookup"
    ],
    [
      "Leftmost Prefix Rule",
      "Index (A, B, C) hỗ trợ tìm theo (A), (A, B), (A, B, C)",
      "Không thể Seek nếu điều kiện WHERE bỏ qua cột dẫn đầu A"
    ],
    [
      "Sargability",
      "Giữ cột được đánh Index đứng độc lập ở một vế so sánh",
      "Tránh bọc hàm YEAR(), UPPER(), ISNULL() lên cột trong WHERE"
    ],
    [
      "Execution Plan",
      "Bản đồ các toán tử vật lý thực thi câu truy vấn",
      "Chú ý cảnh báo Table Scan, Key Lookup lớn, Sort Spill, Implicit Conversion"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Tại sao việc đặt thêm các cột hiển thị vào mệnh đề INCLUDE (Col1, Col2) của Non-Clustered Index lại tốt hơn việc nhét tất cả chúng vào danh sách cột khóa chính của Index?",
      "a": "Vì các cột trong INCLUDE chỉ được lưu ở tầng lá (Leaf pages) chứ không lưu ở các trang gốc và trang nhánh của cây B-Tree, giúp kích thước khóa cây nhỏ gọn, giảm chiều cao cây và không tốn công sắp xếp theo các cột phụ đó."
    },
    {
      "q": "Câu 2: Trong hai điều kiện lọc WHERE TenSP LIKE 'Laptop%' và WHERE TenSP LIKE '%Laptop%', điều kiện nào có thể sử dụng B-Tree Index Seek?",
      "a": "Chỉ có WHERE TenSP LIKE 'Laptop%' (dấu % ở cuối) mới dùng được Index Seek vì nó giữ nguyên tiền tố bên trái của chuỗi. LIKE '%Laptop%' buộc phải quét toàn bộ Index/Bảng."
    },
    {
      "q": "Câu 3: Khi bạn tạo một ràng buộc FOREIGN KEY trên cột MaKH của bảng DonHang trong SQL Server hoặc PostgreSQL, hệ quản trị CSDL có tự động tạo Index cho cột MaKH đó không?",
      "a": "KHÔNG! SQL Server và PostgreSQL chỉ tự động tạo Index cho PRIMARY KEY và UNIQUE, bạn bắt buộc phải tự viết lệnh CREATE INDEX cho các cột FOREIGN KEY."
    }
  ]
});
