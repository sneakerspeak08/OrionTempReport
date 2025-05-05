import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Home from '../components/Home'

test('renders Home page', () => {
    render(
        <BrowserRouter>
            <AuthProvider>
                <Home />
            </AuthProvider>
        </BrowserRouter>
    )
})
