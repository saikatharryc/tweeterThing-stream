const User = require("../../../models/user");

module.exports = {
    list
};

/* 
    GET /api/user/list
*/

function list(req, res) {
    // refuse if not an admin
    if (!req.decoded.admin) {
        return res.status(403).json({
            message: "you are not an admin"
        });
    }

    User.find({}, "-password")
        .exec()
        .then(users => {
            res.json({ users });
        });
}
