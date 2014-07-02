// Dependencies
// https://github.com/janl/mustache.js/issues/383
//var Mustache = require("mustache");

var Mustache = {
    render: function (source, data) {
        var results = []
          , re = /{{{([^}}}]+)}}}/g
          , str = null
          , text = source
          ;

        while(str = re.exec(text)) {
            results.push(str[1]);
        }

        for (var i = 0; i < results.length; ++i) {

            var cField = results[i]
              , value = Utils.findValue(data, cField)
              ;

            if (!value) {
                continue;
            }

            text = text.replace(
                new RegExp("{{{" + cField + "}}}", "g")
              , value
            );
        }

        return text;
    }
};


function readAndRenderSync (path) {
    return Mustache.render(
        Utils.readFileSync(path)
      , { config: Config }
    );
}

// Create the template object
var Template = module.exports = {
    header: readAndRenderSync(__dirname + "/header.html")
  , footer: readAndRenderSync(__dirname + "/footer.html")
  , single: {
        page: readAndRenderSync(__dirname + "/single-page.html")
      , post: readAndRenderSync(__dirname + "/single-post.html")
    }
  , blocks: {
        post: readAndRenderSync(__dirname + "/blocks/post.html")
      , page: readAndRenderSync(__dirname + "/blocks/page.html")
      , postEnd: readAndRenderSync(__dirname + "/blocks/post-end.html")
    }
};

const DATA_OBJECT = {
    config: Config
  , blocks: {
        header: Template.header
      , footer: Template.footer
    }
};

// Render Mustache elements
Template.single.page = Mustache.render(Template.single.page, DATA_OBJECT);
Template.single.post = Mustache.render(Template.single.post, DATA_OBJECT);
