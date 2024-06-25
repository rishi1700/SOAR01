import React, { useState } from 'react';
import axios from 'axios';

const CreateCase = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/thehive/case', { title, description, severity });
      setResponse('Case created successfully');
    } catch (error) {
      console.error('Error creating case:', error);
      setResponse('Error creating case');
    }
  };

  return (
    <div>
      <h2>Create Case</h2>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="text" placeholder="Severity" value={severity} onChange={(e) => setSeverity(e.target.value)} />
      <button onClick={handleSubmit}>Create Case</button>
      <p>{response}</p>
    </div>
  );
};

export default CreateCase;
