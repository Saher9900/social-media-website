// selecting elements

let posts = document.getElementById("posts");
let login = document.getElementById("login");
let alert_modal = document.getElementById("alert-modal");
let login_nav = document.getElementById("login_nav");
let register_nav = document.getElementById("register_nav");
let logout_nav = document.getElementById("logout_nav");
let userName = document.getElementById("UserName");
let password = document.getElementById("Password");
let new_post = document.getElementById("new-post");
let info = document.getElementById("info");
let profile_image = document.getElementById("profile-image");
let profile_name = document.getElementById("profile-name");
let image_file = document.getElementById("image-file");
let title = document.getElementById("title");
let body = document.getElementById("body");
let publish = document.getElementById("publish");
let post_modal = document.getElementById("post-modal");
let register_modal = document.getElementById("register-modal");
let username_reg = document.getElementById("username-reg");
let password_reg = document.getElementById("password-reg");
let email_reg = document.getElementById("email-reg");
let name_reg = document.getElementById("name-reg");
let profile_image_reg = document.getElementById("profile-image-reg");
let creat_reg = document.getElementById("create");
let close_post_mod = document.getElementById("close-post-mod");
let close_register_mod = document.getElementById("close-register-mod");

checkLogin();

register_nav.onclick = function () {
  register_modal.style.display = "flex";
};

create.onclick = function () {
  registerRequest();
  register_modal.style.display = "none";
};

login.onclick = async function () {
  await loginRequest();
  checkLogin();
};

logout_nav.onclick = function () {
  localStorage.removeItem("logintoken");
  localStorage.removeItem("loginuser");
  showModal("Logged-out Successfully!", "green");
  checkLogin();
};

new_post.onclick = function () {
  post_modal.style.display = "flex";
};

close_post_mod.onclick = function () {
  post_modal.style.display = "none";
};

close_register_mod.onclick = function () {
  register_modal.style.display = "none";
};

publish.onclick = function () {
  createPost();
  console.log("Hello There");
  post_modal.style.display = "none";
};

getAllPosts("1");

function getAllPosts(page) {
  fetch(`https://tarmeezacademy.com/api/v1/posts?limit=20&page=${page}`)
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < 20; i++) {
        let post = data.data[i];
        posts.innerHTML += `
        <div class="post-inner col-8 mx-auto">
        <div>
          <div class="image-inner">
            <img src="${post.author.profile_image}" alt="" />
          </div>
          <h3>${post.author.name}</h3>
        </div>
        <div>
          <div class="title-inner">
            <h4>${post.title}</h4>
            <div class="body-inner">${post.body}</div>
          </div>
        </div>
        <div>
          <img src="${post.image}" alt="" />
        </div>
        <div>
          <p>created ${post.created_at}</p>
          <p>${post.comments_count} comments for this post</p>
        </div>
      </div>
    </div>
      `;
      }
    });
}

// === LOGIN REQUEST ===

function loginRequest() {
  fetch("https://tarmeezacademy.com/api/v1/login", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: `${userName.value}`,
      password: `${password.value}`,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      showModal("Logged-in Syccessfully!", "green");
      localStorage.setItem("logintoken", `${data.token}`);
      localStorage.setItem("loginuser", `${JSON.stringify(data.user)}`);
      hideModal("login-modal");
      userName.value = "";
      password.value = "";
      profile_name.innerHTML = data.user.name;
      localStorage.setItem("name", data.user.name);
      profile_image.src = data.user.profile_image;
      localStorage.setItem("image", data.user.profile_image);
      loginMode();
    })
    .catch(() => {
      showModal("username or password is wrong", "red");
    });
}

// REGISTER

function registerRequest() {
  let formData = new FormData();
  formData.append("username", username_reg.value);
  formData.append("password", password_reg.value);
  if (profile_image_reg.files.length > 0) {
    formData.append("image", profile_image_reg.files[0]);
  } else {
    localStorage.removeItem("image");
  }
  formData.append("name", name_reg.value);
  formData.append("email", email_reg.value);
  fetch("https://tarmeezacademy.com/api/v1/register", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      showModal("Registered Syccessfully!", "green");
      localStorage.setItem("logintoken", `${data.token}`);
      localStorage.setItem("loginuser", `${JSON.stringify(data.user)}`);
      userName.value = "";
      password.value = "";
      profile_name.innerHTML = data.user.name;
      localStorage.setItem("name", data.user.name);
      profile_image.src = data.user.profile_image;
      localStorage.setItem("image", data.user.profile_image);
      loginMode();
    });
}

// CREATE POST

function createPost() {
  let formData = new FormData();
  let imageFile = document.getElementById("image-file").files[0];

  formData.append("title", title.value);
  formData.append("body", body.value);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return fetch("https://tarmeezacademy.com/api/v1/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("logintoken")}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // Clear the existing posts before fetching new ones
      posts.innerHTML = "";

      // Fetch all posts again
      getAllPosts();

      // Show success message
      showModal("Post created successfully!", "green");
    });
}

// === SHOW MODAL ===

function showModal(text, color) {
  alert_modal.style.display = "block";
  alert_modal.style.backgroundColor = color;
  alert_modal.innerHTML = text;
  setTimeout(() => {
    alert_modal.style.display = "none";
  }, 2000);
}

// === HIDE MODALS ===

function hideModal(modalName) {
  let modal = document.getElementById(modalName);
  let modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
}

// === CHECK LOG-IN ===

function checkLogin() {
  if (localStorage.getItem("logintoken") != null) {
    loginMode();
  } else {
    notLoginMode();
  }
}

// === LOGIN-MODE ===

function loginMode() {
  if (localStorage.getItem("token") != "undefined") {
    login_nav.style.display = "none";
    register_nav.style.display = "none";
    logout_nav.style.display = "block";
    new_post.style.display = "flex";
    info.style.display = "flex";
    profile_name.innerHTML = localStorage.getItem("name");
    profile_image.src = localStorage.getItem("image");
  } else {
    notLoginMode();
  }
}

function notLoginMode() {
  login_nav.style.display = "block";
  register_nav.style.display = "block";
  logout_nav.style.display = "none";
  new_post.style.display = "none";
  info.style.display = "none";
}
