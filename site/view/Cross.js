define (
  function (declare)
  {
    var cross =
    {
      draw: function(context, boardView, coord, size)
      {
        var width = boardView.board.width;
        var height = boardView.board.height;

        if (coord.x === 0)
        {
          if (coord.y === 0)
            this._drawUpperLeftCorner(context, boardView, size);
          else if (coord.y === height - 1)
            this._drawLowerLeftCorner(context, boardView, size);
          else
            this._drawLeftEdge(context, boardView, size);
        }
        else if (coord.x === width - 1)
        {
          if (coord.y === 0)
            this._drawUpperRightCorner(context, boardView, size);
          else if (coord.y === height - 1)
            this._drawLowerRightCorner(context, boardView, size);
          else
            this._drawRightEdge(context, boardView, size);
        }
        else if (coord.y === 0)
          this._drawUpperEdge(context, boardView, size);
        else if (coord.y === height - 1)
          this._drawLowerEdge(context, boardView, size);
        else
          this._draw(context, boardView, size);
      },

      _draw: function(context, board, size)
      {
        context.lineWidth = 1;

        context.beginPath();
        context.moveTo(-size.w/2, 0);
        context.lineTo(size.w/2, 0);
        context.stroke();

        context.beginPath();
        context.moveTo(0, -size.h/2);
        context.lineTo(0, size.h/2);
        context.stroke();
      },

      _drawUpperLeftCorner: function(context, board, size)
      {
        context.lineWidth = board.border;

        context.beginPath();
        context.moveTo(0, 0)
        context.lineTo(size.w/2, 0);
        context.stroke();

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, size.h/2);
        context.stroke();
      },

      _drawUpperRightCorner: function(context, board, size)
      {
        context.lineWidth = board.border;

        context.beginPath();
        context.moveTo(0, 0)
        context.lineTo(-size.w/2, 0);
        context.stroke();

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, size.h/2);
        context.stroke();
      },

      _drawLowerLeftCorner: function(context, board, size)
      {
        context.lineWidth = board.border;

        context.beginPath();
        context.moveTo(0, 0)
        context.lineTo(size.w/2, 0);
        context.stroke();

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, -size.h/2);
        context.stroke();
      },

      _drawLowerRightCorner: function(context, board, size)
      {
        context.lineWidth = board.border;

        context.beginPath();
        context.moveTo(0, 0)
        context.lineTo(-size.w/2, 0);
        context.stroke();

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, -size.h/2);
        context.stroke();
      },

      _drawLeftEdge: function(context, board, size)
      {
        context.lineWidth = board.border;

        context.beginPath();
        context.moveTo(0, -size.h/2);
        context.lineTo(0, size.h/2);
        context.stroke();

        context.lineWidth = 1;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(size.w/2, 0);
        context.stroke();
      },

      _drawRightEdge: function(context, board, size)
      {
        context.lineWidth = board.border;

        context.beginPath();
        context.moveTo(0, -size.h/2);
        context.lineTo(0, size.h/2);
        context.stroke();

        context.lineWidth = 1;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-size.w/2, 0);
        context.stroke();
      },

      _drawUpperEdge: function(context, board, size)
      {
        context.lineWidth = board.border;

        context.beginPath();
        context.moveTo(-size.w/2, 0);
        context.lineTo(size.w/2, 0);
        context.stroke();

        context.lineWidth = 1;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, size.h/2);
        context.stroke();
      },

      _drawLowerEdge: function(context, board, size)
      {
        context.lineWidth = board.border;

        context.beginPath();
        context.moveTo(-size.w/2, 0);
        context.lineTo(size.w/2, 0);
        context.stroke();

        context.lineWidth = 1;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, -size.h/2);
        context.stroke();
      }
    };
    return cross;
  }
);
