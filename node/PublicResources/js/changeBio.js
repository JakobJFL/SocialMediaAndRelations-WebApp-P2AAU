const paragraph = document.getElementById("edit");
const edit_button = document.getElementById("edit-button");
const end_button = document.getElementById("end-editing");

edit_button.addEventListener("click", function() {
	paragraph.contentEditable = true;
	paragraph.style.backgroundColor = "#999999";
});

end_button.addEventListener("click", function() {
	paragraph.contentEditable = false;
	paragraph.style.backgroundColor = "white";
});