const express = require("express");


const fs = require("fs");
var session = require("express-session");
const app = express();
const multer = require("multer");
const path = require("path");

const db = require("./models/Usersdb");

const { UserModel, TaskModel } = require("./models/User");

const upload = multer({ dest: "uploads/" });
app.set("view engine", "ejs");

// app.set('views', __dirname + '/todoViews'));  //If you want to change the default views directory
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json()); // middleware for json body , to parse incoming JSON data from HTTP requests, a standard format for data transmission in web servers.

app.use(express.urlencoded({ extended: true }));

// Middleware that stores current user name , so that we can use it in header.ejs without passing in every render
app.use(function (req, res, next) {
  res.locals.username = req.session.user;
  res.locals.profile = req.session.profile;
  next();
});

app.use(express.static("uploads"));

app.use(upload.single("pic"));

app.get("/", async function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }

  // fs.readFile("data.json", "utf8", function (err, data) {
  //   if (err) {
  //     console.error("Error reading ", err);
  //     res.status(500).send("error");
  //     return;
  //   }

  let jsonData;
  try {
    jsonData = await TaskModel.find();  // returns the whole data 
    res.render("index", { data: jsonData, profile: req.session.profile }); // send data to index.ejs , dynamic rendering
     // jsonData = JSON.parse(data);
  } catch (err) {
    console.error("Error parsing data:", err);
    res.status(500).send("error");
    return;
  }

  // Render the complete page with both header and data templates

  //middle ware for session.profile defined above for locals , we can remove this one also it will still work
});
// });

app.post("/todo", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.status(401).send("error");
    return;
  }
  const pic = req.file;
  const newTodo = {
    id: req.body.id,
    InputValue: req.body.InputValue,
    priority: req.body.priority,
    pic: pic.filename,
    completed: false,
  };

  TaskModel.create(newTodo)    // Create a database 
    .then(function () {
      res.status(200).json(newTodo); 
    })
    .catch(function (err) {
      res.status(500).send(err);
    });

  // saveTodoInFile(newTodo, function (err) {
  //   if (err) {
  //     res.status(500).send("error");
  //     return;
  //   }

  //   res.status(200).json(newTodo);
  // });
});

app.get("/logout", function (req, res) {
  // Clear the session data to log out the user
  req.session.isLoggedIn = false;
  req.session.user = null;
  res.redirect("/login"); // Redirect to the login page or any other desired page
});

app.get("/todo-data", async function (req, res) {
  if (!req.session.isLoggedIn) {
    res.status(401).send("error");
    return;
  }

  try {
    const todos = await TaskModel.find();
    const todosWithPicPath = todos.map((todo) => ({
      ...todo.toObject(),
      pic: todo.pic, // Assuming the server stores uploaded images in the 'uploads' directory
    }));

    res.status(200).json(todosWithPicPath);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching todos." });
  }

  // readAllTodos(function (err, data) {
  //   if (err) {
  //     res.status(500).send("error");
  //     return;
  //   }
  //   const todosWithPicPath = data.map((todo) => ({
  //     ...todo,
  //     pic: todo.pic, // Assuming the server stores uploaded images in the 'uploads' directory
  //   }));

  //   //res.status(200).send(JSON.stringify(data));
  //   res.status(200).json(todosWithPicPath);
  // });
});
// // Route to get the username of the currently logged-in user
// app.get("/get-logged-in-user", function (req, res) {
//   if (req.session.isLoggedIn) {
//     res.send(req.session.user);
//   } else {
//     res.status(401).send("Not logged in");
//   }
// });

app.get("/about", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  res.render("about");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});
app.get("/Error", function (req, res) {
  res.sendFile(__dirname + "/ErrorPage.html");
});
app.get("/create-account", function (req, res) {
  res.sendFile(__dirname + "/CreateAccount.html");
});
app.get("/CreateAccScript.js", function (req, res) {
  res.sendFile(__dirname + "/CreateAccScript.js");
});

app.get("/contact", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  res.render("contact");
});

app.get("/todo", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  res.render("todo");
});

app.get("/todoScript.js", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  res.sendFile(__dirname + "/todo_app/script/todoScript.js");
});

app.post("/User-details", async function (req, res) {
  const newEmail = req.body.email;
  const newUsername = req.body.name;
  const profile = req.file;

  const Detail = {
    email: newEmail,
    name: newUsername,
    password: req.body.password,
    profile: profile.filename,
  };

  try {
    const existingUserEmail = await UserModel.findOne({ email: newEmail });
    const existingUserName = await UserModel.findOne({ name: newUsername });
    if (existingUserEmail || existingUserName) {
      res.status(409).send("email_error");
    } else {
      UserModel.create(Detail)
        .then(function () {
          res.status(200).send("success");
        })
        .catch(function (err) {
          res.status(500).send(err);
        });
    }
  } catch (error) {
    throw error;
  }

  // Check if the email and username already exist in the UserDetails.txt file

  // readAllDetails(function (err, userDetails) {
  //   if (err) {
  //     console.error("Error reading UserDetails.txt:", err);
  //     res.status(500).send("error");
  //     return;
  //   }

  //   // Find if any user with the same email already exists
  //   const existingUserEmail = userDetails.find(
  //     (user) => user.email === newEmail
  //   );

  //   // Find if any user with the same username already exists
  //   const existingUserName = userDetails.find((user) => user.name === newUser);

  //   if (existingUserEmail) {
  //     // An account with the same email already exists
  //     res.status(409).send("email_error");
  //   } else if (existingUserName) {
  //     // An account with the same username already exists
  //     res.status(410).send("username_error");
  //   } else {
  //     // Save the new user details in the UserDetails.txt file
  //     saveDetailsInFile(Detail, function (err) {
  //       if (err) {
  //         console.error("Error saving user details:", err);
  //         res.status(500).send("error");
  //         return;
  //       }

  //       res.status(200).send("success");
  //     });
  //   }
  // });
});
db.init()
  .then(function () {
    console.log("db connected");
    app.listen(8000, function () {
      console.log("server on port 8000");
    });
  })
  .catch((e) => {
    console.log("database error", e);
  });

app.post("/login", function (req, res) {
  const username = req.body.username;
  const pw = req.body.password;

  UserModel.findOne({ name: username, password: pw })
    .then((user) => {
      if (user) {
        req.session.isLoggedIn = true;
        req.session.user = username;
        req.session.profile = user.profile;
        res.redirect("/");
        return;
      }
      res.redirect("/Error");
    })
    .catch(() => {
      res.status(500).send("error");
    });
  // readAllDetails(function (err, userDetails) {
  //   if (err) {
  //     console.error("Error reading UserDetails.txt:", err);
  //     res.status(500).send("error");
  //     return;
  //   }

  //   const userFound = userDetails.find(
  //     (userDetail) => userDetail.name === user
  //   );

  //   if (userFound && userFound.password === pw) {
  //     req.session.isLoggedIn = true;
  //     req.session.user = user;
  //     console.log(userFound);
  //     req.session.profile = userFound.profile;
  //     res.redirect("/"); //response.status = 301 , url  (jo request bheji hai vo accept hogyi hai , pr ek url bhi do jaha redirect krna hai )
  //     //automatically new url ke sath request jaygi server pe client se , fir vo request show hogi
  //   } else {
  //     res.redirect("/Error");
  //   }
  // });
});

app.put("/todo/:id", async function (req, res) {
  if (!req.session.isLoggedIn) {
    res.status(401).send("error");
    return;
  }
  const todoId = req.params.id;
  const completed = req.body.completed;
  console.log(completed);
  try {
    const updatedTask = await TaskModel.findOneAndUpdate(
      { id: todoId },
      { completed: completed }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ message: "Task marked as completed." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the task." });
  }
  // const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

  // const todo = data.find((t) => t.id === todoId);

  // if (!todo) {
  //   return res.status(404).json({ message: "Task not found." });
  // }

  // todo.completed = completed; // Mark the task as completed

  // fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  // res.sendStatus(200);
});

app.delete("/todo/:id", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.status(401).send("error");
    return;
  }

  const todoId = req.params.id;

  TaskModel.findOne({ id: todoId })
    .then(function (task) {
      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }

      const imageName = task.pic;

      TaskModel.deleteOne({ id: todoId })
        .then(function () {
          // Delete the task's image from the "uploads" folder
          const imagePath = path.join("uploads", imageName);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
              res.status(500).send("error");
            } else {
              res.status(200).send("success");
            }
          });
        }).catch((error) => {
          console.error(error);
          res.status(500).json({ message: "An error occurred while deleting the task." });
        });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while finding  the task." });
    });
});