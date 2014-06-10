define([
  "dojo/_base/declare",
  "require",
  "engine/Point",
  "view/Cross",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/BoardView.html"
], function(declare, require, point, cross, _WidgetBase, _TemplatedMixin, template) {

  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,

    boardWidth: 500,
    boardHeight: 500,
    padding: {left: 5, bottom: 5, right: 5, top: 5},
    border: 3,

    _cellWidth: 0,
    _cellHeight: 0,

    // engine/Board - the model
    board: null,

    // resources
    boardImgUrl: require.toUrl("./resource/board/1.jpg"),
    whiteStoneImgUrl: require.toUrl("./resource/stone/white.jpg"),
    blackStoneImgUrl: require.toUrl("./resource/stone/black.jpg"),

    // attach points
    canvasNode: null,
    boardBkgrdImg: null,
    blackStoneImg: null,
    whiteStoneImg: null,

    _onClick: function(e)
    {
      var x = (e.layerX - this.padding.left - this.border) / this._cellWidth;
      var y = (e.layerY - this.padding.top - this.border) / this._cellHeight;
      var ptClicked = point.fromXY(x, y);

      this.onCrossClicked(ptClicked);
    },

    onCrossClicked: function(ptClicked)
    {
    },

    _drawCrosses: function(context)
    {
      for (var i=0; i<this.board.width; i++)
      {
        for (var j=0; j<this.board.height; j++)
        {
          context.save();
          context.translate(this.padding.left + this.border + i * this._cellWidth,
            this.padding.top + this.border + j * this._cellHeight);
          this._drawCross(context, i, j, this._cellWidth, this._cellHeight);
          context.restore();
        }
      }
    },

    _drawCross: function(context, x, y, width, height)
    {
      cross.draw(context, this,
        {x: x, y: y},
        {w: width, h: height});

      if ((x === 3 && y === 3) || (x === 3 && y === 9) || (x === 3 && y ===15)
      || (x === 9 && y === 3) || (x === 9 && y === 9) || (x === 9 && y === 15)
      || (x === 15 && y === 3) || (x === 15 && y === 9) || (x === 15 && y === 15))
      {
        context.beginPath();
        context.arc(0, 0, this.border, 0, 2*Math.PI);
        context.fill();
      }

      return;
    },

    _drawBackground: function(context)
    {
      context.drawImage(this.boardBkgrdImg, 0, 0, this.boardWidth, this.boardHeight);
    },

    _drawStone: function(context, stone, x, y)
    {
      var stoneImg = null;
      if (stone === 1)
        stoneImg = this.blackStoneImg;
      else if (stone === 2)
        stoneImg = this.whiteStoneImg;

      context.save();

      context.beginPath();
      context.arc(this.padding.left + this.border + x * this._cellWidth,
        this.padding.top + this.border + y * this._cellHeight,
        this._cellWidth / 2, 0, 2 * Math.PI);
      context.clip();

      context.drawImage(stoneImg,
        this.padding.left + this.border + x * this._cellWidth - this._cellWidth / 2,
        this.padding.top + this.border + y * this._cellHeight - this._cellHeight / 2,
        this._cellWidth, this._cellHeight);

      context.restore();
    },

    updateView: function()
    {
      console.debug("BoardView updating");

      // re-calculate cell size
      this._cellWidth = (this.boardWidth - this.padding.left
        - this.padding.right - this.border * 2) / (this.board.width - 1);
      this._cellHeight = (this.boardHeight - this.padding.bottom
        - this.padding.top - this.border * 2) / (this.board.height - 1);

      // Re-draw
      var ctx = this.canvasNode.getContext("2d");
      ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
      this._drawBackground(ctx);
      this._drawCrosses(ctx);

      this.board.forEachStone(this, function(stone, boardKey)
      {
        console.debug("Found stone " + stone + " at " + boardKey);
        var pt = point.fromKey(boardKey);
        this._drawStone(ctx, stone, pt.x, pt.y);
      });
    }
  });
});
