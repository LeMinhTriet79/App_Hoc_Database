/**
 * FILE: src/data/chapters/ch09-transactions-acid-isolation-deadlock.js
 * MÔ TẢ: Chương 9 - Transaction, ACID, Isolation Levels, Locking & Giải Quyết Deadlock
 * CÁCH CHỈNH SỬA: Bạn có thể sửa trực tiếp lý thuyết, ví dụ, bài tập của riêng chương này
 * mà không làm ảnh hưởng tới bất kỳ chương nào khác.
 */
window.BIKIP_REGISTRY.registerChapter({
  "id": "ch09",
  "code": "Chương 9",
  "title": "Transaction, ACID, Isolation Levels, Locking & Giải Quyết Deadlock",
  "sources": [
    "S ch.56",
    "M ch.63, 72, 90 (và kiến thức chuyên sâu xử lý đồng thời Backend)"
  ],
  "goals": [
    "Giải thích sâu sắc 4 tính chất ACID và cơ chế vật lý đứng sau từng chữ cái (Write-Ahead Logging, Lock/MVCC).",
    "Phân biệt 4 hiện tượng đọc đồng thời (Dirty Read, Non-Repeatable Read, Phantom Read, Lost Update) và bảng ma trận 4 mức cô lập chuẩn ANSI cộng thêm SNAPSHOT.",
    "Hiểu rõ cơ chế Khóa (Shared, Exclusive, Update, Intent Locks), hiện tượng Leo thang khóa (Lock Escalation) và cách phòng chống Deadlock.",
    "Lựa chọn chính xác giữa Optimistic Locking (Khóa lạc quan) và Pessimistic Locking (Khóa bi quan) cho các bài toán thực tế như Flash Sale, đặt vé, ví điện tử."
  ],
  "signals": [
    "Hai người dùng cùng bấm thanh toán 1 sản phẩm chỉ còn 1 chiếc tồn kho vào cùng một mili-giây, làm tồn kho âm -1 (Race Condition / Overselling).",
    "Ứng dụng thỉnh thoảng văng lỗi 'Transaction (Process ID xx) was deadlocked on lock resources with another process and has been chosen as the deadlock victim'.",
    "Câu hỏi phỏng vấn bắt buộc cho vị trí Junior/Mid: 'Hãy kể tên các Isolation Level và giải thích mức nào chặn được lỗi đọc nào?'."
  ],
  "theory": "<h3>9.1. Bốn tính chất ACID và cơ chế kỹ thuật đứng phía sau</h3>\n<p><strong>Transaction (Giao dịch)</strong> là một đơn vị công việc gồm một hoặc nhiều câu lệnh SQL phải tuân thủ 4 tính chất <strong>ACID</strong>. Khi đi phỏng vấn, đừng chỉ dịch nghĩa tiếng Việt, hãy nêu luôn cơ chế mà Database Engine dùng để đảm bảo từng tính chất:</p>\n<ul>\n  <li><strong>A - Atomicity (Tính nguyên tử - Tất cả hoặc Không gì cả):</strong> Mọi câu lệnh trong giao dịch hoặc thành công trọn vẹn (<code>COMMIT</code>), hoặc nếu có bất kỳ bước nào lỗi thì toàn bộ phải quay về trạng thái ban đầu (<code>ROLLBACK</code>). <em>Cơ chế vật lý:</em> Dựa vào <strong>Undo Log / Rollback Segment</strong> trong Transaction Log lưu giá trị cũ trước khi sửa.</li>\n  <li><strong>C - Consistency (Tính nhất quán):</strong> Dữ liệu trước và sau giao dịch luôn thỏa mãn mọi ràng buộc toàn vẹn (PK, FK, UNIQUE, CHECK, Trigger) và quy tắc nghiệp vụ (tổng tiền không tự dưng sinh ra hay mất đi).</li>\n  <li><strong>I - Isolation (Tính cô lập):</strong> Các giao dịch chạy song song không được làm nhiễu loạn kết quả trung gian của nhau. <em>Cơ chế vật lý:</em> Dựa vào <strong>Locking (Cơ chế khóa)</strong> và <strong>MVCC / Row Versioning (Kiểm soát đồng thời đa phiên bản)</strong>.</li>\n  <li><strong>D - Durability (Tính bền vững):</strong> Một khi hệ thống đã báo <code>COMMIT</code> thành công cho người dùng, dù 1 mili-giây sau máy chủ bị rút phích cắm điện, dữ liệu đó vẫn không bao giờ mất! <em>Cơ chế vật lý:</em> Nhờ kỹ thuật <strong>WAL (Write-Ahead Logging)</strong>: mọi thay đổi bắt buộc phải được ghi nối đuôi và ép xuống ổ đĩa của file <em>Transaction Log (.ldf)</em> trước khi báo Commit thành công (việc ghi cập nhật vào file dữ liệu chính <em>.mdf</em> có thể diễn ra chậm hơn ở dưới nền qua tiến trình <em>Checkpoint</em>).</li>\n</ul>\n\n<h3>9.2. Bốn hiện tượng bất thường và Ma trận Isolation Levels (Cực kỳ quan trọng!)</h3>\n<p>Khi nhiều giao dịch chạy đồng thời (bạn có thể thực hành trực tiếp trên <strong>Bộ Mô Phỏng Trực Quan &rarr; Transaction &amp; Isolation Level</strong>), nếu không cô lập chặt sẽ xảy ra các hiện tượng sau:</p>\n<ol>\n  <li><strong>Dirty Read (Đọc bẩn):</strong> Giao dịch A đọc phải dữ liệu mà Giao dịch B vừa <code>UPDATE</code> nhưng <strong>chưa COMMIT</strong>. Ngay sau đó B gặp lỗi và <code>ROLLBACK</code>, thế là A đã cầm một con số \"ma\" không hề tồn tại!</li>\n  <li><strong>Non-Repeatable Read (Đọc lại không giống cũ trên cùng 1 dòng):</strong> Trong cùng một Giao dịch A, lần đầu đọc dòng <code>MaSP = 101</code> thấy giá là <code>1800</code>. Giữa chừng Giao dịch B nhảy vào <code>UPDATE</code> giá dòng <code>101</code> thành <code>2000</code> rồi <code>COMMIT</code>. A đọc lại dòng <code>101</code> lần thứ hai trong cùng giao dịch của mình thì thấy giá đã biến thành <code>2000</code>!</li>\n  <li><strong>Phantom Read (Đọc bóng ma - xuất hiện thêm hoặc biến mất dòng trong khoảng):</strong> Giao dịch A đếm số đơn hàng của khách X thấy có <code>3 đơn</code>. Giao dịch B nhảy vào <code>INSERT</code> thêm 1 đơn mới cho khách X rồi <code>COMMIT</code>. A chạy lại câu đếm y hệt ban đầu thì giật mình thấy lòi ra <code>4 đơn</code> (dòng mới xuất hiện như bóng ma)!</li>\n  <li><strong>Lost Update (Mất cập nhật):</strong> Cả A và B cùng đọc thấy <code>TonKho = 5</code>. A tính <code>5 - 1 = 4</code> rồi lưu 4; B tính <code>5 - 2 = 3</code> rồi lưu đè 3 lên kết quả của A (thực tế bán 3 chiếc nhưng kho chỉ giảm 2!).</li>\n</ol>\n<table class=\"chm-table\">\n  <thead>\n    <tr>\n      <th>Mức cô lập (Isolation Level)</th>\n      <th>Dirty Read</th>\n      <th>Non-Repeatable Read</th>\n      <th>Phantom Read</th>\n      <th>Cơ chế khóa trong SQL Server (Lock-based)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>1. READ UNCOMMITTED</strong> (Tương đương <code>WITH (NOLOCK)</code>)</td>\n      <td>Bị dính!</td>\n      <td>Bị dính!</td>\n      <td>Bị dính!</td>\n      <td>Không xin Shared Lock khi đọc (nhanh nhưng đọc phải rác chưa commit).</td>\n    </tr>\n    <tr>\n      <td><strong>2. READ COMMITTED</strong> (Mặc định của SQL Server, Postgres, Oracle)</td>\n      <td><strong>Chặn được</strong></td>\n      <td>Bị dính!</td>\n      <td>Bị dính!</td>\n      <td>Xin Shared Lock (S) lúc đọc dòng và <strong>nhả ra ngay</strong> khi đọc xong câu SELECT (hoặc đọc bản chụp câu lệnh nếu bật RCSI).</td>\n    </tr>\n    <tr>\n      <td><strong>3. REPEATABLE READ</strong> (Mặc định của MySQL InnoDB)</td>\n      <td><strong>Chặn được</strong></td>\n      <td><strong>Chặn được</strong></td>\n      <td>Bị dính! (Riêng Postgres &amp; InnoDB chặn được bằng Snapshot/Gap Lock)</td>\n      <td>Giữ chặt Shared Lock (S) trên các dòng đã đọc cho <strong>tới tận khi kết thúc Transaction</strong> (chặn không cho ai UPDATE/DELETE các dòng đó, nhưng vẫn cho INSERT dòng mới vào khoảng).</td>\n    </tr>\n    <tr>\n      <td><strong>4. SERIALIZABLE</strong> (Cô lập cao nhất chuẩn ANSI)</td>\n      <td><strong>Chặn được</strong></td>\n      <td><strong>Chặn được</strong></td>\n      <td><strong>Chặn được</strong></td>\n      <td>Dùng <strong>Key-Range Lock (Khóa cả khoảng trên Index)</strong> để chặn luôn việc INSERT dòng mới rơi vào điều kiện WHERE. Rất dễ gây nghẽn và Deadlock!</td>\n    </tr>\n    <tr>\n      <td><strong>5. SNAPSHOT</strong> (Đặc biệt trong SQL Server)</td>\n      <td><strong>Chặn được</strong></td>\n      <td><strong>Chặn được</strong></td>\n      <td><strong>Chặn được</strong></td>\n      <td>Không giữ khóa khi đọc! Nhìn toàn bộ CSDL theo đúng bản chụp (Row Version trong <code>tempdb</code>) tại thời điểm <code>BEGIN TRAN</code>; nếu đụng độ khi cùng sửa 1 dòng sẽ báo lỗi <em>Update Conflict 3960</em>.</td>\n    </tr>\n  </tbody>\n</table>\n\n<h3>9.3. Deadlock (Khóa chết) là gì và khác gì với Blocking (Chặn chờ)?</h3>\n<ul>\n  <li><strong>Blocking (Chặn chờ thông thường):</strong> Phiên A đang giữ khóa <code>X</code> trên dòng 1, Phiên B cần đọc/sửa dòng 1 nên phải xếp hàng đứng chờ. Ngay khi A bấm <code>COMMIT</code>, B được chạy tiếp bình thường.</li>\n  <li><strong>Deadlock (Khóa chết vòng tròn):</strong> <strong>Phiên A</strong> đang giữ khóa trên <code>Bảng 1</code> và xin khóa trên <code>Bảng 2</code>; đúng lúc đó <strong>Phiên B</strong> đang giữ khóa trên <code>Bảng 2</code> và lại xin khóa trên <code>Bảng 1</code>! Hai bên ôm chặt tài nguyên của nhau tạo thành vòng tròn chờ đợi vô tận. Luồng <em>Lock Monitor</em> của SQL Server quét định kỳ (mặc định mỗi 5 giây hoặc nhanh hơn), phát hiện vòng lặp và chọn giao dịch tốn ít chi phí Rollback hơn làm <strong>\"Nạn nhân Deadlock\" (Deadlock Victim - Mã lỗi 1205)</strong>, giết giao dịch đó và Rollback để giải cứu giao dịch còn lại!</li>\n  <li><strong>4 nguyên tắc vàng phòng chống Deadlock:</strong> (1) Mọi giao dịch trong ứng dụng phải truy cập các bảng và các dòng <strong>theo cùng một thứ tự nhất quán</strong> (ví dụ luôn khóa tài khoản có <code>Id nhỏ hơn</code> trước, <code>Id lớn hơn</code> sau). (2) Giữ Transaction ngắn gọn hết mức có thể (không bao giờ gọi HTTP API bên thứ 3 hay gửi Email bên trong <code>BEGIN TRAN ... COMMIT</code>!). (3) Dùng hint <code>WITH (UPDLOCK)</code> khi đọc dữ liệu với ý định cập nhật ngay sau đó. (4) Đánh Index đầy đủ để câu UPDATE chỉ khóa đúng 1 dòng (Row Lock) thay vì phải quét và khóa cả bảng (Table Lock).</li>\n</ul>",
  "mechanism": "<h3>Chạy tay từng bước: Kịch bản Deadlock kinh điển và cách giải cứu bằng UPDLOCK</h3>\n<p>Hãy xem hai kịch bản chạy song song theo trục thời gian giữa <strong>Phiên 1 (T1)</strong> và <strong>Phiên 2 (T2)</strong>:</p>\n<div class=\"trace-steps\">\n  <div class=\"trace-step\"><strong>Kịch bản 1 - Deadlock do truy cập ngược thứ tự (Cross-Table Deadlock):</strong>\n    <ul>\n      <li><code>t = 1s</code>: T1 chạy <code>UPDATE DonHang WHERE MaDH = 1001</code> &rarr; T1 giữ <strong>Exclusive Lock (X)</strong> trên đơn 1001.</li>\n      <li><code>t = 2s</code>: T2 chạy <code>UPDATE SanPham WHERE MaSP = 101</code> &rarr; T2 giữ <strong>Exclusive Lock (X)</strong> trên sản phẩm 101.</li>\n      <li><code>t = 3s</code>: T1 chạy tiếp <code>UPDATE SanPham WHERE MaSP = 101</code> &rarr; Bị chặn (Waiting) vì T2 đang giữ khóa SP 101!</li>\n      <li><code>t = 4s</code>: T2 chạy tiếp <code>UPDATE DonHang WHERE MaDH = 1001</code> &rarr; Bị chặn (Waiting) vì T1 đang giữ khóa đơn 1001! &rarr; <strong>DEADLOCK (T1 &harr; T2)!</strong></li>\n    </ul>\n  </div>\n  <div class=\"trace-step\"><strong>Kịch bản 2 - Conversion Deadlock trên CÙNG MỘT DÒNG (Rất hay gặp ở mức REPEATABLE READ / SERIALIZABLE):</strong>\n    <ul>\n      <li><code>t = 1s</code>: T1 và T2 cùng chạy <code>SELECT TonKho FROM SanPham WHERE MaSP = 105</code>. Vì khóa đọc <strong>Shared Lock (S)</strong> tương thích với nhau, cả T1 và T2 đều cùng ôm khóa <code>S</code> trên dòng 105!</li>\n      <li><code>t = 2s</code>: T1 chạy <code>UPDATE SanPham SET TonKho = 3 WHERE MaSP = 105</code>. T1 muốn nâng khóa từ <code>S</code> lên <code>X (Exclusive)</code> nhưng phải chờ T2 nhả khóa <code>S</code>.</li>\n      <li><code>t = 3s</code>: T2 cũng chạy <code>UPDATE SanPham ... WHERE MaSP = 105</code> và cũng chờ T1 nhả khóa <code>S</code> &rarr; <strong>DEADLOCK ngay trên 1 dòng!</strong></li>\n      <li><strong>Cách hóa giải:</strong> Thêm <code>WITH (UPDLOCK)</code> vào câu <code>SELECT</code> (hoặc <code>FOR UPDATE</code> trong Postgres/MySQL). Vì <strong>Update Lock (U)</strong> không tương thích với một khóa <code>U</code> khác, chỉ có T1 lấy được khóa <code>U</code> lúc đọc, còn T2 phải xếp hàng chờ ngay từ câu <code>SELECT</code>, không bao giờ xảy ra Deadlock!</li>\n    </ul>\n  </div>\n</div>",
  "examples": [
    {
      "title": "Ví dụ 9.1: Giao dịch chuyển tiền nguyên tử (Atomic Transaction) giữa hai tài khoản/học bổng",
      "label": "CHUAN",
      "db": "truonghoc",
      "sql": "BEGIN TRANSACTION;\n-- Chuyển 2000 học bổng từ SV 202 (Doan Thu Ha) sang SV 203 (Ngo Quang Khai):\nUPDATE SinhVien SET HocBong = HocBong - 2000 WHERE MaSV = 202 AND HocBong >= 2000;\nUPDATE SinhVien SET HocBong = COALESCE(HocBong, 0) + 2000 WHERE MaSV = 203;\nCOMMIT;\nSELECT MaSV, HoTen, HocBong FROM SinhVien WHERE MaSV IN (202, 203) ORDER BY MaSV;",
      "result": {
        "cols": [
          "MaSV",
          "HoTen",
          "HocBong"
        ],
        "rows": [
          [
            202,
            "Doan Thu Ha",
            6000
          ],
          [
            203,
            "Ngo Quang Khai",
            2000
          ]
        ]
      },
      "note": "Nhờ bọc trong BEGIN TRANSACTION ... COMMIT, cả hai lệnh trừ và cộng đều thành công cùng nhau. Nếu lệnh thứ 2 gặp lỗi hoặc mất điện giữa chừng, CSDL sẽ tự động ROLLBACK hoàn trả lại 2000 cho SV 202."
    },
    {
      "title": "Ví dụ 9.2: Sử dụng SAVEPOINT để hoàn tác một phần (Partial Rollback) trong giao dịch lớn",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "BEGIN TRANSACTION;\n-- Bước 1: Cập nhật phí ship đơn 1001 thành 0 (thành công và muốn giữ lại)\nUPDATE DonHang SET PhiShip = 0 WHERE MaDH = 1001;\nSAVEPOINT DiemLuu_SauKhiSuaShip;\n\n-- Bước 2: Thử giảm giá sản phẩm 101 nhưng phát hiện nhầm nên hoàn tác riêng bước 2:\nUPDATE SanPham SET DonGia = 999 WHERE MaSP = 101;\nROLLBACK TO SAVEPOINT DiemLuu_SauKhiSuaShip;\nCOMMIT;\n\nSELECT (SELECT PhiShip FROM DonHang WHERE MaDH = 1001) AS ShipDon1001,\n       (SELECT DonGia FROM SanPham WHERE MaSP = 101) AS GiaSP101;",
      "result": {
        "cols": [
          "ShipDon1001",
          "GiaSP101"
        ],
        "rows": [
          [
            0,
            1800
          ]
        ]
      },
      "note": "ROLLBACK TO SAVEPOINT chỉ hủy bỏ các thay đổi sau điểm đánh dấu (GiaSP101 vẫn giữ nguyên 1800), trong khi thay đổi trước đó (ShipDon1001 = 0) vẫn được COMMIT thành công!"
    },
    {
      "title": "Ví dụ 9.3: Optimistic Locking (Khóa lạc quan) bằng cột Version/RowVersion ngay trong câu UPDATE",
      "label": "CHUAN",
      "db": "shoponline",
      "sql": "ALTER TABLE SanPham ADD COLUMN Version INT NOT NULL DEFAULT 1;\n-- Phiên A đọc SP 105 thấy TonKho = 4, Version = 1. Khi bấm thanh toán, kèm điều kiện WHERE Version = 1:\nUPDATE SanPham\nSET TonKho = TonKho - 1,\n    Version = Version + 1\nWHERE MaSP = 105 AND TonKho >= 1 AND Version = 1;\nSELECT MaSP, TenSP, TonKho, Version FROM SanPham WHERE MaSP = 105;",
      "result": {
        "cols": [
          "MaSP",
          "TenSP",
          "TonKho",
          "Version"
        ],
        "rows": [
          [
            105,
            "Laptop ThinkPad X1 Carbon",
            3,
            2
          ]
        ]
      },
      "note": "Nếu ngay trước đó Phiên B đã nhanh tay mua mất 1 chiếc và tăng Version lên 2, câu UPDATE của Phiên A sẽ có số dòng ảnh hưởng (Affected Rows) = 0. Ứng dụng kiểm tra nếu Affected Rows == 0 thì báo người dùng thử lại!"
    },
    {
      "title": "Ví dụ 9.4: Pessimistic Locking (Khóa bi quan) với UPDLOCK, ROWLOCK và XACT_ABORT trong T-SQL",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "SET XACT_ABORT ON; -- Tự động Rollback toàn bộ Transaction ngay khi có bất kỳ lỗi Run-time nào\nBEGIN TRANSACTION;\n\n-- Khóa dòng sản phẩm 105 bằng Update Lock (UPDLOCK) để chặn các phiên khác cùng nhảy vào trừ kho:\nDECLARE @TonHienTai INT;\nSELECT @TonHienTai = TonKho\nFROM SanPham WITH (UPDLOCK, ROWLOCK)\nWHERE MaSP = 105;\n\nIF @TonHienTai >= 1\nBEGIN\n    UPDATE SanPham SET TonKho = TonKho - 1 WHERE MaSP = 105;\n    COMMIT TRANSACTION;\nEND\nELSE\n    ROLLBACK TRANSACTION;",
      "result": {
        "cols": [
          "MaSP",
          "TonKhoTruoc",
          "TonKhoSau",
          "LockHeld"
        ],
        "rows": [
          [
            105,
            4,
            3,
            "U-Lock (UPDLOCK) lúc SELECT -> nâng lên X-Lock lúc UPDATE"
          ]
        ]
      },
      "note": "Trong SQL Server, nếu chỉ dùng SELECT thường rồi mới UPDATE, hai giao dịch có thể cùng đọc thấy TonKho = 4 rồi cùng trừ đi 1 (lỗi Lost Update) hoặc cùng giữ Shared Lock chờ nâng lên Exclusive Lock gây Deadlock! Gắn WITH (UPDLOCK, ROWLOCK) vào câu SELECT giải quyết triệt để cả hai lỗi này. (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    },
    {
      "title": "Ví dụ 9.5: Bật Read Committed Snapshot Isolation (RCSI) để Đọc không bị chặn bởi Ghi trong SQL Server",
      "label": "TSQL",
      "db": "shoponline",
      "sql": "-- Chạy 1 lần ở mức Database để bật cơ chế đọc phiên bản dòng (Row Versioning trong tempdb):\nALTER DATABASE ShopOnlineDB SET READ_COMMITTED_SNAPSHOT ON;\n\n-- Hoặc chọn mức cô lập trong phiên làm việc:\nSET TRANSACTION ISOLATION LEVEL REPEATABLE READ;",
      "result": {
        "cols": [
          "CheDo",
          "NguoiDocGapNguoiGhi",
          "DirtyRead",
          "CoCheBenDuoi"
        ],
        "rows": [
          [
            "READ COMMITTED mặc định (Lock-based)",
            "Người Đọc bị TREO (Blocked) chờ người Ghi Commit",
            "Không",
            "Xin Shared Lock (S) đụng Exclusive Lock (X)"
          ],
          [
            "READ COMMITTED SNAPSHOT (RCSI)",
            "Người Đọc KHÔNG BỊ CHẶN, đọc bản chụp cũ trước khi sửa",
            "Không",
            "Đọc bản ghi Version trong tempdb (giống PostgreSQL MVCC)"
          ]
        ]
      },
      "note": "Mặc định SQL Server dùng cơ chế khóa cho READ COMMITTED nên giao dịch Ghi sẽ chặn giao dịch Đọc. Khi bật RCSI (mặc định trên Azure SQL), SQL Server chuyển sang dùng Row Versioning giống MVCC của PostgreSQL và Oracle! (Kết quả minh họa T-SQL, không chạy trực tiếp trong trình duyệt)."
    }
  ],
  "dialects": [
    [
      "Khóa dòng lúc đọc để chuẩn bị sửa",
      "SELECT ... FROM T WITH (UPDLOCK, ROWLOCK) WHERE ...",
      "SELECT ... FROM T WHERE ... FOR UPDATE",
      "SELECT ... FROM T WHERE ... FOR UPDATE"
    ],
    [
      "Bỏ qua các dòng đang bị khóa (Hàng đợi)",
      "WITH (UPDLOCK, READPAST)",
      "FOR UPDATE SKIP LOCKED (MySQL 8+)",
      "FOR UPDATE SKIP LOCKED"
    ],
    [
      "Cột phiên bản tự động cho Optimistic Lock",
      "ROWVERSION (hoặc TIMESTAMP cũ - 8 bytes nhị phân)",
      "Cột INT Version tự tăng",
      "Cột hệ thống xmin hoặc cột INT Version"
    ]
  ],
  "bridge_java": "// [Java - Spring Boot] Sử dụng @Transactional, Isolation Level và Optimistic Locking (@Version)\n// 1. Mặc định @Transactional của Spring chỉ tự động Rollback đối với RuntimeException (Unchecked Exception)!\n//    Nếu hàm ném Checked Exception (như IOException), bạn BẮT BUỘC phải ghi rõ rollbackFor = Exception.class!\n// 2. Để bật Optimistic Locking trong JPA, chỉ cần thêm @Version vào một trường Integer hoặc Long:\n\n@Entity\npublic class SanPham {\n    @Id\n    private Integer maSp;\n    private Integer tonKho;\n\n    @Version // Hibernate tự động thêm \"AND version = ?\" và \"SET version = version + 1\" vào câu UPDATE!\n    private Integer version;\n}\n\n@Service\npublic class DatHangService {\n    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)\n    public void datMua(int maSp, int soLuong) {\n        // Nếu 2 người cùng sửa, người đến sau sẽ nhận ObjectOptimisticLockingFailureException\n    }\n}",
  "bridge_csharp": "// [C# - EF Core] Cấu hình Optimistic Concurrency với [Timestamp] (RowVersion) hoặc ConcurrencyCheck\n// Trong SQL Server, kiểu dữ liệu ROWVERSION (byte[8]) tự động thay đổi mỗi khi dòng được UPDATE.\n// Khi có xung đột, SaveChangesAsync() sẽ ném ra DbUpdateConcurrencyException để bạn bắt và xử lý:\n\npublic class SanPham\n{\n    public int MaSP { get; set; }\n    public int TonKho { get; set; }\n\n    [Timestamp] // Ánh xạ thành cột ROWVERSION trong SQL Server\n    public byte[] RowVersion { get; set; } = null!;\n}\n\ntry\n{\n    await dbContext.SaveChangesAsync();\n}\ncatch (DbUpdateConcurrencyException ex)\n{\n    // Xử lý khi dữ liệu đã bị người khác sửa trước đó (ví dụ tải lại giá trị mới nhất hoặc báo khách thử lại)\n    Console.WriteLine(\"Sản phẩm vừa được cập nhật bởi giao dịch khác, vui lòng thử lại!\");\n}",
  "performance": "<ul>\n  <li><strong>Hiện tượng Leo thang khóa (Lock Escalation) trong SQL Server:</strong> Mỗi khóa dòng (Row Lock) tốn khoảng 96 bytes trong bộ nhớ RAM của SQL Server. Nếu một câu lệnh <code>UPDATE</code> hoặc <code>DELETE</code> đơn lẻ chạm tới hơn <strong>5.000 dòng</strong> trong cùng một bảng, để tiết kiệm RAM, SQL Server sẽ tự động <strong>Leo thang khóa (Lock Escalation)</strong>: đổi 5.000 cái khóa dòng (Row Locks) thành <strong>1 cái khóa toàn bộ bảng (Table Exclusive Lock)</strong>! Ngay lập tức, toàn bộ người dùng khác đang truy cập các dòng không liên quan trong bảng đó đều bị treo cứng! <em>Cách khắc phục:</em> Khi cần xóa/sửa hàng trăm nghìn dòng trên Production, hãy chia nhỏ thành từng lô (Batch) <strong>2.000 - 4.000 dòng/lần</strong> trong vòng lặp!</li>\n  <li><strong>Khi nào chọn Optimistic, khi nào chọn Pessimistic?</strong>\n    <ul>\n      <li><strong>Optimistic Locking (Khóa lạc quan):</strong> Phù hợp khi tỷ lệ đụng độ trên cùng 1 dòng thấp (như sửa thông tin hồ sơ, giỏ hàng cá nhân, quản trị CMS). Hiệu năng rất cao vì không giữ khóa DB.</li>\n      <li><strong>Pessimistic Locking (Khóa bi quan) hoặc Atomic Update:</strong> Phù hợp khi tỷ lệ tranh chấp cực cao trên cùng 1 bản ghi (như trừ số dư ví tổng, trừ kho Flash Sale 1000 người cùng搶 1 mặt hàng). Nếu dùng Optimistic cho Flash Sale, 999 người sẽ bị văng lỗi phải retry liên tục làm sập hệ thống.</li>\n    </ul>\n  </li>\n</ul>",
  "common_errors": [
    "Gọi API bên ngoài (thanh toán cổng ngân hàng, gửi email SMTP, đọc file mạng) ở bên trong khối BEGIN TRANSACTION ... COMMIT: Làm giao dịch giữ khóa dòng trong nhiều giây, gây nghẽn dây chuyền toàn bộ Connection Pool!",
    "Lạm dụng hint WITH (NOLOCK) (tương đương READ UNCOMMITTED) trên mọi câu SELECT trong SQL Server vì tưởng nó là 'bùa tăng tốc miễn phí': NOLOCK không chỉ đọc phải dữ liệu chưa commit (Dirty Read) mà còn có thể đọc trùng 1 dòng 2 lần hoặc bỏ sót dòng đã commit do trang dữ liệu đang bị tách (Page Split - Allocation Order Scan)!",
    "Trong SQL Server, tưởng rằng khi 1 câu lệnh bên trong BEGIN TRAN gặp lỗi (như lỗi chia cho 0 hoặc lỗi ràng buộc khóa ngoại) thì toàn bộ Transaction sẽ tự động Rollback: Mặc định (khi XACT_ABORT đang OFF), chỉ câu lệnh bị lỗi đó dừng lại, còn các câu lệnh tiếp theo vẫn chạy và COMMIT bình thường! Phải bật SET XACT_ABORT ON hoặc bọc trong TRY...CATCH có ROLLBACK.",
    "Trong Java Spring, đặt @Transactional trên một hàm private hoặc tự gọi hàm có @Transactional từ một hàm khác trong cùng một class (Self-invocation): Vì Spring AOP hoạt động qua Proxy bọc bên ngoài đối tượng, việc gọi nội bộ this.hamGiaoDich() sẽ đi vòng qua Proxy và không hề mở Transaction nào cả!",
    "Đọc số dư/tồn kho bằng câu SELECT thường rồi kiểm tra if (tonKho >= soLuong) trong code Java/C# trước khi chạy UPDATE: Giữa câu SELECT và câu UPDATE có một khoảng hở thời gian đủ để 10 luồng khác cùng vượt qua lệnh if!"
  ],
  "interview": [
    {
      "level": "Fresher",
      "q": "ACID là viết tắt của 4 từ nào? Hãy lấy ví dụ giao dịch chuyển khoản ngân hàng để giải thích từng tính chất.",
      "a_short": "Atomicity (Nguyên tử), Consistency (Nhất quán), Isolation (Cô lập), Durability (Bền vững).",
      "a_long": "Giả sử A chuyển 500k cho B: (1) Atomicity: Giao dịch gồm 2 bước (Trừ A 500k và Cộng B 500k); nếu trừ A xong mà bước cộng B bị lỗi thì phải hoàn lại 500k cho A, không có chuyện mất tiền lơ lửng. (2) Consistency: Tổng tiền của A + B trước và sau giao dịch không đổi, và số dư của A không được vi phạm ràng buộc CHECK (SoDu >= 0). (3) Isolation: Trong lúc giao dịch đang chạy dở, một giao dịch thứ ba vào xem báo cáo không được nhìn thấy trạng thái lệch tạm thời. (4) Durability: Khi ứng dụng đã hiện thông báo 'Chuyển tiền thành công', dù máy chủ mất điện ngay sau đó thì lịch sử và số dư mới vẫn được bảo toàn nhờ đã ghi vào Transaction Log (WAL)."
    },
    {
      "level": "Junior",
      "q": "Sự khác biệt giữa Non-Repeatable Read và Phantom Read là gì? Mức cô lập REPEATABLE READ theo chuẩn ANSI chặn được cái nào?",
      "a_short": "Non-Repeatable Read xảy ra khi một dòng đã đọc bị giao dịch khác UPDATE hoặc DELETE làm đổi giá trị khi đọc lại; Phantom Read xảy ra khi giao dịch khác INSERT thêm dòng mới thỏa mãn điều kiện WHERE làm thay đổi số lượng dòng khi đọc lại. Chuẩn ANSI REPEATABLE READ chặn được Non-Repeatable Read nhưng vẫn có thể bị Phantom Read.",
      "a_long": "Điểm mấu chốt để phân biệt là: Non-Repeatable Read tác động lên CÁC DÒNG ĐÃ TỒN TẠI mà giao dịch của bạn đã đọc ở lần thứ nhất (do đó chỉ cần giữ Shared Lock trên đúng các dòng đó tới cuối giao dịch là chặn được hoàn toàn). Nhưng với Phantom Read, dòng dữ liệu mới do người khác vừa INSERT chưa hề tồn tại lúc bạn đọc lần đầu nên chưa bị gắn khóa dòng! Để chặn cả Phantom Read trên cơ chế khóa, bạn phải nâng lên mức SERIALIZABLE để CSDL khóa cả khoảng giá trị trên Index (Key-Range Lock), hoặc sử dụng mức SNAPSHOT."
    },
    {
      "level": "Mid",
      "q": "Trong hệ thống thương mại điện tử có chương trình Flash Sale (1.000 người cùng bấm mua 1 mặt hàng chỉ còn 5 chiếc tồn kho vào cùng 1 giây), bạn sẽ thiết kế câu truy vấn và cơ chế khóa như thế nào để vừa không bao giờ bán âm kho (Overselling) vừa chịu tải cao?",
      "a_short": "Cách hiệu quả nhất ở tầng CSDL quan hệ là gộp việc kiểm tra và trừ kho vào một câu lệnh UPDATE nguyên tử duy nhất: UPDATE SanPham SET TonKho = TonKho - @SL OUTPUT inserted.TonKho WHERE MaSP = @Id AND TonKho >= @SL (hoặc dùng Pessimistic Lock với UPDLOCK nếu cần xử lý logic phức tạp).",
      "a_long": "Có 3 phương án và sự đánh đổi: (1) Nếu dùng Optimistic Locking (cột Version), khi 1.000 request cùng đọc Version = 1 rồi cùng UPDATE, chỉ 1 người thành công còn 999 người bị lỗi Concurrency Exception dù kho vẫn còn 4 chiếc (trải nghiệm rất tệ!). (2) Nếu dùng Pessimistic Locking: SELECT ... WITH (UPDLOCK, ROWLOCK) rồi mới UPDATE, 1.000 request sẽ xếp hàng tuần tự an toàn nhưng giữ kết nối lâu hơn. (3) Tối ưu nhất: Thực thi trực tiếp câu lệnh nguyên tử UPDATE SanPham SET TonKho = TonKho - @SoLuong WHERE MaSP = @MaSP AND TonKho >= @SoLuong. Bản thân câu UPDATE tự xin khóa độc quyền trên dòng đó trong vài phần nghìn giây, kiểm tra ngay tại chỗ TonKho >= @SoLuong và trả về số dòng cập nhật (1 là mua thành công, 0 là hết hàng)."
    }
  ],
  "basics": [
    {
      "num": 1,
      "title": "Bài 9.1: Trừ tồn kho an toàn bằng điều kiện nguyên tử trong 1 câu UPDATE",
      "problem": "Trên CSDL ShopOnline, khách hàng đặt mua 3 chiếc của sản phẩm MaSP = 105 (hiện có TonKho = 4). Thay vì đọc TonKho lên code rồi mới trừ, hãy viết một câu lệnh UPDATE trừ trực tiếp 3 chiếc vào cột TonKho của MaSP = 105 với điều kiện đảm bảo trong WHERE là TonKho >= 3 (không bao giờ để tồn kho bị âm). Sau đó SELECT MaSP, TenSP, TonKho FROM SanPham WHERE MaSP = 105.",
      "intuition": "Viết UPDATE SanPham SET TonKho = TonKho - 3 WHERE MaSP = 105 AND TonKho >= 3; rồi chạy câu SELECT.",
      "trace": "Vì một câu lệnh UPDATE đơn lẻ luôn có tính Nguyên tử (Atomic) và tự giữ Exclusive Lock trên dòng đang sửa, việc kiểm tra AND TonKho >= 3 ngay trong WHERE của UPDATE chống hoàn toàn lỗi bán lố (Overselling) mà không cần mở Transaction dài!",
      "sql": "UPDATE SanPham\nSET TonKho = TonKho - 3\nWHERE MaSP = 105 AND TonKho >= 3;\nSELECT MaSP, TenSP, TonKho FROM SanPham WHERE MaSP = 105;",
      "db": "shoponline",
      "expected": {
        "cols": [
          "MaSP",
          "TenSP",
          "TonKho"
        ],
        "rows": [
          [
            105,
            "Laptop ThinkPad X1 Carbon",
            1
          ]
        ]
      },
      "order_matters": false,
      "hints": [
        "Kết hợp cả phép trừ TonKho = TonKho - 3 và điều kiện bảo vệ AND TonKho >= 3 trong cùng một câu UPDATE.",
        "UPDATE SanPham SET TonKho = TonKho - 3 WHERE MaSP = 105 AND TonKho >= 3; SELECT ...;",
        "UPDATE SanPham SET TonKho = TonKho - 3 WHERE MaSP = 105 AND TonKho >= 3; SELECT MaSP, TenSP, TonKho FROM SanPham WHERE MaSP = 105;"
      ]
    },
    {
      "num": 2,
      "title": "Bài 9.2: Kiểm tra tính nhất quán tổng quỹ lương sau giao dịch điều chuyển",
      "problem": "Trên CSDL Auto Shop, hãy thực hiện giao dịch điều chuyển 150 đơn vị lương từ nhân viên Id = 1 (James Smith) sang nhân viên Id = 2 (John Johnson), sau đó viết câu truy vấn lấy Id, FName, Salary của hai nhân viên này sắp xếp theo Id tăng dần.",
      "intuition": "Cập nhật giảm 150 cho Id = 1, tăng 150 cho Id = 2, rồi SELECT kiểm tra.",
      "trace": "James giảm từ 1000 xuống 850; John tăng từ 400 lên 550. Tổng lương của hai người trước và sau giao dịch đều bằng 1400 (đảm bảo chữ C - Consistency trong ACID).",
      "sql": "UPDATE Employees SET Salary = Salary - 150 WHERE Id = 1;\nUPDATE Employees SET Salary = Salary + 150 WHERE Id = 2;\nSELECT Id, FName, Salary FROM Employees WHERE Id IN (1, 2) ORDER BY Id ASC;",
      "db": "autoshop",
      "expected": {
        "cols": [
          "Id",
          "FName",
          "Salary"
        ],
        "rows": [
          [
            1,
            "James",
            850
          ],
          [
            2,
            "John",
            550
          ]
        ]
      },
      "order_matters": true,
      "hints": [
        "Viết 2 lệnh UPDATE cho Id = 1 và Id = 2, sau đó SELECT Id, FName, Salary FROM Employees WHERE Id IN (1, 2) ORDER BY Id ASC;",
        "UPDATE Employees SET Salary = Salary - 150 WHERE Id = 1; UPDATE Employees SET Salary = Salary + 150 WHERE Id = 2;",
        "UPDATE Employees SET Salary = Salary - 150 WHERE Id = 1; UPDATE Employees SET Salary = Salary + 150 WHERE Id = 2; SELECT Id, FName, Salary FROM Employees WHERE Id IN (1, 2) ORDER BY Id ASC;"
      ]
    }
  ],
  "practice": [
    {
      "id": "ch09_p1",
      "title": "Mô phỏng kiểm soát xung đột đồng thời bằng Optimistic Concurrency Control",
      "difficulty": "Khá",
      "db": "truonghoc",
      "summary": "Trên CSDL TruongHoc, hãy thêm cột PhienBan INT NOT NULL DEFAULT 1 vào bảng MonHoc. Sau đó thực hiện cập nhật nâng SoTinChi lên 5 và tăng PhienBan thêm 1 cho môn 'CS101' với điều kiện kiểm tra đồng thời PhienBan = 1. Tiếp theo, giả lập một phiên thứ hai đến muộn cũng cố cập nhật môn 'CS101' (nâng SoTinChi lên 6) nhưng vẫn truyền điều kiện cũ WHERE MaMH = 'CS101' AND PhienBan = 1. Cuối cùng SELECT MaMH, TenMH, SoTinChi, PhienBan FROM MonHoc WHERE MaMH = 'CS101' để chứng minh phiên đến muộn bị từ chối.",
      "understand": "Phiên thứ nhất chạy thành công sẽ đổi SoTinChi = 5 và PhienBan = 2. Khi phiên thứ hai chạy câu UPDATE với WHERE MaMH = 'CS101' AND PhienBan = 1, không có dòng nào khớp nên dữ liệu của phiên 1 không bị ghi đè mất (chống Lost Update)!",
      "brute": "Cập nhật thẳng WHERE MaMH = 'CS101' không kiểm tra phiên bản, dẫn tới người bấm Lưu sau đè mất dữ liệu của người bấm Lưu trước.",
      "optimal": "Thêm cột PhienBan, chạy 2 câu UPDATE liên tiếp cùng kèm điều kiện AND PhienBan = 1, rồi SELECT kiểm tra.",
      "trace": "Sau câu UPDATE 1: CS101 có SoTinChi = 5, PhienBan = 2. Câu UPDATE 2 tìm PhienBan = 1 không thấy nên sửa 0 dòng. Kết quả cuối: SoTinChi = 5, PhienBan = 2.",
      "sql": "ALTER TABLE MonHoc ADD COLUMN PhienBan INT NOT NULL DEFAULT 1;\nUPDATE MonHoc SET SoTinChi = 5, PhienBan = PhienBan + 1 WHERE MaMH = 'CS101' AND PhienBan = 1;\nUPDATE MonHoc SET SoTinChi = 6, PhienBan = PhienBan + 1 WHERE MaMH = 'CS101' AND PhienBan = 1;\nSELECT MaMH, TenMH, SoTinChi, PhienBan FROM MonHoc WHERE MaMH = 'CS101';",
      "expected": {
        "cols": [
          "MaMH",
          "TenMH",
          "SoTinChi",
          "PhienBan"
        ],
        "rows": [
          [
            "CS101",
            "Co So Du Lieu",
            5,
            2
          ]
        ]
      },
      "order_matters": false,
      "pitfalls": "Quên tăng PhienBan = PhienBan + 1 trong câu UPDATE thứ nhất khiến câu UPDATE thứ hai vẫn chạy lọt!",
      "note3": {
        "idea": "Optimistic Locking không khóa dòng lúc đọc mà gắn một cột Version (hoặc RowVersion); lúc UPDATE phải kèm WHERE Id = @Id AND Version = @OldVersion đồng thời SET Version = Version + 1.",
        "syntax": "UPDATE Table SET Col = @NewVal, Version = Version + 1 WHERE Id = @Id AND Version = @ReadVersion;",
        "trap": "Quên kiểm tra số dòng bị ảnh hưởng (Affected Rows == 0) ở code ứng dụng để ném ngoại lệ OptimisticLockException / DbUpdateConcurrencyException."
      }
    }
  ],
  "summary_table": [
    [
      "ACID",
      "Atomicity, Consistency, Isolation, Durability",
      "Đảm bảo nhờ Undo Log, Ràng buộc, Lock/MVCC và WAL"
    ],
    [
      "READ COMMITTED",
      "Mặc định của SQL Server / Postgres; chặn Dirty Read",
      "Bật thêm RCSI trên SQL Server để Đọc không bị chặn bởi Ghi"
    ],
    [
      "REPEATABLE READ",
      "Giữ khóa đọc trên các dòng đã chạm tới cuối Transaction",
      "Chặn được Non-Repeatable Read và Lost Update"
    ],
    [
      "SERIALIZABLE / SNAPSHOT",
      "Cô lập cao nhất, chặn cả Phantom Read",
      "SERIALIZABLE khóa khoảng (dễ Deadlock); SNAPSHOT dùng tempdb"
    ],
    [
      "Optimistic vs Pessimistic",
      "Kiểm tra cột Version lúc sửa vs Khóa dòng bằng UPDLOCK/FOR UPDATE",
      "Tránh giữ khóa trong khi gọi mạng bên ngoài"
    ]
  ],
  "quiz": [
    {
      "q": "Câu 1: Trong SQL Server, khi một giao dịch chạy ở mức cô lập READ UNCOMMITTED (hoặc gắn hint WITH (NOLOCK)), giao dịch đó có thể gặp phải hiện tượng đọc nguy hiểm nhất nào?",
      "a": "Gặp hiện tượng Dirty Read (đọc phải dữ liệu chưa được COMMIT của giao dịch khác mà ngay sau đó có thể bị ROLLBACK)."
    },
    {
      "q": "Câu 2: Tại sao trong một hàm Service của Spring Boot có gắn @Transactional, bạn không nên gọi API thanh toán của bên thứ ba (mất 2-3 giây chờ mạng) ở giữa hai câu lệnh cập nhật CSDL?",
      "a": "Vì trong suốt 2-3 giây chờ phản hồi HTTP từ bên thứ ba, kết nối CSDL và các khóa dòng (Locks) vẫn bị giữ chặt, làm cạn kiệt Connection Pool (như HikariCP thường chỉ có 10-20 kết nối) và chặn đứng các giao dịch khác."
    },
    {
      "q": "Câu 3: Để xóa 500.000 dòng lịch sử log cũ trên bảng đang chạy Production trong SQL Server mà không kích hoạt Lock Escalation (khóa cứng toàn bảng), bạn nên làm gì?",
      "a": "Chia nhỏ lệnh xóa thành từng lô dưới 5.000 dòng (ví dụ DELETE TOP (3000) FROM LogTable WHERE CreatedAt < ... lặp lại trong vòng lặp WHILE) để SQL Server chỉ giữ khóa dòng (Row Locks) và giải phóng ngay sau mỗi lô."
    }
  ]
});
