const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const { success } = require('./helper');
const { Sequelize } = require('sequelize');

let POKEMONS = require('./mock-pokemon');

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'));

/*  DB connection */
const sequelize = new Sequelize(
    'pokedex',
    'andai',
    '0000',
    {
      host: '192.168.64.2',
      dialect: 'mariadb',
      dialectOptions: {
        timezone: 'Etc/GMT-2',
      },
      logging: false
    }
);

sequelize.authenticate()
  .then(_ => console.log('Connection has been established successfully.'))
  .catch(error => console.error('Unable to connect to the database:', error));

app.get('/', (req, res) => {
    res.send("Yooo c koi les bails!");
});

app.get('/api/pokemons', (req, res) => {
    const pokemons = POKEMONS;
    const msg = 'Tous les pokemons sont là';
    res.json(success(msg, pokemons));
});

app.get('/api/pokemon/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = POKEMONS.find(pk => pk.id === id);
    const msg = 'un pokemon a bien été trouvé';

    res.json(success(msg, pokemon));
});

app.post('/api/pokemon', (req, res) => {
    console.log(req.body);
    const id = POKEMONS.length + 1;
    const msg = `un nouveau pok avec l'id ${id} a été ajouté`;
    const newPok = {...req.body, ...{ id, created: new Date()}};
    POKEMONS.push(newPok);
    res.json(success(msg, newPok));
});

app.put('/api/pokemon/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonUpdated = {...req.body, id};
    const msg = `le pokemon ${pokemonUpdated.name} a été modifié`;
    POKEMONS = POKEMONS.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon;
    });
    res.json(success(msg, pokemonUpdated));
});

app.delete('/api/pokemon/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonDeleted = POKEMONS.find(pk => pk.id === id);
    const msg = `le pokemon ${pokemonDeleted.name} a été supprimé`;
    POKEMONS = POKEMONS.filter(pk => pk.id !== id);
    res.json(success(msg, pokemonDeleted));
});

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});