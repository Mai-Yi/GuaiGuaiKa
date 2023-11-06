@echo off
setlocal enabledelayedexpansion
for /r %%f in (*_*) do (
  set "filename=%%~nxf"
  set "newname=!filename:_= !"
  rename "%%f" "!newname!"
)
endlocal
