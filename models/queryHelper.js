const mysql = require('../common/library/dbMaster')


exports.findOne = async(table,field,where,join) => {
    const connection = await mysql.connection()
    try {

        let sql = `SELECT ${field} FROM ${table}`
        if(where) sql += ` WHERE ${where} LIMIT 1`
        let [result] = await connection.query(sql) 
        return result
        
    } catch (error) {
        console.log(error)
        return {
            error
        }
    } finally {
        await connection.release();
    }

}

exports.update = async(table,fields,where) => {
    const connection = await mysql.connection()
    try {
        let sql = `UPDATE ${table} SET ?`
        if(where) sql += ` WHERE ${where} `
        let result = await connection.query(sql,fields) 
        return result
        
    } catch (error) {
        console.log(error)
        return {
            error
        }
    } finally {
        await connection.release();
    }
}

exports.insert = async(table,field,where,join) => {
    const connection = await mysql.connection()
    try {
        let sql = `INSERT INTO ${table} SET ?`
        if(where) sql += ` WHERE ${where} `
        let result = await connection.query(sql,field) 
        return result
        
    } catch (error) {
        console.log(error)
        return {
            error
        }
    } finally {
        await connection.release();
    }

}

exports.insertMultiple = async (table,keys,data) => {
    const connection = await mysql.connection()
    try{
        // console.log(keys)
        let sql = `INSERT INTO ${table} (${keys.join(",")}) VALUES ?`
        return await query(sql,data)
    }
    catch(error) {
        return { error }
    }  
    finally {
        await connection.release();
    }
}

exports.delete = async (table, where = "", In = "", join = "") => {
    const connection = await mysql.connection()
    try {
        console.log("Done Insert", In)
        let sql = `DELETE FROM ${table}`
        if (join) sql += `${join}`
        if (where) sql += ` WHERE ${where}`
        if (In) sql += ` IN (?)`
        if (In) {
            return await connection.query(sql, In);
        } else {
            
            return await connection.query(sql)
        }
    }
    catch (error) {
        return { error }
    }
    finally {
        await connection.release();
    }
}

exports.deleteMultiple = async (table,fields,where="",In="",join="") => {
    const connection = await mysql.connection()
    try{
        console.log("Done Insert",In)
        let sql = `DELETE ${fields} FROM ${table}`
        if(join) sql += `${join}` 
        if(where) sql += ` WHERE ${where}`
        if(In) sql += ` IN (?)`
        if(In){
           
            return await connection.query(sql,In);
        }else{
         
            return await connection.query(sql)
        }
    }
    catch(error){
        return { error }
    }
    finally {
        await connection.release();
    }
}