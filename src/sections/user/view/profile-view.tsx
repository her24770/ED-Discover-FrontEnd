import { useEffect, useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

// 2. MUI imports (submodules y components)
import { useTheme } from '@mui/material/styles';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import {TimelineSeparator,TimelineContent,Timeline,TimelineDot,TimelineConnector} from '@mui/lab';
import { Box, Card, Grid, Typography, List, ListItem, ListItemText, Avatar, Chip, CardHeader } from '@mui/material';
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
  const emailLogin = localStorage.getItem("email");


  // 1. Estado para guardar SOLO el array data del JSON
  const [genderList, setGenderList] = useState<
    Array<{
      genre: string;
      description: string;
      strength: number;
    }>
  >([]); // Inicializado como array vacío

  const [artistList, setrArtistList] = useState<
    Array<{
      name: string;
      biography: string;
    }>
  >([]); // Inicializado como array vacío

  const [emotionList, setrEmotionList] = useState<
    Array<{
      feeling: string;
      danceable: boolean;
    }>
  >([]); // Inicializado como array vacío

  const [albumList, setrAlbumList] = useState<
    Array<{
      name: string;
      likes: number;
    }>
  >([]); // Inicializado como array vacío

  // 2. Función que obtiene y guarda solo la parte data
  const fetchGenderList = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/topgender/'+emailLogin);
      const { data } = await response.json(); // Destructuración para obtener solo data
      setGenderList(data || []); // Guarda solo el array data
    } catch (error) {
      console.error("Error fetching gender list:", error);
      setGenderList([]); // En caso de error, array vacío
    }
  };

  const fetchArtistList = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/topartists/'+emailLogin);
      const { data } = await response.json(); // Destructuración para obtener solo data
      setrArtistList(data || []); // Guarda solo el array data
    } catch (error) {
      console.error("Error fetching artist list:", error);
      setrArtistList([]); // En caso de error, array vacío
    }
  };

  const fetchEmotionList = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/topemotions/'+emailLogin);
      const { data } = await response.json(); // Destructuración para obtener solo data
      setrEmotionList(data || []); // Guarda solo el array data
    } catch (error) {
      console.error("Error fetching artist list:", error);
      setrEmotionList([]); // En caso de error, array vacío
    }
  };

  const fetchAlbumList = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/topalbums/'+emailLogin);
      const { data } = await response.json(); // Destructuración para obtener solo data
      setrAlbumList(data || []); // Guarda solo el array data
    } catch (error) {
      console.error("Error fetching artist list:", error);
      setrAlbumList([]); // En caso de error, array vacío
    }
  };

  // 3. Ejecutar al cargar el componente
  useEffect(() => {
    fetchGenderList();
    fetchArtistList();
    fetchEmotionList();
    fetchAlbumList();
  }, []);

   useEffect(() => {
    if (genderList.length > 0) {
      console.log("Estado actualizado:", genderList);
    }
  }, [genderList]); // Dependencia del efecto



  
  // Datos de ejemplo para las 4 cards
  const cardsData: CardData[] = [
    {
      title: "TUS ARTISTAS",
      color: "primary",
      icon: <img alt="Users" src="/assets/icons/glass/ic-glass-users.svg" />,
      items: [
        { id: '1', name: artistList[0]?.name, description: artistList[0]?.biography, status: 'Buena vibra', avatar: '/assets/images/avatar/avatar-1.jpg' },
        { id: '2', name: artistList[1]?.name, description: artistList[1]?.biography, status: 'Excelente', avatar: '/assets/images/avatar/avatar-2.jpg' },
        { id: '3', name: artistList[2]?.name, description: artistList[2]?.biography, status: 'Me gusta', avatar: '/assets/images/avatar/avatar-3.jpg' },
        { id: '4', name: artistList[3]?.name, description: artistList[3]?.biography, status: 'Contagioso', avatar: '/assets/images/avatar/avatar-4.jpg' },
        { id: '5', name: artistList[4]?.name, description: artistList[4]?.biography, status: 'Glorioso', avatar: '/assets/images/avatar/avatar-5.jpg' },
      ]
    },
    {
      title: "GENERO",
      color: "secondary",
      icon: <img alt="Users" src="/assets/icons/glass/ic-glass-users.svg" />,
      items: [
        { id: '1', name: genderList[0]?.genre, description: genderList[0]?.description , status: 'Me encanta' },
        { id: '2', name: genderList[1]?.genre, description: genderList[1]?.description, status: 'Me identifico' },
        { id: '3', name: genderList[2]?.genre, description: genderList[2]?.description, status: 'Siempre escucho' },
        { id: '4', name: genderList[3]?.genre, description: genderList[3]?.description, status: 'Gran genero' },
        { id: '5', name: genderList[4]?.genre, description: genderList[4]?.description, status: 'Top' },
      ]
    },
    {
      title: "EMOCIONES",
      color: "warning",
      icon: <img alt="Users" src="/assets/icons/glass/ic-glass-users.svg" />,
      items: [
        { id: '1', name: emotionList[0]?.feeling, description: emotionList[0]?.danceable ? 'Bailable'+emotionList[0]?.danceable : ' ', status: 'Me gusta' },
        { id: '2', name: emotionList[1]?.feeling, description: emotionList[1]?.danceable ? 'Bailable'+emotionList[1]?.danceable : ' ',status: 'Me encanta'  },
        { id: '3', name: emotionList[2]?.feeling, description: emotionList[2]?.danceable ? 'Bailable'+emotionList[2]?.danceable : ' ',status: 'La adoro' },
        { id: '4', name: emotionList[3]?.feeling, description: emotionList[3]?.danceable ? 'Bailable'+emotionList[3]?.danceable : ' ',status: 'Repitanla' },
        { id: '5', name: emotionList[4]?.feeling, description: emotionList[4]?.danceable ? 'Bailable'+emotionList[4]?.danceable : ' ',status: 'cuidado'  },
      ]
    },
    {
      title: "ALBUMS",
      color: "error",
      icon: <img alt="Users" src="/assets/icons/glass/ic-glass-users.svg" />,
      items: [
        { id: '1', name: albumList[0]?.name, description: albumList[0]?.likes !== null ? ' ' :  String(albumList[0]?.likes)  ,status: 'Lo mejor'  },
        { id: '2', name: albumList[1]?.name, description: albumList[1]?.likes !== null ? ' ' :  String(albumList[1]?.likes),status: 'Top global'  },
        { id: '3', name: albumList[2]?.name, description: albumList[2]?.likes !== null ? ' ' :  String(albumList[2]?.likes),status: 'WooW'  },
        { id: '4', name: albumList[3]?.name, description: albumList[3]?.likes !== null ? ' ' :  String(albumList[3]?.likes),status: 'Repitanla'   },
        { id: '5', name: albumList[4]?.name, description: albumList[4]?.likes !== null ? ' ' :  String(albumList[4]?.likes),status: 'jiji'   },
      ]
    }
  ];



const [timelineData, setTimelineData] = useState<
    { title: string; time: string; type: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/users/friends/'+emailLogin);
        const data = await res.json();

        // Si la respuesta está anidada en `.data`
        const users = data.data ?? data; // por si acaso viene directo

        const transformed = users.map((user: any, index: number) => {
          const { year, month, day } = user.date_Birth;
          const dateStr = `${year.low}-${String(month.low).padStart(2, '0')}-${String(day.low).padStart(2, '0')}T00:00:00`;

          return {
            title: `${user.name} - ${user.email}`,
            time: dateStr,
            type: `order${(index % 4) + 1}`,
          };
        });

        setTimelineData(transformed);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        TUS INTERESES
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

      <Card>
      <CardHeader title="AMISTADES" subheader="Compartiendo intereses" />

      <Timeline
        sx={{ m: 0, p: 3, [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 } }}
      >
        {timelineData.map((item, index) => (
          <TimelineItem key={`${item.title}-${index}`}>
            <TimelineSeparator>
              <TimelineDot
                color={
                  (item.type === 'order1' && 'primary') ||
                  (item.type === 'order2' && 'success') ||
                  (item.type === 'order3' && 'info') ||
                  (item.type === 'order4' && 'warning') ||
                  'error'
                }
              />
              {index !== timelineData.length - 1 && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Typography variant="subtitle2">{item.title}</Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {new Date(item.time).toLocaleString()}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Card>
    </DashboardContent>
  );
}