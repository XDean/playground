document.addEventListener('DOMContentLoaded', function () {
  let area = document.getElementById("code-area");
  let cmArea = CodeMirror.fromTextArea(area, {
    lineNumbers: true,
  });
}, false);