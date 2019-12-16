# 0.4.0 - Under development

- ADDED
  - Toasts
  - Pagination
- REMOVED
- IMPROVED
- BUGFIXES

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
- BUFIXES
