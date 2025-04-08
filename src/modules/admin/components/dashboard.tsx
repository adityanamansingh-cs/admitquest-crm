import React from 'react';
import { Box, H2, Text, Icon, Button } from '@adminjs/design-system';
import { useTranslation } from 'adminjs';

interface Card {
  title: string;
  description: string;
  icon: string;
}

interface DashboardProps {
  welcomeMessage?: string;
  subtitle?: string;
  cards?: Card[];
}

const Dashboard = (props: DashboardProps) => {
  const { 
    welcomeMessage = 'Welcome to AdmitQuest AI', 
    subtitle = 'Your comprehensive education management platform',
    cards = []
  } = props;
  const { translateMessage } = useTranslation();

  return (
    <Box>
      <Box position="relative" overflow="hidden" className="dashboard-hero">
        <Box bg="grey100" p="xl" position="relative" zIndex={2} className="dashboard-content">
          <Box className="dashboard-header" mb="xxl">
            <H2 mb="lg" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{translateMessage(welcomeMessage)}</H2>
            <Text mb="xl" fontSize="lg" color="white">{translateMessage(subtitle)}</Text>
            <Button as="a" href="https://docs.admitquest.ai" target="_blank" variant="primary">
              <Icon icon="BookOpen" mr="sm" />
              View Documentation
            </Button>
          </Box>
          
          <Box 
            className="card-grid"
            mt="xxl"
          >
            {cards.map((card: any, index: number) => (
              <Box 
                key={index}
                className="welcome-card"
                position="relative"
              >
                <Box className="card-icon-wrapper">
                  <Icon icon={card.icon} size={32} />
                </Box>
                <H2 mt="lg" mb="md">{translateMessage(card.title)}</H2>
                <Text>{translateMessage(card.description)}</Text>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Decorative Elements */}
        <Box 
          position="absolute" 
          top={0} 
          right={0}
          width="100%"
          height="100%"
          zIndex={1}
          className="dashboard-bg"
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
            <circle cx="20%" cy="30%" r="200" fill="rgba(251, 40, 61, 0.05)" />
            <circle cx="70%" cy="60%" r="150" fill="rgba(251, 40, 61, 0.03)" />
          </svg>
          
          <img 
            src="/assets/logo.svg" 
            alt="Logo" 
            style={{ 
              position: 'absolute',
              top: '10%',
              right: '5%',
              width: '300px',
              opacity: 0.05,
              transform: 'rotate(15deg)',
              filter: 'blur(1px)'
            }} 
          />
        </Box>
      </Box>

      {/* Stats Section */}
      <Box 
        mt="xl" 
        p="lg" 
        className="stats-section"
      >
        <Box
          display="flex"
          flexDirection={['column', 'row']}
          justifyContent="space-between"
          flexWrap="wrap"
          gap="lg"
        >
          <StatsCard 
            title="Students" 
            value="3,721" 
            icon="User" 
            trend="+12%" 
            color="#FB283D" 
          />
          <StatsCard 
            title="Institutes" 
            value="157" 
            icon="School" 
            trend="+5%" 
            color="#2CD49E" 
          />
          <StatsCard 
            title="Applications" 
            value="8,492" 
            icon="FileText" 
            trend="+23%" 
            color="#FFB547" 
          />
          <StatsCard 
            title="Revenue" 
            value="₹12.4M" 
            icon="CreditCard" 
            trend="+18%" 
            color="#4285F4" 
          />
        </Box>
      </Box>
    </Box>
  );
};

const StatsCard = ({ title, value, icon, trend, color }: { title: string, value: string, icon: string, trend: string, color: string }) => (
  <Box 
    p="lg" 
    width={['100%', '100%', 'calc(25% - 16px)']}
    className="stats-card"
    style={{
      background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)`,
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center" mb="md">
      <Text fontWeight="bold" color="grey40">{title}</Text>
      <Box 
        p="sm" 
        style={{ 
          background: `rgba(${hexToRgb(color)}, 0.1)`, 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center' 
        }}
      >
        <Icon icon={icon} color={color} />
      </Box>
    </Box>
    <Box display="flex" alignItems="baseline" gap="md">
      <H2 style={{ margin: 0 }}>{value}</H2>
      <Text color={trend.startsWith('+') ? '#2CD49E' : '#EA462A'} fontWeight="bold">
        {trend}
      </Text>
    </Box>
  </Box>
);

// Helper function to convert hex to rgb
const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

export default Dashboard; 