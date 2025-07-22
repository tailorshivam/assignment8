import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import todo from './models/todo.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://tailorshivam141194:uW4z6qK4G5JBd7Df@todos.xq1mnwl.mongodb.net/?retryWrites=true&w=majority&appName=todos');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

await connectDB();

app.get('/', async (req, res) => {
  try {
    const todos = await todo.find();
    const editingId = req.query.editingId || null;
    res.render('index', { todos, editingId });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add', async (req, res) => {
  const { title, priority } = req.body;

  try {
    const newTodo = new todo({ title, priority });
    await newTodo.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/edit/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const todos = await todo.find();
    res.render('index', { todos, editingId: id });
  } catch (error) {
    console.error('Error fetching todo for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, priority } = req.body;
  if (!title.trim()) return res.redirect(`/edit/${id}`);
  try {
    await todo.findByIdAndUpdate(id, { title, priority });
    res.redirect('/');
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await todo.findByIdAndDelete(id);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));