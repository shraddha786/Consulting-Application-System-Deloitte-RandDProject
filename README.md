**Roles and responsibilities**

#### Shraddha

#### Dominik
##### Main Tasks
| Location        | Task                                      | Difficulty  |
| --------------- |:-----------------------------------------:| -----------:|
| public htmls    | Mod code to look better, add layout       | Medium      |
| style css       | Style code roughly on Deloitte guidelines | Medium      |
| routemap        | Create a logical idea of cookies and auth | Difficult   |

Deloitte primary font:
~Verdana~
    Secondary font:
    ~Helvetica~

Color schemes:
Primary( Black #000000, White #ffffff, Deloitte Green #86BC25 )

Secondary (Green 2 #C4D600, Green 7 #2C5234, Cool Gray 2 #D0D0CE)

Full colour scheme can be found [Here](https://www2.deloitte.com/content/dam/Deloitte/sg/Documents/careers/sg-careers-deloitte-sg-50th-anniversary-art-competition-art-colour-palette.pdf)

Preferred styling:
Sass, Bootstrap

#### Craig

______________________________________________________________
**Initial Setup**

When building and deploying this setup from the first time you must perform the following actions.

### Step One
First you will need to install MongoDB on your computer, this can be done by visiting the community page and downloading Community Server which can be found at https://www.mongodb.com/download-center?jmp=nav#community

After installing using custom and unselecting compass as an add on you should be able to find MongoDB under C:/"Program Files"/Mongo.

### Step Two
Next you will need to start up a server instance of Mongo, no server, no app. To do this cd in your bin folder which should have a filepath similar to C:\Program Files\MongoDB\Server\3.6\bin> and when there click on the executable labelled "mongod"

### Step Three
Now mongo is running, install all the app dependancies by going into the command prompt application and CD into the start folder of the project, when there run the command
```javascript
npm i 
```
Which will install all the dependancies listed in package.json

### Step Four / Final
Finally you will run the application by clicking
```javascript
npm start 
```
and then watching the browser you should see a connection on your mongo terminal saying 
```javascript
2018-06-24T19:28:33.780+1200 I NETWORK  [initandlisten] waiting for connections on port 27017
2018-06-24T19:28:46.793+1200 I NETWORK  [listener] connection accepted from 127.0.0.1:51351 #1 (1 connection now open)
```
And the npm terminal saying
```javascript

> Start@0.0.0 start C:\Users\boi\code\consulting-application-system\start
> node ./bin/www

express-session deprecated undefined resave option; provide resave option app.js:25:9
express-session deprecated undefined saveUninitialized option; provide saveUninitialized option app.js:25:9
```