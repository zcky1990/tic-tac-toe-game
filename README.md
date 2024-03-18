# tic-tac-toe-game

Make sure you have redis installed and running on local and port 6379

Run this application run this command : 
`
rails s
`

This application have two play mode :
- Play in same page
- Play in different page

To play in same page:
- open browser, and access `localhost:3000`

To play multiplayer on different page : 
- Player one open browser, and access `localhost:3000/multiplayer` and click join
- Player one will be redirect to gameroom and will wait for player two
- Player two open browser, and access `localhost:3000/multiplayer` and click join
- Player two will joining to player one gameroom
- Wait for every player klik ready and play the game