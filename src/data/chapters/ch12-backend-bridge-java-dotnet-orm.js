/**
 * FILE: src/data/chapters/ch12-backend-bridge-java-dotnet-orm.js
 * MÔ TẢ: Chương 12 - Cầu Nối Ứng Dụng Backend (Java & .NET): ORM, N+1 Query, Connection Pool & Migration
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch12",
  "code": "Chương 12",
  "title": "Cầu Nối Ứng Dụng Backend (Java & .NET): ORM, N+1 Query, Connection Pool & Migration",
  "sources": [
    "Bổ sung kiến thức thực chiến Backend Java (JDBC, Hibernate/JPA) & .NET (ADO.NET, Dapper, EF Core)"
  ],
  "goals": [
    "So sánh kiến trúc truy cập dữ liệu giữa Low-level Driver (JDBC / ADO.NET), Micro-ORM (JdbcTemplate, Jdbi / Dapper) và Full ORM (Hibernate/JPA / EF Core).",
    "Nhận diện tận gốc căn bệnh kinh niên 'N+1 Query Problem' trong ORM và nắm vững 3 cách chữa trị (JOIN FETCH / Include, EntityGraph, Batch Fetching / Split Query).",
    "Hiểu cơ chế hoạt động của Connection Pool (HikariCP / SqlClient Pool) và công thức tính kích thước Pool tối ưu tránh làm nghẽn DB.",
    "Nắm vững quy trình quản lý phiên bản lược đồ CSDL (Database Migration với Flyway/Liquibase và EF Core Migrations) theo nguyên tắc Expand-and-Contract."
  ],
  "signals": [
    "Một API chỉ trả về 50 bản ghi nhưng khi bật log SQL thấy Hibernate / EF Core bắn ra 51 hoặc 101 câu lệnh SELECT liên tiếp.",
    "Hệ thống giờ cao điểm báo lỗi 'HikariPool-1 - Connection is not available, request timed out after 30000ms' hoặc 'Timeout expired. The timeout period elapsed prior to obtaining a connection from the pool'.",
    "Đi phỏng vấn vị trí Backend Java / .NET: 'Khi nào bạn dùng Dapper/JdbcTemplate, khi nào dùng EF Core/Hibernate? Làm sao tối ưu truy vấn chỉ đọc?'."
  ],
  "theory": "<h3>12.1. Ba tầng công cụ kết nối CSDL trong hệ sinh thái Java và .NET</h3>\n<p>Một kiến trúc sư phần mềm giỏi không cực đoan \"chỉ dùng ORM\" hay \"tẩy chay ORM\", mà kết hợp đúng công cụ cho đúng tác vụ (thường theo mô hình <strong>CQRS</strong>: dùng Full ORM cho luồng Ghi nghiệp vụ phức tạp, và dùng Micro-ORM hoặc DTO Projection cho luồng Đọc báo cáo tốc độ cao):</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Phân tầng</th>\n      <th>Đại diện bên Java</th>\n      <th>Đại diện bên .NET (C#)</th>\n      <th>Đặc điểm &amp; Khi nào nên dùng?</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>1. Trình điều khiển cấp thấp (Low-level)</strong></td>\n      <td><strong>JDBC</strong> (<code>Connection</code>, <code>PreparedStatement</code>, <code>ResultSet</code>)</td>\n      <td><strong>ADO.NET</strong> (<code>SqlConnection</code>, <code>SqlCommand</code>, <code>SqlDataReader</code>)</td>\n      <td>Tốc độ nhanh nhất, kiểm soát từng byte bộ nhớ nhưng phải viết nhiều code lặp (boilerplate). Mọi thư viện cấp cao đều chạy trên nền tảng này.</td>\n    </tr>\n    <tr>\n      <td><strong>2. Micro-ORM / SQL Mapper</strong></td>\n      <td><strong>Spring JdbcClient / JdbcTemplate</strong>, <strong>MyBatis</strong>, <strong>Jdbi</strong></td>\n      <td><strong>Dapper</strong></td>\n      <td>Bạn tự viết câu lệnh SQL tối ưu, thư viện giúp truyền tham số an toàn và tự động ánh xạ dòng kết quả sang đối tượng DTO/Record. Cực kỳ nhẹ và nhanh!</td>\n    </tr>\n    <tr>\n      <td><strong>3. Full ORM (Object-Relational Mapper)</strong></td>\n      <td><strong>Hibernate / Spring Data JPA</strong></td>\n      <td><strong>Entity Framework Core (EF Core)</strong></td>\n      <td>Quản lý vòng đời đối tượng (Persistence Context / Change Tracker), tự động phát hiện thay đổi (Dirty Checking) để sinh lệnh INSERT/UPDATE/DELETE, hỗ trợ LinQ/JPQL.</td>\n    </tr>\n  </tbody>\n</table>\n\n<h3>12.2. Giải phẫu căn bệnh kinh điển: N+1 Query Problem và Multiple Bag Fetch</h3>\n<ul>\n  <li><strong>N+1 Query là gì?</strong> Giả sử bạn truy vấn danh sách <code>N = 20</code> Đơn hàng: <code>SELECT * FROM DonHang LIMIT 20</code> (tốn <strong>1 câu query</strong>). Sau đó trong vòng lặp chuyển đổi sang JSON, code gọi <code>donHang.getKhachHang().getHoTen()</code>. Vì quan hệ <code>@ManyToOne</code> / <code>@OneToMany</code> đang để chế độ tải trễ (<strong>Lazy Loading</strong>), ORM sẽ âm thầm bắn thêm <strong>20 câu query con</strong> <code>SELECT * FROM KhachHang WHERE MaKH = ?</code> cho từng đơn hàng! Tổng cộng tốn <strong>1 + 20 = 21 lần đi về qua mạng (Network Round-trips)</strong>!</li>\n  <li><strong>Cách chữa trị N+1 và cái bẫy Cartesian Explosion khi JOIN nhiều bảng con:</strong>\n    <ol>\n      <li>Nếu chỉ nối 1 bảng con (hoặc quan hệ <code>ManyToOne / OneToOne</code>): Dùng <strong><code>LEFT JOIN FETCH</code> / <code>@EntityGraph</code> (Java JPA)</strong> hoặc <strong><code>.Include()</code> (.NET EF Core)</strong> để gộp thành 1 câu SQL duy nhất.</li>\n      <li>Nếu một bảng Cha cần lấy cùng lúc <strong>2 danh sách con độc lập</strong> (ví dụ lấy <code>Khoa</code> kèm cả danh sách <code>SinhViens</code> và danh sách <code>MonHocs</code>): Nếu dùng <code>JOIN FETCH</code> cả hai trong 1 câu SQL, một khoa có 100 SV và 20 môn học sẽ tạo ra <code>100 * 20 = 2.000 dòng</code> nhân chéo (trong Hibernate sẽ ném lỗi <code>MultipleBagFetchException</code>)! Lúc này phải dùng <strong>Split Query (<code>.AsSplitQuery()</code> trong EF Core)</strong> hoặc <strong>Batch Fetching (<code>@BatchSize(size = 50)</code> trong Hibernate)</strong> để tách thành 2 câu query gọn gàng dùng toán tử <code>WHERE MaKhoa IN (...)</code>!</li>\n    </ol>\n  </li>\n</ul>\n\n<h3>12.3. Connection Pool (Hồ chứa kết nối) và Tracking Overhead</h3>\n<ul>\n  <li><strong>Tại sao bắt buộc phải có Connection Pool (HikariCP trong Spring Boot / SqlClient Pool trong .NET)?</strong> Mở mới một kết nối vật lý tới CSDL đòi hỏi: (1) Bắt tay 3 bước TCP/IP, (2) Thương lượng mã hóa TLS/SSL, (3) Xác thực tài khoản/mật khẩu DB, (4) Cấp phát phiên làm việc (Session memory). Quá trình này mất từ <strong>15ms đến 50ms</strong>, lâu hơn gấp chục lần bản thân câu lệnh SQL (chỉ mất 1ms)! Connection Pool giữ sẵn một số lượng kết nối vật lý luôn mở; khi code gọi <code>conn.close()</code> hoặc <code>Dispose()</code>, kết nối <strong>không bị đóng thật</strong> mà được trả về hồ chứa cho request sau dùng lại ngay lập tức.</li>\n  <li><strong>Kích thước Connection Pool bao nhiêu là tối ưu?</strong> Nhiều người tưởng đặt <code>maximumPoolSize = 500</code> sẽ chịu tải tốt hơn <code>20</code>. Thực tế trên máy chủ DB có 8 nhân CPU, việc 500 kết nối cùng chạy song song sẽ làm CPU tốn toàn bộ thời gian vào việc chuyển ngữ cảnh (<em>Context Switching</em>) và tranh chấp khóa! Công thức thực nghiệm nổi tiếng của nhóm phát triển HikariCP/PostgreSQL là: <strong><code>Pool Size = (Số nhân CPU của DB * 2) + Số ổ đĩa hiệu dụng</code></strong> (thường chỉ từ <strong>10 đến 30 kết nối</strong> cho mỗi instance ứng dụng!).</li>\n  <li><strong>Luôn tắt Change Tracking cho các truy vấn chỉ đọc (Read-Only Queries):</strong> Khi đọc danh sách dữ liệu chỉ để trả về API mà không cần sửa đổi, hãy gắn <strong><code>@Transactional(readOnly = true)</code> (trong Spring JPA)</strong> hoặc <strong><code>.AsNoTracking()</code> (trong C# EF Core)</strong>. Việc này giúp ORM không phải tạo bản sao (Snapshot) của từng đối tượng trong RAM để so sánh Dirty Checking, giảm ngay 30-40% bộ nhớ cấp phát và tăng tốc độ đọc rõ rệt!</li>\n</ul>",
  "mechanism": "<h3>Chạy tay từng bước: So sánh luồng bộ nhớ khi Có Tracking vs Không Tracking (Read-Only / AsNoTracking)</h3>\n<div class=\"trace-steps\">\n  <div class=\"trace-step\"><strong>Kịch bản 1 - Truy vấn mặc định có Change Tracking (Dirty Checking bật):</strong>\n    <ol>\n      <li>Đọc 1.000 dòng từ <code>ResultSet / SqlDataReader</code>.</li>\n      <li>Khởi tạo 1.000 đối tượng Entity trả về cho lập trình viên.</li>\n      <li>Đồng thời tạo thêm <strong>1.000 bản sao trạng thái gốc (Original Values Snapshot)</strong> lưu vào bên trong <code>PersistenceContext (Hibernate)</code> hoặc <code>ChangeTracker (EF Core)</code>.</li>\n      <li>Khi kết thúc hàm hoặc gọi <code>flush() / SaveChanges()</code>, ORM phải quét qua toàn bộ 1.000 đối tượng để so sánh từng thuộc tính với bản sao gốc xem có gì thay đổi không!</li>\n    </ol>\n  </div>\n  <div class=\"trace-step\"><strong>Kịch bản 2 - Dùng DTO Projection hoặc <code>@Transactional(readOnly = true)</code> / <code>.AsNoTracking()</code>:</strong>\n    <ol>\n      <li>Đọc 1.000 dòng từ DB và khởi tạo thẳng 1.000 đối tượng kết quả.</li>\n      <li><strong>Bỏ qua hoàn toàn</strong> việc lưu bản sao Snapshot và tắt hoàn toàn bước quét Dirty Checking lúc kết thúc! Nhanh hơn và tiết kiệm một nửa bộ nhớ Heap.</li>\n    </ol>\n  </div>\n</div>",
  "examples": [
    {
      "title": "Ví dụ 12.1: Hiện tượng N+1 Query (1 câu lấy danh sách Cha + N câu lấy danh sách Con) vs 1 câu JOIN gộp",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "-- Thay vì chạy 1 câu lấy 6 KhachHang rồi lặp 6 vòng chạy 6 câu lấy DonHang của từng người (Tổng = 7 câu SQL),\n-- câu truy vấn chuẩn của JOIN FETCH / Include() hoặc Projection lấy toàn bộ trong 1 lần gọi:\nSELECT kh.MaKH, kh.HoTen, dh.MaDH, dh.NgayDat, dh.TrangThai\nFROM KhachHang AS kh\nLEFT JOIN DonHang AS dh ON kh.MaKH = dh.MaKH\nORDER BY kh.MaKH ASC, dh.MaDH ASC;",
      "result": {
        "cols": [
          "MaKH",
          "HoTen",
          "MaDH",
          "NgayDat",
          "TrangThai"
        ],
        "rows": [
          [
            1,
            "Nguyen Van An",
            1001,
            "2024-01-05",
            "HOAN_THANH"
          ],
          [
            1,
            "Nguyen Van An",
            1003,
            "2024-02-01",
            "HOAN_THANH"
          ],
          [
            1,
            "Nguyen Van An",
            1007,
            "2024-03-25",
            "HOAN_THANH"
          ],
          [
            2,
            "Tran Thi Binh",
            1002,
            "2024-01-12",
            "HOAN_THANH"
          ],
          [
            2,
            "Tran Thi Binh",
            1006,
            "2024-03-10",
            "DANG_GIAO"
          ],
          [
            3,
            "Le Hoang Cuong",
            1004,
            "2024-02-15",
            "DA_HUY"
          ],
          [
            4,
            "Pham Minh Dung",
            1005,
            "2024-03-02",
            "HOAN_THANH"
          ],
          [
            5,
            "Vo Thi Em",
            null,
            null,
            null
          ],
          [
            6,
            "Hoang Gia Huy",
            null,
            null,
            null
          ]
        ]
      },
      "note": "Khi ORM bật Lazy Loading trên thuộc tính danh sách con (kh.getDonHangs()), việc lặp qua N khách hàng sẽ bắn N câu SELECT con xuống DB. Gộp bằng LEFT JOIN (hoặc WHERE MaKH IN (...)) giảm từ N+1 câu xuống chỉ còn 1-2 câu!"
    },
    {
      "title": "Ví dụ 12.2: Giải pháp Batch Fetching (WHERE FK IN (...)) tránh nhân bản dữ liệu Cartesian Explosion",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "-- Bước 1: Lấy 3 khách hàng ở trang 1: MaKH IN (1, 2, 3)\n-- Bước 2: Dùng 1 câu lệnh duy nhất với toán tử IN để nạp toàn bộ đơn hàng của 3 khách đó:\nSELECT MaDH, MaKH, NgayDat, TrangThai, PhiShip\nFROM DonHang\nWHERE MaKH IN (1, 2, 3)\nORDER BY MaKH ASC, NgayDat DESC;",
      "result": {
        "cols": [
          "MaDH",
          "MaKH",
          "NgayDat",
          "TrangThai",
          "PhiShip"
        ],
        "rows": [
          [
            1007,
            1,
            "2024-03-25",
            "HOAN_THANH",
            0
          ],
          [
            1003,
            1,
            "2024-02-01",
            "HOAN_THANH",
            25
          ],
          [
            1001,
            1,
            "2024-01-05",
            "HOAN_THANH",
            30
          ],
          [
            1006,
            2,
            "2024-03-10",
            "DANG_GIAO",
            30
          ],
          [
            1002,
            2,
            "2024-01-12",
            "HOAN_THANH",
            0
          ],
          [
            1004,
            3,
            "2024-02-15",
            "DA_HUY",
            40
          ]
        ]
      },
      "note": "Đây chính là câu SQL mà Hibernate (@BatchSize) hoặc EF Core (.AsSplitQuery()) sinh ra để vừa tránh lỗi N+1 vừa tránh bùng nổ dòng khi một đối tượng cha có nhiều danh sách con!"
    },
    {
      "title": "Ví dụ 12.3: Bảng quản lý lịch sử Migration tự động (tương tự Flyway schema_version / EF __EFMigrationsHistory)",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "CREATE TABLE __SchemaMigrationsHistory (\n    MigrationId VARCHAR(150) NOT NULL PRIMARY KEY,\n    ProductVersion VARCHAR(32) NOT NULL,\n    Checksum VARCHAR(64) NOT NULL,\n    AppliedAt DATETIME NOT NULL DEFAULT '2025-01-01 08:00:00'\n);\nINSERT INTO __SchemaMigrationsHistory (MigrationId, ProductVersion, Checksum)\nVALUES ('20250101_001_InitShopSchema', '8.0.10', 'a1b2c3d4'),\n       ('20250115_002_AddVoucherTable', '8.0.10', 'e5f6g7h8');\nSELECT * FROM __SchemaMigrationsHistory ORDER BY MigrationId;",
      "result": {
        "cols": [
          "MigrationId",
          "ProductVersion",
          "Checksum",
          "AppliedAt"
        ],
        "rows": [
          [
            "20250101_001_InitShopSchema",
            "8.0.10",
            "a1b2c3d4",
            "2025-01-01 08:00:00"
          ],
          [
            "20250115_002_AddVoucherTable",
            "8.0.10",
            "e5f6g7h8",
            "2025-01-01 08:00:00"
          ]
        ]
      },
      "note": "Cả Flyway/Liquibase (Java) lẫn EF Core Migrations (.NET) đều tạo một bảng metadata như trên trong DB để biết những kịch bản DDL nào đã chạy, đảm bảo tính nhất quán giữa môi trường Dev, Staging và Production."
    },
    {
      "title": "Ví dụ 12.4: Theo dõi các kết nối đang mở trong Connection Pool trên SQL Server bằng DMV sys.dm_exec_sessions",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "SELECT program_name AS UngDung,\n       login_name AS TaiKhoan,\n       status AS TrangThai,\n       COUNT(*) AS SoKetNoiDangMo\nFROM sys.dm_exec_sessions\nWHERE is_user_process = 1\nGROUP BY program_name, login_name, status;",
      "result": {
        "cols": [
          "UngDung",
          "TaiKhoan",
          "TrangThai",
          "SoKetNoiDangMo"
        ],
        "rows": [
          [
            "HikariPool-1 (Spring Boot)",
            "app_user",
            "sleeping",
            9
          ],
          [
            "HikariPool-1 (Spring Boot)",
            "app_user",
            "running",
            1
          ],
          [
            "Core Microsoft SqlClient (.NET)",
            "app_user",
            "sleeping",
            12
          ]
        ]
      },
      "note": "Các kết nối ở trạng thái 'sleeping' không phải bị lỗi rò rỉ mà là các kết nối đang nằm sẵn trong Connection Pool chờ phục vụ request tiếp theo mà không tốn chi phí bắt tay TCP + xác thực lại! (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    }
  ],
  "dialects": [
    [
      "Chuỗi kết nối (Connection String)",
      "jdbc:sqlserver://localhost:1433;databaseName=Shop;encrypt=true;trustServerCertificate=true",
      "jdbc:mysql://localhost:3306/shop?rewriteBatchedStatements=true",
      "jdbc:postgresql://localhost:5432/shop?reWriteBatchedInserts=true"
    ],
    [
      "Bật gộp gói Batch Insert ở Driver",
      "Thêm bulkCopyForBatchInsert=true hoặc dùng SQLServerBulkCopy",
      "Bắt buộc thêm rewriteBatchedStatements=true vào URL!",
      "Bắt buộc thêm reWriteBatchedInserts=true vào URL!"
    ],
    [
      "Công cụ quản lý Migration phổ biến",
      "Flyway, Liquibase, EF Core Migrations, SSDT (SQL Server Data Tools)",
      "Flyway, Liquibase, Prisma/Knex",
      "Flyway, Liquibase, EF Core, Alembic"
    ]
  ],
  "bridge_java": "// [Java - Spring Boot + JPA/Hibernate] 3 kỹ thuật vàng: EntityGraph trị N+1, Read-Only Transaction và DTO Record Projection\n\n// 1. Dùng @EntityGraph để nạp luôn danh sách con trong 1 câu LEFT JOIN mà không cần viết lại câu JPQL:\npublic interface DonHangRepository extends JpaRepository<DonHang, Integer> {\n    @EntityGraph(attributePaths = {\"khachHang\", \"chiTietDons\"})\n    List<DonHang> findByTrangThai(String trangThai);\n\n    // 2. Dùng Java record làm DTO Projection trực tiếp trong câu query:\n    @Query(\"SELECT new com.bikip.dto.DonHangTomTatDto(d.maDh, k.hoTen, d.ngayDat) FROM DonHang d JOIN d.khachHang k WHERE d.trangThai = :tt\")\n    List<DonHangTomTatDto> layTomTatTheoTrangThai(@Param(\"tt\") String trangThai);\n}\n\n// 3. Ở tầng Service, luôn gắn readOnly = true cho các hàm truy vấn:\n@Transactional(readOnly = true)\npublic List<DonHangTomTatDto> xemDanhSach(String trangThai) {\n    return donHangRepo.layTomTatTheoTrangThai(trangThai);\n}",
  "bridge_csharp": "// [C# - .NET 8/9 EF Core & Dapper] Tối ưu truy vấn với AsNoTracking, AsSplitQuery và Dapper\n\n// 1. Khi chỉ đọc dữ liệu trong EF Core, luôn dùng .AsNoTracking() hoặc chiếu thẳng sang DTO bằng .Select():\nvar danhSach = await dbContext.DonHangs\n    .AsNoTracking()\n    .Where(d => d.TrangThai == \"HOAN_THANH\")\n    .Select(d => new DonHangTomTatDto(d.MaDH, d.KhachHang.HoTen, d.NgayDat))\n    .ToListAsync(); // Lưu ý: Khi đã dùng .Select() sang DTO không phải Entity, EF Core tự động không track!\n\n// 2. Khi cần Include từ 2 danh sách con trở lên, dùng .AsSplitQuery() để tránh nhân bản dòng (Cartesian Explosion):\nvar khoaChiTiet = await dbContext.Khoas\n    .AsNoTracking()\n    .Include(k => k.SinhViens)\n    .Include(k => k.MonHocs)\n    .AsSplitQuery() // Chia thành 3 câu SELECT gọn nhẹ thay vì 1 câu JOIN khổng lồ!\n    .FirstOrDefaultAsync(k => k.MaKhoa == \"CNTT\");\n\n// 3. Kết hợp Transaction giữa EF Core và Dapper trên cùng 1 DbConnection:\nvar conn = dbContext.Database.GetDbConnection();\nvar stats = await conn.QueryAsync<ThongKeDto>(\n    \"SELECT MaKhoa, COUNT(*) AS SoSV FROM SinhVien GROUP BY MaKhoa\",\n    transaction: dbContext.Database.CurrentTransaction?.GetDbTransaction());",
  "performance": "<ul>\n  <li><strong>Bí mật tăng tốc Batch Insert gấp 10 lần trên PostgreSQL và MySQL:</strong> Kể cả khi bạn đã bật <code>hibernate.jdbc.batch_size = 50</code>, nếu quên thêm tham số <code>reWriteBatchedInserts=true</code> (trên PostgreSQL JDBC) hoặc <code>rewriteBatchedStatements=true</code> (trên MySQL JDBC), trình điều khiển vẫn gửi 50 lệnh <code>INSERT INTO ... VALUES (?)</code> rời rạc trong gói tin! Khi bật cờ này lên, JDBC Driver sẽ tự động gộp 50 câu đó thành 1 câu multi-values <code>INSERT INTO ... VALUES (..), (..), (..)</code> nhanh hơn gấp 5 đến 10 lần!</li>\n  <li><strong>Quy tắc Zero-Downtime Database Migration (Expand and Contract):</strong> Khi hệ thống đang chạy nhiều máy chủ ứng dụng (Kubernetes Pods) không ngừng nghỉ, nếu bạn chạy một bản Migration đổi tên cột <code>ALTER TABLE RENAME COLUMN HoTen TO FullName</code>, các Pod code cũ đang chạy sẽ chết ngay lập tức vì không tìm thấy cột <code>HoTen</code>! Quy trình chuẩn phải chia làm 3 bước triển khai: (1) <em>Expand:</em> Thêm cột mới <code>FullName</code> cho phép NULL, code ghi song song vào cả 2 cột và chép dữ liệu cũ sang. (2) Chuyển code sang đọc hoàn toàn từ <code>FullName</code>. (3) <em>Contract:</em> Xóa cột cũ <code>HoTen</code> ở bản phát hành sau.</li>\n</ul>",
  "common_errors": [
    "Để nguyên cấu hình mặc định spring.jpa.open-in-view=true (OSIV - Open Session In View) trong Spring Boot: Khiến kết nối CSDL bị giữ mở suốt quá trình Controller render JSON cho tới tận lúc trả xong HTTP Response, làm cạn kiệt HikariCP Connection Pool dưới tải cao!",
    "Gọi .ToList() quá sớm trong C# LINQ (ví dụ dbContext.DonHangs.ToList().Where(d => d.MaKH == 1)): Việc gọi .ToList() trước .Where() làm EF Core kéo toàn bộ 1 triệu dòng của bảng DonHangs từ DB về RAM rồi mới lọc bằng C#!",
    "Không đóng ResultSet / Connection khi dùng JDBC hoặc ADO.NET thuần mà không đặt trong khối try-with-resources (Java) hoặc using / await using (C#), gây rò rỉ kết nối (Connection Leak) làm sập ứng dụng sau vài phút.",
    "Bật Eager Loading (FetchType.EAGER) cứng trên mọi mối quan hệ trong class Entity của JPA: Khiến bất kỳ câu truy vấn đơn giản nào chạm vào Entity đó cũng kéo theo hàng chục bảng liên quan bằng một rừng câu lệnh LEFT JOIN.",
    "Sửa trực tiếp một file SQL Migration cũ đã từng chạy trên môi trường Staging/Production trong Flyway: Làm lệch mã băm (Checksum mismatch) khiến ứng dụng từ chối khởi động!"
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "Trong C# Entity Framework Core, sự khác nhau giữa IEnumerable<T> và IQueryable<T> khi truy vấn dữ liệu là gì?",
      "a_short": "IQueryable<T> xây dựng cây biểu thức (Expression Tree) để dịch các toán tử lọc/sắp xếp (.Where, .OrderBy, .Take) thành câu lệnh SQL chạy dưới Database. IEnumerable<T> thực thi lọc ngay trong bộ nhớ RAM của ứng dụng (Client-side evaluation) sau khi đã kéo dữ liệu từ DB về.",
      "a_long": "Nếu bạn gán bảng dữ liệu vào IQueryable<T> rồi nối tiếp .Where(x => x.Salary > 500).Take(10), EF Core sẽ dịch toàn bộ thành SELECT TOP(10) ... WHERE Salary > 500 gửi xuống SQL Server, chỉ lấy đúng 10 dòng qua mạng. Ngược lại, nếu bạn ép sang IEnumerable<T> (hoặc gọi .AsEnumerable() / .ToList() trước khi lọc), EF Core sẽ chạy SELECT * FROM Employees kéo toàn bộ 1 triệu dòng về RAM của máy chủ web rồi mới dùng CPU của web để lọc lấy 10 dòng, gây tràn bộ nhớ (OutOfMemoryException)."
    },
    {
      "level": "Junior",
      "q": "N+1 Query Problem trong Hibernate/JPA và EF Core là gì? Hãy nêu ít nhất 3 cách để phát hiện và khắc phục nó.",
      "a_short": "N+1 xảy ra khi ứng dụng chạy 1 câu SQL để lấy N bản ghi cha, sau đó do Lazy Loading lại chạy thêm N câu SQL riêng lẻ để lấy dữ liệu bảng con cho từng bản ghi cha. Ba cách khắc phục: (1) Dùng JOIN FETCH (JPA) hoặc .Include() (EF Core); (2) Dùng @EntityGraph hoặc DTO Projection; (3) Dùng @BatchSize (Hibernate) hoặc .AsSplitQuery() (EF Core).",
      "a_long": "Cách phát hiện sớm: Bật log SQL trên môi trường Dev hoặc tích hợp thư viện phát hiện tự động (như datasource-proxy / QuickPerf trong Java, hoặc MiniProfiler / EF Core Logging trong .NET) để đếm số câu query trong 1 HTTP Request. Cách khắc phục tùy tình huống: Nếu chỉ cần vài cột để hiển thị, dùng DTO Projection (SELECT new Dto(...) hoặc .Select(x => new Dto{...})) là nhanh nhất. Nếu cần nạp đầy đủ Entity kèm 1 quan hệ con, dùng LEFT JOIN FETCH / .Include(). Nếu cần nạp nhiều danh sách con hoặc đang phân trang, dùng @BatchSize(size = 50) hoặc .AsSplitQuery() để gom N câu lẻ thành 1 câu WHERE parent_id IN (?, ?, ...)."
    },
    {
      "level": "Mid",
      "q": "Tại sao cấu hình mặc định spring.jpa.open-in-view=true (OSIV) trong Spring Boot lại bị coi là một Anti-pattern đối với các hệ thống chịu tải cao?",
      "a_short": "Vì OSIV giữ Hibernate Session và có thể giữ luôn kết nối DB (JDBC Connection) mở xuyên suốt từ tầng Controller cho tới khi trả xong JSON về cho trình duyệt, làm giảm nghiêm trọng thông lượng (Throughput) của Connection Pool.",
      "a_long": "OSIV được bật mặc định để giúp lập trình viên mới không gặp lỗi LazyInitializationException khi truy cập thuộc tính Lazy ở tầng Controller/View sau khi hàm @Transactional ở Service đã kết thúc. Tuy nhiên, cái giá phải trả rất đắt: (1) Kết nối DB sau khi được mượn ở Service sẽ không được trả về HikariCP ngay khi xong Transaction mà bị giữ lại cho tới khi HTTP Response gửi xong qua mạng chậm của người dùng; (2) Các câu query N+1 phát sinh ở tầng Jackson JSON Serializer chạy ở chế độ Auto-commit ngoài Transaction, vừa chậm vừa thiếu nhất quán. Best practice là đặt spring.jpa.open-in-view=false và chuẩn bị đầy đủ dữ liệu (qua DTO hoặc JOIN FETCH) ngay bên trong tầng Service."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 12.1: Viết câu truy vấn DTO Projection phẳng thay vì nạp toàn bộ Entity nặng nề",
      "problem": "Trên CSDL Auto Shop, màn hình danh sách xe đang sửa chỉ cần hiển thị 4 thông tin: CarId (Cars.Id), Model, Status và CustomerName (Customers.FName || ' ' || Customers.LName). Hãy viết câu truy vấn chỉ lấy đúng 4 cột này cho các xe có Status <> 'READY', sắp xếp theo CarId tăng dần.",
      "intuition": "Nối Cars với Customers, lọc WHERE c.Status <> 'READY' và chỉ chiếu đúng 4 cột cần cho DTO.",
      "trace": "Xe chưa READY gồm Id 3 (Ford Mustang - David Miller), Id 4 (Toyota Prius - Richard Davis) và Id 6 (Mazda 3 - Richard Davis).",
      "sql": "SELECT c.Id AS CarId, c.Model, c.Status,\n       cust.FName || ' ' || cust.LName AS CustomerName\nFROM Cars AS c\nINNER JOIN Customers AS cust ON c.CustomerId = cust.Id\nWHERE c.Status <> 'READY'\nORDER BY c.Id ASC;",
      "db": "autoshop",
      "expected": {
        "cols": [
          "CarId",
          "Model",
          "Status",
          "CustomerName"
        ],
        "rows": [
          [
            3,
            "Ford Mustang",
            "WAITING",
            "David Miller"
          ],
          [
            4,
            "Toyota Prius",
            "WORKING",
            "Richard Davis"
          ],
          [
            6,
            "Mazda 3",
            "WAITING",
            "Richard Davis"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Chỉ chọn đúng 4 cột c.Id AS CarId, c.Model, c.Status, cust.FName || ' ' || cust.LName AS CustomerName.",
        "INNER JOIN Customers AS cust ON c.CustomerId = cust.Id WHERE c.Status <> 'READY' ORDER BY c.Id ASC;",
        "SELECT c.Id AS CarId, c.Model, c.Status, cust.FName || ' ' || cust.LName AS CustomerName FROM Cars AS c INNER JOIN Customers AS cust ON c.CustomerId = cust.Id WHERE c.Status <> 'READY' ORDER BY c.Id ASC;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 12.2: Gom truy vấn N+1 thành 1 câu truy vấn tổng hợp cho màn hình quản trị Khoa",
      "problem": "Trên CSDL TruongHoc, giao diện danh sách Khoa cần hiển thị MaKhoa, TenKhoa, SoSinhVien và SoMonHoc của từng khoa. Thay vì lặp qua từng khoa rồi bắn 2 câu COUNT riêng lẻ (gây lỗi 2N+1 queries!), hãy viết 1 câu truy vấn lấy MaKhoa, TenKhoa kèm 2 cột SoSinhVien và SoMonHoc (dùng subquery đếm độc lập hoặc DISTINCT để không bị nhân chéo giữa SinhVien và MonHoc), sắp xếp theo MaKhoa tăng dần.",
      "intuition": "Cẩn thận: nếu bạn LEFT JOIN Khoa với cả SinhVien lẫn MonHoc cùng lúc rồi dùng COUNT(sv.MaSV), một khoa có 3 SV và 3 môn học sẽ nhân chéo thành 9 dòng! Dùng COUNT(DISTINCT sv.MaSV) và COUNT(DISTINCT mh.MaMH) hoặc 2 Scalar Subquery.",
      "trace": "CNTT: 3 SV, 3 môn; DL: 0 SV, 0 môn; DT: 1 SV, 1 môn; KT: 2 SV, 1 môn.",
      "sql": "SELECT k.MaKhoa, k.TenKhoa,\n       COUNT(DISTINCT sv.MaSV) AS SoSinhVien,\n       COUNT(DISTINCT mh.MaMH) AS SoMonHoc\nFROM Khoa AS k\nLEFT JOIN SinhVien AS sv ON k.MaKhoa = sv.MaKhoa\nLEFT JOIN MonHoc AS mh ON k.MaKhoa = mh.MaKhoa\nGROUP BY k.MaKhoa, k.TenKhoa\nORDER BY k.MaKhoa ASC;",
      "db": "truonghoc",
      "expected": {
        "cols": [
          "MaKhoa",
          "TenKhoa",
          "SoSinhVien",
          "SoMonHoc"
        ],
        "rows": [
          [
            "CNTT",
            "Cong Nghe Thong Tin",
            3,
            3
          ],
          [
            "DL",
            "Khoa Du Lich",
            0,
            0
          ],
          [
            "DT",
            "Dien Tu Vien Thong",
            1,
            1
          ],
          [
            "KT",
            "Kinh Te Doi Ngoai",
            2,
            1
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Khi LEFT JOIN 1 bảng cha với 2 bảng con độc lập (SinhVien và MonHoc), các dòng sẽ bị nhân chéo (Cartesian Explosion).",
        "Sử dụng COUNT(DISTINCT sv.MaSV) AS SoSinhVien và COUNT(DISTINCT mh.MaMH) AS SoMonHoc để đếm chính xác.",
        "SELECT k.MaKhoa, k.TenKhoa, COUNT(DISTINCT sv.MaSV) AS SoSinhVien, COUNT(DISTINCT mh.MaMH) AS SoMonHoc FROM Khoa AS k LEFT JOIN SinhVien AS sv ON k.MaKhoa = sv.MaKhoa LEFT JOIN MonHoc AS mh ON k.MaKhoa = mh.MaKhoa GROUP BY k.MaKhoa, k.TenKhoa ORDER BY k.MaKhoa ASC;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch12_p1",
      "title": "Khử lỗi N+1 khi tính tổng chi tiêu và đơn hàng gần nhất cho danh sách Khách hàng VIP",
      "difficulty": "Khá",
      "db": "shoponline",
      "summary": "Trên CSDL ShopOnline, API danh sách khách hàng cần trả về cho tất cả khách hàng (6 người): MaKH, HoTen, HangThe, SoDonHoanThanh (chỉ đếm đơn có TrangThai = 'HOAN_THANH') và NgayMuaGanNhat (MAX(NgayDat) của các đơn 'HOAN_THANH', nếu chưa có đơn hoàn thành nào thì để NULL). Hãy viết duy nhất 1 câu SQL giải quyết trọn vẹn yêu cầu trên, sắp xếp theo MaKH tăng dần.",
      "understand": "Dùng LEFT JOIN từ KhachHang sang DonHang với điều kiện lọc dh.TrangThai = 'HOAN_THANH' đặt ngay trong mệnh đề ON, sau đó GROUP BY kh.MaKH, kh.HoTen, kh.HangThe.",
      "brute": "Lấy danh sách 6 khách hàng về code Java/C#, rồi trong vòng lặp for gọi 6 câu query tìm COUNT và MAX(NgayDat) cho từng người.",
      "optimal": "Gộp thành 1 câu LEFT JOIN có điều kiện trong ON + GROUP BY.",
      "trace": "Khách 1 có 3 đơn hoàn thành, mới nhất 2024-03-25. Khách 2 có 1 đơn hoàn thành (2024-01-12, vì đơn 1006 đang giao). Khách 3, 5, 6 có 0 đơn hoàn thành và NgayMuaGanNhat là NULL. Khách 4 có 1 đơn (2024-03-02).",
      "sql": "SELECT kh.MaKH, kh.HoTen, kh.HangThe,\n       COUNT(dh.MaDH) AS SoDonHoanThanh,\n       MAX(dh.NgayDat) AS NgayMuaGanNhat\nFROM KhachHang AS kh\nLEFT JOIN DonHang AS dh\n       ON kh.MaKH = dh.MaKH AND dh.TrangThai = 'HOAN_THANH'\nGROUP BY kh.MaKH, kh.HoTen, kh.HangThe\nORDER BY kh.MaKH ASC;",
      "expected": {
        "cols": [
          "MaKH",
          "HoTen",
          "HangThe",
          "SoDonHoanThanh",
          "NgayMuaGanNhat"
        ],
        "rows": [
          [
            1,
            "Nguyen Van An",
            "VANG",
            3,
            "2024-03-25"
          ],
          [
            2,
            "Tran Thi Binh",
            "BAC",
            1,
            "2024-01-12"
          ],
          [
            3,
            "Le Hoang Cuong",
            "DONG",
            0,
            null
          ],
          [
            4,
            "Pham Minh Dung",
            "VANG",
            1,
            "2024-03-02"
          ],
          [
            5,
            "Vo Thi Em",
            "DONG",
            0,
            null
          ],
          [
            6,
            "Hoang Gia Huy",
            "BAC",
            0,
            null
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Đặt dh.TrangThai = 'HOAN_THANH' ở WHERE làm biến mất khách hàng 3, 5, 6.",
      "note3": {
        "idea": "Luôn đẩy việc tính toán tổng hợp danh sách con xuống 1 câu SQL GROUP BY hoặc DTO Projection thay vì gọi query trong vòng lặp for (N+1).",
        "syntax": "FROM Parent p LEFT JOIN Child c ON p.Id = c.ParentId AND c.Status = 'OK' GROUP BY p.Id",
        "trap": "Gọi getter của quan hệ Lazy Loading bên trong vòng lặp serializer JSON (như Jackson/System.Text.Json) là nguyên nhân số 1 gây ra lỗi N+1 trên Production."
      }
    }
  ],
  "summary_table": [
    [
      "JDBC / ADO.NET",
      "Tầng giao tiếp cấp thấp với CSDL",
      "Luôn bọc trong try-with-resources (Java) hoặc await using (C#)"
    ],
    [
      "Dapper / JdbcTemplate",
      "Micro-ORM ánh xạ nhanh từ câu SQL thuần sang DTO",
      "Rất hợp cho truy vấn báo cáo phức tạp hoặc CQRS Read side"
    ],
    [
      "N+1 Query Problem",
      "1 câu lấy N dòng cha + N câu lấy dòng con do Lazy Loading",
      "Chữa bằng JOIN FETCH / Include, @BatchSize, .AsSplitQuery(), DTO"
    ],
    [
      "AsNoTracking / readOnly=true",
      "Tắt Snapshot và Dirty Checking cho truy vấn chỉ đọc",
      "Giảm 30-40% RAM cấp phát và tăng tốc độ trả kết quả"
    ],
    [
      "Connection Pool (HikariCP)",
      "Tái sử dụng kết nối vật lý, tránh chi phí bắt tay TCP/Auth",
      "Giữ Pool Size nhỏ gọn (~10-30), tắt Open-Session-In-View"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Nếu ứng dụng của bạn lấy ra 50 đơn hàng từ DB, và mỗi đơn hàng khi chuyển sang JSON lại tự động gọi thêm 1 câu SELECT lấy thông tin Khách hàng và 1 câu SELECT lấy danh sách Chi tiết đơn, thì tổng cộng đã có bao nhiêu câu SQL được gửi tới DB?",
      "a": "Tổng cộng có 1 + 50 + 50 = 101 câu lệnh SQL (biến thể 2N + 1 của lỗi N+1 Query)!"
    },
    {
      "q": "Câu 2: Khi bạn gọi phương thức connection.close() (trong Java dùng HikariCP) hoặc connection.Dispose() (trong C# dùng SqlConnection), kết nối mạng TCP tới SQL Server có thực sự bị ngắt đi không?",
      "a": "KHÔNG! Kết nối vật lý không bị đóng mà chỉ được đặt lại trạng thái sạch và trả về nằm chờ trong Connection Pool để phục vụ request tiếp theo."
    },
    {
      "q": "Câu 3: Trong EF Core, nếu bạn viết câu truy vấn kết thúc bằng .Select(x => new SanPhamDto { MaSP = x.MaSP, TenSP = x.TenSP }).ToListAsync(), bạn có cần thiết phải gọi thêm .AsNoTracking() nữa không?",
      "a": "Không bắt buộc (dù thêm vào cũng không sao), vì khi bạn chiếu (.Select) kết quả ra một class DTO không phải là Entity được quản lý trong DbContext, EF Core mặc định không bao giờ theo dõi (track) các đối tượng DTO đó."
    }
  ]
});
