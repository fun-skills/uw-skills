/* ═══════════════════════════════════════════════════════════════
   FROZEN — DO NOT MODIFY
   Immutable JS runtime. COURSE is loaded from data.js (global var).
   Edit data.js for course content — never touch this file.
   ═══════════════════════════════════════════════════════════════ */

(function() {
  "use strict";

  /* COURSE is loaded from data.js (global var) — DO NOT declare it here. */

  /* ── State ───────────────────────────────────────────────── */
  let currentLesson = 0;
  const completed = new Set();

  /* ── DOM refs ────────────────────────────────────────────── */
  const $ = function(sel) { return document.querySelector(sel); };
  const $$ = function(sel) { return document.querySelectorAll(sel); };

  const overview = $("#overview");
  const lessonView = $("#lesson-view");
  const lessonNav = $("#lesson-nav");
  const lessonCards = $("#lesson-cards");
  const startBtn = $("#start-btn");
  const prevBtn = $("#prev-btn");
  const nextBtn = $("#next-btn");
  const resetLink = $("#reset-progress");
  const progressCount = $("#progress-count");

  /* ── Schema version check ───────────────────────────────────── */
  var SCHEMA_VERSION = "1.1.0";
  if (!COURSE.schemaVersion) {
    console.warn("[lesson-generator] data.js 缺少 schemaVersion，可能与当前模板版本 (" + SCHEMA_VERSION + ") 不兼容");
  } else if (COURSE.schemaVersion !== SCHEMA_VERSION) {
    console.warn("[lesson-generator] schema 版本不匹配：data.js=" + COURSE.schemaVersion + "，模板=" + SCHEMA_VERSION);
  }

  /* ── Apply style & populate HTML from COURSE ────────────────── */
  if (COURSE.style) document.documentElement.dataset.style = COURSE.style;
  document.title = COURSE.title;
  $("#course-badge").textContent = COURSE.badge;
  $("#sidebar-title").textContent = COURSE.title;
  var metaSpans = $$("#hero-meta span");
  metaSpans[0].textContent = COURSE.lessons.length + " 节";
  metaSpans[2].textContent = "约 " + COURSE.duration + " 分钟";
  $("#hero h1").textContent = COURSE.title;
  $("#hero-desc").textContent = COURSE.description;
  progressCount.textContent = "0/" + COURSE.lessons.length;

  /* ── Build sidebar nav ───────────────────────────────────── */
  function buildSidebar() {
    COURSE.lessons.forEach(function(l) {
      var li = document.createElement("li");
      li.className = "nav-item";
      li.dataset.lesson = l.id;
      var numStr = l.id < 10 ? "0" + l.id : String(l.id);
      li.innerHTML = '<span class="nav-number">' + numStr + '</span><span class="nav-label">' + l.title + '</span>';
      li.addEventListener("click", function() { showLesson(l.id); });
      lessonNav.appendChild(li);
    });
  }

  /* ── Build overview cards ────────────────────────────────── */
  function buildOverviewCards() {
    COURSE.lessons.forEach(function(l) {
      var card = document.createElement("div");
      card.className = "lesson-card";
      var cardNumStr = l.id < 10 ? "0" + l.id : String(l.id);
      card.innerHTML =
        '<div class="lesson-card-number">' + cardNumStr + '</div>' +
        '<div class="lesson-card-title">' + l.title + '</div>' +
        '<div class="lesson-card-concepts">' + l.concepts.join(" · ") + '</div>';
      card.addEventListener("click", function() { showLesson(l.id); });
      lessonCards.appendChild(card);
    });
  }

  /* ── Show view ───────────────────────────────────────────── */
  function showOverview() {
    currentLesson = 0;
    overview.classList.add("active");
    lessonView.classList.remove("active");
    updateSidebarActive();
    updateNavButtons();
  }

  function showLesson(id) {
    currentLesson = id;
    overview.classList.remove("active");
    lessonView.classList.add("active");
    renderLesson(id);
    updateSidebarActive();
    updateNavButtons();
    window.scrollTo(0, 0);
  }

  /* ── Render lesson ───────────────────────────────────────── */
  function renderLesson(id) {
    var l = COURSE.lessons[id - 1];
    if (!l) return;

    var showIcons = COURSE.showIcons !== false;
    var lessonNumStr = id < 10 ? "0" + id : String(id);
    $("#lesson-number").textContent = lessonNumStr;
    $("#lesson-title").textContent = l.title;
    $("#lesson-goal").textContent = l.goal;

    var objList = $("#objectives-list");
    objList.innerHTML = "";
    l.objectives.forEach(function(o) {
      var li = document.createElement("li");
      li.textContent = o;
      objList.appendChild(li);
    });

    var body = $("#lesson-body");
    body.innerHTML = "";
    l.body.forEach(function(block) {
      if (block.type === "p") {
        var p = document.createElement("p");
        p.textContent = block.text;
        body.appendChild(p);
      } else if (block.type === "ai-dialog") {
        var box = document.createElement("div");
        box.className = "ai-dialog-box";
        var label = document.createElement("div");
        label.className = "ai-dialog-label";
        label.textContent = block.label;
        box.appendChild(label);
        block.messages.forEach(function(m) {
          var msg = document.createElement("div");
          msg.className = "chat-msg";
          msg.innerHTML =
            '<div class="role ' + m.role + '">' + (m.role === "user" ? "你" : "AI") + '</div>' +
            '<div class="msg-text">' + m.text + '</div>';
          box.appendChild(msg);
        });
        body.appendChild(box);
      } else if (block.type === "code-example") {
        var box = document.createElement("div");
        box.className = "code-example-box";
        var label = document.createElement("div");
        label.className = "code-example-label";
        label.textContent = block.label;
        box.appendChild(label);
        if (block.lang) {
          var lang = document.createElement("span");
          lang.className = "code-example-lang";
          lang.textContent = block.lang;
          box.appendChild(lang);
        }
        var pre = document.createElement("pre");
        var code = document.createElement("code");
        code.textContent = block.code;
        pre.appendChild(code);
        box.appendChild(pre);
        body.appendChild(box);
      } else if (block.type === "case-example") {
        var box = document.createElement("div");
        box.className = "case-example-box";
        var label = document.createElement("div");
        label.className = "case-example-label";
        label.textContent = block.label;
        box.appendChild(label);
        var scenario = document.createElement("div");
        scenario.className = "case-example-scenario";
        scenario.innerHTML = "<strong>场景：</strong>" + block.scenario;
        box.appendChild(scenario);
        var analysis = document.createElement("div");
        analysis.className = "case-example-analysis";
        analysis.innerHTML = "<strong>分析：</strong>" + block.analysis;
        box.appendChild(analysis);
        body.appendChild(box);
      } else if (block.type === "insight") {
        var insight = document.createElement("div");
        insight.className = "insight";
        if (showIcons && block.icon) {
          var iconEl = document.createElement("span");
          iconEl.className = "insight-icon";
          iconEl.textContent = block.icon;
          insight.appendChild(iconEl);
        }
        var bodyDiv = document.createElement("div");
        bodyDiv.className = "insight-body";
        if (block.title) {
          var titleEl = document.createElement("strong");
          titleEl.className = "insight-title";
          titleEl.textContent = block.title;
          bodyDiv.appendChild(titleEl);
        }
        var textEl = document.createElement("span");
        textEl.className = "insight-text";
        textEl.textContent = block.text;
        bodyDiv.appendChild(textEl);
        insight.appendChild(bodyDiv);
        body.appendChild(insight);
      } else if (block.type === "list-block") {
        var grid = document.createElement("div");
        grid.className = "pattern-cards";
        block.items.forEach(function(item) {
          var card = document.createElement("div");
          card.className = "pattern-card";
          var iconDiv = document.createElement("div");
          iconDiv.className = "pattern-icon";
          iconDiv.textContent = showIcons && item.icon ? item.icon : "";
          card.appendChild(iconDiv);
          var titleDiv = document.createElement("div");
          titleDiv.className = "pattern-title";
          titleDiv.textContent = item.title;
          card.appendChild(titleDiv);
          var descP = document.createElement("p");
          descP.className = "pattern-desc";
          descP.textContent = item.desc;
          card.appendChild(descP);
          grid.appendChild(card);
        });
        body.appendChild(grid);
      }
    });

    var fcContainer = $("#flashcards-container");
    fcContainer.innerHTML = "";
    if (l.flashcards.length > 0) {
      $("#flashcards-block").style.display = "block";
      l.flashcards.forEach(function(card) {
        var fc = document.createElement("div");
        fc.className = "flashcard";
        var iconHTML = (showIcons && card.icon) ? '<span class="flashcard-icon">' + card.icon + '</span>' : '';
        fc.innerHTML =
          '<div class="flashcard-inner">' +
            '<div class="flashcard-front">' + iconHTML + card.front + '</div>' +
            '<div class="flashcard-back">' + iconHTML + card.back + '</div>' +
          '</div>';
        fc.addEventListener("click", function() { fc.classList.toggle("flipped"); });
        fcContainer.appendChild(fc);
      });
    } else {
      $("#flashcards-block").style.display = "none";
    }

    var quizContainer = $("#quiz-container");
    quizContainer.innerHTML = "";
    var isFinal = id === COURSE.lessons.length;
    var quizEnabled = isFinal
      ? (COURSE.showFinalQuiz !== false)
      : (COURSE.showQuiz !== false);
    if (l.quiz.length > 0 && quizEnabled) {
      $("#quiz-block").style.display = "block";
      if (isFinal) {
        buildFinalQuiz(quizContainer, l.quiz);
      } else {
        buildLessonQuiz(quizContainer, l.quiz);
      }
    } else {
      $("#quiz-block").style.display = "none";
    }

    var srcContainer = $("#sources-container");
    srcContainer.innerHTML = "";
    if (l.sources.length > 0) {
      $("#sources-block").style.display = "block";
      l.sources.forEach(function(s) {
        var a = document.createElement("a");
        a.className = "source-card";
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.innerHTML = '<span class="source-label">' + s.label + '</span><span class="source-url">' + s.url + '</span>';
        srcContainer.appendChild(a);
      });
    } else {
      $("#sources-block").style.display = "none";
    }

    if (id < COURSE.lessons.length) {
      completed.add(id);
      updateProgress();
    }
  }

  function buildLessonQuiz(container, questions) {
    questions.forEach(function(q, qi) {
      var div = document.createElement("div");
      div.className = "quiz-question";
      div.innerHTML = '<div class="q-text">' + (qi + 1) + '. ' + q.question + '</div>';

      var feedbackDiv = document.createElement("div");
      feedbackDiv.className = "quiz-feedback";

      q.options.forEach(function(opt, oi) {
        var btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.textContent = String.fromCharCode(65 + oi) + '. ' + opt.text;
        btn.addEventListener("click", function() {
          if (btn.classList.contains("disabled")) return;

          var allBtns = div.querySelectorAll(".quiz-option");
          allBtns.forEach(function(b) { b.classList.add("disabled"); });

          if (opt.correct) {
            btn.classList.add("correct");
            feedbackDiv.className = "quiz-feedback correct-fb show";
          } else {
            btn.classList.add("incorrect");
            feedbackDiv.className = "quiz-feedback incorrect-fb show";
            allBtns.forEach(function(b, i) {
              if (q.options[i].correct) b.classList.add("show-correct");
            });
          }
          feedbackDiv.textContent = opt.feedback;
        });
        div.appendChild(btn);
      });

      div.appendChild(feedbackDiv);
      container.appendChild(div);
    });
  }

  function buildFinalQuiz(container, questions) {
    var score = 0;
    var total = questions.length;
    var answered = 0;

    var scoreDiv = document.createElement("div");
    scoreDiv.className = "final-score";
    scoreDiv.style.display = "none";
    scoreDiv.innerHTML = '<div class="score-number" id="final-score-num">0</div><div class="score-label">/' + total + ' 题正确</div>';
    container.appendChild(scoreDiv);

    questions.forEach(function(q, qi) {
      var div = document.createElement("div");
      div.className = "quiz-question";
      div.innerHTML = '<div class="q-text">' + (qi + 1) + '. ' + q.question + '</div>';

      var feedbackDiv = document.createElement("div");
      feedbackDiv.className = "quiz-feedback";

      q.options.forEach(function(opt, oi) {
        var btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.textContent = String.fromCharCode(65 + oi) + '. ' + opt.text;
        btn.addEventListener("click", function() {
          if (btn.classList.contains("disabled")) return;

          var allBtns = div.querySelectorAll(".quiz-option");
          allBtns.forEach(function(b) { b.classList.add("disabled"); });

          if (opt.correct) {
            btn.classList.add("correct");
            feedbackDiv.className = "quiz-feedback correct-fb show";
            score++;
          } else {
            btn.classList.add("incorrect");
            feedbackDiv.className = "quiz-feedback incorrect-fb show";
            allBtns.forEach(function(b, i) {
              if (q.options[i].correct) b.classList.add("show-correct");
            });
          }
          feedbackDiv.textContent = opt.feedback;
          answered++;

          if (answered === total) {
            scoreDiv.style.display = "block";
            $("#final-score-num").textContent = score;
            if (score === total) {
              scoreDiv.querySelector(".score-label").textContent = "/" + total + " 题正确 — 你对本课程的理解非常扎实！";
            } else if (score >= total * 0.7) {
              scoreDiv.querySelector(".score-label").textContent = "/" + total + " 题正确 — 不错！回顾错题对应的课程巩固一下。";
            } else {
              scoreDiv.querySelector(".score-label").textContent = "/" + total + " 题正确 — 建议重新浏览前面几节，重点复习错题涉及的概念。";
            }
          }
        });
        div.appendChild(btn);
      });

      div.appendChild(feedbackDiv);
      container.appendChild(div);
    });
  }

  /* ── Sidebar active state ────────────────────────────────── */
  function updateSidebarActive() {
    $$("#lesson-nav .nav-item").forEach(function(item) {
      item.classList.remove("active");
      if (parseInt(item.dataset.lesson) === currentLesson) {
        item.classList.add("active");
      }
    });

    var ovItem = $("#lesson-nav .nav-item[data-lesson='0']");
    if (ovItem) {
      ovItem.classList.toggle("active", currentLesson === 0);
    }
  }

  function updateProgress() {
    var total = COURSE.lessons.length;
    progressCount.textContent = completed.size + "/" + total;
    $$("#lesson-nav .nav-item").forEach(function(item) {
      var id = parseInt(item.dataset.lesson);
      if (id > 0 && completed.has(id)) {
        item.classList.add("completed");
      } else {
        item.classList.remove("completed");
      }
    });
  }

  /* ── Nav buttons ─────────────────────────────────────────── */
  function updateNavButtons() {
    var total = COURSE.lessons.length;
    if (currentLesson === 0) {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    } else {
      prevBtn.style.display = "block";
      nextBtn.style.display = "block";
      prevBtn.disabled = currentLesson <= 1;
      nextBtn.disabled = currentLesson >= total;
    }
  }

  prevBtn.addEventListener("click", function() {
    if (currentLesson > 1) showLesson(currentLesson - 1);
  });

  nextBtn.addEventListener("click", function() {
    var total = COURSE.lessons.length;
    if (currentLesson < total) {
      showLesson(currentLesson + 1);
    } else if (currentLesson === total) {
      showOverview();
    }
  });

  /* ── Start button ────────────────────────────────────────── */
  startBtn.addEventListener("click", function() { showLesson(1); });

  /* ── Reset ───────────────────────────────────────────────── */
  resetLink.addEventListener("click", function(e) {
    e.preventDefault();
    completed.clear();
    updateProgress();
    showOverview();
  });

  /* ── Overview nav click ─────────────────────────────────── */
  var overviewNavItem = $("#lesson-nav .nav-item[data-lesson='0']");
  if (overviewNavItem) {
    overviewNavItem.addEventListener("click", function() { showOverview(); });
  }

  /* ── Keyboard navigation ─────────────────────────────────── */
  document.addEventListener("keydown", function(e) {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (currentLesson === 0) showLesson(1);
      else if (currentLesson < COURSE.lessons.length) showLesson(currentLesson + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (currentLesson > 1) showLesson(currentLesson - 1);
      else if (currentLesson === 1) showOverview();
    }
  });

  /* ── Sidebar toggle ──────────────────────────────────────── */
  var sidebarToggleBtn = $("#sidebar-toggle-btn");
  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener("click", function() {
      var app = $("#app");
      app.classList.toggle("sidebar-hidden");
    });
  }

  /* ── Init ────────────────────────────────────────────────── */
  buildSidebar();
  buildOverviewCards();
  showOverview();
})();
