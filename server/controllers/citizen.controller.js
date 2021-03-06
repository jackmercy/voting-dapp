import Citizen           from '../models/citizen.model';
import User              from '../models/user.model';
import PasswordGenerator from 'generate-password';
import bcrypt            from 'bcrypt';

/* const variable */
const saltRounds = 10;

/*
Route: /api/citizen/check
Method: GET
*/
function check(req, res) {
    if (!RaGuard(req.token)) {
        res.status(403);
        return res.json({error: true, message: 'You do not have permission to access this API'});
    } else {
        res.send('successfully connect to /citizen route');
    }
}

/*
Route: /api/citizen/total
Method: GET
Return: { 
    totalCitizen: 234121
}
*/
function getTotalCitizen(req, res) {
    if (!EaGuard(req.token)) {
        res.status(403);
        return res.json({error: true, message: 'You do not have permission to access this API'});
    }
    let totalCitizen = Citizen.countDocuments().exec();

    totalCitizen.then(num => {
        if (num === 0) {
            console.log(`ERROR when get total citizen`);
            return res.status(500).json({
                message: 'Something wrong with the sever'
            });
        } else if (num > 0) {
            return res.json({
                totalCitizen: num
            });
        }
    });
}

/*
Route: /api/citizen
Method: POST
{
    citizenId: '2222'
}
*/
function postCitizenById(req, res) {
    if (!RaGuard(req.token) && !CitizenGuard(req.token)) {
        return res.status(403).json({error: true, message: 'You do not have permission to access this API'});
    }
    const _id = req.body['citizenId'];

    if (_id) {
        Citizen.findOne({citizenId: _id}, function (err, citizen) {
            console.log(citizen);
            if(err) {
                console.log(err);
            } else if(citizen) {
                res.status(200);
                res.json(citizen);
            } else {
                res.status(400);
                const message = {
                    message: 'Invalid citizen ID!'
                }
                res.json(message);
            }
        });
    }
}



function getGeneratedPassword() {
    return PasswordGenerator.generate({
        length: 10,
        numbers: true
    })
}

function isExist(_id) {
    return Citizen.findOne({ id: _id }, function (err, citizen) {
            return true
    });

}

/*
Route: /api/citizen/generateUserAccount
Method: POST
{
    citizenId: '2222'
}
*/
function postGenerateUserAccount(req, res) {
    if (!RaGuard(req.token)) {
        res.status(403);
        return res.json({error: true, message: 'You do not have permission to access this API'});
    }
    var _id = req.body.citizenId;
    var user = User.countDocuments({'citizenId': _id}).exec();

    user.then( n => {
        if (n === 0) {
            // register user an new system account
            let newUser = new User();
            const _defaultPassword = getGeneratedPassword();
            bcrypt.hash(_defaultPassword, saltRounds, function(err, _hash) {
                if(err) {
                    /* throw (err); */
                    console.log(err);
                } else {
                    // Store hash in your password DB.
                    newUser.citizenId = _id;
                    newUser.hashPassword = _hash;
                    newUser.role = 'citizen';
                    newUser.hash = '0x';
                    newUser.isVote = false;
                    newUser.isFirstTimeLogIn = true;
                    newUser.hasBlockchainAccount = false;
                    newUser.save();
                    /*  After successful store new User account
                        Update hasSystemAccount value in Citizen*/
                        /* Update hasSystemAccount */
                    const query = { citizenId: _id };
                    const updateValues = {
                        $set:
                            { hasSystemAccount: true }
                    };

                    if (_id) {
                        Citizen.updateOne(
                            query,
                            updateValues,
                            { overwrite: true, upsert: false },
                            function (err, rawResponse) {}
                        );
                    }
                }
                
            });
            res.json({
                err: false,
                message: 'success',
                userId: _id,
                defaultPassword: _defaultPassword
            });
        } else if (n >= 1) {
            res.json({
                err: true,
                message: 'Citizen have already had system account'
            });
        } else {
            res.json({
                err: true,
                message: 'Something wrong with the server'
            });
        }
    });
}


/*
Route: /api/citizen/generatePassword
Method: POST
{
    citizenId: '2222'
}
*/
/* TODO: generate pwd then add salt -> user can log in their account for the first time */
async function postGenerateNewPassword(req, res) {
    if (!RaGuard(req.token)) {
        res.status(403);
        return res.json({error: true, message: 'You do not have permission to access this API'});
    }
    const _id = req.body['citizenId'];
    const _newDefaultPassword = getGeneratedPassword();
    const query = { citizenId: _id };
    
    if (_id) {
        User.findOne(query, function(err, user) {
            if(err) {
                console.log(err);
            } else if (user) {
                bcrypt.hash(_newDefaultPassword, saltRounds, function(err, _hash) {
                    const updateValues = {
                        $set:
                            { hashPassword: _hash }
                    };
                    User.updateOne(
                        query,
                        updateValues,
                        { overwrite: true, upsert: false },
                        function (err, rawResponse) {}
                    );

                    res.json({
                        err: false,
                        password: _newDefaultPassword
                    });
                });
            } else {
                res.json({
                    err: true,
                    message: 'Something wrong with the server or user id is not exist'
                });
            }
        });
    }

}

export default {
    check,
    getTotalCitizen,
    postCitizenById,
    postGenerateNewPassword,
    postGenerateUserAccount
}