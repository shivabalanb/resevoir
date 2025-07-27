use near_sdk::{env, log, near, store::LookupMap, AccountId, Promise};

use crate::models::Lock;

pub mod models;

#[near(contract_state)]
pub struct Contract {
    pub locks: LookupMap<Vec<u8>, Lock>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            locks: LookupMap::new(b"l".to_vec()),
        }
    }

    #[payable]
    pub fn lock(&mut self, user_id: AccountId, hashlock_hex: String, expiration_duration_ns: u64) {
        // assume non-zero
        let amount = env::attached_deposit();

        let resolver_id = env::predecessor_account_id();

        let hashlock = hex::decode(hashlock_hex).expect("Failed to decode hex hashlock");
        assert_eq!(
            hashlock.len(),
            32,
            "Hashlock must be 32 bytes (a SHA256 hash)"
        );

        assert!(
            !self.locks.contains_key(&hashlock),
            "A lock with this hash already exists"
        );

        let expiration = env::block_timestamp() + expiration_duration_ns;

        let lock: Lock = Lock {
            user_id,
            resolver_id,
            amount,
            hashlock: hashlock.clone(),
            expiration,
            claimed: false,
        };

        self.locks.insert(hashlock, lock);
    }

    // secret_hex is encoded in sha256
    fn claim(&mut self, secret_hex: String) {
        let secret = hex::decode(secret_hex.clone()).expect("Failed to decode hex secret");
        let hashlock = env::sha256(&secret);

        let mut lock = self
            .locks
            .get(&hashlock)
            .expect("No lock found for this secret")
            .clone();

        assert_eq!(
            env::predecessor_account_id(),
            lock.user_id,
            "Only the designated user can claim"
        );
        assert!(
            env::block_timestamp() < lock.expiration,
            "The lock has expired"
        );
        assert!(!lock.claimed, "This lock has already been claimed");

        Promise::new(lock.user_id.clone()).transfer(lock.amount);

        lock.claimed = true;
        self.locks.insert(hashlock, lock);
    }
    // fn refund()
}
