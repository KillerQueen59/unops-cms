import { z } from 'zod';
import { numericString } from './commonForm';

export const trainingFormSchema = z.object({
  // Detail Training
  trainingName: z.string().min(1, 'Training name is required'),
  trainingType: z.string().min(1, 'Training type is required'),
  date: z.string().min(1, 'Training date is required'),
  village: z.string().min(1, 'Village is required'),
  villageId: z.string().min(1, 'Village ID is required'),

  // Number of beneficiaries
  male: numericString('Number of male beneficiaries is required'),
  female: numericString('Number of female beneficiaries is required'),
  elderly: numericString('Number of elderly is required'),
  youth: numericString('Number of youth is required'),
  disability: numericString('Number of people with disabilities is required'),
  widow: numericString('Number of widows is required'),

  // Training Assessment (scores should be 0-100)
  pretest: numericString('Pre-test score is required'),
  posttest: numericString('Post-test score is required'),

  // Stakeholders Involved
  ngo: numericString('Number of NGOs is required'),
  government: numericString('Number of government stakeholders is required'),
  privateSector: numericString(
    'Number of private sector stakeholders is required'
  ),
  academics: numericString('Number of academics is required'),
  localCommunity: numericString(
    'Number of local community stakeholders is required'
  ),
  others: numericString('Number of other stakeholders is required'),
});

export type TrainingFormData = z.infer<typeof trainingFormSchema>;
