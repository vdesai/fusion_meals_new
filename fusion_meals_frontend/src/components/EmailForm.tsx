import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

const EmailForm = ({ content }: { content: string }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const sendEmail = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/email/send', {
        email: email,
        content: content,
      });
      setStatus(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error sending email:', axiosError.message);
      setStatus('❌ Failed to send email');
    }
  };

  return (
    <div className="email-form">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded mb-2"
      />
      <button
        onClick={sendEmail}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send to Email
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
};

export default EmailForm;
