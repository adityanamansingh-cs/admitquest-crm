import React from 'react';
import styled from 'styled-components';
import { Box, H2, Text, Button } from '@adminjs/design-system';

const GoogleButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #4285F4 0%, #0F6BF5 100%);
  color: white;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 14px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.25);
  
  &:hover {
    background: linear-gradient(135deg, #5294FF 0%, #2F7FFF 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(66, 133, 244, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(66, 133, 244, 0.2);
  }
`;

const GoogleIcon = () => (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const Login = () => {
  React.useEffect(() => {
    // Check for authentication error
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      alert('Authentication failed. Please make sure you are using an authorized email domain (@sunstone.in or @collegesearch.in).');
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = '/admin/auth/google';
  };

  return (
    <Box
      bg="grey100"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      style={{
        backgroundImage: 'linear-gradient(315deg, rgba(11,11,30,1) 0%, rgba(19,19,43,1) 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Background Elements */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 600"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            pointerEvents: 'none'
          }}
        >
          <path
            d="M0,0 L1000,0 L1000,600 L0,600 Z"
            fill="url(#grid-pattern)"
          />
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
        </svg>
        
        <div 
          style={{
            position: 'absolute',
            top: '30%',
            left: '15%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251,40,61,0.1) 0%, rgba(251,40,61,0) 70%)',
            filter: 'blur(40px)'
          }}
        />
        
        <div 
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(66,133,244,0.1) 0%, rgba(66,133,244,0) 70%)',
            filter: 'blur(40px)'
          }}
        />
      </Box>

      <Box
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '40px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 1
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mb="xl"
        >
          <img 
            src="/assets/logo.svg" 
            alt="AdmitQuest Logo" 
            style={{ 
              width: '120px',
              marginBottom: '24px'
            }} 
          />
          
          <H2 
            style={{
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #FFF 0%, #DDD 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            AdmitQuest Admin
          </H2>
          
          <Text 
            mb="xl" 
            textAlign="center" 
            color="white"
            style={{
              maxWidth: '320px',
              lineHeight: 1.6
            }}
          >
            Sign in using your Google account to access the admin dashboard
          </Text>
        </Box>
        
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center"
        >
          <GoogleButton onClick={handleGoogleLogin}>
            <GoogleIcon />
            Sign in with Google
          </GoogleButton>
          
          <Text 
            mt="xl" 
            textAlign="center" 
            size="sm" 
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.85rem',
              maxWidth: '280px'
            }}
          >
            Only @sunstone.in or @collegesearch.in email domains are authorized
          </Text>
        </Box>
        
        {/* Security Badge */}
        <Box 
          mt="xxl" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          style={{
            padding: '12px',
            background: 'rgba(44,212,158,0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(44,212,158,0.2)'
          }}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: '8px' }}
          >
            <path 
              d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" 
              stroke="#2CD49E" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M9 12L11 14L15 10" 
              stroke="#2CD49E" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <Text 
            size="sm" 
            style={{ 
              color: '#2CD49E', 
              margin: 0 
            }}
          >
            Secure authentication with Google
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Login; 