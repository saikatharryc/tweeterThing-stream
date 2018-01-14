const User = require("../../../models/user");

module.exports = {
    list
};

/* 
    GET /api/user/list
*/

function list(req, res) {
    User.find({}, "-password")
        .exec()
        .then(users => {
            res.json({ users });
        });
}
