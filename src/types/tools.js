/**
 * Tool system type definitions for FOX IDE
 * Adapted from VS Code Copilot Chat extension (vscode-copilot-chat)
 * @see https://github.com/microsoft/vscode-copilot-chat
 */

/** Tool grouping categories */
export const ToolCategory = Object.freeze({
  Core: 'Core',
  FileManagement: 'File Management',
  EditorInteraction: 'Editor Interaction',
  TerminalInteraction: 'Terminal Interaction',
  Testing: 'Testing',
  Search: 'Search',
  WebInteraction: 'Web Interaction',
  AgentOrchestration: 'Agent Orchestration',
});

/** Available tool names for AI agent operations */
export const ToolName = Object.freeze({
  // File operations
  ReadFile: 'read_file',
  CreateFile: 'create_file',
  EditFile: 'insert_edit_into_file',
  ApplyPatch: 'apply_patch',
  ReplaceString: 'replace_string_in_file',
  ListDirectory: 'list_dir',
  CreateDirectory: 'create_directory',

  // Search
  FindFiles: 'file_search',
  FindTextInFiles: 'grep_search',
  SearchWorkspaceSymbols: 'search_workspace_symbols',
  Codebase: 'semantic_search',

  // Terminal
  RunInTerminal: 'run_in_terminal',
  GetTerminalOutput: 'get_terminal_output',
  SendToTerminal: 'send_to_terminal',
  KillTerminal: 'kill_terminal',

  // Testing
  RunTest: 'runTests',
  TestFailure: 'testFailure',
  FindTestFiles: 'test_search',

  // Editor
  GetErrors: 'get_errors',
  GetScmChanges: 'get_changed_files',
  ReadProjectStructure: 'read_project_structure',

  // Browser / Web
  OpenBrowserPage: 'open_browser_page',
  ClickElement: 'click_element',
  ScreenshotPage: 'screenshot_page',
  NavigatePage: 'navigate_page',
  ReadPage: 'read_page',
  FetchWebPage: 'fetch_webpage',

  // Agent orchestration
  RunSubagent: 'runSubagent',
  SearchSubagent: 'search_subagent',
  ExploreSubagent: 'explore_subagent',
  ExecutionSubagent: 'execution_subagent',
  SwitchAgent: 'switch_agent',

  // Confirmation
  GetConfirmation: 'vscode_get_confirmation',
  GetConfirmationWithOptions: 'vscode_get_confirmation_with_options',
  GetTerminalConfirmation: 'vscode_get_terminal_confirmation',

  // Misc
  Memory: 'memory',
  ManageTodoList: 'manage_todo_list',
  Skill: 'skill',
  ToolSearch: 'tool_search',
  AskQuestions: 'vscode_askQuestions',
  ReviewPlan: 'vscode_reviewPlan',
  NotebookSummary: 'copilot_getNotebookSummary',
  ViewImage: 'view_image',
  InstallExtension: 'install_extension',
});

/**
 * Check if a tool name is a browser interaction tool
 * @param {string} toolName
 * @returns {boolean}
 */
export const isBrowserTool = (toolName) => {
  const browserTools = [
    ToolName.OpenBrowserPage,
    ToolName.ClickElement,
    ToolName.ScreenshotPage,
    ToolName.NavigatePage,
    ToolName.ReadPage,
    ToolName.FetchWebPage,
  ];
  return browserTools.includes(toolName);
};

/**
 * Check if a tool name is a terminal interaction tool
 * @param {string} toolName
 * @returns {boolean}
 */
export const isTerminalTool = (toolName) => {
  const terminalTools = [
    ToolName.RunInTerminal,
    ToolName.GetTerminalOutput,
    ToolName.SendToTerminal,
    ToolName.KillTerminal,
  ];
  return terminalTools.includes(toolName);
};

/**
 * Check if a tool name is a file operation tool
 * @param {string} toolName
 * @returns {boolean}
 */
export const isFileTool = (toolName) => {
  const fileTools = [
    ToolName.ReadFile,
    ToolName.CreateFile,
    ToolName.EditFile,
    ToolName.ApplyPatch,
    ToolName.ReplaceString,
    ToolName.ListDirectory,
    ToolName.CreateDirectory,
  ];
  return fileTools.includes(toolName);
};

/**
 * @typedef {Object} ToolDefinition
 * @property {string} name - Tool name matching ToolName enum
 * @property {string} description - Human-readable description
 * @property {Object} parameters - JSON Schema for tool parameters
 * @property {string} [category] - ToolCategory for grouping
 */

/**
 * Create a tool definition
 * @param {Partial<ToolDefinition>} props
 * @returns {ToolDefinition}
 */
export const createTool = ({
  name = '',
  description = '',
  parameters = {},
  category = ToolCategory.Core,
} = {}) => ({
  name,
  description,
  parameters,
  category,
});

/**
 * @typedef {Object} ToolCall
 * @property {string} id - Unique tool call ID
 * @property {string} name - Tool name
 * @property {string} arguments - JSON string of arguments
 */

/**
 * Create a tool call
 * @param {Partial<ToolCall>} props
 * @returns {ToolCall}
 */
export const createToolCall = ({
  id = `call_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  name = '',
  arguments: args = '{}',
} = {}) => ({
  id,
  name,
  arguments: typeof args === 'string' ? args : JSON.stringify(args),
});

/**
 * @typedef {Object} ToolResult
 * @property {string} tool_call_id - ID of the tool call this is a result for
 * @property {string} content - Result content
 * @property {boolean} [is_error] - Whether the result is an error
 */

/**
 * Create a tool result
 * @param {Partial<ToolResult>} props
 * @returns {ToolResult}
 */
export const createToolResult = ({
  tool_call_id = '',
  content = '',
  is_error = false,
} = {}) => ({
  tool_call_id,
  content,
  is_error,
});
