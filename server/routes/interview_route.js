import { Router } from 'express';
import {
  startInterview,
  currentQuestion,
  submitAnswer,
  getReport
} from '../controllers/interview_controller.js';

const router = Router();

router.post('/start', startInterview);
router.get('/current', currentQuestion);
router.post('/answer', submitAnswer);
router.get('/report/:sessionId', getReport);

export default router;