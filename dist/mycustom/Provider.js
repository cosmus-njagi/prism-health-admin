$("document").ready(()=>{
    loadProviders();
    $('map')
    geolocation();
    $('productSubmit').on('submit', function(e){
        e.preventDefault();
        newProvider();
    })
});

let token= window.sessionStorage.getItem("token")
console.log(token)
var position=[]
var geolocation= ()=>{
    map.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        position=[]
        var latitude=mapsMouseEvent.latLng.lat();
        var longitude=mapsMouseEvent.latLng.lng();
        position.push(latitude)
        position.push(longitude)
      });
    }
  
var newProvider=()=>{
    var validation;
    var form = document.getElementById('add_provider');

    validation = FormValidation.formValidation(
        form,
        {
            fields: {
                pFirstName: {
                    validators: {
                        notEmpty: {
                            message: 'Firstname is required'
                        }
                    }
                },
                pLastName: {
                    validators: {
                        notEmpty: {
                            message: 'Lastname is required'
                        }
                    }
                },
                pEmail: {
                    validators: {
                        notEmpty: {
                            message: 'Email address is required'
                        },
                        emailAddress: {
                            message: 'The value is not a valid email address'
                        }
                    }
                },
                pPhone: {
                    validators: {
                        notEmpty: {
                            message: 'Phone is required'
                        },
                        regexp: {
                            regexp: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                            message: 'The phone can only have  number and underscore'
                        }
                    }
                },
                pUsername: {
                    validators: {
                        notEmpty: {
                            message: 'Username  is required'
                        }
                    }
                },
                pPassword: {
                    validators: {
                        notEmpty: {
                            message: 'Password  is required'
                        }
                    }
                },

            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap()
            }
        })

        
        validation.validate().then(function(status){
            alert("To register a provider we need to access your location");
            if(status=='Valid'){
                let firstName=document.getElementsByName("pFirstName").value();
                let lastName=document.getElementsByName("pLastName").value();
                let e=document.getElementById("pGender");
                let email=e.options[e.selectedIndex].text;
                let gender=document.getElementsByName("pFirstName").value();
                let phone=document.getElementsByName("pPhone").value();
                let username=document.getElementsByName("pUsername").value();
                let password=document.getElementsByName("pPassword").value();
                if(position.length==0){
                    alert("Enter providers location")
                }
                let body=JSON.stringify({firstName:firstName,secondName:lastName,phone:phone,username:username,password:password,
                email:email, gender:gender,position:position,accountType:"PROVIDER"
                })
                let url="http://172.105.167.182:8081/admin/providers";
                fetch(url, {
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body:body
                })
                .then((res)=>{
                    if(res.ok){
                        location.reload(); 
                    }
                    else {
                        throw new Error("Server error")
                    }
                })
                .catch(err=>{
                   console.log(err);
                });
            }})
}
var loadProviders=()=>{
    var url="http://172.105.167.182:8081/admin/providers"
    var token = window.sessionStorage.getItem("token");
    console.log(token)
    if(token!==""){
        fetch(url, {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
               
                'Authorization': 'Bearer ' +token,
                
              },  
        }).then(res => {
                if(res.ok){
                return res.json();
            }
            else{
                throw new Error("A server error occurred")
            }
        } ).then((data)=>{
            let html="";
            data.forEach((provider)=>{
               html+=`<tr>  
               <td>${provider.firstName} ${provider.secondName}<td>
               <td>${provider.phone}</td>
               <td>${provider.email}</td>
               <td>${provider.blocked}</td>
               </tr> `
            })

        document.getElementById("pCategory").innerHTML=html
        })
        .catch(err=>{
            console.log(err);
        })
    }
}

var loadProviders=()=>{
    var url="http://172.105.167.182:8081/admin/providers"
    var token=window.sessionStorage.getItem("token");
    if(token!==""){
        fetch(url, {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },  
        }).then(res=> {  

            if(res.ok){
                return res.json();
            }
            else{
                throw new Error("A server error occurred")
            }
        } ).then((data)=>{ 
            let html="";
            data.forEach((provider)=>{
               html+=`<tr>  
               <td>${provider.firstName} ${provider.secondName}</td>
               <td>${provider.phone}</td>
               <td>${provider.email}</td>
               <td>${provider.blocked}</td>
               <td>Buttons</td>
               </tr> `
            })
console.log(html)
        document.getElementById("provider_table").innerHTML=html
        })
        .catch(err=>{
            console.log(err);
        })
    }
}
