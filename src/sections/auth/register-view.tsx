import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function RegisterView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date_Birth: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = useCallback(async () => {
    try {
      setError('');
      
      if (!formData.name || !formData.email || !formData.date_Birth || !formData.password) {
        setError('All fields are required');
        return;
      }

      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          date_Birth: formData.date_Birth,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      router.push('/sign-in');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration error');
    }
  }, [formData, router]);

  return (
    <>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4">Create Account</Typography>
        <Typography color="text.secondary">
          Already have an account?{' '}
          <Button onClick={() => router.push('/sign-in')} size="small">
            Sign in
          </Button>
        </Typography>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Date of Birth"
          name="date_Birth"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.date_Birth}
          onChange={handleChange}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleRegister}
        >
          Register
        </Button>
      </Box>
    </>
  );
}