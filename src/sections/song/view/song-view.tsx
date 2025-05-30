import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';

import { PostItem } from '../post-item';

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
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentSongTitle, setCurrentSongTitle] = useState<string>('');

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  // Función para extraer video ID de YouTube desde el campo cover
  const extractYouTubeVideoId = (coverUrl: string): string | null => {
    try {
      // Diferentes formatos de URL de YouTube
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/,
        /youtube\.com\/.*[?&]v=([^&\n?#]+)/
      ];

      for (const pattern of patterns) {
        const match = coverUrl.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }

      // Si no es una URL completa, asumir que es solo el ID
      if (coverUrl && !coverUrl.includes('http')) {
        return coverUrl;
      }

      return null;
    } catch (error1) {
      console.error('Error extracting YouTube video ID:', error1);
      return null;
    }
  };

  // Función para cambiar el video de YouTube
  const changeVideo = (coverUrl: string, songTitle: string) => {
    const videoId = extractYouTubeVideoId(coverUrl);
    if (videoId) {
      setCurrentVideoId(videoId);
      setCurrentSongTitle(songTitle);
    }
  };

  // Función para convertir datos de la API al formato del componente
  const transformApiDataToPostItem = (apiSong: ApiSong): IPostItem => ({
    id: apiSong.code,
    title: apiSong.name,
    coverUrl: `/image/${apiSong.name}.png`,
    totalViews: apiSong.reproductions.low,
    description: `Produced by ${apiSong.producer}`,
    totalShares: Math.floor(apiSong.likes.low / 10),
    totalComments: Math.floor(apiSong.likes.low / 100),
    totalFavorites: apiSong.likes.low,
    postedAt: new Date().toISOString(),
    author: {
      name: apiSong.writer,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiSong.writer)}&background=random`
    },
    // Agregamos el campo cover original para usar en el botón
    youtubeCover: apiSong.cover
  });

  // Función para hacer la petición a la API
  const fetchSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
        
        // Cargar el video del primer elemento automáticamente
        if (data.data.length > 0) {
          const firstSong = data.data[0];
          changeVideo(firstSong.cover, firstSong.name);
        }
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

  // Componente del video de YouTube
  const renderYouTubeVideo = () => {
    if (!currentVideoId) {
      return (
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 300,
            backgroundColor: '#f5f5f5',
            borderRadius: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Selecciona una canción para ver el video
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {currentSongTitle ? `Reproduciendo: ${currentSongTitle}` : 'Video Destacado'}
        </Typography>
        <Box
          sx={{
            position: 'relative',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${currentVideoId}?rel=0&modestbranding=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
      </Box>
    );
  };

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

      {/* Video de YouTube */}
      {renderYouTubeVideo()}

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
              <PostItem 
                post={post} 
                latestPost={latestPost} 
                latestPostLarge={latestPostLarge}
                onPlayVideo={() => changeVideo(String(post.youtubeCover), post.title)}
              />
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