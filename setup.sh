#!/bin/bash

function get_input {
    local inp
    while true; do
        read -p "$1" inp
        if [ -z "$inp" ]; then
            echo "$2"
        else
            break;
        fi
    done
    echo "$inp"
}

printf "Project can only be initialized once!\nPress Ctrl+C if you want to abort.\n\n"
project_id=$(get_input "Enter project id (e.g. my-project): " "Enter valid project id!")
project_name=$(get_input "Enter project name (e.g. My Project): " "Enter valid project name!")
project_description=$(get_input "Enter project description (e.g. My newest project till date): " "Enter valid project description!")
project_color=$(get_input "Enter color for the project (e.g. #ff0000): " "Enter valid project color!")
project_repo=$(get_input "Enter repo for the project (e.g. git@github.com:my-name/my-app.git): " "Enter valid project repo!")

# Mapping tokens
echo "Creating project '$project_name'"
git grep -l MY_APP_ID -- :^setup.sh | xargs sed -i "s/MY_APP_ID/$project_id/g"
git grep -l MY_APP_NAME -- :^setup.sh | xargs sed -i "s/MY_APP_NAME/$project_name/g"
git grep -l MY_APP_DESCRIPTION -- :^setup.sh | xargs sed -i "s/MY_APP_DESCRIPTION/$project_description/g"
git grep -l MY_APP_COLOR -- :^setup.sh | xargs sed -i "s/MY_APP_COLOR/$project_color/g"

# Setting up new project
rm setup.sh
rm .git -rf
git init
git add .
git commit -m "First commit"
git remote add origin "$project_repo"
git push -u origin master
