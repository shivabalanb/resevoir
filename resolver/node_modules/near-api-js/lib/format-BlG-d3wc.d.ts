import { NEAR_NOMINATION, NEAR_NOMINATION_EXP, formatNearAmount, parseNearAmount } from '@near-js/utils';

declare const format_NEAR_NOMINATION: typeof NEAR_NOMINATION;
declare const format_NEAR_NOMINATION_EXP: typeof NEAR_NOMINATION_EXP;
declare const format_formatNearAmount: typeof formatNearAmount;
declare const format_parseNearAmount: typeof parseNearAmount;
declare namespace format {
  export { format_NEAR_NOMINATION as NEAR_NOMINATION, format_NEAR_NOMINATION_EXP as NEAR_NOMINATION_EXP, format_formatNearAmount as formatNearAmount, format_parseNearAmount as parseNearAmount };
}

export { format as f };
