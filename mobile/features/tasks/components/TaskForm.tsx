import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { GlassCard } from '../../../shared/components/GlassCard';
import { Icon } from '../../../shared/components/Icon';
import { useCreateTask } from '../hooks/useTaskMutations';
import { useTaskPreferences } from '../hooks/useTaskPreferences';

export const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);

  const folders = useTaskPreferences((state) => state.folders);

  const createMutation = useCreateTask(() => {
    setTitle('');
    setDescription('');
    setSelectedFolder(undefined);
  });

  const isValid = title.trim().length > 0;

  const handleCreate = () => {
    if (!isValid || createMutation.isPending) return;
    createMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      folder: selectedFolder,
      progress: 0,
    });
  };

  return (
    <GlassCard className="p-4 mx-4 mt-2">
      <TextInput
        className="border border-slate-200 bg-white/80 px-3.5 py-2.5 rounded-xl mb-2 text-sm text-gray-800"
        placeholder="Task Title..."
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        className="border border-slate-200 bg-white/80 px-3.5 py-2.5 rounded-xl mb-3 text-sm text-gray-800"
        placeholder="Task Description (Optional)..."
        placeholderTextColor="#9CA3AF"
        value={description}
        onChangeText={setDescription}
      />

      <View className="mb-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          <TouchableOpacity
            onPress={() => setSelectedFolder(undefined)}
            className={`px-3 py-1.5 rounded-full mr-2 border ${
              selectedFolder === undefined ? 'bg-blue-600 border-blue-600' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <Text className={`text-xs font-semibold ${selectedFolder === undefined ? 'text-white' : 'text-slate-600'}`}>
              No Folder
            </Text>
          </TouchableOpacity>
          {folders
            .filter((f) => f !== 'All')
            .map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setSelectedFolder(selectedFolder === f ? undefined : f)}
                className={`flex-row items-center px-3 py-1.5 rounded-full mr-2 border ${
                  selectedFolder === f ? 'bg-blue-600 border-blue-600' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <Icon name="folder" size={11} color={selectedFolder === f ? '#FFFFFF' : '#64748B'} />
                <Text className={`text-xs font-semibold ml-1 ${selectedFolder === f ? 'text-white' : 'text-slate-600'}`}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        className={`py-3 rounded-xl items-center flex-row justify-center ${
          isValid && !createMutation.isPending ? 'bg-green-500' : 'bg-green-300'
        }`}
        onPress={handleCreate}
        disabled={!isValid || createMutation.isPending}
      >
        {createMutation.isPending ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Icon name="plus" size={18} color="#FFFFFF" />
            <Text className="text-white text-sm font-bold ml-1.5">Add Task</Text>
          </>
        )}
      </TouchableOpacity>
    </GlassCard>
  );
};