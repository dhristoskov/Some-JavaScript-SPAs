import { post, get, put } from './requester.js';
import { authenticationInfo, setHeaderInfo, dataAuthentication } from './authentication.js';
import { infoMessage } from './notifications.js';

function main () {

    //Load Header and Footer parts
    const partials = {
        header: '/views/common/header.hbs',
        footer: '/views/common/footer.hbs'
    };

    //Render Home page
    function loadHome (context) {
        setHeaderInfo(context);

        context.loadPartials(partials)   
               .partial('/views/home/loggedInHome.hbs');       
    };

    //Render Library page
    function loadLibrary(ctx) {
        setHeaderInfo(ctx)

        partials['song'] = '/views/library/song.hbs'
        partials['genre'] = '/views/library/genre.hbs'

        get('Kinvey', 'appdata', 'songs')
            .then((data) => {
                ctx.genre = data.genre;
                ctx.songs = data;
                ctx.loadPartials(partials)
                    .partial('/views/library/songsCatalog.hbs')
            });
    };

    const app = new Sammy('#main', function () {
        this.use('Handlebars', 'hbs');
        
        //Home page loading
        this.get('/' , loadHome);
        this.get('#/home', loadHome)
        
        //Login page loading
        this.get('#/login', function () {
            this.loadPartials(partials)
                .partial('/views/login/login.hbs')
        });

       //Login as existing user
       this.post('#/login', function (ctx) {
           
            const userData = {
                username: ctx.params.username,
                password: ctx.params.password
            };

            post('Basic', 'user', 'login', userData)
                .then(function (userInfo) {                 
                    authenticationInfo(userInfo);  
                    infoMessage('Successfully Logged-In!');     
                    loadHome(ctx);               
                })
                .catch(console.error);
       }); 

       //Logout from an account
       this.get('#/logout', function (ctx) {
           post('Kinvey', 'user', '_logout', {})
                .then(() => {
                    sessionStorage.clear();
                    infoMessage('Successfully Logged-Oun!');  
                    loadHome(ctx); 
                })
                .catch(console.error);
       });

        //Register page loading
        this.get('/register', function () {
            this.loadPartials(partials)
                .partial('/views/register/register.hbs')
        });

        //Make a new registration
        this.post('#/register', function (ctx) {
            const repeatPassword = ctx.params.repeatPassword;
            const userData = {
                name: ctx.params.name,
                username: ctx.params.username,
                password: ctx.params.password,
            };

            if(dataAuthentication(userData, repeatPassword)){
                post('Basic','user', '', userData )
                .then(function (userInfo) {
                    authenticationInfo(userInfo);
                    loadHome(ctx); 
                })
                .catch(console.error);
            }
        });

        //Contact page loading
        this.get('#/contact', function (ctx) {
            setHeaderInfo(ctx)

            this.loadPartials(partials)
                .partial('/views/contact/contact.hbs')
        });


        //Library page loading
        this.get('#/library', loadLibrary); 
        
        //Add a song into user library
        this.get('#/like/:id', function (ctx) {

            const id = ctx.params.id; 

            get('Kinvey', 'appdata', `songs/${id}`)
                .then((song) => {
    
                    const newSong = {
                            like: song.like + 1, 
                            name: song.name,
                            link: song.link,
                            genre: song.genre
                            }

                    put('Kinvey', 'appdata', `songs/${id}`, newSong)
                    .then(() => {
                        loadLibrary(ctx)    
                    });          
            })
            .catch(console.error)          
        });

        //Load Personal Library
        this.get('#/userLibrary', function (ctx) {
            setHeaderInfo(ctx)

            this.loadPartials(partials)
                .partial('views/userLibrary/userLibrary.hbs')          
        });

        //Creat personal Library
        this.get('#/create', function (ctx) {
            setHeaderInfo(ctx)

            this.loadPartials(partials)
                .partial('views/userLibrary/createdLibrary.hbs')  
        });
    });

    app.run();
}
main();

