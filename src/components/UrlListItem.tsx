import { useState } from 'preact/hooks';
import { updateLink, deleteLink } from '../stores/linkStore';

export default function UrlListItem({ link }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: link.title || '',
    url: link.url || '',
    description: link.description || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateLink({ ...link, ...form });
      setEditing(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <li className="bg-white p-3 rounded shadow flex flex-col gap-2">
        <input
          className="border px-2 py-1 rounded"
          name="title"
          value={form.title}
          onInput={handleChange}
          placeholder="Title"
        />
        <input
          className="border px-2 py-1 rounded"
          name="url"
          value={form.url}
          onInput={handleChange}
          placeholder="URL"
        />
        <input
          className="border px-2 py-1 rounded"
          name="description"
          value={form.description}
          onInput={handleChange}
          placeholder="Description"
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2 mt-2">
          <button
            className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={() => setEditing(false)}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="bg-white p-3 rounded shadow flex justify-between items-center">
      <div>
        <a href={link.url} className="font-semibold text-blue-600" target="_blank" rel="noopener noreferrer">{link.title || link.url}</a>
        <div className="text-sm text-gray-500">{link.description}</div>
      </div>
      <div className="flex gap-2">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => deleteLink(link.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
