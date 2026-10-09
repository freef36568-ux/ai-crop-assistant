import { aiService } from '../services/aiService.js';

export const chatController = {
  // POST /api/chat
  async handleChat(req, res, next) {
    try {
      const { messages = [], cropContext = '', language = 'en' } = req.body;

      if (!Array.isArray(messages) && !req.body.message) {
        return res.status(400).json({
          status: 'error',
          error: 'Please provide chat messages array or a message string.',
        });
      }

      const formattedMessages = Array.isArray(messages)
        ? messages
        : [{ sender: 'user', text: req.body.message }];

      const reply = await aiService.chatWithAssistant(formattedMessages, cropContext, language);

      return res.status(200).json({
        reply,
        status: 'ok',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  },
};
