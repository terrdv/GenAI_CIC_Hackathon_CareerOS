import { randomUUID } from 'node:crypto';

const sessions = new Map();           // sessionId -> session object
const sessionQuestions = new Map();   // sessionId -> [questions]
const sessionAnswers = new Map();     // sessionId -> [answers]

export function newSession(config) {
  const sessionId = randomUUID();
  const session = {
    sessionId,
    userId: 'anon',
    status: 'active',
    createdAt: new Date().toISOString(),
    config: {
      types: config.types || [],
      company: config.company || '',
      role: config.role || '',
      seniority: config.seniority || 'intern',
      count: Number(config.count) || 6,
      language: config.language || 'en'
    },
    currentIndex: 0
  };
  sessions.set(sessionId, session);
  sessionAnswers.set(sessionId, []);
  return session;
}

export const getSession = (id) => sessions.get(id) || null;

export const getSessionQuestions = (id) => sessionQuestions.get(id) || [];
export const setSessionQuestions = (id, qs) => sessionQuestions.set(id, qs);

export const getSessionAnswers = (id) => sessionAnswers.get(id) || [];
export const setSessionAnswers = (id, answers) => sessionAnswers.set(id, answers);
