define (
  [
    "dojo/_base/declare",
    "dojo/_base/array"
  ],
  function (declare, arrayUtil)
  {
    var boardClass = declare(
      "icegoer.engine.History",
      null,
      {
        // root node of history tree
        root: null,

        cursor: null,

        constructor: function(args)
        {
          declare.safeMixin(this, args);

          this.cursor = this.root;
        },

        moveTo: function(/* Number */index)
        {
        },

        offset: function(/* Number */delta)
        {
        },

        push: function(item)
        {
        },

        hasVariant: function()
        {
        },

        addVariant: function(item)
        {
        }
      });

    return boardClass;
  }
);
