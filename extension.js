
var vscode = require( 'vscode' );

function activate( context )
{
    var views = [];
    var commands = [];
    var buttons = [];
    var open = 'hide';
    var priority;
    var startingPriority;

    String.prototype.capitalize = function()
    {
        return this.replace( /(?:^|\s)\S/g, function( a ) { return a.toUpperCase(); } );
    };

    function inactiveColour()
    {
        return vscode.workspace.getConfiguration('activitusbar').get('inactiveColour') || new vscode.ThemeColor('statusBar.foreground');
    }

    function activeColour()
    {
        return vscode.workspace.getConfiguration('activitusbar').get('activeColour');
    }

    function build()
    {
        function deselect()
        {
            views.forEach( function( view )
            {
                if( buttons[ view ] )
                {
                    buttons[ view ].color = inactiveColour();
                }
            } );
        }

        function showView( view )
        {
            deselect();
            vscode.commands.executeCommand( 'workbench.view.' + view );
            if( buttons[ view ] )
            {
                buttons[ view ].color = activeColour();
            }
            open = view;
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
            showView( 'search' );
            vscode.commands.executeCommand( "workbench.action.findInFilesWithSelectedText" );
        }

        function showReplaceViewWithSelection()
        {
            showView( 'search' );
            vscode.commands.executeCommand( "workbench.action.replaceInFiles" );
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

        function addButton( label, command, view )
        {
            var alignment = vscode.StatusBarAlignment[ vscode.workspace.getConfiguration( 'activitusbar' ).get( 'alignment', "Left" ) ];
            var button = vscode.window.createStatusBarItem( alignment, priority-- );
            button.text = '$(' + label + ')';
            button.command = command;
            button.color = priority === startingPriority ? activeColour() : inactiveColour();
            if( open === view )
            {
                button.color = activeColour();
            }
            button.show();

            return button;
        }

        function addTaskButton( label, command )
        {
            var alignment = vscode.StatusBarAlignment[ vscode.workspace.getConfiguration( 'activitusbar' ).get( 'alignment', "Left" ) ];
            var button = vscode.window.createStatusBarItem( alignment, priority-- );
            button.text = '$(' + label + ')';
            button.command = command;
            button.color = inactiveColour();
            button.show();
            return button;
        }

        function createButtons()
        {
            Object.keys( buttons ).forEach( button => buttons[ button ].dispose() );
            buttons = [];
            commands.forEach( command => command.dispose() );
            commands = [];

            var definedViews = vscode.workspace.getConfiguration( 'activitusbar' ).views;
            views = Object.keys( definedViews ).filter( v => definedViews[ v ].length > 0 );
            startingPriority = vscode.workspace.getConfiguration( 'activitusbar' ).get( 'priority', '99999' );;

            priority = startingPriority;

            views.forEach( function( view )
            {
                var command;
                if( view.indexOf( "task." ) === 0 )
                {
                    var taskName = view.substr( 5 );
                    vscode.tasks.fetchTasks().then( function( availableTasks )
                    {
                        availableTasks.map( function( task )
                        {
                            if( task.name === taskName )
                            {
                                command = 'activitusbar.startTask' + taskName;
                                buttons[ view ] = addTaskButton( vscode.workspace.getConfiguration( 'activitusbar' ).views[ view ], command );
                                commands.push( vscode.commands.registerCommand( command, function()
                                {
                                    vscode.tasks.executeTask( task );
                                } ) );
                            }
                        } );
                    } );
                }
                else
                {
                    var commandKey = view.capitalize() + 'View'
                    command = 'activitusbar.toggle' + commandKey;
                    buttons[ view ] = addButton( vscode.workspace.getConfiguration( 'activitusbar' ).views[ view ], command, view );
                    commands.push( vscode.commands.registerCommand( command, makeToggleView( view ) ) );

                    if( view !== 'search' )
                    {
                        commands.push( vscode.commands.registerCommand( 'activitusbar.show' + commandKey, makeShowView( view ) ) );
                    }
                }
            } );
        }

        context.subscriptions.push(
            vscode.commands.registerCommand( 'activitusbar.showSearchViewWithSelection', showSearchViewWithSelection ),
            vscode.commands.registerCommand( 'activitusbar.showReplaceViewWithSelection', showReplaceViewWithSelection ) );

        context.subscriptions.push( vscode.workspace.onDidChangeConfiguration( function( e )
        {
            if( e.affectsConfiguration( "activitusbar" ) )
            {
                createButtons();
            }
        } ) );

        createButtons();
    }

    function updateDeprecatedConfiguration()
    {
        var viewConfig = vscode.workspace.getConfiguration( 'activitusbar' ).views;

        if( typeof ( viewConfig ) === "string" )
        {
            var originalConfig = viewConfig;

            viewConfig = {
                "explorer": "file-text",
                "search": "search",
                "scm": "repo-forked",
                "debug": "bug",
                "extensions": "package",
            };

            Object.keys( viewConfig ).map( v =>
            {
                if( originalConfig.indexOf( v ) === -1 )
                {
                    viewConfig[ v ] = "";
                }
            } );

            vscode.workspace.getConfiguration( 'activitusbar' ).update( 'views', viewConfig, true ).then( build );
        }
        else
        {
            build();
        }
    }

    updateDeprecatedConfiguration();
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;
