import { Enum } from '@near-js/types';

declare const enums_Enum: typeof Enum;
declare namespace enums {
  export { enums_Enum as Enum };
}

export { enums as e };
