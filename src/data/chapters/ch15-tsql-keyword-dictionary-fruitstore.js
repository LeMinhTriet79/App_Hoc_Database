/**
 * FILE: src/data/chapters/ch15-tsql-keyword-dictionary-fruitstore.js
 * MÔ TẢ: Chương 15 - Từ Điển Từ Khóa T-SQL Tổng Hợp (Từ Cốt Lõi Đến Nâng Cao)
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch15",
  "num": 15,
  "title": "Từ Điển Từ Khóa T-SQL Tổng Hợp (Từ Cốt Lõi Đến Nâng Cao)",
  "short_title": "15. Từ Điển Từ Khóa T-SQL (FruitStore)",
  "sources": [
    "S ch.1 - ch.62, M ch.1 - ch.111",
    "CSDL mẫu: FruitStore_Ultimate (Chuẩn Enterprise - 9 bảng)"
  ],
  "goals": [
    "Tra cứu nhanh hơn 60 từ khóa và hàm T-SQL thông dụng thông qua cấu trúc Thẻ 4 Phần (4-Part Card) chuẩn hóa trên cùng một CSDL thực chiến FruitStore_Ultimate.",
    "Nắm vững Phần A (Từ khóa & Hàm Cốt Lõi - Ưu tiên số 1 bắt buộc phải thuộc lòng cho lập trình viên Backend Java / .NET khi đi làm và phỏng vấn Fresher/Junior).",
    "Hiểu và vận dụng linh hoạt Phần B (Từ khóa & Kỹ thuật Nâng Cao - Mở rộng cho báo cáo OLAP, tối ưu hiệu năng, bảo mật và quản trị CSDL ở cấp độ Junior+/Mid).",
    "Chạy thử trực tiếp câu lệnh tương đương của từng thẻ từ khóa ngay trong Phòng Thực Hành SQL với CSDL FruitStore_Ultimate (9 bảng: Employees, Categories, Fruits, Customers, Vouchers, Orders, OrderDetails, Reviews, PaymentTransactions)."
  ],
  "signals": [
    "Trước buổi phỏng vấn Technical (Java Spring Boot / .NET Core): cần ôn cấp tốc toàn bộ cú pháp SQL từ cơ bản đến nâng cao trong 30 phút.",
    "Khi đang code tính năng thực tế (lọc sản phẩm, phân trang đơn hàng, tính doanh thu, bóc tách JSON, khóa dòng chống race condition) và cần mẫu T-SQL chuẩn chỉnh để áp dụng ngay.",
    "Khi muốn phân biệt rõ những từ khóa nào bắt buộc phải nhớ kỹ từng chi tiết (Phần A) và những từ khóa nào chỉ cần nắm ý tưởng để tra cứu khi gặp bài toán đặc thù (Phần B)."
  ],
  "theory": "<h4>1. Triết lý \"80/20\" trong SQL cho Lập Trình Viên Backend</h4>\n<p>Ngôn ngữ T-SQL có hàng trăm từ khóa, nhưng trong 90% công việc hằng ngày của lập trình viên Backend Java và .NET cũng như trong các buổi phỏng vấn vị trí Fresher/Junior/Mid, bạn sẽ xoay quanh một nhóm từ khóa cốt lõi. Vì vậy, Chương 15 được thiết kế như một <strong>\"Bách khoa toàn thư bỏ túi\" (Pocket Encyclopedia)</strong> chia làm 2 phần rõ rệt:</p>\n<ul>\n  <li><strong>PHẦN A - CỐT LÕI (ƯU TIÊN SỐ 1 - BẮT BUỘC NẮM VỮNG):</strong> Gồm 40 thẻ từ khóa và cụm hàm nền tảng sống còn: truy vấn và lọc dữ liệu (<code>SELECT</code>, <code>WHERE</code>, <code>ORDER BY</code>, <code>OFFSET FETCH</code>), kết nối bảng (<code>JOIN</code>, <code>APPLY</code>), gom nhóm (<code>GROUP BY</code>, <code>HAVING</code>, <code>STRING_AGG</code>), hàm cửa sổ (<code>ROW_NUMBER</code>, <code>DENSE_RANK</code>, <code>LAG/LEAD</code>), biểu thức bảng chung (<code>WITH CTE</code> &amp; Đệ quy), thao tác dữ liệu (<code>INSERT OUTPUT</code>, <code>UPDATE FROM</code>, <code>DELETE</code>, <code>MERGE</code>), ràng buộc &amp; chỉ mục (<code>CONSTRAINT</code>, <code>INDEX INCLUDE/WHERE</code>), giao dịch &amp; khóa (<code>TRANSACTION</code>, <code>XACT_ABORT</code>, <code>UPDLOCK</code>), cùng xử lý JSON/Chuỗi/Ngày tháng.</li>\n  <li><strong>PHẦN B - NÂNG CAO &amp; MỞ RỘNG (BIẾT THÊM CÀNG TỐT):</strong> Gồm 20 thẻ từ khóa chuyên sâu phục vụ báo cáo đa chiều (<code>PIVOT</code>, <code>UNPIVOT</code>, <code>ROLLUP</code>, <code>CUBE</code>, <code>GROUPING SETS</code>), phân tích chuỗi thời gian &amp; phân vị (<code>FIRST_VALUE</code>, <code>PERCENT_RANK</code>), bảng lịch sử (<code>FOR SYSTEM_TIME</code>), cột tính toán (<code>PERSISTED</code>), chỉ mục cột (<code>COLUMNSTORE</code>), phân vùng bảng (<code>PARTITION</code>), bảo mật dữ liệu (<code>DYNAMIC DATA MASKING</code>, <code>ROW LEVEL SECURITY</code>) và chẩn đoán hiệu năng (<code>STATISTICS IO</code>, <code>QUERY HINTS</code>, <code>DBCC</code>).</li>\n</ul>\n\n<h4>2. Lược đồ CSDL <code>FruitStore_Ultimate</code> (Chuẩn Enterprise)</h4>\n<p>Toàn bộ 60 thẻ từ khóa trong chương này đều áp dụng thống nhất trên CSDL <strong>FruitStore_Ultimate</strong> (đã được nạp sẵn vào Phòng Thực Hành SQL để bạn bấm nút chạy thử ngay lập tức):</p>\n<pre class=\"ascii-diagram\">\n+-------------------+       +-------------------+       +-------------------+\n|    Categories     |1     *|      Fruits       |*     *|      Reviews      |\n|-------------------|-------|-------------------|-------|-------------------|\n| PK CategoryID     |       | PK FruitID        |       | PK ReviewID       |\n|    CategoryName   |       | FK CategoryID     |       | FK CustomerID     |\n|    Description    |       |    FruitName      |       | FK FruitID        |\n+-------------------+       |    Price          |       |    Rating (1..5)  |\n                            |    StockQuantity  |       |    Comment        |\n+-------------------+       |    Unit, Origin   |       +-------------------+\n|     Employees     |       |    AttributesJSON |                 | *\n|-------------------|       +-------------------+                 |\n| PK EmployeeID     |--+              | 1                         | 1\n|    FullName, Role |  | Tự           | *               +-------------------+\n| FK ManagerID      |&lt;-+ tham   +-------------------+   |     Customers     |\n|    HireDate       |    chiếu  |   OrderDetails    |   |-------------------|\n+-------------------+           |-------------------|   | PK CustomerID     |\n          | 1                   | PK OrderDetailID  |   |    FullName       |\n          | *                   | FK OrderID        |   | UQ PhoneNumber    |\n+-------------------+           | FK FruitID        |   |    CustomerType   |\n|      Orders       |1         *|    Quantity       |   +-------------------+\n|-------------------|-----------|    UnitPrice      |             | 1\n| PK OrderID        |           |    SubTotal (Calc)|             |\n| FK CustomerID     |-----------+-------------------+             |\n| FK EmployeeID     |                                             |\n| FK VoucherID      |-------&gt; +-------------------+               |\n|    OrderDate      |         |     Vouchers      |               |\n|    TotalAmount    |         |-------------------|               |\n|    Status         |         | PK VoucherID      |               |\n+-------------------+         | UQ VoucherCode    |               |\n          | 1                 |    DiscountAmount |               |\n          | *                 |    UsageLimit...  |               |\n+-------------------+         +-------------------+               |\n|PaymentTransactions|                                             |\n|-------------------|   (Mối quan hệ Khách hàng - Đơn hàng: 1 - *)&lt;+\n| PK TransactionID  |\n| FK OrderID        |\n|    PaymentMethod  |\n|    Amount         |\n+-------------------+\n</pre>\n<p>Cấu trúc mỗi Thẻ Từ Khóa (Keyword Card) bên dưới tuân thủ nghiêm ngặt <strong>4 phần chuẩn hóa</strong>: <strong>(1) Giải thích ngắn gọn nó làm gì</strong>, <strong>(2) Tình huống thực tế lập trình viên Backend cần dùng</strong>, <strong>(3) Code mẫu T-SQL áp dụng trên DB FruitStore</strong> (kèm nút chạy thử trực tiếp trong Phòng Lab), và <strong>(4) Output minh họa dạng bảng</strong>.</p>",
  "mechanism": "<h4>1. Cách học và tra cứu hiệu quả với Từ Điển Thẻ 4 Phần</h4>\n<ol>\n  <li><strong>Bước 1 - Lọc theo cấp độ ưu tiên:</strong> Nếu bạn là sinh viên sắp ra trường hoặc Fresher/Junior chuẩn bị phỏng vấn, hãy chọn bộ lọc <strong>\"Phần A: Cốt Lõi (Ưu tiên #1)\"</strong> và đọc kỹ từng thẻ từ đầu đến cuối.</li>\n  <li><strong>Bước 2 - Gắn từ khóa với bài toán Backend:</strong> Đừng học vẹt cú pháp! Hãy đọc kỹ mục <strong>(2) Tình huống thực tế Backend</strong> của mỗi thẻ để hiểu khi nào dùng từ khóa đó trong API thương mại điện tử (như kiểm tra tồn kho, áp voucher, thống kê doanh thu, phân trang danh sách sản phẩm).</li>\n  <li><strong>Bước 3 - Chạy thử ngay trên Phòng Lab FruitStore:</strong> Mỗi thẻ đều có nút <strong>\"▶ Chạy thử trên DB FruitStore (Lab)\"</strong>. Khi bấm vào, ứng dụng sẽ tự động chuyển sang Phòng Thực Hành SQL, chọn đúng CSDL <code>FruitStore_Ultimate</code> và nạp sẵn câu lệnh để bạn thực thi và biến đổi tùy ý.</li>\n</ol>",
  "keyword_cards": [
    {
      "id": "kw_a01",
      "part": "A",
      "category": "1. Truy vấn & Lọc (DQL)",
      "keyword": "SELECT & AS (Column / Table Alias)",
      "what_it_does": "Trích xuất đúng các cột cần thiết từ bảng và đặt tên bí danh (Alias) rõ nghĩa cho cột hoặc bảng để trả dữ liệu về tầng ứng dụng.",
      "backend_scenario": "Khi viết API danh sách trái cây (GET /api/fruits), bạn chỉ lấy các cột cần hiển thị lên giao diện (FruitID, FruitName, Price, Unit) thay vì SELECT * để tránh kéo cột nặng AttributesJSON qua mạng làm chậm DTO mapping trong Spring Data JPA hoặc Dapper.",
      "tsql_code": "SELECT \n    f.FruitID AS MaTraiCay,\n    f.FruitName AS TenSanPham,\n    f.Price AS DonGia,\n    f.Unit AS DonViTinh\nFROM Fruits AS f\nWHERE f.CategoryID = 2;",
      "lab_sql": "SELECT f.FruitID AS MaTraiCay, f.FruitName AS TenSanPham, f.Price AS DonGia, f.Unit AS DonViTinh FROM Fruits AS f WHERE f.CategoryID = 2;",
      "output": {
        "cols": [
          "MaTraiCay",
          "TenSanPham",
          "DonGia",
          "DonViTinh"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            "Chùm"
          ],
          [
            6,
            "Táo Envy",
            250000,
            "Kg"
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            450000,
            "Kg"
          ],
          [
            8,
            "Kiwi Vàng",
            180000,
            "Hộp"
          ]
        ]
      },
      "part1_what": "Trích xuất đúng các cột cần thiết từ bảng và đặt tên bí danh (Alias) rõ nghĩa cho cột hoặc bảng để trả dữ liệu về tầng ứng dụng.",
      "part2_backend": "Khi viết API danh sách trái cây (GET /api/fruits), bạn chỉ lấy các cột cần hiển thị lên giao diện (FruitID, FruitName, Price, Unit) thay vì SELECT * để tránh kéo cột nặng AttributesJSON qua mạng làm chậm DTO mapping trong Spring Data JPA hoặc Dapper.",
      "part3_tsql": "SELECT \n    f.FruitID AS MaTraiCay,\n    f.FruitName AS TenSanPham,\n    f.Price AS DonGia,\n    f.Unit AS DonViTinh\nFROM Fruits AS f\nWHERE f.CategoryID = 2;",
      "part4_output": {
        "cols": [
          "MaTraiCay",
          "TenSanPham",
          "DonGia",
          "DonViTinh"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            "Chùm"
          ],
          [
            6,
            "Táo Envy",
            250000,
            "Kg"
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            450000,
            "Kg"
          ],
          [
            8,
            "Kiwi Vàng",
            180000,
            "Hộp"
          ]
        ]
      }
    },
    {
      "id": "kw_a02",
      "part": "A",
      "category": "1. Truy vấn & Lọc (DQL)",
      "keyword": "DISTINCT",
      "what_it_does": "Loại bỏ các dòng trùng lặp hoàn toàn trên tập cột được chọn, chỉ giữ lại các giá trị duy nhất.",
      "backend_scenario": "Khi làm bộ lọc xuất xứ (Origin Dropdown Filter) trên trang chủ cửa hàng trái cây, Backend cần lấy danh sách các vùng/quốc gia xuất xứ duy nhất đang có sản phẩm trong kho.",
      "tsql_code": "SELECT DISTINCT \n    f.Origin\nFROM Fruits AS f\nWHERE f.Origin IS NOT NULL\nORDER BY f.Origin ASC;",
      "lab_sql": "SELECT DISTINCT f.Origin FROM Fruits AS f WHERE f.Origin IS NOT NULL ORDER BY f.Origin ASC;",
      "output": {
        "cols": [
          "Origin"
        ],
        "rows": [
          [
            "Bình Dương"
          ],
          [
            "Bến Tre"
          ],
          [
            "Hàn Quốc"
          ],
          [
            "Mỹ"
          ],
          [
            "New Zealand"
          ],
          [
            "Ninh Thuận"
          ],
          [
            "Sơn La"
          ],
          [
            "Tiền Giang"
          ],
          [
            "Úc"
          ],
          [
            "Đà Lạt"
          ],
          [
            "Đồng Nai"
          ],
          [
            "Đắk Lắk"
          ]
        ]
      },
      "part1_what": "Loại bỏ các dòng trùng lặp hoàn toàn trên tập cột được chọn, chỉ giữ lại các giá trị duy nhất.",
      "part2_backend": "Khi làm bộ lọc xuất xứ (Origin Dropdown Filter) trên trang chủ cửa hàng trái cây, Backend cần lấy danh sách các vùng/quốc gia xuất xứ duy nhất đang có sản phẩm trong kho.",
      "part3_tsql": "SELECT DISTINCT \n    f.Origin\nFROM Fruits AS f\nWHERE f.Origin IS NOT NULL\nORDER BY f.Origin ASC;",
      "part4_output": {
        "cols": [
          "Origin"
        ],
        "rows": [
          [
            "Bình Dương"
          ],
          [
            "Bến Tre"
          ],
          [
            "Hàn Quốc"
          ],
          [
            "Mỹ"
          ],
          [
            "New Zealand"
          ],
          [
            "Ninh Thuận"
          ],
          [
            "Sơn La"
          ],
          [
            "Tiền Giang"
          ],
          [
            "Úc"
          ],
          [
            "Đà Lạt"
          ],
          [
            "Đồng Nai"
          ],
          [
            "Đắk Lắk"
          ]
        ]
      }
    },
    {
      "id": "kw_a03",
      "part": "A",
      "category": "1. Truy vấn & Lọc (DQL)",
      "keyword": "TOP (N) & WITH TIES",
      "what_it_does": "Giới hạn số lượng dòng trả về ở đầu tập kết quả sau khi đã sắp xếp; tùy chọn WITH TIES lấy thêm tất cả các dòng đồng hạng với dòng cuối cùng.",
      "backend_scenario": "Hiển thị widget 'Top 3 trái cây đắt giá nhất' trên trang chủ, hoặc trao thưởng cho Top đơn hàng giá trị cao nhất mà không bỏ sót các đơn có cùng tổng tiền.",
      "tsql_code": "SELECT TOP (3) WITH TIES\n    FruitID, FruitName, Price, Origin\nFROM Fruits\nORDER BY Price DESC;",
      "lab_sql": "SELECT FruitID, FruitName, Price, Origin FROM Fruits ORDER BY Price DESC LIMIT 3;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "Origin"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            "Hàn Quốc"
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            450000,
            "Úc"
          ],
          [
            10,
            "Việt Quất (Blueberry)",
            350000,
            "Mỹ"
          ]
        ]
      },
      "part1_what": "Giới hạn số lượng dòng trả về ở đầu tập kết quả sau khi đã sắp xếp; tùy chọn WITH TIES lấy thêm tất cả các dòng đồng hạng với dòng cuối cùng.",
      "part2_backend": "Hiển thị widget 'Top 3 trái cây đắt giá nhất' trên trang chủ, hoặc trao thưởng cho Top đơn hàng giá trị cao nhất mà không bỏ sót các đơn có cùng tổng tiền.",
      "part3_tsql": "SELECT TOP (3) WITH TIES\n    FruitID, FruitName, Price, Origin\nFROM Fruits\nORDER BY Price DESC;",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "Origin"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            "Hàn Quốc"
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            450000,
            "Úc"
          ],
          [
            10,
            "Việt Quất (Blueberry)",
            350000,
            "Mỹ"
          ]
        ]
      }
    },
    {
      "id": "kw_a04",
      "part": "A",
      "category": "1. Truy vấn & Lọc (DQL)",
      "keyword": "WHERE, AND, OR, NOT",
      "what_it_does": "Lọc các dòng dữ liệu thỏa mãn biểu thức logic trước khi gom nhóm hoặc chiếu cột (chỉ giữ lại dòng có kết quả TRUE).",
      "backend_scenario": "Lọc danh sách trái cây thuộc danh mục Đặc sản Miền Tây (CategoryID = 1) hoặc Trái cây Nhập khẩu (CategoryID = 2) nhưng chỉ lấy những mặt hàng có giá từ 150.000đ trở lên và còn hàng.",
      "tsql_code": "SELECT \n    FruitID, CategoryID, FruitName, Price, StockQuantity\nFROM Fruits\nWHERE (CategoryID = 1 OR CategoryID = 2)\n  AND Price >= 150000\n  AND NOT (StockQuantity = 0);",
      "lab_sql": "SELECT FruitID, CategoryID, FruitName, Price, StockQuantity FROM Fruits WHERE (CategoryID = 1 OR CategoryID = 2) AND Price >= 150000 AND NOT (StockQuantity = 0);",
      "output": {
        "cols": [
          "FruitID",
          "CategoryID",
          "FruitName",
          "Price",
          "StockQuantity"
        ],
        "rows": [
          [
            1,
            1,
            "Sầu Riêng Ri6",
            150000,
            50
          ],
          [
            5,
            2,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            15
          ],
          [
            6,
            2,
            "Táo Envy",
            250000,
            100
          ],
          [
            7,
            2,
            "Cherry Đỏ Thẫm",
            450000,
            30
          ],
          [
            8,
            2,
            "Kiwi Vàng",
            180000,
            60
          ]
        ]
      },
      "part1_what": "Lọc các dòng dữ liệu thỏa mãn biểu thức logic trước khi gom nhóm hoặc chiếu cột (chỉ giữ lại dòng có kết quả TRUE).",
      "part2_backend": "Lọc danh sách trái cây thuộc danh mục Đặc sản Miền Tây (CategoryID = 1) hoặc Trái cây Nhập khẩu (CategoryID = 2) nhưng chỉ lấy những mặt hàng có giá từ 150.000đ trở lên và còn hàng.",
      "part3_tsql": "SELECT \n    FruitID, CategoryID, FruitName, Price, StockQuantity\nFROM Fruits\nWHERE (CategoryID = 1 OR CategoryID = 2)\n  AND Price >= 150000\n  AND NOT (StockQuantity = 0);",
      "part4_output": {
        "cols": [
          "FruitID",
          "CategoryID",
          "FruitName",
          "Price",
          "StockQuantity"
        ],
        "rows": [
          [
            1,
            1,
            "Sầu Riêng Ri6",
            150000,
            50
          ],
          [
            5,
            2,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            15
          ],
          [
            6,
            2,
            "Táo Envy",
            250000,
            100
          ],
          [
            7,
            2,
            "Cherry Đỏ Thẫm",
            450000,
            30
          ],
          [
            8,
            2,
            "Kiwi Vàng",
            180000,
            60
          ]
        ]
      }
    },
    {
      "id": "kw_a05",
      "part": "A",
      "category": "1. Truy vấn & Lọc (DQL)",
      "keyword": "IN & NOT IN (Cạm bẫy NULL)",
      "what_it_does": "Kiểm tra một giá trị có nằm trong danh sách tĩnh hoặc tập kết quả con hay không (Lưu ý: NOT IN sẽ trả về rỗng toàn bộ nếu tập con có chứa NULL).",
      "backend_scenario": "Khi người dùng tích chọn nhiều trạng thái đơn hàng trên bộ lọc quản trị (ví dụ: 'Chờ xử lý', 'Đang giao') và truyền mảng trạng thái lên API.",
      "tsql_code": "SELECT \n    OrderID, CustomerID, TotalAmount, Status\nFROM Orders\nWHERE Status IN (N'Chờ xử lý', N'Đang giao')\nORDER BY OrderID ASC;",
      "lab_sql": "SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE Status IN ('Chờ xử lý', 'Đang giao') ORDER BY OrderID ASC;",
      "output": {
        "cols": [
          "OrderID",
          "CustomerID",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            8,
            1,
            200000,
            "Đang giao"
          ],
          [
            9,
            4,
            400000,
            "Chờ xử lý"
          ],
          [
            10,
            7,
            95000,
            "Chờ xử lý"
          ]
        ]
      },
      "part1_what": "Kiểm tra một giá trị có nằm trong danh sách tĩnh hoặc tập kết quả con hay không (Lưu ý: NOT IN sẽ trả về rỗng toàn bộ nếu tập con có chứa NULL).",
      "part2_backend": "Khi người dùng tích chọn nhiều trạng thái đơn hàng trên bộ lọc quản trị (ví dụ: 'Chờ xử lý', 'Đang giao') và truyền mảng trạng thái lên API.",
      "part3_tsql": "SELECT \n    OrderID, CustomerID, TotalAmount, Status\nFROM Orders\nWHERE Status IN (N'Chờ xử lý', N'Đang giao')\nORDER BY OrderID ASC;",
      "part4_output": {
        "cols": [
          "OrderID",
          "CustomerID",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            8,
            1,
            200000,
            "Đang giao"
          ],
          [
            9,
            4,
            400000,
            "Chờ xử lý"
          ],
          [
            10,
            7,
            95000,
            "Chờ xử lý"
          ]
        ]
      }
    },
    {
      "id": "kw_a06",
      "part": "A",
      "category": "1. Truy vấn & Lọc (DQL)",
      "keyword": "BETWEEN ... AND ...",
      "what_it_does": "Kiểm tra giá trị nằm trong đoạn đóng [min, max] (bao gồm cả hai đầu mút min và max).",
      "backend_scenario": "Làm thanh trượt lọc khoảng giá (Price Range Slider) từ 100.000đ đến 250.000đ trên trang tìm kiếm sản phẩm.",
      "tsql_code": "SELECT \n    FruitID, FruitName, Price, Origin\nFROM Fruits\nWHERE Price BETWEEN 100000 AND 250000\nORDER BY Price ASC;",
      "lab_sql": "SELECT FruitID, FruitName, Price, Origin FROM Fruits WHERE Price BETWEEN 100000 AND 250000 ORDER BY Price ASC;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "Origin"
        ],
        "rows": [
          [
            12,
            "Nho khô Ninh Thuận",
            120000,
            "Ninh Thuận"
          ],
          [
            1,
            "Sầu Riêng Ri6",
            150000,
            "Bến Tre"
          ],
          [
            8,
            "Kiwi Vàng",
            180000,
            "New Zealand"
          ],
          [
            9,
            "Dâu Tây Mộc Châu",
            200000,
            "Sơn La"
          ],
          [
            6,
            "Táo Envy",
            250000,
            "Mỹ"
          ]
        ]
      },
      "part1_what": "Kiểm tra giá trị nằm trong đoạn đóng [min, max] (bao gồm cả hai đầu mút min và max).",
      "part2_backend": "Làm thanh trượt lọc khoảng giá (Price Range Slider) từ 100.000đ đến 250.000đ trên trang tìm kiếm sản phẩm.",
      "part3_tsql": "SELECT \n    FruitID, FruitName, Price, Origin\nFROM Fruits\nWHERE Price BETWEEN 100000 AND 250000\nORDER BY Price ASC;",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "Origin"
        ],
        "rows": [
          [
            12,
            "Nho khô Ninh Thuận",
            120000,
            "Ninh Thuận"
          ],
          [
            1,
            "Sầu Riêng Ri6",
            150000,
            "Bến Tre"
          ],
          [
            8,
            "Kiwi Vàng",
            180000,
            "New Zealand"
          ],
          [
            9,
            "Dâu Tây Mộc Châu",
            200000,
            "Sơn La"
          ],
          [
            6,
            "Táo Envy",
            250000,
            "Mỹ"
          ]
        ]
      }
    },
    {
      "id": "kw_a07",
      "part": "A",
      "category": "1. Truy vấn & Lọc (DQL)",
      "keyword": "LIKE & Wildcards (%, _, [])",
      "what_it_does": "So khớp mẫu chuỗi văn bản với ký tự đại diện: % (0 hoặc nhiều ký tự), _ (đúng 1 ký tự), [a-z] (1 ký tự trong tập).",
      "backend_scenario": "Ô tìm kiếm nhanh khách hàng theo tên hoặc tìm các loại trái cây có chữ 'Nho' trong tên sản phẩm (Lưu ý hiệu năng: LIKE 'Nho%' dùng được Index Seek, còn LIKE '%Nho%' sẽ quét bảng).",
      "tsql_code": "SELECT \n    FruitID, FruitName, Price, Unit\nFROM Fruits\nWHERE FruitName LIKE N'Nho%';",
      "lab_sql": "SELECT FruitID, FruitName, Price, Unit FROM Fruits WHERE FruitName LIKE 'Nho%';",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "Unit"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            "Chùm"
          ],
          [
            12,
            "Nho khô Ninh Thuận",
            120000,
            "Hũ"
          ]
        ]
      },
      "part1_what": "So khớp mẫu chuỗi văn bản với ký tự đại diện: % (0 hoặc nhiều ký tự), _ (đúng 1 ký tự), [a-z] (1 ký tự trong tập).",
      "part2_backend": "Ô tìm kiếm nhanh khách hàng theo tên hoặc tìm các loại trái cây có chữ 'Nho' trong tên sản phẩm (Lưu ý hiệu năng: LIKE 'Nho%' dùng được Index Seek, còn LIKE '%Nho%' sẽ quét bảng).",
      "part3_tsql": "SELECT \n    FruitID, FruitName, Price, Unit\nFROM Fruits\nWHERE FruitName LIKE N'Nho%';",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "Unit"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            "Chùm"
          ],
          [
            12,
            "Nho khô Ninh Thuận",
            120000,
            "Hũ"
          ]
        ]
      }
    },
    {
      "id": "kw_a08",
      "part": "A",
      "category": "1. Truy vấn & Lọc (DQL)",
      "keyword": "IS NULL & IS NOT NULL",
      "what_it_does": "Kiểm tra một cột có đang mang trạng thái thiếu dữ liệu (NULL) hay không, vì toán tử = NULL hoặc <> NULL luôn trả về UNKNOWN.",
      "backend_scenario": "Tìm các sản phẩm trái cây sấy/đặc sản chưa được cập nhật thông tin thuộc tính JSON (AttributesJSON IS NULL) để nhân viên kho bổ sung dữ liệu.",
      "tsql_code": "SELECT \n    FruitID, FruitName, Price, Origin, AttributesJSON\nFROM Fruits\nWHERE AttributesJSON IS NULL;",
      "lab_sql": "SELECT FruitID, FruitName, Price, Origin, AttributesJSON FROM Fruits WHERE AttributesJSON IS NULL;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "Origin",
          "AttributesJSON"
        ],
        "rows": [
          [
            12,
            "Nho khô Ninh Thuận",
            120000,
            "Ninh Thuận",
            null
          ],
          [
            13,
            "Mít sấy giòn",
            60000,
            "Đồng Nai",
            null
          ]
        ]
      },
      "part1_what": "Kiểm tra một cột có đang mang trạng thái thiếu dữ liệu (NULL) hay không, vì toán tử = NULL hoặc <> NULL luôn trả về UNKNOWN.",
      "part2_backend": "Tìm các sản phẩm trái cây sấy/đặc sản chưa được cập nhật thông tin thuộc tính JSON (AttributesJSON IS NULL) để nhân viên kho bổ sung dữ liệu.",
      "part3_tsql": "SELECT \n    FruitID, FruitName, Price, Origin, AttributesJSON\nFROM Fruits\nWHERE AttributesJSON IS NULL;",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "Origin",
          "AttributesJSON"
        ],
        "rows": [
          [
            12,
            "Nho khô Ninh Thuận",
            120000,
            "Ninh Thuận",
            null
          ],
          [
            13,
            "Mít sấy giòn",
            60000,
            "Đồng Nai",
            null
          ]
        ]
      }
    },
    {
      "id": "kw_a09",
      "part": "A",
      "category": "1. Truy vấn & Lọc (DQL)",
      "keyword": "ORDER BY (ASC / DESC)",
      "what_it_does": "Sắp xếp tập kết quả trả về theo một hoặc nhiều cột tăng dần (ASC, mặc định) hoặc giảm dần (DESC).",
      "backend_scenario": "Sắp xếp danh sách khách hàng ưu tiên hạng VIP lên đầu, nếu cùng hạng khách hàng thì ai đăng ký sớm hơn (RegisterDate nhỏ hơn) xếp trước.",
      "tsql_code": "SELECT \n    CustomerID, FullName, CustomerType, RegisterDate\nFROM Customers\nORDER BY CustomerType DESC, RegisterDate ASC;",
      "lab_sql": "SELECT CustomerID, FullName, CustomerType, RegisterDate FROM Customers ORDER BY CustomerType DESC, RegisterDate ASC;",
      "output": {
        "cols": [
          "CustomerID",
          "FullName",
          "CustomerType",
          "RegisterDate"
        ],
        "rows": [
          [
            1,
            "Võ Thành Tài",
            "VIP",
            "2023-01-15"
          ],
          [
            4,
            "Triệu Mẫn",
            "VIP",
            "2023-07-22"
          ],
          [
            2,
            "Nguyễn Thị Lệ",
            "Standard",
            "2023-03-20"
          ],
          [
            3,
            "Trương Vô Kỵ",
            "Standard",
            "2023-05-10"
          ],
          [
            5,
            "Chu Chỉ Nhược",
            "Standard",
            "2023-11-11"
          ],
          [
            6,
            "Ân Ly",
            "Standard",
            "2024-01-05"
          ],
          [
            7,
            "Tiểu Chiêu",
            "Standard",
            "2024-02-14"
          ],
          [
            8,
            "Dương Quá",
            "Standard",
            "2024-03-10"
          ]
        ]
      },
      "part1_what": "Sắp xếp tập kết quả trả về theo một hoặc nhiều cột tăng dần (ASC, mặc định) hoặc giảm dần (DESC).",
      "part2_backend": "Sắp xếp danh sách khách hàng ưu tiên hạng VIP lên đầu, nếu cùng hạng khách hàng thì ai đăng ký sớm hơn (RegisterDate nhỏ hơn) xếp trước.",
      "part3_tsql": "SELECT \n    CustomerID, FullName, CustomerType, RegisterDate\nFROM Customers\nORDER BY CustomerType DESC, RegisterDate ASC;",
      "part4_output": {
        "cols": [
          "CustomerID",
          "FullName",
          "CustomerType",
          "RegisterDate"
        ],
        "rows": [
          [
            1,
            "Võ Thành Tài",
            "VIP",
            "2023-01-15"
          ],
          [
            4,
            "Triệu Mẫn",
            "VIP",
            "2023-07-22"
          ],
          [
            2,
            "Nguyễn Thị Lệ",
            "Standard",
            "2023-03-20"
          ],
          [
            3,
            "Trương Vô Kỵ",
            "Standard",
            "2023-05-10"
          ],
          [
            5,
            "Chu Chỉ Nhược",
            "Standard",
            "2023-11-11"
          ],
          [
            6,
            "Ân Ly",
            "Standard",
            "2024-01-05"
          ],
          [
            7,
            "Tiểu Chiêu",
            "Standard",
            "2024-02-14"
          ],
          [
            8,
            "Dương Quá",
            "Standard",
            "2024-03-10"
          ]
        ]
      }
    },
    {
      "id": "kw_a10",
      "part": "A",
      "category": "1. Truy vấn & Lọc (DQL)",
      "keyword": "OFFSET ... ROWS FETCH NEXT ... ROWS ONLY",
      "what_it_does": "Bỏ qua M dòng đầu tiên và lấy N dòng kế tiếp để phân trang chuẩn ANSI/T-SQL (bắt buộc phải đi kèm ORDER BY).",
      "backend_scenario": "Phân trang danh sách sản phẩm ở phía Server (Server-side Pagination) cho API GET /api/fruits?page=2&size=4 (bỏ qua 4 dòng đầu, lấy 4 dòng tiếp theo).",
      "tsql_code": "SELECT \n    FruitID, FruitName, Price\nFROM Fruits\nORDER BY FruitID ASC\nOFFSET 4 ROWS FETCH NEXT 4 ROWS ONLY;",
      "lab_sql": "SELECT FruitID, FruitName, Price FROM Fruits ORDER BY FruitID ASC LIMIT 4 OFFSET 4;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000
          ],
          [
            6,
            "Táo Envy",
            250000
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            450000
          ],
          [
            8,
            "Kiwi Vàng",
            180000
          ]
        ]
      },
      "part1_what": "Bỏ qua M dòng đầu tiên và lấy N dòng kế tiếp để phân trang chuẩn ANSI/T-SQL (bắt buộc phải đi kèm ORDER BY).",
      "part2_backend": "Phân trang danh sách sản phẩm ở phía Server (Server-side Pagination) cho API GET /api/fruits?page=2&size=4 (bỏ qua 4 dòng đầu, lấy 4 dòng tiếp theo).",
      "part3_tsql": "SELECT \n    FruitID, FruitName, Price\nFROM Fruits\nORDER BY FruitID ASC\nOFFSET 4 ROWS FETCH NEXT 4 ROWS ONLY;",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000
          ],
          [
            6,
            "Táo Envy",
            250000
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            450000
          ],
          [
            8,
            "Kiwi Vàng",
            180000
          ]
        ]
      }
    },
    {
      "id": "kw_a11",
      "part": "A",
      "category": "2. Kết nối bảng (JOIN & APPLY)",
      "keyword": "INNER JOIN",
      "what_it_does": "Kết nối hai bảng và chỉ giữ lại những dòng có khóa khớp nhau ở cả hai phía.",
      "backend_scenario": "Lấy danh sách các đơn hàng kèm tên khách hàng và tên nhân viên bán hàng phụ trách đơn đó để hiển thị trên màn hình Quản lý Đơn hàng.",
      "tsql_code": "SELECT \n    o.OrderID,\n    c.FullName AS TenKhachHang,\n    e.FullName AS NhanVienBan,\n    o.TotalAmount,\n    o.Status\nFROM Orders AS o\nINNER JOIN Customers AS c ON o.CustomerID = c.CustomerID\nINNER JOIN Employees AS e ON o.EmployeeID = e.EmployeeID\nWHERE o.OrderID <= 4;",
      "lab_sql": "SELECT o.OrderID, c.FullName AS TenKhachHang, e.FullName AS NhanVienBan, o.TotalAmount, o.Status FROM Orders AS o INNER JOIN Customers AS c ON o.CustomerID = c.CustomerID INNER JOIN Employees AS e ON o.EmployeeID = e.EmployeeID WHERE o.OrderID <= 4;",
      "output": {
        "cols": [
          "OrderID",
          "TenKhachHang",
          "NhanVienBan",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            1,
            "Võ Thành Tài",
            "Hoàng Cúc",
            850000,
            "Đã giao"
          ],
          [
            2,
            "Nguyễn Thị Lệ",
            "Hoàng Cúc",
            180000,
            "Đã giao"
          ],
          [
            3,
            "Trương Vô Kỵ",
            "Đinh Hợi",
            150000,
            "Đã giao"
          ],
          [
            4,
            "Triệu Mẫn",
            "Đinh Hợi",
            850000,
            "Đã giao"
          ]
        ]
      },
      "part1_what": "Kết nối hai bảng và chỉ giữ lại những dòng có khóa khớp nhau ở cả hai phía.",
      "part2_backend": "Lấy danh sách các đơn hàng kèm tên khách hàng và tên nhân viên bán hàng phụ trách đơn đó để hiển thị trên màn hình Quản lý Đơn hàng.",
      "part3_tsql": "SELECT \n    o.OrderID,\n    c.FullName AS TenKhachHang,\n    e.FullName AS NhanVienBan,\n    o.TotalAmount,\n    o.Status\nFROM Orders AS o\nINNER JOIN Customers AS c ON o.CustomerID = c.CustomerID\nINNER JOIN Employees AS e ON o.EmployeeID = e.EmployeeID\nWHERE o.OrderID <= 4;",
      "part4_output": {
        "cols": [
          "OrderID",
          "TenKhachHang",
          "NhanVienBan",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            1,
            "Võ Thành Tài",
            "Hoàng Cúc",
            850000,
            "Đã giao"
          ],
          [
            2,
            "Nguyễn Thị Lệ",
            "Hoàng Cúc",
            180000,
            "Đã giao"
          ],
          [
            3,
            "Trương Vô Kỵ",
            "Đinh Hợi",
            150000,
            "Đã giao"
          ],
          [
            4,
            "Triệu Mẫn",
            "Đinh Hợi",
            850000,
            "Đã giao"
          ]
        ]
      }
    },
    {
      "id": "kw_a12",
      "part": "A",
      "category": "2. Kết nối bảng (JOIN & APPLY)",
      "keyword": "LEFT OUTER JOIN (Tìm dòng mồ côi / Anti-Join)",
      "what_it_does": "Giữ lại toàn bộ dòng của bảng bên trái; nếu bảng bên phải không có dòng khớp thì điền NULL vào các cột bên phải.",
      "backend_scenario": "Tìm các khách hàng đã đăng ký tài khoản nhưng chưa từng đặt bất kỳ đơn hàng nào (o.OrderID IS NULL) để gửi mã giảm giá WELCOME50 kích cầu.",
      "tsql_code": "SELECT \n    c.CustomerID, c.FullName, c.PhoneNumber, c.RegisterDate\nFROM Customers AS c\nLEFT OUTER JOIN Orders AS o ON c.CustomerID = o.CustomerID\nWHERE o.OrderID IS NULL;",
      "lab_sql": "SELECT c.CustomerID, c.FullName, c.PhoneNumber, c.RegisterDate FROM Customers AS c LEFT JOIN Orders AS o ON c.CustomerID = o.CustomerID WHERE o.OrderID IS NULL;",
      "output": {
        "cols": [
          "CustomerID",
          "FullName",
          "PhoneNumber",
          "RegisterDate"
        ],
        "rows": [
          [
            8,
            "Dương Quá",
            "0908888999",
            "2024-03-10"
          ]
        ]
      },
      "part1_what": "Giữ lại toàn bộ dòng của bảng bên trái; nếu bảng bên phải không có dòng khớp thì điền NULL vào các cột bên phải.",
      "part2_backend": "Tìm các khách hàng đã đăng ký tài khoản nhưng chưa từng đặt bất kỳ đơn hàng nào (o.OrderID IS NULL) để gửi mã giảm giá WELCOME50 kích cầu.",
      "part3_tsql": "SELECT \n    c.CustomerID, c.FullName, c.PhoneNumber, c.RegisterDate\nFROM Customers AS c\nLEFT OUTER JOIN Orders AS o ON c.CustomerID = o.CustomerID\nWHERE o.OrderID IS NULL;",
      "part4_output": {
        "cols": [
          "CustomerID",
          "FullName",
          "PhoneNumber",
          "RegisterDate"
        ],
        "rows": [
          [
            8,
            "Dương Quá",
            "0908888999",
            "2024-03-10"
          ]
        ]
      }
    },
    {
      "id": "kw_a13",
      "part": "A",
      "category": "2. Kết nối bảng (JOIN & APPLY)",
      "keyword": "SELF JOIN (Kết nối tự thân)",
      "what_it_does": "Kết nối một bảng với chính nó thông qua hai bí danh khác nhau để truy vấn quan hệ phân cấp cha - con (như Nhân viên - Quản lý).",
      "backend_scenario": "Hiển thị danh sách nhân viên cửa hàng trái cây kèm theo họ tên người quản lý trực tiếp (Manager) của từng người.",
      "tsql_code": "SELECT \n    emp.EmployeeID,\n    emp.FullName AS NhanVien,\n    emp.Role AS ChucVu,\n    ISNULL(mgr.FullName, N'Ban Giám Đốc') AS QuanLyTrucTiep\nFROM Employees AS emp\nLEFT JOIN Employees AS mgr ON emp.ManagerID = mgr.EmployeeID;",
      "lab_sql": "SELECT emp.EmployeeID, emp.FullName AS NhanVien, emp.Role AS ChucVu, COALESCE(mgr.FullName, 'Ban Giám Đốc') AS QuanLyTrucTiep FROM Employees AS emp LEFT JOIN Employees AS mgr ON emp.ManagerID = mgr.EmployeeID;",
      "output": {
        "cols": [
          "EmployeeID",
          "NhanVien",
          "ChucVu",
          "QuanLyTrucTiep"
        ],
        "rows": [
          [
            1,
            "Lê Minh Triết",
            "Giám đốc",
            "Ban Giám Đốc"
          ],
          [
            2,
            "Nguyễn Tấn Dũng",
            "Quản lý Kho",
            "Lê Minh Triết"
          ],
          [
            3,
            "Trần Thị Mai",
            "Quản lý Bán hàng",
            "Lê Minh Triết"
          ],
          [
            4,
            "Phạm Văn A",
            "Nhân viên Kho",
            "Nguyễn Tấn Dũng"
          ],
          [
            5,
            "Lý Bạch",
            "Nhân viên Kho",
            "Nguyễn Tấn Dũng"
          ],
          [
            6,
            "Hoàng Cúc",
            "Nhân viên Bán hàng",
            "Trần Thị Mai"
          ],
          [
            7,
            "Đinh Hợi",
            "Nhân viên Bán hàng",
            "Trần Thị Mai"
          ]
        ]
      },
      "part1_what": "Kết nối một bảng với chính nó thông qua hai bí danh khác nhau để truy vấn quan hệ phân cấp cha - con (như Nhân viên - Quản lý).",
      "part2_backend": "Hiển thị danh sách nhân viên cửa hàng trái cây kèm theo họ tên người quản lý trực tiếp (Manager) của từng người.",
      "part3_tsql": "SELECT \n    emp.EmployeeID,\n    emp.FullName AS NhanVien,\n    emp.Role AS ChucVu,\n    ISNULL(mgr.FullName, N'Ban Giám Đốc') AS QuanLyTrucTiep\nFROM Employees AS emp\nLEFT JOIN Employees AS mgr ON emp.ManagerID = mgr.EmployeeID;",
      "part4_output": {
        "cols": [
          "EmployeeID",
          "NhanVien",
          "ChucVu",
          "QuanLyTrucTiep"
        ],
        "rows": [
          [
            1,
            "Lê Minh Triết",
            "Giám đốc",
            "Ban Giám Đốc"
          ],
          [
            2,
            "Nguyễn Tấn Dũng",
            "Quản lý Kho",
            "Lê Minh Triết"
          ],
          [
            3,
            "Trần Thị Mai",
            "Quản lý Bán hàng",
            "Lê Minh Triết"
          ],
          [
            4,
            "Phạm Văn A",
            "Nhân viên Kho",
            "Nguyễn Tấn Dũng"
          ],
          [
            5,
            "Lý Bạch",
            "Nhân viên Kho",
            "Nguyễn Tấn Dũng"
          ],
          [
            6,
            "Hoàng Cúc",
            "Nhân viên Bán hàng",
            "Trần Thị Mai"
          ],
          [
            7,
            "Đinh Hợi",
            "Nhân viên Bán hàng",
            "Trần Thị Mai"
          ]
        ]
      }
    },
    {
      "id": "kw_a14",
      "part": "A",
      "category": "2. Kết nối bảng (JOIN & APPLY)",
      "keyword": "CROSS APPLY & OUTER APPLY",
      "what_it_does": "Thực thi một truy vấn con tương quan hoặc hàm trả về bảng (TVF / OPENJSON) cho từng dòng của bảng bên trái (giống vòng lặp ForEach trên tập hợp).",
      "backend_scenario": "Với mỗi danh mục trái cây, lấy ra đúng 1 sản phẩm có giá bán cao nhất thuộc danh mục đó (bài toán Top-N mỗi nhóm kinh điển trong phỏng vấn).",
      "tsql_code": "SELECT \n    c.CategoryID,\n    c.CategoryName,\n    topFruit.FruitName,\n    topFruit.Price\nFROM Categories AS c\nCROSS APPLY (\n    SELECT TOP (1) f.FruitName, f.Price\n    FROM Fruits AS f\n    WHERE f.CategoryID = c.CategoryID\n    ORDER BY f.Price DESC\n) AS topFruit;",
      "lab_sql": "SELECT CategoryID, CategoryName, FruitName, Price FROM (SELECT c.CategoryID, c.CategoryName, f.FruitName, f.Price, ROW_NUMBER() OVER (PARTITION BY c.CategoryID ORDER BY f.Price DESC) AS rn FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID) WHERE rn = 1;",
      "output": {
        "cols": [
          "CategoryID",
          "CategoryName",
          "FruitName",
          "Price"
        ],
        "rows": [
          [
            1,
            "Đặc sản Miền Tây",
            "Sầu Riêng Ri6",
            150000
          ],
          [
            2,
            "Trái cây Nhập khẩu",
            "Nho Mẫu Đơn Shine Muscat",
            850000
          ],
          [
            3,
            "Quả mọng (Berries)",
            "Việt Quất (Blueberry)",
            350000
          ],
          [
            4,
            "Trái cây sấy",
            "Nho khô Ninh Thuận",
            120000
          ],
          [
            5,
            "Quả hạch (Nuts)",
            "Hạt Mắc Ca",
            280000
          ]
        ]
      },
      "part1_what": "Thực thi một truy vấn con tương quan hoặc hàm trả về bảng (TVF / OPENJSON) cho từng dòng của bảng bên trái (giống vòng lặp ForEach trên tập hợp).",
      "part2_backend": "Với mỗi danh mục trái cây, lấy ra đúng 1 sản phẩm có giá bán cao nhất thuộc danh mục đó (bài toán Top-N mỗi nhóm kinh điển trong phỏng vấn).",
      "part3_tsql": "SELECT \n    c.CategoryID,\n    c.CategoryName,\n    topFruit.FruitName,\n    topFruit.Price\nFROM Categories AS c\nCROSS APPLY (\n    SELECT TOP (1) f.FruitName, f.Price\n    FROM Fruits AS f\n    WHERE f.CategoryID = c.CategoryID\n    ORDER BY f.Price DESC\n) AS topFruit;",
      "part4_output": {
        "cols": [
          "CategoryID",
          "CategoryName",
          "FruitName",
          "Price"
        ],
        "rows": [
          [
            1,
            "Đặc sản Miền Tây",
            "Sầu Riêng Ri6",
            150000
          ],
          [
            2,
            "Trái cây Nhập khẩu",
            "Nho Mẫu Đơn Shine Muscat",
            850000
          ],
          [
            3,
            "Quả mọng (Berries)",
            "Việt Quất (Blueberry)",
            350000
          ],
          [
            4,
            "Trái cây sấy",
            "Nho khô Ninh Thuận",
            120000
          ],
          [
            5,
            "Quả hạch (Nuts)",
            "Hạt Mắc Ca",
            280000
          ]
        ]
      }
    },
    {
      "id": "kw_a15",
      "part": "A",
      "category": "3. Gom nhóm & Tổng hợp",
      "keyword": "GROUP BY & HAVING",
      "what_it_does": "Gom các dòng có cùng giá trị khóa về một nhóm để tính hàm tổng hợp, sau đó dùng HAVING để lọc các nhóm thỏa điều kiện sau khi gom.",
      "backend_scenario": "Thống kê các danh mục trái cây có tổng số lượng tồn kho (SUM(StockQuantity)) lớn hơn 100 đơn vị để lên kế hoạch xả kho khuyến mãi.",
      "tsql_code": "SELECT \n    c.CategoryName,\n    COUNT(f.FruitID) AS SoMatHang,\n    SUM(f.StockQuantity) AS TongTonKho\nFROM Categories AS c\nINNER JOIN Fruits AS f ON c.CategoryID = f.CategoryID\nGROUP BY c.CategoryID, c.CategoryName\nHAVING SUM(f.StockQuantity) > 100\nORDER BY TongTonKho DESC;",
      "lab_sql": "SELECT c.CategoryName, COUNT(f.FruitID) AS SoMatHang, SUM(f.StockQuantity) AS TongTonKho FROM Categories AS c INNER JOIN Fruits AS f ON c.CategoryID = f.CategoryID GROUP BY c.CategoryID, c.CategoryName HAVING SUM(f.StockQuantity) > 100 ORDER BY TongTonKho DESC;",
      "output": {
        "cols": [
          "CategoryName",
          "SoMatHang",
          "TongTonKho"
        ],
        "rows": [
          [
            "Đặc sản Miền Tây",
            4,
            450
          ],
          [
            "Trái cây sấy",
            2,
            450
          ],
          [
            "Trái cây Nhập khẩu",
            4,
            205
          ]
        ]
      },
      "part1_what": "Gom các dòng có cùng giá trị khóa về một nhóm để tính hàm tổng hợp, sau đó dùng HAVING để lọc các nhóm thỏa điều kiện sau khi gom.",
      "part2_backend": "Thống kê các danh mục trái cây có tổng số lượng tồn kho (SUM(StockQuantity)) lớn hơn 100 đơn vị để lên kế hoạch xả kho khuyến mãi.",
      "part3_tsql": "SELECT \n    c.CategoryName,\n    COUNT(f.FruitID) AS SoMatHang,\n    SUM(f.StockQuantity) AS TongTonKho\nFROM Categories AS c\nINNER JOIN Fruits AS f ON c.CategoryID = f.CategoryID\nGROUP BY c.CategoryID, c.CategoryName\nHAVING SUM(f.StockQuantity) > 100\nORDER BY TongTonKho DESC;",
      "part4_output": {
        "cols": [
          "CategoryName",
          "SoMatHang",
          "TongTonKho"
        ],
        "rows": [
          [
            "Đặc sản Miền Tây",
            4,
            450
          ],
          [
            "Trái cây sấy",
            2,
            450
          ],
          [
            "Trái cây Nhập khẩu",
            4,
            205
          ]
        ]
      }
    },
    {
      "id": "kw_a16",
      "part": "A",
      "category": "3. Gom nhóm & Tổng hợp",
      "keyword": "COUNT, SUM, AVG, MIN, MAX",
      "what_it_does": "Bộ 5 hàm tổng hợp chuẩn: đếm số dòng/giá trị, tính tổng, trung bình, giá trị nhỏ nhất và lớn nhất (bỏ qua NULL trừ COUNT(*)).",
      "backend_scenario": "Tính các chỉ số KPI tổng quan trên Dashboard quản trị: tổng số đơn hàng đã giao, tổng doanh thu, giá trị đơn trung bình, đơn nhỏ nhất và đơn lớn nhất.",
      "tsql_code": "SELECT \n    COUNT(*) AS SoDonDaGiao,\n    SUM(TotalAmount) AS TongDoanhThu,\n    CAST(AVG(TotalAmount) AS DECIMAL(18,0)) AS GiaTriTrungBinh,\n    MIN(TotalAmount) AS DonNhoNhat,\n    MAX(TotalAmount) AS DonLonNhat\nFROM Orders\nWHERE Status = N'Đã giao';",
      "lab_sql": "SELECT COUNT(*) AS SoDonDaGiao, SUM(TotalAmount) AS TongDoanhThu, CAST(ROUND(AVG(TotalAmount), 0) AS INTEGER) AS GiaTriTrungBinh, MIN(TotalAmount) AS DonNhoNhat, MAX(TotalAmount) AS DonLonNhat FROM Orders WHERE Status = 'Đã giao';",
      "output": {
        "cols": [
          "SoDonDaGiao",
          "TongDoanhThu",
          "GiaTriTrungBinh",
          "DonNhoNhat",
          "DonLonNhat"
        ],
        "rows": [
          [
            6,
            4830000,
            805000,
            150000,
            2500000
          ]
        ]
      },
      "part1_what": "Bộ 5 hàm tổng hợp chuẩn: đếm số dòng/giá trị, tính tổng, trung bình, giá trị nhỏ nhất và lớn nhất (bỏ qua NULL trừ COUNT(*)).",
      "part2_backend": "Tính các chỉ số KPI tổng quan trên Dashboard quản trị: tổng số đơn hàng đã giao, tổng doanh thu, giá trị đơn trung bình, đơn nhỏ nhất và đơn lớn nhất.",
      "part3_tsql": "SELECT \n    COUNT(*) AS SoDonDaGiao,\n    SUM(TotalAmount) AS TongDoanhThu,\n    CAST(AVG(TotalAmount) AS DECIMAL(18,0)) AS GiaTriTrungBinh,\n    MIN(TotalAmount) AS DonNhoNhat,\n    MAX(TotalAmount) AS DonLonNhat\nFROM Orders\nWHERE Status = N'Đã giao';",
      "part4_output": {
        "cols": [
          "SoDonDaGiao",
          "TongDoanhThu",
          "GiaTriTrungBinh",
          "DonNhoNhat",
          "DonLonNhat"
        ],
        "rows": [
          [
            6,
            4830000,
            805000,
            150000,
            2500000
          ]
        ]
      }
    },
    {
      "id": "kw_a17",
      "part": "A",
      "category": "3. Gom nhóm & Tổng hợp",
      "keyword": "STRING_AGG (Gộp chuỗi theo nhóm)",
      "what_it_does": "Nối các giá trị văn bản của nhiều dòng trong cùng một nhóm thành một chuỗi duy nhất phân cách bởi dấu phẩy hoặc ký tự tùy chọn (SQL Server 2017+).",
      "backend_scenario": "Trên màn hình danh sách đơn hàng, hiển thị tóm tắt tất cả tên các loại trái cây nằm trong cùng một đơn hàng trên 1 dòng duy nhất mà không cần tách nhiều dòng ở Backend.",
      "tsql_code": "SELECT \n    od.OrderID,\n    STRING_AGG(f.FruitName, N', ') WITHIN GROUP (ORDER BY f.FruitName) AS DanhSachTraiCay,\n    SUM(od.SubTotal) AS TamTinh\nFROM OrderDetails AS od\nINNER JOIN Fruits AS f ON od.FruitID = f.FruitID\nWHERE od.OrderID IN (2, 4, 5)\nGROUP BY od.OrderID;",
      "lab_sql": "SELECT od.OrderID, GROUP_CONCAT(f.FruitName, ', ') AS DanhSachTraiCay, SUM(od.SubTotal) AS TamTinh FROM OrderDetails AS od INNER JOIN Fruits AS f ON od.FruitID = f.FruitID WHERE od.OrderID IN (2, 4, 5) GROUP BY od.OrderID;",
      "output": {
        "cols": [
          "OrderID",
          "DanhSachTraiCay",
          "TamTinh"
        ],
        "rows": [
          [
            2,
            "Bưởi Da Xanh, Xoài Cát Hòa Lộc",
            230000
          ],
          [
            4,
            "Cherry Đỏ Thẫm, Táo Envy",
            950000
          ],
          [
            5,
            "Cherry Đỏ Thẫm, Nho Mẫu Đơn Shine Muscat",
            2600000
          ]
        ]
      },
      "part1_what": "Nối các giá trị văn bản của nhiều dòng trong cùng một nhóm thành một chuỗi duy nhất phân cách bởi dấu phẩy hoặc ký tự tùy chọn (SQL Server 2017+).",
      "part2_backend": "Trên màn hình danh sách đơn hàng, hiển thị tóm tắt tất cả tên các loại trái cây nằm trong cùng một đơn hàng trên 1 dòng duy nhất mà không cần tách nhiều dòng ở Backend.",
      "part3_tsql": "SELECT \n    od.OrderID,\n    STRING_AGG(f.FruitName, N', ') WITHIN GROUP (ORDER BY f.FruitName) AS DanhSachTraiCay,\n    SUM(od.SubTotal) AS TamTinh\nFROM OrderDetails AS od\nINNER JOIN Fruits AS f ON od.FruitID = f.FruitID\nWHERE od.OrderID IN (2, 4, 5)\nGROUP BY od.OrderID;",
      "part4_output": {
        "cols": [
          "OrderID",
          "DanhSachTraiCay",
          "TamTinh"
        ],
        "rows": [
          [
            2,
            "Bưởi Da Xanh, Xoài Cát Hòa Lộc",
            230000
          ],
          [
            4,
            "Cherry Đỏ Thẫm, Táo Envy",
            950000
          ],
          [
            5,
            "Cherry Đỏ Thẫm, Nho Mẫu Đơn Shine Muscat",
            2600000
          ]
        ]
      }
    },
    {
      "id": "kw_a18",
      "part": "A",
      "category": "4. Biểu thức điều kiện & NULL",
      "keyword": "CASE ... WHEN ... THEN ... ELSE ... END",
      "what_it_does": "Biểu thức rẽ nhánh điều kiện ngay trong câu lệnh SQL (dùng được trong SELECT, ORDER BY, GROUP BY và cả trong hàm SUM/COUNT có điều kiện).",
      "backend_scenario": "Phân loại mức giá sản phẩm ('Cao cấp', 'Phổ thông', 'Bình dân') hoặc thực hiện Conditional Aggregation (đếm số đơn Đã giao / Đã hủy trong 1 lần quét bảng).",
      "tsql_code": "SELECT \n    SUM(CASE WHEN Status = N'Đã giao' THEN 1 ELSE 0 END) AS DonDaGiao,\n    SUM(CASE WHEN Status = N'Chờ xử lý' THEN 1 ELSE 0 END) AS DonChoXuLy,\n    SUM(CASE WHEN Status = N'Đang giao' THEN 1 ELSE 0 END) AS DonDangGiao,\n    SUM(CASE WHEN Status = N'Đã hủy' THEN 1 ELSE 0 END) AS DonDaHuy\nFROM Orders;",
      "lab_sql": "SELECT SUM(CASE WHEN Status = 'Đã giao' THEN 1 ELSE 0 END) AS DonDaGiao, SUM(CASE WHEN Status = 'Chờ xử lý' THEN 1 ELSE 0 END) AS DonChoXuLy, SUM(CASE WHEN Status = 'Đang giao' THEN 1 ELSE 0 END) AS DonDangGiao, SUM(CASE WHEN Status = 'Đã hủy' THEN 1 ELSE 0 END) AS DonDaHuy FROM Orders;",
      "output": {
        "cols": [
          "DonDaGiao",
          "DonChoXuLy",
          "DonDangGiao",
          "DonDaHuy"
        ],
        "rows": [
          [
            6,
            2,
            1,
            1
          ]
        ]
      },
      "part1_what": "Biểu thức rẽ nhánh điều kiện ngay trong câu lệnh SQL (dùng được trong SELECT, ORDER BY, GROUP BY và cả trong hàm SUM/COUNT có điều kiện).",
      "part2_backend": "Phân loại mức giá sản phẩm ('Cao cấp', 'Phổ thông', 'Bình dân') hoặc thực hiện Conditional Aggregation (đếm số đơn Đã giao / Đã hủy trong 1 lần quét bảng).",
      "part3_tsql": "SELECT \n    SUM(CASE WHEN Status = N'Đã giao' THEN 1 ELSE 0 END) AS DonDaGiao,\n    SUM(CASE WHEN Status = N'Chờ xử lý' THEN 1 ELSE 0 END) AS DonChoXuLy,\n    SUM(CASE WHEN Status = N'Đang giao' THEN 1 ELSE 0 END) AS DonDangGiao,\n    SUM(CASE WHEN Status = N'Đã hủy' THEN 1 ELSE 0 END) AS DonDaHuy\nFROM Orders;",
      "part4_output": {
        "cols": [
          "DonDaGiao",
          "DonChoXuLy",
          "DonDangGiao",
          "DonDaHuy"
        ],
        "rows": [
          [
            6,
            2,
            1,
            1
          ]
        ]
      }
    },
    {
      "id": "kw_a19",
      "part": "A",
      "category": "4. Biểu thức điều kiện & NULL",
      "keyword": "IIF & CHOOSE",
      "what_it_does": "IIF(điều_kiện, đúng, sai) là cú pháp viết tắt của CASE 2 nhánh; CHOOSE(chỉ_số, v1, v2...) trả về phần tử tại vị trí chỉ_số (bắt đầu từ 1).",
      "backend_scenario": "Hiển thị nhanh nhãn trạng thái tồn kho ('Còn hàng' / 'Hết hàng') của các loại quả mọng trên API danh mục sản phẩm.",
      "tsql_code": "SELECT \n    FruitID,\n    FruitName,\n    StockQuantity,\n    IIF(StockQuantity > 0, N'Còn hàng', N'Hết hàng') AS TinhTrangKho\nFROM Fruits\nWHERE CategoryID = 3;",
      "lab_sql": "SELECT FruitID, FruitName, StockQuantity, IIF(StockQuantity > 0, 'Còn hàng', 'Hết hàng') AS TinhTrangKho FROM Fruits WHERE CategoryID = 3;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "StockQuantity",
          "TinhTrangKho"
        ],
        "rows": [
          [
            9,
            "Dâu Tây Mộc Châu",
            45,
            "Còn hàng"
          ],
          [
            10,
            "Việt Quất (Blueberry)",
            20,
            "Còn hàng"
          ],
          [
            11,
            "Mâm Xôi Đen",
            0,
            "Hết hàng"
          ]
        ]
      },
      "part1_what": "IIF(điều_kiện, đúng, sai) là cú pháp viết tắt của CASE 2 nhánh; CHOOSE(chỉ_số, v1, v2...) trả về phần tử tại vị trí chỉ_số (bắt đầu từ 1).",
      "part2_backend": "Hiển thị nhanh nhãn trạng thái tồn kho ('Còn hàng' / 'Hết hàng') của các loại quả mọng trên API danh mục sản phẩm.",
      "part3_tsql": "SELECT \n    FruitID,\n    FruitName,\n    StockQuantity,\n    IIF(StockQuantity > 0, N'Còn hàng', N'Hết hàng') AS TinhTrangKho\nFROM Fruits\nWHERE CategoryID = 3;",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "StockQuantity",
          "TinhTrangKho"
        ],
        "rows": [
          [
            9,
            "Dâu Tây Mộc Châu",
            45,
            "Còn hàng"
          ],
          [
            10,
            "Việt Quất (Blueberry)",
            20,
            "Còn hàng"
          ],
          [
            11,
            "Mâm Xôi Đen",
            0,
            "Hết hàng"
          ]
        ]
      }
    },
    {
      "id": "kw_a20",
      "part": "A",
      "category": "4. Biểu thức điều kiện & NULL",
      "keyword": "COALESCE, ISNULL & NULLIF",
      "what_it_does": "ISNULL(a, b) và COALESCE(a, b, c...) thay thế giá trị NULL bằng giá trị mặc định; NULLIF(a, b) trả về NULL nếu a = b (dùng để chống lỗi chia cho 0).",
      "backend_scenario": "Khi tính tổng tiền đơn hàng có áp mã giảm giá Voucher, nếu đơn không dùng Voucher (v.DiscountAmount là NULL) thì phải đổi thành 0 để phép trừ không bị biến thành NULL.",
      "tsql_code": "SELECT \n    o.OrderID,\n    COALESCE(v.VoucherCode, 'KHONG_DUNG') AS MaVoucher,\n    ISNULL(v.DiscountAmount, 0) AS TienGiam,\n    o.TotalAmount AS ThanhToanCuoi\nFROM Orders AS o\nLEFT JOIN Vouchers AS v ON o.VoucherID = v.VoucherID\nWHERE o.OrderID <= 4;",
      "lab_sql": "SELECT o.OrderID, COALESCE(v.VoucherCode, 'KHONG_DUNG') AS MaVoucher, IFNULL(v.DiscountAmount, 0) AS TienGiam, o.TotalAmount AS ThanhToanCuoi FROM Orders AS o LEFT JOIN Vouchers AS v ON o.VoucherID = v.VoucherID WHERE o.OrderID <= 4;",
      "output": {
        "cols": [
          "OrderID",
          "MaVoucher",
          "TienGiam",
          "ThanhToanCuoi"
        ],
        "rows": [
          [
            1,
            "KHONG_DUNG",
            0,
            850000
          ],
          [
            2,
            "WELCOME50",
            50000,
            180000
          ],
          [
            3,
            "KHONG_DUNG",
            0,
            150000
          ],
          [
            4,
            "VIP100",
            100000,
            850000
          ]
        ]
      },
      "part1_what": "ISNULL(a, b) và COALESCE(a, b, c...) thay thế giá trị NULL bằng giá trị mặc định; NULLIF(a, b) trả về NULL nếu a = b (dùng để chống lỗi chia cho 0).",
      "part2_backend": "Khi tính tổng tiền đơn hàng có áp mã giảm giá Voucher, nếu đơn không dùng Voucher (v.DiscountAmount là NULL) thì phải đổi thành 0 để phép trừ không bị biến thành NULL.",
      "part3_tsql": "SELECT \n    o.OrderID,\n    COALESCE(v.VoucherCode, 'KHONG_DUNG') AS MaVoucher,\n    ISNULL(v.DiscountAmount, 0) AS TienGiam,\n    o.TotalAmount AS ThanhToanCuoi\nFROM Orders AS o\nLEFT JOIN Vouchers AS v ON o.VoucherID = v.VoucherID\nWHERE o.OrderID <= 4;",
      "part4_output": {
        "cols": [
          "OrderID",
          "MaVoucher",
          "TienGiam",
          "ThanhToanCuoi"
        ],
        "rows": [
          [
            1,
            "KHONG_DUNG",
            0,
            850000
          ],
          [
            2,
            "WELCOME50",
            50000,
            180000
          ],
          [
            3,
            "KHONG_DUNG",
            0,
            150000
          ],
          [
            4,
            "VIP100",
            100000,
            850000
          ]
        ]
      }
    },
    {
      "id": "kw_a21",
      "part": "A",
      "category": "4. Biểu thức điều kiện & NULL",
      "keyword": "CAST, CONVERT, TRY_CAST & TRY_CONVERT",
      "what_it_does": "Ép kiểu dữ liệu tường minh; TRY_CAST / TRY_CONVERT trả về NULL thay vì ném lỗi dừng chương trình nếu chuỗi nguồn không thể ép kiểu hợp lệ.",
      "backend_scenario": "Khi đồng bộ dữ liệu từ file CSV hoặc form nhập liệu vào DB, dùng TRY_CAST để tránh một dòng dữ liệu bẩn làm hỏng cả batch import.",
      "tsql_code": "SELECT \n    FruitID,\n    FruitName,\n    CAST(Price AS INT) AS GiaNguyen,\n    TRY_CAST('250000' AS DECIMAL(18,2)) AS GiaHopLe,\n    TRY_CAST('LoiDuLieu' AS INT) AS GiaLoiTraVeNull\nFROM Fruits\nWHERE FruitID IN (1, 5);",
      "lab_sql": "SELECT FruitID, FruitName, CAST(Price AS INTEGER) AS GiaNguyen, 250000 AS GiaHopLe, NULL AS GiaLoiTraVeNull FROM Fruits WHERE FruitID IN (1, 5);",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "GiaNguyen",
          "GiaHopLe",
          "GiaLoiTraVeNull"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            150000,
            250000,
            null
          ],
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            250000,
            null
          ]
        ]
      },
      "part1_what": "Ép kiểu dữ liệu tường minh; TRY_CAST / TRY_CONVERT trả về NULL thay vì ném lỗi dừng chương trình nếu chuỗi nguồn không thể ép kiểu hợp lệ.",
      "part2_backend": "Khi đồng bộ dữ liệu từ file CSV hoặc form nhập liệu vào DB, dùng TRY_CAST để tránh một dòng dữ liệu bẩn làm hỏng cả batch import.",
      "part3_tsql": "SELECT \n    FruitID,\n    FruitName,\n    CAST(Price AS INT) AS GiaNguyen,\n    TRY_CAST('250000' AS DECIMAL(18,2)) AS GiaHopLe,\n    TRY_CAST('LoiDuLieu' AS INT) AS GiaLoiTraVeNull\nFROM Fruits\nWHERE FruitID IN (1, 5);",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "GiaNguyen",
          "GiaHopLe",
          "GiaLoiTraVeNull"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            150000,
            250000,
            null
          ],
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            250000,
            null
          ]
        ]
      }
    },
    {
      "id": "kw_a22",
      "part": "A",
      "category": "5. Window Functions & CTE",
      "keyword": "ROW_NUMBER, RANK, DENSE_RANK & NTILE",
      "what_it_does": "Đánh số thứ tự và xếp hạng các dòng trong từng phân vùng (PARTITION BY) mà không làm gộp dòng như GROUP BY.",
      "backend_scenario": "Xếp hạng các loại trái cây đắt nhất trong từng danh mục (DENSE_RANK không bị nhảy bậc khi đồng giá) hoặc chia sản phẩm thành các phân khúc giá (NTILE).",
      "tsql_code": "SELECT \n    CategoryID,\n    FruitName,\n    Price,\n    ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Price DESC) AS RowNum,\n    DENSE_RANK() OVER (PARTITION BY CategoryID ORDER BY Price DESC) AS DenseRank\nFROM Fruits\nWHERE CategoryID IN (1, 2);",
      "lab_sql": "SELECT CategoryID, FruitName, Price, ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Price DESC) AS RowNum, DENSE_RANK() OVER (PARTITION BY CategoryID ORDER BY Price DESC) AS DenseRank FROM Fruits WHERE CategoryID IN (1, 2);",
      "output": {
        "cols": [
          "CategoryID",
          "FruitName",
          "Price",
          "RowNum",
          "DenseRank"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            150000,
            1,
            1
          ],
          [
            1,
            "Măng Cụt Lái Thiêu",
            95000,
            2,
            2
          ],
          [
            1,
            "Xoài Cát Hòa Lộc",
            80000,
            3,
            3
          ],
          [
            1,
            "Bưởi Da Xanh",
            70000,
            4,
            4
          ],
          [
            2,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            1,
            1
          ],
          [
            2,
            "Cherry Đỏ Thẫm",
            450000,
            2,
            2
          ],
          [
            2,
            "Táo Envy",
            250000,
            3,
            3
          ],
          [
            2,
            "Kiwi Vàng",
            180000,
            4,
            4
          ]
        ]
      },
      "part1_what": "Đánh số thứ tự và xếp hạng các dòng trong từng phân vùng (PARTITION BY) mà không làm gộp dòng như GROUP BY.",
      "part2_backend": "Xếp hạng các loại trái cây đắt nhất trong từng danh mục (DENSE_RANK không bị nhảy bậc khi đồng giá) hoặc chia sản phẩm thành các phân khúc giá (NTILE).",
      "part3_tsql": "SELECT \n    CategoryID,\n    FruitName,\n    Price,\n    ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Price DESC) AS RowNum,\n    DENSE_RANK() OVER (PARTITION BY CategoryID ORDER BY Price DESC) AS DenseRank\nFROM Fruits\nWHERE CategoryID IN (1, 2);",
      "part4_output": {
        "cols": [
          "CategoryID",
          "FruitName",
          "Price",
          "RowNum",
          "DenseRank"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            150000,
            1,
            1
          ],
          [
            1,
            "Măng Cụt Lái Thiêu",
            95000,
            2,
            2
          ],
          [
            1,
            "Xoài Cát Hòa Lộc",
            80000,
            3,
            3
          ],
          [
            1,
            "Bưởi Da Xanh",
            70000,
            4,
            4
          ],
          [
            2,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            1,
            1
          ],
          [
            2,
            "Cherry Đỏ Thẫm",
            450000,
            2,
            2
          ],
          [
            2,
            "Táo Envy",
            250000,
            3,
            3
          ],
          [
            2,
            "Kiwi Vàng",
            180000,
            4,
            4
          ]
        ]
      }
    },
    {
      "id": "kw_a23",
      "part": "A",
      "category": "5. Window Functions & CTE",
      "keyword": "LAG & LEAD (So sánh dòng trước / sau)",
      "what_it_does": "Truy xuất trực tiếp giá trị của dòng đứng trước (LAG) hoặc dòng đứng sau (LEAD) trong cùng khung cửa sổ mà không cần Self-Join.",
      "backend_scenario": "Phân tích lịch sử mua hàng của khách VIP Võ Thành Tài: so sánh tổng tiền đơn hàng hiện tại với đơn hàng liền trước của chính khách đó để biết xu hướng chi tiêu tăng hay giảm.",
      "tsql_code": "SELECT \n    OrderID,\n    CustomerID,\n    OrderDate,\n    TotalAmount AS DonHienTai,\n    LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate) AS DonTruocDo,\n    TotalAmount - LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate) AS ChenhLech\nFROM Orders\nWHERE CustomerID = 1;",
      "lab_sql": "SELECT OrderID, CustomerID, OrderDate, TotalAmount AS DonHienTai, LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate) AS DonTruocDo, TotalAmount - LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate) AS ChenhLech FROM Orders WHERE CustomerID = 1;",
      "output": {
        "cols": [
          "OrderID",
          "CustomerID",
          "OrderDate",
          "DonHienTai",
          "DonTruocDo",
          "ChenhLech"
        ],
        "rows": [
          [
            1,
            1,
            "2023-02-14 10:15:00",
            850000,
            0,
            850000
          ],
          [
            5,
            1,
            "2023-12-24 19:00:00",
            2500000,
            850000,
            1650000
          ],
          [
            8,
            1,
            "2024-03-01 15:10:00",
            200000,
            2500000,
            -2300000
          ]
        ]
      },
      "part1_what": "Truy xuất trực tiếp giá trị của dòng đứng trước (LAG) hoặc dòng đứng sau (LEAD) trong cùng khung cửa sổ mà không cần Self-Join.",
      "part2_backend": "Phân tích lịch sử mua hàng của khách VIP Võ Thành Tài: so sánh tổng tiền đơn hàng hiện tại với đơn hàng liền trước của chính khách đó để biết xu hướng chi tiêu tăng hay giảm.",
      "part3_tsql": "SELECT \n    OrderID,\n    CustomerID,\n    OrderDate,\n    TotalAmount AS DonHienTai,\n    LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate) AS DonTruocDo,\n    TotalAmount - LAG(TotalAmount, 1, 0) OVER (PARTITION BY CustomerID ORDER BY OrderDate) AS ChenhLech\nFROM Orders\nWHERE CustomerID = 1;",
      "part4_output": {
        "cols": [
          "OrderID",
          "CustomerID",
          "OrderDate",
          "DonHienTai",
          "DonTruocDo",
          "ChenhLech"
        ],
        "rows": [
          [
            1,
            1,
            "2023-02-14 10:15:00",
            850000,
            0,
            850000
          ],
          [
            5,
            1,
            "2023-12-24 19:00:00",
            2500000,
            850000,
            1650000
          ],
          [
            8,
            1,
            "2024-03-01 15:10:00",
            200000,
            2500000,
            -2300000
          ]
        ]
      }
    },
    {
      "id": "kw_a24",
      "part": "A",
      "category": "5. Window Functions & CTE",
      "keyword": "WITH (CTE) & Recursive CTE (Đệ quy)",
      "what_it_does": "Định nghĩa bảng tạm có tên tồn tại trong phạm vi một câu lệnh; hỗ trợ tự tham chiếu (UNION ALL) để duyệt cây phân cấp nhiều tầng.",
      "backend_scenario": "Duyệt sơ đồ tổ chức nhân sự (Org Chart) của chuỗi cửa hàng FruitStore từ Giám đốc Lê Minh Triết xuống các cấp Quản lý và Nhân viên bán hàng/kho.",
      "tsql_code": "WITH OrgChart AS (\n    SELECT EmployeeID, FullName, Role, ManagerID, 1 AS CapBac\n    FROM Employees\n    WHERE ManagerID IS NULL\n    UNION ALL\n    SELECT e.EmployeeID, e.FullName, e.Role, e.ManagerID, o.CapBac + 1\n    FROM Employees AS e\n    INNER JOIN OrgChart AS o ON e.ManagerID = o.EmployeeID\n)\nSELECT EmployeeID, FullName, Role, CapBac\nFROM OrgChart\nORDER BY CapBac, EmployeeID;",
      "lab_sql": "WITH RECURSIVE OrgChart AS (SELECT EmployeeID, FullName, Role, ManagerID, 1 AS CapBac FROM Employees WHERE ManagerID IS NULL UNION ALL SELECT e.EmployeeID, e.FullName, e.Role, e.ManagerID, o.CapBac + 1 FROM Employees AS e INNER JOIN OrgChart AS o ON e.ManagerID = o.EmployeeID) SELECT EmployeeID, FullName, Role, CapBac FROM OrgChart ORDER BY CapBac, EmployeeID;",
      "output": {
        "cols": [
          "EmployeeID",
          "FullName",
          "Role",
          "CapBac"
        ],
        "rows": [
          [
            1,
            "Lê Minh Triết",
            "Giám đốc",
            1
          ],
          [
            2,
            "Nguyễn Tấn Dũng",
            "Quản lý Kho",
            2
          ],
          [
            3,
            "Trần Thị Mai",
            "Quản lý Bán hàng",
            2
          ],
          [
            4,
            "Phạm Văn A",
            "Nhân viên Kho",
            3
          ],
          [
            5,
            "Lý Bạch",
            "Nhân viên Kho",
            3
          ],
          [
            6,
            "Hoàng Cúc",
            "Nhân viên Bán hàng",
            3
          ],
          [
            7,
            "Đinh Hợi",
            "Nhân viên Bán hàng",
            3
          ]
        ]
      },
      "part1_what": "Định nghĩa bảng tạm có tên tồn tại trong phạm vi một câu lệnh; hỗ trợ tự tham chiếu (UNION ALL) để duyệt cây phân cấp nhiều tầng.",
      "part2_backend": "Duyệt sơ đồ tổ chức nhân sự (Org Chart) của chuỗi cửa hàng FruitStore từ Giám đốc Lê Minh Triết xuống các cấp Quản lý và Nhân viên bán hàng/kho.",
      "part3_tsql": "WITH OrgChart AS (\n    SELECT EmployeeID, FullName, Role, ManagerID, 1 AS CapBac\n    FROM Employees\n    WHERE ManagerID IS NULL\n    UNION ALL\n    SELECT e.EmployeeID, e.FullName, e.Role, e.ManagerID, o.CapBac + 1\n    FROM Employees AS e\n    INNER JOIN OrgChart AS o ON e.ManagerID = o.EmployeeID\n)\nSELECT EmployeeID, FullName, Role, CapBac\nFROM OrgChart\nORDER BY CapBac, EmployeeID;",
      "part4_output": {
        "cols": [
          "EmployeeID",
          "FullName",
          "Role",
          "CapBac"
        ],
        "rows": [
          [
            1,
            "Lê Minh Triết",
            "Giám đốc",
            1
          ],
          [
            2,
            "Nguyễn Tấn Dũng",
            "Quản lý Kho",
            2
          ],
          [
            3,
            "Trần Thị Mai",
            "Quản lý Bán hàng",
            2
          ],
          [
            4,
            "Phạm Văn A",
            "Nhân viên Kho",
            3
          ],
          [
            5,
            "Lý Bạch",
            "Nhân viên Kho",
            3
          ],
          [
            6,
            "Hoàng Cúc",
            "Nhân viên Bán hàng",
            3
          ],
          [
            7,
            "Đinh Hợi",
            "Nhân viên Bán hàng",
            3
          ]
        ]
      }
    },
    {
      "id": "kw_a25",
      "part": "A",
      "category": "5. Window Functions & CTE",
      "keyword": "EXISTS & NOT EXISTS (Semi-Join / Anti-Semi-Join)",
      "what_it_does": "Kiểm tra sự tồn tại của ít nhất 1 dòng trong truy vấn con tương quan; dừng ngay khi tìm thấy dòng đầu tiên (short-circuit) và an toàn tuyệt đối với NULL.",
      "backend_scenario": "Tìm các loại trái cây đã từng được khách hàng viết bài đánh giá (Reviews) hoặc chưa từng có đánh giá nào (NOT EXISTS).",
      "tsql_code": "SELECT \n    f.FruitID, f.FruitName, f.Price\nFROM Fruits AS f\nWHERE EXISTS (\n    SELECT 1 \n    FROM Reviews AS r \n    WHERE r.FruitID = f.FruitID AND r.Rating >= 4\n);",
      "lab_sql": "SELECT f.FruitID, f.FruitName, f.Price FROM Fruits AS f WHERE EXISTS (SELECT 1 FROM Reviews AS r WHERE r.FruitID = f.FruitID AND r.Rating >= 4);",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price"
        ],
        "rows": [
          [
            3,
            "Xoài Cát Hòa Lộc",
            80000
          ],
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000
          ],
          [
            6,
            "Táo Envy",
            250000
          ]
        ]
      },
      "part1_what": "Kiểm tra sự tồn tại của ít nhất 1 dòng trong truy vấn con tương quan; dừng ngay khi tìm thấy dòng đầu tiên (short-circuit) và an toàn tuyệt đối với NULL.",
      "part2_backend": "Tìm các loại trái cây đã từng được khách hàng viết bài đánh giá (Reviews) hoặc chưa từng có đánh giá nào (NOT EXISTS).",
      "part3_tsql": "SELECT \n    f.FruitID, f.FruitName, f.Price\nFROM Fruits AS f\nWHERE EXISTS (\n    SELECT 1 \n    FROM Reviews AS r \n    WHERE r.FruitID = f.FruitID AND r.Rating >= 4\n);",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price"
        ],
        "rows": [
          [
            3,
            "Xoài Cát Hòa Lộc",
            80000
          ],
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000
          ],
          [
            6,
            "Táo Envy",
            250000
          ]
        ]
      }
    },
    {
      "id": "kw_a26",
      "part": "A",
      "category": "5. Window Functions & CTE",
      "keyword": "UNION, UNION ALL, INTERSECT & EXCEPT",
      "what_it_does": "Các toán tử tập hợp nối kết quả theo chiều dọc: UNION ALL giữ trùng và cực nhanh, UNION khử trùng, INTERSECT lấy phần giao, EXCEPT lấy phần hiệu.",
      "backend_scenario": "Dùng EXCEPT để tìm danh sách ID các loại trái cây đang bán trong cửa hàng nhưng chưa từng xuất hiện trong bất kỳ đơn hàng nào (OrderDetails) để làm chương trình dùng thử.",
      "tsql_code": "SELECT FruitID FROM Fruits\nEXCEPT\nSELECT DISTINCT FruitID FROM OrderDetails;",
      "lab_sql": "SELECT FruitID FROM Fruits EXCEPT SELECT DISTINCT FruitID FROM OrderDetails;",
      "output": {
        "cols": [
          "FruitID"
        ],
        "rows": [
          [
            11
          ],
          [
            12
          ],
          [
            13
          ],
          [
            14
          ]
        ]
      },
      "part1_what": "Các toán tử tập hợp nối kết quả theo chiều dọc: UNION ALL giữ trùng và cực nhanh, UNION khử trùng, INTERSECT lấy phần giao, EXCEPT lấy phần hiệu.",
      "part2_backend": "Dùng EXCEPT để tìm danh sách ID các loại trái cây đang bán trong cửa hàng nhưng chưa từng xuất hiện trong bất kỳ đơn hàng nào (OrderDetails) để làm chương trình dùng thử.",
      "part3_tsql": "SELECT FruitID FROM Fruits\nEXCEPT\nSELECT DISTINCT FruitID FROM OrderDetails;",
      "part4_output": {
        "cols": [
          "FruitID"
        ],
        "rows": [
          [
            11
          ],
          [
            12
          ],
          [
            13
          ],
          [
            14
          ]
        ]
      }
    },
    {
      "id": "kw_a27",
      "part": "A",
      "category": "6. Thao tác dữ liệu (DML)",
      "keyword": "INSERT INTO ... VALUES & OUTPUT inserted.*",
      "what_it_does": "Thêm một hoặc nhiều dòng mới vào bảng và dùng mệnh đề OUTPUT inserted.* để lấy ngay ID tự tăng cùng dữ liệu vừa chèn trong 1 round-trip duy nhất.",
      "backend_scenario": "Khi khách hàng bấm 'Đặt hàng', Backend chèn dòng mới vào bảng Orders và dùng OUTPUT inserted.OrderID, inserted.OrderDate trả về ngay cho C# / Java mà không cần gọi thêm câu SELECT thứ hai.",
      "tsql_code": "INSERT INTO Categories (CategoryName, Description)\nOUTPUT inserted.CategoryID, inserted.CategoryName\nVALUES (N'Quà Tết Cao Cấp', N'Giỏ quà trái cây nhập khẩu dịp Tết');",
      "lab_sql": "SELECT 6 AS CategoryID, 'Quà Tết Cao Cấp' AS CategoryName;",
      "output": {
        "cols": [
          "CategoryID",
          "CategoryName"
        ],
        "rows": [
          [
            6,
            "Quà Tết Cao Cấp"
          ]
        ]
      },
      "part1_what": "Thêm một hoặc nhiều dòng mới vào bảng và dùng mệnh đề OUTPUT inserted.* để lấy ngay ID tự tăng cùng dữ liệu vừa chèn trong 1 round-trip duy nhất.",
      "part2_backend": "Khi khách hàng bấm 'Đặt hàng', Backend chèn dòng mới vào bảng Orders và dùng OUTPUT inserted.OrderID, inserted.OrderDate trả về ngay cho C# / Java mà không cần gọi thêm câu SELECT thứ hai.",
      "part3_tsql": "INSERT INTO Categories (CategoryName, Description)\nOUTPUT inserted.CategoryID, inserted.CategoryName\nVALUES (N'Quà Tết Cao Cấp', N'Giỏ quà trái cây nhập khẩu dịp Tết');",
      "part4_output": {
        "cols": [
          "CategoryID",
          "CategoryName"
        ],
        "rows": [
          [
            6,
            "Quà Tết Cao Cấp"
          ]
        ]
      }
    },
    {
      "id": "kw_a28",
      "part": "A",
      "category": "6. Thao tác dữ liệu (DML)",
      "keyword": "UPDATE ... SET ... FROM ... JOIN",
      "what_it_does": "Cập nhật dữ liệu của bảng đích dựa trên kết quả kết nối (JOIN) với bảng khác hoặc CTE (đặc sản cực mạnh của T-SQL).",
      "backend_scenario": "Tính lại chính xác cột TotalAmount của bảng Orders bằng tổng SubTotal từ bảng OrderDetails trừ đi số tiền giảm giá của bảng Vouchers (như trong script mẫu Fruits.sql).",
      "tsql_code": "WITH OrderTotals AS (\n    SELECT OrderID, SUM(SubTotal) AS ActualTotal\n    FROM OrderDetails\n    GROUP BY OrderID\n)\nUPDATE o\nSET o.TotalAmount = ot.ActualTotal - ISNULL(v.DiscountAmount, 0)\nFROM Orders AS o\nINNER JOIN OrderTotals AS ot ON o.OrderID = ot.OrderID\nLEFT JOIN Vouchers AS v ON o.VoucherID = v.VoucherID;",
      "lab_sql": "SELECT o.OrderID, SUM(od.SubTotal) AS ActualTotal, COALESCE(v.DiscountAmount, 0) AS Discount, o.TotalAmount FROM Orders o JOIN OrderDetails od ON o.OrderID = od.OrderID LEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID WHERE o.OrderID <= 5 GROUP BY o.OrderID, v.DiscountAmount, o.TotalAmount;",
      "output": {
        "cols": [
          "OrderID",
          "ActualTotal",
          "Discount",
          "TotalAmount"
        ],
        "rows": [
          [
            1,
            850000,
            0,
            850000
          ],
          [
            2,
            230000,
            50000,
            180000
          ],
          [
            3,
            150000,
            0,
            150000
          ],
          [
            4,
            950000,
            100000,
            850000
          ],
          [
            5,
            2600000,
            100000,
            2500000
          ]
        ]
      },
      "part1_what": "Cập nhật dữ liệu của bảng đích dựa trên kết quả kết nối (JOIN) với bảng khác hoặc CTE (đặc sản cực mạnh của T-SQL).",
      "part2_backend": "Tính lại chính xác cột TotalAmount của bảng Orders bằng tổng SubTotal từ bảng OrderDetails trừ đi số tiền giảm giá của bảng Vouchers (như trong script mẫu Fruits.sql).",
      "part3_tsql": "WITH OrderTotals AS (\n    SELECT OrderID, SUM(SubTotal) AS ActualTotal\n    FROM OrderDetails\n    GROUP BY OrderID\n)\nUPDATE o\nSET o.TotalAmount = ot.ActualTotal - ISNULL(v.DiscountAmount, 0)\nFROM Orders AS o\nINNER JOIN OrderTotals AS ot ON o.OrderID = ot.OrderID\nLEFT JOIN Vouchers AS v ON o.VoucherID = v.VoucherID;",
      "part4_output": {
        "cols": [
          "OrderID",
          "ActualTotal",
          "Discount",
          "TotalAmount"
        ],
        "rows": [
          [
            1,
            850000,
            0,
            850000
          ],
          [
            2,
            230000,
            50000,
            180000
          ],
          [
            3,
            150000,
            0,
            150000
          ],
          [
            4,
            950000,
            100000,
            850000
          ],
          [
            5,
            2600000,
            100000,
            2500000
          ]
        ]
      }
    },
    {
      "id": "kw_a29",
      "part": "A",
      "category": "6. Thao tác dữ liệu (DML)",
      "keyword": "DELETE vs TRUNCATE TABLE",
      "what_it_does": "DELETE xóa từng dòng thỏa điều kiện WHERE (ghi log chi tiết, kích hoạt Trigger); TRUNCATE giải phóng toàn bộ trang dữ liệu cực nhanh và reset IDENTITY.",
      "backend_scenario": "Trong thực tế sản xuất (Production), các bảng nghiệp vụ như Fruits hay Employees thường ưu tiên xóa mềm (Soft Delete bằng cột IsActive = 0) thay vì DELETE cứng để bảo toàn lịch sử đơn hàng.",
      "tsql_code": "-- Xóa cứng các đánh giá rác (nếu có):\nDELETE FROM Reviews WHERE Rating < 1;\n\n-- Xóa mềm sản phẩm ngừng kinh doanh:\nUPDATE Fruits SET IsActive = 0 WHERE StockQuantity = 0;",
      "lab_sql": "SELECT FruitID, FruitName, StockQuantity, IsActive FROM Fruits WHERE StockQuantity = 0;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "StockQuantity",
          "IsActive"
        ],
        "rows": [
          [
            11,
            "Mâm Xôi Đen",
            0,
            1
          ]
        ]
      },
      "part1_what": "DELETE xóa từng dòng thỏa điều kiện WHERE (ghi log chi tiết, kích hoạt Trigger); TRUNCATE giải phóng toàn bộ trang dữ liệu cực nhanh và reset IDENTITY.",
      "part2_backend": "Trong thực tế sản xuất (Production), các bảng nghiệp vụ như Fruits hay Employees thường ưu tiên xóa mềm (Soft Delete bằng cột IsActive = 0) thay vì DELETE cứng để bảo toàn lịch sử đơn hàng.",
      "part3_tsql": "-- Xóa cứng các đánh giá rác (nếu có):\nDELETE FROM Reviews WHERE Rating < 1;\n\n-- Xóa mềm sản phẩm ngừng kinh doanh:\nUPDATE Fruits SET IsActive = 0 WHERE StockQuantity = 0;",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "StockQuantity",
          "IsActive"
        ],
        "rows": [
          [
            11,
            "Mâm Xôi Đen",
            0,
            1
          ]
        ]
      }
    },
    {
      "id": "kw_a30",
      "part": "A",
      "category": "6. Thao tác dữ liệu (DML)",
      "keyword": "MERGE (Upsert: Insert hoặc Update)",
      "what_it_does": "Đồng bộ bảng đích từ bảng nguồn trong một câu lệnh nguyên tử: nếu khớp khóa (WHEN MATCHED) thì UPDATE, nếu chưa có (WHEN NOT MATCHED) thì INSERT.",
      "backend_scenario": "Khi nhà cung cấp gửi bảng báo giá và số lượng nhập kho mới mỗi sáng, Backend dùng MERGE để tự động cộng dồn tồn kho cho trái cây đã có và thêm mới trái cây chưa có.",
      "tsql_code": "MERGE INTO Fruits AS target\nUSING (VALUES (1, N'Sầu Riêng Ri6', 155000, 20)) AS src(FruitID, FruitName, NewPrice, AddStock)\nON target.FruitID = src.FruitID\nWHEN MATCHED THEN\n    UPDATE SET target.Price = src.NewPrice,\n               target.StockQuantity = target.StockQuantity + src.AddStock\nWHEN NOT MATCHED BY TARGET THEN\n    INSERT (CategoryID, FruitName, Price, StockQuantity)\n    VALUES (1, src.FruitName, src.NewPrice, src.AddStock);",
      "lab_sql": "SELECT FruitID, FruitName, Price, StockQuantity FROM Fruits WHERE FruitID = 1;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "StockQuantity"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            150000,
            50
          ]
        ]
      },
      "part1_what": "Đồng bộ bảng đích từ bảng nguồn trong một câu lệnh nguyên tử: nếu khớp khóa (WHEN MATCHED) thì UPDATE, nếu chưa có (WHEN NOT MATCHED) thì INSERT.",
      "part2_backend": "Khi nhà cung cấp gửi bảng báo giá và số lượng nhập kho mới mỗi sáng, Backend dùng MERGE để tự động cộng dồn tồn kho cho trái cây đã có và thêm mới trái cây chưa có.",
      "part3_tsql": "MERGE INTO Fruits AS target\nUSING (VALUES (1, N'Sầu Riêng Ri6', 155000, 20)) AS src(FruitID, FruitName, NewPrice, AddStock)\nON target.FruitID = src.FruitID\nWHEN MATCHED THEN\n    UPDATE SET target.Price = src.NewPrice,\n               target.StockQuantity = target.StockQuantity + src.AddStock\nWHEN NOT MATCHED BY TARGET THEN\n    INSERT (CategoryID, FruitName, Price, StockQuantity)\n    VALUES (1, src.FruitName, src.NewPrice, src.AddStock);",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "StockQuantity"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            150000,
            50
          ]
        ]
      }
    },
    {
      "id": "kw_a31",
      "part": "A",
      "category": "7. DDL, Ràng buộc & Index",
      "keyword": "CREATE, ALTER, DROP TABLE & CONSTRAINTS",
      "what_it_does": "Định nghĩa cấu trúc bảng cùng 5 loại ràng buộc toàn vẹn: PRIMARY KEY, FOREIGN KEY (ON DELETE CASCADE), UNIQUE, CHECK và DEFAULT.",
      "backend_scenario": "Thiết kế bảng Vouchers trong DB FruitStore: mã VoucherCode phải UNIQUE, số lần đã dùng UsedCount không bao giờ được vượt quá UsageLimit (ràng buộc CHECK trực tiếp ở tầng DB).",
      "tsql_code": "CREATE TABLE Vouchers (\n    VoucherID INT IDENTITY(1,1) CONSTRAINT PK_Vouchers PRIMARY KEY,\n    VoucherCode VARCHAR(50) CONSTRAINT UQ_Vouchers_Code UNIQUE NOT NULL,\n    DiscountAmount DECIMAL(18, 2) NOT NULL,\n    UsageLimit INT NOT NULL,\n    UsedCount INT NOT NULL CONSTRAINT DF_Vouchers_UsedCount DEFAULT 0,\n    CONSTRAINT CK_Vouchers_Usage CHECK (UsedCount <= UsageLimit)\n);",
      "lab_sql": "SELECT VoucherID, VoucherCode, DiscountAmount, MinOrderValue, UsageLimit, UsedCount, ExpiryDate FROM Vouchers;",
      "output": {
        "cols": [
          "VoucherID",
          "VoucherCode",
          "DiscountAmount",
          "MinOrderValue",
          "UsageLimit",
          "UsedCount",
          "ExpiryDate"
        ],
        "rows": [
          [
            1,
            "WELCOME50",
            50000,
            200000,
            1000,
            250,
            "2025-12-31"
          ],
          [
            2,
            "VIP100",
            100000,
            500000,
            100,
            5,
            "2025-12-31"
          ],
          [
            3,
            "HETHAN",
            30000,
            100000,
            500,
            500,
            "2023-12-31"
          ]
        ]
      },
      "part1_what": "Định nghĩa cấu trúc bảng cùng 5 loại ràng buộc toàn vẹn: PRIMARY KEY, FOREIGN KEY (ON DELETE CASCADE), UNIQUE, CHECK và DEFAULT.",
      "part2_backend": "Thiết kế bảng Vouchers trong DB FruitStore: mã VoucherCode phải UNIQUE, số lần đã dùng UsedCount không bao giờ được vượt quá UsageLimit (ràng buộc CHECK trực tiếp ở tầng DB).",
      "part3_tsql": "CREATE TABLE Vouchers (\n    VoucherID INT IDENTITY(1,1) CONSTRAINT PK_Vouchers PRIMARY KEY,\n    VoucherCode VARCHAR(50) CONSTRAINT UQ_Vouchers_Code UNIQUE NOT NULL,\n    DiscountAmount DECIMAL(18, 2) NOT NULL,\n    UsageLimit INT NOT NULL,\n    UsedCount INT NOT NULL CONSTRAINT DF_Vouchers_UsedCount DEFAULT 0,\n    CONSTRAINT CK_Vouchers_Usage CHECK (UsedCount <= UsageLimit)\n);",
      "part4_output": {
        "cols": [
          "VoucherID",
          "VoucherCode",
          "DiscountAmount",
          "MinOrderValue",
          "UsageLimit",
          "UsedCount",
          "ExpiryDate"
        ],
        "rows": [
          [
            1,
            "WELCOME50",
            50000,
            200000,
            1000,
            250,
            "2025-12-31"
          ],
          [
            2,
            "VIP100",
            100000,
            500000,
            100,
            5,
            "2025-12-31"
          ],
          [
            3,
            "HETHAN",
            30000,
            100000,
            500,
            500,
            "2023-12-31"
          ]
        ]
      }
    },
    {
      "id": "kw_a32",
      "part": "A",
      "category": "7. DDL, Ràng buộc & Index",
      "keyword": "IDENTITY(1,1), SEQUENCE & SCOPE_IDENTITY()",
      "what_it_does": "Sinh khóa chính số nguyên tự động tăng; SCOPE_IDENTITY() trả về giá trị IDENTITY vừa sinh ra trong đúng phạm vi (scope) hiện tại, không bị nhiễu bởi Trigger.",
      "backend_scenario": "Trong ADO.NET hoặc Dapper khi không dùng OUTPUT, lập trình viên nối thêm SELECT SCOPE_IDENTITY() ngay sau câu lệnh INSERT để lấy ID của đơn hàng vừa tạo.",
      "tsql_code": "INSERT INTO Customers (FullName, PhoneNumber, CustomerType)\nVALUES (N'Lệnh Hồ Xung', '0909999888', N'Standard');\n\nSELECT SCOPE_IDENTITY() AS NewCustomerID;",
      "lab_sql": "SELECT MAX(CustomerID) AS LastCustomerID, COUNT(*) AS TotalCustomers FROM Customers;",
      "output": {
        "cols": [
          "LastCustomerID",
          "TotalCustomers"
        ],
        "rows": [
          [
            8,
            8
          ]
        ]
      },
      "part1_what": "Sinh khóa chính số nguyên tự động tăng; SCOPE_IDENTITY() trả về giá trị IDENTITY vừa sinh ra trong đúng phạm vi (scope) hiện tại, không bị nhiễu bởi Trigger.",
      "part2_backend": "Trong ADO.NET hoặc Dapper khi không dùng OUTPUT, lập trình viên nối thêm SELECT SCOPE_IDENTITY() ngay sau câu lệnh INSERT để lấy ID của đơn hàng vừa tạo.",
      "part3_tsql": "INSERT INTO Customers (FullName, PhoneNumber, CustomerType)\nVALUES (N'Lệnh Hồ Xung', '0909999888', N'Standard');\n\nSELECT SCOPE_IDENTITY() AS NewCustomerID;",
      "part4_output": {
        "cols": [
          "LastCustomerID",
          "TotalCustomers"
        ],
        "rows": [
          [
            8,
            8
          ]
        ]
      }
    },
    {
      "id": "kw_a33",
      "part": "A",
      "category": "7. DDL, Ràng buộc & Index",
      "keyword": "CREATE INDEX (CLUSTERED, NONCLUSTERED, INCLUDE, WHERE)",
      "what_it_does": "Tạo chỉ mục B+Tree giúp tăng tốc tìm kiếm (Index Seek); mệnh đề INCLUDE đính kèm cột vào nút lá để tạo Covering Index (khử Key Lookup), mệnh đề WHERE tạo Filtered Index.",
      "backend_scenario": "Tối ưu truy vấn tra cứu đơn hàng theo CustomerID và Status: tạo Covering Index trên (CustomerID, Status) INCLUDE (TotalAmount, OrderDate) để đọc thẳng từ Index mà không cần quay về bảng gốc.",
      "tsql_code": "CREATE NONCLUSTERED INDEX IX_Orders_Customer_Status\nON Orders (CustomerID ASC, Status ASC)\nINCLUDE (OrderDate, TotalAmount)\nWHERE Status IN (N'Chờ xử lý', N'Đang giao');",
      "lab_sql": "SELECT OrderID, CustomerID, Status, OrderDate, TotalAmount FROM Orders WHERE CustomerID = 1 AND Status IN ('Đã giao', 'Đang giao');",
      "output": {
        "cols": [
          "OrderID",
          "CustomerID",
          "Status",
          "OrderDate",
          "TotalAmount"
        ],
        "rows": [
          [
            1,
            1,
            "Đã giao",
            "2023-02-14 10:15:00",
            850000
          ],
          [
            5,
            1,
            "Đã giao",
            "2023-12-24 19:00:00",
            2500000
          ],
          [
            8,
            1,
            "Đang giao",
            "2024-03-01 15:10:00",
            200000
          ]
        ]
      },
      "part1_what": "Tạo chỉ mục B+Tree giúp tăng tốc tìm kiếm (Index Seek); mệnh đề INCLUDE đính kèm cột vào nút lá để tạo Covering Index (khử Key Lookup), mệnh đề WHERE tạo Filtered Index.",
      "part2_backend": "Tối ưu truy vấn tra cứu đơn hàng theo CustomerID và Status: tạo Covering Index trên (CustomerID, Status) INCLUDE (TotalAmount, OrderDate) để đọc thẳng từ Index mà không cần quay về bảng gốc.",
      "part3_tsql": "CREATE NONCLUSTERED INDEX IX_Orders_Customer_Status\nON Orders (CustomerID ASC, Status ASC)\nINCLUDE (OrderDate, TotalAmount)\nWHERE Status IN (N'Chờ xử lý', N'Đang giao');",
      "part4_output": {
        "cols": [
          "OrderID",
          "CustomerID",
          "Status",
          "OrderDate",
          "TotalAmount"
        ],
        "rows": [
          [
            1,
            1,
            "Đã giao",
            "2023-02-14 10:15:00",
            850000
          ],
          [
            5,
            1,
            "Đã giao",
            "2023-12-24 19:00:00",
            2500000
          ],
          [
            8,
            1,
            "Đang giao",
            "2024-03-01 15:10:00",
            200000
          ]
        ]
      }
    },
    {
      "id": "kw_a34",
      "part": "A",
      "category": "8. Đối tượng Lập trình T-SQL",
      "keyword": "CREATE VIEW (WITH SCHEMABINDING)",
      "what_it_does": "Đóng gói một câu truy vấn SELECT phức tạp thành một bảng ảo để tái sử dụng và phân quyền; WITH SCHEMABINDING khóa lược đồ bảng gốc không cho sửa cột làm hỏng View.",
      "backend_scenario": "Tạo View v_FruitCatalog kết hợp sẵn bảng Fruits và Categories để các dịch vụ báo cáo hoặc API đọc trực tiếp mà không phải viết lại câu JOIN nhiều lần.",
      "tsql_code": "CREATE OR ALTER VIEW dbo.v_FruitCatalog\nWITH SCHEMABINDING\nAS\nSELECT \n    f.FruitID, f.FruitName, c.CategoryName, f.Price, f.StockQuantity, f.Origin\nFROM dbo.Fruits AS f\nINNER JOIN dbo.Categories AS c ON f.CategoryID = c.CategoryID\nWHERE f.IsActive = 1;",
      "lab_sql": "SELECT f.FruitID, f.FruitName, c.CategoryName, f.Price, f.StockQuantity, f.Origin FROM Fruits AS f INNER JOIN Categories AS c ON f.CategoryID = c.CategoryID WHERE f.IsActive = 1 LIMIT 4;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "CategoryName",
          "Price",
          "StockQuantity",
          "Origin"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            "Đặc sản Miền Tây",
            150000,
            50,
            "Bến Tre"
          ],
          [
            2,
            "Bưởi Da Xanh",
            "Đặc sản Miền Tây",
            70000,
            120,
            "Bến Tre"
          ],
          [
            3,
            "Xoài Cát Hòa Lộc",
            "Đặc sản Miền Tây",
            80000,
            200,
            "Tiền Giang"
          ],
          [
            4,
            "Măng Cụt Lái Thiêu",
            "Đặc sản Miền Tây",
            95000,
            80,
            "Bình Dương"
          ]
        ]
      },
      "part1_what": "Đóng gói một câu truy vấn SELECT phức tạp thành một bảng ảo để tái sử dụng và phân quyền; WITH SCHEMABINDING khóa lược đồ bảng gốc không cho sửa cột làm hỏng View.",
      "part2_backend": "Tạo View v_FruitCatalog kết hợp sẵn bảng Fruits và Categories để các dịch vụ báo cáo hoặc API đọc trực tiếp mà không phải viết lại câu JOIN nhiều lần.",
      "part3_tsql": "CREATE OR ALTER VIEW dbo.v_FruitCatalog\nWITH SCHEMABINDING\nAS\nSELECT \n    f.FruitID, f.FruitName, c.CategoryName, f.Price, f.StockQuantity, f.Origin\nFROM dbo.Fruits AS f\nINNER JOIN dbo.Categories AS c ON f.CategoryID = c.CategoryID\nWHERE f.IsActive = 1;",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "CategoryName",
          "Price",
          "StockQuantity",
          "Origin"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            "Đặc sản Miền Tây",
            150000,
            50,
            "Bến Tre"
          ],
          [
            2,
            "Bưởi Da Xanh",
            "Đặc sản Miền Tây",
            70000,
            120,
            "Bến Tre"
          ],
          [
            3,
            "Xoài Cát Hòa Lộc",
            "Đặc sản Miền Tây",
            80000,
            200,
            "Tiền Giang"
          ],
          [
            4,
            "Măng Cụt Lái Thiêu",
            "Đặc sản Miền Tây",
            95000,
            80,
            "Bình Dương"
          ]
        ]
      }
    },
    {
      "id": "kw_a35",
      "part": "A",
      "category": "8. Đối tượng Lập trình T-SQL",
      "keyword": "CREATE PROCEDURE & EXEC (Stored Procedure)",
      "what_it_does": "Đóng gói chuỗi logic nghiệp vụ và câu lệnh SQL có tham số đầu vào/đầu ra trên Server, giúp tái sử dụng Execution Plan và giảm băng thông mạng.",
      "backend_scenario": "Viết Stored Procedure usp_GetCustomerOrderSummary nhận vào @CustomerID để trả về lịch sử đơn hàng của khách đó cho ứng dụng C# / Java gọi qua CommandType.StoredProcedure.",
      "tsql_code": "CREATE OR ALTER PROCEDURE dbo.usp_GetCustomerOrders\n    @CustomerID INT\nAS\nBEGIN\n    SET NOCOUNT ON;\n    SELECT OrderID, OrderDate, TotalAmount, Status\n    FROM dbo.Orders\n    WHERE CustomerID = @CustomerID\n    ORDER BY OrderDate DESC;\nEND;\nGO\nEXEC dbo.usp_GetCustomerOrders @CustomerID = 1;",
      "lab_sql": "SELECT OrderID, OrderDate, TotalAmount, Status FROM Orders WHERE CustomerID = 1 ORDER BY OrderDate DESC;",
      "output": {
        "cols": [
          "OrderID",
          "OrderDate",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            8,
            "2024-03-01 15:10:00",
            200000,
            "Đang giao"
          ],
          [
            5,
            "2023-12-24 19:00:00",
            2500000,
            "Đã giao"
          ],
          [
            1,
            "2023-02-14 10:15:00",
            850000,
            "Đã giao"
          ]
        ]
      },
      "part1_what": "Đóng gói chuỗi logic nghiệp vụ và câu lệnh SQL có tham số đầu vào/đầu ra trên Server, giúp tái sử dụng Execution Plan và giảm băng thông mạng.",
      "part2_backend": "Viết Stored Procedure usp_GetCustomerOrderSummary nhận vào @CustomerID để trả về lịch sử đơn hàng của khách đó cho ứng dụng C# / Java gọi qua CommandType.StoredProcedure.",
      "part3_tsql": "CREATE OR ALTER PROCEDURE dbo.usp_GetCustomerOrders\n    @CustomerID INT\nAS\nBEGIN\n    SET NOCOUNT ON;\n    SELECT OrderID, OrderDate, TotalAmount, Status\n    FROM dbo.Orders\n    WHERE CustomerID = @CustomerID\n    ORDER BY OrderDate DESC;\nEND;\nGO\nEXEC dbo.usp_GetCustomerOrders @CustomerID = 1;",
      "part4_output": {
        "cols": [
          "OrderID",
          "OrderDate",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            8,
            "2024-03-01 15:10:00",
            200000,
            "Đang giao"
          ],
          [
            5,
            "2023-12-24 19:00:00",
            2500000,
            "Đã giao"
          ],
          [
            1,
            "2023-02-14 10:15:00",
            850000,
            "Đã giao"
          ]
        ]
      }
    },
    {
      "id": "kw_a36",
      "part": "A",
      "category": "8. Đối tượng Lập trình T-SQL",
      "keyword": "CREATE FUNCTION (Inline Table-Valued Function - iTVF)",
      "what_it_does": "Tạo hàm trả về một bảng chỉ gồm một câu lệnh RETURN SELECT (...); SQL Server tối ưu hóa iTVF giống hệt như một View có tham số (Parameterised View) cực nhanh.",
      "backend_scenario": "Tránh viết Scalar UDF tính tổng tiền từng đơn trong mệnh đề SELECT (vì bị chạy lặp từng dòng RBAR làm treo DB); thay vào đó hãy viết Inline TVF để bộ tối ưu hóa bung trực tiếp vào kế hoạch thực thi.",
      "tsql_code": "CREATE OR ALTER FUNCTION dbo.fn_GetFruitsByOrigin (@Origin NVARCHAR(100))\nRETURNS TABLE\nAS\nRETURN (\n    SELECT FruitID, FruitName, Price, StockQuantity\n    FROM dbo.Fruits\n    WHERE Origin = @Origin\n);\nGO\nSELECT * FROM dbo.fn_GetFruitsByOrigin(N'Bến Tre');",
      "lab_sql": "SELECT FruitID, FruitName, Price, StockQuantity FROM Fruits WHERE Origin = 'Bến Tre';",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "StockQuantity"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            150000,
            50
          ],
          [
            2,
            "Bưởi Da Xanh",
            70000,
            120
          ]
        ]
      },
      "part1_what": "Tạo hàm trả về một bảng chỉ gồm một câu lệnh RETURN SELECT (...); SQL Server tối ưu hóa iTVF giống hệt như một View có tham số (Parameterised View) cực nhanh.",
      "part2_backend": "Tránh viết Scalar UDF tính tổng tiền từng đơn trong mệnh đề SELECT (vì bị chạy lặp từng dòng RBAR làm treo DB); thay vào đó hãy viết Inline TVF để bộ tối ưu hóa bung trực tiếp vào kế hoạch thực thi.",
      "part3_tsql": "CREATE OR ALTER FUNCTION dbo.fn_GetFruitsByOrigin (@Origin NVARCHAR(100))\nRETURNS TABLE\nAS\nRETURN (\n    SELECT FruitID, FruitName, Price, StockQuantity\n    FROM dbo.Fruits\n    WHERE Origin = @Origin\n);\nGO\nSELECT * FROM dbo.fn_GetFruitsByOrigin(N'Bến Tre');",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "StockQuantity"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            150000,
            50
          ],
          [
            2,
            "Bưởi Da Xanh",
            70000,
            120
          ]
        ]
      }
    },
    {
      "id": "kw_a37",
      "part": "A",
      "category": "8. Đối tượng Lập trình T-SQL",
      "keyword": "CREATE TRIGGER & Bảng ảo inserted / deleted",
      "what_it_does": "Tự động kích hoạt khi có sự kiện INSERT, UPDATE hoặc DELETE trên bảng; luôn phải viết theo tập hợp (Set-based) dựa trên 2 bảng ảo inserted và deleted.",
      "backend_scenario": "Ghi log kiểm toán (Audit Log) hoặc tự động trừ tồn kho bảng Fruits khi có dòng mới chèn vào OrderDetails (Lưu ý: Trigger chạy theo lệnh, nên phải JOIN với bảng inserted chứ không gán biến đơn lẻ!).",
      "tsql_code": "CREATE OR ALTER TRIGGER trg_DeductFruitStock\nON dbo.OrderDetails\nAFTER INSERT\nAS\nBEGIN\n    SET NOCOUNT ON;\n    UPDATE f\n    SET f.StockQuantity = f.StockQuantity - i.TotalQty\n    FROM dbo.Fruits AS f\n    INNER JOIN (\n        SELECT FruitID, SUM(Quantity) AS TotalQty\n        FROM inserted\n        GROUP BY FruitID\n    ) AS i ON f.FruitID = i.FruitID;\nEND;",
      "lab_sql": "SELECT f.FruitID, f.FruitName, f.StockQuantity AS TonKhoHienTai, SUM(od.Quantity) AS TongDaBan FROM Fruits f JOIN OrderDetails od ON f.FruitID = od.FruitID GROUP BY f.FruitID, f.FruitName, f.StockQuantity ORDER BY f.FruitID LIMIT 4;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "TonKhoHienTai",
          "TongDaBan"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            50,
            1
          ],
          [
            2,
            "Bưởi Da Xanh",
            120,
            1
          ],
          [
            3,
            "Xoài Cát Hòa Lộc",
            200,
            2
          ],
          [
            4,
            "Măng Cụt Lái Thiêu",
            80,
            1
          ]
        ]
      },
      "part1_what": "Tự động kích hoạt khi có sự kiện INSERT, UPDATE hoặc DELETE trên bảng; luôn phải viết theo tập hợp (Set-based) dựa trên 2 bảng ảo inserted và deleted.",
      "part2_backend": "Ghi log kiểm toán (Audit Log) hoặc tự động trừ tồn kho bảng Fruits khi có dòng mới chèn vào OrderDetails (Lưu ý: Trigger chạy theo lệnh, nên phải JOIN với bảng inserted chứ không gán biến đơn lẻ!).",
      "part3_tsql": "CREATE OR ALTER TRIGGER trg_DeductFruitStock\nON dbo.OrderDetails\nAFTER INSERT\nAS\nBEGIN\n    SET NOCOUNT ON;\n    UPDATE f\n    SET f.StockQuantity = f.StockQuantity - i.TotalQty\n    FROM dbo.Fruits AS f\n    INNER JOIN (\n        SELECT FruitID, SUM(Quantity) AS TotalQty\n        FROM inserted\n        GROUP BY FruitID\n    ) AS i ON f.FruitID = i.FruitID;\nEND;",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "TonKhoHienTai",
          "TongDaBan"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            50,
            1
          ],
          [
            2,
            "Bưởi Da Xanh",
            120,
            1
          ],
          [
            3,
            "Xoài Cát Hòa Lộc",
            200,
            2
          ],
          [
            4,
            "Măng Cụt Lái Thiêu",
            80,
            1
          ]
        ]
      }
    },
    {
      "id": "kw_a38",
      "part": "A",
      "category": "9. Giao dịch, Lỗi & Khóa (Transactions)",
      "keyword": "BEGIN TRAN, COMMIT, ROLLBACK, TRY...CATCH & XACT_ABORT",
      "what_it_does": "Đảm bảo tính nguyên tử (Atomicity - ACID) cho chuỗi thao tác ghi; SET XACT_ABORT ON kết hợp TRY...CATCH giúp tự động hủy giao dịch sạch sẽ khi có bất kỳ lỗi runtime nào.",
      "backend_scenario": "Quy trình thanh toán đơn hàng: (1) Trừ số lượng tồn kho bảng Fruits, (2) Tăng UsedCount của bảng Vouchers, (3) Ghi nhận giao dịch vào PaymentTransactions. Nếu 1 bước lỗi (ví dụ hết kho hoặc hết lượt voucher), toàn bộ phải ROLLBACK.",
      "tsql_code": "SET XACT_ABORT ON;\nBEGIN TRY\n    BEGIN TRANSACTION;\n        UPDATE Fruits SET StockQuantity = StockQuantity - 1 WHERE FruitID = 5;\n        UPDATE Vouchers SET UsedCount = UsedCount + 1 WHERE VoucherID = 2;\n        INSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount)\n        VALUES (9, N'VNPAY', 400000);\n    COMMIT TRANSACTION;\nEND TRY\nBEGIN CATCH\n    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;\n    THROW;\nEND CATCH;",
      "lab_sql": "SELECT TransactionID, OrderID, PaymentMethod, Amount, PaymentDate FROM PaymentTransactions ORDER BY TransactionID;",
      "output": {
        "cols": [
          "TransactionID",
          "OrderID",
          "PaymentMethod",
          "Amount",
          "PaymentDate"
        ],
        "rows": [
          [
            1,
            1,
            "VNPAY",
            850000,
            "2023-02-14 10:16:00"
          ],
          [
            2,
            2,
            "Tiền mặt",
            200000,
            "2023-04-20 14:30:00"
          ],
          [
            3,
            3,
            "Momo",
            150000,
            "2023-06-15 09:02:00"
          ],
          [
            4,
            4,
            "VNPAY",
            850000,
            "2023-08-08 16:47:00"
          ],
          [
            5,
            5,
            "VNPAY",
            2500000,
            "2023-12-24 19:05:00"
          ],
          [
            6,
            6,
            "Momo",
            300000,
            "2024-01-10 08:35:00"
          ]
        ]
      },
      "part1_what": "Đảm bảo tính nguyên tử (Atomicity - ACID) cho chuỗi thao tác ghi; SET XACT_ABORT ON kết hợp TRY...CATCH giúp tự động hủy giao dịch sạch sẽ khi có bất kỳ lỗi runtime nào.",
      "part2_backend": "Quy trình thanh toán đơn hàng: (1) Trừ số lượng tồn kho bảng Fruits, (2) Tăng UsedCount của bảng Vouchers, (3) Ghi nhận giao dịch vào PaymentTransactions. Nếu 1 bước lỗi (ví dụ hết kho hoặc hết lượt voucher), toàn bộ phải ROLLBACK.",
      "part3_tsql": "SET XACT_ABORT ON;\nBEGIN TRY\n    BEGIN TRANSACTION;\n        UPDATE Fruits SET StockQuantity = StockQuantity - 1 WHERE FruitID = 5;\n        UPDATE Vouchers SET UsedCount = UsedCount + 1 WHERE VoucherID = 2;\n        INSERT INTO PaymentTransactions (OrderID, PaymentMethod, Amount)\n        VALUES (9, N'VNPAY', 400000);\n    COMMIT TRANSACTION;\nEND TRY\nBEGIN CATCH\n    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;\n    THROW;\nEND CATCH;",
      "part4_output": {
        "cols": [
          "TransactionID",
          "OrderID",
          "PaymentMethod",
          "Amount",
          "PaymentDate"
        ],
        "rows": [
          [
            1,
            1,
            "VNPAY",
            850000,
            "2023-02-14 10:16:00"
          ],
          [
            2,
            2,
            "Tiền mặt",
            200000,
            "2023-04-20 14:30:00"
          ],
          [
            3,
            3,
            "Momo",
            150000,
            "2023-06-15 09:02:00"
          ],
          [
            4,
            4,
            "VNPAY",
            850000,
            "2023-08-08 16:47:00"
          ],
          [
            5,
            5,
            "VNPAY",
            2500000,
            "2023-12-24 19:05:00"
          ],
          [
            6,
            6,
            "Momo",
            300000,
            "2024-01-10 08:35:00"
          ]
        ]
      }
    },
    {
      "id": "kw_a39",
      "part": "A",
      "category": "9. Giao dịch, Lỗi & Khóa (Transactions)",
      "keyword": "WITH (UPDLOCK, ROWLOCK, READPAST)",
      "what_it_does": "Gợi ý khóa (Lock Hints) đặt khóa cập nhật ở cấp độ dòng ngay khi đọc để chống điều kiện tranh chấp (Race Condition / Lost Update) và tránh Deadlock khi nhiều request cùng mua 1 mặt hàng.",
      "backend_scenario": "Trong dịp Flash Sale Nho Mẫu Đơn Shine Muscat (chỉ còn 15 chùm), 50 khách bấm mua cùng lúc. Dùng WITH (UPDLOCK, ROWLOCK) khi đọc kiểm tra tồn kho để xếp hàng tuần tự các giao dịch trên đúng dòng FruitID = 5.",
      "tsql_code": "BEGIN TRANSACTION;\n\nSELECT FruitID, FruitName, StockQuantity\nFROM Fruits WITH (UPDLOCK, ROWLOCK)\nWHERE FruitID = 5 AND StockQuantity >= 1;\n\n-- Sau khi giữ khóa UPDLOCK thành công mới tiến hành trừ kho:\n-- UPDATE Fruits SET StockQuantity = StockQuantity - 1 WHERE FruitID = 5;\nCOMMIT TRANSACTION;",
      "lab_sql": "SELECT FruitID, FruitName, StockQuantity, Price FROM Fruits WHERE FruitID = 5;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "StockQuantity",
          "Price"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            15,
            850000
          ]
        ]
      },
      "part1_what": "Gợi ý khóa (Lock Hints) đặt khóa cập nhật ở cấp độ dòng ngay khi đọc để chống điều kiện tranh chấp (Race Condition / Lost Update) và tránh Deadlock khi nhiều request cùng mua 1 mặt hàng.",
      "part2_backend": "Trong dịp Flash Sale Nho Mẫu Đơn Shine Muscat (chỉ còn 15 chùm), 50 khách bấm mua cùng lúc. Dùng WITH (UPDLOCK, ROWLOCK) khi đọc kiểm tra tồn kho để xếp hàng tuần tự các giao dịch trên đúng dòng FruitID = 5.",
      "part3_tsql": "BEGIN TRANSACTION;\n\nSELECT FruitID, FruitName, StockQuantity\nFROM Fruits WITH (UPDLOCK, ROWLOCK)\nWHERE FruitID = 5 AND StockQuantity >= 1;\n\n-- Sau khi giữ khóa UPDLOCK thành công mới tiến hành trừ kho:\n-- UPDATE Fruits SET StockQuantity = StockQuantity - 1 WHERE FruitID = 5;\nCOMMIT TRANSACTION;",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "StockQuantity",
          "Price"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            15,
            850000
          ]
        ]
      }
    },
    {
      "id": "kw_a40",
      "part": "A",
      "category": "10. JSON, Chuỗi, Ngày tháng & Bảng tạm",
      "keyword": "JSON_VALUE, JSON_QUERY, OPENJSON & FOR JSON PATH",
      "what_it_does": "Bộ công cụ xử lý dữ liệu bán cấu trúc JSON tích hợp sẵn trong T-SQL: trích xuất thuộc tính vô hướng (JSON_VALUE), bung mảng JSON thành dòng (OPENJSON) và xuất bảng ra JSON.",
      "backend_scenario": "Cột AttributesJSON của bảng Fruits lưu linh hoạt độ ngọt, màu sắc và danh sách Vitamin của từng loại trái cây. Backend dùng JSON_VALUE để lọc các loại trái cây có vị ngọt ('Sweet').",
      "tsql_code": "SELECT \n    FruitID,\n    FruitName,\n    JSON_VALUE(AttributesJSON, '$.Taste') AS ViTraiCay,\n    JSON_VALUE(AttributesJSON, '$.Color') AS MauSac\nFROM Fruits\nWHERE JSON_VALUE(AttributesJSON, '$.Taste') = 'Sweet';",
      "lab_sql": "SELECT FruitID, FruitName, json_extract(AttributesJSON, '$.Taste') AS ViTraiCay, json_extract(AttributesJSON, '$.Color') AS MauSac FROM Fruits WHERE json_extract(AttributesJSON, '$.Taste') = 'Sweet';",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "ViTraiCay",
          "MauSac"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            "Sweet",
            "Yellow"
          ],
          [
            3,
            "Xoài Cát Hòa Lộc",
            "Sweet",
            null
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            "Sweet",
            "Dark Red"
          ]
        ]
      },
      "part1_what": "Bộ công cụ xử lý dữ liệu bán cấu trúc JSON tích hợp sẵn trong T-SQL: trích xuất thuộc tính vô hướng (JSON_VALUE), bung mảng JSON thành dòng (OPENJSON) và xuất bảng ra JSON.",
      "part2_backend": "Cột AttributesJSON của bảng Fruits lưu linh hoạt độ ngọt, màu sắc và danh sách Vitamin của từng loại trái cây. Backend dùng JSON_VALUE để lọc các loại trái cây có vị ngọt ('Sweet').",
      "part3_tsql": "SELECT \n    FruitID,\n    FruitName,\n    JSON_VALUE(AttributesJSON, '$.Taste') AS ViTraiCay,\n    JSON_VALUE(AttributesJSON, '$.Color') AS MauSac\nFROM Fruits\nWHERE JSON_VALUE(AttributesJSON, '$.Taste') = 'Sweet';",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "ViTraiCay",
          "MauSac"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            "Sweet",
            "Yellow"
          ],
          [
            3,
            "Xoài Cát Hòa Lộc",
            "Sweet",
            null
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            "Sweet",
            "Dark Red"
          ]
        ]
      }
    },
    {
      "id": "kw_a41",
      "part": "A",
      "category": "10. JSON, Chuỗi, Ngày tháng & Bảng tạm",
      "keyword": "Hàm Chuỗi: SUBSTRING, CHARINDEX, LEN, DATALENGTH, TRIM, REPLACE, CONCAT",
      "what_it_does": "Xử lý và chuẩn hóa văn bản: CONCAT nối chuỗi an toàn với NULL, TRIM cắt khoảng trắng, SUBSTRING/CHARINDEX cắt chuỗi con, LEN đếm ký tự (bỏ dấu cách cuối) và DATALENGTH đếm số byte.",
      "backend_scenario": "Định dạng hiển thị nhãn sản phẩm trên hóa đơn in nhiệt: nối tên trái cây với xuất xứ và đơn vị tính bằng hàm CONCAT.",
      "tsql_code": "SELECT \n    FruitID,\n    CONCAT(UPPER(FruitName), N' (', Origin, N' - ĐVT: ', Unit, N')') AS NhanSanPham,\n    LEN(FruitName) AS SoKyTu,\n    DATALENGTH(FruitName) AS SoByteUnicode\nFROM Fruits\nWHERE FruitID <= 3;",
      "lab_sql": "SELECT FruitID, UPPER(FruitName) || ' (' || Origin || ' - ĐVT: ' || Unit || ')' AS NhanSanPham, LENGTH(FruitName) AS SoKyTu, LENGTH(FruitName) * 2 AS SoByteUnicode FROM Fruits WHERE FruitID <= 3;",
      "output": {
        "cols": [
          "FruitID",
          "NhanSanPham",
          "SoKyTu",
          "SoByteUnicode"
        ],
        "rows": [
          [
            1,
            "SẦU RIÊNG RI6 (Bến Tre - ĐVT: Kg)",
            13,
            26
          ],
          [
            2,
            "BƯỞI DA XANH (Bến Tre - ĐVT: Quả)",
            12,
            24
          ],
          [
            3,
            "XOÀI CÁT HÒA LỘC (Tiền Giang - ĐVT: Kg)",
            16,
            32
          ]
        ]
      },
      "part1_what": "Xử lý và chuẩn hóa văn bản: CONCAT nối chuỗi an toàn với NULL, TRIM cắt khoảng trắng, SUBSTRING/CHARINDEX cắt chuỗi con, LEN đếm ký tự (bỏ dấu cách cuối) và DATALENGTH đếm số byte.",
      "part2_backend": "Định dạng hiển thị nhãn sản phẩm trên hóa đơn in nhiệt: nối tên trái cây với xuất xứ và đơn vị tính bằng hàm CONCAT.",
      "part3_tsql": "SELECT \n    FruitID,\n    CONCAT(UPPER(FruitName), N' (', Origin, N' - ĐVT: ', Unit, N')') AS NhanSanPham,\n    LEN(FruitName) AS SoKyTu,\n    DATALENGTH(FruitName) AS SoByteUnicode\nFROM Fruits\nWHERE FruitID <= 3;",
      "part4_output": {
        "cols": [
          "FruitID",
          "NhanSanPham",
          "SoKyTu",
          "SoByteUnicode"
        ],
        "rows": [
          [
            1,
            "SẦU RIÊNG RI6 (Bến Tre - ĐVT: Kg)",
            13,
            26
          ],
          [
            2,
            "BƯỞI DA XANH (Bến Tre - ĐVT: Quả)",
            12,
            24
          ],
          [
            3,
            "XOÀI CÁT HÒA LỘC (Tiền Giang - ĐVT: Kg)",
            16,
            32
          ]
        ]
      }
    },
    {
      "id": "kw_a42",
      "part": "A",
      "category": "10. JSON, Chuỗi, Ngày tháng & Bảng tạm",
      "keyword": "Hàm Ngày Tháng: SYSDATETIME, DATEADD, DATEDIFF, EOMONTH, YEAR/MONTH",
      "what_it_does": "Lấy thời gian hệ thống độ chính xác cao (SYSDATETIME), cộng/trừ khoảng thời gian (DATEADD), tính độ lệch (DATEDIFF) và tìm ngày cuối tháng (EOMONTH).",
      "backend_scenario": "Thống kê doanh thu theo từng tháng/năm từ cột OrderDate và kiểm tra thời hạn sử dụng của các mã giảm giá Vouchers.",
      "tsql_code": "SELECT \n    YEAR(OrderDate) AS Nam,\n    MONTH(OrderDate) AS Thang,\n    COUNT(OrderID) AS SoDonHang,\n    SUM(TotalAmount) AS DoanhThuThang\nFROM Orders\nWHERE Status = N'Đã giao'\nGROUP BY YEAR(OrderDate), MONTH(OrderDate)\nORDER BY Nam, Thang;",
      "lab_sql": "SELECT CAST(strftime('%Y', OrderDate) AS INTEGER) AS Nam, CAST(strftime('%m', OrderDate) AS INTEGER) AS Thang, COUNT(OrderID) AS SoDonHang, SUM(TotalAmount) AS DoanhThuThang FROM Orders WHERE Status = 'Đã giao' GROUP BY Nam, Thang ORDER BY Nam, Thang;",
      "output": {
        "cols": [
          "Nam",
          "Thang",
          "SoDonHang",
          "DoanhThuThang"
        ],
        "rows": [
          [
            2023,
            2,
            1,
            850000
          ],
          [
            2023,
            4,
            1,
            180000
          ],
          [
            2023,
            6,
            1,
            150000
          ],
          [
            2023,
            8,
            1,
            850000
          ],
          [
            2023,
            12,
            1,
            2500000
          ],
          [
            2024,
            1,
            1,
            300000
          ]
        ]
      },
      "part1_what": "Lấy thời gian hệ thống độ chính xác cao (SYSDATETIME), cộng/trừ khoảng thời gian (DATEADD), tính độ lệch (DATEDIFF) và tìm ngày cuối tháng (EOMONTH).",
      "part2_backend": "Thống kê doanh thu theo từng tháng/năm từ cột OrderDate và kiểm tra thời hạn sử dụng của các mã giảm giá Vouchers.",
      "part3_tsql": "SELECT \n    YEAR(OrderDate) AS Nam,\n    MONTH(OrderDate) AS Thang,\n    COUNT(OrderID) AS SoDonHang,\n    SUM(TotalAmount) AS DoanhThuThang\nFROM Orders\nWHERE Status = N'Đã giao'\nGROUP BY YEAR(OrderDate), MONTH(OrderDate)\nORDER BY Nam, Thang;",
      "part4_output": {
        "cols": [
          "Nam",
          "Thang",
          "SoDonHang",
          "DoanhThuThang"
        ],
        "rows": [
          [
            2023,
            2,
            1,
            850000
          ],
          [
            2023,
            4,
            1,
            180000
          ],
          [
            2023,
            6,
            1,
            150000
          ],
          [
            2023,
            8,
            1,
            850000
          ],
          [
            2023,
            12,
            1,
            2500000
          ],
          [
            2024,
            1,
            1,
            300000
          ]
        ]
      }
    },
    {
      "id": "kw_a43",
      "part": "A",
      "category": "10. JSON, Chuỗi, Ngày tháng & Bảng tạm",
      "keyword": "#TempTable vs @TableVariable & Table-Valued Parameter (TVP)",
      "what_it_does": "#TempTable có thống kê (Statistics) và tạo được Index nên phù hợp tập dữ liệu trung gian lớn (>100 dòng); @TableVariable và TVP dùng để truyền cả một danh sách dòng từ C# / Java vào Stored Procedure.",
      "backend_scenario": "Khi khách đặt giỏ hàng gồm 10 loại trái cây, thay vì gọi INSERT 10 lần từ C# / Java, Backend truyền cả danh sách giỏ hàng qua 1 tham số kiểu bảng (TVP) vào Stored Procedure để chèn 1 lần duy nhất.",
      "tsql_code": "DECLARE @CartItems TABLE (\n    FruitID INT,\n    Quantity INT\n);\nINSERT INTO @CartItems VALUES (1, 2), (3, 5);\n\nSELECT c.FruitID, f.FruitName, c.Quantity, f.Price, (c.Quantity * f.Price) AS ThanhTien\nFROM @CartItems AS c\nINNER JOIN Fruits AS f ON c.FruitID = f.FruitID;",
      "lab_sql": "WITH CartItems(FruitID, Quantity) AS (VALUES (1, 2), (3, 5)) SELECT c.FruitID, f.FruitName, c.Quantity, f.Price, (c.Quantity * f.Price) AS ThanhTien FROM CartItems AS c INNER JOIN Fruits AS f ON c.FruitID = f.FruitID;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Quantity",
          "Price",
          "ThanhTien"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            2,
            150000,
            300000
          ],
          [
            3,
            "Xoài Cát Hòa Lộc",
            5,
            80000,
            400000
          ]
        ]
      },
      "part1_what": "#TempTable có thống kê (Statistics) và tạo được Index nên phù hợp tập dữ liệu trung gian lớn (>100 dòng); @TableVariable và TVP dùng để truyền cả một danh sách dòng từ C# / Java vào Stored Procedure.",
      "part2_backend": "Khi khách đặt giỏ hàng gồm 10 loại trái cây, thay vì gọi INSERT 10 lần từ C# / Java, Backend truyền cả danh sách giỏ hàng qua 1 tham số kiểu bảng (TVP) vào Stored Procedure để chèn 1 lần duy nhất.",
      "part3_tsql": "DECLARE @CartItems TABLE (\n    FruitID INT,\n    Quantity INT\n);\nINSERT INTO @CartItems VALUES (1, 2), (3, 5);\n\nSELECT c.FruitID, f.FruitName, c.Quantity, f.Price, (c.Quantity * f.Price) AS ThanhTien\nFROM @CartItems AS c\nINNER JOIN Fruits AS f ON c.FruitID = f.FruitID;",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Quantity",
          "Price",
          "ThanhTien"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            2,
            150000,
            300000
          ],
          [
            3,
            "Xoài Cát Hòa Lộc",
            5,
            80000,
            400000
          ]
        ]
      }
    },
    {
      "id": "kw_a44",
      "part": "A",
      "category": "10. JSON, Chuỗi, Ngày tháng & Bảng tạm",
      "keyword": "sp_executesql & QUOTENAME (Dynamic SQL An Toàn)",
      "what_it_does": "Thực thi câu lệnh SQL động có truyền tham số định kiểu (chống triệt để SQL Injection và tái sử dụng Plan Cache); QUOTENAME bọc tên bảng/cột động trong cặp ngoặc vuông [].",
      "backend_scenario": "Xây dựng API tìm kiếm động (Dynamic Filter) cho phép người dùng chọn lọc tùy ý theo CategoryID, khoảng giá hoặc sắp xếp theo cột bất kỳ mà vẫn miễn nhiễm hoàn toàn với SQL Injection.",
      "tsql_code": "DECLARE @sql NVARCHAR(MAX) = N'\n    SELECT FruitID, FruitName, Price, Origin\n    FROM dbo.Fruits\n    WHERE CategoryID = @CatID AND Price >= @MinPrice\n    ORDER BY Price DESC;';\n\nEXEC sp_executesql \n    @stmt = @sql,\n    @params = N'@CatID INT, @MinPrice DECIMAL(18,2)',\n    @CatID = 2,\n    @MinPrice = 200000;",
      "lab_sql": "SELECT FruitID, FruitName, Price, Origin FROM Fruits WHERE CategoryID = 2 AND Price >= 200000 ORDER BY Price DESC;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "Origin"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            "Hàn Quốc"
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            450000,
            "Úc"
          ],
          [
            6,
            "Táo Envy",
            250000,
            "Mỹ"
          ]
        ]
      },
      "part1_what": "Thực thi câu lệnh SQL động có truyền tham số định kiểu (chống triệt để SQL Injection và tái sử dụng Plan Cache); QUOTENAME bọc tên bảng/cột động trong cặp ngoặc vuông [].",
      "part2_backend": "Xây dựng API tìm kiếm động (Dynamic Filter) cho phép người dùng chọn lọc tùy ý theo CategoryID, khoảng giá hoặc sắp xếp theo cột bất kỳ mà vẫn miễn nhiễm hoàn toàn với SQL Injection.",
      "part3_tsql": "DECLARE @sql NVARCHAR(MAX) = N'\n    SELECT FruitID, FruitName, Price, Origin\n    FROM dbo.Fruits\n    WHERE CategoryID = @CatID AND Price >= @MinPrice\n    ORDER BY Price DESC;';\n\nEXEC sp_executesql \n    @stmt = @sql,\n    @params = N'@CatID INT, @MinPrice DECIMAL(18,2)',\n    @CatID = 2,\n    @MinPrice = 200000;",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "Origin"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            "Hàn Quốc"
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            450000,
            "Úc"
          ],
          [
            6,
            "Táo Envy",
            250000,
            "Mỹ"
          ]
        ]
      }
    },
    {
      "id": "kw_b01",
      "part": "B",
      "category": "11. Báo cáo Đa chiều (OLAP)",
      "keyword": "PIVOT & UNPIVOT (Xoay dòng thành cột)",
      "what_it_does": "PIVOT xoay các giá trị duy nhất của một cột thành nhiều cột ngang kèm hàm tổng hợp; UNPIVOT thực hiện phép xoay ngược lại từ cột về dòng.",
      "backend_scenario": "Xuất báo cáo ma trận doanh thu theo từng phương thức thanh toán (VNPAY, Momo, Tiền mặt) trên cùng một hàng để kế toán đối soát nhanh.",
      "tsql_code": "SELECT \n    ISNULL([VNPAY], 0) AS DoanhThu_VNPAY,\n    ISNULL([Momo], 0) AS DoanhThu_Momo,\n    ISNULL([Tiền mặt], 0) AS DoanhThu_TienMat\nFROM (\n    SELECT PaymentMethod, Amount \n    FROM PaymentTransactions\n) AS src\nPIVOT (\n    SUM(Amount) FOR PaymentMethod IN ([VNPAY], [Momo], [Tiền mặt])\n) AS pvt;",
      "lab_sql": "SELECT SUM(CASE WHEN PaymentMethod = 'VNPAY' THEN Amount ELSE 0 END) AS DoanhThu_VNPAY, SUM(CASE WHEN PaymentMethod = 'Momo' THEN Amount ELSE 0 END) AS DoanhThu_Momo, SUM(CASE WHEN PaymentMethod = 'Tiền mặt' THEN Amount ELSE 0 END) AS DoanhThu_TienMat FROM PaymentTransactions;",
      "output": {
        "cols": [
          "DoanhThu_VNPAY",
          "DoanhThu_Momo",
          "DoanhThu_TienMat"
        ],
        "rows": [
          [
            4200000,
            450000,
            200000
          ]
        ]
      },
      "part1_what": "PIVOT xoay các giá trị duy nhất của một cột thành nhiều cột ngang kèm hàm tổng hợp; UNPIVOT thực hiện phép xoay ngược lại từ cột về dòng.",
      "part2_backend": "Xuất báo cáo ma trận doanh thu theo từng phương thức thanh toán (VNPAY, Momo, Tiền mặt) trên cùng một hàng để kế toán đối soát nhanh.",
      "part3_tsql": "SELECT \n    ISNULL([VNPAY], 0) AS DoanhThu_VNPAY,\n    ISNULL([Momo], 0) AS DoanhThu_Momo,\n    ISNULL([Tiền mặt], 0) AS DoanhThu_TienMat\nFROM (\n    SELECT PaymentMethod, Amount \n    FROM PaymentTransactions\n) AS src\nPIVOT (\n    SUM(Amount) FOR PaymentMethod IN ([VNPAY], [Momo], [Tiền mặt])\n) AS pvt;",
      "part4_output": {
        "cols": [
          "DoanhThu_VNPAY",
          "DoanhThu_Momo",
          "DoanhThu_TienMat"
        ],
        "rows": [
          [
            4200000,
            450000,
            200000
          ]
        ]
      }
    },
    {
      "id": "kw_b02",
      "part": "B",
      "category": "11. Báo cáo Đa chiều (OLAP)",
      "keyword": "GROUP BY ROLLUP, CUBE & GROUPING SETS",
      "what_it_does": "Tự động tính thêm các dòng tổng phụ (Subtotals) và tổng cộng (Grand Total) theo phân cấp (ROLLUP), mọi tổ hợp chiều (CUBE) hoặc tập nhóm chỉ định (GROUPING SETS).",
      "backend_scenario": "Xuất báo cáo tổng hợp số lượng đơn và doanh thu theo từng trạng thái đơn hàng kèm dòng Tổng Cộng (Grand Total) ở cuối bảng chỉ bằng 1 câu truy vấn.",
      "tsql_code": "SELECT \n    IIF(GROUPING(Status) = 1, N'TỔNG CỘNG TẤT CẢ', Status) AS TrangThai,\n    COUNT(OrderID) AS SoDon,\n    SUM(TotalAmount) AS TongTien\nFROM Orders\nGROUP BY ROLLUP(Status);",
      "lab_sql": "SELECT Status AS TrangThai, COUNT(OrderID) AS SoDon, SUM(TotalAmount) AS TongTien FROM Orders GROUP BY Status UNION ALL SELECT 'TỔNG CỘNG TẤT CẢ', COUNT(OrderID), SUM(TotalAmount) FROM Orders;",
      "output": {
        "cols": [
          "TrangThai",
          "SoDon",
          "TongTien"
        ],
        "rows": [
          [
            "Chờ xử lý",
            2,
            495000
          ],
          [
            "Đang giao",
            1,
            200000
          ],
          [
            "Đã giao",
            6,
            4830000
          ],
          [
            "Đã hủy",
            1,
            180000
          ],
          [
            "TỔNG CỘNG TẤT CẢ",
            10,
            5705000
          ]
        ]
      },
      "part1_what": "Tự động tính thêm các dòng tổng phụ (Subtotals) và tổng cộng (Grand Total) theo phân cấp (ROLLUP), mọi tổ hợp chiều (CUBE) hoặc tập nhóm chỉ định (GROUPING SETS).",
      "part2_backend": "Xuất báo cáo tổng hợp số lượng đơn và doanh thu theo từng trạng thái đơn hàng kèm dòng Tổng Cộng (Grand Total) ở cuối bảng chỉ bằng 1 câu truy vấn.",
      "part3_tsql": "SELECT \n    IIF(GROUPING(Status) = 1, N'TỔNG CỘNG TẤT CẢ', Status) AS TrangThai,\n    COUNT(OrderID) AS SoDon,\n    SUM(TotalAmount) AS TongTien\nFROM Orders\nGROUP BY ROLLUP(Status);",
      "part4_output": {
        "cols": [
          "TrangThai",
          "SoDon",
          "TongTien"
        ],
        "rows": [
          [
            "Chờ xử lý",
            2,
            495000
          ],
          [
            "Đang giao",
            1,
            200000
          ],
          [
            "Đã giao",
            6,
            4830000
          ],
          [
            "Đã hủy",
            1,
            180000
          ],
          [
            "TỔNG CỘNG TẤT CẢ",
            10,
            5705000
          ]
        ]
      }
    },
    {
      "id": "kw_b03",
      "part": "B",
      "category": "12. Window Khung Trượt & Phân vị",
      "keyword": "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW",
      "what_it_does": "Định nghĩa khung cửa sổ trượt (Window Frame) từ dòng đầu tiên của phân vùng đến dòng hiện tại để tính tổng lũy kế (Running Total) hoặc trung bình trượt (Moving Average).",
      "backend_scenario": "Vẽ biểu đồ đường doanh thu lũy kế (Cumulative Revenue) qua từng đơn hàng đã giao theo trình tự thời gian.",
      "tsql_code": "SELECT \n    OrderID,\n    OrderDate,\n    TotalAmount,\n    SUM(TotalAmount) OVER (\n        ORDER BY OrderDate ASC, OrderID ASC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS DoanhThuLuyKe\nFROM Orders\nWHERE Status = N'Đã giao';",
      "lab_sql": "SELECT OrderID, OrderDate, TotalAmount, SUM(TotalAmount) OVER (ORDER BY OrderDate ASC, OrderID ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS DoanhThuLuyKe FROM Orders WHERE Status = 'Đã giao';",
      "output": {
        "cols": [
          "OrderID",
          "OrderDate",
          "TotalAmount",
          "DoanhThuLuyKe"
        ],
        "rows": [
          [
            1,
            "2023-02-14 10:15:00",
            850000,
            850000
          ],
          [
            2,
            "2023-04-20 14:30:00",
            180000,
            1030000
          ],
          [
            3,
            "2023-06-15 09:00:00",
            150000,
            1180000
          ],
          [
            4,
            "2023-08-08 16:45:00",
            850000,
            2030000
          ],
          [
            5,
            "2023-12-24 19:00:00",
            2500000,
            4530000
          ],
          [
            6,
            "2024-01-10 08:30:00",
            300000,
            4830000
          ]
        ]
      },
      "part1_what": "Định nghĩa khung cửa sổ trượt (Window Frame) từ dòng đầu tiên của phân vùng đến dòng hiện tại để tính tổng lũy kế (Running Total) hoặc trung bình trượt (Moving Average).",
      "part2_backend": "Vẽ biểu đồ đường doanh thu lũy kế (Cumulative Revenue) qua từng đơn hàng đã giao theo trình tự thời gian.",
      "part3_tsql": "SELECT \n    OrderID,\n    OrderDate,\n    TotalAmount,\n    SUM(TotalAmount) OVER (\n        ORDER BY OrderDate ASC, OrderID ASC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS DoanhThuLuyKe\nFROM Orders\nWHERE Status = N'Đã giao';",
      "part4_output": {
        "cols": [
          "OrderID",
          "OrderDate",
          "TotalAmount",
          "DoanhThuLuyKe"
        ],
        "rows": [
          [
            1,
            "2023-02-14 10:15:00",
            850000,
            850000
          ],
          [
            2,
            "2023-04-20 14:30:00",
            180000,
            1030000
          ],
          [
            3,
            "2023-06-15 09:00:00",
            150000,
            1180000
          ],
          [
            4,
            "2023-08-08 16:45:00",
            850000,
            2030000
          ],
          [
            5,
            "2023-12-24 19:00:00",
            2500000,
            4530000
          ],
          [
            6,
            "2024-01-10 08:30:00",
            300000,
            4830000
          ]
        ]
      }
    },
    {
      "id": "kw_b04",
      "part": "B",
      "category": "12. Window Khung Trượt & Phân vị",
      "keyword": "FIRST_VALUE & LAST_VALUE",
      "what_it_does": "Lấy giá trị đầu tiên (FIRST_VALUE) hoặc giá trị cuối cùng (LAST_VALUE) trong khung cửa sổ đã sắp xếp (Lưu ý: với LAST_VALUE phải chỉ định rõ ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING).",
      "backend_scenario": "So sánh giá của từng loại trái cây nhập khẩu với loại đắt nhất và rẻ nhất trong cùng danh mục ngay trên một dòng.",
      "tsql_code": "SELECT \n    FruitName,\n    Price,\n    FIRST_VALUE(FruitName) OVER (PARTITION BY CategoryID ORDER BY Price DESC) AS SpDatNhatNhom,\n    LAST_VALUE(FruitName) OVER (\n        PARTITION BY CategoryID ORDER BY Price DESC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\n    ) AS SpReNhatNhom\nFROM Fruits\nWHERE CategoryID = 2;",
      "lab_sql": "SELECT FruitName, Price, FIRST_VALUE(FruitName) OVER (PARTITION BY CategoryID ORDER BY Price DESC) AS SpDatNhatNhom, LAST_VALUE(FruitName) OVER (PARTITION BY CategoryID ORDER BY Price DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS SpReNhatNhom FROM Fruits WHERE CategoryID = 2;",
      "output": {
        "cols": [
          "FruitName",
          "Price",
          "SpDatNhatNhom",
          "SpReNhatNhom"
        ],
        "rows": [
          [
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            "Nho Mẫu Đơn Shine Muscat",
            "Kiwi Vàng"
          ],
          [
            "Cherry Đỏ Thẫm",
            450000,
            "Nho Mẫu Đơn Shine Muscat",
            "Kiwi Vàng"
          ],
          [
            "Táo Envy",
            250000,
            "Nho Mẫu Đơn Shine Muscat",
            "Kiwi Vàng"
          ],
          [
            "Kiwi Vàng",
            180000,
            "Nho Mẫu Đơn Shine Muscat",
            "Kiwi Vàng"
          ]
        ]
      },
      "part1_what": "Lấy giá trị đầu tiên (FIRST_VALUE) hoặc giá trị cuối cùng (LAST_VALUE) trong khung cửa sổ đã sắp xếp (Lưu ý: với LAST_VALUE phải chỉ định rõ ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING).",
      "part2_backend": "So sánh giá của từng loại trái cây nhập khẩu với loại đắt nhất và rẻ nhất trong cùng danh mục ngay trên một dòng.",
      "part3_tsql": "SELECT \n    FruitName,\n    Price,\n    FIRST_VALUE(FruitName) OVER (PARTITION BY CategoryID ORDER BY Price DESC) AS SpDatNhatNhom,\n    LAST_VALUE(FruitName) OVER (\n        PARTITION BY CategoryID ORDER BY Price DESC\n        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING\n    ) AS SpReNhatNhom\nFROM Fruits\nWHERE CategoryID = 2;",
      "part4_output": {
        "cols": [
          "FruitName",
          "Price",
          "SpDatNhatNhom",
          "SpReNhatNhom"
        ],
        "rows": [
          [
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            "Nho Mẫu Đơn Shine Muscat",
            "Kiwi Vàng"
          ],
          [
            "Cherry Đỏ Thẫm",
            450000,
            "Nho Mẫu Đơn Shine Muscat",
            "Kiwi Vàng"
          ],
          [
            "Táo Envy",
            250000,
            "Nho Mẫu Đơn Shine Muscat",
            "Kiwi Vàng"
          ],
          [
            "Kiwi Vàng",
            180000,
            "Nho Mẫu Đơn Shine Muscat",
            "Kiwi Vàng"
          ]
        ]
      }
    },
    {
      "id": "kw_b05",
      "part": "B",
      "category": "12. Window Khung Trượt & Phân vị",
      "keyword": "PERCENT_RANK, CUME_DIST & PERCENTILE_CONT",
      "what_it_does": "Tính thứ hạng phần trăm tương đối (PERCENT_RANK từ 0 đến 1), phân phối tích lũy (CUME_DIST) và trung vị / phân vị nội suy (PERCENTILE_CONT).",
      "backend_scenario": "Xác định xem mức giá của từng loại trái cây nằm ở top bao nhiêu phần trăm trong toàn bộ danh mục cửa hàng.",
      "tsql_code": "SELECT \n    FruitName,\n    Price,\n    ROUND(PERCENT_RANK() OVER (ORDER BY Price ASC), 2) AS PercentRank,\n    ROUND(CUME_DIST() OVER (ORDER BY Price ASC), 2) AS CumeDist\nFROM Fruits\nWHERE CategoryID = 1;",
      "lab_sql": "SELECT FruitName, Price, ROUND(PERCENT_RANK() OVER (ORDER BY Price ASC), 2) AS PercentRank, ROUND(CUME_DIST() OVER (ORDER BY Price ASC), 2) AS CumeDist FROM Fruits WHERE CategoryID = 1;",
      "output": {
        "cols": [
          "FruitName",
          "Price",
          "PercentRank",
          "CumeDist"
        ],
        "rows": [
          [
            "Bưởi Da Xanh",
            70000,
            0.0,
            0.25
          ],
          [
            "Xoài Cát Hòa Lộc",
            80000,
            0.33,
            0.5
          ],
          [
            "Măng Cụt Lái Thiêu",
            95000,
            0.67,
            0.75
          ],
          [
            "Sầu Riêng Ri6",
            150000,
            1.0,
            1.0
          ]
        ]
      },
      "part1_what": "Tính thứ hạng phần trăm tương đối (PERCENT_RANK từ 0 đến 1), phân phối tích lũy (CUME_DIST) và trung vị / phân vị nội suy (PERCENTILE_CONT).",
      "part2_backend": "Xác định xem mức giá của từng loại trái cây nằm ở top bao nhiêu phần trăm trong toàn bộ danh mục cửa hàng.",
      "part3_tsql": "SELECT \n    FruitName,\n    Price,\n    ROUND(PERCENT_RANK() OVER (ORDER BY Price ASC), 2) AS PercentRank,\n    ROUND(CUME_DIST() OVER (ORDER BY Price ASC), 2) AS CumeDist\nFROM Fruits\nWHERE CategoryID = 1;",
      "part4_output": {
        "cols": [
          "FruitName",
          "Price",
          "PercentRank",
          "CumeDist"
        ],
        "rows": [
          [
            "Bưởi Da Xanh",
            70000,
            0.0,
            0.25
          ],
          [
            "Xoài Cát Hòa Lộc",
            80000,
            0.33,
            0.5
          ],
          [
            "Măng Cụt Lái Thiêu",
            95000,
            0.67,
            0.75
          ],
          [
            "Sầu Riêng Ri6",
            150000,
            1.0,
            1.0
          ]
        ]
      }
    },
    {
      "id": "kw_b06",
      "part": "B",
      "category": "13. Kiến trúc Bảng & Index Nâng cao",
      "keyword": "Computed Column: AS (...) PERSISTED",
      "what_it_does": "Định nghĩa cột tự động tính toán từ biểu thức các cột khác trong cùng bảng; từ khóa PERSISTED lưu cứng kết quả xuống đĩa và cho phép đánh Index trực tiếp lên cột đó.",
      "backend_scenario": "Trong bảng OrderDetails của DB FruitStore, cột SubTotal được định nghĩa là AS (CAST(Quantity * UnitPrice AS DECIMAL(18,2))) PERSISTED để luôn nhất quán 100% mà Backend không bao giờ tính sai.",
      "tsql_code": "-- Định nghĩa trong bảng OrderDetails của FruitStore:\n-- SubTotal AS (CAST(Quantity * UnitPrice AS DECIMAL(18, 2))) PERSISTED\nSELECT \n    OrderDetailID, OrderID, FruitID, Quantity, UnitPrice, SubTotal\nFROM OrderDetails\nWHERE OrderID IN (2, 4);",
      "lab_sql": "SELECT OrderDetailID, OrderID, FruitID, Quantity, UnitPrice, SubTotal FROM OrderDetails WHERE OrderID IN (2, 4);",
      "output": {
        "cols": [
          "OrderDetailID",
          "OrderID",
          "FruitID",
          "Quantity",
          "UnitPrice",
          "SubTotal"
        ],
        "rows": [
          [
            2,
            2,
            3,
            2,
            80000,
            160000
          ],
          [
            3,
            2,
            2,
            1,
            70000,
            70000
          ],
          [
            5,
            4,
            6,
            2,
            250000,
            500000
          ],
          [
            6,
            4,
            7,
            1,
            450000,
            450000
          ]
        ]
      },
      "part1_what": "Định nghĩa cột tự động tính toán từ biểu thức các cột khác trong cùng bảng; từ khóa PERSISTED lưu cứng kết quả xuống đĩa và cho phép đánh Index trực tiếp lên cột đó.",
      "part2_backend": "Trong bảng OrderDetails của DB FruitStore, cột SubTotal được định nghĩa là AS (CAST(Quantity * UnitPrice AS DECIMAL(18,2))) PERSISTED để luôn nhất quán 100% mà Backend không bao giờ tính sai.",
      "part3_tsql": "-- Định nghĩa trong bảng OrderDetails của FruitStore:\n-- SubTotal AS (CAST(Quantity * UnitPrice AS DECIMAL(18, 2))) PERSISTED\nSELECT \n    OrderDetailID, OrderID, FruitID, Quantity, UnitPrice, SubTotal\nFROM OrderDetails\nWHERE OrderID IN (2, 4);",
      "part4_output": {
        "cols": [
          "OrderDetailID",
          "OrderID",
          "FruitID",
          "Quantity",
          "UnitPrice",
          "SubTotal"
        ],
        "rows": [
          [
            2,
            2,
            3,
            2,
            80000,
            160000
          ],
          [
            3,
            2,
            2,
            1,
            70000,
            70000
          ],
          [
            5,
            4,
            6,
            2,
            250000,
            500000
          ],
          [
            6,
            4,
            7,
            1,
            450000,
            450000
          ]
        ]
      }
    },
    {
      "id": "kw_b07",
      "part": "B",
      "category": "13. Kiến trúc Bảng & Index Nâng cao",
      "keyword": "Temporal Table: SYSTEM_VERSIONING & FOR SYSTEM_TIME AS OF",
      "what_it_does": "Tự động lưu mọi phiên bản cũ của dòng vào bảng lịch sử mỗi khi UPDATE/DELETE, cho phép truy vấn 'du hành thời gian' xem dữ liệu tại một thời điểm bất kỳ trong quá khứ.",
      "backend_scenario": "Kiểm tra lại giá bán của Nho Mẫu Đơn Shine Muscat tại đúng thời điểm khách đặt đơn ngày 14/02/2023 để giải quyết khiếu nại chênh lệch giá.",
      "tsql_code": "-- Bật System Versioning cho bảng Fruits:\n-- ALTER TABLE Fruits SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.FruitsHistory));\n\nSELECT FruitID, FruitName, Price\nFROM Fruits\nFOR SYSTEM_TIME AS OF '2023-02-14 10:15:00'\nWHERE FruitID = 5;",
      "lab_sql": "SELECT FruitID, FruitName, Price FROM Fruits WHERE FruitID = 5;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000
          ]
        ]
      },
      "part1_what": "Tự động lưu mọi phiên bản cũ của dòng vào bảng lịch sử mỗi khi UPDATE/DELETE, cho phép truy vấn 'du hành thời gian' xem dữ liệu tại một thời điểm bất kỳ trong quá khứ.",
      "part2_backend": "Kiểm tra lại giá bán của Nho Mẫu Đơn Shine Muscat tại đúng thời điểm khách đặt đơn ngày 14/02/2023 để giải quyết khiếu nại chênh lệch giá.",
      "part3_tsql": "-- Bật System Versioning cho bảng Fruits:\n-- ALTER TABLE Fruits SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.FruitsHistory));\n\nSELECT FruitID, FruitName, Price\nFROM Fruits\nFOR SYSTEM_TIME AS OF '2023-02-14 10:15:00'\nWHERE FruitID = 5;",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000
          ]
        ]
      }
    },
    {
      "id": "kw_b08",
      "part": "B",
      "category": "13. Kiến trúc Bảng & Index Nâng cao",
      "keyword": "CLUSTERED COLUMNSTORE INDEX (Nén cột OLAP)",
      "what_it_does": "Lưu trữ dữ liệu theo từng cột (Columnar Storage) thay vì từng dòng, giúp nén dữ liệu gấp 10 lần và tăng tốc truy vấn tổng hợp (SUM, AVG, COUNT) trên hàng trăm triệu dòng.",
      "backend_scenario": "Áp dụng cho bảng lưu trữ lịch sử giao dịch thanh toán hoặc bảng log đơn hàng nhiều năm (Data Warehouse / OLAP) khi cần chạy báo cáo doanh thu toàn chuỗi.",
      "tsql_code": "-- Tạo Columnstore Index cho bảng lịch sử giao dịch lớn:\nCREATE NONCLUSTERED COLUMNSTORE INDEX NCCI_PaymentTransactions_Analytics\nON PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate);",
      "lab_sql": "SELECT PaymentMethod, COUNT(*) AS SoGiaoDich, SUM(Amount) AS TongTien FROM PaymentTransactions GROUP BY PaymentMethod;",
      "output": {
        "cols": [
          "PaymentMethod",
          "SoGiaoDich",
          "TongTien"
        ],
        "rows": [
          [
            "Momo",
            2,
            450000
          ],
          [
            "Tiền mặt",
            1,
            200000
          ],
          [
            "VNPAY",
            3,
            4200000
          ]
        ]
      },
      "part1_what": "Lưu trữ dữ liệu theo từng cột (Columnar Storage) thay vì từng dòng, giúp nén dữ liệu gấp 10 lần và tăng tốc truy vấn tổng hợp (SUM, AVG, COUNT) trên hàng trăm triệu dòng.",
      "part2_backend": "Áp dụng cho bảng lưu trữ lịch sử giao dịch thanh toán hoặc bảng log đơn hàng nhiều năm (Data Warehouse / OLAP) khi cần chạy báo cáo doanh thu toàn chuỗi.",
      "part3_tsql": "-- Tạo Columnstore Index cho bảng lịch sử giao dịch lớn:\nCREATE NONCLUSTERED COLUMNSTORE INDEX NCCI_PaymentTransactions_Analytics\nON PaymentTransactions (OrderID, PaymentMethod, Amount, PaymentDate);",
      "part4_output": {
        "cols": [
          "PaymentMethod",
          "SoGiaoDich",
          "TongTien"
        ],
        "rows": [
          [
            "Momo",
            2,
            450000
          ],
          [
            "Tiền mặt",
            1,
            200000
          ],
          [
            "VNPAY",
            3,
            4200000
          ]
        ]
      }
    },
    {
      "id": "kw_b09",
      "part": "B",
      "category": "13. Kiến trúc Bảng & Index Nâng cao",
      "keyword": "PARTITION FUNCTION, PARTITION SCHEME & SWITCH PARTITION",
      "what_it_does": "Chia một bảng khổng lồ thành nhiều phân vùng vật lý theo khoảng thời gian (ví dụ theo năm/tháng) để loại bỏ phân vùng thừa khi đọc (Partition Elimination) và归档 dữ liệu tức thì (SWITCH).",
      "backend_scenario": "Chia bảng Orders theo từng năm (2023, 2024, 2025) để khi truy vấn đơn hàng năm 2024, SQL Server chỉ đọc phân vùng năm 2024.",
      "tsql_code": "CREATE PARTITION FUNCTION pf_OrderYear (DATETIME2(0))\nAS RANGE RIGHT FOR VALUES ('2023-01-01', '2024-01-01', '2025-01-01');\n\n-- Thống kê số lượng đơn trên từng phân vùng năm:\nSELECT YEAR(OrderDate) AS NamPhanVung, COUNT(*) AS SoDon, SUM(TotalAmount) AS TongTien\nFROM Orders\nGROUP BY YEAR(OrderDate);",
      "lab_sql": "SELECT CAST(strftime('%Y', OrderDate) AS INTEGER) AS NamPhanVung, COUNT(*) AS SoDon, SUM(TotalAmount) AS TongTien FROM Orders GROUP BY NamPhanVung;",
      "output": {
        "cols": [
          "NamPhanVung",
          "SoDon",
          "TongTien"
        ],
        "rows": [
          [
            2023,
            5,
            4530000
          ],
          [
            2024,
            5,
            1175000
          ]
        ]
      },
      "part1_what": "Chia một bảng khổng lồ thành nhiều phân vùng vật lý theo khoảng thời gian (ví dụ theo năm/tháng) để loại bỏ phân vùng thừa khi đọc (Partition Elimination) và归档 dữ liệu tức thì (SWITCH).",
      "part2_backend": "Chia bảng Orders theo từng năm (2023, 2024, 2025) để khi truy vấn đơn hàng năm 2024, SQL Server chỉ đọc phân vùng năm 2024.",
      "part3_tsql": "CREATE PARTITION FUNCTION pf_OrderYear (DATETIME2(0))\nAS RANGE RIGHT FOR VALUES ('2023-01-01', '2024-01-01', '2025-01-01');\n\n-- Thống kê số lượng đơn trên từng phân vùng năm:\nSELECT YEAR(OrderDate) AS NamPhanVung, COUNT(*) AS SoDon, SUM(TotalAmount) AS TongTien\nFROM Orders\nGROUP BY YEAR(OrderDate);",
      "part4_output": {
        "cols": [
          "NamPhanVung",
          "SoDon",
          "TongTien"
        ],
        "rows": [
          [
            2023,
            5,
            4530000
          ],
          [
            2024,
            5,
            1175000
          ]
        ]
      }
    },
    {
      "id": "kw_b10",
      "part": "B",
      "category": "13. Kiến trúc Bảng & Index Nâng cao",
      "keyword": "ROWVERSION / TIMESTAMP (Optimistic Concurrency)",
      "what_it_does": "Kiểu dữ liệu nhị phân 8 byte tự động tăng mỗi khi dòng bị sửa đổi; dùng làm thẻ phiên bản (Concurrency Token) cho cơ chế Khóa Lạc Quan trong EF Core ([Timestamp]) và JPA (@Version).",
      "backend_scenario": "Khi hai quản trị viên cùng mở màn hình chỉnh sửa giá của Sầu Riêng Ri6, người lưu sau sẽ bị phát hiện lệch RowVersion và nhận thông báo dữ liệu đã bị người khác thay đổi.",
      "tsql_code": "-- Thêm cột RowVer vào bảng Fruits:\n-- ALTER TABLE Fruits ADD RowVer ROWVERSION NOT NULL;\n\nUPDATE Fruits\nSET Price = 160000\nWHERE FruitID = 1 AND RowVer = 0x00000000000007D1;\n-- Nếu @@ROWCOUNT = 0 -> Báo lỗi DbUpdateConcurrencyException!",
      "lab_sql": "SELECT FruitID, FruitName, Price, '0x00000000000007D1' AS RowVerMinhHoa FROM Fruits WHERE FruitID = 1;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "RowVerMinhHoa"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            150000,
            "0x00000000000007D1"
          ]
        ]
      },
      "part1_what": "Kiểu dữ liệu nhị phân 8 byte tự động tăng mỗi khi dòng bị sửa đổi; dùng làm thẻ phiên bản (Concurrency Token) cho cơ chế Khóa Lạc Quan trong EF Core ([Timestamp]) và JPA (@Version).",
      "part2_backend": "Khi hai quản trị viên cùng mở màn hình chỉnh sửa giá của Sầu Riêng Ri6, người lưu sau sẽ bị phát hiện lệch RowVersion và nhận thông báo dữ liệu đã bị người khác thay đổi.",
      "part3_tsql": "-- Thêm cột RowVer vào bảng Fruits:\n-- ALTER TABLE Fruits ADD RowVer ROWVERSION NOT NULL;\n\nUPDATE Fruits\nSET Price = 160000\nWHERE FruitID = 1 AND RowVer = 0x00000000000007D1;\n-- Nếu @@ROWCOUNT = 0 -> Báo lỗi DbUpdateConcurrencyException!",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "RowVerMinhHoa"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            150000,
            "0x00000000000007D1"
          ]
        ]
      }
    },
    {
      "id": "kw_b11",
      "part": "B",
      "category": "13. Kiến trúc Bảng & Index Nâng cao",
      "keyword": "UNIQUEIDENTIFIER: NEWID() vs NEWSEQUENTIALID()",
      "what_it_does": "Sinh mã định danh toàn cục GUID 16-byte; NEWID() sinh ngẫu nhiên hoàn toàn (gây phân mảnh B+Tree nếu làm PK), còn NEWSEQUENTIALID() sinh tăng dần tuần tự thân thiện với Clustered Index.",
      "backend_scenario": "Tạo mã giao dịch đối soát (Reference Code) hoặc khóa chính phân tán cho bảng PaymentTransactions khi tích hợp cổng thanh toán VNPAY / Momo.",
      "tsql_code": "SELECT \n    TransactionID,\n    OrderID,\n    PaymentMethod,\n    NEWID() AS RandomTraceId\nFROM PaymentTransactions\nWHERE TransactionID <= 2;",
      "lab_sql": "SELECT TransactionID, OrderID, PaymentMethod, 'E28B3BD9-9174-41A9-8508-899A78A33540' AS RandomTraceId FROM PaymentTransactions WHERE TransactionID <= 2;",
      "output": {
        "cols": [
          "TransactionID",
          "OrderID",
          "PaymentMethod",
          "RandomTraceId"
        ],
        "rows": [
          [
            1,
            1,
            "VNPAY",
            "E28B3BD9-9174-41A9-8508-899A78A33540"
          ],
          [
            2,
            2,
            "Tiền mặt",
            "E28B3BD9-9174-41A9-8508-899A78A33540"
          ]
        ]
      },
      "part1_what": "Sinh mã định danh toàn cục GUID 16-byte; NEWID() sinh ngẫu nhiên hoàn toàn (gây phân mảnh B+Tree nếu làm PK), còn NEWSEQUENTIALID() sinh tăng dần tuần tự thân thiện với Clustered Index.",
      "part2_backend": "Tạo mã giao dịch đối soát (Reference Code) hoặc khóa chính phân tán cho bảng PaymentTransactions khi tích hợp cổng thanh toán VNPAY / Momo.",
      "part3_tsql": "SELECT \n    TransactionID,\n    OrderID,\n    PaymentMethod,\n    NEWID() AS RandomTraceId\nFROM PaymentTransactions\nWHERE TransactionID <= 2;",
      "part4_output": {
        "cols": [
          "TransactionID",
          "OrderID",
          "PaymentMethod",
          "RandomTraceId"
        ],
        "rows": [
          [
            1,
            1,
            "VNPAY",
            "E28B3BD9-9174-41A9-8508-899A78A33540"
          ],
          [
            2,
            2,
            "Tiền mặt",
            "E28B3BD9-9174-41A9-8508-899A78A33540"
          ]
        ]
      }
    },
    {
      "id": "kw_b12",
      "part": "B",
      "category": "14. Bảo mật & Phân quyền (DCL)",
      "keyword": "GRANT, REVOKE & DENY (Phân quyền DCL)",
      "what_it_does": "Cấp quyền (GRANT), thu hồi quyền đã cấp (REVOKE) hoặc cấm tuyệt đối (DENY - luôn ưu tiên cao nhất) đối với User/Role trên bảng, View hoặc Stored Procedure.",
      "backend_scenario": "Chỉ cấp quyền SELECT và EXECUTE Stored Procedure cho tài khoản kết nối của ứng dụng Backend (app_backend_user), đồng thời DENY quyền xóa bảng Customers.",
      "tsql_code": "GRANT SELECT ON dbo.Fruits TO app_backend_user;\nGRANT EXECUTE ON SCHEMA::dbo TO app_backend_user;\nDENY DELETE ON dbo.Customers TO app_backend_user;",
      "lab_sql": "SELECT 'app_backend_user' AS Principal, 'Fruits' AS ObjectName, 'GRANT SELECT' AS Permission UNION ALL SELECT 'app_backend_user', 'Customers', 'DENY DELETE';",
      "output": {
        "cols": [
          "Principal",
          "ObjectName",
          "Permission"
        ],
        "rows": [
          [
            "app_backend_user",
            "Fruits",
            "GRANT SELECT"
          ],
          [
            "app_backend_user",
            "Customers",
            "DENY DELETE"
          ]
        ]
      },
      "part1_what": "Cấp quyền (GRANT), thu hồi quyền đã cấp (REVOKE) hoặc cấm tuyệt đối (DENY - luôn ưu tiên cao nhất) đối với User/Role trên bảng, View hoặc Stored Procedure.",
      "part2_backend": "Chỉ cấp quyền SELECT và EXECUTE Stored Procedure cho tài khoản kết nối của ứng dụng Backend (app_backend_user), đồng thời DENY quyền xóa bảng Customers.",
      "part3_tsql": "GRANT SELECT ON dbo.Fruits TO app_backend_user;\nGRANT EXECUTE ON SCHEMA::dbo TO app_backend_user;\nDENY DELETE ON dbo.Customers TO app_backend_user;",
      "part4_output": {
        "cols": [
          "Principal",
          "ObjectName",
          "Permission"
        ],
        "rows": [
          [
            "app_backend_user",
            "Fruits",
            "GRANT SELECT"
          ],
          [
            "app_backend_user",
            "Customers",
            "DENY DELETE"
          ]
        ]
      }
    },
    {
      "id": "kw_b13",
      "part": "B",
      "category": "14. Bảo mật & Phân quyền (DCL)",
      "keyword": "Dynamic Data Masking (ADD MASKED WITH)",
      "what_it_does": "Tự động che giấu một phần dữ liệu nhạy cảm (số điện thoại, email, thẻ tín dụng) ngay khi SELECT đối với các tài khoản không có quyền UNMASK.",
      "backend_scenario": "Che 5 chữ số giữa trong cột PhoneNumber của bảng Customers ('090*****22') khi nhân viên chăm sóc khách hàng hoặc lập trình viên truy vấn trên môi trường Staging/Production.",
      "tsql_code": "ALTER TABLE Customers\nALTER COLUMN PhoneNumber ADD MASKED WITH (FUNCTION = 'partial(3,\"*****\",2)');\n\n-- Kết quả khi tài khoản thường SELECT:\nSELECT CustomerID, FullName, STUFF(PhoneNumber, 4, 5, '*****') AS MaskedPhone\nFROM Customers\nWHERE CustomerID <= 3;",
      "lab_sql": "SELECT CustomerID, FullName, SUBSTR(PhoneNumber, 1, 3) || '*****' || SUBSTR(PhoneNumber, 9, 2) AS MaskedPhone FROM Customers WHERE CustomerID <= 3;",
      "output": {
        "cols": [
          "CustomerID",
          "FullName",
          "MaskedPhone"
        ],
        "rows": [
          [
            1,
            "Võ Thành Tài",
            "090*****22"
          ],
          [
            2,
            "Nguyễn Thị Lệ",
            "090*****33"
          ],
          [
            3,
            "Trương Vô Kỵ",
            "090*****44"
          ]
        ]
      },
      "part1_what": "Tự động che giấu một phần dữ liệu nhạy cảm (số điện thoại, email, thẻ tín dụng) ngay khi SELECT đối với các tài khoản không có quyền UNMASK.",
      "part2_backend": "Che 5 chữ số giữa trong cột PhoneNumber của bảng Customers ('090*****22') khi nhân viên chăm sóc khách hàng hoặc lập trình viên truy vấn trên môi trường Staging/Production.",
      "part3_tsql": "ALTER TABLE Customers\nALTER COLUMN PhoneNumber ADD MASKED WITH (FUNCTION = 'partial(3,\"*****\",2)');\n\n-- Kết quả khi tài khoản thường SELECT:\nSELECT CustomerID, FullName, STUFF(PhoneNumber, 4, 5, '*****') AS MaskedPhone\nFROM Customers\nWHERE CustomerID <= 3;",
      "part4_output": {
        "cols": [
          "CustomerID",
          "FullName",
          "MaskedPhone"
        ],
        "rows": [
          [
            1,
            "Võ Thành Tài",
            "090*****22"
          ],
          [
            2,
            "Nguyễn Thị Lệ",
            "090*****33"
          ],
          [
            3,
            "Trương Vô Kỵ",
            "090*****44"
          ]
        ]
      }
    },
    {
      "id": "kw_b14",
      "part": "B",
      "category": "14. Bảo mật & Phân quyền (DCL)",
      "keyword": "Row-Level Security (CREATE SECURITY POLICY)",
      "what_it_does": "Tự động gắn bộ lọc dòng (Filter Predicate) vô hình vào mọi câu lệnh SELECT/UPDATE trên bảng dựa theo ngữ cảnh người dùng đăng nhập (SESSION_CONTEXT).",
      "backend_scenario": "Khi nhân viên bán hàng Hoàng Cúc (EmployeeID = 6) đăng nhập vào hệ thống nội bộ và chạy SELECT * FROM Orders, RLS tự động chỉ trả về các đơn hàng do chính Hoàng Cúc phụ trách.",
      "tsql_code": "-- Thiết lập ngữ cảnh phiên làm việc từ Backend:\nEXEC sp_set_session_context @key = N'CurrentEmployeeID', @value = 6;\n\n-- RLS Predicate tự động lọc:\nSELECT OrderID, CustomerID, EmployeeID, TotalAmount, Status\nFROM Orders\nWHERE EmployeeID = CAST(SESSION_CONTEXT(N'CurrentEmployeeID') AS INT);",
      "lab_sql": "SELECT OrderID, CustomerID, EmployeeID, TotalAmount, Status FROM Orders WHERE EmployeeID = 6;",
      "output": {
        "cols": [
          "OrderID",
          "CustomerID",
          "EmployeeID",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            1,
            1,
            6,
            850000,
            "Đã giao"
          ],
          [
            2,
            2,
            6,
            180000,
            "Đã giao"
          ],
          [
            5,
            1,
            6,
            2500000,
            "Đã giao"
          ],
          [
            7,
            6,
            6,
            180000,
            "Đã hủy"
          ],
          [
            8,
            1,
            6,
            200000,
            "Đang giao"
          ],
          [
            10,
            7,
            6,
            95000,
            "Chờ xử lý"
          ]
        ]
      },
      "part1_what": "Tự động gắn bộ lọc dòng (Filter Predicate) vô hình vào mọi câu lệnh SELECT/UPDATE trên bảng dựa theo ngữ cảnh người dùng đăng nhập (SESSION_CONTEXT).",
      "part2_backend": "Khi nhân viên bán hàng Hoàng Cúc (EmployeeID = 6) đăng nhập vào hệ thống nội bộ và chạy SELECT * FROM Orders, RLS tự động chỉ trả về các đơn hàng do chính Hoàng Cúc phụ trách.",
      "part3_tsql": "-- Thiết lập ngữ cảnh phiên làm việc từ Backend:\nEXEC sp_set_session_context @key = N'CurrentEmployeeID', @value = 6;\n\n-- RLS Predicate tự động lọc:\nSELECT OrderID, CustomerID, EmployeeID, TotalAmount, Status\nFROM Orders\nWHERE EmployeeID = CAST(SESSION_CONTEXT(N'CurrentEmployeeID') AS INT);",
      "part4_output": {
        "cols": [
          "OrderID",
          "CustomerID",
          "EmployeeID",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            1,
            1,
            6,
            850000,
            "Đã giao"
          ],
          [
            2,
            2,
            6,
            180000,
            "Đã giao"
          ],
          [
            5,
            1,
            6,
            2500000,
            "Đã giao"
          ],
          [
            7,
            6,
            6,
            180000,
            "Đã hủy"
          ],
          [
            8,
            1,
            6,
            200000,
            "Đang giao"
          ],
          [
            10,
            7,
            6,
            95000,
            "Chờ xử lý"
          ]
        ]
      }
    },
    {
      "id": "kw_b15",
      "part": "B",
      "category": "15. Luồng điều khiển & Quản trị T-SQL",
      "keyword": "CURSOR (LOCAL FAST_FORWARD) & Tại sao nên tránh",
      "what_it_does": "Con trỏ duyệt từng dòng một (Row-By-Agonizing-Row - RBAR); rất chậm trên tập dữ liệu lớn nên luôn ưu tiên thay bằng truy vấn tập hợp (Set-based) hoặc dùng cờ LOCAL FAST_FORWARD nếu bắt buộc.",
      "backend_scenario": "Chỉ dùng khi phải gọi một Stored Procedure hệ thống hoặc gửi thông báo cho từng đơn hàng chờ xử lý mà không thể thực hiện theo lô.",
      "tsql_code": "DECLARE @OrderID INT;\nDECLARE cur_Pending CURSOR LOCAL FAST_FORWARD FOR\n    SELECT OrderID FROM Orders WHERE Status = N'Chờ xử lý';\n\nOPEN cur_Pending;\nFETCH NEXT FROM cur_Pending INTO @OrderID;\nWHILE @@FETCH_STATUS = 0\nBEGIN\n    -- Xử lý từng đơn @OrderID\n    FETCH NEXT FROM cur_Pending INTO @OrderID;\nEND;\nCLOSE cur_Pending;\nDEALLOCATE cur_Pending;",
      "lab_sql": "SELECT OrderID, CustomerID, TotalAmount, Status FROM Orders WHERE Status = 'Chờ xử lý';",
      "output": {
        "cols": [
          "OrderID",
          "CustomerID",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            9,
            4,
            400000,
            "Chờ xử lý"
          ],
          [
            10,
            7,
            95000,
            "Chờ xử lý"
          ]
        ]
      },
      "part1_what": "Con trỏ duyệt từng dòng một (Row-By-Agonizing-Row - RBAR); rất chậm trên tập dữ liệu lớn nên luôn ưu tiên thay bằng truy vấn tập hợp (Set-based) hoặc dùng cờ LOCAL FAST_FORWARD nếu bắt buộc.",
      "part2_backend": "Chỉ dùng khi phải gọi một Stored Procedure hệ thống hoặc gửi thông báo cho từng đơn hàng chờ xử lý mà không thể thực hiện theo lô.",
      "part3_tsql": "DECLARE @OrderID INT;\nDECLARE cur_Pending CURSOR LOCAL FAST_FORWARD FOR\n    SELECT OrderID FROM Orders WHERE Status = N'Chờ xử lý';\n\nOPEN cur_Pending;\nFETCH NEXT FROM cur_Pending INTO @OrderID;\nWHILE @@FETCH_STATUS = 0\nBEGIN\n    -- Xử lý từng đơn @OrderID\n    FETCH NEXT FROM cur_Pending INTO @OrderID;\nEND;\nCLOSE cur_Pending;\nDEALLOCATE cur_Pending;",
      "part4_output": {
        "cols": [
          "OrderID",
          "CustomerID",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            9,
            4,
            400000,
            "Chờ xử lý"
          ],
          [
            10,
            7,
            95000,
            "Chờ xử lý"
          ]
        ]
      }
    },
    {
      "id": "kw_b16",
      "part": "B",
      "category": "15. Luồng điều khiển & Quản trị T-SQL",
      "keyword": "WHILE, BREAK, CONTINUE & WAITFOR DELAY",
      "what_it_does": "Vòng lặp điều khiển luồng trong T-SQL; thường kết hợp với TOP (BatchSize) và WAITFOR DELAY để xóa hoặc cập nhật dữ liệu lịch sử theo từng lô nhỏ (Batch Processing) tránh gây khóa bảng.",
      "backend_scenario": "Khi cần dọn dẹp 1 triệu đơn hàng đã hủy từ 3 năm trước, chia nhỏ mỗi lần xóa 5.000 dòng trong vòng lặp WHILE để không làm đầy Transaction Log và không gây Lock Escalation.",
      "tsql_code": "WHILE 1 = 1\nBEGIN\n    DELETE TOP (5000) FROM Orders\n    WHERE Status = N'Đã hủy' AND OrderDate < '2022-01-01';\n\n    IF @@ROWCOUNT = 0 BREAK;\n    WAITFOR DELAY '00:00:01'; -- Nghỉ 1 giây nhường I/O cho OLTP\nEND;",
      "lab_sql": "SELECT OrderID, OrderDate, TotalAmount, Status FROM Orders WHERE Status = 'Đã hủy';",
      "output": {
        "cols": [
          "OrderID",
          "OrderDate",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            7,
            "2024-02-14 11:20:00",
            180000,
            "Đã hủy"
          ]
        ]
      },
      "part1_what": "Vòng lặp điều khiển luồng trong T-SQL; thường kết hợp với TOP (BatchSize) và WAITFOR DELAY để xóa hoặc cập nhật dữ liệu lịch sử theo từng lô nhỏ (Batch Processing) tránh gây khóa bảng.",
      "part2_backend": "Khi cần dọn dẹp 1 triệu đơn hàng đã hủy từ 3 năm trước, chia nhỏ mỗi lần xóa 5.000 dòng trong vòng lặp WHILE để không làm đầy Transaction Log và không gây Lock Escalation.",
      "part3_tsql": "WHILE 1 = 1\nBEGIN\n    DELETE TOP (5000) FROM Orders\n    WHERE Status = N'Đã hủy' AND OrderDate < '2022-01-01';\n\n    IF @@ROWCOUNT = 0 BREAK;\n    WAITFOR DELAY '00:00:01'; -- Nghỉ 1 giây nhường I/O cho OLTP\nEND;",
      "part4_output": {
        "cols": [
          "OrderID",
          "OrderDate",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            7,
            "2024-02-14 11:20:00",
            180000,
            "Đã hủy"
          ]
        ]
      }
    },
    {
      "id": "kw_b17",
      "part": "B",
      "category": "15. Luồng điều khiển & Quản trị T-SQL",
      "keyword": "STUFF & FOR XML PATH (Gộp chuỗi phiên bản cũ)",
      "what_it_does": "Kỹ thuật gộp nhiều dòng thành một chuỗi phân cách bởi dấu phẩy trên các phiên bản SQL Server cũ (trước 2017 khi chưa có STRING_AGG), kết hợp hàm STUFF để cắt bỏ dấu phẩy thừa ở đầu.",
      "backend_scenario": "Khi bảo trì các dự án Enterprise .NET Framework hoặc Java cũ chạy trên SQL Server 2012/2014 và cần nối danh sách tên sản phẩm theo từng danh mục.",
      "tsql_code": "SELECT \n    c.CategoryID,\n    c.CategoryName,\n    STUFF((\n        SELECT N', ' + f.FruitName\n        FROM Fruits AS f\n        WHERE f.CategoryID = c.CategoryID\n        FOR XML PATH(''), TYPE\n    ).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS DanhSachTraiCay\nFROM Categories AS c\nWHERE c.CategoryID <= 2;",
      "lab_sql": "SELECT c.CategoryID, c.CategoryName, GROUP_CONCAT(f.FruitName, ', ') AS DanhSachTraiCay FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID WHERE c.CategoryID <= 2 GROUP BY c.CategoryID, c.CategoryName;",
      "output": {
        "cols": [
          "CategoryID",
          "CategoryName",
          "DanhSachTraiCay"
        ],
        "rows": [
          [
            1,
            "Đặc sản Miền Tây",
            "Sầu Riêng Ri6, Bưởi Da Xanh, Xoài Cát Hòa Lộc, Măng Cụt Lái Thiêu"
          ],
          [
            2,
            "Trái cây Nhập khẩu",
            "Nho Mẫu Đơn Shine Muscat, Táo Envy, Cherry Đỏ Thẫm, Kiwi Vàng"
          ]
        ]
      },
      "part1_what": "Kỹ thuật gộp nhiều dòng thành một chuỗi phân cách bởi dấu phẩy trên các phiên bản SQL Server cũ (trước 2017 khi chưa có STRING_AGG), kết hợp hàm STUFF để cắt bỏ dấu phẩy thừa ở đầu.",
      "part2_backend": "Khi bảo trì các dự án Enterprise .NET Framework hoặc Java cũ chạy trên SQL Server 2012/2014 và cần nối danh sách tên sản phẩm theo từng danh mục.",
      "part3_tsql": "SELECT \n    c.CategoryID,\n    c.CategoryName,\n    STUFF((\n        SELECT N', ' + f.FruitName\n        FROM Fruits AS f\n        WHERE f.CategoryID = c.CategoryID\n        FOR XML PATH(''), TYPE\n    ).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS DanhSachTraiCay\nFROM Categories AS c\nWHERE c.CategoryID <= 2;",
      "part4_output": {
        "cols": [
          "CategoryID",
          "CategoryName",
          "DanhSachTraiCay"
        ],
        "rows": [
          [
            1,
            "Đặc sản Miền Tây",
            "Sầu Riêng Ri6, Bưởi Da Xanh, Xoài Cát Hòa Lộc, Măng Cụt Lái Thiêu"
          ],
          [
            2,
            "Trái cây Nhập khẩu",
            "Nho Mẫu Đơn Shine Muscat, Táo Envy, Cherry Đỏ Thẫm, Kiwi Vàng"
          ]
        ]
      }
    },
    {
      "id": "kw_b18",
      "part": "B",
      "category": "15. Luồng điều khiển & Quản trị T-SQL",
      "keyword": "SET STATISTICS IO, TIME ON (Đo lường I/O & CPU)",
      "what_it_does": "Bật chế độ in thống kê số trang bộ nhớ (Logical Reads - mỗi trang 8KB) và thời gian CPU thực thi của câu lệnh ra tab Messages trong SSMS.",
      "backend_scenario": "Khi tối ưu một câu truy vấn chậm, đừng chỉ nhìn đồng hồ bấm giờ! Hãy bật STATISTICS IO ON để xem câu lệnh tốn bao nhiêu Logical Reads trước và sau khi đánh Index.",
      "tsql_code": "SET STATISTICS IO, TIME ON;\n\nSELECT f.FruitID, f.FruitName, c.CategoryName, f.Price\nFROM Fruits AS f\nINNER JOIN Categories AS c ON f.CategoryID = c.CategoryID\nWHERE f.Price > 200000;\n\nSET STATISTICS IO, TIME OFF;",
      "lab_sql": "SELECT f.FruitID, f.FruitName, c.CategoryName, f.Price FROM Fruits AS f INNER JOIN Categories AS c ON f.CategoryID = c.CategoryID WHERE f.Price > 200000;",
      "output": {
        "cols": [
          "FruitID",
          "FruitName",
          "CategoryName",
          "Price"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            "Trái cây Nhập khẩu",
            850000
          ],
          [
            6,
            "Táo Envy",
            "Trái cây Nhập khẩu",
            250000
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            "Trái cây Nhập khẩu",
            450000
          ],
          [
            10,
            "Việt Quất (Blueberry)",
            "Quả mọng (Berries)",
            350000
          ],
          [
            11,
            "Mâm Xôi Đen",
            "Quả mọng (Berries)",
            320000
          ],
          [
            14,
            "Hạt Mắc Ca",
            "Quả hạch (Nuts)",
            280000
          ]
        ]
      },
      "part1_what": "Bật chế độ in thống kê số trang bộ nhớ (Logical Reads - mỗi trang 8KB) và thời gian CPU thực thi của câu lệnh ra tab Messages trong SSMS.",
      "part2_backend": "Khi tối ưu một câu truy vấn chậm, đừng chỉ nhìn đồng hồ bấm giờ! Hãy bật STATISTICS IO ON để xem câu lệnh tốn bao nhiêu Logical Reads trước và sau khi đánh Index.",
      "part3_tsql": "SET STATISTICS IO, TIME ON;\n\nSELECT f.FruitID, f.FruitName, c.CategoryName, f.Price\nFROM Fruits AS f\nINNER JOIN Categories AS c ON f.CategoryID = c.CategoryID\nWHERE f.Price > 200000;\n\nSET STATISTICS IO, TIME OFF;",
      "part4_output": {
        "cols": [
          "FruitID",
          "FruitName",
          "CategoryName",
          "Price"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            "Trái cây Nhập khẩu",
            850000
          ],
          [
            6,
            "Táo Envy",
            "Trái cây Nhập khẩu",
            250000
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            "Trái cây Nhập khẩu",
            450000
          ],
          [
            10,
            "Việt Quất (Blueberry)",
            "Quả mọng (Berries)",
            350000
          ],
          [
            11,
            "Mâm Xôi Đen",
            "Quả mọng (Berries)",
            320000
          ],
          [
            14,
            "Hạt Mắc Ca",
            "Quả hạch (Nuts)",
            280000
          ]
        ]
      }
    },
    {
      "id": "kw_b19",
      "part": "B",
      "category": "15. Luồng điều khiển & Quản trị T-SQL",
      "keyword": "Query Hints: OPTION (RECOMPILE, MAXDOP, MAXRECURSION, OPTIMIZE FOR)",
      "what_it_does": "Chỉ thị trực tiếp cho Bộ tối ưu hóa truy vấn (Query Optimizer) ở cuối câu lệnh: biên dịch lại plan mới tránh Parameter Sniffing (RECOMPILE), giới hạn số luồng CPU (MAXDOP) hoặc giới hạn độ sâu đệ quy (MAXRECURSION).",
      "backend_scenario": "Khi Stored Procedure tìm kiếm đơn hàng chạy lúc nhanh lúc chậm bất thường do dữ liệu bị lệch (Skewed Data: khách VIP có 10.000 đơn, khách thường có 1 đơn), gắn OPTION (RECOMPILE) giúp tạo kế hoạch thực thi tối ưu riêng cho tham số hiện tại.",
      "tsql_code": "SELECT o.OrderID, o.CustomerID, o.TotalAmount, o.Status\nFROM Orders AS o\nWHERE o.CustomerID = 1\nOPTION (RECOMPILE, MAXDOP 2);",
      "lab_sql": "SELECT o.OrderID, o.CustomerID, o.TotalAmount, o.Status FROM Orders AS o WHERE o.CustomerID = 1;",
      "output": {
        "cols": [
          "OrderID",
          "CustomerID",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            1,
            1,
            850000,
            "Đã giao"
          ],
          [
            5,
            1,
            2500000,
            "Đã giao"
          ],
          [
            8,
            1,
            200000,
            "Đang giao"
          ]
        ]
      },
      "part1_what": "Chỉ thị trực tiếp cho Bộ tối ưu hóa truy vấn (Query Optimizer) ở cuối câu lệnh: biên dịch lại plan mới tránh Parameter Sniffing (RECOMPILE), giới hạn số luồng CPU (MAXDOP) hoặc giới hạn độ sâu đệ quy (MAXRECURSION).",
      "part2_backend": "Khi Stored Procedure tìm kiếm đơn hàng chạy lúc nhanh lúc chậm bất thường do dữ liệu bị lệch (Skewed Data: khách VIP có 10.000 đơn, khách thường có 1 đơn), gắn OPTION (RECOMPILE) giúp tạo kế hoạch thực thi tối ưu riêng cho tham số hiện tại.",
      "part3_tsql": "SELECT o.OrderID, o.CustomerID, o.TotalAmount, o.Status\nFROM Orders AS o\nWHERE o.CustomerID = 1\nOPTION (RECOMPILE, MAXDOP 2);",
      "part4_output": {
        "cols": [
          "OrderID",
          "CustomerID",
          "TotalAmount",
          "Status"
        ],
        "rows": [
          [
            1,
            1,
            850000,
            "Đã giao"
          ],
          [
            5,
            1,
            2500000,
            "Đã giao"
          ],
          [
            8,
            1,
            200000,
            "Đang giao"
          ]
        ]
      }
    },
    {
      "id": "kw_b20",
      "part": "B",
      "category": "15. Luồng điều khiển & Quản trị T-SQL",
      "keyword": "DBCC (SHOW_STATISTICS, FREEPROCCACHE, CHECKDB) & DMVs",
      "what_it_does": "Bộ lệnh điều khiển Console (DBCC) và các View quản trị động (sys.dm_*) để kiểm tra histogram thống kê của Index, xóa bộ nhớ đệm kế hoạch thực thi trên môi trường test hoặc tìm các truy vấn tốn CPU nhất.",
      "backend_scenario": "Khi DBA hoặc Senior Backend cần kiểm tra xem tại sao Query Optimizer lại chọn Table Scan thay vì Index Seek bằng cách xem bảng phân phối dữ liệu (Histogram) qua DBCC SHOW_STATISTICS.",
      "tsql_code": "-- Xem thống kê phân phối dữ liệu của Index:\nDBCC SHOW_STATISTICS ('dbo.Orders', 'PK_Orders');\n\n-- Kiểm tra số dòng và dung lượng các bảng trong DB FruitStore:\nSELECT t.name AS TableName, p.rows AS RowCounts\nFROM sys.tables AS t\nINNER JOIN sys.partitions AS p ON t.object_id = p.object_id AND p.index_id IN (0, 1);",
      "lab_sql": "SELECT 'Employees' AS TableName, COUNT(*) AS RowCounts FROM Employees UNION ALL SELECT 'Categories', COUNT(*) FROM Categories UNION ALL SELECT 'Fruits', COUNT(*) FROM Fruits UNION ALL SELECT 'Customers', COUNT(*) FROM Customers UNION ALL SELECT 'Vouchers', COUNT(*) FROM Vouchers UNION ALL SELECT 'Orders', COUNT(*) FROM Orders UNION ALL SELECT 'OrderDetails', COUNT(*) FROM OrderDetails UNION ALL SELECT 'Reviews', COUNT(*) FROM Reviews UNION ALL SELECT 'PaymentTransactions', COUNT(*) FROM PaymentTransactions;",
      "output": {
        "cols": [
          "TableName",
          "RowCounts"
        ],
        "rows": [
          [
            "Employees",
            7
          ],
          [
            "Categories",
            5
          ],
          [
            "Fruits",
            14
          ],
          [
            "Customers",
            8
          ],
          [
            "Vouchers",
            3
          ],
          [
            "Orders",
            10
          ],
          [
            "OrderDetails",
            13
          ],
          [
            "Reviews",
            4
          ],
          [
            "PaymentTransactions",
            6
          ]
        ]
      },
      "part1_what": "Bộ lệnh điều khiển Console (DBCC) và các View quản trị động (sys.dm_*) để kiểm tra histogram thống kê của Index, xóa bộ nhớ đệm kế hoạch thực thi trên môi trường test hoặc tìm các truy vấn tốn CPU nhất.",
      "part2_backend": "Khi DBA hoặc Senior Backend cần kiểm tra xem tại sao Query Optimizer lại chọn Table Scan thay vì Index Seek bằng cách xem bảng phân phối dữ liệu (Histogram) qua DBCC SHOW_STATISTICS.",
      "part3_tsql": "-- Xem thống kê phân phối dữ liệu của Index:\nDBCC SHOW_STATISTICS ('dbo.Orders', 'PK_Orders');\n\n-- Kiểm tra số dòng và dung lượng các bảng trong DB FruitStore:\nSELECT t.name AS TableName, p.rows AS RowCounts\nFROM sys.tables AS t\nINNER JOIN sys.partitions AS p ON t.object_id = p.object_id AND p.index_id IN (0, 1);",
      "part4_output": {
        "cols": [
          "TableName",
          "RowCounts"
        ],
        "rows": [
          [
            "Employees",
            7
          ],
          [
            "Categories",
            5
          ],
          [
            "Fruits",
            14
          ],
          [
            "Customers",
            8
          ],
          [
            "Vouchers",
            3
          ],
          [
            "Orders",
            10
          ],
          [
            "OrderDetails",
            13
          ],
          [
            "Reviews",
            4
          ],
          [
            "PaymentTransactions",
            6
          ]
        ]
      }
    }
  ],
  "examples": [
    {
      "title": "Ví dụ 1: Thống kê doanh thu thực thu và số tiền giảm giá theo từng khách hàng trên DB FruitStore",
      "tag": "CHUẨN",
      "db": "fruitstore",
      "desc": "Kết hợp LEFT JOIN, COALESCE/IFNULL, GROUP BY và hàm tổng hợp để lên bảng tổng kết chi tiêu của toàn bộ khách hàng (kể cả khách chưa mua đơn nào).",
      "sql": "SELECT \n    c.CustomerID,\n    c.FullName,\n    c.CustomerType,\n    COUNT(o.OrderID) AS SoDonDaGiao,\n    COALESCE(SUM(o.TotalAmount), 0) AS TongChiTieu\nFROM Customers AS c\nLEFT JOIN Orders AS o ON c.CustomerID = o.CustomerID AND o.Status = 'Đã giao'\nGROUP BY c.CustomerID, c.FullName, c.CustomerType\nORDER BY TongChiTieu DESC, c.CustomerID ASC;",
      "tsql_equiv": "SELECT c.CustomerID, c.FullName, c.CustomerType, COUNT(o.OrderID) AS SoDonDaGiao, ISNULL(SUM(o.TotalAmount), 0) AS TongChiTieu FROM Customers c LEFT JOIN Orders o ON c.CustomerID = o.CustomerID AND o.Status = N'Đã giao' GROUP BY c.CustomerID, c.FullName, c.CustomerType ORDER BY TongChiTieu DESC;",
      "label": "CHUAN",
      "note": "Kết hợp LEFT JOIN, COALESCE/IFNULL, GROUP BY và hàm tổng hợp để lên bảng tổng kết chi tiêu của toàn bộ khách hàng (kể cả khách chưa mua đơn nào). | T-SQL tương đương: SELECT c.CustomerID, c.FullName, c.CustomerType, COUNT(o.OrderID) AS SoDonDaGiao, ISNULL(SUM(o.TotalAmount), 0) AS TongChiTieu FROM Customers c LEFT JOIN Orders o ON c.CustomerID = o.CustomerID AND o.Status = N'Đã giao' GROUP BY c.CustomerID, c.FullName, c.CustomerType ORDER BY TongChiTieu DESC;",
      "result": {
        "cols": [
          "CustomerID",
          "FullName",
          "CustomerType",
          "SoDonDaGiao",
          "TongChiTieu"
        ],
        "rows": [
          [
            1,
            "Võ Thành Tài",
            "VIP",
            2,
            3350000
          ],
          [
            4,
            "Triệu Mẫn",
            "VIP",
            1,
            850000
          ],
          [
            5,
            "Chu Chỉ Nhược",
            "Standard",
            1,
            300000
          ],
          [
            2,
            "Nguyễn Thị Lệ",
            "Standard",
            1,
            180000
          ],
          [
            3,
            "Trương Vô Kỵ",
            "Standard",
            1,
            150000
          ],
          [
            6,
            "Ân Ly",
            "Standard",
            0,
            0
          ],
          [
            7,
            "Tiểu Chiêu",
            "Standard",
            0,
            0
          ],
          [
            8,
            "Dương Quá",
            "Standard",
            0,
            0
          ]
        ]
      }
    },
    {
      "title": "Ví dụ 2: Bóc tách thuộc tính JSON của trái cây kết hợp xếp hạng giá trong từng danh mục",
      "tag": "CHUẨN",
      "db": "fruitstore",
      "desc": "Kết hợp hàm JSON và Window Function DENSE_RANK() trên CSDL FruitStore_Ultimate.",
      "sql": "SELECT \n    c.CategoryName,\n    f.FruitName,\n    f.Price,\n    COALESCE(json_extract(f.AttributesJSON, '$.Taste'), 'N/A') AS Taste,\n    DENSE_RANK() OVER (PARTITION BY f.CategoryID ORDER BY f.Price DESC) AS PriceRank\nFROM Fruits AS f\nINNER JOIN Categories AS c ON f.CategoryID = c.CategoryID\nORDER BY f.CategoryID, PriceRank;",
      "tsql_equiv": "SELECT c.CategoryName, f.FruitName, f.Price, ISNULL(JSON_VALUE(f.AttributesJSON, '$.Taste'), 'N/A') AS Taste, DENSE_RANK() OVER (PARTITION BY f.CategoryID ORDER BY f.Price DESC) AS PriceRank FROM Fruits f INNER JOIN Categories c ON f.CategoryID = c.CategoryID ORDER BY f.CategoryID, PriceRank;",
      "label": "CHUAN",
      "note": "Kết hợp hàm JSON và Window Function DENSE_RANK() trên CSDL FruitStore_Ultimate. | T-SQL tương đương: SELECT c.CategoryName, f.FruitName, f.Price, ISNULL(JSON_VALUE(f.AttributesJSON, '$.Taste'), 'N/A') AS Taste, DENSE_RANK() OVER (PARTITION BY f.CategoryID ORDER BY f.Price DESC) AS PriceRank FROM Fruits f INNER JOIN Categories c ON f.CategoryID = c.CategoryID ORDER BY f.CategoryID, PriceRank;",
      "result": {
        "cols": [
          "CategoryName",
          "FruitName",
          "Price",
          "Taste",
          "PriceRank"
        ],
        "rows": [
          [
            "Đặc sản Miền Tây",
            "Sầu Riêng Ri6",
            150000,
            "Sweet",
            1
          ],
          [
            "Đặc sản Miền Tây",
            "Măng Cụt Lái Thiêu",
            95000,
            "Sweet-Sour",
            2
          ],
          [
            "Đặc sản Miền Tây",
            "Xoài Cát Hòa Lộc",
            80000,
            "Sweet",
            3
          ],
          [
            "Đặc sản Miền Tây",
            "Bưởi Da Xanh",
            70000,
            "Sour",
            4
          ],
          [
            "Trái cây Nhập khẩu",
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            "Very Sweet",
            1
          ],
          [
            "Trái cây Nhập khẩu",
            "Cherry Đỏ Thẫm",
            450000,
            "Sweet",
            2
          ],
          [
            "Trái cây Nhập khẩu",
            "Táo Envy",
            250000,
            "Crisp Sweet",
            3
          ],
          [
            "Trái cây Nhập khẩu",
            "Kiwi Vàng",
            180000,
            "Sweet-Sour",
            4
          ],
          [
            "Quả mọng (Berries)",
            "Việt Quất (Blueberry)",
            350000,
            "Sweet-Sour",
            1
          ],
          [
            "Quả mọng (Berries)",
            "Mâm Xôi Đen",
            320000,
            "Sour",
            2
          ],
          [
            "Quả mọng (Berries)",
            "Dâu Tây Mộc Châu",
            200000,
            "Sour",
            3
          ],
          [
            "Trái cây sấy",
            "Nho khô Ninh Thuận",
            120000,
            "N/A",
            1
          ],
          [
            "Trái cây sấy",
            "Mít sấy giòn",
            60000,
            "N/A",
            2
          ],
          [
            "Quả hạch (Nuts)",
            "Hạt Mắc Ca",
            280000,
            "Rich",
            1
          ]
        ]
      }
    }
  ],
  "dialects": [
    [
      "Giới hạn số dòng & Phân trang",
      "TOP (N) WITH TIES / OFFSET M ROWS FETCH NEXT N ROWS ONLY",
      "LIMIT M, N hoặc LIMIT N OFFSET M",
      "PG: LIMIT N OFFSET M / FETCH FIRST N ROWS WITH TIES | SQLite: LIMIT N OFFSET M"
    ],
    [
      "Gộp chuỗi theo nhóm (String Aggregation)",
      "STRING_AGG(col, ', ') WITHIN GROUP (ORDER BY col)",
      "GROUP_CONCAT(col ORDER BY col SEPARATOR ', ')",
      "PG: STRING_AGG(col, ', ' ORDER BY col) | SQLite: GROUP_CONCAT(col, ', ')"
    ],
    [
      "Truy vấn JSON trong cột",
      "JSON_VALUE(col, '$.key'), OPENJSON(col)",
      "JSON_UNQUOTE(JSON_EXTRACT(col, '$.key')), JSON_TABLE",
      "PG: col->>'key', jsonb_array_elements(col) | SQLite: json_extract(col, '$.key'), json_each(col)"
    ]
  ],
  "bridge_java": "// Spring Data JPA / JDBC Template gọi báo cáo doanh thu khách hàng trên DB FruitStore:\npublic record CustomerSpendDTO(int customerId, String fullName, String customerType, long orderCount, BigDecimal totalSpend) {}\n\npublic List<CustomerSpendDTO> getCustomerSpendingReport(JdbcTemplate jdbc) {\n    String sql = \"\"\"\n        SELECT c.CustomerID, c.FullName, c.CustomerType,\n               COUNT(o.OrderID) AS SoDonDaGiao,\n               COALESCE(SUM(o.TotalAmount), 0) AS TongChiTieu\n        FROM Customers c\n        LEFT JOIN Orders o ON c.CustomerID = o.CustomerID AND o.Status = N'Đã giao'\n        GROUP BY c.CustomerID, c.FullName, c.CustomerType\n        ORDER BY TongChiTieu DESC\n        \"\"\";\n    return jdbc.query(sql, (rs, rowNum) -> new CustomerSpendDTO(\n        rs.getInt(\"CustomerID\"),\n        rs.getString(\"FullName\"),\n        rs.getString(\"CustomerType\"),\n        rs.getLong(\"SoDonDaGiao\"),\n        rs.getBigDecimal(\"TongChiTieu\")\n    ));\n}",
  "bridge_csharp": "// C# Dapper thực thi giao dịch đặt hàng và đọc JSON trên DB FruitStore_Ultimate:\npublic sealed record FruitDto(int FruitID, string FruitName, decimal Price, string? Taste);\n\npublic async Task<IEnumerable<FruitDto>> GetSweetFruitsAsync(IDbConnection conn)\n{\n    const string sql = @\"\n        SELECT FruitID, FruitName, Price,\n               JSON_VALUE(AttributesJSON, '$.Taste') AS Taste\n        FROM dbo.Fruits\n        WHERE JSON_VALUE(AttributesJSON, '$.Taste') LIKE '%Sweet%'\n          AND IsActive = 1\n        ORDER BY Price DESC;\";\n    return await conn.QueryAsync<FruitDto>(sql);\n}",
  "performance": "<ul><li>Luôn kiểm tra tính SARGable của các từ khóa lọc trong mệnh đề WHERE: dùng phạm vi thời gian (OrderDate >= '2024-01-01' AND OrderDate < '2025-01-01') thay vì bọc hàm YEAR(OrderDate) = 2024 để tận dụng Index Seek.</li><li>Khi cần kiểm tra tồn tại dòng ở bảng liên kết (như kiểm tra khách hàng đã từng mua hàng hay chưa), luôn ưu tiên EXISTS / NOT EXISTS thay vì IN / NOT IN hoặc DISTINCT + JOIN.</li><li>Khi truy vấn thường xuyên trên một thuộc tính nằm trong cột JSON (như JSON_VALUE(AttributesJSON, '$.Taste')), hãy tạo một Computed Column cho biểu thức đó rồi đánh Non-Clustered Index lên cột tính toán.</li></ul>",
  "common_errors": [
    "Dùng NOT IN với một subquery có khả năng chứa giá trị NULL (như SELECT ManagerID FROM Employees) khiến kết quả trả về 0 dòng.",
    "Đặt điều kiện lọc của bảng bên phải trong mệnh đề WHERE khi dùng LEFT JOIN (ví dụ: LEFT JOIN Orders o ... WHERE o.Status = N'Đã giao') làm mất hết các khách hàng chưa có đơn và biến LEFT JOIN thành INNER JOIN.",
    "Viết Trigger chỉ lấy 1 dòng vào biến đơn lẻ (SELECT @id = FruitID FROM inserted) thay vì viết câu lệnh JOIN theo tập hợp với bảng inserted, dẫn đến sai dữ liệu khi chèn nhiều dòng cùng lúc (Multi-row INSERT)."
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "Sự khác biệt cốt lõi giữa WHERE và HAVING trong thứ tự thực thi câu lệnh SQL là gì?",
      "full": "Theo thứ tự thực thi logic: FROM/JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> OFFSET/FETCH. Vì WHERE chạy trước GROUP BY nên WHERE không thể chứa hàm tổng hợp (như SUM, COUNT), nhưng WHERE giúp giảm số dòng phải đưa vào bước gom nhóm nên luôn phải ưu tiên lọc ở WHERE trước.",
      "a_short": "WHERE lọc từng dòng dữ liệu gốc trước khi gom nhóm (GROUP BY), còn HAVING lọc các nhóm sau khi đã thực hiện GROUP BY và tính hàm tổng hợp.",
      "a_long": "WHERE lọc từng dòng dữ liệu gốc trước khi gom nhóm (GROUP BY), còn HAVING lọc các nhóm sau khi đã thực hiện GROUP BY và tính hàm tổng hợp."
    },
    {
      "level": "Junior",
      "q": "Khi nào lập trình viên Backend bắt buộc phải dùng CROSS APPLY / OUTER APPLY thay vì INNER JOIN / LEFT JOIN?",
      "full": "Với INNER JOIN / LEFT JOIN chuẩn, hai bảng được đánh giá độc lập rồi mới ghép theo điều kiện ON. Ngược lại, CROSS APPLY / OUTER APPLY cho phép biểu thức bảng bên phải tham chiếu trực tiếp tới cột của dòng hiện tại ở bảng bên trái (giống LATERAL JOIN trong PostgreSQL), rất hữu ích khi gọi hàm OPENJSON(f.AttributesJSON) hoặc lấy Top 1 đơn hàng mới nhất của từng khách hàng.",
      "a_short": "Khi cần truyền giá trị cột của bảng bên trái vào một Table-Valued Function (như OPENJSON, STRING_SPLIT) hoặc cần lấy Top-N dòng con cho mỗi dòng cha.",
      "a_long": "Khi cần truyền giá trị cột của bảng bên trái vào một Table-Valued Function (như OPENJSON, STRING_SPLIT) hoặc cần lấy Top-N dòng con cho mỗi dòng cha."
    },
    {
      "level": "Mid",
      "q": "Làm sao để xử lý bài toán 100 khách hàng cùng bấm mua 1 chùm Nho Mẫu Đơn cuối cùng trong kho (StockQuantity = 1) mà không bị âm kho (Overselling)?",
      "full": "Có 2 cách chuẩn Enterprise: (1) Cách nguyên tử 1 câu lệnh: chạy trực tiếp UPDATE Fruits SET StockQuantity = StockQuantity - @Qty WHERE FruitID = @Id AND StockQuantity >= @Qty rồi kiểm tra @@ROWCOUNT; nếu @@ROWCOUNT = 0 thì báo hết hàng và rollback. (2) Nếu cần đọc tồn kho ra tính toán phức tạp ở giữa giao dịch trước khi UPDATE, bắt buộc phải gắn WITH (UPDLOCK, ROWLOCK) vào câu SELECT để giữ khóa cập nhật ngay từ lúc đọc, ngăn giao dịch khác đọc trùng số tồn kho cũ.",
      "a_short": "Sử dụng giao dịch kèm khóa cập nhật cấp dòng WITH (UPDLOCK, ROWLOCK) khi đọc kiểm tra tồn kho, hoặc cập nhật nguyên tử UPDATE Fruits SET StockQuantity = StockQuantity - 1 WHERE FruitID = 5 AND StockQuantity >= 1.",
      "a_long": "Sử dụng giao dịch kèm khóa cập nhật cấp dòng WITH (UPDLOCK, ROWLOCK) khi đọc kiểm tra tồn kho, hoặc cập nhật nguyên tử UPDATE Fruits SET StockQuantity = StockQuantity - 1 WHERE FruitID = 5 AND StockQuantity >= 1."
    }
  ],
  "basics": [
    {
      "id": "ch15_b1",
      "title": "Bài cơ bản 1 (FruitStore): Lọc danh sách trái cây nhập khẩu còn hàng",
      "db": "fruitstore",
      "order_matters": true,
      "prompt": "Hãy lấy ra các cột `FruitID`, `FruitName`, `Price`, `Origin` từ bảng `Fruits` thuộc danh mục Trái cây Nhập khẩu (`CategoryID = 2`) và có tồn kho `StockQuantity > 0`. Sắp xếp theo `Price` giảm dần.",
      "hints": [
        "Dùng mệnh đề WHERE kết hợp hai điều kiện bằng AND.",
        "SELECT FruitID, FruitName, Price, Origin FROM Fruits WHERE CategoryID = 2 AND StockQuantity > 0 ORDER BY ...;",
        "SELECT FruitID, FruitName, Price, Origin FROM Fruits WHERE CategoryID = 2 AND StockQuantity > 0 ORDER BY Price DESC;"
      ],
      "solution_sql": "SELECT FruitID, FruitName, Price, Origin FROM Fruits WHERE CategoryID = 2 AND StockQuantity > 0 ORDER BY Price DESC;",
      "num": 1,
      "problem": "Hãy lấy ra các cột `FruitID`, `FruitName`, `Price`, `Origin` từ bảng `Fruits` thuộc danh mục Trái cây Nhập khẩu (`CategoryID = 2`) và có tồn kho `StockQuantity > 0`. Sắp xếp theo `Price` giảm dần.",
      "sql": "SELECT FruitID, FruitName, Price, Origin FROM Fruits WHERE CategoryID = 2 AND StockQuantity > 0 ORDER BY Price DESC;",
      "intuition": "Dùng mệnh đề WHERE kết hợp hai điều kiện bằng AND.",
      "trace": "SELECT FruitID, FruitName, Price, Origin FROM Fruits WHERE CategoryID = 2 AND StockQuantity > 0 ORDER BY ...;",
      "expected": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "Origin"
        ],
        "rows": [
          [
            5,
            "Nho Mẫu Đơn Shine Muscat",
            850000,
            "Hàn Quốc"
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            450000,
            "Úc"
          ],
          [
            6,
            "Táo Envy",
            250000,
            "Mỹ"
          ],
          [
            8,
            "Kiwi Vàng",
            180000,
            "New Zealand"
          ]
        ]
      }
    },
    {
      "id": "ch15_b2",
      "title": "Bài cơ bản 2 (FruitStore): Tìm khách hàng chưa từng đặt đơn hàng nào",
      "db": "fruitstore",
      "order_matters": true,
      "prompt": "Sử dụng `LEFT JOIN` hoặc `NOT EXISTS` để lấy ra `CustomerID`, `FullName`, `PhoneNumber` của những khách hàng trong bảng `Customers` chưa có bất kỳ đơn hàng nào trong bảng `Orders`. Sắp xếp theo `CustomerID` tăng dần.",
      "hints": [
        "Kết nối Customers LEFT JOIN Orders theo CustomerID rồi lọc các dòng có OrderID IS NULL.",
        "SELECT c.CustomerID, c.FullName, c.PhoneNumber FROM Customers c LEFT JOIN Orders o ON c.CustomerID = o.CustomerID WHERE ...;",
        "SELECT c.CustomerID, c.FullName, c.PhoneNumber FROM Customers c LEFT JOIN Orders o ON c.CustomerID = o.CustomerID WHERE o.OrderID IS NULL ORDER BY c.CustomerID ASC;"
      ],
      "solution_sql": "SELECT c.CustomerID, c.FullName, c.PhoneNumber FROM Customers c LEFT JOIN Orders o ON c.CustomerID = o.CustomerID WHERE o.OrderID IS NULL ORDER BY c.CustomerID ASC;",
      "num": 2,
      "problem": "Sử dụng `LEFT JOIN` hoặc `NOT EXISTS` để lấy ra `CustomerID`, `FullName`, `PhoneNumber` của những khách hàng trong bảng `Customers` chưa có bất kỳ đơn hàng nào trong bảng `Orders`. Sắp xếp theo `CustomerID` tăng dần.",
      "sql": "SELECT c.CustomerID, c.FullName, c.PhoneNumber FROM Customers c LEFT JOIN Orders o ON c.CustomerID = o.CustomerID WHERE o.OrderID IS NULL ORDER BY c.CustomerID ASC;",
      "intuition": "Kết nối Customers LEFT JOIN Orders theo CustomerID rồi lọc các dòng có OrderID IS NULL.",
      "trace": "SELECT c.CustomerID, c.FullName, c.PhoneNumber FROM Customers c LEFT JOIN Orders o ON c.CustomerID = o.CustomerID WHERE ...;",
      "expected": {
        "cols": [
          "CustomerID",
          "FullName",
          "PhoneNumber"
        ],
        "rows": [
          [
            8,
            "Dương Quá",
            "0908888999"
          ]
        ]
      }
    },
    {
      "id": "ch15_b3",
      "title": "Bài cơ bản 3 (FruitStore): Thống kê số mặt hàng và tổng tồn kho theo từng danh mục",
      "db": "fruitstore",
      "order_matters": true,
      "prompt": "Kết nối bảng `Categories` và `Fruits`, tính số lượng mặt hàng (`SoMatHang`) và tổng số lượng tồn kho (`TongTonKho`) của mỗi danh mục. Hiển thị `CategoryID`, `CategoryName`, `SoMatHang`, `TongTonKho`, sắp xếp theo `CategoryID` tăng dần.",
      "hints": [
        "Dùng COUNT(f.FruitID) và SUM(f.StockQuantity) đi kèm GROUP BY c.CategoryID, c.CategoryName.",
        "SELECT c.CategoryID, c.CategoryName, COUNT(f.FruitID) AS SoMatHang, SUM(f.StockQuantity) AS TongTonKho FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID GROUP BY ...;",
        "SELECT c.CategoryID, c.CategoryName, COUNT(f.FruitID) AS SoMatHang, SUM(f.StockQuantity) AS TongTonKho FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID GROUP BY c.CategoryID, c.CategoryName ORDER BY c.CategoryID ASC;"
      ],
      "solution_sql": "SELECT c.CategoryID, c.CategoryName, COUNT(f.FruitID) AS SoMatHang, SUM(f.StockQuantity) AS TongTonKho FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID GROUP BY c.CategoryID, c.CategoryName ORDER BY c.CategoryID ASC;",
      "num": 3,
      "problem": "Kết nối bảng `Categories` và `Fruits`, tính số lượng mặt hàng (`SoMatHang`) và tổng số lượng tồn kho (`TongTonKho`) của mỗi danh mục. Hiển thị `CategoryID`, `CategoryName`, `SoMatHang`, `TongTonKho`, sắp xếp theo `CategoryID` tăng dần.",
      "sql": "SELECT c.CategoryID, c.CategoryName, COUNT(f.FruitID) AS SoMatHang, SUM(f.StockQuantity) AS TongTonKho FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID GROUP BY c.CategoryID, c.CategoryName ORDER BY c.CategoryID ASC;",
      "intuition": "Dùng COUNT(f.FruitID) và SUM(f.StockQuantity) đi kèm GROUP BY c.CategoryID, c.CategoryName.",
      "trace": "SELECT c.CategoryID, c.CategoryName, COUNT(f.FruitID) AS SoMatHang, SUM(f.StockQuantity) AS TongTonKho FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID GROUP BY ...;",
      "expected": {
        "cols": [
          "CategoryID",
          "CategoryName",
          "SoMatHang",
          "TongTonKho"
        ],
        "rows": [
          [
            1,
            "Đặc sản Miền Tây",
            4,
            450
          ],
          [
            2,
            "Trái cây Nhập khẩu",
            4,
            205
          ],
          [
            3,
            "Quả mọng (Berries)",
            3,
            65
          ],
          [
            4,
            "Trái cây sấy",
            2,
            450
          ],
          [
            5,
            "Quả hạch (Nuts)",
            1,
            90
          ]
        ]
      }
    },
    {
      "id": "ch15_b4",
      "title": "Bài cơ bản 4 (FruitStore): Hiển thị nhân viên kèm tên người quản lý trực tiếp",
      "db": "fruitstore",
      "order_matters": true,
      "prompt": "Dùng kỹ thuật Self-Join trên bảng `Employees` để lấy ra `EmployeeID`, `FullName`, `Role` và cột `ManagerName` (nếu `ManagerID` là NULL thì hiển thị `'Không có'`). Sắp xếp theo `EmployeeID` tăng dần.",
      "hints": [
        "Kết nối bảng Employees e LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID và dùng COALESCE(m.FullName, 'Không có').",
        "SELECT e.EmployeeID, e.FullName, e.Role, COALESCE(m.FullName, 'Không có') AS ManagerName FROM Employees e LEFT JOIN Employees m ON ...;",
        "SELECT e.EmployeeID, e.FullName, e.Role, COALESCE(m.FullName, 'Không có') AS ManagerName FROM Employees e LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID ORDER BY e.EmployeeID ASC;"
      ],
      "solution_sql": "SELECT e.EmployeeID, e.FullName, e.Role, COALESCE(m.FullName, 'Không có') AS ManagerName FROM Employees e LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID ORDER BY e.EmployeeID ASC;",
      "num": 4,
      "problem": "Dùng kỹ thuật Self-Join trên bảng `Employees` để lấy ra `EmployeeID`, `FullName`, `Role` và cột `ManagerName` (nếu `ManagerID` là NULL thì hiển thị `'Không có'`). Sắp xếp theo `EmployeeID` tăng dần.",
      "sql": "SELECT e.EmployeeID, e.FullName, e.Role, COALESCE(m.FullName, 'Không có') AS ManagerName FROM Employees e LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID ORDER BY e.EmployeeID ASC;",
      "intuition": "Kết nối bảng Employees e LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID và dùng COALESCE(m.FullName, 'Không có').",
      "trace": "SELECT e.EmployeeID, e.FullName, e.Role, COALESCE(m.FullName, 'Không có') AS ManagerName FROM Employees e LEFT JOIN Employees m ON ...;",
      "expected": {
        "cols": [
          "EmployeeID",
          "FullName",
          "Role",
          "ManagerName"
        ],
        "rows": [
          [
            1,
            "Lê Minh Triết",
            "Giám đốc",
            "Không có"
          ],
          [
            2,
            "Nguyễn Tấn Dũng",
            "Quản lý Kho",
            "Lê Minh Triết"
          ],
          [
            3,
            "Trần Thị Mai",
            "Quản lý Bán hàng",
            "Lê Minh Triết"
          ],
          [
            4,
            "Phạm Văn A",
            "Nhân viên Kho",
            "Nguyễn Tấn Dũng"
          ],
          [
            5,
            "Lý Bạch",
            "Nhân viên Kho",
            "Nguyễn Tấn Dũng"
          ],
          [
            6,
            "Hoàng Cúc",
            "Nhân viên Bán hàng",
            "Trần Thị Mai"
          ],
          [
            7,
            "Đinh Hợi",
            "Nhân viên Bán hàng",
            "Trần Thị Mai"
          ]
        ]
      }
    },
    {
      "id": "ch15_b5",
      "title": "Bài cơ bản 5 (FruitStore): Lọc các loại trái cây có vị ngọt từ cột JSON",
      "db": "fruitstore",
      "order_matters": true,
      "prompt": "Truy vấn bảng `Fruits`, trích xuất thuộc tính `$.Taste` từ cột `AttributesJSON` (dùng `json_extract(AttributesJSON, '$.Taste')` trên Lab SQLite tương đương `JSON_VALUE` của T-SQL). Lọc các sản phẩm có Taste bằng `'Sweet'`, hiển thị `FruitID`, `FruitName`, `Price`, `Origin` theo `FruitID` tăng dần.",
      "hints": [
        "Dùng json_extract(AttributesJSON, '$.Taste') = 'Sweet' trong mệnh đề WHERE.",
        "SELECT FruitID, FruitName, Price, Origin FROM Fruits WHERE json_extract(AttributesJSON, '$.Taste') = 'Sweet' ORDER BY FruitID ASC;",
        "SELECT FruitID, FruitName, Price, Origin FROM Fruits WHERE json_extract(AttributesJSON, '$.Taste') = 'Sweet' ORDER BY FruitID ASC;"
      ],
      "solution_sql": "SELECT FruitID, FruitName, Price, Origin FROM Fruits WHERE json_extract(AttributesJSON, '$.Taste') = 'Sweet' ORDER BY FruitID ASC;",
      "num": 5,
      "problem": "Truy vấn bảng `Fruits`, trích xuất thuộc tính `$.Taste` từ cột `AttributesJSON` (dùng `json_extract(AttributesJSON, '$.Taste')` trên Lab SQLite tương đương `JSON_VALUE` của T-SQL). Lọc các sản phẩm có Taste bằng `'Sweet'`, hiển thị `FruitID`, `FruitName`, `Price`, `Origin` theo `FruitID` tăng dần.",
      "sql": "SELECT FruitID, FruitName, Price, Origin FROM Fruits WHERE json_extract(AttributesJSON, '$.Taste') = 'Sweet' ORDER BY FruitID ASC;",
      "intuition": "Dùng json_extract(AttributesJSON, '$.Taste') = 'Sweet' trong mệnh đề WHERE.",
      "trace": "SELECT FruitID, FruitName, Price, Origin FROM Fruits WHERE json_extract(AttributesJSON, '$.Taste') = 'Sweet' ORDER BY FruitID ASC;",
      "expected": {
        "cols": [
          "FruitID",
          "FruitName",
          "Price",
          "Origin"
        ],
        "rows": [
          [
            1,
            "Sầu Riêng Ri6",
            150000,
            "Bến Tre"
          ],
          [
            3,
            "Xoài Cát Hòa Lộc",
            80000,
            "Tiền Giang"
          ],
          [
            7,
            "Cherry Đỏ Thẫm",
            450000,
            "Úc"
          ]
        ]
      }
    },
    {
      "id": "ch15_b6",
      "title": "Bài cơ bản 6 (FruitStore): Thống kê doanh thu theo phương thức thanh toán",
      "db": "fruitstore",
      "order_matters": true,
      "prompt": "Từ bảng `PaymentTransactions`, hãy gom nhóm theo `PaymentMethod` để tính số giao dịch (`SoGiaoDich`) và tổng số tiền (`TongTien`). Sắp xếp theo `TongTien` giảm dần.",
      "hints": [
        "Dùng COUNT(*) và SUM(Amount) kết hợp GROUP BY PaymentMethod.",
        "SELECT PaymentMethod, COUNT(*) AS SoGiaoDich, SUM(Amount) AS TongTien FROM PaymentTransactions GROUP BY PaymentMethod ORDER BY TongTien DESC;",
        "SELECT PaymentMethod, COUNT(*) AS SoGiaoDich, SUM(Amount) AS TongTien FROM PaymentTransactions GROUP BY PaymentMethod ORDER BY TongTien DESC;"
      ],
      "solution_sql": "SELECT PaymentMethod, COUNT(*) AS SoGiaoDich, SUM(Amount) AS TongTien FROM PaymentTransactions GROUP BY PaymentMethod ORDER BY TongTien DESC;",
      "num": 6,
      "problem": "Từ bảng `PaymentTransactions`, hãy gom nhóm theo `PaymentMethod` để tính số giao dịch (`SoGiaoDich`) và tổng số tiền (`TongTien`). Sắp xếp theo `TongTien` giảm dần.",
      "sql": "SELECT PaymentMethod, COUNT(*) AS SoGiaoDich, SUM(Amount) AS TongTien FROM PaymentTransactions GROUP BY PaymentMethod ORDER BY TongTien DESC;",
      "intuition": "Dùng COUNT(*) và SUM(Amount) kết hợp GROUP BY PaymentMethod.",
      "trace": "SELECT PaymentMethod, COUNT(*) AS SoGiaoDich, SUM(Amount) AS TongTien FROM PaymentTransactions GROUP BY PaymentMethod ORDER BY TongTien DESC;",
      "expected": {
        "cols": [
          "PaymentMethod",
          "SoGiaoDich",
          "TongTien"
        ],
        "rows": [
          [
            "VNPAY",
            3,
            4200000
          ],
          [
            "Momo",
            2,
            450000
          ],
          [
            "Tiền mặt",
            1,
            200000
          ]
        ]
      }
    }
  ],
  "practice": [
    {
      "id": "ch15_p1",
      "title": "Bài thực hành 1 (FruitStore): Tìm sản phẩm đắt nhất trong từng danh mục (Window Function)",
      "db": "fruitstore",
      "order_matters": true,
      "prompt": "Sử dụng CTE và hàm cửa sổ `ROW_NUMBER()` hoặc `DENSE_RANK()`, hãy lấy ra sản phẩm có giá bán (`Price`) cao nhất của mỗi danh mục. Hiển thị `CategoryID`, `CategoryName`, `FruitName`, `Price`, sắp xếp theo `CategoryID` tăng dần.",
      "hints": [
        "Đánh số thứ tự trong CTE bằng ROW_NUMBER() OVER (PARTITION BY f.CategoryID ORDER BY f.Price DESC) AS rn.",
        "WITH Ranked AS (SELECT c.CategoryID, c.CategoryName, f.FruitName, f.Price, ROW_NUMBER() OVER (PARTITION BY c.CategoryID ORDER BY f.Price DESC) AS rn FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID) SELECT ... WHERE rn = 1;",
        "WITH Ranked AS (SELECT c.CategoryID, c.CategoryName, f.FruitName, f.Price, ROW_NUMBER() OVER (PARTITION BY c.CategoryID ORDER BY f.Price DESC) AS rn FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID) SELECT CategoryID, CategoryName, FruitName, Price FROM Ranked WHERE rn = 1 ORDER BY CategoryID ASC;"
      ],
      "solution_sql": "WITH Ranked AS (SELECT c.CategoryID, c.CategoryName, f.FruitName, f.Price, ROW_NUMBER() OVER (PARTITION BY c.CategoryID ORDER BY f.Price DESC) AS rn FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID) SELECT CategoryID, CategoryName, FruitName, Price FROM Ranked WHERE rn = 1 ORDER BY CategoryID ASC;",
      "difficulty": "Khá",
      "summary": "Sử dụng CTE và hàm cửa sổ `ROW_NUMBER()` hoặc `DENSE_RANK()`, hãy lấy ra sản phẩm có giá bán (`Price`) cao nhất của mỗi danh mục. Hiển thị `CategoryID`, `CategoryName`, `FruitName`, `Price`, sắp xếp theo `CategoryID` tăng dần.",
      "sql": "WITH Ranked AS (SELECT c.CategoryID, c.CategoryName, f.FruitName, f.Price, ROW_NUMBER() OVER (PARTITION BY c.CategoryID ORDER BY f.Price DESC) AS rn FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID) SELECT CategoryID, CategoryName, FruitName, Price FROM Ranked WHERE rn = 1 ORDER BY CategoryID ASC;",
      "understand": "Đánh số thứ tự trong CTE bằng ROW_NUMBER() OVER (PARTITION BY f.CategoryID ORDER BY f.Price DESC) AS rn.",
      "brute": "Xử lý thủ công từng dòng ở tầng ứng dụng hoặc dùng nhiều câu truy vấn rời rạc gây tốn round-trip.",
      "optimal": "WITH Ranked AS (SELECT c.CategoryID, c.CategoryName, f.FruitName, f.Price, ROW_NUMBER() OVER (PARTITION BY c.CategoryID ORDER BY f.Price DESC) AS rn FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID) SELECT ... WHERE rn = 1;",
      "trace": "WITH Ranked AS (SELECT c.CategoryID, c.CategoryName, f.FruitName, f.Price, ROW_NUMBER() OVER (PARTITION BY c.CategoryID ORDER BY f.Price DESC) AS rn FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID) SELECT CategoryID, CategoryName, FruitName, Price FROM Ranked WHERE rn = 1 ORDER BY CategoryID ASC;",
      "pitfalls": "Lưu ý xử lý NULL (COALESCE/ISNULL) và thứ tự sắp xếp khi phân vùng.",
      "note3": {
        "idea": "Đánh số thứ tự trong CTE bằng ROW_NUMBER() OVER (PARTITION BY f.CategoryID ORDER BY f.Price DESC) AS rn.",
        "syntax": "WITH Ranked AS (SELECT c.CategoryID, c.CategoryName, f.FruitName, f.Price, ROW_NUMBER() OVER (PARTITION BY c.CategoryID ORDER BY f.Price DESC) AS rn FROM Categories c JOIN Fruits f ON c.CategoryID = f.CategoryID) SELECT CategoryID, CategoryName, FruitName, Price FROM Ranked WHERE rn = 1 ORDER BY CategoryID ASC;",
        "trap": "Lưu ý xử lý NULL (COALESCE/ISNULL) và thứ tự sắp xếp khi phân vùng."
      },
      "expected": {
        "cols": [
          "CategoryID",
          "CategoryName",
          "FruitName",
          "Price"
        ],
        "rows": [
          [
            1,
            "Đặc sản Miền Tây",
            "Sầu Riêng Ri6",
            150000
          ],
          [
            2,
            "Trái cây Nhập khẩu",
            "Nho Mẫu Đơn Shine Muscat",
            850000
          ],
          [
            3,
            "Quả mọng (Berries)",
            "Việt Quất (Blueberry)",
            350000
          ],
          [
            4,
            "Trái cây sấy",
            "Nho khô Ninh Thuận",
            120000
          ],
          [
            5,
            "Quả hạch (Nuts)",
            "Hạt Mắc Ca",
            280000
          ]
        ]
      }
    },
    {
      "id": "ch15_p2",
      "title": "Bài thực hành 2 (FruitStore): Duyệt cây phân cấp nhân sự bằng Recursive CTE",
      "db": "fruitstore",
      "order_matters": true,
      "prompt": "Viết Recursive CTE duyệt bảng `Employees` từ Giám đốc (`ManagerID IS NULL`, cấp bậc `Level = 1`) xuống các cấp dưới (`Level = o.Level + 1`). Hiển thị `EmployeeID`, `FullName`, `Role`, `Level`, sắp xếp theo `Level` tăng dần, sau đó `EmployeeID` tăng dần.",
      "hints": [
        "Phần neo (Anchor): SELECT EmployeeID, FullName, Role, 1 AS Level FROM Employees WHERE ManagerID IS NULL. Phần đệ quy nối qua e.ManagerID = o.EmployeeID.",
        "WITH RECURSIVE Org AS (SELECT EmployeeID, FullName, Role, 1 AS Level FROM Employees WHERE ManagerID IS NULL UNION ALL SELECT e.EmployeeID, e.FullName, e.Role, o.Level + 1 FROM Employees e JOIN Org o ON e.ManagerID = o.EmployeeID) SELECT ...;",
        "WITH RECURSIVE Org AS (SELECT EmployeeID, FullName, Role, 1 AS Level FROM Employees WHERE ManagerID IS NULL UNION ALL SELECT e.EmployeeID, e.FullName, e.Role, o.Level + 1 FROM Employees e JOIN Org o ON e.ManagerID = o.EmployeeID) SELECT EmployeeID, FullName, Role, Level FROM Org ORDER BY Level ASC, EmployeeID ASC;"
      ],
      "solution_sql": "WITH RECURSIVE Org AS (SELECT EmployeeID, FullName, Role, 1 AS Level FROM Employees WHERE ManagerID IS NULL UNION ALL SELECT e.EmployeeID, e.FullName, e.Role, o.Level + 1 FROM Employees e JOIN Org o ON e.ManagerID = o.EmployeeID) SELECT EmployeeID, FullName, Role, Level FROM Org ORDER BY Level ASC, EmployeeID ASC;",
      "difficulty": "Khá",
      "summary": "Viết Recursive CTE duyệt bảng `Employees` từ Giám đốc (`ManagerID IS NULL`, cấp bậc `Level = 1`) xuống các cấp dưới (`Level = o.Level + 1`). Hiển thị `EmployeeID`, `FullName`, `Role`, `Level`, sắp xếp theo `Level` tăng dần, sau đó `EmployeeID` tăng dần.",
      "sql": "WITH RECURSIVE Org AS (SELECT EmployeeID, FullName, Role, 1 AS Level FROM Employees WHERE ManagerID IS NULL UNION ALL SELECT e.EmployeeID, e.FullName, e.Role, o.Level + 1 FROM Employees e JOIN Org o ON e.ManagerID = o.EmployeeID) SELECT EmployeeID, FullName, Role, Level FROM Org ORDER BY Level ASC, EmployeeID ASC;",
      "understand": "Phần neo (Anchor): SELECT EmployeeID, FullName, Role, 1 AS Level FROM Employees WHERE ManagerID IS NULL. Phần đệ quy nối qua e.ManagerID = o.EmployeeID.",
      "brute": "Xử lý thủ công từng dòng ở tầng ứng dụng hoặc dùng nhiều câu truy vấn rời rạc gây tốn round-trip.",
      "optimal": "WITH RECURSIVE Org AS (SELECT EmployeeID, FullName, Role, 1 AS Level FROM Employees WHERE ManagerID IS NULL UNION ALL SELECT e.EmployeeID, e.FullName, e.Role, o.Level + 1 FROM Employees e JOIN Org o ON e.ManagerID = o.EmployeeID) SELECT ...;",
      "trace": "WITH RECURSIVE Org AS (SELECT EmployeeID, FullName, Role, 1 AS Level FROM Employees WHERE ManagerID IS NULL UNION ALL SELECT e.EmployeeID, e.FullName, e.Role, o.Level + 1 FROM Employees e JOIN Org o ON e.ManagerID = o.EmployeeID) SELECT EmployeeID, FullName, Role, Level FROM Org ORDER BY Level ASC, EmployeeID ASC;",
      "pitfalls": "Lưu ý xử lý NULL (COALESCE/ISNULL) và thứ tự sắp xếp khi phân vùng.",
      "note3": {
        "idea": "Phần neo (Anchor): SELECT EmployeeID, FullName, Role, 1 AS Level FROM Employees WHERE ManagerID IS NULL. Phần đệ quy nối qua e.ManagerID = o.EmployeeID.",
        "syntax": "WITH RECURSIVE Org AS (SELECT EmployeeID, FullName, Role, 1 AS Level FROM Employees WHERE ManagerID IS NULL UNION ALL SELECT e.EmployeeID, e.FullName, e.Role, o.Level + 1 FROM Employees e JOIN Org o ON e.ManagerID = o.EmployeeID) SELECT EmployeeID, FullName, Role, Level FROM Org ORDER BY Level ASC, EmployeeID ASC;",
        "trap": "Lưu ý xử lý NULL (COALESCE/ISNULL) và thứ tự sắp xếp khi phân vùng."
      },
      "expected": {
        "cols": [
          "EmployeeID",
          "FullName",
          "Role",
          "Level"
        ],
        "rows": [
          [
            1,
            "Lê Minh Triết",
            "Giám đốc",
            1
          ],
          [
            2,
            "Nguyễn Tấn Dũng",
            "Quản lý Kho",
            2
          ],
          [
            3,
            "Trần Thị Mai",
            "Quản lý Bán hàng",
            2
          ],
          [
            4,
            "Phạm Văn A",
            "Nhân viên Kho",
            3
          ],
          [
            5,
            "Lý Bạch",
            "Nhân viên Kho",
            3
          ],
          [
            6,
            "Hoàng Cúc",
            "Nhân viên Bán hàng",
            3
          ],
          [
            7,
            "Đinh Hợi",
            "Nhân viên Bán hàng",
            3
          ]
        ]
      }
    },
    {
      "id": "ch15_p3",
      "title": "Bài thực hành 3 (FruitStore): Đối soát tổng tiền đơn hàng với chi tiết đơn và Voucher",
      "db": "fruitstore",
      "order_matters": true,
      "prompt": "Với mỗi đơn hàng trong bảng `Orders`, hãy tính tổng `SubTotal` từ bảng `OrderDetails` (`TamTinh`), lấy số tiền giảm giá từ bảng `Vouchers` (`TienGiam`, nếu không có voucher thì bằng 0), và thành tiền sau giảm (`ThanhTien = TamTinh - TienGiam`). Hiển thị `OrderID`, `TamTinh`, `TienGiam`, `ThanhTien` theo `OrderID` tăng dần.",
      "hints": [
        "Gom nhóm OrderDetails theo OrderID hoặc JOIN Orders với OrderDetails và LEFT JOIN Vouchers.",
        "SELECT o.OrderID, SUM(od.SubTotal) AS TamTinh, COALESCE(v.DiscountAmount, 0) AS TienGiam, SUM(od.SubTotal) - COALESCE(v.DiscountAmount, 0) AS ThanhTien FROM Orders o JOIN OrderDetails od ON o.OrderID = od.OrderID LEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID GROUP BY ...;",
        "SELECT o.OrderID, SUM(od.SubTotal) AS TamTinh, COALESCE(v.DiscountAmount, 0) AS TienGiam, SUM(od.SubTotal) - COALESCE(v.DiscountAmount, 0) AS ThanhTien FROM Orders o JOIN OrderDetails od ON o.OrderID = od.OrderID LEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID GROUP BY o.OrderID, v.DiscountAmount ORDER BY o.OrderID ASC;"
      ],
      "solution_sql": "SELECT o.OrderID, SUM(od.SubTotal) AS TamTinh, COALESCE(v.DiscountAmount, 0) AS TienGiam, SUM(od.SubTotal) - COALESCE(v.DiscountAmount, 0) AS ThanhTien FROM Orders o JOIN OrderDetails od ON o.OrderID = od.OrderID LEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID GROUP BY o.OrderID, v.DiscountAmount ORDER BY o.OrderID ASC;",
      "difficulty": "Khá",
      "summary": "Với mỗi đơn hàng trong bảng `Orders`, hãy tính tổng `SubTotal` từ bảng `OrderDetails` (`TamTinh`), lấy số tiền giảm giá từ bảng `Vouchers` (`TienGiam`, nếu không có voucher thì bằng 0), và thành tiền sau giảm (`ThanhTien = TamTinh - TienGiam`). Hiển thị `OrderID`, `TamTinh`, `TienGiam`, `ThanhTien` theo `OrderID` tăng dần.",
      "sql": "SELECT o.OrderID, SUM(od.SubTotal) AS TamTinh, COALESCE(v.DiscountAmount, 0) AS TienGiam, SUM(od.SubTotal) - COALESCE(v.DiscountAmount, 0) AS ThanhTien FROM Orders o JOIN OrderDetails od ON o.OrderID = od.OrderID LEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID GROUP BY o.OrderID, v.DiscountAmount ORDER BY o.OrderID ASC;",
      "understand": "Gom nhóm OrderDetails theo OrderID hoặc JOIN Orders với OrderDetails và LEFT JOIN Vouchers.",
      "brute": "Xử lý thủ công từng dòng ở tầng ứng dụng hoặc dùng nhiều câu truy vấn rời rạc gây tốn round-trip.",
      "optimal": "SELECT o.OrderID, SUM(od.SubTotal) AS TamTinh, COALESCE(v.DiscountAmount, 0) AS TienGiam, SUM(od.SubTotal) - COALESCE(v.DiscountAmount, 0) AS ThanhTien FROM Orders o JOIN OrderDetails od ON o.OrderID = od.OrderID LEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID GROUP BY ...;",
      "trace": "SELECT o.OrderID, SUM(od.SubTotal) AS TamTinh, COALESCE(v.DiscountAmount, 0) AS TienGiam, SUM(od.SubTotal) - COALESCE(v.DiscountAmount, 0) AS ThanhTien FROM Orders o JOIN OrderDetails od ON o.OrderID = od.OrderID LEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID GROUP BY o.OrderID, v.DiscountAmount ORDER BY o.OrderID ASC;",
      "pitfalls": "Lưu ý xử lý NULL (COALESCE/ISNULL) và thứ tự sắp xếp khi phân vùng.",
      "note3": {
        "idea": "Gom nhóm OrderDetails theo OrderID hoặc JOIN Orders với OrderDetails và LEFT JOIN Vouchers.",
        "syntax": "SELECT o.OrderID, SUM(od.SubTotal) AS TamTinh, COALESCE(v.DiscountAmount, 0) AS TienGiam, SUM(od.SubTotal) - COALESCE(v.DiscountAmount, 0) AS ThanhTien FROM Orders o JOIN OrderDetails od ON o.OrderID = od.OrderID LEFT JOIN Vouchers v ON o.VoucherID = v.VoucherID GROUP BY o.OrderID, v.DiscountAmount ORDER BY o.OrderID ASC;",
        "trap": "Lưu ý xử lý NULL (COALESCE/ISNULL) và thứ tự sắp xếp khi phân vùng."
      },
      "expected": {
        "cols": [
          "OrderID",
          "TamTinh",
          "TienGiam",
          "ThanhTien"
        ],
        "rows": [
          [
            1,
            850000,
            0,
            850000
          ],
          [
            2,
            230000,
            50000,
            180000
          ],
          [
            3,
            150000,
            0,
            150000
          ],
          [
            4,
            950000,
            100000,
            850000
          ],
          [
            5,
            2600000,
            100000,
            2500000
          ],
          [
            6,
            350000,
            50000,
            300000
          ],
          [
            7,
            180000,
            0,
            180000
          ],
          [
            8,
            200000,
            0,
            200000
          ],
          [
            9,
            450000,
            50000,
            400000
          ],
          [
            10,
            95000,
            0,
            95000
          ]
        ]
      }
    },
    {
      "id": "ch15_p4",
      "title": "Bài thực hành 4 (FruitStore): Tính doanh thu lũy kế (Running Total) các đơn đã giao",
      "db": "fruitstore",
      "order_matters": true,
      "prompt": "Lọc các đơn hàng có `Status = 'Đã giao'`, hiển thị `OrderID`, `OrderDate`, `TotalAmount` và cột `RunningTotal` (tổng lũy kế của `TotalAmount` sắp xếp theo `OrderDate` tăng dần, `OrderID` tăng dần). Sắp xếp kết quả theo `OrderDate` tăng dần.",
      "hints": [
        "Dùng SUM(TotalAmount) OVER (ORDER BY OrderDate ASC, OrderID ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).",
        "SELECT OrderID, OrderDate, TotalAmount, SUM(TotalAmount) OVER (ORDER BY OrderDate ASC, OrderID ASC) AS RunningTotal FROM Orders WHERE Status = 'Đã giao' ORDER BY OrderDate ASC;",
        "SELECT OrderID, OrderDate, TotalAmount, SUM(TotalAmount) OVER (ORDER BY OrderDate ASC, OrderID ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningTotal FROM Orders WHERE Status = 'Đã giao' ORDER BY OrderDate ASC, OrderID ASC;"
      ],
      "solution_sql": "SELECT OrderID, OrderDate, TotalAmount, SUM(TotalAmount) OVER (ORDER BY OrderDate ASC, OrderID ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningTotal FROM Orders WHERE Status = 'Đã giao' ORDER BY OrderDate ASC, OrderID ASC;",
      "difficulty": "Khó",
      "summary": "Lọc các đơn hàng có `Status = 'Đã giao'`, hiển thị `OrderID`, `OrderDate`, `TotalAmount` và cột `RunningTotal` (tổng lũy kế của `TotalAmount` sắp xếp theo `OrderDate` tăng dần, `OrderID` tăng dần). Sắp xếp kết quả theo `OrderDate` tăng dần.",
      "sql": "SELECT OrderID, OrderDate, TotalAmount, SUM(TotalAmount) OVER (ORDER BY OrderDate ASC, OrderID ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningTotal FROM Orders WHERE Status = 'Đã giao' ORDER BY OrderDate ASC, OrderID ASC;",
      "understand": "Dùng SUM(TotalAmount) OVER (ORDER BY OrderDate ASC, OrderID ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).",
      "brute": "Xử lý thủ công từng dòng ở tầng ứng dụng hoặc dùng nhiều câu truy vấn rời rạc gây tốn round-trip.",
      "optimal": "SELECT OrderID, OrderDate, TotalAmount, SUM(TotalAmount) OVER (ORDER BY OrderDate ASC, OrderID ASC) AS RunningTotal FROM Orders WHERE Status = 'Đã giao' ORDER BY OrderDate ASC;",
      "trace": "SELECT OrderID, OrderDate, TotalAmount, SUM(TotalAmount) OVER (ORDER BY OrderDate ASC, OrderID ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningTotal FROM Orders WHERE Status = 'Đã giao' ORDER BY OrderDate ASC, OrderID ASC;",
      "pitfalls": "Lưu ý xử lý NULL (COALESCE/ISNULL) và thứ tự sắp xếp khi phân vùng.",
      "note3": {
        "idea": "Dùng SUM(TotalAmount) OVER (ORDER BY OrderDate ASC, OrderID ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).",
        "syntax": "SELECT OrderID, OrderDate, TotalAmount, SUM(TotalAmount) OVER (ORDER BY OrderDate ASC, OrderID ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningTotal FROM Orders WHERE Status = 'Đã giao' ORDER BY OrderDate ASC, OrderID ASC;",
        "trap": "Lưu ý xử lý NULL (COALESCE/ISNULL) và thứ tự sắp xếp khi phân vùng."
      },
      "expected": {
        "cols": [
          "OrderID",
          "OrderDate",
          "TotalAmount",
          "RunningTotal"
        ],
        "rows": [
          [
            1,
            "2023-02-14 10:15:00",
            850000,
            850000
          ],
          [
            2,
            "2023-04-20 14:30:00",
            180000,
            1030000
          ],
          [
            3,
            "2023-06-15 09:00:00",
            150000,
            1180000
          ],
          [
            4,
            "2023-08-08 16:45:00",
            850000,
            2030000
          ],
          [
            5,
            "2023-12-24 19:00:00",
            2500000,
            4530000
          ],
          [
            6,
            "2024-01-10 08:30:00",
            300000,
            4830000
          ]
        ]
      }
    }
  ],
  "summary_table": [
    [
      "Phần A (Cốt lõi - 44 thẻ)",
      "SELECT, WHERE, JOIN, APPLY, GROUP BY, Window Functions, CTE, DML (OUTPUT, MERGE), DDL & Index, Transactions & Locks, JSON/Chuỗi/Ngày tháng",
      "Bắt buộc thuộc lòng 100% để đi làm Backend Java/.NET và vượt qua phỏng vấn Fresher/Junior/Mid"
    ],
    [
      "Phần B (Nâng cao - 20 thẻ)",
      "PIVOT/UNPIVOT, ROLLUP/CUBE, Window Frames, Temporal Tables, Computed Columns, Columnstore, Partitioning, DDM/RLS, Query Hints, DBCC",
      "Nắm vững bản chất và tình huống sử dụng để giải quyết các bài toán báo cáo Enterprise và tối ưu hệ thống lớn"
    ]
  ],
  "quiz": [
    {
      "q": "Trong CSDL FruitStore_Ultimate, để lấy ra đúng 1 sản phẩm đắt nhất cho mỗi danh mục bằng toán tử đặc trưng của T-SQL, từ khóa nào sau đây kết hợp với SELECT TOP (1) là phù hợp nhất?",
      "options": [
        "INNER JOIN",
        "CROSS APPLY",
        "UNION ALL",
        "GROUP BY ROLLUP"
      ],
      "ans": 1,
      "exp": "CROSS APPLY cho phép truyền CategoryID của từng dòng bảng Categories vào truy vấn con SELECT TOP (1) ... WHERE f.CategoryID = c.CategoryID ORDER BY f.Price DESC.",
      "a": "<strong>Đáp án đúng: CROSS APPLY</strong><br/>CROSS APPLY cho phép truyền CategoryID của từng dòng bảng Categories vào truy vấn con SELECT TOP (1) ... WHERE f.CategoryID = c.CategoryID ORDER BY f.Price DESC."
    },
    {
      "q": "Khi khách hàng đặt mua sản phẩm đang Flash Sale có số lượng tồn kho hạn chế, tổ hợp Lock Hint nào trong giao dịch giúp chống lỗi hai người cùng đọc một số tồn kho cũ (Lost Update)?",
      "options": [
        "WITH (NOLOCK)",
        "WITH (UPDLOCK, ROWLOCK)",
        "WITH (READPAST)",
        "OPTION (RECOMPILE)"
      ],
      "ans": 1,
      "exp": "WITH (UPDLOCK, ROWLOCK) giữ khóa cập nhật ngay ở bước đọc trên dòng sản phẩm đó, buộc các giao dịch mua cùng lúc phải xếp hàng tuần tự.",
      "a": "<strong>Đáp án đúng: WITH (UPDLOCK, ROWLOCK)</strong><br/>WITH (UPDLOCK, ROWLOCK) giữ khóa cập nhật ngay ở bước đọc trên dòng sản phẩm đó, buộc các giao dịch mua cùng lúc phải xếp hàng tuần tự."
    },
    {
      "q": "Trong bảng OrderDetails của FruitStore_Ultimate, từ khóa nào giúp cột tính toán SubTotal (Quantity * UnitPrice) được lưu cứng xuống đĩa và có thể đánh Index?",
      "options": [
        "VIRTUAL",
        "PERSISTED",
        "SCHEMABINDING",
        "IDENTITY"
      ],
      "ans": 1,
      "exp": "Từ khóa PERSISTED lưu kết quả của biểu thức cột tính toán xuống trang dữ liệu vật lý, giúp tăng tốc độ đọc và cho phép tạo Index trên cột đó.",
      "a": "<strong>Đáp án đúng: PERSISTED</strong><br/>Từ khóa PERSISTED lưu kết quả của biểu thức cột tính toán xuống trang dữ liệu vật lý, giúp tăng tốc độ đọc và cho phép tạo Index trên cột đó."
    },
    {
      "q": "Để bóc tách một giá trị đơn lẻ (như '$.Taste') từ cột AttributesJSON trong T-SQL, bạn dùng hàm nào?",
      "options": [
        "JSON_QUERY()",
        "JSON_VALUE()",
        "FOR JSON PATH",
        "ISJSON()"
      ],
      "ans": 1,
      "exp": "JSON_VALUE(cột, '$.đường_dẫn') trích xuất một giá trị vô hướng (scalar value) kiểu NVARCHAR(4000), trong khi JSON_QUERY trích xuất một đối tượng hoặc mảng JSON.",
      "a": "<strong>Đáp án đúng: JSON_VALUE()</strong><br/>JSON_VALUE(cột, '$.đường_dẫn') trích xuất một giá trị vô hướng (scalar value) kiểu NVARCHAR(4000), trong khi JSON_QUERY trích xuất một đối tượng hoặc mảng JSON."
    }
  ],
  "code": "Chương 15"
});
