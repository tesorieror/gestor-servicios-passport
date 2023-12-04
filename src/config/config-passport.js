const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../model/user');


var cookieExtractor = function (req) {
	// console.log('COOKIES:', req.cookies)
	var token = null;
	if (req && req.cookies) {
		token = req.cookies['jwt'];
	}
	return token;
};

passport.use(new JWTstrategy(
	{
		secretOrKey: 'TOP_SECRET',
		jwtFromRequest: cookieExtractor
	},
	async (token, done) => {
		// console.log('TOKEN', token)
		try {
			return done(null, token.user);
		} catch (error) {
			done(error);
		}
	}));

passport.use('login', new localStrategy(
	async (username, password, done) => {
		// console.log('UP',username, password);
		try {
			const user = await User.findOne({ username });
			if (!user) {
				return done(null, false, { message: 'El usuario no existe' });
			}
			// console.log('User password',user.password);
			const validate = await bcrypt.compare(password, user.password)
			console.log('VALIDATE: ',await bcrypt.compare(password, user.password))
			if (!validate) {
				return done(null, false, { message: 'Error de password' });
			}
			// console.log('LOGUEADO!')			
			return done(null, user, { message: `${user.username} logueado` });
		} catch (error) { return done(error); }
	}));



