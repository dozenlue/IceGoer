define
(
  [
    "dojo/_base/declare",
    "engine/Point"
  ],
  function (declare, Point)
  {
    var ruleClass = declare(
      "icegoer.engine.Rule",
      null,
      {
        // Return:
        // {
        //   isValid: true|false,
        //   captured: array of key
        // }
        testMove: function(/* Board */board, /* Point */point, /* 1|2 */stone)
        {
          var captured = [];

          if (point.x > 0)
          {
            var ptLeft = Point.fromXY(point.x - 1, point.y);
            var stoneLeft = board.stoneAt(ptLeft);

            if (stoneLeft && stone !== stoneLeft)
            {
              var capturedLeft = this._tryCapture(board, ptLeft);
              if (capturedLeft && capturedLeft.length > 0)
              {
                this._mergeCaptured(captured, capturedLeft);
              }
            }
          }
        },

        _tryCapture: function(board, point, stonePlaced, stoneToCapture)
        {
          var captured = [];
          board.forEachAdjacentPoint(this, point, function(point, stone)
          {
            if (stone === stoneToCapture)
            {
              
            }
	  });
        },

        _checkLife: function(board, pointToCheck, stoneToCheck, checked)
        {
          if (0 >= checked.indexOf(pointToCheck.boardKey))
            return false;

          var hasLife = false;
          board.forEachAdjacentPoint(this, pointToCheck, function(point, stone)
          {
            if (!stone)
            {
              hasLife = true;
              return false;
            }

            if (stone === stoneToCheck)
            {
              checked.push(point);
              hasLife = this._checkLife(this, point, stone, checked);

              if (hasLife)
                return false; // no need to continue check
            }
            else
            {
              return false;
            }
	  });

          return hasLife;
        },

        _mergeCaptured: function(captured, newCaptured)
        {
          for (var i in newCaptured)
          {
            var x = newCaptured[i];
            if (0 <= captured.indexOf(x))
              captured.push(x);
          }
        }
      }
    );
  }
);
