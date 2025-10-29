import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForumComponent from '../../src/components/ForumComponent';

describe('ForumComponent', () => {
    test('renders the forum component', () => {
        render(<ForumComponent />);
        const headingElement = screen.getByText(/Community Forum/i);
        expect(headingElement).toBeInTheDocument();
    });

    test('allows users to create a new post', () => {
        render(<ForumComponent />);
        const inputElement = screen.getByPlaceholderText(/Write your post here.../i);
        const buttonElement = screen.getByRole('button', { name: /Post/i });

        fireEvent.change(inputElement, { target: { value: 'New post content' } });
        fireEvent.click(buttonElement);

        const postElement = screen.getByText(/New post content/i);
        expect(postElement).toBeInTheDocument();
    });

    test('allows users to reply to a post', () => {
        render(<ForumComponent />);
        const inputElement = screen.getByPlaceholderText(/Write your post here.../i);
        const buttonElement = screen.getByRole('button', { name: /Post/i });

        fireEvent.change(inputElement, { target: { value: 'First post' } });
        fireEvent.click(buttonElement);

        const replyInputElement = screen.getByPlaceholderText(/Write your reply here.../i);
        const replyButtonElement = screen.getByRole('button', { name: /Reply/i });

        fireEvent.change(replyInputElement, { target: { value: 'First reply' } });
        fireEvent.click(replyButtonElement);

        const replyElement = screen.getByText(/First reply/i);
        expect(replyElement).toBeInTheDocument();
    });
});