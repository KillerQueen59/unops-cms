'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useUserStore } from '@/stores/userStore';

export const Content = () => {
  const { selectedUser, userHistory } = useUserStore();

  if (!selectedUser) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* User Information */}
      <Box sx={{ flex: 1 }}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <PersonIcon color="primary" />
              User Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1">{selectedUser.name}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <EmailIcon fontSize="small" />
                {selectedUser.email}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1">{selectedUser.role}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1">{selectedUser.status}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Last Login
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <ScheduleIcon fontSize="small" />
                {formatDate(selectedUser.lastLogin)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Created
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <CalendarIcon fontSize="small" />
                {formatDate(selectedUser.createdAt)} by {selectedUser.createdBy}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Last Modified
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <CalendarIcon fontSize="small" />
                {formatDate(selectedUser.lastModified)} by{' '}
                {selectedUser.modifiedBy}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Activity History */}
      <Box sx={{ flex: 1 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Activity History
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {userHistory && userHistory.length > 0 ? (
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {userHistory.map((log) => (
                  <ListItem key={log.id} sx={{ px: 0 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        mr: 2,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <ListItemText
                      primary={log.action}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {log.details}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(log.performedAt)} by {log.performedBy}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 4 }}
              >
                No activity history available
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
