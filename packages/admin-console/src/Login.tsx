import { AuthService } from 'api/auth-service'
import React from 'react'
import { useForm } from 'react-hook-form'
type LoginFormType = {
  email: string
  password: string
}
const Login = () => {
  const { register, handleSubmit } = useForm<LoginFormType>({
    defaultValues: {
      email: '',
      password: ''
    }
  })
  async function onSubmit(data: LoginFormType) {
    try {
      const authService = new AuthService()
      const response = await authService.authenticate(data)
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h3 className="text-xl font-medium">Login to protected console</h3>
        <div className="flex flex-col">
          <label htmlFor="">Email</label>
          <input
            className="form-input"
            {...register('email', { required: true })}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Password</label>
          <input
            className="form-input"
            {...register('password', { required: true })}
          />
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          className="inline-block px-8 py-3 font-medium text-center text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2"
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default Login
