# agents.md — Bộ Luật Tối Cao Dành Cho AI Agent (Antigravity)

> **Dự án:** `BiKipCoSoDuLieu_Modular_v2005` (`BiKipCoSoDuLieu_Java_DotNet_v2005.chm`)  
> **Định hướng giao diện:** Trình duyệt Web Hoài Niệm Thập Niên 2000 (Internet Explorer 5.5 / Netscape 4.7) kết hợp Trình đọc Tài liệu Kỹ thuật **MSDN HTML Help (.CHM) v2005** sử dụng toàn diện thư viện **[98.css](https://jdan.github.io/98.css/)**.  
> **Đối tượng thi hành:** AI Coding Agent (**Antigravity** / Cursor / Windsurf / Claude Code).

Tài liệu này là **Hiến pháp Kỹ thuật (Constitutional Rulebook)** bắt buộc phải đọc và tuân thủ tuyệt đối trước khi tạo mới, chỉnh sửa hoặc tái cấu trúc bất kỳ file nào trong thư mục `BiKipCoSoDuLieu_Modular_v2005`.

## 1. Bối Cảnh Thực Tế & Nguyên Tắc Bảo Toàn Hiện Trạng

Khi kiểm tra thư mục dự án hiện tại (`BiKipCoSoDuLieu_Modular_v2005`), **28 files cốt lõi đã tồn tại và hoàn thiện 100%**, bao gồm:
- `assets/css/themes.css`, `assets/css/layout.css`, `assets/css/components.css`
- `src/core/registry.js` (Bộ đăng ký `window.BiKipRegistry`)
- `src/data/meta-toc.js` (Mục lục tổng quan 16 chương & 77 bài tập)
- `src/data/chapters/ch00-nen-tang.js` đến `ch15-tsql-keyword-dictionary-fruitstore.js` (Đầy đủ 16 chương giáo trình + Từ điển T-SQL + FruitStore Lab)
- `src/data/databases/db-autoshop.js`, `db-countries.js`, `db-fruitstore.js`, `db-leetcode.js`, `db-library.js`, `db-shoponline.js`, `db-truonghoc.js` (Đầy đủ 7 cơ sở dữ liệu thực hành)

### Luật Bảo Toàn Bất Biến (Rule of Preservation)
1. **CẤM XÓA HOẶC RÚT GỌN DỮ LIỆU ĐÃ CÓ:** Tuyệt đối không được ghi đè làm mất nội dung hoặc rút gọn (truncate) bất kỳ file nào trong `src/data/chapters/ch00..ch15` hay `src/data/databases/db-*.js`.
2. **CẤM THAY ĐỔI CHỮ KÝ HÀM CỦA `src/core/registry.js`:** Tất cả 24 files dữ liệu đang gọi `window.BiKipRegistry.registerChapter(...)`, `window.BiKipRegistry.registerDatabase(...)`, `window.BiKipRegistry.setMetaToc(...)`, `window.BiKipRegistry.setCh0Html(...)`. Mọi thay đổi phá vỡ các hàm này sẽ làm sập toàn bộ ứng dụng.
3. **NHIỆM VỤ CỦA AGENT:** Khôi phục toàn bộ các file bị thiếu ở phần đuôi dự án (`simulators.js`, `interview-bank.js`, `leetcode-challenges.js`, `appendices.js`, `tracks/*.js`, `src/ui/app-engine.js`, `index.html`, `README_KIEN_TRUC_MO_RONG.md`) đồng thời nâng cấp toàn bộ tầng giao diện lên chuẩn **98.css 2000s Nostalgic Web Browser + MSDN CHM Viewer** thông qua `assets/css/retro-98-browser.css`, `index.html` và `src/ui/app-engine.js`.

## 2. Năm Định Luật Kiến Trúc Bất Biến (5 Architectural Invariants)

| Mã Luật | Tên Định Luật | Quy Định Bắt Buộc | Hành Vi Bị Cấm Tuyệt Đối |
| :--- | :--- | :--- | :--- |
| **LAW-01** | **Zero-Bundler `file://` Execution** | Người dùng mở app bằng cách **Double-click trực tiếp vào `index.html`** trên Windows/macOS (`file:///C:/.../index.html`) mà không cần chạy `npm run dev`, Vite, Webpack hay Live Server. | Cấm dùng `<script type="module">`, cấm dùng `import`/`export` ES6, cấm dùng `fetch('./src/data/...')` vì trình duyệt chặn CORS trên `file://`. |
| **LAW-02** | **Deterministic Script Loading** | Mọi module dữ liệu phải được nạp qua thẻ `<script src="..."></script>` theo đúng thứ tự: `registry.js` -> `meta-toc.js` -> `ch00..ch15` -> `db-*.js` -> `simulators.js` -> `interview-bank.js` -> `leetcode-challenges.js` -> `appendices.js` -> `tracks/*.js` -> `app-engine.js`. | Cấm gọi `window.BiKipRegistry.buildGlobalData()` trước khi tất cả các file dữ liệu đã nạp xong. |
| **LAW-03** | **Fixed-Viewport Desktop & Browser Shell** | `html, body` phải có `width: 100%; height: 100%; overflow: hidden;`. Khung cửa sổ `#chm-window.window` chiếm trọn màn hình. **Chỉ duy nhất** vùng `#reading-pane` và `.left-tab-body` được phép có thanh cuộn dọc (`overflow-y: auto`). | Cấm để cả trang web cuộn trôi mất Title Bar, Menu Bar, Browser Address Bar hoặc Status Bar. |
| **LAW-04** | **100% Authentic 98.css Semantic DOM** | Mọi thành phần UI (Window, Title Bar, TreeView, Tabs, Sunken TableView, GroupBox, Checkbox, Radio, Slider, Segmented Progress Bar, Status Bar) phải tuân thủ chính xác cấu trúc thẻ HTML của `https://jdan.github.io/98.css/`. | Cấm tự bịa class ngoài luồng thay cho cấu trúc chuẩn của 98.css (ví dụ: quên đặt `<label>` ngay sau `<input>` trong `.field-row`). |
| **LAW-05** | **Zero-Placeholder Content Policy** | Mọi dữ liệu khôi phục (`simulators.js`, `interview-bank.js`, `leetcode-challenges.js`, `appendices.js`, `app-engine.js`) phải đầy đủ 100% logic và nội dung tiếng Việt chuyên sâu. | Cấm viết comment `// TODO: implement later`, `/* ... */`, hoặc tạo mảng rỗng giả lập. |

## 3. Bộ Luật Sử Dụng Thư Viện 98.css (`https://jdan.github.io/98.css/`)

Agent bắt buộc phải nhúng stylesheet chính thức của **98.css** vào `<head>` của `index.html` trước các file CSS nội bộ:

```html
<link rel="stylesheet" href="https://unpkg.com/98.css">
<link rel="stylesheet" href="assets/css/themes.css">
<link rel="stylesheet" href="assets/css/layout.css">
<link rel="stylesheet" href="assets/css/components.css">
<link rel="stylesheet" href="assets/css/retro-98-browser.css">
```

Dưới đây là **10 Quy Chuẩn DOM Của 98.css** mà Agent phải áp dụng chính xác trong `index.html` và các hàm render HTML trong `src/ui/app-engine.js`:

### 3.1. Cửa Sổ Chính & Hộp Thoại (`window`, `title-bar`, `title-bar-controls`)
- Thẻ bao ngoài của ứng dụng (`#chm-window`), các Modal (`#shortcut-modal`, `#track-modal`, `#about-modal`) và các khung Simulator/Card lớn phải dùng class `window`.
- Thanh tiêu đề bắt buộc dùng `div.title-bar` (hoặc `div.title-bar.inactive` cho cửa sổ phụ không active), bên trong gồm `div.title-bar-text` và `div.title-bar-controls`.
- Các nút điều khiển cửa sổ trong `div.title-bar-controls` **không điền chữ bên trong**, mà phải dùng thuộc tính `aria-label` chuẩn của 98.css (`Minimize`, `Maximize`, `Restore`, `Help`, `Close`) để hiển thị icon pixel Windows 98 nguyên bản:

```html
<div class="window" id="chm-window">
  <div class="title-bar" id="title-bar">
    <div class="title-bar-text">
      <span class="chm-icon">?</span>
      <span id="window-title-text">BiKipCoSoDuLieu_Java_DotNet_v2005.chm — Microsoft Internet Explorer &amp; HTML Help Viewer</span>
    </div>
    <div class="title-bar-controls">
      <button aria-label="Help" id="btn-win-help" title="Phím tắt &amp; Trợ giúp (F1)"></button>
      <button aria-label="Minimize" id="btn-win-min" title="Thu gọn Sidebar (F6)"></button>
      <button aria-label="Maximize" id="btn-win-max" title="Toàn màn hình"></button>
      <button aria-label="Close" id="btn-win-close" title="Về Trang Chủ"></button>
    </div>
  </div>
  <div class="window-body" id="chm-window-body">
    <!-- Menu Bar, Browser Toolbar, Address Bar, Workspace, Status Bar -->
  </div>
</div>
```

### 3.2. Thanh Trạng Thái (`status-bar` & `status-bar-field`)
- Phần chân trang (`#status-bar`) phải dùng `<div class="status-bar" id="status-bar">` và mỗi ô thông tin dùng `<p class="status-bar-field">`:

```html
<div class="status-bar" id="status-bar">
  <p class="status-bar-field" id="status-cell-1">🌐 Done — chm://bikip-csdl-v2005/toc</p>
  <p class="status-bar-field" id="status-cell-2">📂 Mục lục tổng quan (16 Chương)</p>
  <p class="status-bar-field" id="status-cell-3">🗄️ SQLite WASM: Ready | Tiến độ: 0%</p>
  <p class="status-bar-field" id="status-cell-4">🖥️ My Computer (Offline Local Zone)</p>
</div>
```

### 3.3. Cây Thư Mục Mục Lục & Schema (`ul.tree-view` + `<details>` / `<summary>`)
- Toàn bộ cây mục lục bên trái (`#left-tab-toc`) và cây cấu trúc bảng Database trong Phòng Lab phải dùng `<ul class="tree-view">`.
- Các nhánh đóng/mở (Chương -> 11 Mục con; hoặc Database -> Các Bảng -> Các Cột) phải dùng `<details open><summary>...</summary><ul>...</ul></details>` đúng chuẩn 98.css để có đường kẻ chấm vuông góc (`dotted line`) và nút cộng/trừ (`+`/`-`) cổ điển:

```html
<ul class="tree-view" id="chm-toc-tree">
  <li>
    <a href="#toc" class="tree-item-link active" data-nav-view="toc">🏠 Bảng Mục Lục Tổng Quan (Home)</a>
  </li>
  <li>
    <details open>
      <summary>📘 Phần I: Nền Tảng &amp; Truy Vấn Cốt Lõi (Ch00 - Ch05)</summary>
      <ul>
        <li>
          <details>
            <summary><a href="#ch01" class="tree-item-link" data-nav-ch="ch01">Chương 1: SELECT, NULL &amp; Kiểu Dữ Liệu</a></summary>
            <ul>
              <li><a href="#ch01-s1" class="tree-item-link" data-scroll-sec="sec-1">1. Mục tiêu &amp; Dấu hiệu nhận biết</a></li>
              <li><a href="#ch01-s2" class="tree-item-link" data-scroll-sec="sec-2">2. Lý thuyết &amp; Định nghĩa</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </details>
  </li>
</ul>
```

### 3.4. Hệ Thống Tab (`menu[role="tablist"]` & `menu.multirows`)
- 98.css định nghĩa Tab chuẩn bằng `<menu role="tablist">` đi kèm `<li role="tab" aria-selected="true|false"><a href="#...">...</a></li>` và khung nội dung bên dưới là `<div class="window" role="tabpanel"><div class="window-body">...</div></div>`.
- **Ứng dụng bắt buộc trong dự án:**
  1. **Left Sidebar 3 Tabs:** (`Nội dung (TOC)`, `Chỉ mục (Index)`, `Tìm kiếm (Search)`) dùng `<menu role="tablist" class="left-tablist">`.
  2. **2000s Browser Workspace Mode Tabs:** (`📘 Giáo Trình (16 Chương)`, `🧪 Phòng Lab SQL (7 DB)`, `⚙️ Mô Phỏng (6 Simulators)`, `🎯 Phỏng Vấn & LeetCode`, `📝 Sổ Tay & Tiến Độ`, `🚀 Mở Rộng (MySQL/PG/NoSQL)`) dùng `<menu role="tablist" id="browser-mode-tabs">`.
  3. **Simulator Selector (6 Bộ Mô Phỏng):** Dùng `<menu role="tablist" class="multirows" id="sim-tablist">` để hiển thị 2 hàng tab chuẩn Windows 98 khi chọn giữa 6 bộ Simulator.

### 3.5. Bảng Kết Quả Truy Vấn & Bảng Dữ Liệu (`div.sunken-panel > table.interactive`)
- Mọi bảng kết quả trả về từ SQLite WASM trong Phòng Lab, bảng dữ liệu mẫu trong Simulator, và bảng danh sách bài tập phải bọc trong `<div class="sunken-panel">` và thẻ `<table class="interactive">`.
- Khi người dùng click vào một dòng `<tr>` trong `table.interactive`, script phải toggle class `.highlighted` trên `<tr>` đó để tái hiện màu xanh Navy `#000080` chữ trắng đặc trưng của Windows 98 ListView/DataGrid:

```html
<div class="sunken-panel sql-result-sunken">
  <table class="interactive sql-result-table">
    <thead>
      <tr><th>#</th><th>MaSV</th><th>HoTen</th><th>DTB</th></tr>
    </thead>
    <tbody>
      <tr class="highlighted"><td>1</td><td>SV01</td><td>Nguyễn Văn An</td><td>8.5</td></tr>
      <tr><td>2</td><td>SV02</td><td>Trần Thị Bình</td><td>7.2</td></tr>
    </tbody>
  </table>
</div>
```

### 3.6. Nhóm Điều Khiển (`fieldset` + `legend`)
- Trong Phòng Lab SQL, 6 Bộ Mô Phỏng, và Phòng Phỏng Vấn, mọi cụm công cụ điều khiển (ví dụ: *Chọn Cơ Sở Dữ Liệu*, *Bộ Lọc Bài Tập*, *Điều Khiển Bước Chạy Simulator*, *Bộ Lọc Thẻ Phỏng Vấn Leitner*) phải bọc trong `<fieldset class="retro-groupbox"><legend>...</legend>...</fieldset>`.

### 3.7. Checkbox & Radio Button (`div.field-row` + `input` + `label`)
- **LUẬT NGHIÊM NGẶT CỦA 98.CSS:** 98.css vẽ ô tích Checkbox và nút tròn Radio thông qua selector CSS `input[type="checkbox"] + label::before` và `input[type="radio"] + label::before`.
- Do đó:
  1. **KHÔNG BAO GIỜ** bọc `<input>` bên trong `<label><input> Text</label>`.
  2. **BẮT BUỘC** đặt `<input id="unique-id">` đứng trước và `<label for="unique-id">` đứng ngay liền kề sau nó, cả hai nằm trong `<div class="field-row">`:

```html
<!-- ĐÚNG CHUẨN 98.CSS -->
<div class="field-row">
  <input type="checkbox" id="chk-crt-scanlines">
  <label for="chk-crt-scanlines">Hiệu ứng màn hình CRT</label>
</div>

<div class="field-row">
  <input id="radio-join-inner" type="radio" name="sim-join-type" value="INNER" checked>
  <label for="radio-join-inner">INNER JOIN</label>
</div>
```

### 3.8. Thanh Trượt Slider (`input[type="range"].has-box-indicator`)
- Dùng `<input type="range" class="has-box-indicator">` cho:
  1. Thanh chỉnh cỡ chữ bài đọc (`13px` – `20px`) trên thanh công cụ.
  2. Thanh tua bước chạy (Step Scrubber) trong các bộ Simulator (`exec_order`, `btree`, `isolation`).

### 3.9. Thanh Tiến Độ Phân Đoạn (`div.progress-indicator.segmented`)
- Nâng cấp thanh tiến độ học tập trên Menu Bar và trong trang Sổ Tay / Leitner Box bằng chuẩn `progress-indicator segmented` của 98.css:

```html
<div class="progress-indicator segmented" style="width: 140px; height: 16px;">
  <span class="progress-indicator-bar" id="top-progress-fill" style="width: 35%;"></span>
</div>
```

### 3.10. Ô Nhập Liệu, Địa Chỉ Web & Trình Soạn Thảo (`field-row`, `field-row-stacked`, `sunken-panel`)
- Thanh địa chỉ trình duyệt thập niên 2000 (`#browser-address-bar`) dùng `<div class="field-row">` chứa `<label for="address-input">Address</label>`, `<input id="address-input" type="text" value="chm://bikip-csdl-v2005/toc">` và `<button class="default" id="btn-address-go">Go</button>`.
- Khung gõ lệnh SQL (`#sql-editor`) và khung ghi chú 3 dòng dùng `<div class="field-row-stacked">` kết hợp viền chìm 98.css.

## 4. Luật Tương Thích 4 Giao Diện (4-Theme Bridge Law)

Ứng dụng có 4 chế độ màu (`theme-classic`, `theme-xp`, `theme-borland`, `theme-crt`) định nghĩa trong `assets/css/themes.css`. Vì `98.css` mặc định gán cứng một số màu nền xám `#c0c0c0` và chữ đen `#222222`, Agent **bắt buộc** phải tạo file `assets/css/retro-98-browser.css` để ánh xạ biến màu `--bg-window`, `--bg-panel`, `--text-main`, `--title-grad-start`, `--title-grad-end` vào các class `.window`, `.title-bar`, `.window-body`, `ul.tree-view`, `.sunken-panel`, `menu[role="tablist"]` khi người dùng chuyển sang `body.theme-borland` (Xanh Borland C++ 3.1) hoặc `body.theme-crt` (Màn hình Photpho Xanh lá).

## 5. Quy Trình Kiểm Tra Chất Lượng Trước Khi Hoàn Tất (Definition of Done)

Trước khi báo cáo hoàn thành mỗi Task trong `TASKS.md`, Agent phải tự kiểm tra:
1. Mở `index.html` trực tiếp từ ổ cứng (`file://`), không có bất kỳ lỗi `ReferenceError`, `SyntaxError`, hay `CORS` nào trong Console.
2. Kiểm tra `window.BiKipRegistry.buildGlobalData()` trả về đủ:
   - `chapters.length === 15` (cộng với `ch0_html` là 16 chương từ Ch00 đến Ch15).
   - `labs.databases.length === 7` (`TruongHoc`, `ShopOnline`, `Library`, `Countries`, `AutoShop`, `LeetCode`, `FruitStore`).
   - `Object.keys(simulators).length === 6` (`join`, `exec_order`, `btree`, `isolation`, `normalization`, `injection`).
   - `interview_bank.length === 48` và `leetcode_challenges.length === 12`.
3. Mọi Checkbox, Radio button, TreeView, TabList, Sunken Table, Window Title Bar, Status Bar và Segmented Progress Bar đều hiển thị đúng chuẩn pixel 3D bevel của **98.css**.
