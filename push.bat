@echo off
echo Pushing changes to GitHub so Vercel can deploy...
git add server/controllers/attendanceController.js
git commit -m "fix: Load accurate personalized mock data for Aptitude and Soft Skills"
git push
echo.
echo ===========================================
echo Done! Please wait 1-2 minutes and refresh your live website.
echo ===========================================
pause
