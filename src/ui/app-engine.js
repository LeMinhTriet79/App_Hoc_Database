/**
 * ==========================================================================
 * FILE: src/ui/app-engine.js
 * MÔ TẢ: Động cơ điều khiển giao diện Trình duyệt Web 2000s & MSDN CHM Viewer
 * BAO GỒM TOÀN BỘ LOGIC CỦA:
 *   - TASK 08: Core State, LocalStorage, History, 2000s Browser Address Bar & 98.css TreeView
 *   - TASK 09: SQLite WASM Runner (7 DBs), Sunken Table & Deterministic Auto-Grader
 *   - TASK 10: 6 Simulators Controls, Leitner 3-Box, Sổ Tay 3 Dòng, Tracks & Phím Tắt
 * KIẾN TRÚC: Zero-Bundler file:// execution, nạp qua thẻ <script> cuối cùng
 * ==========================================================================
 */
(function(global) {
  "use strict";

  // Nạp toàn bộ dữ liệu từ Registry trung tâm
  var DATA = null;
  if (global.BiKipRegistry && typeof global.BiKipRegistry.buildGlobalData === "function") {
    DATA = global.BiKipRegistry.buildGlobalData();
  } else if (global.BIKIP_REGISTRY && typeof global.BIKIP_REGISTRY.buildDataObject === "function") {
    DATA = global.BIKIP_REGISTRY.buildDataObject();
  } else {
    console.error("[FATAL] Không tìm thấy window.BiKipRegistry!");
    return;
  }

  /* ========================================================================
     1. QUẢN LÝ TRẠNG THÁI (CORE STATE & LOCALSTORAGE)
     ======================================================================== */
  var STORAGE_KEY = "bikip_sql_v2005_store_v1";

  var defaultState = {
    theme: "classic",
    crtScanlines: false,
    fontSize: 15,
    completedItems: {},
    leitnerBoxes: {}, // { [cardId]: 1 | 2 | 3 }
    notes3Line: {},   // { [chapterId]: string }
    lastView: "toc",
    lastChapterId: "ch01",
    activeDbId: "fruitstore",
    activeSimulatorId: "join",
    activeTrackId: "mysql",
    activeLeftTab: "toc"
  };

  var state = Object.assign({}, defaultState);

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        Object.assign(state, parsed);
      }
    } catch (e) {
      console.warn("Không thể đọc LocalStorage:", e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Không thể ghi LocalStorage:", e);
    }
  }

  loadState();

  /* ========================================================================
     2. LỊCH SỬ DUYỆT BÀI (BROWSER HISTORY STACK)
     ======================================================================== */
  var historyStack = [];
  var historyIndex = -1;

  function pushHistory(view, param) {
    if (historyIndex >= 0 && historyIndex < historyStack.length) {
      var current = historyStack[historyIndex];
      if (current.view === view && current.param === param) {
        return; // Không đẩy mục trùng lặp liên tiếp
      }
    }
    // Cắt bỏ nhánh forward cũ nếu đang ở giữa lịch sử
    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push({ view: view, param: param });
    historyIndex = historyStack.length - 1;
    updateNavButtonsState();
  }

  function updateNavButtonsState() {
    var btnBack = document.getElementById("btn-nav-back");
    var btnFwd = document.getElementById("btn-nav-forward");
    if (btnBack) btnBack.disabled = historyIndex <= 0;
    if (btnFwd) btnFwd.disabled = historyIndex >= historyStack.length - 1;
  }

  /* ========================================================================
     3. ĐỘNG CƠ CƠ SỞ DỮ LIỆU SQLITE WASM (TASK 09)
     ======================================================================== */
  var SQL = null;
  var sqlDatabases = {};
  var sqlEngineReady = false;

  function initSqlEngine(callback) {
    updateStatusCell(3, "🗄️ SQLite WASM: Đang khởi tạo...");
    if (typeof global.initSqlJs !== "function") {
      updateStatusCell(3, "🗄️ SQLite WASM: Offline Demo (CDN Unreachable)");
      if (callback) callback(false);
      return;
    }

    global.initSqlJs({
      locateFile: function(file) {
        return "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/" + file;
      }
    }).then(function(sqlModule) {
      SQL = sqlModule;
      sqlEngineReady = true;

      // Khởi tạo cả 7 cơ sở dữ liệu mẫu trong RAM
      var dbs = (DATA.labs && DATA.labs.databases) ? DATA.labs.databases : [];
      dbs.forEach(function(dbMeta) {
        try {
          var dbInst = new SQL.Database();
          if (dbMeta.schema_sql) dbInst.run(dbMeta.schema_sql);
          if (dbMeta.seed_sql) dbInst.run(dbMeta.seed_sql);
          sqlDatabases[dbMeta.id] = dbInst;
        } catch (err) {
          console.error("Lỗi khởi tạo DB: " + dbMeta.id, err);
        }
      });

      updateStatusCell(3, "🗄️ SQLite WASM: Sẵn sàng (" + dbs.length + " DBs)");
      updateOverallProgress();
      if (callback) callback(true);
    }).catch(function(err) {
      console.warn("Lỗi tải SQLite WebAssembly:", err);
      updateStatusCell(3, "🗄️ SQLite WASM: Chế độ Fallback");
      if (callback) callback(false);
    });
  }

  function resetDatabase(dbId) {
    if (!sqlEngineReady || !SQL) return;
    var dbs = (DATA.labs && DATA.labs.databases) ? DATA.labs.databases : [];
    var dbMeta = dbs.find(function(d) { return d.id === dbId; });
    if (!dbMeta) return;

    try {
      if (sqlDatabases[dbId]) {
        sqlDatabases[dbId].close();
      }
      var dbInst = new SQL.Database();
      if (dbMeta.schema_sql) dbInst.run(dbMeta.schema_sql);
      if (dbMeta.seed_sql) dbInst.run(dbMeta.seed_sql);
      sqlDatabases[dbId] = dbInst;
      showToast("Đã khôi phục CSDL " + (dbMeta.name || dbId) + " về trạng thái ban đầu!");
    } catch (e) {
      showToast("Lỗi khi reset database: " + e.message, true);
    }
  }

  function runSqlQuery(dbId, query) {
    if (!sqlEngineReady || !sqlDatabases[dbId]) {
      throw new Error("Động cơ SQLite WASM chưa sẵn sàng hoặc không tìm thấy CSDL " + dbId);
    }
    var startTime = performance.now();
    var results = sqlDatabases[dbId].exec(query);
    var duration = (performance.now() - startTime).toFixed(2);

    return {
      results: results,
      duration: duration
    };
  }

  /* ========================================================================
     4. MÁY CHẤM BÀI TỰ ĐỘNG (DETERMINISTIC SQL AUTO-GRADER)
     ======================================================================== */
  function normalizeVal(val) {
    if (val === null || val === undefined) return null;
    if (typeof val === "number") return Number(val.toFixed(4));
    var str = String(val).trim();
    var num = Number(str);
    if (!isNaN(num) && str !== "") return Number(num.toFixed(4));
    return str.toLowerCase();
  }

  function gradeSqlProblem(problem, userSql) {
    if (!sqlEngineReady) {
      return { pass: false, msg: "SQLite WASM chưa nạp xong. Vui lòng thử lại sau vài giây." };
    }

    var dbId = problem.db || state.activeDbId;
    if (!sqlDatabases[dbId]) {
      return { pass: false, msg: "Không tìm thấy CSDL: " + dbId };
    }

    var cleanSql = (userSql || "").trim();
    if (!cleanSql) {
      return { pass: false, msg: "Bạn chưa nhập câu lệnh SQL nào!" };
    }

    // 1. Kiểm tra từ khóa bắt buộc (required_keywords)
    if (Array.isArray(problem.required_keywords)) {
      for (var i = 0; i < problem.required_keywords.length; i++) {
        var kw = problem.required_keywords[i];
        var reg = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        if (!reg.test(cleanSql)) {
          return { pass: false, msg: "Câu lệnh của bạn bắt buộc phải sử dụng từ khóa: " + kw };
        }
      }
    }

    // 2. Kiểm tra từ khóa bị cấm (forbidden_keywords)
    if (Array.isArray(problem.forbidden_keywords)) {
      for (var j = 0; j < problem.forbidden_keywords.length; j++) {
        var fkw = problem.forbidden_keywords[j];
        var fReg = new RegExp(fkw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        if (fReg.test(cleanSql)) {
          return { pass: false, msg: "Câu lệnh vi phạm quy tắc: CẤM sử dụng từ khóa " + fkw };
        }
      }
    }

    // 3. Thực thi câu lệnh của người dùng
    var userExec;
    try {
      userExec = sqlDatabases[dbId].exec(cleanSql);
    } catch (err) {
      return { pass: false, msg: "Lỗi cú pháp SQL: " + err.message };
    }

    if (!userExec || userExec.length === 0) {
      // Trường hợp không trả về dòng nào
      if (!problem.solution_sql) {
        return { pass: false, msg: "Câu lệnh không trả về tập kết quả nào." };
      }
    }

    var userRes = userExec[0] || { columns: [], values: [] };

    // 4. Lấy kết quả chuẩn từ solution_sql
    var solExec;
    try {
      solExec = sqlDatabases[dbId].exec(problem.solution_sql);
    } catch (solErr) {
      return { pass: false, msg: "Lỗi nội bộ khi chạy đáp án chuẩn: " + solErr.message };
    }

    var solRes = solExec[0] || { columns: [], values: [] };

    // 5. Đối chiếu số cột
    if (userRes.columns.length !== solRes.columns.length) {
      return {
        pass: false,
        msg: "Số cột kết quả không khớp: Bạn trả về " + userRes.columns.length + " cột, nhưng đáp án yêu cầu " + solRes.columns.length + " cột."
      };
    }

    // 6. Đối chiếu số dòng
    if (userRes.values.length !== solRes.values.length) {
      return {
        pass: false,
        msg: "Số dòng kết quả không khớp: Câu lệnh trả về " + userRes.values.length + " dòng (đáp án chuẩn có " + solRes.values.length + " dòng)."
      };
    }

    // 7. Đối chiếu giá trị từng dòng
    var userRows = userRes.values.map(function(r) { return r.map(normalizeVal); });
    var solRows = solRes.values.map(function(r) { return r.map(normalizeVal); });

    if (problem.order_matters === false) {
      var sortFn = function(a, b) { return JSON.stringify(a).localeCompare(JSON.stringify(b)); };
      userRows.sort(sortFn);
      solRows.sort(sortFn);
    }

    for (var r = 0; r < solRows.length; r++) {
      for (var c = 0; c < solRows[r].length; c++) {
        if (userRows[r][c] !== solRows[r][c]) {
          return {
            pass: false,
            msg: "Dữ liệu dòng #" + (r + 1) + " cột '" + userRes.columns[c] + "' chưa đúng: Nhận được '" + userRes.values[r][c] + "', kỳ vọng '" + solRes.values[r][c] + "'."
          };
        }
      }
    }

    return {
      pass: true,
      msg: "XUẤT SẮC! Kết quả hoàn toàn trùng khớp 100% với đáp án chuẩn của phòng Lab.",
      rowCount: userRes.values.length,
      colCount: userRes.columns.length
    };
  }

  /* ========================================================================
     5. CẬP NHẬT GIAO DIỆN CHÍNH, TIẾN ĐỘ & STATUS BAR
     ======================================================================== */
  function updateStatusCell(cellIndex, text) {
    var el = document.getElementById("status-cell-" + cellIndex);
    if (el) el.textContent = text;
  }

  function updateOverallProgress() {
    var completedCount = Object.keys(state.completedItems).length;
    var totalProblems = (DATA.toc && DATA.toc.total_problems) ? DATA.toc.total_problems : 77;
    var percent = Math.min(100, Math.round((completedCount / totalProblems) * 100));

    var fillEl = document.getElementById("top-progress-fill");
    var textEl = document.getElementById("top-progress-text");
    if (fillEl) fillEl.style.width = percent + "%";
    if (textEl) textEl.textContent = "Tiến độ: " + percent + "% (" + completedCount + "/" + totalProblems + ")";

    if (sqlEngineReady) {
      var dbsCount = (DATA.labs && DATA.labs.databases) ? DATA.labs.databases.length : 7;
      updateStatusCell(3, "🗄️ SQLite: Ready (" + dbsCount + " DBs) | " + percent + "%");
    }
  }

  function showToast(message, isError) {
    var container = document.getElementById("toast-container");
    if (!container) return;

    var toast = document.createElement("div");
    toast.className = "window retro-toast";
    toast.innerHTML = '<div class="title-bar">' +
      '<div class="title-bar-text">' + (isError ? '⚠️ Cảnh báo' : '💡 Thông báo') + '</div>' +
      '<div class="title-bar-controls"><button aria-label="Close"></button></div>' +
      '</div>' +
      '<div class="window-body">' + message + '</div>';

    var closeBtn = toast.querySelector('button[aria-label="Close"]');
    if (closeBtn) {
      closeBtn.onclick = function() { toast.remove(); };
    }

    container.appendChild(toast);
    setTimeout(function() {
      if (toast.parentNode) toast.remove();
    }, 4500);
  }

  function updateAddressBar(virtualUrl) {
    var input = document.getElementById("address-input");
    if (input) input.value = virtualUrl;
    updateStatusCell(1, "🌐 Done — " + virtualUrl);

    var throbber = document.getElementById("ie-throbber");
    if (throbber) {
      throbber.classList.add("loading");
      setTimeout(function() { throbber.classList.remove("loading"); }, 350);
    }
  }

  /* ========================================================================
     6. RENDER CỘT TRÁI (LEFT PANE TABS: TOC TREE, INDEX, SEARCH)
     ======================================================================== */
  function renderLeftTocTree() {
    var container = document.getElementById("toc-tree-container");
    if (!container) return;

    var html = '';
    html += '<li><a href="#toc" class="tree-item-link ' + (state.lastView === "toc" ? "active" : "") + '" data-nav-view="toc">🏠 Bảng Mục Lục Tổng Quan</a></li>';

    // Nhóm 1: Phần I (Ch00 - Ch05)
    html += '<li><details open><summary>📘 Phần I: Nền Tảng &amp; Truy Vấn Cốt Lõi (Ch00 - Ch05)</summary><ul>';
    html += '<li><a href="#ch00" class="tree-item-link" data-nav-ch="ch00">Chương 0: Nền Tảng Cơ Sở Dữ Liệu</a></li>';
    for (var i = 1; i <= 5; i++) {
      var chId = "ch0" + i;
      var chObj = (DATA.chapters || []).find(function(c) { return c.id === chId; });
      if (chObj) {
        html += '<li><details><summary><a href="#' + chId + '" class="tree-item-link" data-nav-ch="' + chId + '">' + (chObj.code || chId) + ': ' + chObj.title + '</a></summary><ul>';
        html += '<li><a href="#' + chId + '-s1" class="tree-item-link" data-scroll-sec="sec-goals">1. Mục tiêu &amp; Dấu hiệu</a></li>';
        html += '<li><a href="#' + chId + '-s2" class="tree-item-link" data-scroll-sec="sec-theory">2. Lý thuyết nền tảng</a></li>';
        html += '<li><a href="#' + chId + '-s3" class="tree-item-link" data-scroll-sec="sec-mechanism">3. Cơ chế chạy tay</a></li>';
        html += '<li><a href="#' + chId + '-s4" class="tree-item-link" data-scroll-sec="sec-examples">4. Cú pháp &amp; Ví dụ (' + (chObj.examples ? chObj.examples.length : 0) + ')</a></li>';
        html += '<li><a href="#' + chId + '-s5" class="tree-item-link" data-scroll-sec="sec-dialects">5. Khác biệt phương ngữ</a></li>';
        html += '<li><a href="#' + chId + '-s6" class="tree-item-link" data-scroll-sec="sec-bridge">6. Cầu nối Java &amp; C#</a></li>';
        html += '<li><a href="#' + chId + '-s7" class="tree-item-link" data-scroll-sec="sec-perf">7. Hiệu năng &amp; Chi phí</a></li>';
        html += '<li><a href="#' + chId + '-s8" class="tree-item-link" data-scroll-sec="sec-errors">8. Lỗi hay gặp</a></li>';
        html += '<li><a href="#' + chId + '-s9" class="tree-item-link" data-scroll-sec="sec-interview">9. Câu hỏi phỏng vấn</a></li>';
        html += '<li><a href="#' + chId + '-s10" class="tree-item-link" data-scroll-sec="sec-exercises">10. Bài tập tự chấm</a></li>';
        html += '<li><a href="#' + chId + '-s11" class="tree-item-link" data-scroll-sec="sec-summary">11. Tổng kết &amp; Trắc nghiệm</a></li>';
        html += '</ul></details></li>';
      }
    }
    html += '</ul></details></li>';

    // Nhóm 2: Phần II (Ch06 - Ch10)
    html += '<li><details open><summary>📗 Phần II: Thiết Kế, Lập Trình &amp; Quản Trị (Ch06 - Ch10)</summary><ul>';
    for (var j = 6; j <= 10; j++) {
      var chId2 = (j < 10 ? "ch0" : "ch") + j;
      var chObj2 = (DATA.chapters || []).find(function(c) { return c.id === chId2; });
      if (chObj2) {
        html += '<li><a href="#' + chId2 + '" class="tree-item-link" data-nav-ch="' + chId2 + '">' + (chObj2.code || chId2) + ': ' + chObj2.title + '</a></li>';
      }
    }
    html += '</ul></details></li>';

    // Nhóm 3: Phần III (Ch11 - Ch14)
    html += '<li><details open><summary>📙 Phần III: Bảo Mật, Backend &amp; Phỏng Vấn (Ch11 - Ch14)</summary><ul>';
    for (var k = 11; k <= 14; k++) {
      var chId3 = "ch" + k;
      var chObj3 = (DATA.chapters || []).find(function(c) { return c.id === chId3; });
      if (chObj3) {
        html += '<li><a href="#' + chId3 + '" class="tree-item-link" data-nav-ch="' + chId3 + '">' + (chObj3.code || chId3) + ': ' + chObj3.title + '</a></li>';
      }
    }
    html += '</ul></details></li>';

    // Nhóm 4: Chương 15
    var ch15 = (DATA.chapters || []).find(function(c) { return c.id === "ch15"; });
    if (ch15) {
      html += '<li><a href="#ch15" class="tree-item-link" data-nav-ch="ch15">🍍 Chương 15: Từ Điển T-SQL &amp; FruitStore Lab</a></li>';
    }

    // Nhóm 5: Các Phân Khu Chức Năng
    html += '<li><details open><summary>🛠️ Phòng Thực Hành &amp; Công Cụ Chuyên Sâu</summary><ul>';
    html += '<li><a href="#lab" class="tree-item-link" data-nav-view="lab">🧪 Phòng Lab SQL (SQLite WASM 7 DBs)</a></li>';
    html += '<li><a href="#simulators" class="tree-item-link" data-nav-view="simulators">⚙️ 6 Bộ Mô Phỏng Trực Quan Tương Tác</a></li>';
    html += '<li><a href="#interview" class="tree-item-link" data-nav-view="interview">🎯 Luyện Phỏng Vấn Leitner &amp; 12 LeetCode SQL</a></li>';
    html += '<li><a href="#notes" class="tree-item-link" data-nav-view="notes">📝 Sổ Tay 3 Dòng &amp; Quản Lý Tiến Độ</a></li>';
    html += '<li><a href="#tracks" class="tree-item-link" data-nav-view="tracks">🚀 Lộ Trình Mở Rộng (MySQL, Postgres, NoSQL)</a></li>';
    html += '<li><a href="#appendices" class="tree-item-link" data-nav-view="appendices">📑 Phụ Lục Tra Cứu A – F &amp; Bản Quyền</a></li>';
    html += '</ul></details></li>';

    container.innerHTML = html;
  }

  function renderLeftIndex() {
    var container = document.getElementById("index-list-container");
    if (!container) return;

    var keywords = [
      { kw: "ACID (Atomicity, Consistency, Isolation, Durability)", ch: "ch09" },
      { kw: "B-Tree Index (Clustered & Non-Clustered)", ch: "ch08" },
      { kw: "COALESCE vs ISNULL", ch: "ch02" },
      { kw: "Common Table Expression (CTE) & Đệ quy", ch: "ch05" },
      { kw: "CROSS APPLY / OUTER APPLY", ch: "ch13" },
      { kw: "Deadlock (Error 1205) & Phòng ngừa", ch: "ch09" },
      { kw: "DENSE_RANK() vs RANK() vs ROW_NUMBER()", ch: "ch05" },
      { kw: "FruitStore Enterprise Lab & JSON", ch: "ch15" },
      { kw: "GROUP BY & HAVING", ch: "ch04" },
      { kw: "Index Seek vs Table Scan & SARGability", ch: "ch08" },
      { kw: "JOIN (INNER, LEFT, RIGHT, FULL, CROSS)", ch: "ch03" },
      { kw: "Keyset Pagination (Seek Method)", ch: "ch05" },
      { kw: "LeetCode 12 Bài Toán SQL Kinh Điển", ch: "ch14" },
      { kw: "N+1 Query Problem trong ORM", ch: "ch12" },
      { kw: "NULL & Three-Valued Logic (3VL)", ch: "ch01" },
      { kw: "PIVOT & UNPIVOT", ch: "ch13" },
      { kw: "RCSI (Read Committed Snapshot)", ch: "ch09" },
      { kw: "SQL Injection & Parameterized Queries", ch: "ch11" },
      { kw: "Temporal Tables (System-Versioned)", ch: "ch13" },
      { kw: "Thứ tự thực thi 9 bước của SELECT", ch: "ch01" },
      { kw: "Trigger (AFTER, INSTEAD OF, inserted/deleted)", ch: "ch10" },
      { kw: "Views & Indexed Views", ch: "ch10" }
    ];

    var input = document.getElementById("index-filter-input");
    var filter = input ? input.value.toLowerCase().trim() : "";

    var html = '<ul class="tree-view">';
    keywords.forEach(function(item) {
      if (!filter || item.kw.toLowerCase().indexOf(filter) !== -1) {
        html += '<li><a href="#' + item.ch + '" class="tree-item-link" data-nav-ch="' + item.ch + '">📌 ' + item.kw + '</a></li>';
      }
    });
    html += '</ul>';
    container.innerHTML = html;
  }

  function runFulltextSearch(query) {
    var container = document.getElementById("search-results-container");
    if (!container) return;

    var q = (query || "").toLowerCase().trim();
    if (!q) {
      container.innerHTML = '<p class="status-bar-field" style="border:none;">Nhập từ khóa phía trên để tìm kiếm...</p>';
      return;
    }

    var matches = [];

    // Tìm trong 16 chương
    (DATA.chapters || []).forEach(function(ch) {
      var str = JSON.stringify(ch).toLowerCase();
      if (str.indexOf(q) !== -1) {
        matches.push({
          type: "Chương",
          id: ch.id,
          title: (ch.code || ch.id) + ": " + ch.title,
          desc: (ch.goals && ch.goals[0]) ? ch.goals[0] : "Nhấn để mở chương..."
        });
      }
    });

    // Tìm trong 6 simulators
    if (DATA.simulators) {
      Object.keys(DATA.simulators).forEach(function(simKey) {
        var sim = DATA.simulators[simKey];
        var sStr = JSON.stringify(sim).toLowerCase();
        if (sStr.indexOf(q) !== -1) {
          matches.push({
            type: "Mô phỏng",
            view: "simulators",
            param: simKey,
            title: "⚙️ Simulator: " + sim.title,
            desc: sim.desc || ""
          });
        }
      });
    }

    // Tìm trong 48 câu hỏi phỏng vấn
    (DATA.interview_bank || []).forEach(function(card) {
      if (card.q.toLowerCase().indexOf(q) !== -1 || card.a.toLowerCase().indexOf(q) !== -1 || card.topic.toLowerCase().indexOf(q) !== -1) {
        matches.push({
          type: "Phỏng vấn",
          view: "interview",
          param: card.id,
          title: "🎯 [" + card.level + "] " + card.topic,
          desc: card.q
        });
      }
    });

    if (matches.length === 0) {
      container.innerHTML = '<p style="padding:8px; color:var(--text-muted);">Không tìm thấy kết quả nào khớp với: "<b>' + q + '</b>"</p>';
      return;
    }

    var html = '<div style="font-size:11px; margin-bottom:4px; font-weight:bold;">Tìm thấy ' + matches.length + ' kết quả:</div><ul class="tree-view">';
    matches.forEach(function(m) {
      if (m.id) {
        html += '<li><a href="#' + m.id + '" class="tree-item-link" data-nav-ch="' + m.id + '"><b>[' + m.type + ']</b> ' + m.title + '<br><small style="color:var(--text-muted);">' + m.desc.substring(0, 75) + '...</small></a></li>';
      } else {
        html += '<li><a href="#' + m.view + '" class="tree-item-link" data-nav-view="' + m.view + '" data-param="' + (m.param || '') + '"><b>[' + m.type + ']</b> ' + m.title + '<br><small style="color:var(--text-muted);">' + m.desc.substring(0, 75) + '...</small></a></li>';
      }
    });
    html += '</ul>';
    container.innerHTML = html;
  }

  /* ========================================================================
     7. CÁC HÀM RENDER KHUNG ĐỌC NỘI DUNG (#reading-pane)
     ======================================================================== */
  function renderTocView() {
    state.lastView = "toc";
    updateAddressBar("chm://bikip-csdl-v2005/index.htm");
    updateStatusCell(2, "📂 Bảng Mục Lục Tổng Quan (16 Chương)");

    var pane = document.getElementById("reading-pane");
    if (!pane) return;

    var toc = DATA.toc || {};
    var html = '<div class="toc-home-wrap">';
    html += '<div class="ch-banner">' +
      '<div class="ch-code">MSDN HTML HELP // EDITION v2005</div>' +
      '<h1>' + (toc.title || "Bí Kíp Cơ Sở Dữ Liệu SQL Server & Phòng Lab Thực Chiến") + '</h1>' +
      '<div class="ch-source">' + (toc.subtitle || "Dành Cho Sinh Viên Backend Java & .NET") + '</div>' +
      '</div>';

    // 4 Ô Thống Kê Nhanh
    html += '<div class="dashboard-stats" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:8px; margin: 12px 0;">' +
      '<fieldset class="retro-groupbox"><legend>📚 Giáo trình</legend><b>16 Chương</b><br><small>Ch00 đến Ch15</small></fieldset>' +
      '<fieldset class="retro-groupbox"><legend>🧪 Phòng Lab</legend><b>7 CSDL Mẫu</b><br><small>SQLite WASM</small></fieldset>' +
      '<fieldset class="retro-groupbox"><legend>⚙️ Mô phỏng</legend><b>6 Simulators</b><br><small>Trực quan tương tác</small></fieldset>' +
      '<fieldset class="retro-groupbox"><legend>🎯 Phỏng vấn</legend><b>48 Flashcards</b><br><small>12 LeetCode SQL</small></fieldset>' +
      '</div>';

    // Danh sách 16 chương
    html += '<h2>Danh Mục Các Chương Giáo Trình</h2>';
    html += '<div class="sunken-panel" style="padding:6px; background:var(--bg-panel);">';
    html += '<table class="interactive chm-table"><thead><tr><th>Mã</th><th>Tên Chương Học</th><th>Ghi Chú</th><th>Hành Động</th></tr></thead><tbody>';

    html += '<tr><td><b>CHƯƠNG 0</b></td><td><b>Nền Tảng Cơ Sở Dữ Liệu &amp; Cài Đặt Môi Trường</b></td><td>Cài đặt Docker, SQL Server &amp; giới thiệu CSDL</td><td><button class="default" data-nav-ch="ch00">Mở bài học</button></td></tr>';

    var chs = (DATA.chapters || []);
    chs.forEach(function(c) {
      html += '<tr>' +
        '<td><b>' + (c.code || c.id) + '</b></td>' +
        '<td><a href="#' + c.id + '" data-nav-ch="' + c.id + '" style="font-weight:bold; color:var(--accent); text-decoration:none;">' + c.title + '</a><br><small style="color:var(--text-muted);">' + ((c.goals && c.goals[0]) ? c.goals[0] : "") + '</small></td>' +
        '<td>' + ((c.examples ? c.examples.length : 0) + ' ví dụ, ' + ((c.basics ? c.basics.length : 0) + (c.practice ? c.practice.length : 0)) + ' bài tập') + '</td>' +
        '<td><button data-nav-ch="' + c.id + '">Học ngay</button></td>' +
        '</tr>';
    });

    html += '</tbody></table></div>';
    html += '</div>';

    pane.innerHTML = html;
    pane.scrollTop = 0;
  }

  function renderChapterView(chapterId) {
    state.lastView = "chapter";
    state.lastChapterId = chapterId;
    updateAddressBar("chm://bikip-csdl-v2005/chapters/" + chapterId + ".htm");

    var pane = document.getElementById("reading-pane");
    if (!pane) return;

    if (chapterId === "ch00") {
      updateStatusCell(2, "📘 Chương 0: Nền Tảng CSDL");
      pane.innerHTML = DATA.ch0_html || "<p>Chưa có nội dung Chương 0.</p>";
      pane.scrollTop = 0;
      return;
    }

    var ch = (DATA.chapters || []).find(function(c) { return c.id === chapterId; });
    if (!ch) {
      pane.innerHTML = '<div class="callout-warn">Không tìm thấy nội dung chương: ' + chapterId + '</div>';
      return;
    }

    updateStatusCell(2, "📘 " + (ch.code || ch.id) + ": " + ch.title);

    var html = '<div class="chapter-content-wrap">';

    // Banner
    html += '<div class="ch-banner">' +
      '<div class="ch-code">' + (ch.code || chapterId).toUpperCase() + '</div>' +
      '<h1>' + ch.title + '</h1>' +
      '<div class="ch-source">Tài liệu tham khảo: ' + (Array.isArray(ch.sources) ? ch.sources.join("; ") : (ch.sources || "Giáo trình tiêu chuẩn")) + '</div>' +
      '</div>';

    // Mục 1: Mục tiêu & Dấu hiệu nhận biết
    html += '<section class="section-card" id="sec-goals"><h2>1. Mục Tiêu &amp; Dấu Hiệu Nhận Biết</h2>';
    if (ch.goals && ch.goals.length) {
      html += '<h3>Mục tiêu cốt lõi:</h3><ul>';
      ch.goals.forEach(function(g) { html += '<li>' + g + '</li>'; });
      html += '</ul>';
    }
    if (ch.signals && ch.signals.length) {
      html += '<h3>Khi nào cần dùng (Dấu hiệu thực tế):</h3><ul>';
      ch.signals.forEach(function(s) { html += '<li>' + s + '</li>'; });
      html += '</ul>';
    }
    html += '</section>';

    // Mục 2: Lý thuyết nền tảng
    if (ch.theory) {
      html += '<section class="section-card" id="sec-theory"><h2>2. Lý Thuyết Nền Tảng &amp; Cú Pháp</h2>';
      if (typeof ch.theory === "string") {
        html += ch.theory;
      } else if (Array.isArray(ch.theory)) {
        ch.theory.forEach(function(sec) {
          html += '<h3>' + sec.title + '</h3><div>' + (sec.content || sec.html || '') + '</div>';
        });
      } else if (typeof ch.theory === "object") {
        Object.keys(ch.theory).forEach(function(k) {
          html += '<div>' + ch.theory[k] + '</div>';
        });
      }
      html += '</section>';
    }

    // Mục 3: Cơ chế & Chạy tay từng bước
    if (ch.mechanism) {
      html += '<section class="section-card" id="sec-mechanism"><h2>3. Cơ Chế Hoạt Động &amp; Chạy Tay Từng Bước</h2>';
      html += '<div>' + (typeof ch.mechanism === "string" ? ch.mechanism : JSON.stringify(ch.mechanism)) + '</div>';
      html += '</section>';
    }

    // Mục 4: Ví dụ thực tế
    if (ch.examples && ch.examples.length) {
      html += '<section class="section-card" id="sec-examples"><h2>4. Cú Pháp &amp; Các Ví Dụ Thực Tế (' + ch.examples.length + ')</h2>';
      ch.examples.forEach(function(ex, idx) {
        html += '<fieldset class="retro-groupbox"><legend>Ví dụ ' + (idx + 1) + ': ' + ex.title + '</legend>';
        html += '<pre class="code-block"><code>' + (ex.sql || '') + '</code></pre>';
        if (ex.note) html += '<p><i>Ghi chú:</i> ' + ex.note + '</p>';
        if (ex.sql) {
          html += '<button data-push-lab-sql="' + encodeURIComponent(ex.sql) + '" data-lab-db="' + (ex.db || state.activeDbId) + '">🧪 Đẩy vào SQL Lab chạy thử</button>';
        }
        html += '</fieldset>';
      });
      html += '</section>';
    }

    // Mục 5: Khác biệt phương ngữ
    if (ch.dialects && ch.dialects.length) {
      html += '<section class="section-card" id="sec-dialects"><h2>5. Khác Biệt Phương Ngữ (T-SQL vs SQLite vs Postgres/MySQL)</h2>';
      html += '<div class="sunken-panel"><table class="interactive chm-table"><thead><tr><th>Tính năng</th><th>SQL Server (T-SQL)</th><th>SQLite (Lab)</th><th>PostgreSQL / MySQL</th></tr></thead><tbody>';
      ch.dialects.forEach(function(d) {
        html += '<tr><td><b>' + (d.feature || '') + '</b></td><td><code>' + (d.tsql || '') + '</code></td><td><code>' + (d.sqlite || '') + '</code></td><td><code>' + (d.postgres_mysql || d.other || '') + '</code></td></tr>';
      });
      html += '</tbody></table></div></section>';
    }

    // Mục 6: Cầu nối Java & C#
    html += '<section class="section-card" id="sec-bridge"><h2>6. Cầu Nối Backend Java (JDBC / JPA) &amp; C# (.NET / EF Core)</h2>';
    if (ch.bridge_java) {
      html += '<fieldset class="retro-groupbox"><legend>☕ Java (JDBC / Spring Data JPA)</legend><div>' + ch.bridge_java + '</div></fieldset>';
    }
    if (ch.bridge_csharp) {
      html += '<fieldset class="retro-groupbox"><legend>🔷 C# (.NET / Dapper / Entity Framework Core)</legend><div>' + ch.bridge_csharp + '</div></fieldset>';
    }
    html += '</section>';

    // Mục 7: Hiệu năng & Chi phí
    if (ch.performance) {
      html += '<section class="section-card" id="sec-perf"><h2>7. Hiệu Năng, Chi Phí I/O &amp; Execution Plan</h2><div>' + ch.performance + '</div></section>';
    }

    // Mục 8: Lỗi hay gặp
    if (ch.common_errors && ch.common_errors.length) {
      html += '<section class="section-card" id="sec-errors"><h2>8. Các Bẫy &amp; Lỗi Hay Gặp Cần Tránh</h2>';
      ch.common_errors.forEach(function(err, idx) {
        html += '<fieldset class="retro-groupbox"><legend>Lỗi #' + (idx + 1) + ': ' + (err.title || err.name || 'Cảnh báo') + '</legend>';
        if (err.wrong) html += '<p style="color:var(--err-color);">❌ <b>Cách viết sai:</b> <code>' + err.wrong + '</code></p>';
        if (err.right) html += '<p style="color:var(--ok-color);">✅ <b>Cách viết đúng:</b> <code>' + err.right + '</code></p>';
        if (err.why) html += '<p><i>Giải thích:</i> ' + err.why + '</p>';
        html += '</fieldset>';
      });
      html += '</section>';
    }

    // Mục 9: Phỏng vấn
    if (ch.interview && ch.interview.length) {
      html += '<section class="section-card" id="sec-interview"><h2>9. Câu Hỏi Phỏng Vấn Doanh Nghiệp</h2>';
      ch.interview.forEach(function(iv, idx) {
        html += '<fieldset class="retro-groupbox"><legend>Câu hỏi ' + (idx + 1) + ' [' + (iv.level || 'Junior') + ']</legend>';
        html += '<p><b>Hỏi:</b> ' + (iv.q || '') + '</p>';
        html += '<details><summary><b>Xem câu trả lời chuẩn &amp; câu hỏi xoáy</b></summary>';
        html += '<p><b>Trả lời:</b> ' + (iv.a || '') + '</p>';
        if (iv.followup) html += '<p style="color:var(--accent);"><b>Câu hỏi xoáy:</b> ' + iv.followup + '</p>';
        html += '</details></fieldset>';
      });
      html += '</section>';
    }

    // Mục 10: Bài tập tự chấm
    var exercises = (ch.basics || []).concat(ch.practice || []);
    if (exercises.length) {
      html += '<section class="section-card" id="sec-exercises"><h2>10. Bài Tập Thực Hành Có Chấm Tự Động (' + exercises.length + ' bài)</h2>';
      exercises.forEach(function(ex, idx) {
        var pId = ex.id || (ch.id + "_ex_" + idx);
        var isDone = !!state.completedItems[pId];
        html += '<fieldset class="retro-groupbox"><legend>' + (isDone ? '✅ ' : '📝 ') + 'Bài ' + (idx + 1) + ': ' + (ex.title || '') + '</legend>';
        html += '<p>' + (ex.problem || ex.summary || '') + '</p>';
        if (ex.hints && ex.hints.length) {
          html += '<details style="margin-bottom:8px;"><summary>💡 Xem 3 tầng gợi ý</summary><ul>';
          ex.hints.forEach(function(h) { html += '<li>' + h + '</li>'; });
          html += '</ul></details>';
        }
        html += '<button class="default" data-open-lab-problem="' + pId + '" data-ch="' + ch.id + '" data-db="' + (ex.db || state.activeDbId) + '">🧪 Mở trong Phòng Lab để viết code &amp; Chấm bài</button>';
        html += '</fieldset>';
      });
      html += '</section>';
    }

    // Mục 11: Tổng kết
    html += '<section class="section-card" id="sec-summary"><h2>11. Tổng Kết &amp; Ghi Chú 3 Dòng</h2>';
    html += '<p>Áp dụng <b>Quy tắc ghi chú 3 dòng</b>: Tóm tắt 3 điều đọng lại sâu sắc nhất từ chương này:</p>';
    var currentNote = state.notes3Line[ch.id] || "";
    html += '<div class="field-row-stacked">' +
      '<textarea id="ch-note-input" rows="3" placeholder="Dòng 1: Khái niệm mấu chốt...\nDòng 2: Cú pháp / Bẫy cần nhớ...\nDòng 3: Bài học thực chiến Java/C#..." style="width:100%; font-family:var(--font-mono);">' + currentNote + '</textarea>' +
      '<div style="margin-top:4px;"><button id="btn-save-note" data-ch="' + ch.id + '">💾 Lưu ghi chú (Tối đa 3 dòng)</button></div>' +
      '</div>';
    html += '</section>';

    html += '</div>';

    pane.innerHTML = html;
    pane.scrollTop = 0;
  }

  function renderLabView(dbId, problemId) {
    state.lastView = "lab";
    if (dbId) state.activeDbId = dbId;
    var currentDbId = state.activeDbId;

    updateAddressBar("chm://bikip-csdl-v2005/sql-lab/" + currentDbId);
    updateStatusCell(2, "🧪 Phòng Lab SQL: " + currentDbId);

    var pane = document.getElementById("reading-pane");
    if (!pane) return;

    var dbs = (DATA.labs && DATA.labs.databases) ? DATA.labs.databases : [];
    var currentDbMeta = dbs.find(function(d) { return d.id === currentDbId; }) || dbs[0] || {};

    var html = '<div class="lab-container">';
    html += '<div class="ch-banner">' +
      '<div class="ch-code">SQL LAB // SQLITE WASM DETERMINISTIC RUNNER</div>' +
      '<h1>Phòng Thực Hành SQL &amp; Máy Chấm Bài Tự Động</h1>' +
      '<div class="ch-source">Thực thi SQL trực tiếp trong trình duyệt | 0 Dependencies | Chuẩn ANSI &amp; SQLite</div>' +
      '</div>';

    // Toolbar chọn DB & Bài tập
    html += '<fieldset class="retro-groupbox"><legend>🗄️ Chọn Cơ Sở Dữ Liệu &amp; Đề Bài Thực Hành</legend>' +
      '<div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">' +
      '<div class="field-row" style="margin:0;"><label for="lab-db-select"><b>CSDL:</b></label>' +
      '<select id="lab-db-select" style="min-width:180px;">';
    dbs.forEach(function(d) {
      html += '<option value="' + d.id + '" ' + (d.id === currentDbId ? 'selected' : '') + '>' + (d.name || d.id) + '</option>';
    });
    html += '</select></div>' +
      '<button id="btn-lab-reset-db">🔄 Reset CSDL này</button>' +
      '<button id="btn-lab-view-schema">📋 Xem Sơ đồ ER &amp; Schema</button>' +
      '</div>';

    if (currentDbMeta.desc) {
      html += '<p style="margin:6px 0 0 0; font-size:12px; color:var(--text-muted);">' + currentDbMeta.desc + '</p>';
    }
    html += '</fieldset>';

    // Khung đề bài (nếu có chọn bài)
    html += '<div id="lab-problem-banner" style="display:none; margin-bottom:12px;"></div>';

    // Editor & Nút bấm
    html += '<fieldset class="retro-groupbox"><legend>💻 Trình Soạn Thảo SQL (Nhấn F5 hoặc Ctrl+Enter để chạy)</legend>' +
      '<div class="field-row-stacked">' +
      '<textarea id="sql-editor" rows="7" style="width:100%; font-family:var(--font-mono); font-size:13px; padding:6px; background:var(--bg-panel); color:var(--text-main);" placeholder="-- Nhập câu lệnh SQL tại đây...\nSELECT * FROM SinhVien LIMIT 10;">SELECT * FROM ' + (currentDbId === "fruitstore" ? "Fruits" : (currentDbId === "truonghoc" ? "SinhVien" : "sqlite_master")) + ' LIMIT 5;</textarea>' +
      '</div>' +
      '<div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap; align-items:center;">' +
      '<button class="default" id="btn-run-sql" style="font-weight:bold;">▶ Chạy Thử Lệnh (F5)</button>' +
      '<button id="btn-grade-sql" style="font-weight:bold; color:var(--accent);">✅ Nộp Bài &amp; Chấm Điểm (Ctrl+S)</button>' +
      '<button id="btn-clear-sql">Xóa khung gõ</button>' +
      '<span id="sql-run-timer" style="margin-left:auto; font-size:11px; color:var(--text-muted);"></span>' +
      '</div>' +
      '</fieldset>';

    // Bảng kết quả (Sunken Panel & Interactive Table)
    html += '<div id="sql-result-area">' +
      '<div class="sunken-panel sql-result-sunken" id="sql-result-sunken">' +
      '<div style="padding:12px; text-align:center; color:var(--text-muted);">Bấm <b>▶ Chạy Thử Lệnh (F5)</b> để xem bảng kết quả tại đây...</div>' +
      '</div></div>';

    html += '</div>';

    pane.innerHTML = html;
    pane.scrollTop = 0;

    // Tự động nạp đề bài nếu có problemId
    if (problemId) {
      loadProblemIntoLab(problemId);
    }
  }

  function loadProblemIntoLab(problemId) {
    var problem = null;

    // Tìm trong 12 bài LeetCode
    (DATA.leetcode_challenges || []).forEach(function(lc) {
      if (lc.id === problemId || ("#"+lc.lc_num) === problemId) problem = lc;
    });

    // Tìm trong 16 chương
    if (!problem) {
      (DATA.chapters || []).forEach(function(ch) {
        var allEx = (ch.basics || []).concat(ch.practice || []);
        allEx.forEach(function(ex, idx) {
          var pId = ex.id || (ch.id + "_ex_" + idx);
          if (pId === problemId) {
            problem = ex;
            problem.id = pId;
          }
        });
      });
    }

    if (!problem) return;

    var banner = document.getElementById("lab-problem-banner");
    var editor = document.getElementById("sql-editor");
    if (!banner) return;

    banner.style.display = "block";
    banner.innerHTML = '<fieldset class="retro-groupbox" style="border-color:var(--accent); background:var(--accent-soft);">' +
      '<legend>🎯 Đề Bài Đang Làm: ' + (problem.title || '') + '</legend>' +
      '<p><b>Yêu cầu:</b> ' + (problem.prompt || problem.problem || problem.summary || '') + '</p>' +
      (problem.hints ? '<details><summary>💡 Xem gợi ý</summary><ul>' + problem.hints.map(function(h){return '<li>'+h+'</li>';}).join('') + '</ul></details>' : '') +
      '</fieldset>';

    if (editor && problem.starter_sql) {
      editor.value = problem.starter_sql;
    }

    window._CURRENT_LAB_PROBLEM = problem;
  }

  function renderResultTableHtml(columns, values, duration) {
    if (!columns || columns.length === 0) {
      return '<div style="padding:8px; color:var(--ok-color);">✓ Câu lệnh thực thi thành công (' + duration + ' ms). Không có dòng dữ liệu nào trả về.</div>';
    }

    var html = '<div style="padding:3px 6px; font-size:11px; background:var(--bg-window); border-bottom:1px solid var(--border-dark); display:flex; justify-content:space-between;">' +
      '<span>Trả về <b>' + values.length + ' dòng</b> (' + columns.length + ' cột)</span>' +
      '<span>Thời gian chạy: <b>' + duration + ' ms</b></span>' +
      '</div>';

    html += '<table class="interactive sql-result-table"><thead><tr>';
    columns.forEach(function(col) {
      html += '<th>' + col + '</th>';
    });
    html += '</tr></thead><tbody>';

    values.forEach(function(row) {
      html += '<tr>';
      row.forEach(function(cell) {
        var display = (cell === null || cell === undefined) ? '<i style="color:var(--text-muted);">&lt;NULL&gt;</i>' : String(cell);
        html += '<td>' + display + '</td>';
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
  }

  /* ========================================================================
     8. RENDER 6 BỘ MÔ PHỎNG TRỰC QUAN (SIMULATORS VIEW - TASK 10)
     ======================================================================== */
  function renderSimulatorsView(simId) {
    state.lastView = "simulators";
    if (simId) state.activeSimulatorId = simId;
    var currentSimId = state.activeSimulatorId || "join";

    updateAddressBar("chm://bikip-csdl-v2005/simulators/" + currentSimId);
    updateStatusCell(2, "⚙️ Mô Phỏng: " + currentSimId);

    var pane = document.getElementById("reading-pane");
    if (!pane) return;

    var sims = DATA.simulators || {};
    var sim = sims[currentSimId] || sims.join;

    var html = '<div class="simulators-wrapper">';
    html += '<div class="ch-banner">' +
      '<div class="ch-code">VISUAL SIMULATORS // 98.CSS INTERACTIVE LAB</div>' +
      '<h1>' + sim.title + '</h1>' +
      '<div class="ch-source">' + sim.desc + '</div>' +
      '</div>';

    // Multirows Tablist của 98.css chọn giữa 6 Simulator
    html += '<menu role="tablist" class="multirows" id="sim-tablist">';
    var simMeta = [
      { id: "join", name: "1. Nối Bảng JOIN & Bẫy ON/WHERE" },
      { id: "exec_order", name: "2. Thứ Tự Thực Thi 9 Bước SELECT" },
      { id: "btree", name: "3. Cây Chỉ Mục B-Tree & SARGability" },
      { id: "isolation", name: "4. Mức Cô Lập ACID & Deadlock" },
      { id: "normalization", name: "5. Chuẩn Hóa 1NF - BCNF" },
      { id: "injection", name: "6. SQL Injection Lab" }
    ];
    simMeta.forEach(function(m) {
      html += '<li role="tab" aria-selected="' + (m.id === currentSimId ? 'true' : 'false') + '">' +
        '<a href="#sim-' + m.id + '" data-nav-sim="' + m.id + '">' + m.name + '</a>' +
        '</li>';
    });
    html += '</menu>';

    // Render cụ thể từng Simulator
    html += '<div class="window" role="tabpanel"><div class="window-body" style="padding:10px;">';

    if (currentSimId === "join") {
      html += renderJoinSimulator(sim);
    } else if (currentSimId === "exec_order") {
      html += renderExecOrderSimulator(sim);
    } else if (currentSimId === "btree") {
      html += renderBTreeSimulator(sim);
    } else if (currentSimId === "isolation") {
      html += renderIsolationSimulator(sim);
    } else if (currentSimId === "normalization") {
      html += renderNormalizationSimulator(sim);
    } else if (currentSimId === "injection") {
      html += renderInjectionSimulator(sim);
    }

    html += '</div></div></div>';

    pane.innerHTML = html;
    pane.scrollTop = 0;
  }

  function renderJoinSimulator(sim) {
    var modeKeys = Object.keys(sim.modes);
    var activeMode = window._JOIN_MODE || "INNER";
    var mData = sim.modes[activeMode] || sim.modes.INNER;

    var html = '<fieldset class="retro-groupbox"><legend>🎛️ Chọn Chế Độ Phép Nối Bảng (JOIN Mode)</legend>' +
      '<div style="display:flex; flex-wrap:wrap; gap:12px;">';
    modeKeys.forEach(function(k) {
      html += '<div class="field-row">' +
        '<input type="radio" id="radio-join-' + k + '" name="join-mode" value="' + k + '" ' + (k === activeMode ? 'checked' : '') + '>' +
        '<label for="radio-join-' + k + '">' + k + '</label>' +
        '</div>';
    });
    html += '</div></fieldset>';

    html += '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:12px;">';
    // Bảng trái
    html += '<div class="sunken-panel"><div style="padding:4px; font-weight:bold; background:var(--bg-window);">' + sim.left_table.name + '</div>' +
      '<table class="interactive"><thead><tr><th>MaSV</th><th>HoTen</th><th>MaKhoa</th></tr></thead><tbody>';
    sim.left_table.rows.forEach(function(r) {
      html += '<tr><td>' + r.MaSV + '</td><td>' + r.HoTen + '</td><td>' + (r.MaKhoa || '<i style="color:var(--err-color)">NULL</i>') + '</td></tr>';
    });
    html += '</tbody></table></div>';

    // Bảng phải
    html += '<div class="sunken-panel"><div style="padding:4px; font-weight:bold; background:var(--bg-window);">' + sim.right_table.name + '</div>' +
      '<table class="interactive"><thead><tr><th>MaKhoa</th><th>TenKhoa</th></tr></thead><tbody>';
    sim.right_table.rows.forEach(function(r) {
      html += '<tr><td>' + r.MaKhoa + '</td><td>' + r.TenKhoa + '</td></tr>';
    });
    html += '</tbody></table></div></div>';

    // Chi tiết mode
    html += '<fieldset class="retro-groupbox"><legend>🔍 ' + mData.label + '</legend>';
    html += '<pre class="code-block"><code>' + mData.sql + '</code></pre>';
    html += '<p><b>Cơ chế hoạt động:</b> ' + mData.desc + '</p>';
    html += '<pre style="background:var(--bg-code); padding:6px; font-family:var(--font-mono);">' + mData.venn_ascii + '</pre>';
    html += '</fieldset>';

    // Kết quả
    html += '<fieldset class="retro-groupbox"><legend>📊 Tập Kết Quả Trả Về (' + mData.result_rows.length + ' dòng)</legend>' +
      '<div class="sunken-panel"><table class="interactive"><thead><tr><th>MaSV</th><th>HoTen</th><th>MaKhoa</th><th>TenKhoa</th><th>Giải thích</th></tr></thead><tbody>';
    mData.result_rows.forEach(function(row) {
      html += '<tr><td>' + (row.MaSV || '<i>NULL</i>') + '</td><td>' + (row.HoTen || '<i>NULL</i>') + '</td><td>' + (row.MaKhoa || '<i>NULL</i>') + '</td><td>' + (row.TenKhoa || '<i>NULL</i>') + '</td><td><small>' + (row.ghi_chu || '') + '</small></td></tr>';
    });
    html += '</tbody></table></div></fieldset>';

    return html;
  }

  function renderExecOrderSimulator(sim) {
    var stepIdx = window._EXEC_STEP || 0;
    var step = sim.steps[stepIdx] || sim.steps[0];

    var html = '<fieldset class="retro-groupbox"><legend>📋 Câu Truy Vấn Đang Mô Phỏng</legend>' +
      '<pre class="code-block"><code>' + sim.query + '</code></pre>' +
      '</fieldset>';

    // Scrubber điều khiển bước
    html += '<div style="display:flex; align-items:center; gap:8px; margin: 12px 0;">' +
      '<button id="btn-exec-prev" ' + (stepIdx <= 0 ? 'disabled' : '') + '>⏮ Bước trước</button>' +
      '<input type="range" class="has-box-indicator" id="exec-step-slider" min="0" max="' + (sim.steps.length - 1) + '" value="' + stepIdx + '" style="flex:1;">' +
      '<button id="btn-exec-next" ' + (stepIdx >= sim.steps.length - 1 ? 'disabled' : '') + '>Bước tiếp (Space) ▶</button>' +
      '<span style="font-weight:bold; min-width:80px; text-align:right;">Bước ' + (stepIdx + 1) + ' / ' + sim.steps.length + '</span>' +
      '</div>';

    // Nội dung bước hiện tại
    html += '<fieldset class="retro-groupbox" style="border-color:var(--accent);"><legend>⚡ BƯỚC ' + step.step + ': ' + step.clause + '</legend>' +
      '<p><b>Bảng ảo sinh ra:</b> ' + step.vt_name + '</p>' +
      '<p>' + step.desc + '</p>' +
      '<div class="callout-info"><b>Lưu ý mấu chốt:</b> ' + step.note + '</div>' +
      '</fieldset>';

    // Dữ liệu bảng ảo
    html += '<fieldset class="retro-groupbox"><legend>📊 Dữ Liệu Bảng Ảo Tại Bước ' + step.step + ' (' + step.rows.length + ' dòng)</legend>' +
      '<div class="sunken-panel"><table class="interactive"><thead><tr>';
    step.columns.forEach(function(c) { html += '<th>' + c + '</th>'; });
    html += '</tr></thead><tbody>';
    step.rows.forEach(function(r) {
      html += '<tr>';
      r.forEach(function(cell) { html += '<td>' + (cell === null ? '<i>NULL</i>' : cell) + '</td>'; });
      html += '</tr>';
    });
    html += '</tbody></table></div></fieldset>';

    return html;
  }

  function renderBTreeSimulator(sim) {
    var scId = window._BTREE_SCENARIO || "sarg_eq";
    var sc = sim.scenarios.find(function(s) { return s.id === scId; }) || sim.scenarios[0];

    var html = '<fieldset class="retro-groupbox"><legend>🌳 Thông Tin Cây Chỉ Mục Bảng DonHang (1 Triệu Dòng / 8.500 Trang Đĩa)</legend>' +
      '<p>B-Tree gồm 3 tầng: <b>Root Page #1</b> -> <b>Intermediate Pages #20..#25</b> -> <b>Leaf Pages #410..#8500</b>.</p>' +
      '<div style="display:flex; flex-wrap:wrap; gap:8px;">';
    sim.scenarios.forEach(function(s) {
      html += '<div class="field-row">' +
        '<input type="radio" id="radio-btree-' + s.id + '" name="btree-sc" value="' + s.id + '" ' + (s.id === scId ? 'checked' : '') + '>' +
        '<label for="radio-btree-' + s.id + '">' + s.name + '</label>' +
        '</div>';
    });
    html += '</div></fieldset>';

    // Kịch bản chi tiết
    html += '<fieldset class="retro-groupbox" style="border-color:' + (sc.sargable ? 'var(--ok-color)' : 'var(--err-color)') + ';">' +
      '<legend>' + (sc.sargable ? '✅ TRUY VẤN TỐI ƯU (SARGable)' : '🚨 TRUY VẤN PHẠM BẪY (Non-SARGable)') + '</legend>' +
      '<pre class="code-block"><code>' + sc.sql + '</code></pre>' +
      '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:8px; margin: 8px 0;">' +
      '<div class="sunken-panel" style="padding:6px;"><b>Toán tử Plan:</b><br><span style="color:var(--accent);">' + sc.plan_op + '</span></div>' +
      '<div class="sunken-panel" style="padding:6px;"><b>Số trang I/O đọc:</b><br><b style="font-size:14px; color:' + (sc.io_pages <= 20 ? 'var(--ok-color)' : 'var(--err-color)') + ';">' + sc.io_pages + ' trang</b></div>' +
      '<div class="sunken-panel" style="padding:6px;"><b>Thời gian ước tính:</b><br><b>' + sc.execution_time + '</b></div>' +
      '</div>' +
      '<p><b>Đường đi trên B-Tree:</b> <code>' + sc.tree_path + '</code></p>' +
      '<p><b>Phân tích I/O:</b> ' + sc.io_compare + '</p>' +
      '<div class="callout-info"><b>Lời khuyên kỹ sư:</b> ' + sc.fix_tip + '</div>' +
      '</fieldset>';

    return html;
  }

  function renderIsolationSimulator(sim) {
    var lKeys = Object.keys(sim.levels);
    var activeL = window._ISO_LEVEL || "READ_UNCOMMITTED";
    var lData = sim.levels[activeL] || sim.levels.READ_UNCOMMITTED;

    var html = '<fieldset class="retro-groupbox"><legend>🔒 Chọn Mức Cô Lập Giao Dịch Hoặc Kịch Bản</legend>' +
      '<div style="display:flex; flex-wrap:wrap; gap:8px;">';
    lKeys.forEach(function(k) {
      html += '<div class="field-row">' +
        '<input type="radio" id="radio-iso-' + k + '" name="iso-level" value="' + k + '" ' + (k === activeL ? 'checked' : '') + '>' +
        '<label for="radio-iso-' + k + '">' + k + '</label>' +
        '</div>';
    });
    html += '</div></fieldset>';

    html += '<fieldset class="retro-groupbox"><legend>' + lData.name + '</legend>' +
      '<p><b>Hiện tượng dị thường:</b> ' + lData.anomaly + '</p>' +
      '<p><b>Cơ chế khóa:</b> ' + lData.lock_behavior + '</p>' +
      '</fieldset>';

    // Timeline matrix
    html += '<fieldset class="retro-groupbox"><legend>⏱️ Timeline Diễn Tiến Hai Giao Dịch</legend>' +
      '<div class="sunken-panel"><table class="interactive"><thead><tr><th>Thời điểm</th><th>Transaction A</th><th>Transaction B</th><th>Trạng thái khóa &amp; Dữ liệu</th><th>Cảnh báo dị thường</th></tr></thead><tbody>';
    lData.timeline.forEach(function(t) {
      html += '<tr>' +
        '<td><b>' + t.tick + '</b><br><small>' + t.time + '</small></td>' +
        '<td><pre style="margin:0; font-size:11px;">' + t.tx_a + '</pre></td>' +
        '<td><pre style="margin:0; font-size:11px;">' + t.tx_b + '</pre></td>' +
        '<td><small><b>' + t.lock_state + '</b><br>' + t.db_val + '</small></td>' +
        '<td>' + (t.alert ? '<span style="color:var(--err-color); font-weight:bold;">' + t.alert + '</span>' : 'Bình thường') + '</td>' +
        '</tr>';
    });
    html += '</tbody></table></div></fieldset>';

    return html;
  }

  function renderNormalizationSimulator(sim) {
    var stageIdx = window._NORM_STAGE || 0;
    var stage = sim.stages[stageIdx] || sim.stages[0];

    var html = '<div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">';
    sim.stages.forEach(function(s, idx) {
      html += '<button class="' + (idx === stageIdx ? 'default' : '') + '" data-set-norm-stage="' + idx + '" style="flex:1;">' + s.form + '</button>';
    });
    html += '</div>';

    html += '<fieldset class="retro-groupbox"><legend>📐 ' + stage.title + '</legend>' +
      '<p><b>Đặc điểm &amp; Nhược điểm:</b> ' + stage.problems + '</p>' +
      (stage.anomalies ? '<div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:6px; margin: 8px 0;">' +
        '<div class="sunken-panel" style="padding:4px;"><b style="color:var(--err-color);">Dị thường Thêm:</b><br><small>' + stage.anomalies.insert + '</small></div>' +
        '<div class="sunken-panel" style="padding:4px;"><b style="color:var(--err-color);">Dị thường Sửa:</b><br><small>' + stage.anomalies.update + '</small></div>' +
        '<div class="sunken-panel" style="padding:4px;"><b style="color:var(--err-color);">Dị thường Xóa:</b><br><small>' + stage.anomalies.delete + '</small></div>' +
        '</div>' : '') +
      '<div class="callout-info"><b>Hành động chuẩn hóa:</b> ' + stage.action_taken + '</div>' +
      '</fieldset>';

    // Các bảng
    html += '<h3>Các Bảng Sau Khi Chuẩn Hóa (' + stage.tables.length + ' bảng):</h3>';
    stage.tables.forEach(function(t) {
      html += '<fieldset class="retro-groupbox"><legend>Bảng: ' + t.name + ' (Khóa chính: ' + t.pk + ')</legend>' +
        '<div class="sunken-panel"><table class="interactive"><thead><tr>';
      t.cols.forEach(function(c) { html += '<th>' + c + '</th>'; });
      html += '</tr></thead><tbody>';
      t.rows.forEach(function(r) {
        html += '<tr>';
        r.forEach(function(val) { html += '<td>' + val + '</td>'; });
        html += '</tr>';
      });
      html += '</tbody></table></div></fieldset>';
    });

    return html;
  }

  function renderInjectionSimulator(sim) {
    var scIdx = window._INJECT_SCENARIO || 0;
    var sc = sim.scenarios[scIdx] || sim.scenarios[0];

    var html = '<fieldset class="retro-groupbox"><legend>🎯 Chọn Kịch Bản Tấn Công SQL Injection</legend>' +
      '<div style="display:flex; flex-wrap:wrap; gap:8px;">';
    sim.scenarios.forEach(function(s, idx) {
      html += '<div class="field-row">' +
        '<input type="radio" id="radio-inj-' + s.id + '" name="inj-sc" value="' + idx + '" ' + (idx === scIdx ? 'checked' : '') + '>' +
        '<label for="radio-inj-' + s.id + '">' + s.label + '</label>' +
        '</div>';
    });
    html += '</div></fieldset>';

    html += '<fieldset class="retro-groupbox"><legend>💉 Dữ Liệu Hacker Nhập Vào Form</legend>' +
      '<div class="field-row" style="margin-bottom:4px;"><label style="width:100px;">Username:</label><input type="text" value="' + sc.username_input + '" readonly style="flex:1; font-family:var(--font-mono); color:var(--err-color);"></div>' +
      '<div class="field-row"><label style="width:100px;">Password:</label><input type="text" value="' + sc.password_input + '" readonly style="flex:1; font-family:var(--font-mono);"></div>' +
      '</fieldset>';

    // So sánh trực tiếp
    html += '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:12px;">' +
      // Cột 1: Nối chuỗi
      '<fieldset class="retro-groupbox" style="border-color:var(--err-color);"><legend>❌ Cách Làm Nguy Hiểm: Nối Chuỗi (Dynamic SQL)</legend>' +
      '<pre class="code-block" style="background:#fff0f0; color:#900;"><code>' + sc.raw_concat_sql + '</code></pre>' +
      '<p><b>Kết quả:</b> ' + sc.concat_outcome + '</p>' +
      '</fieldset>' +
      // Cột 2: Parameter
      '<fieldset class="retro-groupbox" style="border-color:var(--ok-color);"><legend>🛡️ Cách Phòng Thủ Chuẩn: Parameterized Query</legend>' +
      '<pre class="code-block" style="background:#f0fff0; color:#060;"><code>' + sc.prepared_sql + '</code></pre>' +
      '<p><b>Kết quả:</b> ' + sc.prepared_outcome + '</p>' +
      '</fieldset>' +
      '</div>';

    html += '<fieldset class="retro-groupbox"><legend>👨‍💻 Mã Nguồn Backend Chuẩn Mực (Java &amp; C#)</legend>' +
      '<pre class="code-block"><code>' + sc.backend_fix_code + '</code></pre>' +
      '</fieldset>';

    return html;
  }

  /* ========================================================================
     9. RENDER PHÒNG PHỎNG VẤN & LEETCODE (INTERVIEW ROOM - TASK 10)
     ======================================================================== */
  function renderInterviewView() {
    state.lastView = "interview";
    updateAddressBar("chm://bikip-csdl-v2005/interview-room/leitner");
    updateStatusCell(2, "🎯 Luyện Phỏng Vấn Leitner & 12 LeetCode SQL");

    var pane = document.getElementById("reading-pane");
    if (!pane) return;

    var bank = DATA.interview_bank || [];
    var filterLevel = window._INTERVIEW_FILTER || "ALL";

    // Phân loại thẻ theo hộp Leitner
    var box1 = [], box2 = [], box3 = [];
    bank.forEach(function(card) {
      if (filterLevel !== "ALL" && card.level !== filterLevel) return;
      var b = state.leitnerBoxes[card.id] || 1;
      if (b === 2) box2.push(card);
      else if (b === 3) box3.push(card);
      else box1.push(card);
    });

    var html = '<div class="interview-wrap">';
    html += '<div class="ch-banner">' +
      '<div class="ch-code">INTERVIEW FLASHCARDS // LEITNER 3-BOX SYSTEM</div>' +
      '<h1>Ngân Hàng 48 Thẻ Phỏng Vấn Backend &amp; 12 Bài LeetCode SQL</h1>' +
      '<div class="ch-source">Áp dụng thuật toán Lặp Lại Ngắt Quãng (Spaced Repetition) để ghi nhớ vĩnh viễn kiến thức CSDL</div>' +
      '</div>';

    // 3 Hộp Leitner
    html += '<div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:8px; margin-bottom:12px;">' +
      '<fieldset class="retro-groupbox"><legend>📦 Hộp 1: Cần Ôn Lại (' + box1.length + ' thẻ)</legend><small>Thẻ mới hoặc trả lời sai</small></fieldset>' +
      '<fieldset class="retro-groupbox"><legend>📬 Hộp 2: Đang Nhớ (' + box2.length + ' thẻ)</legend><small>Đã trả lời đúng 1 lần</small></fieldset>' +
      '<fieldset class="retro-groupbox"><legend>📭 Hộp 3: Đã Thuộc Lòng (' + box3.length + ' thẻ)</legend><small>Nắm chắc 100%</small></fieldset>' +
      '</div>';

    // Bộ lọc cấp độ
    html += '<fieldset class="retro-groupbox"><legend>🎚️ Lọc Theo Cấp Độ Ứng Tuyển</legend>' +
      '<div style="display:flex; gap:12px;">' +
      '<div class="field-row"><input type="radio" id="rad-lvl-all" name="iv-lvl" value="ALL" ' + (filterLevel === "ALL" ? "checked" : "") + '><label for="rad-lvl-all">Tất cả (48 thẻ)</label></div>' +
      '<div class="field-row"><input type="radio" id="rad-lvl-fresher" name="iv-lvl" value="Fresher" ' + (filterLevel === "Fresher" ? "checked" : "") + '><label for="rad-lvl-fresher">Fresher (16 thẻ)</label></div>' +
      '<div class="field-row"><input type="radio" id="rad-lvl-junior" name="iv-lvl" value="Junior" ' + (filterLevel === "Junior" ? "checked" : "") + '><label for="rad-lvl-junior">Junior (16 thẻ)</label></div>' +
      '<div class="field-row"><input type="radio" id="rad-lvl-mid" name="iv-lvl" value="Mid" ' + (filterLevel === "Mid" ? "checked" : "") + '><label for="rad-lvl-mid">Mid-level (16 thẻ)</label></div>' +
      '</div></fieldset>';

    // Hiển thị các thẻ Flashcard
    var currentCards = box1.concat(box2).concat(box3);
    html += '<h2>Danh Sách Thẻ Phỏng Vấn (' + currentCards.length + ' thẻ)</h2>';
    html += '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:10px; margin-bottom:24px;">';

    currentCards.forEach(function(card) {
      var currentBox = state.leitnerBoxes[card.id] || 1;
      html += '<div class="window" style="display:flex; flex-direction:column;">' +
        '<div class="title-bar">' +
        '<div class="title-bar-text">#' + card.id + ' [' + card.level + '] ' + card.topic + '</div>' +
        '</div>' +
        '<div class="window-body" style="flex:1; display:flex; flex-direction:column; padding:8px;">' +
        '<p style="font-weight:bold; flex:1;">' + card.q + '</p>' +
        '<details style="margin-bottom:8px;"><summary><b>Xem câu trả lời chuẩn &amp; câu hỏi xoáy</b></summary>' +
        '<p style="margin-top:6px;">' + card.a + '</p>' +
        '<p style="color:var(--accent);"><b>Câu hỏi xoáy:</b> ' + card.followup + '</p>' +
        '</details>' +
        '<div style="display:flex; gap:4px; align-items:center; border-top:1px solid var(--border-light); padding-top:6px;">' +
        '<span style="font-size:11px;">Hộp: <b>' + currentBox + '</b></span>' +
        '<button data-move-leitner="' + card.id + '" data-target-box="1" ' + (currentBox === 1 ? 'disabled' : '') + ' style="font-size:10px; margin-left:auto;">Về Hộp 1</button>' +
        '<button data-move-leitner="' + card.id + '" data-target-box="2" ' + (currentBox === 2 ? 'disabled' : '') + ' style="font-size:10px;">Lên Hộp 2</button>' +
        '<button data-move-leitner="' + card.id + '" data-target-box="3" ' + (currentBox === 3 ? 'disabled' : '') + ' style="font-size:10px;">Thuộc Hộp 3</button>' +
        '</div></div></div>';
    });
    html += '</div>';

    // Bảng 12 thử thách LeetCode SQL
    html += '<h2>12 Thử Thách LeetCode SQL Kinh Điển (#175 - #197)</h2>';
    html += '<div class="sunken-panel"><table class="interactive chm-table"><thead><tr><th>Bài #</th><th>Tiêu đề bài toán</th><th>Độ khó</th><th>Mẫu kỹ thuật (Pattern)</th><th>Hành động</th></tr></thead><tbody>';

    (DATA.leetcode_challenges || []).forEach(function(lc) {
      var isDone = !!state.completedItems[lc.id];
      html += '<tr>' +
        '<td><b>#' + lc.lc_num + '</b></td>' +
        '<td><b>' + lc.title + '</b></td>' +
        '<td><span class="badge-' + (lc.difficulty === 'Dễ' ? 'chuan' : 'tsql') + '">' + lc.difficulty + '</span></td>' +
        '<td><code>' + lc.pattern + '</code></td>' +
        '<td>' + (isDone ? '<span style="color:var(--ok-color); font-weight:bold; margin-right:6px;">✓ ĐÃ XONG</span>' : '') +
        '<button class="default" data-open-lab-problem="' + lc.id + '" data-db="leetcode">🧪 Làm bài trong Lab</button></td>' +
        '</tr>';
    });

    html += '</tbody></table></div></div>';

    pane.innerHTML = html;
    pane.scrollTop = 0;
  }

  /* ========================================================================
     10. RENDER SỔ TAY 3 DÒNG & TRACKS & APPENDICES (TASK 10)
     ======================================================================== */
  function renderNotesView() {
    state.lastView = "notes";
    updateAddressBar("chm://bikip-csdl-v2005/notebook/progress");
    updateStatusCell(2, "📝 Sổ Tay 3 Dòng & Quản Lý Tiến Độ");

    var pane = document.getElementById("reading-pane");
    if (!pane) return;

    var html = '<div class="notes-container">';
    html += '<div class="ch-banner">' +
      '<div class="ch-code">3-LINE NOTE RULE // PROGRESS MANAGEMENT</div>' +
      '<h1>Sổ Tay Ghi Chú 3 Dòng &amp; Sao Lưu Tiến Độ Cá Nhân</h1>' +
      '<div class="ch-source">Quy tắc 3 dòng: Bắt buộc cô đọng kiến thức sâu sắc nhất, không lan man</div>' +
      '</div>';

    // Công cụ sao lưu
    html += '<fieldset class="retro-groupbox"><legend>💾 Xuất / Nhập Dữ Liệu Học Tập</legend>' +
      '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
      '<button id="btn-export-markdown" class="default">📥 Xuất Sổ Tay Ra File Markdown (.md)</button>' +
      '<button id="btn-export-json">💾 Sao Lưu Tiến Độ Ra File JSON (.json)</button>' +
      '<button id="btn-import-json">📂 Nhập Lại Tiến Độ Từ File JSON</button>' +
      '<input type="file" id="file-import-input" accept=".json" style="display:none;">' +
      '<button id="btn-reset-all" style="color:var(--err-color); margin-left:auto;">⚠️ Xóa toàn bộ tiến độ</button>' +
      '</div></fieldset>';

    // Danh sách ghi chú theo chương
    html += '<h2>Ghi Chú Đã Lưu Theo Từng Chương:</h2>';
    var chs = DATA.chapters || [];
    chs.forEach(function(c) {
      var note = state.notes3Line[c.id] || "";
      html += '<fieldset class="retro-groupbox"><legend>' + (c.code || c.id) + ': ' + c.title + '</legend>' +
        '<div class="field-row-stacked">' +
        '<textarea id="note-text-' + c.id + '" rows="3" style="width:100%; font-family:var(--font-mono); font-size:12px;">' + note + '</textarea>' +
        '<div style="margin-top:4px;"><button data-save-ch-note="' + c.id + '">Lưu ghi chú chương này</button></div>' +
        '</div></fieldset>';
    });

    html += '</div>';

    pane.innerHTML = html;
    pane.scrollTop = 0;
  }

  function renderTracksView(trackId) {
    state.lastView = "tracks";
    if (trackId) state.activeTrackId = trackId;
    var currentTrackId = state.activeTrackId || "mysql";

    updateAddressBar("chm://bikip-csdl-v2005/expansion-tracks/" + currentTrackId);
    updateStatusCell(2, "🚀 Lộ Trình Mở Rộng: " + currentTrackId);

    var pane = document.getElementById("reading-pane");
    if (!pane) return;

    var tracks = DATA.expansion_tracks || DATA.tracks || {};
    var track = tracks[currentTrackId] || tracks.mysql || {};

    var html = '<div class="tracks-wrap">';
    html += '<menu role="tablist">';
    Object.keys(tracks).forEach(function(tKey) {
      var t = tracks[tKey];
      html += '<li role="tab" aria-selected="' + (tKey === currentTrackId ? 'true' : 'false') + '">' +
        '<a href="#track-' + tKey + '" data-nav-track="' + tKey + '">' + (t.badge || t.name) + '</a>' +
        '</li>';
    });
    html += '</menu>';

    html += '<div class="window" role="tabpanel"><div class="window-body" style="padding:14px;">';
    html += track.html_content || '<p>Chưa có nội dung cho lộ trình này.</p>';
    html += '</div></div></div>';

    pane.innerHTML = html;
    pane.scrollTop = 0;
  }

  function renderAppendicesView() {
    state.lastView = "appendices";
    updateAddressBar("chm://bikip-csdl-v2005/appendices/reference.htm");
    updateStatusCell(2, "📑 Phụ Lục Tra Cứu A - F & Bản Quyền");

    var pane = document.getElementById("reading-pane");
    if (!pane) return;

    pane.innerHTML = DATA.appendices_html || '<p>Chưa có nội dung phụ lục.</p>';
    pane.scrollTop = 0;
  }

  /* ========================================================================
     11. ĐIỀU HƯỚNG TỔNG QUÁT (VIEW ROUTER)
     ======================================================================== */
  function navigateTo(view, param, skipPushHistory) {
    if (!skipPushHistory) {
      pushHistory(view, param);
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
      renderChapterView(param || state.lastChapterId || "ch01");
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
    } else if (view === "appendices") {
      renderAppendicesView();
    }

    // Cập nhật highlight active trên Left TOC Tree
    document.querySelectorAll(".tree-item-link").forEach(function(a) {
      var navV = a.getAttribute("data-nav-view");
      var navCh = a.getAttribute("data-nav-ch");
      if ((navV && navV === view) || (navCh && navCh === param)) {
        a.classList.add("active");
        var parentDet = a.closest("details");
        if (parentDet && !parentDet.open) {
          parentDet.open = true;
        }
      } else {
        a.classList.remove("active");
      }
    });

    saveState();
  }

  /* ========================================================================
     12. BẮT SỰ KIỆN TOÀN CỤC (EVENT LISTENERS)
     ======================================================================== */
  function setupEventListeners() {
    // 1. Phím tắt trình duyệt và phím chức năng
    window.addEventListener("keydown", function(e) {
      // F1: Trợ giúp phím tắt
      if (e.key === "F1") {
        e.preventDefault();
        openShortcutsModal();
      }
      // F5 hoặc Ctrl+Enter: Chạy SQL trong Lab
      if (e.key === "F5" || (e.ctrlKey && e.key === "Enter")) {
        if (state.lastView === "lab") {
          e.preventDefault();
          var btnRun = document.getElementById("btn-run-sql");
          if (btnRun) btnRun.click();
        }
      }
      // Ctrl+S: Chấm bài trong Lab
      if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
        if (state.lastView === "lab") {
          e.preventDefault();
          var btnGrade = document.getElementById("btn-grade-sql");
          if (btnGrade) btnGrade.click();
        }
      }
      // F6: Thu gọn / Mở rộng Sidebar
      if (e.key === "F6") {
        e.preventDefault();
        toggleLeftPane();
      }
      // Ctrl+K hoặc Ctrl+F: Focus tìm kiếm
      if (e.ctrlKey && (e.key === "k" || e.key === "K" || e.key === "f" || e.key === "F")) {
        e.preventDefault();
        switchLeftTab("search");
        var sInput = document.getElementById("fulltext-search-input");
        if (sInput) sInput.focus();
      }
      // Alt+Left: Back
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        goHistory(-1);
      }
      // Alt+Right: Forward
      if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        goHistory(1);
      }
      // Space: Tiến bước trong Simulator
      if (e.key === " " && state.lastView === "simulators") {
        if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        var btnNext = document.getElementById("btn-exec-next");
        if (btnNext && !btnNext.disabled) {
          e.preventDefault();
          btnNext.click();
        }
      }
      // Esc: Đóng Modal
      if (e.key === "Escape") {
        closeAllModals();
      }
    });

    // 2. Click ủy quyền toàn trang (Delegated Click)
    document.addEventListener("click", function(e) {
      var target = e.target;

      // Nút chuyển View
      var navViewBtn = target.closest("[data-nav-view]");
      if (navViewBtn) {
        e.preventDefault();
        var v = navViewBtn.getAttribute("data-nav-view");
        var p = navViewBtn.getAttribute("data-param") || null;
        navigateTo(v, p);
        return;
      }

      // Nút chuyển Chương
      var navChBtn = target.closest("[data-nav-ch]");
      if (navChBtn) {
        e.preventDefault();
        var ch = navChBtn.getAttribute("data-nav-ch");
        navigateTo("chapter", ch);
        return;
      }

      // Nút chuyển Simulator
      var navSimBtn = target.closest("[data-nav-sim]");
      if (navSimBtn) {
        e.preventDefault();
        var s = navSimBtn.getAttribute("data-nav-sim");
        navigateTo("simulators", s);
        return;
      }

      // Nút chuyển Track
      var navTrackBtn = target.closest("[data-nav-track]");
      if (navTrackBtn) {
        e.preventDefault();
        var t = navTrackBtn.getAttribute("data-nav-track");
        navigateTo("tracks", t);
        return;
      }

      // Quick links
      var qBtn = target.closest(".quick-link-btn");
      if (qBtn) {
        e.preventDefault();
        var qCh = qBtn.getAttribute("data-quick-ch");
        navigateTo("chapter", qCh);
        return;
      }

      // Cuộn tới section trong bài học
      var scrollSecLink = target.closest("[data-scroll-sec]");
      if (scrollSecLink) {
        e.preventDefault();
        document.querySelectorAll(".tree-item-link").forEach(function(el) {
          el.classList.remove("active");
        });
        scrollSecLink.classList.add("active");
        var secId = scrollSecLink.getAttribute("data-scroll-sec");
        var el = document.getElementById(secId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }

      // Đẩy SQL từ ví dụ vào Lab
      var pushLabBtn = target.closest("[data-push-lab-sql]");
      if (pushLabBtn) {
        var rawSql = decodeURIComponent(pushLabBtn.getAttribute("data-push-lab-sql"));
        var labDb = pushLabBtn.getAttribute("data-lab-db") || state.activeDbId;
        navigateTo("lab", labDb);
        setTimeout(function() {
          var editor = document.getElementById("sql-editor");
          if (editor) editor.value = rawSql;
          var btnRun = document.getElementById("btn-run-sql");
          if (btnRun) btnRun.click();
        }, 150);
        return;
      }

      // Mở bài tập trong Lab
      var openProbBtn = target.closest("[data-open-lab-problem]");
      if (openProbBtn) {
        var pId = openProbBtn.getAttribute("data-open-lab-problem");
        var pDb = openProbBtn.getAttribute("data-db") || state.activeDbId;
        navigateTo("lab", pDb);
        setTimeout(function() {
          loadProblemIntoLab(pId);
        }, 150);
        return;
      }

      // Chuyển thẻ Leitner
      var leitnerBtn = target.closest("[data-move-leitner]");
      if (leitnerBtn) {
        var cardId = leitnerBtn.getAttribute("data-move-leitner");
        var targetBox = parseInt(leitnerBtn.getAttribute("data-target-box"), 10);
        state.leitnerBoxes[cardId] = targetBox;
        saveState();
        showToast("Đã chuyển thẻ #" + cardId + " sang Hộp " + targetBox);
        renderInterviewView();
        return;
      }

      // Lưu ghi chú 3 dòng
      var saveNoteBtn = target.closest("[data-save-ch-note]");
      if (saveNoteBtn) {
        var nChId = saveNoteBtn.getAttribute("data-save-ch-note");
        var txtEl = document.getElementById("note-text-" + nChId);
        if (txtEl) {
          save3LineNote(nChId, txtEl.value);
        }
        return;
      }

      var saveNoteChBtn = target.closest("#btn-save-note");
      if (saveNoteChBtn) {
        var nCh = saveNoteChBtn.getAttribute("data-ch");
        var nInput = document.getElementById("ch-note-input");
        if (nInput) {
          save3LineNote(nCh, nInput.value);
        }
        return;
      }

      // Chọn dòng trong bảng kết quả SQLite
      var tr = target.closest(".sql-result-table tbody tr");
      if (tr) {
        tr.parentElement.querySelectorAll("tr").forEach(function(row) { row.classList.remove("highlighted"); });
        tr.classList.add("highlighted");
        return;
      }

      // Nút điều khiển cửa sổ chính (Title Bar Controls)
      if (target.id === "btn-win-min") {
        toggleLeftPane();
        return;
      }
      if (target.id === "btn-win-max") {
        toggleFullScreen();
        return;
      }
      if (target.id === "btn-win-close") {
        navigateTo("toc");
        return;
      }
      if (target.id === "btn-win-help" || target.id === "btn-open-shortcuts") {
        openShortcutsModal();
        return;
      }
      if (target.id === "btn-close-modal" || target.classList.contains("modal-backdrop")) {
        closeAllModals();
        return;
      }

      // Nút toolbar
      if (target.id === "btn-toggle-pane") {
        toggleLeftPane();
        return;
      }
      if (target.id === "btn-nav-back") {
        goHistory(-1);
        return;
      }
      if (target.id === "btn-nav-forward") {
        goHistory(1);
      }
      if (target.id === "btn-nav-refresh") {
        navigateTo(state.lastView, (state.lastView === "chapter" ? state.lastChapterId : (state.lastView === "simulators" ? state.activeSimulatorId : state.activeDbId)), true);
        showToast("Đã làm mới trang hiện tại.");
        return;
      }
      if (target.id === "btn-nav-home") {
        navigateTo("toc");
        return;
      }
      if (target.id === "btn-go-lab") {
        navigateTo("lab", state.activeDbId);
        return;
      }
      if (target.id === "btn-go-fruit") {
        navigateTo("chapter", "ch15");
        return;
      }
      if (target.id === "btn-print") {
        window.print();
        return;
      }

      // Lab actions
      if (target.id === "btn-run-sql") {
        executeLabSql();
        return;
      }
      if (target.id === "btn-grade-sql") {
        gradeLabSql();
        return;
      }
      if (target.id === "btn-clear-sql") {
        var ed = document.getElementById("sql-editor");
        if (ed) ed.value = "";
        return;
      }
      if (target.id === "btn-lab-reset-db") {
        resetDatabase(state.activeDbId);
        return;
      }
      if (target.id === "btn-lab-view-schema") {
        showDbSchemaModal(state.activeDbId);
        return;
      }

      // Nút điều khiển Simulators
      if (target.id === "btn-exec-prev") {
        window._EXEC_STEP = Math.max(0, (window._EXEC_STEP || 0) - 1);
        renderSimulatorsView("exec_order");
        return;
      }
      if (target.id === "btn-exec-next") {
        var maxSteps = (DATA.simulators && DATA.simulators.exec_order) ? DATA.simulators.exec_order.steps.length - 1 : 8;
        window._EXEC_STEP = Math.min(maxSteps, (window._EXEC_STEP || 0) + 1);
        renderSimulatorsView("exec_order");
        return;
      }
      var normBtn = target.closest("[data-set-norm-stage]");
      if (normBtn) {
        window._NORM_STAGE = parseInt(normBtn.getAttribute("data-set-norm-stage"), 10);
        renderSimulatorsView("normalization");
        return;
      }

      // Xuất / Nhập Sổ tay
      if (target.id === "btn-export-markdown") {
        exportNotesMarkdown();
        return;
      }
      if (target.id === "btn-export-json") {
        exportProgressJson();
        return;
      }
      if (target.id === "btn-import-json") {
        var fInput = document.getElementById("file-import-input");
        if (fInput) fInput.click();
        return;
      }
      if (target.id === "btn-reset-all") {
        if (confirm("Bạn có chắc chắn muốn xóa toàn bộ tiến độ và ghi chú?")) {
          localStorage.removeItem(STORAGE_KEY);
          state = Object.assign({}, defaultState);
          saveState();
          location.reload();
        }
        return;
      }
    });

    // 3. Thay đổi thanh trượt cỡ chữ & giao diện
    var fontSlider = document.getElementById("font-size-slider");
    var fontVal = document.getElementById("font-size-val");
    if (fontSlider) {
      fontSlider.value = state.fontSize;
      if (fontVal) fontVal.textContent = state.fontSize + "px";
      document.documentElement.style.setProperty("--reading-font-size", state.fontSize + "px");

      fontSlider.oninput = function() {
        var sz = fontSlider.value;
        if (fontVal) fontVal.textContent = sz + "px";
        document.documentElement.style.setProperty("--reading-font-size", sz + "px");
        state.fontSize = parseInt(sz, 10);
        saveState();
      };
    }

    var themeSelect = document.getElementById("theme-select");
    if (themeSelect) {
      themeSelect.value = state.theme;
      applyTheme(state.theme);
      themeSelect.onchange = function() {
        applyTheme(themeSelect.value);
      };
    }

    var chkCrt = document.getElementById("chk-crt-scanlines");
    if (chkCrt) {
      chkCrt.checked = state.crtScanlines;
      applyCrtScanlines(state.crtScanlines);
      chkCrt.onchange = function() {
        applyCrtScanlines(chkCrt.checked);
      };
    }

    // 4. Thanh địa chỉ (Address Bar)
    var btnAddressGo = document.getElementById("btn-address-go");
    var addressInput = document.getElementById("address-input");
    if (btnAddressGo && addressInput) {
      var handleGo = function() {
        var val = addressInput.value.trim();
        if (val.indexOf("chm://") === 0) {
          if (val.indexOf("/chapters/") !== -1) {
            var match = val.match(/chapters\/([a-zA-Z0-9_-]+)/);
            if (match) navigateTo("chapter", match[1].replace(".htm", ""));
          } else if (val.indexOf("/sql-lab") !== -1) {
            var mLab = val.match(/sql-lab\/([a-zA-Z0-9_-]+)/);
            navigateTo("lab", mLab ? mLab[1] : state.activeDbId);
          } else if (val.indexOf("/simulators") !== -1) {
            var mSim = val.match(/simulators\/([a-zA-Z0-9_-]+)/);
            navigateTo("simulators", mSim ? mSim[1] : state.activeSimulatorId);
          } else if (val.indexOf("/interview-room") !== -1) {
            navigateTo("interview");
          } else if (val.indexOf("/notebook") !== -1) {
            navigateTo("notes");
          } else if (val.indexOf("/expansion-tracks") !== -1) {
            var mTrk = val.match(/expansion-tracks\/([a-zA-Z0-9_-]+)/);
            navigateTo("tracks", mTrk ? mTrk[1] : state.activeTrackId);
          } else if (val.indexOf("/appendices") !== -1) {
            navigateTo("appendices");
          } else {
            navigateTo("toc");
          }
        } else {
          // Gõ từ khóa bất kỳ -> Chuyển sang Tab Tìm kiếm toàn văn
          switchLeftTab("search");
          var sInput = document.getElementById("fulltext-search-input");
          if (sInput) {
            sInput.value = val;
            runFulltextSearch(val);
          }
        }
      };

      btnAddressGo.onclick = handleGo;
      addressInput.onkeydown = function(e) {
        if (e.key === "Enter") handleGo();
      };
    }

    // 5. Cột trái chuyển Tab (TOC, Index, Search)
    document.querySelectorAll(".left-tab").forEach(function(tabLi) {
      tabLi.onclick = function(e) {
        e.preventDefault();
        var tabId = tabLi.getAttribute("data-left-tab");
        switchLeftTab(tabId);
      };
    });

    // Lọc Index
    var idxFilter = document.getElementById("index-filter-input");
    if (idxFilter) {
      idxFilter.oninput = function() { renderLeftIndex(); };
    }

    // Nút tìm kiếm
    var btnRunSearch = document.getElementById("btn-run-search");
    var fullSearchInput = document.getElementById("fulltext-search-input");
    if (btnRunSearch && fullSearchInput) {
      btnRunSearch.onclick = function() { runFulltextSearch(fullSearchInput.value); };
      fullSearchInput.onkeydown = function(e) {
        if (e.key === "Enter") runFulltextSearch(fullSearchInput.value);
      };
    }

    // Nhập file JSON
    var fInput = document.getElementById("file-import-input");
    if (fInput) {
      fInput.onchange = function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(evt) {
          try {
            var imported = JSON.parse(evt.target.result);
            if (imported && imported.bikip_sql_signature === "v2005") {
              Object.assign(state, imported.data);
              saveState();
              showToast("Đã phục hồi tiến độ thành công từ file!");
              location.reload();
            } else {
              showToast("File không đúng cấu trúc của Bí Kíp CSDL v2005!", true);
            }
          } catch (err) {
            showToast("Lỗi giải mã file JSON: " + err.message, true);
          }
        };
        reader.readAsText(file);
      };
    }

    // Bắt sự kiện Radio trong Simulators & Interview
    document.addEventListener("change", function(e) {
      // Đổi CSDL trong Lab
      if (e.target.id === "lab-db-select") {
        state.activeDbId = e.target.value;
        saveState();
        renderLabView(state.activeDbId);
        return;
      }

      // JOIN mode radio
      if (e.target.name === "join-mode") {
        window._JOIN_MODE = e.target.value;
        renderSimulatorsView("join");
        return;
      }

      // B-Tree scenario radio
      if (e.target.name === "btree-sc") {
        window._BTREE_SCENARIO = e.target.value;
        renderSimulatorsView("btree");
        return;
      }

      // Isolation level radio
      if (e.target.name === "iso-level") {
        window._ISO_LEVEL = e.target.value;
        renderSimulatorsView("isolation");
        return;
      }

      // Injection scenario radio
      if (e.target.name === "inj-sc") {
        window._INJECT_SCENARIO = parseInt(e.target.value, 10);
        renderSimulatorsView("injection");
        return;
      }

      // Filter level trong phỏng vấn
      if (e.target.name === "iv-lvl") {
        window._INTERVIEW_FILTER = e.target.value;
        renderInterviewView();
        return;
      }

      // Slider trong Exec Order
      if (e.target.id === "exec-step-slider") {
        window._EXEC_STEP = parseInt(e.target.value, 10);
        renderSimulatorsView("exec_order");
        return;
      }
    });
  }

  /* ========================================================================
     13. CÁC HÀM HỖ TRỢ XỬ LÝ (HELPER FUNCTIONS)
     ======================================================================== */
  function executeLabSql() {
    var editor = document.getElementById("sql-editor");
    var resSunken = document.getElementById("sql-result-sunken");
    var timer = document.getElementById("sql-run-timer");
    if (!editor || !resSunken) return;

    var sql = editor.value.trim();
    if (!sql) {
      showToast("Vui lòng nhập câu lệnh SQL trước khi chạy!", true);
      return;
    }

    try {
      var execResult = runSqlQuery(state.activeDbId, sql);
      if (timer) timer.textContent = "⏱️ " + execResult.duration + " ms";

      if (execResult.results && execResult.results.length > 0) {
        var r = execResult.results[0];
        resSunken.innerHTML = renderResultTableHtml(r.columns, r.values, execResult.duration);
      } else {
        resSunken.innerHTML = renderResultTableHtml([], [], execResult.duration);
      }
    } catch (err) {
      resSunken.innerHTML = '<div style="padding:10px; color:var(--err-color); font-weight:bold;">❌ ' + err.message + '</div>';
      showToast("Lỗi thực thi: " + err.message, true);
    }
  }

  function gradeLabSql() {
    var editor = document.getElementById("sql-editor");
    var resSunken = document.getElementById("sql-result-sunken");
    if (!editor || !resSunken) return;

    var sql = editor.value.trim();
    var problem = window._CURRENT_LAB_PROBLEM;

    if (!problem) {
      showToast("Hiện tại chưa có đề bài nào được nạp vào máy chấm. Hãy chọn một bài tập từ Mục Lục hoặc LeetCode!", true);
      return;
    }

    var grade = gradeSqlProblem(problem, sql);

    if (grade.pass) {
      state.completedItems[problem.id] = true;
      saveState();
      updateOverallProgress();
      showToast("🎉 CHÚC MỪNG! Bài tập '" + (problem.title || problem.id) + "' đã đạt chuẩn!");

      resSunken.innerHTML = '<div class="window" style="margin:8px; border-color:var(--ok-color);">' +
        '<div class="title-bar" style="background:var(--ok-color);"><div class="title-bar-text">✅ KẾT QUẢ CHẤM ĐIỂM: ĐẠT (PASS 100%)</div></div>' +
        '<div class="window-body" style="padding:10px;">' +
        '<p style="color:var(--ok-color); font-weight:bold; font-size:14px;">' + grade.msg + '</p>' +
        '<p>Số dòng: <b>' + grade.rowCount + '</b> | Số cột: <b>' + grade.colCount + '</b></p>' +
        '</div></div>';
    } else {
      resSunken.innerHTML = '<div class="window" style="margin:8px; border-color:var(--err-color);">' +
        '<div class="title-bar" style="background:var(--err-color);"><div class="title-bar-text">❌ KẾT QUẢ CHẤM ĐIỂM: CHƯA ĐẠT (FAIL)</div></div>' +
        '<div class="window-body" style="padding:10px;">' +
        '<p style="color:var(--err-color); font-weight:bold; font-size:13px;">' + grade.msg + '</p>' +
        '<p><i>Gợi ý:</i> Kiểm tra lại số lượng cột, thứ tự sắp xếp hoặc điều kiện lọc trong mệnh đề WHERE.</p>' +
        '</div></div>';
    }
  }

  function save3LineNote(chapterId, text) {
    var lines = (text || "").split("\n");
    if (lines.length > 3) {
      showToast("Quy tắc 3 dòng: Ghi chú không được vượt quá 3 dòng!", true);
      return;
    }
    state.notes3Line[chapterId] = text.trim();
    saveState();
    showToast("Đã lưu ghi chú cho chương " + chapterId);
  }

  function toggleLeftPane() {
    var pane = document.getElementById("left-pane");
    if (!pane) return;
    pane.classList.toggle("collapsed");
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function() {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  function switchLeftTab(tabId) {
    state.activeLeftTab = tabId;
    document.querySelectorAll(".left-tab").forEach(function(li) {
      if (li.getAttribute("data-left-tab") === tabId) {
        li.classList.add("active");
        li.setAttribute("aria-selected", "true");
      } else {
        li.classList.remove("active");
        li.setAttribute("aria-selected", "false");
      }
    });

    var tabToc = document.getElementById("left-tab-toc");
    var tabIdx = document.getElementById("left-tab-index");
    var tabSrc = document.getElementById("left-tab-search");

    if (tabToc) tabToc.style.display = (tabId === "toc" ? "flex" : "none");
    if (tabIdx) {
      tabIdx.style.display = (tabId === "index" ? "flex" : "none");
      if (tabId === "index") renderLeftIndex();
    }
    if (tabSrc) tabSrc.style.display = (tabId === "search" ? "flex" : "none");
  }

  function applyTheme(themeName) {
    document.body.className = "theme-" + themeName;
    if (state.crtScanlines) {
      document.body.classList.add("crt-scanlines");
    }
    state.theme = themeName;
    saveState();
  }

  function applyCrtScanlines(enabled) {
    state.crtScanlines = enabled;
    if (enabled) {
      document.body.classList.add("crt-scanlines");
    } else {
      document.body.classList.remove("crt-scanlines");
    }
    saveState();
  }

  function goHistory(delta) {
    var newIdx = historyIndex + delta;
    if (newIdx >= 0 && newIdx < historyStack.length) {
      historyIndex = newIdx;
      var item = historyStack[historyIndex];
      navigateTo(item.view, item.param, true);
      updateNavButtonsState();
    }
  }

  function openShortcutsModal() {
    var modal = document.getElementById("shortcut-modal");
    var body = document.getElementById("shortcut-modal-body");
    if (!modal || !body) return;

    body.innerHTML = '<table class="interactive chm-table"><thead><tr><th>Phím Tắt</th><th>Hành Động Trong Ứng Dụng</th></tr></thead><tbody>' +
      '<tr><td><kbd>F1</kbd></td><td>Mở hộp thoại phím tắt &amp; hướng dẫn này</td></tr>' +
      '<tr><td><kbd>F5</kbd> / <kbd>Ctrl+Enter</kbd></td><td><b>▶ Chạy thử câu lệnh SQL trong Phòng Lab</b></td></tr>' +
      '<tr><td><kbd>Ctrl+S</kbd></td><td><b>✅ Nộp bài tập &amp; Kích hoạt máy chấm điểm</b></td></tr>' +
      '<tr><td><kbd>F6</kbd></td><td>Ẩn / Hiện Cột Mục Lục Trái</td></tr>' +
      '<tr><td><kbd>Ctrl+K</kbd> / <kbd>Ctrl+F</kbd></td><td>Nhảy nhanh vào Ô Tìm Kiếm Toàn Văn</td></tr>' +
      '<tr><td><kbd>Alt+Left</kbd> (←)</td><td>Quay lại trang trước (Back)</td></tr>' +
      '<tr><td><kbd>Alt+Right</kbd> (→)</td><td>Tiến tới trang sau (Forward)</td></tr>' +
      '<tr><td><kbd>Space</kbd></td><td>Nạp bước tiếp theo trong Simulator</td></tr>' +
      '<tr><td><kbd>Esc</kbd></td><td>Đóng hộp thoại Modal</td></tr>' +
      '</tbody></table>';

    modal.classList.add("active");
  }

  function closeAllModals() {
    document.querySelectorAll(".modal-backdrop").forEach(function(m) {
      m.classList.remove("active");
    });
  }

  function showDbSchemaModal(dbId) {
    var dbs = (DATA.labs && DATA.labs.databases) ? DATA.labs.databases : [];
    var dbMeta = dbs.find(function(d) { return d.id === dbId; });
    if (!dbMeta) return;

    var modal = document.getElementById("shortcut-modal");
    var title = document.getElementById("shortcut-modal-title");
    var body = document.getElementById("shortcut-modal-body");
    if (!modal || !body) return;

    if (title) title.textContent = "📋 Sơ Đồ ER & Schema CSDL: " + (dbMeta.name || dbId);
    body.innerHTML = '<h3>Sơ đồ thực thể kết hợp (ASCII ERD):</h3>' +
      '<pre style="background:var(--bg-code); padding:6px; font-family:var(--font-mono);">' + (dbMeta.er_ascii || 'Chưa có sơ đồ ASCII') + '</pre>' +
      '<h3>Cấu trúc bảng &amp; Dữ liệu mẫu (Schema &amp; Seed SQL):</h3>' +
      '<pre class="code-block" style="max-height:240px; overflow:auto;"><code>' + (dbMeta.schema_sql || '') + '\n\n' + (dbMeta.seed_sql || '') + '</code></pre>';

    modal.classList.add("active");
  }

  function exportNotesMarkdown() {
    var md = "# SỔ TAY GHI CHÚ 3 DÒNG — BÍ KÍP CƠ SỞ DỮ LIỆU v2005\n\n";
    md += "> Xuất ngày: " + new Date().toLocaleString("vi-VN") + "\n\n";

    var chs = DATA.chapters || [];
    chs.forEach(function(c) {
      var note = state.notes3Line[c.id];
      if (note) {
        md += "## " + (c.code || c.id) + ": " + c.title + "\n\n```text\n" + note + "\n```\n\n";
      }
    });

    downloadFile(md, "SoTay_BikipCSDL_v2005.md", "text/markdown");
  }

  function exportProgressJson() {
    var payload = {
      bikip_sql_signature: "v2005",
      exported_at: new Date().toISOString(),
      data: state
    };
    downloadFile(JSON.stringify(payload, null, 2), "BikipCSDL_Progress_Backup.json", "application/json");
  }

  function downloadFile(content, fileName, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  /* ========================================================================
     14. KHỞI CHẠY ỨNG DỤNG (INITIALIZATION ENTRY POINT)
     ======================================================================== */
  function initApp() {
    renderLeftTocTree();
    setupEventListeners();

    // Khởi tạo SQLite WASM
    initSqlEngine(function(success) {
      // Điều hướng tới view đã lưu hoặc TOC
      navigateTo(state.lastView || "toc", (state.lastView === "chapter" ? state.lastChapterId : (state.lastView === "simulators" ? state.activeSimulatorId : state.activeDbId)));
    });
  }

  // Chờ DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }

})(typeof window !== "undefined" ? window : global);
