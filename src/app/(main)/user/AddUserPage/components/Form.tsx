import React from 'react';
import { User } from '@/types/user';
import { AddForm } from './AddForm';
import { EditForm } from './EditForm';

export const Form = ({
  isEditMode,
  selectedUser,
}: {
  isEditMode: boolean;
  selectedUser: User | null;
}) => {
  if (isEditMode && selectedUser) {
    return <EditForm selectedUser={selectedUser} />;
  }

  return <AddForm />;
};
