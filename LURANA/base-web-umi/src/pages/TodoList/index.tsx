import React, { useState, useEffect } from 'react';
import { 
  PlusOutlined, 
  CheckCircleOutlined, 
  DeleteOutlined, 
  BellOutlined, 
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FireFilled,
  ThunderboltFilled,
  CheckCircleFilled,
  HistoryOutlined,
  EditOutlined
} from '@ant-design/icons';
import { initialTodos } from '../../../mock/todo.mock'; 
import './index.less';

interface ITodo {
  id: string;
  task: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

const TodoListPage: React.FC = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState<ITodo['priority']>('Medium');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('PRO_TODO_KANBAN');
    if (data) {
      setTodos(JSON.parse(data));
    } else if (initialTodos) {
      setTodos(initialTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('PRO_TODO_KANBAN', JSON.stringify(todos));
  }, [todos]);

  const openEditModal = (item: ITodo) => {
    setEditingId(item.id);
    setTaskName(item.task);
    setPriority(item.priority);
    setDeadline(item.createdAt);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!taskName || !deadline) return;
    if (editingId) {
      setTodos(todos.map(t => t.id === editingId ? { ...t, task: taskName, priority, createdAt: deadline } : t));
    } else {
      const newTask: ITodo = {
        id: Date.now().toString(),
        task: taskName,
        completed: false,
        priority,
        createdAt: deadline,
      };
      setTodos([newTask, ...todos]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setTaskName('');
    setPriority('Medium');
    setDeadline('');
  };

  const urgentTasks = todos.filter(t => !t.completed && t.priority === 'High');

  const renderPriorityIcon = (p: string) => {
    switch(p) {
      case 'High': return <FireFilled className="icon-high" />;
      case 'Medium': return <ThunderboltFilled className="icon-medium" />;
      case 'Low': return <CheckCircleFilled className="icon-low" />;
      default: return null;
    }
  };

  return (
    <div className="todoContainer">
      <div className="kanbanLayout">
        <header className="header">
          <div className="info">
            <h1>Productivity Workspace</h1>
            <p>Sắp xếp thông minh, làm việc hiệu quả</p>
          </div>
          <button className="addMainBtn" onClick={() => setIsModalOpen(true)}>
            <PlusOutlined /> New Task
          </button>
        </header>

        <div className="boardGrid">
          <section className="column">
            <h3><HistoryOutlined /> In Progress</h3>
            <div className="cardList">
              {todos.filter(t => !t.completed).map(item => (
                <div key={item.id} className={`card priority-${item.priority}`}>
                  <div className="cardHeader">
                    <span className="priorityWrapper">
                      {renderPriorityIcon(item.priority)}
                      <span className="badge">{item.priority}</span>
                    </span>
                    <div className="actionGroup">
                      <EditOutlined className="editIcon" onClick={() => openEditModal(item)} />
                      <CheckCircleOutlined 
                        className="doneIcon" 
                        onClick={() => setTodos(todos.map(t => t.id === item.id ? {...t, completed: true} : t))} 
                      />
                    </div>
                  </div>
                  <div className="cardBody" onClick={() => openEditModal(item)}>{item.task}</div>
                  <div className="cardFooter">
                    <ClockCircleOutlined /> <span>{item.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="column">
            <h3><CheckCircleFilled style={{color: '#55efc4'}} /> Completed</h3>
            <div className="cardList">
              {todos.filter(t => t.completed).map(item => (
                <div key={item.id} className="card isDone">
                  <div className="cardBody">{item.task}</div>
                  <div className="cardFooter">
                    <span><CheckCircleOutlined /> Finished</span>
                    <DeleteOutlined 
                      className="delIcon" 
                      onClick={() => setTodos(todos.filter(t => t.id !== item.id))} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="column alertColumn">
            <h3><BellOutlined /> Urgent Alerts</h3>
            <div className="alertArea">
              {urgentTasks.map(item => (
                <div key={item.id} className="alertBox">
                  <ExclamationCircleOutlined />
                  <div className="alertText">
                    <strong>Hạn chót sắp tới!</strong>
                    <span>{item.task} ({item.createdAt})</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalBox">
            <h2>{editingId ? <EditOutlined /> : <PlusOutlined />} {editingId ? 'Edit Task' : 'Create New Task'}</h2>
            <div className="formField">
              <label>Nhiệm vụ của bạn</label>
              <input value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="VD: Thiết kế UI..." />
            </div>
            <div className="formRow">
              <div className="formField">
                <label>Độ ưu tiên</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
              <div className="formField">
                <label>Thời gian nhắc</label>
                <input type="time" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>
            </div>
            <div className="modalActions">
              <button className="btnCancel" onClick={closeModal}>Hủy</button>
              <button className="btnSave" onClick={handleSave}>{editingId ? 'Cập nhật' : 'Tạo Task'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoListPage;