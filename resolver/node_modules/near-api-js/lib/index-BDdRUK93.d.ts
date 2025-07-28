import { getTransactionLastResult } from '@near-js/utils';
import { FailoverRpcProvider, JsonRpcProvider, Provider } from '@near-js/providers';
import { ErrorContext, ExecutionOutcomeWithId, FinalExecutionOutcome, FinalExecutionStatus, FinalExecutionStatusBasic, TypedError } from '@near-js/types';

/** @hidden @module */

declare const index_ErrorContext: typeof ErrorContext;
declare const index_ExecutionOutcomeWithId: typeof ExecutionOutcomeWithId;
declare const index_FailoverRpcProvider: typeof FailoverRpcProvider;
declare const index_FinalExecutionOutcome: typeof FinalExecutionOutcome;
declare const index_FinalExecutionStatus: typeof FinalExecutionStatus;
declare const index_FinalExecutionStatusBasic: typeof FinalExecutionStatusBasic;
declare const index_JsonRpcProvider: typeof JsonRpcProvider;
declare const index_Provider: typeof Provider;
declare const index_TypedError: typeof TypedError;
declare const index_getTransactionLastResult: typeof getTransactionLastResult;
declare namespace index {
  export { index_ErrorContext as ErrorContext, index_ExecutionOutcomeWithId as ExecutionOutcomeWithId, index_FailoverRpcProvider as FailoverRpcProvider, index_FinalExecutionOutcome as FinalExecutionOutcome, index_FinalExecutionStatus as FinalExecutionStatus, index_FinalExecutionStatusBasic as FinalExecutionStatusBasic, index_JsonRpcProvider as JsonRpcProvider, index_Provider as Provider, index_TypedError as TypedError, index_getTransactionLastResult as getTransactionLastResult };
}

export { index as i };
