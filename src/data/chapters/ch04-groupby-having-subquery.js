/**
 * FILE: src/data/chapters/ch04-groupby-having-subquery.js
 * MÔ TẢ: Chương 4 - Gom Nhóm (GROUP BY, HAVING), Hàm Tổng Hợp, Subquery & EXISTS
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch04",
  "code": "Chương 4",
  "title": "Gom Nhóm (GROUP BY, HAVING), Hàm Tổng Hợp, Subquery & EXISTS",
  "sources": [
    "S ch.7, 17, 39, 42, 52",
    "M ch.23, 43, 79"
  ],
  "goals": [
    "Nắm vững cơ chế hoạt động của 5 hàm tổng hợp chuẩn (COUNT, SUM, AVG, MIN, MAX) và cách chúng đối xử với NULL.",
    "Hiểu rõ quy tắc gom nhóm GROUP BY và phân biệt rành mạch điều kiện lọc ở WHERE với điều kiện lọc ở HAVING.",
    "Phân loại được 3 dạng truy vấn con: Scalar Subquery (trả về 1 ô), Derived Table (bảng dẫn xuất ở FROM) và Correlated Subquery (truy vấn con tương quan).",
    "Biết khi nào nên dùng EXISTS / NOT EXISTS thay cho IN / NOT IN để tối ưu hiệu năng và tránh bẫy NULL."
  ],
  "signals": [
    "Xây dựng trang thống kê (Dashboard) đếm số đơn hàng, tính tổng doanh thu theo từng tháng, từng danh mục hoặc từng chi nhánh.",
    "Lọc các nhóm đạt ngưỡng tổng hợp (ví dụ: tìm khách hàng có tổng chi tiêu trên 10 triệu, tìm email xuất hiện từ 2 lần trở lên).",
    "Kiểm tra sự tồn tại của bản ghi liên kết (tìm khách hàng từng mua mặt hàng X nhưng chưa từng mua mặt hàng Y)."
  ],
  "theory": "<h3>4.1. Các hàm tổng hợp (Aggregate Functions) và thái độ với NULL</h3>\n<p>Các hàm tổng hợp gom nhiều dòng dữ liệu lại để tính ra một giá trị duy nhất cho mỗi nhóm. Quy tắc vàng cần nhớ: <strong>Tất cả các hàm tổng hợp (<code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code>, <code>COUNT(cột)</code>) đều âm thầm BỎ QUA các giá trị <code>NULL</code>, ngoại trừ duy nhất <code>COUNT(*)</code>!</strong></p>\n<ul>\n  <li><code>COUNT(*)</code>: Đếm tổng số dòng vật lý trong nhóm, bất kể dòng đó toàn giá trị <code>NULL</code> hay không.</li>\n  <li><code>COUNT(ten_cot)</code>: Chỉ đếm những dòng mà <code>ten_cot</code> <strong>khác NULL</strong>.</li>\n  <li><code>COUNT(DISTINCT ten_cot)</code>: Chỉ đếm số lượng giá trị <strong>khác nhau và khác NULL</strong> của cột đó.</li>\n  <li><code>AVG(ten_cot)</code>: Tính bằng <code>SUM(ten_cot) / COUNT(ten_cot)</code>. Vì mẫu số là số dòng khác NULL, nếu một lớp có 3 sinh viên với học bổng là <code>6000, 0, NULL</code>, thì <code>AVG(HocBong)</code> sẽ tính <code>(6000 + 0) / 2 = 3000</code> chứ không chia cho 3! Muốn tính người NULL là 0 đồng, bạn phải viết <code>AVG(COALESCE(HocBong, 0))</code>.</li>\n</ul>\n\n<h3>4.2. Luật thép của GROUP BY và sự khác biệt giữa WHERE vs HAVING</h3>\n<p>Khi một câu truy vấn có mặt <code>GROUP BY</code>, mọi cột xuất hiện ở mệnh đề <code>SELECT</code> (hoặc <code>ORDER BY</code>) <strong>bắt buộc phải thuộc một trong hai diện sau</strong>:</p>\n<ol>\n  <li>Hoặc cột đó <strong>nằm trong danh sách <code>GROUP BY</code></strong> (đóng vai trò làm khóa định danh nhóm).</li>\n  <li>Hoặc cột đó <strong>được bọc bên trong một hàm tổng hợp</strong> (<code>SUM</code>, <code>COUNT</code>, <code>MAX</code>, <code>MIN</code>, <code>AVG</code>).</li>\n</ol>\n<p>Tại sao? Hãy tưởng tượng bạn gom nhóm sinh viên theo <code>MaKhoa</code> (mỗi khoa có 50 sinh viên), nhưng ở <code>SELECT</code> bạn lại đòi lấy cột <code>HoTen</code> trần trụi mà không bọc hàm tổng hợp. Máy chủ sẽ bối rối không biết phải lấy tên của ai trong 50 sinh viên đó để hiển thị trên 1 dòng duy nhất của khoa! (Lưu ý: SQLite và MySQL khi tắt chế độ <code>ONLY_FULL_GROUP_BY</code> có thể cho phép chạy nhưng sẽ bốc đại một dòng ngẫu nhiên, còn SQL Server, PostgreSQL và Oracle sẽ báo lỗi cú pháp ngay lập tức).</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Tiêu chí</th>\n      <th>Mệnh đề WHERE</th>\n      <th>Mệnh đề HAVING</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>Thời điểm chạy</strong></td>\n      <td>Chạy <strong>TRƯỚC</strong> khi gom nhóm (<code>GROUP BY</code>).</td>\n      <td>Chạy <strong>SAU</strong> khi đã gom nhóm và tính xong hàm tổng hợp.</td>\n    </tr>\n    <tr>\n      <td><strong>Đối tượng lọc</strong></td>\n      <td>Lọc từng <strong>dòng rời rạc</strong> (Row-level filter).</td>\n      <td>Lọc từng <strong>nhóm đã gộp</strong> (Group-level filter).</td>\n    </tr>\n    <tr>\n      <td><strong>Dùng hàm tổng hợp?</strong></td>\n      <td><strong>Không được phép</strong> viết <code>WHERE SUM(x) &gt; 10</code>.</td>\n      <td><strong>Được phép</strong> (và sinh ra để) viết <code>HAVING SUM(x) &gt; 10</code>.</td>\n    </tr>\n  </tbody>\n</table>\n\n<h3>4.3. Truy vấn con (Subquery) và cuộc so găng IN / NOT IN vs EXISTS / NOT EXISTS</h3>\n<p>Truy vấn con là một câu lệnh <code>SELECT</code> đặt trong cặp ngoặc đơn <code>(...)</code> lồng bên trong một câu lệnh khác. Khi cần kiểm tra một dòng ở bảng ngoài có khớp với dữ liệu ở bảng trong hay không, bạn hãy nắm vững quy tắc chọn lựa giữa <code>IN</code> và <code>EXISTS</code>:</p>\n<ul>\n  <li><strong>Cơ chế của <code>EXISTS (subquery)</code>:</strong> Trả về <code>TRUE</code> ngay khoảnh khắc tìm thấy <strong>dòng đầu tiên</strong> thỏa mãn trong subquery và lập tức dừng quét tiếp (Short-circuit evaluation). Vì nó chỉ kiểm tra có dòng hay không chứ không đọc giá trị cột, bạn viết <code>SELECT 1</code>, <code>SELECT *</code> hay <code>SELECT 1/0</code> bên trong <code>EXISTS</code> thì trình tối ưu cũng bỏ qua danh sách cột đó.</li>\n  <li><strong>Tại sao <code>NOT EXISTS</code> luôn thắng <code>NOT IN</code>?</strong> Như đã phân tích ở Chương 1, nếu cột được lấy trong <code>NOT IN (SELECT col ...)</code> có chứa dù chỉ một giá trị <code>NULL</code>, toàn bộ phép <code>NOT IN</code> sẽ trả về 0 dòng. Ngược lại, <code>NOT EXISTS</code> kiểm tra sự tồn tại của dòng khớp nên hoàn toàn miễn nhiễm với bẫy <code>NULL</code>, đồng thời tận dụng được phép toán vật lý <em>Anti Semi Join</em> rất hiệu quả trên Index.</li>\n</ul>",
  "mechanism": "<h3>Chạy tay từng bước: Toàn cảnh thứ tự thực thi 7 bước của một câu lệnh SQL</h3>\n<p>Đây là kiến thức nền tảng xuất hiện trong hầu hết các buổi phỏng vấn Backend. Hãy bấm sang <strong>Bộ Mô Phỏng Trực Quan &rarr; Thứ Tự Thực Thi SQL</strong> để xem hoạt ảnh từng bước, hoặc theo dõi bảng chạy tay dưới đây cho câu lệnh tìm các phòng ban có tổng lương nhân viên nhận từ năm 2005 trở đi lớn hơn 1000:</p>\n<pre class=\"code-block\"><code>SELECT DepartmentId, COUNT(*) AS SoNV, SUM(Salary) AS TongLuong\nFROM Employees\nWHERE HireDate >= '2005-01-01'\nGROUP BY DepartmentId\nHAVING SUM(Salary) > 1000\nORDER BY TongLuong DESC;</code></pre>\n<div class=\"trace-steps\">\n  <div class=\"trace-step\"><strong>Bước 1 - FROM Employees:</strong> Nạp 6 dòng nhân viên từ bảng gốc.</div>\n  <div class=\"trace-step\"><strong>Bước 2 - WHERE HireDate &gt;= '2005-01-01':</strong> Loại bỏ dòng của James Smith (HireDate = '2002-01-01'). Còn lại 5 dòng: John (Dept 1, 400), Michael (Dept 2, 600), Johnathon (Dept 1, 500), William (Dept 3, 800), Sarah (Dept 3, 750).</div>\n  <div class=\"trace-step\"><strong>Bước 3 - GROUP BY DepartmentId:</strong> Gom 5 dòng còn lại vào 3 xô (nhóm) theo mã phòng ban:\n    <ul>\n      <li>Xô <code>DepartmentId = 1</code>: gồm {John (400), Johnathon (500)} &rarr; <code>COUNT(*) = 2</code>, <code>SUM(Salary) = 900</code>.</li>\n      <li>Xô <code>DepartmentId = 2</code>: gồm {Michael (600)} &rarr; <code>COUNT(*) = 1</code>, <code>SUM(Salary) = 600</code>.</li>\n      <li>Xô <code>DepartmentId = 3</code>: gồm {William (800), Sarah (750)} &rarr; <code>COUNT(*) = 2</code>, <code>SUM(Salary) = 1550</code>.</li>\n    </ul>\n  </div>\n  <div class=\"trace-step\"><strong>Bước 4 - HAVING SUM(Salary) &gt; 1000:</strong> Kiểm tra từng xô sau gom nhóm. Xô 1 (900) và Xô 2 (600) bị loại! Chỉ còn duy nhất <strong>Xô 3 (1550)</strong> vượt qua cửa ải HAVING.</div>\n  <div class=\"trace-step\"><strong>Bước 5 - SELECT:</strong> Chiếu ra 3 cột <code>DepartmentId (3), SoNV (2), TongLuong (1550)</code>.</div>\n  <div class=\"trace-step\"><strong>Bước 6 - ORDER BY TongLuong DESC:</strong> Sắp xếp kết quả cuối cùng.</div>\n</div>",
  "examples": [
    {
      "title": "Ví dụ 4.1: Sự khác biệt giữa COUNT(*), COUNT(cột) và COUNT(DISTINCT cột)",
      "label": "CHUAN",
      "db": "truonghoc",
      "sql": "SELECT COUNT(*) AS TongSoDong,\n       COUNT(HocBong) AS SoSVCoHocBongKhacNull,\n       COUNT(DISTINCT MaKhoa) AS SoKhoaCoSinhVien,\n       AVG(HocBong) AS TB_BoQuaNull,\n       AVG(COALESCE(HocBong, 0)) AS TB_TinhCaNullLa0\nFROM SinhVien;",
      "result": {
        "cols": [
          "TongSoDong",
          "SoSVCoHocBongKhacNull",
          "SoKhoaCoSinhVien",
          "TB_BoQuaNull",
          "TB_TinhCaNullLa0"
        ],
        "rows": [
          [
            6,
            4,
            3,
            4000.0,
            2666.6666666666665
          ]
        ]
      },
      "note": "COUNT(*) đếm mọi dòng (6 dòng). COUNT(HocBong) bỏ qua 2 dòng NULL nên trả về 4. Đặc biệt chú ý AVG(HocBong) chia cho 4 (ra 4000), còn AVG(COALESCE(HocBong, 0)) chia cho 6 (ra 2666.67)!"
    },
    {
      "title": "Ví dụ 4.2: Gom nhóm GROUP BY kết hợp lọc sau gom nhóm bằng HAVING",
      "label": "CHUAN",
      "db": "autoshop",
      "sql": "SELECT d.Id AS DeptId, d.Name AS TenPhong,\n       COUNT(e.Id) AS SoNhanVien,\n       SUM(e.Salary) AS TongQuyLuong,\n       ROUND(AVG(e.Salary), 2) AS LuongTrungBinh\nFROM Departments AS d\nLEFT JOIN Employees AS e ON d.Id = e.DepartmentId\nGROUP BY d.Id, d.Name\nHAVING COUNT(e.Id) >= 1\nORDER BY TongQuyLuong DESC;",
      "result": {
        "cols": [
          "DeptId",
          "TenPhong",
          "SoNhanVien",
          "TongQuyLuong",
          "LuongTrungBinh"
        ],
        "rows": [
          [
            1,
            "HR",
            3,
            1900,
            633.33
          ],
          [
            3,
            "Tech",
            2,
            1550,
            775.0
          ],
          [
            2,
            "Sales",
            1,
            600,
            600.0
          ]
        ]
      },
      "note": "Phải dùng COUNT(e.Id) thay vì COUNT(*) khi đi kèm LEFT JOIN, vì phòng Legal không có nhân viên nào nhưng nếu viết COUNT(*) thì dòng NULL của Legal vẫn bị đếm thành 1!"
    },
    {
      "title": "Ví dụ 4.3: Tổng hợp có điều kiện (Conditional Aggregation) bằng CASE bên trong SUM/COUNT",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "SELECT COUNT(*) AS TongSoDon,\n       SUM(CASE WHEN TrangThai = 'HOAN_THANH' THEN 1 ELSE 0 END) AS DonHoanThanh,\n       SUM(CASE WHEN TrangThai = 'DA_HUY' THEN 1 ELSE 0 END) AS DonDaHuy,\n       SUM(CASE WHEN TrangThai = 'DANG_GIAO' THEN 1 ELSE 0 END) AS DonDangGiao\nFROM DonHang;",
      "result": {
        "cols": [
          "TongSoDon",
          "DonHoanThanh",
          "DonDaHuy",
          "DonDangGiao"
        ],
        "rows": [
          [
            7,
            5,
            1,
            1
          ]
        ]
      },
      "note": "Kỹ thuật SUM(CASE WHEN ... THEN 1 ELSE 0 END) cực kỳ hữu ích khi làm Dashboard thống kê nhiều trạng thái chỉ trong 1 lần quét bảng."
    },
    {
      "title": "Ví dụ 4.4: Truy vấn con tương quan (Correlated Subquery) tìm nhân viên lương cao hơn trung bình phòng ban",
      "label": "CHUAN",
      "db": "autoshop",
      "sql": "SELECT e1.Id, e1.FName, e1.DepartmentId, e1.Salary\nFROM Employees AS e1\nWHERE e1.Salary > (\n    SELECT AVG(e2.Salary)\n    FROM Employees AS e2\n    WHERE e2.DepartmentId = e1.DepartmentId\n)\nORDER BY e1.DepartmentId, e1.Salary DESC;",
      "result": {
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
            5,
            "William",
            3,
            800
          ]
        ]
      },
      "note": "Subquery bên trong tham chiếu tới e1.DepartmentId của câu ngoài để tính mức lương trung bình riêng của đúng phòng ban đó."
    },
    {
      "title": "Ví dụ 4.5: Kiểm tra tồn tại với EXISTS và NOT EXISTS (An toàn tuyệt đối trước NULL)",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "SELECT kh.MaKH, kh.HoTen, kh.ThanhPho\nFROM KhachHang AS kh\nWHERE NOT EXISTS (\n    SELECT 1\n    FROM DonHang AS dh\n    WHERE dh.MaKH = kh.MaKH\n      AND dh.TrangThai = 'HOAN_THANH'\n)\nORDER BY kh.MaKH;",
      "result": {
        "cols": [
          "MaKH",
          "HoTen",
          "ThanhPho"
        ],
        "rows": [
          [
            3,
            "Le Hoang Cuong",
            "Da Nang"
          ],
          [
            5,
            "Vo Thi Em",
            "TP Ho Chi Minh"
          ],
          [
            6,
            "Hoang Gia Huy",
            "Can Tho"
          ]
        ]
      },
      "note": "NOT EXISTS trả về TRUE khi subquery không tìm thấy dòng nào khớp. Khác với NOT IN, NOT EXISTS không bao giờ bị tê liệt bởi giá trị NULL."
    },
    {
      "title": "Ví dụ 4.6: Tính tổng phụ và tổng cộng báo cáo bằng GROUP BY ROLLUP trong T-SQL",
      "label": "TSQL",
      "db": "autoshop",
      "sql": "SELECT COALESCE(CAST(DepartmentId AS VARCHAR(10)), 'TONG_CONG') AS PhongBan,\n       COUNT(*) AS SoNV,\n       SUM(Salary) AS QuyLuong\nFROM Employees\nGROUP BY ROLLUP (DepartmentId);",
      "result": {
        "cols": [
          "PhongBan",
          "SoNV",
          "QuyLuong"
        ],
        "rows": [
          [
            "1",
            3,
            1900
          ],
          [
            "2",
            1,
            600
          ],
          [
            "3",
            2,
            1550
          ],
          [
            "TONG_CONG",
            6,
            4050
          ]
        ]
      },
      "note": "Trong T-SQL (và PostgreSQL/MySQL), ROLLUP và CUBE giúp sinh dòng tổng cộng (Grand Total) ngay trong câu truy vấn. Bản [CHUẨN] trên SQLite có thể dùng UNION ALL với một câu SELECT tổng. (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    }
  ],
  "dialects": [
    [
      "Gom chuỗi nhiều dòng thành 1 chuỗi",
      "STRING_AGG(col, ', ') WITHIN GROUP (ORDER BY col) (SQL 2017+)",
      "GROUP_CONCAT(col ORDER BY col SEPARATOR ', ')",
      "STRING_AGG(col, ', ' ORDER BY col) (SQLite: GROUP_CONCAT)"
    ],
    [
      "Tổng hợp có điều kiện",
      "SUM(CASE WHEN ... END) hoặc IIF",
      "SUM(CASE WHEN ... END)",
      "COUNT(*) FILTER (WHERE ...) (rất gọn trong Postgres & SQLite 3.30+)"
    ],
    [
      "Báo cáo tổng phụ nhiều chiều",
      "GROUP BY ROLLUP(...), CUBE(...), GROUPING SETS",
      "GROUP BY ... WITH ROLLUP",
      "GROUP BY ROLLUP(...), CUBE(...), GROUPING SETS"
    ]
  ],
  "bridge_java": "// [Java - Spring Data JPA] Đón kết quả GROUP BY bằng Interface-based Projection hoặc Record DTO\n// Không nên trả về List<Object[]> khó đọc. Hãy khai báo một Java record hoặc interface:\n\npublic interface ThongKeKhoaProjection {\n    String getMaKhoa();\n    String getTenKhoa();\n    Long getSoLuongSv();\n    Long getTongHocBong();\n}\n\n@Query(\"\"\"\n    SELECT k.maKhoa AS maKhoa, k.tenKhoa AS tenKhoa,\n           COUNT(sv.maSv) AS soLuongSv,\n           COALESCE(SUM(sv.hocBong), 0) AS tongHocBong\n    FROM Khoa k LEFT JOIN k.sinhViens sv\n    GROUP BY k.maKhoa, k.tenKhoa\n    \"\"\")\nList<ThongKeKhoaProjection> layThongKeTheoKhoa();",
  "bridge_csharp": "// [C# - EF Core LINQ] GroupBy dịch sang SQL GROUP BY và HAVING\n// Lưu ý: Trong EF Core, chỉ gọi .GroupBy() rồi nối ngay với .Select() (chứa Count, Sum, Average)\n// để EF Core dịch toàn bộ sang câu lệnh SQL GROUP BY dưới Database thay vì kéo dữ liệu về RAM!\n\nvar thongKePhongBan = await dbContext.Employees\n    .Where(e => e.HireDate >= new DateOnly(2005, 1, 1))\n    .GroupBy(e => e.DepartmentId)\n    .Where(g => g.Sum(x => x.Salary) > 1000) // EF Core dịch dòng này thành mệnh đề HAVING!\n    .Select(g => new {\n        DepartmentId = g.Key,\n        SoNV = g.Count(),\n        TongLuong = g.Sum(x => x.Salary)\n    })\n    .OrderByDescending(x => x.TongLuong)\n    .ToListAsync();",
  "performance": "<ul>\n  <li><strong>Hai thuật toán thực thi GROUP BY vật lý:</strong>\n    <ul>\n      <li><strong>Stream Aggregate:</strong> Nếu dữ liệu đầu vào đã được sắp xếp sẵn theo đúng các cột trong <code>GROUP BY</code> (nhờ Index), máy chủ chỉ cần đọc tuần tự một mạch từ đầu đến cuối, khi thấy giá trị khóa đổi mới chốt số liệu nhóm cũ. Tốn cực ít RAM và không chặn luồng.</li>\n      <li><strong>Hash Match Aggregate:</strong> Khi dữ liệu chưa được sắp xếp, máy chủ phải cấp phát một bảng băm (Hash Table) trong bộ nhớ RAM để gom các dòng cùng khóa. Nếu bảng quá lớn vượt quá bộ nhớ được cấp (Memory Grant), dữ liệu sẽ bị tràn xuống ổ cứng (TempDB Spill) làm truy vấn chậm đi hàng chục lần.</li>\n    </ul>\n  </li>\n  <li><strong>Luôn lọc sớm nhất có thể ở WHERE:</strong> Đừng đẩy các điều kiện lọc cột thông thường (như <code>TrangThai = 'HOAN_THANH'</code> hay <code>MaKhoa = 'CNTT'</code>) xuống <code>HAVING</code>. Lọc ở <code>WHERE</code> giúp giảm ngay số lượng dòng trước khi bước vào khâu gom nhóm đắt đỏ.</li>\n</ul>",
  "common_errors": [
    "Dùng COUNT(*) thay vì COUNT(bang_phai.Id) khi kết hợp LEFT JOIN và GROUP BY, làm những nhóm rỗng vẫn bị đếm thành 1 dòng (do đếm luôn dòng chứa giá trị NULL của bảng trái).",
    "Đặt một cột không nằm trong GROUP BY lên mệnh đề SELECT mà không bọc hàm tổng hợp (gây lỗi 'Column is invalid in the select list because it is not contained in either an aggregate function or the GROUP BY clause').",
    "Viết hàm tổng hợp ngay trong mệnh đề WHERE (ví dụ WHERE COUNT(*) > 1) thay vì đặt trong HAVING.",
    "Dùng AVG(col) trên cột cho phép NULL mà quên rằng AVG tự động bỏ qua các dòng NULL khỏi cả tử số lẫn mẫu số.",
    "Lạm dụng Correlated Subquery (truy vấn con tương quan) bên trong danh sách cột của SELECT trên bảng hàng trăm nghìn dòng, khiến subquery bị gọi lặp lại theo kiểu N+1 ngay trong tầng SQL."
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "Phân biệt mệnh đề WHERE và mệnh đề HAVING trong SQL. Có thể dùng HAVING mà không có GROUP BY được không?",
      "a_short": "WHERE lọc từng dòng trước khi gom nhóm và không chứa được hàm tổng hợp; HAVING lọc từng nhóm sau khi đã gom nhóm và dùng được với hàm tổng hợp. Về mặt cú pháp, có thể dùng HAVING không kèm GROUP BY (khi đó toàn bộ bảng được coi là 1 nhóm duy nhất), nhưng thực tế rất hiếm dùng.",
      "a_long": "Sự khác biệt nằm ở thứ tự thực thi: WHERE chạy ở bước 2 (ngay sau FROM/JOIN) để loại bỏ sớm các dòng không thỏa điều kiện, giúp giảm tải cho bước GROUP BY. HAVING chạy ở bước 4 (sau GROUP BY) để giữ lại các nhóm thỏa mãn điều kiện tổng hợp (như HAVING COUNT(*) >= 5). Nếu viết HAVING mà không có GROUP BY, chuẩn ANSI SQL coi toàn bộ bảng là một nhóm tổng hợp duy nhất (ví dụ SELECT COUNT(*) FROM DonHang HAVING COUNT(*) > 10)."
    },
    {
      "level": "Junior",
      "q": "Tại sao khi nối bảng Phòng ban (Departments) với Nhân viên (Employees) bằng LEFT JOIN để đếm số nhân viên mỗi phòng, nếu viết COUNT(*) thì phòng không có nhân viên nào vẫn hiện số lượng là 1?",
      "a_short": "Vì LEFT JOIN giữ lại dòng của phòng ban đó kèm các cột nhân viên là NULL; hàm COUNT(*) đếm tổng số dòng tồn tại (là 1 dòng), còn COUNT(Employees.Id) mới chỉ đếm các giá trị khác NULL (trả về 0).",
      "a_long": "Sau bước LEFT JOIN, một phòng ban chưa có nhân viên (như phòng Legal) sẽ tạo ra 1 dòng kết quả có dạng: (DeptId=4, DeptName='Legal', EmpId=NULL, EmpName=NULL). Khi bước GROUP BY gom theo DeptId=4, nhóm này có đúng 1 dòng vật lý. Hàm COUNT(*) đếm số dòng bất chấp NULL nên trả về 1. Để đếm đúng số lượng thực thể bên bảng phải của LEFT JOIN, bắt buộc phải truyền cột khóa chính của bảng phải vào hàm đếm: COUNT(e.Id)."
    },
    {
      "level": "Mid",
      "q": "So sánh IN, EXISTS và JOIN khi cần lọc các bản ghi của bảng A có xuất hiện trong bảng B (quan hệ 1-nhiều).",
      "a_short": "EXISTS và IN (trên cột NOT NULL) được trình tối ưu dịch thành phép Semi-Join nên không làm nhân bản dòng của bảng A; trong khi INNER JOIN sẽ làm nhân bản dòng của bảng A nếu bảng B có nhiều dòng khớp.",
      "a_long": "Nếu một khách hàng ở bảng A có 5 đơn hàng ở bảng B, việc dùng INNER JOIN sẽ nhân bản khách hàng đó thành 5 dòng (bạn lại phải tốn thêm DISTINCT để khử trùng). Ngược lại, WHERE EXISTS (SELECT 1 FROM DonHang dh WHERE dh.MaKH = kh.MaKH) sử dụng toán tử vật lý Left Semi Join: ngay khi gặp đơn hàng đầu tiên của khách đó, máy chủ đánh dấu TRUE và chuyển sang khách hàng kế tiếp, vừa không bao giờ làm nhân bản dòng vừa tiết kiệm I/O."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 4.1: Thống kê số lượng sinh viên và học bổng của từng khoa (kể cả khoa 0 sinh viên)",
      "problem": "Trên CSDL TruongHoc, hãy liệt kê tất cả các khoa (MaKhoa, TenKhoa) kèm theo SoLuongSV (đếm số sinh viên thực tế của khoa) và TongHocBong (nếu khoa không có ai nhận học bổng thì hiển thị 0). Sắp xếp theo SoLuongSV giảm dần, MaKhoa tăng dần.",
      "intuition": "Dùng LEFT JOIN từ Khoa sang SinhVien. Phải đếm trên cột khóa chính của bảng phải COUNT(sv.MaSV) để khoa Du Lịch ra 0 SV, và bọc COALESCE(SUM(sv.HocBong), 0).",
      "trace": "CNTT có 3 SV (tổng HB 13000); KT có 2 SV (tổng HB 3000); DT có 1 SV (HB 0); DL có 0 SV (tổng HB 0).",
      "sql": "SELECT k.MaKhoa, k.TenKhoa,\n       COUNT(sv.MaSV) AS SoLuongSV,\n       COALESCE(SUM(sv.HocBong), 0) AS TongHocBong\nFROM Khoa AS k\nLEFT JOIN SinhVien AS sv ON k.MaKhoa = sv.MaKhoa\nGROUP BY k.MaKhoa, k.TenKhoa\nORDER BY SoLuongSV DESC, k.MaKhoa ASC;",
      "db": "truonghoc",
      "expected": {
        "cols": [
          "MaKhoa",
          "TenKhoa",
          "SoLuongSV",
          "TongHocBong"
        ],
        "rows": [
          [
            "CNTT",
            "Cong Nghe Thong Tin",
            3,
            13000
          ],
          [
            "KT",
            "Kinh Te Doi Ngoai",
            2,
            3000
          ],
          [
            "DT",
            "Dien Tu Vien Thong",
            1,
            0
          ],
          [
            "DL",
            "Khoa Du Lich",
            0,
            0
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Dùng LEFT JOIN từ Khoa sang SinhVien và nhớ đếm bằng COUNT(sv.MaSV) chứ không phải COUNT(*).",
        "Bọc SUM(sv.HocBong) trong hàm COALESCE(..., 0) để thay thế NULL thành 0.",
        "SELECT k.MaKhoa, k.TenKhoa, COUNT(sv.MaSV) AS SoLuongSV, COALESCE(SUM(sv.HocBong), 0) AS TongHocBong FROM Khoa AS k LEFT JOIN SinhVien AS sv ON k.MaKhoa = sv.MaKhoa GROUP BY k.MaKhoa, k.TenKhoa ORDER BY SoLuongSV DESC, k.MaKhoa ASC;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 4.2: Tìm các sản phẩm có tổng số lượng bán ra từ 2 chiếc trở lên",
      "problem": "Trên CSDL ShopOnline, hãy tính tổng số lượng đã đặt (TongSoLuong) và số đơn hàng xuất hiện (SoDon) của từng sản phẩm trong bảng ChiTietDon (kết hợp bảng SanPham để lấy TenSP). Chỉ giữ lại các sản phẩm có TongSoLuong >= 2. Sắp xếp theo TongSoLuong giảm dần, MaSP tăng dần.",
      "intuition": "Nối SanPham với ChiTietDon, GROUP BY sp.MaSP, sp.TenSP rồi lọc tổng sau gom nhóm bằng HAVING SUM(ct.SoLuong) >= 2.",
      "trace": "SP 101 bán ở đơn 1001 (1) + 1005 (2) = 3; SP 106 bán ở đơn 1001 (2) + 1007 (1) = 3; SP 102 bán 1+1=2; SP 103 bán 2; SP 104 bán 1+1=2; SP 105 bán 1+1=2.",
      "sql": "SELECT sp.MaSP, sp.TenSP,\n       SUM(ct.SoLuong) AS TongSoLuong,\n       COUNT(ct.MaDH) AS SoDon\nFROM SanPham AS sp\nINNER JOIN ChiTietDon AS ct ON sp.MaSP = ct.MaSP\nGROUP BY sp.MaSP, sp.TenSP\nHAVING SUM(ct.SoLuong) >= 2\nORDER BY TongSoLuong DESC, sp.MaSP ASC;",
      "db": "shoponline",
      "expected": {
        "cols": [
          "MaSP",
          "TenSP",
          "TongSoLuong",
          "SoDon"
        ],
        "rows": [
          [
            101,
            "Ban Phim Co Keychron K2",
            3,
            2
          ],
          [
            106,
            "Gia Do Laptop Nhom",
            3,
            2
          ],
          [
            102,
            "Chuot Logitech MX Master 3S",
            2,
            2
          ],
          [
            103,
            "Man Hinh Dell UltraSharp 27",
            2,
            1
          ],
          [
            104,
            "Tai Nghe Sony WH-1000XM5",
            2,
            2
          ],
          [
            105,
            "Laptop ThinkPad X1 Carbon",
            2,
            2
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Điều kiện lọc trên hàm tổng hợp SUM(ct.SoLuong) bắt buộc phải đặt ở mệnh đề HAVING, không đặt ở WHERE.",
        "SELECT sp.MaSP, sp.TenSP, SUM(ct.SoLuong) AS TongSoLuong, COUNT(ct.MaDH) AS SoDon FROM SanPham sp INNER JOIN ChiTietDon ct ON sp.MaSP = ct.MaSP GROUP BY sp.MaSP, sp.TenSP HAVING ...;",
        "SELECT sp.MaSP, sp.TenSP, SUM(ct.SoLuong) AS TongSoLuong, COUNT(ct.MaDH) AS SoDon FROM SanPham AS sp INNER JOIN ChiTietDon AS ct ON sp.MaSP = ct.MaSP GROUP BY sp.MaSP, sp.TenSP HAVING SUM(ct.SoLuong) >= 2 ORDER BY TongSoLuong DESC, sp.MaSP ASC;"
      ]
    },
    {
      "num": 3,
      "title": "Bài 4.3: Dùng EXISTS tìm tác giả có viết sách lưu trong thư viện",
      "problem": "Trên CSDL Library, hãy lấy Id, Name, Country của những tác giả trong bảng Authors có ít nhất một cuốn sách được ghi nhận trong bảng BooksAuthors. Sắp xếp theo Id tăng dần.",
      "intuition": "Dùng WHERE EXISTS (SELECT 1 FROM BooksAuthors ba WHERE ba.AuthorId = a.Id).",
      "trace": "Các tác giả từ Id 1 đến Id 8 đều có dòng trong BooksAuthors. Tác giả số 9 (Haruki Murakami) chưa có dòng nào nên bị loại.",
      "sql": "SELECT a.Id, a.Name, a.Country\nFROM Authors AS a\nWHERE EXISTS (\n    SELECT 1\n    FROM BooksAuthors AS ba\n    WHERE ba.AuthorId = a.Id\n)\nORDER BY a.Id ASC;",
      "db": "library",
      "expected": {
        "cols": [
          "Id",
          "Name",
          "Country"
        ],
        "rows": [
          [
            1,
            "J.D. Salinger",
            "USA"
          ],
          [
            2,
            "F. Scott. Fitzgerald",
            "USA"
          ],
          [
            3,
            "Jane Austen",
            "UK"
          ],
          [
            4,
            "Scott Hanselman",
            "USA"
          ],
          [
            5,
            "Jason N. Gaylord",
            "USA"
          ],
          [
            6,
            "Pranav Rastogi",
            "India"
          ],
          [
            7,
            "Todd Miranda",
            "USA"
          ],
          [
            8,
            "Christian Wenz",
            "USA"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Dùng mệnh đề WHERE EXISTS kèm truy vấn con kiểm tra ba.AuthorId = a.Id.",
        "SELECT a.Id, a.Name, a.Country FROM Authors AS a WHERE EXISTS (SELECT 1 FROM BooksAuthors AS ba WHERE ...);",
        "SELECT a.Id, a.Name, a.Country FROM Authors AS a WHERE EXISTS (SELECT 1 FROM BooksAuthors AS ba WHERE ba.AuthorId = a.Id) ORDER BY a.Id ASC;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch04_p1",
      "title": "Tính giá trị thực thu của từng đơn hàng đã hoàn thành và lọc đơn giá trị lớn",
      "difficulty": "Khá",
      "db": "shoponline",
      "summary": "Trên CSDL ShopOnline, hãy lập báo cáo các đơn hàng có TrangThai = 'HOAN_THANH' và tổng tiền hàng sau chiết khấu (chưa tính phí ship) lớn hơn 5000. Hiển thị MaDH, MaKH, NgayDat, SoMatHang (số dòng chi tiết), và TongTienHang = SUM(SoLuong * DonGiaBan - COALESCE(ChietKhau, 0)). Sắp xếp theo TongTienHang giảm dần.",
      "understand": "Ta cần lọc TrangThai = 'HOAN_THANH' trước khi gom nhóm (đặt ở WHERE để giảm số dòng sớm), sau đó gom nhóm theo đơn hàng và lọc tổng tiền hàng > 5000 ở HAVING.",
      "brute": "Đặt cả điều kiện TrangThai = 'HOAN_THANH' vào trong HAVING khiến máy chủ phải gom nhóm cả các đơn đã hủy và đang giao trước rồi mới vứt đi.",
      "optimal": "Đặt WHERE dh.TrangThai = 'HOAN_THANH' trước GROUP BY, và HAVING SUM(...) > 5000 sau GROUP BY.",
      "trace": "Đơn 1001: 1700 + 700 = 2400 (<=5000, loại). Đơn 1002: 2200 + 6500 = 8700 (nhận). Đơn 1003: 2*8400 - 200 = 16600 (nhận). Đơn 1005: 3450 + 2200 = 5650 (nhận). Đơn 1007: 31000 + 350 = 31350 (nhận).",
      "sql": "SELECT dh.MaDH, dh.MaKH, dh.NgayDat,\n       COUNT(ct.MaSP) AS SoMatHang,\n       SUM(ct.SoLuong * ct.DonGiaBan - COALESCE(ct.ChietKhau, 0)) AS TongTienHang\nFROM DonHang AS dh\nINNER JOIN ChiTietDon AS ct ON dh.MaDH = ct.MaDH\nWHERE dh.TrangThai = 'HOAN_THANH'\nGROUP BY dh.MaDH, dh.MaKH, dh.NgayDat\nHAVING SUM(ct.SoLuong * ct.DonGiaBan - COALESCE(ct.ChietKhau, 0)) > 5000\nORDER BY TongTienHang DESC;",
      "expected": {
        "cols": [
          "MaDH",
          "MaKH",
          "NgayDat",
          "SoMatHang",
          "TongTienHang"
        ],
        "rows": [
          [
            1007,
            1,
            "2024-03-25",
            2,
            31350
          ],
          [
            1003,
            1,
            "2024-02-01",
            1,
            16600
          ],
          [
            1002,
            2,
            "2024-01-12",
            2,
            8700
          ],
          [
            1005,
            4,
            "2024-03-02",
            2,
            5650
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Quên COALESCE(ct.ChietKhau, 0) làm các đơn có dòng chiết khấu NULL bị tính sai tổng tiền.",
      "note3": {
        "idea": "Lọc dòng chi tiết ở WHERE trước khi gom nhóm, và chỉ dùng HAVING cho điều kiện chứa hàm tổng hợp.",
        "syntax": "WHERE dh.TrangThai = 'HOAN_THANH' GROUP BY ... HAVING SUM(...) > 5000",
        "trap": "Nếu một dòng có ChietKhau là NULL mà không bọc COALESCE(ChietKhau, 0), biểu thức nhân trừ của dòng đó biến thành NULL và bị hàm SUM bỏ qua hoàn toàn!"
      }
    },
    {
      "id": "ch04_p2",
      "title": "Phép chia quan hệ (Relational Division): Tìm sinh viên đã học tất cả các môn của khoa Kinh Tế",
      "difficulty": "Khó",
      "db": "truonghoc",
      "summary": "Trên CSDL TruongHoc, hãy tìm MaSV và HoTen của những sinh viên đã đăng ký học đầy đủ tất cả các môn học do khoa 'KT' quản lý. Sắp xếp theo MaSV tăng dần.",
      "understand": "Bài toán 'Tìm đối tượng X tham gia TẤT CẢ đối tượng Y thuộc tập S' có thể giải bằng 2 cách chuẩn: (Cách 1) Đếm số môn khác nhau thuộc khoa KT mà sinh viên đó đã học, rồi so sánh bằng tổng số môn của khoa KT; hoặc (Cách 2) Không tồn tại môn nào của khoa KT mà sinh viên đó chưa học (Double NOT EXISTS).",
      "brute": "Lấy danh sách môn khoa KT về code rồi lặp qua từng sinh viên.",
      "optimal": "Dùng GROUP BY sv.MaSV, sv.HoTen kết hợp HAVING COUNT(DISTINCT mh.MaMH) = (SELECT COUNT(*) FROM MonHoc WHERE MaKhoa = 'KT').",
      "trace": "Khoa KT chỉ có 1 môn là EC101. Sinh viên đã đăng ký EC101 là MaSV = 204 (Ly Ngoc Mai).",
      "sql": "SELECT sv.MaSV, sv.HoTen\nFROM SinhVien AS sv\nINNER JOIN DangKy AS dk ON sv.MaSV = dk.MaSV\nINNER JOIN MonHoc AS mh ON dk.MaMH = mh.MaMH\nWHERE mh.MaKhoa = 'KT'\nGROUP BY sv.MaSV, sv.HoTen\nHAVING COUNT(DISTINCT mh.MaMH) = (\n    SELECT COUNT(*) FROM MonHoc WHERE MaKhoa = 'KT'\n)\nORDER BY sv.MaSV ASC;",
      "expected": {
        "cols": [
          "MaSV",
          "HoTen"
        ],
        "rows": [
          [
            204,
            "Ly Ngoc Mai"
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Dùng COUNT(mh.MaMH) thay vì COUNT(DISTINCT mh.MaMH): nếu một sinh viên học lại cùng một môn ở 2 học kỳ (2024A và 2024B), COUNT thường sẽ đếm thành 2 môn!",
      "note3": {
        "idea": "Bài toán 'Tất cả' (Relational Division) giải gọn nhất bằng HAVING COUNT(DISTINCT item) = (SELECT COUNT(*) FROM TargetSet).",
        "syntax": "HAVING COUNT(DISTINCT mh.MaMH) = (SELECT COUNT(*) FROM MonHoc WHERE ...)",
        "trap": "Quên từ khóa DISTINCT bên trong COUNT khi một sinh viên có thể đăng ký cùng một môn ở nhiều học kỳ."
      }
    }
  ],
  "summary_table": [
    [
      "COUNT(*) vs COUNT(col)",
      "Đếm mọi dòng vs Chỉ đếm dòng có col khác NULL",
      "Khi LEFT JOIN phải dùng COUNT(bang_phai.PK)"
    ],
    [
      "SUM / AVG / MIN / MAX",
      "Tổng, Trung bình, Nhỏ nhất, Lớn nhất",
      "Bỏ qua NULL; trả về NULL nếu tập đầu vào rỗng"
    ],
    [
      "GROUP BY a, b",
      "Gom các dòng có cùng giá trị (a, b) thành 1 dòng đại diện",
      "Cột ở SELECT phải nằm trong GROUP BY hoặc hàm gộp"
    ],
    [
      "HAVING điều_kiện",
      "Lọc các nhóm sau khi đã chạy GROUP BY",
      "Đặt điều kiện chứa SUM, COUNT, AVG ở đây"
    ],
    [
      "EXISTS / NOT EXISTS",
      "Kiểm tra truy vấn con có trả về dòng nào không",
      "Chạy theo cơ chế Semi-Join, an toàn với NULL"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Một bảng T có 4 dòng với cột X lần lượt chứa các giá trị: 10, 20, 0, NULL. Hãy cho biết kết quả của COUNT(*), COUNT(X), SUM(X) và AVG(X).",
      "a": "COUNT(*) = 4; COUNT(X) = 3 (bỏ qua NULL, số 0 vẫn được đếm); SUM(X) = 30; AVG(X) = 30 / 3 = 10."
    },
    {
      "q": "Câu 2: Trong câu lệnh SELECT MaKhoa, COUNT(*) FROM SinhVien WHERE GioiTinh = 'Nu' GROUP BY MaKhoa HAVING COUNT(*) >= 2, điều kiện nào chạy trước: GioiTinh = 'Nu' hay COUNT(*) >= 2?",
      "a": "Điều kiện WHERE GioiTinh = 'Nu' chạy trước để lọc chỉ lấy các dòng sinh viên nữ, sau đó mới gom nhóm theo MaKhoa rồi cuối cùng mới kiểm tra HAVING COUNT(*) >= 2."
    },
    {
      "q": "Câu 3: Tại sao viết SELECT 1 hay SELECT * bên trong mệnh đề WHERE EXISTS (SELECT ... FROM ...) lại có tốc độ thực thi như nhau?",
      "a": "Vì toán tử EXISTS chỉ kiểm tra xem truy vấn con có trả về ít nhất một dòng nào hay không, trình tối ưu hóa truy vấn (Query Optimizer) sẽ bỏ qua hoàn toàn danh sách cột ở SELECT của subquery."
    }
  ]
});
