
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Map from '../components/Map'

test('renders Map page', () => {
    render(
        <BrowserRouter>
            <AuthProvider>
                <Map />
            </AuthProvider>
        </BrowserRouter>
    )
})
