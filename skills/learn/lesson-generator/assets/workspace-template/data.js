/* ═══════════════════════════════════════════════════════════════
   COURSE DATA — This is the ONLY file you edit for each course.
   Fill in the COURSE object with your lesson content.
   Schema: {title, description, lessons: [lesson, ...]}
   Last lesson = cumulative final review (flashcards:[]).
   ═══════════════════════════════════════════════════════════════ */

var COURSE = {
  schemaVersion: "1.1.0",
  style: "default-style",        // "default-style" | "apple-style" | "bluetech-style"
  showIcons: true,               // false 则全局关闭 emoji 图标
  showQuiz: true,                // false 则关闭普通节测验
  showFinalQuiz: true,            // false 则关闭总复习测验
  title: "COURSE_TITLE",
  badge: "BADGE_TEXT",
  description: "COURSE_DESCRIPTION",
  duration: "25",
  lessons: [
    /* Lesson schema:
       {
         id: number,           // 1-based, sequential
         title: string,
         goal: string,         // 1-sentence learning goal
         concepts: string[],   // 2-3 key concepts ([] for final review)
         objectives: string[], // 2-4 bullet objectives
         body: [               // Content blocks:
           { type: "p", text: "..." },
           { type: "ai-dialog", label: "演示", messages: [
             { role: "user", text: "..." },
             { role: "ai", text: "..." }
           ]},
           { type: "code-example", label: "示例代码", lang: "javascript", code: "..." },
           { type: "case-example", label: "案例分析", scenario: "...", analysis: "..." },
           { type: "insight", icon: "💡", title: "标题", text: "..." },
           { type: "list-block", items: [
             { icon: "🎯", title: "标题", desc: "描述" }
           ]}
         ],
         flashcards: [         // 2-3 per lesson, [] for final review
           { icon: "🎯", front: "...", back: "..." }       // icon 可选
         ],
         quiz: [               // 1-2 per lesson, 4+ for final review
           {
             question: "...",
             options: [
               { text: "...", correct: true, feedback: "..." },
               { text: "...", correct: false, feedback: "..." }
             ]
           }
         ],
         sources: [            // [] if none
           { label: "...", url: "https://..." }
         ]
       }
    */
  ]
};
