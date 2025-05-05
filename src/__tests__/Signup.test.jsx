
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Signup from '../components/Signup'

test('renders Signup page', () => {
    render(
        <BrowserRouter>
            <AuthProvider>
                <Signup />
            </AuthProvider>
        </BrowserRouter>
    )
})
