let pool = require('./pool');

module.exports = {
    tableName: 'categories',
    paramName: 'categ_id',
    insertQuery: function() { return "INSERT INTO "+ this.tableName +" (name) values($1) RETURNING id" },
    selectQuery: function() { return "SELECT id, name, image_path FROM "+ this.tableName },
    updateQuery: function() { return "UPDATE  "+ this.tableName +" SET name = ($2) where id=($1)" },
    deleteQuery: function() { return "DELETE FROM "+ this.tableName +" WHERE id=($1)" },
    
    createNew : function(req, res) {

		var data = req.body;

        return pool.query(this.insertQuery(), [data.name])
            .then(resp => {
                
                return {id: resp.rows[0].id, message:"success"};
            })
            .catch(e => {
                throw e;
            })

        
    },

	getAll : function(req, res) {

        let data1 = (new Date()).getTime();
        return pool.query(this.selectQuery())
            .then(resp => { 
                let data2 = (new Date()).getTime();
                console.log((data2-data1)+ "ms");
                return resp.rows; 
            })
            .catch(e => { 
                throw e;
            })

    },
    
    getSingle : function(req, res) {

        var id = req.params[this.paramName];

        return pool.query(this.selectQuery() +' WHERE id=($1)', [id])
            .then(resp => { 
                return resp.rows;
            })
            .catch(e => { 
                throw e;
            })
	},

	updateObject: async function(req) {
        try {
            await pool.query(this.updateQuery(), [req.params[this.paramName], req.body.name]);
            return { id: req.params[this.paramName], message: "success" };
        } catch (e) {
            console.error(e);
            throw e;
        } 
    },
    
	deleteSingle : function(req, res) {

		results = [];
		var id = req.params[this.paramName];

        return pool.query(this.deleteQuery(), [id])
            .then(resp => { 
                if(resp.rowCount == 0)
                     return { id: id, message: "no row with id: "+ id + " exists"};
                else 
                    return { id: id, message: "success" };
            })
            .catch(e => {
                throw e;
            })	 
    }
};