const pool = require("../database/index")

/* *****************************
*   Register new account
* *************************** */

async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try{
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    }catch (error){
        return error.message
    }
}


/* Checking for existing email in database */
async function checkExistingEmail(account_email){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    }catch (error){
        return error.message
    }
}

async function checkCorrectCred(account_email,account_password){
    try{
        // const sql = "SELECT account_firstname, account_lastname FROM account WHERE account_email = $1 and account_password = $2"
        const sql = "SELECT * FROM account WHERE account_email = $1 and account_password = $2"
        const verfied = await pool.query(sql, [account_email],[account_password])
        console.log("!!!!!!!!!!!!!",verfied)
        return verfied.rowCount
    }catch(error){
        return error.message
    }


}


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
    try{
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0]
        
    } catch (error) {
        return new Error ("No matching email found")
    }
}


module.exports = {registerAccount, checkExistingEmail, checkCorrectCred, getAccountByEmail}