import { Male, Female } from '@mui/icons-material';
import { Card, CardContent, Box, Typography } from '@mui/material';

interface ParticipantCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  title,
  count,
  icon,
  color,
}) => {
  return (
    <Card
      sx={{
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        boxShadow: 'none',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3, display: 'flex' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '100px',
              backgroundColor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1F2937',
              fontSize: '16px',
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'secondary.main',
                fontSize: '32px',
              }}
            >
              {count}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
