const dragon = `
                   ___====-_  _-====___
             _--^^^#####//      \\\\#####^^^--_
          _-^##########// (    ) \\\\##########^-_
         -############//  |\\^^/|  \\\\############-
       _/############//   (@::@)   \\############\\_
      /#############((     \\\\//     ))#############\\
     -###############\\\\    (oo)    //###############-
    -#################\\\\  / VV \\  //#################-
   -###################\\\\/      \\//###################-
  _#/|##########/\\######(   /\\   )######/\\##########|\\#_
  |/ |#/\\#/\\#/\\/  \\#/\\##\\  |  |  /##/\\#/  \\/\\#/\\#/\\#| \\|
  \`  |/  V  V  \`   V  \\#\\| |  | |/#/  V   '  V  V  \\|  '
     \`   \`  \`      \`   / | |  | | \\   '      '  '   '
                      (  | |  | |  )
                     __\\ | |  | | /__
                    (vvv(VVV)(VVV)vvv)

      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

              Ailab神獸            專案永無Bug
`

export const logWarning = () => {
	console.info(
		`\n%c⚠️ Warning ⚠️%c \n%cPlease do not paste or enter any untrusted content into the browser console.\nDoing so may expose sensitive information or allow malicious scripts to compromise your personal data. Always be cautious when interacting with the developer tools.`,
		"color:#ceb73f; background: #ceb73f33; font-size:1.5rem; padding:0.15rem; margin: 1rem auto; font-family: Rockwell, Tahoma, 'Trebuchet MS', Helvetica; border: 2px solid #ceb73f; border-radius: 4px; font-weight: bold; text-shadow: 1px 1px 1px #000000bf;",
		'font-weight: bold; font-size: 1rem;color: #ceb73f;',
		"color: #ceb73f; font-size: 0.75rem; font-family: Tahoma, 'Trebuchet MS', Helvetica;"
	)
}

export const logGuardian = () => {
	console.log(`%c${dragon}`, 'color: green;')
}
