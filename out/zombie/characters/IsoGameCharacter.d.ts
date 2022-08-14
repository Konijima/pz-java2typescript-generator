declare module Zomboid {
	export namespace zombie.characters {
		export abstract class IsoGameCharacter extends zombie.iso.IsoMovingObject implements zombie.characters.Talker, zombie.chat.ChatElementOwner, zombie.core.skinnedmodel.advancedanimation.IAnimatable, zombie.core.skinnedmodel.advancedanimation.IAnimationVariableMap, zombie.core.skinnedmodel.population.IClothingItemListener, zombie.characters.action.IActionStateChanged, zombie.core.skinnedmodel.advancedanimation.IAnimEventCallback, fmod.fmod.IFMODParameterUpdater, zombie.characters.ILuaVariableSource, zombie.characters.ILuaGameCharacter {
			
		}
	}
}
