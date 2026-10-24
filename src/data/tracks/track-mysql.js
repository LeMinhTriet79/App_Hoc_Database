/**
 * ==========================================================================
 * FILE: src/data/tracks/track-mysql.js
 * MÔ TẢ: Lộ Trình Mở Rộng: Chuyển Đổi Sang MySQL 8.0 & Động Cơ InnoDB
 * KIẾN TRÚC: window.BiKipRegistry.registerExpansionTrack("mysql", {...})
 * ==========================================================================
 */
(function(global) {
  "use strict";

  var TRACK_MYSQL = {
    id: "mysql",
    name: "Lộ Trình Mở Rộng: MySQL 8.0 & Động Cơ Lưu Trữ InnoDB",
    badge: "🐬 MySQL 8.0",
    desc: "Cẩm nang toàn diện dành cho lập trình viên SQL Server / T-SQL chuyển đổi sang làm việc với MySQL 8.0 / MariaDB trong các dự án Spring Boot và Node.js.",
    key_differences: [
      { feature: "Động cơ lưu trữ", sql_server: "Duy nhất (SQLOS / Storage Engine)", mysql: "Đa động cơ: InnoDB (ACID mặc định), MyISAM (không hỗ trợ Transaction), Memory" },
      { feature: "Mức cô lập mặc định", sql_server: "READ COMMITTED", mysql: "REPEATABLE READ (InnoDB sử dụng Next-Key Locks để chặn Phantom Read)" },
      { feature: "Phân trang dữ liệu", sql_server: "OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY", mysql: "LIMIT 10 OFFSET 20 (hoặc LIMIT 20, 10)" },
      { feature: "Nối chuỗi", sql_server: "Dấu + hoặc CONCAT()", mysql: "Bắt buộc dùng hàm CONCAT(a, b); dấu || mặc định là toán tử OR logic" },
      { feature: "Gom chuỗi theo nhóm", sql_server: "STRING_AGG(col, ',')", mysql: "GROUP_CONCAT(col ORDER BY col SEPARATOR ', ')" },
      { feature: "Upsert (Thêm hoặc Sửa)", sql_server: "MERGE INTO Target USING Source...", mysql: "INSERT INTO ... ON DUPLICATE KEY UPDATE col = VALUES(col)" }
    ],
    html_content: `<div class="track-content">
  <h2>🐬 Cẩm Nang Chuyển Đổi T-SQL Sang MySQL 8.0 &amp; InnoDB</h2>
  <div class="callout-info">
    <strong>Tư duy kiến trúc quan trọng nhất:</strong> Trong MySQL, bảng dữ liệu phụ thuộc hoàn toàn vào <em>Storage Engine</em> được chọn. 99% ứng dụng hiện đại bắt buộc phải dùng <strong>InnoDB</strong> để có tính năng ACID, Foreign Key và Row-level Locking.
  </div>

  <h3>1. Kiến Trúc Clustered Index Bắt Buộc Của InnoDB</h3>
  <p>Trong SQL Server, một bảng có thể là một Heap (không có Clustered Index). <strong>Trong MySQL InnoDB, một bảng BẮT BUỘC PHẢI CÓ MỘT CLUSTERED INDEX (gọi là Primary Key Index)</strong>:</p>
  <ul>
    <li>Nếu bạn định nghĩa <code>PRIMARY KEY</code>, InnoDB sẽ dùng nó làm Clustered Index.</li>
    <li>Nếu không có PK, InnoDB sẽ tìm cột <code>UNIQUE NOT NULL</code> đầu tiên.</li>
    <li>Nếu vẫn không có, InnoDB sẽ TỰ ĐỘNG SINH MỘT CỘT ẨN 6 BYTES tên là <code>DB_ROW_ID</code> để làm Clustered Index (làm lãng phí bộ nhớ và khó tối ưu).</li>
  </ul>
  <p><strong>Khuyên dùng:</strong> Luôn luôn chỉ định rõ một cột <code>BIGINT AUTO_INCREMENT PRIMARY KEY</code> cho mọi bảng InnoDB.</p>

  <h3>2. Mức Cô Lập Mặc Định: REPEATABLE READ &amp; Next-Key Locks</h3>
  <p>Khác với SQL Server mặc định là <code>READ COMMITTED</code>, MySQL InnoDB mặc định ở mức <strong><code>REPEATABLE READ</code></strong>. Tuy nhiên, InnoDB chặn được cả hiện tượng <em>Phantom Read</em> nhờ cơ chế đặc biệt gọi là <strong>Next-Key Locking</strong> (kết hợp giữa Record Lock trên bản ghi và Gap Lock trên khoảng trống trước bản ghi đó).</p>

  <h3>3. Bảng Mã Ký Tự utf8mb4_0900_ai_ci vs utf8</h3>
  <div class="callout-warn">
    <strong>Bẫy chết người:</strong> Trong MySQL cũ, kiểu mã hóa <code>utf8</code> chỉ hỗ trợ tối đa 3 bytes (bị lỗi khi lưu Emoji biểu cảm 4 bytes như 😊 hoặc tiếng Hán cổ). Từ MySQL 8.0, <strong>BẮT BUỘC</strong> phải sử dụng <code>CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci</code> (trong đó <code>ai</code> = Accent Insensitive không phân biệt dấu, <code>ci</code> = Case Insensitive không phân biệt hoa thường).
  </div>

  <h3>4. Phân Tích Kế Hoạch Thực Thi Với EXPLAIN ANALYZE</h3>
  <p>Từ bản MySQL 8.0.18+, bạn có thể chạy <code>EXPLAIN ANALYZE SELECT ...</code> để xem cây thực thi thời gian thực giống hệt như SQL Server Execution Plan:</p>
  <pre class="code-block"><code>EXPLAIN ANALYZE
SELECT c.CategoryName, COUNT(f.FruitID) AS TotalFruits
FROM Categories c
LEFT JOIN Fruits f ON c.CategoryID = f.CategoryID
GROUP BY c.CategoryID, c.CategoryName;</code></pre>
</div>`
  };

  if (global.BiKipRegistry && typeof global.BiKipRegistry.registerExpansionTrack === "function") {
    global.BiKipRegistry.registerExpansionTrack("mysql", TRACK_MYSQL);
  } else if (global.BIKIP_REGISTRY && typeof global.BIKIP_REGISTRY.registerTrack === "function") {
    global.BIKIP_REGISTRY.registerTrack("mysql", TRACK_MYSQL);
  }
})(typeof window !== "undefined" ? window : global);
