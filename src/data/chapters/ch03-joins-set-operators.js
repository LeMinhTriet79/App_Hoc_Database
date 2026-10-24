/**
 * FILE: src/data/chapters/ch03-joins-set-operators.js
 * MÔ TẢ: Chương 3 - Các Phép Nối Bảng (JOIN) & Toán Tử Tập Hợp (UNION, EXCEPT, INTERSECT)
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch03",
  "code": "Chương 3",
  "title": "Các Phép Nối Bảng (JOIN) & Toán Tử Tập Hợp (UNION, EXCEPT, INTERSECT)",
  "sources": [
    "S ch.15, 18, 24, 28",
    "M ch.19, 33, 34"
  ],
  "goals": [
    "Hiểu sâu bản chất từng loại JOIN: INNER JOIN, LEFT/RIGHT/FULL OUTER JOIN, CROSS JOIN và SELF JOIN.",
    "Phân biệt tuyệt đối vai trò của điều kiện đặt trong ON và điều kiện đặt trong WHERE đối với OUTER JOIN.",
    "Sử dụng thành thạo các toán tử tập hợp theo chiều dọc: UNION vs UNION ALL, INTERSECT và EXCEPT.",
    "Nắm được cơ chế hoạt động của CROSS APPLY / OUTER APPLY trong T-SQL."
  ],
  "signals": [
    "Cần ghép thông tin từ nhiều bảng chuẩn hóa (Đơn hàng + Khách hàng + Chi tiết sản phẩm) để trả về cho API.",
    "Tìm các phần tử 'mồ côi' hoặc 'chưa phát sinh giao dịch' (khách chưa mua hàng, sản phẩm chưa từng bán, môn học chưa ai đăng ký).",
    "Truy vấn cấu trúc phân cấp tự tham chiếu trong cùng một bảng (nhân viên - quản lý, người giới thiệu, danh mục cha - con)."
  ],
  "theory": "<h3>3.1. Tại sao phải JOIN? Và 5 phép JOIN cốt lõi</h3>\n<p>Nhờ thiết kế chuẩn hóa (Chương 0 và Chương 7), dữ liệu được chia nhỏ vào các bảng độc lập để không bị dư thừa. Khi cần lên báo cáo hoặc trả dữ liệu về giao diện, <strong>phép nối (JOIN)</strong> giúp ghép các cột từ hai hay nhiều bảng lại với nhau theo chiều ngang dựa trên điều kiện liên kết (thường là <code>BangCon.KhoaNgoai = BangCha.KhoaChinh</code>).</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Loại JOIN</th>\n      <th>Quy tắc giữ dòng</th>\n      <th>Khi nào sử dụng thực tế?</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>INNER JOIN</strong> (hoặc viết tắt <code>JOIN</code>)</td>\n      <td>Chỉ giữ lại những cặp dòng khớp điều kiện <code>ON</code> ở cả bảng trái (A) và bảng phải (B).</td>\n      <td>Khi bạn chỉ quan tâm tới các bản ghi có đầy đủ thông tin liên kết ở cả hai phía (ví dụ: lấy đơn hàng kèm tên khách hàng).</td>\n    </tr>\n    <tr>\n      <td><strong>LEFT OUTER JOIN</strong> (thường viết <code>LEFT JOIN</code>)</td>\n      <td>Giữ lại <strong>100% dòng của bảng trái (A)</strong>. Nếu dòng nào ở A không tìm thấy dòng khớp ở B, các cột của B sẽ được điền <code>NULL</code>.</td>\n      <td>Lấy danh sách tất cả khách hàng kèm số đơn hàng của họ (kể cả khách có 0 đơn), hoặc lọc tìm khách chưa mua hàng (<code>WHERE B.Id IS NULL</code>).</td>\n    </tr>\n    <tr>\n      <td><strong>RIGHT OUTER JOIN</strong></td>\n      <td>Ngược lại với LEFT JOIN: giữ 100% dòng của bảng phải (B), điền <code>NULL</code> vào bên trái nếu không khớp.</td>\n      <td>Ít dùng trong thực tế vì lập trình viên thường ưu tiên đổi thứ tự bảng để viết <code>LEFT JOIN</code> cho thuận mắt từ trái sang phải.</td>\n    </tr>\n    <tr>\n      <td><strong>FULL OUTER JOIN</strong></td>\n      <td>Giữ toàn bộ dòng của cả A và B. Bên nào không khớp thì điền <code>NULL</code> ở phía đối diện.</td>\n      <td>Đối soát dữ liệu (Reconciliation) giữa hai nguồn, ví dụ đối soát bảng giao dịch ngân hàng và bảng đơn hàng nội bộ để tìm lệch.</td>\n    </tr>\n    <tr>\n      <td><strong>CROSS JOIN</strong></td>\n      <td>Tích Đề-các (Cartesian Product): ghép mọi dòng của A với mọi dòng của B. Nếu A có m dòng, B có n dòng thì kết quả có <code>m * n</code> dòng.</td>\n      <td>Tạo bảng tổ hợp (ví dụ: ghép mọi Màu sắc với mọi Kích cỡ áo để sinh danh mục SKU, hoặc ghép danh sách 12 tháng với danh sách Chi nhánh).</td>\n    </tr>\n  </tbody>\n</table>\n\n<h3>3.2. Sự khác biệt sống còn giữa điều kiện ở ON và điều kiện ở WHERE</h3>\n<p>Với <code>INNER JOIN</code>, bạn viết điều kiện lọc ở <code>ON</code> hay ở <code>WHERE</code> thì kết quả hoàn toàn giống nhau. Nhưng với <strong><code>LEFT JOIN</code></strong>, hai vị trí này mang ý nghĩa khác hẳn nhau:</p>\n<ul>\n  <li><strong>Điều kiện trong <code>ON</code>:</strong> Được kiểm tra <em>trong lúc đang tìm cặp ghép</em> giữa bảng trái và bảng phải. Nếu điều kiện <code>ON</code> không thỏa mãn, dòng ở bảng trái <strong>vẫn được giữ lại</strong> trong kết quả và các cột bảng phải được gán <code>NULL</code>!</li>\n  <li><strong>Điều kiện trong <code>WHERE</code>:</strong> Được kiểm tra <em>sau khi phép LEFT JOIN đã hoàn tất</em>. Nếu bạn viết <code>WHERE BangPhai.TrangThai = 'HOAN_THANH'</code>, những dòng của bảng trái vừa được cứu sống với <code>BangPhai.TrangThai = NULL</code> sẽ bị mệnh đề <code>WHERE</code> tiêu diệt ngay lập tức (vì <code>NULL = 'HOAN_THANH'</code> là <code>UNKNOWN</code>). Lúc này <code>LEFT JOIN</code> bị thoái hóa thành <code>INNER JOIN</code>!</li>\n</ul>\n\n<h3>3.3. Toán tử tập hợp ghép theo chiều dọc: UNION, UNION ALL, INTERSECT, EXCEPT</h3>\n<p>Nếu <code>JOIN</code> ghép thêm cột theo chiều ngang, thì các toán tử tập hợp (Set Operators) ghép thêm dòng theo chiều dọc từ hai câu lệnh <code>SELECT</code> độc lập (yêu cầu bắt buộc: hai câu <code>SELECT</code> phải có <strong>cùng số lượng cột</strong> và các cột tương ứng phải có <strong>kiểu dữ liệu tương thích</strong>):</p>\n<ul>\n  <li><code>UNION ALL</code>: Gộp tất cả các dòng của truy vấn 1 và truy vấn 2, <strong>giữ nguyên cả các dòng trùng lặp</strong>. Chạy cực nhanh vì chỉ việc nối đuôi dữ liệu.</li>\n  <li><code>UNION</code>: Gộp dòng rồi <strong>tự động khử trùng lặp (DISTINCT)</strong> trên toàn bộ các cột. Chạy chậm hơn vì phải thực hiện bước sắp xếp hoặc băm để tìm dòng trùng.</li>\n  <li><code>INTERSECT</code>: Chỉ lấy những dòng <strong>xuất hiện ở cả hai</strong> tập kết quả (phép giao tập hợp).</li>\n  <li><code>EXCEPT</code> (trong Oracle cũ gọi là <code>MINUS</code>): Lấy những dòng có ở truy vấn 1 nhưng <strong>không có</strong> ở truy vấn 2 (phép hiệu tập hợp).</li>\n</ul>",
  "mechanism": "<h3>Chạy tay từng bước: Máy chủ thực hiện phép LEFT JOIN như thế nào?</h3>\n<p>Hãy theo dõi 3 bước logic khi máy chủ thực thi một phép <code>FROM A LEFT JOIN B ON ... WHERE ...</code>:</p>\n<div class=\"trace-steps\">\n  <div class=\"trace-step\"><strong>Bước 1 - Tích Đề-các ảo &amp; Lọc theo ON (INNER match):</strong> Với mỗi dòng của bảng trái <code>A</code>, dò tìm các dòng bên bảng phải <code>B</code> sao cho biểu thức trong <code>ON</code> trả về <code>TRUE</code>.</div>\n  <div class=\"trace-step\"><strong>Bước 2 - Bù dòng bảng trái (OUTER preservation):</strong> Những dòng nào của bảng trái <code>A</code> không tìm được bất kỳ dòng khớp nào ở Bước 1 sẽ được giữ lại, và toàn bộ cột thuộc về bảng <code>B</code> trên dòng đó được lấp bằng <code>NULL</code>.</div>\n  <div class=\"trace-step\"><strong>Bước 3 - Lọc cuối bằng WHERE:</strong> Đánh giá biểu thức <code>WHERE</code> trên bảng trung gian sau Bước 2. Bạn có thể bấm sang mục <strong>Bộ Mô Phỏng Trực Quan &rarr; Mô phỏng JOIN</strong> để xem hiệu ứng từng cặp dòng được nối!</div>\n</div>\n\n<h4>Bảng chạy tay so sánh ON vs WHERE trên Countries (5 nước) LEFT JOIN Cities</h4>\n<p>Giả sử ta chỉ xét 2 nước: <code>Germany (Id=2)</code> có thành phố <code>Berlin</code>, và <code>Spain (Id=4)</code> không có thành phố nào:</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Câu truy vấn</th>\n      <th>Kết quả sau bước LEFT JOIN (ON)</th>\n      <th>Kết quả cuối sau bước WHERE</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><code>LEFT JOIN Cities ci ON c.Id = ci.CountryId AND ci.Name = 'Paris'</code> (không có WHERE)</td>\n      <td>Germany | NULL (vì Berlin &ne; Paris nhưng Germany vẫn được giữ lại)<br>Spain | NULL</td>\n      <td>Giữ nguyên cả 2 dòng: Germany và Spain đều hiện diện với cột thành phố là NULL.</td>\n    </tr>\n    <tr>\n      <td><code>LEFT JOIN Cities ci ON c.Id = ci.CountryId WHERE ci.Name = 'Berlin'</code></td>\n      <td>Germany | Berlin<br>Spain | NULL</td>\n      <td>Dòng Spain | NULL bị loại ở WHERE vì <code>NULL = 'Berlin'</code> ra UNKNOWN. Chỉ còn 1 dòng Germany!</td>\n    </tr>\n  </tbody>\n</table>",
  "examples": [
    {
      "title": "Ví dụ 3.1: INNER JOIN lấy thông tin xe kèm họ tên khách hàng và nhân viên phụ trách",
      "label": "CHUAN",
      "db": "autoshop",
      "sql": "SELECT c.Id AS CarId, c.Model, c.Status,\n       cust.FName || ' ' || cust.LName AS TenKhach,\n       emp.FName || ' ' || emp.LName AS ThoPhuTrach\nFROM Cars AS c\nINNER JOIN Customers AS cust ON c.CustomerId = cust.Id\nINNER JOIN Employees AS emp ON c.EmployeeId = emp.Id\nORDER BY c.Id;",
      "result": {
        "cols": [
          "CarId",
          "Model",
          "Status",
          "TenKhach",
          "ThoPhuTrach"
        ],
        "rows": [
          [
            1,
            "Ford F-150",
            "READY",
            "William Jones",
            "John Johnson"
          ],
          [
            2,
            "Ford F-150",
            "READY",
            "William Jones",
            "John Johnson"
          ],
          [
            3,
            "Ford Mustang",
            "WAITING",
            "David Miller",
            "James Smith"
          ],
          [
            4,
            "Toyota Prius",
            "WORKING",
            "Richard Davis",
            "Michael Williams"
          ],
          [
            5,
            "Honda Civic",
            "READY",
            "David Miller",
            "William Morris"
          ],
          [
            6,
            "Mazda 3",
            "WAITING",
            "Richard Davis",
            "William Morris"
          ]
        ]
      },
      "note": "INNER JOIN chỉ giữ lại các dòng có khóa khớp nhau ở cả hai bảng. Khách hàng số 4 (Thomas Wilson) chưa gửi xe nào nên không xuất hiện."
    },
    {
      "title": "Ví dụ 3.2: LEFT JOIN tìm khách hàng chưa từng đặt đơn hàng nào (Anti-Join)",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "SELECT kh.MaKH, kh.HoTen, kh.ThanhPho, dh.MaDH\nFROM KhachHang AS kh\nLEFT JOIN DonHang AS dh ON kh.MaKH = dh.MaKH\nWHERE dh.MaDH IS NULL\nORDER BY kh.MaKH;",
      "result": {
        "cols": [
          "MaKH",
          "HoTen",
          "ThanhPho",
          "MaDH"
        ],
        "rows": [
          [
            5,
            "Vo Thi Em",
            "TP Ho Chi Minh",
            null
          ],
          [
            6,
            "Hoang Gia Huy",
            "Can Tho",
            null
          ]
        ]
      },
      "note": "Khi dùng LEFT JOIN, khách hàng chưa có đơn sẽ có toàn bộ các cột của bảng DonHang là NULL. Lọc WHERE dh.MaDH IS NULL ở ngoài sẽ bắt được đúng những khách hàng này."
    },
    {
      "title": "Ví dụ 3.3: Bẫy chết người khi đặt điều kiện bảng phải ở WHERE thay vì ON trong LEFT JOIN",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "SELECT kh.MaKH, kh.HoTen,\n       COUNT(dh.MaDH) AS SoDonHoanThanh\nFROM KhachHang AS kh\nLEFT JOIN DonHang AS dh\n       ON kh.MaKH = dh.MaKH AND dh.TrangThai = 'HOAN_THANH'\nGROUP BY kh.MaKH, kh.HoTen\nORDER BY kh.MaKH;",
      "result": {
        "cols": [
          "MaKH",
          "HoTen",
          "SoDonHoanThanh"
        ],
        "rows": [
          [
            1,
            "Nguyen Van An",
            3
          ],
          [
            2,
            "Tran Thi Binh",
            1
          ],
          [
            3,
            "Le Hoang Cuong",
            0
          ],
          [
            4,
            "Pham Minh Dung",
            1
          ],
          [
            5,
            "Vo Thi Em",
            0
          ],
          [
            6,
            "Hoang Gia Huy",
            0
          ]
        ]
      },
      "note": "Đặt dh.TrangThai = 'HOAN_THANH' ngay trong mệnh đề ON giúp giữ lại đủ 6 khách hàng (khách chưa có đơn hoàn thành sẽ hiện số 0). Nếu đặt điều kiện này ở WHERE, các dòng NULL bị loại sạch và LEFT JOIN biến thành INNER JOIN!"
    },
    {
      "title": "Ví dụ 3.4: SELF JOIN (Tự nối bảng) tìm tên người quản lý trực tiếp của mỗi nhân viên",
      "label": "CHUAN",
      "db": "autoshop",
      "sql": "SELECT e.Id AS MaNV,\n       e.FName || ' ' || e.LName AS NhanVien,\n       e.Salary AS LuongNV,\n       COALESCE(m.FName || ' ' || m.LName, 'Ban Giam Doc (Khong co QL)') AS QuanLyTrucTiep\nFROM Employees AS e\nLEFT JOIN Employees AS m ON e.ManagerId = m.Id\nORDER BY e.Id;",
      "result": {
        "cols": [
          "MaNV",
          "NhanVien",
          "LuongNV",
          "QuanLyTrucTiep"
        ],
        "rows": [
          [
            1,
            "James Smith",
            1000,
            "Ban Giam Doc (Khong co QL)"
          ],
          [
            2,
            "John Johnson",
            400,
            "James Smith"
          ],
          [
            3,
            "Michael Williams",
            600,
            "James Smith"
          ],
          [
            4,
            "Johnathon Smith",
            500,
            "John Johnson"
          ],
          [
            5,
            "William Morris",
            800,
            "Michael Williams"
          ],
          [
            6,
            "Sarah Connor",
            750,
            "William Morris"
          ]
        ]
      },
      "note": "Cùng một bảng Employees nhưng được gọi 2 lần với 2 bí danh bắt buộc: e (đóng vai nhân viên) và m (đóng vai quản lý). Dùng LEFT JOIN để không làm rơi Giám đốc James Smith (ManagerId là NULL)."
    },
    {
      "title": "Ví dụ 3.5: Kết hợp kết quả bằng UNION ALL và tìm phần hiệu bằng EXCEPT",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "SELECT MaSP, TenSP FROM SanPham\nEXCEPT\nSELECT DISTINCT sp.MaSP, sp.TenSP\nFROM SanPham AS sp\nINNER JOIN ChiTietDon AS ct ON sp.MaSP = ct.MaSP;",
      "result": {
        "cols": [
          "MaSP",
          "TenSP"
        ],
        "rows": [
          [
            107,
            "Webcam Elgato Facecam"
          ]
        ]
      },
      "note": "Toán tử EXCEPT lấy tập hợp sản phẩm ở truy vấn trên trừ đi các sản phẩm đã từng xuất hiện trong ChiTietDon, kết quả trả về sản phẩm chưa bán được lần nào (Webcam Elgato Facecam)."
    },
    {
      "title": "Ví dụ 3.6: Dùng CROSS APPLY trong T-SQL để lấy 1 đơn hàng mới nhất của mỗi khách hàng",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "SELECT kh.MaKH, kh.HoTen, d_moi.MaDH, d_moi.NgayDat, d_moi.TrangThai\nFROM KhachHang AS kh\nOUTER APPLY (\n    SELECT TOP (1) dh.MaDH, dh.NgayDat, dh.TrangThai\n    FROM DonHang AS dh\n    WHERE dh.MaKH = kh.MaKH\n    ORDER BY dh.NgayDat DESC, dh.MaDH DESC\n) AS d_moi\nORDER BY kh.MaKH;",
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
            1007,
            "2024-03-25",
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
      "note": "CROSS APPLY (tương tự INNER JOIN với truy vấn con tương quan) và OUTER APPLY (tương tự LEFT JOIN) trong T-SQL cực mạnh khi giải bài toán Top-N mỗi nhóm. Bản [CHUẨN] dùng ROW_NUMBER() ở Chương 5. (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    }
  ],
  "dialects": [
    [
      "FULL OUTER JOIN",
      "Hỗ trợ trực tiếp FULL OUTER JOIN",
      "Không có trực tiếp (phải dùng LEFT JOIN UNION RIGHT JOIN)",
      "Hỗ trợ trực tiếp FULL OUTER JOIN (SQLite hỗ trợ từ bản 3.39+)"
    ],
    [
      "Phép hiệu tập hợp",
      "EXCEPT",
      "EXCEPT (từ MySQL 8.0.31+)",
      "EXCEPT"
    ],
    [
      "Phép giao tập hợp",
      "INTERSECT",
      "INTERSECT (từ MySQL 8.0.31+)",
      "INTERSECT"
    ],
    [
      "Join với hàm/subquery từng dòng",
      "CROSS APPLY / OUTER APPLY",
      "JOIN LATERAL / LEFT JOIN LATERAL (8.0.14+)",
      "CROSS JOIN LATERAL / LEFT JOIN LATERAL"
    ]
  ],
  "bridge_java": "// [Java - Spring Data JPA] Cẩn thận với JOIN vs LEFT JOIN khi truy vấn Entity có quan hệ @OneToMany\n// Trong JPQL, nếu bạn viết \"SELECT kh FROM KhachHang kh JOIN kh.donHangs dh\", JPA sinh ra INNER JOIN,\n// làm mất các khách hàng chưa có đơn! Muốn lấy đủ cả khách chưa có đơn kèm danh sách đơn trong 1 câu SQL:\n\n@Query(\"SELECT DISTINCT kh FROM KhachHang kh LEFT JOIN FETCH kh.donHangs dh WHERE kh.thanhPho = :tp\")\nList<KhachHang> findAllWithOrdersByCity(@Param(\"tp\") String thanhPho);",
  "bridge_csharp": "// [C# - EF Core] Cách EF Core sinh LEFT JOIN tự động từ Include() hoặc Select()\n// 1. Khi dùng .Include(kh => kh.DonHangs), EF Core tự động dùng LEFT JOIN để không làm mất khách hàng chưa có đơn.\n// 2. Trong LINQ Query Syntax, LEFT JOIN được viết bằng GroupJoin + SelectMany + DefaultIfEmpty(),\n//    nhưng từ EF Core 10 / LINQ Method Syntax bạn chỉ cần chiếu qua Navigation Property:\n\nvar baoCaoKhachHang = await dbContext.KhachHangs\n    .Select(kh => new {\n        kh.MaKH,\n        kh.HoTen,\n        SoDonHoanThanh = kh.DonHangs.Count(dh => dh.TrangThai == \"HOAN_THANH\")\n    })\n    .ToListAsync();",
  "performance": "<ul>\n  <li><strong>3 thuật toán JOIN vật lý của Database Engine:</strong> Khi bạn viết <code>JOIN</code>, trình tối ưu (Query Optimizer) sẽ chọn 1 trong 3 thuật toán vật lý để chạy:\n    <ol>\n      <li><strong>Nested Loops Join (Vòng lặp lồng nhau):</strong> Phù hợp khi một bảng rất nhỏ (Outer input) và bảng kia có Index tốt trên cột nối (Inner input). Độ phức tạp khoảng O(N * log M).</li>\n      <li><strong>Merge Join (Trộn hai danh sách đã sắp xếp):</strong> Cực nhanh (O(N + M)) khi cả hai bảng đều đã được sắp xếp sẵn theo cột nối (ví dụ nối hai bảng qua hai cột Clustered Index cùng thứ tự).</li>\n      <li><strong>Hash Match Join (Băm):</strong> Dùng khi nối hai bảng lớn mà chưa có Index sắp xếp sẵn. Máy chủ lấy bảng nhỏ hơn xây một bảng băm (Hash Table) trong RAM rồi quét bảng lớn đối chiếu. Tốn bộ nhớ (Memory Grant) cao.</li>\n    </ol>\n  </li>\n  <li><strong>Luôn đánh Index trên cột Khóa ngoại (Foreign Key):</strong> SQL Server, PostgreSQL và SQLite tự động tạo Index cho Khóa chính (PK), nhưng <strong>không tự động tạo Index cho Khóa ngoại (FK)</strong> (trừ MySQL InnoDB). Thiếu Index trên cột FK sẽ làm phép JOIN và thao tác xóa bảng cha bị chậm.</li>\n</ul>",
  "common_errors": [
    "Viết điều kiện lọc của bảng bên phải trong mệnh đề WHERE khi đang dùng LEFT JOIN, vô tình biến LEFT JOIN thành INNER JOIN.",
    "Quên điều kiện ON hoặc viết sai điều kiện ON (ví dụ ON a.Id = a.Id thay vì a.Id = b.A_Id) gây ra tích Đề-các (Cartesian Product) làm bùng nổ hàng triệu dòng.",
    "Nhân bản dòng ngoài ý muốn (Fan-out / Duplication) khi nối bảng Cha (1) với bảng Con (N): Một đơn hàng có 3 mặt hàng sau khi JOIN với ChiTietDon sẽ biến thành 3 dòng đơn hàng, nếu tính SUM(PhiShip) trực tiếp sẽ bị gấp 3 lần!",
    "Dùng UNION thay vì UNION ALL theo thói quen, bắt máy chủ phải Sort và khử trùng lặp rất nặng nề trong khi dữ liệu hai nhánh vốn đã tách biệt.",
    "Không đặt bí danh bảng (Table Alias) khi viết SELF JOIN hoặc khi hai bảng có cột trùng tên (như cột Id, Name), dẫn tới lỗi Ambiguous column name."
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "Phân biệt INNER JOIN và LEFT JOIN. Nếu bảng A có 5 dòng, bảng B có 3 dòng, số dòng tối thiểu và tối đa của A INNER JOIN B và A LEFT JOIN B là bao nhiêu?",
      "a_short": "INNER JOIN chỉ lấy dòng khớp ở cả hai bảng (tối thiểu 0 dòng, tối đa 5*3 = 15 dòng). LEFT JOIN luôn giữ toàn bộ dòng bảng A (tối thiểu 5 dòng, tối đa 15 dòng).",
      "a_long": "Trường hợp tối thiểu: Nếu không có giá trị khóa nào khớp nhau giữa A và B, A INNER JOIN B trả về 0 dòng, còn A LEFT JOIN B vẫn trả về đúng 5 dòng của bảng A (với các cột bảng B là NULL). Trường hợp tối đa: Nếu mọi dòng của A đều khớp với mọi dòng của B (ví dụ cột nối của cả hai bảng đều chứa cùng một giá trị '1'), cả INNER JOIN lẫn LEFT JOIN đều sinh ra tích Đề-các là 5 * 3 = 15 dòng."
    },
    {
      "level": "Junior",
      "q": "Khi dùng LEFT JOIN, việc đặt điều kiện lọc bảng bên phải ở mệnh đề ON khác gì với đặt ở mệnh đề WHERE?",
      "a_short": "Đặt ở ON chỉ lọc các dòng của bảng phải trước khi ghép nên vẫn giữ đủ 100% dòng của bảng trái; đặt ở WHERE lọc sau khi đã ghép nên sẽ loại bỏ luôn các dòng bảng trái có phần ghép bị NULL.",
      "a_long": "Trong thứ tự xử lý truy vấn, mệnh đề ON chạy trước để xác định cặp ghép, sau đó bước OUTER JOIN mới điền NULL cho các dòng bảng trái không có cặp. Nếu điều kiện bảng phải nằm ở ON, các dòng không thỏa sẽ biến thành NULL nhưng dòng bảng trái vẫn sống sót. Ngược lại, mệnh đề WHERE chạy sau cùng; bất kỳ điều kiện so sánh bằng nào trên cột bảng phải (ví dụ WHERE B.Status = 'ACTIVE') sẽ đánh giá thành UNKNOWN đối với các dòng NULL và loại bỏ chúng, làm mất tác dụng của LEFT JOIN."
    },
    {
      "level": "Mid",
      "q": "CROSS APPLY và OUTER APPLY trong SQL Server khác gì với INNER JOIN và LEFT JOIN truyền thống?",
      "a_short": "APPLY cho phép biểu thức bên phải (subquery hoặc Table-Valued Function) tham chiếu trực tiếp tới từng dòng của bảng bên trái để tính toán động (giống vòng lặp ForEach), điều mà JOIN truyền thống không làm được.",
      "a_long": "Với JOIN truyền thống, hai tập dữ liệu trái và phải được xác định độc lập rồi mới ghép qua điều kiện ON. Với CROSS APPLY (tương tự INNER JOIN) và OUTER APPLY (tương tự LEFT JOIN), vế bên phải được đánh giá lại cho từng dòng của vế bên trái. Nhờ đó bạn có thể viết bài toán 'Lấy 3 đơn hàng gần nhất của từng khách hàng' bằng OUTER APPLY (SELECT TOP 3 ... WHERE dh.MaKH = kh.MaKH ORDER BY NgayDat DESC), hoặc truyền cột của bảng trái vào một Table-Valued Function."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 3.1: Liệt kê sách và tên tác giả (Quan hệ nhiều-nhiều)",
      "problem": "Trên CSDL Library, hãy nối 3 bảng Books, BooksAuthors và Authors để lấy ra Title (tên sách), Name (tên tác giả) và Country (quốc gia). Chỉ lấy các sách đã có tác giả, sắp xếp theo Title tăng dần, Name tăng dần.",
      "intuition": "Bảng trung gian BooksAuthors nối với Books qua BookId và nối với Authors qua AuthorId.",
      "trace": "Sách số 8 ('Clean Architecture Draft') chưa có dòng nào trong BooksAuthors và tác giả số 9 ('Haruki Murakami') chưa có sách nên cả hai không xuất hiện khi dùng INNER JOIN.",
      "sql": "SELECT b.Title, a.Name, a.Country\nFROM Books AS b\nINNER JOIN BooksAuthors AS ba ON b.Id = ba.BookId\nINNER JOIN Authors AS a ON ba.AuthorId = a.Id\nORDER BY b.Title ASC, a.Name ASC;",
      "db": "library",
      "expected": {
        "cols": [
          "Title",
          "Name",
          "Country"
        ],
        "rows": [
          [
            "Franny and Zooey",
            "J.D. Salinger",
            "USA"
          ],
          [
            "Nine Stories",
            "J.D. Salinger",
            "USA"
          ],
          [
            "Pride and Prejudice",
            "Jane Austen",
            "UK"
          ],
          [
            "Professional ASP.NET 4.5 in C# and VB",
            "Christian Wenz",
            "USA"
          ],
          [
            "Professional ASP.NET 4.5 in C# and VB",
            "Jason N. Gaylord",
            "USA"
          ],
          [
            "Professional ASP.NET 4.5 in C# and VB",
            "Pranav Rastogi",
            "India"
          ],
          [
            "Professional ASP.NET 4.5 in C# and VB",
            "Scott Hanselman",
            "USA"
          ],
          [
            "Professional ASP.NET 4.5 in C# and VB",
            "Todd Miranda",
            "USA"
          ],
          [
            "Tender id the Night",
            "F. Scott. Fitzgerald",
            "USA"
          ],
          [
            "The Catcher in the Rye",
            "J.D. Salinger",
            "USA"
          ],
          [
            "The Great Gatsby",
            "F. Scott. Fitzgerald",
            "USA"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Cần 2 phép INNER JOIN liên tiếp đi qua bảng cầu nối BooksAuthors.",
        "SELECT b.Title, a.Name, a.Country FROM Books b INNER JOIN BooksAuthors ba ON b.Id = ba.BookId INNER JOIN Authors a ON ...;",
        "SELECT b.Title, a.Name, a.Country FROM Books AS b INNER JOIN BooksAuthors AS ba ON b.Id = ba.BookId INNER JOIN Authors AS a ON ba.AuthorId = a.Id ORDER BY b.Title ASC, a.Name ASC;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 3.2: Tìm các quốc gia chưa có thành phố nào trong CSDL",
      "problem": "Trên CSDL Countries, hãy tìm Id và Name của những quốc gia trong bảng Countries chưa có bất kỳ thành phố nào trong bảng Cities.",
      "intuition": "Dùng LEFT JOIN từ Countries sang Cities theo CountryId, sau đó lọc WHERE Cities.Id IS NULL.",
      "trace": "Bảng Countries có 5 nước: Russia (3 TP), Germany (2 TP), US (3 TP), Spain (0 TP), Vietnam (2 TP). Kết quả trả về duy nhất Spain (Id = 4).",
      "sql": "SELECT c.Id, c.Name\nFROM Countries AS c\nLEFT JOIN Cities AS ci ON c.Id = ci.CountryId\nWHERE ci.Id IS NULL;",
      "db": "countries",
      "expected": {
        "cols": [
          "Id",
          "Name"
        ],
        "rows": [
          [
            4,
            "Spain"
          ]
        ]
      },
      "order_matters": false,
      "hints": [
        "Dùng mẫu câu kinh điển LEFT JOIN ... WHERE bang_phai.khoa_chinh IS NULL.",
        "SELECT c.Id, c.Name FROM Countries AS c LEFT JOIN Cities AS ci ON c.Id = ci.CountryId WHERE ...;",
        "SELECT c.Id, c.Name FROM Countries AS c LEFT JOIN Cities AS ci ON c.Id = ci.CountryId WHERE ci.Id IS NULL;"
      ]
    },
    {
      "num": 3,
      "title": "Bài 3.3: Tìm nhân viên có mức lương cao hơn người quản lý trực tiếp của chính mình",
      "problem": "Trên CSDL Auto Shop, hãy tìm các nhân viên có mức lương (Salary) lớn hơn mức lương của người quản lý trực tiếp của họ. Trả về TenNhanVien (FName || ' ' || LName), LuongNV, TenQuanLy và LuongQuanLy.",
      "intuition": "Dùng SELF JOIN trên bảng Employees: nhân viên (e) nối với quản lý (m) qua điều kiện e.ManagerId = m.Id AND e.Salary > m.Salary.",
      "trace": "Kiểm tra từng người: John (400 < James 1000), Michael (600 < James 1000), Johnathon (500 > John 400 -> THỎA MÃN!), William (800 > Michael 600 -> THỎA MÃN!), Sarah (750 < William 800).",
      "sql": "SELECT e.FName || ' ' || e.LName AS TenNhanVien,\n       e.Salary AS LuongNV,\n       m.FName || ' ' || m.LName AS TenQuanLy,\n       m.Salary AS LuongQuanLy\nFROM Employees AS e\nINNER JOIN Employees AS m ON e.ManagerId = m.Id\nWHERE e.Salary > m.Salary\nORDER BY e.Salary DESC;",
      "db": "autoshop",
      "expected": {
        "cols": [
          "TenNhanVien",
          "LuongNV",
          "TenQuanLy",
          "LuongQuanLy"
        ],
        "rows": [
          [
            "William Morris",
            800,
            "Michael Williams",
            600
          ],
          [
            "Johnathon Smith",
            500,
            "John Johnson",
            400
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Đặt bí danh bảng Employees là e (nhân viên) và m (quản lý), nối qua e.ManagerId = m.Id.",
        "Thêm điều kiện WHERE e.Salary > m.Salary.",
        "SELECT e.FName || ' ' || e.LName AS TenNhanVien, e.Salary AS LuongNV, m.FName || ' ' || m.LName AS TenQuanLy, m.Salary AS LuongQuanLy FROM Employees AS e INNER JOIN Employees AS m ON e.ManagerId = m.Id WHERE e.Salary > m.Salary ORDER BY e.Salary DESC;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch03_p1",
      "title": "Báo cáo tất cả các khoa kèm danh sách môn học của học kỳ 2024B (Bẫy ON vs WHERE)",
      "difficulty": "Khá",
      "db": "truonghoc",
      "summary": "Trên CSDL TruongHoc, hãy liệt kê tất cả các môn học (MaMH, TenMH) cùng mã sinh viên (MaSV) và điểm quá trình (DiemQT) của những lượt đăng ký trong học kỳ '2024B'. Nếu môn học nào không có ai đăng ký trong học kỳ '2024B', vẫn phải hiển thị môn học đó với MaSV và DiemQT là NULL. Sắp xếp theo MaMH tăng dần.",
      "understand": "Nếu bạn LEFT JOIN MonHoc với DangKy rồi viết WHERE dk.HocKy = '2024B', các môn không có người học ở kỳ 2024B sẽ có dk.HocKy là NULL và bị WHERE xóa sạch! Phải đặt điều kiện dk.HocKy = '2024B' ngay trong mệnh đề ON của LEFT JOIN.",
      "brute": "Viết 2 câu truy vấn riêng rồi ghép trong code, hoặc dùng subquery phức tạp.",
      "optimal": "Dùng LEFT JOIN MonHoc mh LEFT JOIN DangKy dk ON mh.MaMH = dk.MaMH AND dk.HocKy = '2024B'.",
      "trace": "Có 5 môn học: CS101 có SV 204 học kỳ 2024B; CS201 có SV 201 học kỳ 2024B; 3 môn CS102, EC101, EE101 không có lượt đăng ký 2024B nên vẫn hiển thị với MaSV = NULL.",
      "sql": "SELECT mh.MaMH, mh.TenMH, dk.MaSV, dk.DiemQT\nFROM MonHoc AS mh\nLEFT JOIN DangKy AS dk\n       ON mh.MaMH = dk.MaMH AND dk.HocKy = '2024B'\nORDER BY mh.MaMH ASC;",
      "expected": {
        "cols": [
          "MaMH",
          "TenMH",
          "MaSV",
          "DiemQT"
        ],
        "rows": [
          [
            "CS101",
            "Co So Du Lieu",
            204,
            7.5
          ],
          [
            "CS102",
            "Cau Truc Du Lieu & Giai Thuat",
            null,
            null
          ],
          [
            "CS201",
            "Lap Trinh Backend Java/C#",
            201,
            9.0
          ],
          [
            "EC101",
            "Kinh Te Vi Mo",
            null,
            null
          ],
          [
            "EE101",
            "Mach Dien Tu",
            null,
            null
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Đặt dk.HocKy = '2024B' ở mệnh đề WHERE làm mất 3 môn CS102, EC101, EE101.",
      "note3": {
        "idea": "Khi dùng LEFT JOIN mà chỉ muốn lọc dữ liệu của bảng bên phải nhưng vẫn giữ đủ các dòng của bảng bên trái, phải đặt điều kiện lọc bảng phải vào trong mệnh đề ON.",
        "syntax": "FROM LeftTable l LEFT JOIN RightTable r ON l.Id = r.LeftId AND r.FilterCol = 'Val'",
        "trap": "Đặt r.FilterCol = 'Val' ở WHERE sẽ triệt tiêu các dòng NULL sinh ra bởi LEFT JOIN, biến LEFT JOIN thành INNER JOIN."
      }
    },
    {
      "id": "ch03_p2",
      "title": "Gộp danh bạ liên hệ của Khách hàng và Nhân viên không trùng số điện thoại",
      "difficulty": "Trung bình",
      "db": "autoshop",
      "summary": "Trên CSDL Auto Shop, xưởng xe muốn gửi tin nhắn chúc Tết tới toàn bộ số điện thoại (PhoneNumber khác NULL) của cả Nhân viên (Employees) và Khách hàng (Customers). Hãy xuất danh sách gồm 2 cột: LoaiDoiTuong ('NHAN_VIEN' hoặc 'KHACH_HANG'), HoTen (FName || ' ' || LName) và PhoneNumber, sắp xếp theo LoaiDoiTuong tăng dần, HoTen tăng dần.",
      "understand": "Hai bảng có cấu trúc khác nhau nhưng đều trích xuất được 3 cột cùng kiểu dữ liệu. Dùng UNION ALL (vì cột LoaiDoiTuong đã khác nhau nên không có dòng nào trùng giữa 2 bảng) kết hợp lọc PhoneNumber IS NOT NULL ở mỗi nhánh.",
      "brute": "Chạy 2 câu lệnh SELECT trong ứng dụng rồi nối 2 List trong bộ nhớ.",
      "optimal": "Dùng UNION ALL nối 2 câu SELECT có cùng số lượng cột và kiểu dữ liệu tương thích, đặt ORDER BY ở cuối cùng.",
      "trace": "Bảng Employees có 5 người có SĐT (Sarah Connor bị NULL). Bảng Customers có 3 người có SĐT (Richard Davis bị NULL). Tổng cộng trả về 8 dòng.",
      "sql": "SELECT 'NHAN_VIEN' AS LoaiDoiTuong, FName || ' ' || LName AS HoTen, PhoneNumber\nFROM Employees\nWHERE PhoneNumber IS NOT NULL\nUNION ALL\nSELECT 'KHACH_HANG' AS LoaiDoiTuong, FName || ' ' || LName AS HoTen, PhoneNumber\nFROM Customers\nWHERE PhoneNumber IS NOT NULL\nORDER BY LoaiDoiTuong ASC, HoTen ASC;",
      "expected": {
        "cols": [
          "LoaiDoiTuong",
          "HoTen",
          "PhoneNumber"
        ],
        "rows": [
          [
            "KHACH_HANG",
            "David Miller",
            "2137921892"
          ],
          [
            "KHACH_HANG",
            "Thomas Wilson",
            "4455667788"
          ],
          [
            "KHACH_HANG",
            "William Jones",
            "3347927472"
          ],
          [
            "NHAN_VIEN",
            "James Smith",
            "1234567890"
          ],
          [
            "NHAN_VIEN",
            "John Johnson",
            "2468101214"
          ],
          [
            "NHAN_VIEN",
            "Johnathon Smith",
            "1212121212"
          ],
          [
            "NHAN_VIEN",
            "Michael Williams",
            "1357911131"
          ],
          [
            "NHAN_VIEN",
            "William Morris",
            "5556667777"
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Đặt mệnh đề ORDER BY ở giữa câu SELECT thứ nhất trước từ khóa UNION ALL (cú pháp SQL chỉ cho phép một ORDER BY duy nhất ở cuối toàn bộ khối UNION).",
      "note3": {
        "idea": "Dùng UNION ALL thay vì UNION khi biết chắc hai tập hợp không giao nhau hoặc không cần khử trùng để tiết kiệm chi phí Sort.",
        "syntax": "SELECT a, b FROM T1 UNION ALL SELECT c, d FROM T2 ORDER BY a;",
        "trap": "Dùng UNION (không có ALL) bắt máy chủ phải Sort để khử trùng lặp không cần thiết; hoặc viết ORDER BY ở từng nhánh con."
      }
    }
  ],
  "summary_table": [
    [
      "INNER JOIN",
      "Giữ các dòng khớp ở cả hai bảng",
      "Loại bỏ các dòng không có đối tác liên kết"
    ],
    [
      "LEFT JOIN",
      "Giữ 100% dòng bảng trái, điền NULL bên phải nếu không khớp",
      "Đặt điều kiện lọc bảng phải ở ON nếu muốn giữ dòng bảng trái"
    ],
    [
      "SELF JOIN",
      "Bảng tự nối với chính nó qua 2 bí danh khác nhau",
      "Bắt buộc dùng Table Alias (ví dụ e và m)"
    ],
    [
      "UNION ALL vs UNION",
      "Gộp dòng theo chiều dọc (giữ trùng vs khử trùng)",
      "Luôn ưu tiên UNION ALL nếu không cần khử trùng"
    ],
    [
      "EXCEPT / INTERSECT",
      "Phép hiệu và phép giao của hai tập kết quả",
      "Tự động khử trùng lặp giống DISTINCT"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Muốn tìm tất cả sản phẩm trong bảng SanPham chưa từng xuất hiện trong bảng ChiTietDon, bạn có thể dùng những cách nào đã học ở Chương 3?",
      "a": "Cách 1: Dùng LEFT JOIN từ SanPham sang ChiTietDon rồi lọc WHERE ChiTietDon.MaSP IS NULL. Cách 2: Dùng phép hiệu tập hợp SELECT MaSP FROM SanPham EXCEPT SELECT MaSP FROM ChiTietDon."
    },
    {
      "q": "Câu 2: Tại sao câu lệnh SELECT Id FROM Customers UNION SELECT FName, LName FROM Employees lại bị báo lỗi cú pháp?",
      "a": "Vì toán tử UNION yêu cầu tất cả các câu lệnh SELECT thành phần phải có cùng số lượng cột (câu đầu có 1 cột, câu sau có 2 cột)."
    },
    {
      "q": "Câu 3: Khi thực hiện SELF JOIN trên bảng Employees để tìm người quản lý của mỗi nhân viên, tại sao ta nên dùng LEFT JOIN thay vì INNER JOIN?",
      "a": "Vì Giám đốc cao nhất không có người quản lý (cột ManagerId mang giá trị NULL). Nếu dùng INNER JOIN, dòng của Giám đốc sẽ bị biến mất khỏi danh sách nhân sự."
    }
  ]
});
