declare module Zomboid {
	export namespace zombie.core.Collections {
		/** @customConstructor NonBlockingHashMap.new */
		export class NonBlockingHashMap extends java.util.AbstractMap<TypeK, TypeV> implements java.util.concurrent.ConcurrentMap<TypeK, TypeV>, java.lang.Cloneable, java.io.Serializable {
			
		}
	}
}
