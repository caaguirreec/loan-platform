import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createLoan } from '../services/api'

const EmployeePortal = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    employee_name: '',
    amount: '',
    term: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Validate input
      if (!formData.employee_name.trim()) {
        throw new Error('Please enter your name')
      }

      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount')
      }

      const term = parseInt(formData.term)
      if (isNaN(term) || term <= 0) {
        throw new Error('Please enter a valid term in days')
      }

      // Submit loan request
      await createLoan({
        employee_name: formData.employee_name.trim(),
        amount,
        term
      })

      // Show success message
      setSuccess(true)
      setFormData({
        employee_name: '',
        amount: '',
        term: ''
      })
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to submit loan request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100 p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Employee Portal</h1>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-outline"
            aria-label="Go back to home"
          >
            Back
          </button>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">Loan Request</h2>

          {success ? (
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="text-green-800">Your loan request has been submitted successfully!</p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 btn btn-primary"
                aria-label="Create new loan request"
              >
                Create Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="employee_name" className="mb-2 block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  id="employee_name"
                  name="employee_name"
                  value={formData.employee_name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-700">
                  Loan Amount (USD)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="input"
                  min="1"
                  step="0.01"
                  placeholder="Enter loan amount"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="term" className="mb-2 block text-sm font-medium text-gray-700">
                  Repayment Term (days)
                </label>
                <input
                  type="number"
                  id="term"
                  name="term"
                  value={formData.term}
                  onChange={handleChange}
                  className="input"
                  min="1"
                  placeholder="Enter term in days"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-accent"
                  disabled={isSubmitting}
                  aria-label="Send loan request"
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeePortal 