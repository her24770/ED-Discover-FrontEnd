import type { CardProps } from '@mui/material/Card';
import type { IconifyName } from 'src/components/iconify';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

export type IPostItem = {
  id: string;
  title: string;
  coverUrl: string;
  totalViews: number;
  description: string;
  totalShares: number;
  totalComments: number;
  totalFavorites: number;
  postedAt: string | number | null;
  author: {
    name: string;
    avatarUrl: string;
  };
  youtubeCover?: string; // Campo agregado para el enlace de YouTube
};

export function PostItem({
  sx,
  post,
  latestPost,
  latestPostLarge,
  onPlayVideo,
  ...other
}: CardProps & {
  post: IPostItem;
  latestPost: boolean;
  latestPostLarge: boolean;
  onPlayVideo?: () => void;
}) {
  
  // Función para enviar el peso de la canción
  const sendSongWeight = async () => {
    try {
      const email = localStorage.getItem('email');
      
      if (!email) {
        console.error('Email no encontrado en localStorage');
        return;
      }

      const response = await fetch('http://localhost:3000/api/users/song-weight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: post.title
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Song weight enviado exitosamente:', result);
      
    } catch (error) {
      console.error('Error enviando song weight:', error);
    }
  };

  // Función que combina ambas acciones
  const handlePlayClick = async () => {
    // Ejecutar la petición POST
    await sendSongWeight();
    
    // Ejecutar la función original de cambiar video
    if (onPlayVideo) {
      onPlayVideo();
    }
  };
  const renderAvatar = (
    <Avatar
      alt={post.author.name}
      src={post.author.avatarUrl}
      sx={{
        left: 24,
        zIndex: 9,
        bottom: -24,
        position: 'absolute',
        ...((latestPostLarge || latestPost) && {
          top: 24,
        }),
      }}
    />
  );

  const renderPlayButton = onPlayVideo ? (
    <Tooltip title="Reproducir video">
      <IconButton
        onClick={handlePlayClick}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          borderRadius: '8px',
          padding: '6px 12px',
          minWidth: 'auto',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
        >
        VER VIDEO
        </IconButton>
    </Tooltip>
  ) : null;

  const renderTitle = (
    <Link
      color="inherit"
      variant="subtitle2"
      underline="hover"
      sx={{
        height: 44,
        overflow: 'hidden',
        WebkitLineClamp: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        ...(latestPostLarge && { typography: 'h5', height: 60 }),
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
        }),
      }}
    >
      {post.title}
    </Link>
  );

  const renderInfo = (
    null
  );

  const renderCover = (
    <Box
      component="img"
      alt={post.title}
      src={post.coverUrl}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
      onError={(e) => {
        // Fallback image si no carga la imagen
        (e.target as HTMLImageElement).src = '/assets/images/covers/cover_1.jpg';
      }}
    />
  );

  const renderDate = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...((latestPostLarge || latestPost) && {
          opacity: 0.48,
          color: 'common.white',
        }),
      }}
    >
      {fDate(post.postedAt)}
    </Typography>
  );

  const renderDescription = (
    <Typography
      variant="body2"
      sx={{
        mt: 1,
        mb: 1,
        color: 'text.secondary',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
          opacity: 0.8,
        }),
      }}
    >
      {post.description}
    </Typography>
  );

  const renderShape = (
    <SvgColor
      src="/assets/icons/shape-avatar.svg"
      sx={{
        left: 0,
        width: 88,
        zIndex: 9,
        height: 36,
        bottom: -16,
        position: 'absolute',
        color: 'background.paper',
        ...((latestPostLarge || latestPost) && { display: 'none' }),
      }}
    />
  );

  return (
    <Card 
      sx={{
        ...sx,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }} 
      {...other}
    >
      <Box
        sx={(theme) => ({
          position: 'relative',
          pt: 'calc(100% * 3 / 4)',
          ...((latestPostLarge || latestPost) && {
            pt: 'calc(100% * 4 / 3)',
            '&:after': {
              top: 0,
              content: "''",
              width: '100%',
              height: '100%',
              position: 'absolute',
              bgcolor: varAlpha(theme.palette.grey['900Channel'], 0.72),
            },
          }),
          ...(latestPostLarge && {
            pt: {
              xs: 'calc(100% * 4 / 3)',
              sm: 'calc(100% * 3 / 4.66)',
            },
          }),
        })}
      >
        {renderShape}
        {renderAvatar}
        {renderCover}
        {/* Botón de reproducir video */}
        {renderPlayButton}
      </Box>

      <Box
        sx={(theme) => ({
          p: theme.spacing(6, 3, 3, 3),
          ...((latestPostLarge || latestPost) && {
            width: 1,
            bottom: 0,
            position: 'absolute',
          }),
        })}
      >
        {/*renderDate*/}
        {renderTitle}
        {renderDescription}
        {renderInfo}
      </Box>
    </Card>
  );
}