import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });

    navigate('/dashboard/admin');
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Username / Email"
        className="login-form__input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="login-form__input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" className="login-form__button">
        Masuk
      </button>
    </form>
  );
}
