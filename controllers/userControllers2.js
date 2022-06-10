const pool = require("../config/db");

// Get All Users
exports.getAllUsers = (req, res, next) => {

    const pageAsNumber = Number.parseInt(req.query.page);
    const limitAsNumber = Number.parseInt(req.query.limit);

    let page = 1;
    if(!Number.isNaN(pageAsNumber) && pageAsNumber > 1) {
        page = pageAsNumber;
    }

    let size = 3;
    if(!Number.isNaN(sizeAsNumber) && sizeAsNumber >0 && sizeAsNumber < 3) {
        size = sizeAsNumber;
    }

    const limit = req.query.limit;
    const offset = req.query.offset;

    pool.query(`SELECT * FROM users LIMIT ${size} OFFSET ${page}`, (err, result) => {
        if(err) {
            res.status(400).json({
                success: false,
                message: err
            });
        }
        res.status(200).json({
            success: true,
            page: page,
            total: result.length,
            data: result
        });
    });
}

// Get A User By His / Her ID
exports.getUserById = async (req, res, next) => {
    const id = req.params.id;
    if(!id) {
        res.status(400).json({
            success: false,
            message: "user_id is required",
        });
    }
    pool.query("SELECT * FROM users WHERE user_id = ?", id, (err, result) => {
        if(err) {
            res.status(400).json({
                success: false,
                message: err
            });
        }
        res.status(200).json({
            success: true,
            data: result
        });
    });
}

// Create A New User
exports.createNewUser = async (req, res, next) => {
    res.send("Created a user");
}

// Delete All User
exports.deleteAllUsers = async (req, res, next) => {
    res.send("Deleted a user");
}

// Update User Info By User's ID
exports.updateUserById = async (req, res, next) => {
    res.send("Update a user by id");
}

// Delete User Info By User's ID
exports.deleteUserById = async (req, res, next) => {
    res.send("delete a user by id");
}

// app.get("/users", (req, res) => {
//     pool.query("SELECT * FROM users", (err, result) => {
//         if(err) {
//             res.status(400).json({
//                 success: false,
//                 message: err
//             });
//         }
//         res.status(200).json({
//             success: true,
//             total: result.length,
//             data: result
//         });
//     });
// });

// app.get("/bookmark", (req, res) => {
//     pool.query("SELECT * FROM bookmark", (err, result) => {
//         if(err) {
//             res.status(400).json({
//                 success: false,
//                 message: err
//             });
//         }
//         res.status(200).json({
//             success: true,
//             total: result.length,
//             data: result
//         });
//     });
// });

// app.delete("/bookmark/:id", (req, res) => {
//     const b_id = req.params.id;
//     pool.query("DELETE FROM bookmark WHERE b_id = ?", b_id, (err, result) => {
//         if(err) {
//             res.status(400).json({
//                 success: false,
//                 message: err
//             });
//         }
//         res.status(200).json({
//             success: true,
//             data: {}
//         });
//     });
// });