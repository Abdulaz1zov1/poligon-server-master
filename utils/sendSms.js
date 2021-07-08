const axios = require('axios')

class SMS {
    constructor(phone,token,code) {
        this.phone = phone
        this.token = token
        this.code = code
    }
    sendSMS(){
            axios({
                method: "POST",
                url: 'https://notify.eskiz.uz/api/message/sms/send',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                data: {
                    mobile_phone: this.phone.slice(1,13), //+998977909404 => 998977909404
                    message: `Parolni tiklash uchun sms code: ${this.code}`
                }
            }).then(()=> {
                console.log('success')
            })
                .catch(function (error) {
                    console.log(error);
                });
    }
}
module.exports = SMS;
