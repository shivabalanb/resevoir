import { ServerError, formatError, getErrorTypeFromErrorMessage, parseResultError, parseRpcError } from '@near-js/utils';

declare const rpc_errors_ServerError: typeof ServerError;
declare const rpc_errors_formatError: typeof formatError;
declare const rpc_errors_getErrorTypeFromErrorMessage: typeof getErrorTypeFromErrorMessage;
declare const rpc_errors_parseResultError: typeof parseResultError;
declare const rpc_errors_parseRpcError: typeof parseRpcError;
declare namespace rpc_errors {
  export { rpc_errors_ServerError as ServerError, rpc_errors_formatError as formatError, rpc_errors_getErrorTypeFromErrorMessage as getErrorTypeFromErrorMessage, rpc_errors_parseResultError as parseResultError, rpc_errors_parseRpcError as parseRpcError };
}

export { rpc_errors as r };
