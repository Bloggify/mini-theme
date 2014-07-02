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

// Create the theme object
var Theme = module.exports = {
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
        header: Theme.header
      , footer: Theme.footer
    }
};

// Render Mustache elements
Theme.single.page = Mustache.render(Theme.single.page, DATA_OBJECT);
Theme.single.post = Mustache.render(Theme.single.post, DATA_OBJECT);
