import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    navigate(`/${role}`)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-primary-100 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Loan Platform</h1>
          <p className="text-gray-600">Select your role to continue</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleRoleSelect('employee')}
            className="btn btn-primary w-full py-4 text-lg"
            aria-label="Login as employee"
          >
            Employee
          </button>
          
          <button
            onClick={() => handleRoleSelect('company')}
            className="btn btn-secondary w-full py-4 text-lg"
            aria-label="Login as company"
          >
            Company
          </button>
        </div>
      </div>
    </div>
  )
}

export default LandingPage 