import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from '../../../shared/components/Icon';

interface TaskFABProps {
  onPress: () => void;
}

export const TaskFAB = ({ onPress }: TaskFABProps) => {
  return (
    <TouchableOpacity
      className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 items-center justify-center shadow-2xl z-20"
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Icon name="sliders" size={22} color="#FFFFFF" />
    </TouchableOpacity>
  );
};
