# 2.0.0-beta.4 - Under development

- ADDED
  - Autoprefix css generation updated
- REMOVED
- IMPROVED
- BUGFIXES

# 2.0.0-beta.3 - 2021-11-26

- ADDED
  - Waves (also known as ripple effect)
  - `--ax-form-material-active-border-style` && `--ax-form-material-active-border-width` css variables
  - SonarCloud to scan code & help to follow best practices
- REMOVED
  - `--ax-form-material-active-border` css variable
- IMPROVED
  - Typescript refactor : the whole codebase has been refactored for maintainability & IDE autocomplete feature
  - Code optimization
  - Sidenav resize event handler
  - Update dependencies
- BUGFIXES
  - Material forms css variables weren't personalizable per element but globally

# 2.0.0-beta.1 - 2021-09-24

Axentix v2 is here !  
This version is the first pre-release with a lot of changes.

If you use Axentix v1, please follow this [migration guide](https://useaxentix.com/2.0.x/docs/migration/).

Install v2 with `npm install axentix@next` command.

- ADDED
  - With v2, we want Axentix to be even more customizable. So, we have added a lot of css variables.  
    You can see them with components having a `styling` part on the docs. 
  - New CI/CD for Axentix repo. We have switched from Drone CI to Github Actions.
  - We have switched from Gulp to new Vite bundler. Our dependencies are much smaller.
  - You can now import each component independently using our `npm` way to download Axentix.
- REMOVED
  - Default `word-break` on card
  - `.footer-large` & `.footer-content` classes
  - `.sidenav-large` class
  - `.sidenav-trigger` default styling
  - `.modal-trigger` default styling
- IMPROVED
  - A lot of classes were renamed to follow the `.{componentName}-{class}` rule.  
    Please follow this [migration guide](https://useaxentix.com/2.0.x/docs/migration/) to see them
  - Layouts are easier to use
  - Update dependencies
  - Update modern-normalize to v1.1.0
  - `modal-overlay` & `sidenav-overlay` were replaced by `ax-overlay`
  - Our code organization was totally refactored
- BUGFIXES

**Don't forget, many features will come with future releases.**  

# 1.x & 0.x Changelog

Available on [v1 branch](https://github.com/axentix/axentix/tree/v1).