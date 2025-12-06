import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

describe('Header Component', () => {
    it('deve renderizar o título MindCare e o logo', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
        expect(screen.getByText('MindCare')).toBeInTheDocument();
        expect(screen.getByAltText('MindCare Logo')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
    });

    it('deve abrir e fechar o menu ao clicar no botão hamburguer', async () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        const menuButton = screen.getByRole('button', { name: 'Menu' });

        const inicioLink = screen.getByText('Início');
        const loginLink = screen.getByText('Login');

        expect(inicioLink).toBeInTheDocument();
        expect(loginLink).toBeInTheDocument();

        await userEvent.click(menuButton);

        expect(screen.getByText('Início')).toBeInTheDocument();
    });
});
