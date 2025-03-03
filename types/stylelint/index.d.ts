declare module 'stylelint' {
	import type * as PostCSS from 'postcss';
	import type { GlobbyOptions } from 'globby';
	import type { cosmiconfig } from 'cosmiconfig';

	namespace stylelint {
		export type Severity = 'warning' | 'error';

		export type ConfigExtends = string | string[];
		export type ConfigPlugins = string | string[];
		export type ConfigProcessor = string | [string, Object];
		export type ConfigProcessors = string | ConfigProcessor[];
		export type ConfigIgnoreFiles = string | string[];
		export type ConfigRuleSettings<T, O extends Object> =
			| null
			| undefined
			| NonNullable<T>
			| [NonNullable<T>]
			| [NonNullable<T>, O];
		export type ConfigRules = {
			[ruleName: string]: ConfigRuleSettings<any, Object>;
		};
		export type ConfigOverride = Omit<Config, 'overrides'> & {
			files: string | string[];
		};

		export type DisableOptions = {
			except?: (string | RegExp)[];
			severity?: Severity;
		};
		export type DisableSettings = ConfigRuleSettings<boolean, DisableOptions>;

		export type ResultProcessor = (result: LintResult, file: string | undefined) => LintResult;

		export type Config = {
			extends?: ConfigExtends;
			plugins?: ConfigPlugins;
			pluginFunctions?: {
				[pluginName: string]: Function;
			};
			processors?: ConfigProcessors;
			processorFunctions?: Function[];
			ignoreFiles?: ConfigIgnoreFiles;
			ignorePatterns?: string;
			rules?: ConfigRules;
			codeProcessors?: CodeProcessor[];
			resultProcessors?: ResultProcessor[];
			quiet?: boolean;
			defaultSeverity?: Severity;
			ignoreDisables?: DisableSettings;
			reportNeedlessDisables?: DisableSettings;
			reportInvalidScopeDisables?: DisableSettings;
			reportDescriptionlessDisables?: DisableSettings;
			overrides?: ConfigOverride[];
			customSyntax?: CustomSyntax;
		};

		// A meta-type that returns a union over all properties of `T` whose values
		// have type `U`.
		type PropertyNamesOfType<T, U> = {
			[K in keyof T]-?: T[K] extends U ? K : never;
		}[keyof T];
		export type DisablePropertyName = PropertyNamesOfType<Config, DisableSettings>;

		// This type has the same properties as `CosmiconfigResult` from `cosmiconfig`.
		export type CosmiconfigResult = {
			config: Config;
			filepath: string;
			isEmpty?: boolean;
		} | null;

		export type ConfigurationError = Error & { code: 78 };

		export type DisabledRange = {
			comment: PostCSS.Comment;
			start: number;
			strictStart: boolean;
			end?: number;
			strictEnd?: boolean;
			rules?: string[];
			description?: string;
		};

		export type DisabledRangeObject = {
			[ruleName: string]: DisabledRange[];
		};

		export type DisabledWarning = { line: number; rule: string };

		export type StylelintPostcssResult = {
			ruleSeverities: { [k: string]: Severity };
			customMessages: { [k: string]: any };
			quiet?: boolean;
			disabledRanges: DisabledRangeObject;
			disabledWarnings?: DisabledWarning[];
			ignored?: boolean;
			stylelintError?: boolean;
			disableWritingFix?: boolean;
			config?: Config;
			ruleDisableFix?: boolean;
		};

		type EmptyResult = {
			root: {
				nodes?: undefined;
				source: {
					lang?: undefined;
					input: {
						file?: string;
					};
				};
			};
			messages: PostCSS.Message[];
			opts: undefined;
		};

		export type WarningOptions = PostCSS.WarningOptions & {
			stylelintType?: string;
			severity?: Severity;
			rule?: string;
		};

		export type PostcssResult = (PostCSS.Result | EmptyResult) & {
			stylelint: StylelintPostcssResult;
			warn(message: string, options?: WarningOptions): void;
		};

		export type Formatter = (results: LintResult[], returnValue?: LinterResult) => string;

		export type FormatterType = 'compact' | 'json' | 'string' | 'tap' | 'unix' | 'verbose';

		export type CustomSyntax = string | PostCSS.Syntax;

		export type PluginContext = {
			fix?: boolean | undefined;
			newline?: string | undefined;
		};

		export type RuleMessages = { [message: string]: string | ((...args: any[]) => string) };

		export type RuleOptionsPossibleFunc = (value: unknown) => boolean;

		export type RuleOptionsPossible = boolean | number | string | RuleOptionsPossibleFunc;

		export type RuleOptions = {
			actual: unknown;
			possible?:
				| RuleOptionsPossibleFunc
				| RuleOptionsPossible[]
				| Record<string, RuleOptionsPossible[]>;
			optional?: boolean;
		};

		export type RuleBase<P = any, S = any> = (
			primaryOption: P,
			secondaryOptions: Record<string, S>,
			context: PluginContext,
		) => (root: PostCSS.Root, result: PostcssResult) => Promise<void> | void;

		export type Rule<P = any, S = any> = RuleBase<P, S> & {
			ruleName: string;
			messages: RuleMessages;
			primaryOptionArray?: boolean;
		};

		export type Plugin<P = any, S = any> = RuleBase<P, S>;

		export type CodeProcessor = (code: string, file: string | undefined) => string;

		export type GetPostcssOptions = {
			code?: string;
			codeFilename?: string;
			filePath?: string;
			codeProcessors?: CodeProcessor[];
			syntax?: string;
			customSyntax?: CustomSyntax;
		};

		export type GetLintSourceOptions = GetPostcssOptions & {
			existingPostcssResult?: PostCSS.Result;
		};

		export type LinterOptions = {
			files?: string | string[];
			globbyOptions?: GlobbyOptions;
			cache?: boolean;
			cacheLocation?: string;
			code?: string;
			codeFilename?: string;
			config?: Config;
			configFile?: string;
			configBasedir?: string;
			/**
			 * The working directory to resolve files from. Defaults to the
			 * current working directory.
			 */
			cwd?: string;
			ignoreDisables?: boolean;
			ignorePath?: string;
			ignorePattern?: string[];
			reportDescriptionlessDisables?: boolean;
			reportNeedlessDisables?: boolean;
			reportInvalidScopeDisables?: boolean;
			maxWarnings?: number;
			/** @deprecated Use `customSyntax` instead. Using this option will result in an error. */
			syntax?: string;
			customSyntax?: CustomSyntax;
			formatter?: FormatterType | Formatter;
			disableDefaultIgnores?: boolean;
			fix?: boolean;
			allowEmptyInput?: boolean;
			quiet?: boolean;
		};

		export type CssSyntaxError = {
			column: number;
			file?: string;
			input: {
				column: number;
				file?: string;
				line: number;
				source: string;
			};
			line: number;
			message: string;
			name: string;
			reason: string;
			source: string;
		};

		export type Warning = {
			line: number;
			column: number;
			rule: string;
			severity: Severity;
			text: string;
			stylelintType?: string;
		};

		export type LintResult = {
			source?: string;
			deprecations: {
				text: string;
				reference: string;
			}[];
			invalidOptionWarnings: {
				text: string;
			}[];
			parseErrors: (PostCSS.Warning & { stylelintType: string })[];
			errored?: boolean;
			warnings: Warning[];
			ignored?: boolean;
			/**
			 * Internal use only. Do not use or rely on this property. It may
			 * change at any time.
			 * @internal
			 */
			_postcssResult?: PostcssResult;
		};

		export type DisableReportRange = {
			rule: string;
			start: number;
			end?: number;
		};

		export type RangeType = DisabledRange & { used?: boolean };

		export type DisableReportEntry = {
			source?: string;
			ranges: DisableReportRange[];
		};

		export type LinterResult = {
			/**
			 * The working directory from which the linter was run when the
			 * results were generated.
			 */
			cwd: string;
			results: LintResult[];
			errored: boolean;
			output: any;
			maxWarningsExceeded?: {
				maxWarnings: number;
				foundWarnings: number;
			};
			reportedDisables: DisableOptionsReport;
			descriptionlessDisables?: DisableOptionsReport;
			needlessDisables?: DisableOptionsReport;
			invalidScopeDisables?: DisableOptionsReport;
		};

		export type Problem = {
			ruleName: string;
			result: PostcssResult;
			message: string;
			node: PostCSS.Node;
			index?: number;
			word?: string;
			line?: number;
		};

		export type PublicApi = PostCSS.PluginCreator<PostcssPluginOptions> & {
			/**
			 * Runs stylelint with the given options and returns a Promise that
			 * resolves to the results.
			 */
			lint: (options: LinterOptions) => Promise<LinterResult>;
			/**
			 * Available rules.
			 */
			rules: { [k: string]: Rule };
			/**
			 * Result report formatters by name.
			 */
			formatters: { [k: string]: Formatter };
			/**
			 * Creates a Stylelint plugin.
			 */
			createPlugin: (ruleName: string, plugin: Plugin) => { ruleName: string; rule: Rule };
			/**
			 * Internal use only. Do not use or rely on this method. It may
			 * change at any time.
			 * @internal
			 */
			createLinter: (options: LinterOptions) => InternalApi;
			utils: {
				/**
				 * Report a problem.
				 *
				 * This function accounts for `disabledRanges` attached to the result.
				 * That is, if the reported problem is within a disabledRange,
				 * it is ignored. Otherwise, it is attached to the result as a
				 * postcss warning.
				 *
				 * It also accounts for the rule's severity.
				 *
				 * You *must* pass *either* a node or a line number.
				 */
				report: (problem: Problem) => void;
				/**
				 * Given an object of problem messages, return another
				 * that provides the same messages postfixed with the rule
				 * that has been violated.
				 */
				ruleMessages: <T extends RuleMessages, R extends { [K in keyof T]: T[K] }>(
					ruleName: string,
					messages: T,
				) => R;
				/**
				 * Validate a rule's options.
				 *
				 * See existing rules for examples.
				 */
				validateOptions: (
					result: PostcssResult,
					ruleName: string,
					...optionDescriptions: RuleOptions[]
				) => boolean;
				/**
				 * Useful for third-party code (e.g. plugins) to run a PostCSS Root
				 * against a specific rule and do something with the warnings
				 */
				checkAgainstRule: <T, O extends Object>(
					options: { ruleName: string; ruleSettings: ConfigRuleSettings<T, O>; root: PostCSS.Root },
					callback: (warning: PostCSS.Warning) => void,
				) => void;
			};
		};

		/**
		 * Internal use only. Do not use or rely on this type. It may change at
		 * any time.
		 * @internal
		 */
		export type InternalApi = {
			_options: LinterOptions & { cwd: string };
			_extendExplorer: ReturnType<typeof cosmiconfig>;
			_specifiedConfigCache: Map<Config, Promise<CosmiconfigResult>>;
			_postcssResultCache: Map<string, PostCSS.Result>;

			_getPostcssResult: (options?: GetPostcssOptions) => Promise<PostCSS.Result>;
			_lintSource: (options: GetLintSourceOptions) => Promise<PostcssResult>;
			_createStylelintResult: (
				postcssResult: PostcssResult,
				filePath?: string,
			) => Promise<LintResult>;

			getConfigForFile: (searchPath?: string, filePath?: string) => Promise<CosmiconfigResult>;
			isPathIgnored: (s?: string) => Promise<boolean>;
		};

		export type DisableOptionsReport = DisableReportEntry[];

		export type PostcssPluginOptions = Omit<LinterOptions, 'syntax' | 'customSyntax'> | Config;
	}

	const stylelint: stylelint.PublicApi;

	export = stylelint;
}
