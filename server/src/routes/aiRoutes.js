import { Router } from 'express';
import { generateAi, testAi } from '../controllers/aiController.js';
import {
  validateAiGenerate,
  validateAiTest,
} from '../middleware/validateAi.js';

const router = Router();

router.post('/test', validateAiTest, testAi);
router.post('/generate', validateAiGenerate, generateAi);

export default router;
