# Ruby sass compiler for meteor

## Install

Package required `sass` gem.

    $ gem install sass
    # or check http://sass-lang.com/install

For adding package to project edit you `smart.json` file like as example.

    {
      "packages": {
        "jade": {},
        "router": {},
        "ruby-sass": {
          "git": "https://github.com/ovcharik/meteor-ruby-sass"
        }
      }
    }

And run `mrt update`.

## Configuration

Add a `ruby-sass.json` file to root directory of project.


**file** `string`

Path to main file. Required unless specified `files`.


**files** `object`

Format:

    'files': {
      'main file': 'dependencies', // can be pattern, like 'scss/home/**/*.scss'
      // or
      'main file': ['array', 'of', 'dependencies']
    }


**unixNewlines** `boolean`, default: `false`

Use Unix-style newlines in written files.


**scss** `boolean`, default: `false`

Use the CSS-superset SCSS syntax.


**style** `string`, default: `nested`

Output style. Can be `nested`, `compact`, `compressed`, or `expanded`.


**precision** `number`, default: `5`

How many digits of precision to use when outputting decimal numbers.


**compass** `boolean`, default: `false`

Make Compass imports available and load project configuration.


**comments** `boolean`, default: `false`

Emit comments in the generated CSS indicating the corresponding source line.


**import** `string`

Add a sass import path.


**require** `string`

Require a Ruby library before running Sass.


**cacheLocation** `string`

The path to put cached Sass files. Defaults to `.sass-cache`


**noCache** `boolean`, default: `false`

Don't cache to sassc files.


**defaultEncoding** `string`

Specify the default encoding for Sass files.


### Examples

#### Simple

    {
      "file": "path/to/main/sass/file.scss"
    }

#### Files

    {
      "files": {
        "styles/application.scss": ["styles/**/*.scss", "include/variabled.css"],
        "vendor/bootstrap/bootstrap.scss": "vendor/bootstrap/**/*.scss"
      }
    }
