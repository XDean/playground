#!/usr/bin/env sh

column=`tput cols`
currentpath = `pwd`
basepath=`dirname "$0"`
today=`date '+%y%m%d'`

banner () {
    printf "\n"
    printf "=%.0s"  $(seq 1 $column)
    printf "\n"
}

banner
printf 'Go to base path\n'
cd $basepath

banner
printf 'Mkdir output folder\n'
mkdir output

banner
printf 'Build backend\n'
go build -o output/playground github.com/XDean/playground/cmd/playground

banner
printf 'Build frontend\n'
cd front
npm run build

banner
cd $currentpath
printf 'Build Done!
Now You can start the server by

    cd %s
    nohup output/playground -s config/default.yaml >> /usr/local/code-playground/%s.log 2>&1 &
' $basepath $today