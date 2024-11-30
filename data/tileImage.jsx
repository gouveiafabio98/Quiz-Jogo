#target photoshop
app.bringToFront();

// Define tile size and initialize document
var tileSize = 1024;
var doc = app.activeDocument;

// Calculate number of columns and rows
var numCols = Math.ceil(doc.width / tileSize);
var numRows = Math.ceil(doc.height / tileSize);

for (var row = 0; row < numRows; row++) {
    for (var col = 0; col < numCols; col++) {
        // Calculate the area to crop
        var x = col * tileSize;
        var y = row * tileSize;
        var tileWidth = (x + tileSize > doc.width) ? doc.width - x : tileSize;
        var tileHeight = (y + tileSize > doc.height) ? doc.height - y : tileSize;

        // Select the tile area
        doc.selection.select([
            [x, y],
            [x + tileWidth, y],
            [x + tileWidth, y + tileHeight],
            [x, y + tileHeight]
        ]);

        // Copy the selection and create a new document
        doc.selection.copy();
        var tileDoc = app.documents.add(tileWidth, tileHeight, doc.resolution, "tile_" + col + "_" + row, NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
        tileDoc.paste();

        // Save the tile
        var filePath = new File("~/Desktop/tiles/tile_" + col + "_" + row + ".png");
        var opts = new PNGSaveOptions();
        opts.compression = 9;
        tileDoc.saveAs(filePath, opts, true);
        tileDoc.close(SaveOptions.DONOTSAVECHANGES);
    }
}

// Deselect the selection
doc.selection.deselect();
