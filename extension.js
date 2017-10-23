
var vscode = require( 'vscode' );

var defaultViews = 'explorer,search,scm,debug,extensions';
var views = vscode.workspace.getConfiguration( 'activitusbar' )
    .get( 'views', defaultViews )
    .toLowerCase()
    .replace( /\s/g, '' )
    .split( ',' );

var icons = { explorer: "file-text", search: "search", scm: "repo-forked", debug: "bug", extensions: "package" };
var buttons = [];

var startingPriority = 99999;

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

function selectView( view )
{
    deselect();
    vscode.commands.executeCommand( 'workbench.view.' + view );
    buttons[ view ].color = activeColour();
}

function selectExplorerView() { selectView( 'explorer' ); }
function selectSearchView() { selectView( 'search' ); }
function selectScmView() { selectView( 'scm' ); }
function selectDebugView() { selectView( 'debug' ); }
function selectExtensionsView() { selectView( 'extensions' ); }

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
        buttons[ view ] = addButton( icons[ view ], 'activitusbar.select' + view.capitalize() + 'View' );
    } );

    context.subscriptions.push(
        vscode.commands.registerCommand( 'activitusbar.selectExplorerView', selectExplorerView ),
        vscode.commands.registerCommand( 'activitusbar.selectSearchView', selectSearchView ),
        vscode.commands.registerCommand( 'activitusbar.selectScmView', selectScmView ),
        vscode.commands.registerCommand( 'activitusbar.selectDebugView', selectDebugView ),
        vscode.commands.registerCommand( 'activitusbar.selectExtensionsView', selectExtensionsView ) );
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;