/**
 * Core AI type definitions for FOX IDE
 * Adapted from VS Code Copilot Chat extension (vscode-copilot-chat)
 * @see https://github.com/microsoft/vscode-copilot-chat
 */

/** Standard chat message roles for LLM APIs */
export const ChatRole = Object.freeze({
  System: 'system',
  User: 'user',
  Assistant: 'assistant',
  Function: 'function',
  Tool: 'tool',
});

/**
 * Where a chat request originates in the IDE
 * Maps AI features to their UI locations
 */
export const ChatLocation = Object.freeze({
  Panel: 1,
  Terminal: 2,
  Notebook: 3,
  Editor: 4,
  EditingSession: 5,
  Other: 6,
  Agent: 7,
});

/**
 * Possible outcomes from an AI fetch request
 * Covers every response state the UI needs to handle
 */
export const ChatFetchResponseType = Object.freeze({
  OffTopic: 'offTopic',
  Canceled: 'canceled',
  Filtered: 'filtered',
  FilteredRetry: 'filteredRetry',
  PromptFiltered: 'promptFiltered',
  Refusal: 'refusal',
  Length: 'length',
  RateLimited: 'rateLimited',
  QuotaExceeded: 'quotaExceeded',
  BadRequest: 'badRequest',
  NotFound: 'notFound',
  Failed: 'failed',
  Unknown: 'unknown',
  NetworkError: 'networkError',
  Success: 'success',
});

/**
 * Token usage statistics from LLM responses
 * Used for billing/cost tracking and usage display
 */
export const createUsage = ({
  prompt_tokens = 0,
  completion_tokens = 0,
  total_tokens = 0,
  prompt_tokens_details,
  completion_tokens_details,
} = {}) => ({
  prompt_tokens,
  completion_tokens,
  total_tokens,
  prompt_tokens_details,
  completion_tokens_details,
});

/**
 * Check if a value is a valid APIUsage object
 * @param {unknown} obj
 * @returns {boolean}
 */
export const isApiUsage = (obj) =>
  typeof obj?.prompt_tokens === 'number' &&
  typeof obj?.completion_tokens === 'number' &&
  typeof obj?.total_tokens === 'number';

/**
 * Log probability data for each token
 */
export const createLogprobs = ({
  text_offset = [],
  token_logprobs = [],
  tokens = [],
  top_logprobs,
} = {}) => ({
  text_offset,
  token_logprobs,
  tokens,
  top_logprobs,
});

/**
 * API error response shape
 */
export const createErrorResponse = ({
  code = 0,
  message = '',
  metadata,
} = {}) => ({
  code,
  message,
  metadata,
});

/**
 * @typedef {Object} ChatMessage
 * @property {'system'|'user'|'assistant'|'function'|'tool'} role
 * @property {string} [content]
 * @property {string} [name]
 * @property {string} [tool_call_id]
 * @property {Array} [tool_calls]
 * @property {string} [refusal]
 */

/**
 * Create a chat message
 * @param {Partial<ChatMessage>} props
 * @returns {ChatMessage}
 */
export const createMessage = ({
  role = ChatRole.User,
  content = '',
  name,
  tool_call_id,
  tool_calls,
  refusal,
} = {}) => ({
  role,
  content,
  ...(name && { name }),
  ...(tool_call_id && { tool_call_id }),
  ...(tool_calls && { tool_calls }),
  ...(refusal && { refusal }),
});

/**
 * @typedef {Object} ChatCompletionChoice
 * @property {number} index
 * @property {ChatMessage} message
 * @property {'stop'|'length'|'tool_calls'|'content_filter'|null} finish_reason
 */

/**
 * @typedef {Object} ChatCompletion
 * @property {string} id
 * @property {'chat.completion'} object
 * @property {number} created
 * @property {string} model
 * @property {ChatCompletionChoice[]} choices
 * @property {APIUsage} [usage]
 */

/**
 * Create a chat completion response
 * @param {Partial<ChatCompletion>} props
 * @returns {ChatCompletion}
 */
export const createCompletion = ({
  id = '',
  created = Math.floor(Date.now() / 1000),
  model = '',
  choices = [],
  usage,
} = {}) => ({
  id,
  object: 'chat.completion',
  created,
  model,
  choices,
  ...(usage && { usage }),
});

/**
 * Model capability options for per-request feature toggling
 */
export const createModelOptions = ({
  enableThinking = false,
  reasoningEffort,
  enableToolSearch = false,
  enableContextEditing = false,
} = {}) => ({
  enableThinking,
  reasoningEffort,
  enableToolSearch,
  enableContextEditing,
});
