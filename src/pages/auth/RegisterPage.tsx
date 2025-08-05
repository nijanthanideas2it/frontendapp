import React from 'react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { RegisterForm } from '../../components/auth/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us to start managing your projects effectively"
      maxWidth="sm"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage; 