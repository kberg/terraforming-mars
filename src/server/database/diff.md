# Testing the database diff

1. Take any two versions of a game, it doesn't matter, but typically version n (`current`) and n-1 (`prior`).
2. Run compare(current, prior) to create `operation`, type `Operation`.
3. stringify `operation` and then reparse it, since diffs have to be saved.
4. Apply `operation` to `prior`, which should generate something equivalent to `current`.
5. fast-deep-equals seems good but I'm not convinced my own deep-equal couldn't be made to fit
   my limited cases.
