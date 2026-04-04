@echo off
echo ========================================
echo  VirtueView - Database Migration Fix
echo ========================================
echo.

echo Step 1: Generating Prisma Client...
call npx prisma generate
echo.

echo Step 2: Pushing schema to MongoDB...
call npx prisma db push --accept-data-loss
echo.

echo ========================================
echo  Migration Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your backend server (Ctrl+C and run 'npm run dev')
echo 2. Run: npm run setup:admin
echo 3. Login to admin dashboard
echo.
pause
