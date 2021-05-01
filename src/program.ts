import * as fs from 'fs'
import { InclusiveDiagnostic, Scanner } from './scanner'
import glob from 'glob'
import { Command, OptionValues } from 'commander'
import * as core from '@actions/core'

/**
 * Entrypoint program class.
 */
export class Program {
    //#region Fields
    private commandArguments: OptionValues
    //#endregion
    //#region Constructors
    /**
     * Default constructor, sets up welcome sign and command line arguments.
     */
    constructor(args: string[]) {
        this.commandArguments = Program.SetupCommandArgs(args)
    }

    //#endregion
    //#region Accessors
    /**
     * Gets the dictionaryUrl argument value.
     */
    private GetDictionaryUrlArgument(): string {
        return this.commandArguments.dictionaryUrl
    }

    /**
     * Gets the path argument value.
     */
    private GetPathArgument(): string {
        return this.commandArguments.path
    }

    /**
     * Gets the ignore argument value.
     */
    private GetIgnoreArgument(): string {
        return this.commandArguments.ignore
    }

    /**
     * Gets the recursive argument value.
     */
    private GetRecursiveArgument(): string {
        return this.commandArguments.recursive
    }

    //#endregion
    //#region Public
    /**
     * Async program entrypoint
     */
    public async RunAsync(): Promise<void> {
        // get files and run diagnostics for each one of them
        const paths = this.GetPaths()
        const scanner = new Scanner(this.GetDictionaryUrlArgument())

        for (const path of paths) {
            if (fs.lstatSync(path).isFile()) {
                const diagnostics: InclusiveDiagnostic[] = await scanner.scanFile(path)
                Program.PrintDiagnostics(path, diagnostics)
            }
        }
    }

    /**
     * Program entrypoint
     */
    public Run(): void {
        (async () => await this.RunAsync())()
    }

    //#endregion
    //#region Private
    /**
     * Prints diagnostic messages.
     * @param path file path analyzed.
     * @param diagnostics diagnostic data
     */
    private static PrintDiagnostics(path: string, diagnostics: InclusiveDiagnostic[]) {
        for (const diagnostic of diagnostics) {
            Program.PrintWarningMessage(path, diagnostic)
        }
    }

    /**
     * Prints a warning message.
     * @param path file path analyzed.
     * @param diagnostic diagnostic data
     * @returns formatted message.
     */
    private static PrintWarningMessage(path: string, diagnostic: InclusiveDiagnostic) {
        core.setFailed(
            `${path}: Line ${diagnostic.lineNumber} : The term ${diagnostic.term} was found. Consider using ${diagnostic.suggestedTerms}`,
        )
    }

    /**
     * Gets the list of ignored paths provided on the command line arguments.
     * @returns list of ignored paths.
     */
    private GetIgnoredPaths(): string[] {
        let paths: string[] = []

        if (this.GetIgnoreArgument()) {
            paths = this.GetIgnoreArgument().split(',')
        }

        return paths
    }

    /**
     * Gets the list of files, according to the command line arguments.
     * @returns list of files.
     */
    private GetPaths(): string[] {
        let paths: string[] = []

        if (this.GetPathArgument()) {
            let args = this.GetPathArgument().split(',')
            for (let i = 0; i < args.length; i++) {
                let path = args[i]
                if (this.GetRecursiveArgument()) {
                    path += '/**/*'
                }
                paths.push(...glob.sync(path, { ignore: this.GetIgnoredPaths() }))
            }
        }

        return paths
    }

    /**
     * Setup the list of command args.
     * @returns program object, used for parsing the command line arguments.
     */
    private static SetupCommandArgs(args: string[]): OptionValues {
        return new Command()
            .version('1.0.0')
            .description('Scan non-inclusive terms')
            .option(
                '-d, --dictionary-url <url>',
                'URL to the dictionary. See wordsTable.md for the format.',
                'https://raw.githubusercontent.com/Doist/inclusivelint/main/src/wordsTable.md',
            )
            .option(
                '-p, --path <path>',
                'Paths to be scanned, colon separated.',
            )
            .option(
                '-r, --recursive',
                'If the --path option is a folder, use this option to run recursively. Do not use with files.',
            )
            .option(
                '-i, --ignore <ignore>',
                'List of file patterns to be ignored, colon separated. Example: inclusivelint -p . -r -i /node_modules/**,/.git/** is provided, it will search for all files inside ./, except node_modules and .git folders.',
            )
            .parse(args, { from: 'user' })
            .opts()
    }

    //#endregion
}
