import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Alert } from './ui/Alert'
import { Spinner } from './ui/Spinner'

export function VerifyEmailPage() {
  const { token } = useParams()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    const verifyToken = async () => {
      setStatus('verifying')
      await new Promise((resolve) => setTimeout(resolve, 2000))
      if (token === 'invalid') {
        setStatus('error')
      } else {
        setStatus('success')
      }
    }

    if (token) {
      verifyToken()
    } else {
      setStatus('error')
    }
  }, [token])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Email Verification
          </h1>
        </div>

        {status === 'verifying' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Spinner className="w-8 h-8 border-t-blue-600" />
            <p className="text-gray-600 font-medium">Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <Alert variant="success" className="justify-center">
              Email verified successfully!
            </Alert>
            <p className="text-sm text-gray-600">
              Your account is now active. You can sign in to access the portal.
            </p>
            <Link to="/login" className="block">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <Alert variant="error" className="justify-center">
              Verification failed
            </Alert>
            <p className="text-sm text-gray-600">
              The verification link is invalid or has expired. Please try
              registering again or contact support.
            </p>
            <div className="space-y-3">
              <Link to="/register" className="block">
                <Button variant="primary" className="w-full">
                  Register Again
                </Button>
              </Link>
              <Link to="/login" className="block">
                <Button variant="secondary" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
