import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useTasks } from '../hooks/useTasks';
import { useUpdateTask, useDeleteTask } from '../hooks/useTaskMutations';
import { useTaskPreferences } from '../hooks/useTaskPreferences';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { TaskFilterBar } from './TaskFilterBar';
import { TaskSettingsModal } from './TaskSettingsModal';
import { TaskFAB } from './TaskFAB';
import { Icon } from '../../../shared/components/Icon';
import { Task } from '../types/task.types';

export const TasksScreen = () => {
  const { tasks, isLoading } = useTasks();
  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.username);
  const activeFolder = useTaskPreferences((state) => state.activeFolder);
  const statusFilter = useTaskPreferences((state) => state.statusFilter);
  const sortOption = useTaskPreferences((state) => state.sortOption);
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();
  const [orderIds, setOrderIds] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const orderedAndFilteredTasks = useMemo(() => {
    if (!tasks) return [];
    let list = [...tasks];
    if (activeFolder !== 'All') list = list.filter((t) => t.folder === activeFolder);
    if (statusFilter === 'pending') list = list.filter((t) => !t.done);
    if (statusFilter === 'completed') list = list.filter((t) => t.done);

    if (sortOption === 'progress') {
      return list.sort((a, b) => (b.progress ?? (b.done ? 100 : 0)) - (a.progress ?? (a.done ? 100 : 0)));
    }
    if (sortOption === 'status') {
      return list.sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
    }
    if (orderIds.length > 0) {
      const taskMap = new Map(list.map((t) => [t.id, t]));
      const ordered = orderIds.filter((id) => taskMap.has(id)).map((id) => taskMap.get(id)!);
      return [...ordered, ...list.filter((t) => !orderIds.includes(t.id))];
    }
    return list;
  }, [tasks, activeFolder, statusFilter, sortOption, orderIds]);

  const handleReorder = useCallback((index: number, direction: 'up' | 'down') => {
    const list = orderedAndFilteredTasks;
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= list.length) return;
    const baseIds = orderIds.length > 0 ? orderIds : (tasks || []).map((t) => t.id);
    const fullList = [...baseIds];
    const fromIdx = fullList.indexOf(list[index].id);
    const toIdx = fullList.indexOf(list[swapIndex].id);
    if (fromIdx === -1 || toIdx === -1) return;
    [fullList[fromIdx], fullList[toIdx]] = [fullList[toIdx], fullList[fromIdx]];
    setOrderIds(fullList);
  }, [orderedAndFilteredTasks, orderIds, tasks]);

  const handleEdit = (task: Task) => {
    router.push({
      pathname: `/(main)/task/${task.id}`,
      params: {
        title: task.title,
        desc: task.desc || '',
        folder: task.folder || '',
        progress: String(task.progress !== undefined ? task.progress : task.done ? 100 : 0),
      },
    });
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row justify-between items-center p-5 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">{username ? `Hi, ${username} 👋` : 'My Tasks'}</Text>
        <TouchableOpacity onPress={logout} className="p-2 bg-red-500 rounded-lg flex-row items-center">
          <Icon name="log-out" size={18} color="#FFFFFF" />
          <Text className="text-white font-bold ml-1">Logout</Text>
        </TouchableOpacity>
      </View>
      <TaskFilterBar />
      <TaskForm />
      {isLoading ? (
        <ActivityIndicator size="large" color="#3B82F6" className="mt-12" />
      ) : (
        <FlatList
          data={orderedAndFilteredTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TaskItem
              task={item}
              onToggleDone={(t) => updateMutation.mutate({ ...t, done: !t.done, progress: !t.done ? 100 : 0 })}
              onProgressChange={(t, p) => updateMutation.mutate({ ...t, done: p === 100, progress: p })}
              onEdit={handleEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
              onMoveUp={() => handleReorder(index, 'up')}
              onMoveDown={() => handleReorder(index, 'down')}
              isFirst={index === 0}
              isLast={index === orderedAndFilteredTasks.length - 1}
              showReorder={sortOption === 'manual'}
            />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
          ListEmptyComponent={
            <Text className="text-center mt-12 text-gray-500 text-sm">
              {activeFolder === 'All' ? 'No tasks found. Create one above!' : `No tasks in "${activeFolder}".`}
            </Text>
          }
        />
      )}
      <TaskFAB onPress={() => setShowSettings(true)} />
      <TaskSettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </View>
  );
};
