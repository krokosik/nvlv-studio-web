/// <reference types="d3-force" />

declare module 'd3-force-surface' {
	// Define a type for a coordinate object
	interface Coordinate {
		x: number
		y: number
	}

	// Define types for the various functions used in the API
	type RadiusFunction = (node: any) => number
	type FromFunction = (surface: any) => Coordinate
	type ToFunction = (surface: any) => Coordinate
	type OneWayFunction = (surface: any) => boolean
	type OnImpactFunction = (node: any, surface: any) => void

	interface API<
		NodeDatum extends SimulationNodeDatum,
		LinkDatum extends SimulationLinkDatum<NodeDatum> | undefined,
	> extends Force<NodeDatum, LinkDatum> {
		/**
		 * Getter/setter for the list of surface lines
		 * @param array Optional array of surface lines
		 */
		surfaces(array?: any[]): API

		/**
		 * Getter/setter for every collision's coefficient of restitution (elasticity).
		 * A value of `1` represents a purely elastic collision with no energy loss,
		 * while a `0` will fully eliminate the bounce in the collision direction.
		 * Values `>1` can be used to introduce acceleration at each collision.
		 * Values `<0` are not recommended.
		 * @param number Optional number representing the elasticity
		 */
		elasticity(number?: number): API

		/**
		 * Getter/setter for the node object radius accessor function or a constant for all nodes.
		 * @param numOrFn Optional number or function to set the radius
		 */
		radius(numOrFn?: number | RadiusFunction): API

		/**
		 * Getter/setter for the surface object starting point accessor function.
		 * It should return a two coordinate object: `{x,y}`
		 * @param fn Optional function to set the starting point
		 */
		from(fn?: FromFunction): API

		/**
		 * Getter/setter for the surface object ending point accessor function.
		 * It should return a two coordinate object: `{x,y}`
		 * @param fn Optional function to set the ending point
		 */
		to(fn?: ToFunction): API

		/**
		 * Getter/setter for the surface object "one-way" flag accessor function
		 * or a constant for all surfaces. This flag indicates whether collisions
		 * of nodes against the surface should occur in both directions of movement
		 * or only in one (when the node is moving in a N>S orientation according
		 * to the W>E line axis), effectively ignoring collisions in the other direction.
		 * @param boolOrFn Optional boolean or function to set the one-way flag
		 */
		oneWay(boolOrFn?: boolean | OneWayFunction): API

		/**
		 * Callback function triggered at every collision, with the signature `onImpact(node, surface)`
		 * @param fn Optional function to set the onImpact callback
		 */
		onImpact(fn?: OnImpactFunction): API
	}

	const d3ForceSurface: () => API
	export default d3ForceSurface
}

declare module 'd3-force-bounce' {
	// Define a type for a coordinate object
	interface Coordinate {
		x: number
		y: number
	}

	// Define types for the various functions used in the API
	type RadiusFunction = (node: any) => number
	type MassFunction = (node: any) => number
	type OnImpactFunction = (node1: any, node2: any) => void

	interface API<
		NodeDatum extends SimulationNodeDatum,
		LinkDatum extends SimulationLinkDatum<NodeDatum> | undefined,
	> extends Force<NodeDatum, LinkDatum> {
		/**
		 * Getter/setter for every collision's coefficient of restitution (elasticity).
		 * A value of `1` represents a purely elastic collision with no energy loss,
		 * while a `0` will fully eliminate the bounce in the collision direction.
		 * Values `>1` can be used to introduce acceleration at each collision.
		 * Values `<0` are not recommended.
		 * @param number Optional number representing the elasticity
		 */
		elasticity(number?: number): API

		/**
		 * Getter/setter for the node object radius accessor function or a constant for all nodes.
		 * @param numOrFn Optional number or function to set the radius
		 */
		radius(numOrFn?: number | RadiusFunction): API

		/**
		 * Getter/setter for the node object mass accessor function or a constant for all nodes.
		 * Mass affects the symmetry of the energy transfer between two colliding nodes.
		 * By default, it is proportional to the node's area.
		 * @param numOrFn Optional number or function to set the mass
		 */
		mass(numOrFn?: number | MassFunction): API

		/**
		 * Callback function triggered at every collision, with the signature `onImpact(node1, node2)`
		 * @param fn Optional function to set the onImpact callback
		 */
		onImpact(fn?: OnImpactFunction): API
	}

	const d3ForceBounce: () => API
	export default d3ForceBounce
}
