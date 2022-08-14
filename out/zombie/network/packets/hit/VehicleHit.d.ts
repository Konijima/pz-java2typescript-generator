declare module Zomboid {
	export namespace zombie.network.packets.hit {
		/** @customConstructor VehicleHit.new */
		export class VehicleHit extends zombie.network.packets.hit.Hit implements zombie.network.packets.hit.IMovable, zombie.network.packets.INetworkPacket {
			
		}
	}
}
