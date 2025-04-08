import React from 'react';
import { Box, HStack, Icon, Text, useNavigationResources } from '@adminjs/design-system';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resources = useNavigationResources();

  const handleLogout = () => {
    // Redirect to logout endpoint
    window.location.href = '/admin/auth/logout';
  };

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      right={0}
      height="64px"
      bg="white"
      boxShadow="sm"
      zIndex={1000}
    >
      <HStack
        height="100%"
        px={4}
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack spacing={4}>
          {resources.map((resource) => (
            <Box
              key={resource.id}
              as="button"
              onClick={() => navigate(resource.href)}
              bg={location.pathname === resource.href ? 'primary.20' : 'transparent'}
              px={3}
              py={2}
              borderRadius="md"
              _hover={{ bg: 'primary.20' }}
            >
              <HStack spacing={2}>
                <Icon icon={resource.icon} />
                <Text>{resource.name}</Text>
              </HStack>
            </Box>
          ))}
        </HStack>
        <HStack spacing={4}>
          <Box
            as="button"
            onClick={handleLogout}
            px={3}
            py={2}
            borderRadius="md"
            _hover={{ bg: 'primary.20' }}
          >
            <HStack spacing={2}>
              <Icon icon="Logout" />
              <Text>Logout</Text>
            </HStack>
          </Box>
        </HStack>
      </HStack>
    </Box>
  );
};

export default Navigation; 