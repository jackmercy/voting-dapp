import User from '../models/user.model';
import { VERSION } from 'ts-node';

function postLogin(req, res) {
    const user = new User(req.body);

    if(!req.body.password) {
        res.status(400);
        res.send('Password is required');
    } else if(!req.body.id) {
        res.status(400);
        res.send('ID is required');
    }

    // handle login request in mongodb - should move those lines into model method
    // see documentation at : http://mongoosejs.com/docs/guide.html
    User.findOne({id: user.id, password: user.password}, function(err, user) {
        if(err) {
            console.log('ERR');
        } else if(user) {
            res.status(200);
            const res_user = {
                name: user.name,
                id: user.id,
                role: user.role,
                hash: user.hash,
                isVote: user.isVote
            }
            res.json(res_user);
        } else {
            const message = {
                message: 'Invalid username or password'
            }
            res.json(message);
        }
    });

}

function postRegister(req, res) {
    const newUser = new User(req.body);

    if(!req.body.password) {
        res.status(400);
        res.send('Password is required');
    } else if(!req.body.id) {
        res.status(400);
        res.send('ID is required');
    } else if(!req.body.name) {
        res.status(400);
        res.send('Name is required');
    }

    User.find({id: req.body.id}, function(err, user) {
        if (err || user.length > 0) {
            const message = {
                message: 'Duplicate citizen ID'
            }
            res.json(message);
        } else if(user.length === 0) {
            newUser.role = 'citizen';
            newUser.hash = '0x';
            newUser.isVote = false;
            newUser.save();
            res.status(201);
            res.json(newUser);
        }
    });

}

export default {
    postLogin,
    postRegister
}