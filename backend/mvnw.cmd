@echo off
if exist "%USERPROFILE%\apache-maven-3.9.6\bin\mvn.cmd" (
    "%USERPROFILE%\apache-maven-3.9.6\bin\mvn.cmd" %*
) else (
    mvn %*
)
