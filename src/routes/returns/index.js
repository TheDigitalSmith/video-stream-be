//POST /api/returns {customerId, filmId}

//Return 401 if client is not logged in
//Return 400 if customerId is not provided
//Return 400 if filmId is not provided
//Return 404 if no rental found with the customer/film
//Return 400 if rental already processed
//Return 200 if valid request
//Set the return date
//Calculate the rental fee
//Increase the stock
//Return the rental
