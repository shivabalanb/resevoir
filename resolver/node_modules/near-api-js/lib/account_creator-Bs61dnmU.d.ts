import { AccountCreator, LocalAccountCreator, UrlAccountCreator } from '@near-js/accounts';

declare const account_creator_AccountCreator: typeof AccountCreator;
declare const account_creator_LocalAccountCreator: typeof LocalAccountCreator;
declare const account_creator_UrlAccountCreator: typeof UrlAccountCreator;
declare namespace account_creator {
  export { account_creator_AccountCreator as AccountCreator, account_creator_LocalAccountCreator as LocalAccountCreator, account_creator_UrlAccountCreator as UrlAccountCreator };
}

export { account_creator as a };
