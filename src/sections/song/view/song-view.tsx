import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { PostItem } from '../post-item';
import { PostSort } from '../post-sort';
import { PostSearch } from '../post-search';

import type { IPostItem } from '../post-item';

// ----------------------------------------------------------------------

// Tipo para la respuesta de la API
type ApiSong = {
  cover: string;
  code: string;
  reproductions: {
    low: number;
    high: number;
  };
  name: string;
  producer: string;
  writer: string;
  bpm: {
    low: number;
    high: number;
  };
  likes: {
    low: number;
    high: number;
  };
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: ApiSong[];
  count: number;
};

export function SongView() {
  const [sortBy, setSortBy] = useState('latest');
  const [posts, setPosts] = useState<IPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  // Función para convertir datos de la API al formato del componente
  const transformApiDataToPostItem = (apiSong: ApiSong): IPostItem => ({
    id: apiSong.code,
    title: apiSong.name,
    coverUrl: `/image/${apiSong.name}.png`,
    totalViews: apiSong.reproductions.low,
    description: `Produced by ${apiSong.producer}`,
    totalShares: Math.floor(apiSong.likes.low / 10), // Simulamos shares como 1/10 de los likes
    totalComments: Math.floor(apiSong.likes.low / 100), // Simulamos comentarios como 1/100 de los likes
    totalFavorites: apiSong.likes.low,
    postedAt: new Date().toISOString(), // Fecha actual como placeholder
    author: {
      name: apiSong.writer,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiSong.writer)}&background=random`
    }
  });

  // Función para hacer la petición a la API
  const fetchSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Petición a tu API real
      const apiUrl = 'http://localhost:3000/api/songs/user/fernando@example.com';
      console.log('Haciendo petición a:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Status de respuesta:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.log('Response text:', responseText);
        throw new Error('La respuesta no es JSON válido. Recibido: ' + responseText.substring(0, 100));
      }
      
      const data: ApiResponse = await response.json();
      console.log('Datos recibidos:', data);
      
      if (data.success && data.data) {
        const transformedPosts = data.data.map(transformApiDataToPostItem);
        setPosts(transformedPosts);
      } else {
        throw new Error(data.message || 'Error al obtener las canciones');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchSongs();
  }, []);

  // Mostrar loading
  if (loading) {
    return (
      <DashboardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400
          }}
        >
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <DashboardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
            gap: 2
          }}
        >
          <Typography variant="h6" color="error">
            Error al cargar las canciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
          <Button variant="contained" onClick={fetchSongs}>
            Reintentar
          </Button>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          TUS CANCIONES ({posts.length})
        </Typography>
        
      </Box>

      <Grid container spacing={3}>
        {posts.map((post, index) => {
          const latestPostLarge = index === 0;
          const latestPost = index === 1 || index === 2;

          return (
            <Grid
              key={post.id}
              size={{
                xs: 12,
                sm: latestPostLarge ? 12 : 6,
                md: latestPostLarge ? 6 : 3,
              }}
            >
              <PostItem post={post} latestPost={latestPost} latestPostLarge={latestPostLarge} />
            </Grid>
          );
        })}
      </Grid>

      {posts.length === 0 && !loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No se encontraron canciones
          </Typography>
        </Box>
      )}
    </DashboardContent>
  );
}