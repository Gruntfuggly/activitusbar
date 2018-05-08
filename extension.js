
var vscode = require( 'vscode' );

var defaultViews = 'explorer,search,scm,debug,extensions';
var viewsItems = vscode.workspace.getConfiguration( 'activitusbar' )
    .get( 'views', defaultViews )
    .replace( /\s/g, '' )
    .split( ',' );
var viewsIcons = vscode.workspace.getConfiguration('activitusbar').get('viewsIcons');

var views = [];

viewsItems.forEach(function (view)
{
    views.push({ "command": view, "icon": viewsIcons[view] });
});

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
        buttons[ view.command ].color = inactiveColour();
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
        if( vscode.workspace.getConfiguration( 'activitusbar' ).get( 'toggleSidebar' ))
        {
            if( view === 'search' && vscode.workspace.getConfiguration( 'activitusbar' ).get( 'searchViewInPanel' ) === true) {
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
    vscode.commands.executeCommand( "workbench.action.replaceInFilesWithSelectedText" );
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
        var commandKey = view.command.capitalize() + 'View'
        var command = 'activitusbar.toggle' + commandKey;
        buttons[view.command] = addButton( view.icon, command );
        vscode.commands.registerCommand( command, makeToggleView( view.command ) );

        if (view.command !== 'search')
        {
            vscode.commands.registerCommand( 'activitusbar.show' + commandKey, makeShowView( view.command ) );
        }
    });



    context.subscriptions.push(
        vscode.commands.registerCommand( 'activitusbar.showSearchViewWithSelection', showSearchViewWithSelection ),
        vscode.commands.registerCommand( 'activitusbar.showReplaceViewWithSelection', showReplaceViewWithSelection ) );
}

function deactivate()
{
}

exports.activate = activate;
exports.deactivate = deactivate;
