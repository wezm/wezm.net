
// Mojo - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

;(function(){
  Mojo = {
    
    // --- Version
    
    version: '0.3.0',
    
   /**
    * Escape HTML.
    *
    * @param  {string} html
    * @return {string}
    * @api public
    */
   
    escape : function(html) {
      if (!html) return
      return html.toString()
        .replace(/&/gmi, '&amp;')
        .replace(/"/gmi, '&quot;')
        .replace(/>/gmi, '&gt;')
        .replace(/</gmi, '&lt;')
    },

    /**
     * Normalize _object_ for output.
     *
     * @param  {object}object
     * @return {mixed}
     * @api public
     */

    normalize: function(object, property) {
      if(property === undefined)
        return typeof object == 'function' ? object() : object
      else
        return typeof object[property] == 'function' ? object[property]() : object[property]
    },

    /**
     * Enumerate _object_'s _prop_, buffering _fn_'s
     * return value.
     *
     * @param  {object} object
     * @param  {object} prop
     * @return {string}
     * @api private
     */
    
    enumerate: function(object, prop, fn) {
      if (!prop) return ''
      if (!(prop instanceof Array)) return fn(object)
      for (var buf = [], i = 0, len = prop.length; i < len; ++i)
        buf.push(fn(prop[i]))
      return buf.join(' ')
    }
  }
})()