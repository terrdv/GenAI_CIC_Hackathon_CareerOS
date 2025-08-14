import {
    newSession,
    getSession,
    getSessionQuestions,
    setSessionQuestions,
    getSessionAnswers,
    setSessionAnswers,
    getFullSession
} from '../stores/session_store.js';
import { llmGenerateQuestions } from '../services/interview_service.js';
import { generateFeedbackWithAI } from '../lib/FeedbackAI.js';

export async function testing(req, res) {
    res.json({ message: "charle is the goat" });
  }

export async function startInterview(req, res) {
    try {
        const {
            types = [],
            company = '',
            role = '',
            level = 'intern',
            questionCount = 3
          } = req.body || {};

        const session = newSession({ types, company, role, level, questionCount });
        
        const genRaw = await llmGenerateQuestions(session.config);
        const gen = JSON.parse(genRaw);
        if (!gen.questions?.length) return res.status(500).json({ error: 'no_questions_generated' });

        setSessionQuestions(session.sessionId, gen.questions);

        res.json({
            sessionId: session.sessionId,
            currentIndex: 0,
            total: gen.questions.length,
            question: gen.questions[0]
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'failed_to_start' });
    }
}

export function currentQuestion(req, res) {
    const sessionId = String(req.query.sessionId || '');
    const s = getSession(sessionId);
    if (!s) return res.status(404).json({ error: 'session_not_found' });

    if (s.status === 'done') {
        return res.json({ sessionId: s.sessionId, finished: true });
    }

    const qs = getSessionQuestions(sessionId);
    const q = qs[s.currentIndex];
    if (!q) return res.status(410).json({ error: 'no_more_questions' });

    res.json({
        sessionId: s.sessionId,
        currentIndex: s.currentIndex,
        total: qs.length,
        question: { id: q.id, text: q.text }
    });
}

export function submitAnswer(req, res) {
    try {
        const sessionId = req.body.sessionId;
        const s = getSession(sessionId);
        if (!s) return res.status(404).json({ error: 'session_not_found' });
        if (s.status === 'done') return res.status(409).json({ error: 'session_finished' });
        const curIndex = s.currentIndex

        const qs = getSessionQuestions(sessionId);
        // const idx = Number(req.body.questionIndex);

        // if (Number.isNaN(idx) || idx !== s.currentIndex) {
        //     return res.status(409).json({ error: 'index_mismatch', expected: s.currentIndex, got: req.body.questionIndex });
        // }
        if (curIndex < 0 || curIndex >= qs.length) {
            return res.status(400).json({ error: 'index_out_of_range' });
        }

        const q = qs[curIndex];
        if (!q) return res.status(410).json({ error: 'no_more_questions' });

        const transcript = (req.body.textAnswer || '').trim();
        if (!transcript) return res.status(400).json({ error: 'no_answer_provided' });

        const answers = getSessionAnswers(sessionId);
        answers.push({ questionId: q.id, index: curIndex, transcript });
        setSessionAnswers(sessionId, answers);

 
        const finished = curIndex >= qs.length;
        s.currentIndex += 1;
        if (finished) s.status = 'done';

        const resp = { saved: true };
        if (!finished) {
            const next = qs[s.currentIndex];
            resp.cur = {
                currentIndex: curIndex,
                total: qs.length,
                question: q.text,
                answer: transcript,
            }
            if (next) {
                resp.next = {  
                    newIndex: s.currentIndex,
                    question: { id: next.id, text: next.text }
                };
            }
            
        } else {
            resp.finished = true;
        }

        res.json(resp);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'failed_to_save_answer' });
    }
}

export function fullSessionHandler(req, res) {
    const { sessionId } = req.params;
    const fullSession = getFullSession(sessionId);
  
    if (!fullSession) {
      return res.status(404).json({ error: 'Session not found' });
    }
  
    res.json(fullSession);
}

export async function getReport(req, res) {
    const { sessionId } = req.params;
    const s = getSession(sessionId);
    if (!s) return res.status(404).json({ error: 'session_not_found' });

    const qs = getSessionQuestions(sessionId);
    const ans = getSessionAnswers(sessionId);

    const perQuestion = await Promise.all(
        ans.map(async (a) => {
            const qObj = qs[a.index];
            const result = await generateFeedbackWithAI({
                question: qObj?.text ?? '(question not found)',
                answer: a.transcript
            });
            return {
                q: qObj?.text ?? '(question not found)',
                answer: a.transcript,
                feedback: result
            };
        })
    );

    res.json({ sessionId, perQuestion });
}