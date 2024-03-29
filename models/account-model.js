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

/*Updated the account info*/
async function accountInfoUpdateModel(account_firstname, account_lastname, account_email, account_id){
    try{
        const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
        const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
        return data.rowCount
    }catch (error){
        console.error("accountInfoUpdateModel error: " + error )
    }
}

async function accountPasswordUpdateModel(account_password, account_id){
    try{
        const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        const data = await pool.query(sql, [account_password, account_id])
        return data.rowcount
    }catch (error){
        console.error("accountInfoUpdateModel error: " + error )
    }
}



module.exports = {registerAccount, checkExistingEmail, checkCorrectCred, getAccountByEmail, accountInfoUpdateModel, accountPasswordUpdateModel}