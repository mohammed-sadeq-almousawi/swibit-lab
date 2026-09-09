import React, { ReactNode } from 'react';
import { View } from 'react-native';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className = '' }: GlassCardProps) => {
  return (
    <View
      className={`bg-white/80 dark:bg-slate-900/80 border border-white/20 shadow-lg rounded-2xl ${className}`}
    >
      {children}
    </View>
  );
};
