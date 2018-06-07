
var vscode = require( 'vscode' );

function activate( context )
{
    var views;

    String.prototype.capitalize = function()
    {
        return this.replace( /(?:^|\s)\S/g, function( a ) { return a.toUpperCase(); } );
    };

    function inactiveColour()
    {
        return vscode.workspace.getConfiguration( 'activitusbar' ).get( 'inactiveColour', '#bbb' );
    }

    function activeColour()
    {
        return vscode.workspace.getConfiguration( 'activitusbar' ).get( 'activeColour', '#fff' );
    }

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

    function build()
    {
        function deselect()
        {
            views.forEach( function( view )
            {
                buttons[ view ].color = inactiveColour();
            } );
        }

        function showView( view )
        {
            deselect();
            vscode.commands.executeCommand( 'workbench.view.' + view );
            buttons[ view ].color = activeColour();
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
                    buttons[ view ].color = activeColour();
                }
                if( open === 'hide' )
                {
                    buttons[ view ].color = activeColour();
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

        function addButton( label, command )
        {
            var button = vscode.window.createStatusBarItem( vscode.StatusBarAlignment.Left, priority-- );
            button.text = '$(' + label + ')';
            button.command = command;
            button.color = priority === startingPriority ? activeColour() : inactiveColour();
            button.show();
            return button;
        }

        views = Object.keys( viewConfig ).filter( v => viewConfig[ v ].length > 0 );

        var buttons = [];

        var open = 'hide';
        var startingPriority = vscode.workspace.getConfiguration( 'activitusbar' ).get( 'priority', '99999' );;

        var priority = startingPriority;

        views.forEach( function( view )
        {
            var commandKey = view.capitalize() + 'View'
            var command = 'activitusbar.toggle' + commandKey;
            buttons[ view ] = addButton( vscode.workspace.getConfiguration( 'activitusbar' ).views[ view ], command );
            vscode.commands.registerCommand( command, makeToggleView( view ) );

            if( view !== 'search' )
            {
                vscode.commands.registerCommand( 'activitusbar.show' + commandKey, makeShowView( view ) );
            }
        } );

        context.subscriptions.push(
            vscode.commands.registerCommand( 'activitusbar.showSearchViewWithSelection', showSearchViewWithSelection ),
            vscode.commands.registerCommand( 'activitusbar.showReplaceViewWithSelection', showReplaceViewWithSelection ) );

    }
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;
