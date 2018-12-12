//commom attribute for connections
var common = {
 connector: ["Flowchart", { cornerRadius: 5, hoverPaintStyle: "red", }],
 isSource: true,
 isTarget: true,
 allowLoopback: false,
 connectorOverlays: [
  ["Arrow", { width: 12, length: 10, location: .9 }],
  ["Label", {
   label: "${label}", id: "label", events: {
    click: function (params) {
     var d = prompt("Enter the Label Name");
     params.setLabel(d)
    }
   }
  }]
 ],
};
// object created for storing the elements and its position
var x;
var shapes = {
 type: "",
 id: "",
 position: "",
 left: "",
 top: ""
}
var connectors =
{
 id:"",
 label:"",
 position:"",
 left:"",
 top:"" 
}
// making components draggable to display area
var i = 0;
$(function () {
 $(".draggable").draggable({
  helper: "clone",
 });
// making display area droppable
 $("#droppable").droppable({
  drop: function (event, div) {
   i++;
   x = (div.helper.clone().addClass('value').addClass("resize").attr("id", "id" + i).click(function () { selected(this) }));
   x.appendTo('.display-area');
   jsPlumb.draggable($(".value"),
    {
     containment: "#droppable", handle: ".drag",
     drag: function (event, ui) {
      jsPlumb.repaintEverything();
     },
     
    });
    // switch case to create no. of connection based on the shapes
   var element_type = x[0].attributes.name.value;
   switch (element_type) {
    case "circle":
     jsPlumb.makeSource(x, {
      anchor: "Continuous",
      stub: 50,
      allowLoopback: false,
      handle: ".value",
      maxConnections: 1,
      paintStyle: {
       fill: "transparent",
      },
     }, common)

     break;

    case "rectangle":
     jsPlumb.makeSource(x, {
      allowLoopback: false,
      anchor: "Continuous",
      stub: 50,
      maxConnections: 4,
      paintStyle: { fill: "transparent" },
     }, common)
     break;

    case "square":
     jsPlumb.makeSource(x, {
      allowLoopback: false,
      anchor: "Continuous",
      stub: 50,
      maxConnections: 4,
      paintStyle: { fill: "transparent" },
     }, common)
     break;

    case "diamond":
     jsPlumb.makeSource(x, {
      allowLoopback: false,
      anchor: ["Top", "Left", "Right"],
      stub: 50,
      maxConnections: 3,
      paintStyle: { fill: "transparent" },
     }, common)
     break;

    case "cylinder":
     jsPlumb.makeSource(x, {
      allowLoopback: false,
      anchor: "Continuous",
      stub: 50,
      maxConnections: 4,
      paintStyle: { fill: "transparent" },
     }, common)
     break;

    default:
     jsPlumb.makeSource(x, {
      anchor: "Continuous",
      stub: 50,
      allowLoopback: false,
      paintStyle: { fill: "transparent" },
     }, common)
   }
  }
 },
 );
}
);
// function to delete node
function deletenode(e) {
 jsPlumb.remove(e.parentNode.parentNode.parentNode.parentNode);
}

//binding dbl click function for deleting the connections
jsPlumb.bind('dblclick', function (connection, e)
{
 var retVal = confirm("Do you want to Delete ?");
 if (retVal == true) {
  jsPlumb.deleteConnection(connection);
  return true;
 }
 else {
  
  return false;
 }
});

// binding function to set label after dragging connection
jsPlumb.bind("connection", function (info) {

 var label = prompt("enter the label")
 if (label === null)
 {
  jsPlumb.deleteConnection(info.connection);
 }
 else
 info.connection._jsPlumb.overlays.label.setLabel(label);
 console.log(info.connection)
});

//binding function to avoid self-loop while dragging the shapes

jsPlumb.bind("beforeDrop", function (info) {
 // console.log("before drop: " + info.sourceId + ", " + info.targetId);
 if (info.sourceId === info.targetId) { //source and target ID's are same
  console.log("source and target ID's are the same - self connections not allowed.")
  return false;
 } else {
  return true;
 }
});

// function to edit the shapes name
function edit(e, event) {
 var name = prompt("Enter the name:");
 if (name === null || name=="") {
  return;
 }
 e.parentNode.parentNode.parentNode.childNodes[1].innerHTML = name;

}


var old_target;
function selected(e) {
 $(old_target).find(".box").hide();     //for hidding all non-slected boxes 
 $(e.childNodes[1].childNodes[3]).resizable(       // for resizing the shapes
  {
   minHeight: 50,
   minWidth: 50,
   handles: "se",
   alsoResize: [e, e.childNodes[1]],
   resize: function (event, ui) {
    jsPlumb.repaintEverything();    // function to repaint the resize shapes
    event.stopPropagation();
   }
  });
 if ($(e).find(".box")[0].style.display == "none") {
  $(e).find(".box").show();
 }
 else
  $(e).find(".box").hide();
 old_target = event.target;     //storing last clicked event to hide the last selected box if the new click event is on other shape
}     // check ,hide and show the selected box if clicked on the shape

$(document).on("click", function (event) {
 var old_tar;
 var $trigger = $(".value");
 if ($trigger !== event.target && !$trigger.has(event.target).length) {
  $(".box").hide();
  old_tar = event.target;
 }
});   // function to check and hide the selected box if the mouse click is not over the shape



$('html').keyup(function (e) {
 if (e.keyCode == 46) {
  var c = ($(".display-area").find(".box"));
  if (c[0].style.display == "block") { jsPlumb.remove(c[0].parentNode.parentNode) }
 }
});
// delete function called while pressing delete key
function SaveTheView()
{
 console.log($(".display-area")[0].children)
 var z=$(".display-area")[0].children.length;
 for(i=0;i<z;i++)
 {
  console.log($(".display-area")[0].children[i])
  console.log($(".display-area")[0].children[i].attributes.name.value)
  console.log($(".display-area")[0].children[i].style.position)
  console.log($(".display-area")[0].children[i].style.top)
  console.log($(".display-area")[0].children[i].style.left)
  
  shapes.id=$(".display-area")[0].children[i].id;
  shapes.type=$(".display-area")[0].children[i].attributes.name.value;
  shapes.position=$(".display-area")[0].children[i].style.position;
  shapes.left=$(".display-area")[0].children[i].style.left;
  shapes.top=$(".display-area")[0].children[i].style.top;
 }
 console.log(shapes)
}


// function displayPrompt(e)
// {
//   console.log(e)
//   $(e).find(".box").show;
// console.log(e.parentNode.parentNode.parentNode.parentNode.id)
// var qwert=e.parentNode.parentNode.parentNode.parentNode.id;
// document.getElementById("idquerry").value=e.parentNode.parentNode.parentNode.parentNode.id;
// document.getElementById("promptbox").style.display="block";
// document.getElementById("promptsave").addEventListener("click", function(){
//   var name=document.getElementById("promptinput").value;
//   if (name === null || name=="") {
//     document.getElementById("promptbox").style.display="none";
//     return;
//    }
//   var id= document.getElementById("idquerry").value
//    document.getElementById("promptbox").style.display="none";
//    $(document.getElementById(id)).find(".box").hide();
// var change=document.getElementById(id);
// change.childNodes[1].childNodes[1].innerHTML=name;
//   }
// );
// }

// fucntion to display the custom propmt box 


