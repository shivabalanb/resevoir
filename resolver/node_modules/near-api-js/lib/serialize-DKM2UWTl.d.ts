import { Schema, deserialize, serialize as serialize$1 } from 'borsh';
import { baseDecode, baseEncode } from '@near-js/utils';

declare const serialize_Schema: typeof Schema;
declare const serialize_deserialize: typeof deserialize;
declare namespace serialize {
  export { serialize_Schema as Schema, baseDecode as base_decode, baseEncode as base_encode, serialize_deserialize as deserialize, serialize$1 as serialize };
}

export { serialize as s };
