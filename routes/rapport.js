import express from 'express';

const route = express.Router();

route.get('/', (req, res) => {
    const user = req.session.user;
    res.render('rapport', {user});
});

export default route;