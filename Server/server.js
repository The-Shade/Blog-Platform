const app = require('express')();
app.use(require('body-parser').urlencoded({extended: false}));

app.get("/api/posts", () => {

});

app.get("/api/posts/:post_id", () => {

});

app.post("/api/path/", () => {

});

app.listen(3000, '0.0.0.0/0');