export enum Phase {
  SETUP = 'setup', // Still getting ready to set up the game. Not all players are ready to start.
  ACTION = 'action',
  END = 'end', // specifically, *game* end.
  PRODUCTION = 'production',
  RESEARCH = 'research',
  INITIALDRAFTING = 'initial_drafting',
  DRAFTING = 'drafting',
  PRELUDES = 'preludes',
  SOLAR = 'solar',
  INTERGENERATION = 'intergeneration',
}
