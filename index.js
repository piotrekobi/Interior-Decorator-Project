var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], { type: "text/plain" });

    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);
    return textFile;
  };

var download = document.getElementById("download"),
  upload = document.getElementById("upload"),
  textbox = document.getElementById("textbox"),
  input = document.getElementById("input");

download.addEventListener("click", function () {
  var link = document.getElementById("downloadlink");
  link.href = makeTextFile(textbox.value);
  link.click();
});

upload.addEventListener("click", function () {
  input.click();
});

input.addEventListener("change", function () {
  var myFile = this.files[0];
  var reader = new FileReader();

  reader.addEventListener("load", function (e) {
    textbox.value = e.target.result;
  });
  reader.readAsBinaryString(myFile);
});
