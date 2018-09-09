

module.exports =  function(express,app, models){
    var passport =  app.get('passport')


    app.route('/login')
    .get(function(req, res, next) {
      res.render('../views/pages/login',{failedLogin:req.flash('loginMessage')});
    })
    .post(function(req,res,next){
        
        passport.authenticate('local-login',{
          successRedirect : '/',
          failureRedirect : '/login', // redirect back to the signup page if there is an error
          failureFlash : true
        })(req,res,next)}
    )

    /*app.route('/user/login')
    .get(function(req, res, next) {
      res.render('../views/pages/login');
    })*/
    app.route('/apiToken')
    .post(function(req,res,next){
        console.log("Ariel printing body",req.body);
        passport.authenticate('local-api-token',{},function(err,token){
            console.log(err,token);
            if(token){
                res.status(200).json({'token':token})
            }else{
                res.status(400).json({'token':null})
            }
        })(req,res)
    }
    )


    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');

        //===== server side rendering
        // res.redirect('/');
    });



}