import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { UserSkill, AddUserSkillRequest } from '../../types/api/user';

interface SkillsManagerProps {
  skills: UserSkill[];
  onAddSkill?: (skill: AddUserSkillRequest) => Promise<void>;
  onUpdateSkill?: (skillId: string, skill: AddUserSkillRequest) => Promise<void>;
  onDeleteSkill?: (skillId: string) => Promise<void>;
  isLoading?: boolean;
}

const PROFICIENCY_LEVELS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' },
];

export const SkillsManager: React.FC<SkillsManagerProps> = ({
  skills,
  onAddSkill,
  onUpdateSkill,
  onDeleteSkill,
  isLoading = false,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<UserSkill | null>(null);
  const [skillName, setSkillName] = useState('');
  const [proficiencyLevel, setProficiencyLevel] = useState<UserSkill['proficiency_level']>('Beginner');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = () => {
    setEditingSkill(null);
    setSkillName('');
    setProficiencyLevel('Beginner');
    setIsDialogOpen(true);
  };



  const handleDeleteSkill = async (skill: UserSkill) => {
    if (onDeleteSkill && 'id' in skill) {
      try {
        await onDeleteSkill((skill as UserSkill & { id: string }).id);
      } catch (error) {
        console.error('Error deleting skill:', error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!skillName.trim()) return;

    setIsSubmitting(true);
    try {
      const skillData: AddUserSkillRequest = {
        skill_name: skillName.trim(),
        proficiency_level: proficiencyLevel,
      };

      if (editingSkill && onUpdateSkill && 'id' in editingSkill) {
        await onUpdateSkill((editingSkill as UserSkill & { id: string }).id, skillData);
      } else if (onAddSkill) {
        await onAddSkill(skillData);
      }

      setIsDialogOpen(false);
      setSkillName('');
      setProficiencyLevel('Beginner');
      setEditingSkill(null);
    } catch (error) {
      console.error('Error saving skill:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSkillName('');
    setProficiencyLevel('Beginner');
    setEditingSkill(null);
  };

  const getProficiencyColor = (level: UserSkill['proficiency_level']) => {
    switch (level) {
      case 'Beginner':
        return 'default';
      case 'Intermediate':
        return 'primary';
      case 'Advanced':
        return 'secondary';
      case 'Expert':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Skills</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddSkill}
          disabled={isLoading}
        >
          Add Skill
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : skills.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No skills added yet. Add your first skill to get started!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {skills.map((skill, index) => (
            <Chip
              key={index}
              label={`${skill.skill_name} (${skill.proficiency_level})`}
              color={getProficiencyColor(skill.proficiency_level)}
              variant="outlined"
              onDelete={
                onDeleteSkill && 'id' in skill
                  ? () => handleDeleteSkill(skill)
                  : undefined
              }
              deleteIcon={
                onDeleteSkill && 'id' in skill ? <DeleteIcon /> : undefined
              }
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      )}

      {/* Add/Edit Skill Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSkill ? 'Edit Skill' : 'Add New Skill'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Skill Name"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
                              placeholder="e.g., React, Python, Projexiq"
            />
            <FormControl fullWidth>
              <InputLabel>Proficiency Level</InputLabel>
              <Select
                value={proficiencyLevel}
                label="Proficiency Level"
                onChange={(e) => setProficiencyLevel(e.target.value as UserSkill['proficiency_level'])}
              >
                {PROFICIENCY_LEVELS.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!skillName.trim() || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
          >
            {isSubmitting ? 'Saving...' : editingSkill ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}; 