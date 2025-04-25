import { useStore } from '@nanostores/preact';
import { listStore, addList, deleteList } from '../stores/listStore';
import { useState } from 'preact/hooks';

export default function ListDashboard() {
  const { lists } = useStore(listStore);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    addList({
      id: Date.now(),
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      description,
      created_at: new Date().toISOString()
    });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Lists</h1>
      <div className="mb-6">
        <input
          className="border px-3 py-2 rounded mr-2"
          placeholder="List title"
          value={title}
          onInput={e => setTitle(e.target.value)}
        />
        <input
          className="border px-3 py-2 rounded mr-2"
          placeholder="Description (optional)"
          value={description}
          onInput={e => setDescription(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Add List
        </button>
      </div>
      <ul className="space-y-2">
        {lists.map(list => (
          <li key={list.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{list.title}</div>
              <div className="text-sm text-gray-500">{list.description}</div>
            </div>
            <button
              className="text-red-500 hover:underline"
              onClick={() => deleteList(list.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
