const xhr = new XMLHttpRequest();


function GetBlogPosts() {
    xhr.open('GET', `http://localhost:3000/api/posts?postCount=${postCount}&countOffset=${countOffset}`);
    xhr.send();
}


window.onload = GetBlogPosts;