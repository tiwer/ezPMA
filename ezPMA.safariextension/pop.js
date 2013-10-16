
var account = {
    load:function(){},
    save:function(arr){},
    go:function(id){},
}

account.load = function(){
    var saved = localStorage.getItem("com.yxgz.ezPMA.account");
    try{
        var ret = JSON.parse(saved);
        return ret==null ? new Array() : ret;
    }catch(err){
        return new Array();
    }
}

account.save = function(arr){
    localStorage.setItem("com.yxgz.ezPMA.account",JSON.stringify(arr));
}

account.go = function(id){
    var acc = account.load()[id];
    var tab = safari.application.activeBrowserWindow.openTab("foreground",0);

    var onPageLoaded = function(msgEvent){
        if(msgEvent.name=="ezPMA_injected"){
            tab.page.dispatchMessage("ezPMA_login",acc);
        }
        tab.removeEventListener("message",onPageLoaded);
    }
    
    tab.addEventListener("message",onPageLoaded,false);
    
    safari.application.activeBrowserWindow.activeTab.url=acc.url;
}

var mainController = {
    refresh:function(){},
    showDetail:function(id){},
    open:function(id){},
    newAccount:function(){},
}

var detailController = {
    _id:-1,
    load:function(id){},
    requestDelete:function(){},
    edit:function(){},
    refresh:function(){},
    visit:function(){},
}

var editController = {
    _id:-1,
    load:function(id){},
    save:function(){},
    test:function(){},
}

var deleteDlgController = {
    _id:-1,
    load:function(id){},
    confrim:function(){},
}

mainController.refresh = function(){
    $("#main_listview").children().remove();
    
    var accounts = account.load();
    if(accounts.length==0){
        $("#main_nodata").show();
    }else{
        $("#main_nodata").hide();
        
        for(var i=0;i<accounts.length;i++){
            var acc = accounts[i];
            var item = "<li>";
            item += "<a href='#' onclick='account.go("+i+")'>"+acc.title+"</a>";
            item += "<a href='#' onclick='mainController.showDetail("+i+");'></a>";
            item += "</li>";
            $("#main_listview").append(item);
        }
        $("#main_listview").listview("refresh");
    }
}

mainController.showDetail = function(id){
    detailController.load(id);
    $.mobile.changePage("#detail",{transition:"slide"});
}

mainController.newAccount = function(){
    editController.load(-1);
    $.mobile.changePage("#edit",{transition:"flip"});
}

editController.load = function(id){
    editController._id = id;
    if(id<0){
        $("#edit_title").val("新建数据库");
        $("#edit_remarks").val(null);
        $("#edit_url").val("http://");
        $("#edit_username").val(null);
        $("#edit_password").val(null);
    }else{
        var acc = account.load()[id];
        $("#edit_title").val(acc.title);
        $("#edit_remarks").val(acc.remarks);
        $("#edit_url").val(acc.url);
        $("#edit_username").val(acc.username);
        $("#edit_password").val(acc.password);
    }
}

editController.save = function(){
    var acc = new Object();
    acc.title = $("#edit_title").val();
    acc.remarks = $("#edit_remarks").val();
    acc.url = $("#edit_url").val();
    acc.username = $("#edit_username").val();
    acc.password = $("#edit_password").val();
    
    var lst = account.load();
    
    if(editController._id<0){
        lst.push(acc);
    }else{
        lst[editController._id]=acc;
    }
    
    account.save(lst);
    
    history.back();
}

editController.test = function(){
    account.go(editController._id);
}

detailController.load = function(id){
    detailController._id = id;
    var acc = account.load()[id];
    $("#detail_title").text(acc.title);
    $("#detail_remarks").text(acc.remarks);
    $("#detail_url").text(acc.url);
}

detailController.edit = function(){
    editController.load(detailController._id);
    $.mobile.changePage("#edit");
}

detailController.refresh = function(){
    if(detailController._id>=0) detailController.load(detailController._id);
}

detailController.visit = function(){
    account.go(detailController._id);
}

detailController.requestDelete = function(){
    deleteDlgController.load(detailController._id);
    $.mobile.changePage("#dlgdel");
}

deleteDlgController.load = function(id){
    deleteDlgController._id = id;
    var acc = account.load()[id];
    $("#dlgdel_title").text("删除 "+acc.title+" 的登陆信息？");
}

deleteDlgController.confrim = function(){
    var lst = account.load();
    lst.splice(deleteDlgController._id,1);
    account.save(lst);
    history.go(-2);
}

onload = function(){
    $('#main').bind('pagebeforeshow',function(event, ui){ mainController.refresh(); });
    $('#detail').bind('pagebeforeshow',function(event, ui){ detailController.refresh(); });
    mainController.refresh();
}