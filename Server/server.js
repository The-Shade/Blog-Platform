// Importing and using express framework
const EXPRESS = require('express');
const PATH = require('path');
const MYSQL = require('mysql2');
const APP = EXPRESS();
APP.use(EXPRESS.json());                //Built-in middleware function in express for parsing request body
APP.use(require('cors')());            //Prevents CORS errors

console.log(PATH.join(__dirname, "Website"));
APP.use(EXPRESS.static('Website'));                 //Provides Static content to client

const SQL_CONFIG = {                 //SQL Server Connection Details
    host: "localhost",
    user: "root",
    password: "empmack2",                    //Add database property if using your own database
    database: "BlogSite"
};

const TABLE_DETAILS = {                 //SQL table details, If you have a database and table set-up then
    databaseName: "BlogSite",                    //change the details in this object to suit your database
    tableName: "Posts",
    idColumn: "PostID",                          //Type Int
    titleColumn: "PostTitle",                    //Type TinyText
    contentColumn: "PostContent",                //Type MediumText
    datetimeColumn: "PostDatetime",                //Type DateTime
};
const QUERY = {                         //Uses the TABLE_DETAILS object for queries
    getAll: `SELECT * FROM ${TABLE_DETAILS.tableName} ORDER BY ${TABLE_DETAILS.datetimeColumn} DESC`,
    getOne: `SELECT * FROM ${TABLE_DETAILS.tableName} WHERE ${TABLE_DETAILS.idColumn}=`,
    postOne: `INSERT INTO ${TABLE_DETAILS.tableName} VALUES (`,
};

let sql = MYSQL.createConnection(SQL_CONFIG);                   //SQL Connection Object

sql.connect((err) => {                                     //Establishing Connection with SQL Server
    if (err) console.log(err.message);
    else console.log("SERVER CONNECTED");
});

//create get page route
let tableLength = 0;                        //Number of records in the table
UpdateTableLength();                                //Updates tableLength


//Sends website files on request
APP.get('/', (req, res) => {
    const path = PATH.join(__dirname, "../Website", "index.html");
    res.sendFile(path);
});

//Sends post details to client
APP.get("/api/posts/", (req, res) => {
    UpdateTableLength();
    let length = req.query.postCount;                         //Number of posts on single page
    let offset = req.query.countOffset;                        //Keeps record of last post's index

    sql.query(QUERY.getAll, (err, result) => {
        const resBody = JSON.stringify({
            result: result.slice(offset, Math.min(offset + length, tableLength)),
            method: 0
        });
        res.send(resBody);         //Slices resultant array and sends response
    });
});

//Sends specific post's details to client
APP.get("/api/posts/:postID/", (req, res) => {
    sql.query(QUERY.getOne + req.body.postID, (err, result) => {
        const resBody = JSON.stringify({
            result: result,
            method: 1
        });
        res.send(resBody);                       //Sends response
    });
});

APP.post("/api/posts/", (req, res) => {
    UpdateTableLength();
    const postTitle = req.body.postTitle;               //Stores the post title from request body
    const postContent = req.body.postContent;           //Stores post content from request body

    sql.query(`${QUERY.postOne} ${tableLength}, "${postTitle}", "${postContent}", CURRENT_TIMESTAMP())`,
            (err, result) => {                 //Inserts data into database
        if (err) {
            console.log(err);
            res.send({error: err.message, method: 2})              //Error check for testing
        }
        else res.send({method: 2});                               //Sends 'OK' status
    });

    tableLength += 1;                           //Increments tableLength
});

APP.listen(3000, '0.0.0.0');                    //Sets port number and application for public access

function UpdateTableLength() {                          //Checks table size and puts it into tableLength
    sql.query("select count(*) as length from posts", (err, result) => {
        if (result) tableLength = result[0].length;
        else tableLength = 0;
    });
}