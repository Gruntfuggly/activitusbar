
var vscode = require( 'vscode' );

var childProcess = require( 'child_process' );
var fs = require( 'fs' );
var path = require( 'path' );

var colourNames = require( './colourNames.js' );
var themeColourNames = require( './themeColourNames.js' );

var countTimeout;
var fileSystemWatcher;

function activate( context )
{
    var viewNames = [];
    var commands = [];
    var buttons = {};
    var spacers = [];
    var open = 'hide';

    var mapping = {
        "settings": {
            "codicon": "settings-gear",
            "tooltip": "Settings"
        },
        "explorer": {
            "codicon": "files",
            "tooltip": "Explorer",
            "command": "workbench.view.explorer"
        },
        "search": {
            "codicon": "search",
            "tooltip": "Search",
            "command": "workbench.view.search"
        },
        "scm": {
            "codicon": "source-control",
            "tooltip": "Source Control",
            "command": "workbench.view.scm"
        },
        "debug": {
            "codicon": "debug",
            "tooltip": "Debug",
            "command": "workbench.view.debug"
        },
        "extensions": {
            "codicon": "extensions",
            "tooltip": "Extensions",
            "command": "workbench.view.extensions"
        },
        "problems": {
            "codicon": "warning",
            "tooltip": "Problems",
            "command": "workbench.actions.view.problems"
        },
        "output": {
            "codicon": "output",
            "tooltip": "Output",
            "command": "workbench.panel.output.focus"
        },
        "terminal": {
            "codicon": "terminal",
            "tooltip": "Terminal",
            "command": "workbench.action.terminal.focus"
        },
        "debugConsole": {
            "codicon": "debug-console",
            "tooltip": "Debug Console",
            "command": "workbench.debug.action.toggleRepl"
        }
    };

    var priority;
    var startingPriority;

    String.prototype.capitalize = function()
    {
        return this.replace( /(?:^|\s)\S/g, function( a ) { return a.toUpperCase(); } );
    };

    function getColour( setting, defaultColour )
    {
        var colour = vscode.workspace.getConfiguration( 'activitusbar' ).get( setting ).trim();
        if( colour && colourNames.indexOf( colour.toLowerCase() ) === -1 )
        {
            if( colour[ 0 ] !== '#' )
            {
                if( themeColourNames.indexOf( colour ) !== -1 )
                {
                    colour = new vscode.ThemeColor( colour );
                }
                else
                {
                    vscode.window.showInformationMessage( "Unrecognised theme colour:" + colour );
                    colour = undefined;
                }
            }
        }
        if( !colour )
        {
            colour = new vscode.ThemeColor( defaultColour );
        }
        return colour;

    }

    function inactiveColour()
    {
        return getColour( 'inactiveColour', 'activityBar.inactiveForeground' );
    }

    function activeColour()
    {
        return getColour( 'activeColour', 'activityBar.foreground' );
    }

    function build()
    {
        function deselect()
        {
            viewNames.forEach( function( view )
            {
                if( buttons[ view ] )
                {
                    buttons[ view ].color = inactiveColour();
                }
            } );
        }

        function highlightView( view )
        {
            if( buttons[ view ] )
            {
                buttons[ view ].color = activeColour();
            }
            open = view;
        }

        function showView( view )
        {
            var command = mapping[ view ] ? mapping[ view ].command : 'workbench.view.' + view;
            vscode.commands.executeCommand( command );
            deselect();
            highlightView( view );
        }

        function toggleView( view )
        {
            deselect();
            if( open === view || view === 'hide' )
            {
                if( vscode.workspace.getConfiguration( 'activitusbar' ).get( 'toggleSidebar' ) )
                {
                    if( view === 'search' && vscode.workspace.getConfiguration( 'activitusbar' ).get( 'searchViewInPanel' ) === true )
                    {
                        vscode.commands.executeCommand( "workbench.action.togglePanel" );
                    }
                    else
                    {
                        vscode.commands.executeCommand( "workbench.action.toggleSidebarVisibility" );
                    }
                }
                else
                {
                    if( buttons[ view ] )
                    {
                        buttons[ view ].color = activeColour();
                    }
                    showView( view );
                }
                if( open === 'hide' )
                {
                    if( buttons[ view ] )
                    {
                        buttons[ view ].color = activeColour();
                    }
                }
                else
                {
                    open = 'hide';
                }
            }
            else
            {
                showView( view );
            }
        }

        function showSearchViewWithSelection()
        {
            vscode.commands.executeCommand( "workbench.action.findInFiles" );
            deselect();
            highlightView( 'search' );
        }

        function showReplaceViewWithSelection()
        {
            vscode.commands.executeCommand( "workbench.action.replaceInFiles" );
            deselect();
            highlightView( 'search' );
        }

        function makeShowView( view )
        {
            return function()
            {
                showView( view );
            };
        }

        function makeToggleView( view )
        {
            return function()
            {
                toggleView( view );
            };
        }

        function addSpacer( icon )
        {
            var alignment = vscode.StatusBarAlignment[ vscode.workspace.getConfiguration( 'activitusbar' ).get( 'alignment', "Left" ) ];
            var button = vscode.window.createStatusBarItem( alignment, priority-- );
            button.text = icon ? '$(' + icon + ')' : ' ';
            button.color = inactiveColour();
            button.show();

            return button;
        }

        function addButton( icon, command, viewName, tooltip, label )
        {
            var alignment = vscode.StatusBarAlignment[ vscode.workspace.getConfiguration( 'activitusbar' ).get( 'alignment', "Left" ) ];
            var button = vscode.window.createStatusBarItem( alignment, priority-- );
            button.text = '$(' + icon + ')' + ( label ? ' ' + label : '' );
            button.command = command;
            button.tooltip = tooltip ? tooltip : ( mapping[ viewName ] ? mapping[ viewName ].tooltip : "" );
            button.color = inactiveColour();
            if( open === viewName )
            {
                button.color = activeColour();
            }
            button.show();

            return button;
        }

        function addTaskButton( icon, command, taskName, tooltip, label )
        {
            var alignment = vscode.StatusBarAlignment[ vscode.workspace.getConfiguration( 'activitusbar' ).get( 'alignment', "Left" ) ];
            var button = vscode.window.createStatusBarItem( alignment, priority-- );
            button.text = '$(' + icon + ')' + ( label ? ' ' + label : '' );
            button.command = command;
            button.color = inactiveColour();
            button.tooltip = tooltip ? tooltip : "Run task " + taskName;
            button.show();
            return button;
        }

        function addCommandButton( icon, command, tooltip, label )
        {
            var alignment = vscode.StatusBarAlignment[ vscode.workspace.getConfiguration( 'activitusbar' ).get( 'alignment', "Left" ) ];
            var button = vscode.window.createStatusBarItem( alignment, priority-- );
            button.text = '$(' + icon + ')' + ( label ? ' ' + label : '' );
            button.command = command;
            button.color = inactiveColour();
            button.tooltip = tooltip ? tooltip : "Run command '" + command + "'";
            button.show();
            return button;
        }

        function addSettingsButton( icon, tooltip, label )
        {
            var alignment = vscode.StatusBarAlignment[ vscode.workspace.getConfiguration( 'activitusbar' ).get( 'alignment', "Left" ) ];
            var button = vscode.window.createStatusBarItem( alignment, priority-- );
            button.text = '$(' + icon + ')' + ( label ? ' ' + label : '' );
            button.command = "workbench.action.openSettings";
            button.color = inactiveColour();
            button.tooltip = tooltip ? tooltip : "Open settings";
            button.show();
            return button;
        }

        function getIcon( view )
        {
            var icon = view.codicon ? view.codicon : view.octicon;
            if( !icon && view.name )
            {
                icon = mapping[ view.name ] ? mapping[ view.name ].codicon : "smiley";
            }
            return icon;
        }

        function createButtons()
        {
            spacers.forEach( button => button.dispose() );
            Object.keys( buttons ).forEach( button => buttons[ button ].dispose() );
            buttons = {};
            commands.forEach( command => command.dispose() );
            commands = [];

            var views = vscode.workspace.getConfiguration( 'activitusbar' ).inspect( 'views' );
            var definedViews = vscode.workspace.getConfiguration( 'activitusbar' ).get( 'views' );
            if( vscode.workspace.getConfiguration( 'activitusbar' ).get( 'combineWorkspaceSettings' ) && views.globalValue )
            {
                definedViews = views.globalValue;
                if( views.workspaceValue )
                {
                    views.workspaceValue.map( function( view )
                    {
                        definedViews.push( view );
                    } );
                }
            }

            startingPriority = vscode.workspace.getConfiguration( 'activitusbar' ).get( 'priority', '99999' );

            priority = startingPriority;

            if( definedViews )
            {
                definedViews.forEach( function( view )
                {
                    var command;
                    if( !view.name )
                    {
                        spacers.push( addSpacer( getIcon( view ) ) );
                    }
                    else if( !buttons.hasOwnProperty( view.name ) )
                    {
                        if( view.name.toLowerCase().indexOf( "task." ) === 0 )
                        {
                            var taskName = view.name.substr( 5 );
                            var dotPosition = taskName.indexOf( '.' );
                            var workspace;
                            if( dotPosition > -1 )
                            {
                                workspace = taskName.substr( 0, dotPosition );
                                taskName = taskName.substr( dotPosition + 1 );
                            }

                            vscode.tasks.fetchTasks().then( function( availableTasks )
                            {
                                var found = false;
                                availableTasks.map( function( task )
                                {
                                    if( task.name === taskName && ( workspace === undefined || task.scope.name === workspace ) )
                                    {
                                        found = true;
                                        command = 'activitusbar.startTask' + taskName;
                                        buttons[ view.name ] = buttons[ view.name ] = addTaskButton( getIcon( view ), command, taskName, view.tooltip, view.label );
                                        commands.push( vscode.commands.registerCommand( command, function()
                                        {
                                            vscode.tasks.executeTask( task );
                                        } ) );
                                    }
                                } );
                                if( found === false )
                                {
                                    vscode.window.showErrorMessage( "Failed to create button for task '" + taskName + "'" );
                                }
                            } );
                        }
                        else if( view.name.toLowerCase().indexOf( "command." ) === 0 )
                        {
                            var commandName = view.name.substr( 8 );
                            buttons[ view.name ] = addCommandButton( getIcon( view ), commandName, view.tooltip, view.label );
                        }
                        else if( view.name.toLowerCase() === "settings" )
                        {
                            buttons[ view.name ] = addSettingsButton( getIcon( view ), view.tooltip, view.label );
                        }
                        else
                        {
                            var commandKey = view.name.capitalize() + 'View';
                            command = 'activitusbar.toggle' + commandKey;
                            viewNames.push( view.name );
                            buttons[ view.name ] = addButton( getIcon( view ), command, view.name, view.tooltip, view.label );
                            commands.push( vscode.commands.registerCommand( command, makeToggleView( view.name ) ) );

                            if( view.name !== 'search' )
                            {
                                commands.push( vscode.commands.registerCommand( 'activitusbar.show' + commandKey, makeShowView( view.name ) ) );
                            }
                        }
                    }
                } );
            }
        }

        function setScmCount( count )
        {
            if( buttons.scm !== undefined )
            {
                var views = vscode.workspace.getConfiguration( 'activitusbar' ).get( 'views' );
                views.map( function( view )
                {
                    if( view.name === 'scm' )
                    {
                        var icon = getIcon( view );
                        buttons.scm.text = '$(' + icon + ')' + ( count > 0 ? count : '' ) + ( view.label ? ' ' + view.label : '' );
                    }
                } );
            }
        }

        function updateScmCount()
        {
            if( vscode.window.state.focused === true )
            {
                if( buttons.scm !== undefined )
                {
                    var total = 0;
                    if( vscode.workspace.workspaceFolders )
                    {
                        vscode.workspace.workspaceFolders.map( function( folder )
                        {
                            try
                            {
                                var gitFolder = childProcess.execSync( 'git -C ' + folder.uri.fsPath + ' rev-parse --show-toplevel 2>/dev/null' ).toString();
                                var locked = fs.existsSync( path.join( gitFolder, '.git', 'index.lock' ) );
                                if( locked === false )
                                {
                                    var raw = childProcess.execSync( 'git -C ' + folder.uri.fsPath + ' status -s | wc -l' );
                                    var changes = parseInt( raw );
                                    total += changes;
                                }
                            } catch( error )
                            {
                                // Probably not in a git repo
                            }
                        } );
                        count = total;
                    }

                    setScmCount( total );
                }
            }
        }

        function resetFilewatcher()
        {
            if( fileSystemWatcher !== undefined )
            {
                fileSystemWatcher.dispose();
            }

            if( vscode.workspace.getConfiguration( 'activitusbar' ).get( 'showSourceControlCounter' ) !== false )
            {
                fileSystemWatcher = vscode.workspace.createFileSystemWatcher( '**/*' );

                context.subscriptions.push( fileSystemWatcher );

                fileSystemWatcher.onDidChange( triggerScmCount );
                fileSystemWatcher.onDidCreate( triggerScmCount );
                fileSystemWatcher.onDidDelete( triggerScmCount );

                updateScmCount();
            }
            else
            {
                setScmCount( 0 );
            }

        }

        function triggerScmCount()
        {
            clearTimeout( countTimeout );
            countTimeout = setTimeout( updateScmCount, 1000 );
        }

        context.subscriptions.push(
            vscode.commands.registerCommand( 'activitusbar.showSearchViewWithSelection', showSearchViewWithSelection ),
            vscode.commands.registerCommand( 'activitusbar.showReplaceViewWithSelection', showReplaceViewWithSelection ) );

        context.subscriptions.push( vscode.workspace.onDidChangeConfiguration( function( e )
        {
            if( e.affectsConfiguration( "activitusbar" ) )
            {
                createButtons();
                resetFilewatcher();
            }
        } ) );

        context.subscriptions.push( vscode.window.onDidChangeWindowState( function( e )
        {
            if( e && e.focused )
            {
                if( vscode.workspace.getConfiguration( 'activitusbar' ).get( 'showSourceControlCounter' ) !== false )
                {
                    updateScmCount();
                }
            }
        } ) );

        createButtons();

        resetFilewatcher();
    }

    build();
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;