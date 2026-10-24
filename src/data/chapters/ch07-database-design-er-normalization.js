/**
 * FILE: src/data/chapters/ch07-database-design-er-normalization.js
 * MÔ TẢ: Chương 7 - Thiết Kế Cơ Sở Dữ Liệu, Sơ Đồ ER & Lý Thuyết Chuẩn Hóa (1NF đến BCNF)
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch07",
  "code": "Chương 7",
  "title": "Thiết Kế Cơ Sở Dữ Liệu, Sơ Đồ ER & Lý Thuyết Chuẩn Hóa (1NF đến BCNF)",
  "sources": [
    "Bổ sung kiến thức nền tảng thiết kế CSDL & phỏng vấn Kiến trúc sư phần mềm"
  ],
  "goals": [
    "Đọc và thiết kế thành thạo sơ đồ thực thể liên kết (ERD): phân biệt quan hệ 1-1, 1-N, N-N và thực thể yếu.",
    "Hiểu bản chất Phụ thuộc hàm (Functional Dependency) và áp dụng thuần thục quy trình chuẩn hóa từ 1NF, 2NF, 3NF đến BCNF.",
    "Biết khi nào nên Phi chuẩn hóa có chủ đích (Intentional Denormalization) để tối ưu tốc độ đọc cho hệ thống lớn.",
    "Làm chủ các mẫu thiết kế thực chiến: Khóa tự nhiên vs Khóa đại diện (UUIDv7/BIGINT), Soft Delete và Audit Trail."
  ],
  "signals": [
    "Nhận đề bài phỏng vấn System Design: 'Hãy thiết kế lược đồ CSDL cho hệ thống đặt vé xem phim / sàn thương mại điện tử / quản lý kho'.",
    "Phát hiện bảng hiện tại của dự án đang lưu danh sách ID cách nhau bằng dấu phẩy ('101,102,105') khiến không thể JOIN hay đánh Index.",
    "Cần quyết định xem có nên lưu thêm cột TongTien vào bảng DonHang hay mỗi lần xem đều phải tính SUM từ bảng ChiTietDon."
  ],
  "theory": "<h3>7.1. Phụ thuộc hàm (Functional Dependency) và các Dạng Chuẩn (1NF, 2NF, 3NF, BCNF)</h3>\n<p><strong>Phụ thuộc hàm (ký hiệu <code>X &rarr; Y</code>):</strong> Trong một bảng, tập thuộc tính <code>X</code> xác định hàm cho thuộc tính <code>Y</code> nếu: cứ hai dòng bất kỳ có cùng giá trị <code>X</code> thì chắc chắn phải có cùng giá trị <code>Y</code>. Ví dụ: biết <code>MaSV</code> thì biết duy nhất <code>HoTen</code> (<code>MaSV &rarr; HoTen</code>), nhưng biết <code>HoTen</code> chưa chắc biết <code>MaSV</code> (vì hai sinh viên có thể trùng tên).</p>\n<p>Mục tiêu của <strong>Chuẩn hóa (Normalization)</strong> là loại bỏ sự dư thừa dữ liệu và 3 dị thường (Thêm, Sửa, Xóa) bằng cách đi qua các bậc từ thấp lên cao (bạn có thể bấm vào <strong>Bộ Mô Phỏng Trực Quan &rarr; Chuẩn Hóa 1NF-3NF</strong> để xem một bảng Excel lộn xộn được tách bước từng bước như thế nào):</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Dạng chuẩn</th>\n      <th>Quy tắc cốt lõi (Định nghĩa chính xác)</th>\n      <th>Dấu hiệu vi phạm thực tế &amp; Cách sửa</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>1NF</strong> (First Normal Form)</td>\n      <td>Mọi ô dữ liệu phải mang <strong>giá trị nguyên tử (Atomic)</strong>, không chứa danh sách đa trị hay nhóm cột lặp lại (<code>SDT1, SDT2, SDT3</code>).</td>\n      <td><strong>Vi phạm:</strong> Cột <code>MonDangKy</code> lưu chuỗi <code>'CS101, CS102'</code> trên 1 ô.<br><strong>Sửa:</strong> Tách mỗi môn đăng ký thành 1 dòng riêng biệt.</td>\n    </tr>\n    <tr>\n      <td><strong>2NF</strong> (Second Normal Form)</td>\n      <td>Đạt 1NF, và mọi thuộc tính không khóa phải <strong>phụ thuộc hàm đầy đủ</strong> vào toàn bộ khóa chính (không phụ thuộc một phần vào khóa chính phức hợp).</td>\n      <td><strong>Vi phạm:</strong> Bảng <code>DangKy</code> có khóa chính gồm 2 cột <code>(MaSV, MaMH)</code> nhưng lại nhét thêm cột <code>TenMH</code>. Vì <code>MaMH &rarr; TenMH</code> (chỉ cần nửa khóa đã suy ra <code>TenMH</code>!).<br><strong>Sửa:</strong> Tách <code>(MaMH, TenMH)</code> ra bảng <code>MonHoc</code> riêng. <em>(Mẹo nhớ: Nếu bảng có khóa chính chỉ gồm 1 cột đơn lẻ và đã đạt 1NF thì tự động đạt 2NF!).</em></td>\n    </tr>\n    <tr>\n      <td><strong>3NF</strong> (Third Normal Form)</td>\n      <td>Đạt 2NF, và không có thuộc tính không khóa nào <strong>phụ thuộc bắc cầu (Transitive Dependency)</strong> vào khóa chính qua một thuộc tính không khóa khác.</td>\n      <td><strong>Vi phạm:</strong> Bảng <code>SinhVien</code> có khóa chính <code>MaSV</code>, có cột <code>MaKhoa</code> và cột <code>TenKhoa</code>. Ta có <code>MaSV &rarr; MaKhoa</code> và <code>MaKhoa &rarr; TenKhoa</code>.<br><strong>Sửa:</strong> Tách <code>(MaKhoa, TenKhoa)</code> ra bảng <code>Khoa</code>.</td>\n    </tr>\n    <tr>\n      <td><strong>BCNF</strong> (Boyce-Codd Normal Form)</td>\n      <td>Chặt hơn 3NF: Với mọi phụ thuộc hàm không tầm thường <code>X &rarr; Y</code>, vế trái <code>X</code> <strong>bắt buộc phải là một Siêu khóa (Superkey)</strong>.</td>\n      <td>Xảy ra khi bảng có nhiều khóa ứng viên chồng lấn nhau (ví dụ: mỗi môn học một sinh viên chỉ học 1 giảng viên, và mỗi giảng viên chỉ dạy 1 môn: <code>GiangVien &rarr; MonHoc</code>). Tách bảng <code>(GiangVien, MonHoc)</code> để đạt BCNF.</td>\n    </tr>\n  </tbody>\n</table>\n<p><em>Câu thần chú tiếng Anh cực kỳ nổi tiếng để nhớ 1NF, 2NF, 3NF:</em> Mọi cột không khóa phải phụ thuộc vào <strong>\"The Key (1NF), the Whole Key (2NF), and Nothing But the Key (3NF), so help me Codd!\"</strong></p>\n\n<h3>7.2. Khi nào được phép Phi chuẩn hóa (Denormalization)?</h3>\n<p>Chuẩn hóa 3NF giúp thao tác Ghi (<code>INSERT/UPDATE</code>) nhanh và luôn nhất quán, nhưng đổi lại khi Đọc (<code>SELECT</code>) phải thực hiện nhiều phép <code>JOIN</code>. Trong các hệ thống có tỷ lệ Đọc gấp hàng trăm lần Ghi, kiến trúc sư phần mềm chủ động <strong>Phi chuẩn hóa có kiểm soát</strong> trong các trường hợp sau:</p>\n<ol>\n  <li><strong>Lưu dữ liệu lịch sử chốt tại thời điểm giao dịch (Historical Snapshot):</strong> Lưu <code>DonGiaBan</code>, <code>TenSP_LucMua</code> và <code>DiaChiGiaoHang</code> trực tiếp vào bảng <code>DonHang / ChiTietDon</code>. Thực chất đây <em>không phải là vi phạm 3NF</em> mà là yêu cầu đúng đắn của nghiệp vụ: khi chủ shop đổi giá sản phẩm hoặc khách hàng đổi địa chỉ nhà vào năm 2025, hóa đơn đã xuất năm 2024 không được phép nhảy số theo!</li>\n  <li><strong>Cột tính toán sẵn (Pre-computed Aggregates):</strong> Thêm cột <code>TongTien</code> vào bảng <code>DonHang</code> hoặc cột <code>SoLuongBinhLuan</code> vào bảng <code>BaiViet</code> để hiển thị danh sách ngay lập tức mà không cần <code>GROUP BY</code> hàng triệu dòng chi tiết. (Đánh đổi: code ứng dụng hoặc Trigger phải cập nhật đồng bộ cột này trong cùng một Transaction mỗi khi thêm/sửa chi tiết).</li>\n</ol>\n\n<h3>7.3. Lựa chọn Khóa chính: Natural Key vs Surrogate Key (INT/BIGINT vs GUID/UUID)</h3>\n<ul>\n  <li><strong>Natural Key (Khóa tự nhiên):</strong> Dùng dữ liệu có ý nghĩa thực tế làm khóa chính (như Số CCCD, Mã số thuế, Mã ISO quốc gia <code>'VN'</code>). Nhược điểm: nếu quy định nhà nước đổi định dạng CCCD từ 9 số sang 12 số, bạn phải cập nhật dây chuyền toàn bộ các bảng con!</li>\n  <li><strong>Surrogate Key (Khóa đại diện):</strong> Dùng con số vô nghĩa với nghiệp vụ làm khóa chính (<code>INT/BIGINT IDENTITY</code>) và đánh thêm <code>UNIQUE</code> lên cột mã nghiệp vụ.</li>\n  <li><strong>So sánh <code>BIGINT IDENTITY</code> (8 bytes) và <code>GUID / UNIQUEIDENTIFIER</code> (16 bytes):</strong>\n    <ul>\n      <li><code>BIGINT IDENTITY</code>: Nhỏ gọn (8 bytes), tăng tuần tự nên các dòng mới luôn được chèn nối đuôi vào trang cuối cùng của cây B-Tree (không gây phân mảnh Index - <em>Page Split</em>). Nhược điểm: dễ bị đoán số lượng đơn hàng trên URL (<code>/orders/1005</code>) và khó gộp dữ liệu từ nhiều máy chủ phân tán.</li>\n      <li><code>GUID ngẫu nhiên (UUID v4 - NEWID())</code>: Sinh được ngay từ tầng code ứng dụng mà không cần hỏi DB, không lộ số thứ tự. Nhưng vì hoàn toàn ngẫu nhiên, khi làm Clustered Index nó chèn dữ liệu lung tung vào giữa các trang đĩa cũ, gây <strong>phân mảnh Index (Index Fragmentation &amp; Page Splits) cực nặng</strong> và tốn gấp đôi dung lượng (16 bytes).</li>\n      <li><strong>Giải pháp hiện đại nhất:</strong> Dùng <strong><code>UUID v7</code></strong> (sắp xếp theo thời gian mili-giây ở 48 bit đầu, có sẵn trong .NET 9 <code>Guid.CreateVersion7()</code> hoặc thư viện Java) hoặc <code>NEWSEQUENTIALID()</code> trong SQL Server để vừa có tính toàn cục của UUID vừa tăng tuần tự thân thiện với B-Tree!</li>\n    </ul>\n  </li>\n</ul>",
  "mechanism": "<h3>Chạy tay từng bước: Chuẩn hóa một bảng Hóa đơn chưa chuẩn hóa từ 0NF lên 3NF</h3>\n<p>Giả sử một lập trình viên mới ra trường thiết kế một bảng duy nhất tên là <code>HoaDonTongHop</code> như sau:</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr><th>MaDH</th><th>NgayDat</th><th>MaKH</th><th>TenKH</th><th>DanhSachMaSP</th><th>DanhSachTenSP</th><th>DanhSachSL</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>1001</td><td>2024-01-05</td><td>1</td><td>Nguyen Van An</td><td>101, 106</td><td>Ban Phim, Gia Do</td><td>1, 2</td></tr>\n  </tbody>\n</table>\n<div class=\"trace-steps\">\n  <div class=\"trace-step\"><strong>Bước 1 - Đưa lên 1NF (Khử đa trị):</strong> Các cột <code>DanhSachMaSP</code>, <code>DanhSachTenSP</code> chứa nhiều giá trị ngăn cách bởi dấu phẩy. Ta tách thành từng dòng đơn lẻ, khóa chính lúc này là cặp <code>(MaDH, MaSP)</code>:\n    <br><code>(MaDH=1001, MaSP=101, NgayDat='2024-01-05', MaKH=1, TenKH='An', TenSP='Ban Phim', SoLuong=1)</code>\n    <br><code>(MaDH=1001, MaSP=106, NgayDat='2024-01-05', MaKH=1, TenKH='An', TenSP='Gia Do', SoLuong=2)</code>\n  </div>\n  <div class=\"trace-step\"><strong>Bước 2 - Đưa lên 2NF (Khử phụ thuộc bộ phận vào khóa chính phức hợp):</strong> Khóa chính là <code>(MaDH, MaSP)</code>, nhưng:\n    <ul>\n      <li><code>NgayDat, MaKH, TenKH</code> chỉ phụ thuộc vào <code>MaDH</code> (không liên quan tới <code>MaSP</code>) &rarr; Tách ra bảng <strong><code>DonHang(MaDH, NgayDat, MaKH, TenKH)</code></strong>.</li>\n      <li><code>TenSP</code> chỉ phụ thuộc vào <code>MaSP</code> (không liên quan tới <code>MaDH</code>) &rarr; Tách ra bảng <strong><code>SanPham(MaSP, TenSP)</code></strong>.</li>\n      <li>Chỉ còn <code>SoLuong</code> phụ thuộc vào cả hai <code>(MaDH, MaSP)</code> &rarr; Ở lại bảng <strong><code>ChiTietDon(MaDH, MaSP, SoLuong)</code></strong>.</li>\n    </ul>\n  </div>\n  <div class=\"trace-step\"><strong>Bước 3 - Đưa lên 3NF (Khử phụ thuộc bắc cầu):</strong> Nhìn vào bảng <code>DonHang(MaDH, NgayDat, MaKH, TenKH)</code> vừa tách ở Bước 2: khóa chính là <code>MaDH</code>, nhưng <code>MaDH &rarr; MaKH</code> và <code>MaKH &rarr; TenKH</code> (phụ thuộc bắc cầu!). Nếu khách hàng số 1 có 100 đơn hàng, tên của họ vẫn bị lặp lại 100 lần.\n    <br>&rarr; Tách tiếp <code>(MaKH, TenKH)</code> ra bảng <strong><code>KhachHang(MaKH, TenKH)</code></strong>. Bảng <code>DonHang</code> giờ chỉ giữ khóa ngoại <code>(MaDH, NgayDat, MaKH)</code>. Toàn bộ lược đồ đạt chuẩn 3NF hoàn hảo!\n  </div>\n</div>",
  "examples": [
    {
      "title": "Ví dụ 7.1: Triển khai bảng trung gian (Junction Table) cho quan hệ Nhiều-Nhiều (N-N) kèm thuộc tính riêng",
      "label": "CHUAN",
      "db": "truonghoc",
      "sql": "SELECT sv.MaSV, sv.HoTen,\n       mh.MaMH, mh.TenMH, mh.SoTinChi,\n       dk.HocKy, dk.DiemQT, dk.DiemCK\nFROM SinhVien AS sv\nINNER JOIN DangKy AS dk ON sv.MaSV = dk.MaSV\nINNER JOIN MonHoc AS mh ON dk.MaMH = mh.MaMH\nWHERE sv.MaSV = 201\nORDER BY dk.HocKy, mh.MaMH;",
      "result": {
        "cols": [
          "MaSV",
          "HoTen",
          "MaMH",
          "TenMH",
          "SoTinChi",
          "HocKy",
          "DiemQT",
          "DiemCK"
        ],
        "rows": [
          [
            201,
            "Bui Minh Tuan",
            "CS101",
            "Co So Du Lieu",
            4,
            "2024A",
            8.5,
            9.0
          ],
          [
            201,
            "Bui Minh Tuan",
            "CS102",
            "Cau Truc Du Lieu & Giai Thuat",
            4,
            "2024A",
            7.0,
            8.0
          ],
          [
            201,
            "Bui Minh Tuan",
            "CS201",
            "Lap Trinh Backend Java/C#",
            3,
            "2024B",
            9.0,
            null
          ]
        ]
      },
      "note": "Một sinh viên học nhiều môn, một môn có nhiều sinh viên. Bảng trung gian DangKy dùng khóa chính phức hợp (MaSV, MaMH, HocKy) để cho phép sinh viên học cải thiện lại cùng một môn ở học kỳ khác."
    },
    {
      "title": "Ví dụ 7.2: Bảo toàn lịch sử giá bán tại thời điểm giao dịch (Chuẩn hóa 3NF đúng ngữ nghĩa nghiệp vụ)",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "SELECT ct.MaDH, dh.NgayDat, sp.MaSP, sp.TenSP,\n       sp.DonGia AS GiaNiemYetHienTai,\n       ct.DonGiaBan AS GiaLucKhachMua,\n       (sp.DonGia - ct.DonGiaBan) AS ChenhLechGia\nFROM ChiTietDon AS ct\nINNER JOIN DonHang AS dh ON ct.MaDH = dh.MaDH\nINNER JOIN SanPham AS sp ON ct.MaSP = sp.MaSP\nWHERE ct.DonGiaBan <> sp.DonGia\nORDER BY ct.MaDH;",
      "result": {
        "cols": [
          "MaDH",
          "NgayDat",
          "MaSP",
          "TenSP",
          "GiaNiemYetHienTai",
          "GiaLucKhachMua",
          "ChenhLechGia"
        ],
        "rows": [
          [
            1003,
            "2024-02-01",
            103,
            "Man Hinh Dell UltraSharp 27",
            8500,
            8400,
            100
          ],
          [
            1005,
            "2024-03-02",
            101,
            "Ban Phim Co Keychron K2",
            1800,
            1750,
            50
          ],
          [
            1007,
            "2024-03-25",
            105,
            "Laptop ThinkPad X1 Carbon",
            32000,
            31500,
            500
          ]
        ]
      },
      "note": "Nhiều sinh viên tưởng cột DonGiaBan trong ChiTietDon là dư thừa (vi phạm 3NF) vì đã có DonGia trong bảng SanPham! Thực tế: SanPham.DonGia là giá hiện tại (thay đổi theo thời gian), còn ChiTietDon.DonGiaBan phụ thuộc vào cả (MaDH, MaSP) để chốt cứng giá lúc mua!"
    },
    {
      "title": "Ví dụ 7.3: Thiết kế bảng có xóa mềm (Soft Delete) và các cột kiểm toán (Audit Columns)",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "CREATE TABLE DanhMucSanPham (\n    MaDM VARCHAR(20) NOT NULL PRIMARY KEY,\n    TenDM VARCHAR(80) NOT NULL,\n    CreatedAt DATETIME NOT NULL DEFAULT '2025-01-01 08:00:00',\n    CreatedBy VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',\n    UpdatedAt DATETIME NULL,\n    IsDeleted INT NOT NULL DEFAULT 0,\n    DeletedAt DATETIME NULL\n);\nINSERT INTO DanhMucSanPham (MaDM, TenDM, IsDeleted, DeletedAt)\nVALUES ('PK', 'Phu Kien May Tinh', 0, NULL),\n       ('OLD', 'Dia Mem Floppy', 1, '2024-01-01 10:00:00');\n-- Truy vấn của người dùng chỉ lấy các bản ghi chưa bị xóa mềm:\nSELECT MaDM, TenDM, CreatedAt FROM DanhMucSanPham WHERE IsDeleted = 0;",
      "result": {
        "cols": [
          "MaDM",
          "TenDM",
          "CreatedAt"
        ],
        "rows": [
          [
            "PK",
            "Phu Kien May Tinh",
            "2025-01-01 08:00:00"
          ]
        ]
      },
      "note": "Soft Delete dùng cờ IsDeleted = 1 (hoặc DeletedAt IS NOT NULL) thay vì DELETE vật lý, giúp bảo toàn khóa ngoại từ các đơn hàng lịch sử."
    },
    {
      "title": "Ví dụ 7.4: Giải quyết xung đột giữa Soft Delete và ràng buộc UNIQUE bằng Filtered Unique Index trong T-SQL",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "-- Khi dùng Soft Delete, nếu khách hàng xóa tài khoản (IsDeleted = 1) rồi đăng ký lại bằng cùng Email đó,\n-- ràng buộc UNIQUE thông thường trên cột Email sẽ báo lỗi trùng lặp!\n-- Giải pháp chuẩn trong SQL Server (và PostgreSQL): Chỉ kiểm tra UNIQUE trên các dòng chưa bị xóa:\nCREATE UNIQUE NONCLUSTERED INDEX UQ_KhachHang_Email_Active\nON KhachHang (Email)\nWHERE IsDeleted = 0 AND Email IS NOT NULL;",
      "result": {
        "cols": [
          "MaKH",
          "Email",
          "IsDeleted",
          "TrangThai"
        ],
        "rows": [
          [
            10,
            "user@test.com",
            1,
            "Bản ghi cũ đã xóa mềm (cho phép tồn tại)"
          ],
          [
            25,
            "user@test.com",
            0,
            "Bản ghi mới đang hoạt động (duy nhất trong nhóm IsDeleted = 0)"
          ]
        ]
      },
      "note": "Filtered Unique Index là câu trả lời ăn điểm tuyệt đối khi phỏng vấn thiết kế hệ thống có sử dụng Soft Delete. (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    }
  ],
  "dialects": [
    [
      "Kiểu dữ liệu lưu UUID/GUID",
      "UNIQUEIDENTIFIER (16 bytes)",
      "BINARY(16) hoặc CHAR(36)",
      "UUID (16 bytes gốc, cực kỳ tối ưu)"
    ],
    [
      "Sinh UUID tuần tự chống phân mảnh",
      "NEWSEQUENTIALID()",
      "UUID_TO_BIN(UUID(), 1) (MySQL 8+)",
      "uuidv7() (PostgreSQL 18+ hoặc sinh từ App)"
    ],
    [
      "Unique Index bỏ qua dòng xóa mềm",
      "CREATE UNIQUE INDEX ... WHERE IsDeleted = 0",
      "Dùng cột ảo (Generated Column) hoặc Unique(Email, DeletedAtTimestamp)",
      "CREATE UNIQUE INDEX ... WHERE is_deleted = false"
    ]
  ],
  "bridge_java": "// [Java - Spring Data JPA / Hibernate] Tự động hóa Soft Delete với @SQLRestriction (Hibernate 6.3+)\n// Thay vì phải nhớ cộng chuỗi \"WHERE is_deleted = 0\" ở mọi câu query trong dự án,\n// bạn gắn @SQLDelete và @SQLRestriction (thay cho @Where cũ đã deprecated) lên class Entity:\n\n@Entity\n@Table(name = \"SanPham\")\n@SQLDelete(sql = \"UPDATE SanPham SET IsDeleted = 1, DeletedAt = CURRENT_TIMESTAMP WHERE MaSP = ?\")\n@SQLRestriction(\"IsDeleted = 0\")\npublic class SanPhamEntity {\n    @Id\n    private Integer maSp;\n    private String tenSp;\n    private boolean isDeleted = false;\n    private LocalDateTime deletedAt;\n}",
  "bridge_csharp": "// [C# - EF Core] Tự động hóa Soft Delete toàn cục bằng Global Query Filter và Filtered Index\n// Trong OnModelCreating của DbContext, cấu hình HasQueryFilter để mọi câu LINQ đều tự động kèm WHERE IsDeleted = 0,\n// đồng thời tạo Filtered Unique Index để Email của tài khoản đã xóa mềm có thể đăng ký lại:\n\nprotected override void OnModelCreating(ModelBuilder modelBuilder)\n{\n    modelBuilder.Entity<KhachHang>(entity =>\n    {\n        // 1. Tự động lọc bỏ dòng đã xóa mềm trên toàn ứng dụng (dùng .IgnoreQueryFilters() nếu Admin muốn xem):\n        entity.HasQueryFilter(kh => !kh.IsDeleted);\n\n        // 2. Tạo Filtered Unique Index chỉ kiểm tra trùng Email trên các tài khoản đang hoạt động:\n        entity.HasIndex(kh => kh.Email)\n              .IsUnique()\n              .HasFilter(\"[IsDeleted] = 0 AND [Email] IS NOT NULL\");\n    });\n}",
  "performance": "<ul>\n  <li><strong>Bẫy hiệu năng của Soft Delete:</strong> Nếu một bảng có 90% bản ghi đã bị đánh dấu <code>IsDeleted = 1</code> và chỉ có 10% bản ghi đang hoạt động (<code>IsDeleted = 0</code>), các Index thông thường vẫn phải gánh toàn bộ 90% dữ liệu \"xác sống\" đó. Hãy sử dụng <strong>Filtered Index</strong> (kèm <code>WHERE IsDeleted = 0</code>) hoặc định kỳ chuyển các bản ghi xóa mềm quá hạn sang bảng lưu trữ (Archive Table).</li>\n  <li><strong>Đừng lạm dụng thiết kế EAV (Entity-Attribute-Value):</strong> Nhiều bạn muốn tạo \"bảng động\" nên thiết kế 3 cột <code>(EntityId, AttributeName, AttributeValue VARCHAR)</code>. Thiết kế này phá hỏng hoàn toàn kiểu dữ liệu, không thể dùng ràng buộc <code>FOREIGN KEY</code> và biến một câu truy vấn lọc 5 thuộc tính thành 5 phép <code>SELF JOIN</code> cực kỳ chậm chạp. Nếu cần lưu thuộc tính động theo từng loại sản phẩm (ví dụ Laptop có dung lượng RAM, Áo thun có kích cỡ), hãy giữ các cột cố định trên bảng chính và dùng một cột <strong><code>JSON</code></strong> (Chương 13) cho phần thuộc tính mở rộng.</li>\n</ul>",
  "common_errors": [
    "Lưu danh sách khóa ngoại ngăn cách bằng dấu phẩy (ví dụ cột TagIds = '1,4,9') trong một cột VARCHAR thay vì tách bảng trung gian: Vi phạm ngay 1NF, không thể gắn Foreign Key và không thể dùng Index khi JOIN.",
    "Dùng UUID v4 ngẫu nhiên (Guid.NewGuid() / UUID.randomUUID()) làm Clustered Primary Key trên SQL Server hoặc MySQL InnoDB: Gây hiện tượng Page Split liên tục làm tốc độ INSERT giảm thê thảm khi bảng lớn.",
    "Áp dụng Soft Delete (IsDeleted = 1) nhưng giữ nguyên ràng buộc UNIQUE truyền thống trên cột Email/Username, khiến người dùng sau khi xóa tài khoản không bao giờ đăng ký lại bằng email cũ được nữa.",
    "Không lưu lại đơn giá bán (DonGiaBan) vào bảng ChiTietDon mà chỉ JOIN sang bảng SanPham để lấy DonGia hiện tại, làm toàn bộ báo cáo doanh thu quá khứ bị nhảy số mỗi khi cửa hàng điều chỉnh giá bán.",
    "Dùng CASCADE DELETE bừa bãi trên bảng KhachHang hoặc SanPham: Một thao tác xóa nhầm sản phẩm ngừng kinh doanh có thể âm thầm xóa sạch hàng chục nghìn dòng chi tiết hóa đơn lịch sử!"
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "Hãy giải thích ngắn gọn 3 dạng chuẩn 1NF, 2NF và 3NF bằng một ví dụ thực tế.",
      "a_short": "1NF yêu cầu mỗi ô chỉ chứa 1 giá trị đơn (không lưu mảng/dấu phẩy); 2NF yêu cầu các cột không khóa phải phụ thuộc vào toàn bộ khóa chính phức hợp; 3NF yêu cầu các cột không khóa không được phụ thuộc bắc cầu qua một cột không khóa khác.",
      "a_long": "Ví dụ với bảng Đơn hàng: (1) Nếu cột SảnPhẩm lưu 'Áo, Quần' trong 1 ô là vi phạm 1NF -> phải tách thành 2 dòng. (2) Khi tách thành bảng ChiTiếtĐơn có khóa chính gồm 2 cột (MãĐơn, MãSP), nếu ta để cột TênSP ở bảng này thì TênSP chỉ phụ thuộc vào MãSP chứ không phụ thuộc vào MãĐơn (vi phạm 2NF) -> phải tách TênSP ra bảng SảnPhẩm. (3) Trong bảng ĐơnHàng có khóa chính là MãĐơn, nếu lưu cả MãKH và TênKH thì MãĐơn suy ra MãKH, rồi MãKH suy ra TênKH (phụ thuộc bắc cầu, vi phạm 3NF) -> phải tách TênKH ra bảng KháchHàng."
    },
    {
      "level": "Junior",
      "q": "Khi thiết kế tính năng Xóa mềm (Soft Delete bằng cột IsDeleted), bạn sẽ gặp những vấn đề gì với ràng buộc Khóa ngoại (Foreign Key) và ràng buộc Duy nhất (Unique Constraint)? Cách xử lý?",
      "a_short": "Với Unique Constraint: bản ghi đã xóa mềm vẫn chiếm giữ giá trị duy nhất (như Email), cần thay bằng Filtered Unique Index (WHERE IsDeleted = 0). Với Foreign Key: DB không biết dòng cha đã xóa mềm nên bảng con vẫn trỏ tới được, cần kiểm tra ở tầng ứng dụng và dùng Global Query Filter.",
      "a_long": "Xóa mềm thực chất là lệnh UPDATE IsDeleted = 1 nên đối với Database Engine, dòng dữ liệu đó vẫn đang tồn tại vật lý. Hệ quả thứ nhất: Ràng buộc UNIQUE trên cột Email sẽ chặn không cho tạo tài khoản mới trùng Email với tài khoản đã xóa; khắc phục bằng Filtered Unique Index: CREATE UNIQUE INDEX ... ON Users(Email) WHERE IsDeleted = 0. Hệ quả thứ hai: Khi JOIN từ bảng khác sang bảng xóa mềm, nếu quên điều kiện AND t.IsDeleted = 0 trong mệnh đề ON sẽ làm lộ dữ liệu đã xóa; khắc phục bằng Global Query Filter trong EF Core hoặc @SQLRestriction trong Hibernate."
    },
    {
      "level": "Mid",
      "q": "So sánh ưu nhược điểm của việc dùng BIGINT tự tăng (Identity) và UUID/GUID làm khóa chính (Primary Key). Khi nào nên dùng UUID v7?",
      "a_short": "BIGINT tốn 8 bytes, tăng tuần tự nên rất tốt cho B-Tree Clustered Index nhưng dễ lộ quy mô dữ liệu và khó sinh phân tán. UUID v4 tốn 16 bytes, sinh độc lập ở client nhưng vì ngẫu nhiên nên gây phân mảnh trang đĩa (Page Split). UUID v7 kết hợp 48-bit timestamp ở đầu với phần ngẫu nhiên ở sau, khắc phục hoàn toàn nhược điểm phân mảnh B-Tree của UUID v4.",
      "a_long": "Trong SQL Server và MySQL (InnoDB), bảng dữ liệu được sắp xếp vật lý theo Clustered Index (mặc định là Primary Key). Nếu dùng UUID v4 hoàn toàn ngẫu nhiên, mỗi dòng INSERT mới sẽ chèn vào một trang đĩa (8KB/16KB) bất kỳ ở giữa cây B-Tree. Khi trang đó đầy, DB phải tách trang làm đôi (Page Split), di chuyển 50% dữ liệu sang trang mới và ghi log nặng nề. UUID v7 (chuẩn RFC 9562) đặt dấu thời gian Unix Epoch mili-giây vào 48 bit cao nhất, giúp các mã UUID sinh ra sau luôn lớn hơn mã sinh ra trước, nhờ đó chèn tuần tự vào cuối cây B-Tree mượt mà gần như BIGINT mà vẫn giữ được khả năng sinh ID độc lập ở tầng ứng dụng."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 7.1: Phát hiện sự lệch nhau giữa tổng tiền lưu sẵn và tổng tiền tính từ chi tiết (Kiểm tra tính nhất quán)",
      "problem": "Trên CSDL ShopOnline, hãy viết câu truy vấn tính tổng tiền thực tế của từng đơn hàng từ bảng ChiTietDon: TongChiTiet = SUM(SoLuong * DonGiaBan - COALESCE(ChietKhau, 0)) + dh.PhiShip. Hiển thị MaDH, TrangThai, PhiShip và TongChiTiet cho tất cả các đơn hàng trong bảng DonHang, sắp xếp theo MaDH tăng dần.",
      "intuition": "Nối DonHang với ChiTietDon, gom nhóm theo dh.MaDH, dh.TrangThai, dh.PhiShip và cộng dh.PhiShip ở ngoài hàm SUM(ct...).",
      "trace": "Cẩn thận: không đặt dh.PhiShip vào bên trong hàm SUM() vì một đơn có 2 dòng chi tiết sẽ làm PhiShip bị cộng gấp đôi!",
      "sql": "SELECT dh.MaDH, dh.TrangThai, dh.PhiShip,\n       SUM(ct.SoLuong * ct.DonGiaBan - COALESCE(ct.ChietKhau, 0)) + dh.PhiShip AS TongChiTiet\nFROM DonHang AS dh\nINNER JOIN ChiTietDon AS ct ON dh.MaDH = ct.MaDH\nGROUP BY dh.MaDH, dh.TrangThai, dh.PhiShip\nORDER BY dh.MaDH ASC;",
      "db": "shoponline",
      "expected": {
        "cols": [
          "MaDH",
          "TrangThai",
          "PhiShip",
          "TongChiTiet"
        ],
        "rows": [
          [
            1001,
            "HOAN_THANH",
            30,
            2430
          ],
          [
            1002,
            "HOAN_THANH",
            0,
            8700
          ],
          [
            1003,
            "HOAN_THANH",
            25,
            16625
          ],
          [
            1004,
            "DA_HUY",
            40,
            32040
          ],
          [
            1005,
            "HOAN_THANH",
            0,
            5650
          ],
          [
            1006,
            "DANG_GIAO",
            30,
            6930
          ],
          [
            1007,
            "HOAN_THANH",
            0,
            31350
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "PhiShip là thuộc tính ở cấp độ Đơn hàng (1NF/2NF của bảng DonHang), nên phải cộng ở ngoài hàm SUM của ChiTietDon.",
        "GROUP BY dh.MaDH, dh.TrangThai, dh.PhiShip rồi tính SUM(...) + dh.PhiShip.",
        "SELECT dh.MaDH, dh.TrangThai, dh.PhiShip, SUM(ct.SoLuong * ct.DonGiaBan - COALESCE(ct.ChietKhau, 0)) + dh.PhiShip AS TongChiTiet FROM DonHang AS dh INNER JOIN ChiTietDon AS ct ON dh.MaDH = ct.MaDH GROUP BY dh.MaDH, dh.TrangThai, dh.PhiShip ORDER BY dh.MaDH ASC;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 7.2: Truy vấn chuỗi giới thiệu khách hàng (Quan hệ tự tham chiếu 1-Nhiều)",
      "problem": "Trên CSDL ShopOnline, cột NguoiGioiThieu trong bảng KhachHang lưu MaKH của người đã giới thiệu khách hàng đó. Hãy liệt kê MaKH, HoTen, HangThe của những khách hàng được giới thiệu bởi người khác, kèm theo cột TenNguoiGioiThieu. Sắp xếp theo MaKH tăng dần.",
      "intuition": "Dùng INNER JOIN từ bảng KhachHang (kh) sang chính bảng KhachHang (gt) với điều kiện kh.NguoiGioiThieu = gt.MaKH.",
      "trace": "Khách 2 và 3 được giới thiệu bởi 1 (Nguyen Van An). Khách 4 được giới thiệu bởi 2 (Tran Thi Binh). Khách 6 được giới thiệu bởi 4 (Pham Minh Dung).",
      "sql": "SELECT kh.MaKH, kh.HoTen, kh.HangThe,\n       gt.HoTen AS TenNguoiGioiThieu\nFROM KhachHang AS kh\nINNER JOIN KhachHang AS gt ON kh.NguoiGioiThieu = gt.MaKH\nORDER BY kh.MaKH ASC;",
      "db": "shoponline",
      "expected": {
        "cols": [
          "MaKH",
          "HoTen",
          "HangThe",
          "TenNguoiGioiThieu"
        ],
        "rows": [
          [
            2,
            "Tran Thi Binh",
            "BAC",
            "Nguyen Van An"
          ],
          [
            3,
            "Le Hoang Cuong",
            "DONG",
            "Nguyen Van An"
          ],
          [
            4,
            "Pham Minh Dung",
            "VANG",
            "Tran Thi Binh"
          ],
          [
            6,
            "Hoang Gia Huy",
            "BAC",
            "Pham Minh Dung"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Quan hệ 1-Nhiều tự tham chiếu được thiết kế bằng cách đặt cột khóa ngoại NguoiGioiThieu ngay trong bảng KhachHang.",
        "SELECT kh.MaKH, kh.HoTen, kh.HangThe, gt.HoTen AS TenNguoiGioiThieu FROM KhachHang kh INNER JOIN KhachHang gt ON ...;",
        "SELECT kh.MaKH, kh.HoTen, kh.HangThe, gt.HoTen AS TenNguoiGioiThieu FROM KhachHang AS kh INNER JOIN KhachHang AS gt ON kh.NguoiGioiThieu = gt.MaKH ORDER BY kh.MaKH ASC;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch07_p1",
      "title": "Tách bảng phi chuẩn hóa thành mô hình chuẩn 3NF trong thực tế",
      "difficulty": "Khá",
      "db": "truonghoc",
      "summary": "Trên CSDL TruongHoc đã được chuẩn hóa 3NF (gồm Khoa, SinhVien, MonHoc, DangKy), hãy viết truy vấn tái tạo lại 'Bảng điểm tổng hợp' gồm: MaSV, HoTen, TenKhoa (khoa của sinh viên), MaMH, TenMH, SoTinChi, HocKy, DiemCK cho học kỳ '2024A'. Sắp xếp theo MaSV tăng dần, MaMH tăng dần.",
      "understand": "Nhờ chuẩn hóa 3NF, tên khoa và tên môn học chỉ lưu 1 lần duy nhất ở bảng Khoa và MonHoc. Khi cần xuất báo cáo phẳng (Flat view), ta nối 4 bảng lại với nhau.",
      "brute": "Lưu lặp lại TenKhoa và TenMH vào từng dòng của bảng DangKy (vi phạm 2NF và 3NF).",
      "optimal": "JOIN SinhVien với Khoa (theo sv.MaKhoa = k.MaKhoa), DangKy (theo sv.MaSV = dk.MaSV) và MonHoc (theo dk.MaMH = mh.MaMH).",
      "trace": "Lưu ý: cả bảng SinhVien và bảng MonHoc đều có cột MaKhoa! Đề yêu cầu lấy TenKhoa của sinh viên nên nối Khoa theo sv.MaKhoa = k.MaKhoa.",
      "sql": "SELECT sv.MaSV, sv.HoTen, k.TenKhoa,\n       mh.MaMH, mh.TenMH, mh.SoTinChi,\n       dk.HocKy, dk.DiemCK\nFROM SinhVien AS sv\nINNER JOIN Khoa AS k ON sv.MaKhoa = k.MaKhoa\nINNER JOIN DangKy AS dk ON sv.MaSV = dk.MaSV\nINNER JOIN MonHoc AS mh ON dk.MaMH = mh.MaMH\nWHERE dk.HocKy = '2024A'\nORDER BY sv.MaSV ASC, mh.MaMH ASC;",
      "expected": {
        "cols": [
          "MaSV",
          "HoTen",
          "TenKhoa",
          "MaMH",
          "TenMH",
          "SoTinChi",
          "HocKy",
          "DiemCK"
        ],
        "rows": [
          [
            201,
            "Bui Minh Tuan",
            "Cong Nghe Thong Tin",
            "CS101",
            "Co So Du Lieu",
            4,
            "2024A",
            9.0
          ],
          [
            201,
            "Bui Minh Tuan",
            "Cong Nghe Thong Tin",
            "CS102",
            "Cau Truc Du Lieu & Giai Thuat",
            4,
            "2024A",
            8.0
          ],
          [
            202,
            "Doan Thu Ha",
            "Cong Nghe Thong Tin",
            "CS101",
            "Co So Du Lieu",
            4,
            "2024A",
            9.5
          ],
          [
            202,
            "Doan Thu Ha",
            "Cong Nghe Thong Tin",
            "CS102",
            "Cau Truc Du Lieu & Giai Thuat",
            4,
            "2024A",
            9.0
          ],
          [
            203,
            "Ngo Quang Khai",
            "Cong Nghe Thong Tin",
            "CS101",
            "Co So Du Lieu",
            4,
            "2024A",
            4.0
          ],
          [
            204,
            "Ly Ngoc Mai",
            "Kinh Te Doi Ngoai",
            "EC101",
            "Kinh Te Vi Mo",
            3,
            "2024A",
            7.5
          ],
          [
            205,
            "Trinh Gia Bao",
            "Dien Tu Vien Thong",
            "EE101",
            "Mach Dien Tu",
            3,
            "2024A",
            null
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Nối nhầm bảng Khoa với mh.MaKhoa thay vì sv.MaKhoa (vì sinh viên khoa KT có thể đăng ký học môn của khoa CNTT!).",
      "note3": {
        "idea": "Chuẩn hóa 3NF tách các phụ thuộc hàm bộ phận và bắc cầu ra bảng riêng; khi lên báo cáo thì dùng JOIN để tái tạo góc nhìn tổng hợp.",
        "syntax": "FROM SinhVien sv JOIN Khoa k ON sv.MaKhoa = k.MaKhoa JOIN DangKy dk ON ... JOIN MonHoc mh ON ...",
        "trap": "Khi nhiều bảng cùng có khóa ngoại trỏ về một bảng danh mục (như Khoa của SinhVien khác với Khoa quản lý MonHoc), phải đọc kỹ nghiệp vụ để nối đúng cột."
      }
    }
  ],
  "summary_table": [
    [
      "1NF (Dạng chuẩn 1)",
      "Mọi giá trị trong ô là nguyên tử (Atomic), không có nhóm lặp",
      "Tách danh sách ngăn cách dấu phẩy thành các dòng"
    ],
    [
      "2NF (Dạng chuẩn 2)",
      "Đạt 1NF + Không có phụ thuộc hàm bộ phận vào khóa chính ghép",
      "Tách thuộc tính chỉ phụ thuộc 1 phần khóa ra bảng riêng"
    ],
    [
      "3NF (Dạng chuẩn 3)",
      "Đạt 2NF + Không có phụ thuộc hàm bắc cầu (A -> B -> C)",
      "Tách bảng danh mục (như Khoa, Tỉnh/Thành) ra riêng"
    ],
    [
      "Junction Table (Bảng trung gian)",
      "Giải quyết quan hệ Nhiều-Nhiều (N-N) bằng 2 khóa ngoại",
      "Khóa chính thường là cặp (FK1, FK2)"
    ],
    [
      "Soft Delete + Filtered Index",
      "Đánh dấu IsDeleted = 1 thay vì xóa vật lý",
      "Dùng UNIQUE INDEX ... WHERE IsDeleted = 0"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Một bảng có khóa chính chỉ gồm duy nhất 1 cột (ví dụ MaNV) và đã đạt chuẩn 1NF. Hỏi bảng đó có chắc chắn đạt chuẩn 2NF hay không? Vì sao?",
      "a": "Chắc chắn đạt 2NF! Vì 2NF cấm thuộc tính không khóa phụ thuộc vào 'một phần' của khóa chính; khi khóa chính chỉ có 1 cột đơn lẻ thì không thể tồn tại phụ thuộc một phần."
    },
    {
      "q": "Câu 2: Trong bảng ChiTietDon(MaDH, MaSP, SoLuong, DonGiaBan), tại sao việc lưu cột DonGiaBan không bị coi là thiết kế sai dù trong bảng SanPham đã có cột DonGia?",
      "a": "Vì SanPham.DonGia là giá niêm yết hiện tại (có thể tăng/giảm theo thời gian), còn ChiTietDon.DonGiaBan là giá thực tế chốt tại thời điểm khách đặt đơn hàng đó (phụ thuộc vào cả MaDH và MaSP)."
    },
    {
      "q": "Câu 3: Để biểu diễn mối quan hệ Nhiều-Nhiều (Many-to-Many) giữa bảng Sách (Books) và bảng Tác giả (Authors), ta cần tối thiểu mấy bảng tất cả?",
      "a": "Cần tối thiểu 3 bảng: bảng Books, bảng Authors và bảng trung gian BooksAuthors chứa hai khóa ngoại (BookId, AuthorId)."
    }
  ]
});
