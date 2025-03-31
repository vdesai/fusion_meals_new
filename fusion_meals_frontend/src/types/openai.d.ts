declare module 'openai' {
  export default class OpenAI {
    constructor(options: { apiKey: string });

    chat: {
      completions: {
        create: (options: {
          model: string;
          messages: Array<{
            role: string;
            content: string;
          }>;
          response_format?: { type: string };
          temperature?: number;
        }) => Promise<{
          choices: Array<{
            message: {
              content: string | null;
            };
          }>;
        }>;
      };
    };
  }
} 