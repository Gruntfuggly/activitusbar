# Activitus Bar

One of my work colleagues was complaining about the activity bar wasting too much space, so this simply puts icons on the status bar that open the views of the activity bar. You can then hide the activity bar from the View menu...

## Configuration

The buttons are configurable, using `activitusbar.views`. This is a object containing view names, with their associated icons. By default, all standard are enabled, i.e. Explorer, Search, SCM, Debug and Extensions. To hide a button, set it's icon to an empty string (""). If you change the configured views, you'll need to reload the window. (Press F1, type reload).

This extension also rebinds the view selection keys. If you have modified the default key bindings, this may be an issue.

The colour of the active and inactive buttons can also be specified using `activitusbar.activeColour` and `activitusbar.inactiveColour`. By default these are white (`#fff`) and grey (`#bbb`).

If required, the position of the icons can be adjusted by changing the value of `activitusbar.priority`. It defaults to 99999 which should place them at the far left. You may need to experiment to find a value which suits.

Now that custom view containers are available, the configuration has been extended to support this. You'll need to find the name of the container. One way to find it is to inspect the package.json file of the extension that provides the view. Alternatively, go to *Preferences -> Keyboard Shortcuts*, then click the **keybindings.json** link near the top. If you then scroll to the bottom of the opened file, you should find commands for opening views, e.g. `workbench.view.extension.test`. The portion after the last dot is the name of the view. Note: If the command is not shown, it may already be assigned to a key definition, in which case search the file for `workbench.view.extension` to try to locate it.

Once you have the name of the view, choose an icon from the list of [octicons](https://octicons.github.com/) and add an entry to `activitusbar.views` with the format **"extension.*&lt;view name&gt;*": "&lt;icon-name&gt;"**, e.g.

`"extension.test": "beaker"`.

By default, clicking a button again will toggle the sidebar so that it is not visible. If you want to disable this behaviour, set 'activitusbar.toggleSidebar' to false.

One last option is 'activitusbar.searchViewInPanel'. If you move the search view to the panel (using the context menu) then set this to true to allow the panel to be toggled instead of the sidebar. *Note: Don't set this to true with the search view in the normal position!*

## Known Issues

Because there is no way to know when a view has been selected, the currently active view will not stay in sync if the normal activity bar is used.

If **Find in Files** is selected from the Edit Menu, again, the currently active view will become out of sync.

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.activitusbar).

Alternatively, open Visual Studio code, press `Ctrl+P` or `Cmd+P` and type:

    > ext install activitusbar

### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/activitusbar).
