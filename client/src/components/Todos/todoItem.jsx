import React, { useState } from 'react';

const TodoItem = ({ todo, index, setTodos, setFilteredTodos, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState(todo);

  // עדכון מטלה (עריכה או ✔)
  const handleUpdateTodo = (updated) => {
    const payload = { ...updated, user_id: currentUser.id };
    fetch(`http://localhost:3001/todos/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update todo');
        return res.json();
      })
      .then(data => {
        setTodos(prev => prev.map(t => t.id === data.id ? data : t));
        setFilteredTodos(prev => prev.map(t => t.id === data.id ? data : t));
        setIsEditing(false);
      })
      .catch(err => console.error('Error updating todo', err));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditingTodo(todo);
  };

  const handleSave = () => {
    handleUpdateTodo(editingTodo);
  };

  // סימון ✔
  const handleToggleComplete = () => {
    handleUpdateTodo({ ...todo, completed: !todo.completed });
  };

  // מחיקה
  const handleDelete = () => {
    fetch(`http://localhost:3001/todos/${todo.id}`, { method: 'DELETE' })
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todo.id));
        setFilteredTodos(prev => prev.filter(t => t.id !== todo.id));
      })
      .catch(err => console.error('Error deleting todo', err));
  };

  return (
    <li className="todo-item">
      <span>{index + 1}.</span>
      {isEditing ? (
        <input
          type="text"
          value={editingTodo.title}
          onChange={e => setEditingTodo({ ...editingTodo, title: e.target.value })}
        />
      ) : (
        <span className={todo.completed ? 'completed' : ''}>{todo.title}</span>
      )}

      {isEditing ? (
        <button className="edit-btn" onClick={handleSave}>עדכן</button>
      ) : (
        <button className="edit-btn" onClick={handleEdit}>ערוך</button>
      )}

      <button className="delete-btn" onClick={handleDelete}>מחק</button>

      <label className="complete-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
        />
        {todo.completed ? '✔' : ''}
      </label>
    </li>
  );
};

export default TodoItem;
