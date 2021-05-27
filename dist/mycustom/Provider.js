 $("document").ready(function(){
    loadProviders();
    $('#provSubmit').on('click', function (e) {
        e.preventDefault();
        newProvider();
});
})

var token= window.sessionStorage.getItem("token");

var newProvider=()=>{
        var firstName=  $("input[name='pFirstName']").val();
        var lastName= $("input[name='pLastName']").val();
        var gender=document.getElementById("pGender").value;
        var email=$("input[name='pEmail']").val();
        var phone=$("input[name='pPhone']").val();
        var username=$("input[name='pUsername']").val();
        var password=$("input[name='pPassword']").val();
        var latitude=document.getElementById("providerLatitude").value;
        var longitude=document.getElementById("providerLongitude").value;
        var position=[latitude,longitude] 
        if(position.length==0){
            alert("Enter providers location")
        }
        var body=JSON.stringify({firstName:firstName,secondName:lastName,phone:phone,username:username,password:password,
        email:email, gender:gender,position:position,accountType:"PROVIDER"
        })
    
        var url="http://172.105.167.182:8081/admin/providers";

        fetch(url, {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body:body
        })
        .then((res)=>{
            if(res.ok){
                swal.fire({
                    text: "Provider Saved Successfully",
                    icon: "success",
                    buttonsStyling: true,
                    confirmButtonText: "Ok",
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light-primary"
                    }});
                 
                    document.getElementById("add_provider").reset(); 
            }
            else {
                throw new Error("Server error")
            }
        })
        .catch(err=>{
            // console.log(err);
        });
        
}


var loadProviders=()=>{
    var url="http://172.105.167.182:8081/admin/providers"
    var token = window.sessionStorage.getItem("token");
    // console.log(token)
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
        }).then((data)=>{
            var html="";
            data.forEach((provider)=>{
               html+=`<tr>  
               <td>${provider.firstName} ${provider.secondName}</td>
               <td>${provider.phone}</td>
               <td>${provider.email}</td>
               <td>${provider.blocked}</td>
               <td nowrap="nowrap">
                             <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mx-5" title="Edit details">\
								<i class="la la-edit"></i>\
							</a>\
							<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
								<i class="la la-trash"></i>\
							</a>\
               </td>
               </tr> `
            })

        document.getElementById("provider_table").innerHTML=html
        })
        .catch(err=>{
            // console.log(err);
        })
    }
}

