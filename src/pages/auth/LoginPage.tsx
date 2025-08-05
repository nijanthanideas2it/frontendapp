import React from 'react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { LoginForm } from '../../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
      maxWidth="sm"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage; 