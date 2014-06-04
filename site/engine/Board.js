define (
  [
    "dojo/_base/declare",
    "dojo/_base/array",
    "engine/BaseObject",
    "engine/Point",
  ],
  function (declare, arrayUtil, BaseObject, Point)
  {
    var boardClass = declare(
      "icegoer.engine.Board",
      BaseObject,
      {
        width: 19,
        height: 19,

        _stones: null,
        _marks: null,

        constructor: function(args)
        {
          declare.safeMixin(this, args);

          this._stones = {};
          this._marks = {};
        },

        // Test stone placed on given point.
        // 0 - no stone
        // 1 - black stone
        // 2 - white stone
        stoneAt: function(/* Point */point)
        {
          if (this._stones && this._stones[point.boardKey])
          {
            return this._stones[point.boardKey];
          }

          return 0;
        },

        // Call callback function for each stone
        // callbackFunc - function(stone, key)
        // stone:
        //   - no stone: 0|null|undefined
        //   - black stone: 1
        //   - white stone: 2
        forEachStone: function(context, callbackFunc)
        {
          for (var i in this._stones)
          {
            callbackFunc.call(context, this._stones[i], i);
          }
        },

        // Give a set of points, call callback function for each adjacent point
        // callbackFunc - function(stone, key)
        // returns 0|false|null|undefined to continue, true to stop.
        forEachAdjacentPoint: function(context, points, callbackFunc)
        {
          var adjPoints = [];

          arrayUtil.forEach(points, function(item)
          {
            var point = Point.fromKey(item);

            // left
            if (0 <= point.x)
            {
              var leftPoint = Point.fromXY(point.x - 1, point.y);
              if (0 > arrayUtil.indexOf(points, leftPoint.boardKey)
                  && 0 > arrayUtil.indexOf(adjPoints, leftPoint.boardKey))
                adjPoints.push(leftPoint.boardKey);
            }

            // up
            if (0 <= point.y)
            {
              var upPoint = Point.fromXY(point.x, point.y - 1);
              if (0 > arrayUtil.indexOf(points, upPoint.boardKey)
                  && 0 > arrayUtil.indexOf(adjPoints, upPoint.boardKey))
                adjPoints.push(upPoint.boardKey);
            }

            // right
            if (point.x < this.width - 1)
            {
              var rightPoint = Point.fromXY(point.x + 1, point.y);
              if (0 > arrayUtil.indexOf(points, rightPoint.boardKey)
                  && 0 > arrayUtil.indexOf(adjPoints, rightPoint.boardKey))
                adjPoints.push(rightPoint.boardKey);
            }

            // down
            if (point.y < this.height -1)
            {
              var downPoint = Point.fromXY(point.x, point.y + 1);
              if (0 > arrayUtil.indexOf(points, downPoint.boardKey)
                  && 0 > arrayUtil.indexOf(adjPoints, downPoint.boardKey))
                adjPoints.push(downPoint.boardKey);
            }
          });

          for (var i in adjPoints)
          {
            if (callbackFunc.call(context, this._stones[i], adjPoints[i]))
              break;
          }
        },

	// Place a stone on give point.
	// It may fail it force is set to false, due to validation error.
	// In case of succes, it returns true, false otherwise.
	place: function(/* Point */point, /* 0, 1 or 2 */stone, /* Boolean */force)
        {
	  if (force)
	  {
	    this._stones[point.boardKey] = stone;
	    return true;
	  }

	  if (0 !== this.stoneAt(point))
	    return false;

	  if (this.rule)
	  {
	    var testResult = this.rule.testMove(this, point, stone);
            if (testResult.isValid)
	    {
              this._stones[point.boardKey] = stone;
              if (testResult.captured)
              {
		for (var i in testResult.captured)
		  this._stones[testResult.captured[i]] = 0;
              }

              return true;
	    }
            else
              return false;
	  }

	  return this.place(point, stone, true);
	},

	placeBlack: function(/* Point */point, /* Boolean */force)
	{
          return this.place(point, 1, force);
	},

	placeWhite: function(/* Point */point, /* Boolean */force)
	{
          return this.place(point, 2, force);
	},

	placeMark: function(/* Mark */mark, /* Point */point)
	{
          this._marks[point.boardKey] = mark;
	},

	removeStone: function(/* Point */point)
	{
          this._stones[point.boardKey] = 0;
	},

	removeMark: function(/* Point */point)
	{
          this._marks[point.boardKey] = undefined;
	},

	clearBoard: function()
	{
	  this._stones = {};
          this._marks = {};
	}
      }
    );

    return boardClass;
  }
);
