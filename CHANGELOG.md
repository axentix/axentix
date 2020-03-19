# 0.5.2 - 2020-03-19

- ADDED
  - `.h100` class
  - `.vstretch` & `.vself-stretch` classes
- REMOVED
- IMPROVED
- BUGFIXES
  - Axentix core doesn't init the components
  - Fab doesn't init in Axentix core
  - Handle card with stretch mode

# 0.5.1 - 2020-03-15

- ADDED
- REMOVED
- IMPROVED
- BUGFIXES
  - Tab bar incorrectly sized when resize event is triggered
  - Tab slide was enabling autoplay by default
  - Fix btn hoverable & light-hoverable
  - Caroulix `updateHeight` method rework
  - Caroulix resize event
  - Caroulix optimization
  - Collapsible height in sidenav
  - Fab hover method

# 0.5.0 - 2020-03-04

- ADDED
  - Caroulix
  - Tabs (basic, arrow mode, responsive, customizable)
  - [FAB] Floating Action Button
  - Event on all our components
  - Form switch (different sizes, thin option)
  - New `.light-shadow-{number}` classes
  - New `.light-hoverable-{number}` classes
  - sync() & reset() methods on all our components
  - sync() / syncAll() & reset() / resetAll() methods inside Axentix core
  - Grix `.pos-row-{breakpoint}{number}` functionality
  - `.font-w{number}` classes
  - `.overflow-` classes
  - Material forms `.form-rtl` functionality
  - Orange color
- REMOVED
- IMPROVED
  - All our js components have been optimized
  - Rework grey, yellow and warning colors
  - Rework shadows classes
  - Rework hoverable classes
  - Material forms color customization (css variables)
  - Sidenav `.right-aligned` detection
  - Collapsible sidenav detection
  - Update gulp integration
  - Update dev-dependencies of our sources files
- BUGFIXES
  - Sidenav bug with resize event
  - Padding generation bug

# 0.4.3 - 2020-01-27

- ADDED
- REMOVED
- IMPROVED
  - Increase priority of positions classes
  - Forms handle now reset & history back event
- BUGFIXES
  - Buttons in tables weren't display correctly
  - Textareas were always active with content inside

# 0.4.2 - 2020-01-22

- ADDED
  - Progress bar rainbow option on the indeterminate variant
  - Float classes
  - Flex direction classes
- REMOVED
- IMPROVED
  - Footer select line-height has been increased
  - Margins & paddings generation
- BUGFIXES
  - Card footer padding

# 0.4.1 - 2020-01-21

- ADDED
  - Toast "closable" option
  - Margins and Paddings classes
  - Toast `.change(content, options)` method
- REMOVED
  - Toast `.changeContent` & `.changeClasses` in favour of `.change` method
- IMPROVED
  - Change Toast option `displayTime` to `duration`
  - Rework pagination syntax
  - Rework all our event listeners
  - Rework toast javascript
  - You can now have 2 toasts at the same time and in different positions
- BUGFIXES
  - Material forms' span `.form-helper` was breaking the border bottom alignment
  - Correct card footer padding and remove `overflow: hidden;`
  - Correct the icons centering on the circle buttons
  - Remove default margins on inline forms
  - Remove default background-color on material forms
  - Fix `<a>` default color
  - `.striped`, `.border-0`, `.bordered` fix on table
  - Disable `word-break` on table thead

# 0.4.0 - 2019-12-31

**Navbar syntax changed & improved ! Please visit our docs !**

- ADDED
  - Toasts
  - Dropdown
  - Loading (spinner, progress bar), working with our color palette !
  - Pagination
  - Position classes
  - Cursor classes
- REMOVED
- IMPROVED
  - Totally reworked navbar
  - Some navbar properties are now in the \_variables.scss file
  - Axentix core
  - Forms detect function
- BUGFIXES
  - Forms don't handle some special input type

# 0.3.1 - 2019-12-11

- ADDED
  - Sidenav can now be placed on the right
- REMOVED
  - Buttons' text transform is not uppercase by default anymore
- IMPROVED
  - You can now disable auto init (Axentix method) with the .no-axentix-init class, and manually init the element
  - Sidenav link height increased to make it more SEO friendly
  - Modal have now bodyScrolling option like the Sidenav
- BUGFIXES
  - Button's height broken in sidenav
  - Hoverable class doesn't work with basic buttons

# 0.3.0 - 2019-11-24

**Sidenav link syntax changed ! Please add class="sidenav-link" to your `<a>` link.**

- ADDED
  - Hoverable classes
  - Text format classes
  - Material forms (inputs, checkbox, radio, textarea, .form-default, basic select) /!\ needs JavaScript
- REMOVED
- IMPROVED
  - Rework shadows classes
  - Better padding on cards
  - Rework sidenav link
  - Rework buttons
  - Improved checkbox / radio disabled state
  - White/light colors on outline buttons, use the .outline-invert on the span to get a black text on hover
- BUGFIXES
  - Sidenav header & footer height on safari fixed
  - The .form-check doesn't take the full width
  - Fixed Sidenav overflow with devices who don't support hover
  - Colspan borders in tables
  - 2 Collapsible in 2 differents Sidenav were closing the others collapsibles on click

# 0.2.0 - 2019-11-05

<b>
<p align="center">
/!\ IMPORTANT /!\
<p>
In this release we have changed many elements syntax like grix & sidenav.
Please check docs to make sure you have the latest release syntax.
</b>

---

- ADDED
  - Basic forms are here !
  - Cards with variants
  - Collapsible with options
  - Modals with variants
  - Outline buttons
  - .large class to sidenav to get a bigger sidenav (works in layouts !)
  - .rounded utilities
  - animationDelay option to Sidenav
  - .sidenav-footer in Sidenav
- REMOVED
- IMPROVED
  - Rework initialization of our JavaScript components (3 methods)
  - Grix columns class changed. Now .col-{breakpoint}{number}
  - Change sidenav syntax
  - Change default value of bodyScrolling option in sidenav to be more understandable
- BUGFIXES
  - Fix incorrect header and footer padding when using layouts
  - Fix sidenav not .fixed in layouts
  - Fix z-index with multiple sidenav in layouts
  - Fix grix nesting with col
  - Fix centered logo on navbar

# 0.1.2 - 2019-10-12

- ADDED
- REMOVED
- IMPROVED
- BUGFIXES
  - Fix responsive tables not working correctly.

# 0.1.1 - 2019-10-10

- ADDED
- REMOVED
- IMPROVED
- BUGFIXES
  - Fix critical bug on a:hover who apply on all components.

# 0.1.0 - 2019-10-10

We are very happy to present you the first release of Axentix.

- ADDED
  - Grix ! A lightweight (only 12.5kb for minified version) grid system using CSS-Grid
  - Own color palette with mixin generator for sass
  - Differents buttons styles
  - Tables
  - Basic and large footer
  - Basic an fixed navbar - Support logo and basic alignments
  - Layouts
  - Shadows
  - Sidenav
  - Some functions and mixins
  - Utilities classes (alignments, container, ...)
- REMOVED
- IMPROVED
- BUGFIXES
