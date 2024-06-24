import React, { useState } from 'react';
import axios from 'axios';

const RuleEditor = ({ rule }) => {
    const [formData, setFormData] = useState(rule);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/rules/${formData.id}`, formData);
            setMessage('Rule updated successfully');
        } catch (error) {
            setMessage('Error updating rule: ' + (error.response ? error.response.data.error : error.message));
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                </label>
                {/* Add other fields as necessary */}
                <button type="submit">Update Rule</button>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default RuleEditor;
