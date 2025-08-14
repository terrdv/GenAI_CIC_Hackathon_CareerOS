import { Router } from 'express';
import {
    startInterview,
    currentQuestion,
    submitAnswer,
    getReport,
    testing,
    fullSessionHandler
} from '../controllers/interview_controller.js';

const router = Router();

router.post('/start', startInterview); // start the interview
// req.body {
//   "types": ["technical", "behavioral"],
//   "company": "OpenAI",
//   "role": "Developer",
//   "level": "senior",
//   "questionCount": 5
// }

// res {
//     "sessionId": "1",
//     "currentIndex": 0,
//     "total": 5,
//     "question": {
//         "id": "q_1",
//         "text": "Can you walk me through a complex technical problem you faced recently and how you approached solving it?"
//     }
// }

router.post('/answer', submitAnswer); // user submitting answer
// req.body {
//     "sessionId": "1",
//     "textAnswer": "your mom"
// }

// res {
//     "saved": true,
//     "cur": {
//         "currentIndex": 1,
//         "total": 5,
//         "question": "How do you handle disagreements or conflicting opinions within a team?",
//         "answer": "your mom"
//     },
//     "next": {
//         "newIndex": 2,
//         "question": {
//             "id": "q_3",
//             "text": "What are your thoughts on the trade-offs between performance and maintainability in code design?"
//         }
//     }
// }

router.get('/report/:sessionId', getReport); // after all questions are done
// sessionId in the URL
// {
//     "sessionId": "1",
//     "perQuestion": [
//         {
//             "q": "Can you walk me through a complex technical problem you faced recently and how you approached solving it?",
//             "answer": "your mom"
//         },
//         {
//             "q": "How do you handle disagreements or conflicting opinions within a team?",
//             "answer": "your mom"
//         }
//     ]
// }


router.get('/fullsession/:sessionId', fullSessionHandler);
router.get('/current', currentQuestion);
export default router;