import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from '../../../shared/components/Icon';
import { useTaskPreferences } from '../hooks/useTaskPreferences';
import { StatusFilter } from '../types/task.types';

const STATUS_OPTIONS: { mode: StatusFilter; icon: 'list' | 'clock' | 'check-circle'; label: string }[] = [
  { mode: 'all', icon: 'list', label: 'All' },
  { mode: 'pending', icon: 'clock', label: 'Pending' },
  { mode: 'completed', icon: 'check-circle', label: 'Done' },
];

export const TaskFilterBar = () => {
  const folders = useTaskPreferences((state) => state.folders);
  const activeFolder = useTaskPreferences((state) => state.activeFolder);
  const setActiveFolder = useTaskPreferences((state) => state.setActiveFolder);
  const statusFilter = useTaskPreferences((state) => state.statusFilter);
  const setStatusFilter = useTaskPreferences((state) => state.setStatusFilter);

  return (
    <View className="bg-white border-b border-gray-100 py-3 gap-2.5">
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {folders.map((folder) => {
          const isActive = activeFolder === folder;
          return (
            <TouchableOpacity
              key={folder}
              onPress={() => setActiveFolder(folder)}
              className={`flex-row items-center rounded-full px-4 py-2 ${
                isActive ? 'bg-blue-600' : 'bg-slate-100'
              }`}
            >
              <Icon name="folder" size={13} color={isActive ? '#FFFFFF' : '#64748B'} />
              <Text className={`text-xs font-bold ml-1.5 ${isActive ? 'text-white' : 'text-slate-600'}`}>
                {folder}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {STATUS_OPTIONS.map(({ mode, icon, label }) => {
          const isActive = statusFilter === mode;
          return (
            <TouchableOpacity
              key={mode}
              onPress={() => setStatusFilter(mode)}
              className={`flex-row items-center rounded-full px-4 py-2 ${
                isActive ? 'bg-slate-800' : 'bg-slate-100'
              }`}
            >
              <Icon name={icon} size={13} color={isActive ? '#FFFFFF' : '#64748B'} />
              <Text className={`text-xs font-bold ml-1.5 ${isActive ? 'text-white' : 'text-slate-600'}`}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
