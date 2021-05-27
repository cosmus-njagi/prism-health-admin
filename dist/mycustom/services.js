$("document").ready(()=>{
    loadServices();
    loadSubCategories();
    $('#servSubmit').on('click', function (e) {
        e.preventDefault();
        newService();
});
    document.querySelector('#service_images_upload').addEventListener('change', event => {
		handleImageUpload(event);
	})
});

var imageUris=[];
var token=window.sessionStorage.getItem("token")
var loadSubCategories=()=>{
    var url="http://172.105.167.182:8081/catalog/subCategories";

    fetch(url)
    .then(res=>res.json())
    .then(data=>{
        let html="";
        data.forEach((subCategory)=>{
            html+=`<option>${subCategory.subCategoryName}</option>`
        })
        document.getElementById("sSubCategory").innerHTML=html;

    }).catch(err=>{
        // console.log(err)
    })

}

const handleImageUpload = event => {
    const files = event.target.files
    const formData = new FormData();
    for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i])
        fetch("http://172.105.167.182:8081/files/upload", {
            method: 'POST',
            headers:{
                "Authorization":'Bearer '+token
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data.uri)
            imageUris.push(data.uri)
        })
        .catch(error => {
            // console.error(error)
        })

    }
   
}

var loadServices=()=>{
    var url="http://172.105.167.182:8081/services/users/all";

    fetch(url).then((res)=> res.json())
    .then((data)=>{
        // console.log(data)
        let html="";
        data.forEach((service)=>{
            
           html+= `<tr>
                <td>${service.name}</td>
                <td>${service.charges}</td>
                <td>${service.provider.firstName}  ${service.provider.secondName}</td>
                <td>${service.provider.phone}</td>
                <td>${service.verified}</td>
                <td nowrap="nowrap">
                             <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mx-5" title="Edit details">\
								<i class="la la-edit"></i>\
							</a>\
							<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
								<i class="la la-trash"></i>\
							</a>\
               </td>
            </tr>`
        })
        document.getElementById("services_table").innerHTML=html;
    })
}

var newService=()=>{
    var url="http://172.105.167.182:8081/services/providers/services"; 

    var charges=$("input[name='sCharge']").val();
    var productDescription=document.getElementById("sDescription").value;
    var name =$("input[name='sName']").val();
    var subCategory=document.getElementById("sSubCategory").value;
    var providerId=$("input[name='sPhone']").val();
    var latitude=document.getElementById("sLatitude").value;
    var longitude=document.getElementById("sLongitude").value;
    var position=[latitude,longitude];

    var token=window.sessionStorage.getItem("token");

    var body=JSON.stringify({charges:charges,description:productDescription,images:imageUris,name:name,subCategory:subCategory,providerId:providerId,position:position})
    // console.log(body);
    // console.log(token)
    fetch(url,{
        method: "POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":'Bearer '+token
        },
        body: body
    })
    .then(res=>{
        if(res.ok){
            swal.fire({
                text: "Service Saved Successfully",
                icon: "success",
                buttonsStyling: true,
                confirmButtonText: "Ok",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light-primary"
                }});
                // console.log(res)
                document.getElementById("uploadService").reset(); 
        }
        else {
            throw new Error("Server error")
        }
    })
    .catch(err=>{
        // console.log(err);
        swal.fire({
            text: "An error occurred",
            icon: "error",
            buttonsStyling: true,
            confirmButtonText: "Ok",
            customClass: {
                confirmButton: "btn font-weight-bold btn-light-primary"
            }});
        //document.getElementById("uploadService").reset(); 
    });

}
