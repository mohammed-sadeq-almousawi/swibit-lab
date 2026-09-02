import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasksApi, createTaskApi, updateTaskApi, deleteTaskApi, Task } from '../../features/tasks/api/tasksApi';
import { useAuthStore } from '../../core/store/useAuthStore';

export default function TasksScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: getTasksApi,
  });

  const createMutation = useMutation({
    mutationFn: () => createTaskApi(title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setTitle('');
      setDescription('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedTask: Task) => updateTaskApi(updatedTask),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTaskApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const renderTask = ({ item }: { item: Task }) => (
    <View className="flex-row bg-white p-4 rounded-lg mb-3 border-l-4 border-blue-500 items-center shadow-sm">
      <View className="flex-1">
        <Text className={`text-lg font-bold ${item.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {item.title}
        </Text>
        {item.desc ? <Text className="text-sm text-gray-500 mt-1">{item.desc}</Text> : null}
      </View>

      <View className="flex-row items-center">
        <TouchableOpacity
          className="p-1 ml-3"
          onPress={() => updateMutation.mutate({ ...item, done: !item.done })}
        >
          <Text className="text-xl">{item.done ? '✅' : '⬜'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="p-1 ml-3"
          onPress={() => deleteMutation.mutate(item.id)}
        >
          <Text className="text-xl">🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row justify-between items-center p-5 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">My Tasks</Text>
        <TouchableOpacity onPress={logout} className="p-2 bg-red-500 rounded-lg">
          <Text className="text-white font-bold">Logout</Text>
        </TouchableOpacity>
      </View>

      <View className="p-5 bg-white mt-2">
        <TextInput
          className="border border-gray-300 p-3 rounded-lg mb-3 text-base"
          placeholder="Task Title..."
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          className="border border-gray-300 p-3 rounded-lg mb-3 text-base"
          placeholder="Task Description (Optional)..."
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity
          className="bg-green-500 p-4 rounded-lg items-center"
          onPress={() => createMutation.mutate()}
          disabled={!title || createMutation.isPending}
        >
          {createMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-bold">Add Task</Text>
          )}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" className="mt-12" />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTask}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text className="text-center mt-12 text-gray-500 text-base">No tasks yet. Create one!</Text>}
        />
      )}
    </View>
  );
}
