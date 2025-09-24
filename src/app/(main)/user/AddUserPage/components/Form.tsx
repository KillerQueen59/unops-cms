import React from 'react';
import { User } from '@/types/user';
import { Role } from '@/types/role';
import { AddForm } from './AddForm';
import { EditForm } from './EditForm';

interface FormProps {
  isEditMode: boolean;
  selectedUser: User | null;
  roles: Role[];
  rolesLoading: boolean;
}

export const Form = ({
  isEditMode,
  selectedUser,
  roles,
  rolesLoading,
}: FormProps) => {
  if (isEditMode && selectedUser) {
    return (
      <EditForm
        selectedUser={selectedUser}
        roles={roles}
        rolesLoading={rolesLoading}
      />
    );
  }

  return <AddForm roles={roles} rolesLoading={rolesLoading} />;
};
