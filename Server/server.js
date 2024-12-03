// Importing and using express framework
const EXPRESS = require('express');
const MYSQL = require('mysql2');
const APP = EXPRESS();
APP.use(EXPRESS.json());                //Built-in middleware function in express for parsing request body
APP.use(require('cors')());            //Prevents CORS errors

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
    dateColumn: "UploadDate",                    //Type Date
    timeColumn: "UploadTime"                     //Type Time
};
const QUERY = {                         //Uses the TABLE_DETAILS object for queries
    getAll: `SELECT * FROM ${TABLE_DETAILS.tableName} ORDER BY ${TABLE_DETAILS.dateColumn}, ${TABLE_DETAILS.timeColumn} DESC`,
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
    res.send("HELLO");
});

//Sends post details to client
APP.get("/api/posts/", (req, res) => {
    UpdateTableLength();
    let length = req.query.postPerPage;                         //Number of posts on single page
    let offset = req.query.recordOffset;                        //Keeps record of last post's index

    sql.query(QUERY.getAll, (err, result) => {
        res.send(result.slice(offset, Math.min(offset + length, tableLength)));         //Slices resultant array and sends response
    });
});

//Sends specific post's details to client
APP.get("/api/posts/:postID/", (req, res) => {
    sql.query(QUERY.getOne + req.body.postID, (err, result) => {
        res.send(result);                       //Sends response
    });
});

APP.post("/api/post/", (req, res) => {
    UpdateTableLength();
    const postTitle = req.body.postTitle;               //Stores the post title from request body
    const postContent = req.body.postContent;           //Stores post content from request body

    sql.query(`${QUERY.postOne} ${tableLength}, "${postTitle}", "${postContent}", CURDATE(), CURTIME())`,
            (err, result) => {                 //Inserts data into database
        if (err) {
            console.log(err);
            res.send({error: err.message, rejected: true})              //Error check for testing
        }
        else res.send({rejected: false});                               //Sends 'OK' status
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