// resources/js/Pages/Essays.jsx
import React from 'react';
import { usePage } from '@inertiajs/react';

const Essays = () => {
    const { essays } = usePage().props;

    return (
        <div>
            <h1>Essays</h1>
            {essays.length > 0 ? (
                essays.map(essay => (
                    <div key={essay.id}>
                        <h2>{essay.title}</h2>
                        <p>{essay.content}</p>
                    </div>
                ))
            ) : (
                <p>No essays found.</p>
            )}
        </div>
    );
};

export default Essays;
