import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Login from './components/Login';
import Calendar from './components/Calendar';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {user ? <Calendar /> : <Login />}
    </div>
  );
}

export default App;