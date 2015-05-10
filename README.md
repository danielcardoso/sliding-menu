Sliding Menu
============

## Description
Sliding Menu Plugin - Mobile app list-style navigation in the browser.
**Inspired on jquery-sliding-menu (by Alizahid).**

[Live Preview](http://github.danielcardoso.net/sliding-menu/)

```
dist/
├── css
├──── sliding-menu.css
├──── sliding-menu.min.css
├── js
├──── sliding-menu.js
├──── sliding-menu.min.js
```


## Installation

##### Standalone:

```html
<link rel="stylesheet" href="dist/css/sliding-menu-min.css" />
<script src="dist/js/sliding-menu.min.js"></script>
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
    className : "",
    transitionDuration : 250,
    dataJSON : false,
    initHref : false,
    backLabel: 'Back'
};
```

- `className` : Adicional class for menu element. (String)
- `transitionDuration` : Default slide animation speed. (Number)
- `dataJSON` :A JSON object to build the menu from. Check our JSON example. (Boolean)
- `initHref` : The link to the selected panel. Set to false (boolean) to use the root panel. (String)
- `backLabel` : Label for the back button. Set to `true` (boolean) to use the link's own label. (String)


## Contact

If you like this component, share your appreciation by following me in [Twitter](https://twitter.com/DanielCardoso), [GitHub](https://github.com/DanielCardoso) or [Dribbble](http://dribbble.com/DanielCardoso).


## License

The MIT License (MIT)

Copyright (c) 2014-2015 Daniel Cardoso

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
