import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoItem from './todoItem';
import '../../style/todoStyle.css';
import { useUser } from '../../UserContext';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', completed: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('');

  const { user: currentUser } = useUser();
  const userId = currentUser.id;
  const navigate = useNavigate();

  // Fetch todos from server
  useEffect(() => {
    fetch(`http://localhost:3001/todos/getTodosById/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch todos');
        return res.json();
      })
      .then(data => {
        setTodos(data);
        setFilteredTodos(data);
      })
      .catch(error => console.error('Error fetching todos', error));
  }, [userId]);

  // Apply search and sort
  useEffect(() => {
    let list = todos;
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(todo =>
        todo.title.toLowerCase().includes(q) ||
        todo.id.toString().includes(q) ||
        todo.completed.toString().includes(q)
      );
    }
    // Sort
    if (sortCriteria) {
      list = [...list];
      switch (sortCriteria) {
        case 'id':
          list.sort((a, b) => a.id - b.id);
          break;
        case 'title':
          list.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'completed':
          list.sort((a, b) => a.completed - b.completed);
          break;
        default:
          break;
      }
    }
    setFilteredTodos(list);
  }, [searchQuery, sortCriteria, todos]);

  // Add new todo
  const handleAddTodo = () => {
    if (!newTodo.title.trim()) {
      alert('אנא מלאי את כותרת המטלה');
      return;
    }
    const payload = { user_id: userId, title: newTodo.title.trim(), completed: false };
    fetch('http://localhost:3001/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add todo');
        return res.json();
      })
      .then(created => {
        setTodos(prev => [...prev, created]);
        setShowForm(false);
        setNewTodo({ title: '', completed: false });
      })
      .catch(error => {
        alert('הייתה שגיאה בהוספת המטלה');
        console.error(error);
      });
  };

  return (
    <div className="todos-container">
      <button className="homeBtn" onClick={() => navigate(`/${currentUser.username}/${userId}/home`)}>
        Home
      </button>

      <h1 className="todos-header">Todos</h1>
      <button className="add-todo-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'בטל' : 'הוסף מטלה חדשה'}
      </button>

      {showForm && (
        <div className="add-todo-form">
          <input
            className="todo-input"
            type="text"
            placeholder="כותרת מטלה"
            value={newTodo.title}
            onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
          />
          <button className="save-btn" onClick={handleAddTodo}>שמור</button>
        </div>
      )}

      <div className="controls">
        <input
          className="search-input"
          type="text"
          placeholder="חפש מטלה..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <select
          className="sort-select"
          value={sortCriteria}
          onChange={e => setSortCriteria(e.target.value)}
        >
          <option value="">מיין לפי...</option>
          <option value="id">מספר מזהה</option>
          <option value="title">כותרת</option>
          <option value="completed">ביצוע</option>
        </select>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo, idx) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            index={idx}
            setTodos={setTodos}
            setFilteredTodos={setFilteredTodos}
            currentUser={currentUser}
          />
        ))}
      </ul>
    </div>
  );
};

export default Todos;
