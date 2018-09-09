module.exports = function () {
    //console.log(process.env.NODE_ENV);
    switch (process.env.NODE_ENV) {
        case 'staging':
            return {
                "database": "accountsoftware",
                "username": "root",
                "password": "root",
                "host": "localhost",
                "dialect": "mysql",
                "port": 3306,
                "stripeKey": "sk_test_Y1yT2JpZ0qVfE6P8NnISwpN3",
                "secret": "nzHRWuPxG8g3srwYYE",
                "linkUrl": "http://localhost:3000/",
                // "linkSmpl": "http://localhost:3001/",
                // "emailSmpl": "app@smplpos.com",
                // "passwordSmpl": "smpl2312141",
                // "apiKeySmpl": "gfweqr13434sadfaf",
                // "iv": "YhfeqVPR8MVkheGG",
                // "key": "hDzJVukuaDJcnmLjFwoGCyDCtB8frmTA",
                // "email": "saqib+1@cellsmartpos.com",
                "unlockKey": "aGJHqy-HqNxMT-6RVezm-anY8TT-V22DKB-kyDA6g"
            };

            /*return {
                "database": "testCSGBilling",
                "username": "saqib",
                "password": "tiGfdA}Hw^8dDiHFaD,bgBJ,cYuf,^D4wE",
                "host": "72.80.56.19",
                "dialect": "mysql",
                "port": 3306,
                "stripeKey": "sk_test_Y1yT2JpZ0qVfE6P8NnISwpN3",
                "secret": "nzHRWuPxG8g3srwYYE",
                "linkUrl": "http://billing.us-west-2.elasticbeanstalk.com/"
            };*/

        case 'production':
            return {
                "database": "accountsoftware",
                "username": "root",
                "password": "root",
                "host": "localhost",
                "dialect": "mysql",
                "port": 3306,
                "stripeKey": "sk_test_Y1yT2JpZ0qVfE6P8NnISwpN3",
                "secret": "nzHRWuPxG8g3srwYYE",
                "linkUrl": "http://localhost:3000/",
                "linkSmpl": "http://localhost:3001/",
                "emailSmpl": "app@smplpos.com",
                "passwordSmpl": "smpl2312141",
                "apiKeySmpl": "gfweqr13434sadfaf",
                "iv": "YhfeqVPR8MVkheGG",
                "key": "hDzJVukuaDJcnmLjFwoGCyDCtB8frmTA",
                "email": "saqib+1@cellsmartpos.com",
                "unlockKey": "aGJHqy-HqNxMT-6RVezm-anY8TT-V22DKB-kyDA6g"
            };

        default:

            return {
                "database": "accountsoftware",
                "username": "root",
                "password": "root",
                "host": "localhost",
                "dialect": "mysql",
                "port": 3306,
                "stripeKey": "sk_test_Y1yT2JpZ0qVfE6P8NnISwpN3",
                "secret": "nzHRWuPxG8g3srwYYE",
                "linkUrl": "http://localhost:3000/",
                "linkSmpl": "http://localhost:3001/",
                // "emailSmpl": "app@smplpos.com",
                // "passwordSmpl": "smpl2312141",
                // "apiKeySmpl": "gfweqr13434sadfaf",
                // "iv": "YhfeqVPR8MVkheGG",
                // "key": "hDzJVukuaDJcnmLjFwoGCyDCtB8frmTA",
                // "email": "saqib+1@cellsmartpos.com",
                "unlockKey": "aGJHqy-HqNxMT-6RVezm-anY8TT-V22DKB-kyDA6g"
            };


    }
};