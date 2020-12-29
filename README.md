# inclusivelint

This repository holds all the code for the inclusivelint TypeScript library, which is located [here](https://www.npmjs.com/package/inclusivelint).

Inclusivelint is a project that helps engineers to write code that is inclusive, making sure to tag all the words that are not inclusive and showing suggestions
for it. For example, after scanning the files with this lib, you can see a output like this one:

``` json
{ 
    "lineNumber": 1,
    "term": "master",
    "termStartIndex": 9,
    "termEndIndex": 14,
    "termLineStartIndex": 10,
    "termLineEndIndex": 16,
    "suggestedTerms": [
    "primary", "primaries", "hub", "hubs", "reference", "references", "replica", "replicas", "spoke", "spokes", "secondary", "secondaries"
    ]
}
```

This json shows that the word master was found in the index 9 and it ends on index 14. And it also shows some possible substitutions.

## How to use

### Using as a TypeScript Library

After running the installation command:

``` sh
npm install inclusivelint
```

Using the library is really straight forward and can be done like this:

``` typescript
import { InclusiveDiagnostic, scanFile } from "inclusivelint";


async function main() {
    //use scanfile if reading from a file
    var allDiagnostics: InclusiveDiagnostic[] = await scanFile('path_to_file');

    for (let diagnostic of allDiagnostics) {
        console.log(diagnostic);
    }

    var fileContent: string = readFileSync(filePath, 'utf8');

    //use the scan method with the string content of the file
    var allDiagnosticsFromContent: InclusiveDiagnostic[] = await scan(fileContent);

    for (let diagnostic of allDiagnosticsFromContent) {
        console.log(diagnostic);
    }
}

main();
```

So, basically there are two methods you can use to have inclusive diagnostics:

``` typescript
    async function scanFile(filePath: string): Promise<InclusiveDiagnostic[]>
```

Async method that receives a path to the file you want to have a diagnostic and return a list of
InclusiveDiagnostic.

``` typescript
    async function scan(fileContent: string): Promise<InclusiveDiagnostic[]>
```

Async method that receives the string content you want to have a diagnostic and return a list of
InclusiveDiagnostic.

The object that is being returned as a component of a list has the following properties:

``` typescript
interface InclusiveDiagnostic {
    /**
     * Line number in which the diagnostic is pointing to.
     */
    lineNumber: number;
    /**
     * Term found by the linter.
     */
    term: string;
    /**
     * Occurrence start index related to the whole file - line breaks are considered as common characters.
     */
    termStartIndex: number;
    /**
     * Occurrence end index related to the whole file - line breaks are considered as common characters.
     */
    termEndIndex: number;
    /**
     * Occurrence start index of the corresponding line.
     */
    termLineStartIndex: number;
    /**
     * Occurrence end index of the corresponding line.
     */
    termLineEndIndex: number;
    /**
     * Suggested terms to be used.
     */
    suggestedTerms: string;
}
```

### Using as a command line tool

Once you run the command to install the library, you will also be able to use the command line.
Use the same command to install the library:

``` sh
npm install inclusivelint
```

There are two parameters you can use to run the command line:

``` txt
-p, --path <path>  Path to be scaned. If its a folder, use the -r ou --resursive option
-r, --recursive    If the --path option is a folder, use this option to run recursively. Not needed if its path is a file
```

In other words, to run the command recursively, do this:

``` sh
inclusivelint -r -p path_to_be_scanned
```

To run in a single file, do:

``` sh
inclusivelint -p path_to_the_file_to_be_scanned
```
