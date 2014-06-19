define (
  [
    "dojo/_base/declare",
    "dojo/_base/array"
  ],
  function (declare, arrayUtil)
  {
    var historyClass = declare(
      "icegoer.engine.History",
      null,
      {
        // root node of history tree
        root: null,

        cursor: null,
        last: null,

        constructor: function(args)
        {
          declare.safeMixin(this, args);

          this.cursor = this.root;
          this.last = this.root;
          while (this.last && this.last.next)
          {
            this.last = this.last.next;
          }
        },

        forward: function(/* Number */delta)
        {
          for (var i=0; i<delta; i++)
          {
            if (this.cursor && this.cursor.next)
              this.cursor = this.cursor.next;
            else
              break;
          }

          if (this.cursor)
            return this.cursor.item;
        },

        back: function(/* Number */delta)
        {
          for (var i=0; i<delta; i++)
          {
            if (this.cursor && this.cursor.prev)
              this.cursor = this.cursor.prev;
            else
              break;
          }

          if (this.cursor)
            return this.cursor.item;
        },

        push: function(item)
        {
          var node = {item: item};
          this.last.next = node;
          node.prev = this.last;
          this.last = node;
        },

        hasVariant: function()
        {
        },

        addVariant: function(item)
        {
        }
      });

    return historyClass;
  }
);
