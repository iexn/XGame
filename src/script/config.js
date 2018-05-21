require.config({
  paths: {
    "Frames": "module/Frames",
    "jquery": "https://cdn.bootcss.com/jquery/3.3.1/jquery",
    "underscore": "https://cdn.bootcss.com/underscore.js/1.9.0/underscore",
    "jquery_form": "https://cdn.bootcss.com/jquery.form/4.2.2/jquery.form"
  },
  shim: {
    "jquery_form": ["jquery"]
  }
})
