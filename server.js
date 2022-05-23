const http = require("http");
const fs = require("fs");
const PORT = process.env.PORT || 5050;

const todos = require("./todos.json");

const updateDataFile = () => {
  console.log(todos);
  fs.writeFile("./todos.json", JSON.stringify(todos), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const server = http.createServer(async (req, res) => {
  //set the request route
  if (req.url === "/todos" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todos));
  } else if (req.url.match(/\/todos\/([0-9]+)$/) && req.method === "GET") {
    const urlParts = req.url.split("/");
    const id = parseInt(urlParts[2], 10);

    const todoItem = todos.find((item) => item.id === id) || {
      message: "Error",
      info: "No such todo id",
    };

    res.writeHead(200, { "Content-Type": "application/json" });

    res.end(JSON.stringify(todoItem));
  } else if (req.url === "/todos" && req.method === "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data = data + chunk;
    });

    req.on("end", () => {
      const userData = JSON.parse(data);

      const lastItem = todos[todos.length - 1];
      const newId = lastItem.id + 1;
      todos.push({ todo: userData.todo, done: false, id: newId });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(todos));
      updateDataFile(todos);
    });
  } else if (req.url.match(/\/todos\/([0-9]+)$/) && req.method === "PUT") {
    const urlParts = req.url.split("/");
    const id = parseInt(urlParts[2], 10);

    let data = "";
    req.on("data", (chunk) => {
      data = data + chunk;
    });

    req.on("end", () => {
      const userData = JSON.parse(data);

      const tmpArray = todos.map((item) => {
        if (item.id === id) {
          return userData;
        } else {
          return item;
        }
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(tmpArray));
      updateDataFile(tmpArray);
    });
  } else if (req.url.match(/\/todos\/([0-9]+)$/) && req.method === "PATCH") {
    const urlParts = req.url.split("/");
    const id = parseInt(urlParts[2], 10);

    let data = "";
    req.on("data", (chunk) => {
      data = data + chunk;
    });

    req.on("end", () => {
      const userData = JSON.parse(data);

      const tmpArray = todos.map((item) => {
        if (item.id === id) {
          return { ...item, ...userData };
        } else {
          return item;
  }
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(tmpArray));
      updateDataFile(tmpArray);
    });
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error",
        info: "No such url",
      })
    );
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
