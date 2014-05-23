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

        _tryCapture: function(board, point, stone)
        {
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
