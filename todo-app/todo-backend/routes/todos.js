const express = require('express')
const router = express.Router()

const { Todo } = require('../mongo')

const { getAsync, setAsync } = require('../redis')


/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* GET todos statistics */
router.get('/statistics', async (req, res) => {
  const added_todos = await getAsync("added_todos")
  res.send({ added_todos: Number(added_todos) || 0 })
})

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  const addedTodos = await getAsync("added_todos") 
  await setAsync("added_todos", (Number(addedTodos) || 0) + 1)
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  if (!req.todo) return res.status(404).send({ error: 'Couldn\'t find the todo to update' })
  res.send(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(req.todo._id, req.body, { new: true, runValidators: true })
  if (!updatedTodo) return res.status(404).send({ error: 'Couldn\'t find the todo to update' })
  res.send(updatedTodo)
});

router.use('/:id', findByIdMiddleware, singleRouter)

module.exports = router;
