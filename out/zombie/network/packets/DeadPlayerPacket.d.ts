declare module Zomboid {
	export namespace zombie.network.packets {
		/** @customConstructor DeadPlayerPacket.new */
		export class DeadPlayerPacket extends zombie.network.packets.DeadCharacterPacket implements zombie.network.packets.INetworkPacket {
			
		}
	}
}
