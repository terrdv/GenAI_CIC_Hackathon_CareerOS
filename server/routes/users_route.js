import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { invokeModel } from "../lib/bedrock.js";

const router = Router();


// POST /analyzeResume: expects { session_token } in body
router.get('/analyzeResume', async (req, res) => {
    try {
        // const { session_token } = req.body;
        // if (!session_token) return res.status(400).json({ error: 'Missing session_token' });

        // const { data: userData, error: userError } = await supabase.auth.getUser(session_token);
        // if (userError || !userData?.user) {
        //     return res.status(401).json({ error: 'Invalid session token' });
        // }
        // const userId = userData.user.id;
        const { userId } = req.body;

        console.log(userId);

        // Download resume file from Supabase storage
        const { data: pdfBlob, error: urlError } = await supabase
            .storage
            .from('resume')
            .download(userId + '.pdf');
        
        if (urlError) {
            return res.status(404).json({ error: 'Resume file not found in storage' });
        }

        const arrayBuffer = Buffer.from(await pdfBlob.arrayBuffer());

        // Get AI feedback from invokeModel
        const feedback = await invokeModel('Provide feedback for my resume', arrayBuffer);
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
