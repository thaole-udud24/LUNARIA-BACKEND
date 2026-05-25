export interface ITodo {
  id: string;
  task: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

export const initialTodos: ITodo[] = [
  {
    id: '1',
    task: 'Thiết kế giao diện Todo List Pastel',
    completed: true,
    priority: 'High',
    createdAt: '08:00 AM'
  },
  {
    id: '2',
    task: 'Tích hợp LocalStorage và Real-time Clock',
    completed: false,
    priority: 'Medium',
    createdAt: '09:30 AM'
  },
  {
    id: '3',
    task: 'Viết Mock data và cấu hình Route',
    completed: false,
    priority: 'Low',
    createdAt: '10:15 AM'
  }
];