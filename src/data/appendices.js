/**
 * ==========================================================================
 * FILE: src/data/appendices.js
 * MÔ TẢ: Hệ Thống 6 Phụ Lục Tra Cứu Nhanh (A - F) & Giấy Phép Bản Quyền
 * 1. Phụ lục A: Bảng Đối Chiếu Cú Pháp SQL Server vs SQLite vs PostgreSQL vs MySQL
 * 2. Phụ lục B: Bảng Ánh Xạ Kiểu Dữ Liệu SQL Server sang Java & C#
 * 3. Phụ lục C: Bảng Tra Cứu Mã Định Dạng CONVERT(style) & Hàm Ngày Giờ T-SQL
 * 4. Phụ lục D: Sổ Tay Giải Mã 11 Toán Tử Trong Execution Plan
 * 5. Phụ lục E: Danh Mục Toàn Bộ Phím Tắt CHM & Phòng Lab SQL
 * 6. Phụ lục F: Thông Tin Phiên Bản & Giấy Phép Bản Quyền CC BY-SA 4.0
 * KIẾN TRÚC: Gọi window.BiKipRegistry.setAppendicesHtml(htmlStr)
 * ==========================================================================
 */
(function(global) {
  "use strict";

  var APPENDICES_HTML = `<div class="appendices-container">
  <div class="ch-banner">
    <div class="ch-code">PHỤ LỤC TRA CỨU // APPENDICES A - F</div>
    <h1>Cẩm Nang Tra Cứu Nhanh Đa Hệ Quản Trị &amp; Bản Quyền Tri Thức</h1>
    <div class="ch-source">Bí Kíp Cơ Sở Dữ Liệu SQL Server, Java &amp; .NET Edition v2005</div>
  </div>

  <!-- PHỤ LỤC A -->
  <section class="section-card" id="appendix-a">
    <h2>Phụ lục A: Bảng Đối Chiếu Cú Pháp Toàn Diện Giữa 4 Hệ Quản Trị CSDL Phổ Biến</h2>
    <p>Bảng tổng hợp đối chiếu cú pháp giữa <strong>Microsoft SQL Server (T-SQL)</strong>, <strong>SQLite (Phòng Lab WASM)</strong>, <strong>PostgreSQL 16</strong> và <strong>MySQL 8.0</strong>:</p>
    <div class="sunken-panel" style="overflow-x: auto;">
      <table class="interactive chm-table">
        <thead>
          <tr>
            <th>Tính năng kỹ thuật</th>
            <th>SQL Server (T-SQL)</th>
            <th>SQLite (Phòng Lab WASM)</th>
            <th>PostgreSQL 16</th>
            <th>MySQL 8.0 / MariaDB</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Giới hạn dòng đầu</strong></td>
            <td><code>SELECT TOP 10 ...</code></td>
            <td><code>LIMIT 10</code></td>
            <td><code>LIMIT 10</code></td>
            <td><code>LIMIT 10</code></td>
          </tr>
          <tr>
            <td><strong>Phân trang (Paging)</strong></td>
            <td><code>OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY</code></td>
            <td><code>LIMIT 10 OFFSET 20</code></td>
            <td><code>OFFSET 20 LIMIT 10</code></td>
            <td><code>LIMIT 20, 10</code></td>
          </tr>
          <tr>
            <td><strong>Nối chuỗi ký tự</strong></td>
            <td>Toán tử <code>+</code> hoặc <code>CONCAT(a, b)</code></td>
            <td>Toán tử <code>||</code></td>
            <td>Toán tử <code>||</code> hoặc <code>CONCAT(a, b)</code></td>
            <td><code>CONCAT(a, b)</code> (Dấu <code>||</code> mặc định là OR)</td>
          </tr>
          <tr>
            <td><strong>Thay thế giá trị NULL</strong></td>
            <td><code>ISNULL(col, def)</code> hoặc <code>COALESCE(...)</code></td>
            <td><code>IFNULL(col, def)</code> hoặc <code>COALESCE(...)</code></td>
            <td><code>COALESCE(col, def)</code></td>
            <td><code>IFNULL(col, def)</code> hoặc <code>COALESCE(...)</code></td>
          </tr>
          <tr>
            <td><strong>Thời gian hiện tại</strong></td>
            <td><code>GETDATE()</code> / <code>SYSDATETIME()</code></td>
            <td><code>datetime('now', 'localtime')</code></td>
            <td><code>NOW()</code> / <code>CURRENT_TIMESTAMP</code></td>
            <td><code>NOW()</code> / <code>CURRENT_TIMESTAMP</code></td>
          </tr>
          <tr>
            <td><strong>Cộng trừ ngày tháng</strong></td>
            <td><code>DATEADD(day, 7, Ngay)</code></td>
            <td><code>date(Ngay, '+7 days')</code></td>
            <td><code>Ngay + INTERVAL '7 days'</code></td>
            <td><code>DATE_ADD(Ngay, INTERVAL 7 DAY)</code></td>
          </tr>
          <tr>
            <td><strong>Khoảng cách ngày</strong></td>
            <td><code>DATEDIFF(day, Ngay1, Ngay2)</code></td>
            <td><code>julianday(Ngay2) - julianday(Ngay1)</code></td>
            <td><code>DATE_PART('day', Ngay2 - Ngay1)</code></td>
            <td><code>DATEDIFF(Ngay2, Ngay1)</code></td>
          </tr>
          <tr>
            <td><strong>Cột khóa tự tăng</strong></td>
            <td><code>INT IDENTITY(1,1)</code></td>
            <td><code>INTEGER PRIMARY KEY AUTOINCREMENT</code></td>
            <td><code>INT GENERATED ALWAYS AS IDENTITY</code></td>
            <td><code>INT AUTO_INCREMENT</code></td>
          </tr>
          <tr>
            <td><strong>Thêm hoặc Cập nhật (Upsert)</strong></td>
            <td><code>MERGE INTO ... USING ...</code></td>
            <td><code>INSERT INTO ... ON CONFLICT DO UPDATE</code></td>
            <td><code>INSERT INTO ... ON CONFLICT DO UPDATE</code></td>
            <td><code>INSERT INTO ... ON DUPLICATE KEY UPDATE</code></td>
          </tr>
          <tr>
            <td><strong>Phép chia số nguyên</strong></td>
            <td><code>5 / 2 = 2</code> (Muốn ra 2.5 phải viết <code>5.0 / 2</code>)</td>
            <td><code>5 / 2 = 2</code> (Số nguyên chia số nguyên ra nguyên)</td>
            <td><code>5 / 2 = 2</code> (Chia nguyên)</td>
            <td><code>5 / 2 = 2.5</code> (Tự động ra số thực!)</td>
          </tr>
          <tr>
            <td><strong>Kiểu Boolean</strong></td>
            <td><code>BIT</code> (0 hoặc 1)</td>
            <td><code>INTEGER</code> (0 hoặc 1)</td>
            <td><code>BOOLEAN</code> (true / false)</td>
            <td><code>BOOLEAN</code> (Alias của TINYINT(1))</td>
          </tr>
          <tr>
            <td><strong>Mức cô lập mặc định</strong></td>
            <td><code>READ COMMITTED</code> (Locking)</td>
            <td><code>SERIALIZABLE</code> (SQLite file lock)</td>
            <td><code>READ COMMITTED</code> (MVCC Snapshot)</td>
            <td><code>REPEATABLE READ</code> (InnoDB MVCC)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- PHỤ LỤC B -->
  <section class="section-card" id="appendix-b">
    <h2>Phụ lục B: Bảng Ánh Xạ Kiểu Dữ Liệu SQL Server Sang Java (JDBC / JPA) &amp; C# (.NET / EF Core)</h2>
    <p>Bảng quy chuẩn chuyển đổi kiểu dữ liệu để sinh viên tránh lỗi tràn số, mất độ chính xác tiền tệ hoặc lỗi ánh xạ DateTime:</p>
    <div class="sunken-panel" style="overflow-x: auto;">
      <table class="interactive chm-table">
        <thead>
          <tr>
            <th>Kiểu SQL Server (T-SQL)</th>
            <th>Kích thước lưu trữ</th>
            <th>Java (Primitive / Object)</th>
            <th>Java Hibernate / JPA Type</th>
            <th>C# (.NET / CLR Type)</th>
            <th>C# Entity Framework Core</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>TINYINT</code></td>
            <td>1 Byte (0 đến 255)</td>
            <td><code>short</code> / <code>Short</code></td>
            <td><code>@Column(columnDefinition = "tinyint")</code></td>
            <td><code>byte</code></td>
            <td><code>byte</code></td>
          </tr>
          <tr>
            <td><code>SMALLINT</code></td>
            <td>2 Bytes (-32,768 đến 32,767)</td>
            <td><code>short</code> / <code>Short</code></td>
            <td><code>Short</code></td>
            <td><code>short</code> (Int16)</td>
            <td><code>short</code></td>
          </tr>
          <tr>
            <td><code>INT</code></td>
            <td>4 Bytes (-2.1 tỷ đến +2.1 tỷ)</td>
            <td><code>int</code> / <code>Integer</code></td>
            <td><code>Integer</code></td>
            <td><code>int</code> (Int32)</td>
            <td><code>int</code></td>
          </tr>
          <tr>
            <td><code>BIGINT</code></td>
            <td>8 Bytes (Số nguyên cực lớn)</td>
            <td><code>long</code> / <code>Long</code></td>
            <td><code>Long</code></td>
            <td><code>long</code> (Int64)</td>
            <td><code>long</code></td>
          </tr>
          <tr>
            <td><code>DECIMAL(p, s) / NUMERIC</code></td>
            <td>5 - 17 Bytes (Độ chính xác cao)</td>
            <td><code>BigDecimal</code></td>
            <td><code>java.math.BigDecimal</code></td>
            <td><code>decimal</code></td>
            <td><code>HasPrecision(p, s)</code></td>
          </tr>
          <tr>
            <td><code>FLOAT / REAL</code></td>
            <td>4 - 8 Bytes (Số thực dấu phẩy động)</td>
            <td><code>double</code> / <code>Double</code></td>
            <td><code>Double</code></td>
            <td><code>double</code> / <code>float</code></td>
            <td><code>double</code></td>
          </tr>
          <tr>
            <td><code>BIT</code></td>
            <td>1 Bit (0, 1 hoặc NULL)</td>
            <td><code>boolean</code> / <code>Boolean</code></td>
            <td><code>Boolean</code></td>
            <td><code>bool</code></td>
            <td><code>bool</code></td>
          </tr>
          <tr>
            <td><code>VARCHAR(n)</code></td>
            <td>n + 2 Bytes (ASCII)</td>
            <td><code>String</code></td>
            <td><code>String</code></td>
            <td><code>string</code></td>
            <td><code>string (HasMaxLength)</code></td>
          </tr>
          <tr>
            <td><code>NVARCHAR(n)</code></td>
            <td>2n + 2 Bytes (Unicode)</td>
            <td><code>String</code></td>
            <td><code>@Nationalized String</code></td>
            <td><code>string</code></td>
            <td><code>string (IsUnicode(true))</code></td>
          </tr>
          <tr>
            <td><code>DATE</code></td>
            <td>3 Bytes (YYYY-MM-DD)</td>
            <td><code>LocalDate</code></td>
            <td><code>java.time.LocalDate</code></td>
            <td><code>DateOnly</code> (C# 10+) / <code>DateTime</code></td>
            <td><code>DateOnly</code></td>
          </tr>
          <tr>
            <td><code>TIME</code></td>
            <td>3 - 5 Bytes (hh:mm:ss)</td>
            <td><code>LocalTime</code></td>
            <td><code>java.time.LocalTime</code></td>
            <td><code>TimeOnly</code> / <code>TimeSpan</code></td>
            <td><code>TimeOnly</code></td>
          </tr>
          <tr>
            <td><code>DATETIME2(7)</code></td>
            <td>6 - 8 Bytes (100ns precision)</td>
            <td><code>LocalDateTime</code></td>
            <td><code>java.time.LocalDateTime</code></td>
            <td><code>DateTime</code></td>
            <td><code>DateTime</code></td>
          </tr>
          <tr>
            <td><code>DATETIMEOFFSET(7)</code></td>
            <td>10 Bytes (Kèm múi giờ UTC)</td>
            <td><code>OffsetDateTime</code></td>
            <td><code>java.time.OffsetDateTime</code></td>
            <td><code>DateTimeOffset</code></td>
            <td><code>DateTimeOffset</code></td>
          </tr>
          <tr>
            <td><code>UNIQUEIDENTIFIER</code></td>
            <td>16 Bytes (GUID / UUID)</td>
            <td><code>UUID</code></td>
            <td><code>java.util.UUID</code></td>
            <td><code>Guid</code></td>
            <td><code>Guid</code></td>
          </tr>
          <tr>
            <td><code>VARBINARY(MAX)</code></td>
            <td>Dữ liệu nhị phân file/ảnh</td>
            <td><code>byte[]</code></td>
            <td><code>@Lob byte[]</code></td>
            <td><code>byte[]</code></td>
            <td><code>byte[]</code></td>
          </tr>
          <tr>
            <td><code>ROWVERSION / TIMESTAMP</code></td>
            <td>8 Bytes (Tự động tăng khi sửa)</td>
            <td><code>byte[]</code></td>
            <td><code>@Version byte[]</code></td>
            <td><code>byte[]</code></td>
            <td><code>IsRowVersion()</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- PHỤ LỤC C -->
  <section class="section-card" id="appendix-c">
    <h2>Phụ lục C: Bảng Tra Cứu Mã Định Dạng CONVERT(style) &amp; Hàm Ngày Giờ T-SQL</h2>
    <p>Trong T-SQL, hàm <code>CONVERT(VARCHAR(length), date_expression, style)</code> sử dụng các mã số <code>style</code> để định dạng ngày giờ ra chuỗi hiển thị:</p>
    <div class="sunken-panel" style="overflow-x: auto;">
      <table class="interactive chm-table">
        <thead>
          <tr>
            <th>Mã Style</th>
            <th>Tên chuẩn định dạng</th>
            <th>Mẫu đầu ra hiển thị</th>
            <th>Ghi chú sử dụng thực tế</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>101</code></td>
            <td>Hoa Kỳ (US Standard)</td>
            <td><code>mm/dd/yyyy</code> (VD: 03/15/2025)</td>
            <td>Rất hay dùng trong giao diện tiếng Anh Mỹ</td>
          </tr>
          <tr>
            <td><code>103</code></td>
            <td>Anh / Pháp / Việt Nam (British/VN)</td>
            <td><code>dd/mm/yyyy</code> (VD: 15/03/2025)</td>
            <td><strong>Chuẩn quốc dân cho hiển thị ngày tháng tại Việt Nam</strong></td>
          </tr>
          <tr>
            <td><code>108</code></td>
            <td>Giờ chuẩn (Time Only)</td>
            <td><code>hh:mi:ss</code> (VD: 14:30:45)</td>
            <td>Lấy riêng phần giờ phút giây</td>
          </tr>
          <tr>
            <td><code>112</code></td>
            <td>ISO Không dấu phân cách</td>
            <td><code>yyyymmdd</code> (VD: 20250315)</td>
            <td><strong>Chuẩn an toàn nhất</strong> khi truyền chuỗi ngày tháng vào SQL Server không sợ nhầm thứ tự ngày/tháng</td>
          </tr>
          <tr>
            <td><code>120</code></td>
            <td>ODBC Canonical</td>
            <td><code>yyyy-mm-dd hh:mi:ss</code> (VD: 2025-03-15 14:30:45)</td>
            <td>Chuẩn ghi log và đối soát giao dịch Backend</td>
          </tr>
          <tr>
            <td><code>126</code></td>
            <td>ISO 8601 (Chuẩn REST API &amp; JSON)</td>
            <td><code>yyyy-mm-ddThh:mi:ss.mmm</code></td>
            <td>Bắt buộc dùng khi serialize ngày giờ sang JSON trả về cho React/Vue/Angular</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- PHỤ LỤC D -->
  <section class="section-card" id="appendix-d">
    <h2>Phụ lục D: Sổ Tay Giải Mã 11 Toán Tử Execution Plan Trong SQL Server</h2>
    <p>Khi bấm <code>Ctrl + L</code> (Xem ước lượng) hoặc <code>Ctrl + M</code> (Xem thực tế) trong SSMS hoặc DBeaver, hãy tìm các toán tử sau để chẩn đoán điểm nghẽn hiệu năng:</p>
    <div class="sunken-panel" style="overflow-x: auto;">
      <table class="interactive chm-table">
        <thead>
          <tr>
            <th>Biểu tượng &amp; Tên Toán Tử</th>
            <th>Phân loại</th>
            <th>Chi phí I/O &amp; CPU</th>
            <th>Ý nghĩa kỹ thuật &amp; Hướng tối ưu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>🔍 <strong>Clustered Index Seek</strong></td>
            <td>Tốt nhất (Seek)</td>
            <td>Cực thấp (Vài trang I/O)</td>
            <td>Động cơ SQL tìm kiếm nhị phân trực tiếp trên cây B-Tree của bảng chính. Truy vấn tối ưu hoàn hảo.</td>
          </tr>
          <tr>
            <td>🔎 <strong>Index Seek (Non-Clustered)</strong></td>
            <td>Rất tốt (Seek)</td>
            <td>Thấp</td>
            <td>Tìm kiếm nhị phân trên chỉ mục phụ. Nếu đi kèm Key Lookup thì cần xem xét bổ sung INCLUDE.</td>
          </tr>
          <tr>
            <td>⚠️ <strong>Key Lookup (Clustered)</strong></td>
            <td>Cảnh báo</td>
            <td>Cao nếu số dòng lớn</td>
            <td>Index phụ không đủ cột, phải nhảy sang bảng chính lấy thêm dữ liệu. <strong>Khắc phục:</strong> Thêm cột vào <code>INCLUDE</code> của Non-Clustered Index.</td>
          </tr>
          <tr>
            <td>🚨 <strong>Clustered Index Scan / Table Scan</strong></td>
            <td>Tồi nhất (Scan)</td>
            <td>Cực cao (100% Data Pages)</td>
            <td>Quét toàn bộ bảng từ đầu đến cuối vì thiếu Index hoặc vi phạm SARGability (bọc hàm lên cột).</td>
          </tr>
          <tr>
            <td>🔄 <strong>Nested Loops Join</strong></td>
            <td>Toán tử nối</td>
            <td>Tốt cho bảng nhỏ</td>
            <td>Lấy từng dòng bảng ngoài quét bảng trong. Rất nhanh khi bảng ngoài ít dòng và bảng trong có Index Seek.</td>
          </tr>
          <tr>
            <td>🔀 <strong>Merge Join</strong></td>
            <td>Toán tử nối</td>
            <td>Rất cao hiệu quả</td>
            <td>Nối hai bảng đã được sắp xếp trước. Đọc song song 1 lượt duy nhất qua cả hai bảng.</td>
          </tr>
          <tr>
            <td>⚡ <strong>Hash Match Join</strong></td>
            <td>Toán tử nối</td>
            <td>Tốn RAM &amp; CPU</td>
            <td>Dựng bảng băm trong bộ nhớ để nối các bảng lớn chưa sắp xếp. Chú ý cảnh báo tràn bộ nhớ sang TempDB (Spill).</td>
          </tr>
          <tr>
            <td>🔃 <strong>Sort</strong></td>
            <td>Xử lý tập hợp</td>
            <td>Tốn CPU &amp; TempDB</td>
            <td>Sắp xếp dữ liệu trong bộ nhớ cho ORDER BY, DISTINCT hoặc Merge Join. Có thể loại bỏ bằng Index có thứ tự tương ứng.</td>
          </tr>
          <tr>
            <td>📊 <strong>Stream Aggregate</strong></td>
            <td>Gom nhóm</td>
            <td>Thấp</td>
            <td>Gom nhóm tính tổng (GROUP BY) trên dữ liệu đã có sẵn thứ tự sắp xếp. Chạy rất nhanh và tốn ít RAM.</td>
          </tr>
          <tr>
            <td>📈 <strong>Hash Aggregate</strong></td>
            <td>Gom nhóm</td>
            <td>Tốn RAM</td>
            <td>Dựng bảng băm trong RAM để gom nhóm các bảng chưa sắp xếp.</td>
          </tr>
          <tr>
            <td>⚠️ <strong>Compute Scalar</strong></td>
            <td>Tính toán biểu thức</td>
            <td>Thấp</td>
            <td>Tính toán các hàm số học, hàm chuỗi hoặc ép kiểu dữ liệu cho từng dòng.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- PHỤ LỤC E -->
  <section class="section-card" id="appendix-e">
    <h2>Phụ lục E: Danh Mục Toàn Bộ Phím Tắt Trình Đọc CHM &amp; Phòng Lab SQL</h2>
    <p>Sử dụng các phím tắt bàn phím sau để tăng tốc độ thao tác như một kỹ sư chuyên nghiệp:</p>
    <div class="sunken-panel">
      <table class="interactive chm-table">
        <thead>
          <tr>
            <th>Phím Tắt</th>
            <th>Chức năng trong ứng dụng</th>
            <th>Phạm vi áp dụng</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><kbd>F1</kbd></td>
            <td>Mở Hộp Thoại Bảng Phím Tắt &amp; Trợ Giúp Kỹ Thuật (Help Dialog)</td>
            <td>Toàn ứng dụng</td>
          </tr>
          <tr>
            <td><kbd>F5</kbd> hoặc <kbd>Ctrl + Enter</kbd></td>
            <td><strong>▶ Thực thi câu lệnh SQL đang gõ trong khung soạn thảo</strong></td>
            <td>Phòng Lab SQL</td>
          </tr>
          <tr>
            <td><kbd>Ctrl + S</kbd></td>
            <td><strong>✅ Nộp bài tập &amp; Kích hoạt Máy Chấm Tự Động (Auto-Grader)</strong></td>
            <td>Phòng Lab SQL</td>
          </tr>
          <tr>
            <td><kbd>F6</kbd></td>
            <td>Thu gọn / Mở rộng Cột Mục Lục Trái (Toggle Left Pane)</td>
            <td>Toàn ứng dụng</td>
          </tr>
          <tr>
            <td><kbd>Ctrl + K</kbd> hoặc <kbd>Ctrl + F</kbd></td>
            <td>Nhảy nhanh con trỏ vào Ô Tìm Kiếm Toàn Văn ở cột trái</td>
            <td>Toàn ứng dụng</td>
          </tr>
          <tr>
            <td><kbd>Alt + Left</kbd> (←)</td>
            <td>Quay lại trang bài học trước trong lịch sử duyệt (Back)</td>
            <td>Trình duyệt 2000s</td>
          </tr>
          <tr>
            <td><kbd>Alt + Right</kbd> (→)</td>
            <td>Tiến tới trang bài học tiếp theo trong lịch sử duyệt (Forward)</td>
            <td>Trình duyệt 2000s</td>
          </tr>
          <tr>
            <td><kbd>Space</kbd> (Phím cách)</td>
            <td>Nạp bước tiếp theo khi đang chạy Simulator (Exec Order, B-Tree, Isolation Timeline)</td>
            <td>6 Bộ Mô Phỏng</td>
          </tr>
          <tr>
            <td><kbd>Esc</kbd></td>
            <td>Đóng cửa sổ Modal phím tắt hoặc hộp thoại đang mở</td>
            <td>Toàn ứng dụng</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- PHỤ LỤC F -->
  <section class="section-card" id="appendix-f">
    <h2>Phụ lục F: Thông Tin Phiên Bản &amp; Giấy Phép Bản Quyền Tri Thức</h2>
    <div class="callout-info">
      <p><strong>Tên ấn bản:</strong> Bí Kíp Cơ Sở Dữ Liệu SQL Server, Java &amp; .NET Edition (Modular CHM v2005)</p>
      <p><strong>Kiến trúc kỹ thuật:</strong> Zero-Bundler Offline HTML Help (.CHM) Shell tích hợp thư viện <strong>98.css</strong> và động cơ cơ sở dữ liệu <strong>SQLite WebAssembly (sql.js)</strong>.</p>
      <p><strong>Bản quyền nội dung:</strong> Được phát hành theo giấy phép mở quốc tế <strong>Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)</strong>.</p>
      <p>Bạn được tự do:</p>
      <ul>
        <li><strong>Chia sẻ:</strong> Sao chép và phân phối lại tài liệu trên mọi phương tiện hoặc định dạng.</li>
        <li><strong>Chuyển thể:</strong> Phối lại, chuyển đổi và xây dựng dựa trên tài liệu cho bất kỳ mục đích nào, kể cả thương mại.</li>
      </ul>
      <p>Với các điều kiện bắt buộc:</p>
      <ul>
        <li><strong>Ghi nhận công trạng (Attribution):</strong> Bạn phải cung cấp thông tin ghi nhận quyền tác giả thích hợp và dẫn liên kết tới giấy phép.</li>
        <li><strong>Chia sẻ tương tự (ShareAlike):</strong> Nếu bạn phối lại hoặc chuyển đổi tài liệu, bạn phải phân phối các đóng góp của mình theo cùng giấy phép với bản gốc.</li>
      </ul>
    </div>
  </section>
</div>`;

  // Đăng ký nội dung HTML phụ lục vào Core Registry
  if (global.BiKipRegistry && typeof global.BiKipRegistry.setAppendicesHtml === "function") {
    global.BiKipRegistry.setAppendicesHtml(APPENDICES_HTML);
  } else if (global.BIKIP_REGISTRY) {
    global.BIKIP_REGISTRY.appendices_html = APPENDICES_HTML;
  }
})(typeof window !== "undefined" ? window : global);
