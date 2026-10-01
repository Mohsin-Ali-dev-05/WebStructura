import { Router } from 'express';
import {
  generateAi,
  generateWebsiteStream,
  testAi,
} from '../controllers/aiController.js';
import {
  validateAiGenerate,
  validateAiGenerateStream,
  validateAiTest,
} from '../middleware/validateAi.js';

const router = Router();

router.post('/test', validateAiTest, testAi);
router.post('/generate', validateAiGenerate, generateAi);
router.post('/generate-stream', validateAiGenerateStream, generateWebsiteStream);

export default router;
