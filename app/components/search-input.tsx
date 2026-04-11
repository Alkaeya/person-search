'use client';

import React, { useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import { searchUsers } from '@/app/actions/actions';

export default function SearchInput() {
    const loadOptions = async (inputValue: string) => {
        const users = await searchUsers(inputValue);
        return users.map(user => ({
            value: user.id,
            label: user.name,
        }));
    };

    const handleChange = useCallback((option: { value: string } | null) => {
        const userId = option?.value || null;

        if (userId) {
            // Only reload when a user is actually selected
            const url = new URL(window.location.href);
            url.searchParams.set('userId', userId);
            window.history.pushState({}, '', url.toString());
            window.location.reload(); // Ensure server re-render when user is selected
        }
    }, []);

    return (

        <div
            suppressHydrationWarning
            className="w-full max-w-md mx-auto"
        >
            <AsyncSelect
                instanceId="user-search"
                cacheOptions={false}
                loadOptions={loadOptions}
                onChange={handleChange}
                placeholder="Search for a user..."
            />
        </div>

    );
}
