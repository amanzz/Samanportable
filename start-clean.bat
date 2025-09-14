@echo off
echo Cleaning up Next.js cache...
if exist .next rmdir /s /q .next
echo Cache cleaned!

echo Installing dependencies...
npm install

echo Starting development server...
npm run dev
