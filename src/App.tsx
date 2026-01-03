import { useState } from 'react';  // أزلنا React من الاستيراد
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>✅ Vite + React على Vercel</h1>
      <p>تم حل المشكلة بنجاح!</p>
      <button onClick={() => setCount(count + 1)}>
        count is {count}
      </button>
    </div>
  );
}

export default App;
