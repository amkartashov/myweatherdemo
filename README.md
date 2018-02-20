Build
=====

You need to do this on box with APS tools and Docker installed

* git clone
* cd myweatherdemo/
* check version in APP-META.xml
* \# ver=1.0-9 && aps build . && docker build -f deploy-image/Dockerfile -t psnsk/myweatherdemo:$ver . && docker push psnsk/myweatherdemo:$ver

Install
=======

* upload APS package
* create APS instance
* modify URL and token in APS instance settings
* create resources, ST and SP
