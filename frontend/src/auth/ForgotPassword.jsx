import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import '../styles/ForgotPassword.css';

const resetPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export default function ForgotPassword() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    const handleResetSubmit = async (emailData) => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Reset link sent to your email.');
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <AuthLayout
                title="Check your email"
                subtitle="We've sent password reset instructions to your inbox."
            >
                <div className="forgot-success-content">
                    <div className="forgot-icon-circle">
                        <CheckCircle2 size={32} color="hsl(var(--success))" />
                    </div>
                    <Link to="/login" className="btn-primary forgot-submit-btn">
                        Back to Login
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Forgot Password?"
            subtitle="No worries, we'll send you reset instructions."
        >
            <form onSubmit={handleSubmit(handleResetSubmit)} className="forgot-form">
                <div className="forgot-field">
                    <label className="forgot-label">Email Address</label>
                    <div className="forgot-input-wrapper">
                        <Mail size={18} className="forgot-input-icon" />
                        <input
                            {...register('email')}
                            placeholder="name@company.com"
                            className={`forgot-input ${errors.email ? 'forgot-input-error' : ''}`}
                        />
                    </div>
                    {errors.email && <span className="forgot-error-text">{errors.email.message}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary forgot-submit-btn"
                >
                    {isSubmitting ? 'Sending...' : 'Reset Password'}
                </button>

                <Link to="/login" className="forgot-back-link">
                    <ArrowLeft size={16} /> Back to Sign In
                </Link>
            </form>
        </AuthLayout>
    );
}
