import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageLoader } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      localStorage.setItem('token', token);
      // Fetch user data
      fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Google login successful!');
            navigate('/');
          } else {
            throw new Error('Failed to fetch user');
          }
        })
        .catch(() => {
          toast.error('Authentication failed');
          navigate('/login');
        });
    } else if (error) {
      toast.error(error.replace(/\+/g, ' '));
      navigate('/login');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return <PageLoader />;
};

export default GoogleAuthCallback;