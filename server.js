const http = require("http");
const fs = require("fs");
const PORT = process.env.PORT || 5050;

let todos = require("./todos.json");

const updateDataFile = (data) => {
  fs.writeFile("./todos.json", JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const getTodo = (id) => {
  const item = todos.find((item) => item.id === id) || undefined;
  return item;
};

const server = http.createServer(async (req, res) => {
  // Hitta online för Cors
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, DELETE, PATCH, PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  //set the request route
  if (req.url === "/todos" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todos));
  } else if (req.url.match(/\/todos\/([0-9]+)$/) && req.method === "GET") {
    const urlParts = req.url.split("/");
    const id = parseInt(urlParts[2], 10);
    const todoItem = getTodo(id);
    if (!todoItem) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ msg: "No such todo item" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todoItem));
  } else if (req.url === "/todos" && req.method === "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data = data + chunk;
    });

    req.on("end", () => {
      const userData = JSON.parse(data);
      if (userData.task === undefined || userData.completed === undefined) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ msg: "Incorrect data" }));
      }
      let newId = 1;
      const lastItem = todos[todos.length - 1];
      if (lastItem) {
        newId = lastItem.id + 1;
      }

      todos.push({ ...userData, id: newId });
      res.writeHead(201, { "Content-Type": "application/json" });
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
      if (userData.task === undefined || userData.completed === undefined) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ msg: "Incorrect data" }));
      }
      const todoItem = getTodo(id);
      if (!todoItem) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ msg: "No such todo item" }));
      }

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
      todos = tmpArray;
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
      if (userData.completed === undefined) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ msg: "Incorrect data" }));
      }
      const todoItem = getTodo(id);
      if (!todoItem) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ msg: "No such todo item" }));
      }

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
      todos = tmpArray;
    });
  } else if (req.url.match(/\/todos\/([0-9]+)$/) && req.method === "DELETE") {
    const urlParts = req.url.split("/");
    const id = parseInt(urlParts[2], 10);

    const todoItem = getTodo(id);
    if (!todoItem) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ msg: "No such todo item" }));
    }

    const tmpArray = todos.filter((item) => {
      if (item.id === id) {
        return false;
      } else {
        return true;
      }
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(tmpArray));
    updateDataFile(tmpArray);
    todos = tmpArray;
  } else {
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
