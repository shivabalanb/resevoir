use near_sdk::json_types::Base64VecU8;
use near_sdk::{env, near, AccountId, PanicOnDefault, Promise, Timestamp};
use near_sdk::{log, NearToken};

const WITHDRAW_WINDOW_NS: u64 = 120 * 1_000_000_000; // 2 minutes
const CANCEL_TIMELOCK_NS: u64 = 121 * 1_000_000_000; // 2 minutes + 1 second

#[derive(PanicOnDefault)]
#[near(contract_state)]
pub struct DstEscrow {
    resolver_id: AccountId,
    user_id: AccountId,
    amount: NearToken,
    hashlock: Vec<u8>,
    created_at: Timestamp,
    secret: Option<String>,
}

#[near]
impl DstEscrow {
    #[init]
    #[payable]
    pub fn new(user_id: AccountId, hashlock: Base64VecU8, amount: NearToken) -> Self {

        Self {
            resolver_id: env::predecessor_account_id(),
            user_id,
            amount,
            hashlock: hashlock.into(),
            created_at: env::block_timestamp(),
            secret: None,
        }
    }

    pub fn withdraw(&mut self, secret: String) {
        assert!(self.secret.is_none(), "Funds have already been withdrawn.");

        let now = env::block_timestamp();
        assert!(
            now < self.created_at + WITHDRAW_WINDOW_NS,
            "Withdrawal window has closed."
        );

        let secret_hex_no_prefix = secret.strip_prefix("0x").unwrap_or(&secret);
        let secret_bytes = hex::decode(secret_hex_no_prefix).expect("Failed to decode hex secret");

        let provided_hash = env::keccak256(&secret_bytes);
        assert_eq!(provided_hash, self.hashlock, "Invalid secret provided.");

        log!(
            "Secret correct! Transfering {} to {}",
            self.amount,
            self.user_id
        );
        self.secret = Some(secret);

        Promise::new(self.user_id.clone()).transfer(self.amount);
    }

    pub fn cancel(&mut self) {
        assert!(
            self.secret.is_none(),
            "Funds have already been withdrawn, cannot cancel."
        );

        let now = env::block_timestamp();
        assert!(
            now >= self.created_at + CANCEL_TIMELOCK_NS,
            "Cancellation period has not yet begun."
        );

        assert_eq!(
            env::predecessor_account_id(),
            self.resolver_id,
            "Only the resolver can cancel."
        );

        log!(
            "Cancelling escrow. Refunding {} to resolver {}",
            self.amount,
            self.resolver_id
        );
        Promise::new(self.resolver_id.clone()).transfer(self.amount);
    }
}
