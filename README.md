# Activitus Bar

One of my work colleagues was complaining about the activity bar wasting too much space, so this simply puts icons on the status bar that open the views of the activity bar. You can then hide the activity bar from the View menu...

### New for version 0.0.2

The buttons are now configurable, using `activitusbar.views`. This is a string of comma separated view names. By default, all views are enabled, i.e. **"explorer,search,scm,debug,extensions"**. If you change the configured views, you'll need to reload the window. (Press F1, type reload).

This extension also rebinds the view selection keys. If you have modified the default key bindings, this may be an issue.

The colour of the active and inactive buttons can also be specified using `activitusbar.activeColour` and `activitusbar.inactiveColour`. By default these are white (`#fff`) and grey (`#bbb`).

_Note: Because there is no way to know when a view has been selected, the currently active view will not stay in sync if the normal activity bar is used._

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.activitusbar).

Alternatively, open Visual Studio code, press `Ctrl+P` or `Cmd+P` and type:

    > ext install activitusbar

### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/activitusbar).
