#!/bin/bash
export PATH=$PATH:/usr/local/bin
npm run build
PORT=3012 npm run start &
SERVER_PID=$!
echo "Waiting for server to start..."
sleep 15
echo "Running lighthouse..."
npx lighthouse http://localhost:3012 --chrome-flags='--headless' --output=json --output-path=./lcp-check.json
echo "Killing server..."
kill $SERVER_PID
