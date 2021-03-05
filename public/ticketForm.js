let user = JSON.parse(sessionStorage.getItem("user"))
console.log(user)
document.getElementById("form_name").value = user.given_name;
document.getElementById("form_lastname").value = user.family_name;
document.getElementById("form_email").value = user.email;


function reload() {
    window.location = "./dashboard";
}

function submitForm() {
    let firstName = document.getElementById("form_name").value;
    let lastName = document.getElementById("form_lastname").value;
    let email = document.getElementById("form_email").value;
    let type = document.getElementById("form_need").value;
    let priority = document.getElementById("form_priority").value;
    let ticketDetails = document.getElementById("form_message").value;

    let date = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`

    let data = {
        name: `${firstName} ${lastName}`,
        email: email,
        type: type,
        ticketDetails: ticketDetails,
        status: 'pending',
        priority: priority,
        requestedDate: date
    }
    console.log(data)
    fetch('/tickets', {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then((res) => {
            window.location.href = "./confirmation"


            // try that...
            /*    
                if (res.redirect) {
                  
                  window.location.href = res.url;
                }
            */
        })
}



// (user, context, callback){
//     user.app.metadata = user.app_metadata || {};
//     let addRolesToUser = function(user, cb){
//         if (user.email === "lokbiswa@gmail.com"){
//             cb(null, ['admin']);
//         }else {
//             cd (null, ['user']);
//         }
//     }
// }

// addRolesToUser(user, function(err, roles){
//   	if(err){
//         callback(err)
//     } else{
//         user.app_metadata.roles = roles;
//         auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
//         .then(()=>{
//             callback(null, user, context);
//         })
//       .catch((err)=>{
//             callback(err)
//         });
//     }                                                                                                                                                               
// });


// function setRolesToUser(user, context, callback) {
//   // Roles should only be set to verified users.
//   if (!user.email || !user.email_verified) {
//     return callback(null, user, context);
//   }

//   user.app_metadata = user.app_metadata || {};
//   // You can add a Role based on what you want
//   // In this case I check domain
//   const addRolesToUser = function (user) {
//     const endsWith = '@example.com';

//     if (
//       user.email &&
//       user.email.substring(
//         user.email.length - endsWith.length,
//         user.email.length
//       ) === endsWith
//     ) {
//       return ['admin'];
//     }
//     return ['user'];
//   };

//   const roles = addRolesToUser(user);

//   user.app_metadata.roles = roles;
//   auth0.users
//     .updateAppMetadata(user.user_id, user.app_metadata)
//     .then(function () {
//       context.idToken['https://example.com/roles'] = user.app_metadata.roles;
//       callback(null, user, context);
//     })
//     .catch(function (err) {
//       callback(err);
//     });
// }