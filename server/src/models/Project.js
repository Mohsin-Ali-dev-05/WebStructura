import mongoose from 'mongoose';

const PROJECT_STATUSES = ['draft', 'published'];

const defaultWebsiteData = () => ({
  title: 'My Website',
  theme: {
    primaryColor: '#1d4ed8',
    backgroundColor: '#ffffff',
    textColor: '#14213d',
    font: 'Georgia, "Times New Roman", serif',
  },
  components: [],
});

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project owner (userId) is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Project name must be at least 2 characters'],
      maxlength: [100, 'Project name must be at most 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be at most 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: PROJECT_STATUSES,
        message: 'Status must be draft or published',
      },
      default: 'draft',
    },
    websiteData: {
      type: mongoose.Schema.Types.Mixed,
      default: defaultWebsiteData,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

projectSchema.index({ userId: 1, createdAt: -1 });

export { PROJECT_STATUSES, defaultWebsiteData };
export default mongoose.model('Project', projectSchema);
