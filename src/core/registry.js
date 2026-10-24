/**
 * ==========================================================================
 * FILE: src/core/registry.js
 * MÔ TẢ: Bộ khởi tạo Không gian tên Toàn cục (Global Namespace Registry)
 * LÝ DO KIẾN TRÚC:
 *   - Giúp ứng dụng tách thành hàng chục file .js nhỏ (theo từng Chương, từng CSDL,
 *     từng Nhánh mở rộng MySQL / PostgreSQL / NoSQL) mà VẪN CHẠY TRỰC TIẾP KHI NHẤP ĐÚP
 *     MỞ FILE index.html (giao thức file://) KHÔNG CẦN LOCAL SERVER và KHÔNG BỊ LỖI CORS!
 * ==========================================================================
 */
(function(global) {
  "use strict";

  global.BIKIP_REGISTRY = {
    toc: null,
    ch0_html: "",
    chapters: [],
    databases: [],
    simulators: {},
    interview_bank: [],
    leetcode_challenges: [],
    appendices_html: "",
    tracks: {},

    /**
     * Đăng ký cấu hình mục lục tổng quan
     */
    registerToc: function(tocObj) {
      this.toc = tocObj;
    },

    /**
     * Đăng ký nội dung HTML cho Chương 0 (Nền tảng & Hướng dẫn cài đặt)
     */
    registerChapter0: function(htmlString) {
      this.ch0_html = htmlString;
    },

    /**
     * Đăng ký một Chương học (Ch.01 -> Ch.15 hoặc các chương mở rộng Ch.16+)
     */
    registerChapter: function(chapterObj) {
      if (!chapterObj || !chapterObj.id) return;
      var existingIdx = this.chapters.findIndex(function(c) { return c.id === chapterObj.id; });
      if (existingIdx !== -1) {
        this.chapters[existingIdx] = chapterObj;
      } else {
        this.chapters.push(chapterObj);
      }
      // Tự động đồng bộ vào danh sách tóm tắt mục lục nếu chương mới chưa có trong toc.chapters_summary
      if (this.toc && Array.isArray(this.toc.chapters_summary)) {
        var inToc = this.toc.chapters_summary.some(function(s) { return s.id === chapterObj.id; });
        if (!inToc) {
          var exCount = (chapterObj.examples || []).length;
          var probCount = (chapterObj.basics || []).length + (chapterObj.practice || []).length;
          this.toc.chapters_summary.push({
            id: chapterObj.id,
            code: chapterObj.code || ("Chương " + this.chapters.length),
            title: chapterObj.title,
            pages_note: exCount + " ví dụ, " + probCount + " bài tập",
            desc: (chapterObj.goals && chapterObj.goals[0]) ? chapterObj.goals[0] : "",
            sections: [
              "1. Mục tiêu & Dấu hiệu nhận biết",
              "2. Lý thuyết & Định nghĩa",
              "3. Cơ chế & Chạy tay từng bước",
              "4. Cú pháp & Ví dụ (" + exCount + ")",
              "5. Khác biệt phương ngữ",
              "6. Cầu nối Java & C#",
              "7. Hiệu năng & Chi phí",
              "8. Lỗi hay gặp",
              "9. Câu hỏi phỏng vấn",
              "10. Bài tập cơ bản & Luyện Lab (" + probCount + ")",
              "11. Tổng kết & Tự kiểm tra"
            ]
          });
          this.toc.total_chapters = this.chapters.length + 1;
        }
      }
    },

    /**
     * Đăng ký một Cơ sở dữ liệu thực hành trong Phòng Lab (SQLite WASM)
     */
    registerDatabase: function(dbObj) {
      if (!dbObj || !dbObj.id) return;
      var existingIdx = this.databases.findIndex(function(d) { return d.id === dbObj.id; });
      if (existingIdx !== -1) {
        this.databases[existingIdx] = dbObj;
      } else {
        this.databases.push(dbObj);
      }
    },

    /**
     * Đăng ký một Nhánh kiến thức mở rộng (Track: MySQL, PostgreSQL, NoSQL...)
     */
    registerTrack: function(trackId, trackMeta) {
      this.tracks[trackId] = trackMeta;
      if (trackMeta && Array.isArray(trackMeta.chapters)) {
        var self = this;
        trackMeta.chapters.forEach(function(ch) {
          if (ch && ch.enabled !== false) {
            self.registerChapter(ch);
          }
        });
      }
      if (trackMeta && Array.isArray(trackMeta.databases)) {
        var selfDb = this;
        trackMeta.databases.forEach(function(db) {
          if (db && db.enabled !== false) {
            selfDb.registerDatabase(db);
          }
        });
      }
    },

    /**
     * Tổng hợp toàn bộ các mô-đun đã nạp thành hằng DATA chuẩn cho giao diện
     */
    buildDataObject: function() {
      return {
        toc: this.toc,
        ch0_html: this.ch0_html,
        chapters: this.chapters,
        labs: {
          databases: this.databases
        },
        simulators: this.simulators,
        interview_bank: this.interview_bank,
        leetcode_challenges: this.leetcode_challenges,
        appendices_html: this.appendices_html,
        tracks: this.tracks
      };
    }
  };
})(window);
