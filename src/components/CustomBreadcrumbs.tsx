import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BreadcrumbItem } from '@/stores/trainingStore';

interface BreadcrumbsProps {
  sx?: object;
  breadcrumbs: BreadcrumbItem[];
}

export const CustomBreadcrumbs: React.FC<BreadcrumbsProps> = ({
  sx,
  breadcrumbs,
}) => {
  const renderBreadcrumbItem = (item: BreadcrumbItem, index: number) => {
    if (item.isActive) {
      return (
        <Typography key={index} sx={{ color: 'text.primary', fontWeight: 500 }}>
          {item.label}
        </Typography>
      );
    }

    return (
      <Link
        key={index}
        underline="hover"
        color="inherit"
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          if (item.onClick) {
            item.onClick();
          }
        }}
        sx={{
          cursor: 'pointer',
          color: 'primary.main',
        }}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <Breadcrumbs
      separator={
        <NavigateNextIcon fontSize="small" sx={{ color: 'primary.main' }} />
      }
      aria-label="breadcrumb"
      sx={sx}
    >
      {breadcrumbs.map(renderBreadcrumbItem)}
    </Breadcrumbs>
  );
};
