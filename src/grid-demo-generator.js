var Extendable = require('lazy-extendable');
var GridBuilder = require('./grid-builder');

var GridDemoGenerator = Extendable.create(function () {
    return {

        constructor: function (options) {
            this.__options = options;
            this.__columns = [];
            this.__descriptor = new GridBuilder(this.__options.containerColumnsCount);
            this.__gridColumnsCount = this.__options.gridColumnsCount;
            this.__gutterWidth = this.__options.gutterWidth;
            this.__createContainer();
            this.__createColumnTemplate();
            this.__updateGrid();
        },

        __createContainer: function () {
            this.__container = document.createElement("div");
            this.__container.className = this.__options.containerClass;
            this.__containerPlaceholder = document.createElement("div");
        },

        __createColumnTemplate: function () {
            this.__columnTemplate = document.createElement("div");
            this.__columnTemplate.className = this.__options.columnClass;
        },

        __createColumn: function () {
            return this.__columnTemplate.cloneNode(false);
        },

        getGrid: function () {
            return this.__grid;
        },

        getContainer: function () {
            return this.__container;
        },

        setColumnsCount: function (count) {
            count = parseInt(count, 10);
            if (isNaN(count))
                return;
            this.__gridColumnsCount = count;
            this.__updateGrid();
        },

        setGutterWidth: function (width) {
            width = parseInt(width, 10);
            if (isNaN(width))
                return;
            this.__gutterWidth = width;
            this.__updateGrid();
        },

        __updateGrid: function () {
            try {
                this.__grid = this.__descriptor.getGrid(this.__gridColumnsCount, this.__gutterWidth);
                this.__updateGridView();
            }
            catch (e) {
            }
        },

        __updateGridView: function () {
            this.__detachContainer();
            this.__container.style.marginRight = 100 - this.__grid.getContainerWidth() + "%";
            var generatedCount = this.__columns.length;
            for (var i = 0, l = Math.max(this.__gridColumnsCount, generatedCount); i < l; i++) {
                if (i >= generatedCount) {
                    this.__columns[i] = this.__createColumn();
                    this.__container.appendChild(this.__columns[i]);
                }
                if (i < this.__gridColumnsCount) {
                    this.__columns[i].style.display = "";
                    this.__setColumnStyle(this.__columns[i], i + 1);
                }
                else
                    this.__columns[i].style.display = "none";
            }
            this.__attachContainer();
        },

        __detachContainer: function () {
            this.__switchNodes(this.__container, this.__containerPlaceholder);
        },

        __attachContainer: function () {
            this.__switchNodes(this.__containerPlaceholder, this.__container);
        },

        __switchNodes: function (removingNode, addingNode) {
            if (!removingNode.parentNode)
                return;
            removingNode.parentNode.insertBefore(addingNode, removingNode);
            removingNode.parentNode.removeChild(removingNode);
        },

        __setColumnStyle: function (column, offset) {
            var moduleWidth = this.__grid.getModuleWidth(1);
            column.style.left = this.__grid.getModuleOffset(offset) + "%";
            column.style.marginRight = moduleWidth * -1 + "%";
            column.style.width = moduleWidth + "%";
            this.__toggleColumnAlternativeClass(column, offset);
        },

        __toggleColumnAlternativeClass: function (column, offset) {
            var alternativeClass = this.__options.alternativeColumnClass;
            if (this.__gutterWidth < 2 && offset % 2 === 0) {
                if (column.className.indexOf(alternativeClass) === -1)
                    column.className += " " + alternativeClass;
            }
            else
                column.className = column.className.replace(alternativeClass, "");
        }

    };
});

module.exports = GridDemoGenerator;
