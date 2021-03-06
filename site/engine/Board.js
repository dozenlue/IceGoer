define (
  [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "engine/BaseObject",
    "engine/Point",
  ],
  function (declare, lang, arrayUtil, BaseObject, Point)
  {
    var boardClass = declare(
      "icegoer.engine.Board",
      BaseObject,
      {
        width: 19,
        height: 19,

        _stones: null,
        _marks: null,

        // An array of this._stones
        _history: null,

        constructor: function(args)
        {
          declare.safeMixin(this, args);

          this._stones = {};
          this._marks = {};
          this._history = [];
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
            if (this._stones[i])
              callbackFunc.call(context, this._stones[i], i);
          }
        },

        // If there is a stone placed on given point, return an array that
        // contains all adjacent stones' board key.
        // If there is no stone placed on given point, return an empty array
        groupAt: function(/* Point */point)
        {
          var group = [];
          var stone = this._stones[point. boardKey];
          if (stone)
          {
            var found = [point.boardKey];
            var newFound = [];

            while (found.length > 0)
            {
              group = group.concat(found);

              this.forEachAdjacentPoint(this, found, function(foundStone, key)
              {
                if (foundStone === stone
                    && 0 > group.indexOf(key)
                    && 0 > found.indexOf(key)
                    && 0 > newFound.indexOf(key))
                {
                  newFound.push(key);
                }
              });

              found = newFound;
              newFound = [];
            }
          }

          return group;
        },

        hasLive: function(/* Point */point)
        {
          var result = false;
          var stone = this._stones[point.boardKey];
          if (stone)
          {
            var tested = [];
            var newFound = [point.boardKey];

            while(!result && newFound.length > 0)
            {
              arrayUtil.forEach(newFound, function(item, index)
              {
                if (0 > arrayUtil.indexOf(tested, item))
                {
                  tested.push(item);
                }
              });

              newFound = [];

              this.forEachAdjacentPoint(this, tested, function(foundStone, key)
              {
                if (!foundStone)
                {
                  // has live, break
                  result = true;
                  return true;
                }

                if (foundStone === stone
                    && 0 > tested.indexOf(key)
                    && 0 > newFound.indexOf(key))
                {
                  newFound.push(key);
                }
              });
            }
          }

          return result;
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
          }, this);

          for (var i in adjPoints)
          {
            var key = adjPoints[i];
            if (callbackFunc.call(context, this._stones[key], key))
              break;
          }
        },

        // on success, return stone map for placed result
        // on fail, return null
        // this function doesn't change current this._stones
        tryPlace: function(/* Point */point, /* 1 or 2 */stone)
        {
          // Test if there is already a stone
          if (this.stoneAt(point))
          {
            return null;
          }

          var canCapture = false;
          var newStones = lang.clone(this._stones);
          var savedStones = this._stones;
          this._stones = newStones;
          this.place(point, stone, true);

          // Test if this move can capture opponent's stone
          var toTest = [point.boardKey];
          this.forEachAdjacentPoint(this, toTest, function(stoneFound, pointFound)
          {
            if (stoneFound && stoneFound != stone)
            {
              if (!this.hasLive(Point.fromKey(pointFound)))
              {
                canCapture = true;
                var captured = this.groupAt(Point.fromKey(pointFound));
                this.removeStones(captured);
              }
            }
          });

          if (canCapture)
          {
            this._stones = savedStones;
            return newStones;
          }

          // Test if this move doesn't suicide (captured self)
          var valid = this.hasLive(point);

          this._stones = savedStones;
          if (valid)
          {
            return newStones;
          }
          else
          {
            return null;
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

          var newStones = this.tryPlace(point, stone);
          if (!newStones)
            return false;

          this._history.push(this._stones);
          this._stones = newStones;

          return true;
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

        removeStones: function(/* Array of Board Keys */points)
        {
          if (points)
          {
            for (var i in points)
            {
              this._stones[points[i]] = 0;
            }
          }
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
