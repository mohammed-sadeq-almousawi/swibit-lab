import React from 'react';
import { Feather } from '@expo/vector-icons';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

interface IconProps {
  name: FeatherIconName;
  size?: number;
  color?: string;
}

export const Icon = ({ name, size = 20, color = '#6B7280' }: IconProps) => {
  return <Feather name={name} size={size} color={color} />;
};
