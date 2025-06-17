There's some inconsistencies with cards that are going to change in a single big PR.
The purpose of the change is to standardize some APIs. This means that if you have
custom code on top of these APIs, you **must** update your cards to match.

The main issues are:

1. ¾ Inconsistent field orders.

`ICard` and `ICorporationCard` have several callbacks that have parameters representing
two different players. In these cases, one is the active player, and one is the card
owner. Of course, most of the time they are the same person. But, their order is
inconsistent.

Callbacks with the order card owner, active player:
* onCardPlayedFromAnyPlayer
* onTilePlaced

Callbacks with the order active player, card owner:
* onIncreaseTerraformRating
* onIdentification
* onColonyAdded
* ICorporationCard.onCorpCardPlayed

For consistency, the first player parameter wlil always be the card owner. That means the four methods listed will be reordered.

To do this, all four methods will get replaced with new names. The old ones will be typed
with `never` to allow you to catch compiler errors for your custom cards.

✅ onIncreaseTerraformRatingByAnyPlayer
✅ onIdentificationByAnyPlayer
✅ onColonyAddedByAnyPlayer
❌ onCorpCardPlayed2.

These are not good names. After 6 months, the old names will be taken back, and these will deprecated. They will still work, but will eventually be removed.

✅ 2. onCardPlayedFromAnyPlayer is in an awkward order.
   onCardPlayedFromAnyPlayer has parameters in this order: (card owner, active player, card).
   Every call to onCardPlayedFromAnyPlayer actually ignores card owner. So this will be
   reordered to (card owner, card, active player.) Which is a little inconsistent, but OK.

   To prevent issues for migration, onCardPlayedFromAnyPlayer will also be renamed to
   onCardPlayedByAnyPlayer, and onCardPlayedFromAnyPlayer will get the type `never`.
   This will give you compiler errors.

3. onCardPlayed has special behavior just for corporations

onCardPlayed has one behavior for corporations and one for all other card types. That is,
when the active player plays a card, all that players project cards get called with `onCardPlayed`. For corporations, the active player plays a project card, and _all_
players' corporations with `onCardPlayed` is called.

To allieve that, `onCardPlayed` will tagged with `never` for `ICorporationCard`
and corporations will be able to use either `onCardPlayedByEveryPlayer` or
a customer method for corporations called `onCardPlayedForCorps`.

4. onCorpCardPlayed is too special

This should really just be onCardPlayedByAnyPlayer, with the exception that

5. Corporations are played but project cards don't have their effects when the corp gets played.

When corporations are played, `onCardPlayedForCorps` and onCardPlayedByEveryPlayer will be
called, and onCorpCardPlayed will probably get phased out.

Which means the top part of this document will get an update.
