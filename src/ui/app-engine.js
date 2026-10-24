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
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stripHtml(html) {
    if (!html) return "";
    return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  /**
   * Render bảng kết quả tĩnh từ cấu trúc { cols: [...], rows: [[...]] } của ch01..ch15.js
   */
  function renderStaticTableHtml(resultObj) {
    if (!resultObj || !Array.isArray(resultObj.cols) || resultObj.cols.length === 0) {
      return "";
    }
    var rows = Array.isArray(resultObj.rows) ? resultObj.rows : [];
    var html = '<div class="sunken-panel" style="overflow-x:auto; margin-top:6px;">' +
      '<table class="interactive chm-table" style="margin:0;"><thead><tr>';
    resultObj.cols.forEach(function(col) {
      html += '<th>' + escapeHtml(col) + '</th>';
    });
    html += '</tr></thead><tbody>';
    rows.forEach(function(row) {
      html += '<tr>';
      row.forEach(function(cell) {
        if (cell === null || cell === undefined) {
          html += '<td><i style="color:var(--text-muted);">&lt;NULL&gt;</i></td>';
        } else {
          html += '<td>' + escapeHtml(cell) + '</td>';
        }
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }

  function normalizeVal(val) {
    if (val === null || val === undefined) return null;
    if (typeof val === "number") return Number(val.toFixed(4));
    var str = String(val).trim();
    var num = Number(str);
    if (!isNaN(num) && str !== "") return Number(num.toFixed(4));
    return str.toLowerCase();
  }

  function getAll77LabProblems() {
    var list = [];
    (DATA.chapters || []).forEach(function(ch, cIdx) {
      var chCode = ch.code || ("Chương " + (ch.num || (cIdx + 1)));
      (ch.basics || []).forEach(function(b, bIdx) {
        var pid = b.id || (ch.id + "_b" + (b.num || (bIdx + 1)));
        list.push({
          id: pid,
          chId: ch.id,
          chCode: chCode,
          title: b.title || ("Bài cơ bản " + (bIdx + 1)),
          difficulty: "Cơ bản",
          db: b.db || "truonghoc",
          prompt: b.problem || b.prompt || b.summary || "",
          h1: (b.hints && b.hints[0]) || b.intuition || "Xác định bảng nguồn và điều kiện lọc.",
          h2: (b.hints && b.hints[1]) || b.trace || "Kiểm tra các cột cần SELECT và thứ tự ORDER BY.",
          solSql: b.sql || b.solution_sql || "",
          expected: b.expected || b.expected_output || null,
          required_keywords: b.required_keywords || [],
          forbidden_keywords: b.forbidden_keywords || [],
          order_matters: !!b.order_matters,
          note3: {
            idea: b.intuition || (ch.goals && ch.goals[0]) || "",
            syntax: (b.hints && b.hints[1]) || "",
            trap: (ch.common_errors && ch.common_errors[0]) || ""
          }
        });
      });
      (ch.practice || []).forEach(function(p, pIdx) {
        var pid = p.id || (ch.id + "_p" + (pIdx + 1));
        list.push({
          id: pid,
          chId: ch.id,
          chCode: chCode,
          title: p.title || ("Bài thực hành " + (pIdx + 1)),
          difficulty: p.difficulty || "Thực hành",
          db: p.db || "shoponline",
          prompt: p.summary || p.prompt || p.problem || "",
          h1: p.understand || (p.hints && p.hints[0]) || "Phân tích mối quan hệ giữa các bảng.",
          h2: p.optimal || (p.hints && p.hints[1]) || "Viết truy vấn tối ưu và kiểm tra NULL.",
          solSql: p.sql || p.solution_sql || "",
          expected: p.expected || p.expected_output || null,
          required_keywords: p.required_keywords || [],
          forbidden_keywords: p.forbidden_keywords || [],
          order_matters: !!p.order_matters,
          note3: p.note3 || {
            idea: p.understand || "",
            syntax: p.optimal || "",
            trap: p.pitfalls || ""
          }
        });
      });
    });

    (DATA.leetcode_challenges || []).forEach(function(lc) {
      list.push({
        id: lc.id,
        chId: "ch14",
        chCode: "LeetCode #" + lc.lc_num,
        title: lc.title,
        difficulty: lc.difficulty || "Trung bình",
        db: lc.db || "leetcode",
        prompt: lc.prompt || "",
        h1: (lc.hints && lc.hints[0]) || lc.pattern || lc.hint || "",
        h2: (lc.hints && lc.hints[1]) || "",
        solSql: lc.solution_sql || lc.sql || "",
        expected: lc.expected || null,
        starter_sql: lc.starter_sql || "",
        required_keywords: lc.required_keywords || [],
        forbidden_keywords: lc.forbidden_keywords || [],
        order_matters: !!lc.order_matters,
        note3: {
          idea: "Mẫu bài toán: " + (lc.pattern || lc.title),
          syntax: lc.solution_sql || "",
          trap: (lc.hints && lc.hints[0]) || ""
        }
      });
    });

    return list;
  }

  function gradeSqlProblem(problem, userSql) {
    if (!sqlEngineReady || !SQL) {
      return { pass: false, msg: "SQLite WASM chưa nạp xong. Vui lòng thử lại sau vài giây." };
    }
    var dbId = problem.db || state.activeDbId;
    var dbs = (DATA.labs && DATA.labs.databases) ? DATA.labs.databases : [];
    var dbMeta = dbs.find(function(d) { return d.id === dbId; });
    if (!dbMeta) {
      return { pass: false, msg: "Không tìm thấy cấu hình CSDL: " + dbId };
    }

    var cleanSql = (userSql || "").trim();
    if (!cleanSql) {
      return { pass: false, msg: "Bạn chưa nhập câu lệnh SQL nào!" };
    }

    // 1. Kiểm tra từ khóa bắt buộc / bị cấm (nếu có)
    if (Array.isArray(problem.required_keywords)) {
      for (var i = 0; i < problem.required_keywords.length; i++) {
        var kw = problem.required_keywords[i];
        var reg = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        if (!reg.test(cleanSql)) {
          return { pass: false, msg: "Câu lệnh của bạn cần sử dụng từ khóa: " + kw };
        }
      }
    }
    if (Array.isArray(problem.forbidden_keywords)) {
      for (var j = 0; j < problem.forbidden_keywords.length; j++) {
        var fkw = problem.forbidden_keywords[j];
        var fReg = new RegExp(fkw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        if (fReg.test(cleanSql)) {
          return { pass: false, msg: "Câu lệnh vi phạm quy tắc: Không được dùng " + fkw };
        }
      }
    }

    // 2. Tạo bản sao CSDL sạch trong RAM để chấm điểm nhất quán (hỗ trợ cả DML INSERT/UPDATE/DELETE)
    var tempUserDb = new SQL.Database();
    var userRes = { columns: [], values: [] };
    try {
      if (dbMeta.schema_sql) tempUserDb.run(dbMeta.schema_sql);
      if (dbMeta.seed_sql) tempUserDb.run(dbMeta.seed_sql);
      var uExec = tempUserDb.exec(cleanSql);
      if (uExec && uExec.length > 0) {
        userRes = uExec[uExec.length - 1];
      }
    } catch (err) {
      tempUserDb.close();
      return { pass: false, msg: "Lỗi cú pháp SQL: " + err.message };
    }
    tempUserDb.close();

    // 3. Lấy tập kết quả chuẩn từ problem.expected HOẶC chạy problem.solSql / problem.solution_sql
    var solCols = [];
    var solVals = [];
    if (problem.expected && Array.isArray(problem.expected.cols)) {
      solCols = problem.expected.cols;
      solVals = problem.expected.rows || [];
    } else {
      var refSql = problem.solSql || problem.solution_sql || problem.sql || "";
      if (!refSql) {
        return { pass: false, msg: "Bài tập này chưa có câu lệnh đáp án tham chiếu." };
      }
      var tempSolDb = new SQL.Database();
      try {
        if (dbMeta.schema_sql) tempSolDb.run(dbMeta.schema_sql);
        if (dbMeta.seed_sql) tempSolDb.run(dbMeta.seed_sql);
        var sExec = tempSolDb.exec(refSql);
        if (sExec && sExec.length > 0) {
          solCols = sExec[sExec.length - 1].columns;
          solVals = sExec[sExec.length - 1].values;
        }
      } catch (sErr) {
        tempSolDb.close();
        return { pass: false, msg: "Lỗi khi chạy đáp án chuẩn: " + sErr.message };
      }
      tempSolDb.close();
    }

    var userFormatted = { cols: userRes.columns || [], rows: userRes.values || [] };
    var solFormatted = { cols: solCols, rows: solVals };

    // 4. Đối chiếu số cột và số dòng
    if (userFormatted.cols.length !== solFormatted.cols.length) {
      return {
        pass: false,
        msg: "Sai số lượng cột: Câu lệnh của bạn trả về " + userFormatted.cols.length + " cột (" + userFormatted.cols.join(", ") + "), nhưng đáp án yêu cầu " + solFormatted.cols.length + " cột (" + solFormatted.cols.join(", ") + ").",
        userTable: userFormatted,
        expectedTable: solFormatted
      };
    }

    if (userFormatted.rows.length !== solFormatted.rows.length) {
      return {
        pass: false,
        msg: "Sai số lượng dòng: Câu lệnh của bạn trả về " + userFormatted.rows.length + " dòng, nhưng đáp án chuẩn có " + solFormatted.rows.length + " dòng.",
        userTable: userFormatted,
        expectedTable: solFormatted
      };
    }

    // 5. Chuẩn hóa và đối chiếu từng ô dữ liệu
    var uRows = userFormatted.rows.map(function(r) { return r.map(normalizeVal); });
    var eRows = solFormatted.rows.map(function(r) { return r.map(normalizeVal); });

    if (!problem.order_matters) {
      var sortFn = function(a, b) { return JSON.stringify(a).localeCompare(JSON.stringify(b)); };
      uRows.sort(sortFn);
      eRows.sort(sortFn);
    }

    for (var r = 0; r < eRows.length; r++) {
      for (var c = 0; c < eRows[r].length; c++) {
        if (uRows[r][c] !== eRows[r][c]) {
          return {
            pass: false,
            msg: "Sai lệch dữ liệu tại dòng #" + (r + 1) + " (cột '" + solFormatted.cols[c] + "'): Giá trị của bạn là '" + userFormatted.rows[r][c] + "', trong khi đáp án chuẩn là '" + solFormatted.rows[r][c] + "'." + (problem.order_matters ? " (Lưu ý: Bài này có kiểm tra thứ tự sắp xếp ORDER BY)." : ""),
            userTable: userFormatted,
            expectedTable: solFormatted
          };
        }
      }
    }

    return {
      pass: true,
      msg: "CHÍNH XÁC 100%! Tập kết quả (" + solFormatted.rows.length + " dòng, " + solFormatted.cols.length + " cột) hoàn toàn khớp với đáp án chuẩn!",
      rowCount: solFormatted.rows.length,
      colCount: solFormatted.cols.length,
      userTable: userFormatted,
      expectedTable: solFormatted
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

    function renderChapterTreeItem(chObj) {
      if (!chObj) return "";
      var chId = chObj.id;
      var chCode = chObj.code || chId;
      var html = '<li><details><summary><a href="#' + chId + '" class="tree-item-link" data-nav-ch="' + chId + '">' + escapeHtml(chCode + ': ' + chObj.title) + '</a></summary><ul>';
      html += '<li><a href="#' + chId + '-s1" class="tree-item-link" data-scroll-sec="sec-goals">1. Mục tiêu &amp; Dấu hiệu</a></li>';
      html += '<li><a href="#' + chId + '-s2" class="tree-item-link" data-scroll-sec="sec-theory">2. Lý thuyết nền tảng</a></li>';
      html += '<li><a href="#' + chId + '-s3" class="tree-item-link" data-scroll-sec="sec-mechanism">3. Cơ chế chạy tay</a></li>';
      if (chId === "ch15") {
        html += '<li><a href="#ch15-kw" class="tree-item-link" data-scroll-sec="sec-keyword-cards">3B. Từ điển 64 thẻ T-SQL</a></li>';
      }
      html += '<li><a href="#' + chId + '-s4" class="tree-item-link" data-scroll-sec="sec-examples">4. Cú pháp &amp; Ví dụ (' + (chObj.examples ? chObj.examples.length : 0) + ')</a></li>';
      html += '<li><a href="#' + chId + '-s5" class="tree-item-link" data-scroll-sec="sec-dialects">5. Khác biệt phương ngữ</a></li>';
      html += '<li><a href="#' + chId + '-s6" class="tree-item-link" data-scroll-sec="sec-bridge">6. Cầu nối Java &amp; C#</a></li>';
      html += '<li><a href="#' + chId + '-s7" class="tree-item-link" data-scroll-sec="sec-perf">7. Hiệu năng &amp; Chi phí</a></li>';
      html += '<li><a href="#' + chId + '-s8" class="tree-item-link" data-scroll-sec="sec-errors">8. Lỗi hay gặp (' + (chObj.common_errors ? chObj.common_errors.length : 0) + ')</a></li>';
      html += '<li><a href="#' + chId + '-s9" class="tree-item-link" data-scroll-sec="sec-interview">9. Câu hỏi phỏng vấn (' + (chObj.interview ? chObj.interview.length : 0) + ')</a></li>';
      var probCount = (chObj.basics ? chObj.basics.length : 0) + (chObj.practice ? chObj.practice.length : 0);
      html += '<li><a href="#' + chId + '-s10" class="tree-item-link" data-scroll-sec="sec-exercises">10. Bài tập tự chấm (' + probCount + ')</a></li>';
      html += '<li><a href="#' + chId + '-s11" class="tree-item-link" data-scroll-sec="sec-summary">11. Tổng kết &amp; Trắc nghiệm</a></li>';
      html += '</ul></details></li>';
      return html;
    }

    var html = '';
    html += '<li><a href="#toc" class="tree-item-link ' + (state.lastView === "toc" ? "active" : "") + '" data-nav-view="toc">🏠 Bảng Mục Lục Tổng Quan</a></li>';

    // Nhóm 1: Phần I (Ch00 - Ch05)
    html += '<li><details open><summary>📘 Phần I: Nền Tảng &amp; Truy Vấn Cốt Lõi (Ch00 - Ch05)</summary><ul>';
    html += '<li><a href="#ch00" class="tree-item-link" data-nav-ch="ch00">Chương 0: Nền Tảng Cơ Sở Dữ Liệu</a></li>';
    for (var i = 1; i <= 5; i++) {
      var chId = "ch0" + i;
      var chObj = (DATA.chapters || []).find(function(c) { return c.id === chId; });
      if (chObj) html += renderChapterTreeItem(chObj);
    }
    html += '</ul></details></li>';

    // Nhóm 2: Phần II (Ch06 - Ch10)
    html += '<li><details open><summary>📗 Phần II: Thiết Kế, Lập Trình &amp; Quản Trị (Ch06 - Ch10)</summary><ul>';
    for (var j = 6; j <= 10; j++) {
      var chId2 = (j < 10 ? "ch0" : "ch") + j;
      var chObj2 = (DATA.chapters || []).find(function(c) { return c.id === chId2; });
      if (chObj2) html += renderChapterTreeItem(chObj2);
    }
    html += '</ul></details></li>';

    // Nhóm 3: Phần III (Ch11 - Ch14)
    html += '<li><details open><summary>📙 Phần III: Bảo Mật, Backend &amp; Phỏng Vấn (Ch11 - Ch14)</summary><ul>';
    for (var k = 11; k <= 14; k++) {
      var chId3 = "ch" + k;
      var chObj3 = (DATA.chapters || []).find(function(c) { return c.id === chId3; });
      if (chObj3) html += renderChapterTreeItem(chObj3);
    }
    html += '</ul></details></li>';

    // Nhóm 4: Chương 15
    var ch15 = (DATA.chapters || []).find(function(c) { return c.id === "ch15"; });
    if (ch15) {
      html += '<li><details open><summary>🍍 Phần IV: Từ Điển T-SQL &amp; FruitStore Lab (Ch15)</summary><ul>';
      html += renderChapterTreeItem(ch15);
      html += '</ul></details></li>';
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

    // 7 Sơ Đồ Thực Thể Liên Kết (ERD ASCII) Của 7 CSDL Mẫu (Khôi phục theo BUG-01 & TASK FIX 04)
    html += '<h2 style="margin-top:24px;">Sơ Đồ Thực Thể Liên Kết (ERD ASCII) Của 7 Cơ Sở Dữ Liệu Mẫu</h2>';
    html += '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:12px; margin-top:10px;">';
    var dbs = (DATA.labs && DATA.labs.databases) ? DATA.labs.databases : [];
    dbs.forEach(function(db) {
      html += '<div class="window" style="display:flex; flex-direction:column;">' +
        '<div class="title-bar">' +
          '<div class="title-bar-text">🗄️ ' + escapeHtml(db.name || db.id) + ' (' + (db.tables ? db.tables.length : 0) + ' bảng)</div>' +
        '</div>' +
        '<div class="window-body" style="flex:1; display:flex; flex-direction:column; padding:8px;">' +
          '<p style="margin:2px 0 6px 0; font-size:12px; color:var(--text-muted);">' + escapeHtml(db.desc || "") + '</p>' +
          (db.er_ascii ? '<div class="er-box" style="flex:1; max-height:220px; margin-bottom:8px;">' + escapeHtml(db.er_ascii) + '</div>' : '') +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:4px;">' +
            '<button data-open-schema-modal="' + escapeHtml(db.id) + '">📋 Xem Schema DDL</button>' +
            '<button class="default" data-nav-view="lab" data-param="' + escapeHtml(db.id) + '">🧪 Mở CSDL Này Trong Lab ►</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';

    html += '</div>';

    pane.innerHTML = html;
    pane.scrollTop = 0;
  }

  function renderChapterView(chapterId, scrollSecId) {
    state.lastView = "chapter";
    state.lastChapterId = chapterId;
    updateAddressBar("chm://bikip-csdl-v2005/chapters/" + chapterId + ".htm");

    var pane = document.getElementById("reading-pane");
    if (!pane) return;

    if (chapterId === "ch00") {
      updateStatusCell(2, "📘 Chương 0: Nền Tảng CSDL");
      var ch0Html = '<div class="chapter-content-wrap">' +
        (DATA.ch0_html || "<p>Chưa có nội dung Chương 0.</p>") +
        '<div class="section-card" style="display:flex; justify-content:space-between; align-items:center;">' +
        '<button data-nav-view="toc">◄ Về Bảng Mục Lục</button>' +
        '<button class="default" data-nav-ch="ch01">Chương 1: SELECT, NULL &amp; Kiểu Dữ Liệu ►</button>' +
        '</div></div>';
      pane.innerHTML = ch0Html;
      pane.scrollTop = 0;
      return;
    }

    var chIdx = (DATA.chapters || []).findIndex(function(c) { return c.id === chapterId; });
    var ch = chIdx !== -1 ? DATA.chapters[chIdx] : null;
    if (!ch) {
      pane.innerHTML = '<div class="callout-warn">Không tìm thấy nội dung chương: ' + escapeHtml(chapterId) + '</div>';
      return;
    }

    var chCode = ch.code || ("Chương " + (ch.num || (chIdx + 1)));
    updateStatusCell(2, "📘 " + chCode + ": " + ch.title);

    var topicKey = "topic_" + ch.id;
    var isTopicDone = !!state.completedItems[topicKey];
    var langMode = state.langMode || "both";

    var html = '<div class="chapter-content-wrap">';

    // Banner chương + Checkbox hoàn thành lý thuyết chương
    html += '<div class="ch-banner">' +
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">' +
        '<div class="ch-code">' + escapeHtml(chCode.toUpperCase()) + ' // GIÁO TRÌNH &amp; PHÒNG LAB CSDL THỰC CHIẾN</div>' +
        '<div class="field-row" style="background:var(--bg-window); padding:2px 8px; border:1px solid var(--border-dark);">' +
          '<input type="checkbox" id="chk-topic-' + escapeHtml(ch.id) + '" data-toggle-done="' + escapeHtml(topicKey) + '" ' + (isTopicDone ? 'checked' : '') + '>' +
          '<label for="chk-topic-' + escapeHtml(ch.id) + '"><b>Đánh dấu đã nắm vững chương này</b></label>' +
        '</div>' +
      '</div>' +
      '<h1>' + escapeHtml(chCode + ': ' + ch.title) + '</h1>' +
      '<div class="ch-source">Tài liệu tham khảo: ' + escapeHtml(Array.isArray(ch.sources) ? ch.sources.join("; ") : (ch.sources || "Giáo trình tiêu chuẩn")) + '</div>' +
      '</div>';

    // Mục 1: Mục tiêu & Dấu hiệu nhận biết
    html += '<section class="section-card" id="sec-goals"><h2>1. Mục Tiêu Chương &amp; Dấu Hiệu Nhận Biết Thực Tế</h2>';
    if (ch.goals && ch.goals.length) {
      html += '<h3>🎯 Mục tiêu cốt lõi cần đạt:</h3><ul>';
      ch.goals.forEach(function(g) { html += '<li>' + escapeHtml(g) + '</li>'; });
      html += '</ul>';
    }
    if (ch.signals && ch.signals.length) {
      html += '<h3>🔍 Dấu hiệu nhận biết khi làm dự án Backend hoặc đi phỏng vấn:</h3><ul>';
      ch.signals.forEach(function(s) { html += '<li>' + escapeHtml(s) + '</li>'; });
      html += '</ul>';
    }
    html += '</section>';

    // Mục 2: Lý thuyết nền tảng
    if (ch.theory) {
      html += '<section class="section-card" id="sec-theory"><h2>2. Lý Thuyết Cốt Lõi &amp; Định Nghĩa Chính Xác</h2>';
      html += (typeof ch.theory === "string") ? ch.theory : JSON.stringify(ch.theory);
      html += '</section>';
    }

    // Mục 3: Cơ chế & Chạy tay từng bước (+ Nút nhảy sang Simulator tương ứng)
    var simMap = { ch03: "join", ch04: "exec_order", ch07: "normalization", ch08: "btree", ch09: "isolation", ch11: "injection" };
    var linkedSim = simMap[ch.id];
    if (ch.mechanism) {
      html += '<section class="section-card" id="sec-mechanism">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; border-bottom:2px solid var(--accent); padding-bottom:6px; margin-bottom:10px;">' +
          '<h2 style="border:none; margin:0; padding:0;">3. Cơ Chế Hoạt Động &amp; Chạy Tay Từng Bước</h2>' +
          (linkedSim ? '<button class="default" data-nav-sim="' + linkedSim + '">🔬 Mở Bộ Mô Phỏng Trực Quan Của Chương Này ►</button>' : '') +
        '</div>' +
        '<div>' + (typeof ch.mechanism === "string" ? ch.mechanism : JSON.stringify(ch.mechanism)) + '</div>' +
      '</section>';
    }

    // Mục 3B: BÁCH KHOA TOÀN THƯ 64 THẺ TỪ KHÓA T-SQL 4 PHẦN (Dành cho Chương 15)
    if (Array.isArray(ch.keyword_cards) && ch.keyword_cards.length > 0) {
      html += renderChapter15KeywordDictionary(ch);
    }

    // Mục 4: Cú pháp & Ví dụ thực tế (kèm bảng kết quả mẫu ex.result!)
    if (ch.examples && ch.examples.length) {
      html += '<section class="section-card" id="sec-examples"><h2>4. Cú Pháp &amp; Các Ví Dụ Thực Chiến Trên CSDL Mẫu (' + ch.examples.length + ' ví dụ)</h2>';
      ch.examples.forEach(function(ex, idx) {
        var lbl = (ex.label || ex.tag || "CHUAN").toUpperCase();
        var isChuan = lbl.indexOf("CHU") !== -1;
        var badgeHtml = isChuan
          ? '<span class="badge-chuan">[CHUẨN - Chạy trực tiếp trong Lab]</span>'
          : '<span class="badge-tsql">[T-SQL - Minh họa SQL Server]</span>';
        var noteText = ex.note || ex.desc || "";

        html += '<div class="example-box">' +
          '<div class="example-header">' +
            '<span>' + escapeHtml(ex.title || ("Ví dụ " + (idx + 1))) + ' ' + badgeHtml + ' <small style="color:var(--text-muted);">(CSDL: ' + escapeHtml(ex.db || "truonghoc") + ')</small></span>' +
            '<div style="display:flex; gap:4px;">' +
              '<button data-copy-text="' + encodeURIComponent(ex.sql || "") + '">📋 Sao chép SQL</button>' +
              (ex.sql ? '<button class="default" data-push-lab-sql="' + encodeURIComponent(ex.sql) + '" data-lab-db="' + escapeHtml(ex.db || state.activeDbId) + '">🧪 Đẩy vào SQL Lab</button>' : '') +
            '</div>' +
          '</div>' +
          '<pre class="code-block"><code>' + escapeHtml(ex.sql || "") + '</code></pre>' +
          (noteText ? '<div style="margin:6px 0; font-size:0.92em;"><b>Giải thích:</b> ' + escapeHtml(noteText) + '</div>' : '') +
          (ex.result && ex.result.cols ? '<div style="font-size:0.88em; font-weight:bold; margin-top:6px;">📊 Bảng kết quả minh họa (' + (ex.result.rows ? ex.result.rows.length : 0) + ' dòng):</div>' + renderStaticTableHtml(ex.result) : '') +
        '</div>';
      });
      html += '</section>';
    }

    // Mục 5: Khác biệt phương ngữ (Hỗ trợ chuẩn mảng 2 chiều [[feature, tsql, mysql, pg]] của ch01..ch15.js)
    if (ch.dialects && ch.dialects.length) {
      html += '<section class="section-card" id="sec-dialects"><h2>5. Khác Biệt Phương Ngữ (SQL Server vs MySQL vs PostgreSQL / SQLite)</h2>';
      html += '<div class="sunken-panel" style="overflow-x:auto;"><table class="interactive chm-table" style="margin:0;"><thead><tr><th>Tác vụ / Khía cạnh</th><th>SQL Server (T-SQL)</th><th>MySQL (InnoDB)</th><th>PostgreSQL / SQLite</th></tr></thead><tbody>';
      ch.dialects.forEach(function(d) {
        if (Array.isArray(d)) {
          html += '<tr><td><b>' + escapeHtml(d[0] || "") + '</b></td><td><code>' + escapeHtml(d[1] || "") + '</code></td><td><code>' + escapeHtml(d[2] || "") + '</code></td><td><code>' + escapeHtml(d[3] || "") + '</code></td></tr>';
        } else if (d && typeof d === "object") {
          html += '<tr><td><b>' + escapeHtml(d.feature || "") + '</b></td><td><code>' + escapeHtml(d.tsql || "") + '</code></td><td><code>' + escapeHtml(d.mysql || d.sqlite || "") + '</code></td><td><code>' + escapeHtml(d.postgres_mysql || d.pg || d.other || "") + '</code></td></tr>';
        }
      });
      html += '</tbody></table></div></section>';
    }

    // Mục 6: Cầu nối Backend Java & C# (Bọc trong <pre class="code-block"><code> & lọc theo langMode)
    html += '<section class="section-card" id="sec-bridge">' +
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; border-bottom:2px solid var(--accent); padding-bottom:6px; margin-bottom:10px;">' +
        '<h2 style="border:none; margin:0; padding:0;">6. Cầu Nối Ứng Dụng Backend (Java JDBC/JPA &amp; C# ADO.NET/EF Core)</h2>' +
        '<span style="font-size:11px; color:var(--text-muted);">Đang hiển thị: <b>' + (langMode === "java" ? "Chỉ Java" : (langMode === "csharp" ? "Chỉ C# (.NET)" : "Song ngữ Java & C#")) + '</b></span>' +
      '</div>';
    if ((langMode === "both" || langMode === "java") && ch.bridge_java) {
      html += '<fieldset class="retro-groupbox" style="margin-bottom:10px;"><legend>☕ Java Backend (JDBC / Spring Data JPA / Hibernate)</legend>' +
        '<div style="text-align:right; margin-bottom:4px;"><button data-copy-text="' + encodeURIComponent(ch.bridge_java) + '">📋 Sao chép mã Java</button></div>' +
        '<pre class="code-block"><code>' + escapeHtml(ch.bridge_java) + '</code></pre></fieldset>';
    }
    if ((langMode === "both" || langMode === "csharp") && ch.bridge_csharp) {
      html += '<fieldset class="retro-groupbox"><legend>🟣 C# .NET Backend (ADO.NET / Dapper / Entity Framework Core)</legend>' +
        '<div style="text-align:right; margin-bottom:4px;"><button data-copy-text="' + encodeURIComponent(ch.bridge_csharp) + '">📋 Sao chép mã C#</button></div>' +
        '<pre class="code-block"><code>' + escapeHtml(ch.bridge_csharp) + '</code></pre></fieldset>';
    }
    html += '</section>';

    // Mục 7: Hiệu năng & Chi phí
    if (ch.performance) {
      html += '<section class="section-card" id="sec-perf"><h2>7. Phân Tích Hiệu Năng, Chi Phí I/O &amp; Execution Plan</h2><div>' + ch.performance + '</div></section>';
    }

    // Mục 8: Lỗi hay gặp (Hỗ trợ chuẩn mảng chuỗi của ch01..ch15.js)
    if (ch.common_errors && ch.common_errors.length) {
      html += '<section class="section-card" id="sec-errors"><h2>8. Các Bẫy &amp; Lỗi Hay Gặp Trong Thực Tế (' + ch.common_errors.length + ' lỗi điển hình)</h2><ol style="padding-left:20px; margin:0;">';
      ch.common_errors.forEach(function(err) {
        if (typeof err === "string") {
          html += '<li style="margin-bottom:8px;"><b>⚠️ Cạm bẫy:</b> ' + escapeHtml(err) + '</li>';
        } else if (err && typeof err === "object") {
          html += '<li style="margin-bottom:8px;"><b>' + escapeHtml(err.title || err.name || "Cảnh báo") + ':</b> ' +
            (err.wrong ? '<br><span style="color:var(--err-color);">❌ Sai: <code>' + escapeHtml(err.wrong) + '</code></span>' : '') +
            (err.right ? '<br><span style="color:var(--ok-color);">✅ Đúng: <code>' + escapeHtml(err.right) + '</code></span>' : '') +
            (err.why ? '<br><i>Giải thích:</i> ' + escapeHtml(err.why) : '') + '</li>';
        }
      });
      html += '</ol></section>';
    }

    // Mục 9: Câu hỏi phỏng vấn trọng tâm của chương (Đọc chuẩn a_short, a_long, full)
    if (ch.interview && ch.interview.length) {
      html += '<section class="section-card" id="sec-interview"><h2>9. Câu Hỏi Phỏng Vấn Doanh Nghiệp Trọng Tâm Của Chương</h2>';
      ch.interview.forEach(function(iv, idx) {
        var shortAns = iv.a_short || iv.a || iv.full || "";
        var longAns = iv.a_long || iv.followup || "";
        html += '<fieldset class="retro-groupbox"><legend>🎯 Câu hỏi ' + (idx + 1) + ' — Cấp độ: [' + escapeHtml(iv.level || "Junior") + ']</legend>' +
          '<p style="margin:4px 0 8px 0;"><b>❓ Hỏi:</b> ' + escapeHtml(iv.q || "") + '</p>' +
          '<div style="background:var(--bg-table-alt); padding:8px; border-left:3px solid var(--ok-color); margin-bottom:6px;"><b>✅ Trả lời cốt lõi (15 giây đầu):</b> ' + escapeHtml(shortAns) + '</div>' +
          (longAns ? '<details><summary style="cursor:pointer; font-weight:bold; color:var(--accent);">📚 Xem phân tích chuyên sâu &amp; câu hỏi xoáy ăn điểm tối đa...</summary>' +
            '<div style="padding:8px; margin-top:4px; background:var(--bg-card); border:1px solid var(--border-dark);">' + escapeHtml(longAns) + '</div></details>' : '') +
          '</fieldset>';
      });
      html += '</section>';
    }

    // Mục 10: Bài tập cơ bản (basics) & Bài luyện tập nâng cao (practice)
    var basicsList = ch.basics || [];
    var practiceList = ch.practice || [];
    if (basicsList.length || practiceList.length) {
      html += '<section class="section-card" id="sec-exercises"><h2>10. Bài Tập Thực Hành Có Máy Chấm Tự Động (' + (basicsList.length + practiceList.length) + ' bài)</h2>';

      if (basicsList.length) {
        html += '<h3>10.1. Bài tập cơ bản (Làm quen cú pháp &amp; Gợi ý 3 tầng)</h3>';
        basicsList.forEach(function(b, idx) {
          var pId = b.id || (ch.id + "_b" + (b.num || (idx + 1)));
          var isDone = !!state.completedItems[pId];
          var promptText = b.problem || b.prompt || b.summary || "";
          var h1 = (b.hints && b.hints[0]) || b.intuition || "Xác định bảng nguồn và điều kiện lọc.";
          var h2 = (b.hints && b.hints[1]) || b.trace || "Kiểm tra các cột cần SELECT và thứ tự ORDER BY.";
          var solSql = b.sql || b.solution_sql || "";
          var expObj = b.expected || b.expected_output || null;

          html += '<div class="exercise-box">' +
            '<div class="example-header">' +
              '<span>' + (isDone ? '✅ ' : '📝 ') + escapeHtml(b.title || ("Bài cơ bản " + (idx + 1))) + ' <span class="badge-chuan">[DB: ' + escapeHtml(b.db || "truonghoc") + ']</span></span>' +
              '<button class="default" data-open-lab-problem="' + escapeHtml(pId) + '" data-db="' + escapeHtml(b.db || state.activeDbId) + '">🧪 Giải &amp; Chấm Điểm Trong Phòng Lab ►</button>' +
            '</div>' +
            '<p style="margin:6px 0;"><b>Đề bài:</b> ' + escapeHtml(promptText) + '</p>' +
            '<div class="hint-tier"><details><summary style="cursor:pointer; font-weight:bold;">💡 Gợi ý tầng 1 (Hướng tư duy)</summary><p style="margin:4px 0;">' + escapeHtml(h1) + '</p></details></div>' +
            '<div class="hint-tier"><details><summary style="cursor:pointer; font-weight:bold;">🧩 Gợi ý tầng 2 (Chạy tay &amp; Khung câu lệnh)</summary><p style="margin:4px 0;">' + (b.trace ? '<b>Chạy tay:</b> ' + escapeHtml(b.trace) + '<br>' : '') + '<b>Gợi ý:</b> <code>' + escapeHtml(h2) + '</code></p></details></div>' +
            '<div class="hint-tier"><details><summary style="cursor:pointer; font-weight:bold;">🔑 Gợi ý tầng 3 (Lời giải SQL chuẩn &amp; Bảng kết quả mẫu)</summary>' +
              '<pre class="code-block"><code>' + escapeHtml(solSql) + '</code></pre>' +
              (expObj ? renderStaticTableHtml(expObj) : '') +
            '</details></div>' +
          '</div>';
        });
      }

      if (practiceList.length) {
        html += '<h3>10.2. Bài luyện tập thực chiến (Phân tích Ngây thơ vs Tối ưu &amp; Bẫy thường gặp)</h3>';
        practiceList.forEach(function(p, idx) {
          var pId = p.id || (ch.id + "_p" + (idx + 1));
          var isDone = !!state.completedItems[pId];
          var promptText = p.summary || p.prompt || p.problem || "";
          var solSql = p.sql || p.solution_sql || "";
          var expObj = p.expected || p.expected_output || null;

          html += '<div class="exercise-box">' +
            '<div class="example-header">' +
              '<span>' + (isDone ? '✅ ' : '🔥 ') + escapeHtml(p.title || ("Bài thực hành " + (idx + 1))) + ' ' + (p.difficulty ? '(' + escapeHtml(p.difficulty) + ') ' : '') + '<span class="badge-chuan">[DB: ' + escapeHtml(p.db || "shoponline") + ']</span></span>' +
              '<button class="default" data-open-lab-problem="' + escapeHtml(pId) + '" data-db="' + escapeHtml(p.db || state.activeDbId) + '">⚡ Thực Hành &amp; Tự Chấm Trong Lab ►</button>' +
            '</div>' +
            '<p style="margin:6px 0;"><b>Đề bài:</b> ' + escapeHtml(promptText) + '</p>';

          if (p.understand || p.brute || p.optimal || p.pitfalls) {
            html += '<ul style="margin:6px 0 10px 0; padding-left:20px;">' +
              (p.understand ? '<li><b>Phân tích yêu cầu:</b> ' + escapeHtml(p.understand) + '</li>' : '') +
              (p.brute ? '<li><b>Cách tiếp cận ngây thơ (Brute-force):</b> ' + escapeHtml(p.brute) + '</li>' : '') +
              (p.optimal ? '<li><b>Giải pháp SQL tối ưu (Optimal):</b> ' + escapeHtml(p.optimal) + '</li>' : '') +
              (p.pitfalls ? '<li style="color:var(--err-color);"><b>Bẫy dễ vấp:</b> ' + escapeHtml(p.pitfalls) + '</li>' : '') +
            '</ul>';
          } else if (Array.isArray(p.hints) && p.hints.length) {
            html += '<div class="hint-tier"><details><summary style="cursor:pointer; font-weight:bold;">💡 Xem gợi ý từng bước</summary><ul>' +
              p.hints.map(function(h) { return '<li>' + escapeHtml(h) + '</li>'; }).join('') + '</ul></details></div>';
          }

          html += '<details><summary style="cursor:pointer; font-weight:bold; color:var(--accent);">🔑 Xem lời giải SQL chuẩn &amp; Bảng kết quả đối chiếu...</summary>' +
            '<pre class="code-block"><code>' + escapeHtml(solSql) + '</code></pre>' +
            (expObj ? renderStaticTableHtml(expObj) : '') +
            '</details></div>';
        });
      }
      html += '</section>';
    }

    // Mục 11: Bảng tóm tắt (summary_table) + 3 Câu hỏi tự kiểm tra (quiz) + Ghi chú 3 dòng
    html += '<section class="section-card" id="sec-summary"><h2>11. Bảng Tóm Tắt Kiến Thức, Tự Kiểm Tra &amp; Ghi Chú 3 Dòng</h2>';
    if (ch.summary_table && ch.summary_table.length) {
      html += '<h3>📋 Bảng Tóm Tắt Cú Pháp &amp; Khái Niệm Cốt Lõi:</h3>' +
        '<div class="sunken-panel" style="overflow-x:auto; margin-bottom:14px;"><table class="interactive chm-table" style="margin:0;"><thead><tr><th>Khái niệm / Cú pháp</th><th>Ý nghĩa cốt lõi</th><th>Ghi chú thực chiến</th></tr></thead><tbody>';
      ch.summary_table.forEach(function(r) {
        html += '<tr><td><code>' + escapeHtml(r[0] || "") + '</code></td><td>' + escapeHtml(r[1] || "") + '</td><td>' + escapeHtml(r[2] || "") + '</td></tr>';
      });
      html += '</tbody></table></div>';
    }

    if (ch.quiz && ch.quiz.length) {
      html += '<h3>❓ Tự Kiểm Tra Nhanh Cuối Chương (Bấm vào câu hỏi để đối chiếu đáp án):</h3>';
      ch.quiz.forEach(function(qz) {
        html += '<details class="example-box" style="margin-bottom:8px;"><summary style="cursor:pointer; font-weight:bold;">' + escapeHtml(qz.q || "") + '</summary>' +
          '<div style="margin-top:6px; padding-top:6px; border-top:1px dashed var(--border-dark); color:var(--ok-color);"><b>✅ Đáp án chuẩn:</b> ' + escapeHtml(qz.a || "") + '</div></details>';
      });
    }

    var defaultNote = state.notes3Line[ch.id] || (
      (ch.goals && ch.goals[0] ? "1. Ý tưởng: " + ch.goals[0] : "1. Ý tưởng chính: ") + "\n" +
      (ch.summary_table && ch.summary_table[0] ? "2. Cú pháp: " + ch.summary_table[0][0] + " -> " + ch.summary_table[0][1] : "2. Cú pháp cốt lõi: ") + "\n" +
      (ch.common_errors && ch.common_errors[0] ? "3. Bẫy cần tránh: " + ch.common_errors[0] : "3. Bẫy cần tránh: ")
    );
    html += '<h3>📝 Sổ Tay Ghi Chú 3 Dòng Của Chương Này:</h3>' +
      '<div class="field-row-stacked">' +
      '<textarea id="ch-note-input" rows="3" style="width:100%; font-family:var(--font-mono); font-size:12px; padding:6px;">' + escapeHtml(defaultNote) + '</textarea>' +
      '<div style="margin-top:6px;"><button class="default" id="btn-save-note" data-ch="' + escapeHtml(ch.id) + '">💾 Lưu ghi chú 3 dòng của ' + escapeHtml(chCode) + '</button></div>' +
      '</div></section>';

    // Thanh điều hướng chân trang (Chương trước / Phòng Lab / Chương sau)
    var prevChId = chIdx === 0 ? "ch00" : DATA.chapters[chIdx - 1].id;
    var prevLabel = chIdx === 0 ? "◄ Chương 0: Nền Tảng CSDL" : ("◄ " + (DATA.chapters[chIdx - 1].code || DATA.chapters[chIdx - 1].id));
    var nextCh = (chIdx + 1 < DATA.chapters.length) ? DATA.chapters[chIdx + 1] : null;

    html += '<div class="section-card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">' +
      '<button data-nav-ch="' + escapeHtml(prevChId) + '">' + escapeHtml(prevLabel) + '</button>' +
      '<button data-nav-view="lab">🧪 Mở Phòng Thực Hành SQL</button>' +
      (nextCh
        ? '<button class="default" data-nav-ch="' + escapeHtml(nextCh.id) + '">' + escapeHtml((nextCh.code || nextCh.id) + ": " + nextCh.title) + ' ►</button>'
        : '<button class="default" data-nav-view="appendices">📑 Xem Phụ Lục Tra Cứu A - F ►</button>') +
      '</div>';

    html += '</div>';

    pane.innerHTML = html;
    if (scrollSecId) {
      var targetEl = document.getElementById(scrollSecId);
      if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
    } else {
      pane.scrollTop = 0;
    }
  }

  var ch15FilterState = { part: "ALL", cat: "ALL", q: "" };

  function renderChapter15KeywordDictionary(ch) {
    var cards = ch.keyword_cards || [];
    var allCats = [];
    cards.forEach(function(kc) {
      if (kc.category && allCats.indexOf(kc.category) === -1) allCats.push(kc.category);
    });
    var countA = cards.filter(function(kc) { return kc.part === "A"; }).length;
    var countB = cards.filter(function(kc) { return kc.part === "B"; }).length;

    var filtered = cards.filter(function(kc) {
      if (ch15FilterState.part !== "ALL" && kc.part !== ch15FilterState.part) return false;
      if (ch15FilterState.cat !== "ALL" && kc.category !== ch15FilterState.cat) return false;
      if (ch15FilterState.q && ch15FilterState.q.trim() !== "") {
        var qLower = ch15FilterState.q.trim().toLowerCase();
        var hay = (
          (kc.keyword || "") + " " +
          (kc.category || "") + " " +
          stripHtml(kc.part1_what || kc.what_it_does || "") + " " +
          stripHtml(kc.part2_backend || kc.backend_scenario || "") + " " +
          (kc.part3_tsql || kc.tsql_code || "")
        ).toLowerCase();
        if (hay.indexOf(qLower) === -1) return false;
      }
      return true;
    });

    var html = '<section class="section-card" id="sec-keyword-cards">' +
      '<h2>3B. Bách Khoa Toàn Thư Từ Khóa T-SQL (' + cards.length + ' Thẻ 4 Phần — DB FruitStore_Ultimate)</h2>' +
      '<div class="callout-info"><b>Cấu trúc Thẻ 4 Phần chuẩn hóa:</b> (1) Giải thích ngắn gọn nó làm gì &bull; (2) Tình huống thực tế Backend Java/.NET cần dùng &bull; (3) Code mẫu T-SQL trên DB FruitStore &bull; (4) Bảng Output minh họa &amp; Nút chạy thử trong Lab.</div>' +
      '<fieldset class="retro-groupbox" style="margin:10px 0;"><legend>🔎 Bộ Lọc Từ Điển Từ Khóa T-SQL</legend>' +
        '<div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">' +
          '<button class="' + (ch15FilterState.part === "ALL" ? "default" : "") + '" data-ch15-part="ALL">Tất cả (' + cards.length + ')</button>' +
          '<button class="' + (ch15FilterState.part === "A" ? "default" : "") + '" data-ch15-part="A">⭐ Phần A: Cốt Lõi Bắt Buộc (' + countA + ')</button>' +
          '<button class="' + (ch15FilterState.part === "B" ? "default" : "") + '" data-ch15-part="B">🚀 Phần B: Nâng Cao / Biết Thêm (' + countB + ')</button>' +
          '<select id="ch15-cat-select" aria-label="Lọc theo nhóm từ khóa">' +
            '<option value="ALL"' + (ch15FilterState.cat === "ALL" ? ' selected' : '') + '>-- Tất cả nhóm (' + allCats.length + ') --</option>';
    allCats.forEach(function(cat) {
      html += '<option value="' + escapeHtml(cat) + '"' + (ch15FilterState.cat === cat ? ' selected' : '') + '>' + escapeHtml(cat) + '</option>';
    });
    html += '</select>' +
          '<input type="text" id="ch15-kw-search" placeholder="Tìm nhanh (VD: ROW_NUMBER, APPLY, MERGE, JSON...)" value="' + escapeHtml(ch15FilterState.q) + '" style="flex:1; min-width:180px;">' +
          '<button class="default" data-nav-view="lab" data-param="fruitstore">🍉 Mở Lab FruitStore (9 Bảng)</button>' +
        '</div>' +
      '</fieldset>' +
      '<div style="font-size:12px; margin-bottom:8px; color:var(--text-muted);">Đang hiển thị <b>' + filtered.length + ' / ' + cards.length + '</b> thẻ từ khóa:</div>';

    filtered.forEach(function(card, idx) {
      var isPartA = (card.part === "A");
      var badgeHtml = isPartA
        ? '<span class="badge-chuan">[PHẦN A - CỐT LÕI BẮT BUỘC]</span>'
        : '<span class="badge-tsql">[PHẦN B - NÂNG CAO / BIẾT THÊM]</span>';
      var whatText = card.part1_what || card.what_it_does || "";
      var backendText = card.part2_backend || card.backend_scenario || "";
      var tsqlCode = card.part3_tsql || card.tsql_code || "";
      var outTable = card.part4_output || card.output || null;

      html += '<div class="example-box" id="kw-card-' + escapeHtml(card.id || idx) + '">' +
        '<div class="example-header">' +
          '<span><b>#' + (idx + 1) + '. ' + escapeHtml(card.keyword) + '</b> ' + badgeHtml + ' <small style="color:var(--text-muted);">[' + escapeHtml(card.category || "") + ']</small></span>' +
          '<div style="display:flex; gap:4px;">' +
            '<button data-copy-text="' + encodeURIComponent(tsqlCode) + '">📋 Sao chép T-SQL</button>' +
            (card.lab_sql ? '<button class="default" data-push-lab-sql="' + encodeURIComponent(card.lab_sql) + '" data-lab-db="fruitstore">⚡ Chạy thử trong Lab FruitStore</button>' : '') +
          '</div>' +
        '</div>' +
        '<div style="margin-bottom:6px;"><b>(1) Giải thích ngắn gọn nó làm gì:</b> ' + whatText + '</div>' +
        '<div style="margin-bottom:8px;"><b>(2) Tình huống thực tế Backend Java/.NET cần dùng:</b> ' + backendText + '</div>' +
        '<div style="margin-bottom:4px;"><b>(3) Code mẫu T-SQL áp dụng trên DB FruitStore:</b></div>' +
        '<pre class="code-block"><code>' + escapeHtml(tsqlCode) + '</code></pre>' +
        (outTable ? '<div style="margin-top:8px;"><b>(4) Output minh họa dạng bảng:</b>' + renderStaticTableHtml(outTable) + '</div>' : '') +
      '</div>';
    });

    html += '</section>';
    return html;
  }

  /* ========================================================================
     7. PHÒNG THỰC HÀNH SQL 2 CỘT (.lab-grid) & MÁY CHẤM TỰ ĐỘNG (TASK FIX 05)
     ======================================================================== */
  function normalizeVal(val) {
    if (val === null || val === undefined) return null;
    if (typeof val === "number") return Number(val.toFixed(4));
    var s = String(val).trim();
    var num = Number(s);
    if (!isNaN(num) && s !== "" && !/^[A-Za-z_]/.test(s)) return Number(num.toFixed(4));
    return s.toLowerCase();
  }

  function getAll77LabProblems() {
    var list = [];
    (DATA.chapters || []).forEach(function(ch, cIdx) {
      var chCode = ch.code || ("Chương " + (ch.num || (cIdx + 1)));
      (ch.basics || []).forEach(function(b, bIdx) {
        var pid = b.id || (ch.id + "_b" + (b.num || (bIdx + 1)));
        list.push({
          id: pid,
          chId: ch.id,
          chCode: chCode,
          title: b.title || ("Bài cơ bản " + (bIdx + 1)),
          difficulty: "Cơ bản",
          db: b.db || "truonghoc",
          prompt: b.problem || b.prompt || b.summary || "",
          h1: (b.hints && b.hints[0]) || b.intuition || "Xác định bảng nguồn và điều kiện lọc.",
          h2: (b.hints && b.hints[1]) || b.trace || "Kiểm tra các cột cần SELECT và thứ tự ORDER BY.",
          solSql: b.sql || b.solution_sql || "",
          expected: b.expected || b.expected_output || null,
          starter_sql: b.starter_sql || "",
          required_keywords: b.required_keywords || [],
          forbidden_keywords: b.forbidden_keywords || [],
          order_matters: !!b.order_matters,
          note3: {
            idea: b.intuition || (ch.goals && ch.goals[0]) || "",
            syntax: (b.hints && b.hints[1]) || "",
            trap: (ch.common_errors && ch.common_errors[0]) || ""
          }
        });
      });
      (ch.practice || []).forEach(function(p, pIdx) {
        var pid = p.id || (ch.id + "_p" + (pIdx + 1));
        list.push({
          id: pid,
          chId: ch.id,
          chCode: chCode,
          title: p.title || ("Bài thực hành " + (pIdx + 1)),
          difficulty: p.difficulty || "Thực hành",
          db: p.db || "shoponline",
          prompt: p.summary || p.prompt || p.problem || "",
          h1: p.understand || (p.hints && p.hints[0]) || "Phân tích mối quan hệ giữa các bảng.",
          h2: p.optimal || (p.hints && p.hints[1]) || "Viết truy vấn tối ưu và kiểm tra NULL.",
          solSql: p.sql || p.solution_sql || "",
          expected: p.expected || p.expected_output || null,
          starter_sql: p.starter_sql || "",
          required_keywords: p.required_keywords || [],
          forbidden_keywords: p.forbidden_keywords || [],
          order_matters: !!p.order_matters,
          note3: p.note3 || {
            idea: p.understand || "",
            syntax: p.optimal || "",
            trap: p.pitfalls || ""
          }
        });
      });
    });

    (DATA.leetcode_challenges || []).forEach(function(lc) {
      list.push({
        id: lc.id,
        chId: "ch14",
        chCode: "LeetCode #" + lc.lc_num,
        title: lc.title,
        difficulty: lc.difficulty || "Trung bình",
        db: lc.db || "leetcode",
        prompt: lc.prompt || "",
        h1: (lc.hints && lc.hints[0]) || lc.pattern || lc.hint || "",
        h2: (lc.hints && lc.hints[1]) || "",
        solSql: lc.solution_sql || lc.sql || "",
        expected: lc.expected || null,
        starter_sql: lc.starter_sql || "",
        required_keywords: lc.required_keywords || [],
        forbidden_keywords: lc.forbidden_keywords || [],
        order_matters: !!lc.order_matters,
        note3: {
          idea: "Mẫu bài toán: " + (lc.pattern || lc.title),
          syntax: lc.solution_sql || "",
          trap: (lc.hints && lc.hints[0]) || ""
        }
      });
    });

    return list;
  }

  function gradeSqlProblem(problem, userSql) {
    if (!sqlEngineReady || !SQL) {
      return { pass: false, msg: "SQLite WASM chưa nạp xong. Vui lòng thử lại sau vài giây." };
    }
    var dbId = problem.db || state.activeDbId;
    var dbs = (DATA.labs && DATA.labs.databases) ? DATA.labs.databases : [];
    var dbMeta = dbs.find(function(d) { return d.id === dbId; });
    if (!dbMeta) {
      return { pass: false, msg: "Không tìm thấy cấu hình CSDL: " + dbId };
    }

    var cleanSql = (userSql || "").trim();
    if (!cleanSql) {
      return { pass: false, msg: "Bạn chưa nhập câu lệnh SQL nào!" };
    }

    // 1. Kiểm tra từ khóa bắt buộc / bị cấm (nếu có)
    if (Array.isArray(problem.required_keywords)) {
      for (var i = 0; i < problem.required_keywords.length; i++) {
        var kw = problem.required_keywords[i];
        var reg = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        if (!reg.test(cleanSql)) {
          return { pass: false, msg: "Câu lệnh của bạn cần sử dụng từ khóa: " + kw };
        }
      }
    }
    if (Array.isArray(problem.forbidden_keywords)) {
      for (var j = 0; j < problem.forbidden_keywords.length; j++) {
        var fkw = problem.forbidden_keywords[j];
        var fReg = new RegExp(fkw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        if (fReg.test(cleanSql)) {
          return { pass: false, msg: "Câu lệnh vi phạm quy tắc: Không được dùng " + fkw };
        }
      }
    }

    // 2. Tạo bản sao CSDL sạch trong RAM để chấm điểm nhất quán (hỗ trợ cả DML INSERT/UPDATE/DELETE)
    var tempUserDb = new SQL.Database();
    var userRes = { columns: [], values: [] };
    try {
      if (dbMeta.schema_sql) tempUserDb.run(dbMeta.schema_sql);
      if (dbMeta.seed_sql) tempUserDb.run(dbMeta.seed_sql);
      var uExec = tempUserDb.exec(cleanSql);
      if (uExec && uExec.length > 0) {
        userRes = uExec[uExec.length - 1];
      }
    } catch (err) {
      tempUserDb.close();
      return { pass: false, msg: "Lỗi cú pháp SQL: " + err.message };
    }
    tempUserDb.close();

    // 3. Lấy tập kết quả chuẩn từ problem.expected HOẶC chạy problem.solSql / problem.solution_sql
    var solCols = [];
    var solVals = [];
    if (problem.expected && Array.isArray(problem.expected.cols)) {
      solCols = problem.expected.cols;
      solVals = problem.expected.rows || [];
    } else {
      var refSql = problem.solSql || problem.solution_sql || problem.sql || "";
      if (!refSql) {
        return { pass: false, msg: "Bài tập này chưa có câu lệnh đáp án tham chiếu." };
      }
      var tempSolDb = new SQL.Database();
      try {
        if (dbMeta.schema_sql) tempSolDb.run(dbMeta.schema_sql);
        if (dbMeta.seed_sql) tempSolDb.run(dbMeta.seed_sql);
        var sExec = tempSolDb.exec(refSql);
        if (sExec && sExec.length > 0) {
          solCols = sExec[sExec.length - 1].columns;
          solVals = sExec[sExec.length - 1].values;
        }
      } catch (sErr) {
        tempSolDb.close();
        return { pass: false, msg: "Lỗi khi chạy đáp án chuẩn: " + sErr.message };
      }
      tempSolDb.close();
    }

    var userFormatted = { cols: userRes.columns || [], rows: userRes.values || [] };
    var solFormatted = { cols: solCols, rows: solVals };

    // 4. Đối chiếu số cột và số dòng
    if (userFormatted.cols.length !== solFormatted.cols.length) {
      return {
        pass: false,
        msg: "Sai số lượng cột: Câu lệnh của bạn trả về " + userFormatted.cols.length + " cột (" + userFormatted.cols.join(", ") + "), nhưng đáp án yêu cầu " + solFormatted.cols.length + " cột (" + solFormatted.cols.join(", ") + ").",
        userTable: userFormatted,
        expectedTable: solFormatted
      };
    }

    if (userFormatted.rows.length !== solFormatted.rows.length) {
      return {
        pass: false,
        msg: "Sai số lượng dòng: Câu lệnh của bạn trả về " + userFormatted.rows.length + " dòng, nhưng đáp án chuẩn có " + solFormatted.rows.length + " dòng.",
        userTable: userFormatted,
        expectedTable: solFormatted
      };
    }

    // 5. Chuẩn hóa và đối chiếu từng ô dữ liệu
    var uRows = userFormatted.rows.map(function(r) { return r.map(normalizeVal); });
    var eRows = solFormatted.rows.map(function(r) { return r.map(normalizeVal); });

    if (!problem.order_matters) {
      var sortFn = function(a, b) { return JSON.stringify(a).localeCompare(JSON.stringify(b)); };
      uRows.sort(sortFn);
      eRows.sort(sortFn);
    }

    for (var r = 0; r < eRows.length; r++) {
      for (var c = 0; c < eRows[r].length; c++) {
        if (uRows[r][c] !== eRows[r][c]) {
          return {
            pass: false,
            msg: "Sai lệch dữ liệu tại dòng #" + (r + 1) + " (cột '" + solFormatted.cols[c] + "'): Giá trị của bạn là '" + userFormatted.rows[r][c] + "', trong khi đáp án chuẩn là '" + solFormatted.rows[r][c] + "'." + (problem.order_matters ? " (Lưu ý: Bài này có kiểm tra thứ tự sắp xếp ORDER BY)." : ""),
            userTable: userFormatted,
            expectedTable: solFormatted
          };
        }
      }
    }

    return {
      pass: true,
      msg: "CHÍNH XÁC 100%! Tập kết quả (" + solFormatted.rows.length + " dòng, " + solFormatted.cols.length + " cột) hoàn toàn khớp với đáp án chuẩn!",
      rowCount: solFormatted.rows.length,
      colCount: solFormatted.cols.length,
      userTable: userFormatted,
      expectedTable: solFormatted
    };
  }

  function explainSqlQuery(userSql, dbId) {
    if (!sqlEngineReady || !SQL) {
      return { ok: false, msg: "SQLite WASM chưa nạp xong. Vui lòng thử lại sau vài giây." };
    }
    var cleanSql = (userSql || "").trim();
    if (!cleanSql) {
      return { ok: false, msg: "Vui lòng nhập câu lệnh SQL trước khi xem EXPLAIN QUERY PLAN!" };
    }
    var targetDbId = dbId || state.activeDbId;
    var dbs = (DATA.labs && DATA.labs.databases) ? DATA.labs.databases : [];
    var dbMeta = dbs.find(function(d) { return d.id === targetDbId; });
    if (!dbMeta) {
      return { ok: false, msg: "Không tìm thấy CSDL: " + targetDbId };
    }

    var tempDb = new SQL.Database();
    try {
      if (dbMeta.schema_sql) tempDb.run(dbMeta.schema_sql);
      if (dbMeta.seed_sql) tempDb.run(dbMeta.seed_sql);
      var res = tempDb.exec("EXPLAIN QUERY PLAN " + cleanSql);
      tempDb.close();
      if (!res || res.length === 0) {
        return { ok: false, msg: "Không tạo được kế hoạch thực thi cho câu lệnh này." };
      }
      var planRes = res[0];
      var hasScan = false;
      var hasSearch = false;
      var hasTempBTree = false;

      (planRes.values || []).forEach(function(row) {
        var detail = String(row[row.length - 1] || "");
        if (detail.indexOf("SCAN") !== -1) hasScan = true;
        if (detail.indexOf("SEARCH") !== -1) hasSearch = true;
        if (detail.indexOf("TEMP B-TREE") !== -1 || detail.indexOf("USE TEMP") !== -1) hasTempBTree = true;
      });

      return {
        ok: true,
        columns: planRes.columns,
        values: planRes.values,
        hasScan: hasScan,
        hasSearch: hasSearch,
        hasTempBTree: hasTempBTree
      };
    } catch (err) {
      tempDb.close();
      return { ok: false, msg: "Lỗi EXPLAIN QUERY PLAN: " + err.message };
    }
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

    var allProbs = getAll77LabProblems();
    var currentProblem = window._CURRENT_LAB_PROBLEM || (problemId ? allProbs.find(function(p){ return p.id === problemId; }) : allProbs[0]);
    if (problemId && currentProblem && currentProblem.db) {
      currentDbId = currentProblem.db;
      state.activeDbId = currentDbId;
      currentDbMeta = dbs.find(function(d) { return d.id === currentDbId; }) || dbs[0] || {};
    }

    var html = '<div class="lab-container">' +
      '<div class="ch-banner">' +
        '<div class="ch-code">SQL LAB // SQLITE WASM DETERMINISTIC RUNNER &amp; 77 PROBLEMS</div>' +
        '<h1>Phòng Thực Hành SQL &amp; Máy Chấm Bài Tự Động</h1>' +
        '<div class="ch-source">Bố cục 2 cột chuyên nghiệp | Máy chấm RAM độc lập (Hỗ trợ DML) | Kế hoạch EXPLAIN QUERY PLAN</div>' +
      '</div>';

    // Toolbar chọn Đề bài (77 bài) + CSDL (7 CSDL) + Reset + Schema
    html += '<fieldset class="retro-groupbox" style="margin-bottom:12px;"><legend>🗄️ Chọn Cơ Sở Dữ Liệu &amp; Đề Bài Thực Hành</legend>' +
      '<div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">' +
        '<div class="field-row" style="margin:0;"><label for="lab-problem-select"><b>Đề bài (77 bài):</b></label>' +
        '<select id="lab-problem-select" style="min-width:260px; max-width:400px;">' +
          '<option value="">-- Chọn 1 trong 77 bài tập thực hành --</option>';

    var currentChapterGroup = "";
    allProbs.forEach(function(p) {
      if (p.chCode !== currentChapterGroup) {
        if (currentChapterGroup !== "") html += '</optgroup>';
        currentChapterGroup = p.chCode;
        html += '<optgroup label="' + escapeHtml(currentChapterGroup) + '">';
      }
      var isDone = !!state.completedItems[p.id];
      var isSel = (currentProblem && currentProblem.id === p.id);
      html += '<option value="' + escapeHtml(p.id) + '"' + (isSel ? ' selected' : '') + '>' +
        (isDone ? '✅ ' : '📝 ') + escapeHtml(p.title) + ' [' + escapeHtml(p.difficulty) + ' - DB: ' + escapeHtml(p.db) + ']' +
        '</option>';
    });
    if (currentChapterGroup !== "") html += '</optgroup>';

    html += '</select></div>' +
        '<div class="field-row" style="margin:0;"><label for="lab-db-select"><b>CSDL:</b></label>' +
        '<select id="lab-db-select" style="min-width:160px;">';
    dbs.forEach(function(d) {
      html += '<option value="' + d.id + '" ' + (d.id === currentDbId ? 'selected' : '') + '>' + (d.name || d.id) + '</option>';
    });
    html += '</select></div>' +
        '<button id="btn-lab-reset-db">🔄 Reset CSDL này</button>' +
        '<button id="btn-lab-view-schema">📋 Xem Schema DDL</button>' +
      '</div>' +
    '</fieldset>';

    // BỐ CỤC 2 CỘT (.lab-grid)
    html += '<div class="lab-grid">' +
      '<!-- CỘT TRÁI: ĐỀ BÀI + GỢI Ý 3 TẦNG + SƠ ĐỒ ER ASCII -->' +
      '<div class="lab-col-left">' +
        '<div id="lab-problem-banner" class="exercise-box"></div>' +
        '<fieldset class="retro-groupbox" style="margin-top:10px;">' +
          '<legend>📊 Sơ Đồ Thực Thể Kết Hợp (ERD ASCII): <span id="lab-erd-title">' + escapeHtml(currentDbMeta.name || currentDbId) + '</span></legend>' +
          '<div class="er-box" id="lab-erd-content">' + escapeHtml(currentDbMeta.er_ascii || "Chưa có sơ đồ ER ASCII.") + '</div>' +
          '<div style="text-align:right; margin-top:4px;"><button id="btn-lab-view-schema-inline">📋 Xem chi tiết DDL &amp; Seed SQL</button></div>' +
        '</fieldset>' +
      '</div>' +
      '<!-- CỘT PHẢI: TRÌNH SOẠN THẢO SQL + 4 NÚT HÀNH ĐỘNG + BẢNG KẾT QUẢ -->' +
      '<div class="lab-col-right">' +
        '<fieldset class="retro-groupbox">' +
          '<legend>💻 Trình Soạn Thảo SQL (Nhấn F5: Chạy, Ctrl+S: Chấm điểm)</legend>' +
          '<div class="field-row-stacked">' +
            '<textarea id="sql-editor" rows="9" style="width:100%; font-family:var(--font-mono); font-size:13px; padding:6px; background:var(--bg-panel); color:var(--text-main);" placeholder="-- Nhập câu lệnh SQL tại đây...\nSELECT * FROM SinhVien LIMIT 10;"></textarea>' +
          '</div>' +
          '<div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap; align-items:center;">' +
            '<button class="default" id="btn-run-sql" style="font-weight:bold;">▶ Chạy Thử Lệnh (F5)</button>' +
            '<button id="btn-grade-sql" style="font-weight:bold; color:var(--accent);">✅ Nộp Bài &amp; Chấm Điểm (Ctrl+S)</button>' +
            '<button id="btn-explain-sql" style="font-weight:bold;">🔍 EXPLAIN QUERY PLAN</button>' +
            '<button id="btn-clear-sql">Xóa</button>' +
            '<span id="sql-run-timer" style="margin-left:auto; font-size:11px; color:var(--text-muted);"></span>' +
          '</div>' +
        '</fieldset>' +
        '<div id="sql-result-area" style="margin-top:10px;">' +
          '<div class="sunken-panel sql-result-sunken" id="sql-result-sunken">' +
            '<div style="padding:16px; text-align:center; color:var(--text-muted);">Bấm <b>▶ Chạy Thử Lệnh (F5)</b> hoặc <b>✅ Nộp Bài &amp; Chấm Điểm (Ctrl+S)</b> để xem kết quả tại đây...</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div></div>';

    pane.innerHTML = html;
    pane.scrollTop = 0;

    // Nạp bài tập vào cột trái
    if (currentProblem) {
      loadProblemIntoLab(currentProblem.id);
    }
  }

  function loadProblemIntoLab(problemId) {
    if (!problemId) return;
    var allProbs = getAll77LabProblems();
    var problem = allProbs.find(function(p) { return p.id === problemId || p.id === ("#" + problemId); });
    if (!problem) return;

    window._CURRENT_LAB_PROBLEM = problem;

    // Đồng bộ CSDL nếu bài tập yêu cầu CSDL khác
    if (problem.db && problem.db !== state.activeDbId) {
      state.activeDbId = problem.db;
      var dbSel = document.getElementById("lab-db-select");
      if (dbSel) dbSel.value = problem.db;
      var dbs = (DATA.labs && DATA.labs.databases) ? DATA.labs.databases : [];
      var dbMeta = dbs.find(function(d) { return d.id === problem.db; });
      if (dbMeta) {
        var erdTitle = document.getElementById("lab-erd-title");
        var erdContent = document.getElementById("lab-erd-content");
        if (erdTitle) erdTitle.textContent = dbMeta.name || dbMeta.id;
        if (erdContent) erdContent.textContent = dbMeta.er_ascii || "Chưa có sơ đồ ER ASCII.";
      }
    }

    // Đồng bộ dropdown bài tập
    var probSel = document.getElementById("lab-problem-select");
    if (probSel && probSel.value !== problem.id) {
      probSel.value = problem.id;
    }

    var banner = document.getElementById("lab-problem-banner");
    var editor = document.getElementById("sql-editor");
    if (banner) {
      var isDone = !!state.completedItems[problem.id];
      var bHtml = '<div class="example-header">' +
        '<span>' + (isDone ? '✅ ' : '🎯 ') + '<b>' + escapeHtml(problem.title) + '</b> ' +
        '<span class="badge-chuan">[' + escapeHtml(problem.chCode) + ']</span> ' +
        '<span class="badge-tsql">[Độ khó: ' + escapeHtml(problem.difficulty) + ']</span> ' +
        '<small style="color:var(--text-muted);">(CSDL: ' + escapeHtml(problem.db) + ')</small></span>' +
        '<button class="default" id="btn-copy-sol-to-editor" style="font-size:11px;">📋 Chép Lời Giải Mẫu Vào Ô Gõ</button>' +
        '</div>' +
        '<p style="margin:6px 0; font-size:13px;"><b>Yêu cầu đề bài:</b> ' + escapeHtml(problem.prompt) + '</p>';

      if (problem.h1 || problem.h2 || problem.solSql) {
        bHtml += '<div class="hint-tier"><details><summary style="cursor:pointer; font-weight:bold;">💡 Gợi ý tầng 1 (Ý tưởng &amp; Hướng tư duy)</summary><p style="margin:4px 0;">' + escapeHtml(problem.h1) + '</p></details></div>' +
          '<div class="hint-tier"><details><summary style="cursor:pointer; font-weight:bold;">🧩 Gợi ý tầng 2 (Khung cú pháp &amp; Phân tích)</summary><p style="margin:4px 0;"><code>' + escapeHtml(problem.h2) + '</code></p></details></div>' +
          '<div class="hint-tier"><details><summary style="cursor:pointer; font-weight:bold; color:var(--accent);">🔑 Gợi ý tầng 3 (Lời giải chuẩn &amp; Bảng đối chiếu)</summary>' +
          '<pre class="code-block"><code>' + escapeHtml(problem.solSql) + '</code></pre>' +
          (problem.expected ? renderStaticTableHtml(problem.expected) : '') +
          '</details></div>';
      }

      banner.innerHTML = bHtml;
    }

    if (editor) {
      if (problem.starter_sql) {
        editor.value = problem.starter_sql;
      } else {
        editor.value = "-- Đề bài: " + problem.title + " (CSDL: " + problem.db + ")\n-- Nhập câu truy vấn SQL của bạn bên dưới:\n\n";
      }
      editor.focus();
    }
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
      html += '<th>' + escapeHtml(col) + '</th>';
    });
    html += '</tr></thead><tbody>';

    values.forEach(function(row) {
      html += '<tr>';
      row.forEach(function(cell) {
        var display = (cell === null || cell === undefined) ? '<i style="color:var(--text-muted);">&lt;NULL&gt;</i>' : escapeHtml(cell);
        html += '<td>' + display + '</td>';
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
  }

  /* ========================================================================
     8. RENDER 6 BỘ MÔ PHỎNG TRỰC QUAN (SIMULATORS VIEW - TASK FIX 06)
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

    var html = '<div class="simulators-wrapper">' +
      '<div class="ch-banner">' +
        '<div class="ch-code">VISUAL SIMULATORS // 98.CSS INTERACTIVE LAB</div>' +
        '<h1>' + escapeHtml(sim.title) + '</h1>' +
        '<div class="ch-source">' + escapeHtml(sim.desc) + '</div>' +
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
    var pairs = mData.matched_pairs || [];
    var stepIdx = (window._JOIN_STEP || 0) % (pairs.length + 1); // 0 = xem tất cả, 1..N = từng bước

    // Xác định màu tô SVG Venn theo từng phép JOIN
    var leftFill = (activeMode === "LEFT" || activeMode === "FULL" || activeMode === "CROSS" || activeMode === "ON_VS_WHERE" || activeMode === "LEFT_ANTI")
      ? "rgba(10, 100, 220, 0.55)" : "rgba(150, 150, 150, 0.15)";
    var rightFill = (activeMode === "RIGHT" || activeMode === "FULL" || activeMode === "CROSS")
      ? "rgba(220, 110, 10, 0.55)" : "rgba(150, 150, 150, 0.15)";
    var centerFill = (activeMode === "LEFT_ANTI") ? "rgba(150, 150, 150, 0.15)" : "rgba(16, 150, 72, 0.80)";

    var html = '<fieldset class="retro-groupbox"><legend>🎛️ Chọn Phép Nối Bảng (JOIN Mode) &amp; Chạy Từng Bước</legend>' +
      '<div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:space-between;">' +
        '<div style="display:flex; flex-wrap:wrap; gap:10px;">';
    modeKeys.forEach(function(k) {
      html += '<div class="field-row">' +
        '<input type="radio" id="radio-join-' + k + '" name="join-mode" value="' + k + '" ' + (k === activeMode ? 'checked' : '') + '>' +
        '<label for="radio-join-' + k + '"><b>' + k + '</b></label>' +
      '</div>';
    });
    html += '</div>' +
        '<div style="display:flex; gap:6px;">' +
          '<button class="default" id="btn-join-step">⏭ Bước kế tiếp (Space) [' + (stepIdx === 0 ? "Tổng quan " + pairs.length + " cặp" : "Cặp " + stepIdx + "/" + pairs.length) + ']</button>' +
          '<button id="btn-join-reset">Xem tất cả</button>' +
        '</div>' +
      '</div></fieldset>';

    // Ba cột trực quan: Bảng Trái A | Biểu đồ SVG Venn ở giữa | Bảng Phải B
    html += '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap:12px; align-items:stretch; margin:10px 0;">';

    // Cột 1: Bảng Trái
    html += '<div class="sunken-panel" style="padding:6px;">' +
      '<div style="font-weight:bold; padding:4px; background:var(--bg-window); margin-bottom:4px;">📘 ' + escapeHtml(sim.left_table.name) + '</div>' +
      '<table class="interactive chm-table" style="margin:0;"><thead><tr><th>MaSV</th><th>HoTen</th><th>MaKhoa</th></tr></thead><tbody>';
    sim.left_table.rows.forEach(function(r) {
      html += '<tr><td><b>' + r.MaSV + '</b></td><td>' + r.HoTen + '</td><td>' + (r.MaKhoa ? '<code>' + r.MaKhoa + '</code>' : '<b style="color:var(--err-color);">NULL</b>') + '</td></tr>';
    });
    html += '</tbody></table></div>';

    // Cột 2: Biểu đồ SVG Venn Tập Hợp
    html += '<div class="sim-visual-canvas" style="margin:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">' +
      '<div style="font-weight:bold; color:var(--accent); margin-bottom:4px;">🎨 Biểu Đồ Tập Hợp Venn (' + escapeHtml(activeMode) + ')</div>' +
      '<svg viewBox="0 0 280 135" style="width:240px; height:118px; display:block; margin:2px auto;">' +
        '<defs><clipPath id="joinClipA"><circle cx="102" cy="68" r="50"/></clipPath></defs>' +
        '<circle cx="102" cy="68" r="50" fill="' + leftFill + '" stroke="var(--text-main)" stroke-width="2"/>' +
        '<circle cx="178" cy="68" r="50" fill="' + rightFill + '" stroke="var(--text-main)" stroke-width="2"/>' +
        '<circle cx="178" cy="68" r="50" clip-path="url(#joinClipA)" fill="' + centerFill + '" stroke="var(--text-main)" stroke-width="1.5"/>' +
        '<text x="58" y="64" fill="var(--text-main)" font-size="11" font-weight="bold">Bảng A</text>' +
        '<text x="55" y="78" fill="var(--text-main)" font-size="10">(SV04 NULL)</text>' +
        '<text x="123" y="71" fill="#ffffff" font-size="11" font-weight="bold">A ∩ B</text>' +
        '<text x="188" y="64" fill="var(--text-main)" font-size="11" font-weight="bold">Bảng B</text>' +
        '<text x="188" y="78" fill="var(--text-main)" font-size="10">(Khoa NN)</text>' +
      '</svg>' +
      '<div style="font-size:11px; color:var(--text-muted); margin-top:4px;">' + escapeHtml(mData.label) + '</div>' +
    '</div>';

    // Cột 3: Bảng Phải
    html += '<div class="sunken-panel" style="padding:6px;">' +
      '<div style="font-weight:bold; padding:4px; background:var(--bg-window); margin-bottom:4px;">📙 ' + escapeHtml(sim.right_table.name) + '</div>' +
      '<table class="interactive chm-table" style="margin:0;"><thead><tr><th>MaKhoa</th><th>TenKhoa</th></tr></thead><tbody>';
    sim.right_table.rows.forEach(function(r) {
      html += '<tr><td><code><b>' + r.MaKhoa + '</b></code></td><td>' + r.TenKhoa + '</td></tr>';
    });
    html += '</tbody></table></div></div>';

    // Hộp giải thích bước ghép hiện tại + SQL
    html += '<fieldset class="retro-groupbox"><legend>🔍 Cơ Chế Ghép Dòng: ' + escapeHtml(mData.label) + '</legend>' +
      '<pre class="code-block"><code>' + escapeHtml(mData.sql) + '</code></pre>' +
      '<p style="margin:6px 0;"><b>Bản chất:</b> ' + escapeHtml(mData.desc) + '</p>';

    // Hiển thị các bước kiểm tra cặp khóa nối
    var visiblePairs = stepIdx === 0 ? pairs : pairs.slice(0, stepIdx);
    html += '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">';
    visiblePairs.forEach(function(p, idx) {
      var isDiscard = p.status && p.status.indexOf("DISCARD") !== -1;
      html += '<div style="padding:4px 8px; border:1px solid ' + (isDiscard ? 'var(--err-color)' : 'var(--ok-color)') + '; background:var(--bg-card); font-size:12px;">' +
        '<b>Cặp #' + (idx + 1) + ':</b> ' + escapeHtml(p.left) + ' ⟷ ' + escapeHtml(p.right) + ' &rarr; ' +
        '<b style="color:' + (isDiscard ? 'var(--err-color)' : 'var(--ok-color)') + ';">' + (isDiscard ? '❌ LOẠI BỎ' : '✅ GIỮ LẠI (' + p.status + ')') + '</b>' +
      '</div>';
    });
    html += '</div></fieldset>';

    // Bảng kết quả đầu ra
    html += '<fieldset class="retro-groupbox"><legend>📊 Tập Kết Quả Đầu Ra (' + mData.result_rows.length + ' dòng)</legend>' +
      '<div class="sunken-panel"><table class="interactive chm-table" style="margin:0;"><thead><tr><th>MaSV</th><th>HoTen</th><th>MaKhoa</th><th>TenKhoa</th><th>Giải thích</th></tr></thead><tbody>';
    mData.result_rows.forEach(function(row) {
      html += '<tr>' +
        '<td>' + (row.MaSV ? escapeHtml(row.MaSV) : '<i style="color:var(--err-color);">&lt;NULL&gt;</i>') + '</td>' +
        '<td>' + (row.HoTen ? escapeHtml(row.HoTen) : '<i style="color:var(--err-color);">&lt;NULL&gt;</i>') + '</td>' +
        '<td>' + (row.MaKhoa ? '<code>' + escapeHtml(row.MaKhoa) + '</code>' : '<i style="color:var(--err-color);">&lt;NULL&gt;</i>') + '</td>' +
        '<td>' + (row.TenKhoa ? escapeHtml(row.TenKhoa) : '<i style="color:var(--err-color);">&lt;NULL&gt;</i>') + '</td>' +
        '<td><small>' + escapeHtml(row.ghi_chu || "") + '</small></td>' +
      '</tr>';
    });
    html += '</tbody></table></div></fieldset>';

    return html;
  }

  function renderExecOrderSimulator(sim) {
    var stepIdx = window._EXEC_STEP || 0;
    var step = sim.steps[stepIdx] || sim.steps[0];

    var html = '<fieldset class="retro-groupbox"><legend>📋 Câu Truy Vấn Đang Mô Phỏng</legend>' +
      '<pre class="code-block"><code>' + escapeHtml(sim.query) + '</code></pre>' +
      '</fieldset>';

    // Pipeline 9 bước trực quan
    html += '<div style="margin: 10px 0;">' +
      '<div style="font-weight:bold; font-size:12px; margin-bottom:4px; color:var(--accent);">🚀 PIPELINE 9 BƯỚC THỰC THI LOGIC (Bấm vào bước bất kỳ để nhảy tới Bảng ảo VT tương ứng):</div>' +
      '<div class="pipeline-steps-bar">';
    sim.steps.forEach(function(s, idx) {
      var isAct = (idx === stepIdx);
      var isDone = (idx < stepIdx);
      var cls = isAct ? "active" : (isDone ? "done" : "");
      html += '<button type="button" class="pipeline-step-pill ' + cls + '" data-exec-step="' + idx + '">' +
        (isDone ? '✓ ' : '') + escapeHtml(s.clause) +
        '</button>';
      if (idx < sim.steps.length - 1) {
        html += '<span style="color:var(--text-muted); font-size:11px;">&rarr;</span>';
      }
    });
    html += '</div></div>';

    // Scrubber điều khiển bước
    html += '<div style="display:flex; align-items:center; gap:8px; margin: 10px 0;">' +
      '<button id="btn-exec-prev" ' + (stepIdx <= 0 ? 'disabled' : '') + '>⏮ Bước trước</button>' +
      '<input type="range" class="has-box-indicator" id="exec-step-slider" min="0" max="' + (sim.steps.length - 1) + '" value="' + stepIdx + '" style="flex:1;">' +
      '<button id="btn-exec-next" class="default" ' + (stepIdx >= sim.steps.length - 1 ? 'disabled' : '') + '>Bước tiếp (Space) ▶</button>' +
      '<span style="font-weight:bold; min-width:80px; text-align:right;">Bước ' + (stepIdx + 1) + ' / ' + sim.steps.length + '</span>' +
      '</div>';

    // Nội dung bước hiện tại
    html += '<fieldset class="retro-groupbox" style="border-color:var(--accent);"><legend>⚡ BƯỚC ' + step.step + ': ' + escapeHtml(step.clause) + '</legend>' +
      '<p style="margin:4px 0;"><b>Bảng ảo sinh ra:</b> <span class="badge-chuan">' + escapeHtml(step.vt_name) + '</span></p>' +
      '<p style="margin:4px 0;">' + escapeHtml(step.desc) + '</p>' +
      '<div class="callout-info"><b>Lưu ý mấu chốt:</b> ' + escapeHtml(step.note) + '</div>' +
      '</fieldset>';

    // Dữ liệu bảng ảo
    html += '<fieldset class="retro-groupbox"><legend>📊 Dữ Liệu Bảng Ảo Tại Bước ' + step.step + ' (' + step.rows.length + ' dòng)</legend>' +
      '<div class="sunken-panel"><table class="interactive chm-table" style="margin:0;"><thead><tr>';
    step.columns.forEach(function(c) { html += '<th>' + escapeHtml(c) + '</th>'; });
    html += '</tr></thead><tbody>';
    step.rows.forEach(function(r) {
      html += '<tr>';
      r.forEach(function(cell) { html += '<td>' + (cell === null ? '<i style="color:var(--text-muted);">&lt;NULL&gt;</i>' : escapeHtml(cell)) + '</td>'; });
      html += '</tr>';
    });
    html += '</tbody></table></div></fieldset>';

    return html;
  }

  function renderBTreeSimulator(sim) {
    var scId = window._BTREE_SCENARIO || "sarg_eq";
    var sc = sim.scenarios.find(function(s) { return s.id === scId; }) || sim.scenarios[0];
    var targetKey = Number(window._BTREE_KEY) || 480;

    var rootPage = sim.root_page || { page_id: "Page #1 (Root Node)", keys: ["100..399 -> #20", "400..699 -> #21", "700..999 -> #22"] };
    var intPages = sim.intermediate_pages || [
      { page_id: "Page #20 (Int L1)", range: [100, 399] },
      { page_id: "Page #21 (Int L2)", range: [400, 699] },
      { page_id: "Page #22 (Int L3)", range: [700, 999] }
    ];
    var leafPages = sim.leaf_pages || [
      { page_id: "Page #410 (Leaf)", range: [100, 249], keys: [105, 140, 195, 240] },
      { page_id: "Page #411 (Leaf)", range: [250, 399], keys: [260, 310, 355, 390] },
      { page_id: "Page #412 (Leaf)", range: [400, 549], keys: [410, 480, 520, 545] },
      { page_id: "Page #413 (Leaf)", range: [550, 699], keys: [560, 610, 650, 690] },
      { page_id: "Page #414 (Leaf)", range: [700, 849], keys: [715, 750, 790, 830] },
      { page_id: "Page #415 (Leaf)", range: [850, 999], keys: [860, 880, 920, 975] }
    ];

    var matchedInt = intPages[0];
    intPages.forEach(function(ip) {
      if (targetKey >= ip.range[0] && targetKey <= ip.range[1]) matchedInt = ip;
    });
    var matchedLeaf = leafPages[0];
    leafPages.forEach(function(lp) {
      if (targetKey >= lp.range[0] && targetKey <= lp.range[1]) matchedLeaf = lp;
    });
    var exactFound = matchedLeaf.keys.indexOf(targetKey) !== -1;

    var html = '<fieldset class="retro-groupbox"><legend>🌳 Điều Khiển Dò Cây Chỉ Mục B+Tree &amp; Kiểm Tra SARGability</legend>' +
      '<div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-bottom:10px; padding-bottom:8px; border-bottom:1px dashed var(--border-dark);">' +
        '<label for="inp-btree-key"><b>Nhập khóa MaDH cần dò trên cây B+Tree (100 – 999):</b></label>' +
        '<input type="number" id="inp-btree-key" value="' + targetKey + '" min="100" max="999" style="width:90px; font-family:var(--font-mono); font-weight:bold;">' +
        '<button class="default" id="btn-btree-seek">🔍 Dò Đường Đi Index Seek</button>' +
        '<small style="color:var(--text-muted);">Gợi ý khóa có sẵn: <code>105, 240, 310, 480, 520, 690, 750, 880</code></small>' +
      '</div>' +
      '<div style="display:flex; flex-wrap:wrap; gap:10px;">';
    sim.scenarios.forEach(function(s) {
      html += '<div class="field-row">' +
        '<input type="radio" id="radio-btree-' + s.id + '" name="btree-sc" value="' + s.id + '" ' + (s.id === scId ? 'checked' : '') + '>' +
        '<label for="radio-btree-' + s.id + '">' + escapeHtml(s.name) + '</label>' +
      '</div>';
    });
    html += '</div></fieldset>';

    // SƠ ĐỒ CÂY B+TREE 3 TẦNG TRỰC QUAN
    html += '<div class="sim-visual-canvas">' +
      '<div style="text-align:center; font-weight:bold; color:var(--accent); margin-bottom:8px;">' +
        '🌲 SƠ ĐỒ ĐƯỜNG ĐI TRÊN CÂY CHỈ MỤC B+TREE 3 TẦNG (Khóa đang dò: MaDH = ' + targetKey + ' &rarr; ' +
        (sc.sargable ? '<span style="color:var(--ok-color);">INDEX SEEK: Chỉ đọc đúng 3 trang đĩa!</span>' : '<span style="color:var(--err-color);">NON-SARGABLE SCAN: Bị mù chỉ mục, phải quét toàn bộ các trang lá!</span>') + ')' +
      '</div>' +
      '<!-- Tầng 1: Root -->' +
      '<div class="btree-tier-root">' +
        '<div class="btree-node-box active-seek" style="min-width:320px;">' +
          '<div><b>TẦNG 1 (ROOT NODE): ' + escapeHtml(rootPage.page_id) + '</b></div>' +
          '<small>' + escapeHtml(rootPage.keys.join("  |  ")) + '</small>' +
        '</div>' +
      '</div>' +
      '<div style="text-align:center; font-size:14px; line-height:1; margin-bottom:6px; color:var(--accent);">↙ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↘</div>' +
      '<!-- Tầng 2: Intermediate -->' +
      '<div class="btree-tier-int">';
    intPages.forEach(function(ip) {
      var isHit = (ip.page_id === matchedInt.page_id);
      html += '<div class="btree-node-box ' + (isHit ? 'active-seek' : '') + '">' +
        '<div><b>' + (isHit ? '🎯 ' : '') + 'TẦNG 2: ' + escapeHtml(ip.page_id) + '</b></div>' +
        '<small>Phạm vi khóa: [' + ip.range[0] + ' .. ' + ip.range[1] + ']</small>' +
      '</div>';
    });
    html += '</div>' +
      '<div style="text-align:center; font-size:13px; line-height:1; margin-bottom:6px; color:var(--accent);">⬇ Dẫn hướng xuống các trang lá (Leaf Pages — Doubly Linked List ◄──►) ⬇</div>' +
      '<!-- Tầng 3: Leaf Pages -->' +
      '<div class="btree-tier-leaf">';
    leafPages.forEach(function(lp) {
      var isHit = (lp.page_id === matchedLeaf.page_id);
      var cls = sc.sargable ? (isHit ? "active-seek" : "") : "scanned-page";
      html += '<div class="btree-node-box ' + cls + '">' +
        '<div><b>' + (isHit ? '✅ ' : (sc.sargable ? '' : '🔥 ')) + escapeHtml(lp.page_id) + '</b></div>' +
        '<small>[' + lp.range[0] + '..' + lp.range[1] + ']</small><br>' +
        '<code>' + escapeHtml(lp.keys.join(", ")) + '</code>' +
      '</div>';
    });
    html += '</div>' +
      '<div style="margin-top:8px; text-align:center; font-size:12px;">' +
        'Kết quả dò khóa <b>' + targetKey + '</b>: Đi thẳng <code>' + escapeHtml(rootPage.page_id) + '</code> &rarr; <code>' + escapeHtml(matchedInt.page_id) + '</code> &rarr; <code>' + escapeHtml(matchedLeaf.page_id) + '</code> (' +
        (exactFound ? '<b style="color:var(--ok-color);">Tìm thấy khóa ' + targetKey + ' ngay tại trang lá!</b>' : '<b style="color:var(--err-color);">Xác định ngay khóa ' + targetKey + ' không tồn tại sau đúng 3 lần đọc trang!</b>') + ')' +
      '</div>' +
    '</div>';

    // Kịch bản SARGability chi tiết + Biểu đồ thanh so sánh I/O Pages
    var ioPct = Math.min(100, Math.max(2, Math.round((sc.io_pages / 8500) * 100)));
    html += '<fieldset class="retro-groupbox" style="border-color:' + (sc.sargable ? 'var(--ok-color)' : 'var(--err-color)') + ';">' +
      '<legend>' + (sc.sargable ? '✅ PHÂN TÍCH KỊCH BẢN TỐI ƯU (SARGable)' : '🚨 PHÂN TÍCH KỊCH BẢN PHẠM BẪY (Non-SARGable)') + '</legend>' +
      '<pre class="code-block"><code>' + escapeHtml(sc.sql) + '</code></pre>' +
      '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:8px; margin: 8px 0;">' +
        '<div class="sunken-panel" style="padding:6px;"><b>Toán tử Execution Plan:</b><br><span style="color:var(--accent); font-weight:bold;">' + escapeHtml(sc.plan_op) + '</span></div>' +
        '<div class="sunken-panel" style="padding:6px;"><b>Số trang đĩa 8KB phải đọc:</b><br><b style="font-size:14px; color:' + (sc.io_pages <= 20 ? 'var(--ok-color)' : 'var(--err-color)') + ';">' + sc.io_pages + ' / 8.500 trang</b></div>' +
        '<div class="sunken-panel" style="padding:6px;"><b>Thời gian thực thi:</b><br><b>' + escapeHtml(sc.execution_time) + '</b></div>' +
      '</div>' +
      '<div style="margin:8px 0;"><b>Biểu đồ chi phí đọc đĩa (Logical Reads I/O):</b>' +
        '<div class="sunken-panel" style="height:20px; padding:2px; background:var(--bg-panel);">' +
          '<div style="height:100%; width:' + ioPct + '%; background:' + (sc.sargable ? 'var(--ok-color)' : 'var(--err-color)') + '; transition:width 0.25s;"></div>' +
        '</div>' +
      '</div>' +
      '<p style="margin:6px 0;"><b>Đường đi thực tế:</b> <code>' + escapeHtml(sc.tree_path) + '</code></p>' +
      '<p style="margin:6px 0;"><b>Giải thích cơ chế:</b> ' + escapeHtml(sc.io_compare) + '</p>' +
      '<div class="callout-info"><b>💡 Cách tối ưu chuẩn Backend Engineer:</b> ' + escapeHtml(sc.fix_tip) + '</div>' +
    '</fieldset>';

    return html;
  }

  function renderIsolationSimulator(sim) {
    var lKeys = Object.keys(sim.levels);
    var activeL = window._ISO_LEVEL || "READ_UNCOMMITTED";
    var lData = sim.levels[activeL] || sim.levels.READ_UNCOMMITTED;
    var timeline = lData.timeline || [];
    var stepIdx = (window._ISO_STEP || 0) % (timeline.length + 1); // 0 = all, 1..N = up to stepIdx

    var html = '<fieldset class="retro-groupbox"><legend>🔒 Chọn Mức Cô Lập Giao Dịch Hoặc Kịch Bản &amp; Chạy Từng Mốc</legend>' +
      '<div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:space-between;">' +
        '<div style="display:flex; flex-wrap:wrap; gap:8px;">';
    lKeys.forEach(function(k) {
      html += '<div class="field-row">' +
        '<input type="radio" id="radio-iso-' + k + '" name="iso-level" value="' + k + '" ' + (k === activeL ? 'checked' : '') + '>' +
        '<label for="radio-iso-' + k + '"><b>' + k + '</b></label>' +
      '</div>';
    });
    html += '</div>' +
        '<div style="display:flex; gap:6px;">' +
          '<button class="default" id="btn-iso-step">⏭ Bước mốc tiếp theo (Space) [' + (stepIdx === 0 ? "Tất cả " + timeline.length + " mốc" : "Mốc " + stepIdx + "/" + timeline.length) + ']</button>' +
          '<button id="btn-iso-reset">Xem toàn bộ</button>' +
        '</div>' +
      '</div></fieldset>';

    html += '<fieldset class="retro-groupbox"><legend>' + escapeHtml(lData.name) + '</legend>' +
      '<p style="margin:4px 0;"><b>Hiện tượng dị thường:</b> <span style="color:var(--err-color); font-weight:bold;">' + escapeHtml(lData.anomaly) + '</span></p>' +
      '<p style="margin:4px 0;"><b>Cơ chế khóa:</b> ' + escapeHtml(lData.lock_behavior) + '</p>' +
      '</fieldset>';

    // Biểu đồ Deadlock Cycle Graph nếu đang chọn DEADLOCK_DEMO
    if (activeL === "DEADLOCK_DEMO") {
      html += '<div class="sim-visual-canvas" style="text-align:center;">' +
        '<div style="font-weight:bold; color:var(--err-color); margin-bottom:6px;">⚠️ BIỂU ĐỒ CHU KỲ KHÓA CHẾT (DEADLOCK GRAPH - SQL SERVER ERROR 1205)</div>' +
        '<svg viewBox="0 0 420 160" style="max-width:420px; height:150px; display:block; margin:0 auto;">' +
          '<defs>' +
            '<marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
              '<path d="M 0 0 L 10 5 L 0 10 z" fill="var(--err-color)" />' +
            '</marker>' +
          '</defs>' +
          '<rect x="20" y="20" width="130" height="45" rx="4" fill="var(--bg-card)" stroke="var(--border-dark)" stroke-width="2"/>' +
          '<text x="85" y="42" text-anchor="middle" font-weight="bold" fill="var(--text-main)" font-size="12">Transaction A</text>' +
          '<text x="85" y="56" text-anchor="middle" fill="var(--text-muted)" font-size="10">Đang giữ Lock Bảng 1</text>' +
          '<circle cx="210" cy="42" r="28" fill="var(--bg-panel)" stroke="var(--err-color)" stroke-width="2"/>' +
          '<text x="210" y="40" text-anchor="middle" font-weight="bold" fill="var(--err-color)" font-size="11">Bảng 2</text>' +
          '<text x="210" y="52" text-anchor="middle" fill="var(--text-muted)" font-size="9">Khóa bởi B</text>' +
          '<rect x="270" y="95" width="130" height="45" rx="4" fill="var(--bg-card)" stroke="var(--border-dark)" stroke-width="2"/>' +
          '<text x="335" y="117" text-anchor="middle" font-weight="bold" fill="var(--text-main)" font-size="12">Transaction B</text>' +
          '<text x="335" y="131" text-anchor="middle" fill="var(--text-muted)" font-size="10">Đang giữ Lock Bảng 2</text>' +
          '<circle cx="210" cy="117" r="28" fill="var(--bg-panel)" stroke="var(--err-color)" stroke-width="2"/>' +
          '<text x="210" y="115" text-anchor="middle" font-weight="bold" fill="var(--err-color)" font-size="11">Bảng 1</text>' +
          '<text x="210" y="127" text-anchor="middle" fill="var(--text-muted)" font-size="9">Khóa bởi A</text>' +
          '<line x1="150" y1="42" x2="175" y2="42" stroke="var(--err-color)" stroke-width="2" marker-end="url(#arrow)"/>' +
          '<line x1="270" y1="117" x2="245" y2="117" stroke="var(--err-color)" stroke-width="2" marker-end="url(#arrow)"/>' +
          '<path d="M 210,70 L 210,85 L 300,85 L 300,95" fill="none" stroke="var(--err-color)" stroke-width="2" stroke-dasharray="4" marker-end="url(#arrow)"/>' +
          '<path d="M 210,90 L 210,75 L 120,75 L 120,65" fill="none" stroke="var(--err-color)" stroke-width="2" stroke-dasharray="4" marker-end="url(#arrow)"/>' +
        '</svg>' +
        '<div style="font-size:11px; color:var(--text-muted); margin-top:4px;">' +
          'Chu kỳ chờ đợi xoay vòng (Circular Wait) &rarr; SQL Server Lock Monitor can thiệp chọn 1 Transaction có chi phí Rollback thấp nhất làm Deadlock Victim!' +
        '</div>' +
      '</div>';
    }

    // Timeline matrix
    var visibleTicks = stepIdx === 0 ? timeline : timeline.slice(0, stepIdx);
    html += '<fieldset class="retro-groupbox"><legend>⏱️ Timeline Diễn Tiến Hai Giao Dịch (' + visibleTicks.length + ' / ' + timeline.length + ' mốc)</legend>' +
      '<div class="sunken-panel"><table class="interactive chm-table" style="margin:0;"><thead><tr><th>Thời điểm</th><th>Transaction A</th><th>Transaction B</th><th>Trạng thái khóa &amp; Dữ liệu</th><th>Cảnh báo dị thường</th></tr></thead><tbody>';
    visibleTicks.forEach(function(t, idx) {
      var isLast = (stepIdx > 0 && idx === stepIdx - 1);
      html += '<tr style="' + (isLast ? 'background:var(--accent-soft); font-weight:bold;' : '') + '">' +
        '<td><b>' + escapeHtml(t.tick) + '</b><br><small>' + escapeHtml(t.time) + '</small></td>' +
        '<td><pre style="margin:0; font-size:11px;">' + escapeHtml(t.tx_a) + '</pre></td>' +
        '<td><pre style="margin:0; font-size:11px;">' + escapeHtml(t.tx_b) + '</pre></td>' +
        '<td><small><b>' + escapeHtml(t.lock_state) + '</b><br>' + escapeHtml(t.db_val) + '</small></td>' +
        '<td>' + (t.alert ? '<span style="color:var(--err-color); font-weight:bold;">' + escapeHtml(t.alert) + '</span>' : 'Bình thường') + '</td>' +
      '</tr>';
    });
    html += '</tbody></table></div></fieldset>';

    return html;
  }

  function renderNormalizationSimulator(sim) {
    var stageIdx = window._NORM_STAGE || 0;
    var stage = sim.stages[stageIdx] || sim.stages[0];

    var html = '<div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap;">';
    sim.stages.forEach(function(s, idx) {
      html += '<button class="' + (idx === stageIdx ? 'default' : '') + '" data-set-norm-stage="' + idx + '" style="flex:1; min-width:80px;">' + escapeHtml(s.form) + '</button>';
    });
    html += '</div>';

    html += '<fieldset class="retro-groupbox"><legend>📐 ' + escapeHtml(stage.title) + '</legend>' +
      '<p style="margin:4px 0;"><b>Đặc điểm &amp; Nhược điểm:</b> ' + escapeHtml(stage.problems) + '</p>' +
      (stage.anomalies ? '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:6px; margin: 8px 0;">' +
        '<div class="sunken-panel" style="padding:6px;"><b style="color:var(--err-color);">Dị thường Thêm (Insert):</b><br><small>' + escapeHtml(stage.anomalies.insert) + '</small></div>' +
        '<div class="sunken-panel" style="padding:6px;"><b style="color:var(--err-color);">Dị thường Sửa (Update):</b><br><small>' + escapeHtml(stage.anomalies.update) + '</small></div>' +
        '<div class="sunken-panel" style="padding:6px;"><b style="color:var(--err-color);">Dị thường Xóa (Delete):</b><br><small>' + escapeHtml(stage.anomalies.delete) + '</small></div>' +
        '</div>' : '') +
      '<div class="callout-info"><b>Hành động chuẩn hóa:</b> ' + escapeHtml(stage.action_taken) + '</div>' +
      '</fieldset>';

    // Các bảng
    html += '<h3>Các Bảng Sau Khi Tách / Chuẩn Hóa (' + stage.tables.length + ' bảng):</h3>';
    stage.tables.forEach(function(t) {
      html += '<fieldset class="retro-groupbox" style="margin-bottom:10px;"><legend>Bảng: ' + escapeHtml(t.name) + ' (Khóa chính: <code>' + escapeHtml(t.pk) + '</code>)</legend>' +
        '<div class="sunken-panel"><table class="interactive chm-table" style="margin:0;"><thead><tr>';
      t.cols.forEach(function(c) { html += '<th>' + escapeHtml(c) + '</th>'; });
      html += '</tr></thead><tbody>';
      t.rows.forEach(function(r) {
        html += '<tr>';
        r.forEach(function(val) { html += '<td>' + escapeHtml(val) + '</td>'; });
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
        '<label for="radio-inj-' + s.id + '">' + escapeHtml(s.label) + '</label>' +
      '</div>';
    });
    html += '</div></fieldset>';

    html += '<fieldset class="retro-groupbox"><legend>💉 Dữ Liệu Hacker Nhập Vào Form</legend>' +
      '<div class="field-row" style="margin-bottom:4px;"><label style="width:100px;">Username:</label><input type="text" value="' + escapeHtml(sc.username_input) + '" readonly style="flex:1; font-family:var(--font-mono); color:var(--err-color); font-weight:bold;"></div>' +
      '<div class="field-row"><label style="width:100px;">Password:</label><input type="text" value="' + escapeHtml(sc.password_input) + '" readonly style="flex:1; font-family:var(--font-mono);"></div>' +
      '</fieldset>';

    // So sánh trực quan AST
    html += '<div class="sim-visual-canvas">' +
      '<div style="font-weight:bold; color:var(--accent); margin-bottom:8px; text-align:center;">' +
        '🌲 SO SÁNH CÂY CÚ PHÁP TRỪU TƯỢNG (ABSTRACT SYNTAX TREE - AST)' +
      '</div>' +
      '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:10px;">' +
        '<div class="sunken-panel" style="padding:8px; text-align:center;">' +
          '<div style="color:var(--err-color); font-weight:bold; margin-bottom:4px;">❌ AST Bị Bẻ Nhánh (Nối Chuỗi)</div>' +
          '<svg viewBox="0 0 240 110" style="width:100%; height:95px; display:block; margin:0 auto;">' +
            '<rect x="95" y="8" width="50" height="22" rx="3" fill="var(--warn-bg)" stroke="var(--err-color)" stroke-width="1.5"/>' +
            '<text x="120" y="23" text-anchor="middle" font-weight="bold" fill="var(--err-color)" font-size="11">OR</text>' +
            '<rect x="15" y="65" width="95" height="22" rx="3" fill="var(--bg-card)" stroke="var(--border-dark)"/>' +
            '<text x="62" y="80" text-anchor="middle" font-size="9" fill="var(--text-main)">u = \'admin\'</text>' +
            '<rect x="130" y="65" width="95" height="22" rx="3" fill="var(--warn-bg)" stroke="var(--err-color)" stroke-width="1.5"/>' +
            '<text x="177" y="80" text-anchor="middle" font-weight="bold" font-size="9" fill="var(--err-color)">\'1\'=\'1\' (TRUE)</text>' +
            '<line x1="110" y1="30" x2="65" y2="65" stroke="var(--border-dark)" stroke-width="1.5"/>' +
            '<line x1="130" y1="30" x2="175" y2="65" stroke="var(--err-color)" stroke-width="2"/>' +
          '</svg>' +
          '<small style="color:var(--err-color);">Cấu trúc logic bị thay đổi hoàn toàn: Biểu thức luôn TRUE!</small>' +
        '</div>' +
        '<div class="sunken-panel" style="padding:8px; text-align:center;">' +
          '<div style="color:var(--ok-color); font-weight:bold; margin-bottom:4px;">✅ AST Bất Biến (Parameterized Query)</div>' +
          '<svg viewBox="0 0 240 110" style="width:100%; height:95px; display:block; margin:0 auto;">' +
            '<rect x="95" y="8" width="50" height="22" rx="3" fill="var(--accent-soft)" stroke="var(--ok-color)" stroke-width="1.5"/>' +
            '<text x="120" y="23" text-anchor="middle" font-weight="bold" fill="var(--ok-color)" font-size="11">AND</text>' +
            '<rect x="15" y="65" width="95" height="22" rx="3" fill="var(--bg-card)" stroke="var(--border-dark)"/>' +
            '<text x="62" y="80" text-anchor="middle" font-size="9" fill="var(--text-main)">u = @p0 (literal)</text>' +
            '<rect x="130" y="65" width="95" height="22" rx="3" fill="var(--bg-card)" stroke="var(--border-dark)"/>' +
            '<text x="177" y="80" text-anchor="middle" font-size="9" fill="var(--text-main)">p = @p1 (literal)</text>' +
            '<line x1="110" y1="30" x2="65" y2="65" stroke="var(--ok-color)" stroke-width="1.5"/>' +
            '<line x1="130" y1="30" x2="175" y2="65" stroke="var(--ok-color)" stroke-width="1.5"/>' +
          '</svg>' +
          '<small style="color:var(--ok-color);">Dữ liệu hacker chỉ là chuỗi thuần túy (@p0), không thể thực thi mã!</small>' +
        '</div>' +
      '</div>' +
    '</div>';

    // So sánh trực tiếp
    html += '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-bottom:12px;">' +
      '<fieldset class="retro-groupbox" style="border-color:var(--err-color);"><legend>❌ Cách Nguy Hiểm: Nối Chuỗi (Dynamic SQL)</legend>' +
        '<pre class="code-block" style="border-left:4px solid var(--err-color);"><code>' + escapeHtml(sc.raw_concat_sql) + '</code></pre>' +
        '<p style="margin:4px 0;"><b>Hậu quả:</b> <span style="color:var(--err-color); font-weight:bold;">' + escapeHtml(sc.concat_outcome) + '</span></p>' +
      '</fieldset>' +
      '<fieldset class="retro-groupbox" style="border-color:var(--ok-color);"><legend>🛡️ Cách Phòng Thủ Chuẩn: Parameterized Query</legend>' +
        '<pre class="code-block" style="border-left:4px solid var(--ok-color);"><code>' + escapeHtml(sc.prepared_sql) + '</code></pre>' +
        '<p style="margin:4px 0;"><b>Kết quả:</b> <span style="color:var(--ok-color); font-weight:bold;">' + escapeHtml(sc.prepared_outcome) + '</span></p>' +
      '</fieldset>' +
    '</div>';

    html += '<fieldset class="retro-groupbox"><legend>👨‍💻 Mã Nguồn Backend Chuẩn Mực (Java JDBC &amp; C# SqlCommand)</legend>' +
      '<pre class="code-block"><code>' + escapeHtml(sc.backend_fix_code) + '</code></pre>' +
      '</fieldset>';

    return html;
  }

  /* ========================================================================
     9. RENDER PHÒNG PHỎNG VẤN & LEETCODE (INTERVIEW ROOM - TASK FIX 07)
     ======================================================================== */
  function renderInterviewView() {
    state.lastView = "interview";
    updateAddressBar("chm://bikip-csdl-v2005/interview-room/leitner");
    updateStatusCell(2, "🎯 Luyện Phỏng Vấn Leitner & 12 LeetCode SQL");

    var pane = document.getElementById("reading-pane");
    if (!pane) return;

    var bank = DATA.interview_bank || [];
    var filterLevel = window._INTERVIEW_FILTER || "ALL";
    var boxFilter = (typeof window._INTERVIEW_BOX_FILTER === "number") ? window._INTERVIEW_BOX_FILTER : 0; // 0 = all
    var viewMode = window._INTERVIEW_VIEW_MODE || "list"; // list | flip

    // Thống kê 3 Hộp Leitner
    var box1 = [], box2 = [], box3 = [];
    bank.forEach(function(card) {
      var b = state.leitnerBoxes[card.id] || 1;
      if (b === 2) box2.push(card);
      else if (b === 3) box3.push(card);
      else box1.push(card);
    });

    // Lọc theo level & box
    var currentCards = bank.filter(function(card) {
      if (filterLevel !== "ALL" && card.level !== filterLevel) return false;
      var b = state.leitnerBoxes[card.id] || 1;
      if (boxFilter !== 0 && b !== boxFilter) return false;
      return true;
    });

    // Đồng hồ 15 phút
    var totalSec = (typeof window._EXAM_SECONDS === "number") ? window._EXAM_SECONDS : 900;
    var mins = Math.floor(totalSec / 60);
    var secs = totalSec % 60;
    var timerStr = (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
    var isRunning = !!window._EXAM_RUNNING;

    var html = '<div class="interview-wrap">' +
      '<div class="ch-banner">' +
        '<div class="ch-code">INTERVIEW FLASHCARDS // LEITNER 3-BOX &amp; 15-MIN MOCK EXAM</div>' +
        '<h1>Ngân Hàng 48 Thẻ Phỏng Vấn Backend &amp; 12 Bài LeetCode SQL</h1>' +
        '<div class="ch-source">Lặp Lại Ngắt Quãng (Spaced Repetition) &bull; Đồng hồ thi thử 15 phút &bull; Chế độ Lật Thẻ Từng Câu</div>' +
      '</div>';

    // THANH ĐIỀU KHIỂN & ĐỒNG HỒ 15:00
    html += '<fieldset class="retro-groupbox" style="margin-bottom:12px;"><legend>⏱️ Đồng Hồ Thi Thử Phỏng Vấn 15 Phút &amp; Chế Độ Hiển Thị</legend>' +
      '<div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:space-between;">' +
        '<div style="display:flex; align-items:center; gap:8px;">' +
          '<span style="font-size:13px;"><b>Thời gian còn lại:</b></span>' +
          '<span id="exam-timer-display" style="font-size:18px; font-weight:bold; font-family:var(--font-mono); color:' + (totalSec <= 120 ? 'var(--err-color)' : 'var(--ok-color)') + '; background:var(--bg-card); padding:2px 8px; border:1px solid var(--border-dark);">' + timerStr + '</span>' +
          '<button class="' + (isRunning ? '' : 'default') + '" id="btn-timer-toggle">' + (isRunning ? '⏸ Tạm Dừng' : '▶ Bắt Đầu 15:00') + '</button>' +
          '<button id="btn-timer-reset">🔄 Đặt Lại 15:00</button>' +
        '</div>' +
        '<div style="display:flex; gap:6px;">' +
          '<button class="' + (viewMode === "list" ? "default" : "") + '" data-iv-mode="list">📋 Danh Sách Tất Cả (' + bank.length + ')</button>' +
          '<button class="' + (viewMode === "flip" ? "default" : "") + '" data-iv-mode="flip">🎴 Lật Thẻ Từng Câu (Flipper)</button>' +
        '</div>' +
      '</div></fieldset>';

    // 3 HỘP LEITNER CÓ NÚT LỌC
    html += '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap:8px; margin-bottom:12px;">' +
      '<div class="window" style="cursor:pointer;" data-iv-box-filter="1">' +
        '<div class="title-bar" style="background:' + (boxFilter === 1 ? 'var(--err-color)' : '') + ';"><div class="title-bar-text">📦 Hộp 1: Cần Ôn Lại (' + box1.length + ' thẻ)</div></div>' +
        '<div class="window-body" style="padding:6px;"><small>' + (boxFilter === 1 ? '<b>[ĐANG LỌC]</b> ' : '') + 'Thẻ mới hoặc cần khắc sâu kiến thức</small></div>' +
      '</div>' +
      '<div class="window" style="cursor:pointer;" data-iv-box-filter="2">' +
        '<div class="title-bar" style="background:' + (boxFilter === 2 ? 'var(--accent)' : '') + ';"><div class="title-bar-text">📬 Hộp 2: Đang Nhớ (' + box2.length + ' thẻ)</div></div>' +
        '<div class="window-body" style="padding:6px;"><small>' + (boxFilter === 2 ? '<b>[ĐANG LỌC]</b> ' : '') + 'Đã trả lời đúng 1 lần, cần củng cố</small></div>' +
      '</div>' +
      '<div class="window" style="cursor:pointer;" data-iv-box-filter="3">' +
        '<div class="title-bar" style="background:' + (boxFilter === 3 ? 'var(--ok-color)' : '') + ';"><div class="title-bar-text">📭 Hộp 3: Đã Thuộc Lòng (' + box3.length + ' thẻ)</div></div>' +
        '<div class="window-body" style="padding:6px;"><small>' + (boxFilter === 3 ? '<b>[ĐANG LỌC]</b> ' : '') + 'Nắm chắc 100%, sẵn sàng ăn điểm</small></div>' +
      '</div>' +
    '</div>';

    // BỘ LỌC CẤP ĐỘ
    html += '<fieldset class="retro-groupbox" style="margin-bottom:14px;"><legend>🎚️ Lọc Theo Cấp Độ Tuyển Dụng &amp; Trạng Thái Hộp</legend>' +
      '<div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">' +
        '<div class="field-row"><input type="radio" id="rad-lvl-all" name="iv-lvl" value="ALL" ' + (filterLevel === "ALL" ? "checked" : "") + '><label for="rad-lvl-all">Tất cả cấp độ</label></div>' +
        '<div class="field-row"><input type="radio" id="rad-lvl-fresher" name="iv-lvl" value="Fresher" ' + (filterLevel === "Fresher" ? "checked" : "") + '><label for="rad-lvl-fresher">Fresher</label></div>' +
        '<div class="field-row"><input type="radio" id="rad-lvl-junior" name="iv-lvl" value="Junior" ' + (filterLevel === "Junior" ? "checked" : "") + '><label for="rad-lvl-junior">Junior</label></div>' +
        '<div class="field-row"><input type="radio" id="rad-lvl-mid" name="iv-lvl" value="Mid" ' + (filterLevel === "Mid" ? "checked" : "") + '><label for="rad-lvl-mid">Mid-level</label></div>' +
        (boxFilter !== 0 ? '<button data-iv-box-filter="0" style="margin-left:auto;">❌ Bỏ lọc Hộp ' + boxFilter + ' (Xem cả 3 Hộp)</button>' : '') +
      '</div></fieldset>';

    // NỘI DUNG CHÍNH: CHẾ ĐỘ FLIPPER HOẶC DANH SÁCH
    if (viewMode === "flip") {
      var flipIdx = (window._FLIP_INDEX || 0);
      if (flipIdx >= currentCards.length) flipIdx = 0;
      var activeCard = currentCards[flipIdx];

      html += '<div style="max-width:680px; margin: 0 auto 24px auto;">';
      if (!activeCard) {
        html += '<div class="callout-info">Không có thẻ nào phù hợp với bộ lọc hiện tại.</div>';
      } else {
        var cardBox = state.leitnerBoxes[activeCard.id] || 1;
        html += '<div class="window" id="flashcard-flipper-window">' +
          '<div class="title-bar">' +
            '<div class="title-bar-text">Thẻ #' + activeCard.id + ' [' + activeCard.level + '] — Chủ đề: ' + escapeHtml(activeCard.topic) + '</div>' +
          '</div>' +
          '<div class="window-body" style="padding:14px;">' +
            '<div class="example-box" id="flashcard-flipper-card" data-flip-card="1" style="min-height:160px; cursor:pointer; display:flex; flex-direction:column; justify-content:center; text-align:center; padding:20px; transition:all 0.2s ease;">' +
              '<div id="flip-front">' +
                '<span class="badge-tsql">[' + escapeHtml(activeCard.level) + ']</span>' +
                '<h2 style="margin:10px 0; border:none; color:var(--text-main); font-size:16px;">' + escapeHtml(activeCard.q) + '</h2>' +
                '<small style="color:var(--accent);">👆 Bấm vào khung để lật xem đáp án chuẩn ↷</small>' +
              '</div>' +
              '<div id="flip-back" style="display:none; text-align:left;">' +
                '<div style="color:var(--ok-color); font-weight:bold; margin-bottom:6px;">✅ Trả lời cốt lõi (15 giây đầu):</div>' +
                '<p style="margin:0 0 10px 0; font-size:13px;">' + escapeHtml(activeCard.a) + '</p>' +
                '<div style="color:var(--accent); font-weight:bold; margin-bottom:4px;">🔥 Câu hỏi xoáy từ Nhà tuyển dụng:</div>' +
                '<p style="margin:0 0 10px 0; font-size:12px; font-style:italic;">' + escapeHtml(activeCard.followup || "Nêu ví dụ thực tế trong dự án bạn đã từng làm?") + '</p>' +
                '<small style="color:var(--text-muted); display:block; text-align:center;">👆 Bấm vào khung để quay lại câu hỏi ↶</small>' +
              '</div>' +
            '</div>' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; flex-wrap:wrap; gap:8px;">' +
              '<button id="btn-flip-prev" ' + (flipIdx <= 0 ? 'disabled' : '') + '>◄ Câu trước</button>' +
              '<span><b>Câu ' + (flipIdx + 1) + ' / ' + currentCards.length + '</b> (Đang ở Hộp: <b>' + cardBox + '</b>)</span>' +
              '<button id="btn-flip-next" class="default" ' + (flipIdx >= currentCards.length - 1 ? 'disabled' : '') + '>Câu tiếp ►</button>' +
            '</div>' +
            '<div style="display:flex; gap:6px; justify-content:center; margin-top:10px; border-top:1px dashed var(--border-dark); padding-top:10px;">' +
              '<button data-move-leitner="' + activeCard.id + '" data-target-box="1" ' + (cardBox === 1 ? 'disabled' : '') + '>📦 Về Hộp 1: Cần ôn lại</button>' +
              '<button data-move-leitner="' + activeCard.id + '" data-target-box="2" ' + (cardBox === 2 ? 'disabled' : '') + '>📬 Lên Hộp 2: Đang nhớ</button>' +
              '<button data-move-leitner="' + activeCard.id + '" data-target-box="3" ' + (cardBox === 3 ? 'disabled' : '') + '>📭 Thuộc Hộp 3: Đã thuộc lòng</button>' +
            '</div>' +
          '</div></div>';
      }
      html += '</div>';
    } else {
      // Chế độ Danh sách đầy đủ
      html += '<h2>Danh Sách Thẻ Phỏng Vấn Đang Hiển Thị (' + currentCards.length + ' thẻ)</h2>';
      html += '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:10px; margin-bottom:24px;">';
      currentCards.forEach(function(card) {
        var currentBox = state.leitnerBoxes[card.id] || 1;
        html += '<div class="window" style="display:flex; flex-direction:column;">' +
          '<div class="title-bar">' +
            '<div class="title-bar-text">#' + card.id + ' [' + card.level + '] ' + escapeHtml(card.topic) + '</div>' +
          '</div>' +
          '<div class="window-body" style="flex:1; display:flex; flex-direction:column; padding:8px;">' +
            '<p style="font-weight:bold; flex:1; margin:4px 0 8px 0;">' + escapeHtml(card.q) + '</p>' +
            '<details style="margin-bottom:8px;"><summary style="cursor:pointer; font-weight:bold; color:var(--accent);">Xem câu trả lời chuẩn &amp; câu hỏi xoáy...</summary>' +
              '<p style="margin-top:6px; font-size:12px;">' + escapeHtml(card.a) + '</p>' +
              '<p style="color:var(--accent); font-size:12px; margin:4px 0 0 0;"><b>Câu hỏi xoáy:</b> ' + escapeHtml(card.followup) + '</p>' +
            '</details>' +
            '<div style="display:flex; gap:4px; align-items:center; border-top:1px solid var(--border-light); padding-top:6px;">' +
              '<span style="font-size:11px;">Hộp: <b>' + currentBox + '</b></span>' +
              '<button data-move-leitner="' + card.id + '" data-target-box="1" ' + (currentBox === 1 ? 'disabled' : '') + ' style="font-size:10px; margin-left:auto;">Về Hộp 1</button>' +
              '<button data-move-leitner="' + card.id + '" data-target-box="2" ' + (currentBox === 2 ? 'disabled' : '') + ' style="font-size:10px;">Lên Hộp 2</button>' +
              '<button data-move-leitner="' + card.id + '" data-target-box="3" ' + (currentBox === 3 ? 'disabled' : '') + ' style="font-size:10px;">Thuộc Hộp 3</button>' +
            '</div>' +
          '</div></div>';
      });
      html += '</div>';
    }

    // THỐNG KÊ CHỦ ĐỀ CÒN YẾU (Dựa trên số thẻ ở Hộp 1)
    var topicMap = {};
    bank.forEach(function(c) {
      var t = c.topic || "Khác";
      if (!topicMap[t]) topicMap[t] = { total: 0, box1: 0 };
      topicMap[t].total++;
      if ((state.leitnerBoxes[c.id] || 1) === 1) {
        topicMap[t].box1++;
      }
    });

    html += '<h2>📊 Thống Kê Chủ Đề Cần Bổ Túc Gấp (Dựa trên Hộp 1: Cần Ôn Lại)</h2>' +
      '<div class="sunken-panel" style="margin-bottom:24px;"><table class="interactive chm-table" style="margin:0;"><thead><tr><th>Chủ đề phỏng vấn</th><th>Tổng số thẻ</th><th>Số thẻ còn ở Hộp 1</th><th>Đánh giá mức độ</th></tr></thead><tbody>';
    Object.keys(topicMap).forEach(function(topKey) {
      var inf = topicMap[topKey];
      var statusTag = (inf.box1 >= 3)
        ? '<b style="color:var(--err-color);">🚨 Cần ôn gấp</b>'
        : (inf.box1 >= 1 ? '<span style="color:var(--warn-text);">⚠️ Cần củng cố</span>' : '<span style="color:var(--ok-color);">✅ Đã vững vàng</span>');
      html += '<tr><td><b>' + escapeHtml(topKey) + '</b></td><td>' + inf.total + '</td><td><b style="color:' + (inf.box1 > 0 ? 'var(--err-color)' : 'var(--ok-color)') + ';">' + inf.box1 + '</b></td><td>' + statusTag + '</td></tr>';
    });
    html += '</tbody></table></div>';

    // BẢNG 12 THỬ THÁCH LEETCODE SQL KINH ĐIỂN
    html += '<h2>12 Thử Thách LeetCode SQL Kinh Điển (#175 - #197)</h2>' +
      '<div class="sunken-panel"><table class="interactive chm-table" style="margin:0;"><thead><tr><th>Bài #</th><th>Tiêu đề bài toán</th><th>Độ khó</th><th>Mẫu kỹ thuật (Pattern)</th><th>Hành động</th></tr></thead><tbody>';

    (DATA.leetcode_challenges || []).forEach(function(lc) {
      var isDone = !!state.completedItems[lc.id];
      html += '<tr>' +
        '<td><b>#' + lc.lc_num + '</b></td>' +
        '<td><b>' + escapeHtml(lc.title) + '</b></td>' +
        '<td><span class="badge-' + (lc.difficulty === 'Dễ' ? 'chuan' : 'tsql') + '">' + escapeHtml(lc.difficulty) + '</span></td>' +
        '<td><code>' + escapeHtml(lc.pattern || "") + '</code></td>' +
        '<td>' + (isDone ? '<span style="color:var(--ok-color); font-weight:bold; margin-right:6px;">✓ ĐÃ XONG</span>' : '') +
        '<button class="default" data-open-lab-problem="' + escapeHtml(lc.id) + '" data-db="leetcode">🧪 Làm bài trong Lab</button></td>' +
      '</tr>';
    });

    html += '</tbody></table></div></div>';

    pane.innerHTML = html;
    pane.scrollTop = 0;
  }

  /* ========================================================================
     10. RENDER SỔ TAY 3 DÒNG TỔNG HỢP 77 MỤC (TASK FIX 07)
     ======================================================================== */
  function renderNotesView() {
    state.lastView = "notes";
    updateAddressBar("chm://bikip-csdl-v2005/notebook/progress");
    updateStatusCell(2, "📝 Sổ Tay 3 Dòng & Quản Lý Tiến Độ");

    var pane = document.getElementById("reading-pane");
    if (!pane) return;

    var allProbs = getAll77LabProblems();
    var filterCh = window._NOTE_FILTER_CH || "ALL";
    var filterDiff = window._NOTE_FILTER_DIFF || "ALL";
    var filterDone = window._NOTE_FILTER_DONE || "ALL";

    var filteredNotes = allProbs.filter(function(item) {
      if (filterCh !== "ALL" && item.chId !== filterCh) return false;
      if (filterDiff !== "ALL" && item.difficulty !== filterDiff) return false;
      var isDone = !!state.completedItems[item.id];
      if (filterDone === "DONE" && !isDone) return false;
      if (filterDone === "UNDONE" && isDone) return false;
      return true;
    });

    var html = '<div class="notes-container">' +
      '<div class="ch-banner">' +
        '<div class="ch-code">3-LINE NOTE RULE // 77 LAB PROBLEMS &amp; CHAPTER SUMMARY</div>' +
        '<h1>Sổ Tay Ghi Chú 3 Dòng &amp; Sao Lưu Tiến Độ Cá Nhân</h1>' +
        '<div class="ch-source">Quy tắc 3 dòng: 1. Ý tưởng cốt lõi &bull; 2. Cú pháp &amp; Kỹ thuật &bull; 3. Cạm bẫy thực chiến</div>' +
      '</div>';

    // CÔNG CỤ SAO LƯU & XUẤT NHẬP
    html += '<fieldset class="retro-groupbox" style="margin-bottom:12px;"><legend>💾 Xuất / Nhập Dữ Liệu Học Tập &amp; Tiến Độ</legend>' +
      '<div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">' +
        '<button id="btn-export-markdown" class="default">📥 Xuất Sổ Tay Ra File Markdown (.md)</button>' +
        '<button id="btn-export-json">💾 Sao Lưu Tiến Độ Ra File JSON (.json)</button>' +
        '<button id="btn-import-json">📂 Nhập Lại Tiến Độ Từ File JSON</button>' +
        '<input type="file" id="file-import-input" accept=".json" style="display:none;">' +
        '<button id="btn-reset-all" style="color:var(--err-color); margin-left:auto;">⚠️ Xóa toàn bộ tiến độ</button>' +
      '</div></fieldset>';

    // BỘ LỌC SỔ TAY
    html += '<fieldset class="retro-groupbox" style="margin-bottom:14px;"><legend>🔎 Bộ Lọc Sổ Tay 3 Dòng (' + filteredNotes.length + ' / ' + allProbs.length + ' mục)</legend>' +
      '<div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">' +
        '<div class="field-row" style="margin:0;"><label for="note-filter-ch"><b>Chương:</b></label>' +
        '<select id="note-filter-ch">' +
          '<option value="ALL"' + (filterCh === "ALL" ? ' selected' : '') + '>-- Tất cả chương (15) --</option>';
    (DATA.chapters || []).forEach(function(c) {
      html += '<option value="' + c.id + '"' + (filterCh === c.id ? ' selected' : '') + '>' + (c.code || c.id) + ': ' + escapeHtml(c.title) + '</option>';
    });
    html += '<option value="ch14"' + (filterCh === "ch14" ? ' selected' : '') + '>LeetCode SQL (#175..#197)</option>' +
        '</select></div>' +
        '<div class="field-row" style="margin:0;"><label for="note-filter-diff"><b>Độ khó:</b></label>' +
        '<select id="note-filter-diff">' +
          '<option value="ALL"' + (filterDiff === "ALL" ? ' selected' : '') + '>-- Tất cả độ khó --</option>' +
          '<option value="Cơ bản"' + (filterDiff === "Cơ bản" ? ' selected' : '') + '>Cơ bản</option>' +
          '<option value="Thực hành"' + (filterDiff === "Thực hành" ? ' selected' : '') + '>Thực hành</option>' +
          '<option value="Trung bình"' + (filterDiff === "Trung bình" ? ' selected' : '') + '>LeetCode Trung bình</option>' +
          '<option value="Khó"' + (filterDiff === "Khó" ? ' selected' : '') + '>LeetCode Khó</option>' +
        '</select></div>' +
        '<div class="field-row" style="margin:0;"><label for="note-filter-done"><b>Trạng thái:</b></label>' +
        '<select id="note-filter-done">' +
          '<option value="ALL"' + (filterDone === "ALL" ? ' selected' : '') + '>-- Tất cả trạng thái --</option>' +
          '<option value="DONE"' + (filterDone === "DONE" ? ' selected' : '') + '>✅ Đã hoàn thành</option>' +
          '<option value="UNDONE"' + (filterDone === "UNDONE" ? ' selected' : '') + '>📝 Chưa hoàn thành</option>' +
        '</select></div>' +
      '</div></fieldset>';

    // DANH SÁCH 77 MỤC GHI CHÚ
    filteredNotes.forEach(function(item) {
      var isDone = !!state.completedItems[item.id];
      var userNote = state.notes3Line[item.id] || (
        "1. Ý tưởng: " + (item.note3 ? item.note3.idea : "") + "\n" +
        "2. Cú pháp: " + (item.note3 ? item.note3.syntax : "") + "\n" +
        "3. Bẫy: " + (item.note3 ? item.note3.trap : "")
      );

      html += '<fieldset class="retro-groupbox" style="margin-bottom:12px;">' +
        '<legend>' + (isDone ? '✅ ' : '📝 ') + '<b>[' + escapeHtml(item.chCode) + '] ' + escapeHtml(item.title) + '</b> <small style="color:var(--text-muted);">(CSDL: ' + escapeHtml(item.db) + ')</small></legend>' +
        '<div style="font-size:12px; margin-bottom:6px; color:var(--text-muted);"><b>Đề bài:</b> ' + escapeHtml(item.prompt) + '</div>' +
        '<div class="field-row-stacked">' +
          '<textarea id="note-text-' + escapeHtml(item.id) + '" rows="3" style="width:100%; font-family:var(--font-mono); font-size:12px; padding:6px; background:var(--bg-panel); color:var(--text-main);">' + escapeHtml(userNote) + '</textarea>' +
          '<div style="margin-top:4px; display:flex; justify-content:space-between; align-items:center;">' +
            '<button class="default" data-save-ch-note="' + escapeHtml(item.id) + '">💾 Lưu ghi chú này</button>' +
            '<button data-open-lab-problem="' + escapeHtml(item.id) + '" data-db="' + escapeHtml(item.db) + '">🧪 Mở Trong Phòng Lab ►</button>' +
          '</div>' +
        '</div>' +
      '</fieldset>';
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
      // Space: Tiến bước trong Simulator (Hỗ trợ JOIN, Exec Order, Isolation)
      if (e.key === " " && state.lastView === "simulators") {
        if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
        e.preventDefault();
        if (state.activeSimulatorId === "join") {
          var btnJoin = document.getElementById("btn-join-step");
          if (btnJoin) btnJoin.click();
        } else if (state.activeSimulatorId === "exec_order") {
          var btnExec = document.getElementById("btn-exec-next");
          if (btnExec && !btnExec.disabled) btnExec.click();
        } else if (state.activeSimulatorId === "isolation") {
          var btnIso = document.getElementById("btn-iso-step");
          if (btnIso) btnIso.click();
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

      // Chép lời giải mẫu vào editor trong Lab
      if (target.id === "btn-copy-sol-to-editor") {
        if (window._CURRENT_LAB_PROBLEM && window._CURRENT_LAB_PROBLEM.solSql) {
          var ed = document.getElementById("sql-editor");
          if (ed) {
            ed.value = window._CURRENT_LAB_PROBLEM.solSql;
            showToast("Đã chép lời giải mẫu vào ô gõ SQL.");
            ed.focus();
          }
        }
        return;
      }

      // Sao chép đoạn text (data-copy-text)
      var copyBtn = target.closest("[data-copy-text]");
      if (copyBtn) {
        var copyVal = decodeURIComponent(copyBtn.getAttribute("data-copy-text") || "");
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(copyVal).then(function() {
            showToast("Đã sao chép vào bộ nhớ tạm (Clipboard)!");
          }).catch(function() {
            prompt("Sao chép nội dung bên dưới (Ctrl+C):", copyVal);
          });
        } else {
          prompt("Sao chép nội dung bên dưới (Ctrl+C):", copyVal);
        }
        return;
      }

      // Bộ lọc Chương 15: Phần A / B
      var ch15PartBtn = target.closest("[data-ch15-part]");
      if (ch15PartBtn) {
        ch15FilterState.part = ch15PartBtn.getAttribute("data-ch15-part");
        renderChapterView(state.lastChapterId, "sec-keyword-cards");
        return;
      }

      // Toggle hoàn thành chương / bài tập
      var toggleDoneChk = target.closest("[data-toggle-done]");
      if (toggleDoneChk) {
        var itemKey = toggleDoneChk.getAttribute("data-toggle-done");
        state.completedItems[itemKey] = toggleDoneChk.checked;
        saveState();
        updateOverallProgress();
        showToast(toggleDoneChk.checked ? "Đã đánh dấu hoàn thành!" : "Đã bỏ đánh dấu.");
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

      // Lọc theo Hộp Leitner trong Interview
      var ivBoxBtn = target.closest("[data-iv-box-filter]");
      if (ivBoxBtn) {
        window._INTERVIEW_BOX_FILTER = parseInt(ivBoxBtn.getAttribute("data-iv-box-filter"), 10);
        renderInterviewView();
        return;
      }

      // Đổi chế độ hiển thị Interview (List vs Flipper)
      var ivModeBtn = target.closest("[data-iv-mode]");
      if (ivModeBtn) {
        window._INTERVIEW_VIEW_MODE = ivModeBtn.getAttribute("data-iv-mode");
        renderInterviewView();
        return;
      }

      // Đồng hồ đếm ngược Interview
      if (target.id === "btn-timer-toggle") {
        toggleExamTimer();
        return;
      }
      if (target.id === "btn-timer-reset") {
        resetExamTimer();
        return;
      }

      // Flipper lật thẻ & điều hướng câu
      var flipBox = target.closest("[data-flip-card]");
      if (flipBox && !target.closest("button")) {
        var fFront = document.getElementById("flip-front");
        var fBack = document.getElementById("flip-back");
        if (fFront && fBack) {
          var isFrontVisible = (fFront.style.display !== "none");
          fFront.style.display = isFrontVisible ? "none" : "block";
          fBack.style.display = isFrontVisible ? "block" : "none";
        }
        return;
      }
      if (target.id === "btn-flip-prev") {
        window._FLIP_INDEX = Math.max(0, (window._FLIP_INDEX || 0) - 1);
        renderInterviewView();
        return;
      }
      if (target.id === "btn-flip-next") {
        window._FLIP_INDEX = (window._FLIP_INDEX || 0) + 1;
        renderInterviewView();
        return;
      }

      // Dò B-Tree Index Seek
      if (target.id === "btn-btree-seek") {
        var inpK = document.getElementById("inp-btree-key");
        if (inpK) {
          window._BTREE_KEY = parseInt(inpK.value, 10) || 480;
          renderSimulatorsView("btree");
        }
        return;
      }

      // Bước JOIN
      if (target.id === "btn-join-step") {
        window._JOIN_STEP = (window._JOIN_STEP || 0) + 1;
        renderSimulatorsView("join");
        return;
      }
      if (target.id === "btn-join-reset") {
        window._JOIN_STEP = 0;
        renderSimulatorsView("join");
        return;
      }

      // Bước Isolation
      if (target.id === "btn-iso-step") {
        window._ISO_STEP = (window._ISO_STEP || 0) + 1;
        renderSimulatorsView("isolation");
        return;
      }
      if (target.id === "btn-iso-reset") {
        window._ISO_STEP = 0;
        renderSimulatorsView("isolation");
        return;
      }

      // Pipeline Bước Exec Order
      var pStepBtn = target.closest("[data-exec-step]");
      if (pStepBtn) {
        window._EXEC_STEP = parseInt(pStepBtn.getAttribute("data-exec-step"), 10);
        renderSimulatorsView("exec_order");
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
        return;
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
      if (target.id === "btn-explain-sql") {
        explainLabSql();
        return;
      }
      if (target.id === "btn-clear-sql") {
        var edClean = document.getElementById("sql-editor");
        if (edClean) edClean.value = "";
        return;
      }
      if (target.id === "btn-lab-reset-db") {
        resetDatabase(state.activeDbId);
        return;
      }
      if (target.id === "btn-lab-view-schema" || target.id === "btn-lab-view-schema-inline") {
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

    // Đổi chế độ Backend trên Toolbar (both, java, csharp)
    var langSelect = document.getElementById("lang-mode-select");
    if (langSelect) {
      langSelect.value = state.langMode || "both";
      langSelect.onchange = function() {
        state.langMode = langSelect.value;
        saveState();
        if (state.lastView === "chapter") {
          renderChapterView(state.lastChapterId);
        }
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

    // Bắt sự kiện Radio & Select trong Simulators, Interview & Lab
    document.addEventListener("change", function(e) {
      // Đổi CSDL trong Lab
      if (e.target.id === "lab-db-select") {
        state.activeDbId = e.target.value;
        saveState();
        renderLabView(state.activeDbId);
        return;
      }

      // Đổi đề bài trong Lab (77 bài)
      if (e.target.id === "lab-problem-select") {
        loadProblemIntoLab(e.target.value);
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

      // Bộ lọc trong Sổ tay 3 dòng
      if (e.target.id === "note-filter-ch") {
        window._NOTE_FILTER_CH = e.target.value;
        renderNotesView();
        return;
      }
      if (e.target.id === "note-filter-diff") {
        window._NOTE_FILTER_DIFF = e.target.value;
        renderNotesView();
        return;
      }
      if (e.target.id === "note-filter-done") {
        window._NOTE_FILTER_DONE = e.target.value;
        renderNotesView();
        return;
      }

      // Bộ lọc nhóm từ khóa trong Chương 15
      if (e.target.id === "ch15-cat-select") {
        ch15FilterState.cat = e.target.value;
        renderChapterView(state.lastChapterId, "sec-keyword-cards");
        return;
      }
    });

    // Tìm kiếm tức thời trong Chương 15
    document.addEventListener("input", function(e) {
      if (e.target.id === "ch15-kw-search") {
        ch15FilterState.q = e.target.value;
        var cardsSec = document.getElementById("sec-keyword-cards");
        if (cardsSec) {
          var chIdx = (DATA.chapters || []).findIndex(function(c) { return c.id === "ch15"; });
          if (chIdx !== -1) {
            cardsSec.outerHTML = renderChapter15KeywordDictionary(DATA.chapters[chIdx]);
            var inp = document.getElementById("ch15-kw-search");
            if (inp) {
              inp.focus();
              inp.setSelectionRange(inp.value.length, inp.value.length);
            }
          }
        }
      }
    });
  }

  function toggleExamTimer() {
    if (window._EXAM_RUNNING) {
      clearInterval(window._EXAM_TIMER_INTERVAL);
      window._EXAM_RUNNING = false;
    } else {
      if (typeof window._EXAM_SECONDS !== "number" || window._EXAM_SECONDS <= 0) {
        window._EXAM_SECONDS = 900;
      }
      window._EXAM_RUNNING = true;
      window._EXAM_TIMER_INTERVAL = setInterval(function() {
        if (window._EXAM_SECONDS > 0) {
          window._EXAM_SECONDS--;
          var el = document.getElementById("exam-timer-display");
          if (el) {
            var m = Math.floor(window._EXAM_SECONDS / 60);
            var s = window._EXAM_SECONDS % 60;
            el.textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
            el.style.color = (window._EXAM_SECONDS <= 120 ? "var(--err-color)" : "var(--ok-color)");
          }
        } else {
          clearInterval(window._EXAM_TIMER_INTERVAL);
          window._EXAM_RUNNING = false;
          showToast("⏰ HẾT GIỜ LÀM BÀI PHỎNG VẤN 15 PHÚT! Hãy đối chiếu lại các câu chưa thuộc.", true);
          renderInterviewView();
        }
      }, 1000);
    }
    renderInterviewView();
  }

  function resetExamTimer() {
    if (window._EXAM_TIMER_INTERVAL) clearInterval(window._EXAM_TIMER_INTERVAL);
    window._EXAM_RUNNING = false;
    window._EXAM_SECONDS = 900;
    renderInterviewView();
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
      showToast("Hiện tại chưa chọn đề bài nào. Hãy chọn 1 bài từ dropdown 77 bài tập phía trên!", true);
      return;
    }

    var grade = gradeSqlProblem(problem, sql);

    if (grade.pass) {
      state.completedItems[problem.id] = true;
      saveState();
      updateOverallProgress();
      showToast("🎉 CHÍNH XÁC 100%! Bài tập '" + problem.title + "' đã đạt chuẩn!");

      var passHtml = '<div class="grade-pass">' +
        '<div>✅ XUẤT SẮC! BÀI TẬP ĐÃ ĐẠT CHUẨN 100%</div>' +
        '<div style="font-weight:normal; font-size:12px; margin-top:4px;">' + escapeHtml(grade.msg) + '</div>' +
        '</div>';

      if (grade.userTable) {
        passHtml += '<div style="margin:8px 0; font-size:12px; font-weight:bold;">📊 Bảng kết quả câu lệnh của bạn (' + grade.rowCount + ' dòng, ' + grade.colCount + ' cột):</div>' +
          renderStaticTableHtml(grade.userTable);
      }

      resSunken.innerHTML = passHtml;
    } else {
      var failHtml = '<div class="grade-fail">' +
        '<div>❌ CHƯA ĐẠT YÊU CẦU</div>' +
        '<div style="font-weight:normal; font-size:12px; margin-top:4px;">' + escapeHtml(grade.msg) + '</div>' +
        '</div>';

      if (grade.userTable && grade.expectedTable) {
        failHtml += '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:10px; margin-top:8px;">' +
          '<div><div style="font-size:12px; font-weight:bold; color:var(--err-color); margin-bottom:4px;">❌ Kết quả câu lệnh của bạn (' + (grade.userTable.rows ? grade.userTable.rows.length : 0) + ' dòng):</div>' +
          renderStaticTableHtml(grade.userTable) + '</div>' +
          '<div><div style="font-size:12px; font-weight:bold; color:var(--ok-color); margin-bottom:4px;">✅ Kết quả đáp án mẫu (' + (grade.expectedTable.rows ? grade.expectedTable.rows.length : 0) + ' dòng):</div>' +
          renderStaticTableHtml(grade.expectedTable) + '</div>' +
          '</div>';
      }

      resSunken.innerHTML = failHtml;
    }
  }

  function explainLabSql() {
    var editor = document.getElementById("sql-editor");
    var resSunken = document.getElementById("sql-result-sunken");
    var timer = document.getElementById("sql-run-timer");
    if (!editor || !resSunken) return;

    var sql = editor.value.trim();
    if (!sql) {
      showToast("Vui lòng nhập câu lệnh SQL cần phân tích!", true);
      return;
    }

    var t0 = Date.now();
    var plan = explainSqlQuery(sql, state.activeDbId);
    var dur = Date.now() - t0;
    if (timer) timer.textContent = "⏱️ EXPLAIN: " + dur + " ms";

    if (!plan.ok) {
      resSunken.innerHTML = '<div style="padding:10px; color:var(--err-color); font-weight:bold;">❌ ' + escapeHtml(plan.msg) + '</div>';
      return;
    }

    var html = '<div style="padding:8px;">' +
      '<div style="font-weight:bold; color:var(--accent); font-size:13px; margin-bottom:6px;">🔍 KẾ HOẠCH THỰC THI (EXPLAIN QUERY PLAN) — CSDL ' + escapeHtml(state.activeDbId) + ':</div>' +
      renderResultTableHtml(plan.columns, plan.values, dur);

    html += '<fieldset class="retro-groupbox" style="margin-top:10px;"><legend>🧠 Nhận Xét Hiệu Năng Của Chuyên Gia Backend</legend>';
    if (plan.hasScan) {
      html += '<div style="color:var(--err-color); margin-bottom:4px;"><b>⚠️ CẢNH BÁO TABLE SCAN:</b> Phát hiện phép quét toàn bộ bảng tuần tự (Full Table Scan). Khi bảng có hàng triệu dòng, phép toán này sẽ gây thắt cổ chai I/O đĩa. Hãy tạo INDEX trên các cột trong điều kiện WHERE hoặc ON.</div>';
    }
    if (plan.hasSearch) {
      html += '<div style="color:var(--ok-color); margin-bottom:4px;"><b>⚡ TỐI ƯU INDEX SEEK (SEARCH USING INDEX):</b> Truy vấn tận dụng tốt chỉ mục B-Tree để tìm kiếm nhị phân trực tiếp, độ phức tạp O(log N).</div>';
    }
    if (plan.hasTempBTree) {
      html += '<div style="color:var(--accent); margin-bottom:4px;"><b>💡 SỬ DỤNG TEMP B-TREE:</b> Động cơ cơ sở dữ liệu phải tạo một cây B-Tree tạm thời trong bộ nhớ RAM để thực hiện ORDER BY / GROUP BY.</div>';
    }
    if (!plan.hasScan && !plan.hasSearch && !plan.hasTempBTree) {
      html += '<div style="color:var(--ok-color);">Truy vấn đơn giản, thực thi trực tiếp trên bảng.</div>';
    }
    html += '</fieldset></div>';

    resSunken.innerHTML = html;
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

  // Xuất API công khai phục vụ kiểm thử và tương tác nâng cao
  global.BiKipApp = {
    getState: function() { return state; },
    getAll77LabProblems: getAll77LabProblems,
    gradeSqlProblem: gradeSqlProblem,
    explainSqlQuery: explainSqlQuery,
    navigateTo: navigateTo,
    renderChapterView: renderChapterView,
    renderLabView: renderLabView,
    renderSimulatorsView: renderSimulatorsView,
    renderInterviewView: renderInterviewView,
    renderNotesView: renderNotesView,
    renderTocView: renderTocView,
    renderLeftTocTree: renderLeftTocTree
  };

  // Chờ DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }

})(typeof window !== "undefined" ? window : global);
