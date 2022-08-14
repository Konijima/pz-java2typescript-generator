declare module Zomboid {
	export namespace zombie.inventory.types {
		/** @customConstructor Radio.new */
		export class Radio extends zombie.inventory.types.Moveable implements zombie.characters.Talker, zombie.interfaces.IUpdater, zombie.radio.devices.WaveSignalDevice {
			
		}
	}
}
