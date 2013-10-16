function db_open(){
    return openDatabase("com.yxgz.exPMA","0.1","ezPMA",1024*1024);
}

function list_accounts(){
    var sql = "create table if not exists accounts (";
    sql += "id int primary key autoincrement,";
    sql += "title text not null,";
    sql += "remarks text,"
    sql += "url text,";
    sql += "username text,";
    sql += "password text"
    sql += ");";

    sql += "select * from accounts;";
    
    var db = db_open();
    
    var ret = null;
    
    var t = function(transaction){
        transaction.executeSql(sql);
    }
    
    var r = function(result){
        ret = result;
    }
    
    var e = function(tx,err){
        alert(err);
    }
    
    db.transaction(t,r,e);

    return ret==null ? new Array() : ret;
}

function accounts_update(acc){

}

function saveAccount(){
    history.back();
}