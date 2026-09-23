# Nu-Isoleren.be


## run deze commando om te kijken welke env variabelen we gebruiken in de frontend folder 

grep -RhoE 'process\.env\.[A-Z0-9_]+' . \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git \
  | sed 's/process\.env\.//' \
  | sort -u

## dit is het zelfde maar hier zie je in welke bestanden het gebruikt worden
  grep -RInE 'process\.env' . \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git