import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';
import { PROJECT_STATUSES } from '../models/Project.js';
import {
  isNonEmptyString,
  requireBody,
} from '../utils/validateRequest.js';

export function assertValidObjectId(id, label = 'ID') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${label}.`, 400);
  }
}

function validateWebsiteDataShape(websiteData, errors) {
  if (websiteData === undefined || websiteData === null) {
    return;
  }

  if (typeof websiteData !== 'object' || Array.isArray(websiteData)) {
    errors.push('websiteData must be an object.');
    return;
  }

  if (
    websiteData.components !== undefined &&
    !Array.isArray(websiteData.components)
  ) {
    errors.push('websiteData.components must be an array.');
    return;
  }

  if (!Array.isArray(websiteData.components)) {
    return;
  }

  const invalidBlock = websiteData.components.find(
    (item) =>
      !item ||
      typeof item !== 'object' ||
      typeof item.type !== 'string' ||
      (item.props !== undefined &&
        (typeof item.props !== 'object' || Array.isArray(item.props))),
  );

  if (invalidBlock) {
    errors.push(
      'Each website component must have a type string and optional props object.',
    );
  }
}

export function validateCreateProject(req, res, next) {
  try {
    requireBody(req);
    const errors = [];
    const { name, description, status, websiteData, templateType, thumbnailUrl } =
      req.body;

    if (!isNonEmptyString(name) || name.trim().length < 2) {
      errors.push('Project name must be at least 2 characters.');
    } else if (name.trim().length > 100) {
      errors.push('Project name must be at most 100 characters.');
    }

    if (description !== undefined && description !== null) {
      if (typeof description !== 'string') {
        errors.push('Description must be a string.');
      } else if (description.length > 500) {
        errors.push('Description must be at most 500 characters.');
      }
    }

    if (status !== undefined && !PROJECT_STATUSES.includes(status)) {
      errors.push('Status must be draft or published.');
    }

    if (templateType !== undefined && templateType !== null) {
      if (typeof templateType !== 'string') {
        errors.push('templateType must be a string.');
      } else if (templateType.length > 80) {
        errors.push('templateType must be at most 80 characters.');
      }
    }

    if (thumbnailUrl !== undefined && thumbnailUrl !== null) {
      if (typeof thumbnailUrl !== 'string') {
        errors.push('thumbnailUrl must be a string.');
      } else if (thumbnailUrl.length > 2048) {
        errors.push('thumbnailUrl is too long.');
      }
    }

    validateWebsiteDataShape(websiteData, errors);

    if (errors.length > 0) {
      return next(new AppError(errors.join(' '), 400));
    }

    req.body.name = name.trim();
    req.body.description =
      typeof description === 'string' ? description.trim() : '';
    if (status !== undefined) {
      req.body.status = status;
    }
    if (typeof templateType === 'string') {
      req.body.templateType = templateType.trim() || 'Custom';
    }
    if (typeof thumbnailUrl === 'string') {
      req.body.thumbnailUrl = thumbnailUrl.trim();
    }
    next();
  } catch (error) {
    next(error);
  }
}

export function validateUpdateProject(req, res, next) {
  try {
    requireBody(req);
    const errors = [];
    const { name, description, status, websiteData, templateType, thumbnailUrl } =
      req.body;

    if (name !== undefined) {
      if (!isNonEmptyString(name) || name.trim().length < 2) {
        errors.push('Project name must be at least 2 characters.');
      } else if (name.trim().length > 100) {
        errors.push('Project name must be at most 100 characters.');
      }
    }

    if (description !== undefined && description !== null) {
      if (typeof description !== 'string') {
        errors.push('Description must be a string.');
      } else if (description.length > 500) {
        errors.push('Description must be at most 500 characters.');
      }
    }

    if (status !== undefined && !PROJECT_STATUSES.includes(status)) {
      errors.push('Status must be draft or published.');
    }

    if (templateType !== undefined && templateType !== null) {
      if (typeof templateType !== 'string') {
        errors.push('templateType must be a string.');
      } else if (templateType.length > 80) {
        errors.push('templateType must be at most 80 characters.');
      }
    }

    if (thumbnailUrl !== undefined && thumbnailUrl !== null) {
      if (typeof thumbnailUrl !== 'string') {
        errors.push('thumbnailUrl must be a string.');
      } else if (thumbnailUrl.length > 2048) {
        errors.push('thumbnailUrl is too long.');
      }
    }

    validateWebsiteDataShape(websiteData, errors);

    if (
      name === undefined &&
      description === undefined &&
      status === undefined &&
      websiteData === undefined &&
      templateType === undefined &&
      thumbnailUrl === undefined
    ) {
      errors.push('Provide at least one field to update.');
    }

    if (errors.length > 0) {
      return next(new AppError(errors.join(' '), 400));
    }

    if (name !== undefined) {
      req.body.name = name.trim();
    }
    if (typeof description === 'string') {
      req.body.description = description.trim();
    }
    if (typeof templateType === 'string') {
      req.body.templateType = templateType.trim() || 'Custom';
    }
    if (typeof thumbnailUrl === 'string') {
      req.body.thumbnailUrl = thumbnailUrl.trim();
    }
    next();
  } catch (error) {
    next(error);
  }
}
