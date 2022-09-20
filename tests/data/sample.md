# Sample data for Inclusiveness Analyzer checks

This is sample file for testing locally and has non-inclusive words in it.

In VS Code, open pacakge.json and click on the Debug button above "scripts" (between lines 5 & 6).

Add a breakpoint anywhere and you can start debugging.

## Some words that will be found out by the analyzer

This is a sentence that uses he and she, this will be excluded during debug since we added them to the INPUT_EXCLUDETERMS param.

Here is another that uses blacklist, which is not a good thing.
