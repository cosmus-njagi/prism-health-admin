
$("document").ready(() => {
    loadSubCategories();
    $('#uploadProduct').on('submit', function(e){
        e.preventDefault();
        uploadProduct();
	})
});
var $add_product = $("#add_product");
let token= window.sessionStorage.getItem("token")
console.log(token)
document.querySelector('#product_images_upload').addEventListener('change', event => {
    handleImageUpload(event);
})
var imageUris=[];
const handleImageUpload = event => {
    const files = event.target.files
    const formData = new FormData()
    formData.append('file', files[0])
	
    fetch("http://172.105.167.182:8081/files/upload", {
		method: 'POST',
		body: formData
	})
    .then(response => response.json())
    .then(data => {
		imageUris.push(data.uri)
	})
    .catch(error => {
		console.error(error)
	})
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

var uploadProduct=()=>{ 
	let url = "http://172.105.167.182:8081/catalog/products"
	var productName = $("input[name='productName']").val();
	var productVariant = $("input[name='productVariant']").val();
	var productQuantity = $("input[name='productQuantity']").val();
	var productPrice = $("input[name='productPrice']").val();
    var productDescription = document.getElementById("productDescriptiom").value;
    var subCategory = document.getElementById("pSubCategory").value;
    var productProvider = $("input[name='productProvider']").val();
    console.log(imageUris)
    var boo= JSON.stringify({productQuantity: productQuantity, productName: productName,
        productPrice: productPrice, productDescription: productDescription, photos: imageUris, subCategory: subCategory,
        productProvider: productProvider, productVariant: productVariant
    })
         
    console.log(boo);
	fetch(url,{
		method:'post',
		headers: {
            'Authorization': 'Bearer ' +token,

			'Content-Type': 'application/json'
		},
		body:boo
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


