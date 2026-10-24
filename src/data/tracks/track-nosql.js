/**
 * ==========================================================================
 * FILE: src/data/tracks/track-nosql.js
 * MÔ TẢ: Lộ Trình Mở Rộng: NoSQL (MongoDB & Redis) Dành Cho Lập Trình Viên SQL
 * KIẾN TRÚC: window.BiKipRegistry.registerExpansionTrack("nosql", {...})
 * ==========================================================================
 */
(function(global) {
  "use strict";

  var TRACK_NOSQL = {
    id: "nosql",
    name: "Lộ Trình Mở Rộng: NoSQL (MongoDB & Redis) Dành Cho SQL Developer",
    badge: "🍃 NoSQL (Mongo/Redis)",
    desc: "Cẩm nang chuyển dịch tư duy từ Mô Hình Quan Hệ (RDBMS) sang Cơ Sở Dữ Liệu Hướng Tài Liệu (Document Store - MongoDB) và Bộ Nhớ Tạm Tốc Độ Cao (In-Memory Key-Value - Redis).",
    concept_mappings: [
      { rdbms: "Database (Cơ sở dữ liệu)", nosql: "Database (MongoDB) / Key Namespace (Redis)" },
      { rdbms: "Table (Bảng dữ liệu quan hệ)", nosql: "Collection (MongoDB) / Hash Key (Redis)" },
      { rdbms: "Row / Record (Dòng dữ liệu)", nosql: "BSON Document (MongoDB) / JSON String or Hash Field (Redis)" },
      { rdbms: "Column / Field (Cột dữ liệu)", nosql: "Field / Key-Value Pair (Hỗ trợ cấu trúc lồng nhau linh hoạt)" },
      { rdbms: "Primary Key (Khóa chính)", nosql: "_id (ObjectId 12 bytes tự động sinh trong MongoDB)" },
      { rdbms: "Foreign Key & JOIN", nosql: "Embedded Documents (Nhúng trực tiếp) hoặc $lookup aggregation" }
    ],
    html_content: `<div class="track-content">
  <h2>🍃 Cẩm Nang NoSQL (MongoDB &amp; Redis) Cho Dev SQL</h2>
  <div class="callout-info">
    <strong>Tư duy cốt lõi:</strong> Trong RDBMS, chúng ta thiết kế bảng theo <em>Dữ Liệu (Data-driven / Chuẩn hóa 3NF)</em> để tránh dư thừa. Trong NoSQL (MongoDB), chúng ta thiết kế theo <em>Truy Vấn (Query-driven)</em>: Cần đọc dữ liệu thế nào thì lưu trữ đúng cấu trúc như vậy để đọc 1 lần là lấy được toàn bộ!
  </div>

  <h3>1. Quy Tắc Vàng: Nhúng (Embedding) Hay Tham Chiếu (Referencing)?</h3>
  <table class="interactive chm-table">
    <thead>
      <tr>
        <th>Phương án thiết kế</th>
        <th>Khi nào NÊN sử dụng?</th>
        <th>Ví dụ thực tế (Cửa hàng FruitStore)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Nhúng (Embedding / Denormalized)</strong></td>
        <td>Quan hệ 1 - N nhỏ (1-to-Few, dưới 100 con), dữ liệu con luôn được đọc cùng dữ liệu cha, ít khi thay đổi độc lập.</td>
        <td>Nhúng trực tiếp danh sách <code>OrderDetails</code> vào trong Document của <code>Order</code>; nhúng mảng địa chỉ giao hàng vào <code>Customer</code>.</td>
      </tr>
      <tr>
        <td><strong>Tham chiếu (Referencing / Normalized)</strong></td>
        <td>Quan hệ 1 - N lớn (1-to-Many / 1-to-Millions), dữ liệu con phát triển không giới hạn (vượt trần 16MB/document), hoặc cần cập nhật độc lập thường xuyên.</td>
        <td>Lưu <code>Reviews</code> ở collection riêng và lưu <code>FruitId</code> tham chiếu; lưu <code>Logs</code> giao dịch riêng biệt.</td>
      </tr>
    </tbody>
  </table>

  <h3>2. Đối Chiếu SQL Query Sang MongoDB Aggregation Pipeline</h3>
  <p>Aggregation Pipeline trong MongoDB hoạt động giống như một băng chuyền nhà máy, truyền dữ liệu qua từng trạm xử lý tương ứng với các mệnh đề SQL:</p>
  <pre class="code-block"><code>// CÂU LỆNH SQL:
// SELECT CategoryName, COUNT(*) AS Total, AVG(Price) AS AvgPrice
// FROM Fruits
// WHERE IsActive = 1
// GROUP BY CategoryName
// HAVING COUNT(*) >= 3
// ORDER BY AvgPrice DESC;

// CHUYỂN SANG MONGODB AGGREGATION PIPELINE:
db.fruits.aggregate([
  { $match: { isActive: 1 } },                              // WHERE
  { $group: {                                               // GROUP BY
      _id: "$categoryName",
      total: { $sum: 1 },                                   // COUNT(*)
      avgPrice: { $avg: "$price" }                          // AVG(Price)
  }},
  { $match: { total: { $gte: 3 } } },                       // HAVING
  { $sort: { avgPrice: -1 } }                               // ORDER BY DESC
]);</code></pre>

  <h3>3. Giảm Tải Cho SQL Server Bằng Redis (Mẫu Thiết Kế Cache-Aside Pattern)</h3>
  <p>Để ngăn chặn hàng triệu truy vấn đọc đập trực tiếp vào SQL Server gây cạn kiệt CPU:</p>
  <ol>
    <li><strong>Bước 1:</strong> Ứng dụng Backend (Spring Boot / ASP.NET Core) kiểm tra trong Redis Cache trước bằng khóa (ví dụ: <code>fruit:1042</code>).</li>
    <li><strong>Bước 2 (Cache Hit):</strong> Nếu có dữ liệu trong Redis, trả về ngay lập tức cho người dùng (thời gian &lt; 1ms).</li>
    <li><strong>Bước 3 (Cache Miss):</strong> Nếu chưa có, ứng dụng truy vấn xuống SQL Server, lưu kết quả vào Redis với thời gian hết hạn (TTL: Time-To-Live, ví dụ 15 phút), rồi trả về cho người dùng.</li>
    <li><strong>Bước 4 (Cache Invalidation):</strong> Khi quản trị viên cập nhật giá trái cây, Backend xóa khóa <code>fruit:1042</code> trong Redis để buộc lần đọc tiếp theo nạp lại giá mới từ SQL Server.</li>
  </ol>
</div>`
  };

  if (global.BiKipRegistry && typeof global.BiKipRegistry.registerExpansionTrack === "function") {
    global.BiKipRegistry.registerExpansionTrack("nosql", TRACK_NOSQL);
  } else if (global.BIKIP_REGISTRY && typeof global.BIKIP_REGISTRY.registerTrack === "function") {
    global.BIKIP_REGISTRY.registerTrack("nosql", TRACK_NOSQL);
  }
})(typeof window !== "undefined" ? window : global);
