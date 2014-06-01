define (
  [
    "dojo/_base/declare",
    "engine/BaseObject"
  ],
  function (declare, BaseObject)
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

        forEachStone: function(context, callbackFunc)
        {
          for (var i in this._stones)
          {
            callbackFunc.call(context, this._stones[i], i);
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
