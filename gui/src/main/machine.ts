import { createMachine, assign, EventObject, send } from "xstate";
import { createActorContext } from "@xstate/react";

import {
  StartTracking,
  StopTracking,
  SelectGame,
} from "@@/go/core/CommandHandler";
import type { model } from "@@/go/models";
import { EventsEmit } from "@@/runtime/runtime";

export type MatchEvent = {
  matchHistory: model.TrackingState;
} & EventObject;

type CFNMachineContext = {
  playerInfo: model.User;
  game?: "sfv" | "sf6";
  restore: boolean;
  isTracking: boolean;
  matchHistory: model.TrackingState;
};

export const cfnMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMBmA7AtAFwE4ENkBrMXAOgBsB7fCAS3SgGIG7s78K6AvSAbQAMAXUSgADlVhs6VdKJAAPRJgBMZAMzqVA9QEYVAVgA0IAJ7KDa9QHZdAgJw2DAX2cm0WPIRLk6ECmBMsACuAEYAtmyCIkggElLssvJKCNZkACz2AGwOTibmqQZkWenpBnqGru4YOATEpGRexAzMsNhUYtHy8dJJsSn66RnWKlkGWYb5iDlk4yUCEy5uIB613g1NRC1M4fjYyAAWAAoU+Kb8wt2SvXL9iAAcZPp2jtbGZogq97pkKurpTlcy3QVAgcHkq02pCuCRkt1AKUwBgEGi0On07wKqgEVlsAnu1nU9xUX3SOiqKxqUPI1FoLRhN2SiB+93s9wBbymCEwul0QwJL0By0hdR8ZD8AQZiXhimZ9mK9j5C0mHwQdg0+IMryW1U8oo2ovpsR60qZCHUv3uBl04xVBV06nlmRUugJOspevW5GCYgge0gAFk9ocABJ0NpUXAFcTXU13BB-NTs+4ExzaN72Tmq3RvMj2ewutl-G34+xA5xAA */
    id: "cfn-tracker",
    predictableActionArguments: true,

    context: <CFNMachineContext>{
      restore: false,
      isTracking: false,
      matchHistory: <model.TrackingState>{
        cfn: "",
        wins: 0,
        losses: 0,
        winRate: 0,
        lpGain: 0,
        lp: 0,
        opponent: "",
        opponentCharacter: "",
        opponentLeague: "",
        opponentLP: 0,
        totalLosses: 0,
        totalMatches: 0,
        totalWins: 0,
        result: false,
        winStreak: 0,
        timestamp: "",
        date: "",
      },
    },
    initial: "gamePicking",
    states: {
      gamePicking: {
        on: {
          submit: {
            actions: assign({
              game: (_, e: any) => e.game,
            }),
            target: "loading",
          },
        },
      },
      loading: {
        entry: "initializeGame",
        on: {
          initialized: "idle",
          error: "gamePicking"
        },
      },
      idle: {
        on: {
          submit: {
            actions: assign({
              playerInfo: (_, e: any) => e.playerInfo,
              restore: (_, e: any) => e.restore,
            }),
            target: "loadingCfn",
          },
        },
      },
      loadingCfn: {
        entry: "startTracking",
        on: {
          startedTracking: "tracking",
          error: "idle"
        },
      },
      tracking: {
        on: {
          stoppedTracking: "idle",
          matchPlayed: {
            actions: assign({
              matchHistory: (_, e: any) => e.matchHistory,
            }),
          },
        },

        exit: "stopTracking",
      },
    },
  },
  {
    actions: {
      initializeGame: ({ game, error }) => {
        SelectGame(game).catch(err => {
          error = err;
          console.error(err);
          EventsEmit("error", err)
        });
      },
      startTracking: ({ playerInfo, restore, isTracking }) => {
        if (playerInfo && !isTracking) {
          StartTracking(playerInfo.code, restore).then(() => {
            isTracking = true;
          }).catch(err => {
            console.error(err);
            EventsEmit("error", err)
          });
        }
      },
      stopTracking: ({ playerInfo, isTracking }) => {
        if (!isTracking) return;
        StopTracking().then((_) => {
          isTracking = false;
        }).catch(err => {
          console.error(err);
          EventsEmit("error", err)
        });
      },
    },
  },
);

export const CFNMachineContext = createActorContext(cfnMachine);
