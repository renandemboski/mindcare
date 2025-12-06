import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

global.fetch = vi.fn();

describe('Home Page', () => {
    it('deve renderizar o título "Nossos Profissionais"', () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        expect(screen.getByText('Nossos Profissionais')).toBeInTheDocument();
    });

    it('deve exibir mensagem de carregamento inicialmente', () => {
        global.fetch.mockImplementationOnce(() => new Promise(() => { }));

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
        expect(screen.getByText('Carregando profissionais...')).toBeInTheDocument();
    });
}); 
