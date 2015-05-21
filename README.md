##Aui-gridx overview

Aui gridx(angularUI-gridx) is a powerful grid widget based on AngularJS. It is lightweight, easy-config, fast-rendering & native-tree support. Currently, it provides you with the feature of 
 * sorting
 * pagination
 * tree
 * cell formatter & decorator
 Also, aui-gridx provides u with a **design language** (dlblue) theme.      


How to create a grid using aui-gridx?

* include angularJS
```HTML
<script type='text/javascript' src='lib/angular.js'></script>
```
* include aui-grid JS
```HTML
<script type='text/javascript' src='build.js'></script>
```
If you are using the source code version of the aui-grid, you can find the js file in /release/build.js. 

* include aui-grid CSS
```HTML
<link rel='stylesheet' href='../../src/less/Gridx.css'>
```

If you want to use the dlBlue please add below css file
```HTML
<link rel='stylesheet' href='../../src/less/dlBlue/gridx.css'>
```
In order to make the dlBlue theme working, you will need to add class "dlBlue" in the <body> tag.
```HTML
<body class='dlBlue'>
```

* Creat your own angular app and inject dependency into it.
```js
var app = angular.module('app', ['aui.grid']);
```
After all above steps, you are ready to create your own aui-gridx instance.

* Using aui-ridx directive
<div aui-grid='gridOption'></div>

gridOption here refers to the options feed to the grid instance. You will always need to feed aui-grid directive with data and structure(colum structure)
```JS
window.data = $scope.gridOption.data = [
          {name: "Tiancum", age: 43, id: 'item-3', country: 'US'},
          {name: "Jacob", age: 27, id: 'item-4', country: 'US'},
          {name: "Nephi", age: 29, id: 'item-5', country: 'US'},
          {name: "Enos", age: 34, id: 'item-6', country: 'US'},
          {name: "Enos", age: 34, id: 'item-14', country: 'US'},
     ];

     $scope.gridOption.columnStructs = [
          {id: 'name', field: 'name', name: 'my name', width: '200px',
               formatter: function(cellData, rowData, rowId, columnId, model) {
                    // console.log(arguments);
                    // model._cache._cache.hasChildren(rowId);
                    return cellData;
                    // return cellData + model.hasChildren(rowId)? '+' :;
                    return model.size();
                    return "<p class>" + cellData + ' ' + rowData['age'] + "</p>";
               }
          },
          {id: 'age', field: 'age', name: 'my age', width: '100px',
               formatter: function(cellData, rowData, rowId, columnId, model) {
                    return cellData;
                    return parseInt(cellData) + Math.floor(Math.random() * 100) % 20;
               }
          },
          {id: 'id', field: 'id', name: 'my id', width: '200px'},
          {id: 'country', field: 'country', name: 'my  country', width: '110px', enableSorting: false},
       
     ];
```

6. give grid a width & height.

Please note that grid instance will always need a width and height to be rendering correcly.
```css
.myGrid{
     width: 600px;
     height: 350px;
}
```
How 


