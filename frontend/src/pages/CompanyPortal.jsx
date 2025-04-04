import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLoans, updateLoanStatus } from '../services/api'

const CompanyPortal = () => {
  const navigate = useNavigate()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingLoanId, setProcessingLoanId] = useState(null)

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      setLoading(true)
      const data = await getLoans()
      setLoans(data)
      setError('')
    } catch (err) {
      setError('Failed to fetch loan requests')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (loanId, status) => {
    try {
      setProcessingLoanId(loanId)
      await updateLoanStatus(loanId, status)
      
      // Update the loans list
      setLoans(loans.map(loan => 
        loan.id === loanId ? { ...loan, status } : loan
      ))
    } catch (err) {
      setError(`Failed to ${status} loan`)
      console.error(err)
    } finally {
      setProcessingLoanId(null)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-secondary-100 p-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Company Portal</h1>
          <div className="flex gap-4">
            <button
              onClick={fetchLoans}
              className="btn btn-outline"
              disabled={loading}
              aria-label="Refresh loan requests"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn btn-outline"
              aria-label="Go back to home"
            >
              Back
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">Loan Requests</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-center text-gray-500">Loading loan requests...</div>
            </div>
          ) : loans.length === 0 ? (
            <div className="rounded-lg bg-gray-50 py-8 text-center">
              <p className="text-gray-500">No loan requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Employee</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Term (Days)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{loan.employee_name}</td>
                      <td className="px-4 py-3 text-sm font-medium">{formatCurrency(loan.amount)}</td>
                      <td className="px-4 py-3 text-sm">{loan.term}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(loan.created_at)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClasses(loan.status)}`}>
                          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {loan.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleUpdateStatus(loan.id, 'approved')}
                              disabled={processingLoanId === loan.id}
                              className="rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white hover:bg-green-600"
                              aria-label="Approve loan request"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(loan.id, 'denied')}
                              disabled={processingLoanId === loan.id}
                              className="rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600"
                              aria-label="Deny loan request"
                            >
                              Deny
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">No actions available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyPortal 