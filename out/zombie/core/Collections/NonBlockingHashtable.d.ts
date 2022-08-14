declare module Zomboid {
	export namespace zombie.core.Collections {
		/** @customConstructor NonBlockingHashtable.new */
		export class NonBlockingHashtable extends java.util.Dictionary<TypeK, TypeV> implements java.util.concurrent.ConcurrentMap<TypeK, TypeV>, java.lang.Cloneable, java.io.Serializable {
			
		}
	}
}
