import {
    BedrockRuntimeClient,
    ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

import dotenv from 'dotenv';
dotenv.config();

/**
 * Invokes Anthropic Claude 3 using the Messages API.
 *
 * To learn more about the Anthropic Messages API, go to:
 * https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages.html
 *
 * @param {string} prompt - The input text prompt for the model to complete.
 * @param {string} [modelId] - The ID of the model to use. Defaults to "anthropic.claude-3-haiku-20240307-v1:0".
 */
export const invokeModel = async (
    prompt,
    pdfData,
    modelId = "anthropic.claude-3-sonnet-20240229-v1:0"
) => {
    // Create a new Bedrock Runtime client instance.
    const client = new BedrockRuntimeClient({ region: process.env.AWS_DEFAULT_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            sessionToken: process.env.AWS_SESSION_TOKEN, // Optional, if using temporary credentials
        }
     });

    // Prepare the payload for the model.
    const payload = {
        modelId,
        system: [
            {
                text: "You are CareerOS, a career assistant that helps users analyze resumes and provide feedback on interviews. Be professional and friendly."
            }
        ],
        messages: [
            {
                role: "user",
                content: [{ 
                    text: prompt,
                },
                {
                    document: {
                        format: 'pdf',
                        name: 'resume',
                        source: {
                            bytes: pdfData
                        }
                    }
                }],
            },
        ]
    };

    // Invoke Claude with the payload and wait for the response using ConverseModelCommand.
    const command = new ConverseCommand(payload);
    const apiResponse = await client.send(command);

    return apiResponse.output.message.content[0].text;
};