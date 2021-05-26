$("document").ready(()=>{
    loadServices();
    // $('pSubmit').on('click', function(e){
    //     e.preventDefault();
    //     newProvider();
    // })
});

var loadServices=()=>{
    var url="http://172.105.167.182:8081/services/users/all";

    fetch(url).then((res)=> res.json())
    .then((data)=>{
        let html="";
        data.forEach((service)=>{
           html+= `<tr>
                <td>${service.name}</td>
                <td>${service.charges}</td>
                <td>${service.provider.firstName}</td>
                <td>${service.provider.phone}</td>
                <td>${service.verified}</td>
            </tr>`
        })
        document.getElementsById("services_table").innerHTML=html;
    })
}

var newService=()=>{
    var url="http://172.105.167.182:8081/services/providers/services"; 

    fetch(url,{
        method: "POST",
        headers:{
            "content":"application/json",
            "Authorization":`Bearer ${token}`
        },
        body: body
    })

}
