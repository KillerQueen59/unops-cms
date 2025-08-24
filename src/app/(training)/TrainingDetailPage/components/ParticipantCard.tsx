import { Male, Female } from '@mui/icons-material';
import { Card, CardContent, Box, Typography } from '@mui/material';

interface ParticipantCardProps {
  title: string;
  maleCount: number;
  femaleCount: number;
  icon: React.ReactNode;
  color: string;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  title,
  maleCount,
  femaleCount,
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
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
            <Male sx={{ color: '#3B82F6', fontSize: 20 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#1F2937',
                fontSize: '24px',
              }}
            >
              {maleCount}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Female sx={{ color: '#EC4899', fontSize: 20 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#1F2937',
                fontSize: '24px',
              }}
            >
              {femaleCount}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
