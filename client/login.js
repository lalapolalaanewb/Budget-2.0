// API URL
const API_URL = 'http://localhost:5000/auth/login'// fetch data from db

// Fetch Data Controller - handles API data fetching
const fetchData = (() => {

    return {
        
        // cross check inputted user credentials with database
        userCredentialsCheck: async (userCredentials) => {
            
            const res = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(userCredentials),
                headers: {
                    'content-type': 'application/json'
                }
            })
            const json = await res.json()

            // fetch(API_URL, {
            //     method: 'POST',
            //     body: JSON.stringify(userCredentials),
            //     headers: {
            //         'content-type': 'application/json',
            //         'token-key': 'alalpoalkjslfndlknf'
            //     }
            // })
            // .then(res => res.json())
            // .then(data => console.log(data))
            // .catch(err => console.log(err))

            return json
        },

        getLoginUserInfo: async () => {

            const res = await fetch(API_URL)
            const json = await res.json()
            return json
        }
    }
})();

// Login Controller - handles all login credentials check
const loginController = ((fD) => {

    return {

        // check & return user credentials
        credentialsCheck: async (userInputEmail, userInputPassword) => {

            let userCredentials = {
                inputEmail: userInputEmail,
                inputPassword: userInputPassword
            }

            // init fD first
            fD = await fD

            // get respond & credentials of user
            let userCheckedCredentials = fD.userCredentialsCheck(userCredentials)

            return userCheckedCredentials
        },

        getLoginInfo: async () => {

            fD = await fD

            return fD.getLoginUserInfo()
        }
    }

})(fetchData);

// UI Controller - handles all UI stuff
const UIController = (() => {

    // create a DOMstrings var to hold every DOMstrings use
    let DOMstrings = {
        inputLoginEmail: '.input-login',
        inputLoginPassword: '.input-password',
        btnSubmitLogin: '.submit-login',
        btnSubmitRegister: '.submit-register',
        labelErrorMessage: '.error_message'
    }

    return {
        
        // get & return user inputs
        getUserInput: () => {

            return {

                // get user email input
                userLoginEmail: document.querySelector(DOMstrings.inputLoginEmail).value,
                // get user email input
                userLoginPassword: document.querySelector(DOMstrings.inputLoginPassword).value
            }
        },

        // clear user input fields after user hit 'enter' or 'button'
        clearInputFields: () => {

            let fields, fieldsArray

            // return a list of fields
            fields = document.querySelectorAll(DOMstrings.inputLoginEmail + ', ' + DOMstrings.inputLoginPassword)
            // console.log(fields)
            // convert to array - using slice (return copy of array)
            fieldsArray = Array.prototype.slice.call(fields)
            // console.log(fieldsArray)
            // set the input fields to empty back
            fieldsArray.forEach(current => current.value = '')

            // set the focus back to descrption input field
            fieldsArray[0].focus()
        },

        // init/hide error message
        initErrorMessage: () => {

            document.querySelector(DOMstrings.labelErrorMessage).style.display = 'none'
        },

        // displayy error message
        displayErrorMessage: errMessage => {

            document.querySelector(DOMstrings.labelErrorMessage).innerHTML = errMessage
            document.querySelector(DOMstrings.labelErrorMessage).style.display = 'inline-block'
        },

        // return private DOMstrings to controller
        getDOMstrings: () => {

            return DOMstrings
        }
    }
})();

// Controller - handles all interaction between Login Controller & UI Controller
const controller = ((loginCtrl, UICtrl) => {

    // function to init all controllers first
    let initAllCtrl = async() => {
         
        UICtrl = await UICtrl
        loginCtrl = await loginCtrl
    }

    // setup user addEventListener function
    let userEventListener = () => {

        // 1. get all passed DOMstrings
        let DOM = UICtrl.getDOMstrings()

        // 2. call a callback function when a 'login' button was pressed
        document.querySelector(DOM.btnSubmitLogin).addEventListener('click', ctrlLoginCredentials)

        // 3. call a call back fucntion when an 'enter' key was pressed
        document.addEventListener('keydown', event => {

            // init/hide error message
            UICtrl.initErrorMessage()

            // when 'enter' key was pressed, then call a function
            if(event.keyCode === 13 || event.which === 13) {

                // call a function to handles login credentials check & respond
                ctrlLoginCredentials()
            }
        })

        // 4. call a callback function when a 'register' button was pressed
        document.querySelector(DOM.btnSubmitRegister).addEventListener('click', ctrlRegisterCredentials)
    }

    // handles login credentials check & respond
    let ctrlLoginCredentials = async () => {

        // init all controller first
        initAllCtrl()

        let input

        // 1. get user input
        input = UICtrl.getUserInput()
        // console.log(input)

        // check if input was 'placed' or 'empty'
        if(input.userLoginEmail !== '' && input.userLoginPassword !== '') {

            // console.log('Have data!')

            // 2. get & check if credentials exist or not
            let loginRespond = await loginCtrl.credentialsCheck(input.userLoginEmail, input.userLoginPassword)
            
            if(loginRespond.message === 'Logged In') {
                
                localStorage.setItem('auth-token', loginRespond.token)
                console.log('Masok!')
                let homeURL = '/index.html'
                // let homeURL = 'https://www.google.com'
                window.location.replace(homeURL)
            } else {

                // 3. Clear inputs placeholder once user hit 'enter' or 'button'
                UICtrl.clearInputFields()

                // 4. display 'error' message or 'redirect' to homepage (if else statement here)
                UICtrl.displayErrorMessage(loginRespond.message)
            }
        }
    }

    let ctrlRegisterCredentials = async () => {

        initAllCtrl()

        let getUserInfo = loginCtrl.getLoginInfo()
        console.log(await getUserInfo)
    }

    return {

        // init function on login page
        init: () => {

            console.log('In login page bruh!')
            console.log(location.protocol + location.host + '/' + location.pathname.split('/')[1] + '/' + location.pathname.split('/')[2] + '/' + location.pathname.split('/')[3])

            // call userEventListener function
            userEventListener()
        }
    }
})(loginController, UIController);

// call init function
controller.init()