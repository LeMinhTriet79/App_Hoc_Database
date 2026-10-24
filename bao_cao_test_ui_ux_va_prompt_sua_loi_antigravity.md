# BÁO CÁO KIỂM THỬ GIAO DIỆN, TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX QA AUDIT) & SIÊU PROMPT SỬA LỖI TOÀN DIỆN CHO ANTIGRAVITY

> **Dự án kiểm thử:** `BiKipCoSoDuLieu_Java_DotNet_v2005.chm` (`App_CSDL`)  
> **Vai trò thực hiện:** Người dùng thực tế (End-User) kiêm Kỹ sư Kiểm thử Phần mềm & Thiết kế Trải nghiệm (Senior QA & Retro UI/UX Tester)  
> **Mục tiêu tài liệu:** Chỉ rõ từng lỗi cụ thể về **cách bấm, điều hướng nhảy trang, luồng tương tác và độ đồng bộ giao diện hoài niệm Windows 98 / MSDN HTML Help (.CHM) năm 2000**, kèm theo **Master Prompt & Code Patch chuẩn xác từng dòng** để giao cho AI Agent **Antigravity** sửa dứt điểm 100%.

## MỤC LỤC TÀI LIỆU

1. **PHẦN 1 — ĐÁNH GIÁ TỔNG QUAN TỪ GÓC NHÌN NGƯỜI DÙNG THỰC TẾ:** Giải mã cảm giác *"sao sao đấy, không giống một trang web hoàn chỉnh và chưa đồng bộ chuẩn hoài niệm"*.
2. **PHẦN 2 — BẢNG KIỂM TOÁN 15 LỖI UI/UX, ĐIỀU HƯỚNG & GIAO DIỆN (CÓ VỊ TRÍ DÒNG CODE CHÍNH XÁC):** Phân tích chi tiết từng lỗi bấm không ăn, không nhảy trang, kẹt CSDL trong Lab, vỡ bố cục và lệch màu Theme.
3. **PHẦN 3 — TIÊU CHUẨN THIẾT KẾ "HOÀI NIỆM MSDN .CHM & IE 5.5 HOÀN HẢO" (RETRO DESIGN SYSTEM SPEC):** Quy chuẩn hóa 100% khung cửa sổ, thanh công cụ, biểu tượng pixel, cây mục lục và trang đọc bài.
4. **PHẦN 4 — MASTER PROMPT & BỘ CODE PATCH ĐẦY ĐỦ DÀNH CHO ANTIGRAVITY (COPY & PASTE TRỰC TIẾP):** Khối lệnh thực thi tuần tự từ **TASK 01 đến TASK 08** kèm mã nguồn thay thế hoàn chỉnh cho `src/ui/app-engine.js`, `assets/css/retro-98-browser.css`, `assets/css/layout.css`, `assets/css/components.css` và `index.html`.

## PHẦN 1: ĐÁNH GIÁ TỔNG QUAN TỪ GÓC NHÌN NGƯỜI DÙNG THỰC TẾ

Khi trực tiếp mở ứng dụng lên dùng thử, bấm qua lại giữa **Trang chủ Mục lục**, **16 Chương bài học**, **Phòng Lab SQL**, **130 Bài FruitStore**, **6 Bộ Mô Phỏng** và **Phòng Phỏng Vấn**, cảm giác *"nó sao sao đấy, không giống một trang web hoàn chỉnh và giao diện chưa đồng bộ chuẩn hoài niệm"* xuất phát từ **3 căn bệnh cốt lõi** sau đây:

### 1.1. Đứt gãy luồng điều hướng (Broken Navigation Flow) — Bấm nhưng không nhảy trang!
- **Hiện tượng tiêu biểu nhất (đúng như phản ánh thực tế):** Khi đang ở **Phòng Thực Hành SQL (`lab`)** (hoặc đang ở **Trang chủ `toc`**, **6 Bộ mô phỏng `simulators`**, **130 Bài FruitStore `fruitstore130`**), người dùng nhìn sang Cây mục lục bên trái (`#toc-tree-container`), mở một chương ra và bấm vào một mục nhỏ (ví dụ: *1. Mục tiêu & Dấu hiệu*, *4. Cú pháp & Ví dụ*, *10. Bài tập tự chấm*) thì **màn hình bên phải ĐỨNG IM HOÀN TOÀN, không chuyển từ Phòng Lab sang trang Chương đó**!
- **Nguy hiểm hơn:** Kể cả khi đang đọc **Chương 1**, nếu người dùng mở nhánh **Chương 5** ở cột trái rồi bấm vào mục *4. Cú pháp & Ví dụ* của Chương 5, ứng dụng lại **cuộn tới mục 4 của Chương 1** chứ không chuyển sang Chương 5!
- **Không giống một trang web thực thụ:** Khi bấm nút **Back / Forward của trình duyệt Chrome/Edge** (hoặc nút Back trên chuột), trang web không lùi về trang vừa xem mà nhảy loạn theo các dấu `#` vô nghĩa trên URL. Gõ địa chỉ hoặc bấm Refresh (`F5`) làm mất vị trí đang đọc.

### 1.2. Các nút bấm bị liệt hoặc "bẫy" trạng thái người dùng (State Trap Bugs)
- Ở **Trang Chủ Mục Lục**, dưới chân 7 sơ đồ CSDL mẫu có 7 nút **`📋 Xem Schema DDL`** rất bắt mắt, nhưng **bấm vào cả 7 nút đều liệt hoàn toàn (không có chuyện gì xảy ra)** vì trong `app-engine.js` quên viết hàm bắt sự kiện cho thuộc tính `data-open-schema-modal`!
- Ở **Phòng Lab SQL**, khi người dùng đã mở Lab một lần, biến toàn cục `window._CURRENT_LAB_PROBLEM` bị dính cứng vào bài tập số 1 của CSDL `truonghoc`. Từ lúc đó trở đi, dù người dùng có chọn Dropdown đổi sang CSDL `FruitStore`, `ShopOnline` hay bấm nút *"🧪 Mở CSDL Này Trong Lab"* từ Trang chủ, hàm `renderLabView()` luôn tự động gọi lại `loadProblemIntoLab()` của bài cũ và **ép ngược CSDL quay về `truonghoc`**! Người dùng không tài nào chuyển sang CSDL khác để tự gõ câu lệnh SQL tự do (Sandbox Mode) được.

### 1.3. Giao diện "Nửa Nạc Nửa Mỡ" (Mixed Modern Flat UI vs. Retro 98.css)
- **Đánh nhau giữa 4 file CSS:** Dự án nạp thư viện `98.css` (phong cách khối nổi 3D vát cạnh Bevel của Windows 98), nhưng bên trong vùng đọc bài (`#reading-pane`), hai file `layout.css` và `components.css` cũ lại định kiểu các thẻ bài học (`.section-card`, `.ch-banner`, `.example-box`, `.badge-chuan`) theo **phong cách Web Phẳng (Flat UI năm 2020)** với viền mảnh 1px, vạch màu trái 5px kiểu Notion và nhãn bo góc phẳng.
- **Lạm dụng Emoji màu hiện đại của Windows 11 / macOS:** Khắp thanh Menu Bar, Toolbar và Cây mục lục `.CHM` lại gắn đầy Emoji màu bóng bẩy (`🍎`, `🧪`, `🟣`, `🔄`, `🏠`, `🚀`, `🔥`), làm mất đi cái hồn cổ điển, sắc nét của phần mềm **Microsoft HTML Help (`hh.exe`)** và **Internet Explorer 5.5** đầu những năm 2000.
- **Vỡ bố cục Header & Mù chữ khi đổi Theme:** Thanh Menu + Toolbar + Address Bar có quá nhiều nút chữ dài nên bị rớt dòng thành 2–3 tầng, chiếm mất gần 1/4 màn hình. Khi chuyển sang giao diện hoài niệm **Borland Turbo C++ (nền xanh chữ vàng)**, các hộp bài tập FruitStore bị gán cứng nền vàng nhạt `#fffbe6` khiến **chữ màu vàng nằm trên nền màu vàng — không thể đọc nổi!**

## PHẦN 2: BẢNG KIỂM TOÁN CHI TIẾT 15 LỖI UI/UX, ĐIỀU HƯỚNG & GIAO DIỆN

Bảng dưới đây liệt kê toàn bộ 15 lỗi đã được kiểm chứng trực tiếp trên mã nguồn hiện tại trong thư mục dự án:

| Mã Lỗi | Mức Độ | File & Vị Trí Dòng Lỗi | Hiện Tượng Lỗi Khi Người Dùng Thao Tác | Nguyên Nhân Gốc Rễ Trong Code (Root Cause) |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | **Nghiêm trọng (Blocker)** | `src/ui/app-engine.js` (Dòng 553–572 & 3016–3030) | Đang ở **Phòng Lab (`lab`)**, **Trang chủ (`toc`)**, **Simulators**, **Interview**, **130 Bài FruitStore**, hoặc đang ở **Chương khác**, bấm vào **mục nhỏ (1..11) trong Chương ở cột Mục lục bên trái** thì **không nhảy trang** (hoặc cuộn nhầm trong chương cũ). | Các thẻ `<a data-scroll-sec="sec-...">` trong `renderLeftTocTree()` không lưu `data-parent-ch="chXX"`. Sự kiện click `[data-scroll-sec]` (dòng 3017) chỉ gọi `document.getElementById(secId).scrollIntoView()` trên màn hình hiện tại mà **không kiểm tra xem có đang ở đúng chương đó không** để gọi `navigateTo("chapter", targetCh, false, secId)` trước khi cuộn! |
| **BUG-02** | **Cao (High)** | `src/ui/app-engine.js` (Dòng 553 & 2976–2982) | Bấm vào tên Chương trên Cây Mục Lục Trái (`<summary><a data-nav-ch="ch01">`) không thể đóng/mở nhánh mục con như cây thư mục thật, hoặc bấm vào dấu `[+]` chỉ xổ nhánh mà không đồng bộ trạng thái. | Thẻ `<a data-nav-ch="...">` nằm lồng trong `<summary>`. Khi click vào `<a>`, lệnh `e.preventDefault()` ở dòng 2978 **chặn đứng hành vi đóng/mở `<details>` mặc định của trình duyệt**. Ngoài ra thẻ `<a>` có `display: inline-block` làm tên chương dài bị rớt xuống dưới dấu `[+]`. |
| **BUG-03** | **Nghiêm trọng (Blocker)** | `src/ui/app-engine.js` (Dòng 1782, 1868, 1882 & 3514) | Trong **Phòng Lab SQL**, người dùng chọn Dropdown đổi sang CSDL khác (VD: `FruitStore`, `ShopOnline`) hoặc bấm *"🧪 Mở CSDL Này Trong Lab"* từ Trang chủ, nhưng **CSDL lập tức bị giật ngược về `truonghoc`** (CSDL của bài tập đầu tiên)! | Trong `renderLabView(dbId, problemId)`, dòng 1782 gán `currentProblem = window._CURRENT_LAB_PROBLEM \|\| allProbs[0]`. Ngay sau đó dòng 1869 gọi `loadProblemIntoLab(currentProblem.id)`, và dòng 1882 thấy `problem.db !== state.activeDbId` nên **ghi đè `state.activeDbId = problem.db`**, ép CSDL quay lại bài cũ! |
| **BUG-04** | **Cao (High)** | `src/ui/app-engine.js` (Dòng 806 & 2962–3365) | Ở **Trang Chủ Mục Lục**, bấm vào nút **`📋 Xem Schema DDL`** của bất kỳ CSDL nào trong 7 CSDL mẫu đều **vô tác dụng 100%**. | Dòng 806 tạo nút `<button data-open-schema-modal="dbId">`, nhưng trong toàn bộ hàm `setupEventListeners()` **không hề có lệnh `target.closest("[data-open-schema-modal]")`** để gọi `showDbSchemaModal(dbId)`! |
| **BUG-05** | **Cao (High)** | `src/ui/app-engine.js` (Dòng 3033–3045 & 1868) | Trong bài học Chương 1–15, khi bấm nút **`🧪 Đẩy vào SQL Lab`** ở một Ví dụ (`[data-push-lab-sql]`), sang Phòng Lab vẫn hiện đề bài của một bài tập không liên quan ở cột bên trái, gây rối trí. | Khi đẩy một câu lệnh Ví dụ sang Lab để chạy thử (chế độ Sandbox tự do), code không xóa `window._CURRENT_LAB_PROBLEM = null` mà vẫn nạp bài tập cũ ở cột trái. |
| **BUG-06** | **Cao (High)** | `src/ui/app-engine.js` (Dòng 2838–2888 & 3421–3442) | Ứng dụng không có cảm giác là một trang web thực thụ: Bấm nút **Back / Forward của trình duyệt web** bị nhảy loạn; gõ URL `fruitstore-130-drills.htm` vào thanh `Address` bấm `Go` bị văng về Trang chủ; F5 làm mất mục đang đọc. | Chưa đồng bộ trạng thái điều hướng với `window.location.hash` (ví dụ `#/chapter/ch03/sec-examples`, `#/lab/fruitstore`) và chưa bắt sự kiện `hashchange`. Hàm `handleGo` của thanh Address Bar (dòng 3421) bỏ sót nhánh `/fruitstore-130-drills`. |
| **BUG-07** | **Cao (High)** | `assets/css/layout.css`, `components.css` & `retro-98-browser.css` | Giao diện thiếu tính đồng bộ hoài niệm: Khung ngoài là Windows 98 3D, nhưng nội dung bên trong `#reading-pane` lại là các thẻ phẳng hiện đại (`.section-card` viền đơn 1px, `.ch-banner` vạch trái 5px kiểu Notion). | `components.css` dùng kiến trúc Flat Card hiện đại thay vì định kiểu trang tài liệu theo chuẩn **MSDN Library 2000 / Windows 2000 Classic Help Document** (khung tiêu đề 3D vát cạnh, bảng viền chìm Sunken, hộp GroupBox chuẩn, thanh tiêu đề mục có vạch 3D Etched Groove). |
| **BUG-08** | **Trung bình (Medium)** | `index.html` (Dòng 42–123) & `src/ui/app-engine.js` | Quá nhiều **Emoji hiện đại bóng bẩy (`🍎`, `🧪`, `🟣`, `🔄`, `🏠`, `🖨️`, `🗀`)** trên thanh Menu, Toolbar và Cây mục lục, làm giảm mạnh chất hoài niệm thập niên 2000. | Dùng ký tự Unicode Emoji của hệ điều hành hiện đại thay vì dùng các **Biểu tượng Pixel 16×16 cổ điển (Inline SVG Pixel Icons)** chuẩn Windows 98 / MSDN CHM (quyển sách vàng/tím, tờ giấy `?`, thư mục vàng, mũi tên xanh IE5). |
| **BUG-09** | **Cao (High)** | `assets/css/layout.css` (Dòng 268–290) & `retro-98-browser.css` (Dòng 385–398) | 3 Tab cột trái (`Nội dung \| Chỉ mục \| Tìm kiếm`) bị **viền kép (Double Border)** thô kệch; chữ trong tab có màu link xanh hoặc lệch tâm; bấm vào rìa tab đôi khi không ăn. | `.left-tab` trong `layout.css` gán `border: 1px solid ...` xung đột trực tiếp với `box-shadow` tạo gờ nổi 3D của `menu[role="tablist"] li[role="tab"]` trong thư viện `98.css`. |
| **BUG-10** | **Cao (High)** | `index.html` (Dòng 40–124) & `retro-98-browser.css` (Dòng 91–354) | Trên màn hình Laptop (1280px–1440px), thanh `Menu Bar`, `Toolbar` và `Address Bar` bị **rớt dòng thành 2–3 tầng**, chiếm mất gần 200px chiều cao, làm vùng đọc bài bị bé tí. | Các nút trên `#menu-bar` và `#tool-bar` đặt nhãn quá dài và bật `flex-wrap: wrap` không kiểm soát, khiến thanh công cụ bị phình to theo chiều dọc. |
| **BUG-11** | **Trung bình (Medium)** | `index.html` (Dòng 127–162) & `retro-98-browser.css` | Cột mục lục bên trái (`#left-pane`) bị khóa cứng độ rộng `310px`, người dùng không thể dùng chuột kéo rộng ra (để đọc tên chương dài) hoặc thu hẹp lại như phần mềm `.CHM` thật. | Thiếu thanh chia cột **`#pane-splitter` (3D Vertical Splitter Bar)** có sự kiện kéo chuột (`mousedown` / `mousemove` / `mouseup`) giữa `#left-pane` và `#reading-pane`. |
| **BUG-12** | **Nghiêm trọng (High)** | `src/ui/app-engine.js` (Dòng 1262, 1344, 1398) & `retro-98-browser.css` (Dòng 1142) | Khi chuyển sang **Theme Borland Turbo C++** hoặc **Green Phosphor CRT**, các hộp *"Khuôn mẫu phản xạ"* và bài tập đã giải trong **130 Bài FruitStore** bị **chữ vàng nằm trên nền vàng trắng (`#fffbe6` / `#f6fff6`), mù chữ hoàn toàn!** | Gán cứng mã màu sáng `background:#fffbe6; border:1px solid #d4b106` và `background:#f6fff6` trong inline style thay vì sử dụng biến màu động `var(--warn-bg)`, `var(--warn-border)` và `var(--accent-soft)` của `themes.css`. |
| **BUG-13** | **Trung bình (Medium)** | `src/ui/app-engine.js` (Dòng 491–505) | Thanh tiến độ trên góc phải Menu Bar hiển thị sai lệch kiểu: **`Tiến độ: 100% (115/77)`** (tử số lớn hơn cả mẫu số!). | Hàm `updateOverallProgress()` lấy mẫu số cố định là `77`, trong khi `state.completedItems` lưu cả 77 bài Lab gốc + 130 bài FruitStore + 15 checkbox hoàn thành chương (tổng cộng **222 mục**). |
| **BUG-14** | **Cao (High)** | `src/ui/app-engine.js` (Dòng 668, 731–740, 3893–3895) | Khi mở hộp thoại **`📋 Xem Schema DDL`** hoặc dùng **Tìm kiếm toàn văn**, các đoạn code SQL có dấu `<` hoặc `>` (như `WHERE Diem >= 5 AND Diem <= 10`) bị trình duyệt cắt mất chữ vì tưởng là thẻ HTML! | Hàm `showDbSchemaModal()` và `runFulltextSearch()` nối trực tiếp chuỗi `dbMeta.schema_sql`, `dbMeta.seed_sql`, `q` vào `innerHTML` mà **quên bọc qua hàm `escapeHtml()`**. |
| **BUG-15** | **Trung bình (Medium)** | `src/ui/app-engine.js` (Dòng 228–481 & 1460–1715) | File `app-engine.js` bị lặp lại y hệt 3 hàm lớn (`normalizeVal`, `getAll77LabProblems`, `gradeSqlProblem`) ở 2 nơi khác nhau (tốn 290 dòng code thừa), gây nguy cơ sửa chỗ này nhưng hàm ở dưới lại đè mất! | Lỗi ghép file trong quá trình tích hợp trước đó khiến khối hàm chấm điểm bị định nghĩa 2 lần trong cùng một IIFE. |

## PHẦN 3: TIÊU CHUẨN THIẾT KẾ "HOÀI NIỆM MSDN .CHM & IE 5.5 HOÀN HẢO"

Để ứng dụng thực sự lột xác thành một **tác phẩm phần mềm hoài niệm thập niên 2000 hoàn hảo, đồng bộ từ đầu đến chân**, Antigravity cần áp dụng 5 quy chuẩn thị giác và tương tác sau:

1. **Chuẩn Hóa Hệ Thống Biểu Tượng Pixel 16×16 (Zero Modern Emoji trên Chrome Shell):**
   - Thay thế các Emoji lòe loẹt trên Title Bar, Toolbar, Address Bar và Cây Mục Lục bằng **Bộ Icon Pixel Retro 16×16 (Inline SVG sắc nét theo phong cách Windows 98 / HTML Help)**:
     - Icon `.CHM` trên Title Bar: Biểu tượng cuốn sách vàng có dấu `?` pixel cổ điển.
     - Cây thư mục (`#toc-tree-container`): Các nhóm phần học dùng icon **Quyển sách đóng/mở (`📘` -> SVG Book Icon)**; các chương dùng icon **Trang tài liệu CHM có chữ**; các mục con (1..11) dùng icon **Trang neo nhỏ (`§`)** giống hệt trình đọc `hh.exe` của Microsoft.
2. **Đồng Bộ Hóa 100% Khung Nội Dung Theo Phong Cách "MSDN Library 2000 Classic":**
   - Bỏ kiểu thẻ phẳng hiện đại. Mọi `.section-card` trong bài học phải có khung viền 3D Etched / Raised nhẹ nhàng chuẩn Windows 2000, tiêu đề `<h2>` có dải nền chuyển sắc nhẹ hoặc thanh gạch chân đôi kiểu tài liệu kỹ thuật MSDN năm 2003–2005.
   - Mọi bảng dữ liệu, khung code SQL (`pre.code-block`), khung sơ đồ ER (`.er-box`) đều phải nằm trong khung chìm 3D (`border: 2px inset` chuẩn `sunken-panel`) để tạo chiều sâu thị giác đồng nhất với vỏ trình duyệt bên ngoài.
3. **Cơ Chế Điều Hướng "Đa Chiều Mượt Mà" (Universal Deep-Link Navigation):**
   - Bất kể người dùng đang ở đâu (**Phòng Lab**, **Trang chủ**, **6 Bộ mô phỏng**, **Phỏng vấn**, **130 Bài FruitStore**, **Sổ tay**, **Phụ lục**), hễ bấm vào:
     - **Tên một Chương** ở cột trái -> Chuyển ngay sang trang Chương đó, cuộn lên đầu chương, mở nhánh mục con của chương đó trên cây mục lục và tô sáng (`active`) đúng tên chương.
     - **Một Mục nhỏ (Mục 1..11, Từ điển 64 thẻ, hoặc 10 Bài FruitStore)** của bất kỳ chương nào ở cột trái -> Nếu chưa ở chương đó thì **tự động chuyển sang đúng Chương đó trước**, sau đó **cuộn mượt (`scrollIntoView`) tới đúng mục nhỏ vừa bấm**, đồng thời tô sáng (`active`) mục nhỏ đó trên cây mục lục và cập nhật URL Hash (`#/chapter/ch03/sec-examples`)!
4. **Chế Độ Kép Trong Phòng Lab SQL (Guided Exercise Mode vs. Free Sandbox Mode):**
   - Tách bạch rõ 2 chế độ trong Phòng Lab:
     - **Chế độ Giải Bài Tập (Guided Mode):** Khi chọn 1 bài tập từ Dropdown hoặc bấm *"Làm & Chấm điểm trong Lab"*, tự động chọn đúng CSDL của bài đó và hiện đề bài ở cột trái.
     - **Chế độ Thực Hành Tự Do (Free Sandbox Mode):** Khi người dùng chủ động đổi Dropdown **`CSDL:`** sang một CSDL khác (hoặc bấm *"🧪 Mở CSDL Này Trong Lab"* từ Trang chủ, hoặc bấm *"🧪 Đẩy vào SQL Lab"* từ một Ví dụ lý thuyết), ứng dụng phải **giữ nguyên CSDL người dùng vừa chọn**, chuyển khung bên trái sang hiển thị **Thông tin tổng quan & Danh sách các bảng của CSDL đó** (hoặc giữ câu lệnh Ví dụ vừa đẩy sang) chứ tuyệt đối không được ép nhảy ngược về CSDL của bài tập cũ!
5. **Thanh Kéo Chia Cột 3D (`#pane-splitter`) & Thanh Công Cụ Gọn Gàng Không Rớt Dòng:**
   - Bổ sung thanh kéo `#pane-splitter` rộng `5px` chuẩn gờ nổi Windows 98 giữa cột trái và khung đọc bài bên phải, cho phép kéo chuột mượt mà từ `200px` đến `520px` (và lưu độ rộng vào `localStorage`).
   - Tinh gọn chiều cao của 4 tầng Header (`Title Bar` + `Menu Bar` + `Toolbar` + `Address Bar`) để không bị vỡ dòng trên màn hình Laptop, dành tối đa diện tích cho khung đọc bài và khung Lab SQL.

## PHẦN 4: MASTER PROMPT & BỘ CODE PATCH ĐẦY ĐỦ DÀNH CHO ANTIGRAVITY

Em hãy **copy nguyên vẹn toàn bộ khối nội dung trong phần dưới đây** (hoặc đính kèm trực tiếp file `.md` này vào khung chat của **Antigravity**) và ra lệnh cho nó thực thi:

```markdown
# ROLE & MISSION DÀNH CHO AI AGENT ANTIGRAVITY
Bạn là Principal Frontend Architect & Retro UI/UX Specialist. Nhiệm vụ của bạn là thực hiện đợt **Đại Tu Giao Diện Hoài Niệm (Retro 98.css / MSDN 2000 Polish) & Sửa Dứt Điểm 15 Lỗi Điều Hướng / Tương Tác (UX/Navigation Bugs)** cho dự án `BiKipCoSoDuLieu_Java_DotNet_v2005.chm` (`App_CSDL`).

## QUY TẮC BẮT BUỘC (MANDATORY CONSTRAINTS)
1. **Không làm mất dữ liệu:** Giữ nguyên tuyệt đối 100% nội dung kiến thức của 16 chương (`ch00..ch15`), 7 CSDL mẫu (`db-*.js`), 130 bài tập `fruitstore-130-drills.js`, 6 bộ mô phỏng (`simulators.js`), 48 thẻ phỏng vấn (`interview-bank.js`), 12 bài LeetCode (`leetcode-challenges.js`), 3 nhánh mở rộng (`tracks/*`) và Phụ lục (`appendices.js`).
2. **Sửa triệt để theo đúng 8 Task dưới đây:** Thực hiện tuần tự từ **TASK 01** đến **TASK 08**, không bỏ sót bất kỳ chi tiết nào.

---

### TASK 01: Sửa lỗi bấm vào Mục nhỏ (Sub-section 1..11) ở Cột Trái không nhảy trang khi đang ở Phòng Lab / Trang khác (`src/ui/app-engine.js`)
1. **Trong hàm `renderLeftTocTree()` (khoảng dòng 545–631 của `src/ui/app-engine.js`):**
   - Sửa hàm con `renderChapterTreeItem(chObj)` để **mọi liên kết mục nhỏ (`data-scroll-sec`) đều gắn kèm thuộc tính `data-parent-ch="' + chId + '"`**.
   - Đồng thời thêm thuộc tính `id="tree-det-' + chId + '"' + (state.lastView === "chapter" && state.lastChapterId === chId ? " open" : "")` vào thẻ `<details>` của từng chương để chương đang học tự động xổ nhánh mục con, các chương khác xếp gọn gàng đúng chuẩn phần mềm `.CHM` (không mở bung bét cả 16 chương cùng lúc gây rối mắt).
   - Thay thế hàm `renderLeftTocTree()` bằng đoạn code chuẩn sau:

```javascript
  function renderLeftTocTree() {
    var container = document.getElementById("toc-tree-container");
    if (!container) return;

    // Giữ lại vị trí cuộn của cây mục lục để không bị giật lên đầu khi render lại
    var prevScrollTop = container.scrollTop;

    function renderChapterTreeItem(chObj) {
      if (!chObj) return "";
      var chId = chObj.id;
      var chCode = chObj.code || chId;
      var isCurrentCh = (state.lastView === "chapter" && state.lastChapterId === chId);
      var openAttr = isCurrentCh ? " open" : "";
      var activeCls = isCurrentCh && !state.lastScrollSec ? " active" : "";

      var html = '<li><details id="tree-det-' + chId + '"' + openAttr + '>' +
        '<summary><a href="#/chapter/' + chId + '" class="tree-item-link' + activeCls + '" data-nav-ch="' + chId + '">📄 ' + escapeHtml(chCode + ': ' + chObj.title) + '</a></summary><ul>';
      html += '<li><a href="#/chapter/' + chId + '/sec-goals" class="tree-item-link" data-parent-ch="' + chId + '" data-scroll-sec="sec-goals">§1. Mục tiêu &amp; Dấu hiệu</a></li>';
      html += '<li><a href="#/chapter/' + chId + '/sec-theory" class="tree-item-link" data-parent-ch="' + chId + '" data-scroll-sec="sec-theory">§2. Lý thuyết nền tảng</a></li>';
      html += '<li><a href="#/chapter/' + chId + '/sec-mechanism" class="tree-item-link" data-parent-ch="' + chId + '" data-scroll-sec="sec-mechanism">§3. Cơ chế chạy tay</a></li>';
      if (chId === "ch15") {
        html += '<li><a href="#/chapter/ch15/sec-keyword-cards" class="tree-item-link" data-parent-ch="ch15" data-scroll-sec="sec-keyword-cards">§3B. Từ điển 64 thẻ T-SQL</a></li>';
      }
      html += '<li><a href="#/chapter/' + chId + '/sec-examples" class="tree-item-link" data-parent-ch="' + chId + '" data-scroll-sec="sec-examples">§4. Cú pháp &amp; Ví dụ (' + (chObj.examples ? chObj.examples.length : 0) + ')</a></li>';
      html += '<li><a href="#/chapter/' + chId + '/sec-dialects" class="tree-item-link" data-parent-ch="' + chId + '" data-scroll-sec="sec-dialects">§5. Khác biệt phương ngữ</a></li>';
      html += '<li><a href="#/chapter/' + chId + '/sec-bridge" class="tree-item-link" data-parent-ch="' + chId + '" data-scroll-sec="sec-bridge">§6. Cầu nối Java &amp; C#</a></li>';
      html += '<li><a href="#/chapter/' + chId + '/sec-perf" class="tree-item-link" data-parent-ch="' + chId + '" data-scroll-sec="sec-perf">§7. Hiệu năng &amp; Chi phí</a></li>';
      html += '<li><a href="#/chapter/' + chId + '/sec-errors" class="tree-item-link" data-parent-ch="' + chId + '" data-scroll-sec="sec-errors">§8. Lỗi hay gặp (' + (chObj.common_errors ? chObj.common_errors.length : 0) + ')</a></li>';
      html += '<li><a href="#/chapter/' + chId + '/sec-interview" class="tree-item-link" data-parent-ch="' + chId + '" data-scroll-sec="sec-interview">§9. Câu hỏi phỏng vấn (' + (chObj.interview ? chObj.interview.length : 0) + ')</a></li>';
      var probCount = (chObj.basics ? chObj.basics.length : 0) + (chObj.practice ? chObj.practice.length : 0);
      html += '<li><a href="#/chapter/' + chId + '/sec-exercises" class="tree-item-link" data-parent-ch="' + chId + '" data-scroll-sec="sec-exercises">§10. Bài tập tự chấm (' + probCount + ')</a></li>';
      if (chObj.fruitstoreDrills && chObj.fruitstoreDrills.length) {
        html += '<li><a href="#/chapter/' + chId + '/sec-fruitstore-drills" class="tree-item-link" data-parent-ch="' + chId + '" data-scroll-sec="sec-fruitstore-drills">§10B. 10 Bài Phản Xạ FruitStore</a></li>';
      }
      html += '<li><a href="#/chapter/' + chId + '/sec-summary" class="tree-item-link" data-parent-ch="' + chId + '" data-scroll-sec="sec-summary">§11. Tổng kết &amp; Trắc nghiệm</a></li>';
      html += '</ul></details></li>';
      return html;
    }

    var html = '';
    html += '<li><a href="#/toc" class="tree-item-link ' + (state.lastView === "toc" ? "active" : "") + '" data-nav-view="toc">📁 Bảng Mục Lục Tổng Quan (Home)</a></li>';

    // Nhóm 1: Phần I (Ch00 - Ch05)
    html += '<li><details open><summary>📘 Phần I: Nền Tảng &amp; Truy Vấn Cốt Lõi (Ch00 – Ch05)</summary><ul>';
    html += '<li><a href="#/chapter/ch00" class="tree-item-link ' + (state.lastView === "chapter" && state.lastChapterId === "ch00" ? "active" : "") + '" data-nav-ch="ch00">📄 Chương 0: Nền Tảng Cơ Sở Dữ Liệu</a></li>';
    for (var i = 1; i <= 5; i++) {
      var chId = "ch0" + i;
      var chObj = (DATA.chapters || []).find(function(c) { return c.id === chId; });
      if (chObj) html += renderChapterTreeItem(chObj);
    }
    html += '</ul></details></li>';

    // Nhóm 2: Phần II (Ch06 - Ch10)
    html += '<li><details open><summary>📗 Phần II: Thiết Kế, Lập Trình &amp; Quản Trị (Ch06 – Ch10)</summary><ul>';
    for (var j = 6; j <= 10; j++) {
      var chId2 = (j < 10 ? "ch0" : "ch") + j;
      var chObj2 = (DATA.chapters || []).find(function(c) { return c.id === chId2; });
      if (chObj2) html += renderChapterTreeItem(chObj2);
    }
    html += '</ul></details></li>';

    // Nhóm 3: Phần III (Ch11 - Ch14)
    html += '<li><details open><summary>📙 Phần III: Bảo Mật, Backend &amp; Phỏng Vấn (Ch11 – Ch14)</summary><ul>';
    for (var k = 11; k <= 14; k++) {
      var chId3 = "ch" + k;
      var chObj3 = (DATA.chapters || []).find(function(c) { return c.id === chId3; });
      if (chObj3) html += renderChapterTreeItem(chObj3);
    }
    html += '</ul></details></li>';

    // Nhóm 4: Chương 15
    var ch15 = (DATA.chapters || []).find(function(c) { return c.id === "ch15"; });
    if (ch15) {
      html += '<li><details open><summary>📕 Phần IV: Từ Điển T-SQL &amp; FruitStore (Ch15)</summary><ul>';
      html += renderChapterTreeItem(ch15);
      html += '</ul></details></li>';
    }

    // Nhóm 4B: Chuyên Đề 130 Bài Tập FruitStore (A-Z)
    html += '<li><details open><summary>🗂️ Chuyên Đề: 130 Bài Tập FruitStore (A–Z)</summary><ul>';
    html += '<li><a href="#/fruitstore130" class="tree-item-link ' + (state.lastView === "fruitstore130" ? "active" : "") + '" data-nav-view="fruitstore130">📄 Toàn Bộ 130 Bài Phản Xạ (Ch01 – Ch13)</a></li>';
    html += '</ul></details></li>';

    // Nhóm 5: Các Phân Khu Chức Năng
    html += '<li><details open><summary>🛠️ Phòng Thực Hành &amp; Công Cụ Chuyên Sâu</summary><ul>';
    html += '<li><a href="#/lab" class="tree-item-link ' + (state.lastView === "lab" ? "active" : "") + '" data-nav-view="lab">📄 Phòng Lab SQL (SQLite WASM 7 DBs)</a></li>';
    html += '<li><a href="#/simulators" class="tree-item-link ' + (state.lastView === "simulators" ? "active" : "") + '" data-nav-view="simulators">📄 6 Bộ Mô Phỏng Trực Quan Tương Tác</a></li>';
    html += '<li><a href="#/interview" class="tree-item-link ' + (state.lastView === "interview" ? "active" : "") + '" data-nav-view="interview">📄 Phỏng Vấn Leitner &amp; 12 LeetCode SQL</a></li>';
    html += '<li><a href="#/notes" class="tree-item-link ' + (state.lastView === "notes" ? "active" : "") + '" data-nav-view="notes">📄 Sổ Tay 3 Dòng &amp; Quản Lý Tiến Độ</a></li>';
    html += '<li><a href="#/tracks" class="tree-item-link ' + (state.lastView === "tracks" ? "active" : "") + '" data-nav-view="tracks">📄 Lộ Trình Mở Rộng (MySQL, PG, NoSQL)</a></li>';
    html += '<li><a href="#/appendices" class="tree-item-link ' + (state.lastView === "appendices" ? "active" : "") + '" data-nav-view="appendices">📄 Phụ Lục Tra Cứu A – F &amp; Bản Quyền</a></li>';
    html += '</ul></details></li>';

    container.innerHTML = html;
    container.scrollTop = prevScrollTop;
  }
```

2. **Trong hàm `navigateTo` và trình bắt sự kiện click `[data-scroll-sec]` & `[data-nav-ch]` (`src/ui/app-engine.js`):**
   - Nâng cấp `navigateTo(view, param, skipPushHistory, scrollSecId)` để nhận tham số thứ 4 là `scrollSecId` và đồng bộ với URL Hash (`window.location.hash`) giúp ứng dụng hoạt động đúng như một trang web thực thụ khi bấm Back/Forward của trình duyệt.
   - Khi người dùng bấm vào `[data-scroll-sec]` từ **bất kỳ trang nào (kể cả Phòng Lab, Simulators, TOC hay một chương khác)**: Kiểm tra `parentCh = scrollSecLink.getAttribute("data-parent-ch")`. Nếu `state.lastView !== "chapter"` hoặc `state.lastChapterId !== parentCh`, lập tức gọi `navigateTo("chapter", parentCh, false, secId)` để chuyển ngay sang chương đó rồi mới cuộn tới `secId`!
   - Khi người dùng bấm vào `<a data-nav-ch="...">` nằm trong `<summary>`, cho phép mở `<details>` của chương đó và chuyển ngay tới chương đó (nếu đang ở chính chương đó và bấm lại lần nữa vào tên chương thì đóng/mở nhánh mục con mượt mà).

```javascript
  var _isInternalHashUpdate = false;

  function navigateTo(view, param, skipPushHistory, scrollSecId) {
    state.lastScrollSec = scrollSecId || null;
    if (!skipPushHistory) {
      pushHistory(view, param, scrollSecId);
    }

    // Đồng bộ URL Hash thật của trình duyệt (giúp cảm giác dùng như Web App thực thụ)
    var targetHash = "#/" + view + (param ? "/" + param : "") + (scrollSecId ? "/" + scrollSecId : "");
    if (window.location.hash !== targetHash) {
      _isInternalHashUpdate = true;
      if (skipPushHistory && window.history && window.history.replaceState) {
        window.history.replaceState(null, "", targetHash);
      } else {
        window.location.hash = targetHash;
      }
      setTimeout(function() { _isInternalHashUpdate = false; }, 50);
    }

    // Đánh dấu active trên menu bar
    document.querySelectorAll(".menu-btn").forEach(function(b) {
      if (b.getAttribute("data-nav-view") === view) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    if (view === "toc") {
      renderTocView();
    } else if (view === "chapter") {
      renderChapterView(param || state.lastChapterId || "ch01", scrollSecId);
    } else if (view === "lab") {
      renderLabView(param, null);
    } else if (view === "simulators") {
      renderSimulatorsView(param);
    } else if (view === "interview") {
      renderInterviewView();
    } else if (view === "notes") {
      renderNotesView();
    } else if (view === "tracks") {
      renderTracksView(param);
    } else if (view === "fruitstore130") {
      renderFruitStore130View(param);
    } else if (view === "appendices") {
      renderAppendicesView();
    }

    // Cập nhật highlight active trên Left TOC Tree mà không làm mất trạng thái đóng/mở
    document.querySelectorAll("#toc-tree-container .tree-item-link").forEach(function(a) {
      var navV = a.getAttribute("data-nav-view");
      var navCh = a.getAttribute("data-nav-ch");
      var parentCh = a.getAttribute("data-parent-ch");
      var secAttr = a.getAttribute("data-scroll-sec");

      var isMatch = false;
      if (view === "chapter") {
        var targetChId = param || state.lastChapterId || "ch01";
        if (scrollSecId) {
          isMatch = (parentCh === targetChId && secAttr === scrollSecId);
        } else {
          isMatch = (navCh === targetChId);
        }
      } else {
        isMatch = (navV === view);
      }

      if (isMatch) {
        a.classList.add("active");
        var parentDet = a.closest("details");
        if (parentDet && !parentDet.open) {
          parentDet.open = true;
        }
        // Mở luôn details cấp nhóm nếu bị đóng
        if (parentDet && parentDet.parentElement) {
          var outerDet = parentDet.parentElement.closest("details");
          if (outerDet && !outerDet.open) outerDet.open = true;
        }
      } else {
        a.classList.remove("active");
      }
    });

    saveState();
  }
```

- Cập nhật đoạn bắt sự kiện click `[data-nav-ch]` và `[data-scroll-sec]` trong `setupEventListeners()`:

```javascript
      // Nút chuyển Chương (Hỗ trợ cả trong Cây mục lục <details><summary> và nút trong trang)
      var navChBtn = target.closest("[data-nav-ch]");
      if (navChBtn) {
        e.preventDefault();
        var ch = navChBtn.getAttribute("data-nav-ch");
        var inSummary = navChBtn.closest("summary");
        if (inSummary) {
          var det = inSummary.parentElement;
          if (det && det.tagName === "DETAILS") {
            // Nếu đang ở đúng chương đó rồi và bấm vào tên chương trên cây -> Đóng/mở nhánh con
            if (state.lastView === "chapter" && state.lastChapterId === ch && !state.lastScrollSec) {
              det.open = !det.open;
            } else {
              det.open = true;
            }
          }
        }
        navigateTo("chapter", ch);
        return;
      }

      // Cuộn tới section nhỏ trong bài học (Hoạt động xuyên suốt từ MỌI trang: Lab, TOC, Simulator, Chương khác!)
      var scrollSecLink = target.closest("[data-scroll-sec]");
      if (scrollSecLink) {
        e.preventDefault();
        var secId = scrollSecLink.getAttribute("data-scroll-sec");
        var targetCh = scrollSecLink.getAttribute("data-parent-ch") || state.lastChapterId || "ch01";

        if (state.lastView !== "chapter" || state.lastChapterId !== targetCh) {
          // Đang ở trang Lab / TOC / Simulator hoặc đang ở chương khác -> Nhảy sang đúng chương đó rồi cuộn tới mục con!
          navigateTo("chapter", targetCh, false, secId);
        } else {
          // Đang ở đúng chương đó -> Chỉ cần cuộn mượt và cập nhật highlight
          state.lastScrollSec = secId;
          document.querySelectorAll("#toc-tree-container .tree-item-link").forEach(function(el) {
            el.classList.remove("active");
          });
          scrollSecLink.classList.add("active");
          var el = document.getElementById(secId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          updateAddressBar("chm://bikip-csdl-v2005/chapters/" + targetCh + ".htm#" + secId);
        }
        return;
      }
```

---

### TASK 02: Sửa lỗi kẹt CSDL trong Phòng Lab (`BUG-03`), lỗi đẩy Ví dụ vào Lab (`BUG-05`) và liệt nút Xem Schema ở Trang chủ (`BUG-04`)
1. **Bổ sung sự kiện click cho nút `[data-open-schema-modal]` trong `setupEventListeners()`:**
```javascript
      // Mở Modal xem Schema DDL từ Trang chủ Mục lục (Sửa BUG-04)
      var openSchemaBtn = target.closest("[data-open-schema-modal]");
      if (openSchemaBtn) {
        e.preventDefault();
        var schemaDbId = openSchemaBtn.getAttribute("data-open-schema-modal");
        showDbSchemaModal(schemaDbId);
        return;
      }
```
2. **Sửa dứt điểm lỗi đổi CSDL trong Phòng Lab bị giật ngược về `truonghoc` (`renderLabView` & `loadProblemIntoLab`):**
   - Nguyên nhân: Khi người dùng đổi Dropdown `CSDL:` (`#lab-db-select`) hoặc bấm *"🧪 Mở CSDL Này Trong Lab"* từ Trang chủ, họ muốn chuyển sang CSDL đó. Nhưng `renderLabView(dbId, problemId)` lại lấy `window._CURRENT_LAB_PROBLEM` (đang thuộc CSDL cũ) rồi gọi `loadProblemIntoLab()`, làm ghi đè `state.activeDbId` quay về CSDL cũ!
   - **Cách sửa trong `renderLabView(dbId, problemId)`:**
     - Nếu `problemId` được truyền vào: nạp đúng `problemId` đó.
     - Nếu `dbId` được truyền vào (mà không truyền `problemId`), kiểm tra xem `window._CURRENT_LAB_PROBLEM` hiện tại có thuộc `dbId` đó không. Nếu **không thuộc `dbId` mới**, đặt `window._CURRENT_LAB_PROBLEM = null` (chuyển sang **Chế độ Thực Hành Tự Do - Free Sandbox Mode** trên CSDL `dbId` mới, hoặc hiển thị bảng hướng dẫn các bảng của CSDL `dbId` đó ở cột trái) để **tuyệt đối không bao giờ ghi đè ngược `state.activeDbId` của người dùng**!
   - Thay thế phần đầu của `renderLabView(dbId, problemId)` và sự kiện `#lab-db-select` bằng code chuẩn sau:

```javascript
  function renderLabView(dbId, problemId) {
    state.lastView = "lab";
    if (dbId) state.activeDbId = dbId;
    var currentDbId = state.activeDbId || "fruitstore";

    var dbs = (DATA.labs && DATA.labs.databases) ? DATA.labs.databases : [];
    var currentDbMeta = dbs.find(function(d) { return d.id === currentDbId; }) || dbs[0] || {};

    var allProbs = getAll77LabProblems();
    var currentProblem = null;

    if (problemId) {
      currentProblem = allProbs.find(function(p) { return p.id === problemId || p.id === ("#" + problemId); }) || null;
      if (currentProblem && currentProblem.db) {
        currentDbId = currentProblem.db;
        state.activeDbId = currentDbId;
        currentDbMeta = dbs.find(function(d) { return d.id === currentDbId; }) || dbs[0] || {};
      }
      window._CURRENT_LAB_PROBLEM = currentProblem;
    } else if (window._CURRENT_LAB_PROBLEM) {
      // Chỉ giữ bài tập cũ nếu CSDL của bài tập đó KHỚP với currentDbId đang chọn!
      if (!dbId || window._CURRENT_LAB_PROBLEM.db === currentDbId) {
        currentProblem = window._CURRENT_LAB_PROBLEM;
      } else {
        // Người dùng vừa chủ động chuyển sang CSDL khác -> Giải phóng bài tập cũ để vào Chế độ Sandbox Tự Do!
        window._CURRENT_LAB_PROBLEM = null;
        currentProblem = null;
      }
    }

    updateAddressBar("chm://bikip-csdl-v2005/sql-lab/" + currentDbId + (currentProblem ? ("?problem=" + currentProblem.id) : ""));
    updateStatusCell(2, "🧪 Phòng Lab SQL: " + (currentDbMeta.name || currentDbId));
```
   - Và ở cuối hàm `renderLabView(dbId, problemId)` (thay cho đoạn `if (currentProblem) { loadProblemIntoLab(...); }`):
```javascript
    if (currentProblem) {
      loadProblemIntoLab(currentProblem.id);
    } else {
      // Chế độ Thực Hành Tự Do (Free Sandbox Mode) trên CSDL đang chọn
      var banner = document.getElementById("lab-problem-banner");
      var editor = document.getElementById("sql-editor");
      var firstTable = (currentDbMeta.tables && currentDbMeta.tables[0]) ? currentDbMeta.tables[0] : " Categories";
      var dbProblems = allProbs.filter(function(p) { return p.db === currentDbId; });
      if (banner) {
        banner.innerHTML = '<div class="example-header">' +
          '<span>🛠️ <b>Chế Độ Truy Vấn Tự Do (Free SQL Sandbox)</b> <span class="badge-chuan">[CSDL: ' + escapeHtml(currentDbMeta.name || currentDbId) + ']</span></span>' +
          (dbProblems.length ? '<button class="default" data-open-lab-problem="' + escapeHtml(dbProblems[0].id) + '" data-db="' + escapeHtml(currentDbId) + '">🎯 Mở Bài Tập Đầu Tiên Của CSDL Này (' + dbProblems.length + ' bài) ►</button>' : '') +
          '</div>' +
          '<p style="margin:6px 0; font-size:13px;">Bạn đang ở chế độ thực hành tự do trên CSDL <b>' + escapeHtml(currentDbMeta.name || currentDbId) + '</b>. Hãy gõ bất kỳ câu lệnh <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> nào vào khung bên phải và nhấn <kbd>F5</kbd> để xem kết quả, hoặc chọn một đề bài từ thanh chọn phía trên để chấm điểm tự động.</p>' +
          (currentDbMeta.tables ? '<div style="font-size:12px; color:var(--text-muted);"><b>Các bảng có sẵn trong CSDL này:</b> <code>' + escapeHtml(currentDbMeta.tables.join("</code>, <code>")) + '</code></div>' : '');
      }
      if (editor && !window._PENDING_PUSH_SQL) {
        editor.value = "-- Chế độ Sandbox tự do trên CSDL: " + (currentDbMeta.name || currentDbId) + "\nSELECT * FROM " + firstTable + " LIMIT 10;";
      }
    }
```
   - Sửa sự kiện click `[data-push-lab-sql]` (khi bấm *"🧪 Đẩy vào SQL Lab"* từ một Ví dụ trong chương) để xóa bài tập cũ và chạy mượt không bị ghi đè:
```javascript
      // Đẩy SQL từ ví dụ vào Lab (Chế độ Sandbox chạy thử ví dụ)
      var pushLabBtn = target.closest("[data-push-lab-sql]");
      if (pushLabBtn) {
        e.preventDefault();
        var rawSql = decodeURIComponent(pushLabBtn.getAttribute("data-push-lab-sql"));
        var labDb = pushLabBtn.getAttribute("data-lab-db") || state.activeDbId;
        window._CURRENT_LAB_PROBLEM = null;
        window._PENDING_PUSH_SQL = rawSql;
        navigateTo("lab", labDb);
        setTimeout(function() {
          var editor = document.getElementById("sql-editor");
          if (editor) editor.value = rawSql;
          window._PENDING_PUSH_SQL = null;
          var btnRun = document.getElementById("btn-run-sql");
          if (btnRun) btnRun.click();
        }, 80);
        return;
      }
```
   - Sửa sự kiện `change` của `#lab-db-select` và `#lab-problem-select`:
```javascript
      // Đổi CSDL trong Lab -> Cho phép chuyển sang Chế độ Sandbox của CSDL mới
      if (e.target.id === "lab-db-select") {
        var newDbId = e.target.value;
        state.activeDbId = newDbId;
        if (window._CURRENT_LAB_PROBLEM && window._CURRENT_LAB_PROBLEM.db !== newDbId) {
          window._CURRENT_LAB_PROBLEM = null;
        }
        saveState();
        renderLabView(newDbId, null);
        return;
      }

      // Đổi đề bài trong Lab -> Nếu chọn "-- Chế độ tự do --" (value === "") thì về Sandbox
      if (e.target.id === "lab-problem-select") {
        var selProbId = e.target.value;
        if (!selProbId) {
          window._CURRENT_LAB_PROBLEM = null;
          renderLabView(state.activeDbId, null);
        } else {
          loadProblemIntoLab(selProbId);
        }
        return;
      }
```

---

### TASK 03: Bổ sung Router URL Hash (`hashchange`) & Sửa thanh Address Bar (`BUG-06`)
1. Thêm hàm `handleHashRoute()` vào `src/ui/app-engine.js` và gắn `window.addEventListener("hashchange", handleHashRoute)` để khi người dùng bấm nút **Back / Forward của trình duyệt Chrome/Edge** hoặc chia sẻ link `#/chapter/ch05/sec-examples`, ứng dụng chuyển trang và cuộn tới đúng mục ngay lập tức:
```javascript
  function handleHashRoute() {
    if (_isInternalHashUpdate) return;
    var hash = window.location.hash || "";
    if (!hash || hash === "#" || hash === "#/") return;

    if (hash.indexOf("#/") === 0) {
      var parts = hash.substring(2).split("/");
      var view = parts[0] || "toc";
      var param = parts[1] || null;
      var sec = parts[2] || null;
      navigateTo(view, param, true, sec);
    }
  }
```
2. Trong hàm `handleGo` của thanh `#address-input` (khoảng dòng 3420), bổ sung nhánh nhận diện `fruitstore-130-drills` và mã `#sec-...`:
```javascript
          } else if (val.indexOf("/fruitstore-130-drills") !== -1 || val.indexOf("fruitstore") !== -1) {
            navigateTo("fruitstore130");
```

---

### TASK 04: Bổ sung Thanh Kéo Chia Cột 3D (`#pane-splitter`) chuẩn phần mềm `.CHM` (`BUG-11`)
1. Trong `index.html` (dòng 156, ngay giữa `</aside>` của `#left-pane` và `<main id="reading-pane">`), thêm thẻ thanh chia cột 3D:
```html
        <!-- Thanh kéo chia cột 3D chuẩn Microsoft HTML Help Viewer -->
        <div id="pane-splitter" title="Kéo để thay đổi độ rộng cột Mục lục (Hoặc nhấn đúp để mặc định 300px)" role="separator" aria-orientation="vertical"></div>
```
2. Trong `setupEventListeners()` của `src/ui/app-engine.js`, thêm logic kéo chuột mượt mà cho `#pane-splitter` (lưu độ rộng vào `state.leftPaneWidth`):
```javascript
    // Kéo thanh chia cột 3D (#pane-splitter)
    var splitter = document.getElementById("pane-splitter");
    var leftPaneEl = document.getElementById("left-pane");
    if (splitter && leftPaneEl) {
      if (state.leftPaneWidth && state.leftPaneWidth >= 200 && state.leftPaneWidth <= 520) {
        leftPaneEl.style.width = state.leftPaneWidth + "px";
      }
      var isResizing = false;
      splitter.addEventListener("mousedown", function(e) {
        e.preventDefault();
        isResizing = true;
        document.body.classList.add("resizing-pane");
      });
      window.addEventListener("mousemove", function(e) {
        if (!isResizing) return;
        var workspaceEl = document.getElementById("workspace");
        var offsetLeft = workspaceEl ? workspaceEl.getBoundingClientRect().left : 0;
        var newWidth = Math.max(200, Math.min(520, e.clientX - offsetLeft - 4));
        leftPaneEl.style.width = newWidth + "px";
        state.leftPaneWidth = newWidth;
      });
      window.addEventListener("mouseup", function() {
        if (isResizing) {
          isResizing = false;
          document.body.classList.remove("resizing-pane");
          saveState();
        }
      });
      splitter.addEventListener("dblclick", function() {
        leftPaneEl.style.width = "300px";
        state.leftPaneWidth = 300;
        saveState();
      });
    }
```

---

### TASK 05: Xóa 290 dòng code lặp, Sửa lỗi % Tiến độ (`BUG-13`), Lỗi mất ký tự `<` `>` trong Schema Modal (`BUG-14`) và Lỗi mù chữ Theme Borland/CRT (`BUG-12`)
1. **Xóa khối hàm bị lặp lần 2 trong `src/ui/app-engine.js`:**
   - Xóa bản sao thứ nhất của `normalizeVal`, `getAll77LabProblems`, `gradeSqlProblem` (từ dòng 228 đến dòng 481) và chỉ giữ lại **duy nhất 1 bộ hàm chuẩn** (có đầy đủ `starter_sql` và 130 bài `fsDrills`).
2. **Sửa hàm `updateOverallProgress()` (khoảng dòng 491) để tính đúng tổng số bài thực tế:**
```javascript
  function updateOverallProgress() {
    var allProbs = getAll77LabProblems(); // Gồm 77 bài gốc + 130 bài FruitStore = 207 bài
    var totalChapters = (DATA.chapters ? DATA.chapters.length : 15);
    var totalTrackable = allProbs.length + totalChapters;

    var completedCount = 0;
    allProbs.forEach(function(p) {
      if (state.completedItems[p.id]) completedCount++;
    });
    (DATA.chapters || []).forEach(function(c) {
      if (state.completedItems["topic_" + c.id]) completedCount++;
    });

    var percent = totalTrackable > 0 ? Math.min(100, Math.round((completedCount / totalTrackable) * 100)) : 0;

    var fillEl = document.getElementById("top-progress-fill");
    var textEl = document.getElementById("top-progress-text");
    if (fillEl) fillEl.style.width = percent + "%";
    if (textEl) textEl.textContent = "Tiến độ: " + percent + "% (" + completedCount + "/" + totalTrackable + ")";

    if (sqlEngineReady) {
      var dbsCount = (DATA.labs && DATA.labs.databases) ? DATA.labs.databases.length : 7;
      updateStatusCell(3, "🗄️ SQLite: Sẵn sàng (" + dbsCount + " DBs) | Đạt: " + completedCount + "/" + totalTrackable);
    }
  }
```
3. **Bọc `escapeHtml()` trong `showDbSchemaModal()`, `renderLeftIndex()` và `runFulltextSearch()`:**
   - Trong `showDbSchemaModal(dbId)`: đổi `(dbMeta.er_ascii || ...)` thành `escapeHtml(dbMeta.er_ascii || ...)` và đổi `(dbMeta.schema_sql || '') + '\n\n' + (dbMeta.seed_sql || '')` thành `escapeHtml((dbMeta.schema_sql || '') + '\n\n' + (dbMeta.seed_sql || ''))`.
   - Trong `runFulltextSearch(query)`: bọc `escapeHtml(q)`, `escapeHtml(m.title)`, `escapeHtml(m.desc.substring(0, 75))` để không bị gãy DOM khi tìm từ khóa có `<` hoặc `>`.
4. **Xóa sạch các mã màu nền sáng gán cứng (`#fffbe6`, `#f6fff6`) trong `renderFruitStoreDrillsSection` và `renderFruitStore130View`:**
   - Thay `background:#fffbe6; border:1px solid #d4b106;` bằng `background:var(--warn-bg); border:1px solid var(--warn-border); color:var(--text-main);` để khi bật Theme **Borland Turbo C++** hoặc **Green Phosphor CRT**, chữ vàng/xanh dạ quang luôn nổi bật rõ nét trên nền tối!

---

### TASK 06: Chuẩn Hóa Toàn Bộ Giao Diện Hoài Niệm Windows 98 / MSDN Library v2005 (`assets/css/retro-98-browser.css`, `layout.css`, `components.css`)
Hãy cập nhật `assets/css/retro-98-browser.css` (bổ sung vào cuối file hoặc thay thế các rule tương ứng) để giải quyết triệt để **BUG-07, BUG-08, BUG-09, BUG-10, BUG-11, BUG-12**:

```css
/* ==========================================================================
   15. MASTER RETRO 2000s MSDN .CHM & IE 5.5 VISUAL POLISH PATCH
   Khắc phục triệt để: Viền kép Tablist, Rớt dòng Header, Thẻ phẳng hiện đại,
   Cây thư mục rớt dòng dưới dấu [+], Thanh kéo Splitter 3D & Tương phản 4 Themes
   ========================================================================== */

/* 15.1. Tinh gọn 4 tầng Header (Titlebar + Menubar + Toolbar + Addressbar) không bị rớt dòng */
#title-bar.title-bar {
  height: 24px !important;
  min-height: 24px !important;
  padding: 1px 4px !important;
}

#menu-bar {
  min-height: 24px !important;
  padding: 1px 4px !important;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-dark);
  flex-wrap: nowrap !important;
  overflow-x: auto;
}

.menu-items {
  flex-wrap: nowrap !important;
  white-space: nowrap;
  gap: 1px !important;
}

.menu-btn {
  padding: 2px 6px !important;
  font-size: 11.5px !important;
  white-space: nowrap;
}

#tool-bar {
  min-height: 28px !important;
  padding: 2px 4px !important;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-dark);
  flex-wrap: nowrap !important;
  overflow-x: auto;
  gap: 3px !important;
}

#tool-bar button {
  height: 22px !important;
  padding: 1px 6px !important;
  font-size: 11px !important;
  white-space: nowrap;
  flex-shrink: 0;
}

#browser-address-bar {
  min-height: 26px !important;
  padding: 2px 4px !important;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-dark);
  flex-wrap: nowrap !important;
  overflow-x: auto;
}

.quick-links-bar {
  flex-wrap: nowrap !important;
  white-space: nowrap;
}

/* 15.2. Xóa bỏ viền kép (Double Border) ở 3 Tab cột trái (Nội dung | Chỉ mục | Tìm kiếm) */
#left-pane menu[role="tablist"].left-tabs {
  margin: 0 0 -2px 0 !important;
  padding: 0 0 0 2px !important;
  gap: 0 !important;
}

#left-pane menu[role="tablist"].left-tabs li[role="tab"].left-tab {
  border: none !important; /* Để 98.css tự vẽ box-shadow 3D chuẩn Win98 */
  background: var(--bg-window) !important;
  padding: 0 !important;
  min-width: 72px;
}

#left-pane menu[role="tablist"].left-tabs li[role="tab"].left-tab[aria-selected="true"] {
  background: var(--bg-window) !important;
  z-index: 3;
}

#left-pane menu[role="tablist"].left-tabs li[role="tab"] a {
  display: block !important;
  padding: 4px 8px !important;
  color: var(--text-main) !important;
  text-decoration: none !important;
  font-family: var(--font-ui) !important;
  font-size: 11px !important;
  user-select: none;
}

/* 15.3. Thanh kéo chia cột 3D (#pane-splitter) chuẩn Microsoft HTML Help */
#workspace {
  gap: 0 !important;
  padding: 3px !important;
}

#pane-splitter {
  width: 5px;
  min-width: 5px;
  cursor: col-resize;
  background: var(--bg-window);
  border-left: 1px solid var(--border-light);
  border-right: 1px solid var(--border-dkdk);
  flex-shrink: 0;
  position: relative;
  user-select: none;
}

#pane-splitter::after {
  content: "⋮";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  color: var(--border-dark);
  line-height: 1;
}

#pane-splitter:hover,
body.resizing-pane #pane-splitter {
  background: var(--accent-soft);
}

#left-pane.collapsed + #pane-splitter {
  display: none !important;
}

body.resizing-pane {
  cursor: col-resize !important;
  user-select: none !important;
}

/* 15.4. Sửa lỗi Cây mục lục (ul.tree-view): Chống rớt chữ xuống dưới dấu [+] của <summary> */
#toc-tree-container.tree-view summary {
  display: list-item !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 1px 2px !important;
  line-height: 1.4;
}

#toc-tree-container.tree-view summary > a.tree-item-link {
  display: inline !important;
  padding: 1px 4px !important;
  white-space: nowrap;
}

#toc-tree-container.tree-view ul > li > a.tree-item-link {
  display: block !important;
  padding: 2px 4px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 15.5. Đồng bộ hóa nội dung bài học bên trong #reading-pane theo chuẩn MSDN Library 2000 Classic */
.ch-banner {
  background: var(--bg-table-head) !important;
  border-top: 2px solid var(--border-light) !important;
  border-left: 2px solid var(--border-light) !important;
  border-right: 2px solid var(--border-dkdk) !important;
  border-bottom: 2px solid var(--border-dkdk) !important;
  box-shadow: inset 1px 1px 0 var(--bg-panel), inset -1px -1px 0 var(--border-dark);
  padding: 10px 14px !important;
  margin-bottom: 16px !important;
}

.ch-banner h1 {
  font-family: "Tahoma", "MS Sans Serif", sans-serif !important;
  font-size: 1.35em !important;
  color: var(--accent) !important;
  margin: 4px 0 !important;
}

.section-card {
  background: var(--bg-card) !important;
  border-top: 1px solid var(--border-light) !important;
  border-left: 1px solid var(--border-light) !important;
  border-right: 1px solid var(--border-dkdk) !important;
  border-bottom: 1px solid var(--border-dkdk) !important;
  box-shadow: 0 0 0 1px var(--border-dark);
  padding: 12px 16px !important;
  margin-bottom: 16px !important;
  scroll-margin-top: 12px;
}

.section-card h2 {
  background: linear-gradient(90deg, var(--bg-table-head), transparent);
  padding: 4px 8px !important;
  margin: -4px -8px 10px -8px !important;
  border-left: 4px solid var(--accent) !important;
  border-bottom: 1px solid var(--border-dark) !important;
  font-family: "Tahoma", "MS Sans Serif", sans-serif !important;
  font-size: 1.12em !important;
  color: var(--accent) !important;
}

pre.code-block,
.er-box {
  border-top: 2px solid var(--border-dkdk) !important;
  border-left: 2px solid var(--border-dkdk) !important;
  border-right: 2px solid var(--border-light) !important;
  border-bottom: 2px solid var(--border-light) !important;
  background: var(--bg-code) !important;
  color: var(--text-code) !important;
  padding: 8px 10px !important;
}

.badge-chuan,
.badge-tsql {
  border-radius: 0 !important;
  border-top: 1px solid var(--border-light);
  border-left: 1px solid var(--border-light);
  border-right: 1px solid var(--border-dkdk);
  border-bottom: 1px solid var(--border-dkdk);
  padding: 1px 5px !important;
  font-size: 11px !important;
}

/* Sửa lỗi mù chữ trên Theme Borland & CRT cho thẻ bài tập đã giải */
.drill-card.drill-solved {
  border-left: 5px solid var(--ok-color) !important;
  background: var(--bg-table-alt) !important;
  color: var(--text-main) !important;
}
```

---

### TASK 07: Tinh gọn Nhãn Nút Trên Menu Bar & Toolbar trong `index.html` để Chuẩn Phong Cách IE 5.5 & MSDN CHM
Trong `index.html` (dòng 40–102):
1. Đổi các nhãn trên `#menu-bar` cho gọn gàng, chuẩn thanh thực đơn cổ điển:
   - `<u>F</u>ile (Mục lục)`
   - `<u>V</u>iew (Bài học)`
   - `<u>L</u>ab SQL`
   - `<u>S</u>imulators (6)`
   - `<u>I</u>nterview (48)`
   - `<u>D</u>rills (130 Bài)`
   - `<u>N</u>otes (Sổ tay)`
   - `<u>T</u>racks (Mở rộng)`
   - `<u>A</u>ppendices`
   - `<u>H</u>elp (F1)`
2. Trong `#lab-problem-select` (ở `renderLabView` trong `src/ui/app-engine.js`), đổi nhãn từ `"Đề bài (77 bài):"` thành `"Đề bài (207 bài):"` và `"-- Chế độ tự do (Hoặc chọn 1 trong 207 bài tập) --"` để phản ánh đúng tổng số bài tập sau khi đã tích hợp 130 bài FruitStore.

---

### TASK 08: Kiểm Thử Nghiệm Thu Đầu-Cuối (End-to-End Smoke Test Checklist)
Sau khi áp dụng toàn bộ các bản vá từ TASK 01 đến TASK 07, hãy kiểm tra lại 6 kịch bản bắt buộc sau:
1. Mở trang **Phòng Lab SQL (`lab`)**, sau đó nhìn sang cột Mục lục bên trái, mở nhánh **Chương 3 (`ch03`)** và bấm vào **`§4. Cú pháp & Ví dụ`** -> Ứng dụng phải lập tức chuyển sang **Chương 3** và cuộn mượt tới đúng mục **4. Cú pháp & Ví dụ**, đồng thời tô sáng mục `§4` trên cây mục lục.
2. Đang ở **Chương 3**, mở nhánh **Chương 8 (`ch08`)** ở cột trái và bấm vào **`§8. Lỗi hay gặp`** -> Ứng dụng phải chuyển sang **Chương 8** và cuộn tới mục **8. Lỗi hay gặp** của Chương 8.
3. Vào **Phòng Lab SQL**, chọn 1 bài tập bất kỳ, sau đó đổi Dropdown **`CSDL:`** sang `ShopOnline` hoặc `AutoShop` -> Dropdown CSDL phải giữ nguyên ở `ShopOnline`/`AutoShop` và chuyển sang **Chế độ Truy vấn Tự do (Free Sandbox Mode)**, tuyệt đối không bị giật ngược về `truonghoc`.
4. Về **Trang Chủ Mục Lục (`toc`)**, kéo xuống 7 sơ đồ ERD và bấm nút **`📋 Xem Schema DDL`** -> Hộp thoại Modal phải bật lên hiển thị rõ ràng sơ đồ ASCII ERD và đầy đủ câu lệnh `CREATE TABLE` / `INSERT INTO` (không bị mất chữ sau dấu `<` hoặc `>`).
5. Bấm chuyển đổi qua lại cả **4 Themes (`Classic`, `XP Luna`, `Borland Turbo C++`, `Green Phosphor CRT`)** khi đang ở trang **130 Bài FruitStore** -> Không còn bất kỳ ô nào bị nền trắng/vàng chói làm mù chữ.
6. Kéo thanh ngăn cách **`#pane-splitter`** giữa cột Mục lục trái và khung Đọc bài phải -> Cột mục lục co giãn mượt mà, nhấn đúp tự động trả về `300px`.
```
