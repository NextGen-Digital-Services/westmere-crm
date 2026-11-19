import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: ({ type = 'info', title, message, duration = 4000, action = null }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, type, title, message, action }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

export function showToast(props) {
  useToastStore.getState().addToast(props);
}
