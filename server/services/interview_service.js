export async function llmGenerateQuestions({ types, company, role, seniority, count, language }) {
    return {
      questions: Array.from({ length: Number(count) || 6 }, (_, i) => ({
        id: `q_${i + 1}`,
        text: `[${language}] (${seniority}) ${role}@${company} – ${types?.[i % (types.length || 1)] || 'general'} Q${i + 1}`
      }))
    };
  }
  