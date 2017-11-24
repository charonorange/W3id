How to launch the node server:
cd to the application directory
if you are not root: 
sudo node app >logs/access_log.txt 2>logs/error_log.txt
if you are root:
node app >logs/access_log.txt 2>logs/error_log.txt

Note: you can use nohup to run the node process in bacth
nohup node app >logs/access_log.txt 2>logs/error_log.txt &

Requirements:
npm install express
npm install formidable@latest
npm install passport
npm install passport-idaas-openidconnect --save
npm install express-session
npm install cookie-parser

URL:
https://x.xxx.xxx.xx

Object returned for authentication:

{
    "id": "xxxx@fr.ibm.com",
    "_json": {
        "iss": "https://w3id.alpha.sso.ibm.com/isam",
        "at_hash": "N0gVtYqsdqsdqz29MA",
        "sub": "xxxx@fr.ibm.com",
        "lastName": "CLERGET",
        "realmName": "W3IDRealm",
        "userAgent": "Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0",
        "dn": "uid=078789xx,c=fr,ou=bluepages,o=ibm.com",
        "cn": "Benoit%20Clerget",
        "aud": "Mjqsfdqsrrqsd",
        "uid": "0786654xxx",
        "firstName": "BENOIT",
        "emailAddress": "xxx@fr.ibm.com",
        "blueGroups": [
            "PSSC-Network",
            "Free or not polluting Energy",
            "Service 1456 (Support)",
            "IBMLinuxUsers",
            "PSSC_BFS",
            "IBMCC-1456"
        ],
        "clientIP": "11.11.11.11",
        "exp": 1475513906,
        "authMethod": "ext-auth-interface",
        "iat": 1475506706
    },
    "accessToken": "hfQBGMGbYVdqlkemlkfd454qsdqsdqsd",
    "refreshToken": "FRuzbvSqsdqsdqsdqsdqsdqsdqsdqsdqsdGZ7J1IvGU9mRY3f"
}


