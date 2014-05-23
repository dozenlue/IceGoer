define (
  [
    "dojo/_base/declare"
  ],
  function (declare)
  {
    var baseObjClass = declare(
      "icegoer.engine.BaseObject",
      null,
      {
        name: "",

        constructor: function(args)
        {
          declare.safeMixin(this, args);
        },

        getName: function()
        {
          return this.name;
        },

	      clone: function()
	      {
	        // Absract function should not be called
	        return null;
	      }
      }
    );

    return baseObjClass;
  }
);
