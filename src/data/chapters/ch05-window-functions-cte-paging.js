/**
 * FILE: src/data/chapters/ch05-window-functions-cte-paging.js
 * MÔ TẢ: Chương 5 - Window Functions, CTE, Đệ Quy, Phân Trang & Khử Trùng Lặp
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch05",
  "code": "Chương 5",
  "title": "Window Functions, CTE, Đệ Quy, Phân Trang & Khử Trùng Lặp",
  "sources": [
    "S ch.14, 38, 40, 44, 45, 46",
    "M ch.22, 36, 38, 40, 45, 46, 80, 87"
  ],
  "goals": [
    "Làm chủ các hàm cửa sổ (Window Functions): xếp hạng (ROW_NUMBER, RANK, DENSE_RANK, NTILE), dịch dòng (LAG, LEAD) và tổng hợp trên khung cửa sổ.",
    "Hiểu rõ CTE (Common Table Expression) thường và CTE Đệ quy (Recursive CTE) để xử lý cấu trúc cây danh mục/nhân sự.",
    "Triển khai quy trình chuẩn để phát hiện và xóa các bản ghi trùng lặp (Deduplication) trong bảng thực tế.",
    "Phân biệt rõ ưu nhược điểm của phân trang truyền thống (OFFSET/FETCH) và phân trang bằng con trỏ (Keyset/Seek Pagination)."
  ],
  "signals": [
    "Bài toán 'Top-N mỗi nhóm' (lấy 3 nhân viên lương cao nhất mỗi phòng, lấy 2 đơn hàng gần nhất mỗi khách).",
    "Tính doanh thu lũy kế từ đầu năm (Running Total), trung bình trượt 7 ngày (Moving Average), hoặc tăng trưởng so với tháng liền trước (MoM).",
    "Xây dựng API cuộn vô tận (Infinite Scroll) hoặc phân trang trên bảng hàng chục triệu bản ghi mà không bị chậm ở các trang cuối."
  ],
  "theory": "<h3>5.1. Bản chất của Window Function (Hàm cửa sổ): Tại sao nó là vũ khí tối thượng?</h3>\n<p>Khi bạn dùng <code>GROUP BY</code> (Chương 4), các dòng chi tiết bị ép gộp lại thành một dòng duy nhất cho mỗi nhóm. Nhưng trong rất nhiều bài toán thực tế, bạn vừa muốn <strong>giữ nguyên từng dòng chi tiết</strong>, lại vừa muốn <strong>nhìn qua một \"khung cửa sổ\" (Window) gồm các dòng lân cận</strong> để xếp hạng, tính tổng nhóm hoặc so sánh với dòng trước đó. Đó chính là lý do <strong>Window Function (mệnh đề <code>OVER(...)</code>)</strong> ra đời!</p>\n<p>Cấu trúc giải phẫu đầy đủ của một hàm cửa sổ gồm 3 phần bên trong <code>OVER(...)</code>:</p>\n<ul>\n  <li><code>PARTITION BY cot_nhom</code>: Chia bảng thành các vách ngăn (phân vùng) độc lập. Hàm cửa sổ sẽ tính toán lại từ đầu khi bước sang phân vùng mới. Nếu bỏ qua <code>PARTITION BY</code>, toàn bộ bảng được coi là 1 phân vùng duy nhất.</li>\n  <li><code>ORDER BY cot_sap_xep</code>: Quy định thứ tự các dòng bên trong mỗi phân vùng (bắt buộc phải có đối với <code>ROW_NUMBER</code>, <code>RANK</code>, <code>DENSE_RANK</code>, <code>LAG</code>, <code>LEAD</code>).</li>\n  <li><code>ROWS | RANGE BETWEEN ... AND ...</code> (Window Frame - Khung trượt): Xác định phạm vi dòng con bên trong phân vùng để tính tổng/trung bình (ví dụ từ dòng đầu tiên đến dòng hiện tại: <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>).</li>\n</ul>\n\n<h3>5.2. Phân biệt 3 hàm xếp hạng và cái bẫy mặc định của Window Frame</h3>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Hàm cửa sổ</th>\n      <th>Cách xử lý khi có các dòng bằng điểm nhau (Ties)</th>\n      <th>Ví dụ chuỗi điểm (100, 90, 90, 80)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><code>ROW_NUMBER()</code></td>\n      <td>Luôn đánh số tăng dần duy nhất, không bao giờ trùng số (dòng nào đứng trước lấy số nhỏ hơn).</td>\n      <td><code>1, 2, 3, 4</code></td>\n    </tr>\n    <tr>\n      <td><code>RANK()</code></td>\n      <td>Các dòng bằng điểm nhận cùng thứ hạng, nhưng <strong>nhảy cóc (bỏ trống)</strong> các thứ hạng kế tiếp.</td>\n      <td><code>1, 2, 2, 4</code> (mất hạng 3)</td>\n    </tr>\n    <tr>\n      <td><code>DENSE_RANK()</code></td>\n      <td>Các dòng bằng điểm nhận cùng thứ hạng, và thứ hạng kế tiếp <strong>tăng liên tục không bị hổng</strong>.</td>\n      <td><code>1, 2, 2, 3</code></td>\n    </tr>\n  </tbody>\n</table>\n<div class=\"callout-info\">\n  <strong>Bẫy cực kỳ tinh vi của Window Frame:</strong> Khi bạn dùng <code>SUM(x) OVER (PARTITION BY g)</code> (không có <code>ORDER BY</code>), khung mặc định là toàn bộ phân vùng. Nhưng ngay khi bạn viết thêm <code>ORDER BY</code> vào trong <code>OVER</code>: <code>SUM(x) OVER (PARTITION BY g ORDER BY id)</code>, chuẩn SQL tự động đổi khung mặc định thành <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> (tính tổng lũy kế từ đầu tới dòng hiện tại!). Và với hàm <code>LAST_VALUE(x) OVER (ORDER BY id)</code>, vì khung mặc định dừng ở <code>CURRENT ROW</code> nên nó luôn trả về giá trị của... chính dòng hiện tại, trừ khi bạn mở rộng khung thành <code>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code>!\n</div>\n\n<h3>5.3. CTE (Common Table Expression) và Đệ quy (Recursive CTE)</h3>\n<p><strong>CTE</strong> được khai báo bằng từ khóa <code>WITH TenCTE AS (SELECT ...)</code> ngay đầu câu truy vấn. Nó đóng vai trò như một bảng tạm có tên tồn tại duy nhất trong phạm vi của câu lệnh đó, giúp chia nhỏ câu SQL dài hàng trăm dòng thành các bước logic rõ ràng và cho phép lọc trên kết quả của Window Function.</p>\n<p><strong>Recursive CTE</strong> (trong SQLite/PostgreSQL có thêm từ khóa <code>WITH RECURSIVE</code>, còn trong T-SQL chỉ cần <code>WITH</code>) là một CTE tự tham chiếu tới chính tên của nó để duyệt cây phân cấp (danh mục đa cấp, sơ đồ tổ chức công ty, chuỗi ngày liên tục). Trong SQL Server, mặc định đệ quy tối đa 100 vòng; nếu cây sâu hơn hoặc tạo chuỗi lớn hơn 100 dòng, bạn phải gắn thêm <code>OPTION (MAXRECURSION 1000)</code> (hoặc <code>0</code> là không giới hạn) ở cuối câu lệnh.</p>",
  "mechanism": "<h3>Chạy tay từng bước: Vì sao không viết được Window Function trong mệnh đề WHERE?</h3>\n<p>Trong thứ tự thực thi câu lệnh SQL đã học ở Chương 4, <strong>các hàm cửa sổ <code>OVER(...)</code> chỉ được tính toán ở Bước 5 (cùng lúc với mệnh đề <code>SELECT</code>)</strong>, tức là sau khi cả <code>FROM</code>, <code>WHERE</code>, <code>GROUP BY</code> và <code>HAVING</code> đã chạy xong!</p>\n<p>Bởi vì tại thời điểm bước <code>WHERE</code> đang chạy, cột <code>ROW_NUMBER()</code> hay <code>DENSE_RANK()</code> chưa hề tồn tại, bạn bắt buộc phải tính Window Function ở một truy vấn trong (CTE hoặc Subquery), rồi dùng mệnh đề <code>WHERE</code> ở câu truy vấn bọc bên ngoài.</p>\n\n<h4>Minh họa chạy tay khử trùng lặp (Deduplication) bằng CTE + ROW_NUMBER()</h4>\n<p>Giả sử bảng <code>PersonEmail</code> có 3 dòng: <code>(id=1, 'a@b.com')</code>, <code>(id=2, 'c@d.com')</code>, <code>(id=3, 'a@b.com')</code>. Ta cần giữ lại dòng có <code>id</code> nhỏ nhất của mỗi email và xóa các bản sao:</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>id</th>\n      <th>email</th>\n      <th>Phân vùng (PARTITION BY email)</th>\n      <th>ROW_NUMBER() OVER (PARTITION BY email ORDER BY id ASC) AS rn</th>\n      <th>Hành động (WHERE rn &gt; 1)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>1</td>\n      <td>a@b.com</td>\n      <td>Nhóm 'a@b.com' (dòng 1)</td>\n      <td><strong>rn = 1</strong></td>\n      <td>Giữ lại (Bản gốc sớm nhất)</td>\n    </tr>\n    <tr>\n      <td>3</td>\n      <td>a@b.com</td>\n      <td>Nhóm 'a@b.com' (dòng 2)</td>\n      <td><strong>rn = 2</strong></td>\n      <td><strong>XÓA! (Bản sao trùng lặp)</strong></td>\n    </tr>\n    <tr>\n      <td>2</td>\n      <td>c@d.com</td>\n      <td>Nhóm 'c@d.com' (dòng 1)</td>\n      <td><strong>rn = 1</strong></td>\n      <td>Giữ lại (Bản gốc duy nhất)</td>\n    </tr>\n  </tbody>\n</table>",
  "examples": [
    {
      "title": "Ví dụ 5.1: So sánh bộ ba xếp hạng ROW_NUMBER(), RANK() và DENSE_RANK()",
      "label": "CHUAN",
      "db": "leetcode",
      "sql": "SELECT id, score,\n       ROW_NUMBER() OVER (ORDER BY score DESC) AS SoThuTu,\n       RANK()       OVER (ORDER BY score DESC) AS HangRank,\n       DENSE_RANK() OVER (ORDER BY score DESC) AS HangDenseRank\nFROM Scores\nORDER BY score DESC, id ASC;",
      "result": {
        "cols": [
          "id",
          "score",
          "SoThuTu",
          "HangRank",
          "HangDenseRank"
        ],
        "rows": [
          [
            3,
            4.0,
            1,
            1,
            1
          ],
          [
            5,
            4.0,
            2,
            1,
            1
          ],
          [
            4,
            3.85,
            3,
            3,
            2
          ],
          [
            2,
            3.65,
            4,
            4,
            3
          ],
          [
            6,
            3.65,
            5,
            4,
            3
          ],
          [
            1,
            3.5,
            6,
            6,
            4
          ]
        ]
      },
      "note": "Quan sát hai dòng có score = 4.00: ROW_NUMBER đánh số 1 và 2; cả RANK và DENSE_RANK đều đánh đồng hạng 1. Nhưng tới dòng 3.85 kế tiếp: RANK nhảy vọt sang hạng 3 (bỏ trống hạng 2), còn DENSE_RANK lên hạng 2 liên tục không bị hổng!"
    },
    {
      "title": "Ví dụ 5.2: Kết hợp CTE và DENSE_RANK(PARTITION BY ...) giải bài toán Top-N mỗi phòng ban",
      "label": "CHUAN",
      "db": "leetcode",
      "sql": "WITH BangXepHangLuong AS (\n    SELECT d.name AS PhongBan, e.name AS NhanVien, e.salary AS Luong,\n           DENSE_RANK() OVER (\n               PARTITION BY e.departmentId\n               ORDER BY e.salary DESC\n           ) AS HangTrongPhong\n    FROM LC_Employee AS e\n    INNER JOIN LC_Department AS d ON e.departmentId = d.id\n)\nSELECT PhongBan, NhanVien, Luong, HangTrongPhong\nFROM BangXepHangLuong\nWHERE HangTrongPhong <= 3\nORDER BY PhongBan ASC, HangTrongPhong ASC, NhanVien ASC;",
      "result": {
        "cols": [
          "PhongBan",
          "NhanVien",
          "Luong",
          "HangTrongPhong"
        ],
        "rows": [
          [
            "IT",
            "Max",
            90000,
            1
          ],
          [
            "IT",
            "Joe",
            85000,
            2
          ],
          [
            "IT",
            "Randy",
            85000,
            2
          ],
          [
            "IT",
            "Will",
            70000,
            3
          ],
          [
            "Sales",
            "Henry",
            80000,
            1
          ]
        ]
      },
      "note": "Vì không thể viết trực tiếp hàm cửa sổ OVER(...) ở trong mệnh đề WHERE, ta bọc nó vào một CTE (Common Table Expression) bằng từ khóa WITH, rồi lọc WHERE HangTrongPhong <= 3 ở câu truy vấn bên ngoài."
    },
    {
      "title": "Ví dụ 5.3: So sánh với dòng trước/sau bằng LAG() và LEAD(), tính tổng lũy kế (Running Total)",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "SELECT MaDH, NgayDat, PhiShip,\n       LAG(PhiShip, 1, 0) OVER (ORDER BY NgayDat, MaDH) AS ShipDonTruoc,\n       PhiShip - LAG(PhiShip, 1, 0) OVER (ORDER BY NgayDat, MaDH) AS ChenhLechShip,\n       SUM(PhiShip) OVER (\n           ORDER BY NgayDat, MaDH\n           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n       ) AS TongShipLuyKe\nFROM DonHang\nORDER BY NgayDat, MaDH;",
      "result": {
        "cols": [
          "MaDH",
          "NgayDat",
          "PhiShip",
          "ShipDonTruoc",
          "ChenhLechShip",
          "TongShipLuyKe"
        ],
        "rows": [
          [
            1001,
            "2024-01-05",
            30,
            0,
            30,
            30
          ],
          [
            1002,
            "2024-01-12",
            0,
            30,
            -30,
            30
          ],
          [
            1003,
            "2024-02-01",
            25,
            0,
            25,
            55
          ],
          [
            1004,
            "2024-02-15",
            40,
            25,
            15,
            95
          ],
          [
            1005,
            "2024-03-02",
            0,
            40,
            -40,
            95
          ],
          [
            1006,
            "2024-03-10",
            30,
            0,
            30,
            125
          ],
          [
            1007,
            "2024-03-25",
            0,
            30,
            -30,
            125
          ]
        ]
      },
      "note": "LAG(cột, bước_lùi, giá_trị_mặc_định) giúp lấy giá trị của dòng đứng trước mà không cần phải SELF JOIN tốn kém. Khung cửa sổ ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW cộng dồn từ dòng đầu tiên tới dòng hiện tại."
    },
    {
      "title": "Ví dụ 5.4: Truy vấn cây phân cấp nhân sự bằng Đệ quy CTE (Recursive CTE)",
      "label": "CHUAN",
      "db": "autoshop",
      "sql": "WITH RECURSIVE CayNhanSu AS (\n    -- Phần neo (Anchor member): Giám đốc cao nhất (ManagerId IS NULL)\n    SELECT Id, FName || ' ' || LName AS HoTen, ManagerId, 1 AS CapBac,\n           FName || ' ' || LName AS DuongDanQuanLy\n    FROM Employees\n    WHERE ManagerId IS NULL\n    UNION ALL\n    -- Phần đệ quy (Recursive member): Nhân viên cấp dưới nối với cấp trên\n    SELECT e.Id, e.FName || ' ' || e.LName, e.ManagerId, c.CapBac + 1,\n           c.DuongDanQuanLy || ' -> ' || e.FName || ' ' || e.LName\n    FROM Employees AS e\n    INNER JOIN CayNhanSu AS c ON e.ManagerId = c.Id\n)\nSELECT Id, HoTen, CapBac, DuongDanQuanLy\nFROM CayNhanSu\nORDER BY CapBac ASC, Id ASC;",
      "result": {
        "cols": [
          "Id",
          "HoTen",
          "CapBac",
          "DuongDanQuanLy"
        ],
        "rows": [
          [
            1,
            "James Smith",
            1,
            "James Smith"
          ],
          [
            2,
            "John Johnson",
            2,
            "James Smith -> John Johnson"
          ],
          [
            3,
            "Michael Williams",
            2,
            "James Smith -> Michael Williams"
          ],
          [
            4,
            "Johnathon Smith",
            3,
            "James Smith -> John Johnson -> Johnathon Smith"
          ],
          [
            5,
            "William Morris",
            3,
            "James Smith -> Michael Williams -> William Morris"
          ],
          [
            6,
            "Sarah Connor",
            4,
            "James Smith -> Michael Williams -> William Morris -> Sarah Connor"
          ]
        ]
      },
      "note": "Recursive CTE gồm 2 phần nối nhau bằng UNION ALL: phần neo lấy gốc cây (cấp 1), phần đệ quy tự JOIN lại với chính tên CTE để tìm các nhánh con (cấp 2, 3, 4...)."
    },
    {
      "title": "Ví dụ 5.5: So sánh Phân trang bằng OFFSET/LIMIT truyền thống và Keyset Pagination (Seek Method)",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "-- Cách 1: OFFSET/LIMIT (chậm khi nhảy tới trang thứ 10.000)\nSELECT MaSP, TenSP, DonGia FROM SanPham ORDER BY DonGia DESC, MaSP ASC LIMIT 3 OFFSET 2;",
      "result": {
        "cols": [
          "MaSP",
          "TenSP",
          "DonGia"
        ],
        "rows": [
          [
            104,
            "Tai Nghe Sony WH-1000XM5",
            6900
          ],
          [
            107,
            "Webcam Elgato Facecam",
            4200
          ],
          [
            102,
            "Chuot Logitech MX Master 3S",
            2200
          ]
        ]
      },
      "note": "OFFSET 2 LIMIT 3 bỏ qua 2 dòng đầu và lấy 3 dòng tiếp theo. Ở trang sâu (ví dụ OFFSET 1000000), máy chủ vẫn phải đọc và sắp xếp 1.000.003 dòng rồi vứt bỏ 1 triệu dòng đầu!"
    },
    {
      "title": "Ví dụ 5.6: Cú pháp phân trang chuẩn OFFSET ... FETCH NEXT trong T-SQL và khử trùng lặp trực tiếp qua CTE",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "-- 1. Phân trang trong SQL Server (bắt buộc phải có ORDER BY):\nSELECT MaSP, TenSP, DonGia\nFROM SanPham\nORDER BY DonGia DESC, MaSP ASC\nOFFSET 2 ROWS FETCH NEXT 3 ROWS ONLY;\n\n-- 2. Xóa trực tiếp các dòng trùng lặp qua CTE trong SQL Server:\nWITH CTE_Trung AS (\n    SELECT Id, Email, ROW_NUMBER() OVER (PARTITION BY Email ORDER BY Id ASC) AS rn\n    FROM PersonEmail\n)\nDELETE FROM CTE_Trung WHERE rn > 1;",
      "result": {
        "cols": [
          "MaSP",
          "TenSP",
          "DonGia"
        ],
        "rows": [
          [
            104,
            "Tai Nghe Sony WH-1000XM5",
            6900
          ],
          [
            107,
            "Webcam Elgato Facecam",
            4200
          ],
          [
            102,
            "Chuot Logitech MX Master 3S",
            2200
          ]
        ]
      },
      "note": "Trong SQL Server, bạn có thể chạy lệnh DELETE hoặc UPDATE trực tiếp trên tên của CTE nếu CTE đó chỉ trỏ vào 1 bảng gốc! Trong SQLite/PostgreSQL, bạn viết DELETE FROM PersonEmail WHERE id IN (SELECT id FROM CTE_Trung WHERE rn > 1). (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    }
  ],
  "dialects": [
    [
      "Cú pháp phân trang chuẩn",
      "ORDER BY ... OFFSET m ROWS FETCH NEXT n ROWS ONLY",
      "ORDER BY ... LIMIT n OFFSET m",
      "ORDER BY ... LIMIT n OFFSET m"
    ],
    [
      "Từ khóa CTE đệ quy",
      "WITH TenCTE AS (...) (không có chữ RECURSIVE!)",
      "WITH RECURSIVE TenCTE AS (...)",
      "WITH RECURSIVE TenCTE AS (...)"
    ],
    [
      "Lọc trực tiếp hàm cửa sổ",
      "Phải bọc qua CTE hoặc Subquery",
      "Phải bọc qua CTE hoặc Subquery",
      "Phải bọc qua CTE (Riêng Snowflake/DuckDB/BigQuery có mệnh đề QUALIFY)"
    ]
  ],
  "bridge_java": "// [Java - Spring Data JPA] Cạm bẫy phân trang Pageable kết hợp JOIN FETCH trên quan hệ @OneToMany\n// CẢNH BÁO PHỎNG VẤN: Nếu bạn dùng JOIN FETCH một danh sách con (@OneToMany) đồng thời truyền Pageable (LIMIT/OFFSET),\n// Hibernate sẽ in cảnh báo \"HHH90003004: firstResult/maxResults specified with collection fetch; applying in memory!\"\n// Tức là nó kéo TOÀN BỘ bảng về RAM rồi mới cắt trang vì sợ LIMIT cắt cụt mất các dòng chi tiết của bảng con!\n// Cách giải quyết chuẩn: Bước 1 phân trang chỉ lấy danh sách ID của bảng cha; Bước 2 dùng WHERE id IN (:ids) kèm JOIN FETCH.\n\n@Query(\"SELECT kh.maKh FROM KhachHang kh ORDER BY kh.ngayDangKy DESC, kh.maKh ASC\")\nPage<Integer> findPagedIds(Pageable pageable);\n\n@Query(\"SELECT DISTINCT kh FROM KhachHang kh LEFT JOIN FETCH kh.donHangs WHERE kh.maKh IN :ids\")\nList<KhachHang> findWithOrdersByIds(@Param(\"ids\") List<Integer> ids);",
  "bridge_csharp": "// [C# - EF Core] Triển khai Keyset Pagination tốc độ cao thay thế Skip().Take()\n// Khi bảng DonHangs có 10 triệu dòng, .Skip(1_000_000).Take(20) rất chậm.\n// Hãy nhận (lastNgayDat, lastMaDH) từ trang trước và lọc trực tiếp để tận dụng Index Seek:\n\npublic async Task<List<DonHang>> LayTrangTiepTheoAsync(DateOnly? lastNgayDat, int? lastMaDH, int pageSize = 20)\n{\n    var query = dbContext.DonHangs.AsNoTracking().AsQueryable();\n    if (lastNgayDat.HasValue && lastMaDH.HasValue)\n    {\n        query = query.Where(d =>\n            d.NgayDat < lastNgayDat.Value ||\n            (d.NgayDat == lastNgayDat.Value && d.MaDH < lastMaDH.Value));\n    }\n    return await query\n        .OrderByDescending(d => d.NgayDat)\n        .ThenByDescending(d => d.MaDH)\n        .Take(pageSize)\n        .ToListAsync();\n}",
  "performance": "<ul>\n  <li><strong>Cái giá của <code>OFFSET N</code> ở trang sâu:</strong> Với <code>OFFSET 500000 FETCH NEXT 20 ROWS ONLY</code>, máy chủ không thể nhảy cóc qua 500.000 dòng mà phải quét và đếm đủ 500.020 dòng theo thứ tự Index, vứt bỏ 500.000 dòng đầu rồi mới trả về 20 dòng cuối. Độ phức tạp tăng tuyến tính O(Offset). Với dữ liệu lớn, hãy chuyển sang <strong>Keyset Pagination</strong> (độ phức tạp O(log N) nhờ Index Seek).</li>\n  <li><strong>Bản chất của CTE không phải lúc nào cũng được lưu tạm (Materialized):</strong> Trong SQL Server, CTE chỉ là một bí danh cú pháp ( giống như View nội cục). Nếu bạn tham chiếu tới cùng một tên CTE 3 lần trong câu truy vấn ngoài, SQL Server sẽ <strong>chạy lại câu truy vấn của CTE đó đủ 3 lần</strong>! Nếu CTE rất nặng và cần dùng lại nhiều lần, hãy đổ kết quả của nó ra bảng tạm <code>#TempTable</code>.</li>\n  <li><strong>Tối ưu Index cho Window Function (POC Index):</strong> Để các hàm <code>OVER (PARTITION BY P ORDER BY O)</code> kèm <code>SELECT C</code> không phải thực hiện phép <em>Sort</em> đắt đỏ, hãy đánh Index theo quy tắc <strong>P-O-C (Partition - Order - Covering)</strong>: cột <code>P</code> đứng đầu, cột <code>O</code> đứng thứ hai, và các cột <code>C</code> đặt trong <code>INCLUDE</code>.</li>\n</ul>",
  "common_errors": [
    "Đặt trực tiếp ROW_NUMBER() hoặc RANK() vào mệnh đề WHERE (ví dụ WHERE ROW_NUMBER() OVER (...) = 1): Gây lỗi cú pháp vì hàm cửa sổ chạy ở bước SELECT, sau bước WHERE.",
    "Dùng chữ RECURSIVE trong SQL Server (WITH RECURSIVE cte AS ...): T-SQL không có từ khóa RECURSIVE mà tự nhận diện đệ quy khi thấy CTE tự gọi tên nó; ngược lại PostgreSQL, MySQL và SQLite bắt buộc phải có từ khóa RECURSIVE.",
    "Phân trang bằng OFFSET / LIMIT nhưng sắp xếp trên cột không duy nhất (ví dụ chỉ ORDER BY NgayDat DESC mà không kèm MaDH DESC): Khi có nhiều dòng trùng ngày, thứ tự giữa các lần gọi trang không cố định, làm bản ghi vừa xuất hiện ở trang 1 lại lặp lại ở trang 2!",
    "Dùng LAST_VALUE(col) OVER (ORDER BY ...) với khung mặc định: Trả về giá trị của dòng hiện tại thay vì dòng cuối cùng của phân vùng.",
    "Tạo vòng lặp vô tận trong Recursive CTE khi dữ liệu cây bị lỗi tham chiếu vòng (A quản lý B, B lại quản lý A), dẫn tới lỗi Maximum recursion 100 has been exhausted."
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "Phân biệt ba hàm ROW_NUMBER(), RANK() và DENSE_RANK(). Để lấy danh sách các nhân viên có mức lương cao thứ nhì của mỗi phòng ban (kể cả khi có nhiều người đồng mức lương), bạn chọn hàm nào?",
      "a_short": "ROW_NUMBER đánh số duy nhất không trùng; RANK đồng hạng nhưng nhảy cóc thứ hạng sau; DENSE_RANK đồng hạng và tăng liên tục không nhảy cóc. Bài toán tìm mức lương cao thứ nhì phải dùng DENSE_RANK().",
      "a_long": "Giả sử phòng IT có 2 người cùng đạt mức lương cao nhất là 90.000$, và người tiếp theo đạt 85.000$ (đây chính là mức lương cao thứ nhì của phòng). Nếu dùng ROW_NUMBER(), một người 90.000$ bị gán số 2, lấy nhầm mức lương cao nhất! Nếu dùng RANK(), hai người 90.000$ cùng hạng 1, còn người 85.000$ bị nhảy sang hạng 3, khiến điều kiện WHERE rnk = 2 trả về rỗng! Chỉ có DENSE_RANK() mới gán hạng 1 cho hai người 90.000$ và gán đúng hạng 2 cho tất cả những người đạt 85.000$."
    },
    {
      "level": "Junior",
      "q": "Tại sao phân trang bằng OFFSET / LIMIT (hoặc Skip / Take) lại bị chậm đi rõ rệt khi người dùng bấm tới trang thứ 10.000, và giải pháp thay thế là gì?",
      "a_short": "Vì OFFSET buộc CSDL phải đọc và đếm qua toàn bộ các dòng của 9.999 trang trước đó rồi mới bỏ đi. Giải pháp là dùng Keyset Pagination (Seek Method) dựa trên giá trị cuối cùng của trang trước.",
      "a_long": "Với OFFSET M LIMIT N, máy chủ phải quét đủ M + N bản ghi theo thứ tự sắp xếp rồi loại bỏ M bản ghi đầu tiên, làm thời gian phản hồi tỉ lệ thuận với độ sâu của trang. Giải pháp thay thế là Keyset Pagination (còn gọi là Cursor-based Pagination): ứng dụng gửi kèm cặp giá trị (NgayTaoCuoi, IdCuoi) của dòng cuối cùng ở trang hiện tại; câu SQL trang sau sẽ lọc WHERE (NgayTao < @NgayTaoCuoi) OR (NgayTao = @NgayTaoCuoi AND Id < @IdCuoi) ORDER BY NgayTao DESC, Id DESC LIMIT N. Nhờ có Index trên (NgayTao, Id), máy chủ nhảy thẳng tới đúng vị trí bằng Index Seek trong thời gian không đổi O(log N)."
    },
    {
      "level": "Mid",
      "q": "Sự khác biệt giữa RANGE và ROWS trong mệnh đề khung cửa sổ (Window Frame: ROWS/RANGE BETWEEN ...) là gì?",
      "a_short": "ROWS giới hạn khung theo đúng số dòng vật lý trước/sau dòng hiện tại; còn RANGE gộp tất cả các dòng có cùng giá trị trên cột ORDER BY (peers) vào chung một bước tính.",
      "a_long": "Khi tính tổng lũy kế SUM(Salary) OVER (ORDER BY Salary), nếu không ghi rõ ROWS hay RANGE, chuẩn SQL áp dụng mặc định là RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. Nếu có 2 dòng liên tiếp cùng có Salary = 800, RANGE sẽ cộng gộp cả hai dòng 800 ngay tại dòng đầu tiên (ra cùng một con số tổng lũy kế cho cả hai dòng), đồng thời phải dùng bộ đệm trên đĩa/RAM để gom nhóm đồng hạng. Ngược lại, ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW tính cộng dồn từng dòng vật lý riêng biệt và chạy nhanh hơn đáng kể."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 5.1: Xếp hạng điểm cuối kỳ của sinh viên trong từng môn học",
      "problem": "Trên CSDL TruongHoc, với các bản ghi trong bảng DangKy đã có điểm cuối kỳ (DiemCK IS NOT NULL), hãy lấy MaMH, MaSV, HocKy, DiemCK và xếp hạng DiemCK giảm dần trong phạm vi từng môn học bằng hàm DENSE_RANK() đặt tên cột là HangMon. Sắp xếp kết quả theo MaMH tăng dần, HangMon tăng dần, MaSV tăng dần.",
      "intuition": "Dùng DENSE_RANK() OVER (PARTITION BY MaMH ORDER BY DiemCK DESC) sau khi đã lọc WHERE DiemCK IS NOT NULL.",
      "trace": "Môn CS101 có 4 lượt đã thi: SV 202 (9.5 -> hạng 1), SV 201 (9.0 -> hạng 2), SV 204 (8.0 -> hạng 3), SV 203 (4.0 -> hạng 4).",
      "sql": "SELECT MaMH, MaSV, HocKy, DiemCK,\n       DENSE_RANK() OVER (PARTITION BY MaMH ORDER BY DiemCK DESC) AS HangMon\nFROM DangKy\nWHERE DiemCK IS NOT NULL\nORDER BY MaMH ASC, HangMon ASC, MaSV ASC;",
      "db": "truonghoc",
      "expected": {
        "cols": [
          "MaMH",
          "MaSV",
          "HocKy",
          "DiemCK",
          "HangMon"
        ],
        "rows": [
          [
            "CS101",
            202,
            "2024A",
            9.5,
            1
          ],
          [
            "CS101",
            201,
            "2024A",
            9.0,
            2
          ],
          [
            "CS101",
            204,
            "2024B",
            8.0,
            3
          ],
          [
            "CS101",
            203,
            "2024A",
            4.0,
            4
          ],
          [
            "CS102",
            202,
            "2024A",
            9.0,
            1
          ],
          [
            "CS102",
            201,
            "2024A",
            8.0,
            2
          ],
          [
            "EC101",
            204,
            "2024A",
            7.5,
            1
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Chia khung cửa sổ theo từng môn bằng PARTITION BY MaMH và sắp xếp điểm giảm dần bằng ORDER BY DiemCK DESC.",
        "SELECT MaMH, MaSV, HocKy, DiemCK, DENSE_RANK() OVER (PARTITION BY MaMH ORDER BY DiemCK DESC) AS HangMon FROM DangKy WHERE DiemCK IS NOT NULL ...;",
        "SELECT MaMH, MaSV, HocKy, DiemCK, DENSE_RANK() OVER (PARTITION BY MaMH ORDER BY DiemCK DESC) AS HangMon FROM DangKy WHERE DiemCK IS NOT NULL ORDER BY MaMH ASC, HangMon ASC, MaSV ASC;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 5.2: Lấy đơn hàng gần nhất của từng khách hàng bằng CTE và ROW_NUMBER()",
      "problem": "Trên CSDL ShopOnline, hãy tìm đơn hàng mới nhất (theo NgayDat giảm dần, nếu cùng ngày thì MaDH giảm dần) của mỗi khách hàng đã từng đặt hàng. Trả về MaKH, MaDH, NgayDat, TrangThai theo thứ tự MaKH tăng dần.",
      "intuition": "Đánh số ROW_NUMBER() OVER (PARTITION BY MaKH ORDER BY NgayDat DESC, MaDH DESC) AS rn bên trong CTE, sau đó ở ngoài lọc WHERE rn = 1.",
      "trace": "Khách 1 có 3 đơn (1001, 1003, 1007) -> mới nhất là 1007. Khách 2 có 2 đơn (1002, 1006) -> mới nhất là 1006. Khách 3 -> 1004. Khách 4 -> 1005.",
      "sql": "WITH DonMoiNhat AS (\n    SELECT MaKH, MaDH, NgayDat, TrangThai,\n           ROW_NUMBER() OVER (\n               PARTITION BY MaKH\n               ORDER BY NgayDat DESC, MaDH DESC\n           ) AS rn\n    FROM DonHang\n)\nSELECT MaKH, MaDH, NgayDat, TrangThai\nFROM DonMoiNhat\nWHERE rn = 1\nORDER BY MaKH ASC;",
      "db": "shoponline",
      "expected": {
        "cols": [
          "MaKH",
          "MaDH",
          "NgayDat",
          "TrangThai"
        ],
        "rows": [
          [
            1,
            1007,
            "2024-03-25",
            "HOAN_THANH"
          ],
          [
            2,
            1006,
            "2024-03-10",
            "DANG_GIAO"
          ],
          [
            3,
            1004,
            "2024-02-15",
            "DA_HUY"
          ],
          [
            4,
            1005,
            "2024-03-02",
            "HOAN_THANH"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Dùng CTE (WITH DonMoiNhat AS (...)) để tính cột rn = ROW_NUMBER() OVER (PARTITION BY MaKH ORDER BY NgayDat DESC, MaDH DESC).",
        "Ở câu SELECT bên ngoài CTE, lọc WHERE rn = 1.",
        "WITH DonMoiNhat AS (SELECT MaKH, MaDH, NgayDat, TrangThai, ROW_NUMBER() OVER (PARTITION BY MaKH ORDER BY NgayDat DESC, MaDH DESC) AS rn FROM DonHang) SELECT MaKH, MaDH, NgayDat, TrangThai FROM DonMoiNhat WHERE rn = 1 ORDER BY MaKH ASC;"
      ]
    },
    {
      "num": 3,
      "title": "Bài 5.3: Tìm các bản ghi bị trùng số điện thoại nhưng giữ lại người đăng ký sớm nhất",
      "problem": "Trên bảng KhachHang của CSDL ShopOnline, có những khách hàng dùng chung số điện thoại (SoDT khác NULL). Hãy dùng ROW_NUMBER() để tìm ra các bản ghi bị trùng lặp đứng từ vị trí thứ 2 trở đi (rn > 1 khi nhóm theo SoDT và sắp xếp theo NgayDangKy ASC, MaKH ASC). Trả về MaKH, HoTen, SoDT, NgayDangKy.",
      "intuition": "Lọc WHERE SoDT IS NOT NULL trước, đánh số ROW_NUMBER() OVER (PARTITION BY SoDT ORDER BY NgayDangKy ASC, MaKH ASC) AS rn, rồi lấy các dòng có rn > 1.",
      "trace": "Số '0901112222' được dùng bởi MaKH 1 (2023-01-10, rn=1) và MaKH 4 (2023-04-20, rn=2). Kết quả trả về dòng của MaKH 4 (Pham Minh Dung).",
      "sql": "WITH KiemTraTrung AS (\n    SELECT MaKH, HoTen, SoDT, NgayDangKy,\n           ROW_NUMBER() OVER (\n               PARTITION BY SoDT\n               ORDER BY NgayDangKy ASC, MaKH ASC\n           ) AS rn\n    FROM KhachHang\n    WHERE SoDT IS NOT NULL\n)\nSELECT MaKH, HoTen, SoDT, NgayDangKy\nFROM KiemTraTrung\nWHERE rn > 1;",
      "db": "shoponline",
      "expected": {
        "cols": [
          "MaKH",
          "HoTen",
          "SoDT",
          "NgayDangKy"
        ],
        "rows": [
          [
            4,
            "Pham Minh Dung",
            "0901112222",
            "2023-04-20"
          ]
        ]
      },
      "order_matters": false,
      "hints": [
        "Nhóm theo SoDT bằng PARTITION BY SoDT và sắp xếp theo NgayDangKy ASC, MaKH ASC.",
        "Lọc bỏ các dòng SoDT IS NULL trong CTE, rồi ở ngoài chọn WHERE rn > 1.",
        "WITH KiemTraTrung AS (SELECT MaKH, HoTen, SoDT, NgayDangKy, ROW_NUMBER() OVER (PARTITION BY SoDT ORDER BY NgayDangKy ASC, MaKH ASC) AS rn FROM KhachHang WHERE SoDT IS NOT NULL) SELECT MaKH, HoTen, SoDT, NgayDangKy FROM KiemTraTrung WHERE rn > 1;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch05_p1",
      "title": "Tính tỷ trọng lương của từng nhân viên so với tổng quỹ lương phòng ban (Window Aggregate)",
      "difficulty": "Khá",
      "db": "autoshop",
      "summary": "Trên CSDL Auto Shop, hãy liệt kê Id, FName, DepartmentId, Salary, kèm theo cột QuyLuongPhong (tổng lương của phòng ban mà nhân viên đó thuộc về) và cột PhanTramTrongPhong = ROUND(Salary * 100.0 / SUM(Salary) OVER (PARTITION BY DepartmentId), 2). Sắp xếp theo DepartmentId tăng dần, Salary giảm dần.",
      "understand": "Nếu dùng GROUP BY DepartmentId truyền thống, các dòng chi tiết nhân viên sẽ bị gộp mất. Nhờ hàm cửa sổ SUM(Salary) OVER (PARTITION BY DepartmentId), ta giữ nguyên từng dòng nhân viên mà vẫn có ngay tổng lương phòng ban bên cạnh để chia tỷ lệ!",
      "brute": "Viết một subquery tính SUM(Salary) GROUP BY DepartmentId rồi JOIN ngược lại với bảng Employees.",
      "optimal": "Dùng trực tiếp SUM(Salary) OVER (PARTITION BY DepartmentId) ngay trong mệnh đề SELECT, chỉ quét bảng đúng 1 lần.",
      "trace": "Phòng 1 có tổng lương 1900: James (1000 -> 52.63%), Johnathon (500 -> 26.32%), John (400 -> 21.05%). Phòng 2 có 1 người (600 -> 100%). Phòng 3 có tổng 1550: William (800 -> 51.61%), Sarah (750 -> 48.39%).",
      "sql": "SELECT Id, FName, DepartmentId, Salary,\n       SUM(Salary) OVER (PARTITION BY DepartmentId) AS QuyLuongPhong,\n       ROUND(Salary * 100.0 / SUM(Salary) OVER (PARTITION BY DepartmentId), 2) AS PhanTramTrongPhong\nFROM Employees\nORDER BY DepartmentId ASC, Salary DESC;",
      "expected": {
        "cols": [
          "Id",
          "FName",
          "DepartmentId",
          "Salary",
          "QuyLuongPhong",
          "PhanTramTrongPhong"
        ],
        "rows": [
          [
            1,
            "James",
            1,
            1000,
            1900,
            52.63
          ],
          [
            4,
            "Johnathon",
            1,
            500,
            1900,
            26.32
          ],
          [
            2,
            "John",
            1,
            400,
            1900,
            21.05
          ],
          [
            3,
            "Michael",
            2,
            600,
            600,
            100.0
          ],
          [
            5,
            "William",
            3,
            800,
            1550,
            51.61
          ],
          [
            6,
            "Sarah",
            3,
            750,
            1550,
            48.39
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Viết ORDER BY bên trong OVER (PARTITION BY DepartmentId ORDER BY Salary) khi tính tổng phòng ban: nếu thêm ORDER BY vào trong OVER của hàm SUM, nó sẽ biến thành tổng lũy kế (Running Total) thay vì tổng toàn phòng!",
      "note3": {
        "idea": "SUM(col) OVER (PARTITION BY group_col) giúp lấy tổng của nhóm đặt cạnh từng dòng chi tiết mà không làm gộp dòng.",
        "syntax": "SUM(Salary) OVER (PARTITION BY DepartmentId) -- KHÔNG có ORDER BY bên trong OVER nếu muốn lấy tổng cả nhóm!",
        "trap": "Vô tình thêm ORDER BY vào bên trong OVER() của hàm SUM/AVG làm khung cửa sổ mặc định thu hẹp thành RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW (tổng lũy kế)."
      }
    },
    {
      "id": "ch05_p2",
      "title": "Keyset Pagination (Seek Pagination): Lấy trang tiếp theo dựa trên con trỏ cuối trang trước",
      "difficulty": "Khá",
      "db": "shoponline",
      "summary": "Giả sử giao diện danh sách Sản phẩm sắp xếp theo DonGia giảm dần, nếu cùng DonGia thì MaSP tăng dần (ORDER BY DonGia DESC, MaSP ASC). Trang 1 (gồm 2 sản phẩm đầu là MaSP=105 giá 32000 và MaSP=103 giá 8500) đã hiển thị xong. Hãy viết câu truy vấn Keyset Pagination (không dùng OFFSET) để lấy 3 sản phẩm kế tiếp đứng sau dòng neo (DonGia = 8500, MaSP = 103). Trả về MaSP, TenSP, DonGia.",
      "understand": "Khi sắp xếp theo (DonGia DESC, MaSP ASC), một dòng nằm sau dòng neo (8500, 103) khi: hoặc có DonGia < 8500, hoặc có (DonGia = 8500 AND MaSP > 103).",
      "brute": "Dùng LIMIT 3 OFFSET 2. Cách này dễ viết nhưng khi người dùng lướt tới trang 5000 (OFFSET 10000), DB phải quét từ đầu.",
      "optimal": "Dùng điều kiện con trỏ WHERE DonGia < 8500 OR (DonGia = 8500 AND MaSP > 103) ORDER BY DonGia DESC, MaSP ASC LIMIT 3.",
      "trace": "Các sản phẩm có giá < 8500 theo thứ tự giảm dần là: 104 (6900), 107 (4200), 102 (2200), 101 (1800), 106 (350). Lấy LIMIT 3 ra được 104, 107, 102.",
      "sql": "SELECT MaSP, TenSP, DonGia\nFROM SanPham\nWHERE DonGia < 8500\n   OR (DonGia = 8500 AND MaSP > 103)\nORDER BY DonGia DESC, MaSP ASC\nLIMIT 3;",
      "expected": {
        "cols": [
          "MaSP",
          "TenSP",
          "DonGia"
        ],
        "rows": [
          [
            104,
            "Tai Nghe Sony WH-1000XM5",
            6900
          ],
          [
            107,
            "Webcam Elgato Facecam",
            4200
          ],
          [
            102,
            "Chuot Logitech MX Master 3S",
            2200
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Chỉ viết WHERE DonGia < 8500 mà quên nhánh OR (DonGia = 8500 AND MaSP > 103): nếu có nhiều sản phẩm đồng giá 8500 nằm ở ranh giới giữa 2 trang, chúng sẽ bị bỏ sót hoàn toàn!",
      "note3": {
        "idea": "Keyset Pagination (Cursor-based Pagination) dùng điều kiện WHERE trên cặp (Cột_Sắp_Xếp, Khóa_Chinh_Tie_Breaker) để nhảy thẳng vào vị trí Index Seek với độ phức tạp O(log N).",
        "syntax": "WHERE SortCol < @LastVal OR (SortCol = @LastVal AND Id > @LastId) ORDER BY SortCol DESC, Id ASC LIMIT @PageSize",
        "trap": "Không có cột Tie-breaker duy nhất (như khóa chính MaSP) trong ORDER BY và WHERE sẽ làm rơi dữ liệu khi có nhiều bản ghi trùng giá trị cột sắp xếp."
      }
    }
  ],
  "summary_table": [
    [
      "ROW_NUMBER / RANK / DENSE_RANK",
      "Bộ 3 hàm xếp hạng trong cửa sổ OVER()",
      "DENSE_RANK không làm khuyết thứ hạng khi đồng điểm"
    ],
    [
      "LAG(col, k, def) / LEAD(col, k, def)",
      "Đọc giá trị của dòng đứng trước hoặc đứng sau k bước",
      "Thay thế hoàn hảo cho SELF JOIN tốn kém"
    ],
    [
      "WITH TenCTE AS (...)",
      "Bảng biểu thức chung tạm thời trong 1 câu lệnh",
      "Dùng để lọc kết quả Window Function hoặc đệ quy"
    ],
    [
      "OFFSET m FETCH NEXT n",
      "Phân trang truyền thống bằng cách bỏ qua m dòng đầu",
      "Luôn kèm ORDER BY có cột duy nhất (Tie-breaker)"
    ],
    [
      "Keyset Pagination",
      "Phân trang bằng điều kiện WHERE trên dòng neo cuối",
      "Tốc độ O(log N) ổn định ở trang thứ hàng triệu"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Với dãy điểm thi gồm 4 sinh viên là (9.0, 9.0, 8.5, 8.0), giá trị của RANK() và DENSE_RANK() tại sinh viên có điểm 8.5 lần lượt là bao nhiêu?",
      "a": "RANK() trả về 3 (vì hai người 9.0 chiếm vị trí 1 và 2), còn DENSE_RANK() trả về 2."
    },
    {
      "q": "Câu 2: Nếu bạn tham chiếu một CTE có tên BaoCaoDoanhThu 2 lần trong cùng một câu SELECT lớn trên SQL Server, câu truy vấn bên trong CTE đó sẽ được thực thi mấy lần?",
      "a": "Được thực thi 2 lần, vì trong SQL Server CTE không tự động lưu cứng kết quả ra bộ nhớ tạm (không materialize) mà được bung ra giống như một View."
    },
    {
      "q": "Câu 3: Khi phân trang danh sách đơn hàng bằng ORDER BY NgayDat DESC LIMIT 10 OFFSET 10, tại sao bắt buộc phải thêm cột khóa chính thành ORDER BY NgayDat DESC, MaDH DESC?",
      "a": "Vì cột NgayDat có thể trùng nhau giữa nhiều đơn hàng. Nếu không có cột khóa chính MaDH làm tiêu chí phân xử phụ (Tie-breaker), thứ tự các dòng đồng ngày là bất định, làm đơn hàng có thể bị lặp lại hoặc bị sót khi chuyển trang."
    }
  ]
});
