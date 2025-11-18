import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';


const EmailVerification = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`http://localhost:5000/api/verify-email/${token}`);
        navigate('/verification-success');
      } catch (error) {
        navigate('/verification-failed');
      }
    };
    verifyEmail();
  }, [token, navigate]);

  return <div className="text-center p-8">Verifying your email...</div>;
};

export default EmailVerification;