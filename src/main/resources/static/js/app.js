var useMockData = false;
var api = useMockData ? apimock : apiclient;

var app = (function () {
  var _author = "";
  var _blueprints = [];
    var getBluePrintsByAuthor = function(){
        _bluePrints = [];
        $("#idTableBluePrints > tbody").empty(); //elimina todos los nodos secundarios y el contenido de los elementos seleccionados.
        _author = document.getElementById("inputAuthor").value;
        setAuthorBluePrint(_author);
        setBlueprints(_author);
    }
    $(document).ready(function() {
        // ...any other ready logic...
    
        // Delegate click event for dynamic buttons
        $('#idTableBluePrints').on('click', 'button', function() {
            var author = $(this).data('author');
            var blueprintName = $(this).data('blueprintname');
            api.getBluePrintToShow(author, blueprintName);
        });
    });
    var setAuthorBluePrint = function(nameBluePrint){
        $("#idNameBluePrintTitulo").text(nameBluePrint + "´s blueprints:")
    }

    var setBlueprints = function(author){
        api.getBlueprintsByAuthor(author, _getNameAndSize)
    }

    var _getNameAndSize = function(blueprintsArray){
        _blueprints = blueprintsArray.map(blueprint => [blueprint.name, blueprint.points.length]);
        _setTable(_blueprints);
    }
    function addBlueprintToTable(blueprint, index) {
        // Asume que blueprint es un objeto con las propiedades 'author', 'name' y 'points'
        $('#idTableBluePrints tbody').append(
            `<tr>
                <td>${index + 1}</td>
                <td>${blueprint.name}</td>
                <td>${blueprint.points.length}</td>
                <td><button class='btn btn-outline-success' 
                            data-author='${blueprint.author}' 
                            data-blueprintname='${blueprint.name}'>Open</button></td>
            </tr>`
        );
    }

    var _setTable = function(blueprintsArray) {
        // Limpia el cuerpo de la tabla antes de añadir nuevas filas
        $("#idTableBluePrints tbody").empty();
        // Añade cada blueprint a la tabla
        blueprintsArray.forEach((blueprint, index) => {
            addBlueprintToTable(blueprint, index);
        });
        // Actualiza el total de puntos
        var totalPoints = blueprintsArray.reduce((acc, blueprint) => acc + blueprint[1], 0);
        $("#totalPoints").text("Total user points: " + totalPoints);
    };

    var getBluePrintToShow = function(author, blueprintName) {
        setnameBlueprint(blueprintName);
        api.getBlueprintsByNameAndAuthor(author, blueprintName, function(blueprint) {
            _drawInCanvas(blueprint);
        });
    };

    var _drawInCanvas = function(pointsOne){
        var canvas = document.getElementById('idCnavas');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath(); // Inicia una nueva ruta al vaciar la lista de subrutas.
        //Dibujando lineas de acuerdo a lso puntos
        ctx.moveTo(pointsOne.points[0].x, pointsOne.points[0].y); //Arranca desde el primer punto

        for(var i = 1; i < pointsOne.points.length; i++){
            ctx.lineTo(pointsOne.points[i].x, pointsOne.points[i].y);
        }

        //ctx.lineTo(pointsOne.points[0].x, pointsOne.points[0].y);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    var setnameBlueprint = function(nameBluePrint){
        $("#idCurrentBluePrint").text("Current Blueprint: "+ nameBluePrint)
    }

    return{
        getBluePrintsByAuthor:getBluePrintsByAuthor,
        getBluePrintToShow:getBluePrintToShow
    };
})();