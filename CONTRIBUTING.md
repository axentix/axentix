# Contributing

Here are the guidelines to contribute to the **Axentix** project.

## Issues

The [issue tracker](https://github.com/axentix/axentix/issues) is the place where all the [bug reports](#bug-report) & [feature requests](#feature-request) are submitted.

Before opening an issue, make sure no one created it before to not get **duplicated issues**.

To open an issue, please use our issue templates.  
**All the steps** to create an appropriate issue are **written in the templates**.

### Bug report

Opening a **bug report** allows you to report a bug you've found using **Axentix**.  
Please use the **bug report template** to create a bug report issue in the [issue templates list](https://github.com/axentix/axentix/issues/new/choose).

### Feature request

Opening a **feature request** allows you to contribute to Axentix.  
Please use the **feature request template** to create a bug report issue in the [issue templates list](https://github.com/axentix/axentix/issues/new/choose).

### Using the issue tracker 

#### Reacting

To react to other issues, please use the [github reactions](https://github.blog/2016-03-10-add-reactions-to-pull-requests-issues-and-comments/).

#### Closing an issue

Close your own issues once a pull request related to it is merged, or if the issue was wrong.

#### Asking for help

If you just need help, join our **[discord server](https://discord.useaxentix.com/)**.  
Anyone can **help** each other and **share their projects** developed using **Axentix**.

## Pull requests

**Before opening a pull request**, make sure no one has **already opened** one for the same purpose.

### Opening a pull request

To open a **pull request**, please use our **pull request template**.  
All the steps to create an appropriate **pull request** are written in the template.

If your **pull request** is related to an open issue, make sure to **link it**.

### Reviewers

Make sure to add [@Xelzs](https://github.com/Xelzs) & [@Stallos](https://github.com/Stallos11)

### Closing a pull request

When a pull request is closed, make sure to close the related issues if existing.

## Tests

# End-to-end

Install browsers

```sh
npx playwright install
```

Run the tests

```sh
npm test
```

# Linux users

To start the test suite, you need to install this package 

```sh
# Example with apt based operating system
sudo apt-get install libenchant1c2a
```
---

To watch tests running in browsers, use this command

```sh
npm run test:watch
```