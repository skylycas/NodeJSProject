function doImagePreview(event) {
    var image = URL.createObjectURL(event.target.file[0]);
    var imagediv = document.getElementById('preview');
    var newimage = document.createElement('img');
    newimage.src = image;
    imagediv.appendChild(newimage);
};



function getDate()
{
    document.getElementById('dateFrom').value = new Date().toISOString().substring(0, 10);
}