import React, { useState } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { TaskColumn } from './TaskColumn';
import type { BackendTask } from '../../store/api/taskApi';

interface KanbanBoardProps {
  tasks: BackendTask[];
  projectId: number;
}

const columns = [
  { id: 'Todo', title: 'To Do', color: 'grey' },
  { id: 'InProgress', title: 'In Progress', color: 'blue' },
  { id: 'Review', title: 'Review', color: 'orange' },
  { id: 'Done', title: 'Done', color: 'green' },
] as const;

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
  const [draggedTask, setDraggedTask] = useState<BackendTask | null>(null);

  const getTasksForColumn = (status: BackendTask['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (task: BackendTask) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = (targetStatus: BackendTask['status']) => {
    if (draggedTask && draggedTask.status !== targetStatus) {
      // Here you would typically call an API to update the task status
      console.log(`Moving task ${draggedTask.id} from ${draggedTask.status} to ${targetStatus}`);
    }
    setDraggedTask(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Kanban Board
      </Typography>
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mt: 2,
        }}
      >
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            title={column.title}
            tasks={getTasksForColumn(column.id)}
            status={column.id}
            color={column.color}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            draggedTask={draggedTask}
          />
        ))}
      </Box>
    </Box>
  );
};

export default KanbanBoard; 