import { useContext } from 'react';
import { NotificationContext } from '../../context/NotificationContext';

export function useNotificationStore() {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error(
      'useNotificationStore deve ser usado dentro de NotificationProvider'
    );
  }

  return ctx;
}
