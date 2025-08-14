import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { invokeModel } from "../lib/bedrock.js";

const router = Router();


// POST /analyzeResume: expects { session_token } in body
router.post('/analyzeResume', async (req, res) => {
    try {
        const { session_token } = req.body;
        if (!session_token) return res.status(400).json({ error: 'Missing session_token' });

        const { data: userData, error: userError } = await supabase.auth.getUser(session_token);
        if (userError || !userData?.user) {
            return res.status(401).json({ error: 'Invalid session token' });
        }
        const userId = userData.user.id;
        // const { userId } = req.body;

        console.log(userId);

        // Download resume file from Supabase storage
        const { data: pdfBlob, error: urlError } = await supabase
            .storage
            .from('resume')
            .download(userId + '/resume.pdf');
        
        if (urlError) {
            return res.status(404).json({ error: 'Resume file not found in storage' });
        }

        const arrayBuffer = Buffer.from(await pdfBlob.arrayBuffer());

        // Get AI feedback from invokeModel
        const feedback = await invokeModel('Provide feedback for my resume. Be specific and reference examples from the resume file. Format the response as HTML.', arrayBuffer);

        const skillsJson = await invokeModel('Extract the skills mentioned in the resume. Format it as a stringified JSON array that is immediately parseable, don\'t add extra text.', arrayBuffer);
        const jobsJson = await invokeModel('Extract the jobs that I am most competitive for based on the resume. Format it as a stringified JSON array that is immediately parseable, don\'t add extra text.', arrayBuffer);

        let skills, jobs;
        try {
            skills = JSON.parse(skillsJson.replaceAll('\'', '\"'));
        } catch (e) {
            skills = null;
        }
        try {
            jobs = JSON.parse(jobsJson.replaceAll('\'', '\"'));
        } catch (e) {
            jobs = null;
        }

        console.log(skillsJson, jobsJson);

        // Update jobs and skills columns in public.profiles
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ jobs, skills })
            .eq('id', userId);
        if (updateError) {
            return res.status(500).json({ error: updateError.message });
        }

        res.json({ feedback, jobs, skills });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/ask', async (req, res) => {
    try {
        // const { session_token } = req.body;
        // if (!session_token) return res.status(400).json({ error: 'Missing session_token' });

        // const { data: userData, error: userError } = await supabase.auth.getUser(session_token);
        // if (userError || !userData?.user) {
        //     return res.status(401).json({ error: 'Invalid session token' });
        // }
        // const userId = userData.user.id;
        const { text } = req.body;

        // Get AI feedback from invokeModel
        const feedback = await invokeModel(text);
        res.json({ feedback });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/users", async (req, res) => {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Route to query Claude Sonnet via Bedrock
router.get("/fruit", async (req, res) => {

    try {
        const response = await invokeModel("Who are you?", null);
        // Parse and return the response
        res.json({ result: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
