use near_sdk::{
    near, env, AccountId, PanicOnDefault, BorshStorageKey,
    borsh::{self, BorshDeserialize, BorshSerialize, BorshSchema},
    serde::{Deserialize, Serialize},
    store::LazyOption,
  };
  use schemars::JsonSchema;
  
  #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, JsonSchema)]
  pub struct OracleData {
    pub value: u128,
    pub decimals: u8,
    pub reasoning: String,  
    pub timestamp: u64,
    pub source: Option<String>,
  }

  #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, JsonSchema, BorshSchema)]
  pub struct OracleConfig {
    pub description: String,
    pub api_url: String,
  }
  
  #[derive(BorshSerialize, BorshStorageKey)]
  enum StorageKey { Record }
  
  #[near(contract_state)]
  #[derive(PanicOnDefault)]
  pub struct OracleContract {
    pub owner: AccountId,  
    pub config: OracleConfig,  
    record: LazyOption<OracleData>,
  }
  
  #[near]
  impl OracleContract {
    #[init]
    pub fn new(owner: AccountId, config: OracleConfig) -> Self {
      Self { owner, config, record: LazyOption::new(StorageKey::Record, None) }
    }
  
    pub fn update_oracle_data(&mut self, rec: OracleData) {
      assert_eq!(env::predecessor_account_id(), self.owner, "only oracle agent");
      self.record.set(Some(rec));
    }
  
    pub fn get_oracle_data(&self) -> Option<OracleData> {
      self.record.get().clone()
    }

    pub fn get_config(&self) -> OracleConfig {
      self.config.clone()
    }

    // Method to change the owner
    pub fn set_owner(&mut self, new_owner: AccountId) {
      // assert_eq!(env::predecessor_account_id(), self.owner, "only current owner");
      self.owner = new_owner;
    }

    // Method to get the current owner
    pub fn get_owner(&self) -> AccountId {
      self.owner.clone()
    }
  }