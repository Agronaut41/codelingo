// src/App.js
import React from 'react';

function App() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google'; // ajusta se necessário
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>Login</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ marginBottom: 10 }}>
          <input type="text" placeholder="Nome" style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input type="password" placeholder="Senha" style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit" style={{ padding: 10, width: '100%' }}>Entrar</button>
      </form>

      <hr />

      <button
        onClick={handleGoogleLogin}
        style={{ marginTop: 10, padding: 10, width: '100%', backgroundColor: '#4285F4', color: '#fff', border: 'none' }}
      >
        Acessar com Gmail
      </button>
    </div>
  );
}

export default App;
