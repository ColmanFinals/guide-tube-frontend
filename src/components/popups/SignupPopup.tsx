import React, { useState } from 'react';

interface SignupPopupProps {
  onClose: () => void;
}

const SignupPopup: React.FC<SignupPopupProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement signup logic here (e.g., send signup request to server)
    console.log(`Signup attempt with username: ${username}, password: ${password}, fullName: ${fullName}`);
    onClose(); // Close popup after signup attempt (replace with actual success handling)
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SignupPopup;
