import { useLocalSearchParams } from 'expo-router';
import { EditTaskView } from '../../../features/tasks/components/EditTaskView';

export default function EditTaskRoute() {
  const { id, title, desc, folder, progress } = useLocalSearchParams();

  return (
    <EditTaskView
      id={id as string}
      initialTitle={(title as string) || ''}
      initialDesc={(desc as string) || ''}
      initialFolder={(folder as string) || undefined}
      initialProgress={progress !== undefined ? Number(progress) : 0}
    />
  );
}
