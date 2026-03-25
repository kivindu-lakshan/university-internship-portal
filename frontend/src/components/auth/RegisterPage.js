import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from './ui/Card'
import { Input, Select } from './ui/Input'
import { Button } from './ui/Button'
import { Alert } from './ui/Alert'

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
      isValid = false
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role'
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
      isValid = false
    } else {
      const studentRegex = /^it\d{8}@my\.sliit\.lk$/i
      const isStudentFormat = studentRegex.test(formData.email)

      if (formData.role === 'student' && !isStudentFormat) {
        newErrors.email =
          'Student email must be in format: itXXXXXXXX@my.sliit.lk'
        isValid = false
      } else if (formData.role === 'employer' && isStudentFormat) {
        newErrors.email = 'Employers cannot use student email addresses'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
        isValid = false
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }

    if (serverError) setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validateForm()) return

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      if (formData.email === 'error@test.com') {
        setServerError('An account with this email already exists.')
      } else {
        setIsSuccess(true)
      }
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Check Your Email
            </h1>
          </div>
          <Alert variant="success" className="mb-6">
            Registration successful! Please check your email to verify your
            account.
          </Alert>
          <Link to="/login">
            <Button variant="primary" className="w-full">
              Go to Login
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-8">
      <Card>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Join the internship portal
          </p>
        </div>

        {serverError && (
          <Alert variant="error" className="mb-4">
            {serverError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            error={errors.name}
            placeholder="John Doe"
            required
          />

          <Select
            label="Role"
            value={formData.role}
            onChange={handleChange('role')}
            error={errors.role}
            options={[
              {
                value: 'student',
                label: 'Student',
              },
              {
                value: 'employer',
                label: 'Employer',
              },
            ]}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            placeholder={
              formData.role === 'student'
                ? 'it12345678@my.sliit.lk'
                : 'name@company.com'
            }
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            error={errors.password}
            placeholder="••••••••"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            placeholder="••••••••"
            required
          />

          <div className="pt-2">
            <Button type="submit" loading={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
