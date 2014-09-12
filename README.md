sliding-menu
============

## Description
Sliding Menu Plugin - Mobile app list-style navigation in the browser.
Inspired on jquery-sliding-menu <https://github.com/alizahid/jquery-sliding-menu>.

[Live Preview](http://github.danielcardoso.net/sliding-menu/)

```
dist/
├── sliding-menu.css
├── sliding-menu.js
├── sliding-menu.min.css
├── sliding-menu.min.js
```

## Installation

##### Standalone:

```html
<link rel="stylesheet" href="dist/sliding-menu.css" />
<script src="dist/sliding-menu.js"></script>
```


## Usage
##### JavaScript
```js
$('#menu').slidingMenu(settings);
```

##### HTML
```html
<div id="menu"></div>
```

## Settings and Defaults

```js
defaults = {
    dataJSON : false,
    initHref : false,
    backLabel: 'Back'
};
```

- `dataJSON` : A JSON object to build the menu from. Check our JSON example;
- `initHref` : The link to the selected panel. Set to false to use the root panel;
- `backLabel` : Label for the back button. Set to true to use the link's own label;


## Contact

If you like this component, share your appreciation by following me in [Twitter](https://twitter.com/DanielCardoso), [GitHub](https://github.com/DanielCardoso) or [Dribbble](http://dribbble.com/DanielCardoso).

## License

The MIT License (MIT)

Copyright (c) 2013-2014 Alexander Petkov

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.