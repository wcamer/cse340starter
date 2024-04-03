const pool = require("../database/index")

//to get the items in the cart table
async function addItemToCart(inv_id, inv_year, inv_make, inv_model, inv_price, inv_thumbnail, account_id){

	try {
		const sql = "INSERT INTO cart (inv_id, inv_year, inv_make, inv_model, inv_price, inv_thumbnail, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"
	    const data = await pool.query(sql, [inv_id, inv_year, inv_make, inv_model, inv_price, inv_thumbnail, account_id])
        return data.rows
    }catch (error){

	return error.message
	}//end try catch

}// end of addItemToCart

async function getCartItems(account_id){
	try{
		const sql = "SELECT * FROM cart WHERE account_id = $1";
		const data = await pool.query(sql, [account_id])
		return data.rows//this will return an array
	}catch(error){
		return error.message
	}
}//end of cartItems function

module.exports = {addItemToCart, getCartItems}