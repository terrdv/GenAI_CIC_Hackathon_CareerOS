import {
    newSession,
    getSession,
    getSessionQuestions,
    setSessionQuestions,
    getSessionAnswers,
    setSessionAnswers
  } from '../stores/session_store.js';
  import { llmGenerateQuestions } from '../services/interview_service.js';
  
  export async function startInterview(req, res) {
    try {
      const { types = [], company = '', role = '', seniority = 'intern', count = 6, language = 'en' } = req.body || {};
      const session = newSession({ types, company, role, seniority, count, language });
  
      const gen = await llmGenerateQuestions(session.config);
      if (!gen.questions?.length) return res.status(500).json({ error: 'no_questions_generated' });
  
      setSessionQuestions(session.sessionId, gen.questions);
  
      res.json({
        sessionId: session.sessionId,
        currentIndex: 0,
        total: gen.questions.length,
        question: { id: gen.questions[0].id, text: gen.questions[0].text }
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
  
      const qs = getSessionQuestions(sessionId);
      const idx = Number(req.body.questionIndex);
  
      if (Number.isNaN(idx) || idx !== s.currentIndex) {
        return res.status(409).json({ error: 'index_mismatch', expected: s.currentIndex, got: req.body.questionIndex });
      }
      if (idx < 0 || idx >= qs.length) {
        return res.status(400).json({ error: 'index_out_of_range' });
      }
  
      const q = qs[idx];
      if (!q) return res.status(410).json({ error: 'no_more_questions' });
  
      const transcript = (req.body.textAnswer || '').trim();
      if (!transcript) return res.status(400).json({ error: 'no_answer_provided' });
  
      const answers = getSessionAnswers(sessionId);
      answers.push({ questionId: q.id, index: idx, transcript });
      setSessionAnswers(sessionId, answers);
  
      s.currentIndex += 1;
      const finished = s.currentIndex >= qs.length;
      if (finished) s.status = 'done';
  
      const resp = { saved: true };
      if (!finished) {
        const next = qs[s.currentIndex];
        resp.next = {
          currentIndex: s.currentIndex,
          total: qs.length,
          question: { id: next.id, text: next.text }
        };
      } else {
        resp.finished = true;
      }
  
      res.json(resp);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'failed_to_save_answer' });
    }
  }
  
  export function getReport(req, res) {
    const sessionId = req.params.sessionId;
    const s = getSession(sessionId);
    if (!s) return res.status(404).json({ error: 'session_not_found' });
  
    const qs = getSessionQuestions(sessionId);
    const ans = getSessionAnswers(sessionId);
  
    const perQuestion = ans.map((a) => {
      const qObj = qs[a.index];
      return {
        q: qObj?.text ?? '(question not found)',
        answer: a.transcript
      };
    });
  
    res.json({ sessionId, perQuestion });
  }
  