import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ProjectBasicInfo } from './ProjectBasicInfo';
import { ProjectTeamMembers } from './ProjectTeamMembers';
import { ProjectTemplate } from './ProjectTemplate';
import { ProjectAttachments } from './ProjectAttachments';
import { useCreateProjectMutation, useUpdateProjectMutation } from '../../store/api/projectApi';
import type { ProjectInfo } from '../../store/api/projectApi';

interface ProjectFormProps {
  mode: 'create' | 'edit';
  project?: ProjectInfo;
  onSuccess: (projectId: number) => void;
  onCancel: () => void;
}

const projectSchema = yup.object({
  name: yup.string().required('Project name is required'),
  description: yup.string().required('Project description is required'),
  status: yup.string().required('Status is required'),
  startDate: yup.string().required('Start date is required'),
  dueDate: yup.string().required('Due date is required'),
  budget: yup.object({
    allocated: yup.number().required('Budget is required').min(0, 'Budget must be positive'),
    currency: yup.string().required('Currency is required'),
  }),
  teamMembers: yup.array().of(yup.object({
    userId: yup.number().required(),
    role: yup.string().required('Role is required'),
  })),
  template: yup.string().optional(),
  attachments: yup.array().of(yup.object({
    name: yup.string().required(),
    size: yup.number().required(),
    type: yup.string().required(),
  })),
});

interface ProjectFormData {
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  startDate: string;
  dueDate: string;
  budget: {
    allocated: number;
    currency: string;
  };
  teamMembers: Array<{
    userId: number;
    role: string;
  }>;
  template?: string;
  attachments: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

const steps = [
  'Basic Information',
  'Team Members',
  'Project Template',
  'Attachments',
];

export const ProjectForm: React.FC<ProjectFormProps> = ({
  mode,
  project,
  onSuccess,
  onCancel,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const isLoading = isCreating || isUpdating;

  const methods = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema),
    defaultValues: project ? {
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate.split('T')[0],
      dueDate: project.dueDate.split('T')[0],
      budget: {
        allocated: project.budget.allocated,
        currency: project.budget.currency,
      },
      teamMembers: [],
      template: '',
      attachments: [],
    } : {
      name: '',
      description: '',
      status: 'active',
      startDate: '',
      dueDate: '',
      budget: {
        allocated: 0,
        currency: 'USD',
      },
      teamMembers: [],
      template: '',
      attachments: [],
    },
  });

  const { handleSubmit, trigger, formState: { errors } } = methods;

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (mode === 'create') {
        const result = await createProject({
          ...data,
          startDate: new Date(data.startDate).toISOString(),
          dueDate: new Date(data.dueDate).toISOString(),
        }).unwrap();
        onSuccess(result.id);
      } else if (project) {
        await updateProject({
          id: project.id,
          data: {
            ...data,
            startDate: new Date(data.startDate).toISOString(),
            dueDate: new Date(data.dueDate).toISOString(),
          },
        }).unwrap();
        onSuccess(project.id);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ProjectBasicInfo />;
      case 1:
        return <ProjectTeamMembers />;
      case 2:
        return <ProjectTemplate />;
      case 3:
        return <ProjectAttachments />;
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Form */}
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {renderStepContent(activeStep)}

          {/* Error Display */}
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Please fix the errors in the form before proceeding.
            </Alert>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ textTransform: 'none' }}
            >
              Back
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={isLoading}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{ textTransform: 'none' }}
                >
                  {isLoading ? 'Saving...' : mode === 'create' ? 'Create Project' : 'Update Project'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={isLoading}
                  sx={{ textTransform: 'none' }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default ProjectForm; 