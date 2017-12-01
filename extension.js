
var vscode = require( 'vscode' );

var defaultViews = 'explorer,search,scm,debug,extensions';
var views = vscode.workspace.getConfiguration( 'activitusbar' )
    .get( 'views', defaultViews )
    .toLowerCase()
    .replace( /\s/g, '' )
    .split( ',' );

var icons = { explorer: "file-text", search: "search", scm: "repo-forked", debug: "bug", extensions: "package" };
var buttons = [];

var open = 'hide';
var startingPriority = vscode.workspace.getConfiguration( 'activitusbar' ).get( 'priority', '99999' );;

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
        vscode.commands.executeCommand( "workbench.action.toggleSidebarVisibility" );
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

function toggleExplorerView() { toggleView( 'explorer' ); }
function toggleScmView() { toggleView( 'scm' ); }
function toggleDebugView() { toggleView( 'debug' ); }
function toggleExtensionsView() { toggleView( 'extensions' ); }
function toggleSearchView() { toggleView( 'search' ); }
function showExplorerView() { showView( 'explorer' ); }
function showScmView() { showView( 'scm' ); }
function showDebugView() { showView( 'debug' ); }
function showExtensionsView() { showView( 'extensions' ); }
function showSearchViewWithSelection()
{
    showView( 'search' );
    vscode.commands.executeCommand( "workbench.action.findInFilesWithSelectedText" );
}
function showReplaceViewWithSelection()
{
    showView( 'search' );
    vscode.commands.executeCommand( "workbench.action.replaceInFilesWithSelectedText" );
}

function activate( context )
{
    var priority = startingPriority;

    function addButton( label, command )
    {
        var button = vscode.window.createStatusBarItem( vscode.StatusBarAlignment.Left, priority-- );
        button.text = '$(' + label + ')';
        button.command = command;
        button.color = priority === startingPriority ? activeColour() : inactiveColour();
        button.show();
        return button;
    }

    views.forEach( function( view )
    {
        buttons[ view ] = addButton( icons[ view ], 'activitusbar.toggle' + view.capitalize() + 'View' );
    } );

    context.subscriptions.push(
        vscode.commands.registerCommand( 'activitusbar.toggleExplorerView', toggleExplorerView ),
        vscode.commands.registerCommand( 'activitusbar.toggleSearchView', toggleSearchView ),
        vscode.commands.registerCommand( 'activitusbar.toggleScmView', toggleScmView ),
        vscode.commands.registerCommand( 'activitusbar.toggleDebugView', toggleDebugView ),
        vscode.commands.registerCommand( 'activitusbar.toggleExtensionsView', toggleExtensionsView ),
        vscode.commands.registerCommand( 'activitusbar.showExplorerView', showExplorerView ),
        vscode.commands.registerCommand( 'activitusbar.showScmView', showScmView ),
        vscode.commands.registerCommand( 'activitusbar.showDebugView', showDebugView ),
        vscode.commands.registerCommand( 'activitusbar.showExtensionsView', showExtensionsView ),
        vscode.commands.registerCommand( 'activitusbar.showSearchViewWithSelection', showSearchViewWithSelection ),
        vscode.commands.registerCommand( 'activitusbar.showReplaceViewWithSelection', showReplaceViewWithSelection ) );
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;
