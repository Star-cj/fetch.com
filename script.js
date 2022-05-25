const postList = document.querySelector(".posts-list"),
    postForm=document.querySelector(".add-postform"),
    title=document.querySelector('#title-value'),
    firstName=document.querySelector('#first-name'),
    lastName=document.querySelector('#last-name'),
    age=document.querySelector('#age'),
    content=document.querySelector('#body-value'),
    submitBtn=document.querySelector('.btn');


const url = "http://localhost:3000/users";   

let output = '';

const renderPost=(posts)=>{
    posts.forEach(post => {
        output += `
        <div class="card mt-4 col-md-6 bg-ligt">
            <div class="card-body" data-id="${post.id}">  
                <h5 class="card-title"> ${post.title}</h5>
                <div class="flecon">
                    <h6 class="fname mb-1 text-muted">${post.first_name}</h6>
                    <h6 class="lname mb-1 text-muted">${post.last_name}</h6>
                </div>
                <p class="age md-2"> <i>My age is ${post.age}</i></p><br>
                <p class="card-text">${post.content}</p>
                <a href="#" class="card-link" id="edit-post">Edit</a>
                <a href="#" class="card-link" id="delet-post">Delete</a>
            </div>
        </div>
        `;
    });
    postList.innerHTML=output;
}

postList.addEventListener('click',(e)=>{
    e.preventDefault();
    // console.log(e.target.id);  //the target id will help you to get the particular id you clicked from that postlist container

    let deletBtn=e.target.id=='delet-post';
    let editBtn=e.target.id=='edit-post';

    // console.log(e.target.parentElement.dataset.id)     //we have to use data-id for us to get the id of the head-div using our dataset. parentElement is to get the whole content of that div
    //Delet - Remove the content
    let id=e.target.parentElement.dataset.id;
    if(deletBtn){
        fetch(`${url}/${id}`,{
            method: 'DELETE'  //this will delete the whole comment from database
        }).then(res=>res.json())
            .then(()=>location.reload())  //this will make the browser to reload after the delete

    }else{    //for edit btn
        let parent= e.target.parentElement;
        let titleCon=parent.querySelector('.card-title').textContent;
        let firstNamCon=parent.querySelector('.fname').textContent;
        let lastNameCon=parent.querySelector('.lname').textContent;
        let ageValue=parent.querySelector('.age').textContent;
        let contentCon=parent.querySelector('.card-text').textContent;

        title.value=titleCon;
        firstName.value=firstNamCon;
        lastName.value=lastNameCon;
        content.value=contentCon;
        age.value=ageValue;

        submitBtn.textContent="UPDATE";
    }

    //UPDATE - update the existing post
    //Method: FETCH
    submitBtn.addEventListener('click',(e)=>{
        e.preventDefault();
        fetch(`${url}/${id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                title: title.value,
                first_name:firstName.value,
                last_name: lastName.value,
                content: content.value,
                age: age.value
            })
        })
            .then(res=>res.json())
            .then(()=>location.reload()) 
    })
})

// Get - Read the posts
//Method: GET
fetch(url)
    .then(response => response.json())
    .then(data => renderPost(data))


//creat an insert new post using POST METHOD
postForm.addEventListener("submit",(e)=>{
    e.preventDefault(); //this makes the site not to reload when it is clicked on

    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            title: title.value,
            first_name:firstName.value,
            last_name: lastName.value,
            content: content.value,
            age: age.value
        })
    })
        .then(res=>res.json())
        .then(data=>{
            let dataArray=[];
            dataArray.push(data);  //this PUSH will make the data to be in an array form
            renderPost(dataArray);
        })
})