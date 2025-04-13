import { SetMetadata } from '@nestjs/common';

export const OWNERSHIP_CHECK = 'ownership:check';

export interface OwnershipOptions {
  param: string; // Route-param som inneholder ID
  model: string; // Prisma model-navn
  property: string; // Felt i modellen som peker til eier
}

export const Ownership = (options: OwnershipOptions) =>
  SetMetadata(OWNERSHIP_CHECK, options);
