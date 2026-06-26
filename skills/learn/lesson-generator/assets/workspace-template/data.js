/* ═══════════════════════════════════════════════════════════════
   COURSE DATA — This is the ONLY file you edit for each course.
   Fill in the COURSE object with your lesson content.
   Schema: {title, description, lessons: [lesson, ...]}
   Last lesson = cumulative final review (flashcards:[]).
   ═══════════════════════════════════════════════════════════════ */

var COURSE = {
  schemaVersion: "1.0.0",
  style: "claude-style",        // "claude-style" | "apple-style" | "bluetech-style"
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
           { type: "insight", text: "..." }
         ],
         flashcards: [         // 2-3 per lesson, [] for final review
           { front: "...", back: "..." }
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
