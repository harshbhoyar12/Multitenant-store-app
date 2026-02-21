import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/apiClient';
import AuthLayout from '../auth/AuthLayout';
import toast from 'react-hot-toast';
import '../styles/Login.css';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const handleLoginSubmit = async (loginCredentials) => {
        try {
            const response = await api.post('/auth/login', loginCredentials);
            setAuth(response.data.user, response.data.token);
            toast.success('Welcome back!');
            navigate('/select-tenant');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your multi-tenant portal to manage your apps."
        >
            <form onSubmit={handleSubmit(handleLoginSubmit)} className="login-form">
                <div className="login-field">
                    <label className="login-label">Email Address</label>
                    <input
                        {...register('email')}
                        placeholder="name@company.com"
                        className={`login-input ${errors.email ? 'login-input-error' : ''}`}
                    />
                    {errors.email && <span className="login-error-text">{errors.email.message}</span>}
                </div>

                <div className="login-field">
                    <div className="login-label-row">
                        <label className="login-label">Password</label>
                        <Link to="/forgot-password" className="login-forgot">Forgot?</Link>
                    </div>
                    <input
                        type="password"
                        {...register('password')}
                        placeholder="••••••••"
                        className={`login-input ${errors.password ? 'login-input-error' : ''}`}
                    />
                    {errors.password && <span className="login-error-text">{errors.password.message}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="login-submit-btn"
                >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </AuthLayout>
    );
}
