# todoapi


## Start server

`node server.js`


### Test API

#### Get all todos

make a `GET` call against `/todos` 

#### Get a todo

make a `GET` call against `/todos/[id]` 

#### Add a todo

make a `POST` call against `/todos` with json data

```
{
  "task": "Clean the house", 
  "completed":"true"
}

```

#### Update a todo

make a `PUT` call against `/todos/[id]` with json data

```
{
  "task": "Clean the house", 
  "completed":"true"
}

```

#### Update a todo status

make a `PATCH` call against `/todos/[id]` with json data

```
{
  "completed":"true"
}

```

#### Remove a todo document

make a `DELETE` call against `/todos/[id]` 

