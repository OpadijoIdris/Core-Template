"use client";

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: Array<'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'SUB_ADMIN'>
) => {
  const AuthComponent = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) {
        return; // Wait until loading is finished
      }
      if (!user) {
        router.replace('/auth/login');
      } else if (!allowedRoles.includes(user.role)) {
        // Redirect them to their own dashboard if they try to access a page they don't have permission for
        router.replace(user.role === 'USER' ? '/dashboard' : '/admin');
      }
    }, [user, loading, router]);

    // If we are still loading, show a loading indicator
    if (loading) {
      return <div>Loading...</div>;
    }

    // If the user is authenticated and has the correct role, render the component
    if (user && allowedRoles.includes(user.role)) {
      return <WrappedComponent {...props} />;
    }

    // If the user is not authenticated or doesn't have the right role,
    // the useEffect is handling the redirect. In the meantime, render null
    // to avoid showing anything or getting stuck on a loading screen.
    return null;
  };

  AuthComponent.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

  return AuthComponent;
};

function getDisplayName<P>(WrappedComponent: React.ComponentType<P>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;
