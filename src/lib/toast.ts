// Toast utilities and state management
export interface ToastData {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Global toast state management
let toasts: ToastData[] = [];
let listeners: ((toasts: ToastData[]) => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener([...toasts]));
};

export const toast = {
  show: (data: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newToast = { id, ...data };
    toasts.push(newToast);
    notifyListeners();
    return id;
  },
  dismiss: (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    notifyListeners();
  },
  success: (title: string, description?: string) => {
    return toast.show({ title, description, type: 'success' });
  },
  error: (title: string, description?: string) => {
    return toast.show({ title, description, type: 'error' });
  },
  warning: (title: string, description?: string) => {
    return toast.show({ title, description, type: 'warning' });
  },
  info: (title: string, description?: string) => {
    return toast.show({ title, description, type: 'info' });
  }
};

export const subscribeToToasts = (listener: (toasts: ToastData[]) => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

export const getToasts = () => [...toasts];