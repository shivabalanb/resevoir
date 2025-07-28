import { ChangedValidatorInfo, EpochValidatorsDiff, diffEpochValidators, findSeatPrice } from '@near-js/utils';

declare const validators_ChangedValidatorInfo: typeof ChangedValidatorInfo;
declare const validators_EpochValidatorsDiff: typeof EpochValidatorsDiff;
declare const validators_diffEpochValidators: typeof diffEpochValidators;
declare const validators_findSeatPrice: typeof findSeatPrice;
declare namespace validators {
  export { validators_ChangedValidatorInfo as ChangedValidatorInfo, validators_EpochValidatorsDiff as EpochValidatorsDiff, validators_diffEpochValidators as diffEpochValidators, validators_findSeatPrice as findSeatPrice };
}

export { validators as v };
