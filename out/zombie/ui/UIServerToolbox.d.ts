declare module Zomboid {
	export namespace zombie.ui {
		/** @customConstructor UIServerToolbox.new */
		export class UIServerToolbox extends zombie.ui.NewWindow implements zombie.network.ICoopServerMessageListener, zombie.ui.UIEventHandler {
			
		}
	}
}
