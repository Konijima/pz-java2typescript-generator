declare module Zomboid {
	export namespace zombie.vehicles {
		/** @customConstructor BaseVehicle.new */
		export class BaseVehicle extends zombie.iso.IsoMovingObject implements zombie.iso.objects.interfaces.Thumpable, fmod.fmod.IFMODParameterUpdater {
			
		}
	}
}
