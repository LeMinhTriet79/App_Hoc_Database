/**
 * ==========================================================================
 * FILE: src/data/tracks/track-postgresql.js
 * MÔ TẢ: Lộ Trình Mở Rộng: Chuyển Đổi Sang PostgreSQL 16 & Hệ Sinh Thái Enterprise
 * KIẾN TRÚC: window.BiKipRegistry.registerExpansionTrack("postgresql", {...})
 * ==========================================================================
 */
(function(global) {
  "use strict";

  var TRACK_POSTGRESQL = {
    id: "postgresql",
    name: "Lộ Trình Mở Rộng: PostgreSQL 16 (Hệ CSDL Quan Hệ Tiên Tiến Nhất)",
    badge: "🐘 PostgreSQL 16",
    desc: "Cẩm nang chuyên sâu dành cho lập trình viên Backend chuyển đổi từ SQL Server sang PostgreSQL 16: Cơ chế MVCC xmin/xmax, VACUUM, JSONB, GIN Index và LATERAL JOIN.",
    key_differences: [
      { feature: "Cơ chế MVCC", sql_server: "Dùng tempdb Version Store khi bật RCSI", postgresql: "Lưu bản ghi phiên bản mới ngay trong cùng Data Page; dùng 2 cột ẩn xmin và xmax" },
      { feature: "Thu gom rác (Garbage Collection)", sql_server: "Tự động dọn tempdb", postgresql: "Bắt buộc có tiến trình VACUUM / autovacuum để tái sử dụng Dead Tuples" },
      { feature: "Khóa tự tăng", sql_server: "IDENTITY(1,1)", postgresql: "SERIAL (cũ) hoặc GENERATED ALWAYS AS IDENTITY (Chuẩn SQL:2008)" },
      { feature: "Tìm kiếm không phân biệt hoa thường", sql_server: "Collation _CI (Case Insensitive)", postgresql: "Toán tử ILIKE hoặc kiểu dữ liệu citext" },
      { feature: "Lấy dòng đầu của nhóm", sql_server: "ROW_NUMBER() OVER(PARTITION BY ...)", postgresql: "Mệnh đề siêu tốc DISTINCT ON (col1, col2)" },
      { feature: "CROSS APPLY tương đương", sql_server: "CROSS APPLY / OUTER APPLY", postgresql: "LATERAL JOIN (LEFT JOIN LATERAL)" },
      { feature: "Trả về dữ liệu sau DML", sql_server: "OUTPUT INSERTED.*", postgresql: "Mệnh đề RETURNING *" }
    ],
    html_content: `<div class="track-content">
  <h2>🐘 Cẩm Nang Chuyển Đổi T-SQL Sang PostgreSQL 16</h2>
  <div class="callout-info">
    <strong>PostgreSQL (The World's Most Advanced Open Source Relational Database):</strong> Là hệ quản trị được ưa chuộng số 1 hiện nay trong các hệ thống Microservices, kiến trúc Cloud Native và trí tuệ nhân tạo (kèm extension pgvector).
  </div>

  <h3>1. Cơ Chế MVCC Thuần Túy: xmin, xmax &amp; Trách Nhiệm Của VACUUM</h3>
  <p>Trong PostgreSQL, câu lệnh <code>UPDATE</code> không bao giờ ghi đè trực tiếp lên dữ liệu cũ. Nó chèn một <strong>Dòng Mới (New Tuple)</strong> và đánh dấu dòng cũ là 'Chết' (Dead Tuple) bằng cách ghi Transaction ID vào cột ẩn <code>xmax</code>.</p>
  <ul>
    <li><strong>Ưu điểm:</strong> Đọc không khóa ghi, ghi không khóa đọc với tốc độ cực cao.</li>
    <li><strong>Nhược điểm:</strong> Hiện tượng phình to dữ liệu bảng (Table Bloat).</li>
    <li><strong>Giải pháp:</strong> Tiến trình ngầm <code>autovacuum</code> tự động quét dọn các Dead Tuples để đánh dấu khoảng trống cho các lệnh INSERT tiếp theo tái sử dụng.</li>
  </ul>

  <h3>2. Tuyệt Chiêu DISTINCT ON (...) Chỉ Có Trong PostgreSQL</h3>
  <p>Để giải bài toán 'Lấy đơn hàng mới nhất của từng khách hàng', trong SQL Server bạn phải viết một CTE kèm <code>ROW_NUMBER() OVER(PARTITION BY CustomerID ORDER BY OrderDate DESC) WHERE rn = 1</code>. <strong>Trong PostgreSQL, bạn chỉ cần 1 dòng duy nhất:</strong></p>
  <pre class="code-block"><code>SELECT DISTINCT ON (CustomerID) CustomerID, OrderID, OrderDate, TotalAmount
FROM Orders
ORDER BY CustomerID, OrderDate DESC;</code></pre>

  <h3>3. JSONB Đỉnh Cao &amp; Chỉ Mục GIN (Generalized Inverted Index)</h3>
  <p>Khác với SQL Server lưu JSON dưới dạng chuỗi văn bản thuần túy (NVARCHAR), PostgreSQL có kiểu dữ liệu <strong><code>JSONB</code></strong> (Binary JSON đã được phân tích cú pháp sẵn, loại bỏ khoảng trắng thừa và sắp xếp khóa). Bạn có thể đánh chỉ mục GIN để truy vấn các thuộc tính JSON với tốc độ ngang ngửa cột dữ liệu số:</p>
  <pre class="code-block"><code>-- Tạo chỉ mục GIN trên cột JSONB:
CREATE INDEX idx_fruits_attrs ON Fruits USING GIN (AttributesJSON);

-- Tìm kiếm siêu tốc sản phẩm có vị Ngọt:
SELECT * FROM Fruits WHERE AttributesJSON @> '{"Taste": "Sweet"}';</code></pre>

  <h3>4. LATERAL JOIN — Người Anh Em Sinh Đôi Của CROSS APPLY</h3>
  <p>Khi cần truyền một giá trị của bảng bên trái làm tham số cho một subquery phức tạp bên phải:</p>
  <pre class="code-block"><code>SELECT c.CategoryName, top_fruits.FruitName, top_fruits.Price
FROM Categories c
CROSS JOIN LATERAL (
    SELECT f.FruitName, f.Price
    FROM Fruits f
    WHERE f.CategoryID = c.CategoryID
    ORDER BY f.Price DESC
    LIMIT 2
) AS top_fruits;</code></pre>
</div>`
  };

  if (global.BiKipRegistry && typeof global.BiKipRegistry.registerExpansionTrack === "function") {
    global.BiKipRegistry.registerExpansionTrack("postgresql", TRACK_POSTGRESQL);
  } else if (global.BIKIP_REGISTRY && typeof global.BIKIP_REGISTRY.registerTrack === "function") {
    global.BIKIP_REGISTRY.registerTrack("postgresql", TRACK_POSTGRESQL);
  }
})(typeof window !== "undefined" ? window : global);
