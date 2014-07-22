# Ruby sass compiler

## Install

Package required `sass` gem.

    $ gem install sass

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

Add a `ruby-sass.json` file to root directory of project:

### Input

Path to main file 

### Example

    {
      "input": "path/to/main/sass/file"
    }
