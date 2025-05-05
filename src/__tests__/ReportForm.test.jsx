
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import ReportForm from '../components/ReportForm'

test('renders ReportForm page', () => {
    render(
        <BrowserRouter>
            <AuthProvider>
                <ReportForm />
            </AuthProvider>
        </BrowserRouter>
    )
})
