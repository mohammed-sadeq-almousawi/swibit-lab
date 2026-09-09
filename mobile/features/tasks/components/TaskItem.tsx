import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { GlassCard } from '../../../shared/components/GlassCard';
import { Icon } from '../../../shared/components/Icon';
import { Task } from '../types/task.types';

interface TaskItemProps {
  task: Task;
  onToggleDone: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onProgressChange?: (task: Task, newProgress: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  showReorder?: boolean;
}

export const TaskItem = ({
  task,
  onToggleDone,
  onEdit,
  onDelete,
  onProgressChange,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  showReorder = true,
}: TaskItemProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const currentProgress = task.progress !== undefined ? task.progress : task.done ? 100 : 0;

  const handleStepProgress = (delta: number) => {
    onProgressChange?.(task, Math.min(100, Math.max(0, currentProgress + delta)));
  };

  return (
    <>
      <GlassCard className="mb-3 p-4 border-l-4 border-blue-500">
        <View className="flex-row items-center">
          {showReorder && (
            <View className="items-center mr-2">
              <TouchableOpacity className="p-1" onPress={onMoveUp} disabled={isFirst} style={{ opacity: isFirst ? 0.25 : 1 }}>
                <Icon name="chevron-up" size={16} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity className="p-1" onPress={onMoveDown} disabled={isLast} style={{ opacity: isLast ? 0.25 : 1 }}>
                <Icon name="chevron-down" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-1">
            {task.folder && task.folder !== 'All' ? (
              <View className="flex-row items-center mb-1">
                <View className="flex-row items-center bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  <Icon name="folder" size={11} color="#3B82F6" />
                  <Text className="text-xs font-semibold text-blue-600 ml-1">{task.folder}</Text>
                </View>
              </View>
            ) : null}
            <Text className={`text-base font-bold ${task.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</Text>
            {task.desc ? <Text className="text-xs text-gray-500 mt-0.5">{task.desc}</Text> : null}
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity className="p-2 ml-1" onPress={() => onToggleDone(task)}>
              <Icon name={task.done ? 'check-circle' : 'square'} size={22} color={task.done ? '#22C55E' : '#9CA3AF'} />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 ml-1" onPress={() => onEdit(task)}>
              <Icon name="edit-3" size={19} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 ml-1" onPress={() => setShowDeleteModal(true)}>
              <Icon name="trash-2" size={19} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-3 pt-2.5 border-t border-slate-100 flex-row items-center gap-2">
          <TouchableOpacity className="px-2 py-1 rounded bg-slate-100" onPress={() => handleStepProgress(-10)} disabled={currentProgress <= 0} style={{ opacity: currentProgress <= 0 ? 0.4 : 1 }}>
            <Text className="text-xs font-bold text-slate-600">-10%</Text>
          </TouchableOpacity>
          <View className="flex-1 h-2 bg-slate-200/80 rounded-full overflow-hidden">
            <View className={`h-full rounded-full ${currentProgress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${currentProgress}%` }} />
          </View>
          <Text className="text-xs font-bold text-slate-700 w-9 text-right">{currentProgress}%</Text>
          <TouchableOpacity className="px-2 py-1 rounded bg-slate-100" onPress={() => handleStepProgress(10)} disabled={currentProgress >= 100} style={{ opacity: currentProgress >= 100 ? 0.4 : 1 }}>
            <Text className="text-xs font-bold text-slate-600">+10%</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>

      <Modal visible={showDeleteModal} transparent animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
        <View className="flex-1 justify-center items-center bg-slate-900/60 px-6">
          <View className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl items-center border border-slate-100">
            <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center mb-2">
              <Icon name="trash-2" size={22} color="#EF4444" />
            </View>
            <Text className="text-lg font-bold text-gray-900 mb-1">Delete Task</Text>
            <Text className="text-xs text-gray-500 text-center mb-4">Are you sure you want to delete this task?</Text>
            <View className="flex-row w-full gap-2">
              <TouchableOpacity className="flex-1 py-2.5 bg-slate-100 rounded-xl items-center" onPress={() => setShowDeleteModal(false)}>
                <Text className="text-slate-600 font-semibold text-sm">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 py-2.5 bg-red-500 rounded-xl items-center" onPress={() => { setShowDeleteModal(false); onDelete(task.id); }}>
                <Text className="text-white font-bold text-sm">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};