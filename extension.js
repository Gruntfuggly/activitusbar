
var vscode = require( 'vscode' );

function activate()
{
    function addButton( label, command )
    {
        var button = vscode.window.createStatusBarItem( vscode.StatusBarAlignment.Left, 99999 );
        button.text = label;
        button.command = command;
        button.show();
    }

    addButton( "$(file-text)", "workbench.view.explorer" );
    addButton( "$(search)", "workbench.view.search" );
    addButton( "$(repo-forked)", "workbench.view.scm" );
    addButton( "$(bug)", "workbench.view.debug" );
    addButton( "$(package)  ", "workbench.view.extensions" );
}
exports.activate = activate;

function deactivate()
{
}
exports.deactivate = deactivate;