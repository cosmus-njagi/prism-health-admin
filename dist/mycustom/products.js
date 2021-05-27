
$("document").ready(() => {
    loadSubCategories();
    $('#uploadProduct').on('submit', function(e){
        e.preventDefault();
        uploadProduct();
	})
	document.querySelector('#product_images_upload').addEventListener('change', event => {
		handleImageUpload(event);
	})
});
var $add_product = $("#add_product");
let token= window.sessionStorage.getItem("token")
console.log(token)
var imageUris=[];

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
            console.log(data.uri)
            imageUris.push(data.uri)
        })
        .catch(error => {
            console.error(error)
        })

    }
   
}

var loadSubCategories=()=>{
    var url="http://172.105.167.182:8081/catalog/subCategories";

    fetch(url)
    .then(res=>res.json())
    .then(data=>{
        let html="";
        data.forEach((subCategory)=>{
            html+=`<option>${subCategory.subCategoryName}</option>`
        })
        document.getElementById("pSubCategory").innerHTML=html;

    }).catch(err=>{
        console.log(err)
    })

}
var loadProducts=()=>{
    
}

var uploadProduct=()=>{ 
	let url = "http://172.105.167.182:8081/catalog/products"
	var productName = $("input[name='productName']").val();
	var productVariant = $("input[name='productVariant']").val();
	var productQuantity = $("input[name='productQuantity']").val();
	var productPrice = $("input[name='productPrice']").val();
    var productDescription = document.getElementById("productDescriptiom").value;
    var subCategory = document.getElementById("pSubCategory").value;
    var productProvider = $("input[name='productProvider']").val();
    var latitude=document.getElementById("prLat").value;
    var longitude=document.getElementById("prLong").value;
    var position=[latitude,longitude] 
    console.log(imageUris)
    var body= JSON.stringify({productQuantity: productQuantity, productName: productName,
        productPrice: productPrice, productDescription: productDescription, photos: imageUris, subCategory: subCategory,
        productProvider: productProvider, productVariant: productVariant,position:position
    })
         
   
	fetch(url,{
		method:'post',
		headers: {
            'Authorization': 'Bearer ' +token,
			'Content-Type': 'application/json'
		},
		body:body
	})
	.then(res=>{
		if (res.ok) {
          swal.fire({
			text:'product uploaded successfully',
			icon: "success",
			buttonsStyling: false,
			confirmButtonText: "Retry",
			customClass: {
				confirmButton: "btn font-weight-bold btn-light-primary"
			}
		})
			window.location.href="add_products.html"
			}else{
			throw new Error('upload error');
		}
	})
	
	.catch((error) => {
		window.sessionStorage.clear();
		swal.fire({
			text:'Could not upload new product',
			icon: "error",
			buttonsStyling: false,
			confirmButtonText: "Retry",
			customClass: {
				confirmButton: "btn font-weight-bold btn-light-primary"
			}
		})
	});
	
}


