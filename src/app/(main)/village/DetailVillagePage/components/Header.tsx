import { CustomBreadcrumbs } from '@/components';
import { BreadcrumbItem } from '@/types/common';
import { VillageData } from '@/types/village';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { CaretLeftIcon } from '@phosphor-icons/react';
import { getRegencyName } from '../../helper';
import {
  PROVINCE_NAME,
  VillageCategory,
  VillageCategoryLabel,
} from '../../constants';
import { TrashIcon } from '@phosphor-icons/react/dist/ssr';
import { EditIcon } from 'lucide-react';

export const Header = ({
  breadcrumbs,
  villageData,
  handleBack,
  handleDelete,
  handleEdit,
}: {
  breadcrumbs: BreadcrumbItem[];
  villageData: VillageData;
  handleBack: () => void;
  handleDelete: () => void;
  handleEdit: () => void;
}) => {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <CustomBreadcrumbs breadcrumbs={breadcrumbs} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <IconButton
            onClick={handleBack}
            sx={{
              border: '1px solid #0092D1',
              borderRadius: '12px',
              width: 48,
              height: 48,
              color: '#0092D1',
            }}
          >
            <CaretLeftIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#374151',
            }}
          >
            {villageData.villageName}
          </Typography>
          <Box
            sx={{
              backgroundColor: '#E0F2FE',
              color: 'primary.main',
              px: 2,
              py: 0.5,
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {villageData.villageCategory.name === VillageCategory.Category2
              ? VillageCategoryLabel.Category2
              : VillageCategoryLabel.Category1}
          </Box>
        </Box>
      </Box>

      {/* Village Info */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          mb: 4,
          px: 2,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Area ID
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {villageData.villageCode}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Province
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {PROVINCE_NAME}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Regency
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {getRegencyName(
              villageData.villageCode.split('.').slice(0, 2).join('.')
            )}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Coordinate
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {villageData.villageLat.toFixed(6)},{' '}
            {villageData.villageLng.toFixed(6)}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          mb: 4,
          px: 2,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Land Managed Start
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {villageData.landManageStart} Ha
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Land Managed End
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {villageData.landManageEnd} Ha
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Carbon Emissions Start (Ton)
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {villageData.carbonEmisionStart || '-'}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Carbon Emissions End (Ton)
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {villageData.carbonEmisionEnd || '-'}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          mb: 4,
          px: 2,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            SRN Status
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {villageData.srnStatus || '-'}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Potency
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {villageData.potency || '-'}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Climate Issues
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {villageData.climateIssue || '-'}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
          >
            Source Of Economy
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
          >
            {villageData.mainSourceOfEconomy || '-'}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          mb: 4,
          px: 2,
        }}
      >
        {villageData.villageCategory.name === VillageCategory.Category1 ? (
          <>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
              >
                Income Start
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
              >
                {villageData.incomesStart || '-'}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
              >
                Income End
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
              >
                {villageData.incomesEnd || '-'}
              </Typography>
            </Box>
          </>
        ) : (
          <Box>
            <Typography
              variant="body2"
              sx={{ color: '#6B7280', fontSize: '13px', mb: 0.5 }}
            >
              Seed Capital
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#1F2937', fontWeight: 600, fontSize: '16px' }}
            >
              {villageData.seedCapital || '-'}
            </Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mb: 4,
          px: 2,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          startIcon={<TrashIcon />}
          onClick={handleDelete}
          sx={{
            borderRadius: '12px',
            width: '180px',
            minHeight: '50px',
            px: 3,
          }}
        >
          Delete Village
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleEdit}
          sx={{
            borderRadius: '12px',
            width: '180px',
            minHeight: '50px',
            px: 3,
          }}
        >
          Edit Village
        </Button>
      </Box>
    </Box>
  );
};
