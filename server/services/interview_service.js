export async function llmGenerateQuestions({ types, company, role, level, questionCount }) {
    const count = Number(questionCount) || 3; // default to 3 if not provided
  
    return {
      questions: Array.from({ length: count }, (_, i) => ({
        id: `q_${i + 1}`,
        text: `(${level}) ${role}@${company} – ${types?.[i % (types.length || 1)] || 'general'} Q${i + 1}`
      }))
    };
}