import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Pressable } from 'react-native';
import { Icon } from '../../../shared/components/Icon';
import { useTaskPreferences } from '../hooks/useTaskPreferences';
import { SortOption } from '../types/task.types';

interface TaskSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SORT_OPTIONS: { key: SortOption; label: string; icon: 'sliders' | 'bar-chart-2' | 'check-square' }[] = [
  { key: 'manual', label: 'Manual Order', icon: 'sliders' },
  { key: 'progress', label: 'Progress %', icon: 'bar-chart-2' },
  { key: 'status', label: 'Status', icon: 'check-square' },
];

export const TaskSettingsModal = ({ visible, onClose }: TaskSettingsModalProps) => {
  const [newFolder, setNewFolder] = useState('');
  const sortOption = useTaskPreferences((state) => state.sortOption);
  const setSortOption = useTaskPreferences((state) => state.setSortOption);
  const folders = useTaskPreferences((state) => state.folders);
  const addFolder = useTaskPreferences((state) => state.addFolder);
  const deleteFolder = useTaskPreferences((state) => state.deleteFolder);

  const handleAddFolder = () => {
    if (newFolder.trim()) {
      addFolder(newFolder.trim());
      setNewFolder('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-slate-900/60 px-5">
        <Pressable style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} onPress={onClose} />
        <View className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl z-10 border border-slate-100 max-h-[85%]">
          <View className="flex-row justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <Text className="text-lg font-bold text-gray-900">Task Settings</Text>
            <TouchableOpacity onPress={onClose} className="p-1.5 rounded-full bg-slate-100">
              <Icon name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sorting</Text>
          <View className="flex-row gap-2 mb-5">
            {SORT_OPTIONS.map(({ key, label, icon }) => (
              <TouchableOpacity
                key={key}
                onPress={() => setSortOption(key)}
                className={`flex-1 py-2 px-1 rounded-xl items-center border ${
                  sortOption === key ? 'bg-blue-50 border-blue-500' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Icon name={icon} size={14} color={sortOption === key ? '#2563EB' : '#64748B'} />
                <Text
                  className={`text-xs font-bold mt-1 text-center ${
                    sortOption === key ? 'text-blue-600' : 'text-slate-600'
                  }`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Manage Folders</Text>
          <View className="flex-row gap-2 mb-3">
            <TextInput
              className="flex-1 border border-slate-200 bg-slate-50 px-3 py-2 rounded-xl text-sm text-gray-800"
              placeholder="New folder name..."
              placeholderTextColor="#94A3B8"
              value={newFolder}
              onChangeText={setNewFolder}
            />
            <TouchableOpacity
              className={`px-4 py-2 rounded-xl items-center justify-center ${
                newFolder.trim() ? 'bg-blue-600' : 'bg-blue-300'
              }`}
              disabled={!newFolder.trim()}
              onPress={handleAddFolder}
            >
              <Text className="text-white text-sm font-bold">Add</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-40" showsVerticalScrollIndicator={false}>
            {folders.map((folder) => (
              <View
                key={folder}
                className="flex-row items-center justify-between py-2.5 px-3 mb-1.5 bg-slate-50 rounded-xl border border-slate-100"
              >
                <View className="flex-row items-center">
                  <Icon name="folder" size={14} color="#3B82F6" />
                  <Text className="text-sm font-semibold text-gray-800 ml-2">{folder}</Text>
                </View>
                {folder !== 'All' ? (
                  <TouchableOpacity onPress={() => deleteFolder(folder)} className="p-1">
                    <Icon name="trash-2" size={16} color="#EF4444" />
                  </TouchableOpacity>
                ) : (
                  <Text className="text-xs text-slate-400 italic">Default</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
