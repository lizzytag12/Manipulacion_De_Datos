const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment'); //instalo moment con npm y luego lo requiero en el controlador

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
      
      
        db.Genre.findAll({ // traigo todos los generos
            order:[
                ['name','ASC'] // con los nombres ordenados ascendentemente
            ]
        })
        .then(genres=>{
           // return res.send(genres) // siempre probar si devuelve lo q vos esperas
            return res.render("moviesAdd",{ // cuando findAll capture todos los generos, recien ahi los muestro en la vista
                genres
            })
        })
        .catch (error => console.log(error)) // si tengo errores, los capturo y los muestro
      
    },
    create: function (req, res) {
        //return res.send(req.body) // verifico lo q me trae el form
        
        const {title,awards,release_date,genre_id,rating,length}=req.body //desestructuracion de lo que viene por el formulario
        db.Movie.create({  // guardo lo que me viene por formulario
            title:title.trim(),
            awards:+awards,
            release_date,
            rating:+rating,
            length:+length,
            genre_id:+genre_id
        })
        
        .then(movie=> { // cuando obtenga la informacion del metodo create , muestro la pelicula 
            console.log(movie);
            return res.redirect('/movies/detail/' + movie.id) //redireccion a la vista detalle de la pelicula creada
            //return res.redirect('/movies')// o redireccion a todas las peliculas
        })

        .catch(errores=>{ // capturo errores en caso de haberlos
            console.log(errores);
        })
    },
    edit: function(req, res) {
        //guardo las promesas en variables
         let movie =db.Movie.findByPk(req.params.id) // guardo en una variable la pelicula cuyo id coincida con el q me viene por url
         let genres =db.Genre.findAll({ 
            order :[ 'name']
         })
        //recibo todas las promesas 
       Promise.all([movie,genres])
         .then(([movie,genres])=> { // envio la informacion que me viene al ejecutarse las promesas

        return res.render('moviesEdit',{
            Movie : movie,
            release_date : moment(movie.release_date).format('YYYY-MM-DD'), // mando  formato en que el input espera recibir la informacion
            genres,
        })
       })
       .catch(errores=> console.log(errores));
    },
    update: function (req,res) {
       //return res.send(req.body)
       const {title,awards,release_date,genre_id,rating,length}=req.body
        db.Movie.update(
        {
            title:title.trim(),
            awards:+awards,
            release_date,
            rating:+rating,
            length:+length,
            genre_id:+genre_id
        },
        {

            where :{
                id : req.params.id
            }

        })
        .then(()=> res.redirect('/movies'))
        .catch(errores=> console.log(errores))
        
    },
    delete: function (req, res) {
        // TODO
    },
    destroy: function (req, res) {
        // TODO
    }

}

module.exports = moviesController;