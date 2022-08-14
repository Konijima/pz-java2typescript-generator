declare module Zomboid {
	export namespace zombie.inventory.types {
		/** @customConstructor DrainableComboItem.new */
		export class DrainableComboItem extends zombie.inventory.InventoryItem implements zombie.inventory.types.Drainable, zombie.interfaces.IUpdater {
			
		}
	}
}
