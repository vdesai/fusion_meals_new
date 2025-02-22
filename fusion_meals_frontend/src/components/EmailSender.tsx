import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

const EmailSender = ({ content }: { content: string }) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/email/send', {
        email,
        subject,
        content,
      });
      setMessage(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError;
      setMessage(`❌ Error sending email: ${axiosError.response?.data || axiosError.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-sender">
      <h2>📧 Send Meal Plan/Recipe via Email</h2>
      <input
        type="email"
        placeholder="Recipient's Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="input-field"
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="input-field"
      />
      <button onClick={handleSendEmail} disabled={loading} className="send-btn">
        {loading ? 'Sending...' : '📩 Send Email'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmailSender;
