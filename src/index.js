$(function () {
  var map;
  var csvstring;
  var pointarray;
  var heatmap;

  $(window).on("load", function () {
    map = new google.maps.Map($("#map").get(0), {
      zoom: 5,
      center: new google.maps.LatLng(37.0963619, 139.8100293),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoomControl: true
    });
  });

  $("#add-btn").on("click", function () {
    var csvstring = "";
    $("#file-list").empty();
    $("#import-btn").attr("disabled", true);
    $("#modal").show();
  });

  $("#modal").on("click", function () {
    $("#modal").hide();
  });

  $("#modal .modal-content").on("click", function () {
    return false;
  });

  $("#import-btn").on("click", function () {
    var jsonArray = csv2json(csvstring);
    var latlngs = [];
    for (var i = 0; i < jsonArray.length - 1; i++) {
      latlngs.push(new google.maps.LatLng(jsonArray[i].lat, jsonArray[i].lng));
    }
    var pointArray = new google.maps.MVCArray(latlngs);
    if (heatmap) {
      heatmap.setMap(null);
    }
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: pointArray
    });
    heatmap.setMap(map);
    $("#modal").hide();
  });

  $("#drop-zone").on("dragover", function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.originalEvent.dataTransfer.dropEffect = "copy";
  });

  $("#drop-zone").on("drop", function (e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.originalEvent.dataTransfer.files[0];

    if (!file.type.match("csv")) {
      alert("Please drop the CSV file.");
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      csvstring = e.target.result;
      $("#import-btn").attr("disabled", false);
    };
    reader.readAsText(file, "Shift_JIS");
    var list = "<li>" +
                  "<strong>" + escape(file.name) + "</strong>" +
                  " (" + file.type + ")" +
                  " - " + file.size + " bytes," +
                  " last modified: " + file.lastModifiedDate.toLocaleDateString() +
                "</li>";
    $("#file-list").append(list);
  });

  function csv2json(csvString){
    var csvArray = csvString.split('\n');
    var jsonArray = [];

    var items = csvArray[0].split(',');
    for (var i = 1; i < csvArray.length; i++) {
      var item = {};
      var csvArrayD = csvArray[i].split(',');
      for (var j = 0; j < items.length; j++) {
        item[items[j]] = csvArrayD[j];
      }
      jsonArray.push(item);
    }
    return jsonArray;
  }

});