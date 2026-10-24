/**
 * ==========================================================================
 * FILE: src/data/simulators.js
 * MÔ TẢ: 6 Bộ Mô Phỏng Trực Quan Tương Tác (Interactive Simulators)
 * 1. join: Nối Bảng JOIN & Bẫy Lọc ON vs WHERE
 * 2. exec_order: Thứ Tự Thực Thi Lý Thuyết 9 Bước của SELECT (Logical Query Processing)
 * 3. btree: Cây Chỉ Mục B-Tree vs Table Scan & SARGability (I/O Pages)
 * 4. isolation: 4 Mức Cô Lập Giao Dịch (ACID) & Deadlock Timeline
 * 5. normalization: Chuẩn Hóa CSDL 1NF -> 2NF -> 3NF -> BCNF
 * 6. injection: Phòng Thí Nghiệm Tấn Công & Phòng Thủ SQL Injection
 * KIẾN TRÚC: Gọi window.BiKipRegistry.setSimulators(...)
 * ==========================================================================
 */
(function(global) {
  "use strict";

  var SIMULATORS = {
    /* ======================================================================
       1. BỘ MÔ PHỎNG NỐI BẢNG (JOIN SIMULATOR & ON VS WHERE)
       ====================================================================== */
    join: {
      title: "Mô Phỏng Trực Quan Các Phép Nối Bảng (JOIN) & Bẫy ON vs WHERE",
      desc: "Trực quan hóa cơ chế ghép dòng giữa Bảng A (SinhVien) và Bảng B (Khoa). So sánh tập kết quả, số dòng sinh ra, và phân tích bẫy đặt điều kiện lọc ở ON so với WHERE trong phép nối ngoài.",
      left_table: {
        name: "SinhVien (Bảng Trái / A)",
        pk: "MaSV",
        columns: ["MaSV", "HoTen", "MaKhoa", "HocBong"],
        rows: [
          { MaSV: "SV01", HoTen: "Nguyễn Văn An", MaKhoa: "CNTT", HocBong: 8000 },
          { MaSV: "SV02", HoTen: "Trần Thị Bình", MaKhoa: "KT", HocBong: 5000 },
          { MaSV: "SV03", HoTen: "Lê Văn Cường", MaKhoa: "CNTT", HocBong: 0 },
          { MaSV: "SV04", HoTen: "Phạm Minh Dũng", MaKhoa: null, HocBong: 3000 }
        ]
      },
      right_table: {
        name: "Khoa (Bảng Phải / B)",
        pk: "MaKhoa",
        columns: ["MaKhoa", "TenKhoa", "TruongKhoa"],
        rows: [
          { MaKhoa: "CNTT", TenKhoa: "Công Nghệ Thông Tin", TruongKhoa: "TS. Nguyễn An" },
          { MaKhoa: "KT", TenKhoa: "Kinh Tế Đối Ngoại", TruongKhoa: "PGS. Lê Bình" },
          { MaKhoa: "NN", TenKhoa: "Ngoại Ngữ Ứng Dụng", TruongKhoa: "ThS. Trần Hoa" }
        ]
      },
      modes: {
        INNER: {
          label: "INNER JOIN (Nối Trong)",
          sql: "SELECT sv.MaSV, sv.HoTen, sv.MaKhoa, k.TenKhoa\nFROM SinhVien sv\nINNER JOIN Khoa k ON sv.MaKhoa = k.MaKhoa;",
          venn_ascii: "  [ Bảng Trái A ]        [ Bảng Phải B ]\n       (      (  A ∩ B  )      )\n   SV04| SV01,SV02,SV03 | Khoa NN\n(Bị loại)  (Chỉ lấy dòng khớp)  (Bị loại)",
          desc: "Chỉ giữ lại các dòng có giá trị khóa nối khớp ở cả 2 bảng (A.MaKhoa = B.MaKhoa). Dòng SV04 (MaKhoa NULL) và Khoa NN (chưa có SV) bị loại bỏ hoàn toàn.",
          matched_pairs: [
            { left: "SV01 (CNTT)", right: "CNTT", status: "MATCH" },
            { left: "SV02 (KT)", right: "KT", status: "MATCH" },
            { left: "SV03 (CNTT)", right: "CNTT", status: "MATCH" },
            { left: "SV04 (NULL)", right: "NULL", status: "DISCARD_LEFT" },
            { left: "NULL", right: "NN (Ngoại Ngữ)", status: "DISCARD_RIGHT" }
          ],
          result_rows: [
            { MaSV: "SV01", HoTen: "Nguyễn Văn An", MaKhoa: "CNTT", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Khớp khóa CNTT" },
            { MaSV: "SV02", HoTen: "Trần Thị Bình", MaKhoa: "KT", TenKhoa: "Kinh Tế Đối Ngoại", ghi_chu: "Khớp khóa KT" },
            { MaSV: "SV03", HoTen: "Lê Văn Cường", MaKhoa: "CNTT", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Khớp khóa CNTT" }
          ]
        },
        LEFT: {
          label: "LEFT JOIN / LEFT OUTER JOIN (Nối Trái Bảo Toàn)",
          sql: "SELECT sv.MaSV, sv.HoTen, sv.MaKhoa, k.TenKhoa\nFROM SinhVien sv\nLEFT JOIN Khoa k ON sv.MaKhoa = k.MaKhoa;",
          venn_ascii: "  [ Bảng Trái A ]        [ Bảng Phải B ]\n   (★★★★★★★★★★★★★★★★★★★★)      )\n   (  Toàn bộ SV01..SV04 )  Khoa NN\n   (  SV04 ghép NULL     ) (Bị loại)",
          desc: "Bảo toàn 100% dòng của Bảng Trái (SinhVien). Với dòng không tìm thấy Khoa tương ứng (SV04 có MaKhoa IS NULL), các cột của Bảng Phải sẽ tự động điền giá trị NULL.",
          matched_pairs: [
            { left: "SV01 (CNTT)", right: "CNTT", status: "MATCH" },
            { left: "SV02 (KT)", right: "KT", status: "MATCH" },
            { left: "SV03 (CNTT)", right: "CNTT", status: "MATCH" },
            { left: "SV04 (NULL)", right: "NULL (Điền NULL)", status: "PRESERVE_LEFT" },
            { left: "NULL", right: "NN", status: "DISCARD_RIGHT" }
          ],
          result_rows: [
            { MaSV: "SV01", HoTen: "Nguyễn Văn An", MaKhoa: "CNTT", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Khớp khóa CNTT" },
            { MaSV: "SV02", HoTen: "Trần Thị Bình", MaKhoa: "KT", TenKhoa: "Kinh Tế Đối Ngoại", ghi_chu: "Khớp khóa KT" },
            { MaSV: "SV03", HoTen: "Lê Văn Cường", MaKhoa: "CNTT", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Khớp khóa CNTT" },
            { MaSV: "SV04", HoTen: "Phạm Minh Dũng", MaKhoa: null, TenKhoa: null, ghi_chu: "Bảo toàn dòng trái, cột Khoa điền NULL" }
          ]
        },
        RIGHT: {
          label: "RIGHT JOIN / RIGHT OUTER JOIN (Nối Phải Bảo Toàn)",
          sql: "SELECT sv.MaSV, sv.HoTen, k.MaKhoa, k.TenKhoa\nFROM SinhVien sv\nRIGHT JOIN Khoa k ON sv.MaKhoa = k.MaKhoa;",
          venn_ascii: "  [ Bảng Trái A ]        [ Bảng Phải B ]\n   (      (★★★★★★★★★★★★★★★★★★★★)\n   SV04   (  Toàn bộ Khoa CNTT, KT, NN )\n(Bị loại) (  NN ghép MaSV NULL         )",
          desc: "Bảo toàn 100% dòng của Bảng Phải (Khoa). Khoa NN chưa có sinh viên nào theo học vẫn xuất hiện trong kết quả với các cột MaSV, HoTen mang giá trị NULL.",
          matched_pairs: [
            { left: "SV01 (CNTT)", right: "CNTT", status: "MATCH" },
            { left: "SV03 (CNTT)", right: "CNTT", status: "MATCH" },
            { left: "SV02 (KT)", right: "KT", status: "MATCH" },
            { left: "NULL (Điền NULL)", right: "NN (Ngoại Ngữ)", status: "PRESERVE_RIGHT" },
            { left: "SV04", right: "NULL", status: "DISCARD_LEFT" }
          ],
          result_rows: [
            { MaSV: "SV01", HoTen: "Nguyễn Văn An", MaKhoa: "CNTT", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Khớp khóa CNTT" },
            { MaSV: "SV03", HoTen: "Lê Văn Cường", MaKhoa: "CNTT", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Khớp khóa CNTT" },
            { MaSV: "SV02", HoTen: "Trần Thị Bình", MaKhoa: "KT", TenKhoa: "Kinh Tế Đối Ngoại", ghi_chu: "Khớp khóa KT" },
            { MaSV: null, HoTen: null, MaKhoa: "NN", TenKhoa: "Ngoại Ngữ Ứng Dụng", ghi_chu: "Bảo toàn dòng phải (Khoa chưa có SV)" }
          ]
        },
        FULL: {
          label: "FULL JOIN / FULL OUTER JOIN (Nối Toàn Phần)",
          sql: "SELECT sv.MaSV, sv.HoTen, COALESCE(sv.MaKhoa, k.MaKhoa) AS MaKhoa, k.TenKhoa\nFROM SinhVien sv\nFULL OUTER JOIN Khoa k ON sv.MaKhoa = k.MaKhoa;",
          venn_ascii: "  [ Bảng Trái A ]        [ Bảng Phải B ]\n   (★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★)\n   (  SV04 (NULL) | Khớp 3 dòng | Khoa NN(NULL)  )\n   (         Bảo toàn CẢ HAI BẢNG                 )",
          desc: "Bảo toàn dữ liệu của cả 2 bảng. Dòng nào khớp thì ghép đủ; dòng nào bên trái không có bên phải (SV04) hoặc bên phải không có bên trái (Khoa NN) đều được giữ lại và bù giá trị NULL.",
          matched_pairs: [
            { left: "SV01", right: "CNTT", status: "MATCH" },
            { left: "SV02", right: "KT", status: "MATCH" },
            { left: "SV03", right: "CNTT", status: "MATCH" },
            { left: "SV04", right: "NULL", status: "PRESERVE_LEFT" },
            { left: "NULL", right: "NN", status: "PRESERVE_RIGHT" }
          ],
          result_rows: [
            { MaSV: "SV01", HoTen: "Nguyễn Văn An", MaKhoa: "CNTT", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Dòng khớp đôi" },
            { MaSV: "SV02", HoTen: "Trần Thị Bình", MaKhoa: "KT", TenKhoa: "Kinh Tế Đối Ngoại", ghi_chu: "Dòng khớp đôi" },
            { MaSV: "SV03", HoTen: "Lê Văn Cường", MaKhoa: "CNTT", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Dòng khớp đôi" },
            { MaSV: "SV04", HoTen: "Phạm Minh Dũng", MaKhoa: null, TenKhoa: null, ghi_chu: "Bảo toàn SinhVien trái" },
            { MaSV: null, HoTen: null, MaKhoa: "NN", TenKhoa: "Ngoại Ngữ Ứng Dụng", ghi_chu: "Bảo toàn Khoa phải" }
          ]
        },
        CROSS: {
          label: "CROSS JOIN (Tích Đề-các / Cartesian Product)",
          sql: "SELECT sv.MaSV, sv.HoTen, k.MaKhoa, k.TenKhoa\nFROM SinhVien sv\nCROSS JOIN Khoa k;",
          venn_ascii: "  4 Dòng (SinhVien)  x  3 Dòng (Khoa)  =  12 Dòng Kết Quả\n  [Mọi sinh viên đều được ghép đôi lần lượt với tất cả các khoa]",
          desc: "Không dùng điều kiện ON. Sinh ra tích Descartes: mỗi dòng của bảng trái ghép với toàn bộ các dòng của bảng phải (4 x 3 = 12 dòng). Rất nguy hiểm trên bảng lớn nhưng hữu ích khi tạo bảng lịch/ma trận số liệu.",
          matched_pairs: [
            { left: "SV01", right: "CNTT, KT, NN", status: "CARTESIAN_3" },
            { left: "SV02", right: "CNTT, KT, NN", status: "CARTESIAN_3" },
            { left: "SV03", right: "CNTT, KT, NN", status: "CARTESIAN_3" },
            { left: "SV04", right: "CNTT, KT, NN", status: "CARTESIAN_3" }
          ],
          result_rows: [
            { MaSV: "SV01", HoTen: "Nguyễn Văn An", MaKhoa: "CNTT", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Cặp 1/12" },
            { MaSV: "SV01", HoTen: "Nguyễn Văn An", MaKhoa: "KT", TenKhoa: "Kinh Tế Đối Ngoại", ghi_chu: "Cặp 2/12" },
            { MaSV: "SV01", HoTen: "Nguyễn Văn An", MaKhoa: "NN", TenKhoa: "Ngoại Ngữ Ứng Dụng", ghi_chu: "Cặp 3/12" },
            { MaSV: "SV02", HoTen: "Trần Thị Bình", MaKhoa: "CNTT", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Cặp 4/12" },
            { MaSV: "SV02", HoTen: "Trần Thị Bình", MaKhoa: "KT", TenKhoa: "Kinh Tế Đối Ngoại", ghi_chu: "Cặp 5/12" },
            { MaSV: "SV02", HoTen: "Trần Thị Bình", MaKhoa: "NN", TenKhoa: "Ngoại Ngữ Ứng Dụng", ghi_chu: "Cặp 6/12" },
            { MaSV: "SV03", HoTen: "Lê Văn Cường", MaKhoa: "CNTT", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Cặp 7/12" },
            { MaSV: "SV03", HoTen: "Lê Văn Cường", MaKhoa: "KT", TenKhoa: "Kinh Tế Đối Ngoại", ghi_chu: "Cặp 8/12" },
            { MaSV: "SV03", HoTen: "Lê Văn Cường", MaKhoa: "NN", TenKhoa: "Ngoại Ngữ Ứng Dụng", ghi_chu: "Cặp 9/12" },
            { MaSV: "SV04", HoTen: "Phạm Minh Dũng", MaKhoa: "CNTT", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Cặp 10/12" },
            { MaSV: "SV04", HoTen: "Phạm Minh Dũng", MaKhoa: "KT", TenKhoa: "Kinh Tế Đối Ngoại", ghi_chu: "Cặp 11/12" },
            { MaSV: "SV04", HoTen: "Phạm Minh Dũng", MaKhoa: "NN", TenKhoa: "Ngoại Ngữ Ứng Dụng", ghi_chu: "Cặp 12/12" }
          ]
        },
        ON_VS_WHERE: {
          label: "BẪY PHỎNG VẤN KINH ĐIỂN: LỌC Ở MỆNH ĐỀ ON VS WHERE TRONG LEFT JOIN",
          sql: "-- TRƯỜNG HỢP 1: Điều kiện lọc đặt ở ON (Giữ 4 dòng)\nSELECT sv.MaSV, sv.HoTen, k.TenKhoa\nFROM SinhVien sv\nLEFT JOIN Khoa k ON sv.MaKhoa = k.MaKhoa AND k.MaKhoa = 'CNTT';\n\n-- TRƯỜNG HỢP 2: Điều kiện lọc đặt ở WHERE (Rơi mất dòng bảo toàn! Còn 2 dòng)\nSELECT sv.MaSV, sv.HoTen, k.TenKhoa\nFROM SinhVien sv\nLEFT JOIN Khoa k ON sv.MaKhoa = k.MaKhoa\nWHERE k.MaKhoa = 'CNTT';",
          venn_ascii: "  [ ĐẶT TẠI ON ]                               [ ĐẶT TẠI WHERE ]\n  Bước 1: Ghép dòng với Khoa CNTT              Bước 1: LEFT JOIN tạo bảng ảo VT2 (4 dòng)\n  Bước 2: BẢO TOÀN bảng trái (SV02, SV04)      Bước 2: WHERE k.MaKhoa='CNTT' lọc bỏ dòng\n  ==> TRẢ VỀ ĐỦ 4 DÒNG                         ==> CHỈ CÒN 2 DÒNG (Biến thành INNER JOIN!)",
          desc: "ĐÂY LÀ CÂU HỎI LOẠI 70% ỨNG VIÊN: Trong OUTER JOIN, mệnh đề ON chỉ quyết định CÓ GHÉP ĐƯỢC BẢNG PHẢI HAY KHÔNG. Sau đó bước bảo toàn bảng trái vẫn diễn ra nên toàn bộ dòng của SinhVien vẫn xuất hiện. Ngược lại, mệnh đề WHERE chạy SAU KHI ĐÃ GHÉP BẢNG, điều kiện `WHERE k.MaKhoa = 'CNTT'` sẽ loại bỏ các dòng có `k.MaKhoa IS NULL`, vô tình biến LEFT JOIN thành INNER JOIN!",
          matched_pairs: [
            { left: "SV01 (CNTT)", right: "CNTT", status: "ON: Khớp | WHERE: Giữ" },
            { left: "SV02 (KT)", right: "NULL (do k.MaKhoa!='CNTT')", status: "ON: Giữ (Khoa NULL) | WHERE: Bị loại!" },
            { left: "SV03 (CNTT)", right: "CNTT", status: "ON: Khớp | WHERE: Giữ" },
            { left: "SV04 (NULL)", right: "NULL", status: "ON: Giữ (Khoa NULL) | WHERE: Bị loại!" }
          ],
          result_rows: [
            { MaSV: "SV01", HoTen: "Nguyễn Văn An", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Cả ON và WHERE đều có" },
            { MaSV: "SV02", HoTen: "Trần Thị Bình", TenKhoa: null, ghi_chu: "ON giữ lại (TenKhoa NULL) -- WHERE LOẠI MẤT DÒNG NÀY!" },
            { MaSV: "SV03", HoTen: "Lê Văn Cường", TenKhoa: "Công Nghệ Thông Tin", ghi_chu: "Cả ON và WHERE đều có" },
            { MaSV: "SV04", HoTen: "Phạm Minh Dũng", TenKhoa: null, ghi_chu: "ON giữ lại (TenKhoa NULL) -- WHERE LOẠI MẤT DÒNG NÀY!" }
          ]
        }
      }
    },

    /* ======================================================================
       2. BỘ MÔ PHỎNG THỨ TỰ THỰC THI 9 BƯỚC CỦA SELECT (LOGICAL QUERY PROCESSING)
       ====================================================================== */
    exec_order: {
      title: "Mô Phỏng Thứ Tự Thực Thi Logic Của Câu Lệnh SELECT (9 Bước Chuẩn Itzik Ben-Gan)",
      desc: "Trình duyệt SQL không đọc câu lệnh từ trên xuống dưới theo thứ tự gõ cú pháp (Lexical Order) mà thực thi theo 9 bước bảng ảo (Virtual Tables: VT1 -> VT9). Hiểu rõ quy trình này là chìa khóa để giải thích tại sao không dùng được Alias trong WHERE hay HAVING.",
      query: "SELECT TOP 2 k.TenKhoa, COUNT(sv.MaSV) AS SoSV\nFROM Khoa k\nLEFT JOIN SinhVien sv ON k.MaKhoa = sv.MaKhoa\nWHERE sv.HocBong >= 3000 OR sv.MaSV IS NULL\nGROUP BY k.MaKhoa, k.TenKhoa\nHAVING COUNT(sv.MaSV) >= 1\nORDER BY SoSV DESC;",
      lexical_order: ["SELECT (Mục 6)", "FROM (Mục 1)", "JOIN (Mục 2)", "WHERE (Mục 3)", "GROUP BY (Mục 4)", "HAVING (Mục 5)", "ORDER BY (Mục 8)", "TOP / OFFSET (Mục 9)"],
      steps: [
        {
          step: 1,
          clause: "FROM Khoa k",
          vt_name: "Bảng Ảo VT1 (Xác định nguồn dữ liệu ban đầu)",
          desc: "Động cơ SQL xác định bảng gốc `Khoa` gồm 3 dòng: CNTT, KT, NN. Nếu có nhiều bảng hoặc subquery, chúng sẽ được nạp tại đây.",
          columns: ["k.MaKhoa", "k.TenKhoa", "k.TruongKhoa"],
          rows: [
            ["CNTT", "Công Nghệ Thông Tin", "TS. Nguyễn An"],
            ["KT", "Kinh Tế Đối Ngoại", "PGS. Lê Bình"],
            ["NN", "Ngoại Ngữ Ứng Dụng", "ThS. Trần Hoa"]
          ],
          note: "Tạo bảng ảo VT1. Lúc này chưa có thông tin sinh viên nào được ghép vào."
        },
        {
          step: 2,
          clause: "LEFT JOIN SinhVien sv ON k.MaKhoa = sv.MaKhoa",
          vt_name: "Bảng Ảo VT2 (Ghép nối và bảo toàn dòng ngoài)",
          desc: "Thực hiện phép nối logic: Ghép các cặp có `k.MaKhoa = sv.MaKhoa`. Vì là `LEFT JOIN`, dòng Khoa NN không có sinh viên nào vẫn được thêm vào bảng ảo VT2 với các cột của SinhVien mang giá trị NULL.",
          columns: ["k.MaKhoa", "k.TenKhoa", "sv.MaSV", "sv.HoTen", "sv.HocBong"],
          rows: [
            ["CNTT", "Công Nghệ Thông Tin", "SV01", "Nguyễn Văn An", 8000],
            ["CNTT", "Công Nghệ Thông Tin", "SV03", "Lê Văn Cường", 0],
            ["KT", "Kinh Tế Đối Ngoại", "SV02", "Trần Thị Bình", 5000],
            ["NN", "Ngoại Ngữ Ứng Dụng", null, null, null]
          ],
          note: "Bảng ảo VT2 có 4 dòng. Dòng SV04 (MaKhoa NULL) không xuất hiện vì bảng gốc bên trái là Khoa."
        },
        {
          step: 3,
          clause: "WHERE sv.HocBong >= 3000 OR sv.MaSV IS NULL",
          vt_name: "Bảng Ảo VT3 (Lọc từng dòng đơn lẻ)",
          desc: "Áp dụng biểu thức lọc trên từng dòng của VT2. Dòng SV03 có HocBong = 0 (< 3000) bị loại. Dòng Khoa NN được giữ lại nhờ điều kiện `sv.MaSV IS NULL`.",
          columns: ["k.MaKhoa", "k.TenKhoa", "sv.MaSV", "sv.HoTen", "sv.HocBong"],
          rows: [
            ["CNTT", "Công Nghệ Thông Tin", "SV01", "Nguyễn Văn An", 8000],
            ["KT", "Kinh Tế Đối Ngoại", "SV02", "Trần Thị Bình", 5000],
            ["NN", "Ngoại Ngữ Ứng Dụng", null, null, null]
          ],
          note: "TẠI SAO KHÔNG DÙNG ĐƯỢC ALIAS Ở ĐÂY? Vì bước 3 (WHERE) chạy trước bước 6 (SELECT). Tại thời điểm này, bí danh 'SoSV' hoàn toàn chưa được khai sinh!"
        },
        {
          step: 4,
          clause: "GROUP BY k.MaKhoa, k.TenKhoa",
          vt_name: "Bảng Ảo VT4 (Gom các dòng thành từng nhóm dữ liệu)",
          desc: "Tất cả các dòng có cùng cặp giá trị (k.MaKhoa, k.TenKhoa) được gom thành một nhóm duy nhất. Kể từ bước này, chỉ được truy xuất các cột nằm trong GROUP BY hoặc qua các hàm tổng hợp (Aggregate Functions: COUNT, SUM, AVG, MIN, MAX).",
          columns: ["Nhóm (k.MaKhoa, k.TenKhoa)", "Danh sách dòng chi tiết trong nhóm"],
          rows: [
            ["(CNTT, Công Nghệ Thông Tin)", "1 dòng: [SV01 - An]"],
            ["(KT, Kinh Tế Đối Ngoại)", "1 dòng: [SV02 - Bình]"],
            ["(NN, Ngoại Ngữ Ứng Dụng)", "1 dòng: [NULL, NULL]"]
          ],
          note: "Bảng ảo VT4 biến thành tập hợp 3 nhóm. Các thuộc tính chi tiết không gom nhóm sẽ không thể gọi trực tiếp."
        },
        {
          step: 5,
          clause: "HAVING COUNT(sv.MaSV) >= 1",
          vt_name: "Bảng Ảo VT5 (Lọc trên từng nhóm dữ liệu)",
          desc: "Đánh giá điều kiện lọc trên từng nhóm của VT4. Nhóm CNTT có COUNT(sv.MaSV) = 1 (Đạt). Nhóm KT có COUNT = 1 (Đạt). Nhóm NN có sv.MaSV là NULL nên hàm COUNT(sv.MaSV) bỏ qua NULL và trả về 0 (< 1) -> Nhóm NN bị loại!",
          columns: ["Nhóm", "COUNT(sv.MaSV)", "Kết quả lọc HAVING"],
          rows: [
            ["(CNTT, Công Nghệ Thông Tin)", "1", "GIỮ LẠI (>= 1)"],
            ["(KT, Kinh Tế Đối Ngoại)", "1", "GIỮ LẠI (>= 1)"],
            ["(NN, Ngoại Ngữ Ứng Dụng)", "0 (do bỏ qua NULL)", "LOẠI BỎ (< 1)"]
          ],
          note: "Khác biệt WHERE vs HAVING: WHERE lọc từng dòng trước khi nhóm; HAVING lọc cả nhóm sau khi nhóm."
        },
        {
          step: 6,
          clause: "SELECT k.TenKhoa, COUNT(sv.MaSV) AS SoSV",
          vt_name: "Bảng Ảo VT6 (Chiếu cột và gán bí danh Alias)",
          desc: "Động cơ SQL tính toán các biểu thức trong danh sách SELECT, chọn ra các cột cần hiển thị và CHÍNH THỨC GÁN BÍ DANH (Alias) `SoSV` cho biểu thức `COUNT(sv.MaSV)`.",
          columns: ["TenKhoa", "SoSV (Đã gán Alias)"],
          rows: [
            ["Công Nghệ Thông Tin", 1],
            ["Kinh Tế Đối Ngoại", 1]
          ],
          note: "Bí danh 'SoSV' bắt đầu tồn tại từ thời điểm này trở đi."
        },
        {
          step: 7,
          clause: "DISTINCT (Nếu có)",
          vt_name: "Bảng Ảo VT7 (Khử trùng lặp dòng)",
          desc: "Trong câu truy vấn này không có từ khóa DISTINCT. Nếu có, SQL Server sẽ sắp xếp hoặc băm (Hash) để loại bỏ các dòng có cùng giá trị trên tất cả các cột của VT6.",
          columns: ["TenKhoa", "SoSV"],
          rows: [
            ["Công Nghệ Thông Tin", 1],
            ["Kinh Tế Đối Ngoại", 1]
          ],
          note: "Giữ nguyên 2 dòng của VT6."
        },
        {
          step: 8,
          clause: "ORDER BY SoSV DESC",
          vt_name: "Bảng Ảo VT8 / Cursor (Sắp xếp tập kết quả)",
          desc: "Sắp xếp các dòng theo cột `SoSV` giảm dần. VÌ BƯỚC 8 CHẠY SAU BƯỚC 6 (SELECT), ĐÂY LÀ MỆNH ĐỀ DUY NHẤT TRONG SQL ĐƯỢC PHÉP SỬ DỤNG BÍ DANH CỦA SELECT!",
          columns: ["TenKhoa", "SoSV"],
          rows: [
            ["Công Nghệ Thông Tin", 1],
            ["Kinh Tế Đối Ngoại", 1]
          ],
          note: "Tập kết quả đã có thứ tự xác định (biến từ Tập hợp Toán học Relation thành Con trỏ Cursor)."
        },
        {
          step: 9,
          clause: "TOP 2 / OFFSET-FETCH",
          vt_name: "Tập Kết Quả Cuối Cùng (Trả về cho Client qua JDBC / ADO.NET)",
          desc: "Cắt lấy đúng 2 dòng đầu tiên theo yêu cầu của mệnh đề `TOP 2` để gửi về cho ứng dụng backend Java hoặc C# qua mạng.",
          columns: ["TenKhoa", "SoSV"],
          rows: [
            ["Công Nghệ Thông Tin", 1],
            ["Kinh Tế Đối Ngoại", 1]
          ],
          note: "Hoàn tất! Tổng thời gian chạy: ~0.5ms trong bộ nhớ."
        }
      ]
    },

    /* ======================================================================
       3. BỘ MÔ PHỎNG CÂY CHỈ MỤC B-TREE & SARGABILITY (INDEX SEEK VS SCAN)
       ====================================================================== */
    btree: {
      title: "Mô Phỏng Cây Chỉ Mục B-Tree, Tìm Kiếm Nhị Phân (Index Seek) & SARGability",
      desc: "Trực quan hóa cấu trúc B-Tree 3 tầng (Root -> Intermediate -> Leaf) của bảng DonHang với 1.000.000 dòng (8.500 Data Pages). So sánh số trang I/O đọc được giữa câu truy vấn tối ưu (SARGable Index Seek) và câu truy vấn phạm bẫy bọc hàm làm mất Index (Non-SARGable Table Scan).",
      table_info: {
        table_name: "DonHang",
        total_rows: "1,000,000 dòng",
        data_pages: "8,500 trang dữ liệu (8KB / trang = 68 MB)",
        index_clustered: "PK_DonHang (MaDH - INT)",
        index_nonclustered: "IX_DonHang_NgayDat_MaKH (NgayDat, MaKH)"
      },
      scenarios: [
        {
          id: "sarg_eq",
          name: "1. Tìm kiếm bằng khóa đẳng thức: WHERE MaKH = 1042",
          sql: "SELECT MaDH, MaKH, NgayDat, TongTien\nFROM DonHang\nWHERE MaKH = 1042;",
          sargable: true,
          plan_op: "Index Seek (Non-Clustered) + Key Lookup",
          io_pages: 5,
          io_compare: "5 trang (40 KB) so với 8,500 trang (68 MB) -> Giảm 99.94% I/O!",
          execution_time: "0.38 ms",
          tree_path: "Root Page #1 -> Intermediate Page #22 -> Leaf Page #1420 -> Key Lookup Data Page #7210",
          scan_desc: "Biểu thức đẳng thức là SARGable tuyệt đối. SQL Server thực hiện tìm kiếm nhị phân qua 3 tầng B-Tree để định vị chính xác vị trí bản ghi mà không cần duyệt qua các dòng khác.",
          fix_tip: "Đã tối ưu chuẩn mực. Nếu muốn triệt tiêu hoàn toàn bước Key Lookup (chỉ còn 3 trang I/O), hãy tạo Covering Index với mệnh đề INCLUDE."
        },
        {
          id: "non_sarg_func",
          name: "2. [BẪY TỬ THẦN] Bọc hàm lên cột Index: WHERE YEAR(NgayDat) = 2025",
          sql: "-- NGUY HIỂM: Bọc hàm YEAR() làm hỏng tính năng tìm kiếm B-Tree!\nSELECT MaDH, NgayDat, TongTien\nFROM DonHang\nWHERE YEAR(NgayDat) = 2025;",
          sargable: false,
          plan_op: "Index Scan / Clustered Index Scan (Table Scan toàn bảng)",
          io_pages: 8500,
          io_compare: "Đọc trọn vẹn 8,500 trang I/O (Toàn bộ 68 MB bảng dữ liệu)",
          execution_time: "480.00 ms (Chậm gấp 1,260 lần!)",
          tree_path: "Duyệt tuần tự từ Leaf Page #1 đến Leaf Page #8500 không sót trang nào",
          scan_desc: "Khi bọc hàm `YEAR(NgayDat)`, SQL Server không thể biết giá trị đầu ra của hàm nếu không tính toán trên TỪNG DÒNG MỘT của 1 triệu dòng. B-Tree bị vô hiệu hóa hoàn toàn!",
          fix_tip: "QUY TẮC BẤT BIẾN: 'GIỮ NGUYÊN CỘT ĐỨNG MỘT MÌNH TRONG PHÉP SO SÁNH'. Viết lại bằng khoảng thời gian: `WHERE NgayDat >= '2025-01-01' AND NgayDat < '2026-01-01'`."
        },
        {
          id: "sarg_range",
          name: "3. [CÁCH SỬA CHUẨN] Tìm kiếm khoảng ngày: WHERE NgayDat >= '2025-01-01' AND ...",
          sql: "-- VIẾT LẠI CHUẨN SARGABLE CHO BÀI TOÁN TÌM THEO NĂM 2025:\nSELECT MaDH, NgayDat, TongTien\nFROM DonHang\nWHERE NgayDat >= '2025-01-01' AND NgayDat < '2026-01-01';",
          sargable: true,
          plan_op: "Index Seek (Range Seek)",
          io_pages: 18,
          io_compare: "18 trang I/O (Chỉ đọc đúng phạm vi ngày trong năm 2025)",
          execution_time: "1.20 ms (Nhanh gấp 400 lần so với bọc hàm YEAR!)",
          tree_path: "Seek tới trang đầu tiên '2025-01-01' qua 3 bước B-Tree -> Đọc ngang danh sách liên kết kép 15 trang lá tiếp theo",
          scan_desc: "Cột `NgayDat` đứng độc lập. SQL Server dùng Index Seek nhảy ngay tới ngày 01/01/2025 rồi đọc quét xuôi theo con trỏ liên kết kép của các trang lá (Leaf Page Doubly Linked List) cho tới ngày 31/12/2025 thì dừng.",
          fix_tip: "Đây là mẫu thiết kế tiêu chuẩn vàng cho mọi báo cáo theo tháng/quý/năm trong Backend Java & .NET."
        },
        {
          id: "non_sarg_like",
          name: "4. [BẪY TÌM KIẾM] Ký tự đại diện đứng đầu: WHERE TenSP LIKE N'%Táo%'",
          sql: "-- NGUY HIỂM: Ký tự % ở đầu chuỗi làm mất trật tự từ điển của Index\nSELECT MaSP, TenSP, DonGia\nFROM SanPham\nWHERE TenSP LIKE N'%Táo%';",
          sargable: false,
          plan_op: "Index Scan / Clustered Index Scan",
          io_pages: 3200,
          io_compare: "3,200 trang I/O (Phải quét toàn bộ chuỗi ký tự của mọi dòng)",
          execution_time: "195.00 ms",
          tree_path: "Quét toàn bộ trang dữ liệu từ đầu đến cuối",
          scan_desc: "Chỉ mục B-Tree sắp xếp chuỗi theo thứ tự từ điển (A -> Z). Khi tìm `%Táo%`, chữ 'Táo' có thể nằm ở bất kỳ đâu trong từ (ví dụ 'Nước ép Táo', 'Hạt Táo', 'Táo Envy') nên Index Seek không thể định vị được điểm bắt đầu.",
          fix_tip: "Nếu chỉ tìm từ bắt đầu bằng 'Táo', hãy viết `LIKE N'Táo%'` (Index Seek cực nhanh). Nếu bắt buộc tìm toàn văn giữa chuỗi, phải sử dụng Full-Text Search (CONTAINS) hoặc Elasticsearch."
        },
        {
          id: "covering_idx",
          name: "5. [TUYỆT KỸ HIỆU NĂNG] Triệt tiêu Key Lookup bằng Covering Index (INCLUDE)",
          sql: "-- TẠO CHỈ MỤC BAO PHỦ:\n-- CREATE NONCLUSTERED INDEX IX_DonHang_Covering\n-- ON DonHang (MaKH) INCLUDE (NgayDat, TongTien);\n\nSELECT MaDH, NgayDat, TongTien\nFROM DonHang\nWHERE MaKH = 1042;",
          sargable: true,
          plan_op: "Index Seek (100% Covered - Zero Key Lookup)",
          io_pages: 3,
          io_compare: "Đúng 3 trang I/O (Root -> Intermediate -> Leaf)! Triệt tiêu hoàn toàn bước nhảy ngẫu nhiên sang bảng chính",
          execution_time: "0.15 ms (Tối ưu hóa đến giới hạn vật lý)",
          tree_path: "Root Page #1 -> Intermediate Page #22 -> Leaf Page #1420 (Dừng tại đây vì nút lá đã chứa sẵn NgayDat & TongTien)",
          scan_desc: "Mệnh đề `INCLUDE (NgayDat, TongTien)` đưa dữ liệu của 2 cột này vào thẳng mức lá của Non-Clustered Index. Truy vấn lấy được toàn bộ dữ liệu ngay tại cây chỉ mục mà KHÔNG CẦN NHẢY VÀO CLUSTERED INDEX (0 Key Lookup).",
          fix_tip: "Áp dụng cho các truy vấn SELECT xuất hiện với tần suất hàng triệu lần mỗi ngày trong các API tài chính, giỏ hàng, thông báo."
        }
      ]
    },

    /* ======================================================================
       4. BỘ MÔ PHỎNG MỨC CÔ LẬP GIAO DỊCH & DEADLOCK TIMELINE (ACID)
       ====================================================================== */
    isolation: {
      title: "Mô Phỏng 4 Mức Cô Lập Giao Dịch Chuẩn ANSI, RCSI & Kịch Bản Deadlock (Error 1205)",
      desc: "Trực quan hóa timeline đan xen giữa Giao dịch A (Transaction A) và Giao dịch B (Transaction B). Minh họa cơ chế cấp phát khóa (Shared Lock vs Exclusive Lock), hiện tượng đọc dị thường (Dirty Read, Non-Repeatable Read, Phantom Read) và cơ chế Deadlock Victim của SQL Server.",
      levels: {
        READ_UNCOMMITTED: {
          name: "1. READ UNCOMMITTED (Đọc Bẩn / Dirty Read)",
          anomaly: "Dirty Read (Đọc dữ liệu chưa commit rồi bị Rollback)",
          lock_behavior: "Không xin Shared Lock (S-Lock), phớt lờ hoàn toàn Exclusive Lock (X-Lock) của giao dịch khác. Tương đương với gợi ý WITH (NOLOCK).",
          timeline: [
            { tick: "T1", time: "10:00:00.100", tx_a: "BEGIN TRAN;\nUPDATE TaiKhoan SET SoDu = 5000000 WHERE MaTK = 'TK01'; -- Cũ: 10tr", tx_b: "-- Đang chờ...", lock_state: "A giữ Exclusive Lock (X) trên dòng TK01", db_val: "TK01: 5.000.000đ (Trong Transaction A)", alert: null },
            { tick: "T2", time: "10:00:00.250", tx_a: "-- Đang xử lý nghiệp vụ...", tx_b: "SET TRAN ISOLATION LEVEL READ UNCOMMITTED;\nSELECT SoDu FROM TaiKhoan WHERE MaTK = 'TK01';", lock_state: "B đọc trực tiếp không xin khóa, bỏ qua X-Lock của A!", db_val: "B đọc được: 5.000.000đ", alert: "⚠️ NGUY HIỂM: Transaction B vừa thực hiện ĐỌC BẨN (Dirty Read) giá trị 5 triệu chưa được xác nhận!" },
            { tick: "T3", time: "10:00:00.400", tx_a: "ROLLBACK TRAN; -- Lỗi thanh toán, hoàn tác về 10tr!", tx_b: "B dùng số dư 5.000.000đ để duyệt đơn hàng cho khách!", lock_state: "A nhả X-Lock sau Rollback", db_val: "TK01 thực tế trong DB: 10.000.000đ", alert: "🚨 HẬU QUẢ: Transaction B đã ra quyết định dựa trên dữ liệu 'ảo' không hề tồn tại trong cơ sở dữ liệu!" }
          ]
        },
        READ_COMMITTED: {
          name: "2. READ COMMITTED (Mặc Định Của SQL Server - Chặn Đọc Bẩn)",
          anomaly: "Chặn được Dirty Read. Vẫn dính Non-Repeatable Read (Đọc không lặp lại) và Phantom Read.",
          lock_behavior: "Xin Shared Lock (S-Lock) khi đọc và NHẢ KHÓA NGAY LẬP TỨC sau khi câu lệnh đọc kết thúc (không giữ tới cuối transaction).",
          timeline: [
            { tick: "T1", time: "10:00:01.100", tx_a: "BEGIN TRAN;\nSELECT SoDu FROM TaiKhoan WHERE MaTK = 'TK01';", tx_b: "-- Chưa làm gì", lock_state: "A xin S-Lock đọc xong -> Nhả S-Lock ngay!", db_val: "A đọc lần 1: 10.000.000đ", alert: null },
            { tick: "T2", time: "10:00:01.300", tx_a: "-- A vẫn đang trong transaction...", tx_b: "BEGIN TRAN;\nUPDATE TaiKhoan SET SoDu = 2000000 WHERE MaTK = 'TK01';\nCOMMIT TRAN;", lock_state: "B xin X-Lock thành công (vì A đã nhả S-Lock), cập nhật và COMMIT", db_val: "TK01 thành: 2.000.000đ", alert: "B ghi đè thành công do A không giữ khóa sau khi đọc." },
            { tick: "T3", time: "10:00:01.500", tx_a: "SELECT SoDu FROM TaiKhoan WHERE MaTK = 'TK01';\nCOMMIT TRAN;", tx_b: "-- Đã xong", lock_state: "A đọc lần 2 trong cùng 1 transaction", db_val: "A đọc lần 2: 2.000.000đ", alert: "⚠️ DỊ THƯỜNG: Non-Repeatable Read! Trong cùng một Transaction, A đọc 2 lần cùng một dòng nhưng nhận 2 giá trị khác nhau (10tr vs 2tr)!" }
          ]
        },
        READ_COMMITTED_SNAPSHOT: {
          name: "3. READ COMMITTED SNAPSHOT (RCSI - Tuyệt Tác Giảm Xung Đột Khóa)",
          anomaly: "Chặn Dirty Read, Đọc không khóa Ghi, Ghi không khóa Đọc nhờ Row Versioning trong tempdb.",
          lock_behavior: "Khi câu lệnh đọc chạy, nó không xin S-Lock mà đọc trực tiếp bản ghi phiên bản cũ đã commit trong Version Store của tempdb.",
          timeline: [
            { tick: "T1", time: "10:00:02.100", tx_a: "BEGIN TRAN;\nUPDATE TaiKhoan SET SoDu = 0 WHERE MaTK = 'TK01';", tx_b: "-- Đang chờ...", lock_state: "A giữ X-Lock trên TK01 và sao chép bản gốc (10tr) vào tempdb", db_val: "Trong DB: 0đ | Trong tempdb Version Store: 10.000.000đ", alert: null },
            { tick: "T2", time: "10:00:02.250", tx_a: "-- A đang chạy tiếp...", tx_b: "SELECT SoDu FROM TaiKhoan WHERE MaTK = 'TK01';", lock_state: "B KHÔNG BỊ CHẶN! B đọc phiên bản Snapshot committed từ tempdb", db_val: "B đọc được ngay lập tức: 10.000.000đ (0 ms delay)", alert: "🌟 LỢI ÍCH RCSI: Không có bất kỳ hiện tượng Blocking nào xảy ra! Người đọc và người ghi làm việc đồng thời mượt mà." },
            { tick: "T3", time: "10:00:02.400", tx_a: "COMMIT TRAN;", tx_b: "-- Hoàn tất", lock_state: "A commit, bản ghi mới chính thức có hiệu lực", db_val: "TK01: 0đ", alert: "Cơ chế này được bật bằng lệnh: `ALTER DATABASE TenDB SET READ_COMMITTED_SNAPSHOT ON;`" }
          ]
        },
        REPEATABLE_READ: {
          name: "4. REPEATABLE READ (Đọc Lặp Lại - Chặn Non-Repeatable Read)",
          anomaly: "Chặn Dirty Read và Non-Repeatable Read. Vẫn có thể gặp Phantom Read (Dòng bóng ma xuất hiện khi có dòng mới INSERT).",
          lock_behavior: "Xin Shared Lock (S-Lock) và GIỮ NGUYÊN KHÓA CHO ĐẾN HẾT TRANSACTION (khi gọi COMMIT/ROLLBACK mới nhả).",
          timeline: [
            { tick: "T1", time: "10:00:03.100", tx_a: "SET TRAN ISOLATION LEVEL REPEATABLE READ;\nBEGIN TRAN;\nSELECT SoDu FROM TaiKhoan WHERE MaTK = 'TK01';", tx_b: "-- Chưa làm gì", lock_state: "A giữ chặt S-Lock trên TK01 đến hết Transaction!", db_val: "A đọc lần 1: 10.000.000đ", alert: null },
            { tick: "T2", time: "10:00:03.300", tx_a: "-- A đang bận tính toán...", tx_b: "BEGIN TRAN;\nUPDATE TaiKhoan SET SoDu = 0 WHERE MaTK = 'TK01';", lock_state: "❌ BỊ CHẶN (BLOCKING)! Transaction B bị treo do A đang giữ S-Lock, B không thể xin X-Lock", db_val: "DB chưa đổi", alert: "⏳ B đang bị treo và phải đợi Transaction A nhả khóa..." },
            { tick: "T3", time: "10:00:03.500", tx_a: "SELECT SoDu FROM TaiKhoan WHERE MaTK = 'TK01';\nCOMMIT TRAN;", tx_b: "B được tiếp tục chạy sau khi A commit", lock_state: "A đọc lần 2 vẫn là 10tr -> Sau đó A nhả S-Lock -> B mới được chạy", db_val: "A đọc lần 2: 10.000.000đ (Nhất quán tuyệt đối)", alert: "✅ Chặn thành công Non-Repeatable Read!" }
          ]
        },
        SERIALIZABLE: {
          name: "5. SERIALIZABLE (Tuần Tự Hóa - Mức Cô Lập Cao Nhất)",
          anomaly: "Chặn 100% Dirty Read, Non-Repeatable Read và Phantom Read. Đổi lại hiệu năng đồng thời thấp nhất.",
          lock_behavior: "Sử dụng khóa phạm vi (Key-Range Lock). Khóa cả các giá trị hiện có lẫn khoảng trống giữa các giá trị để cấm tuyệt đối INSERT chen ngang.",
          timeline: [
            { tick: "T1", time: "10:00:04.100", tx_a: "SET TRAN ISOLATION LEVEL SERIALIZABLE;\nBEGIN TRAN;\nSELECT * FROM TaiKhoan WHERE SoDu BETWEEN 5000000 AND 10000000;", tx_b: "-- Chưa làm gì", lock_state: "A đặt Key-Range Lock trên toàn bộ khoảng [5tr - 10tr]", db_val: "A thấy 2 tài khoản thỏa mãn", alert: null },
            { tick: "T2", time: "10:00:04.300", tx_a: "-- A đang tổng hợp dữ liệu...", tx_b: "INSERT INTO TaiKhoan (MaTK, SoDu) VALUES ('TK99', 7000000);", lock_state: "❌ BỊ CHẶN BỞI KEY-RANGE LOCK! B không thể chèn dòng có số dư 7tr lọt vào dải [5tr - 10tr]!", db_val: "Dòng mới chưa được ghi vào bảng", alert: "Chặn đứng hiện tượng Dòng bóng ma (Phantom Row)!" },
            { tick: "T3", time: "10:00:04.600", tx_a: "SELECT COUNT(*) FROM TaiKhoan WHERE SoDu BETWEEN ...;\nCOMMIT TRAN;", tx_b: "B được phép chèn dòng sau khi A giải phóng Range Lock", lock_state: "A đọc lần 2 số lượng tài khoản không đổi -> Commit an toàn", db_val: "Bảo đảm tính nhất quán tuyệt đối như thể chỉ có 1 user chạy hệ thống", alert: "🏆 Hoàn hảo cho các hệ thống ngân hàng chuyển tiền liên ngân hàng." }
          ]
        },
        DEADLOCK_DEMO: {
          name: "6. [MÔ PHỎNG DEADLOCK] Kịch Bản Bế Tắc Xung Đột Chu Trình (SQL Server Error 1205)",
          anomaly: "Deadlock (Tiến trình A chờ B, Tiến trình B chờ A -> Đóng băng vĩnh viễn nếu không có Deadlock Monitor)",
          lock_behavior: "T1 giữ X-Lock trên Bảng KhachHang, muốn xin S/X-Lock trên DonHang. T2 giữ X-Lock trên DonHang, muốn xin S/X-Lock trên KhachHang.",
          timeline: [
            { tick: "T1", time: "10:00:05.100", tx_a: "BEGIN TRAN;\nUPDATE KhachHang SET DiemThuong = DiemThuong + 10 WHERE MaKH = 1;", tx_b: "BEGIN TRAN;\nUPDATE DonHang SET TongTien = TongTien - 50000 WHERE MaDH = 101;", lock_state: "T1 giữ X-Lock trên KhachHang(1)\nT2 giữ X-Lock trên DonHang(101)", db_val: "Hai tiến trình hoạt động độc lập, mỗi bên giữ 1 ổ khóa riêng biệt", alert: null },
            { tick: "T2", time: "10:00:05.250", tx_a: "UPDATE DonHang SET TrangThai = N'Đã trừ điểm' WHERE MaDH = 101;\n-- Chờ T2 nhả khóa...", tx_b: "-- T2 chuẩn bị chạy lệnh tiếp theo...", lock_state: "❌ T1 BỊ TREO! Chờ khóa độc quyền trên DonHang(101) từ T2", db_val: "T1 dừng lại ở hàng đợi khóa (Lock Wait Queue)", alert: "T1 rơi vào trạng thái chờ T2 giải phóng khóa..." },
            { tick: "T3", time: "10:00:05.400", tx_a: "-- T1 vẫn đang ngủ chờ T2...", tx_b: "UPDATE KhachHang SET TongChiTieu = TongChiTieu + 500000 WHERE MaKH = 1;\n-- Chờ T1 nhả khóa...", lock_state: "❌❌ DEADLOCK CYCLE! T2 đòi khóa KhachHang(1) mà T1 đang giữ!", db_val: "T1 chờ T2 <====> T2 chờ T1 (Vòng tròn bế tắc chết người!)", alert: "🚨 BÁO ĐỘNG DEADLOCK: Chu trình bế tắc 100% hình thành! Hệ thống không thể tự giải quyết bằng thời gian." },
            { tick: "T4", time: "10:00:05.500", tx_a: "-- T1 bị SQL Server can thiệp!", tx_b: "T2 được tiếp tục chạy và COMMIT thành công!", lock_state: "SQL Server Deadlock Monitor chọn T1 làm Nạn Nhân (Deadlock Victim)", db_val: "T1 bị Rollback | T2 commit thành công", alert: "⚡ SQL Server bắn lỗi ra Backend Java/.NET: 'Msg 1205, Level 13: Transaction was deadlocked on lock resources with another process and has been chosen as the deadlock victim. Rerun the transaction.'" }
          ]
        }
      }
    },

    /* ======================================================================
       5. BỘ MÔ PHỎNG CHUẨN HÓA DỮ LIỆU (NORMALIZATION 1NF -> 2NF -> 3NF -> BCNF)
       ====================================================================== */
    normalization: {
      title: "Mô Phỏng Chuẩn Hóa Cơ Sở Dữ Liệu Qua Từng Dạng Chuẩn (1NF -> 2NF -> 3NF -> BCNF)",
      desc: "Trực quan hóa quá trình tách một bảng phẳng ban đầu chứa đựng các dị thường thêm, sửa, xóa (Anomalies) thành hệ thống các bảng quan hệ chặt chẽ, tối ưu lưu trữ và đảm bảo toàn vẹn dữ liệu.",
      stages: [
        {
          form: "UNF",
          title: "Dạng Chưa Chuẩn Hóa (UNF - Unnormalized Form)",
          problems: "Bảng phẳng Excel duy nhất `DonHang_BanDau`. Cột `DanhSachSanPham` chứa chuỗi nhiều giá trị phân cách bằng dấu phẩy (Repeating Group). Không xác định được khóa chính nguyên tử.",
          anomalies: {
            insert: "Không thể thêm một sản phẩm mới vào kho nếu chưa có đơn hàng nào mua sản phẩm đó.",
            update: "Khách hàng đổi số điện thoại, phải tìm và sửa trên hàng chục dòng đơn hàng của người đó.",
            delete: "Xóa đơn hàng duy nhất của một sản phẩm sẽ làm mất luôn thông tin giá bán và tên sản phẩm."
          },
          tables: [
            {
              name: "DonHang_BanDau (Chưa chuẩn hóa)",
              pk: "Không có khóa chính hợp lệ",
              cols: ["MaDH", "NgayDat", "MaKH", "TenKH", "DienThoaiKH", "DanhSachSanPham_DonGia", "TongTien"],
              rows: [
                ["DH01", "2025-03-01", "KH01", "Nguyễn An", "090111222", "Sầu Riêng Ri6 (150k), Bưởi Da Xanh (70k)", 220000],
                ["DH02", "2025-03-02", "KH02", "Trần Bình", "090333444", "Táo Envy (250k)", 250000],
                ["DH03", "2025-03-05", "KH01", "Nguyễn An", "090111222", "Sầu Riêng Ri6 (150k), Nho Mẫu Đơn (850k)", 1000000]
              ]
            }
          ],
          action_taken: "Cần tách các giá trị lặp trong `DanhSachSanPham_DonGia` thành từng dòng riêng biệt để đạt 1NF."
        },
        {
          form: "1NF",
          title: "Dạng Chuẩn 1 (First Normal Form - 1NF)",
          problems: "Đã đạt nguyên tử: Mỗi ô chỉ chứa 1 giá trị đơn lẻ (Atomic Value). Khóa chính ghép được thiết lập là `(MaDH, MaSP)`. NHƯNG BỊ PHỤ THUỘC BỘ PHẬN: `TenSP, DonGia` chỉ phụ thuộc vào một phần khóa chính là `MaSP`, không phụ thuộc vào `MaDH`!",
          anomalies: {
            insert: "Muốn thêm sản phẩm mới vào kho mà chưa ai mua thì MaDH bị NULL -> Vi phạm toàn vẹn thực thể khóa chính!",
            update: "Sản phẩm đổi giá bán, phải cập nhật trên hàng ngàn dòng đơn hàng cũ (dễ gây lệch dữ liệu).",
            delete: "Hủy đơn hàng có thể làm xóa sổ thông tin sản phẩm duy nhất trong kho."
          },
          tables: [
            {
              name: "DonHang_1NF (Khóa chính ghép: MaDH + MaSP)",
              pk: "(MaDH, MaSP)",
              cols: ["MaDH", "NgayDat", "MaKH", "TenKH", "DienThoaiKH", "MaSP", "TenSP", "DonGia", "SoLuong"],
              rows: [
                ["DH01", "2025-03-01", "KH01", "Nguyễn An", "090111222", "SP01", "Sầu Riêng Ri6", 150000, 1],
                ["DH01", "2025-03-01", "KH01", "Nguyễn An", "090111222", "SP02", "Bưởi Da Xanh", 70000, 1],
                ["DH02", "2025-03-02", "KH02", "Trần Bình", "090333444", "SP03", "Táo Envy", 250000, 1],
                ["DH03", "2025-03-05", "KH01", "Nguyễn An", "090111222", "SP01", "Sầu Riêng Ri6", 150000, 1],
                ["DH03", "2025-03-05", "KH01", "Nguyễn An", "090111222", "SP04", "Nho Mẫu Đơn", 850000, 1]
              ]
            }
          ],
          action_taken: "Triệt tiêu Phụ thuộc hàm bộ phận (Partial Dependency) bằng cách tách `SanPham (MaSP, TenSP, DonGia)` thành bảng riêng."
        },
        {
          form: "2NF",
          title: "Dạng Chuẩn 2 (Second Normal Form - 2NF)",
          problems: "Đã đạt 1NF và mọi thuộc tính không khóa đều phụ thuộc toàn bộ vào khóa chính. NHƯNG CÒN PHỤ THUỘC HÀM BẮC CẦU (Transitive Dependency) trong bảng DonHang: `MaDH -> MaKH` và `MaKH -> TenKH, DienThoaiKH`.",
          anomalies: {
            insert: "Không thể thêm thông tin khách hàng tiềm năng nếu họ chưa phát sinh đơn hàng nào.",
            update: "Khách hàng đổi số điện thoại vẫn phải quét toàn bộ bảng DonHang để sửa.",
            delete: "Xóa hết đơn hàng của khách hàng cũng làm mất thông tin liên hệ của khách hàng đó."
          },
          tables: [
            {
              name: "SanPham (Đã tách riêng)",
              pk: "MaSP",
              cols: ["MaSP", "TenSP", "DonGiaGoc"],
              rows: [
                ["SP01", "Sầu Riêng Ri6", 150000],
                ["SP02", "Bưởi Da Xanh", 70000],
                ["SP03", "Táo Envy", 250000],
                ["SP04", "Nho Mẫu Đơn", 850000]
              ]
            },
            {
              name: "ChiTietDonHang",
              pk: "(MaDH, MaSP)",
              cols: ["MaDH", "MaSP", "SoLuong", "DonGiaBan"],
              rows: [
                ["DH01", "SP01", 1, 150000],
                ["DH01", "SP02", 1, 70000],
                ["DH02", "SP03", 1, 250000],
                ["DH03", "SP01", 1, 150000],
                ["DH03", "SP04", 1, 850000]
              ]
            },
            {
              name: "DonHang_2NF (Còn phụ thuộc bắc cầu)",
              pk: "MaDH",
              cols: ["MaDH", "NgayDat", "MaKH", "TenKH", "DienThoaiKH"],
              rows: [
                ["DH01", "2025-03-01", "KH01", "Nguyễn An", "090111222"],
                ["DH02", "2025-03-02", "KH02", "Trần Bình", "090333444"],
                ["DH03", "2025-03-05", "KH01", "Nguyễn An", "090111222"]
              ]
            }
          ],
          action_taken: "Triệt tiêu Phụ thuộc bắc cầu: Tách thông tin khách hàng ra bảng `KhachHang (MaKH, TenKH, DienThoaiKH)`."
        },
        {
          form: "3NF",
          title: "Dạng Chuẩn 3 (Third Normal Form - 3NF)",
          problems: "Đã triệt tiêu hoàn toàn phụ thuộc bộ phận và phụ thuộc bắc cầu. Bảng dữ liệu sạch sẽ, không còn dư thừa dữ liệu chuỗi.",
          anomalies: {
            insert: "Thêm sản phẩm mới hoặc thêm khách hàng mới hoàn toàn độc lập, không cần phụ thuộc vào đơn hàng.",
            update: "Đổi giá sản phẩm hoặc đổi SĐT khách hàng chỉ sửa ĐÚNG 1 DÒNG DUY NHẤT.",
            delete: "Xóa đơn hàng không làm mất thông tin gốc của sản phẩm hay khách hàng."
          },
          tables: [
            {
              name: "KhachHang",
              pk: "MaKH",
              cols: ["MaKH", "TenKH", "DienThoaiKH"],
              rows: [
                ["KH01", "Nguyễn An", "090111222"],
                ["KH02", "Trần Bình", "090333444"]
              ]
            },
            {
              name: "SanPham",
              pk: "MaSP",
              cols: ["MaSP", "TenSP", "DonGiaGoc"],
              rows: [
                ["SP01", "Sầu Riêng Ri6", 150000],
                ["SP02", "Bưởi Da Xanh", 70000],
                ["SP03", "Táo Envy", 250000],
                ["SP04", "Nho Mẫu Đơn", 850000]
              ]
            },
            {
              name: "DonHang",
              pk: "MaDH",
              cols: ["MaDH", "NgayDat", "MaKH (FK)"],
              rows: [
                ["DH01", "2025-03-01", "KH01"],
                ["DH02", "2025-03-02", "KH02"],
                ["DH03", "2025-03-05", "KH01"]
              ]
            },
            {
              name: "ChiTietDonHang",
              pk: "(MaDH, MaSP)",
              cols: ["MaDH (FK)", "MaSP (FK)", "SoLuong", "DonGiaBan"],
              rows: [
                ["DH01", "SP01", 1, 150000],
                ["DH01", "SP02", 1, 70000],
                ["DH02", "SP03", 1, 250000],
                ["DH03", "SP01", 1, 150000],
                ["DH03", "SP04", 1, 850000]
              ]
            }
          ],
          action_taken: "Hệ thống đã đạt chuẩn thực chiến OLTP. Mọi bảng có một chủ đề thực thể riêng biệt."
        },
        {
          form: "BCNF",
          title: "Dạng Chuẩn Boyce-Codd (BCNF - Dạng Chuẩn 3.5)",
          problems: "Xét trường hợp bảng có nhiều khóa ứng viên chồng chéo (Overlapping Candidate Keys): Bảng `PhanCongTuVan (MaSV, ChuyenNganh, MaGV)`. Giả sử 1 GV chỉ phụ trách đúng 1 Chuyên ngành (`MaGV -> ChuyenNganh`), nhưng 1 Chuyên ngành có nhiều GV. Khóa chính là `(MaSV, ChuyenNganh)` -> `MaGV` là định thức nhưng không phải là siêu khóa!",
          anomalies: {
            insert: "Không thể ghi nhận một Giảng viên mới phụ trách Chuyên ngành nếu chưa có Sinh viên nào được phân công.",
            delete: "Xóa sinh viên duy nhất của giảng viên đó làm mất luôn liên kết Giảng viên - Chuyên ngành."
          },
          tables: [
            {
              name: "PhanCongHuongDan_BCNF_1",
              pk: "MaGV",
              cols: ["MaGV", "ChuyenNganh"],
              rows: [
                ["GV01", "Hệ thống thông tin"],
                ["GV02", "Khoa học máy tính"],
                ["GV03", "Hệ thống thông tin"]
              ]
            },
            {
              name: "PhanCongHuongDan_BCNF_2",
              pk: "(MaSV, MaGV)",
              cols: ["MaSV", "MaGV (FK)"],
              rows: [
                ["SV01", "GV01"],
                ["SV02", "GV02"],
                ["SV03", "GV03"]
              ]
            }
          ],
          action_taken: "Tách thành 2 bảng để mọi định thức (Determinant) đều là Siêu khóa (Superkey). Đạt chuẩn BCNF tuyệt đối."
        }
      ]
    },

    /* ======================================================================
       6. PHÒNG THÍ NGHIỆM TẤN CÔNG & PHÒNG THỦ SQL INJECTION
       ====================================================================== */
    injection: {
      title: "Phòng Thí Nghiệm Tấn Công & Phòng Thủ Lỗ Hổng SQL Injection (SQLi Lab)",
      desc: "Trực quan hóa sự khác biệt chết người giữa việc nối chuỗi câu lệnh SQL thủ công (String Concatenation / Dynamic SQL) và việc sử dụng Truy vấn tham số hóa (Parameterized Queries / PreparedStatement / SqlParameter).",
      scenarios: [
        {
          id: "auth_bypass",
          label: "1. Vượt Mặt Đăng Nhập (Authentication Bypass: ' OR '1'='1)",
          title: "Khai thác logic biểu thức luôn đúng để đăng nhập trái phép không cần mật khẩu",
          username_input: "admin' OR '1'='1' --",
          password_input: "matkhau_sai_hoantoan",
          raw_concat_sql: "SELECT * FROM Users WHERE Username = 'admin' OR '1'='1' --' AND PasswordHash = '...';",
          prepared_sql: "SELECT * FROM Users WHERE Username = @Username AND PasswordHash = @PasswordHash;",
          param_bindings: {
            "@Username": "admin' OR '1'='1' --",
            "@PasswordHash": "matkhau_sai_hoantoan"
          },
          concat_outcome: "🚨 THẤT THỦ NGUY CẤP! Dấu nháy đơn (') ngắt chuỗi văn bản, mệnh đề 'OR 1=1' làm toàn bộ biểu thức WHERE luôn trả về TRUE, ký tự gạch ngang đôi (--) biến phần kiểm tra mật khẩu thành chú thích. Kẻ tấn công đăng nhập thẳng vào tài khoản Quản Trị Viên (Admin)!",
          prepared_outcome: "🛡️ PHÒNG THỦ TUYỆT ĐỐI! Database Engine coi toàn bộ chuỗi 'admin\\' OR \\'1\\'=\\'1\\' --' chỉ là giá trị chuỗi thuần túy của một cột. Không thể tìm thấy username nào có tên kỳ lạ như vậy -> Trả về 0 dòng -> Đăng nhập thất bại an toàn.",
          explanation: "Parameterized Queries tách biệt hoàn toàn giữa CÚ PHÁP LỆNH (được biên dịch trước thành cây thực thi AST) và DỮ LIỆU ĐẦU VÀO (được truyền riêng trong bộ nhớ). Đầu vào của người dùng dù có chứa nháy đơn hay từ khóa SQL cũng không bao giờ có thể can thiệp vào logic cú pháp.",
          backend_fix_code: "// Java (Spring Data JPA / JDBC Prepared Statement):\nString sql = \"SELECT u FROM User u WHERE u.username = :username AND u.passwordHash = :hash\";\nTypedQuery<User> q = em.createQuery(sql, User.class);\nq.setParameter(\"username\", inputUsername);\nq.setParameter(\"hash\", hashedPass);\n\n// C# (.NET Dapper / EF Core):\nvar user = await connection.QueryFirstOrDefaultAsync<User>(\n    \"SELECT * FROM Users WHERE Username = @u AND PasswordHash = @p\",\n    new { u = inputUsername, p = hashedPass }\n);"
        },
        {
          id: "union_extract",
          label: "2. Trích Xuất Dữ Liệu Trái Phép (UNION-Based SQLi)",
          title: "Ghép thêm câu lệnh SELECT thứ 2 để trích xuất mật khẩu bảng Admins ra màn hình tìm kiếm",
          username_input: "' UNION SELECT 1, Username || ':' || PasswordHash, 'Leaked' FROM Admins --",
          password_input: "anything",
          raw_concat_sql: "SELECT ProductID, ProductName, Price FROM Products WHERE ProductName LIKE '%' UNION SELECT 1, Username || ':' || PasswordHash, 'Leaked' FROM Admins --%';",
          prepared_sql: "SELECT ProductID, ProductName, Price FROM Products WHERE ProductName LIKE @Keyword;",
          param_bindings: {
            "@Keyword": "%' UNION SELECT 1, Username || ':' || PasswordHash, 'Leaked' FROM Admins --%"
          },
          concat_outcome: "🚨 LỘ TOÀN BỘ DATABASE! Kẻ tấn công dùng UNION ghép thêm tập kết quả từ bảng Admins vào danh sách sản phẩm hiển thị trên web. Hàng ngàn mã băm mật khẩu quản trị viên xuất hiện công khai trên giao diện người dùng!",
          prepared_outcome: "🛡️ BẢO MẬT AN TOÀN! Tham số @Keyword tìm kiếm chính xác các sản phẩm có chứa chuỗi ký tự 'UNION SELECT...'. Không có sản phẩm nào khớp -> Trả về danh sách rỗng.",
          explanation: "Trong tấn công UNION Injection, kẻ tấn công phải dò số lượng cột và kiểu dữ liệu tương thích của câu truy vấn gốc để ghép bảng nhạy cảm vào. Parameterized Queries ngăn chặn điều này ngay từ trứng nước.",
          backend_fix_code: "// C# EF Core (Dùng LINQ an toàn 100% sinh ra Parameterized SQL):\nvar products = await dbContext.Products\n    .Where(p => p.ProductName.Contains(inputKeyword))\n    .ToListAsync();"
        },
        {
          id: "stacked_drop",
          label: "3. Tấn Công Xóa Sổ Dữ Liệu (Stacked Queries: '; DROP TABLE...)",
          title: "Chèn dấu chấm phẩy để thực thi lệnh DDL phá hủy cấu trúc cơ sở dữ liệu",
          username_input: "hacker'; DROP TABLE SinhVien; --",
          password_input: "nopass",
          raw_concat_sql: "SELECT * FROM Accounts WHERE Username = 'hacker'; DROP TABLE SinhVien; --';",
          prepared_sql: "SELECT * FROM Accounts WHERE Username = @User;",
          param_bindings: {
            "@User": "hacker'; DROP TABLE SinhVien; --"
          },
          concat_outcome: "💥 THẢM HỌA DỮ LIỆU! Trong SQL Server (khi gọi qua SqlCommand mà không dùng Parameter) hoặc PostgreSQL, dấu chấm phẩy (;) cho phép kết thúc lệnh SELECT và chạy ngay lệnh thứ hai là `DROP TABLE SinhVien`. Toàn bộ bảng SinhVien bị xóa sổ vĩnh viễn khỏi máy chủ!",
          prepared_outcome: "🛡️ BẢO VỆ VỮNG CHẮC! Ký tự chấm phẩy chỉ được coi là một ký tự trong chuỗi tên tài khoản. Bảng SinhVien hoàn toàn an toàn.",
          explanation: "Ngoài việc sử dụng Parameter, hệ thống Backend cần tuân thủ Nguyên tắc Đặc quyền Tối thiểu (Principle of Least Privilege): Tài khoản kết nối CSDL của ứng dụng web chỉ nên có quyền SELECT, INSERT, UPDATE, DELETE; tuyệt đối KHÔNG cấp quyền DDL (DROP, ALTER, CREATE) cho người dùng web bình thường.",
          backend_fix_code: "-- Phân quyền an toàn trong SQL Server:\nCREATE ROLE WebAppRole;\nGRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO WebAppRole;\n-- KHÔNG BAO GIỜ gán vai trò 'db_owner' hay 'sysadmin' cho Web Application!"
        },
        {
          id: "single_quote_legit",
          label: "4. [LỖI NGHIỆP VỤ] Người Dùng Nhập Tên Có Dấu Nháy: O'Reilly / D'Souza",
          title: "Nối chuỗi bị sập ứng dụng (HTTP 500) ngay cả khi không bị tấn công",
          username_input: "O'Reilly",
          password_input: "ValidPass123",
          raw_concat_sql: "SELECT * FROM Customers WHERE CustomerName = 'O'Reilly' AND Password = '...';",
          prepared_sql: "SELECT * FROM Customers WHERE CustomerName = @Name AND Password = @Pass;",
          param_bindings: {
            "@Name": "O'Reilly",
            "@Pass": "ValidPass123"
          },
          concat_outcome: "❌ SẬP HỆ THỐNG / LỖI CÚ PHÁP 500: Dấu nháy đơn trong họ tên 'O'Reilly' làm đóng chuỗi sớm, từ 'Reilly' trở thành từ khóa lạ lẫm không đúng cú pháp SQL. SQL Server báo lỗi: `Msg 105, Level 15: Unclosed quotation mark after the character string`. Khách hàng không thể đăng ký hay đăng nhập!",
          prepared_outcome: "✅ XỬ LÝ MƯỢT MÀ! Dấu nháy đơn được truyền nguyên vẹn vào cột, khách hàng mang họ O'Reilly, D'Souza, hoặc địa chỉ như 15/4B đường Ba Tháng Hai đăng ký tài khoản thành công 100%.",
          explanation: "Lập trình viên thiếu kinh nghiệm thường cố gắng viết hàm `replace(\"'\", \"\")` để chống SQL Injection, dẫn tới việc làm hỏng dữ liệu người dùng thật. Dùng Parameter giải quyết triệt để cả bài toán Bảo mật lẫn bài toán Toàn vẹn nghiệp vụ.",
          backend_fix_code: "// Java PreparedStatement tự động xử lý dấu nháy an toàn:\nPreparedStatement ps = conn.prepareStatement(\"SELECT * FROM Customers WHERE CustomerName = ?\");\nps.setString(1, \"O'Reilly\"); // An toàn tuyệt đối, không cần replace nháy đơn!"
        }
      ]
    }
  };

  // Đăng ký toàn bộ 6 bộ mô phỏng vào Core Registry
  if (global.BiKipRegistry && typeof global.BiKipRegistry.setSimulators === "function") {
    global.BiKipRegistry.setSimulators(SIMULATORS);
  } else if (global.BIKIP_REGISTRY) {
    global.BIKIP_REGISTRY.simulators = SIMULATORS;
  }
})(typeof window !== "undefined" ? window : global);
