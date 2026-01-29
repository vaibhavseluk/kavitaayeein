#!/bin/bash

API_URL="http://localhost:3000"

echo "Creating Admin and Poet users..."
echo "================================"

# 1. Admin user: sh%admin / adsh%min086
echo -e "\n1. Creating Admin user (sh%admin)..."
curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "sh%admin",
    "email": "admin@shabdly.online",
    "password": "adsh%min086",
    "display_name": "Platform Admin",
    "bio": "Platform Administrator",
    "preferred_language": "en",
    "role": "admin"
  }' | jq '.'

# 2. Marathi Poet: sh%marathi_poet / adsh%min086
echo -e "\n2. Creating Marathi Poet (sh%marathi_poet)..."
curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "sh%marathi_poet",
    "email": "marathi@shabdly.online",
    "password": "adsh%min086",
    "display_name": "मराठी कवी",
    "bio": "Marathi language poet",
    "preferred_language": "mr",
    "role": "poet"
  }' | jq '.'

# 3. Hindi Poet: sh%hindi_poet / adsh%min086
echo -e "\n3. Creating Hindi Poet (sh%hindi_poet)..."
curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "sh%hindi_poet",
    "email": "hindi@shabdly.online",
    "password": "adsh%min086",
    "display_name": "हिंदी कवि",
    "bio": "Hindi language poet",
    "preferred_language": "hi",
    "role": "poet"
  }' | jq '.'

# 4. English Poet: sh%english_poet / adsh%min086
echo -e "\n4. Creating English Poet (sh%english_poet)..."
curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "sh%english_poet",
    "email": "english@shabdly.online",
    "password": "adsh%min086",
    "display_name": "English Poet",
    "bio": "English language poet",
    "preferred_language": "en",
    "role": "poet"
  }' | jq '.'

echo -e "\n================================"
echo "User creation completed!"
