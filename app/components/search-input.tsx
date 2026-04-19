'use client';

import React, { useCallback, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { searchUsers } from '@/app/actions/actions';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { SignInDialog } from './signin-dialog';
import { SignUpDialog } from './signup-dialog';

export default function SearchInput() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [inputValue, setInputValue] = useState('');
    const [signInOpen, setSignInOpen] = useState(false);
    const [signUpOpen, setSignUpOpen] = useState(false);

    const loadOptions = async (inputValue: string) => {
        if (!session?.user) {
            return [];
        }
        const users = await searchUsers(inputValue);
        return users.map(user => ({
            value: String(user.id),
            label: user.name,
        }));
    };

    const handleChange = useCallback((option: { value: string; label: string } | null) => {
        const userId = option?.value || null;

        if (userId) {
            // Clear input after selection
            setInputValue('');
            // Only reload when a user is actually selected
            try {
              const url = new URL(window.location.href);
              url.searchParams.set('userId', userId);
              window.history.pushState({}, '', url.toString());
              window.location.reload(); // Ensure server re-render when user is selected
                        } catch {
              // If URL construction fails, just reload the page
              window.location.reload()
            }
        }
    }, []);

    const handleInputChange = (value: string) => {
        if (!session?.user) {
            if (value.length > 0) {
                toast({
                    title: 'Sign in required',
                    description: 'Please sign in to search users.',
                    variant: 'destructive',
                });
                setSignInOpen(true);
            }
            return;
        }
        setInputValue(value);
    };

    return (
        <>
            <div
                suppressHydrationWarning
                className="w-full max-w-md mx-auto"
            >
                <AsyncSelect
                    instanceId="user-search"
                    cacheOptions={false}
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
                    loadOptions={loadOptions}
                    onChange={handleChange}
                    placeholder="Search for a user..."
                    isDisabled={!session?.user}
                />
            </div>

            <SignInDialog
                open={signInOpen}
                onOpenChange={setSignInOpen}
                onSignUpClick={() => {
                    setSignInOpen(false)
                    setSignUpOpen(true)
                }}
            />

            <SignUpDialog
                open={signUpOpen}
                onOpenChange={setSignUpOpen}
                onSignInClick={() => {
                    setSignUpOpen(false)
                    setSignInOpen(true)
                }}
            />
        </>
    );
}
