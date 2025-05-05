
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import ProjectedRoute from '../components/ProjectedRoute'

test('renders ProjectedRoute page', () => {
    render(
        <BrowserRouter>
            <AuthProvider>
                <ProjectedRoute />
            </AuthProvider>
        </BrowserRouter>
    )
})
