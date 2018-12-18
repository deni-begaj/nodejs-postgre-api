import * as mongoose from 'mongoose';
import pool from './pool';
import {Request, Response} from "express";
import CityMongo from '../mongo/models/city';
import CountryMongo from '../mongo/models/country';

export class Country {
    public tableName:string = "countries";
    public paramName:string = 'country_code';
    public selectQuery() :string { return `SELECT id, name, country_code, dial_code FROM ${this.tableName}` };
    
    public getAll (req:Request) :Promise<any> {
        return pool.query(this.selectQuery())
            .then(resp => { 
                return resp.rows;
            })
            .catch(e => { 
                throw e;
            })
    };

    public getByCountryCode (req:Request) :Promise<any> {
        
        let filter:string = req.params[this.paramName];
        //Capitalize the string.
        filter = filter.toUpperCase();

        return pool.query(this.selectQuery() +" WHERE country_code = ($1)", [filter])
            .then(resp => { 
                return resp.rows;
            })
            .catch(e => { 
                throw e;
            })
    };

    public getById (req:Request) :Promise<any> {
        
        let id:string = req.params["country_id"];
        return pool.query(this.selectQuery() +" WHERE id = ($1)", [id])
            .then(resp => { 
                return resp.rows;
            })
            .catch(e => { 
                throw e;
            })
    };

    public async addNewCountry(req:Request, res:Response) :Promise<any>{

        try {
            let country = checkValues(req.body);
            let response = await pool.query(`INSERT INTO countries(name, country_code, dial_code) VALUES ($1, $2, $3) RETURNING id;`, [country.name, country.country_code, country.dial_code]);
            country = createModel(country, response.rows[0].id);
            await CountryMongo.create(country);
            return { id: response.rows[0].id, message: "success" };
        } 
        catch(ex) {
            console.log(ex);
            throw ex;
        }

    }
};

let checkValues = function(country:any) :any {

    if(!country.country_code || typeof country.country_code != "string") { throw new Error('Missing parameter \'country_code\' .'); } 
    if(!country.name || typeof country.name != "string") { throw new Error("Mising parameter 'name' "); }
    if(!country.dial_code || typeof country.dial_code != "string") country.dial_code = "";
    return country;
}

let createModel = function(country:any, countryId:number) :any {
    let obj = new CountryMongo({ _id: countryId, name: country.name, countryCode: country.country_code, dialCode: country.dial_code });
    return obj;
}

// // used to export data from PgSql to MongoDB
// let exportFromSqlToMongo = async function() :Promise<void> {
//     try {

//         let {rows} = await pool.query(`SELECT id, name, country_code, dial_code FROM countries`);
//         let cities:any = await pool.query(`SELECT id, city, latitude, longitude, country_id FROM cities`);
//         cities = cities.rows;

//         console.log(rows.length);
//         console.log(cities.length);
        
//         for(let i=0; i<rows.length; i++){
//             let obj = new CountryMongo({ _id: rows[i].id, name: rows[i].name, country_code: rows[i].country_code, dial_code: rows[i].dial_code });
//             CountryMongo.create(obj, async function(err, country){
//                 if(err) throw err;
//                 for(let j=0; j< cities.length; j++){
//                     if(cities[j].country_id == country._id){
//                         let obj1 = new CityMongo({
//                             _id: cities[j].id,
//                             city: cities[j].city,
//                             latitude: cities[j].latitude,
//                             longitude: cities[j].longitude,
//                             country: country._id
//                         });
//                         let city = await CityMongo.create(obj1);
//                         country.cities.push(city);
//                     }        
//                 }
//                 await country.save();
//             });
//         }
//         console.log("came at the end of FOR.");

//     }
//     catch(err){
//         console.log("Error on exportCountrieSql: " + err);
//         throw err;
//     }

// }

// import mongo from '../mongo/mongo'
// mongo();
// exportFromSqlToMongo();