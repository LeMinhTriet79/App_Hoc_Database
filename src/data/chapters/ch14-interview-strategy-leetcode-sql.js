/**
 * FILE: src/data/chapters/ch14-interview-strategy-leetcode-sql.js
 * MÔ TẢ: Chương 14 - Chiến Thuật Ôn Phỏng Vấn Tổng Hợp & Giải Phẫu 12 Bài SQL Kinh Điển (LeetCode #175 - #197)
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch14",
  "code": "Chương 14",
  "title": "Chiến Thuật Ôn Phỏng Vấn Tổng Hợp & Giải Phẫu 12 Bài SQL Kinh Điển (LeetCode #175 - #197)",
  "sources": [
    "Tổng hợp toàn bộ kiến thức Chương 0 - Chương 13 & Bộ bài phỏng vấn thực chiến"
  ],
  "goals": [
    "Nắm vững khung tư duy 4 bước khi giải bài tập SQL trực tiếp trên bảng trắng hoặc màn hình chia sẻ lúc phỏng vấn.",
    "Nhận diện ngay lập tức 'Mẫu bài toán' (Query Pattern) chỉ sau 10 giây đọc đề bài.",
    "Giải trọn vẹn và hiểu hết các bẫy biên (Edge cases: bảng rỗng, đồng hạng, NULL, ngày đứt quãng) của 12 bài LeetCode SQL kinh điển nhất (#175 đến #197).",
    "Tự tin trả lời các câu hỏi tình huống (Scenario-based / Troubleshooting) khi hệ thống CSDL bị chậm hoặc Deadlock."
  ],
  "signals": [
    "Chuẩn bị bước vào vòng phỏng vấn kỹ thuật (Technical / Live Coding Interview) vị trí Fresher, Junior hoặc Mid Backend Java / .NET.",
    "Cần một bản đồ tổng kết để ôn tập nhanh trong 24 giờ trước buổi phỏng vấn."
  ],
  "theory": "<h3>14.1. Khung tư duy 4 bước khi Live Coding SQL trong buổi phỏng vấn</h3>\n<p>Khi người phỏng vấn đưa một đề bài SQL, đừng vội gõ chữ <code>SELECT</code> ngay giây đầu tiên! Hãy nói thành tiếng (Think aloud) theo đúng 4 bước sau để ghi điểm tư duy kỹ sư:</p>\n<ol>\n  <li><strong>Bước 1 - Xác định Độ mịn của kết quả (Result Granularity):</strong> Hỏi rõ: <em>\"Mỗi dòng ở bảng kết quả cuối cùng đại diện cho cái gì?\"</em> (Một khách hàng? Một đơn hàng? Hay một cặp Phòng ban - Nhân viên?). Điều này quyết định ngay bạn cần bảng nào ở <code>FROM</code> và có cần <code>GROUP BY</code> hay không.</li>\n  <li><strong>Bước 2 - Chọn phép nối và xử lý nhóm rỗng (JOIN vs LEFT JOIN):</strong> Kiểm tra xem nếu một thực thể ở bảng chính chưa có dữ liệu ở bảng phụ (khách có 0 đơn, người chưa có địa chỉ) thì đề yêu cầu <strong>loại bỏ</strong> (dùng <code>INNER JOIN</code>) hay <strong>vẫn hiển thị kèm số 0 / NULL</strong> (dùng <code>LEFT JOIN</code> + đặt điều kiện phụ ở <code>ON</code>).</li>\n  <li><strong>Bước 3 - Kiểm tra 3 bẫy biên (Edge Cases):</strong>\n    <ul>\n      <li><strong>Bẫy đồng hạng (Ties):</strong> Đề tìm \"cao nhất / cao thứ N\" nếu có 2 người bằng điểm thì lấy cả 2 (<code>DENSE_RANK</code>) hay chỉ lấy 1?</li>\n      <li><strong>Bẫy giá trị NULL:</strong> Cột dùng trong phép cộng trừ hoặc <code>NOT IN</code> có cho phép <code>NULL</code> không? (Luôn ưu tiên <code>COALESCE</code> và <code>NOT EXISTS</code>).</li>\n      <li><strong>Bẫy tập rỗng:</strong> Nếu không có dòng nào thỏa mãn, đề muốn trả về 0 dòng hay trả về 1 dòng chứa <code>NULL</code>?</li>\n    </ul>\n  </li>\n  <li><strong>Bước 4 - Đánh giá hiệu năng (Index &amp; Sargability):</strong> Sau khi viết xong câu SQL chạy đúng, hãy chủ động nói thêm 1 câu với người phỏng vấn: <em>\"Để câu truy vấn này chạy nhanh trên bảng triệu dòng, em sẽ đánh Composite Index trên cột X, Y và giữ nguyên cột ngày tháng ở vế trái để đảm bảo Sargable\"</em>. Câu nói này giúp bạn vượt trội hoàn toàn so với 90% ứng viên khác!</li>\n</ol>\n\n<h3>14.2. Bảng tra cứu nhanh 12 bài LeetCode SQL kinh điển (#175 - #197)</h3>\n<p>Toàn bộ 12 bài dưới đây đều đã có bảng dữ liệu thật trong CSDL <strong><code>leetcode</code></strong> của Phòng Thực Hành và Phòng Phỏng Vấn để bạn gõ code chạy thử:</p>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Mã bài</th>\n      <th>Tên bài toán</th>\n      <th>Mẫu kỹ thuật cốt lõi (Pattern)</th>\n      <th>Bẫy dễ trượt nhất khi phỏng vấn</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>#175</strong></td>\n      <td>Combine Two Tables</td>\n      <td><code>LEFT JOIN</code> cơ bản</td>\n      <td>Dùng nhầm <code>INNER JOIN</code> làm mất người chưa có địa chỉ.</td>\n    </tr>\n    <tr>\n      <td><strong>#176</strong></td>\n      <td>Second Highest Salary</td>\n      <td><code>DISTINCT</code> + <code>LIMIT 1 OFFSET 1</code> bọc trong Scalar Subquery (hoặc <code>MAX(salary) WHERE salary &lt; (SELECT MAX...)</code>)</td>\n      <td>Không bọc trong <code>SELECT (...)</code> khiến khi bảng chỉ có 1 dòng thì trả về rỗng thay vì <code>NULL</code>.</td>\n    </tr>\n    <tr>\n      <td><strong>#177</strong></td>\n      <td>Nth Highest Salary</td>\n      <td><code>DENSE_RANK() OVER (ORDER BY salary DESC)</code> lọc <code>rnk = N</code></td>\n      <td>Quên <code>DISTINCT</code> khi trả về mức lương thứ N nếu có nhiều người cùng nhận mức lương đó.</td>\n    </tr>\n    <tr>\n      <td><strong>#178</strong></td>\n      <td>Rank Scores</td>\n      <td><code>DENSE_RANK() OVER (ORDER BY score DESC)</code></td>\n      <td>Dùng nhầm <code>RANK()</code> làm thứ hạng sau dòng đồng điểm bị nhảy cóc.</td>\n    </tr>\n    <tr>\n      <td><strong>#180</strong></td>\n      <td>Consecutive Numbers</td>\n      <td><code>LAG(num, 1)</code> và <code>LEAD(num, 1)</code> theo thứ tự <code>id</code></td>\n      <td>Quên <code>DISTINCT num</code> khi một con số xuất hiện liên tiếp 4-5 lần.</td>\n    </tr>\n    <tr>\n      <td><strong>#181</strong></td>\n      <td>Employees Earning More Than Managers</td>\n      <td><code>SELF JOIN</code>: <code>e.managerId = m.id AND e.salary &gt; m.salary</code></td>\n      <td>Nối ngược <code>e.id = m.managerId</code> làm lấy nhầm tên quản lý thay vì tên nhân viên.</td>\n    </tr>\n    <tr>\n      <td><strong>#182</strong></td>\n      <td>Duplicate Emails</td>\n      <td><code>GROUP BY email HAVING COUNT(*) &gt; 1</code></td>\n      <td>Viết điều kiện <code>COUNT(*) &gt; 1</code> ở trong <code>WHERE</code>.</td>\n    </tr>\n    <tr>\n      <td><strong>#183</strong></td>\n      <td>Customers Who Never Order</td>\n      <td>Anti-Join: <code>LEFT JOIN ... WHERE o.id IS NULL</code> hoặc <code>NOT EXISTS</code></td>\n      <td>Dùng <code>NOT IN</code> khi cột khóa ngoại trong thực tế có thể chứa <code>NULL</code>.</td>\n    </tr>\n    <tr>\n      <td><strong>#184</strong></td>\n      <td>Department Highest Salary</td>\n      <td>CTE + <code>RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC)</code> lọc <code>rnk = 1</code></td>\n      <td>Dùng <code>ROW_NUMBER() = 1</code> làm mất người đồng hạng lương cao nhất trong phòng.</td>\n    </tr>\n    <tr>\n      <td><strong>#185</strong></td>\n      <td>Department Top Three Salaries</td>\n      <td>CTE + <code>DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC)</code> lọc <code>rnk &lt;= 3</code></td>\n      <td>Dùng <code>RANK() &lt;= 3</code> làm mất mức lương cao thứ 3 khi có 2 người đồng hạng 1 hoặc 2.</td>\n    </tr>\n    <tr>\n      <td><strong>#196</strong></td>\n      <td>Delete Duplicate Emails</td>\n      <td><code>DELETE WHERE id NOT IN (SELECT MIN(id) ... GROUP BY email)</code></td>\n      <td>Quên bọc Derived Table trung gian khi chạy trên MySQL (lỗi 1093).</td>\n    </tr>\n    <tr>\n      <td><strong>#197</strong></td>\n      <td>Rising Temperature</td>\n      <td><code>SELF JOIN</code> theo ngày: <code>DATEDIFF(day, w_qua.recordDate, w_nay.recordDate) = 1</code></td>\n      <td>Dùng <code>LAG()</code> hoặc <code>id = id - 1</code> khi dữ liệu bị khuyết ngày ở giữa.</td>\n    </tr>\n  </tbody>\n</table>",
  "mechanism": "<h3>Chạy tay quy trình Chẩn đoán sự cố (Production Troubleshooting Checklist) khi phỏng vấn</h3>\n<p>Khi người phỏng vấn hỏi câu hỏi mở: <em>\"Một tính năng trên Production hôm qua vẫn chạy 0.1 giây, sáng nay tự nhiên chậm 30 giây hoặc báo Timeout. Em sẽ kiểm tra theo thứ tự nào?\"</em>, hãy trình bày rõ 5 bước chẩn đoán bài bản sau:</p>\n<div class=\"trace-steps\">\n  <div class=\"trace-step\"><strong>Bước 1 - Kiểm tra Blocking &amp; Deadlock tức thời:</strong> Xem câu truy vấn đó thực sự đang chạy tốn CPU hay đang đứng chờ (Waiting) một giao dịch khác giữ khóa (dùng <code>sp_WhoIsActive</code> hoặc <code>sys.dm_exec_requests</code> kiểm tra cột <code>blocking_session_id</code> và <code>wait_type</code>).</div>\n  <div class=\"trace-step\"><strong>Bước 2 - So sánh Actual Execution Plan &amp; Logical Reads:</strong> Bắt câu SQL kèm bộ tham số thực tế đang bị chậm, bật <code>Actual Execution Plan</code>. Kiểm tra xem có toán tử nào bị ước lượng sai số dòng (<em>Estimated Rows = 1</em> nhưng <em>Actual Rows = 500.000</em>) gây tràn ổ cứng <code>TempDB Spill</code> hoặc thực hiện hàng trăm nghìn lần <em>Key Lookup</em> hay không.</div>\n  <div class=\"trace-step\"><strong>Bước 3 - Kiểm tra Parameter Sniffing &amp; Outdated Statistics:</strong> Nếu hôm qua nhanh mà sáng nay chậm dù code không đổi, nguyên nhân rất cao là do một báo cáo đầu ngày truyền tham số đặc biệt làm SQL Server cache lại một Execution Plan tồi (<em>Parameter Sniffing</em>), hoặc bảng vừa được import thêm dữ liệu lớn làm thống kê (<em>Statistics</em>) bị cũ. Xử lý nhanh bằng <code>UPDATE STATISTICS</code> hoặc <code>OPTION (RECOMPILE)</code>.</div>\n  <div class=\"trace-step\"><strong>Bước 4 - Kiểm tra Sargability, Implicit Conversion &amp; Missing Index:</strong> Rà soát xem cột lọc trong <code>WHERE</code> có bị lệch kiểu dữ liệu (như <code>NVARCHAR</code> truyền vào cột <code>VARCHAR</code>) hoặc thiếu Covering Index hay không.</div>\n  <div class=\"trace-step\"><strong>Bước 5 - Kiểm tra tầng Ứng dụng (ORM &amp; Connection Pool):</strong> Kiểm tra xem có phải chậm do lỗi N+1 Query hoặc do cạn kiệt Connection Pool (vì một luồng khác giữ Transaction mở lúc gọi HTTP bên ngoài) hay không.</div>\n</div>",
  "examples": [
    {
      "title": "Ví dụ 14.1: [LeetCode #175 - Combine Two Tables] Ghép thông tin cá nhân và địa chỉ (Bẫy INNER vs LEFT JOIN)",
      "label": "CHUAN",
      "db": "leetcode",
      "sql": "SELECT p.firstName, p.lastName, a.city, a.state\nFROM Person AS p\nLEFT JOIN Address AS a ON p.personId = a.personId\nORDER BY p.personId ASC;",
      "result": {
        "cols": [
          "firstName",
          "lastName",
          "city",
          "state"
        ],
        "rows": [
          [
            "Allen",
            "Wang",
            null,
            null
          ],
          [
            "Bob",
            "Alice",
            "New York City",
            "New York"
          ]
        ]
      },
      "note": "Người có personId = 1 (Allen Wang) không có bản ghi trong bảng Address. Đề yêu cầu vẫn phải hiển thị người đó với city và state là NULL, nên bắt buộc dùng LEFT JOIN!"
    },
    {
      "title": "Ví dụ 14.2: [LeetCode #176 & #177 - Second / Nth Highest Salary] Tìm mức lương cao thứ nhì (Xử lý cả khi không tồn tại)",
      "label": "CHUAN",
      "db": "leetcode",
      "sql": "-- Bọc trong một Scalar Subquery để nếu bảng chỉ có 1 mức lương thì trả về đúng 1 dòng có giá trị NULL:\nSELECT (\n    SELECT DISTINCT salary\n    FROM LC_Employee\n    ORDER BY salary DESC\n    LIMIT 1 OFFSET 1\n) AS SecondHighestSalary;",
      "result": {
        "cols": [
          "SecondHighestSalary"
        ],
        "rows": [
          [
            85000
          ]
        ]
      },
      "note": "Bẫy phỏng vấn kinh điển của bài #176: Nếu không bọc câu SELECT DISTINCT ... LIMIT 1 OFFSET 1 bên trong một câu SELECT (...) ngoài cùng, hoặc không dùng MAX(salary), khi bảng chỉ có 1 nhân viên thì câu truy vấn trả về 0 dòng (Empty) thay vì trả về 1 dòng chứa giá trị NULL!"
    },
    {
      "title": "Ví dụ 14.3: [LeetCode #180 - Consecutive Numbers] Tìm các con số xuất hiện liên tiếp ít nhất 3 lần",
      "label": "CHUAN",
      "db": "leetcode",
      "sql": "WITH ChuoiLienTiep AS (\n    SELECT id, num,\n           LAG(num, 1) OVER (ORDER BY id) AS prev_num,\n           LEAD(num, 1) OVER (ORDER BY id) AS next_num\n    FROM Logs\n)\nSELECT DISTINCT num AS ConsecutiveNums\nFROM ChuoiLienTiep\nWHERE num = prev_num AND num = next_num;",
      "result": {
        "cols": [
          "ConsecutiveNums"
        ],
        "rows": [
          [
            1
          ]
        ]
      },
      "note": "Dùng LAG(num, 1) và LEAD(num, 1) theo thứ tự id giúp kiểm tra dòng trước và dòng sau có cùng giá trị num hay không chỉ trong 1 lần quét bảng, thay vì phải SELF JOIN bảng Logs 3 lần!"
    },
    {
      "title": "Ví dụ 14.4: [LeetCode #185 - Department Top Three Salaries] Lấy các nhân viên nằm trong Top 3 mức lương cao nhất mỗi phòng",
      "label": "CHUAN",
      "db": "leetcode",
      "sql": "WITH XepHangPhong AS (\n    SELECT d.name AS Department,\n           e.name AS Employee,\n           e.salary AS Salary,\n           DENSE_RANK() OVER (\n               PARTITION BY e.departmentId\n               ORDER BY e.salary DESC\n           ) AS rnk\n    FROM LC_Employee AS e\n    INNER JOIN LC_Department AS d ON e.departmentId = d.id\n)\nSELECT Department, Employee, Salary\nFROM XepHangPhong\nWHERE rnk <= 3\nORDER BY Department ASC, Salary DESC, Employee ASC;",
      "result": {
        "cols": [
          "Department",
          "Employee",
          "Salary"
        ],
        "rows": [
          [
            "IT",
            "Max",
            90000
          ],
          [
            "IT",
            "Joe",
            85000
          ],
          [
            "IT",
            "Randy",
            85000
          ],
          [
            "IT",
            "Will",
            70000
          ],
          [
            "Sales",
            "Henry",
            80000
          ]
        ]
      },
      "note": "Trong phòng IT có 2 người đồng mức lương 85000 (Joe và Randy). Vì đề yêu cầu lấy 'Top 3 mức lương khác nhau cao nhất', ta phải dùng DENSE_RANK() để người có lương 70000 (Will) vẫn được xếp hạng 3 và được lấy ra!"
    },
    {
      "title": "Ví dụ 14.5: [LeetCode #197 - Rising Temperature] Tìm những ngày có nhiệt độ cao hơn ngày hôm trước (Cẩn thận ngày bị cách quãng!)",
      "label": "CHUAN",
      "db": "leetcode",
      "sql": "SELECT w_nay.id\nFROM Weather AS w_nay\nINNER JOIN Weather AS w_qua\n        ON DATE(w_nay.recordDate, '-1 day') = w_qua.recordDate\nWHERE w_nay.temperature > w_qua.temperature\nORDER BY w_nay.id ASC;",
      "result": {
        "cols": [
          "id"
        ],
        "rows": [
          [
            2
          ],
          [
            4
          ]
        ]
      },
      "note": "Bẫy chết người của bài #197: Không được nối theo w_nay.id = w_qua.id + 1 hoặc dùng LAG(temperature) trực tiếp nếu không kiểm tra khoảng cách ngày! Vì nếu dữ liệu bị khuyết mất ngày 02/01 (nhảy từ 01/01 sang 03/01), ngày 03/01 không có 'ngày hôm qua'!"
    }
  ],
  "dialects": [
    [
      "Tìm mức lương cao thứ N (#177)",
      "SELECT DISTINCT salary FROM Emp ORDER BY salary DESC OFFSET (@N-1) ROWS FETCH NEXT 1 ROWS ONLY",
      "SELECT DISTINCT salary FROM Emp ORDER BY salary DESC LIMIT 1 OFFSET M",
      "SELECT DISTINCT salary FROM Emp ORDER BY salary DESC LIMIT 1 OFFSET M"
    ],
    [
      "Xóa dòng trùng qua JOIN/CTE (#196)",
      "WITH cte AS (SELECT ROW_NUMBER() OVER(...) rn FROM T) DELETE FROM cte WHERE rn > 1",
      "DELETE p1 FROM Person p1 JOIN Person p2 ON p1.email = p2.email AND p1.id > p2.id",
      "DELETE FROM Person WHERE id NOT IN (SELECT MIN(id) FROM Person GROUP BY email)"
    ],
    [
      "Lùi 1 ngày so sánh nhiệt độ (#197)",
      "DATEDIFF(day, w1.recordDate, w2.recordDate) = 1",
      "DATEDIFF(w2.recordDate, w1.recordDate) = 1",
      "w2.recordDate - w1.recordDate = 1 (SQLite: DATE(w2.recordDate, '-1 day') = w1.recordDate)"
    ]
  ],
  "bridge_java": "// [Java - Tổng kết phỏng vấn] Checklist 5 quy tắc vàng khi viết Data Access Layer trong Spring Boot:\n// 1. Luôn tắt spring.jpa.open-in-view=false trong application.yml.\n// 2. Luôn gắn @Transactional(readOnly = true) cho các hàm truy vấn đọc.\n// 3. Dùng DTO Projection (Java record) cho các màn hình danh sách/báo cáo thay vì trả về Entity.\n// 4. Dùng @EntityGraph hoặc JOIN FETCH (cho 1 quan hệ) và @BatchSize (cho nhiều quan hệ) để diệt N+1.\n// 5. Không bao giờ gọi RestTemplate / WebClient / Kafka / Gửi Email bên trong hàm đang mở @Transactional ghi DB.",
  "bridge_csharp": "// [C# - Tổng kết phỏng vấn] Checklist 5 quy tắc vàng khi viết Data Access Layer trong ASP.NET Core:\n// 1. Luôn dùng .AsNoTracking() hoặc chiếu thẳng sang DTO bằng .Select() cho mọi truy vấn chỉ đọc.\n// 2. Không bao giờ gọi .ToList() / .AsEnumerable() trước khi hoàn tất các mệnh đề .Where(), .OrderBy(), .Take().\n// 3. Cấu hình .IsUnicode(false) cho các cột VARCHAR để tránh lỗi CONVERT_IMPLICIT làm hỏng Index Seek.\n// 4. Dùng .AsSplitQuery() khi cần .Include() nhiều danh sách con (@OneToMany) cùng lúc.\n// 5. Sử dụng ExecuteUpdateAsync / ExecuteDeleteAsync (hoặc Dapper) cho các thao tác cập nhật/xóa hàng loạt.",
  "performance": "<ul>\n  <li><strong>Mẹo ghi điểm tối đa ở cuối buổi phỏng vấn:</strong> Khi được hỏi về tối ưu hóa, hãy luôn trình bày theo phương pháp <strong>Đo lường trước, Tối ưu sau (Measure First)</strong>: đọc <code>Execution Plan</code> và <code>Logical Reads (STATISTICS IO)</code> thay vì đoán mò. Một câu truy vấn giảm từ 50.000 Logical Reads xuống còn 15 Logical Reads chắc chắn sẽ chạy nhanh và bền vững dù bộ đệm RAM có đầy hay không.</li>\n</ul>",
  "common_errors": [
    "Nhầm lẫn giữa RANK(), DENSE_RANK() và ROW_NUMBER() trong các bài toán tìm Top-N hoặc cao thứ N.",
    "Quên kiểm tra trường hợp bảng không đủ số dòng trong bài Second Highest Salary (#176), dẫn tới trả về tập rỗng thay vì trả về giá trị NULL.",
    "So sánh ngày liền kề bằng cách lấy id - 1 thay vì dùng hàm cộng trừ ngày (DATEADD / DATEDIFF) trong bài Rising Temperature (#197).",
    "Khi khử trùng lặp (#196), viết điều kiện xóa p1.id <> p2.id (xóa sạch cả hai bản ghi trùng!) thay vì p1.id > p2.id (chỉ xóa bản ghi có id lớn hơn).",
    "Trả lời phỏng vấn theo kiểu học vẹt lý thuyết mà không liên hệ được với cách ORM (Hibernate / EF Core) sinh câu lệnh SQL thực tế trong dự án."
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "Trong bài toán tìm mức lương cao thứ nhì (Second Highest Salary - LeetCode #176), có những cách viết nào và cách nào chạy tốt nhất?",
      "a_short": "Cách 1: SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee). Cách 2: SELECT (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1). Cách 3: Dùng DENSE_RANK() = 2.",
      "a_long": "Với riêng bài tìm 'cao thứ nhì' (N = 2), Cách 1 dùng 2 lần MAX(salary) là cách chuẩn ANSI rất hay vì hàm tổng hợp MAX() tự động trả về 1 dòng có giá trị NULL nếu không tìm thấy mức lương thứ nhì (không cần bọc thêm subquery ngoài). Với bài tổng quát tìm 'cao thứ N bất kỳ' (#177), Cách 2 (dùng DISTINCT + OFFSET N-1 LIMIT 1 có Index trên salary) hoặc Cách 3 (dùng DENSE_RANK() OVER (ORDER BY salary DESC)) là tổng quát và dễ bảo trì nhất."
    },
    {
      "level": "Junior",
      "q": "Khi nào một câu lệnh SQL chạy rất nhanh trên môi trường Dev/Staging (vài nghìn dòng) nhưng lại làm treo hệ thống khi lên Production (vài chục triệu dòng)?",
      "a_short": "Do câu lệnh có độ phức tạp O(N) hoặc O(N^2): thiếu Index trên cột WHERE/JOIN/ORDER BY, viết điều kiện Non-Sargable (bọc hàm quanh cột), dùng OFFSET phân trang sâu, dùng Correlated Subquery/Scalar UDF chạy từng dòng, hoặc bị Lock Escalation / Blocking dưới tải đồng thời cao.",
      "a_long": "Trên môi trường Dev với 1.000 dòng (chỉ chiếm khoảng 10 trang đĩa 8KB nằm gọn trong RAM), việc quét toàn bảng (Table Scan) hay nhảy B-Tree (Index Seek) đều chỉ mất 1 mili-giây nên lập trình viên không nhận ra sự khác biệt. Khi lên Production với 50 triệu dòng (hàng trăm nghìn trang đĩa) và hàng trăm người dùng truy cập cùng lúc: (1) Table Scan làm nghẽn băng thông đĩa và đẩy dữ liệu khác khỏi Buffer Pool; (2) Sort/Hash không có Index gây tràn TempDB; (3) Quét bảng trong Transaction giữ khóa lâu gây Blocking dây chuyền."
    },
    {
      "level": "Mid",
      "q": "Hãy trình bày quy trình bạn thiết kế và tối ưu CSDL cho một tính năng mới từ lúc nhận yêu cầu đến lúc đưa lên Production.",
      "a_short": "(1) Chuẩn hóa lược đồ 3NF, chọn đúng kiểu dữ liệu (DECIMAL cho tiền, DATETIME2/TIMESTAMPTZ cho ngày, BIGINT/UUIDv7 cho khóa); (2) Xác định các mẫu truy vấn chính (Access Patterns) để thiết kế Composite/Covering Index; (3) Viết truy vấn Sargable, kiểm soát N+1 ở ORM; (4) Kiểm tra Execution Plan và xử lý Concurrency (Optimistic/Pessimistic Lock); (5) Viết kịch bản Migration Zero-Downtime.",
      "a_long": "Một câu trả lời toàn diện kết nối toàn bộ 14 chương: Bắt đầu từ thiết kế dữ liệu chuẩn 3NF kèm các ràng buộc toàn vẹn (PK, FK, CHECK, Filtered Unique Index nếu có Soft Delete). Tiếp theo, nhìn vào các màn hình giao diện và API để biết các cột nào sẽ nằm trong WHERE, JOIN và ORDER BY, từ đó thiết kế bộ Index tối giản nhưng bao phủ (Covering Index) và dùng Keyset Pagination cho danh sách lớn. Ở tầng code Java/C#, dùng DTO Projection và AsNoTracking/readOnly cho luồng đọc, chọn đúng chiến lược khóa (Atomic Update hoặc Optimistic Version) cho luồng ghi, và quản lý thay đổi bằng Flyway / EF Migrations."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 14.1: [LeetCode #181] Nhân viên có lương cao hơn người quản lý trực tiếp",
      "problem": "Trên CSDL LeetCode (bảng LC_Employee gồm id, name, salary, managerId, departmentId), hãy tìm tên (đặt bí danh cột là Employee) của những nhân viên có mức lương (salary) lớn hơn mức lương của người quản lý trực tiếp của họ.",
      "intuition": "Dùng SELF JOIN trên bảng LC_Employee: e nối với m qua e.managerId = m.id AND e.salary > m.salary.",
      "trace": "Joe có salary = 85000, người quản lý của Joe là Sam (id = 3, salary = 60000). Vì 85000 > 60000 nên Joe thỏa mãn.",
      "sql": "SELECT e.name AS Employee\nFROM LC_Employee AS e\nINNER JOIN LC_Employee AS m ON e.managerId = m.id\nWHERE e.salary > m.salary;",
      "db": "leetcode",
      "expected": {
        "cols": [
          "Employee"
        ],
        "rows": [
          [
            "Joe"
          ]
        ]
      },
      "order_matters": false,
      "hints": [
        "Nối bảng LC_Employee (e) với chính nó (m) theo điều kiện e.managerId = m.id.",
        "Lọc thêm WHERE e.salary > m.salary và chỉ lấy cột e.name AS Employee.",
        "SELECT e.name AS Employee FROM LC_Employee AS e INNER JOIN LC_Employee AS m ON e.managerId = m.id WHERE e.salary > m.salary;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 14.2: [LeetCode #182] Tìm các địa chỉ Email bị trùng lặp",
      "problem": "Trên CSDL LeetCode (bảng PersonEmail gồm id, email), hãy viết truy vấn trả về các địa chỉ email xuất hiện từ 2 lần trở lên (đặt tên cột là Email).",
      "intuition": "Gom nhóm GROUP BY email và lọc HAVING COUNT(*) > 1.",
      "trace": "Trong bảng PersonEmail, 'a@b.com' xuất hiện 2 lần (id 1 và 3), còn 'c@d.com' chỉ xuất hiện 1 lần.",
      "sql": "SELECT email AS Email\nFROM PersonEmail\nGROUP BY email\nHAVING COUNT(*) > 1;",
      "db": "leetcode",
      "expected": {
        "cols": [
          "Email"
        ],
        "rows": [
          [
            "a@b.com"
          ]
        ]
      },
      "order_matters": false,
      "hints": [
        "Dùng GROUP BY email kết hợp mệnh đề HAVING COUNT(*) > 1.",
        "SELECT email AS Email FROM PersonEmail GROUP BY email HAVING COUNT(*) > 1;",
        "SELECT email AS Email FROM PersonEmail GROUP BY email HAVING COUNT(*) > 1;"
      ]
    },
    {
      "num": 3,
      "title": "Bài 14.3: [LeetCode #183] Tìm khách hàng chưa từng đặt bất kỳ đơn hàng nào",
      "problem": "Trên CSDL LeetCode (bảng LC_Customers gồm id, name và bảng LC_Orders gồm id, customerId), hãy tìm tên (đặt bí danh cột là Customers) của những khách hàng chưa từng đặt đơn hàng nào. Sắp xếp theo LC_Customers.id tăng dần.",
      "intuition": "Dùng LEFT JOIN từ LC_Customers sang LC_Orders rồi lọc WHERE o.id IS NULL (hoặc dùng NOT EXISTS).",
      "trace": "Khách hàng 1 (Joe) và 3 (Sam) có đơn trong LC_Orders. Khách hàng 2 (Henry) và 4 (Max) chưa có đơn nào.",
      "sql": "SELECT c.name AS Customers\nFROM LC_Customers AS c\nLEFT JOIN LC_Orders AS o ON c.id = o.customerId\nWHERE o.id IS NULL\nORDER BY c.id ASC;",
      "db": "leetcode",
      "expected": {
        "cols": [
          "Customers"
        ],
        "rows": [
          [
            "Henry"
          ],
          [
            "Max"
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Sử dụng LEFT JOIN hoặc WHERE NOT EXISTS (SELECT 1 FROM LC_Orders o WHERE o.customerId = c.id).",
        "SELECT c.name AS Customers FROM LC_Customers AS c LEFT JOIN LC_Orders AS o ON c.id = o.customerId WHERE o.id IS NULL ORDER BY c.id ASC;",
        "SELECT c.name AS Customers FROM LC_Customers AS c LEFT JOIN LC_Orders AS o ON c.id = o.customerId WHERE o.id IS NULL ORDER BY c.id ASC;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch14_p1",
      "title": "[LeetCode #178] Xếp hạng điểm số liên tục không bị khuyết thứ hạng (Rank Scores)",
      "difficulty": "Trung bình",
      "db": "leetcode",
      "summary": "Trên CSDL LeetCode (bảng Scores gồm id, score), hãy viết câu truy vấn xếp hạng điểm số từ cao xuống thấp. Nếu hai điểm bằng nhau thì nhận cùng thứ hạng, và thứ hạng kế tiếp phải là số nguyên liền kề (không nhảy cóc). Trả về 2 cột: score và rank, sắp xếp theo score giảm dần.",
      "understand": "Đây chính là định nghĩa của hàm cửa sổ DENSE_RANK() OVER (ORDER BY score DESC). Lưu ý từ khóa rank có thể trùng từ khóa hệ thống trong một số hệ CSDL nên đặt trong ngoặc kép hoặc AS \"rank\".",
      "brute": "Viết Correlated Subquery đếm COUNT(DISTINCT s2.score) WHERE s2.score >= s1.score (độ phức tạp O(N^2)).",
      "optimal": "Dùng DENSE_RANK() OVER (ORDER BY score DESC) AS rank với độ phức tạp O(N log N).",
      "trace": "Điểm 4.00 (2 dòng) -> hạng 1; 3.85 -> hạng 2; 3.65 (2 dòng) -> hạng 3; 3.50 -> hạng 4.",
      "sql": "SELECT score,\n       DENSE_RANK() OVER (ORDER BY score DESC) AS rank\nFROM Scores\nORDER BY score DESC;",
      "expected": {
        "cols": [
          "score",
          "rank"
        ],
        "rows": [
          [
            4.0,
            1
          ],
          [
            4.0,
            1
          ],
          [
            3.85,
            2
          ],
          [
            3.65,
            3
          ],
          [
            3.65,
            3
          ],
          [
            3.5,
            4
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Dùng nhầm hàm RANK() làm điểm 3.85 bị nhảy sang hạng 3 thay vì hạng 2.",
      "note3": {
        "idea": "Xếp hạng liên tục không để trống thứ hạng sau các dòng đồng điểm là bài toán mẫu mực của DENSE_RANK().",
        "syntax": "SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS rank FROM Scores ORDER BY score DESC;",
        "trap": "Trong MySQL 8+ và T-SQL, chữ rank là tên hàm nên cần bọc [rank] hoặc `rank` hoặc \"rank\" khi đặt làm bí danh cột."
      }
    },
    {
      "id": "ch14_p2",
      "title": "[LeetCode #184] Tìm những nhân viên có mức lương cao nhất trong từng phòng ban",
      "difficulty": "Khá",
      "db": "leetcode",
      "summary": "Trên CSDL LeetCode (bảng LC_Employee và LC_Department), hãy tìm tất cả các nhân viên đạt mức lương cao nhất trong phòng ban của họ. Hiển thị 3 cột: Department (tên phòng), Employee (tên nhân viên) và Salary, sắp xếp theo Department tăng dần, Employee tăng dần.",
      "understand": "Có thể dùng CTE với RANK() / DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk rồi lọc WHERE rnk = 1.",
      "brute": "Chỉ dùng GROUP BY departmentId rồi lấy MAX(salary) mà không lấy được tên của tất cả những nhân viên cùng đạt mức lương tối đa đó.",
      "optimal": "Dùng CTE kèm RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk, lọc rnk = 1.",
      "trace": "Phòng IT có mức lương cao nhất là 90000 (Max). Phòng Sales có mức lương cao nhất là 80000 (Henry).",
      "sql": "WITH LuongCaoNhatPhong AS (\n    SELECT d.name AS Department,\n           e.name AS Employee,\n           e.salary AS Salary,\n           RANK() OVER (\n               PARTITION BY e.departmentId\n               ORDER BY e.salary DESC\n           ) AS rnk\n    FROM LC_Employee AS e\n    INNER JOIN LC_Department AS d ON e.departmentId = d.id\n)\nSELECT Department, Employee, Salary\nFROM LuongCaoNhatPhong\nWHERE rnk = 1\nORDER BY Department ASC, Employee ASC;",
      "expected": {
        "cols": [
          "Department",
          "Employee",
          "Salary"
        ],
        "rows": [
          [
            "IT",
            "Max",
            90000
          ],
          [
            "Sales",
            "Henry",
            80000
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Dùng ROW_NUMBER() = 1 làm mất đi các nhân viên đồng giải nhất trong cùng một phòng ban!",
      "note3": {
        "idea": "Khi đề yêu cầu tìm 'những người cao nhất mỗi nhóm' (có thể có nhiều người đồng hạng nhất), phải dùng RANK() = 1 hoặc DENSE_RANK() = 1, tuyệt đối không dùng ROW_NUMBER() = 1.",
        "syntax": "RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rnk ... WHERE rnk = 1",
        "trap": "Dùng ROW_NUMBER() sẽ cắt mất các bản ghi đồng hạng cao nhất."
      }
    },
    {
      "id": "ch14_p3",
      "title": "[LeetCode #196] Xóa các dòng Email trùng lặp và chỉ giữ lại dòng có id nhỏ nhất",
      "difficulty": "Khá",
      "db": "leetcode",
      "summary": "Trên CSDL LeetCode (bảng PersonEmail gồm id, email), hãy viết câu lệnh DELETE xóa trực tiếp các dòng có email bị trùng lặp sao cho mỗi email chỉ giữ lại duy nhất dòng có id nhỏ nhất. Sau khi xóa xong, chạy câu lệnh SELECT id, email FROM PersonEmail ORDER BY id ASC để kiểm tra.",
      "understand": "Một dòng cần giữ lại là dòng có id nằm trong tập MIN(id) của từng nhóm email: DELETE FROM PersonEmail WHERE id NOT IN (SELECT MIN(id) FROM PersonEmail GROUP BY email).",
      "brute": "Viết câu SELECT DISTINCT rồi tạo bảng mới thay thế bảng cũ.",
      "optimal": "Dùng DELETE FROM PersonEmail WHERE id NOT IN (SELECT MIN(id) FROM (SELECT id, email FROM PersonEmail) GROUP BY email).",
      "trace": "Email 'a@b.com' có id = 1 và id = 3; MIN(id) là 1 nên dòng id = 3 bị xóa. Còn lại 2 dòng: (1, 'a@b.com') và (2, 'c@d.com').",
      "sql": "DELETE FROM PersonEmail\nWHERE id NOT IN (\n    SELECT MIN(id)\n    FROM PersonEmail\n    GROUP BY email\n);\nSELECT id, email FROM PersonEmail ORDER BY id ASC;",
      "expected": {
        "cols": [
          "id",
          "email"
        ],
        "rows": [
          [
            1,
            "a@b.com"
          ],
          [
            2,
            "c@d.com"
          ]
        ]
      },
      "order_matters": true,
      "pitfalls": "Trên MySQL, nếu viết trực tiếp SELECT MIN(id) FROM PersonEmail bên trong lệnh DELETE của chính bảng PersonEmail sẽ bị lỗi 1093 (You can't specify target table for update in FROM clause); bọc thêm 1 lớp SELECT * FROM (SELECT MIN(id)...) AS tmp sẽ chạy được trên cả MySQL!",
      "note3": {
        "idea": "Để xóa bản ghi trùng và giữ lại bản ghi có ID nhỏ nhất, cách gọn nhất là giữ lại tập SELECT MIN(id) ... GROUP BY key.",
        "syntax": "DELETE FROM PersonEmail WHERE id NOT IN (SELECT MIN(id) FROM PersonEmail GROUP BY email);",
        "trap": "Riêng trên MySQL, bảng đang bị DELETE không được xuất hiện trực tiếp ở tầng thứ nhất của subquery mà phải bọc qua một Derived Table trung gian."
      }
    }
  ],
  "summary_table": [
    [
      "Top-N mỗi nhóm (#184, #185)",
      "CTE + DENSE_RANK() OVER (PARTITION BY ... ORDER BY ...)",
      "Luôn hỏi rõ cách xử lý các dòng đồng hạng"
    ],
    [
      "Tìm phần tử bị thiếu (#175, #183)",
      "LEFT JOIN ... WHERE right.id IS NULL hoặc NOT EXISTS",
      "Không dùng NOT IN nếu cột con có thể NULL"
    ],
    [
      "Chuỗi liên tiếp / So sánh dòng (#180, #197)",
      "LAG() / LEAD() hoặc SELF JOIN trên cột ngày tháng",
      "Kiểm tra kỹ xem ID/Ngày có bị đứt quãng không"
    ],
    [
      "Khử trùng lặp (#182, #196)",
      "GROUP BY ... HAVING COUNT(*) > 1 hoặc ROW_NUMBER() > 1",
      "Giữ lại dòng có MIN(id) hoặc ngày tạo sớm nhất"
    ],
    [
      "Production Troubleshooting",
      "Blocking -> Execution Plan -> Statistics -> Index -> ORM N+1",
      "Đo lường Logical Reads và Wait Stats trước khi sửa"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Trong bài LeetCode #185 (Lấy các nhân viên thuộc Top 3 mức lương cao nhất của mỗi phòng ban), tại sao ta phải dùng DENSE_RANK() mà không dùng RANK() hay ROW_NUMBER()?",
      "a": "Vì đề bài định nghĩa 'Top 3 mức lương cao nhất' là 3 giá trị lương phân biệt cao nhất. Nếu có 2 người cùng đạt mức lương cao nhất (hạng 1), người có mức lương cao tiếp theo phải được tính là mức lương thứ 2 (DENSE_RANK = 2) chứ không phải bị nhảy sang hạng 3 như RANK()."
    },
    {
      "q": "Câu 2: Trong bài LeetCode #197 (Tìm những ngày có nhiệt độ cao hơn ngày hôm qua), tại sao việc dùng LAG(temperature) OVER (ORDER BY recordDate) mà không kiểm tra khoảng cách ngày lại bị sai trên bộ test có ngày bị khuyết?",
      "a": "Vì nếu bảng có ngày 2015-01-01 (10 độ) rồi nhảy thẳng sang ngày 2015-01-05 (20 độ, bị khuyết mất ngày 02, 03, 04), hàm LAG() vẫn lấy dòng liền trước là ngày 01/01 để so sánh với ngày 05/01, trong khi ngày 01/01 không phải là 'ngày hôm qua' của 05/01!"
    },
    {
      "q": "Câu 3: Khi xóa các dòng trùng lặp trong bảng PersonEmail (#196) bằng cách tự nối bảng DELETE p1 FROM PersonEmail p1 JOIN PersonEmail p2 ON p1.email = p2.email WHERE ..., điều kiện ở WHERE phải viết như thế nào để giữ lại dòng có id nhỏ nhất?",
      "a": "Phải viết WHERE p1.id > p2.id (chỉ xóa bản ghi p1 nếu tồn tại một bản ghi p2 khác cùng email nhưng có id nhỏ hơn p1)."
    }
  ]
});
