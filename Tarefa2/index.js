const express = require('express')
const mongoose = require('mongoose')
const Filme = require('./models/Filme')
const app = express()
app.use(
    express.urlencoded({
        extend: true,
    }),
)
app.use(express.json())
app.post('/filme', async (req, res) => {
    const { titulo, sinopse, duracao, dtaLancamento, imagem, categorias} = req.body
    const filme = {
        titulo,
        sinopse,
        duracao,
        dtaLancamento,
        imagem,
        categorias,
    }
    try {
      await Filme.create(filme)
      res.status(201).json({ message: 'Filme inserido no sistema com sucesso!' })
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  })
app.get("/", (req, res) => {
    res.json({message: "Oi Express!"})
})
app.get('/filme', async (req, res) => {
    try {
      const people = await Filme.find()
      res.status(200).json(people)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  }) 
app.get('/filme/:id', async (req, res) => {
    const id = req.params.id
    try {
      const filme = await FIlme.findOne({ _id: id })
      if (!filme) {
        res.status(422).json({ message: 'Filme não encontrado!' })
        return
      }
      res.status(200).json(filme)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
})
app.patch('/filme/:id', async (req, res) => {
    const id = req.params.id
    const { titulo, sinopse, duracao, dtaLancamento, imagem, categorias } = req.body
    const filme = {
        titulo,
        sinopse,
        duracao,
        dtaLancamento,
        imagem,
        categorias,
    }
    try {
      const updatedFilme = await Filme.updateOne({ _id: id }, filme)
      if (updatedFilme.matchedCount === 0) {
        res.status(422).json({ message: 'FIlme não encontrado!' })
        return
      }
      res.status(200).json(filme)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
})
app.delete('/filme/:id', async (req, res) => {
    const id = req.params.id
    const filme = await Filme.findOne({ _id: id })
    if (!filme) {
      res.status(422).json({ message: 'Filme não encontrado!' })
      return
    }
    try {
      await Filme.deleteOne({ _id: id })
      res.status(200).json({ message: 'Filme removido com sucesso!' })
    } catch (error) {
      res.status(500).json({ erro: error })
    }
}) 
mongoose
.connect(
  'mongodb+srv://yurisalles12a:LBxTUcnksEe9TkOC@projetoapiexemplo.e8cixna.mongodb.net/?retryWrites=true&w=majority',
)
.then(() => {
  console.log('Conectou ao banco!')
  app.listen(3000)
})
.catch((err) => console.log(err))
