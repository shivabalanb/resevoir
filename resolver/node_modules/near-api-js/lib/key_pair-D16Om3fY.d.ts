import { KeyPair, KeyPairEd25519, KeyPairString, KeyType, PublicKey, Signature } from '@near-js/crypto';

type Arrayish = string | ArrayLike<number>;

type key_pair_Arrayish = Arrayish;
declare const key_pair_KeyPair: typeof KeyPair;
declare const key_pair_KeyPairEd25519: typeof KeyPairEd25519;
declare const key_pair_KeyPairString: typeof KeyPairString;
declare const key_pair_KeyType: typeof KeyType;
declare const key_pair_PublicKey: typeof PublicKey;
declare const key_pair_Signature: typeof Signature;
declare namespace key_pair {
  export { type key_pair_Arrayish as Arrayish, key_pair_KeyPair as KeyPair, key_pair_KeyPairEd25519 as KeyPairEd25519, key_pair_KeyPairString as KeyPairString, key_pair_KeyType as KeyType, key_pair_PublicKey as PublicKey, key_pair_Signature as Signature };
}

export { type Arrayish as A, key_pair as k };
