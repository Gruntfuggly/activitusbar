var vscode = require( 'vscode' );

function getTokenColours( callback )
{
    vscode.commands.executeCommand( 'workbench.action.generateColorTheme' ).then( function()
    {
        if( vscode.window.activeTextEditor )
        {
            var text = vscode.window.activeTextEditor.document.getText();
            // clean the editor so when it asked to close it will not ask the user if they want to save the file
            vscode.window.activeTextEditor.edit( function( editor )
            {
                editor.delete( new vscode.Range( new vscode.Position( 0, 0 ), new vscode.Position( 10000, 100000 ) ) );
            } );
            vscode.commands.executeCommand( 'workbench.action.closeActiveEditor' );
            var colours = {};
            var colourRegex = /"([a-z.]+)": "(#[a-f0-9]{6,8})"/igm;
            var match;

            do
            {
                match = colourRegex.exec( text );
                if( match )
                {
                    colours[ match[ 1 ] ] = match[ 2 ];
                }
            } while( match );
            callback( colours );
        }
        else
        {
            callback();
        }
    } );
}
module.exports.getTokenColours = getTokenColours;