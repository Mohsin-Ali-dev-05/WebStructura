import Project, { defaultWebsiteData } from '../models/Project.js';
import { assertValidObjectId } from '../middleware/validateProject.js';
import { generateInitialWebsiteComponents } from '../services/aiService.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireBody } from '../utils/validateRequest.js';

function formatProject(project) {
  return {
    id: project._id,
    userId: project.userId,
    name: project.name,
    description: project.description,
    status: project.status,
    websiteData: project.websiteData,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

/**
 * Load a project by id, then enforce ownership.
 * Missing → 404; wrong owner → 403.
 */
async function findOwnedProject(projectId, userId) {
  assertValidObjectId(projectId, 'project ID');

  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  if (String(project.userId) !== String(userId)) {
    throw new AppError(
      'You do not have permission to modify this project.',
      403,
    );
  }

  return project;
}

function hasClientComponents(websiteData) {
  return (
    websiteData &&
    typeof websiteData === 'object' &&
    !Array.isArray(websiteData) &&
    Array.isArray(websiteData.components) &&
    websiteData.components.length > 0
  );
}

/**
 * POST /api/projects — create project.
 * When no template websiteData is provided, generates initial components via local Ollama.
 */
export const createProject = asyncHandler(async (req, res) => {
  requireBody(req);
  const { name, description, status, websiteData } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw new AppError('Project name must be at least 2 characters.', 400);
  }

  let resolvedWebsiteData;

  if (hasClientComponents(websiteData)) {
    resolvedWebsiteData = {
      ...defaultWebsiteData(),
      ...websiteData,
      title:
        (typeof websiteData.title === 'string' && websiteData.title.trim()) ||
        name,
      components: websiteData.components,
    };
  } else {
    const components = await generateInitialWebsiteComponents(
      name,
      description || '',
    );

    resolvedWebsiteData = {
      ...defaultWebsiteData(),
      title: name,
      components,
    };
  }

  const project = await Project.create({
    userId: req.user._id,
    name,
    description: description || '',
    status: status || 'draft',
    websiteData: resolvedWebsiteData,
  });

  res.status(201).json({
    success: true,
    message: 'Project created',
    data: { project: formatProject(project) },
  });
});

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ userId: req.user._id }).sort({
    updatedAt: -1,
  });

  res.status(200).json({
    success: true,
    data: {
      projects: projects.map(formatProject),
      count: projects.length,
    },
  });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await findOwnedProject(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    data: { project: formatProject(project) },
  });
});

/**
 * Public share endpoint — no JWT.
 * Returns only name + websiteData (never userId or other owner fields).
 */
export const getPublicProject = asyncHandler(async (req, res) => {
  assertValidObjectId(req.params.id, 'project ID');

  const project = await Project.findById(req.params.id)
    .select('name websiteData')
    .lean();

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      project: {
        name: project.name,
        websiteData: project.websiteData,
      },
    },
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  requireBody(req);
  const project = await findOwnedProject(req.params.id, req.user._id);

  const { name, description, status, websiteData } = req.body;

  if (name !== undefined) {
    project.name = name;
  }
  if (description !== undefined) {
    project.description = description;
  }
  if (status !== undefined) {
    project.status = status;
  }
  if (websiteData !== undefined) {
    project.websiteData = websiteData;
  }

  await project.save();

  res.status(200).json({
    success: true,
    message: 'Project updated',
    data: { project: formatProject(project) },
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await findOwnedProject(req.params.id, req.user._id);

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project deleted',
    data: { id: project._id },
  });
});
