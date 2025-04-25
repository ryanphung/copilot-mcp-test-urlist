import { Router } from 'preact-router';
import routes from './routes';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Router>{routes}</Router>
    </div>
  );
}
