const pool = require('./pool');
const bcrypt = require('bcrypt');


function User() {};

User.prototype = {
    
    find : function(user = null, callback)
    {
        
        if(user) {
            // if user = number return field = id, if user = string return field = username.
            var field = Number.isInteger(user) ? 'id' : 'username';
        }
        // prepare the sql query
        let sql = `SELECT * FROM users WHERE ${field} = ?`;


        pool.query(sql, user, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    
    create : function(body, callback) 
    {

        var pwd = body.password;
      
        body.password = bcrypt.hashSync(pwd,10);

       
        var bind = [];
      
        for(prop in body){
            bind.push(body[prop]);
        }
        
        let sql = `INSERT INTO users(username, fullname, password) VALUES (?, ?, ?)`;
       
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            
            callback(result.insertId);
        });
    },

    login : function(username, password, callback)
    {
        // find the user data by his username.
        this.find(username, function(user) {
            // if there is a user by this username.
            if(user) {
                // now we check his password.
                if(bcrypt.compareSync(password, user.password)) {
                    // return his data.
                    callback(user);
                    return;
                }  
            }
            // if the username/password is wrong then return null.
            callback(null);
        });
        
    }

}

module.exports = User;