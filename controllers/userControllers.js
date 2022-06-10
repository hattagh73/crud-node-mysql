require("dotenv").config();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const secretKey = process.env.SECRET_KEY;

/* 1. START Get All Users */ 
exports.getAllUsers = async (req, res, next) => {

    let pageAsNumber = Number.parseInt(req.query.page);
    let limitAsNumber = Number.parseInt(req.query.limit);
    let offset = Number.parseInt(req.query.offset);
    // const sort = toUpperCase(req.query.sort);
    // let sort = req.query.sort;
    // sort = sort.toUpperCase();

    let page = 1;
    if(!Number.isNaN(pageAsNumber) && pageAsNumber > 1) {
        page = pageAsNumber;
    }

    let limit = 10;
    if(!Number.isNaN(limitAsNumber) && limitAsNumber > 0 && limitAsNumber < 10) {
        limit = limitAsNumber;
    }

    // let { page, limit } = req.query;
    // let { page, limit } = req.query;

    // if(!page || page <= 0) {
    //     page=1;
    // }

    // if(!limit) {
    //     limit=2;
    // }

    offset = ( page - 1 ) * limit;

    // const sql_query = `SELECT user_id, user_name, gender, status FROM users LIMIT ${size} OFFSET ${skip}`;
    // const sql_query2 = 'SELECT user_id, user_name, gender, status FROM users LIMIT ? OFFSET ?';
    //     'SELECT COUNT(*) as total FROM users';

    const users_count_sql = `SELECT COUNT(*) as total FROM users`;

    const select_user_sql = `
        SELECT user_id, user_name, user_email, user_gender, user_status, createdAt 
        FROM users
        ORDER BY createdAt DESC
        LIMIT ? OFFSET ?
    `;
    
    await pool.execute(users_count_sql, (err, totals) => {
        if (err) throw err;

        pool.execute({sql: select_user_sql, timeout: 1000}, [limit.toString(), offset + ""], (err, users) => {
            if(err) return console.log(`The select sql error is: ${err}`);
                
            const ttlUsers = Number.parseInt(totals[0]['total']);
            const ttlPage = Math.ceil(ttlUsers/limit);

            // const data = users.filter((user) => user.user_gender == 'Male');

            res.status(200).json({
                success: true,
                total_users: ttlUsers,
                page: page,
                total_page: ttlPage,
                data: users
            });
        });  
    });     
}
/* 1. END Get All Users */ 

/* 2. START Get A User Details By ID */ 
exports.getUserById = async (req, res, next) => {
    const id = req.query.user_id;
    const userByID_sql = `SELECT user_name, user_email, user_gender FROM users WHERE user_id = ?`;

    if(!id) return res.json({ success: false, message: "user_id is required" });
    if(id < 0 ) return res.json({ success: false, message: "user_id can't be negative" });
    
    await pool.execute(userByID_sql, [id], (err, userByID_result) => {

        if(err) return res.json({ success: false, message: err });

        if(!userByID_result[0]) return res.json({ success: false, message: "The ID is not exists/ found" });

        if(userByID_result) return res.json({ success: true, data: userByID_result });  
        
    });
}
/* 2. END A User Details By ID */ 

/* 3. START User Login*/ 
exports.userLogin = (req, res, next) => {
    const { name, password } = req.body;

    const userLogin_sql = `
        SELECT user_id, user_name, user_password 
        FROM users 
        WHERE user_name = ?
    `;

    if(!name || !password) return res.json({ success: false, message: "Both name and password is required" });
    
    pool.query(userLogin_sql, [name], async (err, results) => {

        if(err) return console.log(`The userLogin query is failed. ${err}`);
        if(results.length > 0) {
            // console.log(`result length is: ` + results.length);
            // const theToken = jwt.sign({user_id: userLogin_result[0].user_id,}, secretKey, { expiresIn: 60*60 });
            // userLogin_result[0].token = theToken;
            const comparison = await bcrypt.compare(password, results[0].user_password);
            if(comparison) return res.json({ success: true, message: "Login success" });
            if(!comparison) return res.json({ success: false, message: "Wrong password" });
        } 
        if(results.length == 0) return res.json({ success: false, message: "Account not found" });     
    }); 
}
/* 3. END User Login*/ 

/* 4. START Register New User */ 
exports.createNewUser = async (req, res, next) => {
   
    const { name, email, password, confPassword, gender} = req.body;

    const genSelection = ["Male", "Female", "Others"];

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
 
    const select_sql = `
        SELECT user_name, user_email 
        FROM users 
        WHERE user_name = ? OR user_email = ?
    `;

    const createuser_sql = `
        INSERT INTO users (user_name, user_email, user_password, user_gender) 
        VALUES (?, ?, ?, ?) 
    `;

    if (confPassword !== password) 
        return res.json({success: false, message: "Both passwords are not matching"});

    if (!name || !email || !password || !confPassword || !gender) 
        return res.json({success: false, message: "All inputs can't be empty"});
    
    if (name.length <= 3) 
        return res.json({success: false, message: "The name should be more than 4 characters"});

    if (password.length <= 3) 
        return res.json({success: false, message: "The password should be more than 4 characters"});

    if (!genSelection.includes(gender))
        return res.json({success: false, message: "Select gender"});

    // Logical Registration begins here
    pool.execute(select_sql, [name, email], (err, select_result) => {

        // IF select_sql has errors THEN see what kind of error in that sql
        if (err) return console.log(`The error is ${err}`);

        // If there is a result from users then do validations my name and email
        if (select_result.length > 0) {
            
            // CHECK the result/ row WHERE user_name == name
            if (select_result[0].user_name == name) 
                return res.json({ success: false, message: `The username has been taken` }); 

            // CHECK the result/ row WHERE user_email == email
            if (select_result[0].user_email == email) 
                return res.json({ success: false, message: `The email has been taken` }); 

        } 

        // IF there is no result THEN proceeds the registration
        if (select_result.length == 0) {

            pool.execute(createuser_sql, [name, email, hashPassword, gender], (err, register_result) => {
                if (err) return console.log(err);
                    
                if (register_result) return res.json({ success: true, message: `Successfully registered` });
            });
            return;

        } 
    }); 
}
/* 4. END Register New User */ 

/* 5. START Update User Info By ID */ 
exports.updateUserById = async (req, res, next) => {
    const id = req.params.user_id;
    let info = req.body;

    if(!id) return res.json({ success: false, message: "The user_id is required" });

    const update_sql = `
        UPDATE users 
        SET user_name = ?, user_email = ?, user_gender = ?
        WHERE user_id = ?
    `;

    pool.query(update_sql, [info.user_name, info.user_email, info.user_gender, id], (err, results) => {

        if (err) {
            console.log(err);
            res.json({ success: false, message: `The update sql has an error ${err}` });
            return
        }

        res.json({ success: true, message: `Details has been updated`, data: results });

    });
}
/* 5. END Update User Info By ID */ 

/* 6. START Delete A User By ID*/
exports.deleteUserById = async (req, res, next) => {

    const userId = req.query.user_id;
    const select_user = `SELECT user_id FROM users WHERE user_id = ?`;
    const delete_user = `DELETE FROM users WHERE user_id = ?`;

    if (!userId) return res.json({success: false, message: "The user_id can't be empty"});

    await pool.execute(select_user, [userId], (err, select_result) => {
        
        if (err) return console.log(`The select sql error is ${err}`);
        
        if (!select_result[0]) return res.json({ success: false, message: "The user_id is not found or has been deleted"});
         
        if (select_result.length > 0) {
            pool.execute(delete_user, [userId], (err, delete_result) => {
                if (err) return console.log(`The delete sql error is ${err}`);

                if (delete_result) return res.json({ success: true, message: `The user_id of ${userId} has been deleted` });
            });
        }
    });
}
/* 6. END Delete A User */

/* 7. START Delete All User */
exports.deleteAllUsers = async (req, res, next) => {
    res.send("Deleted a user");
}
/* 7. END Delete All User */

