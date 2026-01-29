#!/bin/bash

# Update the sh%admin user to admin role by directly modifying the local database
# We'll use sqlite3 to update the .wrangler database

DB_PATH=".wrangler/state/v3/d1/miniflare-D1DatabaseObject/$(ls -t .wrangler/state/v3/d1/miniflare-D1DatabaseObject/ | head -1)"

if [ -f "$DB_PATH" ]; then
  echo "Found database at: $DB_PATH"
  echo "Updating sh%admin role to 'admin'..."
  
  sqlite3 "$DB_PATH" "UPDATE users SET role = 'admin' WHERE username = 'sh%admin';"
  
  echo "Verifying update..."
  sqlite3 "$DB_PATH" "SELECT id, username, email, role FROM users WHERE username LIKE 'sh%';"
  
  echo -e "\nAdmin role updated successfully!"
else
  echo "Database not found at: $DB_PATH"
  echo "Listing directory..."
  ls -la .wrangler/state/v3/d1/miniflare-D1DatabaseObject/
fi
