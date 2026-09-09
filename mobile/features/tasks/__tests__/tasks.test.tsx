import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskItem } from '../components/TaskItem';
import { Task } from '../types/task.types';

jest.mock('../../../shared/components/Icon', () => ({
  Icon: () => null,
}));

describe('TaskItem component', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    desc: 'Test Description',
    done: false,
    progress: 50,
    folder: 'Work',
  };

  it('renders task title, folder, and progress correctly', async () => {
    await render(
      <TaskItem
        task={mockTask}
        onToggleDone={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onProgressChange={jest.fn()}
      />
    );

    expect(screen.getByText('Test Task')).toBeTruthy();
    expect(screen.getByText('Test Description')).toBeTruthy();
    expect(screen.getByText('Work')).toBeTruthy();
    expect(screen.getByText('50%')).toBeTruthy();
  });

  it('triggers onProgressChange when stepper buttons are clicked', async () => {
    const onProgressChange = jest.fn();
    await render(
      <TaskItem
        task={mockTask}
        onToggleDone={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onProgressChange={onProgressChange}
      />
    );

    fireEvent.press(screen.getByText('+10%'));
    expect(onProgressChange).toHaveBeenCalledWith(mockTask, 60);

    fireEvent.press(screen.getByText('-10%'));
    expect(onProgressChange).toHaveBeenCalledWith(mockTask, 40);
  });
});
