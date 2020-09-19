import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createLogEntry } from './API';

const LogEntryForm = ({ location, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            data.latitude = location.latitude;
            data.longitude = location.longitude;
            await createLogEntry(data);
            onClose();
        } catch (error) {
            console.error(error);
            setError(error.message);
            setLoading(false);
        }
    };
    return (
        <form autoComplete="off" className="entry-form" onSubmit={handleSubmit(onSubmit)}>
            {error ? <h3 className="error"> {error} </h3> : null}

            <label htmlFor="title">Title</label>
            <input name="title" required ref={register} />

            <label htmlFor="image">Image</label>
            <input name="image" ref={register} />

            <label htmlFor="comments">Comments</label>
            <textarea name="comments" rows={3} ref={register}></textarea>

            <label htmlFor="description">Description</label>
            <textarea name="description" rows={3} ref={register}></textarea>

            <label htmlFor="visitDate">Visited</label>
            <input name="visitDate" type="date" required ref={register} />

            <label htmlFor='rating'>Rating</label>
            <input name="rating" type="number" min='0' max='10' ref={register} />

            <button disabled={loading}> {loading ? `Loading...` : `Create Log Entry`} </button>

        </form>
    );
}

export default LogEntryForm
