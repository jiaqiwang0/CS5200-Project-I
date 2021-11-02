const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function connect() {
	return await open({
		filename: "./db/restaurant.db",
		driver: sqlite3.Database,
	});
}

async function getRestaurants(query, page, pageSize) {
	const db = await connect();
	const stmt = await db.prepare(`
    SELECT * FROM Restaurant
    WHERE name LIKE @query
    LIMIT @pageSize
    OFFSET @offset;
    `);

	const params = {
		"@query": query + "%",
		"@pageSize": pageSize,
		"@offset": (page - 1) * pageSize,
	};

	try {
		return await stmt.all(params);
	} finally {
		await stmt.finalize();
		db.close();
	}
}

async function getRestaurantCount(query) {
	const db = await connect();
	const stmt = await db.prepare(`
    SELECT COUNT(*) AS count
    FROM Restaurant
    WHERE name LIKE @query;
    `);

	const params = {
		"@query": query + "%",
	};

	try {
		return (await stmt.get(params)).count;
	} finally {
		await stmt.finalize();
		db.close();
	}
}

async function viewRestaurantsyID(restID) {
	const db = await connect();
	const stmt = await db.prepare(`SELECT *
    FROM Restaurant
    WHERE
      restID = :restID
  `);

	stmt.bind({
		":restID": restID,
	});

	return await stmt.get();
}

async function createRestaurant(r) {
	const db = await connect();

	const stmt = await db.prepare(`INSERT INTO
    Restaurant
    VALUES (:restID,:name,:address,:zip,:city,:state,:country,:dressCodeID,:priceRangeMin,:priceRangeMax,:openHours,:closeHours)
  `);

	stmt.bind({
		restID: r.restID,
		":name": r.name,
		":address": r.address,
		":zip": r.zip,
		":city": r.city,
		":state": r.state,
		":country": r.country,
		":dressCodeID": r.dressCodeID,
		":priceRangeMin": r.priceRangeMin,
		":priceRangeMax": r.priceRangeMin,
		":openHours": r.openHours,
		":closeHours": r.closeHours,
	});

	return await stmt.run();
}

async function updateRestaurant(r) {
	const db = await connect();
	const stmt = await db.prepare(`UPDATE 
    Restaurant SET
    restID = :restID,
    name=:name,
    address=:address,
    zip=:zip,
    city=:city,
    state=:state,
    country=:country,
    dressCodeID=:dressCodeID,
    priceRangeMin=:priceRangeMin,
    priceRangeMax=:priceRangeMax,
    openHours=:openHours,
    closeHours=:closeHours
    WHERE
    restID = :restID
  `);
	stmt.bind({
		":restID": r.restID,
		":name": r.name,
		":address": r.address,
		":zip": r.zip,
		":city": r.city,
		":state": r.state,
		":country": r.country,
		":dressCodeID": r.dressCodeID,
		":priceRangeMin": r.priceRangeMin,
		":priceRangeMax": r.priceRangeMax,
		":openHours": r.openHours,
		":closeHours": r.closeHours,
	});
	return await stmt.run();
}

async function viewServices(restID) {
	const db = await connect();
	const stmt = await db.prepare(`SELECT *
    FROM Services
    WHERE
      restID = :restID
  `);

	stmt.bind({
		":restID": restID,
	});

	return await stmt.get();
}

async function viewFacilities(restID) {
	const db = await connect();
	const stmt = await db.prepare(`SELECT *
    FROM Facilities
    WHERE
      restID = :restID
  `);

	stmt.bind({
		":restID": restID,
	});

	return await stmt.get();
}

async function viewPaymentMethod(restID) {
	const db = await connect();
	const stmt = await db.prepare(`select P.method from PaymentMethods P 
inner join PaymentMethodsRestaurant R
on P.paymentMethodsID = R.paymentMethodsID
where 
R.restID = :restID;
  `);

	stmt.bind({
		":restID": restID,
	});

	return await stmt.all();
}

async function viewWorkingDays(restID) {
	const db = await connect();
	const stmt = await db.prepare(`select D.days from Days D
inner join WorkingDays W
on W.daysID = D.daysID
where 
W.restID = :restID;
  `);

	stmt.bind({
		":restID": restID,
	});

	return await stmt.all();
}

async function getCuisineByID(restID) {
	const db = await connect();
	const stmt = await db.prepare(`select C.cuisine from Cuisine C
inner join CuisineRestaurant R
on C.cuisineID = R.cuisineID
where 
R.restID = :restID;
  `);

	stmt.bind({
		":restID": restID,
	});

	return await stmt.all();
}

//async function deleteRestaurant(restID) {
// 	const db = await connect();
// 	const stmt = await db.prepare(`DELETE FROM
// 		Restaurant
//     WHERE restID = :restID
//   `);

// 	stmt.bind({
// 		":restID": restID,
// 	});

// 	return await stmt.run();
// }

module.exports.getRestaurants = getRestaurants;
module.exports.viewRestaurantsyID = viewRestaurantsyID;
module.exports.createRestaurant = createRestaurant;
module.exports.updateRestaurant = updateRestaurant;
//module.exports.deleteRestaurant = deleteRestaurant;
module.exports.viewWorkingDays = viewWorkingDays;
module.exports.viewPaymentMethod = viewPaymentMethod;
module.exports.viewFacilities = viewFacilities;
module.exports.viewServices = viewServices;
module.exports.getRestaurantCount = getRestaurantCount;
module.exports.getCuisineByID = getCuisineByID;
