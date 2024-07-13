Ext.btnPermission = function () {
    return {
        checkButtonPermission: function (buttonMarkId, component) {
            $.ajax({
                url: '/mycim2/ajaxflush.do',
                requestMethod: 'checkButtonPermission',
                data: {"markId": buttonMarkId},
                success: function (res) {
                    if (res==1){
                        component.setDisabled(false);
                    }else {
                        component.setDisabled(true);
                        component.hide();
                    }

                },
                callback: function () {
                    component.setDisabled(true);
                    component.hide();
                }
            })
        }
    };
}