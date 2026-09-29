import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProject,
  getPublicProject,
  listProjects,
  updateProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateCreateProject,
  validateUpdateProject,
} from '../middleware/validateProject.js';

const router = Router();

// Public share URL — registered before protect so JWT is not required
router.get('/public/:id', getPublicProject);

router.use(protect);

router.post('/', validateCreateProject, createProject);
router.get('/', listProjects);
router.get('/:id', getProject);
router.put('/:id', validateUpdateProject, updateProject);
router.delete('/:id', deleteProject);

export default router;
