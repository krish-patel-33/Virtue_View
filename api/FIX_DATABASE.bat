@echo off
echo ========================================
echo  FIXING 500 ERROR - Database Migration
echo ========================================
echo.
echo This will add the new fields to MongoDB
echo (accountStatus, suspendReason, property status, etc.)
echo.
pause

echo.
echo Step 1: Generating Prisma Client...
echo ----------------------------------------
call npx prisma generate
if errorlevel 1 (
    echo.
    echo ERROR: Prisma generate failed!
    echo Try: npm install @prisma/client
    pause
    exit /b 1
)
echo ✓ Prisma Client generated successfully!
echo.

echo Step 2: Pushing schema to MongoDB...
echo ----------------------------------------
call npx prisma db push
if errorlevel 1 (
    echo.
    echo ERROR: Database push failed!
    echo Check your DATABASE_URL in .env file
    pause
    exit /b 1
)
echo ✓ Database schema updated successfully!
echo.

echo ========================================
echo  SUCCESS! Migration Complete
echo ========================================
echo.
echo Next steps:
echo 1. Restart your backend server (Ctrl+C then 'npm run dev')
echo 2. Refresh your browser (Ctrl+Shift+R)
echo 3. The admin dashboard should now work!
echo.
pause
