const xhr = new XMLHttpRequest();

const contentContainer = document.getElementById('content-container');

xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const res = JSON.parse(xhr.response);

        const result = res.result;
        const method = res.method;

        if (method === 0) {
            for (let record = 0; record < result.length; record++) {
                const blogPost = CreateBlogPostBlock(result[record]);
                blogPost.onclick = (err) => {
                    console.log(err);
                }
                contentContainer.appendChild(blogPost);
            }
        } else if (method === 1){

        } else if (method === 2){
            if (res.err) {
                alert("Post not stored: " + res.err);
            } else {
                alert("Post stored on Database");
            }
        } else {
            throw Error("Method error: ClientConnections.js");
        }
    }
};

function CreateBlogPostBlock(record) {
    const Datetime = new Date(record.PostDatetime);

    const postDate = Datetime.toLocaleDateString('en-in', {month: "short", year: "numeric", day: "2-digit"});
    const postTime = Datetime.toLocaleTimeString('en-in', {hour12: true, hour: "2-digit", minute: "2-digit"});

    const postTitle = record.PostTitle;
    const postContent = record.PostContent;
    const postID = record.PostID;

    const blogPostContainter = document.createElement('div');
    blogPostContainter.className = 'blog-post';
    blogPostContainter.id = postID;

    const blogHeader = document.createElement('div');
    blogHeader.className = 'post-header';

    const blogTitle = document.createElement('h2');
    blogTitle.className = 'post-title';
    blogTitle.innerText = postTitle;

    const blogDate = document.createElement('p');
    blogDate.className = 'post-date';
    blogDate.innerText = postDate;
    const blogTime = document.createElement('p');
    blogTime.className = 'post-time';
    blogTime.innerText = postTime;
    const divDatetime = document.createElement('div');
    divDatetime.appendChild(blogDate);
    divDatetime.appendChild(blogTime);

    const blogContent = document.createElement('p');
    blogContent.className = 'post-content';
    blogContent.innerHTML = postContent;
    const divContent = document.createElement('div');
    divContent.className = 'post-content-container';
    divContent.appendChild(blogContent);

    blogPostContainter.appendChild(blogHeader);
    blogPostContainter.appendChild(divContent);
    blogHeader.appendChild(blogTitle);
    blogHeader.appendChild(divDatetime);

    return blogPostContainter;
}

function BlogPostEventListener() {

}

function GetBlogPosts() {
    const postCount = 3;
    const countOffset = 0;

    xhr.open('GET', `http://localhost:3000/api/posts?postCount=${postCount}&countOffset=${countOffset}`, true);
    xhr.send();
}

function OpenPostOverlay() {
    document.getElementById("create-post-overlay").style.width = "100%";
}

function OpenLoginOverlay() {
    document.getElementById("login-overlay").style.width = "100%";
}

function CloseOverlay() {
    document.getElementById("create-post-overlay").style.width = "0%";
    document.getElementById("login-overlay").style.width = "0%";
}

function NewPost() {
    const postTitle = document.getElementById('new-post-title');
    const postContent = document.getElementById('new-post-content');
    console.log(postTitle);

    xhr.open('POST', "http://localhost:3000/api/posts", true);
    xhr.setRequestHeader('Content-Type', "application/json");
    xhr.send(JSON.stringify({postTitle: postTitle.value, postContent: postContent.value}));
}

window.onload = GetBlogPosts;