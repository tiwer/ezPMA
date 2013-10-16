function ezPMA_msg(msgEvent) {
    var messageName = msgEvent.name;

    if(messageName=="ezPMA_login"){
        var acc = msgEvent.message;
        var form = document.getElementsByName("login_form");

        if(form.length==0) return;
        
        form = form[0];
        
        var pma_username = document.getElementsByName("pma_username")[0];
        var pma_password = document.getElementsByName("pma_password")[0];
        
        pma_username.value = acc.username;
        pma_password.value = acc.password;
        
        form.submit();
    }
}

safari.self.addEventListener("message", ezPMA_msg, false);

safari.self.tab.dispatchMessage("ezPMA_injected",true);