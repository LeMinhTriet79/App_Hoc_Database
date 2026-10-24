/**
 * FILE: src/data/chapters/ch06-dml-ddl-constraints-identity.js
 * MÔ TẢ: Chương 6 - Thao Tác & Định Nghĩa Dữ Liệu (DML & DDL), Ràng Buộc, Sequence & Identity
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch06",
  "code": "Chương 6",
  "title": "Thao Tác & Định Nghĩa Dữ Liệu (DML & DDL), Ràng Buộc, Sequence & Identity",
  "sources": [
    "S ch.19-21, 25-27, 29-33, 36, 50, 51, 57",
    "M ch.15, 16, 53-58, 78"
  ],
  "goals": [
    "So sánh sâu sắc ba lệnh xóa DELETE, TRUNCATE và DROP dưới góc độ Transaction Log, Khóa (Lock), Trigger và Identity.",
    "Viết đúng và an toàn các câu lệnh INSERT, UPDATE có JOIN/Subquery, và Upsert (MERGE / ON CONFLICT).",
    "Thiết kế bảng chuẩn với đầy đủ 5 loại ràng buộc (PRIMARY KEY, FOREIGN KEY kèm hành vi Cascade, UNIQUE, CHECK, DEFAULT).",
    "Phân biệt cơ chế sinh khóa tự động IDENTITY vs SEQUENCE và nắm rõ bẫy @@IDENTITY vs SCOPE_IDENTITY() trong SQL Server."
  ],
  "signals": [
    "Xây dựng chức năng đồng bộ danh mục hàng hóa từ file Excel hoặc từ hệ thống ERP (nếu mã SP đã có thì cập nhật giá, chưa có thì thêm mới).",
    "Cần lấy lại ngay mã ID vừa tự tăng sau khi INSERT đơn hàng cha để tiếp tục INSERT các dòng chi tiết đơn hàng con.",
    "Cần dọn sạch bảng tạm hàng triệu dòng một cách tức thời mà không làm đầy ổ cứng chứa Transaction Log."
  ],
  "theory": "<h3>6.1. Cuộc so sánh kinh điển: DELETE vs TRUNCATE vs DROP</h3>\n<p>Hầu như không có cuộc phỏng vấn Backend Fresher/Junior nào bỏ qua câu hỏi so sánh 3 lệnh xóa này. Đừng chỉ trả lời \"DELETE xóa có điều kiện còn TRUNCATE xóa hết\", hãy nắm vững bản chất bên dưới tầng lưu trữ:</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Tiêu chí</th>\n      <th>DELETE</th>\n      <th>TRUNCATE TABLE</th>\n      <th>DROP TABLE</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>Phân loại nhóm lệnh</strong></td>\n      <td>DML (Data Manipulation Language)</td>\n      <td>DDL (Data Definition Language)</td>\n      <td>DDL (Data Definition Language)</td>\n    </tr>\n    <tr>\n      <td><strong>Phạm vi tác động</strong></td>\n      <td>Xóa từng dòng thỏa mãn <code>WHERE</code> (nếu bỏ WHERE sẽ xóa hết dòng).</td>\n      <td>Xóa sạch 100% các dòng trong bảng, giữ lại cấu trúc bảng và Index.</td>\n      <td>Xóa sổ hoàn toàn cả dữ liệu, cấu trúc bảng, Index, Trigger và quyền truy cập.</td>\n    </tr>\n    <tr>\n      <td><strong>Cơ chế ghi Log (Transaction Log)</strong></td>\n      <td><strong>Full Logging:</strong> Ghi log chi tiết từng dòng bị xóa, nên chạy chậm khi bảng có hàng triệu dòng.</td>\n      <td><strong>Minimal Logging:</strong> Chỉ ghi nhận việc thu hồi các trang dữ liệu (Page Deallocation), nên chạy nhanh tức thì!</td>\n      <td>Minimal Logging (thu hồi toàn bộ trang và xóa metadata).</td>\n    </tr>\n    <tr>\n      <td><strong>Có ROLLBACK được không?</strong></td>\n      <td>Có (nếu nằm trong Transaction).</td>\n      <td><strong>CÓ trong SQL Server và PostgreSQL!</strong> (Nhiều bạn lầm tưởng TRUNCATE không rollback được; thực tế trong SQL Server và Postgres, TRUNCATE hoàn toàn rollback được nếu bọc trong <code>BEGIN TRAN ... ROLLBACK</code>. Chỉ trên MySQL và Oracle thì TRUNCATE mới tự động commit ngầm!).</td>\n      <td>Có trong SQL Server / PostgreSQL (nếu trong Transaction); không được trong MySQL / Oracle.</td>\n    </tr>\n    <tr>\n      <td><strong>Bộ đếm tự tăng (IDENTITY)</strong></td>\n      <td>Giữ nguyên bộ đếm hiện tại (xóa dòng số 10 thì dòng thêm mới tiếp theo vẫn là 11).</td>\n      <td><strong>Reset bộ đếm</strong> quay về giá trị khởi tạo ban đầu (Seed, thường là 1).</td>\n      <td>Bảng đã mất nên không còn bộ đếm.</td>\n    </tr>\n    <tr>\n      <td><strong>Kích hoạt Trigger?</strong></td>\n      <td>Kích hoạt <code>DELETE Trigger</code>.</td>\n      <td><strong>Không kích hoạt</strong> <code>DELETE Trigger</code>.</td>\n      <td>Không kích hoạt DML Trigger (chỉ kích hoạt DDL Trigger nếu có).</td>\n    </tr>\n  </tbody>\n</table>\n\n<h3>6.2. Ràng buộc toàn vẹn (Constraints) và hành vi Khóa ngoại (Referential Actions)</h3>\n<ul>\n  <li><code>PRIMARY KEY</code> vs <code>UNIQUE</code>: Một bảng chỉ có tối đa <strong>1 Khóa chính (Primary Key)</strong> và không cột nào trong PK được phép <code>NULL</code>. Ngược lại, một bảng có thể có <strong>nhiều ràng buộc <code>UNIQUE</code></strong> (ví dụ vừa UNIQUE trên Email, vừa UNIQUE trên Số CCCD). <em>Lưu ý đặc biệt:</em> Trong chuẩn ANSI SQL, PostgreSQL, MySQL và SQLite, cột <code>UNIQUE</code> cho phép chứa nhiều dòng <code>NULL</code> (vì <code>NULL</code> không bằng <code>NULL</code>). Nhưng trong <strong>SQL Server</strong>, một cột <code>UNIQUE</code> thông thường <strong>chỉ cho phép tối đa 1 dòng mang giá trị <code>NULL</code></strong>! Muốn cho phép nhiều dòng <code>NULL</code> mà các giá trị khác NULL vẫn duy nhất trong SQL Server, bạn phải tạo <em>Filtered Unique Index</em>: <code>CREATE UNIQUE INDEX IX_Email ON KhachHang(Email) WHERE Email IS NOT NULL;</code>.</li>\n  <li><strong>4 hành vi khi bảng cha bị xóa hoặc đổi khóa (<code>ON DELETE / ON UPDATE</code>):</strong>\n    <ul>\n      <li><code>NO ACTION / RESTRICT</code> (Mặc định): Chặn lại và báo lỗi nếu bảng con vẫn đang có dòng tham chiếu tới dòng bảng cha định xóa.</li>\n      <li><code>CASCADE</code>: Xóa dòng bảng cha thì tự động xóa dây chuyền tất cả các dòng liên quan ở bảng con (rất tiện cho bảng trung gian nhưng cực kỳ nguy hiểm với bảng lịch sử giao dịch!).</li>\n      <li><code>SET NULL</code>: Xóa dòng bảng cha thì giữ nguyên dòng bảng con nhưng gán cột khóa ngoại thành <code>NULL</code> (ví dụ xóa Nhân viên thì đơn hàng cũ giữ nguyên nhưng cột <code>EmployeeId</code> thành <code>NULL</code>).</li>\n      <li><code>SET DEFAULT</code>: Gán cột khóa ngoại về giá trị mặc định.</li>\n    </ul>\n  </li>\n</ul>\n\n<h3>6.3. Sinh khóa tự động: IDENTITY vs SEQUENCE và 3 hàm lấy ID trong SQL Server</h3>\n<p>Trong SQL Server, khi cột khóa chính khai báo <code>Id INT IDENTITY(1,1)</code>, ngay sau khi chạy lệnh <code>INSERT</code>, nếu bạn cần lấy lại giá trị <code>Id</code> vừa sinh ra, hãy phân biệt thật rõ 3 hàm sau:</p>\n<ul>\n  <li><code>SCOPE_IDENTITY()</code> (<strong>KHUYÊN DÙNG</strong> hoặc dùng mệnh đề <code>OUTPUT inserted.Id</code>): Trả về ID vừa sinh ra trong <strong>cùng phiên kết nối (Session) và cùng phạm vi (Scope)</strong> hiện tại.</li>\n  <li><code>@@IDENTITY</code> (<strong>CẤM DÙNG TRONG THỰC TẾ</strong>): Trả về ID vừa sinh ra trong cùng phiên kết nối nhưng <strong>bất kể phạm vi nào</strong>! Nếu bảng <code>DonHang</code> có gắn một <code>AFTER INSERT Trigger</code> tự động ghi log vào bảng <code>AuditLog</code> (vốn cũng có cột <code>IDENTITY</code>), thì <code>@@IDENTITY</code> sẽ trả về ID của bảng <code>AuditLog</code> thay vì ID của bảng <code>DonHang</code>, gây lỗi gắn nhầm khóa ngoại cực kỳ nghiêm trọng!</li>\n  <li><code>IDENT_CURRENT('TenBang')</code> (Nguy hiểm khi chạy đa luồng): Trả về ID mới nhất của bảng đó trên toàn máy chủ, bất kể của kết nối (User) nào vừa chèn!</li>\n</ul>\n<p>Khác với <code>IDENTITY</code> (gắn chặt vào 1 cột của 1 bảng), <strong><code>SEQUENCE</code></strong> (có từ SQL Server 2012, chuẩn trong PostgreSQL và Oracle) là một đối tượng độc lập dùng chung được cho nhiều bảng và cho phép ứng dụng xin trước một dải ID (qua cơ chế <em>Hi/Lo</em> trong Hibernate/EF Core) trước khi thực hiện <code>INSERT</code> theo lô (Batch Insert).</p>",
  "mechanism": "<h3>Chạy tay từng bước: Cách mệnh đề OUTPUT và bảng ảo inserted / deleted hoạt động</h3>\n<p>Trong SQL Server (cũng như mệnh đề <code>RETURNING</code> trong PostgreSQL và SQLite 3.35+), mỗi khi một câu lệnh <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> hoặc <code>MERGE</code> thực thi, máy chủ tạo ra hai cấu trúc bộ nhớ tạm chứa các dòng bị ảnh hưởng:</p>\n<div class=\"trace-steps\">\n  <div class=\"trace-step\"><strong>Khi chạy <code>INSERT</code>:</strong> Bảng ảo <code>inserted</code> chứa các dòng mới vừa được thêm vào; bảng <code>deleted</code> trống rỗng.</div>\n  <div class=\"trace-step\"><strong>Khi chạy <code>DELETE</code>:</strong> Bảng ảo <code>deleted</code> chứa các dòng vừa bị xóa đi; bảng <code>inserted</code> trống rỗng.</div>\n  <div class=\"trace-step\"><strong>Khi chạy <code>UPDATE</code>:</strong> Về mặt vật lý, <code>UPDATE</code> được xử lý như một cặp <em>Xóa cũ + Chèn mới</em>: bảng <code>deleted</code> giữ hình ảnh của dòng <strong>trước khi sửa</strong>, còn bảng <code>inserted</code> giữ hình ảnh của dòng <strong>sau khi sửa</strong>!</div>\n</div>\n<p>Nhờ cơ chế này, thay vì phải chạy 1 câu <code>SELECT</code> trước rồi 1 câu <code>UPDATE</code> sau (tốn 2 vòng mạng và dễ bị Race Condition), bạn chỉ cần viết 1 câu duy nhất: <code>UPDATE SanPham SET TonKho = TonKho - 1 OUTPUT deleted.TonKho AS TonCu, inserted.TonKho AS TonMoi WHERE MaSP = 101 AND TonKho &gt;= 1;</code>.</p>",
  "examples": [
    {
      "title": "Ví dụ 6.1: Khởi tạo bảng với đầy đủ ràng buộc (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, DEFAULT)",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "CREATE TABLE VoucherKhuyenMai (\n    MaVoucher VARCHAR(20) NOT NULL PRIMARY KEY,\n    TenChuongTrinh VARCHAR(100) NOT NULL,\n    SoTienGiam INT NOT NULL CHECK (SoTienGiam > 0),\n    SoLuongPhatHanh INT NOT NULL DEFAULT 100 CHECK (SoLuongPhatHanh >= 0),\n    MaKH_Rieng INT NULL,\n    FOREIGN KEY (MaKH_Rieng) REFERENCES KhachHang(MaKH) ON DELETE SET NULL\n);\nINSERT INTO VoucherKhuyenMai (MaVoucher, TenChuongTrinh, SoTienGiam, MaKH_Rieng)\nVALUES ('HE2025', 'Chao He Ruc Ro', 150, 1);\nSELECT * FROM VoucherKhuyenMai;",
      "result": {
        "cols": [
          "MaVoucher",
          "TenChuongTrinh",
          "SoTienGiam",
          "SoLuongPhatHanh",
          "MaKH_Rieng"
        ],
        "rows": [
          [
            "HE2025",
            "Chao He Ruc Ro",
            150,
            100,
            1
          ]
        ]
      },
      "note": "Ràng buộc CHECK ngăn chặn dữ liệu âm ngay từ tầng CSDL. ON DELETE SET NULL giúp giữ lại voucher khi khách hàng bị xóa."
    },
    {
      "title": "Ví dụ 6.2: Chèn dữ liệu từ kết quả truy vấn (INSERT INTO ... SELECT)",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "CREATE TABLE KhachHangThanThiet (\n    MaKH INT PRIMARY KEY,\n    HoTen VARCHAR(60),\n    TongSoDon INT\n);\nINSERT INTO KhachHangThanThiet (MaKH, HoTen, TongSoDon)\nSELECT kh.MaKH, kh.HoTen, COUNT(dh.MaDH)\nFROM KhachHang AS kh\nINNER JOIN DonHang AS dh ON kh.MaKH = dh.MaKH\nWHERE dh.TrangThai = 'HOAN_THANH'\nGROUP BY kh.MaKH, kh.HoTen\nHAVING COUNT(dh.MaDH) >= 2;\nSELECT * FROM KhachHangThanThiet;",
      "result": {
        "cols": [
          "MaKH",
          "HoTen",
          "TongSoDon"
        ],
        "rows": [
          [
            1,
            "Nguyen Van An",
            3
          ]
        ]
      },
      "note": "INSERT INTO ... SELECT giúp tổng hợp và sao chép hàng loạt bản ghi sang bảng báo cáo chỉ trong một giao dịch duy nhất."
    },
    {
      "title": "Ví dụ 6.3: Cập nhật dữ liệu dựa trên bảng liên kết (UPDATE kèm điều kiện từ bảng khác)",
      "label": "CHUAN",
      "db": "truonghoc",
      "sql": "UPDATE SinhVien\nSET HocBong = COALESCE(HocBong, 0) + 1000\nWHERE EXISTS (\n    SELECT 1 FROM DangKy AS dk\n    WHERE dk.MaSV = SinhVien.MaSV AND dk.DiemCK >= 9.0\n);\nSELECT MaSV, HoTen, MaKhoa, HocBong FROM SinhVien ORDER BY MaSV;",
      "result": {
        "cols": [
          "MaSV",
          "HoTen",
          "MaKhoa",
          "HocBong"
        ],
        "rows": [
          [
            201,
            "Bui Minh Tuan",
            "CNTT",
            6000
          ],
          [
            202,
            "Doan Thu Ha",
            "CNTT",
            9000
          ],
          [
            203,
            "Ngo Quang Khai",
            "CNTT",
            null
          ],
          [
            204,
            "Ly Ngoc Mai",
            "KT",
            3000
          ],
          [
            205,
            "Trinh Gia Bao",
            "DT",
            0
          ],
          [
            206,
            "Vu Thanh Thao",
            "KT",
            null
          ]
        ]
      },
      "note": "Cách viết UPDATE ... WHERE EXISTS (...) là chuẩn ANSI SQL an toàn nhất, chạy đúng trên mọi hệ CSDL từ SQL Server, PostgreSQL, Oracle cho tới SQLite."
    },
    {
      "title": "Ví dụ 6.4: Upsert (Thêm mới hoặc Cập nhật nếu trùng khóa) chuẩn PostgreSQL / SQLite bằng ON CONFLICT",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "INSERT INTO SanPham (MaSP, TenSP, DanhMuc, DonGia, TonKho)\nVALUES (107, 'Webcam Elgato Facecam', 'Phu Kien', 3990, 20)\nON CONFLICT(MaSP) DO UPDATE SET\n    DonGia = excluded.DonGia,\n    TonKho = SanPham.TonKho + excluded.TonKho;\nSELECT MaSP, TenSP, DonGia, TonKho FROM SanPham WHERE MaSP = 107;",
      "result": {
        "cols": [
          "MaSP",
          "TenSP",
          "DonGia",
          "TonKho"
        ],
        "rows": [
          [
            107,
            "Webcam Elgato Facecam",
            3990,
            20
          ]
        ]
      },
      "note": "Sản phẩm 107 đã tồn tại (giá cũ 4200, tồn kho 0). Nhờ ON CONFLICT(MaSP) DO UPDATE, lệnh không báo lỗi trùng khóa chính mà cập nhật giá mới 3990 và cộng thêm 20 vào tồn kho."
    },
    {
      "title": "Ví dụ 6.5: Lệnh MERGE (Upsert) và mệnh đề OUTPUT lấy ngay dữ liệu vừa thay đổi trong T-SQL",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "MERGE INTO SanPham AS Target\nUSING (VALUES (107, N'Webcam Elgato Facecam', N'Phu Kien', 3990, 20)) \n      AS Source (MaSP, TenSP, DanhMuc, DonGia, TonKho)\nON Target.MaSP = Source.MaSP\nWHEN MATCHED THEN\n    UPDATE SET Target.DonGia = Source.DonGia,\n               Target.TonKho = Target.TonKho + Source.TonKho\nWHEN NOT MATCHED BY TARGET THEN\n    INSERT (MaSP, TenSP, DanhMuc, DonGia, TonKho)\n    VALUES (Source.MaSP, Source.TenSP, Source.DanhMuc, Source.DonGia, Source.TonKho)\nOUTPUT $action AS HanhDong, inserted.MaSP, deleted.DonGia AS GiaCu, inserted.DonGia AS GiaMoi;",
      "result": {
        "cols": [
          "HanhDong",
          "MaSP",
          "GiaCu",
          "GiaMoi"
        ],
        "rows": [
          [
            "UPDATE",
            107,
            4200,
            3990
          ]
        ]
      },
      "note": "Trong SQL Server, hai bảng ảo inserted và deleted không chỉ dùng trong Trigger mà còn dùng được ngay trong mệnh đề OUTPUT của INSERT, UPDATE, DELETE, MERGE để trả về dữ liệu cũ/mới cho ứng dụng trong 1 lượt gọi! (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    }
  ],
  "dialects": [
    [
      "Tự động tăng khóa chính",
      "INT IDENTITY(1,1)",
      "INT AUTO_INCREMENT",
      "INT GENERATED ALWAYS AS IDENTITY (hoặc SERIAL)"
    ],
    [
      "Lấy lại dòng vừa chèn/sửa",
      "OUTPUT inserted.Id, deleted.Col",
      "LAST_INSERT_ID() (chỉ lấy ID)",
      "RETURNING id, col (Hỗ trợ cả trên SQLite 3.35+)"
    ],
    [
      "Cú pháp Upsert (Thêm/Sửa)",
      "MERGE INTO ... USING ...",
      "INSERT ... ON DUPLICATE KEY UPDATE",
      "INSERT ... ON CONFLICT (id) DO UPDATE"
    ],
    [
      "Cập nhật bảng có JOIN",
      "UPDATE a SET ... FROM BangA a JOIN BangB b ON ...",
      "UPDATE BangA a JOIN BangB b ON ... SET a.col = ...",
      "UPDATE BangA a SET col = b.col FROM BangB b WHERE ..."
    ]
  ],
  "bridge_java": "// [Java - JDBC & Spring Data JPA] Lưu ý sống còn về Batch Insert với IDENTITY trong Hibernate!\n// CẢNH BÁO HIỆU NĂNG: Nếu Entity trong JPA dùng @GeneratedValue(strategy = GenerationType.IDENTITY),\n// Hibernate sẽ TỰ ĐỘNG TẮT tính năng JDBC Batch Insert! Vì Hibernate phải chờ chạy từng câu INSERT\n// để lấy ngay ID trả về từ DB rồi mới đưa Entity vào Persistence Context.\n// Giải pháp khi cần chèn hàng nghìn dòng: Dùng GenerationType.SEQUENCE (kèm allocationSize = 50)\n// hoặc dùng JdbcTemplate.batchUpdate():\n\nString sql = \"INSERT INTO ChiTietDon (MaDH, MaSP, SoLuong, DonGiaBan) VALUES (?, ?, ?, ?)\";\njdbcTemplate.batchUpdate(sql, danhSachChiTiet, 100, (PreparedStatement ps, ChiTietDto item) -> {\n    ps.setInt(1, item.maDh());\n    ps.setInt(2, item.maSp());\n    ps.setInt(3, item.soLuong());\n    ps.setInt(4, item.donGiaBan());\n});",
  "bridge_csharp": "// [C# - EF Core 7+] Cập nhật và xóa hàng loạt tốc độ cao bằng ExecuteUpdateAsync & ExecuteDeleteAsync\n// Trước EF Core 7, muốn tăng giá toàn bộ phụ kiện, bạn phải kéo 10.000 dòng về RAM, lặp qua sửa rồi gọi SaveChangesAsync().\n// Giờ đây, hãy dùng ExecuteUpdateAsync để sinh thẳng 1 câu lệnh SQL UPDATE duy nhất dưới DB:\n\nint soDongDaSua = await dbContext.SanPhams\n    .Where(sp => sp.DanhMuc == \"Phu Kien\" && sp.TonKho > 0)\n    .ExecuteUpdateAsync(setters => setters\n        .SetProperty(sp => sp.DonGia, sp => sp.DonGia + 50));\n\n// Tương tự cho xóa hàng loạt không cần nạp Entity vào bộ nhớ:\nint soDongDaXoa = await dbContext.DonHangs\n    .Where(dh => dh.TrangThai == \"DA_HUY\" && dh.NgayDat < new DateOnly(2023, 1, 1))\n    .ExecuteDeleteAsync();",
  "performance": "<ul>\n  <li><strong>Cẩn trọng khi chạy <code>ALTER TABLE</code> trên bảng lớn đang hoạt động (Production):</strong> Thêm một cột cho phép <code>NULL</code> (hoặc cột <code>NOT NULL</code> có kèm <code>DEFAULT</code> trên SQL Server 2012+ Enterprise / PostgreSQL 11+) chỉ là thao tác cập nhật Metadata nên hoàn tất trong vài mili-giây. Nhưng nếu bạn đổi kiểu dữ liệu cột (ví dụ từ <code>INT</code> sang <code>BIGINT</code> hoặc giảm độ dài <code>VARCHAR</code>), máy chủ phải viết lại toàn bộ các trang dữ liệu vật lý của bảng và giữ khóa độc quyền (Schema Modification Lock - <code>Sch-M</code>), làm treo toàn bộ các truy vấn đọc/ghi khác!</li>\n  <li><strong>Hiện tượng nhảy cóc số tự tăng (Identity Gap):</strong> Khi một giao dịch thực hiện <code>INSERT</code> sinh ra số Identity 105 nhưng sau đó bị lỗi và <code>ROLLBACK</code>, số 105 sẽ bị bỏ trống vĩnh viễn (lần chèn sau lấy số 106). Ngoài ra, SQL Server cache sẵn 1000 số Identity trong RAM để tăng tốc; nếu máy chủ mất điện hoặc khởi động lại đột ngột, số tự tăng có thể nhảy vọt thêm 1000 đơn vị. Vì vậy, <strong>không bao giờ dùng cột IDENTITY cho các số hiệu pháp lý đòi hỏi liên tục tuyệt đối</strong> (như số hóa đơn đỏ thuế GTGT).</li>\n</ul>",
  "common_errors": [
    "Gõ lệnh UPDATE hoặc DELETE trên Production mà quên bôi đen mệnh đề WHERE, làm bay màu hoặc ghi đè toàn bộ bảng! Mẹo phòng vệ: Luôn gõ SELECT * FROM ... WHERE ... trước để kiểm tra số dòng, rồi mới sửa chữ SELECT * thành DELETE hoặc bọc trong BEGIN TRAN ... ROLLBACK.",
    "Quên mệnh đề WHERE EXISTS ngoài cùng khi viết UPDATE BangA SET Cot = (SELECT ... FROM BangB WHERE ...), làm các dòng không khớp ở BangA bị gán giá trị NULL.",
    "Dùng @@IDENTITY thay vì SCOPE_IDENTITY() hoặc OUTPUT inserted.Id trong SQL Server, dẫn tới lấy nhầm ID của bảng ghi log trong Trigger.",
    "Cố gắng chạy TRUNCATE TABLE trên một bảng cha đang được tham chiếu bởi một ràng buộc FOREIGN KEY (kể cả khi bảng con đang trống rỗng, SQL Server vẫn cấm TRUNCATE bảng cha!).",
    "Tạo ràng buộc UNIQUE trên một cột cho phép NULL trong SQL Server (như cột Số hộ chiếu hoặc Email phụ) rồi ngạc nhiên khi khách hàng thứ hai để trống cột đó bị báo lỗi trùng lặp giá trị NULL!"
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "Phân biệt DELETE, TRUNCATE và DROP. Câu nói 'TRUNCATE không thể ROLLBACK được' đúng hay sai trong SQL Server?",
      "a_short": "DELETE xóa từng dòng có WHERE (ghi log đầy đủ); TRUNCATE xóa sạch toàn bảng bằng cách giải phóng trang dữ liệu và reset Identity; DROP xóa cả cấu trúc bảng. Trong SQL Server (và PostgreSQL), câu nói 'TRUNCATE không thể ROLLBACK' là SAI vì TRUNCATE hoàn toàn ROLLBACK được nếu đặt trong Transaction!",
      "a_long": "Nhiều thí sinh đọc tài liệu của MySQL hoặc Oracle (nơi DDL tự động gây implicit commit) rồi áp dụng nhầm sang SQL Server. Trong SQL Server và PostgreSQL, mọi lệnh DDL bao gồm TRUNCATE TABLE, CREATE TABLE, DROP TABLE đều tuân theo cơ chế giao dịch (Transactional DDL). TRUNCATE chỉ ghi log tối thiểu (Minimal Logging - ghi nhận các Extent/Page bị thu hồi thay vì ghi từng dòng) và giữ khóa trên các trang đó cho tới khi lệnh COMMIT hoặc ROLLBACK kết thúc."
    },
    {
      "level": "Junior",
      "q": "Sự khác nhau giữa @@IDENTITY, SCOPE_IDENTITY() và IDENT_CURRENT('Table') trong SQL Server là gì?",
      "a_short": "SCOPE_IDENTITY() lấy ID tự tăng vừa sinh trong cùng kết nối và cùng phạm vi (an toàn nhất); @@IDENTITY lấy ID cuối cùng trong cùng kết nối nhưng xuyên phạm vi (dễ dính ID của Trigger); IDENT_CURRENT lấy ID mới nhất của bảng trên toàn hệ thống bất kể kết nối nào.",
      "a_long": "Khi ứng dụng thực thi INSERT INTO Orders, nếu bảng Orders có một Trigger tự động INSERT tiếp vào bảng OrderHistory, thì ở thời điểm câu lệnh hoàn tất, câu lệnh INSERT cuối cùng trong phiên làm việc thuộc về Trigger (phạm vi khác). Lúc này @@IDENTITY trả về ID của OrderHistory, còn SCOPE_IDENTITY() trả về chính xác ID của Orders. Hiện đại hơn, bạn nên dùng mệnh đề OUTPUT inserted.Id ngay trong câu lệnh INSERT để nhận kết quả trực tiếp."
    },
    {
      "level": "Mid",
      "q": "Tại sao trong Hibernate / JPA, việc dùng khóa chính tự tăng kiểu IDENTITY lại làm vô hiệu hóa tính năng Batch Insert, và cách khắc phục là gì?",
      "a_short": "Vì chiến lược IDENTITY chỉ sinh ra ID sau khi câu lệnh INSERT đã chạy thực tế dưới DB, buộc Hibernate phải gửi từng câu INSERT riêng lẻ ngay lúc gọi persist() để lấy ID quản lý trạng thái Entity. Khắc phục bằng cách chuyển sang dùng SEQUENCE (kèm thuật toán Hi/Lo hoặc pooled-lo).",
      "a_long": "Kiến trúc của JPA Persistence Context yêu cầu mọi Entity ở trạng thái Managed phải có định danh (@Id) ngay khi gọi entityManager.persist(entity). Với cột IDENTITY của SQL Server/MySQL, không có cách nào biết trước ID nếu chưa thực thi lệnh INSERT, nên Hibernate không thể gom 50 câu INSERT vào hàng đợi lúc flush() được. Ngược lại, với SEQUENCE có allocationSize = 50, Hibernate chỉ cần gọi NEXT VALUE FOR seq một lần để lấy trước dải 50 số ID trong bộ nhớ, gán ngay cho 50 đối tượng và đẩy xuống DB bằng 1 gói JDBC Batch duy nhất."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 6.1: Tăng lương 10% cho nhân viên thuộc phòng Kỹ thuật (Tech)",
      "problem": "Trên CSDL Auto Shop, hãy viết câu lệnh UPDATE tăng cột Salary lên thêm 10% (nhân 1.1) cho những nhân viên thuộc phòng có Name = 'Tech' (trong bảng Departments), sau đó SELECT Id, FName, DepartmentId, Salary FROM Employees ORDER BY Id ASC để kiểm tra.",
      "intuition": "Dùng UPDATE Employees SET Salary = CAST(Salary * 1.1 AS INT) WHERE DepartmentId = (SELECT Id FROM Departments WHERE Name = 'Tech'), tiếp theo là câu lệnh SELECT.",
      "trace": "Phòng Tech có Id = 3, gồm William (800 -> 880) và Sarah (750 -> 825). Các nhân viên phòng khác giữ nguyên mức lương.",
      "sql": "UPDATE Employees\nSET Salary = CAST(Salary * 1.1 AS INT)\nWHERE DepartmentId = (SELECT Id FROM Departments WHERE Name = 'Tech');\nSELECT Id, FName, DepartmentId, Salary FROM Employees ORDER BY Id ASC;",
      "db": "autoshop",
      "expected": {
        "cols": [
          "Id",
          "FName",
          "DepartmentId",
          "Salary"
        ],
        "rows": [
          [
            1,
            "James",
            1,
            1000
          ],
          [
            2,
            "John",
            1,
            400
          ],
          [
            3,
            "Michael",
            2,
            600
          ],
          [
            4,
            "Johnathon",
            1,
            500
          ],
          [
            5,
            "William",
            3,
            880
          ],
          [
            6,
            "Sarah",
            3,
            825
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Phòng实 hành hỗ trợ chạy nhiều câu lệnh cách nhau bởi dấu chấm phẩy (;), câu cuối cùng là câu SELECT kiểm tra.",
        "UPDATE Employees SET Salary = CAST(Salary * 1.1 AS INT) WHERE DepartmentId = (SELECT Id FROM Departments WHERE Name = 'Tech');",
        "UPDATE Employees SET Salary = CAST(Salary * 1.1 AS INT) WHERE DepartmentId = (SELECT Id FROM Departments WHERE Name = 'Tech'); SELECT Id, FName, DepartmentId, Salary FROM Employees ORDER BY Id ASC;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 6.2: Xóa các cuốn sách nháp chưa được gán bất kỳ tác giả nào",
      "problem": "Trên CSDL Library, hãy viết câu lệnh DELETE xóa những cuốn sách trong bảng Books chưa từng xuất hiện trong bảng BooksAuthors, sau đó SELECT Id, Title FROM Books ORDER BY Id ASC để xem danh sách sách còn lại.",
      "intuition": "Dùng DELETE FROM Books WHERE NOT EXISTS (SELECT 1 FROM BooksAuthors ba WHERE ba.BookId = Books.Id) rồi chạy SELECT.",
      "trace": "Cuốn sách Id = 8 ('Clean Architecture Draft') không có tác giả nào nên bị xóa, còn lại 7 cuốn sách từ Id 1 đến Id 7.",
      "sql": "DELETE FROM Books\nWHERE NOT EXISTS (\n    SELECT 1 FROM BooksAuthors AS ba WHERE ba.BookId = Books.Id\n);\nSELECT Id, Title FROM Books ORDER BY Id ASC;",
      "db": "library",
      "expected": {
        "cols": [
          "Id",
          "Title"
        ],
        "rows": [
          [
            1,
            "The Catcher in the Rye"
          ],
          [
            2,
            "Nine Stories"
          ],
          [
            3,
            "Franny and Zooey"
          ],
          [
            4,
            "The Great Gatsby"
          ],
          [
            5,
            "Tender id the Night"
          ],
          [
            6,
            "Pride and Prejudice"
          ],
          [
            7,
            "Professional ASP.NET 4.5 in C# and VB"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Dùng DELETE FROM Books WHERE NOT EXISTS (...) để chỉ xóa sách không có bản ghi liên kết trong BooksAuthors.",
        "Sau lệnh DELETE nhớ chấm phẩy (;) và viết tiếp SELECT Id, Title FROM Books ORDER BY Id ASC;",
        "DELETE FROM Books WHERE NOT EXISTS (SELECT 1 FROM BooksAuthors AS ba WHERE ba.BookId = Books.Id); SELECT Id, Title FROM Books ORDER BY Id ASC;"
      ]
    },
    {
      "num": 3,
      "title": "Bài 6.3: Thêm cột mới bằng ALTER TABLE và cập nhật giá trị",
      "problem": "Trên CSDL Countries, hãy dùng ALTER TABLE thêm cột Continent VARCHAR(30) DEFAULT 'Europe' vào bảng Countries, sau đó UPDATE Continent = 'Asia' cho quốc gia có Name = 'Vietnam' và 'North America' cho 'United States'. Cuối cùng SELECT Id, Name, Continent FROM Countries ORDER BY Id ASC.",
      "intuition": "Thực hiện tuần tự ALTER TABLE Countries ADD COLUMN Continent ..., tiếp theo là UPDATE, và kết thúc bằng SELECT.",
      "trace": "Mặc định 5 nước nhận 'Europe'. Sau khi cập nhật, United States thành 'North America', Vietnam thành 'Asia'.",
      "sql": "ALTER TABLE Countries ADD COLUMN Continent VARCHAR(30) DEFAULT 'Europe';\nUPDATE Countries SET Continent = 'Asia' WHERE Name = 'Vietnam';\nUPDATE Countries SET Continent = 'North America' WHERE Name = 'United States';\nSELECT Id, Name, Continent FROM Countries ORDER BY Id ASC;",
      "db": "countries",
      "expected": {
        "cols": [
          "Id",
          "Name",
          "Continent"
        ],
        "rows": [
          [
            1,
            "Russian Federation",
            "Europe"
          ],
          [
            2,
            "Germany",
            "Europe"
          ],
          [
            3,
            "United States",
            "North America"
          ],
          [
            4,
            "Spain",
            "Europe"
          ],
          [
            5,
            "Vietnam",
            "Asia"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Cú pháp thêm cột: ALTER TABLE Countries ADD COLUMN Continent VARCHAR(30) DEFAULT 'Europe';",
        "Dùng 2 lệnh UPDATE (hoặc 1 lệnh UPDATE với CASE) cho Vietnam và United States, rồi SELECT kiểm tra.",
        "ALTER TABLE Countries ADD COLUMN Continent VARCHAR(30) DEFAULT 'Europe'; UPDATE Countries SET Continent = 'Asia' WHERE Name = 'Vietnam'; UPDATE Countries SET Continent = 'North America' WHERE Name = 'United States'; SELECT Id, Name, Continent FROM Countries ORDER BY Id ASC;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch06_p1",
      "title": "Hoàn trả tồn kho tự động từ các đơn hàng bị hủy",
      "difficulty": "Khá",
      "db": "shoponline",
      "summary": "Trên CSDL ShopOnline, đơn hàng 1004 có trạng thái 'DA_HUY'. Hãy viết câu lệnh UPDATE cộng hoàn trả số lượng hàng trong các đơn có TrangThai = 'DA_HUY' vào lại cột TonKho của bảng SanPham, sau đó SELECT MaSP, TenSP, TonKho FROM SanPham ORDER BY MaSP ASC.",
      "understand": "Đơn 1004 ('DA_HUY') đặt mua 1 chiếc Laptop ThinkPad X1 Carbon (MaSP = 105, đang có TonKho = 4). Cần cộng tổng SoLuong của các đơn DA_HUY vào TonKho của những sản phẩm tương ứng.",
      "brute": "Đọc danh sách chi tiết đơn hủy lên code ứng dụng rồi chạy vòng lặp UPDATE từng sản phẩm.",
      "optimal": "Dùng UPDATE SanPham SET TonKho = TonKho + (SELECT SUM(ct.SoLuong) ...) WHERE EXISTS (...).",
      "trace": "Chỉ có MaSP = 105 nằm trong đơn hủy 1004 với SoLuong = 1. Sau khi UPDATE, TonKho của SP 105 tăng từ 4 lên 5; các sản phẩm khác giữ nguyên.",
      "sql": "UPDATE SanPham\nSET TonKho = TonKho + (\n    SELECT SUM(ct.SoLuong)\n    FROM ChiTietDon AS ct\n    INNER JOIN DonHang AS dh ON ct.MaDH = dh.MaDH\n    WHERE ct.MaSP = SanPham.MaSP AND dh.TrangThai = 'DA_HUY'\n)\nWHERE EXISTS (\n    SELECT 1\n    FROM ChiTietDon AS ct\n    INNER JOIN DonHang AS dh ON ct.MaDH = dh.MaDH\n    WHERE ct.MaSP = SanPham.MaSP AND dh.TrangThai = 'DA_HUY'\n);\nSELECT MaSP, TenSP, TonKho FROM SanPham ORDER BY MaSP ASC;",
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
            25
          ],
          [
            102,
            "Chuot Logitech MX Master 3S",
            15
          ],
          [
            103,
            "Man Hinh Dell UltraSharp 27",
            8
          ],
          [
            104,
            "Tai Nghe Sony WH-1000XM5",
            12
          ],
          [
            105,
            "Laptop ThinkPad X1 Carbon",
            5
          ],
          [
            106,
            "Gia Do Laptop Nhom",
            50
          ],
          [
            107,
            "Webcam Elgato Facecam",
            0
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Quên mệnh đề WHERE EXISTS ở ngoài lệnh UPDATE! Nếu thiếu WHERE EXISTS, các sản phẩm không nằm trong đơn hủy sẽ bị gán TonKho = TonKho + NULL = NULL (hoặc lỗi NOT NULL constraint failed)!",
      "note3": {
        "idea": "Khi UPDATE một bảng bằng biểu thức truy vấn con từ bảng khác, luôn phải có WHERE EXISTS (hoặc COALESCE(..., 0)) để bảo vệ các dòng không có dữ liệu khớp.",
        "syntax": "UPDATE T1 SET val = val + COALESCE((SELECT SUM(x) FROM T2 WHERE T2.id = T1.id), 0) WHERE EXISTS (...)",
        "trap": "Quên WHERE EXISTS ngoài cùng của lệnh UPDATE sẽ làm toàn bộ các dòng không khớp bị cập nhật thành NULL!"
      }
    }
  ],
  "summary_table": [
    [
      "DELETE vs TRUNCATE",
      "Xóa từng dòng có WHERE vs Giải phóng toàn bộ trang dữ liệu",
      "TRUNCATE reset bộ đếm Identity và không chạy Trigger"
    ],
    [
      "PRIMARY KEY vs UNIQUE",
      "Định danh chính (NOT NULL, tối đa 1) vs Duy nhất phụ (nhiều cột)",
      "SQL Server cần Filtered Index nếu muốn UNIQUE bỏ qua nhiều NULL"
    ],
    [
      "ON DELETE CASCADE / SET NULL",
      "Hành vi tự động ở bảng con khi dòng bảng cha bị xóa",
      "Cẩn thận với CASCADE trên bảng giao dịch quan trọng"
    ],
    [
      "OUTPUT inserted.*, deleted.*",
      "Trả về ngay dữ liệu trước và sau khi INSERT/UPDATE/DELETE",
      "Giúp gộp 2 thao tác Đọc + Ghi thành 1 thao tác nguyên tử"
    ],
    [
      "MERGE / ON CONFLICT",
      "Cú pháp Upsert (có rồi thì sửa, chưa có thì thêm)",
      "Trong T-SQL nên kèm HOLDLOCK nếu chạy MERGE độ đồng thời cao"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Một bảng có cột Id INT IDENTITY(1,1) đang có 5 dòng (Id từ 1 đến 5). Nếu bạn chạy DELETE FROM Bang rồi chèn thêm 1 dòng mới, dòng mới có Id là mấy? Nếu chạy TRUNCATE TABLE Bang rồi chèn mới thì Id là mấy?",
      "a": "Sau DELETE, dòng mới sẽ có Id = 6 (giữ nguyên bộ đếm). Sau TRUNCATE TABLE, bộ đếm được đặt lại từ đầu nên dòng mới có Id = 1."
    },
    {
      "q": "Câu 2: Trong một lệnh UPDATE của SQL Server có sử dụng mệnh đề OUTPUT, bảng ảo nào chứa giá trị CŨ trước khi sửa, và bảng ảo nào chứa giá trị MỚI sau khi sửa?",
      "a": "Bảng ảo deleted chứa giá trị cũ trước khi sửa, và bảng ảo inserted chứa giá trị mới sau khi sửa."
    },
    {
      "q": "Câu 3: Tại sao bạn không thể thực hiện lệnh TRUNCATE TABLE KhachHang trên CSDL ShopOnline dù bạn muốn làm trống bảng này?",
      "a": "Vì bảng KhachHang đang được tham chiếu bởi khóa ngoại (FOREIGN KEY) từ bảng DonHang. Hệ quản trị CSDL chặn lệnh TRUNCATE trên mọi bảng đang là đích của khóa ngoại."
    }
  ]
});
