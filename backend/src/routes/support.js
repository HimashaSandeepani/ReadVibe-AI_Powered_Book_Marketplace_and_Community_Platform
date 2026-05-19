// Support message and live chat API endpoints.
import express from 'express';
import {
  addSupportReplyHandler,
  createSupportMessageHandler,
  getLiveChatThreadHandler,
  listLiveChatThreadsHandler,
  listSupportMessagesHandler,
  resolveLiveChatThreadHandler,
  sendLiveChatMessageHandler,
} from '../controllers/supportController.js';

const router = express.Router();

router.get('/messages', listSupportMessagesHandler);
router.post('/messages', createSupportMessageHandler);
router.post('/messages/:id/replies', addSupportReplyHandler);

router.get('/live-chat/threads', listLiveChatThreadsHandler);
router.post('/live-chat/threads/resolve', resolveLiveChatThreadHandler);
router.get('/live-chat/threads/:orderId/:userId', getLiveChatThreadHandler);
router.post('/live-chat/messages', sendLiveChatMessageHandler);

export default router;
