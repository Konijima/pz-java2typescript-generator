declare module Zomboid {
	export namespace zombie.network.packets {
		/** @customConstructor DeadZombiePacket.new */
		export class DeadZombiePacket extends zombie.network.packets.DeadCharacterPacket implements zombie.network.packets.INetworkPacket {
			
		}
	}
}
