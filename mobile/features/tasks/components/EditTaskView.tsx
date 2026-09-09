import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useEditTask } from '../hooks/useTaskMutations';
import { useTaskPreferences } from '../hooks/useTaskPreferences';
import { Icon } from '../../../shared/components/Icon';

interface EditTaskViewProps {
  id: string;
  initialTitle: string;
  initialDesc: string;
  initialFolder?: string;
  initialProgress?: number;
}

export const EditTaskView = ({ id, initialTitle, initialDesc, initialFolder, initialProgress = 0 }: EditTaskViewProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [desc, setDesc] = useState(initialDesc);
  const [folder, setFolder] = useState<string | undefined>(initialFolder || undefined);
  const [progress, setProgress] = useState<number>(Number(initialProgress) || 0);

  const folders = useTaskPreferences((state) => state.folders);
  const editMutation = useEditTask(() => router.back(), () => alert('Error updating task.'));

  const isValid = title.trim().length > 0;
  const handleSave = () => {
    if (!isValid || editMutation.isPending) return;
    editMutation.mutate({ id: Number(id), title: title.trim(), desc: desc.trim(), folder, progress });
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-slate-900/40">
      <Pressable style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} onPress={() => router.back()} />
      <View className="w-full max-w-sm bg-white/80 rounded-3xl p-6 shadow-2xl z-10 border border-white/40">
        <Text className="text-xl font-bold mb-4 text-center text-gray-800">Edit Task</Text>

        <TextInput
          className="border border-slate-200/80 bg-white/60 p-3 rounded-xl mb-2.5 text-sm text-gray-800"
          placeholder="Task Title"
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          className="border border-slate-200/80 bg-white/60 p-3 rounded-xl mb-3 text-sm text-gray-800"
          placeholder="Task Description"
          placeholderTextColor="#94A3B8"
          value={desc}
          onChangeText={setDesc}
        />

        <View className="mb-3">
          <Text className="text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Folder / Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <TouchableOpacity
              onPress={() => setFolder(undefined)}
              className={`px-3 py-1.5 rounded-full mr-2 border ${folder === undefined ? 'bg-blue-600 border-blue-600' : 'bg-slate-100/80 border-slate-200'}`}
            >
              <Text className={`text-xs font-semibold ${folder === undefined ? 'text-white' : 'text-slate-600'}`}>No Folder</Text>
            </TouchableOpacity>
            {folders.filter((f) => f !== 'All').map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFolder(folder === f ? undefined : f)}
                className={`flex-row items-center px-3 py-1.5 rounded-full mr-2 border ${folder === f ? 'bg-blue-600 border-blue-600' : 'bg-slate-100/80 border-slate-200'}`}
              >
                <Icon name="folder" size={11} color={folder === f ? '#FFFFFF' : '#64748B'} />
                <Text className={`text-xs font-semibold ml-1 ${folder === f ? 'text-white' : 'text-slate-600'}`}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mb-4 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60">
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-xs font-bold text-gray-600 uppercase tracking-wider">Progress</Text>
            <Text className="text-xs font-bold text-blue-600">{progress}%</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity className="px-2 py-1 rounded bg-white border border-slate-200" onPress={() => setProgress((p) => Math.max(0, p - 10))} disabled={progress <= 0}>
              <Text className="text-xs font-bold text-slate-700">-10%</Text>
            </TouchableOpacity>
            <View className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <View className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
            </View>
            <TouchableOpacity className="px-2 py-1 rounded bg-white border border-slate-200" onPress={() => setProgress((p) => Math.min(100, p + 10))} disabled={progress >= 100}>
              <Text className="text-xs font-bold text-slate-700">+10%</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className={`p-3 rounded-xl items-center mb-2 ${isValid && !editMutation.isPending ? 'bg-green-500' : 'bg-green-300'}`}
          onPress={handleSave}
          disabled={!isValid || editMutation.isPending}
        >
          {editMutation.isPending ? <ActivityIndicator color="#fff" size="small" /> : <Text className="text-white text-sm font-bold">Save Changes</Text>}
        </TouchableOpacity>
        <TouchableOpacity className="p-1.5 items-center" onPress={() => router.back()}>
          <Text className="text-gray-500 text-xs font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};