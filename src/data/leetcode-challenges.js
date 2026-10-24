/**
 * ==========================================================================
 * FILE: src/data/leetcode-challenges.js
 * MÔ TẢ: 12 Bài Toán LeetCode SQL Kinh Điển (#175 - #197)
 * CƠ SỞ DỮ LIỆU LIÊN KẾT: "leetcode" (Định nghĩa trong src/data/databases/db-leetcode.js)
 * CÁC BẢNG: Person, Address, LC_Department, LC_Employee, Scores, Logs,
 *           PersonEmail, LC_Customers, LC_Orders, Weather
 * KIẾN TRÚC: Gọi window.BiKipRegistry.setLeetCodeChallenges([...])
 * ==========================================================================
 */
(function(global) {
  "use strict";

  var CHALLENGES = [
    {
      id: "lc-175",
      lc_num: 175,
      title: "Combine Two Tables (Ghép Bảng Nhân Khẩu & Địa Chỉ)",
      difficulty: "Dễ",
      db: "leetcode",
      pattern: "LEFT JOIN bảo toàn dòng",
      prompt: "Viết câu lệnh SQL báo cáo `firstName`, `lastName`, `city`, và `state` của mỗi người trong bảng `Person`. Nếu địa chỉ của `personId` không tồn tại trong bảng `Address`, hiển thị giá trị `null` cho city và state.",
      hints: [
        "Tầng 1 (Gợi ý hướng đi): Bạn cần giữ lại tất cả mọi người trong bảng Person, bất kể họ đã có địa chỉ hay chưa.",
        "Tầng 2 (Gợi ý cú pháp): Dùng phép nối bảo toàn bên trái `LEFT JOIN` giữa `Person` và `Address` với khóa nối `personId`.",
        "Tầng 3 (Lời giải chi tiết): `SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;`"
      ],
      starter_sql: "SELECT p.firstName, p.lastName, a.city, a.state\nFROM Person p\n-- Viết tiếp câu lệnh LEFT JOIN ở đây\n;",
      solution_sql: "SELECT p.firstName, p.lastName, a.city, a.state\nFROM Person p\nLEFT JOIN Address a ON p.personId = a.personId;",
      required_keywords: ["LEFT JOIN", "ON"],
      forbidden_keywords: ["RIGHT JOIN"],
      order_matters: false
    },
    {
      id: "lc-176",
      lc_num: 176,
      title: "Second Highest Salary (Mức Lương Cao Thứ Nhì)",
      difficulty: "Trung bình",
      db: "leetcode",
      pattern: "MAX() lồng nhau hoặc Subquery lọc nhỏ hơn",
      prompt: "Tìm mức lương cao thứ hai từ bảng `LC_Employee` và đặt tên cột kết quả là `SecondHighestSalary`. Nếu không có mức lương cao thứ hai (ví dụ bảng chỉ có 1 nhân viên hoặc tất cả bằng lương nhau), câu lệnh PHẢI TRẢ VỀ NULL.",
      hints: [
        "Tầng 1 (Gợi ý hướng đi): Lương cao thứ hai chính là mức lương lớn nhất trong số các mức lương nhỏ hơn mức lương cao nhất.",
        "Tầng 2 (Gợi ý cú pháp): Dùng `SELECT MAX(salary) ... WHERE salary < (SELECT MAX(salary) FROM LC_Employee)`. Hàm MAX() tự động trả về NULL khi tập kết quả rỗng.",
        "Tầng 3 (Lời giải chi tiết): `SELECT MAX(salary) AS SecondHighestSalary FROM LC_Employee WHERE salary < (SELECT MAX(salary) FROM LC_Employee);`"
      ],
      starter_sql: "SELECT MAX(salary) AS SecondHighestSalary\nFROM LC_Employee\nWHERE -- Viết điều kiện lọc mức lương ở đây\n;",
      solution_sql: "SELECT MAX(salary) AS SecondHighestSalary\nFROM LC_Employee\nWHERE salary < (SELECT MAX(salary) FROM LC_Employee);",
      required_keywords: ["SELECT", "MAX"],
      forbidden_keywords: [],
      order_matters: false
    },
    {
      id: "lc-177",
      lc_num: 177,
      title: "Nth Highest Salary (Mức Lương Cao Thứ N — Xét N = 3)",
      difficulty: "Trung bình",
      db: "leetcode",
      pattern: "DENSE_RANK() hoặc DISTINCT + LIMIT 1 OFFSET N-1",
      prompt: "Tìm mức lương cao thứ 3 (đặt tên cột kết quả là `getNthHighestSalary`) từ bảng `LC_Employee`. Nếu không tồn tại mức lương cao thứ 3, trả về `null`.",
      hints: [
        "Tầng 1 (Gợi ý hướng đi): Các mức lương có thể bị trùng lặp, cần dùng `DISTINCT` trước khi sắp xếp giảm dần.",
        "Tầng 2 (Gợi ý cú pháp): Để lấy phần tử thứ N (với N=3), sau khi ORDER BY salary DESC, ta bỏ qua 2 phần tử đầu bằng `OFFSET 2` và lấy 1 phần tử bằng `LIMIT 1`.",
        "Tầng 3 (Lời giải chi tiết): Bọc câu lệnh con trong SELECT vô hướng để tự động trả về NULL nếu không có dòng: `SELECT (SELECT DISTINCT salary FROM LC_Employee ORDER BY salary DESC LIMIT 1 OFFSET 2) AS getNthHighestSalary;`"
      ],
      starter_sql: "SELECT (\n  SELECT DISTINCT salary\n  FROM LC_Employee\n  ORDER BY salary DESC\n  -- Viết tiếp LIMIT / OFFSET cho vị trí thứ 3\n) AS getNthHighestSalary;",
      solution_sql: "SELECT (\n  SELECT DISTINCT salary\n  FROM LC_Employee\n  ORDER BY salary DESC\n  LIMIT 1 OFFSET 2\n) AS getNthHighestSalary;",
      required_keywords: ["SELECT", "DISTINCT", "ORDER BY", "LIMIT"],
      forbidden_keywords: [],
      order_matters: false
    },
    {
      id: "lc-178",
      lc_num: 178,
      title: "Rank Scores (Xếp Hạng Điểm Số Không Khuyết Hạng)",
      difficulty: "Trung bình",
      db: "leetcode",
      pattern: "DENSE_RANK() OVER (ORDER BY score DESC)",
      prompt: "Xếp hạng điểm số từ bảng `Scores` theo quy tắc: Điểm xếp từ cao xuống thấp; nếu 2 người bằng điểm thì cùng hạng; hạng tiếp theo KHÔNG ĐƯỢC NHẢY CÁCH (ví dụ: 1, 2, 2, 3). Đặt tên cột là `score` và `rank`.",
      hints: [
        "Tầng 1 (Gợi ý hướng đi): Phân biệt 3 hàm xếp hạng: `ROW_NUMBER()` không trùng, `RANK()` nhảy cóc số thứ tự (1, 2, 2, 4), `DENSE_RANK()` không nhảy cóc.",
        "Tầng 2 (Gợi ý cú pháp): Cú pháp chuẩn của hàm cửa sổ: `DENSE_RANK() OVER (ORDER BY score DESC)`.",
        "Tầng 3 (Lời giải chi tiết): `SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS rank FROM Scores ORDER BY score DESC;`"
      ],
      starter_sql: "SELECT score, -- Sử dụng hàm DENSE_RANK() ở đây\nFROM Scores\nORDER BY score DESC;",
      solution_sql: "SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS rank\nFROM Scores\nORDER BY score DESC;",
      required_keywords: ["DENSE_RANK()", "OVER", "ORDER BY"],
      forbidden_keywords: [],
      order_matters: true
    },
    {
      id: "lc-180",
      lc_num: 180,
      title: "Consecutive Numbers (Số Xuất Hiện Liên Tiếp 3 Lần)",
      difficulty: "Trung bình",
      db: "leetcode",
      pattern: "LEAD() / LAG() hoặc Self-Join 3 bảng theo ID",
      prompt: "Tìm tất cả các số (`num`) xuất hiện liên tiếp ít nhất 3 lần theo thứ tự `id` tăng dần trong bảng `Logs`. Đặt tên cột kết quả là `ConsecutiveNums`.",
      hints: [
        "Tầng 1 (Gợi ý hướng đi): 'Liên tiếp 3 lần' nghĩa là dòng hiện tại (id), dòng tiếp theo (id+1) và dòng sau nữa (id+2) đều có cùng giá trị `num`.",
        "Tầng 2 (Gợi ý cú pháp): Nối tự thân bảng Logs với chính nó 2 lần: `l1 JOIN Logs l2 ON l1.id = l2.id - 1 JOIN Logs l3 ON l1.id = l3.id - 2` kèm điều kiện `l1.num = l2.num AND l2.num = l3.num`.",
        "Tầng 3 (Lời giải chi tiết): Nhớ thêm `DISTINCT` để loại bỏ số bị trùng nếu chuỗi dài hơn 3 lần: `SELECT DISTINCT l1.num AS ConsecutiveNums FROM Logs l1 JOIN Logs l2 ON l1.id = l2.id - 1 JOIN Logs l3 ON l1.id = l3.id - 2 WHERE l1.num = l2.num AND l2.num = l3.num;`"
      ],
      starter_sql: "SELECT DISTINCT l1.num AS ConsecutiveNums\nFROM Logs l1\n-- Tự nối bảng Logs với l2 và l3 ở đây\n;",
      solution_sql: "SELECT DISTINCT l1.num AS ConsecutiveNums\nFROM Logs l1\nJOIN Logs l2 ON l1.id = l2.id - 1\nJOIN Logs l3 ON l1.id = l3.id - 2\nWHERE l1.num = l2.num AND l2.num = l3.num;",
      required_keywords: ["DISTINCT", "JOIN"],
      forbidden_keywords: [],
      order_matters: false
    },
    {
      id: "lc-181",
      lc_num: 181,
      title: "Employees Earning More Than Their Managers",
      difficulty: "Dễ",
      db: "leetcode",
      pattern: "Self-Join theo quan hệ managerId = id",
      prompt: "Tìm tên những nhân viên (`Employee`) trong bảng `LC_Employee` có mức lương cao hơn người quản lý trực tiếp của họ.",
      hints: [
        "Tầng 1 (Gợi ý hướng đi): Trong bảng `LC_Employee`, cột `managerId` chính là khóa ngoại trỏ tới `id` của người quản lý trong cùng bảng đó.",
        "Tầng 2 (Gợi ý cú pháp): Nối bảng `LC_Employee e` (nhân viên) với `LC_Employee m` (quản lý) bằng điều kiện `e.managerId = m.id`.",
        "Tầng 3 (Lời giải chi tiết): `SELECT e.name AS Employee FROM LC_Employee e JOIN LC_Employee m ON e.managerId = m.id WHERE e.salary > m.salary;`"
      ],
      starter_sql: "SELECT e.name AS Employee\nFROM LC_Employee e\n-- Nối tự thân với người quản lý m ở đây\n;",
      solution_sql: "SELECT e.name AS Employee\nFROM LC_Employee e\nJOIN LC_Employee m ON e.managerId = m.id\nWHERE e.salary > m.salary;",
      required_keywords: ["JOIN", "ON", "WHERE"],
      forbidden_keywords: [],
      order_matters: false
    },
    {
      id: "lc-182",
      lc_num: 182,
      title: "Duplicate Emails (Tìm Email Bị Trùng Lặp)",
      difficulty: "Dễ",
      db: "leetcode",
      pattern: "GROUP BY email HAVING COUNT(*) > 1",
      prompt: "Báo cáo tất cả các địa chỉ email bị trùng lặp (xuất hiện từ 2 lần trở lên) trong bảng `PersonEmail`. Đặt tên cột kết quả là `Email`.",
      hints: [
        "Tầng 1 (Gợi ý hướng đi): Gom nhóm các dòng theo địa chỉ email và đếm số lượng dòng trong mỗi nhóm.",
        "Tầng 2 (Gợi ý cú pháp): Lọc các nhóm có số lượng > 1 bằng mệnh đề `HAVING COUNT(email) > 1` (không dùng WHERE vì WHERE không lọc được hàm tổng hợp).",
        "Tầng 3 (Lời giải chi tiết): `SELECT email AS Email FROM PersonEmail GROUP BY email HAVING COUNT(email) > 1;`"
      ],
      starter_sql: "SELECT email AS Email\nFROM PersonEmail\n-- Gom nhóm và lọc nhóm ở đây\n;",
      solution_sql: "SELECT email AS Email\nFROM PersonEmail\nGROUP BY email\nHAVING COUNT(email) > 1;",
      required_keywords: ["GROUP BY", "HAVING", "COUNT"],
      forbidden_keywords: [],
      order_matters: false
    },
    {
      id: "lc-183",
      lc_num: 183,
      title: "Customers Who Never Order (Khách Chưa Từng Đặt Hàng)",
      difficulty: "Dễ",
      db: "leetcode",
      pattern: "LEFT JOIN ... WHERE o.id IS NULL hoặc NOT EXISTS",
      prompt: "Tìm tất cả khách hàng trong bảng `LC_Customers` chưa từng đặt bất kỳ đơn hàng nào trong bảng `LC_Orders`. Đặt tên cột kết quả là `Customers`.",
      hints: [
        "Tầng 1 (Gợi ý hướng đi): Dùng `LEFT JOIN` từ khách hàng sang đơn hàng. Khách nào chưa mua thì toàn bộ cột của `LC_Orders` sẽ mang giá trị NULL.",
        "Tầng 2 (Gợi ý cú pháp): Lọc các dòng có `o.id IS NULL` hoặc dùng `WHERE c.id NOT IN (SELECT customerId FROM LC_Orders WHERE customerId IS NOT NULL)`.",
        "Tầng 3 (Lời giải chi tiết): `SELECT c.name AS Customers FROM LC_Customers c LEFT JOIN LC_Orders o ON c.id = o.customerId WHERE o.id IS NULL;`"
      ],
      starter_sql: "SELECT c.name AS Customers\nFROM LC_Customers c\n-- Viết tiếp LEFT JOIN hoặc NOT EXISTS ở đây\n;",
      solution_sql: "SELECT c.name AS Customers\nFROM LC_Customers c\nLEFT JOIN LC_Orders o ON c.id = o.customerId\nWHERE o.id IS NULL;",
      required_keywords: ["LEFT JOIN", "IS NULL"],
      forbidden_keywords: [],
      order_matters: false
    },
    {
      id: "lc-184",
      lc_num: 184,
      title: "Department Highest Salary (Lương Cao Nhất Mỗi Phòng Ban)",
      difficulty: "Trung bình",
      db: "leetcode",
      pattern: "DENSE_RANK() / RANK() OVER (PARTITION BY ...)",
      prompt: "Tìm các nhân viên có mức lương cao nhất trong mỗi phòng ban. Kết quả hiển thị 3 cột: `Department`, `Employee`, và `Salary`. Nếu trong 1 phòng ban có nhiều người đồng mức lương cao nhất, hiển thị tất cả.",
      hints: [
        "Tầng 1 (Gợi ý hướng đi): Cần xếp hạng mức lương riêng cho từng phòng ban bằng hàm cửa sổ `PARTITION BY departmentId`.",
        "Tầng 2 (Gợi ý cú pháp): Dùng CTE để tính `DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rk`.",
        "Tầng 3 (Lời giải chi tiết): `WITH Ranked AS (SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rk FROM LC_Employee e JOIN LC_Department d ON e.departmentId = d.id) SELECT Department, Employee, Salary FROM Ranked WHERE rk = 1;`"
      ],
      starter_sql: "WITH RankedSalary AS (\n  -- Tính xếp hạng lương theo từng phòng ban ở đây\n)\nSELECT Department, Employee, Salary\nFROM RankedSalary\nWHERE rk = 1;",
      solution_sql: "WITH RankedSalary AS (\n  SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary,\n         DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rk\n  FROM LC_Employee e\n  JOIN LC_Department d ON e.departmentId = d.id\n)\nSELECT Department, Employee, Salary\nFROM RankedSalary\nWHERE rk = 1;",
      required_keywords: ["DENSE_RANK()", "OVER", "PARTITION BY"],
      forbidden_keywords: [],
      order_matters: false
    },
    {
      id: "lc-185",
      lc_num: 185,
      title: "Department Top Three Salaries (Top 3 Mức Lương Mỗi Phòng)",
      difficulty: "Khó",
      db: "leetcode",
      pattern: "DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) <= 3",
      prompt: "Tìm các nhân viên có mức lương nằm trong Top 3 MỨC LƯƠNG ĐỘC NHẤT (Unique Salaries) cao nhất trong mỗi phòng ban. Kết quả hiển thị: `Department`, `Employee`, `Salary`.",
      hints: [
        "Tầng 1 (Gợi ý hướng đi): Đề bài yêu cầu Top 3 'Mức lương', nghĩa là nếu có 2 nhân viên cùng nhận 90k (hạng 1), người nhận 85k vẫn là hạng 2, và người nhận 80k là hạng 3. BẮT BUỘC dùng `DENSE_RANK()` (hàm `RANK()` sẽ nhảy cách và làm sai kết quả).",
        "Tầng 2 (Gợi ý cú pháp): Xếp hạng với `PARTITION BY e.departmentId ORDER BY e.salary DESC` và lọc `rk <= 3`.",
        "Tầng 3 (Lời giải chi tiết): `WITH RankedTop3 AS (SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary, DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rk FROM LC_Employee e JOIN LC_Department d ON e.departmentId = d.id) SELECT Department, Employee, Salary FROM RankedTop3 WHERE rk <= 3;`"
      ],
      starter_sql: "WITH RankedTop3 AS (\n  -- Xếp hạng lương Top 3 không nhảy cách ở đây\n)\nSELECT Department, Employee, Salary\nFROM RankedTop3\nWHERE rk <= 3;",
      solution_sql: "WITH RankedTop3 AS (\n  SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary,\n         DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rk\n  FROM LC_Employee e\n  JOIN LC_Department d ON e.departmentId = d.id\n)\nSELECT Department, Employee, Salary\nFROM RankedTop3\nWHERE rk <= 3;",
      required_keywords: ["DENSE_RANK()", "OVER", "PARTITION BY", "<= 3"],
      forbidden_keywords: [],
      order_matters: false
    },
    {
      id: "lc-196",
      lc_num: 196,
      title: "Delete Duplicate Emails (Giữ Lại ID Nhỏ Nhất Cho Mỗi Email)",
      difficulty: "Dễ",
      db: "leetcode",
      pattern: "GROUP BY email lấy MIN(id) để khử trùng lặp",
      prompt: "Trong bài toán kiểm tra dữ liệu email sau khi khử trùng, hãy viết câu lệnh SQL để lấy danh sách các bản ghi email duy nhất từ bảng `PersonEmail` sao cho mỗi email chỉ giữ lại bản ghi có `id` nhỏ nhất. Kết quả hiển thị: `id`, `email` theo thứ tự id tăng dần.",
      hints: [
        "Tầng 1 (Gợi ý hướng đi): Gom nhóm theo cột `email` và dùng hàm tổng hợp `MIN(id)` để tìm id nhỏ nhất của mỗi email.",
        "Tầng 2 (Gợi ý cú pháp): `SELECT MIN(id) AS id, email FROM PersonEmail GROUP BY email ORDER BY id ASC`.",
        "Tầng 3 (Lời giải chi tiết): `SELECT MIN(id) AS id, email FROM PersonEmail GROUP BY email ORDER BY id ASC;`"
      ],
      starter_sql: "SELECT MIN(id) AS id, email\nFROM PersonEmail\n-- Viết tiếp GROUP BY và ORDER BY ở đây\n;",
      solution_sql: "SELECT MIN(id) AS id, email\nFROM PersonEmail\nGROUP BY email\nORDER BY id ASC;",
      required_keywords: ["GROUP BY", "MIN"],
      forbidden_keywords: [],
      order_matters: true
    },
    {
      id: "lc-197",
      lc_num: 197,
      title: "Rising Temperature (Ngày Có Nhiệt Độ Cao Hơn Hôm Trước)",
      difficulty: "Dễ",
      db: "leetcode",
      pattern: "Self-Join ngày hôm nay (w1) với ngày hôm qua (w2) và so sánh nhiệt độ",
      prompt: "Tìm tất cả `id` của các ngày có nhiệt độ (`temperature`) cao hơn so với ngày hôm trước (ngày hôm qua) từ bảng `Weather`.",
      hints: [
        "Tầng 1 (Gợi ý hướng đi): Cần tự nối bảng Weather `w1` (ngày hôm nay) với bảng Weather `w2` (ngày hôm qua). Chú ý: `id` có thể không liên tục, phải so sánh theo cột ngày tháng `recordDate`.",
        "Tầng 2 (Gợi ý cú pháp trong SQLite): Dùng hàm `julianday(w1.recordDate) - julianday(w2.recordDate) = 1` để kiểm tra khoảng cách đúng 1 ngày. (Trong SQL Server dùng `DATEDIFF(day, w2.recordDate, w1.recordDate) = 1`).",
        "Tầng 3 (Lời giải chi tiết): `SELECT w1.id FROM Weather w1 JOIN Weather w2 ON julianday(w1.recordDate) - julianday(w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;`"
      ],
      starter_sql: "SELECT w1.id\nFROM Weather w1\nJOIN Weather w2 ON -- Điều kiện w1 là ngày liền sau w2\nWHERE w1.temperature > w2.temperature;",
      solution_sql: "SELECT w1.id\nFROM Weather w1\nJOIN Weather w2 ON julianday(w1.recordDate) - julianday(w2.recordDate) = 1\nWHERE w1.temperature > w2.temperature;",
      required_keywords: ["JOIN", "ON", "julianday"],
      forbidden_keywords: [],
      order_matters: false
    }
  ];

  // Đăng ký 12 thử thách vào Registry trung tâm
  if (global.BiKipRegistry && typeof global.BiKipRegistry.setLeetCodeChallenges === "function") {
    global.BiKipRegistry.setLeetCodeChallenges(CHALLENGES);
  } else if (global.BIKIP_REGISTRY) {
    global.BIKIP_REGISTRY.leetcode_challenges = CHALLENGES;
  }
})(typeof window !== "undefined" ? window : global);
