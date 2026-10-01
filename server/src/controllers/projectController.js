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
    templateType: project.templateType || 'Custom',
    status: project.status,
    websiteData: project.websiteData,
    thumbnailUrl: project.thumbnailUrl || '',
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
  const { name, description, status, websiteData, templateType, thumbnailUrl } =
    req.body;

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
    templateType:
      typeof templateType === 'string' && templateType.trim()
        ? templateType.trim()
        : hasClientComponents(websiteData)
          ? 'Template'
          : 'Custom',
    status: status || 'draft',
    websiteData: resolvedWebsiteData,
    thumbnailUrl:
      typeof thumbnailUrl === 'string' ? thumbnailUrl.trim() : '',
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

  const { name, description, status, websiteData, templateType, thumbnailUrl } =
    req.body;

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
  if (templateType !== undefined) {
    project.templateType =
      typeof templateType === 'string' && templateType.trim()
        ? templateType.trim()
        : 'Custom';
  }
  if (thumbnailUrl !== undefined) {
    project.thumbnailUrl =
      typeof thumbnailUrl === 'string' ? thumbnailUrl.trim() : '';
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

/**
 * GET /api/projects/:id/export — download a Vite + React + Tailwind ZIP.
 */
export const exportProject = asyncHandler(async (req, res) => {
  const project = await findOwnedProject(req.params.id, req.user._id);
  const { generateExportZipBuffer } = await import(
    '../utils/exportGenerator.js'
  );

  const buffer = await generateExportZipBuffer(project.websiteData, {
    projectName: project.name,
  });

  const safeName =
    String(project.name || 'webstructura-export')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'webstructura-export';

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${safeName}-export.zip"`,
  );
  res.setHeader('Content-Length', buffer.length);
  res.status(200).send(buffer);
});
