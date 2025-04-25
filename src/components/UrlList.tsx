import { useStore } from '@nanostores/preact';
import { linkStore, addLink, deleteLink } from '../stores/linkStore';
import { useState } from 'preact/hooks';

export default function UrlList({ listId }) {
  const { links } = useStore(linkStore);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!url.trim()) return;
    addLink({
      id: Date.now(),
      url,
      title,
      description,
      image: '',
      created_at: new Date().toISOString(),
      list_id: listId
    });
    setUrl('');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">URLs in this List</h2>
      <div className="mb-4 flex gap-2">
        <input
          className="border px-3 py-2 rounded"
          placeholder="URL"
          value={url}
          onInput={e => setUrl(e.target.value)}
        />
        <input
          className="border px-3 py-2 rounded"
          placeholder="Title (optional)"
          value={title}
          onInput={e => setTitle(e.target.value)}
        />
        <input
          className="border px-3 py-2 rounded"
          placeholder="Description (optional)"
          value={description}
          onInput={e => setDescription(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Add URL
        </button>
      </div>
      <ul className="space-y-2">
        {links.filter(link => link.list_id === listId).map(link => (
          <li key={link.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <a href={link.url} className="font-semibold text-blue-600" target="_blank" rel="noopener noreferrer">{link.title || link.url}</a>
              <div className="text-sm text-gray-500">{link.description}</div>
            </div>
            <button
              className="text-red-500 hover:underline"
              onClick={() => deleteLink(link.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
