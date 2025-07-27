use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{AccountId, NearToken, Timestamp};

#[derive(BorshDeserialize, BorshSerialize, Clone)]
pub struct Lock {
    pub user_id: AccountId,
    pub resolver_id: AccountId,
    pub amount: NearToken,
    pub hashlock: Vec<u8>,
    pub expiration: Timestamp,
    pub claimed: bool,
}
