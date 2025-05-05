
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Reports from '../components/Reports'

test('renders Reports page', () => {
    render(
        <BrowserRouter>
            <AuthProvider>
                <Reports />
            </AuthProvider>
        </BrowserRouter>
    )
})
