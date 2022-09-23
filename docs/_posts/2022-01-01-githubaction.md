---
date: 2022-01-04
title: GitHub Action
categories:
   - install
author_staff_member: merill
---

The Inclusiveness Analyzer is a GitHub action that checks your repository for exclusive content, while suggesting more inclusive language you can use instead. This can be used by any of your repositories on GitHub!

# How it works

This GitHub action can be added to your build workflow to be triggered on each push or pull request. Once set up you will benefit from the automated detection of non-inclusive terms that could make their way into your application and your docs.

View and install [Inclusiveness Analyzer from the GitHub Action Marketplace](https://github.com/marketplace/actions/inclusiveness-analyzer)

## Add Inclusive Analyzer action to your build workflow

* In your GitHub repository, select the **Actions** tab and either add or edit a workflow.
* Search for **Inclusiveness Analyzer** from the **Marketplace** tab on the right.
* Copy and paste the yaml into your workflow.

![Screenshot showing Inclusiveness Analyzer being added to a build.]({{ site.url }}/images/ghscreenshot-1.png)

* Commit your changes to trigger the workflow or run the workflow manually
* The Annotations view will show the first ten non-inclusive terms that are found.
* You can select the Jobs detail log to view all the instances of non-inclusive terms.

![Screenshot showing Inclusiveness Analyzer warning of the work blacklist being used.]({{ site.url }}/images/ghscreenshot-2.png)

### Action configuration options

Use the options below to configure exclusions and build state when non-inclusive terms are found in the repository.

**`failStep`**

If `true` the build is failed if non-inclusive terms are found.

If `false` (Default) the build completes successfully and warnings are provided in the logs.


<br/>**`excludeUnchangedFiles`**

If `true` (Default) limits the scan to files changed in the latest commit. If `false` a full scan is run on each commit.

The git checkout step needs to have at least 'with: fetch-depth: 2' configured.|

<br/>**`excludeFromScan`**

Comma separated list of file patterns to exclude from analysis. [Glob patterns](https://github.com/isaacs/node-glob#glob-primer) are supported with a prefix of `**/`

Eg. `**/skipme.txt,**/donotscan/*`

<br/>**`excludeTerms`**

Comma separated list of non-inclusive terms to exclude from analysis.

Eg. `he,she`
