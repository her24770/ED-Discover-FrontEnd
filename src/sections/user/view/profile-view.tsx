// 1. External utilities
import { varAlpha } from 'minimal-shared/utils';

// 2. MUI imports (submodules y components)
import { useTheme } from '@mui/material/styles';
import { Box, Card, Grid, Typography, List, ListItem, ListItemText, Avatar, Chip } from '@mui/material';

// 3. Internal src imports (según configuración de grupos)
import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { SvgColor } from 'src/components/svg-color';


// ----------------------------------------------------------------------

type PaletteColorKey = 'primary' | 'secondary' | 'warning' | 'error' | 'info' | 'success';

type ListItem = {
  id: string;
  name: string;
  description?: string;
  status?: string;
  avatar?: string;
};

type CardData = {
  title: string;
  color?: PaletteColorKey;
  icon: React.ReactNode;
  items: ListItem[];
};

// Componente individual de la card
function ListCard({ title, color = 'primary', icon, items }: CardData) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: 'none',
        position: 'relative',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        backgroundImage: `linear-gradient(135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)})`,
        minHeight: 320,
      }}
    >
      {/* Header con icono y título */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ width: 48, height: 48, mr: 2 }}>{icon}</Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>

      {/* Lista de elementos */}
      <List sx={{ p: 0 }}>
        {items.slice(0, 5).map((item) => (
          <ListItem
            key={item.id}
            sx={{
              px: 0,
              py: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': {
                borderBottom: 'none',
              }
            }}
          >
            {item.avatar && (
              <Avatar
                src={item.avatar}
                sx={{ width: 32, height: 32, mr: 2 }}
              />
            )}
            <ListItemText
              primary={
                <Typography variant="subtitle2" noWrap>
                  {item.name}
                </Typography>
              }
              secondary={
                item.description && (
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {item.description}
                  </Typography>
                )
              }
            />
            {item.status && (
              <Chip
                label={item.status}
                size="small"
                color={item.status === 'Active' ? 'success' : 'default'}
                sx={{ ml: 1 }}
              />
            )}
          </ListItem>
        ))}
      </List>

      {/* Elemento decorativo de fondo */}
      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: 'absolute',
          color: `${color}.main`,
        }}
      />
    </Card>
  );
}

export function ProfileView() {
  // Datos de ejemplo para las 4 cards
  const cardsData: CardData[] = [
    {
      title: "Recent Users",
      color: "primary",
      icon: <img alt="Users" src="/assets/icons/glass/ic-glass-users.svg" />,
      items: [
        { id: '1', name: 'Juan Pérez', description: 'Frontend Developer', status: 'Active', avatar: '/assets/images/avatar/avatar-1.jpg' },
        { id: '2', name: 'María González', description: 'UX Designer', status: 'Active', avatar: '/assets/images/avatar/avatar-2.jpg' },
        { id: '3', name: 'Carlos López', description: 'Backend Developer', status: 'Inactive', avatar: '/assets/images/avatar/avatar-3.jpg' },
        { id: '4', name: 'Ana Martínez', description: 'Project Manager', status: 'Active', avatar: '/assets/images/avatar/avatar-4.jpg' },
        { id: '5', name: 'Luis Rodríguez', description: 'DevOps Engineer', status: 'Active', avatar: '/assets/images/avatar/avatar-5.jpg' },
      ]
    },
    {
      title: "Latest Orders",
      color: "secondary",
      icon: <img alt="Orders" src="/assets/icons/glass/ic-glass-buy.svg" />,
      items: [
        { id: '1', name: 'Order #1234', description: 'MacBook Pro 16"', status: 'Completed' },
        { id: '2', name: 'Order #1235', description: 'iPhone 15 Pro', status: 'Processing' },
        { id: '3', name: 'Order #1236', description: 'iPad Air', status: 'Shipped' },
        { id: '4', name: 'Order #1237', description: 'AirPods Pro', status: 'Completed' },
        { id: '5', name: 'Order #1238', description: 'Apple Watch', status: 'Pending' },
      ]
    },
    {
      title: "Top Products",
      color: "warning",
      icon: <img alt="Products" src="/assets/icons/glass/ic-glass-bag.svg" />,
      items: [
        { id: '1', name: 'MacBook Pro', description: '15 units sold this week' },
        { id: '2', name: 'iPhone 15', description: '23 units sold this week' },
        { id: '3', name: 'iPad Pro', description: '8 units sold this week' },
        { id: '4', name: 'AirPods', description: '31 units sold this week' },
        { id: '5', name: 'Apple Watch', description: '12 units sold this week' },
      ]
    },
    {
      title: "Messages",
      color: "error",
      icon: <img alt="Messages" src="/assets/icons/glass/ic-glass-message.svg" />,
      items: [
        { id: '1', name: 'Welcome new user!', description: 'System notification' },
        { id: '2', name: 'Order confirmation', description: 'Payment received' },
        { id: '3', name: 'Shipping update', description: 'Package in transit' },
        { id: '4', name: 'Review request', description: 'Rate your purchase' },
        { id: '5', name: 'Newsletter', description: 'Weekly updates' },
      ]
    }
  ];

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Profile Dashboard
      </Typography>
    
      <Grid container spacing={3}>
        {cardsData.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <ListCard
              title={card.title}
              color={card.color}
              icon={card.icon}
              items={card.items}
            />
          </Grid>
        ))}
      </Grid>
    </DashboardContent>
  );
}