# React Style Modules — WIP

**React Style Modules is a prototyped demonstration and *work-in-progress* library for resolving an element's style within a React component.**

## Motivation

### Why not stylesheets?

I believe the flow of using Cascading Stylesheets in a web application is convulted. We often use CSS to produce singular classes (e.g. the BEM convention) in order to remove some of the guess-work. But it's still there. React Style Modules aims to eliminate the guess-work, and put you in charge of the resolution of the computed style of that element.

### The [style] attribute
React Style Modules uses the style attribute as the end point of style resolution. This keeps each element on an even playing field, allowing things like application state to eventually affect it. This could be done manually, but RSM focuses keeps the separation that CSS has given us, so it's a lot more readable and reusable.

## *Warnings*

+ I've exposed two functions in `createStyleModule.js` onto the `window` object — sorry!
+ The code is currently terrible — this is WIP

## 1. Setup

You need to create your style modules (i.e. styled-up React components). Call `createStyleModule` to return a new function, (which would then return a new component instance when called, see Step 2). It's single parameter is an setup object, which take the following:

+ Style properties (immediately parsed into the style property on a React component)
+ `children` as an object, with each key as the sub-module name, and the value as another setup object.

So objects can be infinitely nested, allowing a BEM-like construct.

	var spacing = 40;
	var Grid = createStyleModule({
		child: {
			Item: {
				marginLeft: -spacing,
				marginTop: -spacing,
				children: {
					Item: uses(InlineBlock, {
						paddingLeft: spacing,
						paddingTop: spacing
					})
				}
			}
		}
	});

### Module inheritance

Call the `uses` function, where the first argument is the component to inherit from, and the second argument is a setup object that will be merged into the inherited setup.

### Node definition

You can predefined what node types you want your components to use, with the 'node' attribute in your setup object. So {node: 'ul'} would call React.DOM.ul. 

## 2. Calling

Once you have a style module assigned to a variable, you can call it. Calling it is similar to instaniating a React component, with a few niceties:

+ You don't *have* to pass props as the first argument, so you can cleanly nest style modules
+ You can pass strings as the only parameter, and that will passed to `props.children`
+ If you have multiple children, call them inside of an array. (This is more of a caveat than a nicety!!)

Any sub-modules that you defined in Step 1 are now available under the modules namespace, e.g. `Grid.Inner()` and `Grid.Inner.Item()`

## Example

See `index.html` plz :)

## TODO

+ **LOTS OF IDEAS**
+ Inherit from multiple style modules
+ Support for custom components using the node attribute?? (Maybe)
+ Binded values, so style modules can act like interfaces (e.g. "this `left` property should always be whatever the `paddingBottom` of this other property is")
+ Strongly typed values, to handle things such as percentages (to allow calculations, but also ensure consistent output)
+ Add the ability to restrict the composition of a module? e.g. "This sub-module *must* be implemented, as it is required by this other thing"
+ Get rid of the nasty `children` and `child` and either compute from a reserved list of style values, or check for a capital??
