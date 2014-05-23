define (
  [
    "dojo/_base/declare"
  ],
  function (declare)
  {
    var pointClass = declare(
      "icegoer.engine.Point",
      null,
      {
        x: 0,
        y: 0,
        boardKey: ""
      }
    );

    return {
      fromXY: function(x, y)
      {
        var point = new pointClass();
        point.x = x;
        point.y = y;

        // e.g. {x: 4, y: 0} converts to "ea"
        point.boardKey = String.fromCharCode(97+x) + String.fromCharCode(97+y);
	return point;
      },

      fromKey: function(key)
      {
        var point = new pointClass();
        point.boardKey = key;

        // e.g. "ea" converts to {x: 4, y: 0}
        point.x = key.charCodeAt(0) - 97;
        point.y = key.charCodeAt(1) - 97;
        return point;
      }
    };
  }
);
