const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register', { pageName: 'register' });
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Добре дошли в Опознай България!');
            res.redirect('/sightseeings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login', { pageName: 'login' });
};

module.exports.login = (req, res) => {
    req.flash('success', 'Добре дошли отново в Опознай България!');
    const redirectUrl = req.session.returnTo || '/sightseeings';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Вие излязохте!');
    res.redirect('/sightseeings');
};