/**
 * Networking and streaming type definitions for KRO IDE
 * Adapted from VS Code Copilot Chat extension (vscode-copilot-chat)
 * @see https://github.com/microsoft/vscode-copilot-chat
 */

import { ChatRole } from './ai.js';

/** Streaming response part kinds */
export const ResponsePartKind = Object.freeze({
  ContentDelta: 'ContentDelta',
  Content: 'Content',
  ToolCallDelta: 'ToolCallDelta',
  ToolCall: 'ToolCall',
  Annotation: 'Annotation',
  Confirmation: 'Confirmation',
  Error: 'Error',
  Thinking: 'Thinking',
  ThinkingDelta: 'ThinkingDelta',
});

/**
 * Unified request body for LLM APIs
 * Covers OpenAI Chat Completions, Responses, and Anthropic Messages
 */
export const createEndpointBody = ({
  model,
  messages = [],
  max_tokens,
  max_completion_tokens,
  temperature,
  top_p,
  stream = false,
  tools,
  tool_choice,
  reasoning_effort,
  n,
  top_logprobs,
  stream_options,
  // Responses API specific
  input,
  truncation,
  // Messages API specific
  thinking,
} = {}) => {
  const body = { model, messages, stream };

  if (max_tokens !== undefined) body.max_tokens = max_tokens;
  if (max_completion_tokens !== undefined) body.max_completion_tokens = max_completion_tokens;
  if (temperature !== undefined) body.temperature = temperature;
  if (top_p !== undefined) body.top_p = top_p;
  if (tools !== undefined) body.tools = tools;
  if (tool_choice !== undefined) body.tool_choice = tool_choice;
  if (reasoning_effort !== undefined) body.reasoning_effort = reasoning_effort;
  if (n !== undefined) body.n = n;
  if (top_logprobs !== undefined) body.top_logprobs = top_logprobs;
  if (stream_options !== undefined) body.stream_options = stream_options;
  if (input !== undefined) body.input = input;
  if (truncation !== undefined) body.truncation = truncation;
  if (thinking !== undefined) body.thinking = thinking;

  return body;
};

/**
 * @typedef {Object} IEndpoint
 * @property {string} url - API endpoint URL
 * @property {string} name - Provider name (e.g., 'openai', 'anthropic')
 * @property {string} model - Model identifier
 * @property {number} maxPromptTokens - Maximum context window tokens
 * @property {string} [family] - Model family for grouping
 * @property {Object} [headers] - Additional request headers
 */

/**
 * Create an endpoint configuration
 * @param {Partial<IEndpoint>} props
 * @returns {IEndpoint}
 */
export const createEndpoint = ({
  url = '',
  name = '',
  model = '',
  maxPromptTokens = 4096,
  family,
  headers,
} = {}) => ({
  url,
  name,
  model,
  maxPromptTokens,
  ...(family && { family }),
  ...(headers && { headers }),
});

/**
 * @typedef {Object} StreamDelta
 * @property {string} text - Incremental text content
 * @property {Array} [tool_calls] - Incremental tool call data
 * @property {Object} [usage] - Token usage for this chunk
 * @property {string} [finish_reason] - Why generation stopped
 */

/**
 * Create a stream delta
 * @param {Partial<StreamDelta>} props
 * @returns {StreamDelta}
 */
export const createStreamDelta = ({
  text = '',
  tool_calls,
  usage,
  finish_reason,
} = {}) => ({
  text,
  ...(tool_calls && { tool_calls }),
  ...(usage && { usage }),
  ...(finish_reason && { finish_reason }),
});

/**
 * @typedef {Object} StreamChunk
 * @property {string} id - Completion ID
 * @property {'chat.completion.chunk'} object
 * @property {number} created - Unix timestamp
 * @property {string} model - Model used
 * @property {Array<{index: number, delta: StreamDelta, finish_reason: string|null}>} choices
 * @property {APIUsage} [usage]
 */

/**
 * Create a stream chunk
 * @param {Partial<StreamChunk>} props
 * @returns {StreamChunk}
 */
export const createStreamChunk = ({
  id = '',
  created = Math.floor(Date.now() / 1000),
  model = '',
  choices = [],
  usage,
} = {}) => ({
  id,
  object: 'chat.completion.chunk',
  created,
  model,
  choices,
  ...(usage && { usage }),
});

/**
 * @typedef {Object} ResponsePart
 * @property {string} kind - ResponsePartKind value
 * @property {string} [delta] - Incremental text (for ContentDelta)
 * @property {string} [content] - Final content (for Content)
 * @property {Object} [tool_call] - Tool call data (for ToolCall)
 * @property {string} [name] - Tool name (for ToolCallDelta)
 */

/**
 * Content delta part - incremental text
 */
export const createContentDeltaPart = (partId, delta) => ({
  kind: ResponsePartKind.ContentDelta,
  partId,
  delta,
});

/**
 * Content part - finalized content
 */
export const createContentPart = (partId, content) => ({
  kind: ResponsePartKind.Content,
  partId,
  content,
});

/**
 * Tool call delta part - incremental tool call args
 */
export const createToolCallDeltaPart = (partId, name, delta) => ({
  kind: ResponsePartKind.ToolCallDelta,
  partId,
  name,
  delta,
});

/**
 * Tool call part - completed tool call
 */
export const createToolCallPart = (partId, id, name, arguments: args) => ({
  kind: ResponsePartKind.ToolCall,
  partId,
  id,
  name,
  arguments: args,
});

/**
 * @callback FinishedCallback
 * @param {string} text - Full concatenated text
 * @param {number} index - Choice index
 * @param {StreamDelta} delta - Latest chunk delta
 * @returns {Promise<number|undefined>} Number to stop, undefined to continue
 */

/**
 * @typedef {Object} ChatRequestOptions
 * @property {string} [debugName] - Debug label for the request
 * @property {Array} messages - Chat messages
 * @property {string} model - Model identifier
 * @property {number} [maxTokens] - Max tokens to generate
 * @property {number} [temperature] - Sampling temperature
 * @property {boolean} [stream] - Enable streaming
 * @property {FinishedCallback} [onChunk] - Streaming callback
 * @property {AbortSignal} [signal] - Abort signal
 */

/**
 * Create a chat request options object
 * @param {Partial<ChatRequestOptions>} props
 * @returns {ChatRequestOptions}
 */
export const createChatRequest = ({
  debugName,
  messages = [],
  model = '',
  maxTokens,
  temperature,
  stream = false,
  onChunk,
  signal,
} = {}) => ({
  messages,
  model,
  stream,
  ...(debugName && { debugName }),
  ...(maxTokens !== undefined && { maxTokens }),
  ...(temperature !== undefined && { temperature }),
  ...(onChunk && { onChunk }),
  ...(signal && { signal }),
});

/**
 * @typedef {Object} FetchSuccess
 * @property {'success'} type
 * @property {*} value - Response value
 * @property {string} requestId
 * @property {string|undefined} serverRequestId
 * @property {APIUsage|undefined} usage
 * @property {string} resolvedModel
 */

/**
 * @typedef {Object} FetchError
 * @property {string} type - ChatFetchResponseType error value
 * @property {string} reason
 * @property {string} [reasonDetail]
 * @property {string} requestId
 * @property {string|undefined} serverRequestId
 * @property {number} [retryAfter]
 */

/**
 * Create a successful fetch response
 * @param {Partial<FetchSuccess>} props
 * @returns {FetchSuccess}
 */
export const createFetchSuccess = ({
  value,
  requestId = '',
  serverRequestId,
  usage,
  resolvedModel = '',
} = {}) => ({
  type: 'success',
  value,
  requestId,
  serverRequestId,
  usage,
  resolvedModel,
});

/**
 * Create an error fetch response
 * @param {Partial<FetchError>} props
 * @returns {FetchError}
 */
export const createFetchError = ({
  type = 'failed',
  reason = '',
  reasonDetail,
  requestId = '',
  serverRequestId,
  retryAfter,
} = {}) => ({
  type,
  reason,
  ...(reasonDetail && { reasonDetail }),
  requestId,
  serverRequestId,
  ...(retryAfter !== undefined && { retryAfter }),
});

/**
 * @typedef {Object} StreamingSession
 * @property {string} id - Session ID
 * @property {AbortController} controller - Abort controller
 * @property {boolean} isActive - Whether streaming is active
 * @property {string} accumulatedText - Full text so far
 * @property {Array} toolCalls - Tool calls received
 * @property {Function} cancel - Cancel the stream
 */

/**
 * Create a streaming session manager
 * @param {string} sessionId
 * @returns {StreamingSession}
 */
export const createStreamingSession = (sessionId) => {
  const controller = new AbortController();
  let accumulatedText = '';
  const toolCalls = [];

  return {
    id: sessionId,
    controller,
    isActive: true,
    get accumulatedText() { return accumulatedText; },
    get toolCalls() { return [...toolCalls]; },
    cancel: () => {
      controller.abort();
    },
    appendText: (text) => {
      accumulatedText += text;
    },
    addToolCall: (call) => {
      toolCalls.push(call);
    },
    deactivate: () => {
      this.isActive = false;
    },
  };
};
