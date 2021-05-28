# Activitus Bar Change Log

## v0.0.46 - 2021-05-28

- Disable SCM button counter by default

## v0.0.45 - 2021-05-21

- Remove colour picker change (shows an error when no colour is defined)

## v0.0.44 - 2021-05-21

- Allow colour picker to be used in settings.json
- Fix error when not in a git repo

## v0.0.43 - 2021-05-18

- Try not to interfere with external git processes (e.g. rebase)

## v0.0.42 - 2021-05-01

- Add counter to source control view button

## v0.0.41 - 2021-03-10

- Improve key bindings support

## v0.0.40 - 2021-03-09

- Update README.md with default settings

## v0.0.39 - 2021-03-09

- Add better default icons for supporting new product icon themes

## v0.0.38 - 2021-02-19

- Remove overridden keybindings (moved to README.md)

## v0.0.37 - 2020-12-07

- Fix terminal opening command

## v0.0.36 - 2020-10-06

- Make it clearer where to find view name, thanks to [dkniffin](https://github.com/dkniffin)
- Fix error when no settings are defined and combine is selected

## v0.0.35 - 2020-10-03

- Fix default debug button icon

## v0.0.34 - 2020-05-13

- Allow spacers in combined workspace settings

## v0.0.33 - 2020-05-13

- Reshow the view even if the extension thinks its active (when toggle is disabled)
- Allow separators to be configured
- Support combining of workspace and user settings

## v0.0.32 - 2020-05-01

- Validate colour and theme colour names
- Add default icons
- Use correct icons
- Support panel views

## v0.0.31 - 2020-04-28

- Use the status bar foreground for active icons by default
- Allow theme colours to be specified in configuration in addition to hex colour codes

## v0.0.30 - 2020-04-27

- Unless overridden by configuration, use activity bar foreground theme colours

## v0.0.29 - 2020-04-27

- Revert to previous version to avoid annoying editor being temporarily created

## v0.0.28 - 2020-04-21

- Unless overridden by configuration, use theme colours with inactive dimmed to 50%

## v0.0.27 - 2020-04-15

- Support alternate status bar modes, thanks to [notpushkin](https://github.com/notpushkin)

## v0.0.26 - 2020-03-24

- Add license

## v0.0.25 - 2020-02-07

- Fix tooltips for task, command and setting buttons
- Add support for optional labels

## v0.0.24 - 2020-02-03

- Add support for arbitrary commands
- Fix markdown issues in README.md and CHANGELOG.md

## v0.0.23 - 2020-01-21

- Update octicons to codicons

## v0.0.22 - 2020-01-21

- Support extension use in remote workspaces

## v0.0.21 - 2019-08-13

- Fix incorrect settings icon in README.md

## v0.0.20 - 2019-08-08

- Fix task button tooltips

## v0.0.19 - 2019-08-08

- Add example (default) configuration to README.md

## v0.0.18 - 2019-08-08

- Add button tooltips
- Add support for settings button
- Migrate settings to an array to make it easier to remove unwanted buttons
- Add error for failed task buttons

## v0.0.17 - 2019-03-27

- Remove default colours so that the extension plays nicely with extensions which change the status bar colour, thanks to [lochstar](https://github.com/lochstar)

## v0.0.16 - 2018-10-26

- Fix error when task buttons are defined

## v0.0.15 - 2018-10-25

- Add support for task buttons

## v0.0.14 - 2018-06-13

- Add alignment option
- Make configuration changes immediately rebuild the activitus bar without needing a reload

## v0.0.13 - 2018-06-07

- Fix opening of search view for replace

## v0.0.12 - 2018-05-16

- Add warning to README.md about missing octicons

## v0.0.11 - 2018-05-15

- Add support for custom view, thanks to [rosinality](https://github.com/rosinality)

## v0.0.10 - 2018-04-22

- Fix checking of searchViewInPanel setting

## v0.0.9 - 2018-04-22

- Add option to toggle panel instead of sidebar when the search view is moved to the bottom panel.

## v0.0.8 - 2018-04-22

- Add option to disable toggling of the sidebar

## v0.0.7 - 2017-12-01

- Update on 'replace in files' keyboard shortcut

## v0.0.6 - 2017-11-21

- Only toggle the views when clicking the buttons. Short cut keys always show the view.
- Added priority setting to allow the icons to be placed differently in the status bar

## v0.0.5 - 2017-11-20

- Show currently selected view when making the sidebar visible again
- Populate search box when opening find in files view

## v0.0.4 - 2017-11-19

- Added view toggle on button re-click (thanks Tadaboody)

## v0.0.3 - 2017-10-23

- Fixed stupid lowercase function

## v0.0.2 - 2017-10-23

- Added support for indicating active view
- Added support for configuring visible views

## v0.0.1 - 2017-07-26

- Initial release
