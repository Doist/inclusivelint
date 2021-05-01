# inclusivelint

Fork of [inclusivelint/inclusivelint-lib](https://github.com/inclusivelint/inclusivelint-lib), with some additions:
- Configurable dictionary url via the `-d` flag.
- Support for multiple comma-separated paths.
- Available as a GitHub Action.

Example usage:

```
on: [push]

jobs:
  inclusivelint:
    runs-on: ubuntu-latest
    name: Lint project for non-inclusive words
    steps:
    - name: Inclusivelint
      uses: Doist/inclusivelint@1.0.0
      with:
        args: '-p $GITHUB_WORKSPACE -r -i .git/**,src/wordsTable.md'
```
