#!/bin/bash
run_query () {
   PGPASSWORD=postgres psql -U postgres -h localhost -p 5432 -d webshop -c "$1"
}

run_file () {
   PGPASSWORD=postgres psql -U postgres -h localhost -p 5432 -d webshop -f "$1"
}

function ask_yes_or_no() {
    read -p "$1 ([y]es or [N]o): "
    case $(echo $REPLY | tr '[A-Z]' '[a-z]') in
        y|yes) echo "yes" ;;
        *)     echo "no" ;;
    esac
}

if [[ "no" == $(ask_yes_or_no "Loading testdata deletes existing data! Are you sure you want to proceed?") || \
      "no" == $(ask_yes_or_no "Are you *really* sure?") ]]
then
    echo "Skipped."
    exit 0
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

run_file "${DIR}/delete_tables.sql"
run_file "${DIR}/init_tables.sql"
run_file "${DIR}/create_countries.sql"
cat "${DIR}/testdata/categories.csv" | run_query "COPY categories (id, name) FROM STDIN DELIMITER ',' CSV HEADER;"
cat "${DIR}/testdata/products.csv" | run_query "COPY products (id, name, description, price, stock, category, created, last_updated) FROM STDIN DELIMITER ',' CSV HEADER;"
cat "${DIR}/testdata/users.csv" | run_query "COPY users (id, username, birthday, country, registered, password, isadmin) FROM STDIN DELIMITER ',' CSV HEADER;"